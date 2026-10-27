import { createHash, createHmac } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

/**
 * Generated plates.
 *
 * Order:
 * 1. Cloudflare R2 when R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 *    R2_BUCKET, and R2_PUBLIC_URL are set.
 * 2. Supabase Storage when NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.
 * 3. Local `.data/summons` for development. Do not rely on it on Vercel.
 */

export type StoredMedia = {
  storagePath: string;
  url: string;
};

function r2Ready() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.R2_PUBLIC_URL,
  );
}

function supabaseReady() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function sha256(data: string | Uint8Array<ArrayBufferLike>) {
  return createHash("sha256").update(data).digest("hex");
}

function hmac(key: Buffer | string, data: string) {
  return createHmac("sha256", key).update(data, "utf8").digest();
}

async function putR2(key: string, body: Uint8Array<ArrayBufferLike>, contentType: string) {
  const account = process.env.R2_ACCOUNT_ID!;
  const accessKey = process.env.R2_ACCESS_KEY_ID!;
  const secret = process.env.R2_SECRET_ACCESS_KEY!;
  const bucket = process.env.R2_BUCKET!;
  const host = `${account}.r2.cloudflarestorage.com`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256(body);
  const canonicalUri = `/${bucket}/${key.split("/").map(encodeURIComponent).join("/")}`;
  const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = ["PUT", canonicalUri, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, sha256(canonicalRequest)].join("\n");
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${secret}`, dateStamp), "auto"), "s3"), "aws4_request");
  const signature = createHmac("sha256", signingKey).update(stringToSign, "utf8").digest("hex");
  const response = await fetch(`https://${host}${canonicalUri}`, {
    method: "PUT",
    headers: {
      "content-type": contentType,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      authorization: `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
    body: Buffer.from(body),
  });

  if (!response.ok) {
    throw new Error(`R2 upload failed (${response.status}).`);
  }

  return `${process.env.R2_PUBLIC_URL!.replace(/\/$/, "")}/${key}`;
}

async function putSupabase(key: string, body: Uint8Array<ArrayBufferLike>, contentType: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "summons";
  const bytes = Uint8Array.from(body);
  const { error } = await supabase.storage.from(bucket).upload(key, bytes, {
    contentType,
    upsert: true,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(bucket).getPublicUrl(key);
  return data.publicUrl;
}

export async function saveMedia(
  id: string,
  body: Uint8Array<ArrayBufferLike>,
  contentType: string,
): Promise<StoredMedia> {
  const extension = contentType.includes("svg") ? "svg" : "png";
  const key = `${id}.${extension}`;

  if (r2Ready()) {
    const url = await putR2(key, body, contentType);
    return { storagePath: url, url };
  }

  if (supabaseReady()) {
    const url = await putSupabase(key, body, contentType);
    return { storagePath: url, url };
  }

  const directory = path.join(process.cwd(), ".data", "summons");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, id), body);
  return { storagePath: `local:${id}`, url: `/api/summons/${id}` };
}

export function localMediaPath(id: string) {
  const root = path.resolve(process.cwd(), ".data", "summons");
  const file = path.resolve(root, id);
  if (!file.startsWith(root + path.sep) && file !== root) return null;
  return file;
}

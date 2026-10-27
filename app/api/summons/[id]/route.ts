import { readFile } from "node:fs/promises";
import { getMemoryStore } from "@/lib/memory/store";
import { readSession } from "@/lib/solana/session";
import { localMediaPath } from "@/lib/storage/media";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  const store = await getMemoryStore();
  const record = await store.getSummon(id);
  if (!record) return new Response("Not found", { status: 404 });

  if (!record.isPublic) {
    const session = await readSession();
    if (session?.wallet !== record.wallet) return new Response("Not found", { status: 404 });
  }

  if (record.storagePath.startsWith("http")) {
    return Response.redirect(record.storagePath, 307);
  }

  const file = localMediaPath(id);
  if (!file) return new Response("Not found", { status: 404 });

  try {
    const bytes = await readFile(file);
    return new Response(bytes, {
      headers: {
        "content-type": record.mediaType,
        "cache-control": "private, max-age=3600",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

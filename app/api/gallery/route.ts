import { getMemoryStore } from "@/lib/memory/store";
import { shortAddress } from "@/lib/utils";
import { jsonError } from "@/lib/rate-limit";

function mediaUrl(id: string, storagePath: string) {
  return storagePath.startsWith("http") ? storagePath : `/api/summons/${id}`;
}

export async function GET() {
  try {
    const store = await getMemoryStore();
    const records = await store.listPublicSummons(48);
    return Response.json({
      items: records.map((record) => ({
        id: record.id,
        prompt: record.prompt,
        url: mediaUrl(record.id, record.storagePath),
        walletPreview: shortAddress(record.wallet),
        createdAt: record.createdAt,
      })),
    });
  } catch (error) {
    console.error("[gallery]", error);
    return jsonError("The gallery could not be opened.", 500);
  }
}

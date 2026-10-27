import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { desc, eq, sql } from "drizzle-orm";
import type { MemoryStore, Profile, StoredMessage, SummonRecord } from "@/lib/memory/types";

/**
 * Companion memory.
 *
 * DATABASE_URL  -> Drizzle on Postgres (Supabase pooler works).
 * otherwise     -> a JSON file. Locally that is .data/memory.json.
 *                  On Netlify the function disk is read-only, so the file
 *                  lives in /tmp and lasts only for that instance.
 *                  Set DATABASE_URL before you expect memory to survive a deploy.
 */

type FileShape = {
  profiles: Record<string, Profile>;
  messages: StoredMessage[];
  summons: SummonRecord[];
};

const FILE = path.join(process.env.NETLIFY ? "/tmp" : path.join(process.cwd(), ".data"), "memory.json");

let queue: Promise<unknown> = Promise.resolve();

function locked<T>(task: () => Promise<T>) {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readFileStore(): Promise<FileShape> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as FileShape;
    return {
      profiles: parsed.profiles ?? {},
      messages: parsed.messages ?? [],
      summons: parsed.summons ?? [],
    };
  } catch {
    return { profiles: {}, messages: [], summons: [] };
  }
}

async function writeFileStore(data: FileShape) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(data), "utf8");
}

function blankProfile(wallet: string, now: string): Profile {
  return {
    wallet,
    summary: "",
    summonCount: 0,
    imagesToday: 0,
    imagesDay: "",
    createdAt: now,
    lastSeenAt: now,
  };
}

function createFileStore(): MemoryStore {
  return {
    async touchProfile(wallet) {
      return locked(async () => {
        const data = await readFileStore();
        const now = new Date().toISOString();
        const profile = data.profiles[wallet] ?? blankProfile(wallet, now);
        profile.lastSeenAt = now;
        data.profiles[wallet] = profile;
        await writeFileStore(data);
        return profile;
      });
    },
    async listMessages(wallet, limit) {
      const data = await readFileStore();
      return data.messages.filter((message) => message.wallet === wallet).slice(-limit);
    },
    async appendMessage(message) {
      await locked(async () => {
        const data = await readFileStore();
        data.messages.push(message);
        await writeFileStore(data);
      });
    },
    async appendMemory(wallet, note) {
      return locked(async () => {
        const data = await readFileStore();
        const now = new Date().toISOString();
        const profile = data.profiles[wallet] ?? blankProfile(wallet, now);
        const next = [profile.summary, note.trim()].filter(Boolean).join("\n");
        profile.summary = next.slice(-1800);
        profile.lastSeenAt = now;
        data.profiles[wallet] = profile;
        await writeFileStore(data);
        return profile.summary;
      });
    },
    async incrementSummon(wallet) {
      return locked(async () => {
        const data = await readFileStore();
        const now = new Date().toISOString();
        const profile = data.profiles[wallet] ?? blankProfile(wallet, now);
        profile.summonCount += 1;
        profile.lastSeenAt = now;
        data.profiles[wallet] = profile;
        await writeFileStore(data);
        return profile;
      });
    },
    async consumeImageCredit(wallet, day) {
      return locked(async () => {
        const data = await readFileStore();
        const now = new Date().toISOString();
        const profile = data.profiles[wallet] ?? blankProfile(wallet, now);
        profile.imagesToday = profile.imagesDay === day ? profile.imagesToday + 1 : 1;
        profile.imagesDay = day;
        profile.lastSeenAt = now;
        data.profiles[wallet] = profile;
        await writeFileStore(data);
        return profile;
      });
    },
    async addSummon(record) {
      await locked(async () => {
        const data = await readFileStore();
        data.summons.push(record);
        await writeFileStore(data);
      });
    },
    async listPublicSummons(limit) {
      const data = await readFileStore();
      return data.summons
        .filter((record) => record.isPublic)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
        .slice(0, limit);
    },
    async getSummon(id) {
      const data = await readFileStore();
      return data.summons.find((record) => record.id === id) ?? null;
    },
  };
}

function iso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapProfile(row: {
  wallet: string;
  summary: string;
  summonCount: number;
  imagesToday: number;
  imagesDay: string;
  createdAt: Date;
  lastSeenAt: Date;
}): Profile {
  return {
    wallet: row.wallet,
    summary: row.summary,
    summonCount: row.summonCount,
    imagesToday: row.imagesToday,
    imagesDay: row.imagesDay,
    createdAt: iso(row.createdAt),
    lastSeenAt: iso(row.lastSeenAt),
  };
}

async function createSqlStore(): Promise<MemoryStore> {
  const { db } = await import("@/lib/db/client");
  const { messages, profiles, summons } = await import("@/lib/db/schema");

  async function touchProfile(wallet: string) {
    const now = new Date();
    const [row] = await db
      .insert(profiles)
      .values({ wallet, lastSeenAt: now })
      .onConflictDoUpdate({
        target: profiles.wallet,
        set: { lastSeenAt: now },
      })
      .returning();
    return mapProfile(row);
  }

  return {
    touchProfile,
    async listMessages(wallet, limit) {
      const rows = await db
        .select()
        .from(messages)
        .where(eq(messages.wallet, wallet))
        .orderBy(desc(messages.createdAt))
        .limit(limit);
      return rows.reverse().map((row) => ({
        id: row.id,
        wallet: row.wallet,
        role: row.role === "assistant" ? "assistant" : "user",
        content: row.content,
        createdAt: iso(row.createdAt),
      }));
    },
    async appendMessage(message) {
      await db.insert(messages).values({
        id: message.id,
        wallet: message.wallet,
        role: message.role,
        content: message.content,
        createdAt: new Date(message.createdAt),
      });
    },
    async appendMemory(wallet, note) {
      const profile = await touchProfile(wallet);
      const summary = [profile.summary, note.trim()].filter(Boolean).join("\n").slice(-1800);
      await db.update(profiles).set({ summary, lastSeenAt: new Date() }).where(eq(profiles.wallet, wallet));
      return summary;
    },
    async incrementSummon(wallet) {
      await touchProfile(wallet);
      const [row] = await db
        .update(profiles)
        .set({
          summonCount: sql`${profiles.summonCount} + 1`,
          lastSeenAt: new Date(),
        })
        .where(eq(profiles.wallet, wallet))
        .returning();
      return mapProfile(row);
    },
    async consumeImageCredit(wallet, day) {
      const profile = await touchProfile(wallet);
      const imagesToday = profile.imagesDay === day ? profile.imagesToday + 1 : 1;
      const [row] = await db
        .update(profiles)
        .set({ imagesToday, imagesDay: day, lastSeenAt: new Date() })
        .where(eq(profiles.wallet, wallet))
        .returning();
      return mapProfile(row);
    },
    async addSummon(record) {
      await db.insert(summons).values({
        id: record.id,
        wallet: record.wallet,
        prompt: record.prompt,
        mediaType: record.mediaType,
        storagePath: record.storagePath,
        isPublic: record.isPublic,
        createdAt: new Date(record.createdAt),
      });
    },
    async listPublicSummons(limit) {
      const rows = await db
        .select()
        .from(summons)
        .where(eq(summons.isPublic, true))
        .orderBy(desc(summons.createdAt))
        .limit(limit);
      return rows.map((row) => ({
        id: row.id,
        wallet: row.wallet,
        prompt: row.prompt,
        mediaType: row.mediaType,
        storagePath: row.storagePath,
        isPublic: row.isPublic,
        createdAt: iso(row.createdAt),
      }));
    },
    async getSummon(id) {
      const [row] = await db.select().from(summons).where(eq(summons.id, id)).limit(1);
      if (!row) return null;
      return {
        id: row.id,
        wallet: row.wallet,
        prompt: row.prompt,
        mediaType: row.mediaType,
        storagePath: row.storagePath,
        isPublic: row.isPublic,
        createdAt: iso(row.createdAt),
      };
    },
  };
}

let storePromise: Promise<MemoryStore> | null = null;

export function getMemoryStore() {
  if (!storePromise) {
    storePromise = process.env.DATABASE_URL ? createSqlStore() : Promise.resolve(createFileStore());
  }
  return storePromise;
}

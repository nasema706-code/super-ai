import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

/**
 * Supabase transaction pooler (port 6543) needs prepared statements off.
 * This module is imported only after DATABASE_URL is confirmed.
 */

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set.");
}

const client = postgres(url, { prepare: false, max: 1 });

export const db = drizzle(client, { schema });

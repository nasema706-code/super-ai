import { boolean, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Drizzle schema for Supabase Postgres.
 * Apply supabase/migrations/0001_init.sql, or run `npm run db:push`
 * with DATABASE_URL set to the pooler connection string.
 */

export const profiles = pgTable("profiles", {
  wallet: text("wallet").primaryKey(),
  summary: text("summary").notNull().default(""),
  summonCount: integer("summon_count").notNull().default(0),
  imagesToday: integer("images_today").notNull().default(0),
  imagesDay: text("images_day").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
});

export const messages = pgTable(
  "messages",
  {
    id: text("id").primaryKey(),
    wallet: text("wallet")
      .notNull()
      .references(() => profiles.wallet, { onDelete: "cascade" }),
    role: text("role").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("messages_wallet_created_idx").on(table.wallet, table.createdAt)],
);

export const summons = pgTable(
  "summons",
  {
    id: text("id").primaryKey(),
    wallet: text("wallet").notNull(),
    prompt: text("prompt").notNull(),
    mediaType: text("media_type").notNull(),
    storagePath: text("storage_path").notNull(),
    isPublic: boolean("is_public").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("summons_public_created_idx").on(table.isPublic, table.createdAt)],
);

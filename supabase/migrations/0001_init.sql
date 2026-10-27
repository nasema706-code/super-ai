-- Super AI companion memory.
-- Matches lib/db/schema.ts. Run in the Supabase SQL editor, or use `npm run db:push`.

create table if not exists profiles (
  wallet text primary key,
  summary text not null default '',
  summon_count integer not null default 0,
  images_today integer not null default 0,
  images_day text not null default '',
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists messages (
  id text primary key,
  wallet text not null references profiles (wallet) on delete cascade,
  role text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_wallet_created_idx on messages (wallet, created_at);

create table if not exists summons (
  id text primary key,
  wallet text not null,
  prompt text not null,
  media_type text not null,
  storage_path text not null,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists summons_public_created_idx on summons (is_public, created_at);

-- Public gallery reads. The app uses the service role for writes.
alter table profiles enable row level security;
alter table messages enable row level security;
alter table summons enable row level security;

create policy "public summons are readable"
  on summons for select
  using (is_public = true);

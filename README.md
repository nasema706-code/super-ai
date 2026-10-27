# Super AI

A cinematic site for Super AI / Summoning Intelligence. Holders connect a Solana wallet, sign a binding, and summon a companion that remembers them.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 and a small shadcn-style UI kit
- React Three Fiber scene: metallic figure, particles, ring, city, light trails
- Solana wallet adapter (Phantom, Solflare)
- Vercel AI SDK streaming chat with tools
- Drizzle schema for Supabase Postgres, with a local JSON store when no database is set

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Node 22 or newer is required by the AI SDK.

## What works without keys

- The landing page and the 3D summoning scene
- Wallet connect, signature binding, SOL balance, and token balance when a mint is set
- Companion memory in `.data/memory.json`
- The forge, which strikes an SVG studio plate until an image key is added

Chat needs one of `XAI_API_KEY`, `ANTHROPIC_API_KEY`, or `OPENAI_API_KEY`.

## Environment

Copy `.env.example` to `.env.local`.

| Variable | Role |
| --- | --- |
| `AI_PROVIDER` | `xai`, `anthropic`, or `openai`. Empty uses the first key that exists. |
| `AI_MODEL` | Optional model id override. |
| `XAI_API_KEY` / `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` | Language model credentials. xAI and OpenAI can also draw images. |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | RPC used by the browser wallet panel and the server tools. |
| `NEXT_PUBLIC_TOKEN_MINT` | Project token. Empty means the gate stays open at the Bound tier. |
| `SESSION_SECRET` | HMAC secret for the binding cookie. Required in production. |
| `DATABASE_URL` | Supabase Postgres pooler URL. Enables Drizzle memory. |
| `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | Supabase Storage for plates. |
| `R2_*` | Optional Cloudflare R2. All five values are required. |

Apply `supabase/migrations/0001_init.sql` in the Supabase SQL editor, or run `npm run db:push` with `DATABASE_URL` set.

## Pages

- `/` cinematic landing
- `/summon` wallet, rite, streaming chat, forge
- `/tokenomics` lore, draft supply, holder tiers, roadmap
- `/gallery` public plates

## Integration points

- `components/scene/summon-world.tsx` — replace the primitive figure with a glTF when you have one
- `lib/ai/provider.ts` — model selection
- `lib/ai/personality.ts` and `lib/ai/tools.ts` — voice, memory, balances, market, oracle
- `lib/memory/store.ts` — JSON file or Postgres
- `lib/storage/media.ts` — local disk, Supabase Storage, or R2
- `lib/protocol.ts` — supply copy and token-gate thresholds
- `app/api/chat/route.ts` — streaming route. Rate limits are in-memory; use Redis before a public launch

## Wallet note

Phantom and Solflare are wired directly. The meta package `@solana/wallet-adapter-wallets` is not installed because one of its dependencies fails to install on Windows. Add another adapter beside them in `components/providers/app-providers.tsx`.

## Deploy

Deploy on Vercel. Set the same environment variables in the project. Set `DATABASE_URL` and either Supabase Storage or R2 if plates and memory should survive across instances. The local `.data` folder is only for development.

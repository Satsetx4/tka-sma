# Current State

Updated: 2026-10-07

## Repository

- Repo: `Satsetx4/tka-sma`
- Canonical branch: `master`
- Vite prototype archive: `archive/vite-prototype-2026-10-07`
- Deployment project: Vercel `tka-sma`
- Database: Neon PostgreSQL is provisioned
- Media storage: Vercel Blob store `tka-sma-assets`, region `sin1`

## Existing prototype

The current app is a client-only prototype using:

- Vite
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide

It currently contains:

- 60 static questions:
  - Math: 20
  - Bahasa Indonesia: 20
  - Bahasa Inggris: 20
- practice mode
- full simulation mode
- timer
- question navigation
- flagging
- result page
- explanations
- local attempt history
- dark/light mode

Data flow today:

```
React/Vite
   ↓
static QUESTIONS[]
   ↓
localStorage
```

## What is missing for production

- server layer
- Neon persistence
- authentication
- role/authorization
- CMS
- official taxonomy
- rich-content question schema
- safe answer validation
- media workflow
- diagnostic testing
- mastery engine
- mistake engine
- recommendation/adaptive engine
- production tryout persistence
- multi-device progress
- content review workflow

## Important interpretation

The current Vite app is a **UX/reference prototype**, not the final production architecture.

It must be preserved conceptually where useful, but the production foundation will migrate to Next.js because the platform requires secure server-side database/storage access, auth, CMS, scoring, and durable learning data.

## Current next task

**HG1 APPROVED 2026-10-08.** Merged ke master: PR#5 (P1.1–P1.5 taksonomi DRAFT + P2.1–P2.2 + P2.8/P2.11/P3.1–P3.2), PR#6 (P2.5–P2.7 schema + P2.12–P2.13 Blob), PR#7 (P3.3–P3.13 renderer), PR#8 (P4.1–P4.18 CMS V1), PR#9 (P2.9–P2.10 auth), PR#10 (P1.6 FROZEN v1 + P2.3–P2.4 taxonomy tables + seed 1/5/10/32). Live tka-sma-umber.vercel.app 200 (deploy success).

**STOP — 1 kebutuhan manusia tersisa:** kredensial uji-live: DATABASE_URL + BETTER_AUTH_SECRET/URL + BLOB_READ_WRITE_TOKEN (tempel ke .env.local lokal, jangan commit). Setelah ada: db:migrate + seed taksonomi + seed admin + uji login/CMS beneran → HG2.

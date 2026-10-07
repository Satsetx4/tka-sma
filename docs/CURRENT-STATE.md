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

Start with **P0.1** in `docs/EXECUTION-BACKLOG.md`.

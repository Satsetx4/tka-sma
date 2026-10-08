# Current State

Updated: 2026-10-09

## Repository

- Repo: `Satsetx4/tka-sma`
- Canonical branch: `master`
- Vite prototype archive: `archive/vite-prototype-2026-10-07`
- Deployment project: Vercel `tka-sma`
- Database: Neon PostgreSQL `neon-rose-ladder` (provisioned via Vercel integration 2026-10-09, connected to project `tka-sma`; env `DATABASE_URL` + `POSTGRES_*` auto-set Production/Preview/Development)
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

## Uji-live HG2 — SELESAI 2026-10-09

**Dulu STOP nunggu kredensial, sekarang TERUJI-live semua** (via CLI, repo `C:/Users/USER/tka-sma`, branch master):

- Koneksi: `SELECT 1 → ok: 1` (P2.1 TERUJI-live; status lama BELUM TERUJI resmi dicabut).
- Migrasi: `npm run db:migrate` sukses — 0000 (12 tabel konten/belajar/tryout) + 0001 (auth) + 0002 (taxonomy) applied ke Neon.
- Seed taksonomi: **1 subject + 5 topics + 10 subtopics + 32 skills** (MATH active; `SELECT COUNT(*)` terverifikasi di DB, bukan cuma log CLI).
- Seed admin: `testka@admin.com` role admin + profil + credential (users=1, user_profiles=1, accounts credential=1). **Segera ganti password awal setelah login pertama.**
- Env Vercel project `tka-sma`: `DATABASE_URL` (auto Neon) + `BLOB_READ_WRITE_TOKEN` (sudah ada) + `BETTER_AUTH_SECRET`/`BETTER_AUTH_URL`/`BETTER_AUTH_TRUSTED_ORIGINS` (ditambah 2026-10-09, sensitive). `.env.local` lokal lengkap (di-ignore git, tidak di-commit).
- Uji login live https://tka-sma-umber.vercel.app: `POST /api/auth/sign-in/email` → **200** role admin; cookie `tka-sma.session_*` terpasang; baris `sessions` di Neon bertambah (DB-backed terbukti).
- Uji CMS live dengan sesi: `GET /api/cms/questions` → **200 `{questions:[]}`**; `GET /admin` → **200**. Tanpa sesi: API → 401 pesan login, `/admin` → 307 ke `/login` (guard fail-closed terbukti).
- Uji Blob live: PUT png kecil → URL publik **200** → DEL → **404** (round-trip TERUJI-live; P2.12 resmi lolos).
- Deploy ulang production READY (alias tka-sma-umber + tka-sma-sekawan). `npm test` lokal 58/58 pass.

**Next: minta review/approval owner untuk HG2** (taksonomi + platform soal + CMS). Setelah APPROVED → Fase 5 konten Math.

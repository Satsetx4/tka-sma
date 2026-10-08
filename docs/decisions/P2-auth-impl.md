# Implementasi Auth — P2.9/P2.10

Tanggal: 2026-10-08 · Status: diimplementasi, **TERUJI-live 2026-10-09**
(migrasi auth applied ke Neon, seed admin live, login/CMS live lolos —
lihat bukti di bawah; status lama BELUM-live resmi dicabut).

Keputusan induk: `docs/decisions/P2-auth-decision.md` (Opsi B — Better Auth +
sesi DB-backed Neon via adapter Drizzle). Versi terkunci: `better-auth@1.7.7`,
`@better-auth/drizzle-adapter@1.7.7` (sudah terinstal sebelum task ini).

## Yang mendarat

| Area | File |
|---|---|
| Skema auth | `src/server/db/schema.ts` (blok P2.9/P2.10: `user_role`, `users`+kolom `role`, `sessions`, `accounts`, `verifications`, `user_profiles`; terdaftar di `schema`) |
| Migrasi offline | `drizzle/0001_auth.sql` (+ `meta/0001_snapshot.json`, jurnal; generate via `drizzle-kit generate` dengan DATABASE_URL dummy — TIDAK menyentuh DB) |
| Instance auth | `src/server/auth/auth.ts` (server-only: email+password, `disableSignUp: true`, sesi 7 hari + sliding `updateAge` 1 hari, cookie prefix `tka-sma`, plugin `admin({defaultRole:"student"})` + `nextCookies()` terakhir; singleton MALAS via `getAuth()` agar `next build` hijau tanpa DB/secret) |
| Aturan murni | `src/server/auth/roles.ts` (tanpa I/O/DB/Next — bisa dites `node --test`: `BelumLogin` 401, `PeranDitolak` 403, `normalkanSesi`, `putuskanAkses`) |
| Guard kontrak CMS | `src/server/auth/guard.ts` (`getSession` / `requireRole` / `requireLogin`; modul `@/server/auth/guard`) |
| Adapter CMS | `src/features/cms/guard-adapter.ts` (disederhanakan → re-export statis via path relatif — Turbopack/Next hanya membaca `paths` dari `tsconfig.json` root, jadi alias `@` hanya untuk tsc; `GuardBelumTersedia` dipertahankan sbg kelas, tak lagi dilempar) |
| Alias `@` | `tsconfig.app.json` (`baseUrl: "."`, `paths: {"@/*": ["./src/*"]}`) |
| Route handler | `src/app/api/auth/[...all]/route.ts` (`toNextJsHandler(getAuth())`, dibuat malas per-request + 503 JSON rapi bila env belum lengkap; file baru di luar daftar kepemilikan — WAJIB ada agar Better Auth berfungsi, tak ada di daftar larangan) |
| Middleware | `middleware.ts` (`/admin/*` → redirect `/login?next=…` bila anonim; `/api/cms/*` → 401 JSON; matcher hanya dua prefix itu; rute publik `/`, `/preview-soal`, `/login` tak tersentuh) |
| Halaman | `src/app/login/page.tsx` (server action, pesan generik anti-enumerasi, `next` divalidasi anti open-redirect), `src/app/unauthorized/page.tsx` (403) |
| Seed admin | `scripts/seed-admin.ts` (env: `ADMIN_EMAIL`/`ADMIN_PASSWORD` min 8/`ADMIN_NAME`; idempoten: naikkan ke admin bila email sudah ada) |
| Tes | `tests/auth-guard.test.ts` (11 kasus ≥ syarat 6) |

Catatan edge: middleware edge-safe (cek cookie `tka-sma.session_token` +
varian `__Secure-`/legacy sebagai sinyal kasar; otorisasi peran TETAP di
layout/route server). Cookie httpOnly+secure ikut bawaan Better Auth
(`useSecureCookies` aktif di produksi).

## Bukti gerbang (CLI tanpa DB — exit 0 semua)

- `npm run typecheck` (`tsc -b`) — exit 0
- `npm run lint` (`oxlint`) — exit 0
- `npm test` (`node --test tests/`) — 51 pass (11 auth-guard + 40 eksisting)
- `npm run build` (`next build`) — exit 0
- `curl dev`: `GET /api/cms/questions` tanpa cookie → **401** (bukan 503 lagi);
  `GET /admin` tanpa cookie → **redirect 307 ke /login?next=/admin**
  (bukan lagi halaman penjelasan "guard belum tersedia")

## Status: TERUJI-live 2026-10-09

Uji-live selesai via CLI + curl ke https://tka-sma-umber.vercel.app
(setelah deploy ulang production READY agar env baru kebaca):

- Seed: `ADMIN_EMAIL=testka@admin.com ADMIN_PASSWORD=min-8 (disimpan aman,
  tidak ditulis di docs) node --conditions=react-server scripts/seed-admin.ts`
  → admin dibuat role=admin; verifikasi DB: users=1 (email_verified, role
  admin), user_profiles=1, accounts credential=1. **Segera ganti password
  awal setelah login pertama.**
- Login: `POST /api/auth/sign-in/email` → **200** (user role admin);
  cookie `tka-sma.session_*` terpasang; baris `sessions` di Neon bertambah
  (DB-backed terbukti, bukan cookie statis).
- CMS dengan sesi: `GET /api/cms/questions` → **200 `{questions:[]}`**;
  `GET /admin` → **200**.
- Tanpa sesi (guard fail-closed): API → 401 pesan login; `/admin` → 307
  ke `/login?next=/admin`.
- Env Vercel: `BETTER_AUTH_SECRET` (sensitive, 3 env) +
  `BETTER_AUTH_URL=https://companion-pending.vercel.app` (production) +
  `BETTER_AUTH_TRUSTED_ORIGINS` (production,preview) ditambah via CLI.

## Cara uji-live (butuh DATABASE_URL + secret)

1. Export env (jangan commit):
   `export DATABASE_URL=... BETTER_AUTH_SECRET=$(openssl rand -base64 32) BETTER_AUTH_URL=http://localhost:3000`
2. `npm run db:migrate` (menerapkan `drizzle/0001_auth.sql` ke Neon)
3. Seed: `ADMIN_EMAIL=admin@contoh.id ADMIN_PASSWORD='ganti-min-8' ADMIN_NAME='Admin' npx tsx scripts/seed-admin.ts`
4. `npm run dev`, buka `/login`, masuk sebagai admin → `/admin` tampil daftar soal (bukan blokir);
   `GET /api/cms/questions` dengan cookie → `200 {questions:[…]}`.
5. Uji peran: buat user editor (via admin panel), login → `/admin` bisa baca/tulis
   draf tapi approve → 403; reviewer lain approve → tercatat `reviewed_by`.
6. Uji sesi: hapus baris `sessions` di DB → request berikut → 401 (DB-backed terbukti).

## Cara seed (ringkas)

`ADMIN_EMAIL=… ADMIN_PASSWORD='min-8-karakter' [ADMIN_NAME=…] npx tsx scripts/seed-admin.ts`
Idempoten — aman dijalankan ulang (email sudah ada → pastikan role admin).

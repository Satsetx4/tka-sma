# P2 — Fondasi Neon + Drizzle (P2.1 connection, P2.2 Drizzle)

Status: fondasi SELESAI, koneksi **TERUJI-live 2026-10-09** (`SELECT 1 → ok: 1` ke Neon `neon-rose-ladder` via `DATABASE_URL` dari Vercel integration; status lama BELUM TERUJI resmi dicabut).
Branch: `feat/p1-p2-kickoff`. Rujukan: `docs/ARCHITECTURE.md` (Database access,
Security), `docs/DATABASE.md` (Migration discipline).

## 1. Sumber connection string

- Kode hanya membaca `process.env["DATABASE_URL"]` di server
  (`src/server/db/client.ts`, `drizzle.config.ts`). Tidak ada nilai secret di repo.
- Lokal: salin `.env.example` → `.env.local` (di-gitignore via `*.local`), isi
  nilai asli, export ke shell sebelum `next dev` / skrip `db:*`.
- Produksi: dashboard Vercel → tim sekawan → project **tka-sma** → Settings →
  Environment Variables → `DATABASE_URL` (TERISI OTOMATIS 2026-10-09 via
  integration Neon `neon-rose-ladder`; `env ls` menunjukkan `DATABASE_URL` +
  `POSTGRES_*` di Production/Preview/Development).
- **Dulu blocker (2026-10-08):** Vercel CLI di mesin ini LOGOUT
  (`vercel whoami` → `Error: Not authorized`; scope `sekawan` tidak terbaca).
  Login ulang butuh approve owner di browser — di luar wewenang task ini, dan
  instruksi eksplisit melarang `vercel login` mandiri. Akibatnya nilai
  `DATABASE_URL` asli belum diperoleh; tidak ada `.env.local` dibuat, tidak ada
  secret yang ditulis ke mana pun. Owner cukup menempelkan connection string
  Neon (dari Vercel env / Neon dashboard) ke `.env.local` lalu §4 bisa dijalankan.
- **RESOLUSI 2026-10-09:** owner approve terms Neon di browser → CLI
  `vercel integration add neon` sukses (resource `neon-rose-ladder`,
  connected ke `tka-sma`) → `env pull` mengisi `.env.local` lokal
  (di-ignore git). Blocker resmi DICABUT.

## 2. Yang dipasang

- Deps: `drizzle-orm@0.45.3`, `@neondatabase/serverless@1.2.0` (dependencies),
  `drizzle-kit@0.31.11`, `server-only` (lihat `package.json` — dicatat di sini
  sesuai kepemilikan file task).
- Skrip npm: `db:generate` (drizzle-kit generate), `db:migrate`
  (drizzle-kit migrate), `db:studio` (drizzle-kit studio, opsional/rIngan).
- `drizzle.config.ts` — schema `./src/server/db/schema.ts`, out `./drizzle`,
  dialect `postgresql`; throw eksplisit bila `DATABASE_URL` tidak di-set
  (tanpa secret yang di-commit).
- `src/server/db/client.ts` — client Neon HTTP + instance Drizzle, SERVER-ONLY:
  `import "server-only"` (build error bila masuk client bundle) + guard runtime
  `typeof window !== "undefined"` → throw. `getDb()` (singleton lazy),
  `checkConnection()` (`SELECT 1`, tanpa menyentuh tabel).
- `src/server/db/schema.ts` — SENGAJA KOSONG; tabel P2.3+ didefinisikan di
  task P2.3 lalu didaftarkan ulang dari file ini.
- `src/server/db/migrate.ts` — `runMigrations()` programmatic (konteks
  deploy/server); CLI tetap via `npm run db:migrate`.
- `src/server/db/index.ts` — barrel; satu-satunya jalan masuk aplikasi ke DB.
  Hanya boleh diimpor dari route handler / server action / server component.
- `.env.example` — placeholder `DATABASE_URL` saja, tanpa nilai asli.
- `drizzle/README.md` — disiplin migrasi; direktori SENGAJA KOSONG sampai P2.3.

## 3. Workflow generate / apply

```sh
cp .env.example .env.local   # isi DATABASE_URL asli (sekali saja, jangan commit)
export $(cat .env.local | xargs)   # atau: set -a; source .env.local; set +a (bash)
# setelah ubah src/server/db/schema.ts (mulai P2.3):
npm run db:generate   # hasilkan drizzle/NNNN_*.sql berversi, review diff-nya
npm run db:migrate     # apply ke Neon (dev); produksi via migrasi yang sama
npm run db:studio      # opsional: inspeksi visual
```

Seed taxonomy terpisah dari sample/demo (docs/DATABASE.md) — dikerjakan di
task seed, bukan di fondasi ini.

## 4. Verifikasi server-only (bukti grep)

```sh
grep -rn "NEXT_PUBLIC" src/server/db/            # harus: kosong
grep -rn "server/db" src/app src/components src/features  # harus: kosong (tak ada import client)
grep -rn "DATABASE_URL" .next/static/            # harus: kosong (tak bocor ke client bundle)
```

Hasil saat verifikasi P2.2: ketiga grep KOSONG (lihat §5 bukti perintah).
`DATABASE_URL` hanya muncul di string server-side (`.next/server`, pesan error
dan `process.env` read) — itu wajar dan tetap server-only.

## 5. Bukti perintah (exit code)

| Perintah | Hasil |
|---|---|
| `npm run typecheck` (`tsc -b`) | exit 0 |
| `npm run lint` (`oxlint`) | exit 0 |
| `npm test` (`node --test tests/*.test.ts`) | exit 0 |
| `npm run build` (`next build`) | exit 0 |

## 6. Status koneksi: TERUJI-live 2026-10-09

Dulu `checkConnection()` (`SELECT 1`) belum bisa dijalankan lolos karena tidak ada
`DATABASE_URL` asli (blocker §1). Setelah resolusi §1, hasil nyata:
`SELECT 1 → ok: 1` terhadap Neon `neon-rose-ladder`. Guard kegagalan tanpa env
tetap terbukti (pesan `[db] DATABASE_URL is not set`), dan sekarang koneksi
yang teruji juga terbukti — status resmi menjadi TERUJI.

## 7. Secret yang DICEK tidak bocor

- `grep -rn "DATABASE_URL" src/` → hanya `src/server/db/*` + komentar config
  (server-side semua); tidak ada di `src/app`, `src/components`, `src/features`.
- Tidak ada variabel `NEXT_PUBLIC_*` yang membawa secret (grep `NEXT_PUBLIC`
  di `src/server/db/` kosong; tidak ada `NEXT_PUBLIC_DATABASE_URL` di mana pun).
- Tidak ada file `.env.local` / nilai koneksi yang ditulis ke repo
  (`git status` tidak menunjukkan file secret).

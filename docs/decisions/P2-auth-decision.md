# Keputusan Auth — P2.8

Tanggal: 2026-10-08 · Status: diputuskan, belum diimplementasi (implementasi di P2.9/P2.10).

## Batasan dari ARCHITECTURE.md

- Auth harus minimal-kompleksitas dan server-compatible (Next.js App Router).
- Jangan tambah dependensi SaaS terpisah kecuali justified.
- Secret hanya di server; proteksi rute + otorisasi role ditegakkan server.
- Role V1: `student`, `editor`, `reviewer`, `admin` (editor vs reviewer dipisah sesuai CONTENT-POLICY.md).

## Opsi yang dibandingkan

### Opsi A — Auth.js v5 (NextAuth)

- Plus: populer, dokumentasi luas, banyak provider OAuth, middleware-ready.
- Minus untuk kasus ini: login utama memakai email+password internal (bukan OAuth
  sosial), sehingga butuh Credentials provider + adapter sesi database di Neon
  yang dirangkai manual; session refresh/sliding-expiration dan integrasi
  Drizzle butuh boilerplate lebih banyak dibanding opsi B. Update v5 masih
  bergerak dan contoh Credentials+DB-session lebih sedikit.

### Opsi B — Better Auth (+ adapter Drizzle di Neon)

- Plus: email+password bawaan, sesi database-backed di tabel Neon via adapter
  Drizzle resmi (selaras stack: Neon + Drizzle), session refresh/sliding
  expiration bawaan (`updateAge`), helper `getSession` untuk middleware dan
  server component, plugin admin/role untuk `student/editor/reviewer/admin`,
  tanpa SaaS eksternal — semua data sesi di Neon milik sendiri.
- Minus: library lebih muda dari Auth.js; API antar-minor perlu dikunci versi.

### Opsi C — Sesi kustom + tabel sesi Neon (hand-rolled)

- Plus: kontrol penuh, nol dependensi auth, cocok bila kebutuhan sangat spesifik.
- Minus: wajib merangkai sendiri hashing password (Web Crypto/scrypt), token
  opaque + rotasi, proteksi CSRF, session refresh, dan pengujian keamanan —
  biaya maintenance permanen untuk kebutuhan yang sebenarnya standar (login
  form + cookie sesi + role). Melanggar prinsip minimal-kompleksitas.

### Ditolak tanpa perbandingan penuh

Clerk / Supabase Auth / Auth0: SaaS auth terpisah (biaya + data sesi di luar
Neon) tanpa kebutuhan yang menjustifikasinya (tidak butuh social-login
kompleks, MFA enterprise, atau user-base eksternal di V1).

## Tabel kriteria

| Kriteria | A: Auth.js v5 | B: Better Auth | C: Kustom |
|---|---|---|---|
| Kompleksitas implementasi | Sedang-tinggi (Credentials+DB session manual) | Rendah (adapter Drizzle + email/password bawaan) | Tinggi di awal + maintenance permanen |
| Session refresh | Manual/parsial | Bawaan (sliding expiration) | Hand-rolled |
| Proteksi rute (middleware + server) | Bisa | Bisa (helper sesi resmi) | Hand-rolled |
| Role student/editor/reviewer/admin | Manual via callback/claim | Kolom role + plugin admin | Manual |
| Tanpa SaaS berbayar | Ya | Ya | Ya |
| Kesesuaian stack (Neon+Drizzle) | Adapter komunitas/parsial | Adapter resmi | N/A (SQL langsung) |

## KEPUTUSAN

**Pilih Opsi B — Better Auth dengan sesi database-backed di Neon via adapter
Drizzle.** Alasan: kompleksitas terendah untuk kebutuhan nyata (login internal
+ cookie sesi + role), session refresh bawaan, proteksi rute terdukung resmi,
dan nol SaaS baru — seluruh identitas/sesi tetap di Neon. Opsi A kalah karena
boilerplate Credentials+DB-session lebih besar tanpa keuntungan fitur untuk
V1; opsi C ditolak karena biaya keamanan/maintenance hand-rolled tidak
sebanding dengan kebutuhan standar.

## Langkah implementasi (P2.9/P2.10 — TANPA implementasi di task ini)

P2.9 (server + skema):

1. Tambah dependensi `better-auth` (kunci versi minor).
2. Skema Drizzle: `users` (kolom `role`: student/editor/reviewer/admin),
   tabel sesi/akun sesuai kebutuhan adapter; migrasi versioned.
3. Instance auth server-only + helper `getSession()` / `requireRole(...)}`.
4. Middleware: rute publik (latihan/tryout siswa login?) vs `/cms/*` wajib
   sesi + role editor/reviewer/admin; API CMS cek role per-action.
5. Seed admin awal via skrip server (bukan di client).

P2.10 (login + UX):

1. Halaman login/logout server action (email+password), pesan error aman
   (tanpa enumerasi user).
2. Penegakan editor≠reviewer di alur publish (reviewer approval tercatat
   `reviewed_by`, sesuai publish gate P3.2).
3. Uji: login/logout, sesi kedaluwarsa + refresh, akses CMS tanpa role
   ditolak, jawaban benar tak bocor ke payload sesi aktif.

## Risiko & mitigasi

- API Better Auth berubah antar-minor → kunci versi + catat di docs.
- Jika kebutuhan SSO enterprise muncul di fase lanjut → evaluasi ulang via
  decision doc baru (bukan refactor diam-diam).

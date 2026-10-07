# TKA SMA — Latihan & Simulasi

> **Untuk coding/research agent:** mulai dari [AGENTS.md](./AGENTS.md), lalu baca [docs/CURRENT-STATE.md](./docs/CURRENT-STATE.md) dan [docs/EXECUTION-BACKLOG.md](./docs/EXECUTION-BACKLOG.md). Task pertama saat ini adalah **P0.1**. Jangan melompat fase tanpa dependency terpenuhi.

## Production direction

Prototype Vite saat ini adalah referensi UX. Arsitektur production akan dimigrasikan bertahap ke Next.js sesuai [Master Plan](./docs/MASTER-PLAN.md). Snapshot prototype dipertahankan di branch `archive/vite-prototype-2026-10-07`.

Cockpit ujian presisi buat latihan Tes Kemampuan Akademik SMA kelas 12. Tanpa login, nilai ke-track di HP.

**Live:** https://tka-sma-sekawan.vercel.app

## Isi
- **Latihan per mapel** — 20 soal/mapel, kunci + pembahasan langsung tiap jawab
- **Simulasi Full TKA** — 60 soal campur 3 mapel, countdown 90:00, peta nomor, tandai ragu-ragu, waktu habis auto kumpul
- **Hasil** — skor count-up, bedah per mapel, pembahasan filter Semua/Salah, tombol Ulangi/Beranda (anti nyasar)
- **Riwayat** — 50 percobaan terakhir tersimpan di HP (localStorage)
- **3 mapel wajib x 20 soal:** Matematika, Bahasa Indonesia, Bahasa Inggris (60 soal + pembahasan, kunci A–E seimbang 12-12-12-12-12)

## Stack
- Vite + React 19 + TypeScript, Tailwind CSS v4, framer-motion, lucide-react
- HP-first (max-w-md), dark elegant + toggle terang, spring 300/30, tap 0.97

## Jalanin lokal
```bash
npm install
npm run dev   # http://localhost:5173 (buka IP LAN di HP)
npm run build # output dist/
```

## Deploy
```bash
vercel deploy --prod --yes .
```

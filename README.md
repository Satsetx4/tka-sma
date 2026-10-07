# Golden Starter: Web App Boilerplate untuk Ard

Boilerplate resmi dan starter kit siap pakai yang dioptimalkan untuk alur kerja **Vibe Coding** dengan standar:
- **Mobile-First Paradigm:** Didesain dari layar HP (360–420px) dengan target sentuh jempol (minimal 44x44px).
- **Living & Tactile UI:** Respons taktil pegas alami (`framer-motion`), border tipis elegan, dan anti-dead-flat.
- **Navigasi Anti-Tersesat:** Header dengan tombol kembali eksplisit, navigasi bawah 1-tap Home, dan proteksi layar buntu.
- **Inline Data Bars:** Batang perbandingan anggaran otomatis beranimasi in-view saat digulir.

---

## Tech Stack
- **Framework:** Vite + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animasi:** `framer-motion`
- **Ikon:** `lucide-react`
- **Utility:** `clsx` + `tailwind-merge`

---

## Komponen Siap Pakai (`src/components/`)
1. `layout/MobileContainer.tsx` — Wrapper layout mobile-first yang rapi di layar ponsel dan desktop.
2. `navigation/AppHeader.tsx` — Header konsisten dengan tombol kembali `< Kembali` dan judul layar.
3. `navigation/MobileBottomNav.tsx` — Navigasi bawah dengan fluid pill slider (`layoutId`) dan akses 1-tap Home.
4. `ui/TapButton.tsx` — Tombol taktil membal saat disentuh (`scale: 0.97`) dengan berbagai varian warna.
5. `ui/LivingCard.tsx` — Kartu visual dengan border 1px, subtle elevation, dan opsi frosted glass.
6. `ui/InlineDataBar.tsx` — Batang data mini untuk perbandingan rasio/anggaran dengan animasi scroll in-view.
7. `ui/ScrollProgress.tsx` — Indikator kedalaman scroll di puncak layar.

---

## Cara Menjalankan Dev Server
```bash
# Di terminal Windows PowerShell
npm.cmd run dev
```
*Vite sudah dikonfigurasi dengan mode `--host` sehingga link IP lokal (misal: `http://192.168.x.x:5173`) dapat langsung dibuka di browser HP-mu.*

---

## Cara Menduplikasi untuk Proyek Baru (5 Detik)
Kapan pun kamu ingin membuat web app baru, cukup katakan kepada AI:
> *"Duplikasi golden-starter menjadi proyek [nama-aplikasi] dan mulai dari Lean PRD."*

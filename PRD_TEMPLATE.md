# 1-Page Lean PRD: [Nama Web App]

> **Prinsip Utama:** Mobile-First • Living & Tactile UI • Navigasi Anti-Tersesat  
> **Pembuat / Vibe Coder:** Ard  
> **Status:** Draft / Approved  

---

## 1. Masalah & Target Pengguna
- **Target Pengguna:** Siapa yang menggunakan web app ini? (misal: pekerja lepas, mahasiswa, individu yang mengelola anggaran bulanan).
- **Masalah Utama:** Masalah apa yang diselesaikan? (1–2 kalimat konkret).
- **Solusi Singkat:** Bagaimana web app ini menyelesaikannya secara cepat di layar ponsel.

---

## 2. Alur Layar Ponsel & Navigasi (Mobile Screen Flow)
Petakan perjalanan pengguna langkah demi langkah beserta cara kembali:
- **Layar 1 (Beranda / Dashboard):**
  - Elemen utama yang dilihat pertama kali.
  - Aksi utama (tombol CTA primer).
- **Layar 2 (Sub-Menu / Detail / Form Input):**
  - Konten spesifik atau form pengisian.
  - **Jalan Kembali:** Tombol `< Kembali` di `AppHeader` pojok kiri atas menuju Layar 1.
- **Layar 3 (Aksi Selesai / Konfirmasi):**
  - Umpan balik sukses + tombol *"Kembali ke Dashboard"* (Anti dead-end).

---

## 3. Batasan Fitur Inti (MVP Scope)
*Batasi hanya 3–4 fitur kunci agar aplikasi cepat jadi dan bisa langsung dicoba di HP!*
- [ ] **Fitur 1 (Must-Have):** [Deskripsi fitur inti]
- [ ] **Fitur 2 (Must-Have):** [Deskripsi fitur inti]
- [ ] **Fitur 3 (Must-Have):** [Deskripsi fitur inti]
- [ ] *Nice-to-Have (Fase 2):* [Fitur tambahan yang ditunda setelah MVP stabil]

---

## 4. Struktur Data Sederhana (Entities)
Data apa saja yang dikelola oleh aplikasi:
- **Entitas A:** `id`, `title`, `amount`, `date`, `category`
- **Entitas B:** ...

---

## 5. Checklist Desain & Vibe UI
- [ ] **Mobile-First:** Tata letak diuji di lebar 360px – 420px; tap targets minimal 44x44px.
- [ ] **Living & Tactile UI:** Tombol menggunakan `TapButton` (membal saat ditekan); kartu menggunakan `LivingCard` (border tipis, soft elevation).
- [ ] **Visual Data:** Data perbandingan/anggaran disajikan dengan `InlineDataBar` (animasi in-view saat di-scroll).
- [ ] **Navigasi Anti-Tersesat:** `AppHeader` dengan tombol `Back` di sub-layar; `MobileBottomNav` 1-tap ke Home; tidak ada layar buntu.

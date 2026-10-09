# KANBAN — TKA SMA (mulai Fase 5, HG2 APPROVED 2026-10-09)

Cara baca: tiap kartu = 1 GitHub Issue. Status kartu = label `status:*`.
Ubah status cukup ganti label di Issue — papan ini cerminannya.

Kolom: `backlog` (antrean) → `todo` (siap) → `in-progress` (dikerjakan) →
`review` (nunggu review/QA) → `done` (selesai).

Milestone: **Fase 5 — Konten Math Awal** (GitHub milestone #1).

Aturan main:
1. Satu kartu dikerjakan sampai review, baru ambil kartu berikut (kecuali P5.2–P5.5 boleh paralel setelah P5.1 selesai karena dependensi sama).
2. Kartu selesai = acceptance di badan Issue terpenuhi + `typecheck/lint/test/build` hijau.
3. Review AKADEMIK manusia (isi/kunci soal) wajib sebelum status soal jadi PUBLISHED — ini syarat tiap kartu P5, bukan opsional (`docs/CONTENT-POLICY.md`).
4. Soal harus orisinal internal — dilarang copy bank soal bimbel/kompetitor.
5. Setelah P5.6 selesai → HG3 (loop belajar murid). Setelah HG3 → Fase 10–11.

## Papan Fase 5 (update: 2026-10-09)

| Status | Kartu |
|---|---|
| todo | #12 [P5.1] 10 soal teks/math pertama |
| backlog | #13 [P5.2] 5 soal tabel/chart |
| backlog | #14 [P5.3] 5 soal grafik fungsi |
| backlog | #15 [P5.4] 5 soal gambar/diagram |
| backlog | #16 [P5.5] contoh pilihan ganda kompleks |
| backlog | #17 [P5.6] 30–50 soal direview |

Urutan: P5.1 dulu (fondasi + pola seed/CMS). P5.2–P5.5 setelah P5.1. P5.6 terakhir (kumpulkan + dokumentasi cakupan).

## Arsip selesai

- Fase 0–4: PR #2–#11 (semua MERGED). Uji-live HG2: Neon `neon-rose-ladder`, migrate 0000+0001+0002, seed 1/5/10/32, admin live, login/CMS/Blob TERUJI-live 2026-10-09 (lihat `docs/CURRENT-STATE.md`).

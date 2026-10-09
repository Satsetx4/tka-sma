# KANBAN — TKA SMA (mulai Fase 5, HG2 APPROVED 2026-10-09)

Cara baca: tiap kartu = 1 GitHub Issue. Status kartu = label `status:*`.
Ubah status cukup ganti label di Issue — papan ini cerminannya.

Kolom: `backlog` (antrean) → `todo` (siap) → `in-progress` (dikerjakan) →
`review` (nunggu review/QA) → `done` (selesai).

Milestone: **Fase 5 — Konten Math Awal** (GitHub milestone #1, SELESAI 100%)
+**Fase 6 — Practice Engine** (GitHub milestone #2, BERJALAN).

Aturan main:
1. Satu kartu dikerjakan sampai review, baru ambil kartu berikut (kecuali P5.2–P5.5 boleh paralel setelah P5.1 selesai karena dependensi sama).
2. Kartu selesai = acceptance di badan Issue terpenuhi + `typecheck/lint/test/build` hijau.
3. Review AKADEMIK manusia (isi/kunci soal) wajib sebelum status soal jadi PUBLISHED — ini syarat tiap kartu P5, bukan opsional (`docs/CONTENT-POLICY.md`).
4. Soal harus orisinal internal — dilarang copy bank soal bimbel/kompetitor.
5. Setelah P5.6 selesai → HG3 (loop belajar murid). Setelah HG3 → Fase 10–11.

## Papan Fase 5 (update: 2026-10-09, sinkron dgn label GitHub)

| Status | Kartu |
|---|---|
| done | #12 [P5.1] 10 soal teks/math pertama (PR #20, review PASS) |
| done | #13 [P5.2] 5 soal tabel/chart (PR #21, review PASS) |
| done | #14 [P5.3] 5 soal grafik fungsi (PR #22, review PASS) |
| done | #15 [P5.4] 5 soal gambar/diagram (PR #23, review PASS) |
| done | #16 [P5.5] contoh pilihan ganda kompleks (PR #25, review PASS) |
| done | #17 [P5.6] 30 soal + cakupan (PR #26, review PASS) |

## Papan Fase 6 (update: 2026-10-09)

| Status | Kartu |
|---|---|
| in-progress | #27 [P6.1] service sesi latihan |
| backlog | #28 [P6.2] payload soal aman (tanpa kunci) |
| backlog | #29 [P6.3] endpoint submit jawaban |
| backlog | #30 [P6.4] validasi jawaban server-side |
| backlog | #31 [P6.5] simpan attempt |
| backlog | #32 [P6.6] pembahasan setelah jawab |
| backlog | #33 [P6.7] pemilih Quick Practice |
| backlog | #34 [P6.8] pemilih Topic Practice |
| backlog | #35 [P6.9] UI progres sesi |
| backlog | #36 [P6.10] UI hasil sesi |
| backlog | #37 [P6.11] resume sesi terputus |
| backlog | #38 [P6.12] tes end-to-end practice |

Urutan: P6.1 dulu (fondasi sesi). P6.2→P6.6 rantai API (berurutan). P6.7–P6.11 UI paralel setelah API jadi. P6.12 terakhir (end-to-end).

Live DB (Neon, terverifikasi 2026-10-09): **25/25 approved**, semua `single_choice`.
Live web: home 200, `/admin` 307 → `/login` (guard bener).

Urutan: P5.1 dulu (fondasi + pola seed/CMS). P5.2–P5.5 setelah P5.1. P5.6 terakhir (kumpulkan + dokumentasi cakupan).

## Arsip selesai

- Fase 0–4: PR #2–#11 (semua MERGED). Uji-live HG2: Neon `neon-rose-ladder`, migrate 0000+0001+0002, seed 1/5/10/32, admin live, login/CMS/Blob TERUJI-live 2026-10-09 (lihat `docs/CURRENT-STATE.md`).

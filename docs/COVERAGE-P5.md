# Cakupan Bank Soal — Fase 5 (30 soal, update: 2026-10-09)

Hasil audit live Neon setelah P5.6. Syarat P5.6: semua tipe renderer
kepakai + cakupan taksonomi/difficulty terdokumentasi — DUA-DUANYA LOLOS.

## Ringkasan

- Total: **30 soal**, status approved 30/30.
- Tipe: single_choice 28, multiple_choice 2 (MCMA + kategori, P5.5).

## Cakupan topic (5/5 terisi — tidak ada yang bolong)

| Topic | Soal | Kode |
|---|---|---|
| MATH.BIL (Bilangan) | 3 | MAT-BIL-001, 002, 003 |
| MATH.ALG (Aljabar) | 10 | MAT-ALG-001..010 |
| MATH.GEO (Geometri & Pengukuran) | 7 | MAT-GEO-001..007 |
| MATH.TRG (Trigonometri) | 3 | MAT-TRG-001, 002, 003 (ditambah P5.6) |
| MATH.DAT (Data & Peluang) | 7 | MAT-DAT-001..007 |

## Cakupan difficulty

| Level | Soal |
|---|---|
| easy | 11 |
| medium | 17 |
| hard | 2 (MAT-ALG-009 komposisi, MAT-TRG-003 elevasi) |

Catatan: hard baru 2 — rebalance difficulty penuh di Fase 11
(P11.4 coverage/difficulty rebalance). Untuk Fase 5 (30–50 awal) cukup.

## Cakupan renderer (6/6 kepakai)

| Tipe blok | Contoh soal |
|---|---|
| text | semua soal |
| math | P5.1 (10 soal) |
| table | MAT-DAT-002/003/006, MAT-GEO-007 |
| chart | MAT-DAT-004 (bar), MAT-DAT-005 (pie) |
| function_graph | MAT-ALG-006..010 |
| image | MAT-GEO-003..006, MAT-DAT-007 (SVG internal di Blob) |

## Skill terisi (22/32)

Terisi: BIL.REAL.* (4/4 penuh), ALG.LIN.SPL, ALG.FUNC.* (4/4 penuh),
ALG.SEQ.* (3/3 penuh), GEO.OBJ.ANGLE, GEO.OBJ.PYTHAG, GEO.MEAS.AREA,
GEO.MEAS.VOLUME, TRG.RATIO.* (3/3 penuh), DAT.DATA.* (4/4 penuh),
DAT.PROB.SINGLE.

Belum terisi (10): ALG.LIN.SPTL, ALG.LIN.PROGLIN, GEO.OBJ.RELATE,
GEO.OBJ.SIMILAR, GEO.TRANS.* (2), GEO.MEAS.DIST, DAT.DATA.COUNT,
DAT.PROB.COMPOUND. → Diisi bertahap di Fase 11 (target 100+ soal).

## Review akademik

Semua 30 soal PASS review owner per kartu (#12–#16 + P5.6):
P5.1 (10) + P5.2 (5) + P5.3 (5) + P5.4 (5) + P5.5 (2) + P5.6 (3).
Publish massal ke `published` diputuskan di HG3/Fase 6 (butuh engine
practice dulu agar soal published langsung bisa dipakai).

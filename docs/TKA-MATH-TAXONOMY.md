# Taksonomi TKA Matematika SMA — v1 (FROZEN)

> **Status: FROZEN v1** — Dibekukan 2026-10-08 atas persetujuan akademik owner (chat: "PASS").
> Berlaku sebagai implementation source untuk P2.3/P2.4 dan seterusnya.
> Perubahan setelah ini wajib lewat revisi taksonomi (bukan edit diam-diam).
> Tanggal penyusunan: 2026-10-08.
> Cakupan: TKA Matematika **wajib** jenjang SMA/MA/sederajat dan SMK/MAK.
> Matematika Tingkat Lanjut (mata uji pilihan) **di luar cakupan** file ini.

Dokumen ini hanya berisi **struktur kompetensi** (topics → subtopics → skills).
Tidak memuat butir soal atau contoh soal dari sumber mana pun.

---

## 1. Referensi resmi (P1.1)

| ID | Dokumen / Laman | URL | Tanggal publikasi / update | Peran |
|----|-----------------|-----|----------------------------|-------|
| R1 | Peraturan Kepala BSKAP Kemendikdasmen No. 045/H/AN/2025 tentang Kerangka Asesmen TKA Jenjang SMA/MA/sederajat dan SMK/MAK (beserta lampiran) | Otoritatif: `https://pusmendik.kemendikdasmen.go.id/regulasi` (dokumen "Perkaban No. 045/H/AN/2025"); salinan yang dibaca: `https://www.bintangpelajar.com/wp-content/uploads/2025/08/Salinan-Perkaban-Nomor-45-Tahun-2025-tentang-Kerangka-Asesmen-TKA_SMA_MA-dan-SMK_MAK.pdf` | Ditetapkan di Jakarta, **14 Juli 2025** | Sumber primer: definisi, 5 elemen muatan, matriks asesmen (cakupan + batasan), 3 level kognitif + proses berpikir, bentuk soal |
| R2 | Laman Kerangka Asesmen Pusmendik — Mata Pelajaran Wajib SMA (matriks TKA Matematika) | `https://pusmendik.kemendikdasmen.go.id/tka/tka/view/mata-pelajaran-wajib/sma` | **Tidak tercantum di laman; diakses 2026-10-08** | Konfirmasi matriks 5 elemen + batasan per sub-elemen |
| R3 | Peraturan Kepala BSKAP No. 047/H/AN/2025 tentang Kerangka Asesmen TKA Jenjang SD/MI dan SMP/MTs (lampiran) | `https://pusmendik.kemendikdasmen.go.id/pdf/file-178` | Ditetapkan **24 Juli 2025** | Sekunder: konsistensi redaksional level kognitif dan proses berpikir lintas jenjang |
| R4 | Artikel Pusat Informasi Kemendikdasmen, "Belajar Lebih Terarah dengan Kisi-Kisi Resmi TKA dari Pusmendik" | `https://pusatinformasi.rumahpendidikan.kemendikdasmen.go.id/hc/id/articles/52474934733209-Belajar-Lebih-Terarah-dengan-Kisi-Kisi-Resmi-TKA-dari-Pusmendik` | **Tidak tercantum; diakses 2026-10-08** | Sekunder: ringkasan 5 kemampuan matematis dan 5 elemen muatan |

Catatan provenance:

- R1 dibaca melalui salinan PDF di situs pihak ketiga. Sebelum P1.6, reviewer **wajib** mencocokkan ulang dengan dokumen otoritatif di `pusmendik.kemendikdasmen.go.id/regulasi`.
- R2 dan R4 tidak mencantumkan tanggal publikasi/update; tanggal akses dicatat sebagai pengganti.
- Tidak ada soal, contoh soal, atau bank soal dari sumber mana pun yang disalin ke dokumen ini (sesuai `docs/CONTENT-POLICY.md`).

### 1.1 Struktur kompetensi yang diuji (ringkasan R1)

Definisi: TKA Matematika mengukur kemampuan murid dalam memahami fakta, konsep, prinsip, dan prosedur matematika, serta kemampuan menerapkan pengetahuan matematika untuk menyelesaikan masalah (*problem solving*).

Muatan merujuk pada Kurikulum 2013 dan Kurikulum Merdeka, 5 elemen: bilangan; aljabar; geometri dan pengukuran; data dan peluang; trigonometri. Logika matematika diintegrasikan ke dalam elemen-elemen tersebut. Konteks soal: matematika murni maupun keseharian (personal, keluarga, lingkungan lokal/global).

Lima kemampuan matematis yang diukur: (1) pengetahuan matematika, (2) representasi matematis, (3) penalaran dan pembuktian matematis, (4) pemecahan masalah matematis, (5) koneksi matematis.

Tiga level kognitif (berlaku untuk setiap sub-elemen, satu atau beberapa level per butir soal):

- **L1 — Pengetahuan dan Pemahaman (*Knowing and Understanding*):** menghitung; memahami informasi (grafik fungsi, tabel, diagram, infografis, visual lain); mengelompokkan; mengidentifikasi.
- **L2 — Aplikasi (*Applying*):** memodelkan (kontekstual → pernyataan matematika); menerapkan (strategi/operasi pada masalah familier dan rutin); menginterpretasikan (menjelaskan makna situasi/pernyataan/representasi/masalah).
- **L3 — Penalaran (*Reasoning*):** menganalisis; memecahkan masalah (situasi baru / konteks tidak rutin); mengevaluasi; menyimpulkan; melakukan generalisasi; menjustifikasi.

### 1.2 Bentuk soal resmi (R1, Bab II)

- Jenis soal: **soal tunggal** (berdiri sendiri) dan **soal grup** (sekumpulan soal mengacu pada satu stimulus yang sama).
- Bentuk soal (tiga, semuanya objektif): (1) **pilihan ganda sederhana** — satu jawaban benar; (2) **PGK model MCMA** (*multiple choice multiple answers*) — lebih dari satu jawaban benar; (3) **PGK model kategori** — beberapa pernyataan yang masing-masing direspons (mis. benar/salah, sesuai/tidak sesuai).
- Tidak ada bentuk uraian/isian singkat pada kerangka SMA ini. Durasi dan jumlah soal diatur dokumen penyelenggaraan (di luar cakupan taksonomi; tidak dikutip di sini).

---

## 2. Topics (P1.2)

Subject induk: `MATH` — Matematika (status: `active`, sort_order 1).

Pemetaan 1:1 ke 5 elemen muatan resmi R1. Tidak ada elemen resmi yang hilang; tidak ada topic di luar kerangka resmi.

| Code | Nama | Deskripsi | Elemen resmi (R1) | sort_order | status |
|------|------|-----------|-------------------|------------|--------|
| `MATH.BIL` | Bilangan | Bilangan real beserta jenis, sifat, dan operasinya, termasuk bilangan berpangkat. | Bilangan | 1 | draft |
| `MATH.ALG` | Aljabar | Persamaan dan pertidaksamaan linear multivariabel, fungsi, serta barisan dan deret. | Aljabar | 2 | draft |
| `MATH.GEO` | Geometri dan Pengukuran | Objek geometri bangun datar dan bangun ruang, transformasi geometri titik, serta pengukuran (keliling, luas, volume, jarak). | Geometri dan Pengukuran | 3 | draft |
| `MATH.TRG` | Trigonometri | Perbandingan trigonometri (sinus, kosinus, tangen, kotangen, sekan, kosekan). | Trigonometri | 4 | draft |
| `MATH.DAT` | Data dan Peluang | Penyajian dan ukuran data, kaidah pencacahan, serta peluang kejadian tunggal dan majemuk. | Data dan Peluang | 5 | draft |

---

## 3. Subtopics (P1.3)

Pemetaan 1:1 ke 10 sub-elemen matriks R1. Kode subtopic = kode topic + segmen.

| Code | Nama | Parent topic | Cakupan resmi (R1) + batasan | sort_order | status |
|------|------|--------------|------------------------------|------------|--------|
| `MATH.BIL.REAL` | Bilangan Real | `MATH.BIL` | Jenis dan sifat bilangan; operasi (jumlah, kurang, kali, bagi, gabungan) + sifat komutatif, asosiatif, distributif. Batasan: bilangan real termasuk bilangan asli berpangkat bulat atau pecahan. | 1 | draft |
| `MATH.ALG.LIN` | Persamaan dan Pertidaksamaan Linear | `MATH.ALG` | SPL multivariabel; SPtL multivariabel; program linear. Batasan: maksimum 3 variabel. | 1 | draft |
| `MATH.ALG.FUNC` | Fungsi | `MATH.ALG` | Domain, kodomain, range, dan representasi fungsi linear, kuadrat, rasional; invers fungsi; fungsi komposisi. Identifikasi fungsi analitis dan grafis. | 2 | draft |
| `MATH.ALG.SEQ` | Barisan dan Deret | `MATH.ALG` | Barisan dan deret aritmetika; barisan dan deret geometri. Penerapan: pertumbuhan, peluruhan, bunga tunggal, bunga majemuk. | 3 | draft |
| `MATH.GEO.OBJ` | Objek Geometri | `MATH.GEO` | Hubungan dua sudut, dua garis, dua bidang; hubungan objek geometri pada bangun datar dan bangun ruang; kesebangunan/kekongruenan bangun datar; teorema Pythagoras. Batasan: bangun datar = segitiga, segiempat, lingkaran, gabungannya; bangun ruang = beraturan sisi datar dan lengkung. | 1 | draft |
| `MATH.GEO.TRANS` | Transformasi Geometri | `MATH.GEO` | Translasi, refleksi, rotasi, dilatasi, serta komposisinya — **dari titik**. | 2 | draft |
| `MATH.GEO.MEAS` | Pengukuran | `MATH.GEO` | Keliling dan luas bangun datar; volume dan luas permukaan bangun ruang; jarak dua objek geometri (dua titik, dua garis, dua bidang, titik-garis, titik-bidang). | 3 | draft |
| `MATH.TRG.RATIO` | Perbandingan Trigonometri | `MATH.TRG` | Sinus, kosinus, tangen, kotangen, sekan, kosekan. | 1 | draft |
| `MATH.DAT.DATA` | Data | `MATH.DAT` | Penyajian data (diagram batang, garis, lingkaran, grafik, tabel, bentuk visual); ukuran pemusatan dan penyebaran data tunggal dan kelompok; kaidah pencacahan (aturan penjumlahan, perkalian, permutasi, kombinasi). | 1 | draft |
| `MATH.DAT.PROB` | Peluang | `MATH.DAT` | Peluang kejadian tunggal; peluang kejadian majemuk. | 2 | draft |

---

## 4. Skills (P1.4)

Aturan kode: `<SUBTOPIC>.<SLUG>` (stabil, unik, huruf kapital), selaras dengan contoh di `docs/DATABASE.md` (`MATH.ALG.FUNC.QUAD.INTERPRET`).
Kolom *Kompetensi* memakai redaksi resmi R1 ("memahami, mengaplikasikan, dan bernalar …") yang dipersempit ke skill, plus rentang level L1–L3.
Semua skills berstatus `draft`; `sort_order` berlanjut per subtopic.

### 4.1 `MATH.BIL.REAL` — Bilangan Real (4 skills)

| Code | Nama | Deskripsi | Kompetensi | L |
|------|------|-----------|------------|---|
| `MATH.BIL.REAL.IDENTIFY` | Mengidentifikasi jenis dan sifat bilangan | Mengelompokkan bilangan (asli, bulat, rasional, irasional, real) dan mengidentifikasi sifat-sifatnya (komutatif, asosiatif, distributif, unsur identitas/invers). | Memahami (mengidentifikasi, mengelompokkan) serta mengaplikasikan sifat-sifat bilangan real untuk memeriksa kesetaraan dan pengelompokan bilangan. | L1–L2 |
| `MATH.BIL.REAL.OPERATE` | Melakukan operasi bilangan real | Melakukan penjumlahan, pengurangan, perkalian, pembagian, dan operasi gabungannya pada bilangan real, termasuk urutan operasi. | Memahami (menghitung) dan mengaplikasikan (menerapkan) prosedur operasi bilangan real pada permasalahan familier dan rutin. | L1–L2 |
| `MATH.BIL.REAL.POWER` | Menghitung bilangan berpangkat | Menghitung dan menyederhanakan bilangan asli berpangkat bilangan bulat atau pecahan beserta sifat-sifat perpangkatan. | Memahami (menghitung, mengidentifikasi) dan mengaplikasikan (menerapkan) sifat perpangkatan, termasuk pangkat pecahan. | L1–L2 |
| `MATH.BIL.REAL.SOLVE` | Memecahkan masalah bilangan real | Memodelkan permasalahan kontekstual (personal/keluarga/lingkungan) ke pernyataan bilangan real lalu menyelesaikannya, termasuk evaluasi kewajaran solusi. | Mengaplikasikan (memodelkan, menerapkan) dan bernalar (menganalisis, memecahkan masalah, mengevaluasi) terkait bilangan real. | L2–L3 |

### 4.2 `MATH.ALG.LIN` — Persamaan dan Pertidaksamaan Linear (3 skills)

| Code | Nama | Deskripsi | Kompetensi | L |
|------|------|-----------|------------|---|
| `MATH.ALG.LIN.SPL` | Menyelesaikan SPL multivariabel | Menyelesaikan sistem persamaan linear sampai tiga variabel (eliminasi, substitusi, gabungan) serta menafsirkan keberadaan/ketunggalan solusi. | Memahami (mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis, memecahkan masalah) terkait SPL multivariabel (maks. 3 variabel). | L1–L3 |
| `MATH.ALG.LIN.SPTL` | Menyelesaikan SPtL multivariabel | Menyelesaikan sistem pertidaksamaan linear sampai tiga variabel dan menentukan/menafsirkan daerah himpunan penyelesaian. | Memahami (mengidentifikasi, memahami informasi grafik/daerah), mengaplikasikan (menerapkan), dan bernalar (menganalisis) terkait SPtL multivariabel (maks. 3 variabel). | L1–L3 |
| `MATH.ALG.LIN.PROGLIN` | Memodelkan dan menyelesaikan program linear | Memodelkan masalah kontekstual menjadi fungsi tujuan dan kendala linear, menentukan nilai optimum, dan menafsirkan solusi. | Mengaplikasikan (memodelkan, menerapkan) dan bernalar (menganalisis, memecahkan masalah, mengevaluasi, menjustifikasi) terkait program linear (maks. 3 variabel). | L2–L3 |

### 4.3 `MATH.ALG.FUNC` — Fungsi (4 skills)

| Code | Nama | Deskripsi | Kompetensi | L |
|------|------|-----------|------------|---|
| `MATH.ALG.FUNC.IDENTIFY` | Mengidentifikasi domain, kodomain, dan range fungsi | Menentukan domain, kodomain, dan daerah hasil fungsi linear, kuadrat, dan rasional secara analitis maupun grafis. | Memahami (mengidentifikasi, memahami informasi grafik), mengaplikasikan (menerapkan), dan bernalar (menganalisis) terkait domain, kodomain, dan range fungsi linear, kuadrat, rasional. | L1–L3 |
| `MATH.ALG.FUNC.INTERPRET` | Menginterpretasikan representasi fungsi | Membaca dan menjelaskan makna grafik, tabel, dan rumus fungsi linear, kuadrat, dan rasional (titik potong, puncak, kemonotonan, perilaku sederhana di sekitar titik tak terdefinisi). | Memahami (memahami informasi) dan mengaplikasikan (menginterpretasikan) berbagai representasi fungsi secara analitis dan grafis. | L1–L2 |
| `MATH.ALG.FUNC.INVERSE` | Menentukan invers fungsi | Menentukan rumus dan representasi (grafik/tabel) invers fungsi serta syarat keberadaannya (korespondensi satu-satu pada domain yang ditinjau). | Memahami (mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis, menjustifikasi) terkait invers fungsi dan representasinya. | L1–L3 |
| `MATH.ALG.FUNC.COMPOSE` | Menentukan fungsi komposisi | Menentukan rumus, domain, dan representasi fungsi komposisi dua fungsi atau lebih. | Memahami (menghitung, mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis, memecahkan masalah) terkait fungsi komposisi dan representasinya. | L1–L3 |

### 4.4 `MATH.ALG.SEQ` — Barisan dan Deret (3 skills)

| Code | Nama | Deskripsi | Kompetensi | L |
|------|------|-----------|------------|---|
| `MATH.ALG.SEQ.ARITH` | Menyelesaikan barisan dan deret aritmetika | Menentukan suku ke-n, beda, dan jumlah n suku barisan/deret aritmetika serta menggunakannya dalam masalah. | Memahami (menghitung, mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis, memecahkan masalah, generalisasi) terkait barisan dan deret aritmetika. | L1–L3 |
| `MATH.ALG.SEQ.GEO` | Menyelesaikan barisan dan deret geometri | Menentukan suku ke-n, rasio, dan jumlah n suku barisan/deret geometri serta menggunakannya dalam masalah. | Memahami (menghitung, mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis, memecahkan masalah, generalisasi) terkait barisan dan deret geometri. | L1–L3 |
| `MATH.ALG.SEQ.APPLY` | Menerapkan barisan-deret pada pertumbuhan, peluruhan, dan bunga | Memodelkan dan menyelesaikan masalah pertumbuhan, peluruhan, bunga tunggal, dan bunga majemuk dengan barisan/deret yang sesuai. | Mengaplikasikan (memodelkan, menerapkan) dan bernalar (menganalisis, memecahkan masalah, mengevaluasi) terkait penerapan barisan dan deret. | L2–L3 |

### 4.5 `MATH.GEO.OBJ` — Objek Geometri (4 skills)

| Code | Nama | Deskripsi | Kompetensi | L |
|------|------|-----------|------------|---|
| `MATH.GEO.OBJ.ANGLE` | Menganalisis hubungan sudut, garis, dan bidang | Menentukan hubungan dan besar sudut yang dibentuk dua garis/dua bidang, termasuk sudut pada bangun datar yang relevan. | Memahami (mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis) terkait hubungan dua sudut, dua garis, dan dua bidang. | L1–L3 |
| `MATH.GEO.OBJ.RELATE` | Menganalisis hubungan objek geometri bangun datar dan bangun ruang | Mengidentifikasi dan menggunakan hubungan unsur-unsur bangun datar (segitiga, segiempat, lingkaran, gabungannya) dan bangun ruang beraturan (sisi datar dan lengkung). | Memahami (mengidentifikasi, mengelompokkan), mengaplikasikan (menerapkan), dan bernalar (menganalisis) terkait hubungan objek geometri pada bangun datar dan bangun ruang. | L1–L3 |
| `MATH.GEO.OBJ.SIMILAR` | Menyelesaikan kesebangunan dan kekongruenan bangun datar | Menentukan kesebangunan/kekongruenan serta memakai perbandingan sisi-sisi bersesuaian untuk menentukan panjang sisi, keliling, atau luas. | Memahami (mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis, memecahkan masalah) terkait kesebangunan atau kekongruenan bangun datar. | L1–L3 |
| `MATH.GEO.OBJ.PYTHAG` | Menerapkan teorema Pythagoras | Menggunakan teorema Pythagoras untuk menentukan panjang sisi segitiga siku-siku dan jarak/ukuran terkait pada bangun datar maupun bangun ruang. | Memahami (menghitung, mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis, memecahkan masalah) terkait teorema Pythagoras. | L1–L3 |

### 4.6 `MATH.GEO.TRANS` — Transformasi Geometri (2 skills)

| Code | Nama | Deskripsi | Kompetensi | L |
|------|------|-----------|------------|---|
| `MATH.GEO.TRANS.SINGLE` | Menerapkan transformasi tunggal pada titik | Menentukan bayangan titik oleh translasi, refleksi, rotasi, atau dilatasi tunggal beserta sifat-sifatnya. | Memahami (menghitung, mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis) terkait transformasi tunggal dari titik. | L1–L3 |
| `MATH.GEO.TRANS.COMPOSE` | Menerapkan komposisi transformasi pada titik | Menentukan bayangan titik oleh dua transformasi berurutan atau lebih (komposisi translasi, refleksi, rotasi, dilatasi). | Mengaplikasikan (menerapkan) dan bernalar (menganalisis, memecahkan masalah, mengevaluasi) terkait komposisi transformasi geometri dari titik. | L2–L3 |

### 4.7 `MATH.GEO.MEAS` — Pengukuran (3 skills)

| Code | Nama | Deskripsi | Kompetensi | L |
|------|------|-----------|------------|---|
| `MATH.GEO.MEAS.AREA` | Menghitung keliling dan luas bangun datar | Menghitung keliling dan luas segitiga, segiempat, lingkaran, dan gabungannya, termasuk menafsirkan hasil pada masalah kontekstual. | Memahami (menghitung), mengaplikasikan (menerapkan, memodelkan), dan bernalar (menganalisis, memecahkan masalah) terkait keliling dan luas bangun datar. | L1–L3 |
| `MATH.GEO.MEAS.VOLUME` | Menghitung volume dan luas permukaan bangun ruang | Menghitung volume dan luas permukaan bangun ruang beraturan bersisi datar dan lengkung, termasuk menafsirkan hasil pada masalah kontekstual. | Memahami (menghitung), mengaplikasikan (menerapkan, memodelkan), dan bernalar (menganalisis, memecahkan masalah) terkait volume dan luas permukaan bangun ruang. | L1–L3 |
| `MATH.GEO.MEAS.DIST` | Menentukan jarak dua objek geometri | Menentukan jarak dua titik, dua garis, dua bidang, titik-garis, dan titik-bidang, termasuk pada bangun ruang. | Mengaplikasikan (menerapkan, memodelkan) dan bernalar (menganalisis, memecahkan masalah, menjustifikasi) terkait jarak dua objek geometri. | L2–L3 |

### 4.8 `MATH.TRG.RATIO` — Perbandingan Trigonometri (3 skills)

| Code | Nama | Deskripsi | Kompetensi | L |
|------|------|-----------|------------|---|
| `MATH.TRG.RATIO.IDENTIFY` | Mengidentifikasi nilai perbandingan trigonometri | Menentukan nilai sinus, kosinus, tangen, kotangen, sekan, dan kosekan dari segitiga siku-siku atau sudut yang diketahui, termasuk relasi resiprokal. | Memahami (menghitung, mengidentifikasi, mengelompokkan) dan mengaplikasikan (menerapkan) perbandingan trigonometri. | L1–L2 |
| `MATH.TRG.RATIO.ANGLE` | Menggunakan sudut istimewa dan relasi sudut | Menggunakan nilai sudut istimewa serta relasi antar-kuadran/sudut berelasi untuk menentukan nilai perbandingan trigonometri. | Memahami (menghitung, mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis, generalisasi) terkait perbandingan trigonometri. | L1–L3 |
| `MATH.TRG.RATIO.APPLY` | Memecahkan masalah perbandingan trigonometri | Memodelkan dan menyelesaikan masalah (jarak, tinggi, sudut elevasi/depresi, navigasi sederhana) dengan perbandingan trigonometri. | Mengaplikasikan (memodelkan, menerapkan) dan bernalar (menganalisis, memecahkan masalah, mengevaluasi) terkait perbandingan trigonometri. | L2–L3 |

### 4.9 `MATH.DAT.DATA` — Data (4 skills)

| Code | Nama | Deskripsi | Kompetensi | L |
|------|------|-----------|------------|---|
| `MATH.DAT.DATA.PRESENT` | Menyajikan dan membaca data | Menyajikan data dalam diagram batang, garis, lingkaran, grafik, tabel, dan bentuk visual lain, serta membaca/menafsirkan informasi darinya. | Memahami (memahami informasi, mengidentifikasi) dan mengaplikasikan (menerapkan, menginterpretasikan) penyajian data. | L1–L2 |
| `MATH.DAT.DATA.CENTER` | Menentukan ukuran pemusatan data | Menentukan mean, median, dan modus data tunggal dan data kelompok serta memilih ukuran yang tepat untuk suatu konteks. | Memahami (menghitung, mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis, mengevaluasi) terkait ukuran pemusatan data tunggal dan kelompok. | L1–L3 |
| `MATH.DAT.DATA.SPREAD` | Menentukan ukuran penyebaran data | Menentukan jangkauan, kuartil, simpangan, atau ukuran penyebaran data tunggal dan kelompok yang relevan serta menafsirkannya. | Memahami (menghitung), mengaplikasikan (menerapkan), dan bernalar (menganalisis, mengevaluasi, menyimpulkan) terkait ukuran penyebaran data tunggal dan kelompok. | L1–L3 |
| `MATH.DAT.DATA.COUNT` | Menerapkan kaidah pencacahan | Menggunakan aturan penjumlahan, aturan perkalian, permutasi, dan kombinasi untuk menentukan banyak susunan/objek. | Memahami (menghitung, mengelompokkan), mengaplikasikan (menerapkan), dan bernalar (menganalisis, memecahkan masalah) terkait kaidah pencacahan. | L1–L3 |

### 4.10 `MATH.DAT.PROB` — Peluang (2 skills)

| Code | Nama | Deskripsi | Kompetensi | L |
|------|------|-----------|------------|---|
| `MATH.DAT.PROB.SINGLE` | Menentukan peluang kejadian tunggal | Menentukan ruang sampel, titik sampel, dan peluang suatu kejadian tunggal, termasuk frekuensi harapan sederhana. | Memahami (menghitung, mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis) terkait peluang kejadian tunggal. | L1–L3 |
| `MATH.DAT.PROB.COMPOUND` | Menentukan peluang kejadian majemuk | Menentukan peluang gabungan, irisan, kejadian saling lepas/bebas/bersyarat sederhana, dan komplemen suatu kejadian. | Mengaplikasikan (menerapkan) dan bernalar (menganalisis, memecahkan masalah, mengevaluasi) terkait peluang kejadian majemuk. | L2–L3 |

**Rekapitulasi: 5 topics, 10 subtopics, 32 skills.**

---

## 5. Pemetaan cakupan vs kerangka resmi (traceability)

| Sub-elemen resmi (R1) | Subtopic | Skills | Status cakupan |
|---|---|---|---|
| Bilangan Real | `MATH.BIL.REAL` | 4 | Penuh |
| Persamaan dan Pertidaksamaan Linear | `MATH.ALG.LIN` | 3 | Penuh (batas 3 variabel dicatat di deskripsi `SPL`, `SPTL`, `PROGLIN`) |
| Fungsi | `MATH.ALG.FUNC` | 4 | Penuh (linear/kuadrat/rasional + invers + komposisi) |
| Barisan dan Deret | `MATH.ALG.SEQ` | 3 | Penuh (aritmetika + geometri + penerapan bunga/pertumbuhan/peluruhan) |
| Objek Geometri | `MATH.GEO.OBJ` | 4 | Penuh (hubungan sudut/garis/bidang + hubungan objek + kesebangunan + Pythagoras) |
| Transformasi Geometri | `MATH.GEO.TRANS` | 2 | Penuh, dibatasi eksplisit: **hanya dari titik** (bukan garis/bangun — sesuai R1) |
| Pengukuran | `MATH.GEO.MEAS` | 3 | Penuh (keliling/luas + volume/luas permukaan + jarak lima jenis pasangan objek) |
| Perbandingan Trigonometri | `MATH.TRG.RATIO` | 3 | Penuh (6 perbandingan + sudut istimewa/relasi + penerapan) |
| Data | `MATH.DAT.DATA` | 4 | Penuh (penyajian + pemusatan + penyebaran + pencacahan) |
| Peluang | `MATH.DAT.PROB` | 2 | Penuh (tunggal + majemuk) |

Tidak ada sub-elemen resmi tanpa subtopic; tidak ada skill di luar cakupan resmi.

---

## 6. Catatan review gap/overlap (P1.5)

Keputusan deduplikasi yang diambil saat penyusunan:

1. **Jarak dua objek geometri** muncul di matriks R1 pada sub-elemen Objek Geometri (batasan) dan Pengukuran (cakupan). Diputuskan **satu rumah**: `MATH.GEO.MEAS.DIST`. Skill `MATH.GEO.OBJ.PYTHAG` boleh memakai jarak sederhana sebagai konteks, tetapi pengukuran jarak formal milik `MEAS.DIST`. Reviewer akademik perlu mengonfirmasi.
2. **Luas/keliling/volume** hanya di `MATH.GEO.MEAS` (`AREA`, `VOLUME`); skill `SIMILAR` memakai perbandingan keliling/luas hanya sebagai akibat kesebangunan, bukan sebagai skill pengukuran tersendiri.
3. **Grafik fungsi** disebut di L1 resmi (memahami informasi) dan di sub-elemen Fungsi. Kemampuan membaca grafik umum milik `MATH.ALG.FUNC.INTERPRET`; membaca grafik/diagram statistik milik `MATH.DAT.DATA.PRESENT`. Batas keduanya: fungsi matematika vs data statistik.
4. **Permutasi/kombinasi** ditempatkan di `MATH.DAT.DATA.COUNT` mengikuti matriks R1 (kaidah pencacahan di bawah sub-elemen Data), bukan di Peluang. Skill peluang memakai pencacahan hanya sebagai alat bantu.
5. **Invers vs komposisi fungsi** dipisah (`INVERSE`, `COMPOSE`) karena R1 menyebut keduanya eksplisit dan keduanya menghasilkan pola kesalahan murid yang berbeda.
6. **Program linear** dipisah dari `SPTL` (`PROGLIN` tersendiri) karena memuat pemodelan + optimasi, bukan sekadar himpunan penyelesaian.
7. **Trigonometri dibatasi pada perbandingan** — tidak ada skill identitas/grafik/persamaan trigonometri karena R1 wajib hanya memuat perbandingan. Materi trigonometri lanjutan (limit fungsi trigonometri dkk.) milik peta Matematika Tingkat Lanjut, di luar file ini.
8. **Transformasi dibatasi pada titik** — tidak ada skill transformasi garis/bangun datar (milik Matematika Tingkat Lanjut). Perlu perhatian saat penulis soal tergoda memakai bangun.
9. Granularitas 2–4 skills per subtopic dipilih agar pelacakan mastery cukup halus tanpa meledakkan jumlah skill (32 total). Jika 32 dirasa terlalu kasar/halus, ubah hanya dengan persetujuan reviewer (dampak ke seed P2.4).

---

## 7. Yang BUTUH review akademik manusia sebelum P1.6 freeze

1. **Verifikasi R1 terhadap sumber otoritatif** — cocokkan seluruh matriks dan batasan dengan dokumen di `pusmendik.kemendikdasmen.go.id/regulasi` (salinan pihak ketiga dipakai saat penyusunan).
2. **Keputusan rumah jarak** (`MEAS.DIST` vs `OBJ`) — konfirmasi tidak ada duplikasi pengukuran saat seed soal.
3. **Batas Fungsi vs Data pada grafik** (`FUNC.INTERPRET` vs `DATA.PRESENT`) — konfirmasi dengan contoh batas (tanpa menyalin soal resmi).
4. **Kecukupan 32 skills** — apakah terlalu kasar untuk mastery (mis. `OPERATE` mencakup 4 operasi) atau sudah pas untuk beta 200–300 soal.
5. **Redaksi kompetensi tiap skill** — pastikan pemetaan L1/L2/L3 per skill sudah tepat dan konsisten dengan Tabel proses berpikir R1.
6. **Batasan yang harus ditegakkan saat produksi soal**: maks. 3 variabel (aljabar linear); fungsi hanya linear/kuadrat/rasional + invers + komposisi; transformasi hanya dari titik; bangun datar/ruang sesuai batasan R1; bilangan berpangkat sesuai batasan.
7. **Kepastian di luar cakupan**: matriks/vaktor/kalkulus/lingkaran persamaan garis singgung adalah Matematika Tingkat Lanjut — pastikan tidak bocor ke bank wajib.
8. **Status dan sort_order final** — semua entri masih `draft`; penomoran `sort_order` perlu disahkan saat freeze (termasuk apakah skill butuh bobot awal untuk P2.4).

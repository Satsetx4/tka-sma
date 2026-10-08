// P2.4 — Data taksonomi TKA Matematika SMA v1 (FROZEN).
//
// Sumber: docs/TKA-MATH-TAXONOMY.md v1 — file itu FROZEN dan JANGAN diubah;
// salinan di sini adalah turunan seed yang diverifikasi tes terhadap
// jumlah (1/5/10/32), keunikan kode, dan resolusi parent.
//
// File ini MURNI data + logika murni (tanpa server-only, tanpa drizzle,
// tanpa I/O) sehingga bisa diimpor langsung oleh tests/ di bawah plain
// `node --test` (lihat tests/seed-taxonomy.test.ts). Eksekusi DB hidup di
// src/server/db/seed-taxonomy.ts; runner CLI di scripts/seed-taxonomy.ts.

/** Lifecycle taksonomi V1: draft → active → archived. */
export type TaxonomyStatus = "draft" | "active" | "archived";

/** Satu baris subjects. */
export interface SubjectSeed {
  code: string;
  name: string;
  slug: string;
  description: string;
  status: TaxonomyStatus;
  sortOrder: number;
}

/** Satu baris topics. `parentCode` = code subject induk. */
export interface TopicSeed {
  code: string;
  name: string;
  description: string;
  parentCode: string;
  status: TaxonomyStatus;
  sortOrder: number;
}

/** Satu baris subtopics. `parentCode` = code topic induk. */
export interface SubtopicSeed {
  code: string;
  name: string;
  description: string;
  parentCode: string;
  status: TaxonomyStatus;
  sortOrder: number;
}

/** Satu baris skills. `parentCode` = code subtopic induk. `competency`
 * memuat redaksi resmi R1 + rentang level kognitif "[Lx–Ly]". */
export interface SkillSeed {
  code: string;
  name: string;
  description: string;
  competency: string;
  parentCode: string;
  status: TaxonomyStatus;
  sortOrder: number;
}

/** Jumlah baris FROZEN v1: 1 subject, 5 topics, 10 subtopics, 32 skills. */
export const TAXONOMY_COUNTS = {
  subjects: 1,
  topics: 5,
  subtopics: 10,
  skills: 32,
} as const;

// ---------------------------------------------------------------------------
// Subjects (FROZEN §2: subject induk MATH, status active, sort_order 1)
// ---------------------------------------------------------------------------

export const SUBJECTS: SubjectSeed[] = [
  {
    code: "MATH",
    name: "Matematika",
    slug: "matematika",
    description:
      "TKA Matematika wajib jenjang SMA/MA/sederajat dan SMK/MAK (taksonomi v1 FROZEN).",
    status: "active",
    sortOrder: 1,
  },
];

// ---------------------------------------------------------------------------
// Topics (FROZEN §2: 5 elemen muatan resmi R1, semua draft)
// ---------------------------------------------------------------------------

export const TOPICS: TopicSeed[] = [
  {
    code: "MATH.BIL",
    name: "Bilangan",
    description:
      "Bilangan real beserta jenis, sifat, dan operasinya, termasuk bilangan berpangkat.",
    parentCode: "MATH",
    status: "draft",
    sortOrder: 1,
  },
  {
    code: "MATH.ALG",
    name: "Aljabar",
    description:
      "Persamaan dan pertidaksamaan linear multivariabel, fungsi, serta barisan dan deret.",
    parentCode: "MATH",
    status: "draft",
    sortOrder: 2,
  },
  {
    code: "MATH.GEO",
    name: "Geometri dan Pengukuran",
    description:
      "Objek geometri bangun datar dan bangun ruang, transformasi geometri titik, serta pengukuran (keliling, luas, volume, jarak).",
    parentCode: "MATH",
    status: "draft",
    sortOrder: 3,
  },
  {
    code: "MATH.TRG",
    name: "Trigonometri",
    description:
      "Perbandingan trigonometri (sinus, kosinus, tangen, kotangen, sekan, kosekan).",
    parentCode: "MATH",
    status: "draft",
    sortOrder: 4,
  },
  {
    code: "MATH.DAT",
    name: "Data dan Peluang",
    description:
      "Penyajian dan ukuran data, kaidah pencacahan, serta peluang kejadian tunggal dan majemuk.",
    parentCode: "MATH",
    status: "draft",
    sortOrder: 5,
  },
];

// ---------------------------------------------------------------------------
// Subtopics (FROZEN §3: 10 sub-elemen matriks R1, semua draft)
// ---------------------------------------------------------------------------

export const SUBTOPICS: SubtopicSeed[] = [
  {
    code: "MATH.BIL.REAL",
    name: "Bilangan Real",
    description:
      "Jenis dan sifat bilangan; operasi (jumlah, kurang, kali, bagi, gabungan) + sifat komutatif, asosiatif, distributif. Batasan: bilangan real termasuk bilangan asli berpangkat bulat atau pecahan.",
    parentCode: "MATH.BIL",
    status: "draft",
    sortOrder: 1,
  },
  {
    code: "MATH.ALG.LIN",
    name: "Persamaan dan Pertidaksamaan Linear",
    description:
      "SPL multivariabel; SPtL multivariabel; program linear. Batasan: maksimum 3 variabel.",
    parentCode: "MATH.ALG",
    status: "draft",
    sortOrder: 1,
  },
  {
    code: "MATH.ALG.FUNC",
    name: "Fungsi",
    description:
      "Domain, kodomain, range, dan representasi fungsi linear, kuadrat, rasional; invers fungsi; fungsi komposisi. Identifikasi fungsi analitis dan grafis.",
    parentCode: "MATH.ALG",
    status: "draft",
    sortOrder: 2,
  },
  {
    code: "MATH.ALG.SEQ",
    name: "Barisan dan Deret",
    description:
      "Barisan dan deret aritmetika; barisan dan deret geometri. Penerapan: pertumbuhan, peluruhan, bunga tunggal, bunga majemuk.",
    parentCode: "MATH.ALG",
    status: "draft",
    sortOrder: 3,
  },
  {
    code: "MATH.GEO.OBJ",
    name: "Objek Geometri",
    description:
      "Hubungan dua sudut, dua garis, dua bidang; hubungan objek geometri pada bangun datar dan bangun ruang; kesebangunan/kekongruenan bangun datar; teorema Pythagoras. Batasan: bangun datar = segitiga, segiempat, lingkaran, gabungannya; bangun ruang = beraturan sisi datar dan lengkung.",
    parentCode: "MATH.GEO",
    status: "draft",
    sortOrder: 1,
  },
  {
    code: "MATH.GEO.TRANS",
    name: "Transformasi Geometri",
    description:
      "Translasi, refleksi, rotasi, dilatasi, serta komposisinya — dari titik.",
    parentCode: "MATH.GEO",
    status: "draft",
    sortOrder: 2,
  },
  {
    code: "MATH.GEO.MEAS",
    name: "Pengukuran",
    description:
      "Keliling dan luas bangun datar; volume dan luas permukaan bangun ruang; jarak dua objek geometri (dua titik, dua garis, dua bidang, titik-garis, titik-bidang).",
    parentCode: "MATH.GEO",
    status: "draft",
    sortOrder: 3,
  },
  {
    code: "MATH.TRG.RATIO",
    name: "Perbandingan Trigonometri",
    description: "Sinus, kosinus, tangen, kotangen, sekan, kosekan.",
    parentCode: "MATH.TRG",
    status: "draft",
    sortOrder: 1,
  },
  {
    code: "MATH.DAT.DATA",
    name: "Data",
    description:
      "Penyajian data (diagram batang, garis, lingkaran, grafik, tabel, bentuk visual); ukuran pemusatan dan penyebaran data tunggal dan kelompok; kaidah pencacahan (aturan penjumlahan, perkalian, permutasi, kombinasi).",
    parentCode: "MATH.DAT",
    status: "draft",
    sortOrder: 1,
  },
  {
    code: "MATH.DAT.PROB",
    name: "Peluang",
    description: "Peluang kejadian tunggal; peluang kejadian majemuk.",
    parentCode: "MATH.DAT",
    status: "draft",
    sortOrder: 2,
  },
];

// ---------------------------------------------------------------------------
// Skills (FROZEN §4: 32 skills, semua draft; sort_order berlanjut per subtopic)
// ---------------------------------------------------------------------------

export const SKILLS: SkillSeed[] = [
  // 4.1 MATH.BIL.REAL — Bilangan Real (4)
  {
    code: "MATH.BIL.REAL.IDENTIFY",
    name: "Mengidentifikasi jenis dan sifat bilangan",
    description:
      "Mengelompokkan bilangan (asli, bulat, rasional, irasional, real) dan mengidentifikasi sifat-sifatnya (komutatif, asosiatif, distributif, unsur identitas/invers).",
    competency:
      "Memahami (mengidentifikasi, mengelompokkan) serta mengaplikasikan sifat-sifat bilangan real untuk memeriksa kesetaraan dan pengelompokan bilangan. [L1–L2]",
    parentCode: "MATH.BIL.REAL",
    status: "draft",
    sortOrder: 1,
  },
  {
    code: "MATH.BIL.REAL.OPERATE",
    name: "Melakukan operasi bilangan real",
    description:
      "Melakukan penjumlahan, pengurangan, perkalian, pembagian, dan operasi gabungannya pada bilangan real, termasuk urutan operasi.",
    competency:
      "Memahami (menghitung) dan mengaplikasikan (menerapkan) prosedur operasi bilangan real pada permasalahan familier dan rutin. [L1–L2]",
    parentCode: "MATH.BIL.REAL",
    status: "draft",
    sortOrder: 2,
  },
  {
    code: "MATH.BIL.REAL.POWER",
    name: "Menghitung bilangan berpangkat",
    description:
      "Menghitung dan menyederhanakan bilangan asli berpangkat bilangan bulat atau pecahan beserta sifat-sifat perpangkatan.",
    competency:
      "Memahami (menghitung, mengidentifikasi) dan mengaplikasikan (menerapkan) sifat perpangkatan, termasuk pangkat pecahan. [L1–L2]",
    parentCode: "MATH.BIL.REAL",
    status: "draft",
    sortOrder: 3,
  },
  {
    code: "MATH.BIL.REAL.SOLVE",
    name: "Memecahkan masalah bilangan real",
    description:
      "Memodelkan permasalahan kontekstual (personal/keluarga/lingkungan) ke pernyataan bilangan real lalu menyelesaikannya, termasuk evaluasi kewajaran solusi.",
    competency:
      "Mengaplikasikan (memodelkan, menerapkan) dan bernalar (menganalisis, memecahkan masalah, mengevaluasi) terkait bilangan real. [L2–L3]",
    parentCode: "MATH.BIL.REAL",
    status: "draft",
    sortOrder: 4,
  },
  // 4.2 MATH.ALG.LIN — Persamaan dan Pertidaksamaan Linear (3)
  {
    code: "MATH.ALG.LIN.SPL",
    name: "Menyelesaikan SPL multivariabel",
    description:
      "Menyelesaikan sistem persamaan linear sampai tiga variabel (eliminasi, substitusi, gabungan) serta menafsirkan keberadaan/ketunggalan solusi.",
    competency:
      "Memahami (mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis, memecahkan masalah) terkait SPL multivariabel (maks. 3 variabel). [L1–L3]",
    parentCode: "MATH.ALG.LIN",
    status: "draft",
    sortOrder: 1,
  },
  {
    code: "MATH.ALG.LIN.SPTL",
    name: "Menyelesaikan SPtL multivariabel",
    description:
      "Menyelesaikan sistem pertidaksamaan linear sampai tiga variabel dan menentukan/menafsirkan daerah himpunan penyelesaian.",
    competency:
      "Memahami (mengidentifikasi, memahami informasi grafik/daerah), mengaplikasikan (menerapkan), dan bernalar (menganalisis) terkait SPtL multivariabel (maks. 3 variabel). [L1–L3]",
    parentCode: "MATH.ALG.LIN",
    status: "draft",
    sortOrder: 2,
  },
  {
    code: "MATH.ALG.LIN.PROGLIN",
    name: "Memodelkan dan menyelesaikan program linear",
    description:
      "Memodelkan masalah kontekstual menjadi fungsi tujuan dan kendala linear, menentukan nilai optimum, dan menafsirkan solusi.",
    competency:
      "Mengaplikasikan (memodelkan, menerapkan) dan bernalar (menganalisis, memecahkan masalah, mengevaluasi, menjustifikasi) terkait program linear (maks. 3 variabel). [L2–L3]",
    parentCode: "MATH.ALG.LIN",
    status: "draft",
    sortOrder: 3,
  },
  // 4.3 MATH.ALG.FUNC — Fungsi (4)
  {
    code: "MATH.ALG.FUNC.IDENTIFY",
    name: "Mengidentifikasi domain, kodomain, dan range fungsi",
    description:
      "Menentukan domain, kodomain, dan daerah hasil fungsi linear, kuadrat, dan rasional secara analitis maupun grafis.",
    competency:
      "Memahami (mengidentifikasi, memahami informasi grafik), mengaplikasikan (menerapkan), dan bernalar (menganalisis) terkait domain, kodomain, dan range fungsi linear, kuadrat, rasional. [L1–L3]",
    parentCode: "MATH.ALG.FUNC",
    status: "draft",
    sortOrder: 1,
  },
  {
    code: "MATH.ALG.FUNC.INTERPRET",
    name: "Menginterpretasikan representasi fungsi",
    description:
      "Membaca dan menjelaskan makna grafik, tabel, dan rumus fungsi linear, kuadrat, dan rasional (titik potong, puncak, kemonotonan, perilaku sederhana di sekitar titik tak terdefinisi).",
    competency:
      "Memahami (memahami informasi) dan mengaplikasikan (menginterpretasikan) berbagai representasi fungsi secara analitis dan grafis. [L1–L2]",
    parentCode: "MATH.ALG.FUNC",
    status: "draft",
    sortOrder: 2,
  },
  {
    code: "MATH.ALG.FUNC.INVERSE",
    name: "Menentukan invers fungsi",
    description:
      "Menentukan rumus dan representasi (grafik/tabel) invers fungsi serta syarat keberadaannya (korespondensi satu-satu pada domain yang ditinjau).",
    competency:
      "Memahami (mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis, menjustifikasi) terkait invers fungsi dan representasinya. [L1–L3]",
    parentCode: "MATH.ALG.FUNC",
    status: "draft",
    sortOrder: 3,
  },
  {
    code: "MATH.ALG.FUNC.COMPOSE",
    name: "Menentukan fungsi komposisi",
    description:
      "Menentukan rumus, domain, dan representasi fungsi komposisi dua fungsi atau lebih.",
    competency:
      "Memahami (menghitung, mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis, memecahkan masalah) terkait fungsi komposisi dan representasinya. [L1–L3]",
    parentCode: "MATH.ALG.FUNC",
    status: "draft",
    sortOrder: 4,
  },
  // 4.4 MATH.ALG.SEQ — Barisan dan Deret (3)
  {
    code: "MATH.ALG.SEQ.ARITH",
    name: "Menyelesaikan barisan dan deret aritmetika",
    description:
      "Menentukan suku ke-n, beda, dan jumlah n suku barisan/deret aritmetika serta menggunakannya dalam masalah.",
    competency:
      "Memahami (menghitung, mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis, memecahkan masalah, generalisasi) terkait barisan dan deret aritmetika. [L1–L3]",
    parentCode: "MATH.ALG.SEQ",
    status: "draft",
    sortOrder: 1,
  },
  {
    code: "MATH.ALG.SEQ.GEO",
    name: "Menyelesaikan barisan dan deret geometri",
    description:
      "Menentukan suku ke-n, rasio, dan jumlah n suku barisan/deret geometri serta menggunakannya dalam masalah.",
    competency:
      "Memahami (menghitung, mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis, memecahkan masalah, generalisasi) terkait barisan dan deret geometri. [L1–L3]",
    parentCode: "MATH.ALG.SEQ",
    status: "draft",
    sortOrder: 2,
  },
  {
    code: "MATH.ALG.SEQ.APPLY",
    name: "Menerapkan barisan-deret pada pertumbuhan, peluruhan, dan bunga",
    description:
      "Memodelkan dan menyelesaikan masalah pertumbuhan, peluruhan, bunga tunggal, dan bunga majemuk dengan barisan/deret yang sesuai.",
    competency:
      "Mengaplikasikan (memodelkan, menerapkan) dan bernalar (menganalisis, memecahkan masalah, mengevaluasi) terkait penerapan barisan dan deret. [L2–L3]",
    parentCode: "MATH.ALG.SEQ",
    status: "draft",
    sortOrder: 3,
  },
  // 4.5 MATH.GEO.OBJ — Objek Geometri (4)
  {
    code: "MATH.GEO.OBJ.ANGLE",
    name: "Menganalisis hubungan sudut, garis, dan bidang",
    description:
      "Menentukan hubungan dan besar sudut yang dibentuk dua garis/dua bidang, termasuk sudut pada bangun datar yang relevan.",
    competency:
      "Memahami (mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis) terkait hubungan dua sudut, dua garis, dan dua bidang. [L1–L3]",
    parentCode: "MATH.GEO.OBJ",
    status: "draft",
    sortOrder: 1,
  },
  {
    code: "MATH.GEO.OBJ.RELATE",
    name: "Menganalisis hubungan objek geometri bangun datar dan bangun ruang",
    description:
      "Mengidentifikasi dan menggunakan hubungan unsur-unsur bangun datar (segitiga, segiempat, lingkaran, gabungannya) dan bangun ruang beraturan (sisi datar dan lengkung).",
    competency:
      "Memahami (mengidentifikasi, mengelompokkan), mengaplikasikan (menerapkan), dan bernalar (menganalisis) terkait hubungan objek geometri pada bangun datar dan bangun ruang. [L1–L3]",
    parentCode: "MATH.GEO.OBJ",
    status: "draft",
    sortOrder: 2,
  },
  {
    code: "MATH.GEO.OBJ.SIMILAR",
    name: "Menyelesaikan kesebangunan dan kekongruenan bangun datar",
    description:
      "Menentukan kesebangunan/kekongruenan serta memakai perbandingan sisi-sisi bersesuaian untuk menentukan panjang sisi, keliling, atau luas.",
    competency:
      "Memahami (mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis, memecahkan masalah) terkait kesebangunan atau kekongruenan bangun datar. [L1–L3]",
    parentCode: "MATH.GEO.OBJ",
    status: "draft",
    sortOrder: 3,
  },
  {
    code: "MATH.GEO.OBJ.PYTHAG",
    name: "Menerapkan teorema Pythagoras",
    description:
      "Menggunakan teorema Pythagoras untuk menentukan panjang sisi segitiga siku-siku dan jarak/ukuran terkait pada bangun datar maupun bangun ruang.",
    competency:
      "Memahami (menghitung, mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis, memecahkan masalah) terkait teorema Pythagoras. [L1–L3]",
    parentCode: "MATH.GEO.OBJ",
    status: "draft",
    sortOrder: 4,
  },
  // 4.6 MATH.GEO.TRANS — Transformasi Geometri (2)
  {
    code: "MATH.GEO.TRANS.SINGLE",
    name: "Menerapkan transformasi tunggal pada titik",
    description:
      "Menentukan bayangan titik oleh translasi, refleksi, rotasi, atau dilatasi tunggal beserta sifat-sifatnya.",
    competency:
      "Memahami (menghitung, mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis) terkait transformasi tunggal dari titik. [L1–L3]",
    parentCode: "MATH.GEO.TRANS",
    status: "draft",
    sortOrder: 1,
  },
  {
    code: "MATH.GEO.TRANS.COMPOSE",
    name: "Menerapkan komposisi transformasi pada titik",
    description:
      "Menentukan bayangan titik oleh dua transformasi berurutan atau lebih (komposisi translasi, refleksi, rotasi, dilatasi).",
    competency:
      "Mengaplikasikan (menerapkan) dan bernalar (menganalisis, memecahkan masalah, mengevaluasi) terkait komposisi transformasi geometri dari titik. [L2–L3]",
    parentCode: "MATH.GEO.TRANS",
    status: "draft",
    sortOrder: 2,
  },
  // 4.7 MATH.GEO.MEAS — Pengukuran (3)
  {
    code: "MATH.GEO.MEAS.AREA",
    name: "Menghitung keliling dan luas bangun datar",
    description:
      "Menghitung keliling dan luas segitiga, segiempat, lingkaran, dan gabungannya, termasuk menafsirkan hasil pada masalah kontekstual.",
    competency:
      "Memahami (menghitung), mengaplikasikan (menerapkan, memodelkan), dan bernalar (menganalisis, memecahkan masalah) terkait keliling dan luas bangun datar. [L1–L3]",
    parentCode: "MATH.GEO.MEAS",
    status: "draft",
    sortOrder: 1,
  },
  {
    code: "MATH.GEO.MEAS.VOLUME",
    name: "Menghitung volume dan luas permukaan bangun ruang",
    description:
      "Menghitung volume dan luas permukaan bangun ruang beraturan bersisi datar dan lengkung, termasuk menafsirkan hasil pada masalah kontekstual.",
    competency:
      "Memahami (menghitung), mengaplikasikan (menerapkan, memodelkan), dan bernalar (menganalisis, memecahkan masalah) terkait volume dan luas permukaan bangun ruang. [L1–L3]",
    parentCode: "MATH.GEO.MEAS",
    status: "draft",
    sortOrder: 2,
  },
  {
    code: "MATH.GEO.MEAS.DIST",
    name: "Menentukan jarak dua objek geometri",
    description:
      "Menentukan jarak dua titik, dua garis, dua bidang, titik-garis, dan titik-bidang, termasuk pada bangun ruang.",
    competency:
      "Mengaplikasikan (menerapkan, memodelkan) dan bernalar (menganalisis, memecahkan masalah, menjustifikasi) terkait jarak dua objek geometri. [L2–L3]",
    parentCode: "MATH.GEO.MEAS",
    status: "draft",
    sortOrder: 3,
  },
  // 4.8 MATH.TRG.RATIO — Perbandingan Trigonometri (3)
  {
    code: "MATH.TRG.RATIO.IDENTIFY",
    name: "Mengidentifikasi nilai perbandingan trigonometri",
    description:
      "Menentukan nilai sinus, kosinus, tangen, kotangen, sekan, dan kosekan dari segitiga siku-siku atau sudut yang diketahui, termasuk relasi resiprokal.",
    competency:
      "Memahami (menghitung, mengidentifikasi, mengelompokkan) dan mengaplikasikan (menerapkan) perbandingan trigonometri. [L1–L2]",
    parentCode: "MATH.TRG.RATIO",
    status: "draft",
    sortOrder: 1,
  },
  {
    code: "MATH.TRG.RATIO.ANGLE",
    name: "Menggunakan sudut istimewa dan relasi sudut",
    description:
      "Menggunakan nilai sudut istimewa serta relasi antar-kuadran/sudut berelasi untuk menentukan nilai perbandingan trigonometri.",
    competency:
      "Memahami (menghitung, mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis, generalisasi) terkait perbandingan trigonometri. [L1–L3]",
    parentCode: "MATH.TRG.RATIO",
    status: "draft",
    sortOrder: 2,
  },
  {
    code: "MATH.TRG.RATIO.APPLY",
    name: "Memecahkan masalah perbandingan trigonometri",
    description:
      "Memodelkan dan menyelesaikan masalah (jarak, tinggi, sudut elevasi/depresi, navigasi sederhana) dengan perbandingan trigonometri.",
    competency:
      "Mengaplikasikan (memodelkan, menerapkan) dan bernalar (menganalisis, memecahkan masalah, mengevaluasi) terkait perbandingan trigonometri. [L2–L3]",
    parentCode: "MATH.TRG.RATIO",
    status: "draft",
    sortOrder: 3,
  },
  // 4.9 MATH.DAT.DATA — Data (4)
  {
    code: "MATH.DAT.DATA.PRESENT",
    name: "Menyajikan dan membaca data",
    description:
      "Menyajikan data dalam diagram batang, garis, lingkaran, grafik, tabel, dan bentuk visual lain, serta membaca/menafsirkan informasi darinya.",
    competency:
      "Memahami (memahami informasi, mengidentifikasi) dan mengaplikasikan (menerapkan, menginterpretasikan) penyajian data. [L1–L2]",
    parentCode: "MATH.DAT.DATA",
    status: "draft",
    sortOrder: 1,
  },
  {
    code: "MATH.DAT.DATA.CENTER",
    name: "Menentukan ukuran pemusatan data",
    description:
      "Menentukan mean, median, dan modus data tunggal dan data kelompok serta memilih ukuran yang tepat untuk suatu konteks.",
    competency:
      "Memahami (menghitung, mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis, mengevaluasi) terkait ukuran pemusatan data tunggal dan kelompok. [L1–L3]",
    parentCode: "MATH.DAT.DATA",
    status: "draft",
    sortOrder: 2,
  },
  {
    code: "MATH.DAT.DATA.SPREAD",
    name: "Menentukan ukuran penyebaran data",
    description:
      "Menentukan jangkauan, kuartil, simpangan, atau ukuran penyebaran data tunggal dan kelompok yang relevan serta menafsirkannya.",
    competency:
      "Memahami (menghitung), mengaplikasikan (menerapkan), dan bernalar (menganalisis, mengevaluasi, menyimpulkan) terkait ukuran penyebaran data tunggal dan kelompok. [L1–L3]",
    parentCode: "MATH.DAT.DATA",
    status: "draft",
    sortOrder: 3,
  },
  {
    code: "MATH.DAT.DATA.COUNT",
    name: "Menerapkan kaidah pencacahan",
    description:
      "Menggunakan aturan penjumlahan, aturan perkalian, permutasi, dan kombinasi untuk menentukan banyak susunan/objek.",
    competency:
      "Memahami (menghitung, mengelompokkan), mengaplikasikan (menerapkan), dan bernalar (menganalisis, memecahkan masalah) terkait kaidah pencacahan. [L1–L3]",
    parentCode: "MATH.DAT.DATA",
    status: "draft",
    sortOrder: 4,
  },
  // 4.10 MATH.DAT.PROB — Peluang (2)
  {
    code: "MATH.DAT.PROB.SINGLE",
    name: "Menentukan peluang kejadian tunggal",
    description:
      "Menentukan ruang sampel, titik sampel, dan peluang suatu kejadian tunggal, termasuk frekuensi harapan sederhana.",
    competency:
      "Memahami (menghitung, mengidentifikasi), mengaplikasikan (menerapkan), dan bernalar (menganalisis) terkait peluang kejadian tunggal. [L1–L3]",
    parentCode: "MATH.DAT.PROB",
    status: "draft",
    sortOrder: 1,
  },
  {
    code: "MATH.DAT.PROB.COMPOUND",
    name: "Menentukan peluang kejadian majemuk",
    description:
      "Menentukan peluang gabungan, irisan, kejadian saling lepas/bebas/bersyarat sederhana, dan komplemen suatu kejadian.",
    competency:
      "Mengaplikasikan (menerapkan) dan bernalar (menganalisis, memecahkan masalah, mengevaluasi) terkait peluang kejadian majemuk. [L2–L3]",
    parentCode: "MATH.DAT.PROB",
    status: "draft",
    sortOrder: 2,
  },
];

// ---------------------------------------------------------------------------
// Validasi struktur (murni, tanpa DB): dipakai seed runner (fail-fast) dan tes.
// Mengembalikan daftar pesan galat; kosong = valid.
// ---------------------------------------------------------------------------

const LEVEL_RE = /\[L[123]–L[123]\]/;

/** Cek baris data taksonomi konsisten dengan FROZEN v1. */
export function validateTaxonomy(): string[] {
  const galat: string[] = [];
  if (SUBJECTS.length !== TAXONOMY_COUNTS.subjects)
    galat.push(`subjects: ${SUBJECTS.length}, ekspektasi ${TAXONOMY_COUNTS.subjects}`);
  if (TOPICS.length !== TAXONOMY_COUNTS.topics)
    galat.push(`topics: ${TOPICS.length}, ekspektasi ${TAXONOMY_COUNTS.topics}`);
  if (SUBTOPICS.length !== TAXONOMY_COUNTS.subtopics)
    galat.push(`subtopics: ${SUBTOPICS.length}, ekspektasi ${TAXONOMY_COUNTS.subtopics}`);
  if (SKILLS.length !== TAXONOMY_COUNTS.skills)
    galat.push(`skills: ${SKILLS.length}, ekspektasi ${TAXONOMY_COUNTS.skills}`);

  const subjectCodes = new Set(SUBJECTS.map((s) => s.code));
  const topicCodes = new Set(TOPICS.map((t) => t.code));
  const subtopicCodes = new Set(SUBTOPICS.map((s) => s.code));

  const semuaKode = [...SUBJECTS, ...TOPICS, ...SUBTOPICS, ...SKILLS].map((b) => b.code);
  const duplikat = semuaKode.filter((k, i) => semuaKode.indexOf(k) !== i);
  if (duplikat.length > 0) galat.push(`kode duplikat: ${[...new Set(duplikat)].join(", ")}`);

  const math = SUBJECTS.find((s) => s.code === "MATH");
  if (!math) galat.push("subject MATH tidak ada");
  else if (math.status !== "active") galat.push(`subject MATH status=${math.status}, ekspektasi active`);

  for (const t of TOPICS) {
    if (!subjectCodes.has(t.parentCode)) galat.push(`topic ${t.code}: parent ${t.parentCode} tidak ada`);
    if (!t.code.startsWith(`${t.parentCode}.`))
      galat.push(`topic ${t.code}: tidak berawalan parent ${t.parentCode}.`);
    if (t.status !== "draft") galat.push(`topic ${t.code}: status=${t.status}, ekspektasi draft`);
  }
  for (const s of SUBTOPICS) {
    if (!topicCodes.has(s.parentCode)) galat.push(`subtopic ${s.code}: parent ${s.parentCode} tidak ada`);
    if (!s.code.startsWith(`${s.parentCode}.`))
      galat.push(`subtopic ${s.code}: tidak berawalan parent ${s.parentCode}.`);
    if (s.status !== "draft") galat.push(`subtopic ${s.code}: status=${s.status}, ekspektasi draft`);
  }
  for (const k of SKILLS) {
    if (!subtopicCodes.has(k.parentCode)) galat.push(`skill ${k.code}: parent ${k.parentCode} tidak ada`);
    if (!k.code.startsWith(`${k.parentCode}.`))
      galat.push(`skill ${k.code}: tidak berawalan parent ${k.parentCode}.`);
    if (k.status !== "draft") galat.push(`skill ${k.code}: status=${k.status}, ekspektasi draft`);
    if (!LEVEL_RE.test(k.competency)) galat.push(`skill ${k.code}: competency tanpa rentang [Lx–Ly]`);
  }

  const cekSort = (nama: string, baris: { code: string; sortOrder: number }[], induk?: string) => {
    const grup = induk
      ? baris.filter((b) => "parentCode" in b && (b as unknown as { parentCode: string }).parentCode === induk)
      : baris;
    const sort = [...grup].map((b) => b.sortOrder).sort((a, b) => a - b);
    for (let i = 0; i < sort.length; i++) {
      if (sort[i] !== i + 1) {
        galat.push(`${nama}${induk ? ` (${induk})` : ""}: sort_order tidak kontinu mulai 1`);
        break;
      }
    }
  };
  cekSort("topics", TOPICS);
  for (const t of TOPICS) cekSort("subtopics", SUBTOPICS, t.code);
  for (const s of SUBTOPICS) cekSort("skills", SKILLS, s.code);

  return galat;
}

// ---------------------------------------------------------------------------
// Rencana upsert (murni, tanpa DB): urutan dependency induk-sebelum-anak.
// Eksekutor (seed-taxonomy.ts) menerapkan tiap operasi sebagai
// INSERT ... ON CONFLICT (code) DO UPDATE — idempoten: dijalankan N kali,
// hasil akhir sama (dibuktikan tes tanpa DB).
// ---------------------------------------------------------------------------

/** Satu operasi upsert: baris + tabel tujuan + kode parent (null utk subject). */
export interface UpsertOp {
  table: "subjects" | "topics" | "subtopics" | "skills";
  code: string;
  parentCode: string | null;
}

/** Susun rencana upsert deterministik: subjects → topics → subtopics → skills. */
export function buildUpsertPlan(): UpsertOp[] {
  return [
    ...SUBJECTS.map((s): UpsertOp => ({ table: "subjects", code: s.code, parentCode: null })),
    ...TOPICS.map((t): UpsertOp => ({ table: "topics", code: t.code, parentCode: t.parentCode })),
    ...SUBTOPICS.map((s): UpsertOp => ({
      table: "subtopics",
      code: s.code,
      parentCode: s.parentCode,
    })),
    ...SKILLS.map((k): UpsertOp => ({ table: "skills", code: k.code, parentCode: k.parentCode })),
  ];
}

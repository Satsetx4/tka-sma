// P5.4 — 5 soal gambar/diagram orisinal internal (blok image).
//
// Diagram SVG digambar internal khusus untuk TKA SMA (bukan unduhan /
// salinan) dan SUDAH di-upload ke Vercel Blob (store tka-sma-assets):
// assetId = pathname Blob di bawah, URL publik GET 200 terverifikasi.
// Alt text tiap gambar ≥ 10 karakter bermakna (syarat publish-gate).
//
// Struktur mengikuti CmsQuestionInput. File MURNI data (tanpa server-only /
// drizzle / I-O) sehingga bisa diimpor langsung oleh tests/ di bawah plain
// `node --test`. Eksekusi DB di src/server/db/seed-p54.ts; runner CLI di
// scripts/seed-p54.ts.
import type { CmsQuestionInput } from "../repositories/question-model.ts";

const SUMBER = "TKA-SMA internal P5.4 (diagram SVG gambar internal, terverifikasi hitungan node)";

export const P54_QUESTIONS: CmsQuestionInput[] = [
  {
    code: "MAT-GEO-003",
    subjectCode: "MATH",
    topicCode: "MATH.GEO",
    subtopicCode: "MATH.GEO.MEAS",
    skillCodes: ["MATH.GEO.MEAS.AREA"],
    difficulty: "easy",
    questionType: "single_choice",
    contentBlocks: [
      { type: "text", content: "Perhatikan segitiga siku-siku pada gambar berikut. Tentukan luasnya." },
      {
        type: "image",
        assetId: "tka-sma/cms/p54-segitiga-6-8-10.svg",
        alt: "Segitiga siku-siku dengan sisi tegak 6 dan 8 serta sisi miring 10",
        caption: "Segitiga siku-siku 6-8-10",
      },
    ],
    options: [
      { blocks: [{ type: "math", latex: "14" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "24" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "30" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "40" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "48" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Luas segitiga = setengah × alas × tinggi (dua sisi tegaknya)." },
        { type: "math", latex: "L = \\frac{1}{2} \\times 8 \\times 6 = 24" },
      ],
      commonMistake: [
        { type: "text", content: "Memakai sisi miring 10 sebagai tinggi (mendapat 30 atau 40)." },
      ],
      solvingTip: [{ type: "text", content: "Sisi miring tidak pernah jadi alas/tinggi segitiga siku-siku." }],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 120,
  },
  {
    code: "MAT-GEO-004",
    subjectCode: "MATH",
    topicCode: "MATH.GEO",
    subtopicCode: "MATH.GEO.MEAS",
    skillCodes: ["MATH.GEO.MEAS.AREA"],
    difficulty: "easy",
    questionType: "single_choice",
    contentBlocks: [
      { type: "text", content: "Perhatikan persegi pada gambar berikut. Tentukan kelilingnya." },
      {
        type: "image",
        assetId: "tka-sma/cms/p54-persegi-s7.svg",
        alt: "Persegi dengan panjang sisi 7 satuan",
        caption: "Persegi sisi 7",
      },
    ],
    options: [
      { blocks: [{ type: "math", latex: "14" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "21" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "28" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "35" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "49" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Keliling persegi = 4 × sisi." },
        { type: "math", latex: "K = 4 \\times 7 = 28" },
      ],
      commonMistake: [{ type: "text", content: "Tertukar dengan luas (7 × 7 = 49)." }],
      solvingTip: [{ type: "text", content: "Keliling = mengelilingi (tambah), luas = mengisi (kali)." }],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 90,
  },
  {
    code: "MAT-GEO-005",
    subjectCode: "MATH",
    topicCode: "MATH.GEO",
    subtopicCode: "MATH.GEO.MEAS",
    skillCodes: ["MATH.GEO.MEAS.AREA"],
    difficulty: "medium",
    questionType: "single_choice",
    contentBlocks: [
      { type: "text", content: "Perhatikan lingkaran pada gambar berikut. Tentukan luasnya (gunakan π = 22/7)." },
      {
        type: "image",
        assetId: "tka-sma/cms/p54-lingkaran-r7.svg",
        alt: "Lingkaran dengan titik pusat O dan jari-jari 7 satuan",
        caption: "Lingkaran r = 7",
      },
    ],
    options: [
      { blocks: [{ type: "math", latex: "44" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "66" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "154" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "308" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "616" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Luas lingkaran = π × r². Karena r = 7 habis dibagi 7, pakai π = 22/7." },
        { type: "math", latex: "L = \\frac{22}{7} \\times 7^2 = 22 \\times 7 = 154" },
      ],
      commonMistake: [
        { type: "text", content: "Tertukar dengan keliling (2 × 22/7 × 7 = 44) atau lupa mengkuadratkan r." },
      ],
      solvingTip: [{ type: "text", content: "r = 7 atau kelipatan 7 → selalu pakai π = 22/7 agar habis dibagi." }],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 120,
  },
  {
    code: "MAT-GEO-006",
    subjectCode: "MATH",
    topicCode: "MATH.GEO",
    subtopicCode: "MATH.GEO.MEAS",
    skillCodes: ["MATH.GEO.MEAS.VOLUME"],
    difficulty: "medium",
    questionType: "single_choice",
    contentBlocks: [
      { type: "text", content: "Perhatikan balok pada gambar berikut. Tentukan volumenya." },
      {
        type: "image",
        assetId: "tka-sma/cms/p54-balok-6-4-5.svg",
        alt: "Balok dengan panjang 6 lebar 4 dan tinggi 5 satuan",
        caption: "Balok 6 × 4 × 5",
      },
    ],
    options: [
      { blocks: [{ type: "math", latex: "60" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "74" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "120" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "148" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "240" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Volume balok = panjang × lebar × tinggi." },
        { type: "math", latex: "V = 6 \\times 4 \\times 5 = 120" },
      ],
      commonMistake: [
        { type: "text", content: "Tertukar dengan luas permukaan (148) atau hanya mengalikan dua sisi." },
      ],
      solvingTip: [{ type: "text", content: "Volume = tiga sisi dikali; luas permukaan = jumlah tiga pasang sisi." }],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 120,
  },
  {
    code: "MAT-DAT-007",
    subjectCode: "MATH",
    topicCode: "MATH.DAT",
    subtopicCode: "MATH.DAT.PROB",
    skillCodes: ["MATH.DAT.PROB.SINGLE"],
    difficulty: "easy",
    questionType: "single_choice",
    contentBlocks: [
      { type: "text", content: "Perhatikan mata dadu pada gambar berikut. Jika sebuah dadu adil dilempar sekali, tentukan peluang muncul mata dadu genap." },
      {
        type: "image",
        assetId: "tka-sma/cms/p54-dadu-genap.svg",
        alt: "Tiga sisi dadu menunjukkan mata dadu genap yaitu 2 4 dan 6",
        caption: "Mata dadu genap: 2, 4, 6",
      },
    ],
    options: [
      { blocks: [{ type: "math", latex: "\\frac{1}{6}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "\\frac{1}{3}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "\\frac{1}{2}" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "\\frac{2}{3}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "\\frac{5}{6}" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Mata genap ada 3 (2, 4, 6) dari 6 sisi dadu." },
        { type: "math", latex: "P(\\text{genap}) = \\frac{3}{6} = \\frac{1}{2}" },
      ],
      commonMistake: [
        { type: "text", content: "Menghitung hanya satu angka genap (1/6) atau memakai 3/5." },
      ],
      solvingTip: [{ type: "text", content: "Gambarnya memang menunjukkan ketiga mata genap itu — hitung semuanya." }],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 90,
  },
];

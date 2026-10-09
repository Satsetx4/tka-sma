// P5.3 — 5 soal grafik fungsi orisinal internal (blok function_graph).
//
// Konten dikarang internal khusus untuk TKA SMA — BUKAN salinan bank soal
// bimbel/kompetitor (docs/CONTENT-POLICY.md). Kunci diverifikasi node.
// Ekspresi grafik memakai gramatik function-eval (x, + - * / ^, parens,
// tanpa eval) — sudah dites lolos functionGraphBlockSchema.
//
// Struktur mengikuti CmsQuestionInput. File MURNI data (tanpa server-only /
// drizzle / I-O) sehingga bisa diimpor langsung oleh tests/ di bawah plain
// `node --test`. Eksekusi DB di src/server/db/seed-p53.ts; runner CLI di
// scripts/seed-p53.ts.
import type { CmsQuestionInput } from "../repositories/question-model.ts";

const SUMBER = "TKA-SMA internal P5.3 (karang internal, terverifikasi hitungan node)";

export const P53_QUESTIONS: CmsQuestionInput[] = [
  {
    code: "MAT-ALG-006",
    subjectCode: "MATH",
    topicCode: "MATH.ALG",
    subtopicCode: "MATH.ALG.FUNC",
    skillCodes: ["MATH.ALG.FUNC.INTERPRET"],
    difficulty: "medium",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Perhatikan grafik fungsi kuadrat berikut. Tentukan titik puncak grafik tersebut.",
      },
      { type: "function_graph", expressions: ["y=x^2-4x+3"], xMin: -1, xMax: 5 },
    ],
    options: [
      { blocks: [{ type: "math", latex: "(2, -1)" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "(2, 1)" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "(-2, -1)" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "(1, 0)" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "(3, 0)" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Puncak parabola y = ax² + bx + c ada di x = −b/2a." },
        {
          type: "math",
          latex: "x_p = -\\frac{-4}{2} = 2, \\quad y_p = 2^2 - 4(2) + 3 = 4 - 8 + 3 = -1",
        },
      ],
      commonMistake: [
        { type: "text", content: "Tertukar dengan titik potong sumbu-x (1, 0) atau (3, 0) yang memang terlihat di grafik." },
      ],
      solvingTip: [{ type: "text", content: "Puncak = titik terendah/tertinggi grafik, bukan tempat grafik memotong sumbu." }],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 150,
  },
  {
    code: "MAT-ALG-007",
    subjectCode: "MATH",
    topicCode: "MATH.ALG",
    subtopicCode: "MATH.ALG.FUNC",
    skillCodes: ["MATH.ALG.FUNC.INTERPRET"],
    difficulty: "easy",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Perhatikan grafik fungsi berikut. Tentukan nilai fungsi saat x = 1.",
      },
      { type: "function_graph", expressions: ["y=x^2-2x+1"], xMin: -1, xMax: 4 },
      { type: "math", latex: "f(1) = ?" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "0" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "1" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "2" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "4" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "-1" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Cari x = 1 pada sumbu mendatar, naik ke grafik, baca nilai y-nya." },
        { type: "math", latex: "f(1) = 1^2 - 2(1) + 1 = 1 - 2 + 1 = 0" },
      ],
      commonMistake: [
        { type: "text", content: "Membaca nilai x sebagai jawaban (menjawab 1) tanpa melihat posisi grafik." },
      ],
      solvingTip: [{ type: "text", content: "Grafik menyentuh sumbu-x tepat di x = 1, jadi nilainya 0." }],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 120,
  },
  {
    code: "MAT-ALG-008",
    subjectCode: "MATH",
    topicCode: "MATH.ALG",
    subtopicCode: "MATH.ALG.FUNC",
    skillCodes: ["MATH.ALG.FUNC.INVERSE"],
    difficulty: "medium",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Grafik fungsi linear berikut memotong kedua sumbu. Tentukan invers fungsi tersebut.",
      },
      { type: "function_graph", expressions: ["y=2x+3"], xMin: -4, xMax: 3 },
      { type: "math", latex: "f(x) = 2x + 3, \\quad f^{-1}(x) = ?" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "\\frac{x-3}{2}" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "\\frac{x+3}{2}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "2x - 3" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "\\frac{3-x}{2}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "-2x + 3" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Tukar x dan y, lalu selesaikan untuk y." },
        {
          type: "math",
          latex: "x = 2y + 3 \\Rightarrow 2y = x - 3 \\Rightarrow f^{-1}(x) = \\frac{x-3}{2}",
        },
      ],
      commonMistake: [
        { type: "text", content: "Salah tanda konstanta (menjawab (x+3)/2) atau membalik koefisien (2x − 3)." },
      ],
      solvingTip: [{ type: "text", content: "Cek balik: f(1) = 5 dan f⁻¹(5) = 1, cocok." }],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 150,
  },
  {
    code: "MAT-ALG-009",
    subjectCode: "MATH",
    topicCode: "MATH.ALG",
    subtopicCode: "MATH.ALG.FUNC",
    skillCodes: ["MATH.ALG.FUNC.COMPOSE"],
    difficulty: "hard",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Dua fungsi linear digambarkan pada grafik berikut. Tentukan nilai komposisi (f ∘ g)(1).",
      },
      { type: "function_graph", expressions: ["y=2x+3", "y=3x-7"], xMin: -2, xMax: 5 },
      { type: "math", latex: "f(x) = 2x + 3, \\quad g(x) = 3x - 7, \\quad (f \\circ g)(1) = ?" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "-5" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "-1" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "1" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "5" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "9" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Hitung fungsi dalam (g) di x = 1 dulu, hasilnya masuk ke f." },
        {
          type: "math",
          latex: "g(1) = 3(1) - 7 = -4, \\quad f(-4) = 2(-4) + 3 = -8 + 3 = -5",
        },
      ],
      commonMistake: [
        { type: "text", content: "Mengerjakan dari kiri (f dulu) atau salah tanda pada 3 − 7." },
      ],
      solvingTip: [{ type: "text", content: "Komposisi dibaca dari kanan: g dikerjakan duluan." }],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 180,
  },
  {
    code: "MAT-ALG-010",
    subjectCode: "MATH",
    topicCode: "MATH.ALG",
    subtopicCode: "MATH.ALG.SEQ",
    skillCodes: ["MATH.ALG.SEQ.APPLY"],
    difficulty: "medium",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Pertumbuhan tinggi tanaman mengikuti pola barisan aritmetika seperti grafik berikut. Jika tinggi awal dan pertambahan per minggu diketahui, tentukan tinggi pada minggu ke-6.",
      },
      { type: "function_graph", expressions: ["y=3x+2"], xMin: 0, xMax: 8 },
      { type: "math", latex: "\\text{minggu ke-}n: U_n = 2 + 3n, \\quad U_6 = ?" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "17" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "18" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "20" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "21" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "24" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Substitusikan n = 6 ke rumus suku barisan (sama dengan membaca grafik di x = 6)." },
        { type: "math", latex: "U_6 = 2 + 3(6) = 2 + 18 = 20" },
      ],
      commonMistake: [
        { type: "text", content: "Memakai n = 5 (mendapat 17) karena mengira minggu pertama = nol." },
      ],
      solvingTip: [{ type: "text", content: "Cek di grafik: garis di x = 6 tepat menyentuh y = 20." }],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 150,
  },
];

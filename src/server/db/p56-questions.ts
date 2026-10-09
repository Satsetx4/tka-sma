// P5.6 — 3 soal Trigonometri orisinal internal (menutup topic MATH.TRG yg bolong).
//
// Hasil audit cakupan 2026-10-09: 27 soal, MATH.TRG = 0. Tiga soal ini
// mengisi TRG via skill IDENTIFY/ANGLE/APPLY (segitiga siku-siku + sudut
// istimewa + aplikasi elevasi). Kunci terverifikasi node.
//
// Struktur mengikuti CmsQuestionInput. File MURNI data.
// Eksekusi DB di src/server/db/seed-p56.ts; runner CLI di scripts/seed-p56.ts.
import type { CmsQuestionInput } from "../repositories/question-model.ts";

const SUMBER = "TKA-SMA internal P5.6 (karang internal, terverifikasi hitungan node)";

export const P56_QUESTIONS: CmsQuestionInput[] = [
  {
    code: "MAT-TRG-001",
    subjectCode: "MATH",
    topicCode: "MATH.TRG",
    subtopicCode: "MATH.TRG.RATIO",
    skillCodes: ["MATH.TRG.RATIO.IDENTIFY"],
    difficulty: "easy",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Pada segitiga siku-siku, sisi depan sudut 30° panjangnya 5 dan sisi miringnya 10. Tentukan nilai sin 30°.",
      },
      { type: "math", latex: "\\sin 30^\\circ = \\frac{\\text{depan}}{\\text{miring}} = ?" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "\\frac{1}{4}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "\\frac{1}{3}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "\\frac{1}{2}" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "\\frac{\\sqrt{3}}{2}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "1" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Sinus = sisi depan dibagi sisi miring." },
        { type: "math", latex: "\\sin 30^\\circ = \\frac{5}{10} = \\frac{1}{2}" },
      ],
      commonMistake: [
        { type: "text", content: "Tertukar dengan cos 30° (√3/2) atau membalik depan/miring." },
      ],
      solvingTip: [{ type: "text", content: "Hafal jangkarnya: sin 30° = 1/2, selalu." }],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 90,
  },
  {
    code: "MAT-TRG-002",
    subjectCode: "MATH",
    topicCode: "MATH.TRG",
    subtopicCode: "MATH.TRG.RATIO",
    skillCodes: ["MATH.TRG.RATIO.ANGLE"],
    difficulty: "medium",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Tentukan nilai dari cos 60° + tan 45° menggunakan sudut istimewa.",
      },
      { type: "math", latex: "\\cos 60^\\circ + \\tan 45^\\circ = ?" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "1" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "\\frac{3}{2}" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "2" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "\\sqrt{3}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "\\frac{1}{2}" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "cos 60° = 1/2 dan tan 45° = 1." },
        { type: "math", latex: "\\frac{1}{2} + 1 = \\frac{3}{2}" },
      ],
      commonMistake: [
        { type: "text", content: "Mengira cos 60° = √3/2 (itu cos 30°) atau tan 45° = 0." },
      ],
      solvingTip: [{ type: "text", content: "Pasangan kembar: sin 30 = cos 60 = 1/2; tan 45 selalu 1." }],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 120,
  },
  {
    code: "MAT-TRG-003",
    subjectCode: "MATH",
    topicCode: "MATH.TRG",
    subtopicCode: "MATH.TRG.RATIO",
    skillCodes: ["MATH.TRG.RATIO.APPLY"],
    difficulty: "hard",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Seorang pengamat berdiri 10 m dari kaki pohon. Sudut elevasi ke puncak pohon adalah 30°. Tentukan tinggi pohon (abaikan tinggi pengamat).",
      },
      { type: "math", latex: "d = 10\\text{ m}, \\quad \\alpha = 30^\\circ, \\quad t = d \\times \\tan\\alpha" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "5\\text{ m}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "\\frac{10\\sqrt{3}}{3}\\text{ m}" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "10\\text{ m}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "10\\sqrt{3}\\text{ m}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "20\\text{ m}" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Tinggi = jarak × tan(sudut elevasi); tan 30° = 1/√3 = √3/3." },
        {
          type: "math",
          latex: "t = 10 \\times \\tan 30^\\circ = 10 \\times \\frac{\\sqrt{3}}{3} = \\frac{10\\sqrt{3}}{3}\\text{ m} \\approx 5{,}77\\text{ m}",
        },
      ],
      commonMistake: [
        { type: "text", content: "Memakai sin (10 × 1/2 = 5) padahal sisi yang diketahui adalah samping, bukan miring." },
      ],
      solvingTip: [
        { type: "text", content: "Gambar segitiganya: jarak = samping, tinggi = depan → pakai tan, bukan sin." },
      ],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 180,
  },
];

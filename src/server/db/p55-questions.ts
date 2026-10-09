// P5.5 — Contoh pilihan ganda kompleks orisinal internal (tipe multiple_choice).
//
// Dua contoh sesuai bentuk resmi R1 (docs/TKA-MATH-TAXONOMY.md §1.2):
//  1. PGK model MCMA (multiple choice multiple answers) — >1 jawaban benar.
//  2. PGK model kategori — beberapa pernyataan, masing-masing direspons
//     benar/salah (dimodelkan sebagai opsi benar/salah per pernyataan).
//
// Aturan penilaian V1 (didokumentasikan di sini + diuji di tes):
//  - MCMA: benar penuh bila HIMPUNAN pilihan siswa SAMA PERSIS dengan
//    himpunan kunci (tanpa lebih, tanpa kurang). Parsial mengikuti engine
//    Fase 6 (di luar cakupan kartu ini).
//  - Kategori: tiap pernyataan dinilai benar/salah independen (bagian dari
//    satu soal multiple_choice dengan N opsi benar).
// Publish-gate: multiple_choice wajib ≥1 benar (checkPublishGate).
//
// Konten orisinal internal, kunci terverifikasi node. File MURNI data.
// Eksekusi DB di src/server/db/seed-p55.ts; runner CLI di scripts/seed-p55.ts.
import type { CmsQuestionInput } from "../repositories/question-model.ts";

const SUMBER = "TKA-SMA internal P5.5 (karang internal, terverifikasi hitungan node)";

export const P55_QUESTIONS: CmsQuestionInput[] = [
  {
    code: "MAT-BIL-003",
    subjectCode: "MATH",
    topicCode: "MATH.BIL",
    subtopicCode: "MATH.BIL.REAL",
    skillCodes: ["MATH.BIL.REAL.IDENTIFY"],
    difficulty: "medium",
    questionType: "multiple_choice",
    contentBlocks: [
      {
        type: "text",
        content:
          "Perhatikan lima bilangan berikut. Pilih SEMUA bilangan yang merupakan bilangan prima. (Jawaban benar lebih dari satu.)",
      },
      { type: "math", latex: "2, \\quad 4, \\quad 6, \\quad 9, \\quad 11" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "2" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "4" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "6" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "9" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "11" }], isCorrect: true },
    ],
    explanation: {
      blocks: [
        {
          type: "text",
          content: "Bilangan prima hanya punya dua faktor: 1 dan dirinya sendiri.",
        },
        {
          type: "math",
          latex: "2 \\checkmark \\quad 4 = 2 \\times 2 \\quad 6 = 2 \\times 3 \\quad 9 = 3 \\times 3 \\quad 11 \\checkmark",
        },
      ],
      commonMistake: [
        { type: "text", content: "Hanya memilih satu bilangan prima (lupa 11 juga prima) atau mengira 9 prima." },
      ],
      solvingTip: [
        { type: "text", content: "Uji tiap bilangan: habis dibagi selain 1 dan dirinya = bukan prima." },
      ],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 150,
  },
  {
    code: "MAT-GEO-007",
    subjectCode: "MATH",
    topicCode: "MATH.GEO",
    subtopicCode: "MATH.GEO.OBJ",
    skillCodes: ["MATH.GEO.OBJ.ANGLE"],
    difficulty: "medium",
    questionType: "multiple_choice",
    contentBlocks: [
      {
        type: "text",
        content:
          "Tentukan kebenaran setiap pernyataan berikut tentang jenis sudut. (Pilih SEMUA pernyataan yang BENAR.)",
      },
      {
        type: "table",
        columns: ["No", "Pernyataan"],
        rows: [
          ["1", "Sudut 90° adalah sudut siku-siku."],
          ["2", "Sudut 45° adalah sudut tumpul."],
          ["3", "Sudut 120° adalah sudut tumpul."],
          ["4", "Sudut 180° adalah sudut lancip."],
        ],
      },
    ],
    options: [
      { blocks: [{ type: "text", content: "Pernyataan 1 benar." }], isCorrect: true },
      { blocks: [{ type: "text", content: "Pernyataan 2 benar." }], isCorrect: false },
      { blocks: [{ type: "text", content: "Pernyataan 3 benar." }], isCorrect: true },
      { blocks: [{ type: "text", content: "Pernyataan 4 benar." }], isCorrect: false },
      { blocks: [{ type: "text", content: "Tidak ada pernyataan yang benar." }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Lancip < 90°, siku-siku = 90°, tumpul 90°–180°, lurus = 180°." },
        {
          type: "math",
          latex: "1\\ \\checkmark (90^\\circ) \\quad 2\\ \\times (45^\\circ = \\text{lancip}) \\quad 3\\ \\checkmark (120^\\circ) \\quad 4\\ \\times (180^\\circ = \\text{lurus})",
        },
      ],
      commonMistake: [
        { type: "text", content: "Mengira 45° tumpul atau 180° lancip karena hafal batasnya tertukar." },
      ],
      solvingTip: [{ type: "text", content: "Hafal jangkarnya: 90 siku, di bawahnya lancip, di atasnya tumpul, 180 lurus." }],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 150,
  },
];

/**
 * Aturan penilaian multiple_choice V1 (P5.5).
 * MCMA: himpunan jawaban siswa harus SAMA PERSIS dengan himpunan kunci.
 * Kategori: tiap opsi dinilai independen (benar bila cocok dengan kunci opsi itu).
 */
export function nilaiMultipleChoice(kunci: readonly boolean[], jawab: readonly boolean[]): boolean {
  if (kunci.length !== jawab.length) return false;
  return kunci.every((k, i) => k === jawab[i]);
}

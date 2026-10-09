// P5.2 — 5 soal tabel/chart orisinal internal (blok table dan/atau chart).
//
// Konten dikarang internal khusus untuk TKA SMA — BUKAN salinan bank soal
// bimbel/kompetitor (docs/CONTENT-POLICY.md). Kunci diverifikasi node.
// Tabel: tiap baris panjangnya SAMA dengan kolom (syarat publish-gate).
// Chart: labels.length == tiap dataset.values.length (syarat skema).
//
// Struktur mengikuti CmsQuestionInput. File MURNI data (tanpa server-only /
// drizzle / I-O) sehingga bisa diimpor langsung oleh tests/ di bawah plain
// `node --test`. Eksekusi DB di src/server/db/seed-p52.ts; runner CLI di
// scripts/seed-p52.ts.
import type { CmsQuestionInput } from "../repositories/question-model.ts";

const SUMBER = "TKA-SMA internal P5.2 (karang internal, terverifikasi hitungan node)";

export const P52_QUESTIONS: CmsQuestionInput[] = [
  {
    code: "MAT-DAT-002",
    subjectCode: "MATH",
    topicCode: "MATH.DAT",
    subtopicCode: "MATH.DAT.DATA",
    skillCodes: ["MATH.DAT.DATA.CENTER"],
    difficulty: "medium",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Nilai ulangan Matematika tujuh siswa disajikan pada tabel berikut. Tentukan rata-rata nilai tersebut.",
      },
      {
        type: "table",
        columns: ["Siswa", "A", "B", "C", "D", "E", "F", "G"],
        rows: [["Nilai", "72", "75", "78", "75", "80", "77", "79"]],
      },
    ],
    options: [
      { blocks: [{ type: "math", latex: "75" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "76" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "76{,}\\!\\tfrac{4}{7}" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "77" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "78" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Jumlahkan semua nilai lalu bagi banyak data." },
        {
          type: "math",
          latex: "\\bar{x} = \\frac{72+75+78+75+80+77+79}{7} = \\frac{536}{7} = 76\\tfrac{4}{7}",
        },
      ],
      commonMistake: [
        { type: "text", content: "Membagi dengan 6 (lupa satu siswa) atau membulatkan 536/7 menjadi 76 lalu berhenti." },
      ],
      solvingTip: [{ type: "text", content: "Jumlahkan per pasangan dulu (72+78, 75+75, 80+77) + 79 agar tidak salah tambah." }],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 150,
  },
  {
    code: "MAT-DAT-003",
    subjectCode: "MATH",
    topicCode: "MATH.DAT",
    subtopicCode: "MATH.DAT.DATA",
    skillCodes: ["MATH.DAT.DATA.CENTER"],
    difficulty: "easy",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Data tinggi bibit (cm) dalam seminggu disajikan pada tabel berikut. Tentukan median data tersebut.",
      },
      {
        type: "table",
        columns: ["Hari", "1", "2", "3", "4", "5", "6", "7"],
        rows: [["Tinggi", "5", "6", "6", "7", "8", "9", "12"]],
      },
    ],
    options: [
      { blocks: [{ type: "math", latex: "6" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "7" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "8" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "7{,}5" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "12" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Data sudah urut menaik; median data ganjil = nilai tengah (data ke-4 dari 7)." },
        { type: "math", latex: "5, 6, 6, \\mathbf{7}, 8, 9, 12 \\Rightarrow \\text{median} = 7" },
      ],
      commonMistake: [
        { type: "text", content: "Menghitung rata-rata sebagai pengganti median, atau mengambil data ke-3 tanpa mengurutkan." },
      ],
      solvingTip: [{ type: "text", content: "Pastikan data urut dulu; untuk 7 data, median selalu data ke-4." }],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 120,
  },
  {
    code: "MAT-DAT-004",
    subjectCode: "MATH",
    topicCode: "MATH.DAT",
    subtopicCode: "MATH.DAT.DATA",
    skillCodes: ["MATH.DAT.DATA.PRESENT"],
    difficulty: "easy",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Banyak siswa yang memilih setiap ekstrakurikuler disajikan pada diagram batang berikut. Ekstrakurikuler manakah yang paling diminati?",
      },
      {
        type: "chart",
        chartType: "bar",
        title: "Peminat ekstrakurikuler",
        labels: ["Pramuka", "PMR", "Paskibra", "Rohis"],
        datasets: [{ label: "Siswa", values: [24, 18, 20, 15] }],
      },
    ],
    options: [
      { blocks: [{ type: "text", content: "Rohis" }], isCorrect: false },
      { blocks: [{ type: "text", content: "PMR" }], isCorrect: false },
      { blocks: [{ type: "text", content: "Paskibra" }], isCorrect: false },
      { blocks: [{ type: "text", content: "Pramuka" }], isCorrect: true },
      { blocks: [{ type: "text", content: "Sama banyak" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Batang tertinggi = nilai terbesar: Pramuka 24 siswa." },
        { type: "math", latex: "24 > 20 > 18 > 15" },
      ],
      commonMistake: [{ type: "text", content: "Membaca label sumbu tertukar (mengira urutan label = urutan nilai)." }],
      solvingTip: [{ type: "text", content: "Bandingkan tinggi batangnya, bukan urutan namanya." }],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 90,
  },
  {
    code: "MAT-DAT-005",
    subjectCode: "MATH",
    topicCode: "MATH.DAT",
    subtopicCode: "MATH.DAT.DATA",
    skillCodes: ["MATH.DAT.DATA.PRESENT"],
    difficulty: "medium",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Hasil panen buah (kuintal) selama setahun disajikan pada diagram lingkaran berikut. Jika total panen 200 kuintal, berapa panen mangga?",
      },
      {
        type: "chart",
        chartType: "pie",
        title: "Hasil panen (kuintal)",
        labels: ["Pisang", "Mangga", "Jambu", "Pepaya", "Nanas"],
        datasets: [{ label: "Persen", values: [25, 30, 15, 20, 10] }],
      },
    ],
    options: [
      { blocks: [{ type: "math", latex: "30\\text{ kuintal}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "50\\text{ kuintal}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "60\\text{ kuintal}" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "75\\text{ kuintal}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "90\\text{ kuintal}" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Mangga 30% dari total 200 kuintal." },
        { type: "math", latex: "30\\% \\times 200 = \\frac{30}{100} \\times 200 = 60\\text{ kuintal}" },
      ],
      commonMistake: [
        { type: "text", content: "Mengira angka persen = kuintal langsung (menjawab 30), atau salah membaca juring mangga." },
      ],
      solvingTip: [{ type: "text", content: "Cek total persen dulu (25+30+15+20+10 = 100), baru kalikan dengan total." }],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 120,
  },
  {
    code: "MAT-DAT-006",
    subjectCode: "MATH",
    topicCode: "MATH.DAT",
    subtopicCode: "MATH.DAT.DATA",
    skillCodes: ["MATH.DAT.DATA.SPREAD"],
    difficulty: "medium",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Suhu udara (°C) pukul 06.00–12.00 tercatat pada tabel berikut. Tentukan jangkauan (range) data tersebut.",
      },
      {
        type: "table",
        columns: ["Pukul", "06.00", "07.00", "08.00", "09.00", "10.00", "11.00", "12.00"],
        rows: [["Suhu", "24", "25", "27", "29", "31", "32", "33"]],
      },
    ],
    options: [
      { blocks: [{ type: "math", latex: "7" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "8" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "9" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "10" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "28{,}5" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Jangkauan = nilai maksimum − nilai minimum." },
        { type: "math", latex: "R = 33 - 24 = 9" },
      ],
      commonMistake: [
        { type: "text", content: "Menghitung rata-rata sebagai pengganti jangkauan, atau memakai 32 − 25 (bukan ujung-ujungnya)." },
      ],
      solvingTip: [{ type: "text", content: "Cari dulu nilai paling besar dan paling kecil di tabel, baru kurangkan." }],
    },
    sourceType: "original_internal",
    sourceReference: SUMBER,
    estimatedTimeSeconds: 120,
  },
];

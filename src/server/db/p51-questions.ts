// P5.1 — 10 soal teks/math orisinal internal (blok text/math saja).
//
// Konten dikarang internal khusus untuk TKA SMA — BUKAN salinan bank soal
// bimbel/kompetitor (docs/CONTENT-POLICY.md). Setiap kunci jawaban
// diverifikasi hitungannya via node sebelum ditulis (lihat kartu #12).
//
// Struktur mengikuti CmsQuestionInput (tanpa id/status/createdBy — diisi
// repository saat seed): code unik, taksonomi code FROZEN v1, difficulty,
// single_choice, contentBlocks text/math, 5 opsi (1 benar), explanation
// (blocks + commonMistake + solvingTip), sourceType original_internal,
// estimatedTimeSeconds > 0.
//
// File ini MURNI data + logika murni (tanpa server-only/drizzle/I-O)
// sehingga bisa diimpor langsung oleh tests/ di bawah plain `node --test`.
// Eksekusi DB hidup di src/server/db/seed-p51.ts; runner CLI di scripts/seed-p51.ts.
import type { CmsQuestionInput } from "../repositories/question-model.ts";

export const P51_QUESTIONS: CmsQuestionInput[] = [
  {
    code: "MAT-BIL-001",
    subjectCode: "MATH",
    topicCode: "MATH.BIL",
    subtopicCode: "MATH.BIL.REAL",
    skillCodes: ["MATH.BIL.REAL.OPERATE"],
    difficulty: "easy",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content:
          "Hitung hasil dari operasi campuran berikut dengan urutan operasi yang benar (kali/bagi sebelum tambah/kurang).",
      },
      { type: "math", latex: "12 + 8 \\div 4 - 2 \\times 3" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "5" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "8" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "11" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "14" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "20" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        {
          type: "text",
          content: "Kerjakan pembagian dan perkalian dulu: 8 ÷ 4 = 2 dan 2 × 3 = 6.",
        },
        { type: "math", latex: "12 + 2 - 6 = 8" },
      ],
      commonMistake: [
        {
          type: "text",
          content: "Menjumlahkan dari kiri ke kanan tanpa mendahulukan kali/bagi (mendapat 14 atau 20).",
        },
      ],
      solvingTip: [{ type: "text", content: "Tandai dulu semua × dan ÷, selesaikan itu sebelum + dan −." }],
    },
    sourceType: "original_internal",
    sourceReference: "TKA-SMA internal P5.1 (karang internal, terverifikasi hitungan node)",
    estimatedTimeSeconds: 90,
  },
  {
    code: "MAT-BIL-002",
    subjectCode: "MATH",
    topicCode: "MATH.BIL",
    subtopicCode: "MATH.BIL.REAL",
    skillCodes: ["MATH.BIL.REAL.POWER"],
    difficulty: "medium",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Sederhanakan bilangan berpangkat pecahan berikut menjadi bilangan bulat.",
      },
      { type: "math", latex: "8^{\\frac{2}{3}}" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "2" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "4" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "6" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "16" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "64" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        {
          type: "text",
          content: "Pangkat pecahan 2/3 artinya akar pangkat 3 dulu, lalu kuadratkan.",
        },
        { type: "math", latex: "8^{\\frac{2}{3}} = (\\sqrt[3]{8})^2 = 2^2 = 4" },
      ],
      commonMistake: [
        {
          type: "text",
          content: "Mengalikan 8 × 2/3 secara langsung, atau mengira 8^(2/3) = 16.",
        },
      ],
      solvingTip: [
        { type: "text", content: "Ubah pangkat pecahan menjadi akar dulu: penyebut = pangkat akar." },
      ],
    },
    sourceType: "original_internal",
    sourceReference: "TKA-SMA internal P5.1 (karang internal, terverifikasi hitungan node)",
    estimatedTimeSeconds: 120,
  },
  {
    code: "MAT-ALG-001",
    subjectCode: "MATH",
    topicCode: "MATH.ALG",
    subtopicCode: "MATH.ALG.LIN",
    skillCodes: ["MATH.ALG.LIN.SPL"],
    difficulty: "medium",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Tentukan nilai x yang memenuhi sistem persamaan linear dua variabel berikut.",
      },
      { type: "math", latex: "\\begin{cases} x + y = 7 \\\\ 2x - y = 5 \\end{cases}" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "x = 2" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "x = 3" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "x = 4" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "x = 5" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "x = 6" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Jumlahkan kedua persamaan untuk mengeliminasi y." },
        { type: "math", latex: "(x + y) + (2x - y) = 7 + 5 \\Rightarrow 3x = 12 \\Rightarrow x = 4" },
      ],
      commonMistake: [
        {
          type: "text",
          content: "Salah tanda saat eliminasi (mendapat x = 2) atau berhenti sebelum membagi 3.",
        },
      ],
      solvingTip: [
        { type: "text", content: "Cek balik: x = 4 memberi y = 3, dan 2(4) − 3 = 5 cocok." },
      ],
    },
    sourceType: "original_internal",
    sourceReference: "TKA-SMA internal P5.1 (karang internal, terverifikasi hitungan node)",
    estimatedTimeSeconds: 120,
  },
  {
    code: "MAT-ALG-002",
    subjectCode: "MATH",
    topicCode: "MATH.ALG",
    subtopicCode: "MATH.ALG.FUNC",
    skillCodes: ["MATH.ALG.FUNC.IDENTIFY"],
    difficulty: "easy",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Diketahui fungsi kuadrat berikut. Tentukan nilai fungsi untuk x = 3.",
      },
      { type: "math", latex: "f(x) = x^2 - 6x + 8" },
      { type: "math", latex: "f(3) = ?" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "-1" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "0" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "1" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "2" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "8" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        {
          type: "text",
          content: "Substitusikan x = 3 ke setiap suku lalu hitung berurutan.",
        },
        { type: "math", latex: "f(3) = 3^2 - 6(3) + 8 = 9 - 18 + 8 = -1" },
      ],
      commonMistake: [
        { type: "text", content: "Salah tanda pada −6(3) menjadi +18, atau lupa menambah konstanta 8." },
      ],
      solvingTip: [
        { type: "text", content: "Tulis tiap suku hasil substitusi dulu (9, −18, 8) baru jumlahkan." },
      ],
    },
    sourceType: "original_internal",
    sourceReference: "TKA-SMA internal P5.1 (karang internal, terverifikasi hitungan node)",
    estimatedTimeSeconds: 90,
  },
  {
    code: "MAT-ALG-003",
    subjectCode: "MATH",
    topicCode: "MATH.ALG",
    subtopicCode: "MATH.ALG.FUNC",
    skillCodes: ["MATH.ALG.FUNC.COMPOSE"],
    difficulty: "medium",
    questionType: "single_choice",
    contentBlocks: [
      { type: "text", content: "Diketahui dua fungsi berikut. Tentukan nilai komposisi (f ∘ g)(2)." },
      { type: "math", latex: "f(x) = 2x + 1" },
      { type: "math", latex: "g(x) = x - 1" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "2" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "3" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "5" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "7" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "9" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Komposisi (f ∘ g)(2) artinya hitung g(2) dulu, hasilnya masuk ke f." },
        { type: "math", latex: "g(2) = 2 - 1 = 1, \\quad f(1) = 2(1) + 1 = 3" },
      ],
      commonMistake: [
        { type: "text", content: "Tertukar urutan menjadi (g ∘ f)(2) = 2(5) − ... atau menghitung f(2) langsung." },
      ],
      solvingTip: [
        { type: "text", content: "Baca komposisi dari kanan: fungsi paling kanan dikerjakan duluan." },
      ],
    },
    sourceType: "original_internal",
    sourceReference: "TKA-SMA internal P5.1 (karang internal, terverifikasi hitungan node)",
    estimatedTimeSeconds: 120,
  },
  {
    code: "MAT-ALG-004",
    subjectCode: "MATH",
    topicCode: "MATH.ALG",
    subtopicCode: "MATH.ALG.SEQ",
    skillCodes: ["MATH.ALG.SEQ.ARITH"],
    difficulty: "easy",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Diketahui barisan aritmetika dengan suku pertama dan beda berikut. Tentukan suku ke-12.",
      },
      { type: "math", latex: "a = 5, \\quad b = 4, \\quad U_{12} = ?" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "45" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "48" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "49" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "53" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "60" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Gunakan rumus suku ke-n barisan aritmetika." },
        { type: "math", latex: "U_n = a + (n-1)b \\Rightarrow U_{12} = 5 + 11 \\times 4 = 5 + 44 = 49" },
      ],
      commonMistake: [
        { type: "text", content: "Memakai 12 × beda tanpa mengurang 1 (mendapat 53) atau lupa menambah suku pertama." },
      ],
      solvingTip: [
        { type: "text", content: "Ingat polanya: lompatannya selalu (n − 1) kali beda, bukan n kali." },
      ],
    },
    sourceType: "original_internal",
    sourceReference: "TKA-SMA internal P5.1 (karang internal, terverifikasi hitungan node)",
    estimatedTimeSeconds: 90,
  },
  {
    code: "MAT-ALG-005",
    subjectCode: "MATH",
    topicCode: "MATH.ALG",
    subtopicCode: "MATH.ALG.SEQ",
    skillCodes: ["MATH.ALG.SEQ.GEO"],
    difficulty: "medium",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Diketahui deret geometri dengan suku pertama dan rasio berikut. Tentukan jumlah 6 suku pertama.",
      },
      { type: "math", latex: "3 + 6 + 12 + 24 + \\dots, \\quad r = 2" },
      { type: "math", latex: "S_6 = ?" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "93" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "96" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "189" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "192" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "381" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Gunakan rumus jumlah n suku deret geometri dengan r > 1." },
        { type: "math", latex: "S_n = a\\frac{r^n - 1}{r - 1} \\Rightarrow S_6 = 3\\frac{2^6 - 1}{2 - 1} = 3 \\times 63 = 189" },
      ],
      commonMistake: [
        {
          type: "text",
          content: "Menjumlahkan manual lalu salah di suku besar, atau memakai rumus r < 1.",
        },
      ],
      solvingTip: [
        { type: "text", content: "Cek cepat: 6 suku = 3+6+12+24+48+96 = 189, cocok dengan rumus." },
      ],
    },
    sourceType: "original_internal",
    sourceReference: "TKA-SMA internal P5.1 (karang internal, terverifikasi hitungan node)",
    estimatedTimeSeconds: 150,
  },
  {
    code: "MAT-GEO-001",
    subjectCode: "MATH",
    topicCode: "MATH.GEO",
    subtopicCode: "MATH.GEO.OBJ",
    skillCodes: ["MATH.GEO.OBJ.PYTHAG"],
    difficulty: "easy",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Sebuah segitiga siku-siku memiliki sisi miring dan satu sisi tegak berikut. Tentukan panjang sisi tegak yang lain.",
      },
      { type: "math", latex: "c = 5, \\quad a = 3, \\quad b = ?" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "2" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "4" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "8" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "\\sqrt{34}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "16" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Teorema Pythagoras: sisi miring kuadrat = jumlah kuadrat sisi tegak." },
        { type: "math", latex: "b = \\sqrt{c^2 - a^2} = \\sqrt{25 - 9} = \\sqrt{16} = 4" },
      ],
      commonMistake: [
        { type: "text", content: "Menjumlahkan 25 + 9 (mendapat √34) karena lupa yang dicari sisi tegak, bukan miring." },
      ],
      solvingTip: [
        { type: "text", content: "Kenali tripel 3-4-5: kalau miringnya 5 dan satu sisinya 3, sisanya pasti 4." },
      ],
    },
    sourceType: "original_internal",
    sourceReference: "TKA-SMA internal P5.1 (karang internal, terverifikasi hitungan node)",
    estimatedTimeSeconds: 90,
  },
  {
    code: "MAT-GEO-002",
    subjectCode: "MATH",
    topicCode: "MATH.GEO",
    subtopicCode: "MATH.GEO.OBJ",
    skillCodes: ["MATH.GEO.OBJ.PYTHAG"],
    difficulty: "medium",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Sebuah tangga disandarkan ke dinding. Kaki tangga berjarak tertentu dari dinding dan tangga memiliki panjang berikut. Tentukan tinggi ujung tangga dari lantai.",
      },
      { type: "math", latex: "\\text{jarak kaki ke dinding} = 5\\text{ m}, \\quad \\text{panjang tangga} = 13\\text{ m}" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "8\\text{ m}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "12\\text{ m}" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "14\\text{ m}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "\\sqrt{194}\\text{ m}" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "18\\text{ m}" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Tangga, dinding, dan lantai membentuk segitiga siku-siku; tangga = sisi miring." },
        { type: "math", latex: "t = \\sqrt{13^2 - 5^2} = \\sqrt{169 - 25} = \\sqrt{144} = 12\\text{ m}" },
      ],
      commonMistake: [
        { type: "text", content: "Mengira 13 + 5 atau 13 − 5 langsung tanpa kuadrat-akar." },
      ],
      solvingTip: [
        { type: "text", content: "Kenali tripel 5-12-13 seperti halnya 3-4-5 — langsung ketemu 12." },
      ],
    },
    sourceType: "original_internal",
    sourceReference: "TKA-SMA internal P5.1 (karang internal, terverifikasi hitungan node)",
    estimatedTimeSeconds: 120,
  },
  {
    code: "MAT-DAT-001",
    subjectCode: "MATH",
    topicCode: "MATH.DAT",
    subtopicCode: "MATH.DAT.DATA",
    skillCodes: ["MATH.DAT.DATA.CENTER"],
    difficulty: "easy",
    questionType: "single_choice",
    contentBlocks: [
      {
        type: "text",
        content: "Nilai ulangan lima siswa adalah sebagai berikut. Tentukan rata-rata (mean) nilai tersebut.",
      },
      { type: "math", latex: "6, \\; 7, \\; 6, \\; 8, \\; 8" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "6" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "6{,}5" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "7" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "7{,}5" }], isCorrect: false },
      { blocks: [{ type: "math", latex: "8" }], isCorrect: false },
    ],
    explanation: {
      blocks: [
        { type: "text", content: "Mean = jumlah seluruh data dibagi banyak data." },
        { type: "math", latex: "\\bar{x} = \\frac{6 + 7 + 6 + 8 + 8}{5} = \\frac{35}{5} = 7" },
      ],
      commonMistake: [
        { type: "text", content: "Tertukar dengan modus (6 atau 8, keduanya muncul dua kali) atau median tanpa mengurutkan." },
      ],
      solvingTip: [
        { type: "text", content: "Jumlahkan dulu semuanya (35), baru bagi 5 — jangan menebak dari nilai tengah." },
      ],
    },
    sourceType: "original_internal",
    sourceReference: "TKA-SMA internal P5.1 (karang internal, terverifikasi hitungan node)",
    estimatedTimeSeconds: 90,
  },
];

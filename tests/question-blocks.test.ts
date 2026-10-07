import { test } from "node:test";
import assert from "node:assert/strict";
import {
  chartBlockSchema,
  contentBlockSchema,
  explanationSectionSchema,
  functionGraphBlockSchema,
  imageBlockSchema,
  mathBlockSchema,
  questionOptionSchema,
  tableBlockSchema,
  textBlockSchema,
} from "../src/domain/question/content-blocks.ts";
import { checkPublishGate } from "../src/domain/question/publish-gate.ts";

function drafLengkap() {
  return {
    subjectCode: "matematika",
    topicCode: "ALG",
    subtopicCode: "FUNC",
    skillCodes: ["MATH.ALG.FUNC.QUAD.INTERPRET"],
    difficulty: "medium",
    questionType: "single_choice",
    contentBlocks: [
      { type: "text", content: "Perhatikan grafik berikut." },
      { type: "function_graph", expressions: ["y=x^2-4x+3"] },
      { type: "math", latex: "f(x)=x^2-4x+3" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "x=1 \\text{ atau } x=3" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "x=0 \\text{ atau } x=4" }], isCorrect: false },
    ],
    explanation: {
      blocks: [{ type: "text", content: "Faktorkan: (x-1)(x-3)=0." }],
      commonMistake: [{ type: "text", content: "Lupa memfaktorkan konstanta." }],
      solvingTip: [{ type: "text", content: "Cek hasil dengan substitusi balik." }],
    },
    sourceType: "original_internal",
    estimatedTimeSeconds: 120,
    reviewedBy: "reviewer_001",
  };
}

test("blok text valid lolos", () => {
  const hasil = textBlockSchema.safeParse({ type: "text", content: "Halo TKA." });
  assert.equal(hasil.success, true);
});

test("blok math valid lolos", () => {
  const hasil = mathBlockSchema.safeParse({ type: "math", latex: "f(x)=x^2-4x+3" });
  assert.equal(hasil.success, true);
});

test("blok image valid lolos", () => {
  const hasil = imageBlockSchema.safeParse({
    type: "image",
    assetId: "asset_123",
    alt: "Diagram gaya pada sebuah balok",
    caption: null,
  });
  assert.equal(hasil.success, true);
});

test("blok table valid lolos", () => {
  const hasil = tableBlockSchema.safeParse({
    type: "table",
    columns: ["x", "f(x)"],
    rows: [["1", "2"], ["2", "5"]],
  });
  assert.equal(hasil.success, true);
});

test("blok chart valid lolos", () => {
  const hasil = chartBlockSchema.safeParse({
    type: "chart",
    chartType: "bar",
    labels: ["A", "B"],
    datasets: [{ label: "Nilai", values: [7, 9] }],
  });
  assert.equal(hasil.success, true);
});

test("blok function_graph valid lolos", () => {
  const hasil = functionGraphBlockSchema.safeParse({
    type: "function_graph",
    expressions: ["y=x^2-4x+3"],
  });
  assert.equal(hasil.success, true);
});

test("opsi dan explanation valid lolos", () => {
  const opsi = questionOptionSchema.safeParse({
    blocks: [{ type: "text", content: "Opsi A" }],
    isCorrect: false,
  });
  assert.equal(opsi.success, true);
  const ekspl = explanationSectionSchema.safeParse({
    blocks: [{ type: "text", content: "Karena ..." }],
    commonMistake: [{ type: "text", content: "Sering keliru tanda." }],
    solvingTip: [{ type: "text", content: "Coba substitusi." }],
  });
  assert.equal(ekspl.success, true);
});

test("publish gate lolos untuk draf lengkap", () => {
  const hasil = checkPublishGate(drafLengkap());
  assert.equal(hasil.ok, true);
  assert.equal(hasil.errors.length, 0);
});

test("tipe blok tak dikenal ditolak", () => {
  const hasil = contentBlockSchema.safeParse({ type: "video", url: "https://x/y.mp4" });
  assert.equal(hasil.success, false);
});

test("latex kosong ditolak", () => {
  const hasil = mathBlockSchema.safeParse({ type: "math", latex: "   " });
  assert.equal(hasil.success, false);
});

test("baris tabel tak konsisten ditolak", () => {
  const hasil = tableBlockSchema.safeParse({
    type: "table",
    columns: ["x", "f(x)"],
    rows: [["1", "2", "3"]],
  });
  assert.equal(hasil.success, false);
});

test("gambar tanpa alt ditolak skema", () => {
  const hasil = imageBlockSchema.safeParse({ type: "image", assetId: "a1", alt: "  " });
  assert.equal(hasil.success, false);
});

test("publish gate menolak draf tanpa skill dan tanpa reviewer", () => {
  const draf = drafLengkap();
  draf.skillCodes = [];
  draf.reviewedBy = "";
  const hasil = checkPublishGate(draf);
  assert.equal(hasil.ok, false);
  const fields = hasil.errors.map((e) => e.field);
  assert.ok(fields.some((f) => f.includes("skillCodes")));
  assert.ok(fields.some((f) => f.includes("reviewedBy")));
});

test("publish gate menolak opsi tanpa jawaban benar", () => {
  const draf = drafLengkap();
  draf.options = [
    { blocks: [{ type: "text", content: "A" }], isCorrect: false },
    { blocks: [{ type: "text", content: "B" }], isCorrect: false },
  ];
  const hasil = checkPublishGate(draf);
  assert.equal(hasil.ok, false);
  assert.ok(hasil.errors.some((e) => e.field === "options"));
});

test("publish gate menolak alt text terlalu pendek", () => {
  const draf = drafLengkap();
  draf.contentBlocks = [{ type: "image", assetId: "a1", alt: "foto" }];
  const hasil = checkPublishGate(draf);
  assert.equal(hasil.ok, false);
  assert.ok(hasil.errors.some((e) => e.field === "image.alt"));
});

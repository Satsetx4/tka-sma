// P5.6 — Tes 3 soal Trigonometri + cakupan bank 30 (TANPA DB).
import { test } from "node:test";
import assert from "node:assert/strict";
import { P56_QUESTIONS } from "../src/server/db/p56-questions.ts";
import { P51_QUESTIONS } from "../src/server/db/p51-questions.ts";
import { P52_QUESTIONS } from "../src/server/db/p52-questions.ts";
import { P53_QUESTIONS } from "../src/server/db/p53-questions.ts";
import { P54_QUESTIONS } from "../src/server/db/p54-questions.ts";
import { P55_QUESTIONS } from "../src/server/db/p55-questions.ts";
import { SKILLS, SUBJECTS, SUBTOPICS, TOPICS } from "../src/server/db/taxonomy-data.ts";
import { checkPublishGate } from "../src/domain/question/publish-gate.ts";

const KODE_TOPIC = new Set(TOPICS.map((t) => t.code.toUpperCase()));
const KODE_SUBTOPIC = new Set(SUBTOPICS.map((s) => s.code.toUpperCase()));
const KODE_SKILL = new Set(SKILLS.map((k) => k.code.toUpperCase()));
const SEMUA = [...P51_QUESTIONS, ...P52_QUESTIONS, ...P53_QUESTIONS, ...P54_QUESTIONS, ...P55_QUESTIONS, ...P56_QUESTIONS];

test("P5.6: 3 soal TRG, kode unik + taksonomi valid + publish-gate lolos", () => {
  assert.equal(P56_QUESTIONS.length, 3);
  for (const q of P56_QUESTIONS) {
    assert.equal(q.topicCode.toUpperCase(), "MATH.TRG", q.code);
    assert.ok(KODE_TOPIC.has(q.topicCode.toUpperCase()), q.code);
    assert.ok(KODE_SUBTOPIC.has(q.subtopicCode.toUpperCase()), q.code);
    for (const sk of q.skillCodes) assert.ok(KODE_SKILL.has(sk.toUpperCase()), `${q.code} → ${sk}`);
    assert.equal(q.options.length, 5, q.code);
    assert.equal(q.options.filter((o) => o.isCorrect).length, 1, q.code);
    const hasil = checkPublishGate({ ...q, reviewedBy: "reviewer-dummy-test" });
    assert.equal(hasil.ok, true, `${q.code}: ${hasil.errors.map((e) => e.message).join("; ")}`);
  }
  const kunci: Record<string, number> = { "MAT-TRG-001": 2, "MAT-TRG-002": 1, "MAT-TRG-003": 1 };
  for (const q of P56_QUESTIONS) {
    assert.equal(q.options.findIndex((o) => o.isCorrect), kunci[q.code], q.code);
  }
});

test("P5.6: total 30 soal, kode unik lintas batch, 5/5 topic terisi", () => {
  assert.equal(SEMUA.length, 30);
  assert.equal(new Set(SEMUA.map((q) => q.code)).size, 30);
  const topics = new Set(SEMUA.map((q) => q.topicCode.toUpperCase()));
  for (const t of ["MATH.BIL", "MATH.ALG", "MATH.GEO", "MATH.TRG", "MATH.DAT"]) {
    assert.ok(topics.has(t), `topic bolong: ${t}`);
  }
});

test("P5.6: 6/6 tipe renderer kepakai", () => {
  const tipe = new Set<string>();
  for (const q of SEMUA) for (const b of q.contentBlocks) tipe.add(b.type);
  for (const t of ["text", "math", "table", "chart", "function_graph", "image"]) {
    assert.ok(tipe.has(t), `renderer bolong: ${t}`);
  }
});

test("P5.6: difficulty terdistribusi (easy+medium+hard ada)", () => {
  const d = new Set(SEMUA.map((q) => q.difficulty));
  assert.ok(d.has("easy") && d.has("medium") && d.has("hard"), `difficulty: ${[...d]}`);
});

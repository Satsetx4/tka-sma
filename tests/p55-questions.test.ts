// P5.5 — Tes contoh PG kompleks (TANPA DB).
import { test } from "node:test";
import assert from "node:assert/strict";
import { P55_QUESTIONS, nilaiMultipleChoice } from "../src/server/db/p55-questions.ts";
import { SKILLS, SUBJECTS, SUBTOPICS, TOPICS } from "../src/server/db/taxonomy-data.ts";
import { checkPublishGate } from "../src/domain/question/publish-gate.ts";

const KODE_SUBJECT = new Set(SUBJECTS.map((s) => s.code.toUpperCase()));
const KODE_TOPIC = new Set(TOPICS.map((t) => t.code.toUpperCase()));
const KODE_SUBTOPIC = new Set(SUBTOPICS.map((s) => s.code.toUpperCase()));
const KODE_SKILL = new Set(SKILLS.map((k) => k.code.toUpperCase()));

test("P5.5: 2 contoh multiple_choice, kode unik", () => {
  assert.equal(P55_QUESTIONS.length, 2);
  assert.equal(new Set(P55_QUESTIONS.map((q) => q.code)).size, 2);
  for (const q of P55_QUESTIONS) assert.equal(q.questionType, "multiple_choice", q.code);
});

test("P5.5: MCMA punya >1 benar; kategori tiap pernyataan dinilai", () => {
  const mcma = P55_QUESTIONS.find((q) => q.code === "MAT-BIL-003");
  assert.ok(mcma);
  assert.equal(mcma.options.filter((o) => o.isCorrect).length, 2);
  const kat = P55_QUESTIONS.find((q) => q.code === "MAT-GEO-007");
  assert.ok(kat);
  assert.equal(kat.options.filter((o) => o.isCorrect).length, 2);
  assert.ok(kat.contentBlocks.some((b) => b.type === "table"), "kategori memakai tabel pernyataan");
});

test("P5.5: aturan penilaian — himpunan harus sama persis", () => {
  const kunci = [true, false, false, false, true];
  assert.equal(nilaiMultipleChoice(kunci, [true, false, false, false, true]), true);
  assert.equal(nilaiMultipleChoice(kunci, [true, false, false, false, false]), false);
  assert.equal(nilaiMultipleChoice(kunci, [true, true, false, false, true]), false);
  assert.equal(nilaiMultipleChoice(kunci, [true, false, false, false]), false);
});

test("P5.5: taksonomi FROZEN valid + publish-gate lolos", () => {
  for (const q of P55_QUESTIONS) {
    assert.ok(KODE_SUBJECT.has(q.subjectCode.toUpperCase()), `subject: ${q.code}`);
    assert.ok(KODE_TOPIC.has(q.topicCode.toUpperCase()), `topic: ${q.code}`);
    assert.ok(KODE_SUBTOPIC.has(q.subtopicCode.toUpperCase()), `subtopic: ${q.code}`);
    for (const sk of q.skillCodes) assert.ok(KODE_SKILL.has(sk.toUpperCase()), `skill: ${q.code}`);
    assert.ok(q.explanation.blocks.length >= 1, `${q.code}: penjelasan`);
    assert.ok((q.explanation.commonMistake?.length ?? 0) >= 1, `${q.code}: commonMistake`);
    assert.ok((q.explanation.solvingTip?.length ?? 0) >= 1, `${q.code}: solvingTip`);
    const hasil = checkPublishGate({ ...q, reviewedBy: "reviewer-dummy-test" });
    assert.equal(hasil.ok, true, `${q.code}: ${hasil.errors.map((e) => `${e.field}: ${e.message}`).join("; ")}`);
  }
});

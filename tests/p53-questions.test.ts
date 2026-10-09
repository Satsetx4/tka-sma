// P5.3 — Tes data 5 soal grafik fungsi (TANPA DB).
import { test } from "node:test";
import assert from "node:assert/strict";
import { P53_QUESTIONS } from "../src/server/db/p53-questions.ts";
import { SKILLS, SUBJECTS, SUBTOPICS, TOPICS } from "../src/server/db/taxonomy-data.ts";
import { checkPublishGate } from "../src/domain/question/publish-gate.ts";

const KODE_SUBJECT = new Set(SUBJECTS.map((s) => s.code.toUpperCase()));
const KODE_TOPIC = new Set(TOPICS.map((t) => t.code.toUpperCase()));
const KODE_SUBTOPIC = new Set(SUBTOPICS.map((s) => s.code.toUpperCase()));
const KODE_SKILL = new Set(SKILLS.map((k) => k.code.toUpperCase()));

test("P5.3: tepat 5 soal, kode unik + ada blok function_graph", () => {
  assert.equal(P53_QUESTIONS.length, 5);
  assert.equal(new Set(P53_QUESTIONS.map((q) => q.code)).size, 5);
  for (const q of P53_QUESTIONS) {
    assert.ok(
      q.contentBlocks.some((b) => b.type === "function_graph"),
      `${q.code}: wajib ada blok function_graph`,
    );
  }
});

test("P5.3: taksonomi code FROZEN valid + konsisten parent", () => {
  const subtopicKeTopic = new Map(SUBTOPICS.map((s) => [s.code.toUpperCase(), s.parentCode.toUpperCase()]));
  const topicKeSubject = new Map(TOPICS.map((t) => [t.code.toUpperCase(), t.parentCode.toUpperCase()]));
  const skillKeSubtopic = new Map(SKILLS.map((k) => [k.code.toUpperCase(), k.parentCode.toUpperCase()]));
  for (const q of P53_QUESTIONS) {
    assert.ok(KODE_SUBJECT.has(q.subjectCode.toUpperCase()), `subject: ${q.code}`);
    assert.ok(KODE_TOPIC.has(q.topicCode.toUpperCase()), `topic: ${q.code}`);
    assert.ok(KODE_SUBTOPIC.has(q.subtopicCode.toUpperCase()), `subtopic: ${q.code}`);
    assert.equal(topicKeSubject.get(q.topicCode.toUpperCase()), q.subjectCode.toUpperCase(), `topic↔subject: ${q.code}`);
    assert.equal(subtopicKeTopic.get(q.subtopicCode.toUpperCase()), q.topicCode.toUpperCase(), `subtopic↔topic: ${q.code}`);
    for (const sk of q.skillCodes) {
      assert.ok(KODE_SKILL.has(sk.toUpperCase()), `skill: ${q.code} → ${sk}`);
      assert.equal(skillKeSubtopic.get(sk.toUpperCase()), q.subtopicCode.toUpperCase(), `skill↔subtopic: ${q.code}`);
    }
  }
});

test("P5.3: 5 opsi tepat 1 benar + penjelasan lengkap", () => {
  for (const q of P53_QUESTIONS) {
    assert.equal(q.questionType, "single_choice", q.code);
    assert.equal(q.options.length, 5, `${q.code}: opsi harus 5`);
    assert.equal(q.options.filter((o) => o.isCorrect).length, 1, `${q.code}: tepat 1 benar`);
    assert.ok(q.explanation.blocks.length >= 1, `${q.code}: penjelasan`);
    assert.ok((q.explanation.commonMistake?.length ?? 0) >= 1, `${q.code}: commonMistake`);
    assert.ok((q.explanation.solvingTip?.length ?? 0) >= 1, `${q.code}: solvingTip`);
    assert.ok(q.estimatedTimeSeconds > 0, `${q.code}: waktu`);
    assert.equal(q.sourceType, "original_internal", q.code);
  }
});

test("P5.3: publish-gate lolos (dengan reviewedBy dummy)", () => {
  for (const q of P53_QUESTIONS) {
    const hasil = checkPublishGate({ ...q, reviewedBy: "reviewer-dummy-test" });
    assert.equal(hasil.ok, true, `${q.code}: ${hasil.errors.map((e) => `${e.field}: ${e.message}`).join("; ")}`);
  }
});

test("P5.3: kunci jawaban sesuai hitungan terverifikasi", () => {
  const kunci: Record<string, number> = {
    "MAT-ALG-006": 0,
    "MAT-ALG-007": 0,
    "MAT-ALG-008": 0,
    "MAT-ALG-009": 0,
    "MAT-ALG-010": 2,
  };
  for (const q of P53_QUESTIONS) {
    assert.equal(q.options.findIndex((o) => o.isCorrect), kunci[q.code], `${q.code}: posisi kunci`);
  }
});

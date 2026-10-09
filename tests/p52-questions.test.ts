// P5.2 — Tes data 5 soal tabel/chart (TANPA DB).
import { test } from "node:test";
import assert from "node:assert/strict";
import { P52_QUESTIONS } from "../src/server/db/p52-questions.ts";
import { SKILLS, SUBJECTS, SUBTOPICS, TOPICS } from "../src/server/db/taxonomy-data.ts";
import { checkPublishGate } from "../src/domain/question/publish-gate.ts";

const KODE_SUBJECT = new Set(SUBJECTS.map((s) => s.code.toUpperCase()));
const KODE_TOPIC = new Set(TOPICS.map((t) => t.code.toUpperCase()));
const KODE_SUBTOPIC = new Set(SUBTOPICS.map((s) => s.code.toUpperCase()));
const KODE_SKILL = new Set(SKILLS.map((k) => k.code.toUpperCase()));

test("P5.2: tepat 5 soal, kode unik", () => {
  assert.equal(P52_QUESTIONS.length, 5);
  assert.equal(new Set(P52_QUESTIONS.map((q) => q.code)).size, 5);
});

test("P5.2: taksonomi code FROZEN valid + konsisten parent", () => {
  const subtopicKeTopic = new Map(SUBTOPICS.map((s) => [s.code.toUpperCase(), s.parentCode.toUpperCase()]));
  const topicKeSubject = new Map(TOPICS.map((t) => [t.code.toUpperCase(), t.parentCode.toUpperCase()]));
  const skillKeSubtopic = new Map(SKILLS.map((k) => [k.code.toUpperCase(), k.parentCode.toUpperCase()]));
  for (const q of P52_QUESTIONS) {
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

test("P5.2: tabel konsisten + chart labels=values, 5 opsi tepat 1 benar", () => {
  for (const q of P52_QUESTIONS) {
    assert.equal(q.questionType, "single_choice", q.code);
    let adaTabelAtauChart = false;
    for (const b of q.contentBlocks) {
      if (b.type === "table") {
        adaTabelAtauChart = true;
        for (const [i, baris] of b.rows.entries()) {
          assert.equal(baris.length, b.columns.length, `${q.code}: baris ${i + 1} ≠ kolom`);
        }
      } else if (b.type === "chart") {
        adaTabelAtauChart = true;
        assert.ok(["bar", "line", "pie", "scatter"].includes(b.chartType), `${q.code}: chartType`);
        for (const ds of b.datasets) {
          assert.equal(ds.values.length, b.labels.length, `${q.code}: values ≠ labels`);
        }
      } else {
        assert.ok(b.type === "text" || b.type === "math", `${q.code}: blok ${b.type}`);
      }
    }
    assert.ok(adaTabelAtauChart, `${q.code}: wajib ada blok table/chart`);
    assert.equal(q.options.length, 5, `${q.code}: opsi harus 5`);
    assert.equal(q.options.filter((o) => o.isCorrect).length, 1, `${q.code}: tepat 1 benar`);
    assert.ok(q.explanation.blocks.length >= 1, `${q.code}: penjelasan`);
    assert.ok((q.explanation.commonMistake?.length ?? 0) >= 1, `${q.code}: commonMistake`);
    assert.ok((q.explanation.solvingTip?.length ?? 0) >= 1, `${q.code}: solvingTip`);
    assert.ok(q.estimatedTimeSeconds > 0, `${q.code}: waktu`);
    assert.equal(q.sourceType, "original_internal", q.code);
  }
});

test("P5.2: publish-gate lolos (dengan reviewedBy dummy)", () => {
  for (const q of P52_QUESTIONS) {
    const hasil = checkPublishGate({ ...q, reviewedBy: "reviewer-dummy-test" });
    assert.equal(hasil.ok, true, `${q.code}: ${hasil.errors.map((e) => `${e.field}: ${e.message}`).join("; ")}`);
  }
});

test("P5.2: kunci jawaban sesuai hitungan terverifikasi", () => {
  const kunci: Record<string, number> = {
    "MAT-DAT-002": 2,
    "MAT-DAT-003": 1,
    "MAT-DAT-004": 3,
    "MAT-DAT-005": 2,
    "MAT-DAT-006": 2,
  };
  for (const q of P52_QUESTIONS) {
    assert.equal(q.options.findIndex((o) => o.isCorrect), kunci[q.code], `${q.code}: posisi kunci`);
  }
});

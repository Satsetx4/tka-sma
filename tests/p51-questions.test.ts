// P5.1 — Tes data 10 soal teks/math (TANPA DB).
//
// Mengimpor LANGSUNG dari src/server/db/p51-questions.ts — file itu murni
// data sehingga aman di bawah plain `node --test`. Menjamin: jumlah 10,
// kode unik, taksonomi code FROZEN valid, blok text/math saja, 5 opsi
// dengan tepat 1 benar, publish-gate lolos (dengan reviewedBy dummy —
// review akademik manusia tetap wajib di dunia nyata).
import { test } from "node:test";
import assert from "node:assert/strict";
import { P51_QUESTIONS } from "../src/server/db/p51-questions.ts";
import { SKILLS, SUBJECTS, SUBTOPICS, TOPICS } from "../src/server/db/taxonomy-data.ts";
import { checkPublishGate } from "../src/domain/question/publish-gate.ts";

const KODE_SUBJECT = new Set(SUBJECTS.map((s) => s.code.toUpperCase()));
const KODE_TOPIC = new Set(TOPICS.map((t) => t.code.toUpperCase()));
const KODE_SUBTOPIC = new Set(SUBTOPICS.map((s) => s.code.toUpperCase()));
const KODE_SKILL = new Set(SKILLS.map((k) => k.code.toUpperCase()));

test("P5.1: tepat 10 soal, kode unik", () => {
  assert.equal(P51_QUESTIONS.length, 10);
  const kode = P51_QUESTIONS.map((q) => q.code);
  assert.equal(new Set(kode).size, 10);
});

test("P5.1: taksonomi code FROZEN valid + konsisten parent", () => {
  const subtopicKeTopic = new Map(SUBTOPICS.map((s) => [s.code.toUpperCase(), s.parentCode.toUpperCase()]));
  const topicKeSubject = new Map(TOPICS.map((t) => [t.code.toUpperCase(), t.parentCode.toUpperCase()]));
  const skillKeSubtopic = new Map(SKILLS.map((k) => [k.code.toUpperCase(), k.parentCode.toUpperCase()]));
  for (const q of P51_QUESTIONS) {
    assert.ok(KODE_SUBJECT.has(q.subjectCode.toUpperCase()), `subject tak dikenal: ${q.code}`);
    assert.ok(KODE_TOPIC.has(q.topicCode.toUpperCase()), `topic tak dikenal: ${q.code}`);
    assert.ok(KODE_SUBTOPIC.has(q.subtopicCode.toUpperCase()), `subtopic tak dikenal: ${q.code}`);
    assert.equal(topicKeSubject.get(q.topicCode.toUpperCase()), q.subjectCode.toUpperCase(), `topic↔subject: ${q.code}`);
    assert.equal(
      subtopicKeTopic.get(q.subtopicCode.toUpperCase()),
      q.topicCode.toUpperCase(),
      `subtopic↔topic: ${q.code}`,
    );
    for (const sk of q.skillCodes) {
      assert.ok(KODE_SKILL.has(sk.toUpperCase()), `skill tak dikenal: ${q.code} → ${sk}`);
      assert.equal(
        skillKeSubtopic.get(sk.toUpperCase()),
        q.subtopicCode.toUpperCase(),
        `skill↔subtopic: ${q.code} → ${sk}`,
      );
    }
  }
});

test("P5.1: blok text/math saja, 5 opsi tepat 1 benar", () => {
  for (const q of P51_QUESTIONS) {
    assert.equal(q.questionType, "single_choice", q.code);
    for (const b of q.contentBlocks) {
      assert.ok(b.type === "text" || b.type === "math", `${q.code}: tipe blok ${b.type}`);
    }
    assert.equal(q.options.length, 5, `${q.code}: opsi harus 5`);
    assert.equal(
      q.options.filter((o) => o.isCorrect).length,
      1,
      `${q.code}: tepat 1 benar`,
    );
    for (const o of q.options) {
      for (const b of o.blocks) assert.ok(b.type === "text" || b.type === "math", `${q.code}: opsi ${b.type}`);
    }
    assert.ok(q.explanation.blocks.length >= 1, `${q.code}: penjelasan kosong`);
    assert.ok((q.explanation.commonMistake?.length ?? 0) >= 1, `${q.code}: commonMistake kosong`);
    assert.ok((q.explanation.solvingTip?.length ?? 0) >= 1, `${q.code}: solvingTip kosong`);
    assert.ok(q.estimatedTimeSeconds > 0, `${q.code}: estimasi waktu 0`);
    assert.equal(q.sourceType, "original_internal", q.code);
  }
});

test("P5.1: publish-gate lolos (dengan reviewedBy dummy)", () => {
  for (const q of P51_QUESTIONS) {
    const hasil = checkPublishGate({ ...q, reviewedBy: "reviewer-dummy-test" });
    assert.equal(hasil.ok, true, `${q.code}: ${hasil.errors.map((e) => `${e.field}: ${e.message}`).join("; ")}`);
  }
});

test("P5.1: kunci jawaban sesuai hitungan terverifikasi", () => {
  const kunci: Record<string, number> = {
    "MAT-BIL-001": 1,
    "MAT-BIL-002": 1,
    "MAT-ALG-001": 2,
    "MAT-ALG-002": 0,
    "MAT-ALG-003": 1,
    "MAT-ALG-004": 2,
    "MAT-ALG-005": 2,
    "MAT-GEO-001": 1,
    "MAT-GEO-002": 1,
    "MAT-DAT-001": 2,
  };
  for (const q of P51_QUESTIONS) {
    const posisi = q.options.findIndex((o) => o.isCorrect);
    assert.equal(posisi, kunci[q.code], `${q.code}: posisi kunci`);
  }
});

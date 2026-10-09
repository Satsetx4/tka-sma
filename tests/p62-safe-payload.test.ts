// P6.2 — Tes payload aman (TANPA DB).
import { test } from "node:test";
import assert from "node:assert/strict";
import { assertSafePayload, toSafeQuestion } from "../src/domain/practice/safe-payload.ts";
import type { CmsQuestion } from "../src/server/repositories/question-model.ts";

function soalContoh(): CmsQuestion {
  const kini = new Date().toISOString();
  return {
    id: "q1",
    code: "MAT-BIL-001",
    subjectCode: "MATH",
    topicCode: "MATH.BIL",
    subtopicCode: "MATH.BIL.REAL",
    skillCodes: ["MATH.BIL.REAL.OPERATE"],
    difficulty: "easy",
    questionType: "single_choice",
    contentBlocks: [{ type: "text", content: "Hitung." }],
    options: [
      { blocks: [{ type: "text", content: "A" }], isCorrect: false },
      { blocks: [{ type: "text", content: "B" }], isCorrect: true },
    ],
    explanation: {
      blocks: [{ type: "text", content: "Karena B." }],
      commonMistake: [{ type: "text", content: "Salah A." }],
      solvingTip: [{ type: "text", content: "Hitung dulu." }],
    },
    sourceType: "original_internal",
    estimatedTimeSeconds: 90,
    status: "approved",
    createdBy: "admin_1",
    reviewedBy: "reviewer_1",
    publishedAt: null,
    createdAt: kini,
    updatedAt: kini,
  };
}

test("P6.2: payload aman tanpa isCorrect + explanation + identitas staf", () => {
  const aman = toSafeQuestion(soalContoh());
  assert.equal(aman.id, "q1");
  assert.equal(aman.options.length, 2);
  for (const o of aman.options) {
    assert.ok(!("isCorrect" in o), "isCorrect bocor!");
  }
  assert.ok(!("explanation" in aman), "explanation bocor!");
  assertSafePayload(aman);
  assertSafePayload([aman]);
});

test("P6.2: tripwire menangkap kebocoran", () => {
  assert.throws(() => assertSafePayload({ isCorrect: true }), /isCorrect/);
  assert.throws(() => assertSafePayload({ explanation: { blocks: [] } }), /explanation/);
  assert.throws(() => assertSafePayload([{ options: [{ isCorrect: false }] }]), /isCorrect/);
});

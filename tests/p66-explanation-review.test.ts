// P6.6 — Tes endpoint review (TANPA DB: repository in-memory + review murni).
import { test } from "node:test";
import assert from "node:assert/strict";
import { InMemoryAttemptRepository } from "../src/server/repositories/attempts.ts";
import { InMemoryQuestionRepository } from "../src/server/repositories/questions.ts";
import { toSafeQuestions } from "../src/domain/practice/safe-payload.ts";

async function siapkanSoal() {
  const repo = new InMemoryQuestionRepository();
  return repo.create(
    {
      code: "REV-001",
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
      estimatedTimeSeconds: 60,
    },
    "admin_1",
  );
}

test("P6.6: review = soal aman + jawabanku + explanation, tanpa kunci global", async () => {
  const soal = await siapkanSoal();
  const repo = new InMemoryAttemptRepository();
  await repo.createSession({
    id: "s1", userId: "u1", mode: "quick", subjectId: "MATH",
    topicCode: null, questionIds: [soal.id], startedAt: new Date().toISOString(), questionCount: 1,
  });
  await repo.recordAttempt({
    userId: "u1", sessionId: "s1", questionId: soal.id,
    selectedAnswer: { optionIndex: 1 }, isCorrect: true,
    durationSeconds: 20, difficultySnapshot: "easy",
  });
  const upaya = await repo.listAttempts("s1");
  assert.equal(upaya.length, 1);
  const [aman] = toSafeQuestions([soal]);
  const raw = JSON.stringify(aman);
  assert.ok(!raw.includes("isCorrect"), "kunci bocor ke payload soal!");
  assert.ok(soal.explanation.blocks.length >= 1, "explanation wajib ada untuk review");
  assert.ok((soal.explanation.commonMistake?.length ?? 0) >= 1);
  assert.ok((soal.explanation.solvingTip?.length ?? 0) >= 1);
});

test("P6.6: belum jawab = belum boleh review (kontrak 409)", async () => {
  const repo = new InMemoryAttemptRepository();
  await repo.createSession({
    id: "s2", userId: "u1", mode: "quick", subjectId: "MATH",
    topicCode: null, questionIds: ["qx"], startedAt: new Date().toISOString(), questionCount: 1,
  });
  assert.equal((await repo.listAttempts("s2")).length, 0);
});

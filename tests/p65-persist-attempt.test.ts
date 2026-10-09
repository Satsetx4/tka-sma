// P6.5 — Tes persist attempt + riwayat (TANPA DB: repository in-memory).
import { test } from "node:test";
import assert from "node:assert/strict";
import { InMemoryAttemptRepository } from "../src/server/repositories/attempts.ts";

test("P6.5: attempt tercatat lengkap + bisa di-query per sesi", async () => {
  const repo = new InMemoryAttemptRepository();
  await repo.createSession({
    id: "s1", userId: "u1", mode: "quick", subjectId: "MATH",
    topicCode: null, questionIds: ["q1"], startedAt: new Date().toISOString(), questionCount: 1,
  });
  const a = await repo.recordAttempt({
    userId: "u1", sessionId: "s1", questionId: "q1",
    selectedAnswer: { optionIndex: 1 }, isCorrect: true,
    durationSeconds: 42, difficultySnapshot: "medium",
  });
  assert.ok(a.id);
  assert.ok(a.answeredAt);
  assert.deepEqual(a.selectedAnswer, { optionIndex: 1 });
  assert.equal(a.isCorrect, true);
  assert.equal(a.durationSeconds, 42);
  assert.equal(a.difficultySnapshot, "medium");
  assert.equal((await repo.listAttempts("s1")).length, 1);
  assert.equal((await repo.listAttempts("sesi-lain")).length, 0);
});

test("P6.5: riwayat per user lintas sesi, terbaru dulu, milik sendiri saja", async () => {
  const repo = new InMemoryAttemptRepository();
  for (const sid of ["s1", "s2"]) {
    await repo.createSession({
      id: sid, userId: "u1", mode: "quick", subjectId: null,
      topicCode: null, questionIds: ["q1"], startedAt: new Date().toISOString(), questionCount: 1,
    });
  }
  await repo.recordAttempt({ userId: "u1", sessionId: "s1", questionId: "q1", selectedAnswer: { optionIndex: 0 }, isCorrect: true, durationSeconds: 10, difficultySnapshot: "easy" });
  await new Promise((r) => setTimeout(r, 5));
  await repo.recordAttempt({ userId: "u1", sessionId: "s2", questionId: "q1", selectedAnswer: { optionIndex: 1 }, isCorrect: false, durationSeconds: 20, difficultySnapshot: "hard" });
  await repo.recordAttempt({ userId: "orang-lain", sessionId: null, questionId: "q1", selectedAnswer: { optionIndex: 0 }, isCorrect: true, durationSeconds: 5, difficultySnapshot: "easy" });
  const riwayat = await repo.listAttemptsByUser("u1");
  assert.equal(riwayat.length, 2);
  assert.equal(riwayat[0]?.sessionId, "s2");
  assert.equal(riwayat[1]?.sessionId, "s1");
  assert.equal((await repo.listAttemptsByUser("u1", 1)).length, 1);
  assert.equal((await repo.listAttemptsByUser("tak-ada")).length, 0);
});

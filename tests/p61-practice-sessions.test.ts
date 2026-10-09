// P6.1 — Tes service sesi latihan (TANPA DB: repository in-memory).
import { test } from "node:test";
import assert from "node:assert/strict";
import { skorSesi, validasiMulaiSesi } from "../src/domain/practice/session-model.ts";
import { InMemoryAttemptRepository } from "../src/server/repositories/attempts.ts";

test("P6.1 validasi: mode V1 quick/topic lolos, adaptive ditolak", () => {
  const q = ["s1", "s2"];
  assert.equal(validasiMulaiSesi({ mode: "quick", questionIds: q }).ok, true);
  assert.equal(validasiMulaiSesi({ mode: "topic", topicCode: "MATH.ALG", questionIds: q }).ok, true);
  assert.equal(validasiMulaiSesi({ mode: "topic", questionIds: q }).ok, false);
  assert.equal(validasiMulaiSesi({ mode: "adaptive", questionIds: q }).ok, false);
  assert.equal(validasiMulaiSesi({ mode: "quick", questionIds: [] }).ok, false);
  assert.equal(validasiMulaiSesi({ mode: "quick", questionIds: ["a", "a"] }).ok, false);
});

test("P6.1 skor: 7/10=70, 0 soal=0, lebih dari total dijepit", () => {
  assert.equal(skorSesi(7, 10), 70);
  assert.equal(skorSesi(0, 0), 0);
  assert.equal(skorSesi(12, 10), 100);
  assert.equal(skorSesi(10, 10), 100);
});

test("P6.1 repo: buat → daftar → selesai → attempt tercatat", async () => {
  const repo = new InMemoryAttemptRepository();
  const sesi = await repo.createSession({
    id: "sesi-1",
    userId: "u1",
    mode: "quick",
    subjectId: "MATH",
    topicCode: null,
    questionIds: ["q1", "q2", "q3"],
    startedAt: new Date().toISOString(),
    questionCount: 3,
  });
  assert.equal(sesi.finishedAt, null);
  assert.equal((await repo.listSessions("u1")).length, 1);
  assert.equal((await repo.listSessions("orang-lain")).length, 0);
  await repo.recordAttempt({ userId: "u1", sessionId: "sesi-1", questionId: "q1", selectedAnswer: [0], isCorrect: true, durationSeconds: 30, difficultySnapshot: "easy" });
  await repo.recordAttempt({ userId: "u1", sessionId: "sesi-1", questionId: "q2", selectedAnswer: [1], isCorrect: false, durationSeconds: 45, difficultySnapshot: "medium" });
  assert.equal((await repo.listAttempts("sesi-1")).length, 2);
  const selesai = await repo.finishSession("sesi-1", 1, 75);
  assert.ok(selesai?.finishedAt);
  assert.equal(selesai?.correctCount, 1);
  const lagi = await repo.finishSession("sesi-1", 99, 99);
  assert.equal(lagi?.correctCount, 1);
});

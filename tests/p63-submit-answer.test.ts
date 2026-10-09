// P6.3 — Tes validasi submit (TANPA DB).
import { test } from "node:test";
import assert from "node:assert/strict";
import { validasiSubmit } from "../src/domain/practice/submit-model.ts";

test("P6.3 single: optionIndex wajib, multiple ditolak", () => {
  const ok = validasiSubmit({ questionId: "q1", optionIndex: 2 }, "single_choice");
  assert.equal(ok.ok, true);
  assert.deepEqual(ok.data?.selectedAnswer, { optionIndex: 2 });
  assert.equal(validasiSubmit({ questionId: "q1" }, "single_choice").ok, false);
  assert.equal(validasiSubmit({ questionId: "q1", optionIndexes: [0, 1] }, "single_choice").ok, false);
});

test("P6.3 multiple: optionIndexes di-unik-kan + diurutkan", () => {
  const ok = validasiSubmit({ questionId: "q2", optionIndexes: [3, 1, 3] }, "multiple_choice");
  assert.equal(ok.ok, true);
  assert.deepEqual(ok.data?.selectedAnswer, { optionIndexes: [1, 3] });
  assert.equal(validasiSubmit({ questionId: "q2", optionIndexes: [] }, "multiple_choice").ok, false);
  assert.equal(validasiSubmit({ questionId: "q2", optionIndex: 1 }, "multiple_choice").ok, false);
});

test("P6.3 batas: durasi 0..7200, tipe asing ditolak", () => {
  assert.equal(validasiSubmit({ questionId: "q", optionIndex: 0, durationSeconds: 7201 }, "single_choice").ok, false);
  assert.equal(validasiSubmit({ questionId: "", optionIndex: 0 }, "single_choice").ok, false);
  assert.equal(validasiSubmit({ questionId: "q", optionIndex: 0 }, "esai").ok, false);
});

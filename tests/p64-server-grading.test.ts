// P6.4 — Tes penilaian server-side (TANPA DB).
import { test } from "node:test";
import assert from "node:assert/strict";
import { indeksKunci, nilaiJawaban } from "../src/domain/practice/grading.ts";

test("P6.4 single: tepat indeks benar = benar", () => {
  const kunci = [{ isCorrect: false }, { isCorrect: true }, { isCorrect: false }];
  assert.deepEqual(indeksKunci(kunci), [1]);
  assert.equal(nilaiJawaban("single_choice", kunci, { optionIndex: 1 }), true);
  assert.equal(nilaiJawaban("single_choice", kunci, { optionIndex: 0 }), false);
  assert.equal(nilaiJawaban("single_choice", kunci, { optionIndex: 2 }), false);
});

test("P6.4 single: kunci rusak (0/2 benar) = selalu salah", () => {
  assert.equal(nilaiJawaban("single_choice", [{ isCorrect: false }], { optionIndex: 0 }), false);
  const ganda = [{ isCorrect: true }, { isCorrect: true }];
  assert.equal(nilaiJawaban("single_choice", ganda, { optionIndex: 0 }), false);
});

test("P6.4 multiple: himpunan sama persis = benar", () => {
  const kunci = [{ isCorrect: true }, { isCorrect: false }, { isCorrect: true }];
  assert.equal(nilaiJawaban("multiple_choice", kunci, { optionIndexes: [0, 2] }), true);
  assert.equal(nilaiJawaban("multiple_choice", kunci, { optionIndexes: [2, 0] }), true);
  assert.equal(nilaiJawaban("multiple_choice", kunci, { optionIndexes: [0] }), false);
  assert.equal(nilaiJawaban("multiple_choice", kunci, { optionIndexes: [0, 1, 2] }), false);
  assert.equal(nilaiJawaban("multiple_choice", kunci, { optionIndexes: [] }), false);
});

test("P6.4 tipe asing = salah (fail-closed)", () => {
  assert.equal(nilaiJawaban("esai", [{ isCorrect: true }], { optionIndex: 0 }), false);
});

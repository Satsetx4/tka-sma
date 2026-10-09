/**
 * P6.4 — Penilaian jawaban SERVER-SIDE (tanpa I/O, tanpa DB).
 *
 * Aturan (kunci = array isCorrect per opsi dari DB, TIDAK pernah ke client):
 * - single_choice: benar bila TEPAT SATU opsi benar dan indeks pilihan
 *   murid = indeks opsi benar itu.
 * - multiple_choice: benar bila HIMPUNAN indeks pilihan murid SAMA PERSIS
 *   dengan himpunan indeks kunci (tanpa lebih, tanpa kurang) — selaras
 *   aturan P5.5 (nilaiMultipleChoice).
 *
 * Fungsi ini dipakai route answer (P6.3→P6.4) dan kelak tryout (P9.9).
 * selectedAnswer bentuk dari validasiSubmit: { optionIndex } | { optionIndexes }.
 */
export interface KunciOpsi {
  isCorrect: boolean;
}

export type JawabanMurid = { optionIndex: number } | { optionIndexes: number[] };

/** Indeks opsi yang benar menurut kunci. */
export function indeksKunci(kunci: readonly KunciOpsi[]): number[] {
  const hasil: number[] = [];
  kunci.forEach((o, i) => {
    if (o.isCorrect) hasil.push(i);
  });
  return hasil;
}

/**
 * Nilai jawaban murid. Mengembalikan true = benar penuh, false = salah
 * (V1 tanpa nilai parsial — parsial ikut engine adaptif Fase 7 bila perlu).
 */
export function nilaiJawaban(
  questionType: string,
  kunci: readonly KunciOpsi[],
  jawab: JawabanMurid,
): boolean {
  const benar = indeksKunci(kunci);
  if (questionType === "single_choice") {
    if (!("optionIndex" in jawab) || benar.length !== 1) return false;
    return jawab.optionIndex === benar[0];
  }
  if (questionType === "multiple_choice") {
    if (!("optionIndexes" in jawab)) return false;
    const unik = [...new Set(jawab.optionIndexes)].sort((a, b) => a - b);
    const kunciUrut = [...benar].sort((a, b) => a - b);
    if (unik.length !== kunciUrut.length) return false;
    return unik.every((v, i) => v === kunciUrut[i]);
  }
  return false;
}

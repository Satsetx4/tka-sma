/**
 * P6.3 — Model + validasi submit jawaban (tanpa I/O, tanpa DB).
 *
 * Bentuk jawaban V1:
 * - single_choice: { optionIndex: number } (indeks opsi yang dipilih).
 * - multiple_choice: { optionIndexes: number[] } (himpunan indeks).
 *
 * P6.3 HANYA validasi struktur + kepemilikan sesi (penilaian benar/salah
 * = P6.4 server-side). Batas: durasi 0..7200 detik.
 */
import { z } from "zod";

export const MAX_JAWAB_DURASI_DETIK = 7200;

const submitSchema = z.object({
  questionId: z.string().trim().min(1, { error: "questionId wajib diisi." }).max(120),
  optionIndex: z.number().int().min(0).max(49).optional(),
  optionIndexes: z.array(z.number().int().min(0).max(49)).max(50).optional(),
  durationSeconds: z.number().int().min(0).max(MAX_JAWAB_DURASI_DETIK).default(0),
});

export interface SubmitTerstruktur {
  questionId: string;
  selectedAnswer: unknown;
  durationSeconds: number;
}

export interface SubmitCheck {
  ok: boolean;
  data?: SubmitTerstruktur;
  errors: Array<{ field: string; message: string }>;
}

/**
 * Validasi struktur body submit terhadap TIPE soal (single vs multiple).
 * Tepat satu bentuk jawaban wajib diisi sesuai tipenya.
 */
export function validasiSubmit(input: unknown, questionType: string): SubmitCheck {
  const parsed = submitSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((i) => ({
        field: i.path.join(".") || "(root)",
        message: i.message,
      })),
    };
  }
  const d = parsed.data;
  if (questionType === "single_choice") {
    if (d.optionIndex === undefined) {
      return { ok: false, errors: [{ field: "optionIndex", message: "Pilih satu opsi jawaban." }] };
    }
    return { ok: true, data: { questionId: d.questionId, selectedAnswer: { optionIndex: d.optionIndex }, durationSeconds: d.durationSeconds }, errors: [] };
  }
  if (questionType === "multiple_choice") {
    const daftar = d.optionIndexes ?? [];
    if (daftar.length === 0) {
      return { ok: false, errors: [{ field: "optionIndexes", message: "Pilih minimal satu opsi jawaban." }] };
    }
    const unik = [...new Set(daftar)].sort((a, b) => a - b);
    return { ok: true, data: { questionId: d.questionId, selectedAnswer: { optionIndexes: unik }, durationSeconds: d.durationSeconds }, errors: [] };
  }
  return { ok: false, errors: [{ field: "questionType", message: `Tipe soal tidak dikenal: ${questionType}.` }] };
}

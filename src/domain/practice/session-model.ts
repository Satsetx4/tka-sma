/**
 * P6.1 — Model + aturan murni sesi latihan (tanpa I/O, tanpa DB).
 *
 * File ini boleh diimpor dari mana saja (server route, komponen client,
 * maupun tes): tidak ada dependensi server-only. Mode V1: quick + topic
 * dulu (adaptive/mistake_review/diagnostic ikut Fase 7–8).
 *
 * Siklus: dibuat (open) → selesai (finished) — skor = correct/questionCount*100.
 */
import { z } from "zod";

export const practiceModes = ["quick", "topic", "adaptive", "mistake_review", "diagnostic"] as const;
export type PracticeMode = (typeof practiceModes)[number];

/** Mode yang boleh dibuat di V1 (P6.1): quick + topic. */
export const v1CreatableModes: readonly PracticeMode[] = ["quick", "topic"];

export interface PracticeSession {
  id: string;
  userId: string;
  mode: PracticeMode;
  subjectId: string | null;
  topicCode: string | null;
  questionIds: string[];
  startedAt: string;
  finishedAt: string | null;
  questionCount: number;
  correctCount: number;
  durationSeconds: number | null;
}

export interface MulaiSesiInput {
  mode: PracticeMode;
  subjectCode?: string;
  topicCode?: string;
  questionIds: string[];
}

const mulaiSesiSchema = z.object({
  mode: z.enum(practiceModes, { error: "Mode latihan tidak dikenal." }),
  subjectCode: z.string().trim().max(120).default(""),
  topicCode: z.string().trim().max(120).default(""),
  questionIds: z
    .array(z.string().trim().min(1, { error: "Id soal tidak boleh kosong." }))
    .min(1, { error: "Sesi wajib punya minimal satu soal." })
    .max(100, { error: "Sesi maksimal 100 soal." }),
});

export interface MulaiSesiResult {
  ok: boolean;
  errors: Array<{ field: string; message: string }>;
}

/** Validasi input mulai sesi (murni). V1 menolak mode selain quick/topic. */
export function validasiMulaiSesi(input: unknown): MulaiSesiResult {
  const parsed = mulaiSesiSchema.safeParse(input);
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
  if (!(v1CreatableModes as readonly string[]).includes(d.mode)) {
    return {
      ok: false,
      errors: [{ field: "mode", message: `Mode ${d.mode} belum dibuka di V1 (baru: quick, topic).` }],
    };
  }
  if (d.mode === "topic" && d.topicCode === "") {
    return { ok: false, errors: [{ field: "topicCode", message: "Topic wajib diisi untuk mode topic." }] };
  }
  const unik = new Set(d.questionIds);
  if (unik.size !== d.questionIds.length) {
    return { ok: false, errors: [{ field: "questionIds", message: "Ada soal duplikat di sesi." }] };
  }
  return { ok: true, errors: [] };
}

/** Skor 0–100 dari sesi selesai (murni). Sesi tanpa soal = 0. */
export function skorSesi(benar: number, total: number): number {
  if (total <= 0) return 0;
  const b = Math.max(0, Math.min(benar, total));
  return Math.round((b / total) * 100);
}

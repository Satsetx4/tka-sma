/**
 * Validasi struktur payload tulis CMS (POST/PATCH soal).
 *
 * Draf BOLEH belum lengkap (publish gate hanya saat publish, P4.18),
 * tetapi tiap blok/opsi yang dikirim WAJIB valid menurut skema domain —
 * arbitrary HTML/konten tak terstruktur ditolak di sini, bukan saat publish.
 *
 * Enum difficulty/tipe/sumber wajib valid karena kolom DB NOT NULL
 * (default aman bila tak diisi; kelengkapan penuh dinilai publish gate).
 */
import { z } from "zod";
import {
  contentBlockSchema,
  questionOptionSchema,
} from "../../../domain/question/content-blocks.ts";
import type { ContentBlock } from "../../../domain/question/content-blocks.ts";
import {
  difficulties,
  questionTypes,
  sourceTypes,
} from "../../../domain/question/publish-gate.ts";
import type {
  CmsExplanation,
  CmsOption,
  CmsQuestionInput,
} from "../../../server/repositories/question-model.ts";

export interface GalatField {
  field: string;
  message: string;
}

export const inputDrafSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, { error: "Kode soal wajib diisi." })
    .max(120, { error: "Kode soal melebihi batas." }),
  subjectCode: z.string().trim().max(120).default(""),
  topicCode: z.string().trim().max(120).default(""),
  subtopicCode: z.string().trim().max(120).default(""),
  skillCodes: z.array(z.string().trim().min(1)).max(32).default([]),
  difficulty: z.enum(difficulties, { error: "Difficulty tidak valid." }).default("medium"),
  questionType: z.enum(questionTypes, { error: "Tipe soal tidak valid." }).default("single_choice"),
  contentBlocks: z.array(z.unknown()).default([]),
  options: z.array(z.unknown()).default([]),
  explanation: z
    .object({
      blocks: z.array(z.unknown()).default([]),
      commonMistake: z.array(z.unknown()).optional(),
      solvingTip: z.array(z.unknown()).optional(),
    })
    .default({ blocks: [] }),
  sourceType: z.enum(sourceTypes, { error: "Tipe sumber tidak diizinkan." }).default("original_internal"),
  sourceReference: z.string().trim().max(500).optional(),
  estimatedTimeSeconds: z.number().int().min(0).max(7200).default(0),
});

function kumpulBlok(
  daftar: unknown[],
  prefix: string,
  keluar: GalatField[],
): ContentBlock[] {
  const valid: ContentBlock[] = [];
  daftar.forEach((item, i) => {
    const hasil = contentBlockSchema.safeParse(item);
    if (!hasil.success) {
      for (const issue of hasil.error.issues) {
        const sub = issue.path.join(".");
        keluar.push({
          field: sub ? `${prefix}.${i}.${sub}` : `${prefix}.${i}`,
          message: issue.message,
        });
      }
    } else {
      valid.push(hasil.data);
    }
  });
  return valid;
}

/** Validasi penuh body tulis; hasil siap simpan atau daftar galat terstruktur. */
export function parseDrafPenuh(
  body: unknown,
): { ok: true; data: CmsQuestionInput } | { ok: false; errors: GalatField[] } {
  const dasar = inputDrafSchema.safeParse(body);
  if (!dasar.success) {
    return {
      ok: false,
      errors: dasar.error.issues.map((issue) => ({
        field: issue.path.join(".") || "(root)",
        message: issue.message,
      })),
    };
  }
  const d = dasar.data;
  const errors: GalatField[] = [];
  const contentBlocks = kumpulBlok(d.contentBlocks, "contentBlocks", errors);
  const options: CmsOption[] = [];
  d.options.forEach((item, i) => {
    const hasil = questionOptionSchema.safeParse(item);
    if (!hasil.success) {
      for (const issue of hasil.error.issues) {
        const sub = issue.path.join(".");
        errors.push({
          field: sub ? `options.${i}.${sub}` : `options.${i}`,
          message: issue.message,
        });
      }
    } else {
      options.push(hasil.data);
    }
  });
  const penjelasan: CmsExplanation = {
    blocks: kumpulBlok(d.explanation.blocks, "explanation.blocks", errors),
  };
  if (d.explanation.commonMistake !== undefined) {
    penjelasan.commonMistake = kumpulBlok(
      d.explanation.commonMistake,
      "explanation.commonMistake",
      errors,
    );
  }
  if (d.explanation.solvingTip !== undefined) {
    penjelasan.solvingTip = kumpulBlok(d.explanation.solvingTip, "explanation.solvingTip", errors);
  }
  if (errors.length > 0) return { ok: false, errors };
  return {
    ok: true,
    data: {
      code: d.code,
      subjectCode: d.subjectCode,
      topicCode: d.topicCode,
      subtopicCode: d.subtopicCode,
      skillCodes: d.skillCodes,
      difficulty: d.difficulty,
      questionType: d.questionType,
      contentBlocks,
      options,
      explanation: penjelasan,
      sourceType: d.sourceType,
      ...(d.sourceReference ? { sourceReference: d.sourceReference } : {}),
      estimatedTimeSeconds: d.estimatedTimeSeconds,
    },
  };
}

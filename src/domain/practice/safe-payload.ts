/**
 * P6.2 — Payload soal aktif yang AMAN untuk murid (tanpa I/O, tanpa DB).
 *
 * Aturan keras (docs/DATABASE.md + ARCHITECTURE.md):
 * - is_correct TIDAK BOLEH bocor ke payload sesi aktif.
 * - explanation (blocks/commonMistake/solvingTip) TIDAK BOLEH bocor
 *   sebelum murid menjawab (dibuka di P6.6 setelah jawab).
 *
 * Yang BOLEH: id, code, taksonomi, difficulty, tipe, contentBlocks,
 * opsi TANPA isCorrect (opsi diacak? TIDAK di V1 — urutan DB dipertahankan
 * agar review konsisten; acak urutan soal sudah di P6.1).
 */
import type { ContentBlock } from "../question/content-blocks.ts";
import type { CmsQuestion } from "../../server/repositories/question-model.ts";

export interface SafeOption {
  blocks: ContentBlock[];
}

export interface SafeQuestion {
  id: string;
  code: string;
  subjectCode: string;
  topicCode: string;
  subtopicCode: string;
  skillCodes: string[];
  difficulty: string;
  questionType: string;
  contentBlocks: ContentBlock[];
  options: SafeOption[];
}

/** Daftar field yang DILARANG muncul di payload aman (tripwire tes). */
export const FORBIDDEN_SAFE_FIELDS = ["isCorrect", "is_correct", "explanation", "explanationBlocks", "commonMistake", "solvingTip", "reviewedBy", "createdBy"] as const;

/** Strip satu soal CMS → payload aman. */
export function toSafeQuestion(q: CmsQuestion): SafeQuestion {
  return {
    id: q.id,
    code: q.code,
    subjectCode: q.subjectCode,
    topicCode: q.topicCode,
    subtopicCode: q.subtopicCode,
    skillCodes: [...q.skillCodes],
    difficulty: q.difficulty,
    questionType: q.questionType,
    contentBlocks: [...q.contentBlocks],
    options: q.options.map((o) => ({ blocks: [...o.blocks] })),
  };
}

/** Strip banyak soal sekaligus (urutan dipertahankan). */
export function toSafeQuestions(daftar: CmsQuestion[]): SafeQuestion[] {
  return daftar.map(toSafeQuestion);
}

/**
 * Tripwire: pastikan serial JSON payload aman TIDAK mengandung field
 * terlarang (isCorrect dkk). Dipakai tes + service sebelum kirim.
 */
export function assertSafePayload(payload: unknown): void {
  const json = JSON.stringify(payload);
  for (const f of FORBIDDEN_SAFE_FIELDS) {
    if (json.includes(`"${f}"`)) {
      throw new Error(`[safe-payload] field terlarang bocor ke payload murid: ${f}`);
    }
  }
}

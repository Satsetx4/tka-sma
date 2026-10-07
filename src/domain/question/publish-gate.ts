import { z } from "zod";
import {
  contentBlockSchema,
  explanationSectionSchema,
  findImageBlocks,
  questionOptionSchema,
} from "./content-blocks.ts";
import type { ContentBlock } from "./content-blocks.ts";

/**
 * Publish gate soal (docs/CONTENT-POLICY.md): soal tidak bisa dipublish tanpa
 * subject, topic, subtopic, minimal satu skill, difficulty, tipe soal, konten
 * valid, jawaban benar, penjelasan, tipe sumber, estimasi waktu, dan
 * persetujuan reviewer manusia. Soal bervisual wajib punya alt text bermakna.
 *
 * Validasi otomatis TIDAK menggantikan review akademik manusia.
 */

export const difficulties = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof difficulties)[number];

export const questionTypes = ["single_choice", "multiple_choice"] as const;
export type QuestionType = (typeof questionTypes)[number];

export const sourceTypes = ["official_reference", "original_internal", "licensed_partner"] as const;
export type SourceType = (typeof sourceTypes)[number];

/** Panjang minimal alt text agar dianggap "bermakna" (bukan "gambar1", "foto", dst). */
export const MIN_MEANINGFUL_ALT_TEXT_LENGTH = 10;
/** Batas atas estimasi waktu pengerjaan satu soal (2 jam, unambiguous typo guard). */
export const MAX_ESTIMATED_TIME_SECONDS = 7200;

const difficultySchema = z.enum(difficulties, { error: "Difficulty tidak valid." });
const questionTypeSchema = z.enum(questionTypes, { error: "Tipe soal tidak valid." });
const sourceTypeSchema = z.enum(sourceTypes, { error: "Tipe sumber tidak diizinkan." });

const taksonomiField = (nama: string) =>
  z
    .string()
    .trim()
    .min(1, { error: `${nama} wajib diisi.` });

export const questionPublishDraftSchema = z.object({
  subjectCode: taksonomiField("Subject"),
  topicCode: taksonomiField("Topic"),
  subtopicCode: taksonomiField("Subtopic"),
  skillCodes: z
    .array(z.string().trim().min(1, { error: "Kode skill tidak boleh kosong." }))
    .min(1, { error: "Minimal satu skill pengukur wajib dipilih." }),
  difficulty: difficultySchema,
  questionType: questionTypeSchema,
  contentBlocks: z
    .array(contentBlockSchema)
    .min(1, { error: "Konten soal tidak boleh kosong." }),
  options: z
    .array(questionOptionSchema)
    .min(2, { error: "Minimal dua opsi jawaban (jumlah opsi tidak harus lima)." }),
  explanation: explanationSectionSchema,
  sourceType: sourceTypeSchema,
  estimatedTimeSeconds: z
    .number()
    .int({ error: "Estimasi waktu harus bilangan bulat detik." })
    .positive({ error: "Estimasi waktu harus lebih dari 0 detik." })
    .max(MAX_ESTIMATED_TIME_SECONDS, { error: "Estimasi waktu melebihi batas." }),
  reviewedBy: z
    .string()
    .trim()
    .min(1, { error: "Soal belum disetujui reviewer manusia." }),
});
export type QuestionPublishDraft = z.infer<typeof questionPublishDraftSchema>;

export interface PublishGateError {
  field: string;
  message: string;
}

export interface PublishGateResult {
  ok: boolean;
  errors: PublishGateError[];
}

/**
 * Cek kelengkapan field wajib publish. Mengembalikan daftar error terstruktur
 * (bukan throw) agar CMS bisa menampilkan semuanya sekaligus.
 */
export function checkPublishGate(input: unknown): PublishGateResult {
  const errors: PublishGateError[] = [];
  const parsed = questionPublishDraftSchema.safeParse(input);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      errors.push({ field: issue.path.join(".") || "(root)", message: issue.message });
    }
    return { ok: false, errors };
  }
  const draf = parsed.data;

  const jumlahBenar = draf.options.filter((opsi) => opsi.isCorrect).length;
  if (draf.questionType === "single_choice" && jumlahBenar !== 1) {
    errors.push({
      field: "options",
      message: "single_choice wajib punya tepat satu jawaban benar.",
    });
  }
  if (draf.questionType === "multiple_choice" && jumlahBenar < 1) {
    errors.push({
      field: "options",
      message: "multiple_choice wajib punya minimal satu jawaban benar.",
    });
  }

  if (!draf.explanation.commonMistake || draf.explanation.commonMistake.length < 1) {
    errors.push({
      field: "explanation.commonMistake",
      message: "Common mistake wajib diisi sebelum publish.",
    });
  }
  if (!draf.explanation.solvingTip || draf.explanation.solvingTip.length < 1) {
    errors.push({
      field: "explanation.solvingTip",
      message: "Solving tip wajib diisi sebelum publish.",
    });
  }

  const semuaBlok: ContentBlock[] = [
    ...draf.contentBlocks,
    ...draf.options.flatMap((opsi) => opsi.blocks),
    ...draf.explanation.blocks,
  ];
  const altLemah = findImageBlocks(semuaBlok).filter(
    (gambar) => gambar.alt.trim().length < MIN_MEANINGFUL_ALT_TEXT_LENGTH,
  );
  if (altLemah.length > 0) {
    errors.push({
      field: "image.alt",
      message:
        `Ditemukan ${altLemah.length} gambar tanpa alt text bermakna ` +
        `(minimal ${MIN_MEANINGFUL_ALT_TEXT_LENGTH} karakter).`,
    });
  }

  return { ok: errors.length === 0, errors };
}

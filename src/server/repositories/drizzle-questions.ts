/**
 * P4.3 — Implementasi QuestionRepository di atas Drizzle + Neon.
 * SERVER-ONLY (diimpor hanya dari route handler / server component).
 *
 * Batas yang diketahui (tanpa ubah schema, tabel taksonomi P2.3 DITAHAN):
 * - subjectCode disimpan ke subject_id HANYA bila berbentuk UUID valid,
 *   selain itu NULL. Baca: subjectId UUID dikembalikan apa adanya.
 * - topicCode/subtopicCode belum punya kolom → TIDAK tersimpan.
 * - skillCodes disimpan ke question_skills HANYA yang berbentuk UUID.
 * Full-fidelity taksonomi tersedia di InMemoryQuestionRepository untuk
 * tes; setelah tabel P2.3 mendarat, petakan kode ↔ id di sini.
 */
import "server-only";
import { and, eq } from "drizzle-orm";
import { getDb } from "../db/client.ts";
import { questionOptions, questionSkills, questions } from "../db/schema.ts";
import type {
  CmsQuestion,
  CmsQuestionInput,
  CmsQuestionPatch,
  CmsStatus,
  QuestionFilter,
} from "./question-model.ts";
import type { QuestionRepository } from "./questions.ts";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function uuidAtauNull(nilai: string | undefined): string | null {
  if (!nilai) return null;
  return UUID_RE.test(nilai) ? nilai : null;
}

type BarisSoal = typeof questions.$inferSelect;
type BarisOpsi = typeof questionOptions.$inferSelect;
type BarisSkill = typeof questionSkills.$inferSelect;

function rakit(q: BarisSoal, opsi: BarisOpsi[], skill: BarisSkill[]): CmsQuestion {
  const explanationBlocks = (q.explanationBlocks ?? []) as CmsQuestion["contentBlocks"];
  const commonMistake = (q.commonMistake ?? undefined) as CmsQuestion["contentBlocks"] | undefined;
  const solvingTip = (q.solvingTip ?? undefined) as CmsQuestion["contentBlocks"] | undefined;
  return {
    id: q.id,
    code: q.code,
    subjectCode: q.subjectId ?? "",
    topicCode: "",
    subtopicCode: "",
    skillCodes: skill.map((s) => s.skillId),
    difficulty: q.difficulty,
    questionType: q.questionType,
    contentBlocks: (q.contentBlocks ?? []) as CmsQuestion["contentBlocks"],
    options: [...opsi]
      .sort((a, b) => a.position - b.position)
      .map((o) => ({
        blocks: (o.contentBlocks ?? []) as CmsQuestion["contentBlocks"],
        isCorrect: o.isCorrect,
      })),
    explanation: {
      blocks: explanationBlocks,
      ...(commonMistake ? { commonMistake } : {}),
      ...(solvingTip ? { solvingTip } : {}),
    },
    sourceType: q.sourceType,
    ...(q.sourceReference ? { sourceReference: q.sourceReference } : {}),
    estimatedTimeSeconds: q.estimatedTimeSeconds ?? 0,
    status: q.status,
    createdBy: q.createdBy ?? "",
    reviewedBy: q.reviewedBy,
    publishedAt: q.publishedAt ? q.publishedAt.toISOString() : null,
    createdAt: q.createdAt.toISOString(),
    updatedAt: q.updatedAt.toISOString(),
  };
}

class DrizzleQuestionRepository implements QuestionRepository {
  private db = getDb();

  private async muat(id: string): Promise<CmsQuestion | null> {
    const baris = await this.db.select().from(questions).where(eq(questions.id, id));
    const q = baris[0];
    if (!q) return null;
    const opsi = await this.db
      .select()
      .from(questionOptions)
      .where(eq(questionOptions.questionId, id));
    const skill = await this.db
      .select()
      .from(questionSkills)
      .where(eq(questionSkills.questionId, id));
    return rakit(q, opsi, skill);
  }

  async list(filter: QuestionFilter = {}): Promise<CmsQuestion[]> {
    const syarat = [];
    if (filter.status !== undefined) syarat.push(eq(questions.status, filter.status));
    if (filter.difficulty !== undefined) syarat.push(eq(questions.difficulty, filter.difficulty));
    if (filter.questionType !== undefined) {
      syarat.push(eq(questions.questionType, filter.questionType));
    }
    const baris =
      syarat.length > 0
        ? await this.db
            .select()
            .from(questions)
            .where(syarat.length === 1 ? syarat[0] : and(...syarat))
        : await this.db.select().from(questions);
    const hasil: CmsQuestion[] = [];
    for (const b of baris) {
      const penuh = await this.muat(b.id);
      if (!penuh) continue;
      if (filter.subjectCode && penuh.subjectCode !== filter.subjectCode) continue;
      if (filter.topicCode && filter.topicCode !== "" && penuh.topicCode !== filter.topicCode) {
        continue;
      }
      const cari = (filter.search ?? "").trim().toLowerCase();
      if (cari !== "") {
        const hay = `${penuh.code} ${JSON.stringify(penuh.contentBlocks)}`.toLowerCase();
        if (!hay.includes(cari)) continue;
      }
      hasil.push(penuh);
    }
    return hasil.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  }

  async getById(id: string): Promise<CmsQuestion | null> {
    return this.muat(id);
  }

  async create(input: CmsQuestionInput, actorId: string): Promise<CmsQuestion> {
    const baris = await this.db
      .insert(questions)
      .values({
        code: input.code,
        subjectId: uuidAtauNull(input.subjectCode),
        questionType: input.questionType,
        difficulty: input.difficulty,
        contentBlocks: input.contentBlocks,
        explanationBlocks: input.explanation.blocks,
        commonMistake: input.explanation.commonMistake ?? null,
        solvingTip: input.explanation.solvingTip ?? null,
        estimatedTimeSeconds: input.estimatedTimeSeconds,
        sourceType: input.sourceType,
        sourceReference: input.sourceReference ?? null,
        status: "draft",
        createdBy: actorId,
      })
      .returning({ id: questions.id });
    const id = baris[0]?.id;
    if (!id) throw new Error("Gagal membuat soal (DB tidak mengembalikan id).");
    await this.tulisOpsiDanSkill(id, input.options, input.skillCodes);
    const penuh = await this.muat(id);
    if (!penuh) throw new Error("Soal hilang tepat setelah dibuat.");
    return penuh;
  }

  async update(id: string, patch: CmsQuestionPatch, _actorId: string): Promise<CmsQuestion | null> {
    const lama = await this.muat(id);
    if (!lama) return null;
    await this.db
      .update(questions)
      .set({
        ...(patch.code !== undefined ? { code: patch.code } : {}),
        ...(patch.subjectCode !== undefined
          ? { subjectId: uuidAtauNull(patch.subjectCode) }
          : {}),
        ...(patch.questionType !== undefined ? { questionType: patch.questionType } : {}),
        ...(patch.difficulty !== undefined ? { difficulty: patch.difficulty } : {}),
        ...(patch.contentBlocks !== undefined ? { contentBlocks: patch.contentBlocks } : {}),
        ...(patch.sourceType !== undefined ? { sourceType: patch.sourceType } : {}),
        ...(patch.sourceReference !== undefined
          ? { sourceReference: patch.sourceReference || null }
          : {}),
        ...(patch.estimatedTimeSeconds !== undefined
          ? { estimatedTimeSeconds: patch.estimatedTimeSeconds }
          : {}),
        ...(patch.explanation !== undefined
          ? {
              explanationBlocks: patch.explanation.blocks,
              commonMistake: patch.explanation.commonMistake ?? null,
              solvingTip: patch.explanation.solvingTip ?? null,
            }
          : {}),
      })
      .where(eq(questions.id, id));
    if (patch.options !== undefined || patch.skillCodes !== undefined) {
      await this.tulisOpsiDanSkill(
        id,
        patch.options ?? lama.options,
        patch.skillCodes ?? lama.skillCodes,
      );
    }
    return this.muat(id);
  }

  private async tulisOpsiDanSkill(
    questionId: string,
    opsi: CmsQuestion["options"],
    skillCodes: string[],
  ): Promise<void> {
    await this.db.delete(questionOptions).where(eq(questionOptions.questionId, questionId));
    if (opsi.length > 0) {
      await this.db.insert(questionOptions).values(
        opsi.map((o, i) => ({
          questionId,
          position: i,
          contentBlocks: o.blocks,
          isCorrect: o.isCorrect,
        })),
      );
    }
    await this.db.delete(questionSkills).where(eq(questionSkills.questionId, questionId));
    const uuids = skillCodes.filter((k) => UUID_RE.test(k));
    if (uuids.length > 0) {
      await this.db.insert(questionSkills).values(
        uuids.map((skillId, i) => ({
          questionId,
          skillId,
          weight: 1,
          isPrimary: i === 0,
        })),
      );
    }
  }

  async remove(id: string): Promise<boolean> {
    const hasil = await this.db.delete(questions).where(eq(questions.id, id)).returning({
      id: questions.id,
    });
    return hasil.length > 0;
  }

  async setStatus(
    id: string,
    status: CmsStatus,
    _actorId: string,
    opts: { reviewedBy?: string | null } = {},
  ): Promise<CmsQuestion | null> {
    const lama = await this.muat(id);
    if (!lama) return null;
    await this.db
      .update(questions)
      .set({
        status,
        ...(opts.reviewedBy !== undefined ? { reviewedBy: opts.reviewedBy } : {}),
        ...(status === "published" && !lama.publishedAt ? { publishedAt: new Date() } : {}),
      })
      .where(eq(questions.id, id));
    return this.muat(id);
  }
}

export function createDrizzleQuestionRepository(): QuestionRepository {
  return new DrizzleQuestionRepository();
}

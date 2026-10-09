/**
 * P4.3 — Implementasi QuestionRepository di atas Drizzle + Neon.
 * P5.1 — Resolusi taksonomi code↔id (subjects/skills).
 * SERVER-ONLY (diimpor hanya dari route handler / server component).
 *
 * Penyimpanan taksonomi (setelah tabel P2.3 mendarat):
 * - subjectCode (code MATH / slug matematika / UUID) → subjects.id.
 * - skillCodes (code MATH.… / UUID) → question_skills (skill UUIDs).
 * - topicCode/subtopicCode TIDAK punya kolom (DATABASE.md) → DITURUNKAN
 *   dari skill primer (skills → subtopics → topics) saat baca.
 * - Kode tak dikenal → NULL/dilewati (fail-soft); validasi ketat milik
 *   seed/test + publish gate, bukan repository.
 */
import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { getDb } from "../db/client.ts";
import {
  questionOptions,
  questionSkills,
  questions,
  skills,
  subjects,
  subtopics,
  topics,
} from "../db/schema.ts";
import type {
  CmsQuestion,
  CmsQuestionInput,
  CmsQuestionPatch,
  CmsStatus,
  QuestionFilter,
} from "./question-model.ts";
import type { QuestionRepository } from "./questions.ts";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Db = ReturnType<typeof getDb>;

function normalisasiKode(nilai: string | undefined): string {
  return (nilai ?? "").trim();
}

/** Cari id subject dari code (MATH), slug (matematika), atau UUID langsung. */
async function subjectIdDariKode(db: Db, nilai: string): Promise<string | null> {
  const kode = normalisasiKode(nilai);
  if (kode === "") return null;
  if (UUID_RE.test(kode)) return kode;
  const atas = kode.toUpperCase();
  const baris = await db
    .select({ id: subjects.id })
    .from(subjects)
    .where(inArray(subjects.code, [kode, atas]));
  const cocok = baris[0];
  if (cocok) return cocok.id;
  const barisSlug = await db
    .select({ id: subjects.id })
    .from(subjects)
    .where(eq(subjects.slug, kode.toLowerCase()));
  return barisSlug[0]?.id ?? null;
}

/** Petakan daftar skill (code MATH.… atau UUID) ke id skill. Kode tak dikenal dilewati. */
async function skillIdsDariKode(db: Db, daftar: string[]): Promise<string[]> {
  const bersih = [...new Set(daftar.map(normalisasiKode).filter((k) => k !== ""))];
  if (bersih.length === 0) return [];
  const langsung = bersih.filter((k) => UUID_RE.test(k));
  const kode = bersih.filter((k) => !UUID_RE.test(k));
  const hasil: string[] = [...langsung];
  if (kode.length > 0) {
    const atas = kode.map((k) => k.toUpperCase());
    const baris = await db
      .select({ id: skills.id, code: skills.code })
      .from(skills)
      .where(inArray(skills.code, [...kode, ...atas]));
    const olehKode = new Map(baris.map((b) => [b.code.toUpperCase(), b.id]));
    for (const k of kode) {
      const id = olehKode.get(k.toUpperCase());
      if (id && !hasil.includes(id)) hasil.push(id);
    }
  }
  return [...new Set(hasil)];
}

interface RantaiTaksonomi {
  subjectCode: string;
  topicCode: string;
  subtopicCode: string;
}

/** Turunkan rantai taksonomi dari skill primer (skill pertama): skill → subtopic → topic → subject. */
async function rantaiDariSkillPrimer(db: Db, skillIds: string[]): Promise<RantaiTaksonomi> {
  const kosong: RantaiTaksonomi = { subjectCode: "", topicCode: "", subtopicCode: "" };
  const primer = skillIds[0];
  if (!primer) return kosong;
  const barisSkill = await db
    .select({ code: skills.code, subtopicId: skills.subtopicId })
    .from(skills)
    .where(eq(skills.id, primer));
  const s = barisSkill[0];
  if (!s) return kosong;
  const barisSub = await db
    .select({ code: subtopics.code, topicId: subtopics.topicId })
    .from(subtopics)
    .where(eq(subtopics.id, s.subtopicId));
  const sub = barisSub[0];
  if (!sub) return kosong;
  const barisTopik = await db
    .select({ code: topics.code, subjectId: topics.subjectId })
    .from(topics)
    .where(eq(topics.id, sub.topicId));
  const topik = barisTopik[0];
  if (!topik) return { ...kosong, subtopicCode: sub.code };
  const barisSubject = await db
    .select({ code: subjects.code })
    .from(subjects)
    .where(eq(subjects.id, topik.subjectId));
  return {
    subjectCode: barisSubject[0]?.code ?? "",
    topicCode: topik.code,
    subtopicCode: sub.code,
  };
}

/** Code skill (MATH.…) untuk daftar id skill (urutan input dipertahankan). */
async function skillCodesDariIds(db: Db, ids: string[]): Promise<string[]> {
  if (ids.length === 0) return [];
  const baris = await db
    .select({ id: skills.id, code: skills.code })
    .from(skills)
    .where(inArray(skills.id, ids));
  const olehId = new Map(baris.map((b) => [b.id, b.code]));
  return ids.map((id) => olehId.get(id)).filter((c): c is string => typeof c === "string");
}

type BarisSoal = typeof questions.$inferSelect;
type BarisOpsi = typeof questionOptions.$inferSelect;
type BarisSkill = typeof questionSkills.$inferSelect;

async function rakit(db: Db, q: BarisSoal, opsi: BarisOpsi[], skill: BarisSkill[]): Promise<CmsQuestion> {
  const explanationBlocks = (q.explanationBlocks ?? []) as CmsQuestion["contentBlocks"];
  const commonMistake = (q.commonMistake ?? undefined) as CmsQuestion["contentBlocks"] | undefined;
  const solvingTip = (q.solvingTip ?? undefined) as CmsQuestion["contentBlocks"] | undefined;
  const skillIds = skill.map((s) => s.skillId);
  const rantai = await rantaiDariSkillPrimer(db, skillIds);
  let subjectCode = rantai.subjectCode;
  if (subjectCode === "" && q.subjectId) {
    const baris = await db.select({ code: subjects.code }).from(subjects).where(eq(subjects.id, q.subjectId));
    subjectCode = baris[0]?.code ?? "";
  }
  return {
    id: q.id,
    code: q.code,
    subjectCode,
    topicCode: rantai.topicCode,
    subtopicCode: rantai.subtopicCode,
    skillCodes: await skillCodesDariIds(db, skillIds),
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
    return rakit(this.db, q, opsi, skill);
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
    const subjectId = await subjectIdDariKode(this.db, input.subjectCode);
    const baris = await this.db
      .insert(questions)
      .values({
        code: input.code,
        subjectId,
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
    const subjectId =
      patch.subjectCode !== undefined ? await subjectIdDariKode(this.db, patch.subjectCode) : undefined;
    await this.db
      .update(questions)
      .set({
        ...(patch.code !== undefined ? { code: patch.code } : {}),
        ...(subjectId !== undefined ? { subjectId } : {}),
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

  /** Tulis opsi + relasi skill. skillCodes boleh code (MATH.…) atau UUID — diresolusi ke id. */
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
    const ids = await skillIdsDariKode(this.db, skillCodes);
    if (ids.length > 0) {
      await this.db.insert(questionSkills).values(
        ids.map((skillId, i) => ({
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

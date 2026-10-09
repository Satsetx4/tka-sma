// P5.1 — Seed 10 soal teks/math (eksekutor DB).
//
// SERVER-ONLY: memakai getDb + query taksonomi (code→id) + repository
// Drizzle + workflow draft→in_review→approved. Resolve parent STRING
// (topicCode/subtopicCode sebagai code FROZEN, bukan UUID) langsung vs
// tabel, lalu tulis via create() yang meresolusi subject/skill.
//
// Idempoten: upsert by code — code sudah ada → data di-update, status
// TIDAK diturunkan (soal yang sudah approved/published tidak di-downgrade).
// Validasi: blok/opsi/penjelasan lolos parseDrafPenuh; taksonomi code
// FROZEN wajib ada di DB (subject MATH + 5 topics + 10 subtopics +
// skill per soal).
import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "./client.ts";
import { skills, subjects, subtopics, topics } from "./schema.ts";
import { P51_QUESTIONS } from "./p51-questions.ts";
import type { CmsQuestionInput } from "../repositories/question-model.ts";
import { createDrizzleQuestionRepository } from "../repositories/drizzle-questions.ts";
import { parseDrafPenuh } from "../../app/api/cms/_validasi.ts";

export interface SeedP51Result {
  dibuat: number;
  diperbarui: number;
  approved: number;
  kode: string[];
}

/** Pastikan code taksonomi FROZEN yang dipakai P5.1 ada di DB. */
async function wajibTaksonomiAda(daftar: CmsQuestionInput[]): Promise<void> {
  const db = getDb();
  const butuhSubject = new Set(daftar.map((q) => q.subjectCode.toUpperCase()));
  const butuhTopic = new Set(daftar.map((q) => q.topicCode.toUpperCase()));
  const butuhSubtopic = new Set(daftar.map((q) => q.subtopicCode.toUpperCase()));
  const butuhSkill = new Set(daftar.flatMap((q) => q.skillCodes.map((k) => k.toUpperCase())));

  const adaSubject = new Set(
    (await db.select({ code: subjects.code }).from(subjects)).map((b) => b.code.toUpperCase()),
  );
  const adaTopic = new Set(
    (await db.select({ code: topics.code }).from(topics)).map((b) => b.code.toUpperCase()),
  );
  const adaSubtopic = new Set(
    (await db.select({ code: subtopics.code }).from(subtopics)).map((b) => b.code.toUpperCase()),
  );
  const adaSkill = new Set(
    (await db.select({ code: skills.code }).from(skills)).map((b) => b.code.toUpperCase()),
  );

  const hilang: string[] = [];
  for (const k of butuhSubject) if (!adaSubject.has(k)) hilang.push(`subject ${k}`);
  for (const k of butuhTopic) if (!adaTopic.has(k)) hilang.push(`topic ${k}`);
  for (const k of butuhSubtopic) if (!adaSubtopic.has(k)) hilang.push(`subtopic ${k}`);
  for (const k of butuhSkill) if (!adaSkill.has(k)) hilang.push(`skill ${k}`);
  if (hilang.length > 0) {
    throw new Error(`[seed-p51] taksonomi hilang di DB (jalankan seed-taxonomy dulu): ${hilang.join(", ")}`);
  }
}

/** Validasi struktur tiap soal via parseDrafPenuh (sama seperti POST /api/cms/questions). */
function wajibStrukturValid(daftar: CmsQuestionInput[]): void {
  for (const q of daftar) {
    const hasil = parseDrafPenuh({
      code: q.code,
      subjectCode: q.subjectCode,
      topicCode: q.topicCode,
      subtopicCode: q.subtopicCode,
      skillCodes: q.skillCodes,
      difficulty: q.difficulty,
      questionType: q.questionType,
      contentBlocks: q.contentBlocks,
      options: q.options,
      explanation: q.explanation,
      sourceType: q.sourceType,
      sourceReference: q.sourceReference,
      estimatedTimeSeconds: q.estimatedTimeSeconds,
    });
    if (!hasil.ok) {
      throw new Error(
        `[seed-p51] struktur ${q.code} tidak valid: ${hasil.errors.map((e) => `${e.field}: ${e.message}`).join("; ")}`,
      );
    }
  }
}

/** Cari id soal dari code (langsung SQL, cepat — tanpa muat semua soal). */
async function idSoalDariKode(code: string): Promise<string | null> {
  const db = getDb();
  const { questions } = await import("./schema.ts");
  const baris = await db.select({ id: questions.id }).from(questions).where(eq(questions.code, code));
  return baris[0]?.id ?? null;
}

/** Seed 10 soal P5.1. Idempoten — aman dijalankan ulang. */
export async function seedP51(actorId: string): Promise<SeedP51Result> {
  const daftar = P51_QUESTIONS;
  if (daftar.length !== 10) throw new Error(`[seed-p51] ekspektasi 10 soal, dapat ${daftar.length}.`);
  const kode = daftar.map((q) => q.code);
  if (new Set(kode).size !== kode.length) throw new Error("[seed-p51] kode soal duplikat di data.");

  wajibStrukturValid(daftar);
  await wajibTaksonomiAda(daftar);

  const repo = createDrizzleQuestionRepository();
  let dibuat = 0;
  let diperbarui = 0;

  for (const q of daftar) {
    const idAda = await idSoalDariKode(q.code);
    if (!idAda) {
      await repo.create(q, actorId);
      dibuat++;
    } else {
      await repo.update(idAda, { ...q }, actorId);
      diperbarui++;
    }
  }

  // Workflow ke approved (draft → in_review → approved) untuk semua 10.
  let approved = 0;
  for (const q of daftar) {
    const idSoal = await idSoalDariKode(q.code);
    if (!idSoal) throw new Error(`[seed-p51] soal ${q.code} hilang setelah tulis.`);
    const soal = await repo.getById(idSoal);
    if (!soal) throw new Error(`[seed-p51] soal ${q.code} hilang saat workflow.`);
    if (soal.status === "draft") await repo.setStatus(idSoal, "in_review", actorId);
    const kini = await repo.getById(idSoal);
    if (!kini) throw new Error(`[seed-p51] soal ${q.code} hilang saat workflow.`);
    if (kini.status === "in_review") {
      await repo.setStatus(idSoal, "approved", actorId, { reviewedBy: actorId });
    }
    const akhir = await repo.getById(idSoal);
    if (akhir?.status === "approved") approved++;
  }

  return { dibuat, diperbarui, approved, kode };
}

/** Ambil userId admin untuk createdBy/reviewedBy (email admin live). */
export async function adminIdByEmail(email: string): Promise<string> {
  const db = getDb();
  const { users } = await import("./schema.ts");
  const baris = await db.select({ id: users.id }).from(users).where(eq(users.email, email.toLowerCase()));
  const id = baris[0]?.id;
  if (!id) throw new Error(`[seed-p51] admin ${email} tidak ditemukan — jalankan seed-admin dulu.`);
  return id;
}

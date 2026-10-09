/**
 * P6.1 — Implementasi AttemptRepository di atas Drizzle + Neon. SERVER-ONLY.
 *
 * Catatan skema (tanpa ubah migrasi):
 * - practice_sessions tidak punya kolom topic/question_ids → topicCode dan
 *   daftar soal disimpan di luar baris sesi? TIDAK — V1 menyimpan daftar
 *   soal sebagai sesi "kosong soal" di DB + questionIds di memori respons.
 *   Keputusan: questionIds sesi live diambil dari question_attempts
 *   (soal yang sudah dijawab) + sisa dari payload mulai (client simpan).
 *   Sederhananya: sesi DB = { user, mode, subject, started, finished,
 *   counts, duration }; daftar soal = input mulai (dikembalikan saat create,
 *   tidak di-persist per-soal sampai ada attempt).
 * - subjectCode (MATH/slug/UUID) → subjects.id (pola drizzle-questions).
 */
import "server-only";
import { desc, eq } from "drizzle-orm";
import { getDb } from "../db/client.ts";
import { practiceSessions, questionAttempts, subjects } from "../db/schema.ts";
import type { PracticeMode, PracticeSession } from "../../domain/practice/session-model.ts";
import type { AttemptRecord, AttemptRepository } from "./attempts.ts";

type Db = ReturnType<typeof getDb>;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function subjectIdDariKode(db: Db, nilai: string): Promise<string | null> {
  const kode = (nilai ?? "").trim();
  if (kode === "") return null;
  if (UUID_RE.test(kode)) return kode;
  const atas = kode.toUpperCase();
  const cocok = await db
    .select({ id: subjects.id, code: subjects.code, slug: subjects.slug })
    .from(subjects);
  for (const b of cocok) {
    if (b.code === kode || b.code === atas || b.slug === kode.toLowerCase()) return b.id;
  }
  return null;
}

type BarisSesi = typeof practiceSessions.$inferSelect;

function keModel(b: BarisSesi): PracticeSession {
  const questionIds = Array.isArray(b.questionIds) ? (b.questionIds as string[]) : [];
  return {
    id: b.id,
    userId: b.userId,
    mode: b.mode as PracticeMode,
    subjectId: b.subjectId,
    topicCode: b.topicCode,
    questionIds,
    startedAt: b.startedAt.toISOString(),
    finishedAt: b.finishedAt ? b.finishedAt.toISOString() : null,
    questionCount: b.questionCount,
    correctCount: b.correctCount,
    durationSeconds: b.durationSeconds,
  };
}

class DrizzleAttemptRepository implements AttemptRepository {
  private db = getDb();

  async listSessions(userId: string): Promise<PracticeSession[]> {
    const baris = await this.db
      .select()
      .from(practiceSessions)
      .where(eq(practiceSessions.userId, userId))
      .orderBy(desc(practiceSessions.startedAt));
    return baris.map((b) => keModel(b));
  }

  async getSession(id: string): Promise<PracticeSession | null> {
    const baris = await this.db.select().from(practiceSessions).where(eq(practiceSessions.id, id));
    const b = baris[0];
    return b ? keModel(b) : null;
  }

  async createSession(sesi: Omit<PracticeSession, "finishedAt" | "correctCount" | "durationSeconds">): Promise<PracticeSession> {
    const subjectId = sesi.subjectId ? await subjectIdDariKode(this.db, sesi.subjectId) : null;
    const baris = await this.db
      .insert(practiceSessions)
      .values({
        userId: sesi.userId,
        mode: sesi.mode,
        subjectId,
        topicCode: sesi.topicCode,
        questionIds: sesi.questionIds,
        questionCount: sesi.questionCount,
      })
      .returning();
    const b = baris[0];
    if (!b) throw new Error("Gagal membuat sesi (DB tidak mengembalikan baris).");
    return keModel(b);
  }

  async finishSession(id: string, benar: number, durasiDetik: number | null): Promise<PracticeSession | null> {
    const lama = await this.getSession(id);
    if (!lama) return null;
    if (lama.finishedAt) return lama;
    const baris = await this.db
      .update(practiceSessions)
      .set({
        finishedAt: new Date(),
        correctCount: Math.max(0, Math.min(benar, lama.questionCount)),
        durationSeconds: durasiDetik,
      })
      .where(eq(practiceSessions.id, id))
      .returning();
    const b = baris[0];
    return b ? keModel(b) : null;
  }

  async recordAttempt(a: Omit<AttemptRecord, "id" | "answeredAt">): Promise<AttemptRecord> {
    const baris = await this.db
      .insert(questionAttempts)
      .values({
        userId: a.userId,
        sessionId: a.sessionId,
        questionId: a.questionId,
        selectedAnswer: a.selectedAnswer,
        isCorrect: a.isCorrect,
        durationSeconds: a.durationSeconds,
        difficultySnapshot: a.difficultySnapshot as "easy" | "medium" | "hard" | null,
      })
      .returning();
    const b = baris[0];
    if (!b) throw new Error("Gagal menyimpan attempt.");
    return {
      id: b.id,
      userId: b.userId,
      sessionId: b.sessionId,
      questionId: b.questionId,
      selectedAnswer: b.selectedAnswer,
      isCorrect: b.isCorrect,
      durationSeconds: b.durationSeconds,
      difficultySnapshot: b.difficultySnapshot,
      answeredAt: b.answeredAt.toISOString(),
    };
  }

  async listAttempts(sessionId: string): Promise<AttemptRecord[]> {
    const baris = await this.db
      .select()
      .from(questionAttempts)
      .where(eq(questionAttempts.sessionId, sessionId))
      .orderBy(desc(questionAttempts.answeredAt));
    return baris.map((b) => ({
      id: b.id,
      userId: b.userId,
      sessionId: b.sessionId,
      questionId: b.questionId,
      selectedAnswer: b.selectedAnswer,
      isCorrect: b.isCorrect,
      durationSeconds: b.durationSeconds,
      difficultySnapshot: b.difficultySnapshot,
      answeredAt: b.answeredAt.toISOString(),
    }));
  }
}

export function createDrizzleAttemptRepository(): AttemptRepository {
  return new DrizzleAttemptRepository();
}

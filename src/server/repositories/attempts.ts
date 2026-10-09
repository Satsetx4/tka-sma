/**
 * P6.1 — AttemptRepository: interface + mock in-memory + factory.
 *
 * File ini SENGAJA tidak mengimpor modul server-only agar aman dipakai
 * di tes node --test. Implementasi Drizzle dimuat malas (dynamic import)
 * hanya bila DATABASE_URL tersedia.
 */
import type { PracticeMode, PracticeSession } from "../../domain/practice/session-model.ts";

export type { PracticeMode, PracticeSession };

export interface AttemptRecord {
  id: string;
  userId: string;
  sessionId: string | null;
  questionId: string;
  selectedAnswer: unknown;
  isCorrect: boolean;
  durationSeconds: number | null;
  difficultySnapshot: string | null;
  answeredAt: string;
}

export interface AttemptRepository {
  listSessions(userId: string): Promise<PracticeSession[]>;
  getSession(id: string): Promise<PracticeSession | null>;
  createSession(sesi: Omit<PracticeSession, "finishedAt" | "correctCount" | "durationSeconds">): Promise<PracticeSession>;
  finishSession(id: string, benar: number, durasiDetik: number | null): Promise<PracticeSession | null>;
  recordAttempt(a: Omit<AttemptRecord, "id" | "answeredAt">): Promise<AttemptRecord>;
  listAttempts(sessionId: string): Promise<AttemptRecord[]>;
  /** P6.5 — riwayat attempt milik satu user lintas sesi (terbaru dulu). */
  listAttemptsByUser(userId: string, batas?: number): Promise<AttemptRecord[]>;
}

function cocokPemilik(userId: string, sesiUserId: string): boolean {
  return userId !== "" && userId === sesiUserId;
}

export class InMemoryAttemptRepository implements AttemptRepository {
  private sesi = new Map<string, PracticeSession>();
  private upaya = new Map<string, AttemptRecord>();

  async listSessions(userId: string): Promise<PracticeSession[]> {
    return [...this.sesi.values()]
      .filter((s) => cocokPemilik(userId, s.userId))
      .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1));
  }

  async getSession(id: string): Promise<PracticeSession | null> {
    return this.sesi.get(id) ?? null;
  }

  async createSession(sesi: Omit<PracticeSession, "finishedAt" | "correctCount" | "durationSeconds">): Promise<PracticeSession> {
    const penuh: PracticeSession = { ...sesi, finishedAt: null, correctCount: 0, durationSeconds: null };
    this.sesi.set(penuh.id, penuh);
    return penuh;
  }

  async finishSession(id: string, benar: number, durasiDetik: number | null): Promise<PracticeSession | null> {
    const lama = this.sesi.get(id);
    if (!lama) return null;
    if (lama.finishedAt) return lama;
    const kini: PracticeSession = {
      ...lama,
      finishedAt: new Date().toISOString(),
      correctCount: Math.max(0, Math.min(benar, lama.questionCount)),
      durationSeconds: durasiDetik,
    };
    this.sesi.set(id, kini);
    return kini;
  }

  async recordAttempt(a: Omit<AttemptRecord, "id" | "answeredAt">): Promise<AttemptRecord> {
    const penuh: AttemptRecord = { ...a, id: crypto.randomUUID(), answeredAt: new Date().toISOString() };
    this.upaya.set(penuh.id, penuh);
    return penuh;
  }

  async listAttempts(sessionId: string): Promise<AttemptRecord[]> {
    return [...this.upaya.values()]
      .filter((a) => a.sessionId === sessionId)
      .sort((a, b) => (a.answeredAt < b.answeredAt ? -1 : 1));
  }

  async listAttemptsByUser(userId: string, batas = 50): Promise<AttemptRecord[]> {
    const n = Math.max(1, Math.min(batas, 200));
    return [...this.upaya.values()]
      .filter((a) => a.userId === userId)
      .sort((a, b) => (a.answeredAt < b.answeredAt ? 1 : -1))
      .slice(0, n);
  }
}

let memo: AttemptRepository | undefined;

export async function getAttemptRepository(): Promise<AttemptRepository> {
  if (memo) return memo;
  if (process.env["DATABASE_URL"]) {
    const mod = await import("./drizzle-attempts.ts");
    memo = mod.createDrizzleAttemptRepository();
  } else {
    memo = new InMemoryAttemptRepository();
  }
  return memo;
}

export function __resetAttemptRepositoryForTests(): void {
  memo = undefined;
}

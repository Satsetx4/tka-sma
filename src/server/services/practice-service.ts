/**
 * P6.1 — Service sesi latihan (SERVER-ONLY).
 *
 * Orkestrasi: validasi input (domain murni) → pilih soal (repository soal,
 * hanya yang approved/published) → buat sesi (attempt repository) →
 * selesaikan sesi (hitung benar dari attempts).
 *
 * Kepemilikan: SEMUA operasi cek userId (sesi orang lain tidak bisa
 * dibaca/diselesaikan). Fail-closed: soal tidak ketemu = error, bukan
 * sesi kosong diam-diam.
 */
import "server-only";
import {
  skorSesi,
  validasiMulaiSesi,
  type PracticeMode,
  type PracticeSession,
} from "../../domain/practice/session-model.ts";
import { getAttemptRepository } from "../repositories/attempts.ts";
import { getQuestionRepository } from "../repositories/questions.ts";

export interface MulaiSesiHasil {
  ok: boolean;
  sesi?: PracticeSession;
  errors?: Array<{ field: string; message: string }>;
}

export interface SelesaikanSesiHasil {
  ok: boolean;
  sesi?: PracticeSession;
  skor?: number;
  errors?: Array<{ field: string; message: string }>;
}

/** Acak Fisher-Yates (murni, tanpa I/O). */
function acak<T>(daftar: T[]): T[] {
  const hasil = [...daftar];
  for (let i = hasil.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = hasil[i] as T;
    const b = hasil[j] as T;
    hasil[i] = b;
    hasil[j] = a;
  }
  return hasil;
}

/**
 * Mulai sesi latihan: validasi → ambil soal approved → buat sesi.
 * jumlahSoal dibatasi 1..30 (V1). Topic disaring dari rantai taksonomi
 * (soal yang topicCode-nya cocok).
 */
export async function mulaiSesiLatihan(
  userId: string,
  input: { mode: PracticeMode; subjectCode?: string; topicCode?: string; jumlahSoal?: number },
): Promise<MulaiSesiHasil> {
  if (!userId) return { ok: false, errors: [{ field: "userId", message: "Wajib login untuk latihan." }] };
  const jumlah = Math.max(1, Math.min(input.jumlahSoal ?? 10, 30));

  const repoSoal = await getQuestionRepository();
  const semua = await repoSoal.list({});
  let kandidat = semua.filter((q) => q.status === "approved" || q.status === "published");
  if (input.subjectCode) {
    const s = input.subjectCode.trim().toUpperCase();
    kandidat = kandidat.filter((q) => q.subjectCode.toUpperCase() === s);
  }
  if (input.mode === "topic" && input.topicCode) {
    const t = input.topicCode.trim().toUpperCase();
    kandidat = kandidat.filter((q) => q.topicCode.toUpperCase() === t);
  }
  if (kandidat.length === 0) {
    return { ok: false, errors: [{ field: "questionIds", message: "Tidak ada soal approved untuk pilihan ini." }] };
  }
  const dipilih = acak(kandidat).slice(0, Math.min(jumlah, kandidat.length));
  const validasi = validasiMulaiSesi({
    mode: input.mode,
    subjectCode: input.subjectCode ?? "",
    topicCode: input.topicCode ?? "",
    questionIds: dipilih.map((q) => q.id),
  });
  if (!validasi.ok) return { ok: false, errors: validasi.errors };

  const repo = await getAttemptRepository();
  const sesi = await repo.createSession({
    id: crypto.randomUUID(),
    userId,
    mode: input.mode,
    subjectId: input.subjectCode ?? null,
    topicCode: input.topicCode ?? null,
    questionIds: dipilih.map((q) => q.id),
    startedAt: new Date().toISOString(),
    questionCount: dipilih.length,
  });
  return { ok: true, sesi };
}

/** Selesaikan sesi milik sendiri: hitung benar dari attempts → finish + skor. */
export async function selesaikanSesiLatihan(
  userId: string,
  sessionId: string,
  durasiDetik: number | null,
): Promise<SelesaikanSesiHasil> {
  if (!userId) return { ok: false, errors: [{ field: "userId", message: "Wajib login." }] };
  const repo = await getAttemptRepository();
  const sesi = await repo.getSession(sessionId);
  if (!sesi) return { ok: false, errors: [{ field: "sessionId", message: "Sesi tidak ditemukan." }] };
  if (sesi.userId !== userId) {
    return { ok: false, errors: [{ field: "sessionId", message: "Bukan sesi milikmu." }] };
  }
  if (sesi.finishedAt) return { ok: true, sesi, skor: skorSesi(sesi.correctCount, sesi.questionCount) };
  const upaya = await repo.listAttempts(sessionId);
  const benar = upaya.filter((a) => a.isCorrect).length;
  const selesai = await repo.finishSession(sessionId, benar, durasiDetik);
  if (!selesai) return { ok: false, errors: [{ field: "sessionId", message: "Gagal menyelesaikan sesi." }] };
  return { ok: true, sesi: selesai, skor: skorSesi(selesai.correctCount, selesai.questionCount) };
}

/** Daftar sesi milik sendiri (terbaru dulu). */
export async function daftarSesiSaya(userId: string): Promise<PracticeSession[]> {
  if (!userId) return [];
  return (await getAttemptRepository()).listSessions(userId);
}

/**
 * P4.3 — QuestionRepository: interface + mock in-memory + factory.
 *
 *
 * File ini SENGAJA tidak mengimpor modul server-only (db/storage) agar
 * aman dipakai di tes node --test. Implementasi Drizzle dimuat malas
 * (dynamic import) hanya bila DATABASE_URL tersedia.
 */
import type {
  CmsQuestion,
  CmsQuestionInput,
  CmsQuestionPatch,
  CmsStatus,
  QuestionFilter,
} from "./question-model.ts";

export type { CmsQuestion, CmsQuestionInput, CmsQuestionPatch, CmsStatus, QuestionFilter };

export interface QuestionRepository {
  list(filter?: QuestionFilter): Promise<CmsQuestion[]>;
  getById(id: string): Promise<CmsQuestion | null>;
  create(input: CmsQuestionInput, actorId: string): Promise<CmsQuestion>;
  update(id: string, patch: CmsQuestionPatch, actorId: string): Promise<CmsQuestion | null>;
  remove(id: string): Promise<boolean>;
  setStatus(
    id: string,
    status: CmsStatus,
    actorId: string,
    opts?: { reviewedBy?: string | null },
  ): Promise<CmsQuestion | null>;
}

function cocokFilter(q: CmsQuestion, f: QuestionFilter): boolean {
  if (f.status !== undefined && q.status !== f.status) return false;
  if (f.subjectCode !== undefined && f.subjectCode !== "" && q.subjectCode !== f.subjectCode) {
    return false;
  }
  if (f.topicCode !== undefined && f.topicCode !== "" && q.topicCode !== f.topicCode) return false;
  if (f.difficulty !== undefined && q.difficulty !== f.difficulty) return false;
  if (f.questionType !== undefined && q.questionType !== f.questionType) return false;
  const cari = (f.search ?? "").trim().toLowerCase();
  if (cari !== "") {
    const haystack = `${q.code} ${JSON.stringify(q.contentBlocks)}`.toLowerCase();
    if (!haystack.includes(cari)) return false;
  }
  return true;
}

/**
 * Mock in-memory untuk tes + pengembangan tanpa DB. Fidelitas penuh
 * terhadap model CmsQuestion (taksonomi ikut tersimpan).
 */
export class InMemoryQuestionRepository implements QuestionRepository {
  private soal = new Map<string, CmsQuestion>();

  async list(filter: QuestionFilter = {}): Promise<CmsQuestion[]> {
    return [...this.soal.values()]
      .filter((q) => cocokFilter(q, filter))
      .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  }

  async getById(id: string): Promise<CmsQuestion | null> {
    return this.soal.get(id) ?? null;
  }

  async create(input: CmsQuestionInput, actorId: string): Promise<CmsQuestion> {
    for (const q of this.soal.values()) {
      if (q.code === input.code) throw new Error(`Kode soal sudah dipakai: ${input.code}`);
    }
    const kini = new Date().toISOString();
    const baru: CmsQuestion = {
      ...input,
      skillCodes: [...input.skillCodes],
      contentBlocks: [...input.contentBlocks],
      options: input.options.map((o) => ({ ...o, blocks: [...o.blocks] })),
      explanation: { ...input.explanation },
      id: crypto.randomUUID(),
      status: "draft",
      createdBy: actorId,
      reviewedBy: null,
      publishedAt: null,
      createdAt: kini,
      updatedAt: kini,
    };
    this.soal.set(baru.id, baru);
    return baru;
  }

  async update(id: string, patch: CmsQuestionPatch, _actorId: string): Promise<CmsQuestion | null> {
    const lama = this.soal.get(id);
    if (!lama) return null;
    if (patch.code !== undefined && patch.code !== lama.code) {
      for (const q of this.soal.values()) {
        if (q.id !== id && q.code === patch.code) {
          throw new Error(`Kode soal sudah dipakai: ${patch.code}`);
        }
      }
    }
    const gabung: CmsQuestion = {
      ...lama,
      ...patch,
      id: lama.id,
      status: lama.status,
      createdBy: lama.createdBy,
      reviewedBy: lama.reviewedBy,
      publishedAt: lama.publishedAt,
      createdAt: lama.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.soal.set(id, gabung);
    return gabung;
  }

  async remove(id: string): Promise<boolean> {
    return this.soal.delete(id);
  }

  async setStatus(
    id: string,
    status: CmsStatus,
    _actorId: string,
    opts: { reviewedBy?: string | null } = {},
  ): Promise<CmsQuestion | null> {
    const lama = this.soal.get(id);
    if (!lama) return null;
    const kini = new Date().toISOString();
    const gabung: CmsQuestion = {
      ...lama,
      status,
      reviewedBy: opts.reviewedBy !== undefined ? opts.reviewedBy : lama.reviewedBy,
      publishedAt: status === "published" ? (lama.publishedAt ?? kini) : lama.publishedAt,
      updatedAt: kini,
    };
    this.soal.set(id, gabung);
    return gabung;
  }
}

let memo: QuestionRepository | undefined;

/**
 * Factory: Drizzle bila DATABASE_URL tersedia, mock bila tidak.
 * Tanpa DB, CMS tetap bisa dibuka/dicoba (data hilang saat restart).
 */
export async function getQuestionRepository(): Promise<QuestionRepository> {
  if (memo) return memo;
  if (process.env["DATABASE_URL"]) {
    const mod = await import("./drizzle-questions.ts");
    memo = mod.createDrizzleQuestionRepository();
  } else {
    memo = new InMemoryQuestionRepository();
  }
  return memo;
}

/** Hanya untuk isolasi antar-tes. */
export function __resetQuestionRepositoryForTests(): void {
  memo = undefined;
}

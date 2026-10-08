// P2.4 — Eksekutor seed taksonomi TKA Matematika v1. SERVER-ONLY.
// JANGAN impor dari komponen client atau kode yang dibundel ke browser.
//
// Idempoten: tiap baris = INSERT ... ON CONFLICT (code) DO UPDATE,
// sehingga seed bisa dijalankan ulang tanpa duplikat. Resolve parent
// code → id per batch (induk di-seed lebih dulu, lihat buildUpsertPlan).
//
// Prasyarat: DATABASE_URL + migrasi P2.4 sudah di-apply (docs/decisions/P2-taxonomy-seed.md).
// JANGAN jalankan tanpa DB — seed butuh koneksi Neon yang hidup.
import "server-only";
import { sql } from "drizzle-orm";
import { getDb } from "./client.ts";
import {
  SKILLS,
  SUBJECTS,
  SUBTOPICS,
  TOPICS,
  validateTaxonomy,
} from "./taxonomy-data.ts";

/** Hasil satu kali jalan seed. */
export interface SeedTaxonomyResult {
  subjects: number;
  topics: number;
  subtopics: number;
  skills: number;
}

function wajibValid(): void {
  const galat = validateTaxonomy();
  if (galat.length > 0) {
    throw new Error(`[seed-taxonomy] data taksonomi tidak valid:\n- ${galat.join("\n- ")}`);
  }
}

async function upsertSubject(db: ReturnType<typeof getDb>, i: (typeof SUBJECTS)[number]): Promise<void> {
  await db.execute(sql`
    INSERT INTO "subjects" ("code","name","slug","description","status","sort_order")
    VALUES (${i.code},${i.name},${i.slug},${i.description},${i.status},${i.sortOrder})
    ON CONFLICT ("code") DO UPDATE SET
      "name"=EXCLUDED."name","slug"=EXCLUDED."slug",
      "description"=EXCLUDED."description","status"=EXCLUDED."status",
      "sort_order"=EXCLUDED."sort_order","updated_at"=NOW()`);
}

async function idDariKode(
  db: ReturnType<typeof getDb>,
  tabel: "subjects" | "topics" | "subtopics",
  code: string,
): Promise<string> {
  const baris = (await db.execute(
    sql`SELECT "id" FROM ${sql.identifier(tabel)} WHERE "code"=${code} LIMIT 1`,
  )) as unknown as Array<{ id: string }>;
  const id = baris[0]?.id;
  if (!id) throw new Error(`[seed-taxonomy] parent ${tabel}.${code} tidak ditemukan.`);
  return id;
}

/** Seed taksonomi Math v1. Idempoten — aman dijalankan ulang. */
export async function seedTaxonomy(): Promise<SeedTaxonomyResult> {
  wajibValid();
  const db = getDb();

  for (const s of SUBJECTS) await upsertSubject(db, s);
  for (const t of TOPICS) {
    const subjectId = await idDariKode(db, "subjects", t.parentCode);
    await db.execute(sql`
      INSERT INTO "topics" ("subject_id","code","name","description","sort_order","status")
      VALUES (${subjectId},${t.code},${t.name},${t.description},${t.sortOrder},${t.status})
      ON CONFLICT ("code") DO UPDATE SET
        "subject_id"=EXCLUDED."subject_id","name"=EXCLUDED."name",
        "description"=EXCLUDED."description","sort_order"=EXCLUDED."sort_order",
        "status"=EXCLUDED."status"`);
  }
  for (const s of SUBTOPICS) {
    const topicId = await idDariKode(db, "topics", s.parentCode);
    await db.execute(sql`
      INSERT INTO "subtopics" ("topic_id","code","name","description","sort_order","status")
      VALUES (${topicId},${s.code},${s.name},${s.description},${s.sortOrder},${s.status})
      ON CONFLICT ("code") DO UPDATE SET
        "topic_id"=EXCLUDED."topic_id","name"=EXCLUDED."name",
        "description"=EXCLUDED."description","sort_order"=EXCLUDED."sort_order",
        "status"=EXCLUDED."status"`);
  }
  for (const k of SKILLS) {
    const subtopicId = await idDariKode(db, "subtopics", k.parentCode);
    await db.execute(sql`
      INSERT INTO "skills" ("subtopic_id","code","name","description","competency","sort_order","status")
      VALUES (${subtopicId},${k.code},${k.name},${k.description},${k.competency},${k.sortOrder},${k.status})
      ON CONFLICT ("code") DO UPDATE SET
        "subtopic_id"=EXCLUDED."subtopic_id","name"=EXCLUDED."name",
        "description"=EXCLUDED."description","competency"=EXCLUDED."competency",
        "sort_order"=EXCLUDED."sort_order","status"=EXCLUDED."status"`);
  }

  return {
    subjects: SUBJECTS.length,
    topics: TOPICS.length,
    subtopics: SUBTOPICS.length,
    skills: SKILLS.length,
  };
}

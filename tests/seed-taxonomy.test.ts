// P2.4 — Tes konsistensi data taksonomi Math v1 (TANPA DB).
//
// Mengimpor LANGSUNG dari src/server/db/taxonomy-data.ts — file itu murni
// data + logika murni (tanpa server-only/drizzle/I-O) sehingga aman di
// bawah plain `node --test` (pola sama seperti storage-validate.test.ts).
// Idempotensi dibuktikan dengan replay rencana upsert ke Map (last-write-wins).
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SKILLS,
  SUBJECTS,
  SUBTOPICS,
  TAXONOMY_COUNTS,
  TOPICS,
  buildUpsertPlan,
  validateTaxonomy,
} from "../src/server/db/taxonomy-data.ts";

test("jumlah baris persis FROZEN v1 (1/5/10/32)", () => {
  assert.equal(SUBJECTS.length, TAXONOMY_COUNTS.subjects);
  assert.equal(TOPICS.length, TAXONOMY_COUNTS.topics);
  assert.equal(SUBTOPICS.length, TAXONOMY_COUNTS.subtopics);
  assert.equal(SKILLS.length, TAXONOMY_COUNTS.skills);
  assert.deepEqual(validateTaxonomy(), []);
});

test("semua code unik lintas 4 tabel", () => {
  const semua = [...SUBJECTS, ...TOPICS, ...SUBTOPICS, ...SKILLS].map((b) => b.code);
  assert.equal(new Set(semua).size, semua.length);
});

test("setiap parent code ada (topic→subject, subtopic→topic, skill→subtopic)", () => {
  const subjects = new Set(SUBJECTS.map((s) => s.code));
  const topics = new Set(TOPICS.map((t) => t.code));
  const subtopics = new Set(SUBTOPICS.map((s) => s.code));
  for (const t of TOPICS) assert.ok(subjects.has(t.parentCode), `parent hilang: ${t.code}`);
  for (const s of SUBTOPICS) assert.ok(topics.has(s.parentCode), `parent hilang: ${s.code}`);
  for (const k of SKILLS) assert.ok(subtopics.has(k.parentCode), `parent hilang: ${k.code}`);
});

test("status: subject MATH active, topics/subtopics/skills draft", () => {
  const math = SUBJECTS.find((s) => s.code === "MATH");
  assert.ok(math);
  assert.equal(math.status, "active");
  for (const b of [...TOPICS, ...SUBTOPICS, ...SKILLS]) assert.equal(b.status, "draft");
});

test("setiap skill competency memuat rentang level [Lx–Ly]", () => {
  for (const k of SKILLS) assert.match(k.competency, /\[L[123]–L[123]\]/);
});

test("rencana upsert: 48 operasi, urutan induk-sebelum-anak", () => {
  const rencana = buildUpsertPlan();
  assert.equal(rencana.length, 1 + 5 + 10 + 32);
  const pertama: Record<string, number> = {};
  rencana.forEach((op, i) => {
    if (!(op.code in pertama)) pertama[op.code] = i;
  });
  for (const op of rencana) {
    if (op.parentCode) {
      assert.ok(
        (pertama[op.parentCode] ?? Infinity) < (pertama[op.code] ?? -1),
        `parent sesudah anak: ${op.code}`,
      );
    }
  }
});

test("idempoten: replay rencana 2x ke store Map → hasil akhir identik", () => {
  const jalankan = () => {
    const store = new Map<string, { table: string; parent: string | null }>();
    for (let putaran = 0; putaran < 2; putaran++) {
      for (const op of buildUpsertPlan()) store.set(op.code, { table: op.table, parent: op.parentCode });
    }
    return [...store.entries()];
  };
  assert.deepEqual(jalankan(), jalankan());
  assert.equal(jalankan().length, 1 + 5 + 10 + 32);
});

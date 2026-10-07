import { test } from "node:test";
import assert from "node:assert/strict";
import {
  checkApprovalEligibility,
  isLegalTransition,
  resolveTransition,
  toPublishGateInput,
  type CmsQuestion,
  type CmsQuestionInput,
} from "../src/server/repositories/question-model.ts";
import { InMemoryQuestionRepository } from "../src/server/repositories/questions.ts";
import { checkPublishGate } from "../src/domain/question/publish-gate.ts";

function inputLengkap(kode = "MAT-ALG-001"): CmsQuestionInput {
  return {
    code: kode,
    subjectCode: "matematika",
    topicCode: "ALG",
    subtopicCode: "FUNC",
    skillCodes: ["MATH.ALG.FUNC.QUAD.INTERPRET"],
    difficulty: "medium",
    questionType: "single_choice",
    contentBlocks: [
      { type: "text", content: "Tentukan akar persamaan berikut." },
      { type: "math", latex: "x^2-5x+6=0" },
    ],
    options: [
      { blocks: [{ type: "math", latex: "x=2 \\text{ atau } x=3" }], isCorrect: true },
      { blocks: [{ type: "math", latex: "x=1 \\text{ atau } x=6" }], isCorrect: false },
    ],
    explanation: {
      blocks: [{ type: "text", content: "Faktorkan: (x-2)(x-3)=0." }],
      commonMistake: [{ type: "text", content: "Keliru tanda konstanta." }],
      solvingTip: [{ type: "text", content: "Cek dengan substitusi balik." }],
    },
    sourceType: "original_internal",
    estimatedTimeSeconds: 120,
  };
}

const AKTOR = {
  admin: { id: "admin_1", role: "admin" },
  reviewer: { id: "reviewer_1", role: "reviewer" },
  penulis: { id: "penulis_1", role: "editor" },
};

test("P4 CRUD: buat → baca → ubah → hapus soal", async () => {
  const repo = new InMemoryQuestionRepository();
  const baru = await repo.create(inputLengkap(), AKTOR.penulis.id);
  assert.equal(baru.status, "draft");
  assert.equal(baru.createdBy, AKTOR.penulis.id);
  const baca = await repo.getById(baru.id);
  assert.equal(baca?.code, "MAT-ALG-001");
  const ubah = await repo.update(baru.id, { topicCode: "GEO" }, AKTOR.penulis.id);
  assert.equal(ubah?.topicCode, "GEO");
  assert.equal(ubah?.status, "draft");
  assert.equal(await repo.remove(baru.id), true);
  assert.equal(await repo.getById(baru.id), null);
});

test("P4 CRUD: kode duplikat ditolak", async () => {
  const repo = new InMemoryQuestionRepository();
  await repo.create(inputLengkap("SAMA-001"), AKTOR.penulis.id);
  await assert.rejects(() => repo.create(inputLengkap("SAMA-001"), AKTOR.penulis.id));
});

test("P4 filter: status + subject + search", async () => {
  const repo = new InMemoryQuestionRepository();
  const a = await repo.create(inputLengkap("MAT-ALG-001"), AKTOR.penulis.id);
  await repo.create(inputLengkap("IND-BACA-001"), AKTOR.penulis.id);
  await repo.setStatus(a.id, "in_review", AKTOR.penulis.id);
  const review = await repo.list({ status: "in_review" });
  assert.equal(review.length, 1);
  assert.equal(review[0]?.code, "MAT-ALG-001");
  const indo = await repo.list({ search: "IND-BACA" });
  assert.equal(indo.length, 1);
  const kosong = await repo.list({ search: "zzz-tidak-ada" });
  assert.equal(kosong.length, 0);
});

test("P4 workflow legal: draft → in_review → approved → published → archived", async () => {
  const repo = new InMemoryQuestionRepository();
  let q = await repo.create(inputLengkap(), AKTOR.penulis.id);
  const r1 = resolveTransition(q, "in_review", AKTOR.penulis);
  assert.equal(r1.ok, true);
  q = (await repo.setStatus(q.id, "in_review", AKTOR.penulis.id)) as CmsQuestion;
  const r2 = resolveTransition(q, "approved", { id: "reviewer_1", role: "reviewer" });
  assert.equal(r2.ok, true);
  q = (await repo.setStatus(q.id, "approved", "reviewer_1", { reviewedBy: "reviewer_1" })) as CmsQuestion;
  const lengkap = { ...q, reviewedBy: "reviewer_1" };
  const r3 = resolveTransition(lengkap, "published", { id: "reviewer_1", role: "reviewer" });
  assert.equal(r3.ok, true);
  q = (await repo.setStatus(q.id, "published", "reviewer_1")) as CmsQuestion;
  const r4 = resolveTransition({ ...q, reviewedBy: "reviewer_1" }, "archived", AKTOR.reviewer);
  assert.equal(r4.ok, true);
  assert.ok(isLegalTransition("archived", "draft"));
  assert.ok(!isLegalTransition("published", "draft"));
});

test("P4 workflow ilegal: draft → published langsung ditolak", async () => {
  const repo = new InMemoryQuestionRepository();
  const q = await repo.create(inputLengkap(), AKTOR.penulis.id);
  const r = resolveTransition(q, "published", AKTOR.admin);
  assert.equal(r.ok, false);
  assert.equal(r.code, "ILLEGAL_TRANSITION");
});

test("P4 approval: editor tak bisa approve; penulis tak bisa approve sendiri", () => {
  const editor = checkApprovalEligibility({ actorRole: "editor", actorId: "e1", createdBy: "e2" });
  assert.equal(editor.ok, false);
  const sendiri = checkApprovalEligibility({ actorRole: "reviewer", actorId: "r1", createdBy: "r1" });
  assert.equal(sendiri.ok, false);
  const kolega = checkApprovalEligibility({ actorRole: "reviewer", actorId: "r1", createdBy: "e2" });
  assert.equal(kolega.ok, true);
  const adminDarurat = checkApprovalEligibility({ actorRole: "admin", actorId: "a1", createdBy: "a1" });
  assert.equal(adminDarurat.ok, true);
});

test("P4 approval via transisi: editor menuju approved → 403", async () => {
  const repo = new InMemoryQuestionRepository();
  let q = await repo.create(inputLengkap(), AKTOR.penulis.id);
  q = (await repo.setStatus(q.id, "in_review", AKTOR.penulis.id)) as CmsQuestion;
  const r = resolveTransition(q, "approved", { id: "editor_x", role: "editor" });
  assert.equal(r.ok, false);
  assert.equal(r.code, "FORBIDDEN_APPROVAL");
  const rSelf = resolveTransition(q, "approved", { id: AKTOR.penulis.id, role: "reviewer" });
  assert.equal(rSelf.ok, false);
  assert.equal(rSelf.code, "FORBIDDEN_APPROVAL");
});

test("P4 publish gate lolos untuk soal lengkap yang disetujui", async () => {
  const repo = new InMemoryQuestionRepository();
  const q = await repo.create(inputLengkap(), AKTOR.penulis.id);
  const gate = checkPublishGate(toPublishGateInput({ ...q, reviewedBy: "reviewer_1" }));
  assert.equal(gate.ok, true);
  assert.equal(gate.errors.length, 0);
});

test("P4 publish gate gagal: hilang skill + reviewer + waktu → missing[] terisi", async () => {
  const repo = new InMemoryQuestionRepository();
  const q = await repo.create(inputLengkap(), AKTOR.penulis.id);
  const kurang: CmsQuestion = {
    ...q,
    skillCodes: [],
    reviewedBy: null,
    estimatedTimeSeconds: 0,
    explanation: { blocks: q.explanation.blocks },
  };
  const gate = checkPublishGate(toPublishGateInput(kurang));
  assert.equal(gate.ok, false);
  assert.ok(gate.errors.length >= 3);
  const r = resolveTransition(kurang, "published", AKTOR.admin);
  assert.equal(r.ok, false);
  assert.equal(r.code, "ILLEGAL_TRANSITION");
  const siap = { ...kurang, status: "approved" as const };
  const r2 = resolveTransition(siap, "published", AKTOR.admin);
  assert.equal(r2.ok, false);
  assert.equal(r2.code, "PUBLISH_GATE_INCOMPLETE");
  assert.ok((r2.missing ?? []).length >= 3);
});

test("P4 editor tak boleh menerbitkan walau soal lengkap", async () => {
  const repo = new InMemoryQuestionRepository();
  const q = await repo.create(inputLengkap(), AKTOR.penulis.id);
  const siap: CmsQuestion = { ...q, status: "approved", reviewedBy: "reviewer_1" };
  const r = resolveTransition(siap, "published", { id: "editor_x", role: "editor" });
  assert.equal(r.ok, false);
  assert.equal(r.code, "FORBIDDEN_PUBLISH");
});

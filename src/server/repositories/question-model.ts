/**
 * P4.3–P4.18 — Model + aturan murni CMS soal (tanpa I/O, tanpa DB).
 *
 * File ini boleh diimpor dari mana saja (server route, komponen client,
 * maupun tes): tidak ada dependensi server-only. Aturan workflow +
 * approval + adaptor publish-gate terpusat di sini agar API dan tes
 * memakai logika yang sama.
 *
 * Siklus (docs/CONTENT-POLICY.md): DRAFT → IN_REVIEW → APPROVED →
 * PUBLISHED → ARCHIVED. Persetujuan reviewer manusia tetap di luar
 * sistem; `reviewedBy` hanya mencatat siapa yang menekan tombol setuju.
 */
import type { ContentBlock } from "../../domain/question/content-blocks.ts";
import { checkPublishGate } from "../../domain/question/publish-gate.ts";
import type {
  Difficulty,
  PublishGateError,
  QuestionType,
  SourceType,
} from "../../domain/question/publish-gate.ts";

/** Status editorial V1 — sama persis dengan enum content_status di DB. */
export const cmsStatuses = ["draft", "in_review", "approved", "published", "archived"] as const;
export type CmsStatus = (typeof cmsStatuses)[number];

/** Peran CMS V1: editor (tulis), reviewer (setujui), admin (semua + self-approve). */
export const cmsRoles = ["admin", "reviewer", "editor"] as const;
export type CmsRole = (typeof cmsRoles)[number];

/** Hanya reviewer/admin yang boleh menyetujui dan menerbitkan (P4.17). */
export const approverRoles: readonly CmsRole[] = ["reviewer", "admin"];

export interface CmsOption {
  blocks: ContentBlock[];
  isCorrect: boolean;
}

export interface CmsExplanation {
  blocks: ContentBlock[];
  commonMistake?: ContentBlock[];
  solvingTip?: ContentBlock[];
}

export interface CmsQuestion {
  id: string;
  code: string;
  subjectCode: string;
  topicCode: string;
  subtopicCode: string;
  skillCodes: string[];
  difficulty: Difficulty;
  questionType: QuestionType;
  contentBlocks: ContentBlock[];
  options: CmsOption[];
  explanation: CmsExplanation;
  sourceType: SourceType;
  sourceReference?: string;
  estimatedTimeSeconds: number;
  status: CmsStatus;
  createdBy: string;
  reviewedBy: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Input tulis: draf boleh belum lengkap (gate hanya saat publish, P4.18). */
export interface CmsQuestionInput {
  code: string;
  subjectCode: string;
  topicCode: string;
  subtopicCode: string;
  skillCodes: string[];
  difficulty: Difficulty;
  questionType: QuestionType;
  contentBlocks: ContentBlock[];
  options: CmsOption[];
  explanation: CmsExplanation;
  sourceType: SourceType;
  sourceReference?: string;
  estimatedTimeSeconds: number;
}

export type CmsQuestionPatch = Partial<CmsQuestionInput>;

export interface QuestionFilter {
  status?: CmsStatus;
  subjectCode?: string;
  topicCode?: string;
  difficulty?: Difficulty;
  questionType?: QuestionType;
  /** Cari di kode soal + isi blok teks/math. */
  search?: string;
}

/**
 * Transisi workflow legal (P4.16). Selain yang terdaftar → 422.
 * archived → draft = pemulihan untuk revisi ulang.
 */
export const WORKFLOW_TRANSITIONS: Record<CmsStatus, readonly CmsStatus[]> = {
  draft: ["in_review", "archived"],
  in_review: ["draft", "approved", "archived"],
  approved: ["in_review", "published", "archived"],
  published: ["archived"],
  archived: ["draft"],
};

export function isLegalTransition(from: CmsStatus, to: CmsStatus): boolean {
  return WORKFLOW_TRANSITIONS[from].includes(to);
}

export function isApproverRole(role: string): boolean {
  return (approverRoles as readonly string[]).includes(role);
}

export interface ApprovalCheck {
  actorRole: string;
  actorId: string;
  createdBy: string;
}

export type ApprovalVerdict = { ok: true } | { ok: false; reason: string };

/**
 * Aturan reviewer approval (P4.17):
 * 1. Hanya peran reviewer/admin yang boleh menyetujui.
 * 2. Pembuat soal tidak boleh menyetujui karyanya sendiri —
 *    kecuali admin (akuntabilitas darurat, tetap tercatat).
 */
export function checkApprovalEligibility(check: ApprovalCheck): ApprovalVerdict {
  if (!isApproverRole(check.actorRole)) {
    return {
      ok: false,
      reason: `Peran "${check.actorRole}" tidak boleh menyetujui soal; hanya reviewer/admin.`,
    };
  }
  if (check.actorId === check.createdBy && check.actorRole !== "admin") {
    return {
      ok: false,
      reason:
        "Penulis tidak boleh menyetujui soalnya sendiri; minta reviewer lain (pemisahan tugas).",
    };
  }
  return { ok: true };
}

/**
 * Adaptor CmsQuestion → bentuk yang dimengerti checkPublishGate
 * (src/domain/question/publish-gate.ts). Array opsional dinormalkan
 * agar gate melaporkan field yang kurang, bukan crash.
 */
export function toPublishGateInput(q: CmsQuestion): Record<string, unknown> {
  return {
    subjectCode: q.subjectCode,
    topicCode: q.topicCode,
    subtopicCode: q.subtopicCode,
    skillCodes: q.skillCodes,
    difficulty: q.difficulty,
    questionType: q.questionType,
    contentBlocks: q.contentBlocks,
    options: q.options,
    explanation: {
      blocks: q.explanation.blocks,
      commonMistake: q.explanation.commonMistake ?? [],
      solvingTip: q.explanation.solvingTip ?? [],
    },
    sourceType: q.sourceType,
    estimatedTimeSeconds: q.estimatedTimeSeconds,
    reviewedBy: q.reviewedBy ?? "",
  };
}

/** Aktor yang meminta transisi (id + peran dari guard auth). */
export interface CmsActor {
  id: string;
  role: string;
}

export type TransitionRefusalCode =
  | "ILLEGAL_TRANSITION"
  | "FORBIDDEN_APPROVAL"
  | "FORBIDDEN_PUBLISH"
  | "PUBLISH_GATE_INCOMPLETE";

export interface TransitionPlan {
  ok: boolean;
  code?: TransitionRefusalCode;
  message?: string;
  /** Terisi bila penolakan berasal dari publish gate (P4.18). */
  missing?: PublishGateError[];
}

/**
 * Penentu transisi terpusat (P4.16–P4.18) — dipakai route API dan tes.
 * - Transisi harus terdaftar di WORKFLOW_TRANSITIONS.
 * - `approved` wajib lolos checkApprovalEligibility (P4.17).
 * - `published` wajib peran reviewer/admin DAN lolos checkPublishGate (P4.18).
 */
export function resolveTransition(q: CmsQuestion, to: CmsStatus, actor: CmsActor): TransitionPlan {
  if (!isLegalTransition(q.status, to)) {
    return {
      ok: false,
      code: "ILLEGAL_TRANSITION",
      message: `Transisi ${q.status} → ${to} tidak diizinkan. Jalur resmi: DRAFT → IN_REVIEW → APPROVED → PUBLISHED (→ ARCHIVED).`,
    };
  }
  if (to === "approved") {
    const cek = checkApprovalEligibility({
      actorRole: actor.role,
      actorId: actor.id,
      createdBy: q.createdBy,
    });
    if (!cek.ok) {
      return { ok: false, code: "FORBIDDEN_APPROVAL", message: cek.reason };
    }
  }
  if (to === "published") {
    if (!isApproverRole(actor.role)) {
      return {
        ok: false,
        code: "FORBIDDEN_PUBLISH",
        message: `Peran "${actor.role}" tidak boleh menerbitkan soal; hanya reviewer/admin.`,
      };
    }
    const gate = checkPublishGate(toPublishGateInput(q));
    if (!gate.ok) {
      return {
        ok: false,
        code: "PUBLISH_GATE_INCOMPLETE",
        message: `Soal belum lengkap untuk publish (${gate.errors.length} field kurang).`,
        missing: gate.errors,
      };
    }
  }
  return { ok: true };
}

// P2.5 + P2.6 + P2.7 — Tabel question/content, learning, dan tryout. Placeholder
// registry dipertahankan di bawah: P2.3 (subjects/topics/subtopics/skills)
// DITAHAN menunggu P1.6 freeze — JANGAN daftarkan tabel taksonomi sebelum itu.
// P2.9/P2.10 — Blok auth (users/sessions/accounts/verifications/user_profiles)
// mengikuti docs/decisions/P2-auth-decision.md (Better Auth, sesi DB-backed).
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enum — kosakata status sesuai docs (DATABASE.md, CONTENT-POLICY.md, MASTERY.md)
// ---------------------------------------------------------------------------

/** Difficulty V1 (docs/DATABASE.md): easy / medium / hard. */
export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);

/** Tipe soal V1, selaras domain publish-gate. */
export const questionTypeEnum = pgEnum("question_type", ["single_choice", "multiple_choice"]);

/** Tipe sumber konten (docs/CONTENT-POLICY.md). */
export const sourceTypeEnum = pgEnum("source_type", [
  "official_reference",
  "original_internal",
  "licensed_partner",
]);

/** Lifecycle konten editorial (docs/CONTENT-POLICY.md): DRAFT → ARCHIVED. */
export const contentStatusEnum = pgEnum("content_status", [
  "draft",
  "in_review",
  "approved",
  "published",
  "archived",
]);

/** Status aset media. Asumsi V1: aktif dipakai / diarsipkan (lihat decision doc). */
export const mediaStatusEnum = pgEnum("media_status", ["active", "archived"]);

/** Mode sesi latihan (docs/DATABASE.md). */
export const practiceModeEnum = pgEnum("practice_mode", [
  "quick",
  "topic",
  "adaptive",
  "mistake_review",
  "diagnostic",
]);

/** Status antrian kesalahan (docs/DATABASE.md, docs/MASTERY.md). */
export const mistakeStatusEnum = pgEnum("mistake_status", ["open", "improving", "resolved"]);

/** Status template tryout. Asumsi V1: draft → active → archived. */
export const tryoutTemplateStatusEnum = pgEnum("tryout_template_status", [
  "draft",
  "active",
  "archived",
]);

/** Status sesi tryout. Asumsi V1: berjalan → disubmit / kedaluwarsa. */
export const tryoutSessionStatusEnum = pgEnum("tryout_session_status", [
  "in_progress",
  "submitted",
  "expired",
]);

// ---------------------------------------------------------------------------
// P2.5 — Question / content tables (field persis docs/DATABASE.md)
// Kontrak: kolom JSONB polos TANPA CHECK constraint — validasi struktur milik
// layer domain Zod (src/domain/question/), bukan database.
// ---------------------------------------------------------------------------

/** Stimulus bersama (bacaan/gambar/grafik) yang bisa dipakai banyak soal. */
export const stimuli = pgTable(
  "stimuli",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    contentBlocks: jsonb("content_blocks").notNull(),
    sourceType: sourceTypeEnum("source_type").notNull(),
    sourceReference: text("source_reference"),
    status: contentStatusEnum("status").notNull().default("draft"),
    createdBy: text("created_by"),
    reviewedBy: text("reviewed_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("stimuli_status_idx").on(t.status)],
);

/**
 * Bank soal. subject_id TANPA FK — tabel subjects lahir di P2.3 (DITAHAN
 * menunggu P1.6 freeze); FK menyusul di migrasi berikutnya.
 */
export const questions = pgTable(
  "questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull().unique(),
    subjectId: uuid("subject_id"),
    stimulusId: uuid("stimulus_id").references(() => stimuli.id, { onDelete: "set null" }),
    questionType: questionTypeEnum("question_type").notNull(),
    difficulty: difficultyEnum("difficulty").notNull(),
    contentBlocks: jsonb("content_blocks").notNull(),
    explanationBlocks: jsonb("explanation_blocks").notNull(),
    commonMistake: jsonb("common_mistake"),
    solvingTip: jsonb("solving_tip"),
    estimatedTimeSeconds: integer("estimated_time_seconds"),
    sourceType: sourceTypeEnum("source_type").notNull(),
    sourceReference: text("source_reference"),
    status: contentStatusEnum("status").notNull().default("draft"),
    createdBy: text("created_by"),
    reviewedBy: text("reviewed_by"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("questions_stimulus_id_idx").on(t.stimulusId),
    index("questions_status_idx").on(t.status),
    index("questions_subject_id_idx").on(t.subjectId),
  ],
);

/**
 * Opsi jawaban per soal. `is_correct` TIDAK BOLEH bocor ke payload sesi aktif
 * (docs/DATABASE.md) — penegakannya di repository/service, bukan di skema.
 */
export const questionOptions = pgTable(
  "question_options",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    contentBlocks: jsonb("content_blocks").notNull(),
    isCorrect: boolean("is_correct").notNull().default(false),
  },
  (t) => [
    index("question_options_question_id_idx").on(t.questionId),
    uniqueIndex("question_options_question_position_uniq").on(t.questionId, t.position),
  ],
);

/**
 * Relasi soal ↔ skill (banyak-ke-banyak, satu soal bisa mengukur banyak skill).
 * skill_id TANPA FK (tabel skills lahir di P2.3); FK menyusul.
 */
export const questionSkills = pgTable(
  "question_skills",
  {
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    skillId: uuid("skill_id").notNull(),
    weight: real("weight").notNull().default(1),
    isPrimary: boolean("is_primary").notNull().default(false),
  },
  (t) => [
    primaryKey({ columns: [t.questionId, t.skillId] }),
    index("question_skills_skill_id_idx").on(t.skillId),
  ],
);

/** Metadata aset gambar di Vercel Blob (bytes-nya di Blob, bukan di DB). */
export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    blobUrl: text("blob_url").notNull(),
    pathname: text("pathname").notNull().unique(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    width: integer("width"),
    height: integer("height"),
    altText: text("alt_text").notNull(),
    uploadedBy: text("uploaded_by"),
    status: mediaStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("media_assets_status_idx").on(t.status)],
);

// ---------------------------------------------------------------------------
// P2.6 — Learning tables (field persis docs/DATABASE.md)
// user_id berupa teks (id auth; tabel users lahir di P2.9+) TANPA FK.
// ---------------------------------------------------------------------------

/** Sesi latihan. subject_id TANPA FK (menyusul P2.3). */
export const practiceSessions = pgTable(
  "practice_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    mode: practiceModeEnum("mode").notNull(),
    subjectId: uuid("subject_id"),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    questionCount: integer("question_count").notNull().default(0),
    correctCount: integer("correct_count").notNull().default(0),
    durationSeconds: integer("duration_seconds"),
  },
  (t) => [index("practice_sessions_user_id_idx").on(t.userId)],
);

/**
 * Upaya jawab per soal. session_id nullable + SET NULL agar riwayat belajar
 * tidak hilang bila sesi dihapus; question_id NO ACTION (riwayat dipertahankan).
 */
export const questionAttempts = pgTable(
  "question_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    sessionId: uuid("session_id").references(() => practiceSessions.id, {
      onDelete: "set null",
    }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id),
    selectedAnswer: jsonb("selected_answer").notNull(),
    isCorrect: boolean("is_correct").notNull(),
    durationSeconds: integer("duration_seconds"),
    difficultySnapshot: difficultyEnum("difficulty_snapshot"),
    answeredAt: timestamp("answered_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("question_attempts_user_id_idx").on(t.userId),
    index("question_attempts_session_id_idx").on(t.sessionId),
    index("question_attempts_question_id_idx").on(t.questionId),
  ],
);

/**
 * Skor mastery per (user, skill). skill_id TANPA FK (menyusul P2.3).
 * mastery_score netral 50 = sesuai rumus MASTERY.md saat confidence 0.
 */
export const skillMastery = pgTable(
  "skill_mastery",
  {
    userId: text("user_id").notNull(),
    skillId: uuid("skill_id").notNull(),
    masteryScore: real("mastery_score").notNull().default(50),
    confidence: real("confidence").notNull().default(0),
    attemptCount: integer("attempt_count").notNull().default(0),
    correctCount: integer("correct_count").notNull().default(0),
    lastPracticedAt: timestamp("last_practiced_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.skillId] }),
    index("skill_mastery_skill_id_idx").on(t.skillId),
  ],
);

/** Antrian kesalahan per (user, soal). Satu baris per pasangan (upsert). */
export const mistakeQueue = pgTable(
  "mistake_queue",
  {
    userId: text("user_id").notNull(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id),
    firstWrongAt: timestamp("first_wrong_at", { withTimezone: true }).notNull().defaultNow(),
    lastWrongAt: timestamp("last_wrong_at", { withTimezone: true }).notNull().defaultNow(),
    wrongCount: integer("wrong_count").notNull().default(1),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    status: mistakeStatusEnum("status").notNull().default("open"),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.questionId] }),
    index("mistake_queue_user_status_idx").on(t.userId, t.status),
  ],
);

// ---------------------------------------------------------------------------
// P2.7 — Tryout tables
// DATABASE.md hanya mendefinisikan peran ketiga tabel (tanpa rincian field),
// sehingga kolom di bawah adalah desain V1 minimal; asumsi tercatat di
// docs/decisions/P2-schema-and-blob.md.
// ---------------------------------------------------------------------------

/**
 * Template tryout: komposisi mapel, durasi, jumlah soal, distribusi difficulty,
 * dan profil skoring — komposisi non-skalar sebagai JSONB.
 */
export const tryoutTemplates = pgTable(
  "tryout_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull().unique(),
    name: text("name").notNull(),
    // Cth: [{ "subjectCode": "matematika", "questionCount": 20 }].
    subjectComposition: jsonb("subject_composition").notNull(),
    durationSeconds: integer("duration_seconds").notNull(),
    questionCount: integer("question_count").notNull(),
    // Cth: { "easy": 0.3, "medium": 0.5, "hard": 0.2 }.
    difficultyDistribution: jsonb("difficulty_distribution").notNull(),
    // Profil skoring (bobot/penalti), cth: { "correct": 4, "wrong": -1, "blank": 0 }.
    scoringProfile: jsonb("scoring_profile").notNull(),
    status: tryoutTemplateStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("tryout_templates_status_idx").on(t.status)],
);

/**
 * Sesi tryout: set soal TERKUNCI (locked_question_ids) + status sesi.
 * template_id nullable + SET NULL agar sesi lampau tidak hilang bila template
 * dihapus.
 */
export const tryoutSessions = pgTable(
  "tryout_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    templateId: uuid("template_id").references(() => tryoutTemplates.id, {
      onDelete: "set null",
    }),
    userId: text("user_id").notNull(),
    status: tryoutSessionStatusEnum("status").notNull().default("in_progress"),
    // Array id soal yang dikunci saat sesi dibuat, urutan pengerjaan.
    lockedQuestionIds: jsonb("locked_question_ids").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    durationSeconds: integer("duration_seconds"),
    score: real("score"),
    correctCount: integer("correct_count"),
  },
  (t) => [
    index("tryout_sessions_user_id_idx").on(t.userId),
    index("tryout_sessions_template_id_idx").on(t.templateId),
    index("tryout_sessions_status_idx").on(t.status),
  ],
);

/** Jawaban per soal dalam satu sesi tryout (satu baris per pasangan, upsert). */
export const tryoutAnswers = pgTable(
  "tryout_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => tryoutSessions.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id),
    position: integer("position").notNull(),
    selectedAnswer: jsonb("selected_answer").notNull(),
    isFlagged: boolean("is_flagged").notNull().default(false),
    // null = belum dinilai.
    isCorrect: boolean("is_correct"),
    answeredAt: timestamp("answered_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("tryout_answers_session_id_idx").on(t.sessionId),
    uniqueIndex("tryout_answers_session_question_uniq").on(t.sessionId, t.questionId),
  ],
);

// ---------------------------------------------------------------------------
// Registry — satu-satunya jalan masuk skema (dipakai drizzle.config + barrel).
// P2.3 (subjects/topics/subtopics/skills) DITAHAN menunggu P1.6 freeze —
// JANGAN daftarkan tabel taksonomi di sini sebelum P2.3 dikerjakan.
// ---------------------------------------------------------------------------
export const schema = {
  difficultyEnum,
  questionTypeEnum,
  sourceTypeEnum,
  contentStatusEnum,
  mediaStatusEnum,
  practiceModeEnum,
  mistakeStatusEnum,
  tryoutTemplateStatusEnum,
  tryoutSessionStatusEnum,
  stimuli,
  questions,
  questionOptions,
  questionSkills,
  mediaAssets,
  practiceSessions,
  questionAttempts,
  skillMastery,
  mistakeQueue,
  tryoutTemplates,
  tryoutSessions,
  tryoutAnswers,
};

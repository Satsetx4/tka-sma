CREATE TYPE "public"."content_status" AS ENUM('draft', 'in_review', 'approved', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."media_status" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."mistake_status" AS ENUM('open', 'improving', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."practice_mode" AS ENUM('quick', 'topic', 'adaptive', 'mistake_review', 'diagnostic');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('single_choice', 'multiple_choice');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('official_reference', 'original_internal', 'licensed_partner');--> statement-breakpoint
CREATE TYPE "public"."tryout_session_status" AS ENUM('in_progress', 'submitted', 'expired');--> statement-breakpoint
CREATE TYPE "public"."tryout_template_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blob_url" text NOT NULL,
	"pathname" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"width" integer,
	"height" integer,
	"alt_text" text NOT NULL,
	"uploaded_by" text,
	"status" "media_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_pathname_unique" UNIQUE("pathname")
);
--> statement-breakpoint
CREATE TABLE "mistake_queue" (
	"user_id" text NOT NULL,
	"question_id" uuid NOT NULL,
	"first_wrong_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_wrong_at" timestamp with time zone DEFAULT now() NOT NULL,
	"wrong_count" integer DEFAULT 1 NOT NULL,
	"resolved_at" timestamp with time zone,
	"status" "mistake_status" DEFAULT 'open' NOT NULL,
	CONSTRAINT "mistake_queue_user_id_question_id_pk" PRIMARY KEY("user_id","question_id")
);
--> statement-breakpoint
CREATE TABLE "practice_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"mode" "practice_mode" NOT NULL,
	"subject_id" uuid,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"question_count" integer DEFAULT 0 NOT NULL,
	"correct_count" integer DEFAULT 0 NOT NULL,
	"duration_seconds" integer
);
--> statement-breakpoint
CREATE TABLE "question_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"session_id" uuid,
	"question_id" uuid NOT NULL,
	"selected_answer" jsonb NOT NULL,
	"is_correct" boolean NOT NULL,
	"duration_seconds" integer,
	"difficulty_snapshot" "difficulty",
	"answered_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"content_blocks" jsonb NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_skills" (
	"question_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"weight" real DEFAULT 1 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	CONSTRAINT "question_skills_question_id_skill_id_pk" PRIMARY KEY("question_id","skill_id")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"subject_id" uuid,
	"stimulus_id" uuid,
	"question_type" "question_type" NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"content_blocks" jsonb NOT NULL,
	"explanation_blocks" jsonb NOT NULL,
	"common_mistake" jsonb,
	"solving_tip" jsonb,
	"estimated_time_seconds" integer,
	"source_type" "source_type" NOT NULL,
	"source_reference" text,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"created_by" text,
	"reviewed_by" text,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "questions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "skill_mastery" (
	"user_id" text NOT NULL,
	"skill_id" uuid NOT NULL,
	"mastery_score" real DEFAULT 50 NOT NULL,
	"confidence" real DEFAULT 0 NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"correct_count" integer DEFAULT 0 NOT NULL,
	"last_practiced_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skill_mastery_user_id_skill_id_pk" PRIMARY KEY("user_id","skill_id")
);
--> statement-breakpoint
CREATE TABLE "stimuli" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content_blocks" jsonb NOT NULL,
	"source_type" "source_type" NOT NULL,
	"source_reference" text,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"created_by" text,
	"reviewed_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tryout_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"selected_answer" jsonb NOT NULL,
	"is_flagged" boolean DEFAULT false NOT NULL,
	"is_correct" boolean,
	"answered_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tryout_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid,
	"user_id" text NOT NULL,
	"status" "tryout_session_status" DEFAULT 'in_progress' NOT NULL,
	"locked_question_ids" jsonb NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"submitted_at" timestamp with time zone,
	"duration_seconds" integer,
	"score" real,
	"correct_count" integer
);
--> statement-breakpoint
CREATE TABLE "tryout_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"subject_composition" jsonb NOT NULL,
	"duration_seconds" integer NOT NULL,
	"question_count" integer NOT NULL,
	"difficulty_distribution" jsonb NOT NULL,
	"scoring_profile" jsonb NOT NULL,
	"status" "tryout_template_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tryout_templates_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "mistake_queue" ADD CONSTRAINT "mistake_queue_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_attempts" ADD CONSTRAINT "question_attempts_session_id_practice_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."practice_sessions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_attempts" ADD CONSTRAINT "question_attempts_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_skills" ADD CONSTRAINT "question_skills_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_stimulus_id_stimuli_id_fk" FOREIGN KEY ("stimulus_id") REFERENCES "public"."stimuli"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tryout_answers" ADD CONSTRAINT "tryout_answers_session_id_tryout_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."tryout_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tryout_answers" ADD CONSTRAINT "tryout_answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tryout_sessions" ADD CONSTRAINT "tryout_sessions_template_id_tryout_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."tryout_templates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "media_assets_status_idx" ON "media_assets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "mistake_queue_user_status_idx" ON "mistake_queue" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "practice_sessions_user_id_idx" ON "practice_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "question_attempts_user_id_idx" ON "question_attempts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "question_attempts_session_id_idx" ON "question_attempts" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "question_attempts_question_id_idx" ON "question_attempts" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "question_options_question_id_idx" ON "question_options" USING btree ("question_id");--> statement-breakpoint
CREATE UNIQUE INDEX "question_options_question_position_uniq" ON "question_options" USING btree ("question_id","position");--> statement-breakpoint
CREATE INDEX "question_skills_skill_id_idx" ON "question_skills" USING btree ("skill_id");--> statement-breakpoint
CREATE INDEX "questions_stimulus_id_idx" ON "questions" USING btree ("stimulus_id");--> statement-breakpoint
CREATE INDEX "questions_status_idx" ON "questions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "questions_subject_id_idx" ON "questions" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "skill_mastery_skill_id_idx" ON "skill_mastery" USING btree ("skill_id");--> statement-breakpoint
CREATE INDEX "stimuli_status_idx" ON "stimuli" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tryout_answers_session_id_idx" ON "tryout_answers" USING btree ("session_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tryout_answers_session_question_uniq" ON "tryout_answers" USING btree ("session_id","question_id");--> statement-breakpoint
CREATE INDEX "tryout_sessions_user_id_idx" ON "tryout_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tryout_sessions_template_id_idx" ON "tryout_sessions" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "tryout_sessions_status_idx" ON "tryout_sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tryout_templates_status_idx" ON "tryout_templates" USING btree ("status");
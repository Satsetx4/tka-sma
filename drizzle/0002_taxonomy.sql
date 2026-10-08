CREATE TYPE "public"."taxonomy_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subtopic_id" uuid NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"competency" text NOT NULL,
	"sort_order" integer NOT NULL,
	"status" "taxonomy_status" DEFAULT 'draft' NOT NULL,
	CONSTRAINT "skills_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"status" "taxonomy_status" DEFAULT 'draft' NOT NULL,
	"sort_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subjects_code_unique" UNIQUE("code"),
	CONSTRAINT "subjects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "subtopics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic_id" uuid NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"sort_order" integer NOT NULL,
	"status" "taxonomy_status" DEFAULT 'draft' NOT NULL,
	CONSTRAINT "subtopics_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" uuid NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"sort_order" integer NOT NULL,
	"status" "taxonomy_status" DEFAULT 'draft' NOT NULL,
	CONSTRAINT "topics_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_subtopic_id_subtopics_id_fk" FOREIGN KEY ("subtopic_id") REFERENCES "public"."subtopics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subtopics" ADD CONSTRAINT "subtopics_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "skills_subtopic_id_idx" ON "skills" USING btree ("subtopic_id");--> statement-breakpoint
CREATE INDEX "subtopics_topic_id_idx" ON "subtopics" USING btree ("topic_id");--> statement-breakpoint
CREATE INDEX "topics_subject_id_idx" ON "topics" USING btree ("subject_id");
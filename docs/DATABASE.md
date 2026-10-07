# Database Model

Database: Neon PostgreSQL.

ORM target: Drizzle.

## Core hierarchy

```
subjects
  └── topics
       └── subtopics
            └── skills
                 └── question_skills
                      └── questions
```

Mastery is tracked at **skill** level.

## Core tables

### users / user_profiles

Profile and student preferences. Authentication identity integration may vary by selected auth solution.

### subjects

Fields:
- id
- code
- name
- slug
- description
- status
- sort_order
- created_at
- updated_at

Initial status:
- matematika: active
- bahasa-indonesia: planned
- bahasa-inggris: planned

### topics

- id
- subject_id
- code
- name
- description
- sort_order
- status

### subtopics

- id
- topic_id
- code
- name
- description
- sort_order
- status

### skills

- id
- subtopic_id
- code
- name
- description
- competency
- sort_order
- status

Stable skill code example:
`MATH.ALG.FUNC.QUAD.INTERPRET`

### stimuli

- id
- title
- content_blocks JSONB
- source_type
- source_reference
- status
- created_by
- reviewed_by
- created_at
- updated_at

### questions

- id
- code
- subject_id
- stimulus_id nullable
- question_type
- difficulty
- content_blocks JSONB
- explanation_blocks JSONB
- common_mistake JSONB
- solving_tip JSONB
- estimated_time_seconds
- source_type
- source_reference
- status
- created_by
- reviewed_by
- published_at
- created_at
- updated_at

Difficulty V1:
- easy
- medium
- hard

### question_options

- id
- question_id
- position
- content_blocks JSONB
- is_correct

Never expose `is_correct` in active exam payloads.

### question_skills

- question_id
- skill_id
- weight
- is_primary

A question may measure several skills.

### media_assets

- id
- blob_url
- pathname
- mime_type
- size_bytes
- width
- height
- alt_text
- uploaded_by
- status
- created_at

### practice_sessions

- id
- user_id
- mode
- subject_id
- started_at
- finished_at
- question_count
- correct_count
- duration_seconds

Modes:
- quick
- topic
- adaptive
- mistake_review
- diagnostic

### question_attempts

- id
- user_id
- session_id
- question_id
- selected_answer JSONB
- is_correct
- duration_seconds
- difficulty_snapshot
- answered_at

### skill_mastery

- user_id
- skill_id
- mastery_score
- confidence
- attempt_count
- correct_count
- last_practiced_at
- updated_at

### mistake_queue

- user_id
- question_id
- first_wrong_at
- last_wrong_at
- wrong_count
- resolved_at
- status

Statuses:
- open
- improving
- resolved

### tryout_templates

Defines subject composition, duration, question count, difficulty distribution and scoring profile.

### tryout_sessions

Persistent locked question set, timestamps and session status.

### tryout_answers

Per-question submitted answers and flags.

## Migration discipline

- All schema changes use versioned migrations.
- Never edit production schema manually without migration.
- Seed taxonomy separately from sample/demo questions.
- Development seed data must be clearly distinguishable from production content.

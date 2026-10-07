# Autonomous Workflow and Human Gates

This document defines when agents may continue without asking the owner and when work must stop for human approval.

## Operating principle

The default mode is **autonomous execution**.

Agents should not ask for approval after every small task. If a task is in scope, its dependencies are satisfied, tests pass, and no human gate has been reached, the agent should continue to the next eligible task.

Default task metadata unless a task explicitly overrides it:

```
AUTO_CONTINUE = yes
HUMAN_GATE = no
STOP_CONDITION = acceptance criteria fail, blocked dependency, security/content risk, or scope-changing decision
NEXT = first uncompleted dependency-satisfied task in EXECUTION-BACKLOG.md
```

When blocked, agents should make a best-effort diagnosis, document the blocker, and stop only when continuing would require guessing about a product decision, credentials/authorization, academic correctness, legal/licensing status, or a human gate approval.

## Human Gate 1 — Foundation approval

**When:** after Phase 0 is complete.

Review:
- Vite → Next.js migration completed safely,
- prototype reference preserved,
- build/lint/typecheck/tests pass,
- deployment works,
- architecture boundaries are in place,
- no secrets are exposed.

```
AUTO_CONTINUE_BEFORE_GATE = yes
HUMAN_GATE = yes
STOP_CONDITION = Phase 0 exit criteria all pass
NEXT_AFTER_APPROVAL = Phase 1 and eligible Phase 2 foundation work
```

Owner approval means the production foundation is accepted.

## Human Gate 2 — Learning content platform approval

**When:** after Phases 1–4 are complete.

Review:
- official Math taxonomy v1,
- database/content model,
- rich-content question schema,
- shared renderer,
- CMS,
- media workflow,
- draft/review/approve/publish workflow.

```
AUTO_CONTINUE_BEFORE_GATE = yes
HUMAN_GATE = yes
STOP_CONDITION = Phase 1–4 exit criteria all pass
NEXT_AFTER_APPROVAL = Phase 5 content production and Phase 6 onward
```

The owner reviews product structure and question-authoring UX. Academic taxonomy/content should also receive qualified human review before being treated as final.

## Human Gate 3 — Student learning loop approval

**When:** after Phases 5–9 are complete.

Review the complete student journey:

```
onboarding
→ diagnostic
→ mastery profile
→ recommended practice
→ rich question
→ answer
→ explanation
→ mastery update
→ mistake review
→ adaptive practice
→ tryout
→ analysis
→ next recommendation
```

Also review:
- deterministic mastery behavior,
- mistake resolution,
- adaptive selection,
- diagnostic behavior,
- dashboard/progress,
- persistent tryout flow.

```
AUTO_CONTINUE_BEFORE_GATE = yes
HUMAN_GATE = yes
STOP_CONDITION = end-to-end learning loop passes acceptance tests
NEXT_AFTER_APPROVAL = production hardening and Math beta expansion
```

## Human Gate 4 — Public release approval

**When:** after Phases 10–11 are complete and Math Beta is release-ready.

Review:
- 200–300 reviewed Math questions target,
- taxonomy coverage,
- content review status,
- security/authorization checks,
- mobile QA,
- performance,
- accessibility,
- production behavior,
- no critical/high-severity known issue.

```
AUTO_CONTINUE_BEFORE_GATE = yes
HUMAN_GATE = yes
STOP_CONDITION = Math Beta release checklist passes
NEXT_AFTER_APPROVAL = public release and/or Phase 12 subject expansion
```

No agent may declare the product publicly released without this approval.

## Human review that remains mandatory

Human gates are not the only human contribution. Some content actions require human review continuously:

### Academic content

A question intended for production publication must have human review for:
- correctness,
- answer key,
- ambiguity,
- explanation quality,
- taxonomy assignment where material,
- appropriateness for TKA scope.

Automated validation may reject malformed content, but it does not replace academic review.

### Licensing/source provenance

If source rights or reuse terms are uncertain, stop publication of that content until a human resolves the provenance.

### Scope-changing decisions

Stop and request owner decision if work would materially change:
- target user,
- monetization,
- core scoring interpretation,
- subject strategy,
- product positioning,
- locked architecture,
- non-AI policy,
- public-release criteria.

## What does NOT require owner approval

Do not stop merely for:
- ordinary refactors inside documented architecture,
- tests,
- bug fixes,
- accessibility fixes,
- performance improvements,
- small UI polish,
- implementation choices that do not change product behavior,
- adding missing validation,
- documentation synchronization,
- dependency-compatible internal cleanup.

## Reporting at a human gate

Before stopping, the orchestrating agent must provide:

1. completed task IDs,
2. changed architecture/product behavior,
3. tests/build/deploy status,
4. known risks or unresolved items,
5. screenshots/preview links where useful,
6. exact approval requested,
7. recommended next phase.

The agent should not ask the owner to re-investigate information already available in the repository.

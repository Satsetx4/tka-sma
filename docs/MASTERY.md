# Mastery, Mistakes, and Recommendation

All logic is deterministic/rule-based.

## Mastery unit

Mastery is calculated per **skill**, not just per subject/topic.

Use at most the latest 20 relevant attempts per skill for V1.

## Difficulty weights

- easy = 0.8
- medium = 1.0
- hard = 1.2

## Recency weights

- <= 7 days = 1.00
- 8–30 days = 0.85
- > 30 days = 0.70

## Weighted accuracy

```
sum(correct × difficultyWeight × recencyWeight)
------------------------------------------------
sum(difficultyWeight × recencyWeight)
```

## Confidence

```
confidence = min(1, attemptCount / 8)
```

## Mastery score

New/low-evidence skills remain close to neutral 50.

```
mastery =
(
  0.50 × (1 - confidence)
  +
  weightedAccuracy × confidence
)
× 100
```

## Classification

- 0–39: Weak
- 40–59: Learning
- 60–79: Good
- 80–100: Mastered

A skill should not be labeled Mastered solely from a tiny sample.

Minimum V1 rule:
- at least 5 attempts,
- evidence includes medium/hard performance.

## Mistake engine

On incorrect answer:
- upsert question into mistake queue,
- increment wrong count,
- update last_wrong_at.

Statuses:
- open
- improving
- resolved

A single later correct answer does not automatically resolve the mistake.

Initial resolution rule:
- two subsequent correct attempts on the question/closely related skill, or
- sufficient mastery recovery above configured threshold.

Exact behavior must be covered by tests.

## Recommendation priority

Default priority:

1. open mistakes
2. skills mastery < 40
3. skills mastery 40–59
4. stale skills needing review
5. skills mastery 60–79
6. mastered maintenance

## Adaptive practice allocation

Initial target:

- 40% Weak skills
- 30% Learning skills
- 20% stale/review skills
- 10% stronger/challenge skills

Avoid repeating the same question too soon except in explicit mistake review.

## Diagnostic

Diagnostic is not just a score.

Its job is to establish baseline skill evidence, then produce:
- initial mastery profile,
- weakest skills,
- first recommended practice.

## Change policy

Do not alter the mastery/recommendation formula silently. Any material change requires:
- documented rationale,
- updated tests,
- update to this file.

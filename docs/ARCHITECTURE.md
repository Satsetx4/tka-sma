# Architecture

## Migration decision

The current Vite prototype should migrate to **Next.js App Router** during Phase 0.

This migration is required now because upcoming features require secure server-side execution:

- Neon credentials
- Vercel Blob write credentials
- authentication/session enforcement
- admin authorization
- server-side answer validation
- CMS mutations
- durable attempt/mastery updates

The current prototype is still useful as UX reference and is preserved on:

`archive/vite-prototype-2026-10-07`

## Target stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Neon PostgreSQL
- Drizzle ORM
- Zod for runtime validation
- Vercel Blob
- Vercel deployment

Authentication library/provider must be selected in Phase 2 based on minimal complexity and server compatibility. Do not introduce a separate SaaS dependency unless justified.

## High-level architecture

```
                    USERS
                      │
                      ▼
                NEXT.JS / PWA
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
     STUDENT APP               ADMIN CMS
          │                       │
          └───────────┬───────────┘
                      ▼
                 SERVER LAYER
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
    NEON DB      VERCEL BLOB       AUTH
        │
        ▼
  LEARNING SERVICES
        │
 ┌──────┼────────┬─────────┐
 ▼      ▼        ▼         ▼
Practice Mastery Mistake  Tryout
         │
         ▼
 Recommendation
```

## Target repository shape

```
src/
├── app/
├── components/
│   ├── ui/
│   ├── question/
│   ├── charts/
│   └── math/
├── features/
│   ├── auth/
│   ├── practice/
│   ├── mastery/
│   ├── mistakes/
│   ├── tryout/
│   ├── progress/
│   └── cms/
├── server/
│   ├── db/
│   ├── repositories/
│   ├── services/
│   └── storage/
├── domain/
│   ├── question/
│   ├── mastery/
│   └── tryout/
└── lib/

drizzle/
tests/
docs/
```

## Server/client boundary

Secrets are server-only.

Never expose:
- Neon connection strings
- Blob read/write tokens
- session signing secrets

Correct answers must not be included in active-session client payloads when avoidable. Answer validation is performed on the server.

## Storage abstraction

Application code should depend on:

```
StorageService
├── upload()
├── delete()
├── getUrl()
└── validate()
```

V1 implementation:

`VercelBlobStorage`

Do not scatter direct Blob SDK usage throughout CMS components.

## Database access

Use repository/service boundaries such as:

- QuestionRepository
- TaxonomyRepository
- AttemptRepository
- MasteryRepository
- TryoutRepository
- MediaRepository

Avoid random ORM calls inside React UI components.

## Renderer reuse

There must be one shared question/content renderer used by:
- practice
- tryout
- result review
- CMS preview

Do not maintain multiple incompatible renderers.

## Security principles

- Client is untrusted.
- Server validates auth, role, content schema, upload type/size, session ownership, answers, and mutations.
- CMS content must be structured; arbitrary HTML is forbidden.
- Media upload requires authenticated authorized CMS user.

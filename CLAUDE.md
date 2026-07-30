# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This is a Docker Compose monorepo with two apps. Each has its own `CLAUDE.md` with the details — **read the relevant one before any structural change**:

- **[`frontend/CLAUDE.md`](frontend/CLAUDE.md)** — Nuxt layered feature architecture, layer rules, auto-import wiring, API type generation.
- **[`backend/CLAUDE.md`](backend/CLAUDE.md)** — NestJS feature layout, DTO naming convention, commands.

## After every task

Always run `make precommit` from the project root before reporting done.
It runs type-check, format, and lint for both backend and frontend.
Fix all errors before replying.

## Commands (from project root)

| Command | Description |
|---|---|
| `make dev` | Start all services (frontend, backend, db, redis) in dev mode with hot reload |
| `make down` | Stop and remove all containers + volumes |
| `make logs` | Tail logs from all containers |
| `make precommit` | Type-check, format, and lint both backend and frontend |
| `make prod` | Build and deploy production stack |

Per-app commands (tests, dev server, codegen) live in each app's `CLAUDE.md`.

## Stack

- **Backend** (`backend/`): NestJS 11 + TypeORM + PostgreSQL 17. See [`backend/CLAUDE.md`](backend/CLAUDE.md).
- **Frontend** (`frontend/`): Nuxt 4 + Vue 3 + Nuxt UI (Tailwind v4) + Pinia (setup stores) + Zod. See [`frontend/CLAUDE.md`](frontend/CLAUDE.md).

## Type Naming

- Prefix all interfaces with `I`:

```ts
interface IUser {
  id: string
}
```

- Prefix all type aliases with `T`:

```ts
type TUser = {
  id: string
}
```

- Name enums in `UpperCamelCase`; write enum keys in `UPPER_SNAKE_CASE`:

```ts
enum ApprovalStatus {
  PENDING_APPROVAL = 'pendingApproval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
```

## Code comments

- Write code **without explanatory comments** (line, block, or JSDoc prose) across backend and frontend — prefer self-documenting code.
- Keep only **functional directives**: `// @ts-check`, `/** @type {...} */` pragmas, `eslint-disable*`, `@ts-expect-error`.
- Put prose explanations in commit messages or `CLAUDE.md` docs, not inline.
- User-facing and tooling strings (e.g. ESLint rule `messages`) must be in **English**.

## Infrastructure (cross-service)

- **Docker Compose**: dev and prod stacks share `compose.yaml`; `compose.dev.yaml` and `compose.prod.yaml` override it. All services communicate over a Docker bridge named `${PROJECT_PREFIX}-internal_network`. Frontend is also on `shared_network` (external, for reverse proxy).
- **Auth**: Google OAuth 2.0 → issues JWT access + refresh tokens. Frontend auto-refreshes on 401 via the `$fetch` plugin, then retries the original request once.
- **File storage**: Backend mounts a local filesystem path (`STORAGE_PATH`) and serves it as static files under the same path prefix. `StorageCleanService` and `StorageDbBackupsService` run on schedules.
- **Redis**: Present in the compose stack (LRU cache, 100 MB limit) but not yet wired into backend application code.

## Backend ↔ frontend contract

Backend DTO class names become OpenAPI schema names, which the frontend consumes as generated types. After changing any backend DTO or endpoint, run `npm run generate:api-types` from `frontend/`. Details on both sides live in the two app `CLAUDE.md` files above.

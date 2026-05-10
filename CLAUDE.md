# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## After every task

Always run `make precommit` from the project root before reporting done.
It runs type-check, format, and lint for both backend and frontend.
Fix all errors before replying.

## Commands

### Full-stack (from project root)

| Command | Description |
|---|---|
| `make dev` | Start all services (frontend, backend, db, redis) in dev mode with hot reload |
| `make down` | Stop and remove all containers + volumes |
| `make logs` | Tail logs from all containers |
| `make precommit` | Type-check, format, and lint both backend and frontend |
| `make prod` | Build and deploy production stack |

### Backend (`cd backend`)

| Command | Description |
|---|---|
| `npm run start:dev` | Start NestJS in watch mode (standalone, without Docker) |
| `npm run test` | Run Jest unit tests |
| `npm run test:watch` | Jest in watch mode |
| `npm run test:e2e` | End-to-end tests |
| `npm run generate:openapi` | Build and emit `openapi.json` |
| `npm run lint` | ESLint with auto-fix |

Run a single test file: `npx jest path/to/file.spec.ts`

### Frontend (`cd frontend`)

| Command | Description |
|---|---|
| `npm run dev` | Start Nuxt dev server (public mode) |
| `npm run generate:api-types` | Regenerate `app/types/api.generated.ts` from the backend OpenAPI spec |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run format:fix` | Prettier with auto-fix |
| `npm run type-check` | Nuxt/vue-tsc type check |

## Architecture

### Stack

- **Backend**: NestJS 11 + TypeORM + PostgreSQL 17. TypeORM `synchronize: true` — no migration files, schema is driven by entity decorators.
- **Frontend**: Nuxt 4 + Vue 3 + Nuxt UI (Tailwind v4) + Zod.
- **Infrastructure**: Docker Compose. Dev and prod stacks share `compose.yaml`; `compose.dev.yaml` and `compose.prod.yaml` override it. All services communicate over a Docker bridge named `${PROJECT_PREFIX}-internal_network`. Frontend is also on `shared_network` (external, for reverse proxy).
- **Auth**: Google OAuth 2.0 → issues JWT access + refresh tokens. Frontend auto-refreshes on 401 via the `$fetch` plugin, then retries the original request once.
- **File storage**: Backend mounts a local filesystem path (`STORAGE_PATH`) and serves it as static files under the same path prefix. `StorageCleanService` and `StorageDbBackupsService` run on schedules.
- **Redis**: Present in the compose stack (LRU cache, 100 MB limit) but not yet wired into backend application code.

### Backend module layout (`src/modules/`)

Each module follows the standard NestJS pattern: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.entity.ts`, `dto/`.

| Module | Responsibility |
|---|---|
| `auth` | Google OAuth, JWT strategy, token refresh |
| `users` | `UserEntity`, user profile CRUD |
| `sets` | Flashcard sets — owned by a user |
| `cards` | Individual flashcards — belong to a set |
| `storage` | File upload/download, static serving, scheduled cleanup and DB backup |

`src/common/` holds shared DTOs, exception filters, interfaces, and the generic `RequestService` (Axios wrapper via `@nestjs/axios`).

### Frontend feature-module layout (`app/`)

The frontend uses a **feature-module** architecture enforced by an ESLint rule (`local/no-cross-feature-imports`): **features must never import from each other**. Shared code lives at the app root.

| Path | Purpose |
|---|---|
| `features/<name>/store.ts` | Feature-scoped state (`useState`) |
| `features/<name>/composables/` | Feature-scoped composables |
| `features/<name>/components/` | Feature-scoped Vue components (auto-registered, `pathPrefix: false`) |
| `features/<name>/types.ts` | TypeScript types and factory functions |
| `features/<name>/validation.ts` | Zod schemas |
| `components/base/` | Design-system primitives (globally reusable) |
| `composables/` | Cross-feature composables only |
| `store/` | Global UI state (`useUiStore`, `useRequestStore`) |
| `repository/` | API layer — one file per domain; accessed only via the `$api` plugin, not imported directly from features |
| `pages/` | Thin routing shell — `definePageMeta` + `useAsyncData` + orchestration only |

Current features: `auth` (token management, refresh, logout), `profile` (current user), `cards` (sets, cards, CRUD).

### API type generation

`app/types/api.generated.ts` is generated from the backend OpenAPI spec. After changing any backend DTO or endpoint, run `npm run generate:api-types` from `frontend/`. The script calls `generate:openapi` on the backend, then `openapi-typescript`, then appends convenience aliases via `scripts/append-openapi-aliases.mjs`.

### Nuxt auto-import wiring

```ts
// nuxt.config.ts
components: [
  "~/components",
  { path: "~/features", pattern: "*/components/**/*.vue", pathPrefix: false },
],
imports: {
  dirs: ["~/store", "~/features/*/store/**/*", "~/features/*/composables/**/*"],
},
```

Feature stores and composables are globally auto-imported; no explicit `import` needed inside `.vue` files.

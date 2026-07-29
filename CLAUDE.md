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
- **Frontend**: Nuxt 4 + Vue 3 + Nuxt UI (Tailwind v4) + Pinia (setup stores) + Zod.
- **Infrastructure**: Docker Compose. Dev and prod stacks share `compose.yaml`; `compose.dev.yaml` and `compose.prod.yaml` override it. All services communicate over a Docker bridge named `${PROJECT_PREFIX}-internal_network`. Frontend is also on `shared_network` (external, for reverse proxy).
- **Auth**: Google OAuth 2.0 → issues JWT access + refresh tokens. Frontend auto-refreshes on 401 via the `$fetch` plugin, then retries the original request once.
- **File storage**: Backend mounts a local filesystem path (`STORAGE_PATH`) and serves it as static files under the same path prefix. `StorageCleanService` and `StorageDbBackupsService` run on schedules.
- **Redis**: Present in the compose stack (LRU cache, 100 MB limit) but not yet wired into backend application code.

### Backend feature layout (`src/features/`)

Each feature follows the standard NestJS pattern: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.entity.ts`, `dto/`. (The directory is `src/features/`, mirroring the frontend's feature-based layout — it was renamed from `src/modules/`.)

| Feature | Responsibility |
|---|---|
| `auth` | Google OAuth, JWT strategy, token refresh |
| `users` | `UserEntity`, user profile CRUD |
| `sets` | Flashcard sets + their cards (domain root `Set`, child `Card`). `SetEntity`, `CardEntity`, topics; cards are served under the set: `GET /sets/:id/cards` |
| `storage` | File upload/download, static serving, scheduled cleanup and DB backup |

> `cards` is **no longer a separate module** — the `Card` entity, its DTOs, and the cards endpoint were folded into `sets` (a card only exists inside a set). Routes moved from `/cards/:id` to `/sets/:id/cards`.

`src/common/` holds shared DTOs, exception filters, interfaces, and the generic `RequestService` (Axios wrapper via `@nestjs/axios`).

#### DTO naming convention

Files and classes follow one consistent scheme (entity/noun-first — never verb-first):

- **Files**: `kebab-case` + role suffix via dot — `*.dto.ts`, responses `*.response.dto.ts`, query params `*.query.dto.ts`. One class per file.
- **Folders**: when a feature owns several entities, split `dto/` by entity (`dto/set/`, `dto/card/`, `dto/topic/`). Single-entity features keep a flat `dto/`.
- **Class = `<Entity><Qualifier><Role>Dto`**, PascalCase, entity/noun first, role suffix never dropped: `SetCreateDto`, `SetUpdateDto`, `SetDetailsResponseDto`, `SetListQueryDto`, `SetListResponseDto`, `CardCreateDto`, `ProfileUpdateDto`, `UserResponseDto`. **Not** `CreateSetDto` (verb-first is the one thing to avoid — keeps `Set*`/`Card*` grouped and collision-free when imported together).
- **File name = the class in kebab-case, dropping the entity segment only when the folder already names it** (`dto/set/create.dto.ts` ↔ `SetCreateDto`). Flat folders keep the entity in the file name (`user-list.query.dto.ts` ↔ `UserListQueryDto`).
- Other roles mirror this: `XEntity`, `XService`, `XController`, `XModule`, `XGuard`.

Class names become the OpenAPI schema names → the frontend alias `I<Name-without-Dto>` (`SetCreateDto` → `ISetCreate`). Renaming a DTO means re-running `npm run generate:api-types` and updating the frontend alias usages.

### Frontend layered architecture (`app/`)

The frontend uses a **layered feature-based** architecture with a strict dependency direction:

```
pages  →  features  →  core  →  shared
```

A layer may import only from layers to its right, never the reverse. Enforced by ESLint (`local/layer-imports`: dependency direction + feature isolation). **See `frontend/CLAUDE.md` for the full contract — read it before any structural change.**

| Layer | Path | Purpose |
|---|---|---|
| `pages` | `pages/` | Routing only — `definePageMeta` + mount feature `*Widget` component(s). No fetch, no logic, no markup |
| `features` | `features/<name>/` | Self-contained business features (de-facto domain modules). The screen entry point is a `widgets/*Widget.vue` (mounted directly by the page) that calls the feature's **section composable** (`composables/use*.ts`), where fetch/`useAsyncData` lives; `components/` holds the presentational bricks the widget composes. A feature never imports another feature; cross-cutting values (e.g. current user) come from `core` as `Ref` arguments |
| `core` | `core/<name>/` | Cross-cutting infrastructure (session/auth + current user, ui, api, toast, theme, modal). Knows nothing about features |
| `shared` | app-root dirs | `components/base/`, `components/layout/` (app chrome `App*`), `composables/`, `utils/`, `validation.ts`, `store/`, `repository/`, `types/` — domain-agnostic primitives |

**Widgets are not a top-level layer** — they are a per-feature `widgets/` folder next to `components/`. The rule: a component mounted directly by a page ends in `*Widget` and lives in `features/<name>/widgets/`; the presentational bricks it composes live in `features/<name>/components/`. A widget sits inside its feature, so feature isolation applies to it too. There is no root `app/widgets/`. See `frontend/CLAUDE.md`.

Current features: `profile` (profile-edit screen + my stats), `sets` (flashcard sets, cards, learn mode — domain root is `Set`), `people` (platform users list), `auth` (login screen UI).
Current core modules: `session` (token management, refresh, logout — `useAuthStore`; current user — `useCurrentUser`), `ui` (`useUiStore`).

### API type generation

`app/types/api.generated.ts` is generated from the backend OpenAPI spec. After changing any backend DTO or endpoint, run `npm run generate:api-types` from `frontend/`. The script calls `generate:openapi` on the backend, then `openapi-typescript`, then appends convenience aliases via `scripts/append-openapi-aliases.mjs`.

### Nuxt auto-import wiring

```ts
// nuxt.config.ts
components: [
  { path: "~/components", pathPrefix: false },
  // components + widgets in ONE entry — Nuxt dedupes component dirs by `path`,
  // so two entries with the same `~/features` silently drop the second.
  { path: "~/features", pattern: "*/{components,widgets}/**/*.vue", pathPrefix: false },
  { path: "~/core", pattern: "*/components/**/*.vue", pathPrefix: false },
],
imports: {
  dirs: [
    "~/store",
    "~/core/*/store/**/*",
    "~/core/*/composables/**/*",
    "~/features/*/store/**/*",
    "~/features/*/composables/**/*",
  ],
},
```

Feature stores and composables are globally auto-imported; no explicit `import` needed inside `.vue` files.

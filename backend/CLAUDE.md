# Backend (`backend/`)

NestJS 11 + TypeORM + PostgreSQL 17. TypeORM runs with `synchronize: true` — there are **no migration files**; the schema is driven entirely by entity decorators.

## Commands (`cd backend`)

| Command | Description |
|---|---|
| `npm run start:dev` | Start NestJS in watch mode (standalone, without Docker) |
| `npm run test` | Run Jest unit tests |
| `npm run test:watch` | Jest in watch mode |
| `npm run test:e2e` | End-to-end tests |
| `npm run generate:openapi` | Build and emit `openapi.json` (consumed by the frontend's `generate:api-types`) |
| `npm run lint` | ESLint with auto-fix |

Run a single test file: `npx jest path/to/file.spec.ts`

## Feature layout (`src/features/`)

Each feature follows the standard NestJS pattern: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.entity.ts`, `dto/`. (The directory is `src/features/`, mirroring the frontend's feature-based layout — it was renamed from `src/modules/`.)

| Feature | Responsibility |
|---|---|
| `auth` | Google OAuth, JWT strategy, token refresh |
| `users` | `UserEntity`, user profile CRUD |
| `sets` | Flashcard sets + their cards (domain root `Set`, child `Card`). `SetEntity`, `CardEntity`, topics; cards are served under the set: `GET /sets/:id/cards` |
| `storage` | File upload/download, static serving, scheduled cleanup and DB backup |

> `cards` is **no longer a separate module** — the `Card` entity, its DTOs, and the cards endpoint were folded into `sets` (a card only exists inside a set). Routes moved from `/cards/:id` to `/sets/:id/cards`.

`src/common/` holds shared DTOs, exception filters, interfaces, and the generic `RequestService` (Axios wrapper via `@nestjs/axios`). `src/config/` holds configuration.

## DTO naming convention

Files and classes follow one consistent scheme (entity/noun-first — never verb-first):

- **Files**: `kebab-case` + role suffix via dot — `*.dto.ts`, responses `*.response.dto.ts`, query params `*.query.dto.ts`. One class per file.
- **Folders**: when a feature owns several entities, split `dto/` by entity (`dto/set/`, `dto/card/`, `dto/topic/` in `sets`). Single-entity features keep a flat `dto/` (`users`, `auth`, `storage`).
- **Class = `<Entity><Qualifier><Role>Dto`**, PascalCase, entity/noun first, role suffix never dropped: `SetCreateDto`, `SetUpdateDto`, `SetDetailsResponseDto`, `SetListQueryDto`, `SetListResponseDto`, `CardCreateDto`, `ProfileUpdateDto`, `UserResponseDto`. **Not** `CreateSetDto` (verb-first is the one thing to avoid — keeps `Set*`/`Card*` grouped and collision-free when imported together).
- **File name = the class in kebab-case, dropping the entity segment only when the folder already names it** (`dto/set/create.dto.ts` ↔ `SetCreateDto`). Flat folders keep the entity in the file name (`user-list.query.dto.ts` ↔ `UserListQueryDto`).
- Other roles mirror this: `XEntity`, `XService`, `XController`, `XModule`, `XGuard`.

Class names become the OpenAPI schema names → the frontend alias `I<Name-without-Dto>` (`SetCreateDto` → `ISetCreate`). Renaming a DTO means re-running `npm run generate:api-types` from `frontend/` and updating the frontend alias usages.

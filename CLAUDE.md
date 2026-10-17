# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This is a Docker Compose monorepo with three apps. The product apps have their own `CLAUDE.md` with the details — **read the relevant one before any structural change**:

- **[`frontend/CLAUDE.md`](frontend/CLAUDE.md)** — Nuxt layered feature architecture, layer rules, auto-import wiring, API type generation.
- **[`backend/CLAUDE.md`](backend/CLAUDE.md)** — NestJS feature layout, DTO naming convention, commands.
- **`cms/`** — Strapi 5 for editorial content. It uses the `cms` database in the shared PostgreSQL container and must never connect to the NestJS `db` database.

## After every task

Always run `make precommit` from the project root before reporting done.
It runs type-check, format, and lint for backend and frontend, then type-checks the CMS.
Fix all errors before replying.

## Commands (from project root)

| Command | Description |
|---|---|
| `make dev` | Start all services (frontend, backend, db, redis) in dev mode with hot reload |
| `make down` | Stop and remove containers while preserving volumes |
| `make reset` | Stop containers and permanently remove their volumes |
| `make logs` | Tail logs from all containers |
| `make prune` | Remove images not used by any container and trim the build cache to `BUILD_CACHE_KEEP`; runs automatically at the end of `make prod` |
| `make precommit` | Type-check, format, and lint both backend and frontend |
| `make prod` | Build and deploy production stack |

Per-app commands (tests, dev server, codegen) live in each app's `CLAUDE.md`.

## Stack

- **Backend** (`backend/`): NestJS 11 + TypeORM + PostgreSQL 17. See [`backend/CLAUDE.md`](backend/CLAUDE.md).
- **Frontend** (`frontend/`): Nuxt 4 + Vue 3 + Nuxt UI (Tailwind v4) + Pinia (setup stores) + Zod. See [`frontend/CLAUDE.md`](frontend/CLAUDE.md).
- **CMS** (`cms/`): Strapi 5 + PostgreSQL. It owns only the `cms` database; uploaded media is persisted on Google Drive, mounted with rclone at `public/uploads`.
- **Proxy** (`nginx/`): the `nginx` service, entry point of the whole stack on port 4999. It proxies `/` to Nitro, `/backend/` to NestJS and `/cms/` to Strapi. `nginx.conf` is used in prod, `dev.nginx.conf` in dev; each has its own Dockerfile in the same folder.

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

- **Docker Compose**: dev and prod stacks share `compose.yaml`; `compose.dev.yaml` and `compose.prod.yaml` override it. All services communicate over a Docker bridge named `${PROJECT_PREFIX}-internal_network`. Nginx is also on `shared_network` (external, for reverse proxy), so the external proxy must target `${PROJECT_PREFIX}-nginx:4999`.
- **Frontend static assets**: in prod the `frontend` container copies `.output/public` into the shared `frontend-static` volume on start (`frontend/docker-entrypoint.sh`), and `nginx` mounts it read-only at `/app/.output/public` to serve `/_nuxt/` and images directly.
- **Auth**: Google OAuth 2.0 → issues JWT access + refresh tokens. Frontend auto-refreshes on 401 via the `$fetch` plugin, then retries the original request once.
- **File storage**: Google Drive is the storage backend, mounted with rclone (FUSE) inside the containers by `backend/docker-entrypoint.sh` and `cms/docker-entrypoint.sh`. Backend mounts `RCLONE_STORAGE_REMOTE` at `STORAGE_PATH` (`/storage`) and serves it as static files under the same path prefix; Strapi mounts `RCLONE_CMS_REMOTE` at `public/uploads`, so on the remote the media lands in `cms/` next to `db-backups/`. Both entrypoints mount before the app starts, refuse to run unmounted, and stop the container if the mount disappears. `rclone/rclone.conf` is required — `make rclone-auth` creates it, `make check-rclone` guards `make dev` and `make prod`. `StorageCleanService` and `StorageDbBackupsService` run on schedules.
- **Dev tools**: `compose.dev.yaml` swaps the `redis` image for `redis/redis-stack` (RedisInsight on `REDIS_INSIGHT_PORT`, default 8001) and adds a `pgadmin` service (`PGADMIN_PORT`, default 5050). Neither is part of the prod stack.
- **Redis**: Present in the compose stack (LRU cache, 100 MB limit) but not yet wired into backend application code.

## Backend ↔ frontend contract

Backend DTO class names become OpenAPI schema names, which the frontend consumes as generated types. After changing any backend DTO or endpoint, run `npm run generate:api-types` from `frontend/`. Details on both sides live in the two app `CLAUDE.md` files above.

## CMS data: seed vs migrations

- **Schema** (content types, components, enum values) is applied by Strapi itself on boot.
- **Migrations** (`cms/database/migrations/*.js`) change data that already exists. Strapi runs them automatically on boot, before the schema sync, in filename order. They must be `.js` or `.sql` — `.ts` files are not discovered.
- **Seed** (`cms/scripts/seed.ts`) only creates what is missing: a page, a translation key or the global entry that is not in the database yet. It never updates an existing record, so the admin panel stays the source of truth for editorial content (`title`, `path`, `blocks`, `seo`, `priority`, translation values).
- The seed runs from `bootstrap()` in `cms/src/index.ts`, after Strapi has synced the schema, so every environment seeds itself on start and a redeploy changes nothing. `npm run seed` runs the same code as a one-off script.
- Changing a field of a record that already exists in production therefore needs a migration — editing `seed.ts` alone will not apply it.

## CMS-managed pages

A task that changes a CMS-managed page, widget, or text is complete only when the frontend and Strapi contracts are updated together.

- Widget names follow one contract: display name `Home Widget`, API ID `home-widget`, UID `widgets.home-widget`, and Vue component `HomeWidget.vue`.
- Do not prefix CMS widget components with `Cms` or introduce a variation of an existing widget name.
- A published UID is stable. Rename it only through an explicit migration that updates every consumer in the same task.
- A new frontend route must also be added for both `uk` and `en` to the idempotent CMS seed with its `routeName`, localized `path`, `parent`, `access`, `layout`, SEO, and blocks.
- A new or changed widget must update the Strapi component schema, the page Dynamic Zone, the Zod contract, OpenAPI, generated frontend types, the render registry, and both locale variants in the seed.
- A translation key change must update the `translation` entries and seed for both `uk` and `en` with complete text in each language.
- Remove a page or widget only after removing its CMS usage, then remove its schema, registry entry, contract, and unused translations.
- Do not leave CMS synchronization as a manual follow-up or make untracked changes only through the local admin panel.

Before finishing a CMS task, run `make generate-cms-types`, `npm run check:widgets --prefix cms`, verify both locales, and run `make precommit`.

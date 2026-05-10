# Frontend architecture

The frontend (`app/`) follows a **feature-module** architecture.
Feature-specific code lives in `features/<name>/`; everything at the app root is globally shared.

## Directory contract

| Path                            | Purpose                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------- |
| `features/<name>/store.ts`      | Feature-scoped store (composable with `useState`)                               |
| `features/<name>/composables/`  | Feature-scoped composables                                                      |
| `features/<name>/components/`   | Feature-scoped Vue components (auto-registered, `pathPrefix: false`)            |
| `features/<name>/types.ts`      | Feature-scoped TypeScript types and factory functions                           |
| `features/<name>/validation.ts` | Feature-scoped Zod schemas                                                      |
| `features/<name>/utils.ts`      | Feature-scoped pure utilities                                                   |
| `components/`                   | ONLY globally reusable components (`base/` design-system, `app/` layout chrome) |
| `composables/`                  | ONLY cross-feature composables                                                  |
| `store/`                        | ONLY global UI / request state (`useUiStore`, `useRequestStore`)                |
| `utils/`                        | ONLY domain-agnostic pure utilities                                             |
| `validation.ts`                 | ONLY global primitive schemas (e.g. `fileSchema`)                               |
| `pages/`                        | Thin routing shell — `definePageMeta` + `useAsyncData` + orchestration only     |
| `repository/`                   | API layer — one file per domain, never touch from features directly             |

## Current features

- `features/auth/` — token management, refresh, logout (`useAuthStore`)
- `features/profile/` — current user profile (`useProfileStore`)
- `features/cards/` — sets, cards, learn mode; includes `types.ts`, `validation.ts`, `utils.ts`, `composables/useCardSpeech.ts`, `components/SetForm.vue`, `components/CardForm.vue`, `components/SetCsvTransfer.vue`, `components/learn/Learn*.vue`

## Cross-feature import rule

**A feature must never import from another feature.**

Enforced by ESLint rule `local/no-cross-feature-imports` in `eslint.config.mjs`.
If two features need the same code — move it to the app-level `composables/`, `utils/`, or `components/`.

Decision rule:

- "Is this needed only by one feature?" → put it inside that feature
- "Could two or more features need this?" → put it at the app root

## Nuxt auto-import wiring

Configured in `nuxt.config.ts`:

```ts
components: [
  "~/components",
  { path: "~/features", pattern: "*/components/**/*.vue", pathPrefix: false },
],
imports: {
  dirs: ["~/store", "~/features/*/store/**/*", "~/features/*/composables/**/*"],
},
```

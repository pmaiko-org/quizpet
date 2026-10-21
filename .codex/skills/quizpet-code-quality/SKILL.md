---
name: quizpet-code-quality
description: Design, implement, or refactor non-trivial QuizPet code with clear boundaries, Nuxt and existing-library reuse, and evidence-based dependency research. Use for feature work, architectural changes, shared abstractions, integrations, or custom utilities; do not use for review-only requests.
---

# QuizPet Code Quality

Produce the smallest cohesive change that fits QuizPet's existing architecture and avoids duplicated platform or library functionality.

## Establish the local contract

1. Read the root `CLAUDE.md`, then the `frontend/CLAUDE.md` or `backend/CLAUDE.md` relevant to the change. For CMS work, inspect the current schemas, contracts, registry, seeds, and validation scripts.
2. Inspect neighboring implementations, shared helpers, repositories, composables, services, package manifests, and generated types before designing anything new.
3. Preserve repository naming and dependency-direction rules. Do not create a parallel abstraction when an established one can be extended cleanly.

## Research before inventing

For any non-trivial utility, infrastructure primitive, integration, or proposed dependency, evaluate solutions in this order:

1. A Nuxt, Vue, NestJS, Strapi, Web Platform, or Node built-in capability.
2. A capability already provided by an installed dependency such as VueUse, Nuxt UI, Pinia, Zod, TypeORM, or RxJS.
3. A focused, maintained external library.
4. Custom code only when the preceding options do not fit the requirements.

When the choice is not established by the repository, search current official documentation and primary package sources. Compare realistic candidates by maintenance, TypeScript support, SSR/client boundaries, bundle and runtime cost, security, license, API fit, and the amount of adapter code required. Do not add a dependency merely to replace a small, obvious function. In the final response, briefly state what was reused or why custom code was justified.

## Design before editing

- Give each component, composable, service, and module one coherent responsibility.
- Keep Vue components focused on rendering and interaction. Move reusable state, async orchestration, and business rules to the appropriate feature composable, store, repository, or utility.
- Prefer Nuxt lifecycle and data primitives when they match the problem. Respect SSR and client-only boundaries; do not reproduce routing, data fetching, middleware, runtime configuration, plugin, SEO, or error-handling facilities by hand.
- Keep domain code in its feature. Move code to `core` only when it is cross-cutting infrastructure and to `shared` only when it is domain-independent.
- On the backend, keep transport concerns in controllers and DTOs, domain orchestration in services, and persistence rules in entities/repositories. Reuse validation and shared infrastructure.
- Introduce a pattern only when it removes a concrete source of coupling, duplication, invalid state, or testing difficulty. Avoid pattern-shaped indirection with no measurable benefit.
- Split large units by responsibility and data ownership, not by arbitrary line-count limits. Avoid pass-through wrappers, boolean-mode functions, hidden global state, and long chains of mutation.

Before a broad refactor, summarize the intended boundaries and reuse choices. Keep the change scoped to the requested behavior and preserve unrelated dirty worktree changes.

## Implement and prove

- Reuse existing contracts rather than duplicating types or constants. Regenerate frontend API types after backend contract changes.
- A CMS-managed page or widget change must update every required Strapi and frontend contract, both locales, and the seed or migration path described by the repository.
- Add focused tests for extracted business logic and regressions. Do not claim runtime success from type-checks alone.
- Run the repository-mandated checks from `CLAUDE.md`. Browser-test the affected flow when UI, routing, auth, hydration, responsive behavior, or CMS rendering changes.
- Report any validation that could not be run and the precise reason.

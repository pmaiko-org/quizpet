---
name: quizpet-code-review
description: Review QuizPet changes for concrete correctness, spaghetti code, misplaced responsibilities, architectural violations, missed Nuxt or installed-library capabilities, and unjustified custom implementations. Use for review, audit, or refactoring assessment; do not silently implement fixes.
---

# QuizPet Code Review

Perform an evidence-based review of the requested diff or scope. Diagnose first; do not edit code unless the user separately asks for fixes.

## Build the review context

1. Read the root `CLAUDE.md` and the relevant app-level guidance.
2. Inspect the complete diff, callers, data flow, lifecycle boundaries, tests, generated contracts, and nearby established implementations. For CMS work, inspect actual locale content and every synchronized contract before reporting a regression.
3. Distinguish problems introduced by the reviewed change from pre-existing code and unrelated dirty hunks.

## Review for behavior and structure

Prioritize user-visible bugs, data loss, security issues, contract drift, SSR/hydration failures, stale reactive state, concurrency problems, and missing cleanup. Then assess maintainability:

- mixed rendering, fetching, mutation, navigation, and business logic in one Vue component;
- composables or services with unrelated responsibilities or hidden shared state;
- feature-to-feature imports, upward layer dependencies, or domain code misplaced in `shared`;
- duplicated contracts, constants, validation, mapping, pagination, auth, or CMS routing logic;
- boolean flags and condition chains that encode implicit states;
- mutation spread across multiple owners, unclear source of truth, or temporal coupling;
- wrappers and abstractions that add indirection without reducing duplication or coupling;
- custom debounce, cache, retry, parsing, validation, state, routing, or UI infrastructure that duplicates the platform or installed dependencies;
- manual implementations of behavior already supported cleanly by Nuxt, Vue, VueUse, Nuxt UI, Pinia, Zod, NestJS, TypeORM, RxJS, or Strapi.

Do not demand a design pattern by name. Identify the concrete responsibility or dependency problem, show its consequence, and recommend the simplest boundary that fixes it.

## Verify reuse opportunities

When alleging that code should use a framework feature or library, verify the relevant current official documentation and the project's installed version when practical. If recommending a new package, compare maintenance, TypeScript and SSR compatibility, runtime or bundle cost, security, license, and integration complexity. Do not recommend a dependency for a trivial helper or on reputation alone.

## Report findings

- Report only actionable findings backed by a specific code location and a realistic failure or maintenance cost.
- Order findings by severity. Keep summaries secondary to findings.
- For each finding, state the observed code, why it fails or creates concrete risk, and the smallest credible correction.
- Separate confirmed defects from optional improvements. Do not inflate style preferences into blockers.
- Re-check each claim against the full auth, navigation, remount, async, and CMS-content lifecycle before keeping it.
- If there are no findings, say so and note material coverage gaps or tests that were not run.

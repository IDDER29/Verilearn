# VeriLearn

**Learn things that are actually true.** VeriLearn is a learning platform built around a single hard rule: nothing is presented to a learner as fact until it has survived verification. Every claim carries a trust state derived only from evidence — never asserted by a human — and that trust propagates through everything downstream: what you review, what a test can ask, and what a certificate can attest.

> **Status:** the R1 MVP spine is real and end-to-end on live data —
> _create → verify → learn → produce → conflicts/sources → retain → prove → reflect_ —
> auth-gated, tenant-scoped, with the epistemic firewall enforced in code and tests.

---

## The core idea

Most learning tools happily teach you whatever text they were given. VeriLearn refuses to. Three invariants hold the whole system together:

1. **Epistemic firewall** — no user, admin, or platform-root role can *set* a trust state. Trust states are only ever produced by verification events. Enforced by the type system, RBAC, and tests.
2. **Fail-closed rendering** — a claim whose evidence fails to load never renders as `Verified`. Absence of a positive signal is always a negative result.
3. **Single canonical object** per claim / conflict / source; trust changes propagate by events, so every surface agrees.

From those, everything else falls out: tests draw questions **only** from verified/sourced claims, a disputed claim is held out until resolved, a certificate is revoked the moment a claim it depended on is downgraded, and a public verify code keeps resolving even after the account that earned it is deleted.

## Repository layout

```
.
├── web/         → the application (Next.js 16, App Router) — this is the product
│   ├── app/         server components, server actions, routes
│   ├── lib/
│   │   ├── domain/    pure, unit-tested engines (trust ledger, FSRS,
│   │   │               calibration, rubric grading, gap lifecycle,
│   │   │               tests engine, certificates, RBAC)
│   │   ├── services/   application layer over the domain + in-memory store
│   │   └── store/      entities, seed data, repository
│   └── components/  UI
├── docs/        → PRD, per-story disposition sweep, and the implementation tracker
│   ├── PRD.md                    the full product requirements
│   ├── PRD-DISPOSITIONS.md       every user story: Done / Partial / Deferred + why
│   └── IMPLEMENTATION.md         roadmap, screens-wired table, momentum log
└── design/      → historical design artifacts (original HTML prototypes + the
                   design-tool chat transcripts the app was built from)
```

## Architecture

- **Next.js 16** (App Router, Server Components, server actions) + **React 19**, TypeScript throughout.
- **Ports-and-adapters.** Capabilities that need external infrastructure (real LLM verifier, execution sandbox, Postgres, Stripe, SSO/LTI, KMS, email) sit behind clean interfaces with a **working deterministic adapter**, so the architecture is real and testable locally while the production adapter is documented as deferred. See `docs/IMPLEMENTATION.md` for the full capability/deferral table.
- **Pure domain core.** The thesis-critical engines in `web/lib/domain/` are pure and deterministic (no `Date.now`/`Math.random` inside them — timestamps and ids are passed in), which is what makes them exhaustively unit-testable.

## Getting started

Requires **Node 22+**.

```bash
cd web
npm install        # restores dependencies (node_modules is not committed — this is expected)
npm run dev        # http://localhost:3000
```

Sign in with a seeded account (in-memory demo data, reset on restart):

| Account | Password | Role |
|---|---|---|
| `adeline@example.com` | `verilearn` | Learner (Free plan) |
| `reviewer1@example.com` | `verilearn` | Trust & Safety reviewer |

## Development

```bash
npm run build      # production build (from web/)
npm test           # run the full vitest suite
npm run test:watch # watch mode
npm run lint       # eslint
```

The domain and service layers are covered by **~500 tests across 40 files** (`web/lib/**/*.test.ts`, `web/proxy.test.ts`). The build is green.

## Documentation

- **`docs/architecture/OVERVIEW.md`** — how the pieces fit together and why: the three invariants, the ports-and-adapters layering, the learner data-flow, and the cross-cutting patterns. Start here to understand the codebase. Backed by short decision records in `docs/architecture/decisions/` (ADRs).
- **`docs/PRD.md`** — the full product spec (462 user stories across a B2C + B2B platform).
- **`docs/PRD-DISPOSITIONS.md`** — an honest, per-story accounting: every enumerated story is marked **Done**, **Partial** (what's missing spelled out), or **Deferred** (needs vendor/infra/business decision, behind a clean seam). Nothing is silently dropped.
- **`docs/IMPLEMENTATION.md`** — build order, the "screens wired to real data" table, and a running log of fixes.
- **`docs/scripts/`** — tooling that assembles the split `prd/` and `dispositions/` sources into the `PRD.md` / `PRD-DISPOSITIONS.md` roll-ups.

## A note on the design intent

The app in `web/` was implemented from HTML/CSS/JS prototypes and a design-tool conversation, both preserved under `design/` for reference. The prototypes were the *visual* target; the production code does not copy their internal structure.

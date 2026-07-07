# Architecture Overview

This document explains **how VeriLearn is put together and why** — the shape of the code, the invariants it enforces, and the deliberate seams where production infrastructure is deferred. For *what* the product does, see [`../PRD.md`](../PRD.md); for *status* per user story, see [`../PRD-DISPOSITIONS.md`](../PRD-DISPOSITIONS.md).

## The thesis

Most learning tools present whatever text they're given as fact. VeriLearn refuses to: **a claim is never shown to a learner as true until it has survived verification**, and the trust that verification confers propagates through everything downstream — what you review, what a test may ask, what a certificate may attest, and when that certificate must be revoked.

Everything in the architecture exists to make that guarantee *structural* rather than aspirational.

## The three invariants

These are enforced in code and tests, not just documented.

### 1. Epistemic firewall

No user, admin, or platform-root role can **set** a claim's trust state. Trust states are produced **only** by verification events. A human can *dispute* a claim (raising a conflict) or *resolve* one (supplying a rationale), but the state transition itself is emitted by the system verifier — never written directly by the actor. Enforced by the type system + RBAC (`web/lib/domain/rbac.ts`, `trust.ts`) and covered by tests.

> If a change appears to require a human to set a trust state, it is the wrong shape.

### 2. Fail closed

The absence of a positive signal is always a negative result. A claim whose evidence fails to load never renders as `Verified`. Public certificate verification resolves an unknown or revoked code to an unambiguous *invalid* — never a default "valid." A test with nothing eligible to ask does not offer a "Start" button.

### 3. Single canonical object

Each claim / conflict / source has one canonical representation; trust changes propagate by events, so every surface reads the same source of truth. Two surfaces that display "the same" number (due cards, excluded claims, open conflicts) must compute it from the same helper — a recurring bug class here is two surfaces re-deriving the same concept differently and disagreeing.

## Layered structure (ports & adapters)

```
web/
├── app/            ← delivery: routes, server actions, server components
├── components/     ← delivery: UI
└── lib/
    ├── domain/     ← PURE engines: trust ledger, FSRS, calibration, rubric
    │                 grading, gap lifecycle, tests engine, certificates, RBAC.
    │                 No I/O, no Date.now/Math.random — everything passed in.
    ├── services/   ← application layer: orchestrates domain over the store,
    │                 enforces ownership/RBAC/archived guards, records audit.
    └── store/      ← entities, seed data, in-memory repository (a port).
```

The dependency rule points inward: `app` → `services` → `domain`. The domain knows nothing about Next.js, the store, or HTTP.

**Adapters behind ports.** Capabilities that need external infrastructure sit behind an interface with a *working deterministic adapter*, so the architecture is real and testable locally while the production adapter is deferred:

| Port | Adapter here | Production (deferred) |
|---|---|---|
| Claim verification | rule-based `DeterministicVerifier` | real LLM verifier |
| Execution sandbox | deterministic assertion runner | sandboxed VM/container |
| Persistence | in-memory + seed | Postgres/managed DB |
| Billing | deterministic entitlement engine | Stripe |

See the decision records in [`decisions/`](./decisions/) for the reasoning.

## The learner loop (data flow)

The R1 spine runs end-to-end on real data, auth-gated and tenant-scoped:

```
create → verify → learn → produce → conflicts/sources → retain → prove → reflect
  │         │        │        │            │               │        │        │
 topic   pipeline  lecture  tasks/      dispute &        FSRS    tests +   gap map +
 +cap    +ledger   +trust   rubric      resolve, add     review  fail-      progress
                            grading     sources          cards   closed     signals
                                                                 certs
```

A downgrade anywhere ripples correctly: disputing a claim excludes it from tests and revokes any certificate that depended on it; removing a claim's only source fail-closes it to `unsupported`; a T&S quarantine holds a claim out of *every* eligibility surface without touching its ledger state.

## Cross-cutting patterns worth knowing

- **Snapshot, don't live-resolve, on durable records.** A record that outlives its referent (a certificate after its topic/account is deleted, an audit entry after its actor is erased, an appeal kept as moderation history) snapshots its display values at *write* time. Resolving them live at read time is a bug class this codebase has hit repeatedly — see [ADR-0003](./decisions/0003-snapshot-display-values-on-durable-records.md).
- **Eligibility is a shared union.** "Can this claim be tested/reviewed/graded?" is one union — test-eligible ledger state **and not** quarantined **and not** on an archived topic — read through shared helpers (`getDueCards`, `isQuarantined`, the `eligibleClaims` filter). Reimplementing it inline is how two surfaces drift apart.
- **The store resets every boot.** It's in-memory and seeded, so there are no migrations and every restart is a clean, deterministic slate — ideal for tests and demos, explicitly deferred for production ([ADR-0001](./decisions/0001-ports-and-adapters-with-deterministic-adapters.md)).

## Where to look next

- Pure engines and their tests: `web/lib/domain/*.ts` + `*.test.ts`
- How a screen gets real data: pick a route in `web/app/`, follow it into `web/lib/services/`
- Why a story is Done/Partial/Deferred: `docs/dispositions/<DOMAIN>.md`

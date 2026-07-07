# `web/lib` — the brain of the application

Everything that isn't a route or a React component lives here, organized in three concentric layers plus a few small utilities. The dependency rule points **inward**: `app/` and `components/` depend on `services/`, `services/` depends on `domain/`, and `domain/` depends on nothing outside itself.

```
lib/
├── domain/     PURE engines — the thesis. No I/O, no Date.now/Math.random.
├── services/   application layer — orchestrates domain over the store,
│               enforces ownership/RBAC/archived guards, records audit.
├── store/      entities, seed data, in-memory repository (a port).
├── auth/       authentication: passwords, sessions, the age gate.
├── demo/       guest-mode (unauthenticated) demo data.
├── content/    static curated content (example topics).
├── format.ts   small display formatters.
└── ids.ts      id + timestamp generation (the impurity domain code avoids).
```

## Why the layers

- **`domain/` is pure and deterministic** so it can be exhaustively unit-tested — feed inputs, assert outputs, force any edge case. It never reads the clock, generates randomness, or touches the store. See [ADR-0002](../../docs/architecture/decisions/0002-pure-deterministic-domain-core.md).
- **`services/` is where impurity lives**: it supplies `now` and generated ids, reads/writes the store, checks RBAC and ownership, then calls the pure domain to compute results. This is the layer routes and server actions call.
- **`store/` is a port**: an in-memory, seeded repository today; a managed database later, behind the same interface. See [ADR-0001](../../docs/architecture/decisions/0001-ports-and-adapters-with-deterministic-adapters.md).

## Conventions

- Every `X.ts` has an adjacent `X.test.ts` (Vitest). The domain and service layers carry ~500 tests between them.
- Domain functions take `now: number` and id-generators as arguments — never call `Date.now()` / `Math.random()` inside `domain/`.
- Eligibility ("can this claim be tested/reviewed/graded?") is a **shared union** read through helpers (`getDueCards`, `isQuarantined`, `eligibleClaims`) — never reimplemented inline, or two surfaces drift apart.

See [`../../docs/architecture/OVERVIEW.md`](../../docs/architecture/OVERVIEW.md) for how it all fits together.

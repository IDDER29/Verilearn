# `docs/architecture` — how & why the system is built

The design record — read this before changing anything structural.

| Path | What it is |
|---|---|
| [`OVERVIEW.md`](./OVERVIEW.md) | **Start here.** The thesis, the three enforced invariants (epistemic firewall, fail-closed, single canonical object), the ports-and-adapters layering, the learner data-flow, and the cross-cutting patterns. |
| [`decisions/`](./decisions) | **Architecture Decision Records (ADRs)** — one short, immutable file per load-bearing decision (Context → Decision → Consequences). See `decisions/README.md` for the index. |

## When to add here

- A new **cross-cutting pattern** or invariant → fold it into `OVERVIEW.md`.
- A new **significant, debatable decision** (a technology choice, a boundary, a trade-off someone will later ask "why?" about) → add a new numbered ADR in `decisions/`. Don't edit an accepted ADR; supersede it with a new one.

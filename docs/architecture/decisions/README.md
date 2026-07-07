# Architecture Decision Records

Short records of the load-bearing architectural decisions — the ones that shaped the codebase and that a newcomer would otherwise have to reverse-engineer from code comments.

Each ADR follows the same shape: **Context** (the forces at play) → **Decision** (what we chose) → **Consequences** (what it buys and what it costs). ADRs are immutable once accepted; if a decision is reversed, add a new ADR that supersedes the old one rather than editing it.

| # | Decision | Status |
|---|---|---|
| [0001](./0001-ports-and-adapters-with-deterministic-adapters.md) | Ports & adapters with deterministic stand-in adapters | Accepted |
| [0002](./0002-pure-deterministic-domain-core.md) | A pure, deterministic domain core | Accepted |
| [0003](./0003-snapshot-display-values-on-durable-records.md) | Snapshot display values on durable records | Accepted |

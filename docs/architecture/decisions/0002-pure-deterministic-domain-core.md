# ADR-0002 — A pure, deterministic domain core

**Status:** Accepted

## Context

The thesis-critical logic lives in `web/lib/domain/`: the trust ledger and epistemic firewall, FSRS scheduling, calibration, rubric grading, the gap lifecycle, the tests engine, certificates, and RBAC. This is exactly the code that must be *provably* correct — a subtle bug here silently corrupts trust, and trust is the whole product.

Impure code (reads the clock, generates random ids, touches the store or network) is hard to test exhaustively: outputs depend on hidden state, edge cases are awkward to force, and tests become flaky or timing-dependent.

## Decision

The domain layer is **pure and deterministic**. Functions take everything they need as arguments and return new values:

- **No `Date.now()`** — timestamps are passed in (`now: number`).
- **No `Math.random()` / `randomUUID()`** — ids and codes are supplied by the caller.
- **No I/O** — no store access, no `fetch`, no filesystem.

Impurity lives at the edges: the `services/` layer supplies the clock and ids and performs I/O, then calls the pure domain to compute the result.

## Consequences

**Buys us:**
- The domain is exhaustively unit-testable: feed inputs, assert outputs, force any edge case directly. ~200 domain tests exist because they're cheap to write.
- No flakiness — the same inputs always produce the same outputs.
- Reasoning is local: a domain function's behavior is fully determined by its arguments.

**Costs us:**
- Callers must thread `now` and id-generators through, which is slightly more verbose at the service boundary.
- A discipline to maintain: it's tempting to reach for `Date.now()` inside a domain function. Code review and the "no Date.now/Math.random in domain" convention guard against it.

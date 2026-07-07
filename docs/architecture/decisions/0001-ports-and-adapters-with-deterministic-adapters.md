# ADR-0001 — Ports & adapters with deterministic stand-in adapters

**Status:** Accepted

## Context

VeriLearn models a full B2C + B2B platform (462 user stories). Several core capabilities genuinely require external infrastructure or a paid vendor that can't be provisioned in this build environment:

- claim verification wants a real LLM;
- computational-task grading wants a sandboxed execution environment;
- persistence wants a managed database;
- billing wants a payment processor.

We needed a way to build the *real* architecture — with the real boundaries, data shapes, and control flow — without those dependencies, while staying honest that the production pieces aren't wired.

## Decision

Every externally-dependent capability sits behind a **port** (an interface) with a **working deterministic adapter** as its default implementation. The domain and services depend on the port, never on a concrete vendor.

- Verification → `DeterministicVerifier` (rule-based, seeded) behind the Verifier port.
- Execution grading → a deterministic assertion runner behind the same port seam.
- Persistence → an in-memory, seeded repository behind the store port; **it resets on every boot**, so there are no migrations and every run is a deterministic clean slate.
- Billing → a deterministic entitlement engine + mock checkout.

The production adapter for each is marked **Deferred (infra/vendor)** with justification in [`../../PRD-DISPOSITIONS.md`](../../PRD-DISPOSITIONS.md) and [`../../IMPLEMENTATION.md`](../../IMPLEMENTATION.md).

## Consequences

**Buys us:**
- The architecture is real and end-to-end testable today; swapping in a production adapter is a localized change at one seam, not a rewrite.
- Tests and demos are fully deterministic (no network, no clock, no external state).
- The deferral is honest and visible rather than hidden behind a `TODO`.

**Costs us:**
- The in-memory store means no durability — data is lost on restart. Acceptable for R1/demo; a real DB is the first production task.
- The deterministic verifier is not a real skeptic; it validates the *pipeline and trust propagation*, not genuine semantic correctness.
- A reader must understand that "Deferred" here means "seam exists, adapter doesn't," not "unbuilt."

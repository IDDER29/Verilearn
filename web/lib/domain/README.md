# `web/lib/domain` — pure engines (the thesis)

This is the heart of VeriLearn. Every file here is **pure and deterministic**: no I/O, no `Date.now()`, no `Math.random()` — timestamps, ids, and verify codes are all passed in by the caller. That's what makes this layer exhaustively unit-testable (~200 tests live here), and it's why the trust guarantees are provable rather than aspirational. See [ADR-0002](../../../docs/architecture/decisions/0002-pure-deterministic-domain-core.md).

Each `X.ts` has an adjacent `X.test.ts`.

## The files

| File | What it is |
|---|---|
| **`trust.ts`** | The **trust ledger** and the **epistemic firewall** — the single source of truth for a claim's trust state. States are produced only by verification events; `stateOf` is fail-closed (unresolved/unbacked → `unsupported`, never a verified default). No human can set a state directly. |
| **`types.ts`** | Core domain types: `TrustState`, `isTestEligible`, the trust-label glyphs. The vocabulary the rest of the domain speaks. |
| **`pipeline.ts`** | The **verification pipeline** (create → verify): runs a topic's claims through a `Verifier` port, emitting trust events into the ledger. The `DeterministicVerifier` adapter stands in for a real LLM ([ADR-0001](../../../docs/architecture/decisions/0001-ports-and-adapters-with-deterministic-adapters.md)). |
| **`tests-engine.ts`** | Builds a test from eligible claims only, scores it against the pass bar, and predicts readiness (`predictReadiness`: retention + calibration + coverage). Never pads with ineligible claims; discloses reduced coverage honestly. |
| **`certificates.ts`** | Certificate issuance (only on a pass), **fail-closed** public verification (unknown/revoked → invalid, never a default valid), revocation + reinstatement, and the downgrade-propagation trigger. |
| **`fsrs.ts`** | The FSRS spaced-repetition scheduler — card state, review grading, next-due computation. |
| **`calibration.ts`** | Confidence calibration — how well a learner's stated confidence matches their actual recall. |
| **`rubric.ts`** | Rubric grading for write-in tasks: per-criterion hit/miss, weighted score, the ≥75% pass bar, and `assertRubricGradeable` (a task is ungradeable if a criterion anchors to a non-eligible claim). |
| **`gap.ts`** | The gap / misconception lifecycle: open → watching → closed, with auto-reopen on a lapse, and cross-origin merge rules. |
| **`signals.ts`** | The honest progress signals (retention, calibration, coverage, transfer) computed from real review history — with honest empty states, never fabricated. |
| **`rbac.ts`** | The role-based access-control matrix for the 24 personas: which role holds which permission. Notably, **no** human role holds `trust:write`. |
| **`moderation.ts`** | Account ban / unban, with the reviewer-other-than-whoever-banned rule. |
| **`appeal.ts`** | The ban-appeal lifecycle (submit → decide), reviewer-accountable, history kept not erased. |
| **`audit.ts`** | The append-only central audit-log entry type + query/validation. Fail-closed on a malformed entry. |
| **`entitlements.ts`** | The versioned plan-entitlement catalog (Free/Pro/Team caps, e.g. `maxActiveTopics`). |

## Reading order for a newcomer

Start with `trust.ts` and `types.ts` (the firewall and vocabulary), then `pipeline.ts` (how claims get verified), then `tests-engine.ts` + `certificates.ts` (how trust becomes a test and a credential).

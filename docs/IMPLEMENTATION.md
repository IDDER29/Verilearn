# VeriLearn — Implementation Roadmap & Progress Tracker

This tracks execution of the PRD (`docs/PRD.md`) against the actual codebase (`web/`, a Next.js 16 app).
It is the source of truth for **what is Done, Deferred, or Out-of-scope**, and why.

## Scope model (honest constraints of this environment)

The PRD defines 462 stories across a full B2C+B2B platform. Some require external infrastructure or
business decisions that cannot be provisioned here. We handle that with a **ports-and-adapters** approach:
every such capability is implemented behind a clean interface with a **working deterministic adapter**, and
the production adapter is marked **Deferred (infra)** with justification. This keeps the architecture real,
testable, and complete in intent while being honest about what runs locally.

| Capability | Approach here | Production (Deferred) |
|---|---|---|
| Claim verification (Skeptic/pipeline) | Deterministic `Verifier` adapter (rule-based, seeded) | Real LLM adapter — needs API keys + cost governor (business decision) |
| Execution sandbox | Deterministic assertion runner | Sandboxed VM/container — needs infra |
| Persistence | In-memory + JSON-file repository | Postgres/managed DB — needs infra |
| Auth sessions | Signed cookie + hashed passwords (scrypt) | Add managed IdP/MFA vendor — R2/R3 |
| Encryption at rest / KMS | App-layer field tagging + redaction hooks | Managed KMS + disk encryption — infra |
| Billing | Deterministic entitlement engine + mock checkout | Stripe adapter — needs account |
| SSO / SCIM / LTI | Interfaces defined | Vendor integration — R3 |

**Disposition legend:** ✅ Done · 🟡 Partial · ⏭️ Deferred (infra/vendor/business) · 🚫 Out-of-scope · ⬜ Planned

## Architectural principles (enforced in code)

1. **Epistemic firewall (I1):** no user, admin, or platform-root role can set a trust state. Trust states are
   only produced by verification events. Enforced by the type system + RBAC + tested.
2. **Fail-closed rendering:** a claim whose evidence fails to load never renders as `Verified`.
3. **Single canonical object** per claim/conflict/source; trust changes propagate by events.
4. **Every implementation traces to ≥1 user story** (IDs referenced in code/tests and this tracker).
5. **RBAC** derived from the 24 personas; least privilege; audited break-glass.

## Build order (forced by the PRD critical-path chain)

- **P0 — Domain core & invariants** (thesis engine): trust ledger + firewall, FSRS, calibration, rubric
  grading, gap lifecycle (auto-reopen), test eligibility/scoring/readiness, certificates, honest signals.
  *Pure, fully unit-tested.* → traces to VERIFY, TRUST, REVIEW, TASK, GAP, TEST, ANALYTICS stories.
- **P1 — Identity & RBAC substrate**: users, roles, permissions, sessions, tenant isolation, age-gate.
- **P2 — Persistence & repositories**: repository interfaces + JSON/in-memory adapters + seed data.
- **P3 — Application/API layer**: server actions / route handlers over the domain, entitlement checks.
- **P4 — UI wiring**: replace mock data in screens with the engine (core loop first).
- **P5 — Compliance & ops hooks**: PII redaction, audit log, data export/delete, breach-flag, degradation.
- **P6 — Story disposition sweep**: every one of the 462 stories marked Done/Partial/Deferred/Out-of-scope.

## Progress

| Phase | Status | Notes |
|---|---|---|
| P0 Domain core & invariants | ⬜ In progress | starting: types + trust ledger + firewall |
| P1 Identity & RBAC | ⬜ Planned | |
| P2 Persistence | ⬜ Planned | |
| P3 API layer | ⬜ Planned | |
| P4 UI wiring | ⬜ Planned | core loop already interactive with mock data |
| P5 Compliance & ops | ⬜ Planned | |
| P6 Disposition sweep | ⬜ Planned | full 462-story table generated at the end |

_Last updated: start of autonomous execution._

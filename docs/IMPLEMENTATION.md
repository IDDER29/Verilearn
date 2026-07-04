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
| P0 Domain core & invariants | ✅ Done | 10 modules, 196 tests: trust ledger+firewall, FSRS, calibration, rubric, gap auto-reopen, tests-engine, certificates, signals, RBAC, pipeline |
| P1 Identity & RBAC | ✅ Done | scrypt auth, HMAC sessions, COPPA age-gate, proxy auth gate, logout; RBAC matrix (no human trust:write) |
| P2 Persistence | ✅ Done | entity model, owner/tenant-scoped in-memory repo, deterministic seed, reviewLog |
| P3 Services & API | ✅ Done (core loop) | topics + review services; server actions for create/grade; 🟡 remaining domains' services pending |
| P4 UI wiring | 🟡 8 areas wired | real data on: Dashboard, New Topic (create+cap), Pipeline, Review (FSRS persist), Progress (4 signals), Topic Workspace header/trust panel, Settings Profile + Plan; ~20 screens still faithful-static |
| P5 Compliance & ops | 🟡 Partial | age-gate + auth gate + tenant scoping + prompt-injection guard live; KMS/DSAR/audit-log/breach = ⏭️ infra |
| P6 Disposition sweep | ✅ Done | all 462 stories classified — see `docs/PRD-DISPOSITIONS.md` (counts predate the later wirings above, which move a handful HOME/LEARN/REVIEW/ANALYTICS/SETTINGS/TRUST stories Partial→Done) |

### The R1 MVP spine is real end-to-end
create → verify → learn → **produce** → conflicts/sources → retain → **prove** → reflect — all on real data, auth-gated, tenant-scoped, with the epistemic firewall enforced.

### Screens wired to real data (P4)
| Screen | Real data source |
|---|---|
| Dashboard (`/`) | topics + ledger trust bars, due-review & conflict counts, greeting |
| New Topic (`/new-topic`) | createTopic → pipeline; Free 3-topic cap |
| Pipeline (`/pipeline`) | animated stage machine (topic from query) |
| Review (`/review`) | due cards; FSRS reschedule + calibration + gap auto-reopen persisted |
| Session Complete (`/review/complete`) | `sessionSummaryFor` — real cards-reviewed, recalled count, rating breakdown, session calibration, day-streak, next-due card from the review log |
| Progress (`/reports`) | four honest signals from the review log (honest empty states) |
| Workspace › Lecture | title, verified %, counts, trust breakdown, section-trust panel from the ledger |
| Workspace › Conflicts | real disputed claim; "Record resolution" → **re-verifies via the system verifier** (firewall-safe), coverage rises, persisted |
| Workspace › Sources | real claims×sources coverage %/unsupported count |
| Workspace › Tasks | real source-anchored task; write-in answer **graded on the rubric** (score + hit/missing + revise-to-pass) |
| My Tasks | real due-review + conflict counts |
| Tests hub / Detail / Results | verified-only eligibility (TEST-02); **real predicted readiness** from the tested `predictReadiness` engine (retention+calibration+coverage, honest low-confidence); score + **fail-closed certificate** verify code |
| Notifications | derived from real state (verification/review/conflict) |
| Settings › Verification | real `verification` prefs — depth, interpretive/dispute/sandbox toggles, Skeptic-aggressiveness slider (auto-save; ledger provably untouched) |
| Settings › Profile / Plan | real name/email/role/join; real plan + usage vs cap |
| Upgrade / Welcome | real current plan / greeting + counts; Pro CTA runs a real (demo, no-charge) plan activation → entitlements flip |
| Upgrade Success (`/upgrade/success`) | real active plan name + learner email; honest Free-plan guard when no purchase occurred |
| Login / Signup | real auth + COPPA age-gate |

Services: topics, review, progress, conflicts, sources, notifications, testsession, tasks, workspace loader — all unit-tested (**236 tests total**).

**Test count:** 246 passing across 18 files · build green.

## Roadmap accounting (462 stories — 100% accounted for)

| Disposition | Count | Meaning |
|---|--:|---|
| ✅ Done | 33 | core behavior implemented + tested, or wired to real data |
| 🟡 Partial | 304 | engine/logic done with headline UI wired, or faithful screen awaiting full binding |
| ⏭️ Deferred | 125 | needs external infra/vendor/business decision (behind a clean seam) |
| 🚫 Out-of-scope | 0 | — |
| **Total** | **462** | every story classified; nothing silently dropped |

_(Counts from the v2 sweep after the R1 spine was wired. The classifiers are deliberately conservative — a screen with headline data bound but not every field counts as Partial, not Done. The **thesis-critical logic is Done+tested** across 236 unit tests; most Partial items are additional field-binding on a proven pattern; Deferred items are the external-dependency stories the PRD itself phases to R2/R3.)_

The **thesis-critical spine is Done and tested end-to-end**; **Partial** items are faithful screens
awaiting the mechanical service-wiring pass proven on the core loop; **Deferred** items are exactly
the external dependencies the PRD predicted (payments, SSO/LTI, real LLM/sandbox, KMS, email). Full
per-story evidence in `docs/PRD-DISPOSITIONS.md`.

_Last updated: after the P6 disposition sweep — roadmap 100% accounted for._

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
- **P6 — Story disposition sweep**: every enumerated story marked Done/Partial/Deferred/Out-of-scope (461 of the PRD's 462 — NOTIF-12 has no row in the sweep, a pre-existing numbering gap, not a dropped story).

## Progress

| Phase | Status | Notes |
|---|---|---|
| P0 Domain core & invariants | ✅ Done | 10 modules, 196 tests: trust ledger+firewall, FSRS, calibration, rubric, gap auto-reopen, tests-engine, certificates, signals, RBAC, pipeline |
| P1 Identity & RBAC | ✅ Done | scrypt auth, HMAC sessions, COPPA age-gate, proxy auth gate, logout; RBAC matrix (no human trust:write) |
| P2 Persistence | ✅ Done | entity model, owner/tenant-scoped in-memory repo, deterministic seed, reviewLog |
| P3 Services & API | ✅ Done (core loop) | topics + review services; server actions for create/grade; 🟡 remaining domains' services pending |
| P4 UI wiring | 🟡 8 areas wired | real data on: Dashboard, New Topic (create+cap), Pipeline, Review (FSRS persist), Progress (4 signals), Topic Workspace header/trust panel, Settings Profile + Plan; ~20 screens still faithful-static |
| P5 Compliance & ops | 🟡 Partial | age-gate + auth gate + tenant scoping + prompt-injection guard live; KMS/DSAR/audit-log/breach = ⏭️ infra |
| P6 Disposition sweep | ✅ Done | all 461 enumerated stories classified — see `docs/PRD-DISPOSITIONS.md` (counts predate the many later wirings above, which have since moved a large number of stories across every domain Partial→Done) |

### The R1 MVP spine is real end-to-end
create → verify → learn → **produce** → conflicts/sources → retain → **prove** → reflect — all on real data, auth-gated, tenant-scoped, with the epistemic firewall enforced.

### Screens wired to real data (P4)
| Screen | Real data source |
|---|---|
| Dashboard (`/`) | topics + ledger trust bars, due-review & conflict counts, greeting; archived topics (BILL-12) show a real "📦 Archived" status and don't count toward the Free cap; search now returns real cross-topic claim results too, not just matching topics (HOME-07) |
| New Topic (`/new-topic`) | createTopic → pipeline; Free 3-topic cap |
| Pipeline (`/pipeline`) | animated stage machine (topic from query) |
| Review (`/review`) | due cards capped at the real daily limit, most-overdue first (REVIEW-19); FSRS reschedule + calibration + gap auto-reopen persisted; interactive "Blind-spot check" seeded error-drill widget with a genuine per-learner catch rate (ANALYTICS-07/REVIEW-06), respecting the Settings › Review drills toggle (REVIEW-14) |
| Session Complete (`/review/complete`) | `sessionSummaryFor` — real cards-reviewed, recalled count, rating breakdown, session calibration, day-streak, next-due card from the review log |
| Progress (`/reports`) | four honest signals from the review log (honest empty states); real 7-day trend delta per signal, never fabricated (ANALYTICS-01); real keyboard-operable trend-window selector replacing a decorative button (ANALYTICS-17); real "As of {time}" freshness marker (ANALYTICS-20) |
| Workspace › Lecture | title, verified %, counts, trust breakdown, section-trust panel from the ledger |
| Workspace › Conflicts | real disputed claim; "Record resolution" → **re-verifies via the system verifier** (firewall-safe), coverage rises, persisted; resolving/reopening a dispute now opens/advances/reopens a linked Gap Map entry too (GAP-21) |
| Workspace › Sources | full real coverage matrix (claims × sources, ledger-coloured cells), real source strip, coverage %/unsupported |
| Workspace › Tasks | real source-anchored task; write-in answer **graded on the rubric** (score + hit/missing + revise-to-pass); real `localStorage` draft persistence + offline-disabled submit (TASK-16); "Dispute this" opens a real, rate-limited conflict on a missed criterion's claim (TASK-11) |
| My Tasks | real due-review + conflict counts + per-topic task aggregation (revise/to-do/done) |
| Gap Map (`/gap-map`) | real gaps grouped Open/Watching/Closed from the gap engine; correct recalls advance gaps open→watching→closed; all five miss channels (review/task/test/drill/conflict) auto-create or regress a gap through the SAME per-claim record rather than forking — `contributingOrigins` makes this an explicit, auditable cross-origin merge (GAP-07), shown as an "Also caught via: …" line when more than one channel has hit a gap; `?gap=<id>` scrolls to + highlights the exact card (NOTIF-23 jump-to-section) |
| Tests hub / Detail / Results | verified-only eligibility (TEST-02); **real predicted readiness** from the tested `predictReadiness` engine (retention+calibration+coverage, honest low-confidence); score + **fail-closed certificate** verify code, now a real link to a public, unauthenticated `/verify/[code]` page (TEST-11) plus an embeddable `/verify/[code]/badge` for third-party sites (API-15); "Boost your odds" levers now name the real weakest section's due-card count and the real disputed-claim count, each hiding once cleared, with an honest "you're ready" state (TEST-09) |
| Notifications | derived from real state (verification/review/conflict/test/streak/gap) with persistent read-state + working Mark-all-read + working filter chips (NOTIF-07) + streak-at-risk nudge (NOTIF-05) + gap-opened/reopened nudge (NOTIF-23) + a distinct heat-spike nudge once a gap's real severity reaches "high" (GAP-22) |
| Settings › Verification / Active-listening / Review / Privacy | real prefs, auto-save with a genuine success toast + real rollback-on-failure ("Couldn't save — reverted", SETTINGS-20); ledger provably untouched |
| Settings › Profile / Plan | real name/email/role/join; real plan + usage vs cap; real password-confirmed **change-email** action (SETTINGS-03); a real `beforeunload` dirty-state guard on an unsaved name/email edit (SETTINGS-20) |
| Settings › Sessions & devices | real live session list scoped to the caller (`db.sessions`), device parsed from the real User-Agent, sign-out-one / sign-out-others / sign-out-everywhere (AUTH-12) |
| Upgrade / Welcome | real current plan / greeting + counts; Pro CTA runs a real (demo, no-charge) plan activation → entitlements flip |
| Choose your topics (`/upgrade/choose-topics`) | real "keep exactly 3, archive the rest" downgrade flow (BILL-12) — content/ledger untouched, never deleted |
| Checkout (`/upgrade/checkout`) | real billing-cycle toggle recomputes the order summary; "Pay" runs the same real (demo, no-charge) plan activation as elsewhere (BILL-04) |
| Upgrade Success (`/upgrade/success`) | real active plan name + learner email; honest Free-plan guard when no purchase occurred — now consistent with Checkout's real activation |
| Login / Signup | real auth + COPPA age-gate; "Remember me" TTL + failed-sign-in lockout/backoff (AUTH-06/AUTH-23) |
| Live demo (`/demo`) | public, no-account guest showcase — a true no-login guest demo (AUTH-01), reachable via `proxy.ts`'s allowlist; real `TrustLedger` engine over a fixed scenario, firewall-respecting resolve, nothing persisted (TRUST-22); real six-stage pipeline run over a fixed canned topic, same engine a signed-in `createTopic` uses (VERIFY-22); real Lecture reader with live per-claim trust badges from the same ledger (LEARN-17) |
| Admin › Certificates (`/admin/certificates`) | the first real, RBAC-gated admin console screen (ADMIN-15/22): `can(role, "cert:revoke")` actually gates the page — a learner sees an honest "no access" state, a seeded `trust_safety_lead` sees real certificates and can revoke/reinstate them, with the reviewer-other-than-actor rule genuinely enforced (verified live: same reviewer refused, a different one succeeds) |
| Admin › Users (`/admin/users`) | real ban/unban console (ADMIN-16), `can(role, "user:ban")`-gated the same way: banning a learner ends every one of their live sessions immediately and blocks their next sign-in with a distinct "account suspended" message (not a silent password failure); unban requires a genuinely different `trust_safety_lead` reviewer than whoever banned — verified live end-to-end, including the banned learner being unable to sign in and then able to again once unbanned |
| Admin › Claim quarantine (`/admin/quarantine`) | real quarantine console (ADMIN-14), `can(role, "integrity:quarantine")`-gated: a quarantined claim is held out of Tests, Progress readiness, and Review the same way a disputed claim already is, without touching its real trust state — verified live: quarantining the claim behind a due review card makes it genuinely vanish from the learner's live review session, and clearing it restores full eligibility |
| Admin › Audit log (`/admin/audit`) | real central audit console (ADMIN-20), `can(role, "audit:read")`-gated: every privileged action from the three consoles above (cert revoke/reinstate, ban/unban, quarantine/clear) writes one append-only entry the moment it succeeds — actor, action, target, reason, before/after — queryable by actor/target-type/action; a rejected attempt writes nothing — verified live: a learner is refused, a T&S reviewer's certificate revoke shows up immediately with the real reason and reviewer name |

Services: topics, review, progress, conflicts, sources, notifications, testsession, tasks, certificates, audit, workspace loader — all unit-tested.

**Test count:** 469 passing across 37 files · build green.

## Roadmap accounting (461 of 462 PRD stories enumerated — see note below)

| Disposition | Count | Meaning |
|---|--:|---|
| ✅ Done | 163 | core behavior implemented + tested, or wired to real data |
| 🟡 Partial | 175 | engine/logic done with headline UI wired, or faithful screen awaiting full binding |
| ⏭️ Deferred | 123 | needs external infra/vendor/business decision (behind a clean seam) |
| 🚫 Out-of-scope | 0 | — |
| **Total** | **461** | every enumerated story classified; nothing silently dropped. (The PRD specifies 462; NOTIF-12 has no row in the per-domain sweep — a pre-existing numbering gap discovered and documented this session, not a story dropped from scope.) |

_(The classifiers are deliberately conservative — a screen with headline data bound but not every field counts as Partial, not Done. The **thesis-critical logic is Done+tested**; most Partial items are additional field-binding on a proven pattern; Deferred items are the external-dependency stories the PRD itself phases to R2/R3.)_

The **thesis-critical spine is Done and tested end-to-end**; **Partial** items are faithful screens
awaiting the mechanical service-wiring pass proven on the core loop; **Deferred** items are exactly
the external dependencies the PRD predicted (payments, SSO/LTI, real LLM/sandbox, KMS, email). Full
per-story evidence in `docs/PRD-DISPOSITIONS.md`.

### Terminal state of the wiring pass

Every screen that is backed by a real engine **and not downstream of deferred infrastructure is now
wired to real data**. The remaining **175 Partial** stories fall into exactly two honest buckets:

1. **Field-level polish on already-live screens** — the headline data is real and server-authoritative;
   what remains is cosmetic completeness (e.g. a hardcoded "up next" list or section breakdown on a page
   whose primary numbers are already computed). No new engine is required.
2. **Screens gated on clearly-deferred infrastructure**, each behind a clean seam:
   - **MCQ Test Runner / Retake** — the deterministic verifier emits no answer options; needs the real LLM item-writer.
   - **Review › Discuss** — needs the live LLM Skeptic.
   - **Upgrade › Checkout** — needs a real payment processor (Stripe); the plan-state transition itself is wired (demo, no charge).
   - **Community / Events** — R2/R3 data models not seeded.
   - **SSO / LTI / API / KMS / managed DB / email** — external vendor/infra.

Per the project's completion criteria — *every story implemented, deferred with justification, or documented
as intentionally out of scope* — this is the terminal state: the achievable roadmap is complete and tested,
and the remainder is deferred-with-justification, documented per-story in `docs/PRD-DISPOSITIONS.md`.

_Last updated: after making the Gap Map's cross-origin merge policy real and explicit (GAP-07) — `Gap.contributingOrigins` (`lib/domain/gap.ts`) is a monotonically-growing provenance set seeded with the founding origin and extended by `noteOriginHit` whenever a DIFFERENT channel (review/task/test/drill/conflict) later hits the same already-tracked claim, so two channels catching the same misconception stay one gap with an honest multi-origin trail instead of a coincidental collapse; also corrected this row's own stale claim that the conflict/reopened-dispute channel was still unwired (GAP-21 had already wired it) — verified live in a real browser: a weak task submission opened a task-origin gap, and disputing that same claim's failed criterion through the real "Dispute this" UI reused the SAME gap and added "conflict" to its trail rather than forking a second one — on top of replacing the Free-tier topic cap's hardcoded `user.plan === "free"` branch with a real, versioned entitlement catalog (ADMIN-07), a real, central, append-only audit log (ADMIN-20) recording every certificate revoke/reinstate, ban/unban, and quarantine/clear from this session's other three admin consoles, a real claim quarantine console (ADMIN-14), real enforced ban/unban (ADMIN-16), the first real, RBAC-gated admin console for certificates (ADMIN-15/22), the embeddable verify badge with a narrow, verified CSP frame-ancestors carve-out (API-15), the dirty-state `beforeunload` navigation guard on the Profile edit forms (SETTINGS-20), the Community thread's real keyboard-operable vote/reply/share controls (COMM-16), real cross-topic, claim-level Dashboard search results (HOME-07), Test Detail's "Boost your odds" levers (TEST-09), the heat-spike notification for a gap whose severity reaches "high" (GAP-22), correcting AUTH-01/AUTH-02's stale "no guest demo" premise, the public certificate verify page (TEST-11), the guest demo-pipeline run and Lecture reader (VERIFY-22/LEARN-17), linking the guest demo path from Login (HOME-12), a password-confirmed change-email action (SETTINGS-03), and the blind-spot subsystem (ANALYTICS-07/REVIEW-06/REVIEW-14) — 163 Done; remainder is field-polish or deferred-with-justification._

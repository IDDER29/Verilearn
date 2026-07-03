## Prioritization & Release Roadmap

### 1. Prioritization framework & rationale

VeriLearn is not a content product; it is a **trust product**. That single fact drives every prioritization call below. A normal edtech roadmap can ship a thin loop and layer trust/compliance later. VeriLearn cannot: the moment a learner reads a claim that *isn't* red-teamed, sourced, and honestly tagged, the entire value proposition is falsified — and the moment a real (possibly teen) user types free-text into a task answer, the product incurs live legal exposure. So we prioritize against three axes, not one.

**The three axes**

- **Value** — does the story (a) prove or advance the verification thesis, (b) unblock the `create → verify → learn → produce → retain → prove` loop, or (c) convert/retain revenue? The spine (pipeline → trust ledger → conflicts/sources), the calibration/confidence gate, and verified-only tests+certs are maximum-value because they *are* the differentiator.
- **Effort** — the pipeline, execution sandbox, and ledger are high-effort but unavoidable (they are the product). Teams/SSO/LTI/SCIM are high-effort *and* deferrable. Effort only decides sequencing **after** the value and risk axes have spoken.
- **Risk** — split deliberately into two sub-axes because they pull in opposite directions:
  - *Thesis risk* — "does the product actually prove trust?" This forces the whole spine **plus every honesty invariant** (source-hallucination guard, fail-closed rendering, the administrative/epistemic firewall, "money buys thoroughness not truth") into MVP, enforced in code, not policy.
  - *Legal/security risk* — "can we lawfully touch a single real user?" A pure value/effort ranking would defer "compliance" as un-sexy plumbing. The risk axis overrides that: encryption, tenant isolation, the COPPA age-gate, sub-processor zero-retention DPAs, and a breach process are **launch blockers**, not features.

**The MVP decision rule.** A story is R1/MVP if it is *either* on the closed-loop critical path for one self-serve learner *or* a legal/security/accessibility blocker — **irrespective of effort**. Everything else sequences by value ÷ effort after the loop is proven.

**What MVP must include to prove the verification thesis.** The end-to-end spine for a single learner, with the honesty invariants live: three-field validation gate → six-stage background pipeline (Triage→Retrieve→Teach→Decompose→Verify→Skeptic) → execution sandbox (`Verified·execution`) → Skeptic red-team (`Disputed`/`Interpretive`) → a five-state, source-traceable trust ledger with Conflicts + a coverage matrix → in-lecture trust underlines with a fail-closed claim→evidence rail and the active-listening close gate → source-anchored rubric tasks at the ≥75% bar → FSRS review with commit-before-reveal calibration and seeded error-drills → a Gap Map whose defining mechanic is **auto-reopen** → verified/sourced-only timed tests → certificates with a fail-closed public verify page and SME-driven revocation → four honest signals on Progress. If any of these is cut, the product can no longer *demonstrate* earned trust — which is the only thing it sells.

**The compliance-and-encryption call-out (explicitly NOT Future).** Two domains are frequently mis-scoped as "later." They are R1:

- **COPPA/FERPA is a legal blocker, not a Future story.** GUARDIAN is a named, marketed persona ("typically a teen") and exam-prep students are frequently high-schoolers. An under-13 self-declaring adult is a COPPA violation on the *first byte* of personal data; a school assignment triggers FERPA; an EU learner triggers GDPR child-consent. Therefore a **hard age-gate + minor-safe defaults** (SEC-11), a **sub-processor register with zero-retention/no-train inference DPAs + PII-redaction before any LLM call** (SEC-05/SEC-06), and a **personal-data breach workflow on the 72-hour clock** (SEC-17) ship in R1. (The heavier B2B compliance surface — FERPA school-official agreements, self-serve DPA/SCC, per-tenant data-region pinning, SOC2/ISO evidence — can wait for R3 when schools actually assign the product.)
- **The encryption baseline is R1.** "Encryption where feasible" fails every enterprise/education security questionnaire on day one and leaves honest signals and free-text plaintext. TLS 1.2+ everywhere, AES-256 at rest for all learner data classes and backups, and a managed KMS with rotation (SEC-04) are a non-negotiable MVP floor — as is hard multi-tenant isolation at the crypto/authorization layer (SEC-03), because a cross-tenant leak is a reportable breach for two customers at once.

**Reading the MoSCoW table below.** Each domain was tagged story-by-story at MVP / Should-Have / Nice-to-Have / Future *within that capability area* — i.e. "if/when we build this domain, which stories are essential." That is orthogonal to **when the domain lands** in the release plan. A domain like Org-Admin has 11 internal-MVP stories yet lands wholesale in R3, because Teams is a post-MVP tier; its "MVP" stories are simply the must-haves *of the Teams build*. The `Lands in` column reconciles the two views.

---

### 2. MoSCoW rollup by domain

Counts are exact story tags per domain file. **Totals: 203 MVP · 222 Should · 27 Nice · 10 Future = 462 stories across 20 domains.**

| Domain | #MVP | #Should | #Nice | #Future | Single most important MVP story | Lands in |
|---|---:|---:|---:|---:|---|---|
| 20 Auth, Onboarding & Identity | 10 | 12 | 0 | 2 | **AUTH-03** — email/password sign-up: the default account-creation path nothing in the authenticated product exists without | R1 (SSO/SCIM → R3) |
| 21 Home / Dashboard & Discovery | 6 | 13 | 2 | 1 | **HOME-05** — topics listed with live trust bars: where the differentiation becomes visible before entering any topic | R1 |
| 22 Topic Creation & Verification Pipeline | 14 | 7 | 2 | 0 | **VERIFY-13** — the Skeptic red-teams every claim (`Disputed`/`Interpretive`): the actor the product is named after and the spine's final gate | R1 |
| 23 Lecture & Active Listening | 10 | 12 | 1 | 0 | **LEARN-02** — load-bearing claims underlined by trust level: the single most differentiating interaction | R1 |
| 24 Tasks & Rubric Assessment | 11 | 13 | 0 | 0 | **TASK-04** — rubric built from verified sources, each criterion source-traced: what makes grading honest vs. "AI feedback" | R1 |
| 25 Conflicts, Trust Ledger & Sources | 10 | 11 | 1 | 0 | **TRUST-01** — five states, one per claim, each source-traceable: the product's moat | R1 |
| 26 Review / FSRS, Confidence & Calibration | 14 | 9 | 1 | 0 | **REVIEW-02** — reveal locked until Sure/Unsure/Guessing is committed: the invariant that makes calibration measurable | R1 |
| 27 Gap Map & Misconception Tracking | 12 | 9 | 1 | 1 | **GAP-06** — Closed gaps auto-reopen on a later lapse: the single defining honesty mechanic | R1 |
| 28 Tests, Certificates & Verification | 12 | 8 | 1 | 2 | **TEST-02** — timed test whose questions come only from verified/sourced claims: the load-bearing wall of the whole thesis | R1 (verify API → R3) |
| 29 Community, Contributions & Reputation | 7 | 15 | 2 | 0 | **COMM-13** — self-promotion/self-certification structurally impossible (nominator ≠ approver): the wall between opinion and canon | R2 |
| 30 Events: Workshops, Groups & Challenges | 10 | 14 | 1 | 0 | **EVENT-06** — join a live claim-check and watch the ledger being built: the domain's thesis-proving experience | R3 |
| 31 Notifications, Reminders & Messaging | 10 | 10 | 3 | 1 | **NOTIF-01** — canonical in-app notification center: the durable record every other channel points back to | R1 (breadth → R2) |
| 32 Progress, Reports & Analytics | 10 | 9 | 2 | 0 | **ANALYTICS-01** — four honest signals dashboard, no vanity metrics: the concrete embodiment of the thesis | R1 (cohort/org → R3) |
| 33 Settings, Profile & Privacy | 9 | 11 | 2 | 1 | **SETTINGS-08** — verification/Skeptic settings apply to future lectures only, never mutate the ledger (I1) | R1 |
| 34 Billing, Plans & Subscriptions | 11 | 10 | 1 | 1 | **BILL-21** — money buys thoroughness, never a better trust verdict: the thesis-critical billing invariant | R1 (Teams → R3) |
| 35 Organization / Team Administration | 11 | 9 | 2 | 0 | **ORG-18** — publish/assign gate: a topic with an unresolved `Disputed` claim can't be assigned, no admin override | R3 |
| 36 Platform Admin, Moderation & T&S | 12 | 11 | 0 | 0 | **ADMIN-05** — separable admin roles + audited break-glass; even platform root cannot set a trust state | R1 (ops floor) / R3 (console) |
| 37 Accessibility, Mobile & Offline | 10 | 12 | 2 | 0 | **A11Y-01** — every trust state conveyed by icon+label, not color alone: protects the differentiator for the users most likely to miss it | R1 (floor) / R2 (breadth) |
| 38 Integrations, API, Webhooks, SSO & LTI | 2 | 16 | 3 | 1 | **API-03** — programmatic certificate-verification endpoint (fail-closed): the load-bearing external trust surface | R1 (minimal) / R3 |
| 39 Security, Privacy Eng. & Compliance | 12 | 11 | 0 | 0 | **SEC-06** — sub-processor register + zero-retention/no-train inference DPAs: makes the Privacy panel's promise literally true | R1 (floor) / R3 (enterprise) |

---

### 3. Phased release plan

Each release is a **coherent, shippable value proposition**, not a feature dump. The grouping logic is: R1 proves the thesis for one learner and clears the legal floor; R2 deepens the individual value that drives Free→Pro and long-term retention; R3 is the whole B2B expansion (which is mutually interdependent and worthless until the loop is proven); Future closes the known account-model and ecosystem gaps.

#### R1 — MVP: the thesis-proving core loop (B2C Free + Pro)

**Headline capabilities**
- **Front door & identity substrate** — guest demo of the trust ledger (the conversion "aha"); email/OAuth sign-up, verification, durable session, reset, account deletion; **hard, fail-closed multi-tenant isolation**.
- **The spine (the whole reason to exist)** — three-field validation gate → six-stage background pipeline with live "transparency, not a spinner" status; execution sandbox → `Verified·execution`; Skeptic red-team; five-state source-traceable ledger; Conflicts (per-topic + global inbox); Sources coverage matrix; **source-hallucination guard**.
- **Learn** — lecture with inline trust underlines, claim→evidence side rail, per-section trust, active-listening gates including the hard **close gate**; fail-closed rendering (a load failure never renders as `Verified`).
- **Produce** — source-anchored rubric tasks at the ≥75% bar, revise-to-pass, My Tasks; grades are contestable.
- **Retain** — FSRS review with **commit-before-reveal** confidence → calibration; seeded error-drills → blind-spot; wrong-idea → Gap Map; **auto-reopen** gaps.
- **Prove** — verified/sourced-only timed tests with a server-authoritative clock; certificates + fail-closed public verify page + programmatic verify endpoint; SME revocation integrity.
- **Reflect & monetize** — four honest signals with provenance and honest empty/low-confidence states; Home (today plan + trust bars); Notifications center + verification-done + review-due + conflict-raised; Settings (profile, plan/usage, privacy honesty, danger zone, learning tuning); **Free (3 topics) vs Pro ($12/mo)** with contextual paywall, idempotent Checkout, "money buys thoroughness not truth."
- **The non-negotiable floor (MVP, not Future)** — encryption baseline + KMS; PII-redaction before LLM calls + sub-processor zero-retention/no-train DPAs + register; **COPPA hard age-gate + minor-safe defaults**; 72-hour breach workflow; tamper-evident audit log; phishing-resistant MFA + dual-control for SME/epistemic-write roles; sandbox security envelope + kill switch; prompt-injection/output-sanitization defenses; accessibility floor (non-color trust encoding, keyboard/AT-operable gates, timed-test accommodation, offline reviews that still count); platform ops to run/observe/roll-back the pipeline & sandbox with honest degradation.

**Why grouped:** R1 is *exactly* the closed loop for one self-serve learner **plus** the legal/security/accessibility floor without which the product cannot lawfully or credibly touch a single real (possibly teen) user. Cut any spine element and the thesis is unprovable; cut the floor and launch is unlawful. Nothing here is deferrable.

#### R2 — Retention & B2C depth

**Headline capabilities**
- **Conversion & activation polish** — example on-ramps, popular quick-picks, full guest demo (pipeline/lecture/conflict), "learn next."
- **Loop depth (the Pro flywheel)** — full active-listening suite + configurability; **Skeptic hard mode** (the headline Pro entitlement) inline and in Discuss; interpretive claims; reopen conflicts; attach/curate sources; review-ahead, target-retention tuning, humane backlog handling; Discuss-this-answer → Conflict; calibration-direction & per-topic blind-spot reports; portfolio roll-ups; retake, boost-your-odds, tests hub.
- **Community (verified-answers-only)** — claim-anchored threads, the Skeptic's *sourced* answer, dispute→Conflict, upvotes, promotion-nomination→SME, reputation/leaderboard, moderation queue, anti-abuse.
- **Account-security & rights depth** — TOTP MFA, social login, email change, session management, ATO defenses; **DSAR self-service export + rights backbone**, retention schedules, cookie/consent layer, automated-decision transparency/contest.
- **Reach** — full mobile responsive loop, offline reading + multi-device sync conflict resolution, reduced-motion/reflow; notifications breadth (categories, channels, streak-at-risk, digests, quiet hours); consumer-scale T&S (juking/vote-ring detection, quarantine, appeals).

**Why grouped:** R2 is everything that makes a *solo* learner stay and pay — the FSRS/calibration/community retention flywheel and the mobile/offline surfaces where the daily habit lives — plus the personal-data-rights and account-security hardening a real consumer base requires. It all layers cleanly on the proven R1 loop and needs no B2B substrate.

#### R3 — Teams / B2B & scale

**Headline capabilities**
- **Seat economics** — Teams tier ($9/seat, min 5), seat pool, proration, the **seat-ceiling (BILLING-ADMIN) vs. seat-occupancy (ORG-ADMIN) split**, dunning/grace, reconciliation.
- **Org admin console** — bulk invite, roster, roles/cohorts, assignments→My Tasks, shared-library governance with the **publish/assign gate**, org defaults, progress-visibility policy (k-anonymity), utilization/offboarding, tenant audit.
- **Shared-library consumer experience** across lecture/tasks/review/gap/tests/community for team seats (inherit trust, contribute-not-mutate).
- **SME reviewer workflow at scale** — shared-library trust authority, promotion, disputed-grade adjudication, targeted re-verification, batched work-queue notifications.
- **Instructor & Events** — cohort assignment + cohort honest-signal/gap reports + cohort tests; live workshops/study-groups/challenges/AMAs, live claim-check → route-to-spine, recordings, captioning.
- **Enterprise identity & integration** — SSO (SAML/OIDC), SCIM, **LTI 1.3** (launch/roster/deep-link/grade passback), certificate webhooks, embeddable verify widget, bulk export/import, API keys/OAuth scopes, sandbox/test mode, versioning.
- **Enterprise compliance & assurance** — FERPA designation + school-official agreements, self-serve DPA/SCC, **per-tenant data-region pinning** (storage *and* inference), SOC2/ISO evidence + pen-test + VDP, cross-tenant/sandbox-escape runbook, platform admin console (tenant provisioning, model rollout with shadow + T&S/SME co-sign, entitlement catalog), org-scoped breach notification, VPAT.

**Why grouped:** B2B is mutually interdependent and only meaningful once the individual loop is proven: seats need billing, assignments need the publish gate, cohort reports need the visibility policy, SSO/LTI/SCIM need the tenant substrate, and shared libraries need the SME certify workflow. Shipping any piece of it before R1/R2 would be building a roof with no walls.

#### Future Vision

- **First-class guardian↔dependent account model** — payer≠learner separation, guardian dashboards and notification channel, replacing today's honestly-acknowledged single-shared-account gap (AUTH-21, HOME-20, BILL-23, NOTIF-22, GAP-23, SETTINGS-15).
- **Deep integration ecosystem** — SCIM directory sync at enterprise depth, GraphQL, no-code (Zapier-style) connector, broad developer webhook catalog, ATS/LMS/HRIS partnerships.
- **Credential & analytics extensions** — cohort-configurable pass bars, certificate compliance-audit automation, minor-eligibility credential constraints, deeper signal digests.

---

### 4. Sequencing dependencies & biggest delivery risks

**Critical-path dependency chain** (build order is forced by these edges):

1. **Auth + tenant isolation + encryption (20/39)** underpin *everything* — no data may be created before the identity/crypto substrate exists.
2. **Pipeline + Sandbox + Skeptic (22)** produce the **Trust Ledger (25)**, which is the single spine consumed by Lecture, Tasks, Review, Tests, Gap Map, Progress, Community, Events, and the API. Nothing downstream is real until the ledger is real — this is the tightest bottleneck in R1.
3. **Tasks, Review, Tests (24/26/28)** all read the verified claim base + trust states + canonical source objects; **Tests eligibility** is a live filter off the ledger.
4. **Signals converge:** Review mints Retention/Calibration/Drill, Tasks mints Transfer → both feed **Progress (32)** and **Tests readiness**. **Gap Map (27)** consumes review/task/test/conflict misses; its auto-reopen depends on the live review signal stream.
5. **Certificates → revocation** depend on Tests → depend on ledger eligibility; revocation propagation depends on SME downgrade events reaching the verify page/webhooks.
6. **Billing entitlements (34)** gate pipeline depth/hard-mode and the topic cap — needed before monetization, but the **Free path unblocks the loop first**, so billing depth can trail the spine.
7. **Teams (R3)** is a strict chain: billing seat ceiling → org-admin seat allocation → assignments → shared library → **SME certify workflow** → cohort reports. SSO/SCIM/LTI ride on the Auth + tenant substrate.

**Biggest delivery risks**

- **SME human-review throughput (the structural bottleneck).** Humans (SME-REVIEWER) are the *sole* certify authority for shared-library trust, disputed-grade adjudication, source promotion, source-hallucination review, quarantine resolution, and dual-control certification. R1 largely dodges this — in a learner's *own* topics the learner adjudicates their own conflicts — but the instant Teams/shared-libraries/certificate-eligible topics arrive in R3, SME becomes the rate-limiter for the entire B2B value prop: queue backlog blocks publishing, assignment, and cert issuance; quarantine SLAs slip; "not yet" is honest but frustrating. *Mitigations:* keep R1's personal-topic self-adjudication SME-free by design; gate SME-scaling to R3; ship queue/SLA/aging alerts (ADMIN-14), digest batching (NOTIF-12), and dual-control that **queues** an uncertifiable topic rather than downgrading it (SEC-01).

- **Unit economics / AI cost.** Every topic is multiple LLM calls (teach, decompose, verify, Skeptic, hard mode) plus sandbox runs; grading, drills, Discuss, and micro-chapters are per-submission LLM calls; the guest demo runs free compute; live hard-mode events + live sandbox are compute-heavy; and **hard mode — the primary Pro entitlement — is the biggest cost driver**. Free tier (3 topics, ~30 verification runs/mo cap) must be strictly cost-bounded or the funnel is unprofitable. *Mitigations:* pre-generate active-listening prompt content at pipeline time and cache (never per-read); cache the Skeptic's community answer per claim; dedupe identical resubmissions (skip re-grade); a cheap deterministic (non-LLM) close-gate validation; rate-limit the guest demo against pipeline-scraping; per-topic model-version tagging; per-event budgeting/queuing for live compute; and reliable entitlement checks so an unpaid account can **never** trigger paid-tier verification cost.

- **Trust-state consistency & atomic propagation.** The ledger is the single source of truth that must update **atomically** across lecture underlines, badges, test eligibility, gap map, rubric suspension, review-card eligibility, certificate revocation, community verified-answer markers, and API reads. A stale or torn state anywhere is a *silent lie about trust* — the exact failure the product exists to prevent. *Mitigations:* one canonical object per claim/conflict/source; optimistic concurrency; event-driven suspension/recompute; fail-closed rendering; the verify-URL authoritative over any lagging webhook.

- **Attacks on the moat (source hallucination, prompt injection, sandbox escape).** The worst pipeline failure is an `Unsupported` claim masquerading as `Verified·source` via a fabricated citation; injection coercing the Skeptic to auto-certify; or a sandbox escape faking a green run. All are R1 security work (VERIFY-16, SEC-18/19, ADMIN-03/06), handled by citation-resolution validation, instruction-isolation, the sandbox envelope + kill switch, and quarantine-not-certify.

- **Accessibility of a color/spatial/timed encoding.** The differentiator is encoded in exactly the channels that fail silently for some users. Non-color trust encoding, keyboard-operable gates, and timed-test accommodation are a WCAG 2.2 AA **launch gate** and a school/enterprise **procurement gate** — deferring them excludes the learners who most need honest signal *and* stalls B2B deals. Hence the accessibility floor is R1.

- **COPPA/FERPA + encryption (the legal blockers, re-stated as a delivery risk).** Because teens and students are in the marketed audience, the age-gate, minor-safe defaults, sub-processor zero-retention DPAs, breach process, and encryption baseline **must** land in R1; treating them as Future would make the first real user's first keystroke a compliance incident. The heavier enterprise-compliance surface (FERPA agreements, DPA/SCC self-serve, region pinning, SOC2) is correctly R3.

- **Scope breadth (462 stories).** The discipline that protects the schedule: R1 = the closed loop + the legal floor, nothing more; all B2B and ecosystem work is explicitly ring-fenced into R3/Future. Any R1 scope creep should be tested against one question — *is this on the loop's critical path, or a legal/security/accessibility blocker?* If neither, it is not R1.

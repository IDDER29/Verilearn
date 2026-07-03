## Tests (Formal Assessment), Certificates & Credential Verification

### Overview

This domain covers the **high-stakes, terminal end of the learning loop**: formal, timed tests and the **certificates** they produce, plus the **external credential-verification** surface that lets someone outside VeriLearn trust one of those certificates.

Where Review (FSRS) is low-stakes, self-paced, and confidence-gated, **a Test is a straight, timed, graded assessment** — no hints, no confidence gate, the clock keeps running once started. Two test shapes exist in the prototypes: a **Checkpoint** (covers a subset of sections, e.g. §1–§3) and a **Mastery test** (full-topic, timed, no hints). Every test carries a **pass bar** (default ≥75%, per-test configurable — the retake example runs at 70%), a **question count**, a **time limit**, and an **attempt ceiling** (2–3 attempts).

The single fact that makes this domain the load-bearing wall of the whole product thesis: **a test's questions are drawn *only* from claims that reached a Verified or Sourced trust state and survived the Skeptic.** Disputed, Unsupported, and Interpretive claims are excluded until resolved. That is what makes a VeriLearn certificate mean something an ordinary course-completion badge cannot — it is not "watched the lessons," it is "passed a timed test whose every question traces to a red-teamed, sourced claim, at a ≥75% bar." The domain also owns **predicted readiness** (a pass-likelihood forecast from the learner's retention and calibration on the covered claims), the routing of **misses into the Gap Map**, the **feedback of results into the four honest signals** (Retention/Transfer especially), and the **public certificate-verification page** an employer scans without an account.

Because a certificate is the product's highest-stakes output, this domain also owns the integrity machinery around it: **attempt honesty** (timer can't be cheated by closing the tab), **eligibility integrity** (a test can't quiz an unproven claim), and **revocation** (if the ledger changes underneath a cert, the cert must be able to be pulled and that change must propagate).

### Personas involved

- **Exam-prep Student (`LEARNER-EXAM`)** — the primary persona. Deadline-driven; lives on predicted-readiness, verified-only questions, fast retakes, and Gap-Map closure to cross a passing bar by a fixed date.
- **Self-directed Learner (`LEARNER-SELF`)** — takes Checkpoints and Mastery tests within Free's 3-topic cap; the default happy-path taker.
- **Returning Power-Learner (`LEARNER-POWER`)** — manages a portfolio of scheduled tests across many topics; reads the Tests hub as a queue.
- **Skeptical / Expert Learner (`LEARNER-SKEPTIC`)** — audits whether a question really traces to a defensible claim; may raise a Conflict on a test item's underlying claim.
- **Team Seat Learner (`LEARNER-TEAM`)** — takes tests inside a shared, pre-curated topic library and earns certs against inherited trust.
- **Instructor / Educator (`INSTRUCTOR`)** — assigns tests to a cohort and reads pass-rate / readiness distributions; holds pedagogical authority but **cannot alter trust states or hand-set a score/pass**.
- **Subject-Matter Expert / Content Reviewer (`SME-REVIEWER`)** — indirectly governs every test: their certification of claims defines the eligible question pool, and downgrading a claim can invalidate tests and **trigger certificate revocation**.
- **Employer / Recruiter (`EMPLOYER-VERIFIER`)** — external consumer of the certificate; verifies authenticity, scope, and revocation on a public page, ideally without an account.
- **Developer / API & Integration Consumer (`DEVELOPER-API`)** — integrates programmatic cert verification and subscribes to `test.passed` / `cert.issued` / `cert.revoked` webhooks (forward-looking).
- **Trust & Safety / Ledger Integrity Lead (`TRUST-SAFETY-LEAD`)** — polices cert fraud, answer-harvesting across retakes, and score gaming; can freeze and revoke, but never hand-certify.
- **Compliance / Data-Protection Officer (`COMPLIANCE-DPO`)** — owns certificate audit, retention, and credential compliance (FERPA/COPPA, DSAR includes issued certs).
- **Support Agent (`SUPPORT-AGENT`)** — unbreaks stuck/expired test state under scoped consent; **firewalled from ever fabricating a score, a pass, or a certificate**.
- **Organization / Teams Admin (`ORG-ADMIN`)** — sets the tenant's progress- and certificate-visibility policy; cannot certify or set a pass bar's meaning.
- **Accessibility-Reliant Learner (`A11Y-LEARNER`)** — timed tests are a core accessibility stress test (fixed timers, visual progress/timer, gating certificates); needs extended-time accommodation and non-visual encodings.
- **Verification spine — `VERIFY-PIPELINE` / `SKEPTIC-AI` / `EXEC-SANDBOX`** — upstream authorities that determine which claims are eligible to be tested; not interactive here but the source of eligibility truth.
- **Guest / Visitor (`GUEST`)** — may sample a demo but persists nothing and **earns no certificate**.

### User stories

- **[TEST-01] As an Exam-prep Student, I want to see a predicted readiness score before I start a test, so that I know whether I'm likely to pass and where to spend my remaining prep time.** — *Priority:* MVP — *Why this priority:* Readiness prediction is a named, headline feature of the domain and the core value for the deadline-driven persona.
  - *Acceptance criteria:*
    - Every scheduled test shows a readiness % (e.g. "85% likely to pass") on the Tests hub, Test Detail, and Retake screens, with a one-line basis ("from your retention & calibration on the covered claims").
    - Readiness is computed per-test from FSRS retention + calibration over exactly the claims the test covers, and recomputes when those inputs change.
    - Readiness is visibly relative to the test's own pass bar (e.g. "Above the 70% bar").
  - *Business rules / validation:* Readiness is a forecast, never a guarantee, and must be labelled as such; it must not be presented as a score or a grade. A test with unresolved disputed claims in a covered section surfaces a warning ("1 disputed claim to resolve") that suppresses an artificially high readiness.
  - *Failure & edge cases:* New topic with no review history → show "not enough data yet" rather than a fabricated 0% or 100%. If all covered claims are freshly verified but never reviewed, readiness is low-confidence and flagged as such.

- **[TEST-02] As a Self-directed Learner, I want to take a timed test whose questions come only from verified and sourced claims, so that I'm assessed on trustworthy material and the result actually means something.** — *Priority:* MVP — *Why this priority:* The verified-only question pool is the entire reason a VeriLearn test/cert is differentiated from a course badge.
  - *Acceptance criteria:*
    - Before start, Test Detail states plainly that "questions are drawn only from verified & sourced claims — disputed ones are excluded until resolved," and lists per-section question counts.
    - Each question is internally bound to exactly one eligible claim; after finishing, the learner can see the claim and its source for every question.
    - The runner shows question count ("Question 4 of 12"), a segmented progress bar, and a live countdown timer.
  - *Business rules / validation:* Eligible pool = claims in trust states **Verified·execution, Verified·source, or Sourced**. A question may not be generated from a Disputed, Unsupported, or Interpretive claim. Pass bar default ≥75%.
  - *Failure & edge cases:* If a covered section has too few eligible claims to hit its target question count, the test reduces that section's weight and discloses reduced coverage rather than padding with ineligible claims (see TEST-20 for the fully-blocked case).

- **[TEST-03] As an Exam-prep Student, I want disputed and unsupported claims visibly excluded — with the blocked sections shown to me — so that I understand exactly why a section "needs review" before I can be fully tested on it.** — *Priority:* MVP — *Why this priority:* Honest exclusion (not silent omission) is the trust-first behaviour that separates this from a black-box quiz generator.
  - *Acceptance criteria:*
    - Test Detail's "What this test covers" marks any section with an unresolved conflict as "needs review" and names the count of blocking claims.
    - Resolving the blocking Conflict or Source gap re-enables the excluded claims and updates the covered-section list and readiness.
    - A "Boost your odds → resolve 1 conflict (frees a claim for the test)" affordance links directly to the relevant Conflicts entry.
  - *Business rules / validation:* Exclusion is never silent — an excluded claim must be attributable to a specific trust state and, where applicable, a specific open Conflict. Interpretive claims are permanently excluded from graded questions (positions are mapped, not certified) and are never surfaced as "resolvable to enable."
  - *Failure & edge cases:* If resolving a conflict downgrades rather than upgrades the claim (e.g. it becomes Unsupported), the covered-section count and readiness must decrease accordingly, not increase.

- **[TEST-04] As a Self-directed Learner, I want to navigate, flag, and review my answers inside a continuous timed runner, so that I can manage my time and revisit uncertain questions before submitting.** — *Priority:* MVP — *Why this priority:* Core assessment ergonomics; without flag/navigation a timed test is unusable for real exam prep.
  - *Acceptance criteria:*
    - Runner supports Previous/Next, a Flag toggle, and a progress line ("3 answered · 1 flagged"); the segmented bar color-codes answered / flagged / current / unanswered.
    - The global left nav is disabled during a test ("Navigation is paused so the timer stays honest") with an explicit Exit (X) affordance that warns before abandoning.
    - No answer feedback, source, or explanation is shown mid-test ("sources & explanations appear after you finish").
  - *Business rules / validation:* There is **no confidence gate** in a test (unlike Review). The timer is continuous and cannot be paused once started. Exiting mid-test does not silently discard progress; it prompts and, if confirmed, follows the interruption policy in TEST-19.
  - *Failure & edge cases:* Attempting to open another topic/route mid-test is blocked with the pause message; a keyboard/AT user must be able to reach Flag and navigation without hover-only controls (see TEST-18).

- **[TEST-05] As a Self-directed Learner, I want a results screen that shows my score, a per-section breakdown, and for every miss the exact verified claim and source it tested, so that I learn precisely what I got wrong and can trust the correction.** — *Priority:* MVP — *Why this priority:* Post-test transparency (claim + citation per question) is where the verification promise pays off for the learner.
  - *Acceptance criteria:*
    - Results show overall score + pass/fail against the bar, correct count, elapsed time, and a per-section correct/total breakdown.
    - Each missed question renders the claim it tested, the learner's chosen wrong answer vs. the correct one, and the claim's trust state + citation (e.g. "Verified · CLRS §24.3").
    - Results state which honest signals moved ("nudged retention +3% and transfer +5% on Progress").
  - *Business rules / validation:* A question's correction always cites the same claim the question was generated from; the citation shown post-test must match the ledger entry. Skipped questions are reported distinctly from actively-wrong ones.
  - *Failure & edge cases:* If a claim underlying a shown question was downgraded between test submission and results view, the result is preserved as-taken but the correction is annotated "this claim's trust state has since changed" (ties to TEST-13).

- **[TEST-06] As an Exam-prep Student, I want every missed question automatically added to my Gap Map, so that my blind spots become tracked, closeable objects instead of vanishing after the test.** — *Priority:* MVP — *Why this priority:* Closing the loop from assessment to remediation is the domain's core promise to the deadline-driven learner.
  - *Acceptance criteria:*
    - On submission, each miss creates or reopens a Gap-Map entry tagged with origin "test" and the section/claim, and Results shows an "Added to gap map" badge.
    - A miss on a claim with an existing Open/Watching gap increments that gap rather than duplicating it; a miss on a previously Closed gap **reopens** it.
    - Results links directly into the Gap Map filtered to the newly-created gaps.
  - *Business rules / validation:* Gap origin, severity, and the linked claim/section must be recorded so the Gap Map can jump to the exact source. Passing a later retake on the same claim can transition the gap toward Closed (owned by the Gap Map domain, triggered here).
  - *Failure & edge cases:* If the Gap Map write fails, the test result must still persist; gaps are queued for retry and the learner is told remediation tracking is pending, never that it silently succeeded.

- **[TEST-07] As an Exam-prep Student, I want to retake a failed test with a fresh question set weighted toward the sections I struggled with, where only my best score counts, so that I can recover without being re-quizzed on the identical items.** — *Priority:* MVP — *Why this priority:* Retake is a first-class screen in the prototypes and essential to the deadline-recovery persona.
  - *Acceptance criteria:*
    - Retake generates **new questions on the same claims**, weighted toward weak sections, and shows attempt N of M plus a "since your last attempt" delta (gaps reviewed, readiness change, gaps still open).
    - Only the highest score across attempts is recorded as the test result; each attempt is still individually logged.
    - Attempts-remaining is shown on Test Detail and decrements per completed attempt.
  - *Business rules / validation:* Attempt ceiling is enforced (example: 3). A retake may set its own pass bar (example: 70%) distinct from the original. Best-score-counts, but a certificate reflects the attempt that first crossed the bar (with attempt count recorded for audit).
  - *Failure & edge cases:* With 0 attempts remaining, Start is disabled with an explanation and a route to review/remediate instead. If not enough *new* items can be generated for a section (small claim pool), the retake discloses reuse of previously-seen items rather than silently repeating them as if fresh.

- **[TEST-08] As a Returning Power-Learner, I want a Tests hub that lists upcoming/scheduled tests, per-test readiness, and past results across my whole topic portfolio, so that I can triage which test to prepare for next.** — *Priority:* Should-Have — *Why this priority:* Portfolio triage is high-value for the power persona but not required for a single learner's first pass.
  - *Acceptance criteria:*
    - Hub shows a "next test" hero (due date, question count, time limit, pass bar, readiness), a scheduled list sorted by urgency, and a past-results section with pass/miss and score.
    - Each scheduled row shows readiness with a colored bar and any blocking flag ("1 disputed claim to resolve").
    - Past misses expose a "retake available" affordance when attempts remain.
  - *Business rules / validation:* Due dates and reminders ("Remind me when due") are per-test; readiness on the hub must reflect the same computation as Test Detail. Free-plan users see hub content only for their entitled (≤3) topics.
  - *Failure & edge cases:* Empty state (no topics or no tests yet) shows a first-run prompt to create/prepare a topic, not a blank grid. A test whose topic was deleted disappears from the hub without erroring.

- **[TEST-09] As an Exam-prep Student, I want "boost your odds" recommendations before a test, so that I can raise my readiness with the single most impactful action.** — *Priority:* Nice-to-Have — *Why this priority:* A helpful accelerant on top of readiness, but the learner can already act on the raw signal.
  - *Acceptance criteria:*
    - Test Detail suggests the highest-leverage actions (e.g. "Review §3 flashcards — weakest section," "Resolve 1 conflict — frees a claim") with direct links.
    - Recommendations are ranked by predicted readiness lift and update after the learner acts.
  - *Business rules / validation:* Recommendations may only point to genuine levers (weak covered sections, blocking conflicts, due reviews) — never vanity nudges. No recommendation may claim a specific score guarantee.
  - *Failure & edge cases:* If readiness is already high and no weak lever exists, show an encouraging "you're ready" state instead of an empty or forced recommendation.

- **[TEST-10] As an Exam-prep Student, I want to earn a certificate when I pass a Mastery test, so that I have a portable credential that attests my learning was verified-only.** — *Priority:* Should-Have — *Why this priority:* The certificate is the domain's highest-stakes output and the LEARNER-EXAM end-goal, but a functional test loop can ship before full credentialing.
  - *Acceptance criteria:*
    - On passing a Mastery test at/above the bar, a certificate is issued recording: issued-to, topic scope, date, pass bar, attempt(s), and the attestation "questions drawn only from verified/sourced claims."
    - The certificate carries a stable public verify-URL / QR and a revocation status field.
    - The learner can view, download, and share the certificate from their profile/topic.
  - *Business rules / validation:* Certificates are issued **only** for passing at/above the bar, and only for tests whose eligible-claim rule held at grading time. Guests earn no certificate. Checkpoints do not issue certificates (Mastery only, unless configured otherwise per topic). Issuance is automatic from a valid pass — no human "grants" a cert — but the cert's meaning rests on SME-certified claims upstream.
  - *Failure & edge cases:* If any covered claim's certification is found invalid at issuance time, issuance is held rather than producing a hollow cert. A tie exactly at the bar (e.g. 75.0%) counts as a pass; borderline rounding rules are fixed and documented.

- **[TEST-11] As an Employer / Recruiter, I want to verify a candidate's certificate on a public page without creating an account, so that I get a fast, trustworthy yes/no on authenticity and revocation.** — *Priority:* Should-Have — *Why this priority:* This is the external half of the value prop; friction here (forcing an account) kills the credential's usefulness, but it depends on TEST-10 existing first.
  - *Acceptance criteria:*
    - Scanning the verify-URL/QR opens a public page showing issued-to, topic scope, issue date, pass bar (≥75%), the verified/sourced-only attestation, and current revocation status — with no login.
    - The page distinguishes a valid current cert from a revoked or expired one unambiguously.
    - No private learner data (Progress, Gap Map, Reports) is shown without the learner's explicit consent.
  - *Business rules / validation:* Public page exposes only what the learner chose to surface on the cert (Privacy-governed PII minimization). The verifier cannot alter, issue, or revoke, and cannot reach the learner's other topics. Deeper honest signals (calibration/transfer) are visible only via a learner-initiated Reports share.
  - *Failure & edge cases:* A tampered or fabricated cert id resolves to an explicit "not a valid VeriLearn certificate" state (tamper-evident), never a partial-looking render. A revoked cert clearly reads "revoked" with date/reason category (see TEST-21).

- **[TEST-12] As a Self-directed Learner, I want to control what personal information and scope appears on my certificate and to opt in before sharing deeper signals, so that verifying my credential never leaks my private learning data.** — *Priority:* Should-Have — *Why this priority:* Resolves the built-in tension between employer appetite and learner privacy; required for a defensible public verify page.
  - *Acceptance criteria:*
    - The learner chooses the display name / identifier shown on the cert and can regenerate or revoke a share link.
    - Sharing calibration/transfer/Reports is a separate, explicit, revocable consent — off by default.
    - The public verify page reflects these choices immediately.
  - *Business rules / validation:* PII on the cert is minimized to what the learner opts to expose; consent to share deeper signals is scoped, time-boundable, and auditable. Consent revocation propagates to any active share and to API consumers.
  - *Failure & edge cases:* Revoking a share link invalidates previously-distributed URLs; an employer opening a stale link sees "link no longer valid," not the old data.

- **[TEST-13] As a Subject-Matter Expert / Content Reviewer, I want a claim I downgrade or dispute to automatically flag every test and certificate that depended on it, so that a credential can never outlive the truth it was built on.** — *Priority:* MVP — *Why this priority:* This revocation-integrity invariant is what makes the certificate trustworthy; without it the whole verification-first pitch is hollow.
  - *Acceptance criteria:*
    - Downgrading a claim below eligibility (to Disputed/Unsupported) marks any *unstarted* test drawing on it as needing regeneration and excludes the claim.
    - Certificates whose passing test materially depended on the now-invalid claim are flagged for review and can be **revoked**, with revocation reflected on the public verify page and emitted as a `cert.revoked` event.
    - Already-recorded past results are preserved as-taken but annotated that an underlying claim's trust state changed.
  - *Business rules / validation:* Only an SME (not the Skeptic, Sandbox, Pipeline, Instructor, or any API) can trigger the certification change that drives revocation. Revocation is logged with actor, reason category, and timestamp. Revocation is reversible if the claim is re-certified, restoring the cert with an audit trail.
  - *Failure & edge cases:* Bulk downgrade must not thrash-revoke certs where the claim was immaterial to the pass (score would still exceed the bar without it) — materiality is evaluated before revocation. Revocation propagation that fails to a downstream system is retried and surfaced to TRUST-SAFETY-LEAD.

- **[TEST-14] As an Instructor / Educator, I want to assign a test to a cohort and read the pass-rate and readiness distribution, so that I can find weak spots — without any power to change trust states or hand-set a score.** — *Priority:* Should-Have — *Why this priority:* Core Teams value, but gated behind Teams plan and not needed for the single-learner MVP.
  - *Acceptance criteria:*
    - The instructor can assign an existing verified test from the shared library to a cohort with a due date.
    - The instructor sees aggregate readiness and pass/fail distribution and the four honest signals for the cohort, subject to visibility policy.
    - The instructor cannot edit questions, alter a claim's trust state, or override an individual score/pass.
  - *Business rules / validation:* Instructor authority is pedagogical only; certification and pass-bar meaning are immutable to them. Per-learner detail is visible only within the tenant's progress-visibility policy (ORG-ADMIN owned).
  - *Failure & edge cases:* Assigning a test whose covered claims are partly disputed warns the instructor that some sections are currently blocked. Removing a learner from a cohort does not delete their earned certs.

- **[TEST-15] As a Trust & Safety / Ledger Integrity Lead, I want to freeze and revoke certificates that are fraudulent or earned by gaming, so that the credential's market value is protected against abuse.** — *Priority:* Should-Have — *Why this priority:* Cert fraud directly attacks the product's core asset, but abuse tooling can follow the core issuance path.
  - *Acceptance criteria:*
    - T&S can freeze (suspend) and revoke a cert, with a required reason category, immediately reflected on the public verify page and via webhook.
    - T&S can flag patterns (answer-harvesting across retakes, multi-account collusion, timer/proctor anomalies) and act on the associated certs/attempts.
    - T&S can never hand-certify a claim or fabricate a pass — only freeze/revoke/ban.
  - *Business rules / validation:* Freeze/revoke actions are fully audit-logged and reversible with justification. Revocation reason categories are standardized and, where privacy-appropriate, disclosed to the verifier as a category (not raw evidence).
  - *Failure & edge cases:* A false-positive freeze must be reversible with the cert's original issue metadata intact. Mass-revocation from a detected vote-ring must not affect independently-earned certs sharing the same topic.

- **[TEST-16] As a Compliance / Data-Protection Officer, I want an auditable trail of certificate issuance, retention, and minor-eligibility, so that credentials meet FERPA/COPPA and DSAR obligations.** — *Priority:* Future — *Why this priority:* Real obligation for scale/B2B and minors, but not required to prove the core loop.
  - *Acceptance criteria:*
    - Every cert issuance/revocation is logged with actor, timestamp, scope, and reason, and is exportable for audit.
    - Issued certs are included in a learner's DSAR export and honor the tenant's retention policy.
    - Certificate issuance for known minors respects configured eligibility/consent constraints (guardian consent where required).
  - *Business rules / validation:* The DPO has advisory/gatekeeping authority over personal data and credential compliance but **never over truth** (cannot change a claim or a score). Retention windows and deletion cascade to certs and their public verify pages.
  - *Failure & edge cases:* A retention-driven deletion of a cert must invalidate its public verify-URL gracefully ("no longer available"), not 500. A guardian-consent gap for a minor blocks issuance with a clear reason.

- **[TEST-17] As a Developer / API & Integration Consumer, I want to verify certificates programmatically and subscribe to issuance/revocation webhooks, so that an ATS/LMS can inherit VeriLearn's trust signal without scraping.** — *Priority:* Future — *Why this priority:* Explicitly forward-looking per the persona; the public page (TEST-11) serves single verifications first.
  - *Acceptance criteria:*
    - A verify endpoint returns validity + scope + revocation for a cert id under app auth.
    - Webhooks fire for `test.passed`, `cert.issued`, and `cert.revoked`, and revocation propagates cleanly to downstream systems.
    - The five trust states behind the credential survive the boundary (not flattened to pass/fail) when the payload includes ledger context under consent scopes.
  - *Business rules / validation:* No API call can write to the ledger, certify a claim, or bypass plan entitlements. Learner data beyond the cert requires explicit consent scopes. Revocation events must be idempotent and ordered.
  - *Failure & edge cases:* A consumer that missed a `cert.revoked` webhook must reconcile via the verify endpoint; the endpoint is the source of truth over any cached "valid." Replay/duplicate webhooks must not double-process.

- **[TEST-18] As an Accessibility-Reliant Learner, I want extended-time accommodation plus non-visual timer/progress and a reduced-motion path, so that a timed test that gates a certificate is fair to me.** — *Priority:* MVP — *Why this priority:* Timed, high-stakes, cert-gating assessment is the sharpest accessibility risk in the whole product; fairness here is non-negotiable.
  - *Acceptance criteria:*
    - An extended-time accommodation can be applied to a learner/test, adjusting the limit without marking the result as non-standard on the cert.
    - The countdown timer, question progress, flag state, and segmented bar are exposed to assistive tech as text/ARIA (not color- or hover-only) with periodic time-remaining announcements.
    - Progress rings and reveal animations honor `prefers-reduced-motion` with static/text equivalents.
  - *Business rules / validation:* Accommodated attempts are equivalent credentials — no scarlet-letter annotation. All interactive runner controls are keyboard-reachable and labelled. Timer honesty (TEST-19/22) still applies within the accommodated limit.
  - *Failure & edge cases:* If a screen reader user's focus is lost on question change, focus must move predictably to the new question stem. A timer nearing zero must warn accessibly, not only via a color shift.

- **[TEST-19] As a Self-directed Learner, I want a defined, honest behavior when my connection drops or I close the tab mid-test, so that I neither lose a legitimate attempt unfairly nor gain a way to cheat the timer.** — *Priority:* MVP — *Why this priority:* Timed assessments must have a rock-solid interruption policy or the credential is trivially gameable and learners lose trust after one bad drop. *(Failure scenario.)*
  - *Acceptance criteria:*
    - Answers are persisted continuously so a reconnect within the window resumes at the same question with the **timer having continued to run** (server-authoritative clock).
    - If the elapsed server time exceeds the limit while disconnected, the test auto-submits answered questions on reconnect and reports the interruption.
    - Closing the tab warns first; abandoning follows the same server-clock rule, not a client reset.
  - *Business rules / validation:* The timer is authoritative on the server and cannot be reset by reload, tab-close, or clock manipulation. An interrupted attempt still counts against the attempt ceiling unless a support override applies (TEST-23).
  - *Failure & edge cases:* Two concurrent sessions of the same attempt (two tabs) must not double-run the clock or allow answer-shopping — the attempt is single-session-locked. A total server outage mid-test invalidates the attempt cleanly (no consumed attempt, no partial score) rather than recording a spurious fail.

- **[TEST-20] As an Exam-prep Student, I want a clear, honest state when a test cannot be generated because too few claims are eligible, so that I'm never handed a broken or padded test.** — *Priority:* MVP — *Why this priority:* A verification-first product must fail loudly rather than quietly quiz unproven material; this is the direct consequence of the eligibility rule. *(Failure scenario.)*
  - *Acceptance criteria:*
    - If eligible (verified/sourced) claims are insufficient for the configured question count, the test is not startable and the screen explains why and what to resolve (open conflicts, unsupported rows in the coverage matrix, or "topic still verifying").
    - The learner is routed to the exact blocking items (Conflicts / Sources / Pipeline).
    - Once enough claims become eligible, the test becomes startable automatically.
  - *Business rules / validation:* The system never substitutes disputed/unsupported/interpretive claims to reach a count. A reduced-coverage test may be offered only if it still meets a minimum eligible-claim floor and discloses reduced scope.
  - *Failure & edge cases:* A topic mid-pipeline (not yet fully verified) shows "test available after verification completes," tied to Pipeline stage. If a section is fully blocked, the covered-section list shows it struck through with the blocking reason.

- **[TEST-21] As an Employer / Recruiter, I want verification of a forged, stale, or revoked certificate to return an unambiguous negative, so that I never accept a credential that isn't currently valid.** — *Priority:* Should-Have — *Why this priority:* The verify page's whole job is a trustworthy no as much as a yes; needed alongside TEST-11. *(Failure scenario.)*
  - *Acceptance criteria:*
    - An unknown/tampered cert id resolves to "not a valid VeriLearn certificate" (no partial or spoofable render).
    - A revoked cert shows "revoked" with date and reason category; an expired/retention-deleted cert shows its distinct state.
    - Verification is tamper-evident so a screenshot or altered field cannot pass as valid.
  - *Business rules / validation:* Validity is resolved live against the source of truth, never trusting the presented artifact's own claims. Revocation status must be current within a tight bound of the SME/T&S action that caused it.
  - *Failure & edge cases:* Verify service degraded → return "unable to verify right now, try again" (fail-closed to "unverified"), never a default "valid." A learner sharing a link revoked for privacy shows "no longer available," distinct from fraud-revocation.

- **[TEST-22] As a learner under a running clock, I want the test to auto-submit fairly when time expires, so that I get a defined score without a frozen or ambiguous end state.** — *Priority:* MVP — *Why this priority:* Timer expiry is the single most common test end-state and must be deterministic to make scores comparable and certs defensible. *(Failure scenario.)*
  - *Acceptance criteria:*
    - At 0:00 the runner locks input and auto-submits; answered questions are graded, unanswered are scored incorrect (and skips are distinguished in Results).
    - The learner sees a clear "time's up — submitted" state leading to Results, not a silent freeze.
    - The attempt is consumed and results/gaps/signals flow exactly as a normal submission.
  - *Business rules / validation:* Server clock is authoritative; a client showing time remaining after server expiry still submits at the server boundary. Extended-time accommodations shift the boundary but not the auto-submit rule.
  - *Failure & edge cases:* Expiry during a network blip is reconciled to the server boundary on reconnect (ties to TEST-19). Expiry with zero answered still records a legitimate (failing) attempt rather than an error.

- **[TEST-23] As a Support Agent, I want to restore a wrongly-consumed attempt or unstick a frozen test under scoped consent, without ever fabricating a score or certificate, so that operational failures don't unfairly cost a learner a passing chance.** — *Priority:* Should-Have — *Why this priority:* Real operational failures (outages, double-charged attempts) need a remedy, but the firewall against fabricated learning signals is absolute. *(Failure/recovery scenario.)*
  - *Acceptance criteria:*
    - With learner consent, Support can reinstate a consumed attempt when the cause was a platform failure (outage, stuck runner), logged with reason.
    - Support can clear a frozen/stuck test session so the learner can restart, without altering any recorded answers or scores.
    - Support cannot set a score, mark a pass, issue, or un-revoke a certificate.
  - *Business rules / validation:* Every support action is scoped by explicit consent and fully audit-logged; the firewall against fabricating a learning signal or credential is enforced by permissions, not policy alone. Reinstated attempts don't retroactively change past scores.
  - *Failure & edge cases:* If a learner requests a pass they didn't earn, the action is not available to Support and is routed as a dispute, not granted. An attempt reinstatement that races a legitimate second attempt must not create two "best scores" — reconciliation keeps the true highest valid score.

### Business rules & invariants

- **Eligibility invariant (the spine rule):** A graded test question may be generated **only** from a claim in state Verified·execution, Verified·source, or Sourced. Disputed, Unsupported, and Interpretive claims are excluded; Interpretive is permanently excluded from grading (positions mapped, not certified).
- **Honest failure over padding:** If eligible claims are insufficient, the platform blocks or reduces-and-discloses the test — it never substitutes ineligible claims to hit a count.
- **Pass bar:** Default ≥75%; per-test configurable (retakes may differ, e.g. 70%). A score exactly at the bar passes. Rounding rules are fixed and documented.
- **Test shapes:** Checkpoint (section-subset) and Mastery (full-topic, timed, no hints). Certificates issue from Mastery passes (Checkpoints do not issue certs unless configured).
- **Timer honesty:** Timers are continuous, server-authoritative, and non-pausable; no client action (reload, tab-close, clock change, second tab) resets them. Expiry auto-submits deterministically.
- **No confidence gate:** Tests are straight graded assessments; the Sure/Unsure/Guessing gate belongs to Review, not tests.
- **Attempts:** Bounded ceiling per test (2–3); best score counts; each attempt individually logged; interrupted/expired attempts still consume the ceiling unless a Support platform-fault override applies.
- **Misses feed remediation:** Every miss creates/reopens a Gap-Map entry tagged origin=test; results feed the honest signals (Retention/Transfer/Calibration), never vanity metrics.
- **Certificate meaning:** A cert attests issued-to, scope, date, pass bar, and "questions drawn only from verified/sourced claims" — it is a work-showing credential, not a completion badge. Guests earn none.
- **Certification authority:** Only an SME certifies the underlying claims; the Pipeline/Skeptic/Sandbox/Instructor/API/Support cannot. Cert issuance is automatic from a valid pass but rests entirely on SME-certified claims.
- **Revocation invariant:** If a claim a cert materially depended on is downgraded, the cert can be revoked; revocation is live, audit-logged, reversible, reflected on the public verify page, and propagated via `cert.revoked`. Certs cannot outlive the ledger truth beneath them.
- **Privacy wall:** Public verification exposes only learner-chosen cert fields; Progress, Gap Map, and Reports (calibration/transfer) require explicit, revocable learner consent.
- **Tamper-evidence & fail-closed verification:** Verification resolves live against source-of-truth; unknown/forged ids and degraded service fail closed to "invalid/unverified," never a default "valid."
- **No external mutation:** No API, employer, or integration can write to the ledger, certify a claim, or set a score.

### Cross-domain dependencies

**This domain consumes from:**
- **Conflicts & Trust Ledger** — the trust state of every claim; the eligibility gate and the "resolve to free a claim" flow depend on it. Downgrades here drive cert revocation (TEST-13).
- **Verification Pipeline / Skeptic / Execution Sandbox** — determine which claims reach eligible states and survived the Skeptic; a mid-pipeline topic has no testable pool yet.
- **Sources / Coverage Matrix** — unsupported rows explain why a section is blocked or reduced.
- **Review / FSRS + Calibration** — the inputs to predicted readiness and to the honest signals a cert stands on.
- **Topic/Library & Plan entitlements** — which topics (and how many, on Free) have tests; Teams shared library for cohort assignment.
- **Privacy / Settings & Consent** — governs cert PII, share links, and any deeper-signal sharing.
- **Auth / Identity** — issued-to identity on the cert; guest boundary (no cert).

**This domain provides to:**
- **Gap Map** — test misses as tagged, origin=test gaps (new/reopened), with jump-to-claim links.
- **Progress / Reports (four honest signals)** — test results move Retention/Transfer/Calibration; Reports is what a learner optionally shares with an employer.
- **Certificates as the credential surface** — consumed by `EMPLOYER-VERIFIER` (public page) and `DEVELOPER-API` (programmatic verify + webhooks).
- **Teams / Instructor** — cohort pass-rate and readiness distributions.
- **Trust & Safety / Compliance** — cert issuance/revocation audit trail; fraud/gaming signals.
- **Notifications** — "test due," "readiness changed," "retake available," "certificate revoked."

### Key technical requirements

- **Server-authoritative timing:** Test clocks, expiry, and pause-prohibition must be enforced server-side and resistant to reload/tab-close/clock-manipulation/multi-session; single-session attempt locking to prevent answer-shopping. Continuous answer persistence for resume.
- **Deterministic scoring & attempt state:** Idempotent submission (auto-submit on expiry, reconnect reconciliation) so a given attempt yields exactly one recorded result; best-of-N aggregation without duplicate "best" rows.
- **Question generation bound to the ledger:** Item generation must query the live trust ledger for eligibility, bind each item to a claim id + source, and regenerate/withhold when eligibility changes. Fresh-item generation for retakes weighted by section performance, with disclosure when the pool is too small.
- **Readiness model:** Per-test pass-likelihood computed from FSRS retention + calibration over the covered claim set, low-confidence flagged when data is sparse; must recompute on review/conflict changes without heavy latency on the hub.
- **Certificate integrity:** Tamper-evident, revocable credentials with a stable public verify-URL/QR; live revocation status resolved against source-of-truth; fail-closed verification for unknown/forged ids and service degradation.
- **Revocation propagation:** SME claim-downgrade → materiality check → cert flag/revoke → public page update + `cert.revoked` webhook, with retries, idempotency, ordered delivery, and reconciliation via the verify endpoint.
- **Privacy-minimizing verification:** Public page exposes only learner-chosen fields; consent-scoped, time-boundable, revocable sharing of deeper signals; consent revocation invalidates live share links and API access.
- **Auditability:** Full, immutable audit log for issuance, revocation, freezes, attempt reinstatements, and accommodations — actor, timestamp, reason category — for T&S and Compliance (DSAR/FERPA/COPPA, retention cascade to certs and verify pages).
- **Accessibility of timed assessment:** Non-visual timer/progress/flag encodings (ARIA + text, periodic time announcements), keyboard-reachable runner controls, `prefers-reduced-motion` alternatives, and configurable extended-time accommodation that leaves the credential unmarked.
- **Resilience:** Graceful mid-test outage handling (no spurious consumed attempts or phantom fails); retryable Gap-Map/signal writes that never block result persistence.

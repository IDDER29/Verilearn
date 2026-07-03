## Topic Creation & the Verification Pipeline (the Skeptic)

### Overview

This domain is the front door to every VeriLearn topic and the machinery that makes the product's core promise true. A learner names *what* they want to learn, *where* they are starting from, and *why*; a validation gate holds until all three are supplied; and then the six-stage **Verification Pipeline** (Triage → Retrieve sources → Teach → Decompose claims → Verify claims → Skeptic) turns that spec into a drafted **trust ledger** — a lecture in which every claim already carries one of five trust states, each traceable to a source, before the learner reads a word.

This is where the product thesis is either earned or lost. Competitors generate courseware instantly and confidently; VeriLearn deliberately makes the learner *watch the work happen* — transparency, not a spinner — and refuses to show anything that has not been checked. Three system actors do the labor: the **Verification Pipeline** (VERIFY-PIPELINE) orchestrates and produces the raw ledger (Verified·source / Sourced / Unsupported); the **Execution Sandbox** (EXEC-SANDBOX) empirically proves computational claims (Verified·execution); and **the Skeptic** (SKEPTIC-AI) red-teams every decomposed claim, raising Disputed and Interpretive conflicts. The domain's boundaries are strict: it *drafts* trust states but does not finalize disputes (Skeptic proposes, SME disposes), does not assign Verified·execution outside the sandbox, and never lets an unverified claim ship silently as settled. Downstream, the finished lecture, its colored trust bar, and a populated coverage matrix hand off to the Lecture, Conflicts, Sources, Tasks, Tests, and Gap Map domains.

### Personas involved

- **Self-directed Learner (LEARNER-SELF)** — the default author of topics; runs the three-field form and watches the pipeline; feels the Free 3-topic cap.
- **Exam-prep Student (LEARNER-EXAM)** — creates topics against a deadline; sensitive to pipeline latency and wants the verified-claim base a test can draw from.
- **Returning Power-Learner (LEARNER-POWER)** — creates many topics over time; cares about re-verification and pipeline reliability across a large portfolio.
- **Skeptical / Expert Learner (LEARNER-SKEPTIC)** — the human adversary to the Skeptic; runs hard-mode verification (Pro) and scrutinizes decomposition quality and unsupported rows.
- **Team Seat Learner (LEARNER-TEAM)** — consumes topics pre-created in a shared library; rarely authors, inherits the pipeline's trust output.
- **Instructor / Educator (INSTRUCTOR)** — creates and vets machine-verified topics before assigning them to a cohort; reads the draft trust bar but cannot change trust states.
- **Subject-Matter Expert / Content Reviewer (SME-REVIEWER)** — receives the finished-but-*draft* ledger; closes Unsupported rows and triggers re-verification; disposes of what the Skeptic proposes.
- **Verification Pipeline (VERIFY-PIPELINE)** — system orchestrator of the six stages; produces sources, atomic claims, and draft source-based trust states.
- **The Skeptic (SKEPTIC-AI)** — stage 6 red-teamer; raises Disputed/Interpretive conflicts; runs hard mode on Pro/Teams.
- **Execution Sandbox (EXEC-SANDBOX)** — invoked at the Verify stage to prove computational claims empirically; owns Verified·execution.
- **Guest / Visitor (GUEST)** — may trigger an ephemeral demo pipeline on a canned topic to evaluate the trust claim; persists nothing.
- **Platform Administrator (PLATFORM-ADMIN)** — operates the pipeline, sandbox, and Skeptic model rollouts; can restart infra but cannot read or alter epistemic content.
- **Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD)** — defends the pipeline against prompt-injection, abusive topics, and fabricated-source gaming.
- **Support Agent (SUPPORT-AGENT)** — unbreaks stuck or failed pipelines under scoped consent; cannot fabricate a verification result.
- **Compliance / Data-Protection Officer (COMPLIANCE-DPO)** — governs topic-content retention and unsafe-content policy; advisory over data, never over truth.
- **Accessibility-Reliant Learner (A11Y-LEARNER)** — runs creation and monitors the pipeline via assistive tech; the pipeline's live, color-coded, timed progress is a real stress test.
- **Organization / Teams Admin (ORG-ADMIN)** — seeds the shared topic library by creating topics at scale; owns the topic ceiling policy but not trust states.

### User stories

- **[VERIFY-01] As a Self-directed Learner (LEARNER-SELF), I want a New Topic form that asks the topic, my starting level, and my goal, so that the lecture is written and pitched for me rather than generically generated.** — *Priority:* MVP — *Why this priority:* This is the single entry point to the entire product loop; nothing downstream exists without it.
  - *Acceptance criteria:*
    - Three labeled fields are present and ordered: (1) topic (free text), (2) "where you're starting from" (free text), (3) goal (quick-pick pills Intuition / Implement / Use it / Interview, plus a custom option).
    - Field 1 drives triage and source retrieval; field 2 sets the level/jargon anchor; field 3 shapes task and lecture emphasis.
    - A "What happens next" preview lists the six pipeline stages before the learner commits.
  - *Business rules / validation:* Topic requires ≥3 characters after trim; level requires a non-trivial answer (>3 chars); goal must be selected. Free text is retained as the topic spec of record for re-verification.
  - *Failure & edge cases:* Empty or whitespace-only fields keep the submit disabled (see VERIFY-02); pasting an entire textbook chapter into the topic field is truncated/flagged rather than accepted verbatim.

- **[VERIFY-02] As a Self-directed Learner (LEARNER-SELF), I want the "Start verifying" button disabled with a clear hint until all three fields are valid, so that I never launch a pipeline that will mis-triage on a half-empty spec.** — *Priority:* MVP — *Why this priority:* The validation gate is the pipeline's first quality guarantee and a named product invariant.
  - *Acceptance criteria:*
    - Submit is visually and functionally disabled until topic, level, and goal all pass validation.
    - Attempting to submit early (or the tried-state) surfaces inline, per-field hints naming exactly what is missing (e.g. "Add a bit more detail (3+ characters)").
    - When all three become valid, the button flips to an enabled "Ready to verify → Start verifying" state.
  - *Business rules / validation:* Client-side gate must be re-checked server-side; the pipeline refuses to start on a spec that fails validation even if the client is bypassed.
  - *Failure & edge cases:* Rapid double-click submits exactly one pipeline run (idempotent); if the network drops on submit, show an inline retry, not a silent no-op.

- **[VERIFY-03] As a Self-directed Learner (LEARNER-SELF), I want popular-topic and example quick-picks on the New Topic screen, so that I can start a verified lecture in one tap without composing a spec from scratch.** — *Priority:* Should-Have — *Why this priority:* Reduces first-topic friction and demonstrates the trust ledger on known-good content; strong adoption lever, not blocking.
  - *Acceptance criteria:*
    - A "Popular:" row offers seed topics (e.g. TCP/IP, Binary trees, Bloom filters) that pre-fill field 1.
    - Selecting a quick-pick still requires level + goal (or supplies sensible defaults the learner can edit) before submit enables.
    - Quick-picks route through the identical validation gate and pipeline as free-text topics — no shortcut around verification.
  - *Business rules / validation:* Quick-pick topics are curated to be verifiable; they never bypass triage.
  - *Failure & edge cases:* If a curated example's cached lecture is unavailable, the topic still runs a fresh pipeline rather than showing a broken link.

- **[VERIFY-04] As a Self-directed Learner (LEARNER-SELF), I want to watch the six pipeline stages execute with their real status, so that I trust the verification is actually happening instead of staring at a spinner.** — *Priority:* MVP — *Why this priority:* "Transparency, not a spinner" is the differentiating experience of the whole spine.
  - *Acceptance criteria:*
    - The Pipeline screen lists all six stages (Triage, Retrieve sources, Write the lecture, Verify each claim, Skeptic) each with a state of Done / Running / Waiting and a one-line detail (e.g. "Scoped to beginner · 4 sections planned").
    - A live overall progress indicator (percentage + elapsed time) and a headline ("Building your verified lecture") update as stages complete.
    - Running counters surface interim results (sections drafted, sources found, claims verified, claims disputed) as they accrue.
  - *Business rules / validation:* Stage order is fixed and sequential; a later stage never reports Done before an earlier one. Displayed detail reflects actual pipeline output, not canned copy.
  - *Failure & edge cases:* If a stage stalls, its state must move to a failed/paused indicator rather than spin as Running forever (see VERIFY-15); progress never runs backward except on an explicit re-run.

- **[VERIFY-05] As an Exam-prep Student (LEARNER-EXAM), I want the pipeline to run in the background so I can leave the page and return to a finished lecture, so that I am not blocked waiting on verification against my deadline.** — *Priority:* MVP — *Why this priority:* Non-blocking, closable verification is a core promise on the New Topic screen and essential to the loop's ergonomics.
  - *Acceptance criteria:*
    - The Pipeline screen states the learner may leave; navigating away does not cancel the run.
    - The topic appears in the Library in a "running/verifying" state showing its current stage, and flips to "ready" with a colored trust bar on completion.
    - A notification (or Library badge) marks the topic ready when the learner is elsewhere.
  - *Business rules / validation:* Pipeline runs are server-side jobs, not tied to the browser tab; closing the tab or logging out does not kill the job.
  - *Failure & edge cases:* If the learner starts more topics than the plan allows while others run, enforce the cap at submit time (see VERIFY-06); if the job dies server-side, the Library card shows failed, not permanently "running."

- **[VERIFY-06] As a Self-directed Learner (LEARNER-SELF), I want to be told when I hit the Free 3-active-topic limit with a clear path to upgrade, so that I understand the boundary instead of hitting a silent failure.** — *Priority:* MVP — *Why this priority:* The topic cap is the primary Free→Pro monetization boundary and must be enforced at creation.
  - *Acceptance criteria:*
    - On a Free plan with 3 active topics, attempting a 4th blocks submission and shows an upgrade nudge ("unlimited topics on Pro").
    - The nudge explains the limit counts *active* topics and offers a route to archive/delete an existing topic as an alternative to upgrading.
    - Pro and Teams accounts see no cap.
  - *Business rules / validation:* "Active" = any topic not archived/deleted, including ones mid-pipeline. Free = 3; Pro/Teams = unlimited. The cap is enforced server-side, not just hidden in the UI.
  - *Failure & edge cases:* A topic whose pipeline failed still counts as active until the learner clears it; concurrent submissions that would exceed the cap are rejected atomically (no race past the limit).

- **[VERIFY-07] As the Verification Pipeline (VERIFY-PIPELINE), I want to triage each topic spec for scope, level, and feasibility, so that the lecture is pitched correctly and infeasible topics are caught before wasting downstream work.** — *Priority:* MVP — *Why this priority:* Mis-triage poisons every downstream stage; correct scoping is the pipeline's first substantive job.
  - *Acceptance criteria:*
    - Triage outputs a scoped plan (level anchor + section count) derived from fields 1 and 2, shown as the stage detail.
    - Topics that are too broad, ambiguous, or unteachable are flagged for narrowing rather than silently over-scoped.
    - Triage never proceeds to retrieval on a spec that failed the creation validation gate.
  - *Business rules / validation:* Triage sets the level anchor that governs jargon depth in later stages; it cannot certify claims (that is Verify/Skeptic/Sandbox).
  - *Failure & edge cases:* An unteachable/nonsense topic ("teach me everything") returns a "let's narrow this" state, not a failed run; a disallowed/unsafe topic is refused at triage (see VERIFY-19).

- **[VERIFY-08] As the Verification Pipeline (VERIFY-PIPELINE), I want to retrieve real, citable sources and attach them to the topic, so that later stages can match claims to documented references rather than inventing support.** — *Priority:* MVP — *Why this priority:* Retrieval is the foundation of Verified·source / Sourced; without real sources the trust ledger is theater.
  - *Acceptance criteria:*
    - The Retrieve stage gathers a set of sources (books, papers, sandbox, web) and reports the count and identity (e.g. "4 sources gathered · CLRS, Skiena, sandbox, web").
    - Each retrieved source is typed and status-tagged (attached / retrieved / verified) and becomes a column in the coverage matrix.
    - Sources are stored so claims can later be re-matched during re-verification.
  - *Business rules / validation:* Retrieved citations must resolve to real references; the pipeline may not fabricate a citation to make a claim look supported.
  - *Failure & edge cases:* If zero credible sources are found, downstream claims are drafted **Unsupported** honestly rather than dressed up; a source-retrieval timeout fails the run cleanly (VL-503, see VERIFY-15) rather than proceeding on nothing.

- **[VERIFY-09] As the Verification Pipeline (VERIFY-PIPELINE), I want to write honest lecture prose that flags its own confidence, so that the learner reads material that is candid about what is proven versus merely plausible.** — *Priority:* MVP — *Why this priority:* Honest teaching prose is what the trust states annotate; the lecture must be authored to be verifiable claim-by-claim.
  - *Acceptance criteria:*
    - The Teach stage drafts sections (showing progress, e.g. "Drafting §2 Implementation…") pitched to the triaged level.
    - Prose is written so that individual factual assertions are separable for decomposition, not woven into unfalsifiable narrative.
    - The stage detail reports sections drafted; the count feeds the completion summary.
  - *Business rules / validation:* No claim is shown to the learner until it has passed through Verify and Skeptic (nothing unverified ships).
  - *Failure & edge cases:* If teaching produces content the decomposer cannot cleanly break into atomic claims, that is a decomposition defect surfaced for re-run rather than shipped.

- **[VERIFY-10] As the Verification Pipeline (VERIFY-PIPELINE), I want to decompose the lecture into atomic, individually-checkable claims, so that the Verify stage, Sandbox, and Skeptic each operate on units they can actually adjudicate.** — *Priority:* MVP — *Why this priority:* Decomposition quality determines whether every downstream verification is meaningful; bad decomposition invalidates the ledger.
  - *Acceptance criteria:*
    - Each lecture section yields a set of atomic claims, each phrased so a single source-match or assertion can prove or contest it.
    - Claims are neither too coarse to verify nor too fine to matter; each becomes a row in the coverage matrix.
    - The claim set is complete enough that the coverage matrix does not under-count the assertions actually made in the prose.
  - *Business rules / validation:* Every decomposed claim must end the pipeline with exactly one of the five trust states — none left untagged.
  - *Failure & edge cases:* Silent coverage gaps (a prose assertion with no matching claim row) are a defect; the pipeline should flag suspected under-decomposition rather than present a falsely clean matrix.

- **[VERIFY-11] As the Verification Pipeline (VERIFY-PIPELINE), I want the Verify stage to match each claim to a source and invoke the Execution Sandbox for computational claims, so that each claim earns a draft trust state grounded in real evidence.** — *Priority:* MVP — *Why this priority:* The Verify stage is where draft trust states are actually assigned — the substance behind the trust bar.
  - *Acceptance criteria:*
    - Each claim is matched against retrieved sources → **Verified·source** (matched to a cited reference) or **Sourced** (cited, not independently proven) or **Unsupported** (no source found).
    - Computational claims are routed to the Execution Sandbox for empirical proof (see VERIFY-12).
    - The stage reports a running "N claims matched to sources" and populates the coverage matrix cells.
  - *Business rules / validation:* The pipeline may assign only draft source-based states (Verified·source / Sourced / Unsupported); it **cannot** assign Verified·execution (sandbox only) or finalize Disputed/Interpretive (Skeptic proposes, SME disposes).
  - *Failure & edge cases:* A claim that matches a source the retrieval stage hallucinated must not be silently promoted to Verified·source (see VERIFY-16); an unmatched claim stays honestly Unsupported.

- **[VERIFY-12] As the Execution Sandbox (EXEC-SANDBOX), I want to run code and check assertions for computational claims, so that I can emit Verified·execution for passing claims and raise a reproducible Conflict for failing ones.** — *Priority:* MVP — *Why this priority:* Verified·execution is the strongest, uniquely differentiated trust state and the only one grounded in demonstration rather than citation.
  - *Acceptance criteria:*
    - Claims with attached code/assertions are executed; passing assertions produce **Verified·execution**.
    - A failing assertion raises a computational Conflict carrying the reproducible failing trace (not merely an argument).
    - Runs are deterministic, resource-bounded, and network-isolated.
  - *Business rules / validation:* The sandbox owns Verified·execution exclusively; it refuses to emit a pass it cannot demonstrate rather than faking one. No pipeline stage may assign Verified·execution on the sandbox's behalf.
  - *Failure & edge cases:* Sandbox timeout/OOM/crash yields a "could not verify by execution" state (claim falls back to source-based or Unsupported), never a false pass; non-terminating code is killed by the resource bound; a sandbox escape attempt is contained and reported to Trust & Safety.

- **[VERIFY-13] As the Skeptic (SKEPTIC-AI), I want to red-team every decomposed claim and flag overreach as Disputed or Interpretive, so that no claim ships as settled fact when it is actually contested.** — *Priority:* MVP — *Why this priority:* The Skeptic is the actor the product is named after and the final quality gate of the spine.
  - *Acceptance criteria:*
    - Stage 6 stress-tests each claim; overreaching claims are flagged **Disputed** (becomes an adjudicable Conflict) and genuinely-contested ones **Interpretive** (positions mapped, not certified).
    - The canonical catch works: an over-broad claim (e.g. "Dijkstra works on any weighted graph") is flagged for its counterexample (negative weights) rather than passed.
    - The pipeline completion summary honestly reports disputed counts (e.g. "1 claim disputed · flagged, not hidden").
  - *Business rules / validation:* The Skeptic *proposes* Disputed/Interpretive; it cannot itself certify Verified, resolve its own Conflicts, or finalize a state — an SME disposes. Disputed claims are excluded from tests until resolved.
  - *Failure & edge cases:* If the Skeptic stalls mid-stage, the run fails cleanly rather than shipping unchecked claims ("we'd rather stop than guess"); over-flagging pedantic noise is a quality regression tracked against the hard-mode tuning.

- **[VERIFY-14] As a Skeptical / Expert Learner (LEARNER-SKEPTIC), I want to run the Skeptic on hard mode when I create a Pro topic, so that maximum scrutiny is applied and I can trust the verifier against my own expertise.** — *Priority:* Should-Have — *Why this priority:* Hard mode is a headline Pro entitlement and the feature the expert persona upgrades for.
  - *Acceptance criteria:*
    - Pro/Teams accounts can enable hard-mode Skeptic on a topic's pipeline; the setting is visible before/at creation.
    - Hard mode applies deeper scrutiny (more claims probed, stricter overreach thresholds) and its use is reflected in the pipeline run.
    - Free accounts see hard mode as a locked/upsell affordance, not an error.
  - *Business rules / validation:* Hard mode is withheld from Free (monetization boundary); it raises scrutiny but still cannot finalize disputes or certify.
  - *Failure & edge cases:* Downgrading from Pro to Free does not retroactively strip a topic already verified on hard mode; a hard-mode run that over-produces conflicts surfaces them all rather than hiding to look clean.

- **[VERIFY-15] As a Self-directed Learner (LEARNER-SELF), I want a clear, recoverable failure state when verification cannot complete, so that I know nothing unverified reached me and I can retry or leave.** — *Priority:* MVP — *Why this priority:* Failed verification is an expected state that must uphold the "nothing unchecked is shown" promise; a required failure-path story.
  - *Acceptance criteria:*
    - A stalled/timed-out pipeline shows an on-brand "We couldn't finish verifying" state naming the stage that failed and reassuring that "nothing unverified was shown to you."
    - Exactly two forward actions are offered: "Retry verification" and "Back to library," plus an error code (e.g. VL-503 · sources timed out) and a support link.
    - The partially-built topic does not appear as a readable lecture; it stays in a failed/incomplete state in the Library.
  - *Business rules / validation:* On failure, no partially-verified claims are exposed as if complete; retry re-runs from a safe point (re-triage or resume), not from a corrupted partial state.
  - *Failure & edge cases:* Repeated failures on the same topic escalate to a support path; a failed topic still counts against the Free cap until cleared (consistent with VERIFY-06).

- **[VERIFY-16] As the Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD), I want the pipeline to guard against fabricated citations and source hallucination, so that an Unsupported claim can never masquerade as Verified·source.** — *Priority:* MVP — *Why this priority:* Source hallucination is the pipeline's worst failure — it corrupts the ledger's integrity and fools the Skeptic downstream; a required failure-scenario story.
  - *Acceptance criteria:*
    - Retrieved citations are validated to resolve to real references before any claim is tagged Verified·source against them.
    - A claim whose only "support" is an unresolvable/fabricated citation is held at Unsupported (or Sourced-pending) rather than promoted.
    - Suspected fabricated sources are logged for review and can be quarantined.
  - *Business rules / validation:* No trust state above Sourced may rest on an unverifiable citation; the pipeline's Unsupported rows must stay honest and must not be papered over.
  - *Failure & edge cases:* A source that resolves but does not actually support the claim (mismatched citation) is downgraded on detection; a systematic hallucination pattern from a model version is flagged to Platform Admin for the rollout to be paused (see VERIFY-20).

- **[VERIFY-17] As a Subject-Matter Expert / Content Reviewer (SME-REVIEWER), I want re-verification to run when I shore up a source or an Unsupported row is closed, so that the affected claims and the trust bar update without re-authoring the whole topic.** — *Priority:* Should-Have — *Why this priority:* The draft ledger is explicitly finished-but-draft; re-verification is how human review and community promotion feed back into trust states.
  - *Acceptance criteria:*
    - Attaching/promoting a source or closing an Unsupported row triggers a targeted re-match of only the affected claims.
    - The topic's coverage matrix, affected trust states, and colored trust bar update on completion; other claims are untouched.
    - The re-run is visible as a lightweight pipeline pass, not a full-topic regeneration.
  - *Business rules / validation:* The pipeline may re-match to draft states but cannot override an SME's explicit re-tag; a community reply becomes a source only after SME promotion (governed elsewhere), then re-verification runs.
  - *Failure & edge cases:* A re-run that would downgrade a previously-Verified claim surfaces the downgrade honestly rather than suppressing it; concurrent SME edits and a re-run are serialized so the ledger never ends in a torn state.

- **[VERIFY-18] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want the pipeline's live progress conveyed non-visually, so that I can follow verification without relying on color, position, or animation.** — *Priority:* Should-Have — *Why this priority:* The pipeline's progress is encoded in color/motion/time; without an accessible channel the whole creation flow excludes assistive-tech users — a named core stress test.
  - *Acceptance criteria:*
    - Stage state changes (Waiting → Running → Done) and overall progress are announced via live regions to screen readers, not signaled by color alone.
    - Every stage state has a text/aria label; the completion event ("your verified lecture is ready") is announced.
    - No creation step depends on a hover-only or timed-only interaction the learner cannot trigger via keyboard/AT.
  - *Business rules / validation:* Conforms to the platform accessibility bar; the pipeline may run in background but its status must remain queryable by AT at any time.
  - *Failure & edge cases:* If live-region updates would flood (six rapid transitions), they are throttled/coalesced into meaningful announcements rather than spamming; failure states are announced with the same prominence as success.

- **[VERIFY-19] As the Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD), I want the pipeline to refuse unsafe or abusive topic specs and resist prompt injection, so that the Skeptic and lecture cannot be weaponized to emit harmful or manipulated content.** — *Priority:* Should-Have — *Why this priority:* A verification-first product is a high-value target for prompt-injection and abuse; refusing at triage protects ledger integrity — a required failure/abuse story.
  - *Acceptance criteria:*
    - Disallowed/unsafe topics are refused at triage with a policy message, before retrieval or teaching runs.
    - Injection attempts embedded in the topic/level fields (e.g. instructions to the Skeptic to auto-certify) are neutralized and do not alter trust-state assignment.
    - Abuse attempts are logged and rate-limited; repeated abuse can freeze topic creation for the actor.
  - *Business rules / validation:* No user-supplied text can instruct the pipeline to certify a claim, bypass the Skeptic, or emit Verified·execution; content policy is enforced independent of the epistemic verdict.
  - *Failure & edge cases:* A borderline topic is allowed but watched; a confirmed injection that reached a trust state triggers quarantine of the affected claims and a Trust & Safety review; refusal never leaks the policy internals that would help an attacker.

- **[VERIFY-20] As a Platform Administrator (PLATFORM-ADMIN), I want to operate and roll out the pipeline, sandbox, and Skeptic models without reading or altering epistemic content, so that I can keep verification running while remaining unable to hand-certify anything.** — *Priority:* Should-Have — *Why this priority:* The system needs an operator for reliability and model rollouts, but the trust guarantee requires that operator be firewalled from truth.
  - *Acceptance criteria:*
    - Admin can restart stuck jobs, scale capacity, and roll out/roll back Skeptic and sandbox model versions.
    - Admin actions are logged; admin cannot set or edit any claim's trust state, source, or conflict resolution.
    - A model rollout records which pipeline version verified each topic, enabling audit and targeted re-verification.
  - *Business rules / validation:* PLATFORM-ADMIN is technically all-powerful over infra yet has zero epistemic write access; a rollout cannot silently change existing ledgers without a tracked re-verification.
  - *Failure & edge cases:* A bad model rollout that raises hallucination rates can be rolled back and affected topics flagged for re-verification; a partial rollout must not leave two topics in incomparable trust states without a version tag.

- **[VERIFY-21] As a Support Agent (SUPPORT-AGENT), I want to unblock a stuck or failed pipeline under scoped consent, so that a learner's topic completes without me ever fabricating a verification result.** — *Priority:* Should-Have — *Why this priority:* Stuck pipelines are a real operational failure that support must resolve, within a strict firewall against inventing trust signals.
  - *Acceptance criteria:*
    - With the learner's scoped consent, support can restart or re-queue a failed/stuck pipeline job for that topic.
    - Support actions are audit-logged and limited to operational recovery; support cannot set trust states, mark claims verified, or edit the coverage matrix.
    - After a support-triggered re-run, the topic completes through the normal stages (nothing is short-circuited to "ready").
  - *Business rules / validation:* Support is firewalled from ever fabricating a learning signal; the only path to "ready" is a genuine pipeline completion.
  - *Failure & edge cases:* If a re-run keeps failing, support escalates to Platform Admin rather than manually flipping the topic ready; consent scope is enforced so support cannot touch unrelated topics.

- **[VERIFY-22] As a Guest / Visitor (GUEST), I want to trigger an ephemeral demo pipeline on a canned topic, so that I can see the trust ledger get built in minutes before deciding to sign up.** — *Priority:* Nice-to-Have — *Why this priority:* The pipeline *is* the pitch; letting an evaluator watch it run converts, but it is a marketing surface, not core loop.
  - *Acceptance criteria:*
    - An unauthenticated visitor can run a demo of the six stages on a pre-canned topic and see resulting trust states and a coverage matrix.
    - The demo persists nothing to an account and clearly labels itself as a preview.
    - A conversion CTA appears at completion (sign up to author your own verified topics).
  - *Business rules / validation:* Demo runs are rate-limited and ephemeral; they consume no user quota and create no durable topic; hard mode is not offered to guests.
  - *Failure & edge cases:* Abuse of the demo endpoint (scraping the pipeline for free compute) is rate-limited/throttled; if the demo backend is unavailable, show a static recorded walkthrough rather than a broken pipeline.

- **[VERIFY-23] As an Instructor / Educator (INSTRUCTOR), I want to create and vet a machine-verified topic before assigning it to my cohort, so that I can trust its trust bar without being able to alter any trust state myself.** — *Priority:* Nice-to-Have — *Why this priority:* Teams instructors curate rather than author at volume; important for Teams but downstream of the core creation flow.
  - *Acceptance criteria:*
    - An instructor can run the full pipeline on a topic, review the resulting trust bar, coverage matrix, and disputed claims before assigning.
    - The instructor can request SME review / re-verification on weak (Unsupported-heavy) topics but cannot flip trust states themselves.
    - A vetted topic can be published into the shared Teams library for LEARNER-TEAM to inherit.
  - *Business rules / validation:* Instructors hold pedagogical authority, not epistemic authority — they cannot change trust states or certify; that stays with the sandbox/Skeptic/SME.
  - *Failure & edge cases:* Assigning a topic with unresolved disputes warns the instructor (those claims are test-excluded); a topic that fails verification cannot be published to the cohort library.

### Business rules & invariants

- **Validation gate first.** No pipeline may start until topic (≥3 chars), level (non-trivial), and goal are all supplied; enforced server-side, not just in the UI.
- **Nothing unverified ships.** No claim is shown to a learner until it has passed Verify and Skeptic. On any failure the product stops rather than guesses ("we'd rather stop than guess").
- **Fixed six-stage order.** Triage → Retrieve → Teach → Decompose → Verify → Skeptic runs sequentially; a later stage never completes before an earlier one.
- **Every claim ends tagged.** Each decomposed claim terminates the pipeline with exactly one of the five trust states — Verified·execution, Verified·source, Sourced, Disputed, Unsupported, Interpretive — none untagged.
- **Authority boundaries are hard.** The pipeline may assign only draft source-based states (Verified·source / Sourced / Unsupported). Only the Sandbox emits Verified·execution. Only the Skeptic proposes Disputed/Interpretive, and only an SME finalizes them. No infra/support/instructor actor can hand-certify.
- **Honest Unsupported rows.** Claims with no real supporting source stay Unsupported and visible; they are never dressed up, and no trust state above Sourced may rest on an unverifiable citation.
- **Disputed excludes from tests.** A Disputed claim is withheld from formal tests until resolved.
- **Background, closable, resumable.** Pipeline runs are server-side jobs independent of the browser; leaving the page never cancels a run; failed runs are retryable from a safe point.
- **Plan boundaries.** Free = 3 active topics, no Skeptic hard mode; Pro/Teams = unlimited topics + hard mode. "Active" counts any non-archived topic including in-flight and failed ones. Enforced atomically.
- **Traceability & versioning.** Every claim is traceable to a specific source or explicitly Unsupported; each verified topic records the pipeline/model version that produced it, enabling audit and targeted re-verification.

### Cross-domain dependencies

- **Provides to Lecture (Learn):** the honest prose, per-claim trust states, and the in-lecture underlines/ledger entries the learner reads.
- **Provides to Conflicts:** Disputed (Skeptic) and computational (Sandbox) conflicts, each with competing positions or a reproducible failing trace, to be adjudicated.
- **Provides to Sources:** the attached, typed, status-tagged sources and the populated claims × sources coverage matrix (including the honest empty rows).
- **Provides to Library/Home:** the topic's running-stage state and, on completion, the colored trust bar and ready state; drives Library counters and the ready notification.
- **Provides to Tests:** the verified/sourced claim base tests draw from (and the disputed set they must exclude).
- **Provides to Gap Map:** origin links so lecture/task/test misses jump back to the exact verified section.
- **Consumes from Monetization/Billing (ORG-ADMIN / BILLING-ADMIN):** the plan entitlement that sets the topic cap and hard-mode access.
- **Consumes from SME/Community:** promoted sources and closed Unsupported rows that trigger re-verification; SME finalization of proposed Disputed/Interpretive states.
- **Consumes from Platform Admin:** model rollouts/rollbacks and infra recovery for the pipeline, sandbox, and Skeptic.
- **Consumes from Trust & Safety / Compliance:** content-policy and injection-defense rules applied at triage; topic-content retention governance.

### Key technical requirements

- **Durable async job orchestration.** Six-stage pipeline as a resumable, background, server-side job with per-stage state, live progress streaming to the client, and idempotent submission (one run per submit, safe double-click).
- **Latency budget.** Target "usually ready in under a minute" for typical topics while remaining honest about the wait via the live stage display; graceful degradation and clean timeout (VL-503 class) rather than an infinite spinner.
- **Real source retrieval + citation validation.** Retrieval across corpora (books, papers, web, sandbox) with a validation layer that resolves citations to real references and detects mismatched/hallucinated sources before any Verified·source tag.
- **Isolated execution sandbox.** Deterministic, resource-bounded, network-isolated code execution with reproducible traces; safe against non-terminating code, OOM, and escape attempts; refuses rather than fakes a pass.
- **AI cost & model management.** Multiple model calls per topic (teach, decompose, verify, Skeptic, hard mode); cost controls, rate limiting (esp. guest demo), hard-mode gating by plan, and per-topic model-version tagging for audit/rollback.
- **Prompt-injection defense.** Field content sanitization and instruction-isolation so user text cannot direct the Skeptic/pipeline to certify, bypass stages, or emit Verified·execution.
- **Coverage-matrix data model.** Claims × sources grid with per-cell provenance, honest empty rows, and support for targeted re-match on source changes without full regeneration; serialized against concurrent SME edits.
- **Trust-state integrity & authorization.** Strict write-scoping so only the correct actor can set each trust state; complete audit log of every state assignment, re-verification, admin rollout, and support recovery.
- **Accessibility.** Live-region announcements for stage transitions and completion/failure, non-color/non-motion status encoding, and full keyboard/AT operability of the creation flow.

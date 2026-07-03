## Lecture & Active-Listening Learning Experience

### Overview

This domain owns the **Lecture tab of the Topic Workspace** — the reading surface where a learner actually consumes a verified topic — together with the **active-listening gate system** that punctuates it (predict → pause-point → cloze → connection → close) and the **in-lecture rendering of the trust ledger** (claims underlined by trust level, the per-section trust bar, and the side-rail claim detail that exposes evidence, source, and confidence).

It is, in the words of the design, "the heart of the product." Everything upstream — topic creation, the six-stage verification pipeline, the Skeptic, the execution sandbox — exists to produce the artifact this domain renders: honest prose whose every load-bearing sentence carries a trust state traceable to a source. This is where the product thesis stops being a promise and becomes a felt experience. A learner reading here can see, *while they read*, which sentences are proven by running code, which are merely sourced, which are disputed, and which have no backing at all. Trust is not a report they read afterward; it is underlined under the words.

The domain has two jobs that must not blur:

1. **Render trust, never mutate it.** The Lecture tab is strictly read-only with respect to the ledger. Reading a claim, clicking it, or completing a gate never certifies a claim, resolves a conflict, or changes a trust state. It consumes the ledger produced by the Verification Pipeline / Skeptic / Execution Sandbox and points at the domains (Conflicts, Sources) where adjudication actually happens.
2. **Make passive reading impossible.** Active-listening gates force the learner to predict, recall, connect, and explain. The **close gate is a hard gate** — the only one in this domain that locks progression: "Next section" stays disabled until the learner submits an end-of-section explanation. The other four prompts are soft and individually configurable.

Because this is the most content-dense, most-read, and most trust-critical surface in the app — and because its trust signal is encoded in color, spatial position, and timed interaction — its accessibility and reliability bar is unusually high.

### Personas involved

- **Self-directed Learner (LEARNER-SELF)** — primary. Runs the full read-through: hits every gate, clicks claims, and experiences the close gate as the core friction/engagement mechanic on Free's 3 topics.
- **Exam-prep Student (LEARNER-EXAM)** — reads under deadline pressure; wants dense sections, fast section-jumping, and deep-links back into the exact paragraph a test/gap flagged, while still being held by gates.
- **Returning Power-Learner (LEARNER-POWER)** — re-opens lectures mid-way, resumes where they left off, and re-reads specific sections surfaced by review or the Gap Map across a large portfolio.
- **Skeptical / Expert Learner (LEARNER-SKEPTIC)** — the stress-tester of the trust rendering: clicks every underlined claim, reads the evidence/confidence, runs **Skeptic hard mode** (Pro) which increases the density of disputed/interpretive flags inline, and follows the "Tap Conflicts to resolve" deep-link out.
- **Team Seat Learner (LEARNER-TEAM)** — reads inside a shared, pre-curated topic library and **inherits** its trust states rather than generating them; sees the same ledger the curator saw.
- **Accessibility-Reliant Learner (A11Y-LEARNER)** — core stress case, not an edge case: the trust ledger's color/spatial/timed encoding, the clickable claim spans, and the gated "Next" button must all work under assistive tech.
- **Guest / Visitor (GUEST)** — meets an **ephemeral demo lecture** (a pre-verified showcase such as Dijkstra) to see the inline trust ledger in one click before converting; persists nothing.
- **Instructor / Educator (INSTRUCTOR)** — previews the lecture a cohort will read; has pedagogical authority but **cannot change any trust state** from here — read-only like everyone else.
- **The Skeptic (SKEPTIC-AI)** — *system persona*. Supplies the inline disputed/interpretive flags and hard-mode density that this domain renders; cannot itself certify or resolve.
- **Execution Sandbox (EXEC-SANDBOX)** — *system persona*. Supplies the `Verified · execution` evidence (e.g. "ran on 12 sample graphs") shown in the side-rail claim detail.
- **Verification Pipeline (VERIFY-PIPELINE)** — *system persona*. Produces the entire input to this domain: the prose, section structure, decomposed claims, trust states, and sources. Referenced, not redefined, here.

### User stories

- **[LEARN-01] As a Self-directed Learner (LEARNER-SELF), I want the lecture to open with clear orientation to what I'm about to read and how trusted it is, so that I start reading knowing this content has been verified.** — *Priority:* MVP — *Why this priority:* The first lecture open is where a new user first sees the trust ledger applied to real prose; it carries the value proposition.
  - *Acceptance criteria:*
    - On open, the header shows topic title, subject/level, an overall percent-verified figure (e.g. "83% verified"), and a trust summary line ("3 verified · 2 sourced · 1 disputed").
    - A section strip shows all sections (e.g. Prereqs → §1 Core → §2 Impl → §3 Limits) with the current one highlighted and completed ones marked done.
    - A progress indicator shows "Section N of M" and percent complete.
  - *Business rules / validation:* The overall percent and counts are read from the topic's ledger, never computed or rounded up by this surface. Section order is the pipeline-authored teaching order.
  - *Failure & edge cases:* If the topic has zero verified claims (all unsupported/disputed) the header must not display a celebratory "verified" chip — it shows an honest low/zero figure and a warning treatment.

- **[LEARN-02] As a Self-directed Learner (LEARNER-SELF), I want the load-bearing claims in the prose underlined by their trust level, so that I can tell a proven fact from a plausible guess while I read.** — *Priority:* MVP — *Why this priority:* Inline trust underlining is the single most differentiating interaction in the product.
  - *Acceptance criteria:*
    - Each decomposed claim in the running text is visually underlined and color-coded by its trust state (verified-execution, verified-source, sourced, unsupported, disputed, interpretive).
    - Non-claim connective prose is not underlined — only ledger-backed claims are marked, so the encoding stays meaningful.
    - Every underlined claim is individually focusable and activatable (click, Enter, or Space).
  - *Business rules / validation:* A span may be underlined only if it maps to a real ledger claim ID; there is a 1:1 mapping between an underlined span and a ledger entry. Color alone never carries the state (see LEARN-15) — a glyph/label accompanies it in the detail.
  - *Failure & edge cases:* If the pipeline produced prose but claim-to-text anchoring failed for a sentence, that sentence renders as plain text (unmarked) rather than mis-underlined; a claim with no resolvable state renders as `Unsupported`, never as a default "verified."

- **[LEARN-03] As a Skeptical / Expert Learner (LEARNER-SKEPTIC), I want clicking a claim to open its ledger entry in the side rail with evidence, source, and confidence, so that I can audit the basis for every statement without leaving the lecture.** — *Priority:* MVP — *Why this priority:* The claim → evidence drill-down is what makes trust auditable rather than decorative.
  - *Acceptance criteria:*
    - Selecting a claim populates a side-rail "Selected claim" panel with the claim text, a trust badge (icon + label), the backing source (title + location/description + type icon), and a confidence value (e.g. "High · 0.94").
    - A `Verified · execution` claim shows the sandbox evidence (e.g. "Ran on 12 sample graphs — the greedy pick held every time"); a `Verified · source` / `Sourced` claim shows the cited reference (e.g. "CLRS · §24.3, page 661").
    - The selected claim is visually highlighted in the prose while its detail is shown.
  - *Business rules / validation:* The panel is read-only — it exposes provenance but offers no control to alter a trust state. Confidence and source come verbatim from the ledger.
  - *Failure & edge cases:* A `Disputed` claim with no supporting source shows a "No source backs this — the Skeptic flagged it" state with a route to Conflicts, not an empty panel (see LEARN-12); if evidence is still loading, show a skeleton, never a fabricated source.

- **[LEARN-04] As a Self-directed Learner (LEARNER-SELF), I want a per-section trust breakdown in the side rail, so that I can see how much of the section I'm reading right now is actually established.** — *Priority:* MVP — *Why this priority:* Section-level trust is the honest counterweight to fluent prose; it tells the learner where to be skeptical.
  - *Acceptance criteria:*
    - The side rail shows a segmented "Section trust" bar proportioned by trust state, plus a labeled count per state (Verified by execution: 3, Backed by a source: 2, Disputed: 1).
    - The breakdown reflects only the currently-open section and updates on section change.
    - Each labeled row uses the same color/glyph vocabulary as the inline underlines and the global trust states.
  - *Business rules / validation:* Counts are derived from the section's ledger claims; the sum of segments equals the section's claim count. This surface never re-tallies to a friendlier number.
  - *Failure & edge cases:* A section with a majority of disputed/unsupported claims still renders truthfully (the bar can be mostly red/amber) — the UI must not suppress or hide a "bad" section.

- **[LEARN-05] As a Returning Power-Learner (LEARNER-POWER), I want to navigate between sections with jump-chips and see my progress, so that I can move directly to the part I need across a long lecture.** — *Priority:* MVP — *Why this priority:* Section navigation and progress are table-stakes for any multi-section reader and enable the resume/deep-link flows.
  - *Acceptance criteria:*
    - Jump-chips list every section; completed sections are marked done (green), the current one is highlighted, and future ones are neutral.
    - Selecting a chip navigates to that section and updates the progress indicator and side-rail trust breakdown.
    - Progress reflects sections completed vs total.
  - *Business rules / validation:* Free navigation among *already-unlocked* sections is allowed; a section locked behind an unmet close gate (see LEARN-06) cannot be jumped into forward. Backward navigation to completed sections is always allowed.
  - *Failure & edge cases:* Jumping to a section whose content is still being generated by the pipeline shows that section's verifying/placeholder state, not a blank pane (see LEARN-21).

- **[LEARN-06] As a Self-directed Learner (LEARNER-SELF), I want "Next section" locked until I explain the section in my own words (the close gate), so that I can't sleepwalk through the material.** — *Priority:* MVP — *Why this priority:* The close gate is the signature active-listening mechanic and the domain's defining hard gate.
  - *Acceptance criteria:*
    - When the close gate is enabled, "Next section" is visibly disabled with an explanation ("Answer the prompt to unlock the next section") until a close response is submitted.
    - Submitting a valid close response unlocks "Next section" and marks the section's close item complete in the active-listening checklist.
    - The active-listening checklist in the side rail shows the close step's state (locked → completed).
  - *Business rules / validation:* The close gate requires submission, not correctness — it validates a minimum-length, non-trivial response; it does **not** rubric-grade (that is the Tasks domain). If the learner has disabled the close gate in Active-Listening settings, "Next" is not blocked. Once satisfied for a section, the gate stays satisfied on return.
  - *Failure & edge cases:* See LEARN-22 for empty/garbage abuse; if the submit request fails, the response is retained locally and the gate does not falsely unlock until the submission is durably recorded.

- **[LEARN-07] As a Self-directed Learner (LEARNER-SELF), I want to predict what a section will cover before it opens, so that my prediction can later be compared to reality and feed my calibration.** — *Priority:* Should-Have — *Why this priority:* Predict prompts are a strong metacognition lever and a calibration input, but the loop functions without them.
  - *Acceptance criteria:*
    - When enabled, a section opens with a "Predict before reading" prompt with a free-text input before the prose is fully revealed.
    - Submitting the prediction records it and reveals the section; the checklist marks "Predict the section" done.
    - The prediction is retained so it can be surfaced against the actual content and emitted to calibration signals.
  - *Business rules / validation:* Predict is a soft prompt — it can be skipped or turned off in settings and never blocks "Next." Predictions are per-section, per-learner.
  - *Failure & edge cases:* If the learner declines/skips (when allowed by frequency setting), the section still opens; a skipped predict is recorded as skipped, not as a wrong prediction, so calibration is not polluted.

- **[LEARN-08] As a Self-directed Learner (LEARNER-SELF), I want quick comprehension checks mid-section (pause-points), so that I catch a misunderstanding before it compounds.** — *Priority:* Should-Have — *Why this priority:* Pause-points improve retention and can seed misconceptions into the Gap Map, but are configurable and non-blocking.
  - *Acceptance criteria:*
    - When enabled, a short check appears mid-section; answering reveals immediate feedback anchored to the relevant claim/source.
    - The checklist marks "Pause-point check" done on completion.
    - A wrong answer may be emitted as a candidate lecture-origin misconception (routed to the Gap Map domain), tagged origin = lecture.
  - *Business rules / validation:* Soft prompt; frequency governed by the Active-Listening "prompt frequency" setting (Light/Balanced/Intensive). Does not block "Next."
  - *Failure & edge cases:* If the pause-point content failed to generate for a section, the section reads straight through without a broken/empty check block.

- **[LEARN-09] As a Self-directed Learner (LEARNER-SELF), I want fill-in-the-blank (cloze) prompts on key terms, so that I actively recall terminology instead of re-reading it.** — *Priority:* Should-Have — *Why this priority:* Cloze recall strengthens encoding but is optional (it ships default-off in settings) and non-blocking.
  - *Acceptance criteria:*
    - When enabled, a key term is blanked and the learner types it; a correct recall confirms, an incorrect one reveals the term and its source.
    - Cloze blanks target ledger-backed terms so the revealed answer is itself traceable.
    - Completion advances the active-listening checklist for the section.
  - *Business rules / validation:* Soft, configurable, non-blocking. The blanked term must come from a verified/sourced claim so the "answer" is defensible (never blank an unsupported/disputed term as if it were fact).
  - *Failure & edge cases:* Near-miss answers (case/whitespace/synonym) are accepted or softly corrected rather than hard-failed; repeated misses may seed a Gap-Map candidate rather than looping the learner.

- **[LEARN-10] As a Self-directed Learner (LEARNER-SELF), I want a connection prompt that asks me to relate the new idea to something I already know, so that I integrate it rather than memorize it in isolation.** — *Priority:* Nice-to-Have — *Why this priority:* Connection prompts deepen transfer but are the most optional of the five and easiest to defer.
  - *Acceptance criteria:*
    - When enabled, an end-of-idea prompt invites a free-text connection to prior knowledge.
    - Submitting records the response and advances the checklist.
  - *Business rules / validation:* Soft, configurable, non-blocking; responses are not graded for correctness.
  - *Failure & edge cases:* Empty submission is allowed to be skipped; a submitted connection is stored but never surfaced as a trust/ledger signal.

- **[LEARN-11] As a Returning Power-Learner (LEARNER-POWER), I want to turn each active-listening prompt type on/off and set how often prompts appear, so that I can tune the friction to my reading style.** — *Priority:* Should-Have — *Why this priority:* Configurability keeps the gates from feeling like busywork for advanced learners without weakening the recommended default.
  - *Acceptance criteria:*
    - Each prompt type (predict, pause-point, cloze, connection, close-gate) can be individually toggled; the close-gate is flagged "Recommended."
    - A "prompt frequency" control (Light / Balanced / Intensive) governs how densely soft prompts appear.
    - Changing settings applies to subsequently-read sections across all topics **without** re-running verification.
  - *Business rules / validation:* Settings are per-learner and global across their topics (this domain consumes the config owned by the Settings · Active Listening surface). Turning off the close-gate removes the only hard gate; at least the recommendation to keep it on is surfaced.
  - *Failure & edge cases:* If a learner disables every prompt, the lecture is still fully readable (pure prose + trust rendering); the app warns that recall checks are off but does not force any prompt back on.

- **[LEARN-12] As a Self-directed Learner (LEARNER-SELF), I want a disputed claim called out inline with why it's contested and a one-tap route to resolve it, so that I don't silently absorb an overreach.** — *Priority:* MVP — *Why this priority:* Surfacing disputes in the flow of reading (not hiding them) is central to "disagreement is a first-class object."
  - *Acceptance criteria:*
    - A disputed claim is rendered with a distinct callout ("⚠️ Disputed claim · the Skeptic flagged this") stating the specific reason (e.g. "this fails with negative edge weights").
    - The callout offers a direct action into the topic's Conflicts tab to adjudicate it.
    - The side-rail detail for a disputed, source-less claim shows "No source backs this" and the same route to Conflicts.
  - *Business rules / validation:* The Lecture tab can *route to* Conflicts but never resolve one — adjudication and any resulting trust-state change happen in the Conflicts domain. A disputed claim remains flagged inline until that domain records a resolution.
  - *Failure & edge cases:* If the linked conflict was already resolved elsewhere, the inline callout reflects the resolved state on next load rather than dead-linking; badge counts stay in sync with the Conflicts domain.

- **[LEARN-13] As a Skeptical / Expert Learner (LEARNER-SKEPTIC), I want an interpretive claim shown with its competing positions mapped inline, so that I see a genuinely contested point presented as positions, not certified fact.** — *Priority:* Should-Have — *Why this priority:* The interpretive state is a key honesty differentiator, but it appears on a minority of topics.
  - *Acceptance criteria:*
    - An `Interpretive` claim is visually distinct from both verified and disputed, and its detail maps the competing positions with their support rather than asserting one.
    - The detail makes explicit that the platform maps, and does not certify, this claim.
  - *Business rules / validation:* Interpretive claims are never auto-promoted to verified by reading; positions are read-only here (mapping originates upstream from the pipeline/Skeptic).
  - *Failure & edge cases:* If only one position was produced, the claim degrades to `Sourced`/`Unsupported` as appropriate rather than presenting a fake "both sides."

- **[LEARN-14] As a Skeptical / Expert Learner (LEARNER-SKEPTIC), I want Skeptic hard mode to increase the density and aggressiveness of inline flags, so that I get a more adversarial read of the material.** — *Priority:* Should-Have — *Why this priority:* Hard mode is a headline Pro differentiator for the expert persona, but gated behind a paid plan.
  - *Acceptance criteria:*
    - With hard mode enabled (Pro), the lecture surfaces additional disputed/interpretive/unsupported flags and stricter overreach callouts than standard mode.
    - The reading UI indicates that hard mode is active for this topic.
  - *Business rules / validation:* Hard mode is a **Pro/Teams** entitlement (not available on Free). The added flags come from the Skeptic re-run upstream; this domain renders them and does not itself generate flags. Hard mode changes what is *shown*, never silently upgrades a claim to verified.
  - *Failure & edge cases:* A Free learner viewing a topic that was verified under hard mode still sees the resulting flags (they inherit the ledger) but cannot toggle hard mode on for their own new reads; an upgrade nudge is shown at the toggle.

- **[LEARN-15] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want the trust encoding and every gate to work fully under assistive tech, so that trust state and progression are never conveyed by color, position, or timing alone.** — *Priority:* MVP — *Why this priority:* The trust ledger's color/spatial/timed encoding is a core product surface; if it is color-only it fails the very learners who most need honest signal.
  - *Acceptance criteria:*
    - Every trust state is conveyed by an accessible label and icon in addition to color; a screen reader announces the trust level when a claim receives focus.
    - Underlined claims are reachable and activatable by keyboard in reading order; the gated "Next section" exposes its disabled state and the reason to assistive tech.
    - No active-listening prompt imposes a time limit that can silently fail a learner; the close gate is not a keyboard trap.
  - *Business rules / validation:* Meets WCAG AA for contrast and non-color signaling. Focus order follows document order; the side-rail claim detail is programmatically associated with the selected claim.
  - *Failure & edge cases:* With CSS/color disabled, trust states remain distinguishable via text/glyph; if a screen reader user completes the close gate, "Next" becomes enabled with an announced state change.

- **[LEARN-16] As an Exam-prep Student (LEARNER-EXAM), I want to jump straight back to the exact lecture section a gap or test miss came from, so that I can fix the specific weak spot fast.** — *Priority:* Should-Have — *Why this priority:* Deep-linking closes the loop from Gap Map/Tests back into the lecture and is a major efficiency win for deadline-driven learners.
  - *Acceptance criteria:*
    - Opening a lecture from a Gap-Map entry, review "wrong idea," or test miss lands on the exact section (and, where available, the exact claim) that produced it.
    - The originating context (which gap/miss) is indicated on arrival.
    - Backward navigation to any completed section is unrestricted regardless of gates.
  - *Business rules / validation:* Deep-links resolve to stable section/claim anchors owned by this domain; the Gap Map and Tests domains supply the target anchor. Re-reading a section does not by itself close a gap (closure lives in the Gap Map domain).
  - *Failure & edge cases:* If the target claim/section no longer exists (topic re-verified and restructured), the link resolves to the nearest surviving section with a note, not a 404.

- **[LEARN-17] As a Guest / Visitor (GUEST), I want to open a pre-verified demo lecture in one click and see the inline trust ledger, so that I can judge whether the verification promise is real before signing up.** — *Priority:* Should-Have — *Why this priority:* The demo lecture is a primary conversion surface; it is where the trust ledger sells itself, but it is not part of the authenticated loop.
  - *Acceptance criteria:*
    - The demo opens a finished showcase lecture (e.g. Dijkstra) with real underlined claims, a working claim → evidence side rail, and at least one disputed claim.
    - The guest can read, click claims, and see the section trust breakdown without an account.
    - Attempting to persist anything (or to leave the demo topic) prompts sign-up; nothing is saved.
  - *Business rules / validation:* The demo is ephemeral and read-only; guests cannot create topics, resolve conflicts, or change settings. Active-listening prompts may be shown for effect but persist no state.
  - *Failure & edge cases:* If the showcase content fails to load, fall back to a static description + sign-up CTA rather than a blank demo; the demo never leaks another tenant's real topic.

- **[LEARN-18] As a Returning Power-Learner (LEARNER-POWER), I want a lecture to resume where I left off with my gate answers intact, so that I don't re-read or re-explain sections I already completed.** — *Priority:* Should-Have — *Why this priority:* Resume state is essential for a portfolio of long topics read across many sessions.
  - *Acceptance criteria:*
    - Re-opening a topic restores the last-read section, completed-section marks, satisfied close gates, and prior gate responses.
    - Completed sections remain unlocked; the previously-satisfied close gate does not re-block "Next."
    - Progress and the section strip reflect the restored state.
  - *Business rules / validation:* Reading progress and gate state are per-learner, per-topic, and tenant-scoped; for a shared Teams library the learner's own progress is distinct from the shared content.
  - *Failure & edge cases:* If the topic was re-verified and restructured since last read, restore to the nearest valid section and clearly indicate the content changed rather than restoring a stale anchor.

- **[LEARN-19] As a Self-directed Learner (LEARNER-SELF), I want the lecture to keep working when I go offline mid-read, so that a dropped connection doesn't lose my progress or block me.** — *Priority:* MVP — *Why this priority:* Reading happens on the move; losing gate progress or a whole section to a network blip is unacceptable.
  - *Acceptance criteria:*
    - Going offline shows a non-blocking "You're offline — progress is saved locally and will sync when you're back" indication, not a hard error page.
    - Already-loaded section prose, its claims, and gate inputs remain usable; gate answers entered offline are queued and sync on reconnect.
    - Sync is idempotent — reconnecting does not duplicate a close-gate submission or double-count section completion.
  - *Business rules / validation:* Locally-completed gates count once synced (parallel to "reviews you complete offline still count"). Features that require the network (e.g. loading an un-cached later section, running a fresh Skeptic hard-mode pass) degrade gracefully with an explanatory placeholder.
  - *Failure & edge cases:* If a claim's ledger entry was not cached before going offline, its detail shows an "unavailable offline" state — never a fabricated source; on reconnect the real entry loads.

- **[LEARN-20] As a Skeptical / Expert Learner (LEARNER-SKEPTIC), I want a claim whose evidence fails to load to be shown honestly rather than styled as verified, so that a rendering failure can never masquerade as trust.** — *Priority:* MVP — *Why this priority:* The product's entire credibility rests on never showing unearned trust; a load failure defaulting to "verified" would be a trust-integrity breach.
  - *Acceptance criteria:*
    - If a claim's ledger entry (source/evidence/confidence) cannot be retrieved, the claim is not rendered with a verified treatment; the detail shows an explicit "evidence unavailable" / retry state.
    - A claim with no resolvable trust state renders as `Unsupported`, never as a silent default of verified.
    - The overall/section percent-verified figures do not count a claim as verified when its entry failed to load.
  - *Business rules / validation:* "Fail closed" invariant — absence of evidence is never rendered as presence of trust. Retry is available; the state resolves to the true ledger value once loaded.
  - *Failure & edge cases:* Partial ledger failure (some entries load, some don't) degrades per-claim, not per-lecture; the section trust bar reflects only claims whose state is known and flags the unresolved remainder.

- **[LEARN-21] As a Self-directed Learner (LEARNER-SELF), I want a clear state when I open a lecture that is still verifying or only partially verified, so that I'm never reading unverified content that looks finished.** — *Priority:* Should-Have — *Why this priority:* Pipeline runs in the background, so learners will open topics mid-verification; presenting half-verified prose as done would undercut the thesis.
  - *Acceptance criteria:*
    - A section whose claims are still being verified shows a "verifying" treatment (which stage / how far) rather than final trust underlines.
    - The learner can read completed sections while later ones are still in the pipeline (progressive reveal), with unfinished sections clearly marked.
    - Once a section finishes verifying, its claims re-render with real trust states without requiring a full reload.
  - *Business rules / validation:* This domain consumes pipeline stage/state from the Verification Pipeline domain and reflects it; it does not itself verify. A still-verifying claim is treated as not-yet-trusted (never optimistically shown as verified).
  - *Failure & edge cases:* If verification failed for a section (pipeline error), that section shows a failed/degraded state with a retry route into the pipeline, not silent blank prose; the topic's overall figure reflects only the verified portion.

- **[LEARN-22] As a Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD), I want the close gate to resist being satisfied by empty or junk input, so that the completion signal it feeds (and any calibration/engagement metric) can't be trivially gamed.** — *Priority:* Should-Have — *Why this priority:* The close gate feeds honest signals; if a blank submit unlocks it, the signal is worthless and calibration can be juked.
  - *Acceptance criteria:*
    - An empty, whitespace-only, or below-minimum-length close response does not unlock "Next"; the learner is prompted to actually explain.
    - Obvious low-effort junk (e.g. a single repeated character, the prompt pasted back) is rejected or flagged rather than accepted as a genuine explanation.
    - Gate completion events distinguish a genuine submission from a rejected attempt in the signals emitted downstream.
  - *Business rules / validation:* The close gate validates effort, not correctness (no rubric grading here). Anti-gaming validation is lightweight/deterministic to keep the gate instant and cheap; systematic gaming patterns are surfaced to the Trust & Safety domain rather than silently trusted.
  - *Failure & edge cases:* A legitimate very-short-but-valid answer (short language, terse expert) must not be over-blocked into frustration; the minimum bar is calibrated to catch emptiness/junk, not brevity.

- **[LEARN-23] As a Team Seat Learner (LEARNER-TEAM), I want to read a shared, pre-curated topic and inherit its verified trust states, so that I get the same audited ledger the curator saw without re-verifying it myself.** — *Priority:* Should-Have — *Why this priority:* Inheriting trust inside a shared library is the core of the Teams consumer experience, but it reuses the same reading surface rather than adding a distinct one.
  - *Acceptance criteria:*
    - Opening a shared-library topic renders the curator's/pipeline's trust states, sources, and disputed/interpretive flags read-only.
    - The learner's own reading progress, gate answers, and calibration are recorded per-seat, separate from the shared content.
    - Contributions the seat learner can make (e.g. raising a dispute) route into the shared Conflicts/Gap surfaces owned by those domains, not into the ledger from here.
  - *Business rules / validation:* A team seat learner cannot certify claims or edit trust states from the lecture (they own no seats/billing/authority); they consume inherited trust and contribute only through the adjudication surfaces. Access is tenant/library-scoped.
  - *Failure & edge cases:* If the shared topic is updated by the curator mid-read, the learner sees a "content updated" indication and their progress is reconciled to the nearest valid anchor rather than lost.

### Business rules & invariants

- **Read-only over the ledger.** Nothing in the Lecture tab mutates epistemic state: reading, clicking claims, hitting soft prompts, or satisfying the close gate never certifies a claim, resolves a conflict, or changes a trust state. Adjudication lives in Conflicts; provenance edits live in Sources.
- **Every underline maps to a claim; every claim to a source-or-not.** An underlined span exists iff it corresponds to a real ledger claim ID. A claim with a backing source shows it; a claim with none renders `Unsupported`/`Disputed` — it is never upgraded by default.
- **Fail closed on trust.** Absence, error, or still-loading of evidence is never rendered as presence of trust. A claim whose state is unknown/failed is shown as unverified, and percent-verified figures exclude it.
- **One hard gate.** The close gate is the only progression-blocking gate in this domain. Predict, pause-point, cloze, and connection are soft, individually configurable, and never block "Next." The close gate itself is learner-configurable (recommended on).
- **Gate = effort, not correctness.** The close gate validates a genuine, minimum-length explanation; it does not rubric-grade. Correctness grading is the Tasks domain; trust adjudication is the Conflicts domain.
- **Trust is never color-only.** Every trust state is conveyed by icon + label + text alongside color, and every claim is keyboard-reachable — accessibility is an invariant of the trust encoding, not a feature.
- **Honest section rendering.** A section's trust breakdown and the topic's percent-verified are read verbatim from the ledger; a "bad" (mostly disputed/unsupported) section renders truthfully and is never smoothed upward.
- **Hard mode is entitlement-gated and additive.** Skeptic hard mode is Pro/Teams; it changes *what flags are shown*, never silently promotes a claim to verified. Inherited hard-mode flags are visible to Free readers of a topic verified under hard mode.
- **Progressive but never optimistic.** Learners may read completed sections while later ones verify in the background; a still-verifying claim is treated as not-yet-trusted.
- **Per-learner state.** Reading progress, gate answers, predictions, and satisfied gates are per-learner, per-topic, tenant-scoped — distinct from shared/inherited topic content.

### Cross-domain dependencies

**Consumes (needs from other domains):**
- **Verification Pipeline (VERIFY-PIPELINE):** the entire lecture artifact — prose, section structure, decomposed claims, trust states, sources, and per-stage verification status for progressive reveal.
- **The Skeptic (SKEPTIC-AI):** inline disputed/interpretive flags, overreach reasons ("fails with negative edge weights"), and hard-mode density.
- **Execution Sandbox (EXEC-SANDBOX):** the `Verified · execution` evidence/traces shown in claim detail.
- **Trust Ledger (shared spine):** the canonical claim objects, five trust states, confidence values, and source links that this domain renders (defined in the Verify & Trust domain, not here).
- **Settings · Active Listening:** the per-learner prompt-type toggles and prompt-frequency setting that govern which gates appear and how densely.
- **Auth / Plans & Billing:** Free vs Pro/Teams entitlement for Skeptic hard mode; guest/ephemeral mode for the demo lecture.

**Provides (what other domains rely on from here):**
- **Conflicts domain:** deep-links out of inline disputed claims ("Tap Conflicts to resolve"); the lecture surfaces disputes but delegates all adjudication.
- **Sources domain:** the claim → source relationship a learner drills into; the coverage matrix itself lives in Sources.
- **Gap Map domain:** lecture-origin misconception candidates (wrong pause-point/cloze/close signals) tagged origin = lecture, and the stable section/claim anchors that Gap-Map entries deep-link back into.
- **Progress / Reports (honest signals):** predict-vs-actual and gate-engagement events feeding Calibration and active-listening completion; no vanity metrics are emitted.
- **Tasks / Review / Tests domains:** section-completion and read state that gate or inform downstream steps; deep-link anchors that Tests/Review use to return a learner to the exact paragraph.
- **Trust & Safety domain:** close-gate genuine-vs-rejected signals and systematic-gaming patterns for calibration-juking detection.

### Key technical requirements

- **Stable claim anchoring.** A robust, versioned mapping from ledger claim IDs to text ranges in rendered prose that survives re-render, progressive reveal, and re-verification restructuring; each anchor is independently focusable, activatable, and deep-linkable (section + claim).
- **Instant, read-only claim detail.** Selecting a claim renders its ledger entry (source, evidence, confidence, trust badge) without a full reload; target < ~300 ms for cached entries. Evidence may lazy-load, but a claim's verified treatment must never render before its entry is confirmed (fail-closed).
- **Progressive/streaming reveal.** Ability to render completed sections while later sections are still in the pipeline, and to re-render a section's trust states in place when verification completes, without a page reload.
- **Offline-capable reading + durable gate state.** Local persistence of loaded prose, claim entries, reading progress, and gate answers; an idempotent sync queue so offline close-gate submissions and section completions reconcile exactly once on reconnect.
- **Cheap, instant gates.** Close-gate validation is lightweight and deterministic (length/effort/anti-junk heuristics) — not an LLM correctness grade — to keep progression instant and inexpensive. Predict/pause/cloze/connection prompt content is pre-generated at pipeline time and cached, not generated per read, to bound AI cost and latency.
- **Config propagation without re-verification.** Applying changed Active-Listening settings (toggles/frequency) affects subsequently-read sections across all topics without triggering any re-run of the verification pipeline.
- **Accessibility engineering.** WCAG AA contrast and non-color signaling for all five trust states; correct focus order over claim spans; programmatic association between a selected claim and its side-rail detail; disabled "Next" exposes state + reason; no timed prompt can silently fail a learner; the close gate is not a keyboard trap.
- **Event emission for signals.** Structured, deduplicated events for predictions, pause-point/cloze outcomes, connection submissions, close-gate genuine/rejected results, and section completion — consumed by Calibration, Gap Map, and Trust & Safety — with per-learner, tenant-scoped isolation.
- **Ephemeral guest mode.** A no-persistence path that renders a pre-verified showcase lecture (with a real disputed claim and working claim detail) without an account and without leaking any real tenant's topic.

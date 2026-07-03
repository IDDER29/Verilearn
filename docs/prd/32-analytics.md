## Progress, Reports & Analytics (learner, educator, org)

### Overview

This domain owns the **reporting layer** of VeriLearn: the surface that takes everything the learner *did* across the loop — reviews, tasks, tests, conflicts, gap-map activity — and turns it into a small set of **honest signals** the learner, an educator, or an organization can act on. It is the product's answer to the question "am I actually getting better, or just busy?" — and, true to the thesis, it answers it *honestly*.

The spine of the domain is the rule **four honest signals, no vanity metrics**. Every headline number on Progress maps to something the learner actually did and is traceable back to the events that produced it:

- **Retention** — how much you recall over time (from FSRS review outcomes).
- **Transfer** — whether you can apply it to *new* problems (from rubric-graded Tasks and transfer test items).
- **Calibration** — confidence vs. reality (from the Sure/Unsure/Guessing gate committed *before* reveal).
- **Drill detection (blind-spot)** — whether you catch seeded errors, i.e. can you spot a wrong claim, not just recall a right one.

Around those four, the domain owns: the per-topic breakdown table (each topic's retention / transfer / calibration plus its **Verified** trust-coverage %), the **retention/transfer trend chart** over a selectable date range, the **"Where to focus"** ranked recommendation rail, and the **roll-ups** that aggregate the same signals from one learner up to a cohort (Instructor) and up to an org (ORG-ADMIN). Critically, this domain does **not** *compute the raw data-points* — those are born in Review/FSRS (retention, calibration, drill-detection), Tasks (transfer), and Tests (retention/transfer movement). Analytics **consumes, aggregates, explains, and governs the visibility of** those signals. It also does not own the Gap Map board, the trust ledger, or certificates — it links into them.

Why it matters to the product thesis: the whole platform sells *earned, honest trust*. A reporting surface that inflated progress with streaks, points, and vanity dashboards would betray that promise at the exact moment the learner is deciding whether to believe the product. So Analytics is where "honesty as a feature" either holds or collapses — the numbers must be defensible, explainable, refuse to fabricate when data is thin, and be firewalled from anyone (Support, admins, T&S) who might want to *decree* a signal rather than earn it.

### Personas involved

- **Self-directed Learner (`LEARNER-SELF`)** — the default reader of their own Progress; uses the four signals and "Where to focus" to decide what to study next within Free's 3 topics.
- **Returning Power-Learner (`LEARNER-POWER`)** — the domain's power user; optimizes a large multi-topic portfolio over months, lives in the trend chart, per-topic breakdown, and calibration detail, and wants portfolio-level roll-ups.
- **Exam-prep Student (`LEARNER-EXAM`)** — reads Progress as a weak-spot finder feeding prep; the terminal readiness forecast itself lives in the Tests domain, but the underlying retention/calibration it reads are surfaced here.
- **Skeptical / Expert Learner (`LEARNER-SKEPTIC`)** — cares that Calibration is honest and every signal is traceable to real events; the persona most likely to distrust an unexplained number.
- **Team Seat Learner (`LEARNER-TEAM`)** — their per-learner signals may be exposed to a manager under the org's visibility policy; the privacy tension of this domain centers on them.
- **Instructor / Educator (`INSTRUCTOR`)** — reads the four honest signals **for a cohort** to find weak spots and target teaching; holds pedagogical authority but **cannot change a trust state or hand-edit any signal**.
- **Organization / Teams Admin (`ORG-ADMIN`)** — reads **aggregated** org signals + certificate/completion counts to prove ROI, and **sets the progress-visibility policy** this domain must enforce (per-learner vs. aggregate-only).
- **Compliance / Data-Protection Officer (`COMPLIANCE-DPO`)** — governs honest signals as sensitive personal data (DSAR export, retention, minor/FERPA handling) and gatekeeps whether a manager may lawfully see per-learner calibration.
- **Trust & Safety / Ledger Integrity Lead (`TRUST-SAFETY-LEAD`)** — defends the signals against gaming (calibration-juking, drill-answer memorization, streak-farming) and can freeze/void a manipulated signal — never fabricate one.
- **Support Agent (`SUPPORT-AGENT`)** — restores genuinely-lost report/history state from a checkpoint under scoped consent, but is **firewalled from ever fabricating or editing a learning signal**.
- **Accessibility-Reliant Learner (`A11Y-LEARNER`)** — charts, trend lines, and color-coded signal cards are a core accessibility stress test; needs non-visual, non-color-only encodings.
- **Guest / Visitor (`GUEST`)** — samples an ephemeral demo, persists nothing, and therefore has **no** progress or reports.
- **Platform Administrator (`PLATFORM-ADMIN`)** — operates the computation infrastructure but is privacy-scoped out of reading plaintext honest signals beyond operational necessity (referenced, not a primary actor).
- **Billing / Finance Admin (`BILLING-ADMIN`)** — reads seat-cost/utilization reporting only; honest-signal ROI is translated *for* them but they cannot read learner content (referenced boundary).

### User stories

- **[ANALYTICS-01] As a Self-directed Learner, I want a Progress dashboard showing my four honest signals — Retention, Transfer, Calibration, Drill detection — each with its current value and short-window trend, so that I can see whether I'm actually improving at a glance.** — *Priority:* MVP — *Why this priority:* This is the built, headline Reports screen and the concrete embodiment of the "four honest signals, no vanity metrics" thesis.
  - *Acceptance criteria:*
    - Four signal cards render current value (e.g. Retention 74%), a directional delta vs. the prior window (e.g. ▲4%), and a one-line plain-language definition ("How much you recall over time").
    - Each card names *what* fed it (retention ← FSRS reviews, transfer ← tasks/tests, calibration ← confidence gate, drill ← seeded error-drills), never an opaque score.
    - No vanity metric (streaks, points, minutes-watched, badges) appears as one of the four headline signals.
  - *Business rules / validation:* Exactly these four signals are the honest signals; nothing else may be presented at their visual weight. Deltas are computed against the same selected date window (ANALYTICS-05). Values are read-only aggregates — nothing on this screen mutates a signal.
  - *Failure & edge cases:* A signal with no contributing events shows "—" / "not enough data yet," not 0% (see ANALYTICS-09). If one signal's source pipeline is unavailable, that card degrades independently ("couldn't refresh") without blanking the other three.

- **[ANALYTICS-02] As a Skeptical / Expert Learner, I want to drill into any honest signal and see exactly which events produced it, so that I can trust the number the same way I trust a sourced claim.** — *Priority:* MVP — *Why this priority:* A verification-first product cannot show a black-box progress number; explainability is what makes the signal itself honest.
  - *Acceptance criteria:*
    - Clicking a signal opens a breakdown of its inputs (e.g. Calibration → the count of Sure/Unsure/Guessing commits vs. actual recall, with the over/under-confident split).
    - The breakdown states the window, the sample size (n data-points), and the formula in plain language ("calibration = agreement between committed confidence and actual recall").
    - Every input traces to a concrete artifact (a review card, a task, a test question) the learner can navigate to.
  - *Business rules / validation:* A signal must never be shown without a discoverable provenance; a signal computed from fewer than the minimum sample is flagged low-confidence, not hidden. The formula shown must match the one the compute layer used.
  - *Failure & edge cases:* If an underlying artifact was deleted (topic reset), the breakdown shows aggregate counts but marks removed items as "no longer available" rather than dangling a broken link.

- **[ANALYTICS-03] As a Returning Power-Learner, I want a per-topic breakdown of retention, transfer, calibration, and verified-coverage, so that I can tell which topics in my portfolio are solid and which are decaying.** — *Priority:* MVP — *Why this priority:* Portfolio-level triage is the power persona's core job and is present in the shipped By-topic table.
  - *Acceptance criteria:*
    - A table lists each topic with its Retention, Transfer, and Calibration bars plus a **Verified** trust-coverage % (share of the topic's claims in a Verified/Sourced state).
    - Low or miscalibrated cells are visually flagged (e.g. a red calibration bar) and the row links into that topic's workspace / review.
    - The table is sortable by any signal so the learner can rank weakest-first.
  - *Business rules / validation:* The Verified column reads the trust ledger (owned by Conflicts/Trust) and is display-only here. Only the learner's entitled topics appear (Free ≤3); Team learners see shared-library topics per the visibility policy.
  - *Failure & edge cases:* A brand-new topic with no review history shows dashes for the three learner signals but may still show its Verified coverage. A deleted topic drops out cleanly without erroring.

- **[ANALYTICS-04] As a Self-directed Learner, I want a "Where to focus" rail that ranks my topics by recent signals and links me straight to the fix, so that I always know the single highest-leverage next action.** — *Priority:* MVP — *Why this priority:* Turning signals into a next action is the payoff of the whole surface and is present in the shipped design.
  - *Acceptance criteria:*
    - The rail lists topics ranked by weakness/urgency with a one-line reason ("Merkle trees — overconfident · calibration low", "Hashing basics — retention dipping").
    - Each item links to the right remediation target: a Gap Map entry, a due Review, or the topic's weak section.
    - Solid, well-calibrated topics are shown positively ("Binary search — solid · nicely calibrated") rather than omitted, so the rail is honest about strengths too.
  - *Business rules / validation:* Recommendations may point only to genuine levers (miscalibration, retention decay, open gaps, due reviews) — never a vanity nudge or a "study more" filler. Ranking is derived from the same signal values shown elsewhere (no separate hidden score).
  - *Failure & edge cases:* If every topic is healthy, show an encouraging "nothing urgent — keep reviews on schedule" state, not a forced or empty list.

- **[ANALYTICS-05] As a Returning Power-Learner, I want a retention/transfer trend chart with a selectable date range, so that I can see whether my recall is climbing or sliding over weeks and months.** — *Priority:* MVP — *Why this priority:* Trend-over-time is how a long-horizon learner judges the retention engine, and the chart + range selector ship on the Reports screen.
  - *Acceptance criteria:*
    - A line chart plots Retention and Transfer over time with a legend and a plain-language read ("Trending up as you keep reviews on schedule").
    - A range control (e.g. Last 30 days, with other windows) re-scopes the chart, the signal-card deltas, and the breakdowns consistently.
    - Data points align to real time buckets (weeks) with an explicit "Now" endpoint.
  - *Business rules / validation:* All time-scoped views on the screen share one selected range; changing it must not leave a stale card. Buckets with no activity are rendered as gaps or interpolated-and-labelled, never as a fabricated zero dip.
  - *Failure & edge cases:* A learner with <1 window of history sees "not enough history yet — check back after a few review sessions" instead of a misleading flat/erratic line.

- **[ANALYTICS-06] As a Self-directed Learner, I want a calibration report that tells me the *direction* of my miscalibration per topic, so that I know whether I'm overconfident or underconfident and can adjust.** — *Priority:* Should-Have — *Why this priority:* Calibration is the metacognition payoff of the confidence gate and the product's most differentiated signal, but the top-line card (ANALYTICS-01) covers MVP; the directional detail is an enhancement.
  - *Acceptance criteria:*
    - The report names direction per topic ("Merkle trees — overconfident: you felt Sure but missed it", "Binary search — well calibrated").
    - It distinguishes overconfidence from underconfidence rather than a single right/wrong percentage.
    - It links overconfident topics to the seeded error-drills and reviews that will correct them.
  - *Business rules / validation:* Calibration data-points originate at the Review confidence gate (Review/FSRS domain); this domain only aggregates and displays them. Cards where the gate was disabled contribute no calibration data and are excluded, with that exclusion disclosed.
  - *Failure & edge cases:* If a learner disabled the confidence gate globally, the calibration signal reads "unavailable — enable the confidence gate to measure this," not a fabricated value.

- **[ANALYTICS-07] As an Exam-prep Student, I want the drill-detection (blind-spot) signal explained and broken out by topic, so that I know where I'd fail to catch a wrong claim under pressure.** — *Priority:* Should-Have — *Why this priority:* Blind-spot detection is one of the four honest signals and a genuine differentiator, but its top-line card is MVP while the per-topic breakout is a refinement.
  - *Acceptance criteria:*
    - The signal is defined as "catching seeded errors" and shows the learner's hit-rate on "spot the error" drills.
    - A per-topic view shows which topics have the weakest error-catching, flagged as blind-spot risk.
    - It links to the seeded error-drills for the weak topics.
  - *Business rules / validation:* Drill-detection data-points are produced by the seeded error-drills in Review/FSRS; this domain aggregates only. A topic with no drills served yet shows "no drills yet," not a 0% blind-spot.
  - *Failure & edge cases:* If drill-answer memorization is suspected (same drills repeated), the signal is flagged as potentially inflated pending T&S review (ties to ANALYTICS-15), rather than shown as a clean high score.

- **[ANALYTICS-08] As a first-time learner, I want the Progress screen to be an honest, welcoming empty state before I have data, so that I'm oriented rather than shown fake or zeroed metrics.** — *Priority:* MVP — *Why this priority:* First-run is the learner's first encounter with the honesty promise on this surface; a fabricated 0% would break trust immediately. *(Failure scenario.)*
  - *Acceptance criteria:*
    - With no review/task/test history, the screen shows a first-run explainer of the four signals and what action produces each, not empty charts full of zeros.
    - It routes the learner to the action that will *start* generating a signal (do a review, complete a task).
    - As soon as the first data-point exists, the corresponding card transitions from primer to a low-confidence value.
  - *Business rules / validation:* No honest signal renders a numeric value until at least its minimum sample exists. Empty state must be distinguishable from a genuine zero (which is itself rare and, when real, labelled).
  - *Failure & edge cases:* A learner who created topics but never reviewed sees per-topic Verified coverage but dashes for the three learner signals — the screen explains why.

- **[ANALYTICS-09] As a Skeptical / Expert Learner, I want sparse or noisy signals flagged as low-confidence instead of shown as precise numbers, so that the product never overstates what it actually knows about me.** — *Priority:* MVP — *Why this priority:* Refusing to fabricate precision on thin data is the exact honesty behavior that separates VeriLearn's analytics from a vanity dashboard. *(Failure scenario.)*
  - *Acceptance criteria:*
    - A signal computed from fewer than the minimum sample renders with a low-confidence marker and the sample size ("based on 4 reviews — low confidence").
    - Low-confidence signals are excluded from, or clearly caveated in, "Where to focus" ranking so they don't drive spurious recommendations.
    - Confidence increases visibly as sample grows (the caveat drops once the threshold is met).
  - *Business rules / validation:* Minimum-sample thresholds per signal are defined and consistent across learner/cohort/org roll-ups. A low-confidence signal is never promoted to a headline delta as if it were stable.
  - *Failure & edge cases:* A single lucky/unlucky data-point must not swing a headline number without the low-confidence caveat; aggregation must be robust to outliers (see ANALYTICS-15 for adversarial inflation).

- **[ANALYTICS-10] As an Instructor / Educator, I want a cohort view of the four honest signals to find where a group is weak, so that I can target my teaching — without any power to change a trust state or edit a learner's signal.** — *Priority:* Should-Have — *Why this priority:* Cohort analytics is core Teams value and the Instructor's stated job, but it is gated behind the Teams plan and not required for the single-learner MVP.
  - *Acceptance criteria:*
    - The instructor sees aggregate cohort Retention/Transfer/Calibration/Drill-detection and per-topic weak spots across the shared library.
    - The view is read-only with respect to trust states, scores, and signals — no edit affordance exists.
    - Weak-spot summaries link to the shared-library topic/section, not to any lever that would alter truth.
  - *Business rules / validation:* Instructor authority is pedagogical only; certification and signal values are immutable to them (epistemic firewall). Cohort aggregates respect the org's progress-visibility policy (ANALYTICS-12/13).
  - *Failure & edge cases:* A cohort too small to aggregate without re-identifying individuals is suppressed ("cohort too small to report anonymously") rather than leaking per-learner data (ties to COMPLIANCE-DPO). A topic still verifying shows "not yet measurable" instead of empty bars.

- **[ANALYTICS-11] As an Instructor / Educator, I want to drill from cohort aggregate into an individual learner's signals only where the org's visibility policy permits, so that I get actionable insight without violating a learner's privacy.** — *Priority:* Should-Have — *Why this priority:* Per-learner drill-down is high-value for teaching but is the sharpest privacy tension in the domain and must be policy-gated, so it follows the aggregate view.
  - *Acceptance criteria:*
    - Per-learner drill-down is available only when the ORG-ADMIN's visibility policy allows it; otherwise the instructor sees aggregates only.
    - When permitted, the individual view shows the same four signals with the same provenance the learner sees.
    - Any per-learner exposure is logged for audit.
  - *Business rules / validation:* Enforcement is server-side against the tenant's visibility policy, not a UI hide. Sensitive signals (calibration weaknesses) are governed most strictly and may be aggregate-only even when others are per-learner.
  - *Failure & edge cases:* A policy change to more-restrictive takes effect immediately, closing any open per-learner view. An instructor removed from a cohort loses drill-down access without affecting the learners' data.

- **[ANALYTICS-12] As an Organization / Teams Admin, I want aggregated org-level honest-signal movement plus completion and certificate counts, so that I can prove ROI to the check-signer without resorting to vanity metrics.** — *Priority:* Should-Have — *Why this priority:* ROI reporting is why an org buys and renews, but it depends on the learner-level signals existing first and is Teams-gated.
  - *Acceptance criteria:*
    - The org dashboard shows aggregate Retention/Transfer/Calibration trend, topic completion counts, and certificates earned across the tenant.
    - Metrics are framed as honest-signal movement, not points/streaks/hours; each rolls up from the same learner signals.
    - The admin can scope by team/library and date range.
  - *Business rules / validation:* ORG-ADMIN sees org-wide aggregates and, per the policy they themselves set, per-learner detail — but can never edit a signal, certify a claim, or set price. Certificate counts read the Tests/Certs domain; this domain displays, it does not issue.
  - *Failure & edge cases:* An org with mostly-dormant seats shows low-activity honestly (feeding the utilization story) rather than padding engagement. Cross-tenant data is never visible.

- **[ANALYTICS-13] As a Team Seat Learner, I want my per-learner honest signals hidden from my manager unless the org policy explicitly exposes them, so that a calibration dip doesn't become a performance flag without my knowledge.** — *Priority:* MVP — *Why this priority:* The privacy wall around sensitive learner signals is a hard invariant the moment Teams exists; getting it wrong exposes intimate weakness data. *(Failure scenario.)*
  - *Acceptance criteria:*
    - By default (absent an explicit permissive policy), a Team learner's individual signals are visible only to the learner; managers see aggregates only.
    - The learner can see what their org's current visibility policy exposes about them.
    - Any exposure beyond the default requires the ORG-ADMIN policy to be set *and* is surfaced to the learner.
  - *Business rules / validation:* Visibility is enforced server-side; a UI that hides but still returns the data is non-compliant. COMPLIANCE-DPO gatekeeps whether per-learner exposure is lawful for minors/jurisdictions and can override to more-restrictive.
  - *Failure & edge cases:* A misconfigured policy that would over-expose is blocked at save time with a compliance warning rather than silently leaking. A learner offboarded from the org has their per-learner signals frozen from manager view per the data-disposition policy.

- **[ANALYTICS-14] As a Self-directed Learner, I want to export or share a report of my progress, and to opt in before any deeper signal leaves my account, so that I control what an employer or anyone else can see.** — *Priority:* Should-Have — *Why this priority:* Learner-owned sharing is the bridge from private analytics to the external certificate/credential story, but the core private view ships first.
  - *Acceptance criteria:*
    - The learner can export their progress (e.g. a shareable report or file) with an explicit, revocable choice of which signals are included.
    - Sharing deeper signals (calibration/transfer detail) is off by default and requires explicit, scoped, time-boundable consent.
    - Revoking a share link invalidates previously-distributed copies of the live view.
  - *Business rules / validation:* PII and signal exposure are minimized to the learner's explicit choices; consent is auditable and revocable, and revocation propagates to any active share and API consumer. This share is distinct from the certificate verify page (Tests/Certs domain), which it may complement.
  - *Failure & edge cases:* Opening a revoked share link shows "no longer available," never stale cached signals. An export requested while a signal is mid-recompute reflects a consistent "as of" snapshot, not a half-updated mix.

- **[ANALYTICS-15] As a Trust & Safety / Ledger Integrity Lead, I want to detect and freeze gamed honest signals (calibration-juking, drill-answer memorization, streak-farming), so that the reporting layer keeps meaning what it claims — without ever hand-editing a signal to a "correct" value.** — *Priority:* Should-Have — *Why this priority:* If the honest signals can be juked at scale the entire value proposition collapses, but detection tooling can follow the core reporting path. *(Failure/abuse scenario.)*
  - *Acceptance criteria:*
    - T&S can flag anomalous signal patterns (e.g. a cohort mass-committing "Sure" to inflate Calibration) and **void or quarantine** the gamed data-points, with a required reason and audit log.
    - Voiding a gamed signal recomputes the affected aggregates rather than overwriting them with a chosen number.
    - T&S can freeze a suspect signal pending review but cannot set it to a value of their choosing (epistemic firewall).
  - *Business rules / validation:* T&S may quarantine/void/freeze but never fabricate or hand-certify; every action is reversible with justification and fully logged. Good-faith adversarial behavior (a real skeptic drilling hard) must not be swept up as gaming (low false-positive requirement).
  - *Failure & edge cases:* A false-positive freeze must restore the original data-points intact on reversal. Voiding a vote-ring's contribution must not affect independently-earned signals in the same cohort.

- **[ANALYTICS-16] As a Support Agent, I want to restore genuinely-lost report or history state from a checkpoint under scoped consent, without ever fabricating or editing a learning signal, so that operational failures don't cost a learner their real progress but the honesty wall holds.** — *Priority:* Should-Have — *Why this priority:* Real data-loss incidents need a remedy, but the firewall against manufacturing a learning signal is absolute and must be enforced by permissions. *(Failure/recovery scenario.)*
  - *Acceptance criteria:*
    - With consent, Support can restore a learner's report/history state from a known-good checkpoint when the cause was a platform failure, logged with reason.
    - Support cannot set a calibration/retention/transfer value, mark a signal, or invent a data-point that never happened.
    - A learner requesting a fabricated boost is declined with an honesty-policy explanation and, if warranted, routed as a dispute.
  - *Business rules / validation:* Every support action is scoped by explicit, time-boxed consent and audit-logged; the fabrication firewall is enforced by the permission model, not policy alone. Restoration reproduces real prior state, never a chosen number.
  - *Failure & edge cases:* If no checkpoint proves the data was genuinely lost, Support cannot "restore" it — the request is declined rather than granted as a fabrication. A restore that races a live recompute must reconcile to the true event history, not double-count.

- **[ANALYTICS-17] As an Accessibility-Reliant Learner, I want every chart, trend line, and color-coded signal to have a non-visual, non-color-only equivalent and a reduced-motion path, so that the honesty of my progress is fully available to me via assistive tech.** — *Priority:* MVP — *Why this priority:* The signal cards and charts encode meaning in color/position/animation, making this the domain's core accessibility risk; fairness of self-knowledge is non-negotiable.
  - *Acceptance criteria:*
    - Signal values, deltas (up/down), and calibration direction are exposed as text/ARIA, never by color alone (red calibration bar also reads "low / overconfident").
    - The trend chart has a data-table or text-series equivalent reachable by keyboard and screen reader.
    - Animated progress rings/reveals honor `prefers-reduced-motion` with static equivalents.
  - *Business rules / validation:* All interactive controls (range selector, sort, drill-in) are keyboard-reachable and labelled. Delta arrows carry a text label, not a glyph-only meaning.
  - *Failure & edge cases:* If a chart fails to render, the text/table fallback still conveys the numbers. Focus after opening a signal breakdown moves predictably to the breakdown heading.

- **[ANALYTICS-18] As a Compliance / Data-Protection Officer, I want honest signals treated as sensitive personal data across export, retention, and deletion, so that Progress data meets DSAR, retention, and FERPA/COPPA obligations.** — *Priority:* Should-Have — *Why this priority:* Calibration/blind-spot data is genuinely sensitive and Teams/school tenants make the obligation real, but it can follow the core reporting surface.
  - *Acceptance criteria:*
    - A learner's DSAR export includes derived signal data (retention/transfer/calibration/drill history), not just the profile row.
    - A Danger-zone "reset history" / account deletion cascades to the derived signals and their aggregates, verified as actually gone.
    - Signal retention respects the tenant's configured window and minor-account constraints.
  - *Business rules / validation:* The DPO governs personal-data and retention policy but never a signal's value (advisory/gatekeeping, not epistemic). Deletion reaches derived and aggregated data, but roll-ups must recompute correctly after one learner's data is removed.
  - *Failure & edge cases:* Deleting one learner's data from a cohort aggregate must not corrupt the remaining cohort's signals. A retention-driven purge that races a live report request returns "no longer available" for the purged slice, not partial stale data.

- **[ANALYTICS-19] As a Returning Power-Learner, I want a portfolio roll-up that summarizes signals across all my topics at once, so that I can steer months of study without opening each topic.** — *Priority:* Nice-to-Have — *Why this priority:* Valuable for the heavy multi-topic persona, but the per-topic table (ANALYTICS-03) already covers the core need for MVP.
  - *Acceptance criteria:*
    - A single roll-up shows portfolio-wide signal averages and the count of topics in healthy / watch / weak bands.
    - It highlights the biggest movers (most-improved and most-declined topics) over the selected window.
    - It links each band into the filtered per-topic list.
  - *Business rules / validation:* Roll-up averages are weighted transparently (the weighting is disclosed) and use the same low-confidence handling as individual signals. Free-plan learners see only their entitled topics.
  - *Failure & edge cases:* A portfolio with a single topic shows the topic directly rather than a degenerate "average of one." Topics with only low-confidence signals are excluded from the average with disclosure.

- **[ANALYTICS-20] As a Self-directed Learner, I want the Progress screen to fail honestly when a signal can't be computed or is stale, so that I never act on a silently-wrong number.** — *Priority:* MVP — *Why this priority:* A shipped, trust-branded surface must degrade transparently; a stale or wrong number here directly contradicts the product's promise. *(Failure scenario.)*
  - *Acceptance criteria:*
    - If the compute job fails or is delayed, the affected card shows "couldn't refresh — showing values as of <timestamp>" rather than a blank or a guessed value.
    - Each signal carries an "as of" freshness indicator when it lags the latest activity.
    - A total analytics outage shows a clear error state with retry, never a default all-zeros dashboard.
  - *Business rules / validation:* A displayed signal must always be attributable to a real computed snapshot with a timestamp; the UI never invents or extrapolates a value to fill a gap. Stale data is labelled, not silently served as current.
  - *Failure & edge cases:* Offline mode shows the last cached snapshot with its "as of" time and an offline banner. A signal that just changed upstream (a new review) but hasn't recomputed shows the prior value with a "recomputing" hint, not a flicker to zero.

- **[ANALYTICS-21] As a Self-directed Learner, I want optional digest notifications when a signal moves materially, so that I'm nudged to act on a real decline without having to check the dashboard.** — *Priority:* Nice-to-Have — *Why this priority:* A helpful accelerant that increases return visits, but the learner can already read the same signals on demand.
  - *Acceptance criteria:*
    - The learner can opt into digests (e.g. "retention on Merkle trees dropped below your target") delivered via Notifications.
    - Each digest names the signal, the topic, and the direction, and links to the fix.
    - Digests fire only on material, above-noise changes — not on every minor fluctuation.
  - *Business rules / validation:* Digest delivery is owned by the Notifications domain; this domain provides the material-change events and the copy. No digest may report a vanity metric or a low-confidence blip as a material change.
  - *Failure & edge cases:* A signal that oscillates around a threshold must be debounced so the learner isn't spammed with "dropped/recovered" pairs. Opting out silences digests immediately.

### Business rules & invariants

- **Four honest signals, no vanity metrics.** The headline reporting set is exactly Retention, Transfer, Calibration, and Drill-detection. Streaks, points, minutes, and badges may exist elsewhere (Dashboard, My Tasks) but must never appear at the visual weight of, or be substituted for, an honest signal.
- **Every signal is provenance-backed.** No signal renders without a discoverable breakdown tracing it to the real events (reviews, tasks, tests, drills) that produced it. Opaque scores are prohibited.
- **This domain aggregates; it does not mint.** Raw data-points are produced by Review/FSRS (retention, calibration, drill-detection), Tasks (transfer), and Tests (retention/transfer movement). Analytics computes rollups and displays — it never authors a data-point.
- **Honest failure over fabricated precision.** Below a minimum sample a signal is shown low-confidence or as "not enough data yet," never as a precise fabricated number and never as a fake 0%/100%. Empty state is distinct from a real zero.
- **Freshness is explicit.** Every displayed value is attributable to a timestamped snapshot; stale or un-recomputable signals are labelled "as of <time>" / "couldn't refresh," never silently served as current.
- **Epistemic firewall.** No one — Support, Instructor, ORG-ADMIN, PLATFORM-ADMIN, T&S — can hand-set or edit a signal's value. T&S may void/quarantine/freeze gamed data-points (triggering recompute); Support may restore genuinely-lost state from a checkpoint; neither can fabricate.
- **Visibility is policy-gated and server-enforced.** Per-learner signal exposure to educators/managers is default-private and requires the ORG-ADMIN's progress-visibility policy; enforcement is server-side, and COMPLIANCE-DPO can override to more-restrictive for minors/jurisdictions. Cohorts too small to anonymize are suppressed.
- **Sensitive personal data.** Honest signals (especially calibration/blind-spot) are sensitive; they are included in DSAR export, honor retention windows, and cascade on reset/deletion — with aggregates recomputing correctly after individual removal.
- **Learner owns external sharing.** Any signal leaving the learner's account requires explicit, scoped, revocable consent; deeper signals are off by default; revocation propagates to live shares and API consumers.
- **Guests have no reports.** Ephemeral demo activity persists nothing and generates no honest signals.
- **Anti-gaming is detection-then-recompute, not overwrite.** Defenses void manipulated inputs and recompute the aggregate; they never replace a gamed value with a hand-chosen "true" one, and they must protect good-faith adversarial learners from false positives.

### Cross-domain dependencies

**This domain consumes from:**
- **Review / FSRS + Calibration** — the Retention, Calibration, and Drill-detection data-points are born there; this domain reads and aggregates them.
- **Tasks (rubric grading)** — the Transfer signal's primary inputs (applying ideas to new problems, graded against evidence).
- **Tests & Certificates** — test results that move Retention/Transfer, plus completion and certificate counts displayed in org ROI reporting (issuance/verification owned there).
- **Conflicts & Trust Ledger** — the per-topic **Verified** trust-coverage % shown in the breakdown table.
- **Gap Map** — targets for "Where to focus" links (open misconceptions to close).
- **Topic/Library & Plan entitlements** — which topics appear (Free ≤3; Teams shared library and cohort scope).
- **Settings / Privacy & Consent** — the confidence-gate toggle (affects calibration availability), share consent, and reset-history behavior.
- **Org policy (ORG-ADMIN)** — the progress-visibility policy this domain must enforce.
- **Auth / Identity** — learner identity and the guest boundary (no persisted signals).

**This domain provides to:**
- **Learner (self-knowledge)** — the actionable Progress surface driving what to study next.
- **Instructor / Teams** — cohort and (policy-permitting) per-learner honest-signal views for finding weak spots.
- **ORG-ADMIN / Billing** — aggregate honest-signal movement + completion/cert counts as the ROI story (translated for finance without exposing content).
- **Tests domain** — the retention/calibration inputs underlying predicted readiness (computed there, read from here's data).
- **Notifications** — material-signal-change events for optional digests.
- **Trust & Safety / Compliance** — signal-gaming detection surfaces and the sensitive-data audit/export/retention hooks.
- **External sharing / Certificates** — a learner-consented progress share that complements the public certificate verify page.

### Key technical requirements

- **Aggregation pipeline & provenance store.** A compute layer that rolls raw data-points (review outcomes, task grades, test results, drill hits) into per-signal, per-topic, per-cohort, and per-org aggregates, while retaining a traceable link from each aggregate back to its contributing events for the explainability drill-in.
- **Snapshotting & freshness.** Every served signal carries an "as of" timestamp; recomputation is incremental on new events with a bounded lag, and the UI degrades to the last snapshot (labelled) on compute failure or offline — never to a fabricated value.
- **Low-confidence & robust statistics.** Per-signal minimum-sample thresholds, outlier-robust aggregation, and low-confidence flagging applied consistently at learner, cohort, and org levels.
- **Multi-level roll-ups with anonymity floors.** Cohort/org aggregation that enforces a minimum group size before reporting, suppressing or coarsening data that would re-identify an individual.
- **Server-enforced visibility & consent.** Access control that gates per-learner vs. aggregate exposure against the tenant's progress-visibility policy and learner share consents server-side (not UI-hidden), with immediate propagation on policy/consent change and full audit logging of any per-learner exposure.
- **Immutability & anti-fabrication permissions.** No role can write a signal value directly; T&S void/quarantine actions and Support checkpoint-restores are the only mutations, both permission-gated, reversible, and audit-logged, with recompute (not overwrite) semantics.
- **Anti-gaming detection.** Statistical monitors for calibration-juking, drill memorization, streak-farming, and vote-ring effects, tuned for a low false-positive rate against good-faith skeptics, feeding T&S freeze/void with recompute.
- **Privacy, retention & DSAR.** Signals classified as sensitive personal data: included in export, subject to retention windows and minor constraints, and cascaded on reset/deletion with correct aggregate recomputation after individual removal.
- **Accessibility of data viz.** Non-color-only, ARIA/text-and-table equivalents for charts, deltas, and calibration direction; keyboard-reachable range/sort/drill controls; `prefers-reduced-motion` alternatives for animated rings and reveals.
- **Event feed to Notifications.** Debounced, above-noise material-change events (with copy and deep links) that never surface vanity or low-confidence blips.

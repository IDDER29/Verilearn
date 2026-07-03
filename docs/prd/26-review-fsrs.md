## Retention: Spaced Review (FSRS), Confidence & Calibration

### Overview

Spaced review is where VeriLearn fights forgetting — but it fights it *honestly*. A conventional flashcard app schedules cards and calls it a day; VeriLearn wraps every review in two verification-first mechanics that the rest of the product's thesis depends on. First, a **confidence gate**: before a card's answer is revealed, the learner must commit **Sure / Unsure / Guessing**, and reveal stays hard-locked until they do. Committing first is the *only* thing that makes calibration — predicted confidence vs. actual recall — measurable rather than a post-hoc rationalization. Second, the answer the learner sees is not an ungrounded assertion: it carries its **trust state and cited source** (e.g. "Verified · CLRS §24.3"), the same ledger entry the lecture used. A review card is a claim that survived the Skeptic, resurfaced on an FSRS schedule.

On top of that spine the domain adds **FSRS scheduling** (ratings Again / Hard / Good / Easy that set the next interval against a learner-chosen target retention), **seeded error-drills** ("spot the error" cards that salt a deliberately false claim into the stream to test whether the learner can *catch* a wrong claim, not just recall a right one — the Drill-detection / blind-spot signal), a **misconception branch** ("I had the wrong idea" / an Again rating routes into the Gap Map), and a **Discuss** path where a learner can push back on a card's answer and get sourced pushback from the Skeptic that can be promoted into a Conflict.

This domain matters because retention and metacognition are two of VeriLearn's **four honest signals** (Retention, Transfer, Calibration, Drill-detection). Three of the four are *born here*. The domain owns: the Review session loop (front → confidence gate → reveal → FSRS rating), the Review Reveal calibration check, the Discuss-this-answer thread, the Session Complete summary, and the Review/FSRS settings (target retention, daily limits, max interval, gate/drill/reminder toggles). It explicitly does **not** own: how a claim earns its trust state (Pipeline/Skeptic/Sandbox), rubric-graded Tasks (Tasks domain), the misconception lifecycle board itself (Gap Map), formal timed Tests and certificates (Tests domain), or the Progress report surface (Reports) — it *feeds and consumes* those.

### Personas involved

- **Returning Power-Learner (LEARNER-POWER)** — the domain's primary inhabitant; lives in the FSRS/retention engine and calibration, managing review debt across a large multi-topic portfolio over months, and tuning target retention and daily limits.
- **Self-directed Learner (LEARNER-SELF)** — the default reviewer running the daily confidence-gated loop on Free's 3 topics; the persona most first-run and happy-path stories are written for.
- **Exam-prep Student (LEARNER-EXAM)** — deadline-driven; uses "review ahead" to cram verified cards before a fixed date and watches retention/blind-spot as a readiness proxy alongside Tests.
- **Skeptical / Expert Learner (LEARNER-SKEPTIC)** — challenges a card's revealed answer via Discuss, gets sourced Skeptic pushback, and escalates a genuinely wrong card into a Conflict without breaking their streak.
- **Team Seat Learner (LEARNER-TEAM)** — reviews cards drawn from a shared, pre-curated topic library; inherits the cards' trust states and contributes wrong-idea branches into the team's shared gaps.
- **Accessibility-Reliant Learner (A11Y-LEARNER)** — a core stress test, not an edge case: the confidence gate, the color-coded ratings, the timed-interval labels, and the "reveal locked" state must all be operable and legible via assistive tech, with no purely timed lockout.
- **The Skeptic (SKEPTIC-AI)** — powers the Discuss thread with sourced pushback and supplies the false claims used in seeded error-drills; it can raise a Conflict from a challenged card but cannot itself certify a card or resolve its own dispute.
- **Verification Pipeline (VERIFY-PIPELINE)** — generates review cards only from the topic's Verified·execution / Verified·source / Sourced claims, carrying each card's source citation.
- **Execution Sandbox (EXEC-SANDBOX)** — origin of Verified·execution cards (e.g. "correctness proof" cards) whose answer is backed by a reproducible run, not a citation alone.
- **Subject-Matter Expert / Content Reviewer (SME-REVIEWER)** — adjudicates a Conflict that a challenged review card escalates into, and whose trust-state changes trigger a card's suspension/recompute.
- **Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD)** — defends the calibration and retention signals against gaming (calibration-juking, streak-farming, drill-answer memorization) and can freeze a manipulated signal.
- **Support Agent (SUPPORT-AGENT)** — restores a wrongly-lost streak or unbreaks a stuck scheduler under scoped consent, firewalled from ever fabricating a calibration score, a rating, or a review that did not happen.
- **Compliance / Data-Protection Officer (COMPLIANCE-DPO)** — governs review history, FSRS state, and calibration data as personal data (DSAR export, retention windows, reset-history in the Danger zone, minor-account handling).

Referenced but owned elsewhere: **Instructor (INSTRUCTOR)** reads the retention/calibration/blind-spot signals surfaced on Progress (Reports domain); **Guardian (GUARDIAN)** and daily-reminder delivery touch Notifications; **Employer/Recruiter** trusts a certificate whose Test drew from the same verified base cards are drawn from (Tests domain).

### User stories

- **[REVIEW-01] As a Self-directed Learner (LEARNER-SELF), I want my first review session to explain the confidence gate before I use it, so that I understand why I'm committing a confidence level before seeing the answer.** — *Priority:* MVP — *Why this priority:* The confidence gate is the domain's signature mechanic and is meaningless if the first-time learner treats it as friction.
  - *Acceptance criteria:*
    - The first review session shows a one-time primer explaining that committing Sure/Unsure/Guessing first is what makes calibration honest, dismissible and not shown again.
    - The session header shows position (e.g. "Card 1 of 4"), an estimated time, and a progress indicator.
    - After the primer, the learner lands on the first card front with the gate visible and the reveal locked.
  - *Business rules / validation:* A session only starts when at least one card is due (or the learner explicitly chose "review ahead"). The primer is per-account, not per-topic.
  - *Failure & edge cases:* If the learner abandons the first session before rating any card, the primer still counts as seen (not re-shown), and no partial calibration data is recorded for un-revealed cards.

- **[REVIEW-02] As a Self-directed Learner (LEARNER-SELF), I want the answer reveal locked until I commit Sure, Unsure, or Guessing, so that I can't retroactively tell myself I "knew it."** — *Priority:* MVP — *Why this priority:* Commit-before-reveal is the invariant that makes the entire calibration signal trustworthy; without the lock the metric is worthless.
  - *Acceptance criteria:*
    - The "Show answer" control is disabled and labeled ("Pick a confidence level to reveal") until one of the three levels is selected.
    - Selecting a level records the commitment (level + timestamp) and unlocks reveal in the same interaction.
    - The committed level is displayed on the revealed card (e.g. "You said: Sure") and cannot be edited after reveal.
  - *Business rules / validation:* Exactly one of {Sure, Unsure, Guessing} per card per review; the commitment is immutable once reveal happens. If the gate is disabled in Settings (REVIEW-14), reveal is not locked and the card contributes no calibration data-point.
  - *Failure & edge cases:* A learner who reloads the page after committing but before revealing keeps the commitment (it is not re-solicited); attempting to reach the reveal route directly (deep-link) without a commitment redirects back to the gated front.

- **[REVIEW-03] As a Self-directed Learner (LEARNER-SELF), I want the revealed answer to show its trust state and cited source, so that a review reinforces verified knowledge rather than an unsourced assertion.** — *Priority:* MVP — *Why this priority:* A review card resurfaces a ledger claim; showing its source is what distinguishes VeriLearn review from a generic flashcard.
  - *Acceptance criteria:*
    - The revealed answer shows the trust badge (e.g. "Verified · execution" or "Verified · source") and a specific citation (e.g. "CLRS §24.3 (cut property)").
    - The card front carries a "Verified card" marker so the learner knows it derives from a survived claim before revealing.
    - The citation is the same source object the lecture/Sources coverage matrix uses, not a re-derived one.
  - *Business rules / validation:* Every review card MUST reference exactly one claim whose current trust state is Verified·execution, Verified·source, or Sourced (see REVIEW-15). Sourced (not independently proven) cards are visibly distinguished from Verified ones.
  - *Failure & edge cases:* If the card's underlying source has been revoked or the claim disputed since the card was scheduled, the card is pulled from the session and recomputed rather than showing a stale/false answer (see REVIEW-16).

- **[REVIEW-04] As a Self-directed Learner (LEARNER-SELF), I want to rate my recall Again / Hard / Good / Easy after reveal and see the next interval each choice yields, so that the schedule reflects how well I actually knew it.** — *Priority:* MVP — *Why this priority:* FSRS rating is the scheduling core of the entire retention loop.
  - *Acceptance criteria:*
    - After reveal, four rating buttons are shown, each with its resulting next-review interval (e.g. Again "< 1 min", Hard "2 days", Good "4 days", Easy "9 days").
    - Selecting a rating advances FSRS state, schedules the next occurrence, and moves to the next card (or Session Complete on the last).
    - Intervals shown are computed from the card's actual FSRS parameters and the learner's target-retention setting, not fixed placeholders.
  - *Business rules / validation:* A rating is only accepted after the answer has been revealed (which requires a prior confidence commit). Each card advances FSRS exactly once per review (idempotent — double-tap or retry does not double-schedule). The interval respects the learner's configured max interval (REVIEW-13).
  - *Failure & edge cases:* If scheduling fails to persist, the rating is queued locally and the card is not marked reviewed until confirmed (see REVIEW-17); an interrupted rating never silently defaults to "Good."

- **[REVIEW-05] As a Returning Power-Learner (LEARNER-POWER), I want a calibration check that compares my committed confidence to whether I actually recalled it, so that I learn where my self-assessment is miscalibrated.** — *Priority:* MVP — *Why this priority:* Calibration is one of the four honest signals and the payoff of the confidence gate; it is the reason the gate exists.
  - *Acceptance criteria:*
    - On reveal, a calibration verdict is shown pairing the commit with the outcome (e.g. "Well calibrated — you felt Sure and got it right", or "Overconfident — you felt Sure but rated Again").
    - Each card contributes one calibration data-point (predicted level × actual recall) to the aggregate calibration signal.
    - The check names the direction of miscalibration (overconfident vs. underconfident), not just a binary right/wrong.
  - *Business rules / validation:* Calibration is only computed for cards where a genuine commit-then-reveal occurred; drill cards and disabled-gate cards are excluded from the calibration signal. "Actual recall" is derived from the FSRS rating (Again/Hard ≈ miss-leaning, Good/Easy ≈ hit-leaning) per a fixed mapping, applied uniformly.
  - *Failure & edge cases:* With too few data-points, the aggregate shows "not enough data yet" rather than a noisy percentage; a Discuss-driven challenge that overturns a card (REVIEW-08) does not retroactively punish the learner's calibration for that card.

- **[REVIEW-06] As a Self-directed Learner (LEARNER-SELF), I want seeded "spot the error" drills mixed into my reviews, so that I practice catching a wrong claim instead of only recalling right ones.** — *Priority:* MVP — *Why this priority:* Drill-detection (blind-spot) is the fourth honest signal and a direct expression of the verification-first thesis in the retention loop.
  - *Acceptance criteria:*
    - Some review items are seeded error-drills that present a deliberately false claim; the learner must flag it as wrong (and ideally say why) rather than recall an answer.
    - Catching a seeded error increments a visible blind-spot score (e.g. "6 / 9 caught"); missing one is recorded as a blind spot.
    - A missed drill (learner accepted a false claim) is eligible to open a Gap Map entry (origin: review blind-spot).
  - *Business rules / validation:* The false claim in a drill is a controlled negation of a verified claim, supplied/approved via the Skeptic, and is never allowed to leak into the ledger as a real claim. Drills do not carry FSRS scheduling weight the way real cards do and never count toward calibration. Seeded drills can be disabled in Settings (REVIEW-14).
  - *Failure & edge cases:* A learner who pattern-memorizes "always flag the drill" is countered by mixing true claims into the same "is this right?" framing so blind flagging is penalized; drill answers are never revealed in a way that trains the wrong claim as correct.

- **[REVIEW-07] As a Self-directed Learner (LEARNER-SELF), I want an Again rating or an explicit "I had the wrong idea" to branch into the misconception path, so that a mistaken belief becomes a tracked gap instead of just a shorter interval.** — *Priority:* MVP — *Why this priority:* Routing wrong ideas into the Gap Map is what turns review from rote repetition into misconception repair.
  - *Acceptance criteria:*
    - The revealed card offers an "I had the wrong idea" action distinct from the FSRS rating row.
    - Choosing it (or rating Again in a misconception-eligible way) emits a Gap Map event tagged origin=review with a jump-back to the exact lecture section the card derives from.
    - The card is rescheduled to resurface soon (short interval) and can link to a targeted micro-remediation.
  - *Business rules / validation:* "Wrong idea" branching creates or updates a Gap Map object (Open); it does not itself certify anything or change the card's trust state. It never breaks the learner's streak.
  - *Failure & edge cases:* If the lecture section anchor is missing (topic edited), the jump-back degrades to the parent lecture; a duplicate wrong-idea on an already-Open gap updates that gap rather than spawning a second one.

- **[REVIEW-08] As a Skeptical / Expert Learner (LEARNER-SKEPTIC), I want to challenge a card's revealed answer and get sourced pushback from the Skeptic, so that a card I believe is wrong can be escalated instead of silently accepted.** — *Priority:* Should-Have — *Why this priority:* Disagreement-as-first-class is central to the product, but the core review loop functions without the Discuss thread.
  - *Acceptance criteria:*
    - "Discuss this answer" opens a thread showing the challenged claim, its current trust badge, and a Skeptic reply that cites sources and states where the challenge leaves the claim (stands / needs clarification / becomes a Conflict).
    - The learner can then choose: Raise a Conflict (escalate to topic/SME adjudication), Track as a gap (Gap Map), or Accept & continue (back to review).
    - Challenging a card never breaks the streak; a challenge that surfaces a real gap can earn a calibration/credit boost.
  - *Business rules / validation:* The Skeptic can propose a clarification or raise a Disputed/Interpretive Conflict but cannot itself certify or resolve it — resolution routes to SME-REVIEWER. A raised Conflict follows the Conflicts domain lifecycle; this domain only originates it. Skeptic hard mode in Discuss is a Pro capability.
  - *Failure & edge cases:* If the Skeptic service is unavailable, the learner can still file the challenge as a Conflict/gap asynchronously (no live reply required) rather than being blocked; prompt-injection embedded in the learner's message is treated as data, never executed.

- **[REVIEW-09] As a Self-directed Learner (LEARNER-SELF), I want a session-complete summary with my ratings breakdown, errors caught, calibration, and next-review date, so that I close the session knowing what I did and what's next.** — *Priority:* MVP — *Why this priority:* The completion screen is the loop's reward and the bridge to the next session; it makes the honest signals concrete.
  - *Acceptance criteria:*
    - Session Complete shows cards reviewed, seeded errors caught (e.g. "2 / 2"), a session calibration figure, and the current day-streak.
    - An FSRS ratings breakdown (Again/Hard/Good/Easy counts) is shown with a note on what recurs soon (e.g. "one card marked Hard comes back tomorrow").
    - The next scheduled batch (date + card count + topics) is shown, plus "Back to dashboard" and "Review ahead."
  - *Business rules / validation:* Summary figures reflect only cards actually rated this session; a session with zero rated cards routes to the empty/all-caught-up state instead (REVIEW-18). Streak increments once per qualifying day, not per session.
  - *Failure & edge cases:* If some ratings are still syncing (offline), the summary shows a "syncing" state and reconciles rather than displaying wrong totals; abandoning mid-session still records the cards already rated (no all-or-nothing loss).

- **[REVIEW-10] As a Returning Power-Learner (LEARNER-POWER), I want in-session progress (a ring, "up next," due count, and blind-spot tally) visible while I review, so that I can pace a large session and know how much remains.** — *Priority:* MVP — *Why this priority:* Session orientation is essential for the power-learner clearing sizable daily batches.
  - *Acceptance criteria:*
    - A session ring shows reviewed/total and an estimated time remaining; an "Up next" list previews the next few items and their type (flashcard / seeded drill / proof).
    - A running blind-spot tally (errors caught / total drills) is visible during the session.
    - The ring and counts update immediately on each rating.
  - *Business rules / validation:* "Total" reflects the cards pulled into this session (bounded by the daily review limit), not the entire backlog. Up-next ordering is deterministic within a session.
  - *Failure & edge cases:* If a card is pulled mid-session (source revoked, REVIEW-16), the total decrements and the ring recomputes rather than stranding an unreachable count.

- **[REVIEW-11] As an Exam-prep Student (LEARNER-EXAM), I want to "review ahead" of the schedule before a deadline, so that I can reinforce verified cards on my timeline instead of waiting for them to come due.** — *Priority:* Should-Have — *Why this priority:* Deadline cramming is a real learner need, but it is a modifier on the core scheduled loop.
  - *Acceptance criteria:*
    - "Review ahead" starts a session of not-yet-due cards (prioritized by lowest predicted retention / soonest-due first).
    - Early reviews still pass through the confidence gate and record FSRS ratings and calibration normally.
    - The UI is honest that early review yields diminishing scheduling benefit (FSRS may return a modest interval bump), avoiding the illusion that cramming resets everything.
  - *Business rules / validation:* Early ratings feed FSRS with the actual elapsed interval so the algorithm isn't fooled into over-lengthening; review-ahead respects the daily review limit unless the learner explicitly overrides it.
  - *Failure & edge cases:* If there are no not-yet-due cards either, the learner sees "nothing to review ahead" rather than an empty session; abuse-scale mass early-review is rate-limited (REVIEW-20).

- **[REVIEW-12] As a Returning Power-Learner (LEARNER-POWER), I want a cross-topic view of what's due across my whole portfolio, so that I can clear review debt without walking topic by topic.** — *Priority:* MVP — *Why this priority:* The power-learner's home is the aggregate retention engine; a per-topic-only view doesn't serve a large portfolio.
  - *Acceptance criteria:*
    - A due surface aggregates cards due today / this week across all topics with counts and per-topic breakdown, entering a combined review session.
    - Overdue cards are distinguished from due-today, and the total respects the daily limit with a clear "N more beyond today's limit."
    - Starting from the aggregate view launches a mixed-topic session that still shows each card's source topic.
  - *Business rules / validation:* The aggregate spans only topics the learner has access to (own Free/Pro topics, or shared-library topics for Teams). Counts are per learner.
  - *Failure & edge cases:* An empty portfolio (no topics) shows an onboarding empty state; a portfolio with everything reviewed shows "all caught up" (REVIEW-18).

- **[REVIEW-13] As a Returning Power-Learner (LEARNER-POWER), I want to tune target retention, daily review limit, and max interval, so that I can trade off workload against how solidly I remember.** — *Priority:* Should-Have — *Why this priority:* Tuning is central to the power-learner but the loop ships with sane defaults without it.
  - *Acceptance criteria:*
    - Settings expose a target-retention slider (bounded, e.g. 80–95%), a daily review limit, and a max interval, each with plain-language consequence copy ("higher = remember more, review more often").
    - Changing target retention recomputes future intervals via FSRS; changes are explicitly saved (Save/Reset), not silently applied.
    - The daily limit caps how many cards a session/aggregate pulls; the max interval caps the longest gap FSRS may schedule.
  - *Business rules / validation:* Target retention is clamped to the allowed range; values are per-learner and apply across their topics. Retention target does not change trust states or which claims are eligible — only scheduling.
  - *Failure & edge cases:* Setting an aggressive target that explodes the backlog surfaces a warning ("this will make ~N cards due tomorrow") before saving; invalid/empty numeric inputs are rejected with the prior value retained.

- **[REVIEW-14] As a Self-directed Learner (LEARNER-SELF), I want to toggle the confidence gate, seeded error-drills, and the daily reminder, so that I can shape the review experience to how I like to study.** — *Priority:* Should-Have — *Why this priority:* Control over the gates respects learner autonomy, though the honest defaults are on.
  - *Acceptance criteria:*
    - Toggles for confidence gate, seeded error-drills, and daily reminder persist and take effect on the next session.
    - Disabling the confidence gate is honestly labeled as turning off calibration measurement (those cards stop contributing a calibration signal).
    - The daily-reminder toggle governs whether a "reviews due" nudge is requested from Notifications.
  - *Business rules / validation:* Disabling the gate does not delete prior calibration history; it stops new data. Disabling drills stops new blind-spot data-points. Reminder delivery is owned by Notifications; this domain only sets the preference and emits due events.
  - *Failure & edge cases:* If a learner disables the gate and re-enables it later, the calibration signal resumes accumulating without back-filling the gap (and says so); reminder preference persists even if notification delivery is separately blocked at the OS/channel level.

- **[REVIEW-15] As a Self-directed Learner (LEARNER-SELF), I want review cards drawn only from claims that survived verification, so that I never spend spaced-repetition effort memorizing something disputed or unsupported.** — *Priority:* MVP — *Why this priority:* Reviewing only survived claims is the retention-side expression of the trust ledger and a hard product invariant.
  - *Acceptance criteria:*
    - Every card references a claim currently in state Verified·execution, Verified·source, or Sourced; Disputed, Unsupported, and Interpretive claims produce no review cards.
    - A newly-verified topic's cards become reviewable only after the pipeline completes and the claim base exists.
    - The card's badge accurately reflects its claim's trust state (Verified vs. merely Sourced).
  - *Business rules / validation:* Card eligibility is recomputed from live trust states; a claim demoted to Disputed makes its card ineligible immediately (see REVIEW-16). No card is fabricated for a topic lacking any verifiable claim.
  - *Failure & edge cases:* A topic where all claims are Unsupported yields no review deck and an honest empty state, not filler cards.

- **[REVIEW-16] As a Subject-Matter Expert / Content Reviewer (SME-REVIEWER), I want a card automatically suspended and its schedule recomputed when its underlying claim's trust state changes or its source is revoked, so that no learner keeps reviewing a claim that no longer holds.** — *Priority:* Should-Have — *Why this priority:* Ledger changes must propagate into the retention loop to keep review honest, but it is a consistency guarantee layered on the MVP loop.
  - *Acceptance criteria:*
    - When a claim is disputed/retracted or its source revoked, its card is removed from due queues and any in-flight session, and marked suspended.
    - If the claim is later re-verified, the card is restored with its FSRS history intact (not reset to new).
    - The affected learner is notified when a card they were reviewing is suspended, with the reason.
  - *Business rules / validation:* Suspension is driven by trust-ledger events, not manual card editing; a suspended card contributes no new scheduling, calibration, or drill data. This domain reacts to state changes; it never sets a trust state itself.
  - *Failure & edge cases:* A card suspended mid-session is skipped gracefully (ring recomputes, REVIEW-10); if the ledger event arrives after the learner already rated the now-invalid card, that data-point is invalidated rather than kept.

- **[REVIEW-17] As a Self-directed Learner (LEARNER-SELF), I want my confidence commits and FSRS ratings preserved if I go offline or lose connection mid-session, so that I never lose progress or unfairly break my streak.** — *Priority:* MVP — *Why this priority:* Review happens on the go; silent data loss or a wrongly-broken streak destroys trust in the retention engine. (Explicit failure scenario.)
  - *Acceptance criteria:*
    - Commits and ratings are captured locally and reconciled to the server on reconnect; no rated card is lost on a dropped connection or tab close.
    - The UI clearly shows an offline/syncing state instead of pretending success or silently failing.
    - A day's streak is not broken by a sync that lands after midnight due to connectivity, if the qualifying reviews happened in-day.
  - *Business rules / validation:* Reconciliation is idempotent (a rating that synced once is not double-applied); on conflict across devices, last-writer-wins with the earliest in-day timestamp preserved for streak purposes.
  - *Failure & edge cases:* If a card was suspended server-side (REVIEW-16) while the learner rated it offline, the offline rating is discarded on reconcile with a clear notice; unrecoverable local data (cleared storage) fails to a "couldn't restore last session" message, never a fabricated result.

- **[REVIEW-18] As a Self-directed Learner (LEARNER-SELF), I want an honest "all caught up" state when nothing is due, so that I'm not pushed into busywork or shown fake cards.** — *Priority:* MVP — *Why this priority:* An honest empty state is consistent with the no-vanity-metrics ethos and prevents over-review. (Edge scenario.)
  - *Acceptance criteria:*
    - When no cards are due, the learner sees a clear caught-up state showing the next due date and a "review ahead" option (if any not-yet-due cards exist).
    - The state never manufactures due cards to fill a session.
    - From caught-up, the learner can jump to a topic, tasks, or the dashboard.
  - *Business rules / validation:* "Nothing due" is computed against the learner's schedule and daily limit; review-ahead is offered only when eligible cards exist.
  - *Failure & edge cases:* A brand-new learner with no topics sees an onboarding-flavored empty state (create a topic first), distinct from a caught-up state.

- **[REVIEW-19] As a Returning Power-Learner (LEARNER-POWER), I want a humane way to handle a large backlog after time away, so that returning to review debt feels recoverable rather than punishing.** — *Priority:* Should-Have — *Why this priority:* Backlog collapse is the classic SRS failure mode that drives churn; handling it well retains the power-learner. (Explicit failure scenario.)
  - *Acceptance criteria:*
    - After an absence, overdue cards are capped by the daily limit and prioritized (most-overdue / lowest-retention first) rather than dumping the entire backlog at once.
    - The UI frames the backlog as a plan ("clear N/day for a few days") instead of a single overwhelming number.
    - Streak loss from absence is stated plainly without additional penalty to FSRS correctness.
  - *Business rules / validation:* Overdue cards feed FSRS with true elapsed time so scheduling stays correct; there is an option to "reschedule/spread" a backlog that does not fabricate reviews. No auto-marking of un-reviewed cards as passed.
  - *Failure & edge cases:* An extreme backlog (thousands of cards) never blocks the app with a giant session; the aggregate view paginates and the daily limit governs. Bulk "spread" is confirmed, reversible where feasible, and audit-logged.

- **[REVIEW-20] As a Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD), I want to detect and neutralize gaming of the calibration, streak, and blind-spot signals, so that the honest signals stay honest.** — *Priority:* Should-Have — *Why this priority:* The signals are only valuable if they can't be juked; protecting them defends the whole thesis. (Explicit abuse/failure scenario.)
  - *Acceptance criteria:*
    - Patterns like always-committing "Guessing" then rating Easy (calibration-juking), rapid-fire ratings faster than plausible reading, and streak-farming via trivial early reviews are flagged.
    - A flagged signal can be quarantined/frozen from Progress and shared aggregates without deleting the underlying review history.
    - Suspicious drill behavior (blind-flagging every item) degrades the blind-spot score rather than inflating it.
  - *Business rules / validation:* T&S can freeze/annotate a manipulated signal but can never hand-set a "correct" calibration or fabricate a rating. All freezes are audit-logged with actor and reason. Detection thresholds are tenant-configurable but conservative to avoid false positives.
  - *Failure & edge cases:* A false-positive flag is appealable and reversible; a genuinely fast expert (legitimately quick recall) is distinguished from a bot by cross-signal checks, not speed alone.

- **[REVIEW-21] As a Support Agent (SUPPORT-AGENT), I want to restore a wrongly-lost streak or unbreak a stuck scheduler under scoped consent, so that operational glitches don't cost a learner their standing — without me ever inventing a learning signal.** — *Priority:* Should-Have — *Why this priority:* Operational recovery is necessary trust-repair, but it must be firewalled from fabricating epistemic/retention data. (Explicit recovery/failure scenario.)
  - *Acceptance criteria:*
    - With learner consent, support can requeue a stuck review session, restore a streak lost to a documented outage, and re-run a failed sync.
    - Support actions are scoped, time-boxed, audit-logged (actor, scope, reason), and visible to the learner.
    - Support cannot create a rating, set a calibration score, mark a card reviewed that wasn't, or issue any signal — only restore state that provably existed.
  - *Business rules / validation:* Restoration is evidence-based (from logs/prior state), never invented. Consent is required and revocable; the firewall against fabricating a learning signal is absolute (mirrors the persona's hard boundary).
  - *Failure & edge cases:* If prior state is unrecoverable, support communicates that honestly rather than approximating; a streak restore that would conflict with anti-gaming flags (REVIEW-20) is escalated to T&S, not silently granted.

- **[REVIEW-22] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want the confidence gate, ratings, and locked-reveal state fully operable via assistive tech with no color-only or timed-only encoding, so that I can run the whole retention loop.** — *Priority:* MVP — *Why this priority:* The domain's color/spatial/timed encoding is called out as a core stress test; an inaccessible gate excludes learners from the signature loop. (Explicit accessibility requirement.)
  - *Acceptance criteria:*
    - Confidence levels and FSRS ratings convey state via text/icon/ARIA, not color alone; the locked-reveal state is announced ("reveal locked — choose a confidence level"), not implied only by a dimmed button.
    - The full loop (commit → reveal → rate → next) is keyboard-operable with a logical focus order and visible focus; interval labels are screen-reader legible.
    - No step imposes a purely timed lockout that a learner using assistive tech cannot satisfy; any timing is generous and non-blocking.
  - *Business rules / validation:* WCAG AA contrast on all rating/gate states is a launch gate for this surface; "Verified/Sourced" badges are distinguishable without relying on hue.
  - *Failure & edge cases:* If motion/animation (progress ring, confetti on Session Complete) is reduced via prefers-reduced-motion, the loop remains fully functional with static equivalents.

- **[REVIEW-23] As a Compliance / Data-Protection Officer (COMPLIANCE-DPO), I want review history, FSRS state, and calibration data governed as personal data with reset/export/retention controls, so that the retention engine complies with data-protection and minor-account rules.** — *Priority:* Should-Have — *Why this priority:* Longitudinal behavioral data (calibration, streaks, timing) is sensitive personal data and must be governable, though it layers on the core loop.
  - *Acceptance criteria:*
    - A Danger-zone "reset review history" wipes FSRS schedules, calibration, blind-spot, and streak data with an explicit confirmation and honest description of what is lost.
    - Review/calibration data is included in DSAR export and honored in account deletion; retention windows are enforced per tenant/policy.
    - Minor accounts get stricter defaults (e.g. tighter retention, no behavioral-timing profiling beyond what the loop needs).
  - *Business rules / validation:* Reset is irreversible and clearly stated; audit-critical aggregates may be anonymized rather than fabricated. Calibration/timing data is never sold or repurposed beyond the learning signal.
  - *Failure & edge cases:* A reset requested during an active session cancels the session cleanly; a partial-failure reset either completes or rolls back — it never leaves half-wiped, inconsistent FSRS state.

- **[REVIEW-24] As a Team Seat Learner (LEARNER-TEAM), I want to review cards drawn from my team's shared topic library and have my wrong-ideas feed shared gaps, so that I inherit the team's verified content and contribute back without owning it.** — *Priority:* Nice-to-Have — *Why this priority:* Teams review is real but a later-stage extension of the individual loop and the shared-library model.
  - *Acceptance criteria:*
    - Cards from shared-library topics appear in the seat learner's due queue with the same confidence gate, source citations, and drills as personal topics.
    - The learner's FSRS state, calibration, and streak are personal (not shared), but wrong-idea branches can post into the team's shared Gap Map.
    - The learner inherits each card's trust state from the shared library and cannot alter it.
  - *Business rules / validation:* A seat learner owns no billing/seats and cannot certify or change trust states; progress-visibility into their review signals follows the Org/Teams policy. Individual calibration/streak data is private unless policy exposes aggregates.
  - *Failure & edge cases:* If a seat is revoked, the learner's personal FSRS history is retained per policy but shared-library cards drop from their queue; a shared topic edited by an SME propagates suspension/recompute (REVIEW-16) to all seats' schedules.

### Business rules & invariants

- **Commit before reveal.** For every gated card, a confidence commitment (Sure/Unsure/Guessing) is recorded and immutable *before* the answer can be revealed. This is the invariant that makes calibration measurable; without a commit there is no calibration data-point.
- **Only survived claims are reviewed.** Every card traces to a claim in state Verified·execution, Verified·source, or Sourced. Disputed, Unsupported, and Interpretive claims produce no cards, and a card whose claim later leaves those states is suspended.
- **Answers carry their evidence.** A revealed answer shows its trust state and cites the same source object the ledger/coverage matrix uses. Review reinforces sourced knowledge, never ungrounded assertion.
- **FSRS owns scheduling; ratings are Again/Hard/Good/Easy.** Target retention and max interval tune the schedule but never change what is eligible to review. Each rating advances FSRS exactly once (idempotent).
- **Drills test detection, not recall.** Seeded error-drills present controlled false claims (Skeptic-approved) that must never leak into the ledger, never carry normal FSRS weight, and never count toward calibration; they feed the blind-spot signal only.
- **Wrong ideas become gaps, not punishments.** Again / "I had the wrong idea" / a missed drill emit Gap Map events (origin: review) with lecture jump-back; challenging or disagreeing never breaks a streak.
- **Signals are honest and gameable-resistant.** Retention, Calibration, and Drill-detection originate here as real, earned signals — no vanity metrics. Manipulated signals can be frozen (T&S) but never hand-fabricated by anyone.
- **No fabrication of retention data.** Neither Support, T&S, Instructors, nor the Skeptic may invent a rating, a calibration score, a caught-error, or a review that did not happen. Recovery restores only provable prior state.
- **Progress is preserved.** Commits and ratings survive offline/interruption via idempotent reconciliation; streaks are not broken by connectivity timing when the qualifying reviews happened in-day.
- **Review data is personal data.** FSRS state, calibration, timing, and streaks are exportable, deletable, resettable, and retention-windowed, with stricter minor-account handling.

### Cross-domain dependencies

- **Needs from Verification Pipeline / Skeptic / Sandbox:** the verified/sourced claim base each card is generated from and its citation; Skeptic-supplied false claims for seeded drills and sourced pushback in Discuss; Execution-Sandbox-backed answers for Verified·execution ("proof") cards (REVIEW-03, REVIEW-06, REVIEW-08, REVIEW-15).
- **Needs from Trust Ledger / Sources:** live trust states and canonical source objects, plus events when a claim is disputed/retracted or a source revoked, to keep card eligibility and citations honest and to trigger suspension/recompute (REVIEW-15, REVIEW-16).
- **Provides to Gap Map:** review-origin misconception events (Again / "wrong idea" / missed drill) tagged by origin and severity, with jump-back to the exact lecture section (REVIEW-07, REVIEW-06); invalidation when a card is suspended.
- **Provides to Conflicts:** Conflicts originated from a challenged card via Discuss, handed to the Skeptic-triage → SME-adjudication lifecycle owned by the Conflicts domain (REVIEW-08).
- **Provides to Progress / Reports:** three of the four honest signals — Retention, Calibration, and Drill-detection (blind-spot) — as aggregated per-learner and per-topic data (REVIEW-05, REVIEW-06); Reports owns the surface, this domain owns the signal.
- **Provides to Tests / Certificates:** retention and blind-spot as inputs to predicted-readiness; cards and tests draw from the same verified claim base, so review practice mirrors test scope (REVIEW-11).
- **Provides to Notifications / Dashboard:** "reviews due" events and daily-reminder preference that drive nudges and the dashboard due-count (REVIEW-12, REVIEW-14).
- **Bounded by Teams / Org policy:** shared-library card sourcing, private-vs-visible review signals, and progress-visibility policy for team learners (REVIEW-24).
- **Bounded by Compliance:** retention windows, DSAR export/deletion, reset-history, and minor-account defaults for all review/calibration data (REVIEW-23).
- **References (not owned here):** Lecture sections and micro-chapters (remediation targets), the misconception lifecycle board (Gap Map), rubric-graded Tasks, and formal Tests/certificates.

### Key technical requirements

- **FSRS engine.** A correct, versioned FSRS implementation storing per-card stability/difficulty/due state; interval computation driven by learner target retention and max-interval caps; feeds true elapsed time on early and overdue reviews so scheduling stays accurate. Idempotent state advance per rating (REVIEW-04, REVIEW-13, REVIEW-19).
- **Confidence & calibration store.** Immutable commit records (level + timestamp) captured before reveal; a fixed mapping from FSRS rating → actual-recall for the calibration data-point; aggregation into per-learner/per-topic calibration with a minimum-sample guard (REVIEW-02, REVIEW-05).
- **Card generation & eligibility.** Cards derived from the verified/sourced claim set with a stored claim-id + source-id + trust-state link; live eligibility recomputation and event-driven suspension/restore when the ledger changes, preserving FSRS history across suspend/restore (REVIEW-15, REVIEW-16).
- **Seeded-drill subsystem.** Controlled false-claim generation/approval via the Skeptic, isolated so drill claims can never be persisted as real ledger claims; blind-spot scoring with anti-blind-flag mixing of true items (REVIEW-06).
- **Offline-tolerant session model.** Local capture of commits/ratings with idempotent reconciliation, conflict resolution (last-writer-wins with earliest in-day timestamp for streaks), and a truthful offline/syncing UI; sessions survive tab close (REVIEW-17).
- **Discuss / Skeptic integration.** Threaded challenge with sourced Skeptic replies (hard mode gated to Pro), routes to Conflict/Gap/Accept; prompt-injection hardening treats learner messages strictly as data; async fallback when the Skeptic is unavailable (REVIEW-08).
- **Signal integrity & anti-gaming.** Behavioral anomaly detection (juking patterns, implausible timing, streak farming), quarantine/freeze of signals without deleting history, appeal path, and conservative tenant-configurable thresholds; full audit logging (REVIEW-20).
- **Events out.** Stable-schema emission of Gap Map misconception events, "reviews due" events, and honest-signal aggregates to Reports, Tests-readiness, and Notifications (REVIEW-07, REVIEW-12, REVIEW-05).
- **Access control & audit.** Role-scoped actions (learner rates/challenges; SME adjudicates; support restores-under-consent; T&S freezes; none may fabricate a signal), every state-changing action audit-logged with actor/scope/reason (REVIEW-16, REVIEW-20, REVIEW-21).
- **Accessibility.** Non-color-encoded gate/rating states, ARIA-announced lock/reveal/interval, keyboard-operable full loop, prefers-reduced-motion equivalents, WCAG AA contrast as a launch gate (REVIEW-22).
- **Privacy & retention.** Review/FSRS/calibration/streak classified as personal data: DSAR-exportable, deletable, resettable, retention-windowed per tenant/policy, with anonymize-not-fabricate for audit-critical aggregates and stricter minor defaults (REVIEW-23).
- **AI cost control.** Seeded-drill and Discuss replies are LLM calls; cache drill generation per claim, dedupe identical Discuss turns, and bound Skeptic hard-mode usage to Pro to control cost (REVIEW-06, REVIEW-08).

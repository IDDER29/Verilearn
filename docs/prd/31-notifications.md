## Notifications, Reminders & Messaging

### Overview

This domain owns **every outbound nudge, alert, and transactional message VeriLearn sends — and the single in-app record that anchors them all.** It covers the **Notifications center** (`/notifications`: a feed grouped Today / Earlier, category filter chips — All · Tests · Verification · Community, per-item unread dots, and "Mark all read"), the **reminder engine** (FSRS review-due nudges, test/checkpoint countdowns, event reminders, streak-at-risk), the **cross-channel delivery layer** (in-app center, transactional email, optional push), and the **notification preference & consent surface** that spans Settings → Review ("Daily reminder"), Settings → Privacy ("Product emails"), and per-category/per-channel controls.

Notifications are where VeriLearn's state changes reach a learner who isn't currently looking at the screen: a topic finished verifying, the Skeptic raised a Conflict, four cards came due, a checkpoint is in two days, someone replied to your thread. In a product whose entire thesis is *honesty about what to trust*, the notification layer carries an unusually strict burden: **a notification is a pointer to a state change owned by another domain — never itself a source of truth, a trust state, or a learning signal.** "The Skeptic flagged a claim in Merkle trees" links to the Conflict; it does not adjudicate it. "Binary search finished verifying" reports the pipeline's result; it does not certify anything. This distinction is the domain's spine.

Three invariants follow and govern everything below:

1. **Notifications report; they never fabricate.** No notification may assert a completed review, a passed test, an earned certificate, a changed trust state, or any of the four honest signals (Retention, Transfer, Calibration, Drill detection) that the originating domain did not actually produce. Support, Platform, and T&S actors can *trigger* notifications about operational state, but are firewalled from ever emitting a message that invents a learning signal.
2. **Honesty over engagement.** VeriLearn competes on trust, so the notification layer forbids vanity-metric pings, manufactured urgency, and dark-pattern streak-guilt. A "streak at risk" nudge is honest and suppressible; there are frequency caps, batching, quiet hours, and one-tap category opt-outs. No notification exists to inflate a number.
3. **Consent and channel are first-class.** Transactional messages (security, billing, enforcement, cert revocation) are separated from optional/marketing messages; unsubscribe and minor-safety constraints are honored per channel; and the in-app center is the canonical record even when email/push delivery fails.

### Personas involved

- **Self-directed Learner (LEARNER-SELF)** — primary recipient. Reads the in-app feed, gets verification-done / Conflict-raised / review-due / community-reply notifications, and manages per-category preferences.
- **Returning Power-Learner (LEARNER-POWER)** — the review-reminder engine's heaviest consumer: daily FSRS due-count nudges, streak-at-risk, and batched digests across a large topic portfolio; most likely to tune quiet hours and caps.
- **Exam-prep Student (LEARNER-EXAM)** — deadline-driven: checkpoint/test countdowns, predicted-readiness changes, "results ready", "retake available", and "attempts running low".
- **Skeptical / Expert Learner (LEARNER-SKEPTIC)** — wants immediate notice when the Skeptic (hard mode) raises a new Conflict on a claim they're auditing, and when a dispute they raised gets resolved.
- **Team Seat Learner (LEARNER-TEAM)** — receives assignment nudges and shared-library activity (new topic added, shared Conflict/gap), scoped by the Teams progress-visibility policy owned by Org/Teams.
- **Instructor / Educator (INSTRUCTOR)** — *sender and recipient*: triggers assignment notifications to a cohort and receives cohort weak-spot digests built from the four honest signals — but only within what the visibility policy permits.
- **Subject-Matter Expert / Content Reviewer (SME-REVIEWER)** — work-queue notifications: new Conflicts to adjudicate, coverage-matrix gaps, and promotion requests routed from Community/Events.
- **Community Contributor (CONTRIBUTOR)** — reply/mention notifications and the high-value "your cited reply was promoted into a topic's sources" message.
- **Community Moderator (COMMUNITY-MOD)** — flagged-content and routing notifications for the verified-answers-only space.
- **Event Host / Facilitator (EVENT-HOST)** — *sender*: registration confirmations, pre-event reminders, "we're live", and cancel/reschedule broadcasts to registrants.
- **Organization / Teams Admin (ORG-ADMIN)** — tenant-level notifications (seat invites accepted, library changes) and the setter of the progress-visibility policy that bounds instructor/admin notification content.
- **Billing / Finance Admin (BILLING-ADMIN)** — revenue-critical transactional messages: payment failed / dunning, trial ending, invoice available, seat-ceiling reached, plan changed.
- **Support Agent (SUPPORT-AGENT)** — sends ticket-update and scoped-consent-request messages; firewalled from ever fabricating a learning signal in a notification.
- **Platform Administrator (PLATFORM-ADMIN)** — triggers operational/system notifications (pipeline recovered, sandbox degraded, incident) without reading epistemic content.
- **Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD)** — sends enforcement notices (account frozen, content removed, reputation/cert revoked) with honest reason and appeal path.
- **Compliance / Data-Protection Officer (COMPLIANCE-DPO)** — governs notifications as personal data and messaging as regulated comms: transactional-vs-marketing split, unsubscribe honoring, COPPA/FERPA minor constraints, and notification history in DSAR exports.
- **Parent / Guardian (GUARDIAN)** — non-learning overseer who today receives safety/billing on a shared account; exposes a real product gap for a dedicated guardian notification channel.
- **Developer / API & Integration Consumer (DEVELOPER-API)** — consumes webhooks/notification events (cert revocation, seat/SSO provisioning) into external systems; bound by the rule that nothing external mutates the ledger.
- **Accessibility-Reliant Learner (A11Y-LEARNER)** — core stress case: notifications and their unread/urgency encoding must be fully operable and legible under assistive tech, never color/emoji/timing-only.
- **Guest / Visitor (GUEST)** — ephemeral evaluator; produces no persistent notification state, only consented email capture.
- **System actors — Verification Pipeline (VERIFY-PIPELINE), The Skeptic (SKEPTIC-AI), Execution Sandbox (EXEC-SANDBOX)** — *event producers, not recipients*: emit the state-change events (verification complete/failed, Conflict raised, execution trace ready) that this domain renders as notifications. Referenced, not redefined here.

### User stories

- **[NOTIF-01] As a Self-directed Learner (LEARNER-SELF), I want a Notifications center that groups my updates by recency and shows what's unread, so that I can catch up on everything that changed across my topics in one place.** — *Priority:* MVP — *Why this priority:* The in-app center is the canonical record every other channel points back to; without it there is no reliable delivery surface.
  - *Acceptance criteria:*
    - The feed renders items grouped into "Today" and "Earlier" sections, each item carrying an icon, title, one-line context, deep-link target, and relative timestamp.
    - Unread items show a distinct marker (dot) and contribute to a header unread count ("2 unread"); the count updates as items are read.
    - A first-run state with zero notifications shows a friendly empty state, not a blank panel.
  - *Business rules / validation:* Every delivered notification has exactly one canonical in-app record with a stable ID, category, read-state, and deep-link, regardless of which other channels also delivered it. Items older than a retention window (default 90 days) may be archived out of the default view.
  - *Failure & edge cases:* If the feed service is unavailable, show a retryable error with any locally-cached items, never a blank crash; a brand-new account shows the empty state; extremely long feeds paginate/virtualize rather than loading unbounded history.

- **[NOTIF-02] As a Self-directed Learner (LEARNER-SELF), I want to be notified when a topic finishes verifying — or fails to — so that I know when a lecture is ready to read without babysitting the pipeline.** — *Priority:* MVP — *Why this priority:* The verification pipeline runs in the background by design, so its completion is the single most important thing to surface asynchronously.
  - *Acceptance criteria:*
    - On pipeline success, a notification reads e.g. "Binary search finished verifying · 100% verified · ready to read" and deep-links to the topic workspace.
    - On pipeline failure or partial completion, a notification honestly states the failure ("verification stalled at Retrieve sources") and links to the pipeline/error state with a retry affordance owned by the pipeline domain.
    - The notification reflects the pipeline's actual result (verified/sourced/unsupported mix) and never overstates coverage.
  - *Business rules / validation:* The notification is emitted by the VERIFY-PIPELINE event, not authored here; this domain must not compute or embellish a coverage number the pipeline did not report. One notification per terminal pipeline outcome per topic (dedup on re-runs).
  - *Failure & edge cases:* If a topic is deleted before verification finishes, suppress the completion notification; if the pipeline emits duplicate completion events, collapse to one; a failed verification must never be reported as "ready".

- **[NOTIF-03] As a Skeptical / Expert Learner (LEARNER-SKEPTIC), I want to be notified the moment the Skeptic raises a new Conflict on a claim, so that I can go adjudicate the dispute while it's fresh.** — *Priority:* MVP — *Why this priority:* Conflicts are the live edge of the trust ledger; surfacing them fast is what makes the honesty loop feel responsive.
  - *Acceptance criteria:*
    - A notification reads e.g. "The Skeptic flagged a claim in Merkle trees — 'Works on any input size' — needs your call" and deep-links to the exact Conflict in the Conflicts surface.
    - The notification is categorized under "Verification" and shows the claim excerpt, not a generic "you have updates".
    - It clearly reads as a *pointer to a dispute to resolve*, never as a resolution or a trust-state change.
  - *Business rules / validation:* The notification carries the Conflict/claim ID and originates from the SKEPTIC-AI/EXEC-SANDBOX raising event; it must not assert the claim's outcome, and clicking it certifies nothing. Hard-mode Skeptic (Pro) may raise more Conflicts, but plan tier only affects *how many* fire, not their honesty.
  - *Failure & edge cases:* If the Conflict is resolved or withdrawn before the learner opens it, the notification opens the resolved Conflict with its outcome rather than 404-ing; execution-raised Conflicts include a link to the reproducible trace when the sandbox provided one.

- **[NOTIF-04] As a Returning Power-Learner (LEARNER-POWER), I want a batched daily reminder when reviews are due, so that I can protect retention across a large portfolio without being pinged per card.** — *Priority:* MVP — *Why this priority:* Spaced repetition only works if the learner actually returns; the due-reminder is the retention engine's heartbeat, and the "Daily reminder" toggle already exists in Settings → Review.
  - *Acceptance criteria:*
    - When cards are due and the daily reminder is enabled, one batched notification fires ("4 flashcards are due for review") at the learner's configured time, deep-linking to the Review session.
    - The reminder aggregates across all topics into a single due-count, never one notification per card or per topic.
    - The reminder honors the Settings → Review "Daily reminder" toggle and, when off, is never sent.
  - *Business rules / validation:* At most one review-due reminder per configured window per day per learner; the due count is read from the FSRS scheduler (Review/FSRS domain) and never fabricated. Reminder time defaults sensibly and is user-adjustable.
  - *Failure & edge cases:* If zero cards are due, no reminder is sent (no empty nudges); if the FSRS due-count service is unreachable, skip the reminder rather than guessing a count; a learner in a timezone change gets the reminder aligned to their local configured time.

- **[NOTIF-05] As a Returning Power-Learner (LEARNER-POWER), I want honest "streak at risk" nudges I can turn off, so that I'm reminded before I break a streak without being emotionally manipulated.** — *Priority:* Should-Have — *Why this priority:* Streaks aid habit formation but are a classic dark-pattern vector; VeriLearn's honesty thesis requires the gentle, suppressible version.
  - *Acceptance criteria:*
    - A streak-at-risk nudge fires only when a real active streak is genuinely about to lapse today ("Keep your 6-day streak alive"), and is off by default or one-tap suppressible.
    - The nudge never invents guilt, fake counts, or loss language beyond the true streak length and true deadline.
    - Disabling streak nudges is independent from disabling review reminders.
  - *Business rules / validation:* Streak length is read from the review domain; the nudge is classed as *optional/engagement* (not transactional) and therefore fully suppressible and subject to frequency caps. Streaks are never presented as a learning signal.
  - *Failure & edge cases:* No streak (length 0) → no nudge; if a learner has explicitly opted out of engagement nudges, this is suppressed even when a streak exists; a streak already broken today does not trigger a "still time" falsehood.

- **[NOTIF-06] As an Exam-prep Student (LEARNER-EXAM), I want checkpoint and test notifications — upcoming, results-ready, and attempts-running-low — so that I can time my prep and never miss a graded window.** — *Priority:* MVP — *Why this priority:* Deadline-driven learners lean entirely on predicted-readiness and test timing; missing a checkpoint notification is a direct product failure for this persona.
  - *Acceptance criteria:*
    - An upcoming-test notification shows the test, days remaining, and current predicted-readiness ("Your Dijkstra Checkpoint is in 2 days · You're 85% ready — review §3"), deep-linking to Test Detail.
    - A "results ready" notification fires when grading completes and links to Test Results; a "retake available" notification fires when a cooldown ends.
    - An "attempts running low / last attempt" notification fires before the final permitted attempt.
  - *Business rules / validation:* Readiness and attempt counts are read from the Tests domain and never recomputed here; test questions themselves are drawn only from verified/sourced claims (Tests domain rule, referenced). Countdown notifications fire at defined offsets (e.g. 2 days, 1 day) without spamming hourly.
  - *Failure & edge cases:* If a test is rescheduled or deleted, cancel or update queued reminders; if readiness data is unavailable, send the date reminder without a fabricated readiness number; a timed-out or interrupted test surfaces its own error state (Tests domain) with a link, not a false "passed".

- **[NOTIF-07] As a Self-directed Learner (LEARNER-SELF), I want to filter my notifications by category, so that I can focus on tests, verification, or community activity separately.** — *Priority:* Should-Have — *Why this priority:* Category chips exist in the prototype and materially improve triage, but the ungrouped feed is usable at MVP.
  - *Acceptance criteria:*
    - Filter chips (All · Tests · Verification · Community, extensible to Review/Events/Billing) filter the feed in place, with the active chip visually distinct.
    - Filtering preserves read/unread state and the Today/Earlier grouping within the filtered set.
    - An empty filtered result shows a category-specific empty state, not a blank screen.
  - *Business rules / validation:* Every notification is assigned exactly one primary category at emit time; category assignment is stable so filters are deterministic. Filter selection is view-state, not a suppression of delivery.
  - *Failure & edge cases:* A category with no items shows "nothing here yet"; an unknown/legacy category falls back into "All" rather than being dropped.

- **[NOTIF-08] As a Self-directed Learner (LEARNER-SELF), I want to control which notifications I get and on which channel, so that I decide what reaches me by in-app, email, or push.** — *Priority:* MVP — *Why this priority:* Per-category, per-channel consent is both a UX necessity and a compliance requirement; without it every message is spam risk.
  - *Acceptance criteria:*
    - A preferences surface (spanning Settings → Review "Daily reminder", Settings → Privacy "Product emails", and a notifications preference matrix) lets the learner toggle each category × channel independently.
    - Transactional categories (security, billing, enforcement, cert revocation) are clearly marked as non-suppressible for email, with only their optional channels adjustable.
    - Changes take effect immediately and are reflected the next time a matching event fires.
  - *Business rules / validation:* Preferences are stored per learner and enforced at emit time; a disabled category+channel must never deliver on that channel. Marketing/optional email requires explicit opt-in and honors unsubscribe within regulatory time limits; transactional email cannot be globally disabled but can be unsubscribed only where law permits.
  - *Failure & edge cases:* If preferences fail to load, default to the safest state (transactional only) rather than sending everything; a channel the learner never verified (e.g. no push token) simply falls back to in-app; conflicting settings resolve to the more restrictive.

- **[NOTIF-09] As a Self-directed Learner (LEARNER-SELF), I want a notification whose target was deleted or is no longer accessible to fail gracefully, so that a stale link never dead-ends me.** — *Priority:* MVP — *Why this priority:* Notifications outlive the objects they point to; broken deep-links are a common, avoidable trust-eroding failure. *(Failure story.)*
  - *Acceptance criteria:*
    - Clicking a notification whose target was deleted opens a clear "this item is no longer available" state, not a 404 or crash.
    - A notification pointing to content the learner lost access to (e.g. removed from a Teams shared library) explains the access change instead of leaking the content.
    - The stale notification is visibly marked as resolved/expired and can be dismissed.
  - *Business rules / validation:* Deep-link targets are resolved at click-time against current permissions, not at emit-time; a notification must never render private content it only holds a reference to. Access checks reuse the owning domain's authorization.
  - *Failure & edge cases:* Target deleted → graceful tombstone; access revoked → access-change message; target moved/renamed → follow the redirect if the owning domain provides one, else tombstone.

- **[NOTIF-10] As a Returning Power-Learner (LEARNER-POWER), I want my in-app notifications to be complete even when email or push delivery fails, so that a bounced email never means a lost update.** — *Priority:* Should-Have — *Why this priority:* Multi-channel delivery is inherently partial; the canonical in-app record is what guarantees no update is truly lost. *(Failure story.)*
  - *Acceptance criteria:*
    - Every notification is written to the in-app center first; email/push are best-effort fan-outs that cannot block or drop the canonical record.
    - A hard email bounce or push-token failure is logged and retried with backoff, and repeated hard bounces mark that channel unhealthy and fall back to in-app.
    - Delivery failures on optional channels never surface as errors to the learner beyond an optional "we couldn't reach your email" preferences hint.
  - *Business rules / validation:* Channel delivery is idempotent per (notification ID, channel); a retry must not create a duplicate in-app record or a second email. Unhealthy channels are auto-disabled after a threshold and require re-verification.
  - *Failure & edge cases:* Email provider outage → in-app unaffected, emails queued and retried; push service down → silent fallback; a channel repeatedly bouncing triggers a one-time "update your email" prompt, not repeated spam.

- **[NOTIF-11] As a Community Contributor (CONTRIBUTOR), I want to be notified when someone replies to or mentions me, and especially when my cited reply is promoted into a topic's sources, so that I feel the payoff of contributing.** — *Priority:* Should-Have — *Why this priority:* The promotion notification is the community's core reward signal and drives the cite-your-source behavior the platform depends on.
  - *Acceptance criteria:*
    - Reply and @-mention notifications deep-link to the exact thread position (Community domain), showing the replier and an excerpt.
    - A promotion notification reads e.g. "Your reply was promoted into Dijkstra's sources by an SME" and links to the resulting source entry.
    - Community notifications are categorized under "Community" and are independently suppressible.
  - *Business rules / validation:* Promotion is performed by the SME-REVIEWER in the Conflicts/Trust/Sources domain; this notification only *reports* the completed promotion and confers no ability to self-certify. Reputation changes are social signals and must never be phrased as learning signals.
  - *Failure & edge cases:* A reply deleted before the learner opens the notification → tombstone; a promotion later reversed by T&S emits an honest follow-up notice; mass mentions (someone @-tagging many users) are subject to anti-abuse throttling.

- **[NOTIF-12] As a Subject-Matter Expert / Content Reviewer (SME-REVIEWER), I want a work-queue of notifications for Conflicts to adjudicate, coverage gaps, and promotion requests, so that human review keeps pace with what the pipeline and community surface.** — *Priority:* Should-Have — *Why this priority:* The SME is the human bottleneck of the verification spine; routing work to them promptly is what keeps the ledger current, but the learner loop functions before this is polished.
  - *Acceptance criteria:*
    - The SME receives notifications for new unresolved Conflicts, newly-detected unsupported coverage-matrix rows, and community-routed promotion requests, each deep-linking to the adjudication surface.
    - These notifications can be batched into a digest to avoid per-item overload on high-volume topics.
    - Each item shows enough context (topic, claim, source) to triage without opening it.
  - *Business rules / validation:* SME work-queue notifications are scoped to the topics/tenants the SME owns; they route work but grant no new authority — the actual trust-state write happens in the Conflicts/Trust/Sources domain. Volume is subject to batching thresholds.
  - *Failure & edge cases:* A Conflict resolved by another SME before this one opens it shows as already-handled; a promotion request withdrawn by the community is retracted from the queue; a flood of auto-raised Conflicts collapses into a digest rather than N separate pings.

- **[NOTIF-13] As an Instructor / Educator (INSTRUCTOR), I want assigning a topic to notify my cohort, and I want cohort weak-spot digests, so that I can direct learners and spot where they struggle — within what the visibility policy allows.** — *Priority:* Should-Have — *Why this priority:* Assignment nudges and signal digests are the Teams educator's core loop, but depend on Teams/Org plumbing that follows the consumer MVP.
  - *Acceptance criteria:*
    - Assigning a topic emits a "New assignment: <topic>" notification to each cohort member (LEARNER-TEAM), deep-linking to the assigned topic.
    - The instructor receives a periodic digest highlighting cohort weak spots derived from the four honest signals (e.g. "Merkle trees — cohort calibration low").
    - Digest content respects the Org/Teams progress-visibility policy and never exposes an individual's data the policy forbids.
  - *Business rules / validation:* The instructor holds pedagogical authority only — assignment notifications cannot alter any trust state, and the digest reads signals the Progress/Reports domain computes; it does not compute them. Visibility scope is enforced by the Org/Teams policy, not by this domain.
  - *Failure & edge cases:* If the visibility policy is set to hide individual data, the digest aggregates only; a learner who left the cohort stops receiving that cohort's assignment notifications; an assignment to an empty or dissolved cohort sends nothing.

- **[NOTIF-14] As an Event Host / Facilitator (EVENT-HOST), I want registration confirmations, pre-event reminders, and cancel/reschedule broadcasts sent to registrants, so that attendance holds and no one shows up to a moved session.** — *Priority:* Should-Have — *Why this priority:* Live events lose attendance without reminders, and a missed cancellation notice is a direct trust failure; the Events surface already shows "Reminder set" and "Add to calendar".
  - *Acceptance criteria:*
    - On registration, the learner gets a confirmation with the join link and an "add to calendar" affordance (Events domain), and a "Reminder set" state.
    - A pre-event reminder fires at a defined offset before start, and a "we're live" notification fires at start time.
    - A host-initiated cancel or reschedule broadcasts an update to all registrants and updates/cancels their queued reminders.
  - *Business rules / validation:* Event reminders are tied to registration state (Events domain); un-registering cancels all queued reminders for that event. A reschedule must reconcile every registrant's reminders to the new time atomically. Any claim surfaced live must still route through an SME to certify (Events rule, referenced) — event notifications never certify.
  - *Failure & edge cases:* A cancelled event must not still send "we're live"; a learner who unregisters after a reminder was queued does not receive it; if the calendar file/link fails to generate, registration still succeeds with an in-app fallback.

- **[NOTIF-15] As a Billing / Finance Admin (BILLING-ADMIN), I want reliable transactional billing notifications — payment failed, trial ending, invoice ready, seat ceiling reached — so that I can keep the account in good standing.** — *Priority:* MVP — *Why this priority:* Payment-failure and dunning notifications are revenue-critical and legally sensitive; a dropped one directly causes churn or service loss.
  - *Acceptance criteria:*
    - Payment failure triggers a dunning sequence with clear "update payment method" links (Upgrade/Checkout domain), at defined retry intervals.
    - Trial-ending, invoice-available, plan-changed, and seat-ceiling-reached events each emit a distinct transactional notification.
    - These are marked transactional and delivered by email even when optional/marketing email is off.
  - *Business rules / validation:* Billing notifications are transactional and exempt from marketing opt-out; they are addressed to the billing/finance role, not necessarily the learner. Amounts, dates, and seat counts are read from the Billing domain and never fabricated. The BILLING-ADMIN controls seat pool size but this domain never implies control over content or who fills seats.
  - *Failure & edge cases:* A payment that succeeds on retry cancels the remaining dunning sequence; a plan downgrade that would strand active topics (e.g. Pro→Free over the 3-topic cap) sends a warning notification before enforcement, owned jointly with Billing; duplicate webhook events from the payment provider are de-duplicated.

- **[NOTIF-16] As a Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD), I want enforcement actions to notify the affected user with an honest reason and an appeal path, so that freezes, removals, and revocations are transparent and contestable.** — *Priority:* Should-Have — *Why this priority:* Enforcement without notice erodes exactly the trust the platform sells; but the abuse-detection machinery it depends on is post-MVP.
  - *Acceptance criteria:*
    - Account freeze, content removal, reputation reversal, and certificate revocation each emit a transactional notification stating the action, the reason category, effective time, and how to appeal.
    - Certificate-revocation notices are also reflected to downstream verification (see NOTIF-19) so an EMPLOYER-VERIFIER sees current status.
    - Enforcement notifications are clearly attributed to Trust & Safety and cannot be silently suppressed by the recipient.
  - *Business rules / validation:* T&S can freeze/ban/revoke but never hand-certify; the notification reports an action taken elsewhere and grants no trust state. Reason text avoids leaking detection heuristics that would aid gaming while remaining honest about the category (e.g. "vote-ring", "cert fraud", "calibration-juking").
  - *Failure & edge cases:* An action reversed on appeal emits a restoration notice; a freeze applied during an active session terminates the session and shows an in-app blocking state; notifications for banned accounts still deliver by email so the user learns why.

- **[NOTIF-17] As a Compliance / Data-Protection Officer (COMPLIANCE-DPO), I want the messaging layer to enforce consent, the transactional/marketing split, and minor-safety constraints, and to include notification history in data exports, so that comms stay lawful and auditable.** — *Priority:* MVP — *Why this priority:* Sending email/push to real users (including possible minors) without a compliant consent and unsubscribe model is a legal non-starter, not a nicety.
  - *Acceptance criteria:*
    - Every message is classified transactional or marketing; marketing requires opt-in and carries a working, honored unsubscribe; transactional carries required identifiers.
    - Accounts flagged as minors (COPPA/FERPA context) have marketing/optional channels disabled by policy regardless of local toggles.
    - A DSAR export includes the learner's notification and messaging history; account deletion removes it subject to legal-hold rules.
  - *Business rules / validation:* Consent state and minor flags are read from the Compliance/Privacy domain and enforced at emit time; the DPO holds advisory/gatekeeping authority over personal data and comms but never over truth or trust states. Unsubscribe is honored within the mandated window across all optional channels.
  - *Failure & edge cases:* If consent state is indeterminate, treat as no-consent for optional channels; an unsubscribe that fails to propagate to one channel blocks sends on that channel until reconciled; deletion under legal hold retains the minimum record with an audit note.

- **[NOTIF-18] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want notifications fully operable and legible via assistive tech, so that unread state and urgency never depend on color, emoji, or timing I can't perceive.** — *Priority:* MVP — *Why this priority:* The trust ledger's honesty promise is void for any learner who literally cannot perceive that a Conflict was raised; accessibility is a core stress case, not an edge case.
  - *Acceptance criteria:*
    - Unread state, category, and urgency are conveyed with text/ARIA, not color or the 🔔/🧐 emoji alone; the unread count is announced.
    - The feed, filter chips, "mark all read", and each item's deep-link are keyboard-operable with visible focus and correct roles.
    - No notification auto-dismisses on a timer the user cannot control; toasts are pausable/persistable and mirrored in the in-app center.
  - *Business rules / validation:* Every notification exposes a text alternative for any iconographic meaning; live-region announcements are used for newly-arriving in-app notifications without stealing focus. Motion/animation respects reduced-motion preferences.
  - *Failure & edge cases:* A screen-reader user must be able to reach and clear every unread item; a purely visual "new" pulse must have a non-visual equivalent; a transient toast that disappears must always leave a persistent record behind.

- **[NOTIF-19] As a Developer / API & Integration Consumer (DEVELOPER-API), I want webhooks for cert-revocation and seat/SSO provisioning events, so that external systems (an EMPLOYER-VERIFIER's HR tool, an IdP) stay in sync without polling.** — *Priority:* Nice-to-Have — *Why this priority:* Programmatic delivery is high-value for Teams/verifier integrations but not required for the consumer learning loop.
  - *Acceptance criteria:*
    - Subscribable webhook events cover at least certificate issued/revoked and seat provisioned/deprovisioned, with signed, verifiable payloads.
    - Payloads are read-only projections; no webhook or API call can mutate a trust state, certificate validity, or the ledger.
    - Delivery is retried with backoff and exposes a delivery log for debugging.
  - *Business rules / validation:* Webhooks carry a signature and replay-protection nonce; consumers must verify signatures. The rule that nothing external mutates the ledger is absolute — inbound integration is provisioning/consumption only. Cert status in a webhook must match the authoritative Tests/Certs domain at send time.
  - *Failure & edge cases:* An endpoint that fails repeatedly is disabled after a threshold with an alert to the integrator; out-of-order delivery is disambiguated by event timestamps/sequence; a revoked-then-reinstated cert emits both events in order.

- **[NOTIF-20] As a Platform Administrator (PLATFORM-ADMIN), I want operational/system notifications about pipeline, sandbox, and Skeptic health, so that learners and staff learn about degradation and recovery honestly — without any message inventing a learning signal.** — *Priority:* Should-Have — *Why this priority:* Transparency-not-a-spinner extends to failures; users should hear "verification is delayed" rather than see silent stalls, but this is operational polish beyond the core loop.
  - *Acceptance criteria:*
    - System events (verification backlog, sandbox degraded, Skeptic model rollout, incident) can emit honest status notifications and/or a status banner scoped to affected users.
    - A recovered notification follows a degradation notification when the issue clears (e.g. "your stuck pipeline resumed").
    - Operational notifications are visually and categorically distinct from learning notifications.
  - *Business rules / validation:* PLATFORM-ADMIN and SUPPORT-AGENT can trigger operational notifications but are firewalled from ever emitting one that asserts a completed review, passed test, earned certificate, or changed trust state. Operational content references no epistemic content the admin cannot read.
  - *Failure & edge cases:* A "recovered" message must not send if the issue is still open; a Support-triggered fix to a stuck pipeline notifies the learner of the operational recovery only, never a fabricated result; a global incident uses a banner + single notification, not per-topic spam.

- **[NOTIF-21] As a Returning Power-Learner (LEARNER-POWER), I want protection from notification floods — batching, frequency caps, and quiet hours — so that a burst of events never drowns me or lets someone weaponize notifications against me.** — *Priority:* Should-Have — *Why this priority:* Both legitimate bursts (re-verifying a big topic) and abuse (reply-spam mentions) can flood a learner; caps are what keep the channel trustworthy. *(Failure/abuse story.)*
  - *Acceptance criteria:*
    - Per-category frequency caps and a global cap batch excess events into digests instead of individual notifications.
    - Quiet-hours settings hold non-urgent notifications until the window ends (transactional/security may override).
    - Repeated events from the same actor/target (e.g. many rapid replies) collapse into a single "N new replies" item.
  - *Business rules / validation:* Batching and caps are computed per learner per channel; transactional/security/enforcement categories may bypass quiet hours but still respect anti-duplication. Abuse-driven bursts are rate-limited at the source and reported to Trust & Safety.
  - *Failure & edge cases:* A malicious flood of mentions is throttled and never generates one notification per mention; a legitimate large batch (e.g. 200 cards due) still yields one due-reminder; if quiet hours span a timezone change, held notifications release at the correct local boundary.

- **[NOTIF-22] As a Parent / Guardian (GUARDIAN), I want safety and billing notifications for my dependent's account, so that I stay informed of a minor's usage and charges — acknowledging today's single-shared-account limitation.** — *Priority:* Future — *Why this priority:* The product currently serves guardian oversight only through a shared account; a dedicated guardian notification channel is a known gap, not a shipped capability.
  - *Acceptance criteria:*
    - On a shared account, billing and safety-relevant notifications are visible to the account holder acting as guardian.
    - The domain documents the gap: there is no separate guardian recipient distinct from the learner today, and enforcement/safety notices are not independently routed to a guardian.
    - A future dedicated guardian channel would deliver safety/billing without exposing the minor's private learning content.
  - *Business rules / validation:* Guardian oversight is limited to billing and safety, never trust states or content certification; any future guardian channel must respect minor-privacy constraints owned by Compliance. Today's behavior must not imply capabilities the product lacks.
  - *Failure & edge cases:* A guardian expecting per-child separation gets the honest limitation surfaced rather than a false sense of isolation; safety-critical notices on a shared account are not silently hidden behind a child's read-state.

- **[NOTIF-23] As a Self-directed Learner (LEARNER-SELF), I want a notification when a new gap opens or a closed gap reopens, so that misconceptions I thought were handled don't silently drift.** — *Priority:* Nice-to-Have — *Why this priority:* Gap-map lifecycle nudges reinforce the honesty loop but are secondary to the review/test reminders that already surface the same underlying work.
  - *Acceptance criteria:*
    - A "new gap opened" notification names the misconception and its origin (lecture/review/task/test miss) and deep-links to the exact gap detail (Gap Map domain).
    - A "gap reopened" notification fires when a previously Closed gap returns to Open, signaling regression.
    - These are categorized (Review/Verification) and independently suppressible.
  - *Business rules / validation:* Gap state and lifecycle (Open→Watching→Closed→Reopened) are owned by the Gap Map domain; this notification only reports transitions and never changes a gap's state. Severity is read, not assigned here.
  - *Failure & edge cases:* Rapid open/close churn on one gap is debounced into a single notification; a gap deleted with its topic suppresses pending notifications; a reopened gap links to the exact lecture section the Gap Map provides.

- **[NOTIF-24] As a Guest / Visitor (GUEST), I want the ephemeral demo to persist no notification state and to capture my email only with clear consent, so that trying VeriLearn never signs me up for messaging I didn't ask for.** — *Priority:* Nice-to-Have — *Why this priority:* Respecting the guest's ephemerality reinforces the honesty brand at first contact, though the guest experience persists nothing by design.
  - *Acceptance criteria:*
    - A guest session generates no persistent notification records and no reminders.
    - Any email capture during the demo is explicitly consented and classified marketing (opt-in), with a working unsubscribe.
    - On conversion to a real account, no retroactive notifications are backfilled from the ephemeral session.
  - *Business rules / validation:* Guests persist nothing (Auth/Guest domain rule, referenced); capturing contact info without consent is prohibited and governed by Compliance. Converting a guest starts a clean notification state.
  - *Failure & edge cases:* A guest who abandons mid-demo leaves no queued messages; a double email-capture is de-duplicated; a converted guest's preferences default to transactional-only until they opt in.

### Business rules & invariants

- **A notification is a pointer, not a source of truth.** Every notification references a state change owned by another domain (pipeline, Conflicts/Trust, Review/FSRS, Tests, Gap Map, Community, Events, Billing, Compliance). This domain renders and routes; it never computes coverage numbers, readiness scores, trust states, streak lengths, or the four honest signals.
- **No fabricated learning signals — ever.** No message from any actor (including Support, Platform, Trust & Safety) may assert a completed review, a passed test, an earned/valid certificate, or a changed trust state that the originating domain did not produce. This firewall is absolute.
- **Never certify in a notification.** Skeptic/Conflict/Community notifications link to disputes and sourced answers but confer no `Verified` state and resolve nothing; clicking one only navigates.
- **Canonical in-app record.** Every delivered notification has exactly one durable in-app record with a stable ID, category, read-state, timestamp, and deep-link. Email/push are best-effort fan-outs that can never be the only place an update exists.
- **Transactional vs optional split.** Security, billing/dunning, enforcement, and certificate-revocation are transactional (delivered regardless of marketing opt-out, within legal bounds). Reminders, streaks, community, events, and product news are optional and fully suppressible per category × channel.
- **Honesty over engagement.** No vanity-metric pings, no manufactured urgency, no dark-pattern streak-guilt. Streak/engagement nudges are truthful, capped, and off-able. Frequency caps, batching, and quiet hours apply to all non-urgent categories.
- **Idempotency and dedup.** One terminal event yields one notification; duplicate upstream events (re-runs, provider webhook retries) collapse; batchable bursts become digests ("4 cards due", "N new replies"), never N pings.
- **Deep-links resolve at click-time.** Authorization and existence are checked when the link is followed, reusing the owning domain's permissions; deleted or inaccessible targets render tombstones, never 404s or leaked content.
- **Consent and minor-safety enforced at emit time.** Opt-in, unsubscribe, and COPPA/FERPA minor flags are honored per channel; indeterminate consent defaults to transactional-only.
- **Scope-bounded content.** Instructor/admin digests and Teams activity notifications respect the Org/Teams progress-visibility policy; enforcement reasons stay honest without leaking anti-gaming heuristics.
- **Accessibility is a hard requirement.** Unread/category/urgency are never encoded by color, emoji, or timer alone; every notification is keyboard-operable and screen-reader-legible; nothing critical lives only in a transient toast.

### Cross-domain dependencies

**Consumes (event sources this domain renders):**
- **Verification Pipeline / Skeptic / Execution Sandbox** — verification complete/failed/stalled, new Conflict raised, execution trace ready.
- **Conflicts, Trust & Sources** — Conflict resolved/withdrawn, coverage-gap detected, source-promotion completed.
- **Review / FSRS** — cards-due counts, streak length/at-risk, misconception-path triggers.
- **Tests & Certificates** — checkpoint schedules, predicted-readiness, grading complete, attempts remaining, cert issued/revoked.
- **Gap Map** — gap opened / reopened / closed transitions, origin, severity, jump-to-section links.
- **Community** — replies, mentions, promotion outcomes.
- **Events** — registration state, event start/reschedule/cancel, join links, calendar files.
- **Billing / Upgrade-Checkout** — payment failure/dunning, trial ending, invoices, plan/seat changes.
- **Org / Teams** — seat invites, shared-library changes, and the progress-visibility policy that bounds instructor/admin notification content.
- **Compliance / Privacy** — consent state, minor flags, unsubscribe, DSAR/retention rules.
- **Auth** — security/login alerts, email verification, password reset (transactional).
- **Trust & Safety** — freeze/removal/revocation actions to notify.

**Provides (to other domains/actors):**
- A single canonical notification feed and unread-count surface consumed by the app shell (`/notifications` + header bell).
- A per-category × per-channel preference model surfaced within Settings (Review, Privacy, and a notifications preference matrix).
- A delivery/fan-out service (in-app, email, push) other domains emit through, plus a webhook/event stream for DEVELOPER-API consumers (read-only cert/seat events).
- A notification-history record included in Compliance DSAR exports and deletion flows.

### Key technical requirements

- **Event-driven, idempotent pipeline.** An emit API keyed on (event ID, recipient) with dedup and collapse rules; upstream domains fire events, this domain resolves recipients, applies preferences/caps/quiet-hours, and fans out. Exactly-once semantics for the in-app record; at-least-once with dedup for external channels.
- **Canonical store + multi-channel fan-out.** Durable notification store (ID, category, payload reference, read-state, timestamps, delivery status per channel). Channel adapters for email (transactional + digest) and push (optional), each with retry/backoff, bounce/token-health tracking, and auto-disable thresholds.
- **Latency expectations by class.** Near-real-time (seconds) for Conflict-raised, verification-complete, "we're live", enforcement, and security; scheduled/batched windows for review-due, streak, checkpoint countdowns, and digests. Quiet-hours holding queue with correct timezone/DST handling.
- **Deep-link resolver.** Click-time authorization and existence checks against each owning domain, with tombstone/redirect handling; no private content stored in the notification payload itself — only references.
- **Preference & consent engine.** Per learner: category × channel matrix, quiet hours, frequency caps, transactional overrides, minor-safety policy, and unsubscribe propagation honored within regulatory time limits across all optional channels.
- **Batching & anti-abuse.** Server-side aggregation (due-counts, reply-bursts), per-source rate limits, mention/flood throttles, and hooks to report weaponized-notification patterns to Trust & Safety.
- **Compliance surfaces.** Transactional/marketing classification on every template, required legal identifiers and working unsubscribe on marketing mail, notification history in DSAR export, and deletion/legal-hold reconciliation (including durable community-promotion attribution).
- **Accessibility engineering.** ARIA live-region announcements for arriving in-app notifications (without focus theft), text alternatives for all iconography, full keyboard operability, reduced-motion compliance, and pausable/persistable toasts mirrored to the canonical feed.
- **Observability & delivery logs.** Per-notification delivery status, bounce/failure telemetry, webhook delivery logs with signing and replay-protection, and audit trails for enforcement and consent-driven suppression.
- **Cost/scale.** Notifications are cheap relative to the verification pipeline, but fan-out volume scales with topic/portfolio size; batching and caps are the primary cost and trust controls. No LLM inference is required to render a notification — content comes from upstream domain events, keeping this layer low-cost and deterministic.

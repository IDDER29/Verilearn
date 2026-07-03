## Events: Workshops, Study Groups & Challenges

### Overview

This domain covers VeriLearn's **live and time-boxed social layer**: the four event shapes surfaced in the prototypes — **Live workshops** (e.g. "Graph algorithms, verified: a live claim-check"), **Study groups** (e.g. "Binary search edge cases"), **Retention challenges** (e.g. the "7-day retention challenge" with a streak ring), and **Talks / AMAs** (e.g. "How the Skeptic red-teams a claim") — plus the full lifecycle around each one: discovery (`Events`), evaluation (`Event Detail`), commitment (`Event Registered`), the live/running experience, and the post-event wind-down.

Events matter to the product thesis because they are the **only place the verification spine runs in public, in real time, with humans watching**. A live claim-check is the trust ledger turned into a spectator sport: an audience watches a claim get decomposed, sourced, red-teamed by the Skeptic on hard mode, and either tagged Verified or promoted into a Conflict — live. That is a uniquely honest thing to be able to do, and it is the marketing surface for the whole "trust is visible" promise. Retention challenges do the same job for the FSRS engine: they turn spaced-review discipline into a social, streak-tracked commitment without inventing a single vanity metric.

The load-bearing invariant of this domain is a **subtraction of power**: **an event can never certify anything.** A live workshop, an AMA answer, a study-group consensus, or a challenge win is never itself a trust state, a certificate, or a source. Everything an event *produces* epistemically — a dispute someone raised, a source someone cited, a misconception that surfaced — must be routed *out* of the event and *into* the spine (a Conflict, a Gap-Map entry, or a promotion request to an SME) where the normal, auditable certification rules apply. The Event Host convenes and routes; the Skeptic red-teams live; the SME certifies later, offline. Events feed the spine but are firewalled from mutating it.

### Personas involved

- **Event Host / Facilitator (`EVENT-HOST`)** — the primary actor. Creates and runs workshops, study groups, challenges, and AMAs; drives the live claim-check; converts what surfaces live into Conflicts, Gap-Map entries, and promotion requests — but **must route any live claim through an SME to certify** and can never hand-set a trust state.
- **Self-directed Learner (`LEARNER-SELF`)** — the default attendee: browses events, registers free, adds to calendar, attends live, joins challenges. Feels the hard-mode-Skeptic upgrade nudge.
- **Exam-prep Student (`LEARNER-EXAM`)** — deadline-driven; joins topic-linked study groups and challenges to cram against a fixed date and close gaps fast.
- **Returning Power-Learner (`LEARNER-POWER`)** — retention challenges are their native turf; the streak ring and challenge leaderboard map directly onto the FSRS/review-debt engine they already live in.
- **Skeptical / Expert Learner (`LEARNER-SKEPTIC`)** — attends live claim-checks to test the verifier in public; raises Conflicts live and offers sourced pushback that can become a promotion request.
- **Team Seat Learner (`LEARNER-TEAM`)** — attends private, tenant-scoped events over the shared topic library; contributes to shared conflicts/gaps but owns no hosting or billing.
- **Instructor / Educator (`INSTRUCTOR`)** — a Teams host: runs cohort study sessions and challenges, assigns events, and reads the four honest signals afterward to find cohort weak spots. Holds pedagogical authority but **cannot change trust states**.
- **Subject-Matter Expert / Content Reviewer (`SME-REVIEWER`)** — the certifier who closes the loop: receives promotion requests and Conflicts that originated live, adjudicates them offline, and sets trust states. Not usually live, but the destination of everything an event produces epistemically.
- **Community Moderator (`COMMUNITY-MOD`)** — governs live chat, study-group threads, and challenge leaderboards; keeps discussion anchored to claims and sources, enforces cite-your-source conduct, and routes strong replies to SMEs without certifying anything.
- **Community Contributor (`CONTRIBUTOR`)** — the audience member who raises a well-sourced dispute live and earns durable footprint when an SME promotes their cited reply into a topic's sources.
- **Organization / Teams Admin (`ORG-ADMIN`)** — owns tenant-scoped events: who may host, whether events are private to the org, and the attendance/progress-visibility policy. Cannot certify or set price.
- **Billing / Finance Admin (`BILLING-ADMIN`)** — indirectly present: hard-mode-Skeptic events and unlimited hosting sit behind Pro/Teams; controls the plan/seat ceiling that gates event capabilities but nothing about content.
- **Trust & Safety / Ledger Integrity Lead (`TRUST-SAFETY-LEAD`)** — polices event abuse: streak/challenge gaming, sockpuppet study groups, host impersonation, spam events, and Skeptic prompt-injection during live claim-checks. Can freeze, ban, and revoke; never certifies.
- **Compliance / Data-Protection Officer (`COMPLIANCE-DPO`)** — owns recording consent, attendee-data retention, and minor participation (FERPA/COPPA); event registrations and recordings fall inside DSAR scope.
- **Support Agent (`SUPPORT-AGENT`)** — unbreaks stuck registrations, lost join links, and unfairly-lost challenge streaks under scoped consent; **firewalled from ever fabricating a retention number, a challenge win, or attendance credit**.
- **The Skeptic (`SKEPTIC-AI`)** — runs live in claim-check workshops (hard mode for Pro), attacking decomposed claims and raising Disputed/Interpretive Conflicts in front of an audience, but cannot certify Verified or resolve its own Conflicts.
- **Execution Sandbox (`EXEC-SANDBOX`)** — can prove a computational claim live during a workshop with a reproducible trace, producing a Verified·execution candidate that still routes through the normal ledger.
- **Accessibility-Reliant Learner (`A11Y-LEARNER`)** — a live, timed, audio-visual surface is a core accessibility stress test: needs live captions, a non-visual path through the claim-check, and challenge accommodations that don't punish assistive-tech pacing.
- **Guest / Visitor (`GUEST`)** — may preview a public event page as a conversion hook but persists nothing and cannot register without an account.
- **Parent / Guardian (`GUARDIAN`)** — oversees a teen's live participation and recording exposure; served today only by a single shared account, which surfaces real safeguarding gaps.
- **Developer / API & Integration Consumer (`DEVELOPER-API`)** — consumes calendar exports (ICS) and, forward-looking, event/registration webhooks; bound by the rule that nothing external certifies a claim.
- **Verification Pipeline (`VERIFY-PIPELINE`)** — the six-stage orchestrator whose stages can be demonstrated live in a workshop; the topic a live claim-check runs against is a pipeline output.

### User stories

- **[EVENT-01] As a Self-directed Learner, I want to browse a single Events hub with a featured event and an upcoming list tagged by type, so that I can find live sessions, study groups, and challenges worth my time.** — *Priority:* MVP — *Why this priority:* Events is a top-level nav destination; discovery is the entry point for the whole domain.
  - *Acceptance criteria:*
    - The hub shows one featured/next event (date chip, live-type badge, title, time · duration · host) and an "Upcoming" list, each row carrying a type tag (Group / Challenge / Talk / Live workshop) and a meta line (time, going-count, host).
    - A right rail surfaces the learner's own state: an active-challenge progress ring and a "Registered" list of their upcoming events.
    - Each event links to its detail page; the featured event's Register CTA also deep-links to detail.
  - *Business rules / validation:* Events are ordered soonest-first; a live-now event is pinned above scheduled ones. Type tag is derived from the event kind and is not free-text. Going-counts reflect confirmed registrations only.
  - *Failure & edge cases:* First-run / no events → an empty state ("No events yet — check back, or start a topic") rather than a blank list. If the learner has no active challenge, the right-rail ring is replaced by a "Join a challenge" prompt. Past events drop off the upcoming list and move to a "Recordings / Past" view (EVENT-18), never lingering as stale future items.

- **[EVENT-02] As a Self-directed Learner, I want an event detail page that explains what the session is, what I'll see, who's hosting, and who's going, so that I can decide whether to register.** — *Priority:* MVP — *Why this priority:* Detail is the decision surface between discovery and commitment; it is one of the three shipped screens.
  - *Acceptance criteria:*
    - Detail renders a hero (date, live-type badge, title, time · duration · going-count · online/format), an "About this session" block, a "What you'll see" checklist, a host card (name, role, Follow), and a "Who's going" avatar cluster.
    - A register card states the price posture ("Free to join"), any live-only benefit ("live attendees can ask the Skeptic questions; a recording is shared after"), a primary Register CTA, and an "Add to calendar" action.
    - For a claim-check workshop, the detail names the linked topic and that the Skeptic runs on hard mode.
  - *Business rules / validation:* "Free to join" is the default posture for public events; a hard-mode-Skeptic live experience is gated to Pro (EVENT-15). Going-count and avatar cluster must reconcile with EVENT-01. Following a host affects notifications, not trust.
  - *Failure & edge cases:* A full event (capacity reached) replaces Register with a "Join waitlist" state. An already-registered learner sees "You're registered" with manage/cancel instead of a second Register. A cancelled event shows a cancelled banner and disables Register (EVENT-17).

- **[EVENT-03] As a Self-directed Learner, I want to register for a free event in one click and get an instant confirmation with a join link, a calendar-ready reminder, and a task, so that I won't miss it.** — *Priority:* MVP — *Why this priority:* Registration is the domain's core conversion action and the third shipped screen.
  - *Acceptance criteria:*
    - Registering lands on a confirmation ("You're registered!") with a ticket card (date, time · duration · format) and Confirmed / Reminder-set status chips.
    - A join link is emailed and the event is added to My Tasks; the right-rail "Registered" list on the hub updates.
    - The confirmation offers "Add to calendar" and "Back to events."
  - *Business rules / validation:* Registration requires an authenticated account (Guests are routed to sign-up per EVENT-22). One registration per learner per event; re-registering is idempotent. Registration is free and creates no billing event.
  - *Failure & edge cases:* Double-submit / network retry must not create duplicate registrations or duplicate tasks. If capacity was reached between viewing detail and submitting, the learner is placed on the waitlist with a clear message rather than silently failing. If email delivery of the join link fails, the in-app ticket and task still stand and the link is retrievable from the ticket.

- **[EVENT-04] As a Self-directed Learner, I want to add a registered event to my external calendar, so that it appears alongside the rest of my schedule.** — *Priority:* Should-Have — *Why this priority:* Shipped as a button on two screens; strong retention aid but not required for the core loop.
  - *Acceptance criteria:*
    - "Add to calendar" produces a standards-compliant ICS entry (title, start/end in the learner's timezone, join URL, description) importable by common calendar apps.
    - The calendar entry carries the join link and updates its status if the event is later rescheduled or cancelled (where the calendar app supports updates).
  - *Business rules / validation:* Times are emitted with explicit timezone/UTC offset; the ICS must not leak other attendees' identities. The join URL is per-learner and must not be shared as a public credential.
  - *Failure & edge cases:* If the learner's timezone is unknown, fall back to UTC with a visible label rather than guessing. A rescheduled event issues an updated ICS (SEQUENCE bump) so calendars supersede rather than duplicate.

- **[EVENT-05] As a registered learner, I want reminders before an event starts, so that I actually show up.** — *Priority:* Should-Have — *Why this priority:* "Reminder set" is a promised state on the ticket; drives live attendance which is the whole point of live events.
  - *Acceptance criteria:*
    - The system schedules at least one pre-event reminder (e.g. 24h and/or at-start) via the learner's notification preferences, carrying the join link.
    - For a challenge, a daily nudge fires while the streak is at risk (e.g. "One more day to complete the retention challenge!").
    - Reminders respect the learner's notification and quiet-hours settings.
  - *Business rules / validation:* Reminders are suppressed if the learner cancels registration or the event is cancelled. Challenge nudges stop once the challenge is completed or abandoned. No reminder may imply attendance = certification or credit.
  - *Failure & edge cases:* If the event is rescheduled, previously scheduled reminders are recomputed to the new time, not fired at the old one. A learner who has muted event notifications still sees in-app ticket state (silent, not lost).

- **[EVENT-06] As a Self-directed Learner, I want to join a live workshop and watch a claim get decomposed, sourced, and red-teamed by the Skeptic in real time, so that I can see the trust ledger being built, not just read its output.** — *Priority:* MVP — *Why this priority:* The live claim-check is the domain's differentiated, thesis-proving experience; it is the featured event's entire pitch.
  - *Acceptance criteria:*
    - Joining a live workshop shows the claim under examination, its current trust state as it moves (Sourced → Disputed → Verified, etc.), the source(s) being retrieved live, and the Skeptic's challenge inline.
    - The audience can see the six pipeline stages / coverage map as they are exercised, matching the "What you'll see" checklist from detail.
    - The live view is clearly labelled live, with a running state that distinguishes "not started / live now / ended."
  - *Business rules / validation:* Anything shown live is a *draft* verification, not a certified ledger write, until it passes the normal pipeline/SME rules; the UI must not present a live tag as a permanent trust state. Hard-mode Skeptic in the live check is a Pro capability (EVENT-15).
  - *Failure & edge cases:* If the learner joins late, they see current state plus a catch-up summary, not a blank. If the live stream/verification backend drops, the view degrades to "reconnecting" and preserves the last known claim state rather than blanking. Offline → the join surface shows an offline banner and retries; it never shows a fabricated "Verified" for a claim that didn't complete.

- **[EVENT-07] As a Skeptical / Expert Learner, I want to raise a Conflict on a claim during a live claim-check, so that my sourced objection becomes a first-class, adjudicable object instead of an ephemeral comment.** — *Priority:* MVP — *Why this priority:* This is the invariant that keeps live events honest — live disputes must land in the spine, and it is core to the Skeptic persona's reason to attend.
  - *Acceptance criteria:*
    - During a live workshop, an attendee can raise a dispute on the active claim, attaching a source/citation, which creates a real Conflict tied to that claim and topic.
    - The raised Conflict appears in the topic's global Conflicts list and is attributed to the raiser; it is **not** auto-resolved by the host or the crowd.
    - The attendee can convert a well-sourced objection into a promotion request routed to an SME.
  - *Business rules / validation:* Neither the host, the audience vote, nor applause resolves a Conflict; only the normal Conflict-adjudication path (Skeptic + SME) does. A live-raised Conflict blocks the claim from being presented as Verified for the rest of the session.
  - *Failure & edge cases:* An unsourced "I disagree" is accepted as a comment but cannot become a Conflict without a citation (cite-your-source rule, EVENT-14). Duplicate live disputes on the same claim are merged rather than spawning parallel Conflicts. If the same claim already has an open Conflict, the learner is shown it instead of creating a second.

- **[EVENT-08] As an Event Host, I want to create and schedule an event with a type, time, capacity, format, and (for a claim-check) a linked topic, so that learners can discover and register for it.** — *Priority:* MVP — *Why this priority:* Without host-side creation there is no supply; hosting is the primary actor's core job.
  - *Acceptance criteria:*
    - A host can create an event of type Live workshop / Study group / Challenge / Talk-AMA, setting title, description, "what you'll see," start time + duration + timezone, capacity, online/format, and visibility (public vs tenant-only).
    - A claim-check workshop requires selecting a linked, already-verified topic; a challenge requires a duration/goal (e.g. 7-day retention) and rules.
    - On publish, the event appears in discovery per its visibility and is editable/cancellable by the host.
  - *Business rules / validation:* Only `EVENT-HOST` / `INSTRUCTOR` roles (and tenant hosts allowed by `ORG-ADMIN`) may create events. A claim-check can only link a topic whose pipeline has completed; a host cannot invent a topic here. Hard-mode-Skeptic sessions require the host's plan to support it. Capacity ≥ 1; start time must be in the future.
  - *Failure & edge cases:* Scheduling in the past or with end-before-start is blocked at validation. Linking a topic that is still verifying is disallowed with an explanatory message. A Free-plan host hits topic/hosting limits and sees the upgrade path rather than a silent failure.

- **[EVENT-09] As an Event Host, I want to route what surfaced live — disputes, proposed sources, misconceptions — into Conflicts, Gap-Map entries, and SME promotion requests, so that the value created live isn't lost and gets certified through the proper channel.** — *Priority:* MVP — *Why this priority:* This is the domain's reason to exist inside a verification-first product: events are a *funnel into the spine*, not a side channel around it.
  - *Acceptance criteria:*
    - From the live/host view, the host can convert a surfaced item into (a) a Conflict on a claim, (b) a Gap-Map entry tagged origin = event, or (c) a promotion request for a cited reply — each linking back to the event and the exact claim/section.
    - Routed items appear in their destination surfaces with provenance ("raised in live workshop, 12 Jul") and the original contributor's attribution preserved.
    - A post-event summary lists everything routed and its downstream status.
  - *Business rules / validation:* The host **cannot certify** — every routed item lands in a state that requires SME/Skeptic action (EVENT-13). Gap-Map entries created here follow the standard Open→Watching→Closed→Reopened lifecycle. Promotion requests carry a source or they are rejected.
  - *Failure & edge cases:* If the host tries to mark a live claim "Verified" directly, the action is blocked with "route to an SME to certify." Routing an item twice is deduped. If a linked topic is deleted before routing completes, the item is preserved as an orphan flagged for SME triage rather than silently dropped.

- **[EVENT-10] As a Returning Power-Learner, I want to join a multi-day retention challenge and watch my streak progress against the goal, so that a social commitment reinforces my spaced-review discipline.** — *Priority:* MVP — *Why this priority:* Challenges are the FSRS engine's social skin and the power-learner's home; the streak ring is a shipped, prominent surface.
  - *Acceptance criteria:*
    - Joining a challenge (e.g. "7-day retention") shows a progress ring (e.g. 6/7 days) driven by actual completed review sessions, plus a "learners joined" count.
    - Daily progress advances only when the learner meets the day's honest bar (e.g. completed their due FSRS reviews), not by opening the app.
    - Completing the challenge yields a completion state; the right-rail ring reflects live status.
  - *Business rules / validation:* Challenge progress is computed from the real Review/FSRS signal — it is never a vanity counter and cannot be advanced without qualifying activity. A challenge win confers recognition/streak, **never a certificate or a trust state**. Timezone determines day boundaries per the learner's setting.
  - *Failure & edge cases:* A missed day breaks or pauses the streak per the challenge's rules, shown honestly (no silent forgiveness). Timezone travel must not double-count or skip a day. If the FSRS signal is unavailable, progress shows "pending sync," not a fabricated tick (see EVENT-19 for wrongful-loss recovery).

- **[EVENT-11] As an Exam-prep Student, I want to join a topic-linked study group ahead of my deadline, so that I can work through a specific topic's hard spots with others racing the same material.** — *Priority:* Should-Have — *Why this priority:* Shipped as an event type and high-value for the exam persona, but the solo loop already carries the critical path.
  - *Acceptance criteria:*
    - A study group can link a topic and surface its open Conflicts and Gap-Map hotspots as suggested discussion anchors.
    - Members see the group's time, host, and going-count, and can register like any event.
    - Discussion generated in the group can be routed to the spine via EVENT-09.
  - *Business rules / validation:* A study group discussing a topic inherits that topic's trust states read-only; group consensus never changes them. Cite-your-source conduct (EVENT-14) applies to group threads.
  - *Failure & edge cases:* An under-attended group (below a floor) still runs but shows honest going-counts. If the linked topic is edited/re-verified before the session, the group surfaces the updated trust states rather than a stale snapshot.

- **[EVENT-12] As an Instructor, I want to host cohort study sessions and challenges and then read the four honest signals for my cohort, so that I can target the group's weak spots.** — *Priority:* Should-Have — *Why this priority:* Teams-plan value that extends the domain to educators, but depends on Teams and the Progress/Reports domain being present.
  - *Acceptance criteria:*
    - An Instructor can create tenant-scoped events assigned to a cohort and see aggregate attendance/participation.
    - After an event, the Instructor can read cohort-level Retention / Transfer / Calibration / Drill-detection signals for the covered topic (subject to visibility policy).
    - The Instructor can route cohort misconceptions surfaced live into shared Gap-Map entries.
  - *Business rules / validation:* Instructors hold pedagogical authority but **cannot alter trust states or certify**. Cohort signal visibility is bounded by the `ORG-ADMIN` progress-visibility policy and privacy rules — no per-learner drill-down beyond policy.
  - *Failure & edge cases:* A cohort too small to anonymize aggregate signals suppresses the breakdown rather than exposing individuals. An Instructor without a linked cohort sees an empty/setup state.

- **[EVENT-13] As a Subject-Matter Expert, I want to receive and adjudicate the Conflicts and promotion requests that originated from a live event, so that live value is certified through the same auditable path as everything else.** — *Priority:* MVP — *Why this priority:* This closes the loop that EVENT-09 opens; without it, events would be an epistemic dead end or, worse, an uncertified back door.
  - *Acceptance criteria:*
    - Event-originated Conflicts and promotion requests arrive in the SME queue tagged with event provenance and a link back to the moment/claim.
    - The SME can set the resulting trust state, promote a cited reply into the topic's sources, or reject with reason — following the standard Conflicts/Sources rules.
    - The outcome propagates back to the event's post-summary and to the original contributor's footprint.
  - *Business rules / validation:* The SME is the **only** role that certifies; event provenance grants no shortcut or elevated trust. Promotion requires a durable source, not live testimony. Interpretive claims are mapped, not certified, even if the live audience "agreed."
  - *Failure & edge cases:* If the underlying claim/topic changed since the event, the SME adjudicates against current state and the provenance note flags the drift. A backlog of event-originated items must not block the live product; they queue like any other Conflict.

- **[EVENT-14] As a Community Moderator, I want live chat, study-group threads, and challenge leaderboards to stay anchored to claims and sources under cite-your-source conduct, so that events don't devolve into unverifiable noise.** — *Priority:* Should-Have — *Why this priority:* Moderation protects the verified-answers-only ethos in the live setting, but the smallest events can launch with host-only moderation.
  - *Acceptance criteria:*
    - Moderators can pin claim/source anchors, remove or hide off-topic or unsourced assertions posed as fact, and route strong sourced replies to SMEs.
    - Cite-your-source enforcement: an assertion presented as fact can be flagged for a missing citation.
    - Leaderboard/challenge standings are visible to moderators for integrity checks.
  - *Business rules / validation:* Moderators enforce conduct but **certify nothing** and cannot set trust states. Removing a message never rewrites the ledger. Moderation actions are logged for appeal.
  - *Failure & edge cases:* A live event with no assigned moderator falls back to host moderation with reduced tooling. Mass-report / brigading of a legitimate dissenter is throttled and escalated to `TRUST-SAFETY-LEAD` rather than auto-hiding (EVENT-20).

- **[EVENT-15] As a Free-plan learner, I want to see clearly when an event's hard-mode Skeptic experience is a Pro feature, so that I understand what I'm getting and can choose to upgrade.** — *Priority:* Should-Have — *Why this priority:* Monetization touchpoint aligned to the plan matrix; important but the base event experience must stay valuable on Free.
  - *Acceptance criteria:*
    - Events that advertise "Skeptic on hard mode" show the Pro gating on detail; a Free learner can still register and attend the base session but sees the hard-mode capability marked Pro with an upgrade path.
    - The upgrade nudge links into the standard Upgrade → Checkout flow and does not block basic registration.
  - *Business rules / validation:* Free = no hard-mode Skeptic (per plan matrix); Pro/Teams unlock it. Gating is disclosed on detail, not discovered after joining. Hosting limits also follow plan (EVENT-08).
  - *Failure & edge cases:* A learner who downgrades after registering for a hard-mode session keeps base access but loses the hard-mode overlay, disclosed before the event. Teams-seat learners inherit the tenant plan's capability, not their personal one.

- **[EVENT-16] As an Organization / Teams Admin, I want to run private, tenant-only events over our shared topic library and set who can host and who can see attendance, so that our cohort's live activity stays governed and internal.** — *Priority:* Should-Have — *Why this priority:* Core Teams value for the B2B buyer, but depends on the Teams/tenant substrate.
  - *Acceptance criteria:*
    - An admin can scope events to the tenant (not publicly discoverable), designate which members may host, and set an attendance/progress-visibility policy that events honor.
    - Tenant events can only link topics from the shared library.
    - Admin can see tenant event roster and participation within policy.
  - *Business rules / validation:* `ORG-ADMIN` governs seats, hosting rights, and visibility but **cannot certify claims or set price**. Private events must never leak into public discovery or public ICS. Visibility policy is enforced consistently across EVENT-12's cohort signals.
  - *Failure & edge cases:* A member who loses their seat mid-cycle loses hosting rights but registrations they made as an attendee are handled per the deprovisioning policy, not silently deleted. A public link accidentally generated for a private event is invalidated.

- **[EVENT-17] As a registered learner, I want to be notified and made whole when a host cancels or reschedules an event, so that I'm not left waiting for something that isn't happening.** — *Priority:* MVP — *Why this priority:* Cancellation/reschedule is an unavoidable real-world failure path on a live surface; handling it badly erodes trust directly.
  - *Acceptance criteria:*
    - On cancel/reschedule, every registrant is notified via their channels, the event's detail shows a cancelled/rescheduled banner, the task and calendar entry update, and reminders are recomputed or cancelled.
    - A cancelled claim-check offers the recording (if one exists from a prior run) or a "notify me when rescheduled" option.
    - A reschedule preserves the learner's registration and re-confirms the new time.
  - *Business rules / validation:* Only the host / `ORG-ADMIN` (for tenant events) can cancel or reschedule. A cancellation must never silently disappear from a learner's Registered list; it transitions to a visible cancelled state. Any surfaced-live items already routed to the spine survive the event's cancellation.
  - *Failure & edge cases:* Reschedule collisions with the learner's other events are flagged, not hidden. If notification delivery fails, the in-app banner and Registered-list state remain the source of truth. Cancelling an in-progress live event preserves whatever was already routed to the spine and marks the session ended-early.

- **[EVENT-18] As a learner who couldn't attend live, I want to watch the recording afterward with the trust ledger intact, so that I still learn — while understanding that live-only Q&A was never certified.** — *Priority:* Should-Have — *Why this priority:* The prototypes promise "a recording is shared after"; async access broadens reach, but the live experience is the headline.
  - *Acceptance criteria:*
    - A past event exposes its recording and a summary of what was verified/disputed, with claims still linking to their (current) ledger entries.
    - Live-only interactions (spoken AMA answers, audience chat) are clearly marked as not certified and not sources unless they were routed and later certified via EVENT-13.
    - Watching a recording does not confer attendance credit for a challenge that required live presence.
  - *Business rules / validation:* A recording reflects the ledger *as of viewing*, so a claim shown "Verified" live but later disputed shows its current Disputed state with a note — the recording never freezes a stale trust state as truth. Recording availability and retention follow `COMPLIANCE-DPO` policy (EVENT-24).
  - *Failure & edge cases:* If no recording was captured, the past-event page shows the written summary and routed outcomes instead of a broken player. A claim certified after the event shows an "updated since recording" marker so viewers aren't misled by the older footage.

- **[EVENT-19] As a Returning Power-Learner, I want a fair path to restore a challenge streak I lost to an outage or a timezone bug, so that a platform fault doesn't cost me weeks of momentum — without anyone inventing retention I didn't earn.** — *Priority:* Should-Have — *Why this priority:* Streak integrity is emotionally load-bearing for the power persona, and the fix must respect the anti-fabrication firewall, making it a subtle, important case.
  - *Acceptance criteria:*
    - A learner can dispute a broken streak; Support can restore the *streak/day-credit* where logs show the learner actually completed qualifying reviews (or the platform was down during their window).
    - The restore is auditable and attributed to a Support action, distinct from organic progress.
    - Support **cannot** manufacture the underlying review completions or retention signal — only re-credit a day the evidence supports.
  - *Business rules / validation:* `SUPPORT-AGENT` acts under scoped consent and is firewalled from fabricating a learning signal (per persona). A restored day must trace to real activity or a real outage window; otherwise the request is declined with reason.
  - *Failure & edge cases:* Repeated "lost streak" claims with no supporting activity are declined and flagged to `TRUST-SAFETY-LEAD` as possible gaming (EVENT-20). Concurrent restore + organic completion on the same day must not double-credit. If the outage was real but wide, a bulk grace policy is applied consistently, not case-by-case favoritism.

- **[EVENT-20] As a Trust & Safety Lead, I want to detect and act on challenge, leaderboard, and event abuse, so that the social layer can't be used to fake progress, impersonate hosts, or brigade dissenters.** — *Priority:* Should-Have — *Why this priority:* Anti-gaming protects the honesty of the streak/leaderboard signal and the safety of live events; essential once challenges have stakes, but scales with adoption.
  - *Acceptance criteria:*
    - The lead can detect streak-juking / calibration-gaming patterns feeding challenge standings, sockpuppet study groups, host impersonation, spam events, and mass-report brigading.
    - The lead can freeze an event, remove standings, ban an account, or revoke ill-gotten recognition — but **never hand-certify** a claim as compensation or penalty.
    - Actions are logged and appealable; affected honest users are made whole.
  - *Business rules / validation:* Challenge recognition derived from gamed activity is revocable; certificates and trust states are out of scope for this lever (they live in the spine). Skeptic prompt-injection attempts during a live claim-check are detected and the affected live output is quarantined from routing to the ledger.
  - *Failure & edge cases:* False-positive freezes must be reversible with the event's routed items intact. A banned host's already-certified, SME-approved promotions are *not* auto-reverted (they passed the real bar); only their event standing/recognition is pulled. Vote-ring detection on a study-group leaderboard triggers standings recompute, not deletion of legitimate participation.

- **[EVENT-21] As an Accessibility-Reliant Learner, I want live captions, a non-visual path through the claim-check, and challenge accommodations, so that a live, timed, audio-visual event is fully usable via assistive tech.** — *Priority:* Should-Have — *Why this priority:* Live + timed + color-coded trust states is a severe accessibility stress test central to the `A11Y-LEARNER` mandate, though the base loop's accommodations come first.
  - *Acceptance criteria:*
    - Live workshops provide captions and a text transcript of the claim-check that announces trust-state changes non-visually (not by color alone).
    - The register/join/ticket flow is fully keyboard- and screen-reader-navigable; live regions announce state changes ("claim now Disputed").
    - Challenge day-boundaries and any live-participation requirement offer accommodation (e.g. extended windows) that don't penalize AT pacing.
  - *Business rules / validation:* Trust states in the live view must never be conveyed by color or spatial position alone (the domain's core encoding stress test). Accommodations must not fabricate progress — they adjust timing/encoding, not the honest bar.
  - *Failure & edge cases:* If live captioning fails, the event surfaces a text fallback and post-event transcript rather than an inaccessible audio-only stream. Time-pressured challenge nudges must be silenceable without losing eligibility.

- **[EVENT-22] As a Guest / Visitor, I want to preview a public event page and be prompted to sign up to register, so that a compelling live claim-check can convert me — while I persist nothing until I choose to.** — *Priority:* Should-Have — *Why this priority:* Events (especially public claim-checks) are a natural top-of-funnel conversion hook aligned to the Guest persona's evaluate-then-convert path.
  - *Acceptance criteria:*
    - A public event's detail is viewable without an account (about, host, what you'll see), with Register replaced by "Sign up to register."
    - Registering routes through auth, then returns the guest to the completed registration.
    - No attendee data, reminder, or task is created for a guest until they authenticate.
  - *Business rules / validation:* Guests persist nothing (per persona); private/tenant events are never guest-visible (EVENT-16). A guest cannot raise Conflicts or route to the spine.
  - *Failure & edge cases:* A guest who abandons sign-up leaves no orphaned registration. A guest hitting a private event link gets a generic not-available page, not a leak of the event's existence to unauthorized viewers.

- **[EVENT-23] As an Event Host, I want AMA and live-Q&A answers explicitly labelled as uncertified until sourced and SME-reviewed, so that a confident live answer is never mistaken for a trust state.** — *Priority:* Should-Have — *Why this priority:* Directly enforces the verification-first thesis in the most hallucination-prone live format (a human answering off the cuff); important but scoped to the Talk/AMA type.
  - *Acceptance criteria:*
    - AMA/Q&A surfaces carry a persistent "answers here are not certified — sourced answers can be promoted for SME review" label.
    - A host can convert a strong, cited AMA answer into a promotion request (EVENT-09), never into a live certification.
    - The AMA recording/summary preserves the uncertified labelling (EVENT-18).
  - *Business rules / validation:* A spoken or typed AMA answer is never a source or a trust state; only SME promotion of a *cited* answer changes the ledger. The Skeptic may be invoked live to red-team an answer but cannot certify it.
  - *Failure & edge cases:* An AMA answer that later proves wrong and was never certified requires no ledger correction (it was never in the ledger); if it *was* promoted and certified, it follows the normal Conflict/revocation path. Screenshotting a live answer as "VeriLearn says X" is countered by the persistent uncertified label.

- **[EVENT-24] As a Compliance / Data-Protection Officer, I want event recordings, attendee data, and minor participation governed by consent and retention rules, so that the live layer stays compliant and inside DSAR scope.** — *Priority:* Should-Have — *Why this priority:* Live recordings and attendee lists are real personal-data risk (esp. minors), squarely in the DPO's mandate, though it rides atop the platform's broader privacy substrate.
  - *Acceptance criteria:*
    - Recording requires disclosed consent; attendees are informed a session is recorded and how long it's retained.
    - Event registrations and recordings are included in a learner's data export/deletion (DSAR) and honor retention limits.
    - Minor participation is gated by the applicable policy (COPPA/FERPA), including guardian-related constraints where a shared account is in play.
  - *Business rules / validation:* The DPO's authority governs personal data and consent, **never truth** — it cannot alter trust states. Recording retention is time-bounded and enforced; tenant events honor the org's data policy.
  - *Failure & edge cases:* A deletion request must remove or irreversibly anonymize the requester's presence in recordings/rosters to the extent technically feasible, with residual-copy handling disclosed. A minor detected on a session lacking required consent triggers a hold on that recording's distribution.

- **[EVENT-25] As an audience member of a live workshop, I want a computational claim proven by the Execution Sandbox live with a reproducible trace, so that I see empirical verification happen, not just source-matching.** — *Priority:* Nice-to-Have — *Why this priority:* A powerful, on-brand demonstration of the Verified·execution state, but the sandbox-live integration is beyond the MVP live experience.
  - *Acceptance criteria:*
    - During a claim-check, a computational claim can be run in the sandbox live, showing the assertion, the run, pass/fail, and a reproducible trace.
    - A passing run produces a Verified·execution *candidate* that still routes through the ledger; a failing run raises a computational Conflict.
    - The trace is preserved with the event summary/recording.
  - *Business rules / validation:* The sandbox **refuses rather than fakes** a pass; a live green check must correspond to a real, reproducible run. Even a live pass is a candidate until written through the normal ledger path — the audience cannot vote it Verified.
  - *Failure & edge cases:* A sandbox timeout or crash during the live run is shown as "could not verify live" (a non-result), never as a pass. A non-deterministic claim that can't be reproduced is flagged as such rather than certified on a single lucky run.

### Business rules & invariants

- **Events certify nothing.** No event outcome — attendance, applause, a host's word, crowd consensus, a challenge win, an AMA answer — is ever a trust state, a source, or a certificate. The only paths to the ledger are the standard ones (pipeline verification, Skeptic + SME adjudication, SME source promotion). Events *feed* these paths via Conflicts, Gap-Map entries, and promotion requests; they never bypass them.
- **Live output is draft until certified.** A trust state shown moving during a live claim-check is a draft/candidate. The UI must never present a live or in-progress verification as a permanent ledger truth, and recordings must reflect the *current* ledger, not a frozen live snapshot.
- **Route, don't rule.** The Event Host convenes and routes; the Skeptic red-teams; the SME certifies. A host attempting to hand-set a trust state is blocked with "route to an SME to certify."
- **Cite-your-source, live.** An assertion presented as fact in any event surface (chat, study group, AMA) can be flagged for a missing citation; only a *cited* objection can become a Conflict, and only a *cited* reply can become a promotion request.
- **Challenge progress is honest.** Streak/challenge advancement is derived from the real Review/FSRS signal and never from mere presence or app-opens. Recognition is revocable if gamed; it is never a certificate. No vanity metrics.
- **Registration is idempotent and free.** One registration per learner per event; retries never duplicate registrations, tasks, or reminders; free registration creates no billing event.
- **Attendance ≠ credential.** Attending, watching a recording, or winning a challenge earns recognition/streak only. Certificates come exclusively from the Tests domain against verified/sourced claims.
- **Visibility is enforced end-to-end.** A tenant/private event must never appear in public discovery, public ICS, or guest previews; visibility set by `ORG-ADMIN` is honored across discovery, calendar, cohort signals, and recordings.
- **Time is explicit.** Every event carries an explicit timezone; day-boundaries for challenges and reminder scheduling use the learner's timezone; ICS emits offsets. No implicit-timezone ambiguity.
- **Role gating.** Only `EVENT-HOST` / `INSTRUCTOR` / tenant-authorized members may create events. Only `SME-REVIEWER` certifies. Only host / `ORG-ADMIN` cancels or reschedules. `TRUST-SAFETY-LEAD` can freeze/ban/revoke standing but not certify. `SUPPORT-AGENT` can restore evidenced streaks but not fabricate signals.
- **Plan gating.** Hard-mode-Skeptic live experiences and hosting limits follow the plan matrix (Free: no hard mode; Pro/Teams: unlocked). Gating is disclosed before joining, not after.

### Cross-domain dependencies

- **Verification spine (`VERIFY-PIPELINE`, `SKEPTIC-AI`, `EXEC-SANDBOX`) — needs from:** the linked topic's completed pipeline output and live claim/trust-state stream for claim-checks; live Skeptic hard-mode red-teaming; live sandbox runs for EVENT-25. **Provides to:** live-surfaced disputes as inputs.
- **Conflicts & Trust — provides to:** event-raised Conflicts with event provenance; **needs from:** the standard adjudication path to resolve them (events never resolve their own Conflicts).
- **Gap Map — provides to:** misconceptions surfaced live as Gap-Map entries (origin = event) linked to the exact section; **needs from:** the Open→Watching→Closed→Reopened lifecycle.
- **Sources / SME review — provides to:** promotion requests for cited live replies; **needs from:** SME certification to actually promote a reply into a topic's sources (EVENT-13).
- **Review / FSRS — needs from:** the real retention/streak signal that drives challenge progress; **provides to:** a social commitment layer over spaced review.
- **Progress / Reports — needs from:** the four honest signals for cohort read-out (EVENT-12); **provides to:** participation context.
- **My Tasks — provides to:** a task per registered event; **needs from:** task surfacing and completion.
- **Notifications — needs from:** reminder and cancel/reschedule delivery honoring quiet hours and preferences.
- **Community — shares:** moderation model, contributor footprint, cite-your-source ethos; study groups and threads interoperate.
- **Auth & Onboarding — needs from:** account creation for guest→registrant conversion (EVENT-22).
- **Teams / Org admin & Billing — needs from:** tenant scoping, hosting rights, visibility policy, and plan/seat capability gating.
- **Tests & Certificates — boundary:** events explicitly do *not* issue certificates; the two must not be conflated (attendance ≠ credential).
- **Settings — needs from:** notification, quiet-hours, timezone, and privacy preferences.

### Key technical requirements

- **Real-time delivery for live claim-checks:** low-latency streaming of claim state / trust-state transitions and Skeptic output to many concurrent viewers, with graceful reconnect that preserves last-known state (never a fabricated Verified on drop).
- **Scheduling & timezone correctness:** authoritative event times in UTC with per-learner timezone rendering; DST-safe reminder scheduling; challenge day-boundary computation robust to travel; standards-compliant ICS (with SEQUENCE bumps on reschedule) and per-learner, non-shareable join URLs.
- **Idempotent registration & fan-out:** dedupe on (learner, event) under retries/concurrency; transactional creation of registration + task + reminder so partial failures don't strand state; capacity/waitlist handling under race conditions.
- **Provenance & routing plumbing:** every live-surfaced item carries immutable provenance (event, timestamp, claim/section, contributor) into Conflicts / Gap Map / promotion requests, and survives event cancellation or topic edits (orphan-safe).
- **Anti-gaming & integrity:** streak/leaderboard computation resistant to juking; sockpuppet/vote-ring detection on study groups; host-identity verification against impersonation; Skeptic prompt-injection detection that quarantines affected live output from ledger routing.
- **Recording pipeline & data governance:** consent-gated capture, time-bounded retention, DSAR-inclusive export/deletion (including anonymizing a requester's presence in recordings/rosters), and minor-participation gating (COPPA/FERPA).
- **AI cost & capacity control:** live hard-mode Skeptic and live sandbox runs are compute-intensive and Pro-gated; need per-event budgeting/queuing so a large live audience doesn't exhaust verification capacity, and rate-limiting on live Conflict-raising to prevent flooding.
- **Accessibility infrastructure:** live captioning + transcript, ARIA live-region announcement of trust-state changes (never color/position-only), fully keyboard/screen-reader-navigable register/join/ticket flows, and silenceable time-pressure nudges.
- **Notifications & calendar integration:** reliable multi-channel reminders with recompute-on-reschedule and suppress-on-cancel; in-app ticket state as the durable source of truth when external channels fail.

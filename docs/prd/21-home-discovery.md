## Learner Home / Today, Dashboard & Discovery / Search

### Overview

This domain owns the **first screen a signed-in learner sees** — the Dashboard, branded internally as the *Library* hub — and the **Today** plan, discovery, and search surfaces that sit on top of it. It is the launchpad for the entire learning loop: it aggregates *what is waiting* (reviews due, open conflicts, tasks, upcoming tests, newly-verified topics, tracked gaps) into a single "what should I do right now" view, it surfaces the learner's topics with their live **trust bars**, and it provides the entry points (search, example on-ramps, the "Start a topic" hero) into every other domain.

Its job in the product thesis is specific: the Dashboard is where **trust becomes ambient**. Before a learner opens a single lecture, the home screen already communicates that this product is about verified content — the hero sells "Learn things you can actually trust," every topic row carries a colored trust bar (percent verified, disputes, unsupported), and the counters shown are honest, traceable numbers (claims checked, conflicts open) rather than vanity metrics. This domain **aggregates and routes; it never mutates epistemic state** — you cannot certify a claim, resolve a conflict, or change a trust state from Home. It reads the ledger and the loop's other domains and points at them.

Because it is the most-visited screen in the app and the one every persona passes through daily, its non-functional bar (latency, graceful degradation, offline behavior, accessibility of the trust encoding) is unusually high.

### Personas involved

- **Self-directed Learner (LEARNER-SELF)** — primary. Home is their daily launchpad: due-strip, My Topics, the "Start a topic" hero, the upgrade nudge, first-run welcome.
- **Returning Power-Learner (LEARNER-POWER)** — near-daily driver of a large portfolio; lives on the Today plan / review-debt surfacing and needs fast search, filter, and prioritization across many topics.
- **Exam-prep Student (LEARNER-EXAM)** — leans on the "Upcoming tests" widget, predicted-readiness surfacing, and fast paths to open gaps before a deadline.
- **Skeptical / Expert Learner (LEARNER-SKEPTIC)** — uses Home to jump to open Conflicts to adjudicate and to run trust-state search (find every disputed/unsupported claim across topics).
- **Team Seat Learner (LEARNER-TEAM)** — Home surfaces the shared, pre-curated topic library (inherited trust) alongside their own progress; search spans the shared library they belong to.
- **Guest / Visitor (GUEST)** — meets an ephemeral demo Dashboard that persists nothing; the conversion surface.
- **Accessibility-Reliant Learner (A11Y-LEARNER)** — the dense widget grid and color-coded trust bars are a core stress test; Home must be fully navigable and legible via assistive tech.
- **Parent / Guardian (GUARDIAN)** — non-learning overseer who, on today's single-shared-account model, sees the dependent's Home; exposes a real product gap.
- **Instructor / Educator (INSTRUCTOR)** and **Organization / Teams Admin (ORG-ADMIN)** — land on a Home too, but their operational/cohort surfaces live in the Educator and Org-Admin domains; Home only offers them the launch entry points (referenced, not redefined here).

### User stories

- **[HOME-01] As a Self-directed Learner (LEARNER-SELF), I want a first-run Home that explains verification and points me at one action, so that I understand what makes VeriLearn different before I do any work.** — *Priority:* MVP — *Why this priority:* The empty Library is the one screen every new user sees and it carries the whole value proposition.
  - *Acceptance criteria:*
    - With zero topics, Home shows a branded hero ("Learn things you can actually trust"), a one-line verification value prop, and exactly one primary CTA into New Topic.
    - A "How VeriLearn works" 3-step strip (Name a topic → We verify it → Learn & retain) is present.
    - Stat placeholders read 0 with the copy "These fill in once you start your first topic" — never four 0% bars styled as failure.
  - *Business rules / validation:* First-run state persists until the learner has ≥1 topic (in any pipeline stage); it is per-account, not per-session. Only one primary CTA on the empty screen.
  - *Failure & edge cases:* If the account has a topic that failed verification (0 completed but 1 attempted), show the in-progress/failed topic rather than the pristine welcome; if example-topic content fails to load, still show the hero CTA (never a fully blank screen).

- **[HOME-02] As a Self-directed Learner (LEARNER-SELF), I want zero-effort example on-ramps on Home, so that I can see a finished, verified lecture in one click before typing anything.** — *Priority:* Should-Have — *Why this priority:* Reduces first-topic friction and demonstrates the trust ledger on real content; strong adoption lever but not blocking.
  - *Acceptance criteria:*
    - The empty and low-topic Home shows a small set of curated example topics (e.g. Dijkstra's algorithm, Merkle trees, Binary search) with subject + level.
    - Selecting an example seeds New Topic pre-filled (or opens a pre-verified showcase), not a blank form.
    - Examples disappear or demote once the learner has their own topics.
  - *Business rules / validation:* Example set is curated by the vendor and pre-verified; examples count against the Free 3-topic cap only if the learner actually creates one (see HOME-13).
  - *Failure & edge cases:* If an example's cached lecture is stale/unavailable, fall back to seeding New Topic with its spec; never dead-end on a broken showcase.

- **[HOME-03] As a Self-directed Learner (LEARNER-SELF), I want a "Today" due-strip that summarizes what's waiting, so that I always know what to do the moment I open the app.** — *Priority:* MVP — *Why this priority:* The daily plan is the engine that keeps the spaced-review loop alive; it is the reason to return.
  - *Acceptance criteria:*
    - A header line aggregates live counts: reviews due today, open conflicts, tasks due, and any newly-verified topics ready (e.g. "You have 4 reviews due and 2 open conflicts today").
    - Each count is a link that routes to the owning surface (Review, Conflicts, Tasks, Topic).
    - Counts reflect the current day in the learner's timezone and update after an action completes.
  - *Business rules / validation:* Every counter is read from its source-of-truth domain (FSRS for reviews, ledger for conflicts, Tasks, Tests) — Home never computes or fabricates a number. When all counts are zero, show a "You're all caught up" reward state with the next due date, not a void.
  - *Failure & edge cases:* Timezone/day-boundary changes must not double-count or drop items; if one source is unreachable, that specific counter degrades to a neutral placeholder while the rest render (see HOME-17).

- **[HOME-04] As a Returning Power-Learner (LEARNER-POWER), I want Home to prioritize what to do next across my whole portfolio, so that I can clear review debt efficiently without triaging topic by topic.** — *Priority:* Should-Have — *Why this priority:* Directly serves the highest-frequency persona managing many topics against accumulating review debt.
  - *Acceptance criteria:*
    - A "To review / To do" panel lists the top pending items across all topics (due reviews, conflicts to resolve, tasks) ordered by urgency (overdue > due-today > soon).
    - Each item shows its topic, type, and due context and links directly into the action.
    - The panel caps at a readable number with a "see all" into My Tasks.
  - *Business rules / validation:* Ordering is deterministic and explainable (urgency then FSRS-overdue magnitude); Home surfaces items but does not reschedule them. Aggregation is per-learner and tenant-scoped.
  - *Failure & edge cases:* With hundreds of overdue items, cap the list and summarize the remainder ("+38 more") rather than rendering an unbounded list; if a linked item was completed elsewhere, the link resolves to a "already done" state, not an error.

- **[HOME-05] As a Self-directed Learner (LEARNER-SELF), I want my topics listed with live trust bars and status, so that I can see at a glance how much of each topic I can actually trust.** — *Priority:* MVP — *Why this priority:* The trust bar on the home list is where the product's differentiation becomes visible before entering any topic.
  - *Acceptance criteria:*
    - Each topic row shows title, subject, claim count, a segmented trust bar (verified/sourced/disputed proportions), a percent-verified figure, and a status chip (On track / N disputes / Verified).
    - Rows link into the Topic Workspace; a "See all" links to the full Topics library.
    - Status chips reflect real ledger state (e.g. "1 dispute" when a Conflict is open).
  - *Business rules / validation:* Trust-bar segments and percentages derive from the trust ledger's five states; Home renders them read-only and must match the Topic Workspace exactly (single source of truth). The home list is a bounded preview (most-recent/most-active) — full management lives in the Topics domain.
  - *Failure & edge cases:* A topic mid-verification shows a "Verifying…" state and is not enterable as a lecture (see HOME-11); a topic with 0% verified still renders its bar (all-unsupported) rather than an empty sliver with no explanation.

- **[HOME-06] As a Returning Power-Learner (LEARNER-POWER), I want to search my topics by name/subject with typeahead, so that I can jump to any topic instantly in a large portfolio.** — *Priority:* MVP — *Why this priority:* Search is the primary navigation for anyone past a handful of topics; the top-bar search input is a core home affordance.
  - *Acceptance criteria:*
    - Typing in the Home search field returns matching topics (title, subject, alias) with debounced typeahead results.
    - Selecting a result opens that Topic Workspace.
    - Results respect scope: the learner's own topics plus any Teams shared library they belong to — never another tenant's content.
  - *Business rules / validation:* Search is tenant- and membership-scoped; index updates incrementally as topics are created and as the pipeline changes trust states. Matching is case-insensitive and tolerant of minor typos.
  - *Failure & edge cases:* Empty query shows recent/most-active topics, not an error; a search-service outage falls back to client-side filtering of the loaded topic list and shows a subtle "limited results" note (see HOME-18).

- **[HOME-07] As a Skeptical / Expert Learner (LEARNER-SKEPTIC), I want to search across claims by trust state, so that I can find every disputed or unsupported claim in my library and go fix the weak spots.** — *Priority:* Should-Have — *Why this priority:* A verification-first differentiator — searching the ledger itself, not just titles — that serves the expert/auditor persona directly, but layers on top of basic topic search.
  - *Acceptance criteria:*
    - Search supports filters/operators for trust state (e.g. `disputed`, `unsupported`, `interpretive`) and returns matching claims with their topic and source context.
    - Results deep-link to the exact claim's ledger entry / section, or to the Conflicts surface for disputed items.
    - Filters compose with a text query (e.g. "hashing" + unsupported).
  - *Business rules / validation:* Results are read-only pointers; adjudication happens in Conflicts/Sources, never in search. Scope rules from HOME-06 apply. Disputed results are labeled as Conflicts, not as facts.
  - *Failure & edge cases:* A query that matches thousands of claims is paginated/summarized by topic; if the ledger index lags a recent pipeline run, show an "index updating" hint so counts aren't mistaken for ground truth.

- **[HOME-08] As an Exam-prep Student (LEARNER-EXAM), I want Home to surface upcoming tests with predicted readiness, so that I can see whether I'm on pace for my deadline at a glance.** — *Priority:* Should-Have — *Why this priority:* Serves the deadline-driven persona's core need and reinforces the "verified-only tests" story, but the test engine itself is another domain.
  - *Acceptance criteria:*
    - An "Upcoming tests" panel lists scheduled/available tests with topic, format hint, and time-to-deadline, sorted soonest-first, with an urgency badge (e.g. "3 soon", "in 2 days").
    - Each entry shows or links to a predicted-readiness signal and routes to Test Detail.
    - A "see all" links to the Tests domain.
  - *Business rules / validation:* Readiness and test scope are read from the Tests/Reports domains; Home displays but does not compute readiness. Tests whose questions draw only from verified/sourced claims is a Tests-domain guarantee referenced here, not enforced here.
  - *Failure & edge cases:* If readiness can't be computed yet (too little data), show "readiness pending" rather than 0%; a test with an unresolved-conflict dependency is shown as such rather than hidden.

- **[HOME-09] As a Skeptical / Expert Learner (LEARNER-SKEPTIC), I want open conflicts surfaced on Home, so that I can jump straight to adjudicating disputes the Skeptic or sandbox raised.** — *Priority:* Should-Have — *Why this priority:* Keeps the trust ledger honest by pulling adjudication forward, but the conflict-resolution UI lives in the Conflicts domain.
  - *Acceptance criteria:*
    - Home shows an open-conflicts count and a shortcut into the (per-topic or global) Conflicts surface.
    - The shortcut carries the topic/claim context for the most urgent conflicts.
    - When zero conflicts are open, the surface reassures ("Every claim is currently settled") rather than showing an empty box.
  - *Business rules / validation:* Home cannot resolve, dismiss, or re-open a conflict — it only counts and links. Counts come from the ledger.
  - *Failure & edge cases:* If a conflict was resolved in another session, the count reconciles on next load/refresh (see HOME-19); a conflicts-service error degrades only that widget.

- **[HOME-10] As a Self-directed Learner (LEARNER-SELF), I want to see when a topic finishes verifying and becomes ready, so that I know exactly when I can start reading a trusted lecture.** — *Priority:* MVP — *Why this priority:* The pipeline runs in the background; Home is where its completion must land or the loop stalls.
  - *Acceptance criteria:*
    - A topic in the verification pipeline appears on Home with a live "Verifying… (stage N of 6)" status and is not enterable as a lecture.
    - On completion it flips to a ready state with its trust bar populated and becomes clickable; a subtle "ready" cue is shown.
    - A failed verification shows a distinct error state with a retry path.
  - *Business rules / validation:* Pipeline stage/status is owned by the New Topic/Pipeline domain; Home reflects it. A topic is never presented as a readable lecture before verification completes.
  - *Failure & edge cases:* If the pipeline stalls/times out, Home shows "couldn't finish verifying" with Retry and Back-to-library, and nothing unverified is presented as fact (mirrors error-state VL-503); if the learner navigates away and back, in-progress status resumes without a lost job.

- **[HOME-11] As a Self-directed Learner (LEARNER-SELF), I want honest at-a-glance counters (verified topics, claims checked, certificates), so that my Home reflects real, traceable accomplishment and not vanity metrics.** — *Priority:* Should-Have — *Why this priority:* Reinforces the "no vanity metrics" thesis on the most-seen screen; supportive rather than loop-critical.
  - *Acceptance criteria:*
    - Stat cards show counts (verified topics, claims checked, certificates earned) each traceable to an underlying record.
    - Each counter can be traced (link or drill) to what produced it (topics, ledger, certificates).
    - No metric is shown that isn't backed by a real event; the four honest signals (Retention, Transfer, Calibration, Drill) live in Reports and are referenced, not restated here.
  - *Business rules / validation:* Counts are derived, never learner-editable; certificates count only issued, non-revoked ones. Study-time/activity is context, not a scored signal.
  - *Failure & edge cases:* Pre-data accounts show 0 with explanatory copy, never a broken chart; if a counter's source is unavailable, show the last-known value with a stale marker rather than a wrong 0.

- **[HOME-12] As a Guest / Visitor (GUEST), I want an ephemeral demo Dashboard, so that I can judge whether the trust-ledger claim is real in minutes without signing up.** — *Priority:* Should-Have — *Why this priority:* The conversion surface for the top of the funnel; important for growth but not required for the core authenticated loop.
  - *Acceptance criteria:*
    - An unauthenticated visitor can view a demo Home with a pre-verified example topic showing real trust bars and claim states.
    - The demo makes clear it is a preview and persists nothing; a persistent "sign up to keep this" conversion CTA is present.
    - Attempting an action that would write (create topic, review) prompts sign-up.
  - *Business rules / validation:* Nothing the guest does is persisted; no PII collected; demo content is vendor-curated and read-only. Guest can self-select out with no dark patterns.
  - *Failure & edge cases:* On refresh/return, guest state resets cleanly (no orphaned data); if demo content fails to load, show a static value-prop card rather than an error.

- **[HOME-13] As a Self-directed Learner on Free (LEARNER-SELF), I want Home to reflect my plan and topic cap, so that I understand my limits and the upgrade path without hitting a surprise wall.** — *Priority:* Should-Have — *Why this priority:* Monetization nudge belongs on the most-seen screen, but plan/billing logic is owned by the Billing domain.
  - *Acceptance criteria:*
    - Home shows a plan-aware upgrade nudge ("Go Verified Pro") describing Pro benefits (unlimited topics, Skeptic hard mode).
    - When a Free learner is at the 3-active-topic cap, the "Start a topic" CTA communicates the cap and routes to Upgrade instead of failing silently.
    - Pro/Teams learners do not see the Free-cap messaging.
  - *Business rules / validation:* Plan, seat, and cap state are read from Billing/Org-Admin; Home enforces the cap at the CTA but does not set price or plan. Active-topic count excludes deleted/archived topics.
  - *Failure & edge cases:* If plan state is temporarily unknown, default to the more permissive read for display but re-check at the point of topic creation; a mid-session plan change (upgrade completed elsewhere) reconciles the nudge on next load.

- **[HOME-14] As a Team Seat Learner (LEARNER-TEAM), I want Home to surface the shared topic library alongside my own work, so that I can learn inside the curated set my team maintains.** — *Priority:* Should-Have — *Why this priority:* Serves the non-obvious consumer half of Teams; depends on Org-Admin's shared-library model.
  - *Acceptance criteria:*
    - A Team seat's Home shows shared-library topics (with inherited trust bars) distinctly from personally-created topics.
    - Search and the Today plan span both personal and shared items the learner has access to.
    - Shared topics show they are team-owned (the learner can't delete/re-verify them).
  - *Business rules / validation:* Shared-library membership and visibility policy are owned by Org-Admin; Home respects role and progress-visibility settings. A seat learner owns no billing/seats and cannot change shared trust states.
  - *Failure & edge cases:* If the learner is removed from a team mid-session, shared topics drop from Home on next load with a clear notice; a shared topic the admin unpublished shows as unavailable, not broken.

- **[HOME-15] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want the Dashboard and its trust encoding to be fully usable via assistive tech, so that the trust ledger's meaning never depends on seeing color or layout.** — *Priority:* MVP — *Why this priority:* The thesis treats color/spatial/timed encoding as a core stress test, not an edge case; trust must be perceivable by everyone.
  - *Acceptance criteria:*
    - Every trust bar and status chip exposes its meaning as text (e.g. "83% verified, 1 disputed") to screen readers — color is never the sole signal.
    - Home uses semantic landmarks/headings; all widgets, counters, and links are keyboard-reachable in a logical order with visible focus.
    - The dense multi-widget grid reflows and remains operable at high zoom / small viewports.
  - *Business rules / validation:* WCAG 2.2 AA as the floor for contrast, focus, and non-color encoding; no purely time-based cue on Home. Search is operable by keyboard alone.
  - *Failure & edge cases:* When a widget degrades (HOME-17), its replacement placeholder is also announced meaningfully; live-updating counters use polite announcements, not focus-stealing.

- **[HOME-16] As a Self-directed Learner (LEARNER-SELF), I want Home to work sensibly when I'm offline, so that a dropped connection doesn't hide my plan or make me lose work.** — *Priority:* Should-Have — *Why this priority:* Explicit failure path; the loop (esp. reviews) must survive flaky connectivity to be trustworthy.
  - *Acceptance criteria:*
    - Offline, Home renders last-known counters and topic list from cache with a clear "offline — showing your last synced view" banner.
    - A "Try again" affordance retries the connection.
    - Copy reassures that offline-completed reviews still count and will sync.
  - *Business rules / validation:* Cached view is read-only; no counter is presented as fresh while offline. On reconnect, state re-syncs and stale markers clear automatically.
  - *Failure & edge cases:* If the cache is empty (first-ever load offline), show the branded offline state, not a blank grid; conflicting local vs. server state on reconnect resolves toward server truth with the learner's completed actions preserved.

- **[HOME-17] As a Returning Power-Learner (LEARNER-POWER), I want Home to degrade one widget at a time when a service fails, so that a single backend hiccup doesn't blank my whole dashboard.** — *Priority:* Should-Have — *Why this priority:* Explicit failure path; the Dashboard fans out to many services, so partial-failure resilience is essential for its reliability bar.
  - *Acceptance criteria:*
    - If one source (e.g. conflicts count, activity chart) fails, that widget shows an inline retry/placeholder while all other widgets render normally.
    - No single widget failure produces a full-page error.
    - Failed widgets retry independently and recover in place.
  - *Business rules / validation:* Each widget has an independent load/error boundary; a failed counter never renders a misleading 0 (it renders "unavailable"). Aggregation timeouts are per-source, not global.
  - *Failure & edge cases:* If the primary topic/list service is the one down, show a minimal safe Home (hero + nav) rather than nothing; cascading failures collapse to the offline-style state (HOME-16) rather than a raw error page.

- **[HOME-18] As a Returning Power-Learner (LEARNER-POWER), I want a clear no-results and search-error experience, so that a fruitless or failed search never looks like my topics vanished.** — *Priority:* Should-Have — *Why this priority:* Explicit failure path; search is a primary nav and its empty/error states are frequently hit at scale.
  - *Acceptance criteria:*
    - A query with no matches shows a "No topics match '<query>'" state with a suggestion to broaden or create a topic — not a blank list.
    - A search-service error falls back to client-side filtering of loaded topics and shows a subtle "search limited right now" note.
    - Clearing the query restores the default recent-topics view.
  - *Business rules / validation:* No-results must distinguish "nothing matched" from "search failed"; the fallback never claims completeness it can't guarantee.
  - *Failure & edge cases:* Trust-state filters (HOME-07) with no matches say so explicitly ("no unsupported claims found — good news"); an index that's mid-rebuild surfaces an "updating" note rather than wrong zeros.

- **[HOME-19] As a Returning Power-Learner (LEARNER-POWER), I want Home counters to reconcile when state changes elsewhere, so that stale numbers never mislead me about what's actually due.** — *Priority:* Should-Have — *Why this priority:* Explicit concurrency/edge path; the same learner acts in multiple tabs/sessions and the due-strip must stay honest.
  - *Acceptance criteria:*
    - Completing a review/conflict/task in another tab or on mobile updates the Home counters on next focus/refresh (or live, if supported).
    - Counters never go negative and never show a count for items already resolved.
    - The "all caught up" state appears once the last due item clears anywhere.
  - *Business rules / validation:* Home reads counts from source domains; it reconciles on visibility-change and after any local action. Optimistic decrements are corrected against server truth.
  - *Failure & edge cases:* Rapid concurrent completions must not double-decrement; if reconciliation fails, prefer showing a soft "refresh to update" hint over a confidently-wrong number.

- **[HOME-20] As a Parent / Guardian (GUARDIAN), I want visibility into the dependent's Home activity, so that I can oversee a minor's learning — acknowledging today's single-shared-account limitation.** — *Priority:* Future — *Why this priority:* A real, known product gap (one shared account, no distinct guardian view); worth capturing but not part of the current build.
  - *Acceptance criteria:*
    - Documented gap: on the shared-account model, the guardian sees exactly the learner's Home with no separate oversight surface.
    - A future guardian view would expose activity/progress read-only without impersonating the learner or altering any epistemic state or certificate.
    - Any future minor-safety controls route through the Compliance/DPO domain (FERPA/COPPA), not Home.
  - *Business rules / validation:* A guardian can never certify claims, resolve conflicts, or edit trust states; oversight is read-only. Billing authority is the guardian's, but that lives in the Billing domain.
  - *Failure & edge cases:* Until a distinct role exists, Home must not leak controls (e.g. Danger Zone) that assume the account owner is an adult; document the risk for Compliance.

- **[HOME-21] As a Self-directed Learner (LEARNER-SELF), I want a "learn next" suggestion on Home, so that I have an obvious next topic when I finish or stall.** — *Priority:* Nice-to-Have — *Why this priority:* Deepens engagement but is not core to the verification loop and must stay cheap/honest to avoid content-breadth positioning the product explicitly rejects.
  - *Acceptance criteria:*
    - Home may show a small, clearly-labeled suggestions row (adjacent subjects, prerequisites of open topics, or curated examples).
    - Suggestions are transparent about why they appear and route into New Topic pre-filled.
    - Suggestions never crowd out the Today plan or the primary CTA.
  - *Business rules / validation:* Suggestions are advisory, cached/cheap, and never imply the suggested content is already verified. Free-cap rules (HOME-13) still apply on click.
  - *Failure & edge cases:* If personalization data is thin, fall back to curated examples rather than empty or random suggestions; suggestion-service failure hides the row silently (it is non-essential).

- **[HOME-22] As an Instructor / Educator (INSTRUCTOR), I want Home to give me the launch entry points into my cohort surfaces, so that I can reach assignments and the honest signals quickly.** — *Priority:* Nice-to-Have — *Why this priority:* Instructors land on Home, but their real work (assigning, reading cohort signals) is owned by the Educator/Reports domains; Home only routes.
  - *Acceptance criteria:*
    - An instructor's Home offers clear entry points to their cohort/assignment and reporting surfaces (referenced domains), not learner-only widgets alone.
    - Home does not present the instructor any control to change trust states or certify (they hold pedagogical, not epistemic, authority).
  - *Business rules / validation:* Role determines which entry points appear; Home never grants an instructor ledger-mutation power. Cohort data visibility follows Org-Admin policy.
  - *Failure & edge cases:* If the instructor also learns personally, both learner and educator entry points coexist without confusing the two contexts.

### Business rules & invariants

- **Read-and-route, never mutate.** Home aggregates and links; it cannot certify a claim, change a trust state, resolve/re-open a conflict, reschedule a review, or issue/revoke a certificate. Every such action happens in its owning domain.
- **Every number is traceable.** All counters (reviews due, conflicts, tasks, claims checked, verified topics, certificates) are read from a source-of-truth domain and can be traced to the records that produced them. Home fabricates no metric.
- **No vanity metrics.** Home surfaces honest, actionable counts and context (study time is context). The four scored signals — Retention, Transfer, Calibration, Drill detection — live in Reports; Home may link but must not restate them as scores.
- **Trust is never color-only.** Trust bars and status chips always expose their meaning as text; the five trust states drive segment colors but meaning survives without color, spatial layout, or timing.
- **Nothing unverified is presented as a readable lecture.** A topic mid-pipeline or failed-verification is visibly in-progress/errored and not enterable as a trusted lecture.
- **Scope is tenant- and membership-bounded.** Search, the Today plan, and topic lists only ever include the learner's own content plus shared libraries they belong to — never another tenant's data.
- **Plan awareness at the boundary.** The Free 3-active-topic cap is enforced at the "Start a topic" CTA (routing to Upgrade); Home reads plan/seat/cap state but sets neither price nor plan.
- **Never a dead end.** Every empty and error state names the next step or reassures that empty is the healthy state ("all caught up", "no open conflicts"); zero states are rewards, not scolds.
- **Graceful, independent degradation.** Widgets load and fail independently; a single source outage degrades one widget, never the whole page, and never renders a misleading 0.
- **Guest state is ephemeral.** The demo Dashboard persists nothing and collects no PII; any write attempt gates to sign-up.

### Cross-domain dependencies

**Home consumes from:**
- **New Topic / Verification Pipeline** — topic verification stage/status, "ready" and "failed" signals, trust-ledger data for trust bars.
- **Review / FSRS** — count of cards due today and next-due date.
- **Conflicts** — open-conflict counts and per-topic context.
- **Tasks / My Tasks** — pending/due task items for the Today plan.
- **Tests** — upcoming/available tests, deadlines, and predicted-readiness signals.
- **Gap Map** — open gap counts (optional surfacing) and jump targets.
- **Reports / Progress** — pointers to the four honest signals (surfaced as links, not restated).
- **Billing / Org-Admin** — plan, seat, active-topic cap, and shared-library membership/visibility policy.
- **Notifications** — unread indicator and entry point (the bell).
- **Profile / Settings** — display name, avatar, tier badge, and timezone for day-boundary logic.

**Home provides to:**
- **All loop domains** — the primary navigation and daily entry points; the Today plan is what drives learners into Review, Conflicts, Tasks, and Tests.
- **Search index** — a topic/claim/trust-state search that other surfaces (e.g. global search) may reuse.
- **First-run / conversion** — the entry ramp that hands GUEST → sign-up and new learners → New Topic.

### Key technical requirements

- **Aggregation fan-out with per-source resilience.** Home composes data from ~8–10 domains; it needs per-source timeouts, independent widget load/error boundaries, and stale-while-revalidate caching. As the most-hit authenticated screen, first meaningful render must not block on the slowest source.
- **Search infrastructure.** A tenant-scoped index over topic metadata **and** decomposed claims with their trust states, updated incrementally as topics are created and as the pipeline changes states; debounced typeahead with sub-few-hundred-ms latency; typo tolerance; client-side fallback filtering when the service is degraded.
- **Freshness & concurrency.** Counters must reconcile on visibility-change / focus and after local actions (poll or push); optimistic updates corrected against server truth; counts clamped to non-negative; day-boundary computed in the learner's timezone.
- **Offline support.** Local cache of last-known counters and topic list; explicit offline banner; offline-completed reviews queued and synced on reconnect; safe empty-cache offline state.
- **Low incremental AI cost.** Home itself is aggregation, not generation; any "learn next" recommendation (HOME-21) must be cached/cheap and clearly non-authoritative — no per-load model calls that inflate cost on the most-visited screen.
- **Accessibility engineering.** Semantic landmarks/headings, keyboard-operable widgets and search with visible focus, non-color text encoding for all trust bars/chips, polite live-region announcements for updating counters, and responsive reflow at high zoom / small viewports (WCAG 2.2 AA floor).
- **Personalization/ranking.** A deterministic, explainable urgency ranking for the Today plan (overdue > due-today > soon, weighted by FSRS overdue magnitude) that is bounded and paginated for large portfolios.
- **Guest/demo isolation.** An unauthenticated, no-persistence render path serving vendor-curated read-only demo content, firewalled from any write and from real tenant data.

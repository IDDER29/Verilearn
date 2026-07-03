## Accessibility, Mobile & Offline

### Overview

This is a cross-cutting, non-functional domain: it does not invent new learning surfaces, it defines *how every surface the rest of the product builds must behave* for a learner on assistive technology, on a phone, or on a flaky or absent connection. It is the domain that keeps VeriLearn's core promise — "we show you exactly how much to trust what we just taught you" — legible and operable when the primary encoding of trust (colored claim underlines, a color-coded five-state ledger, spatial boards, timed gates) cannot be perceived, cannot be seen at desktop width, or cannot round-trip to a server.

Three things make accessibility a *first-class stress test* here rather than a compliance afterthought, and they all flow from the verification-first thesis:

1. **Trust is encoded in ways that fail silently for some users.** The trust ledger leans on color (green Verified, blue Sourced, red Disputed), on spatial layout (the claims × sources coverage matrix, the Gap Map board), and on timing (active-listening pause-points, timed tests). A learner who can't perceive color, or navigates by screen reader, or needs more time, must still be able to tell a *Verified* claim from an *Unsupported* one — otherwise the moat is invisible to them and the product silently lies by omission.
2. **The core loop is full of hard gates.** The confidence gate, the active-listening "close" gate that locks *Next*, cloze inputs, and timed tests are all points where a keyboard-only or screen-reader user, or a user needing extra time, hits a wall unless the gate was designed to be operated without a mouse and without a fixed clock.
3. **Learning happens on commutes and offline.** Reviews are a daily habit; the product explicitly promises "reviews you complete offline still count." That makes offline persistence, queued sync, idempotent scheduling, and multi-device conflict resolution core to the retention loop, not a nicety.

This domain **owns**: the non-color trust-state encoding contract; screen-reader/keyboard operability of the ledger, gates, coverage matrix, and Gap Map; timing-accommodation rules (WCAG 2.2.1 / no purely-timed lockout); reduced-motion, reflow/zoom, and contrast requirements; the responsive mobile web app (bottom-tab shell, tap-to-open ledger sheet, mobile review/lecture/pipeline); the offline-capable review/read experience with a queued sync engine and conflict resolution; and the accessibility conformance statement (VPAT/WCAG). It **does not own** and must not redefine: how a claim earns its trust state (Pipeline/Skeptic/Sandbox), the FSRS scheduling math (Retention domain), test scoring and certificate rules (Tests domain), the Gap Map lifecycle (Gap Map domain), notification delivery (Notifications), or billing/plan gating (Billing) — it makes each of those perceivable, operable, mobile, and offline-tolerant.

### Personas involved

- **Accessibility-Reliant Learner (A11Y-LEARNER)** — the domain's primary inhabitant and its reason for existing: runs the *entire* loop (create → lecture gates → tasks → conflicts → review → tests) via screen reader, keyboard-only, switch, magnification, or with a need for extended time, and treats the trust ledger's color/spatial/timed encoding as a daily obstacle course rather than a niche edge case.
- **Self-directed Learner (LEARNER-SELF)** — the default mobile/offline user: does reviews on a phone during a commute, expects offline reviews to count and sync, and meets the responsive shell as their primary surface.
- **Exam-prep Student (LEARNER-EXAM)** — deadline-driven; may need a timing accommodation on a timed test without it invalidating readiness, and crams reviews offline before a fixed date.
- **Returning Power-Learner (LEARNER-POWER)** — near-daily; hits multi-device sync conflicts (reviews the same card on phone and laptop) and cares that offline review debt reconciles cleanly.
- **Team Seat Learner (LEARNER-TEAM)** — consumes a shared library on mobile and offline; inherits trust states that must remain perceivable on a small screen.
- **Guest / Visitor (GUEST)** — increasingly arrives on a phone; must be able to evaluate the trust-ledger promise on a mobile demo in minutes without an account.
- **Compliance / Data-Protection Officer (COMPLIANCE-DPO)** — owns the accessibility conformance posture (WCAG 2.2 AA target, VPAT, accessibility statement, accommodation records) and the FERPA/COPPA-adjacent handling of accommodation and minor-account data; advisory/gatekeeping authority over conformance, never over truth.
- **Support Agent (SUPPORT-AGENT)** — unbreaks stuck offline-sync queues, recovers reviews trapped on a lost device, and processes accommodation requests under scoped consent, firewalled from ever fabricating a review, rating, calibration point, or certificate.
- **Platform Administrator (PLATFORM-ADMIN)** — operates the PWA/service-worker, offline cache, and sync backend and rolls them out across tenants, yet remains unable to read or alter any epistemic content it caches or syncs.
- **Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD)** — treats offline/sync as an abuse surface (device-clock manipulation, forged offline reviews, calibration-juking via offline replay) and can freeze or discard tainted offline batches without hand-certifying anything.
- **Organization / Teams Admin (ORG-ADMIN)** — procures for a cohort that includes assistive-tech users and demands a VPAT/accessibility statement as a purchasing gate; sets no trust states.
- **Instructor / Educator (INSTRUCTOR)** — assigns to cohorts including A11Y learners and reads the four honest signals, which must themselves be perceivable in an accessible report.

Referenced but owned elsewhere: **VERIFY-PIPELINE / SKEPTIC-AI / EXEC-SANDBOX** are network-dependent and explicitly *not* offline-capable (this domain draws the boundary, they define the work); **EVENT-HOST** runs live sessions that this domain requires be captioned; **GUARDIAN** oversees a teen on a shared mobile account; **EMPLOYER-VERIFIER** and **DEVELOPER-API** consume a public, accessible certificate-verification page.

### User stories

- **[A11Y-01] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want every trust state conveyed by icon and text label, not color alone, so that I can tell a Verified claim from a Disputed or Unsupported one without perceiving color.** — *Priority:* MVP — *Why this priority:* Color-only trust encoding makes the product's entire differentiator invisible to color-blind and non-visual users; this is the domain's signature requirement.
  - *Acceptance criteria:*
    - Each of the five trust states (Verified·execution, Verified·source, Sourced, Disputed, Unsupported) — plus Interpretive — is rendered with a distinct non-color cue: a unique icon/glyph *and* a text label, in addition to its color.
    - In-lecture claim underlines expose their trust state to assistive tech (e.g. an accessible name like "Sourced claim — opens trust ledger") and are distinguishable from each other by shape/pattern, not hue.
    - The distinction survives a grayscale render test and a simulated deuteranopia/protanopia check with no two states collapsing into one.
  - *Business rules / validation:* The icon↔state mapping is a single canonical contract reused everywhere a trust state appears (lecture, ledger rail, coverage matrix, review card, test review, community). No surface may introduce a color-only variant.
  - *Failure & edge cases:* If a new trust state or sub-state is ever added upstream, a claim with an unmapped state renders a neutral "unclassified" cue with a label rather than an ambiguous blank; a claim mid-recompute shows "re-verifying" rather than a stale color.

- **[A11Y-02] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want the trust-ledger side rail and each claim's evidence, source, and confidence readable by my screen reader, so that I can audit *why* a claim is trusted, not just that it is.** — *Priority:* MVP — *Why this priority:* Clicking a claim to inspect its evidence is the core verification interaction; if the rail is a visual-only overlay it is unusable non-visually.
  - *Acceptance criteria:*
    - Activating a claim (via keyboard or AT) opens the ledger entry as a properly-labeled dialog/region; focus moves into it and the trust state, source citation, confidence, and evidence are exposed as structured, readable content.
    - The rail announces its relationship to the originating claim (e.g. "Trust details for: 'Dijkstra finalises the closest node'").
    - Closing the rail returns focus to the claim that opened it.
  - *Business rules / validation:* The rail reads the same ledger object the visual UI reads (no separate, thinner AT payload). Evidence excerpts and source links are real, navigable content, not images of text.
  - *Failure & edge cases:* If the ledger entry fails to load, the rail announces "couldn't load evidence — retry" rather than opening empty; a Disputed claim's rail clearly announces it is a Conflict and links to adjudication.

- **[A11Y-03] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want every active-listening gate and the confidence gate to be fully keyboard- and screen-reader operable, so that the hard gates that lock progress never trap me.** — *Priority:* MVP — *Why this priority:* The close gate locks "Next" and the confidence gate locks reveal; if either is mouse-only, the learner cannot advance at all.
  - *Acceptance criteria:*
    - Predict, pause-point, cloze, connection, and close gates, plus the Sure/Unsure/Guessing confidence gate and FSRS rating row, are reachable and operable by keyboard alone with a logical focus order.
    - The locked state of "Next" / "Show answer" is programmatically exposed (disabled + accessible explanation of what unlocks it), and unlocking is announced when the gate is satisfied.
    - Cloze/free-text inputs have associated labels and expose validation errors as text tied to the field.
  - *Business rules / validation:* No gate may be satisfiable *only* by a pointer gesture, hover, or drag. The lock semantics mirror the domains that own the gates (Lecture, Retention); this domain guarantees their operability, not their pedagogy.
  - *Failure & edge cases:* A keyboard user who submits an empty required cloze gets an inline, focus-moved error, not a silent no-op; if focus is ever lost after a modal gate closes, it resets to a deterministic anchor rather than the page top.

- **[A11Y-04] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want no learning gate to be defeated purely by a countdown, and timed tests to support an extended-time accommodation, so that needing more time never costs me the content or a fair result.** — *Priority:* MVP — *Why this priority:* WCAG 2.2.1 (Timing Adjustable) is a hard conformance line, and a purely-timed test lockout would exclude accommodation-eligible learners from certificates.
  - *Acceptance criteria:*
    - Active-listening pause-points and any auto-advancing element can be paused/extended or have no hard time limit; nothing the learner must read auto-dismisses on a fixed clock without a control to extend it.
    - A learner with an approved extended-time accommodation gets a multiplied test time limit (e.g. 1.5×), applied before the test starts and shown in the test scope.
    - Auto-submit-on-timeout still fires for timed tests, but only after the *accommodated* limit, and the results clearly attribute unanswered questions to time, not to the learner skipping them.
  - *Business rules / validation:* Extended time is an account-level accommodation flag (set via Support/accommodation flow, governed by COMPLIANCE-DPO), applied uniformly to all of that learner's tests; it does not alter the pass bar (≥75%) or which claims questions draw from (Tests domain owns those). Certificates earned with an accommodation are not visibly marked as such to third parties.
  - *Failure & edge cases:* If the accommodation flag is set mid-test, it applies to the *next* attempt, never retroactively extending an in-flight clock (prevents mid-test gaming); if the clock and the server disagree on remaining time, the *more generous* value is honored to avoid wrongly cutting a learner off.

- **[A11Y-05] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want motion-heavy UI (the six-stage pipeline animation, session-complete confetti, card transitions) to respect reduced-motion, so that animation doesn't cause discomfort or obscure state changes.** — *Priority:* Should-Have — *Why this priority:* Real accessibility and comfort need, but the underlying flows function without the animation.
  - *Acceptance criteria:*
    - When the OS/browser signals reduced-motion, pipeline stage progress, confetti, and card/tab transitions render as instantaneous or minimally-animated state changes that still communicate the same information.
    - No essential state (which pipeline stage is running, that a session completed) is conveyed *only* by motion; a static equivalent exists.
    - A per-account "reduce motion" override exists in Settings for users whose OS setting is unavailable.
  - *Business rules / validation:* Reduced-motion never removes information, only animation. The pipeline's six stages remain individually labeled and their status text-legible.
  - *Failure & edge cases:* If the reduced-motion preference can't be read, the app defaults to the calmer (reduced) treatment rather than full animation.

- **[A11Y-06] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want content to reflow and remain usable at 200%–400% zoom and larger text, so that a low-vision learner can read lectures and audit sources without horizontal scrolling or clipped controls.** — *Priority:* Should-Have — *Why this priority:* Reflow (WCAG 1.4.10) is core to low-vision usability, but the initial build can ship AA-partial and harden it.
  - *Acceptance criteria:*
    - At 400% zoom / 320 CSS px equivalent, lecture prose, gates, the ledger rail, and primary navigation reflow to a single column with no loss of content or function and no two-dimensional scrolling of body content.
    - Wide, inherently tabular content (coverage matrix) is placed in its own horizontally-scrollable region rather than forcing the whole page to scroll sideways.
    - Text spacing overrides (line-height, letter/word spacing) don't clip or overlap content.
  - *Business rules / validation:* Relative units only for type and layout; no fixed-height containers that clip enlarged text on the reading and review paths.
  - *Failure & edge cases:* If the coverage matrix cannot fully reflow, it degrades to an accessible list/summary view (see A11Y-07) rather than an unreadable squeezed grid.

- **[A11Y-07] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want the coverage matrix and the Gap Map board to have non-spatial, screen-reader-navigable equivalents, so that auditing claim×source coverage and working my misconceptions don't require perceiving a 2-D grid or dragging cards.** — *Priority:* Should-Have — *Why this priority:* These are the two most spatial surfaces in the product; without alternatives they exclude non-visual users from coverage auditing and gap tracking.
  - *Acceptance criteria:*
    - The coverage matrix exposes proper data-grid/table semantics (row = claim, column = source, cell = supported/empty state as text) and offers a linear "unsupported claims" list that names exactly the empty rows.
    - Gap Map cards are operable without drag-and-drop: lifecycle moves (Open→Watching→Closed→Reopened) are available via keyboard-accessible controls/menus, and the board reads as a labeled list grouped by state.
    - Each gap and each unsupported claim exposes its jump-back link to the exact lecture section as real, focusable navigation.
  - *Business rules / validation:* Drag is an *enhancement*, never the only path for any state change. The alternative views read the same underlying objects as the visual board/grid.
  - *Failure & edge cases:* An empty coverage matrix (all claims sourced) announces "no unsupported claims" as a positive state, not a blank grid; a gap whose section anchor is missing degrades its jump-back to the parent lecture.

- **[A11Y-08] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want a skip-to-content link, a visible focus indicator, and correct heading/landmark structure across the app shell, so that I can navigate the left-nav product without tabbing through everything every time.** — *Priority:* MVP — *Why this priority:* Landmark/focus basics are foundational to keyboard/AT use of an app with persistent nav, tabs, and modals.
  - *Acceptance criteria:*
    - A skip link jumps past the persistent nav to main content; landmarks (nav, main, complementary for the ledger rail) are present and labeled.
    - Every interactive element has a visible focus indicator meeting contrast requirements; focus is never trapped except intentionally inside modal gates, which are dismissible by keyboard.
    - Workspace tabs (Lecture/Tasks/Conflicts/Sources) and the Settings sub-nav expose their selected state programmatically.
  - *Business rules / validation:* One `main` landmark per view; modal dialogs (ledger rail as dialog, upgrade, danger-zone confirmations) manage focus in/out and restore it on close.
  - *Failure & edge cases:* If a route change leaves focus orphaned, focus resets to the new view's `main` heading and the view title is announced.

- **[A11Y-09] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want live Events (workshops, AMAs, study groups) to be captioned and to have accessible recordings, so that I can participate in the community layer where claims get debated.** — *Priority:* Should-Have — *Why this priority:* Events extend the verification conversation, but the core solo loop is unaffected; captioning is a real inclusion requirement with vendor cost.
  - *Acceptance criteria:*
    - Live events surface a captioning affordance; recorded event replays include captions and/or a transcript.
    - Event registration and detail screens are fully keyboard/AT operable, including timezone and reminder controls.
    - A learner can request a captioning/accommodation for a specific event through the accommodation flow.
  - *Business rules / validation:* EVENT-HOST is responsible for enabling captions per session; the platform provides the affordance and stores the transcript. Any claim surfaced live still routes to an SME to certify — captions don't certify.
  - *Failure & edge cases:* If live captions fail mid-event, the failure is announced and the learner is pointed to the post-event transcript rather than left with silent audio-only content.

- **[A11Y-10] As a Compliance / Data-Protection Officer (COMPLIANCE-DPO), I want a published accessibility statement and a maintained VPAT/conformance record, so that procurement and regulatory obligations for a cohort of assistive-tech users are demonstrably met.** — *Priority:* Should-Have — *Why this priority:* Required for Teams/enterprise and public-sector procurement, but not blocking a first consumer launch.
  - *Acceptance criteria:*
    - A public accessibility statement names the conformance target (WCAG 2.2 AA), known limitations, and a contact/feedback path for accessibility issues.
    - A VPAT-style record is maintainable and versioned, mapping surfaces to conformance status.
    - Accommodation records (extended time, etc.) are stored as governed personal data with defined retention.
  - *Business rules / validation:* COMPLIANCE-DPO owns the statement's accuracy and the accommodation-data governance; they cannot alter any trust state or content to make a claim about conformance. Accommodation flags are minimally scoped and access-logged.
  - *Failure & edge cases:* A newly-shipped surface that regresses conformance must be reflected as a known limitation rather than silently overstating AA; accommodation data is included in DSAR export and deletion (Settings/Privacy domain).

- **[A11Y-11] As a Self-directed Learner (LEARNER-SELF), I want the full learning loop on a responsive mobile web app with a bottom tab bar, so that I can create, read, and review verified topics on my phone.** — *Priority:* MVP — *Why this priority:* Mobile is a primary surface for daily reviews; the prototype already specifies a phone shell (Home/Topics/Review/Progress tabs + start-topic FAB).
  - *Acceptance criteria:*
    - The app reflows to a mobile layout with a bottom tab bar (Home, Topics, Review, Progress) and a primary "start a topic" action, honoring device safe areas (notch/home indicator).
    - Dashboard, topic workspace tabs, review, and pipeline are all reachable and usable on a phone-width viewport.
    - Trust bars, review counts, and conflict/task badges remain legible at mobile scale with the non-color encoding intact (A11Y-01).
  - *Business rules / validation:* Feature availability on mobile matches the account's plan (Free 3 topics, Pro hard mode, etc.) — mobile is a surface, not a plan tier. Nav parity: everything reachable on desktop is reachable on mobile, even if via a condensed path.
  - *Failure & edge cases:* On very small or landscape viewports, the bottom bar and gates never overlap content; surfaces not yet mobile-optimized fall back per A11Y-16 rather than rendering broken desktop layouts.

- **[A11Y-12] As a Self-directed Learner (LEARNER-SELF), I want to tap an underlined claim in a mobile lecture and get its trust details in a bottom sheet, so that inspecting evidence works with a thumb, not a hover.** — *Priority:* MVP — *Why this priority:* The claim→ledger interaction is the core verification gesture and must translate from desktop side-rail to mobile without hover.
  - *Acceptance criteria:*
    - Tapping a claim opens a bottom sheet showing trust state (with icon+label), source citation, confidence, and evidence, dismissible by swipe or a close control.
    - Claim tap targets meet minimum touch-target size and don't collide with adjacent underlined claims.
    - The sheet is operable by assistive tech and returns focus to the claim on close (ties to A11Y-02).
  - *Business rules / validation:* The bottom sheet reads the same ledger object as the desktop rail. Active-listening gates remain enforced on mobile (close gate still locks Next).
  - *Failure & edge cases:* If evidence fails to load in the sheet, it shows a retry state; overlapping claims in dense prose get a disambiguation affordance rather than a mis-tap.

- **[A11Y-13] As a Returning Power-Learner (LEARNER-POWER), I want mobile review sessions with large-target confidence and rating controls, so that I can clear review debt one-handed on a commute.** — *Priority:* MVP — *Why this priority:* Reviews are the daily habit and the most-used mobile flow; poor touch ergonomics here directly harms retention.
  - *Acceptance criteria:*
    - The confidence gate (Sure/Unsure/Guessing) and FSRS rating row (Again/Hard/Good/Easy) render as large, thumb-reachable targets with visible interval labels.
    - Reveal stays locked until a confidence level is committed, on mobile as on desktop.
    - Session position ("1/4") and progress are visible without obscuring the card.
  - *Business rules / validation:* Commit-before-reveal and idempotent scheduling (one FSRS advance per card) are enforced identically on mobile; mobile never introduces a shortcut that reveals without a commit.
  - *Failure & edge cases:* An accidental double-tap on a rating does not double-schedule; a mid-session app background/foreground resumes on the same card without losing the committed confidence (see A11Y-17).

- **[A11Y-14] As a Self-directed Learner (LEARNER-SELF), I want to start a verification pipeline and leave the app, then be told when it's done, so that background verification doesn't chain me to the loading screen on mobile.** — *Priority:* Should-Have — *Why this priority:* The pipeline is designed to run in the background and be closable; mobile makes "leave and come back" the norm, but a push is an enhancement over polling.
  - *Acceptance criteria:*
    - The six-stage pipeline continues server-side when the learner backgrounds or closes the mobile app; returning shows current stage/progress, not a restart.
    - Completion emits a notification (delivery owned by Notifications domain) deep-linking to the verified topic.
    - The pipeline monitor is legible and its six stages individually labeled at mobile width.
  - *Business rules / validation:* Verification is network/server work and never runs offline (A11Y-18); this story covers backgrounding, not offline generation. Notification delivery/consent is governed by the Notifications and Guardian rules, not redefined here.
  - *Failure & edge cases:* If verification fails while the app is backgrounded, the return state shows the "we couldn't finish verifying — nothing unverified was shown" error (VL-503) with retry, never a partially-shown unverified lecture.

- **[A11Y-15] As a Guest / Visitor (GUEST), I want to evaluate the trust-ledger demo on my phone without an account, so that I can judge in minutes whether "verified" is real before committing.** — *Priority:* Should-Have — *Why this priority:* Mobile is a common first-touch channel and the guest demo is the top-of-funnel conversion moment, but the ephemeral demo scope is defined by the Auth/Home domain.
  - *Acceptance criteria:*
    - The ephemeral guest demo renders and is operable on mobile, including tapping a claim to see its trust state and source.
    - Nothing is persisted for a guest; the conversion CTA is reachable on mobile.
    - The non-color trust encoding (A11Y-01) is present in the demo so the differentiator lands even in grayscale.
  - *Business rules / validation:* Guest persists nothing and inherits the same accessibility contract as authenticated surfaces. Demo scope/limits are owned by the Auth/Home domain; this story guarantees mobile+AT operability of it.
  - *Failure & edge cases:* If the guest loses connection mid-demo, the offline state explains the demo is ephemeral and can be restarted, without pretending progress was saved.

- **[A11Y-16] As a Team Seat Learner (LEARNER-TEAM), I want surfaces that aren't fully mobile-optimized (coverage matrix, Gap Map board) to degrade to a usable mobile view rather than break, so that I'm never blocked on a phone.** — *Priority:* Nice-to-Have — *Why this priority:* Graceful degradation improves reach, but power-audit surfaces are acceptably desktop-first at launch.
  - *Acceptance criteria:*
    - The coverage matrix presents a mobile-friendly summary (e.g. unsupported-claims list) on small screens; the Gap Map presents a stacked, filterable list.
    - Any desktop-only affordance shows a clear "best on a larger screen" hint with the mobile-available alternative, never a blank or clipped grid.
    - The mobile alternative preserves the essential action (find unsupported claims; move a gap's state).
  - *Business rules / validation:* Degradation must retain function, not just shrink pixels; it reuses the accessible alternatives from A11Y-07.
  - *Failure & edge cases:* No horizontal body scroll or off-screen controls on any supported mobile width.

- **[A11Y-17] As a Self-directed Learner (LEARNER-SELF), I want reviews I complete offline to still count and sync automatically when I reconnect, so that a subway commute doesn't cost me my streak or my schedule.** — *Priority:* MVP — *Why this priority:* The product explicitly promises "reviews you complete offline still count"; this is a load-bearing offline capability, not a nicety.
  - *Acceptance criteria:*
    - With no connection, due cards already cached are reviewable end-to-end (confidence commit → reveal → FSRS rating), and results are queued locally.
    - On reconnect, queued reviews sync automatically; FSRS state, calibration points, and streak update to reflect the offline work.
    - The learner sees clear "saved locally, will sync" and later "synced" status.
  - *Business rules / validation:* Sync is idempotent — a queued review applies exactly once even if reconnect/retry happens repeatedly (each offline review carries a stable client id). Offline review timestamps are recorded but reconciled against server rules to prevent backdating abuse (see A11Y-21). Only already-cached, already-verified cards are reviewable offline; no new verification happens offline.
  - *Failure & edge cases:* If the local queue can't be persisted (storage full/blocked), the app warns *before* the learner invests in an offline session rather than silently discarding it; a queued review whose underlying claim was disputed/revoked while offline is held and reconciled on sync rather than applied blindly.

- **[A11Y-18] As a Self-directed Learner (LEARNER-SELF), I want to read already-verified lectures offline with a clear boundary around what needs a connection, so that I can study on a plane without hitting dead ends or unverified content.** — *Priority:* Should-Have — *Why this priority:* Offline reading extends the daily habit, but is secondary to offline review counting.
  - *Acceptance criteria:*
    - Previously-opened verified lectures (prose, claim trust states, cached ledger entries) are readable offline, with the trust encoding intact.
    - Actions that require the network — creating a topic, running verification, hard-mode Skeptic, promoting a source, live community/events — are clearly marked unavailable offline with an explanation, not a silent failure.
    - Active-listening gates still function offline where they don't require server calls; a gate that needs a server round-trip degrades gracefully.
  - *Business rules / validation:* Offline never shows unverified or partially-verified content — the "we'd rather stop than guess" principle holds; if a lecture isn't cached, it is unavailable offline rather than reconstructed. The Pipeline/Skeptic/Sandbox are network-only by definition.
  - *Failure & edge cases:* Tapping a network-only action offline queues it (if safe) or explains it will run on reconnect; an offline attempt to open an uncached topic shows the offline state, not a broken page.

- **[A11Y-19] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want a persistent offline indicator and inline "couldn't save — retry" recovery on every input, so that a dropped connection never silently swallows an answer, a rating, or a task submission.** — *Priority:* MVP — *Why this priority:* Silent data loss is both a trust violation and an accessibility failure; the Error States prototype already specifies these inline patterns.
  - *Acceptance criteria:*
    - When the connection drops, a non-intrusive, AT-announced offline banner appears ("You're offline — progress is saved locally and will sync"), and clears on reconnect.
    - A save that fails shows an inline, focusable "Couldn't save your answer — check your connection. Retry" tied to the specific input, and the entered content is preserved.
    - Retry re-attempts the exact pending write without the learner re-typing.
  - *Business rules / validation:* No learner-entered content (cloze, task answer, confidence commit, conflict adjudication) is ever discarded on a failed write; it is queued or held for retry. Offline/failure states are announced to assistive tech, not conveyed by color/icon alone.
  - *Failure & edge cases:* Repeated retry failures escalate to a "still can't reach VeriLearn" state with a support path (VL-error code), while keeping the content recoverable; closing the tab with unsynced input warns before loss where technically possible.

- **[A11Y-20] As a Returning Power-Learner (LEARNER-POWER), I want multi-device sync conflicts resolved deterministically, so that reviewing the same card on my phone and laptop doesn't corrupt my FSRS schedule or double-count.** — *Priority:* Should-Have — *Why this priority:* A real concurrency hazard for power users with offline queues on multiple devices, though it affects a minority of sessions.
  - *Acceptance criteria:*
    - When two devices submit reviews for the same card, reconciliation applies a single deterministic result (e.g. last-completed-wins by authoritative server time, or a defined FSRS merge rule) rather than double-advancing the card.
    - The learner is not shown a data-loss error for the ordinary case; conflicts resolve silently and correctly.
    - Streak and calibration counts reflect distinct real reviews, never duplicates created by sync retries.
  - *Business rules / validation:* Each review event is idempotent by client id (A11Y-17); the server is the source of truth for FSRS state. Conflict resolution never fabricates a review or rating that the learner did not perform (SUPPORT-AGENT / integrity firewall applies).
  - *Failure & edge cases:* An unresolvable conflict (corrupt or contradictory payloads) surfaces a "we couldn't reconcile these — here's what we kept" explanation and preserves the more conservative FSRS state rather than guessing generously; a device syncing after long offline gets its stale reviews reconciled, not blindly applied over newer server state.

- **[A11Y-21] As a Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD), I want offline/sync treated as an abuse surface with tamper-resistant reconciliation, so that device-clock manipulation and forged offline batches can't juke streaks, retention, or calibration signals.** — *Priority:* Should-Have — *Why this priority:* Offline replay is a concrete gaming vector against the four honest signals, but the safeguards can follow the core offline capability.
  - *Acceptance criteria:*
    - Server-side reconciliation validates offline batches against plausibility rules (server-authoritative timestamps, rate ceilings, sane inter-review gaps) before they affect any signal.
    - Suspicious offline batches (implausible volume, backdated timestamps, duplicated client ids) can be frozen/quarantined and discarded from signals without deleting the learner's legitimate history.
    - Calibration and retention signals derived from quarantined data are recomputed once the batch is resolved.
  - *Business rules / validation:* TRUST-SAFETY-LEAD can freeze/discard tainted offline data and flag accounts but never hand-certifies a trust state or fabricates a signal; local device time is never trusted as authoritative for scheduling or streaks.
  - *Failure & edge cases:* A false-positive freeze on a legitimate heavy-offline session is appealable and restorable (with SUPPORT-AGENT under scoped consent), and the learner is told their offline work is under review rather than silently dropped.

- **[A11Y-22] As a Support Agent (SUPPORT-AGENT), I want to diagnose and recover a stuck offline-sync queue under scoped consent, so that a learner whose reviews are trapped on a device isn't permanently penalized.** — *Priority:* Should-Have — *Why this priority:* A recognized operational failure mode ("lost streaks," stuck pipelines) the support desk must fix, though it affects few accounts.
  - *Acceptance criteria:*
    - With the learner's scoped consent, Support can view sync-queue status/telemetry (counts, last-sync, error codes) without reading the epistemic content of cards.
    - Support can trigger a re-sync or clear a corrupt queue entry, and restore a wrongly-lost streak, all recorded in an audit log.
    - Recovery actions are idempotent and cannot create reviews, ratings, calibration points, or certificates that never happened.
  - *Business rules / validation:* Support is firewalled from fabricating any learning signal; it can only re-drive or clear genuine pending state. Consent is scoped, time-boxed, and logged; PLATFORM-ADMIN operates the sync backend but likewise cannot read epistemic content.
  - *Failure & edge cases:* If a queue is unrecoverable, Support explains what was lost and restores the streak/date-based fairness without inventing the lost reviews' outcomes; consent expiry immediately revokes Support's access.

- **[A11Y-23] As a Platform Administrator (PLATFORM-ADMIN), I want to roll out and monitor the PWA/service-worker, offline cache, and sync backend without ever reading learners' content, so that offline reliability is operable at scale under the epistemic-content firewall.** — *Priority:* Should-Have — *Why this priority:* Someone must own the offline/sync infrastructure and its safe rollout, but it sits behind the learner-facing MVP capabilities.
  - *Acceptance criteria:*
    - Service-worker/cache and sync-engine versions can be rolled out (and rolled back) per tenant with health/telemetry (sync success rate, queue depth, cache hit rate) visible.
    - A bad service-worker release can be superseded so learners aren't stranded on a broken offline cache.
    - Telemetry exposes operational metrics only — never the text of claims, answers, or ledger entries.
  - *Business rules / validation:* PLATFORM-ADMIN is technically all-powerful over infra yet cannot read or alter epistemic content; caches store content encrypted/opaque to operators where feasible and are cleared on account deletion.
  - *Failure & edge cases:* A service-worker update that would orphan queued offline reviews must migrate or flush-then-sync them first; a rollback preserves, never discards, unsynced learner data.

- **[A11Y-24] As an Organization / Teams Admin (ORG-ADMIN), I want to obtain the VPAT/accessibility statement as part of procurement, so that I can confirm the platform meets my organization's accessibility obligations before buying seats.** — *Priority:* Nice-to-Have — *Why this priority:* A real B2B purchasing gate, but downstream of shipping the conformance record itself (A11Y-10).
  - *Acceptance criteria:*
    - The current VPAT/accessibility statement is discoverable and shareable during the Teams purchase/evaluation flow.
    - Known limitations and the conformance target are stated plainly enough to support a procurement decision.
    - The document is versioned so an admin knows which release it describes.
  - *Business rules / validation:* ORG-ADMIN consumes conformance information; they cannot alter trust states or content and do not set the conformance claim (COMPLIANCE-DPO owns its accuracy).
  - *Failure & edge cases:* If no current VPAT exists for a surface an admin asks about, the flow states the limitation honestly rather than implying full conformance.

### Business rules & invariants

- **Non-color trust encoding is universal.** Every place a trust state appears (lecture underline, ledger rail, coverage matrix, review card, test review, community, mobile sheet, guest demo) uses the single canonical icon+label+color contract. No surface may encode a trust state by color alone. This is the domain's hardest invariant because it protects the differentiator for exactly the users most likely to miss it.
- **No hard gate is pointer-only or purely timed.** Every gate that locks progress (confidence, close, cloze, tests) must be operable by keyboard/AT, and no content the learner must read may be defeated solely by a countdown (WCAG 2.2.1). Timing accommodations scale test limits without changing the pass bar or claim-sourcing rules.
- **Never a dead end, never silent loss.** Offline, error, and empty states always explain what happened and offer one way forward, and no learner-entered content is ever discarded on a failed write — it is queued, held, or recoverable. (Inherits the Empty/Error-states design principles.)
- **Offline never shows unverified content.** "We'd rather stop than guess" holds offline: only already-verified, already-cached content is available; verification, Skeptic hard mode, and source promotion are network-only. Offline shows nothing the ledger hasn't already blessed.
- **Sync is idempotent and server-authoritative.** Each offline event carries a stable client id and applies exactly once; the server owns FSRS/calibration/streak truth; device clocks are never trusted as authoritative. Reconciliation resolves conflicts deterministically and conservatively.
- **The epistemic-content firewall extends to infra and support.** PLATFORM-ADMIN (sync/cache/PWA) and SUPPORT-AGENT (queue recovery) can operate offline/sync mechanics but cannot read or fabricate epistemic content, reviews, ratings, calibration points, or certificates. TRUST-SAFETY-LEAD can freeze/discard tainted offline data but never hand-certifies.
- **Mobile is a surface, not a plan tier.** Plan gating (Free/Pro/Teams) and feature availability are identical across desktop and mobile; nav parity means everything reachable on desktop is reachable on mobile, even if condensed.
- **Accommodation and offline data are governed personal data.** Extended-time flags, accommodation records, and offline queues are minimally scoped, access-logged, included in DSAR export/deletion, and subject to defined retention (COMPLIANCE-DPO / Privacy domain).

### Cross-domain dependencies

- **Needs from Conflicts/Trust (ledger):** the canonical trust-state model and each claim's evidence/source/confidence object, so this domain can render an accessible, non-color, offline-cacheable representation. This domain supplies the *encoding and operability contract* back.
- **Needs from Lecture:** the active-listening gate definitions and lecture content model, so gates are made keyboard/AT operable and lectures cache for offline reading; provides the accessibility/offline behavior of those gates.
- **Needs from Retention (FSRS):** the scheduling/calibration state model and commit-before-reveal rule, so offline reviews queue and reconcile idempotently and mobile reviews enforce the same lock; provides the offline/mobile execution of the review loop.
- **Needs from Tests/Certs:** the timed-test model and pass rules, so extended-time accommodations apply without altering scoring or claim-sourcing; provides accommodation enforcement, not scoring.
- **Needs from Gap Map & Sources:** the coverage-matrix and Gap Map object/lifecycle models, so accessible non-spatial equivalents and mobile fallbacks can operate them.
- **Needs from Notifications:** delivery of pipeline-complete and sync-status pushes for the mobile background-verification and offline-sync flows (this domain triggers, Notifications delivers).
- **Needs from Settings/Privacy:** the accommodation, reduce-motion, and offline-cache controls surface, plus DSAR/retention handling of accommodation and offline data.
- **Needs from Billing/Org-admin:** plan/seat context so mobile respects plan gating, and the procurement surface where the VPAT is shared.
- **Provides to all domains:** a binding accessibility/mobile/offline conformance contract every new surface must satisfy — the non-color encoding, keyboard/AT operability, reflow/reduced-motion, mobile responsiveness, and offline-tolerance rules are requirements on their UIs, not optional polish.

### Key technical requirements

- **Conformance target:** WCAG 2.2 AA across the core loop, with the ledger's color/spatial/timed encoding treated as the priority risk area; maintainable VPAT and a public accessibility statement.
- **Non-color encoding assets:** a canonical, testable icon/label set for all six trust states, validated against grayscale and common color-vision-deficiency simulations; reused via a single shared component contract.
- **Assistive-tech semantics:** correct roles/landmarks/labels for the ledger rail (dialog), coverage matrix (data grid), Gap Map (list with keyboard state changes), gates (labeled inputs with programmatic locked/unlocked state), and live regions for offline/sync/validation announcements.
- **Timing infrastructure:** account-level accommodation flags applied server-side to test limits (e.g. 1.5×/2×), with server-authoritative clocks and a "more generous value wins" reconciliation to avoid wrongful cutoffs.
- **Responsive/PWA shell:** mobile bottom-tab layout honoring safe areas, thumb-sized touch targets, tap-to-open ledger bottom sheet, reflow to a single column at 320px and 400% zoom, and text-spacing resilience.
- **Offline engine:** service-worker caching of already-verified lectures and due review cards; a durable local queue with stable client ids for offline reviews/answers; idempotent, server-authoritative sync with deterministic multi-device conflict resolution; graceful storage-full handling that warns before an offline session.
- **Reduced-motion & preferences:** respect `prefers-reduced-motion` plus per-account overrides for motion; static equivalents for all motion-conveyed state (pipeline stages, completion).
- **Integrity & governance:** server-side plausibility validation of offline batches (rate ceilings, timestamp sanity, dedupe) with quarantine/recompute of affected honest signals; encrypted/opaque caches so PLATFORM-ADMIN and SUPPORT-AGENT can operate infra without reading content; access-logged, DSAR-inclusive accommodation and offline data with defined retention.
- **Captioning:** live-caption affordance and stored transcripts for Events, with a graceful fallback to post-event transcript on live-caption failure.

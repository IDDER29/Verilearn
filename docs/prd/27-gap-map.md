## Gap Map & Misconception Tracking

### Overview

This domain owns the product's **memory of what you got wrong** — the surface that turns a fleeting mistake into a durable, named, closeable object and refuses to let it quietly disappear. Where the review deck (Retain domain) tests recall on a schedule, the **Gap Map tracks specific known weaknesses as first-class entities** with a lifecycle (`Open → Watching → Closed → Reopened`), a severity/heat score, an origin trail back to exactly how the mistake was caught, and a discussion thread the learner works alongside the Skeptic.

It exists because the concept is already load-bearing across the app but has no home: the review "wrong idea" branch offers **`＋ Add to gap map`**, Progress ranks weak spots under **"Where to focus,"** formal tests promise **"misses feed your gap map automatically,"** Privacy lists **"Gap map & discussion threads"** as exportable personal data, and the Danger zone offers **"Reset gap map."** This domain closes that loop and makes those references resolve to a real board (kanban of Open/Watching/Closed columns) and a detail view.

Why it matters to the product thesis: VeriLearn competes on **honesty**, not content breadth. The Gap Map is the honesty engine applied to the *learner* rather than the content — it is the one place where a claimed "I understand this now" must be earned against evidence rather than asserted. The defining mechanic is **auto-reopen**: a gap the learner (or the system) marked Closed springs back to Open the moment a later lapse proves the understanding was fragile. A product that let learners mark their own misconceptions "done" and forget them would be exactly the fluent-but-not-honest experience VeriLearn was built to replace. The Gap Map also operationalizes the fourth honest signal — **blind-spot / drill detection** — by giving a missed seeded error-drill somewhere to live and be worked.

Three boundaries this domain must respect:

1. **Gaps are epistemic-about-the-learner, not about the ledger.** A gap records *a learner's* misconception or weak spot; it never changes a claim's trust state. The trust ledger (Conflicts/Sources domain) is upstream truth; the Gap Map consumes linkages from it (a resolved dispute can seed a gap) but never writes to it.
2. **Status must track evidence, not vanity.** Manual "mark closed" is permitted, but closure is provisional and continuously re-tested; the system owns auto-Watching, auto-Close-confirmation, and auto-Reopen from real review/drill/test behavior. No actor can make a gap "solid" by fiat.
3. **A gap belongs to the learner who holds the weakness.** In a shared/Teams library, instructors and admins may see *aggregate* patterns (governed by progress-visibility policy) but cannot edit or close another person's personal gap or read the private discussion thread beyond what policy allows.

### Personas involved

- **Self-directed Learner (LEARNER-SELF)** — primary. Creates gaps from the review wrong-idea path, works the board, revisits source sections, seeds drills, and (provisionally) closes gaps; the default owner of the surface.
- **Exam-prep Student (LEARNER-EXAM)** — deadline-driven. Triages gaps by severity/heat, drives fast closure to raise predicted test readiness, and receives auto-created gaps from formal-test misses.
- **Returning Power-Learner (LEARNER-POWER)** — lives here across a large portfolio; needs a cross-topic gap board sorted by heat, and treats gap closure as the qualitative half of review-debt management.
- **Skeptical / Expert Learner (LEARNER-SKEPTIC)** — meets the Gap Map mainly via the **resolved-dispute origin**: a Conflict whose resolution exposed a shaky underlying assumption becomes a tracked gap; a reopened conflict can reopen the linked gap.
- **Team Seat Learner (LEARNER-TEAM)** — owns personal gaps *inside* a shared library while inheriting its trust states; their gap patterns feed the instructor's aggregate but their personal gap objects stay theirs.
- **Instructor / Educator (INSTRUCTOR)** — reads a **cohort-aggregate** view of common misconceptions to find where a class is weak and plan teaching; read-only, policy-gated, and holds **no** power to edit gaps or trust states.
- **The Skeptic (SKEPTIC-AI)** — *system actor*. Participates in a gap's discussion thread as a study partner (explains why the misconception happens, proposes drills); advisory only, never certifies closure.
- **Accessibility-Reliant Learner (A11Y-LEARNER)** — core stress case: the board's kanban columns, severity color accents, and status transitions must be fully operable and unambiguous under assistive tech, not encoded by color/position alone.
- **Support Agent (SUPPORT-AGENT)** — unbreaks operational state (an accidental "Reset gap map," a gap lost to a sync bug) under scoped consent, but is firewalled from ever *fabricating* a gap, its origin trail, or its history.
- **Compliance / Data-Protection Officer (COMPLIANCE-DPO)** — governs gaps and their discussion threads as personal data: DSAR export, retention windows, deletion honoring, and minor-safety (FERPA/COPPA) constraints on who may view a dependent's gaps.
- **Parent / Guardian (GUARDIAN)** — *referenced / future*. Would want visibility into a dependent's gaps; today's single-shared-account model surfaces this as a known product gap rather than a supported flow.
- **Organization / Teams Admin (ORG-ADMIN)** — *referenced*. Owns the progress-visibility policy that decides whether instructors/admins can see cohort gap aggregates; cannot read or edit individual gaps beyond that policy.
- **Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD)** — *referenced*. Because severity/heat is partly driven by calibration, guards against a learner gaming self-reported confidence to suppress gap severity; can flag but never certifies a gap closed.

Producers referenced (not redefined here): the **Retain/FSRS** engine (wrong-idea branch, seeded error-drills, lapses), the **Tasks** domain (repeated rubric-criterion misses), the **Conflicts & Trust Ledger** domain (resolved/reopened disputes), the **Tests** domain (test misses; readiness), and **Progress/Reports** ("Where to focus").

### User stories

- **[GAP-01] As a Self-directed Learner (LEARNER-SELF), I want to promote a misconception from the review "wrong idea" path into a tracked gap, so that a mistake I just made becomes something I can actually work instead of a rescheduled card.** — *Priority:* MVP — *Why this priority:* This is the primary intake and the button (`＋ Add to gap map`) the rest of the product already advertises; without a real destination the honesty loop is broken.
  - *Acceptance criteria:*
    - On the wrong-idea branch, `＋ Add to gap map` creates a gap seeded with the named misconception (e.g. "negative *edges* vs negative *cycles*"), the source claim/section, an origin tag `review · wrong idea`, and status `Open`.
    - The new gap is immediately visible on the board and confirms creation inline ("Tracking this gap").
    - The gap links back to the exact review card and the underlying claim that produced it.
  - *Business rules / validation:* A gap requires a name and at least one origin; the misconception text is editable by the owner but the origin trail is immutable. Promoting the same misconception twice merges into the existing gap rather than duplicating (see GAP-07).
  - *Failure & edge cases:* If the gap-map write fails, the review card must not falsely show "added" — it keeps the offer and lets the learner retry (see GAP-19); adding a gap for a claim that was later deleted keeps the gap but marks the source link "section removed."

- **[GAP-02] As a Self-directed Learner (LEARNER-SELF), I want a board of all my gaps grouped into Open / Watching / Closed columns with the ability to regroup by topic or severity, so that I can see at a glance where my understanding is fragile and what is already solid.** — *Priority:* MVP — *Why this priority:* The board is the surface the whole domain exists to provide and the destination for every reference across the app.
  - *Acceptance criteria:*
    - Default grouping is by lifecycle status (Open, Watching, Closed) with a live per-column count and a header roll-up ("Gap map · 4 tracked · 2 open").
    - A `Group by` control re-buckets the same gaps by `Status`, `Topic`, or `Severity` without losing any gap.
    - Each gap card shows its name, origin tag, and a severity accent (high/medium/low); clicking opens the detail (GAP-03).
  - *Business rules / validation:* Every gap appears in exactly one bucket per grouping; Closed gaps are visually de-emphasized but remain on the board and searchable. Counts are derived from gap records, never cached independently of them.
  - *Failure & edge cases:* A learner with zero gaps sees the teaching empty state (GAP-08), not an empty grid; a very large gap set paginates/virtualizes and the board scrolls within its container without breaking page layout.

- **[GAP-03] As a Self-directed Learner (LEARNER-SELF), I want a gap detail view showing its origin trail, current status, and available actions, so that I understand exactly how the gap was caught and what I can do about it.** — *Priority:* MVP — *Why this priority:* The detail is where a gap is actually worked; a board without it is just a list.
  - *Acceptance criteria:*
    - The detail shows the gap name, current status with a manual status control (`Open / Watching / Closed`), the severity/heat, the origin trail (e.g. "review · rated Again" + "you flagged wrong idea"), and action buttons (`＋ Add a drill`, `✓ Mark closed`).
    - The origin trail names the specific card/drill/task/conflict/test that created the gap and is non-editable.
    - Changing status from the detail updates the board column and counts immediately.
  - *Business rules / validation:* Only the gap owner may change status or edit the name/notes; the origin trail and history are append-only. Manual close is allowed but recorded as `closed · manual` and remains subject to auto-reopen (GAP-06).
  - *Failure & edge cases:* Opening a gap whose topic was deleted shows the gap in a read-only "orphaned" state with the origin preserved and revisit disabled; a stale status toggle (record changed elsewhere) reconciles to the server state and warns rather than silently overwriting.

- **[GAP-04] As a Self-directed Learner (LEARNER-SELF), I want a gap to jump me straight back to the exact lecture section and claim it came from, so that I can re-learn the specific thing I got wrong by the fastest possible path.** — *Priority:* MVP — *Why this priority:* "Jump to the exact section" is the core value that distinguishes a gap from a generic to-do; it is the fix, not just the label.
  - *Acceptance criteria:*
    - The detail shows a `Revisit` action deep-linking to the source lecture section and highlighting the specific claim (with its current trust state shown, read-only).
    - Revisiting is one action from the gap and returns the learner to the gap afterward.
    - If the gap originated from a task or test, revisit routes to that task/question context instead of a lecture section.
  - *Business rules / validation:* The revisit target is stored as a stable anchor (topic + section + claim id), not a scroll offset. The claim's trust state is displayed by reference from the ledger and never editable here.
  - *Failure & edge cases:* If the target section was re-verified and its claims changed, revisit lands at the closest surviving anchor and notes "this section was updated since the gap was caught"; a target in a topic the learner no longer has access to (e.g. left a team) disables revisit with an explanation.

- **[GAP-05] As a Self-directed Learner (LEARNER-SELF), I want a gap to move Open → Watching → Closed automatically as my review performance improves, so that its status reflects real evidence of understanding rather than my optimism.** — *Priority:* MVP — *Why this priority:* Evidence-driven lifecycle is the mechanism that makes the Gap Map honest and different from a checklist.
  - *Acceptance criteria:*
    - A gap in `Open` advances to `Watching` after the linked material is recalled correctly (per FSRS ratings / drill catches) but before the system trusts it.
    - A `Watching` gap advances to `Closed` only after sustained correct performance across a configured number of successful reviews/drills.
    - Each automatic transition is logged with the triggering signal and timestamp and is visible in the gap's history.
  - *Business rules / validation:* Auto-transitions are driven by signals owned by the Retain/Tests domains (correct recalls, drill catches, calibrated confidence); the thresholds are domain-configured, not learner-set. A gap never auto-closes directly from `Open` without passing through `Watching`.
  - *Failure & edge cases:* Conflicting signals in the same session (a catch then a miss) resolve to the more cautious status; if the underlying review signal stream is delayed, the gap holds its current status rather than flapping.

- **[GAP-06] As a Self-directed Learner (LEARNER-SELF), I want a Closed gap to auto-reopen when I lapse on it later, so that "closed" means genuinely understood and a regression can never hide.** — *Priority:* MVP — *Why this priority:* Auto-reopen is the single defining honesty mechanic of the domain; without it, closure is a vanity metric and the whole surface fails the thesis.
  - *Acceptance criteria:*
    - A later lapse (rating `Again`, a re-flagged wrong idea, a missed seeded drill, or a test miss on the same material) moves a `Closed` gap to `Open` with status `Reopened`.
    - Reopening bumps the open count, raises severity/heat, and surfaces the gap in "Where to focus" again.
    - The full history (original close, reason for reopen, timestamp) is preserved and shown; nothing is overwritten.
  - *Business rules / validation:* Reopen is triggered by evidence, not by manual choice; a manually-closed gap is equally subject to reopen. Reopen appends to the gap's immutable history and never erases the prior closed period.
  - *Failure & edge cases:* A gap reopened repeatedly escalates severity and may be tagged `chronic` for prioritization; a lapse arriving after the topic was deleted is a no-op (the gap is already orphaned) rather than an error.

- **[GAP-07] As a Self-directed Learner (LEARNER-SELF), I want gaps to be created automatically from missed drills, repeatedly-failed task criteria, resolved disputes, and test misses — and de-duplicated into one gap per misconception, so that every channel of "you got this wrong" lands in one honest place without clutter.** — *Priority:* MVP — *Why this priority:* Multi-origin intake is what makes the Gap Map the single source of weak-spot truth the product promises ("misses feed your gap map automatically"); dedupe keeps it usable.
  - *Acceptance criteria:*
    - A missed seeded error-drill, a rubric criterion failed across repeated task attempts, a resolved dispute that exposed a shaky assumption, and a formal-test miss each create (or update) a gap with the matching origin tag.
    - When two origins point at the same misconception (same claim/section + concept), they merge into one gap carrying multiple origin tags, not duplicate cards.
    - Auto-created gaps enter as `Open` and are distinguishable from learner-created ones by their origin tag.
  - *Business rules / validation:* Dedupe keys on the underlying claim/section + normalized misconception, not on wording; a merge preserves all origin trails and the highest severity among merged inputs. Auto-creation from tests/tasks is gated on an actual scored miss, never a skipped item.
  - *Failure & edge cases:* If dedupe is uncertain, the system prefers creating a linked-but-separate gap over silently merging distinct misconceptions; a flood of auto-created gaps from one bad session is rate-grouped so the board is not swamped.

- **[GAP-08] As a first-time Self-directed Learner (LEARNER-SELF), I want an empty Gap Map that teaches me how gaps are created, so that the feature is not a mystery before I have any misconceptions.** — *Priority:* MVP — *Why this priority:* The prototype's empty-state spec (E4) explicitly calls for teaching the feature; a blank board would waste the first impression of a differentiating surface.
  - *Acceptance criteria:*
    - With no gaps, the board shows "No gaps tracked" and explains the four+ origins (wrong idea, missed drill, partial task, resolved dispute, test miss) in plain language.
    - The empty state frames gaps positively ("this is where weak spots get named and closed"), not as a punishment.
    - It links to where gaps are created (e.g. "start a review") rather than dead-ending.
  - *Business rules / validation:* The teaching state shows until the first gap exists, then never again by default. It must not fabricate example gaps that look real.
  - *Failure & edge cases:* If gaps exist but all are filtered out by the current grouping/filter, the empty result reads "no gaps match this filter" (with a reset), distinct from the true zero-gaps teaching state.

- **[GAP-09] As a Self-directed Learner (LEARNER-SELF), I want to seed a targeted drill from a gap and to mark a gap closed by hand, so that I can actively attack a weak spot and record when I believe I have it.** — *Priority:* MVP — *Why this priority:* These are the two core learner actions on the detail; seeding a drill is the constructive path and manual close is the honest-but-provisional escape hatch.
  - *Acceptance criteria:*
    - `＋ Add a drill` queues a targeted item into the next review session focused on this gap's misconception and confirms it was scheduled.
    - `✓ Mark closed` moves the gap to `Closed · manual` with an optional note and updates the board.
    - A drill seeded from a gap, once caught/missed, feeds the gap's status per GAP-05/GAP-06.
  - *Business rules / validation:* Seeding a drill hands off to the Retain domain (which owns scheduling); this domain only records intent and consumes the outcome. Manual close never bypasses future auto-reopen.
  - *Failure & edge cases:* Seeding a drill for material with no reviewable claims (orphaned gap) is blocked with an explanation; marking closed while a lapse for the same gap is mid-flight resolves to the lapse (stays/returns Open) rather than closing.

- **[GAP-10] As a Skeptical/Expert Learner (LEARNER-SKEPTIC) working a gap, I want the Skeptic to join the gap's discussion thread as a study partner, so that I can interrogate the misconception with the same adversarial engine that verified the content.** — *Priority:* Should-Have — *Why this priority:* The discussion thread is promised in Privacy and shown in the detail, and the Skeptic-as-partner is a strong differentiator — but a gap is workable via revisit + drills without it.
  - *Acceptance criteria:*
    - Each gap has a threaded discussion; the learner can post, and the Skeptic can respond with why-this-misconception-happens explanations and drill suggestions.
    - Skeptic contributions are visually attributed as the Skeptic and framed as advisory, never as certification that the gap is closed.
    - The thread persists with the gap and is included in data export/reset (GAP-18, GAP-20).
  - *Business rules / validation:* The Skeptic in a gap thread is advisory only — it cannot change the gap's status or any claim's trust state. Hard-mode Skeptic depth is gated to Pro (AI-cost control); Free users get a basic thread.
  - *Failure & edge cases:* If the Skeptic model is unavailable, the thread stays usable for the learner's own notes and shows "Skeptic unavailable" rather than blocking; a Skeptic response that appears to hallucinate is flagged/regenerable and never auto-writes gap status.

- **[GAP-11] As an Exam-prep Student (LEARNER-EXAM), I want to triage my gaps by severity/heat and see gap closure raise my predicted readiness, so that under a deadline I fix the weak spots that most threaten my passing bar first.** — *Priority:* MVP — *Why this priority:* For the deadline-driven persona, prioritized closure tied to readiness is the core reason to open the Gap Map at all.
  - *Acceptance criteria:*
    - Grouping/sorting by severity surfaces the highest-heat gaps first, with heat driven by recent lapses, drill misses, and confidence miscalibration.
    - The board can scope to a single topic (the one being tested) so exam prep is focused.
    - Closing/reducing gaps in the tested topic updates the inputs the Tests domain uses for predicted readiness.
  - *Business rules / validation:* Severity/heat is computed from behavioral signals, not learner assertion; this domain *provides* per-topic open-gap signal to Tests but does not compute readiness itself. Open high-severity gaps on tested material are reflected honestly in readiness (they may lower it).
  - *Failure & edge cases:* If a topic has many open gaps, the readiness surface must not hide them to look encouraging — it shows the weak-spot count and links here; a gap closed at the last minute still requires evidence before it stops depressing readiness (no instant vanity boost).

- **[GAP-12] As a Returning Power-Learner (LEARNER-POWER), I want a cross-topic gap board sorted by heat across my whole portfolio, so that I can spend limited daily time on the misconceptions that matter most regardless of which topic they live in.** — *Priority:* Should-Have — *Why this priority:* At portfolio scale a per-topic view is unusable; the global heat-sorted board is how a power user manages the qualitative side of review debt — but the per-topic board (GAP-02) ships first.
  - *Acceptance criteria:*
    - A global Gap Map spans all topics, each gap tagged with its topic, sortable by severity/heat, status, and recency.
    - Bulk triage (e.g. filter to `Open + high severity`, or `Reopened`) is possible without opening each gap.
    - Counts reconcile with each topic's own gap board (single source of truth).
  - *Business rules / validation:* A gap has one canonical record surfaced in both the topic board and the global board; heat is comparable across topics via a normalized score. Closed/archived gaps are excluded from default global triage but remain searchable.
  - *Failure & edge cases:* An empty global board shows "nothing tracked across your topics," not an error; if one topic's gap data fails to load, the board shows the rest with a partial-load notice rather than failing wholesale.

- **[GAP-13] As a Self-directed Learner (LEARNER-SELF), I want Progress's "Where to focus" weak spots to be clickable and open the matching gap, so that an insight turns directly into an action.** — *Priority:* Should-Have — *Why this priority:* This wires the analytics surface to the actionable one and is the payoff the Progress page's ranked list implies — but "Where to focus" already conveys value read-only.
  - *Acceptance criteria:*
    - Each "Where to focus" item (tagged `overconfident` / `watch` / `solid`, ranked by recent signals) links to its corresponding gap where one exists.
    - The focus-item tag and the gap's severity/status are consistent (e.g. `overconfident · calibration low` ↔ a high-severity Open gap).
    - A focus item with no tracked gap yet offers to create one.
  - *Business rules / validation:* "Where to focus" (Progress domain) and the Gap Map read the same weak-spot signals; this domain owns the tracked gap object, Progress owns the ranked presentation. Tags map deterministically to severity bands.
  - *Failure & edge cases:* If a focus item references a gap that was reset/deleted, the link offers to recreate rather than 404-ing; `solid` items link to Closed gaps (read-only), not an empty Open one.

- **[GAP-14] As an Instructor/Educator (INSTRUCTOR), I want a read-only aggregate of the misconceptions most common across my cohort, so that I can find where the class is weak and adjust my teaching without touching any individual's data or trust states.** — *Priority:* Should-Have — *Why this priority:* Aggregate weak-spot visibility is a core Teams value ("read the four honest signals to find weak spots"), but individual gap tracking must work first and this view is policy-gated.
  - *Acceptance criteria:*
    - The instructor sees, for assigned shared topics, which gaps/misconceptions recur across learners and how many are Open vs Closed — as counts/patterns, not named individuals unless policy permits.
    - No control lets an instructor edit, close, reopen, or comment on an individual learner's gap, and no trust state is mutable here.
    - The aggregate updates as learners' gaps change.
  - *Business rules / validation:* Visibility is governed by the tenant's progress-visibility policy owned by ORG-ADMIN; instructors have zero write access to gaps or the ledger, enforced server-side. Aggregation respects minimum-cohort-size thresholds to avoid de-anonymizing individuals.
  - *Failure & edge cases:* A cohort too small to anonymize shows "not enough learners to report" rather than exposing an individual; an instructor viewing a topic outside their assignment scope is denied.

- **[GAP-15] As a Team Seat Learner (LEARNER-TEAM), I want my own personal gaps inside a shared library while inheriting its trust states, so that I get the benefit of curated content and still honestly track my own weak spots without exposing them to editing.** — *Priority:* Should-Have — *Why this priority:* The consumer half of Teams needs a personal Gap Map that coexists with inherited, read-only trust; it is important for Teams but not required for the single-learner core loop.
  - *Acceptance criteria:*
    - In a shared topic, a team learner accumulates personal gaps (from their own reviews/drills/tasks/tests) that only they own.
    - Gaps reference the shared topic's claims read-only (trust states are inherited, never mutated from a gap).
    - The team learner's gap patterns contribute to the instructor aggregate (GAP-14) per policy, but the individual gap object and its thread stay theirs.
  - *Business rules / validation:* Personal gaps are per-learner even in a shared library; a team learner cannot edit another learner's gap or any trust state (enforced server-side). Inherited claim states shown in a gap are read-only references.
  - *Failure & edge cases:* If the shared topic's ledger changes (SME re-verifies a claim), affected gaps show "underlying content updated" rather than silently going stale; a learner removed from the team retains an export of their own gaps per data policy but loses live access.

- **[GAP-16] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want the gap board and lifecycle fully operable and unambiguous under assistive tech, so that severity and status never depend on seeing a color accent or a column position.** — *Priority:* MVP — *Why this priority:* The product's stated bar treats color/spatial encoding as a core stress test, not a niche edge case; a kanban board is exactly the pattern that fails screen readers if built naively.
  - *Acceptance criteria:*
    - Each gap card announces its name, status, severity, and origin as text; severity is conveyed by label/glyph plus color, never color alone.
    - The board (columns = status) is navigable by keyboard with visible focus, and moving a gap between statuses is keyboard-operable with an announced state change.
    - The lifecycle status and any auto-transition are announced, not merely reflected by a card sliding columns.
  - *Business rules / validation:* No gap attribute (severity, status, reopened-ness) may be encoded by color or position as its sole channel. Focus is managed on transitions; the board scrolls within its own container without trapping focus.
  - *Failure & edge cases:* On a narrow/mobile viewport the board reflows to a single-column, status-labeled list that remains fully navigable; a reopened gap is announced as "reopened," never conveyed only by an outline color.

- **[GAP-17] As a Support Agent (SUPPORT-AGENT), I want to recover gaps lost to an accidental reset or a sync bug under scoped consent, so that a learner's honest weak-spot history is restored without me ever fabricating a signal.** — *Priority:* Should-Have — *Why this priority:* "Reset gap map" is a destructive, prominent Danger-zone action and a realistic support ticket; recovery matters, but the firewall against fabricating learning signals is the hard invariant.
  - *Acceptance criteria:*
    - With the learner's scoped, time-boxed consent, Support can restore gaps (and their history/threads) from a pre-incident snapshot to the state they were in.
    - Support cannot create a new gap, alter an origin trail, change a status to something not evidenced, or write a discussion message as the learner or Skeptic.
    - Every Support action on gaps is attributed to the agent in an audit log the learner and Compliance can see.
  - *Business rules / validation:* Support is restore-only, never author; recovery must reproduce prior evidenced state, not invent one. Access requires active scoped consent and expires automatically.
  - *Failure & edge cases:* If no snapshot predates the incident, Support reports the honest limit ("no restorable copy") rather than reconstructing plausible gaps; an attempt to fabricate a gap is blocked and logged as a policy violation.

- **[GAP-18] As a Compliance/Data-Protection Officer (COMPLIANCE-DPO), I want gaps and their discussion threads treated as governed personal data, so that export, retention, deletion, and minor-safety obligations are met.** — *Priority:* Should-Have — *Why this priority:* Privacy already lists "Gap map & discussion threads" as exportable personal data; honoring DSAR/retention/FERPA-COPPA is a compliance obligation, though it rides on the core surface existing.
  - *Acceptance criteria:*
    - A data export (DSAR) includes every gap, its origin trail, status history, and discussion thread in a portable format.
    - Retention windows and deletion requests are honored end-to-end (including derived aggregates), and "Reset gap map" and account deletion propagate to gaps and threads.
    - For minor accounts, viewing of gaps/threads is constrained per the governing policy (FERPA/COPPA).
  - *Business rules / validation:* Gaps and threads are personal data owned by the learner; aggregate cohort views (GAP-14) must be de-identifiable and honor deletion of contributing individuals. Compliance has governance/audit authority but cannot read or alter epistemic content beyond policy.
  - *Failure & edge cases:* A deletion that would break an aggregate recomputes the aggregate without the deleted data rather than retaining it; an export requested mid-reset returns the pre-reset snapshot or a clear "reset in progress" status, never partial/corrupt data.

- **[GAP-19] As a Self-directed Learner (LEARNER-SELF), I want gap creation and status changes to survive offline use, write failures, and concurrent edits without ever showing a false state, so that the honesty surface is itself trustworthy.** — *Priority:* MVP — *Why this priority:* A weak-spot tracker that loses gaps or shows fake "closed" states would undermine the exact trust it exists to build; robustness here is load-bearing, not polish.
  - *Acceptance criteria:*
    - A gap action taken offline (create, add drill, change status) queues locally and syncs on reconnect; the UI shows a pending state, not a confirmed one.
    - A failed write never renders as success — the affected action retains its prior state and offers retry, preserving any drafted note/thread message.
    - Concurrent edits to the same gap from two sessions use optimistic concurrency; the stale write is rejected with a "this changed — review before overwriting" prompt.
  - *Business rules / validation:* The server gap record is the single source of truth; counts/badges may be eventually consistent but must reconcile to it on focus/load. A locally-queued status change re-validates against server state (including any auto-reopen) before committing.
  - *Failure & edge cases:* If an offline "mark closed" collides with a synced lapse that auto-reopened the gap, the reopen wins and the learner is told why; duplicate creates from a double-tap dedupe to one gap.

- **[GAP-20] As a Self-directed Learner (LEARNER-SELF), I want to reset my entire Gap Map from the Danger zone with a clear, irreversible confirmation, so that I can start clean while understanding exactly what I am destroying.** — *Priority:* Should-Have — *Why this priority:* The action exists in the Danger zone and users need a safe, honest path to it; it is important but secondary to the create/close loop.
  - *Acceptance criteria:*
    - "Reset gap map" states plainly that it deletes all tracked gaps *and their discussion threads*, requires explicit confirmation, and cannot be undone by the learner.
    - After reset the board returns to the teaching empty state (GAP-08).
    - The reset is recorded (for Support-assisted recovery per GAP-17 and audit) without retaining the epistemic content beyond the recovery window.
  - *Business rules / validation:* Reset is scoped to the acting learner's own gaps; it does not touch trust states, ledger, or another learner's gaps. Reset does not disable future auto-creation — new lapses will create fresh gaps.
  - *Failure & edge cases:* A reset interrupted mid-way leaves no half-deleted gaps (transactional) and reports clearly; confirming reset while gaps are mid-sync completes only after pending writes settle to avoid resurrected zombies.

- **[GAP-21] As a Skeptical/Expert Learner (LEARNER-SKEPTIC), I want a resolved dispute that exposed a shaky assumption to become a linked gap, and reopening that dispute to reopen the gap, so that my epistemic corrections and my personal weak spots stay in sync.** — *Priority:* Should-Have — *Why this priority:* This is the bridge from the Conflicts/Trust-ledger domain into the Gap Map and a genuine differentiator for expert users, but the ledger and gap surfaces each function independently.
  - *Acceptance criteria:*
    - Resolving a dispute can offer/auto-create a gap tagged `from dispute`, linked to the conflict and the affected claim.
    - Reopening the source conflict (upstream) reopens the linked gap if it had been closed.
    - The gap's origin trail links to the conflict's resolution history (read-only).
  - *Business rules / validation:* The gap never changes the claim's trust state; the linkage is one-directional consumption from the ledger. Only trust-authority actions (owner/SME) reopen the *conflict*; that upstream event, not the gap, triggers the gap reopen.
  - *Failure & edge cases:* If the linked conflict is deleted with its topic, the gap is orphaned (history preserved) rather than deleted; a dispute resolved as `Interpretive` (no single answer) may create a "know the positions" gap rather than a right/wrong one.

- **[GAP-22] As a Returning Power-Learner (LEARNER-POWER), I want to be notified when a gap reopens or its heat spikes, so that regressions reach me instead of waiting to be rediscovered on the board.** — *Priority:* Nice-to-Have — *Why this priority:* Proactive nudges increase closure and retention, but the surface is fully usable pull-only; notifications are an enhancement.
  - *Acceptance criteria:*
    - A gap auto-reopen or a severity jump into `high` can emit a notification linking straight to the gap.
    - Notification frequency is batched/throttled and respects the learner's notification settings.
    - Dismissing or acting on the notification reconciles with the gap's live state.
  - *Business rules / validation:* This domain emits gap events; the Notifications domain owns delivery and preferences. Notifications are advisory and never change a gap's status.
  - *Failure & edge cases:* A burst of reopens from one bad session is coalesced into a single digest rather than a notification storm; a notification for a gap deleted by reset resolves gracefully to "no longer tracked."

- **[GAP-23] As a Parent/Guardian (GUARDIAN), I want visibility into a dependent's tracked gaps, so that I can support a struggling teen — acknowledging that today's single-shared-account model does not cleanly provide this.** — *Priority:* Future — *Why this priority:* This is a real, known product gap the persona roster explicitly flags; it depends on account-model changes (guardian/dependent linkage) outside this domain, so it is scoped as future.
  - *Acceptance criteria (target state):*
    - A guardian linked to a dependent account can view (read-only) the dependent's gap board and severity trend, subject to minor-safety policy.
    - The guardian cannot edit, close, reopen, or read private Skeptic-thread content beyond what policy permits.
    - The dependent is informed of guardian visibility per policy.
  - *Business rules / validation:* Requires a real guardian↔dependent account relationship (Auth/Org domain) that does not exist today; until then, guardian access to gaps is explicitly unsupported rather than approximated via a shared login. Governed by COMPLIANCE-DPO's minor-safety rules.
  - *Failure & edge cases:* On a shared single account, gaps are attributed to the account, not a person, so no reliable per-child view is possible — the product must not imply otherwise; any interim solution must not expose one child's gaps as another's.

### Business rules & invariants

- **A gap is a durable object, not a queue item.** It has an id, a name (misconception), one or more immutable origin trails, a single current status, a severity/heat score, a source anchor (topic + section + claim, or task/test/conflict), a discussion thread, and an append-only history. The review deck schedules recall; the Gap Map tracks named weaknesses.
- **Lifecycle: `Open → Watching → Closed`, with `Reopened` as the corrective transition back to Open.** Advancement to Watching and Closed is evidence-driven; a gap never auto-closes without passing through Watching; a closed gap (manual or auto) is always subject to auto-reopen.
- **Auto-reopen is mandatory and evidence-triggered.** A later lapse (Again, re-flagged wrong idea, missed drill, test miss, or upstream conflict reopen) reopens a Closed gap. No manual close can immunize a gap against reopen. This invariant is the domain's reason to exist.
- **Status must track evidence, not assertion.** Manual `Mark closed` is allowed but recorded as provisional (`closed · manual`); no actor — learner, instructor, admin, Support — can set a gap to a state the behavioral evidence does not support, and none can suppress an auto-reopen.
- **Severity/heat is computed, not declared.** Heat is a function of recent lapses, drill misses, and confidence miscalibration; repeated reopens escalate it (a gap may become `chronic`). Attempts to game severity via self-reported confidence are a T&S concern, not a valid input override.
- **Gaps are personal and read-down-only on the ledger.** A gap belongs to the learner who holds the weakness; it references claims and their trust states read-only and never mutates the ledger. In shared libraries, no other role may edit an individual's gap or read its private thread beyond progress-visibility policy.
- **One gap per misconception.** Multiple origins pointing at the same claim/concept merge into one gap carrying multiple origin tags; the origin trail is append-only and never rewritten. When merge is uncertain, prefer a linked separate gap over a wrong merge.
- **Origin trail is immutable and honest.** Every gap can name exactly how it was caught (card/drill/task/conflict/test). No "mystery gaps," and no fabricated origins — including by Support.
- **Destructive actions are scoped and honest.** "Reset gap map" and account deletion destroy only the acting learner's gaps and threads, are transactional, and surface an unambiguous irreversible confirmation; they do not touch trust states or others' data.
- **The Skeptic in a gap thread is advisory.** It can explain and suggest drills but cannot change a gap's status or any trust state; hard-mode depth is Pro-gated for AI-cost control.

### Cross-domain dependencies

- **Needs from Retain / FSRS (Review):** the `wrong idea` branch and its `＋ Add to gap map` intake, seeded error-drill outcomes (catches/misses = the blind-spot signal), FSRS ratings (`Again` and lapses), and the correct-recall stream that drives Watching/Closed/Reopen transitions. This domain records intent to seed a drill; Retain owns scheduling.
- **Needs from Tasks:** repeated rubric-criterion misses (`<75%` failures across attempts) as a `partial task` origin.
- **Needs from Conflicts & Trust Ledger:** resolved-dispute linkages (`from dispute` origin), reopened-conflict events that reopen linked gaps, and read-only claim/trust-state references for revisit and display. This domain never writes to the ledger.
- **Needs from Tests:** formal-test misses as an automatic `test miss` origin ("misses feed your gap map").
- **Needs from Lecture:** stable section + claim anchors for the `Revisit` deep-link.
- **Needs from Auth / Teams / Org:** per-learner gap ownership, shared-library membership, and the progress-visibility policy (ORG-ADMIN) that governs instructor/admin aggregate access; enforced server-side.
- **Provides to Tests & Progress:** per-topic open-gap and severity signal feeding predicted readiness (Tests) and the ranked "Where to focus" list (Progress); "Where to focus" items link back into specific gaps.
- **Provides to Notifications:** gap events (reopened, heat spike) for advisory delivery.
- **Provides to Settings (Privacy/Danger):** gaps + threads as exportable personal data and as the target of "Reset gap map."
- **Provides to Compliance / Support:** governed personal-data records for DSAR/retention and restore-only recovery snapshots, with an audit trail.

### Key technical requirements

- **Gap data model:** a gap entity (id, owner, topic, name/misconception text, current status, severity/heat, source anchor{topic, section, claim | task | test | conflict ref}, dedupe key); an origin-trail collection (append-only, each with type/tag, triggering-object ref, timestamp); a status-history log (append-only: transition, trigger signal, actor, timestamp); a discussion thread (messages with author = learner | Skeptic, timestamps).
- **Evidence-driven state machine:** a status engine consuming behavioral signals (FSRS ratings, drill catch/miss, test miss, conflict reopen) to drive Open→Watching→Closed→Reopened with configurable thresholds; cautious resolution of conflicting same-session signals; hold (no flap) on delayed signal streams.
- **Signal ingestion & idempotency:** reliable, idempotent consumption of gap-creating events from Retain/Tasks/Tests/Conflicts so retries and double-taps do not duplicate gaps; a dedupe keyed on claim/section + normalized misconception with an "uncertain → link, don't merge" default.
- **Severity/heat computation:** a scoring function over recent lapses, drill misses, and calibration error, normalized for cross-topic comparability (global board) and escalating with repeated reopens.
- **Atomic, low-latency propagation:** a status change updates the board, per-column and global counts, "Where to focus," and (where relevant) readiness inputs together; counters may be eventually consistent but reconcile to the canonical gap record on focus/load.
- **Optimistic concurrency & offline queue:** version/etag-guarded writes to prevent lost updates; an offline queue that re-validates against server state (including auto-reopen) before committing, preserving drafted notes/thread messages; no false "closed"/"added" states.
- **Accessibility:** the kanban board as a semantic, keyboard-operable structure with status/severity conveyed by label+glyph (never color/position alone), managed focus on transitions, announced auto-transitions, self-contained scroll, and a single-column reflow on narrow viewports.
- **Aggregation with privacy floors:** cohort misconception aggregates (instructor view) computed with minimum-cohort thresholds and honoring individual deletion; governed by progress-visibility policy.
- **Data governance:** portable DSAR export of gaps + origin trails + history + threads; retention/deletion propagation (including reset and derived aggregates); minor-safety constraints; restore-only recovery snapshots for Support with an audit log — no fabrication path for any actor.
- **AI-cost control:** Skeptic gap-thread depth gated to Pro (hard mode); graceful "Skeptic unavailable" degradation that keeps the thread usable for the learner's own notes.

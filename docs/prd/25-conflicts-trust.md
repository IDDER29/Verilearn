## Conflicts, the Trust Ledger & Sources

### Overview

This domain owns the **spine's data of record and the two surfaces where it is adjudicated and audited**: the **trust ledger** (the canonical store where every decomposed claim carries exactly one of five trust states, each traceable to a source), the **Conflicts** surface (where disputed claims are resolved — per-topic tab *and* the global cross-topic inbox), and the **Sources** surface (the claims × sources **coverage matrix**, the attached-source list, and the promotion of community replies into a topic's sources).

If the Lecture domain is "where the product thesis becomes a felt experience," this domain is **where the thesis is true or false**. Everything the learner reads, is tested on, and earns a certificate for resolves back to a ledger entry that lives here. The moat — "no competitor tags every claim verified/sourced/disputed/unsupported/interpretive, traces it to a source, and lets a Skeptic AI red-team it in the open" — is literally this domain's data model plus its adjudication workflow.

The domain has a strict division of powers that must never blur:

1. **Producers draft; they do not certify.** The Verification Pipeline populates the initial ledger and coverage matrix; the Skeptic *raises* Disputed/Interpretive conflicts; the Execution Sandbox *produces* `Verified · execution` from real passing runs and raises computational conflicts. None of them can certify a `Verified` state by fiat, and the Skeptic cannot resolve its own conflicts.
2. **Humans adjudicate within scope.** In a learner's **own** generated topic, the learner adjudicates their own conflicts and curates their own sources. In a **shared/Teams library**, only an **SME / Content Reviewer** holds trust-authority; team learners and instructors read and contribute but cannot mutate a trust state.
3. **The ledger is the single source of truth, and it only changes through this domain.** A resolution recorded in the global Conflicts inbox is the *same object* as the one in the topic's Conflicts tab. Resolving it once updates the rail badge, the Library card, the Lecture underlines, the test question-pool eligibility, and the Gap Map — atomically. Nothing lives in two places, and nothing external ever writes to it.

Because this data feeds certificates, tests, and an employer's trust in them, its **integrity, auditability, and access control** are the highest-stakes non-functional requirements in the product.

### Personas involved

- **Self-directed Learner (LEARNER-SELF)** — primary. In their own topics they meet the ledger, adjudicate Skeptic/Sandbox conflicts, audit the coverage matrix, add/remove sources, and shore up unsupported claims.
- **Skeptical / Expert Learner (LEARNER-SKEPTIC)** — the stress-tester: runs hard-mode Skeptic (Pro), audits the coverage matrix column by column, raises Conflicts, maps interpretive disputes, and attaches missing sources.
- **Exam-prep Student (LEARNER-EXAM)** — cares that **disputed claims are excluded from tests until resolved**; races to clear open conflicts so verified/sourced claims unlock and predicted-readiness rises.
- **Returning Power-Learner (LEARNER-POWER)** — lives in the **global Conflicts inbox**, triaging disputes across a large portfolio by importance rather than by which topic is open.
- **Team Seat Learner (LEARNER-TEAM)** — learns inside a shared library and **inherits** its trust states; may raise and discuss conflicts but **cannot mutate** any trust state (the SME owns that).
- **Subject-Matter Expert / Content Reviewer (SME-REVIEWER)** — the human-in-the-loop and the authoritative trust-authority in shared libraries: adjudicates Conflicts, sets claim trust states, closes coverage-matrix gaps, and promotes community replies into sources.
- **Instructor / Educator (INSTRUCTOR)** — reads coverage/conflicts to find a cohort's weak spots; holds pedagogical authority but **no power to change trust states**.
- **Community Contributor (CONTRIBUTOR)** — raises well-sourced disputes and earns durable footprint when an SME promotes their cited reply into a topic's sources; cannot self-promote or self-certify.
- **Community Moderator (COMMUNITY-MOD)** — routes strong, cited replies toward SME promotion and keeps threads anchored to specific claims/sources; certifies nothing.
- **Event Host / Facilitator (EVENT-HOST)** — converts what surfaces live into Conflicts and promotion requests, but must route any live claim through an SME to certify.
- **Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD)** — guards the ledger against gaming (cert fraud, Skeptic prompt-injection, promotion vote-rings); can freeze/revoke a claim, source, or certificate but **never hand-certify**.
- **Accessibility-Reliant Learner (A11Y-LEARNER)** — core stress case: the coverage matrix and conflict adjudication encode meaning in color and spatial grids and must be fully operable under assistive tech.
- **Developer / API & Integration Consumer (DEVELOPER-API)** — reads structured trust data read-only; bound by the rule that nothing external mutates the ledger.
- **Guest / Visitor (GUEST)** — meets a live-but-ephemeral demo conflict/ledger to see adjudication is real, persists nothing.
- **The Skeptic (SKEPTIC-AI)** — *system actor*. Raises Disputed/Interpretive conflicts and drafts competing positions; cannot certify `Verified` or resolve its own conflicts.
- **Execution Sandbox (EXEC-SANDBOX)** — *system actor*. Produces `Verified · execution` from real passing runs, raises computational conflicts with reproducible traces, and refuses rather than faking a pass.
- **Verification Pipeline (VERIFY-PIPELINE)** — *system actor*. Produces the drafted ledger and the initial coverage matrix (`Verified · source` / `Sourced` / `Unsupported` tags); referenced, not redefined, here.
- **Compliance / Data-Protection Officer (COMPLIANCE-DPO)** — consumes the immutable ledger audit log for certificate audit; governs personal data and credential compliance, never truth. Referenced.

### User stories

- **[TRUST-01] As a Self-directed Learner (LEARNER-SELF), I want every claim in a topic to carry exactly one of the five trust states, each traceable to a specific source, so that I can tell a proven fact from a plausible guess.** — *Priority:* MVP — *Why this priority:* The five-state, source-traceable ledger is the product's moat; nothing else in the domain exists without it.
  - *Acceptance criteria:*
    - Every decomposed claim resolves to exactly one state: `Verified · execution`, `Verified · source`, `Sourced`, `Disputed`, `Unsupported`, or `Interpretive`.
    - Each non-`Unsupported`, non-`Disputed` state links to at least one backing source (a citation, or a sandbox run) that the learner can open.
    - The topic exposes an honest roll-up (e.g. "4 sources · 6 claims · 1 unsupported" and a coverage percentage) computed from the ledger, never rounded up.
  - *Business rules / validation:* A claim with no resolvable state or no backing source defaults to `Unsupported` — never to a "verified" default. `Disputed` exists **iff** the claim has an open Conflict. Every state carries a confidence value that comes verbatim from the producer.
  - *Failure & edge cases:* If claim-to-source anchoring failed for a claim, it renders as `Unsupported` with a "no source resolved" note, not as silently verified; a topic with zero verified claims must not display any celebratory verified treatment.

- **[TRUST-02] As a Self-directed Learner (LEARNER-SELF), I want a per-topic Conflicts tab that lists every open and resolved dispute with its claim and who raised it, so that the first time I hit a disagreement I understand it is a first-class thing I resolve, not a bug.** — *Priority:* MVP — *Why this priority:* Making disagreement a visible, ownable object (rather than hidden) is the core honesty behavior of the product.
  - *Acceptance criteria:*
    - The tab lists conflicts as cards showing status (`OPEN`/`RESOLVED`), the disputed claim text, and the raiser (the Skeptic or the Execution sandbox); resolved cards are visibly dimmed.
    - The topic header and tab show a live open-conflict count (e.g. "1 open conflict") that matches the list.
    - A first-time orientation panel explains what happens on resolution (badge updates in the lecture, counter drops, reasoning saved to the topic).
  - *Business rules / validation:* A conflict is always attributed to exactly one raiser and one claim. Only the Skeptic and the Execution Sandbox may raise conflicts automatically; humans may raise disputes that enter the same queue.
  - *Failure & edge cases:* A topic with no conflicts shows an honest empty state ("no disputes — every claim held up"), not a blank panel; if the count and list disagree (stale cache), the list is authoritative and the badge reconciles.

- **[TRUST-03] As a Self-directed Learner (LEARNER-SELF), I want to adjudicate a Skeptic-raised dispute by choosing between the competing positions and writing my reasoning, so that the claim is corrected or qualified and the fix propagates everywhere.** — *Priority:* MVP — *Why this priority:* Adjudication is the domain's central happy-path action and the moment the learner does the epistemic work the product is built around.
  - *Acceptance criteria:*
    - The detail view shows the disputed claim, why it was flagged, and two or more competing positions each with their support (e.g. "Backed by CLRS §24.3" vs. "Unsupported by sources").
    - Selecting a position drafts a resolution; the learner can edit the rationale before recording; "Record resolution" is the commit.
    - On commit the conflict flips to `RESOLVED`, the open-conflict counter decrements, the claim's trust state and lecture badge update, and the rationale is saved to the topic.
  - *Business rules / validation:* Recording a resolution requires a chosen position; the rationale is stored with adjudicator identity and timestamp in an immutable audit entry. Resolution updates the *same* ledger object referenced by every surface (single source of truth).
  - *Failure & edge cases:* If the write fails (offline/server error), the UI must not show a false "resolved" — it retains `OPEN`, preserves the drafted rationale, and offers retry; committing with an empty rationale on a non-interpretive conflict is blocked with an inline prompt.

- **[TRUST-04] As a Skeptical / Expert Learner (LEARNER-SKEPTIC), I want a claims × sources coverage matrix with the empty rows called out and a coverage-health figure, so that I can see at a glance which claims are unsupported and worth worrying about.** — *Priority:* MVP — *Why this priority:* The coverage matrix turns "is this trustworthy?" into a scannable picture and is the audit surface expert users came for.
  - *Acceptance criteria:*
    - Rows are claims, columns are attached sources; a filled cell (color/glyph-coded by `Verified · execution` vs. `Backed by a source`) means that source backs that claim.
    - A claim with an entirely empty row is flagged `Unsupported` with a distinct treatment and rolled into an "N unsupported" count.
    - A coverage-health readout (e.g. "83% · 5 of 6 claims backed by at least one source") is shown and derived from the matrix.
  - *Business rules / validation:* A claim is "covered" **iff** at least one source backs it; coverage health = covered claims ÷ total claims. The matrix is read from the ledger, not recomputed with different logic than the roll-up in TRUST-01.
  - *Failure & edge cases:* A topic with 100% coverage shows a positive full-coverage state and no false "unsupported" alarm; a matrix with many claims/sources must scroll within its own container without breaking the page layout (see TRUST-16).

- **[TRUST-05] As the Execution Sandbox (EXEC-SANDBOX), I want to raise a computational conflict with a reproducible trace when an assertion fails, so that a claim I could not prove becomes a dispute a human adjudicates rather than a silent pass.** — *Priority:* MVP — *Why this priority:* Empirical, reproducible disputes are what distinguish VeriLearn's verification from an LLM's opinion.
  - *Acceptance criteria:*
    - A sandbox-raised conflict is attributed to "Execution sandbox," carries the failing assertion, and links a reproducible trace (inputs, code, observed vs. expected).
    - The disputed claim's state is set to `Disputed` and it is excluded from test pools until resolved.
    - The competing positions include the sandbox's empirical finding as one supported stance.
  - *Business rules / validation:* The sandbox may only *raise* conflicts and *produce* `Verified · execution` on a genuinely passing run; it may never mark a claim verified on a failed or skipped run. Every trace is stored immutably with the conflict.
  - *Failure & edge cases:* If a run is non-deterministic across repeats, the sandbox raises the conflict as needing human judgment rather than flip-flopping the state; traces that cannot be reproduced on demand are flagged as such (see TRUST-18).

- **[TRUST-06] As a Returning Power-Learner (LEARNER-POWER), I want one global Conflicts inbox spanning all my topics, so that I can triage every open dispute by importance instead of hunting through topics.** — *Priority:* MVP — *Why this priority:* At portfolio scale, per-topic conflict lists are unusable; the cross-topic inbox is how a power user keeps the library honest.
  - *Acceptance criteria:*
    - The global list shows every conflict across topics, each tagged with its topic and status, with open items sortable/filterable ahead of resolved ones.
    - Opening any conflict here presents the same adjudication UI as the topic tab and writes to the same object.
    - Resolving here updates the rail badge, the Library card for that topic, and the topic's own Conflicts tab together.
  - *Business rules / validation:* A conflict appears in exactly one canonical record surfaced in both the global inbox and its topic tab (two-way sync, no duplication). Rail badge counts are live counts of open conflicts.
  - *Failure & edge cases:* If two surfaces are open at once, resolving in one must reflect in the other on next focus without creating a second resolution; an empty global inbox shows "nothing to adjudicate," not an error.

- **[TRUST-07] As an Exam-prep Student (LEARNER-EXAM), I want disputed claims excluded from my tests until they are resolved, and resolving them to unlock those questions, so that I am only tested on trustworthy material and can raise my predicted readiness.** — *Priority:* MVP — *Why this priority:* Test integrity — "questions drawn only from verified & sourced claims" — is a load-bearing promise of the certificate and directly motivates conflict resolution.
  - *Acceptance criteria:*
    - Claims in `Disputed` or `Unsupported` state are never selected into a test's question pool.
    - Resolving a conflict that promotes a claim to a verified/sourced state makes it eligible for future tests and updates predicted readiness inputs.
    - The Sources/Conflicts surface indicates when open conflicts are currently gating test coverage.
  - *Business rules / validation:* Eligibility is computed from live ledger state at pool-assembly time; a claim resolved to `Interpretive` remains ineligible for single-answer test questions. This domain *provides* eligibility; the Tests domain consumes it.
  - *Failure & edge cases:* If all of a topic's claims are disputed/unsupported, the test surface reports "not enough verified claims to test yet" and routes the learner to Conflicts, rather than generating a thin or dishonest test.

- **[TRUST-08] As a Subject-Matter Expert / Content Reviewer (SME-REVIEWER), I want to authoritatively adjudicate conflicts and set claim trust states in a shared library, so that a whole team inherits a curated, trustworthy ledger.** — *Priority:* MVP — *Why this priority:* In Teams, the SME is the human-in-the-loop the entire shared library's trust depends on.
  - *Acceptance criteria:*
    - In topics within the SME's scope, the SME can resolve conflicts, set a claim's trust state among the allowed states, and close coverage gaps.
    - SME actions are attributed to the SME identity in the audit log and mark the claim as SME-curated.
    - Changes propagate to every team learner's view of that shared topic.
  - *Business rules / validation:* Only roles holding trust-authority (SME-REVIEWER; the owner of a personally-generated topic) may mutate trust states. An SME cannot manufacture a `Verified · execution` state without a sandbox run — they may certify `Verified · source`/`Sourced`/`Interpretive` with a cited basis.
  - *Failure & edge cases:* An SME acting outside their scoped topics is denied server-side; if an SME sets a state that contradicts an open sandbox conflict, the system requires the conflict be resolved rather than left inconsistent.

- **[TRUST-09] As a Skeptical / Expert Learner (LEARNER-SKEPTIC), I want to attach a source to back an unsupported claim, so that I can shore up a gap I found in the coverage matrix.** — *Priority:* Should-Have — *Why this priority:* Closing coverage gaps is the constructive counterpart to raising conflicts and a key expert-retention behavior, but the topic ships trustworthy without it.
  - *Acceptance criteria:*
    - The learner can add a source (reference/URL/note) and associate it with one or more claims, filling the corresponding matrix cells.
    - Adding a source recomputes coverage health and can move a claim from `Unsupported` to `Sourced`.
    - A newly added source enters as `attached` and is labeled with its origin ("Added by you").
  - *Business rules / validation:* Attaching a source produces `Sourced` (cited, not independently proven), never `Verified` — verification requires source-matching by the pipeline or a sandbox run. A source added by a learner in their own topic is scoped to that topic.
  - *Failure & edge cases:* Adding a source that backs nothing (matches no claim) is allowed but flagged as unused; a malformed/unreachable reference is accepted as a note but marked unverifiable, not silently upgraded.

- **[TRUST-10] As a Skeptical / Expert Learner (LEARNER-SKEPTIC), I want genuinely contested claims handled as Interpretive conflicts where I map the positions instead of picking a winner, so that honest disagreement is preserved rather than falsely resolved.** — *Priority:* Should-Have — *Why this priority:* The `Interpretive` state is what keeps the product honest about questions that have no single right answer, distinguishing it from a fact-only checker.
  - *Acceptance criteria:*
    - An interpretive conflict lets the adjudicator record multiple mapped positions with their support rather than selecting one as correct.
    - The resulting claim carries the `Interpretive` state (positions mapped, not certified) and links each mapped position to its basis.
    - Interpretive claims are visibly distinct from `Disputed` and are excluded from single-answer test questions.
  - *Business rules / validation:* Resolving an interpretive conflict does not require choosing a winning position; it requires at least two mapped positions with sources. `Interpretive` never counts as `Verified` for coverage-health or certificate purposes.
  - *Failure & edge cases:* If a learner tries to force a single-winner resolution on a genuinely interpretive dispute, the system offers the interpretive path rather than certifying a contested position.

- **[TRUST-11] As a Self-directed Learner (LEARNER-SELF), I want to mark one source as preferred and remove sources I do not trust, so that the ledger reflects the provenance I actually stand behind.** — *Priority:* Should-Have — *Why this priority:* Curation control makes provenance the learner's own, but the topic functions with pipeline-chosen sources.
  - *Acceptance criteria:*
    - Any attached source can be set `preferred` (one preferred per topic) or removed.
    - Removing a source recomputes the coverage matrix and health figure and may create new `Unsupported` claims, which are surfaced immediately.
    - The preferred source is visually marked and used as the default citation where a claim has several backing sources.
  - *Business rules / validation:* Removing the only source backing a claim moves that claim to `Unsupported` (never leaves it falsely verified). Setting a new preferred source unsets the previous one. Sandbox "source" (the execution run) may back claims but follows execution-verification rules, not preferred-citation rules.
  - *Failure & edge cases:* Removing a source that a resolved conflict cited must warn that it will reopen/undermine that resolution; concurrent edits to the same source list are handled by TRUST-20's rules.

- **[TRUST-12] As a Subject-Matter Expert / Content Reviewer (SME-REVIEWER), I want to promote a strong, cited community reply into a topic's sources, so that good external pushback strengthens the ledger and the contributor earns durable footprint.** — *Priority:* Should-Have — *Why this priority:* Promotion closes the loop between Community and the ledger and is the mechanism that makes verified-answers-only community meaningful, but is not required for the core loop.
  - *Acceptance criteria:*
    - From a routed community reply, the SME can promote its cited reference into the topic's Sources, associating it with the relevant claim(s).
    - Promotion attributes durable credit to the originating Contributor and records the SME as the promoter in the audit log.
    - The promoted source enters Sources and recomputes coverage; if it resolves an unsupported claim, that reflects immediately.
  - *Business rules / validation:* Only an SME may promote; a Contributor cannot self-promote or self-certify. Moderators and Event Hosts may *route* a reply for promotion but cannot promote it. Promotion adds a `Sourced`/`Verified · source` backing per the reference quality, never `Verified · execution`.
  - *Failure & edge cases:* A reply whose cited source cannot be located is not promotable and is returned to the moderator with a reason; a promotion attempt by a non-SME is denied server-side.

- **[TRUST-13] As a Skeptical / Expert Learner (LEARNER-SKEPTIC), I want to reopen a resolved conflict when new evidence appears, so that the ledger can be corrected rather than frozen on a stale decision.** — *Priority:* Should-Have — *Why this priority:* A ledger that can never be revisited is not honest; reopening is the corrective half of the conflict lifecycle.
  - *Acceptance criteria:*
    - A resolved conflict can be reopened, moving it to `OPEN` (Reopened), reverting the claim's trust state pending re-adjudication, and incrementing the open count.
    - The full history (original resolution, who reopened, why) is preserved and visible; nothing is overwritten.
    - Reopening a conflict that gated test eligibility re-excludes the affected claim.
  - *Business rules / validation:* Reopening requires a reason and appends to the immutable audit trail; only trust-authority roles (owner in own topic, SME in shared) may reopen. A claim's state on reopen falls back to `Disputed`, not to any prior "verified."
  - *Failure & edge cases:* If a certificate was issued partly on the now-reopened claim, the reopen notifies downstream (Tests/Certs, T&S) rather than silently invalidating the credential; reopening after topic deletion is a no-op with a clear message.

- **[TRUST-14] As a Team Seat Learner (LEARNER-TEAM), I want to see and discuss the shared library's conflicts and coverage but be prevented from changing any trust state, so that I benefit from a curated ledger without being able to corrupt it.** — *Priority:* Should-Have — *Why this priority:* Teams' value is inherited trust; the read/contribute-but-not-mutate boundary is what protects it for the whole cohort.
  - *Acceptance criteria:*
    - A team learner can open Conflicts and the coverage matrix in a shared topic and can raise a dispute or add a comment for the SME.
    - "Record resolution," "set trust state," "promote source," and "remove source" controls are disabled/absent for this role.
    - Raised disputes and comments are routed to the topic's SME queue.
  - *Business rules / validation:* Trust-mutation permissions are enforced server-side by role and topic scope, never merely hidden in the UI. Inherited states are read-only for team learners; their contributions never change state until an SME acts.
  - *Failure & edge cases:* A team learner who forges a mutation request via the API is rejected with an authorization error (see TRUST-17); if the SME later resolves a routed dispute, the team learner sees the updated state on next load.

- **[TRUST-15] As an Instructor / Educator (INSTRUCTOR), I want a read-only audit of a topic's coverage and open conflicts, so that I can find where a cohort's material is weak without being able to alter trust.** — *Priority:* Should-Have — *Why this priority:* Instructors need epistemic visibility to teach well, but pedagogical authority must stay firewalled from trust-certification.
  - *Acceptance criteria:*
    - The instructor sees the coverage matrix, unsupported-claim count, and open/resolved conflict list for assigned topics.
    - No trust-mutation control (resolve, set state, add/remove/promote source) is available to this role.
    - Weak spots (unsupported claims, unresolved conflicts) are summarized for cohort planning.
  - *Business rules / validation:* The instructor role has read access to trust surfaces but zero write access to the ledger, enforced server-side. Instructors may flag a concern to the SME but cannot resolve it themselves.
  - *Failure & edge cases:* An instructor viewing a topic outside their assignment scope is denied; a topic still verifying shows pipeline-in-progress rather than an empty or misleading matrix.

- **[TRUST-16] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want the coverage matrix and conflict adjudication to be fully operable and unambiguous under assistive tech, so that the trust signal does not depend on seeing color or a spatial grid.** — *Priority:* MVP — *Why this priority:* The product's stated bar is that the trust ledger's color/spatial/timed encoding is a core stress test, not a niche edge case — an inaccessible ledger fails the thesis for these users.
  - *Acceptance criteria:*
    - The coverage matrix is a semantic table with programmatic row (claim) and column (source) headers; each cell announces claim, source, and backing state in text, not color alone.
    - Trust states are conveyed by glyph/label plus color everywhere (matrix, conflict cards, source list); `Unsupported` empty rows are announced as such.
    - Conflict adjudication — selecting a position, editing rationale, recording — is fully keyboard-operable with visible focus and announced state changes.
  - *Business rules / validation:* No trust state may be encoded by color as its sole channel. Interactive elements meet contrast and focus-order requirements; the matrix scrolls within its own container without trapping keyboard focus.
  - *Failure & edge cases:* On a narrow/mobile viewport the matrix reflows or scrolls horizontally within its container while remaining navigable; a screen reader must never read an empty (unsupported) cell as "backed."

- **[TRUST-17] As a Developer / API & Integration Consumer (DEVELOPER-API), I want read-only structured access to a topic's trust data, so that I can surface trust states externally while being guaranteed nothing external can mutate the ledger.** — *Priority:* Should-Have — *Why this priority:* Structured trust export extends the moat into other systems, but the core product does not depend on it; the immutability guarantee it enforces, however, is a hard invariant.
  - *Acceptance criteria:*
    - The API returns claims with their trust state, confidence, backing sources, and coverage summary via a scoped read token.
    - No API surface exists to set a trust state, resolve a conflict, or certify a claim from outside.
    - Responses reflect the current canonical ledger and are consistent with what the UI shows.
  - *Business rules / validation:* All external access is read-only; certification and mutation are internal-only privileges. Tokens are scoped to permitted topics/tenants; revoked claims/certs are reflected as revoked, never omitted.
  - *Failure & edge cases:* A write attempt returns an explicit authorization error and is logged for T&S; a token scoped away from a topic returns not-authorized, not partial data.

- **[TRUST-18] As the Execution Sandbox (EXEC-SANDBOX), I want to refuse rather than fake a pass when a run times out or cannot be reproduced, so that a claim is never marked verified on evidence I could not actually produce.** — *Priority:* MVP — *Why this priority:* "Refuses rather than faking a pass" is the empirical half of the trust promise; a single fabricated verification would poison the moat.
  - *Acceptance criteria:*
    - On timeout, crash, or non-reproducible result, the sandbox does not set `Verified · execution`; the claim stays `Unsupported`/`Disputed` as applicable.
    - The failure is surfaced with a diagnostic (timeout/error/non-reproducible) attached to the claim, not hidden.
    - A conflict or "needs verification" flag remains open for human attention.
  - *Business rules / validation:* Absence of a passing, reproducible run ⇒ no execution-verified state. The sandbox never upgrades a claim on partial or ambiguous evidence.
  - *Failure & edge cases:* Repeated sandbox unavailability degrades gracefully — claims stay in their prior honest state and the pipeline/topic shows verification incomplete, rather than blocking all reads or faking completion.

- **[TRUST-19] As a Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD), I want to detect and freeze attempts to game the ledger — including Skeptic prompt-injection and self-certification — so that the trust states stay trustworthy under attack.** — *Priority:* Should-Have — *Why this priority:* The moat is only as strong as its resistance to gaming; the Skeptic and adjudication flow are adversarial targets, though the abuse surface grows with scale.
  - *Acceptance criteria:*
    - Content that attempts to instruct the Skeptic to certify itself or suppress a conflict is detected; the Skeptic's output is treated as advisory (raise-only) and cannot write a `Verified` state.
    - T&S can freeze a claim, source, or certificate, halting its use in tests/certs pending review, and can revoke a fraudulently obtained state.
    - Freeze/revoke actions are attributed in the immutable audit log and cannot themselves certify a claim.
  - *Business rules / validation:* Raise privileges (Skeptic/Sandbox) and certify privileges (SME/owner) are separate and independently enforced; no single actor can both raise and certify the same claim. T&S can only freeze/ban/revoke, never hand-certify.
  - *Failure & edge cases:* A prompt-injection attempt is logged and the claim is quarantined to `Disputed`/frozen rather than accepted; a freeze during an in-flight adjudication cancels the write with a clear reason.

- **[TRUST-20] As a Subject-Matter Expert / Content Reviewer (SME-REVIEWER), I want concurrent resolutions of the same conflict handled safely, so that two people (or a stale tab) can never silently overwrite each other's adjudication.** — *Priority:* Should-Have — *Why this priority:* At Teams scale, two reviewers on one conflict is inevitable; a lost or clobbered resolution would corrupt the audit trail the whole model rests on.
  - *Acceptance criteria:*
    - Recording a resolution uses optimistic concurrency (version/etag); if the conflict changed since load, the write is rejected with a "this was just resolved/updated — review before overwriting" prompt.
    - Rail and Library badge counts reconcile to the canonical open-count after any resolution, even if a client held a stale number.
    - The audit log records both attempts distinctly; no resolution is silently dropped.
  - *Business rules / validation:* The ledger is the single source of truth; the last *valid* write wins only after the writer has seen the current state. Badge counters may be eventually consistent but always reconcile to the ledger.
  - *Failure & edge cases:* Offline resolution queues locally and re-validates on reconnect (rejecting if the conflict was resolved meanwhile, preserving the drafted rationale); resolving an already-resolved conflict is a no-op with an explanatory message.

- **[TRUST-21] As a Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD), I want to guard source-promotion against vote-rings and coverage gaming, so that a claim cannot be made to look supported by coordinated low-quality endorsements.** — *Priority:* Should-Have — *Why this priority:* Once promotion carries reputation and unlocks tests, it becomes a gaming target; protecting it preserves coverage-health's meaning.
  - *Acceptance criteria:*
    - Promotion still requires an SME's individual judgment; community upvotes route/rank replies but do not by themselves change coverage or trust state.
    - Coordinated endorsement patterns (vote-rings, sockpuppets) are detectable and can be discounted or frozen without certifying anything.
    - Contributor credit from a later-reversed promotion is revocable and audited.
  - *Business rules / validation:* Coverage health only counts sources that actually back a claim per SME/pipeline validation; raw popularity never fills a matrix cell. Self-promotion and self-certification remain prohibited.
  - *Failure & edge cases:* A promotion later found to be gamed is reverted, the backed claim recomputes (possibly back to `Unsupported`), and any dependent test eligibility/certificate is flagged downstream.

- **[TRUST-22] As a Guest / Visitor (GUEST), I want to see a live conflict and its ledger in an ephemeral demo, so that I can confirm the trust-ledger claim is real before deciding to sign up, without anything being saved.** — *Priority:* Nice-to-Have — *Why this priority:* A working demo conflict is a strong conversion asset, but the domain's obligations are to authenticated users and the ledger's integrity first.
  - *Acceptance criteria:*
    - The demo shows a pre-verified topic's coverage matrix and at least one adjudicable-looking conflict with competing positions.
    - The guest can explore the ledger and read positions but cannot record a resolution or mutate any state; adjudication controls prompt sign-up.
    - Nothing the guest does persists after the session.
  - *Business rules / validation:* Demo content is a fixed showcase; a guest never writes to any real ledger. Any "resolve" affordance is a conversion gate, not a mutation.
  - *Failure & edge cases:* If the guest attempts to persist (e.g. deep-links a "resolve"), they are routed to sign-up rather than shown an error; the demo ledger is clearly labeled as a showcase so it is never mistaken for a certified user topic.

### Business rules & invariants

- **Five states, one per claim, always.** Every decomposed claim carries exactly one of: `Verified · execution`, `Verified · source`, `Sourced`, `Disputed`, `Unsupported`, `Interpretive`. The fallback for any unresolvable/unbacked claim is `Unsupported` — never a "verified" default.
- **Provenance is mandatory for trust.** `Verified · execution` requires a genuine passing sandbox run; `Verified · source`/`Sourced` require ≥1 cited backing source. A claim with no backing is `Unsupported`. `Disputed` exists **iff** an open Conflict references the claim. `Interpretive` means ≥2 positions are mapped and none is certified.
- **Separation of powers.** Producers (Pipeline, Skeptic, Sandbox) draft and *raise*; they cannot certify by fiat. The Skeptic cannot resolve its own conflicts. Certify/mutate authority belongs to the topic owner (own topics) and the SME (shared libraries). T&S can freeze/revoke but never hand-certify. Instructors, Support, Platform Admins, and external API consumers can never mutate the ledger.
- **Single source of truth, atomic propagation.** A conflict/claim/source is one canonical object. Any resolution, state change, add/remove, or promotion updates the rail badge, Library card, Lecture underlines, coverage matrix, test eligibility, and Gap Map together. Nothing lives in two places.
- **Conflict lifecycle.** `Open → Resolved`, reversible via `Reopened → Resolved`. Every transition appends to an immutable audit log capturing actor identity, chosen/mapped positions, rationale, and timestamp; history is never overwritten.
- **Source lifecycle.** `attached → retrieved → verified`; exactly one source may be `preferred` per topic; any source is removable. Removing a source recomputes coverage and may create new `Unsupported` claims and undermine resolutions that cited it (with warning).
- **Test & certificate coupling.** `Disputed`, `Unsupported`, and `Interpretive` claims are excluded from single-answer test pools; only verified/sourced claims are eligible. Certificates are auditable back to the specific ledger states in force when earned; reopen/revoke propagates downstream.
- **Promotion rules.** Only an SME promotes a community reply into sources; contributors/moderators/hosts may route but not promote; no self-promotion or self-certification. Popularity never fills a coverage cell by itself.
- **Coverage semantics.** A claim is covered iff ≥1 source backs it; coverage health = covered ÷ total claims, computed once from the ledger and consistent across every surface.

### Cross-domain dependencies

- **Needs from Topic Pipeline (VERIFY-PIPELINE):** the drafted ledger — decomposed claims, initial source retrieval, the initial coverage matrix, and the first-pass `Verified · source`/`Sourced`/`Unsupported` tags. This domain owns all *post-pipeline* mutation.
- **Needs from the Skeptic (SKEPTIC-AI):** `Disputed`/`Interpretive` flags with drafted competing positions and hard-mode (Pro) dispute density; strictly raise-only, never certify.
- **Needs from the Execution Sandbox (EXEC-SANDBOX):** `Verified · execution` evidence, computational conflicts, and reproducible traces; refusal semantics on failure.
- **Needs from Auth/Teams/Org (roles):** who holds trust-authority (SME vs. topic owner) vs. read-only (Instructor, Team Learner), topic/tenant scope, and shared-library membership — to enforce mutation permissions server-side.
- **Needs from Community & Events:** routed, cited replies (from CONTRIBUTOR via COMMUNITY-MOD/EVENT-HOST) as promotion candidates.
- **Provides to Lecture:** the read-only ledger it renders (claim underlines, per-section trust bar, side-rail claim detail). Lecture consumes; it never mutates.
- **Provides to Tests & Certificates:** the verified/sourced eligible-claim pool (disputed/unsupported/interpretive excluded) and the auditable trust basis for each certificate.
- **Provides to Gap Map:** disputed claims and resolved/reopened conflicts as linkage points; a reopened conflict can reopen a related gap.
- **Provides to Reports/Progress & Notifications:** open-conflict counts and coverage health as honest signals; events for "new conflict raised," "conflict resolved," "coverage dropped."
- **Provides to Developer API & Compliance:** read-only structured trust data (DEVELOPER-API) and the immutable audit log for certificate audit (COMPLIANCE-DPO).

### Key technical requirements

- **Ledger data model:** a claim entity (id, text anchor, topic/section, single trust state, confidence, backing-source refs); a source entity (id, type, lifecycle state, preferred flag, origin); a conflict entity (id, claim ref, raiser, competing/mapped positions with support, status, resolution{adjudicator, position(s), rationale, timestamp}); coverage represented as a claim×source relation. One canonical record per object, surfaced identically everywhere.
- **Atomic, low-latency propagation:** a resolution/state change must update ledger, badges, matrix, test eligibility, and Gap Map transactionally; badge counters may be eventually consistent but must reconcile to the canonical open-count on focus/load.
- **Optimistic concurrency & audit:** version/etag-guarded writes to prevent lost updates (TRUST-20); an append-only, tamper-evident audit log of every transition (actor/when/why) for cert audit, T&S, and compliance — history never overwritten, even on reopen/revoke.
- **Server-side access control:** an enforced permission matrix (owner/SME can mutate; team-learner/instructor/support/platform-admin read-only; T&S freeze/revoke-only; external read-only) — never trust the client. Separate "raise" and "certify" privileges so no actor does both on one claim.
- **Sandbox integration:** reproducible run traces stored with `Verified · execution`; deterministic replay; explicit timeout/refusal handling; no state upgrade without a passing reproducible run.
- **Skeptic integration & hardening:** the Skeptic writes conflicts only (advisory), never trust states; prompt-injection/self-certification defenses; hard-mode gated to Pro (AI-cost control).
- **Coverage recomputation:** incremental, performant recompute on source add/remove/promote for topics with many claims/sources; consistent single computation feeding both roll-up and matrix.
- **Test-pool filter:** a live eligibility query (exclude `Disputed`/`Unsupported`/`Interpretive`) consumed by the Tests domain at pool-assembly time.
- **Accessibility:** coverage matrix as a semantic table with row/column headers; non-color (glyph/label) encoding of every state; keyboard-operable adjudication with managed focus; self-contained horizontal scroll on narrow viewports.
- **Read-only export & revocation:** scoped-token API returning current trust data with revoked states represented, not omitted; write attempts rejected and logged.

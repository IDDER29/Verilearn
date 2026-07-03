## Community, Contributions & Reputation

### Overview

This domain owns the **social layer that hangs off the verification spine without ever being allowed to touch it**: the **Community** surface (thread list, hot-debate feature, new-thread creation), the **Community Thread** (original post, human replies, the Skeptic's source-checked "verified answer", voting, and the promotion nomination), the **reputation system** (helpful-answer counts, the top-contributor leaderboard, durable footprint for promoted replies, and identity badges like "Verified Learner"), and the **moderation and integrity workflow** that keeps it honest.

Community is where the product's honesty thesis becomes a *social* norm. Every other surface makes trust visible for one learner; the community is where learners **debate the claims the Skeptic flagged**, pressure-test each other's reasoning in the open, and — crucially — where a well-sourced human argument can earn its way into a topic's canon. That last move is the domain's reason to exist: strong, cited pushback can be **promoted into a topic's sources**, turning a community reply into part of the verified record. This is the only path by which a human, non-vendor voice enters the ledger, and it is exactly why the boundary must be absolute.

The domain has one non-negotiable division of powers, mirroring the rest of the product:

1. **Community debates; it never certifies.** No human reply is ever "verified" by the community. The only checkmarked answer in a thread is the **Skeptic's**, and even that is labelled *sourced* (checked against sources), never `Verified` — the Skeptic cannot certify itself. A "verified answer" in a thread is a UI affordance backed by a source check, not a trust state.
2. **Community produces requests; the ledger performs writes.** The community can *nominate* a cited reply for promotion and *route* it to a Subject-Matter Expert, but the actual write of that reply into a topic's Sources / trust ledger is performed by the **SME-REVIEWER inside the Conflicts, Trust & Sources domain**. Nothing in this domain mutates a trust state, a source list, or a certificate.
3. **Reputation is a social signal, firewalled from learning signals.** Helpful-answer counts, leaderboard rank, and promotion footprint are *contribution* metrics. They must never leak into a learner's four honest signals (Retention, Transfer, Calibration, Drill detection), predicted readiness, or certificate eligibility. Being popular in the community earns you nothing on the trust ledger.

Because reputation is gameable and promotion is a path into the canon, this domain's highest-stakes non-functionals are **anti-abuse (vote-rings, self-promotion, self-certification), attribution durability, and moderation auditability**.

### Personas involved

- **Community Contributor (CONTRIBUTOR)** — primary. Answers questions, raises well-sourced disputes, upvotes, and earns durable footprint when an SME promotes their cited reply into a topic's sources. Cannot self-promote or self-certify.
- **Community Moderator (COMMUNITY-MOD)** — governs the verified-answers-only community: keeps threads anchored to specific claims/sources, enforces cite-your-source conduct, protects leaderboard integrity, and routes strong cited replies toward SME promotion. Certifies nothing.
- **Self-directed Learner (LEARNER-SELF)** — the default participant: opens threads to understand a flagged claim, asks questions, posts replies, and upvotes.
- **Skeptical / Expert Learner (LEARNER-SKEPTIC)** — the highest-value contributor: raises well-sourced disputes that link back to a claim's Conflict and produces the pushback most likely to be promoted into sources.
- **Returning Power-Learner (LEARNER-POWER)** — a durable presence on the top-contributor leaderboard; optimizes a large answering footprint over months.
- **Exam-prep Student (LEARNER-EXAM)** — reads threads and the Skeptic's source-checked answers to resolve a specific claim before a deadline; a consumer more than a producer.
- **Team Seat Learner (LEARNER-TEAM)** — participates inside a **shared/Teams library's** threads and shared conflicts/gaps, inheriting trust; contributes but owns no billing or seats. (Teams membership defined in the Org/Teams domain.)
- **Subject-Matter Expert / Content Reviewer (SME-REVIEWER)** — receives promotion requests routed from the community and performs the actual promotion into sources (the write itself lives in the Conflicts/Trust/Sources domain). The authoritative endpoint of the promotion path.
- **The Skeptic (SKEPTIC-AI)** — *system actor*. Contributes the thread's source-checked "verified answer" and can be @-invoked on a claim; is labelled *sourced*, never `Verified`, and cannot certify or resolve.
- **Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD)** — guards against gaming (vote-rings, reputation-juking, promotion collusion, Skeptic prompt-injection via thread content, cert-fraud rings); can freeze, ban, and revoke reputation/promotions but never hand-certify.
- **Event Host / Facilitator (EVENT-HOST)** — converts what surfaces in a live session into community threads and promotion requests routed to an SME. (Events surface defined in the Events domain; referenced here.)
- **Instructor / Educator (INSTRUCTOR)** — reads cohort threads to find weak spots; may seed discussion prompts. Holds pedagogical, not trust, authority.
- **Guest / Visitor (GUEST)** — meets a read-only community teaser to see the verified-answers ethos is real; persists nothing; converts or self-selects out.
- **Accessibility-Reliant Learner (A11Y-LEARNER)** — core stress case: the verified-answer marker, vote controls, and thread status must be fully operable and legible under assistive tech, not color/emoji-only.
- **Compliance / Data-Protection Officer (COMPLIANCE-DPO)** — governs community posts as personal data (DSAR export, deletion, minor safety); ensures deletion reconciles with durable promotion attribution. Referenced.
- **Parent / Guardian (GUARDIAN)** — non-learning overseer of a dependent; concerned with a minor's public participation and exposure. Referenced against today's single-shared-account gap.
- **Verification Pipeline / Conflicts, Trust & Sources domain** — *referenced, not redefined*. Provides the claim/source identity that threads anchor to and the SME/Sources workflow that consumes promotion requests.

### User stories

- **[COMM-01] As a Self-directed Learner (LEARNER-SELF), I want to open the Community and immediately understand it is a verified-answers-only space tied to claims, so that my first impression is "this is where flagged claims get debated," not "this is a generic forum.** — *Priority:* MVP — *Why this priority:* The community's differentiation is its ethos; if it reads as a generic forum on first contact, the product's honesty promise leaks.
  - *Acceptance criteria:*
    - The landing view shows a featured "hot debate", a thread list where each card carries a topic anchor and a type tag (`Disputed claim`, `Sources`, `Study group`), and a persistent "Verified answers only" explainer.
    - Every thread card shows its linked topic/claim, the raiser, reply count, and last activity.
    - A first-run empty state (no threads yet) explains the ethos and invites the first anchored thread rather than showing a blank list.
  - *Business rules / validation:* Every thread must be anchored to a topic; a thread may additionally anchor to a specific claim or source. Free-floating threads with no topic anchor are not allowed.
  - *Failure & edge cases:* If the thread index is unavailable, show a retryable error with the ethos explainer still visible, never a blank page; a brand-new tenant with zero threads shows the seeded ethos empty state.

- **[COMM-02] As a Self-directed Learner (LEARNER-SELF), I want to start a new thread anchored to a specific claim, source, or topic, so that the debate is attached to the exact thing in question rather than floating free.** — *Priority:* MVP — *Why this priority:* Anchoring is what makes community answers routable back into the ledger; without it, promotion and cross-linking are impossible.
  - *Acceptance criteria:*
    - New-thread composer requires a topic anchor and offers optional claim/source anchoring; when opened from a claim or Conflict, the anchor is pre-filled.
    - The thread renders a "Linked claim / Linked source" chip that deep-links back to the exact claim, Conflict, or coverage-matrix row.
    - A thread type is chosen or inferred (`Disputed claim`, `Sources`, `Study group`).
  - *Business rules / validation:* The anchor must reference a real, resolvable claim/source/topic ID; a learner can only anchor to topics they can access (own topic, public topic, or a shared library they belong to). Title and body are required.
  - *Failure & edge cases:* If the anchored claim is edited or deleted after posting, the chip renders "anchor changed / removed" and the thread stays readable rather than 404-ing; anchoring to a private topic the author no longer has access to hides the deep-link but keeps the thread.

- **[COMM-03] As a Community Contributor (CONTRIBUTOR), I want to post a reply that carries a citation, so that my answer meets the cite-your-source norm and can later earn promotion.** — *Priority:* MVP — *Why this priority:* Cite-your-source is the conduct rule that makes the community promotable and distinguishes it from opinion forums.
  - *Acceptance criteria:*
    - The reply composer lets me attach one or more sources (URL, reference, or a link to an existing topic source) alongside prose.
    - A posted reply displays its citations inline and is eligible to be nominated for promotion; an uncited reply is postable but visibly marked "no source cited".
    - The reply appears optimistically and reconciles with the server copy.
  - *Business rules / validation:* Replies making a factual/claim assertion are expected to cite; moderators may require a citation before a reply is eligible for promotion. A reply can never mark itself "verified".
  - *Failure & edge cases:* A citation URL that fails validation is flagged but does not block posting; posting the same reply twice (double-submit) is de-duplicated; an empty reply is rejected client- and server-side.

- **[COMM-04] As an Exam-prep Student (LEARNER-EXAM), I want the Skeptic's answer in a thread to be visibly distinguished from human replies and shown as *sourced* not *certified*, so that I can trust it enough to act but understand it is checked, not final.** — *Priority:* MVP — *Why this priority:* The single checkmarked answer is the community's trust affordance; mislabelling it as "Verified" would fake a trust state the Skeptic is forbidden to grant.
  - *Acceptance criteria:*
    - The Skeptic's answer renders in a distinct "Verified answer" block with an explicit "AI · sourced" badge and the backing source (e.g. "Sourced from CLRS §24.3").
    - The block states the Skeptic checked against sources and that debate remains open; it is never labelled with a `Verified` trust state.
    - Human replies never receive the checkmark treatment.
  - *Business rules / validation:* At most one Skeptic "verified answer" per thread; it is derived from the ledger's source check, not authored by any learner. The Skeptic cannot mark its own answer as a `Verified` trust state.
  - *Failure & edge cases:* If the Skeptic cannot find a source, it posts an honest "no source found — unsupported" answer rather than a confident guess; if source-checking fails, the block shows "source check pending", not a checkmark.

- **[COMM-05] As a Skeptical / Expert Learner (LEARNER-SKEPTIC), I want to raise a well-sourced dispute in the community that links to the claim's Conflict, so that my pushback feeds the adjudication instead of dying in a thread.** — *Priority:* MVP — *Why this priority:* Routing community pushback into the Conflicts spine is how the social layer strengthens the ledger rather than diverging from it.
  - *Acceptance criteria:*
    - A "Dispute this claim" action creates a `Disputed claim` thread anchored to the claim and surfaces a link into that claim's Conflict in the Conflicts/Trust/Sources domain.
    - The thread shows the claim's current trust state and open/resolved conflict status, kept in sync with the ledger.
    - When the linked Conflict is resolved, the thread reflects the outcome.
  - *Business rules / validation:* Raising a community dispute does **not** itself change a trust state; it can, at most, prompt the Skeptic/SME to open or update a Conflict, which is owned by the Conflicts domain. Only the Skeptic and Execution Sandbox raise ledger conflicts automatically; a human dispute enters the same queue.
  - *Failure & edge cases:* If the claim already has an open Conflict, the community dispute attaches to it rather than duplicating; if the claim was resolved between draft and submit, the thread opens in read-context with a "already resolved" note.

- **[COMM-06] As a Community Contributor (CONTRIBUTOR), I want to nominate my cited reply for promotion into a topic's sources, so that a genuinely strong argument can become part of the verified record.** — *Priority:* Should-Have — *Why this priority:* Promotion is the domain's marquee payoff, but the loop functions (debate, cite, upvote) before it exists, so it follows the read/participate MVP.
  - *Acceptance criteria:*
    - A "Nominate for sources" action on a cited reply creates a **promotion request** carrying the reply, its citations, the anchored claim, and the nominator.
    - The request is routed to the owning topic's SME/reviewer queue; the thread shows a "Promotion requested" state.
    - The nominator cannot approve the request; approval and the actual write occur in the Conflicts/Trust/Sources domain.
  - *Business rules / validation:* A reply with no citation cannot be nominated. A learner **cannot nominate their own reply for their own topic and also act as the approver** — promotion always requires a distinct SME actor. Only one open promotion request per reply.
  - *Failure & edge cases:* If the target topic has no SME (e.g. a personal topic), the request routes to the topic owner acting as reviewer, and self-approval is still blocked by COMM-13; if the reply is edited after nomination, the pending request is invalidated and must be re-nominated.

- **[COMM-07] As a Subject-Matter Expert / Content Reviewer (SME-REVIEWER), I want an inbox of community promotion requests with the reply, its sources, and the anchored claim, so that I can decide what earns a place in the canon.** — *Priority:* Should-Have — *Why this priority:* Without a clean intake, promotion requests either never reach a reviewer or bypass review — both break the boundary.
  - *Acceptance criteria:*
    - The inbox lists pending requests with reply text, citations, nominator, anchored claim, and current trust state.
    - Approving hands off to the Sources workflow (which performs the actual ledger/source write); rejecting records a reason back to the thread.
    - The decision is written to an audit trail.
  - *Business rules / validation:* The SME approves/rejects only; the *write into sources and any resulting trust-state change is owned by the Conflicts/Trust/Sources domain*, not here. An SME cannot approve a request they themselves authored.
  - *Failure & edge cases:* If the anchored claim was deleted before the SME acts, the request is auto-expired with a note; concurrent approval of duplicate requests for the same reply results in exactly one source entry (idempotent).

- **[COMM-08] As a Community Contributor (CONTRIBUTOR), I want to earn a durable, visible footprint when my reply is promoted into a topic's sources, so that contributing to the canon is a lasting credit, not a fleeting upvote.** — *Priority:* Should-Have — *Why this priority:* Durable attribution is the incentive that makes high-effort, cited contribution worthwhile and is the reputation system's most meaningful signal.
  - *Acceptance criteria:*
    - On successful promotion, the source entry records the contributor as its origin and the contributor's profile gains a permanent "promoted to sources" credit.
    - The originating reply is badged "Promoted to sources" with a link to the source entry.
    - The credit persists on the source even if the thread is later archived.
  - *Business rules / validation:* Promotion credit is granted only on SME approval, never on nomination or upvotes. Attribution is immutable except by Trust & Safety revocation.
  - *Failure & edge cases:* If a promoted source is later removed or the promotion is revoked for gaming, the credit is revoked and the badge removed with an audit entry; if the contributor deletes their account, see COMM-19 (attribution persists in anonymized form).

- **[COMM-09] As a Self-directed Learner (LEARNER-SELF), I want to upvote a genuinely helpful reply, so that the best answers rise and contributors get recognized.** — *Priority:* MVP — *Why this priority:* Voting is the baseline signal that surfaces quality and feeds the leaderboard; the community reads as dead without it.
  - *Acceptance criteria:*
    - Each reply has an upvote control showing a live count; one vote per user per reply, toggleable.
    - Vote state is reflected optimistically and reconciled.
    - A user cannot upvote their own reply.
  - *Business rules / validation:* One vote per authenticated identity per reply; self-votes are blocked server-side; vote counts are recomputed from the vote ledger, never incremented blindly.
  - *Failure & edge cases:* Rapid toggle (vote-spam) is rate-limited and idempotent; votes cast while offline are queued and reconciled, discarding duplicates; a vote on a since-deleted reply is dropped silently.

- **[COMM-10] As a Returning Power-Learner (LEARNER-POWER), I want a top-contributor leaderboard based on helpful answers and promotions, so that sustained, high-quality contribution is recognized.** — *Priority:* Should-Have — *Why this priority:* Recognition drives retention of the small cohort who answer most questions, but the community is usable before a leaderboard exists.
  - *Acceptance criteria:*
    - The leaderboard ranks contributors by a helpful-answer/promotion score and shows medals for the top ranks.
    - Ranking updates as votes and promotions accrue.
    - The board links to each contributor's public footprint.
  - *Business rules / validation:* Score is derived only from *received* signals (upvotes on your answers, promotions), never from actions you take on yourself. Leaderboard standing confers no trust or certificate privileges.
  - *Failure & edge cases:* Contributors flagged for vote-ring gaming are suppressed pending review (COMM-12); ties are broken deterministically; a contributor with revoked promotions has their score recomputed downward.

- **[COMM-11] As a Community Moderator (COMMUNITY-MOD), I want to keep threads anchored to their claim/source and enforce cite-your-source conduct, so that the community stays a verification space and not an opinion feed.** — *Priority:* Should-Have — *Why this priority:* Moderation is what preserves the ethos over time; without it the space degrades, but it is not needed on day one of a small community.
  - *Acceptance criteria:*
    - The moderator can re-anchor, retag, lock, or close a thread and require a citation on a reply before it is promotion-eligible.
    - The moderator can route a strong cited reply toward the SME promotion queue.
    - Every moderation action is logged with actor, target, and reason.
  - *Business rules / validation:* Moderators **cannot** set trust states, mark answers verified, or promote into sources — they route only. Moderation actions are auditable and reversible by Trust & Safety.
  - *Failure & edge cases:* A locked thread rejects new replies with an explanation; re-anchoring to an invalid claim is blocked; a moderator action on a thread being concurrently deleted resolves to a no-op with a notice.

- **[COMM-12] As a Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD), I want to detect and neutralize vote-rings and reputation-juking, so that the leaderboard and promotion path cannot be gamed into the canon.** — *Priority:* Should-Have — *Why this priority:* Because reputation is a path toward promotion into sources, gaming it is an attack on the ledger's integrity, not a cosmetic concern. *(Failure/abuse scenario.)*
  - *Acceptance criteria:*
    - The system flags coordinated voting patterns (bursty reciprocal votes, correlated accounts, new-account swarms) for review.
    - Trust & Safety can freeze a contributor's reputation, void fraudulent votes, revoke a gamed promotion, and ban an account.
    - Voided votes and revoked promotions recompute leaderboard scores and remove associated credits, with an audit entry.
  - *Business rules / validation:* Trust & Safety can freeze/void/revoke/ban but can **never hand-certify** a claim or source. Revocation of a promotion notifies the SME and the Sources domain to reverse the source entry.
  - *Failure & edge cases:* False-positive flags are appealable and reversible; a frozen contributor's existing promoted sources remain valid unless individually revoked; ring detection must not penalize an organic surge on a genuinely popular answer (thresholds tuned + human review before punitive action).

- **[COMM-13] As a Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD), I want self-promotion and self-certification to be structurally impossible, so that no one can inject their own claim into the canon.** — *Priority:* MVP — *Why this priority:* This invariant is the wall between "community opinion" and "verified record"; if it can be breached, the entire trust proposition collapses. *(Failure/abuse scenario.)*
  - *Acceptance criteria:*
    - A contributor cannot approve a promotion request they authored or nominated; approval requires a distinct SME/reviewer identity.
    - No community actor (contributor, moderator, event host) can set a trust state or mark an answer `Verified`.
    - Attempts to self-approve are rejected server-side and logged.
  - *Business rules / validation:* Nominator ≠ approver is enforced at the data layer, not just the UI. The only actors who can write to the ledger are those defined in the Conflicts/Trust/Sources domain (SME, and system producers).
  - *Failure & edge cases:* In a personal topic where the author is also the only reviewer, a self-nominated reply cannot be self-promoted — it requires either an external SME or remains a community-only reply; a moderator who is also the nominator is blocked from routing their own reply as an "endorsement".

- **[COMM-14] As a Guest / Visitor (GUEST), I want to read community threads and see the verified-answer ethos without an account, so that I can judge in minutes whether the trust claim is real before I sign up.** — *Priority:* Should-Have — *Why this priority:* The community is a high-signal proof of the honesty thesis for evaluators, and read-only access converts skeptics; it is not required for the core loop.
  - *Acceptance criteria:*
    - A guest can read a curated set of public threads and see the Skeptic's source-checked answers and citations.
    - Posting, voting, nominating, and DM-style actions are gated behind sign-up with a clear prompt.
    - No guest action persists any state.
  - *Business rules / validation:* Only public, non-Teams threads are guest-visible; shared-library threads require membership. Guests are rate-limited and cannot be attributed.
  - *Failure & edge cases:* A guest hitting a members-only thread sees a sign-up wall, not a 403 dead-end; a guest attempting to post is bounced to auth with their draft optionally preserved through sign-up.

- **[COMM-15] As a Team Seat Learner (LEARNER-TEAM), I want to participate in my shared library's threads and contribute to its shared conflicts and gaps, so that my cohort debates the same curated, trust-inherited material together.** — *Priority:* Should-Have — *Why this priority:* Shared, scoped discussion is a core part of the Teams value, but depends on the Teams library existing (Org/Teams domain) so it follows that.
  - *Acceptance criteria:*
    - Threads anchored to a shared-library topic are visible only to that library's members and inherit the library's trust states.
    - A team learner can post, cite, upvote, and nominate for promotion, but nomination routes to the library's SME.
    - The learner owns no billing/seat controls (defined in Billing/Org domains).
  - *Business rules / validation:* Library membership scopes visibility and participation; a team learner cannot mutate any inherited trust state (that is the SME's, per the Conflicts domain). Cross-posting a shared-library thread to the public community is blocked unless the topic is public.
  - *Failure & edge cases:* If the learner's seat is removed, their existing posts remain (attributed) but they lose access to the private threads; a topic moved from shared to private hides its threads from removed members.

- **[COMM-16] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want the verified-answer marker, vote controls, and thread status to be fully operable and legible under assistive tech, so that the trust affordances are not encoded in color or emoji alone.** — *Priority:* Should-Have — *Why this priority:* The verified-answer distinction is the community's core trust signal; if it is color/emoji-only it is invisible to a large class of users, which contradicts the product's inclusion of A11Y as a core case.
  - *Acceptance criteria:*
    - The "Verified answer" block, disputed/sources/study-group tags, and promotion states expose text labels and ARIA roles, not just color/emoji.
    - Vote and reply controls are keyboard-operable with visible focus and screen-reader labels including live counts.
    - Thread structure (OP, verified answer, replies) is a navigable semantic hierarchy.
  - *Business rules / validation:* No trust-relevant state may be conveyed by color or emoji alone. Live-updating counts announce politely, not disruptively.
  - *Failure & edge cases:* With CSS/emoji disabled, the verified-answer distinction remains readable as text; time-sensitive live-region updates degrade gracefully under high reply volume.

- **[COMM-17] As a Self-directed Learner (LEARNER-SELF), I want a reply I compose to survive a network drop or offline moment, so that a long, cited answer is never lost to a flaky connection.** — *Priority:* Should-Have — *Why this priority:* Losing a high-effort cited reply is a top churn/frustration event for exactly the contributors the community depends on. *(Failure scenario.)*
  - *Acceptance criteria:*
    - An in-progress reply is autosaved as a local draft and restored on reload.
    - A post attempt that fails to reach the server surfaces a "couldn't post — retry" state with the text intact, never a silent loss.
    - On reconnect, a queued post is submitted once and de-duplicated.
  - *Business rules / validation:* Drafts are local until successfully posted; a post is idempotent by client-generated token to prevent duplicates on retry.
  - *Failure & edge cases:* If the thread was locked or deleted while offline, the draft is preserved and the user is told it can't be posted there; two devices editing the same draft reconcile to last-write with a warning.

- **[COMM-18] As an Exam-prep Student (LEARNER-EXAM), I want a thread's "verified answer" to lose its checkmark when the underlying claim or source changes, so that I never act on a stale answer that the ledger no longer supports.** — *Priority:* Should-Have — *Why this priority:* A stale-but-still-checkmarked answer is an active lie about trust — the exact failure mode the product exists to prevent. *(Failure/concurrency scenario.)*
  - *Acceptance criteria:*
    - When the anchored claim's trust state changes or its cited source is removed/reopened as a Conflict, the Skeptic answer's checkmark is withdrawn and the block shows "source check outdated — re-checking".
    - The thread displays the claim's *current* trust state, synced from the ledger, not the state at post time.
    - Promoted-reply badges reflect revocation if the source was removed.
  - *Business rules / validation:* The verified-answer marker is a *live* function of the ledger, never a cached snapshot. Community holds no authoritative copy of trust state.
  - *Failure & edge cases:* If ledger sync is delayed, the thread shows "trust state syncing" rather than a possibly-wrong checkmark; a reopened Conflict on the anchored claim flips associated `Disputed claim` threads to reflect it.

- **[COMM-19] As a Compliance / Data-Protection Officer (COMPLIANCE-DPO), I want account deletion and DSAR to reconcile with durable promotion attribution, so that a user's personal data is removed without corrupting the sources their work became part of.** — *Priority:* Should-Have — *Why this priority:* Community posts are personal data subject to deletion/export law, yet promoted content is part of the canon — reconciling the two is a real, non-obvious governance requirement. *(Failure/edge scenario.)*
  - *Acceptance criteria:*
    - A DSAR export includes the user's threads, replies, votes, and promotion credits.
    - On deletion, personal posts and PII are removed or anonymized ("Deleted user"), while a source that was promoted from their reply remains valid with anonymized attribution and an audit trail.
    - The reputation/leaderboard recomputes to exclude a deleted user's outgoing actions where required.
  - *Business rules / validation:* Deletion must not silently strip a promoted source from the ledger; attribution converts to anonymized-but-intact. Governance is advisory/gatekeeping over personal data only — it never alters truth or trust states.
  - *Failure & edge cases:* If deletion would orphan a source citation, the source is retained with a "contributor removed" note rather than deleted; a minor's data (GUARDIAN concern) follows stricter retention; partial-deletion failures are retried and logged, never left half-applied.

- **[COMM-20] As a Community Contributor (CONTRIBUTOR), I want to flag an abusive, off-topic, or uncited reply, so that moderators can keep threads anchored and civil.** — *Priority:* Should-Have — *Why this priority:* User-driven flagging is the intake that makes moderation scalable and keeps the ethos enforceable, though a small community can survive briefly without it.
  - *Acceptance criteria:*
    - A flag control on each reply/thread lets me pick a reason (abuse, off-topic, no source, spam) and routes it to the moderator queue.
    - Flagged content shows its status to moderators; the flagger is notified of resolution.
    - Repeated flags on the same content are consolidated, not stacked.
  - *Business rules / validation:* Flagging does not auto-remove content; a moderator or Trust & Safety decides. Malicious mass-flagging is itself an abuse signal fed to COMM-12.
  - *Failure & edge cases:* A flag on since-deleted content is dropped; a flood of flags from correlated accounts is rate-limited and surfaced as a possible flag-ring.

- **[COMM-21] As an Event Host / Facilitator (EVENT-HOST), I want to convert something raised in a live session into a community thread or a promotion request routed to an SME, so that live insights become durable, adjudicable objects instead of evaporating.** — *Priority:* Nice-to-Have — *Why this priority:* It captures real value from Events but depends on both the Events surface and the promotion path being in place, so it is a later enhancement. *(Events surface defined in the Events domain.)*
  - *Acceptance criteria:*
    - From an event, the host can spin up an anchored thread pre-populated with the live claim/context, or file a promotion request for a cited contribution surfaced live.
    - Any live claim the host wants certified is routed to an SME — the host cannot certify it.
    - The resulting thread/request links back to the originating event.
  - *Business rules / validation:* Event hosts have no trust authority; live certification is impossible — everything routes to an SME or Conflict per the boundary. Referenced Events objects are owned by the Events domain.
  - *Failure & edge cases:* If the event's referenced claim doesn't exist yet, the thread is created unanchored-pending and the host is prompted to anchor it; a promotion request from a live moment still obeys nominator≠approver (COMM-13).

- **[COMM-22] As a Self-directed Learner (LEARNER-SELF), I want to search and filter threads by topic, tag, and status, so that I can find the debate on the exact claim I'm stuck on.** — *Priority:* Nice-to-Have — *Why this priority:* Findability improves the experience and scales with volume, but a small community is browsable without it.
  - *Acceptance criteria:*
    - Threads are filterable by topic anchor, type tag (`Disputed claim`/`Sources`/`Study group`), and status (open/resolved/promoted).
    - Full-text search covers thread titles and bodies within the learner's accessible scope.
    - Results respect access scope (public vs shared-library vs private).
  - *Business rules / validation:* Search never returns threads from libraries the user cannot access; ranking favors anchored, cited, and promoted threads.
  - *Failure & edge cases:* A no-results query offers to start an anchored thread on that topic; search-index lag shows recently posted threads with a "may be incomplete" note rather than hiding them indefinitely.

- **[COMM-23] As a Community Contributor (CONTRIBUTOR), I want my pending promotion request to fail gracefully when its anchored claim is resolved or deleted before an SME acts, so that I understand the outcome instead of watching it silently vanish.** — *Priority:* Should-Have — *Why this priority:* Promotion requests race against ongoing adjudication, and a silent drop erodes trust in the one mechanism that rewards high-effort contribution. *(Failure/concurrency scenario.)*
  - *Acceptance criteria:*
    - If the anchored claim is deleted, the request is auto-expired with a clear reason surfaced in the thread and to the nominator.
    - If the claim is resolved in a way that supersedes the reply, the request is closed with an explanation and a link to the resolution.
    - Expired/closed requests can be re-nominated against the current claim state where still relevant.
  - *Business rules / validation:* A promotion request is always evaluated against the *current* ledger state, never a stale snapshot; exactly one terminal outcome (approved/rejected/expired) per request.
  - *Failure & edge cases:* Concurrent SME approval and claim deletion resolve to a single deterministic outcome (no half-written source); a re-nomination after expiry creates a fresh request, not a revived one.

- **[COMM-24] As a Community Moderator (COMMUNITY-MOD), I want every moderation and integrity action to be recorded in an audit trail, so that the community's governance is accountable and reversible.** — *Priority:* Should-Have — *Why this priority:* Auditability is what lets Trust & Safety reverse mistakes and defend leaderboard/promotion integrity; it is foundational once moderation exists.
  - *Acceptance criteria:*
    - Locks, closes, re-anchors, routings, flag resolutions, freezes, voids, and revocations record actor, target, timestamp, and reason.
    - The trail is append-only and readable by Trust & Safety and (for personal-data actions) Compliance.
    - Reversible actions link to their reversal.
  - *Business rules / validation:* Audit entries are immutable; no moderation action bypasses logging. Moderators cannot edit the content of another user's post silently — only lock/route/annotate.
  - *Failure & edge cases:* If audit write fails, the moderation action is rolled back rather than applied unlogged; clock skew across actors is normalized to server time.

### Business rules & invariants

- **Verified-answers-only, but never community-certified.** The only checkmarked answer in a thread is the Skeptic's, labelled *sourced* (checked against a source), never carrying a `Verified` trust state. No human reply is ever certified by the community.
- **Community never writes to the trust ledger.** The community's maximal output toward the canon is a *promotion request* and a *routing*; the actual source/ledger write is performed by an SME inside the Conflicts, Trust & Sources domain. Nothing here mutates a trust state, source list, or certificate.
- **Every thread is anchored.** A thread must reference a topic and may additionally anchor to a specific claim or source; anchors are live links to the ledger, not copies of it.
- **Nominator ≠ approver; no self-promotion, no self-certification.** A contributor cannot approve or self-certify their own reply into sources; promotion always requires a distinct SME. Moderators route but never certify.
- **Reputation is a social signal, firewalled from learning signals.** Helpful-answer counts, leaderboard rank, and promotion footprint never feed the four honest signals, predicted readiness, or certificate eligibility.
- **Reputation derives only from received signals.** Score comes from upvotes on your answers and promotions of your replies — never from actions you take on yourself; self-votes are impossible.
- **Attribution is durable but revocable.** A promoted reply's credit persists (even through account deletion, in anonymized form) unless revoked by Trust & Safety for gaming.
- **Trust & Safety can freeze/void/revoke/ban but never hand-certify.** Anti-abuse power stops at the ledger boundary.
- **Live trust, not cached.** The verified-answer marker and displayed trust state are live functions of the ledger; when the claim/source changes, the marker withdraws.
- **Scope is enforced at the data layer.** Public threads are world/guest-readable; shared-library threads are members-only; private-topic threads follow topic access. Guests persist nothing.
- **Cite-your-source.** Replies making factual assertions are expected to cite; a citation is a hard precondition for promotion nomination.
- **Community posts are personal data.** DSAR export and deletion apply; deletion anonymizes without corrupting promoted sources.

### Cross-domain dependencies

- **Conflicts, Trust & Sources domain (needs / provides):** *Needs* stable claim/source identity and live trust state to anchor threads and render the Skeptic's source-checked answer; *needs* the SME + Sources workflow to consume promotion requests and perform the actual ledger/source write; *needs* Conflict objects to link `Disputed claim` threads to. *Provides* promotion requests (nominated cited replies) and human-raised disputes that can seed Conflicts. This is the domain's primary seam and the only path a human voice enters the canon.
- **Verification Pipeline (needs):** topic and decomposed-claim IDs that threads anchor to; referenced, not redefined.
- **The Skeptic (needs):** the source-checked "verified answer" generation and @-invocation on a claim; the Skeptic is a system actor labelled *sourced*, never certifying.
- **Progress / Reports (invariant boundary):** must **not** receive community reputation as a learning signal; the four honest signals stay independent of contribution metrics.
- **Events domain (needs / provides):** hooks for an Event Host to spawn anchored threads and promotion requests from a live session; the Events surface itself is owned there.
- **Org / Teams domain (needs):** shared-library membership and roles to scope thread visibility and participation; identifies which SME owns a shared topic's promotion queue.
- **Billing domain (referenced):** plan gating — hard-mode Skeptic answers are a Pro capability; community read/participate is available to authenticated users, guests read-only.
- **Auth / Identity (needs):** display name, avatar, and badges (e.g. "Verified Learner") for attribution and access scoping.
- **Settings / Privacy (needs):** notification preferences for replies/promotions and DSAR/deletion controls surfaced to the learner.
- **Compliance / Data-Protection (provides / needs):** exposes community posts and attribution for DSAR/export/deletion; *needs* the anonymization rules that preserve promoted-source integrity.
- **Trust & Safety (provides):** vote/reputation/promotion audit trails and abuse signals for freeze/void/revoke/ban decisions.

### Key technical requirements

- **Anchor integrity & live sync.** Threads store references to claim/source IDs, not snapshots; a low-latency subscription keeps displayed trust state and the verified-answer marker in sync with the ledger, and withdraws markers when the anchor changes. Threads must remain readable when an anchor is edited or deleted (re-anchor / "anchor changed" states).
- **Anti-abuse reputation subsystem.** A vote/reputation ledger recomputed from source events (never blind increments), with rate-limiting, self-vote prevention, client-token idempotency, and graph/behavioral analysis to detect vote-rings and flag-rings; scores must recompute on void/revocation.
- **Promotion-request pipeline.** An idempotent request queue carrying reply + citations + anchored claim + nominator, routed to the correct SME/reviewer by topic ownership, with exactly-one terminal outcome, enforced nominator≠approver at the data layer, and a callback that badges the reply and grants durable attribution on approval.
- **Moderation & audit infrastructure.** Append-only, immutable audit log for all moderation and integrity actions; roll-back-on-failed-log semantics; role-based tooling for moderators (route/lock/close/re-anchor) vs Trust & Safety (freeze/void/revoke/ban) with a hard wall against any trust-state write.
- **Offline-resilient composing.** Local autosave of reply drafts, retryable idempotent posting, and reconciliation across devices/reconnect without duplicate posts.
- **Access-scoped read model & search.** Visibility scoping across public / shared-library / private topics enforced server-side; a search/index over threads by topic, tag, and status that never leaks inaccessible content and degrades gracefully under index lag.
- **AI cost control.** The Skeptic's source-checked answer is generated via the verification spine and **cached** per claim/thread, not regenerated per view; re-checks are triggered by ledger changes, not by traffic. Hard-mode generation respects plan gating.
- **PII governance.** DSAR export and deletion pipelines that separate durable attribution (retained, anonymized) from personal content (removed), with stricter handling for minors and retried, all-or-nothing deletion semantics.
- **Accessibility.** Semantic thread hierarchy, non-color/non-emoji encoding of all trust-relevant status, keyboard-operable vote/reply/nominate controls, and polite live-region updates that stay usable under high reply volume.

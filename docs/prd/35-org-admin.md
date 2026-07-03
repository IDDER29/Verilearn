## Organization / Team Administration (seats, cohorts, assignments, roster)

### Overview

This domain owns the **B2B provisioning surface** of a VeriLearn **Teams** tenant: the admin console where an organization decides *who* is in the org, *what* shared library they learn from, *what* gets assigned to them, and *how much* of a learner's honest signals the org gets to see. It is the people-and-library half of a Teams account — seats, invites, roster, org roles, cohorts, assignments, shared-library governance, org-wide defaults, and the progress-visibility policy — sitting deliberately *beside* but *not on top of* two firewalls the product enforces in code:

1. **Money vs. people/library.** The **paid seat ceiling**, plan tier, payment method, and invoices belong to the **Billing / Finance Admin (BILLING-ADMIN)** and the Monetization/Checkout domain. This domain controls *who fills the pool and how it's used* — it can never raise the *size* of the pool. An admin allocates seats **within** a ceiling somebody else paid for.
2. **Administrative vs. epistemic power.** This is the defining constraint of the whole product and the sharpest line in this domain. An ORG-ADMIN can invite fifty learners, stand up a curriculum, and roll it out to a cohort — but **cannot move a single claim from `Sourced` to `Verified`, resolve a `Conflict`, promote a source, or fabricate a certificate or a calibration score.** Certification lives only with the Verification Pipeline, the Execution Sandbox, and the human **SME-REVIEWER**. An org can *provision, group, assign, publish-govern, and report* — it cannot *decree what is true*. The **publish/assign gate** (a topic carrying an unresolved `Disputed` claim cannot be assigned or shared) is where that firewall becomes a product behavior rather than a policy sentence.

Why it matters to the product thesis: Teams is how VeriLearn scales its honesty promise into schools, bootcamps, and regulated employers — the exact places where "the manager assigned a course full of confident-sounding errors" is a real harm. This domain lets an org inherit machine-verified trust at scale (assign only clean, sourced curriculum; read only *honest* signals for ROI, never vanity dashboards) while structurally preventing the buyer from becoming a backdoor into the ledger. It also owns the product's most delicate human tension — **manager insight vs. learner privacy** — by making progress visibility an explicit, compliance-gated policy rather than an accident of who has admin rights.

This domain **renders and governs**; it does not re-implement the behaviors it points at. The FSRS/Active-Listening/verification-depth *semantics* live in their home domains (Review, Lecture, Pipeline); the actual **Checkout transaction, plan change, and seat-ceiling purchase** live in Monetization/Billing; claim **trust states and Conflict resolution** live in Conflicts/Trust and with the SME; **SSO/identity mechanics** live in Auth/Platform. Org Administration is the single, coherent place a Teams buyer-operator *decides* provisioning, and the tenant-scoped system of record for those decisions.

### Personas involved

- **Organization / Teams Admin (ORG-ADMIN)** — the primary inhabitant and buyer-operator; owns the tenant's seats, roster, roles, cohorts, assignments, shared-library governance, org defaults, and progress-visibility policy. Every story here is either performed by or governed by this persona.
- **Team Seat Learner (LEARNER-TEAM)** — the consumer half of Teams; occupies a seat, learns inside the shared library, receives assignments into My Tasks, inherits org defaults, and is the subject of the visibility policy this domain sets. Their privacy toggles can be overlaid/locked by org policy — the tension this domain owns.
- **Instructor / Educator (INSTRUCTOR)** — a *curating* org role granted by the admin; may create/curate topics and, within granted publishing/assignment rights, assign shared-library topics to a cohort and read the four honest signals. Holds pedagogical authority but **no power to change a trust state**.
- **Event Host / Facilitator (EVENT-HOST)** — an org role the admin can grant; runs live sessions for the cohort. Touches this domain only at role-grant; the Events domain owns the rest.
- **Billing / Finance Admin (BILLING-ADMIN)** — sets the **paid seat ceiling** and plan; this domain depends on that ceiling as an upper bound and reconciles roster against it, but never changes it. Often the same human in a small org, always separable in permission.
- **Subject-Matter Expert / Content Reviewer (SME-REVIEWER)** — the epistemic authority the admin **depends on** to clear `Disputed` claims before a topic is safe to assign/publish; not part of the tenant's admin role model, and not the admin's to command.
- **Compliance / Data-Protection Officer (COMPLIANCE-DPO)** — advisory/gatekeeping over the visibility policy (can a manager lawfully see per-learner calibration? in minors/school tenants?) and over offboarding data disposition. Can constrain this domain's policies to aggregate-only; never certifies.
- **Support Agent (SUPPORT-AGENT)** — vendor-side desk that unbreaks operational provisioning state (a botched bulk invite, a stuck SSO sync, a wrongly-reclaimed seat) under scoped consent; cannot fabricate a learning signal or grant entitlements beyond courtesy limits.
- **Platform Administrator (PLATFORM-ADMIN)** — vendor-side; provisions the tenant itself, its isolation, and the SSO/SCIM plumbing this domain rides on. Operates infra; cannot read/alter epistemic content.
- **Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD)** — vendor-side; can freeze a tenant or account (rendering this console read-only) and revoke fraudulent certificates; never hand-certifies through admin tools.
- **Developer / API & Integration Consumer (DEVELOPER-API)** — integrates seat/role provisioning and SSO/SCIM into an org's identity system; bound by the rule that provisioning never mutates the ledger.
- **Accessibility-Reliant Learner (A11Y-LEARNER)** — an admin or seat-holder operating this console via assistive tech; the roster grid, seat meters, and policy toggles must be non-color-only, keyboard-operable, and screen-reader labeled.

### User stories

- **[ORG-01] As an Organization / Teams Admin (ORG-ADMIN), I want a guided first-run that lands me in an admin console after the Teams plan is active, so that I can go from an empty tenant to invited learners without guessing where to start.** — *Priority:* MVP — *Why this priority:* An empty tenant is dead spend at $9/seat; the invite→activate path has to be obvious on day one or utilization never starts.
  - *Acceptance criteria:*
    - After BILLING-ADMIN completes Checkout for Teams, the org owner lands on an **Organization** console (not the personal Dashboard) showing a setup checklist: invite people, assign roles, set org defaults, set visibility policy.
    - The console header shows tenant name, plan (Teams), **seats used / seats purchased**, and a link to Plan & billing (read-only unless the viewer is also BILLING-ADMIN).
    - Each checklist step is dismissible and re-openable; completing all four collapses the checklist but leaves the console fully functional.
  - *Business rules / validation:* The console is only reachable by users holding an org-admin role in *this* tenant; a Free/Pro individual account never sees it. The purchased seat count and plan are read from the Billing/entitlement service, not editable here.
  - *Failure & edge cases:* If the tenant is provisioned but the seat ceiling is still 0 (Checkout pending/failed), the console renders read-only with "Seats not yet provisioned — see Plan & billing" instead of an invite form. If tenant provisioning is still running (PLATFORM-ADMIN side), show a "Setting up your organization" state with a support link, never a broken console.

- **[ORG-02] As an ORG-ADMIN, I want to bulk-invite learners by pasting or uploading a list of email addresses, so that I can fill seats fast instead of adding people one at a time.** — *Priority:* MVP — *Why this priority:* Bulk invite is the core throughput action of the domain; short invite-to-first-verified-topic time is a top success criterion.
  - *Acceptance criteria:*
    - Admin can paste newline/comma-separated emails or upload a CSV, optionally with a role and cohort column; a preview lists parsed rows with per-row status before sending.
    - On send, each valid, in-ceiling row creates a **pending invite** consuming a **provisional seat**, and an invite email with a signed, expiring, single-use link goes out.
    - The roster immediately shows the new rows as **Invited**, and the seat meter reflects provisional consumption.
  - *Business rules / validation:* Total invited + active seats may never exceed the purchased ceiling (see ORG-16). Emails are validated and de-duplicated against existing members and pending invites; an org may restrict invites to allowed email domains. Default role is LEARNER-TEAM unless specified.
  - *Failure & edge cases:* A file with some malformed/duplicate/out-of-domain rows is handled as **partial success** (see ORG-19) — valid rows send, invalid rows are itemized, nothing is half-charged. If the batch would exceed the ceiling, the whole batch is held with an exact overage count rather than silently truncated. Email-delivery bounces surface on the roster row as "Invite bounced" with a resend action.

- **[ORG-03] As an ORG-ADMIN, I want a roster view of every member with their status, role, seat, and activity, so that I can manage the org at a glance and spot dormant seats.** — *Priority:* MVP — *Why this priority:* The roster is the domain's home screen; every seat, role, and offboarding action starts from it.
  - *Acceptance criteria:*
    - A searchable, filterable, sortable table lists members with: display name/email, **status** (Invited, Active, Dormant, Suspended, Removed), role, cohort(s), seat state, last-active date, and assignment/completion summary.
    - Status is non-color-only (icon + text label), and the table is keyboard-navigable and screen-reader labeled.
    - Filters include status, role, cohort, and "dormant > N days"; counts update live.
  - *Business rules / validation:* The roster is strictly tenant-scoped — an admin sees only their own tenant's members, never another org's data. "Dormant" is defined by a configurable inactivity threshold (default 30 days). Per-learner activity shown here is provisioning/utilization data (last active, seat state, completion counts), distinct from *honest signals*, which are gated by the visibility policy (ORG-11/ORG-12).
  - *Failure & edge cases:* On a large roster, the table paginates/virtualizes and never blocks on a full load; a failed data fetch shows a retry on the table only, keeping the console shell usable. If a member's underlying account was frozen by TRUST-SAFETY-LEAD, the row shows **Suspended (platform)** and admin actions on it are disabled with an explanatory tooltip.

- **[ORG-04] As an ORG-ADMIN, I want to see seats used versus purchased and allocate or free seats within that ceiling, so that I control who occupies the capacity finance paid for.** — *Priority:* MVP — *Why this priority:* Seat allocation within the ceiling is the literal thing this domain controls that BILLING does not; it is the core people/money boundary.
  - *Acceptance criteria:*
    - A seat panel shows **used / purchased** (e.g. "32 of 50"), broken down by Active, Invited (provisional), and Free.
    - Freeing a seat (removing a member or revoking an invite) returns it to the Free pool immediately and makes it re-assignable.
    - The panel links to Plan & billing to *request* more seats but never edits the ceiling here.
  - *Business rules / validation:* `active_seats + pending_invites ≤ purchased_ceiling` is an enforced invariant at every mutation. Seat allocation is transactional/idempotent so two concurrent admins can't oversell the last seat (see ORG-20). Raising the ceiling is exclusively a BILLING-ADMIN action.
  - *Failure & edge cases:* If the ceiling was lowered by billing below currently-filled seats, this panel enters a **reconciliation** state (see ORG-17) rather than showing an impossible negative free count. If the entitlement service is unreachable, seat mutations are blocked (fail-closed) with a clear "can't verify seat availability right now" message rather than risking an oversell.

- **[ORG-05] As an ORG-ADMIN, I want to resend, revoke, and track the expiry of pending invites, so that unaccepted invites don't silently tie up paid seats.** — *Priority:* Should-Have — *Why this priority:* Invite hygiene directly protects utilization, but it is a refinement of the core invite flow rather than the flow itself.
  - *Acceptance criteria:*
    - Each Invited row exposes **Resend** (issues a fresh token, resets expiry) and **Revoke** (invalidates the token and frees the provisional seat).
    - Pending invites show time-to-expiry; expired invites auto-transition to **Expired** and release their provisional seat back to Free.
    - A bulk "resend all pending older than N days" action is available.
  - *Business rules / validation:* Invite tokens are single-use and expiring (default 14 days); a revoked or expired token cannot activate an account. Resending does not consume an additional seat. Revoking an already-accepted invite is not possible — that path is member removal (ORG-14).
  - *Failure & edge cases:* If a learner clicks a **revoked/expired** link, they see a neutral "this invitation is no longer valid — contact your org admin" page, never account access. A race where the invite is accepted at the same moment the admin revokes it resolves deterministically (accept-wins if it committed first, otherwise revoke-wins) and the roster reflects the true outcome.

- **[ORG-06] As an ORG-ADMIN, I want to assign org roles (Team Learner, Instructor/curator, Event Host, and co-admin), so that curation, teaching, and administration are delegated under least privilege.** — *Priority:* MVP — *Why this priority:* Roles are the tenant's permission model; assignments, publishing rights, and visibility all hang off correct role scoping.
  - *Acceptance criteria:*
    - Admin can set/change a member's role from the roster; role change takes effect on the member's next authenticated action and is written to the audit log.
    - Each role's granted capabilities are shown inline (e.g. Instructor: create/curate topics, assign within granted library, read cohort honest signals; Event Host: run events for a cohort).
    - Co-admin can be granted and revoked; the current admin cannot revoke the last remaining admin (see ORG-20).
  - *Business rules / validation:* Roles are **separable and least-privilege**: no org role can certify claims, resolve Conflicts, promote sources, set price, raise the seat ceiling, or read another tenant. Instructor publishing/assignment rights are a *grant*, not inherent. Elevating a seat to Instructor/Event-Host does not consume an extra seat but may be governed by org policy.
  - *Failure & edge cases:* Demoting an Instructor who owns published shared-library topics does not orphan those topics — ownership transfers to the org (or a named successor) with an audit entry. A role change that would remove a capability mid-action (e.g. an Instructor mid-assignment) completes or safely aborts the in-flight action rather than corrupting it.

- **[ORG-07] As an ORG-ADMIN or Instructor, I want to organize members into cohorts/groups, so that I can assign curriculum and read progress at the group level.** — *Priority:* Should-Have — *Why this priority:* Cohorts make assignment and reporting scale to real class/team sizes, but a small org can operate flat before needing them.
  - *Acceptance criteria:*
    - Admin/Instructor can create named cohorts, add/remove members, and a member may belong to multiple cohorts.
    - Cohort views show membership, assigned topics, and (per visibility policy) aggregated progress.
    - Bulk-invite and role tools can target a cohort directly.
  - *Business rules / validation:* Cohorts are tenant-scoped organizational metadata only — they never alter a learner's trust ledger, gap map, or calibration. Instructors can manage only cohorts they own or are granted; admins manage all. A member removed from a cohort keeps their own learning history; only the grouping changes.
  - *Failure & edge cases:* Deleting a cohort with active assignments prompts for disposition (keep assignments as individual, or withdraw them — see ORG-08) rather than silently dropping learner tasks. Adding a not-yet-active (Invited) member to a cohort is allowed; assignments queue and activate when the learner accepts.

- **[ORG-08] As an ORG-ADMIN or Instructor, I want to assign shared-library topics to a cohort or individual with an optional due date, so that learners get a clear, verified curriculum in their queue.** — *Priority:* MVP — *Why this priority:* Assignment is the mechanism that turns a shared library into directed learning and is named in this domain's title; it's the reason Teams beats "just share a link."
  - *Acceptance criteria:*
    - Assigning a published topic to a cohort/learner creates entries in each learner's **My Tasks** with the topic, optional due date, and an "assigned by <org>" attribution.
    - The assigner sees assignment status roll up (not started / in progress / completed / overdue) per cohort, subject to the visibility policy.
    - Due dates are interpreted in each learner's own timezone for "due today" boundaries.
  - *Business rules / validation:* **Only assignable if the topic passes the publish/assign gate** — no unresolved `Disputed` claims (see ORG-18). Assignment does not copy or fork the topic's ledger; learners inherit the *same* verified trust states. Assigner must hold assignment rights for that library scope.
  - *Failure & edge cases:* If a topic's trust state changes to `Disputed` *after* assignment (e.g. a Skeptic re-run or a new Conflict), already-assigned learners keep access but new assignments are blocked and the assigner is notified that the curriculum needs SME attention. Assigning to an Invited (not-yet-active) learner queues the task for activation. Withdrawing an assignment removes the task without deleting any progress the learner already made.

- **[ORG-09] As an ORG-ADMIN, I want to govern the shared topic library — publish clean topics, set publishing rights, and archive or unshare stale ones — so that the org learns only from a curated, trustworthy library.** — *Priority:* MVP — *Why this priority:* A clean shared library with honest trust bars is the core Teams value-add and the main artifact this domain governs.
  - *Acceptance criteria:*
    - Admin can publish an Instructor-curated topic into the shared library, review its **trust bar** at a governance level, and set who may publish/assign into the library.
    - Admin can archive/unshare a topic (removing it from new assignment) while preserving the learning history of anyone who already studied it.
    - The library view flags topics carrying open `Disputed` claims as **Not publishable — needs SME**.
  - *Business rules / validation:* **Governance is not authorship of the ledger** — the admin decides *whether/where* a topic is shared, never *what a claim's trust state is*. A topic with any unresolved `Disputed` claim cannot be published (routes to SME). Unsharing does not delete the topic or its ledger; it revokes shared visibility going forward.
  - *Failure & edge cases:* Archiving a topic that has active assignments prompts to withdraw or grandfather those assignments rather than breaking learners' in-progress tasks. If the trust-ledger service can't confirm a topic's `Disputed` count at publish time, publishing **fails closed** ("can't verify this topic is clean right now") rather than shipping potentially-disputed content to a cohort.

- **[ORG-10] As an ORG-ADMIN, I want to set org-wide learning defaults (Active Listening prompts, FSRS target retention, gate policy), so that new seats start from a consistent, sensible baseline.** — *Priority:* Should-Have — *Why this priority:* Consistent defaults improve cohort comparability and reduce per-learner setup, but learners can function on product defaults if this ships later.
  - *Acceptance criteria:*
    - Admin sets defaults for the settings that have org-level meaning (Active Listening prompt set, FSRS target retention and daily limits, active-listening gate strictness); new members inherit them.
    - Admin can choose per default whether it is a **suggested default** (learner may override) or a **locked policy** (learner cannot override).
    - Changing a default offers to apply to existing members or to new members only.
  - *Business rules / validation:* These defaults set *future* behavior only and **never mutate an existing ledger, calibration history, or gap map** — same invariant the Settings domain enforces. The *semantics* of each toggle live in their home domains (Review, Lecture); this domain only sets the tenant-level value and lock state.
  - *Failure & edge cases:* Locking a default that a learner had already customized preserves the learner's data but overrides the *setting*; the learner is notified their org set a policy. Conflicting locks (e.g. a stricter compliance-imposed constraint) resolve in favor of the more restrictive rule.

- **[ORG-11] As an ORG-ADMIN, I want to set a progress-visibility and leaderboard policy for the tenant, so that manager insight and learner privacy are balanced by an explicit, auditable decision.** — *Priority:* MVP — *Why this priority:* This is the domain's signature tension; leaving visibility implicit would either expose learners' weaknesses by accident or blind managers to ROI — both unacceptable.
  - *Acceptance criteria:*
    - Admin selects a visibility level: **Aggregate-only** (default), **Per-cohort aggregate**, or **Per-learner** (admin/instructor may see an individual's honest signals), plus a leaderboard on/off toggle.
    - The chosen policy **overlays and can lock** the corresponding learner privacy toggles in Settings, and learners are shown what their org can see.
    - The policy choice, who set it, and when, are written to the audit log.
  - *Business rules / validation:* Per-learner visibility of *honest signals* (Retention/Transfer/Calibration/Drill) is available to admin/instructor **only if** the policy allows it **and** COMPLIANCE-DPO has not blocked it for this tenant (minors/jurisdiction — see ORG-21). Aggregate reporting must respect a minimum-cohort-size (k-anonymity) threshold so "aggregate" can't de-anonymize a single learner. Certificates and completion counts are considered org-owned outcomes and are visible regardless of the honest-signal policy.
  - *Failure & edge cases:* If an admin selects Per-learner in a tenant where compliance requires aggregate-only, the option is disabled with the reason shown, not silently ignored. A cohort smaller than the k-threshold shows "not enough learners to report anonymously" rather than a leak-prone aggregate.

- **[ORG-12] As an ORG-ADMIN, I want a tenant dashboard of aggregated honest signals plus completions and certificates, so that I can prove ROI to the buyer with earned signals, not vanity metrics.** — *Priority:* Should-Have — *Why this priority:* ROI reporting drives renewal (the truest success signal), but it consumes the Analytics domain's signals rather than defining them, so it can follow the core provisioning.
  - *Acceptance criteria:*
    - Dashboard shows org-wide and per-cohort **Retention, Transfer, Calibration, and Drill-detection** trends plus certificate and completion counts and seat utilization.
    - Drill-down to an individual's signals is available **only** when the visibility policy permits (ORG-11).
    - Reports are exportable for the buyer (respecting the same visibility gating).
  - *Business rules / validation:* Honest signals are read-only, tenant-scoped, and computed by the Analytics/Reports domain — this domain **cannot fabricate or edit** any signal, certificate, or calibration figure (the firewall). No vanity metrics (streaks-as-KPIs, raw time-on-app) are elevated to ROI headline status. Certificates shown are only those whose questions came from verified/sourced claims.
  - *Failure & edge cases:* If signal computation is delayed or partial, the dashboard labels figures as provisional with an "as of" timestamp rather than showing stale numbers as current. A certificate revoked by TRUST-SAFETY-LEAD disappears from the org's earned-cert count with an audit note, never silently inflating ROI.

- **[ORG-13] As an ORG-ADMIN, I want to see seat utilization and reclaim dormant seats with activation nudges, so that the org isn't paying $9/seat for people who never showed up.** — *Priority:* Should-Have — *Why this priority:* Utilization is a named pain point and protects spend, but it's an optimization on top of a working roster/seat model.
  - *Acceptance criteria:*
    - A utilization view surfaces never-activated invites and dormant (inactive > threshold) active seats, with a one-click **nudge** (reminder email) and a **reclaim seat** action.
    - Reclaiming a seat frees it to the pool and moves the member to a Removed/offboarded state per the offboarding flow (ORG-14).
    - Utilization is summarized as an activation rate and idle-seat count for the buyer.
  - *Business rules / validation:* Reclaiming an *active* learner's seat is treated as offboarding (data-disposition rules apply) — it is not a silent kick. Nudges are rate-limited to avoid spamming learners. The "dormant" threshold is the same configurable value used on the roster.
  - *Failure & edge cases:* A learner who is *mid-session* when their seat is reclaimed is not hard-cut mid-lecture; access ends gracefully at a safe boundary with their progress preserved for the retention window. Reclaiming and re-inviting the same person is idempotent and does not double-charge a seat.

- **[ORG-14] As an ORG-ADMIN, I want to offboard a departing member and decide the disposition of their data, so that access ends cleanly and their gap map, certificates, and personal topics are handled deliberately.** — *Priority:* MVP — *Why this priority:* Ambiguous offboarding is a named pain point with real compliance stakes; a clean, explicit disposition is table stakes for regulated Teams buyers.
  - *Acceptance criteria:*
    - Removing a member revokes their access and frees the seat, and presents a **data-disposition** choice: transfer org-owned topics to another member/the org, archive, or delete personal topics per policy.
    - **Earned certificates are retained** (as credential records) by default and are never silently deleted by an offboard.
    - The action and its disposition choice are audit-logged.
  - *Business rules / validation:* Data disposition follows the retention/compliance policy set with COMPLIANCE-DPO; the org (controller) owns org-created shared content, the learner owns their personal learning data — the split is applied here. Certificate *revocation* (integrity) and record *deletion* (privacy) are distinct levers and neither is performed casually by offboarding. Shared-library topics authored by the leaver do not vanish from the library — ownership transfers.
  - *Failure & edge cases:* If a full data deletion is requested, it must reach **derived** data (calibration, gap map, promoted-into-source contributions) via the Compliance/DSAR path, not just the account row — the admin initiates, but execution honors the derived-data reach and legal-hold checks. Offboarding a member under an active fraud hold (TRUST-SAFETY-LEAD) blocks deletion pending investigation while still revoking access.

- **[ORG-15] As an ORG-ADMIN, I want SSO/SCIM directory provisioning to auto-create seats and roles from our identity provider, so that roster management scales without manual invites.** — *Priority:* Nice-to-Have — *Why this priority:* High value for large enterprise tenants but not required for a small Teams org to succeed; the manual invite flow covers MVP.
  - *Acceptance criteria:*
    - When SSO/SCIM is configured (by PLATFORM-ADMIN/DEVELOPER-API), directory group membership maps to org roles and seat provisioning happens just-in-time on first sign-in, within the ceiling.
    - Directory deprovisioning triggers this domain's offboarding flow (access revoked, seat freed, disposition per policy).
    - The roster marks SSO-provisioned members as managed by the IdP (email and role are read-only locally).
  - *Business rules / validation:* JIT provisioning still respects the seat ceiling — the IdP cannot oversell seats. Role mapping is least-privilege and cannot grant epistemic or billing powers. Identity mechanics are owned by Auth/Platform; this domain consumes the provisioning events.
  - *Failure & edge cases:* If a directory sync would exceed the ceiling, excess users are **queued/denied provisioning** with an alert to the admin and BILLING-ADMIN, not silently overselling. A partial/broken SCIM sync surfaces as a reconciliation banner with a SUPPORT-AGENT path, and existing members are never mass-deprovisioned by a single failed sync.

- **[ORG-16] As an ORG-ADMIN, I want to be blocked with a clear path when I try to invite past the purchased seat ceiling, so that I never accidentally oversell seats I can't pay for or lock people out.** — *Priority:* MVP — *Why this priority:* This is the money/people firewall as a concrete guardrail; getting it wrong either oversells (billing chaos) or blocks growth silently.
  - *Acceptance criteria:*
    - An invite/batch that would push `active + pending > ceiling` is rejected before sending, showing the exact overage (e.g. "3 seats short").
    - The admin is offered a **request more seats** handoff to Plan & billing/BILLING-ADMIN — never a self-service ceiling raise.
    - Optionally, over-ceiling invites can be saved as a **waitlist** that auto-sends when seats free up or the ceiling rises.
  - *Business rules / validation:* The seat ceiling is owned solely by BILLING-ADMIN/Monetization; this domain enforces `filled ≤ ceiling` as a hard invariant and can never mutate the ceiling. Provisional (pending-invite) seats count against the ceiling.
  - *Failure & edge cases:* If the ceiling is raised while a waitlist exists, waitlisted invites auto-send in order up to the new ceiling, transactionally, without overshooting. If two admins each try to consume the last seat, exactly one succeeds and the other gets the shortfall message (see ORG-20).

- **[ORG-17] As an ORG-ADMIN, I want a graceful reconciliation when the seat ceiling drops below the number of filled seats, so that a billing downgrade or failed payment never abruptly locks out active learners mid-track.** — *Priority:* Should-Have — *Why this priority:* Failed-payment/downgrade lockouts are a named pain point with deadline-bound learners at stake; graceful handling protects both learners and the brand.
  - *Acceptance criteria:*
    - When billing lowers the effective ceiling below filled seats, the console enters a **reconciliation** state showing the overage and a grace window.
    - The admin chooses which seats to suspend (with suggestions like "dormant first"), rather than the system silently kicking arbitrary learners.
    - Suspended learners lose *new* access at the grace boundary but their data is preserved for the retention window; active deadline-bound tracks can be flagged to prioritize retention.
  - *Business rules / validation:* No learner data is deleted by a ceiling reduction — only access changes. Dunning/failed-payment state is owned by Billing; this domain reacts to the entitlement change, it does not resolve the payment. Suspensions are reversible if the ceiling is restored within the retention window.
  - *Failure & edge cases:* If the admin does not choose within the grace window, the system applies the documented default (suspend dormant/last-activated first) and notifies affected learners — never a random cut. If the ceiling drop is due to a transient billing error that self-corrects, suspensions are rolled back automatically.

- **[ORG-18] As an ORG-ADMIN, I want to be prevented from assigning or publishing a topic that still carries an unresolved Disputed claim, so that I can't push confident-sounding but contested content onto a cohort.** — *Priority:* MVP — *Why this priority:* This is the administrative/epistemic firewall made into a hard gate — the single most important behavior separating VeriLearn Teams from "an LMS full of AI slop."
  - *Acceptance criteria:*
    - Attempting to publish/assign a topic with any open `Disputed` claim is blocked with a specific reason ("2 claims are Disputed — needs SME review before this can be assigned").
    - The block offers to **route the topic to an SME-REVIEWER** (or notify one), but gives the admin **no override** to force-publish.
    - Once the SME clears the Conflicts, the topic becomes publishable/assignable automatically and the admin is notified.
  - *Business rules / validation:* The admin **cannot resolve the Conflict, re-tag the claim, or override the gate** — certification is SME/pipeline-only. The gate reads live trust-ledger state at publish/assign time. `Interpretive` claims (positions mapped, not certified) are publishable per policy since they are honestly labeled, but `Disputed` are not.
  - *Failure & edge cases:* If the SME queue is backed up, the admin sees the topic's pending status but still cannot bypass — the honest answer is "not yet," not a forced pass. If a claim flips to `Disputed` after publish, new assignments halt (ORG-08) while existing learners are warned the section is under review.

- **[ORG-19] As an ORG-ADMIN, I want partial-success handling on a bulk invite with bad rows, so that a few malformed or duplicate entries don't fail the whole batch or double-consume seats.** — *Priority:* Should-Have — *Why this priority:* Real CSVs are messy; all-or-nothing failure makes bulk invite unusable at scale, but it's a robustness refinement on the ORG-02 happy path.
  - *Acceptance criteria:*
    - The batch validates every row and reports per-row outcomes (sent / duplicate / invalid email / out-of-domain / over-ceiling), sending the valid rows and itemizing the rest.
    - Duplicates against existing members/pending invites are skipped, not re-invited or re-charged a seat.
    - A downloadable error report lists the failed rows with reasons for correction and re-upload.
  - *Business rules / validation:* Seat consumption is **idempotent** — re-uploading a corrected file never double-allocates seats for rows that already succeeded. The over-ceiling subset is handled per ORG-16 (held/waitlisted), independent of the malformed subset.
  - *Failure & edge cases:* If the upload itself is corrupt/oversized/wrong-format, it's rejected before any invite is sent, with no partial state. If email delivery fails for some successfully-created invites, those rows show "created, delivery failed — resend," distinguishing creation from delivery.

- **[ORG-20] As an ORG-ADMIN, I want concurrency and last-admin protections on roster and role changes, so that two admins editing at once can't corrupt seats and no one can orphan the tenant.** — *Priority:* Should-Have — *Why this priority:* Multi-admin orgs are common; without these guards you get oversold seats, lost updates, or a tenant with zero admins — all hard to recover from.
  - *Acceptance criteria:*
    - Concurrent seat allocations are serialized so the ceiling invariant holds; a losing writer gets a clear conflict message and refreshed state, not a silent overwrite.
    - The system refuses to remove or demote the **last remaining admin**, and refuses a self-removal that would leave the tenant admin-less.
    - Role/roster edits use optimistic concurrency (version checks) so stale edits are rejected with the current value shown.
  - *Business rules / validation:* At least one active org-admin must exist at all times per tenant. Seat allocation is transactional (no oversell under race). Every mutation records actor + timestamp for audit.
  - *Failure & edge cases:* If the sole admin's account is frozen by TRUST-SAFETY-LEAD, tenant admin actions route to a vendor-side recovery/SUPPORT path rather than leaving the tenant permanently stuck. A network partition mid-edit resolves on reconnect to a single consistent state, never a duplicated seat.

- **[ORG-21] As a Compliance / Data-Protection Officer (COMPLIANCE-DPO), I want to constrain the org's visibility policy for minor/regulated tenants, so that a manager can't lawfully-improperly see per-learner data the jurisdiction forbids.** — *Priority:* Should-Have — *Why this priority:* FERPA/COPPA/GDPR exposure in school and regulated Teams tenants is a real legal risk that the self-serve visibility policy (ORG-11) must not be able to override.
  - *Acceptance criteria:*
    - Compliance can mark a tenant (or cohort) as minor/regulated, which **forces aggregate-only** visibility and disables Per-learner honest-signal options in the admin console.
    - The constraint is shown to the ORG-ADMIN as a locked policy with its basis ("restricted for minor safeguarding"), not silently applied.
    - Consent basis and retention constraints for the tenant are recorded and auditable.
  - *Business rules / validation:* Compliance holds **advisory/gatekeeping** authority over personal data and visibility — it can *restrict* the org policy but **cannot certify claims, ban, or operate infra**. Compliance constraints always win over an admin's looser choice (most-restrictive-wins). Certificate records follow retention rules distinct from visibility.
  - *Failure & edge cases:* If a tenant is re-classified from regulated to standard, previously-hidden per-learner data does not retroactively expose without a fresh, logged policy decision. A conflict between an org's desired Per-learner leaderboard and a minor-safeguarding lock resolves to the lock, with the reason surfaced to the admin.

- **[ORG-22] As an ORG-ADMIN, I want an audit log of administrative actions in my tenant, so that seat, role, assignment, and policy changes are accountable and reviewable.** — *Priority:* Nice-to-Have — *Why this priority:* Accountability matters for enterprise trust and dispute resolution, but the tenant can operate before a full audit UI ships (actions are logged server-side regardless).
  - *Acceptance criteria:*
    - The log records invites, seat allocations, role changes, assignments, library publish/unshare, default and visibility-policy changes, and offboarding dispositions, each with actor, target, timestamp, and before/after.
    - The log is filterable by actor, target member, and action type, and is exportable.
    - Entries are read-only (append-only) and cannot be edited or deleted by any org role.
  - *Business rules / validation:* The audit log is tenant-scoped and never exposes another tenant's actions. It records *administrative* events only — it is not a window into learners' epistemic content or honest signals beyond what the visibility policy already permits. Vendor-side actions (TRUST-SAFETY freeze, SUPPORT repair) appear as attributed platform entries where they touch the tenant.
  - *Failure & edge cases:* If audit writes fail, the underlying administrative mutation is still committed but flagged for backfill (availability over losing the action), with an integrity alert — the log never blocks essential provisioning. Tampering attempts are rejected and themselves logged.

### Business rules & invariants

- **Administrative ≠ epistemic (the master firewall).** No org role — admin, co-admin, or instructor — can set/upgrade a claim's trust state, resolve a `Conflict`, promote a source, or fabricate a certificate, calibration, retention, or gap-map value. Certification is exclusively the Verification Pipeline, Execution Sandbox, and SME-REVIEWER.
- **Publish/assign gate.** A topic carrying any unresolved `Disputed` claim is not assignable or shareable; it routes to an SME and there is no admin override. `Verified·*`, `Sourced`, and `Interpretive` (honestly labeled) content is assignable per policy.
- **Money ≠ people/library.** The **paid seat ceiling** and plan are owned by BILLING-ADMIN/Monetization. This domain enforces `active_seats + pending_invites ≤ purchased_ceiling` at every mutation and can allocate within the ceiling but never raise it.
- **Tenant isolation.** Every read and write in this domain is scoped to one tenant; an admin can never see or affect another org's roster, library, seats, or signals.
- **Least privilege & separation of duties.** Spending (BILLING), provisioning (ORG-ADMIN), epistemic (SME), and vendor operations (PLATFORM/T&S/SUPPORT/COMPLIANCE) are separable permissions that never leak into one another, even when one human holds several hats.
- **Visibility is an explicit, gated policy.** Per-learner honest-signal visibility requires both an org policy allowing it and no compliance restriction; aggregate reporting respects a minimum-cohort (k-anonymity) threshold; the default is aggregate-only. Certificates/completions are org-owned outcomes and visible regardless.
- **Defaults tune the future, never the past.** Org-set defaults and locks affect subsequent behavior only; they never mutate an existing ledger, calibration history, or gap map.
- **No orphaned tenant.** At least one active admin must exist per tenant at all times; content ownership transfers rather than orphaning when its owner is demoted/removed.
- **Access changes, not data loss.** Seat suspension, ceiling reduction, dormancy reclaim, and offboarding change *access*; data deletion is a separate, compliance-governed action reaching derived data, subject to legal holds and certificate-retention rules.
- **Everything is audited.** Every administrative mutation records actor, target, timestamp, and before/after in an append-only log.
- **Idempotent, transactional provisioning.** Seat allocation and bulk invites are transactional and idempotent so concurrency and retries never oversell seats or double-charge.

### Cross-domain dependencies

- **Monetization / Billing (BILLING-ADMIN):** *needs* the purchased seat ceiling, plan tier, entitlements (hard-mode availability), and dunning/entitlement-change events; *provides back* utilization/roster reality for right-sizing. This domain never executes Checkout or edits the ceiling.
- **Auth / Platform (PLATFORM-ADMIN, DEVELOPER-API):** *needs* tenant provisioning + isolation, invite-token issuance/acceptance, and SSO/SCIM identity + deprovisioning events; *provides* role-to-directory mappings to consume. Identity mechanics are owned upstream.
- **Conflicts & Trust / Pipeline / SME-REVIEWER:** *needs* live per-topic trust-bar and `Disputed`-claim state for the publish/assign gate and an SME routing/notification path; *provides* topics-to-review pressure. This domain reads trust state, never writes it.
- **Settings & Privacy:** *needs* the toggle semantics (FSRS, Active Listening, verification depth) whose org-level defaults it sets, and the learner privacy toggles its visibility policy overlays/locks; *provides* the org policy that constrains the LEARNER-TEAM settings surface.
- **Review, Lecture, Tasks, My Tasks:** *provides* assignments that fan out into learners' **My Tasks** with due dates in learner timezones; *inherits* the same ledger and behaviors defined there.
- **Analytics / Reports:** *needs* computed honest signals, certificate/completion counts, scoped to tenant and cohort; *provides* cohort grouping and the visibility policy that gates drill-down. It never fabricates a signal.
- **Events (EVENT-HOST):** *provides* the EVENT-HOST role grant; the Events domain owns session mechanics.
- **Compliance / Data-Protection (COMPLIANCE-DPO):** *needs* retention/consent policy, minor/regulated classification, and DSAR/deletion execution for offboarding disposition; *provides* the tenant policies compliance advises on and can restrict (visibility, data reach).
- **Trust & Safety (TRUST-SAFETY-LEAD) & Support (SUPPORT-AGENT):** *needs* the ability to have a tenant/account frozen (rendering this console read-only) and to hand off botched-provisioning repair under scoped consent; *provides* audit-attributed hooks for those vendor-side actions.

### Key technical requirements

- **Multi-tenant data model with hard isolation.** Row-level tenant scoping on every entity (members, seats, invites, roles, cohorts, assignments, library grants, policies, audit); tenant-scoped RBAC with separable, least-privilege roles and a "sole-admin" guard.
- **Seat/entitlement service as reconciled source of truth.** Transactional, idempotent seat allocation with an enforced `filled ≤ ceiling` invariant; the ceiling is read from the Billing/entitlement service, and ceiling-change events drive reconciliation (ORG-17). Concurrency via optimistic version checks and serialized seat-mutation transactions to prevent oversell under race.
- **Invite subsystem.** Signed, single-use, expiring invite tokens; email delivery with bounce/complaint handling surfaced on the roster; waitlist queue that auto-flushes on ceiling/seat availability; provisional-seat accounting so pending invites count against the ceiling.
- **SSO/SCIM provisioning integration.** SAML/OIDC sign-in and SCIM directory sync for JIT seat/role provisioning and deprovisioning, respecting the ceiling and least-privilege role mapping; managed-attribute (email/role) read-only locally for IdP-managed members; resilient partial-sync handling (never mass-deprovision on one failed sync).
- **Publish/assign gate integration.** A live query against the trust-ledger service for a topic's `Disputed` count at publish/assign time, failing **closed** if the state can't be confirmed; SME routing/notification hook; re-evaluation when trust states change post-assignment.
- **Assignment fan-out.** Scheduled creation of per-learner My-Tasks entries with due dates resolved in each learner's timezone; withdrawal that removes tasks without deleting progress; queuing for not-yet-active (Invited) members.
- **Privacy-preserving aggregation.** Honest-signal roll-ups computed by Analytics with a minimum-cohort (k-anonymity) threshold enforced before any "aggregate" is shown; per-learner drill-down gated by policy + compliance classification; no vanity metrics elevated to ROI.
- **Offboarding & data-disposition workflows.** Access revocation decoupled from data deletion; ownership-transfer of org-authored content; derived-data-aware deletion routed through the Compliance/DSAR path with legal-hold and certificate-retention checks; grace windows and reversibility for suspensions.
- **Append-only audit log.** Durable, tamper-evident, tenant-scoped audit of all administrative mutations with actor/target/timestamp/before-after; availability-first write path (mutation succeeds and backfills if the log write fails) with an integrity alert.
- **Performance & UX.** Roster reads paginated/virtualized for large tenants; bulk invite processed as an async job with progress and a downloadable per-row error report; console reads fast and fail-soft (per-panel retry, shell always usable); admin console fully accessible (keyboard, screen-reader labels, non-color-only status).

## Personas — Organizations & Platform Administration

These personas hold administrative and operational power over VeriLearn — over the organizations that buy it and over the platform itself — but almost none of them ever touch a topic to learn it. The cluster is organized around **two firewalls that a verification-first product has to enforce in code, not just policy**:

1. **Customer vs. vendor.** Some personas operate *inside a single org's tenant* (the buyer's seats, library, money) and can see nothing else; others are *VeriLearn staff operating across all tenants* (support, ops, integrity, compliance) and must not casually read a customer's learning data.
2. **Administrative power vs. epistemic power.** This is the defining constraint of the whole cluster. The person who *paid for everything*, the root operator who can *restart the pipeline*, and the trust-&-safety lead who can *ban anyone on the platform* — **none of them can move a single claim from `Sourced` to `Verified`.** Certification lives only with the pipeline, the execution sandbox, and the human **SME-REVIEWER** (Educators cluster). Administrators can provision, bill, unbreak, operate, quarantine, revoke, and govern — but a product whose entire value proposition is *honest, earned trust signals* cannot let anyone **decree** what is true. Every "Can't" below traces back to that line.

| Persona | Side | Authority it holds | Authority it deliberately lacks |
| --- | --- | --- | --- |
| Organization / Teams Admin | Customer | Provisioning: seats, invites, roles, shared-library governance, org defaults, progress-visibility policy | Cannot certify claims, set price, or see other tenants |
| Billing / Finance Admin | Customer | Financial: plan, spend, seat ceiling, invoices, Checkout | Cannot decide *who* fills seats or touch any content |
| Support Agent | Vendor | Assisted service: scoped/consented account access, unbreak operational state | Cannot fabricate learning signals, certify, or gift certificates |
| Platform Administrator | Vendor | Operational/root: tenants, pipeline & sandbox, model rollouts, role model | Cannot read/alter epistemic content or set trust states |
| Trust & Safety / Ledger Integrity Lead | Vendor | Integrity & abuse: ban, quarantine, revoke fraud, ledger-gaming defense, policy | Cannot hand-certify a claim; must freeze then route to SME |
| Compliance / Data-Protection Officer | Vendor (+ customer counterpart) | Data governance & credential compliance: DSAR, retention, privacy, cert audit | Cannot certify, operate infra, or ban; advisory/gatekeeping only |

A person can wear more than one hat (in a five-seat startup, the ORG-ADMIN *is* the BILLING-ADMIN), but the **permissions are separable** so that spending authority, provisioning authority, operational authority, integrity authority, and — above all — epistemic authority never leak into one another.

---

### Organization / Teams Admin (ORG-ADMIN)

**Purpose.** The B2B buyer-operator of a **Teams** plan — an L&D manager, bootcamp operator, engineering manager, or department head who bought VeriLearn for a group and owns the org's tenant: its seats, its shared topic library, its people, and its policies. In a verification-first product their distinctive job is *not* to teach or to certify — it is to decide **who** is in the org, **what** library they share, and **how much** of a learner's honest signals the org gets to see, while trusting that every content trust state was set by the pipeline and SMEs, never by them.

**Goals.**
- Fill seats with the right learners fast (invite → activate) and keep utilization high — no paid-for empty seats at $9/seat.
- Stand up a shared topic library that is clean — topics whose trust bar carries no unresolved `Disputed` claims — and govern who may curate and publish into it.
- Set org-wide defaults (Active Listening prompts, FSRS target retention, gate policy) and a **progress-visibility policy** that balances manager insight against learner trust.
- Prove ROI to whoever signed the check with completions, certificates, and *honest-signal* movement — not vanity dashboards.

**Responsibilities.**
- Provision/deprovision seats; send and revoke invites; assign org roles (plain **LEARNER-TEAM**, a curating **INSTRUCTOR**, an **EVENT-HOST**).
- Own the shared topic library at the governance level: decide publishing rights, archive stale topics — but never re-tag a claim.
- Configure org defaults and the leaderboard/visibility policy (e.g. whether a learner's calibration dip is visible to their manager), directly resolving the privacy tension **LEARNER-TEAM** feels.
- Liaise with **BILLING-ADMIN** on seat counts and renewals, and with a vendor **SUPPORT-AGENT** on tenant issues.

**Permissions (can / can't).**
- **Can:** invite/remove members; assign org roles; allocate seats within the purchased ceiling; configure org-wide gate / FSRS / Active-Listening defaults; set the progress-visibility and leaderboard policy; govern shared-library publishing rights; archive or unshare team-owned topics; view aggregated honest signals, and — per the visibility policy they themselves set — per-learner signals.
- **Can't:** change a claim's trust state, resolve a **Conflict**, or promote a source (**SME-REVIEWER**); raise the *paid* seat count or change plan (**BILLING-ADMIN** holds the money authority); read another org's tenant or any platform-wide data (vendor-side only); fabricate a certificate or a learner's calibration. Administrative reach stops at the epistemic firewall.

**Pain points.**
- Seat utilization vs. cost: paying per seat for dormant learners; wants activation nudges and a reclaim-unused-seat flow.
- The publish-gate bites: they want to roll out a curriculum *today*, but a topic still carries an open `Disputed` claim, and clearing it needs an SME they may not even employ — the SME queue is not theirs to command.
- Privacy politics: managers want per-learner calibration; learners don't want weaknesses exposed. The admin sets the policy and owns the fallout in either direction.
- Ambiguous data ownership at offboarding: when a learner leaves, what happens to their gap map, certificates, and the personal topics they spun up on the org's seat?

**Success criteria.**
- High seat activation/utilization; short invite-to-first-verified-topic time.
- A shared library with clean trust bars; a low share of assigned topics blocked by open Conflicts.
- Org-wide honest-signal movement (Retention / Transfer / Calibration up) and certificates the org trusts *because every question was drawn from sourced claims*.
- Renewal and seat expansion — the truest ROI signal.

**Typical workflows.**
1. *Onboard the org:* accept the plan (with BILLING-ADMIN) → bulk-invite learners → assign INSTRUCTOR/curator and EVENT-HOST roles → set org defaults and the visibility policy.
2. *Stand up the library:* curators create topics → the six-stage pipeline runs → the admin reviews trust bars at a governance level → publishes clean topics to the shared library, routing any with open `Disputed` claims to an SME before rollout.
3. *Manage the roster:* reclaim dormant seats, re-invite, offboard leavers (deciding data disposition), keep utilization high.
4. *Quarterly:* pull aggregated honest signals + certificate counts for the buyer, adjust defaults, expand seats via BILLING-ADMIN.

**Relationships.**
- **Hands off to** LEARNER-TEAM (seats, shared library, visibility policy — the primary boundary carried over from the Learners cluster) and INSTRUCTOR (publishing rights on the shared library).
- **Depends on** SME-REVIEWER to clear Conflicts before a topic is safe to publish, and on BILLING-ADMIN for the seat ceiling and plan.
- **Depends on** vendor-side SUPPORT-AGENT and PLATFORM-ADMIN for tenant health; **conflicts with** its own learners over the progress-visibility policy — a tension it owns by design.

---

### Billing / Finance Admin (BILLING-ADMIN)

**Purpose.** The money authority for an org's account — a finance or procurement owner (often the same human as ORG-ADMIN in a small team, deliberately separate in a large one) who owns **Plan & billing**, the paid seat ceiling, invoices, and the **Upgrade → Checkout → Success** flow, but touches neither the content nor the people-level provisioning. Split from ORG-ADMIN for the same reason the Educators cluster splits authorities: whoever *pays for* capacity should not automatically be whoever *decides pedagogy* or *certifies truth*.

**Goals.**
- Cost predictability: know exactly what the org owes, on what cycle (the monthly/annual toggle at Checkout), for how many seats at $9/seat.
- Zero waste: pay for seats that are actually used; right-size the ceiling to the utilization ORG-ADMIN reports.
- Clean, auditable invoices and receipts for finance; a smooth plan-change/renewal path that never disrupts an active learner mid-track.
- Understand what the tiers buy (Free 3 topics / Pro $12 hard-mode / Teams $9-seat shared library) well enough to justify the spend.

**Responsibilities.**
- Own the plan: initiate Upgrade → Checkout (billing-cycle toggle) → Success; set and adjust the paid seat count; manage payment method, renewals, and cancellation.
- Reconcile invoices; handle failed-payment/dunning so learners are never locked out mid-track; keep the account in good standing.
- Coordinate with ORG-ADMIN (how many seats are really needed?) and with a vendor SUPPORT-AGENT on billing disputes and refunds.

**Permissions (can / can't).**
- **Can:** view and change plan and billing cycle; set the *paid* seat ceiling; manage payment methods and invoices; execute Checkout; cancel/renew; read spend and seat-cost reporting.
- **Can't:** invite or assign specific learners into seats, or set org roles (ORG-ADMIN owns *who* occupies the paid seats); touch the shared library, any topic, or any trust state; read learning content or honest signals beyond raw seat counts; grant themselves platform entitlements (vendor-side). A billing admin controls the *size of the pool*, not *who swims in it* or *what is in the water*.

**Pain points.**
- Seat ceiling and roster drift apart — finance pays for 50, ORG-ADMIN filled 32 — and reconciling utilization is manual.
- Mid-cycle expansion proration and the monthly/annual toggle create invoice confusion.
- A failed payment can lock learners out of an active, deadline-bound track — dunning has to be graceful.
- They must justify spend on a product whose value is *honesty*, which resists the vanity metrics finance usually anchors on; needs certificate counts and honest-signal ROI translated into money terms.

**Success criteria.** Spend matches utilization (few idle paid seats); predictable, reconciled invoices; on-time renewals; zero learner lockouts caused by billing failures.

**Typical workflows.**
1. *Upgrade the org to Teams:* Upgrade → Checkout (choose annual) → Success → set the initial seat count.
2. *Each cycle:* reconcile the invoice, compare seat-cost to ORG-ADMIN's utilization report, right-size the ceiling.
3. *Failed payment:* resolve via dunning before lockout; work a disputed charge with a vendor SUPPORT-AGENT.
4. *Renewal:* confirm the seat count with ORG-ADMIN, renew, download receipts for finance.

**Relationships.**
- **Pairs with** ORG-ADMIN (money vs. people/library) — often one person in a small org, always separable permissions in a large one.
- **Depends on** vendor SUPPORT-AGENT for billing disputes/refunds and on PLATFORM-ADMIN's plan-tier definitions.
- **Has no relationship with the ledger at all** — the cleanest illustration of the administrative/epistemic firewall: the persona that pays for everything can change nothing about what is true.

---

### Support Agent (SUPPORT-AGENT)

**Purpose.** Vendor-side. Staffs the **Support** surface and is the human who unbreaks a learner's or admin's day: a stuck verification pipeline, a test that timed out, a lost streak, a botched invite, a privacy/deletion request, a billing dispute. The defining constraint on this role is subtle but essential to a verification-first product — a support agent may restore *access and operational state*, but must **never** be able to manufacture *epistemic or learning state*. They cannot mark a claim `Verified`, fake a passed test, gift a certificate, or hand-edit a calibration score, because a product whose whole value is honest signals cannot let its support desk fabricate them.

**Goals.**
- Resolve tickets fast within a strict blast radius — restore what genuinely broke without touching what must stay *earned*.
- Reproduce real defects (a wedged pipeline stage, a sandbox failure) and route them correctly instead of papering over them.
- Access accounts only with consent, only as far as the ticket needs, and leave a clean audit trail.

**Responsibilities.**
- Triage the Support queue; reproduce; resolve or escalate. Common cases: a pipeline wedged at a stage (Triage / Retrieve / Verify / Skeptic), a Test-Runner timeout, a Review/FSRS anomaly, invite/seat/SSO problems, **Danger-zone** requests (reset history/gap map, delete account), and billing disputes.
- Perform scoped, consented account actions: resend invites, reset a login, retry a failed pipeline job, restore state from a known-good checkpoint, process a data-deletion request.
- Escalate to the right authority: infrastructure → **PLATFORM-ADMIN**; abuse / ledger-gaming / certificate fraud → **TRUST-SAFETY-LEAD**; "is this claim actually true?" → **SME-REVIEWER**; billing/refund policy → **BILLING-ADMIN**.

**Permissions (can / can't).**
- **Can:** view a user or tenant *with consent* (scoped, time-boxed, audited); retry or re-queue a stuck pipeline job; resend/reset invites and auth; process a privacy/deletion (Danger-zone) request; issue policy-bounded refunds or courtesy credits; annotate and route tickets.
- **Can't:** set or change any claim's trust state, resolve a Conflict, or promote a source (SME); mark a test passed, grant a certificate, or edit calibration/retention/gap-map contents to fabricate progress; grant plan entitlements or seats beyond documented courtesy limits (BILLING/ORG); ban users or quarantine content at platform scale (TRUST-SAFETY); access an account without consent or beyond the ticket's scope.

**Pain points.**
- The honesty firewall cuts against instinct: a learner pleads "just give me the streak/cert back," and the agent genuinely *cannot* — restoring a fabricated signal would corrupt the exact thing the product sells. They can only restore *genuinely-lost* state from a checkpoint.
- Diagnosing a wedged pipeline or a sandbox failure needs infra visibility they may only hold read-only, adding escalation latency to PLATFORM-ADMIN.
- Consent-scoped access slows resolution — a constant balance of speed against the privacy promise.
- Danger-zone deletions are irreversible and ripple into certificates, shared-library contributions, and team data — high stakes, low margin for error.

**Success criteria.** Fast resolution and low escalation on operational tickets; **zero fabricated-signal incidents**; correct routing (few tickets bouncing between SME / PLATFORM / T&S); a clean audit trail on every account touch; high CSAT achieved *without* compromising the honesty invariant.

**Typical workflows.**
1. *Stuck pipeline:* reproduce → confirm the failing stage → retry/re-queue → if infra, escalate to PLATFORM-ADMIN with the repro → update the learner.
2. *"Lost my streak/progress":* check audit logs for whether it was genuinely lost → restore from checkpoint if real; if the learner wants a *fabricated* boost, decline and explain the honesty policy.
3. *Deletion request:* confirm identity + consent → process the Danger-zone deletion → verify downstream effects (certs, shared contributions) are handled per policy.
4. *Suspected fraud:* certificate fraud or confidence-gate gaming surfaces in a ticket → escalate to TRUST-SAFETY-LEAD rather than acting on it.

**Relationships.**
- **Depends on** PLATFORM-ADMIN (infra fixes), SME-REVIEWER (epistemic questions), TRUST-SAFETY-LEAD (abuse/fraud), and BILLING-ADMIN (refunds).
- **Serves** every learner and admin persona; **hands off** anything touching truth, money-policy, or abuse to the authority that owns it.
- The firewall persona in human form: closest to users, and by deliberate design furthest from the ledger's certification power.

---

### Platform Administrator (PLATFORM-ADMIN)

**Purpose.** Vendor-side operations and root. Runs the machine VeriLearn *is*: the multi-tenant system, the six-stage **verification pipeline** every topic passes through, the **execution sandbox** that proves computational claims by actually running code, the **Skeptic AI** service, model/config/feature-flag rollouts, plan definitions, and the admin role model itself. This is the super-admin / break-glass authority for the system — and precisely *because* it is the most technically powerful account, the product draws its sharpest line here: **root over the infrastructure grants zero authority over the content the infrastructure carries.**

**Goals.**
- Keep the verification pipeline healthy and its queue drained — every stuck stage strands learners *and* backs up the Conflict queue SMEs depend on.
- Operate the execution sandbox safely: it runs arbitrary, machine-generated code to verify claims, so it is the platform's single largest security surface (isolation, resource limits, egress control).
- Ship model/prompt/config changes to the Skeptic and pipeline *without silently shifting how claims get judged* — a Skeptic tuning change can flip trust states at scale.
- Keep tenants isolated, SSO working, plan entitlements enforced, and SLA/uptime met.

**Responsibilities.**
- Provision and monitor org tenants and their isolation; manage SSO and the admin role model (who is ORG-ADMIN / SUPPORT / SME / TRUST-SAFETY).
- Own pipeline capacity and reliability across all six stages; own sandbox security and the Skeptic service; roll out model/config changes behind flags with staged rollout and rollback.
- Define plan tiers and entitlements (Free / Pro / Teams, hard-mode gating) at the system level; manage feature flags and the error/edge-state handling (offline, failed verification, timed-out test) at scale.
- Co-own change management with TRUST-SAFETY (a Skeptic-tuning change is also a ledger-integrity event) and defer the *meaning* of any judgment to SME-REVIEWER.

**Permissions (can / can't).**
- **Can:** operate infrastructure; scale, restart, and reconfigure the pipeline and sandbox; deploy model/prompt/feature-flag changes; provision tenants and admin roles; define plan entitlements; access system logs and metrics; use break-glass root access under audit.
- **Can't:** read or alter the *epistemic content* — cannot hand-set a claim's trust state, resolve a Conflict, promote a source, or edit a learner's honest signals; cannot see plaintext learning data beyond what operations strictly require (privacy-scoped); cannot ban users on abuse grounds unilaterally (that is a TRUST-SAFETY policy call, even though PLATFORM holds the technical off-switch). Root over the pipeline is not authorship over the ledger.

**Pain points.**
- A Skeptic/model tuning that improves precision on one topic can quietly re-flag claims on another — changes to the *judge* have ledger-wide blast radius, so every rollout is also a trust-integrity decision they cannot make alone.
- The execution sandbox is a permanent security tension: it must run untrusted, generated code to do its job, yet stay perfectly isolated — a sandbox escape is catastrophic in a product built on trust.
- Pipeline backpressure: a spike in topic creation backs up Verify/Skeptic, stranding learners *and* SMEs; capacity planning against bursty demand is hard.
- Being the most powerful account makes them the biggest insider-risk target; break-glass has to be tightly audited.

**Success criteria.** Pipeline uptime/throughput and low queue age; **zero sandbox-isolation incidents**; model/config rollouts with measured, intended effects on the trust-state distribution and clean rollbacks; tenant-isolation integrity; a spotless break-glass audit record.

**Typical workflows.**
1. *Pipeline incident:* alert on a wedged Verify stage → scale workers / clear the poison job → confirm the queue drains → post-incident review with the SUPPORT-AGENTs who fielded the tickets.
2. *Skeptic model rollout:* stage behind a flag → shadow-run against a sample → review the trust-state distribution shift *with* TRUST-SAFETY-LEAD and an SME → ramp or roll back.
3. *Sandbox hardening:* audit isolation, tighten resource/egress limits, patch, and re-test against adversarial payloads.
4. *New enterprise tenant:* set up isolation and SSO, provision seat entitlements (with BILLING-ADMIN), and seed the initial admin roles.

**Relationships.**
- **Depends on** TRUST-SAFETY-LEAD to co-own any change that alters how claims are judged, and on SME-REVIEWER as the human authority whose work the pipeline exists to surface.
- **Serves** SUPPORT-AGENT (escalated infra fixes) and every org tenant (ORG-ADMIN).
- Holds the technical power but **defers the *meaning* of trust to SME and the *policy* of abuse to TRUST-SAFETY** — the operational-vs-epistemic firewall made into a job.

---

### Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD)

**Purpose.** Vendor-side, and the most product-specific persona in the cluster. "Trust & Safety" here carries a double load that *only* a verification-first product has: **(1)** the usual — abuse, harassment, illegal content, account safety, and ban authority across the whole platform; and **(2)** the integrity of the trust ledger *as a system* — defending the verification spine against gaming and manipulation. They own the *policy and integrity* of trust at platform scale — and, exactly like everyone else in this cluster, they **still cannot hand-certify a single claim.** Their power is to freeze, quarantine, revoke, and escalate; never to decree what is true.

**Goals.**
- Keep platform-wide trust signals *meaning what they claim*: a certificate is trustworthy everywhere, a `Verified·source` tag was not gamed into place, a top-contributor rank is not a vote ring.
- Detect and shut down systematic attacks on the verification spine — mass-false confidence-gate commits that juke **Calibration**, vote-rings pushing a bad community reply toward a promoted source, prompt-injection that tries to coerce the Skeptic into certifying garbage, certificate/credential fraud, sockpuppet Conflict-flooding — faster than they erode credibility.
- Handle abuse and safety (harassment, illegal content, minor-safety in bootcamp/school tenants) and hold the ban/quarantine authority that **COMMUNITY-MOD** and SMEs escalate into.
- Set the integrity *policy* that COMMUNITY-MOD enforces locally and that PLATFORM-ADMIN's model rollouts must respect.

**Responsibilities.**
- Own platform-wide abuse response: investigate, warn/suspend/ban across tenants, remove illegal or harmful content, coordinate legal/law-enforcement where required.
- Own **ledger integrity**: monitor for gaming patterns (anomalous confidence-gate distributions, promotion vote-rings, Conflict-flooding, certificate anomalies); quarantine suspect claims, sources, or certificates pending SME review; revoke fraudulently-earned certificates and void gamed leaderboard standing platform-wide.
- Defend the Skeptic and sandbox from adversarial input (prompt-injection, poisoned sources) *with* PLATFORM-ADMIN; define what counts as "gaming."
- Escalate the *epistemic verdict* to SME-REVIEWER — T&S can freeze a manipulated source, but only an SME decides its trust state.

**Permissions (can / can't).**
- **Can:** ban/suspend/restrict users platform-wide; remove illegal or abusive content; quarantine or freeze claims, sources, or certificates suspected of manipulation, pending review; revoke fraudulent certificates and void gamed reputation/leaderboard standing; set integrity and abuse policy; trigger platform-wide safety actions; direct COMMUNITY-MOD escalations.
- **Can't:** set or upgrade a claim's trust state, resolve a Conflict on the merits, or promote a source (SME-REVIEWER) — they can *quarantine* a suspicious `Verified` tag but not *replace* it with their own verdict; deploy the infra/model changes themselves (PLATFORM-ADMIN executes); manage billing or org rosters. The highest guardian authority on the platform is still bounded by the epistemic firewall — the product's integrity depends on that line holding *even for the person who guards it*.

**Pain points.**
- The hardest, most product-specific tension in the whole roster: telling apart a legitimate **LEARNER-SKEPTIC** attacking the ledger *in good faith* (which the product actively wants) from a bad-faith actor gaming it. The behaviors can look identical, and over-policing the good-faith skeptic kills the very credibility engine VeriLearn runs on.
- Gaming the honest signals is an existential threat: if Calibration or certificates can be juked at scale, the value proposition collapses — yet detection is statistical and adversarial, always a step behind the attack.
- *Freeze-but-not-decide:* they can quarantine a manipulated source but must then wait on the SME queue to actually resolve it, leaving suspect content in limbo.
- Certificate revocation ripples into learners' and orgs' real-world credentials (jobs, continuing-education credit) — high blast radius, reputational and possibly legal.

**Success criteria.** Platform-wide certificate and trust-signal integrity holds (low verified-fraud rate); gaming attacks are detected and contained before they measurably corrupt Calibration, leaderboards, or sources; abuse is handled within SLA with low recurrence; a **low false-positive rate against good-faith skeptics** (the credibility-engine safeguard); and the epistemic firewall is never breached — no T&S-set trust states, ever.

**Typical workflows.**
1. *Calibration-juking:* an anomaly flags a cohort mass-committing "Sure" at the confidence gate to inflate Calibration → investigate → void the gamed signals and, if organized, suspend the accounts → refer any affected certificates for review → *without* touching the underlying claims' trust states.
2. *Source-promotion manipulation:* a vote-ring pushes a weak community reply toward promotion → freeze the promotion, void the ring's votes (via COMMUNITY-MOD), and route the reply to SME-REVIEWER for a real verdict.
3. *Skeptic prompt-injection:* a topic's generated content tries to coerce the Skeptic into certifying nonsense → quarantine the affected claims, work with PLATFORM-ADMIN to patch the Skeptic/sandbox input handling, refer the content to an SME.
4. *Certificate fraud:* detect an anomalous test/cert pattern → revoke the fraudulent certificate platform-wide → notify the affected org's ORG-ADMIN → log for audit.

**Relationships.**
- **Depends on** SME-REVIEWER for every *epistemic* verdict (T&S freezes; the SME decides truth) and on PLATFORM-ADMIN to execute technical defenses.
- **Sits above** COMMUNITY-MOD — local conversation governance escalates platform-wide abuse and gaming *up* to T&S — and directs SUPPORT-AGENT escalations of suspected fraud.
- **Conflicts, most delicately, with** LEARNER-SKEPTIC: it must protect the good-faith adversarial auditing the product depends on while stopping bad-faith gaming — and with anyone who wants the powerful T&S account to "just fix the trust state," which it deliberately cannot.

---

### Compliance / Data-Protection Officer (COMPLIANCE-DPO)

**Purpose.** The deliberately-surfaced *non-obvious* persona this cluster implies. A verification-first ed-tech product that runs on a **Teams** plan (schools, bootcamps, regulated employers), stores intimate **honest signals** (what you got wrong, where you are overconfident — genuinely sensitive learner data), issues **certificates** people may use for professional or regulatory credit, and ships an explicit **Privacy** panel plus a **Danger zone** (reset history/gap map, delete account) *necessarily* implies someone who owns **data governance and credential compliance**. That authority is separable from paying (BILLING), provisioning (ORG-ADMIN), operating (PLATFORM), and policing abuse (TRUST-SAFETY). It usually lives vendor-side (VeriLearn's DPO) with a customer-side counterpart (the org's own compliance contact), and it is **advisory and gatekeeping, not operational** — it says *what the rules are*; others execute them.

**Goals.**
- Ensure lawful handling of learner data (GDPR / FERPA / COPPA where minors sit in school or bootcamp tenants): lawful basis, data-subject rights, retention limits, cross-border transfer.
- Make the Danger-zone and Privacy affordances *genuinely* honor deletion/export/rectification end-to-end — including **derived** data (gap maps, calibration scores, shared-library contributions), not just the profile row.
- Protect the credibility of certificates *as credentials*: a retention and audit trail so a certificate can be validated later, and defensible criteria (every question sourced, ≥75% to pass) that stand up to an employer or regulator.
- Resolve the controller/processor question for Teams — the org owns its learners' data, VeriLearn processes it — in contract *and* in product behavior.

**Responsibilities.**
- Define data-retention, consent, and privacy policy; translate it into the Privacy settings, visibility defaults, and Danger-zone behavior that ORG-ADMIN configures and SUPPORT-AGENT/PLATFORM-ADMIN execute.
- Own data-subject requests (access / export / delete / rectify) as *policy*, ensuring they reach derived learning data and not just the account record.
- Govern certificate and credential records: retention, tamper-evidence, and an external-verification story; coordinate with TRUST-SAFETY on the difference between *revoking* a fraudulent cert (integrity) and *deleting* a legitimate record (privacy) — two different levers.
- Advise ORG-ADMIN on the learner-progress visibility policy from a compliance stance (can a manager lawfully see a report's per-learner calibration? in which jurisdiction? for minors?).

**Permissions (can / can't).**
- **Can:** set data-governance/retention/consent policy; define and audit the DSAR/deletion/export processes; sign off on certificate records-management; gatekeep launches and features on privacy grounds; audit access logs and consent trails; advise on the org visibility policy.
- **Can't:** change a claim's trust state, resolve Conflicts, or promote sources (SME) — compliance governs *personal data and credentials*, not epistemic truth; operate infra or execute deletions at the console (PLATFORM/SUPPORT do that, under the policy it sets); ban for abuse (TRUST-SAFETY); manage billing. Advisory and gatekeeping authority — and, like every persona here, no epistemic power.

**Pain points.**
- *Deletion vs. integrity collide:* a learner's right-to-be-forgotten may demand erasing data that a fraud investigation (TRUST-SAFETY) or an issued certificate's audit trail needs *retained* — competing lawful obligations to reconcile.
- *Derived-data reach:* honoring "delete my data" must chase calibration scores, gap-map entries, and even *community replies promoted into sources* that may now be woven into shared, verified content other learners depend on — deletion is never a single row.
- Minors and school tenants raise FERPA/COPPA duties the self-serve product was not obviously built for, yet Teams makes them real.
- The controller/processor split for Teams data is legally fiddly and product-visible: whose consent, whose retention clock, whose deletion authority — the org's or the learner's?

**Success criteria.** Clean DSAR/deletion fulfillment (derived data included) within legal windows; audit-ready consent and access trails; certificates that survive external validation *and* whose retention satisfies both credential-audit and privacy-deletion rules; no compliance incidents in Teams/school tenants; the Privacy panel and Danger zone demonstrably doing what they promise.

**Typical workflows.**
1. *Right-to-erasure:* receive the request → define the deletion's true scope (profile + calibration + gap map + certs + promoted contributions, per policy) → SUPPORT-AGENT / PLATFORM-ADMIN execute → verify derived data is actually gone → confirm, keeping only legally-required minimal records.
2. *School/minor tenant onboarding:* set the consent basis, retention limits, and visibility constraints → hand ORG-ADMIN a compliant default policy → audit adherence.
3. *Integrity-vs-privacy conflict:* a revocation (TRUST-SAFETY) or a deletion (learner) lands on a certificate with real-world use → reconcile the retention vs. erasure obligations → set the record's disposition.
4. *Feature gatekeeping:* a proposed leaderboard/visibility feature would expose per-learner calibration → review against jurisdiction and minor rules → approve, constrain, or block before it ships.

**Relationships.**
- **Advises** ORG-ADMIN (visibility and consent policy) and **directs** SUPPORT-AGENT / PLATFORM-ADMIN, who execute deletions and exports under that policy.
- **Coordinates and conflicts with** TRUST-SAFETY-LEAD at the integrity-vs-privacy boundary (retain-for-fraud vs. erase-on-request), and **depends on** SME-REVIEWER's world staying untouched — compliance reaches into personal data and credentials, never into trust states.
- **Bridges to** the Learners cluster's privacy tensions (LEARNER-TEAM not wanting a calibration dip exposed) by owning the policy that resolves them, and to external certificate-holders who need their credential to remain trustworthy.

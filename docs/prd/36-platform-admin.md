## Platform Administration, Content Moderation & Trust & Safety

### Overview

This domain owns the **vendor-side machinery that keeps VeriLearn running and keeps its trust signals meaning what they claim** — everything that operates the verification spine as *infrastructure*, governs the *conversation* that surrounds it, and defends the *integrity of the ledger* against gaming, fraud, and abuse. Concretely it covers three interlocking surfaces:

1. **Platform administration** — the operational/root plane: the multi-tenant system and tenant isolation, the six-stage verification pipeline's health and queue, the execution sandbox's security envelope, Skeptic/model/prompt rollouts, feature flags, the plan-entitlement catalog at the system level, the admin role model (RBAC), break-glass access, the public system-status/degraded-mode story, and error/edge handling at scale.
2. **Content moderation** — the *governance* half of Community (the Community product surface itself is defined in the Community domain): a moderation queue over threads and replies, cite-your-source conduct enforcement, local leaderboard/vote integrity, and the routing of strong cited pushback toward an SME for promotion.
3. **Trust & Safety / ledger integrity** — platform-wide abuse response (ban/suspend/restrict, illegal-content removal), and the product-specific job no ordinary platform has: detecting and containing attacks on the verification spine (calibration-juking, vote-rings, Conflict-flooding, Skeptic prompt-injection, certificate fraud), quarantining suspect claims/sources/certs, and revoking fraudulently-earned credentials.

The load-bearing idea that unifies all three — and that this whole domain exists to enforce **in code, not just policy** — is the **administrative/epistemic firewall**. The persona who can restart the pipeline, the persona who can ban anyone on the platform, and the persona who governs every community thread **all share one hard limit: none of them can move a single claim from `Sourced` to `Verified`, resolve a `Conflict` on the merits, promote a source, or hand-mint a certificate.** Certification lives only with the Verification Pipeline, the Execution Sandbox, and the human **SME-REVIEWER** (Conflicts, Trust & Sources domain). Administrators *provision, operate, unbreak, quarantine, revoke, and govern*; they never **decree what is true**. A product whose entire value proposition is *honest, earned trust signals* dies the moment its most powerful accounts can fabricate them — so every action in this domain is designed to **freeze-and-route-to-SME**, never to author the ledger. This matters to the product thesis precisely because the moat (the trust ledger) is only credible if it is un-buyable, un-gameable, and un-decreeable, even by the people who run the machine.

### Personas involved

- **Platform Administrator (PLATFORM-ADMIN)** — primary. Vendor-side root/ops: operates tenants and their isolation, the pipeline across all six stages, the execution sandbox, the Skeptic service, model/prompt/flag rollouts, the plan-entitlement catalog, and the admin role model. Holds the technical off-switch for everything; holds **zero** authority over any trust state, Conflict, source, or certificate.
- **Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD)** — primary. Vendor-side guardian of abuse response *and* ledger integrity: bans/suspends, removes illegal content, quarantines suspect claims/sources/certs, revokes fraudulent certificates, voids gamed reputation. Can freeze and revoke; can never hand-certify.
- **Community Moderator (COMMUNITY-MOD)** — primary. Governs verified-answers-only community conduct: keeps threads anchored to claims/sources, enforces cite-your-source, protects local leaderboard integrity, routes strong cited replies to SMEs, and escalates platform-scale gaming up to T&S. Certifies nothing, promotes nothing.
- **Subject-Matter Expert / Content Reviewer (SME-REVIEWER)** — *referenced, not owned* (Conflicts/Trust domain). The single epistemic endpoint every freeze/quarantine/promotion-route in this domain hands off to. This domain produces *requests and holds*; the SME performs the *epistemic write*.
- **Support Agent (SUPPORT-AGENT)** — *referenced* (Support domain). Escalates suspected fraud/abuse *up* to T&S and infra defects *up* to PLATFORM-ADMIN; consumes the audit trail this domain emits. Cannot fabricate signals — the same firewall.
- **Compliance / Data-Protection Officer (COMPLIANCE-DPO)** — *referenced* (Settings & Privacy domain). Advisory/gatekeeping counterpart at the **integrity-vs-privacy** boundary: retain-for-fraud vs. erase-on-request, certificate records-management, minor-safety policy that T&S actions must respect.
- **Organization / Teams Admin (ORG-ADMIN)** — *referenced* (Org/Teams domain). Receives notice when a certificate in their tenant is revoked or a member is actioned; never sees other tenants.
- **Community Contributor (CONTRIBUTOR) & Skeptical/Expert Learner (LEARNER-SKEPTIC)** — the *subjects* of moderation and integrity work. The good-faith LEARNER-SKEPTIC is the credibility engine the product wants; distinguishing them from a bad-faith gamer is this domain's most delicate job.
- **Employer / Recruiter (EMPLOYER-VERIFIER) & Developer / API Consumer (DEVELOPER-API)** — *referenced* (Certificates / API domains). Downstream consumers to whom a certificate revocation must propagate cleanly (verify-URL, webhook).
- **The Skeptic (SKEPTIC-AI), Execution Sandbox (EXEC-SANDBOX), Verification Pipeline (VERIFY-PIPELINE)** — the *operated systems*. This domain scales, patches, rolls out, and defends them; it does not overrule their verdicts.

### User stories

- **[ADMIN-01] As a Platform Administrator, I want to provision a new org tenant with hard isolation, SSO, and seeded admin roles, so that a Teams customer starts on an isolated, correctly-scoped footprint.** — *Priority:* MVP — *Why this priority:* No Teams customer can be onboarded safely without tenant isolation and role seeding; it is the entry point for all B2B revenue.
  - *Acceptance criteria:*
    - Creating a tenant establishes a data-isolation boundary such that no query, log, or export can cross into another tenant's learning data.
    - The admin seeds initial roles (ORG-ADMIN, and optionally INSTRUCTOR/EVENT-HOST) and wires SSO/directory integration; seat entitlements are set with BILLING-ADMIN, not invented here.
    - The tenant appears in the platform tenant registry with isolation status, plan, region, and SSO health.
  - *Business rules / validation:* Tenant provisioning grants **operational** scope only — the admin cannot read plaintext learning content in the new tenant beyond what operations strictly require. Seat *ceiling* is a billing artifact (BILLING-ADMIN); the admin only enables the entitlement, never sets price.
  - *Failure & edge cases:* If SSO/IdP metadata is malformed, provisioning completes but flags SSO as "not connected" and blocks member login via SSO rather than silently falling back to a shared-secret backdoor. A tenant-id collision or half-created tenant is rolled back atomically, never left in a partially-isolated state.

- **[ADMIN-02] As a Platform Administrator, I want a live view of the six-stage pipeline's queue depth and stage health, so that I can drain backpressure before learners and SMEs are stranded.** — *Priority:* MVP — *Why this priority:* A wedged stage strands every learner waiting on a topic *and* backs up the Conflict queue SMEs depend on — the pipeline is the product's beating heart.
  - *Acceptance criteria:*
    - A dashboard shows per-stage (Triage → Retrieve → Teach → Decompose → Verify → Skeptic) in-flight count, queue age (p50/p95), error rate, and worker health.
    - The admin can scale workers, pause intake, re-queue, or kill a specific poison job on any stage.
    - Draining is observable: queue age and backlog visibly fall after remediation, confirming the fix.
  - *Business rules / validation:* Operating the pipeline is purely mechanical — the admin can restart or re-queue a claim's verification but **cannot alter the verdict** the re-run produces. Re-queuing must be idempotent so a claim isn't double-verified into conflicting ledger entries.
  - *Failure & edge cases:* A single poison job (e.g., a topic that repeatedly crashes the Verify stage) must be isolable and dead-lettered so it cannot block the whole queue. On sustained overload, intake shifts to a graceful "verification delayed" state (see ADMIN-23) rather than dropping topics or shipping half-verified ledgers.

- **[ADMIN-03] As a Platform Administrator, I want to operate the execution sandbox under strict isolation, resource, and egress limits, so that running machine-generated code to prove claims never becomes a security breach.** — *Priority:* MVP — *Why this priority:* The sandbox runs arbitrary generated code to produce `Verified·execution`; it is the platform's single largest attack surface and an escape is catastrophic for a trust product.
  - *Acceptance criteria:*
    - Every sandbox run is network-isolated (no egress), resource-bounded (CPU/memory/wall-clock), and ephemeral (no state persists between runs).
    - The admin can set/tighten limits, quarantine a runner image, and run an adversarial-payload test suite before a sandbox config ships.
    - Each run records an environment fingerprint so a `Verified·execution` verdict is reproducible and re-runnable.
  - *Business rules / validation:* The sandbox may only **emit** trust states from actual runs (pass ⇒ `Verified·execution`; fail ⇒ Conflict); no admin, nor any pressure, can coerce a **false green** — a run either passed or it didn't. Any "run my own assertions" API inherits this exact envelope.
  - *Failure & edge cases:* A suspected sandbox escape triggers an immediate kill switch that halts all runs, freezes affected `Verified·execution` claims for re-verification, and pages the incident owner (see ADMIN-06). A resource-limit truncation of a legitimately long proof is reported as "inconclusive," never as a pass or a silent fail.

- **[ADMIN-04] As a Platform Administrator, I want to roll out a Skeptic/model/prompt change behind a flag with a shadow run and trust-state-distribution monitoring, so that I can improve the judge without silently re-flagging claims at scale.** — *Priority:* MVP — *Why this priority:* A tuning change to the Skeptic can flip trust states across the whole ledger; changing the *judge* has platform-wide blast radius and is also a ledger-integrity event.
  - *Acceptance criteria:*
    - Changes deploy behind a feature flag with staged rollout (shadow → sample cohort → ramp) and one-click rollback.
    - A shadow run reports the delta in the trust-state distribution (how many claims would move Verified↔Disputed↔Sourced) before any learner is affected.
    - Rollout of a judge-affecting change is **co-signed with TRUST-SAFETY-LEAD** and reviewed with an SME on the sample before ramping.
  - *Business rules / validation:* PLATFORM-ADMIN **executes** the rollout but does not decide the *meaning* of the shift — a large trust-state migration is gated on T&S/SME review, not on ops judgment alone. Rollback must restore the prior model *and* leave already-issued certificates untouched (a model change cannot retroactively invalidate an honestly-earned credential).
  - *Failure & edge cases:* If a rollout measurably degrades precision (a spike in SME-dismissed Disputes) or recall (Verified claims later overturned), auto-halt the ramp and revert. A change that would re-flag claims underlying *issued certificates* must surface those certs for review rather than silently orphaning them.

- **[ADMIN-05] As a Platform Administrator, I want to manage the admin role model with separable permissions and audited break-glass, so that spending, provisioning, operational, integrity, and epistemic authority never leak into one account.** — *Priority:* MVP — *Why this priority:* The whole cluster's credibility rests on authorities being separable in code; a conflated super-role would let one account both operate infra and touch content.
  - *Acceptance criteria:*
    - Roles (ORG-ADMIN, BILLING-ADMIN, SUPPORT-AGENT, SME-REVIEWER, TRUST-SAFETY-LEAD, COMMUNITY-MOD, PLATFORM-ADMIN) are assignable with distinct, non-overlapping capability sets; no role can self-escalate.
    - Break-glass root access is time-boxed, requires a reason, is announced/second-approved where policy requires, and is fully audited.
    - Even the platform root role's capability set **excludes** setting trust states, resolving Conflicts, promoting sources, and minting/editing certificates.
  - *Business rules / validation:* A single human may hold multiple hats, but each hat's permissions are checked independently — no implicit grant. Assigning the SME role does not grant moderation/ban power, and no admin role grants epistemic write.
  - *Failure & edge cases:* An attempt to grant a role a capability outside its firewall (e.g., "let PLATFORM-ADMIN certify") is rejected at the policy layer, not merely hidden in UI. If break-glass is invoked without a matching incident/reason, it is flagged for after-the-fact review and the session is watermarked in every log line.

- **[ADMIN-06] As a Platform Administrator, I want an immediate kill-switch and containment path when a sandbox job attempts an escape or wedges a stage, so that a hostile or broken payload can't corrupt the ledger or breach isolation.** — *Priority:* Should-Have — *Why this priority:* Rare but catastrophic; the sandbox's whole reason to exist (running untrusted code) makes this the highest-severity failure mode. *(Failure scenario.)*
  - *Acceptance criteria:*
    - Anomalous sandbox behavior (attempted egress, resource exhaustion, escape signatures) triggers automatic isolation of the runner and a halt on the affected job class.
    - All `Verified·execution` claims produced by the suspect runner/config are auto-frozen pending re-verification on a known-good sandbox.
    - An incident record captures the payload, the trace, and the blast radius (which topics/claims/certs are affected) and pages T&S and the SME queue.
  - *Business rules / validation:* Freezing a claim **downgrades its visible trust to "under re-verification," it does not delete or re-decide it** — the SME/sandbox re-run sets the final state. No certificate is auto-revoked on containment alone; certs affected are *flagged for review*, not voided by ops.
  - *Failure & edge cases:* If the escape signature is a false positive, the halted job class resumes and frozen claims re-verify cleanly with a logged "no-impact" resolution. If containment cannot isolate the runner, escalate to a full sandbox-tier shutdown and route new verification to the "delayed" state (ADMIN-23) rather than running on a possibly-compromised tier.

- **[ADMIN-07] As a Platform Administrator, I want to define the plan-tier entitlement catalog at the system level, so that what each tier unlocks stays consistent everywhere without touching price or trust.** — *Priority:* Should-Have — *Why this priority:* The Upgrade page, paywalls, and hard-mode gating all read from this catalog; drift causes billing/entitlement mismatches, but the base flows can ship with a static default.
  - *Acceptance criteria:*
    - The catalog maps each tier (Free / Pro / Teams) to concrete entitlements (active-topic cap, verification thoroughness, Skeptic hard-mode gate, seat entitlement, shared-library, SSO) consumed by Billing and the paywalls.
    - Changing an entitlement propagates to all reading surfaces without code changes; the change is versioned and audited.
    - The catalog exposes *capacity/thoroughness* levers only — it cannot define a "better trust state" or a price.
  - *Business rules / validation:* **Money buys thoroughness, never truth.** A tier may unlock *hard-mode Skeptic* or *thorough verification*, but no entitlement can promote `Sourced → Verified` or grant a certificate. Price lives with BILLING-ADMIN.
  - *Failure & edge cases:* If the catalog fails to load, reading surfaces fall back to last-known-good tier copy (Billing domain handles the user-facing note) rather than un-gating paid features. An entitlement referencing a nonexistent feature flag is rejected at save.

- **[ADMIN-08] As a Community Moderator, I want a moderation queue of reported and auto-flagged threads and replies, so that I can keep the verified-answers-only community anchored to claims and free of abuse.** — *Priority:* MVP — *Why this priority:* The community is where the honesty thesis becomes a social norm; without moderation it degrades into an unsourced forum and the promotion-into-sources path becomes an attack vector.
  - *Acceptance criteria:*
    - The queue lists reported/flagged items with reason, reporter, the linked claim/source, and thread context; the moderator can hide, remove, warn, or dismiss.
    - Removing content records a reason and is visible in a moderation audit log; the affected user is notified with the rule cited.
    - Off-topic content that isn't anchored to a specific claim/source can be flagged "needs a claim link" rather than silently deleted.
  - *Business rules / validation:* The moderator governs **conduct and anchoring**, not truth — removing a reply for being abusive/uncited is allowed; removing it for being *wrong* is not (a disputed-but-cited reply stays and routes to the debate). No moderation action changes a trust state, promotes a reply, or certifies the Skeptic's answer.
  - *Failure & edge cases:* Mass-reporting of one item is de-duplicated so a brigade can't auto-hide content by volume; a threshold routes suspected brigading to T&S (ADMIN-11/ADMIN-12). If a removed reply was already routed for SME promotion, the route is paused and the SME notified, not silently dropped.

- **[ADMIN-09] As a Community Moderator, I want to enforce cite-your-source conduct on answers, so that the community stays a verified-answers-only space rather than an opinion forum.** — *Priority:* Should-Have — *Why this priority:* Cite-your-source is the community's core ethos and the precondition for the promotion path, but the surface can launch with manual enforcement before automation.
  - *Acceptance criteria:*
    - An answer that asserts a resolution to a disputed claim without a citation can be flagged "cite your source," nudging the author to add one before it can be nominated for promotion.
    - Repeated uncited assertions from one user escalate through warn → rate-limit → escalate-to-T&S.
    - Questions and study-group posts are exempt (the rule targets *answers* posing as settled).
  - *Business rules / validation:* The moderator can require a citation but **cannot judge whether the citation is good enough to certify** — that check is the Skeptic's source-check and, for promotion, the SME's. Enforcement is conduct-level.
  - *Failure & edge cases:* A good-faith answer citing an *offline/paywalled* source is not removed for being hard to verify — it routes to the Skeptic/SME rather than being treated as uncited. Over-flagging a legitimate discussion post is reversible and logged.

- **[ADMIN-10] As a Community Moderator, I want to route a strong, well-cited reply toward an SME for promotion into a topic's sources, so that human pushback can earn its way into the canon without me ever certifying it.** — *Priority:* MVP — *Why this priority:* Promotion-into-sources is the community's reason to exist and the only path a non-vendor human voice enters the ledger; the routing step must exist and must be firewalled.
  - *Acceptance criteria:*
    - The moderator can nominate a cited reply and route it to the SME queue with the linked claim/Conflict and rationale attached.
    - The routed item shows a "promotion requested" state to the thread; the actual write into Sources is performed by the SME in the Conflicts/Trust domain, not here.
    - The contributor's authorship is attached so a later promotion credits them durably (reputation footprint), without conferring any trust authority.
  - *Business rules / validation:* Routing is a **request, never a write** — no moderation action mutates the source list or a trust state. Reputation earned from a promotion is firewalled from the learner's four honest signals and certificate eligibility.
  - *Failure & edge cases:* If the SME rejects the promotion, the reply stays as ordinary community content and the thread reflects "not promoted," with no penalty to the contributor. If the underlying claim's Conflict is resolved before the SME acts, the route is closed as moot and the moderator notified.

- **[ADMIN-11] As a Community Moderator, I want to spot obvious vote manipulation and self-promotion within a thread and void local votes, so that the leaderboard and promotion signal aren't trivially gamed.** — *Priority:* Should-Have — *Why this priority:* Reputation is gameable and gates the promotion path, but platform-scale ring detection belongs to T&S; local moderation is the first line, not the whole defense.
  - *Acceptance criteria:*
    - The moderator can void obviously-illegitimate votes on a reply (e.g., a burst of new accounts) and remove self-referential "vote for me" content.
    - Suspected *systematic* rings (cross-thread, cross-account) are escalated to TRUST-SAFETY-LEAD rather than resolved locally.
    - Voided votes reverse the associated helpful-answer count and any promotion nomination they inflated.
  - *Business rules / validation:* Local moderation handles *this thread*; anything spanning threads/tenants is T&S's platform-wide authority. Voiding reputation never touches learning signals or certificates.
  - *Failure & edge cases:* Legitimate organic upvotes on a genuinely good answer must not be voided as a "burst" — the bar is evidence of coordination, not popularity. If a voided vote came from a real user caught in a sweep, they can appeal (ADMIN-22).

- **[ADMIN-12] As a Community Moderator, I want valid but harsh good-faith pushback protected from being removed by mass-reporting, so that the credibility engine (the expert skeptic) isn't silenced by people who merely disagree.** — *Priority:* Should-Have — *Why this priority:* Over-policing the good-faith LEARNER-SKEPTIC kills the exact adversarial auditing VeriLearn runs on; this is the most product-specific moderation failure mode. *(Failure scenario.)*
  - *Acceptance criteria:*
    - A cited, on-topic dispute cannot be auto-hidden by report volume alone; removal of such content requires an explicit conduct violation (abuse, harassment, spam), not disagreement.
    - When a well-cited reply is heavily reported, it is surfaced for *human* review flagged "possible good-faith dispute," not queued for deletion.
    - Reports that cite "this is wrong" as the reason are reclassified as *debate*, routing to the thread/Conflict rather than moderation.
  - *Business rules / validation:* "Wrong" is never a moderation reason — wrongness is adjudicated on the ledger by the Skeptic/SME, not removed by a moderator. The distinction between *bad conduct* (moderatable) and *unpopular-but-sourced argument* (protected) is enforced in the report taxonomy.
  - *Failure & edge cases:* If a reply is genuinely both cited *and* abusive, the abusive framing is actioned while the sourced substance is preserved/routed to the Conflict. Coordinated mass-reporting of a good-faith skeptic is itself escalated to T&S as an abuse pattern.

- **[ADMIN-13] As a Trust & Safety / Ledger Integrity Lead, I want anomaly detection over the honest signals and reputation, so that calibration-juking, vote-rings, and Conflict-flooding are caught before they corrupt the ledger.** — *Priority:* MVP — *Why this priority:* If Calibration, leaderboards, or the promotion path can be gamed at scale, the entire value proposition collapses; detection is the front line of ledger integrity.
  - *Acceptance criteria:*
    - Monitors flag anomalies: cohorts mass-committing "Sure" at the confidence gate, unnatural upvote graphs, sockpuppet Conflict-flooding, and abnormal test/certificate patterns.
    - Each alert carries the evidence (distribution, account graph, timeline) and a suggested containment, not just a score.
    - Confirmed gaming can void the specific gamed signals/votes/standing **without** touching the underlying claims' trust states.
  - *Business rules / validation:* Reputation and honest signals are **firewalled** — voiding a gamed leaderboard rank must never alter a learner's Retention/Transfer/Calibration or certificate eligibility, and vice versa. T&S voids *gamed* signals; it does not re-decide *content*.
  - *Failure & edge cases:* Detection is statistical and adversarial — a good-faith cohort that is genuinely well-calibrated must not be flagged as juking; the bar is anomalous *coordination/impossibility*, not high performance. False positives are reversible and appealable (ADMIN-22).

- **[ADMIN-14] As a Trust & Safety / Ledger Integrity Lead, I want to quarantine a suspect claim, source, or certificate pending SME review, so that manipulated content is contained without me ever deciding its truth.** — *Priority:* MVP — *Why this priority:* The freeze-but-not-decide power is the exact mechanism that lets T&S protect integrity while honoring the epistemic firewall; without it, contained-vs-certified would blur.
  - *Acceptance criteria:*
    - T&S can set a claim/source/cert to "quarantined — under review," which hides or down-weights it in learner-facing surfaces and blocks new certificates that depend on it.
    - Quarantine opens/attaches an SME review item; the final trust verdict is the SME's, never T&S's.
    - The quarantine reason, scope, and downstream impact are recorded and visible in audit.
  - *Business rules / validation:* Quarantine is **reversible containment, not a verdict** — T&S can freeze a `Verified` tag but cannot replace it with its own state; only an SME (or a clean sandbox re-run) resolves it. Tests must exclude quarantined claims until resolved, exactly as they already exclude Disputed ones.
  - *Failure & edge cases:* A quarantine that lingers because the SME queue is backed up must surface an SLA/aging alert so suspect content isn't stuck in limbo indefinitely. If quarantine was mistaken, releasing it restores the prior state exactly, with a logged no-impact resolution.

- **[ADMIN-15] As a Trust & Safety / Ledger Integrity Lead, I want to revoke a fraudulently-earned certificate platform-wide and propagate the revocation everywhere it's consumed, so that a fake credential can't survive as a trusted signal.** — *Priority:* MVP — *Why this priority:* Certificates are the product's highest-stakes output; a fraudulent cert that stays "valid" to an employer breaks the entire EMPLOYER-VERIFIER trust chain. *(Cross-domain, high-blast-radius.)*
  - *Acceptance criteria:*
    - Revocation flips the certificate's public verify-URL to "revoked" with a reason category and effective date, and fires the "cert revoked" webhook to integrated consumers (DEVELOPER-API).
    - The affected learner and, for a Teams cert, the owning ORG-ADMIN are notified; the revocation is logged immutably.
    - Revocation propagates within a bounded, defined window so downstream ATS/LMS systems reflect it promptly.
  - *Business rules / validation:* T&S revokes for **fraud/integrity**; a cert honestly earned from verified/sourced claims is **never** revoked for a payment lapse or a later model change (those are handled by keeping it valid). Revocation is an integrity lever, distinct from *deletion* (a privacy lever owned by COMPLIANCE-DPO) — the two must be reconciled, not conflated (ADMIN-21).
  - *Failure & edge cases:* If webhook delivery fails, the public verify-URL is still authoritative and shows "revoked," so an employer checking directly gets the truth even if a downstream sync lags; delivery retries with backoff. A wrongful revocation is reinstatable (ADMIN-22) and re-propagates a "reinstated" state.

- **[ADMIN-16] As a Trust & Safety / Ledger Integrity Lead, I want to ban, suspend, or restrict a user platform-wide and remove illegal or harmful content, so that abuse and safety violations are handled across all tenants within SLA.** — *Priority:* MVP — *Why this priority:* Baseline platform safety (harassment, illegal content, minor-safety in school/bootcamp tenants) is table-stakes and the escalation endpoint for every moderator and SME.
  - *Acceptance criteria:*
    - T&S can warn, restrict, suspend, or ban an account platform-wide, and remove illegal/harmful content, with a recorded reason and policy citation.
    - Actions apply across tenants where the account operates; where legally required, a legal/law-enforcement coordination path is available.
    - The actioned user is notified with the reason and the appeal path (ADMIN-22).
  - *Business rules / validation:* Ban authority is a **T&S policy call** — PLATFORM-ADMIN holds the technical off-switch but does not ban on abuse grounds unilaterally; COMMUNITY-MOD escalates *up* to T&S rather than banning platform-wide. Banning a user **does not** revoke honestly-earned certificates or alter their trust contributions unless those are *themselves* fraudulent (a separate ADMIN-15 action).
  - *Failure & edge cases:* Minor-safety cases in school tenants follow COMPLIANCE-DPO's constraints (mandatory reporting, retention). A ban that would erase content another verified topic depends on (a promoted source) freezes rather than deletes that content pending SME review, so the ledger isn't silently holed.

- **[ADMIN-17] As a Trust & Safety / Ledger Integrity Lead, I want to contain Skeptic prompt-injection and poisoned-source attacks, so that adversarial content can't coerce the verifier into certifying garbage.** — *Priority:* Should-Have — *Why this priority:* Prompt-injection that flips the Skeptic into blessing a fabricated claim is a direct attack on the moat; it's lower-frequency than baseline abuse but strikes at the core. *(Failure scenario / abuse.)*
  - *Acceptance criteria:*
    - Detected injection/poisoning quarantines the affected claims (ADMIN-14) and the suspect source, and opens a coordination item with PLATFORM-ADMIN to patch the Skeptic/sandbox input handling.
    - The affected content is routed to an SME for a real verdict; no trust state is set by T&S.
    - A pattern signature is recorded so the same injection is caught on future topics.
  - *Business rules / validation:* T&S **freezes and routes**; PLATFORM-ADMIN executes the technical patch; SME decides the truth — three separated authorities on one incident. A fabricated citation that fooled retrieval is treated as an Unsupported/Disputed candidate, never left as `Verified·source`.
  - *Failure & edge cases:* If the injection already produced an *issued certificate*, those certs are flagged for review (potential ADMIN-15 revocation) rather than trusted. A false alarm (benign content resembling injection) releases the quarantine cleanly and tunes the signature down.

- **[ADMIN-18] As a Trust & Safety / Ledger Integrity Lead, I want an evidence threshold and appeal built into every integrity action, so that good-faith adversarial auditing is protected from being mistaken for gaming.** — *Priority:* Should-Have — *Why this priority:* Telling a good-faith LEARNER-SKEPTIC from a bad-faith gamer is the hardest, most existential tension in the role; over-policing the good-faith skeptic destroys the credibility engine. *(Failure scenario / the delicate case.)*
  - *Acceptance criteria:*
    - Punitive actions (void reputation, suspend, restrict) require documented evidence of *coordination or impossibility*, not merely aggressive-but-sourced behavior.
    - Raising many Conflicts or auditing the coverage matrix hard — the exact behavior the product wants — is explicitly non-actionable on its own.
    - Every affected user gets a stated reason and a working appeal path with a target response time.
  - *Business rules / validation:* The product **wants** ledger attacks in good faith; the actionable line is *bad-faith manipulation of signals* (rings, sockpuppets, mass-false commits), not *volume or harshness of legitimate critique*. A low false-positive rate against good-faith skeptics is an explicit success metric of the role.
  - *Failure & edge cases:* A borderline case defaults to *quarantine + review* (reversible) rather than *ban* (punitive). If review clears the user, reputation and standing are restored and the false-positive is logged to tune detection.

- **[ADMIN-19] As a Trust & Safety / Ledger Integrity Lead, I want to void gamed reputation and leaderboard standing platform-wide without touching learning signals, so that social gaming can't leak into or out of the trust ledger.** — *Priority:* Should-Have — *Why this priority:* Reputation is the gameable social layer; keeping its firewall to the honest signals intact protects both directions, but it sits above baseline abuse handling.
  - *Acceptance criteria:*
    - Voiding a ring's standing removes the gamed helpful-answer counts, leaderboard rank, and any promotion nominations they inflated.
    - The void is scoped to the *social* signals; the learner's Retention/Transfer/Calibration/Drill signals and certificate eligibility are provably untouched.
    - The action is logged with the account graph evidence.
  - *Business rules / validation:* Reputation ⇄ honest-signal firewall is bidirectional and absolute: being popular earns nothing on the trust ledger, and losing gamed reputation costs nothing on it.
  - *Failure & edge cases:* If a promoted source was pushed by a now-voided ring, the *promotion* is frozen and routed to an SME (T&S can't un-promote on the merits) rather than auto-reverted. Legitimate contributors caught adjacent to a ring keep their organically-earned standing.

- **[ADMIN-20] As a Trust & Safety / Ledger Integrity Lead, I want every administrative and integrity action written to an immutable, queryable audit trail, so that powerful actions are accountable and defensible.** — *Priority:* MVP — *Why this priority:* Powerful accounts are the biggest insider-risk; without a tamper-evident audit trail, break-glass, bans, revocations, and consented account access can't be trusted or defended.
  - *Acceptance criteria:*
    - Every ban, revoke, quarantine, break-glass session, role change, and consented account access records actor, target, reason, scope, timestamp, and before/after state.
    - The log is append-only/tamper-evident and queryable by target, actor, and action type for incident review and compliance audit.
    - Consented account access by SUPPORT-AGENT is time-boxed and its scope is captured in the same trail.
  - *Business rules / validation:* No privileged action is exempt from logging — including platform-root break-glass. Audit records themselves cannot be edited or deleted by any operational role; retention follows COMPLIANCE-DPO policy.
  - *Failure & edge cases:* If the audit sink is unavailable, privileged actions are *blocked or buffered-then-flushed*, never silently allowed unlogged (fail-closed on accountability). An attempt to access an account without a consent token is denied and itself logged as a policy event.

- **[ADMIN-21] As a Compliance / Data-Protection Officer, I want the integrity-vs-privacy conflict on a certificate reconciled explicitly, so that a fraud hold and a right-to-erasure request don't silently override one another.** — *Priority:* Should-Have — *Why this priority:* Retain-for-fraud vs. erase-on-request are competing lawful obligations on the same high-stakes record; getting it wrong is a compliance *and* an integrity incident. *(Cross-domain edge.)*
  - *Acceptance criteria:*
    - When a deletion request lands on a certificate/record under a T&S fraud hold (or vice versa), the system flags the collision and routes it to COMPLIANCE-DPO for a disposition decision rather than executing either lever blindly.
    - The disposition (retain minimal record for the fraud/audit obligation vs. erase) is recorded with the legal basis.
    - *Revocation* (integrity) and *deletion* (privacy) are modeled as distinct actions with distinct effects, never conflated.
  - *Business rules / validation:* Neither lever silently wins: a legal retention obligation can hold a record against erasure, and an erasure can be honored while a *revocation status* persists as a minimal tamper-evidence record — the DPO decides which, per jurisdiction. Compliance governs *personal data and credentials*, never trust states.
  - *Failure & edge cases:* If erasure would break a *promoted source* other learners' verified content depends on, the reach of deletion (derived data: calibration, gap-map, promoted contributions) is scoped with the DPO before execution, not discovered afterward. A deletion that cannot lawfully complete returns a clear "retained under legal obligation" outcome, not a false "deleted."

- **[ADMIN-22] As a Community Contributor caught in an integrity sweep, I want a clear appeal and reinstatement path, so that a false-positive ban or de-ranking can be corrected and my honestly-earned standing restored.** — *Priority:* Should-Have — *Why this priority:* Statistical, adversarial detection *will* produce false positives; without a recovery path, protecting the good-faith skeptic (ADMIN-18) is only half-built. *(Recovery scenario.)*
  - *Acceptance criteria:*
    - Every punitive action ships with an appeal channel, a stated reason, and a target response time; the appeal is reviewed by a human other than the actioning one where policy requires.
    - A successful appeal reinstates the account and restores voided *organic* reputation, and re-propagates a "reinstated" state for any revoked-then-cleared certificate.
    - The appeal outcome (upheld/overturned) is logged and feeds detection tuning.
  - *Business rules / validation:* Reinstating reputation restores only *organically-earned* standing, never the gamed portion. A reinstated certificate must re-verify cleanly against its (still-valid) sourced claims — reinstatement is not re-issuance from nothing.
  - *Failure & edge cases:* If content was *deleted* (not just hidden) during the action and the appeal succeeds, restore from checkpoint where possible; where truly unrecoverable, state that honestly rather than silently. An appeal on an *epistemic* complaint ("my claim really is true") is routed to the SME/Conflicts path, not adjudicated by T&S.

- **[ADMIN-23] As a Platform Administrator, I want the platform to degrade honestly when the pipeline or sandbox is impaired, so that learners see truthful "verification delayed" states instead of fabricated or half-verified results.** — *Priority:* Should-Have — *Why this priority:* In a product whose entire pitch is honesty, a degraded backend must never fake completeness; the honest-degradation story is itself part of the value proposition. *(Failure scenario at scale.)*
  - *Acceptance criteria:*
    - When a stage is impaired, affected topics show an explicit "verification in progress / delayed" state, and the public system-status page reflects the incident ("Verification degraded").
    - Tests and certificates that depend on not-yet-verified claims are held, not issued against incomplete verification.
    - On recovery, queued work drains automatically and affected learners/topics are notified that verification completed.
  - *Business rules / validation:* A degraded backend may **delay** trust states but must never **invent** them — no claim ships `Verified` because the verifier was down. Certificates are gated on real verification, so none are minted during a verification outage.
  - *Failure & edge cases:* If the outage is prolonged, learners can still read the *already-verified* portions of a topic with the unverified remainder clearly marked, rather than being fully blocked. A status-page failure has an independent fallback channel so "all systems operational" is never shown while the pipeline is down.

### Business rules & invariants

- **The administrative/epistemic firewall (the master invariant).** No persona in this domain — not platform root, not the T&S lead, not a moderator — can set/upgrade a claim's trust state, resolve a Conflict on the merits, promote a source, or mint/edit a certificate. Every integrity action is **freeze/quarantine/route-to-SME**, never a verdict. This is enforced at the capability layer, not merely in UI.
- **Operate the machine, never author the ledger.** PLATFORM-ADMIN can restart, scale, re-queue, roll out, and roll back the pipeline/sandbox/Skeptic, but a re-run's *verdict* is the system's, unmodified. Root over infrastructure is not authorship over content.
- **Freeze ≠ decide.** Quarantine and containment are reversible holds that change *visibility/eligibility* (hide, down-weight, block new certs, exclude from tests) but not the stored trust state; only an SME or a clean sandbox re-run resolves the state.
- **Revocation ≠ deletion.** Certificate *revocation* is an integrity lever (T&S, for fraud); *deletion* is a privacy lever (COMPLIANCE-DPO/Support, for erasure). They have different triggers, effects, and audit trails, and their collisions are reconciled explicitly (ADMIN-21) — never silently.
- **Reputation is firewalled from honest signals, both ways.** Community helpful-answer counts, leaderboard rank, and promotion footprint never leak into Retention/Transfer/Calibration/Drill, predicted readiness, or certificate eligibility — and voiding gamed reputation never touches those learning signals.
- **Money buys thoroughness, not truth.** The entitlement catalog unlocks capacity and scrutiny (unlimited topics, thorough verification, hard-mode Skeptic, seats); it can never define a better trust state or mint a certificate, and a payment lapse never revokes an honestly-earned credential.
- **"Wrong" is not a moderation reason.** Moderators act on *conduct and anchoring* (abuse, spam, uncited assertions, off-claim posts); wrongness is adjudicated on the ledger. Cited, on-topic, good-faith pushback is protected from removal by report volume.
- **Good-faith adversarial auditing is protected.** Punitive integrity actions require evidence of *coordination or impossibility*, not aggressiveness or volume. Borderline cases default to reversible quarantine-plus-review, and every punitive action carries an appeal path.
- **Customer/vendor isolation.** Tenants are hard-isolated; vendor-side staff do not casually read a tenant's learning content — access is consented, scoped, time-boxed, and audited.
- **Everything privileged is audited, fail-closed.** Every ban, revoke, quarantine, role change, break-glass session, and consented access is written to an immutable trail; if the audit sink is down, privileged actions block or buffer rather than proceed unlogged.
- **Honest degradation.** An impaired verifier delays trust states; it never invents them. No `Verified` is shown, and no certificate is minted, on the strength of a verifier that was down.

### Cross-domain dependencies

- **Needs from Conflicts, Trust & Sources (SME-REVIEWER):** the single epistemic endpoint. Every quarantine, promotion-route, injection containment, and reputation-void that touches content hands off to an SME for the actual verdict/write. This domain must not block indefinitely on that queue — hence SLA/aging alerts (ADMIN-14).
- **Needs from Certificates & Tests:** the certificate object, its public verify-URL, and revocation semantics that ADMIN-15 flips and propagates; tests must honor "exclude quarantined claims" exactly as they exclude Disputed ones.
- **Needs from Community:** the thread/reply/vote/reputation objects and the promotion-nomination path that moderation governs (ADMIN-08–12) — the Community domain defines the surfaces; this domain defines their governance.
- **Needs from Billing & Org/Teams:** seat entitlements and tenant/plan definitions consumed by ADMIN-01/07; BILLING-ADMIN owns price and seat *ceiling*, ORG-ADMIN owns seat *occupancy* — this domain enables entitlements but sets neither.
- **Needs from Settings & Privacy (COMPLIANCE-DPO):** retention/consent/DSAR policy that governs audit-log retention (ADMIN-20) and the integrity-vs-privacy reconciliation (ADMIN-21); the Danger-zone/deletion execution lives there, under policy set there.
- **Provides to Support:** the audit trail, the pipeline/sandbox operational controls, and the escalation endpoints SUPPORT-AGENT routes into (fraud/abuse → T&S; infra → PLATFORM-ADMIN). Support restores *operational* state under consent; it cannot fabricate signals — the same firewall.
- **Provides to Employer/Recruiter & Developer/API:** truthful certificate status. Revocation (ADMIN-15) flips the verify-URL and fires the "cert revoked" webhook so downstream ATS/LMS/HRIS reflect it; the verify-URL is authoritative even if a webhook lags.
- **Provides to Org/Teams (ORG-ADMIN):** notice when a member is actioned or a tenant certificate is revoked, scoped to their tenant only.
- **Depends on Progress/Analytics signals:** the honest-signal and reputation distributions that feed anomaly detection (ADMIN-13) — read for integrity, never written by this domain.

### Key technical requirements

- **Tenant isolation & RBAC:** hard multi-tenant data isolation; a separable-capabilities authorization model where no role (including platform root) can self-escalate or acquire epistemic write; SSO/directory integration per tenant.
- **Pipeline observability & control at scale:** per-stage queue-depth/age (p50/p95), error rate, and worker health; idempotent re-queue; poison-job dead-lettering; graceful intake backpressure with an honest "verification delayed" state; auto-drain on recovery.
- **Sandbox security envelope:** network-isolated, resource-bounded, ephemeral execution with environment fingerprinting for reproducibility; a kill switch, runner-image quarantine, and an adversarial-payload regression suite; escape detection that fails closed.
- **Safe model/config rollout:** feature-flagged staged rollout (shadow → sample → ramp) with trust-state-distribution diffing, precision/recall guardrails, one-click rollback, and mandatory T&S/SME co-sign for judge-affecting changes.
- **Anomaly detection:** statistical, adversarial-aware monitors over confidence-gate distributions, vote/account graphs, Conflict-creation rates, and test/certificate patterns, tuned for a low false-positive rate against good-faith skeptics; alerts carry evidence and reversibility.
- **Quarantine & revocation machinery:** reversible content holds that change visibility/eligibility without mutating stored trust state; certificate revocation with bounded-latency propagation to verify-URL and webhooks, plus reinstatement; SLA/aging alerts on quarantine backlog.
- **Immutable audit:** append-only, tamper-evident, queryable audit of every privileged action (actor/target/reason/scope/before-after), fail-closed if the sink is unavailable; retention governed by compliance policy.
- **Incident & status:** a public system-status surface with an independent fallback channel (never a false "operational"), incident records capturing blast radius (topics/claims/certs affected), and break-glass sessions that are time-boxed, reasoned, and watermarked across logs.
- **Latency/cost posture:** thorough Skeptic red-teaming is what learners wait on, so capacity planning must absorb bursty topic-creation demand without degrading verification quality; degraded modes trade *speed* for honesty, never *truth* for speed.

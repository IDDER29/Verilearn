## Settings, Profile, Privacy & Personal Data Management

### Overview

This domain owns the **control surface** through which a learner (or an admin acting on their behalf) shapes how VeriLearn behaves for them and governs the personal data VeriLearn holds about them. It is the Settings shell and its sub-nav — **Account** (Profile, Plan & billing), **Learning** (Verification, Active listening, Review & FSRS), and **Data** (Privacy, Danger zone) — plus the personal-data lifecycle that hangs off it: export (DSAR self-service), retention, and irreversible deletion.

The domain matters to the product thesis in two non-obvious ways. First, VeriLearn competes on **honesty**, and honesty has to hold *in the settings surface too*: the Privacy panel tells the truth about what is stored ("we never sell your data or train public models on it"), the data export is a *faithful* copy of the trust ledger (sources and trust states included, not just prose), and destructive actions are labeled with their exact blast radius rather than soft-hidden. Second, and most important, **no personal setting is allowed to mutate the epistemic record**. A learner can crank the Skeptic to "ruthless" or verification depth to "thorough," but that changes only *future* lectures — it can never retroactively re-certify, downgrade, or hide a claim that already sits in the ledger. Settings tune the machine; they do not overwrite what the machine already proved. That invariant is what keeps a personal preference from becoming a backdoor into the trust ledger.

This domain deliberately does **not** own the *behavior* behind most of its controls — it renders the toggle and persists the preference, while the semantics live in their home domains: FSRS mechanics (Review domain), lecture prompt behavior (Lecture domain), verification depth/Skeptic aggressiveness (Pipeline/Skeptic/Sandbox), the actual Checkout transaction (Monetization/Upgrade), and sign-in security (Auth). It is the single, coherent place a user goes to *decide*, and the system of record for those decisions.

### Personas involved

- **Self-directed Learner (LEARNER-SELF)** — the default inhabitant; edits profile, watches Free-plan usage/limits, tunes learning prefs, controls privacy, and owns the danger zone for their own account.
- **Returning Power-Learner (LEARNER-POWER)** — lives in Review & FSRS settings (target retention, daily limit, max interval) and cares about export/portability of a large multi-topic portfolio.
- **Exam-prep Student (LEARNER-EXAM)** — tunes active-listening intensity and verification depth to trade thoroughness for speed against a deadline; sensitive to timezone (review "due today" boundaries).
- **Skeptical / Expert Learner (LEARNER-SKEPTIC)** — pushes verification depth to thorough and Skeptic to ruthless (Pro), and expects the export to carry the coverage matrix and trust states honestly.
- **Team Seat Learner (LEARNER-TEAM)** — a *constrained* settings surface: profile and learning prefs yes; billing hidden/read-only; some privacy toggles (progress visibility) may be locked by org policy.
- **Parent / Guardian (GUARDIAN)** — owns billing and safety for a dependent; today served only by a single shared account (a documented product gap); target of age-gate, consent, and parental-visibility features.
- **Organization / Teams Admin (ORG-ADMIN)** — sets a tenant progress-visibility policy that overlays and can lock individual seat privacy toggles; cannot certify claims or set price.
- **Billing / Finance Admin (BILLING-ADMIN)** — the authority behind the Plan & billing surface; owns plan, seat ceiling, payment method, and invoices, but nothing about content or trust.
- **Compliance / Data-Protection Officer (COMPLIANCE-DPO)** — governs the personal-data lifecycle: DSAR fulfillment, retention schedules, FERPA/COPPA handling, consent records, and certificate-audit — advisory/gatekeeping over data, never over truth.
- **Support Agent (SUPPORT-AGENT)** — under scoped, logged consent, repairs account/settings state (unstick, restore a streak, undo an accidental reset within grace) but is firewalled from ever fabricating a learning signal or certificate.
- **Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD)** — can freeze/ban an account (rendering its settings read-only, blocking deletion pending investigation) and revoke fraudulent certificates, but never hand-certifies via settings.
- **Platform Administrator (PLATFORM-ADMIN)** — root operator of accounts/tenants who can act on account-state infrastructure yet cannot read or alter epistemic content.
- **Accessibility-Reliant Learner (A11Y-LEARNER)** — a core stress test: every slider, toggle, and destructive confirmation must be operable and legible via assistive tech, with no color-only state and no purely-timed lockout.
- **Developer / API & Integration Consumer (DEVELOPER-API)** — consumes the structured export format and Teams SSO/seat provisioning that intersect Profile/Account, bound by the rule that nothing external mutates the ledger.

### User stories

- **[SETTINGS-01] As a Self-directed Learner (LEARNER-SELF), I want a settings home that groups controls into Account, Learning, and Data, so that I can find any preference without hunting.** — *Priority:* MVP — *Why this priority:* Settings is a hub; a disoriented user cannot exercise the privacy/plan/learning controls the rest of the domain depends on.
  - *Acceptance criteria:*
    - Left sub-nav renders three groups — Account (Profile, Plan & billing), Learning (Verification, Active listening, Review & FSRS), Data (Privacy, Danger zone) — with the active panel highlighted.
    - Deep-linking to a sub-panel (e.g. `/settings/privacy`) opens that panel directly with the correct nav item active.
    - Each panel shows a title and one-line description of what it controls (e.g. "Privacy — what we store and what you control").
  - *Business rules / validation:* Sub-nav items shown are role-scoped (e.g. a Team seat sees no billing controls; a frozen account sees panels read-only). The upgrade nudge ("Go Verified Pro") is hidden for users already on Pro/Teams.
  - *Failure & edge cases:* Unknown sub-path redirects to the settings home, not a 404 within the shell. If a panel fails to load its data, the shell and nav still render with an inline retry on the failed panel only.

- **[SETTINGS-02] As a Self-directed Learner (LEARNER-SELF), I want to edit my profile (photo, full name, display name, language, timezone), so that my identity and locale are correct across VeriLearn.** — *Priority:* MVP — *Why this priority:* Display name and timezone are load-bearing (community attribution and FSRS "due today" boundaries), not cosmetic.
  - *Acceptance criteria:*
    - Editable fields: profile photo (Change photo), full name, display name, language, timezone; a joined-date and role badge ("Verified Learner · joined Mar 2026") are shown read-only.
    - Changes are staged and committed via explicit **Save changes** / **Cancel**; Cancel restores the last saved values.
    - A successful save confirms with a toast and updates the display name everywhere it is echoed (community, header).
  - *Business rules / validation:* Display name length/charset limits and profanity/impersonation checks; timezone is a valid IANA zone; language from the supported set. Display name is the only name surfaced publicly in Community; full name is never shown publicly unless the user opts in.
  - *Failure & edge cases:* Changing timezone must not silently reschedule existing FSRS cards' absolute times — it re-derives the *day boundary* for "due today" and warns if it shifts today's queue. Photo upload rejects oversized/invalid files with an inline error and keeps the prior photo. Duplicate display name is allowed (names aren't unique) but impersonation of staff/verified handles is blocked.

- **[SETTINGS-03] As a Self-directed Learner (LEARNER-SELF), I want to change my email and reach my sign-in security controls from Settings, so that I can keep my account address current and secure.** — *Priority:* Should-Have — *Why this priority:* Necessary account hygiene, but the security mechanics themselves are owned by Auth, so Settings is mostly an entry point.
  - *Acceptance criteria:*
    - The Profile panel exposes the current email and a Change-email action, plus links to Auth-owned controls (password, two-factor, active sessions).
    - Initiating an email change hands off to the Auth verification flow; the new address becomes active only after Auth confirms it.
    - Security actions (password reset, 2FA enrollment, session revocation) are launched from here but rendered/owned by Auth.
  - *Business rules / validation:* Email uniqueness across the tenant is enforced by Auth; the old address stays active until the new one is verified. SSO-provisioned (Teams) accounts cannot change the email locally — it is managed by the identity provider.
  - *Failure & edge cases:* If the target email already belongs to another account, the change is rejected with a neutral, non-enumerating message. If verification is left pending, the account keeps the old address; a stale pending change expires. For SSO accounts, the field is read-only with an explanatory note pointing to the org admin/IdP.

- **[SETTINGS-04] As a Self-directed Learner (LEARNER-SELF) on Free, I want to see my current plan and usage against limits, so that I understand when I'm about to hit the 3-topic ceiling.** — *Priority:* MVP — *Why this priority:* The Free→Pro nudge is the primary monetization lever and depends on the user seeing the limit before they hit a wall.
  - *Acceptance criteria:*
    - Plan & billing shows the current plan (Free — "3 active topics · standard verification"), usage meters ("Active topics 3 of 3", "Verification runs 18 of 30"), and an Upgrade-to-Pro entry.
    - At the limit, a clear warning appears ("You've hit your topic limit — upgrade for unlimited topics") with a direct link into the Upgrade flow.
    - Meters reflect live state from Topics/Pipeline (not a cached stale count).
  - *Business rules / validation:* Free = 3 active topics, standard verification, no Skeptic hard mode; Pro = unlimited topics + hard mode; Teams = Pro + shared library at seat pricing. "Active topics" counts non-archived topics owned by the user. Upgrade action routes to the Monetization/Checkout flow (not owned here).
  - *Failure & edge cases:* If usage data is unavailable, meters show a skeleton and a retry rather than "0 of 3" (which would falsely imply capacity). A Team seat sees "your seat is provided by <Org>" instead of personal usage and no Upgrade button.

- **[SETTINGS-05] As a Self-directed Learner (LEARNER-SELF), I want to view my payment method and billing history, so that I can confirm what I'm being charged and retrieve invoices.** — *Priority:* Should-Have — *Why this priority:* Expected of any paid product, but the transactional flow (adding a card, charging) is owned by Monetization, so this is largely a read surface.
  - *Acceptance criteria:*
    - Shows payment method ("No card on file" on Free; masked card on Pro) and billing history (invoice list, or "No invoices yet — you're on the Free plan").
    - Each invoice is downloadable; amounts, dates, and plan reflect the billing source of truth.
    - Adding/updating a card hands off to the Monetization/Checkout surface.
  - *Business rules / validation:* Only the account/billing owner can view billing; Team **seat** learners never see billing (owned by their Org's BILLING-ADMIN). No raw card data is stored or shown by VeriLearn — only a tokenized last-4/brand from the payment processor.
  - *Failure & edge cases:* If the payment processor is unreachable, show the last-known cached invoice list flagged "may be delayed" and disable card edits. A failed/declined renewal surfaces here as a dunning banner with a fix-payment link, but does not itself alter learning content.

- **[SETTINGS-06] As a Self-directed Learner (LEARNER-SELF) downgrading from Pro to Free, I want a clear explanation of what happens to my extra topics, so that I don't lose access silently.** — *Priority:* Should-Have — *Why this priority:* A silent downgrade that strands >3 topics would break trust; explicit but rarer than the upgrade path.
  - *Acceptance criteria:*
    - Before confirming a downgrade, the user sees exactly what changes: topics beyond 3 become **read-only/archived (not deleted)**, and Skeptic hard mode / thorough depth revert to standard for future lectures.
    - The user chooses *which* topics remain active if they are over the limit; nothing is auto-picked without disclosure.
    - Downgrade takes effect at end of the paid period; existing verified ledgers are untouched.
  - *Business rules / validation:* Downgrade never deletes content — over-limit topics are archived and restorable by re-upgrading. Already-issued trust states and certificates are unaffected (a plan change cannot alter the ledger — see invariants).
  - *Failure & edge cases:* If the user has 8 topics and doesn't choose, the system archives the least-recently-active surplus and tells them which and how to restore. Attempting to *create* a new topic while over the archived limit is blocked with the upgrade nudge, not a data loss.

- **[SETTINGS-07] As a Team Seat Learner (LEARNER-TEAM), I want a settings surface that reflects that my plan and some privacy choices are governed by my organization, so that I'm not confused by controls I can't actually change.** — *Priority:* Should-Have — *Why this priority:* Teams is the B2B revenue path and the seat experience must be coherent, but it layers onto the same shell.
  - *Acceptance criteria:*
    - Billing controls are absent; a note states the seat is provided by the org and points questions to the org admin.
    - Org-locked privacy toggles (e.g. "share progress with my instructor") render disabled with a "set by <Org> policy" label rather than being hidden.
    - Profile and personal learning prefs (active listening, review tuning within org bounds) remain editable.
  - *Business rules / validation:* Org policy overlays and can *lock* specific privacy/visibility toggles; it can never unlock deletion of the org's shared library from a seat. A seat learner cannot delete the account's shared topics, only their own private ones (if permitted).
  - *Failure & edge cases:* If the org policy changes while the seat is editing, locked controls revert with a non-destructive notice. Losing the seat (org removes it) converts the account per policy — either to Free with archived personal topics or full deactivation — with prior disclosure, never a silent data wipe.

- **[SETTINGS-08] As a Skeptical / Expert Learner (LEARNER-SKEPTIC), I want to set verification depth, Skeptic aggressiveness, sandbox execution, interpretive-claim visibility, and dispute alerts, so that I control how hard the spine works on my future lectures.** — *Priority:* MVP — *Why this priority:* These controls are the verification-first product expressing its thesis in settings; they are the reason an expert stays.
  - *Acceptance criteria:*
    - Controls: verification depth (Minimal / Standard / Thorough), "Show interpretive claims", "Alert me to new disputes", "Run the execution sandbox", Skeptic aggressiveness (Gentle / Balanced / Ruthless), committed via Save/Reset.
    - The panel explicitly states **"Changes apply to future lectures"** and does not alter any already-verified topic.
    - Thorough depth and Ruthless (hard-mode) Skeptic are gated to Pro/Teams; on Free they render locked with an upgrade nudge.
  - *Business rules / validation:* **Invariant:** no value here re-runs, re-certifies, or downgrades an existing claim's trust state — the ledger is append-only with respect to personal preference; settings only parameterize *new* pipeline runs. Free plan caps depth at Standard and Skeptic below hard mode. Turning the sandbox off means future computational claims can reach at most Sourced, never Verified·execution — disclosed in the toggle's help text.
  - *Failure & edge cases:* Toggling the sandbox off does not retroactively strip existing Verified·execution tags. If a user expects a change to affect a *running* pipeline, the UI states it will apply to the next run and offers a re-verify action (which is a new pipeline run, honestly a fresh ledger draft, not an in-place edit).

- **[SETTINGS-09] As an Exam-prep Student (LEARNER-EXAM), I want to toggle each active-listening prompt type and set their frequency, so that I can trade engagement gates for reading speed under deadline.** — *Priority:* Should-Have — *Why this priority:* Real learner-autonomy need, but the loop ships with sane defaults and the behavior is owned by the Lecture domain.
  - *Acceptance criteria:*
    - Toggles for Predict, Pause-point, Cloze, Connection, and Close-gate, plus a frequency selector (Light / Balanced / Intensive), committed via Save/Reset.
    - The Close-gate is marked "Recommended" and the panel warns that disabling gates reduces the reliability of the honest signals that depend on them.
    - Saved values are consumed by the Lecture domain for future sections.
  - *Business rules / validation:* Learners may disable any/all prompts (autonomy is respected), **but** when gates that feed calibration/retention are off, the Progress/Reports surface must flag those signals as "reduced confidence" rather than present a number the settings undermined. Frequency changes affect future sections only.
  - *Failure & edge cases:* Disabling all prompts is allowed with an explicit confirmation that Transfer/Calibration signals will be marked unreliable. A change mid-lecture applies at the next section boundary, never retroactively unlocking a Next-gate already in front of the learner.

- **[SETTINGS-10] As a Returning Power-Learner (LEARNER-POWER), I want to tune target retention, daily review limit, max interval, the confidence gate, seeded error-drills, and the daily reminder, so that I can balance workload against how solidly I remember.** — *Priority:* Should-Have — *Why this priority:* Central to the power-learner, but the FSRS domain owns the scheduling mechanics; Settings is the control surface and system of record.
  - *Acceptance criteria:*
    - Controls: target-retention slider (bounded, e.g. 80–95%), daily review limit, max interval, and toggles for confidence gate, seeded error drills, and daily reminder — committed via Save/Reset.
    - Each control carries plain-language consequence copy ("higher = remember more, review more often").
    - Changing target retention triggers an FSRS recompute of future intervals (owned by the Review domain), applied on save, not silently.
  - *Business rules / validation:* Bounds are enforced (retention floor/ceiling, non-negative limits, sane max interval). Disabling the confidence gate means cards contribute no calibration data-point (per Review domain); disabling seeded drills removes Drill-detection sampling — both disclosed. Settings persists the values; the scheduler reads them.
  - *Failure & edge cases:* Lowering the daily limit below today's already-started queue does not discard in-progress cards; it caps *tomorrow's* pull. If the FSRS recompute fails, the prior schedule is retained and the save is reported as failed (no half-applied schedule).

- **[SETTINGS-11] As a Self-directed Learner (LEARNER-SELF), I want an honest, plain statement of what VeriLearn stores and what it never does, so that I can trust the platform's data conduct as much as its content.** — *Priority:* MVP — *Why this priority:* A verification-first product that is opaque about its own data handling contradicts its thesis; transparency here is brand-critical.
  - *Acceptance criteria:*
    - Privacy panel lists what is stored (topics, lectures & claim ledger; review history & FSRS schedule; gap map & discussion threads) and an explicit never-clause ("We never sell your data or train public models on it").
    - The statement is versioned and links to the full policy; material changes are surfaced to the user.
    - The never-clause is a binding commitment reflected in actual data pipelines, not marketing copy.
  - *Business rules / validation:* The stored-items list must stay accurate as the data model evolves (kept in sync with the export contents — SETTINGS-13). Analytics used to "improve VeriLearn" must be de-identified. No personal learning content feeds public-model training.
  - *Failure & edge cases:* If the policy version changes, prior consent choices are preserved but the user is notified; a user who declines a materially expanded scope keeps the narrower prior scope.

- **[SETTINGS-12] As a Self-directed Learner (LEARNER-SELF), I want to control anonymous analytics, my community profile visibility, and product emails, so that I decide how visible and how tracked I am.** — *Priority:* MVP — *Why this priority:* Baseline consent controls; legally and ethically required and cheap to honor.
  - *Acceptance criteria:*
    - Toggles: "Anonymous usage analytics" (de-identified), "Show my profile in Community", "Product emails".
    - Toggling analytics off is honored at collection time going forward (opt-out means data is not collected/associated, not merely hidden).
    - Turning off community visibility removes the user's name from thread attribution surfaces going forward.
  - *Business rules / validation:* Analytics is de-identified regardless of the toggle; the toggle governs whether *any* usage telemetry is gathered. Product emails toggle governs marketing/tips only, never transactional/security or legally required notices. Community visibility interacts with the Community domain's attribution.
  - *Failure & edge cases:* If a downstream analytics consumer is briefly unaware of an opt-out (propagation lag), the collection layer still drops the events — opt-out is enforced at source, not just at read. Turning visibility off does not retroactively scrub the user's name from already-quoted replies but stops new attribution and delists them from leaderboards per Community rules.

- **[SETTINGS-13] As a Returning Power-Learner (LEARNER-POWER), I want to export everything as JSON — topics, reviews, gaps, and the claim ledger — so that I own a faithful, portable copy of my learning.** — *Priority:* Should-Have — *Why this priority:* Portability is a trust signal and a DSAR building block; valued highly by power users though used infrequently.
  - *Acceptance criteria:*
    - "Request export" produces a downloadable JSON bundle containing topics, lectures, the **full claim ledger (claims, trust states, sources, confidence, coverage matrix)**, review history + FSRS schedule, gap map + threads, calibration, and certificate metadata.
    - The export is generated asynchronously; the user is notified when ready and given a time-limited, authenticated download link.
    - The bundle's structure is documented/stable for the Developer/API consumer.
  - *Business rules / validation:* The export must be **faithful** — trust states and sources are included, not stripped to prose (honesty extends to the export). Requests are rate-limited to prevent abuse. The download link expires and requires the requester's authentication.
  - *Failure & edge cases:* A very large portfolio export must stream/chunk rather than time out; if generation fails midway, no partial link is issued and the user can retry. Repeated rapid requests are throttled with a "your last export is still processing / try again in N minutes" message. Expired links require a fresh request, not re-issuance of the old file.

- **[SETTINGS-14] As a Compliance / Data-Protection Officer (COMPLIANCE-DPO), I want to fulfill formal DSAR access/erasure requests and enforce retention schedules, so that VeriLearn meets its data-protection and education-record obligations.** — *Priority:* Should-Have — *Why this priority:* Legally mandatory for a product handling learner (and potentially minor/education) records, distinct from the self-service export.
  - *Acceptance criteria:*
    - The DPO can locate a subject's full data footprint, produce a machine-readable access package, and execute an erasure that cascades across topics, ledger, reviews, gaps, and threads.
    - Retention schedules are configurable per data class and applied automatically (e.g. auto-purge of soft-deleted data after the grace window).
    - Every DSAR action is logged with actor, scope, timestamp, and legal basis.
  - *Business rules / validation:* Erasure of personal data must reconcile with certificate/audit retention (see invariant I7): personal content is erased while a minimal, non-personal certificate verification record may be retained per legal basis, disclosed to the subject. FERPA/COPPA handling applies where the account is an education record or a minor. The DPO governs data, never trust states.
  - *Failure & edge cases:* An erasure requested for a subject who is also a Teams admin or sole seat owner must resolve dependencies (reassign/transfer) before purge, not orphan a tenant. A legal hold overrides auto-purge and blocks erasure until lifted, with the conflict surfaced.

- **[SETTINGS-15] As a Parent / Guardian (GUARDIAN), I want age-appropriate account handling and consent for a dependent, so that a minor's use of VeriLearn is lawful and safe.** — *Priority:* Future — *Why this priority:* A known, honestly-acknowledged product gap (today only a single shared account exists); important but not the MVP surface.
  - *Acceptance criteria:*
    - Signup captures/derives an age band; under-threshold accounts require verifiable guardian consent before personal data is processed.
    - A guardian can hold billing and safety controls for the dependent and receive a documented disclosure of the current single-shared-account limitation.
    - COPPA/FERPA-relevant data minimization applies to minor accounts (e.g. no community exposure by default).
  - *Business rules / validation:* No public community profile for minors by default; product emails/marketing suppressed for minors. The guardian owns billing/safety but cannot certify claims or alter trust states. Until true linked guardian/dependent accounts exist, the shared-account limitation is disclosed rather than hidden.
  - *Failure & edge cases:* If age is misrepresented and later corrected to a minor, the account is retroactively placed under the minor policy (community delisted, consent required) rather than continuing under adult defaults. Absence of guardian consent for a minor blocks non-essential data processing, not core (already-consented) safety functions.

- **[SETTINGS-16] As a Self-directed Learner (LEARNER-SELF), I want to reset my review history from the Danger zone with a clear, confirmed action, so that I can start FSRS fresh without nuking my topics.** — *Priority:* Should-Have — *Why this priority:* A real recovery/reset need with a bounded blast radius, but rare and non-MVP.
  - *Acceptance criteria:*
    - "Reset review history" clears the FSRS schedule and ratings while explicitly preserving topics and lectures ("Your topics & lectures stay").
    - The action requires a confirmation step that states exactly what is cleared and what is kept.
    - After reset, cards re-enter scheduling as new; the ledger is untouched.
  - *Business rules / validation:* Reset affects only FSRS/calibration data owned by the Review domain; it never touches trust states, sources, or gaps. It is scoped to the requesting user's own data.
  - *Failure & edge cases:* Resetting mid-review-session invalidates the in-progress session gracefully (no crash) and returns the user to a clean queue. Because it is destructive, the action is undoable by Support within the grace/retention window (SETTINGS-21), but not by the learner after confirmation.

- **[SETTINGS-17] As a Self-directed Learner (LEARNER-SELF), I want to reset my gap map, so that I can clear tracked misconceptions and their threads when they're stale.** — *Priority:* Nice-to-Have — *Why this priority:* Useful cleanup, but the gap map is designed to persist across the learning lifecycle, so wholesale reset is uncommon.
  - *Acceptance criteria:*
    - "Reset gap map" deletes all tracked gaps and their discussion threads after an explicit confirmation naming the blast radius.
    - Topics, lectures, ledger, and review history are unaffected.
    - After reset, future misconceptions repopulate the gap map normally.
  - *Business rules / validation:* Deletes Gap Map-owned objects only; does not alter any claim's trust state or delete the lecture sections gaps pointed to. Scoped to the user's own gaps (a Team seat cannot reset shared/org gaps).
  - *Failure & edge cases:* If a reset races with a live event/community action that is *creating* a gap, the operation is atomic — either the new gap is included in the reset or created cleanly after, never left dangling with a broken thread reference.

- **[SETTINGS-18] As a Self-directed Learner (LEARNER-SELF), I want to delete all my topics, so that I can wipe my learning content while keeping my account.** — *Priority:* Nice-to-Have — *Why this priority:* Supports a clean-slate use case, but heavier deletions are rarer than resets.
  - *Acceptance criteria:*
    - "Delete all topics" permanently removes every topic, lecture, and claim ledger after explicit confirmation of irreversibility.
    - Dependent data (reviews tied to those topics, gaps sourced from them) is cascaded consistently.
    - The account, profile, and settings survive; usage meters reset accordingly.
  - *Business rules / validation:* Cascade must be consistent — no orphaned review cards or gap references pointing at deleted claims. Certificates already earned from those topics are **not** silently invalidated (see I7). A Team seat can delete only its own private topics, never the org's shared library.
  - *Failure & edge cases:* Deleting topics with a certificate attached prompts the user that the underlying content will be gone but the issued certificate's verification record persists (or offers to revoke it explicitly). If a deletion partially fails, it rolls back rather than leaving a half-deleted ledger.

- **[SETTINGS-19] As a Self-directed Learner (LEARNER-SELF), I want to delete my entire account with a deliberate confirmation, so that I can exercise my right to leave and take my data down with me.** — *Priority:* MVP — *Why this priority:* A legal/ethical baseline (right to erasure) and a trust signal for a privacy-forward product.
  - *Acceptance criteria:*
    - Account deletion requires typing DELETE to confirm and states plainly that it is permanent and cannot be undone.
    - Deletion enters a disclosed grace window (e.g. 14–30 days) during which the user can cancel, after which personal data is hard-deleted and cascaded.
    - Before confirming, the user is told what happens to certificates, community contributions, and (if applicable) Teams roles.
  - *Business rules / validation:* Certificate handling follows I7 — personal data is erased while a minimal, non-personal cert verification record may be retained for employer verification unless separately revoked. A sole Teams/Org admin cannot self-delete without first transferring ownership. Community contributions are anonymized (not necessarily deleted) per Community rules so threads remain coherent.
  - *Failure & edge cases:* Deletion requested while a verification pipeline is running cancels the run cleanly rather than leaving a zombie job. A frozen/under-investigation account (SETTINGS-22) cannot be deleted until the hold lifts, with the reason surfaced. Attempting deletion with an outstanding paid-plan balance routes through billing settlement first, disclosed up front.

- **[SETTINGS-20] As a Self-directed Learner (LEARNER-SELF), I want my settings changes to save reliably or fail loudly, so that I never think a preference stuck when it didn't.** — *Priority:* MVP — *Why this priority:* Silent save loss on privacy/verification/FSRS settings is a correctness and trust failure, not a cosmetic one — a core failure-mode story.
  - *Acceptance criteria:*
    - On save success, an explicit confirmation is shown; on failure (network/server), the change is rolled back in the UI to the last saved state with a clear error and retry.
    - Concurrent edits from two devices are reconciled deterministically (version/etag check) — a stale write is rejected with a "settings changed elsewhere, reload" prompt rather than silently clobbering.
    - Unsaved changes prompt on navigation away (dirty-state guard).
  - *Business rules / validation:* Changes that affect scheduling or the pipeline (FSRS retention, verification depth) apply only on confirmed save, never optimistically on the server. Optimistic UI is permitted only for cheap toggles and must reconcile to server truth.
  - *Failure & edge cases:* Offline: saves are blocked with a clear offline banner rather than queued-and-forgotten; the user retries when back online. A partial multi-field save (some fields accepted, some rejected by validation) reports per-field errors and does not commit the valid subset silently — the panel stays dirty until fully valid.

- **[SETTINGS-21] As a Support Agent (SUPPORT-AGENT), I want to repair a learner's account/settings state under scoped, logged consent, so that I can undo accidental resets and unstick accounts without ever fabricating learning signals.** — *Priority:* Should-Have — *Why this priority:* Support recoverability is essential for the destructive actions this domain contains, but it must be tightly firewalled — a governance-critical story.
  - *Acceptance criteria:*
    - With a valid scoped-consent token from the user, the agent can restore review history/gaps deleted within the retention window, correct profile/timezone, and unstick a stuck settings save.
    - Every action is logged with actor, scope, consent reference, and before/after state.
    - The agent interface exposes operational state only — it cannot set a trust state, issue a certificate, or write a calibration/retention value.
  - *Business rules / validation:* **Firewall:** Support can restore or unstick data that already existed but can never *manufacture* a learning signal (no fabricated streaks, scores, calibration, or certs). Actions outside the consent scope are refused. Restores are only possible within the retention/grace window before hard-purge.
  - *Failure & edge cases:* An attempt to act without a live consent token is blocked and audited. A requested restore beyond the retention window returns "data has been permanently purged" rather than reconstructing plausible-but-fake data. Consent expiry mid-action halts further steps and logs the partial state.

- **[SETTINGS-22] As a Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD), I want to freeze an abusive account so its settings become read-only and deletion is blocked, so that gaming or fraud can be investigated without evidence being wiped.** — *Priority:* Should-Have — *Why this priority:* Protects ledger/certificate integrity against calibration-juking, vote-rings, and cert fraud — the failure-mode that guards the moat.
  - *Acceptance criteria:*
    - Freezing an account renders its settings and danger-zone actions read-only and blocks self-deletion/export-as-cover for the duration of the hold.
    - The frozen user sees an honest status and a route to appeal/support, not a silent lockout.
    - Trust & Safety can revoke fraudulent certificates and reverse gamed signals, all logged, without hand-certifying anything.
  - *Business rules / validation:* Freeze overrides the user's deletion/export controls (evidence preservation) but must be time-bounded or reviewed; it never grants T&S the ability to *set* a Verified state or resolve a Conflict. Revocation flips a certificate's verification status (visible to employers) rather than deleting audit history.
  - *Failure & edge cases:* A deletion already in its grace window when a freeze lands is paused, not completed, until the hold resolves. If a freeze is applied in error, lifting it fully restores the user's control with no residual read-only state. An account frozen mid-review must not lose legitimate in-progress data.

- **[SETTINGS-23] As an Accessibility-Reliant Learner (A11Y-LEARNER), I want every settings control — sliders, toggles, and destructive confirmations — fully operable via assistive tech, so that governing my account and data is not gated on sight or a timer.** — *Priority:* MVP — *Why this priority:* Accessibility is a core stress test for VeriLearn, and settings include high-stakes irreversible actions that must be operable by everyone.
  - *Acceptance criteria:*
    - Retention/frequency sliders, depth/aggressiveness selectors, and all toggles are keyboard-operable with visible focus, correct roles/labels, and state announced to screen readers (not color-only).
    - The delete-account "type DELETE" confirmation and all danger-zone confirmations are reachable and completable without a mouse and without a timed lockout.
    - Save/error/confirmation outcomes are announced via live regions, not conveyed by color or position alone.
  - *Business rules / validation:* No control may rely solely on color to convey state (e.g. toggle on/off, "at limit" warnings) or on a timeout the user cannot extend. Meets WCAG 2.2 AA for forms, focus order, and error identification.
  - *Failure & edge cases:* If a slider's fine value is hard to hit with a keyboard, discrete stepping and a numeric entry are provided. Validation errors move focus to the first offending field with an announced message. A destructive confirmation never auto-dismisses on a timer that assistive-tech users cannot control.

### Business rules & invariants

- **I1 — Settings never mutate the ledger.** No preference (verification depth, Skeptic aggressiveness, sandbox on/off, interpretive visibility) can re-certify, downgrade, hide, or delete an *existing* claim's trust state. Verification/Skeptic settings parameterize **future** pipeline runs only ("changes apply to future lectures"). The trust ledger is append-only with respect to personal configuration.
- **I2 — Blast radius must match confirmation.** Every destructive action is labeled with exactly what it clears and what it keeps; friction scales with irreversibility (a toggle < a reset with a confirm < delete-account with typed DELETE + grace window).
- **I3 — Explicit save, never silent apply.** Changes that affect scheduling, the pipeline, or money are staged and committed via Save/Cancel/Reset; the server applies them only on confirmed save. Cheap privacy toggles may autosave but must reconcile to server truth and confirm.
- **I4 — Honesty extends to data conduct.** The Privacy panel's "what we store / we never sell or train public models on it" is binding and kept in sync with the actual export contents and data pipelines. Analytics is de-identified and opt-out is enforced at collection, not just at display.
- **I5 — Faithful export.** The data export includes the full claim ledger with trust states, sources, confidence, and the coverage matrix — not prose stripped of its epistemics.
- **I6 — Role- and policy-scoped surface.** The settings a principal sees are scoped by role: Team seats have no billing and possibly org-locked privacy toggles; guardians hold billing/safety for minors; frozen accounts are read-only; vendor roles (Support/Platform/T&S) act only within logged, scoped authority and never on epistemic content.
- **I7 — Deletion and certificate revocation are decoupled.** Deleting an account or topics erases personal data but does not silently invalidate issued certificates that employers rely on; a minimal, non-personal certificate verification record may be retained per legal basis and is disclosed to the user before deletion. Revocation (by Trust & Safety) is a separate, explicit act.
- **I8 — Vendor actions are firewalled and audited.** No vendor role can fabricate a learning signal, calibration value, or certificate via settings; every Support/Platform/Trust-Safety action on an account is logged with actor, scope, consent basis, and before/after state, and restores are bounded by the retention window.
- **I9 — Minor-safe defaults.** Under-threshold accounts default to no public community profile, suppressed marketing, and data minimization, and require verifiable guardian consent before non-essential processing.

### Cross-domain dependencies

- **Auth (20):** Owns password, two-factor, session management, email verification, and SSO. Settings links out to these and initiates email-change; it does not implement the security mechanics. SSO-provisioned accounts get read-only identity fields here.
- **Monetization / Upgrade & Checkout:** Owns the Checkout transaction, card capture, charging, and the seat ceiling (BILLING-ADMIN). The Plan & billing panel consumes plan/usage/invoice state and routes upgrade/downgrade/card actions to that flow.
- **Review / FSRS (26):** Owns the scheduling and calibration behavior behind the Review & FSRS panel; Settings renders the controls, persists preferences, and triggers recompute — the scheduler reads them.
- **Lecture (23):** Consumes the active-listening toggles and frequency for future sections; Settings only stores the choices.
- **Pipeline / Skeptic / Execution Sandbox (22/25):** Consume verification depth, Skeptic aggressiveness, sandbox-on, interpretive visibility, and dispute-alert preferences for future runs; Settings never edits their output.
- **Notifications (31):** Owns delivery of the daily reminder, dispute alerts, and product emails; Settings owns the preference toggles that gate them.
- **Gap Map (27) & Topics/Pipeline:** Danger-zone actions delete Gap Map objects and Topics/ledger content; usage meters reflect Topics state.
- **Tests & Certificates (28):** Account/topic deletion and Trust-Safety freeze interact with issued certificates (I7); EMPLOYER-VERIFIER depends on certs surviving deletion unless revoked.
- **Community (29):** Community profile-visibility toggle and deletion-time anonymization of contributions are governed jointly.
- **Reports / Progress:** When gates are disabled here, Reports must flag the affected honest signals as reduced-confidence rather than present undermined numbers.
- **Organization / Teams Admin domain:** Provides the tenant progress-visibility policy that overlays and can lock seat privacy toggles, and the seat lifecycle that governs whether a seat account exists.

### Key technical requirements

- **Preferences store:** A per-user settings store with explicit-save semantics, optimistic UI only for cheap toggles, dirty-state guards, and cross-device concurrency control (version/etag) that rejects stale writes rather than clobbering silently.
- **Data export pipeline:** Asynchronous, chunked/streamed JSON generation covering topics, lectures, full claim ledger (trust states, sources, confidence, coverage matrix), review history + FSRS schedule, gaps + threads, calibration, and certificate metadata; delivered via a time-limited, authenticated link; rate-limited; documented stable schema for DEVELOPER-API; DSAR SLA for COMPLIANCE-DPO.
- **Deletion & retention:** Hard-delete with a disclosed grace/undo window, consistent cascade across topics/ledger/reviews/gaps (no orphans, atomic rollback on partial failure), certificate tombstoning per I7, configurable retention schedules per data class, and legal-hold override.
- **Consent & privacy enforcement:** Opt-out honored at the collection layer (source-level suppression, not read-time filtering), de-identified analytics, versioned policy/consent records, and COPPA/FERPA-aware handling for minor/education accounts.
- **Access control & audit:** Role/policy-scoped rendering (seat, guardian, admin, frozen), org-policy overlay that can lock specific toggles, scoped-consent tokens for Support, and an immutable audit log (actor, scope, consent, before/after) for all vendor-side actions.
- **Localization & timezone correctness:** Language and IANA timezone drive date formatting, reminder timing, and — critically — FSRS "due today" day boundaries; changing timezone re-derives boundaries without rewriting absolute schedule times.
- **Latency & resilience:** Fast settings reads (target <200 ms) with graceful skeletons; billing/usage reads tolerate processor outages with cached, clearly-flagged fallbacks; FSRS/verification recomputes run asynchronously and never leave a half-applied state.
- **Accessibility:** WCAG 2.2 AA across all controls — keyboard operability, visible focus, non-color state encoding, live-region announcements for save/error, discrete/numeric alternatives to sliders, and no purely-timed confirmations.

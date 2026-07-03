## Authentication, Onboarding & Identity

### Overview

This domain owns **who a user is, how they prove it, and how they first enter the product** — everything from an anonymous guest touching the ephemeral demo, through sign-up / sign-in, email verification, first-run onboarding, profile and identity management, Teams invite acceptance and SSO, session lifecycle, and the identity teardown at account deletion. It is the front door to VeriLearn and the substrate every other domain assumes.

Why it matters to the product thesis: VeriLearn competes on **honest, earned trust**, and its central architectural rule is that **authority over truth is decoupled from identity**. Knowing *who someone is* grants them *access* to surfaces and *administrative scope* — it must never grant them *epistemic power* to decree a claim `Verified`. This domain is where that firewall is first drawn: authentication establishes identity and role; it deliberately does **not** confer the ability to move a claim's trust state, fake a signal, or gift a certificate. Two things also make identity unusually load-bearing here: (1) **certificates** carry a person's real identity and are consumed by external verifiers, so the name/email bound to an account is part of the credential's integrity; and (2) **honest signals** (what a learner got wrong, where they are overconfident) are genuinely sensitive data, so account security and tenant isolation are trust-and-safety concerns, not hygiene. Onboarding's job is to get a learner from "is this real?" to their first *verified* topic while honestly setting expectations about what is Free vs. gated.

### Personas involved

- **Guest / Visitor (GUEST):** Touches the ephemeral demo pre-auth; hits the auth wall on any persisting action; converts to a Free account or self-selects out. Persists nothing.
- **Self-directed Learner (LEARNER-SELF):** The default sign-up path — email/password or social, email verification, first-run Welcome, first topic nudge. The primary onboarding target.
- **Exam-prep / Power / Skeptic Learners (LEARNER-EXAM, LEARNER-POWER, LEARNER-SKEPTIC):** Same auth substrate; power/skeptic users especially want MFA, session control, and account security to protect a large portfolio and their calibration record.
- **Team Seat Learner (LEARNER-TEAM):** Enters via an **org invite / SSO**, not self-serve sign-up; activates a seat; lands on the shared library rather than an empty New Topic. Owns no billing or seats.
- **Instructor / Educator (INSTRUCTOR) & Event Host (EVENT-HOST):** Teams roles *assigned* by ORG-ADMIN at provisioning; identity carries a pedagogical/facilitation scope but no certification power.
- **SME-Reviewer, Community Moderator, Contributor (SME-REVIEWER, COMMUNITY-MOD, CONTRIBUTOR):** Authenticated users whose role grants scoped authority elsewhere; identity here just gates that role.
- **Organization / Teams Admin (ORG-ADMIN):** Provisions/deprovisions seats, sends/revokes invites, assigns org roles, configures SSO on the tenant, and decides data disposition at offboarding.
- **Billing / Finance Admin (BILLING-ADMIN):** Owns the *paid seat ceiling* that caps how many identities ORG-ADMIN can provision — a dependency, not a control over *who* fills seats.
- **Support Agent (SUPPORT-AGENT):** Performs scoped, consented, audited account actions — reset a login, resend an invite — but is firewalled from fabricating any learning signal.
- **Platform Administrator (PLATFORM-ADMIN):** Provisions tenants, owns the admin role model and SSO integration, holds break-glass — yet cannot read or alter epistemic content.
- **Trust & Safety Lead (TRUST-SAFETY-LEAD):** Freezes, suspends, and bans accounts (gaming, abuse, cert fraud) without ever hand-certifying.
- **Compliance / Data-Protection Officer (COMPLIANCE-DPO):** Sets the identity/consent/retention/age-gating policy (GDPR/FERPA/COPPA) that account creation and deletion must honor; advisory/gatekeeping.
- **Developer / API Consumer (DEVELOPER-API):** Wires SSO and directory-based (SCIM) seat provisioning so ORG-ADMIN isn't inviting by hand.
- **Parent / Guardian (GUARDIAN):** The honest gap — no first-class minor account or guardian↔dependent link today; oversight means sharing one login.
- **Employer / Recruiter (EMPLOYER-VERIFIER):** Never authenticates; relies on the *identity bound to a certificate* being trustworthy.
- **Accessibility-Reliant Learner (A11Y-LEARNER):** Runs every auth flow via assistive tech; auth is a hard accessibility gate before any learning even starts.

### User stories

- **[AUTH-01] As a Guest, I want to try a working demo of the trust ledger without creating an account, so that I can judge whether verification-first learning is real before spending an email address.** — *Priority:* MVP — *Why this priority:* Time-to-first-"aha" (clicking an underlined claim and seeing its source) is the top-of-funnel conversion metric and the product's core proof.
  - *Acceptance criteria:*
    - Guest can open a pre-seeded demo topic and click an underlined claim to see its ledger entry (source, trust state, confidence) with no login.
    - The demo clearly labels which capabilities are live vs. gated (Skeptic hard mode, topic count).
    - All demo interaction state is in-memory/session-scoped and evaporates on tab close.
  - *Business rules / validation:* No server-persisted user record is created for a guest; no PII collected. The demo uses fixed, pre-verified content — a guest cannot run the real pipeline or mutate any ledger.
  - *Failure & edge cases:* On refresh/return, demo resets to its seeded state (nothing was saved) with a non-alarming note; if the demo backend is unavailable, show a static fallback that still communicates the trust-state concept rather than a spinner.

- **[AUTH-02] As a Guest, I want to be prompted to create an account exactly when I try to do something that must persist, so that the ask feels earned rather than upfront.** — *Priority:* MVP — *Why this priority:* The auth wall is the conversion moment; placing it at the value boundary (not the landing page) is core to the funnel.
  - *Acceptance criteria:*
    - Actions that persist state (create a real topic, save a review, adjudicate a Conflict for real, post in Community, register for an Event, earn a certificate) trigger an auth wall.
    - The wall offers sign-up and sign-in, states what a Free account gets (3 topics, no hard mode), and returns the user to their intended action after auth.
    - Any demo intent (e.g., the topic name a guest typed) is carried into the post-signup first-run where feasible, or clearly discarded — never silently lost without notice.
  - *Business rules / validation:* Guest → account conversion creates a Free-tier LEARNER-SELF by default; a guest arriving via a Teams invite link converts to LEARNER-TEAM instead (see AUTH-14).
  - *Failure & edge cases:* If the user abandons at the wall, the demo remains usable (no lockout); deep-linking a persisting action while unauthenticated routes through the wall and back, preserving the target destination.

- **[AUTH-03] As a Self-directed Learner, I want to sign up with email and password, so that I can create my own account and start verified learning.** — *Priority:* MVP — *Why this priority:* The default account-creation path; nothing in the authenticated product exists without it.
  - *Acceptance criteria:*
    - Sign-up captures email + password (and optionally full name), enforces a password policy, and creates an unverified account pending email confirmation (AUTH-05).
    - Duplicate-email attempts are rejected with a message that does not confirm/deny account existence in a way that enables enumeration (generic "check your email to continue").
    - On success the learner lands in first-run Welcome (AUTH-07).
  - *Business rules / validation:* Email is normalized and unique per tenant scope; password meets minimum strength (length + complexity/breach-check); accepting Terms/Privacy is required and timestamped for COMPLIANCE-DPO.
  - *Failure & edge cases:* Reject disposable/known-abuse email domains per policy; rate-limit sign-ups per IP/device; on transient backend failure, no partial account is left in a stuck state (idempotent create).

- **[AUTH-04] As a Self-directed Learner, I want to sign up or sign in with a social/OAuth provider, so that I can start faster without managing another password.** — *Priority:* Should-Have — *Why this priority:* Meaningfully lifts conversion but the email path already unblocks the loop.
  - *Acceptance criteria:*
    - Learner can authenticate via at least one OAuth provider; a first-time social login provisions an account with a verified email from the provider (skipping AUTH-05).
    - If the provider email matches an existing email-account, the flows link to the same identity rather than creating a duplicate (with confirmation).
    - Social sign-in returns the user to their intended destination (respecting AUTH-02 deep links).
  - *Business rules / validation:* Provider-verified email counts as a verified email; account remains subject to the same tenant/role rules; a learner cannot use social login to bypass a Teams SSO requirement on a domain that mandates SSO.
  - *Failure & edge cases:* Provider returns no email, or user denies the scope → fall back to email capture; provider outage → surface the email path; account-linking collision surfaces an explicit "this email already has an account — sign in to link" step.

- **[AUTH-05] As a Self-directed Learner, I want to verify my email address, so that my account (and any future certificate bound to it) is trustworthy.** — *Priority:* MVP — *Why this priority:* Email verification underpins account recovery and certificate integrity for EMPLOYER-VERIFIER.
  - *Acceptance criteria:*
    - A verification link/code is sent on sign-up; clicking it marks the email verified and unlocks any verification-gated capability.
    - Unverified accounts can enter first-run but are blocked from irreversible/credential-bearing actions (e.g., earning a certificate) until verified, with a clear resend affordance.
    - Verification links expire and are single-use.
  - *Business rules / validation:* A certificate may only be issued to a verified identity; changing the primary email re-triggers verification (AUTH-10).
  - *Failure & edge cases:* Expired/used link → friendly "request a new link" with rate-limited resend; email never arrives → resend + support path; verifying an email already verified on another account is rejected.

- **[AUTH-06] As a returning Learner, I want to sign in and have a durable, secure session, so that I return straight to my Library without re-authenticating constantly.** — *Priority:* MVP — *Why this priority:* Daily FSRS-driven return visits are the retention engine; friction here directly costs review adherence.
  - *Acceptance criteria:*
    - Correct credentials establish a session that persists across visits until it expires or is revoked; the learner lands on Dashboard/Library.
    - "Remember me" extends session lifetime within policy; sign-out ends the session.
    - Failed sign-in gives a generic error (no enumeration) and increments a lockout/backoff counter.
  - *Business rules / validation:* Session tokens are scoped to one tenant/identity; sensitive surfaces (Danger zone, billing, role changes) may require recent re-authentication (step-up).
  - *Failure & edge cases:* Repeated failures trigger throttling/temporary lockout with a recovery path; a session for a suspended/deleted account is invalidated immediately (see AUTH-18/AUTH-19).

- **[AUTH-07] As a first-time Learner, I want a first-run Welcome that greets me and points me at my first verified topic, so that I understand the product and take the first action.** — *Priority:* MVP — *Why this priority:* First-run is where the value prop is taught and the first topic (activation) happens; it defines the onboarding funnel.
  - *Acceptance criteria:*
    - Welcome greets by name, shows a "new learner" state with empty stat placeholders ("these fill in once you start your first topic"), a primary "Create your first topic" CTA, example on-ramps, and a 3-step "how it works."
    - Onboarding begins and ends at the Library; completing the first topic replaces the empty state.
    - First-run is shown once; it does not re-appear on subsequent logins.
  - *Business rules / validation:* First-run landing is role-aware — LEARNER-SELF sees the "create your first topic" hero; LEARNER-TEAM sees the shared library (AUTH-14). Topic-creation form/validation itself belongs to the **Topic Creation & Pipeline** domain and is only linked from here.
  - *Failure & edge cases:* If the learner skips creating a topic, the empty/first-run dashboard persists as the default with the CTA still primary; example on-ramps must degrade gracefully if the example content is unavailable.

- **[AUTH-08] As a Learner who forgot my password, I want to securely reset it, so that I can regain access without losing my topics, reviews, and gaps.** — *Priority:* MVP — *Why this priority:* Account recovery is a baseline expectation; its absence causes permanent lockout and support load. *(Failure/recovery story.)*
  - *Acceptance criteria:*
    - Requesting a reset sends a time-limited, single-use link to the verified email; using it lets the learner set a new password and signs them in.
    - The request response is identical whether or not the email exists (anti-enumeration).
    - Completing a reset invalidates all other active sessions.
  - *Business rules / validation:* Reset tokens expire quickly and are single-use; new password must meet the policy and differ from a detected breached value; social-only accounts are guided to their provider instead.
  - *Failure & edge cases:* Expired/reused token → request-again flow; user no longer controls the email → identity-verified support recovery path (SUPPORT-AGENT), never a self-serve bypass; reset requests are rate-limited to prevent inbox flooding.

- **[AUTH-09] As a Learner, I want to manage my profile identity — full name, display name, avatar, email, language, timezone — so that VeriLearn reflects who I am and schedules me correctly.** — *Priority:* MVP — *Why this priority:* Timezone drives FSRS due-times and display name drives Community identity; profile is the account's home.
  - *Acceptance criteria:*
    - Learner can edit full name, display name, avatar, language, and timezone with an explicit Save/Cancel; changes persist and reflect across surfaces.
    - Display name governs Community visibility; full name is the identity used on certificates.
    - Timezone changes recompute review due-time boundaries without corrupting existing FSRS schedules.
  - *Business rules / validation:* Full name changes that affect an already-issued certificate are audit-logged (cert integrity); display name is subject to Community naming policy (no impersonation); on Teams, some fields may be org-managed via SSO and read-only.
  - *Failure & edge cases:* Save with a network failure keeps the form dirty and unsaved (no silent loss); invalid/oversized avatar is rejected client-side; profanity/impersonation display names are blocked per policy.

- **[AUTH-10] As a Learner, I want to change my primary email and re-verify it, so that I keep control of recovery and notifications when my address changes.** — *Priority:* Should-Have — *Why this priority:* Common lifecycle need with real security stakes, but not required for first launch.
  - *Acceptance criteria:*
    - Changing email sends verification to the *new* address and keeps the old address active until the new one is confirmed.
    - A security notification is sent to the *old* address so a hijack is visible.
    - Recovery and notifications only switch to the new email after confirmation.
  - *Business rules / validation:* New email must be unique and pass the same rules as sign-up; step-up re-authentication is required to initiate the change; email change is blocked or org-mediated when the account is SSO-managed.
  - *Failure & edge cases:* New address never confirmed → change auto-expires and reverts; attempting to change to an email already in use is rejected without leaking the other account's existence.

- **[AUTH-11] As a Power or Skeptic Learner, I want multi-factor authentication and account-security controls, so that my large portfolio, calibration record, and sensitive honest signals can't be hijacked.** — *Priority:* Should-Have — *Why this priority:* Honest signals and certificates are sensitive enough to warrant MFA, but it can follow the core loop; may be *required* for some Teams tenants.
  - *Acceptance criteria:*
    - Learner can enable TOTP (and/or another second factor) and is prompted for it on sign-in and step-up actions.
    - Recovery codes are issued at enrollment and can be regenerated.
    - Enabling/disabling MFA requires re-authentication and notifies the account.
  - *Business rules / validation:* ORG-ADMIN / PLATFORM-ADMIN may mandate MFA for a tenant or for privileged roles (SME, moderator, admin); disabling MFA on a mandated account is blocked.
  - *Failure & edge cases:* Lost second factor → recovery-code path, then identity-verified support recovery; MFA prompts must be reachable by A11Y-LEARNER (AUTH-22) and never trap a user with a timed-only challenge.

- **[AUTH-12] As a Learner, I want to see and revoke my active sessions and sign out everywhere, so that I can cut off a lost device without changing my password.** — *Priority:* Should-Have — *Why this priority:* Standard security hygiene that protects sensitive data; not blocking for MVP.
  - *Acceptance criteria:*
    - Learner can view active sessions (device/approx. location/last active) and revoke any or all.
    - "Sign out everywhere" invalidates all sessions except optionally the current one.
    - Password reset and MFA changes cascade a global session invalidation.
  - *Business rules / validation:* Revocation takes effect immediately server-side (tokens can't be replayed post-revocation); a revoked session mid-action fails safely on next request.
  - *Failure & edge cases:* Concurrent activity on a revoked session shows a clean "you were signed out" rather than corrupt state; offline clients are logged out on reconnect.

- **[AUTH-13] As a Team Seat Learner, I want to sign in through my organization's SSO, so that I use my work identity and inherit my org's access automatically.** — *Priority:* Should-Have — *Why this priority:* Table-stakes for Teams/enterprise deals, but Teams is a post-MVP monetization tier.
  - *Acceptance criteria:*
    - A learner on an SSO-enabled tenant authenticates via the org IdP (SAML/OIDC) and is dropped into the shared library.
    - SSO-provisioned accounts inherit tenant, role, and org-managed profile fields from the assertion.
    - Just-in-time provisioning creates the seat on first successful SSO login if the invite/allowlist permits.
  - *Business rules / validation:* On tenants that mandate SSO, email/password and social sign-in are disabled for that domain; SSO identity is bound to exactly one tenant; role from the IdP maps to a VeriLearn role but never confers epistemic authority.
  - *Failure & edge cases:* IdP misconfiguration or failed assertion → a clear error routed to ORG-ADMIN/PLATFORM-ADMIN, not a dead end for the learner; seat ceiling exceeded at JIT time → provisioning is blocked with an admin-facing reason (AUTH-15); SSO outage must not silently strip an already-provisioned learner of access to already-earned data.

- **[AUTH-14] As a Team Seat Learner, I want to accept a seat invite and land on the shared library, so that I start inside my org's curated, pre-verified curriculum instead of an empty screen.** — *Priority:* Should-Have — *Why this priority:* Defines the Teams consumer onboarding, which is a distinct funnel from self-serve; ships with the Teams tier.
  - *Acceptance criteria:*
    - Clicking an invite link (as a new or existing user) binds the identity to the org tenant, activates the seat, and lands on the shared library.
    - An existing personal (LEARNER-SELF) account can accept a seat and hold both a personal context and the team seat without merging private topics into the org.
    - First-run for a team seat highlights the shared library and inherited trust, not "create your first topic."
  - *Business rules / validation:* An invite is bound to a specific email; accepting consumes exactly one seat against the paid ceiling; inherited shared content's trust states are read-only to the learner (they can click to inspect but not certify).
  - *Failure & edge cases:* Invite sent to the wrong address, expired, already accepted, or revoked → explicit distinct messages; accepting when the seat ceiling is full → held pending with an admin nudge, never a silent drop; a personal account whose email differs from the invited email must reconcile explicitly.

- **[AUTH-15] As an Organization / Teams Admin, I want to invite, assign roles to, and deprovision members within my paid seat ceiling, so that the right people occupy seats and leavers lose access cleanly.** — *Priority:* Should-Have — *Why this priority:* Core Teams provisioning; required for the Teams tier but after self-serve MVP.
  - *Acceptance criteria:*
    - ORG-ADMIN can send/revoke invites, assign org roles (LEARNER-TEAM, INSTRUCTOR, EVENT-HOST), and deprovision a member, all within the seat ceiling.
    - Deprovisioning immediately revokes the member's tenant access and prompts a **data-disposition decision** (their gap map, personal topics on the seat, and earned certificates).
    - All provisioning actions are audit-logged.
  - *Business rules / validation:* ORG-ADMIN controls *who* fills seats but not the *ceiling* (BILLING-ADMIN) and cannot set price; assigning INSTRUCTOR/SME/EVENT-HOST grants pedagogical/facilitation scope but **never** the power to certify a claim (epistemic firewall); an admin cannot see or provision into another tenant.
  - *Failure & edge cases:* Provisioning beyond the ceiling is blocked with a "raise ceiling with Billing" path; deprovisioning a member with promoted community contributions or issued certificates must preserve those durable artifacts per policy (contributions don't vanish, certs remain verifiable) even as access is revoked; reclaiming a dormant seat must warn if unsynced local state exists.

- **[AUTH-16] As a Developer / API Consumer, I want directory-based (SCIM) auto-provisioning and SSO configuration, so that seats sync with our identity provider instead of manual invites.** — *Priority:* Future — *Why this priority:* Honestly not in the documented product; implied by enterprise Teams needs and worth capturing, but well beyond MVP.
  - *Acceptance criteria:*
    - With org auth, an integration can create, update, and deactivate seats to mirror the org directory.
    - SSO (SAML/OIDC) can be configured per tenant programmatically.
    - Deactivation in the directory propagates to VeriLearn access within policy SLA.
  - *Business rules / validation:* Provisioning APIs cannot exceed the paid seat ceiling or grant plan entitlements (hard mode) beyond the plan; the API can manage identity/seats but **cannot write to the ledger or set any trust state** — the spine is not externally mutable.
  - *Failure & edge cases:* Directory sync conflicts (email reused, role ambiguity) surface reconciliation errors rather than silently overwriting; a deprovision-then-reprovision must not resurrect stale sessions or double-consume seats.

- **[AUTH-17] As a Support Agent, I want scoped, consented, audited access to a user's account, so that I can unbreak their sign-in or invite without ever fabricating a learning signal.** — *Priority:* Should-Have — *Why this priority:* Operational recovery is essential once real users exist, and the firewall it must respect is product-defining.
  - *Acceptance criteria:*
    - SUPPORT-AGENT can access an account only with recorded consent, scoped to the ticket, and time-boxed; every action is audit-logged.
    - Support can resend/reset invites, reset a login, and initiate a Danger-zone deletion on the user's behalf.
    - Support **cannot** mark a claim `Verified`, pass a test, gift a certificate, or edit calibration/retention — those writes are blocked at the permission layer regardless of account access.
  - *Business rules / validation:* Access without consent or beyond ticket scope is denied; support cannot grant seats/entitlements beyond documented courtesy limits, nor ban at platform scale (TRUST-SAFETY).
  - *Failure & edge cases:* Consent expires mid-session → access is cut and must be re-consented; any attempt to touch epistemic state is refused and flagged; impersonation must be visually unmistakable in the audit trail and, where shown, to the user.

- **[AUTH-18] As a Trust & Safety Lead, I want to freeze, suspend, or ban an account and invalidate its sessions, so that I can stop gaming, abuse, or credential fraud immediately.** — *Priority:* Should-Have — *Why this priority:* Protecting the trust ledger and community from account-level abuse is core to a verification-first product, though it follows the base auth stack.
  - *Acceptance criteria:*
    - TRUST-SAFETY-LEAD can freeze (read-only), suspend (no access), or ban (terminate) an account, taking effect on all sessions immediately.
    - A frozen/suspended account sees a clear status and an appeal path, not a generic error.
    - Actions are audited with reason codes and are reversible for freeze/suspend.
  - *Business rules / validation:* A banned identity cannot re-provision under the same email or on the same tenant without review; T&S can quarantine but **cannot** re-certify or resolve a Conflict on the merits — the epistemic firewall holds even for the platform's guardian.
  - *Failure & edge cases:* Banning an account with issued certificates triggers a *certificate review/revocation* referral rather than silent invalidation; freezing during an active pipeline/test halts writes without corrupting in-flight state; wrongful-ban appeals restore access and any voided-but-legitimate signals.

- **[AUTH-19] As a Learner, I want to permanently delete my account with an explicit confirmation, so that I can exercise my right to leave and have my data removed.** — *Priority:* MVP — *Why this priority:* A named Danger-zone action and a legal (DSAR/erasure) obligation the Privacy panel promises. *(Failure/edge-heavy story.)*
  - *Acceptance criteria:*
    - Deletion requires typing `DELETE` to confirm; the destructive button stays disabled until the confirmation matches.
    - Deletion removes the account and its personal content (topics, lectures, ledgers, reviews, gaps) and invalidates all sessions.
    - The user is told, before confirming, what is irreversibly removed and what is retained for legal/integrity reasons.
  - *Business rules / validation:* Deletion policy (immediate vs. grace window, retention exceptions) is owned by COMPLIANCE-DPO and executed here; issued certificates and promoted community contributions may be retained/anonymized per policy so external verification and shared knowledge survive; on a Teams seat, deletion is mediated by tenant data-ownership rules.
  - *Failure & edge cases:* A learner mid-way through a shared conflict or with active community footprint gets a disposition explanation, not a silent orphan; partial-failure during teardown must be resumable (no half-deleted account left signed-in); billing must be settled/cancelled (BILLING-ADMIN) — deletion cannot strand an active subscription.

- **[AUTH-20] As a Platform Administrator, I want strict tenant and identity isolation, so that one org's learners, honest signals, and identities can never leak into another.** — *Priority:* MVP — *Why this priority:* Multi-tenant isolation is a foundational security invariant that every Teams promise and privacy claim depends on.
  - *Acceptance criteria:*
    - Every identity, session, and piece of learner data is scoped to exactly one tenant; cross-tenant reads are impossible through UI or API.
    - PLATFORM-ADMIN can provision tenants and the admin role model and use audited break-glass, but **cannot read or alter epistemic content** in any tenant.
    - SSO, entitlements, and roles are enforced per tenant.
  - *Business rules / validation:* A single human with multiple contexts (personal LEARNER-SELF + a team seat) holds separate scoped identities that do not commingle data; break-glass access is fully audited.
  - *Failure & edge cases:* An authorization bug that would expose cross-tenant data must fail closed (deny) rather than open; a mis-provisioned tenant is quarantined, not partially live; break-glass sessions expire and alert.

- **[AUTH-21] As a Parent / Guardian, I want a first-class way to oversee a minor's account safely, so that I control billing and safety without co-owning my teen's login and reading their private learning.** — *Priority:* Future — *Why this priority:* Stated honestly — VeriLearn has *no* minor-account, age-gating, or guardian link today; this captures a real gap the value prop attracts but the product does not yet serve.
  - *Acceptance criteria:*
    - A guardian↔dependent link exists distinct from sharing one login; the guardian owns billing and safety settings without full read access to private learning content.
    - Age-gating at sign-up routes minors into a COPPA/FERPA-compliant consent flow.
    - A guardian dashboard summarizes "on track and safe" from honest signals without exposing every mistake.
  - *Business rules / validation:* Consent/PII handling for minors is defined by COMPLIANCE-DPO; the guardian, like everyone, cannot self-certify claims; scope of guardian visibility is policy-bounded.
  - *Failure & edge cases:* Until built, the honest interim is a shared/owned account with the privacy trade-off documented, not a fake "kid mode"; an age-declared minor without guardian consent must be blocked from account creation, not silently allowed.

- **[AUTH-22] As an Accessibility-Reliant Learner, I want every authentication and onboarding step to work fully via assistive technology, so that I can get into the product before any learning even begins.** — *Priority:* Should-Have — *Why this priority:* Auth is a hard gate — if it's inaccessible, the entire product is unreachable — and Teams buyers are often procurement-obligated on accessibility.
  - *Acceptance criteria:*
    - Sign-up, sign-in, verification, MFA, password reset, and first-run are fully keyboard-operable, screen-reader-labeled, and free of color-only or timed-only cues.
    - Errors and validation states are announced, not conveyed by color alone.
    - Any timed challenge (MFA code, session-expiry warning) offers an extend/retry path.
  - *Business rules / validation:* WCAG-conformant focus order, labels, and contrast across all auth surfaces; CAPTCHAs (AUTH-23) must offer an accessible alternative.
  - *Failure & edge cases:* A screen-reader user must never be trapped in a modal auth wall; error focus moves to the first invalid field; session-timeout warnings are perceivable non-visually.

- **[AUTH-23] As a Trust & Safety Lead, I want sign-up and sign-in defended against bots, credential stuffing, and disposable-email abuse, so that fake identities can't flood tenants, farm certificates, or game community leaderboards.** — *Priority:* Should-Have — *Why this priority:* Fake-identity abuse directly threatens cert integrity and leaderboard fairness, but layers on after the base flows exist. *(Failure/abuse story.)*
  - *Acceptance criteria:*
    - Sign-up and sign-in are rate-limited and progressively challenged (e.g., accessible CAPTCHA) on suspicious volume.
    - Disposable/known-abuse email domains are rejected per a maintained policy list.
    - Credential-stuffing patterns trigger lockout/backoff and alerting.
  - *Business rules / validation:* Anti-abuse thresholds are policy-driven and tunable by TRUST-SAFETY-LEAD; defenses must not enumerate accounts; challenges must have an accessible alternative (AUTH-22).
  - *Failure & edge cases:* A legitimate user caught by throttling gets a clear recovery path, not a permanent block; a burst of invite-link accepts from one source is flagged as a possible seat-farming/vote-ring attempt; graceful degradation if the challenge provider is unavailable (fail toward a stricter, not open, posture).

- **[AUTH-24] As a Learner, I want my session to fail gracefully if it expires mid-loop, so that an expired token during a lecture, pipeline, review, or test never loses my work or corrupts my state.** — *Priority:* Should-Have — *Why this priority:* Long-running verification and review sessions make mid-flow expiry a real, product-specific failure mode. *(Failure/edge story.)*
  - *Acceptance criteria:*
    - When a session expires during an active action, the app prompts a lightweight re-authentication and resumes at the same point where safe.
    - In-progress but uncommitted work (e.g., a confidence-gate choice not yet submitted, a partially typed task answer) is preserved across re-auth where feasible.
    - A running background pipeline continues server-side and is reattached after re-auth rather than restarted.
  - *Business rules / validation:* Committed learning writes (a submitted rating, an adjudicated conflict) are transactional — never double-applied on re-auth; a test in progress under a timed rule follows the test's own timing policy on interruption (owned by the Tests domain, honored here).
  - *Failure & edge cases:* Offline/network drop shows a "reconnecting" state, not a logout, until the session is confirmed dead; expiry during checkout defers to the Billing domain's recovery; a revoked (not merely expired) session cannot silently resume and must return to sign-in.

### Business rules & invariants

- **Identity grants access, never truth.** Authentication and role assignment confer surface access and administrative/pedagogical scope only. **No identity — not payer, admin, instructor, support, platform root, or T&S — can move a claim's trust state, resolve a Conflict on the merits, or issue/fabricate a certificate.** Certification lives solely with the pipeline, execution sandbox, and human SME-REVIEWER.
- **Verified identity underpins the credential.** A certificate can only bind to a verified email and audited legal name; identity changes that touch an issued certificate are logged so EMPLOYER-VERIFIER's trust is preserved.
- **Guests persist nothing.** No server-side user record, review, gap, or certificate survives a guest session; everything a guest touches is ephemeral.
- **One identity, one tenant scope.** Every session and data object is bound to a single tenant; cross-tenant access is impossible and authorization failures fail closed.
- **Free defaults, plan-gated capability.** A new self-serve account is Free (3 topics, no Skeptic hard mode); entitlements come from the plan (Billing/Monetization domain), and no auth path grants entitlements the plan doesn't include.
- **Seats are capped by money, filled by provisioning.** BILLING-ADMIN sets the paid seat ceiling; ORG-ADMIN decides who fills it; neither can exceed the other's authority, and neither touches content.
- **Anti-enumeration everywhere.** Sign-in, sign-up, reset, and email-change responses never reveal whether an account exists.
- **Destructive identity actions are confirmed, audited, and (where legal) reversible within a window.** Deletion requires typed confirmation; suspicious or destructive admin actions are audit-logged with reason codes.
- **Consent, retention, and age policy are owned by Compliance, executed here.** Account creation, minor handling, and deletion honor the DPO's policy; this domain implements, it does not set, the rules.
- **Security cascade.** Password reset, MFA change, ban, and deletion each invalidate outstanding sessions immediately; revoked tokens cannot be replayed.

### Cross-domain dependencies

- **Provides to Topic Creation & Pipeline:** an authenticated, tenant-scoped identity and the first-run entry point; the New Topic form and its validation gate live there, linked from first-run.
- **Provides to Billing & Monetization:** the account and tenant onto which a plan, seat ceiling, and entitlements attach; consumes the seat ceiling and plan entitlements from Billing to gate provisioning and hard mode.
- **Provides to Tests & Certificates:** the verified identity and legal name a certificate binds to; consumes cert issuance/revocation events for the identity-teardown and ban flows.
- **Provides to Community & Events:** the display-name identity and Community-visibility flag; naming/impersonation policy is enforced jointly with Trust & Safety.
- **Provides to Reports/Progress & Review/FSRS:** the identity and timezone that scope and schedule a learner's honest signals; those signals' sensitivity is why account security and isolation live here.
- **Depends on Privacy & Compliance:** for retention, consent, DSAR/erasure, minor/age policy, and the data-disposition rules invoked at deprovisioning and deletion.
- **Depends on Verification/Trust-Ledger domain (as a hard boundary):** the epistemic firewall — this domain must guarantee that no authenticated role can write trust states; the ledger domain owns who *can* certify.
- **Provides to Support & Trust & Safety:** the scoped-impersonation, freeze/suspend/ban, and audit-trail primitives those roles operate through.
- **Provides to external actors (EMPLOYER-VERIFIER, DEVELOPER-API):** account-free certificate verifiability and, prospectively, SSO/SCIM provisioning — bound by the rule that nothing external mutates the ledger.

### Key technical requirements

- **Session & token security:** short-lived access tokens with refresh, immediate server-side revocation, replay protection, step-up re-authentication for sensitive surfaces, and "sign out everywhere."
- **Federated identity:** OAuth/OIDC social login and SAML/OIDC enterprise SSO with per-tenant configuration, JIT provisioning, and role mapping that never escalates to epistemic authority; forward-looking SCIM directory sync.
- **Multi-tenant data isolation:** tenant-scoped identities and data with fail-closed authorization; auditable break-glass for PLATFORM-ADMIN that cannot read epistemic content.
- **Email pipeline:** transactional email for verification, reset, email-change, and security notices, with expiring single-use tokens and per-address rate limits.
- **Anti-abuse layer:** rate limiting, progressive/accessible challenge, breached-password and disposable-domain checks, credential-stuffing detection, and seat-farming/vote-ring signals feeding Trust & Safety.
- **Audit & compliance logging:** immutable audit trails for provisioning, role changes, impersonation, freeze/ban, and deletion, retained per DPO policy and queryable for DSAR and cert-fraud investigations.
- **Latency & availability:** sign-in and first-run must be low-latency (retention hinges on frictionless daily return); the guest demo must degrade to static content rather than block; SSO outages must not strip already-provisioned access to earned data.
- **Graceful long-session handling:** re-auth-and-resume for expiry mid-lecture/pipeline/review/test, with transactional (never double-applied) commits and server-side continuation of background pipeline jobs.
- **Accessibility:** WCAG-conformant, keyboard-operable, screen-reader-labeled auth with no color-only/timed-only gates and accessible challenge alternatives.
- **Identity-to-credential integrity:** verified-email requirement for certificate issuance and audit-logged name changes so external verification stays trustworthy.
- **Minimal-PII posture (forward-looking):** age-gating and COPPA/FERPA consent scaffolding for a future first-class minor/guardian model.

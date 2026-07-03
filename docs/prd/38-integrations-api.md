## Integrations, API, Webhooks, SSO & LMS/LTI

### Overview

This domain owns **the boundary where VeriLearn's verified content, credentials, and trust data leave the product and enter someone else's system** — an HR/ATS pipeline, a school's LMS, an org's identity provider, an internal analytics dashboard, or a no-code automation. It is the programmatic and federated surface: the public REST (and forward-looking GraphQL) API, API keys and OAuth scopes, signed webhooks, SSO (SAML/OIDC), SCIM directory provisioning, LMS/LTI 1.3 (launch, roster, grade passback, deep-linking), the certificate-verification endpoint employers call at scale, bulk data export/import, embeddable widgets, and the sandbox/versioning/deprecation machinery that keeps all of it maintainable.

Why it matters to the product thesis: VeriLearn's entire differentiator is that its payload is not lesson content but **trust** — the five trust states, the coverage matrix, red-teamed claims, the four honest signals, and certificates that trace every question to a sourced, Skeptic-survived claim. An integration is only worth building if that trust signal **survives the trip out of the product**. A naive integration that flattens five states into a binary pass/fail throws away the whole point; a certificate-verification call that fails *open* (returns "valid" when it can't confirm) turns the product's highest-stakes output into a lie. So this domain's job is to expose VeriLearn's honesty faithfully across a network boundary while enforcing the product's sharpest invariant in code: **nothing external mutates the ledger.** No API key, no OAuth token, no LTI role, no SSO assertion, and no admin scope can move a claim's trust state, resolve a Conflict, promote a source, run un-sandboxed code, or fabricate a score or certificate. Integrations may **read** trust (with consent), **provision** identity and seats, **assign** and **report**, and **verify** credentials — they can never **decree what is true**. Certification stays with the Verification Pipeline, the Execution Sandbox, and the human SME-REVIEWER.

This domain is the plumbing, not the source: it **renders, transports, and federates** behaviors owned elsewhere. SSO/identity *mechanics* and JIT provisioning live in Auth; seat ceilings, roles, and the shared library live in Org Admin; certificate issuance/revocation and the public verify page live in Tests & Certificates; consent and privacy scopes live in Settings/Privacy; tenant isolation and break-glass live in Platform Admin. This domain provides the **stable, versioned, signed, rate-limited, observable contract** by which external systems consume those things — and the firewall that keeps a buyer's IT integration from becoming a backdoor into the trust spine.

### Personas involved

- **Developer / API & Integration Consumer (DEVELOPER-API)** — the primary inhabitant. A technical actor integrating VeriLearn into another system: wiring cert verification into an ATS, standing up SSO + SCIM for a Teams tenant, pulling structured trust data into a dashboard, or subscribing to webhooks. Bound absolutely by the rule that nothing external mutates the ledger and that learner data is gated by consent scopes. Most of this domain is written from their point of view.
- **Organization / Teams Admin (ORG-ADMIN)** — configures the tenant's SSO and directory sync (often via or alongside DEVELOPER-API), owns which integrations are connected to their tenant, and mints/scopes the tenant's API credentials. Depends on this domain but can never raise a seat ceiling or certify through it.
- **Instructor / Educator (INSTRUCTOR)** — the LMS/LTI persona: launches VeriLearn topics/tests from within an LMS course, deep-links specific content into modules, and receives grade passback into the LMS gradebook. Holds pedagogical authority but no power to change a trust state or hand-set a passed-back grade.
- **Employer / Recruiter (EMPLOYER-VERIFIER)** — the external consumer of the certificate-verification API and embeddable verify widget; checks a certificate's authenticity, scope, and revocation status — ideally without an account — and, with learner consent, may read deeper signals. Never sees private progress without a consent scope.
- **Platform Administrator (PLATFORM-ADMIN)** — vendor-side; provisions the tenant, owns the SSO/SCIM plumbing this domain rides on, sets platform-wide rate-limit tiers and abuse controls, and can disable a compromised integration. Operates the infrastructure; cannot read or alter epistemic content through it.
- **Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD)** — can freeze an integration or revoke credentials implicated in fraud/scraping, and must have revocation events propagate cleanly to downstream consumers; never hand-certifies through the API.
- **Compliance / Data-Protection Officer (COMPLIANCE-DPO)** — governs what learner data may cross the API boundary, for which tenants (minors/jurisdiction), and constrains export/consent scopes; can force an integration to aggregate-only or block it entirely.
- **Billing / Finance Admin (BILLING-ADMIN)** — plan tier gates API access and quotas (e.g. higher rate limits / webhook volume on Teams); referenced as the entitlement source, not an actor who codes against the API.
- **Support Agent (SUPPORT-AGENT)** — helps unbreak a stuck integration (a failed SSO sync, a dead webhook endpoint, an expired token) under scoped consent; firewalled from fabricating trust data, a score, or a certificate.
- **Team Seat Learner (LEARNER-TEAM)** — enters through SSO/LTI provisioned by this domain and is the *subject* of SCIM deprovisioning and consent scopes; not an operator of it.
- **Subject-Matter Expert / Content Reviewer (SME-REVIEWER)** — referenced as the sole certification authority whose downgrades trigger the `cert.revoked` webhook this domain delivers; not an API operator.
- **Accessibility-Reliant Learner (A11Y-LEARNER)** — relevant where this domain renders UI: embeddable verify widgets, LTI launch screens, and developer consent screens must meet the same non-color-only, keyboard, screen-reader bar as the core product.

### User stories

- **[API-01] As a Developer / API & Integration Consumer (DEVELOPER-API), I want to register an application and obtain scoped API credentials, so that I can call VeriLearn programmatically instead of scraping the UI.** — *Priority:* Should-Have — *Why this priority:* The credential substrate is the precondition for every other integration, but the whole domain is forward-looking relative to the documented MVP loop.
  - *Acceptance criteria:*
    - A developer (or ORG-ADMIN for a tenant) can register a named application in a developer console, receive an API key (secret shown once) and/or an OAuth client id+secret, and select from a list of granular scopes.
    - Credentials are tenant-scoped: a key minted under a Teams tenant can only ever see that tenant's data; a personal key can only see the owner's own data.
    - The console lists active credentials with created/last-used timestamps, granted scopes, and a one-click revoke/rotate.
  - *Business rules / validation:* Least-privilege by default — a new credential requests only the scopes explicitly granted; no scope grants ledger-write, claim-certification, score-setting, or cross-tenant read. Secrets are stored hashed and never re-displayed. Credential minting is itself audit-logged with actor + scopes.
  - *Failure & edge cases:* A revoked or rotated key fails **immediately** with `401` and a machine-readable `code`, not a delayed cache expiry. Presenting a well-formed key that lacks the scope for an endpoint returns `403 insufficient_scope` naming the missing scope, not a generic denial. A leaked secret path is covered by API-20.

- **[API-02] As a DEVELOPER-API, I want OAuth 2.0 authorization-code (for learner-consented reads) and client-credentials (for server-to-server) flows with granular scopes, so that any access to learner data is explicitly consent-bound.** — *Priority:* Should-Have — *Why this priority:* Consent-scoped OAuth is what makes reading honest signals lawful; without it the trust-data value prop can't ship safely.
  - *Acceptance criteria:*
    - Reading a learner's private data (honest signals, gap map, ledger detail beyond public) requires an authorization-code token carrying a learner-granted consent scope; server-to-server operational calls use client-credentials.
    - Scopes are fine-grained and independently grantable (e.g. `cert:verify`, `trust:read`, `signals:read`, `roster:read`, `roster:write`, `webhooks:manage`), and the consent screen names in plain language exactly what each grants.
    - Tokens are short-lived with refresh; token introspection/revocation endpoints are provided.
  - *Business rules / validation:* Consent is revocable by the learner at any time and revocation **immediately** invalidates live tokens and share links (mirrors the Privacy domain). No scope combination can escalate to epistemic write. A learner's consent scope never overrides an org/compliance block (COMPLIANCE-DPO can force aggregate-only).
  - *Failure & edge cases:* An expired access token returns `401 token_expired` prompting refresh; a revoked-consent token returns `403 consent_revoked` and the integration must stop reading that learner. Requesting a scope the user/tenant is not entitled to (e.g. `signals:read` on a minors tenant) is refused at consent time with the reason shown, not silently downgraded.

- **[API-03] As an Employer / Recruiter (EMPLOYER-VERIFIER) or DEVELOPER-API, I want a programmatic certificate-verification endpoint that returns authenticity, scope, and live revocation status, so that my ATS can auto-verify a VeriLearn credential at scale.** — *Priority:* MVP — *Why this priority:* Certificate verification is the load-bearing external trust surface — the whole point of a VeriLearn cert is that an outsider can trust it — and its public-page sibling is already MVP.
  - *Acceptance criteria:*
    - `GET` on a certificate id / verify token returns a signed response: valid|revoked|unknown, issued-to (learner-chosen fields only), topic/scope, pass bar, issue date, and current revocation status with reason category if revoked.
    - The endpoint resolves **live** against the source-of-truth ledger/cert store; a revoked cert reads `revoked` within the domain's propagation SLA of the SME downgrade.
    - The payload preserves the five-state trust vocabulary where scope is described (never flattened to pass/fail) and includes a link to the human-readable public verify page/QR.
  - *Business rules / validation:* **Fail-closed** — unknown, forged, malformed, or unresolvable ids return `unknown`/`invalid`, never a default `valid`. Only learner-chosen public fields are exposed; deeper signals require a separate consent scope (API-02/API-05). No auth is required for the minimal public verify path; higher-detail responses require credentials.
  - *Failure & edge cases:* If the cert store is degraded/unreachable, the endpoint returns an explicit `unverifiable_try_again` state with a `503`, **never** a cached "valid." A revoked-then-reinstated cert reflects the reinstated state and re-fires the appropriate webhook. Rate-limit abuse (enumeration of cert ids) triggers throttling and T&S alerting.

- **[API-04] As a DEVELOPER-API, I want to read a topic's trust ledger, five-state claim breakdown, and coverage matrix via REST (with a GraphQL option), so that I can render VeriLearn's verification data faithfully in an external dashboard.** — *Priority:* Should-Have — *Why this priority:* Structured trust-data reads are the differentiated payload, but they follow the cert/provisioning basics that unlock revenue.
  - *Acceptance criteria:*
    - Endpoints return, for an entitled topic, each claim's trust state (`Verified·execution`, `Verified·source`, `Sourced`, `Disputed`, `Unsupported`, `Interpretive`), its source(s), and the claims×sources coverage grid — as read-only structured data.
    - The schema represents all five states plus Conflicts distinctly; there is no field or transformation that collapses them to a binary.
    - A GraphQL read interface (Nice-to-Have within this story) allows selecting exactly the trust fields needed without over-fetching.
  - *Business rules / validation:* Read-only, always: no verb on these resources writes trust state, resolves a Conflict, or promotes a source. Access requires `trust:read` scope and entitlement to the topic (owner, org shared-library member, or consented). Interpretive claims are labeled as positions-mapped-not-certified in the payload.
  - *Failure & edge cases:* Requesting a topic still mid-pipeline returns a `pipeline_incomplete` status with the stage, not a partial/misleading ledger. If a claim's state changes between paginated pages, responses carry an `as_of` ledger version so a consumer can detect drift and re-read.

- **[API-05] As a DEVELOPER-API, I want to read a learner's four honest signals (Retention, Transfer, Calibration, Drill) only under an explicit consent scope, so that an LMS or internal dashboard can show earned signals without ever leaking private progress.** — *Priority:* Should-Have — *Why this priority:* High-value for Teams/education dashboards but strictly gated by consent, so it rides on the OAuth substrate rather than leading.
  - *Acceptance criteria:*
    - Honest-signal reads require a live `signals:read` consent scope granted by the learner (or an org policy that lawfully permits per-learner visibility) and return the four signals as-labeled, never as a single vanity score.
    - Responses honor the org's k-anonymity/minimum-cohort rule for any aggregate endpoint (aggregate can't de-anonymize a single learner).
    - Every signal read is logged so a learner/DPO can audit who read what, when.
  - *Business rules / validation:* Certificates and completion counts are org-owned outcomes readable without the signal scope; Retention/Transfer/Calibration/Drill are private and scope-gated. COMPLIANCE-DPO can force aggregate-only for a tenant, disabling per-learner reads regardless of learner consent.
  - *Failure & edge cases:* Consent revoked mid-integration → subsequent reads return `403 consent_revoked` and cached copies must be honored as stale per the consent terms. A cohort below the k-threshold returns `insufficient_cohort_size`, not a leak-prone aggregate.

- **[API-06] As a DEVELOPER-API, I want to subscribe to signed webhooks for key lifecycle events, so that my system reacts to VeriLearn changes without polling.** — *Priority:* Should-Have — *Why this priority:* Webhooks are the difference between a live integration and a stale one, but depend on the credential/scoping layer first.
  - *Acceptance criteria:*
    - A developer can register endpoint URLs and subscribe to a documented event catalog including at least `verification.completed`, `test.passed`, `certificate.issued`, and `certificate.revoked` (plus `seat.provisioned`/`seat.deprovisioned`, `conflict.resolved`, `topic.published`).
    - Every delivery includes a signature header (HMAC over the raw body with the endpoint's signing secret), an event id, an event type, an idempotency key, and a timestamp.
    - The console shows recent deliveries with status, response code, and a manual **re-send/replay** for any past event.
  - *Business rules / validation:* Payloads carry only data the subscription's scopes permit (a `signals:read`-less subscription gets ids and metadata, not private signals). Signing secrets are rotatable. Event ordering is best-effort with monotonic timestamps + sequence so consumers can reorder.
  - *Failure & edge cases:* Full delivery-reliability behavior (retry/dedupe) is API-07. An endpoint that fails signature-secret rotation keeps the old secret valid for a grace window to avoid dropped events. Subscribing to an event outside granted scope is refused at subscription time.

- **[API-07] As a DEVELOPER-API, I want webhook deliveries to retry with backoff, be de-duplicable, and never fire twice as an *action*, so that a flaky endpoint or a redelivery doesn't corrupt my downstream state.** — *Priority:* Should-Have — *Why this priority:* Delivery semantics are where naive webhook integrations silently break (double-grants, missed revocations); getting them right is a correctness requirement, not polish. *(Explicit failure-scenario story.)*
  - *Acceptance criteria:*
    - Failed deliveries (non-2xx, timeout, TLS error) retry with exponential backoff and jitter up to a bounded window (e.g. 24h), after which the event lands in a dead-letter queue visible in the console for manual replay.
    - Every event carries a stable idempotency key so a consumer can dedupe redeliveries; redelivering the same event id never represents a *new* occurrence.
    - Repeated endpoint failures auto-disable the subscription after a threshold and notify the owner, rather than retrying forever or dropping silently.
  - *Business rules / validation:* At-least-once delivery is the contract (consumers must be idempotent); ordering is not guaranteed across event types, so critical state (e.g. revocation) must also be re-confirmable via the verify endpoint (the verify-URL is authoritative even if a webhook lags). Delivery attempts are logged for a retention window.
  - *Failure & edge cases:* A `certificate.revoked` webhook that never delivers must not leave downstream "valid" — the authoritative API-03 verify call returns `revoked`, so revocation truth survives webhook loss. A consumer that 200s but didn't actually process is the consumer's risk; VeriLearn still exposes replay. A duplicate `test.passed` must not let a consumer double-issue an LMS grade (pairs with API-14 idempotency).

- **[API-08] As an ORG-ADMIN (with DEVELOPER-API), I want to configure per-tenant SSO via SAML or OIDC with role mapping, so that my learners sign in with their work identity and inherit tenant access automatically.** — *Priority:* Should-Have — *Why this priority:* SSO is table-stakes for Teams/enterprise deals, but Teams is a post-MVP monetization tier, so it trails the individual loop.
  - *Acceptance criteria:*
    - An admin can configure a SAML 2.0 or OIDC connection for the tenant (metadata exchange, ACS/redirect URIs, certificate/JWKS), test the connection, and enforce SSO for the tenant's domain.
    - On successful assertion, a learner is JIT-provisioned into a seat (if the invite/allowlist and ceiling permit) with tenant, role, and org-managed profile fields from the assertion, landing on the shared library.
    - IdP group/role claims map to a VeriLearn role via an admin-defined mapping.
  - *Business rules / validation:* SSO **mechanics and JIT provisioning are owned by Auth**; this domain owns the tenant configuration surface and role-mapping contract. A mapped role never confers epistemic authority (no role certifies claims). SSO identity is bound to exactly one tenant; on SSO-mandated domains, email/password and social login are disabled for that domain.
  - *Failure & edge cases:* IdP misconfiguration / failed assertion routes a clear error to ORG-ADMIN/PLATFORM-ADMIN, never a dead end for the learner. JIT provisioning that would exceed the seat ceiling is blocked with an admin-facing reason (no silent oversell). An SSO outage must **not** strip an already-provisioned learner of access to already-earned data (fail-safe to earned content).

- **[API-09] As a DEVELOPER-API, I want SCIM 2.0 directory provisioning, so that seats create and deprovision automatically as our identity directory changes instead of the admin inviting by hand.** — *Priority:* Future — *Why this priority:* Genuinely beyond the documented product and only relevant to larger enterprise Teams tenants; captured for completeness but well past MVP.
  - *Acceptance criteria:*
    - A SCIM endpoint supports create/update/deactivate for users and (optionally) groups→cohorts, authenticated with a tenant-scoped SCIM token.
    - A directory-driven user creation provisions a pending/active seat within the ceiling; a directory-driven deactivation deprovisions the seat and revokes sessions.
    - Group membership syncs map to cohorts where configured, without altering any learner's trust ledger, gap map, or calibration.
  - *Business rules / validation:* SCIM can provision identity and seats only — never trust state, roles beyond the mapping contract, or entitlements above the paid ceiling. Deprovisioning follows the org's data-disposition policy (Auth/Org Admin own the actual teardown). SCIM operations are idempotent by external id.
  - *Failure & edge cases:* A directory sync that would exceed the ceiling queues/blocks the create with a `409 over_ceiling` rather than overselling. A deactivation race with an in-progress test follows the interruption policy (no phantom fail). SCIM token compromise is handled as API-20.

- **[API-10] As an ORG-ADMIN, I want SSO/SCIM deprovisioning to cleanly revoke access without destroying earned credentials, so that offboarding a learner frees the seat and cuts access but never silently erases or invalidates what they truly earned.** — *Priority:* Should-Have — *Why this priority:* Deprovisioning is the highest-risk identity edge — it can either leak access or nuke real certificates — so it needs an explicit, correct contract. *(Explicit failure-scenario story.)*
  - *Acceptance criteria:*
    - On deprovisioning (SCIM deactivate, SSO removal, or manual removal), the learner's sessions and tokens are revoked, the seat returns to the Free pool, and new logins are refused per policy.
    - Already-earned certificates remain **valid and independently verifiable** (they attest a real past pass); they are not revoked by offboarding (only an SME downgrade revokes a cert).
    - Data disposition (retain / export / delete the learner's private learning data) follows the org's offboarding policy and is audit-logged.
  - *Business rules / validation:* Deprovisioning is an identity/seat action, not an epistemic one — it cannot revoke a certificate or alter a trust state. A certificate's validity is a function of the ledger at issue time and any SME downgrade since, **never** of the holder's current seat status.
  - *Failure & edge cases:* An SSO **outage** (IdP down) must not be interpreted as deprovisioning — already-provisioned learners keep access to earned data (fail-safe), and only an explicit directory `deactivate` or admin removal deprovisions. A deprovisioned-then-rehired learner can be re-provisioned into a seat with their prior earned certificates intact. If disposition-delete is requested, issued certificates and their verify pages follow the compliance retention cascade, not an immediate hard delete that would break outstanding employer verifications.

- **[API-11] As an Instructor / Educator (INSTRUCTOR), I want LTI 1.3 launch and roster sync from my LMS, so that my students enter a VeriLearn topic from inside my course without separate accounts.** — *Priority:* Should-Have — *Why this priority:* LTI is the primary distribution channel into formal education and the reason schools adopt, but it serves the education segment specifically rather than the core loop.
  - *Acceptance criteria:*
    - VeriLearn registers as an LTI 1.3 tool (OIDC login + signed launch); an LMS launch drops the student/instructor into the mapped VeriLearn topic with their LTI role mapped to a VeriLearn role.
    - Names and Role Provisioning Service (NRPS) syncs the course roster into a VeriLearn cohort so an instructor doesn't hand-invite.
    - Launch establishes a resource link so subsequent launches return to the same content/context.
  - *Business rules / validation:* LTI role (Instructor/Learner) maps to a VeriLearn role but **never** confers epistemic authority — an LTI Instructor cannot certify claims or set a score. Provisioned seats respect the tenant ceiling. Launch identity is bound to the launching LMS/tenant.
  - *Failure & edge cases:* A launch with an invalid/expired `id_token` or bad signature is rejected with a clear error, not a partial session. Roster sync that would exceed the ceiling provisions within limit and flags the overflow to the admin. If the launched topic carries an unresolved `Disputed` claim, it follows the publish/assign gate (routes to SME) rather than certifying via LTI.

- **[API-12] As an INSTRUCTOR, I want LTI Deep Linking to embed a specific VeriLearn topic or test into an LMS module, so that I can place exactly the verified content I want inline in my course.** — *Priority:* Nice-to-Have — *Why this priority:* Improves the instructor authoring experience but plain launch (API-11) already delivers the core value.
  - *Acceptance criteria:*
    - From an LMS content picker, an instructor can browse assignable VeriLearn topics/tests and insert a deep-linked resource; the returned deep-link JWT carries the selected content and any grade line-item request.
    - Only content that passes the publish/assign gate (no unresolved `Disputed` claims) is selectable for a graded placement.
    - The placed link launches directly into the chosen resource on student click.
  - *Business rules / validation:* Deep-linked graded content must be test/assessment-eligible (verified/sourced question pool); selecting a topic with an open Conflict for a *graded* placement is blocked with a "needs SME review" reason. Placement never copies/forks the ledger — students inherit the same live trust states.
  - *Failure & edge cases:* If content's trust state degrades after placement, the placement stays but new graded launches surface the review warning. An expired deep-link session returns the instructor to the picker rather than erroring opaquely.

- **[API-13] As an INSTRUCTOR, I want LTI Assignment & Grade Services (AGS) passback of a student's test score/pass into the LMS gradebook, so that VeriLearn results appear alongside the rest of my course grades.** — *Priority:* Should-Have — *Why this priority:* Grade passback is the feature that makes LTI adoption "real" for graded courses; without it results live in two places.
  - *Acceptance criteria:*
    - On a graded test submission from an LTI-launched context, VeriLearn posts a score to the associated AGS line item (score given/possible, pass/fail against the bar, timestamp, activity progress).
    - Passback is idempotent per attempt — a redelivery or replay updates the same line-item score rather than stacking duplicates.
    - The instructor sees passback status (delivered/failed/pending) surfaced in VeriLearn.
  - *Business rules / validation:* VeriLearn passes back **only a score its own graded engine produced** — an instructor/LMS cannot hand-set or overwrite the VeriLearn-side score, and passback never fabricates a grade for an un-taken test. Best-of-N attempt rules (owned by Tests) determine which score is sent.
  - *Failure & edge cases:* The failure path is API-14. A line item deleted on the LMS side is detected and reported rather than silently dropping the grade.

- **[API-14] As an INSTRUCTOR, I want a failed grade passback to retry and reconcile rather than silently lose a student's result, so that a student who genuinely passed is never marked missing in the gradebook.** — *Priority:* Should-Have — *Why this priority:* A lost grade in a real course is a high-severity, trust-destroying failure; the reconciliation contract is what makes LTI safe to rely on. *(Explicit failure-scenario story.)*
  - *Acceptance criteria:*
    - A failed AGS post (LMS 5xx, auth expiry, missing line item, timeout) enters a bounded retry with backoff; persistent failure surfaces an actionable alert to the instructor/admin and lands in a reconciliation queue with the true VeriLearn-side result.
    - The authoritative result always lives in VeriLearn's own results store, so a lost passback never loses the *result* — only its mirror in the LMS.
    - A manual "re-send grade" action re-posts idempotently once the LMS is healthy.
  - *Business rules / validation:* Retries are idempotent (same attempt → same line-item update, never duplicated). VeriLearn never invents or approximates a grade to satisfy passback; if it can't send the real score it reports pending, not a placeholder. Auth-token (LTI platform key) expiry triggers re-auth, not a dropped grade.
  - *Failure & edge cases:* If the LMS permanently removed the line item, the grade is held with a clear "gradebook target missing — recreate the LTI link" message. A student who passed a retake after a failed passback has the *best* score reconciled, not the stale one. Clock skew between systems never causes a valid submission to be rejected as late.

- **[API-15] As an EMPLOYER-VERIFIER, I want an embeddable verify widget/badge I can drop into our careers or profile page, so that a candidate's VeriLearn credential shows live, tamper-evident status without building against the API.** — *Priority:* Nice-to-Have — *Why this priority:* Lowers the integration bar for non-technical verifiers, but the API (API-03) already serves the core verification need.
  - *Acceptance criteria:*
    - A copy-paste embed (script/iframe) renders a badge that resolves the certificate's live status (valid/revoked/unknown) against the verify endpoint on each load, with a click-through to the full public verify page.
    - The widget shows only learner-chosen public fields and never exposes private signals.
    - The widget meets accessibility requirements (non-color-only status, keyboard-focusable link, screen-reader-labeled state).
  - *Business rules / validation:* The widget is a thin client of the fail-closed API-03 endpoint — it can never cache a "valid" verdict past the cert's live state, and a revoked cert flips the badge on next resolve. Embedding does not require the embedder to hold credentials for the public path.
  - *Failure & edge cases:* If the verify service is unreachable, the badge shows an explicit "couldn't verify right now" state, never a stale "verified." A tampered/forged cert id renders "unverified."

- **[API-16] As an ORG-ADMIN (with DEVELOPER-API), I want bulk data export and import, so that I can move roster/allowlist in and pull completions, certificates, and aggregate signals out for our records and BI.** — *Priority:* Should-Have — *Why this priority:* Export/import is both an operational convenience and a compliance necessity (DSAR, records retention), so it matters early for real orgs.
  - *Acceptance criteria:*
    - Export produces structured (CSV/JSON) roster, completion, certificate, and *aggregate* honest-signal data for the tenant, honoring the visibility policy and k-anonymity threshold.
    - Import accepts a roster/allowlist for bulk invite (delegating to Org Admin's partial-success invite handling) and cohort assignments; it validates and reports per-row status.
    - Large exports run async with a job id, progress, and a signed, expiring download link.
  - *Business rules / validation:* Export can never emit trust-write capability or per-learner private signals beyond what the visibility policy + consent allow; imports can never provision above the seat ceiling or set trust states. Certificate export includes verify-URLs, not forgeable "valid" flags. Exports are audit-logged and subject to the compliance retention/DSAR cascade.
  - *Failure & edge cases:* An import with malformed/duplicate/out-of-domain rows is partial success (valid rows apply, invalid itemized), never half-applied. An export requested for data the requester isn't entitled to is scoped down with a note, not silently widened. An expired download link requires re-issue rather than exposing a permanent URL.

- **[API-17] As an ORG-ADMIN or DEVELOPER-API, I want no-code automation via a Zapier-style connector, so that non-engineers can wire VeriLearn events to their tools without writing code.** — *Priority:* Nice-to-Have — *Why this priority:* Broadens reach to smaller orgs and ops teams, but every capability it exposes is already available (and better governed) through the raw API/webhooks.
  - *Acceptance criteria:*
    - A published connector exposes triggers (e.g. `certificate.issued`, `test.passed`, `seat.provisioned`) and actions (e.g. invite a learner, assign a topic) mapped onto the same scoped API/webhook surface.
    - Connecting the app runs the same OAuth consent + scope grant as a first-party integration; the user sees exactly what the automation can do.
    - Automations are listable and revocable by the admin/learner at any time.
  - *Business rules / validation:* The connector holds **no privileged path** — it is a client of the public API and inherits every scope, rate-limit, consent, and ledger-immutability rule. No trigger/action can certify a claim, set a score, or exceed entitlements.
  - *Failure & edge cases:* A revoked scope disables the affected automations with a clear reason. A misconfigured automation that would loop (e.g. re-invite on every sync) is rate-limited like any other client. Connector API changes follow the deprecation policy (API-19).

- **[API-18] As a DEVELOPER-API, I want a sandbox/test mode with test credentials and synthetic data, so that I can build and test my integration without touching production data, real learners, or billing.** — *Priority:* Should-Have — *Why this priority:* A safe test surface is what makes integrations buildable at all; shipping the API without it forces risky testing against production.
  - *Acceptance criteria:*
    - Test-mode credentials are visibly distinct from live keys and operate against an isolated sandbox dataset (sample topics, ledgers, certs, webhooks) that never mixes with production.
    - Sandbox supports triggering test webhook events (including `certificate.revoked`) and exercising fail-closed verify responses on demand.
    - Sandbox calls are free/non-billable and clearly labeled in all responses.
  - *Business rules / validation:* A test credential can never read or write production data or provision real seats; a live credential can never see sandbox data. Sandbox certificates verify as "test," never as production-valid. Sandbox has its own (usually looser) rate limits so testing doesn't get throttled like production.
  - *Failure & edge cases:* Using a test key against a live endpoint (or vice-versa) fails with an explicit `wrong_mode` error, not confusing empty results. Sandbox data resets are announced and idempotency keys are mode-scoped.

- **[API-19] As a DEVELOPER-API, I want a clear API versioning and deprecation policy with sunset headers and a changelog, so that VeriLearn can evolve without silently breaking my integration.** — *Priority:* Should-Have — *Why this priority:* Backward-compatibility discipline is what earns durable enterprise trust in the API; skipping it turns every change into an outage.
  - *Acceptance criteria:*
    - Every request/response is tied to an explicit API version (header or path); breaking changes ship only under a new version, and additive changes are backward-compatible.
    - Deprecated versions/endpoints return `Deprecation` and `Sunset` headers with the removal date and a link to migration docs, and a published changelog records every change.
    - A minimum support window is guaranteed for any deprecated version before removal, with proactive notification to affected integrators.
  - *Business rules / validation:* No version may change the meaning of the five trust states or weaken a fail-closed guarantee; verification semantics are a stable contract across versions. Version negotiation defaults to a pinned stable version, never "latest," so unpinned clients don't break silently.
  - *Failure & edge cases:* A call to a sunset (removed) version returns `410 Gone` with the migration link, not a silent redirect to different behavior. A client on a soon-to-sunset version is warned via headers and dashboard well ahead of removal. An unrecognized version returns a clear error, not a fallback that changes semantics.

- **[API-20] As a DEVELOPER-API (and PLATFORM-ADMIN), I want a leaked or compromised credential to be revocable and rotatable with immediate fail-closed effect, so that a stolen token can't be used to exfiltrate trust data or provision seats.** — *Priority:* Should-Have — *Why this priority:* Credential compromise is the canonical API security incident; a slow or leaky revocation path turns one leaked secret into a breach. *(Explicit failure-scenario story.)*
  - *Acceptance criteria:*
    - Revoking or rotating a key/OAuth client/SCIM/LTI credential invalidates it **immediately** (next request fails), with a rotation flow that supports overlapping keys for zero-downtime cutover where appropriate.
    - PLATFORM-ADMIN / TRUST-SAFETY-LEAD can force-revoke a tenant's or app's credentials on suspected compromise, and the action is audit-logged with actor + reason.
    - Anomalous credential use (cert-id enumeration, scope-abuse spikes, geovelocity) triggers alerts and optional auto-throttle/suspend.
  - *Business rules / validation:* Even a valid-but-stolen credential can only ever do what its scopes allow — it can never write the ledger, certify, or exceed entitlements (blast radius is bounded by least-privilege). Secrets are shown once and stored hashed; rotation never re-exposes the old secret.
  - *Failure & edge cases:* A request with a revoked token fails closed with `401 revoked`, never a cached success. A compromised **SSO/SCIM** credential's revocation must not strip already-provisioned learners of earned data (identity-vs-content firewall from API-10). A revoked webhook signing secret enters a short dual-secret grace window to avoid dropping legitimate in-flight events.

- **[API-21] As a PLATFORM-ADMIN (and TRUST-SAFETY-LEAD), I want every external endpoint to be structurally read-only against the trust spine, so that no integration — however privileged its scopes — can become a backdoor that mutates the ledger, certifies a claim, or fabricates a score.** — *Priority:* MVP — *Why this priority:* This is the product's defining invariant expressed at the API boundary; if it isn't guaranteed in code before any API ships, the whole trust thesis is compromised. *(Invariant-anchoring story.)*
  - *Acceptance criteria:*
    - There exists **no** API verb, scope, webhook, LTI role, SSO/SCIM attribute, or admin path that can set/change a claim's trust state, resolve a Conflict, promote a source, set/override a test score, or issue/forge a certificate.
    - Any sanctioned "run my own assertions / verify my code" endpoint inherits the Execution Sandbox isolation envelope and can only *emit* trust states from actual runs (pass ⇒ `Verified·execution`; fail ⇒ Conflict) — no caller can coerce a false green.
    - Attempts to reach epistemic-write behavior via the API are denied and logged as policy events.
  - *Business rules / validation:* Certification authority is exclusive to the Verification Pipeline / Execution Sandbox / SME-REVIEWER. Administrative, identity, and provisioning power never crosses into epistemic power. This invariant holds across all versions and cannot be relaxed by a scope, plan tier, or platform-root role.
  - *Failure & edge cases:* A misconfigured integration that *tries* to push a trust state receives a hard `403 ledger_immutable`, never a partial write. A break-glass platform action can freeze/quarantine (change visibility/eligibility) but still cannot hand-certify. Any code path discovered to allow external write is treated as a sev-1 integrity incident.

- **[API-22] As a DEVELOPER-API, I want documented rate limits and quotas with clear headers and predictable `429` behavior, so that my integration degrades gracefully and I can size it against my plan.** — *Priority:* Should-Have — *Why this priority:* Rate limiting protects platform stability and prevents cert-id enumeration abuse, and integrators need it explicit to build reliable clients.
  - *Acceptance criteria:*
    - Responses include rate-limit headers (limit, remaining, reset); exceeding a limit returns `429` with a `Retry-After` and does not lose the request's idempotency guarantees on retry.
    - Quotas/limits are tiered by plan/entitlement (e.g. higher limits and webhook volume on Teams) and documented per endpoint class (verify vs. bulk read vs. write-provisioning).
    - The developer console shows current usage against quota.
  - *Business rules / validation:* Limits are enforced per credential and per tenant to isolate noisy neighbors. Public certificate-verification has its own abuse-resistant limit to deter enumeration. Plan-tier limits are read from Billing entitlements, not settable in this domain.
  - *Failure & edge cases:* A throttled client that respects `Retry-After` is never penalized further; one that ignores it escalates to temporary suspension. A sudden legitimate spike can request a quota increase through Support/Billing rather than silently failing. Enumeration patterns on the verify endpoint trip T&S throttling independent of the normal quota.

### Business rules & invariants

- **Ledger immutability (the spine rule at the boundary):** No external mechanism — API verb, OAuth scope, webhook, LTI role, SSO assertion, SCIM attribute, connector, or admin scope — can write a trust state, resolve a Conflict, promote a source, set/override a score, or issue/forge a certificate. Reads yes; writes to the spine never. (API-21.)
- **Certification stays internal:** Certification authority is exclusively the Verification Pipeline, Execution Sandbox, and SME-REVIEWER. Any sanctioned "run my assertions" endpoint inherits the sandbox envelope and can only emit trust states from real runs — no coerced false green.
- **Fail-closed verification:** Certificate verification (API and widget) resolves live against source-of-truth and returns invalid/unknown/unverifiable for forged, malformed, unknown, or unresolvable ids and for service degradation — **never** a default or cached "valid."
- **Five states preserved:** Any trust-data payload represents `Verified·execution`, `Verified·source`, `Sourced`, `Disputed`, `Unsupported`, `Interpretive` (and Conflicts) faithfully; there is no field or transform that collapses them to a binary. Interpretive is labeled positions-mapped-not-certified.
- **Consent- and scope-gated learner data:** Private learner data (honest signals, gap map, private ledger detail) crosses the boundary only under an explicit, revocable consent scope; consent revocation immediately invalidates live tokens and share links. COMPLIANCE-DPO / org policy can force aggregate-only regardless of individual consent, subject to k-anonymity.
- **Tenant isolation:** Every credential, webhook, SSO/SCIM/LTI connection, and export is bound to exactly one tenant; no credential can read or affect another tenant's data.
- **Least privilege & bounded blast radius:** Credentials default to minimal scopes; even a valid-but-stolen credential can do only what its scopes allow and can never exceed plan entitlements or the seat ceiling or reach epistemic write.
- **Identity vs. content firewall:** SSO/SCIM deprovisioning revokes access and frees seats but never revokes a certificate or alters a trust state; a cert's validity depends on the ledger at issue time (and any SME downgrade), not the holder's current seat. SSO outages fail safe to earned content.
- **Provisioning never oversells:** SSO JIT, SCIM, LTI roster sync, and imports enforce `active + pending ≤ purchased ceiling`; over-ceiling operations block with a reason, never silently truncate or oversell. Raising the ceiling is exclusively BILLING-ADMIN.
- **Publish/assign gate applies across channels:** Content surfaced or assigned via LTI/deep-link/API for graded use must pass the same gate as in-product — a topic with an unresolved `Disputed` claim is not graded-assignable and routes to SME.
- **Webhook delivery is at-least-once + idempotent:** Deliveries retry with backoff, dead-letter, and carry idempotency keys; consumers must dedupe. Ordering is best-effort; critical truth (revocation) is always re-confirmable via the authoritative verify endpoint, which wins over a lagging webhook.
- **Signed and versioned contract:** All webhooks are signature-verifiable; all API traffic is version-pinned; breaking changes ship only under new versions with `Deprecation`/`Sunset` headers and a guaranteed support window; verification/trust semantics are stable across versions.
- **Auditability:** Credential minting/rotation/revocation, SSO/SCIM/LTI config changes, exports, consent grants/revocations, cert-verification lookups at scale, and any denied epistemic-write attempt are audit-logged with actor, timestamp, and reason.
- **Sandbox isolation:** Test-mode and live-mode data and credentials never cross; sandbox certs verify as "test," never production-valid; sandbox calls are non-billable.

### Cross-domain dependencies

**This domain consumes from:**
- **Auth / Identity** — SSO (SAML/OIDC) mechanics, JIT provisioning, session/token lifecycle, and social-login boundaries; this domain owns the tenant *configuration and role-mapping contract* on top of Auth's machinery.
- **Org Admin / Teams** — the seat ceiling (as an upper bound for SSO/SCIM/LTI/import provisioning), roles, cohorts, shared library, the publish/assign gate, and the progress-visibility policy that governs what signals may be read/exported.
- **Tests & Certificates** — certificate issuance/revocation and the public verify page/QR that the verification API and widget resolve against; `test.passed`/`certificate.issued`/`certificate.revoked` as webhook sources; the graded score that LTI passes back.
- **Conflicts & Trust Ledger + Verification Pipeline / Skeptic / Sandbox** — the five-state trust data and coverage matrix that trust-read endpoints expose, and the certification authority this domain must never bypass; the source of `verification.completed`.
- **Settings / Privacy & Consent** — the consent scopes and revocation that gate all learner-data reads/exports; the DSAR/retention rules that govern export and cert-verify data.
- **Billing / Monetization** — plan-tier entitlements that gate API access, rate-limit tiers, and webhook volume; the seat ceiling this domain reconciles against but never raises.
- **Platform Admin** — tenant provisioning/isolation, platform-wide rate-limit/abuse controls, break-glass, and the SSO/SCIM plumbing; TRUST-SAFETY freeze/revoke that must propagate to integrations.
- **Compliance / Data-Protection** — constraints on what learner data may cross the boundary and for which tenants (minors/jurisdiction), forcing aggregate-only or blocking exports/scopes.

**This domain provides to:**
- **EMPLOYER-VERIFIER & their ATS/HRIS** — programmatic + widget certificate verification (authenticity, scope, live revocation), fail-closed.
- **LMS platforms (via INSTRUCTOR)** — LTI 1.3 launch, NRPS roster, deep-linking, and AGS grade passback.
- **Org identity systems (via ORG-ADMIN/DEVELOPER-API)** — SSO configuration and SCIM seat provisioning/deprovisioning contracts.
- **External dashboards & automations** — consented, five-state-faithful trust data, honest signals, coverage matrices, webhooks, and no-code connectors.
- **Trust & Safety / Compliance** — audit trails of credential, consent, export, and verification activity; abuse/enumeration signals.
- **Notifications** — integration-health events (webhook endpoint disabled, SSO/SCIM sync failure, passback failure, deprecation notices).

### Key technical requirements

- **Idempotency everywhere state can be created:** Idempotency keys on write/provisioning calls, SCIM by external id, LTI passback per attempt, and webhook event ids so retries/redeliveries never double-provision, double-grant, or duplicate a score.
- **Signing & authenticity:** HMAC-signed webhook payloads with rotatable secrets (dual-secret grace window on rotation); OAuth2/OIDC and SAML assertion validation (signatures, audience, expiry, replay protection); LTI 1.3 JWT/JWKS validation on every launch and passback.
- **Fail-closed verification path:** Live resolution against source-of-truth for certificate status, explicit unverifiable/degraded state on outage, abuse-resistant limits against cert-id enumeration, and tamper-evident credentials with stable verify-URL/QR.
- **Rate limiting & quotas:** Per-credential and per-tenant limits with standard headers, `429 + Retry-After`, plan-tiered quotas, isolated limits for the public verify endpoint, and graceful degradation that preserves idempotency on retry.
- **Backward compatibility & versioning:** Explicit version pinning (never implicit "latest"), additive-only within a version, `Deprecation`/`Sunset` headers, a published changelog, a guaranteed minimum support window, and stable trust/verification semantics across all versions.
- **Consent & scope enforcement:** Fine-grained, independently grantable scopes; short-lived tokens with refresh; introspection/revocation endpoints; immediate invalidation of tokens and share links on consent revocation; k-anonymity enforcement on aggregate reads/exports.
- **Delivery reliability:** Webhook retry with exponential backoff + jitter, dead-letter queue, manual replay, auto-disable on persistent failure, and at-least-once semantics documented so consumers build idempotently.
- **Sandbox/test mode:** Fully isolated test dataset and credentials, on-demand test event/webhook triggering (including revocation and fail-closed cases), non-billable calls, and mode-scoped idempotency — with hard `wrong_mode` errors preventing cross-mode calls.
- **Observability:** Structured request/webhook/delivery logs, per-endpoint usage/quota telemetry, delivery and passback status surfaced to developers, and audit logs for credentials, consent, exports, SSO/SCIM/LTI config, and any denied epistemic-write attempt.
- **Standards conformance:** OAuth 2.0/OIDC, SAML 2.0, SCIM 2.0, and LTI 1.3 core + NRPS + AGS + Deep Linking implemented to spec so certified LMS/IdP/directory partners integrate without bespoke work.
- **Accessibility of rendered surfaces:** Embeddable verify widgets, LTI launch/consent screens, and the developer console meet the product's non-color-only, keyboard-operable, screen-reader-labeled bar.

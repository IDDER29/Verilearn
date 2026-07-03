## Billing, Plans & Subscriptions (Pro / Teams)

### Overview

This domain owns the commercial boundary of VeriLearn: the plan catalog (Free / Pro / Teams), the `Upgrade → Checkout → Success` conversion flow, the `Settings → Plan & billing` management surface, payment methods, invoices, renewals, proration, cancellation, downgrade, dunning, and the Teams seat pool. It is the machinery that turns the product's value proposition into revenue.

The load-bearing idea — the one thing that separates this domain from any other SaaS billing module — is the **administrative/epistemic firewall**. VeriLearn sells *honesty*, and money must never be allowed to buy *truth*. A paid plan buys **more verification work and higher thresholds** — unlimited topics, *thorough* rather than *standard* verification, the Skeptic on **hard mode**, bring-your-own-sources, priority support — but it never buys a better trust state. A claim marked `Verified·source` on a Free account is exactly as trustworthy as the same claim on Teams; upgrading cannot promote `Sourced → Verified`, resolve a `Conflict`, or fabricate a certificate. Equally, a lapse in payment must never *revoke* a trust signal a learner honestly earned: a certificate minted from verified/sourced claims stays authentic even after the subscription ends, or the `EMPLOYER-VERIFIER` trust chain collapses. Billing therefore controls the **size and thoroughness of the machine**, never **what the machine concluded is true**.

Concretely from the prototypes: Free is $0/mo (3 active topics, standard verification, a monthly verification-run cap, no hard-mode Skeptic); Pro is $12/mo billed annually ($144/yr, a $36 / 20% saving) or $15/mo billed monthly; Teams is $9/seat, minimum 5 seats, Pro plus a shared topic library, admin/analytics, and SSO. A 30-day money-back guarantee applies, checkout is secured by Stripe, and the promise "cancel anytime — your verified lectures stay yours, on any plan" is a hard product invariant.

### Personas involved

- **Self-directed Learner (LEARNER-SELF)** — the primary self-serve buyer. Hits the 3-topic wall and the verification-run cap on Free, feels the contextual upgrade nudge, self-serves Upgrade → Checkout → Success to Pro, and manages/cancels their own subscription.
- **Exam-prep Student (LEARNER-EXAM)** — deadline-driven; the persona most harmed by a billing lockout mid-track. Dunning and grace-period behavior exist largely to protect this user's race to a fixed date.
- **Returning Power-Learner (LEARNER-POWER)** — long-horizon Pro subscriber; cares about renewal continuity, billing-cycle switching (monthly↔annual), and never losing access to a large topic portfolio over a payment hiccup.
- **Skeptical / Expert Learner (LEARNER-SKEPTIC)** — upgrades specifically for hard-mode Skeptic and thorough verification; the persona who most tests the "money buys thoroughness, not truth" line.
- **Guest / Visitor (GUEST)** — evaluates transparent pricing pre-signup; converts or self-selects out. Persists no billing state.
- **Billing / Finance Admin (BILLING-ADMIN)** — the money authority for a Teams tenant. Owns plan, billing cycle, the *paid* seat ceiling, payment methods, invoices, Checkout, renewal, cancellation, and dunning resolution. Cannot decide *who* fills seats and cannot touch any content or trust state.
- **Organization / Teams Admin (ORG-ADMIN)** — allocates and revokes seats *within* the purchased ceiling and assigns roles, but **cannot raise the paid seat count or change plan** (that is BILLING-ADMIN's authority). The seat-pool vs. seat-occupancy split is a first-class permission boundary here.
- **Team Seat Learner (LEARNER-TEAM)** — consumes a paid seat, inherits Pro entitlements, but owns no billing and sees no invoices; must be shielded from any billing-state lockout.
- **Support Agent (SUPPORT-AGENT)** — vendor desk that issues policy-bounded refunds and courtesy credits, helps resolve failed payments/disputes, and unbreaks billing state under scoped consent — but is firewalled from fabricating any learning signal, certificate, or entitlement beyond documented courtesy limits.
- **Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD)** — handles payment fraud, chargebacks, and abuse of the money surface (e.g., refund farming, entitlement gaming); can freeze/revoke entitlements but never hand-certify content.
- **Compliance / Data-Protection Officer (COMPLIANCE-DPO)** — governs invoice/receipt legal fields, tax/VAT collection, financial-record retention, and inclusion of billing data in DSAR/export — advisory/gatekeeping over financial personal data, never over truth or price.
- **Platform Administrator (PLATFORM-ADMIN)** — defines the plan-tier catalog and entitlement mapping operationally (what each tier unlocks), but cannot read epistemic content or set price/trust states.
- **Parent / Guardian (GUARDIAN)** — a non-learning billing owner for a dependent; today served only by a shared account, exposing a real "payer ≠ learner" gap this domain must acknowledge.
- **Developer / API & Integration Consumer (DEVELOPER-API)** — future consumer of seat/SSO provisioning and billing webhooks for a Teams tenant, bound by the rule that nothing external mutates the ledger.

### User stories

- **[BILL-01] As a Self-directed Learner, I want to see a clear three-tier plan comparison (Free / Pro / Teams) with prices and exactly what each unlocks, so that I can decide whether upgrading is worth it.** — *Priority:* MVP — *Why this priority:* The Upgrade page is the top of the conversion funnel and the only place the value of paying is made concrete.
  - *Acceptance criteria:*
    - The page renders three plan cards: Free ($0/mo, "Your current plan"), Pro ($12/mo with "Billed annually · save 20%" and a "Most popular" tag), Teams ($9/seat, "Min. 5 seats").
    - Each card lists its differentiating feature set (Free: 3 active topics, standard verification, spaced review, no Skeptic hard mode; Pro: unlimited topics, thorough verification, Skeptic hard mode, bring-your-own sources, priority support; Teams: everything in Pro + shared library + admin & analytics + SSO).
    - The current plan is visibly marked and its CTA is disabled/"Current plan"; Pro's CTA routes to Checkout; Teams' CTA routes to a sales-assisted "Contact sales" flow.
    - The 30-day money-back guarantee and "cancel anytime — your verified lectures stay yours" line are shown verbatim.
  - *Business rules / validation:* Feature lists are derived from the entitlement catalog (PLATFORM-ADMIN owned), not free text, so a tier change can't drift out of sync with what is actually unlocked. Annual is the default-displayed Pro price; the $15 monthly equivalent is surfaced at Checkout.
  - *Failure & edge cases:* If the entitlement catalog fails to load, show the last-known static tier copy with a non-blocking "prices may be out of date" note rather than an empty page. A user already on Pro who lands here sees Pro marked current and a downgrade/cancel path instead of an upgrade CTA.

- **[BILL-02] As a Self-directed Learner, I want to hit a clear, contextual paywall when I try to exceed Free's 3-topic limit, so that I understand precisely why I'm blocked and how to unblock.** — *Priority:* MVP — *Why this priority:* The topic-limit wall is the single highest-intent conversion trigger in the product.
  - *Acceptance criteria:*
    - Attempting to create/activate a 4th topic on Free surfaces an inline gate ("You've hit your topic limit — upgrade for unlimited topics") with a direct Upgrade CTA, not a generic error.
    - The `Settings → Plan & billing` usage panel reflects the limit in real terms ("Active topics 3 of 3", "Verification runs 18 of 30") with the topic-limit warning banner.
    - The gate deep-links to the Upgrade page pre-scoped to Pro so the returning intent is preserved.
  - *Business rules / validation:* "Active topics" counts topics in a non-archived state; archiving an existing topic frees a slot without upgrading. The Free verification-run cap (30/mo) is a separate meter that resets on the billing anniversary and also triggers a nudge when exhausted.
  - *Failure & edge cases:* A learner exactly at 3/3 who archives one topic must be able to create a new one without any upgrade; the gate must not fire on a false count. If the count is stale (a just-deleted topic), re-check server-side before blocking so the learner is never wrongly walled.

- **[BILL-03] As a Guest, I want to see honest, complete pricing before I create an account, so that I can evaluate the trust-ledger claim without committing.** — *Priority:* Should-Have — *Why this priority:* Aligns with the honesty ethos (no dark-pattern pricing) and reduces post-signup churn, but conversion can technically function behind auth.
  - *Acceptance criteria:*
    - A public pricing view exposes the same three tiers, prices, and feature deltas as the authenticated Upgrade page.
    - Paid CTAs route the guest through signup first, then resume Checkout with the chosen plan/cycle intact.
    - No payment entry or billing state is created for a guest.
  - *Business rules / validation:* Guests persist nothing; plan selection is held in transient state and only materializes after authentication. Prices shown to guests must match the authenticated catalog exactly (no bait pricing).
  - *Failure & edge cases:* If a guest abandons after signup but before payment, they land on Free with no charge and no partial subscription record. Currency/locale defaults gracefully to a base currency if geo cannot be resolved.

- **[BILL-04] As a Self-directed Learner, I want a Checkout screen with a monthly/annual toggle and a transparent order summary, so that I know exactly what I'll be charged before I pay.** — *Priority:* MVP — *Why this priority:* Checkout is the revenue-capture step; billing transparency is a brand promise, not just a legal one.
  - *Acceptance criteria:*
    - A billing-cycle toggle switches between Annual ($12/mo, "$144 billed yearly", "SAVE 20%") and Monthly ($15/mo, "Billed monthly"); the order summary and the pay button amount update live.
    - The order summary itemizes subtotal, the annual saving (−$36.00), and the final total; the pay button reads the exact charge (e.g., "Pay $144 & upgrade").
    - Payment fields (cardholder name, card number, expiry, CVC) are captured via Stripe with the "Secured by Stripe · 30-day money-back" assurance shown.
  - *Business rules / validation:* Card data is tokenized by Stripe and never touches VeriLearn servers (PCI scope stays with the processor). The displayed total must equal the amount actually authorized — no hidden add-ons. Annual charges the full year upfront; monthly charges per cycle.
  - *Failure & edge cases:* Client-side validation flags an invalid/expired card before submission; a valid-looking card that fails authorization surfaces via BILL-07 without granting entitlements. Toggling cycle after a field error must preserve entered (non-card) fields.

- **[BILL-05] As a Self-directed Learner, I want an immediate confirmation that my upgrade is live with a receipt and renewal date, so that I trust the transaction completed and know when I'll next be billed.** — *Priority:* MVP — *Why this priority:* The Success state closes the loop and is where entitlements must visibly unlock.
  - *Acceptance criteria:*
    - On success, the screen confirms the plan is active ("✦ Pro active", "Welcome to Pro!"), lists the newly unlocked entitlements (∞ topics, thorough verification, hard-mode Skeptic), and shows the renewal date (e.g., "Renews Jul 3, 2027").
    - A receipt is emailed to the account address and the fact is stated on-screen ("A receipt was emailed to …").
    - CTAs let the learner start a Pro topic or return to the dashboard, and Pro entitlements are usable immediately (the topic/verification gates are lifted the same session).
  - *Business rules / validation:* Entitlement flip is transactional with payment capture — no "paid but still gated" window. Renewal date is computed from the charge date and cycle. The emailed receipt is the canonical financial record and also appears in Billing history (BILL-10).
  - *Failure & edge cases:* If payment captured but the entitlement flip lags (webhook delay), the Success page polls/reconciles and shows a brief "activating…" state rather than a false "not upgraded"; the learner is never charged without eventual entitlement. If the receipt email bounces, billing history still holds the invoice.

- **[BILL-06] As a Returning Power-Learner, I want to view and update my payment method in Settings, so that a card expiry or replacement never interrupts my subscription.** — *Priority:* Should-Have — *Why this priority:* Prevents involuntary churn for long-horizon subscribers, but a first-time upgrade can ship without standalone card management.
  - *Acceptance criteria:*
    - `Settings → Plan & billing` shows the payment method on file (brand + last-4 + expiry) or "No card on file" on Free.
    - The learner can add, replace, or remove a card via a Stripe-hosted/tokenized flow; the change takes effect for the next charge.
    - Removing the only card on an active paid plan warns that renewal will fail without a replacement.
  - *Business rules / validation:* Only the account/billing owner can manage the payment method; a LEARNER-TEAM seat has no card management (billing belongs to BILLING-ADMIN). Full PAN is never displayed or stored — last-4 only.
  - *Failure & edge cases:* Updating to an invalid card is rejected at entry, keeping the prior card active. Removing a card mid-cycle does not cancel the current paid period; it only risks the next renewal (feeds dunning, BILL-17).

- **[BILL-07] As a Self-directed Learner, I want a clear, actionable error when my card is declined at Checkout, so that I can fix it and complete my upgrade without being charged or half-upgraded.** — *Priority:* MVP — *Why this priority:* Declines are common at the exact revenue-capture moment; a confusing failure here directly loses conversions. (Failure scenario.)
  - *Acceptance criteria:*
    - A declined/failed authorization keeps the learner on Checkout with a specific reason (declined, insufficient funds, expired, incorrect CVC, network error) and a retry affordance.
    - No entitlement is granted and no subscription record is created on a failed charge; the plan remains Free.
    - The learner can correct card details and re-submit; a successful retry proceeds to Success normally.
  - *Business rules / validation:* Entitlements flip only on confirmed capture; a failed/pending charge is never treated as paid. Repeated rapid retries are rate-limited to avoid triggering issuer fraud locks.
  - *Failure & edge cases:* If the network drops after submit but before confirmation, Checkout reconciles idempotently (BILL-20) so the learner is neither double-charged nor left in an ambiguous "did it work?" state. 3-D Secure / SCA challenges that are abandoned are treated as a decline, not a hang.

- **[BILL-08] As a Self-directed Learner, I want a Plan & billing home that shows my current plan, real usage against my limits, payment method, and invoice history, so that I can understand my account at a glance.** — *Priority:* MVP — *Why this priority:* This is the single management surface for the entire subscription lifecycle.
  - *Acceptance criteria:*
    - Shows the current plan and its headline entitlements ("Free — 3 active topics · standard verification"), with an Upgrade CTA when not on the top relevant tier.
    - Shows this month's usage as meters ("Active topics 3 of 3", "Verification runs 18 of 30") and surfaces the at-limit warning when a meter is exhausted.
    - Shows the payment method state and a Billing history list (or "No invoices yet — you're on the Free plan" when empty).
  - *Business rules / validation:* Usage meters read live counts and reset on the billing anniversary; on Pro, topic/verification-run meters read "unlimited" rather than a numeric cap. Only the billing owner sees invoices; a LEARNER-TEAM sees plan/entitlement state but not tenant invoices.
  - *Failure & edge cases:* If usage counting is temporarily unavailable, show the plan and payment state with a "usage syncing…" placeholder rather than blocking the page. A Free user always sees the empty billing-history state, never a spurious invoice.

- **[BILL-09] As a Returning Power-Learner, I want to download my invoices and receipts, so that I have records for reimbursement or accounting.** — *Priority:* Should-Have — *Why this priority:* Needed for expense/reimbursement and Teams finance, but not required to transact.
  - *Acceptance criteria:*
    - Billing history lists each charge (date, description, amount, cycle, status) with a downloadable invoice/receipt (PDF).
    - Each invoice carries the required legal/tax fields and matches the amount actually charged.
    - Refunds and credits appear as their own line items, never by silently mutating a prior invoice.
  - *Business rules / validation:* Invoices are immutable once issued; corrections are made via credit notes. Retention of financial records follows the COMPLIANCE-DPO policy (BILL-21). Teams invoices are visible to BILLING-ADMIN, not to individual seats.
  - *Failure & edge cases:* A missing/failed invoice generation surfaces a "receipt available shortly" state and retries, rather than showing a broken link. Historical invoices remain downloadable after downgrade or cancellation.

- **[BILL-10] As a Returning Power-Learner, I want to switch between monthly and annual billing, so that I can optimize cost or cash flow without losing my subscription.** — *Priority:* Should-Have — *Why this priority:* A retention/monetization lever (annual reduces churn), but the core upgrade works with a single default cycle.
  - *Acceptance criteria:*
    - The learner can switch cycles from Plan & billing; the change and any proration are previewed before confirmation.
    - Switching monthly→annual applies the 20% saving and shifts the renewal date; annual→monthly takes effect at the next renewal.
    - The new cycle, next charge amount, and next renewal date are confirmed on-screen and by email.
  - *Business rules / validation:* Proration credits unused time on the current cycle toward the new one; the previewed amount must equal the charged amount. Entitlements are identical across cycles (cycle changes price/date, never features).
  - *Failure & edge cases:* If a cycle switch's payment fails, the prior cycle stays active unchanged (no entitlement loss). Rapid back-and-forth switching is debounced to prevent proration thrash.

- **[BILL-11] As a Self-directed Learner, I want to cancel my subscription and understand exactly what I keep, so that I can stop paying without fear of losing my learning.** — *Priority:* MVP — *Why this priority:* "Cancel anytime — your verified lectures stay yours" is an explicit brand promise and a legal/trust requirement.
  - *Acceptance criteria:*
    - Cancellation is self-serve; it schedules downgrade at period end (the learner keeps paid entitlements until the paid period they already bought expires).
    - The cancel flow states precisely what persists (all verified lectures, earned certificates, gap map, review history) and what changes (topic activation capped at 3, hard-mode Skeptic and thorough verification disabled for *new* work).
    - After the period ends, the account moves to Free and Plan & billing reflects it.
  - *Business rules / validation:* Cancellation never deletes learning content or revokes earned certificates. No refund is auto-issued for the remaining period unless within the 30-day money-back window (BILL-20). Access continues through the already-paid period.
  - *Failure & edge cases:* A learner who cancels then re-subscribes before period end simply keeps continuity (no gap). If cancellation is attempted during a failed-payment/dunning state, it still succeeds and stops further collection attempts.

- **[BILL-12] As a Self-directed Learner downgrading from Pro to Free, I want to keep all my verified content and choose which topics stay active, so that a downgrade never destroys work I did.** — *Priority:* Should-Have — *Why this priority:* The downgrade path is where the "your lectures stay yours" promise is most likely to break; getting it right protects trust, though it follows the MVP cancel flow.
  - *Acceptance criteria:*
    - When a Pro user with more than 3 topics downgrades, they are prompted to choose which 3 remain active; the rest become archived/read-only, not deleted.
    - Archived topics retain their full trust ledger, sources, conflicts, gap-map links, and any certificates; they can be re-activated by re-upgrading or by archiving a different topic to free a slot.
    - Hard-mode Conflicts already raised on Pro remain visible/adjudicable; only *new* hard-mode Skeptic runs and thorough re-verification are gated off.
  - *Business rules / validation:* Trust states set while on Pro are preserved verbatim on Free — downgrade cannot alter a claim's trust state. The 3-active-topic cap applies to activation, not to retention of past content.
  - *Failure & edge cases:* If the learner doesn't choose, a deterministic default (e.g., 3 most-recently-active) is applied and clearly communicated, never a silent data loss. Certificates earned on Pro remain externally verifiable after the downgrade.

- **[BILL-13] As a Billing/Finance Admin, I want to upgrade my organization to Teams and set the initial seat count, so that I can provision capacity for my group at $9/seat.** — *Priority:* Should-Have — *Why this priority:* Opens the B2B revenue line; distinct from self-serve Pro and typically sales-assisted, so it follows the individual flows.
  - *Acceptance criteria:*
    - The Teams path (from "Contact sales" / Checkout) lets BILLING-ADMIN choose a seat count (minimum 5) and billing cycle, with the total ($9 × seats × cycle) previewed before payment.
    - On success, the tenant is provisioned with the purchased seat *ceiling*, admin/analytics, SSO, and a shared topic library entitlement.
    - BILLING-ADMIN receives the invoice and sees the tenant plan in Plan & billing.
  - *Business rules / validation:* Minimum 5 seats enforced at purchase and on any later reduction. BILLING-ADMIN owns the ceiling and money; assigning humans to seats is ORG-ADMIN's job (BILL-15). Teams entitlements = Pro + shared library + admin/analytics + SSO.
  - *Failure & edge cases:* An attempt to buy fewer than 5 seats is blocked with a clear minimum message. If provisioning partially fails after charge, the system reconciles to the paid ceiling (never charges for capacity not provisioned).

- **[BILL-14] As a Billing/Finance Admin, I want to raise or lower the paid seat ceiling mid-cycle with clear proration, so that spend tracks actual utilization without waste.** — *Priority:* Should-Have — *Why this priority:* Right-sizing is the core Teams cost lever and a stated BILLING-ADMIN pain point (finance pays for 50, ORG-ADMIN filled 32).
  - *Acceptance criteria:*
    - Increasing seats mid-cycle prorates the added seats for the remaining period and previews the charge before confirmation.
    - Decreasing seats is blocked below the number of *currently occupied* seats and below the 5-seat minimum; the reduction takes effect per policy (immediate credit or next-renewal) and is previewed.
    - The new ceiling, proration, and next renewal are confirmed on-screen and by invoice.
  - *Business rules / validation:* You cannot reduce the ceiling below occupied seats (would orphan active learners); freeing seats is ORG-ADMIN's action first. Proration math shown must equal the amount charged/credited.
  - *Failure & edge cases:* If BILLING-ADMIN tries to cut seats a learner is mid-track on, the flow requires ORG-ADMIN to reclaim/deprovision that seat first. Concurrent seat edits are serialized (BILL-22).

- **[BILL-15] As an Organization/Teams Admin, I want to allocate and reclaim seats within the purchased ceiling but be prevented from changing the paid seat count or plan, so that people-provisioning and money-authority stay separated.** — *Priority:* MVP — *Why this priority:* This permission split is the domain's defining B2B invariant; conflating the two authorities is a security and governance failure.
  - *Acceptance criteria:*
    - ORG-ADMIN can invite, assign, and reclaim seats up to the ceiling and see utilization (e.g., 32 of 50), but the "buy more seats / change plan / change cycle" controls are absent or explicitly gated to BILLING-ADMIN.
    - When ORG-ADMIN needs more capacity than the ceiling allows, the UI routes them to request an increase from BILLING-ADMIN rather than letting them purchase.
    - In a small org where one human holds both roles, both capability sets are available but remain permission-separable.
  - *Business rules / validation:* ORG-ADMIN controls *who* occupies seats; BILLING-ADMIN controls *how many* seats exist and the price. Neither can certify claims, resolve Conflicts, or promote sources.
  - *Failure & edge cases:* An ORG-ADMIN inviting past the ceiling is blocked with a "seats full — request an increase" message, never a silent over-provision. A LEARNER-TEAM offboarded by ORG-ADMIN frees a seat immediately but their earned certificates and gap-map history are retained/disposed per the tenant's offboarding policy.

- **[BILL-16] As an Exam-prep Student on a paid plan, I want a failed renewal to enter a graceful grace period instead of locking me out, so that a billing hiccup never blocks me mid-track before my exam.** — *Priority:* MVP — *Why this priority:* A lockout at the wrong moment directly harms the deadline-driven persona and destroys trust; graceful dunning is a hard requirement. (Failure scenario.)
  - *Acceptance criteria:*
    - A failed renewal charge starts a dunning sequence (in-app banner + email) with a defined grace window during which paid entitlements remain active.
    - The learner is prompted to update their payment method and can retry immediately; a successful retry silently restores good standing.
    - Only after the grace window fully lapses does the account downgrade to Free — and even then, verified content and certificates are preserved.
  - *Business rules / validation:* Dunning retries follow a fixed schedule; entitlements are not revoked on the *first* failure. For Teams, dunning targets BILLING-ADMIN and must not lock individual LEARNER-TEAM seats during grace. No mid-track test or review in progress is interrupted by a downgrade.
  - *Failure & edge cases:* If grace lapses mid-lecture, the learner keeps read access to already-verified content and any in-flight test attempt completes; only *new* Pro-gated actions stop. A recovered payment after downgrade re-upgrades without data loss.

- **[BILL-17] As a Support Agent, I want to issue a policy-bounded refund or courtesy credit within the 30-day money-back guarantee, without ever touching a learning signal or certificate, so that I can resolve billing complaints while honoring the epistemic firewall.** — *Priority:* Should-Have — *Why this priority:* Refund handling is a routine support need and a firewall test case, but sits behind the core self-serve flows.
  - *Acceptance criteria:*
    - Within a consented, scoped, audited session, SUPPORT-AGENT can issue a refund/credit within documented policy limits (e.g., the 30-day money-back window) which appears as its own billing-history line.
    - A refund adjusts entitlements (e.g., moves the account to Free) but leaves the trust ledger, calibration, retention, gap map, and any earned certificate untouched.
    - Actions beyond policy limits (larger refunds, plan gifting) require BILLING-ADMIN/escalation and are not self-grantable.
  - *Business rules / validation:* Refunds never fabricate or revoke learning signals; a certificate honestly earned is not clawed back by a refund. All refund actions are logged with actor, scope, and reason.
  - *Failure & edge cases:* A refund request outside the money-back window is declined with the policy stated, not silently granted. If a learner pleads to "restore a lost streak/cert," the agent can only restore *genuinely-lost* state from a checkpoint — never fabricate a signal (hard firewall).

- **[BILL-18] As a Trust & Safety Lead, I want to detect and act on payment fraud and chargeback abuse by freezing or revoking entitlements, without hand-certifying or falsifying any content, so that the money surface can't be used to game the platform.** — *Priority:* Should-Have — *Why this priority:* Protects revenue and platform integrity; lower volume than routine billing but high-severity. (Failure scenario.)
  - *Acceptance criteria:*
    - A chargeback or flagged-fraud payment can trigger entitlement freeze/revoke and, where warranted, account suspension, with the reason recorded.
    - Revoking a fraudulently-obtained *paid* entitlement does not delete honestly-earned epistemic records, but any certificate whose issuance depended on fraud is flagged/quarantined and routed — never hand-invalidated on the truth axis.
    - Patterns like refund-farming, repeated failed-then-reversed charges, or seat-entitlement gaming are surfaced for review.
  - *Business rules / validation:* TRUST-SAFETY-LEAD can freeze/ban/revoke but cannot set a trust state or resolve a Conflict; certificate legitimacy questions route to SME/COMPLIANCE. Revocation is auditable and reversible if the fraud finding is overturned.
  - *Failure & edge cases:* A false-positive fraud freeze must be fully reversible, restoring the exact prior entitlement and untouched learning state. A chargeback on Teams freezes the tenant's *added* capacity but must not instantly orphan active learners mid-track without notice.

- **[BILL-19] As a Compliance/Data-Protection Officer, I want tax/VAT collection, compliant invoices, and financial-record retention/export, so that billing meets legal and audit obligations without exposing learning data.** — *Priority:* Should-Have — *Why this priority:* Required for real-world sale (especially Teams/EU), but can trail the initial transactional flows.
  - *Acceptance criteria:*
    - Checkout collects the tax fields required for the buyer's jurisdiction (e.g., VAT ID for Teams), and invoices carry legal/tax line items and the seller's required details.
    - Billing/financial records are retained per the defined retention schedule and are included, scoped to financial data only, in a DSAR/data export.
    - Certificate-audit requests can confirm a credential's authenticity/scope/revocation without exposing unrelated billing or learning content.
  - *Business rules / validation:* COMPLIANCE-DPO governs financial personal data and credential compliance but sets neither price nor trust state. Tax computation must match the charged total; financial records are immutable and separately retained from deletable learning data.
  - *Failure & edge cases:* A DSAR deletion of the account must retain the minimum financial records the law requires (invoices) while removing learning data, and this boundary is stated to the user. A tax-lookup failure blocks charge in tax-required jurisdictions rather than under-collecting.

- **[BILL-20] As a Self-directed Learner, I want Checkout to be idempotent under retries, double-clicks, and network drops, so that I'm never double-charged or half-upgraded.** — *Priority:* MVP — *Why this priority:* Payment concurrency bugs cause direct financial harm and support load; correctness here is non-negotiable. (Failure scenario.)
  - *Acceptance criteria:*
    - Submitting the same Checkout twice (double-click, retry, back-then-resubmit) results in at most one charge and one subscription.
    - A confirmed-charge-but-lost-response is reconciled so the learner ends in the correct paid+entitled state without a second charge.
    - The pay button disables on submit and reflects processing state to discourage duplicate submits.
  - *Business rules / validation:* Each Checkout attempt carries an idempotency key honored end-to-end with the processor. Entitlement flips are keyed to the confirmed charge, exactly once.
  - *Failure & edge cases:* Two devices/tabs completing Checkout for the same account converge to one active subscription. A webhook delivered twice does not double-provision. If reconciliation genuinely cannot determine state, the account is held un-charged/un-entitled and routed to support rather than guessing in the platform's favor.

- **[BILL-21] As a Skeptical/Expert Learner, I want upgrading to visibly buy *more verification thoroughness* and never a better trust verdict, so that I can trust that no claim's status was bought.** — *Priority:* MVP — *Why this priority:* This is the thesis-critical invariant that distinguishes VeriLearn billing from any other SaaS; violating it would undermine the entire product.
  - *Acceptance criteria:*
    - Plan/upgrade copy frames paid benefits strictly as scope and thoroughness (unlimited topics, thorough vs. standard verification, hard-mode Skeptic, BYO sources), never as "better/higher trust."
    - A given claim's trust state is identical regardless of plan; re-running under Pro may surface *more* checks/conflicts but cannot upgrade `Sourced → Verified` by fiat.
    - Certificates and trust states earned on any plan remain valid and unchanged across upgrade, downgrade, cancellation, or lapse.
  - *Business rules / validation:* No billing event may write to the trust ledger, resolve a Conflict, promote a source, or mint/void a certificate on the truth axis. Certification authority stays with the pipeline, execution sandbox, and SME-REVIEWER only.
  - *Failure & edge cases:* If a paid re-verification finds *weaker* support and moves a claim to `Disputed`/`Unsupported`, that honest downgrade stands even though the learner paid — money cannot protect a claim from the Skeptic. A billing lapse must never silently re-rate or hide previously-verified claims.

- **[BILL-22] As a Billing/Finance Admin, I want concurrent seat and plan edits to be safe and consistent, so that two admins acting at once can't corrupt the seat pool or double-bill.** — *Priority:* Nice-to-Have — *Why this priority:* Real for larger Teams tenants but low-frequency; core flows work single-admin. (Failure scenario.)
  - *Acceptance criteria:*
    - Simultaneous seat-count changes are serialized; the final ceiling is deterministic and each admin sees the reconciled result.
    - A plan change and a seat change issued concurrently resolve to one consistent invoice, not two conflicting charges.
    - The billing surface shows the current authoritative state after any concurrent edit (optimistic-lock/refresh on conflict).
  - *Business rules / validation:* Seat-pool and plan state have a single source of truth with conflict detection; the last write is explicit, not silently clobbering. Occupied-seat and 5-seat-minimum invariants hold under concurrency.
  - *Failure & edge cases:* On a write conflict, the losing admin is told the state changed and re-previews before retry, rather than applying stale intent. A partial provisioning failure mid-concurrent-edit reconciles to the paid ceiling.

- **[BILL-23] As a Parent/Guardian, I want to own billing for a dependent learner, so that I can pay for and oversee a teen's account safely — a gap the current single-shared-account model exposes.** — *Priority:* Future — *Why this priority:* A genuine, acknowledged product gap (payer ≠ learner) that today's shared-account model does not properly serve; important to name but not yet built.
  - *Acceptance criteria:*
    - The billing owner can be a distinct identity from the learner, holding the payment method, invoices, and plan while the dependent runs the learning loop.
    - Guardian-facing billing views expose spend and plan without exposing the dependent's private learning signals beyond what policy permits.
    - Cancellation/downgrade by the guardian preserves the dependent's earned certificates and verified content per the standard invariant.
  - *Business rules / validation:* Payer authority (money) is separable from learner identity (content), mirroring the ORG-/BILLING-ADMIN split; a guardian cannot certify or alter learning content. Age-appropriate compliance (COPPA/FERPA-adjacent) is governed by COMPLIANCE-DPO.
  - *Failure & edge cases:* Until built, the shared-account workaround must at minimum not let a billing lapse delete the dependent's verified work. A guardian removing payment triggers standard dunning/grace, protecting the dependent from abrupt lockout.

### Business rules & invariants

- **Money buys thoroughness, never truth.** No billing event (upgrade, downgrade, refund, chargeback, seat change) may write to the trust ledger, resolve a Conflict, promote a source, or change a claim's trust state. Paid tiers unlock *scope* (unlimited topics), *depth* (thorough verification, hard-mode Skeptic), and *inputs* (bring-your-own sources) — not verdicts.
- **Earned trust survives billing state.** Verified lectures, trust states, gap maps, review history, and certificates earned on any plan persist through downgrade, cancellation, non-payment lapse, and (for content) refund. A certificate stays externally verifiable regardless of current subscription status; only fraud (via TRUST-SAFETY-LEAD) can quarantine one, and never on the truth axis.
- **Cancel-anytime is literal.** Cancellation stops future billing, keeps entitlements through the already-paid period, then downgrades to Free without deleting content. The 3-active-topic Free cap is an *activation* limit (learner chooses which 3), never a deletion.
- **Authority separation.** BILLING-ADMIN owns the *size* of the seat pool, plan, cycle, and money; ORG-ADMIN owns *who* occupies seats; neither can certify or resolve Conflicts. SUPPORT-AGENT acts only within scoped consent and documented courtesy/refund limits. PLATFORM-ADMIN defines the entitlement catalog but reads no epistemic content.
- **Tier definitions:** Free $0/mo (3 active topics, standard verification, monthly verification-run cap ~30, no hard-mode Skeptic); Pro $12/mo annual ($144/yr, 20%/$36 saving) or $15/mo monthly (unlimited topics, thorough verification, hard-mode Skeptic, BYO sources, priority support); Teams $9/seat, minimum 5 seats (Pro + shared library + admin/analytics + SSO).
- **Charge integrity.** The amount displayed equals the amount authorized (no hidden fees); entitlements flip exactly once, only on confirmed capture; every Checkout is idempotent under retry; card data is tokenized by Stripe and never stored by VeriLearn (PCI scope stays with the processor).
- **No mid-track lockout.** Failed renewals enter a grace/dunning window before any downgrade; in-flight tests/reviews are never interrupted by a billing state change; Teams dunning targets BILLING-ADMIN and does not lock individual seats during grace.
- **Proration transparency.** Every mid-cycle change (cycle switch, seat add/remove) previews the exact proration before confirmation, and the preview equals the charge. Seats cannot drop below occupied seats or below 5.
- **Guarantee & records.** A 30-day money-back guarantee applies; invoices are immutable (corrections via credit notes); financial records are retained per COMPLIANCE-DPO policy independently of deletable learning data.

### Cross-domain dependencies

- **Needs from Auth/Identity (20-auth):** the authenticated account and role model (billing owner vs. seat holder vs. admin), and SSO for Teams provisioning.
- **Needs from Topics/Pipeline (22):** the active-topic count and verification-run meter that drive Free-tier gates and upgrade nudges; the entitlement flags (thorough vs. standard verification, hard-mode Skeptic) that the pipeline and Skeptic read to decide how much work to do.
- **Provides to Conflicts/Trust (25) & Lecture (23):** entitlement gating for hard-mode Skeptic and thorough re-verification — but strictly as scope/depth, never as authority to change a trust state.
- **Provides to Tests/Certificates (28):** the guarantee that a certificate's validity is independent of billing state; consumes nothing that lets billing mint or void a credential on the truth axis. Feeds EMPLOYER-VERIFIER's external certificate-verification trust chain.
- **Needs from Teams/Org admin (12/13 personas):** ORG-ADMIN seat occupancy and utilization to enforce the "can't reduce below occupied" rule and to route ORG-ADMIN seat-increase requests to BILLING-ADMIN.
- **Provides to Support (Support surface) & Notifications (31):** dunning banners/emails, receipt emails, renewal reminders, refund confirmations, and the scoped-consent hooks SUPPORT-AGENT uses for billing actions.
- **Needs from Compliance/Privacy (Settings → Privacy, Danger zone):** the retention boundary that keeps required financial records while honoring learning-data deletion (DSAR), and tax/jurisdiction rules.
- **Provides to Reports/Progress (32):** seat-utilization and certificate-count signals BILLING-ADMIN uses to justify spend — expressed as honest signals, never vanity metrics.

### Key technical requirements

- **Payment processor integration:** Stripe (or equivalent) for tokenized card capture, subscriptions, proration, invoices, tax, and SCA/3-D Secure; VeriLearn stores only non-sensitive references (customer/subscription IDs, brand + last-4). PCI scope stays with the processor.
- **Idempotent, transactional entitlement flips:** every charge/webhook carries an idempotency key; entitlement changes are exactly-once and keyed to confirmed capture, with a reconciliation job for lost responses and duplicate webhooks. No "paid-but-gated" or "gated-but-paid" windows.
- **Webhook-driven reconciliation:** subscription lifecycle events (payment succeeded/failed, renewal, cancellation, chargeback) update entitlements asynchronously with a self-healing reconciler; the Success screen polls until entitlements are live.
- **Metering:** low-latency read of active-topic count and monthly verification-run count to drive gates and nudges; meters reset on billing anniversary; Pro reads "unlimited" rather than a numeric cap.
- **Proration & seat engine:** deterministic proration for cycle switches and mid-cycle seat changes, with a preview that provably equals the charge; enforcement of the 5-seat minimum and occupied-seat floor under concurrency (optimistic locking / single source of truth for the seat pool).
- **Dunning system:** scheduled retry sequence with in-app + email touchpoints and a defined grace window; must never interrupt in-flight learning actions; separate handling for Teams (target BILLING-ADMIN, protect seats).
- **Tax & compliance:** jurisdiction-aware tax/VAT collection at Checkout, legally-compliant immutable invoices, financial-record retention separate from deletable learning data, and certificate-audit endpoints scoped to credential authenticity only.
- **Auditability & firewall enforcement:** every billing action logged with actor, scope, consent, and reason; a hard architectural boundary ensuring no billing code path can write to the trust ledger, resolve a Conflict, or mint/void a certificate on the truth axis.
- **Cost note:** billing itself is low-AI-cost, but entitlements it grants (thorough verification, hard-mode Skeptic, unlimited topics) are the primary drivers of pipeline/model spend — so entitlement checks must be reliable enough that unpaid accounts never trigger paid-tier verification cost.

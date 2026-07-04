### Billing, Plans & Subscriptions (BILL)

| Story | Status | Evidence / Justification |
| --- | --- | --- |
| BILL-01 | 🟡 Partial | Faithful static Upgrade page exists (`web/app/upgrade/page.tsx`) but is not wired to an entitlement catalog; feature copy is hardcoded, current-plan marking / catalog-load fallback not derived from data. |
| BILL-02 | ✅ Done | Free 3-topic paywall enforced server-side before compute: `web/lib/services/topics.ts:83-84` (`plan === "free" && existing.length >= 3` → inline "Upgrade to Pro" error), surfaced in the real create flow via `web/app/topic-actions.ts` → `web/app/new-topic/page.tsx:105`. (Verification-run meter and Settings usage panel remain static.) |
| BILL-03 | 🟡 Partial | The three-tier content exists but only inside the auth-gated Upgrade page (rendered in `AppShell`); no public/guest pricing route and no signup-then-resume-checkout flow. |
| BILL-04 | ⏭️ Deferred | Static Checkout screen exists (`web/app/upgrade/checkout/page.tsx`); cycle toggle, live order summary, and card capture need Stripe (tokenization/PCI). No adapter yet. |
| BILL-05 | ⏭️ Deferred | Static Success screen exists (`web/app/upgrade/success/page.tsx`); transactional entitlement flip on capture and emailed receipt need Stripe + transactional email (both deferred infra). |
| BILL-06 | ⏭️ Deferred | Payment-method management (`Settings → Plan & billing`, static `web/app/settings/plan/page.tsx`) needs Stripe-hosted tokenized card flow; brand+last-4 storage seam not built. |
| BILL-07 | ⏭️ Deferred | Card-decline handling requires Stripe authorization results; no payment backend to produce declined/insufficient/expired reasons. |
| BILL-08 | 🟡 Partial | Static Plan & billing home exists (`web/app/settings/plan/page.tsx`); `user.plan` exists in the entity model (`web/lib/store/entities.ts:24`) and topic counts are live, but usage meters, payment state, and invoice history are not wired. |
| BILL-09 | ⏭️ Deferred | Invoice/receipt PDF download, legal/tax fields, and credit notes need Stripe/invoicing + retention policy; no generation seam. |
| BILL-10 | ⏭️ Deferred | Monthly↔annual switch with proration preview needs a proration engine + Stripe; not implemented. |
| BILL-11 | ⏭️ Deferred | Self-serve cancel scheduling downgrade-at-period-end needs a subscription backend; not built. (Content-persistence invariant is upheld at the engine level — no billing path deletes content.) |
| BILL-12 | 🟡 Partial | The load-bearing invariant is engine-guaranteed: trust states are ledger-computed independent of plan (`web/lib/domain/trust.ts`) and the 3-cap is an activation limit (`topics.ts`), so a downgrade cannot alter content/trust. Missing: the "choose which 3 stay active" downgrade UI/flow and archive-on-downgrade mechanics. |
| BILL-13 | ⏭️ Deferred | Teams entity (`seatLimit`, `web/lib/store/entities.ts:37-38`) and `billing_admin` role (`web/lib/domain/rbac.ts:165`) exist as seams, but seat purchase / provisioning / SSO need Stripe + SSO vendor. |
| BILL-14 | ⏭️ Deferred | Mid-cycle seat raise/lower with proration and occupied-seat floor needs a proration/seat engine + Stripe; only the `seatLimit` field exists. |
| BILL-15 | 🟡 Partial | The defining authority split is implemented and tested at the policy layer: `org_admin` holds `org:manage_seats` not `billing:manage`, `billing_admin` the reverse (`web/lib/domain/rbac.ts:162-165`; tests `rbac.test.ts:62-64`). Missing: seat-allocation UI, utilization view (e.g. 32/50), and request-increase routing. |
| BILL-16 | ⏭️ Deferred | Dunning/grace sequence (in-app banner + email, retry schedule, grace window) needs a dunning system + payment + email; not built. |
| BILL-17 | ⏭️ Deferred | Refund/credit mechanics need Stripe; the epistemic firewall seam holds — `support_agent` cannot write trust (`canWriteTrust()` always false, `rbac.test.ts:95-97`) so a refund can never touch a learning signal. |
| BILL-18 | ⏭️ Deferred | Chargeback/fraud freeze needs payment + fraud infra; firewall seam holds — `trust_safety` role has no `trust:write`, certificate legitimacy routes to SME (rbac invariant sweep `assertNoFirewallViolation`). |
| BILL-19 | ⏭️ Deferred | Tax/VAT collection, compliant immutable invoices, and financial-record retention/DSAR-scoping need a tax engine + Stripe + DB retention; not built. |
| BILL-20 | ⏭️ Deferred | Idempotent-checkout (idempotency key, once-only entitlement flip, reconciler for lost responses/duplicate webhooks) needs Stripe end-to-end; no payment path exists to make idempotent. |
| BILL-21 | ✅ Done | Thesis-critical firewall enforced in the engine: `trust:write` is granted to NO human role and `canWriteTrust()` is always false for every role (`web/lib/domain/rbac.ts:76,251`; `assertNoFirewallViolation`; tests `rbac.test.ts:95-97`), and trust states are ledger-only via a verification-capability check (`web/lib/domain/trust.ts:30`). No billing role/path can promote `Sourced→Verified` or mint/void a certificate on the truth axis (196 domain tests). Upgrade copy frames benefits as scope/depth only. |
| BILL-22 | ⏭️ Deferred | Concurrency-safe seat/plan edits (serialization, optimistic locking, single source of truth) need the seat/billing backend that isn't built; only the in-memory `seatLimit` field exists. |
| BILL-23 | ⏭️ Deferred | Guardian payer≠learner model is an explicitly Future gap; distinct billing-owner identity not built. The lapse-preservation invariant is upheld at the engine level (no billing path deletes verified work), but the separable-payer flow needs a product/business decision. |

Counts: 2 Done, 5 Partial, 16 Deferred, 0 Out-of-scope (23 total).

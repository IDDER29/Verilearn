## Critique & Gaps — Security, Privacy & Regulatory Compliance

**Framing.** VeriLearn's security thinking is unusually mature *along one axis*: the administrative/epistemic firewall (who can decree truth) is specified in code-level detail across Auth, Org, Platform-Admin, and Settings. But that firewall protects the **ledger's integrity**, not the **learner's personal data**. When you shift the lens from "can an admin fake a Verified?" to "where does a 15-year-old's free-text answer physically go, who processes it, under what agreement, and how do we delete it," the PRD thins out fast. The most load-bearing gaps are not in the trust spine — they are in the boring GDPR/FERPA/COPPA plumbing a verification-first product marketed to students and schools cannot ship without. Findings are ordered by leverage.

---

### 1. Third-party LLM sub-processor data flows are completely unspecified — [Blocker]

**The gap.** Every core surface streams learner-authored free-text to external model inference: topic specs (`22`), predict/connection/cloze responses (`23`), rubric-graded task answers (`24`), community/discuss posts (`29`), Skeptic threads. The Privacy panel's binding promise is *"we never sell your data or train public models on it"* (`SETTINGS-11`, invariant `I4`). That sentence is about **VeriLearn's own** models — it is silent on the **inference providers** (the LLMs powering the Pipeline, Skeptic, and grader) who actually *receive the raw learner text*. Zero files mention "sub-processor," "third party," "model provider," "data processing agreement," or provider-side retention/training.

**Risk / failure mode.** (a) A learner pastes their name, a classmate's name, health details, or an employer's confidential material into a task answer; that text is transmitted to a third-party LLM and may be retained/logged/trained-on under that provider's default terms. (b) The Privacy panel is then **literally false** for a verification-first product whose brand *is* honesty — the single most damaging place to be caught overstating. (c) GDPR Art. 28/30 require a documented sub-processor chain and DPAs; FERPA's "school official" exception and COPPA both require contractual control over downstream processors. None exists in the spec.

**Improvement.** Add a first-class **sub-processor register** (public page + in-app "where your data goes" disclosure), require **zero-retention / no-train inference agreements** with every model provider, and add a **PII-minimization/redaction pass on free-text before it leaves the trust boundary** (see #8). Extend `I4` to explicitly cover inference providers, not just training. **Impact:** closes the highest-probability "your honesty claim is false" incident and unblocks any GDPR/FERPA-bound buyer.

### 2. Minors are the marketed audience but COPPA/FERPA handling is "Future" — [Blocker]

**The gap.** GUARDIAN is a named persona ("typically a teen"), LEARNER-EXAM is explicitly deadline-driven students (high-schoolers), yet age handling is self-declared with **no verification**, and age-gating, guardian consent, and minor data-minimization are all marked *Future* (`AUTH-21`, `SETTINGS-15`). The product is being taken to a market it is not lawfully equipped to serve.

**Risk / failure mode.** An under-13 signs up (self-declares 18) → COPPA violation on first byte of personal data collected, per-child statutory penalties. A school assigns it to a class → FERPA education-record obligations trigger with no consent instrument. "We'll disclose the single-account limitation" (`AUTH-21` interim) does not cure an unlawful-collection problem.

**Improvement.** Do not ship minor-attracting go-to-market until at minimum: (a) an **age gate at signup that hard-blocks under-threshold accounts without verifiable guardian consent** (already the stated end-state in `AUTH-21` failure case — pull it forward from Future to MVP), and (b) **minor-safe defaults enforced** (`I9`: no public community profile, suppressed marketing, no public cert page — see #6). **Impact:** removes existential regulatory exposure; a proper guardian-linked model then becomes a *wedge into schools* (see Opportunities), not a liability.

### 3. Encryption at rest / in transit / key management is unspecified — [Blocker for procurement]

**The gap.** "Encrypt" appears once, hedged as *"where feasible"* for operator caches (`37`). There is no baseline requirement for TLS in transit, encryption at rest for the ledger, honest signals, PII, or credentials, and no key-management/rotation story. Honest signals (what a learner gets wrong, where they're overconfident) are explicitly called "genuinely sensitive" (`20` overview) — that data sits unprotected in the spec.

**Risk / failure mode.** Fails every enterprise/education security questionnaire and DPA on day one; a storage-layer compromise exposes plaintext education records and behavioral profiles. "Where feasible" is not a control a regulated buyer will accept.

**Improvement.** State non-negotiable baselines: TLS 1.2+ in transit, AES-256 at rest for all learner data classes, envelope encryption with managed KMS + rotation, and **per-tenant key isolation** for Teams so tenant isolation (`AUTH-20`) holds at the crypto layer, not just row-level scoping. **Impact:** table-stakes; without it every Teams/school deal stalls in security review.

### 4. No personal-data breach detection / notification workflow — [High]

**The gap.** The spec has rich *integrity*-incident machinery (sandbox escape, prompt-injection, quarantine, status page — `ADMIN-03/06/17/23`) but **no personal-data-breach process**: no detection→assess→notify pipeline, no named owner, no clock. Every "breach" mention in the corpus is a *trust-integrity* breach, not a data breach.

**Risk / failure mode.** A credential-stuffing success or storage leak exposing learner PII triggers **GDPR Art. 33/34 (72-hour regulator notice + data-subject notice), US state breach laws, and FERPA** obligations — with no workflow, VeriLearn misses statutory deadlines and compounds the incident with a reporting failure.

**Improvement.** Give COMPLIANCE-DPO a **breach-response workflow**: severity classification, 72-hour regulator clock, templated data-subject + ORG-ADMIN (tenant-scoped) notification, and a post-incident register. Reuse the existing audit trail (`ADMIN-20`) as the evidence source. **Impact:** converts a guaranteed compliance failure during any incident into a controlled, defensible response.

### 5. No data residency / regional pinning — [High]

**The gap.** "Region" exists only as a tenant-registry field (`ADMIN-01`), not a data-residency guarantee. No EU/UK/regional storage or processing commitment for learner data — which compounds #1 (the LLM sub-processors may process EU learner text in the US).

**Risk / failure mode.** Blocks EU enterprise and most public-sector/education deals; creates GDPR Chapter V (international transfer) exposure with no SCCs or transfer-impact assessment.

**Improvement.** Add **per-tenant data-region selection** (EU/US at minimum) covering storage *and* inference routing, with SCCs where transfers are unavoidable. **Impact:** unlocks the entire EU/regulated market segment that the Teams tier is aimed at.

### 6. Public certificate verify-page: PII exposure, enumeration, and minors — [High]

**The gap.** `TEST-12` handles this better than most (learner-chosen fields, deeper-signal consent off by default, minor-consent gate at issuance) — but two holes remain. (a) The verify page is *useful to an employer only if "issued-to" (a real name) is shown*, and it is public with no login (`TEST-11`); there is **no rate-limiting / anti-enumeration** on the verify-URL space, so the page set is scrapable into a "who is learning what" corpus (doxxing, competitive intel, targeting). (b) For a **minor**, publishing name + topic on an open page by default is a safeguarding failure even if issuance is consent-gated.

**Risk / failure mode.** Cert-ID enumeration harvests {name, topic, date} at scale; minors' names become publicly indexable.

**Improvement.** Non-enumerable verify tokens (high-entropy, not sequential), per-IP rate-limiting + bot defense on the public page, and a **minor default of no public name** (verify shows scope + validity, name released only on a per-request, learner/guardian-approved reveal). **Impact:** preserves the credential's external usefulness while closing a real harvesting/safeguarding vector.

### 7. SME-REVIEWER is a single, concentrated epistemic-write authority with thin insider-threat controls — [High]

**The gap.** The firewall correctly stops admins/T&S/support from certifying — but it does so by funnelling **all** truth-power into SME-REVIEWER accounts (set trust states, resolve Conflicts, promote sources → back employer-trusted certs). That role gets no dual-control, no n-of-m for high-stakes certification, no mandatory hardware MFA, and no anomaly detection on certification actions. The most valuable insider-threat target in the whole product is the least hardened.

**Risk / failure mode.** One compromised or malicious SME account mints Verified states that flow into certificates an EMPLOYER-VERIFIER trusts — the exact catastrophic outcome the firewall exists to prevent, achieved through the one door the firewall leaves open.

**Improvement.** **Mandatory phishing-resistant MFA** for SME (and all epistemic-write) accounts; **dual-control (2-of-N) for certifications underlying certificate-eligible topics**; anomaly detection on SME action rate/patterns feeding T&S (`ADMIN-13`); and SME-action step-up re-auth. **Impact:** removes the single point of epistemic compromise; makes the "un-buyable, un-decreeable ledger" claim actually true against insiders.

### 8. No stored-XSS / content-security posture for user- and AI-generated content — [High]

**The gap.** Lectures, community, discuss, and task answers all render untrusted free-text (learner-authored *and* LLM-authored). Auth (`20`) covers tokens/sessions thoroughly but nothing covers **output encoding, sanitization, Content-Security-Policy, or CSRF** on the surfaces that render that content. There is also no rule that free-text is scanned/redacted for PII (of the author *or of named third parties*) before storage/LLM transmission.

**Risk / failure mode.** Stored XSS in a multi-tenant app → session/token theft, cross-learner and cross-tenant account takeover, ledger-tampering via a hijacked SME session. An LLM-generated lecture that reflects an injected payload back into the DOM is a novel variant. PII of un-consenting third parties (a learner names a real person in an answer) is silently stored and shipped to sub-processors.

**Improvement.** Mandate strict CSP, context-aware output encoding, HTML sanitization on all rendered free-text, CSRF protection, and secure/httpOnly/SameSite cookies; add a **PII-detection/redaction gate** on free-text before persistence and before any LLM call. **Impact:** closes the most common real-world web-app compromise path and the third-party-PII leak.

### 9. No DPA / FERPA / contractual data-processing instruments in the Teams flow — [Medium]

**The gap.** `ORG-21` lets COMPLIANCE-DPO *restrict visibility* for minor/regulated tenants, but there is no surface for the **contractual** layer a school/enterprise legally requires: a Data Processing Addendum (controller↔processor), SCCs, or a FERPA "school official" written agreement, plus a per-tenant record of consent basis and processing purposes.

**Improvement.** Add a tenant-level **compliance agreements surface** (DPA acceptance, FERPA designation, sub-processor acknowledgment, region election) gated into Teams onboarding (`ORG-01`). **Impact:** turns "legal will get back to you" into self-serve; shortens enterprise sales cycles.

### 10. Retention schedules are asserted but never defined — [Medium]

**The gap.** "Configurable retention per data class" recurs (`SETTINGS-14`, `ADMIN-20`) but no **data-class inventory** or **concrete default periods** exist, and there is no inactive-account/dormant-data minimization policy. GDPR storage-limitation and FERPA both require defined, defensible periods.

**Improvement.** Enumerate data classes (identity, ledger, honest signals, free-text answers, community content, audit, certs, billing) each with a default retention + legal basis, and add auto-purge of dormant accounts. **Impact:** makes "we honor retention" auditable instead of aspirational.

### 11. Automated decision-making has no transparency / contest path — [Medium]

**The gap.** Predicted-readiness, calibration, drill-detection, and rubric grading are **automated profiling** that gate certificates and, via Teams per-learner visibility (`ORG-11`), can influence employment/education outcomes. There is no right-to-explanation, human-review, or contest mechanism (GDPR Art. 22 territory; also basic fairness for a rubric-graded pass/fail).

**Improvement.** Provide learner-facing "why this score/prediction" transparency and a **human-review request** for a contested grade or a materially adverse Teams-visible signal. **Impact:** de-risks Art. 22 exposure and strengthens the fairness story that a trust-first brand should own.

### 12. Audit-log lifecycle vs. erasure, and log access, are unresolved — [Medium]

**The gap.** Audit logs are immutable/append-only (`ADMIN-20`, `ORG-22`) and contain PII (actor/target, IP, approximate location, before/after state). There is no stated **retention bound**, no reconciliation of immutability with erasure (the cert version of this is solved in `I7`/`ADMIN-21`; the general audit-log version is not), and no access-control model for *who reads the logs* or whether audit PII is in DSAR scope.

**Improvement.** Define audit retention + a **pseudonymization-on-erasure** rule (retain the action, sever the deleted subject's direct identifiers) and restrict/route audit reads. **Impact:** resolves the immutability↔erasure conflict before a DSAR forces an ad-hoc answer.

### 13. Full-portfolio export and support impersonation are under-guarded exfil surfaces — [Medium]

**The gap.** The JSON export is a complete PII + behavioral-profile + full-ledger bundle (`SETTINGS-13`), but has no **step-up auth** or **post-export notification**. Two under-specified rules: can a Teams **seat learner export the org's shared-library ledger** (org IP leak)? And support impersonation (`AUTH-17`, `SETTINGS-21`), while scoped/consented, still lets a vendor *read plaintext learner content* — the "operators can't read epistemic content" claim (`AUTH-20`, `37`) is hedged "where feasible" and unenforced.

**Improvement.** Require step-up re-auth + notification for export; scope export to the learner's *own* data (exclude org-owned shared ledgers); and specify the enforcement mechanism (confidential compute / field-level encryption) behind the "operators can't read content" claim rather than "where feasible." **Impact:** closes account-takeover-to-exfil and makes a headline privacy claim actually true.

### 14. No cookie/ePrivacy consent or lawful-basis register — [Medium]

**The gap.** `SETTINGS-12` gives an analytics opt-out toggle, but there is no cookie-consent mechanism (ePrivacy/EU) and no per-purpose lawful-basis mapping (consent vs. legitimate interest vs. contract).

**Improvement.** Add a consent-management layer and an internal processing register mapping each purpose to a lawful basis. **Impact:** removes a common, cheap-to-fix EU non-compliance.

### 15. No government / law-enforcement data-request policy or transparency reporting — [Medium/Low]

**The gap.** `ADMIN-16` mentions a "legal/law-enforcement coordination path" for *illegal content*, but there is no policy for **subpoenas/warrants for learner data**: no legal review gate, notice-to-user default, minimization of what's produced, or transparency reporting.

**Improvement.** Define a law-enforcement-request procedure (legal review, narrowest-scope production, user-notice-unless-gagged) and publish a transparency report cadence. **Impact:** matches the honesty brand and pre-empts a trust-eroding "they handed over my data quietly" story.

### 16. Promoted-into-source community content: permanence vs. right-to-be-forgotten — [Medium]

**The gap.** Deletion "anonymizes" community contributions to keep threads coherent (`AUTH-19`, `SETTINGS-19`), and a **promoted** reply becomes durable ledger canon (`ADMIN-10`). If that free-text contains the author's or a third party's PII, anonymizing authorship does not scrub PII *in the text*, and the content is now load-bearing for other learners' verified topics — an erasure request collides with ledger dependency.

**Improvement.** On promotion, **canonicalize the substance away from the PII-bearing free-text** (SME rewrites the promoted claim/source into neutral form) so the ledger depends on the sourced fact, not the person's words. **Impact:** lets erasure succeed without holing the ledger.

---

### Differentiators & opportunities

- **Extend "verification-first" to data conduct — a Privacy Trust Ledger.** [Opportunity] The product's whole moat is *showing its work* on truth. Do the same for data: a public **sub-processor register**, a per-topic *"here's exactly where your text went and what was retained"* trace, and a live region/encryption badge. No ed-tech competitor does provable data transparency; it converts the compliance burden of #1/#3/#5 into the *same honesty moat* the ledger already is. Highest strategic upside.
- **FERPA/COPPA-native education tier with guardian-linked accounts.** [Opportunity] The value prop ("a bot won't confidently teach my kid something false") is a perfect wedge into schools — the exact market it currently *cannot lawfully serve*. Building the guardian↔dependent model, age-gating, and school DPAs (fixing #2/#9) turns the biggest liability into the biggest greenfield.
- **Learner-held, selectively-disclosed credentials (verifiable credentials / selective disclosure).** [Opportunity] Let an employer verify a cert's authenticity, scope, and non-revocation **without harvesting the learner's name** (zero-knowledge / minimal-disclosure proof). Resolves the built-in employer-appetite-vs-learner-privacy tension (`TEST-12`) in the learner's favor and is a genuinely differentiated credential.
- **Verifiable no-train / confidential inference as a schools-and-regulated-industries feature.** [Opportunity] Pair #1's zero-retention inference with attestation ("your child's answers were processed in an EU region and never retained by the model provider — here's the proof"). Turns a defensive control into a premium, trust-brand-aligned selling point.
- **Privacy-preserving cohort ROI.** [Opportunity] `ORG-11` already enforces k-anonymity; layer differential privacy on the cohort honest-signal roll-ups so a manager gets ROI trends that are *provably* non-re-identifying — the honest-metrics ethos applied to the surveillance-risk surface.

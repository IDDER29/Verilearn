## Critique & Gaps — Trust & Academic Integrity

**Lens:** Can the trust ledger, calibration, drills, reputation, tests, and certificates survive an adversary who *wants* to cheat — and does "verified" stay meaningful when the person being certified controls the machinery? VeriLearn's spec is unusually thorough on *content-side* integrity: source hallucination (VERIFY-16), prompt injection (VERIFY-19, TASK-17), vote-rings (COMM-12, TRUST-21), self-promotion (COMM-13), timer honesty (TEST-19/22), and revocation (TEST-13). But it has aimed almost all of that machinery at the *system* and the *content*, and left the **learner-as-adversary** and the **learner-as-their-own-certifier** almost entirely undefended. The result: a credential branded as employer-trustworthy whose entire chain of trust is, for the majority of users, controlled by the person it certifies.

Findings ranked highest-leverage first. Tags: **[Blocker]** (thesis-breaking / ship-gating for the credential), **[High]**, **[Medium]**, **[Opportunity]**.

---

### 1. The certificate is epistemically self-signed — the learner controls every link in their own credential's chain of trust. **[Blocker]**

Trace who controls each step for a **Free/Pro self-directed learner** (the majority of all certificate-earners):

1. **They author the topic spec** (VERIFY-01) — subject, level, and scope are theirs.
2. **They are the trust authority in their own topic** (TRUST-03, TRUST-08 business rule: "the owner of a personally-generated topic" may mutate trust states). They adjudicate their own Skeptic conflicts, choosing which competing position "wins."
3. **They attach their own sources** to shore up unsupported claims (TRUST-09, TRUST-11) and pick the preferred citation.
4. **The test draws only from the claims they just certified** (TEST-02) and awards a certificate on a ≥75% pass (TEST-10).
5. **They type their own name onto it** (TEST-12: "the learner chooses the display name / identifier shown on the cert").

Every link — scope, verification, adjudication, sourcing, identity — is learner-controlled. The domain doc itself states the load-bearing dependency: *"the cert's meaning rests on SME-certified claims upstream"* (TEST-10 business rules). **For self-topics there is no SME.** The learner *is* the SME, the examiner, and the examinee. The public verify page (TEST-11) attests "questions drawn only from verified & sourced claims" without ever disclosing that the claims were verified by the certificate holder themselves.

- **Missing rule/validation:** a self-authored, self-adjudicated topic must carry a **verification-independence status**, and the certificate + public verify page must disclose it ("self-verified — no independent review"). Today the cert conflates "a machine + an independent SME vouched for this" with "I vouched for my own topic."
- **Missing role:** an **independent certifying authority for individual (non-Teams) certs** — see Finding 7.
- **Risk:** the moment one serious employer or journalist notices they can mint themselves an "Advanced Distributed Systems, ≥75%, verified-only" certificate on a topic they wrote and graded, the credential's market value — and the brand's honesty claim — collapses in a single tweet.
- **Fix/impact:** either (a) tier and label credentials by independence (Opportunity O1), or (b) route self-topic certs through an independent examination path (O2). Doing neither means the flagship output is a self-signed trust claim wearing a trust-brand's clothes.

---

### 2. Tests are unproctored, open-book, take-anywhere, with no identity proofing — the credential proves nothing about *who did what*. **[Blocker]**

The Tests domain pours enormous effort into *timer* honesty — server-authoritative clock, single-session lock, no pause, no tab-reset (TEST-19, TEST-22, key tech reqs). It defends against exactly one cheat: stopping the clock. It is silent on every other academic-integrity threat:

- **No proctoring / environment integrity.** Nothing stops a second device with ChatGPT, a Google tab, a textbook, or a knowledgeable friend beside the learner. "Navigation is paused so the timer stays honest" (TEST-04) locks the *VeriLearn tab* and nothing else.
- **No identity proofing.** The cert's "issued-to" is a self-chosen string (TEST-12). There is no binding to a proofed real-world identity, so a cert proves only *"someone, somewhere, passed an unproctored test and typed this name."*
- **No impersonation defense.** Anyone can sit the test for anyone. TEST-15 gestures at "timer/proctor anomalies" as a T&S signal — but there is **no proctoring instrumented anywhere to produce those anomalies.** It is detection with nothing to detect.

The gap between the marketed value ("a portable credential an employer trusts," "a work-showing credential") and the actual assurance ("an anonymous, open-book, single-tab quiz on self-authored material") is the widest gap in the product.

- **Missing requirement:** an **integrity/assurance tier on every test and cert** — at minimum {unproctored-self-study, identity-verified, proctored} — surfaced on the verify page so an employer knows what assurance they're trusting. Unproctored is fine; *undisclosed* unproctored dressed as a trust credential is not.
- **Missing role:** a **Proctor / integrity-monitor** (human or automated) for high-assurance sittings; and an **Academic Integrity Officer** distinct from TRUST-SAFETY-LEAD (whose remit is *ledger* integrity, i.e., is the content true — a different discipline from *did this learner do this work honestly*: collusion, impersonation, contract cheating).
- **Fix/impact:** the honest short-term fix is disclosure (cheap, ships now). The value-creating fix is an optional proctored + identity-verified tier (O2), which is also the natural enterprise/Teams upsell.

---

### 3. No item security: the answer key is handed to the learner before the "mastery" test. **[Blocker]**

Everything the learner is tested on, they have already been drilled on *with the answers and sources exposed*, against a **finite, learner-visible claim set** (many topics will have 6–25 claims):

- Review reveals each card's answer + trust state + exact citation (REVIEW-03).
- Tasks name precisely which criterion is "missing" (TASK-03) and unlock the model answer on pass (TASK-06).
- Test **results show, for every miss, the exact verified claim and its source** (TEST-05).
- **Retakes re-quiz the same claims** with fresh wording (TEST-07), across a 2–3 attempt ceiling.

So a learner: fails attempt 1, reads the claim+source for every miss on the results screen, and passes attempt 2 having been handed the key. Because questions are "internally bound to exactly one eligible claim" (TEST-02) and the claim set is small and enumerable, **the entire answer key is derivable** — often after a single failed attempt. There is no held-out item bank; review, tasks, and tests all draw from the *same* claim set (TEST business rules, TASK-13, REVIEW-15). "Mastery" is measured on material the learner has seen from every angle, with citations, on a set they can enumerate.

- **Missing requirement:** a **held-out assessment item bank** distinct from the taught/practiced claim surface, and **suppression of exact-claim/source disclosure until the attempt ceiling is exhausted** (or on a delay), so results-feedback can't function as a live answer key mid-retake.
- **Risk:** the "Mastery" cert measures test-taking persistence, not mastery; the credential is farmable by anyone willing to fail once. This compounds Findings 1–2: self-authored + open-book + no item security = a formality, not an exam.
- **Fix/impact:** item security is the difference between an assessment and a completion badge. Overlaps with the learning-science team's transfer-bank finding — build it once, it fixes both integrity and validity.

---

### 4. "Resolve to unlock a question / boost readiness" gamifies adjudicating *toward* Verified — a built-in conflict of interest with zero QA on self-resolutions. **[High]**

The product actively *rewards* resolving conflicts in the direction that expands the test pool and raises the score:

- "Boost your odds → resolve 1 conflict (frees a claim for the test)" (TEST-03, TEST-09).
- Resolving a conflict "makes it eligible for future tests and updates predicted readiness" (TRUST-07).

In a self-topic the **incentivized party and the adjudicator are the same person.** The Skeptic *raises*; the learner *disposes* (TRUST-03); and the UX explicitly dangles a reward for disposing toward eligibility. Nothing checks the *quality* of a self-adjudication. A learner can resolve "Dijkstra works on any weighted graph" as `Verified · source` with a hand-waved rationale, unlock the question, and cite it in a certificate. The immutable audit log (TRUST-03 key tech req) *records* the resolution but **no one ever reviews it** off-Teams.

- **Missing workflow/validation:** (i) when a learner resolves *against* the Skeptic's cited counter-evidence, require a source that actually addresses the counterexample, not free-text; (ii) **sampled QA / anomaly review of self-adjudications** (a claim self-resolved with a weak or non-responsive rationale is flagged, especially when it becomes cert-backing); (iii) carry a **"self-adjudicated" provenance marker** on such claims through to test eligibility and the cert.
- **Risk:** adjudication is the domain's "central epistemic act" (TRUST-03) — and it's structured as a graded self-assessment where the grader profits from a lenient grade. That is a conflict of interest the product would red-team instantly if a competitor shipped it.
- **Impact:** without QA, "Disputed → Verified" is a self-serve upgrade button, and every downstream promise (test eligibility, cert) inherits the leniency.

---

### 5. Learner-attached sources mint test-eligible `Sourced` claims with no check that the source supports the claim. **[High]**

`Sourced` is **test-eligible** (TEST-02: eligible pool = Verified·execution, Verified·source, *or Sourced*). Yet a learner can move a claim from `Unsupported → Sourced` by attaching *their own* citation (TRUST-09), and the doc is explicit that learner attachment produces `Sourced` = "cited, not independently proven" — i.e., **the association is asserted, not matched.** TRUST-09's own edge case admits a "malformed/unreachable reference is accepted as a note but marked unverifiable" — but a *reachable* citation that simply *doesn't support the claim* is not checked at all off-pipeline. The pipeline does citation-support matching (VERIFY-11/16); a learner's manual attach does not.

So the self-service path is: find an unsupported claim gating your test → paste any plausible-looking URL → claim is now `Sourced` → question unlocks → readiness rises. No verification that the citation says what the claim says.

- **Missing validation:** run learner-attached citations through the **same source-support matching** the pipeline uses (VERIFY-16) before the claim becomes `Sourced` and *before* it becomes test-eligible; until matched, hold at `Sourced · unmatched` and **exclude from test pools**.
- **Missing rule:** `Sourced` claims backed only by learner-attached, unmatched citations should not count toward the certificate attestation without disclosure — "verified & sourced" reads to an employer as "checked," not "the holder pasted a link."
- **Impact:** closes the cheapest path to unlocking your own test questions and keeps "Sourced" from silently degrading into "self-asserted."

---

### 6. "Verified" never expires and is never re-checked — source rot, retractions, and edition drift silently erode the ledger. **[High]**

A claim verified against a source at time *T* stays `Verified` indefinitely. Re-verification is **only** triggered reactively — when an SME shores up a source or closes an unsupported row (VERIFY-17, TRUST-17). There is:

- No periodic re-verification.
- No source-liveness / link-rot monitoring.
- No detection of **retracted papers, superseded editions, or changed URLs**.
- No freshness signal on the claim, the coverage matrix, or the certificate.

A certificate (TEST-10, valid "forever" unless revoked) can rest on a claim whose backing paper was retracted years earlier, and nothing in the system will ever notice. The revocation machinery (TEST-13) only fires when a *human SME* downgrades a claim — which, in self-topics, never happens.

- **Missing requirement:** a **re-verification cadence + source-liveness monitor** (link health, retraction feeds, edition checks) that can auto-flag a stale claim to `Disputed`/`needs re-verification` and drive the existing revocation path.
- **Missing signal:** a **"verified as of" freshness stamp** on claims and certs; a cert older than its evidence's last check should read "verified as of <date>, re-check pending," not an unqualified "valid."
- **Impact:** for a product whose entire moat is that "verified" *means* something, an unmonitored, never-expiring "verified" is a slow-motion integrity failure — and a differentiator if solved (O6).

---

### 7. Missing role + missing tier: no independent certifying authority for the majority of certificates. **[High]**

The persona roster has **SME-REVIEWER**, but by construction they exist *only in shared/Teams libraries* (TRUST-08, TRUST-12; VERIFY-17). The entire credential value prop is pinned to SME certification (TEST-10: "the cert's meaning rests on SME-certified claims upstream"). Yet the largest cohort — individual Free/Pro learners — has **no SME, no reviewer, no independent authority of any kind.** This is a stated architectural dependency with no supplier for most of its consumers.

- **Missing role:** an **Independent Examiner / Certifying Authority** (or a pool of SME reviewers, or an automated adversarial re-examiner) that can vouch for a self-authored topic *without the learner in the loop* — the thing that makes a cert worth more than the learner's own say-so.
- **Missing product tier:** credentials graded by *verification independence*, not just score (O1). Right now a Teams-SME-reviewed cert and a self-signed cert are **visually indistinguishable** on the public verify page — the honest, high-effort credential is diluted to the level of the self-graded one.
- **Impact:** this is the structural root under Findings 1–3. Fixing it (even by honestly *labeling* the tiers) restores the meaning of the ones that deserve meaning.

---

### 8. Cheap identity / Sybil resistance is the unaddressed root under every reputation and promotion defense. **[High]**

The community and promotion defenses are sophisticated but all **downstream heuristics** on top of an assumed-scarce identity that is never made scarce:

- Vote-ring detection (COMM-12, TRUST-21) is behavioral graph analysis *after* accounts exist.
- `nominator ≠ approver` (COMM-13) is enforced "at the data layer" — but keyed on **identity**, and a second free account is a trivial bypass: sockpuppet A nominates, "SME"/owner-account B (same human, in a personal topic where "the request routes to the topic owner acting as reviewer," COMM-06) approves.
- The **"Verified Learner" badge** (COMM overview, Auth deps) — *what verifies them?* No mechanism is specified.
- Multi-account collusion on tests (TEST-15) and answer-harvesting rings are named as threats with no upstream defense.

Reputation feeds *promotion into the canon* (COMM-08) — the one path a human voice enters the ledger. If accounts are free and unlimited, the whole anti-abuse edifice is built on sand.

- **Missing requirement:** **Sybil resistance / proof-of-personhood** as a first-class prerequisite for reputation accrual, promotion nomination, and the "Verified Learner" badge — email+phone uniqueness at minimum, stronger for promotion/cert weight. Rate-limit and cost new-account reputation.
- **Missing rule:** `nominator ≠ approver` must be reinforced by **same-payment-instrument / same-device / correlated-identity** checks, not identity-string inequality alone.
- **Impact:** turns COMM-12/TRUST-21 from whack-a-mole into a defensible perimeter.

---

### 9. The certificate is not self-describing — "≥75%, verified-only" hides scope, difficulty, and rigor. **[High]**

The public verify page shows issued-to, topic scope, date, pass bar, and the verified-only attestation (TEST-11). It does **not** show: claim count, coverage-health %, difficulty band, whether hard-mode Skeptic ran, whether execution-verification was used, or verification independence. So a learner can mint **"Advanced Cryptography — Interview level, passed ≥75%, verified-only"** on a topic they scoped to 4 trivial beginner claims, self-verified, and open-book-passed on the second try. The words say "rigorous credential"; the substance can be near-zero, and *the cert format actively conceals the difference.*

- **Missing requirement:** put **verification provenance on the cert and verify page** — claim count, coverage %, difficulty/level as *assessed* (not as self-labeled), hard-mode flag, execution-verified fraction, model/pipeline version (already tracked, VERIFY-20), and independence tier. Let the artifact describe its own rigor.
- **Missing validation:** a **minimum-substance floor** for cert-eligibility (e.g., N verified claims, minimum coverage, minimum non-trivial difficulty) so "Mastery" can't be issued over a degenerate topic — analogous to TEST-20's "not enough eligible claims to test," but as a *cert* gate, not just a test gate.
- **Impact:** radical self-description (O3) is both the honest fix and a genuine differentiator — no credential issuer today ships a machine-readable rigor profile with every certificate.

---

### 10. Unlimited task attempts + explicit "what's missing" feedback = brute-force the LLM grader to a pass, and that gamed pass feeds readiness and Transfer. **[Medium]**

Tasks are "effectively unlimited" attempts (TASK-05), the grader is an LLM, and each result **names the exact missing criterion** ("Missing: names the cut-property assumption that breaks," TASK-03). That is a tight optimization loop: resubmit, read which criterion is still red, target it, repeat — until the *grader* is satisfied, with no guarantee the *learner* understands. TASK-17 defends against injection and verbatim copy-through, but not against **iterative criterion-fishing**, which is legitimate-looking prose each time. And this isn't purely formative: task pass-rate **feeds predicted readiness and the Transfer signal** (TASK-13, TASK-18), and Transfer/Calibration are opt-in shareable to employers.

- **Missing validation:** detect **criterion-fishing** (many resubmissions converging criterion-by-criterion), cap or space unlimited retries when they look like grader-optimization rather than learning, and/or **withhold per-criterion specifics** after the first miss (show "a criterion about X is still missing" without handing the exact target).
- **Impact:** keeps the pass-rate signal — which leaks into a shareable readiness/Transfer number — from being an artifact of grader-gaming.

---

### 11. Execution "proof" is gameable when the learner controls or can observe the oracle. **[Medium]**

`Verified · execution` is the strongest, most-differentiated state (VERIFY-12) and grades computational Apply tasks (TASK-10). The spec guarantees the sandbox "refuses rather than fakes" — but that only governs the *runtime*, not the **oracle**. If the learner writes or can see the assertions, they can pass trivially: `assert True`, hardcoded expected outputs, harness-detection, or code that special-cases the known test inputs. Nothing in TASK-10/VERIFY-12 specifies that the **verifying assertions are hidden from and uninfluenceable by the learner**, or that inputs are randomized/held-out.

- **Missing requirement:** execution grading must use **hidden, adversarial, randomized-input oracles** the learner cannot read or influence; property-based / fuzzed checks rather than fixed assertions; and detection of harness-gaming (constant outputs, input-sniffing).
- **Impact:** protects the crown-jewel trust state from becoming "the learner proved their code passes the learner's own test."

---

### 12. Gameable calibration/blind-spot signals are opt-in *shareable to employers* — i.e., a juked metric can become a credential input. **[Medium]**

The learning-science review already establishes that calibration is computed against a *self-reported* recall proxy and is trivially, unconsciously juked (uniform hedging improves the number). From the integrity angle, the incremental risk is the **export path**: TEST-12 lets a learner opt in to sharing calibration/transfer/Reports with an employer, and REVIEW-20's anti-juking detection is reactive heuristics. So a learner can hedge their way to a flattering "well-calibrated" number and *ship it as part of a credential.*

- **Missing rule:** a signal must clear an **integrity/validity bar before it is externally shareable** — no gameable, self-report-derived metric should be presented to an employer as a credential attribute. At minimum, externally-shared signals must carry the same "as measured / Sourced-not-Verified" honesty qualifier the product applies to claims.
- **Impact:** prevents the honesty brand from selling employers a number it privately knows is juke-able (defer the *metric* fix to learning-science; own the *don't-export-it-gamed* rule here).

---

### 13. No cross-learner collusion / answer-sharing detection; Community "Discuss" is an unguarded answer channel. **[Medium]**

TASK-17 detects copy-through of the *model answer* and *lecture prose* — i.e., copying from the *system*. It does **not** detect **learner-to-learner** copying: two learners submitting near-identical task answers, or answers circulated in Community threads (a stuck learner is explicitly routed to Discuss/Community). For Teams cohorts and any shared/public topic, this is the classic contract-cheating / answer-bank vector, and it's entirely open.

- **Missing requirement:** **cross-submission similarity detection** across learners (and against Community posts) for task answers, scoped by topic/cohort; flag suspiciously-shared answers to the Academic Integrity Officer (Finding 2).
- **Impact:** essential the moment Teams cohorts or public topics exist; today it's a blind spot the moderation/T&S tooling doesn't cover.

---

### 14. Minor / shared-account impersonation: a cert can be earned by someone other than the named learner. **[Medium]**

Multiple domains flag the "single-shared-account model" as a known gap and defer GUARDIAN flows. For *credentials* this is sharper: guardian consent for minor cert issuance (TEST-16) governs *permission*, not *authorship* — it does not establish that the **minor actually did the work**. On a shared family account there is no per-user identity, so a parent can complete tests/tasks a child is credentialed for (or vice versa), and the cert names whoever the account chooses.

- **Missing requirement:** per-learner identity within shared/guardian contexts, and an explicit **authorship-attestation** step for minor-issued credentials; carry the assurance tier (Finding 2) so an employer/school sees the credential was earned under a shared-account, unverified-authorship condition.
- **Impact:** without it, minor and shared-account certs are the easiest class to fabricate, and they're the class with the most regulatory exposure.

---

## Missing roles, rules, and validations (roundup)

**Roles absent from the 24-persona roster:**
- **Independent Examiner / Certifying Authority** for individual (non-Teams) certs — the missing supplier for the "certs rest on SME-certified claims" dependency (Findings 1, 7).
- **Academic Integrity Officer** — distinct from TRUST-SAFETY-LEAD; owns *did-this-learner-do-this-work-honestly* (impersonation, collusion, contract cheating, proctoring), a different discipline from *is-the-content-true* (Findings 2, 13).
- **Proctor / integrity-monitor** (human or automated) to instrument the "proctor anomalies" TEST-15 already assumes exist (Finding 2).

**Rules/validations that need to exist:**
- Verification-**independence** status on every topic and cert, disclosed on the verify page (F1, F7, F9).
- Assessment/credential **assurance tier** {self-study / identity-verified / proctored}, disclosed externally (F2).
- **Held-out item bank** + suppression of exact-claim disclosure until attempts exhausted (F3).
- **QA/sampling of self-adjudications**, and source-responsiveness requirement when resolving against Skeptic counter-evidence (F4).
- Source-support **matching for learner-attached citations** before `Sourced`/test-eligibility (F5).
- **Re-verification cadence + source-liveness/retraction monitoring** and a "verified-as-of" freshness stamp (F6).
- **Sybil resistance / proof-of-personhood** as a prerequisite for reputation, promotion, and the "Verified Learner" badge (F8).
- **Minimum-substance floor** for certificate issuance (F9).
- **Criterion-fishing detection** and post-first-miss feedback throttling (F10).
- **Hidden adversarial oracles** for execution grading (F11).
- **Shareability gate** on gameable signals; cross-learner **collusion detection** (F12, F13).
- Per-user identity + **authorship attestation** in shared/guardian contexts (F14).

---

## Differentiators & opportunities

- **[Opportunity] O1 — Tiered, honestly-labeled credentials.** A visible ladder: **Self-study → Peer-reviewed → SME-verified → Proctored & identity-verified.** Turns the biggest weakness (Finding 1) into the product's most honest feature: *nobody else grades their own credentials by verification independence.* Employers filter by tier; higher tiers are the Teams/enterprise monetization path. This single move rescues the certs that deserve to mean something from the ones that don't.
- **[Opportunity] O2 — Independent adversarial re-examination.** For any learner who wants a *trustworthy* cert on a self-authored topic: a held-out exam bank + optional proctored, identity-verified sitting, graded by an authority the learner didn't control. This is the difference between a completion badge and a credential — and it is directly sellable.
- **[Opportunity] O3 — Self-describing certificates.** Ship a machine-readable **rigor profile** with every cert: claim count, coverage %, assessed difficulty, hard-mode flag, execution-verified fraction, pipeline/model version, independence tier, "verified-as-of" date. Radical transparency as a moat — an ATS can rank candidates on it, and it makes trivial-topic gaming (Finding 9) pointless because the triviality is printed on the artifact.
- **[Opportunity] O4 — Provenance markers carried end-to-end.** A "self-adjudicated / self-sourced" flag on claims flows through to test eligibility, the honest-signal aggregates, and the cert. Honesty about *who vouched for what* becomes visible rather than hidden — a natural extension of the five-state ledger to the *verifier's* identity, not just the source's.
- **[Opportunity] O5 — Proof-of-personhood as reputation foundation.** Make identity scarce and the whole community/promotion/vote-ring stack (COMM-12, TRUST-21) becomes defensible by design instead of by heuristic — and the "Verified Learner" badge finally means something.
- **[Opportunity] O6 — Live trust freshness.** Continuous re-verification + retraction/link-rot monitoring, surfaced as a *live* "trust freshness" signal on topics and certs. No credential issuer on earth re-checks the evidence under its credentials; a product literally named for verification should, and can market it.

**Bottom line:** the spec has hardened the content and the clock against a hostile *system*, but has left the *learner* free to author, verify, adjudicate, source, and name their own credential, take the exam open-book with the answer key on the results screen, and share a juke-able calibration number to an employer — while the public verify page conceals all of it behind "verified-only, ≥75%." The fixes are not exotic: **disclose independence and assurance, secure the items, QA the self-adjudications, match learner-attached sources, and make identity scarce.** Until then, "verified" survives for the content and dies at the credential.

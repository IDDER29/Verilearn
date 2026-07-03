## Personas — Specialized & System Actors

This cluster holds the actors that are not the ordinary human learner working the loop, yet without which the verification-first promise is neither produced nor consumed. It splits cleanly into two sub-groups. **System actors** live *inside* the verification spine — they are the non-human agents that manufacture the trust ledger, and they are treated as first-class personas because each has goals, an authority boundary, and failure modes exactly like a human reviewer, and because the product's entire credibility is a direct function of how well they play their roles. **External / special actors** sit *around* the spine — they consume its highest-stakes output (a certificate), oversee a learner who can't self-serve, integrate the trust data into another system, or run the whole loop through an assistive technology that the ledger's visual encoding tends to break.

A deliberate rule threads through the system actors, echoing the educators cluster's separation of authority: **no machine is the final word.** Each system actor *proposes*; the human SME (see the Educators cluster) *disposes*. The Pipeline drafts, the Sandbox proves, the Skeptic attacks — but certification, resolution, and promotion are human-confirmed. That is the entire reason a verification-first product can be trusted.

| Actor | Sub-group | Produces / consumes | Cannot do |
| --- | --- | --- | --- |
| The Skeptic (`SKEPTIC-AI`) | System | Raises Disputed / Interpretive; hard mode | Cannot certify Verified; cannot resolve its own Conflicts |
| Execution Sandbox (`EXEC-SANDBOX`) | System | Produces Verified·execution; computational Disputes | Cannot verify non-computational claims; cannot fake a pass |
| Verification Pipeline (`VERIFY-PIPELINE`) | System | Retrieves sources, decomposes claims, drafts Verified·source / Sourced / Unsupported | Cannot assign Verified·execution or finalize a Dispute |
| Employer / Recruiter (`EMPLOYER-VERIFIER`) | External | Consumes certificates | Cannot see private progress without consent |
| Parent / Guardian (`GUARDIAN`) | External | Oversees a dependent learner; owns billing | Cannot certify; no first-class guardian role today |
| Developer / API consumer (`DEVELOPER-API`) | External | Integrates verification, seats, trust data | Cannot mutate the ledger externally |
| Accessibility-reliant learner (`A11Y-LEARNER`) | Special | Runs the full loop via assistive tech | Cannot bypass hard gates / timers |

---

### The Skeptic (SKEPTIC-AI)

**Purpose.** The adversarial red-teamer at the heart of the verification spine — the non-human actor the product is named after. Its job is to attack every decomposed claim, hunt for overreach, and surface disputes so that trust is *earned* rather than asserted (the canonical catch: "Dijkstra works on any weighted graph" fails on negative weights → flagged). It is a first-class persona because the whole differentiator is only as good as this agent's judgment, and because — like a human reviewer — it has a scope of authority it must not exceed.

**Goals.**
- Catch every claim that over-reaches its evidence and flag it Disputed → Conflict, before a learner absorbs it as fact.
- Correctly separate a genuinely **Interpretive** claim (map the positions) from a resolvable **Disputed** one (adjudicate to an answer).
- On **hard mode** (Pro/Teams), apply maximum scrutiny *without* burying the learner in pedantic noise.
- Be right often enough that a Skeptic "verified answer" in Community actually carries weight.
- Make disagreement visible — never let a contested claim ship silently as settled.

**Responsibilities.**
- Run as **stage 6** of the pipeline on every topic, and re-run at higher intensity when hard mode is enabled.
- For each claim, emit a challenge, a rationale, a confidence, and a *proposed* trust-state change with evidence pointers into the ledger entry.
- **Raise** Conflicts — never resolve them; adjudication is handed to the learner or SME.
- Power the Skeptic discussion thread on any claim and the "verified answer" source-check in Community.
- Feed the Gap Map with lecture-origin misconceptions it catches, and generate plausible-but-wrong variants for the review "spot the error" drills.

**Permissions (can / can't).**
- **Can:** read every decomposed claim, retrieved source, and sandbox result; flag any claim **Disputed** or **Interpretive**; open Conflicts and discussion threads; run at two intensities (normal / hard mode, the latter gated to Pro/Teams); annotate ledger entries with its objection and confidence.
- **Can't:** unilaterally set a claim to **Verified** — it can attack and downgrade-flag, but certification to Verified·source/execution flows through source-matching and the sandbox, confirmed by an SME; resolve the Conflicts it raises; promote a community reply into a source; overturn a human SME's adjudication; run hard mode on Free. **Its output is a proposal the SME can override** — the deliberate human-in-the-loop.

**Pain points (failure modes).**
- **False positives / overreach flagging:** too many pedantic Disputes erode trust and bury the real catches — the low-precision hard-mode problem the SME then has to clean up.
- **False negatives:** missing a genuinely wrong claim that ships as Verified·source is the single highest-cost failure — a learner absorbs an *endorsed* error.
- Miscategorizing Interpretive as Disputed (forcing a false resolution) or Disputed as Interpretive (ducking a real answer).
- Being gamed by confident phrasing or a plausible fabricated citation it can't distinguish from a real one — its precision is hostage to the Pipeline's retrieval honesty.
- **Latency:** thorough red-teaming is what learners actually wait on in the pipeline.

**Success criteria.** High precision *and* recall against held-out seeded errors (it powers the "spot the error" drills, so it must itself be calibrated); a low rate of Verified claims later overturned in a Conflict (missed catches); a low rate of its Disputes dismissed by an SME as noise (false positives); its Community "verified answers" survive source-check; on hard mode the ledger is dense with real catches, not pedantry. Its true report card is **how often the human SME agrees with it.**

**Typical workflows.**
1. *Per-topic pass:* receive decomposed claims from the Pipeline → for each, weigh retrieved sources and any sandbox result → classify (leave Sourced/Verified·source as drafted, or raise Disputed/Interpretive with rationale) → write ledger annotations → surface Conflicts for adjudication.
2. *Hard-mode escalation:* a Pro/Teams learner enables hard mode → re-run with tighter thresholds → produce harsher flags → SME reviews the extra catches.
3. *Community check:* a reply claims to settle a disputed claim → Skeptic checks it against sources → marks "verified answer" or withholds.
4. *Drill seeding:* generate plausible-but-wrong variants of verified claims for review error-drills.

**Relationships.**
- **Hands Conflicts to** SME-REVIEWER (authoritative adjudication) and to the learner (in-workspace adjudication).
- **Depends on** VERIFY-PIPELINE (claims + sources) and EXEC-SANDBOX (hard computational disproofs) as its inputs — it is stage 6 consuming stages 1–5.
- **Is overridable by** SME-REVIEWER by design — it proposes, the SME disposes.
- **Adversarial partner to** LEARNER-SKEPTIC, who attacks the same ledger from the human side: agreement means the ledger is strong; a human catch the Skeptic missed is a recall failure the loop must fix.
- **Gated by plan:** hard mode withheld from Free — a monetization boundary the GUARDIAN (payer) and ORG-ADMIN feel.

---

### Execution Sandbox (EXEC-SANDBOX)

**Purpose.** The second, non-obvious verifier in the spine — the actor that proves computational claims *empirically* by running code and checking assertions, producing the only trust state grounded in execution rather than citation: **Verified·execution**. It is distinct from the Skeptic because the Sandbox does not argue, it *demonstrates*: it doesn't debate whether Dijkstra fails on negative weights, it runs the graph and shows the wrong shortest path. Naming it as its own persona matters because it owns the strongest trust state and a completely different failure surface.

**Goals.**
- Convert every computationally-checkable claim into a pass/fail with a reproducible run.
- Emit **Verified·execution** for claims whose assertions pass, and raise a Conflict (with the failing trace) for those that don't.
- Give the Skeptic hard evidence — a counterexample that actually ran — rather than a mere argument.
- Stay safe, deterministic, and reproducible: sandboxed, resource-bounded, network-isolated.

**Responsibilities.**
- During the Pipeline's **Verify** stage, execute the code/assertions attached to decomposed claims.
- Write a verdict, captured output/trace, and an environment fingerprint into the ledger entry.
- Raise Conflicts on failed assertions (a computational Dispute) with a runnable reproducer.
- **Refuse** rather than fake: return "out of scope" for claims that aren't computationally checkable, instead of a false green.

**Permissions (can / can't).**
- **Can:** execute derived/submitted code in an isolated, resource-limited environment; set a claim to **Verified·execution** on a passing run; raise a **Disputed** claim + Conflict on a failing one, attaching the trace and failing input; attach reproducible artifacts to the ledger.
- **Can't:** verify non-computational claims (history, definitions, interpretation — those route to source-match and the Skeptic); certify **Verified·source** (that's citation-matching, not execution); resolve the Conflicts it raises; reach the network or persist state beyond its sandbox (a hard safety boundary); be pressured into a false green — an SME may dispute a run but cannot fabricate a pass.

**Pain points (failure modes).**
- **Flaky / non-deterministic tests** → an unstable Verified·execution that flips between runs, poisoning the strongest trust state.
- **Environment drift:** a claim verified under one runtime that is silently wrong under another.
- **False green:** an assertion too weak to actually test the claim passes and over-certifies.
- **Scope creep:** pressure to "verify" claims that aren't executable — risking either false greens or a coverage hole the matrix should show honestly.
- Resource/time limits truncating a legitimately long-running proof.

**Success criteria.** Reproducibility (the same claim re-runs to the same verdict); Verified·execution claims essentially never overturned later (it owns the strongest state, so it must be the most reliable); failing runs ship with a reproducer a human can re-run and believe; honest scope (it declines cleanly rather than faking, so the coverage matrix reflects reality).

**Typical workflows.**
1. *Verify stage:* receive a computational claim + assertions → spin an isolated env → run → capture the result → pass ⇒ Verified·execution; fail ⇒ Disputed + Conflict with trace and failing input.
2. *Counterexample for the Skeptic:* the Skeptic suspects overreach on a computational claim → requests a run → the Sandbox produces the failing case (a negative-weight graph) → the Conflict is now evidence-backed, not rhetorical.
3. *Drill seeding:* produce executable "spot the error" cases where the bug is demonstrable, not merely asserted.

**Relationships.**
- **Feeds** SKEPTIC-AI (hard counterexamples) and raises Conflicts to SME-REVIEWER / the learner.
- **Is invoked by** VERIFY-PIPELINE at the Verify stage.
- **Produces the trust state** (Verified·execution) that LEARNER-SKEPTIC trusts most and probes hardest — a broken sandbox is exactly what an expert learner will expose in public.
- **Bounds** DEVELOPER-API: any "run my own assertions" endpoint would inherit this actor's isolation envelope.

---

### Verification Pipeline (VERIFY-PIPELINE)

**Purpose.** The orchestrator system actor — the six visible stages (**Triage → Retrieve sources → Teach → Decompose claims → Verify claims → Skeptic**) that turn a learner's topic spec into a drafted trust ledger. It is the actor the learner literally *watches* run (transparency, not a spinner), and the one that produces most of the ledger's raw material: retrieved sources, atomic decomposed claims, source-matched **Verified·source / Sourced** tags, and the **Unsupported** rows the coverage matrix later exposes. Non-obvious as a "persona," but it has a clean spec-in / ledger-out contract, real authority limits, and failure modes worth naming separately from the two verifiers it invokes.

**Goals.**
- Turn (subject + level + goal) into a well-scoped, correctly-pitched lecture and a complete set of atomic, individually-checkable claims.
- Retrieve real, citable sources and match claims to them (→ Verified·source / Sourced), leaving **honest Unsupported rows** where no source exists rather than papering over them.
- Hand clean, well-decomposed claims to the Skeptic and Sandbox so they can do their jobs.
- Be transparent and non-blocking: show which stage is executing, run in the background, stay closable.

**Responsibilities.**
- Triage the topic spec (scope, level, feasibility) downstream of the creation validation gate.
- Retrieve sources; teach honest prose that flags its own confidence; **decompose** claims into atomic, verifiable units; run the **Verify** stage (source-match + invoke the Sandbox); then invoke the Skeptic.
- Populate the **coverage matrix** (claims × sources) and the colored **trust bar** the topic lands with in the Library.
- Keep every claim traceable to a specific source or explicitly marked Unsupported.

**Permissions (can / can't).**
- **Can:** generate lecture prose and claims; retrieve and attach sources; assign *draft* trust states from source-matching (**Verified·source, Sourced, Unsupported**); build the coverage matrix; invoke the Sandbox and Skeptic; run in the background.
- **Can't:** assign **Verified·execution** (Sandbox only) or finalize **Disputed / Interpretive** (Skeptic proposes, SME disposes); certify anything a source doesn't actually support — its Unsupported rows must stay honest; override an SME's later re-tag; bypass the topic-creation validation gate.

**Pain points (failure modes).**
- **Retrieval failure / source hallucination** — the worst case: a fabricated citation that makes an Unsupported claim look Verified·source and fools the Skeptic downstream.
- **Bad decomposition** — claims too coarse to verify or too fine to matter, poisoning every downstream stage.
- **Mis-triage** — wrong level/scope produces a lecture pitched over or under the learner.
- **Latency vs. thoroughness** — learners feel the wait; the honest stage display mitigates but doesn't remove it.
- Silent coverage gaps if the matrix under-counts the claims actually made.

**Success criteria.** High proportion of claims matched to *real* sources with few Unsupported rows, none of them hidden; a clean hand-off where the Skeptic/SME rarely have to re-decompose or discover a hallucinated source; strong level-fit (learners rarely re-spec because the pitch was wrong); trust-bar drafts that survive the Skeptic and SME with minimal downgrade.

**Typical workflows.**
1. *Topic creation:* learner submits a spec (validation gate passes) → Triage → Retrieve → Teach → Decompose → Verify (source-match + Sandbox) → Skeptic → the topic lands in the Library with a colored trust bar and a populated coverage matrix.
2. *Re-run:* an SME shores up an Unsupported row, or a community reply is promoted into sources → affected claims are re-matched → the trust bar updates.

**Relationships.**
- **Upstream of** SKEPTIC-AI and EXEC-SANDBOX (it feeds them claims and sources); **downstream of** the learner's topic spec.
- **Hands the finished-but-draft ledger to** SME-REVIEWER (who closes Unsupported rows and adjudicates) and to INSTRUCTOR (who vets the trust bar before assigning to a cohort).
- Its **Unsupported rows** are the coverage matrix that LEARNER-SKEPTIC hunts and the SME closes.
- Its "thorough verification on everything" depth is a Pro/Teams entitlement — a monetization boundary shared with ORG-ADMIN / billing.

---

### Employer / Recruiter (EMPLOYER-VERIFIER)

**Purpose.** An external actor who never learns on VeriLearn but consumes its highest-stakes output — the **certificate** — to make a hiring or advancement decision. In a verification-first product the certificate is differentiated precisely because it can *show its work*: not "completed a course" but "passed a timed test whose every question was drawn **only from verified/sourced claims**, at a ≥75% bar, with calibration and transfer signals behind it." The employer's whole job is to trust that credential enough to act on it — and to tell it apart from a hollow completion badge.

**Goals.**
- Confirm a candidate's certificate is genuine, current, and not revoked — in seconds, ideally without an account.
- Understand what the cert actually attests: scope, the ≥75% pass bar, the verified/sourced-only question guarantee, and (with consent) the honest signals behind it.
- Distinguish a VeriLearn credential from a vanity badge — the anti-vanity ethos *is* the pitch to them.

**Responsibilities.**
- Verify authenticity through whatever channel VeriLearn exposes (a public verify-URL / QR on the cert, or a programmatic call via DEVELOPER-API).
- Interpret the cert honestly — read scope and signals rather than treating every cert as equivalent.
- Not over-read it: a topic cert attests learning of a sourced body of claims, not general job competence.

**Permissions (can / can't).**
- **Can:** open a certificate's public verification page (issued-to, topic scope, date, pass bar, the verified/sourced-only attestation, revocation status); confirm validity; if integrated, pull verification programmatically.
- **Can't:** see the learner's private Progress, Gap Map, review history, or full Reports without the learner's explicit share/consent (Privacy-governed); alter, issue, or revoke certs; reach the learner's other topics; obtain PII beyond what the learner chose to expose on the cert.

**Pain points.**
- **Forgery / stale link** — needs a tamper-evident, revocable verification, not a screenshot.
- **Opacity:** a bare badge doesn't convey the differentiator; if the verify page doesn't surface "questions drawn only from verified claims + calibration," the cert reads like every other course badge.
- **Friction:** an employer won't create an account to verify a single credential.
- **Over-trust risk:** reading a narrow topic cert as a general competence guarantee.
- **Privacy wall** (correctly) blocks the deeper honest signals they'd most like to see — a real tension between employer appetite and learner privacy.

**Success criteria.** A fast, trustworthy yes/no on authenticity and revocation; confidence that the cert means more than completion — that it is backed by a sourced, Skeptic-survived claim set; a low dispute/fraud rate on the certs they accepted. Value = "I could verify in seconds that this credential is real *and* that it attests trustworthy learning."

**Typical workflows.**
1. Scan the verify-URL / QR on a candidate's cert → the public page shows issued-to, scope, date, pass ≥75%, "questions drawn only from verified/sourced claims," and revocation status → accept.
2. *Bulk / integrated:* the HR/ATS system calls the verification endpoint (via DEVELOPER-API) → boolean + scope metadata → the application is auto-annotated.
3. *Deeper look:* request the honest signals → the candidate opts to share a Reports view (calibration/transfer) → the employer reads them directly.

**Relationships.**
- **Depends on** the learner (LEARNER-SELF / EXAM / TEAM) to present a cert and optionally consent to share signals; on DEVELOPER-API for programmatic verification; on the Privacy settings that gate everything beyond the public cert.
- **Trusts, transitively,** SME-REVIEWER, SKEPTIC-AI, and VERIFY-PIPELINE — the cert is only as good as the ledger behind it.
- For a LEARNER-TEAM, may be the *same* org whose ORG-ADMIN provisioned the seat — internal advancement rather than external hiring.
- **Conflicts with** learner Privacy: wants more signal than the learner may want to expose.

---

### Parent / Guardian (GUARDIAN)

**Purpose.** A non-learning overseer responsible for a dependent learner — typically a teen studying for school or an exam — drawn to VeriLearn because its value prop answers a parent's exact fear about AI tutors: that a fluent bot will confidently teach their kid something false. The Guardian cares about **honesty and safety**, not the subject. *Stated honestly:* VeriLearn today has no minor-account, age-gating, or parental-control infrastructure in the documented product. This persona is included because the value prop genuinely attracts guardians *and* because their needs surface real gaps a verification-first product aimed at younger learners would have to close — which is exactly what persona discovery is for.

**Goals.**
- Ensure the dependent learns from material that won't hallucinate — trust the ledger on the kid's behalf.
- See *real* progress (did they actually learn and retain?) through the honest signals, not a gameable completion bar or vanity streak.
- Keep the experience age-appropriate and private; own the plan and billing.
- Optionally set guardrails — which topics, how much time, what data is collected.

**Responsibilities.**
- Own **Plan & billing** (the Guardian is typically the payer — Free/Pro or a family arrangement).
- Vet the suitability of topics and oversee what the dependent is exposed to.
- Coach follow-through on spaced review — FSRS assumes a self-motivated adult; a teen needs the nudge.
- Manage consent and privacy on behalf of a minor.

**Permissions (can / can't).**
- **Can (today, via a shared/owned account):** manage Plan & billing; see whatever the account exposes (Reports, Gap Map, topics) since it is their account; tune Active Listening / FSRS settings; use the Danger zone (reset history, delete account).
- **Can't (the gap):** there is no distinct guardian↔minor account link, **no parental dashboard** separate from the learner's own view, no per-topic content gating, and no COPPA-style consent flow. A Guardian can only oversee by co-owning or sharing the learner's login — a blunt instrument that breaks the teen's privacy expectations. And, like everyone, cannot self-certify claims (the trust-spine rule holds even for the payer).

**Pain points.**
- **No first-class guardian role:** overseeing means sharing one login — a privacy problem for the teen and a safeguarding gap for the parent.
- Signals are built for the self-directed adult; a parent wants an "is my kid on track *and* is this safe?" summary that the honest-signals Reports only approximate.
- The 3-topic Free cap and the Pro upsell land on the *payer*, not the learner.
- **No content-appropriateness controls** — an open topic-creation box has no age filter.
- Consent/PII handling for a minor is simply not a described flow.

**Success criteria.** The dependent demonstrably learns and retains (rising Retention/Transfer, tightening Calibration) on verifiable material; the Guardian trusts the content enough to be hands-off about accuracy; billing and privacy are under their control. Value = "my kid is learning from something that tells them how much to trust it — and I can see they're actually progressing, safely."

**Typical workflows.**
1. *Set up:* create and pay for the account → (today) hand it to the teen or co-own it → periodically open **Reports** to check the honest signals → nudge review when cards pile up.
2. *Vet a topic:* skim the trust bar and coverage matrix of what the kid created to sanity-check the subject.
3. *Manage plan:* hit the 3-topic cap → Upgrade → Checkout → Success; manage Privacy and the Danger zone.

**Relationships.**
- **Oversees** a dependent LEARNER-SELF / LEARNER-EXAM (a minor) — the core dependency; the hand-off boundary is billing + oversight vs. the kid doing the actual loop.
- **Overlaps with** ORG-ADMIN (a payer/overseer of others) and, in a school context, defers to an INSTRUCTOR who assigns the cohort.
- **Depends transitively on** the whole verification spine (SKEPTIC-AI / EXEC-SANDBOX / VERIFY-PIPELINE / SME-REVIEWER) to make the honesty promise real — that promise is their entire reason for choosing VeriLearn.
- **Conflicts with** the dependent's privacy under the current single-account reality, surfacing a product gap the Teams/Org model only partly covers.

---

### Developer / API & Integration Consumer (DEVELOPER-API)

**Purpose.** A technical actor who integrates VeriLearn into *another* system rather than learning on it — an LMS/HRIS engineer wiring certificate verification, an org IT admin setting up SSO and seat provisioning for Teams, or a partner pulling structured trust data into an internal dashboard. The verification-first angle is exactly what makes an API valuable: the differentiated payload is not lesson content, it's the **five trust states, the coverage matrix, the honest signals, and verifiable certs**. *Stated honestly:* a public API is *implied* by the Teams/cert/LMS needs but is not documented in the current product, so this persona is largely forward-looking and many of its pains are "what's missing."

**Goals.**
- Verify certificates programmatically (authenticity + scope + revocation) for an HR/ATS pipeline.
- Provision and deprovision Teams seats and wire SSO so an org admin isn't clicking invites by hand.
- Optionally pull structured trust data — a topic's ledger, coverage matrix, or a learner's honest signals (with consent) — into an LMS or internal dashboard.
- Integrate without scraping: stable endpoints, webhooks (topic verified, test passed, cert issued/revoked), sane auth and scopes.

**Responsibilities.**
- Handle API credentials and scopes securely; respect the consent + Privacy boundaries that gate learner data.
- Build to the trust vocabulary *correctly* — represent the five trust states faithfully rather than flattening them to a binary pass/fail.
- Keep integrations current across API changes; handle revocation and webhook events.

**Permissions (can / can't).**
- **Can (prospective):** call a public certificate-verification endpoint; with org auth, manage seats + SSO for Teams; with explicit learner/org consent and scopes, read trust ledgers, coverage matrices, and honest signals; subscribe to webhooks.
- **Can't:** write to the ledger or change any trust state — **the spine is not externally mutable; no API certifies a claim** (a boundary shared with the SME's exclusive certification authority); read a learner's private progress without consent/scope; run arbitrary code in the Execution Sandbox beyond any sanctioned, bounded interface; bypass plan entitlements (hard mode, seat counts) via the API.

**Pain points (mostly gaps today).**
- **No documented public API** — verification/provisioning may exist only as UI, forcing screen-scraping or manual work.
- Faithfully modeling five trust states + Conflicts + coverage in an external schema is non-trivial; a naive integration flattens them and loses the entire point.
- The consent/scope model for learner data must be airtight, or an integration becomes a privacy incident.
- **Webhook / revocation semantics:** an already-issued cert getting revoked (after an SME unwinds a promotion) must propagate cleanly to downstream systems.
- **Sandbox safety:** any "verify my own code" endpoint inherits EXEC-SANDBOX's isolation constraints.

**Success criteria.** A reliable, low-maintenance integration (certs verify, seats provision, webhooks fire); trust data that crosses the boundary without losing fidelity (five states preserved, not collapsed); zero consent/privacy violations and clean revocation propagation. Value = "I can wire VeriLearn's verification into our stack and the trust signal survives the trip."

**Typical workflows.**
1. *Cert verification integration:* register the app → call the verify endpoint with a cert id → receive validity + scope + revocation → surface it in the ATS (this is what serves EMPLOYER-VERIFIER at scale).
2. *Teams provisioning:* wire SSO + directory-based seat sync for ORG-ADMIN → seats auto-provision and deprovision with the org directory.
3. *Data pull:* with consent scopes, fetch a topic's coverage matrix or a learner's honest signals → render in an internal dashboard; subscribe to a "cert revoked" webhook.

**Relationships.**
- **Serves** EMPLOYER-VERIFIER (the verification endpoint) and ORG-ADMIN (provisioning + SSO); **depends on** the Privacy/consent model that governs learner data.
- **Bounded by** EXEC-SANDBOX's safety envelope and by the trust-spine rule that nothing external mutates the ledger.
- Its **faithful five-state representation** is what lets EMPLOYER-VERIFIER and downstream systems inherit VeriLearn's honesty rather than flatten it into a pass/fail.

---

### Accessibility-Reliant Learner (A11Y-LEARNER)

**Purpose.** A learner who runs the *full* VeriLearn loop through an assistive technology — screen reader, keyboard-only/switch access, magnification, reduced-motion — or with color-vision, low-vision, or cognitive differences. This is not a niche add-on but a **stress test of the product's core**, because VeriLearn encodes its central value — *trust* — in exactly the modalities accessibility most often breaks: color-coded claim underlines, a colored trust bar, a visual ledger side-rail, a spatial claims×sources grid, timed tests, motion-heavy pipeline animation, and hard gates that trap keyboard focus. **If trust isn't perceivable without sight or a mouse, the differentiator simply doesn't reach them.**

**Goals.**
- Perceive every trust state **without relying on color** — know a claim is Disputed vs. Verified·source by text/ARIA, not hue alone.
- Operate the entire loop by keyboard / screen reader: open a ledger entry, clear each active-listening gate, commit a confidence gate, rate FSRS, adjudicate a Conflict, read the coverage matrix, sit a timed test.
- Get the honest signals and Gap Map in an accessible, non-purely-spatial form.
- Not be timed out or made motion-sick by mechanics built for a sighted mouse user.

**Responsibilities.** The same as any learner — an honest topic spec, truthful confidence commits, showing up for review — *plus* configuring their AT and the product's accessibility-relevant settings (reduced motion, gate toggles) where the product allows.

**Permissions (can / can't).**
- **Can:** everything their plan grants (the full loop, per Free/Pro/Teams) — **accessibility is a delivery requirement, not a permission tier**; toggle Active Listening prompt types (a genuine accessibility lever — e.g., disabling a gate that traps focus) and Review/FSRS settings.
- **Can't:** escape the hard gates by design (the close-gate locks "Next"; test timers run) — which is exactly where accessibility and the product's insistence on active engagement collide; self-certify claims (the same trust-spine rule as every learner).

**Pain points (product-specific — the heart of this persona).**
- **Color-only trust encoding:** if Disputed vs. Verified is conveyed by underline color alone, a color-blind or screen-reader user cannot read the ledger — a direct WCAG 1.4.1 failure on the product's *most important* information.
- **The ledger side-rail:** activating an underlined claim must move screen-reader focus into the rail and back — a broken focus path makes the evidence unreachable.
- **Hard gates + focus traps:** the close-gate that locks "Next," and modal confidence gates, must trap and release focus correctly or a keyboard user is simply stuck.
- **Timed tests:** fixed timers can be inaccessible (need an extended-time accommodation) — and they're high-stakes, gating certificates.
- **Coverage matrix:** a claims×sources grid is spatial; without proper table semantics and headers it's noise to a screen reader, and "empty rows = Unsupported" (meaning conveyed by *emptiness*) is invisible.
- **Motion:** pipeline animation and progress rings need a reduced-motion path and text alternatives ("Stage 5 of 6: Verify"); FSRS and confidence-gate controls must be reachable and labeled, not hover-only.

**Success criteria.** Every trust state is announced/labeled non-visually; the ledger, matrix, gates, review, and tests are fully keyboard + screen-reader operable; timers accommodate; motion is optional. They complete the *same* loop — verified topics, passed tasks, closed gaps, earned certs — with **equivalent, not degraded**, access to the trust information. Value = "I can tell exactly how much to trust what I'm learning — by ear or by keyboard, not just by eye."

**Typical workflows.**
1. *Lecture via screen reader:* navigate claims as annotated inline elements → each announces its trust state as text ("Disputed: contested claim") → activate to move focus into the ledger rail → read evidence/source → return focus to position → clear each active-listening gate by keyboard → submit the close to unlock Next.
2. *Accessible review:* reach the confidence gate → commit Sure/Unsure/Guessing by key → reveal announces the source → rate FSRS by key.
3. *Reading the matrix:* navigate the coverage grid as a proper data table with row/column headers → empty (Unsupported) cells announced explicitly, not by silence.
4. *Timed test with accommodation:* request extended time → complete via keyboard → results and sourced answers read aloud.

**Relationships.**
- **Is** any learner (SELF / EXAM / POWER / SKEPTIC / TEAM) *plus* an AT — it cuts across the whole learner cluster rather than replacing a single archetype.
- **Depends hardest on** how the very objects SME-REVIEWER, SKEPTIC-AI, and VERIFY-PIPELINE produce get *rendered* — the trust states are correct but must also be *perceivable*; a design/engineering responsibility more than a permissions one.
- **Overlaps with** GUARDIAN when the dependent has access needs, and with ORG-ADMIN / INSTRUCTOR, who are often procurement- or education-law-obligated to ensure the cohort tool is accessible.
- **Conflicts with** the product's hard gates and timed mechanics wherever "active engagement" is implemented in ways that assume sight, a mouse, or steady timing — the tension this persona exists to resolve.

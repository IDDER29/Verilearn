## Executive Summary

VeriLearn is a learning platform where you can trust what you read because every claim is red-teamed, sourced, and tagged before it reaches you: an adversarial **Skeptic AI** attacks each claim, an **execution sandbox** proves computational claims by running code, and a **Trust ledger** assigns every claim one of five traceable states (Verified·execution, Verified·source, Sourced, Disputed, Unsupported, Interpretive). The result is a full verification-first learning loop — background pipeline → gated lecture → rubric tasks → conflict adjudication → calibrated FSRS review → auto-reopening gap map → verified-only tests and certificates — reporting only four honest signals (Retention, Transfer, Calibration, Blind-spot detection) with no vanity metrics.

### Target users and core need

The primary user is the **self-directed adult learner** — a professional reskilling, a student, an exam candidate — who needs to learn something reliably and cannot tell, from a chatbot or a content mill, which sentences are actually true. Secondary users are **Teams and instructors** who must assign trustworthy material and prove competence, and the **SME reviewer** who adjudicates truth. The unmet need is *epistemic*: existing tools optimize for fluent output, not for whether the underlying claims survive scrutiny. VeriLearn's wedge is that it ships the scrutiny itself.

### The differentiated thesis

Verification is the product, not a feature. Where competitors are content-first, VeriLearn is trust-first: the Skeptic red-teams before you read, the ledger makes every claim's status and provenance clickable, disputes become **Conflicts** the learner adjudicates, and tests and certificates draw only from verified or sourced claims. Nothing that cannot be defended reaches the learner unlabeled. Rivals can add content faster than we can, but "show your work" honesty is a product architecture, not a feature they can cheaply copy.

### Scope of this document

This PRD specifies the complete product: **24 personas**, **20 domains** (AUTH, HOME, VERIFY, LEARN, TASK, TRUST, REVIEW, GAP, TEST, COMM, EVENT, ANALYTICS, SETTINGS, NOTIF, BILL, ORG, ADMIN, API, SEC, A11Y), and **462 user stories** (203 MVP / 222 Should / 27 Nice / 10 Future), each with acceptance criteria and a failure/edge block, across ~50 surfaces built as a Next.js app. It is stress-tested by **seven critique lenses** (learning science, engagement, integrity, AI safety, and three more; docs 50–56) and closed with a **prioritization roadmap** (40), a **persona→goal→story→surface→requirement traceability matrix** (45), and a **completeness self-review** (90).

### MVP definition

R1 ships the entire **single-learner verification spine** end to end: create-topic validation gate → six-stage pipeline (Triage→Retrieve→Teach→Decompose→Verify→Skeptic) → active-listening lecture gates → rubric tasks (≥75% to pass) → Conflicts and Sources → FSRS review with the confidence gate and seeded error-drills → gap map → verified-only timed tests with certificates → the four honest signals. If a learner finishes a topic and can point to *why* they trust each thing they learned, the thesis is proven. Crucially, the legal and security floor is **MVP, not deferred**: COPPA/FERPA age-gating and guardian consent, sub-processor zero-retention DPAs, an encryption-at-rest baseline, tenant isolation, and the breach workflow are launch blockers pulled into R1 via real SEC-* stories — an honesty-branded product cannot ship unlawful collection or an undisclosed data path. R2 deepens B2C retention and conversion (Skeptic hard mode, community, mobile/offline, DSAR rights); R3 unlocks the mutually-dependent Teams/B2B stack (seats, publish/assign gate, SME workflow, SSO/LTI, enterprise compliance).

### Top strategic risks and decisions

1. **SME human-review throughput.** Verification integrity rests on an expert backstop that is uncapacity-planned and absent for self-directed content. Decision: structurally defer to the B2B tier that exposes it, with a modeled supply/queue SLO before that spend.
2. **Per-topic AI unit economics.** Pro-unlimited × hard mode × unbounded revise loops does not close on $12/mo; power users are structurally loss-making. Decision: a per-account cost governor plus an amortized verified-topic cache, as a P0 pre-build workstream.
3. **The self-signed certificate.** For Free/Pro the learner authors the topic, adjudicates their own conflicts, and takes an unproctored open-book test — undermining the credential. Fix: disclosed assurance tiers, a held-out item bank, and independent examination for high-stakes certs.
4. **Measurement validity.** "Transfer" and "Calibration" as specified are psychometrically indefensible; an honesty brand must not ship signals it would red-team. Gate on a real far-transfer bank, objective calibration, and grader/item reliability.
5. **Verifier recall is invisible.** The Skeptic is checked only on flagged items, so confidently-wrong false negatives ship as "Verified." Requires a gold-set eval harness with published precision/recall and an abstention ("needs human review") state.

### Readiness verdict

**Build-ready to found MVP core-loop engineering with eyes open.** The loop, the R1 legal/security floor, traceability, and prioritization are strong and internally consistent. It is **not yet sign-off "complete"**: the five risks above (SME capacity, unit economics, credential independence, measurement validity, verifier eval harness) are a required P0 pre-build workstream before committing spend beyond the core loop, and a consolidated assumptions register remains the one outstanding hygiene gap.

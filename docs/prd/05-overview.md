## 1. Product Overview & Vision

**VeriLearn is a verification-first learning platform: it teaches you things you can actually trust, because every claim it puts in front of you has been red-teamed, sourced, and tagged before you read it.**

### The problem

AI tutors and generated courseware are fluent but not honest. They state everything with equal confidence, hallucinate freely, and give the learner no way to tell a proven fact from a plausible-sounding guess. The learner is left doing the epistemic work — "is this actually true?" — with no tools, or not doing it at all and absorbing errors. VeriLearn's premise is that trust should be a first-class, visible property of learning content, not an afterthought. The product's job is not just to explain a topic but to *show its work*: what is established, what is merely sourced, what is disputed, and what has no backing at all.

### The verification spine

Everything in VeriLearn hangs off one backbone. A **Skeptic AI** red-teams the material — it stress-tests each claim, hunts for overreach, and flags disputes (for example, "Dijkstra works on any weighted graph" gets flagged because it fails with negative weights). Alongside it, an **execution sandbox** proves computational claims by actually running code and checking assertions. The output is a **trust ledger**: every claim in a lecture carries one of five trust states, and each is traceable back to a specific source.

- **Verified · execution** — proven by running code; assertions passed in the sandbox.
- **Verified · source** — matched against a documented, cited reference.
- **Sourced** — backed by a citation but not independently proven.
- **Disputed** — the Skeptic or sandbox contests it; it becomes a **Conflict** the learner must adjudicate.
- **Unsupported** — no source found; surfaced as something to shore up or drop.
- **Interpretive** — genuinely contested; positions are mapped, not certified.

Claims are underlined in the lecture by trust level; clicking one opens its ledger entry (evidence, source, confidence) in a side rail. Disagreement is never hidden — it is a first-class object the learner resolves.

### The core learning loop

1. **Create a topic** — free-text subject, a description of the learner's level, and a goal. A validation gate holds until all three are supplied.
2. **Verification pipeline** — six visible stages run (**Triage → Retrieve sources → Teach → Decompose claims → Verify claims → Skeptic**), closable and running in the background. The learner sees exactly which stage is executing — transparency, not a spinner. The topic lands in the library as a verified lecture with a colored trust bar.
3. **Lecture with active-listening gates** — prose that is honest about its own confidence, punctuated by prompts: **predict → pause-point → cloze (fill-the-blank) → connection → close**. The close is a hard gate — "Next section" stays locked until it's submitted.
4. **Tasks graded on rubrics** — the learner produces the idea in their own words; answers are scored against a **source-derived rubric**, each criterion marked hit or missing, **≥75% to pass**. Graded against evidence, not keywords.
5. **Conflicts & Sources** — the learner adjudicates disputes the Skeptic/sandbox raised, and audits a **claims × sources coverage matrix**; empty rows are the unsupported claims worth worrying about.
6. **Spaced review (FSRS)** with a **confidence gate + calibration** — before each card is revealed, the learner commits to **Sure / Unsure / Guessing**; reveal is locked until they do. The answer shows its verified source, then an **FSRS rating (Again / Hard / Good / Easy)** schedules the next review. "Again" or "I had the wrong idea" branches into the misconception path; **seeded error-drills** ("spot the error") test whether the learner can catch a wrong claim. Committing first is what makes calibration (predicted vs. actual) measurable.
7. **Gap Map** — a first-class board of misconceptions and weak spots with a lifecycle (**Open → Watching → Closed → Reopened**), each gap tagged by origin (a lecture misconception, a review wrong-idea, a task miss, a test miss) and severity, with a jump back to the exact lecture section and a Skeptic discussion thread.
8. **Formal tests + certificates** — timed, continuous check-ins whose questions are drawn **only from verified & sourced claims** (disputed ones are excluded until resolved). Each test shows scope, format (e.g. 12 questions · 20 min · pass ≥ 75%), a predicted-readiness score, and limited attempts. Every answer cites its source afterward; misses feed the gap map automatically; passing earns a certificate.

### Supporting surfaces

- **Community** — where learners debate the claims the Skeptic flagged. Threads tie to disputed claims, sources, and study groups; a "verified answer" from the Skeptic is checked against sources; strong pushback can **promote a community reply into a topic's sources**. Top-contributor leaderboard, verified-answers-only ethos.
- **Events** — live workshops, study groups, retention challenges, and AMAs (Events → Detail → Registered).
- **Progress / Reports** — four **honest signals, no vanity metrics**: **Retention, Transfer, Calibration, Drill detection (blind-spot)**, each mapped to something the learner actually did, plus per-topic breakdowns (e.g. "Merkle trees — overconfident, calibration low").
- **My Tasks** — everything waiting across topics (due-today, this-week, completed) with progress rings.
- **Settings** — Profile, Plan & billing, Active Listening (toggle each prompt type), Review/FSRS (target retention, daily limits, gates), Privacy, and a Danger zone (reset history/gap map, delete account).
- **Notifications & Support**, plus first-run **empty states** and **error/edge states** (offline, failed verification, timed-out test).

### Monetization

- **Free** — $0/mo, 3 active topics, no Skeptic hard mode.
- **Pro** — $12/mo, unlimited topics, the Skeptic on hard mode, thorough verification on everything.
- **Teams** — $9/seat, everything in Pro plus a shared topic library.

Upgrade → Checkout (billing-cycle toggle) → Success is a complete flow.

### Existing surfaces & implementation

Authoritative intent lives in a full design conversation, **49 hi-fi `.dc.html` prototypes** (every screen, in a warm, rounded, friendly ed-tech skin with consistent SVG iconography), and an implemented **Next.js app** (35 screens under `web/app` plus an interactive core loop). The app shell carries a left nav — Dashboard, Topics, My Tasks, Tests, Community, Reports, Events, Settings, Support — with the workspace's four tabs and the Settings sub-nav nested beneath.

### What makes it differentiated

The trust ledger is the moat — no competitor tags every claim verified/sourced/disputed/unsupported/interpretive, traces it to a source, and lets a Skeptic AI red-team it in the open. Everything good flows from that spine: rubric-graded tasks judge understanding against evidence; the confidence gate makes metacognition measurable; the gap map turns misconceptions into tracked, closeable objects; tests draw only from claims that survived the Skeptic. VeriLearn competes not on breadth of content but on **honesty** — it is the one learning product that shows you exactly how much to trust what it just taught you.

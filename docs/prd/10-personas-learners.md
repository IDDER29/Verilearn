## Personas — Learners & Guests

The end-users who consume VeriLearn's core value: content they can decide how far to trust. What separates these personas from each other is not subject matter but their *relationship to the verification spine* — whether they ignore trust states, race the clock past them, live inside the review engine, actively attack the ledger, or inherit a library someone else curated. Six personas span the cluster: one pre-auth evaluator, four authenticated-learner archetypes distinguished by motivation and depth of engagement with trust, and one non-obvious seat-holder who learns inside a shared Teams library.

---

### Guest / Visitor (GUEST)

**Purpose.** An unauthenticated visitor deciding, in a few minutes, whether a "verification-first" learning tool is real or marketing. They are evaluating the central claim — that VeriLearn shows its work — before spending an email address on it.

**Goals.**
- See a live example of the trust ledger: claims underlined by trust level, a clickable ledger entry with evidence and source.
- Understand what makes this different from a generic AI tutor (the Skeptic, the five trust states, honest signals) without reading a wall of copy.
- Find out what is gated (Skeptic hard mode, topic count) and what a Free account actually gets them.
- Leave with a reason to create an account, or a clear "not for me."

**Responsibilities.** None to the system — a guest owes VeriLearn nothing and holds no persisted state. Their only "job" is self-qualification: work out whether they are a self-directed learner, exam-prepper, skeptic, or a Teams invitee before authenticating.

**Permissions (can / can't).**
- **Can:** view the landing/marketing surfaces and pricing; open a read-only demo lecture and click a claim to see its ledger entry; browse public Community threads and the Events list read-only; read the Welcome/first-run explainer.
- **Can't:** create a topic or run the verification pipeline; persist any progress, review schedule, or gap map; commit a confidence gate or FSRS rating that survives the session; adjudicate a Conflict for real; post/reply in Community; register for an Event; earn a certificate. Everything a guest touches is ephemeral and evaporates on close.

**Pain points.**
- A demo that *tells* rather than *shows* — if the trust underlines and the ledger side-rail aren't touchable in the demo, the differentiator is invisible and they bounce.
- Fear of a bait-and-switch: needing to know before signup whether the Skeptic and real verification are behind the paywall (they largely are, on hard mode).
- Hitting an auth wall on the one interaction that would have convinced them (e.g., adjudicating a Conflict).

**Success criteria.** They can articulate, unprompted, "it labels every claim verified / sourced / disputed / unsupported and lets an AI attack it" — and they convert to a Free account, or correctly self-select out. Time-to-first-"aha" (clicking an underlined claim and seeing its source) is the metric that matters.

**Typical workflows.**
1. Land on marketing surface → read the one-line value prop → scroll to a demo module.
2. Open the demo lecture → notice claims underlined by trust color → click a *Disputed* claim → the ledger side-rail shows the Skeptic's objection and the source → this is the conversion moment.
3. Skim Pricing → see Free (3 topics, no hard mode) vs Pro ($12, hard mode) → decide the free tier is enough to try.
4. Hit "Create your first topic" → auth wall → sign up → hand off to **LEARNER-SELF** first-run.

**Relationships.**
- **Converts into** LEARNER-SELF (most), LEARNER-EXAM (deadline arrivals), or LEARNER-SKEPTIC (arrives specifically to test the Skeptic).
- **Arrives via** an invite from an org admin/curator (see the Teams/Org cluster) → converts straight into LEARNER-TEAM, skipping self-serve topic creation.
- **Depends on** whatever Community/Skeptic content is public: the credibility a guest sees is produced by LEARNER-SKEPTIC and power users debating in the open.

---

### Self-directed Learner (LEARNER-SELF)

**Purpose.** The default VeriLearn user: an adult learning something for curiosity or career on their own schedule, who chose this product specifically because they've been burned by confident-but-wrong AI explanations and want to know what to trust. The core loop is built for them.

**Goals.**
- Turn a fuzzy interest ("understand how Merkle trees work") into a verified lecture they can rely on.
- Actually *retain and use* it, not just feel like they learned — pass rubric-graded tasks (≥75%) and keep FSRS cards green.
- Know their own blind spots: watch the Gap Map shrink and keep Calibration honest (not being confidently wrong).
- Get all of this without a syllabus, an instructor, or being lied to by an over-confident tutor.

**Responsibilities.** Self-pacing and follow-through — the product schedules, but they must show up for spaced review. Supplying an honest topic spec at creation (subject + level + goal) so verification targets the right depth. Committing a truthful Sure/Unsure/Guessing at each confidence gate; the calibration signal is only as good as their honesty.

**Permissions (can / can't).**
- **Can (Free, default):** run the full loop on up to **3 active topics** — create topic, watch the 6-stage pipeline, work the lecture with active-listening gates, do rubric tasks, adjudicate Conflicts, audit the Sources coverage matrix, run FSRS review with confidence gate + error-drills, use the Gap Map, take timed tests, earn certificates; post/reply in Community; register for Events; read Reports (Retention, Transfer, Calibration, Drill detection); tune Active Listening and Review/FSRS settings.
- **Can't (Free):** run the Skeptic on **hard mode**; exceed **3 active topics** without archiving or upgrading. Cannot self-certify a claim — trust states are assigned by the pipeline/Skeptic/sandbox, never by the learner.
- **Pro ($12/mo) removes both caps** (unlimited topics, hard-mode Skeptic).

**Pain points.**
- The 3-topic Free cap collides with real curiosity — a second interest means archiving a first, which is the intended upgrade nudge but feels like a wall.
- The active-listening **close** hard-gate (Next locks until submitted) is friction on days they just want to skim.
- Verification latency: the pipeline runs in background, but a learner who wants to start *now* feels the wait between "create topic" and "verified lecture."
- Over time, an accumulating Gap Map and a review backlog can read as guilt rather than progress if not framed as closeable.

**Success criteria.** A steady stack of verified topics; task pass rates ≥75% on first or second attempt; Gap Map items moving Open → Closed and staying closed; Calibration trending toward well-calibrated; a certificate they trust because they saw every question sourced. Value = "I learned it *and* I know exactly how much to trust it."

**Typical workflows.**
1. **New Topic** → enter subject, self-described level, goal → validation gate passes → **Pipeline** runs Triage → Retrieve → Teach → Decompose → Verify → Skeptic in background.
2. Open the verified **Lecture** → read prose honest about its confidence → clear predict / pause-point / cloze / connection gates → submit the **close** to unlock the next section → click underlined claims to inspect ledger entries.
3. Do the topic's **Tasks** → produce the idea in own words → rubric marks each criterion hit/missing → re-attempt until ≥75%.
4. Skim **Conflicts** to adjudicate anything the Skeptic flagged; glance at **Sources** for empty coverage rows.
5. Days later: **Review** → commit Sure/Unsure/Guessing at the confidence gate → reveal with source → rate Again/Hard/Good/Easy; an "Again"/"wrong idea" branches to the misconception path and lands a **Gap Map** entry.
6. Periodically open **Reports** to check the four honest signals; hits the 3-topic wall on a new interest → **Upgrade → Checkout → Success** to Pro.

**Relationships.**
- **Converts from** GUEST; **upgrades into** the behavior of LEARNER-POWER as the habit sticks, or LEARNER-EXAM when a deadline appears.
- **Depends on** the verification pipeline and Skeptic doing their job silently; **hands off** disputed claims into Community, where LEARNER-SKEPTIC and others debate them.
- **Contrasts with** LEARNER-EXAM (paced by curiosity, not a date) and LEARNER-SKEPTIC (trusts the ledger rather than attacking it).

---

### Exam-prep Student (LEARNER-EXAM)

**Purpose.** A deadline-driven learner — certification, licensing exam, course final, interview — using VeriLearn to reach a passing standard by a fixed date, and trusting the readiness prediction to tell them whether they'll make it. Trust matters to them mainly because studying a hallucinated fact wastes time they don't have.

**Goals.**
- Get from "current level" to "will pass" before D-day, with the shortest credible path.
- Trust the **predicted-readiness score** on tests enough to plan around it.
- Convert every test miss into a closed Gap Map item fast, because misses are the highest-yield study.
- Avoid studying wrong things — a verified/sourced-only test question set is a time guarantee.

**Responsibilities.** Front-loading topic creation early enough that the pipeline and spaced review have time to work (FSRS needs days, not hours). Being disciplined about test retakes and the limited-attempts economy. Reading readiness honestly rather than cramming past a low signal.

**Permissions (can / can't).**
- **Can:** everything LEARNER-SELF can, with heavy use of **Tests** (scope, format, predicted-readiness, limited attempts), **Test Results/Retake**, and the **Gap Map**; tests draw questions **only from verified & sourced claims** (disputed excluded), which is a feature they lean on.
- **Can't (Free):** hard-mode Skeptic; more than 3 active topics — a real bite when an exam spans several subjects, pushing them toward **Pro**. Cannot see test questions built from unresolved Disputed claims (by design) and cannot force a topic "ready" the prediction says isn't.

**Pain points.**
- **Time vs. gates:** the active-listening close-gate and confidence gate add seconds per card that a crammer resents, even though they're what makes the readiness prediction trustworthy.
- Verification and FSRS both take wall-clock time; a student who starts three days out can't get the spaced-review or readiness signal they need.
- The 3-topic Free cap is acute — one exam is rarely one topic.
- Anxiety when predicted-readiness stays low; wants a clear "study *these* gaps next," not just a red number.

**Success criteria.** Predicted-readiness crosses the pass threshold before the exam; the real exam result matches what VeriLearn predicted (calibration of the *product* to their outcome); Gap Map emptied of high-severity items; a certificate earned. Value = "it told me I was ready, and I was."

**Typical workflows.**
1. Create all exam sub-topics up front → let pipelines verify in background overnight.
2. Blitz lectures and rubric tasks to establish coverage; tolerate the gates because they feed the readiness model.
3. Take a **Test** early for a baseline **predicted-readiness** → **Test Results** → every miss auto-lands in the **Gap Map** with a jump-back to the exact lecture section.
4. Work the Gap Map top-down by severity → re-lecture the weak section → **Review** the related cards → close the gap.
5. **Test Retake** within attempt limits → watch readiness climb → repeat until it clears the threshold.
6. Hit the 3-topic wall across subjects → **Upgrade to Pro** → sit the exam → return to mark topics done.

**Relationships.**
- **Is a mode of** LEARNER-SELF under time pressure; reverts to LEARNER-SELF (or churns) once the exam passes.
- **Depends on** the Tests engine and readiness model; **hands off** misses to the Gap Map, and unresolved Disputed claims to Conflicts (which quietly shrink their testable pool until adjudicated).
- **Conflicts with** the product's honesty gates when they slow the cram — the deadline pushes against the friction that makes trust real. Rarely engages LEARNER-SKEPTIC's deep-audit behavior; they want the ledger to *be* trustworthy, not to test it.

---

### Returning Power-Learner (LEARNER-POWER)

**Purpose.** A long-term, near-daily user for whom VeriLearn is a standing knowledge practice, not a project. Their center of gravity is the **review/retention engine** and **calibration** — they're optimizing a long-run system across many topics, and they pay for Pro without thinking about it.

**Goals.**
- Keep a large topic portfolio green: retention high, review backlog controlled, streak intact.
- Get and stay **well-calibrated** — the difference between "knowing" and "feeling like I know" is the game they're playing.
- Catch their own blind spots via drill detection and seeded error-drills before those become real gaps.
- Tune the machine — target retention, daily limits, which gates fire — to fit their life.

**Responsibilities.** Managing review load so it stays sustainable (adjusting FSRS daily limits rather than declaring bankruptcy). Curating their own portfolio — archiving stale topics, reopening gaps when a review reveals rot. Being the honest signal-reader who acts on Reports rather than admiring them.

**Permissions (can / can't).**
- **Can (Pro):** unlimited active topics; **Skeptic hard mode** on everything; deep control of **Review/FSRS settings** (target retention, daily limits, confidence-gate on/off) and **Active Listening** toggles; full Reports with per-topic breakdowns ("Merkle trees — overconfident, calibration low"); everything else in the loop.
- **Can't:** escape that trust states are system-assigned — even a power user cannot promote a claim's trust level by hand; they earn it through the pipeline, sandbox, or a resolved Conflict. Cannot fabricate calibration — turning the confidence gate off simply stops measuring it.

**Pain points.**
- **Review debt:** miss a few days and the FSRS queue avalanches; needs graceful load-shedding, not an all-or-nothing wall.
- Portfolio management at scale — dozens of topics, gap maps, and streaks compete for attention; without good triage the dashboard becomes noise.
- Diminishing novelty: once the loop is habit, they need the *depth* signals (transfer, calibration deltas) to stay motivated, not vanity streaks.
- Wants power-user affordances (bulk actions, keyboard flow through review) that a beginner-friendly skin may under-serve.

**Success criteria.** Sustained high retention across a large portfolio; calibration curve tightening over months; drill-detection catching blind spots before tests do; a review habit that survives busy weeks. Value = "my trusted-knowledge base compounds and I know its true state at a glance."

**Typical workflows.**
1. Daily open → **Dashboard** → clear due **Review** cards: confidence gate → reveal-with-source → FSRS rate; error-drills sprinkled in to test error-detection.
2. Route any "wrong idea" into the misconception path → **Gap Map** entry Open → Watching.
3. Weekly **Reports** pass → spot a per-topic calibration dip → drill that topic's error-cards and reopen closed gaps that regressed.
4. Add new topics on a whim (no cap) with **hard-mode Skeptic** for a rigorous ledger.
5. Periodically retune **Review/FSRS settings** (raise target retention on critical topics, cap daily new cards) to keep load sane.
6. Join **Events** (retention challenges, AMAs) and appear on the Community top-contributor leaderboard.

**Relationships.**
- **Grows out of** LEARNER-SELF once the habit compounds; the "someday" version of every retained learner.
- **Overlaps with** LEARNER-SKEPTIC (both are hard-mode Pro users) but is retention-motivated, not audit-motivated — a power-learner trusts the ledger and drills against it; the skeptic attacks it.
- **Depends on** FSRS/Reports fidelity above all; **hands off** community mentorship — often the "verified answer" contributor whose credibility helps GUESTs convert.

---

### Skeptical / Expert Learner (LEARNER-SKEPTIC)

**Purpose.** A domain-competent user who came *because* of the verification claim and intends to test it. They read the trust ledger adversarially, run the Skeptic on hard mode, and treat Conflicts and the coverage matrix as the main event. For VeriLearn this is the highest-value and highest-risk persona: they can promote the product's credibility or expose that the ledger is thin.

**Purpose (sharpened).** They are not learning from zero — they are pressure-testing whether VeriLearn's claims survive an expert's scrutiny, and contributing back when they find the ledger wanting.

**Goals.**
- Verify the verifier: find where a "Verified · source" tag over-reaches, where a Sourced claim is actually Disputed, where the coverage matrix has empty rows.
- Adjudicate Conflicts on the merits and resolve genuinely Interpretive positions fairly.
- Push strong, sourced pushback in Community — and get it **promoted into a topic's sources** when it holds up.
- Trust the platform enough to use it themselves, having failed to break it.

**Responsibilities.** Rigorous, sourced argument rather than mere contrarianism — the Community ethos is verified-answers-only, and a promotion to sources must survive a check against references. Adjudicating Conflicts honestly. Flagging over-confident tags so the ledger improves for everyone, not just winning debates.

**Permissions (can / can't).**
- **Can:** run the **Skeptic on hard mode** (Pro); adjudicate **Conflicts**; audit the full **claims × sources coverage matrix**; open Skeptic discussion threads on any claim; post sourced rebuttals in **Community** where a strong reply can be **promoted into a topic's sources**; challenge a claim's trust state by raising it to a Conflict.
- **Can't:** unilaterally re-tag a claim as Verified — they can *contest* (→ Conflict) and *supply evidence*, but certification runs through the pipeline/sandbox and source-check, not their say-so; get a Community reply into sources without it passing the verification check. Hard mode itself requires **Pro** (or Teams).

**Pain points.**
- A shallow ledger is their nightmare and their target — too many Sourced-but-not-proven or Unsupported claims reads as the product not walking its talk.
- The gap between "I, an expert, know this is contested" and the system tagging it Verified · source — they need a fast, legitimate path to raise that to a Conflict, not a comment box that goes nowhere.
- Friction in the promote-reply-to-sources mechanic; if strong pushback dies in a thread, they disengage and so does the product's credibility engine.
- Beginner-oriented pacing gates feel patronizing to an expert who wants to jump straight to Conflicts and Sources.

**Success criteria.** They found real weaknesses *and* had a legitimate channel to fix them (Conflict raised, source promoted, tag corrected); the coverage matrix on hard mode is dense, not hollow; Interpretive claims are honestly mapped rather than falsely certified. Value = "I attacked it in good faith and it mostly held — and where it didn't, I could improve it."

**Typical workflows.**
1. Create a topic in their own expertise → run **hard-mode Skeptic** → go straight to **Sources** to read the coverage matrix, hunting empty rows and over-tagged claims.
2. Open the **Lecture** → click underlined claims adversarially → find a Verified · source tag they believe over-reaches → **raise it to a Conflict**.
3. Work **Conflicts** → adjudicate each with sourced reasoning; resolve Interpretive claims by mapping positions.
4. Take a strong disagreement to **Community → Thread** tied to the disputed claim → post a sourced rebuttal → if it survives the source check, it's **promoted into the topic's sources**, improving the ledger.
5. Track their flags/resolutions; climb the top-contributor leaderboard; join AMA/debate **Events**.

**Relationships.**
- **Feeds** every other learner: the Conflicts they resolve and sources they promote harden the ledger that LEARNER-SELF, LEARNER-EXAM, and LEARNER-TEAM later trust blindly.
- **Overlaps with** LEARNER-POWER on tooling (Pro, hard mode) but is audit-motivated, not retention-motivated.
- **Depends on** the Skeptic and coverage-matrix being genuinely rigorous; **conflicts with** the product when honesty tooling is shallow — they are the persona most likely to publicly call that out. **Hands off** improved sources back to the pipeline.

---

### Team Seat Learner (LEARNER-TEAM)

**Purpose.** The non-obvious persona this cluster implies: a learner who lives inside a **shared Teams topic library** someone else built — an employee on a training track, a bootcamp cohort member, a study-group participant. They consume curated, pre-verified topics rather than creating from scratch, and they never touch billing. Their trust in the content is partly inherited from whoever curated the shared library.

**Purpose (sharpened).** They are an end-learner in an org context: the *consumer* half of Teams, distinct from the admin/curator (Org/Teams cluster) who provisions seats and owns the shared library.

**Goals.**
- Learn the topics their team put in front of them, and reach whatever bar (task pass, test, certificate) the team expects.
- Trust that shared content is verified — lean on the ledger without having to re-audit it themselves.
- Keep up with cohort peers (shared events, group study, maybe a team leaderboard) without exposing private weaknesses they'd rather not share.

**Responsibilities.** Working the assigned/shared topics through the same honest loop everyone else uses — the gates and confidence commitments aren't optional just because a curator vouched for the content. Contributing back to shared gap maps or conflicts where team settings allow. Understanding that some of their activity may be visible to the team.

**Permissions (can / can't).**
- **Can (Teams, $9/seat = Pro features + shared library):** access and learn from the **shared topic library**; use hard-mode Skeptic and the full loop (Pro-level); take shared tests and earn certificates; join team **Events**/study groups; per team settings, contribute to shared Conflicts and Gap Maps.
- **Can't:** manage **Plan & billing**, seats, or invites (that's the org admin/curator); typically cannot delete or unshare team-owned topics from the shared library; may be governed by team-set defaults for Active Listening/Review that they can't fully override; visibility of their progress to the team is set by an admin, not them. Still cannot self-certify claims — same trust-spine rule as everyone.

**Pain points.**
- **Inherited trust vs. own scrutiny:** they may over-trust shared content because it's "official," which cuts against VeriLearn's whole ethos — the ledger should still invite them to click and check.
- Content mismatch: a curated topic may be pitched at the wrong level or goal for *them*, and they can't re-spec a shared topic the way a self-directed learner re-specs their own.
- Privacy tension: not wanting their calibration dips or gap map exposed on a team leaderboard.
- Ambiguity about what's shared vs. personal — is this gap map mine or the team's?

**Success criteria.** They complete the team's track, pass its rubric tasks and tests, and earn certificates they (and their org) trust because the underlying claims are sourced. Value = "I learned the org's curriculum *and* I could verify it myself, not just take it on faith." For the org, that a seat produces a genuinely-calibrated learner, not a completion checkbox.

**Typical workflows.**
1. Accept a seat invite (arriving as a converted GUEST) → land on the **shared library** rather than an empty New Topic screen.
2. Open a shared, pre-verified topic → work the **Lecture** gates → notice they can still click claims into the ledger and even raise a **Conflict** on shared content.
3. Do rubric **Tasks** and shared **Tests** → misses feed their (or a shared) **Gap Map**.
4. Run daily **Review**/FSRS on their seat like any Pro user; join team **Events**/study groups.
5. Where allowed, contribute pushback to shared **Conflicts/Community**, improving the library for the whole team.

**Relationships.**
- **Depends on** the org admin / topic curator (Org/Teams cluster) for the shared library, seat, billing, and visibility settings — the primary hand-off boundary of this persona.
- **Behaves like** LEARNER-SELF/POWER inside the loop, but with a consumer-not-creator posture toward topics.
- **Benefits from** LEARNER-SKEPTIC's ledger-hardening most acutely, since they inherit trust rather than building it — and can *become* a mini-skeptic for their team by raising Conflicts on shared content.
- **Converts from** GUEST via invite (bypassing self-serve), and may spin up private personal topics as a LEARNER-SELF alongside their seat.

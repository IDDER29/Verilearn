## Personas — Educators & Contributors

These personas do not consume VeriLearn primarily to learn a topic for themselves — they act *on* the verification spine and the community that surrounds it. The cluster is organized around a deliberate **separation of authority**, because a verification-first product only stays trustworthy if the person who decides "this is pedagogically worth assigning" is not automatically the person who decides "this claim is now Verified," which is not automatically the person who can ban a user or promote a community reply into a source:

| Persona | Authority it holds | Authority it deliberately lacks |
| --- | --- | --- |
| Instructor / Educator | Pedagogical: curate, assign, endorse, read cohort signals | Cannot change a claim's trust state or promote a source |
| Subject-Matter Expert / Reviewer | Epistemic: adjudicate conflicts, set trust states, promote sources | Cannot assign cohorts, moderate/ban, or manage billing |
| Community Moderator | Governance: threads, conduct, leaderboard integrity | Cannot certify a claim or promote a reply to a source |
| Community Contributor | Participation: answer, dispute, request promotion | Cannot self-promote to source or self-certify |
| Event Host / Facilitator | Live facilitation: schedule, run, convert sessions | Cannot certify live; must route claims through an SME |

A person can hold more than one role (an SME often also hosts AMAs; a top Contributor may be promoted to Moderator), but the *permissions* are separable so authority never leaks between them.

---

### Instructor / Educator (INSTRUCTOR)

**Purpose.** An instructor uses VeriLearn to teach a cohort (a class, a bootcamp track, a corporate onboarding group) on the **Teams** plan's shared topic library. Their distinctive job in a verification-first product is *not* authoring content — VeriLearn generates the lecture. It is deciding which machine-generated topics are trustworthy enough to put in front of learners, assigning them, and reading the four honest signals to find where the cohort is actually weak rather than where it looks busy.

**Goals.**
- Assign only topics whose trust bar is clean — no unresolved Disputed claims, few Unsupported rows in the coverage matrix — so learners never absorb an error the instructor endorsed.
- See cohort mastery through the four honest signals (Retention, Transfer, Calibration, Drill detection), not vanity metrics like time-on-page.
- Catch shared misconceptions early via the aggregated Gap Map so a single lecture can close a gap the whole cohort shares.
- Endorse the specific verified answers and task exemplars they want learners to model.

**Responsibilities.**
- Curate the Teams shared topic library: create topics (subject + level + goal), let the pipeline run, and review the resulting trust bar before publishing to the cohort.
- Assign topics, tasks, and target test dates; set cohort defaults for Active Listening prompts and FSRS target retention where the plan allows.
- Monitor per-topic breakdowns (e.g. "Merkle trees — cohort overconfident, calibration low") and intervene: re-teach, add a drill, or route learners to a Conflict to adjudicate.
- Endorse strong task answers and verified community answers so they carry an instructor badge.
- Hand any claim they doubt to an SME rather than overriding it themselves.

**Permissions (can / can't).**
- **Can:** create and organize the shared topic library; assign/unassign topics and tasks; set target test windows; view aggregated and per-learner honest signals, gap maps, and calibration; endorse a verified answer or task exemplar; open a Conflict for the cohort to adjudicate; configure cohort defaults for gates/FSRS.
- **Can't:** change a claim's trust state, resolve a Conflict authoritatively, or promote a community reply into a source (all SME authority); moderate, mute, or ban community users (Moderator); provision seats or manage billing (Org/Billing admin, another cluster). Endorsement is a *pedagogical* signal layered on top of the ledger — it never changes the underlying trust state.

**Pain points.**
- A topic they want to assign lands with a Disputed claim still open; they are blocked until an SME adjudicates, and the SME queue is not theirs to control.
- Learners game the confidence gate (always clicking "Sure") which pollutes the calibration signal they rely on.
- They can *see* an Unsupported row in the coverage matrix but can't fix it — attaching a source is SME-only, so a weak topic sits half-usable.
- Aggregate signals hide the one learner who is quietly overconfident and heading for a test failure.

**Success criteria.**
- Cohort Retention and Transfer rise across the term; Calibration tightens (predicted readiness converges on actual test scores).
- Gap Map entries move Open → Closed faster than they Reopen.
- Test pass rates (≥75%) climb without the instructor having to write a single question — tests draw only from verified/sourced claims automatically.
- Low endorsement-to-dispute ratio: the answers they endorsed rarely get later flagged by the Skeptic.

**Typical workflows.**
- *Vetting a topic for assignment:* Create topic → watch the six-stage pipeline (Triage → Retrieve → Teach → Decompose → Verify → Skeptic) → open the finished lecture → scan the trust bar and coverage matrix → if a Disputed claim exists, route it to an SME → once clean, publish to the shared library and assign to the cohort.
- *Weekly cohort review:* Open Reports → sort per-topic by lowest Calibration → spot "overconfident" topics → open that topic's aggregated Gap Map → assign a targeted seeded error-drill and a re-review to affected learners.
- *Endorsing an exemplar:* In Tasks, open a learner answer that scored 100% against the rubric → verify each hit criterion → endorse it as a model answer visible to the cohort.

**Relationships.**
- **Depends on** the SME to clear Conflicts and shore up Unsupported claims before assignment, and on the Org/Billing admin to provision Teams seats.
- **Hands off to** learners (the Learner/Self persona) via assignments, and to the SME any claim they distrust.
- **Conflicts with** the SME when a pedagogically convenient claim is epistemically shaky — the instructor wants to assign now, the SME wants it Verified first. This tension is by design.

---

### Subject-Matter Expert / Content Reviewer (SME-REVIEWER)

**Purpose.** The SME is the human-in-the-loop for the verification spine itself. Where the Skeptic AI and execution sandbox flag machine judgments, the SME is the authority that confirms, overrides, or extends them. They are the reason the trust ledger can be trusted: they adjudicate Conflicts with evidence, close Unsupported rows in the coverage matrix, and decide when a community reply is strong enough to become a durable **source**. This is the most product-specific persona in the cluster — it exists only because VeriLearn treats trust as a first-class object that a machine alone shouldn't be the final word on.

**Goals.**
- Keep the ledger honest: every claim's trust state should be defensible to a domain peer.
- Clear the Conflict queue so Disputed claims (which are excluded from tests) don't strand learners.
- Convert the best community pushback into permanent sources, tightening the coverage matrix over time.
- Verify the Skeptic — confirm its genuine catches, and dismiss its false-positive overreach so learners aren't drowned in noise.

**Responsibilities.**
- Adjudicate Conflicts raised by the Skeptic or execution sandbox: read the contested claim, the sandbox result or the Skeptic's argument, weigh sources, and set the outcome (uphold as Verified, keep Disputed, reclassify as Interpretive, or mark Unsupported).
- Audit the coverage matrix and attach sources to empty rows, or explicitly mark a claim Unsupported so it's surfaced honestly rather than hidden.
- Run the Skeptic on **hard mode** (Pro/Teams) on high-stakes topics and review its harsher flags.
- Review the Community promotion queue and promote qualifying replies into a topic's sources (with attribution), updating the affected claims' trust state.
- Distinguish the two flavors of contested — a resolvable **Disputed** claim vs. a genuinely **Interpretive** one where positions should be mapped, not certified.

**Permissions (can / can't).**
- **Can:** set and change any claim's trust state (Verified·execution, Verified·source, Sourced, Disputed, Unsupported, Interpretive) with attached evidence; resolve Conflicts authoritatively; attach/detach sources in the coverage matrix; promote a community reply into sources; run Skeptic hard mode; annotate ledger entries with confidence and rationale.
- **Can't:** assign topics to cohorts or read a class's private progress (Instructor); ban/mute users or lock threads (Moderator); manage billing or seats (admin). Their authority is epistemic and topic-scoped, not pedagogical or governance.

**Pain points.**
- The Conflict queue backs up; every unresolved Disputed claim silently shrinks the pool of test-eligible questions and blocks instructors.
- Skeptic hard mode produces high-recall/low-precision flags; separating real overreach from pedantic false positives is slow, unglamorous work.
- A promoted community source later turns out weak, and unwinding a promotion (reverting the claim's trust state) ripples into tests, gap maps, and certificates already issued.
- Interpretive topics tempt reviewers to force a false "Verified," which would betray the product's honesty premise.

**Success criteria.**
- Conflict queue stays near-zero age; Disputed claims are resolved before they block tests.
- Coverage matrix Unsupported rows trend down per topic without fabricated sourcing.
- Skeptic precision improves where the SME has curated (fewer repeat false positives on reviewed topics).
- Promoted sources hold up — low revert rate — and demonstrably raise the affected topic's Verified·source count.

**Typical workflows.**
- *Adjudicating a Conflict:* Open global Conflicts → pick the oldest Disputed claim (e.g. "Dijkstra works on any weighted graph") → read the Skeptic's counterexample (negative weights) and any sandbox run → decide: reclassify the claim as Sourced-with-caveat or split it, attach the source, write the rationale → the claim leaves the Disputed pool and re-enters test eligibility.
- *Closing a coverage gap:* Open a topic's Sources tab → filter the coverage matrix to empty rows → for each Unsupported claim, either attach a documented reference (→ Verified·source / Sourced) or confirm Unsupported so it's honestly surfaced.
- *Promoting a community answer:* Open the Community promotion queue (replies a Moderator flagged) → verify the reply's citations against the actual sources → promote it into the topic's sources with attribution → the linked claim's trust state upgrades and the contributor gets leaderboard credit.

**Relationships.**
- **Depends on** the Skeptic AI and execution sandbox to surface candidates, and on Moderators to route promotion-worthy replies into their queue.
- **Hands off to** Instructors (a now-clean topic is safe to assign) and to Contributors (a promoted reply, credited).
- **Conflicts with** Instructors over assignment timing (see INSTRUCTOR) and with Contributors who believe their reply deserves promotion when the sourcing isn't strong enough.

---

### Community Moderator (COMMUNITY-MOD)

**Purpose.** The Moderator governs the Community surface, where learners debate the claims the Skeptic flagged. VeriLearn's community runs on a specific ethos — **verified-answers-only, cite-your-source, threads tied to claims** — and the Moderator is the person who keeps that ethos intact against spam, abuse, off-topic drift, and leaderboard gaming. They protect the *pipeline* by which good community discussion becomes durable sources, without themselves having the epistemic authority to promote.

**Goals.**
- Keep every thread anchored to a real object — a disputed claim, a source, or a study group — not free-floating opinion.
- Enforce the norm that assertions cite sources, so the community's signal-to-noise stays high enough that SMEs can mine it for promotions.
- Keep conduct healthy and the top-contributor leaderboard honest (no vote rings, sockpuppets, or citation-padding).
- Route the genuinely strong replies to the SME promotion queue quickly.

**Responsibilities.**
- Triage new threads and replies; merge duplicates, retag mis-anchored threads to the right claim/source, close resolved ones.
- Enforce conduct: remove abusive or low-effort posts, warn/mute/ban repeat offenders.
- Pin verified answers and flag promotion-worthy replies into the SME queue.
- Maintain leaderboard integrity — investigate suspicious vote patterns, strip gamed reputation.
- Escalate: hand claim-level disputes to SMEs and pedagogical questions to Instructors rather than answering with false authority.

**Permissions (can / can't).**
- **Can:** lock, merge, close, retag, and pin threads; remove posts; warn/mute/temp-ban/ban users; flag a reply for SME promotion review; adjust or void leaderboard standing for gaming; manage study-group thread membership.
- **Can't:** promote a reply into sources or change any claim's trust state (SME); assign topics or read cohort progress (Instructor); manage billing. They govern the *conversation*, never the *ledger*.

**Pain points.**
- A brigade upvotes a confidently-wrong answer; the Moderator can suppress and de-rank it but can't authoritatively mark the underlying claim — they must wait on an SME.
- Volume: on a hot Disputed claim, dozens of near-duplicate threads appear and merging them fast enough is manual.
- Judging "promotion-worthy" without epistemic authority — they must recognize a strong reply well enough to flag it, but not so much that they overstep into the SME's certification.
- Balancing openness (debate is the point) against the verified-answers-only ethos (noise erodes it).

**Success criteria.**
- High proportion of threads correctly anchored to a claim/source; low duplicate rate.
- Healthy flag-to-promotion conversion: replies the Moderator escalates are the ones SMEs actually promote (they're calibrated to quality, not just activity).
- Low abuse recurrence and demonstrably clean leaderboard (few reversals).
- Fast time-to-anchor on threads spawned by a newly Disputed claim.

**Typical workflows.**
- *Hot-claim triage:* A claim flips to Disputed and spawns 15 threads → Moderator merges them into one canonical thread anchored to that claim → pins the best-sourced counterargument → flags it to the SME queue → closes the duplicates with a redirect.
- *Conduct action:* Reported reply → review against conduct + cite-your-source norms → remove the post, issue a warning (or ban on repeat) → log the action.
- *Leaderboard audit:* Notice a contributor's reputation spike → inspect vote timing/sources → find a vote ring → void the inflated votes and restore honest standing.

**Relationships.**
- **Depends on** SMEs to certify what the community argues about and to action the promotion queue.
- **Hands off to** SMEs (flagged replies) and Instructors (pedagogy questions).
- **Conflicts with** Contributors when enforcing conduct or de-ranking a popular-but-wrong answer; the tension is intentional — the Moderator serves the ethos, not the crowd.

---

### Community Contributor (CONTRIBUTOR)

**Purpose.** A Contributor is a power learner (Free or Pro) who gives back to the community by answering questions, raising well-sourced disputes, and pushing back on claims. In VeriLearn they can't author lectures — the AI does — so their path to authoring *durable* content runs through the promotion pipeline: a strong, well-cited reply can be promoted by an SME into a topic's sources. That is how a Contributor's argument becomes permanent, verified content the whole platform inherits.

**Goals.**
- Get their best replies promoted into sources — the platform's highest form of contribution credit.
- Climb the top-contributor leaderboard on the honest currency: verified, well-sourced answers, not volume.
- Win the disputes they raise — turn a claim they believe is overreaching into an adjudicated Conflict that resolves their way.
- Help peers close gaps, especially in study groups they help run.

**Responsibilities.**
- Post answers that cite sources; answer questions anchored to specific claims.
- Raise disputes with evidence, opening (or strengthening) a Conflict for SME adjudication.
- Request promotion of a strong reply and respond to Moderator/SME feedback to make it promotion-ready.
- Model the cite-your-source norm; upvote on merit.

**Permissions (can / can't).**
- **Can:** post threads/replies; cite and link sources; raise a dispute that feeds a Conflict; request promotion of their reply; upvote; earn/hold leaderboard standing; create and help run study-group threads.
- **Can't:** promote their own (or anyone's) reply into sources or change any claim's trust state (SME); moderate, close, or ban (Moderator); assign topics (Instructor). Their influence is earned through evidence and reputation, never granted as permission.

**Pain points.**
- A reply they consider decisive gets flagged but stalls in the SME promotion queue, or is rejected for sourcing they thought was sufficient.
- A confidently-wrong but popular answer out-votes their careful, sourced one until a Moderator/SME intervenes.
- The verified-answers-only ethos raises the bar — low-effort help doesn't earn standing, which can feel discouraging early on.
- No self-promotion by design means their best contribution's fate is out of their hands.

**Success criteria.**
- Count of replies promoted into sources (their durable footprint) and disputes that resolved their way.
- Leaderboard rank earned via verified answers.
- Peers they helped closing gaps / passing tests on topics they contributed to.

**Typical workflows.**
- *Raising a dispute:* Reading a lecture, they distrust an underlined claim → open its ledger entry → start a Community thread anchored to that claim with a cited counterexample → it strengthens a Conflict → an SME adjudicates → if upheld, the claim is reclassified and the Contributor earns credit.
- *Getting promoted:* Post a thoroughly-cited answer on a Disputed claim → a Moderator flags it for the SME queue → the Contributor tightens citations on request → an SME promotes it into the topic's sources with attribution → the linked claim upgrades to Verified·source.
- *Running a study group:* Spin up a study-group thread → coordinate peers through a topic's gap map → surface recurring misconceptions to a Moderator/SME.

**Relationships.**
- **Depends on** SMEs (the only ones who can promote/certify) and Moderators (who flag and keep the arena fair).
- **Hands off to** SMEs (promotion-ready replies and disputes) and peer Learners (answers, study-group help).
- **Conflicts with** Moderators over conduct/de-ranking and with SMEs over promotion decisions. A high-performing Contributor is the natural pipeline into the Moderator role.

---

### Event Host / Facilitator (EVENT-HOST)

**Purpose.** Events (workshops, study groups, retention challenges, AMAs) are a first-class VeriLearn surface, and someone runs them. The Event Host is that facilitator. The role is *non-obvious* but distinct: none of the other four personas' workflows cover scheduling a live session, running it, and — critically for a verification-first product — converting what surfaces live into ledger objects afterward (Conflicts to adjudicate, gaps to track, replies to promote). The hat is often worn by an SME (AMA), an Instructor (workshop), or a top Contributor (study group), but the *hosting workflow* is its own thing.

**Goals.**
- Run live sessions that produce durable value, not just attendance — every good question or dispute raised live should land as a tracked object, not evaporate when the call ends.
- Keep live claims honest: in a verified-answers-only product, an AMA answer given live must still be checked against sources, not asserted on the host's authority.
- Drive a specific outcome per event type — a retention challenge should move the Retention signal; a workshop should close specific gaps.

**Responsibilities.**
- Create and schedule events with clear scope (type, topic, prerequisites), manage registrations (Events → Detail → Registered), and send reminders.
- Facilitate the live session; for AMAs, keep answers anchored to sources and defer uncertain ones to post-event SME review rather than guessing.
- Run retention challenges against real FSRS/Retention data and study groups against a shared gap map.
- Post an event recap and, most importantly, convert the session's output: open Conflicts for live disputes, add gap-map entries, and route promotion-worthy answers to the SME queue.

**Permissions (can / can't).**
- **Can:** create/schedule/edit events; manage registrations and attendee lists; post recaps and materials; open Conflicts, add gap-map entries, and flag replies for SME promotion off the back of a session; configure retention-challenge parameters.
- **Can't:** certify a claim or promote a source live (must route through an SME); moderate the broader community or ban users (Moderator); assign graded cohort topics unless they also hold the Instructor role. Hosting privilege is separable from epistemic and governance authority.

**Pain points.**
- Live pressure to answer an uncertain question definitively conflicts with the honesty ethos — the host must be comfortable saying "unverified, I'll route it to an SME."
- Post-event conversion is manual and easy to skip; without it, the event's value doesn't reach the ledger and the session was just a nice chat.
- Retention challenges depend on attendees' real FSRS data, which the host may only see in aggregate — hard to tailor difficulty.
- No-shows and registration churn (Events → Registered) muddy whether an event actually moved a signal.

**Success criteria.**
- Post-event conversion rate: fraction of live questions/disputes that became a Conflict, gap entry, or promoted source.
- Measurable signal movement — a retention challenge that lifts participants' Retention; a workshop that closes the gap-map entries it targeted.
- Repeat attendance and a healthy registered-to-attended ratio.
- Low count of live answers that a later SME review had to reverse.

**Typical workflows.**
- *Hosting an AMA:* Schedule the AMA against a topic → registrants join → answer anchored to the trust ledger, tagging uncertain ones "to verify" → after the session, open Conflicts for the genuine disputes and flag the best-sourced attendee answers to the SME promotion queue → post a recap linking the resulting ledger changes.
- *Running a retention challenge:* Configure a challenge on a topic's review deck → participants run confidence-gated FSRS reviews under the challenge → track aggregate calibration/retention movement → close with a recap and seed error-drills for the shared weak spots.
- *Facilitating a study group:* Schedule recurring sessions → work a shared gap map live → after each, update gap-map lifecycles (Open → Watching/Closed) and escalate unresolved disputes to an SME.

**Relationships.**
- **Depends on** SMEs to certify anything raised live and on Moderators for conduct if an event thread turns hostile.
- **Hands off to** SMEs (live disputes → Conflicts, strong answers → promotion queue) and Instructors (workshop outcomes feeding cohort gap maps).
- **Overlaps with** SME, Instructor, and Contributor as a shared hat; **conflicts** mainly with the honesty ethos itself under live pressure, which is why the certify-live permission is deliberately withheld.

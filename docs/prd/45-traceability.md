## Requirements Traceability Matrix

This matrix traces every persona's most important goals through the chain **Persona → Goal → User Story (ID) → Feature / Surface → Technical Requirement**, one table per persona. It exists to prove two things at once: that every feature answers a real persona need, and that every important user story lands on a real surface with a real technical obligation behind it. Story IDs reference the persona files (`10–13`) and the twenty domain files (`20–39`). The invariant that threads through the whole product — *identity and money grant access, never truth; only the pipeline, sandbox, and human SME certify* — shows up in the Technical Requirement column as an explicit firewall wherever an administrative or system actor could otherwise reach the ledger.

Legend: surfaces use the product's own names (Dashboard, New Topic, Pipeline, Topic Workspace = Lecture/Tasks/Conflicts/Sources, global Conflicts+Sources, Gap Map, Review/Reveal/Discuss/Session Complete, Tests/Detail/Runner/Results/Retake, Progress, My Tasks, Community+Thread, Events, Settings, Upgrade→Checkout→Success, Notifications, Support).

---

### Guest / Visitor (GUEST)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Judge the trust-ledger claim before spending an email | AUTH-01, HOME-12, LEARN-17 | Demo Dashboard / demo Lecture | Pre-seeded fixed content; clickable claim→ledger drill-down; all state in-memory/session-scoped, no server record, no PII; static fallback if backend down |
| Watch verification actually happen | VERIFY-22, TRUST-22 | Demo Pipeline / demo Conflict | Ephemeral pipeline on canned topic; nothing persisted; cannot mutate any ledger |
| See the verified-answers-only ethos | COMM-14 | Community (read-only) | Public, unauthenticated read of anchored threads; no post/vote |
| Preview a live event and be convinced | EVENT-22 | Events (public page) | Public event page + sign-up prompt; zero persisted registration until auth |
| Evaluate on a phone | A11Y-15 | Mobile demo | Responsive ephemeral demo; top-of-funnel first-touch |
| Be asked to sign up only at the value boundary | AUTH-02 | Auth wall | Deferred auth wall triggered on first persist action; intended action + typed intent carried into first-run |
| See honest, complete pricing pre-account | BILL-03 | Upgrade / Pricing | Public pricing (Free/Pro/Teams); no dark patterns; demo stays usable if abandoned |

---

### Self-directed Learner (LEARNER-SELF)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Create an account and start verified learning | AUTH-03, AUTH-05, AUTH-07 | Sign-up / first-run Welcome | Email+password with policy/breach-check; single-use expiring verification token; role-aware first-run with empty-state placeholders |
| Turn a fuzzy interest into a pitched topic | VERIFY-01, VERIFY-02 | New Topic | 3-field spec (subject+level+goal); "Start verifying" disabled-until-valid validation gate |
| Trust that verification is real, not a spinner | VERIFY-04, VERIFY-05, NOTIF-02 | Pipeline | Six visible stages with live status; background non-blocking job, closable; completion/failure notification |
| Read prose I can tell apart from a guess | LEARN-01, LEARN-02, LEARN-03 | Lecture + ledger side-rail | Inline per-claim trust annotation; side-rail entry with source, trust state, confidence |
| Not sleepwalk through material | LEARN-06, LEARN-22 | Lecture close gate | Hard gate locks "Next" until own-words submit; junk/empty-input resistant so the signal can't be juked |
| Be tested on understanding, revise to pass | TASK-02, TASK-03, TASK-04, TASK-05 | Tasks | Free-text meaning-grading; per-criterion rubric traced to a source; ≥75% pass; targeted follow-up + revise/resubmit |
| Own disputes as first-class objects | TRUST-01, TRUST-02, TRUST-03 | Conflicts / Sources | Five-state, source-traceable ledger; per-topic Conflicts tab; adjudication propagates the fix everywhere |
| Commit confidence before I see the answer | REVIEW-01, REVIEW-02, REVIEW-03, REVIEW-04 | Review / Reveal | Commit-before-reveal lock (Sure/Unsure/Guessing); reveal shows trust state + source; FSRS Again/Hard/Good/Easy with next-interval preview |
| Turn a wrong idea into a tracked gap | REVIEW-07, TASK-14, GAP-01, GAP-05, GAP-06 | Gap Map | Misconception-path intake; evidence-driven Open→Watching→Closed lifecycle; auto-reopen on lapse |
| Be tested only on trustworthy material | TEST-02, TEST-05 | Tests / Runner / Results | Question pool restricted to verified+sourced claims; per-miss claim+source shown |
| See real progress, not vanity metrics | ANALYTICS-01, ANALYTICS-04 | Progress | Four honest signals (Retention/Transfer/Calibration/Drill) with trend; "Where to focus" links to the fix |
| Understand the Free cap and upgrade cleanly | VERIFY-06, BILL-02, BILL-20 | Paywall / Upgrade→Checkout→Success | 3-active-topic cap enforced at creation; contextual paywall; idempotent checkout (no double-charge) |
| Never lose work to a dropped connection | LEARN-19, REVIEW-17, A11Y-17, A11Y-19 | Lecture / Review / mobile | Local persistence of gate answers, commits, ratings; offline reviews count and sync; inline "couldn't save — retry" |
| Delete my account and my data | AUTH-19, SETTINGS-19 | Settings → Danger zone | Typed `DELETE` confirmation; cascade across topics/ledger/reviews/gaps; retention exceptions surfaced before confirm |

---

### Exam-prep Student (LEARNER-EXAM)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Know whether I'll pass before D-day | TEST-01, HOME-08 | Tests / Detail / Dashboard | Predicted-readiness model over the verified/sourced pool; surfaced on Home |
| Never study a hallucinated fact | TEST-02, TEST-03 | Runner | Verified/sourced-only questions; disputed/unsupported sections visibly excluded ("needs review"), not silently dropped |
| Convert every miss into a fast fix | TEST-06, LEARN-16 | Results / Gap Map / Lecture | Auto-gap per miss; deep-link jump-back to the exact lecture section+claim |
| Recover a failed test efficiently | TEST-07 | Retake | Fresh item set weighted to weak sections; best-score-counts |
| Fix the gaps that most threaten my pass | GAP-11 | Gap Map | Severity/heat triage; gap closure raises predicted readiness |
| Unlock testable material by resolving disputes | TRUST-07 | Conflicts | Disputed claims excluded from tests until resolved; resolving unlocks those questions |
| Let verification run overnight against my deadline | VERIFY-05 | Pipeline | Background, closable pipeline; return to a finished lecture |
| Reinforce ahead of schedule | REVIEW-11 | Review | Manual review-ahead of the FSRS schedule |
| Never miss a graded window | NOTIF-06 | Notifications | Checkpoint/test notifications (upcoming, results-ready, attempts-low) |
| Not be locked out mid-track by billing | BILL-16 | Billing | Graceful failed-renewal grace period / dunning |

---

### Returning Power-Learner (LEARNER-POWER)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Clear review debt across the whole portfolio | REVIEW-12, HOME-04 | Review / Dashboard | Cross-topic due aggregation; next-action prioritization |
| Stay well-calibrated | REVIEW-05, ANALYTICS-06 | Reveal / Progress | Committed-confidence vs. actual-recall comparison; per-topic direction of miscalibration |
| Catch blind spots before tests do | REVIEW-06, ANALYTICS-07 | Review / Progress | Seeded "spot the error" drills (Skeptic-generated plausible-wrong variants); blind-spot signal |
| Know which topics are decaying | ANALYTICS-03 | Progress (By-topic) | Per-topic retention/transfer/calibration/verified-coverage table |
| Tune the machine to my life | REVIEW-13, SETTINGS-10 | Settings → Review | Configurable target retention, daily limit, max interval, gate/drill toggles |
| Survive a backlog after time away | REVIEW-19 | Review | Humane load-shedding, not an all-or-nothing avalanche |
| Triage every open dispute by importance | TRUST-06 | global Conflicts | Cross-topic Conflicts inbox |
| Spend limited time on the hottest misconceptions | GAP-12 | Gap Map | Heat-sorted cross-topic gap board |
| Jump to any topic instantly | HOME-06 | Dashboard | Topic name/subject search with typeahead |
| Clear task debt in one place | TASK-08 | My Tasks | Cross-topic task aggregation |
| Review one-handed on a commute | A11Y-13 | Mobile Review | Large-target confidence/rating controls |
| Not be drowned by notifications | NOTIF-21 | Notifications | Batching, frequency caps, quiet hours |

---

### Skeptical / Expert Learner (LEARNER-SKEPTIC)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Apply maximum scrutiny to my topics | VERIFY-14, LEARN-14 | Pipeline / Lecture | Hard-mode Skeptic (denser, more aggressive flags); Pro/Teams-gated |
| See at a glance what's unsupported | TRUST-04 | Sources | claims×sources coverage matrix; empty rows called out; coverage-health figure |
| Audit the basis for every statement | LEARN-03 | Lecture side-rail | Per-claim evidence/source/confidence drill-down |
| Contest an over-reaching tag | LEARN-12, TASK-11 | Conflicts | Raise a claim (or a grade/rubric criterion) to a Conflict; never self-certify |
| Shore up a gap I found | TRUST-09, VERIFY-17 | Sources | Attach a source to an Unsupported claim → triggers re-verification of affected claims |
| Preserve genuine disagreement honestly | TRUST-10, LEARN-13 | Conflicts / Lecture | Interpretive state maps competing positions rather than picking a winner |
| Correct a stale decision | TRUST-13, GAP-21 | Conflicts | Reopen a resolved conflict on new evidence; reopens the linked gap |
| Get strong pushback into the canon | COMM-05, COMM-06 | Community / Thread | Anchored sourced dispute feeds a Conflict; nominate reply for SME promotion |
| Escalate a review card I believe is wrong | REVIEW-08 | Discuss | Skeptic discussion thread with sourced pushback |
| Find every weak claim in my library | HOME-07 | Dashboard | Search claims by trust state across topics |
| Trust that no verdict was bought | BILL-21 | Upgrade | Paid tiers buy verification *thoroughness* only — never a better trust state |

---

### Team Seat Learner (LEARNER-TEAM)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Start inside my org's curated library | AUTH-14, HOME-14 | Invite acceptance / Dashboard | Invite→seat bind (one seat/ceiling), JIT provisioning, shared-library landing (not empty New Topic) |
| Inherit audited trust without re-verifying | LEARN-23 | Lecture | Read-only inherited trust states; still clickable to inspect |
| Contribute my misses to the team | TASK-23, REVIEW-24 | Tasks / Review / Gap Map | Shared-library task/review loop; wrong-ideas feed shared gaps |
| Track my own weak spots privately | GAP-15 | Gap Map | Personal gaps coexisting with inherited read-only trust |
| Benefit from the ledger without corrupting it | TRUST-14 | Conflicts | See/discuss shared conflicts+coverage; blocked from any trust-state write |
| Debate the shared material with my cohort | COMM-15 | Community | Tenant-scoped threads on shared library |
| Use my work identity | AUTH-13 | Auth (SSO) | SAML/OIDC sign-in; org-managed profile fields; one tenant scope |
| Keep a calibration dip off a manager's dashboard | ANALYTICS-13 | Progress / Settings | Per-learner signals hidden unless org visibility policy explicitly exposes them |
| Not be confused by controls I can't change | SETTINGS-07 | Settings | Org-governed plan/privacy controls surfaced read-only |
| Stay usable on a phone for audit surfaces | A11Y-16 | Mobile | Coverage matrix / Gap Map degrade to a usable mobile view |

---

### Instructor / Educator (INSTRUCTOR)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Vet a machine-verified topic before assigning | VERIFY-23 | Pipeline / Topic Workspace | Review trust bar + coverage at governance level; no power to alter trust states |
| Never push contested content onto a cohort | ORG-18 | Assignment | Hard gate: cannot assign/publish a topic with an unresolved Disputed claim |
| Give learners a clear verified curriculum | ORG-08 | Assignment | Cohort/individual topic assignment with optional due date |
| Find where the cohort is actually weak | ANALYTICS-10, EVENT-12 | Progress (cohort) | Aggregated four honest signals; read-only, no signal editing |
| Reach an at-risk individual within policy | ANALYTICS-11 | Progress | Policy-gated drill from aggregate to per-learner signals |
| Close a gap the whole class shares | GAP-14 | Gap Map (aggregate) | Read-only cohort misconception aggregate |
| Read pass-rate/readiness without writing scores | TEST-14 | Tests | Cohort test assignment + distribution; no score-set, no trust change |
| See where material is weak without altering trust | TRUST-15 | Sources / Conflicts | Read-only coverage + open-conflicts audit; pedagogical/epistemic firewall |
| Endorse a model answer | TASK-18 | Tasks | Instructor endorsement layered on the ledger; never changes trust state |
| Launch from and grade back to my LMS | API-11, API-13, API-14 | Integrations | LTI 1.3 launch + roster sync; AGS grade passback with retry/reconcile |
| Direct learners and spot struggle | NOTIF-13 | Notifications | Assignment nudges + cohort weak-spot digests within visibility policy |

---

### Subject-Matter Expert / Content Reviewer (SME-REVIEWER)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Set defensible trust states authoritatively | TRUST-08 | Conflicts | Human epistemic write authority (all five states), topic-scoped, evidence-attached |
| Close coverage gaps without faking sourcing | VERIFY-17 | Sources | Attach a real reference or explicitly mark Unsupported; triggers re-verification |
| Convert strong pushback into permanent sources | TRUST-12, COMM-07 | Community promotion queue / Sources | Intake of flagged replies; citation check; promote with attribution; upgrade linked claim |
| Keep grading honest | TASK-12 | Tasks | Adjudicate disputed grades; correct/retire a rubric criterion whose source is wrong |
| Never let a credential outlive its truth | TEST-13 | Tests / Certificates | Downgrading a claim flags every dependent test and certificate (revocation integrity) |
| Stop learners reviewing a retracted claim | REVIEW-16 | Review | Auto-suspend + reschedule a card when its claim's trust state changes |
| Certify live-event output through the proper path | EVENT-13 | Events | Receive and adjudicate Conflicts/promotions raised live |
| Never clobber another reviewer's adjudication | TRUST-20 | Conflicts | Optimistic-concurrency / safe handling of concurrent resolutions |
| Keep pace with what the spine surfaces | NOTIF-12 | Notifications | Work-queue of conflicts, coverage gaps, promotion requests |

---

### Community Moderator (COMMUNITY-MOD)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Triage what's reported or auto-flagged | ADMIN-08 | Community / Mod queue | Report + auto-flag intake queue |
| Keep the space a verification space, not a forum | COMM-11, ADMIN-09 | Community | Retag/merge/close to keep threads anchored; enforce cite-your-source conduct |
| Route strong replies toward the canon | ADMIN-10 | Community | Flag reply for SME promotion; firewalled from certifying it |
| Keep the leaderboard honest | ADMIN-11 | Community | Detect local vote manipulation/self-promotion; void local votes |
| Protect the good-faith skeptic | ADMIN-12 | Community | Shield harsh-but-valid pushback from removal-by-mass-report |
| Make moderation scalable | COMM-20 | Community | User-driven flag action on abusive/off-topic/uncited replies |
| Keep governance accountable | COMM-24 | Community | Audit trail of every moderation/integrity action; reversible |

---

### Community Contributor (CONTRIBUTOR)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Meet the cite-your-source bar | COMM-03 | Thread | Reply that carries a citation |
| Attach debate to the exact thing in question | COMM-02 | Community | Thread anchored to a claim/source/topic |
| Turn my best argument into durable content | COMM-06, COMM-08 | Thread / Profile | Promotion nomination into SME queue; durable attribution credit on promotion |
| Win a dispute I raise | COMM-05 | Thread / Conflicts | Sourced dispute feeds/strengthens a Conflict for SME adjudication |
| Surface quality on merit | COMM-09 | Thread | Upvote |
| Feel the payoff of contributing | NOTIF-11 | Notifications | Reply/mention/promotion notifications |
| Not lose a long cited reply to a network blip | COMM-17 | Thread | Draft persistence across network drop/offline |
| Understand a promotion outcome, not watch it vanish | COMM-23 | Thread | Graceful handling when the anchored claim resolves/deletes mid-request |
| Recover from a false-positive integrity sweep | ADMIN-22 | Support / Appeal | Appeal + reinstatement of honestly-earned standing |

---

### Event Host / Facilitator (EVENT-HOST)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Supply events learners can discover | EVENT-08 | Events | Create/schedule with type, time, capacity, format, linked topic |
| Show the trust ledger being built live | EVENT-06 | Events (live claim-check) | Live decompose→source→red-team surfacing |
| Never let live value evaporate | EVENT-09, COMM-21 | Events | Route live disputes→Conflicts, misconceptions→Gap Map, strong answers→SME promotion |
| Keep live answers honest | EVENT-23 | Events (AMA/Talk) | Off-the-cuff answers labelled uncertified until sourced + SME-reviewed |
| Move the Retention signal socially | EVENT-10 | Events / Challenge | Retention challenge against real FSRS data; streak/leaderboard |
| Hold attendance and handle changes | NOTIF-14, EVENT-17 | Notifications / Events | Registration confirmations, reminders, cancel/reschedule make-whole broadcasts |
| Restore a streak lost to an outage fairly | EVENT-19 | Events | Restore path that respects the anti-fabrication firewall |
| Keep a cohort's live activity internal | EVENT-16 | Events | Tenant-only private events over the shared library |

---

### Organization / Teams Admin (ORG-ADMIN)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Go from empty tenant to invited learners | ORG-01 | Admin console | Guided first-run after Teams plan active |
| Fill seats fast | ORG-02, ORG-19 | Admin / Invites | Bulk invite by paste/upload; partial-success on bad rows, no double-consume |
| Manage the org at a glance | ORG-03, ORG-04 | Roster | Member status/role/seat/activity; allocate/free seats within ceiling |
| Delegate under least privilege | ORG-06, AUTH-15 | Admin | Assign org roles (Team Learner/Instructor/Event Host/co-admin); audit-logged; no epistemic power |
| Learn only from a curated library | ORG-09, ORG-18 | Library governance / Assignment | Publish clean topics, set publishing rights, archive; hard block on unresolved Disputed claims |
| Balance manager insight vs. learner privacy | ORG-11, ORG-21 | Policy | Explicit auditable progress-visibility + leaderboard policy; DPO constraints for minor/regulated tenants |
| Never oversell or lock out learners | ORG-16, ORG-17 | Seats | Ceiling guardrail with "raise ceiling" path; graceful reconciliation when ceiling drops below filled |
| End access cleanly at offboarding | ORG-14, API-10 | Roster | Deprovision revokes access + explicit data-disposition; earned certs/contributions preserved |
| Prove ROI with earned signals | ORG-12, ANALYTICS-12 | Tenant dashboard | Aggregated honest signals + completion/certificate counts |
| Scale roster from our directory | ORG-15, API-08, API-09 | Integrations | Per-tenant SSO (SAML/OIDC) + SCIM provisioning |
| Guarantee no cross-tenant leak | SEC-03, AUTH-20 | Infrastructure | Hard multi-tenant isolation enforced to the cryptographic layer; fail-closed authorization |
| Pass procurement's security review | SEC-22, SEC-14 | Compliance surface | SOC 2/ISO trajectory, pentest, VDP; self-serve DPA/SCCs/sub-processor/FERPA designation |
| Keep tenant actions accountable | ORG-22 | Admin | Audit log of seat/role/assignment/policy changes |

---

### Billing / Finance Admin (BILLING-ADMIN)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Provision capacity at $9/seat | BILL-13 | Upgrade→Checkout→Success | Team plan checkout + initial seat count |
| Make spend track utilization | BILL-14 | Billing | Raise/lower paid seat ceiling mid-cycle with clear proration |
| Keep money and people authority separate | BILL-15 | Billing | Own the paid ceiling only; blocked from choosing who fills seats or touching content |
| Understand and manage the account | BILL-06, BILL-08, BILL-09 | Plan & billing | Current plan, real usage, payment method, invoice history + downloadable receipts |
| Know exactly what's charged | BILL-04, BILL-10 | Checkout | Monthly/annual toggle; transparent order summary |
| Never lock a learner out on a hiccup | BILL-16 | Billing | Graceful grace period / dunning on failed renewal |
| Meet legal + audit obligations | BILL-19 | Billing | Tax/VAT collection, compliant invoices, financial-record retention/export |
| Stay on top of the account | NOTIF-15 | Notifications | Transactional billing notices (payment failed, invoice ready, seat ceiling reached) |
| Not corrupt the seat pool with two admins | BILL-22 | Billing | Concurrency-safe seat/plan edits |

---

### Support Agent (SUPPORT-AGENT)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Unbreak an account without fabricating a signal | AUTH-17 | Support | Consented, ticket-scoped, time-boxed, audited access; epistemic writes blocked at permission layer |
| Complete a learner's stuck topic | VERIFY-21 | Support / Pipeline | Retry/re-queue a wedged stage; never invent a verification result |
| Restore a genuinely-lost streak/scheduler | REVIEW-21 | Support / Review | Checkpoint restore only; no fabricated retention |
| Restore a wrongly-consumed test attempt | TEST-23 | Support / Tests | Unstick/restore attempt; never fabricate a score or certificate |
| Unstick a hung grading job | TASK-20 | Support / Tasks | Restore wrongly-failed task; firewalled from the learning signal |
| Recover lost gaps or report history | GAP-17, ANALYTICS-16 | Support / Gap Map / Progress | Restore from checkpoint under consent; no signal edit |
| Repair accidental settings/resets | SETTINGS-21 | Support / Settings | Scoped, logged state repair |
| Free reviews trapped on a device | A11Y-22 | Support | Diagnose/recover stuck offline-sync queue |
| Resolve a billing complaint | BILL-17 | Support / Billing | Policy-bounded refund/courtesy credit within 30-day guarantee; no cert/signal touch |

---

### Platform Administrator (PLATFORM-ADMIN)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Start a Teams customer on an isolated footprint | ADMIN-01 | Admin | Tenant provisioning with hard isolation, SSO, seeded admin roles |
| Drain pipeline backpressure before it strands learners | ADMIN-02 | Pipeline ops | Live queue-depth + per-stage health view |
| Run generated code without a breach | ADMIN-03, SEC-18 | Sandbox ops | Isolation, resource + egress limits; untrusted-code security envelope |
| Contain a sandbox escape instantly | ADMIN-06, SEC-21 | Sandbox ops | Kill-switch + containment; cross-tenant/escape forensics runbook |
| Improve the judge without silently re-flagging claims | ADMIN-04 | Model ops | Flagged rollout + shadow run + trust-state-distribution monitoring + rollback |
| Keep authorities from leaking into one account | ADMIN-05, SEC-02 | Admin | Separable-permission role model; audited break-glass; least-privilege RBAC on every write |
| Operate infra without touching truth | VERIFY-20 | Firewall | Privacy-scoped ops; cannot read/alter epistemic content or set a trust state |
| Keep entitlements consistent everywhere | ADMIN-07 | Entitlements | System-level plan-tier catalog feeding paywalls/hard-mode gating |
| Degrade honestly under impairment | ADMIN-23 | Pipeline | Truthful "verification delayed" states; never fabricated/half-verified results |
| Own the offline/sync backend safely | A11Y-23 | Infrastructure | PWA/service-worker + sync rollout under the epistemic-content firewall |
| Surface system health honestly | NOTIF-20 | Notifications | Operational pipeline/sandbox/Skeptic health alerts; no invented learning signal |
| Revoke a leaked credential fail-closed | API-20 | Integrations | Immediate revocable/rotatable API credentials |

---

### Trust & Safety / Ledger Integrity Lead (TRUST-SAFETY-LEAD)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Stop account-level abuse immediately | AUTH-18, ADMIN-16 | Auth / T&S | Freeze/suspend/ban with immediate session invalidation, reason codes, appeal path |
| Catch gaming before it corrupts the ledger | ADMIN-13, ANALYTICS-15, REVIEW-20 | T&S | Anomaly detection over honest signals + reputation (calibration-juking, vote-rings, Conflict-flooding) |
| Contain manipulated content without deciding truth | ADMIN-14, TRUST-19 | T&S | Quarantine/freeze a claim/source/cert pending SME review (freeze-but-not-decide) |
| Never let a fake credential stay valid | ADMIN-15, TEST-15 | Certificates | Platform-wide revocation propagated everywhere the cert is consumed |
| Defend the verifier from adversarial input | ADMIN-17, SEC-19, VERIFY-16 | Pipeline / Skeptic | Prompt-injection + exfiltration defenses; source-hallucination guard so Unsupported can't masquerade as Verified·source |
| Keep promotion un-gameable | TRUST-21, COMM-12 | Community | Vote-ring / coverage-gaming detection on source promotion |
| Void gamed reputation without touching signals | ADMIN-19 | Community | Reputation/leaderboard void firewalled from honest signals |
| Protect good-faith adversarial auditing | ADMIN-18 | T&S | Evidence threshold + appeal built into every integrity action |
| Make the ledger's honesty provable | SEC-16 | Ledger | Tamper-evident audit log + cryptographically integrity-checked trust ledger |
| Stop one credential minting trust | SEC-01 | Auth | Phishing-resistant MFA + step-up mandated for privileged/epistemic-write roles |
| Investigate without evidence being wiped | SETTINGS-22 | Settings | Freeze makes settings read-only and blocks deletion |
| Close the offline replay attack surface | A11Y-21 | Sync | Tamper-resistant reconciliation against device-clock/forged-batch juking |
| Keep out fake identities | AUTH-23 | Auth | Rate-limit, credential-stuffing detection, disposable-email rejection |
| Guarantee no external ledger backdoor | API-21 | Integrations | Every external endpoint structurally read-only against the trust spine |

---

### Compliance / Data-Protection Officer (COMPLIANCE-DPO)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Fulfill access/export/erasure incl. derived data | SETTINGS-14, SEC-08, SEC-09, COMM-19 | Privacy / DSAR | Cascade across ledger/reviews/gaps/community; reconcile with durable promotion attribution; honor legitimate retention |
| Process only on a defensible lawful basis | SETTINGS-12, SEC-07 | Privacy | Consent capture + lawful basis + cookie/ePrivacy layer; anonymous-analytics opt-out |
| Protect the most sensitive data at rest | SEC-04 | Infrastructure | Encryption in transit + at rest with managed key rotation |
| Stop free-text PII leaking to sub-processors | SEC-05, SEC-06 | Inputs / Privacy | Pre-store/pre-send PII scan; sub-processor register with zero-retention/no-train inference |
| Make "we honor retention" auditable | SEC-10 | Data governance | Defined per-class retention schedules + automatic minimization |
| Onboard minors and schools lawfully | SEC-11, SEC-12, SEC-13, SETTINGS-15 | Signup / Privacy | Hard age-gate; verifiable parental consent; FERPA school-official designation |
| Keep regulated data in-region | SEC-15 | Infrastructure | Per-tenant data-region pinning covering storage + inference routing |
| Make certificates survive external validation | TEST-16 | Certificates | Auditable issuance/retention/minor-eligibility trail |
| Constrain what managers may lawfully see | ORG-21 | Policy | Jurisdiction/minor guardrails over the org visibility policy |
| Reconcile retain-for-fraud vs. erase-on-request | ADMIN-21 | Certificates | Explicit disposition when a fraud hold meets a right-to-erasure |
| Govern honest signals as sensitive personal data | ANALYTICS-18, REVIEW-23, TASK-24, GAP-18 | Progress / Review / Tasks / Gap Map | DSAR/retention/deletion reach calibration, FSRS state, free-text answers, gap threads |
| Keep messaging lawful | NOTIF-17 | Notifications | Consent enforcement, transactional/marketing split, minor-safety, history in exports |
| Close legal review without bespoke back-and-forth | SEC-14, SEC-22 | Compliance surface | Self-serve DPA/SCCs/sub-processor/region; security-posture evidence |
| Make automated decisions accountable | SEC-23 | Cross-surface | Transparency + human-review path for rubric grades, readiness, Teams-visible signals |
| Respond to a breach on a statutory clock | SEC-17 | Incident response | Detection, assessment, notification workflow |
| Demonstrate accessibility conformance | A11Y-10 | Compliance | Published accessibility statement + maintained VPAT |

---

### The Skeptic (SKEPTIC-AI)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Flag every claim that over-reaches its evidence | VERIFY-13 | Pipeline (stage 6) | Per-claim challenge + rationale + confidence + *proposed* trust-state change; raises Disputed/Interpretive |
| Apply maximum scrutiny on demand | VERIFY-14, LEARN-14 | Pipeline / Lecture | Hard-mode re-run at tighter thresholds; Pro/Teams-gated |
| Raise disputes but never resolve them | TRUST-02, TRUST-03 | Conflicts | Propose-only; adjudication handed to learner/SME (human disposes) |
| Carry weight in Community without certifying | COMM-04 | Thread | Single "verified answer" marker shown as *sourced*, not *certified* |
| Interrogate a misconception with the learner | GAP-10 | Gap Map / Discuss | Skeptic joins the gap's discussion thread as an adversarial study partner |
| Keep drills calibrated | REVIEW-06 | Review | Generate plausible-but-wrong variants for spot-the-error drills |
| Resist being coerced into blessing garbage | SEC-19, ADMIN-17 | Pipeline | Prompt-injection/poisoned-source resistance on ingested text |
| Stay overridable by design | VERIFY-13 (invariant) | Firewall | Can downgrade-flag only; cannot set Verified or overturn an SME |

---

### Execution Sandbox (EXEC-SANDBOX)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Prove computational claims empirically | VERIFY-12 | Pipeline (Verify stage) | Isolated run of code+assertions; on pass emit Verified·execution with trace + env fingerprint |
| Turn a failed proof into an adjudicable dispute | TRUST-05 | Conflicts | Raise a computational Conflict with a reproducible failing trace + input |
| Refuse rather than fake a pass | TRUST-18 | Ledger | Return "out of scope" / decline cleanly; never a false green; SME cannot force a pass |
| Ground a coding grade in execution | TASK-10 | Tasks | Run learner code + check assertions for "Apply" tasks |
| Demonstrate a proof live | EVENT-25 | Events | Reproducible live run with visible trace |
| Never become a breach | SEC-18, ADMIN-03 | Sandbox | Isolation, no network egress, bounded resources; escape containment |
| Bound any external run-my-code interface | (bounds DEVELOPER-API) | Integrations | Any sanctioned execution endpoint inherits this isolation envelope |

---

### Verification Pipeline (VERIFY-PIPELINE)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Pitch each topic correctly | VERIFY-07 | Pipeline (Triage) | Scope/level/feasibility triage downstream of the creation gate |
| Ground claims in real citable sources | VERIFY-08 | Pipeline (Retrieve) | Source retrieval + attachment for later matching |
| Teach candidly about confidence | VERIFY-09 | Pipeline (Teach) | Prose that flags its own confidence, authored to be claim-by-claim verifiable |
| Produce individually-checkable units | VERIFY-10 | Pipeline (Decompose) | Atomic claim decomposition |
| Assign evidence-grounded draft states | VERIFY-11 | Pipeline (Verify) | Source-match + invoke sandbox → draft Verified·source/Sourced/Unsupported |
| Anchor assessment to the same evidence | TASK-09 | Tasks | Generate tasks + source-derived rubrics from the verified/sourced claim set |
| Never let a fabricated citation pass | VERIFY-16 | Pipeline | Source-hallucination guard; keep Unsupported rows honest, never hidden |
| Fail without shipping unverified content | VERIFY-15 | Pipeline | Recoverable failure state upholding "nothing unchecked is shown" |
| Update trust as review/promotion feeds back | VERIFY-17 | Pipeline / Sources | Re-verify affected claims and refresh the trust bar without re-authoring |
| Show unsupported coverage honestly | TRUST-01, TRUST-04 | Sources | Populate the claims×sources coverage matrix + colored trust bar |
| Refuse weaponized specs | VERIFY-19 | Pipeline (Triage) | Reject unsafe/abusive specs; resist prompt injection at intake |
| Be transparent and non-blocking | VERIFY-04, VERIFY-05, VERIFY-18 | Pipeline | Live per-stage status; background/closable; non-visual progress channel |

---

### Employer / Recruiter (EMPLOYER-VERIFIER)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Confirm a certificate in seconds, no account | TEST-11 | Public verify page | Issued-to, scope, date, ≥75% bar, verified/sourced-only attestation, revocation status |
| Get an unambiguous "no" on a bad cert | TEST-21 | Verify page | Trustworthy negative on forged/stale/revoked |
| Auto-verify at scale in our ATS | TEST-17, API-03 | Integrations | Programmatic endpoint returning authenticity + scope + live revocation |
| Show live status on our careers page | API-15 | Integrations | Embeddable tamper-evident verify widget/badge |
| See deeper signals only with consent | TEST-12, API-05 | Privacy | Learner opt-in share of Reports (calibration/transfer); private data otherwise walled |

---

### Parent / Guardian (GUARDIAN)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Oversee a minor without co-owning their login | AUTH-21, SETTINGS-15 | (Future) guardian model | First-class guardian↔dependent link; oversight without full private-content read — *not built today* |
| Own billing for a dependent | BILL-23 | Billing | Payer≠learner arrangement — *acknowledged gap* |
| Never onboard my child into unlawful collection | SEC-11 | Signup | Hard age-gate blocking under-threshold accounts until verifiable consent |
| Provide lawful consent + hold safety controls | SEC-12 | Privacy | Verifiable parental consent + linked-dependent safety controls |
| See real progress, safely | ANALYTICS-01, HOME-20, GAP-23 | Progress / Dashboard / Gap Map | Honest-signal summary via shared account today; dedicated guardian view is a *known gap* |
| Stay informed of usage and charges | NOTIF-22 | Notifications | Safety + billing notices for a dependent — *future channel* |

---

### Developer / API & Integration Consumer (DEVELOPER-API)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Call VeriLearn instead of scraping | API-01 | Integrations | Register app + obtain scoped API credentials |
| Make any learner-data access consent-bound | API-02 | Integrations | OAuth 2.0 authorization-code (consented reads) + client-credentials (server-to-server) with granular scopes |
| Auto-verify credentials for HR pipelines | API-03 | Integrations | Certificate-verification endpoint (authenticity/scope/live revocation) |
| Render verification data faithfully | API-04, TRUST-17 | Integrations | REST (+GraphQL) read of ledger, five-state breakdown, coverage matrix — five states preserved, not flattened |
| Show earned signals without leaking progress | API-05 | Integrations | Honest-signals read only under explicit consent scope |
| React to changes without polling | API-06, API-07, NOTIF-19 | Integrations / Notifications | Signed webhooks with retry/backoff, de-dup, idempotent-action semantics; cert-revocation/seat events |
| Wire org identity and directory | API-08, API-09, API-10 | Integrations | Per-tenant SSO (SAML/OIDC) + SCIM; deprovision revokes access but preserves earned credentials |
| Build and test safely | API-18, API-19, API-22 | Integrations | Sandbox/test mode with synthetic data; versioning/deprecation + sunset headers; documented rate limits/429 |
| Guarantee I can never mutate the ledger | API-21 | Integrations | Every endpoint structurally read-only against the trust spine |

---

### Accessibility-Reliant Learner (A11Y-LEARNER)

| Goal | User Story (ID) | Feature / Surface | Technical Requirement |
| --- | --- | --- | --- |
| Read every trust state without color | A11Y-01 | Cross-surface | Trust state conveyed by icon + text label, never hue alone (WCAG 1.4.1) |
| Audit *why* a claim is trusted by ear | A11Y-02, LEARN-15 | Lecture side-rail | Screen-reader-readable evidence/source/confidence; focus moves into the rail and back |
| Clear the hard gates by keyboard | A11Y-03, REVIEW-22 | Lecture / Review | Keyboard+SR-operable close gate and confidence gate; no focus trap |
| Not be timed out of a certificate | A11Y-04, TEST-18 | Tests | No countdown-only gate; extended-time accommodation; non-visual timer/progress (WCAG 2.2.1) |
| Read the matrix and gap board non-spatially | A11Y-07, TRUST-16, GAP-16 | Sources / Gap Map | Data-table semantics with headers; empty (Unsupported) cells announced, not conveyed by silence/position |
| Follow verification without motion or color | A11Y-05, VERIFY-18 | Pipeline | Reduced-motion path + text alternative ("Stage 5 of 6: Verify") |
| Use the product at high zoom | A11Y-06 | Cross-surface | Reflow at 200–400% without horizontal scroll (WCAG 1.4.10) |
| Navigate the app shell efficiently | A11Y-08 | App shell | Skip-to-content, visible focus indicator, correct heading/landmark structure |
| Get into the product at all | AUTH-22 | Auth / first-run | Keyboard-operable, SR-labeled auth with accessible challenge alternative |
| Read my progress by ear | ANALYTICS-17 | Progress | Non-visual, non-color equivalents for charts/signals + reduced-motion |
| Perceive that a Conflict was raised | NOTIF-18 | Notifications | Unread state/urgency not encoded in color/emoji/timing alone |
| Join the live layer | A11Y-09, EVENT-21 | Events | Live captions, non-visual claim-check path, challenge accommodations |
| Run the full loop on a phone | A11Y-11, A11Y-12 | Mobile | Responsive loop with bottom-tab shell; claim → bottom-sheet trust details (no hover) |
| Never lose an answer to a drop | A11Y-17, A11Y-19 | Cross-surface | Persistent offline indicator; inline "couldn't save — retry"; offline reviews count and sync |
| Govern my account and data accessibly | SETTINGS-23, COMM-16, TASK-19 | Settings / Community / Tasks | AT-operable sliders/toggles/destructive confirmations; verified-answer marker + rubric legible non-visually |

---

### Orphans

**Orphan features (surface with no anchoring story): none.** Every surface named in the product ground truth traces to at least one user story above — Dashboard/New Topic/Pipeline (HOME-*, VERIFY-*), Topic Workspace Lecture/Tasks/Conflicts/Sources (LEARN-*, TASK-*, TRUST-*), Review/Reveal/Discuss/Session-Complete (REVIEW-*), Tests/Detail/Runner/Results/Retake + certificates (TEST-*), Gap Map (GAP-*), Progress (ANALYTICS-*), My Tasks (TASK-08), Community+Thread (COMM-*, ADMIN-08..12), Events (EVENT-*), Notifications (NOTIF-*), Settings incl. Danger zone (SETTINGS-*), Upgrade→Checkout→Success (BILL-*), Support (AUTH-17, VERIFY-21, TASK-20, REVIEW-21, TEST-23, GAP-17, SETTINGS-21, BILL-17, A11Y-22), and the admin/integration surfaces (ORG-*, ADMIN-*, API-*, SEC-*).

**Orphan stories (persona goal with no shipped feature today): the forward-looking cluster.** These stories carry a real persona goal but deliberately trace to a *future* or *not-yet-built* feature, and the PRD flags them honestly as gaps rather than shipped surfaces:
- **Guardian / minor model** — AUTH-21, HOME-20, GAP-23, BILL-23, SETTINGS-15, NOTIF-22 (no first-class guardian↔dependent link, guardian dashboard, or dedicated notification channel; today only a shared account exists). The *lawful-onboarding* half (SEC-11 age-gate, SEC-12 consent) is anchored to real MVP/Should-Have work; the *oversight* half is the orphan.
- **Directory-based auto-provisioning** — AUTH-16 / API-09 (SCIM 2.0), explicitly "Future," beyond the documented product; the manual invite flow (ORG-02/AUTH-15) covers today's need.
- **Programmatic partner integrations broadly** — much of API-* is prospective (a public API is *implied* by the Teams/cert/LMS needs but not documented), with API-03 (cert verification) the one MVP-anchored exception.

No story in the roster lacks a persona: every domain story is authored in "As a [persona], I want…" form and each maps to a persona in the roster above.

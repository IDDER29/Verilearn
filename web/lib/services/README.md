# `web/lib/services` — the application layer

Services orchestrate the pure [`domain/`](../domain) engines over the [`store/`](../store), and are the layer that routes and server actions call. Everything impure happens here: reading/writing the store, supplying `now` and generated ids, enforcing **ownership** (a user only touches their own data), **RBAC** (privileged actions check `can(role, permission)`), and **archived-topic read-only** guards, and recording to the audit log.

Each `X.ts` has an adjacent `X.test.ts`.

## By concern

**Topic & learning loop**
| File | What it does |
|---|---|
| `topics.ts` | Create a topic (runs the pipeline, enforces the Free-tier cap), list summaries, `activeTopicCount`, cross-topic claim search, the topic view. |
| `workspace.ts` | Assembles the per-topic workspace data (lecture / tasks / conflicts / sources) a topic page needs. |
| `tasks.ts` | The "produce" step: grade a write-in answer against the source-anchored rubric, trust-gated (disputed/unsupported/quarantined claims are ungradeable), feed misses to the gap map. |
| `sources.ts` | Add / prefer / remove a source; removing a claim's sole source fail-closes it to `unsupported` and revokes dependent certificates. |
| `conflicts.ts` | Raise / resolve / reopen a dispute and map interpretive positions — always via the system verifier (firewall-safe); revokes certs on a downgrade. |

**Review & progress**
| File | What it does |
|---|---|
| `review.ts` | The due-card deck (`getDueCards` — the canonical eligibility-gated union), the daily-capped session, FSRS reschedule + calibration + gap auto-reopen. |
| `drills.ts` | Seeded error-drills and the real per-learner blind-spot catch rate. |
| `gaps.ts` | Read model over the gap map. |
| `progress.ts` | The four honest signals + `readinessFor` (wraps `predictReadiness` with the learner's real data). |
| `prefs.ts` | Learner preferences (review settings, reminders, etc.). |

**Prove & credential**
| File | What it does |
|---|---|
| `testsession.ts` | Build a test session, submit + score it, mint a certificate on a pass, track missed claims as gaps. Refuses archived topics. |
| `tests.ts` | The tests-hub read model (`listTestableTopics`). |
| `certificates.ts` | Public verify (`publicVerify`, PII-safe) and the RBAC-gated admin console (list / revoke / reinstate). `prove.test.ts` covers the end-to-end prove loop. |

**Trust & safety / admin**
| File | What it does |
|---|---|
| `quarantine.ts` | T&S claim quarantine (`isQuarantined`) — an override that holds a claim out of eligibility without touching its ledger state. |
| `moderation.ts` | Ban / unban a user (RBAC-gated, reviewer-distinct). |
| `appeals.ts` | Submit a ban appeal (the one unauthenticated state-mutating action) and decide it. |
| `audit.ts` | `recordAudit` (snapshots actor/target labels at write time) + the audit-console read model. |

**Cross-cutting**
| File | What it does |
|---|---|
| `notifications.ts` | The notification feed + read-state, honoring preference toggles. |
| `export.ts` | Data export (DSAR-style). |

## Conventions

- **Ownership first.** Nearly every function takes a `userId` and refuses to touch another user's data.
- **The firewall holds here too.** A service never writes a trust state directly — it calls the domain, which requires a verification event.
- **Prefer snapshots on durable records** — see [ADR-0003](../../../docs/architecture/decisions/0003-snapshot-display-values-on-durable-records.md).

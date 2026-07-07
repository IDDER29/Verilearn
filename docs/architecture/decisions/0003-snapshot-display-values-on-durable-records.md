# ADR-0003 — Snapshot display values on durable records

**Status:** Accepted

## Context

Some records are deliberately kept alive after the things they reference are deleted:

- a **certificate** outlives its topic and even its learner's account — a public verify code must keep resolving, and the admin console must still show who earned it;
- an **audit log entry** outlives the actor and target it names — that's the point of an audit trail;
- a **ban appeal** is kept as moderation history after the account is erased.

The natural-but-wrong implementation resolves the display value *live* at read time — `db.users.get(cert.learnerId)?.displayName`, `db.topics.get(cert.topicId)?.title`. The moment the referent is deleted, that resolves to `undefined` and the record degrades to "Unknown learner" / a blank title / a raw id — exactly on the compliance and verification surfaces where identity matters most.

This exact bug was found and fixed **four separate times** (certificate `topicTitle` and `learnerName`, audit `actorName`/`targetLabel`, appeal `userEmail`/`userDisplayName`) before it was promoted to a rule.

## Decision

A durable record that outlives its referent **snapshots the display values it needs at write time**, onto the record itself. Read models **prefer the snapshot**, falling back to a live lookup only for a hypothetical pre-snapshot record:

```ts
learnerName: cert.learnerName ?? db.users.get(cert.learnerId)?.displayName ?? "Unknown learner"
```

The foreign *id* is still stored (for joins and integrity); only the human-readable *display value* is snapshotted.

## Consequences

**Buys us:**
- Durable records stay legible forever — a certificate names its topic and learner even after both are gone; the audit log survives account erasure.
- The behavior is regression-tested: each fix shipped with a "survives deletion of the referent" test.

**Costs us:**
- A snapshot can go *stale* — if a user renames themselves, an already-written audit entry keeps the old name. For these record types that is **correct** (an audit trail should record who they were *at the time*), but it's a judgment call to make per record, not a blanket rule for all reads.
- Slightly more data on each record, and the write path must remember to capture the snapshot.

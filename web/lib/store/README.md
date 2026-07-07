# `web/lib/store` — entities, seed, and the in-memory repository

The persistence **port**. Today it's an in-memory store seeded on boot; behind the same shape it could become a managed database. It resets every restart, so there are no migrations and every run is a deterministic clean slate — see [ADR-0001](../../../docs/architecture/decisions/0001-ports-and-adapters-with-deterministic-adapters.md).

| File | What it is |
|---|---|
| **`entities.ts`** | The record types the store holds — `User`, `TopicRecord`, `ReviewCardRecord`, `TaskRecord`, `CertificateRecord`, `GapRecord`, `QuarantineRecord`, `Org`, `Session`, and more. These are the persisted shapes (distinct from the pure domain types they mirror). |
| **`db.ts`** | The `Db` interface (all the maps/arrays), `createDb()`, the process-wide singleton `getDb()`, and scoped accessors (`topicsOf`, `reviewCardsOf`, `gapsOf`, `userByEmail`, `ledgerFor`). Also exports `SEED_NOW`, the fixed seed epoch that keeps demo data deterministic. |
| **`seed.ts`** | The deterministic seed: the learner `adeline` (3 topics at the Free cap), two `trust_safety_lead` reviewers, a pre-issued certificate, tasks, gaps, drills, and disputes — all built through the **real** domain functions (e.g. `issueCertificate`), never hand-fabricated records. |
| **`store.test.ts`** | Tests for the store/seed. |

## Notes

- **Seeded accounts** for local dev: `adeline@example.com` / `verilearn` (learner) and `reviewer1@example.com` / `verilearn` (T&S). Full set is in `seed.ts`.
- Because the seed uses the real domain functions, changing a domain signature (e.g. adding a field to `issueCertificate`) means updating `seed.ts` too — the compiler will tell you.
- `SEED_NOW` (a fixed epoch) is why tests and demos are reproducible: nothing here reads the wall clock.

# `docs` — product truth, architecture, and accounting

Everything about *what* VeriLearn is, *why* it's built the way it is, and *where every user story stands*. The app lives in [`../web`](../web); this folder is its written record.

## What's here

| Path | What it is |
|---|---|
| [`architecture/`](./architecture) | **Start here to understand the codebase.** `OVERVIEW.md` (the invariants, layering, data flow) + `decisions/` (ADRs — the load-bearing design decisions). |
| [`PRD.md`](./PRD.md) | The full Product Requirements Document — 462 user stories across a B2C + B2B platform. Assembled from `prd/`. |
| [`prd/`](./prd) | The PRD **source**, split into ~37 sections (personas, per-domain stories, prioritization, traceability, self-review). Editing happens here. |
| [`PRD-DISPOSITIONS.md`](./PRD-DISPOSITIONS.md) | The honest per-story accounting: every story marked **Done / Partial / Deferred** with justification. Assembled from `dispositions/`. |
| [`dispositions/`](./dispositions) | The disposition **source**, one file per domain (20 files). Editing happens here. |
| [`IMPLEMENTATION.md`](./IMPLEMENTATION.md) | The build order, the "screens wired to real data" table, the test count, and a running momentum log of fixes. |
| [`scripts/`](./scripts) | The tooling that assembles `prd/` → `PRD.md` and `dispositions/` → `PRD-DISPOSITIONS.md`. |

## The source → assembled pattern

`PRD.md` and `PRD-DISPOSITIONS.md` are **generated** — don't edit them directly. Edit the per-section source in `prd/` or the per-domain source in `dispositions/`, then regenerate:

```bash
node docs/scripts/assemble-prd.mjs           # prd/*.md          → PRD.md
node docs/scripts/assemble-dispositions.mjs  # dispositions/*.md → PRD-DISPOSITIONS.md
```

## The rule that keeps docs honest

When a code change moves a user story (implements a Partial, closes a Deferred), update that story's row in its `dispositions/<DOMAIN>.md` file and regenerate. The disposition sweep is only valuable if it never drifts from the code — a Done row must point at real, tested behavior.

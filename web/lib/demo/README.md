# `web/lib/demo` — guest (unauthenticated) demo data

Powers the public `/demo` experience: a taste of the product with **no account required**. These modules build read-only, self-contained sample data so a visitor can see the verification pipeline, a lecture, and a conflict without signing in. Kept separate from the real seeded store so guest content can never mutate a real learner's data.

| File | What it is |
|---|---|
| **`pipeline.ts`** | A canned verification-pipeline run (`DEMO_PIPELINE_TOPIC`, `demoPipelineRun`) — shows create → verify with real trust states. |
| **`scenario.ts`** | A demo snapshot (`DEMO_TOPIC`, `demoSnapshot`) — the overall guest scenario. |
| **`workspace.ts`** | Demo workspace data (`demoWorkspaceData`) — a lecture/conflict view for the guest reader. |

Each has an adjacent `*.test.ts`.

## Notes

- Everything here is deterministic and derived from the same domain engines the real app uses, so the demo shows *genuine* behavior, not a mock-up.
- The `/demo` route and its panels (`components/Demo*.tsx`) consume these.

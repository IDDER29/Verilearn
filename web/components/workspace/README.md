# `web/components/workspace` — the per-topic workspace

The tabbed workspace a learner sees inside a topic. `WorkspaceShell` holds the tabs; each tab is its own component, driven by real `WorkspaceData` assembled in `lib/services/workspace.ts`.

| File | Tab / role |
|---|---|
| `WorkspaceShell.tsx` | The container that hosts the tabs and shared topic header. |
| `WorkspaceTabs.tsx` | The tab bar (Lecture / Tasks / Conflicts / Sources). |
| `LectureTab.tsx` | The verified lecture — trust badges, section-trust panel, the disputed-claim callout (driven by real `data.disputedClaims`, not a hardcoded example). |
| `TasksTab.tsx` | The write-in task + rubric grading UI (submit / revise-to-pass), draft persistence, "Dispute this" on a missed criterion. |
| `ConflictsTab.tsx` | Adjudicate a real open dispute: record a resolution (re-verifies via the system verifier) or map interpretive positions. |
| `SourcesTab.tsx` | The coverage matrix (claims × sources) and add / prefer / remove-source actions. |
| `types.ts` | The `WorkspaceData` / `TabKey` shapes shared across the tabs. |

## Notes

- These are client components; they call the `app/*-actions.ts` server actions (`conflict-actions`, `task-actions`, `source-actions`) and `router.refresh()` on success.
- The tabs render **real ledger-derived data** — resolving a conflict here genuinely changes trust state everywhere, because it routes through the system verifier, never a direct write.

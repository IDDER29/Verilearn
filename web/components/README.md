# `web/components` — React UI

Reusable and route-specific React components. Most of the app's *pages* are server components in [`../app`](../app); the pieces here are the shared shells, the interactive (`"use client"`) widgets, and the panels those pages compose. Components render data and call server actions — they don't contain business logic.

## Top-level components

**Shells & navigation**
| Component | Role |
|---|---|
| `AppShell.tsx` | The authenticated app frame (sidebar + main) wrapping most pages. |
| `AuthShell.tsx` | The minimal frame for auth pages (login/signup/appeal). |
| `Sidebar.tsx` | The primary nav, with the active item and role-gated admin entries. |
| `SettingsNav.tsx` | The settings sub-navigation. |

**Interactive widgets**
| Component | Role |
|---|---|
| `DashboardSearch.tsx` | Cross-topic claim/topic search on the Dashboard (HOME-07). |
| `NotificationsFeed.tsx` · `MarkAllReadButton.tsx` | The notifications feed + mark-all-read. |
| `GapBoard.tsx` · `GapCloseButton.tsx` | The gap-map board and per-gap close action. |
| `OfflineBanner.tsx` · `RefreshOnFocus.tsx` | Offline indication and refresh-on-focus behavior. |
| `AppealForm.tsx` | The unauthenticated ban-appeal form. |

**Billing**
`CheckoutPanel.tsx` · `ChooseTopicsPanel.tsx` (downgrade topic-keep picker) · `PlanTiers.tsx` · `UpgradeButton.tsx` · `UpgradeUpsell.tsx`

**Demo (guest)**
`DemoPipelinePanel.tsx` · `DemoLecturePanel.tsx` · `DemoConflictPanel.tsx` — consume [`../lib/demo`](../lib/demo).

## Subfolders

| Folder | What's in it |
|---|---|
| [`workspace/`](./workspace) | The per-topic workspace tabs (lecture / tasks / conflicts / sources) and their shell. |
| [`admin/`](./admin) | The Trust & Safety / admin consoles (certificates, users, quarantine, audit, appeals). |
| [`settings/`](./settings) | Settings panels (profile, sessions). |
| [`community/`](./community) | Community thread controls (vote, share). |
| [`reports/`](./reports) | Progress-report controls. |
| [`review/`](./review) | The review "discuss" panel. |
| [`ui/`](./ui) | Shared UI primitives and design tokens. |

## Conventions

- **`"use client"` only where needed** — anything with state, effects, or event handlers. Everything else stays a server component.
- Components call **server actions** (`app/*-actions.ts`) to mutate; they never write the store directly.
- Design tokens (colors, spacing) come from [`ui/tokens.ts`](./ui) — prefer them over ad-hoc values.

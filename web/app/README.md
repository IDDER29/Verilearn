# `web/app` — routes, server actions, and the delivery layer

The Next.js **App Router** tree. Each folder with a `page.tsx` is a route; server components fetch data by calling [`../lib/services`](../lib/services) directly (no client-side data fetching for the core loop). Mutations go through **server actions** — the `*-actions.ts` files at this level.

> This is delivery only. Business logic lives in `lib/services` → `lib/domain`; pages should read/orchestrate, not decide.

## Root files

| File | What it is |
|---|---|
| `layout.tsx` | The root layout (fonts, global shell) wrapping every page. |
| `page.tsx` | The **Dashboard** (`/`) — the authenticated home. |
| `globals.css` | Global styles / CSS variables. |

## Server actions (`*-actions.ts`)

Colocated `"use server"` modules, one per concern, that pages and components call to mutate state. Each delegates to a service and re-validates. They are the *only* write path from the UI.

`auth` · `topic` · `task` · `source` · `conflict` · `review` · `gap` · `billing` · `prefs` · `profile` · `session` · `notification` · `admin` · `appeal` · `export` · `danger` · `demo`

## Route map

**Auth & onboarding**
`/login` · `/signup` · `/logout` · `/welcome` · `/pricing`

**Home & discovery**
`/` (Dashboard) · `/demo` (public guest experience) · `/support`

**Create a topic**
`/new-topic` (create + Free-tier cap) · `/pipeline` (live verification animation)

**Topic workspace**
`/topics` (lecture) · `/topics/tasks` · `/topics/conflicts` · `/topics/sources`

**Review (retain)**
`/review` · `/review/reveal` · `/review/discuss` · `/review/complete`

**Tests (prove)**
`/tests` (hub) · `/tests/[slug]` (detail) · `/tests/runner` · `/tests/results` · `/tests/retake`

**Reflect**
`/gap-map` · `/reports` (progress signals) · `/my-tasks` · `/conflicts` (cross-topic inbox) · `/notifications`

**Settings**
`/settings` · `/settings/profile` · `/settings/plan` · `/settings/privacy` · `/settings/review` · `/settings/active-listening` · `/settings/sessions` · `/settings/danger` · `/settings/[...rest]` (catch-all)

**Billing**
`/upgrade` · `/upgrade/checkout` · `/upgrade/choose-topics` · `/upgrade/success`

**Admin / Trust & Safety** (RBAC-gated — a non-privileged user sees an honest no-access state)
`/admin/certificates` · `/admin/users` · `/admin/quarantine` · `/admin/audit`

**Public & unauthenticated** (allowlisted in `../proxy.ts`)
`/verify/[code]` (public certificate verify) · `/verify/[code]/badge` (embeddable) · `/appeal` (ban appeal)

**JSON API**
`/api/verify/[code]` (programmatic verify) · `/api/topics/[id]/trust`

**R2/R3 surfaces** (faithful screens; data models seeded lightly or deferred)
`/community` · `/community/[slug]` · `/events` · `/events/[slug]` · `/events/registered`

## Conventions

- **Server components by default.** A page is `async` and awaits services directly. Client components (`"use client"`) are used only where interactivity demands it, and live mostly in [`../components`](../components).
- **Auth gate.** Authenticated pages call `requireUser()` (`lib/auth/current`) which redirects to `/login` if absent; the `proxy.ts` middleware is the coarse outer gate.
- **One file per route folder.** Route folders here hold just their `page.tsx` (occasionally a nested layout), which is why they don't carry individual READMEs — this map is the index.

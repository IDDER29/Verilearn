# `web` — the VeriLearn application

The Next.js 16 (App Router) + React 19 app. This is the product; the repo root holds it alongside `docs/` and `design/`. For the project overview and the *why*, see the [root README](../README.md) and [`../docs/architecture/OVERVIEW.md`](../docs/architecture/OVERVIEW.md).

> ⚠️ **This is not the Next.js you may know** — see [`AGENTS.md`](./AGENTS.md). This version has breaking changes; read the guides under `node_modules/next/dist/docs/` before writing framework code.

## Run it

Requires **Node 22** (pinned in `../.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:3000
```

Seeded logins (in-memory store, resets on restart): `adeline@example.com` / `verilearn` (learner), `reviewer1@example.com` / `verilearn` (Trust & Safety). Full seed in `lib/store/seed.ts`.

## Commands

```bash
npm run lint       # eslint (CI-enforced)
npm test           # vitest — the full suite
npm run test:watch # watch mode
npm run build      # next build
```

## Layout

```
web/
├── app/            routes, server actions, delivery layer   → app/README.md
├── components/     React UI (shells, widgets, panels)       → components/README.md
├── lib/            the brain — domain / services / store…   → lib/README.md
│   ├── domain/       pure, unit-tested engines (the thesis) → lib/domain/README.md
│   ├── services/     application layer over domain + store  → lib/services/README.md
│   ├── store/        entities, seed, in-memory repository    → lib/store/README.md
│   ├── auth/         passwords, sessions, age gate           → lib/auth/README.md
│   ├── demo/         guest (unauthenticated) demo data       → lib/demo/README.md
│   └── content/      static curated content                 → lib/content/README.md
├── public/         static assets                            → public/README.md
├── proxy.ts        route middleware (the coarse auth gate + public allowlist)
├── AGENTS.md       framework caveats — read before writing Next.js code
└── (config)        next.config.ts, tsconfig.json, eslint.config.mjs,
                    vitest.config.ts, postcss.config.mjs, package.json
```

Each folder above has its own README going a level deeper. Start with [`lib/README.md`](./lib/README.md) to understand the architecture, or [`app/README.md`](./app/README.md) for the route map.

## Config files

| File | Purpose |
|---|---|
| `next.config.ts` | Next.js configuration. |
| `tsconfig.json` | TypeScript config (path aliases like `@/lib/...`). |
| `eslint.config.mjs` | ESLint flat config. |
| `vitest.config.ts` | Test runner config. |
| `postcss.config.mjs` | PostCSS. |
| `proxy.ts` | Middleware: redirects unauthenticated visitors to `/login`, allowlisting public routes (`/verify/*`, `/appeal`, `/demo`, auth pages). Covered by `proxy.test.ts`. |
| `AGENTS.md` / `CLAUDE.md` | Guidance for AI coding agents (the Next.js-version caveat). |

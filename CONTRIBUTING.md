# Contributing to VeriLearn

Thanks for working on VeriLearn. This project has one non-negotiable value — **nothing is presented as true until it survives verification** — and the same standard applies to the code: a change isn't done until you've *watched it work*, not just watched a test go green.

## Setup

Requires **Node 22** (pinned in `.nvmrc`).

```bash
nvm use            # or install Node 22 some other way
cd web
npm install
npm run dev        # http://localhost:3000
```

The store is in-memory and seeded on boot, so every restart is a clean slate. Sign in with a seeded account:

| Account | Password | Role |
|---|---|---|
| `adeline@example.com` | `verilearn` | Learner (Free plan) |
| `reviewer1@example.com` | `verilearn` | Trust & Safety reviewer |

## The loop for any change

All commands run from `web/`:

```bash
npm run lint       # eslint — must be clean (CI fails on any error)
npm test           # vitest — the full suite
npm run build      # next build — must be green
```

Then **exercise the actual flow** the change touches. If you fixed task grading, grade a task; if you touched the verify page, load a real verify code. The test suite is necessary, not sufficient — several bugs in this codebase's history were things all tests passed through.

CI (`.github/workflows/ci.yml`) runs lint → test → build on every push and PR. Keep it green.

## Conventions

- **The epistemic firewall is sacred.** No user, admin, or platform-root role may *set* a trust state — trust states are only ever produced by verification events. If a change appears to need a human to set trust, it's the wrong shape. See `docs/architecture/OVERVIEW.md`.
- **Fail closed.** Absence of a positive signal is a negative result — a claim whose evidence won't load never renders as `Verified`.
- **Snapshot, don't live-resolve, on durable records.** A record that outlives its referent (a certificate after its topic is deleted, an audit entry after the actor is erased) must snapshot the display value at write time, not resolve it live at read time.
- **Keep the docs honest.** Every user story is tracked in `docs/PRD-DISPOSITIONS.md` as Done / Partial / Deferred with justification. If your change moves a story, update its per-domain file in `docs/dispositions/` and regenerate (`node docs/scripts/assemble-dispositions.mjs`). Don't let the docs drift from the code.

## Commits & branches

- Work on a branch; open a PR against `main`. The PR template asks what changed and *how you verified it* — fill it in honestly.
- Write commit messages that explain the **problem, root cause, and fix** — not just "fix bug." Look at recent history for the house style.

## Where things live

See `README.md` for the repo map and `docs/architecture/OVERVIEW.md` for how the pieces fit together and why.

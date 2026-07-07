# Production Readiness

An honest accounting of what it takes to run VeriLearn in production, what is already production-grade, and what is deliberately deferred behind a clean seam. Read alongside [`architecture/OVERVIEW.md`](./architecture/OVERVIEW.md) and the ADRs.

## What "production-ready" means here

The **application layer is production-grade**: the domain logic is pure and exhaustively tested, the delivery layer is hardened, and the security posture is sound. What is **not** wired is the set of capabilities that require an external vendor or managed infrastructure — these run today on deterministic in-process adapters (see [ADR-0001](./architecture/decisions/0001-ports-and-adapters-with-deterministic-adapters.md)). Going live means **swapping those adapters**, each at a seam that already exists — not rewriting the app.

So: you can deploy this today and it will run, authenticate, and enforce its trust guarantees — but it will lose all data on restart (in-memory store) and its "verification" is deterministic rather than a real LLM. The list below is the honest gap between "runs" and "serves real users durably."

## ✅ Already production-grade

| Area | Status |
|---|---|
| **Test coverage** | ~500 tests across the domain + service layers; CI runs lint + test + build on every push/PR (`.github/workflows/ci.yml`). |
| **Auth** | scrypt password hashing; HMAC-signed session cookies with `httpOnly` + `sameSite=lax` + `secure` (prod) + `path=/`; failed-login lockout/backoff; COPPA age gate; banned-account sign-in refusal. |
| **Secret handling** | `sessionSecret()` **fails closed** in production — refuses the insecure dev default, so a missing `VERILEARN_SESSION_SECRET` is a loud boot failure, not a silent hole. |
| **HTTP hardening** | CSP locked to `'self'`, `frame-ancestors 'none'`, `object-src 'none'`, `base-uri`/`form-action 'self'`, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, and HSTS in production. One narrow, documented framing carve-out for the embeddable verify badge (carries no PII). |
| **Authorization** | Ownership scoping on every learner action; RBAC (`can(role, permission)`) on every admin action; the epistemic firewall (no human role can set a trust state) enforced by types + tests. |
| **Resilience surfaces** | Branded 404 (`not-found`), route + root error boundaries (`error`/`global-error`), and a `/api/health` liveness+readiness probe. |
| **PII discipline** | The public verify surface is PII-safe by construction; durable records snapshot display values so erased accounts don't leak or degrade ([ADR-0003](./architecture/decisions/0003-snapshot-display-values-on-durable-records.md)). |
| **Middleware gate** | Coarse auth redirect with an explicit public allowlist (health/robots/verify/auth pages); defense-in-depth behind per-page `requireUser()`. |

## ⛔ Required before a real launch (vendor / infra swaps)

Each attaches to an existing seam; none is a rewrite.

| Capability | Today | Needed | Attach point |
|---|---|---|---|
| **Persistence** | in-memory, resets on restart | managed Postgres (or similar) | the store port (`lib/store/db.ts`) — `DATABASE_URL` |
| **Session secret** | required in prod (fails closed) | set a real 32-byte secret | `VERILEARN_SESSION_SECRET` |
| **Claim verification** | deterministic rule-based adapter | real LLM verifier / Skeptic | the Verifier port (`lib/domain/pipeline.ts`) — `LLM_API_KEY` |
| **Execution grading** | deterministic assertion runner | sandboxed VM/container | same Verifier seam |
| **Billing** | deterministic entitlement engine + mock checkout | Stripe | `billing-actions` / entitlements — `STRIPE_SECRET_KEY` |
| **Email** | none | transactional email (verification, reminders) | notifications service — `SMTP_*` / `EMAIL_API_KEY` |
| **Enterprise identity** | interfaces defined | SSO / SCIM / LTI | auth layer — `OIDC_*` / `SAML_*` |
| **Rate limiting** | per-process login lockout only | shared/distributed limiter | needs shared state (Redis) once multi-instance |

## Deploy runbook

1. **Provision the secret.** `export VERILEARN_SESSION_SECRET="$(openssl rand -hex 32)"`. Without it, the production server refuses to sign sessions (by design). See [`.env.example`](../.env.example).
2. **Build & start** (from `web/`): `npm ci && npm run build && npm run start`. `next start` sets `NODE_ENV=production`, which activates HSTS and the fail-closed secret check.
3. **Terminate TLS in front of the app** (HSTS assumes HTTPS).
4. **Wire the health check.** Point your uptime monitor / orchestrator liveness+readiness probe at `GET /api/health` (unauthenticated; `200` healthy, `503` if the data layer faults).
5. **Data is ephemeral until the DB adapter lands** — do not treat the in-memory store as durable.

## Known limitations / non-goals for this build

- **No durability** without the DB adapter — every restart re-seeds a clean demo store.
- **Verification is deterministic**, not a real skeptic — it validates the *pipeline and trust propagation*, not genuine semantic correctness.
- **Single-process assumptions** — the login lockout and any in-memory rate limiting are per-instance; horizontal scaling needs shared state.
- **Community/Events** are lightly-seeded R2/R3 surfaces, faithful but not backed by full data models.
- **Accessibility** foundations are in place (`lang`, landmark `<main>`/`<nav>`, a skip link, accessible names on controls), but page titles are styled `<div>`s rather than semantic `<h1>`/heading hierarchy — a screen-reader heading-navigation improvement tracked in the `A11Y` dispositions, deferred here to avoid a broad style-risking refactor.

Per-story detail for everything above lives in [`PRD-DISPOSITIONS.md`](./PRD-DISPOSITIONS.md) (Done / Partial / Deferred, with justification).

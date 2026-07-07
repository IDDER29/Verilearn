# `web/lib/auth` — authentication & identity

Password auth with signed-cookie sessions. No external identity vendor yet (SSO/MFA are deferred); the seams are clean so one can be added later.

| File | What it is |
|---|---|
| **`password.ts`** | Password hashing + verification using **scrypt** (salted, constant-time compare). Never stores a plaintext password. |
| **`session.ts`** | Session tokens signed with **HMAC**, and the session cookie read/write helpers. A tampered or expired token fails closed. |
| **`service.ts`** | `authenticate()` / `signIn()` — the credential-check flow, including the failed-attempt **lockout/backoff** (AUTH-06/AUTH-23) and the **banned-account** refusal (a banned user fails sign-in with a distinct "suspended" message, not a silent password error). |
| **`current.ts`** | `getCurrentUser()` (nullable) and `requireUser()` (redirects to login if absent) — how routes and server actions get the signed-in user. |
| **`age.ts`** | The **COPPA age gate** — under-13 signups are blocked pending consent. |
| **`auth.test.ts`** | Tests for the whole flow (hashing, sessions, lockout, age gate). |

## How it connects

- The route middleware (`web/proxy.ts`) is the coarse gate that redirects unauthenticated visitors to `/login`, allowlisting the genuinely public routes (`/verify/*`, `/appeal`, `/demo`, auth pages).
- Ban enforcement lives partly here (sign-in refusal) and partly in `services/moderation.ts` (the ban action itself, which also kills every live session).

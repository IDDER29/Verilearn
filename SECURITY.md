# Security Policy

## Reporting a vulnerability

If you find a security issue, **please do not open a public issue or PR.** Report it privately so it can be fixed before disclosure:

- Use GitHub's **[Report a vulnerability](https://github.com/IDDER29/Verilearn/security/advisories/new)** (Security → Advisories), or
- Contact the repository owner directly.

Please include what you found, how to reproduce it, and the impact you believe it has. You'll get an acknowledgement, and we'll keep you updated as it's triaged and fixed.

## Scope notes

This project models a large platform but currently runs on an **in-memory store** with a **deterministic verification adapter**; production-grade concerns (managed database, KMS/encryption at rest, real payment processing, SSO) are deferred behind clean interfaces and documented in `docs/IMPLEMENTATION.md`. Reports about the *architecture* of those seams are welcome even though the production adapters aren't wired.

The one invariant worth breaking if you can: the **epistemic firewall** — any path that lets a user, admin, or platform-root role directly *set* a claim's trust state (rather than it being produced by a verification event) is a security-relevant bug, not just a logic one.

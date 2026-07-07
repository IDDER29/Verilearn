# `docs/dispositions` — per-story build accounting (source)

One file per product domain, each a table that marks **every** user story in that domain as **✅ Done**, **🟡 Partial**, or **⏭️ Deferred** — with the evidence or justification in the row. These files are the *source*; [`../scripts/assemble-dispositions.mjs`](../scripts/assemble-dispositions.mjs) assembles them (plus a roll-up count) into [`../PRD-DISPOSITIONS.md`](../PRD-DISPOSITIONS.md).

> Edit the domain files here; **don't** edit the assembled `PRD-DISPOSITIONS.md` — it's regenerated. After an edit, run the assemble script.

## The 20 domains

`AUTH` · `HOME` · `VERIFY` · `LEARN` · `TASK` · `TRUST` · `REVIEW` · `GAP` · `TEST` · `COMM` · `EVENT` · `NOTIF` · `ANALYTICS` · `SETTINGS` · `BILL` · `ORG` · `ADMIN` · `A11Y` · `API` · `SEC`

(The roll-up order and per-domain counts are defined in the assemble script.)

## What each status means

- **✅ Done** — core behavior implemented and covered by a test, or genuinely wired to real data in the app. A Done row must point at real behavior, not intent.
- **🟡 Partial** — meaningfully implemented but incomplete (engine done, UI not wired; a faithful screen without its backend; happy-path only). The row says exactly what's missing.
- **⏭️ Deferred** — correct by design but needs external infra, a vendor, or a business decision not available in this build (real LLM, KMS, Stripe, SSO/LTI, email, managed DB). Where a seam exists, the adapter interface is already in place.

## The discipline

This sweep is only worth anything if it stays honest. When a code change moves a story, update its row **here** and regenerate — and be willing to *demote* a row from Done to Partial if a closer look shows the claim was overstated (that has happened, and correcting it is the point). Rows frequently cite the specific file/line and a live-verification note.

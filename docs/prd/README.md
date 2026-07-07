# `docs/prd` — the PRD source

The Product Requirements Document, split into sections so it's editable in pieces. Files are assembled **in lexical order** (hence the numeric prefixes) into [`../PRD.md`](../PRD.md) by [`../scripts/assemble-prd.mjs`](../scripts/assemble-prd.mjs), which also generates the table of contents from each section's `##` heading.

> Edit the section files here; **don't** edit the assembled `PRD.md` directly — it's regenerated.

## Sections

**Front matter** — `01-exec-summary` · `02-assumptions` · `05-overview`

**Personas** — `10-learners` · `11-educators` · `12-org-admin` · `13-system-special`

**Per-domain user stories** (the bulk) —
`20-auth` · `21-home-discovery` · `22-topic-pipeline` · `23-lecture` · `24-tasks` · `25-conflicts-trust` · `26-review-fsrs` · `27-gap-map` · `28-tests-certs` · `29-community` · `30-events` · `31-notifications` · `32-analytics` · `33-settings-privacy` · `34-billing` · `35-org-admin` · `36-platform-admin` · `37-accessibility-mobile` · `38-integrations-api` · `39-security-compliance`

**Prioritization & traceability** — `40-prioritization` · `45-traceability`

**Adversarial gap analysis** (seven lenses) — `50-learning-science` · `51-engagement` · `52-integrity` · `53-ai-safety` · `54-security-privacy` · `55-business` · `56-scale-tech`

**Self-review** — `90-completeness-review`

## Naming

The numeric prefix sets assembly order and groups related sections (10s = personas, 20s–30s = domains, 40s = prioritization, 50s = gaps, 90 = review). Keep new sections in the right band. Each domain here has a matching disposition file in [`../dispositions/`](../dispositions) tracking its build status.

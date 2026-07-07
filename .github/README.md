# `.github` — GitHub project configuration

Configuration GitHub reads automatically — CI and the templates contributors see.

| Path | What it is |
|---|---|
| `workflows/ci.yml` | The **CI pipeline**: on every push to `main` and every pull request, it runs `npm run lint` → `npm test` → `npm run build` from `web/` on Node 22 (read from `../.nvmrc`). All three must pass for the check to be green. See the run history under the repo's **Actions** tab. |
| `pull_request_template.md` | Pre-fills the PR description — prompts for *what/why* and *how it was verified* (not just "tests pass"), with a lint/test/build/exercised checklist. |
| `ISSUE_TEMPLATE/bug_report.md` | The bug-report form (two-surfaces-disagree framing, seeded accounts, story ID). |
| `ISSUE_TEMPLATE/feature_request.md` | The feature-request form (tie to a PRD story; note deferred infra). |

## Changing CI

Edit `workflows/ci.yml`. The job runs with `working-directory: web`, so all steps are relative to the app. If a step needs a different Node version, change `../.nvmrc` (the single source of truth) rather than hard-coding it here.

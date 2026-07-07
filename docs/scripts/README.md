# `docs/scripts` — documentation tooling

Small Node scripts (no dependencies, run with plain `node`) that assemble the split doc sources into their single-file roll-ups. Run them from the repo root after editing the sources.

| Script | Reads | Writes |
|---|---|---|
| `assemble-prd.mjs` | `docs/prd/*.md` (lexical order) | `docs/PRD.md` (with a generated TOC) |
| `assemble-dispositions.mjs` | `docs/dispositions/*.md` | `docs/PRD-DISPOSITIONS.md` (with a roll-up count) |

```bash
node docs/scripts/assemble-prd.mjs
node docs/scripts/assemble-dispositions.mjs
```

## Notes

- Paths are resolved relative to the script via `import.meta.url` (`../prd/`, `../dispositions/`, `../PRD.md`), so the scripts must stay in `docs/scripts/` for those relative paths to hold.
- The roll-up domain order and per-domain story counts for the dispositions are defined as a table inside `assemble-dispositions.mjs`.
- Both are pure text assembly — deterministic, no network, safe to run any time. If the output diff is empty, nothing drifted.

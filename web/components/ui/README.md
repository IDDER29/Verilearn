# `web/components/ui` — shared UI primitives & design tokens

The small shared building blocks and the design vocabulary the rest of the UI draws from.

| File | What it is |
|---|---|
| `tokens.ts` | Design tokens — the canonical colors, spacing, and typographic values. Prefer these over hard-coded hex/px so the UI stays consistent (and re-themable in one place). |
| `index.tsx` | Shared UI primitives / helpers exported for reuse across components. |

If you're about to write an inline color or spacing value in a component, check here first — it probably already exists as a token.

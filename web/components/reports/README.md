# `web/components/reports` — progress-report controls

Interactive controls for the `/reports` progress page (the rest of which renders server-side from the honest signals in `lib/services/progress.ts`).

| File | What it is |
|---|---|
| `WeeksSelect.tsx` | The keyboard-operable trend-window selector (ANALYTICS-17) — replaced a decorative button; drives the real 7-day-vs-window delta. |

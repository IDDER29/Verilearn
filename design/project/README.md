# `design/project` — the HTML design prototypes

The `Verilearn prototype v2` export: one self-contained `.dc.html` file per screen, the visual target for the real app. **Frozen reference** — not built, not tested, not imported by `web/`.

## What's here

- **`VeriLearn *.dc.html`** — one prototype per screen. The set spans the whole product: Dashboard, New Topic, Pipeline, Topic Workspace, Conflicts, Sources, Tasks, Review (+ Reveal), Session Complete, Tests (Detail / Runner / Results / Retake), Gap Map, Progress, Notifications, Community (+ Thread), Events (+ Detail / Registered), Settings (Profile / Plan / Privacy / Review / Active Listening / Danger), Upgrade (+ Checkout / Success), Verify & Trust, Create & Onboard, plus flow storyboards, screen maps, and empty/error-state catalogs.
- **`support.js`** — shared script used by the prototypes.
- **`.thumbnail`** — the project thumbnail.
- [`uploads/`](./uploads) — images pasted into the design tool and a combined prototype HTML.

## Using it

Open a `.dc.html` file to see a screen's intended layout, colors, and copy. Everything needed to reimplement is in the HTML/CSS source — read it directly rather than rendering it. Match the visual output; don't mirror the internal markup structure in the React code.

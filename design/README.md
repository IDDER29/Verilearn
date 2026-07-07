# `design` — historical design artifacts (frozen reference)

The app in [`../web`](../web) was implemented from an HTML/CSS/JS design prototype and the design-tool conversation that produced it. Both are preserved here for reference. **This is a frozen archive, not living code** — nothing in `web/` imports from it, and it isn't built or tested.

| Folder | What it is |
|---|---|
| [`project/`](./project) | The original **HTML prototypes** — one `.dc.html` file per screen (Dashboard, Tests, Conflicts, …), plus shared assets. The *visual* target the app was built to match. |
| [`chats/`](./chats) | The **design-tool transcript(s)** — the back-and-forth that captured what the user actually wanted and where they landed. |

## Why keep it

The prototypes and chat are the record of *design intent*. When a question comes up about how a screen was meant to look or behave, this is the source. But the production code deliberately **does not** copy the prototypes' internal structure — it recreates the visual output in React/Next.js. Treat these as a picture to match, not code to port.

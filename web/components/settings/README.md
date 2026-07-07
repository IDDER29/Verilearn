# `web/components/settings` — settings panels

Client components behind the `/settings/*` routes that need interactivity.

| File | Panel |
|---|---|
| `ProfileForm.tsx` | Edit display name / profile, with a real dirty-state navigation guard (SETTINGS-20) so unsaved edits aren't silently lost. |
| `SessionsPanel.tsx` | View and revoke active sessions/devices. |

Both call the corresponding `app/*-actions.ts` (`profile-actions`, `session-actions`). Static settings pages (privacy, review preferences, etc.) render server-side without a component here.

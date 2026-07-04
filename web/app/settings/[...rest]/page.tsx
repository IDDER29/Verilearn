import { redirect } from "next/navigation";

/**
 * Any unknown /settings/* sub-path redirects to the Settings home rather than
 * hitting the default 404 (SETTINGS-01) — a mistyped or stale settings deep link
 * lands somewhere useful.
 */
export default async function SettingsCatchAll() {
  redirect("/settings");
}

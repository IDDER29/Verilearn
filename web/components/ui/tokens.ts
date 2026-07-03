/** Shared design tokens for the VeriLearn theme. */

export const shadow = {
  /** standard white card */
  card: "0 10px 30px -18px rgba(80,60,140,.28)",
  /** slightly lighter variant used on some cards */
  cardSoft: "0 10px 30px -20px rgba(80,60,140,.28)",
  /** thread/list rows */
  cardList: "0 8px 22px -16px rgba(80,60,140,.3)",
  /** raised chips (back button, search, bell) */
  raised: "0 6px 18px -10px rgba(80,60,140,.25)",
  /** dark spotlight card */
  spotlight: "0 16px 34px -16px rgba(40,30,70,.7)",
  /** primary purple button */
  purpleBtn: "0 12px 26px -10px rgba(109,91,208,.7)",
} as const;

export const color = {
  bg: "#e9e4f5",
  shell: "#f4f2f8",
  sidebar: "#fbfafd",
  card: "#ffffff",
  border: "#ece8f4",
  hairline: "#f5f3fa",
  ink: "#221f2e",
  inkSoft: "#3a3550",
  muted: "#6c6780",
  muted2: "#8b8699",
  muted3: "#9a95a8",
  purple: "#6d5bd0",
  purple2: "#8b78e8",
  purpleTint: "#f1eefb",
  dark: "#211d2e",
  dark2: "#3a3550",
  verified: "#2e9c6a",
  sourced: "#3a63b0",
  disputed: "#c0392b",
} as const;

/** `font("900 24px")` → `"900 24px var(--font-nunito)"` — the repeated Nunito shorthand. */
export const font = (spec: string) => `${spec} var(--font-nunito)`;

export const spotlightGradient = "linear-gradient(160deg,#221d2e,#3a3550)";

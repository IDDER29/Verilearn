import Link from "next/link";
import type { ReactNode } from "react";

export type SettingsKey =
  | "profile"
  | "plan"
  | "sessions"
  | "verification"
  | "active-listening"
  | "review"
  | "privacy"
  | "danger";

const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

type Item = {
  key: SettingsKey;
  label: ReactNode;
  href: string;
  icon: ReactNode;
  danger?: boolean;
};

type Section = { heading: string; items: Item[] };

const SECTIONS: Section[] = [
  {
    heading: "Account",
    items: [
      {
        key: "profile",
        label: "Profile",
        href: "/settings/profile",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20a8 8 0 0116 0" />
          </svg>
        ),
      },
      {
        key: "plan",
        label: <>Plan &amp; billing</>,
        href: "/settings/plan",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
            <rect x="2" y="6" width="20" height="13" rx="2.5" />
            <path d="M2 10h20" />
          </svg>
        ),
      },
      {
        key: "sessions",
        label: <>Sessions &amp; devices</>,
        href: "/settings/sessions",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
            <rect x="4" y="4" width="16" height="11" rx="2" />
            <path d="M9 20h6M12 15v5" />
          </svg>
        ),
      },
    ],
  },
  {
    heading: "Learning",
    items: [
      {
        key: "verification",
        label: "Verification",
        href: "/settings",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
            <path d="M12 3c4 2 6.5 2 8 1.5V12c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V4.5C5.5 5 8 5 12 3z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        ),
      },
      {
        key: "active-listening",
        label: "Active listening",
        href: "/settings/active-listening",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
            <path d="M12 3a7 7 0 00-4 12.7V18h8v-2.3A7 7 0 0012 3zM9.5 21h5" />
          </svg>
        ),
      },
      {
        key: "review",
        label: <>Review &amp; FSRS</>,
        href: "/settings/review",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
            <path d="M20 11A8 8 0 004.6 9M4 4v5h5M4 13a8 8 0 0015.4 2M20 20v-5h-5" />
          </svg>
        ),
      },
    ],
  },
  {
    heading: "Data",
    items: [
      {
        key: "privacy",
        label: "Privacy",
        href: "/settings/privacy",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 018 0v3" />
          </svg>
        ),
      },
      {
        key: "danger",
        label: "Danger zone",
        href: "/settings/danger",
        danger: true,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
            <path d="M4 7h16M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13" />
          </svg>
        ),
      },
    ],
  },
];

function itemStyle(item: Item, active: boolean) {
  const base = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 12,
    textDecoration: "none",
  } as const;
  if (active) {
    return {
      ...base,
      background: item.danger ? "#fbeceb" : "#efe9ff",
      color: item.danger ? "#c0392b" : "#6d5bd0",
      font: "800 13px var(--font-nunito)",
    };
  }
  return {
    ...base,
    color: item.danger ? "#c0392b" : "#6c6780",
    font: "700 13px var(--font-nunito)",
  };
}

export default function SettingsNav({ active }: { active: SettingsKey }) {
  return (
    <div>
      <div style={{ font: "900 22px var(--font-nunito)", letterSpacing: "-.02em", marginBottom: 14 }}>
        Settings
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {SECTIONS.map((section, si) => (
          <div key={section.heading} style={{ display: "contents" }}>
            <span
              style={{
                font: "800 10px var(--font-nunito)",
                letterSpacing: ".07em",
                textTransform: "uppercase",
                color: "#a7a1b8",
                padding: si === 0 ? "8px 12px 4px" : "12px 12px 4px",
              }}
            >
              {section.heading}
            </span>
            {section.items.map((item) => (
              <Link key={item.key} href={item.href} aria-current={active === item.key ? "page" : undefined} style={itemStyle(item, active === item.key)}>
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

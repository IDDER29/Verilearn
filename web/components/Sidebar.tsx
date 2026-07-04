import Link from "next/link";
import type { ReactNode } from "react";
import UpgradeUpsell from "./UpgradeUpsell";

export type NavKey =
  | "dashboard"
  | "topics"
  | "conflicts"
  | "tasks"
  | "tests"
  | "gaps"
  | "community"
  | "reports"
  | "events"
  | "settings"
  | "support";

type NavItem = {
  key: NavKey;
  label: string;
  href: string;
  icon: ReactNode;
};

const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const NAV: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </svg>
    ),
  },
  {
    key: "topics",
    label: "Topics",
    href: "/topics",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
        <path d="M4 5a1 1 0 011-1h5a2 2 0 012 2 2 2 0 012-2h5a1 1 0 011 1v13a1 1 0 01-1 1h-6a1 1 0 00-1 1 1 1 0 00-1-1H5a1 1 0 01-1-1z" />
      </svg>
    ),
  },
  {
    key: "conflicts",
    label: "Conflicts",
    href: "/conflicts",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
        <path d="M12 3v18M5 7l7-4 7 4M5 7v2l-3 5a3 3 0 006 0l-3-5M19 7v2l-3 5a3 3 0 006 0l-3-5" />
      </svg>
    ),
  },
  {
    key: "tasks",
    label: "My Tasks",
    href: "/my-tasks",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
        <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
      </svg>
    ),
  },
  {
    key: "tests",
    label: "Tests",
    href: "/tests",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
        <path d="M9 3h6l1 3H8zM8 6h8l1 14a1 1 0 01-1 1H8a1 1 0 01-1-1z" />
        <path d="M10 12h4M10 16h4" />
      </svg>
    ),
  },
  {
    key: "gaps",
    label: "Gap Map",
    href: "/gap-map",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    key: "community",
    label: "Community",
    href: "/community",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" {...stroke} strokeWidth={1.9}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20a6 6 0 0112 0M16 6a3 3 0 010 6M21 20a6 6 0 00-4-5.6" />
      </svg>
    ),
  },
  {
    key: "reports",
    label: "Reports",
    href: "/reports",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </svg>
    ),
  },
  {
    key: "events",
    label: "Events",
    href: "/events",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
        <rect x="3" y="4.5" width="18" height="16" rx="3" />
        <path d="M3 9h18M8 3v3M16 3v3" />
      </svg>
    ),
  },
];

const FOOTER: NavItem[] = [
  {
    key: "settings",
    label: "Settings",
    href: "/settings",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
      </svg>
    ),
  },
  {
    key: "support",
    label: "Support",
    href: "/support",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.2 9.5a2.8 2.8 0 015.5.8c0 1.9-2.8 2.5-2.8 2.5M12 17h.01" />
      </svg>
    ),
  },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 14,
        textDecoration: "none",
        fontSize: 14.5,
        transition: "background .15s, color .15s",
        ...(active
          ? {
              background: "#6d5bd0",
              color: "#fff",
              fontWeight: 700,
              boxShadow: "0 10px 22px -8px rgba(109,91,208,.7)",
            }
          : { color: "#6c6780", fontWeight: 600 }),
      }}
      className="vl-navlink"
      data-active={active}
      aria-current={active ? "page" : undefined}
    >
      {item.icon}
      {item.label}
    </Link>
  );
}

export default function Sidebar({ active }: { active?: NavKey }) {
  return (
    <aside
      style={{
        background: "#fbfafd",
        padding: "26px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        borderRight: "1px solid #ece8f4",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "4px 8px 20px" }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: "linear-gradient(135deg,#6d5bd0,#8b78e8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 14px -4px rgba(109,91,208,.6)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.9 7.2 18.7l.9-5.4-3.9-3.8 5.4-.8z"
              stroke="#fff"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M9.3 12l1.9 1.9L15 10"
              stroke="#fff"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span style={{ font: "900 21px var(--font-nunito)", letterSpacing: "-.02em" }}>VeriLearn</span>
      </div>

      <nav aria-label="Primary" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {NAV.map((item) => (
          <NavLink key={item.key} item={item} active={active === item.key} />
        ))}
      </nav>

      <div style={{ height: 1, background: "#ece8f4", margin: "14px 8px" }} />

      {FOOTER.map((item) => (
        <NavLink key={item.key} item={item} active={active === item.key} />
      ))}

      <div style={{ marginTop: "auto" }} />

      <UpgradeUpsell />

      <a
        href="/logout"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginTop: 10,
          padding: "9px 14px",
          borderRadius: 12,
          color: "#8b8699",
          textDecoration: "none",
          font: "700 12.5px var(--font-nunito)",
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 17l5-5-5-5M21 12H9M12 19H6a2 2 0 01-2-2V7a2 2 0 012-2h6" />
        </svg>
        Sign out
      </a>
    </aside>
  );
}

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { color, font, shadow, spotlightGradient } from "./tokens";

export { color, font, shadow, spotlightGradient } from "./tokens";

/* ------------------------------------------------------------------ *
 * Card — white rounded surface with the standard soft purple shadow.
 * ------------------------------------------------------------------ */
export function Card({
  children,
  radius = 20,
  padding = 20,
  boxShadow = shadow.card,
  style,
}: {
  children: ReactNode;
  radius?: number;
  padding?: number | string;
  boxShadow?: string;
  style?: CSSProperties;
}) {
  return (
    <div style={{ background: "#fff", borderRadius: radius, padding, boxShadow, ...style }}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * SpotlightCard — the dark gradient card used across the app.
 * ------------------------------------------------------------------ */
export function SpotlightCard({
  children,
  radius = 20,
  padding = 20,
  raised = false,
  style,
}: {
  children: ReactNode;
  radius?: number;
  padding?: number | string;
  raised?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: spotlightGradient,
        borderRadius: radius,
        padding,
        color: "#fff",
        ...(raised ? { boxShadow: shadow.spotlight } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * StatusPill — small rounded status/tag chip, optional leading dot.
 * ------------------------------------------------------------------ */
export function StatusPill({
  label,
  color: fg,
  bg,
  dot = false,
  size = 10,
  style,
}: {
  label: ReactNode;
  color: string;
  bg: string;
  dot?: boolean;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        font: font(`800 ${size}px`),
        color: fg,
        background: bg,
        padding: "4px 9px",
        borderRadius: 8,
        ...style,
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: fg }} />}
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Avatar — emoji avatar in a circle with a gradient/solid background.
 * ------------------------------------------------------------------ */
export function Avatar({
  emoji,
  size = 44,
  background,
  radius = "50%",
  fontSize,
  style,
}: {
  emoji: ReactNode;
  size?: number;
  background: string;
  radius?: number | string;
  fontSize?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: fontSize ?? Math.round(size * 0.45),
        flexShrink: 0,
        ...style,
      }}
    >
      {emoji}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * BackButton — the 42px white chevron chip used in page headers.
 * ------------------------------------------------------------------ */
export function BackButton({ href, style }: { href: string; style?: CSSProperties }) {
  return (
    <Link
      href={href}
      style={{
        width: 42,
        height: 42,
        borderRadius: 13,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        boxShadow: shadow.raised,
        flexShrink: 0,
        ...style,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a4560" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </Link>
  );
}

/* ------------------------------------------------------------------ *
 * ProgressRing — SVG donut with centered content.
 * ------------------------------------------------------------------ */
export function ProgressRing({
  size,
  stroke,
  pct,
  r: rProp,
  trackColor = "#eee9f7",
  ringColor = color.purple,
  children,
  animate = false,
}: {
  size: number;
  stroke: number;
  /** 0–100 */
  pct: number;
  /** explicit radius; defaults to fitting the stroke inside `size` */
  r?: number;
  trackColor?: string;
  ringColor?: string;
  children?: ReactNode;
  animate?: boolean;
}) {
  const r = rProp ?? (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const offset = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={animate ? { transition: "stroke-dashoffset .5s ease, stroke .3s" } : undefined}
        />
      </svg>
      {children != null && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * TrustBar — segmented verified/sourced/disputed progress bar.
 * ------------------------------------------------------------------ */
export function TrustBar({
  segments,
  height = 8,
  radius = 5,
  track = "#efeaf6",
  gap = 0,
  style,
}: {
  /** each segment: a color and a width (0–100, share of the whole bar) */
  segments: { color: string; pct: number }[];
  height?: number;
  radius?: number;
  track?: string;
  /** px gap between segments (leaves track showing through) */
  gap?: number;
  style?: CSSProperties;
}) {
  return (
    <div style={{ display: "flex", gap, height, borderRadius: radius, background: track, overflow: "hidden", ...style }}>
      {segments.map((s, i) => (
        <span key={i} style={{ width: `${s.pct}%`, height: "100%", background: s.color }} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * StatCard — pastel color-blocked stat tile (icon + value + label).
 * ------------------------------------------------------------------ */
export function StatCard({
  bg,
  icon,
  value,
  label,
  labelColor,
  iconTileBg = "#fff",
  style,
}: {
  bg: string;
  icon: ReactNode;
  value: ReactNode;
  label: ReactNode;
  labelColor: string;
  iconTileBg?: string;
  style?: CSSProperties;
}) {
  return (
    <div style={{ background: bg, borderRadius: 20, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, ...style }}>
      <div style={{ width: 48, height: 48, borderRadius: 15, background: iconTileBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ font: font("900 24px"), lineHeight: 1 }}>{value}</div>
        <div style={{ font: font("700 12.5px"), color: labelColor }}>{label}</div>
      </div>
    </div>
  );
}

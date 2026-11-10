import type { Lane, LanePeriod } from "./types";

/** Under this many sends a rate is noise. Contract rule. */
export const MIN_N = 100;

export const tooSmall = (n: number) => n < MIN_N;

export const bookings = (p: Pick<LanePeriod, "bookings_consult" | "bookings_report">) => p.bookings_consult + p.bookings_report;

/** Per 1k with one decimal. Recomputed from raw counts when the file leaves it null. */
export function per1k(num: number, den: number, given?: number | null): number | null {
  if (given !== null && given !== undefined) return given;
  return den > 0 ? (num / den) * 1000 : null;
}

export const fmt1k = (v: number | null) => (v === null ? "n/a" : v.toFixed(1));

export const fmtMonth = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", { timeZone: "UTC", month: "short" });
};

export const statusRank = (s: string) => (s === "FAILING" ? 0 : 1);

/** FAILING first, then readable lanes (n >= 100) before too-small ones, each by bookings per 1k (last 30 days) desc. */
export function sortLanes(lanes: Lane[]): Lane[] {
  const r = (l: Lane) => per1k(bookings(l.last_30d), l.last_30d.sent, l.last_30d.bookings_per_1k) ?? -1;
  const small = (l: Lane) => (tooSmall(l.last_30d.sent) ? 1 : 0);
  return [...lanes].sort(
    (a, b) => statusRank(a.status) - statusRank(b.status) || small(a) - small(b) || r(b) - r(a) || b.last_30d.sent - a.last_30d.sent
  );
}

/** Seven categorical slots, assigned once by total sends in the window so a lane keeps its color everywhere. */
export const CAT = Array.from({ length: 7 }, (_, i) => `var(--cat-${i + 1})`);
export const OTHER = "rgb(var(--muted))";

export function laneColors(lanes: Lane[]): { colored: Lane[]; other: Lane[]; color: Record<string, string> } {
  const byVol = [...lanes].sort((a, b) => sum(b) - sum(a) || a.key.localeCompare(b.key)).filter((l) => sum(l) > 0);
  // Eight or more series: the 8th onward folds into Other rather than cycling hues.
  const cut = byVol.length > CAT.length ? CAT.length - 1 : CAT.length;
  const colored = byVol.slice(0, cut);
  const other = byVol.slice(cut);
  const color: Record<string, string> = {};
  colored.forEach((l, i) => (color[l.key] = CAT[i]));
  other.forEach((l) => (color[l.key] = OTHER));
  return { colored, other, color };
}

const sum = (l: Lane) => l.months.reduce((s, m) => s + m.sent, 0);

// Colour follows the entity. Every bucket belongs to one stage family, and a family has one hue on every
// page and chart. Class strings stay literal so Tailwind generates them.

export type Family = "agree" | "insp" | "report" | "live" | "none";

export const FAMILY_LABEL: Record<Family, string> = {
  agree: "Agreement",
  insp: "Inspection",
  report: "Report",
  live: "Go-live",
  none: "Other",
};

/** Bucket key ("6_report_published_no_confirm", "0_listed_this_month") or path source key ("b6_fresh", "listed"). */
export function familyOf(key: string): Family {
  if (key === "listed" || key.startsWith("0_")) return "live";
  const m = /^b?(\d)/.exec(key);
  if (!m || key.startsWith("00")) return "none";
  const n = Number(m[1]);
  if (n === 0 || n === 7) return "live";
  if (n === 5 || n === 6) return "report";
  if (n === 3 || n === 4) return "insp";
  if (n === 1 || n === 2) return "agree";
  return "none";
}

export const FAM = {
  agree: { dot: "bg-agree", bar: "bg-agree", chip: "bg-agree/10 ring-agree/30", var: "rgb(var(--st-agree))" },
  insp: { dot: "bg-insp", bar: "bg-insp", chip: "bg-insp/10 ring-insp/30", var: "rgb(var(--st-insp))" },
  report: { dot: "bg-report", bar: "bg-report", chip: "bg-report/10 ring-report/30", var: "rgb(var(--st-report))" },
  live: { dot: "bg-live", bar: "bg-live", chip: "bg-live/10 ring-live/30", var: "rgb(var(--st-live))" },
  none: { dot: "bg-muted", bar: "bg-muted", chip: "bg-soft ring-line-strong", var: "rgb(var(--muted))" },
} as const;

/** Within a family, earlier stages are lighter: intensity grows toward the listing. */
export function stageOpacity(key: string): number {
  const k = key.replace(/^b/, "");
  if (k.startsWith("1") || k.startsWith("3")) return 0.55;
  if (k.startsWith("5b")) return 0.75;
  if (k.startsWith("5")) return 0.55;
  if (k.startsWith("7")) return 0.6;
  return 1;
}

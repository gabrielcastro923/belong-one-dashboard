import type { Checkpoint, Pipeline } from "@/lib/types";
import { monthTargets } from "@/lib/pace";
import { MetricChart, type ChartRow } from "./metric-chart";

function monthDays(month: string): string[] {
  const [y, m] = month.split("-").map(Number);
  const n = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return Array.from({ length: n }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`);
}

/** Linear pace between checkpoints, starting from 0 on day 1. */
function paceAt(date: string, first: string, cps: Checkpoint[], pick: (c: Checkpoint) => number): number | undefined {
  const pts = [{ date: first, v: 0 }, ...cps.map((c) => ({ date: c.date, v: pick(c) }))];
  const t = (d: string) => Date.parse(`${d}T00:00:00Z`);
  for (let i = 1; i < pts.length; i++) {
    if (date <= pts[i].date) {
      const a = pts[i - 1];
      const b = pts[i];
      const span = t(b.date) - t(a.date) || 1;
      return a.v + ((b.v - a.v) * (t(date) - t(a.date))) / span;
    }
  }
  return undefined;
}

export function ProgressCharts({ p }: { p: Pipeline }) {
  const days = monthDays(p.month);
  const cps = [...p.checkpoints].sort((a, b) => a.date.localeCompare(b.date));
  const prog = new Map((p.progress ?? []).map((x) => [x.date, x]));
  const t = monthTargets(p);
  const series = [
    { title: "Listed MTD", key: "listed" as const, pick: (c: Checkpoint) => c.listed, goal: p.target, last: p.listed_mtd },
    { title: "Report calls held", key: "calls_held" as const, pick: (c: Checkpoint) => c.calls_target, goal: t.calls, last: p.report_calls_held_mtd },
    { title: "Inspections completed", key: "insp_done" as const, pick: (c: Checkpoint) => c.insp, goal: t.insp, last: p.inspections_completed_mtd },
  ];
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {series.map((s) => {
        const rows: ChartRow[] = days.map((d) => ({ date: d, actual: prog.get(d)?.[s.key], target: paceAt(d, days[0], cps, s.pick) }));
        return <MetricChart key={s.key} title={s.title} rows={rows} goal={s.goal} last={s.last} />;
      })}
    </div>
  );
}

import type { Pipeline } from "@/lib/types";
import { fmtRate, monthTargets, perDay } from "@/lib/pace";

function Cell({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="tnum text-xl font-semibold">{value}</dd>
      <dd className="text-xs text-muted-foreground">{note}</dd>
    </div>
  );
}

export function PaceStrip({ p }: { p: Pipeline }) {
  const t = monthTargets(p);
  const listNeed = p.target - p.listed_mtd;
  const callNeed = t.calls - p.report_calls_held_mtd;
  const inspNeed = t.insp - p.inspections_completed_mtd;
  return (
    <dl className="grid grid-cols-2 gap-4 rounded-lg border border-border p-4 sm:grid-cols-4">
      <Cell label="Working days left" value={String(p.working_days_left)} note={`${p.working_days_left_before_1120} before 11-20`} />
      <Cell
        label="Listings / day needed"
        value={fmtRate(perDay(listNeed, p.working_days_left))}
        note={`${Math.max(0, listNeed)} to go ÷ ${p.working_days_left} days`}
      />
      <Cell
        label="Report calls / day needed"
        value={fmtRate(perDay(callNeed, p.working_days_left_before_1120))}
        note={`${Math.max(0, callNeed)} to go ÷ ${p.working_days_left_before_1120} days to 11-20`}
      />
      <Cell
        label="Inspections / day needed"
        value={fmtRate(perDay(inspNeed, p.working_days_left_before_1120))}
        note={`${Math.max(0, inspNeed)} to go ÷ ${p.working_days_left_before_1120} days to 11-20`}
      />
    </dl>
  );
}

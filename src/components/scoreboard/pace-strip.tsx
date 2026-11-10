import type { Pipeline } from "@/lib/types";
import { fmtRate, monthTargets, perDay } from "@/lib/pace";
import { FAM, type Family } from "@/lib/stage";
import { Tip } from "@/components/ui/hint";
import { cn } from "@/lib/utils";

function Cell({ label, value, unit, note, tip, fam }: { label: string; value: string; unit?: string; note: string; tip: string; fam?: Family }) {
  return (
    <div className="min-w-0 bg-card px-5 py-4">
      <dt className="flex items-center gap-1.5 text-xs text-muted">
        {fam && <span className={cn("h-1.5 w-1.5 rounded-full", FAM[fam].dot)} aria-hidden />}
        {label}
      </dt>
      <dd className="mt-1">
        <Tip text={tip} align="start">
          <span tabIndex={0} className="num text-[26px] font-semibold leading-8">
            {value}
            {unit && <span className="ml-1 text-sm font-normal tracking-normal text-muted">{unit}</span>}
          </span>
        </Tip>
      </dd>
      <dd className="tnum text-xs text-muted">{note}</dd>
    </div>
  );
}

export function PaceStrip({ p }: { p: Pipeline }) {
  const t = monthTargets(p);
  const listNeed = p.target - p.listed_mtd;
  const callNeed = t.calls - p.report_calls_held_mtd;
  const inspNeed = t.insp - p.inspections_completed_mtd;
  const d = p.working_days_left;
  const d20 = p.working_days_left_before_1120;
  return (
    <dl className="grid grid-cols-2 gap-px rounded-lg border border-line bg-line sm:grid-cols-4 [&>*:first-child]:rounded-tl-[9px] [&>*:last-child]:rounded-br-[9px] max-sm:[&>*:nth-child(2)]:rounded-tr-[9px] max-sm:[&>*:nth-child(3)]:rounded-bl-[9px] sm:[&>*:first-child]:rounded-bl-[9px] sm:[&>*:last-child]:rounded-tr-[9px]">
      <Cell label="Working days left" value={String(d)} note={`${d20} before 11-20`} tip="Working days left in November; the second figure counts to the 11-20 cutoff." />
      <Cell
        label="Listings / day"
        fam="live"
        value={fmtRate(perDay(listNeed, d))}
        note={`${Math.max(0, listNeed)} ÷ ${d} days`}
        tip={`${Math.max(0, listNeed)} listings to go over ${d} working days.`}
      />
      <Cell
        label="Report calls / day"
        fam="report"
        value={fmtRate(perDay(callNeed, d20))}
        note={`${Math.max(0, callNeed)} ÷ ${d20} days to 11-20`}
        tip={`${Math.max(0, callNeed)} report calls held to go over ${d20} working days before 11-20.`}
      />
      <Cell
        label="Inspections / day"
        fam="insp"
        value={fmtRate(perDay(inspNeed, d20))}
        note={`${Math.max(0, inspNeed)} ÷ ${d20} days to 11-20`}
        tip={`${Math.max(0, inspNeed)} inspections to go over ${d20} working days before 11-20.`}
      />
    </dl>
  );
}

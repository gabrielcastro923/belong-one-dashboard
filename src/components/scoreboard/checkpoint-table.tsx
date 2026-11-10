"use client";

import type { Pipeline } from "@/lib/types";
import { checkpointRows, type Status } from "@/lib/pace";
import { fmtDay } from "@/lib/dates";
import { useToday } from "@/lib/storage";
import { StatusChip } from "@/components/status-chip";
import { SectionHead, TD, TH } from "@/components/ui/section";
import { Tip } from "@/components/ui/hint";
import { FAM } from "@/lib/stage";
import { cn } from "@/lib/utils";

function Metric({ value, target, status, floor, upcoming }: { value: number; target: number; status: Status; floor?: number; upcoming: boolean }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className="tnum whitespace-nowrap">
        {!upcoming && <span className={status === "miss" ? "font-semibold text-critical-ink" : "font-medium text-ink"}>{value}</span>}
        <span className={upcoming ? "text-ink-2" : "text-muted"}>
          {upcoming ? "" : " / "}
          {target}
        </span>
        {floor !== undefined && <span className="text-muted"> · {floor}</span>}
      </span>
      {!upcoming && status !== "pass" && (
        <span className="max-sm:hidden">
          <StatusChip status={status} />
        </span>
      )}
    </span>
  );
}

const Need = ({ n, label, dot }: { n: number; label: string; dot: string }) => (
  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
    <span className={cn("h-1.5 w-1.5 rounded-full", dot)} aria-hidden />
    <span className="num text-[15px] font-semibold">+{n}</span>
    <span className="text-muted">{label}</span>
  </span>
);

export function CheckpointTable({ p }: { p: Pipeline }) {
  const today = useToday();
  if (!today) return <div className="h-56 rounded-lg border border-line bg-card" aria-busy />;
  const rows = checkpointRows(p, today);
  const nextOpen = rows.find((r) => r.row === "upcoming");
  return (
    <section className="min-w-0 rounded-lg border border-line bg-card">
      <SectionHead title="Friday checkpoints" className="px-5 pb-3 pt-4" hint="Each Friday is judged at end of day on month-to-date counts. Calls held show target · floor.">
        {nextOpen && (
          <Tip align="end" text={`What ${fmtDay(nextOpen.cp.date)} still needs from today's month-to-date.`}>
            <span tabIndex={0} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <span className="text-muted">{fmtDay(nextOpen.cp.date)} needs</span>
              <Need n={Math.max(0, nextOpen.cp.calls_target - p.report_calls_held_mtd)} label={`calls (${Math.max(0, nextOpen.cp.calls_floor - p.report_calls_held_mtd)} floor)`} dot={FAM.report.dot} />
              <Need n={Math.max(0, nextOpen.cp.insp - p.inspections_completed_mtd)} label="inspections" dot={FAM.insp.dot} />
              <Need n={Math.max(0, nextOpen.cp.listed - p.listed_mtd)} label="listed" dot={FAM.live.dot} />
            </span>
          </Tip>
        )}
      </SectionHead>
      <div className="max-md:overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-y border-line bg-soft/50 text-left">
            <tr>
              <th className={cn(TH, "pl-5")}>Friday</th>
              <th className={TH}>Calls held · floor</th>
              <th className={TH}>Inspections</th>
              <th className={TH}>Listed</th>
              <th className={cn(TH, "pr-5 text-right")}>Result</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const up = r.row === "upcoming";
              const isNext = r === nextOpen;
              return (
                <tr key={r.cp.date} className={cn("border-t border-line first:border-t-0", isNext && "bg-focus/[.05]")}>
                  <td className={cn(TD, "tnum whitespace-nowrap pl-5 font-medium")}>
                    {fmtDay(r.cp.date)}
                    {isNext && <span className="ml-2 rounded bg-focus/10 px-1.5 py-px text-2xs font-medium text-focus">Next</span>}
                  </td>
                  <td className={TD}>
                    <Metric value={r.calls} target={r.cp.calls_target} floor={r.cp.calls_floor} status={r.callsStatus} upcoming={up} />
                  </td>
                  <td className={TD}>
                    <Metric value={r.insp} target={r.cp.insp} status={r.inspStatus} upcoming={up} />
                  </td>
                  <td className={TD}>
                    <Metric value={r.listed} target={r.cp.listed} status={r.listedStatus} upcoming={up} />
                  </td>
                  <td className={cn(TD, "whitespace-nowrap pr-5 text-right")}>
                    {r.approx && (
                      <Tip align="end" text="No progress point for this date; judged on today's month-to-date.">
                        <span tabIndex={0} className="mr-2 text-2xs text-muted underline decoration-dotted underline-offset-2">
                          from MTD
                        </span>
                      </Tip>
                    )}
                    <StatusChip status={r.row} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

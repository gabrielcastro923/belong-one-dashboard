"use client";

import type { Pipeline } from "@/lib/types";
import { checkpointRows, type Status } from "@/lib/pace";
import { fmtDay } from "@/lib/dates";
import { useToday } from "@/lib/storage";
import { StatusChip } from "@/components/status-chip";

function Metric({ value, target, status, floor, upcoming }: { value: number; target: number; status: Status; floor?: number; upcoming: boolean }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className="tnum">
        {upcoming ? "" : `${value} / `}
        {target}
        {floor !== undefined && <span className="text-muted-foreground"> · {floor}</span>}
      </span>
      {!upcoming && <StatusChip status={status} />}
    </span>
  );
}

export function CheckpointTable({ p }: { p: Pipeline }) {
  const today = useToday();
  if (!today) return <div className="h-40 rounded-lg border border-border" aria-busy />;
  const rows = checkpointRows(p, today);
  const nextOpen = rows.find((r) => r.row === "upcoming");
  return (
    <section className="min-w-0 space-y-2">
      <h2 className="text-sm font-semibold">Friday checkpoints</h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Calls held · floor</th>
              <th className="px-3 py-2 font-medium">Inspections</th>
              <th className="px-3 py-2 font-medium">Listed</th>
              <th className="px-3 py-2 font-medium">Result</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const up = r.row === "upcoming";
              return (
                <tr key={r.cp.date} className={r === nextOpen ? "border-t border-border bg-series/5" : "border-t border-border"}>
                  <td className="tnum whitespace-nowrap px-3 py-2 font-medium">
                    {fmtDay(r.cp.date)}
                    {r === nextOpen && <span className="ml-1.5 text-xs font-normal text-muted-foreground">next</span>}
                  </td>
                  <td className="px-3 py-2">
                    <Metric value={r.calls} target={r.cp.calls_target} floor={r.cp.calls_floor} status={r.callsStatus} upcoming={up} />
                  </td>
                  <td className="px-3 py-2">
                    <Metric value={r.insp} target={r.cp.insp} status={r.inspStatus} upcoming={up} />
                  </td>
                  <td className="px-3 py-2">
                    <Metric value={r.listed} target={r.cp.listed} status={r.listedStatus} upcoming={up} />
                  </td>
                  <td className="px-3 py-2">
                    <StatusChip status={r.row} />
                    {r.approx && <span className="ml-1 text-xs text-muted-foreground">from MTD</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {nextOpen && (
        <p className="tnum text-xs text-muted-foreground">
          To make {fmtDay(nextOpen.cp.date)}: {Math.max(0, nextOpen.cp.calls_target - p.report_calls_held_mtd)} more calls held (
          {Math.max(0, nextOpen.cp.calls_floor - p.report_calls_held_mtd)} for floor), {Math.max(0, nextOpen.cp.insp - p.inspections_completed_mtd)} more
          inspections, {Math.max(0, nextOpen.cp.listed - p.listed_mtd)} more listed.
        </p>
      )}
    </section>
  );
}

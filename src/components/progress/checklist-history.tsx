"use client";

import type { Plan } from "@/lib/types";
import { fmtDay } from "@/lib/dates";
import { useChecklist, useCounters, useToday } from "@/lib/storage";
import { callKey } from "@/components/plan/block-item";
import { SectionHead } from "@/components/ui/section";

export function ChecklistHistory({ plan }: { plan: Plan }) {
  const { done, ready } = useChecklist();
  const { counters } = useCounters();
  const today = useToday();
  const days = plan.days.filter((d) => d.working && (!today || d.date <= today));
  return (
    <section className="min-w-0 space-y-3">
      <SectionHead title="Checklist by day" hint="From this browser only. Another phone or laptop keeps its own ticks." />
      {!ready ? (
        <div className="h-24 rounded-lg border border-line bg-card" aria-busy />
      ) : days.length === 0 ? (
        <p className="text-sm text-muted">No plan days have started yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-card">
          <table className="w-full text-sm">
            <thead className="bg-soft/50 text-left text-xs text-muted">
              <tr>
                <th className="px-3 py-2.5 font-medium">Day</th>
                <th className="px-3 py-2.5 text-right font-medium">Calls done</th>
                <th className="w-1/4 px-3 py-2.5 font-medium">
                  <span className="sr-only">Completion</span>
                </th>
                <th className="px-3 py-2.5 text-right font-medium">Held</th>
                <th className="px-3 py-2.5 text-right font-medium">Booked</th>
              </tr>
            </thead>
            <tbody className="tnum">
              {days.map((d) => {
                const calls = d.blocks.flatMap((b) => b.calls);
                const n = calls.filter((c) => done.has(callKey(d.date, c))).length;
                const c = counters[d.date] ?? { held: 0, booked: 0 };
                const share = calls.length ? n / calls.length : 0;
                return (
                  <tr key={d.date} className="border-t border-line">
                    <td className="whitespace-nowrap px-3 py-2.5">
                      {d.dow} {fmtDay(d.date)}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      {n} / {calls.length}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="h-1 rounded-full bg-line">
                        <div className="h-1 rounded-full bg-ink" style={{ width: `${share * 100}%` }} />
                      </div>
                    </td>
                    <td className={`px-3 py-2.5 text-right ${c.held >= d.targets.report_calls_held && c.held > 0 ? "font-semibold text-good-ink" : ""}`}>
                      {c.held} / {d.targets.report_calls_held}
                    </td>
                    <td className={`px-3 py-2.5 text-right ${c.booked >= d.targets.inspections_booked && c.booked > 0 ? "font-semibold text-good-ink" : ""}`}>
                      {c.booked} / {d.targets.inspections_booked}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

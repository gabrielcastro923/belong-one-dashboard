"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { PlanDay } from "@/lib/types";
import { fmtDay } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { BlockItem, callKey } from "./block-item";
import { DayCounters } from "./day-counters";

interface Props {
  day: PlanDay;
  isToday: boolean;
  isPast: boolean;
  done: Set<string>;
  toggle: (id: string) => void;
  counts: { held: number; booked: number };
  bump: (field: "held" | "booked", d: number) => void;
}

export function DayCard({ day, isToday, isPast, done, toggle, counts, bump }: Props) {
  const [open, setOpen] = useState(isToday);
  useEffect(() => setOpen(isToday), [isToday]);

  const calls = day.blocks.flatMap((b) => b.calls);
  const doneCount = calls.filter((c) => done.has(callKey(day.date, c))).length;
  const items = [...day.fixed, ...day.blocks].sort((a, b) => a.time_et.localeCompare(b.time_et));
  const t = day.targets;

  if (!day.working) {
    return (
      <li className="flex items-center justify-between rounded-lg border border-dashed border-border px-4 py-2 text-sm text-muted-foreground">
        <span className="tnum">
          {day.dow} {fmtDay(day.date)}
        </span>
        <span>Off</span>
      </li>
    );
  }

  return (
    <li id={`d-${day.date}`} className={cn("rounded-lg border bg-card", isToday ? "border-series" : "border-border", isPast && !isToday && "opacity-75")}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-left"
      >
        <span className="tnum font-semibold">
          {day.dow} {fmtDay(day.date)}
        </span>
        {day.projection && <span className="rounded-sm border border-border px-1.5 text-[11px] leading-5 text-muted-foreground">Projection</span>}
        {isToday && <span className="rounded-sm bg-series px-1.5 text-[11px] font-medium leading-5 text-white">Today</span>}
        <span className="tnum text-xs text-muted-foreground">
          {t.report_calls_held} held / {t.inspections_booked} booked
          {t.b7_pushes > 0 && ` / ${t.b7_pushes} push`}
        </span>
        <span className="tnum ml-auto text-sm">
          <span className={doneCount === calls.length && calls.length > 0 ? "font-semibold text-good-ink" : ""}>{doneCount}</span>
          <span className="text-muted-foreground"> / {calls.length} calls</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <div className="space-y-2 border-t border-border px-4 pb-3 pt-3">
          <DayCounters held={counts.held} booked={counts.booked} targets={t} onBump={(f, d) => bump(f, d)} />
          <ul className="divide-y divide-border">
            {items.map((b, i) => (
              <BlockItem key={`${b.time_et}-${i}`} date={day.date} block={b} done={done} toggle={toggle} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

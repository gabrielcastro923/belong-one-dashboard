"use client";

import { useEffect, useState } from "react";
import type { PlanDay } from "@/lib/types";
import { fmtDay } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { Tip } from "@/components/ui/hint";
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

const Fact = ({ n, label, dot }: { n: number; label: string; dot: string }) => (
  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
    <span className={cn("h-1.5 w-1.5 rounded-full", dot)} aria-hidden />
    <span className="font-medium text-ink">{n}</span>
    {label}
  </span>
);

export function DayCard({ day, isToday, isPast, done, toggle, counts, bump }: Props) {
  const [open, setOpen] = useState(isToday);
  useEffect(() => setOpen(isToday), [isToday]);

  const calls = day.blocks.flatMap((b) => b.calls);
  const doneCount = calls.filter((c) => done.has(callKey(day.date, c))).length;
  const items = [...day.fixed, ...day.blocks].sort((a, b) => a.time_et.localeCompare(b.time_et));
  const t = day.targets;
  const share = calls.length ? doneCount / calls.length : 0;

  if (!day.working) {
    return (
      <li className="flex items-center justify-between rounded-lg border border-dashed border-line-strong px-5 py-2.5 text-sm text-muted">
        <span className="tnum">
          {day.dow} {fmtDay(day.date)}
        </span>
        <span>Off</span>
      </li>
    );
  }

  return (
    <li
      id={`d-${day.date}`}
      className={cn("rounded-lg border bg-card", isToday ? "border-ink/25 shadow-[0_0_0_3px_rgb(var(--focus)/.08)]" : "border-line", isPast && !isToday && "opacity-70")}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 text-left sm:px-5"
      >
        <span className="flex items-center gap-2">
          <span className="tnum text-[15px] font-semibold tracking-[-0.01em]">
            {day.dow} {fmtDay(day.date)}
          </span>
          {isToday && <span className="rounded-md bg-ink px-1.5 text-2xs font-medium leading-5 text-card">Today</span>}
          {day.projection && (
            <Tip text="Drafted from today's book; changes as the plan rebuilds." align="start">
              <span className="rounded-md px-1.5 text-2xs font-medium leading-5 text-muted ring-1 ring-inset ring-line-strong">Projection</span>
            </Tip>
          )}
        </span>
        <span className="tnum flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <Fact n={t.report_calls_held} label="held" dot="bg-report" />
          <Fact n={t.inspections_booked} label="booked" dot="bg-insp" />
          {t.b7_pushes > 0 && <Fact n={t.b7_pushes} label="push" dot="bg-live" />}
        </span>
        <span className="tnum ml-auto flex items-center gap-3 text-sm">
          <span className="hidden h-1 w-16 overflow-hidden rounded-full bg-line sm:block" aria-hidden>
            <span className="block h-full rounded-full bg-ink" style={{ width: `${share * 100}%` }} />
          </span>
          <span>
            <span className={doneCount === calls.length && calls.length > 0 ? "font-semibold text-good-ink" : "font-semibold"}>{doneCount}</span>
            <span className="text-muted"> / {calls.length}</span>
          </span>
          <svg width="12" height="12" viewBox="0 0 10 10" aria-hidden className={cn("text-muted transition-transform", open && "rotate-180")}>
            <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="border-t border-line px-4 pb-2 pt-4 sm:px-5">
          <DayCounters held={counts.held} booked={counts.booked} targets={t} onBump={(f, d) => bump(f, d)} />
          <ul className="mt-3 divide-y divide-line">
            {items.map((b, i) => (
              <BlockItem key={`${b.time_et}-${i}`} date={day.date} block={b} done={done} toggle={toggle} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

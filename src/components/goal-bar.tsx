"use client";

import { useEffect, useState } from "react";
import { mockPlan } from "@/data/data";
import { pacePerBdRequired } from "@/lib/plan";
import { Progress } from "@/components/ui/progress";

export function GoalBar() {
  const { banked, target, businessDaysRemaining, monthLabel, planTitle } = mockPlan;
  const remaining = Math.max(0, target - banked);
  const pace = pacePerBdRequired(remaining, businessDaysRemaining);
  const pct = Math.round((banked / target) * 1000) / 10;
  const [sec, setSec] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const refreshLabel = sec < 60 ? `Refreshed ${sec}s ago` : `Refreshed ${Math.floor(sec / 60)}m ago`;

  return (
    <div className="border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {planTitle} — {monthLabel}
            </span>
            <span className="text-2xl font-semibold tabular-nums text-foreground">
              {banked} / {target} <span className="text-base font-normal text-muted-foreground">closed</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>{businessDaysRemaining} business days remaining</span>
            <span className="tabular-nums">{pace} closes/BD required</span>
          </div>
          <Progress value={pct} className="h-1 max-w-md bg-muted" />
        </div>
        <div className="shrink-0 text-right text-[11px] text-muted-foreground md:pl-4">{refreshLabel}</div>
      </div>
    </div>
  );
}

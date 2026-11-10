"use client";

import type { Plan } from "@/lib/types";
import { useChecklist, useCounters, useToday } from "@/lib/storage";
import { DayCard } from "./day-card";

export function PlanBoard({ plan }: { plan: Plan }) {
  const today = useToday();
  const { done, toggle } = useChecklist();
  const { counters, bump } = useCounters();
  const hasToday = today ? plan.days.some((d) => d.date === today) : true;
  return (
    <div className="space-y-3">
      {today && !hasToday && (
        <p className="rounded-lg border border-warn/40 bg-warn/10 px-4 py-2.5 text-sm text-warn-ink">
          Today ({today}) is not in this plan. Rebuild plan.json to get fresh days.
        </p>
      )}
      <ol className="space-y-2.5">
        {plan.days.map((d) => (
          <DayCard
            key={d.date}
            day={d}
            isToday={d.date === today}
            isPast={today !== null && d.date < today}
            done={done}
            toggle={toggle}
            counts={counters[d.date] ?? { held: 0, booked: 0 }}
            bump={(f, delta) => bump(d.date, f, delta)}
          />
        ))}
      </ol>
    </div>
  );
}

"use client";

import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fmtDay } from "@/lib/dates";

export interface ChartRow {
  date: string;
  actual?: number;
  target?: number;
}

const ACTUAL = "hsl(var(--series-1))";
const TARGET = "hsl(var(--muted-foreground))";
const GRID = "hsl(var(--border))";

function Tip({ active, payload, label }: { active?: boolean; payload?: { dataKey: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length || !label) return null;
  const get = (k: string) => payload.find((p) => p.dataKey === k)?.value;
  const a = get("actual");
  const t = get("target");
  return (
    <div className="tnum rounded-md border border-border bg-card px-2.5 py-1.5 text-xs shadow-sm">
      <div className="font-medium">{fmtDay(label)}</div>
      {a !== undefined && <div>Actual {a}</div>}
      {t !== undefined && <div className="text-muted-foreground">Pace {t.toFixed(1)}</div>}
    </div>
  );
}

export function MetricChart({ title, rows, goal, last }: { title: string; rows: ChartRow[]; goal: number; last?: number }) {
  return (
    <section className="min-w-0 rounded-lg border border-border bg-card p-3">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold">
          {title}{" "}
          <span className="tnum font-normal text-muted-foreground">
            {last ?? 0} / {goal}
          </span>
        </h2>
        <p className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="h-0.5 w-3 bg-series" aria-hidden /> Actual
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 border-t border-dashed border-muted-foreground" aria-hidden /> Checkpoint pace
          </span>
        </p>
      </div>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid stroke={GRID} strokeOpacity={0.6} vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d: string) => d.slice(8).replace(/^0/, "")}
              tick={{ fontSize: 11, fill: TARGET }}
              tickLine={false}
              axisLine={{ stroke: GRID }}
              interval="preserveStartEnd"
              minTickGap={16}
            />
            <YAxis allowDecimals={false} domain={[0, Math.max(goal, last ?? 0)]} tick={{ fontSize: 11, fill: TARGET }} tickLine={false} axisLine={false} />
            <Tooltip content={<Tip />} cursor={{ stroke: TARGET, strokeDasharray: "2 2" }} />
            <Line dataKey="target" stroke={TARGET} strokeWidth={1.5} strokeDasharray="4 3" dot={false} connectNulls isAnimationActive={false} />
            <Area
              dataKey="actual"
              stroke={ACTUAL}
              strokeWidth={2}
              fill={ACTUAL}
              fillOpacity={0.12}
              type="monotone"
              connectNulls
              dot={false}
              activeDot={{ r: 4, stroke: "hsl(var(--card))", strokeWidth: 2, fill: ACTUAL }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

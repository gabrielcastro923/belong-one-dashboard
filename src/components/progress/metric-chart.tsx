"use client";

import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fmtDay } from "@/lib/dates";

export interface ChartRow {
  date: string;
  actual?: number;
  target?: number;
}

const TARGET = "rgb(var(--muted))";
const GRID = "rgb(var(--line))";

function Tip({ active, payload, label }: { active?: boolean; payload?: { dataKey: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length || !label) return null;
  const get = (k: string) => payload.find((p) => p.dataKey === k)?.value;
  const a = get("actual");
  const t = get("target");
  return (
    <div className="tnum rounded-md bg-tip px-3 py-2 text-xs text-white shadow-[0_12px_32px_-8px_rgb(0_0_0/.35)]">
      <div className="text-white/70">{fmtDay(label)}</div>
      {a !== undefined && (
        <div className="flex items-baseline gap-1.5">
          <span className="text-[17px] font-semibold leading-6">{a}</span>
          <span className="text-white/70">actual</span>
        </div>
      )}
      {t !== undefined && <div className="text-white/70">Pace {t.toFixed(1)}</div>}
    </div>
  );
}

export function MetricChart({ title, rows, goal, last, color }: { title: string; rows: ChartRow[]; goal: number; last?: number; color: string }) {
  const ACTUAL = color;
  return (
    <section className="min-w-0 rounded-lg border border-line bg-card p-5">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} aria-hidden />
        <h2 className="text-sm font-medium text-ink-2">{title}</h2>
      </div>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="num text-[32px] font-semibold leading-9">{last ?? 0}</span>
        <span className="tnum text-sm text-muted">of {goal}</span>
      </p>
      <p className="mt-1 flex items-center gap-3 text-2xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-3 rounded-full" style={{ background: color }} aria-hidden /> Actual
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 border-t border-dashed border-muted" aria-hidden /> Checkpoint pace
        </span>
      </p>
      <div className="mt-3 h-44 touch-pan-y">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
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
              fillOpacity={0.14}
              type="monotone"
              connectNulls
              dot={false}
              activeDot={{ r: 4, stroke: "rgb(var(--card))", strokeWidth: 2, fill: ACTUAL }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

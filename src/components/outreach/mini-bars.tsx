"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GRID, SERIES, TipBox, tick } from "./chart-bits";

export interface MiniRow {
  x: string;
  y: number | null;
  /** Tooltip lines below the title. */
  tip: { label: string; value: string | number }[];
  /** Low-n bars draw hollow so they read as unreliable without relying on color. */
  faint?: boolean;
}

export function MiniBars({ title, rows, height = 160, decimals = 0 }: { title: string; rows: MiniRow[]; height?: number; decimals?: number }) {
  const data = rows.map((r) => ({ ...r, v: r.y ?? 0 }));
  const anyFaint = rows.some((r) => r.faint);
  return (
    <div className="min-w-0 rounded-lg border border-border bg-card p-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      {anyFaint && <p className="text-xs text-muted-foreground">Outlined bars: under 100 sends, too small to read.</p>}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid stroke={GRID} strokeOpacity={0.6} vertical={false} />
            <XAxis dataKey="x" tick={tick} tickLine={false} axisLine={{ stroke: GRID }} interval="preserveStartEnd" minTickGap={4} />
            <YAxis allowDecimals={decimals > 0} tick={tick} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))", fillOpacity: 0.5 }}
              content={({ active, payload }) => {
                const r = payload?.[0]?.payload as (MiniRow & { v: number }) | undefined;
                if (!active || !r) return null;
                return <TipBox title={r.x} rows={r.tip} />;
              }}
            />
            <Bar
              dataKey="v"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
              isAnimationActive={false}
              shape={(props: unknown) => {
                const p = props as { x: number; y: number; width: number; height: number; payload: MiniRow };
                if (!p.height || p.height <= 0) return <g />;
                const r = Math.min(4, p.width / 2, p.height);
                const { x, y, width: w, height: h } = p;
                const d = `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
                return p.payload.faint ? (
                  <path d={d} fill={SERIES} fillOpacity={0.15} stroke={SERIES} strokeWidth={1.5} strokeDasharray="3 2" />
                ) : (
                  <path d={d} fill={SERIES} />
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

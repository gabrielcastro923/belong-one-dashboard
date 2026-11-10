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

/** Bars: pale fill of the entity colour with a solid 3px cap; low-n bars dashed and hollow. */
export function MiniBars({ title, rows, height = 160, decimals = 0, color = SERIES }: { title: string; rows: MiniRow[]; height?: number; decimals?: number; color?: string }) {
  const data = rows.map((r) => ({ ...r, v: r.y ?? 0 }));
  const anyFaint = rows.some((r) => r.faint);
  return (
    <div className="min-w-0 rounded-lg border border-line bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {anyFaint && (
          <span className="inline-flex items-center gap-1.5 text-2xs text-muted">
            <span className="h-2.5 w-2.5 rounded-[2px] border border-dashed" style={{ borderColor: color }} aria-hidden />
            n&lt;100
          </span>
        )}
      </div>
      <div style={{ height }} className="mt-2 touch-pan-y">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 6, right: 0, bottom: 0, left: -22 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="x" tick={tick} tickLine={false} axisLine={{ stroke: GRID }} interval="preserveStartEnd" minTickGap={4} />
            <YAxis allowDecimals={decimals > 0} tick={tick} tickLine={false} axisLine={false} tickCount={4} />
            <Tooltip
              cursor={{ fill: "rgb(var(--soft))", fillOpacity: 0.8 }}
              content={({ active, payload }) => {
                const r = payload?.[0]?.payload as (MiniRow & { v: number }) | undefined;
                if (!active || !r) return null;
                return <TipBox title={r.x} rows={r.tip} />;
              }}
            />
            <Bar
              dataKey="v"
              maxBarSize={32}
              isAnimationActive={false}
              shape={(props: unknown) => {
                const p = props as { x: number; y: number; width: number; height: number; payload: MiniRow };
                if (!p.height || p.height <= 0) return <g />;
                const r = Math.min(3, p.width / 2, p.height);
                const { x, y, width: w, height: h } = p;
                const d = `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
                const capH = Math.min(3, h);
                return p.payload.faint ? (
                  <path d={d} fill={color} fillOpacity={0.08} stroke={color} strokeWidth={1.25} strokeDasharray="3 2" />
                ) : (
                  <g>
                    <path d={d} fill={color} fillOpacity={0.28} />
                    <rect x={x} y={y} width={w} height={capH} rx={Math.min(1.5, capH / 2)} fill={color} />
                  </g>
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

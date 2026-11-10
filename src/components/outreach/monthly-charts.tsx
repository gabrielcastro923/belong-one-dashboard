"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Outreach } from "@/lib/types";
import { OTHER, fmtMonth } from "@/lib/outreach";
import { CONSULT, GRID, INK, LegendItem, SERIES, SURFACE, TipBox, tick } from "./chart-bits";
import { SectionHead } from "./shared";

type Row = Record<string, number | string>;
const OTHER_KEY = "__other";

export function MonthlyCharts({ o, colors, order }: { o: Outreach; colors: Record<string, string>; order: { key: string; label: string }[] }) {
  const colored = order.filter((l) => colors[l.key] && colors[l.key] !== OTHER);
  const hasOther = order.some((l) => colors[l.key] === OTHER);
  const keys = [...colored.map((l) => l.key), ...(hasOther ? [OTHER_KEY] : [])];
  const labelOf = (k: string) => (k === OTHER_KEY ? "Other lanes" : order.find((l) => l.key === k)?.label ?? k);
  const colorOf = (k: string) => (k === OTHER_KEY ? OTHER : colors[k]);

  const months = o.window_months.length ? o.window_months : o.totals.months.map((m) => m.month);
  const rows: Row[] = months.map((month) => {
    const r: Row = { month };
    keys.forEach((k) => (r[k] = 0));
    for (const l of o.lanes) {
      const m = l.months.find((x) => x.month === month);
      if (!m) continue;
      const k = colors[l.key] && colors[l.key] !== OTHER ? l.key : OTHER_KEY;
      if (k in r) r[k] = (r[k] as number) + m.sent;
    }
    const t = o.totals.months.find((x) => x.month === month);
    r.total = t?.sent ?? keys.reduce((s, k) => s + (r[k] as number), 0);
    r.consult = t?.bookings_consult ?? 0;
    r.report = t?.bookings_report ?? 0;
    r.replies = t?.replies ?? 0;
    r.uncredited = t?.bookings_no_prior_email ?? -1;
    return r;
  });
  const top = keys[keys.length - 1];

  return (
    <section className="min-w-0 space-y-3">
      <SectionHead title="By month" sub="Two charts on purpose: sends run in the thousands, bookings in single digits. Same months on both x axes." />
      <div className="grid gap-3 lg:grid-cols-[3fr_2fr]">
        <div className="min-w-0 rounded-lg border border-line bg-card p-4">
          <h3 className="text-sm font-medium">Sent by lane</h3>
          <p className="mb-2 mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
            {keys.map((k) => (
              <LegendItem key={k} color={colorOf(k)} label={labelOf(k)} />
            ))}
          </p>
          <div className="h-56 touch-pan-y">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="month" tickFormatter={fmtMonth} tick={tick} tickLine={false} axisLine={{ stroke: GRID }} />
                <YAxis allowDecimals={false} tick={tick} tickLine={false} axisLine={false} tickCount={5} />
                <Tooltip
                  cursor={{ fill: "rgb(var(--soft))", fillOpacity: 0.8 }}
                  content={({ active, label }) => {
                    const r = rows.find((x) => x.month === label);
                    if (!active || !r) return null;
                    return (
                      <TipBox
                        title={`${fmtMonth(String(label))} · ${r.total} sent`}
                        rows={[...keys]
                          .reverse()
                          .filter((k) => (r[k] as number) > 0)
                          .map((k) => ({ label: labelOf(k), value: r[k] as number, color: colorOf(k) }))}
                      />
                    );
                  }}
                />
                {keys.map((k) => (
                  <Bar
                    key={k}
                    dataKey={k}
                    stackId="sent"
                    fill={colorOf(k)}
                    stroke={SURFACE}
                    strokeWidth={1}
                    radius={k === top ? [3, 3, 0, 0] : 0}
                    maxBarSize={48}
                    isAnimationActive={false}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="min-w-0 rounded-lg border border-line bg-card p-4">
          <h3 className="text-sm font-medium">Bookings credited to email</h3>
          <p className="mb-2 mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
            <LegendItem color={SERIES} label="Report call (predicts a listing)" line />
            <LegendItem color={CONSULT} label="Consult" line dashed />
          </p>
          <div className="h-56 touch-pan-y">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="month" tickFormatter={fmtMonth} tick={tick} tickLine={false} axisLine={{ stroke: GRID }} />
                <YAxis allowDecimals={false} tick={tick} tickLine={false} axisLine={false} tickCount={5} />
                <Tooltip
                  cursor={{ stroke: INK, strokeDasharray: "2 2" }}
                  content={({ active, label }) => {
                    const r = rows.find((x) => x.month === label);
                    if (!active || !r) return null;
                    return (
                      <TipBox
                        title={`${fmtMonth(String(label))} · ${r.total} sent`}
                        rows={[
                          { label: "Report call", value: r.report as number, color: SERIES },
                          { label: "Consult", value: r.consult as number, color: CONSULT, dashed: true },
                          { label: "Replies", value: r.replies as number },
                          ...((r.uncredited as number) >= 0 ? [{ label: "Booked, no prior email", value: r.uncredited as number }] : []),
                        ]}
                      />
                    );
                  }}
                />
                <Line dataKey="consult" stroke={CONSULT} strokeWidth={1.5} strokeDasharray="4 3" dot={false} activeDot={{ r: 4, stroke: SURFACE, strokeWidth: 2, fill: CONSULT }} isAnimationActive={false} />
                <Line dataKey="report" stroke={SERIES} strokeWidth={2} dot={{ r: 2.5, stroke: SURFACE, strokeWidth: 1.5, fill: SERIES }} activeDot={{ r: 4, stroke: SURFACE, strokeWidth: 2, fill: SERIES }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <details className="group text-xs">
        <summary className="inline-flex cursor-pointer items-center gap-1.5 text-muted hover:text-ink">
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="transition-transform group-open:rotate-90">
            <path d="M3.5 2 6.5 5 3.5 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Table view
        </summary>
        <div className="mt-2 overflow-x-auto rounded-lg border border-line bg-card">
          <table className="w-full text-sm">
            <thead className="bg-soft/50 text-left text-xs text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">Month</th>
                <th className="px-3 py-2 text-right font-medium">Sent</th>
                <th className="px-3 py-2 text-right font-medium">Replies</th>
                <th className="px-3 py-2 text-right font-medium">Consult</th>
                <th className="px-3 py-2 text-right font-medium">Report</th>
              </tr>
            </thead>
            <tbody className="tnum">
              {rows.map((r) => (
                <tr key={r.month as string} className="border-t border-line">
                  <td className="px-3 py-2">{r.month}</td>
                  <td className="px-3 py-2 text-right">{r.total}</td>
                  <td className="px-3 py-2 text-right">{r.replies}</td>
                  <td className="px-3 py-2 text-right">{r.consult}</td>
                  <td className="px-3 py-2 text-right">{r.report}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

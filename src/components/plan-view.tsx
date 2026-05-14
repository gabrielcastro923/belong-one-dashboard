"use client";

import { useMemo, useState } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { mockOpportunities, mockPlan } from "@/data/data";
import type { Opportunity } from "@/data/data";
import { scoreOpportunity, stageWeight } from "@/lib/score";
import { expectedClosesThisMonth, funnelByStage, pacePerBdRequired } from "@/lib/plan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function byPhoneCount(opps: Opportunity[]) {
  const m = new Map<string, number>();
  for (const o of opps) m.set(o.phone, (m.get(o.phone) ?? 0) + 1);
  return m;
}

export function PlanView() {
  const { target, banked, businessDaysRemaining } = mockPlan;
  const remaining = Math.max(0, target - banked);
  const pace = pacePerBdRequired(remaining, businessDaysRemaining);
  const projectedPipeline = expectedClosesThisMonth(mockOpportunities);
  const needFromNew = Math.max(0, Math.round((target - projectedPipeline) * 10) / 10);
  const funnel = funnelByStage(mockOpportunities);
  const byPhone = useMemo(() => byPhoneCount(mockOpportunities), []);
  const ranked = useMemo(
    () =>
      [...mockOpportunities]
        .map((o) => ({ o, score: scoreOpportunity(o, byPhone.get(o.phone) ?? 0) }))
        .sort((a, b) => b.score - a.score),
    [byPhone]
  );
  const top5 = ranked.slice(0, 5);
  const [done, setDone] = useState<Record<string, boolean>>(() => Object.fromEntries(top5.map((r) => [r.o.id, false])));

  const checkedWeight = useMemo(
    () => top5.reduce((s, r) => (done[r.o.id] ? s : s + stageWeight(r.o.stage)), 0),
    [done, top5]
  );

  const chartData = useMemo(() => {
    const rows: { d: number; pace: number; projected: number }[] = [];
    for (let d = 0; d <= businessDaysRemaining; d++) {
      const paceTotal = Math.min(target, banked + pace * d);
      const bump = checkedWeight * Math.min(d / 5, 1);
      const projected = Math.min(target, banked + bump);
      rows.push({ d, pace: Math.round(paceTotal * 100) / 100, projected: Math.round(projected * 100) / 100 });
    }
    return rows;
  }, [banked, businessDaysRemaining, checkedWeight, pace, target]);

  const barColors = ["#34d399", "#38bdf8", "#a78bfa", "#fbbf24", "#fb923c", "#94a3b8"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Plan</h1>
        <p className="text-sm text-muted-foreground">May burndown, pipeline truth, and today&apos;s commitments.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Burndown</CardTitle>
            <p className="text-xs text-muted-foreground">
              Solid: on-pace cumulative ({pace} / BD). Dotted: projection from commitments still open ({checkedWeight.toFixed(2)} wt).
            </p>
          </CardHeader>
          <CardContent className="h-64 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 19% 18%)" />
                <XAxis dataKey="d" tick={{ fill: "#94a3b8", fontSize: 10 }} label={{ value: "BD ahead", position: "insideBottom", offset: -2, fill: "#64748b", fontSize: 10 }} />
                <YAxis domain={[0, target]} tick={{ fill: "#94a3b8", fontSize: 10 }} width={28} />
                <Tooltip contentStyle={{ background: "hsl(222 40% 9%)", border: "1px solid hsl(217 19% 18%)", fontSize: 12 }} />
                <Line type="monotone" dataKey="pace" name="Required pace" stroke="hsl(152 55% 42%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="projected" name="Commitment projection" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pipeline funnel</CardTitle>
            <p className="text-xs text-muted-foreground">
              Existing pipeline projects <span className="font-semibold text-foreground">{Math.round(projectedPipeline * 10) / 10}</span> closes (stage-weighted).
              {needFromNew > 0 ? (
                <>
                  {" "}
                  Need <span className="font-semibold text-foreground">{needFromNew}</span> more from new pipeline.
                </>
              ) : (
                " On track if execution holds."
              )}
            </p>
          </CardHeader>
          <CardContent className="h-64 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={funnel} margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 19% 18%)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis type="category" dataKey="stage" width={120} tick={{ fill: "#cbd5e1", fontSize: 9 }} />
                <Tooltip contentStyle={{ background: "hsl(222 40% 9%)", border: "1px solid hsl(217 19% 18%)", fontSize: 12 }} />
                <Bar dataKey="count" name="Count" radius={[0, 4, 4, 0]}>
                  {funnel.map((_, i) => (
                    <Cell key={i} fill={barColors[i % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
              {funnel.map((f) => (
                <span key={f.stage}>
                  {f.stage}: {f.expected} exp
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Today&apos;s commitments</CardTitle>
          <p className="text-xs text-muted-foreground">Pulled from Today&apos;s Calls top 5. Toggle done to stress-test the projection.</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {top5.map((r, i) => (
            <label key={r.o.id} className="flex cursor-pointer items-start gap-3 rounded-md border border-border/60 bg-muted/20 px-3 py-2">
              <input
                type="checkbox"
                checked={!!done[r.o.id]}
                onChange={() => setDone((d) => ({ ...d, [r.o.id]: !d[r.o.id] }))}
                className="mt-1 h-4 w-4 rounded border-border"
              />
              <span className="text-sm">
                <span className="text-muted-foreground">#{i + 1}</span> {r.o.owner} · {r.o.address}{" "}
                <span className="text-xs text-muted-foreground">({stageWeight(r.o.stage)} wt)</span>
              </span>
            </label>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

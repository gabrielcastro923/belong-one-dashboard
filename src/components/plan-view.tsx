"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { mockOpportunities, mockPlan } from "@/data/data";
import type { DueWindow, Opportunity } from "@/data/data";
import { scoreOpportunity } from "@/lib/score";
import { pacePerBdRequired } from "@/lib/plan";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowDownUp, CalendarDays, CheckCircle2, ClipboardCheck, Home, SearchCheck, Target } from "lucide-react";

const INSPECTION_TO_REPORT = 0.6;
const REPORT_TO_LISTING = 0.7;
const INSPECTION_TO_LISTING = INSPECTION_TO_REPORT * REPORT_TO_LISTING;

type WindowView = "today" | "week" | "month";
type SortKey = "inspection" | "report" | "impact" | "risk";
type ActivityType = "inspection" | "report" | "listing-ready";

type ActivityRow = {
  o: Opportunity;
  score: number;
  type: ActivityType;
  dueWindow: DueWindow;
  impact: number;
  urgency: number;
  primaryAction: string;
};

const WINDOW_LABELS: Record<WindowView, string> = {
  today: "Today",
  week: "This week",
  month: "This month",
};

function dueRank(w: DueWindow): number {
  if (w === "today") return 0;
  if (w === "week") return 1;
  return 2;
}

function inWindow(due: DueWindow | null, view: WindowView): due is DueWindow {
  if (!due) return false;
  return dueRank(due) <= dueRank(view);
}

function byPhoneCount(opps: Opportunity[]) {
  const m = new Map<string, number>();
  for (const o of opps) m.set(o.phone, (m.get(o.phone) ?? 0) + 1);
  return m;
}

function isInspectionToBook(o: Opportunity, view: WindowView): boolean {
  return o.stage === "Schedule Inspection" && !o.inspectionBooked && inWindow(o.inspectionDueWindow, view);
}

function isReportToConfirm(o: Opportunity, view: WindowView): boolean {
  return !o.reportConfirmed && inWindow(o.reportDueWindow, view);
}

function isListingReady(o: Opportunity, view: WindowView): boolean {
  return o.stage === "Ready For Handoff" && view === "month";
}

function rowTypeLabel(type: ActivityType): string {
  if (type === "inspection") return "Inspection to book";
  if (type === "report") return "Report to confirm";
  return "Listing-ready";
}

function actionFor(row: ActivityRow): string {
  if (row.type === "inspection") return "Book inspection and get agreement signature";
  if (row.type === "report") return "Confirm report review and pricing alignment";
  return "Close handoff so listing can go live";
}

function impactFor(type: ActivityType, o: Opportunity): number {
  if (type === "inspection") return INSPECTION_TO_LISTING;
  if (type === "report") return REPORT_TO_LISTING;
  return o.listingProbability;
}

function urgencyFor(o: Opportunity, dueWindow: DueWindow, score: number): number {
  const due = dueWindow === "today" ? 40 : dueWindow === "week" ? 22 : 8;
  const vacancy = Math.min(o.vacancyDays, 35);
  const stale = Math.min(o.lastContactDaysAgo * 2, 24);
  return Math.round(due + vacancy + stale + score / 5);
}

function formatHomes(n: number): string {
  return `${Math.ceil(n)}`;
}

function formatDecimal(n: number): string {
  return (Math.round(n * 10) / 10).toFixed(1);
}

function makeRows(opps: Opportunity[], view: WindowView): ActivityRow[] {
  const counts = byPhoneCount(opps);
  const rows: ActivityRow[] = [];

  for (const o of opps) {
    const score = scoreOpportunity(o, counts.get(o.phone) ?? 0);
    if (isInspectionToBook(o, view)) {
      rows.push({
        o,
        score,
        type: "inspection",
        dueWindow: o.inspectionDueWindow,
        impact: impactFor("inspection", o),
        urgency: urgencyFor(o, o.inspectionDueWindow, score),
        primaryAction: "Book inspection and get agreement signature",
      });
    }
    if (isReportToConfirm(o, view)) {
      const reportDueWindow = o.reportDueWindow;
      if (!reportDueWindow) continue;
      rows.push({
        o,
        score,
        type: "report",
        dueWindow: reportDueWindow,
        impact: impactFor("report", o),
        urgency: urgencyFor(o, reportDueWindow, score),
        primaryAction: "Confirm report review and pricing alignment",
      });
    }
    if (isListingReady(o, view)) {
      rows.push({
        o,
        score,
        type: "listing-ready",
        dueWindow: "month",
        impact: impactFor("listing-ready", o),
        urgency: urgencyFor(o, "month", score),
        primaryAction: "Close handoff so listing can go live",
      });
    }
  }

  return rows;
}

function sortRows(rows: ActivityRow[], sortKey: SortKey): ActivityRow[] {
  const typeRank: Record<ActivityType, number> = { inspection: 3, report: 2, "listing-ready": 1 };
  return [...rows].sort((a, b) => {
    if (sortKey === "inspection") {
      return Number(b.type === "inspection") - Number(a.type === "inspection") || dueRank(a.dueWindow) - dueRank(b.dueWindow) || b.urgency - a.urgency;
    }
    if (sortKey === "report") {
      return Number(b.type === "report") - Number(a.type === "report") || dueRank(a.dueWindow) - dueRank(b.dueWindow) || b.urgency - a.urgency;
    }
    if (sortKey === "risk") return b.urgency - a.urgency || b.impact - a.impact;
    return b.impact - a.impact || typeRank[b.type] - typeRank[a.type] || b.urgency - a.urgency;
  });
}

export function PlanView() {
  const { target: defaultTarget, banked, businessDaysRemaining } = mockPlan;
  const [goalTarget, setGoalTarget] = useState(defaultTarget);
  const remaining = Math.max(0, goalTarget - banked);
  const pace = pacePerBdRequired(remaining, businessDaysRemaining);
  const [view, setView] = useState<WindowView>("today");
  const [sortKey, setSortKey] = useState<SortKey>("impact");

  const rows = useMemo(() => makeRows(mockOpportunities, view), [view]);
  const todayRows = useMemo(() => makeRows(mockOpportunities, "today"), []);
  const sortedRows = useMemo(() => sortRows(rows, sortKey), [rows, sortKey]);

  const inspectionsToBook = rows.filter((r) => r.type === "inspection").length;
  const reportsToConfirm = rows.filter((r) => r.type === "report").length;
  const listingReady = rows.filter((r) => r.type === "listing-ready").length;
  const inspectionImpact = inspectionsToBook * INSPECTION_TO_LISTING;
  const reportImpact = reportsToConfirm * REPORT_TO_LISTING;
  const listingReadyImpact = rows.filter((r) => r.type === "listing-ready").reduce((sum, r) => sum + r.impact, 0);
  const expectedImpact = inspectionImpact + reportImpact + listingReadyImpact;
  const projectedTotal = banked + expectedImpact;
  const gapToTarget = Math.max(0, goalTarget - projectedTotal);
  const dailyListingTarget = Math.ceil(pace);
  const reportTargetToday = Math.ceil(dailyListingTarget / REPORT_TO_LISTING);
  const inspectionTargetToday = Math.ceil(dailyListingTarget / INSPECTION_TO_LISTING);
  const todayInspectionsAvailable = todayRows.filter((r) => r.type === "inspection").length;
  const todayReportsAvailable = todayRows.filter((r) => r.type === "report").length;
  const todayExpectedImpact = todayInspectionsAvailable * INSPECTION_TO_LISTING + todayReportsAvailable * REPORT_TO_LISTING;
  const isOnTrack = projectedTotal >= goalTarget || (view !== "month" && expectedImpact >= pace);
  const statusLabel = projectedTotal >= goalTarget ? `Covers ${goalTarget}` : isOnTrack ? "On pace" : "Behind pace";
  const statusClass = projectedTotal >= goalTarget || isOnTrack ? "border-primary/40 bg-primary/15 text-primary-foreground" : "border-red-500/40 bg-red-500/15 text-red-100";

  const chartData = [
    { name: "Book inspections", listings: Math.ceil(inspectionImpact) },
    { name: "Confirm reports", listings: Math.ceil(reportImpact) },
    { name: "Listing-ready", listings: Math.ceil(listingReadyImpact) },
  ];

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "inspection", label: "Inspections" },
    { key: "report", label: "Reports" },
    { key: "impact", label: "Listing impact" },
    { key: "risk", label: "Risk / urgency" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Funnel Activity Plan</h1>
          <p className="text-sm text-muted-foreground">Book inspections, confirm reports, and convert the inspection path into {goalTarget} May listings.</p>
        </div>
        <div className="flex w-fit rounded-lg border border-border bg-card p-1">
          {(["today", "week", "month"] as WindowView[]).map((w) => (
            <Button key={w} size="sm" variant={view === w ? "secondary" : "ghost"} className="h-8" onClick={() => setView(w)}>
              {WINDOW_LABELS[w]}
            </Button>
          ))}
        </div>
      </div>

      <Card className="border-border/80">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-2">
                <p className="text-sm font-medium">Monthly home goal</p>
                <span className="text-2xl font-semibold tabular-nums">{goalTarget}</span>
              </div>
              <p className="text-xs text-muted-foreground">Slide from 15 to 40 homes and the daily inspection/report targets update.</p>
            </div>
            <div className="w-full md:max-w-md">
              <input
                type="range"
                min={15}
                max={40}
                step={1}
                value={goalTarget}
                onChange={(event) => setGoalTarget(Number(event.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                aria-label="Monthly home goal"
              />
              <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                <span>15 homes</span>
                <span>40 homes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-4">
        <Card className="border-sky-500/25 bg-sky-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{WINDOW_LABELS[view]} inspections</span>
              <SearchCheck className="h-4 w-4 text-sky-300" />
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{inspectionsToBook}</p>
            <p className="text-xs text-muted-foreground">to book to create report flow</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/25 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{WINDOW_LABELS[view]} reports</span>
              <ClipboardCheck className="h-4 w-4 text-amber-300" />
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{reportsToConfirm}</p>
            <p className="text-xs text-muted-foreground">to confirm into listing approval</p>
          </CardContent>
        </Card>
        <Card className="border-primary/25 bg-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Expected listings</span>
              <Home className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{formatHomes(expectedImpact)}</p>
            <p className="text-xs text-muted-foreground">from selected funnel activity</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Gap to {goalTarget}</span>
              <Target className="h-4 w-4 text-red-300" />
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{formatHomes(gapToTarget)}</p>
            <p className="text-xs text-muted-foreground">{banked} banked · {remaining} left</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/30 bg-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-primary" />
            Targets to Hit Today
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Daily pace rounds up to {dailyListingTarget} listing. Cover that by confirming reports or booking enough inspections to feed reports.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-background/35 p-3">
            <p className="text-xs text-muted-foreground">Listing target</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{dailyListingTarget}</p>
            <p className="text-xs text-muted-foreground">{formatDecimal(pace)} raw pace rounded up</p>
          </div>
          <div className="rounded-lg border border-border bg-background/35 p-3">
            <p className="text-xs text-muted-foreground">Reports to confirm</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{reportTargetToday}</p>
            <p className="text-xs text-muted-foreground">{todayReportsAvailable} in today&apos;s queue</p>
          </div>
          <div className="rounded-lg border border-border bg-background/35 p-3">
            <p className="text-xs text-muted-foreground">Inspections to book</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{inspectionTargetToday}</p>
            <p className="text-xs text-muted-foreground">{todayInspectionsAvailable} in today&apos;s queue</p>
          </div>
          <div className="rounded-lg border border-border bg-background/35 p-3">
            <p className="text-xs text-muted-foreground">Today&apos;s coverage</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{formatHomes(todayExpectedImpact)}</p>
            <p className="text-xs text-muted-foreground">{formatDecimal(todayExpectedImpact)} expected rounded up</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/80">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Stay on Track
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Defaults: 60% inspection-to-report, 70% report-to-listing. Today pace target is {dailyListingTarget} listing.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className={`w-fit rounded-md border px-2 py-1 text-xs font-medium ${statusClass}`}>{statusLabel}</div>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center justify-between rounded-md border border-border/70 bg-background/35 px-3 py-2">
                <span className="text-muted-foreground">Reports confirmed impact</span>
                <span className="font-semibold tabular-nums">{reportsToConfirm} x 0.70 = {formatHomes(reportImpact)}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border/70 bg-background/35 px-3 py-2">
                <span className="text-muted-foreground">Inspections booked impact</span>
                <span className="font-semibold tabular-nums">{inspectionsToBook} x 0.60 x 0.70 = {formatHomes(inspectionImpact)}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border/70 bg-background/35 px-3 py-2">
                <span className="text-muted-foreground">Listing-ready coverage</span>
                <span className="font-semibold tabular-nums">{listingReady} homes = {formatHomes(listingReadyImpact)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-sky-300" />
              Listing Impact by Lever
            </CardTitle>
            <p className="text-xs text-muted-foreground">The Plan page only models inspection booking and report confirmation as controllable funnel activity.</p>
          </CardHeader>
          <CardContent className="h-60 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 19% 18%)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} width={28} />
                <Tooltip contentStyle={{ background: "hsl(222 40% 9%)", border: "1px solid hsl(217 19% 18%)", fontSize: 12 }} />
                <Bar dataKey="listings" name="Expected listings" fill="hsl(152 55% 42%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm">
                <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
                Activity Queue
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Sort by the lever you need to work to keep the {goalTarget}-listing target on track.</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {sortOptions.map((option) => (
                <Button key={option.key} size="sm" variant={sortKey === option.key ? "secondary" : "outline"} onClick={() => setSortKey(option.key)}>
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {sortedRows.map((row) => {
            const tel = row.o.phone.replace(/[^\d+]/g, "");
            return (
              <div key={`${row.o.id}-${row.type}`} className="grid gap-3 rounded-lg border border-border/80 bg-background/35 p-3 md:grid-cols-[1fr_150px_124px_92px] md:items-center">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={`tel:${tel}`} className="text-sm font-medium text-foreground hover:underline">
                      {row.o.owner}
                    </a>
                    <Badge variant={row.type === "report" ? "destructive" : row.type === "inspection" ? "outline" : "success"}>{rowTypeLabel(row.type)}</Badge>
                    <span className="text-xs text-muted-foreground">{row.o.stage}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {row.o.address} · {row.o.market}
                  </p>
                  <p className="text-xs text-foreground/85">{actionFor(row)}</p>
                </div>
                <div className="rounded-md border border-border bg-card px-2 py-1 text-xs">
                  Due {WINDOW_LABELS[row.dueWindow]} · score {row.score}
                </div>
                <div className="rounded-md border border-primary/25 bg-primary/10 px-2 py-1 text-xs text-primary-foreground/90">+{formatHomes(row.impact)} expected listings</div>
                <div className="flex items-center justify-between gap-2 md:justify-end">
                  <Badge variant={row.urgency >= 95 ? "destructive" : "default"} className="gap-1">
                    {row.urgency >= 95 && <AlertTriangle className="h-3 w-3" />}
                    Risk {row.urgency}
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

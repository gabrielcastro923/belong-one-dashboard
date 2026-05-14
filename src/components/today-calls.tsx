"use client";

import { useMemo, useState } from "react";
import { mockLeads, mockOpportunities } from "@/data/data";
import type { AttentionItem, AttentionSection, Opportunity } from "@/data/data";
import { scoreOpportunity, contributionLabel, scoreColorClass } from "@/lib/score";
import { bankedHomesIfClose } from "@/lib/plan";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertTriangle, ArrowUpRight, ChevronDown, Flame, Home, Mail, MessageSquare, Phone, Sparkles, Target } from "lucide-react";

function countsByPhone(opps: Opportunity[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const o of opps) m.set(o.phone, (m.get(o.phone) ?? 0) + 1);
  return m;
}

function stageBadgeClass(stage: Opportunity["stage"]): string {
  if (stage === "Ready For Handoff") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
  if (stage === "Schedule Inspection") return "border-sky-500/40 bg-sky-500/10 text-sky-200";
  if (stage === "Pending Inspection") return "border-violet-500/40 bg-violet-500/10 text-violet-200";
  if (stage === "Repair Report Neg") return "border-amber-500/40 bg-amber-500/10 text-amber-200";
  if (stage === "Agreement Neg") return "border-orange-500/40 bg-orange-500/10 text-orange-200";
  return "border-border bg-muted text-muted-foreground";
}

function mayCloseConfidence(o: Opportunity): number {
  if (o.stage === "Ready For Handoff") return 95;
  if (o.stage === "Repair Report Neg") return 78;
  if (o.stage === "Pending Inspection") return 70;
  if (o.stage === "Schedule Inspection") return 62;
  if (o.stage === "Agreement Neg") return 48;
  return 24;
}

function riskScore(o: Opportunity): number {
  const stale = Math.min(o.lastContactDaysAgo * 4, 44);
  const vacancy = Math.min(o.vacancyDays * 1.3, 36);
  const engagement = o.lastLoginDaysAgo == null ? 14 : o.lastLoginDaysAgo > 10 ? 10 : 0;
  const fragileStage = o.stage === "Repair Report Neg" || o.stage === "Agreement Neg" ? 12 : 0;
  return Math.round(stale + vacancy + engagement + fragileStage);
}

function expectedHomeValue(o: Opportunity): number {
  return Math.round(stageWeightForClose(o.stage) * 10) / 10;
}

function stageWeightForClose(stage: Opportunity["stage"]): number {
  if (stage === "Ready For Handoff" || stage === "Schedule Inspection") return 1;
  if (stage === "Repair Report Neg") return 0.8;
  if (stage === "Pending Inspection") return 0.7;
  if (stage === "Agreement Neg") return 0.5;
  return 0.2;
}

function nextCloseMove(o: Opportunity): string {
  if (o.stage === "Ready For Handoff") return "Book PM handoff and confirm owner approval";
  if (o.stage === "Repair Report Neg") return "Resolve repair cap or vendor swap today";
  if (o.stage === "Pending Inspection") return "Confirm inspection window and decision call";
  if (o.stage === "Schedule Inspection") return "Lock inspection slot before calendar slips";
  if (o.stage === "Agreement Neg") return "Close rate/start-date objection";
  return "Qualify fit and move to inspection path";
}

const ATTENTION_LABELS: Record<AttentionSection, string> = {
  stuck_late: "Stuck late stage",
  proposal_silence: "Proposal silence",
  unanswered_inbound: "Unanswered inbound",
  inspection_24h: "24h inspection confirm",
  hot_reengaged: "Hot re-engaged",
  multi_cluster: "Multi-property cluster",
  logged_uncalled: "Logged in, uncalled",
};

function attentionSlipWeight(key: AttentionSection): number {
  if (key === "stuck_late") return 1;
  if (key === "hot_reengaged") return 0.6;
  if (key === "proposal_silence" || key === "inspection_24h" || key === "multi_cluster") return 0.5;
  if (key === "unanswered_inbound") return 0.4;
  if (key === "logged_uncalled") return 0.3;
  return 0;
}

function attentionPriority(key: AttentionSection): number {
  if (key === "stuck_late") return 7;
  if (key === "unanswered_inbound") return 6;
  if (key === "inspection_24h") return 5;
  if (key === "proposal_silence") return 4;
  if (key === "hot_reengaged") return 3;
  if (key === "multi_cluster") return 2;
  return 1;
}

function ChannelIcon({ item }: { item: AttentionItem }) {
  if (item.channel === "sms") return <MessageSquare className="h-3.5 w-3.5" />;
  if (item.channel === "email") return <Mail className="h-3.5 w-3.5" />;
  return <Phone className="h-3.5 w-3.5" />;
}

export function TodayCalls() {
  const [openScore, setOpenScore] = useState(false);
  const byPhone = useMemo(() => countsByPhone(mockOpportunities), []);
  const ranked = useMemo(() => {
    return [...mockOpportunities]
      .map((o) => ({ o, score: scoreOpportunity(o, byPhone.get(o.phone) ?? 0) }))
      .sort((a, b) => b.score - a.score);
  }, [byPhone]);
  const highImpact = ranked.slice(0, 6);
  const atRisk = useMemo(() => {
    return ranked
      .map((row) => ({ ...row, risk: riskScore(row.o) }))
      .sort((a, b) => b.risk - a.risk || b.score - a.score)
      .slice(0, 5);
  }, [ranked]);
  const mayClosers = useMemo(() => {
    return ranked
      .map((row) => ({
        ...row,
        confidence: mayCloseConfidence(row.o),
        expectedHomes: expectedHomeValue(row.o),
      }))
      .sort((a, b) => b.confidence - a.confidence || b.score - a.score);
  }, [ranked]);
  const attentionNeeded = useMemo(() => {
    return [...mockLeads].sort((a, b) => attentionPriority(b.section) - attentionPriority(a.section));
  }, []);
  const topAttention = attentionNeeded.slice(0, 5);
  const attentionSlip = Math.round(attentionNeeded.reduce((sum, item) => sum + attentionSlipWeight(item.section), 0) * 10) / 10;
  const top5 = ranked.slice(0, 5);
  const bank = bankedHomesIfClose(
    top5.map((r) => r.o),
    5
  );
  const target = 15;
  const banked = 4;
  const needed = target - banked;
  let runningExpected = banked;
  const expectedMayHomes = Math.round(mayClosers.reduce((sum, row) => sum + row.expectedHomes, banked) * 10) / 10;
  const atRiskHomes = Math.round(atRisk.reduce((sum, row) => sum + row.o.monthlyRent / 30, 0));
  const recommended = [
    {
      label: "Close path",
      title: mayClosers[0]?.o.owner ?? "No close candidate",
      detail: mayClosers[0] ? `${mayClosers[0].o.address} · ${mayClosers[0].confidence}% May close` : "No active opportunity",
      action: mayClosers[0] ? nextCloseMove(mayClosers[0].o) : "Add an active opportunity",
      phone: mayClosers[0]?.o.phone,
    },
    {
      label: "Attention needed",
      title: topAttention[0]?.owner ?? "No attention items",
      detail: topAttention[0] ? `${ATTENTION_LABELS[topAttention[0].section]} · ${topAttention[0].property}` : "Attention queue is clear",
      action: topAttention[0]?.blocker ?? "Keep working the recommended close path",
      phone: topAttention[0]?.phone,
    },
    {
      label: "Save call",
      title: atRisk[0]?.o.owner ?? "No at-risk owner",
      detail: atRisk[0] ? `${atRisk[0].o.address} · Risk ${atRisk[0].risk}` : "No save call needed",
      action: atRisk[0] ? nextCloseMove(atRisk[0].o) : "Keep monitoring",
      phone: atRisk[0]?.o.phone,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">May Close Command Center</h1>
          <p className="text-sm text-muted-foreground">Prioritize the calls that protect the 15-home month.</p>
        </div>
        <Badge variant="success" className="w-fit gap-1.5">
          <Target className="h-3.5 w-3.5" />
          {needed} more homes needed
        </Badge>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Card className="border-primary/30 bg-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>May path</span>
              <Home className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{expectedMayHomes}</p>
            <p className="text-xs text-muted-foreground">expected closes from active homes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Highest impact</span>
              <Flame className="h-4 w-4 text-orange-300" />
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{highImpact[0]?.score ?? 0}</p>
            <p className="text-xs text-muted-foreground">top call score today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Attention needed</span>
              <AlertTriangle className="h-4 w-4 text-red-300" />
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{attentionNeeded.length}</p>
            <p className="text-xs text-muted-foreground">items leaking ~{attentionSlip} homes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Revenue bleed</span>
              <ArrowUpRight className="h-4 w-4 text-sky-300" />
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums">${atRiskHomes}</p>
            <p className="text-xs text-muted-foreground">daily rent at risk in queue</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-sky-500/25 bg-sky-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-sky-300" />
            Recommended Next
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {recommended.map((item) => {
            const tel = item.phone?.replace(/[^\d+]/g, "");
            return (
              <div key={item.label} className="rounded-lg border border-border bg-background/45 p-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[11px]">
                    {item.label}
                  </Badge>
                  {tel && (
                    <Button size="sm" variant="ghost" className="h-8 w-8 px-0" asChild>
                      <a href={`tel:${tel}`} aria-label={`Call ${item.title}`}>
                        <Phone className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
                <p className="mt-2 text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                <p className="mt-2 text-xs text-foreground/85">{item.action}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-red-500/25">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-red-300" />
            Attention Needed on Today&apos;s Calls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {topAttention.map((item) => {
            const tel = item.phone.replace(/[^\d+]/g, "");
            return (
              <div key={item.id} className="flex flex-col gap-3 rounded-lg border border-border/80 bg-background/35 p-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{item.owner}</span>
                    <Badge variant={item.section === "stuck_late" ? "destructive" : "outline"}>{ATTENTION_LABELS[item.section]}</Badge>
                    <span className="text-xs text-muted-foreground">~{attentionSlipWeight(item.section)} home slip</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.property}</p>
                  <p className="text-xs text-foreground/90">{item.blocker}</p>
                  {item.preview && (
                    <p className="flex items-start gap-2 text-[11px] text-muted-foreground">
                      <ChannelIcon item={item} />
                      <span className="italic">&ldquo;{item.preview}&rdquo;</span>
                    </p>
                  )}
                </div>
                <Button size="sm" variant="secondary" className="shrink-0 gap-1.5" asChild>
                  <a href={`tel:${tel}`}>
                    <Phone className="h-3.5 w-3.5" />
                    Work now
                  </a>
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Collapsible open={openScore} onOpenChange={setOpenScore}>
        <Card className="border-border/80">
          <CollapsibleTrigger asChild>
            <button type="button" className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/30">
              <CardTitle className="text-sm">How this is scored</CardTitle>
              <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${openScore ? "rotate-180" : ""}`} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="border-t border-border/60 pb-4 pt-3 text-xs leading-relaxed text-muted-foreground">
              <p className="font-mono text-[11px] text-foreground/90">
                score = (stage_weight × 25) + (vacancy_days × rent_per_day_norm × 0.4) + engagement_boost + multi_property_bonus − recency_penalty
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Stage weights: RFH 1.0 · Repair Report Neg 0.85 · Pending Inspection 0.7 · Schedule Inspection 0.6 · Agreement Neg 0.4 · Open 0.2</li>
                <li>Engagement: +25 if last login ≤2d, else +15 if ≤7d</li>
                <li>Multi-property: +10 if owner has 2+ open opps</li>
                <li>Recency penalty: −10 if last contact ≤2d</li>
              </ul>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Flame className="h-4 w-4 text-orange-300" />
              Calls With Most Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {highImpact.map((row, i) => {
              const bleed = Math.round((row.o.monthlyRent / 30) * 100) / 100;
              const tel = row.o.phone.replace(/[^\d+]/g, "");
              return (
                <div key={row.o.id} className="group rounded-lg border border-border/80 bg-background/35 px-3 py-3 transition-colors hover:border-primary/50 hover:bg-background/70">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 text-right text-xs tabular-nums text-muted-foreground">{i + 1}</span>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <a href={`tel:${tel}`} className="text-sm font-medium text-foreground hover:underline">
                          {row.o.owner}
                        </a>
                        <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums ${scoreColorClass(row.score)}`}>{row.score}</span>
                        <Badge variant="outline" className={stageBadgeClass(row.o.stage)}>
                          {row.o.stage}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {row.o.address} · {row.o.market}
                      </p>
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        <span className="rounded bg-muted px-2 py-0.5 text-muted-foreground">
                          {row.o.vacancyDays}d vacant · ${bleed}/day
                        </span>
                        <span className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 text-primary-foreground/90">{contributionLabel(row.o.stage)}</span>
                      </div>
                      <p className="text-xs italic text-muted-foreground">&ldquo;{row.o.opener}&rdquo;</p>
                    </div>
                    <Button size="sm" variant="secondary" className="shrink-0 gap-1.5" asChild>
                      <a href={`tel:${tel}`}>
                        <Phone className="h-3.5 w-3.5" />
                        Call
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-red-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-red-300" />
              At-Risk Save Calls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {atRisk.map((row) => {
              const tel = row.o.phone.replace(/[^\d+]/g, "");
              return (
                <div key={row.o.id} className="rounded-lg border border-border/80 bg-background/35 px-3 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <a href={`tel:${tel}`} className="text-sm font-medium text-foreground hover:underline">
                          {row.o.owner}
                        </a>
                        <Badge variant="destructive">Risk {row.risk}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {row.o.address} · {row.o.stage}
                      </p>
                      <p className="text-xs text-red-100/80">
                        {row.o.lastContactDaysAgo}d since contact · {row.o.vacancyDays}d vacant · {row.o.lastLoginDaysAgo == null ? "no recent login" : `login ${row.o.lastLoginDaysAgo}d ago`}
                      </p>
                      <p className="text-xs text-muted-foreground">{nextCloseMove(row.o)}</p>
                    </div>
                    <Button size="sm" variant="outline" className="shrink-0 gap-1.5" asChild>
                      <a href={`tel:${tel}`}>
                        <Phone className="h-3.5 w-3.5" />
                        Save
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/25">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Home className="h-4 w-4 text-primary" />
            Scrollable May Close Path to 15 Homes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded-lg border border-border bg-background/35 p-3">
              <p className="text-xs text-muted-foreground">Banked</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">{banked}</p>
            </div>
            <div className="rounded-lg border border-border bg-background/35 p-3">
              <p className="text-xs text-muted-foreground">Need to close</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">{needed}</p>
            </div>
            <div className="rounded-lg border border-border bg-background/35 p-3">
              <p className="text-xs text-muted-foreground">If top 5 land this week</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">{bank.min === bank.max ? bank.min : `${bank.min}-${bank.max}`}</p>
            </div>
          </div>

          <div className="max-h-[440px] overflow-y-auto rounded-lg border border-border bg-background/35">
            {mayClosers.map((row, index) => {
              runningExpected = Math.round((runningExpected + row.expectedHomes) * 10) / 10;
              const tel = row.o.phone.replace(/[^\d+]/g, "");
              const status = runningExpected >= target ? "Gets to 15" : `${Math.max(0, Math.round((target - runningExpected) * 10) / 10)} left`;
              return (
                <div key={row.o.id} className="grid gap-3 border-b border-border/70 p-3 last:border-b-0 md:grid-cols-[36px_1fr_116px_108px] md:items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-xs tabular-nums text-muted-foreground">{index + 1}</div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <a href={`tel:${tel}`} className="text-sm font-medium text-foreground hover:underline">
                        {row.o.owner}
                      </a>
                      <Badge variant="outline" className={stageBadgeClass(row.o.stage)}>
                        {row.o.stage}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{row.confidence}% May close</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {row.o.address} · {nextCloseMove(row.o)}
                    </p>
                  </div>
                  <div className="rounded-md border border-primary/25 bg-primary/10 px-2 py-1 text-xs text-primary-foreground/90">
                    +{row.expectedHomes} home · {runningExpected}/15
                  </div>
                  <div className="flex items-center justify-between gap-2 md:justify-end">
                    <Badge variant={runningExpected >= target ? "success" : "default"}>{status}</Badge>
                    <Button size="sm" variant="ghost" className="h-8 w-8 px-0" asChild>
                      <a href={`tel:${tel}`} aria-label={`Call ${row.o.owner}`}>
                        <Phone className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="font-mono text-[11px] text-muted-foreground">Top 5 math: stage weights for ranks 1-5: {bank.detail} = {bank.min === bank.max ? bank.min : `${bank.min}-${bank.max}`} homes.</p>
        </CardContent>
      </Card>
    </div>
  );
}

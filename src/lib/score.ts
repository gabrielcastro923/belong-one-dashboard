import type { Opportunity, Stage } from "@/data/data";

const STAGE_WEIGHT: Record<Stage, number> = {
  "Ready For Handoff": 1,
  "Repair Report Neg": 0.85,
  "Pending Inspection": 0.7,
  "Schedule Inspection": 0.6,
  "Agreement Neg": 0.4,
  Open: 0.2,
};

export function stageWeight(stage: Stage): number {
  return STAGE_WEIGHT[stage];
}

export function engagementBoost(lastLoginDaysAgo: number | null): number {
  if (lastLoginDaysAgo == null) return 0;
  if (lastLoginDaysAgo <= 2) return 25;
  if (lastLoginDaysAgo <= 7) return 15;
  return 0;
}

export function recencyPenalty(lastContactDaysAgo: number): number {
  return lastContactDaysAgo <= 2 ? 10 : 0;
}

/** Monthly rent → $/day, capped for normalization term in formula */
export function rentPerDayNormalized(monthlyRent: number): number {
  const perDay = monthlyRent / 30;
  return Math.min(perDay / 120, 2);
}

export function scoreOpportunity(o: Opportunity, ownerOpenCount: number): number {
  const multi = ownerOpenCount >= 2 ? 10 : 0;
  const raw =
    stageWeight(o.stage) * 25 +
    o.vacancyDays * rentPerDayNormalized(o.monthlyRent) * 0.4 +
    engagementBoost(o.lastLoginDaysAgo) +
    multi -
    recencyPenalty(o.lastContactDaysAgo);
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function contributionLabel(stage: Stage): string {
  if (stage === "Ready For Handoff" || stage === "Schedule Inspection") return "+1 home if closed this week";
  if (stage === "Repair Report Neg") return "+0.5 expected";
  if (stage === "Pending Inspection") return "+0.7 expected";
  if (stage === "Agreement Neg") return "+0.35 expected";
  return "+0.2 expected";
}

export function scoreColorClass(score: number): string {
  if (score >= 80) return "bg-red-500/20 text-red-300 border-red-500/40";
  if (score >= 60) return "bg-orange-500/20 text-orange-200 border-orange-500/40";
  return "bg-yellow-500/15 text-yellow-200 border-yellow-500/35";
}

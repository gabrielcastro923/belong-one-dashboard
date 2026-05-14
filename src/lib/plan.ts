import type { Opportunity, Stage } from "@/data/data";
import { stageWeight } from "@/lib/score";

export function pacePerBdRequired(remaining: number, businessDays: number): number {
  if (businessDays <= 0) return remaining;
  return Math.round((remaining / businessDays) * 100) / 100;
}

export function expectedClosesThisMonth(opps: Opportunity[]): number {
  return opps.reduce((s, o) => s + stageWeight(o.stage), 0);
}

export function funnelByStage(opps: Opportunity[]): { stage: Stage; count: number; expected: number }[] {
  const stages: Stage[] = [
    "Ready For Handoff",
    "Schedule Inspection",
    "Pending Inspection",
    "Repair Report Neg",
    "Agreement Neg",
    "Open",
  ];
  return stages.map((stage) => {
    const list = opps.filter((o) => o.stage === stage);
    const count = list.length;
    const expected = Math.round(count * stageWeight(stage) * 10) / 10;
    return { stage, count, expected };
  });
}

/** Rough week bank if top N close: RFH/SI=1, others use stage weight */
export function bankedHomesIfClose(opps: Opportunity[], n: number): { min: number; max: number; detail: string } {
  const top = opps.slice(0, n);
  let min = 0;
  let max = 0;
  const parts: string[] = [];
  for (const o of top) {
    const w = stageWeight(o.stage);
    min += Math.floor(w);
    max += Math.ceil(w);
    parts.push(`${o.owner.split(" ")[0]}:${w}`);
  }
  const detail = parts.join(" + ");
  return { min, max, detail };
}

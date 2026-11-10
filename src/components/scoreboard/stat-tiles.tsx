"use client";

import type { Pipeline } from "@/lib/types";
import { checkpointRows, monthTargets, type Status } from "@/lib/pace";
import { fmtDay } from "@/lib/dates";
import { useToday } from "@/lib/storage";
import { FAM, type Family } from "@/lib/stage";
import { StatusChip } from "@/components/status-chip";
import { Tip } from "@/components/ui/hint";
import { cn } from "@/lib/utils";
import { TickBar } from "./meter";

type Slim = Pick<
  Pipeline,
  | "target"
  | "floor"
  | "listed_mtd"
  | "listed_names"
  | "report_calls_held_mtd"
  | "report_calls_booked_ahead"
  | "booked_ahead"
  | "inspections_completed_mtd"
  | "inspections_scheduled_ahead"
  | "checkpoints"
  | "progress"
  | "calls_target"
  | "calls_floor"
  | "insp_target"
  | "working_days_left"
  | "working_days_left_before_1120"
>;

function Tile({
  label,
  fam,
  value,
  target,
  floor,
  left,
  sub,
  flag,
}: {
  label: string;
  fam: Family;
  value: number;
  target: number;
  floor?: number;
  left: string;
  sub: string;
  flag?: { status: Status; date: string } | null;
}) {
  const pct = target > 0 ? Math.round((value / target) * 100) : 0;
  return (
    <section className="flex min-w-0 flex-col rounded-lg border border-line bg-card p-5">
      <div className="flex items-center gap-2">
        <span className={cn("h-2 w-2 rounded-full", FAM[fam].dot)} aria-hidden />
        <h2 className="text-sm font-medium text-ink-2">{label}</h2>
        {flag && (
          <span className="ml-auto">
            <Tip align="end" text={`Friday checkpoint ${fmtDay(flag.date)}: ${flag.status === "pass" ? "made" : flag.status === "floor" ? "floor only" : "missed"}`}>
              <span tabIndex={0}>
                <StatusChip status={flag.status} label={`${flag.status === "pass" ? "Made" : flag.status === "floor" ? "Floor" : "Missed"} ${fmtDay(flag.date)}`} />
              </span>
            </Tip>
          </span>
        )}
      </div>
      <p className="mt-4 flex items-baseline gap-2">
        <span className="num text-[44px] font-semibold leading-[40px]">{value}</span>
        <span className="tnum text-sm text-muted">
          of {target}
          {floor !== undefined && <span className="text-muted"> · floor {floor}</span>}
        </span>
      </p>
      <TickBar value={value} target={target} floor={floor} color={FAM[fam].var} className="mt-4" />
      <div className="tnum mt-2 flex items-center justify-between text-xs">
        <span className="text-ink-2">{left}</span>
        <span className="text-muted">{pct}%</span>
      </div>
      <p className="mt-4 truncate border-t border-line pt-3 text-xs text-muted" title={sub}>
        {sub}
      </p>
    </section>
  );
}

export function StatTiles({ p }: { p: Slim }) {
  const t = monthTargets(p as Pipeline);
  const today = useToday();
  // Latest Friday checkpoint already judged: the tile's problem flag.
  const last = today ? [...checkpointRows(p as Pipeline, today)].reverse().find((r) => r.row !== "upcoming") : undefined;
  const flag = (s?: Status) => (last && s ? { status: s, date: last.cp.date } : null);
  const next = p.booked_ahead?.[0];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Tile
        label="Listed MTD"
        fam="live"
        value={p.listed_mtd}
        target={p.target}
        floor={p.floor}
        left={`${Math.max(0, p.target - p.listed_mtd)} to go · ${p.working_days_left} days`}
        sub={p.listed_names.length ? p.listed_names.join(", ") : "None yet this month"}
        flag={flag(last?.listedStatus)}
      />
      <Tile
        label="Report calls held"
        fam="report"
        value={p.report_calls_held_mtd}
        target={t.calls}
        floor={t.callsFloor}
        left={`${Math.max(0, t.calls - p.report_calls_held_mtd)} to go by 11-20 · ${p.working_days_left_before_1120} days`}
        sub={`${p.report_calls_booked_ahead} booked ahead` + (next ? ` · next ${next.owner.replace(/\s+/g, " ")} ${next.date.slice(5)} ${next.time_et}` : "")}
        flag={flag(last?.callsStatus)}
      />
      <Tile
        label="Inspections completed"
        fam="insp"
        value={p.inspections_completed_mtd}
        target={t.insp}
        left={`${Math.max(0, t.insp - p.inspections_completed_mtd)} to go by 11-20 · ${p.working_days_left_before_1120} days`}
        sub={`${p.inspections_scheduled_ahead} scheduled ahead`}
        flag={flag(last?.inspStatus)}
      />
    </div>
  );
}

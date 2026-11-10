import type { Pipeline } from "@/lib/types";
import { monthTargets } from "@/lib/pace";
import { Meter } from "./meter";

function Tile({ label, value, target, floor, sub }: { label: string; value: number; target: number; floor?: number; sub: string }) {
  return (
    <section className="min-w-0 rounded-lg border border-border bg-card p-4">
      <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</h2>
      <p className="mt-1 flex items-baseline gap-1.5">
        <span className="text-4xl font-semibold leading-none tracking-tight">{value}</span>
        <span className="tnum text-sm text-muted-foreground">
          / {target}
          {floor !== undefined && ` · floor ${floor}`}
        </span>
      </p>
      <Meter value={value} target={target} floor={floor} className="mt-3" />
      <p className="mt-2 text-xs text-muted-foreground">{sub}</p>
    </section>
  );
}

export function StatTiles({ p }: { p: Pipeline }) {
  const t = monthTargets(p);
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Tile
        label="Listed MTD"
        value={p.listed_mtd}
        target={p.target}
        floor={p.floor}
        sub={p.listed_names.length ? p.listed_names.join(", ") : "None yet this month"}
      />
      <Tile
        label="Report calls held"
        value={p.report_calls_held_mtd}
        target={t.calls}
        floor={t.callsFloor}
        sub={
          `${p.report_calls_booked_ahead} booked ahead` +
          (p.booked_ahead?.[0] ? ` · next ${p.booked_ahead[0].owner.replace(/\s+/g, " ")} ${p.booked_ahead[0].date.slice(5)} ${p.booked_ahead[0].time_et}` : "") +
          " · target by 11-20"
        }
      />
      <Tile
        label="Inspections completed"
        value={p.inspections_completed_mtd}
        target={t.insp}
        sub={`${p.inspections_scheduled_ahead} scheduled ahead`}
      />
    </div>
  );
}

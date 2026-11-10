import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

function Counter({ label, value, target, dot, onBump }: { label: string; value: number; target: number; dot: string; onBump: (d: number) => void }) {
  const hit = target > 0 && value >= target;
  const btn = "grid h-8 w-8 place-items-center text-ink-2 transition-colors hover:bg-soft hover:text-ink active:bg-line";
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center overflow-hidden rounded-lg border border-line-strong bg-card">
        <button type="button" onClick={() => onBump(-1)} className={btn} aria-label={`Decrease ${label}`}>
          <Minus className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
        </button>
        <span className={cn("tnum min-w-[3.75rem] border-x border-line px-2 text-center text-sm leading-8", hit ? "font-semibold text-good-ink" : "text-ink")}>
          <span className="font-semibold">{value}</span>
          <span className="text-muted"> / {target}</span>
        </span>
        <button type="button" onClick={() => onBump(1)} className={btn} aria-label={`Increase ${label}`}>
          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
        </button>
      </div>
      <span className="inline-flex items-center gap-1.5 text-xs text-ink-2">
        <span className={cn("h-1.5 w-1.5 rounded-full", dot)} aria-hidden />
        {label}
      </span>
    </div>
  );
}

export function DayCounters({
  held,
  booked,
  targets,
  onBump,
}: {
  held: number;
  booked: number;
  targets: { report_calls_held: number; inspections_booked: number };
  onBump: (field: "held" | "booked", d: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3">
      <Counter label="Report calls held" dot="bg-report" value={held} target={targets.report_calls_held} onBump={(d) => onBump("held", d)} />
      <Counter label="Inspections booked" dot="bg-insp" value={booked} target={targets.inspections_booked} onBump={(d) => onBump("booked", d)} />
    </div>
  );
}

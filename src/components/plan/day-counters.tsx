import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

function Counter({ label, value, target, onBump }: { label: string; value: number; target: number; onBump: (d: number) => void }) {
  const hit = target > 0 && value >= target;
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" onClick={() => onBump(-1)} className="grid h-7 w-7 place-items-center rounded-md border border-border hover:bg-muted" aria-label={`Decrease ${label}`}>
        <Minus className="h-3.5 w-3.5" aria-hidden />
      </button>
      <span className={cn("tnum min-w-[3.5rem] text-center text-sm", hit ? "font-semibold text-good-ink" : "")}>
        {value} / {target}
      </span>
      <button type="button" onClick={() => onBump(1)} className="grid h-7 w-7 place-items-center rounded-md border border-border hover:bg-muted" aria-label={`Increase ${label}`}>
        <Plus className="h-3.5 w-3.5" aria-hidden />
      </button>
      <span className="text-xs text-muted-foreground">{label}</span>
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
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      <Counter label="report calls held" value={held} target={targets.report_calls_held} onBump={(d) => onBump("held", d)} />
      <Counter label="inspections booked" value={booked} target={targets.inspections_booked} onBump={(d) => onBump("booked", d)} />
    </div>
  );
}

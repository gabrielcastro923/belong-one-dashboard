import { cn } from "@/lib/utils";

/**
 * Tick bar: one tick per unit of the goal. Filled ticks take the entity colour; the floor tick is a dark marker.
 * Goals above 70 fall back to 60 proportional ticks so a tick never gets thinner than a hairline.
 */
export function TickBar({ value, target, floor, color, className }: { value: number; target: number; floor?: number; color: string; className?: string }) {
  if (target <= 0) return null;
  const n = target <= 70 ? target : 60;
  const per = target / n;
  const filled = Math.min(n, Math.round(value / per));
  const floorIdx = floor !== undefined ? Math.max(0, Math.round(floor / per) - 1) : -1;
  return (
    <div className={cn("ticks", className)} aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <i
          key={i}
          className={i === floorIdx && i >= filled ? "!bg-ink/45" : undefined}
          style={i < filled ? { background: color } : undefined}
        />
      ))}
    </div>
  );
}

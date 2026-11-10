import { cn } from "@/lib/utils";

/** Bullet-style meter: fill = actual, tick = floor, right edge = target. */
export function Meter({ value, target, floor, className }: { value: number; target: number; floor?: number; className?: string }) {
  const max = Math.max(target, value, 1);
  const w = (v: number) => `${Math.min(100, (v / max) * 100)}%`;
  return (
    <div className={cn("relative h-2 w-full rounded-sm bg-track", className)} aria-hidden>
      <div className="absolute inset-y-0 left-0 rounded-sm bg-series" style={{ width: w(value) }} />
      {floor !== undefined && <div className="absolute -inset-y-1 w-0.5 bg-foreground/60" style={{ left: w(floor) }} title={`Floor ${floor}`} />}
    </div>
  );
}

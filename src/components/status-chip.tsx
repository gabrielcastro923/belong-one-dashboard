import { Badge } from "@/components/ui/badge";
import type { Status } from "@/lib/pace";
import { cn } from "@/lib/utils";

const MAP = {
  pass: { label: "Pass", variant: "good", dot: "bg-live" },
  floor: { label: "Floor", variant: "warn", dot: "bg-warn" },
  miss: { label: "Miss", variant: "critical", dot: "bg-critical" },
  upcoming: { label: "Open", variant: "default", dot: "bg-muted/60" },
} as const;

export function StatusChip({ status, label }: { status: Status; label?: string }) {
  const m = MAP[status];
  return (
    <Badge variant={m.variant}>
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} aria-hidden />
      {label ?? m.label}
    </Badge>
  );
}

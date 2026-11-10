import { Check, Clock, Minus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Status } from "@/lib/pace";

const MAP = {
  pass: { label: "Pass", variant: "good", Icon: Check },
  floor: { label: "Floor", variant: "warn", Icon: Minus },
  miss: { label: "Miss", variant: "critical", Icon: X },
  upcoming: { label: "Open", variant: "default", Icon: Clock },
} as const;

export function StatusChip({ status }: { status: Status }) {
  const { label, variant, Icon } = MAP[status];
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </Badge>
  );
}

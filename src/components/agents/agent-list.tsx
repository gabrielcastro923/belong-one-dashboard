import { Badge } from "@/components/ui/badge";
import type { AgentRow } from "@/lib/types";

const statusVariant = (s: string) => {
  const v = s.toLowerCase();
  if (/fail|error|broken|dead|disabled/.test(v)) return "critical" as const;
  if (/late|stale|proposed|paused|pending/.test(v)) return "warn" as const;
  if (/^(ok|live|active|running|enabled)$/.test(v)) return "good" as const;
  return "default" as const;
};

const ORDER = ["critical", "warn", "good", "default"];

export function AgentList({ agents }: { agents: AgentRow[] }) {
  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {[...agents].sort((a, b) => ORDER.indexOf(statusVariant(a.status)) - ORDER.indexOf(statusVariant(b.status))).map((a) => (
        <li key={a.name} className="grid gap-1 px-4 py-3 sm:grid-cols-[14rem_1fr]">
          <div className="min-w-0 space-y-1">
            <div className="font-mono text-sm font-medium">{a.name}</div>
            <div className="flex flex-wrap gap-1">
              <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
              {a.kind && <Badge variant="outline">{a.kind}</Badge>}
            </div>
          </div>
          <div className="min-w-0 space-y-0.5 text-sm">
            {a.owned_metric && <p>{a.owned_metric}</p>}
            {a.schedule && <p className="text-xs text-muted-foreground">Schedule: {a.schedule}</p>}
            {a.note && <p className="text-xs text-muted-foreground">{a.note}</p>}
            {a.proposal_path && <p className="break-all font-mono text-[11px] text-muted-foreground">{a.proposal_path}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

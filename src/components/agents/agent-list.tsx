import { Badge } from "@/components/ui/badge";
import type { AgentRow } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusVariant = (s: string) => {
  const v = s.toLowerCase();
  if (/fail|error|broken|dead|disabled/.test(v)) return "critical" as const;
  if (/late|stale|proposed|paused|pending/.test(v)) return "warn" as const;
  if (/^(ok|live|active|running|enabled)$/.test(v)) return "good" as const;
  return "default" as const;
};

const ORDER = ["critical", "warn", "good", "default"];
const DOT = { critical: "bg-critical", warn: "bg-warn", good: "bg-live", default: "bg-muted/50" } as const;

export function AgentList({ agents }: { agents: AgentRow[] }) {
  return (
    <ul className="divide-y divide-line rounded-lg border border-line bg-card">
      {[...agents]
        .sort((a, b) => ORDER.indexOf(statusVariant(a.status)) - ORDER.indexOf(statusVariant(b.status)))
        .map((a) => {
          const v = statusVariant(a.status);
          return (
            <li key={a.name} className={cn("grid gap-x-6 gap-y-1.5 px-5 py-3.5 sm:grid-cols-[16rem_1fr]", v === "critical" && "bg-critical/[.05]")}>
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", DOT[v])} aria-hidden />
                  <span className="truncate font-mono text-[13px] font-medium text-ink">{a.name}</span>
                </div>
                <div className="flex flex-wrap gap-1 pl-4">
                  <Badge variant={v === "good" ? "default" : v}>{a.status}</Badge>
                  {a.kind && <Badge variant="outline">{a.kind}</Badge>}
                </div>
              </div>
              <div className="min-w-0 space-y-0.5 pl-4 text-sm sm:pl-0">
                {a.owned_metric && <p className="text-ink">{a.owned_metric}</p>}
                {a.schedule && <p className="tnum text-xs text-ink-2">{a.schedule}</p>}
                {a.note && <p className={cn("text-xs", v === "critical" ? "text-critical-ink" : "text-muted")}>{a.note}</p>}
                {a.proposal_path && <p className="break-all font-mono text-[11px] text-muted">{a.proposal_path}</p>}
              </div>
            </li>
          );
        })}
    </ul>
  );
}

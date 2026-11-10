import { ExternalLink, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PlanCall } from "@/lib/types";
import { GOAL_LABEL, bucketShort, fmtPhone, telHref } from "@/lib/labels";
import { cn } from "@/lib/utils";

export function CallRow({ call, id, done, onToggle }: { call: PlanCall; id: string; done: boolean; onToggle: () => void }) {
  return (
    <li className={cn("flex gap-3 border-t border-border/70 py-2 first:border-t-0", done && "opacity-55")}>
      <input
        id={id}
        type="checkbox"
        checked={done}
        onChange={onToggle}
        className="mt-1 h-4 w-4 shrink-0 accent-[hsl(var(--primary))]"
        aria-label={`Mark ${call.name} done`}
      />
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <a href={call.admin} target="_blank" rel="noreferrer" className={cn("inline-flex items-center gap-1 font-medium hover:underline", done && "line-through")}>
            {call.name}
            <ExternalLink className="h-3 w-3 text-muted-foreground" aria-hidden />
          </a>
          <Badge variant="series">{GOAL_LABEL[call.goal] ?? call.goal}</Badge>
          <span className="font-mono text-[11px] text-muted-foreground">{bucketShort(call.bucket)}</span>
        </div>
        <div className="tnum flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          <a href={telHref(call.phone)} className="inline-flex items-center gap-1 text-foreground hover:underline">
            <Phone className="h-3 w-3" aria-hidden />
            {fmtPhone(call.phone)}
          </a>
          <span>Their time {call.local_time}</span>
        </div>
        {call.script_hint && <p className="text-xs italic text-muted-foreground">{call.script_hint}</p>}
      </div>
    </li>
  );
}

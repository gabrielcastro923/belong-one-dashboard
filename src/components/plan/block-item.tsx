import { Badge } from "@/components/ui/badge";
import type { FixedEvent, PlanBlock } from "@/lib/types";
import { KIND_LABEL } from "@/lib/labels";
import { CallRow } from "./call-row";

export const callKey = (date: string, c: { home_id: number; goal: string; key?: string }) => c.key ?? `${date}:${c.home_id}:${c.goal}`;

export function BlockItem({
  date,
  block,
  done,
  toggle,
}: {
  date: string;
  block: PlanBlock | (FixedEvent & { calls?: undefined });
  done: Set<string>;
  toggle: (id: string) => void;
}) {
  const fixed = !("calls" in block) || block.calls === undefined;
  const calls = block.calls ?? [];
  return (
    <li className="grid grid-cols-[4.25rem_1fr] gap-3 py-2.5">
      <div className="tnum pt-0.5 text-xs text-muted-foreground">
        <div className="font-medium text-foreground">{block.time_et}</div>
        <div>{block.end_et}</div>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={fixed ? "outline" : "default"}>{KIND_LABEL[block.kind] ?? block.kind}</Badge>
          <span className={fixed ? "text-sm text-muted-foreground" : "text-sm font-medium"}>{block.title}</span>
          {calls.length > 0 && (
            <span className="tnum text-xs text-muted-foreground">
              {calls.filter((c) => done.has(callKey(date, c))).length}/{calls.length}
            </span>
          )}
        </div>
        {calls.length > 0 && (
          <ul className="mt-1">
            {calls.map((c) => {
              const id = callKey(date, c);
              return <CallRow key={id} id={id} call={c} done={done.has(id)} onToggle={() => toggle(id)} />;
            })}
          </ul>
        )}
      </div>
    </li>
  );
}

import type { FixedEvent, PlanBlock } from "@/lib/types";
import { KIND_LABEL } from "@/lib/labels";
import { cn } from "@/lib/utils";
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
  const doneN = calls.filter((c) => done.has(callKey(date, c))).length;
  return (
    <li className={cn("py-3 sm:grid sm:grid-cols-[4.5rem_1fr] sm:gap-4", fixed && "py-2")}>
      <div className="tnum flex items-baseline gap-1.5 text-xs sm:block sm:pt-0.5">
        <span className={cn("font-semibold", fixed ? "text-ink-2" : "text-ink")}>{block.time_et}</span>
        <span className="text-muted">
          <span className="-ml-1 sm:hidden">–</span>
          {block.end_et}
        </span>
      </div>
      <div className="min-w-0">
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-0">
          <span
            className={cn(
              "inline-flex h-5 items-center rounded-md px-1.5 text-2xs font-medium",
              fixed ? "text-muted ring-1 ring-inset ring-line-strong" : "bg-ink text-card"
            )}
          >
            {KIND_LABEL[block.kind] ?? block.kind}
          </span>
          <span className={cn("min-w-0 text-sm", fixed ? "text-ink-2" : "font-medium text-ink")}>{block.title}</span>
          {calls.length > 0 && (
            <span className={cn("tnum ml-auto text-xs", doneN === calls.length ? "font-semibold text-good-ink" : "text-muted")}>
              {doneN}/{calls.length}
            </span>
          )}
        </div>
        {calls.length > 0 && (
          <ol className="mt-1">
            {calls.map((c, i) => {
              const id = callKey(date, c);
              return <CallRow key={id} id={id} n={i + 1} call={c} done={done.has(id)} onToggle={() => toggle(id)} />;
            })}
          </ol>
        )}
      </div>
    </li>
  );
}

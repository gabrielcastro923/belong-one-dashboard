import { Phone } from "lucide-react";
import type { PlanCall } from "@/lib/types";
import { bucketShort, fmtPhone, splitLocal, telHref } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { Tip } from "@/components/ui/hint";
import { GoalChip } from "./goal-chip";

export function CallRow({ call, id, n, done, onToggle }: { call: PlanCall; id: string; n: number; done: boolean; onToggle: () => void }) {
  const [time, zone] = splitLocal(call.local_time);
  return (
    <li className={cn("flex gap-2.5 border-t border-line py-3 first:border-t-0 sm:gap-3", done && "opacity-50")}>
      <label htmlFor={id} className="-m-2 flex h-10 w-10 shrink-0 cursor-pointer items-start justify-center pt-2.5">
        <input id={id} type="checkbox" checked={done} onChange={onToggle} className="h-[18px] w-[18px] cursor-pointer" aria-label={`Mark ${call.name} done`} />
      </label>
      <span className="tnum w-5 shrink-0 pt-0.5 text-right text-xs font-medium leading-5 text-muted" aria-label={`Dial ${n}`}>
        {n}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <a
            href={call.admin}
            target="_blank"
            rel="noreferrer"
            className={cn("min-w-0 text-[15px] font-semibold leading-5 tracking-[-0.01em] decoration-line-strong hover:underline", done && "line-through")}
          >
            {call.name}
          </a>
          <GoalChip goal={call.goal} bucket={call.bucket} className="-mt-0.5" />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
          {call.phone ? (
            <a
              href={telHref(call.phone)}
              className="tnum inline-flex h-9 items-center gap-2 rounded-full border border-line-strong bg-card px-3.5 text-sm font-medium text-ink transition-colors hover:border-ink-2 active:bg-soft"
            >
              <Phone className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} aria-hidden />
              {fmtPhone(call.phone)}
            </a>
          ) : (
            <span className="inline-flex h-9 items-center rounded-full border border-dashed border-line-strong px-3.5 text-sm text-muted">Phone in admin</span>
          )}
          <Tip text="Their local time at this block" align="start">
            <span tabIndex={0} className="tnum inline-flex items-baseline gap-1 text-sm">
              <span className="font-semibold text-ink">{time}</span>
              <span className="text-xs text-muted">{zone}</span>
            </span>
          </Tip>
          <span className="tnum text-xs text-muted" title={call.stage_label}>
            {bucketShort(call.bucket)}
          </span>
        </div>
        {call.script_hint && <p className="mt-2 max-w-[72ch] text-xs leading-5 text-muted">{call.script_hint}</p>}
      </div>
    </li>
  );
}

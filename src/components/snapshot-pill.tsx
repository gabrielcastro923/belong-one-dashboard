"use client";

import { useEffect, useState } from "react";
import { Tip } from "@/components/ui/hint";
import { fmtClock, fmtStamp, hoursSince } from "@/lib/dates";
import { cn } from "@/lib/utils";

const STALE_HOURS = 26;

/** Header status: green dot + snapshot time; red when the snapshot is older than 26 h. */
export function SnapshotPill({ snapshotAt, generated }: { snapshotAt: string; generated: string }) {
  const [age, setAge] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setAge(hoursSince(snapshotAt));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [snapshotAt]);
  const stale = age !== null && age > STALE_HOURS;
  return (
    <Tip
      align="end"
      side="bottom"
      className="ml-auto shrink-0 max-sm:order-2"
      text={
        <>
          CRM snapshot {fmtStamp(snapshotAt)}
          <br />
          Generated {fmtStamp(generated)}
          {age !== null && (
            <>
              <br />
              {age < 1 ? "Under an hour old" : `${Math.floor(age)} h old`}
            </>
          )}
        </>
      }
    >
      <span
        tabIndex={0}
        className={cn(
          "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium",
          stale ? "border-critical/40 bg-critical/10 text-critical-ink" : "border-line bg-card text-ink-2"
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", stale ? "bg-critical" : "animate-pulse2 bg-live")} aria-hidden />
        <span className="max-[380px]:hidden">Snapshot</span>
        <span className="tnum">{fmtClock(snapshotAt)}</span>
      </span>
    </Tip>
  );
}

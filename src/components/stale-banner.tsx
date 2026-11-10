"use client";

import { useEffect, useState } from "react";
import { hoursSince } from "@/lib/dates";

const STALE_HOURS = 26;

/** The one page-level problem note: a stale snapshot or placeholder data. */
export function StaleBanner({ snapshotAt, placeholder }: { snapshotAt: string; placeholder: boolean }) {
  const [age, setAge] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setAge(hoursSince(snapshotAt));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [snapshotAt]);

  const stale = age !== null && age > STALE_HOURS;
  if (!stale && !placeholder) return null;
  return (
    <div role="alert" className="border-b border-critical/30 bg-critical/[.07]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-0.5 px-4 py-2 text-sm text-critical-ink sm:px-6 min-[100rem]:max-w-[1440px]">
        {stale && (
          <p>
            <span className="font-semibold">Snapshot {Math.floor(age!)} h old.</span> Stages and counts may be wrong. Refresh the CRM snapshot and rebuild before trusting this page.
          </p>
        )}
        {placeholder && <p className="font-semibold">Placeholder data. The real plan files have not been written yet.</p>}
      </div>
    </div>
  );
}

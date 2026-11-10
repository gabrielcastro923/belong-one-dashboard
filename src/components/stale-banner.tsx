"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { hoursSince } from "@/lib/dates";

const STALE_HOURS = 26;

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
    <div role="alert" className="border-b border-critical/50 bg-critical/10">
      <div className="mx-auto flex max-w-6xl items-start gap-2 px-4 py-2 text-sm text-critical-ink">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <div className="min-w-0 space-y-0.5">
          {stale && (
            <p>
              Snapshot is {Math.floor(age!)} hours old. Stages and counts may be wrong. Refresh the CRM snapshot and rebuild before trusting this page.
            </p>
          )}
          {placeholder && <p>Placeholder data. The real plan files have not been written yet.</p>}
        </div>
      </div>
    </div>
  );
}

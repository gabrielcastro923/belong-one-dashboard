"use client";

import { useEffect, useState } from "react";
import { hoursSince } from "@/lib/dates";

const STALE_HOURS = 26;

export function DbStaleBanner({ dbAt, placeholder }: { dbAt: string; placeholder: boolean }) {
  const [age, setAge] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setAge(hoursSince(dbAt));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [dbAt]);

  const bad = Number.isNaN(new Date(dbAt).getTime());
  const stale = bad || (age !== null && age > STALE_HOURS);
  if (!stale && !placeholder) return null;
  return (
    <div role="alert" className="space-y-0.5 rounded-lg border border-critical/30 bg-critical/[.07] px-4 py-2.5 text-sm text-critical-ink">
      {stale && (
        <p>
          <span className="font-semibold">{bad ? "The send database timestamp is missing." : `The send database is ${Math.floor(age!)} hours old.`}</span> Sends, replies and
          bookings below may be behind. Rebuild outreach.json before trusting this page.
        </p>
      )}
      {placeholder && <p className="font-semibold">Placeholder data. build_outreach.py has not written the real outreach.json yet, so every number here is made up.</p>}
    </div>
  );
}

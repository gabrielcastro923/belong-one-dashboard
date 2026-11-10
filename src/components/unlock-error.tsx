"use client";

import { useSearchParams } from "next/navigation";

export function UnlockError() {
  const e = useSearchParams().get("e");
  if (!e) return null;
  return <p className="text-sm text-critical-ink">That key did not match. Check DASH_KEY in Vercel and try again.</p>;
}

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { SectionHead as Head } from "@/components/ui/section";
import { fmt1k, per1k, tooSmall } from "@/lib/outreach";

export function TooSmall({ n }: { n: number }) {
  if (!tooSmall(n)) return null;
  return (
    <Badge variant="default" title={`${n} sends. Under 100, a rate is noise.`}>
      n&lt;100
    </Badge>
  );
}

/** "12.3 /1k · 4 booked of 325". Never a bare rate. */
export function Rate({ num, den, given, unit = "booked" }: { num: number; den: number; given?: number | null; unit?: string }) {
  const v = per1k(num, den, given);
  return (
    <span className="tnum whitespace-nowrap">
      <span className={tooSmall(den) ? "text-muted" : "font-semibold text-ink"}>{fmt1k(v)}</span>
      <span className="text-muted">
        {" "}
        /1k · {num} {unit} of {den}
      </span>
    </span>
  );
}

/** Section title; the old sub-line is now the tooltip. */
export function SectionHead({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <Head title={title} hint={sub}>
      {children}
    </Head>
  );
}

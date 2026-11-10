import { Badge } from "@/components/ui/badge";
import { fmt1k, per1k, tooSmall } from "@/lib/outreach";

export function TooSmall({ n }: { n: number }) {
  if (!tooSmall(n)) return null;
  return (
    <Badge variant="warn" title={`${n} sends. Under 100, a rate is noise.`}>
      Too small to read
    </Badge>
  );
}

/** "12.3 per 1k" with the raw counts beside it. Never a bare rate. */
export function Rate({ num, den, given, unit = "booked" }: { num: number; den: number; given?: number | null; unit?: string }) {
  const v = per1k(num, den, given);
  return (
    <span className="tnum whitespace-nowrap">
      <span className={tooSmall(den) ? "text-muted-foreground" : "font-medium"}>{fmt1k(v)}</span>
      <span className="text-muted-foreground">
        {" "}
        /1k · {num} {unit} of {den}
      </span>
    </span>
  );
}

export function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="space-y-0.5">
      <h2 className="text-sm font-semibold">{title}</h2>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

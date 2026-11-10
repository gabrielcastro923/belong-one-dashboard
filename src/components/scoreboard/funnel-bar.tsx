import type { Bucket } from "@/lib/types";
import { bucketShort, pct } from "@/lib/labels";

// Ordinal blue ramp (dataviz reference, steps 250 to 600): darker = higher P(list).
const RAMP = ["#86b6ef", "#6da7ec", "#5598e7", "#3987e5", "#2a78d6", "#256abf", "#1c5cab", "#184f95"];

export function FunnelBar({ buckets }: { buckets: Bucket[] }) {
  const ordered = [...buckets].sort((a, b) => a.key.localeCompare(b.key));
  const byP = [...ordered].sort((a, b) => a.p_list - b.p_list).map((b) => b.key);
  const color = (k: string) => RAMP[Math.round((byP.indexOf(k) / Math.max(1, byP.length - 1)) * (RAMP.length - 1))];
  const total = ordered.reduce((a, b) => a + b.count, 0);
  const expected = ordered.reduce((a, b) => a + b.count * b.p_list, 0);
  return (
    <section className="min-w-0 space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold">Open funnel</h2>
        <p className="tnum text-xs text-muted-foreground">
          {total} deals · {expected.toFixed(1)} expected listings at P(list)
        </p>
      </div>
      <div className="flex h-6 w-full gap-0.5" role="img" aria-label="Deals per bucket, shaded by probability of listing">
        {ordered.map((b) =>
          b.count ? (
            <div
              key={b.key}
              className="first:rounded-l-sm last:rounded-r-sm"
              style={{ flexGrow: b.count, flexBasis: 0, background: color(b.key) }}
              title={`${b.label}: ${b.count} deals, P(list) ${pct(b.p_list)}`}
            />
          ) : null
        )}
      </div>
      <ul className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        {ordered.map((b) => (
          <li key={b.key} className="flex min-w-0 items-center gap-2 border-b border-border/60 py-1">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: color(b.key) }} aria-hidden />
            <span className="tnum w-6 shrink-0 font-mono text-xs text-muted-foreground">{bucketShort(b.key)}</span>
            <span className="min-w-0 flex-1 truncate">{b.label}</span>
            <span className="tnum w-8 text-right font-medium">{b.count}</span>
            <span className="tnum w-12 text-right text-xs text-muted-foreground">P {pct(b.p_list)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

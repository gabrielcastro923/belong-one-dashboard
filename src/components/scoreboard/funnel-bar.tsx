import type { Bucket } from "@/lib/types";
import { bucketShort, pct } from "@/lib/labels";
import { FAM, FAMILY_LABEL, familyOf, stageOpacity, type Family } from "@/lib/stage";
import { SectionHead } from "@/components/ui/section";
import { cn } from "@/lib/utils";

// Funnel order b1 → b7, then listed. Colour = stage family; within a family later stages are more intense.
const order = (k: string) => (k.startsWith("0_") ? "9" : k);

export function FunnelBar({ buckets }: { buckets: Bucket[] }) {
  const ordered = [...buckets].sort((a, b) => order(a.key).localeCompare(order(b.key)));
  const total = ordered.reduce((a, b) => a + b.count, 0);
  const expected = ordered.reduce((a, b) => a + b.count * b.p_list, 0);
  const max = Math.max(1, ...ordered.map((b) => b.count));
  const fams = Array.from(new Set(ordered.map((b) => familyOf(b.key)))) as Family[];
  return (
    <section className="flex min-w-0 flex-col rounded-lg border border-line bg-card">
      <SectionHead title="Open funnel" className="px-5 pb-3 pt-4" hint="Deals per bucket. Expected listings = Σ count × P(list).">
        <span className="tnum flex items-baseline gap-1.5 text-xs text-muted">
          <span className="num text-[22px] font-semibold leading-7 text-ink">{total}</span>
          deals · {expected.toFixed(1)} exp.
        </span>
      </SectionHead>
      <div className="px-5">
        <div className="flex h-2.5 w-full gap-[3px]" role="img" aria-label="Deals per bucket, coloured by stage family">
          {ordered.map((b) =>
            b.count ? (
              <div
                key={b.key}
                className="min-w-[3px] rounded-full"
                style={{ flexGrow: b.count, flexBasis: 0, background: FAM[familyOf(b.key)].var, opacity: stageOpacity(b.key) }}
                title={`${b.label}: ${b.count} deals, P(list) ${pct(b.p_list)}`}
              />
            ) : null
          )}
        </div>
        <p className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {fams.map((f) => (
            <span key={f} className="inline-flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", FAM[f].dot)} aria-hidden />
              {FAMILY_LABEL[f]}
            </span>
          ))}
        </p>
      </div>
      <ul className="mt-3 border-t border-line px-2 py-1.5">
        <li className="flex items-center gap-3 px-3 pb-1 pt-1 text-2xs text-muted" aria-hidden>
          <span className="w-6" />
          <span className="flex-1">Bucket</span>
          <span className="w-10 text-right">Deals</span>
          <span className="w-10 text-right">P(list)</span>
        </li>
        {ordered.map((b) => {
          const fam = familyOf(b.key);
          return (
            <li key={b.key} className="relative flex h-11 items-center gap-3 rounded-md px-3 pb-1 text-sm hover:bg-soft/60">
              <span className="tnum w-6 shrink-0 text-xs font-medium text-muted">{bucketShort(b.key)}</span>
              <span className="min-w-0 flex-1 truncate">{b.label}</span>
              <span className="tnum w-10 text-right font-medium">{b.count}</span>
              <span className="tnum w-10 text-right text-xs text-muted">{pct(b.p_list)}</span>
              <span className="absolute inset-x-3 bottom-1 h-[3px] rounded-full bg-line/70" aria-hidden>
                <span className="block h-full rounded-full" style={{ width: `${(b.count / max) * 100}%`, background: FAM[fam].var, opacity: 0.8 * stageOpacity(b.key) + 0.2 }} />
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

import type { Pipeline } from "@/lib/types";
import { FAM, familyOf } from "@/lib/stage";
import { SectionHead, TD, TH } from "@/components/ui/section";
import { Tip } from "@/components/ui/hint";
import { cn } from "@/lib/utils";

const f1 = (n: number) => n.toFixed(1);

export function PathTable({ p }: { p: Pipeline }) {
  const { sources, expected_total, needed_total, verdict } = p.path_to_20;
  const max = Math.max(1, ...sources.flatMap((s) => [s.expected, s.needed]));
  const short = expected_total < needed_total;
  return (
    <section className="flex min-w-0 flex-col rounded-lg border border-line bg-card">
      <SectionHead title={`Path to ${p.target}`} className="px-5 pb-3 pt-4" hint="Expected = owners × P(list) for each source. Needed = what the source must deliver for the month to reach the target.">
        <span className="tnum flex items-baseline gap-1.5 text-xs text-muted">
          <span className={cn("num text-[22px] font-semibold leading-7", short ? "text-critical-ink" : "text-good-ink")}>{f1(expected_total)}</span>
          expected of {needed_total}
        </span>
      </SectionHead>
      <div className="max-md:overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-y border-line bg-soft/50 text-left">
            <tr>
              <th className={cn(TH, "pl-5")}>Source</th>
              <th className={cn(TH, "text-right")}>Owners</th>
              <th className={cn(TH, "text-right")}>Exp.</th>
              <th className={cn(TH, "text-right")}>Need</th>
              <th className={cn(TH, "hidden w-[28%] pr-5 sm:table-cell")}>
                <span className="flex items-center gap-3 font-normal">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-3 rounded-sm bg-ink-2/70" aria-hidden />
                    Exp.
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-3 rounded-sm ring-1 ring-inset ring-ink-2/50" aria-hidden />
                    Need
                  </span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => {
              const fam = FAM[familyOf(s.key)];
              const gap = s.expected < s.needed;
              return (
                <tr key={s.key} className="border-t border-line align-top first:border-t-0">
                  <td className={cn(TD, "pl-5")}>
                    <div className="flex items-start gap-2">
                      <span className={cn("mt-[7px] h-2 w-2 shrink-0 rounded-full", fam.dot)} aria-hidden />
                      {s.names?.length ? (
                        <details className="group min-w-0">
                          <summary className="cursor-pointer leading-5 decoration-line-strong underline-offset-4 hover:underline">{s.label}</summary>
                          <p className="mt-1 text-xs leading-5 text-muted">{s.names.join(", ")}</p>
                        </details>
                      ) : (
                        <span className="leading-5">{s.label}</span>
                      )}
                    </div>
                  </td>
                  <td className={cn(TD, "tnum text-right text-ink-2")}>{s.owners}</td>
                  <td className={cn(TD, "tnum text-right")}>{f1(s.expected)}</td>
                  <td className={cn(TD, "tnum text-right", gap ? "font-semibold text-ink" : "text-ink-2")}>{s.needed}</td>
                  <td className={cn(TD, "hidden pr-5 sm:table-cell")}>
                    <Tip text={`Expected ${f1(s.expected)}, needed ${s.needed}`} className="w-full">
                      <span tabIndex={0} className="relative mt-1.5 block h-3 w-full">
                        {s.needed > 0 && (
                          <span className="absolute inset-y-0 left-0 rounded-[3px] ring-1 ring-inset ring-ink-2/40" style={{ width: `${(s.needed / max) * 100}%` }} />
                        )}
                        <span className="absolute inset-y-[3px] left-[3px] rounded-[2px]" style={{ width: `calc(${(s.expected / max) * 100}% - 6px)`, background: fam.var, minWidth: s.expected > 0 ? 3 : 0 }} />
                      </span>
                    </Tip>
                  </td>
                </tr>
              );
            })}
            <tr className="border-t border-line-strong bg-soft/40">
              <td className={cn(TD, "pl-5 font-semibold")}>Total</td>
              <td className={cn(TD, "tnum text-right font-semibold")}>{sources.reduce((a, s) => a + s.owners, 0)}</td>
              <td className={cn(TD, "tnum text-right font-semibold", short ? "text-critical-ink" : "text-good-ink")}>{f1(expected_total)}</td>
              <td className={cn(TD, "tnum text-right font-semibold")}>{needed_total}</td>
              <td className="hidden sm:table-cell" />
            </tr>
          </tbody>
        </table>
      </div>
      {verdict && (
        <details className="group mt-auto border-t border-line">
          <summary className="flex cursor-pointer items-center gap-2 px-5 py-3 text-sm font-medium text-ink-2 hover:text-ink">
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="text-muted transition-transform group-open:rotate-90">
              <path d="M3.5 2 6.5 5 3.5 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Verdict
          </summary>
          <ul className="max-w-[72ch] list-disc space-y-1.5 px-5 pb-4 pl-10 text-sm leading-6 text-ink-2 marker:text-line-strong">
            {verdict
              .split(/(?<=\.)\s+(?=[A-Z0-9])/)
              .filter(Boolean)
              .map((s, i) => (
                <li key={i}>{s}</li>
              ))}
          </ul>
        </details>
      )}
    </section>
  );
}

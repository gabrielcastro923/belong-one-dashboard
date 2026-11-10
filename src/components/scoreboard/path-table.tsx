import type { Pipeline } from "@/lib/types";

const f1 = (n: number) => n.toFixed(1);

export function PathTable({ p }: { p: Pipeline }) {
  const { sources, expected_total, needed_total, verdict } = p.path_to_20;
  const max = Math.max(1, ...sources.flatMap((s) => [s.expected, s.needed]));
  const short = expected_total < needed_total;
  return (
    <section className="min-w-0 space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold">Path to {p.target}</h2>
        <p className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-3 rounded-sm bg-series" aria-hidden /> Expected
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-3 rounded-sm border border-foreground/50" aria-hidden /> Needed
          </span>
        </p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Source</th>
              <th className="px-3 py-2 text-right font-medium">Owners</th>
              <th className="px-3 py-2 text-right font-medium">Expected</th>
              <th className="px-3 py-2 text-right font-medium">Needed</th>
              <th className="hidden w-2/5 px-3 py-2 font-medium sm:table-cell">
                <span className="sr-only">Expected vs needed</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.key} className="border-t border-border">
                <td className="px-3 py-2">
                  {s.names?.length ? (
                    <details>
                      <summary className="cursor-pointer">{s.label}</summary>
                      <p className="mt-1 text-xs text-muted-foreground">{s.names.join(", ")}</p>
                    </details>
                  ) : (
                    s.label
                  )}
                </td>
                <td className="tnum px-3 py-2 text-right">{s.owners}</td>
                <td className="tnum px-3 py-2 text-right">{f1(s.expected)}</td>
                <td className={`tnum px-3 py-2 text-right ${s.expected < s.needed ? "font-semibold" : ""}`}>{s.needed}</td>
                <td className="hidden px-3 py-2 sm:table-cell">
                  <div className="relative h-3" title={`Expected ${f1(s.expected)}, needed ${s.needed}`}>
                    <div className="absolute inset-y-0 left-0 rounded-sm border border-foreground/50" style={{ width: `${(s.needed / max) * 100}%` }} />
                    <div className="absolute inset-y-0.5 left-0.5 rounded-sm bg-series" style={{ width: `calc(${(s.expected / max) * 100}% - 2px)` }} />
                  </div>
                </td>
              </tr>
            ))}
            <tr className="border-t border-border bg-muted/30 font-semibold">
              <td className="px-3 py-2">Total</td>
              <td className="tnum px-3 py-2 text-right">{sources.reduce((a, s) => a + s.owners, 0)}</td>
              <td className={`tnum px-3 py-2 text-right ${short ? "text-critical-ink" : "text-good-ink"}`}>{f1(expected_total)}</td>
              <td className="tnum px-3 py-2 text-right">{needed_total}</td>
              <td className="hidden sm:table-cell" />
            </tr>
          </tbody>
        </table>
      </div>
      <p className="rounded-md border-l-2 border-foreground/40 bg-muted/40 px-3 py-2 text-sm">{verdict}</p>
    </section>
  );
}

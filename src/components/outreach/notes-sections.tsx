import type { Outreach } from "@/lib/types";
import { Rate, SectionHead, TooSmall } from "./shared";

export function HoldoutPanel({ h }: { h: Outreach["holdout"] }) {
  return (
    <section className="min-w-0 space-y-3">
      <SectionHead
        title="Holdout"
        sub={`Owners randomly kept out of sends. The difference between arms is the only causal read on this page.${h?.note ? ` ${h.note}` : ""}`}
      />
      {!h || h.arms.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line-strong px-4 py-6 text-center text-sm text-muted">No holdout arms recorded.</p>
      ) : (
        <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
          {h.arms.map((a) => (
            <li key={a.arm} className="min-w-0 space-y-1 bg-card px-5 py-4">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-sm font-medium capitalize">{a.arm}</span>
                <TooSmall n={a.n} />
              </div>
              <p className="num text-[26px] font-semibold leading-8">{a.n > 0 ? `${((a.advanced / a.n) * 100).toFixed(1)}%` : "—"}</p>
              <p className="text-xs">
                <Rate num={a.advanced} den={a.n} unit="advanced" />
              </p>
              <p className="tnum text-xs text-muted">
                {a.n > 0 ? `${a.n} owners` : "no owners"}
                {a.bookings !== undefined && ` · ${a.bookings} booked`}
                {a.emailed_after !== undefined && ` · ${a.emailed_after} emailed after`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function Recommendations({ recs }: { recs: Outreach["recommendations"] }) {
  return (
    <section className="min-w-0 space-y-3">
      <SectionHead title="Recommendations" sub="Proposed by the builder. Nothing here is applied; Gabriel changes the lane." />
      {recs.length === 0 ? (
        <p className="text-sm text-muted">No recommendations.</p>
      ) : (
        <ol className="divide-y divide-line rounded-lg border border-line bg-card">
          {recs.map((r, i) => (
            <li key={i} className="grid grid-cols-[1.75rem_1fr] gap-x-2 px-5 py-4 text-sm">
              <span className="tnum pt-px text-sm font-semibold text-muted">{i + 1}</span>
              <div className="min-w-0 max-w-[80ch] space-y-2">
                <p className="font-medium leading-6 text-ink">{r.title}</p>
                {r.why && <p className="leading-6 text-ink-2">{r.why}</p>}
                {r.change && (
                  <p className="text-xs leading-5">
                    <span className="mr-1.5 text-muted">Change</span>
                    <code className="break-words rounded bg-soft px-1.5 py-0.5 font-mono text-[12px] text-ink">{r.change}</code>
                  </p>
                )}
                {(r.expected || r.risk) && (
                  <dl className="grid gap-x-6 gap-y-1 text-xs leading-5 sm:grid-cols-2">
                    {r.expected && (
                      <div>
                        <dt className="text-muted">Expected</dt>
                        <dd className="text-ink-2">{r.expected}</dd>
                      </div>
                    )}
                    {r.risk && (
                      <div>
                        <dt className="text-muted">Risk</dt>
                        <dd className="text-ink-2">{r.risk}</dd>
                      </div>
                    )}
                  </dl>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export function Caveats({ caveats }: { caveats: string[] }) {
  if (!caveats.length) return null;
  return (
    <section className="min-w-0 space-y-3">
      <SectionHead title="Caveats" />
      <ul className="max-w-[80ch] space-y-2 text-sm leading-6 text-ink-2">
        {caveats.map((c, i) => (
          <li key={i} className="grid grid-cols-[1rem_1fr]">
            <span className="mt-[11px] h-1 w-1 rounded-full bg-line-strong" aria-hidden />
            <span>{c}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

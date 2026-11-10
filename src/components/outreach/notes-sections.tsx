import type { Outreach } from "@/lib/types";
import { Rate, SectionHead, TooSmall } from "./shared";

export function HoldoutPanel({ h }: { h: Outreach["holdout"] }) {
  return (
    <section className="min-w-0 space-y-2">
      <SectionHead title="Holdout" sub="Owners randomly kept out of sends. The difference between arms is the only causal read on this page." />
      {!h || h.arms.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">No holdout arms recorded.</p>
      ) : (
        <div className="rounded-lg border border-border bg-card p-3">
          <ul className="grid gap-3 sm:grid-cols-3">
            {h.arms.map((a) => (
              <li key={a.arm} className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-sm font-semibold capitalize">{a.arm}</span>
                  <TooSmall n={a.n} />
                </div>
                <p className="text-xs">
                  <span className="text-muted-foreground">Advanced </span>
                  <Rate num={a.advanced} den={a.n} unit="advanced" />
                </p>
                <p className="tnum text-xs text-muted-foreground">
                  {a.n > 0 ? `${((a.advanced / a.n) * 100).toFixed(1)}% of ${a.n} owners` : "no owners"}
                  {a.bookings !== undefined && ` · ${a.bookings} booked`}
                  {a.emailed_after !== undefined && ` · ${a.emailed_after} emailed after assignment`}
                </p>
              </li>
            ))}
          </ul>
          {h.note && <p className="mt-3 border-t border-border pt-2 text-xs text-muted-foreground">{h.note}</p>}
        </div>
      )}
    </section>
  );
}

export function Recommendations({ recs }: { recs: Outreach["recommendations"] }) {
  return (
    <section className="min-w-0 space-y-2">
      <SectionHead title="Recommendations" sub="Proposed by the builder. Nothing here is applied; Gabriel changes the lane." />
      {recs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recommendations.</p>
      ) : (
        <ol className="divide-y divide-border rounded-lg border border-border">
          {recs.map((r, i) => (
            <li key={i} className="space-y-1 px-4 py-3 text-sm">
              <p className="font-medium">
                <span className="tnum mr-1.5 text-muted-foreground">{i + 1}.</span>
                {r.title}
              </p>
              {r.why && <p className="text-muted-foreground">{r.why}</p>}
              {r.change && (
                <p className="text-xs">
                  <span className="text-muted-foreground">Change </span>
                  <code className="break-all rounded-sm bg-muted px-1 py-px font-mono text-[12px]">{r.change}</code>
                </p>
              )}
              <dl className="grid gap-x-4 gap-y-0.5 text-xs sm:grid-cols-2">
                {r.expected && (
                  <div>
                    <dt className="inline text-muted-foreground">Expected </dt>
                    <dd className="inline">{r.expected}</dd>
                  </div>
                )}
                {r.risk && (
                  <div>
                    <dt className="inline text-muted-foreground">Risk </dt>
                    <dd className="inline">{r.risk}</dd>
                  </div>
                )}
              </dl>
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
    <section className="min-w-0 space-y-2">
      <SectionHead title="Caveats" />
      <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        {caveats.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </section>
  );
}

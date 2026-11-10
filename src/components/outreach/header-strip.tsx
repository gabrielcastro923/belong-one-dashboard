import type { Outreach } from "@/lib/types";
import { fmtStamp } from "@/lib/dates";

function Stat({ label, value, sub, tone }: { label: string; value: string | number; sub?: string; tone?: "critical" | "warn" }) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-card px-3 py-2.5">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div
        className={`tnum mt-0.5 text-2xl font-semibold leading-tight ${tone === "critical" ? "text-critical-ink" : tone === "warn" ? "text-warn-ink" : ""}`}
      >
        {value}
      </div>
      {sub && <div className="tnum text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

export function HeaderStrip({ o }: { o: Outreach }) {
  const t = o.today;
  return (
    <section className="min-w-0 space-y-2" aria-label="Today">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <Stat label="Sent today" value={t.sent} />
        <Stat label="Queued" value={t.queued} />
        <Stat label="Failed" value={t.failed} tone={t.failed > 0 ? "critical" : undefined} />
        <Stat label="Targeted / backfill" value={`${t.targeted} / ${t.backfill}`} sub={t.sent ? `${Math.round((t.targeted / t.sent) * 100)}% targeted` : undefined} />
        <Stat label="Replies to answer" value={t.replies_pending_answer} tone={t.replies_pending_answer > 0 ? "warn" : undefined} />
      </div>
      <p className="text-xs text-muted-foreground">
        Attribution is precedence, not causation: {o.attribution?.replace(/^precedence, not causation:\s*/i, "") ?? "a booking is credited to the last email sent before it"}. Only the holdout reads cause.
      </p>
      <p className="tnum text-xs text-muted-foreground">
        Send DB {fmtStamp(o.db_at)} · CRM snapshot {fmtStamp(o.snapshot_at)} · built {fmtStamp(o.generated)}
      </p>
    </section>
  );
}

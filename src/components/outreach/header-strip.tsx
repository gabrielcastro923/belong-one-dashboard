import type { Outreach } from "@/lib/types";
import { fmtStamp } from "@/lib/dates";
import { cn } from "@/lib/utils";

function Stat({ label, value, sub, tone }: { label: string; value: string | number; sub?: string; tone?: "critical" | "warn" }) {
  return (
    <div className={cn("min-w-0 bg-card px-5 py-4", tone === "critical" && "shadow-[inset_0_0_0_999px_rgb(var(--critical)/.06)]", tone === "warn" && "shadow-[inset_0_0_0_999px_rgb(var(--warn)/.09)]")}>
      <div className="flex items-center gap-1.5 text-xs text-muted">
        {tone && <span className={cn("h-1.5 w-1.5 rounded-full", tone === "critical" ? "bg-critical" : "bg-warn")} aria-hidden />}
        {label}
      </div>
      <div className={cn("num mt-1 text-[26px] font-semibold leading-8", tone === "critical" && "text-critical-ink", tone === "warn" && "text-warn-ink")}>{value}</div>
      {sub && <div className="tnum text-xs text-muted">{sub}</div>}
    </div>
  );
}

export function HeaderStrip({ o }: { o: Outreach }) {
  const t = o.today;
  return (
    <section className="min-w-0" aria-label="Today">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-5 max-sm:[&>*:last-child]:col-span-2">
        <Stat label="Sent today" value={t.sent} />
        <Stat label="Queued" value={t.queued} />
        <Stat label="Failed" value={t.failed} tone={t.failed > 0 ? "critical" : undefined} />
        <Stat
          label="Targeted / backfill"
          value={`${t.targeted} / ${t.backfill}`}
          sub={t.sent ? `${Math.round((t.targeted / t.sent) * 100)}% targeted` : undefined}
        />
        <Stat label="Replies to answer" value={t.replies_pending_answer} tone={t.replies_pending_answer > 0 ? "warn" : undefined} />
      </div>
      <p className="tnum mt-2 flex flex-wrap gap-x-3 text-xs text-muted">
        <span>Send DB {fmtStamp(o.db_at)}</span>
        <span>CRM {fmtStamp(o.snapshot_at)}</span>
        <span>Built {fmtStamp(o.generated)}</span>
      </p>
    </section>
  );
}

import { Check, Clock, HelpCircle, Minus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Lane } from "@/lib/types";
import { bookings, fmtMonth, sortLanes } from "@/lib/outreach";
import { Rate, SectionHead, TooSmall } from "./shared";

const STATUS = {
  OK: { label: "OK", variant: "good", Icon: Check },
  FAILING: { label: "Failing", variant: "critical", Icon: X },
  LATE: { label: "Late", variant: "warn", Icon: Clock },
  DISABLED: { label: "Disabled", variant: "default", Icon: Minus },
  unknown: { label: "Unknown", variant: "default", Icon: HelpCircle },
} as const;

function LaneStatusChip({ status }: { status: string }) {
  const { label, variant, Icon } = STATUS[status as keyof typeof STATUS] ?? STATUS.unknown;
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </Badge>
  );
}

/** Monthly sends, 2px line, last point marked. Text alternative in the title. */
function Sparkline({ months }: { months: Lane["months"] }) {
  const w = 120;
  const h = 28;
  const vals = months.map((m) => m.sent);
  const max = Math.max(1, ...vals);
  const x = (i: number) => (vals.length > 1 ? 3 + (i * (w - 6)) / (vals.length - 1) : w / 2);
  const y = (v: number) => h - 3 - (v / max) * (h - 6);
  const d = vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const desc = months.map((m) => `${fmtMonth(m.month)} ${m.sent}`).join(", ");
  const last = vals.length - 1;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Sent by month: ${desc}`} className="shrink-0 overflow-visible">
      <title>{`Sent by month: ${desc}`}</title>
      <line x1={0} x2={w} y1={h - 3} y2={h - 3} stroke="hsl(var(--border))" strokeWidth={1} />
      <path d={d} fill="none" stroke="hsl(var(--series-1))" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {last >= 0 && <circle cx={x(last)} cy={y(vals[last])} r={3} fill="hsl(var(--series-1))" stroke="hsl(var(--card))" strokeWidth={2} />}
    </svg>
  );
}

const cap = (l: Lane) =>
  [l.cap_per_run !== null && l.cap_per_run !== undefined ? `${l.cap_per_run}/run` : null, l.cap_per_day ? `${l.cap_per_day}/day` : null]
    .filter(Boolean)
    .join(" · ") || "no cap";

function LaneCard({ l, constraint, color }: { l: Lane; constraint?: string; color?: string }) {
  const p = l.last_30d;
  const b = bookings(p);
  return (
    <li className={`min-w-0 rounded-lg border bg-card p-3 ${l.status === "FAILING" ? "border-critical/50" : "border-border"}`}>
      <div className="flex flex-wrap items-center gap-1.5">
        {color && <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: color }} aria-hidden />}
        <h3 className="min-w-0 truncate text-sm font-semibold" title={l.key}>
          {l.label}
        </h3>
        <LaneStatusChip status={l.status} />
        {l.kind && <Badge variant="outline">{l.kind}</Badge>}
        <TooSmall n={p.sent} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {l.schedule || "no schedule"} · cap {cap(l)}
        {l.supply && l.supply.sent_today !== null && (
          <span className="tnum">
            {" "}
            · {l.supply.sent_today} sent today
            {l.supply.candidates_today !== null && ` of ${l.supply.candidates_today} candidates`}
            {l.supply.capped && ", capped"}
          </span>
        )}
      </p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <dl className="tnum grid grid-cols-[auto_auto] gap-x-3 gap-y-0.5 text-xs">
          <dt className="text-muted-foreground">Sent 30d</dt>
          <dd className="font-medium">{p.sent}</dd>
          <dt className="text-muted-foreground">Replies</dt>
          <dd>{p.replies}</dd>
          <dt className="text-muted-foreground">Consult booked</dt>
          <dd>{p.bookings_consult}</dd>
          <dt className="text-muted-foreground">Report booked</dt>
          <dd>{p.bookings_report}</dd>
        </dl>
        <Sparkline months={l.months} />
      </div>
      <p className="mt-2 text-xs">
        <span className="text-muted-foreground">Bookings </span>
        <Rate num={b} den={p.sent} given={p.bookings_per_1k} />
      </p>
      {constraint && (
        <p className="mt-1 text-xs">
          <span className="text-muted-foreground">Binding constraint: </span>
          {constraint}
        </p>
      )}
      {l.owner_note && <p className="mt-1 text-xs text-muted-foreground">{l.owner_note}</p>}
    </li>
  );
}

export function LaneBoard({ lanes, constraints, colors }: { lanes: Lane[]; constraints: Record<string, string>; colors: Record<string, string> }) {
  const all = sortLanes(lanes);
  // Lanes that sent nothing in 30 days have no rate to rank; list them compactly, failing ones stay on the board.
  const sorted = all.filter((l) => l.last_30d.sent > 0 || l.status === "FAILING");
  const idle = all.filter((l) => !sorted.includes(l));
  const failing = lanes.filter((l) => l.status === "FAILING").length;
  return (
    <section className="min-w-0 space-y-2">
      <SectionHead
        title="Lanes"
        sub={`Last 30 days. Failing lanes first, then bookings per 1k sends, with lanes under 100 sends ranked after the readable ones.${failing ? ` ${failing} failing.` : ""} Sparkline is sends by month.`}
      />
      {lanes.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">No lanes in outreach.json.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((l) => (
            <LaneCard key={l.key} l={l} constraint={constraints[l.key]} color={colors[l.key]} />
          ))}
        </ul>
      )}
      {idle.length > 0 && (
        <details className="text-xs">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
            {idle.length} lane{idle.length === 1 ? "" : "s"} sent nothing in the last 30 days
          </summary>
          <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
            {idle.map((l) => (
              <li key={l.key} className="flex flex-wrap items-center gap-1.5 px-3 py-2">
                <span className="font-medium">{l.label}</span>
                <LaneStatusChip status={l.status} />
                <span className="text-muted-foreground">
                  {l.schedule || "no schedule"}
                  {l.owner_note && ` · ${l.owner_note}`}
                </span>
                {constraints[l.key] && <span className="w-full text-muted-foreground">Binding constraint: {constraints[l.key]}</span>}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

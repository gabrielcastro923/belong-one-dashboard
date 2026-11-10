import { Badge } from "@/components/ui/badge";
import type { Lane } from "@/lib/types";
import { bookings, fmt1k, fmtMonth, per1k, sortLanes, tooSmall } from "@/lib/outreach";
import { cn } from "@/lib/utils";
import { SectionHead, TooSmall } from "./shared";

// Healthy lanes stay calm (grey chip, green dot); only FAILING and LATE take a warm chip.
const STATUS = {
  OK: { label: "OK", variant: "default", dot: "bg-live" },
  FAILING: { label: "Failing", variant: "critical", dot: "bg-critical" },
  LATE: { label: "Late", variant: "warn", dot: "bg-warn" },
  DISABLED: { label: "Disabled", variant: "outline", dot: "bg-muted/50" },
  unknown: { label: "Unknown", variant: "outline", dot: "bg-muted/50" },
} as const;

function LaneStatusChip({ status }: { status: string }) {
  const { label, variant, dot } = STATUS[status as keyof typeof STATUS] ?? STATUS.unknown;
  return (
    <Badge variant={variant}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} aria-hidden />
      {label}
    </Badge>
  );
}

/** Monthly sends in the lane's own colour, last point marked. Text alternative in the title. */
function Sparkline({ months, color }: { months: Lane["months"]; color: string }) {
  const w = 104;
  const h = 32;
  const vals = months.map((m) => m.sent);
  const max = Math.max(1, ...vals);
  const x = (i: number) => (vals.length > 1 ? 3 + (i * (w - 6)) / (vals.length - 1) : w / 2);
  const y = (v: number) => h - 3 - (v / max) * (h - 6);
  const d = vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = vals.length > 1 ? `${d} L${x(vals.length - 1).toFixed(1)},${h - 3} L${x(0).toFixed(1)},${h - 3} Z` : "";
  const desc = months.map((m) => `${fmtMonth(m.month)} ${m.sent}`).join(", ");
  const last = vals.length - 1;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Sent by month: ${desc}`} className="shrink-0 overflow-visible">
      <title>{`Sent by month: ${desc}`}</title>
      {area && <path d={area} fill={color} fillOpacity={0.12} />}
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      {last >= 0 && <circle cx={x(last)} cy={y(vals[last])} r={2.5} fill={color} stroke="rgb(var(--card))" strokeWidth={1.5} />}
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
  const v = per1k(b, p.sent, p.bookings_per_1k);
  const failing = l.status === "FAILING";
  const c = color ?? "rgb(var(--muted))";
  return (
    <li className={cn("flex min-w-0 flex-col rounded-lg border bg-card p-4", failing ? "border-critical/45 shadow-[0_0_0_3px_rgb(var(--critical)/.08)]" : "border-line")}>
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: c }} aria-hidden />
        <h3 className="min-w-0 truncate text-sm font-semibold" title={l.key}>
          {l.label}
        </h3>
        <span className="ml-auto flex shrink-0 items-center gap-1">
          <TooSmall n={p.sent} />
          <LaneStatusChip status={l.status} />
        </span>
      </div>
      <p className="mt-1 truncate text-xs text-muted" title={`${l.kind ? `${l.kind} · ` : ""}${l.schedule || "no schedule"} · cap ${cap(l)}`}>
        {l.kind && <span className="text-ink-2">{l.kind} · </span>}
        {l.schedule || "no schedule"} · cap {cap(l)}
        {l.supply && l.supply.sent_today !== null && (
          <span className="tnum">
            {" "}
            · {l.supply.sent_today} today
            {l.supply.candidates_today !== null && ` of ${l.supply.candidates_today}`}
            {l.supply.capped && ", capped"}
          </span>
        )}
      </p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-2xs text-muted">Bookings / 1k</div>
          <div className={cn("num text-[26px] font-semibold leading-8", tooSmall(p.sent) && "text-muted")}>{fmt1k(v)}</div>
        </div>
        <Sparkline months={l.months} color={c} />
      </div>
      <dl className="tnum mt-3 grid grid-cols-4 gap-2 border-t border-line pt-3 text-xs">
        {(
          [
            ["Sent 30d", p.sent],
            ["Replies", p.replies],
            ["Consult", p.bookings_consult],
            ["Report", p.bookings_report],
          ] as const
        ).map(([k, val]) => (
          <div key={k} className="min-w-0">
            <dt className="truncate text-2xs text-muted">{k}</dt>
            <dd className="font-medium text-ink">{val}</dd>
          </div>
        ))}
      </dl>
      {(constraint || l.owner_note) && (
        <div className="mt-3 space-y-1 border-t border-line pt-3 text-xs leading-5">
          {constraint && (
            <p className="line-clamp-2 text-ink-2" title={constraint}>
              <span className="text-muted">Binding constraint </span>
              {constraint}
            </p>
          )}
          {l.owner_note && (
            <p className="line-clamp-2 text-muted" title={l.owner_note}>
              {l.owner_note}
            </p>
          )}
        </div>
      )}
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
    <section className="min-w-0 space-y-3">
      <SectionHead
        title="Lanes"
        sub="Last 30 days. Failing lanes first, then bookings per 1k sends, with lanes under 100 sends ranked after the readable ones. Sparkline is sends by month, in the lane's colour."
      >
        {failing > 0 && <Badge variant="critical">{failing} failing</Badge>}
        <span className="tnum text-xs text-muted">{sorted.length} active · 30 days</span>
      </SectionHead>
      {lanes.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line-strong px-4 py-6 text-center text-sm text-muted">No lanes in outreach.json.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((l) => (
            <LaneCard key={l.key} l={l} constraint={constraints[l.key]} color={colors[l.key]} />
          ))}
        </ul>
      )}
      {idle.length > 0 && (
        <details className="group rounded-lg border border-line bg-card text-xs">
          <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-ink-2 hover:text-ink">
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="text-muted transition-transform group-open:rotate-90">
              <path d="M3.5 2 6.5 5 3.5 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="tnum font-medium">{idle.length}</span> idle lane{idle.length === 1 ? "" : "s"}
            <span className="text-muted">· nothing sent in 30 days</span>
          </summary>
          <ul className="divide-y divide-line border-t border-line">
            {idle.map((l) => (
              <li key={l.key} className="flex flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2.5">
                <span className="font-medium text-ink">{l.label}</span>
                <LaneStatusChip status={l.status} />
                <span className="text-muted">
                  {l.schedule || "no schedule"}
                  {l.owner_note && ` · ${l.owner_note}`}
                </span>
                {constraints[l.key] && <span className="w-full text-muted">Binding constraint: {constraints[l.key]}</span>}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

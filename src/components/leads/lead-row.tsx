import { Badge } from "@/components/ui/badge";
import type { Deal } from "@/lib/types";
import { bucketShort, fmtPhone, pct, telHref } from "@/lib/labels";
import { FAM, familyOf } from "@/lib/stage";
import { cn } from "@/lib/utils";

const dash = (n: number | null) => (n === null || n === undefined ? "—" : `${n}d`);

function VerdictBadge({ v, reason }: { v: Deal["verdict"]; reason: string }) {
  if (v === "work") return null;
  return (
    <Badge variant={v === "exclude" ? "critical" : "warn"} title={reason || undefined}>
      {v === "exclude" ? "Excluded" : "One-touch"}
    </Badge>
  );
}

function Name({ d }: { d: Deal }) {
  return (
    <a href={d.admin} target="_blank" rel="noreferrer" className="font-medium text-ink decoration-line-strong hover:underline">
      {d.name}
    </a>
  );
}

function Pending({ flags }: { flags: string[] }) {
  if (!flags?.length) return <span className="text-muted">—</span>;
  return (
    <span className="flex flex-wrap gap-1">
      {flags.map((f) => (
        <Badge key={f} variant="outline">
          {f}
        </Badge>
      ))}
    </span>
  );
}

function Stage({ d, compact }: { d: Deal; compact?: boolean }) {
  const fam = FAM[familyOf(d.bucket)];
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <span className={cn("h-2 w-2 shrink-0 rounded-full", fam.dot)} aria-hidden />
      <span className="tnum shrink-0 text-xs font-medium text-muted">{bucketShort(d.bucket)}</span>
      {!compact && <span className="min-w-0">{d.stage_label}</span>}
    </span>
  );
}

const Phone = ({ d, big }: { d: Deal; big?: boolean }) =>
  d.phone ? (
    <a
      href={telHref(d.phone)}
      className={cn(
        "tnum whitespace-nowrap",
        big ? "inline-flex h-9 items-center rounded-full border border-line-strong px-3.5 text-sm font-medium" : "text-ink decoration-line-strong hover:underline"
      )}
    >
      {fmtPhone(d.phone)}
    </a>
  ) : (
    <span className="text-muted">No phone</span>
  );

export function LeadTableRow({ d }: { d: Deal }) {
  return (
    <tr className="border-t border-line align-top hover:bg-soft/40">
      <td className="px-3 py-2.5 pl-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Name d={d} />
          <VerdictBadge v={d.verdict} reason={d.verdict_reason} />
        </div>
        <div className="text-xs text-muted">
          {d.city}, {d.state}
        </div>
      </td>
      <td className="min-w-[14rem] px-3 py-2.5">
        <Stage d={d} />
        <div className="tnum pl-4 text-xs text-muted">P {pct(d.p_list)}</div>
      </td>
      <td className="tnum px-3 py-2.5 text-right">{dash(d.stuck)}</td>
      <td className="tnum px-3 py-2.5 text-right">{dash(d.owner_event_age)}</td>
      <td className="tnum px-3 py-2.5 text-right text-ink-2">
        {d.attempts}
        <span className="text-muted">/</span>
        {d.connects}
      </td>
      <td className="px-3 py-2.5">
        <Pending flags={d.pending} />
      </td>
      <td className="max-w-[16rem] px-3 py-2.5 text-xs leading-5 text-ink-2">{d.next_action}</td>
      <td className="px-3 py-2.5 pr-4">
        <Phone d={d} />
        {d.call_window_et && <div className="tnum text-xs text-muted">{d.call_window_et} ET</div>}
      </td>
    </tr>
  );
}

export function LeadCard({ d }: { d: Deal }) {
  return (
    <li className="space-y-2 border-t border-line px-4 py-3.5 first:border-t-0">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Name d={d} />
            <VerdictBadge v={d.verdict} reason={d.verdict_reason} />
          </div>
          <p className="text-xs text-muted">
            {d.city}, {d.state} · {d.stage_label}
          </p>
        </div>
        <span className="tnum flex shrink-0 items-center gap-1.5 text-xs text-muted">
          <Stage d={d} compact />
          <span>{pct(d.p_list)}</span>
        </span>
      </div>
      <p className="text-sm leading-5 text-ink-2">{d.next_action}</p>
      <p className="tnum text-xs text-muted">
        Stuck {dash(d.stuck)} · event {dash(d.owner_event_age)} · {d.attempts} att / {d.connects} con
      </p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Phone d={d} big />
        {d.call_window_et && <span className="tnum text-xs text-muted">{d.call_window_et} ET</span>}
        <Pending flags={d.pending} />
      </div>
    </li>
  );
}

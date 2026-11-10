import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Deal } from "@/lib/types";
import { bucketShort, fmtPhone, pct, telHref } from "@/lib/labels";

const dash = (n: number | null) => (n === null || n === undefined ? "n/a" : `${n}d`);

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
    <a href={d.admin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium hover:underline">
      {d.name}
      <ExternalLink className="h-3 w-3 text-muted-foreground" aria-hidden />
    </a>
  );
}

function Pending({ flags }: { flags: string[] }) {
  if (!flags?.length) return <span className="text-muted-foreground">none</span>;
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

const Phone = ({ d }: { d: Deal }) =>
  d.phone ? (
    <a href={telHref(d.phone)} className="tnum whitespace-nowrap hover:underline">
      {fmtPhone(d.phone)}
    </a>
  ) : (
    <span className="text-muted-foreground">no phone</span>
  );

export function LeadTableRow({ d }: { d: Deal }) {
  return (
    <tr className="border-t border-border align-top">
      <td className="px-3 py-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Name d={d} />
          <VerdictBadge v={d.verdict} reason={d.verdict_reason} />
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
        {d.city}, {d.state}
      </td>
      <td className="px-3 py-2">
        <span className="font-mono text-xs text-muted-foreground">{bucketShort(d.bucket)}</span> {d.stage_label}
        <div className="tnum text-xs text-muted-foreground">P {pct(d.p_list)}</div>
      </td>
      <td className="tnum px-3 py-2 text-right">{dash(d.stuck)}</td>
      <td className="tnum px-3 py-2 text-right">{dash(d.owner_event_age)}</td>
      <td className="tnum px-3 py-2 text-right">
        {d.attempts}/{d.connects}
      </td>
      <td className="px-3 py-2">
        <Pending flags={d.pending} />
      </td>
      <td className="max-w-[16rem] px-3 py-2 text-xs">{d.next_action}</td>
      <td className="px-3 py-2">
        <Phone d={d} />
        {d.call_window_et && <div className="tnum text-xs text-muted-foreground">{d.call_window_et} ET</div>}
      </td>
    </tr>
  );
}

export function LeadCard({ d }: { d: Deal }) {
  return (
    <li className="space-y-1.5 border-t border-border py-3 first:border-t-0">
      <div className="flex flex-wrap items-center gap-1.5">
        <Name d={d} />
        <VerdictBadge v={d.verdict} reason={d.verdict_reason} />
        <span className="ml-auto font-mono text-xs text-muted-foreground">
          {bucketShort(d.bucket)} · P {pct(d.p_list)}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        {d.city}, {d.state} · {d.stage_label}
      </p>
      <p className="tnum text-xs text-muted-foreground">
        Stuck {dash(d.stuck)} · event {dash(d.owner_event_age)} · {d.attempts} attempts / {d.connects} connects
      </p>
      <p className="text-sm">{d.next_action}</p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <Phone d={d} />
        {d.call_window_et && <span className="tnum text-xs text-muted-foreground">{d.call_window_et} ET</span>}
        <Pending flags={d.pending} />
      </div>
    </li>
  );
}

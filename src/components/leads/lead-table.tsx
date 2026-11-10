"use client";

import { useMemo, useState } from "react";
import type { Bucket, Deal } from "@/lib/types";
import { LeadFilters, type Filters, type SortKey } from "./lead-filters";
import { LeadCard, LeadTableRow } from "./lead-row";

const init: Filters = { q: "", bucket: "", verdict: "", state: "", pending: "", showExcluded: false };

export function LeadTable({ deals, buckets }: { deals: Deal[]; buckets: Bucket[] }) {
  const [f, setF] = useState<Filters>(init);
  const [sort, setSortState] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "owner_event_age", dir: 1 });
  const set = (patch: Partial<Filters>) => setF((cur) => ({ ...cur, ...patch }));
  const setSort = (key: SortKey) =>
    setSortState((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: key === "p_list" ? -1 : 1 }));

  const bucketOpts = useMemo(() => {
    const seen = new Map<string, string>();
    buckets.forEach((b) => seen.set(b.key, b.label));
    deals.forEach((d) => !seen.has(d.bucket) && seen.set(d.bucket, d.stage_label));
    return Array.from(seen, ([key, label]) => ({ key, label })).sort((a, b) => a.key.localeCompare(b.key));
  }, [deals, buckets]);
  const states = useMemo(() => Array.from(new Set(deals.map((d) => d.state).filter(Boolean))).sort(), [deals]);
  const pendings = useMemo(() => Array.from(new Set(deals.flatMap((d) => d.pending ?? []))).sort(), [deals]);
  const excluded = deals.filter((d) => d.verdict === "exclude").length;

  const rows = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const out = deals.filter((d) => {
      if (f.verdict) {
        if (d.verdict !== f.verdict) return false;
      } else if (d.verdict === "exclude" && !f.showExcluded) return false;
      if (f.bucket && d.bucket !== f.bucket) return false;
      if (f.state && d.state !== f.state) return false;
      const pend = d.pending ?? [];
      if (f.pending === "__any" && !pend.length) return false;
      if (f.pending === "__none" && pend.length) return false;
      if (f.pending && !f.pending.startsWith("__") && !pend.includes(f.pending)) return false;
      if (q && ![d.name, d.city, d.state, d.note, d.next_action, String(d.home_id)].join(" ").toLowerCase().includes(q)) return false;
      return true;
    });
    const v = (d: Deal) => d[sort.key] ?? Number.POSITIVE_INFINITY;
    return out.sort((a, b) => (v(a) - v(b)) * sort.dir);
  }, [deals, f, sort]);

  const TH = "px-3 py-2 text-xs font-medium text-muted";
  return (
    <div className="space-y-3">
      <LeadFilters f={f} set={set} buckets={bucketOpts} states={states} pendings={pendings} sort={sort} setSort={setSort} excluded={excluded} />
      <div className="overflow-hidden rounded-lg border border-line bg-card">
        <div className="tnum flex items-center justify-between border-b border-line px-4 py-2.5 text-xs text-muted">
          <span>
            <span className="font-semibold text-ink">{rows.length}</span> of {deals.length} deals
          </span>
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead className="bg-soft/50 text-left">
              <tr>
                <th className={`${TH} pl-4`}>Name</th>
                <th className={TH}>Bucket</th>
                <th className={`${TH} text-right`}>Stuck</th>
                <th className={`${TH} text-right`}>Event age</th>
                <th className={`${TH} text-right`} title="Attempts / connects">
                  Att/Con
                </th>
                <th className={TH} title="Flags are not directional: they do not mean the owner wrote to us.">
                  Pending
                </th>
                <th className={TH}>Next action</th>
                <th className={`${TH} pr-4`}>Phone</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <LeadTableRow key={d.home_id} d={d} />
              ))}
            </tbody>
          </table>
        </div>
        <ul className="md:hidden">
          {rows.map((d) => (
            <LeadCard key={d.home_id} d={d} />
          ))}
        </ul>
        {rows.length === 0 && <p className="px-4 py-10 text-center text-sm text-muted">No deals match these filters.</p>}
      </div>
    </div>
  );
}

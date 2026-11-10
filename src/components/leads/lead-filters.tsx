import type { Verdict } from "@/lib/types";

export interface Filters {
  q: string;
  bucket: string;
  verdict: "" | Verdict;
  state: string;
  pending: string;
  showExcluded: boolean;
}

export type SortKey = "owner_event_age" | "stuck" | "p_list";

const sel = "h-9 min-w-0 rounded-md border border-border bg-card px-2 text-sm";

export function LeadFilters({
  f,
  set,
  buckets,
  states,
  pendings,
  sort,
  setSort,
  excluded,
}: {
  f: Filters;
  set: (patch: Partial<Filters>) => void;
  buckets: { key: string; label: string }[];
  states: string[];
  pendings: string[];
  sort: { key: SortKey; dir: 1 | -1 };
  setSort: (key: SortKey) => void;
  excluded: number;
}) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
        <input
          id="lead-q"
          type="search"
          value={f.q}
          onChange={(e) => set({ q: e.target.value })}
          placeholder="Search name, city, note"
          aria-label="Search"
          className={`${sel} col-span-2`}
        />
        <select id="lead-bucket" aria-label="Bucket" value={f.bucket} onChange={(e) => set({ bucket: e.target.value })} className={sel}>
          <option value="">All buckets</option>
          {buckets.map((b) => (
            <option key={b.key} value={b.key}>
              {b.label}
            </option>
          ))}
        </select>
        <select id="lead-verdict" aria-label="Verdict" value={f.verdict} onChange={(e) => set({ verdict: e.target.value as Filters["verdict"] })} className={sel}>
          <option value="">Work + one-touch</option>
          <option value="work">Work</option>
          <option value="one-touch">One-touch</option>
          <option value="exclude">Exclude</option>
        </select>
        <select id="lead-state" aria-label="State" value={f.state} onChange={(e) => set({ state: e.target.value })} className={sel}>
          <option value="">All states</option>
          {states.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select id="lead-pending" aria-label="Pending flag" value={f.pending} onChange={(e) => set({ pending: e.target.value })} className={sel}>
          <option value="">Any pending</option>
          <option value="__any">Has a flag</option>
          <option value="__none">No flag</option>
          {pendings.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="flex flex-wrap items-center gap-1">
          Sort
          {(
            [
              ["owner_event_age", "Event age"],
              ["stuck", "Stuck"],
              ["p_list", "P(list)"],
            ] as [SortKey, string][]
          ).map(([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setSort(k)}
              aria-pressed={sort.key === k}
              className={`rounded-sm border px-1.5 py-0.5 ${sort.key === k ? "border-foreground/50 text-foreground" : "border-border hover:text-foreground"}`}
            >
              {l}
              {sort.key === k && (sort.dir === 1 ? " ↑" : " ↓")}
            </button>
          ))}
        </span>
        <label className="inline-flex items-center gap-1.5">
          <input id="lead-excl" type="checkbox" checked={f.showExcluded} onChange={(e) => set({ showExcluded: e.target.checked })} />
          Show {excluded} excluded
        </label>
      </div>
    </div>
  );
}

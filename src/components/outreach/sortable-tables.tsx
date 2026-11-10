"use client";

import { useMemo, useState } from "react";
import type { SubjectRow, TemplateRow } from "@/lib/types";
import { per1k, tooSmall } from "@/lib/outreach";
import { Rate, SectionHead, TooSmall } from "./shared";
import { Segmented } from "@/components/ui/section";

type Key = "per_1k" | "sent" | "replies";
const KEYS: [Key, string][] = [
  ["per_1k", "Per 1k"],
  ["sent", "Sent"],
  ["replies", "Replies"],
];

interface Row {
  id: string;
  name: string;
  meta?: string;
  sent: number;
  replies: number;
  bookings: number;
  per_1k: number | null;
}

function SortableTable({ title, sub, nameHead, rows }: { title: string; sub: string; nameHead: string; rows: Row[] }) {
  const [sort, setSortState] = useState<{ key: Key; dir: 1 | -1 }>({ key: "per_1k", dir: -1 });
  const setSort = (key: Key) => setSortState((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: -1 }));
  const sorted = useMemo(() => {
    const v = (r: Row) => r[sort.key] ?? Number.NEGATIVE_INFINITY;
    // A rate on under 100 sends is noise, so rate sorts keep those rows below the readable ones.
    const small = (r: Row) => (sort.key === "per_1k" && tooSmall(r.sent) ? 1 : 0);
    return [...rows].sort((a, b) => small(a) - small(b) || (v(a) - v(b)) * sort.dir || b.sent - a.sent);
  }, [rows, sort]);

  return (
    <section className="min-w-0 space-y-3">
      <SectionHead title={title} sub={sub}>
        <Segmented<Key> label={`Sort ${title}`} options={KEYS} value={sort.key} dir={sort.dir} onChange={setSort} />
      </SectionHead>
      {rows.length === 0 ? (
        <p className="text-sm text-muted">None in outreach.json.</p>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-lg border border-line bg-card sm:block">
            <table className="w-full text-sm">
              <thead className="bg-soft/50 text-left text-xs text-muted">
                <tr>
                  <th className="px-3 py-2 pl-4 font-medium">{nameHead}</th>
                  <th className="px-3 py-2 text-right font-medium">Sent</th>
                  <th className="px-3 py-2 text-right font-medium">Replies</th>
                  <th className="px-3 py-2 text-right font-medium">Booked</th>
                  <th className="px-3 py-2 font-medium">Bookings per 1k</th>
                </tr>
              </thead>
              <tbody className="tnum">
                {sorted.map((r) => (
                  <tr key={r.id} className="border-t border-line align-top hover:bg-soft/40">
                    <td className="max-w-[24rem] px-3 py-2.5 pl-4">
                      <div className="break-words">{r.name}</div>
                      {r.meta && <div className="text-xs text-muted">{r.meta}</div>}
                    </td>
                    <td className="px-3 py-2.5 text-right">{r.sent}</td>
                    <td className="px-3 py-2.5 text-right">{r.replies}</td>
                    <td className="px-3 py-2.5 text-right">{r.bookings}</td>
                    <td className="px-3 py-2.5">
                      <span className="flex flex-wrap items-center gap-1.5">
                        <Rate num={r.bookings} den={r.sent} given={r.per_1k} />
                        <TooSmall n={r.sent} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="rounded-lg border border-line bg-card px-4 sm:hidden">
            {sorted.map((r) => (
              <li key={r.id} className="space-y-1 border-t border-line py-3 first:border-t-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="min-w-0 break-words font-medium">{r.name}</span>
                  <TooSmall n={r.sent} />
                </div>
                {r.meta && <p className="text-xs text-muted">{r.meta}</p>}
                <p className="tnum text-xs text-muted">
                  {r.sent} sent · {r.replies} replies · {r.bookings} booked
                </p>
                <p className="text-xs">
                  <Rate num={r.bookings} den={r.sent} given={r.per_1k} />
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export function TemplateTable({ rows, laneLabel }: { rows: TemplateRow[]; laneLabel: Record<string, string> }) {
  const data: Row[] = rows.map((t, i) => ({
    id: `${t.lane}:${t.template_version}:${i}`,
    name: t.template_version || "(no version)",
    meta: `${laneLabel[t.lane] ?? t.lane} · ${t.first_sent} to ${t.last_sent}`,
    sent: t.sent,
    replies: t.replies,
    bookings: t.bookings,
    per_1k: per1k(t.bookings, t.sent, t.per_1k),
  }));
  return <SortableTable title="Templates" sub="Every template version in the window, with the lane that sent it." nameHead="Template" rows={data} />;
}

export function SubjectTable({ rows }: { rows: SubjectRow[] }) {
  const data: Row[] = rows.map((s, i) => ({
    id: `${s.subject}:${i}`,
    name: s.subject || "(no subject)",
    sent: s.sent,
    replies: s.replies,
    bookings: s.bookings,
    per_1k: per1k(s.bookings, s.sent),
  }));
  return <SortableTable title="Subjects" sub="Top 20 subject lines by sends, last 90 days." nameHead="Subject" rows={data} />;
}

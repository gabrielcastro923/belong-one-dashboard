import type { TouchRow } from "@/lib/types";
import { fmt1k, per1k, tooSmall } from "@/lib/outreach";
import { MiniBars } from "./mini-bars";
import { Rate, SectionHead, TooSmall } from "./shared";

const touchLabel = (n: number) => (n === 1 ? "1st touch" : `Touch ${n}`);

export function TouchSection({ rows }: { rows: TouchRow[] }) {
  const sorted = [...rows].sort((a, b) => a.touch_n - b.touch_n);
  return (
    <section className="min-w-0 space-y-2">
      <SectionHead title="First touch vs re-touch" sub="Touch number is how many emails this owner had received, counting this one." />
      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">No touch data.</p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-[3fr_2fr]">
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Touch</th>
                  <th className="px-3 py-2 text-right font-medium">Sent</th>
                  <th className="px-3 py-2 text-right font-medium">Replies</th>
                  <th className="px-3 py-2 text-right font-medium">Booked</th>
                  <th className="px-3 py-2 font-medium">Bookings per 1k</th>
                </tr>
              </thead>
              <tbody className="tnum">
                {sorted.map((r) => (
                  <tr key={r.touch_n} className="border-t border-border">
                    <td className="whitespace-nowrap px-3 py-2">{touchLabel(r.touch_n)}</td>
                    <td className="px-3 py-2 text-right">{r.sent}</td>
                    <td className="px-3 py-2 text-right">{r.replies}</td>
                    <td className="px-3 py-2 text-right">{r.bookings}</td>
                    <td className="px-3 py-2">
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
          <MiniBars
            title="Bookings per 1k by touch"
            decimals={1}
            rows={sorted.map((r) => {
              const v = per1k(r.bookings, r.sent, r.per_1k);
              return {
                x: r.touch_n === 1 ? "1st" : String(r.touch_n),
                y: v,
                faint: tooSmall(r.sent),
                tip: [
                  { label: "Per 1k", value: fmt1k(v) },
                  { label: "Booked", value: r.bookings },
                  { label: "Sent", value: r.sent },
                ],
              };
            })}
          />
        </div>
      )}
    </section>
  );
}

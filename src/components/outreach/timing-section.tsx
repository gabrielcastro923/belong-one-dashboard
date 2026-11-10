import type { Outreach } from "@/lib/types";
import { MiniBars, type MiniRow } from "./mini-bars";
import { SectionHead } from "./shared";

const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hourLabel = (h: number) => (h === 0 ? "12a" : h < 12 ? `${h}a` : h === 12 ? "12p" : `${h - 12}p`);

type T = { sent: number; replies: number; bookings: number };
const tip = (r: T) => [
  { label: "Sent", value: r.sent },
  { label: "Replies", value: r.replies },
  { label: "Booked", value: r.bookings },
];

export function TimingSection({ o }: { o: Outreach }) {
  const dow = [...o.day_of_week].sort((a, b) => DOW.indexOf(a.dow) - DOW.indexOf(b.dow));
  const hours = [...o.hour_et].sort((a, b) => a.hour - b.hour);
  const rows = <R extends T>(xs: R[], x: (r: R) => string, pick: "sent" | "bookings"): MiniRow[] =>
    xs.map((r) => ({ x: x(r), y: r[pick], tip: tip(r) }));
  return (
    <section className="min-w-0 space-y-2">
      <SectionHead title="Timing" sub="When the email went out, Eastern Time. Bookings are credited to the send before them, so a busy hour collects more by volume alone." />
      <div className="grid gap-3 sm:grid-cols-2">
        <MiniBars title="Sent by day of week" rows={rows(dow, (r) => r.dow, "sent")} />
        <MiniBars title="Bookings by day of week" rows={rows(dow, (r) => r.dow, "bookings")} />
        <MiniBars title="Sent by hour (ET)" rows={rows(hours, (r) => hourLabel(r.hour), "sent")} />
        <MiniBars title="Bookings by hour (ET)" rows={rows(hours, (r) => hourLabel(r.hour), "bookings")} />
      </div>
    </section>
  );
}

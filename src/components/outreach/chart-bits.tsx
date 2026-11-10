"use client";

export const INK = "rgb(var(--muted))";
export const GRID = "rgb(var(--line))";
export const SURFACE = "rgb(var(--card))";
/** Bookings are report-family work: the violet. Consults are agreement-family: the indigo. Sends are neutral. */
export const SERIES = "rgb(var(--st-report))";
export const CONSULT = "rgb(var(--st-agree))";
export const SENT = "rgb(var(--ink-2) / .45)";
export const tick = { fontSize: 11, fill: INK };

/** Dark single-value tooltip: the headline value large, then muted rows. */
export function TipBox({ title, rows }: { title: string; rows: { label: string; value: string | number; color?: string; dashed?: boolean }[] }) {
  return (
    <div className="tnum min-w-[9rem] rounded-md bg-tip px-3 py-2 text-xs text-white shadow-[0_12px_32px_-8px_rgb(0_0_0/.35)]">
      <div className="mb-1 font-medium text-white/70">{title}</div>
      {rows.map((r, i) => (
        <div key={r.label} className={i === 0 ? "flex items-baseline gap-2" : "flex items-center gap-1.5"}>
          {r.color && (
            <span
              className={r.dashed ? "w-2.5 border-t-2 border-dashed" : "h-2 w-2 rounded-full"}
              style={r.dashed ? { borderColor: r.color } : { background: r.color }}
              aria-hidden
            />
          )}
          {i === 0 ? (
            <>
              <span className="text-[17px] font-semibold leading-6">{r.value}</span>
              <span className="text-white/70">{r.label}</span>
            </>
          ) : (
            <>
              <span className="text-white/70">{r.label}</span>
              <span className="ml-auto pl-3 font-medium">{r.value}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export function LegendItem({ color, label, line, dashed }: { color: string; label: string; line?: boolean; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {line ? (
        <span className={`w-3 border-t-2 ${dashed ? "border-dashed" : ""}`} style={{ borderColor: color }} aria-hidden />
      ) : (
        <span className="h-2 w-2 rounded-full" style={{ background: color }} aria-hidden />
      )}
      {label}
    </span>
  );
}

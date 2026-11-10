"use client";

export const INK = "hsl(var(--muted-foreground))";
export const GRID = "hsl(var(--border))";
export const SURFACE = "hsl(var(--card))";
export const SERIES = "hsl(var(--series-1))";
export const tick = { fontSize: 11, fill: INK };

export function TipBox({ title, rows }: { title: string; rows: { label: string; value: string | number; color?: string; dashed?: boolean }[] }) {
  return (
    <div className="tnum rounded-md border border-border bg-card px-2.5 py-1.5 text-xs shadow-sm">
      <div className="font-medium">{title}</div>
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-1.5">
          {r.color && (
            <span
              className={r.dashed ? "w-2.5 border-t-2 border-dashed" : "h-2 w-2 rounded-sm"}
              style={r.dashed ? { borderColor: r.color } : { background: r.color }}
              aria-hidden
            />
          )}
          <span className="text-muted-foreground">{r.label}</span>
          <span className="ml-auto pl-3">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export function LegendItem({ color, label, line, dashed }: { color: string; label: string; line?: boolean; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1">
      {line ? (
        <span className={`w-3 border-t-2 ${dashed ? "border-dashed" : ""}`} style={{ borderColor: color }} aria-hidden />
      ) : (
        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} aria-hidden />
      )}
      {label}
    </span>
  );
}

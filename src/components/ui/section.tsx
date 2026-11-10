import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Hint } from "./hint";

/** Page title row: h1 left (with its explanation as a tooltip), facts and controls right. */
export function PageHead({ title, hint, children, srOnly }: { title: string; hint?: ReactNode; children?: ReactNode; srOnly?: boolean }) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-3">
      <div className={cn("flex items-center gap-2", srOnly && "sr-only")}>
        <h1 className="text-[22px] font-semibold leading-7 tracking-[-0.02em]">{title}</h1>
        {hint && <Hint text={hint} />}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2 sm:ml-auto">{children}</div>}
    </div>
  );
}

/** Section title row inside or above a panel. */
export function SectionHead({ title, hint, children, className, as: H = "h2" }: { title: ReactNode; hint?: ReactNode; children?: ReactNode; className?: string; as?: "h2" | "h3" }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      <div className="flex min-w-0 items-center gap-2">
        <H className="text-[15px] font-semibold leading-6 tracking-[-0.01em]">{title}</H>
        {hint && <Hint text={hint} />}
      </div>
      {children && <div className="ml-auto flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

/** Calm panel: 1px border, no shadow. */
export function Panel({ className, children, as: As = "section" }: { className?: string; children: ReactNode; as?: "section" | "div" | "li" }) {
  return <As className={cn("min-w-0 rounded-lg border border-line bg-card", className)}>{children}</As>;
}

/** Pill for header facts ("13 working days left"). */
export function Pill({ children, tone = "default", className }: { children: ReactNode; tone?: "default" | "warn" | "critical"; className?: string }) {
  return (
    <span
      className={cn(
        "tnum inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium",
        tone === "default" && "border-line bg-card text-ink-2",
        tone === "warn" && "border-warn/40 bg-warn/10 text-warn-ink",
        tone === "critical" && "border-critical/40 bg-critical/10 text-critical-ink",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Segmented control: shrinks and truncates, never scrolls. */
export function Segmented<K extends string>({
  options,
  value,
  onChange,
  dir,
  label,
}: {
  options: [K, string][];
  value: K;
  onChange: (k: K) => void;
  dir?: 1 | -1;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex min-w-0 rounded-lg bg-soft p-0.5">
      {options.map(([k, l]) => {
        const on = k === value;
        return (
          <button
            key={k}
            type="button"
            onClick={() => onChange(k)}
            aria-pressed={on}
            title={l}
            className={cn(
              "min-w-0 truncate rounded-md px-2.5 py-1 text-xs transition-colors",
              on ? "bg-card font-medium text-ink shadow-[0_0_0_1px_rgb(var(--line))]" : "text-muted hover:text-ink"
            )}
          >
            {l}
            {on && dir !== undefined && <span className="ml-1 text-muted">{dir === 1 ? "↑" : "↓"}</span>}
          </button>
        );
      })}
    </div>
  );
}

export const TH = "px-3 py-2 text-xs font-medium text-muted";
export const TD = "px-3 py-2.5";

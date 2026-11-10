import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * One tooltip system for the whole site: dark surface, 12px, above the trigger, on hover and keyboard focus
 * (a tap focuses it on phones). Explanations live here, never as sentences on the screen.
 */
export function Tip({
  text,
  children,
  align = "center",
  side = "top",
  className,
}: {
  text: ReactNode;
  children: ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
  className?: string;
}) {
  return (
    <span className={cn("group/tip relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 w-max max-w-[18rem] rounded-md bg-tip px-2.5 py-1.5 text-left text-xs font-normal normal-case tracking-normal text-white opacity-0 shadow-[0_8px_24px_-6px_rgb(0_0_0/.35)] transition-opacity duration-150 group-focus-within/tip:opacity-100 group-hover/tip:opacity-100",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
          align === "center" && "left-1/2 -translate-x-1/2",
          align === "start" && "left-0",
          align === "end" && "right-0"
        )}
      >
        {text}
      </span>
    </span>
  );
}

/** A small "?" that carries a section's explanation. */
export function Hint({ text, align = "start", label = "About this" }: { text: ReactNode; align?: "start" | "center" | "end"; label?: string }) {
  return (
    <Tip text={text} align={align}>
      <button
        type="button"
        aria-label={label}
        className="grid h-4 w-4 place-items-center rounded-full border border-line-strong text-[10px] font-medium leading-none text-muted transition-colors hover:border-ink-2 hover:text-ink"
      >
        ?
      </button>
    </Tip>
  );
}

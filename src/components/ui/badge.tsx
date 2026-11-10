import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Chips: 6px radius, 11px medium, a tint and a faint inset ring. Warm tints only for problems.
const badgeVariants = cva(
  "inline-flex h-5 items-center gap-1 whitespace-nowrap rounded-md px-1.5 text-2xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "bg-soft text-ink-2 ring-transparent",
        outline: "bg-transparent text-ink-2 ring-line-strong",
        good: "bg-live/10 text-good-ink ring-live/25",
        warn: "bg-warn/15 text-warn-ink ring-warn/35",
        critical: "bg-critical/10 text-critical-ink ring-critical/30",
        series: "bg-soft text-ink ring-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

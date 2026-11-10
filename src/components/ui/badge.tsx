import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-sm border px-1.5 py-px text-[11px] font-medium leading-4",
  {
    variants: {
      variant: {
        default: "border-transparent bg-muted text-muted-foreground",
        outline: "border-border text-foreground",
        good: "border-good/40 bg-good/10 text-good-ink",
        warn: "border-warn/50 bg-warn/10 text-warn-ink",
        critical: "border-critical/40 bg-critical/10 text-critical-ink",
        series: "border-series/40 bg-series/10 text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

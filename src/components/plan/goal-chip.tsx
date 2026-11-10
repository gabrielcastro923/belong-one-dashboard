import { FAM, familyOf } from "@/lib/stage";
import { goalLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";

/** Goal chip: the colour is the deal's stage family, the words are the call's goal. */
export function GoalChip({ goal, bucket, className }: { goal: string; bucket: string; className?: string }) {
  const f = FAM[familyOf(bucket)];
  return (
    <span className={cn("inline-flex h-6 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2 text-xs font-medium text-ink ring-1 ring-inset", f.chip, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", f.dot)} aria-hidden />
      {goalLabel(goal)}
    </span>
  );
}

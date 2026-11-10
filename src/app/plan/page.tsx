import { getPlan } from "@/lib/data";
import { PlanBoard } from "@/components/plan/plan-board";

export const metadata = { title: "Plan · Path to 20" };

export default function PlanPage() {
  const plan = getPlan();
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">Daily schedule</h1>
        <p className="text-sm text-muted-foreground">
          Times are ET. Phone first; every call that answers ends with a booked report call or inspection. Checkboxes and counters save in this browser only.
        </p>
        {plan.booking_link && (
          <p className="text-sm">
            Report call booking link:{" "}
            <a href={plan.booking_link} target="_blank" rel="noreferrer" className="break-all text-series underline underline-offset-2">
              {plan.booking_link}
            </a>
          </p>
        )}
        <p className="text-xs text-muted-foreground">Days marked Projection are drafted from today&apos;s book and will change as the plan rebuilds.</p>
      </div>
      <PlanBoard plan={plan} />
    </div>
  );
}

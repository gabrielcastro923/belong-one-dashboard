import { ArrowUpRight } from "lucide-react";
import { getPlan } from "@/lib/data";
import { PlanBoard } from "@/components/plan/plan-board";
import { PageHead, Pill } from "@/components/ui/section";
import { Tip } from "@/components/ui/hint";

export const metadata = { title: "Plan · Path to 20" };

export default function PlanPage() {
  const plan = getPlan();
  return (
    <div>
      <PageHead
        title="Daily schedule"
        hint="Times are ET. Phone first; every call that answers ends with a booked report call or inspection. Checkboxes and counters save in this browser only. Days marked Projection are drafted from today's book and will change as the plan rebuilds."
      >
        <Tip text="Block times are Eastern; each call shows the owner's local time." align="end">
          <Pill>
            <span tabIndex={0}>Times ET</span>
          </Pill>
        </Tip>
        {plan.booking_link && (
          <Tip text={plan.booking_link} align="end">
            <a
              href={plan.booking_link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-7 items-center gap-1 rounded-full bg-ink px-3 text-xs font-medium text-card transition-opacity hover:opacity-90"
            >
              Report call booking link
              <ArrowUpRight className="h-3 w-3" strokeWidth={1.75} aria-hidden />
            </a>
          </Tip>
        )}
      </PageHead>
      <PlanBoard plan={plan} />
    </div>
  );
}

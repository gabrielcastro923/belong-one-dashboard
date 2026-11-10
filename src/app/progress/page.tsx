import { getPipeline, getPlan } from "@/lib/data";
import { ProgressCharts } from "@/components/progress/progress-charts";
import { CheckpointTargets } from "@/components/progress/checkpoint-targets";
import { ChecklistHistory } from "@/components/progress/checklist-history";
import { PageHead } from "@/components/ui/section";

export const metadata = { title: "Progress · Path to 20" };

export default function ProgressPage() {
  const p = getPipeline();
  const plan = getPlan();
  const hasSeries = (p.progress?.length ?? 0) > 0;
  return (
    <div className="space-y-10">
      <div>
        <PageHead title="Progress" hint="Month-to-date actuals against linear pace between the Friday checkpoints." />
        {hasSeries ? <ProgressCharts p={p} /> : <CheckpointTargets checkpoints={p.checkpoints} />}
      </div>
      <ChecklistHistory plan={plan} />
    </div>
  );
}

import { getPipeline, getPlan } from "@/lib/data";
import { ProgressCharts } from "@/components/progress/progress-charts";
import { CheckpointTargets } from "@/components/progress/checkpoint-targets";
import { ChecklistHistory } from "@/components/progress/checklist-history";

export const metadata = { title: "Progress · Path to 20" };

export default function ProgressPage() {
  const p = getPipeline();
  const plan = getPlan();
  const hasSeries = (p.progress?.length ?? 0) > 0;
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Progress</h1>
      {hasSeries ? <ProgressCharts p={p} /> : <CheckpointTargets checkpoints={p.checkpoints} />}
      <ChecklistHistory plan={plan} />
    </div>
  );
}

import { getPipeline } from "@/lib/data";
import { StatTiles } from "@/components/scoreboard/stat-tiles";
import { PaceStrip } from "@/components/scoreboard/pace-strip";
import { CheckpointTable } from "@/components/scoreboard/checkpoint-table";
import { PathTable } from "@/components/scoreboard/path-table";
import { FunnelBar } from "@/components/scoreboard/funnel-bar";
import { PageHead, Pill } from "@/components/ui/section";

export default function ScoreboardPage() {
  const p = getPipeline();
  const { deals: _deals, ...slim } = p;
  void _deals;
  return (
    <div className="space-y-4">
      <PageHead title="Scoreboard" hint={`Path to ${p.target} listings in November. Floor ${p.floor}.`}>
        <Pill>{p.working_days_left} working days left</Pill>
      </PageHead>
      <StatTiles p={slim} />
      <PaceStrip p={p} />
      <CheckpointTable p={slim as typeof p} />
      <div className="grid gap-4 lg:grid-cols-[7fr_5fr]">
        <PathTable p={p} />
        <FunnelBar buckets={p.buckets} />
      </div>
    </div>
  );
}

import { getPipeline } from "@/lib/data";
import { StatTiles } from "@/components/scoreboard/stat-tiles";
import { PaceStrip } from "@/components/scoreboard/pace-strip";
import { CheckpointTable } from "@/components/scoreboard/checkpoint-table";
import { PathTable } from "@/components/scoreboard/path-table";
import { FunnelBar } from "@/components/scoreboard/funnel-bar";

export default function ScoreboardPage() {
  const p = getPipeline();
  return (
    <div className="space-y-6">
      <h1 className="sr-only">Scoreboard</h1>
      <StatTiles p={p} />
      <PaceStrip p={p} />
      <CheckpointTable p={p} />
      <PathTable p={p} />
      <FunnelBar buckets={p.buckets} />
    </div>
  );
}

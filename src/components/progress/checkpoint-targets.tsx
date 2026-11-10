import type { Checkpoint } from "@/lib/types";
import { fmtDay } from "@/lib/dates";

export function CheckpointTargets({ checkpoints }: { checkpoints: Checkpoint[] }) {
  return (
    <section className="min-w-0 space-y-2">
      <p className="text-sm text-muted-foreground">No daily progress series in pipeline.json yet. Checkpoint targets:</p>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 text-right font-medium">Calls held</th>
              <th className="px-3 py-2 text-right font-medium">Floor</th>
              <th className="px-3 py-2 text-right font-medium">Inspections</th>
              <th className="px-3 py-2 text-right font-medium">Listed</th>
            </tr>
          </thead>
          <tbody className="tnum">
            {checkpoints.map((c) => (
              <tr key={c.date} className="border-t border-border">
                <td className="px-3 py-2">{fmtDay(c.date)}</td>
                <td className="px-3 py-2 text-right">{c.calls_target}</td>
                <td className="px-3 py-2 text-right">{c.calls_floor}</td>
                <td className="px-3 py-2 text-right">{c.insp}</td>
                <td className="px-3 py-2 text-right">{c.listed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

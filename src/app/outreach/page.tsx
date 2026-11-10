import { getLaneConstraints, getOutreach } from "@/lib/data";
import { laneColors } from "@/lib/outreach";
import { DbStaleBanner } from "@/components/outreach/db-stale-banner";
import { HeaderStrip } from "@/components/outreach/header-strip";
import { LaneBoard } from "@/components/outreach/lane-board";
import { MonthlyCharts } from "@/components/outreach/monthly-charts";
import { TouchSection } from "@/components/outreach/touch-section";
import { SubjectTable, TemplateTable } from "@/components/outreach/sortable-tables";
import { TimingSection } from "@/components/outreach/timing-section";
import { Caveats, HoldoutPanel, Recommendations } from "@/components/outreach/notes-sections";

export const metadata = { title: "Outreach · Path to 20" };

export default function OutreachPage() {
  const o = getOutreach();
  if (!o) {
    return (
      <div className="space-y-4">
        <h1 className="text-lg font-semibold">Outreach</h1>
        <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No outreach data yet. When Tools/scripts/build_outreach.py writes public/data/outreach.json, every send lane shows here with its bookings.
        </div>
      </div>
    );
  }
  const constraints = getLaneConstraints();
  const { colored, other, color } = laneColors(o.lanes);
  const laneLabel = Object.fromEntries(o.lanes.map((l) => [l.key, l.label]));
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-lg font-semibold">Outreach</h1>
        <DbStaleBanner dbAt={o.db_at} placeholder={Boolean(o.placeholder)} />
      </div>
      <HeaderStrip o={o} />
      <LaneBoard lanes={o.lanes} constraints={constraints} colors={color} />
      <MonthlyCharts o={o} colors={color} order={[...colored, ...other].map((l) => ({ key: l.key, label: l.label }))} />
      <TouchSection rows={o.first_touch_vs_retouch} />
      <TemplateTable rows={o.templates} laneLabel={laneLabel} />
      <SubjectTable rows={o.subjects} />
      <TimingSection o={o} />
      <HoldoutPanel h={o.holdout} />
      <Recommendations recs={o.recommendations} />
      <Caveats caveats={o.caveats} />
    </div>
  );
}

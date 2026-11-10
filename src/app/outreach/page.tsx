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
import { PageHead } from "@/components/ui/section";

export const metadata = { title: "Outreach · Path to 20" };

export default function OutreachPage() {
  const o = getOutreach();
  if (!o) {
    return (
      <div>
        <PageHead title="Outreach" />
        <div className="rounded-lg border border-dashed border-line-strong px-4 py-10 text-center text-sm text-muted">
          No outreach data yet. When Tools/scripts/build_outreach.py writes public/data/outreach.json, every send lane shows here with its bookings.
        </div>
      </div>
    );
  }
  const constraints = getLaneConstraints();
  const { colored, other, color } = laneColors(o.lanes);
  const laneLabel = Object.fromEntries(o.lanes.map((l) => [l.key, l.label]));
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <PageHead
          title="Outreach"
          hint={`Attribution is precedence, not causation: ${o.attribution?.replace(/^precedence, not causation:\s*/i, "") ?? "a booking is credited to the last email sent before it"}. Only the holdout reads cause.`}
        />
        <div className="-mt-2 space-y-4">
          <DbStaleBanner dbAt={o.db_at} placeholder={Boolean(o.placeholder)} />
          <HeaderStrip o={o} />
        </div>
      </div>
      <LaneBoard lanes={o.lanes} constraints={constraints} colors={color} />
      <MonthlyCharts o={o} colors={color} order={[...colored, ...other].map((l) => ({ key: l.key, label: l.label }))} />
      <TouchSection rows={o.first_touch_vs_retouch} />
      <div className="grid gap-10 xl:grid-cols-2 xl:gap-6">
        <TemplateTable rows={o.templates} laneLabel={laneLabel} />
        <SubjectTable rows={o.subjects} />
      </div>
      <TimingSection o={o} />
      <HoldoutPanel h={o.holdout} />
      <Recommendations recs={o.recommendations} />
      <Caveats caveats={o.caveats} />
    </div>
  );
}

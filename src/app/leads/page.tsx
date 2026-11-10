import { getPipeline } from "@/lib/data";
import { LeadTable } from "@/components/leads/lead-table";

export const metadata = { title: "Leads · Path to 20" };

export default function LeadsPage() {
  const p = getPipeline();
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">Leads</h1>
        <p className="text-sm text-muted-foreground">
          Every open deal in buckets 1 to 7 plus listed. Pending flags are not directional: they do not mean the owner wrote to us.
        </p>
      </div>
      <LeadTable deals={p.deals} buckets={p.buckets} />
    </div>
  );
}

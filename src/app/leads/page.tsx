import { getPipeline } from "@/lib/data";
import { LeadTable } from "@/components/leads/lead-table";
import { PageHead } from "@/components/ui/section";

export const metadata = { title: "Leads · Path to 20" };

export default function LeadsPage() {
  const p = getPipeline();
  return (
    <div>
      <PageHead
        title="Leads"
        hint="Every open deal in buckets 1 to 7 plus listed. Pending flags are not directional: they do not mean the owner wrote to us."
      />
      <LeadTable deals={p.deals} buckets={p.buckets} />
    </div>
  );
}

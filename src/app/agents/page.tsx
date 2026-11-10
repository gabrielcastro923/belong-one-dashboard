import { getAgents } from "@/lib/data";
import { AgentList } from "@/components/agents/agent-list";
import { PageHead, Pill, SectionHead } from "@/components/ui/section";

export const metadata = { title: "Agents · Path to 20" };

export default function AgentsPage() {
  const a = getAgents();
  const n = (re: RegExp) => a?.agents.filter((x) => re.test(x.status)).length ?? 0;
  const failing = n(/fail/i);
  const late = n(/late/i);
  return (
    <div className="space-y-10">
      <div>
        <PageHead title="Automation" hint={a?.generated ? `Checked ${a.generated.slice(0, 16).replace("T", " ")} ET` : undefined}>
          {a && a.agents.length > 0 && (
            <>
              <Pill>{a.agents.length} agents</Pill>
              <Pill tone={failing ? "critical" : "default"}>{failing} failing</Pill>
              <Pill tone={late ? "warn" : "default"}>{late} late</Pill>
              <Pill>{n(/proposed/i)} proposed</Pill>
            </>
          )}
        </PageHead>
        {!a || a.agents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line-strong px-4 py-10 text-center text-sm text-muted">
            No agent list yet. When the plan builder writes public/data/agents.json, every subagent and launchd lane shows here with its status and owned metric.
          </div>
        ) : (
          <AgentList agents={a.agents} />
        )}
      </div>
      {a?.readme && (
        <section className="min-w-0 space-y-3">
          <SectionHead title="Proposed agents" />
          <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-card p-5 font-mono text-xs leading-relaxed text-ink-2">{a.readme}</pre>
        </section>
      )}
    </div>
  );
}

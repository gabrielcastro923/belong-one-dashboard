import { getAgents } from "@/lib/data";
import { AgentList } from "@/components/agents/agent-list";

export const metadata = { title: "Agents · Path to 20" };

export default function AgentsPage() {
  const a = getAgents();
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">Automation</h1>
        {a && a.agents.length > 0 && (
          <p className="tnum text-sm text-muted-foreground">
            {a.agents.length} agents · {a.agents.filter((x) => /fail/i.test(x.status)).length} failing ·{" "}
            {a.agents.filter((x) => /late/i.test(x.status)).length} late · {a.agents.filter((x) => /proposed/i.test(x.status)).length} proposed
            {a.generated && ` · checked ${a.generated.slice(0, 16).replace("T", " ")} ET`}
          </p>
        )}
      </div>
      {!a || a.agents.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No agent list yet. When the plan builder writes public/data/agents.json, every subagent and launchd lane shows here with its status and owned metric.
        </div>
      ) : (
        <AgentList agents={a.agents} />
      )}
      {a?.readme && (
        <section className="min-w-0 space-y-2">
          <h2 className="text-sm font-semibold">Proposed agents</h2>
          <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed">{a.readme}</pre>
        </section>
      )}
    </div>
  );
}

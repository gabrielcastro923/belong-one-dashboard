"use client";

import { useMemo, useState } from "react";
import { mockLeads } from "@/data/data";
import type { AttentionSection } from "@/data/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Mail, MessageSquare, Phone } from "lucide-react";

const SECTIONS: {
  key: AttentionSection;
  title: string;
  subtitle?: string;
  danger?: boolean;
}[] = [
  { key: "stuck_late", title: "Stuck in late stage", subtitle: "Each of these = 1 home already earned but unbooked.", danger: true },
  { key: "proposal_silence", title: "Proposal sent, silence" },
  { key: "unanswered_inbound", title: "Unanswered inbound" },
  { key: "inspection_24h", title: "24h inspection confirms" },
  { key: "hot_reengaged", title: "Hot re-engaged" },
  { key: "multi_cluster", title: "Multi-property cluster" },
  { key: "logged_uncalled", title: "Logged in, uncalled" },
];

function slipWeight(key: AttentionSection): number {
  switch (key) {
    case "stuck_late":
      return 1;
    case "proposal_silence":
      return 0.5;
    case "unanswered_inbound":
      return 0.4;
    case "inspection_24h":
      return 0.5;
    case "hot_reengaged":
      return 0.6;
    case "multi_cluster":
      return 0.5;
    case "logged_uncalled":
      return 0.3;
    default:
      return 0;
  }
}

function ChannelIcon({ c }: { c: NonNullable<(typeof mockLeads)[0]["channel"]> }) {
  if (c === "sms") return <MessageSquare className="h-3.5 w-3.5" />;
  if (c === "email") return <Mail className="h-3.5 w-3.5" />;
  return <Phone className="h-3.5 w-3.5" />;
}

export function AttentionView() {
  const [toast, setToast] = useState<string | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SECTIONS.map((s) => [s.key, s.key === "stuck_late"]))
  );

  const slip = useMemo(
    () => Math.round(mockLeads.reduce((s, l) => s + slipWeight(l.section), 0) * 10) / 10,
    []
  );

  const draft = () => {
    setToast("Draft created in your inbox");
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Attention Needed</h1>
        <p className="text-sm text-muted-foreground">Where the 15-home plan is leaking.</p>
      </div>

      <Card className={slip >= 4 ? "border-destructive/40 bg-destructive/5" : ""}>
        <CardContent className="flex flex-wrap items-baseline gap-2 py-3 text-sm">
          <span className="text-muted-foreground">Estimated home cost if not worked today</span>
          <span className="text-lg font-semibold tabular-nums text-foreground">~{slip} homes</span>
          <span className="text-xs text-muted-foreground">weighted slip from open items</span>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {SECTIONS.map((sec) => {
          const items = mockLeads.filter((l) => l.section === sec.key);
          return (
            <Collapsible key={sec.key} open={open[sec.key]} onOpenChange={(v) => setOpen((o) => ({ ...o, [sec.key]: v }))}>
              <div className={`rounded-lg border ${sec.danger ? "border-red-500/35 bg-red-500/5" : "border-border bg-card/40"}`}>
                <CollapsibleTrigger asChild>
                  <button type="button" className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted/20">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{sec.title}</span>
                        <Badge variant="outline" className="tabular-nums">
                          {items.length}
                        </Badge>
                      </div>
                      {sec.subtitle && <p className="mt-1 text-xs text-red-200/90">{sec.subtitle}</p>}
                    </div>
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open[sec.key] ? "rotate-180" : ""}`} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2 border-t border-border/60 px-3 py-3">
                    {items.map((it) => {
                      const tel = it.phone.replace(/[^\d+]/g, "");
                      return (
                        <div key={it.id} className="flex flex-col gap-2 rounded-md border border-border/60 bg-background/40 p-3 md:flex-row md:items-center md:justify-between">
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-medium">{it.owner}</span>
                              <a href={`tel:${tel}`} className="text-xs text-primary hover:underline">
                                {it.phone}
                              </a>
                            </div>
                            <p className="text-xs text-muted-foreground">{it.property}</p>
                            <p className="text-xs text-foreground/90">{it.blocker}</p>
                            {it.preview && (
                              <p className="flex items-start gap-2 text-[11px] text-muted-foreground">
                                {it.channel && <ChannelIcon c={it.channel} />}
                                <span className="italic">&ldquo;{it.preview}&rdquo;</span>
                              </p>
                            )}
                          </div>
                          <Button size="sm" variant="secondary" onClick={draft}>
                            Draft outreach
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md border border-border bg-card px-4 py-2 text-sm shadow-lg">{toast}</div>
      )}
    </div>
  );
}

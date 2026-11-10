import type { ReactNode } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { MainNav } from "@/components/main-nav";
import { StaleBanner } from "@/components/stale-banner";
import { getPipeline } from "@/lib/data";
import { fmtStamp } from "@/lib/dates";

const external = [
  { href: "https://advisor-sooty-one.vercel.app", label: "Advisor pipeline (CRM of record)" },
  { href: "https://admin.bln.hm/homeowners", label: "Foundation admin" },
];

export function SiteChrome({ children }: { children: ReactNode }) {
  const p = getPipeline();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur" style={{ top: "env(safe-area-inset-top, 0px)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-1.5 px-4 py-2">
          <Link href="/" className="shrink-0 text-sm font-semibold tracking-tight">
            Path to 20 <span className="font-normal text-muted-foreground">Nov 2026</span>
          </Link>
          <MainNav />
        </div>
      </header>
      <StaleBanner snapshotAt={p.snapshot_at} placeholder={Boolean(p.placeholder)} />
      <div className="mx-auto w-full max-w-6xl px-4 pt-3">
        <p className="tnum text-xs text-muted-foreground">
          Snapshot {fmtStamp(p.snapshot_at)} · generated {fmtStamp(p.generated)}
        </p>
      </div>
      <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 pb-10 pt-4">{children}</main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-5 gap-y-1 px-4 py-3 text-xs text-muted-foreground">
          {external.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
              {l.label}
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          ))}
          <span className="sm:ml-auto">Notes are derived. The CRM is the record.</span>
        </div>
      </footer>
    </div>
  );
}

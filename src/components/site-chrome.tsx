import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MainNav } from "@/components/main-nav";
import { SnapshotPill } from "@/components/snapshot-pill";
import { StaleBanner } from "@/components/stale-banner";
import { Tip } from "@/components/ui/hint";
import { getPipeline } from "@/lib/data";

const external = [
  { href: "https://advisor-sooty-one.vercel.app", label: "Advisor pipeline", tip: "CRM of record. Notes are derived. The CRM is the record." },
  { href: "https://admin.bln.hm/homeowners", label: "Foundation admin", tip: "admin.bln.hm/homeowners" },
];

export const WRAP = "mx-auto w-full max-w-[1200px] px-4 sm:px-6 min-[100rem]:max-w-[1440px]";

export function SiteChrome({ children }: { children: ReactNode }) {
  const p = getPipeline();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-page/90 backdrop-blur-md" style={{ top: "env(safe-area-inset-top, 0px)" }}>
        <div className={`${WRAP} flex h-14 items-center gap-3 sm:gap-5`}>
          <Link href="/" className="flex shrink-0 items-baseline gap-1.5 text-[15px] font-semibold tracking-[-0.01em]">
            Path to 20
            <span className="text-sm font-normal text-muted">Nov 2026</span>
          </Link>
          <MainNav />
          <SnapshotPill snapshotAt={p.snapshot_at} generated={p.generated} />
        </div>
      </header>
      <StaleBanner snapshotAt={p.snapshot_at} placeholder={Boolean(p.placeholder)} />
      <main className={`${WRAP} min-w-0 flex-1 pb-16 pt-6 sm:pt-8`}>{children}</main>
      <footer className="border-t border-line">
        <div className={`${WRAP} flex flex-wrap items-center gap-x-6 gap-y-2 py-4 text-xs text-muted`}>
          {external.map((l) => (
            <Tip key={l.href} text={l.tip} align="start">
              <a href={l.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 hover:text-ink">
                {l.label}
                <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} aria-hidden />
              </a>
            </Tip>
          ))}
        </div>
      </footer>
    </div>
  );
}

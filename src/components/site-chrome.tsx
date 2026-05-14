import type { ReactNode } from "react";
import Link from "next/link";
import { GoalBar } from "@/components/goal-bar";
import { MainNav } from "@/components/main-nav";

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/" className="shrink-0 text-sm font-semibold tracking-tight text-foreground">
              Belong One Priority <span className="font-normal text-muted-foreground">— demo</span>
            </Link>
            <MainNav />
          </div>
          <span className="shrink-0 text-[11px] text-muted-foreground">Gabriel Castro · HA</span>
        </div>
        <GoalBar />
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
      <footer className="border-t border-border py-3 text-center text-[10px] uppercase tracking-widest text-muted-foreground/60">Demo data</footer>
    </div>
  );
}

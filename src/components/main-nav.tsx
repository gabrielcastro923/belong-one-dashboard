"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Scoreboard" },
  { href: "/plan", label: "Plan" },
  { href: "/leads", label: "Leads" },
  { href: "/progress", label: "Progress" },
  { href: "/outreach", label: "Outreach" },
  { href: "/agents", label: "Agents" },
];

const isActive = (href: string, path: string) => (href === "/" ? path === "/" : path.startsWith(href));

export function MainNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = links.find((l) => isActive(l.href, pathname));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <>
      {/* Segmented tabs from sm up */}
      <nav className="hidden min-w-0 rounded-lg bg-soft p-0.5 sm:flex" aria-label="Pages">
        {links.map((n) => {
          const active = isActive(n.href, pathname);
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "min-w-0 truncate rounded-md px-2.5 py-1 text-sm transition-colors md:px-3",
                active ? "bg-card font-medium text-ink shadow-[0_0_0_1px_rgb(var(--line))]" : "text-muted hover:text-ink"
              )}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>
      {/* Phones: current page + Menu grid */}
      <div ref={ref} className="relative order-3 sm:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="nav-grid"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 text-sm font-medium"
        >
          {current?.label ?? "Menu"}
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className={cn("text-muted transition-transform", open && "rotate-180")}>
            <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {open && (
          <nav
            id="nav-grid"
            aria-label="Pages"
            className="fixed inset-x-4 top-[3.75rem] z-50 grid grid-cols-3 gap-1 rounded-xl border border-line bg-card p-1.5 shadow-[0_16px_40px_-12px_rgb(0_0_0/.25)]"
          >
            {links.map((n) => {
              const active = isActive(n.href, pathname);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={cn("grid h-14 place-items-center rounded-lg text-sm", active ? "bg-soft font-medium text-ink" : "text-ink-2 hover:bg-soft")}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </>
  );
}

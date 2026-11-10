"use client";

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

export function MainNav() {
  const pathname = usePathname();
  return (
    <nav className="-mx-1.5 flex flex-wrap gap-x-1 gap-y-1 text-sm" aria-label="Pages">
      {links.map((n) => {
        const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-sm px-1.5 py-0.5 transition-colors",
              active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

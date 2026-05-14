"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Today's Calls" },
  { href: "/attention", label: "Attention Needed" },
  { href: "/plan", label: "Plan" },
];

export function MainNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
      {links.map((n) => {
        const active =
          n.href === "/" ? pathname === "/" : pathname === n.href || pathname.startsWith(`${n.href}/`);
        return (
          <Link
            key={n.href}
            href={n.href}
            className={cn(
              "rounded-md px-1.5 py-0.5 transition-colors",
              active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

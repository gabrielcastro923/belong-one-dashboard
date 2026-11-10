import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Archivo } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/site-chrome";

// Archivo: a workhorse grotesque with true tabular figures and a width axis, so one family sets labels at
// normal width and KPI figures semi-condensed (.num). Replaces IBM Plex Sans + Mono.
const sans = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Path to 20",
  description: "Gabriel Castro's November 2026 listing pipeline: scoreboard, daily call plan, leads.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0c0f" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="font-sans">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}

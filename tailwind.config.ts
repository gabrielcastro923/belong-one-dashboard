import type { Config } from "tailwindcss";

const t = (v: string) => `hsl(var(--${v}) / <alpha-value>)`;

const config: Config = {
  darkMode: "media",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        border: t("border"),
        background: t("background"),
        foreground: t("foreground"),
        muted: t("muted"),
        "muted-foreground": t("muted-foreground"),
        card: t("card"),
        "card-foreground": t("card-foreground"),
        primary: t("primary"),
        "primary-foreground": t("primary-foreground"),
        accent: t("accent"),
        ring: t("ring"),
        series: t("series-1"),
        track: t("series-track"),
        good: t("good"),
        "good-ink": t("good-ink"),
        warn: t("warn"),
        "warn-ink": t("warn-ink"),
        critical: t("critical"),
        "critical-ink": t("critical-ink"),
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 1px)", sm: "calc(var(--radius) - 2px)" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

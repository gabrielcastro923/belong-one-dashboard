import type { Config } from "tailwindcss";

// Every colour is an RGB triplet token in globals.css (light + dark), so Tailwind alpha works: bg-report/10.
const t = (v: string) => `rgb(var(--${v}) / <alpha-value>)`;

const config: Config = {
  darkMode: "media",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        // chrome
        page: t("page"),
        card: t("card"),
        soft: t("soft"),
        ink: t("ink"),
        "ink-2": t("ink-2"),
        muted: t("muted"),
        line: t("line"),
        "line-strong": t("line-strong"),
        focus: t("focus"),
        tip: t("tip"),
        // stage families: colour follows the entity
        agree: t("st-agree"),
        insp: t("st-insp"),
        report: t("st-report"),
        live: t("st-live"),
        // problems only
        warn: t("warn"),
        "warn-ink": t("warn-ink"),
        critical: t("critical"),
        "critical-ink": t("critical-ink"),
        "good-ink": t("good-ink"),
      },
      fontSize: {
        "2xs": ["11px", "16px"],
        xs: ["12px", "16px"],
        sm: ["13px", "20px"],
        base: ["14px", "22px"],
      },
      borderRadius: { DEFAULT: "6px", md: "6px", lg: "10px", xl: "12px" },
      keyframes: { pulse2: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".35" } } },
      animation: { pulse2: "pulse2 2.4s ease-in-out infinite" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

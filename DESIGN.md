# Path to 20 — design system

Operate mode (see PRODUCT.md). Calm chrome, colour only where it means something.

## Direction

- **Thesis:** a working tool, not a report. One question per page, answered by figures and shapes; explanations live in tooltips.
- **World:** cool neutral grey page, white panels with 1px hairlines, no drop shadows on cards. Saturated colour is spent on
  exactly three things: stage families, send lanes, problems.
- **Refuses:** shadcn defaults, purple-blue gradient heroes, glass, emoji, icon-per-label, three-equal-icon-cards, rounded-2xl everything.

## Type

**Archivo** (next/font/google, variable `wdth` axis) for everything. Body 14px, tables/labels 12–13px, page titles 22px
semibold. Big figures use `.num`: tabular figures, `wdth 86` (semi-condensed), -0.02em tracking. `font-variant-numeric:
tabular-nums` is set on `body`, so every number column aligns. Mono (system `ui-monospace`) only for agent names and code.

## Tokens (`src/app/globals.css`, RGB triplets, light / dark)

| Token | Light | Dark | Use |
|---|---|---|---|
| page | #f5f6f8 | #0b0c0f | app background |
| card | #ffffff | #14161a | panels |
| soft | #eef0f3 | #1e2126 | hover, segmented track, table heads |
| ink / ink-2 / muted | #11151c / #444b57 / #606774 | #eceef2 / #c0c5ce / #8d95a3 | text tiers |
| line / line-strong | #e2e5ea / #cdd2da | #262a31 / #3a3f48 | hairlines / inputs |
| focus | #3b63dd | #7b96ff | focus ring, "Next" marker |
| tip | #151920 | #2c323c | dark tooltip surface |
| **st-agree** | #4f5bd5 | #828df5 | b1–b2 Agreement |
| **st-insp** | #0891b2 | #2dbede | b3–b4 Inspection |
| **st-report** | #844cde | #aa80f7 | b5–b6 Report; report-call bookings |
| **st-live** | #129258 | #34c480 | b7 + listed |
| warn / critical | #e0960a / #d6422e | #f2b233 / #f0624c | problems only |
| cat-1…7 | slate, teal, blue, pink, purple, olive, sky | lighter twins | send lanes by volume; slot 1 (bulk backfill) is quiet slate |

Light/dark: `prefers-color-scheme`, overridable with `data-theme` on `<html>`.

## What carries colour

- **Stage family** (`src/lib/stage.ts`): the same hue for a bucket on the scoreboard tiles, the funnel bar, the path table,
  `/leads` rows, `/plan` goal chips and the `/progress` charts. Within a family later stages are more intense.
- **Lane** (`laneColors`): swatch, sparkline and stacked bar all use the lane's slot.
- **Problems**: red for miss / FAILING / failed sends / stale snapshot; amber for floor / late / replies waiting.
  Healthy status (OK, pass) stays a grey chip with a small green dot.

## Components

- KPI target tile: label + family dot, 44px figure "of goal · floor", **tick bar** (one tick per unit of the goal, floor tick
  dark), footer "N to go · days" + %, muted facts line; checkpoint status chip top-right.
- Stat strip: cells divided by 1px gaps, no cards.
- Share bars: 3px track along a row's bottom edge. Segmented share bar: 10px pills, 3px gaps.
- Segmented tabs (nav, sorts): `soft` track, selected = card fill + hairline ring. Phones: Menu button → 3-column grid.
- Tooltip (`ui/hint.tsx`): one system, dark, 12px, hover + focus; `?` hint buttons carry section explanations.
- Header: title, segmented nav, status pill "● Snapshot 13:39" (red when > 26 h).
- Radius: 6px controls/chips, 10px panels. Spacing on an 8px scale (4 for tight pairs).
- Charts (recharts): hairline grid, 4–5 round ticks, dark tooltip with the value large; bars = 28% fill + solid 3px cap,
  n<100 bars dashed and hollow.

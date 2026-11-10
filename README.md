# Path to 20

Gabriel Castro's November 2026 pipeline dashboard: 20 homes listed, floor 15.
Next.js 14 app router, fully static. Deploys to https://belong-one-dashboard.vercel.app on every push to `main`.

## Pages

| Route | What it shows |
|---|---|
| `/` | Scoreboard: listed, report calls held, inspections vs target; required daily rates; Friday checkpoints; path to 20 by source; funnel |
| `/plan` | Daily call schedule from `plan.json`. Checkboxes and day counters save in the browser (localStorage) |
| `/leads` | Every deal, filterable and sortable. Excluded deals hidden by default |
| `/progress` | Cumulative listed, calls held and inspections by day vs checkpoint pace; checklist history |
| `/agents` | Agent and launchd lane status from `agents.json` |

## Data

`public/data/pipeline.json`, `plan.json` and (optional) `agents.json` are written by
`Tools/scripts/build_plan.py` in the Obsidian vault. The contract is
`Pipeline/November 2026/dashboard-contract.md`. They are read at build time, so a new
snapshot needs a commit and push to show up. Do not hand-edit them.

The CRM of record is the advisor pipeline (https://advisor-sooty-one.vercel.app). This
dashboard is a derived view and never writes anywhere.

## Access

The data includes homeowner names and phone numbers, and everything in `public/` is
served as a plain URL (for example `/data/pipeline.json`). `src/middleware.ts` gates every
page and data file behind a cookie when the `DASH_KEY` environment variable is set. With
`DASH_KEY` unset the site is open to anyone with the link.

One step in Vercel: Project `belong-one-dashboard` → Settings → Environment Variables →
add `DASH_KEY` (a long random string) for Production, then redeploy. Open the site, enter
the key on `/unlock`, and the browser keeps an httpOnly cookie for 90 days.

## Develop

```
npm install
npm run dev      # http://localhost:3000
npm run build && npm run lint
```

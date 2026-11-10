import fs from "node:fs";
import path from "node:path";
import type { AgentsFile, Outreach, Pipeline, Plan } from "./types";

// Read at build time. Pages are static, so this runs during `next build` only.
const dir = path.join(process.cwd(), "public", "data");

function read<T>(file: string): T | null {
  const p = path.join(dir, file);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8")) as T;
}

export function getPipeline(): Pipeline {
  const p = read<Pipeline>("pipeline.json");
  if (!p) throw new Error("public/data/pipeline.json is missing. Run Tools/scripts/build_plan.py.");
  return p;
}

export function getPlan(): Plan {
  const p = read<Plan>("plan.json");
  if (!p) throw new Error("public/data/plan.json is missing. Run Tools/scripts/build_plan.py.");
  return p;
}

export function getAgents(): AgentsFile | null {
  const a = read<AgentsFile | AgentsFile["agents"]>("agents.json");
  if (!a) return null;
  return Array.isArray(a) ? { agents: a } : { ...a, agents: a.agents ?? [] };
}

export function getOutreach(): Outreach | null {
  return read<Outreach>("outreach.json");
}

// Optional per-lane notes kept in the vault. Read at build time when the file exists (local builds);
// Vercel builds do not have the vault, so the page renders without it.
const LANE_CONFIG = path.join(process.env.HOME ?? "", "Documents", "Obsidian Vault", "Tools", "data", "lane_config.json");

/** lane key -> binding constraint text. Accepts {lanes: {...}}, a keyed object, or an array of {key, ...}. */
export function getLaneConstraints(): Record<string, string> {
  if (!process.env.HOME || !fs.existsSync(LANE_CONFIG)) return {};
  try {
    const raw = JSON.parse(fs.readFileSync(LANE_CONFIG, "utf8")) as unknown;
    const root = raw && typeof raw === "object" && "lanes" in raw ? (raw as { lanes: unknown }).lanes : raw;
    const entries: [string, unknown][] = Array.isArray(root)
      ? root.map((r) => [String((r as { key?: string; lane?: string }).key ?? (r as { lane?: string }).lane ?? ""), r])
      : Object.entries((root ?? {}) as Record<string, unknown>);
    const out: Record<string, string> = {};
    for (const [key, v] of entries) {
      if (!key || !v || typeof v !== "object") continue;
      const o = v as Record<string, unknown>;
      const c = o.binding_constraint ?? o.constraint ?? o.binding;
      if (typeof c === "string" && c.trim()) out[key] = c.trim();
    }
    return out;
  } catch {
    return {};
  }
}

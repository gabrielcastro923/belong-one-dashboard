import fs from "node:fs";
import path from "node:path";
import type { AgentsFile, Pipeline, Plan } from "./types";

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

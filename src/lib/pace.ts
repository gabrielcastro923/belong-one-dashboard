import type { Checkpoint, Pipeline, ProgressPoint } from "./types";

export function monthTargets(p: Pipeline) {
  const cps = p.checkpoints;
  return {
    calls: p.calls_target ?? Math.max(0, ...cps.map((c) => c.calls_target)),
    callsFloor: p.calls_floor ?? Math.max(0, ...cps.map((c) => c.calls_floor)),
    insp: p.insp_target ?? Math.max(0, ...cps.map((c) => c.insp)),
  };
}

export const perDay = (remaining: number, days: number) => (days > 0 ? Math.max(0, remaining) / days : Infinity);

export const fmtRate = (r: number) => (Number.isFinite(r) ? r.toFixed(1) : "n/a");

export type Status = "pass" | "floor" | "miss" | "upcoming";

export interface CheckpointRow {
  cp: Checkpoint;
  calls: number;
  insp: number;
  listed: number;
  callsStatus: Status;
  inspStatus: Status;
  listedStatus: Status;
  row: Status;
  /** true when a past checkpoint is judged on today's MTD because no progress point exists */
  approx: boolean;
}

const rank: Record<Status, number> = { miss: 0, floor: 1, pass: 2, upcoming: 3 };

export function checkpointRows(p: Pipeline, today: string): CheckpointRow[] {
  const prog: ProgressPoint[] = [...(p.progress ?? [])].sort((a, b) => a.date.localeCompare(b.date));
  return p.checkpoints.map((cp) => {
    // A checkpoint is judged at end of its day, so today's checkpoint is still open.
    const upcoming = cp.date >= today;
    const point = [...prog].reverse().find((x) => x.date <= cp.date);
    // Past checkpoint: use the progress point on or before its date; without one, fall back to today's MTD.
    const src = !upcoming && point ? { calls: point.calls_held, insp: point.insp_done, listed: point.listed } : null;
    const calls = src?.calls ?? p.report_calls_held_mtd;
    const insp = src?.insp ?? p.inspections_completed_mtd;
    const listed = src?.listed ?? p.listed_mtd;
    const usePoint = Boolean(src);
    const judge = (v: number, target: number, floor?: number): Status =>
      upcoming ? "upcoming" : v >= target ? "pass" : floor !== undefined && v >= floor ? "floor" : "miss";
    const callsStatus = judge(calls, cp.calls_target, cp.calls_floor);
    const inspStatus = judge(insp, cp.insp);
    const listedStatus = judge(listed, cp.listed);
    const row = [callsStatus, inspStatus, listedStatus].sort((a, b) => rank[a] - rank[b])[0];
    return { cp, calls, insp, listed, callsStatus, inspStatus, listedStatus, row, approx: !upcoming && !usePoint };
  });
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { todayET } from "./dates";

// Per-browser state only. Never the source of truth for anything Gabriel reports.
export const CHECKLIST_KEY = "checklist_keys"; // JSON array of done ids `${date}:${home_id}:${goal}`
export const COUNTERS_KEY = "p20_counters"; // { [date]: { held, booked } }
const EVENT = "p20-storage";

export type Counters = Record<string, { held: number; booked: number }>;

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked: state lives for this page view only */
  }
  window.dispatchEvent(new Event(EVENT));
}

function useStored<T>(key: string, fallback: T): [T, (next: T) => void, boolean] {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setValue(readJSON(key, fallback));
    sync();
    setReady(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
    // fallback is a fresh literal each render; key identifies the store
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback(
    (next: T) => {
      setValue(next);
      writeJSON(key, next);
    },
    [key]
  );
  return [value, set, ready];
}

export function useChecklist() {
  const [list, setList, ready] = useStored<string[]>(CHECKLIST_KEY, []);
  const done = new Set(list);
  const toggle = (id: string) => {
    const s = new Set(list);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setList(Array.from(s));
  };
  return { done, toggle, ready };
}

export function useCounters() {
  const [counters, setCounters, ready] = useStored<Counters>(COUNTERS_KEY, {});
  const bump = (date: string, field: "held" | "booked", delta: number) => {
    const cur = counters[date] ?? { held: 0, booked: 0 };
    setCounters({ ...counters, [date]: { ...cur, [field]: Math.max(0, cur[field] + delta) } });
  };
  return { counters, bump, ready };
}

/** Today's ET date, resolved after mount so static HTML never bakes in the build day. */
export function useToday(): string | null {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    setT(todayET());
  }, []);
  return t;
}

import type { CallGoal } from "./types";

export const GOAL_LABEL: Record<CallGoal, string> = {
  push_live: "Push live",
  book_report_call: "Book report call",
  book_inspection: "Book inspection",
  close: "Close",
  confirm_inspection: "Confirm inspection",
  signature: "Signature",
  redial: "Redial",
  reply: "Reply",
};

export const KIND_LABEL: Record<string, string> = {
  triage: "Triage",
  dial: "Dial",
  report_call: "Report call",
  push: "Push",
  inspection_dial: "Inspection dial",
  admin: "Admin",
  buffer: "Buffer",
  existing: "On calendar",
  consult: "Consult",
};

export const bucketShort = (key: string) => (/^\d/.test(key) ? `b${key.split("_")[0]}` : key);

export const pct = (p: number) => `${Math.round(p * 100)}%`;

export const telHref = (phone: string | null | undefined) => `tel:${(phone ?? "").replace(/[^\d+]/g, "")}`;

export function fmtPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const d = phone.replace(/\D/g, "");
  const n = d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
  return n.length === 10 ? `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}` : phone;
}

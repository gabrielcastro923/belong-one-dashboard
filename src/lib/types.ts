// Mirrors Pipeline/November 2026/dashboard-contract.md

export type Verdict = "work" | "one-touch" | "exclude";

export interface Checkpoint {
  date: string;
  calls_target: number;
  calls_floor: number;
  insp: number;
  listed: number;
}

export interface Bucket {
  key: string;
  label: string;
  count: number;
  p_list: number;
}

export interface PathSource {
  key: string;
  label: string;
  owners: number;
  expected: number;
  needed: number;
  names?: string[];
}

export interface Deal {
  home_id: number;
  owner_id: number;
  name: string;
  first: string;
  phone: string;
  email: string | null;
  city: string;
  state: string;
  tz: string;
  admin: string;
  bucket: string;
  stage_label: string;
  p_list: number;
  stuck: number | null;
  owner_event_age: number | null;
  last_owner_event: string;
  attempts: number;
  connects: number;
  pending: string[];
  insp_status: string | null;
  insp_for: string;
  insp_done: string;
  vacancy: string;
  note: string;
  note_at: string;
  path_role: string | null;
  verdict: Verdict;
  verdict_reason: string;
  next_action: string;
  call_window_et: string;
}

export interface ProgressPoint {
  date: string;
  listed: number;
  calls_held: number;
  insp_done: number;
}

export interface Pipeline {
  placeholder?: boolean;
  generated: string;
  snapshot_at: string;
  month: string;
  target: number;
  floor: number;
  listed_mtd: number;
  listed_names: string[];
  report_calls_held_mtd: number;
  report_calls_booked_ahead: number;
  inspections_completed_mtd: number;
  inspections_scheduled_ahead: number;
  working_days_left: number;
  working_days_left_before_1120: number;
  checkpoints: Checkpoint[];
  buckets: Bucket[];
  path_to_20: {
    sources: PathSource[];
    expected_total: number;
    needed_total: number;
    verdict: string;
  };
  deals: Deal[];
  progress?: ProgressPoint[];
  calls_target?: number;
  calls_floor?: number;
  insp_target?: number;
  booked_ahead?: { date: string; time_et: string; owner: string }[];
}

export type BlockKind = "triage" | "dial" | "report_call" | "push" | "inspection_dial" | "admin" | "buffer";
export type CallGoal = "push_live" | "book_report_call" | "book_inspection" | "close" | "confirm_inspection" | "signature" | "redial" | "reply";

export interface PlanCall {
  home_id: number;
  name: string;
  phone: string;
  tz: string;
  local_time: string;
  goal: CallGoal;
  script_hint: string;
  admin: string;
  bucket: string;
  stage_label?: string;
  key?: string;
}

export interface PlanBlock {
  time_et: string;
  end_et: string;
  kind: BlockKind;
  title: string;
  calls: PlanCall[];
}

export interface FixedEvent {
  time_et: string;
  end_et: string;
  title: string;
  kind: string;
}

export interface PlanDay {
  date: string;
  dow: string;
  working: boolean;
  projection?: boolean;
  targets: { report_calls_held: number; inspections_booked: number; b7_pushes: number };
  fixed: FixedEvent[];
  blocks: PlanBlock[];
}

export interface Plan {
  placeholder?: boolean;
  generated: string;
  days: PlanDay[];
  checklist_keys: string[];
  booking_link?: string;
}

export interface AgentRow {
  name: string;
  kind: string;
  status: string;
  schedule: string;
  owned_metric: string;
  note: string;
  proposal_path: string | null;
}

export interface AgentsFile {
  generated?: string;
  agents: AgentRow[];
  readme?: string;
}

// Mirrors Pipeline/November 2026/outreach-contract.md

export type LaneStatus = "OK" | "FAILING" | "LATE" | "DISABLED" | "unknown";

export interface LanePeriod {
  sent: number;
  failed: number;
  bounced: number;
  unique_recipients: number;
  replies: number;
  bookings_consult: number;
  bookings_report: number;
  advanced: number;
  agreements_after: number;
  inspections_after: number;
  bookings_per_1k: number | null;
  replies_per_1k: number | null;
}

export interface LaneMonth extends LanePeriod {
  month: string;
}

export interface Lane {
  key: string;
  label: string;
  kind: string;
  status: LaneStatus | string;
  schedule: string;
  cap_per_run: number | null;
  cap_per_day: number | null;
  owner_note: string;
  months: LaneMonth[];
  last_30d: LanePeriod;
  supply: { candidates_today: number | null; sent_today: number | null; capped: boolean | null } | null;
}

export interface TouchRow {
  touch_n: number;
  sent: number;
  bookings: number;
  replies: number;
  per_1k: number | null;
}

export interface TemplateRow {
  template_version: string;
  lane: string;
  sent: number;
  replies: number;
  bookings: number;
  per_1k: number | null;
  first_sent: string;
  last_sent: string;
}

export interface SubjectRow {
  subject: string;
  sent: number;
  replies: number;
  bookings: number;
}

export interface Outreach {
  placeholder?: boolean;
  generated: string;
  db_at: string;
  snapshot_at: string;
  window_months: string[];
  /** One-line attribution rule as the builder applied it. */
  attribution?: string;
  lanes: Lane[];
  totals: { months: { month: string; sent: number; bookings_consult: number; bookings_report: number; replies: number; bookings_no_prior_email?: number }[] };
  first_touch_vs_retouch: TouchRow[];
  templates: TemplateRow[];
  subjects: SubjectRow[];
  day_of_week: { dow: string; sent: number; replies: number; bookings: number }[];
  hour_et: { hour: number; sent: number; replies: number; bookings: number }[];
  holdout: { arms: { arm: string; n: number; advanced: number; bookings?: number; emailed_after?: number }[]; note: string } | null;
  bucket_at_send: { bucket: string; sent: number; bookings: number; advanced: number }[];
  today: { sent: number; queued: number; failed: number; targeted: number; backfill: number; replies_pending_answer: number };
  recommendations: { title: string; why: string; change: string; expected: string; risk: string }[];
  caveats: string[];
}

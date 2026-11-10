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

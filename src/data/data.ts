export type Stage =
  | "Ready For Handoff"
  | "Repair Report Neg"
  | "Pending Inspection"
  | "Schedule Inspection"
  | "Agreement Neg"
  | "Open";

export type Opportunity = {
  id: string;
  owner: string;
  phone: string;
  address: string;
  market: string;
  stage: Stage;
  vacancyDays: number;
  monthlyRent: number;
  lastLoginDaysAgo: number | null;
  lastContactDaysAgo: number;
  why: string;
  opener: string;
};

export type AttentionSection =
  | "stuck_late"
  | "proposal_silence"
  | "unanswered_inbound"
  | "inspection_24h"
  | "hot_reengaged"
  | "multi_cluster"
  | "logged_uncalled";

export type AttentionItem = {
  id: string;
  section: AttentionSection;
  owner: string;
  property: string;
  phone: string;
  blocker: string;
  channel?: "sms" | "email" | "call";
  preview?: string;
  openCount?: number;
};

export const mockPlan = {
  target: 15,
  banked: 4,
  businessDaysRemaining: 13,
  monthLabel: "May 2026",
  planTitle: "15 Home Plan",
  owner: "Gabriel Castro",
};

export const mockOpportunities: Opportunity[] = [
  { id: "1", owner: "Morgan Ellis", phone: "+1-512-555-0142", address: "742 Birch Ln", market: "Austin, TX", stage: "Ready For Handoff", vacancyDays: 28, monthlyRent: 2500, lastLoginDaysAgo: 3, lastContactDaysAgo: 5, why: "Vacant 28d, $2,500/mo", opener: "Congrats on repairs wrapping — I can intro PM today." },
  { id: "2", owner: "Jordan Lee", phone: "+1-214-555-0199", address: "19 Mesa Dr", market: "Dallas, TX", stage: "Schedule Inspection", vacancyDays: 19, monthlyRent: 2200, lastLoginDaysAgo: 2, lastContactDaysAgo: 6, why: "Multi-property bundle", opener: "Two homes on Mesa — want one inspection block?" },
  { id: "3", owner: "Jordan Lee", phone: "+1-214-555-0199", address: "21 Mesa Dr", market: "Dallas, TX", stage: "Repair Report Neg", vacancyDays: 21, monthlyRent: 2100, lastLoginDaysAgo: 2, lastContactDaysAgo: 4, why: "Multi-property bundle", opener: "Pairing both Mesa quotes so you see one net number." },
  { id: "4", owner: "Priya Shah", phone: "+1-480-555-0177", address: "404 Palo Verde", market: "Phoenix, AZ", stage: "Pending Inspection", vacancyDays: 14, monthlyRent: 1950, lastLoginDaysAgo: 6, lastContactDaysAgo: 3, why: "Logged in 6d ago", opener: "Inspection window Thu/Fri — which works?" },
  { id: "5", owner: "Chris Ortiz", phone: "+1-303-555-0104", address: "88 Speer Blvd", market: "Denver, CO", stage: "Ready For Handoff", vacancyDays: 11, monthlyRent: 2800, lastLoginDaysAgo: 1, lastContactDaysAgo: 8, why: "Logged in 1d ago", opener: "Handoff packet is green — 10 min to book PM?" },
  { id: "6", owner: "Sam Rivera", phone: "+1-615-555-0133", address: "1204 Ashford", market: "Nashville, TN", stage: "Schedule Inspection", vacancyDays: 16, monthlyRent: 2400, lastLoginDaysAgo: 4, lastContactDaysAgo: 7, why: "Vacant 16d", opener: "Inspector has Tue 2p — hold it for you?" },
  { id: "7", owner: "Sam Rivera", phone: "+1-615-555-0133", address: "1206 Ashford", market: "Nashville, TN", stage: "Repair Report Neg", vacancyDays: 12, monthlyRent: 2350, lastLoginDaysAgo: 5, lastContactDaysAgo: 2, why: "Multi-property bundle", opener: "Ashford pair: want one blended repair cap?" },
  { id: "8", owner: "Alex Kim", phone: "+1-206-555-0160", address: "55 Aurora Ave", market: "Seattle, WA", stage: "Agreement Neg", vacancyDays: 9, monthlyRent: 3200, lastLoginDaysAgo: 8, lastContactDaysAgo: 1, why: "Rate step still open", opener: "If we lock rate today, we protect May close." },
  { id: "9", owner: "Taylor Brooks", phone: "+1-404-555-0120", address: "330 Peachtree Pl", market: "Atlanta, GA", stage: "Repair Report Neg", vacancyDays: 33, monthlyRent: 2050, lastLoginDaysAgo: null, lastContactDaysAgo: 9, why: "Vacant 33d, $2,050/mo", opener: "Biggest line item is roof — want vendor swap?" },
  { id: "10", owner: "Riley Chen", phone: "+1-415-555-0188", address: "2210 Market St", market: "SF Bay, CA", stage: "Pending Inspection", vacancyDays: 7, monthlyRent: 4100, lastLoginDaysAgo: 2, lastContactDaysAgo: 4, why: "Logged in 2d ago", opener: "You peeked at scope — quick call to align?" },
  { id: "11", owner: "Jamie Foster", phone: "+1-713-555-0155", address: "909 Westheimer", market: "Houston, TX", stage: "Schedule Inspection", vacancyDays: 22, monthlyRent: 1890, lastLoginDaysAgo: 10, lastContactDaysAgo: 5, why: "Vacant 22d", opener: "Rain cleared — want first slot this week?" },
  { id: "12", owner: "Casey Nguyen", phone: "+1-858-555-0111", address: "17 Coast Hwy", market: "San Diego, CA", stage: "Ready For Handoff", vacancyDays: 6, monthlyRent: 3600, lastLoginDaysAgo: 7, lastContactDaysAgo: 6, why: "Coastal premium", opener: "PM match is queued — name your preferred contact window." },
  { id: "13", owner: "Drew Walsh", phone: "+1-312-555-0144", address: "400 W Huron", market: "Chicago, IL", stage: "Open", vacancyDays: 4, monthlyRent: 2750, lastLoginDaysAgo: 3, lastContactDaysAgo: 10, why: "Fresh lead", opener: "15-min fit call — I will bring May promo math." },
  { id: "14", owner: "Quinn Harper", phone: "+1-919-555-0170", address: "55 Glenwood", market: "Raleigh, NC", stage: "Agreement Neg", vacancyDays: 18, monthlyRent: 1980, lastLoginDaysAgo: null, lastContactDaysAgo: 12, why: "Vacant 18d", opener: "If we tweak start date, payment lands in May." },
  { id: "15", owner: "Avery Cole", phone: "+1-702-555-0191", address: "221 Desert Bloom", market: "Las Vegas, NV", stage: "Repair Report Neg", vacancyDays: 26, monthlyRent: 2150, lastLoginDaysAgo: 12, lastContactDaysAgo: 3, why: "Logged in 12d ago", opener: "Proposal chunking — pick two must-fix items?" },
  { id: "16", owner: "Reese Park", phone: "+1-503-555-0109", address: "909 Belmont", market: "Portland, OR", stage: "Pending Inspection", vacancyDays: 10, monthlyRent: 2300, lastLoginDaysAgo: 5, lastContactDaysAgo: 7, why: "Vacant 10d", opener: "Belmont scope matches last comp — walk through?" },
  { id: "17", owner: "Skyler Moss", phone: "+1-801-555-0166", address: "77 Wasatch View", market: "Salt Lake City, UT", stage: "Open", vacancyDays: 3, monthlyRent: 2100, lastLoginDaysAgo: 1, lastContactDaysAgo: 2, why: "Logged in 1d ago", opener: "Quick tour of Belong app + May plan numbers." },
  { id: "18", owner: "Blake Avery", phone: "+1-602-555-0138", address: "600 Camelback", market: "Phoenix, AZ", stage: "Schedule Inspection", vacancyDays: 15, monthlyRent: 2400, lastLoginDaysAgo: null, lastContactDaysAgo: 11, why: "Vacant 15d", opener: "Camelback slot opens Thu — want me to pencil?" },
];

export const mockLeads: AttentionItem[] = [
  { id: "a1", section: "stuck_late", owner: "Morgan Ellis", property: "742 Birch Ln · Austin", phone: "+1-512-555-0142", blocker: "RFH unchanged 4 business days" },
  { id: "a2", section: "stuck_late", owner: "Casey Nguyen", property: "17 Coast Hwy · San Diego", phone: "+1-858-555-0111", blocker: "Schedule Inspection idle 5 BD" },
  { id: "a3", section: "proposal_silence", owner: "Taylor Brooks", property: "330 Peachtree Pl · Atlanta", phone: "+1-404-555-0120", blocker: "Repair proposal sent 6d, no reply" },
  { id: "a4", section: "proposal_silence", owner: "Avery Cole", property: "221 Desert Bloom · Las Vegas", phone: "+1-702-555-0191", blocker: "Repair proposal sent 5d, no reply" },
  { id: "a5", section: "unanswered_inbound", owner: "Priya Shah", property: "404 Palo Verde · Phoenix", phone: "+1-480-555-0177", blocker: "SMS unanswered 5h", channel: "sms", preview: "Can we move inspection to Friday AM?" },
  { id: "a6", section: "unanswered_inbound", owner: "Chris Ortiz", property: "88 Speer Blvd · Denver", phone: "+1-303-555-0104", blocker: "Email unanswered 6h", channel: "email", preview: "Re: PM intro — is 3pm tomorrow ok?" },
  { id: "a7", section: "inspection_24h", owner: "Jordan Lee", property: "19 Mesa Dr · Dallas", phone: "+1-214-555-0199", blocker: "Inspection tomorrow 9a — confirm call" },
  { id: "a8", section: "inspection_24h", owner: "Jamie Foster", property: "909 Westheimer · Houston", phone: "+1-713-555-0155", blocker: "Inspection in 18h — homeowner unconfirmed" },
  { id: "a9", section: "hot_reengaged", owner: "Logan Pierce", property: "1440 Lake St · Minneapolis", phone: "+1-612-555-0127", blocker: "Closed-lost 2025 — replied to re-engagement", preview: "Actually still interested if timing works." },
  { id: "a10", section: "hot_reengaged", owner: "Harper Diaz", property: "88 King St · Charleston", phone: "+1-843-555-0184", blocker: "Re-engagement reply 2h ago", preview: "Send the updated rent range?" },
  { id: "a11", section: "multi_cluster", owner: "Jordan Lee", property: "Mesa Dr (2 open)", phone: "+1-214-555-0199", blocker: "2 open opportunities", openCount: 2 },
  { id: "a12", section: "multi_cluster", owner: "Sam Rivera", property: "Ashford (2 open)", phone: "+1-615-555-0133", blocker: "2 open opportunities", openCount: 2 },
  { id: "a13", section: "logged_uncalled", owner: "Skyler Moss", property: "77 Wasatch View · SLC", phone: "+1-801-555-0166", blocker: "Logged in 1d ago, no outbound call" },
  { id: "a14", section: "logged_uncalled", owner: "Chris Ortiz", property: "88 Speer Blvd · Denver", phone: "+1-303-555-0104", blocker: "Logged in 1d ago, queue empty" },
];

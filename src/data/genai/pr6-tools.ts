// ─── PR6 · All 5 LangSmith / agents tools data ───────────────────────
// Consolidated dataset for PR6's 5 tools. Pre-authored proper English.

import type { GenAITrack } from '@/components/genaiTypes';

// ─── 1 · ChainAgentClassifier ──────────────────────────────────────
export type CaTask = { id: string; label: string; answer: 'chain' | 'agent'; hint: string };
export type CaScenario = { id: string; track: GenAITrack | 'both'; label: string; project: string; tasks: CaTask[] };

export const CA_DATASET: CaScenario[] = [
  { id: 'eng-claims', track: 'engineer', label: 'Engineer · claims workloads', project: 'claims-agent',
    tasks: [
      { id: 't1', label: 'Classify claim CLM-4412: fetch → classify → write.', answer: 'chain', hint: 'Fixed 3-step sequence — no branching.' },
      { id: 't2', label: '"What coverage does this claim have?" — may need policy / plan / amendments.', answer: 'agent', hint: 'Dynamic — agent decides which tools to call.' },
      { id: 't3', label: 'Every Monday: pull claims, classify, email summary.', answer: 'chain', hint: 'Predictable cron — same path every run.' },
      { id: 't4', label: 'Investigate why CLM-4415 was denied — policy? data? system?', answer: 'agent', hint: 'Unknown path; needs reasoning about what to check.' },
    ] },
  { id: 'build-ops', track: 'builder', label: 'Builder · ops workloads', project: 'ops-exception-agent',
    tasks: [
      { id: 't1', label: 'Every Friday: pull exceptions, summarise, email ops lead.', answer: 'chain', hint: 'Same 3 steps every run — no decisions needed.' },
      { id: 't2', label: 'Resolve exception #4412 — may need SLA, history, contact logs.', answer: 'agent', hint: 'Agent must decide what to look up next.' },
      { id: 't3', label: 'Reformat exception list from Sheet A and send to Sheet B.', answer: 'chain', hint: 'Deterministic transform — no branching.' },
      { id: 't4', label: '"Is this exception a priority?" for any given account.', answer: 'agent', hint: 'Fetch data, reason over it, then answer.' },
    ] },
  { id: 'eng-support', track: 'engineer', label: 'Engineer · support workloads', project: 'support-agent',
    tasks: [
      { id: 't1', label: 'Every new Zendesk ticket: enrich, route, ack.', answer: 'chain', hint: 'Three predictable steps per ticket.' },
      { id: 't2', label: '"Why is TKT-7714 churning?" — needs usage, history, conversations.', answer: 'agent', hint: 'Investigation across multiple sources.' },
      { id: 't3', label: 'Daily: pull P1 tickets, format, post in #support-standup.', answer: 'chain', hint: 'Same pipeline every morning.' },
      { id: 't4', label: 'Compare three customer accounts and recommend the highest-risk one.', answer: 'agent', hint: 'Branchy reasoning across multiple lookups.' },
    ] },
  { id: 'build-gtm', track: 'builder', label: 'Builder · GTM workloads', project: 'gtm-agent',
    tasks: [
      { id: 't1', label: 'New lead arrives: enrich, score, write to CRM.', answer: 'chain', hint: 'Fixed lead-router pipeline.' },
      { id: 't2', label: '"Should we push the Q3 launch to next month?" — pulls roadmap, marketing, data.', answer: 'agent', hint: 'Open-ended judgement needing multiple inputs.' },
      { id: 't3', label: 'Each morning at 8am: pull MQLs, dedupe, hand to AEs.', answer: 'chain', hint: 'Routine, deterministic.' },
      { id: 't4', label: '"Which renewals are at risk this quarter?" — agent fans out to per-account data.', answer: 'agent', hint: 'Looped fan-out per account.' },
    ] },
];
export const filterCaScenarios = (t: GenAITrack) => CA_DATASET.filter(s => s.track === 'both' || s.track === t);

// ─── 2 · ToolDescriptionGrader ─────────────────────────────────────
export type ToolVersion = { id: string; label: string; desc: string; verdict: 'good' | 'over' | 'vague'; pct: number; reason: string };
export type EvalQuery = { query: string; shouldCall: boolean };
export type ToolScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  project: string;
  toolName: string;
  paramKey: string;
  versions: ToolVersion[];
  evalSet: EvalQuery[];
};
export const TOOL_DATASET: ToolScenario[] = [
  { id: 'eng-claims', track: 'engineer', label: 'Engineer · get_claim_data',
    project: 'claims-agent', toolName: 'get_claim_data', paramKey: 'claim_id',
    versions: [
      { id: 'A', label: 'V1 · vague', desc: 'Gets claim data.', verdict: 'vague', pct: 38, reason: 'Too vague — agent calls this for everything, causing unnecessary lookups.' },
      { id: 'B', label: 'V2 · scoped', desc: 'Use get_claim_data() when the user asks about a specific claim by ID. Do NOT call for general policy questions or when claim data is already in context.', verdict: 'good', pct: 92, reason: 'Precise when + when-not-to. Agent calls only when appropriate.' },
      { id: 'C', label: 'V3 · over', desc: 'Retrieves claim information. Can be used for claim details, policy info, status updates, and general inquiries.', verdict: 'over', pct: 51, reason: 'Too broad — agent over-calls this for policy questions and general queries.' },
    ],
    evalSet: [
      { query: 'What’s the status of CLM-4412?', shouldCall: true },
      { query: 'How does the appeal process work in general?', shouldCall: false },
      { query: 'Show me the breakdown for CLM-8810', shouldCall: true },
      { query: 'Summarise the conversation so far', shouldCall: false },
    ] },
  { id: 'build-ops', track: 'builder', label: 'Builder · get_exception_data',
    project: 'ops-exception-agent', toolName: 'get_exception_data', paramKey: 'exception_id',
    versions: [
      { id: 'A', label: 'V1 · vague', desc: 'Fetches exception data.', verdict: 'vague', pct: 41, reason: 'Too vague — agent calls for any question, causing unnecessary tool calls.' },
      { id: 'B', label: 'V2 · over', desc: 'Fetches data, history, and contacts for exceptions. Also useful for general account questions, trends, and email drafts.', verdict: 'over', pct: 47, reason: 'Over-scoped — agent uses this even when account data is already in context.' },
      { id: 'C', label: 'V3 · scoped', desc: 'Use get_exception_data() when the user asks about a specific exception or account. Do NOT call for general trend reports or when exception data is already loaded.', verdict: 'good', pct: 94, reason: 'Clear scope with when/when-not. Prevents under- and over-calling.' },
    ],
    evalSet: [
      { query: 'Status on exception #4412?', shouldCall: true },
      { query: 'What’s the average exception age across all teams?', shouldCall: false },
      { query: 'Fetch details on Hartwell Group’s open exceptions', shouldCall: true },
      { query: 'Summarise the discussion so far', shouldCall: false },
    ] },
  { id: 'eng-zendesk', track: 'engineer', label: 'Engineer · get_zendesk_ticket',
    project: 'support-agent', toolName: 'get_zendesk_ticket', paramKey: 'ticket_id',
    versions: [
      { id: 'A', label: 'V1 · vague', desc: 'Reads ticket info.', verdict: 'vague', pct: 35, reason: 'Vague — agent fires this on every turn, blowing the latency budget.' },
      { id: 'B', label: 'V2 · scoped', desc: 'Use get_zendesk_ticket() when the user references a specific ticket ID. Do NOT call for general support metrics or conversational responses.', verdict: 'good', pct: 91, reason: 'Anchored on ticket ID + explicit negative case. Agent stays disciplined.' },
      { id: 'C', label: 'V3 · over', desc: 'Reads tickets, customer history, and conversation logs. Also useful for trend questions and report drafting.', verdict: 'over', pct: 48, reason: 'Conflates ticket lookup with reporting — agent over-calls on trend questions.' },
    ],
    evalSet: [
      { query: 'What is the status of TKT-7714?', shouldCall: true },
      { query: 'Average response time across the queue?', shouldCall: false },
      { query: 'Reopen TKT-9911 for the customer.', shouldCall: true },
      { query: 'Draft a Friday update for #support-standup.', shouldCall: false },
    ] },
];
export const filterToolScenarios = (t: GenAITrack) => TOOL_DATASET.filter(s => s.track === 'both' || s.track === t);

// ─── 3 · ReActStepExplorer ─────────────────────────────────────────
export type SpanType = 'REASON' | 'ACT' | 'OBS';
export type Span = { type: SpanType; name: string; text: string; latency: number; tokens?: number };
export type TraceScenario = { id: string; track: GenAITrack | 'both'; label: string; project: string; runId: string; steps: Span[] };
export const TRACE_DATASET: TraceScenario[] = [
  { id: 'eng-claim', track: 'engineer', label: 'Engineer · claim CLM-4412 trace',
    project: 'claims-agent', runId: 'run-7821',
    steps: [
      { type: 'REASON', name: 'reasoner.think', text: 'User asked about claim CLM-4412. I should fetch claim data first.', latency: 412, tokens: 184 },
      { type: 'ACT', name: 'tool.get_claim_data', text: 'get_claim_data(claim_id="CLM-4412")', latency: 68 },
      { type: 'OBS', name: 'tool.result', text: '{ category: "pharmacy", policy_code: "4.2c", status: "disputed", amount: 1840 }', latency: 6 },
      { type: 'REASON', name: 'reasoner.think', text: '§4.2c is in the amendment. Verify the clause before classifying.', latency: 388, tokens: 162 },
      { type: 'ACT', name: 'tool.query_policy_db', text: 'query_policy_db(query="clause 4.2c pharmacy override", policy_type="amendment")', latency: 94 },
      { type: 'OBS', name: 'tool.result', text: '{ clause: "4.2c", permits: "Tier 2 CA override", effective: "2022-02-01" }', latency: 5 },
      { type: 'REASON', name: 'reasoner.final', text: 'Claim qualifies under §4.2c. Confidence high. Ready to write classification.', latency: 290, tokens: 134 },
    ] },
  { id: 'build-exception', track: 'builder', label: 'Builder · Northstar West exception trace',
    project: 'ops-exception-agent', runId: 'run-4412',
    steps: [
      { type: 'REASON', name: 'reasoner.think', text: 'User wants highest-priority exception for Northstar West. Fetch the data first.', latency: 388, tokens: 176 },
      { type: 'ACT', name: 'tool.get_exception_data', text: 'get_exception_data(account_id="northstar-west")', latency: 72 },
      { type: 'OBS', name: 'tool.result', text: '[{id:4412, days_open:6, sla:5}, {id:4419, days_open:2}, {id:4433, days_open:1}]', latency: 4 },
      { type: 'REASON', name: 'reasoner.think', text: '#4412 is past SLA. Check escalation history before recommending.', latency: 412, tokens: 152 },
      { type: 'ACT', name: 'tool.get_exception_data', text: 'get_exception_data(account_id="northstar-west", exception_id=4412, include_history=true)', latency: 88 },
      { type: 'OBS', name: 'tool.result', text: '{ escalations: [], last_contact: "2026-03-08", notes: "awaiting docs from insured" }', latency: 5 },
      { type: 'REASON', name: 'reasoner.final', text: 'No prior escalations, last contact 5 days ago. Standard first escalation is appropriate.', latency: 296, tokens: 124 },
    ] },
  { id: 'eng-ticket', track: 'engineer', label: 'Engineer · ticket TKT-7714 trace',
    project: 'support-agent', runId: 'run-7714',
    steps: [
      { type: 'REASON', name: 'reasoner.think', text: 'User asked why TKT-7714 is at risk. Pull ticket + customer first.', latency: 402, tokens: 168 },
      { type: 'ACT', name: 'tool.get_zendesk_ticket', text: 'get_zendesk_ticket(ticket_id="TKT-7714")', latency: 74 },
      { type: 'OBS', name: 'tool.result', text: '{ tier: "enterprise", reopens: 3, last_reply: "12h", csat: 2 }', latency: 6 },
      { type: 'REASON', name: 'reasoner.think', text: '3 reopens + CSAT 2 is a churn signal. Get the customer history.', latency: 380, tokens: 142 },
      { type: 'ACT', name: 'tool.get_customer_history', text: 'get_customer_history(customer_id="cust-9810", window="30d")', latency: 102 },
      { type: 'OBS', name: 'tool.result', text: '{ open_tickets: 4, escalations: 1, exec_sponsor: "Maya R." }', latency: 5 },
      { type: 'REASON', name: 'reasoner.final', text: 'Multiple open + 1 escalation in 30 days. Recommend exec sponsor loop-in.', latency: 314, tokens: 126 },
    ] },
];
export const filterTraceScenarios = (t: GenAITrack) => TRACE_DATASET.filter(s => s.track === 'both' || s.track === t);

// ─── 4 · GroundingToggle ───────────────────────────────────────────
export type RetrievedDoc = { name: string; span: string; score: number };
export type GroundingScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  project: string;
  query: string;
  groundedAnswer: string;
  ungroundedAnswer: string;
  docs: RetrievedDoc[];
};
export const GROUNDING_DATASET: GroundingScenario[] = [
  { id: 'eng-tier2', track: 'engineer', label: 'Engineer · Tier 2 override coverage',
    project: 'claims-agent',
    query: 'Does Plan B Tier 2 cover physician overrides for CA-based claims?',
    groundedAnswer: 'Yes — §4.2c (amendment, Feb 2022) permits Tier 2 physician overrides for CA-based plans. Applies to Plan B (Plan Schedule pp. 14-16). Document citations: amendment-2022.pdf §4.2c; plan-schedule.pdf row 14.',
    ungroundedAnswer: 'Yes, Plan B generally covers physician overrides. Most Tier 2 plans in California include this, typically within 30 days. Check with your plan administrator for exact terms.',
    docs: [
      { name: 'amendment-2022.pdf', span: '§4.2c, l.124-148', score: 0.94 },
      { name: 'plan-schedule.pdf',  span: 'row 14, "Plan B"',  score: 0.87 },
      { name: 'CA-overrides.md',    span: '## Tier 2',          score: 0.71 },
    ] },
  { id: 'build-sla', track: 'builder', label: 'Builder · Northstar West SLA',
    project: 'ops-exception-agent',
    query: 'What is the SLA for Northstar West escalations?',
    groundedAnswer: 'SLA for Northstar West escalations is 5 business days (Northstar SLA policy v2, §2.1). Breaches trigger manager-level escalation per §2.3 of the exception guide. Sources: sla-policy-v2.pdf §2.1, §2.3.',
    ungroundedAnswer: 'SLA for escalations is typically 3–7 business days depending on the account. For priority accounts it may be shorter. Refer to your internal policy documentation.',
    docs: [
      { name: 'sla-policy-v2.pdf',   span: '§2.1, "Escalation SLA"',   score: 0.93 },
      { name: 'exception-guide.pdf', span: '§2.3, "Breach handling"',  score: 0.81 },
      { name: 'northstar-faq.pdf',   span: '## Escalations',           score: 0.68 },
    ] },
  { id: 'eng-zendesk-policy', track: 'engineer', label: 'Engineer · refund policy',
    project: 'support-agent',
    query: 'Can we refund a customer outside the 30-day window if support promised it in writing?',
    groundedAnswer: 'Yes — refund-policy-v3 §5.4b explicitly permits exceptions when a support agent commits in writing. Requires manager-level approval per §5.5. Sources: refund-policy-v3.pdf §5.4b, §5.5.',
    ungroundedAnswer: 'Generally refunds outside the 30-day window are at the discretion of support leadership. Some companies allow it as a goodwill gesture if there is documentation. Check your refund policy.',
    docs: [
      { name: 'refund-policy-v3.pdf', span: '§5.4b, "Promise exception"', score: 0.96 },
      { name: 'refund-policy-v3.pdf', span: '§5.5, "Approval ladder"',    score: 0.88 },
      { name: 'agent-handbook.pdf',   span: '## Discretion clause',       score: 0.72 },
    ] },
];
export const filterGroundingScenarios = (t: GenAITrack) => GROUNDING_DATASET.filter(s => s.track === 'both' || s.track === t);

// ─── 5 · AnomalyDetective ──────────────────────────────────────────
export type AnomalyRow = { id: string; ts: string; in: number; out: number; tools: number; cost: number; anomaly: boolean };
export type AnomalyCause = { label: string; correct: boolean };
export type AnomalyScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  project: string;
  rows: AnomalyRow[];
  causes: AnomalyCause[];
  spikeIndex: number;       // which 24-bar position carries the spike
};
export const ANOMALY_DATASET: AnomalyScenario[] = [
  { id: 'eng-claims', track: 'engineer', label: 'Engineer · claims-agent monitoring', project: 'claims-agent',
    spikeIndex: 12,
    rows: [
      { id: 'run-001', ts: '14:02', in: 1240, out: 380,  tools: 2,  cost: 0.018, anomaly: false },
      { id: 'run-002', ts: '14:08', in: 8920, out: 2100, tools: 11, cost: 0.134, anomaly: true  },
      { id: 'run-003', ts: '14:14', in: 1180, out: 340,  tools: 2,  cost: 0.017, anomaly: false },
      { id: 'run-004', ts: '14:21', in: 1310, out: 410,  tools: 3,  cost: 0.020, anomaly: false },
    ],
    causes: [
      { label: 'Agent entered a tool-calling loop — called get_claim_data 9 times before stopping', correct: true },
      { label: 'Larger claim document ingested — document size drove up input tokens',               correct: false },
      { label: 'Model switched to GPT-4 for this run, which has higher token costs',                  correct: false },
    ] },
  { id: 'build-ops', track: 'builder', label: 'Builder · ops-agent monitoring', project: 'ops-exception-agent',
    spikeIndex: 12,
    rows: [
      { id: 'run-001', ts: '09:01', in: 980,  out: 290,  tools: 1, cost: 0.013, anomaly: false },
      { id: 'run-002', ts: '09:07', in: 1100, out: 320,  tools: 1, cost: 0.015, anomaly: false },
      { id: 'run-003', ts: '09:14', in: 6840, out: 1900, tools: 7, cost: 0.103, anomaly: true  },
      { id: 'run-004', ts: '09:22', in: 990,  out: 300,  tools: 1, cost: 0.014, anomaly: false },
    ],
    causes: [
      { label: 'Exception batch included 50 items instead of the usual 5',                            correct: false },
      { label: 'Agent looped on get_exception_data — called 6 times before timing out',              correct: true },
      { label: 'System prompt was accidentally duplicated in this run',                               correct: false },
    ] },
  { id: 'eng-support', track: 'engineer', label: 'Engineer · support-agent monitoring', project: 'support-agent',
    spikeIndex: 16,
    rows: [
      { id: 'run-001', ts: '11:03', in: 1120, out: 290, tools: 2, cost: 0.016, anomaly: false },
      { id: 'run-002', ts: '11:10', in: 1180, out: 340, tools: 2, cost: 0.018, anomaly: false },
      { id: 'run-003', ts: '11:18', in: 1090, out: 280, tools: 2, cost: 0.015, anomaly: false },
      { id: 'run-004', ts: '11:24', in: 7240, out: 1680, tools: 9, cost: 0.112, anomaly: true },
    ],
    causes: [
      { label: 'Customer body included a 30k-token email thread that bypassed the truncation rule', correct: true },
      { label: 'On-call enabled verbose logging for this run',                                       correct: false },
      { label: 'Zendesk webhook fired twice and both runs landed in the same trace',                 correct: false },
    ] },
];
export const filterAnomalyScenarios = (t: GenAITrack) => ANOMALY_DATASET.filter(s => s.track === 'both' || s.track === t);

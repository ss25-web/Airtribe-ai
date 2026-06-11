// ─── PR5 · All 5 tools data ─────────────────────────────────────────
// Consolidated dataset module for PR5 — five tool scenario lists in
// one file. Pre-authored proper English. Zero LLM calls.

import type { GenAITrack } from '@/components/genaiTypes';

// ─── 1 · BatchSimulator ────────────────────────────────────────────
export type BatchScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  filename: string;
  triggerLabel: string;
  triggerIcon: string;
  triggerType: 'data' | 'trigger';
  procLabel: string;
  procIcon: string;
  outputLabel: string;
  outputIcon: string;
  defaultArraySize: number;
  defaultBatchSize: number;
  maxArraySize: number;
};
export const BATCH_DATASET: BatchScenario[] = [
  { id: 'eng-classifier-backlog', track: 'engineer', label: 'Engineer · classifier backlog',
    filename: 'splitinbatches-backlog.json', triggerLabel: 'HTTP Pull Backlog', triggerIcon: '⇄', triggerType: 'data',
    procLabel: 'OpenAI Classify', procIcon: '◈', outputLabel: 'Tracker Sheet', outputIcon: '⊞',
    defaultArraySize: 20, defaultBatchSize: 5, maxArraySize: 60 },
  { id: 'build-renewals-digest', track: 'builder', label: 'Builder · renewals digest',
    filename: 'splitinbatches-renewals.json', triggerLabel: 'Read Renewals Sheet', triggerIcon: '⊞', triggerType: 'data',
    procLabel: 'Claude Digest', procIcon: '◈', outputLabel: 'Send Digest', outputIcon: '✉',
    defaultArraySize: 50, defaultBatchSize: 10, maxArraySize: 100 },
  { id: 'eng-leads-enrich', track: 'engineer', label: 'Engineer · leads enrichment',
    filename: 'splitinbatches-leads.json', triggerLabel: 'Pull New Leads', triggerIcon: '⇄', triggerType: 'data',
    procLabel: 'Enrich + Score', procIcon: '◈', outputLabel: 'CRM Upsert', outputIcon: '☁',
    defaultArraySize: 35, defaultBatchSize: 7, maxArraySize: 80 },
  { id: 'build-tickets-tag', track: 'builder', label: 'Builder · tickets tagger',
    filename: 'splitinbatches-tickets.json', triggerLabel: 'Read Zendesk', triggerIcon: '⇄', triggerType: 'data',
    procLabel: 'Claude Tag', procIcon: '◈', outputLabel: 'Patch Tickets', outputIcon: '⇄',
    defaultArraySize: 40, defaultBatchSize: 8, maxArraySize: 100 },
];
export const filterBatchScenarios = (t: GenAITrack) => BATCH_DATASET.filter(s => s.track === 'both' || s.track === t);

// ─── 2 · FieldMapper ───────────────────────────────────────────────
export type FmField = { name: string; type: string };
export type FieldMapScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  filename: string;
  sourceNodeLabel: string;
  sourceNodeIcon: string;
  downstreamNodeLabel: string;
  sourceFields: FmField[];
  targetFields: FmField[];
  correct: Record<string, string>;
};
export const FIELD_MAP_DATASET: FieldMapScenario[] = [
  { id: 'eng-claims', track: 'engineer', label: 'Engineer · claims classifier input',
    filename: 'set-node-classifier-input.json', sourceNodeLabel: 'Claims Source', sourceNodeIcon: '⇄', downstreamNodeLabel: 'OpenAI Classify',
    sourceFields: [{ name: 'claimID', type: 'string' }, { name: 'subject', type: 'string' }, { name: 'body', type: 'text' }, { name: 'policyCode', type: 'string' }],
    targetFields: [{ name: 'claim_id', type: 'string' }, { name: 'policy_code', type: 'string' }, { name: 'classification_input', type: 'text' }],
    correct: { claimID: 'claim_id', policyCode: 'policy_code', subject: 'classification_input', body: 'classification_input' } },
  { id: 'build-renewals', track: 'builder', label: 'Builder · renewals digest input',
    filename: 'set-node-renewals-input.json', sourceNodeLabel: 'Renewals Sheet', sourceNodeIcon: '⊞', downstreamNodeLabel: 'Claude Digest',
    sourceFields: [{ name: 'row_id', type: 'string' }, { name: 'exception_date', type: 'date' }, { name: 'Renewal Manager', type: 'string' }, { name: 'Status', type: 'string' }, { name: 'Notes', type: 'text' }],
    targetFields: [{ name: 'exception_id', type: 'string' }, { name: 'date', type: 'date' }, { name: 'manager', type: 'string' }, { name: 'status', type: 'string' }, { name: 'summary_input', type: 'text' }],
    correct: { row_id: 'exception_id', exception_date: 'date', 'Renewal Manager': 'manager', Status: 'status', Notes: 'summary_input' } },
  { id: 'eng-tickets', track: 'engineer', label: 'Engineer · support tickets normaliser',
    filename: 'set-node-tickets.json', sourceNodeLabel: 'Zendesk Trigger', sourceNodeIcon: '⚡', downstreamNodeLabel: 'OpenAI Route',
    sourceFields: [{ name: 'ticketId', type: 'string' }, { name: 'subject_line', type: 'string' }, { name: 'requester_email', type: 'string' }, { name: 'message_html', type: 'text' }, { name: 'tier', type: 'string' }],
    targetFields: [{ name: 'ticket_id', type: 'string' }, { name: 'customer_email', type: 'string' }, { name: 'routing_input', type: 'text' }, { name: 'customer_tier', type: 'string' }],
    correct: { ticketId: 'ticket_id', requester_email: 'customer_email', subject_line: 'routing_input', message_html: 'routing_input', tier: 'customer_tier' } },
  { id: 'build-leads', track: 'builder', label: 'Builder · inbound leads enricher',
    filename: 'set-node-leads.json', sourceNodeLabel: 'Typeform Webhook', sourceNodeIcon: '✎', downstreamNodeLabel: 'Claude Persona',
    sourceFields: [{ name: 'first_name', type: 'string' }, { name: 'last_name', type: 'string' }, { name: 'company_name', type: 'string' }, { name: 'company_size', type: 'string' }, { name: 'use_case', type: 'text' }],
    targetFields: [{ name: 'full_name', type: 'string' }, { name: 'account', type: 'string' }, { name: 'segment', type: 'string' }, { name: 'persona_input', type: 'text' }],
    correct: { first_name: 'full_name', last_name: 'full_name', company_name: 'account', company_size: 'segment', use_case: 'persona_input' } },
];
export const filterFieldMapScenarios = (t: GenAITrack) => FIELD_MAP_DATASET.filter(s => s.track === 'both' || s.track === t);

// ─── 3 · RoutePredictor ────────────────────────────────────────────
export type RoutingBranch = 'A' | 'B' | 'C';
export type RouteItem = { id: string; label: string; field: string; value: string; correct: RoutingBranch };
export type BranchSpec = { id: RoutingBranch; label: string; node: string; icon: string; rule: string };
export type RouteScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  filename: string;
  items: RouteItem[];
  branches: BranchSpec[];
};
export const ROUTE_DATASET: RouteScenario[] = [
  { id: 'eng-confidence', track: 'engineer', label: 'Engineer · confidence router',
    filename: 'confidence-router.json',
    items: [
      { id: 'CLM-4412', label: 'CLM-4412', field: 'confidence', value: '0.71', correct: 'B' },
      { id: 'CLM-4413', label: 'CLM-4413', field: 'confidence', value: '0.91', correct: 'A' },
      { id: 'CLM-4414', label: 'CLM-4414', field: 'confidence', value: '0.55', correct: 'C' },
      { id: 'CLM-4415', label: 'CLM-4415', field: 'confidence', value: '0.63', correct: 'B' },
    ],
    branches: [
      { id: 'A', label: 'Auto-write',     node: 'Tracker Sheet',     icon: '⊞', rule: 'confidence ≥ 0.85' },
      { id: 'B', label: 'Human review',   node: 'Review Queue',      icon: '⚑', rule: '0.60 ≤ conf < 0.85' },
      { id: 'C', label: 'Manual triage',  node: 'Triage Dead-letter', icon: '⚠', rule: 'confidence < 0.60' },
    ] },
  { id: 'build-priority', track: 'builder', label: 'Builder · priority router',
    filename: 'priority-router.json',
    items: [
      { id: '4412', label: '#4412', field: 'status',  value: 'critical',   correct: 'A' },
      { id: '4419', label: '#4419', field: 'status',  value: 'pending+2d', correct: 'C' },
      { id: '4433', label: '#4433', field: 'status',  value: 'pending+5d', correct: 'B' },
      { id: '4441', label: '#4441', field: 'status',  value: 'critical',   correct: 'A' },
    ],
    branches: [
      { id: 'A', label: 'Immediate',      node: 'Escalate Slack',    icon: '⚡', rule: 'status = critical' },
      { id: 'B', label: 'Manager F/U',    node: 'Manager Email',     icon: '✉', rule: 'pending > 4d' },
      { id: 'C', label: 'Weekly summary', node: 'Weekly Digest',     icon: '☰', rule: 'pending ≤ 4d' },
    ] },
  { id: 'eng-ticket-tier', track: 'engineer', label: 'Engineer · ticket-tier router',
    filename: 'ticket-tier-router.json',
    items: [
      { id: 'TKT-7711', label: 'TKT-7711', field: 'tier',  value: 'enterprise', correct: 'A' },
      { id: 'TKT-7712', label: 'TKT-7712', field: 'tier',  value: 'pro',        correct: 'B' },
      { id: 'TKT-7713', label: 'TKT-7713', field: 'tier',  value: 'free',       correct: 'C' },
      { id: 'TKT-7714', label: 'TKT-7714', field: 'tier',  value: 'enterprise', correct: 'A' },
    ],
    branches: [
      { id: 'A', label: 'Named CSM',     node: 'CSM Slack',          icon: '#', rule: 'tier = enterprise' },
      { id: 'B', label: 'Pooled queue',  node: 'Pro Queue',          icon: '⚑', rule: 'tier = pro' },
      { id: 'C', label: 'Self-serve',    node: 'KB Article Reply',   icon: '☰', rule: 'tier = free' },
    ] },
  { id: 'build-feedback', track: 'builder', label: 'Builder · feedback router',
    filename: 'feedback-router.json',
    items: [
      { id: 'FB-101', label: 'FB-101', field: 'sentiment', value: 'angry',      correct: 'A' },
      { id: 'FB-102', label: 'FB-102', field: 'sentiment', value: 'feature',    correct: 'C' },
      { id: 'FB-103', label: 'FB-103', field: 'sentiment', value: 'confused',   correct: 'B' },
      { id: 'FB-104', label: 'FB-104', field: 'sentiment', value: 'angry',      correct: 'A' },
    ],
    branches: [
      { id: 'A', label: 'Lead pings',     node: 'Lead Slack',        icon: '#', rule: 'sentiment = angry' },
      { id: 'B', label: 'Quick reply',    node: 'CS Reply Queue',    icon: '✉', rule: 'sentiment = confused' },
      { id: 'C', label: 'Product board',  node: 'Notion Backlog',    icon: 'N', rule: 'sentiment = feature' },
    ] },
];
export const filterRouteScenarios = (t: GenAITrack) => ROUTE_DATASET.filter(s => s.track === 'both' || s.track === t);

// ─── 4 · ApprovalSimulator ─────────────────────────────────────────
export type ApprovalScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  filename: string;
  upstreamLabel: string;
  upstreamIcon: string;
  upstreamType: 'ai' | 'transform';
  itemId: string;
  itemLabel: string;
  itemDetail: string;        // confidence/days/etc.
  sla: string;
  channel: string;
  approveLabel: string;
  approveIcon: string;
  rejectLabel: string;
  rejectIcon: string;
};
export const APPROVAL_DATASET: ApprovalScenario[] = [
  { id: 'eng-claim', track: 'engineer', label: 'Engineer · claim override approval',
    filename: 'wait-approval-claim.json', upstreamLabel: 'OpenAI Classify', upstreamIcon: '◈', upstreamType: 'ai',
    itemId: 'CLM-4412', itemLabel: 'Pharmacy override · Tier 2', itemDetail: 'confidence 0.71',
    sla: 'Thursday 17:00', channel: 'claims-review',
    approveLabel: 'Write Tracker', approveIcon: '⊞', rejectLabel: 'Manual Triage', rejectIcon: '⚠' },
  { id: 'build-exception', track: 'builder', label: 'Builder · exception escalation',
    filename: 'wait-approval-exception.json', upstreamLabel: 'Validate Brief', upstreamIcon: '✓', upstreamType: 'transform',
    itemId: '#4412', itemLabel: 'Escalate to regional manager', itemDetail: '6d open (SLA: 5d)',
    sla: 'Thursday 12:00', channel: 'ops-approvals',
    approveLabel: 'Send Escalation', approveIcon: '✉', rejectLabel: 'Hold for Review', rejectIcon: '⚠' },
  { id: 'eng-refund', track: 'engineer', label: 'Engineer · refund approval gate',
    filename: 'wait-approval-refund.json', upstreamLabel: 'OpenAI Decide', upstreamIcon: '◈', upstreamType: 'ai',
    itemId: 'REF-9931', itemLabel: 'Refund $412 — duplicate charge', itemDetail: 'confidence 0.79',
    sla: 'Today 18:00', channel: 'finance-approvals',
    approveLabel: 'Issue Refund', approveIcon: '$', rejectLabel: 'Send to Lead', rejectIcon: '⚑' },
  { id: 'build-content', track: 'builder', label: 'Builder · campaign sign-off',
    filename: 'wait-approval-campaign.json', upstreamLabel: 'Validate Draft', upstreamIcon: '✓', upstreamType: 'transform',
    itemId: 'CAM-04', itemLabel: 'Q3 launch email · variant 2', itemDetail: 'legal flagged 1 line',
    sla: 'Friday 14:00', channel: 'gtm-approvals',
    approveLabel: 'Send to Audience', approveIcon: '✉', rejectLabel: 'Editor Loop', rejectIcon: '⚑' },
];
export const filterApprovalScenarios = (t: GenAITrack) => APPROVAL_DATASET.filter(s => s.track === 'both' || s.track === t);

// ─── 5 · SessionIsolation ──────────────────────────────────────────
export type SessionUser = { id: string; name: string; color: string; questions: string[]; answers: string[] };
export type SessionScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  filename: string;
  users: SessionUser[];
};
export const SESSION_DATASET: SessionScenario[] = [
  { id: 'eng-claims-faq', track: 'engineer', label: 'Engineer · claims FAQ agent',
    filename: 'agent-claims-faq.json',
    users: [
      { id: 'user-7821', name: 'Aarav', color: '#10B981',
        questions: ['What is deductible for Plan B, Tier 2?', 'What about Tier 3?', 'Is there a family cap?'],
        answers: ['Plan B Tier 2 deductible: $1,400/yr (per plan_schedule.pdf).', 'Plan B Tier 3: $2,100/yr. (Plan B inherited from prior turn.)', 'Family OOP max for Plan B: $8,700 across all tiers.'] },
      { id: 'user-4203', name: 'Guest', color: '#A855F7',
        questions: ['What is the deductible?', 'For which plan?'],
        answers: ['I need more context — which plan and tier?', 'No prior context in this session. Please specify the plan and tier.'] },
    ] },
  { id: 'build-ops-faq', track: 'builder', label: 'Builder · ops FAQ agent',
    filename: 'agent-ops-faq.json',
    users: [
      { id: 'rhea-3', name: 'Rhea', color: '#10B981',
        questions: ['List open exceptions for Northstar West.', 'Which is highest priority?', 'Draft escalation for it.'],
        answers: ['3 open: #4412 (6d), #4419 (2d), #4433 (1d). SLA: 5d.', '#4412 — 6d open, 1d past SLA. (Carried from prior turn.)', 'Drafting escalation for #4412 (Northstar West, 6d) to regional manager…'] },
      { id: 'ops-9', name: 'Guest', color: '#A855F7',
        questions: ['What is the highest-priority exception?', 'Escalate it.'],
        answers: ['No account context in this session. Specify an account or exception ID.', 'I need an exception ID before escalating. (No prior context.)'] },
    ] },
  { id: 'eng-onboarding', track: 'engineer', label: 'Engineer · onboarding co-pilot',
    filename: 'agent-onboarding-copilot.json',
    users: [
      { id: 'newhire-1', name: 'Priya', color: '#10B981',
        questions: ['What repo do I clone for the auth service?', 'Who runs the standup?', 'Where is the deploy runbook?'],
        answers: ['Clone `acme/auth-service`. Branch: `main`. Onboarding doc step 3.', 'Standup is daily at 10am, run by Ravi. (Onboarding day-2 set in earlier turn.)', 'Deploy runbook: `acme/runbooks/auth-deploy.md`. Ask Ravi if you need access.'] },
      { id: 'newhire-2', name: 'Guest', color: '#A855F7',
        questions: ['What repo do I clone?', 'Where is the runbook?'],
        answers: ['Which service are you working on? No team context in this session.', 'I need the service name first. (No prior context.)'] },
    ] },
];
export const filterSessionScenarios = (t: GenAITrack) => SESSION_DATASET.filter(s => s.track === 'both' || s.track === t);

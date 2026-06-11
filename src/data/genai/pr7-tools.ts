// ─── PR7 · All 5 MCP tools data ────────────────────────────────────
// Consolidated dataset for PR7's MCP-flavoured cards. Pre-authored.

import type { GenAITrack } from '@/components/genaiTypes';

// ─── 1 · MCPVsApiCompare ───────────────────────────────────────────
export type CompareScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  prompt: string;
  noMcpReply: string;
  toolServer: string;
  toolName: string;
  toolArgs: string;
  toolResult: string;
  mcpReply: string;     // Markdown-style with ** for bold
  protagonist: string;
  protagonistInitial: string;
};
export const COMPARE_DATASET: CompareScenario[] = [
  { id: 'eng-route-claim', track: 'engineer', label: 'Engineer · adjuster routing',
    prompt: 'Route CLM-8847 to the least-loaded adjuster in the claims team.',
    noMcpReply: "I don't have access to live adjuster workload data — I can't tell which one has the lightest caseload right now. To answer this I'd need a connection to your HR or workforce-management system.",
    toolServer: 'northstar-claims', toolName: 'get_adjuster_load', toolArgs: 'department="claims"',
    toolResult: '[\n  {"id":"ADJ-04","cases_open":3,"capacity":"high"},\n  {"id":"ADJ-07","cases_open":8,"capacity":"low"},\n  {"id":"ADJ-12","cases_open":5,"capacity":"med"}\n]',
    mcpReply: 'Route to **ADJ-04**. They have 3 open cases and the highest available capacity — the lowest current load in the claims team.',
    protagonist: 'AARAV', protagonistInitial: 'A' },
  { id: 'build-crm-lookup', track: 'builder', label: 'Builder · CRM lookup',
    prompt: 'Is Hartwell Group in our CRM, and when is their renewal due?',
    noMcpReply: "I don't have access to your CRM. Based only on what you've shared, I can't confirm whether Hartwell Group is in the system or when their renewal is.",
    toolServer: 'northstar-crm', toolName: 'lookup_crm_account', toolArgs: 'account_name="Hartwell Group"',
    toolResult: '{\n  "found": true,\n  "account_id": "ACC-2204",\n  "status": "active",\n  "renewal_date": "2026-05-12",\n  "owner": "Leila Ramos"\n}',
    mcpReply: 'Yes — **Hartwell Group** is in the CRM. Account ACC-2204, status active, renewal due **12 May 2026**, owned by Leila Ramos.',
    protagonist: 'RHEA', protagonistInitial: 'R' },
  { id: 'eng-incident', track: 'engineer', label: 'Engineer · on-call incident lookup',
    prompt: 'Who is on-call for the auth service right now, and what is their last paged time?',
    noMcpReply: "I don't have access to your PagerDuty rotation. I can describe how to look this up, but I can't tell you who's currently on-call or when they were last paged.",
    toolServer: 'northstar-pagerduty', toolName: 'get_oncall', toolArgs: 'service="auth"',
    toolResult: '{\n  "service": "auth",\n  "primary": "Riya Mehta",\n  "last_paged": "2026-03-08T02:14Z",\n  "escalation_in": "PT15M"\n}',
    mcpReply: '**Riya Mehta** is on-call for the auth service. Last paged at **02:14 UTC on 8 Mar**. Escalation policy fires after 15 minutes.',
    protagonist: 'AARAV', protagonistInitial: 'A' },
  { id: 'build-renewal', track: 'builder', label: 'Builder · renewal date lookup',
    prompt: 'When is Crescent Cycles renewing and who owns the relationship?',
    noMcpReply: "I don't have CRM access in this session. I can talk through what to look for, but I can't confirm the renewal date or the account owner.",
    toolServer: 'northstar-crm', toolName: 'lookup_crm_account', toolArgs: 'account_name="Crescent Cycles"',
    toolResult: '{\n  "found": true,\n  "account_id": "ACC-1840",\n  "status": "active",\n  "renewal_date": "2026-04-22",\n  "owner": "Maya Sharma"\n}',
    mcpReply: '**Crescent Cycles** renews on **22 April 2026** and is owned by Maya Sharma. Account is active.',
    protagonist: 'RHEA', protagonistInitial: 'R' },
];
export const filterCompareScenarios = (t: GenAITrack) => COMPARE_DATASET.filter(s => s.track === 'both' || s.track === t);

// ─── 2 · MCPToolSchemaBuilder ──────────────────────────────────────
export type SchemaScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  defaultToolName: string;
  defaultParamName: string;
  serverName: string;
  placeholder: string;
};
export const SCHEMA_DATASET: SchemaScenario[] = [
  { id: 'eng-adjuster', track: 'engineer', label: 'Engineer · get_adjuster_load',
    defaultToolName: 'get_adjuster_load', defaultParamName: 'department',
    serverName: 'northstar-claims',
    placeholder: 'Use this tool when the user asks about adjuster availability or caseload. Do not call for policy questions or claim status.' },
  { id: 'build-crm', track: 'builder', label: 'Builder · lookup_crm_account',
    defaultToolName: 'lookup_crm_account', defaultParamName: 'account_name',
    serverName: 'northstar-crm',
    placeholder: 'Use this tool when the user asks about a specific account by name or ID. Do not call for general trend questions.' },
  { id: 'eng-policy', track: 'engineer', label: 'Engineer · get_policy_clause',
    defaultToolName: 'get_policy_clause', defaultParamName: 'clause_code',
    serverName: 'northstar-claims',
    placeholder: 'Use this tool when the user references a specific policy clause code. Do not call for general policy summaries or coverage questions.' },
  { id: 'build-renewal', track: 'builder', label: 'Builder · get_renewal_status',
    defaultToolName: 'get_renewal_status', defaultParamName: 'account_id',
    serverName: 'northstar-crm',
    placeholder: 'Use this tool when the user asks about a specific renewal by account ID. Do not call for portfolio-wide renewal reports.' },
];
export const filterSchemaScenarios = (t: GenAITrack) => SCHEMA_DATASET.filter(s => s.track === 'both' || s.track === t);

// ─── 3 · MCPFlowStepper ────────────────────────────────────────────
export type FlowStepType = 'USER' | 'REASON' | 'TOOL_USE' | 'TOOL_RESULT' | 'REASON_2' | 'ANSWER';
export type FlowStep = { type: FlowStepType; label: string; text: string };
export type FlowScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  protagonist: string;
  protagonistInitial: string;
  steps: FlowStep[];
};
export const FLOW_DATASET: FlowScenario[] = [
  { id: 'eng-route', track: 'engineer', label: 'Engineer · route CLM-8847',
    protagonist: 'AARAV', protagonistInitial: 'A',
    steps: [
      { type: 'USER',        label: 'User message',     text: 'Route claim CLM-8847 to the best available adjuster in the claims team.' },
      { type: 'REASON',      label: 'Model reasoning',  text: 'I need to know current adjuster workloads before I can route. I should call get_adjuster_load() for the claims department.' },
      { type: 'TOOL_USE',    label: 'Tool call',        text: 'get_adjuster_load(department="claims")' },
      { type: 'TOOL_RESULT', label: 'Tool result',      text: '[\n  {"id":"ADJ-04","cases_open":3,"capacity":"high"},\n  {"id":"ADJ-07","cases_open":8,"capacity":"low"},\n  {"id":"ADJ-12","cases_open":5,"capacity":"med"}\n]' },
      { type: 'REASON_2',    label: 'Model reasoning',  text: "ADJ-04 has the fewest open cases (3) and the highest capacity. That's the correct route." },
      { type: 'ANSWER',      label: 'Assistant reply',  text: 'Routing CLM-8847 to ADJ-04. They have 3 open cases and high available capacity — lowest current load in the claims team.' },
    ] },
  { id: 'build-renewal', track: 'builder', label: 'Builder · Hartwell renewal lookup',
    protagonist: 'RHEA', protagonistInitial: 'R',
    steps: [
      { type: 'USER',        label: 'User message',     text: 'Is Hartwell Group in our CRM and when is their renewal?' },
      { type: 'REASON',      label: 'Model reasoning',  text: 'The user is asking about a specific account by name. I should call lookup_crm_account() for Hartwell Group.' },
      { type: 'TOOL_USE',    label: 'Tool call',        text: 'lookup_crm_account(account_name="Hartwell Group")' },
      { type: 'TOOL_RESULT', label: 'Tool result',      text: '{\n  "found": true,\n  "account_id": "ACC-2204",\n  "status": "active",\n  "renewal_date": "2026-05-12",\n  "owner": "Leila Ramos"\n}' },
      { type: 'REASON_2',    label: 'Model reasoning',  text: 'Account found, active, renewal in May. I have everything I need to answer the question directly.' },
      { type: 'ANSWER',      label: 'Assistant reply',  text: 'Yes — Hartwell Group is in the CRM. Account ACC-2204, active, renewal due 12 May 2026, owned by Leila Ramos.' },
    ] },
  { id: 'eng-oncall', track: 'engineer', label: 'Engineer · auth on-call lookup',
    protagonist: 'AARAV', protagonistInitial: 'A',
    steps: [
      { type: 'USER',        label: 'User message',     text: 'Who is on-call for the auth service right now?' },
      { type: 'REASON',      label: 'Model reasoning',  text: 'The user asked about a specific service’s on-call rotation. I should call get_oncall() for "auth".' },
      { type: 'TOOL_USE',    label: 'Tool call',        text: 'get_oncall(service="auth")' },
      { type: 'TOOL_RESULT', label: 'Tool result',      text: '{\n  "service": "auth",\n  "primary": "Riya Mehta",\n  "last_paged": "2026-03-08T02:14Z"\n}' },
      { type: 'REASON_2',    label: 'Model reasoning',  text: 'Riya Mehta is the on-call. I can also share the last-paged timestamp as supporting context.' },
      { type: 'ANSWER',      label: 'Assistant reply',  text: 'Riya Mehta is the primary on-call for auth. Last paged at 02:14 UTC on 8 Mar.' },
    ] },
];
export const filterFlowScenarios = (t: GenAITrack) => FLOW_DATASET.filter(s => s.track === 'both' || s.track === t);

// ─── 4 · MCPPermissionAudit ────────────────────────────────────────
export type ToolType = 'READ' | 'WRITE' | 'SEND' | 'DELETE';
export type ToolPermissionRow = { name: string; action: string; type: ToolType; answer: 'safe' | 'review' | 'block'; risk: string };
export type PermissionScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  tools: ToolPermissionRow[];
};
export const PERMISSION_DATASET: PermissionScenario[] = [
  { id: 'eng-claims', track: 'engineer', label: 'Engineer · northstar-claims permissions',
    tools: [
      { name: 'get_adjuster_load',    action: 'Reads adjuster caseload from HR API',     type: 'READ',   answer: 'safe',   risk: 'Read-only on non-sensitive data — safe to allow always.' },
      { name: 'update_claim_status',  action: 'Writes new status to claims database',    type: 'WRITE',  answer: 'review', risk: 'Modifies production records — must require user confirmation.' },
      { name: 'send_adjuster_email',  action: 'Sends email from adjuster account',       type: 'SEND',   answer: 'review', risk: 'External-facing action — must require explicit confirmation each time.' },
      { name: 'get_policy_clause',    action: 'Reads policy text from document store',   type: 'READ',   answer: 'safe',   risk: 'Read-only on non-sensitive documents — safe.' },
      { name: 'delete_claim_record',  action: 'Permanently deletes a claim row',         type: 'DELETE', answer: 'block',  risk: 'Irreversible — must never be callable by the agent.' },
    ] },
  { id: 'build-crm', track: 'builder', label: 'Builder · northstar-crm permissions',
    tools: [
      { name: 'lookup_crm_account',   action: 'Reads account data from Salesforce',       type: 'READ',   answer: 'safe',   risk: 'Read-only — safe to allow always.' },
      { name: 'update_renewal_date',  action: 'Updates renewal date in Salesforce',       type: 'WRITE',  answer: 'review', risk: 'Modifies CRM records — needs human approval per call.' },
      { name: 'send_renewal_email',   action: 'Sends renewal email to account holder',    type: 'SEND',   answer: 'review', risk: 'External email to a customer — must confirm before sending.' },
      { name: 'get_exception_list',   action: 'Reads open exceptions from worksheet',     type: 'READ',   answer: 'safe',   risk: 'Read-only lookup — safe.' },
      { name: 'archive_account',      action: 'Marks account as closed in Salesforce',    type: 'DELETE', answer: 'block',  risk: 'Hard to reverse — must never fire without multi-step approval.' },
    ] },
  { id: 'eng-incident', track: 'engineer', label: 'Engineer · pagerduty + repo permissions',
    tools: [
      { name: 'get_oncall',           action: 'Reads current on-call rotation',           type: 'READ',   answer: 'safe',   risk: 'Read-only — safe.' },
      { name: 'page_oncall',          action: 'Pages the on-call engineer',                type: 'SEND',   answer: 'review', risk: 'Wakes a human up — must confirm each time.' },
      { name: 'merge_pr',             action: 'Merges a pull request to main',             type: 'WRITE',  answer: 'block',  risk: 'Production-affecting writes must not be agent-initiated.' },
      { name: 'read_repo',            action: 'Reads files from the repo',                  type: 'READ',   answer: 'safe',   risk: 'Read-only access to internal source — safe.' },
      { name: 'delete_branch',        action: 'Deletes a git branch',                       type: 'DELETE', answer: 'review', risk: 'Reversible (force-push) but disruptive — confirm before each delete.' },
    ] },
];
export const filterPermissionScenarios = (t: GenAITrack) => PERMISSION_DATASET.filter(s => s.track === 'both' || s.track === t);

// ─── 5 · MCPLogReader ──────────────────────────────────────────────
export type McpLog = { time: string; tool: string; status: number; ms: number; calls: number; flag: boolean; anomaly?: string };
export type LogScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  logs: McpLog[];
};
export const LOG_DATASET: LogScenario[] = [
  { id: 'eng-claims', track: 'engineer', label: 'Engineer · northstar-claims tail',
    logs: [
      { time: '14:02:11', tool: 'get_adjuster_load',   status: 200, ms: 82,   calls: 4,   flag: false },
      { time: '14:02:19', tool: 'get_policy_clause',   status: 200, ms: 61,   calls: 340, flag: true, anomaly: 'Called 340× in 60 min — 8× above baseline. Likely an agent prompt loop.' },
      { time: '14:03:02', tool: 'update_claim_status', status: 403, ms: 12,   calls: 7,   flag: true, anomaly: '403 Forbidden — token may lack write scope or has expired.' },
      { time: '14:03:44', tool: 'get_adjuster_load',   status: 200, ms: 1840, calls: 3,   flag: true, anomaly: 'Latency spike — 1840ms vs 82ms baseline. HR API may be under load.' },
      { time: '14:04:10', tool: 'send_adjuster_email', status: 200, ms: 210,  calls: 2,   flag: false },
    ] },
  { id: 'build-crm', track: 'builder', label: 'Builder · northstar-crm tail',
    logs: [
      { time: '14:02:11', tool: 'lookup_crm_account',  status: 200, ms: 94,   calls: 5,   flag: false },
      { time: '14:02:19', tool: 'get_renewal_status',  status: 200, ms: 77,   calls: 88,  flag: true, anomaly: 'Called 88× in 30 min — probable loop in the agent prompt.' },
      { time: '14:03:02', tool: 'update_renewal_date', status: 403, ms: 11,   calls: 4,   flag: true, anomaly: '403 Forbidden — Salesforce credential may have expired or been revoked.' },
      { time: '14:03:44', tool: 'lookup_crm_account',  status: 200, ms: 2200, calls: 6,   flag: true, anomaly: 'Latency 2200ms vs 94ms baseline — Salesforce rate-throttle possible.' },
      { time: '14:04:10', tool: 'send_renewal_email',  status: 200, ms: 188,  calls: 3,   flag: false },
    ] },
  { id: 'eng-incident', track: 'engineer', label: 'Engineer · incident tail',
    logs: [
      { time: '09:11:02', tool: 'get_oncall',        status: 200, ms: 41,   calls: 9,   flag: false },
      { time: '09:11:48', tool: 'page_oncall',       status: 500, ms: 32,   calls: 3,   flag: true, anomaly: '500 from PagerDuty — service is degraded; paging may not have fired.' },
      { time: '09:12:11', tool: 'merge_pr',          status: 401, ms: 18,   calls: 1,   flag: true, anomaly: '401 Unauthorized — bot token missing repo scope. Agent should NOT be calling this.' },
      { time: '09:12:40', tool: 'read_repo',         status: 200, ms: 88,   calls: 24,  flag: false },
      { time: '09:13:02', tool: 'delete_branch',     status: 200, ms: 64,   calls: 6,   flag: true, anomaly: '6 branch deletes in 2 min — unusual cadence. Confirm this is intentional.' },
    ] },
];
export const filterLogScenarios = (t: GenAITrack) => LOG_DATASET.filter(s => s.track === 'both' || s.track === t);

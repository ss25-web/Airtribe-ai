// ─── PR4 · N8nCanvasExplorer dataset ─────────────────────────────────
// Each entry is a full workflow with nodes + connections. The card lets
// the learner pick a workflow and click any node to read its details.

import type { GenAITrack } from '@/components/genaiTypes';

export interface M4Node {
  id: string; x: number; y: number; label: string; typeLabel: string;
  icon: string; color: string;
  desc: string; input: string; output: string; risk: string;
}

export interface M4Conn {
  from: string; to: string; isError?: boolean; fromBottom?: boolean;
}

export type CanvasScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  filename: string;
  width: number;
  nodes: M4Node[];
  conns: M4Conn[];
};

export const CANVAS_DATASET: CanvasScenario[] = [
  {
    id: 'eng-exception-classifier',
    track: 'engineer',
    label: 'Engineer · exception-classifier',
    filename: 'exception-classifier.json',
    width: 926,
    nodes: [
      { id: 'trigger', x: 10, y: 30, label: 'Gmail Trigger', typeLabel: 'TRIGGER', icon: '✉', color: '#0F766E',
        desc: 'Fires when an exception email lands in the monitored inbox. Passes sender, subject, and body downstream.',
        input: 'event-driven — no input', output: '{ sender, subject, body, timestamp }',
        risk: 'If the mailbox rule changes, this trigger stops firing with no alert.' },
      { id: 'parse', x: 194, y: 30, label: 'Set Node', typeLabel: 'TRANSFORM', icon: '⚙', color: '#7C3AED',
        desc: 'Extracts policy_code from subject. Assembles the structured prompt the AI will receive. No AI here — pure data engineering.',
        input: '{ subject, body }', output: '{ policy_code, prompt_text }',
        risk: 'When subject has no policy code, policy_code = "MISSING". The AI must handle this variant.' },
      { id: 'ai', x: 378, y: 30, label: 'OpenAI Node', typeLabel: 'AI NODE', icon: '◈', color: '#F59E0B',
        desc: 'Classifies the exception into 1 of 8 defined categories. Returns category name + confidence score (0.0–1.0).',
        input: '{ prompt_text }', output: '{ category, confidence }',
        risk: 'Rate limits return 429. Hallucinated categories can pass schema validation. Confidence score ≠ correctness.' },
      { id: 'validate', x: 562, y: 30, label: 'Validate Output', typeLabel: 'TRANSFORM', icon: '✓', color: '#2563EB',
        desc: 'Checks: confidence ≥ 0.72 AND category is a valid enum value. Routes to Sheets on pass, error path on fail.',
        input: '{ category, confidence }', output: 'pass → Sheets | fail → Error path',
        risk: 'Threshold must be calibrated on labeled data — 0.72 is an example, not a universal number.' },
      { id: 'sheets', x: 746, y: 30, label: 'Google Sheets', typeLabel: 'OUTPUT', icon: '⊞', color: '#16A34A',
        desc: 'Appends a row to the exception tracker: policy_code, category, confidence, run_id, timestamp.',
        input: '{ policy_code, category, confidence }', output: 'Row appended to tracker sheet',
        risk: 'Must use a service account credential — not personal OAuth. Personal tokens break on password reset.' },
      { id: 'error', x: 562, y: 170, label: 'Slack + Dead-Letter', typeLabel: 'ERROR PATH', icon: '⚠', color: '#DC2626',
        desc: 'Fires when validation fails. Sends alert to #exceptions-alert. Writes item to dead-letter sheet for manual triage.',
        input: '{ error_reason, original_input }', output: 'Slack message + dead-letter row written',
        risk: 'Nothing disappears silently. Every failed item must be retrievable for reprocessing.' },
    ],
    conns: [
      { from: 'trigger', to: 'parse' },
      { from: 'parse', to: 'ai' },
      { from: 'ai', to: 'validate' },
      { from: 'validate', to: 'sheets' },
      { from: 'validate', to: 'error', isError: true, fromBottom: true },
    ],
  },
  {
    id: 'build-monday-brief',
    track: 'builder',
    label: 'Builder · Monday brief',
    filename: 'monday-brief.json',
    width: 1110,
    nodes: [
      { id: 'trigger', x: 10, y: 30, label: 'Schedule Trigger', typeLabel: 'TRIGGER', icon: '◷', color: '#0F766E',
        desc: 'Fires every Monday at 07:00. Passes run timestamp downstream. No external event dependency.',
        input: 'time-driven — no input', output: '{ run_timestamp }',
        risk: 'Timezone must match team timezone — a mismatch silently delivers the brief at the wrong time.' },
      { id: 'sheets', x: 194, y: 30, label: 'Google Sheets', typeLabel: 'DATA', icon: '⊞', color: '#16A34A',
        desc: "Reads all exception rows from the current week's sheet. Returns an array of row objects.",
        input: '{ spreadsheet_id, range }', output: '[{ date, type, SLA_status, notes }]',
        risk: 'Service account required — not personal OAuth. Personal tokens fail when password changes.' },
      { id: 'set', x: 378, y: 30, label: 'Set Node', typeLabel: 'TRANSFORM', icon: '⚙', color: '#7C3AED',
        desc: 'Formats the row array into a single summary_input text block. Assembles the Claude prompt. No AI here.',
        input: '[{ date, type, SLA_status, notes }]', output: '{ summary_input, row_count }',
        risk: 'If sheet is empty (holiday week), summary_input is blank. The AI must receive an explicit empty-week instruction.' },
      { id: 'ai', x: 562, y: 30, label: 'Claude Node', typeLabel: 'AI NODE', icon: '◈', color: '#F59E0B',
        desc: 'Reads summary_input and drafts the weekly brief. This is the only AI call in the entire workflow.',
        input: '{ summary_input }', output: '{ brief_text }',
        risk: 'Sparse input → sparse output. An empty sheet produces a confident "no exceptions" — which may be factually wrong.' },
      { id: 'validate', x: 746, y: 30, label: 'Validate Output', typeLabel: 'TRANSFORM', icon: '✓', color: '#2563EB',
        desc: 'Checks brief_text length ≥ 100 chars AND contains the keyword "exception". Routes to Gmail on pass, Slack on fail.',
        input: '{ brief_text }', output: 'pass → Gmail | fail → Slack alert',
        risk: 'These checks verify form, not quality. A 100-char bad brief passes. Content review is always human work.' },
      { id: 'gmail', x: 930, y: 30, label: 'Gmail Send', typeLabel: 'OUTPUT', icon: '✉', color: '#EA580C',
        desc: 'Sends the validated brief to director@northstar.com. Subject includes run date and exception count.',
        input: '{ brief_text, run_timestamp, row_count }', output: 'Email delivered to director inbox',
        risk: 'Service account must have Gmail send permission with domain-wide delegation configured.' },
      { id: 'error', x: 746, y: 170, label: 'Slack Alert → Rhea', typeLabel: 'ERROR PATH', icon: '⚠', color: '#DC2626',
        desc: 'Fires on validation failure. Alerts Rhea via Slack before anything reaches the director. Better silence than a bad brief.',
        input: '{ error_reason, brief_text }', output: 'Slack message to Rhea with failure details',
        risk: 'Alerting Rhea, not the director, on failure is a deliberate design choice — Rhea decides the next step.' },
    ],
    conns: [
      { from: 'trigger', to: 'sheets' },
      { from: 'sheets', to: 'set' },
      { from: 'set', to: 'ai' },
      { from: 'ai', to: 'validate' },
      { from: 'validate', to: 'gmail' },
      { from: 'validate', to: 'error', isError: true, fromBottom: true },
    ],
  },
  {
    id: 'eng-support-router',
    track: 'engineer',
    label: 'Engineer · support-ticket router',
    filename: 'support-router.json',
    width: 926,
    nodes: [
      { id: 'trigger', x: 10, y: 30, label: 'Zendesk Webhook', typeLabel: 'TRIGGER', icon: '⚡', color: '#0F766E',
        desc: 'Fires when a new ticket is created in Zendesk. Passes the ticket payload downstream.',
        input: 'event-driven — no input', output: '{ ticket_id, subject, body, customer_email }',
        risk: 'Webhook secret must be verified inside n8n — otherwise any caller can fake tickets.' },
      { id: 'crm', x: 194, y: 30, label: 'CRM Lookup', typeLabel: 'DATA', icon: '⇄', color: '#16A34A',
        desc: 'HTTP request to the CRM to fetch tier + lifetime value for the customer email.',
        input: '{ customer_email }', output: '{ tier, ltv, account_owner }',
        risk: 'CRM rate limits return 429. Without a fallback, every burst day fails silently.' },
      { id: 'build', x: 378, y: 30, label: 'Build prompt', typeLabel: 'TRANSFORM', icon: '⚙', color: '#7C3AED',
        desc: 'Set node combining ticket text + customer tier into the OpenAI prompt.',
        input: '{ ticket text, tier, ltv }', output: '{ prompt_text }',
        risk: 'A nullable tier must be defaulted explicitly — otherwise the prompt has the word "null" in it.' },
      { id: 'route', x: 562, y: 30, label: 'OpenAI Route', typeLabel: 'AI NODE', icon: '◯', color: '#F59E0B',
        desc: 'Picks one queue from { billing, sales, tech, churn }. Returns category + confidence.',
        input: '{ prompt_text }', output: '{ queue, confidence }',
        risk: 'Hallucinated queues that fall outside the enum must be caught before they hit Zendesk.' },
      { id: 'assign', x: 746, y: 30, label: 'Zendesk Assign', typeLabel: 'OUTPUT', icon: '⇄', color: '#EA580C',
        desc: 'PATCH the ticket back into Zendesk with the chosen queue.',
        input: '{ ticket_id, queue }', output: 'Ticket assigned to the queue',
        risk: 'A failed assignment must NOT silently leave the ticket unowned — route to dead-letter.' },
      { id: 'error', x: 562, y: 170, label: 'Dead-letter triage', typeLabel: 'ERROR PATH', icon: '⚠', color: '#DC2626',
        desc: 'Catches non-enum queues + assignment failures. Drops to a human triage queue.',
        input: '{ ticket_id, reason }', output: 'Row in dead-letter sheet + #ticket-triage ping',
        risk: 'Triage queue must be actually watched by a human — otherwise this just buries the problem differently.' },
    ],
    conns: [
      { from: 'trigger', to: 'crm' },
      { from: 'crm', to: 'build' },
      { from: 'build', to: 'route' },
      { from: 'route', to: 'assign' },
      { from: 'route', to: 'error', isError: true, fromBottom: true },
    ],
  },
];

export function filterCanvasScenarios(track: GenAITrack): CanvasScenario[] {
  return CANVAS_DATASET.filter(c => c.track === 'both' || c.track === track);
}

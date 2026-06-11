// ─── PR4 · WorkflowAnatomy dataset ───────────────────────────────────
// Each entry is one n8n workflow rendered as 5 nodes the learner must
// tag (trigger / data / transform / ai / output). Pre-authored hints.

import type { GenAITrack } from '@/components/genaiTypes';

export type NodeTypeKey = 'trigger' | 'data' | 'transform' | 'ai' | 'output' | 'error';

export type WStep = {
  id: string;
  x: number;
  label: string;
  icon: string;
  correctType: NodeTypeKey;
  hint: string;
};

export type WorkflowScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  filename: string;
  steps: WStep[];
};

export const WORKFLOW_DATASET: WorkflowScenario[] = [
  {
    id: 'eng-exception-classifier',
    track: 'engineer',
    label: 'Engineer · exception-classifier',
    filename: 'workflow-anatomy.json',
    steps: [
      { id: 'a', x: 10,  label: 'Gmail Trigger',     icon: '✉', correctType: 'trigger',   hint: 'Email arriving in the monitored inbox is what starts the workflow.' },
      { id: 'b', x: 195, label: 'Extract policy_code', icon: '⚙', correctType: 'transform', hint: 'Pure data shaping — conditional logic on a field. No AI yet.' },
      { id: 'c', x: 380, label: 'Format prompt',     icon: '⚙', correctType: 'transform', hint: 'A Set node assembles the prompt text. Still engineering, not AI.' },
      { id: 'd', x: 565, label: 'OpenAI Classify',   icon: '◈', correctType: 'ai',        hint: 'The one AI call — language work converting prompt to category + confidence.' },
      { id: 'e', x: 750, label: 'Append to Sheet',   icon: '⊞', correctType: 'output',    hint: 'A Sheets write node — engineering, not AI.' },
    ],
  },
  {
    id: 'build-monday-brief',
    track: 'builder',
    label: 'Builder · Monday brief',
    filename: 'monday-brief-anatomy.json',
    steps: [
      { id: 'a', x: 10,  label: 'Schedule Trigger',  icon: '◷', correctType: 'trigger',   hint: 'Cron trigger fires at 7am every Monday — starts the workflow on time.' },
      { id: 'b', x: 195, label: 'Read Sheet',        icon: '⊞', correctType: 'data',      hint: 'A Sheets read node pulling exception rows. External-system data fetch.' },
      { id: 'c', x: 380, label: 'Format prompt',     icon: '⚙', correctType: 'transform', hint: 'A Set node assembling the rows into the Claude prompt — engineering.' },
      { id: 'd', x: 565, label: 'Claude Brief',      icon: '◈', correctType: 'ai',        hint: 'The single AI call — drafts the weekly brief from the assembled prompt.' },
      { id: 'e', x: 750, label: 'Gmail Send',        icon: '✉', correctType: 'output',    hint: 'A Gmail send node — delivers the brief. Engineering, not AI.' },
    ],
  },
  {
    id: 'eng-support-router',
    track: 'engineer',
    label: 'Engineer · support-ticket router',
    filename: 'support-ticket-router.json',
    steps: [
      { id: 'a', x: 10,  label: 'Zendesk Webhook',   icon: '⚡', correctType: 'trigger',   hint: 'A webhook fires the moment a new ticket lands in Zendesk.' },
      { id: 'b', x: 195, label: 'Fetch customer',     icon: '⇄', correctType: 'data',      hint: 'HTTP request to the CRM to pull the customer tier — external-system fetch.' },
      { id: 'c', x: 380, label: 'Build prompt',       icon: '⚙', correctType: 'transform', hint: 'Set node assembles ticket + customer fields into the OpenAI prompt.' },
      { id: 'd', x: 565, label: 'OpenAI Route',       icon: '◯', correctType: 'ai',        hint: 'The only AI call — pick a queue from { billing, sales, tech, churn }.' },
      { id: 'e', x: 750, label: 'Zendesk Assign',     icon: '⇄', correctType: 'output',    hint: 'PATCH the ticket back into Zendesk with the chosen queue.' },
    ],
  },
  {
    id: 'build-lead-enrich',
    track: 'builder',
    label: 'Builder · inbound lead enricher',
    filename: 'lead-enricher.json',
    steps: [
      { id: 'a', x: 10,  label: 'Webhook · Typeform', icon: '✎', correctType: 'trigger',   hint: 'Typeform form submission webhook — starts the workflow.' },
      { id: 'b', x: 195, label: 'Clearbit Lookup',    icon: '⇄', correctType: 'data',      hint: 'External HTTP request to Clearbit — that’s a data fetch, not AI.' },
      { id: 'c', x: 380, label: 'Score Mapper',       icon: '⚙', correctType: 'transform', hint: 'Pure JS-style mapping of fields → score buckets. No AI.' },
      { id: 'd', x: 565, label: 'Claude · Persona',   icon: '◈', correctType: 'ai',        hint: 'The single AI call — drafts a short persona summary for the AE.' },
      { id: 'e', x: 750, label: 'Salesforce Create',  icon: '☁', correctType: 'output',    hint: 'Salesforce write — engineering, not AI.' },
    ],
  },
  {
    id: 'eng-vendor-onboard',
    track: 'engineer',
    label: 'Engineer · vendor onboarding sync',
    filename: 'vendor-onboarding.json',
    steps: [
      { id: 'a', x: 10,  label: 'Airtable Trigger',   icon: '▦', correctType: 'trigger',   hint: 'A new row in the "vendor intake" table fires the workflow.' },
      { id: 'b', x: 195, label: 'Read W-9 file',      icon: '📄', correctType: 'data',     hint: 'A storage read — pulling the W-9 PDF from S3. External-system fetch.' },
      { id: 'c', x: 380, label: 'Extract fields',     icon: '⚙', correctType: 'transform', hint: 'Set node mapping the parsed text into structured fields. No AI here.' },
      { id: 'd', x: 565, label: 'OpenAI · Risk score', icon: '◯', correctType: 'ai',       hint: 'AI scores vendor risk based on the extracted fields + free-text notes.' },
      { id: 'e', x: 750, label: 'NetSuite Create',    icon: '⊞', correctType: 'output',    hint: 'NetSuite write — engineering, not AI.' },
    ],
  },
];

export function filterWorkflows(track: GenAITrack): WorkflowScenario[] {
  return WORKFLOW_DATASET.filter(w => w.track === 'both' || w.track === track);
}

// ─── PR4 · NodeTypeMapCard dataset ───────────────────────────────────
// Each entry is a node-set the learner classifies into the four lanes.
// Pre-authored; no LLM at runtime.

import type { GenAITrack } from '@/components/genaiTypes';
import type { NodeTypeKey } from './pr4-workflow-anatomy';

export type NodeItem = { id: string; label: string; icon: string; correctCat: NodeTypeKey };

export type NodeSetScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  items: NodeItem[];
};

export const NODE_SET_DATASET: NodeSetScenario[] = [
  {
    id: 'eng-default',
    track: 'engineer',
    label: 'Engineer · core toolkit',
    items: [
      { id: 'gmailtr',  label: 'Gmail Trigger',     icon: '✉', correctCat: 'trigger' },
      { id: 'http',     label: 'HTTP Request',      icon: '⇄', correctCat: 'data' },
      { id: 'setn',     label: 'Set Node',          icon: '⚙', correctCat: 'transform' },
      { id: 'openai',   label: 'OpenAI Node',       icon: '◯', correctCat: 'ai' },
      { id: 'sheets',   label: 'Google Sheets',     icon: '⊞', correctCat: 'data' },
      { id: 'code',     label: 'Code Node',         icon: '{}', correctCat: 'transform' },
      { id: 'webhook',  label: 'Webhook Trigger',   icon: '⚡', correctCat: 'trigger' },
      { id: 'claude',   label: 'Anthropic Node',    icon: 'A',  correctCat: 'ai' },
    ],
  },
  {
    id: 'build-default',
    track: 'builder',
    label: 'Builder · core toolkit',
    items: [
      { id: 'sched',    label: 'Schedule Trigger',  icon: '◷', correctCat: 'trigger' },
      { id: 'sheets',   label: 'Google Sheets',     icon: '⊞', correctCat: 'data' },
      { id: 'setn',     label: 'Set Node',          icon: '⚙', correctCat: 'transform' },
      { id: 'claude',   label: 'Anthropic Node',    icon: 'A',  correctCat: 'ai' },
      { id: 'form',     label: 'Google Forms',      icon: '✎', correctCat: 'trigger' },
      { id: 'ifn',      label: 'IF Node',           icon: '◆', correctCat: 'transform' },
      { id: 'airtable', label: 'Airtable',          icon: '▦', correctCat: 'data' },
      { id: 'openai',   label: 'OpenAI Node',       icon: '◯', correctCat: 'ai' },
    ],
  },
  {
    id: 'eng-saas-stack',
    track: 'engineer',
    label: 'Engineer · SaaS automation stack',
    items: [
      { id: 'github',   label: 'GitHub Webhook',    icon: '⚡', correctCat: 'trigger' },
      { id: 'pg',       label: 'Postgres Query',    icon: '⊞', correctCat: 'data' },
      { id: 'merge',    label: 'Merge Node',        icon: '⚙', correctCat: 'transform' },
      { id: 'gpt4o',    label: 'GPT-4o Node',       icon: '◯', correctCat: 'ai' },
      { id: 'stripe',   label: 'Stripe API',        icon: '$', correctCat: 'data' },
      { id: 'jq',       label: 'JSON Transform',    icon: '{}', correctCat: 'transform' },
      { id: 'cron',     label: 'Cron Trigger',      icon: '◷', correctCat: 'trigger' },
      { id: 'llama',    label: 'Llama 3 Node',      icon: 'L',  correctCat: 'ai' },
    ],
  },
  {
    id: 'build-ops-toolkit',
    track: 'builder',
    label: 'Builder · ops automation stack',
    items: [
      { id: 'slack',    label: 'Slack Trigger',     icon: '#', correctCat: 'trigger' },
      { id: 'notion',   label: 'Notion DB Read',    icon: 'N', correctCat: 'data' },
      { id: 'split',    label: 'Split In Batches',  icon: '⚙', correctCat: 'transform' },
      { id: 'claude35', label: 'Claude 3.5 Node',   icon: 'A', correctCat: 'ai' },
      { id: 'gdrive',   label: 'Drive Read',        icon: '☁', correctCat: 'data' },
      { id: 'set',      label: 'Set Node',          icon: '⚙', correctCat: 'transform' },
      { id: 'tally',    label: 'Tally Form',        icon: '✎', correctCat: 'trigger' },
      { id: 'gemini',   label: 'Gemini Node',       icon: 'G', correctCat: 'ai' },
    ],
  },
];

export function filterNodeSets(track: GenAITrack): NodeSetScenario[] {
  return NODE_SET_DATASET.filter(n => n.track === 'both' || n.track === track);
}

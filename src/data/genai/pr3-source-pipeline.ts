// ─── PR3 · SourcePipelineCard dataset ────────────────────────────────
// Each entry is one "project knowledge" scenario for Claude Projects:
// a list of source documents that may or may not belong in scope. The
// card lets the learner check the boxes, run an indexing animation, and
// see whether the required sources are present. Pre-authored, no LLM.

import type { GenAITrack } from '@/components/genaiTypes';

export type Source = {
  id: string;
  label: string;
  required: boolean;
  kind: 'pdf' | 'md' | 'sheet' | 'doc';
  size: string;
  note: string;
};

export type SourceScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;       // dropdown label
  projectName: string;
  defaultSelected: string;  // id of the source pre-checked when the scenario loads
  sources: Source[];
};

export const SOURCE_DATASET: SourceScenario[] = [
  {
    id: 'eng-claims-policy',
    track: 'engineer',
    label: 'Claims policy assistant',
    projectName: 'Claims policy assistant',
    defaultSelected: 'primary',
    sources: [
      { id: 'primary',    label: 'plan-schedule-v3.pdf',         kind: 'pdf',   size: '212 KB', required: true,  note: 'Core terms — but does not include the 2022 amendment.' },
      { id: 'amendment',  label: 'amendment-2022-02.pdf',        kind: 'pdf',   size: '64 KB',  required: true,  note: 'Contains clause 4.2c — the override rule. Not in v3.' },
      { id: 'precedents', label: 'case-precedents.md',           kind: 'md',    size: '38 KB',  required: true,  note: 'Three prior approvals of the same type — supports the decision.' },
      { id: 'guidelines', label: 'internal-claims-guidelines.md', kind: 'md',    size: '17 KB', required: false, note: 'Useful context but not decision-critical for this query type.' },
      { id: 'faq',        label: 'benefits-faq-public.md',       kind: 'md',    size: '11 KB',  required: false, note: 'Member-facing language — not authoritative for triage.' },
    ],
  },
  {
    id: 'build-exception-review',
    track: 'builder',
    label: 'Exception review assistant',
    projectName: 'Exception review assistant',
    defaultSelected: 'ticket',
    sources: [
      { id: 'ticket',  label: 'current-exception.pdf',      kind: 'pdf',   size: '8 KB',  required: true,  note: 'The trigger — but context-free without prior history.' },
      { id: 'thread',  label: 'prior-week-thread.md',       kind: 'md',    size: '23 KB', required: true,  note: 'Contains the context the AI missed in Tuesday’s review.' },
      { id: 'policy',  label: 'sla-policy-v2.pdf',          kind: 'pdf',   size: '46 KB', required: true,  note: 'The rule governing this exception type — must be in scope.' },
      { id: 'flags',   label: 'open-escalation-flags.sheet', kind: 'sheet', size: '4 KB',  required: true,  note: 'Other open items on this account that change the recommendation.' },
      { id: 'history', label: 'account-history-12m.sheet',  kind: 'sheet', size: '88 KB', required: false, note: 'Useful for trend analysis but not needed for the weekly summary.' },
    ],
  },
  {
    id: 'build-marketing-launch',
    track: 'builder',
    label: 'Q3 product launch assistant',
    projectName: 'Q3 launch playbook',
    defaultSelected: 'positioning',
    sources: [
      { id: 'positioning', label: 'positioning-memo-v4.pdf', kind: 'pdf',   size: '34 KB', required: true,  note: 'Locked positioning — anything off-message must trace back here.' },
      { id: 'voc',         label: 'customer-interviews.md',  kind: 'md',    size: '72 KB', required: true,  note: 'The actual words customers used. Without this Claude invents quotes.' },
      { id: 'pricing',     label: 'pricing-tiers-final.sheet', kind: 'sheet', size: '6 KB', required: true,  note: 'Source of truth for prices and limits — small file, easy to forget.' },
      { id: 'old-launch',  label: 'q2-launch-recap.pdf',     kind: 'pdf',   size: '28 KB', required: false, note: 'Historical context — useful only when comparing campaigns.' },
      { id: 'brand-kit',   label: 'brand-guidelines.pdf',    kind: 'pdf',   size: '120 KB', required: false, note: 'Visual rules — irrelevant to the written brief.' },
    ],
  },
  {
    id: 'eng-incident-postmortem',
    track: 'engineer',
    label: 'Incident postmortem assistant',
    projectName: 'INC-2024-118 postmortem',
    defaultSelected: 'timeline',
    sources: [
      { id: 'timeline',   label: 'incident-timeline.md',        kind: 'md',    size: '12 KB', required: true,  note: 'The minute-by-minute record — without it the cause is just a guess.' },
      { id: 'pager',      label: 'pagerduty-log.sheet',         kind: 'sheet', size: '4 KB',  required: true,  note: 'Who was paged when. Needed to attribute response delay.' },
      { id: 'metrics',    label: 'grafana-dashboards.pdf',      kind: 'pdf',   size: '420 KB', required: true, note: 'The saturation graph that confirms the pool exhaustion.' },
      { id: 'runbook',    label: 'auth-db-runbook.md',          kind: 'md',    size: '9 KB',  required: false, note: 'Steady-state runbook — only marginal for incident write-up.' },
      { id: 'compliance', label: 'soc2-uptime-clauses.pdf',     kind: 'pdf',   size: '88 KB', required: false, note: 'Audit references — relevant only if customer comms are in scope.' },
    ],
  },
  {
    id: 'build-renewal-prep',
    track: 'builder',
    label: 'Account renewal prep',
    projectName: 'Renewal prep · Meridian Corp',
    defaultSelected: 'account',
    sources: [
      { id: 'account',  label: 'account-overview.pdf',     kind: 'pdf',   size: '18 KB', required: true,  note: 'Snapshot of the account — but no usage trend on its own.' },
      { id: 'usage',    label: 'usage-trend-12m.sheet',    kind: 'sheet', size: '42 KB', required: true,  note: 'The seat + WAU curve — without this Claude guesses adoption.' },
      { id: 'tickets',  label: 'support-tickets-q3.md',    kind: 'md',    size: '28 KB', required: true,  note: 'Their open and closed tickets — the trust signals.' },
      { id: 'contract', label: 'contract-terms.pdf',       kind: 'pdf',   size: '14 KB', required: true,  note: 'Renewal date and discount structure — anchor for the proposal.' },
      { id: 'casestudy', label: 'industry-case-studies.pdf', kind: 'pdf', size: '64 KB', required: false, note: 'Outside reference — useful for the deck, not the brief.' },
    ],
  },
  {
    id: 'eng-pr-review',
    track: 'engineer',
    label: 'Pull-request review assistant',
    projectName: 'PR review · platform/auth',
    defaultSelected: 'diff',
    sources: [
      { id: 'diff',      label: 'pr-1402.diff',             kind: 'md',    size: '6 KB',  required: true,  note: 'The actual change — irrelevant if Claude reads anything else first.' },
      { id: 'tests',     label: 'failing-test-trace.md',    kind: 'md',    size: '3 KB',  required: true,  note: 'Why CI is red. Without this, suggestions are blind.' },
      { id: 'spec',      label: 'auth-spec-v2.pdf',         kind: 'pdf',   size: '88 KB', required: true,  note: 'Source of truth for the contract being changed.' },
      { id: 'history',   label: 'recent-merges.sheet',      kind: 'sheet', size: '11 KB', required: false, note: 'Historical churn — only useful for a stale-PR comment.' },
      { id: 'styleguide', label: 'style-guide.md',          kind: 'md',    size: '14 KB', required: false, note: 'Nice-to-have. Lint catches most of this already.' },
    ],
  },
  {
    id: 'both-board-update',
    track: 'both',
    label: 'Weekly board update',
    projectName: 'Board update · week 14',
    defaultSelected: 'kpis',
    sources: [
      { id: 'kpis',     label: 'kpi-snapshot.sheet',       kind: 'sheet', size: '8 KB',  required: true,  note: 'This week’s KPI deltas — the headline numbers.' },
      { id: 'incidents', label: 'incidents-summary.md',    kind: 'md',    size: '6 KB',  required: true,  note: 'Anything the board needs to hear before they read about it elsewhere.' },
      { id: 'roadmap',  label: 'roadmap-status.pdf',       kind: 'pdf',   size: '22 KB', required: true,  note: 'What shipped vs what slipped — the credibility line.' },
      { id: 'forecast', label: 'cash-forecast.sheet',      kind: 'sheet', size: '5 KB',  required: false, note: 'Useful for the finance section — optional for an ops update.' },
      { id: 'press',    label: 'press-mentions.md',        kind: 'md',    size: '4 KB',  required: false, note: 'Not decision-grade. Optional context.' },
    ],
  },
];

export function filterSourceScenarios(track: GenAITrack): SourceScenario[] {
  return SOURCE_DATASET.filter(s => s.track === 'both' || s.track === track);
}

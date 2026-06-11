// ─── PR4 · ErrorPathCard dataset ─────────────────────────────────────
// Each entry is a sequence of failure scenarios; the learner picks one
// of four downstream responses per failure. Hand-authored verdicts.

import type { GenAITrack } from '@/components/genaiTypes';

export type ChoiceVerdict = 'silent-fail' | 'correct-route';

export type ErrorChoice = {
  id: string;
  label: string;
  icon: string;
  verdict: ChoiceVerdict;
  result: string;
};

export type Failure = {
  id: string;
  nodeLabel: string;
  nodeIcon: string;
  failTitle: string;
  failDetail: string;
  choices: ErrorChoice[];
};

export type ErrorPathScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  filename: string;
  upstream: { label: string; icon: string; type: 'transform' | 'data' };
  happyPath: { label: string; icon: string };
  failures: Failure[];
};

export const ERROR_PATH_DATASET: ErrorPathScenario[] = [
  {
    id: 'eng-default',
    track: 'engineer',
    label: 'Engineer · classifier failures',
    filename: 'failure-routing.json',
    upstream: { label: 'Format prompt', icon: '⚙', type: 'transform' },
    happyPath: { label: 'Append to Sheet', icon: '⊞' },
    failures: [
      {
        id: 'ai', nodeLabel: 'OpenAI Classify', nodeIcon: '◈',
        failTitle: '429 Too Many Requests',
        failDetail: 'Rate limit on the classifier API. The item that triggered the workflow is now in limbo.',
        choices: [
          { id: 'retry-silent', label: 'Retry → continue silently',     icon: '↻',  verdict: 'silent-fail',  result: 'Second call also rate-limited. Item written with classification = null. Silent data corruption in the tracker.' },
          { id: 'skip',         label: 'Skip item, next iteration',      icon: '↷',  verdict: 'silent-fail',  result: 'Item silently dropped. Tracker has no record of it. Analyst never learns the exception was not classified.' },
          { id: 'dead-letter',  label: 'Alert Slack + dead-letter queue', icon: '⚠', verdict: 'correct-route', result: 'Workflow halts on this item. Slack pings. Dead-letter row captures input + error. Nothing lost, nothing silent.' },
          { id: 'log-only',     label: 'Log warning, keep going',         icon: '☰', verdict: 'silent-fail',  result: 'Log entry created but workflow proceeds with empty classification. Dashboard shows 0 errors. Tracker shows garbage.' },
        ],
      },
      {
        id: 'validate', nodeLabel: 'Validate Output', nodeIcon: '✓',
        failTitle: 'Output too short (8 chars)',
        failDetail: 'AI returned a category 8 characters long. Schema check failed.',
        choices: [
          { id: 'forward',      label: 'Forward anyway — node returned', icon: '→', verdict: 'silent-fail',  result: 'An 8-character classification reaches the tracker. Analyst opens the record and sees garbage. Pipeline appeared to succeed.' },
          { id: 'retry-same',   label: 'Retry AI with same input',        icon: '↻', verdict: 'silent-fail',  result: 'Same malformed prompt produces the same truncated output. Root cause unchanged; you just doubled the cost.' },
          { id: 'route',        label: 'Route → Slack + dead-letter',     icon: '⚠', verdict: 'correct-route', result: 'Slack: "Validate Output failed — output too short." Item queued for human triage. Nothing forwarded.' },
          { id: 'skip-next',    label: 'Skip item, process next',         icon: '↷', verdict: 'silent-fail',  result: 'Item silently disappears. No alert, no record, no way to know it was dropped.' },
        ],
      },
    ],
  },
  {
    id: 'build-default',
    track: 'builder',
    label: 'Builder · Monday-brief failures',
    filename: 'monday-brief-failure.json',
    upstream: { label: 'Read Sheet', icon: '⊞', type: 'data' },
    happyPath: { label: 'Gmail Send', icon: '✉' },
    failures: [
      {
        id: 'sheets', nodeLabel: 'Google Sheets Read', nodeIcon: '⊞',
        failTitle: 'OAuth token expired',
        failDetail: 'Rhea reset her password yesterday. The token tied to her personal account is invalid.',
        choices: [
          { id: 'retry',      label: 'Retry once automatically',         icon: '↻', verdict: 'silent-fail',  result: 'Token is still invalid. Second attempt fails. Workflow halts with no alert. Director receives nothing at 7am.' },
          { id: 'skip-empty', label: 'Skip data step, run AI on empty',  icon: '↷', verdict: 'silent-fail',  result: 'Claude receives empty input, produces a confused summary. The director acts on a brief that has no basis in data.' },
          { id: 'alert-rhea', label: 'Halt + Slack Rhea: "auth failed"',  icon: '⚠', verdict: 'correct-route', result: 'Workflow stops. Rhea gets Slack at 7:05am, re-authenticates. Director receives the correct brief 20 minutes late.' },
          { id: 'stale',      label: 'Use cached data from last week',   icon: '☰', verdict: 'silent-fail',  result: 'Director receives last week’s brief dated today. She makes decisions on stale data. No one knows.' },
        ],
      },
      {
        id: 'validate', nodeLabel: 'Validate Output', nodeIcon: '✓',
        failTitle: 'Brief too short (40 chars)',
        failDetail: 'Brief from Claude was 40 chars — far below the 100-char minimum and missing the keyword "exception".',
        choices: [
          { id: 'send',         label: 'Send it — AI node returned ok', icon: '→', verdict: 'silent-fail',  result: 'Director receives a 40-character email: "No exceptions this week." In a week with 3 SLA breaches. She takes no action.' },
          { id: 'retry-ai',     label: 'Retry the AI node',              icon: '↻', verdict: 'silent-fail',  result: 'Same sparse input produces the same thin output. Root cause (the input data) is not addressed.' },
          { id: 'alert-rhea',   label: 'Halt + alert Rhea first',        icon: '⚠', verdict: 'correct-route', result: 'Rhea gets: "Summary validation failed — 40 chars, missing \'exceptions\'." She finds the sheet was blank (holiday week) and sends a manual note.' },
          { id: 'silent-skip',  label: 'Skip sending — no brief at all', icon: '↷', verdict: 'silent-fail',  result: 'No brief, no explanation. Director assumes Rhea forgot. A "failed" notification beats silence.' },
        ],
      },
    ],
  },
  {
    id: 'eng-support-router',
    track: 'engineer',
    label: 'Engineer · support-router failures',
    filename: 'support-router-failure.json',
    upstream: { label: 'Build prompt', icon: '⚙', type: 'transform' },
    happyPath: { label: 'Zendesk Assign', icon: '⇄' },
    failures: [
      {
        id: 'enum', nodeLabel: 'OpenAI Route', nodeIcon: '◯',
        failTitle: 'Returned non-enum value',
        failDetail: 'Model returned "feedback" — but valid queues are { billing, sales, tech, churn }.',
        choices: [
          { id: 'as-is',     label: 'Pass to Zendesk anyway',         icon: '→', verdict: 'silent-fail',  result: 'Zendesk silently drops the assignment. Ticket sits unowned in the inbox.' },
          { id: 'low-conf',  label: 'Mark "low-confidence" + dead-letter', icon: '⚠', verdict: 'correct-route', result: 'Dead-letter row captures the bad enum + original ticket. Human triage queue gets it within the hour.' },
          { id: 'guess',     label: 'Map to closest valid queue',     icon: '⚙', verdict: 'silent-fail',  result: 'Mapping "feedback" → "sales" without verification routes the customer to the wrong team. Quiet error.' },
          { id: 'retry',     label: 'Retry the AI call',              icon: '↻', verdict: 'silent-fail',  result: 'Same prompt + same model = same drift. Token cost doubles, behaviour doesn’t change.' },
        ],
      },
    ],
  },
];

export function filterErrorPathScenarios(track: GenAITrack): ErrorPathScenario[] {
  return ERROR_PATH_DATASET.filter(s => s.track === 'both' || s.track === track);
}

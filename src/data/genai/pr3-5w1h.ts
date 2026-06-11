// ─── PR3 · FiveW1HCard dataset ───────────────────────────────────────
// Each entry is one "research brief" the learner has to compose by
// answering the 5W1H. Each dimension carries a small set of options
// with one marked as correct. The card stays the same — picker swaps
// the whole brief.

import type { GenAITrack } from '@/components/genaiTypes';

export type Dim = {
  key: 'WHO' | 'WHAT' | 'WHEN' | 'WHY' | 'HOW';
  q: string;
  opts: string[];
  correct: number;
};

export type FiveW1HBrief = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  team: string;        // "the {team}" — used in the system-prompt preview
  dims: Dim[];
};

export const FIVE_W1H_DATASET: FiveW1HBrief[] = [
  {
    id: 'eng-claims-triage',
    track: 'engineer',
    label: 'Engineer · claims triage brief',
    team: 'claims triage',
    dims: [
      { key: 'WHO',  q: 'Who is affected?',           opts: ['(empty)', 'Tier 2 claimant only',          'Claimant + treating physician',                    'Claimant + physician + pharmacy manager'],          correct: 2 },
      { key: 'WHAT', q: 'What claim scenario?',       opts: ['(empty)', 'Any pharmacy claim',            'Physician override request, clause 4.2c',         'Billing dispute'],                                  correct: 2 },
      { key: 'WHEN', q: 'When does the policy apply?', opts: ['(empty)', 'All claims after 2020',         'Claims after Jan 2022, Plan B only',              'Claims flagged by system'],                          correct: 2 },
      { key: 'WHY',  q: 'Why is this being researched?', opts: ['(empty)', 'Routine summary',              '48h SLA escalation decision — irreversible',     'Model accuracy check'],                              correct: 2 },
      { key: 'HOW',  q: 'How will the output be used?', opts: ['(empty)', 'Stored in archive',              'Case worker: approve / escalate / request info', 'Director review'],                                  correct: 2 },
    ],
  },
  {
    id: 'build-ops-brief',
    track: 'builder',
    label: 'Builder · weekly ops brief',
    team: 'ops exception',
    dims: [
      { key: 'WHO',  q: 'Who reads this brief?',         opts: ['(empty)', 'All analysts',                  'Regional Director — pre-meeting scan, 5 min',     'Anyone on the team'],                                correct: 2 },
      { key: 'WHAT', q: 'What question are they asking?', opts: ['(empty)', 'What happened this week?',       'Is there anything I need to act on before Friday?', 'How many exceptions were there?'],                  correct: 2 },
      { key: 'WHEN', q: 'When do they decide?',           opts: ['(empty)', 'Whenever convenient',            'Thursday AM before weekly ops call',              'End of month'],                                      correct: 2 },
      { key: 'WHY',  q: 'Why is this week different?',    opts: ['(empty)', 'Routine weekly summary',         '2 accounts breached SLA — board visibility risk', 'New exceptions added'],                              correct: 2 },
      { key: 'HOW',  q: 'How will they act on it?',       opts: ['(empty)', 'File for reference',             'Approve escalation or delegate — one decision',   'Forward to all managers'],                          correct: 2 },
    ],
  },
  {
    id: 'eng-incident-postmortem',
    track: 'engineer',
    label: 'Engineer · incident postmortem brief',
    team: 'incident response',
    dims: [
      { key: 'WHO',  q: 'Who reads this postmortem?',     opts: ['(empty)', 'All engineering',                'On-call + service owners for the impacted stack', 'The CTO'],                                            correct: 2 },
      { key: 'WHAT', q: 'What event is being explained?', opts: ['(empty)', 'A recent outage',               'INC-2024-118: auth-db saturation, 47-min MTTR',   'A flaky test'],                                       correct: 2 },
      { key: 'WHEN', q: 'When must the postmortem land?', opts: ['(empty)', 'When the writer has time',      'Within 5 business days per SOC 2 process',        'After the next sprint'],                              correct: 2 },
      { key: 'WHY',  q: 'Why is the postmortem needed?',  opts: ['(empty)', 'Process formality',             'To name the systemic gap so it doesn’t repeat',   'To assign blame'],                                    correct: 2 },
      { key: 'HOW',  q: 'How will the output be used?',   opts: ['(empty)', 'Archived in a wiki',            'Three action items wired into the next planning', 'Sent to status page'],                                correct: 2 },
    ],
  },
  {
    id: 'build-renewal',
    track: 'builder',
    label: 'Builder · renewal-prep brief',
    team: 'account management',
    dims: [
      { key: 'WHO',  q: 'Who is the brief for?',          opts: ['(empty)', 'The full GTM team',             'Account Executive owning Meridian renewal',       'Marketing'],                                          correct: 2 },
      { key: 'WHAT', q: 'What account is in scope?',      opts: ['(empty)', 'Any mid-market account',        'Meridian Corp · renewing Mar 2024',                'Net-new prospects'],                                  correct: 2 },
      { key: 'WHEN', q: 'When is the renewal decision?',  opts: ['(empty)', 'Sometime next quarter',         'Renewal call in 7 days; decision by 31 March',    'Next fiscal year'],                                   correct: 2 },
      { key: 'WHY',  q: 'Why is this renewal different?', opts: ['(empty)', 'Routine renewal',               'Champion left in Q2; expansion deal on the table', 'No notable change'],                                  correct: 2 },
      { key: 'HOW',  q: 'How will the AE use the brief?',  opts: ['(empty)', 'Read once and discard',        'Drive the call: ask, risk, floor — in 60 seconds', 'Forward to legal'],                                  correct: 2 },
    ],
  },
  {
    id: 'eng-pr-review',
    track: 'engineer',
    label: 'Engineer · PR-review brief',
    team: 'platform code review',
    dims: [
      { key: 'WHO',  q: 'Who reads this brief?',         opts: ['(empty)', 'All engineers',                 'The reviewer assigned to PR-1402',                'Anyone with repo access'],                            correct: 2 },
      { key: 'WHAT', q: 'What change is in scope?',      opts: ['(empty)', 'Any recent PR',                  'Token-refresh path · sliding 24h window',         'Whole auth module'],                                   correct: 2 },
      { key: 'WHEN', q: 'When does this need to land?',   opts: ['(empty)', 'Eventually',                     'Before next deploy window — Wednesday 3pm',       'After the next sprint'],                              correct: 2 },
      { key: 'WHY',  q: 'Why does this PR need attention?', opts: ['(empty)', 'Routine review',              'Risk: forces mobile re-login on rollout',         'Low-risk refactor'],                                  correct: 2 },
      { key: 'HOW',  q: 'How will the reviewer act?',     opts: ['(empty)', 'Skim and approve',              'Run iOS smoke + verify the test extension',       'Forward to QA'],                                      correct: 2 },
    ],
  },
  {
    id: 'build-launch-brief',
    track: 'builder',
    label: 'Builder · launch-brief composer',
    team: 'product launch',
    dims: [
      { key: 'WHO',  q: 'Who is the brief written for?', opts: ['(empty)', 'The whole company',             'GM signing off on launch GTM',                    'Marketing only'],                                    correct: 2 },
      { key: 'WHAT', q: 'What launch is in scope?',      opts: ['(empty)', 'Any upcoming launch',           'Q3 reporting feature · paid + free tiers',        'A feature update'],                                  correct: 2 },
      { key: 'WHEN', q: 'When does the GM need to sign off?', opts: ['(empty)', 'Soon',                      'Before Friday — launch is Monday',                'Within the quarter'],                                correct: 2 },
      { key: 'WHY',  q: 'Why does this launch carry risk?', opts: ['(empty)', 'No risk',                    'Legal flagged the case-study email',              'Just standard launch'],                              correct: 2 },
      { key: 'HOW',  q: 'How will the GM act on it?',     opts: ['(empty)', 'Read for awareness',           'Yes/no on the legal asks; sign off on pricing',   'Forward to the team'],                              correct: 2 },
    ],
  },
];

export function filterFiveW1H(track: GenAITrack): FiveW1HBrief[] {
  return FIVE_W1H_DATASET.filter(b => b.track === 'both' || b.track === track);
}

// ─── PR2 · Context / Model / Diff scenario datasets ─────────────────
// Each tool gets a curated list of full-scenario entries so the learner
// can swap the underlying case-study and see meaningfully different
// inputs + outputs. All content is hand-authored proper English; the
// deterministic generators in the components still drive the actual
// model output. Zero LLM calls.

import type { GenAITrack } from '@/components/genaiTypes';

// ─── 1 · ContextWindowInspector — 5 segments + 3 queries per scenario ─
export type ContextSeg = { id: string; label: string; short: string; tokens: number; content: string };
export type ContextQuery = {
  id: string;
  q: string;
  anchor: string;     // segment id that holds the answer
  truth: string;
  hedge: string;
};
export type ContextScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  segments: ContextSeg[];
  queries: ContextQuery[];
};

export const CONTEXT_SCENARIOS: ContextScenario[] = [
  // ─── Builder · clinical notes ──────────────────────────────────────
  {
    id: 'b-jane-pneumonia',
    track: 'builder',
    label: 'Builder · Jane Doe · pneumonia admission',
    segments: [
      { id: 's1', label: 'Patient demographics',  short: 'demographics', tokens: 320, content: 'Jane Doe, 68F, admitted 2024-03-12 with community-acquired pneumonia.' },
      { id: 's2', label: 'Admission history',     short: 'admission',    tokens: 410, content: 'COPD (GOLD II), HTN, T2DM. Presented with productive cough, fever, dyspnea, SpO2 88% RA.' },
      { id: 's3', label: 'Treatment & progress',  short: 'treatment',    tokens: 540, content: 'Started azithromycin + ceftriaxone, O2 2L NC. Respiratory status improving by day 3.' },
      { id: 's4', label: 'Critical event',        short: 'critical',     tokens: 380, content: 'Day 4 AKI from suspected ACE-i + diuretic interaction. ACE-i stopped, renal function recovering.' },
      { id: 's5', label: 'Discharge plan',        short: 'discharge',    tokens: 290, content: 'Discharge 2024-03-20. Nephrology follow-up. Low-sodium diet, daily weights.' },
    ],
    queries: [
      { id: 'Q1', q: 'When was the patient admitted, and for what?',           anchor: 's1', truth: 'Jane Doe was admitted on 2024-03-12 with community-acquired pneumonia.', hedge: 'The patient was admitted in early 2024 for a respiratory issue, though I would double-check the exact date.' },
      { id: 'Q2', q: 'What was the critical clinical event during admission?', anchor: 's4', truth: 'On day 4 the patient developed acute kidney injury suspected from ACE-i + diuretic interaction. ACE-i was stopped and renal function began recovering.', hedge: 'The records mention day-4 renal function changes but the specific cause is not clearly stated.' },
      { id: 'Q3', q: 'What is the follow-up plan after discharge?',            anchor: 's5', truth: 'Discharged 2024-03-20. Nephrology follow-up, low-sodium diet, daily weights.', hedge: 'The patient was discharged in March 2024 with some outpatient follow-up; the specifics aren’t fully clear from the context.' },
    ],
  },
  {
    id: 'b-marcus-sepsis',
    track: 'builder',
    label: 'Builder · Marcus T. · sepsis admission',
    segments: [
      { id: 's1', label: 'Demographics',          short: 'demographics', tokens: 300, content: 'Marcus T., 54M, admitted 2024-04-02 from the ER with suspected sepsis.' },
      { id: 's2', label: 'History',               short: 'history',      tokens: 430, content: 'PMH: T2DM with neuropathy, CKD stage 3, recent foot ulcer. Diabetic medication non-adherence per spouse.' },
      { id: 's3', label: 'Initial work-up',       short: 'workup',       tokens: 510, content: 'Lactate 4.1, WBC 22.4, BP 84/50. Empirical pip-tazo + vancomycin started within 45 min. Blood culture pending.' },
      { id: 's4', label: 'Critical event',        short: 'critical',     tokens: 460, content: 'Day 2 transient septic shock — pressors required for 9 hours. Blood culture grew MSSA; vancomycin de-escalated to cefazolin.' },
      { id: 's5', label: 'Discharge plan',        short: 'discharge',    tokens: 310, content: 'Discharged 2024-04-12 with PICC for 4 weeks IV cefazolin. Infectious-disease follow-up, diabetic foot clinic referral.' },
    ],
    queries: [
      { id: 'Q1', q: 'When was Marcus admitted and why?',                       anchor: 's1', truth: 'Marcus T. was admitted on 2024-04-02 from the ER with suspected sepsis.', hedge: 'Marcus was admitted in early April with what appears to be an infection of some kind; the specifics aren’t fully clear.' },
      { id: 'Q2', q: 'What critical event occurred during the admission?',      anchor: 's4', truth: 'On day 2 he developed transient septic shock requiring pressors for 9 hours; blood culture grew MSSA and vancomycin was de-escalated to cefazolin.', hedge: 'There was some haemodynamic instability during the admission and antibiotics were adjusted, though the exact pathogen isn’t in the visible context.' },
      { id: 'Q3', q: 'What is the discharge plan?',                             anchor: 's5', truth: 'Discharged 2024-04-12 with PICC for 4 weeks IV cefazolin. Infectious-disease follow-up + diabetic foot clinic referral.', hedge: 'Marcus was discharged with outpatient antibiotics and follow-up; the duration and specialty references aren’t fully clear.' },
    ],
  },
  {
    id: 'b-lina-stroke',
    track: 'builder',
    label: 'Builder · Lina K. · ischemic stroke',
    segments: [
      { id: 's1', label: 'Demographics',          short: 'demographics', tokens: 290, content: 'Lina K., 72F, brought in by family 2024-02-18 with left-sided weakness onset ~07:40 that morning.' },
      { id: 's2', label: 'Pre-treatment imaging', short: 'imaging',      tokens: 470, content: 'NIHSS 14 on arrival. CT head ruled out haemorrhage; CT angio showed right MCA M2 occlusion.' },
      { id: 's3', label: 'Acute treatment',       short: 'treatment',    tokens: 520, content: 'tPA given at 09:12 (within window). Mechanical thrombectomy at 10:48 — TICI 2b recanalisation.' },
      { id: 's4', label: 'Critical event',        short: 'critical',     tokens: 410, content: 'Day 2 small reperfusion haemorrhage on MRI without midline shift. Anti-platelets held 24 h, then reintroduced.' },
      { id: 's5', label: 'Discharge plan',        short: 'discharge',    tokens: 330, content: 'Discharged 2024-02-26 to inpatient rehab. NIHSS 6. Dual antiplatelet x 21 days, statin, BP target <140/80.' },
    ],
    queries: [
      { id: 'Q1', q: 'What was the presenting deficit?',                        anchor: 's1', truth: 'Lina K. presented with left-sided weakness onset around 07:40 on 2024-02-18.', hedge: 'Lina presented with neurological symptoms one morning in February; the exact onset time isn’t fully clear.' },
      { id: 'Q2', q: 'What was the critical post-procedure event?',             anchor: 's4', truth: 'On day 2 a small reperfusion haemorrhage was seen on MRI without midline shift; antiplatelets were held 24 hours then reintroduced.', hedge: 'There was a complication a couple of days after the procedure and antiplatelets were adjusted; the exact finding isn’t in the visible context.' },
      { id: 'Q3', q: 'What was the discharge disposition and medication plan?', anchor: 's5', truth: 'Discharged 2024-02-26 to inpatient rehab with NIHSS 6; dual antiplatelet x 21 days, statin, BP target <140/80.', hedge: 'Lina was discharged to a rehab setting with secondary-prevention medications; the duration and BP targets aren’t fully clear.' },
    ],
  },
  // ─── Engineer · incident reports ───────────────────────────────────
  {
    id: 'e-inc-db01',
    track: 'engineer',
    label: 'Engineer · INC-2024-03-12 · DB01 outage',
    segments: [
      { id: 's1', label: 'Incident header',       short: 'header',      tokens: 280, content: 'INC-2024-03-12 — DB outage. Primary DB01. Began 14:00 UTC.' },
      { id: 's2', label: 'Initial diagnosis',     short: 'initial-dx',  tokens: 360, content: 'High CPU on DB01. Initial diagnosis: runaway query, no replication lag.' },
      { id: 's3', label: 'Actions taken',         short: 'actions',     tokens: 520, content: 'Killed PID 12345. Restarted db-service. Drained connection pool. Monitoring metrics.' },
      { id: 's4', label: 'Critical finding',      short: 'critical',    tokens: 420, content: 'CRITICAL: user_sessions table corrupted during restart. Initiated restore from 13:55 UTC backup.' },
      { id: 's5', label: 'Resolution',            short: 'resolution',  tokens: 300, content: 'user_sessions restored 16:30 UTC. Service fully recovered. Post-mortem scheduled.' },
    ],
    queries: [
      { id: 'Q1', q: 'When did the outage begin and which DB was primary?',    anchor: 's1', truth: 'INC-2024-03-12 — Primary DB was DB01. Outage began at 14:00 UTC.', hedge: 'A database outage occurred on March 12, affecting a primary database — the exact timestamp isn’t fully clear from the context.' },
      { id: 'Q2', q: 'What was the critical finding during incident response?', anchor: 's4', truth: 'The user_sessions table was found corrupted during restart. A restore from the 13:55 UTC backup was initiated.', hedge: 'The records reference user_sessions activity around the restart but the specific finding is not clearly stated.' },
      { id: 'Q3', q: 'When was the service fully recovered?',                   anchor: 's5', truth: 'user_sessions was restored at 16:30 UTC; service fully recovered after that.', hedge: 'Service was recovered later that afternoon, though the exact timestamp isn’t fully clear from the context.' },
    ],
  },
  {
    id: 'e-inc-auth-cascade',
    track: 'engineer',
    label: 'Engineer · INC-2024-05-04 · auth cascade',
    segments: [
      { id: 's1', label: 'Incident header',       short: 'header',      tokens: 280, content: 'INC-2024-05-04 — Auth service cascade failure. Began 09:22 UTC, declared SEV-2 at 09:31.' },
      { id: 's2', label: 'Initial diagnosis',     short: 'initial-dx',  tokens: 410, content: 'On-call paged for elevated 5xx on /login. JWT-issuer pod CrashLoopBackOff after the morning config push.' },
      { id: 's3', label: 'Actions taken',         short: 'actions',     tokens: 530, content: 'Rolled JWT-issuer config to the previous version. Scaled the auth pool 3→8 to absorb retry storm.' },
      { id: 's4', label: 'Critical finding',      short: 'critical',    tokens: 480, content: 'CRITICAL: A regex in the new config inadvertently blocked all tokens issued before 09:00 UTC — silent denial that read as auth failures downstream.' },
      { id: 's5', label: 'Resolution',            short: 'resolution',  tokens: 330, content: 'Tokens flushed and re-issued from the auth pool at 10:14 UTC. SLO breach for 52 min. Post-mortem owner: @auth-platform.' },
    ],
    queries: [
      { id: 'Q1', q: 'When did the auth cascade begin and how was it classified?', anchor: 's1', truth: 'INC-2024-05-04 — the auth cascade began at 09:22 UTC and was declared SEV-2 at 09:31 UTC.', hedge: 'An auth incident started early in the morning and was eventually declared a SEV-2; the exact timestamps aren’t fully visible in the context.' },
      { id: 'Q2', q: 'What was the critical finding during the response?',         anchor: 's4', truth: 'A regex in the new config inadvertently blocked tokens issued before 09:00 UTC — a silent denial that read as auth failures downstream.', hedge: 'There was some kind of token-validation issue tied to the config push; the exact mechanism isn’t in the visible context.' },
      { id: 'Q3', q: 'How was the incident finally resolved?',                     anchor: 's5', truth: 'Tokens were flushed and re-issued from the auth pool at 10:14 UTC. SLO was breached for 52 minutes. Post-mortem owner is @auth-platform.', hedge: 'The incident was resolved by replaying the token issuance step; the exact recovery time isn’t fully clear.' },
    ],
  },
  {
    id: 'e-inc-payments-retry',
    track: 'engineer',
    label: 'Engineer · INC-2024-06-19 · payments retry storm',
    segments: [
      { id: 's1', label: 'Incident header',       short: 'header',      tokens: 280, content: 'INC-2024-06-19 — payments service degraded. Detected at 18:04 UTC after a 4% checkout failure spike.' },
      { id: 's2', label: 'Initial diagnosis',     short: 'initial-dx',  tokens: 440, content: 'Stripe webhook receiver throwing 503 intermittently. Initial hypothesis: upstream issue, marked external dependency.' },
      { id: 's3', label: 'Actions taken',         short: 'actions',     tokens: 520, content: 'Bumped webhook receiver replicas 4→12. Enabled idempotency cache. Engineering paged the on-call.' },
      { id: 's4', label: 'Critical finding',      short: 'critical',    tokens: 470, content: 'CRITICAL: Stripe was healthy; our retry policy had no jitter and was self-DDoS-ing the receiver at every flush.' },
      { id: 's5', label: 'Resolution',            short: 'resolution',  tokens: 320, content: 'Capped retries at 3 with exponential jitter 250-2000ms. Failure rate < 0.2% by 19:48 UTC. SLO breach: 1h 44m.' },
    ],
    queries: [
      { id: 'Q1', q: 'When was the payments degradation detected and how bad?',  anchor: 's1', truth: 'INC-2024-06-19 — detected at 18:04 UTC after a 4% checkout failure spike.', hedge: 'The payments incident was caught in the evening when checkout failures crossed a threshold; the precise time and percentage aren’t fully clear.' },
      { id: 'Q2', q: 'What was the actual root cause?',                          anchor: 's4', truth: 'Stripe itself was healthy. The team’s retry policy had no jitter and was self-DDoS-ing the webhook receiver at every flush.', hedge: 'The cause turned out to be internal rather than upstream; the exact retry-policy detail isn’t in the visible context.' },
      { id: 'Q3', q: 'How long did the SLO breach last?',                        anchor: 's5', truth: 'Failure rate returned under 0.2% by 19:48 UTC. SLO breach lasted 1h 44m.', hedge: 'The breach ran for somewhere under two hours; the exact recovery time isn’t fully clear.' },
    ],
  },
];

export const filterContextScenarios = (t: GenAITrack): ContextScenario[] =>
  CONTEXT_SCENARIOS.filter(s => s.track === 'both' || s.track === t);

// ─── 2 · ModelSelectorTool — workload portfolios ──────────────────────
export type Workload = {
  id: string;
  label: string;
  volumePerDay: number;
  tokensPerCall: number;
  needsFrontier: boolean;
  latencyBudgetMs: number;
};
export type WorkloadPortfolio = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  workloads: Workload[];
};

export const WORKLOAD_PORTFOLIOS: WorkloadPortfolio[] = [
  {
    id: 'b-northstar-ops',
    track: 'builder',
    label: 'Builder · Northstar ops portfolio',
    workloads: [
      { id: 'w1', label: 'Intake form summarisation',     volumePerDay: 200, tokensPerCall: 2000, needsFrontier: false, latencyBudgetMs: 600 },
      { id: 'w2', label: 'Exception classification',     volumePerDay: 100, tokensPerCall: 1500, needsFrontier: false, latencyBudgetMs: 400 },
      { id: 'w3', label: 'Complex care-plan synthesis',  volumePerDay: 5,   tokensPerCall: 6000, needsFrontier: true,  latencyBudgetMs: 1500 },
    ],
  },
  {
    id: 'b-revenue-cycle',
    track: 'builder',
    label: 'Builder · revenue-cycle portfolio',
    workloads: [
      { id: 'w1', label: 'Claim adjudication letter draft', volumePerDay: 800, tokensPerCall: 1800, needsFrontier: false, latencyBudgetMs: 600 },
      { id: 'w2', label: 'EOB → patient-friendly summary',  volumePerDay: 300, tokensPerCall: 1000, needsFrontier: false, latencyBudgetMs: 500 },
      { id: 'w3', label: 'Medical-necessity appeal drafting', volumePerDay: 12, tokensPerCall: 9000, needsFrontier: true, latencyBudgetMs: 2000 },
    ],
  },
  {
    id: 'b-patient-comms',
    track: 'builder',
    label: 'Builder · patient communications',
    workloads: [
      { id: 'w1', label: 'Appointment reminder tone tune-up', volumePerDay: 1200, tokensPerCall: 400, needsFrontier: false, latencyBudgetMs: 800 },
      { id: 'w2', label: 'Post-visit instruction simplification', volumePerDay: 400, tokensPerCall: 1500, needsFrontier: false, latencyBudgetMs: 700 },
      { id: 'w3', label: 'Chronic-care plan personalisation',  volumePerDay: 10, tokensPerCall: 7000, needsFrontier: true, latencyBudgetMs: 1500 },
    ],
  },
  {
    id: 'e-platform-sre',
    track: 'engineer',
    label: 'Engineer · platform/SRE portfolio',
    workloads: [
      { id: 'w1', label: 'Log anomaly summarisation',     volumePerDay: 500, tokensPerCall: 1500, needsFrontier: false, latencyBudgetMs: 600 },
      { id: 'w2', label: 'Ticket routing classifier',     volumePerDay: 200, tokensPerCall: 1200, needsFrontier: false, latencyBudgetMs: 350 },
      { id: 'w3', label: 'Root-cause analysis for SEV-1s', volumePerDay: 8,   tokensPerCall: 8000, needsFrontier: true,  latencyBudgetMs: 1500 },
    ],
  },
  {
    id: 'e-developer-experience',
    track: 'engineer',
    label: 'Engineer · DX portfolio',
    workloads: [
      { id: 'w1', label: 'PR description auto-draft',     volumePerDay: 600, tokensPerCall: 1200, needsFrontier: false, latencyBudgetMs: 600 },
      { id: 'w2', label: 'Unit-test stub generation',     volumePerDay: 400, tokensPerCall: 800,  needsFrontier: false, latencyBudgetMs: 500 },
      { id: 'w3', label: 'Architecture-review co-author', volumePerDay: 4,   tokensPerCall: 9000, needsFrontier: true,  latencyBudgetMs: 1800 },
    ],
  },
  {
    id: 'e-security-triage',
    track: 'engineer',
    label: 'Engineer · security-triage portfolio',
    workloads: [
      { id: 'w1', label: 'CVE bulletin summarisation',    volumePerDay: 250, tokensPerCall: 2200, needsFrontier: false, latencyBudgetMs: 700 },
      { id: 'w2', label: 'SOC alert triage',              volumePerDay: 600, tokensPerCall: 900,  needsFrontier: false, latencyBudgetMs: 300 },
      { id: 'w3', label: 'Threat-model drafting',         volumePerDay: 3,   tokensPerCall: 12000, needsFrontier: true, latencyBudgetMs: 2200 },
    ],
  },
];

export const filterWorkloadPortfolios = (t: GenAITrack): WorkloadPortfolio[] =>
  WORKLOAD_PORTFOLIOS.filter(p => p.track === 'both' || p.track === t);

// ─── 3 · PromptDiffViewer — test-input + prompt-version scenarios ────
// The "output map" lets us produce a distinct response per signal combo,
// per scenario — so swapping the scenario gives genuinely different
// model output regardless of how the prompt is edited.
export type DiffOutputMap = {
  none: string;          // no role, no format
  roleOnly: string;      // role but no format
  roleAndFormat: string; // role + format (low temp / clean)
  full: string;          // role + format + scope + example (best)
  partial: string;       // role + format + (scope XOR example)
  fallback: string;      // catch-all
};

export type DiffScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  testInput: string;
  v1: string;
  v2: string;
  v3: string;
  outputs: DiffOutputMap;
  criticalKeyRegex: RegExp;  // rubric: did the model surface the critical fact?
};

export const DIFF_SCENARIOS: DiffScenario[] = [
  // ─── Builder ───────────────────────────────────────────────────────
  {
    id: 'b-jane-discharge',
    track: 'builder',
    label: 'Builder · Jane Doe discharge summary',
    testInput: 'PATIENT: Jane Doe, 68F. Admitted 2024-03-12 (community-acquired pneumonia). PMH: COPD, HTN, T2DM. Treated azithromycin + ceftriaxone. Day-4 AKI suspected from ACE-i + diuretic interaction — ACE-i stopped, renal recovering. Discharged 2024-03-20. Nephrology f/u 2 weeks. Low-sodium diet, daily weights.',
    v1: 'Write a discharge summary for this patient.',
    v2: 'You are a clinical documentation assistant. Summarise the patient\'s discharge plan from the provided care notes. Return a bulleted list of key actions for home care. Use a professional, empathetic tone.',
    v3: 'You are a clinical documentation assistant. Summarise the patient\'s discharge plan from the provided care notes (last 7 days only). Return a bulleted list of key actions for home care. Use a professional, empathetic tone.\nExample: For a patient with AKI, include specific dietary restrictions and follow-up with nephrology.',
    outputs: {
      none: 'Patient was discharged after treatment. They should follow up with their doctor and continue medications as prescribed.',
      roleOnly: 'Patient was discharged. Recommend follow-up with primary care, continued antibiotics as prescribed, and a return visit if symptoms worsen.',
      roleAndFormat: '• Patient discharged on 2024-03-20.\n• Follow up with primary care.\n• Continue antibiotics as prescribed.\n• Take medications as directed.',
      partial: '• Discharged 2024-03-20.\n• Continue azithromycin + ceftriaxone course.\n• Follow up nephrology in 2 weeks for AKI.\n• Low-sodium diet, daily weights.',
      full: '• Discharged 2024-03-20.\n• Complete azithromycin + ceftriaxone course.\n• Nephrology follow-up in 2 weeks — AKI was day-4 ACE-i + diuretic interaction; ACE-i discontinued.\n• Low-sodium diet, daily weights, monitor fluid intake.\n• PCP follow-up 1 week.',
      fallback: 'Patient discharged. Follow up as advised. Continue medications.',
    },
    criticalKeyRegex: /aki|nephrology|ace[- ]?i|low[- ]sodium/i,
  },
  {
    id: 'b-marcus-summary',
    track: 'builder',
    label: 'Builder · Marcus T. sepsis recap',
    testInput: 'PATIENT: Marcus T., 54M. Admitted 2024-04-02 from ER, suspected sepsis. PMH: T2DM with neuropathy, CKD stage 3, recent foot ulcer. Lactate 4.1, WBC 22.4, BP 84/50 at admit. Started pip-tazo + vancomycin within 45 min. Day 2 transient septic shock (pressors 9h). Culture grew MSSA — vancomycin de-escalated to cefazolin. Discharged 2024-04-12 with PICC + 4 weeks IV cefazolin. ID + diabetic foot clinic follow-up.',
    v1: 'Summarise this admission.',
    v2: 'You are a clinical documentation assistant. Summarise the patient\'s admission course from the provided notes. Return a bulleted list of the diagnosis, treatment course, and discharge instructions. Use a professional tone.',
    v3: 'You are a clinical documentation assistant. Summarise the admission course from the provided notes (this admission only). Return a bulleted list of: diagnosis, key clinical events, discharge plan. Use a professional tone.\nExample: For a sepsis admission with culture identification, name the organism and the targeted antibiotic.',
    outputs: {
      none: 'Patient was admitted with infection and treated. He was discharged with follow-up instructions.',
      roleOnly: 'Patient was admitted with sepsis and treated with antibiotics. He recovered and was discharged with outpatient follow-up.',
      roleAndFormat: '• Admitted 2024-04-02 with sepsis.\n• Treated with broad-spectrum antibiotics.\n• Discharged 2024-04-12.\n• Follow up as recommended.',
      partial: '• Admitted 2024-04-02 with sepsis.\n• Empirical pip-tazo + vancomycin within 45 min.\n• Day 2 transient septic shock — pressors required.\n• Discharged 2024-04-12 with PICC for IV antibiotics.',
      full: '• Admitted 2024-04-02 with sepsis (lactate 4.1, WBC 22.4, BP 84/50).\n• Empirical pip-tazo + vancomycin within 45 min.\n• Day 2 transient septic shock — pressors 9 h.\n• Culture grew MSSA; vancomycin de-escalated to cefazolin.\n• Discharged 2024-04-12 with PICC + 4 weeks IV cefazolin.\n• Follow-up: ID + diabetic foot clinic.',
      fallback: 'Patient admitted with sepsis. Treated and discharged with antibiotics.',
    },
    criticalKeyRegex: /mssa|cefazolin|picc|septic shock|pressors/i,
  },
  {
    id: 'b-lina-summary',
    track: 'builder',
    label: 'Builder · Lina K. stroke recap',
    testInput: 'PATIENT: Lina K., 72F. Brought in 2024-02-18 ~07:40 onset, left-sided weakness. NIHSS 14 on arrival. CT ruled out haemorrhage; CT angio right MCA M2 occlusion. tPA 09:12, mechanical thrombectomy 10:48 (TICI 2b). Day 2 small reperfusion haemorrhage, no midline shift — antiplatelets held 24h then restarted. Discharged 2024-02-26 to inpatient rehab. NIHSS 6. DAPT x 21 d, statin, BP <140/80.',
    v1: 'Write a stroke summary.',
    v2: 'You are a clinical documentation assistant. Summarise the patient\'s stroke course from the provided notes. Return a bulleted list of the presentation, acute treatment, and discharge plan.',
    v3: 'You are a clinical documentation assistant. Summarise the stroke course from the provided notes (this admission only). Return a bulleted list of: presentation + NIHSS, acute interventions with timestamps, complications, discharge plan with secondary prevention.\nExample: For a reperfusion-related complication, name it and state how anti-thrombotics were adjusted.',
    outputs: {
      none: 'Patient had a stroke and received treatment. She was discharged with rehab and medication.',
      roleOnly: 'Patient had an ischemic stroke. She received tPA and thrombectomy, and was discharged for rehabilitation with antiplatelet therapy.',
      roleAndFormat: '• Stroke admission 2024-02-18.\n• Received tPA and thrombectomy.\n• Discharged to rehab on 2024-02-26.\n• Continue anti-platelets and BP control.',
      partial: '• Onset 07:40, NIHSS 14 on arrival.\n• tPA 09:12, thrombectomy 10:48 — TICI 2b.\n• Day 2 reperfusion haemorrhage (small, no shift) — antiplatelets held 24 h, restarted.\n• Discharged to inpatient rehab 2024-02-26.',
      full: '• Onset 07:40 on 2024-02-18; NIHSS 14 on arrival.\n• Right MCA M2 occlusion on CTA.\n• tPA at 09:12; mechanical thrombectomy at 10:48 — TICI 2b.\n• Day 2 small reperfusion haemorrhage without midline shift — antiplatelets held 24 h, then DAPT restarted.\n• Discharged 2024-02-26 to inpatient rehab, NIHSS 6.\n• Secondary prevention: DAPT × 21 d, statin, BP target <140/80.',
      fallback: 'Stroke admission with tPA + thrombectomy. Discharged to rehab.',
    },
    criticalKeyRegex: /tpa|thrombectomy|tici|reperfusion haemorrhage|dapt/i,
  },
  // ─── Engineer ──────────────────────────────────────────────────────
  {
    id: 'e-inc-db01-summary',
    track: 'engineer',
    label: 'Engineer · INC-2024-03-12 DB01 summary',
    testInput: 'INCIDENT INC-2024-03-12: Primary DB01 outage 14:00 UTC. Initial dx: runaway query, no replication lag. Actions: killed PID 12345, restarted db-service, drained pool. CRITICAL: user_sessions table corrupted during restart — restore from 13:55 UTC backup. Recovered 16:30 UTC. Impact: 2.5h partial degradation.',
    v1: 'Summarize incident report.',
    v2: 'System: You are an API endpoint for generating structured summaries.\nUser: Summarize the incident report.\nSystem: Output a JSON object with fields: "incident_id", "root_cause", "resolution_steps", "impact".',
    v3: 'System: You are an API endpoint for generating structured summaries.\nUser: Summarize the incident report.\nSystem: Output a JSON object with fields: "incident_id", "root_cause", "resolution_steps", "impact", "data_integrity_status".\nExample: If "data corruption detected", set "data_integrity_status" to "Compromised, restored from backup".',
    outputs: {
      none: 'The system had a database issue. The team identified the problem and resolved it. Service was restored.',
      roleOnly: 'The team responded to a database incident. They diagnosed a problem, took corrective actions, and restored service. Impact was contained.',
      roleAndFormat: '{\n  "incident_id": "INC-2024-03-12",\n  "root_cause": "Runaway query on DB01",\n  "resolution_steps": ["Killed PID 12345", "Restarted db-service"],\n  "impact": "Partial service degradation for 2.5 hours."\n}',
      partial: '{\n  "incident_id": "INC-2024-03-12",\n  "root_cause": "Runaway query on DB01",\n  "resolution_steps": ["Killed PID 12345", "Restarted db-service", "Restored user_sessions"],\n  "impact": "2.5h partial service degradation."\n}',
      full: '{\n  "incident_id": "INC-2024-03-12",\n  "root_cause": "Runaway query on DB01",\n  "resolution_steps": ["Killed PID 12345", "Restarted db-service", "Restored user_sessions from 13:55 UTC backup"],\n  "impact": "2.5h partial degradation; recovered 16:30 UTC.",\n  "data_integrity_status": "Compromised, restored from backup"\n}',
      fallback: 'The incident was investigated and resolved.',
    },
    criticalKeyRegex: /user_sessions|data_integrity|corrupted|restore from .* backup/i,
  },
  {
    id: 'e-inc-auth-summary',
    track: 'engineer',
    label: 'Engineer · INC-2024-05-04 auth cascade summary',
    testInput: 'INCIDENT INC-2024-05-04: Auth cascade. Began 09:22 UTC, SEV-2 09:31. JWT-issuer in CrashLoopBackOff after morning config push. Rolled config to previous version, scaled auth pool 3→8. CRITICAL: regex in new config silently denied tokens issued before 09:00 UTC — read as auth failures downstream. Tokens flushed + re-issued at 10:14 UTC. SLO breach 52 min. Owner: @auth-platform.',
    v1: 'Summarize the incident.',
    v2: 'System: You are an API endpoint for generating structured summaries.\nUser: Summarize the incident report.\nSystem: Output a JSON object with fields: "incident_id", "severity", "root_cause", "resolution_steps", "slo_breach_minutes".',
    v3: 'System: You are an API endpoint for generating structured summaries.\nUser: Summarize the incident report.\nSystem: Output a JSON object with fields: "incident_id", "severity", "root_cause", "resolution_steps", "slo_breach_minutes", "owner".\nExample: If a config push silently rejected a class of tokens, the root_cause must explicitly name "silent denial" and the scope.',
    outputs: {
      none: 'There was an authentication issue. The team rolled back a change and the service recovered.',
      roleOnly: 'There was an authentication-related incident this morning. The team rolled back a recent change and the service recovered after some minutes of degradation.',
      roleAndFormat: '{\n  "incident_id": "INC-2024-05-04",\n  "severity": "SEV-2",\n  "root_cause": "Auth cascade after morning config push",\n  "resolution_steps": ["Rolled JWT-issuer config", "Scaled auth pool 3→8"],\n  "slo_breach_minutes": 52\n}',
      partial: '{\n  "incident_id": "INC-2024-05-04",\n  "severity": "SEV-2",\n  "root_cause": "JWT regex silently denied pre-09:00 UTC tokens",\n  "resolution_steps": ["Rolled JWT-issuer config", "Flushed + re-issued tokens"],\n  "slo_breach_minutes": 52\n}',
      full: '{\n  "incident_id": "INC-2024-05-04",\n  "severity": "SEV-2",\n  "root_cause": "Silent denial: regex in new JWT-issuer config rejected tokens issued before 09:00 UTC",\n  "resolution_steps": ["Rolled JWT-issuer config to previous version", "Scaled auth pool 3→8", "Flushed + re-issued tokens at 10:14 UTC"],\n  "slo_breach_minutes": 52,\n  "owner": "@auth-platform"\n}',
      fallback: 'Auth incident resolved by config rollback.',
    },
    criticalKeyRegex: /silent denial|regex|pre-?09|silent/i,
  },
  {
    id: 'e-inc-payments-summary',
    track: 'engineer',
    label: 'Engineer · INC-2024-06-19 payments summary',
    testInput: 'INCIDENT INC-2024-06-19: payments degraded. Detected 18:04 UTC (4% checkout failure spike). Initial hypothesis: Stripe upstream issue. Actions: bumped webhook receiver replicas 4→12; enabled idempotency cache. CRITICAL: Stripe was healthy — our retry policy had no jitter and was self-DDoS-ing the receiver at every flush. Capped retries at 3 with exponential jitter 250-2000ms. Failure rate <0.2% by 19:48 UTC. SLO breach 1h 44m.',
    v1: 'Summarize the payments incident.',
    v2: 'System: You are an API endpoint for generating structured summaries.\nUser: Summarize the incident report.\nSystem: Output a JSON object with fields: "incident_id", "root_cause", "resolution_steps", "slo_breach_minutes".',
    v3: 'System: You are an API endpoint for generating structured summaries.\nUser: Summarize the incident report.\nSystem: Output a JSON object with fields: "incident_id", "root_cause", "resolution_steps", "slo_breach_minutes", "false_attribution".\nExample: If the team initially blamed an external provider and the real cause was internal, set "false_attribution" with the cited dependency.',
    outputs: {
      none: 'Payments was degraded for a while and the team fixed it.',
      roleOnly: 'Payments experienced a degradation due to retry behaviour. The team adjusted the retry policy and the service recovered.',
      roleAndFormat: '{\n  "incident_id": "INC-2024-06-19",\n  "root_cause": "Retry policy without jitter",\n  "resolution_steps": ["Bumped webhook replicas", "Enabled idempotency cache"],\n  "slo_breach_minutes": 104\n}',
      partial: '{\n  "incident_id": "INC-2024-06-19",\n  "root_cause": "Retry policy without jitter caused self-DDoS",\n  "resolution_steps": ["Capped retries at 3", "Added 250-2000ms jitter"],\n  "slo_breach_minutes": 104\n}',
      full: '{\n  "incident_id": "INC-2024-06-19",\n  "root_cause": "Retry policy without jitter caused self-DDoS of the webhook receiver",\n  "resolution_steps": ["Bumped webhook receiver replicas 4→12", "Enabled idempotency cache", "Capped retries at 3 with exponential jitter 250-2000ms"],\n  "slo_breach_minutes": 104,\n  "false_attribution": "Stripe (initially flagged; healthy throughout)"\n}',
      fallback: 'Payments incident resolved.',
    },
    criticalKeyRegex: /self-?ddos|jitter|retry|stripe was healthy|false_attribution/i,
  },
];

export const filterDiffScenarios = (t: GenAITrack): DiffScenario[] =>
  DIFF_SCENARIOS.filter(s => s.track === 'both' || s.track === t);

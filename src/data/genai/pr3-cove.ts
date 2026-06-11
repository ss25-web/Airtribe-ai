// ─── PR3 · COVECard dataset ──────────────────────────────────────────
// Each scenario is a Claude draft made of 4 highlighted claims; the
// learner tags each with one of C/O/V/E (Correctness / Originality /
// Verifiability / Effectiveness). Pre-authored proper English; no LLM.

import type { GenAITrack } from '@/components/genaiTypes';

export type CoveVerdict = 'C' | 'O' | 'V' | 'E';

export type CoveClaim = {
  id: string;
  text: string;
  verdict: CoveVerdict;
  explain: string;
};

export type CoveScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  domain: string;     // shown in the chat title bar
  claims: CoveClaim[];
};

export const COVE_DATASET: CoveScenario[] = [
  {
    id: 'eng-pharmacy-override',
    track: 'engineer',
    label: 'Engineer · pharmacy override draft',
    domain: 'pharmacy override',
    claims: [
      { id: 'a', text: 'Coverage rate for Tier 2 pharmacy benefits is 78%.',                       verdict: 'V', explain: 'Verbatim in plan_schedule.pdf row 14, "Tier 2 pharmacy cover rate". Source is exact and traceable.' },
      { id: 'b', text: 'The industry average override approval rate is 82%.',                       verdict: 'O', explain: 'Not in any document in your pipeline — model pulled it from training data. Hallucinated benchmark.' },
      { id: 'c', text: 'Claim #A2241 requires escalation under clause 4.2c, Feb 2022 amendment.',  verdict: 'C', explain: 'Factually accurate — the amendment confirms §4.2c applies to Tier 2 CA plans. Clause reference is exact.' },
      { id: 'd', text: 'Recommended action: escalate to pharmacy review, 48h SLA.',                 verdict: 'E', explain: 'Directly serves the case worker’s decision. Action, queue, deadline — nothing left to infer.' },
    ],
  },
  {
    id: 'build-ops-brief',
    track: 'builder',
    label: 'Builder · weekly ops director brief',
    domain: 'ops exception brief',
    claims: [
      { id: 'a', text: '23 exceptions were processed this week.',                                  verdict: 'C', explain: 'Verifiable against the exception tracker export (row count, current week filter). Factually accurate.' },
      { id: 'b', text: 'Resolution time improved 18% compared to last month.',                     verdict: 'O', explain: 'This figure does not appear in any document you indexed — model generated it from training patterns.' },
      { id: 'c', text: 'Accounts #4412 and #7089 are 6 and 8 days over SLA respectively.',         verdict: 'V', explain: 'Traceable to exception_tracker.sheet rows 14 + 23, column "Days Open" vs SLA column. Source explicit.' },
      { id: 'd', text: '2 accounts need your decision before Friday — rest is resolved.',          verdict: 'E', explain: 'Directly answers what the director is asking. Filters to action items, clears everything else.' },
    ],
  },
  {
    id: 'eng-incident-postmortem',
    track: 'engineer',
    label: 'Engineer · INC-2024-118 postmortem',
    domain: 'incident postmortem',
    claims: [
      { id: 'a', text: 'Root cause: connection pool on auth-db saturated at 14:22 UTC.',           verdict: 'C', explain: 'Confirmed by the Grafana saturation graph at the exact timestamp. Factually accurate.' },
      { id: 'b', text: 'Industry MTTR benchmark for auth outages is 32 minutes.',                   verdict: 'O', explain: 'No source on file — invented from training data. Plausible-sounding benchmark, no provenance.' },
      { id: 'c', text: 'Impact: 12,400 users affected per the auth.log span 14:22–15:09.',         verdict: 'V', explain: 'Traceable to auth.log; range matches the incident window. Easy for a reviewer to re-derive.' },
      { id: 'd', text: 'Action: raise pool ceiling to 200; add saturation alert at 80%.',          verdict: 'E', explain: 'Two concrete, owner-able actions. Directly closes the gap the postmortem identified.' },
    ],
  },
  {
    id: 'build-renewal',
    track: 'builder',
    label: 'Builder · Meridian renewal brief',
    domain: 'renewal prep',
    claims: [
      { id: 'a', text: 'Meridian Corp · 14 of 20 seats active in the last 30 days.',                verdict: 'C', explain: 'Verifiable in the usage-trend sheet. Counts match — factually correct.' },
      { id: 'b', text: 'Mid-market accounts in this segment have a 92% renewal rate industry-wide.', verdict: 'O', explain: 'Not on file anywhere in your project — model produced the benchmark itself.' },
      { id: 'c', text: 'Open tickets: 3 (TKT-441, TKT-503, TKT-512).',                              verdict: 'V', explain: 'Each ticket ID is traceable. Reviewer can open Salesforce and confirm in a click.' },
      { id: 'd', text: 'Ask the AE: floor on price + 2-yr multi-product extension.',                verdict: 'E', explain: 'A single ask the AE walks into the room with. Decision-grade output.' },
    ],
  },
  {
    id: 'eng-pr-summary',
    track: 'engineer',
    label: 'Engineer · PR-1402 summary',
    domain: 'pull-request review',
    claims: [
      { id: 'a', text: 'Change: token TTL drops from 7d to a sliding 24h window.',                  verdict: 'C', explain: 'Matches the diff exactly. Factually correct against pr-1402.diff.' },
      { id: 'b', text: 'Sliding-window tokens reduce session-hijacking incidents by ~60%.',         verdict: 'O', explain: 'No paper or doc indexed for this — sounds plausible, has no provenance.' },
      { id: 'c', text: 'Failing test: `auth/token.test.ts:42` expects a 7d expiry.',                verdict: 'V', explain: 'Trace exists; reviewer can re-run and see the exact assertion. Verifiable.' },
      { id: 'd', text: 'Reviewer action: run iOS smoke before approving — forces mobile re-login.', verdict: 'E', explain: 'One concrete reviewer step, scoped to the highest-risk surface.' },
    ],
  },
  {
    id: 'build-launch-brief',
    track: 'builder',
    label: 'Builder · Q3 launch readout',
    domain: 'launch readout',
    claims: [
      { id: 'a', text: '4,820 signups in the first 7 days against a 3,500 target.',                 verdict: 'C', explain: 'KPI sheet confirms. Numbers match the signup tracker; factually correct.' },
      { id: 'b', text: '6.1% conversion — best-in-class for SaaS launches in this category.',      verdict: 'O', explain: 'Best-in-class claim has no benchmark on file. Marketing copy posing as a fact.' },
      { id: 'c', text: 'Legal blocks: case-study email pending one redline on customer name use.',  verdict: 'V', explain: 'Trace to legal-thread.md, row 18 — reviewer can confirm the redline in a click.' },
      { id: 'd', text: 'Ask: GM signs off on the legal redline by Friday for Monday send.',         verdict: 'E', explain: 'One decision, one deadline, one named owner. Decision-grade ask.' },
    ],
  },
];

export function filterCoveScenarios(track: GenAITrack): CoveScenario[] {
  return COVE_DATASET.filter(c => c.track === 'both' || c.track === track);
}

// ─── PR3 · CompressionCompareCard dataset ────────────────────────────
// Each entry is one Claude draft summary the learner must classify as
// "generic compression" (just shorter) or "decision-grade" (drives the
// next action). Pre-authored proper English; no LLM at runtime.

import type { GenAITrack } from '@/components/genaiTypes';

export type CompressionAnswer = 'generic' | 'decision';

export type CompressionSummary = {
  id: string;
  track: GenAITrack | 'both';
  domain: string;     // e.g. "Pharmacy claim", "Ops exception", "Incident"
  prompt: string;     // shown in the user-prompt bubble
  text: string;       // Claude's draft
  answer: CompressionAnswer;
  explain: string;
};

export const COMPRESSION_DATASET: CompressionSummary[] = [
  // ─── Engineer ─────────────────────────────────────────────────────
  { id: 'eng-c1', track: 'engineer', domain: 'Pharmacy claim',
    prompt: 'Summarise claim #A2241 for the triage queue.',
    text: 'The case concerns a pharmacy benefit claim submitted on 14 March. There are several policy considerations that may be relevant. The claim has been flagged for review by the system.',
    answer: 'generic',
    explain: 'No action, no urgency, no decision frame — an analyst reads this and still has to decide everything.' },
  { id: 'eng-c2', track: 'engineer', domain: 'Pharmacy claim',
    prompt: 'Summarise claim #A2241 for the triage queue.',
    text: 'Category: Disputed pharmacy benefit. Action: Escalate to pharmacy review — physician override requested, 48h SLA. Urgency: High. Key factor: amendment clause 4.2c absent from pipeline.',
    answer: 'decision',
    explain: 'Every sentence serves a decision: category, action, deadline, blocking factor. Nothing for the reader to re-derive.' },
  { id: 'eng-c3', track: 'engineer', domain: 'Pharmacy claim',
    prompt: 'Summarise claim #A2241 for the triage queue.',
    text: 'Claim #A2241 has been processed. The relevant policy documents were reviewed and a summary was generated. Several factors were identified that may affect the outcome of the claim.',
    answer: 'generic',
    explain: '"May affect" and "several factors" are content-free — pure compression, zero decision grade.' },
  { id: 'eng-c4', track: 'engineer', domain: 'Incident',
    prompt: 'Summarise INC-2024-118 for the on-call brief.',
    text: 'An incident occurred on the authentication service. The team responded according to standard procedures. The situation has been resolved and services are operating normally again.',
    answer: 'generic',
    explain: 'No cause, no MTTR, no impact numbers — the next on-call learns nothing actionable from this.' },
  { id: 'eng-c5', track: 'engineer', domain: 'Incident',
    prompt: 'Summarise INC-2024-118 for the on-call brief.',
    text: 'INC-2024-118 (14:22 UTC): auth-db pool exhausted, MTTR 47m, 12,400 users impacted. Action items: raise pool ceiling to 200; add saturation alert at 80%; owner @platform; due Friday.',
    answer: 'decision',
    explain: 'Time, cause, impact, three named action items with owner and due date — everything the next reader needs to act on.' },
  { id: 'eng-c6', track: 'engineer', domain: 'Pull-request review',
    prompt: 'Summarise PR-1402 for the reviewer.',
    text: 'A pull request has been opened against the authentication module. The change introduces modifications to several files. The author has provided a description and tests have been written.',
    answer: 'generic',
    explain: 'Doesn’t say what changed, why, or what to focus on — pure label compression.' },
  { id: 'eng-c7', track: 'engineer', domain: 'Pull-request review',
    prompt: 'Summarise PR-1402 for the reviewer.',
    text: 'PR-1402 changes the token-refresh path: drops 7d token TTL for sliding 24h. Risk: existing mobile sessions will force re-login on deploy. Test: `auth/token.test.ts` extended; manual smoke needed on iOS.',
    answer: 'decision',
    explain: 'Reader knows exactly what to inspect, what the risk is, and what to manually re-run before approving.' },

  // ─── Builder ──────────────────────────────────────────────────────
  { id: 'b-c1', track: 'builder', domain: 'Ops exception',
    prompt: 'Brief the regional director on this week’s exceptions.',
    text: 'This week had 23 exceptions across the portfolio. Several items were flagged for follow-up. The team is continuing to monitor the backlog.',
    answer: 'generic',
    explain: '"Several items" and "continuing to monitor" tell the director nothing actionable — status update, not a brief.' },
  { id: 'b-c2', track: 'builder', domain: 'Ops exception',
    prompt: 'Brief the regional director on this week’s exceptions.',
    text: 'Director attention needed: 2 of 23 exceptions exceed SLA (#4412, #7089). Recommend same-day review before Friday close. Remaining 21 within tolerance — no action needed.',
    answer: 'decision',
    explain: 'Two exceptions named, action stated, deadline given, the rest explicitly cleared. The director reads one line and knows what to do.' },
  { id: 'b-c3', track: 'builder', domain: 'Ops exception',
    prompt: 'Brief the regional director on this week’s exceptions.',
    text: 'The exception review for the week has been completed. Analysts have reviewed the items and made notes where applicable. Some items may require director-level attention.',
    answer: 'generic',
    explain: '"May require" and "where applicable" are evasions — the director reads it and finds nothing to act on.' },
  { id: 'b-c4', track: 'builder', domain: 'Campaign launch',
    prompt: 'Summarise the Q3 launch readout for the GM.',
    text: 'The Q3 launch went live last week. Several teams contributed. The marketing campaign reached audiences and generated activity across channels.',
    answer: 'generic',
    explain: '"Activity across channels" and "reached audiences" are empty — no numbers, no decisions, no next step.' },
  { id: 'b-c5', track: 'builder', domain: 'Campaign launch',
    prompt: 'Summarise the Q3 launch readout for the GM.',
    text: 'Q3 launch: 4,820 signups vs 3,500 target (+38%). Conversion 6.1% (target 4%). One ask: legal is blocking the case-study email — needs your green light by Friday.',
    answer: 'decision',
    explain: 'Two numbers above target, one explicit blocker, one named decision the GM must make by Friday.' },
  { id: 'b-c6', track: 'builder', domain: 'Renewal prep',
    prompt: 'Prep the AE for the Meridian renewal call.',
    text: 'Meridian is a longstanding customer. Their account has been reviewed and various aspects of their usage have been analysed. The team will be reaching out shortly.',
    answer: 'generic',
    explain: 'No usage trend, no risk flag, no asks — the AE walks in knowing nothing new.' },
  { id: 'b-c7', track: 'builder', domain: 'Renewal prep',
    prompt: 'Prep the AE for the Meridian renewal call.',
    text: 'Meridian renewal · 14/20 seats active, WAU 0.71, 3 open tickets. Risk: champion left in Q2. Ask: floor on price, push for a 2-year multi-product expansion.',
    answer: 'decision',
    explain: 'Adoption numbers + named risk + clear ask. AE walks into the call knowing exactly what to push for.' },
  { id: 'b-c8', track: 'builder', domain: 'Board update',
    prompt: 'Write the weekly board update lead-in.',
    text: 'This was an active week across product and growth. The team made meaningful progress on several fronts and continues to focus on the priorities for the quarter.',
    answer: 'generic',
    explain: 'Three "active / meaningful / focus" phrases that together mean nothing — board updates can’t carry decoration.' },
];

export function filterCompressionSummaries(track: GenAITrack): CompressionSummary[] {
  return COMPRESSION_DATASET.filter(s => s.track === 'both' || s.track === track);
}

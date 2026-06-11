// ─── PR3 · AudienceDraftCard dataset ─────────────────────────────────
// Each scenario is one source synthesis with 3 audience-targeted
// rewrites. Picker swaps the synthesis. Tabs swap the audience.

import type { GenAITrack } from '@/components/genaiTypes';

export type Audience = {
  id: string;
  label: string;
  subtitle: string;
  color: string;
  brief: string;
  why: string;
};

export type AudienceScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;        // dropdown label
  synthesis: string;    // source-of-truth facts shown above the tabs
  audiences: Audience[];
};

export const AUDIENCE_DATASET: AudienceScenario[] = [
  {
    id: 'eng-pharmacy-override',
    track: 'engineer',
    label: 'Engineer · pharmacy override',
    synthesis: 'Claim #A2241: pharmacy override request by Dr. Mehta. §4.2c (Feb 2022 amendment) permits Tier 2 CA override. 48h SLA. 3 precedent approvals in Q4. Amendment not in current policy index.',
    audiences: [
      { id: 'worker',     label: 'Case Worker',        subtitle: 'executes the call',     color: '#22D3EE', brief: 'Escalate Claim #A2241 to pharmacy review. Form: PH-7. Deadline: Thursday 5pm. Note §4.2c in submission — amendment clause, not in standard index.', why: 'Action + form + deadline, nothing else. The case worker executes — they don’t need context or patterns.' },
      { id: 'compliance', label: 'Compliance Officer', subtitle: 'audits the decision',   color: '#A78BFA', brief: 'Override request under §4.2c (Feb 2022 amendment). CA-only provision. 3 precedent approvals on file. Audit trail: case note #A2241. Amendment currently unindexed — gap in standard policy lookup.', why: 'Clause, provision, audit trail, gap. The compliance lens is: is this defensible? is it documented?' },
      { id: 'pm',         label: 'Product Manager',    subtitle: 'fixes the system',      color: '#60A5FA', brief: 'Override flow triggered 4× in Q4. Root cause: clause 4.2c (Feb 2022 amendment) not in policy index. Case workers escalating manually each time. Fix: index the amendment. Estimated 12 affected cases/month.', why: 'Pattern + root cause + fix. Same synthesis, different question: "where does the system break and what do we build?"' },
    ],
  },
  {
    id: 'build-ops-exception',
    track: 'builder',
    label: 'Builder · weekly ops exceptions',
    synthesis: 'Week of Mar 10: 23 exceptions, 2 SLA breaches (#4412: 6d, #7089: 8d), 19 within tolerance, 2 pending close EOW. #4412 is third breach in 6 weeks.',
    audiences: [
      { id: 'analyst',  label: 'Team Analyst',     subtitle: 'works the queue',     color: '#22D3EE', brief: '#4412 (6d over SLA) and #7089 (8d): both need case notes before Thursday noon. Check escalation history for each. #4412 is a repeat breach — flag for supervisor review.', why: 'Specific accounts, specific tasks, specific deadline. The analyst executes — they need exact next steps.' },
      { id: 'director', label: 'Regional Director', subtitle: 'decides before the call', color: '#A78BFA', brief: 'Action needed before Friday: #4412 and #7089 exceed SLA — board visibility risk if unresolved. Recommend you flag to ops lead today. Other 21 exceptions within tolerance — no action needed from you.', why: 'One decision. Clear risk. Explicit "no action needed" for everything else. Director doesn’t need account details.' },
      { id: 'oplead',   label: 'Operations Lead',   subtitle: 'spots the systemic issue', color: '#10B981', brief: 'SLA breach rate: 2/23 (8.7%) vs 3.2% baseline. #4412: third breach in 6 weeks — systemic flag. Recommend root-cause review for that account before next reporting cycle.', why: 'Trend + baseline + systemic flag. Ops lens is: "is this a one-off or a process problem?"' },
    ],
  },
  {
    id: 'eng-incident',
    track: 'engineer',
    label: 'Engineer · incident comms',
    synthesis: 'INC-2024-118 · 14:22 UTC: auth-db pool saturated · 47-min MTTR · 12,400 users impacted · pool ceiling at 100 vs peak demand 142 · saturation alert never fired.',
    audiences: [
      { id: 'oncall', label: 'On-call engineer',   subtitle: 'closes the loop',       color: '#22D3EE', brief: 'INC-2024-118 closed. Raise auth-db pool ceiling to 200 in `auth/config.yaml`. Wire saturation alert at 80%. Patch + alert by EOD; tag @platform on the PR.', why: 'Two concrete files to touch + one deadline. The on-call doesn’t need narrative — they need the patch path.' },
      { id: 'product', label: 'Product Manager',   subtitle: 'frames the customer story', color: '#A78BFA', brief: 'Auth outage on 4 March affected 12,400 users for 47 minutes. Fix landed same-day; saturation alert added so the same shape paged us at 80% next time. No customer action needed.', why: 'Tone is reassuring + factual. No internals, no jargon — what a status-page reader needs to feel covered.' },
      { id: 'cto', label: 'CTO',                   subtitle: 'judges systemic risk',  color: '#60A5FA', brief: 'Saturation alert was provisioned but disabled. Two other services share the same pattern. Recommend an audit of all "configured-but-disabled" critical alerts before the next quarter.', why: 'Generalises one outage into a class of risk. The CTO doesn’t need this incident — they need the policy delta.' },
    ],
  },
  {
    id: 'build-renewal',
    track: 'builder',
    label: 'Builder · Meridian renewal',
    synthesis: 'Meridian Corp · renews Mar 24 · 14/20 seats active · WAU 0.71 · champion left in Q2 · 3 open tickets (TKT-441, 503, 512) · expansion deal on the table.',
    audiences: [
      { id: 'ae', label: 'Account Executive',  subtitle: 'runs the call',         color: '#22D3EE', brief: 'Meridian renewal call: open with the 3 open tickets — show urgency to resolve. Ask: 2-yr extension at current price + expansion to Reports module. Risk: champion left in Q2, so build rapport with new lead Sara.', why: 'Three concrete moves the AE makes inside the call. No backstory — they already know the account.' },
      { id: 'csm', label: 'Customer Success',  subtitle: 'protects the relationship', color: '#A78BFA', brief: 'Health check before renewal: schedule a sync with new champion Sara within 7 days. Walk through the 3 open tickets and get verbal commitment that none of them blocks renewal sign-off.', why: 'CSM cares about trust, not commercials. Two named meetings, one concrete artefact.' },
      { id: 'finance', label: 'Finance',       subtitle: 'sees the numbers',      color: '#60A5FA', brief: 'Meridian renewal · current ARR $84k · floor for renewal $80k · upside with expansion +$22k. Risk-adjusted close probability 70% (champion left Q2). Renewal date 24 March.', why: 'Numbers only. Floor, upside, probability. The finance lens is "what do I commit to in the forecast?"' },
    ],
  },
  {
    id: 'eng-pr-review',
    track: 'engineer',
    label: 'Engineer · PR-1402 audiences',
    synthesis: 'PR-1402: drops 7d token TTL for sliding 24h · auth/token.ts + auth/refresh.ts · auth/token.test.ts:42 expects 7d (broken) · mobile sessions forced re-login on deploy.',
    audiences: [
      { id: 'author', label: 'PR author',       subtitle: 'fixes the failing test', color: '#22D3EE', brief: 'Two things before this can land: (1) update `auth/token.test.ts:42` to assert sliding-24h behaviour; (2) add a one-line note in `auth/refresh.ts` calling out the deploy-day re-login. Reviewer @raj.', why: 'A list of concrete edits with file paths and a reviewer tag. Author opens the PR and knows the next two commits.' },
      { id: 'reviewer', label: 'Reviewer',     subtitle: 'judges risk',           color: '#A78BFA', brief: 'Read the diff in `auth/token.ts` first — the TTL change is the real risk. Smoke iOS on staging before approving. The test failure is expected and tracked by the author.', why: 'Reviewer doesn’t need to walk the whole diff — they need the load-bearing line and the one risk to verify.' },
      { id: 'release', label: 'Release manager', subtitle: 'plans the rollout',    color: '#60A5FA', brief: 'PR-1402 will force re-login on rollout for mobile users. Stage during the low-traffic window (Sun 04:00 UTC). Have status-page comms drafted in case the re-login spike paginates support.', why: 'A timing decision + a comms contingency. Release manager owns the day, not the diff.' },
    ],
  },
];

export function filterAudienceScenarios(track: GenAITrack): AudienceScenario[] {
  return AUDIENCE_DATASET.filter(s => s.track === 'both' || s.track === track);
}

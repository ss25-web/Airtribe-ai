// ─── PR1 · UseCaseReadinessCard dataset ───────────────────────────────
// Each entry is one "build-first triage": a real-world AI use case with
// three concrete candidates the team is debating. For each candidate we
// hand-author the verdict + the five readiness rows (language, bounded,
// verify, recover, observe).
//
// The card lets the learner pick a domain, then walks them through the
// same Linear-style triage UX they already have — but on a fresh set of
// candidates each time. All content is pre-authored proper English; no
// LLM calls at runtime.

import type { GenAITrack } from '@/components/genaiTypes';

export type CriterionKey = 'language' | 'bounded' | 'verify' | 'recover' | 'observe';
export type Outcome = { pass: boolean; note: string };
export type Verdict = 'Build first' | 'Wait — needs review step' | 'Don’t build';

export type ReadinessCandidate = {
  id: 'auto' | 'review' | 'autonomous';
  label: string;
  blurb: string;
  verdict: Verdict;
  verdictColor: string;
  rows: Record<CriterionKey, Outcome>;
};

export type ReadinessTriage = {
  id: string;
  track: GenAITrack | 'both';
  domain: string;
  label: string;          // dropdown label
  workContext: string;    // short context line shown above the candidates
  candidates: ReadinessCandidate[];
};

const COLOR_GO    = '#16A34A';
const COLOR_WAIT  = '#D97706';
const COLOR_STOP  = '#DC2626';

export const READINESS_DATASET: ReadinessTriage[] = [
  // ─── 1 · Engineer · health-insurance exception triage (the canonical one) ──
  {
    id: 'health-exception',
    track: 'engineer',
    domain: 'Health insurance',
    label: 'Engineer · health-insurance exception triage',
    workContext: 'Northstar Health has a backlog of provider exception requests. Where should AI plug in?',
    candidates: [
      {
        id: 'auto',
        label: 'Auto-approve routine exceptions at >80% confidence',
        blurb: 'Biggest headline ROI. No human in the loop. Confidence threshold gates the action.',
        verdict: 'Don’t build', verdictColor: COLOR_STOP,
        rows: {
          language: { pass: false, note: 'Approval requires policy + claim record. That’s a lookup, not language work.' },
          bounded:  { pass: false, note: 'Output is an irreversible decision on a live case.' },
          verify:   { pass: false, note: 'Nobody reads correct approvals — wrong ones are invisible.' },
          recover:  { pass: false, note: 'Wrong approval routes through downstream systems silently.' },
          observe:  { pass: false, note: 'You see headline volume, not the failure pattern.' },
        },
      },
      {
        id: 'review',
        label: 'Classify case requests + flag low-confidence for human review',
        blurb: 'Model suggests a category. Human confirms anything uncertain. Tickets land in the right queue.',
        verdict: 'Build first', verdictColor: COLOR_GO,
        rows: {
          language: { pass: true,  note: 'Reading a request and assigning a label is pure language work.' },
          bounded:  { pass: true,  note: 'Output is one label from a small set — not an action.' },
          verify:   { pass: true,  note: 'A reviewer can confirm or override a label in seconds.' },
          recover:  { pass: true,  note: 'Wrong labels are caught at review before anything routes.' },
          observe:  { pass: true,  note: 'You log every disagreement — that’s your failure-mode dataset.' },
        },
      },
      {
        id: 'autonomous',
        label: 'Autonomous intake agent: monitor, route, act',
        blurb: 'Long-running agent watches the queue and takes action without checkpoints.',
        verdict: 'Don’t build', verdictColor: COLOR_STOP,
        rows: {
          language: { pass: false, note: 'Routing decisions touch live system state — not in the prompt.' },
          bounded:  { pass: false, note: 'Multi-step actions, not a single bounded output.' },
          verify:   { pass: false, note: 'A reviewer can’t reconstruct what the agent did across N steps.' },
          recover:  { pass: false, note: 'Side-effects from step 3 are live by the time step 7 fails.' },
          observe:  { pass: false, note: 'Compound failure modes — hard to attribute which step went wrong.' },
        },
      },
    ],
  },

  // ─── 2 · Builder · health-insurance escalation (the canonical builder one) ──
  {
    id: 'health-escalation',
    track: 'builder',
    domain: 'Health insurance',
    label: 'Builder · health escalation triage',
    workContext: 'Northstar Health’s ops team gets 200+ escalations a day. Where does AI add real leverage?',
    candidates: [
      {
        id: 'auto',
        label: 'Auto-resolve routine exceptions at >80% confidence',
        blurb: 'Biggest headcount story. No human in the loop. Confidence score gates the action.',
        verdict: 'Don’t build', verdictColor: COLOR_STOP,
        rows: {
          language: { pass: false, note: 'Resolving an exception needs policy + case data the model can’t see.' },
          bounded:  { pass: false, note: 'The output is a real action affecting the submitter — not just text.' },
          verify:   { pass: false, note: 'Nobody reads correct resolutions; wrong ones surface only downstream.' },
          recover:  { pass: false, note: 'A wrong resolution notice is hard to walk back.' },
          observe:  { pass: false, note: 'You see how many got resolved — not how many got resolved wrong.' },
        },
      },
      {
        id: 'review',
        label: 'Classify escalations + flag low-confidence for human review',
        blurb: 'Model suggests a category and urgency. A reviewer confirms anything uncertain before it routes.',
        verdict: 'Build first', verdictColor: COLOR_GO,
        rows: {
          language: { pass: true,  note: 'Reading an escalation and assigning a category is language work.' },
          bounded:  { pass: true,  note: 'Output is one label — bounded, not an action.' },
          verify:   { pass: true,  note: 'A reviewer can confirm or correct in under a minute.' },
          recover:  { pass: true,  note: 'Wrong labels caught at the review step before routing.' },
          observe:  { pass: true,  note: 'Every reviewer correction is data on where the model fails.' },
        },
      },
      {
        id: 'autonomous',
        label: 'AI drafts complaint responses sent after a 30-sec spot check',
        blurb: 'AI writes the reply, an assistant glances, then it goes out the door.',
        verdict: 'Wait — needs review step', verdictColor: COLOR_WAIT,
        rows: {
          language: { pass: true,  note: 'Drafting a reply from a complaint description is language work.' },
          bounded:  { pass: true,  note: 'Output is a draft — bounded.' },
          verify:   { pass: false, note: '30-second spot checks miss tone errors and factual drift.' },
          recover:  { pass: false, note: 'A bad reply is already in the provider’s inbox.' },
          observe:  { pass: false, note: 'You won’t see the bad drafts that slipped through.' },
        },
      },
    ],
  },

  // ─── 3 · Builder · customer-support knowledge base ──
  {
    id: 'support-helpdesk',
    track: 'builder',
    domain: 'Customer support',
    label: 'Customer support · helpdesk inbox',
    workContext: 'Your SaaS helpdesk handles 4,000 tickets/week. Three options on the table for AI.',
    candidates: [
      {
        id: 'auto',
        label: 'Auto-reply to "common" tickets and auto-close them',
        blurb: 'The fastest deflection story. Closes tickets without a human touching them.',
        verdict: 'Don’t build', verdictColor: COLOR_STOP,
        rows: {
          language: { pass: true,  note: 'Drafting a reply from a ticket text is language work.' },
          bounded:  { pass: false, note: 'Auto-closing a ticket is an action — irreversible from the customer’s side.' },
          verify:   { pass: false, note: 'Nobody re-reads closed tickets unless the customer complains again.' },
          recover:  { pass: false, note: 'A wrong-and-closed ticket is a churn signal, not a typo.' },
          observe:  { pass: false, note: 'You see deflection rate, not how many got deflected wrongly.' },
        },
      },
      {
        id: 'review',
        label: 'Suggest the top 3 KB articles to the agent on each new ticket',
        blurb: 'Agent keeps the keyboard. AI surfaces likely matches from the help-centre corpus.',
        verdict: 'Build first', verdictColor: COLOR_GO,
        rows: {
          language: { pass: true,  note: 'Matching ticket text to KB titles is text-to-text.' },
          bounded:  { pass: true,  note: 'Output is at most three article links — small bounded set.' },
          verify:   { pass: true,  note: 'Agent sees the suggestions and the ticket — match-quality is one glance.' },
          recover:  { pass: true,  note: 'Wrong suggestions cost a second; nothing leaves the support tool.' },
          observe:  { pass: true,  note: 'Click-through on suggestions is the failure-mode signal.' },
        },
      },
      {
        id: 'autonomous',
        label: 'Autonomous AI agent: read, classify, reply, close — no human',
        blurb: 'Fully unattended. The "deflection bot" the exec deck has been asking for.',
        verdict: 'Don’t build', verdictColor: COLOR_STOP,
        rows: {
          language: { pass: true,  note: 'Reading and replying is language work.' },
          bounded:  { pass: false, note: 'Reply + close is a multi-step action chain.' },
          verify:   { pass: false, note: 'Nobody re-reads closed tickets.' },
          recover:  { pass: false, note: 'A wrong-and-closed ticket is a churn event.' },
          observe:  { pass: false, note: 'Quality drift in unattended replies is invisible until customers leave.' },
        },
      },
    ],
  },

  // ─── 4 · Builder · marketing content ──
  {
    id: 'marketing-content',
    track: 'builder',
    domain: 'Marketing',
    label: 'Marketing · campaign content engine',
    workContext: 'Marketing wants to use AI to scale weekly campaign output. Three ideas on the wall.',
    candidates: [
      {
        id: 'auto',
        label: 'Auto-publish AI-written social posts on the brand handle',
        blurb: 'No human in the loop. Schedules posts to LinkedIn and X directly from the AI draft.',
        verdict: 'Don’t build', verdictColor: COLOR_STOP,
        rows: {
          language: { pass: true,  note: 'Writing a social post is language work.' },
          bounded:  { pass: false, note: 'A live post on the brand handle is a real-world action.' },
          verify:   { pass: false, note: 'Brand voice errors only show up when the post goes viral the wrong way.' },
          recover:  { pass: false, note: 'A bad post can be deleted but the screenshot lives forever.' },
          observe:  { pass: false, note: 'You measure reach, not "how many off-brand posts slipped through".' },
        },
      },
      {
        id: 'review',
        label: 'Draft three social-post variants for an editor to pick + tweak',
        blurb: 'AI generates three options. The editor picks one, edits, then schedules.',
        verdict: 'Build first', verdictColor: COLOR_GO,
        rows: {
          language: { pass: true,  note: 'Drafting copy is pure language work.' },
          bounded:  { pass: true,  note: 'Three variants — small, bounded output set.' },
          verify:   { pass: true,  note: 'Editor reads the three variants — picks or rewrites in seconds.' },
          recover:  { pass: true,  note: 'Nothing publishes without the editor’s click.' },
          observe:  { pass: true,  note: 'You see which variant got picked vs rejected — that’s a quality signal.' },
        },
      },
      {
        id: 'autonomous',
        label: 'Long-running agent: plan a whole campaign, write it, schedule it',
        blurb: 'Months of campaign work compressed to one prompt. Agent owns the calendar.',
        verdict: 'Don’t build', verdictColor: COLOR_STOP,
        rows: {
          language: { pass: true,  note: 'The drafting parts are language work.' },
          bounded:  { pass: false, note: 'A whole campaign is many actions across many surfaces.' },
          verify:   { pass: false, note: 'A reviewer can’t mentally diff a whole campaign plan against brand.' },
          recover:  { pass: false, note: 'Bad creative is in market by the time anyone notices.' },
          observe:  { pass: false, note: 'You see scheduled posts, not the why of each decision.' },
        },
      },
    ],
  },

  // ─── 5 · Engineer · code review automation ──
  {
    id: 'code-review',
    track: 'engineer',
    domain: 'Code review',
    label: 'Engineering · pull-request review',
    workContext: 'The platform team wants to use AI to take pressure off PR review at scale.',
    candidates: [
      {
        id: 'auto',
        label: 'Auto-merge AI-approved PRs that pass tests',
        blurb: 'The boldest move. AI reads the diff, decides if it looks fine, merges if green.',
        verdict: 'Don’t build', verdictColor: COLOR_STOP,
        rows: {
          language: { pass: true,  note: 'Reading code is language work.' },
          bounded:  { pass: false, note: 'A merge is an action against main — not a bounded text output.' },
          verify:   { pass: false, note: 'A wrong-but-passing PR isn’t spotted until something on-call pages.' },
          recover:  { pass: false, note: 'Reverts are noisy and don’t undo downstream deploys cleanly.' },
          observe:  { pass: false, note: 'You see merge throughput, not silent regressions seeded in.' },
        },
      },
      {
        id: 'review',
        label: 'AI posts an inline review comment on every PR — author + reviewer see it',
        blurb: 'AI suggestions show up like a teammate’s comment. The human still presses Merge.',
        verdict: 'Build first', verdictColor: COLOR_GO,
        rows: {
          language: { pass: true,  note: 'Comments on a diff are pure text-to-text.' },
          bounded:  { pass: true,  note: 'Output is a small list of comments — bounded, no actions.' },
          verify:   { pass: true,  note: 'Author and reviewer judge the comment quality in seconds.' },
          recover:  { pass: true,  note: 'Bad comments are ignored — no downstream effect.' },
          observe:  { pass: true,  note: 'Acceptance/rejection of comments is your quality signal.' },
        },
      },
      {
        id: 'autonomous',
        label: 'AI agent that drafts the PR, reviews it, and rebases on conflicts',
        blurb: 'A long-running agent owns the patch from ticket to merge — almost zero human time.',
        verdict: 'Wait — needs review step', verdictColor: COLOR_WAIT,
        rows: {
          language: { pass: true,  note: 'Writing code is language work.' },
          bounded:  { pass: false, note: 'Multi-step agent work touches many files, branches, commits.' },
          verify:   { pass: false, note: 'A reviewer can’t cleanly diff what the agent did across N rebases.' },
          recover:  { pass: false, note: 'Some commits may already be in shared branches before review.' },
          observe:  { pass: false, note: 'Hard to attribute which step in the chain broke the test.' },
        },
      },
    ],
  },

  // ─── 6 · Engineer · log triage / SRE ──
  {
    id: 'log-triage',
    track: 'engineer',
    domain: 'Site reliability',
    label: 'SRE · log + alert triage',
    workContext: 'On-call gets 60 noisy alerts a night. Where can AI cut signal vs noise?',
    candidates: [
      {
        id: 'auto',
        label: 'Auto-resolve alerts the model classifies as "noise"',
        blurb: 'AI silences anything below a confidence threshold without paging anyone.',
        verdict: 'Don’t build', verdictColor: COLOR_STOP,
        rows: {
          language: { pass: true,  note: 'Reading an alert payload is language work.' },
          bounded:  { pass: false, note: 'Silencing an alert is an action — and a real outage might be the next one.' },
          verify:   { pass: false, note: 'Nobody re-reads silenced alerts.' },
          recover:  { pass: false, note: 'The recovery path is "you missed the outage" — too late.' },
          observe:  { pass: false, note: 'You see silenced count, not silenced-but-was-real count.' },
        },
      },
      {
        id: 'review',
        label: 'Cluster the night’s alerts into incident-likely groups for the on-call',
        blurb: 'AI groups noisy alerts by likely root cause. On-call reads the summary, decides.',
        verdict: 'Build first', verdictColor: COLOR_GO,
        rows: {
          language: { pass: true,  note: 'Reading + summarising alert payloads is language work.' },
          bounded:  { pass: true,  note: 'Output is a small clustered list — bounded text.' },
          verify:   { pass: true,  note: 'On-call sees both the cluster and the raw alerts — easy to spot bad grouping.' },
          recover:  { pass: true,  note: 'Wrong grouping costs a click; on-call still sees the originals.' },
          observe:  { pass: true,  note: 'On-call corrections of bad clusters are a clean training signal.' },
        },
      },
      {
        id: 'autonomous',
        label: 'AI agent: detect, restart the service, post to the incident channel',
        blurb: 'Agent reads alerts, decides to bounce the deployment, and notifies humans afterwards.',
        verdict: 'Don’t build', verdictColor: COLOR_STOP,
        rows: {
          language: { pass: false, note: 'Restarting prod is a side-effect, not a text output.' },
          bounded:  { pass: false, note: 'The action chain touches infra you can’t take back.' },
          verify:   { pass: false, note: 'On-call only sees the agent’s post — not the decision graph.' },
          recover:  { pass: false, note: 'A wrong restart can extend the very outage you’re trying to fix.' },
          observe:  { pass: false, note: 'Compound failure modes across detection + action.' },
        },
      },
    ],
  },

  // ─── 7 · Builder · sales outreach ──
  {
    id: 'sales-outreach',
    track: 'builder',
    domain: 'Sales outreach',
    label: 'Sales · outbound prospecting',
    workContext: 'The SDR team wants AI to write personalised outbound at scale. Three options.',
    candidates: [
      {
        id: 'auto',
        label: 'Auto-send AI-written cold emails to top-of-funnel leads',
        blurb: 'No human in the loop. AI personalises from CRM and fires.',
        verdict: 'Don’t build', verdictColor: COLOR_STOP,
        rows: {
          language: { pass: true,  note: 'Drafting a cold email is text-to-text.' },
          bounded:  { pass: false, note: 'A sent email is a real-world action on a relationship.' },
          verify:   { pass: false, note: 'Nobody reads sent emails unless someone complains.' },
          recover:  { pass: false, note: 'A bad email is in the prospect’s inbox — bad first touch is final.' },
          observe:  { pass: false, note: 'You see reply rate, not how many off-brand emails went out.' },
        },
      },
      {
        id: 'review',
        label: 'Draft 5 personalised email variants — SDR picks and sends',
        blurb: 'SDR keeps the keyboard. AI just removes the staring-at-a-blank-page tax.',
        verdict: 'Build first', verdictColor: COLOR_GO,
        rows: {
          language: { pass: true,  note: 'Drafting is pure language work.' },
          bounded:  { pass: true,  note: 'Five drafts — bounded output set.' },
          verify:   { pass: true,  note: 'SDR reads the drafts in seconds; picks or rewrites.' },
          recover:  { pass: true,  note: 'No email leaves without the SDR’s click.' },
          observe:  { pass: true,  note: 'Pick-vs-discard ratio is your quality signal.' },
        },
      },
      {
        id: 'autonomous',
        label: 'AI agent: identify leads, draft emails, follow up, book meetings',
        blurb: 'A "digital SDR" running on its own calendar.',
        verdict: 'Don’t build', verdictColor: COLOR_STOP,
        rows: {
          language: { pass: true,  note: 'Drafting is language work.' },
          bounded:  { pass: false, note: 'Multi-step agent work touches the CRM, calendar, and inbox.' },
          verify:   { pass: false, note: 'Nobody re-reads the chain unless a prospect complains.' },
          recover:  { pass: false, note: 'A bad chain trains the prospect that your brand is spammy.' },
          observe:  { pass: false, note: 'Quality issues only show up as falling reply rates weeks later.' },
        },
      },
    ],
  },

  // ─── 8 · Both · meeting summarisation ──
  {
    id: 'meeting-summary',
    track: 'both',
    domain: 'Meeting summaries',
    label: 'Meetings · note + action-item assistant',
    workContext: 'The platform team is wiring an AI assistant into Zoom + Meet. Where does it sit?',
    candidates: [
      {
        id: 'auto',
        label: 'Auto-file action items as Jira tickets straight from the meeting transcript',
        blurb: 'No human review. The model decides what’s an action item and what isn’t.',
        verdict: 'Don’t build', verdictColor: COLOR_STOP,
        rows: {
          language: { pass: true,  note: 'Reading a transcript and proposing action items is language work.' },
          bounded:  { pass: false, note: 'A filed Jira ticket is a real-world action on the team’s backlog.' },
          verify:   { pass: false, note: 'Nobody re-reads auto-filed tickets unless a sprint goes sideways.' },
          recover:  { pass: false, note: 'Bad tickets pollute the backlog and the team’s trust in the system.' },
          observe:  { pass: false, note: 'You see ticket count, not how many were spurious.' },
        },
      },
      {
        id: 'review',
        label: 'Draft a summary + suggested action items — the meeting owner edits before posting',
        blurb: 'AI gives a starter. The owner edits and confirms before anything ships.',
        verdict: 'Build first', verdictColor: COLOR_GO,
        rows: {
          language: { pass: true,  note: 'Summarisation is pure language work.' },
          bounded:  { pass: true,  note: 'Output is a small structured doc.' },
          verify:   { pass: true,  note: 'Owner attended the meeting — they can spot drift in one read.' },
          recover:  { pass: true,  note: 'Nothing leaves the doc without the owner’s click.' },
          observe:  { pass: true,  note: 'Owner edits are the failure-mode dataset.' },
        },
      },
      {
        id: 'autonomous',
        label: 'AI agent: join every meeting, summarise, file tickets, schedule the follow-ups',
        blurb: 'A persistent assistant on every call, owning the back-office workflow downstream.',
        verdict: 'Wait — needs review step', verdictColor: COLOR_WAIT,
        rows: {
          language: { pass: true,  note: 'Summarising is language work.' },
          bounded:  { pass: false, note: 'Filing tickets + scheduling are multi-step actions.' },
          verify:   { pass: false, note: 'No one person attended every meeting — verification is impossible at scale.' },
          recover:  { pass: false, note: 'Bad follow-ups are already in calendars by the time anyone notices.' },
          observe:  { pass: false, note: 'Hard to attribute which step in the chain caused the wrong outcome.' },
        },
      },
    ],
  },

  // ─── 9 · Engineer · data-pipeline observability ──
  {
    id: 'data-pipeline',
    track: 'engineer',
    domain: 'Data engineering',
    label: 'Data · pipeline failure triage',
    workContext: 'The data platform is buckling under nightly job failures. Where should AI plug in?',
    candidates: [
      {
        id: 'auto',
        label: 'Auto-retry failed jobs the model labels as "transient"',
        blurb: 'No human in the loop. AI reads the error and decides whether to retry.',
        verdict: 'Don’t build', verdictColor: COLOR_STOP,
        rows: {
          language: { pass: true,  note: 'Reading a stack trace is language work.' },
          bounded:  { pass: false, note: 'Retrying a job in prod is a real-world action with side-effects.' },
          verify:   { pass: false, note: 'A retry that succeeds is invisible; a retry that compounds the failure isn’t.' },
          recover:  { pass: false, note: 'A bad retry can corrupt the dataset everyone reads from in the morning.' },
          observe:  { pass: false, note: 'You see retry counts, not the silent drift in the data they produced.' },
        },
      },
      {
        id: 'review',
        label: 'Summarise the failure + suggest a fix in the on-call channel — human applies',
        blurb: 'AI reads the trace and posts a one-line cause + suggested action. Engineer decides.',
        verdict: 'Build first', verdictColor: COLOR_GO,
        rows: {
          language: { pass: true,  note: 'Reading a stack trace and writing a one-liner is language work.' },
          bounded:  { pass: true,  note: 'Output is a short message — bounded.' },
          verify:   { pass: true,  note: 'Engineer compares the suggestion to the raw trace in seconds.' },
          recover:  { pass: true,  note: 'Bad suggestions are ignored — no downstream effect.' },
          observe:  { pass: true,  note: 'Acceptance/rejection of suggestions is your quality signal.' },
        },
      },
      {
        id: 'autonomous',
        label: 'AI agent: read failure, patch the SQL, redeploy the DAG',
        blurb: 'Full automation across detection + remediation, on prod data.',
        verdict: 'Don’t build', verdictColor: COLOR_STOP,
        rows: {
          language: { pass: false, note: 'SQL patching needs schema + warehouse state — not in the prompt.' },
          bounded:  { pass: false, note: 'A redeployed DAG is a multi-step action on prod data.' },
          verify:   { pass: false, note: 'No one diffs the agent’s patches against the raw trace at 2am.' },
          recover:  { pass: false, note: 'Wrong patches corrupt downstream tables many teams read from.' },
          observe:  { pass: false, note: 'Compound failure modes across detection + patch + deploy.' },
        },
      },
    ],
  },
];

export const READINESS_FALLBACK: ReadinessTriage = READINESS_DATASET[0];

export function filterReadinessByTrack(track: GenAITrack): ReadinessTriage[] {
  return READINESS_DATASET.filter(e => e.track === 'both' || e.track === track);
}

export const READINESS_CRITERIA: { key: CriterionKey; label: string; sub: string }[] = [
  { key: 'language', label: 'Language-based', sub: 'Text in, text out — no live data lookup.' },
  { key: 'bounded',  label: 'Bounded output', sub: 'A category, draft or summary — not a final action.' },
  { key: 'verify',   label: 'Easy to verify', sub: 'A human can spot a wrong output quickly.' },
  { key: 'recover',  label: 'Recoverable',    sub: 'Errors caught before they affect anything downstream.' },
  { key: 'observe',  label: 'Observable',     sub: 'You can see what the model gets wrong, not just right.' },
];

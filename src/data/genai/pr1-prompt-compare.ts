// ─── PR1 · PromptCompareCard dataset ──────────────────────────────────
// Each entry is a complete scenario showing the SAME task input run
// against a VAGUE prompt and a SPECIFIED prompt. The vague output drifts
// into generic filler; the specified output is structured and useful.
// Both responses are hand-authored real English. The card streams both
// side-by-side when the learner hits Run.

export type PromptCompareScenario = {
  id: string;
  domain: 'general' | 'engineering' | 'operations' | 'healthcare' | 'product';
  label: string;          // short human label for the scenario picker
  taskInput: string;      // the data the model sees in both runs
  vague: {
    prompt: string;       // the vague brief
    output: string;       // what the model returns to the vague brief
    verdict: string;      // one-line "why this drifts"
  };
  specific: {
    prompt: string;       // the specified brief (role + format + audience + length)
    output: string;       // what the model returns to the specified brief
    verdict: string;      // one-line "why this lands"
  };
};

export const PROMPT_COMPARE_DATASET: PromptCompareScenario[] = [
  {
    id: 'pc-claims-triage',
    domain: 'engineering',
    label: 'Claims case-note triage',
    taskInput: 'Patient: Sarah Donovan, 42F · Plan B Tier 2 · Treating physician Dr. Patel requested override for compounded pharmacy benefit; system rejected at $1,840 / 30 days. Last successful fill 2024-02-11. Reason for override: alternative dosage forms causing GI intolerance.',
    vague: {
      prompt: 'Summarise this case note.',
      output: 'The case note discusses a patient claim that was submitted. There are some issues that may need attention from the relevant team. Further review is recommended to determine the appropriate next steps.',
      verdict: 'No role, no format, no audience — model fills every missing dimension with generic filler.',
    },
    specific: {
      prompt: 'You are a claims triage assistant. Given the case note below, write a three-sentence summary covering: (1) category, (2) key action required, (3) urgency level. Use plain language for a case worker. No bullet points.',
      output: 'Category: Disputed pharmacy benefit — compounded medication override requested by treating physician. Action: Route to pharmacy review within 48 hours; documentation of GI intolerance to alternative dosages should accompany the override decision. Urgency: High — patient has been off the medication since 2024-02-11.',
      verdict: 'Role, format, length, and audience are named — the model has nothing left to invent.',
    },
  },
  {
    id: 'pc-ops-escalation',
    domain: 'operations',
    label: 'Provider credentialing escalation',
    taskInput: 'Provider: Dr. Mehta, Northstar West clinic. Credentialing exception submitted 11 days ago. Status: awaiting CMS verification. SLA: 14 days. Patient panel waiting for assignment: 28.',
    vague: {
      prompt: 'What should I do about this case?',
      output: 'Based on the information provided, there are several considerations for this case. The appropriate team should review the situation and determine next steps based on current policies and procedures.',
      verdict: 'Question is open-ended; no audience and no output shape — generic policy hand-wave.',
    },
    specific: {
      prompt: 'You are a healthcare operations assistant. Given the escalation below, write a two-sentence summary: one sentence stating the category, one sentence stating the recommended next step. Plain language. Maximum 60 words.',
      output: 'Category: Overdue credentialing exception — provider has been pending CMS verification for 11 of the 14 SLA days, blocking assignment of a 28-patient panel. Recommended next step: Assign to credentialing team with 24-hour SLA flag and notify the regional ops lead so the panel can be re-routed if the deadline slips.',
      verdict: 'Format and length pinned; the audience (ops lead) is implied by the recommendation shape.',
    },
  },
  {
    id: 'pc-discharge-summary',
    domain: 'healthcare',
    label: 'Discharge summary draft',
    taskInput: 'Admitted 2024-03-08 for community-acquired pneumonia. Treated with azithromycin + ceftriaxone, oxygen 2L NC, IV fluids. Discharge meds: azithromycin 250mg PO × 3 days, multivitamin daily, follow-up pulmonology in 2 weeks, return precautions: dyspnea at rest, fever > 38.5C, productive cough with blood.',
    vague: {
      prompt: 'Write a discharge note for this patient.',
      output: 'The patient was admitted and treated for their condition. They responded well to treatment and are ready for discharge. Follow up with the appropriate provider is recommended. Take medications as prescribed.',
      verdict: 'No state coverage, no return precautions, no medication detail — a clinically unsafe summary.',
    },
    specific: {
      prompt: 'You are a clinical documentation assistant. Given the discharge information below, write a discharge note in four labelled sections: 1) Primary diagnosis. 2) Discharge medications (name, dose, duration). 3) Follow-up appointments. 4) Return precautions. Use empathetic but factual language. No emojis.',
      output: '1) Primary diagnosis: Community-acquired pneumonia, treated with intravenous antibiotics, supplemental oxygen, and intravenous fluids during a five-day admission. 2) Discharge medications: azithromycin 250 mg orally once daily for three days; multivitamin once daily. 3) Follow-up appointments: pulmonology within two weeks of discharge. 4) Return precautions: contact the clinic immediately for dyspnea at rest, fever above 38.5 °C, or productive cough with blood.',
      verdict: 'Section structure forced — every required dimension surfaces explicitly.',
    },
  },
  {
    id: 'pc-feature-pitch',
    domain: 'product',
    label: 'Feature pitch for two audiences',
    taskInput: 'New feature: automatic eligibility re-check. When a patient\'s plan changes, system re-verifies coverage in the background and surfaces a yellow banner in the EHR if a previously-approved service is no longer covered. Saves an average of 14 minutes per re-check.',
    vague: {
      prompt: 'Write a pitch for this feature.',
      output: 'This new feature provides significant value to our users by streamlining their workflow. It leverages automation to deliver a better experience. Customers will appreciate the improved efficiency and reduced manual effort across their daily operations.',
      verdict: 'No audience, no specific benefit, no quantification — interchangeable marketing filler.',
    },
    specific: {
      prompt: 'You are a product marketing writer. Write two paired one-paragraph pitches for the feature below: (a) for a Director of Revenue Cycle (concrete time savings and revenue protection), (b) for an EHR admin (operational simplicity, no extra clicks). Each paragraph maximum 60 words. Plain English, no jargon.',
      output: '(a) Revenue Cycle: Automatic eligibility re-check shields denied-claim revenue by re-verifying coverage in the background whenever a patient plan changes — saving roughly 14 minutes per re-check and surfacing at-risk approvals before the next visit, not after the denial. (b) EHR Admin: No new buttons, no extra steps. When a plan changes, the system re-verifies coverage in the background and adds a yellow banner inside the existing EHR view, keeping daily workflow exactly the same while flagging risk early.',
      verdict: 'Two audiences named, length capped, dimensions explicit — both pitches land their specific frame.',
    },
  },
  {
    id: 'pc-sql-query',
    domain: 'engineering',
    label: 'SQL query for finance question',
    taskInput: 'Tables: orders (id, customer_id, total_cents, placed_at, status), customers (id, name, region). Question: Top 5 customers by total revenue in EU region for the last full month, excluding refunded orders.',
    vague: {
      prompt: 'Write a SQL query for this.',
      output: 'SELECT * FROM orders JOIN customers ON orders.customer_id = customers.id WHERE region = \'EU\' ORDER BY total_cents DESC LIMIT 5;',
      verdict: 'Missing time filter, missing aggregation, missing refund exclusion — query answers a different question.',
    },
    specific: {
      prompt: 'You are a SQL assistant. Given the schema below, write a single PostgreSQL query that answers the question. Include only columns explicitly required by the question. Use ISO date filters. Comment any non-obvious join.',
      output: '-- Top 5 EU customers by revenue, last full calendar month, excluding refunded orders\nSELECT c.name, SUM(o.total_cents) AS revenue_cents\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE c.region = \'EU\'\n  AND o.status <> \'refunded\'\n  AND o.placed_at >= date_trunc(\'month\', CURRENT_DATE) - INTERVAL \'1 month\'\n  AND o.placed_at <  date_trunc(\'month\', CURRENT_DATE)\nGROUP BY c.name\nORDER BY revenue_cents DESC\nLIMIT 5;',
      verdict: 'Schema, scope, aggregation, and refund exclusion all named — the query answers the exact question.',
    },
  },
  {
    id: 'pc-slack-update',
    domain: 'operations',
    label: 'Stakeholder Slack update',
    taskInput: 'Loading-state fix shipped last Tuesday. Onboarding completion moved from 30% to 58% over the week. No backend changes. Three lines of new copy in the app. Forty-two-point gap remains to target of 100%.',
    vague: {
      prompt: 'Write a Slack update on this.',
      output: '🎉 Great news! The team shipped the fix and onboarding completion went up. Big win for the user experience. Lots of impact from a small change. Excited to see what comes next!',
      verdict: 'Reads like a victory lap with no specifics — caller cannot act on it.',
    },
    specific: {
      prompt: 'You are writing a Slack update to the CEO. One sentence stating what shipped, one sentence stating the measured result, one sentence stating the remaining gap and the next diagnostic. Plain language. No emojis. Max 70 words.',
      output: 'Shipped: a loading-state fix — three lines of in-app copy, no backend change — to the onboarding step where users were stalling silently. Result: onboarding completion moved from 30 percent to 58 percent over the week. Next: running the same diagnostic on the remaining 42 percent gap before proposing further work.',
      verdict: 'Audience and structure pinned — the CEO can act on three concrete claims.',
    },
  },
  {
    id: 'pc-incident-postmortem',
    domain: 'engineering',
    label: 'Incident post-mortem summary',
    taskInput: 'INC-2024-03-12: DB outage 14:00 UTC. Cause: runaway query on orders table. Killed PID 12345, restarted db-service. During restart, user_sessions table corrupted; restored from 13:55 UTC backup at 16:30 UTC. Affected: 6,400 active sessions. Total downtime: 2h 30m partial.',
    vague: {
      prompt: 'Summarise this incident.',
      output: 'The system had a database issue. The team investigated and resolved the issue. Service was restored. Steps will be taken to prevent recurrence going forward.',
      verdict: 'No actor, no timeline, no impact figure — describes any incident.',
    },
    specific: {
      prompt: 'You are an incident commander. Given the post-mortem notes below, return a JSON object with the keys: incident_id, root_cause, resolution_steps (array), data_integrity_status, customer_impact. No prose, just the JSON.',
      output: '{\n  "incident_id": "INC-2024-03-12",\n  "root_cause": "Runaway query on the orders table caused a DB outage at 14:00 UTC.",\n  "resolution_steps": ["Killed PID 12345 on DB01", "Restarted db-service", "Detected user_sessions table corruption during restart", "Restored user_sessions from the 13:55 UTC backup at 16:30 UTC"],\n  "data_integrity_status": "Compromised then restored from backup",\n  "customer_impact": "6,400 active sessions affected; 2 hours 30 minutes of partial degradation."\n}',
      verdict: 'Output shape pinned to a schema — every field the on-call needs is present and machine-readable.',
    },
  },
  {
    id: 'pc-research-brief',
    domain: 'general',
    label: 'Research summary for an exec',
    taskInput: 'Twelve interviews with PMs at mid-market SaaS companies (50–500 employees). Five top themes by mention count: roadmap clarity (10), prioritisation under pressure (9), engineering trust (8), stakeholder visibility (7), measurement maturity (6).',
    vague: {
      prompt: 'Summarise this research for me.',
      output: 'The research surfaced a number of interesting themes from the interviews conducted. There are several areas that PMs care about, and the findings suggest opportunities for improvement across the product.',
      verdict: 'Audience and decision both missing — the exec cannot do anything with this.',
    },
    specific: {
      prompt: 'You are summarising for a VP of Product who has 90 seconds. Output: one-sentence headline finding, then a numbered list of the top three themes with the mention count in parentheses. No further commentary.',
      output: 'Headline: roadmap clarity is the single most-mentioned PM pain across mid-market SaaS, surfaced in 10 of 12 interviews and consistently named ahead of prioritisation, trust, or measurement. 1) Roadmap clarity (10). 2) Prioritisation under pressure (9). 3) Engineering trust (8).',
      verdict: 'Audience (VP, 90s), structure, and emphasis are explicit — output is immediately decision-ready.',
    },
  },
  {
    id: 'pc-bug-report',
    domain: 'engineering',
    label: 'Bug report rewrite',
    taskInput: 'User wrote: "the thing is broken!!! page keeps loading and loading and i cant submit my form, please fix asap" — Sent from mobile Safari on iOS 17.2 at 10:42 UTC after the v3.4 release.',
    vague: {
      prompt: 'Turn this into a bug report.',
      output: 'The user reported that something is not working. The page is loading and the form cannot be submitted. The issue should be investigated and resolved as soon as possible.',
      verdict: 'No reproducible steps, no environment data, no expected vs actual — engineering still has to triage from scratch.',
    },
    specific: {
      prompt: 'You are a triage assistant. Given the user report below, return a bug report with five labelled sections: 1) Environment (browser, OS, version). 2) Steps observed. 3) Expected behaviour. 4) Actual behaviour. 5) Severity. Plain language, no speculation about cause.',
      output: '1) Environment: mobile Safari on iOS 17.2 at 10:42 UTC; first reported after the v3.4 release. 2) Steps observed: user attempted to load a page and submit a form; page entered an indefinite loading state and the submit action did not complete. 3) Expected behaviour: form submission completes and the user receives a confirmation. 4) Actual behaviour: page remains in a loading state and the submit button does not register a click. 5) Severity: High — blocks a primary user flow on a recently shipped release.',
      verdict: 'Sections force every dimension engineering needs — triage can start immediately.',
    },
  },
  {
    id: 'pc-customer-reply',
    domain: 'operations',
    label: 'Empathetic customer reply',
    taskInput: 'Customer: paid invoice on time but received a "past due" reminder this morning. Order #4421. Frustrated tone. Account manager is on PTO.',
    vague: {
      prompt: 'Write a reply to this customer.',
      output: 'Thank you for reaching out. We apologise for any inconvenience caused by this matter. We are looking into the issue and will follow up with you as soon as possible. Your business is important to us.',
      verdict: 'Generic apology with no specific commitment — the customer will write again tomorrow.',
    },
    specific: {
      prompt: 'You are a customer success agent covering for an account manager on PTO. Write a reply in three short paragraphs: 1) Acknowledge the specific issue (use the order number). 2) State the action you are taking right now. 3) State exactly when the customer can expect an update and from whom. Empathetic but factual tone. No filler.',
      output: 'Thank you for letting us know about order #4421 — the past-due reminder you received this morning was sent in error after your invoice posted on time. I have stopped any further reminders on that order and flagged your account so the issue does not repeat. While your account manager is on PTO this week, I am owning this directly: I will confirm payment posting with finance today and send you a confirmation reply before end of day Friday.',
      verdict: 'Specific reference, specific action, specific deadline and owner — the customer has a clear path.',
    },
  },
];

export function matchPromptCompareScenario(input: string, minOverlap = 0.4): PromptCompareScenario | null {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  const STOPWORDS = new Set(['the', 'and', 'for', 'with', 'from', 'into', 'that', 'this', 'are', 'will', 'has', 'have']);
  const inputTokens = new Set(normalize(input).filter(w => !STOPWORDS.has(w)));
  if (inputTokens.size === 0) return null;
  let best: { s: PromptCompareScenario; score: number } | null = null;
  for (const s of PROMPT_COMPARE_DATASET) {
    const refTokens = normalize(s.taskInput + ' ' + s.label).filter(w => !STOPWORDS.has(w));
    if (refTokens.length === 0) continue;
    const overlap = refTokens.filter(t => inputTokens.has(t)).length / Math.max(refTokens.length, 8);
    if (!best || overlap > best.score) best = { s, score: overlap };
  }
  return best && best.score >= minOverlap ? best.s : null;
}

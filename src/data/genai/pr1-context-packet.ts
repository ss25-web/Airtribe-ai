// ─── PR1 · ContextPacketCard dataset ──────────────────────────────────
// Each entry is one "API request" scenario — a complete-packet variant
// and a broken-packet variant of the same call, plus the corresponding
// model output for each. The card UI presents a picker of scenarios
// (filtered by track) and lets the learner toggle COMPLETE ↔ BROKEN to
// see how the same prompt drifts when fields are silently null or
// truncated.
//
// All outputs are hand-authored proper English. No LLM calls at runtime.

import type { GenAITrack } from '@/components/genaiTypes';

export type PacketField = {
  key: string;
  value: string;
  ok: boolean;
  type?: 'string' | 'number' | 'null';
};

export type ContextPacketScenario = {
  id: string;
  track: GenAITrack | 'both';
  domain: 'claims' | 'support' | 'expense' | 'lead' | 'risk' | 'hr' | 'logistics' | 'product';
  label: string;          // dropdown label
  url: string;            // full URL with method prefix, e.g. "POST  https://…"
  completeFields: PacketField[];
  brokenFields:   PacketField[];
  completeOutput: string;
  brokenOutput:   string;
  completeNote:   string; // verdict bar caption when COMPLETE
  brokenNote:     string; // verdict bar caption when BROKEN
};

export const CONTEXT_PACKET_DATASET: ContextPacketScenario[] = [
  // ─── CLAIMS · engineer ──────────────────────────────────────────────
  {
    id: 'claims-pharmacy-override',
    track: 'engineer',
    domain: 'claims',
    label: 'Claims · pharmacy override triage',
    url: 'POST  https://api.northstar.health/v1/claims/{id}/triage',
    completeFields: [
      { key: 'patient_id',   value: '"PT-88412"',              ok: true, type: 'string' },
      { key: 'claim_amount', value: '2840.00',                 ok: true, type: 'number' },
      { key: 'case_note',    value: '"847 chars — complete"',  ok: true, type: 'string' },
      { key: 'intake_form',  value: '{ … structured }',        ok: true, type: 'string' },
      { key: 'policy_tier',  value: '"Tier 2 — PPO"',          ok: true, type: 'string' },
    ],
    brokenFields: [
      { key: 'patient_id',   value: '"PT-88412"',              ok: true,  type: 'string' },
      { key: 'claim_amount', value: 'null',                    ok: false, type: 'null' },
      { key: 'case_note',    value: '"truncated at 256 chars…"', ok: false, type: 'string' },
      { key: 'intake_form',  value: '"flattened string blob"', ok: false, type: 'string' },
      { key: 'policy_tier',  value: 'null',                    ok: false, type: 'null' },
    ],
    completeOutput:
      'Category: Disputed pharmacy benefit claim. Action: Escalate to pharmacy review within 48h — override requested by treating physician. Urgency: High. Risk: $2,840 exposure on PT-88412 if SLA breached.',
    brokenOutput:
      'A patient case was reviewed and requires further triage. The claim is being processed per standard procedure. Please escalate as needed.',
    completeNote:
      'Every required field present and well-typed — model has hard facts to write from.',
    brokenNote:
      '4 fields silently null or truncated · model can’t see the gap and fills it with generic prose. Status code is still 200 — nothing alerts.',
  },
  {
    id: 'claims-prior-auth',
    track: 'engineer',
    domain: 'claims',
    label: 'Claims · prior-auth decision',
    url: 'POST  https://api.northstar.health/v1/claims/{id}/prior-auth',
    completeFields: [
      { key: 'member_id',     value: '"MB-44210"',                 ok: true, type: 'string' },
      { key: 'cpt_code',      value: '"99214"',                    ok: true, type: 'string' },
      { key: 'requested_qty', value: '12',                         ok: true, type: 'number' },
      { key: 'diagnosis',     value: '"ICD10 M54.5 — low back"',   ok: true, type: 'string' },
      { key: 'provider_npi',  value: '"1740582193"',               ok: true, type: 'string' },
    ],
    brokenFields: [
      { key: 'member_id',     value: '"MB-44210"',                 ok: true,  type: 'string' },
      { key: 'cpt_code',      value: '""',                         ok: false, type: 'string' },
      { key: 'requested_qty', value: 'null',                       ok: false, type: 'null' },
      { key: 'diagnosis',     value: 'null',                       ok: false, type: 'null' },
      { key: 'provider_npi',  value: '"1740582193"',               ok: true,  type: 'string' },
    ],
    completeOutput:
      'Decision: Approve 12 sessions of office-visit code 99214 for M54.5 low-back pain under MB-44210. Reviewer: NPI 1740582193 is in-network — standard prior-auth path, no exception memo required.',
    brokenOutput:
      'The prior authorisation request has been received and is being evaluated. Coverage will be determined based on the applicable plan terms. We will notify the requesting provider with the outcome.',
    completeNote:
      'Codes, qty and diagnosis all present — model can produce a defensible decision string.',
    brokenNote:
      'CPT, qty, and diagnosis missing · the model writes "we will notify" boilerplate because it has nothing concrete to say.',
  },

  // ─── SUPPORT · builder ──────────────────────────────────────────────
  {
    id: 'support-exception-triage',
    track: 'builder',
    domain: 'support',
    label: 'Support · escalation triage',
    url: 'POST  https://api.northstar.health/v1/exceptions/triage',
    completeFields: [
      { key: 'case_id',        value: '"ESC-2024-7712"',           ok: true, type: 'string' },
      { key: 'category',       value: '"Provider credentialing"',  ok: true, type: 'string' },
      { key: 'submitted_date', value: '"2024-03-01"',              ok: true, type: 'string' },
      { key: 'case_notes',     value: '"1204 chars — complete"',   ok: true, type: 'string' },
      { key: 'attachments',    value: '["PDF-1.pdf", "PDF-2.pdf"]', ok: true, type: 'string' },
    ],
    brokenFields: [
      { key: 'case_id',        value: '"ESC-2024-4405"',           ok: true,  type: 'string' },
      { key: 'category',       value: '""',                        ok: false, type: 'string' },
      { key: 'submitted_date', value: '"2022-11-14"',              ok: true,  type: 'string' },
      { key: 'case_notes',     value: 'null',                      ok: false, type: 'null' },
      { key: 'attachments',    value: '["unavailable", "unavailable"]', ok: false, type: 'string' },
    ],
    completeOutput:
      'Category: Provider credentialing exception, submitted 2024-03-01 (case 7712). Recommended next step: Route to credentialing team; attached docs cover physician licensure and OON contract — sufficient for review without follow-up.',
    brokenOutput:
      'Based on the available information, this case requires standard review. We recommend following the appropriate escalation process based on category and urgency.',
    completeNote:
      'Category, dates, and full notes are present — the model can write a routing decision with specifics.',
    brokenNote:
      'No category, empty notes, broken attachments · the model produces a generic recommendation because there’s nothing case-specific to ground it.',
  },
  {
    id: 'support-refund-decision',
    track: 'builder',
    domain: 'support',
    label: 'Support · refund decision draft',
    url: 'POST  https://api.support.acme.com/v1/refund/draft',
    completeFields: [
      { key: 'order_id',       value: '"OD-902331"',          ok: true, type: 'string' },
      { key: 'order_total',    value: '142.80',               ok: true, type: 'number' },
      { key: 'reason_code',    value: '"DAMAGED_ON_ARRIVAL"', ok: true, type: 'string' },
      { key: 'photo_evidence', value: '["img-1.jpg"]',        ok: true, type: 'string' },
      { key: 'customer_tier',  value: '"Loyalty Gold"',       ok: true, type: 'string' },
    ],
    brokenFields: [
      { key: 'order_id',       value: '"OD-902331"',          ok: true,  type: 'string' },
      { key: 'order_total',    value: 'null',                 ok: false, type: 'null' },
      { key: 'reason_code',    value: '""',                   ok: false, type: 'string' },
      { key: 'photo_evidence', value: '[]',                   ok: false, type: 'string' },
      { key: 'customer_tier',  value: 'null',                 ok: false, type: 'null' },
    ],
    completeOutput:
      'Refund: $142.80 on OD-902331 — approved under damaged-on-arrival policy with photo evidence attached. Tier: Loyalty Gold, so no restocking fee. Notify customer same-day via email template REFUND-DOA-GOLD.',
    brokenOutput:
      'Thank you for reaching out regarding your recent order. We have reviewed your request and will process the appropriate action based on our standard refund policy. Please allow several business days for resolution.',
    completeNote:
      'Amount, reason, photos and tier all set — the model can write a specific approval with the right template name.',
    brokenNote:
      'Amount, reason and tier all missing · the model falls back to a polite-but-empty support boilerplate.',
  },

  // ─── EXPENSE · builder ──────────────────────────────────────────────
  {
    id: 'expense-policy-check',
    track: 'builder',
    domain: 'expense',
    label: 'Expense · policy check',
    url: 'POST  https://api.finance.acme.com/v1/expense/check',
    completeFields: [
      { key: 'employee_id',  value: '"EMP-3322"',         ok: true, type: 'string' },
      { key: 'category',     value: '"Client dinner"',    ok: true, type: 'string' },
      { key: 'amount',       value: '208.40',             ok: true, type: 'number' },
      { key: 'receipt_url',  value: '"r/884413.pdf"',     ok: true, type: 'string' },
      { key: 'cost_center',  value: '"CC-NA-SALES-001"',  ok: true, type: 'string' },
    ],
    brokenFields: [
      { key: 'employee_id',  value: '"EMP-3322"',         ok: true,  type: 'string' },
      { key: 'category',     value: 'null',               ok: false, type: 'null' },
      { key: 'amount',       value: 'null',               ok: false, type: 'null' },
      { key: 'receipt_url',  value: '""',                 ok: false, type: 'string' },
      { key: 'cost_center',  value: '"CC-NA-SALES-001"',  ok: true,  type: 'string' },
    ],
    completeOutput:
      'Expense: $208.40 client dinner on EMP-3322 (CC-NA-SALES-001). Policy: within the $250 cap for sales-team client meals — receipt attached. Action: auto-approve, no manager sign-off required.',
    brokenOutput:
      'The submitted expense has been received and will be reviewed against the applicable expense policy. Standard processing time applies. Please ensure all required documentation is provided to avoid delays.',
    completeNote:
      'Category, amount and receipt all attached — model can quote the exact policy cap and approve.',
    brokenNote:
      'No category, no amount, no receipt · model can’t name a policy so it writes a generic "we will review" sentence.',
  },

  // ─── LEAD · builder ─────────────────────────────────────────────────
  {
    id: 'lead-scoring',
    track: 'builder',
    domain: 'lead',
    label: 'Lead · sales qualification summary',
    url: 'POST  https://api.crm.acme.com/v1/leads/{id}/summary',
    completeFields: [
      { key: 'lead_id',         value: '"L-771208"',                       ok: true, type: 'string' },
      { key: 'company',         value: '"Meridian Corp"',                  ok: true, type: 'string' },
      { key: 'employee_count',  value: '1840',                             ok: true, type: 'number' },
      { key: 'icp_fit_score',   value: '0.81',                             ok: true, type: 'number' },
      { key: 'last_touch_note', value: '"Demo booked 2024-03-04 with VP Sales"', ok: true, type: 'string' },
    ],
    brokenFields: [
      { key: 'lead_id',         value: '"L-771208"',  ok: true,  type: 'string' },
      { key: 'company',         value: '""',          ok: false, type: 'string' },
      { key: 'employee_count',  value: 'null',        ok: false, type: 'null' },
      { key: 'icp_fit_score',   value: 'null',        ok: false, type: 'null' },
      { key: 'last_touch_note', value: 'null',        ok: false, type: 'null' },
    ],
    completeOutput:
      'Lead L-771208 (Meridian Corp, 1840 employees) scores 0.81 on ICP — solid mid-market fit. Last touch: demo booked 4 March with the VP Sales. Action: route to the enterprise AE for follow-up within 24h.',
    brokenOutput:
      'This lead has been added to the qualification queue and will be evaluated against our standard scoring framework. Please follow up at the appropriate cadence per our sales playbook.',
    completeNote:
      'Company, headcount, ICP score and last touch all present — model can name a route and a timeline.',
    brokenNote:
      'Company, score, and touch note all missing · the model writes a generic "qualify per the playbook" line.',
  },

  // ─── RISK · engineer ────────────────────────────────────────────────
  {
    id: 'risk-fraud-flag',
    track: 'engineer',
    domain: 'risk',
    label: 'Risk · transaction fraud check',
    url: 'POST  https://api.payments.acme.com/v1/risk/score',
    completeFields: [
      { key: 'txn_id',          value: '"TX-9981-0033"',     ok: true, type: 'string' },
      { key: 'amount_usd',      value: '1942.10',            ok: true, type: 'number' },
      { key: 'merchant_mcc',    value: '"7995"',             ok: true, type: 'string' },
      { key: 'device_fingerprint', value: '"d8a1…fb37"',     ok: true, type: 'string' },
      { key: 'velocity_24h',    value: '7',                  ok: true, type: 'number' },
    ],
    brokenFields: [
      { key: 'txn_id',          value: '"TX-9981-0033"',     ok: true,  type: 'string' },
      { key: 'amount_usd',      value: 'null',               ok: false, type: 'null' },
      { key: 'merchant_mcc',    value: '""',                 ok: false, type: 'string' },
      { key: 'device_fingerprint', value: 'null',            ok: false, type: 'null' },
      { key: 'velocity_24h',    value: 'null',               ok: false, type: 'null' },
    ],
    completeOutput:
      'Risk: high. TX-9981-0033 is a $1,942 charge at MCC 7995 (gambling) with 7 attempts in the last 24h on device d8a1…fb37. Recommend block + step-up auth; review queue within 30 min.',
    brokenOutput:
      'The transaction has been evaluated against our risk models. A determination will be returned to the calling system based on the available signals. Please proceed in line with the standard risk-handling policy.',
    completeNote:
      'Amount, MCC, device and velocity all in — model can name the specific risk pattern and action.',
    brokenNote:
      '4 of 5 risk signals missing · the model can’t cite a pattern so it writes a hollow "evaluated against models" sentence.',
  },

  // ─── HR · builder ───────────────────────────────────────────────────
  {
    id: 'hr-leave-decision',
    track: 'builder',
    domain: 'hr',
    label: 'HR · leave-request decision',
    url: 'POST  https://api.hr.acme.com/v1/leave/decision',
    completeFields: [
      { key: 'employee_id',    value: '"EMP-4490"',          ok: true, type: 'string' },
      { key: 'leave_type',     value: '"Parental"',          ok: true, type: 'string' },
      { key: 'start_date',     value: '"2024-05-01"',        ok: true, type: 'string' },
      { key: 'duration_weeks', value: '12',                  ok: true, type: 'number' },
      { key: 'manager_signoff', value: '"manager:approved"', ok: true, type: 'string' },
    ],
    brokenFields: [
      { key: 'employee_id',    value: '"EMP-4490"',          ok: true,  type: 'string' },
      { key: 'leave_type',     value: '""',                  ok: false, type: 'string' },
      { key: 'start_date',     value: 'null',                ok: false, type: 'null' },
      { key: 'duration_weeks', value: 'null',                ok: false, type: 'null' },
      { key: 'manager_signoff', value: 'null',               ok: false, type: 'null' },
    ],
    completeOutput:
      'Approved: 12 weeks of parental leave for EMP-4490 starting 1 May 2024. Manager sign-off on file. Confirmation email queued — payroll notified to set the unpaid window.',
    brokenOutput:
      'Your leave request has been received and will be processed in line with company policy. We will notify you and your manager once the review is complete.',
    completeNote:
      'Type, dates, duration and sign-off all there — model can write a clean approval with payroll context.',
    brokenNote:
      'Type, dates, duration, and sign-off all missing · the model writes generic HR-speak that names no policy.',
  },

  // ─── LOGISTICS · engineer ───────────────────────────────────────────
  {
    id: 'logistics-shipment-eta',
    track: 'engineer',
    domain: 'logistics',
    label: 'Logistics · shipment ETA call',
    url: 'POST  https://api.fleet.acme.com/v1/shipments/{id}/eta',
    completeFields: [
      { key: 'shipment_id',     value: '"SH-2024-008812"',   ok: true, type: 'string' },
      { key: 'origin',          value: '"BOM"',              ok: true, type: 'string' },
      { key: 'destination',     value: '"BLR"',              ok: true, type: 'string' },
      { key: 'last_ping_kms',   value: '212',                ok: true, type: 'number' },
      { key: 'sla_hours',       value: '36',                 ok: true, type: 'number' },
    ],
    brokenFields: [
      { key: 'shipment_id',     value: '"SH-2024-008812"',   ok: true,  type: 'string' },
      { key: 'origin',          value: 'null',               ok: false, type: 'null' },
      { key: 'destination',     value: '""',                 ok: false, type: 'string' },
      { key: 'last_ping_kms',   value: 'null',               ok: false, type: 'null' },
      { key: 'sla_hours',       value: 'null',               ok: false, type: 'null' },
    ],
    completeOutput:
      'Shipment SH-2024-008812 (BOM → BLR) last pinged 212 km from destination — projected to arrive within the 36h SLA. No carrier intervention needed; auto-confirm to the consignee.',
    brokenOutput:
      'The shipment ETA is being evaluated and will be returned to the requesting client. Please continue to track the shipment through the standard tracking interface.',
    completeNote:
      'Origin, destination, distance and SLA all set — model can give a real ETA verdict.',
    brokenNote:
      'Origin, destination, distance, and SLA all missing · model returns a non-answer that the consignee can’t act on.',
  },

  // ─── PRODUCT · both ─────────────────────────────────────────────────
  {
    id: 'product-feature-classify',
    track: 'both',
    domain: 'product',
    label: 'Product · feature-request classifier',
    url: 'POST  https://api.feedback.acme.com/v1/requests/classify',
    completeFields: [
      { key: 'request_id',    value: '"FR-7714"',                                   ok: true, type: 'string' },
      { key: 'title',         value: '"Bulk-export filtered table to CSV"',         ok: true, type: 'string' },
      { key: 'body',          value: '"312 chars — full description"',              ok: true, type: 'string' },
      { key: 'submitter_tier', value: '"Enterprise"',                                ok: true, type: 'string' },
      { key: 'related_count', value: '14',                                          ok: true, type: 'number' },
    ],
    brokenFields: [
      { key: 'request_id',    value: '"FR-7714"',          ok: true,  type: 'string' },
      { key: 'title',         value: '""',                 ok: false, type: 'string' },
      { key: 'body',          value: 'null',               ok: false, type: 'null' },
      { key: 'submitter_tier', value: 'null',              ok: false, type: 'null' },
      { key: 'related_count', value: 'null',               ok: false, type: 'null' },
    ],
    completeOutput:
      'Classify FR-7714: "Bulk CSV export for filtered tables" — Reporting / Export theme. Enterprise submitter with 14 related requests already on file — promote to a top-quartile bucket for next planning.',
    brokenOutput:
      'This feature request has been classified and added to the product backlog. The product team will review the request in line with the standard prioritisation process.',
    completeNote:
      'Title, body, tier and related count all present — the model can place the request inside a theme with weight.',
    brokenNote:
      'Title and body missing · the model falls back to "added to the backlog" — no theme, no weight, no priority signal.',
  },

  // ─── EXPENSE · engineer (technical variant) ────────────────────────
  {
    id: 'expense-virtual-card',
    track: 'engineer',
    domain: 'expense',
    label: 'Finance · virtual-card limit raise',
    url: 'POST  https://api.finance.acme.com/v1/vcards/{id}/limit',
    completeFields: [
      { key: 'card_id',        value: '"VC-552201"',         ok: true, type: 'string' },
      { key: 'current_limit',  value: '5000',                ok: true, type: 'number' },
      { key: 'requested_limit', value: '12000',              ok: true, type: 'number' },
      { key: 'mtd_spend',      value: '4720.12',             ok: true, type: 'number' },
      { key: 'cost_center',    value: '"CC-OPS-INFRA"',      ok: true, type: 'string' },
    ],
    brokenFields: [
      { key: 'card_id',        value: '"VC-552201"',         ok: true,  type: 'string' },
      { key: 'current_limit',  value: 'null',                ok: false, type: 'null' },
      { key: 'requested_limit', value: 'null',               ok: false, type: 'null' },
      { key: 'mtd_spend',      value: 'null',                ok: false, type: 'null' },
      { key: 'cost_center',    value: '"CC-OPS-INFRA"',      ok: true,  type: 'string' },
    ],
    completeOutput:
      'Raise on VC-552201 (CC-OPS-INFRA): current $5,000, requested $12,000. MTD spend $4,720 — utilisation already 94%. Recommend: approve a $10k cap with a 30-day review trigger.',
    brokenOutput:
      'The card-limit change request will be processed in line with finance policy. The card holder will be notified once a decision is made.',
    completeNote:
      'Limits, spend and cost center all present — the model can quote a specific cap and review window.',
    brokenNote:
      'Limits and spend all null · model can’t propose a number, so it writes a non-committal "will be processed" sentence.',
  },

  // ─── SUPPORT · engineer (technical) ────────────────────────────────
  {
    id: 'support-incident-postmortem',
    track: 'engineer',
    domain: 'support',
    label: 'Incident · postmortem draft',
    url: 'POST  https://api.statuspage.acme.com/v1/incidents/{id}/postmortem',
    completeFields: [
      { key: 'incident_id',  value: '"INC-2024-118"',                  ok: true, type: 'string' },
      { key: 'started_at',   value: '"2024-03-04T14:22Z"',             ok: true, type: 'string' },
      { key: 'mttr_minutes', value: '47',                              ok: true, type: 'number' },
      { key: 'root_cause',   value: '"Connection pool exhausted on auth-db"', ok: true, type: 'string' },
      { key: 'impact_users', value: '12400',                           ok: true, type: 'number' },
    ],
    brokenFields: [
      { key: 'incident_id',  value: '"INC-2024-118"',                  ok: true,  type: 'string' },
      { key: 'started_at',   value: 'null',                            ok: false, type: 'null' },
      { key: 'mttr_minutes', value: 'null',                            ok: false, type: 'null' },
      { key: 'root_cause',   value: '""',                              ok: false, type: 'string' },
      { key: 'impact_users', value: 'null',                            ok: false, type: 'null' },
    ],
    completeOutput:
      'INC-2024-118 (started 14:22 UTC on 4 March): auth-db connection pool exhausted, MTTR 47 minutes, 12,400 users impacted. Action items: raise pool ceiling and add a saturation alert at 80%.',
    brokenOutput:
      'An incident occurred and has been resolved. A postmortem will be published in line with our incident-response process once the review is complete.',
    completeNote:
      'Cause, MTTR and impact present — model can write a postmortem with named follow-up actions.',
    brokenNote:
      'Cause, MTTR and impact all missing · model writes a generic "postmortem will be published" line — no learning captured.',
  },

  // ─── CLAIMS · builder simpler version ──────────────────────────────
  {
    id: 'claims-billing-dispute',
    track: 'builder',
    domain: 'claims',
    label: 'Billing · customer dispute summary',
    url: 'POST  https://api.billing.acme.com/v1/disputes/{id}/summary',
    completeFields: [
      { key: 'dispute_id',      value: '"DSP-3340"',                ok: true, type: 'string' },
      { key: 'invoice_amount',  value: '184.00',                    ok: true, type: 'number' },
      { key: 'customer_claim',  value: '"Was charged twice on 12 Feb"', ok: true, type: 'string' },
      { key: 'duplicate_found', value: 'true',                      ok: true, type: 'string' },
      { key: 'customer_tier',   value: '"SMB Pro"',                 ok: true, type: 'string' },
    ],
    brokenFields: [
      { key: 'dispute_id',      value: '"DSP-3340"',                ok: true,  type: 'string' },
      { key: 'invoice_amount',  value: 'null',                      ok: false, type: 'null' },
      { key: 'customer_claim',  value: '""',                        ok: false, type: 'string' },
      { key: 'duplicate_found', value: 'null',                      ok: false, type: 'null' },
      { key: 'customer_tier',   value: 'null',                      ok: false, type: 'null' },
    ],
    completeOutput:
      'Dispute DSP-3340: customer flagged a duplicate $184 charge on 12 Feb. Duplicate confirmed in ledger — issue a one-click refund and credit memo. SMB Pro customer; auto-send the apology template.',
    brokenOutput:
      'Your dispute has been received and we are reviewing the matter. Once the review is complete, we will communicate the outcome via your registered email address.',
    completeNote:
      'Amount, claim text and duplicate flag all set — model can write an actionable decision with template name.',
    brokenNote:
      'Amount, claim and flag all missing · model returns the canned "we are reviewing" line with no real decision.',
  },

  // ─── RISK · builder (lighter) ──────────────────────────────────────
  {
    id: 'risk-merchant-onboarding',
    track: 'builder',
    domain: 'risk',
    label: 'Risk · merchant onboarding check',
    url: 'POST  https://api.payments.acme.com/v1/onboarding/review',
    completeFields: [
      { key: 'merchant_id',     value: '"MR-44210"',                    ok: true, type: 'string' },
      { key: 'business_name',   value: '"Crescent Cycles Pvt Ltd"',     ok: true, type: 'string' },
      { key: 'monthly_volume',  value: '38500.00',                      ok: true, type: 'number' },
      { key: 'kyc_status',      value: '"clear"',                       ok: true, type: 'string' },
      { key: 'industry',        value: '"Bicycle retail"',              ok: true, type: 'string' },
    ],
    brokenFields: [
      { key: 'merchant_id',     value: '"MR-44210"',                    ok: true,  type: 'string' },
      { key: 'business_name',   value: '""',                            ok: false, type: 'string' },
      { key: 'monthly_volume',  value: 'null',                          ok: false, type: 'null' },
      { key: 'kyc_status',      value: 'null',                          ok: false, type: 'null' },
      { key: 'industry',        value: 'null',                          ok: false, type: 'null' },
    ],
    completeOutput:
      'Merchant MR-44210 (Crescent Cycles, bicycle retail, $38.5k monthly volume) clears KYC. Route to the standard onboarding flow with the small-business pricing tier — no manual review needed.',
    brokenOutput:
      'The merchant onboarding application is under review. We will notify the applicant of the decision in line with our standard onboarding process.',
    completeNote:
      'Business name, volume, KYC and industry all present — model can route to a specific tier with reasoning.',
    brokenNote:
      'Name, volume, KYC and industry all missing · model returns a templated "under review" non-answer.',
  },

  // ─── LEAD · engineer (technical) ──────────────────────────────────
  {
    id: 'lead-trial-conversion',
    track: 'engineer',
    domain: 'lead',
    label: 'Growth · trial conversion summary',
    url: 'POST  https://api.growth.acme.com/v1/trials/{id}/summary',
    completeFields: [
      { key: 'trial_id',     value: '"TR-99221"',                ok: true, type: 'string' },
      { key: 'seats_used',   value: '14',                         ok: true, type: 'number' },
      { key: 'seats_paid',   value: '20',                         ok: true, type: 'number' },
      { key: 'wau',          value: '0.71',                       ok: true, type: 'number' },
      { key: 'aha_moment_pct', value: '0.62',                     ok: true, type: 'number' },
    ],
    brokenFields: [
      { key: 'trial_id',     value: '"TR-99221"',                ok: true,  type: 'string' },
      { key: 'seats_used',   value: 'null',                       ok: false, type: 'null' },
      { key: 'seats_paid',   value: 'null',                       ok: false, type: 'null' },
      { key: 'wau',          value: 'null',                       ok: false, type: 'null' },
      { key: 'aha_moment_pct', value: 'null',                     ok: false, type: 'null' },
    ],
    completeOutput:
      'Trial TR-99221: 14 of 20 seats active, WAU 0.71, 62% hit the aha moment. Strong adoption signal — push the renewal email cadence and offer the loyalty-tier upgrade in week 3.',
    brokenOutput:
      'The trial activity has been evaluated and the standard renewal playbook will be applied. The growth team will follow up with the trial owner once the review is complete.',
    completeNote:
      'Seat usage, WAU and aha-moment % all present — model can write a specific renewal call with a cadence.',
    brokenNote:
      'All usage metrics null · model writes the generic "renewal playbook" line, no signal, no urgency.',
  },
];

export const CONTEXT_PACKET_FALLBACK: ContextPacketScenario = CONTEXT_PACKET_DATASET[0];

const STOPWORDS = new Set([
  'the','a','an','for','on','to','of','in','is','it','at','by','and','or','with','as','from','that','this','be','are','was','were','will','can','do','does','have','has','had','i','you','we','they','my','our','your','their','about','into','case','request','please','help','need','want','build','make','draft','run','do'
]);

function tokens(s: string): string[] {
  return s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOPWORDS.has(w));
}

export function matchContextScenario(input: string, track: GenAITrack): ContextPacketScenario | null {
  const q = tokens(input);
  if (q.length === 0) return null;
  let best: { entry: ContextPacketScenario; score: number } | null = null;
  for (const e of CONTEXT_PACKET_DATASET) {
    if (e.track !== 'both' && e.track !== track) continue;
    const hay = tokens(`${e.label} ${e.domain} ${e.completeOutput}`);
    let hits = 0;
    for (const w of q) if (hay.includes(w)) hits++;
    const score = hits / q.length;
    if (!best || score > best.score) best = { entry: e, score };
  }
  if (!best || best.score < 0.3) return null;
  return best.entry;
}

export function filterByTrack(track: GenAITrack): ContextPacketScenario[] {
  return CONTEXT_PACKET_DATASET.filter(e => e.track === 'both' || e.track === track);
}

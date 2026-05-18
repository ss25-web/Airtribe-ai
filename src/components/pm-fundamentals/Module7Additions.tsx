'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── SQL FOR PMs ──────────────────────────────────────────────────────────────
// PMs don't need to be SQL experts. But they need to be able to write the
// queries that answer the questions they care about without asking a data analyst.
// Five real EdSpark PM questions → five SQL queries you write yourself.

const SQL_SCENARIOS = [
  {
    id: 'activation',
    question: 'How many users completed their first coaching session in the last 7 days?',
    context: 'You want to know if the onboarding fix improved week-1 activation.',
    tables: ['users(id, created_at, plan)', 'sessions(id, user_id, completed_at, type)'],
    hint: 'You need to: (1) find sessions where type = "coaching" and it\'s their first session, (2) filter for completed_at in the last 7 days',
    answer: `SELECT COUNT(DISTINCT s.user_id)
FROM sessions s
WHERE s.type = 'coaching'
  AND s.completed_at >= NOW() - INTERVAL '7 days'
  AND NOT EXISTS (
    SELECT 1 FROM sessions s2
    WHERE s2.user_id = s.user_id
      AND s2.completed_at < s.completed_at
  );`,
    explanation: 'COUNT DISTINCT user_id because one user can\'t count twice. NOT EXISTS finds "first session" by checking no earlier session exists for that user.',
    concepts: ['COUNT DISTINCT', 'date filters', 'NOT EXISTS subquery'],
  },
  {
    id: 'retention',
    question: 'What % of users who signed up last month are still active this month?',
    context: 'You need to show Rohan whether retention improved after the onboarding redesign.',
    tables: ['users(id, created_at)', 'events(user_id, event_type, occurred_at)'],
    hint: 'Active = has any event this month. You need: (1) users who signed up last month, (2) of those, how many had an event this month',
    answer: `SELECT
  COUNT(DISTINCT CASE WHEN e.occurred_at >= DATE_TRUNC('month', NOW())
                       THEN u.id END) * 100.0
  / COUNT(DISTINCT u.id) AS retention_pct
FROM users u
LEFT JOIN events e ON e.user_id = u.id
WHERE u.created_at >= DATE_TRUNC('month', NOW() - INTERVAL '1 month')
  AND u.created_at < DATE_TRUNC('month', NOW());`,
    explanation: 'DATE_TRUNC(\'month\', ...) gets the start of a month. CASE WHEN inside COUNT only counts users meeting the active condition. Multiply by 100.0 for a percentage.',
    concepts: ['DATE_TRUNC', 'CASE WHEN inside aggregate', 'LEFT JOIN', 'percentage calculation'],
  },
  {
    id: 'cohorts',
    question: 'For users who signed up in January, what is their 30-day, 60-day, and 90-day retention?',
    context: 'You want to see the retention curve for the January cohort specifically.',
    tables: ['users(id, created_at)', 'sessions(id, user_id, started_at)'],
    hint: 'For each retention window (30/60/90 days), check if a session occurred within that window after signup',
    answer: `SELECT
  COUNT(DISTINCT u.id) AS cohort_size,
  COUNT(DISTINCT CASE WHEN MAX(s.started_at) >= u.created_at + INTERVAL '30 days'
                       THEN u.id END) * 100.0
  / COUNT(DISTINCT u.id) AS day_30_retention,
  COUNT(DISTINCT CASE WHEN MAX(s.started_at) >= u.created_at + INTERVAL '60 days'
                       THEN u.id END) * 100.0
  / COUNT(DISTINCT u.id) AS day_60_retention,
  COUNT(DISTINCT CASE WHEN MAX(s.started_at) >= u.created_at + INTERVAL '90 days'
                       THEN u.id END) * 100.0
  / COUNT(DISTINCT u.id) AS day_90_retention
FROM users u
LEFT JOIN sessions s ON s.user_id = u.id
WHERE u.created_at BETWEEN '2024-01-01' AND '2024-01-31';`,
    explanation: 'Each CASE WHEN checks if the user had a session at least N days after signup. BETWEEN filters the January cohort. This gives one row with all three retention rates.',
    concepts: ['Cohort analysis', 'INTERVAL arithmetic', 'multiple CASE WHEN', 'BETWEEN'],
  },
  {
    id: 'nrr',
    question: 'What is the Net Revenue Retention for Q1 enterprise accounts?',
    context: 'The board wants to know if enterprise customers are expanding, contracting, or churning.',
    tables: ['accounts(id, tier, arr_start, arr_end, period_start, period_end)'],
    hint: 'NRR = (starting ARR + expansion - contraction - churn) / starting ARR. You need accounts that existed at period start.',
    answer: `SELECT
  SUM(arr_end) * 100.0 / SUM(arr_start) AS nrr_pct
FROM accounts
WHERE tier = 'enterprise'
  AND period_start = '2024-01-01'
  AND period_end = '2024-03-31'
  AND arr_start > 0;`,
    explanation: 'NRR = ending ARR / starting ARR for the same cohort. arr_start > 0 ensures we only count accounts that existed at period start (not new accounts). Multiply by 100 for percentage.',
    concepts: ['NRR calculation', 'ratio aggregation', 'period filtering'],
  },
  {
    id: 'funnel',
    question: 'Show me the conversion rate at each step of the onboarding funnel for new users this week.',
    context: 'You want to find the biggest drop-off point in onboarding.',
    tables: ['events(user_id, event_type, occurred_at)', 'users(id, created_at)'],
    hint: 'Funnel steps: signed_up → uploaded_recording → completed_first_session → invited_team_member. Count unique users reaching each step.',
    answer: `SELECT
  COUNT(DISTINCT u.id) AS signed_up,
  COUNT(DISTINCT CASE WHEN e1.event_type = 'uploaded_recording'
                       THEN u.id END) AS uploaded,
  COUNT(DISTINCT CASE WHEN e2.event_type = 'completed_first_session'
                       THEN u.id END) AS first_session,
  COUNT(DISTINCT CASE WHEN e3.event_type = 'invited_team_member'
                       THEN u.id END) AS invited_team
FROM users u
LEFT JOIN events e1 ON e1.user_id = u.id
  AND e1.event_type = 'uploaded_recording'
LEFT JOIN events e2 ON e2.user_id = u.id
  AND e2.event_type = 'completed_first_session'
LEFT JOIN events e3 ON e3.user_id = u.id
  AND e3.event_type = 'invited_team_member'
WHERE u.created_at >= NOW() - INTERVAL '7 days';`,
    explanation: 'LEFT JOIN each funnel step so users who haven\'t reached it show as NULL (and aren\'t counted). CASE WHEN inside COUNT only counts users who reached that step.',
    concepts: ['Funnel query pattern', 'multiple LEFT JOINs', 'CASE WHEN null handling'],
  },
];

const CONCEPT_COLORS: Record<string, string> = {
  'COUNT DISTINCT': '#6366F1', 'date filters': '#0EA5E9', 'NOT EXISTS subquery': '#F97316',
  'DATE_TRUNC': '#0EA5E9', 'CASE WHEN inside aggregate': '#6366F1', 'LEFT JOIN': '#22C55E',
  'percentage calculation': '#F59E0B', 'Cohort analysis': '#EF4444', 'INTERVAL arithmetic': '#8B5CF6',
  'multiple CASE WHEN': '#6366F1', 'BETWEEN': '#0EA5E9', 'NRR calculation': '#F97316',
  'ratio aggregation': '#22C55E', 'period filtering': '#0EA5E9', 'Funnel query pattern': '#EF4444',
  'multiple LEFT JOINs': '#22C55E', 'CASE WHEN null handling': '#8B5CF6',
};

export function SQLforPMsViz() {
  const [active, setActive] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const scenario = SQL_SCENARIOS[active];

  const switchScenario = (idx: number) => {
    setActive(idx);
    setShowAnswer(false);
  };

  return (
    <div style={{ margin: '36px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ padding: '4px 12px', borderRadius: '8px', background: '#F97316', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '0.14em', boxShadow: '0 3px 0 #C2410C' }}>
          SQL FOR PMs
        </div>
        <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', fontWeight: 600 }}>5 real EdSpark PM questions → the SQL that answers them. Read the hint, try to reason it out, then reveal.</div>
      </div>

      {/* Scenario tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' as const }}>
        {SQL_SCENARIOS.map((s, i) => (
          <button key={s.id} onClick={() => switchScenario(i)}
            style={{ padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 700, background: active === i ? '#F97316' : 'var(--ed-card)', color: active === i ? '#fff' : 'var(--ed-ink3)', border: `1.5px solid ${active === i ? '#F97316' : 'var(--ed-rule)'}`, boxShadow: active === i ? '0 3px 0 #C2410C' : 'none', transition: 'all 0.2s' }}>
            {i + 1}. {s.id.charAt(0).toUpperCase() + s.id.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 10px 30px rgba(0,0,0,0.07)' }}>
        {/* Question */}
        <div style={{ padding: '18px 20px', background: 'rgba(249,115,22,0.07)', borderBottom: '1px solid var(--ed-rule)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#F97316', letterSpacing: '0.14em', marginBottom: '8px' }}>THE QUESTION YOU NEED TO ANSWER</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ed-ink)', lineHeight: 1.4, marginBottom: '6px' }}>{scenario.question}</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', fontStyle: 'italic' }}>{scenario.context}</div>
        </div>

        <div style={{ padding: '18px 20px', background: 'var(--ed-card)' }}>
          {/* Tables */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '8px' }}>TABLES AVAILABLE</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
              {scenario.tables.map((t, i) => (
                <div key={i} style={{ padding: '5px 12px', borderRadius: '6px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', fontFamily: 'monospace', fontSize: '11px', color: '#6366F1', fontWeight: 700 }}>
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Hint */}
          <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)', marginBottom: '16px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#F97316', letterSpacing: '0.12em', marginBottom: '6px' }}>💡 HINT — APPROACH</div>
            <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{scenario.hint}</div>
          </div>

          {/* Reveal button */}
          {!showAnswer ? (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setShowAnswer(true)}
              style={{ padding: '10px 24px', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: 800, background: 'linear-gradient(160deg, #F97316 0%, #C2410C 100%)', color: '#fff', border: 'none', boxShadow: '0 5px 0 #9A3412, 0 8px 20px rgba(249,115,22,0.35)' }}>
              Reveal the SQL →
            </motion.button>
          ) : (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                {/* SQL */}
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.25)', marginBottom: '14px' }}>
                  <div style={{ padding: '8px 14px', background: '#1E1E2E', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>SQL QUERY</div>
                  </div>
                  <pre style={{ margin: 0, padding: '16px', background: '#1E1E2E', overflowX: 'auto' as const, fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', lineHeight: 1.7, color: '#E2E8F0' }}>
                    {scenario.answer}
                  </pre>
                </div>

                {/* Explanation */}
                <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', marginBottom: '12px', fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
                  <strong style={{ color: '#22C55E' }}>Why this works:</strong> {scenario.explanation}
                </div>

                {/* Concepts */}
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '8px' }}>SQL CONCEPTS USED</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                    {scenario.concepts.map((c, i) => (
                      <div key={i} style={{ padding: '4px 10px', borderRadius: '6px', background: `${CONCEPT_COLORS[c] || '#6366F1'}15`, border: `1px solid ${CONCEPT_COLORS[c] || '#6366F1'}35`, fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, color: CONCEPT_COLORS[c] || '#6366F1' }}>
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#F97316' }}>The PM SQL mindset:</strong> you don&apos;t need to memorise syntax. You need to be able to describe the query in plain English (filter by this, join on that, count distinct users). The analyst can write it — but you need to know if the answer is answering the right question.
      </div>
    </div>
  );
}

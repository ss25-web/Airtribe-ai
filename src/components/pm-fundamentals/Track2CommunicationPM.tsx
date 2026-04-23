'use client';

import React, { useState } from 'react';
import { StakeholderCalibrationRoom, ExecReviewTheater, RoadmapPressureChamber } from './CommTools3D';
import { motion, AnimatePresence } from 'framer-motion';
import {
  glassCard, demoLabel, h2, para, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser, ApplyItBox,
  TiltCard, ConversationScene, PMPrincipleBox,
} from './designSystem';
import { MentorFace } from './MentorFaces';
import QuizEngine from '../QuizEngine';

const ACCENT     = '#0284C7';
const ACCENT_RGB = '2,132,199';
const MODULE_NUM = '06';
const MODULE_LABEL = 'Effective Communication';
const MODULE_CONTEXT = `Module 06 of Airtribe PM Fundamentals — Scale Track. Follows Aarav Menon, Senior PM at CloudBridge (B2B workflow SaaS), leading a high-stakes launch of an AI Workflow Assistant. Covers communication as leverage, stakeholder calibration in ambiguous environments, PRD writing with AI at senior level, exec QBRs, B2B sales enablement and roadmap negotiation, and building a communication operating system.`;

const PARTS = [
  { num: '01', id: 'm6-comm-job',     label: 'Communication as Leverage' },
  { num: '02', id: 'm6-stakeholders', label: 'Stakeholder Calibration' },
  { num: '03', id: 'm6-prd',          label: 'PRD Writing with AI' },
  { num: '04', id: 'm6-storytelling', label: 'Storytelling & Exec QBRs' },
  { num: '05', id: 'm6-b2b',          label: 'B2B Sales & Roadmap Comms' },
  { num: '06', id: 'm6-conflict',     label: 'Roadmap Under Pressure' },
  { num: '07', id: 'm6-executive',    label: 'Your Communication OS' },
];

// ─────────────────────────────────────────
// TOOL 1 · STAKEHOLDER TENSION MAP (Part 2)
// ─────────────────────────────────────────
type StakeholderName = 'Sales' | 'Engineering' | 'Leadership' | 'CS';
const tensions: { id: string; driver: string; stake: StakeholderName; what: string; howToFrame: string }[] = [
  { id: 't1', driver: 'Wants broader feature promises to enterprise accounts', stake: 'Sales', what: 'Pipeline at risk — needs confidence to close deals', howToFrame: 'Give them committed language only. Exploratory features get "on our radar." Never a date unless internal.' },
  { id: 't2', driver: 'Wants narrower scope to hit the committed timeline', stake: 'Engineering', what: 'Credibility — they\'ve committed to a date already', howToFrame: 'Show them the scope decision is final. Give them a clear list of what is NOT in v1 and why.' },
  { id: 't3', driver: 'Wants urgency — the board sees numbers next month', stake: 'Leadership', what: 'Business outcomes and risk visibility', howToFrame: 'Outcome-led: what metric moves, by when, with what confidence. Risk section should be explicit.' },
  { id: 't4', driver: 'Wants predictability for their accounts', stake: 'CS', what: 'Not getting caught off-guard by customers', howToFrame: 'Give them a clear "what to say / what not to say" guide before launch. Specific language, not vague readiness.' },
];
const stakeColors: Record<StakeholderName, string> = { Sales: '#E67E22', Engineering: '#3A86FF', Leadership: '#7843EE', CS: '#059669' };

const StakeholderTensionMap = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 24px 64px rgba(0,0,0,0.12)' }}>
        <div style={{ background: '#0F1B2D', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
            CloudBridge · AI Workflow Assistant Launch · Stakeholder Map
          </div>
        </div>
        <div style={{ background: '#0A1628', padding: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '14px' }}>CLICK EACH STAKEHOLDER TO SEE HOW TO CALIBRATE THE MESSAGE</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
            {tensions.map(t => (
              <motion.div key={t.id} onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                whileHover={{ x: 4 }}
                style={{ borderRadius: '10px', border: `1px solid ${stakeColors[t.stake]}30`, background: expanded === t.id ? `${stakeColors[t.stake]}12` : 'rgba(255,255,255,0.03)', cursor: 'pointer', overflow: 'hidden', transition: 'background 0.2s' }}>
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: `${stakeColors[t.stake]}20`, color: stakeColors[t.stake], flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" }}>{t.stake.toUpperCase()}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', flex: 1 }}>{t.driver}</div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', flexShrink: 0 }}>{expanded === t.id ? '▲' : '▼'}</div>
                </div>
                <AnimatePresence>
                  {expanded === t.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 16px 14px', borderTop: `1px solid ${stakeColors[t.stake]}20` }}>
                        <div style={{ paddingTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)' }}>
                            <div style={{ fontSize: '9px', fontWeight: 700, color: stakeColors[t.stake], fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '6px' }}>WHAT THEY ACTUALLY NEED</div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{t.what}</div>
                          </div>
                          <div style={{ padding: '10px 14px', borderRadius: '8px', background: `${stakeColors[t.stake]}10` }}>
                            <div style={{ fontSize: '9px', fontWeight: 700, color: stakeColors[t.stake], fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '6px' }}>HOW TO FRAME IT</div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{t.howToFrame}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// TOOL 2 · QBR COMMAND DECK (Part 4)
// ─────────────────────────────────────────
const qbrItems = [
  { id: 'q1', text: 'Sprint velocity: 42 story points avg this quarter', category: 'appendix', reason: 'Velocity is an execution metric, not a business metric. It belongs in working notes, not the exec room.' },
  { id: 'q2', text: 'AI Workflow Assistant adoption: 34% of active accounts', category: 'performance', reason: 'This is a direct outcome metric — exactly what leadership needs to see.' },
  { id: 'q3', text: 'Enterprise churn reduced from 8% to 5.2% this quarter', category: 'performance', reason: 'A business result with direct board-level relevance. Lead with this.' },
  { id: 'q4', text: '14 new feature updates shipped across 3 product areas', category: 'appendix', reason: 'Activity, not outcome. Leadership does not need a feature diary.' },
  { id: 'q5', text: 'SSO integration delay — 2 enterprise deals at risk', category: 'risk', reason: 'A risk with direct revenue impact. Must be surfaced, not buried.' },
  { id: 'q6', text: 'Figma handoff process improved with new design token system', category: 'appendix', reason: 'A process improvement. Useful internally, not exec-level.' },
  { id: 'q7', text: 'Q3 priority: AI assistant expansion to custom workflows', category: 'priority', reason: 'Forward-looking direction. Leadership needs this to allocate resources.' },
  { id: 'q8', text: 'Need engineering headcount approval for analytics module', category: 'ask', reason: 'A clear leadership ask. This is exactly what a QBR should surface.' },
];
const qbrBuckets = [
  { id: 'performance', label: 'Performance Snapshot',    color: '#059669', desc: 'Outcomes vs targets' },
  { id: 'risk',        label: 'Risk / Blocker',           color: '#dc2626', desc: 'What could hurt the business' },
  { id: 'priority',    label: 'Next Quarter Priority',    color: '#7843EE', desc: 'What we are betting on' },
  { id: 'ask',         label: 'Leadership Ask',           color: ACCENT,    desc: 'What decision is needed' },
  { id: 'appendix',    label: 'Appendix / Working Notes', color: '#6b7280', desc: 'Activity, not exec-level' },
];

const QBRCommandDeck = () => {
  const [placed, setPlaced] = useState<Record<string, string | null>>(() => Object.fromEntries(qbrItems.map(i => [i.id, null])));
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const allPlaced = Object.values(placed).every(v => v !== null);

  const place = (bucketId: string) => {
    if (!selected) return;
    const item = qbrItems.find(i => i.id === selected)!;
    const correct = item.category === bucketId;
    setPlaced(prev => ({ ...prev, [selected]: bucketId }));
    setFeedback(prev => ({ ...prev, [selected]: correct }));
    setRevealed(prev => ({ ...prev, [selected]: true }));
    setSelected(null);
  };

  const unplaced = qbrItems.filter(i => placed[i.id] === null);
  const score = Object.values(feedback).filter(Boolean).length;

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #1e293b', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        <div style={{ background: '#0F1B2D', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
            QBR Command Deck · CloudBridge Q2 Review
          </div>
        </div>
        <div style={{ background: '#060F1A', padding: '20px' }}>
          {unplaced.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '12px' }}>RAW MATERIAL — click an item, then place it</div>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
                {unplaced.map(item => (
                  <motion.div key={item.id} whileHover={{ y: -2 }} onClick={() => setSelected(selected === item.id ? null : item.id)}
                    style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '12px', color: selected === item.id ? '#fff' : 'rgba(255,255,255,0.65)', cursor: 'pointer', background: selected === item.id ? `${ACCENT}30` : 'rgba(255,255,255,0.05)', border: `1px solid ${selected === item.id ? ACCENT : 'rgba(255,255,255,0.08)'}`, transition: 'all 0.15s' }}>
                    {item.text}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {qbrBuckets.map(bucket => (
              <motion.div key={bucket.id} onClick={() => place(bucket.id)} whileHover={selected ? { scale: 1.02 } : {}}
                style={{ borderRadius: '10px', border: `1px solid ${selected ? bucket.color : bucket.color + '30'}`, padding: '12px', cursor: selected ? 'pointer' : 'default', background: selected ? `${bucket.color}10` : 'rgba(255,255,255,0.02)', transition: 'all 0.2s', minHeight: '80px' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: bucket.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '2px' }}>{bucket.label.toUpperCase()}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>{bucket.desc}</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '4px' }}>
                  {qbrItems.filter(i => placed[i.id] === bucket.id).map(item => (
                    <div key={item.id} style={{ padding: '4px 8px', borderRadius: '5px', fontSize: '10px', background: feedback[item.id] ? `${bucket.color}20` : '#7f1d1d20', border: `1px solid ${feedback[item.id] ? bucket.color + '50' : '#f87171'}`, color: feedback[item.id] ? 'rgba(255,255,255,0.7)' : '#f87171' }}>
                      {feedback[item.id] ? '✓' : '✗'} {item.text.length > 45 ? item.text.slice(0, 45) + '…' : item.text}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          {/* Reasoning for wrong placements */}
          {qbrItems.filter(i => revealed[i.id] && !feedback[i.id]).map(item => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: '12px', color: '#fca5a5' }}>
              <strong>{item.text.slice(0, 50)}…</strong> — {item.reason}
            </motion.div>
          ))}
          {allPlaced && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '16px', padding: '16px 20px', borderRadius: '10px', background: score >= 6 ? `rgba(${ACCENT_RGB},0.1)` : 'rgba(255,255,255,0.04)', border: `1px solid ${score >= 6 ? ACCENT + '60' : 'rgba(255,255,255,0.08)'}`, textAlign: 'center' as const }}>
              <div style={{ fontSize: '22px', marginBottom: '8px' }}>{score >= 6 ? '🎯' : '📊'}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#F0E8D8', marginBottom: '6px' }}>{score}/8 correct — {score >= 6 ? 'Strong exec instincts.' : 'Review the reasoning above.'}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Executives do not need a feature diary. They need a legible view of business progress, risk, and decisions needed.</div>
            </motion.div>
          )}
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// TOOL 3 · ROADMAP NEGOTIATION ROOM (Parts 5–6)
// ─────────────────────────────────────────
const customerQuestions = [
  {
    id: 'rq1',
    question: 'Can you commit the SSO enhancement by Q3? Our renewal depends on it.',
    buckets: ['Committed Q3', 'Planned — no date', 'Exploring', 'Not prioritised'],
    correctBucket: 1,
    responses: [
      { text: 'Yes, SSO is committed for Q3.', type: 'overcommit', feedback: 'This creates a contractual expectation internally. Only commit what is formally scheduled.' },
      { text: 'SSO enhancement is planned and a priority — we\'re not committing Q3 yet, but it\'s not exploratory. Let\'s revisit in 4 weeks with more certainty.', type: 'precise', feedback: 'This is the gold standard: honest, useful, preserves trust, and gives the customer a signal without a false date.' },
      { text: 'We\'re exploring SSO improvements.', type: 'too-vague', feedback: '"Exploring" signals low priority. If it\'s planned, say planned — don\'t under-communicate either.' },
    ],
    correctResponse: 1,
  },
  {
    id: 'rq2',
    question: 'Can you add custom workflow triggers just for our account?',
    buckets: ['Committed Q3', 'Planned — no date', 'Exploring', 'Not prioritised'],
    correctBucket: 2,
    responses: [
      { text: 'Yes, we can build that for you specifically.', type: 'overcommit', feedback: 'Never promise custom builds in a call. This creates contractual and engineering obligations you don\'t have authority to make.' },
      { text: 'Custom workflow triggers are something we\'re actively looking at for enterprise accounts. We\'re not ready to commit — but I\'d like to understand your specific need better so we can feed it into our planning.', type: 'precise', feedback: 'This is strategic: it\'s honest, it builds trust, and it opens a discovery conversation that could directly influence roadmap.' },
      { text: 'That\'s not on our roadmap.', type: 'too-vague', feedback: 'Technically safe but commercially damaging. A flat no without exploration leaves revenue on the table.' },
    ],
    correctResponse: 1,
  },
  {
    id: 'rq3',
    question: 'Is analytics export definitely happening this year?',
    buckets: ['Committed Q3', 'Planned — no date', 'Exploring', 'Not prioritised'],
    correctBucket: 1,
    responses: [
      { text: 'Definitely this year — we\'re fully committed.', type: 'overcommit', feedback: '"Definitely" without a committed timeline is a false certainty. You\'re setting an expectation you may not keep.' },
      { text: 'Analytics export is high-priority and planned — we have not committed a specific quarter yet. We expect to have more clarity in 60 days.', type: 'precise', feedback: 'This gives the customer a signal without a date promise. The "60 days" sets a check-in that keeps trust moving.' },
      { text: 'I can\'t say yet.', type: 'too-vague', feedback: 'Deflection without direction. You know it\'s planned — communicate that.' },
    ],
    correctResponse: 1,
  },
];
const responseTypeColors: Record<string, string> = { overcommit: '#dc2626', precise: '#059669', 'too-vague': '#d97706' };
const responseTypeLabels: Record<string, string> = { overcommit: 'Overcommitted', precise: 'Precise & trusted', 'too-vague': 'Too vague' };

const RoadmapNegotiationRoom = () => {
  const [chosenResponse, setChosenResponse] = useState<Record<string, number | null>>({});
  const [chosenBucket, setChosenBucket] = useState<Record<string, number | null>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const submit = (qId: string) => {
    if (chosenResponse[qId] !== undefined && chosenBucket[qId] !== undefined) {
      setRevealed(prev => ({ ...prev, [qId]: true }));
    }
  };

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #1e293b', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        <div style={{ background: '#0F1B2D', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
            Roadmap Negotiation Room · CloudBridge Enterprise Call
          </div>
        </div>
        <div style={{ background: '#060F1A', padding: '20px', display: 'flex', flexDirection: 'column' as const, gap: '24px' }}>
          {customerQuestions.map((q, qi) => (
            <div key={q.id} style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              {/* Question */}
              <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '6px' }}>ENTERPRISE CUSTOMER · QUESTION {qi + 1}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#F0E8D8', fontStyle: 'italic' }}>&ldquo;{q.question}&rdquo;</div>
              </div>
              <div style={{ padding: '16px' }}>
                {/* Response options */}
                <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>YOUR RESPONSE</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '14px' }}>
                  {q.responses.map((r, ri) => {
                    const chosen = chosenResponse[q.id] === ri;
                    const show = revealed[q.id];
                    return (
                      <motion.div key={ri} whileHover={!show ? { x: 3 } : {}} onClick={() => !show && setChosenResponse(prev => ({ ...prev, [q.id]: ri }))}
                        style={{ padding: '10px 14px', borderRadius: '8px', cursor: show ? 'default' : 'pointer', border: `1px solid ${show ? responseTypeColors[r.type] + '60' : chosen ? ACCENT + '80' : 'rgba(255,255,255,0.08)'}`, background: show ? `${responseTypeColors[r.type]}10` : chosen ? `${ACCENT}15` : 'rgba(255,255,255,0.03)', transition: 'all 0.15s' }}>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.55 }}>{r.text}</div>
                        {show && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{ marginTop: '8px', paddingTop: '8px', borderTop: `1px solid ${responseTypeColors[r.type]}30`, display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, color: responseTypeColors[r.type], background: `${responseTypeColors[r.type]}20`, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" }}>{responseTypeLabels[r.type]}</span>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{r.feedback}</span>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                {/* Roadmap bucket */}
                <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>PLACE ON ROADMAP</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const, marginBottom: '12px' }}>
                  {q.buckets.map((b, bi) => {
                    const chosen = chosenBucket[q.id] === bi;
                    const show = revealed[q.id];
                    const isCorrect = bi === q.correctBucket;
                    return (
                      <motion.button key={bi} whileHover={!show ? { y: -2 } : {}} onClick={() => !show && setChosenBucket(prev => ({ ...prev, [q.id]: bi }))}
                        style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: chosen ? 700 : 400, cursor: show ? 'default' : 'pointer', border: `1px solid ${show && isCorrect ? '#059669' : show && chosen && !isCorrect ? '#dc2626' : chosen ? ACCENT + '80' : 'rgba(255,255,255,0.1)'}`, background: show && isCorrect ? '#05966920' : show && chosen && !isCorrect ? '#dc262620' : chosen ? `${ACCENT}20` : 'transparent', color: show && isCorrect ? '#059669' : show && chosen && !isCorrect ? '#f87171' : 'rgba(255,255,255,0.6)', transition: 'all 0.15s' }}>
                        {b}
                      </motion.button>
                    );
                  })}
                </div>
                {!revealed[q.id] && (
                  <motion.button whileHover={{ opacity: 0.85 }} onClick={() => submit(q.id)}
                    disabled={chosenResponse[q.id] == null || chosenBucket[q.id] == null}
                    style={{ padding: '8px 20px', borderRadius: '6px', background: chosenResponse[q.id] != null && chosenBucket[q.id] != null ? ACCENT : 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', width: '100%', opacity: chosenResponse[q.id] == null || chosenBucket[q.id] == null ? 0.4 : 1 }}>
                    Submit →
                  </motion.button>
                )}
              </div>
            </div>
          ))}
          {Object.keys(revealed).length === customerQuestions.length && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              style={{ padding: '16px 20px', borderRadius: '10px', background: `rgba(${ACCENT_RGB},0.1)`, border: `1px solid ${ACCENT}40`, textAlign: 'center' as const }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#F0E8D8', marginBottom: '6px' }}>Strong roadmap communication balances honesty, usefulness, and strategic discipline.</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>In B2B PM, your words can shape pipeline, renewals, and trust. Precision matters.</div>
            </motion.div>
          )}
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// EXPORT DEFAULT
// ─────────────────────────────────────────
export default function Track2CommunicationPM({
  completedSections = new Set<string>(),
}: {
  completedSections?: Set<string>;
}) {
  const donePct  = Math.round((completedSections.size / PARTS.length) * 100);
  const nextPart = PARTS.find(p => !completedSections.has(p.id));

  return (
    <article style={{ padding: '0 0 80px' }}>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', padding: '72px 0 48px', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-20px', top: '-10px', fontSize: 'clamp(140px, 18vw, 220px)', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.06)`, fontFamily: "'Lora', Georgia, serif", letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>{MODULE_NUM}</div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '14px', textTransform: 'uppercase' as const }}>
              PM Fundamentals &middot; Module {MODULE_NUM} &middot; Scale Track
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.03em', color: 'var(--ed-ink)', marginBottom: '16px', fontFamily: "'Lora', Georgia, serif" }}>
              {MODULE_LABEL}
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ed-ink2)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '560px' }}>
              You already know how to communicate. This module is about communication at scale — calibrating across conflicting stakeholders, running exec QBRs, negotiating enterprise roadmaps, and building a system that works without you in the room.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '40px' }}>
              {([
                { mentor: 'priya' as const, accent: ACCENT,    name: 'Aarav', role: 'Senior PM · CloudBridge', desc: 'Leading the AI Workflow Assistant launch across product, GTM, and enterprise accounts.' },
                { mentor: 'kiran' as const, accent: '#7843EE', name: 'Leena', role: 'VP Product',              desc: 'Sets the strategic bar. Expects outcome-led updates, not activity reports.' },
                { mentor: 'rohan' as const, accent: '#E67E22', name: 'Farah', role: 'Sales Director',          desc: 'Wants broader promises. Represents commercial pressure at its sharpest.' },
                { mentor: 'dev'   as const, accent: '#3A86FF', name: 'Neeraj', role: 'Principal Engineer',     desc: 'Wants narrower scope. Committed to a date he will not miss.' },
                { mentor: 'asha'  as const, accent: '#0097A7', name: 'Sana', role: 'Strategy / RevOps',        desc: 'Brings the cross-functional view Aarav keeps missing.' },
              ]).map(c => (
                <div key={c.mentor + c.name} style={{ background: `${c.accent}0D`, border: `1px solid ${c.accent}33`, borderRadius: '10px', padding: '14px 16px', minWidth: '140px', flex: '1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <MentorFace mentor={c.mentor} size={40} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: c.accent, lineHeight: 1.2 }}>{c.name}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.04em' }}>{c.role}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{c.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '20px 24px', borderLeft: `4px solid ${ACCENT}`, border: '1px solid var(--ed-rule)', borderLeftWidth: '4px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '12px', textTransform: 'uppercase' as const }}>What you&apos;ll be able to do</div>
              {[
                'Calibrate communication across stakeholders with conflicting incentives — without losing truth',
                'Run an exec QBR that makes the state of the business legible, not just impressive',
                'Negotiate roadmap conversations with enterprise customers without overcommitting',
              ].map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 2 ? '10px' : 0, alignItems: 'flex-start' }}>
                  <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '12px', marginTop: '2px' }}>0{i + 1}</span>
                  <span style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dark module card */}
          <div style={{ flexShrink: 0, width: '168px', paddingTop: '48px' }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <div className="float3d" style={{ transformStyle: 'preserve-3d' }}>
                <div style={{ background: 'linear-gradient(145deg, #1A1218 0%, #241228 100%)', borderRadius: '14px', padding: '20px 18px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE {MODULE_NUM}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>{MODULE_LABEL}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(240,232,216,0.45)', marginBottom: '16px' }}>Scale Track</div>
                  <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '14px' }}>
                    <motion.div animate={{ width: `${donePct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ height: '100%', background: ACCENT, borderRadius: '1px' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                    {PARTS.map(p => {
                      const done = completedSections.has(p.id);
                      const isNext = p.id === nextPart?.id;
                      return (
                        <div key={p.num} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, background: done ? '#0D7A5A' : isNext ? ACCENT : 'rgba(255,255,255,0.06)', border: `1px solid ${done ? '#0D7A5A' : isNext ? ACCENT : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: done || isNext ? '#fff' : 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, transition: 'background 0.3s, border-color 0.3s' }}>
                            {done ? '✓' : p.num}
                          </div>
                          <div style={{ fontSize: '9px', color: done ? 'rgba(240,232,216,0.5)' : isNext ? 'rgba(240,232,216,0.9)' : 'rgba(240,232,216,0.3)', lineHeight: 1.3, flex: 1, transition: 'color 0.3s' }}>
                            {p.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: '16px', padding: '8px 10px', borderRadius: '6px', background: `${ACCENT}22`, border: `1px solid ${ACCENT}44` }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: ACCENT, fontWeight: 700, marginBottom: '2px' }}>{donePct === 100 ? 'COMPLETE' : 'NEXT UP'}</div>
                    <div style={{ fontSize: '9px', color: 'rgba(240,232,216,0.6)' }}>{donePct === 100 ? 'All 7 parts done' : nextPart ? nextPart.label : 'Communication as Leverage'}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── PART 1 · COMMUNICATION AS LEVERAGE ── */}
      <ChapterSection id="m6-comm-job" num="01" accentRgb={ACCENT_RGB} first>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Six weeks before launch, Aarav notices something wrong that has nothing to do with the product. Sales is telling one story to prospects. Leadership is hearing another from the board update. Engineering is solving a slightly different problem than what got signed off. And enterprise customers are expecting capabilities that are still exploratory. The product is fine. The communication is broken.
        </SituationCard>

        {para(<>This is the senior PM communication problem. Not that people don&apos;t understand you. That your communication system has too many gaps, and each team is filling the gaps with their own assumptions.</>)}

        {h2(<>Communication as an operating lever</>)}

        <div style={glassCard(ACCENT, ACCENT_RGB)}>
          {demoLabel('Why senior PM communication is different', ACCENT)}
          {para(<>At junior levels, communication is about clarity: can the other person understand what I mean? At senior levels, it is about leverage: am I reducing decision friction at scale, without being in every room?</>)}
          {keyBox('What senior PM communication actually does', [
            'Reduces decision friction — fewer escalations, fewer conflicting assumptions',
            'Aligns multiple functions — not just informing, actively synchronising',
            'Prevents escalation — stakeholders who feel informed don\'t need to go around you',
            'Creates trust in uncertainty — people will tolerate ambiguity if you communicate it well',
          ])}
        </div>

        <ConversationScene
          mentor="asha" name="Sana" role="Strategy · CloudBridge" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "Farah from Sales is promising features I haven't committed. Neeraj is scoping for a different problem than what leadership approved. How does this happen?" },
            { speaker: 'other', text: "It happens when your communication system has too many gaps and too few shared artifacts. Everyone fills the gaps with their own context." },
            { speaker: 'priya', text: "So I need to be in more rooms." },
            { speaker: 'other', text: "No. You need fewer gaps. The senior PM move is to build a system that communicates even when you're not there." },
          ]}
        />

        {pullQuote("The more senior the PM, the less their job is execution alone, and the more it is alignment at scale.")}

        <PMPrincipleBox principle="Communication is leverage. Every hour you invest in reducing ambiguity multiplies the quality of decisions your team makes without you." />

        <ApplyItBox prompt="Map your current launch or initiative. List every function involved. For each, write one sentence: what do they currently believe about the goal, and is that belief accurate? The gaps you find are your communication debt." />

        <QuizEngine
          conceptId="pm-communication-basics"
          conceptName="Communication as Leverage"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "pm-communication-basics",
            question: "A senior PM's org is misaligned — sales is telling one story, engineering is solving a slightly different problem, and leadership is hearing another. What is the most likely root cause?",
            options: ['Poor hiring decisions across functions', 'The PM is not communicating frequently enough', 'The PM\'s communication system has too many gaps — each function is filling them with their own assumptions', 'Leadership is not paying attention'],
            correctIndex: 2,
            explanation: "Misalignment at scale is almost always a communication system problem, not a frequency problem. More updates to a broken system just creates more noise.",
          }}
        />
      </ChapterSection>

      {/* ── PART 2 · STAKEHOLDER CALIBRATION ── */}
      <ChapterSection id="m6-stakeholders" num="02" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Aarav has a launch alignment meeting in three days. Sales wants broader promises. Engineering wants narrower scope. Leadership wants urgency. CS wants predictability. All four are reasonable. All four conflict. His mistake last quarter was trying to find the message that satisfied all four simultaneously. It satisfied none.
        </SituationCard>

        {h2(<>Stakeholder calibration, not compromise</>)}

        {para(<>The junior PM instinct is to find a middle message — something that nobody objects to. The senior PM move is different: understand what each stakeholder actually needs to act well, and give them that — even if the messages look different on the surface. This is not spin. It is precision.</>)}

        <StakeholderCalibrationRoom />

        <ConversationScene
          mentor="asha" name="Sana" role="Strategy · CloudBridge" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "If I give Farah and Neeraj different messages, won't they compare notes and think I'm saying different things to different people?" },
            { speaker: 'other', text: "Yes, if the messages contradict each other. No, if they're anchored to the same truth but framed for different decisions." },
            { speaker: 'priya', text: "So the truth stays consistent, but the framing changes." },
            { speaker: 'other', text: "Exactly. The scope is what it is. What changes is which part of that scope matters most to each stakeholder — and how you show them you understand their constraint." },
          ]}
        />

        {h2(<>Pre-wiring: the alignment that happens before the meeting</>)}

        {para(<>Senior PMs rarely use a big meeting to achieve alignment. They use big meetings to confirm alignment they have already built. The real work happens in 1:1 conversations, decision memos, and early previews — before anyone is in a room together with an audience to perform to.</>)}

        {keyBox('Pre-wiring toolkit', [
          'Stakeholder map: power × interest × influence — who needs to be aligned before the meeting, in what order',
          'Pre-call the difficult stakeholder: surface objections privately before they become public theatre',
          'Decision memo: circulate the decision and rationale 48h before the meeting so people have time to think',
          'Frame disagreement explicitly: "I know engineering and sales are in tension here — here\'s how I\'m thinking about the tradeoff"',
        ])}

        {pullQuote("Alignment rarely happens live in one meeting. It is often earned before the meeting begins.")}

        <PMPrincipleBox principle="Don't try to satisfy every stakeholder with the same message. Give each stakeholder the framing that helps them act well — anchored to the same underlying truth." />

        <ApplyItBox prompt="For your next cross-functional meeting, identify the two stakeholders most likely to be in tension. Have a 15-minute pre-call with each — separately — before the meeting. Your goal: understand their concern, not resolve it. Then use what you learn to frame the meeting agenda." />

        <QuizEngine
          conceptId="stakeholder-communication"
          conceptName="Stakeholder Calibration"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "stakeholder-communication",
            question: "Sales wants broader promises. Engineering wants narrower scope. A big alignment meeting is in 3 days. What is the strongest senior PM move?",
            options: ['Find a compromise message that does not fully satisfy either', 'Send a detailed written update to both and let them resolve it', 'Have separate 1:1s with each stakeholder before the meeting to surface tension and pre-align', 'Escalate to leadership and let them decide'],
            correctIndex: 2,
            explanation: "Pre-wiring converts conflict from public theatre to structured tradeoff. Separate conversations let you understand each position without either party performing to an audience.",
          }}
        />
      </ChapterSection>

      {/* ── PART 3 · PRD WRITING WITH AI FOR SENIOR PMS ── */}
      <ChapterSection id="m6-prd" num="03" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Aarav is working with messy inputs: market feedback from three enterprise accounts, a set of customer escalations from CS, notes from twelve sales calls, technical constraints from Neeraj, and three competing design options from Anika. A junior PM would use AI to summarise. Aarav uses AI to find contradictions.
        </SituationCard>

        {h2(<>AI as a strategic drafting partner, not a writing assistant</>)}

        {para(<>At the senior level, the PRD problem is not structure — you know the structure. The problem is synthesis. Fourteen inputs, five stakeholder perspectives, three technical constraints, and one launch deadline. AI should help you see what contradicts, what is missing, and what assumptions you are making that have not been validated.</>)}

        <div style={glassCard(ACCENT, ACCENT_RGB)}>
          {demoLabel('Senior-level AI prompts — not just faster, better', ACCENT)}
          {keyBox('Use AI to surface the hard problems', [
            '"What assumptions in these notes are not validated by evidence?" — exposes weak reasoning',
            '"What contradictions exist between the sales notes and the engineering constraints?" — finds structural tension',
            '"Generate three different PRD framings for different audiences: engineering, GTM, and board" — forces clarity',
            '"What risks are implied but not stated in this draft?" — finds the gaps you are avoiding',
            '"If this PRD is wrong, where is it most likely wrong?" — stress-tests your own thinking',
          ])}
        </div>

        {h2(<>The advanced PRD structure</>)}

        {keyBox('Senior PRD sections that junior PRDs skip', [
          'Strategic context — why does this initiative exist now, and what would we do instead?',
          'Who this is NOT for — being explicit about exclusions prevents scope creep',
          'Risks and assumptions — stated clearly, not buried in footnotes',
          'GTM implications — what does sales / CS / marketing need to know before we ship?',
          'Decision log — what was considered and rejected, and why',
          'Unresolved questions — what must be answered before we commit fully?',
        ])}

        <ConversationScene
          mentor="kiran" name="Leena" role="VP Product · CloudBridge" accent="#7843EE"
          lines={[
            { speaker: 'priya', text: "I used AI to draft the PRD. It looks clean." },
            { speaker: 'other', text: "Does it have a decision log? Does it say what we rejected and why?" },
            { speaker: 'priya', text: "Not yet." },
            { speaker: 'other', text: "At senior level, AI should improve decision quality, not just writing speed. A polished PRD with no decision log is a document that will repeat the same debates three months from now." },
          ]}
        />

        {pullQuote("At senior levels, AI should improve decision quality, not just writing speed.")}

        <PMPrincipleBox principle="The most valuable part of a senior PM's PRD is not the solution section. It is the decision log — what was considered, rejected, and why." />

        <ApplyItBox prompt="Take your current most complex PRD or spec. Run this prompt against it: 'What assumptions in this document are not backed by evidence? What contradictions exist between sections? What risks are implied but not stated?' Fix the three most important gaps you find." />

        <QuizEngine
          conceptId="prd-with-ai"
          conceptName="Senior PRD Writing with AI"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "prd-with-ai",
            question: "A senior PM uses AI to draft a PRD and gets a clean, well-structured document. What is the most important next step?",
            options: ['Share it with the team immediately — it is ready', 'Use AI to improve the wording further', 'Check whether the AI-generated framing, assumptions, and decision rationale are actually correct', 'Add more features to the scope while the draft is clean'],
            correctIndex: 2,
            explanation: "A clean document can hide weak reasoning. At senior level, AI output should trigger scrutiny on the decisions embedded in it — not confidence in the presentation.",
          }}
        />
      </ChapterSection>

      {/* ── PART 4 · STORYTELLING & EXEC QBRS ── */}
      <ChapterSection id="m6-storytelling" num="04" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Aarav&apos;s first quarterly review with the leadership team runs 40 minutes over. He covered everything: feature velocity, NPS trend, churn reduction, adoption numbers, 14 feature updates, customer escalations, one engineering dependency, and one key risk. Leena&apos;s feedback was three words: <strong>&ldquo;Too much product.&rdquo;</strong>
        </SituationCard>

        {h2(<>Exec storytelling is not presentation design</>)}

        {para(<>Most PMs improve their exec communication by making slides look better. That is the wrong problem. The issue is framing: are you presenting a feature diary, or making the state of the business legible? Executives need to answer a narrow set of questions. Everything else is noise.</>)}

        <div style={glassCard(ACCENT, ACCENT_RGB)}>
          {demoLabel('The exec QBR framework — five questions, in order', ACCENT)}
          {keyBox('Structure every exec update around these', [
            '1. What outcome were we trying to drive? (Not what we built — what changed?)',
            '2. What happened? (Actual result vs target — just the number)',
            '3. What did we learn? (One insight that changes how we think)',
            '4. What risk or blocker matters now? (The thing that could hurt the business)',
            '5. What decision or support do we need? (The explicit ask — no ask = no action)',
          ])}
        </div>

        <ExecReviewTheater />

        <ConversationScene
          mentor="kiran" name="Leena" role="VP Product · CloudBridge" accent="#7843EE"
          lines={[
            { speaker: 'priya', text: "I removed the 14 feature updates and led with churn reduction and the SSO risk. Is that right?" },
            { speaker: 'other', text: "Almost. The churn number is the outcome. But I still need to know what decision you need from me — you buried the ask in slide 9." },
            { speaker: 'priya', text: "The ask is engineering headcount for analytics." },
            { speaker: 'other', text: "Lead with that. An exec QBR where I leave without making a decision is a wasted room. Your job is to make the ask unavoidable." },
          ]}
        />

        {pullQuote("Exec communication is not about showing work. It is about making the state of the business legible.")}

        <PMPrincipleBox principle="A QBR where leadership leaves without making a decision is a failed QBR. Your job is to make the ask unavoidable — not buried on slide 9." />

        <ApplyItBox prompt="Take your last leadership update. Rewrite it using only these five sections: outcome we were targeting, what happened, what we learned, what risk matters now, what we need. If the rewrite is shorter, it is almost certainly better." />

        <QuizEngine
          conceptId="pm-storytelling"
          conceptName="Exec QBR Storytelling"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "pm-storytelling",
            question: "A senior PM prepares a thorough QBR covering 14 feature updates, velocity stats, NPS, churn, and adoption. Leadership says 'too much product.' What should change?",
            options: ['Present the same content in a shorter deck', 'Remove all metrics and focus on features only', 'Reframe from activity to outcomes: lead with business results, learning, risk, and a specific leadership ask', 'Add more context to help leadership understand the product work'],
            correctIndex: 2,
            explanation: "The problem is not length — it is framing. Executives need outcomes, risk, and decision asks. A product diary, however thorough, does not serve their decision-making needs.",
          }}
        />
      </ChapterSection>

      {/* ── PART 5 · B2B SALES & ROADMAP COMMS ── */}
      <ChapterSection id="m6-b2b" num="05" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          A key enterprise account is at risk. Farah from sales asks Aarav to join the call. The customer asks three things: is SSO improving? When is analytics export coming? Can we get custom workflow triggers? Aarav knows each answer — but the question is not what the truth is. The question is how to say it in a way that is honest, useful, and strategically safe.
        </SituationCard>

        {h2(<>B2B PM communication is different from internal communication</>)}

        {para(<>In B2B, a PM&apos;s words can shape pipeline, renewals, and trust at scale. One overcommit in a customer call can become a contractual obligation. One vague answer can cost a renewal. The discipline is not saying less — it is saying exactly the right amount with the right precision.</>)}

        <RoadmapPressureChamber />

        <div style={glassCard(ACCENT, ACCENT_RGB)}>
          {demoLabel('The B2B PM communication toolkit', ACCENT)}
          {keyBox('Artifacts senior PMs build for GTM', [
            'Sales battlecard — what we solve, what we don\'t, how to position against competitors',
            'Enablement note — what sales can and cannot say about upcoming features',
            'Roadmap narrative — themes and confidence levels, not a date-by-feature list',
            'Customer-facing FAQ — pre-approved answers to the top 10 questions CS receives',
            'Account escalation template — how to communicate timeline changes without losing trust',
          ])}
        </div>

        {pullQuote("In B2B PM, your words can shape pipeline, renewals, and trust. Precision matters.")}

        <PMPrincipleBox principle="Build the enablement artifact before the sales call, not after. If your GTM team is improvising answers to customer questions, you have a communication system failure." />

        <ApplyItBox prompt="For your next launch, write a 'what to say / what not to say' guide for sales and CS before they start customer conversations. Include the exact language for: what is committed, what is planned, what is exploratory, and what is not prioritised." />

        <QuizEngine
          conceptId="b2b-pm-communication"
          conceptName="B2B Roadmap Communication"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "b2b-pm-communication",
            question: "An enterprise customer asks if a feature will be committed by Q3. The feature is planned but not yet scheduled. What is the strongest PM response?",
            options: ['Yes, we\'re targeting Q3 for that.', 'That\'s planned and a priority — we haven\'t committed Q3 yet, but let\'s revisit in 4 weeks with more certainty.', 'I can\'t comment on roadmap timelines.', 'Ask your account manager for the latest roadmap.'],
            correctIndex: 1,
            explanation: "This response is honest about current state, gives the customer a useful signal, sets a check-in expectation, and avoids creating a false date commitment. Precision builds trust.",
          }}
        />
      </ChapterSection>

      {/* ── PART 6 · ROADMAP UNDER PRESSURE ── */}
      <ChapterSection id="m6-conflict" num="06" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          After the customer call, Farah escalates. <strong>&ldquo;We are going to lose this account if we don&apos;t commit SSO by Q3. I need you to put it on the roadmap.&rdquo;</strong> This is the moment most PMs either overcommit to end the pressure, or issue a blanket refusal that damages the relationship. Neither is the move.
        </SituationCard>

        {h2(<>Holding the line without losing the relationship</>)}

        {para(<>Roadmap pressure from sales is not a product problem — it is a communication problem. When a sales team feels they have to escalate to get a roadmap answer, it means the PM&apos;s proactive communication has not given them enough to work with. The fix is not better pushback. It is a better system.</>)}

        <ConversationScene
          mentor="rohan" name="Farah" role="Sales Director · CloudBridge" accent="#E67E22"
          lines={[
            { speaker: 'other', text: "I need SSO committed for Q3. This is a deal-breaker for the account." },
            { speaker: 'priya', text: "I understand the commercial risk. Here's what I can tell you: SSO is planned and a priority. I can't commit Q3 yet because we have one unresolved dependency. I'll have a clearer answer in three weeks. Can you buy that time?" },
            { speaker: 'other', text: "Three weeks might be too late for the deal." },
            { speaker: 'priya', text: "Then let's talk about what we CAN commit right now that gives the account confidence while we resolve the dependency. What's the minimum signal that keeps the renewal conversation open?" },
          ]}
        />

        {keyBox('The senior PM move under roadmap pressure', [
          '1. Acknowledge the commercial impact — don\'t minimise the business concern',
          '2. Clarify what is actually true — committed, planned, exploring, or not prioritised',
          '3. Give a timeline for when you will have more certainty — not a date for the feature',
          '4. Offer what you CAN give — partial commitment, a signal, a check-in, a named DRI',
          '5. Separate the relationship from the decision — Farah is not the enemy; the ambiguity is',
        ])}

        {pullQuote("A roadmap is a communication tool, not a contract. But if you treat it carelessly, customers and GTM teams will treat it like one.")}

        <PMPrincipleBox principle="When you are under roadmap pressure, the ask is almost never really about the feature. It is about confidence. Find what creates confidence without false commitment." />

        <ApplyItBox prompt="Think of the last time you were pressured to commit something you weren't ready to commit. What was the underlying ask? Write the response you wish you had given — one that acknowledged the pressure, stated the truth, and offered something concrete." />

        <QuizEngine
          conceptId="difficult-conversations"
          conceptName="Roadmap Pressure Management"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "difficult-conversations",
            question: "Sales is pressuring a PM to commit a feature to Q3 to save a deal. The feature has an unresolved technical dependency. What is the strongest move?",
            options: ['Commit the feature to protect the deal and resolve the dependency later', 'Refuse to commit and let sales manage the customer relationship', 'Acknowledge the commercial risk, state the current truth, give a timeline for more certainty, and identify what signal can keep the deal alive now', 'Escalate to leadership and let them decide whether to commit'],
            correctIndex: 2,
            explanation: "The strongest move separates the relationship from the decision. You acknowledge the pressure, give the accurate state of the world, and find what creates confidence without a false date.",
          }}
        />
      </ChapterSection>

      {/* ── PART 7 · YOUR COMMUNICATION OPERATING SYSTEM ── */}
      <ChapterSection id="m6-executive" num="07" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Three months after the AI Workflow Assistant launch, Aarav looks back at what actually worked. Not the features. Not the QBR slides. What worked was a set of rituals and artifacts that reduced the number of times anyone had to ask him what was happening.
        </SituationCard>

        {h2(<>Build a system, not a habit</>)}

        {para(<>The most common senior PM communication failure is personality-dependent communication — a team that is well-aligned because their PM is available, responsive, and good at explaining things. That breaks the moment the PM is on holiday, in a difficult quarter, or managing more products than before. A mature communication system runs even when you are not in the room.</>)}

        <div style={glassCard(ACCENT, ACCENT_RGB)}>
          {demoLabel('The PM communication operating system — 8 artifacts', ACCENT)}
          {keyBox('Build these and maintain them', [
            '1. Weekly written product update — sent every Monday, one page, outcome-led',
            '2. Monthly stakeholder sync — agenda: what changed, what\'s at risk, what decisions are needed',
            '3. Decision log — a living document where every significant call is recorded with rationale',
            '4. PRD template — your team\'s shared standard for what a PRD must contain',
            '5. Launch brief — what GTM needs to know, in one doc, two days before launch',
            '6. Sales FAQ — pre-approved answers to the top 10 customer questions',
            '7. Roadmap narrative — themes, confidence levels, what is committed vs exploratory',
            '8. QBR template — the five-question structure your leadership reviews never deviate from',
          ])}
        </div>

        <ConversationScene
          mentor="asha" name="Sana" role="Strategy · CloudBridge" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "I'm writing a weekly update now. But I feel like nobody reads it." },
            { speaker: 'other', text: "Do they ask you the same questions that are in the update?" },
            { speaker: 'priya', text: "Yes, constantly." },
            { speaker: 'other', text: "Then they're not reading it — or it's not answering their real questions. Start by asking each stakeholder: what would make you feel informed without having to ask me anything? Then build that." },
          ]}
        />

        {pullQuote("Mature PM communication is not personality-dependent. It is system-supported.")}

        <PMPrincipleBox principle="The goal of a PM communication system is that your team can make good decisions without having to ask you. If you are the single point of alignment, you are a bottleneck, not a lever." />

        <ApplyItBox prompt="Audit your current communication system. For each of the 8 artifacts above, mark: exists and current / exists but stale / does not exist. Pick the two highest-impact gaps and build them this week — not perfectly, but usably." />

        <QuizEngine
          conceptId="executive-communication"
          conceptName="PM Communication Operating System"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "executive-communication",
            question: "A senior PM's team is well-aligned because the PM is always available and responsive. What is the biggest risk of this communication pattern?",
            options: ['The PM will become too popular and get promoted too fast', 'The alignment is personality-dependent and will break when the PM is unavailable or at scale', 'The team will not develop their own PM skills', 'Leadership will not recognise the PM\'s communication contribution'],
            correctIndex: 1,
            explanation: "Personality-dependent communication is a bottleneck, not a system. The goal is alignment that runs even when you're not in the room — which requires artifacts and rituals, not just availability.",
          }}
        />

        <NextChapterTeaser text="Next up: Analytics & Metrics — how senior PMs define north star metrics, build measurement frameworks, and act on data without being reactive to it." />
      </ChapterSection>

    </article>
  );
}

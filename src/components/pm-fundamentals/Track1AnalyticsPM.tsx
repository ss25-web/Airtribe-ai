'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  h2, para, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser, ApplyItBox, ConversationScene,
} from './designSystem';
import { MentorFace } from './MentorFaces';
import QuizEngine from '../QuizEngine';

const ACCENT     = '#158158';
const ACCENT_RGB = '21,129,88';
const MODULE_NUM = '07';
const MODULE_LABEL = 'Analytics & Metrics';

const PARTS = [
  { num: '01', id: 'm7-dashboard',       label: 'The Dashboard That Made Everyone Confident' },
  { num: '02', id: 'm7-north-star',      label: 'The Metric Everyone Wanted' },
  { num: '03', id: 'm7-success-metrics', label: 'The Search Improvement That "Worked"' },
  { num: '04', id: 'm7-funnel',          label: 'The Funnel Drop Everyone Explained Too Quickly' },
  { num: '05', id: 'm7-cohorts',         label: 'The Day the Average Lied' },
  { num: '06', id: 'm7-b2b',            label: 'The B2B Review' },
  { num: '07', id: 'm7-experiments',     label: 'The Experiment That "Won"' },
];

// ─────────────────────────────────────────
// PM PRINCIPLE CARD
// ─────────────────────────────────────────
const PMPrinciple = ({ text }: { text: string }) => (
  <div style={{ margin: '28px 0', padding: '20px 24px', background: `rgba(${ACCENT_RGB},0.06)`, borderLeft: `4px solid ${ACCENT}`, borderRadius: '0 8px 8px 0' }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', color: ACCENT, marginBottom: '8px', textTransform: 'uppercase' as const }}>PM Principle</div>
    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ed-ink)', lineHeight: 1.65, fontStyle: 'italic', fontFamily: "'Lora', serif" }}>&ldquo;{text}&rdquo;</div>
  </div>
);

// shared tool card shell
const ToolCard = ({ title, subtitle, icon, color, children }: { title: string; subtitle: string; icon: string; color: string; children: React.ReactNode }) => {
  // Parse hex to rgb for the tint
  const hex = color.replace('#', '');
  const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
  return (
    <div style={{ background: 'var(--ed-card)', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden', margin: '32px 0', border: `1px solid ${color}20` }}>
      <div style={{ padding: '14px 20px', background: `linear-gradient(135deg, ${color}20 0%, ${color}0C 100%)`, borderBottom: `1px solid ${color}25`, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{icon}</div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color, textTransform: 'uppercase' as const }}>{title}</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ padding: '24px', background: `linear-gradient(160deg, rgba(${r},${g},${b},0.05) 0%, rgba(${r},${g},${b},0.02) 100%)` }}>{children}</div>
    </div>
  );
};

// ─────────────────────────────────────────
// TOOL 1 · METRIC MAP BUILDER (Part 2)
// ─────────────────────────────────────────
const ALL_METRICS = [
  { id: 'dau',         label: 'Daily Active Users',       correct: 'secondary', warning: 'Broad activity — useful signal but doesn\'t reflect value directly.' },
  { id: 'signups',     label: 'New Signups',              correct: 'secondary', warning: 'Top-of-funnel only — says nothing about value delivered.' },
  { id: 'time_spent',  label: 'Time Spent',               correct: 'guardrail', warning: 'Can reward confusion. Monitor as a guardrail, not success.' },
  { id: 'completion',  label: 'Review Completion Rate',   correct: 'northstar', warning: null },
  { id: 'repeat',      label: 'Repeat Review Rate',       correct: 'secondary', warning: null },
  { id: 'search_success', label: 'Search Success Rate',   correct: 'secondary', warning: null },
  { id: 'retention',   label: '30-Day Retention',         correct: 'guardrail', warning: null },
  { id: 'invite',      label: 'Invite / Share Rate',      correct: 'secondary', warning: null },
  { id: 'churn',       label: 'Account Churn Rate',       correct: 'guardrail', warning: null },
  { id: 'activation',  label: 'Activation Rate',          correct: 'secondary', warning: null },
  { id: 'nps',         label: 'NPS Score',                correct: 'guardrail', warning: 'Lagging indicator — good to monitor but slow to react.' },
];

type Zone = 'northstar' | 'guardrail' | 'secondary';
const ZONES: { id: Zone; label: string; color: string; desc: string; max: number }[] = [
  { id: 'northstar', label: 'North Star',        color: '#158158', desc: '1 metric that best reflects user value',     max: 1 },
  { id: 'guardrail', label: 'Guardrails',         color: '#E67E22', desc: '2–3 metrics protecting against harmful wins', max: 3 },
  { id: 'secondary', label: 'Secondary Metrics', color: '#3A86FF', desc: 'Diagnostics that explain why things move',    max: 5 },
];

export function MetricMapBuilder() {
  const [placed, setPlaced] = useState<Record<string, Zone | null>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});
  const allPlaced = ALL_METRICS.every(m => placed[m.id]);

  const place = (zone: Zone) => {
    if (!selected) return;
    const metric = ALL_METRICS.find(m => m.id === selected)!;
    const isCorrect = metric.correct === zone;
    setPlaced(prev => ({ ...prev, [selected]: zone }));
    setFeedback(prev => ({ ...prev, [selected]: isCorrect }));
    setSelected(null);
  };

  const unplaced = ALL_METRICS.filter(m => !placed[m.id]);
  const score = ALL_METRICS.filter(m => feedback[m.id]).length;

  return (
    <ToolCard title="Metric Map Builder" subtitle="Place each metric into the right zone. Click a metric, then click a zone." icon="🗺️" color={ACCENT}>
      {/* Unplaced pool */}
      {unplaced.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '10px' }}>METRIC POOL</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
            {unplaced.map(m => (
              <motion.div key={m.id} whileHover={{ y: -2 }} onClick={() => setSelected(selected === m.id ? null : m.id)}
                style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '12px', color: 'var(--ed-ink)', cursor: 'pointer', background: selected === m.id ? `rgba(${ACCENT_RGB},0.12)` : 'var(--ed-card)', border: `1.5px solid ${selected === m.id ? ACCENT : 'var(--ed-rule)'}`, fontWeight: selected === m.id ? 600 : 400, transition: 'all 0.15s' }}>
                {m.label}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Zones */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {ZONES.map(zone => {
          const items = ALL_METRICS.filter(m => placed[m.id] === zone.id);
          const overLimit = items.length > zone.max;
          return (
            <motion.div key={zone.id} whileHover={selected ? { scale: 1.01 } : {}} onClick={() => place(zone.id)}
              style={{ borderRadius: '12px', border: `2px dashed ${selected ? zone.color : 'var(--ed-rule)'}`, padding: '14px', minHeight: '120px', cursor: selected ? 'pointer' : 'default', background: selected ? `${zone.color}08` : 'var(--ed-card)', transition: 'all 0.2s' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: zone.color, letterSpacing: '0.1em', marginBottom: '4px' }}>{zone.label.toUpperCase()}</div>
              <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginBottom: '10px', lineHeight: 1.4 }}>{zone.desc}</div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '5px' }}>
                {items.map(m => {
                  const correct = feedback[m.id];
                  return (
                    <div key={m.id} style={{ padding: '5px 10px', borderRadius: '6px', fontSize: '11px', background: correct ? `${zone.color}12` : 'rgba(220,38,38,0.08)', border: `1px solid ${correct ? zone.color + '40' : 'rgba(220,38,38,0.3)'}`, color: 'var(--ed-ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                      <span>{m.label}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: correct ? zone.color : '#dc2626' }}>{correct ? '✓' : '✗'}</span>
                    </div>
                  );
                })}
              </div>
              {overLimit && <div style={{ marginTop: '6px', fontSize: '10px', color: '#dc2626', fontWeight: 600 }}>⚠ Too many for this zone</div>}
            </motion.div>
          );
        })}
      </div>

      {/* Wrong placement hints */}
      {ALL_METRICS.filter(m => placed[m.id] && !feedback[m.id] && m.warning).map(m => (
        <motion.div key={m.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '6px', padding: '8px 14px', borderRadius: '8px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', fontSize: '12px', color: 'var(--ed-ink2)' }}>
          <strong>{m.label}:</strong> {m.warning}
        </motion.div>
      ))}

      {allPlaced && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: '14px 18px', borderRadius: '10px', background: score >= 8 ? `rgba(${ACCENT_RGB},0.08)` : 'var(--ed-cream)', border: `1px solid ${score >= 8 ? ACCENT : 'var(--ed-rule)'}`, textAlign: 'center' as const }}>
          <div style={{ fontSize: '20px', marginBottom: '6px' }}>{score >= 8 ? '🎯' : '📊'}</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '4px' }}>{score}/{ALL_METRICS.length} correct</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)' }}>Strong metric architecture: one north star, 2–3 guardrails, diagnostics as secondary.</div>
        </motion.div>
      )}
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 2 · NORTH STAR SIMULATOR (Part 3)
// ─────────────────────────────────────────
const NS_SCENARIOS = [
  {
    id: 'search', label: 'Search in a call-review app',
    candidates: [
      { id: 'searches_run',  label: 'Searches run per user',     strong: false, consequence: 'Users who fail repeatedly inflate this. Rewards friction, not success.' },
      { id: 'success_rate',  label: 'Search success rate',       strong: true,  consequence: 'Measures whether users actually found what they needed. Aligned with the problem.' },
      { id: 'time_in_search', label: 'Time spent in search',     strong: false, consequence: 'Longer time could mean confusion. Can reward a harder experience, not a better one.' },
      { id: 'screen_views',  label: 'Search screen views',       strong: false, consequence: 'Activity, not value. More views may mean more frustration.' },
    ],
  },
  {
    id: 'onboarding', label: 'Onboarding in an edtech product',
    candidates: [
      { id: 'signups',     label: 'New signups this week',        strong: false, consequence: 'Acquisition, not value. Users can sign up and immediately churn.' },
      { id: 'activation',  label: 'First meaningful action rate', strong: true,  consequence: 'Captures whether users actually experienced the core value. Closest to real activation.' },
      { id: 'page_views',  label: 'Onboarding page views',       strong: false, consequence: 'Passive activity. Viewing an onboarding page doesn\'t mean understanding it.' },
      { id: 'completion',  label: 'Onboarding step completion',  strong: true,  consequence: 'Good proxy — but watch for users rushing through without understanding.' },
    ],
  },
];

export function NorthStarSimulator() {
  const [scenario, setScenario] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const sc = NS_SCENARIOS[scenario];
  const candidate = sc.candidates.find(c => c.id === chosen);

  return (
    <ToolCard title="North Star Simulator" subtitle="Choose a scenario, then select the strongest success metric. See how each choice shapes product behavior." icon="⭐" color={ACCENT}>
      {/* Scenario selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {NS_SCENARIOS.map((s, i) => (
          <motion.button key={s.id} whileHover={{ y: -1 }} onClick={() => { setScenario(i); setChosen(null); }}
            style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: `2px solid ${scenario === i ? ACCENT : 'var(--ed-rule)'}`, background: scenario === i ? `rgba(${ACCENT_RGB},0.1)` : 'var(--ed-card)', color: scenario === i ? ACCENT : 'var(--ed-ink3)', transition: 'all 0.2s' }}>
            {s.label}
          </motion.button>
        ))}
      </div>

      <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '10px' }}>CANDIDATE NORTH STAR METRICS — click one to test it</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        {sc.candidates.map(c => (
          <motion.div key={c.id} whileHover={{ y: -2 }} onClick={() => setChosen(chosen === c.id ? null : c.id)}
            style={{ padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', border: `2px solid ${chosen === c.id ? (c.strong ? ACCENT : '#dc2626') : 'var(--ed-rule)'}`, background: chosen === c.id ? (c.strong ? `rgba(${ACCENT_RGB},0.08)` : 'rgba(220,38,38,0.06)') : 'var(--ed-card)', transition: 'all 0.2s' }}>
            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ed-ink)', marginBottom: '4px' }}>{c.label}</div>
            <AnimatePresence>
              {chosen === c.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: `1px solid ${c.strong ? ACCENT + '30' : 'rgba(220,38,38,0.2)'}`, fontSize: '12px', lineHeight: 1.6 }}>
                    <span style={{ fontWeight: 700, color: c.strong ? ACCENT : '#dc2626', marginRight: '4px' }}>{c.strong ? '✓ Strong choice.' : '✗ Risky choice.'}</span>
                    <span style={{ color: 'var(--ed-ink2)' }}>{c.consequence}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {!chosen && (
        <div style={{ padding: '10px 16px', borderRadius: '8px', background: `rgba(${ACCENT_RGB},0.06)`, border: `1px solid ${ACCENT}20`, fontSize: '12px', color: 'var(--ed-ink3)', textAlign: 'center' as const }}>
          Each metric shapes what the team optimizes for. Choose wisely — then see why it works or fails.
        </div>
      )}
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 3 · FUNNEL EXPLORER (Part 4)
// ─────────────────────────────────────────
const FUNNEL_STEPS = [
  { id: 'signup',   label: 'Signed Up',          users: 1000, color: '#3A86FF' },
  { id: 'upload',   label: 'Uploaded First Call', users: 720,  color: '#0097A7' },
  { id: 'analysis', label: 'Ran Analysis',        users: 390,  color: '#E67E22' },
  { id: 'results',  label: 'Viewed Results',      users: 310,  color: '#7843EE' },
  { id: 'share',    label: 'Shared Output',       users: 180,  color: ACCENT },
];

const INTERPRETATIONS: Record<string, string[]> = {
  upload:   ['Users are unsure what file format works', 'Some accounts need admin permission to upload', 'Mobile users may not have recordings accessible'],
  analysis: ['The analysis trigger isn\'t obvious after upload', 'Permission errors for some enterprise accounts (Dev flagged this)', 'Admins are dropping here — different reason than individuals', 'Users may think the upload was the final step'],
  results:  ['Email notification may not be reaching users', 'Results page has high load time in some regions', 'Some users may be reviewing results in a different tab'],
  share:    ['Output format doesn\'t match what managers want to receive', 'Users may share via copy-paste, not the in-app share button', 'Share feature may not be visible at the right moment'],
};

export function FunnelExplorer() {
  const [active, setActive] = useState<string | null>(null);
  const maxUsers = FUNNEL_STEPS[0].users;

  return (
    <ToolCard title="Funnel Explorer" subtitle="Click any stage to inspect the drop-off. Notice that each one has multiple plausible explanations." icon="📉" color="#E67E22">
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        {/* Bar chart */}
        <div style={{ flex: 1, background: 'var(--ed-card)', borderRadius: '12px', border: '1px solid var(--ed-rule)', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '12px' }}>ONBOARDING FUNNEL · EDSPARK</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', marginBottom: '8px' }}>
            {FUNNEL_STEPS.map((step, i) => {
              const prev = i > 0 ? FUNNEL_STEPS[i - 1].users : step.users;
              const dropPct = i > 0 ? Math.round((1 - step.users / prev) * 100) : 0;
              const heightPct = (step.users / maxUsers) * 100;
              const isActive = active === step.id;
              return (
                <motion.div key={step.id} style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'flex-end', height: '100%', cursor: i > 0 ? 'pointer' : 'default' }}
                  onClick={() => i > 0 && setActive(isActive ? null : step.id)}>
                  {i > 0 && dropPct > 0 && (
                    <div style={{ fontSize: '10px', fontWeight: 700, color: isActive ? '#dc2626' : 'var(--ed-ink3)', marginBottom: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
                      -{dropPct}%
                    </div>
                  )}
                  <motion.div animate={{ height: `${heightPct}%` }} initial={{ height: 0 }} transition={{ duration: 0.5, delay: i * 0.08 }}
                    style={{ width: '100%', borderRadius: '6px 6px 0 0', background: isActive ? '#dc2626' : step.color, opacity: isActive ? 1 : 0.8, transition: 'background 0.2s' }} />
                </motion.div>
              );
            })}
          </div>
          {/* Labels */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {FUNNEL_STEPS.map(step => (
              <div key={step.id} style={{ flex: 1, textAlign: 'center' as const }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'JetBrains Mono', monospace" }}>{step.users}</div>
                <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', lineHeight: 1.4, marginTop: '2px' }}>{step.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interpretations panel */}
        <div style={{ width: '220px', flexShrink: 0, background: 'var(--ed-card)', borderRadius: '12px', border: '1px solid var(--ed-rule)', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div key={active} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', color: '#dc2626', marginBottom: '10px' }}>
                  POSSIBLE REASONS FOR DROP-OFF
                </div>
                {INTERPRETATIONS[active]?.map((reason, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.55, marginBottom: '6px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#dc2626', flexShrink: 0 }}>?</span>
                    {reason}
                  </motion.div>
                ))}
                <div style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', fontSize: '11px', color: 'var(--ed-ink3)' }}>
                  A funnel shows <strong>where</strong> the journey breaks. The investigation tells you <strong>why</strong>.
                </div>
              </motion.div>
            ) : (
              <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ padding: '14px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>
                Click any bar with a drop-off to see the multiple possible explanations. Notice that a funnel never tells you which one is correct.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 4 · COHORT PLAYGROUND (Part 5)
// ─────────────────────────────────────────
const COHORT_DATA = {
  overall: [85, 71, 62, 58, 55, 54, 53],
  before:  [88, 76, 70, 68, 67, 66, 65],
  after:   [82, 65, 52, 44, 38, 35, 34],
};
const WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'];

export function CohortPlayground() {
  const [view, setView] = useState<'overall' | 'cohort'>('overall');

  const maxVal = 100;
  const colors = { before: '#3A86FF', after: '#dc2626', overall: ACCENT };

  return (
    <ToolCard title="Cohort Playground" subtitle="Toggle between Overall Average and Cohort View to see what averages hide." icon="📊" color={ACCENT}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['overall', 'cohort'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: `2px solid ${view === v ? ACCENT : 'var(--ed-rule)'}`, background: view === v ? `rgba(${ACCENT_RGB},0.1)` : 'var(--ed-card)', color: view === v ? ACCENT : 'var(--ed-ink3)', transition: 'all 0.2s' }}>
            {v === 'overall' ? '📈 Overall Average' : '🔬 Cohort View'}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: 'var(--ed-card)', borderRadius: '12px', border: '1px solid var(--ed-rule)', padding: '16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>RETENTION RATE OVER TIME</div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>EdSpark · Onboarding Cohorts</div>
        </div>
        <div style={{ position: 'relative' as const }}>
          {/* Y axis labels */}
          <div style={{ position: 'absolute' as const, left: 0, top: 0, bottom: '24px', width: '32px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between', alignItems: 'flex-end' }}>
            {[100, 75, 50, 25, 0].map(v => (
              <div key={v} style={{ fontSize: '9px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", paddingRight: '4px' }}>{v}%</div>
            ))}
          </div>
          <div style={{ marginLeft: '36px' }}>
            <svg width="100%" height="200" viewBox="0 0 560 200" preserveAspectRatio="none" style={{ display: 'block' }}>
              {/* Grid lines */}
              {[0, 50, 100, 150, 200].map(y => (
                <line key={y} x1="0" y1={y} x2="560" y2={y} stroke="var(--ed-rule)" strokeWidth="1" strokeDasharray={y === 200 ? 'none' : '4 4'} />
              ))}
              <AnimatePresence mode="wait">
                {view === 'overall' ? (
                  <g key="overall">
                    {/* Filled area */}
                    <polygon
                      points={`0,200 ${COHORT_DATA.overall.map((v, i) => `${i * 93.3},${200 - (v / 100) * 200}`).join(' ')} ${(COHORT_DATA.overall.length - 1) * 93.3},200`}
                      fill={`${colors.overall}18`}
                    />
                    <polyline points={COHORT_DATA.overall.map((v, i) => `${i * 93.3},${200 - (v / 100) * 200}`).join(' ')} fill="none" stroke={colors.overall} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {COHORT_DATA.overall.map((v, i) => (
                      <circle key={i} cx={i * 93.3} cy={200 - (v / 100) * 200} r="4" fill={colors.overall} stroke="var(--ed-card)" strokeWidth="2" />
                    ))}
                  </g>
                ) : (
                  <g key="cohort">
                    {/* Before fill */}
                    <polygon
                      points={`0,200 ${COHORT_DATA.before.map((v, i) => `${i * 93.3},${200 - (v / 100) * 200}`).join(' ')} ${(COHORT_DATA.before.length - 1) * 93.3},200`}
                      fill={`${colors.before}15`}
                    />
                    {/* After fill */}
                    <polygon
                      points={`0,200 ${COHORT_DATA.after.map((v, i) => `${i * 93.3},${200 - (v / 100) * 200}`).join(' ')} ${(COHORT_DATA.after.length - 1) * 93.3},200`}
                      fill="rgba(220,38,38,0.1)"
                    />
                    <polyline points={COHORT_DATA.before.map((v, i) => `${i * 93.3},${200 - (v / 100) * 200}`).join(' ')} fill="none" stroke={colors.before} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {COHORT_DATA.before.map((v, i) => (
                      <circle key={`b${i}`} cx={i * 93.3} cy={200 - (v / 100) * 200} r="4" fill={colors.before} stroke="var(--ed-card)" strokeWidth="2" />
                    ))}
                    <polyline points={COHORT_DATA.after.map((v, i) => `${i * 93.3},${200 - (v / 100) * 200}`).join(' ')} fill="none" stroke={colors.after} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 3" />
                    {COHORT_DATA.after.map((v, i) => (
                      <circle key={`a${i}`} cx={i * 93.3} cy={200 - (v / 100) * 200} r="4" fill={colors.after} stroke="var(--ed-card)" strokeWidth="2" />
                    ))}
                  </g>
                )}
              </AnimatePresence>
            </svg>
            {/* X labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              {WEEKS.map(w => <div key={w} style={{ fontSize: '9px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>{w}</div>)}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        {view === 'overall' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '20px', height: '3px', borderRadius: '2px', background: colors.overall }} /><span style={{ fontSize: '12px', color: 'var(--ed-ink2)' }}>Overall Retention</span></div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '20px', height: '3px', borderRadius: '2px', background: colors.before }} /><span style={{ fontSize: '12px', color: 'var(--ed-ink2)' }}>Before redesign</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '20px', height: '3px', borderRadius: '2px', background: colors.after }} /><span style={{ fontSize: '12px', color: 'var(--ed-ink2)' }}>After redesign</span></div>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {view === 'overall' ? (
          <motion.div key="overall" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: '12px 16px', borderRadius: '8px', background: `rgba(${ACCENT_RGB},0.06)`, border: `1px solid ${ACCENT}20`, fontSize: '12px', color: 'var(--ed-ink3)' }}>
            Overall retention looks stable. The room feels safe. But is this the full story? Switch to Cohort View.
          </motion.div>
        ) : (
          <motion.div key="cohort" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', fontSize: '12px', color: 'var(--ed-ink2)' }}>
            ⚠ Users after the redesign are retaining significantly worse by W4–W5. The average hid this because the older cohort&apos;s strong retention compensated. <strong>The redesign made the flow cleaner — but not the habit stronger.</strong>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 5 · B2B HEALTH DASHBOARD LAB (Part 6)
// ─────────────────────────────────────────
type B2BView = 'user' | 'account';
type B2BPerspective = 'product' | 'cs' | 'revenue' | 'leadership';

const USER_METRICS = [
  { label: 'Daily Active Users',     value: '1,240', trend: '+8%', color: '#3A86FF', note: 'Shows activity — not account health' },
  { label: 'Avg Session Length',     value: '12 min', trend: '+2%', color: '#0097A7', note: 'Individual engagement signal' },
  { label: 'Feature Usage Rate',     value: '67%',  trend: '+5%', color: '#7843EE', note: 'Broad — doesn\'t show depth per account' },
  { label: 'Search Success Rate',    value: '78%',  trend: '+12%', color: ACCENT,    note: 'Positive product signal' },
];

const ACCOUNT_METRICS: Record<B2BPerspective, { label: string; value: string; trend: string; color: string; note: string }[]> = {
  product: [
    { label: 'Account Activation Rate', value: '71%',  trend: '+6%',  color: ACCENT,    note: 'Are accounts actually set up?' },
    { label: 'Seat Adoption',           value: '58%',  trend: '+3%',  color: '#3A86FF', note: 'What % of licensed seats are active?' },
    { label: 'Feature Penetration',     value: '42%',  trend: '-2%',  color: '#E67E22', note: 'Are accounts using key features?' },
    { label: 'Admin Setup Depth',       value: '64%',  trend: '—',    color: '#0097A7', note: 'Is the product properly configured?' },
  ],
  cs: [
    { label: 'Renewal Risk Accounts',   value: '8',    trend: '+3',   color: '#dc2626', note: '8 accounts showing low engagement signals' },
    { label: 'Champion Concentration',  value: '2.1 users/acct', trend: '-0.3', color: '#E67E22', note: 'Usage concentrated in too few users' },
    { label: 'Support Ticket Rate',     value: '12%',  trend: '+4%',  color: '#E67E22', note: 'High for recently onboarded accounts' },
    { label: 'QBR Readiness Score',     value: '61/100', trend: '+5', color: ACCENT,   note: 'Ready for 61% of accounts' },
  ],
  revenue: [
    { label: 'NRR (Net Revenue Retention)', value: '108%', trend: '+3%', color: ACCENT, note: 'Expansion exceeds churn — healthy' },
    { label: 'Expansion Signals',       value: '14 accts', trend: '+4', color: '#3A86FF', note: 'Accounts showing expansion-ready signals' },
    { label: 'At-Risk ARR',             value: '$84K',  trend: '+$12K', color: '#dc2626', note: 'ARR in accounts showing churn signals' },
    { label: 'Avg ARR per Account',     value: '$6,200', trend: '+8%', color: ACCENT,  note: 'Growing — healthy sign' },
  ],
  leadership: [
    { label: 'Accounts Expanding',      value: '14',   trend: '+4',   color: ACCENT,    note: 'Accounts that grew seats or ARR' },
    { label: 'Accounts at Churn Risk',  value: '8',    trend: '+3',   color: '#dc2626', note: 'Flagged by CS + product signals' },
    { label: 'Net Revenue Retention',   value: '108%', trend: '+3%',  color: ACCENT,    note: 'Business growing from existing accounts' },
    { label: 'Product Health Score',    value: '72/100', trend: '+4', color: '#3A86FF', note: 'Composite account-level health' },
  ],
};

const PERSPECTIVES: { id: B2BPerspective; label: string; emoji: string }[] = [
  { id: 'product',    label: 'Product',    emoji: '⚙️' },
  { id: 'cs',         label: 'CS',         emoji: '💬' },
  { id: 'revenue',    label: 'Revenue',    emoji: '💰' },
  { id: 'leadership', label: 'Leadership', emoji: '📋' },
];

export function B2BHealthDashboard() {
  const [viewMode, setViewMode] = useState<B2BView>('user');
  const [perspective, setPerspective] = useState<B2BPerspective>('product');
  const metrics = viewMode === 'user' ? USER_METRICS : ACCOUNT_METRICS[perspective];

  return (
    <ToolCard title="B2B Health Dashboard Lab" subtitle="Toggle between user-level and account-level views. Notice what each one reveals — and misses." icon="🏢" color={ACCENT}>
      {/* View toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {([['user', '👤 User-Level View'], ['account', '🏢 Account-Level View']] as const).map(([v, lbl]) => (
          <button key={v} onClick={() => setViewMode(v)}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: `2px solid ${viewMode === v ? ACCENT : 'var(--ed-rule)'}`, background: viewMode === v ? `rgba(${ACCENT_RGB},0.1)` : 'var(--ed-card)', color: viewMode === v ? ACCENT : 'var(--ed-ink3)', transition: 'all 0.2s' }}>
            {lbl}
          </button>
        ))}
      </div>

      {/* Account perspective tabs */}
      {viewMode === 'account' && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
          {PERSPECTIVES.map(p => (
            <button key={p.id} onClick={() => setPerspective(p.id)}
              style={{ flex: 1, padding: '7px 10px', borderRadius: '7px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${perspective === p.id ? ACCENT : 'var(--ed-rule)'}`, background: perspective === p.id ? `rgba(${ACCENT_RGB},0.1)` : 'var(--ed-card)', color: perspective === p.id ? ACCENT : 'var(--ed-ink3)', transition: 'all 0.2s' }}>
              {p.emoji} {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
        {metrics.map((m, i) => {
          const trendUp = m.trend.startsWith('+');
          const trendDown = m.trend.startsWith('-');
          const trendColor = trendUp ? '#059669' : trendDown ? '#dc2626' : 'var(--ed-ink3)';
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              style={{ padding: '14px 16px', borderRadius: '10px', background: 'var(--ed-card)', border: `1px solid var(--ed-rule)`, borderLeft: `4px solid ${m.color}` }}>
              <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', marginBottom: '4px' }}>{m.label.toUpperCase()}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '22px', fontWeight: 800, color: m.color, fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: trendColor }}>{m.trend}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>{m.note}</div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'user' ? (
          <motion.div key="user" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(230,126,34,0.06)', border: '1px solid rgba(230,126,34,0.2)', fontSize: '12px', color: 'var(--ed-ink2)' }}>
            ⚠ User-level looks healthy. But this view can&apos;t tell you whether accounts are actually growing, or which ones are at renewal risk. Switch to Account-Level to see what&apos;s hidden.
          </motion.div>
        ) : (
          <motion.div key="account" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: '12px 16px', borderRadius: '8px', background: `rgba(${ACCENT_RGB},0.06)`, border: `1px solid ${ACCENT}20`, fontSize: '12px', color: 'var(--ed-ink2)' }}>
            In B2B, product health is measured at the account level. The question shifts from &ldquo;Are people using this?&rdquo; to &ldquo;Is this account getting stronger, deeper, and more durable?&rdquo;
          </motion.div>
        )}
      </AnimatePresence>
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// TOOL 6 · EXPERIMENT DECISION STUDIO (Part 7)
// ─────────────────────────────────────────
const EXPERIMENT = {
  name: 'Onboarding Variant B',
  primaryMetric: { label: 'Onboarding Completion', control: 54, variant: 58, lift: '+4pp', good: true },
  guardrail: { label: '7-Day Retention', control: 62, variant: 59, change: '-3pp', good: false },
  segments: [
    { label: 'SMB accounts',         control: 51, variant: 57, lift: '+6pp', good: true },
    { label: 'Enterprise accounts',  control: 60, variant: 53, lift: '-7pp', good: false },
    { label: 'Mobile users',         control: 48, variant: 55, lift: '+7pp', good: true },
  ],
  sampleSize: 2840,
  confidence: 91,
};

type Decision = 'ship' | 'investigate' | 'reject' | null;

export function ExperimentDecisionStudio() {
  const [tab, setTab] = useState<'primary' | 'guardrail' | 'segments'>('primary');
  const [decision, setDecision] = useState<Decision>(null);

  const decisionFeedback: Record<NonNullable<Decision>, { correct: boolean; text: string }> = {
    ship:        { correct: false, text: 'The guardrail dipped and enterprise accounts got significantly worse. Shipping without investigating means accepting hidden damage to a high-value segment.' },
    investigate: { correct: true,  text: 'Correct. The lift is real but the guardrail dip and the enterprise segment drop require investigation before this is safe to ship broadly.' },
    reject:      { correct: false, text: 'Rejection is too strong. The primary metric moved meaningfully for most segments. The right move is investigation, not abandonment.' },
  };

  return (
    <ToolCard title="Experiment Decision Studio" subtitle="Evaluate the A/B test result. Primary metric, guardrails, and segment performance all matter." icon="🧪" color={ACCENT}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {([['primary', '📈 Primary Metric'], ['guardrail', '🛡 Guardrail'], ['segments', '👥 Segments']] as const).map(([t, lbl]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', border: `2px solid ${tab === t ? ACCENT : 'var(--ed-rule)'}`, background: tab === t ? `rgba(${ACCENT_RGB},0.1)` : 'var(--ed-card)', color: tab === t ? ACCENT : 'var(--ed-ink3)', transition: 'all 0.2s' }}>
            {lbl}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'primary' && (
          <motion.div key="primary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              {[{ label: 'Control', value: `${EXPERIMENT.primaryMetric.control}%`, color: '#64748b' }, { label: 'Variant B', value: `${EXPERIMENT.primaryMetric.variant}%`, color: ACCENT }].map(v => (
                <div key={v.label} style={{ padding: '16px', borderRadius: '10px', background: 'var(--ed-card)', border: `2px solid ${v.color}30`, textAlign: 'center' as const }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '4px' }}>{v.label}</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: v.color, fontFamily: "'JetBrains Mono', monospace" }}>{v.value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>{EXPERIMENT.primaryMetric.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[{ label: 'Lift', value: EXPERIMENT.primaryMetric.lift, color: ACCENT }, { label: 'Confidence', value: `${EXPERIMENT.confidence}%`, color: EXPERIMENT.confidence >= 95 ? ACCENT : '#E67E22' }, { label: 'Sample Size', value: EXPERIMENT.sampleSize.toLocaleString(), color: '#3A86FF' }].map(m => (
                <div key={m.label} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: `${m.color}10`, border: `1px solid ${m.color}30`, textAlign: 'center' as const }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>{m.label.toUpperCase()}</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: m.color, fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</div>
                </div>
              ))}
            </div>
            {EXPERIMENT.confidence < 95 && (
              <div style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '7px', background: 'rgba(230,126,34,0.08)', border: '1px solid rgba(230,126,34,0.3)', fontSize: '11px', color: '#E67E22' }}>
                ⚠ 91% confidence is decent, not definitive. Standard threshold is 95%. The lift is real but not conclusive alone.
              </div>
            )}
          </motion.div>
        )}

        {tab === 'guardrail' && (
          <motion.div key="guardrail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(220,38,38,0.06)', border: '2px solid rgba(220,38,38,0.25)', marginBottom: '12px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#dc2626', letterSpacing: '0.1em', marginBottom: '8px' }}>⚠ GUARDRAIL DIPPED</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ed-ink)', marginBottom: '4px' }}>{EXPERIMENT.guardrail.label}</div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' as const }}><div style={{ fontSize: '22px', fontWeight: 800, color: '#64748b', fontFamily: "'JetBrains Mono', monospace" }}>{EXPERIMENT.guardrail.control}%</div><div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>Control</div></div>
                <div style={{ fontSize: '20px', color: '#dc2626' }}>→</div>
                <div style={{ textAlign: 'center' as const }}><div style={{ fontSize: '22px', fontWeight: 800, color: '#dc2626', fontFamily: "'JetBrains Mono', monospace" }}>{EXPERIMENT.guardrail.variant}%</div><div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>Variant B</div></div>
                <div style={{ flex: 1, padding: '8px 12px', borderRadius: '7px', background: 'rgba(220,38,38,0.06)', fontSize: '12px', color: 'var(--ed-ink2)' }}>
                  {EXPERIMENT.guardrail.change} — Variant B may improve completion but at the cost of 7-day retention. The product may be creating shallow behavior.
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'segments' && (
          <motion.div key="segments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '12px' }}>
              {EXPERIMENT.segments.map((seg, i) => (
                <div key={i} style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--ed-card)', border: `1.5px solid ${seg.good ? ACCENT + '40' : 'rgba(220,38,38,0.3)'}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ed-ink)', marginBottom: '2px' }}>{seg.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>Control: {seg.control}% → Variant: {seg.control + parseInt(seg.lift)}%</div>
                  </div>
                  <div style={{ textAlign: 'right' as const }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: seg.good ? ACCENT : '#dc2626', fontFamily: "'JetBrains Mono', monospace" }}>{seg.lift}</div>
                    <div style={{ fontSize: '10px', color: seg.good ? ACCENT : '#dc2626', fontWeight: 600 }}>{seg.good ? '↑ Better' : '↓ Worse'}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', fontSize: '12px', color: 'var(--ed-ink2)' }}>
              ⚠ Enterprise accounts performed significantly worse (-7pp). Enterprise tends to be higher-value ARR. An overall win that hurts your best accounts is not a simple win.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decision */}
      {!decision ? (
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ed-ink)', marginBottom: '10px' }}>Based on everything you&apos;ve seen — what should the PM do?</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {([['ship', '🚀 Ship it', ACCENT], ['investigate', '🔍 Investigate first', '#3A86FF'], ['reject', '❌ Reject it', '#dc2626']] as const).map(([d, lbl, col]) => (
              <motion.button key={d} whileHover={{ y: -2 }} onClick={() => setDecision(d)}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: `2px solid ${col}`, background: `${col}10`, color: col, transition: 'all 0.2s' }}>
                {lbl}
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '16px', padding: '14px 18px', borderRadius: '10px', background: decisionFeedback[decision].correct ? `rgba(${ACCENT_RGB},0.08)` : 'rgba(220,38,38,0.06)', border: `1.5px solid ${decisionFeedback[decision].correct ? ACCENT : '#dc2626'}40`, display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '20px', flexShrink: 0 }}>{decisionFeedback[decision].correct ? '✓' : '✗'}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '13px', color: decisionFeedback[decision].correct ? ACCENT : '#dc2626', marginBottom: '4px' }}>
              {decisionFeedback[decision].correct ? 'Good judgment.' : 'Not quite.'}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{decisionFeedback[decision].text}</div>
            <button onClick={() => setDecision(null)} style={{ marginTop: '8px', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', border: '1px solid var(--ed-rule)', background: 'var(--ed-card)', color: 'var(--ed-ink3)' }}>Try again</button>
          </div>
        </motion.div>
      )}
    </ToolCard>
  );
}

// ─────────────────────────────────────────
// EXPORT DEFAULT
// ─────────────────────────────────────────
export default function Track1AnalyticsPM({
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
        <div aria-hidden="true" style={{ position: 'absolute', right: '-20px', top: '-10px', fontSize: 'clamp(140px,18vw,220px)', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.06)`, fontFamily: "'Lora',Georgia,serif", letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>{MODULE_NUM}</div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '14px', textTransform: 'uppercase' as const }}>
              PM Fundamentals &middot; Module {MODULE_NUM}
            </div>
            <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.03em', color: 'var(--ed-ink)', marginBottom: '16px', fontFamily: "'Lora',Georgia,serif" }}>
              {MODULE_LABEL}
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora',Georgia,serif", marginBottom: '40px' }}>
              &ldquo;Numbers are only useful when you know what they mean, what they hide, and what decision they should inform.&rdquo;
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '40px' }}>
              {([
                { mentor: 'priya' as const, accent: ACCENT,    name: 'Priya',  role: 'PM · EdSpark',        desc: 'Comfortable with product problems. Learning that numbers can lie quietly.' },
                { mentor: 'kiran' as const, accent: '#3A86FF', name: 'Kiran',  role: 'Data Analyst',        desc: 'Brings precision into messy product conversations.' },
                { mentor: 'asha'  as const, accent: '#0097A7', name: 'Asha',   role: 'PM Mentor',           desc: 'Pushes from "what moved?" to "what does this mean?"' },
                { mentor: 'maya'  as const, accent: '#C85A40', name: 'Maya',   role: 'Designer',            desc: 'Reminds the room that user behaviour isn\'t always obvious in a chart.' },
                { mentor: 'rohan' as const, accent: '#E67E22', name: 'Rohit',  role: 'Growth Lead',         desc: 'Cares about top-of-funnel. Sometimes wants the win too quickly.' },
              ]).map(c => (
                <div key={c.mentor} style={{ background: `${c.accent}0D`, border: `1px solid ${c.accent}33`, borderRadius: '10px', padding: '14px 16px', minWidth: '140px', flex: '1' }}>
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
              <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '12px', textTransform: 'uppercase' as const }}>Learning Objectives</div>
              {[
                'Know which metric to look at first — and why most dashboards don\'t answer that question automatically',
                'Build a metric system with a north star, guardrails, and diagnostics — not just a list of things to track',
                'Read funnels, cohorts, and A/B tests as evidence — not as answers',
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
                <div style={{ background: 'linear-gradient(145deg, #0A1A0F 0%, #0D2418 100%)', borderRadius: '14px', padding: '20px 18px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE {MODULE_NUM}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora',serif", lineHeight: 1.25, marginBottom: '4px' }}>{MODULE_LABEL}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(240,232,216,0.45)', marginBottom: '16px' }}>Foundations Track</div>
                  <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '14px' }}>
                    <motion.div animate={{ width: `${donePct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ height: '100%', background: ACCENT, borderRadius: '1px' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                    {PARTS.map(p => {
                      const done = completedSections.has(p.id);
                      const isNext = p.id === nextPart?.id;
                      return (
                        <div key={p.num} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, background: done ? ACCENT : isNext ? ACCENT : 'rgba(255,255,255,0.06)', border: `1px solid ${done ? ACCENT : isNext ? ACCENT : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: done || isNext ? '#fff' : 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, opacity: done ? 0.7 : 1, transition: 'all 0.3s' }}>
                            {done ? '✓' : p.num}
                          </div>
                          <div style={{ fontSize: '9px', color: done ? 'rgba(240,232,216,0.4)' : isNext ? 'rgba(240,232,216,0.9)' : 'rgba(240,232,216,0.25)', lineHeight: 1.3, flex: 1 }}>
                            {p.label.split(' ').slice(0, 4).join(' ')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: '16px', padding: '8px 10px', borderRadius: '6px', background: `${ACCENT}22`, border: `1px solid ${ACCENT}44` }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', color: ACCENT, fontWeight: 700, marginBottom: '2px' }}>{donePct === 100 ? 'COMPLETE' : 'NEXT UP'}</div>
                    <div style={{ fontSize: '9px', color: 'rgba(240,232,216,0.6)' }}>{donePct === 100 ? 'All 7 parts done' : nextPart ? nextPart.label.split(' ').slice(0, 4).join(' ') : 'The Dashboard Review'}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── PART 1 ── */}
      <ChapterSection id="m7-dashboard" num="01" accentRgb={ACCENT_RGB} first>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Monday morning. EdSpark&apos;s weekly product review. The dashboard is already open. Before Priya can start, everyone is pointing at different charts. Rohit: <strong>&ldquo;Acquisition is finally moving.&rdquo;</strong> Sonal: <strong>&ldquo;I&apos;m more worried about what happens after first use.&rdquo;</strong> Meera: <strong>&ldquo;Which of these numbers actually tells us whether the product is healthier this week than last?&rdquo;</strong> Dev: <strong>&ldquo;Before we overread that search graph, we only fixed the tracking issue three days ago.&rdquo;</strong> Maya: <strong>&ldquo;Why is everyone treating more time spent as good?&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="kiran" name="Kiran" role="Data Analyst · EdSpark" accent="#3A86FF"
          lines={[
            { speaker: 'priya', text: "Everyone is looking at the same dashboard and drawing different conclusions. How is that possible?" },
            { speaker: 'other', text: "That's what dashboards do when the room hasn't agreed on the question." },
            { speaker: 'priya', text: "So what's the question?" },
            { speaker: 'other', text: "That's the work. A dashboard creates visibility. Clarity only happens when you know what you're trying to understand." },
          ]}
        />

        {h2(<>Not every visible metric is decision-worthy</>)}

        {para(<>If the question is acquisition, one chart matters. If the question is activation, another matters. If the question is product health, yet another matters. If the question is long-term retention, most of the dashboard may be noise. A PM does not become better by looking at more numbers. A PM becomes better by knowing which question comes first.</>)}

        {keyBox('Questions before metrics', [
          'What are we trying to understand right now?',
          'Which metric best answers that question?',
          'What would a meaningful change in that metric actually mean?',
          'What would this metric fail to show us?',
        ])}

        <PMPrinciple text="A metric matters only if it helps answer a real product question." />

        <ApplyItBox prompt="Think of one product you know well. What is one specific question you would want data to answer before making a product decision? Write the question first — then identify the metric." />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Dashboards are mirrors, not windows. They show you what the product measured. They don&apos;t automatically show you what matters. The PM&apos;s job is to bring the question that makes the mirror useful.</>}
          question="A room is looking at the same dashboard and drawing different conclusions. What is the strongest PM move?"
          options={[
            { text: 'Add more charts to give everyone what they need', correct: false, feedback: 'More data without a shared question creates more divergence, not alignment.' },
            { text: 'Ask which question the team is actually trying to answer', correct: true, feedback: 'Exactly. Without a shared question, every chart is a Rorschach test. The question comes before the metric.' },
            { text: 'Focus on the biggest number — that\'s probably what matters most', correct: false, feedback: 'Size is not relevance. The biggest number might be measuring the wrong thing entirely.' },
          ]}
          conceptId="pm-analytics-basics"
        />

        <QuizEngine
          conceptId="pm-analytics-basics"
          conceptName="PM Analytics Basics"
          moduleContext="Module 07 of Airtribe PM Fundamentals. Covers metric selection, north star, funnels, cohorts, B2B analytics, and A/B experiments. Follows Priya Sharma at EdSpark."
          staticQuiz={{
            conceptId: "pm-analytics-basics",
            question: "A room is looking at the same dashboard and drawing different conclusions. What is the strongest PM move?",
            options: ['Add more charts', 'Ask which question the team is actually trying to answer', 'Focus on the biggest number', 'Choose the most optimistic interpretation'],
            correctIndex: 1,
            explanation: "Without a shared question, every chart is interpreted through the lens of whoever is looking at it. The PM's job is to surface the question before reaching for a metric.",
          }}
        />
      </ChapterSection>

      {/* ── PART 2 ── */}
      <ChapterSection id="m7-north-star" num="02" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          The team is trying to align on one metric to rally around. Rohit: <strong>&ldquo;Daily active users. Clean, broad, leadership understands it.&rdquo;</strong> Meera: <strong>&ldquo;Broad is not the same as useful.&rdquo;</strong> Someone suggests time spent. Another says signups. Priya writes everything down. Asha looks at the growing list and smiles: <strong>&ldquo;When every metric sounds a little right, the team still hasn&apos;t agreed on what success actually is.&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="asha" name="Asha" role="PM Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "If EdSpark helps users review calls efficiently — is 'time spent' a good north star?" },
            { speaker: 'other', text: "If users are spending more time, is that because the product is more valuable — or because it's harder to use?" },
            { speaker: 'priya', text: "It could be either..." },
            { speaker: 'other', text: "Exactly. A good north star unambiguously improves when users get more value. Time spent doesn't pass that test. Review completion rate does." },
          ]}
        />

        {h2(<>North star, guardrails, and secondary metrics</>)}

        {keyBox('The three-zone metric system', [
          'North Star: the one metric that best reflects user value when the product is working well',
          'Guardrails: 2–3 metrics that protect against winning the north star the wrong way',
          'Secondary metrics: diagnostics that help explain why things are moving',
        ])}

        <MetricMapBuilder />

        <PMPrinciple text="Your north star tells you what success looks like. Your guardrails make sure you don't get there the wrong way." />

        <ApplyItBox prompt="Pick one product. Write one possible north star, two guardrails, and two secondary metrics. Then ask: if the north star improves, does that definitely mean users are getting more value?" />

        <QuizEngine
          conceptId="north-star-metrics"
          conceptName="North Star Metrics"
          moduleContext="Module 07 of Airtribe PM Fundamentals. North star, guardrails, and secondary metrics for PM product teams."
          staticQuiz={{
            conceptId: "north-star-metrics",
            question: "Why is 'time spent' often a risky north star?",
            options: ['It is impossible to measure accurately', 'It can reward friction and confusion instead of real user value', 'It only matters in B2B products', 'It is always better used as a guardrail'],
            correctIndex: 1,
            explanation: "Time spent improves when users are either deeply engaged OR deeply confused. A north star should unambiguously improve when value is delivered — time spent doesn't pass that test.",
          }}
        />
      </ChapterSection>

      {/* ── PART 3 ── */}
      <ChapterSection id="m7-success-metrics" num="03" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          The search improvement is live. Priya opens her PRD to find the success section she wrote earlier: <em>&ldquo;Success = better search experience.&rdquo;</em> Kiran says nothing for a few seconds. Then: <strong>&ldquo;That&apos;s not a metric. That&apos;s a hope.&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="kiran" name="Kiran" role="Data Analyst · EdSpark" accent="#3A86FF"
          lines={[
            { speaker: 'priya', text: "Okay, what about 'number of searches performed'?" },
            { speaker: 'other', text: "More searches could mean better discovery. Or it could mean people are struggling and retrying over and over." },
            { speaker: 'priya', text: "So what's the right metric?" },
            { speaker: 'other', text: "Start from the problem. Users were struggling to retrieve older recordings. What behavior would prove that got better?" },
          ]}
        />

        {h2(<>Ask what behavior proves the problem is solved</>)}

        {para(<>A weak success metric tracks visible activity. A strong one tracks the user behavior that would prove the product got better. The upgrade is simple: stop asking what is easy to measure. Start asking what behavior would prove the problem is actually solved.</>)}

        <NorthStarSimulator />

        <PMPrinciple text="Do not ask what is easiest to measure. Ask what behaviour would prove the problem is actually solved." />

        <ApplyItBox prompt="Finish this sentence for any feature you know: 'We will know this worked if users now...' That answer is often the start of a better success metric." />

        <QuizEngine
          conceptId="success-metrics"
          conceptName="Success Metrics"
          moduleContext="Module 07 of Airtribe PM Fundamentals. Choosing strong success metrics that prove a problem is solved."
          staticQuiz={{
            conceptId: "success-metrics",
            question: "Which metric is strongest for evaluating a search improvement?",
            options: ['Number of searches performed', 'Time spent in the search interface', '% of users who successfully find the target item', 'Total screen views in the product'],
            correctIndex: 2,
            explanation: "Search success rate directly measures whether users accomplished what they came to do. The others measure activity that could go up for entirely the wrong reasons.",
          }}
        />
      </ChapterSection>

      {/* ── PART 4 ── */}
      <ChapterSection id="m7-funnel" num="04" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Thursday. Onboarding funnel review. Signed up → Uploaded first call → Ran analysis → Viewed results → Shared output. There&apos;s a big drop between Uploaded and Ran analysis. Rohit immediately: <strong>&ldquo;There. That&apos;s the bottleneck.&rdquo;</strong> Maya: <strong>&ldquo;That&apos;s not an explanation. That&apos;s a location.&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="maya" name="Maya" role="Designer · EdSpark" accent="#C85A40"
          lines={[
            { speaker: 'priya', text: "So what's causing the drop between upload and analysis?" },
            { speaker: 'other', text: "That's what we need to investigate. The funnel tells us where people are stopping. It doesn't tell us why." },
            { speaker: 'priya', text: "But shouldn't we be able to infer it from the data?" },
            { speaker: 'other', text: "If you let the first explanation win, you might fix the wrong thing with full confidence. A funnel is a map of friction — not a map of causes." },
          ]}
        />

        {h2(<>Funnels show where. Investigation tells you why.</>)}

        <FunnelExplorer />

        <PMPrinciple text="A funnel tells you where the journey breaks. It does not automatically tell you why." />

        <ApplyItBox prompt="Think of one key journey in a product you know. Write the major steps. That is the beginning of a funnel. For each step, write two different possible reasons someone might drop off — before you look at any data." />

        <QuizEngine
          conceptId="funnel-analysis"
          conceptName="Funnel Analysis"
          moduleContext="Module 07 of Airtribe PM Fundamentals. Reading funnels as maps of friction, not automatic answers."
          staticQuiz={{
            conceptId: "funnel-analysis",
            question: "What is the strongest conclusion from a major drop between two funnel stages?",
            options: ['The feature at that stage is definitely broken', 'The cause is already obvious from the data', 'Something in that stage needs deeper investigation before drawing conclusions', 'The whole product onboarding is failing'],
            correctIndex: 2,
            explanation: "A funnel drop is a signal, not a diagnosis. Multiple causes could produce the same pattern. The right response is to investigate — not to let the first explanation win.",
          }}
        />
      </ChapterSection>

      {/* ── PART 5 ── */}
      <ChapterSection id="m7-cohorts" num="05" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          The retention review feels calm. Top-line retention looks stable. Meera: <strong>&ldquo;Good. At least retention is holding.&rdquo;</strong> Kiran tilts his head: <strong>&ldquo;Overall retention is holding.&rdquo;</strong> He switches to cohort view. Users who joined before the redesign: retaining well. Users who joined after: dropping faster. The averages had hidden everything.
        </SituationCard>

        <ConversationScene
          mentor="kiran" name="Kiran" role="Data Analyst · EdSpark" accent="#3A86FF"
          lines={[
            { speaker: 'priya', text: "So the redesign actually made things worse for new users?" },
            { speaker: 'other', text: "For retention, yes. The flow got cleaner. The habit didn't get stronger." },
            { speaker: 'priya', text: "How did we miss this in the top-line chart?" },
            { speaker: 'other', text: "Because averages blend old and new cohorts together. The older users' strong retention compensated for the newer users' weakness. Averages flatten the story. Cohorts reveal it." },
          ]}
        />

        {h2(<>Cohorts bring time and comparison back into the picture</>)}

        <CohortPlayground />

        <PMPrinciple text="If averages flatten the story, cohorts often reveal it." />

        <ApplyItBox prompt="Choose one way you could define cohorts for a product you know: signup month, acquisition source, plan type, or first feature used. Why might that split reveal something that a top-line average is hiding?" />

        <QuizEngine
          conceptId="cohort-analysis"
          conceptName="Cohort Analysis"
          moduleContext="Module 07 of Airtribe PM Fundamentals. Using cohort analysis to reveal patterns that top-line averages hide."
          staticQuiz={{
            conceptId: "cohort-analysis",
            question: "Why is cohort analysis often stronger than an overall average?",
            options: ['It always shows worse numbers than averages', 'It reveals how different user groups behave differently over time', 'It removes the need for dashboards entirely', 'It makes metrics easier to present to leadership'],
            correctIndex: 1,
            explanation: "Cohort analysis separates users by a meaningful attribute (signup time, source, etc.) and tracks them over time. This reveals patterns — like a post-redesign retention drop — that blended averages smooth over.",
          }}
        />
      </ChapterSection>

      {/* ── PART 6 ── */}
      <ChapterSection id="m7-b2b" num="06" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Friday. The focus shifts to institutional business. Meera asks about expansion. Sonal asks which accounts are at risk. Priya opens the standard dashboard. Sonal stops her: <strong>&ldquo;That&apos;s useful. But it&apos;s mostly user-level.&rdquo;</strong> Meera: <strong>&ldquo;I need to know whether accounts are healthy.&rdquo;</strong> That changes everything.
        </SituationCard>

        <ConversationScene
          mentor="kiran" name="Meera" role="Business Lead · EdSpark" accent="#7843EE"
          lines={[
            { speaker: 'priya', text: "The user activity looks good though. DAUs are up." },
            { speaker: 'other', text: "A product can look busy at the user level and still be weak at the account level. One team's usage can be concentrated in two champions." },
            { speaker: 'priya', text: "So what should I be looking at?" },
            { speaker: 'other', text: "Account activation, seat adoption, renewal risk, feature penetration. In B2B, the account is the unit of health — not just the individual user." },
          ]}
        />

        {h2(<>In B2B, product health is measured at the account level</>)}

        <B2BHealthDashboard />

        <PMPrinciple text="In B2B, product health is often measured at the account level, not just the user level." />

        <ApplyItBox prompt="Think of one B2B or SaaS product. What would make an account: healthy? expansion-ready? at risk of churn? Write the signals for each category — before looking at any dashboard." />

        <QuizEngine
          conceptId="b2b-analytics"
          conceptName="B2B Analytics"
          moduleContext="Module 07 of Airtribe PM Fundamentals. Account-level health metrics in B2B product analytics."
          staticQuiz={{
            conceptId: "b2b-analytics",
            question: "Why is a user-level dashboard often not enough in B2B?",
            options: ['B2B products do not track individual users', 'Account health, renewal risk, seat adoption, and expansion signals matter alongside user activity', 'Because B2B only cares about revenue metrics', 'Because retention is not relevant to B2B products'],
            correctIndex: 1,
            explanation: "In B2B, a product can look active at the user level while accounts are at churn risk. The account is the commercial unit — and product health must be measured at that level too.",
          }}
        />
      </ChapterSection>

      {/* ── PART 7 ── */}
      <ChapterSection id="m7-experiments" num="07" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          End of week. Experiment review. Onboarding Variant B improved completion by 4%. Rohit: <strong>&ldquo;Great. Ship it.&rdquo;</strong> But Kiran keeps going. Sample size is decent, not huge. A guardrail dipped. A high-value segment performed worse. <strong>The headline looked clean. The picture underneath did not.</strong>
        </SituationCard>

        <ConversationScene
          mentor="kiran" name="Kiran" role="Data Analyst · EdSpark" accent="#3A86FF"
          lines={[
            { speaker: 'priya', text: "The primary metric moved. Isn't that enough?" },
            { speaker: 'other', text: "Enterprise accounts dropped 7 points. Enterprise is higher-value ARR. An overall win that hurts your best accounts isn't a simple win." },
            { speaker: 'priya', text: "And the guardrail dip?" },
            { speaker: 'other', text: "7-day retention fell 3 points. That could mean the variant improved completion by creating shallow behavior. Better completion doesn't mean better product." },
          ]}
        />

        {h2(<>A/B tests are evidence systems, not decision machines</>)}

        <ExperimentDecisionStudio />

        <PMPrinciple text="A/B tests do not make product decisions for you. They improve the quality of the decision." />

        <ApplyItBox prompt="If one version of a feature improved the main metric but hurt a guardrail, what would matter more: the size of the lift, the segment hurt, the strategic goal, or the long-term risk? Your answer depends on the product context. That is the point." />

        <QuizEngine
          conceptId="ab-testing"
          conceptName="A/B Testing & Experiments"
          moduleContext="Module 07 of Airtribe PM Fundamentals. Reading A/B test results as evidence, not automatic decisions."
          staticQuiz={{
            conceptId: "ab-testing",
            question: "A variant improves the main conversion metric but hurts a key guardrail. What should a PM do?",
            options: ['Ship it immediately — the primary metric won', 'Ignore the guardrail — it\'s secondary to the main metric', 'Investigate the tradeoff before making a shipping decision', 'Stop all experimentation until the guardrail is fully resolved'],
            correctIndex: 2,
            explanation: "A guardrail dip means the variant may be winning the wrong way. Shipping without understanding the tradeoff means accepting hidden damage. The right move is to investigate — not ship or reject blindly.",
          }}
        />

        <NextChapterTeaser text="Next up: Product Launch & Growth — how PMs plan go-to-market, run growth loops, and measure whether a launch actually worked." />
      </ChapterSection>

    </article>
  );
}

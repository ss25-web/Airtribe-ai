'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizEngine from '../QuizEngine';
import {
  h2, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser, para,
} from './designSystem';

const ACCENT     = '#7C3AED';
const ACCENT_RGB = '124,58,237';
const MODULE_CONTEXT = `Priya Sharma is an APM at EdSpark, a B2B SaaS platform for sales coaching. EdSpark's core problem is 40% week-1 churn among new sales managers. This module covers product strategy: why having a vision and a plan to win matters more than a long feature list.`;

const QUIZZES = [
  {
    conceptId: 'product-strategy',
    question: 'Rohan wants to add 5 new features to reduce EdSpark\'s 40% week-1 churn. What should Priya do first?',
    options: [
      'A. Ship the features quickly to show progress to the board',
      'B. Diagnose why new managers churn before deciding what to build',
      'C. Run a competitor analysis to see what Gong.io ships next quarter',
      'D. Survey all existing customers about which features they want most',
    ],
    correctIndex: 1,
    explanation: 'Features without strategy are just guesses. Priya needs to understand the root cause of churn first — only then does she know which features (if any) are the right answer. Adding features to a leaky bucket just adds complexity.',
    keyInsight: 'Strategy answers "why this bet" before engineering asks "how to build it."',
  },
  {
    conceptId: 'competitive-moats',
    question: 'EdSpark\'s strongest competitive advantage over Gong.io and Chorus is its deep integration with CRM data from day one. This is best described as:',
    options: [
      'A. A network effect, since more users make the product better for all',
      'B. A switching cost moat, since migrating CRM integrations is painful',
      'C. A cost advantage, because EdSpark spends less on infrastructure',
      'D. A brand moat, since enterprise buyers trust established CRM vendors',
    ],
    correctIndex: 1,
    explanation: 'Deep CRM integrations create high switching costs — once a sales org has configured their workflows, call flows, and coaching cadences inside EdSpark\'s CRM integration, ripping it out is expensive and disruptive. That\'s a real moat.',
  },
  {
    conceptId: 'systems-thinking',
    question: 'Priya\'s new onboarding fix reduced week-1 churn from 40% to 25%, but sales reps now spend 30 extra minutes per week on admin. What is this an example of?',
    options: [
      'A. A failed product decision that should be immediately rolled back',
      'B. A second-order effect — solving one problem created a new constraint',
      'C. A UX problem that design should fix without PM involvement at all',
      'D. A success metric misalignment between product and the sales team',
    ],
    correctIndex: 1,
    explanation: 'Second-order effects are downstream consequences of first-order changes. Priya fixed churn (first order) but created admin burden (second order). Systems thinking means anticipating these before shipping, not discovering them after.',
  },
  {
    conceptId: 'bet-sizing',
    question: 'EdSpark has 6 engineers and 3 strategic bets: (A) fix onboarding, (B) build analytics dashboard, (C) add Salesforce integration. Bet C has highest revenue potential but 6-month timeline. What should Priya recommend?',
    options: [
      'A. Pursue all three bets in parallel to maximise potential upside',
      'B. Start with A to stop the churn bleeding, then sequence B and C',
      'C. Prioritise C because highest revenue always justifies the timeline',
      'D. Wait for more data before committing resources to any single bet',
    ],
    correctIndex: 1,
    explanation: 'Bet sizing means sequencing by impact-per-risk, not just upside. Fixing the onboarding bleed (A) unblocks retention metrics needed to justify the C investment. A 6-month bet on a product with 40% churn is a risky sequence.',
  },
  {
    conceptId: 'b2b-strategy',
    question: 'EdSpark lands a 50-seat deal with a mid-market sales org. The land-and-expand goal is 500 seats in 18 months. What is the most important first milestone to hit?',
    options: [
      'A. Build the enterprise SSO and admin dashboard before the first QBR',
      'B. Get 10+ reps using it daily and document one concrete win to share',
      'C. Negotiate the expansion contract terms before the trial period ends',
      'D. Assign a dedicated CSM to the account within the first two weeks',
    ],
    correctIndex: 1,
    explanation: 'Land-and-expand lives or dies on the internal champion. Getting 10+ reps to daily usage creates proof that the champion can take to their VP. One concrete win (e.g. "ramp time dropped from 90 to 60 days") is worth more than any enterprise feature.',
  },
];

// ─────────────────────────────────────────
// TILT CARD
// ─────────────────────────────────────────
const TiltCard = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -6, y: x * 6, scale: 1.012 });
  };
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0, scale: 1 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`, transition: 'transform 0.18s ease', willChange: 'transform', ...style }}
    >
      {children}
    </div>
  );
};

// ─────────────────────────────────────────
// SECTION 1: Strategy vs Features Sorter
// Learner sorts 8 items into Strategy or Feature/Tactic buckets
// ─────────────────────────────────────────
const ITEMS = [
  { id: 'a', text: 'Add a dark mode to the dashboard',           correct: 'tactic'   },
  { id: 'b', text: 'Focus exclusively on mid-market sales orgs', correct: 'strategy' },
  { id: 'c', text: 'Fix the CSV export bug',                     correct: 'tactic'   },
  { id: 'd', text: 'Win on CRM depth before broadening tools',   correct: 'strategy' },
  { id: 'e', text: 'Add Slack notifications for call scores',    correct: 'tactic'   },
  { id: 'f', text: 'Be the coaching platform reps actually use', correct: 'strategy' },
  { id: 'g', text: 'Reduce onboarding from 7 steps to 3',       correct: 'tactic'   },
  { id: 'h', text: 'Land 3 marquee logos to anchor enterprise',  correct: 'strategy' },
];

const Section1Mockup = () => {
  const [sorted, setSorted] = useState<Record<string, 'strategy' | 'tactic'>>({});
  const [checked, setChecked] = useState(false);

  const sort = (id: string, bucket: 'strategy' | 'tactic') => {
    if (checked) return;
    setSorted(prev => ({ ...prev, [id]: bucket }));
  };

  const unsorted = ITEMS.filter(i => !sorted[i.id]);
  const strategyItems = ITEMS.filter(i => sorted[i.id] === 'strategy');
  const tacticItems   = ITEMS.filter(i => sorted[i.id] === 'tactic');
  const correct = checked ? ITEMS.filter(i => sorted[i.id] === i.correct).length : 0;

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid rgba(${ACCENT_RGB},0.25)`, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        {/* Header */}
        <div style={{ background: ACCENT, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#fff', fontWeight: 600, letterSpacing: '0.08em' }}>
              EdSpark Strategy Review · Sort these items
            </div>
          </div>
          {!checked && unsorted.length === 0 && (
            <button onClick={() => setChecked(true)} style={{ padding: '4px 12px', borderRadius: '4px', background: '#fff', color: ACCENT, fontSize: '11px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              Check →
            </button>
          )}
          {checked && (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#fff', fontWeight: 700 }}>
              {correct}/{ITEMS.length} correct
            </div>
          )}
        </div>

        <div style={{ background: '#fff', padding: '16px' }}>
          {/* Unsorted pool */}
          {unsorted.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#97A0AF', letterSpacing: '0.1em', marginBottom: '8px' }}>UNSORTED — click to assign</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {unsorted.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => sort(item.id, 'strategy')}
                      style={{ padding: '6px 10px', borderRadius: '6px 0 0 6px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.3)', borderRight: 'none', cursor: 'pointer', fontSize: '11px', color: ACCENT, fontWeight: 600 }}>S</button>
                    <div style={{ padding: '6px 10px', background: '#F8F6F2', border: '1px solid #E0D9D0', fontSize: '12px', color: '#1C1814', display: 'flex', alignItems: 'center' }}>{item.text}</div>
                    <button onClick={() => sort(item.id, 'tactic')}
                      style={{ padding: '6px 10px', borderRadius: '0 6px 6px 0', background: 'rgba(200,90,64,0.08)', border: '1px solid rgba(200,90,64,0.3)', borderLeft: 'none', cursor: 'pointer', fontSize: '11px', color: '#C85A40', fontWeight: 600 }}>T</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buckets */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { key: 'strategy', label: 'STRATEGY', color: ACCENT, bg: 'rgba(124,58,237,0.06)', border: 'rgba(124,58,237,0.2)', items: strategyItems },
              { key: 'tactic',   label: 'FEATURE / TACTIC', color: '#C85A40', bg: 'rgba(200,90,64,0.06)', border: 'rgba(200,90,64,0.2)', items: tacticItems },
            ].map(bucket => (
              <div key={bucket.key} style={{ background: bucket.bg, borderRadius: '8px', border: `1px solid ${bucket.border}`, padding: '12px', minHeight: '80px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: bucket.color, letterSpacing: '0.12em', marginBottom: '8px' }}>{bucket.label}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {bucket.items.map(item => {
                    const isCorrect = item.correct === bucket.key;
                    return (
                      <div key={item.id} style={{ fontSize: '12px', color: '#1C1814', padding: '5px 8px', borderRadius: '5px', background: checked ? (isCorrect ? 'rgba(13,122,90,0.1)' : 'rgba(200,64,64,0.1)') : '#fff', border: `1px solid ${checked ? (isCorrect ? 'rgba(13,122,90,0.3)' : 'rgba(200,64,64,0.3)') : '#E0D9D0'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <span>{item.text}</span>
                        {checked && <span style={{ fontSize: '13px', flexShrink: 0 }}>{isCorrect ? '✓' : '✗'}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#F8F6F2', borderTop: `1px solid rgba(${ACCENT_RGB},0.15)`, padding: '8px 16px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#5E6C84' }}>
            Click S to mark as Strategy · T to mark as Feature/Tactic · then check your answers
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// SECTION 2: Competitive Moat Analyzer
// Rate EdSpark's 4 moat types vs Gong.io (1–5 sliders)
// ─────────────────────────────────────────
type MoatKey = 'network' | 'switching' | 'cost' | 'data';
const MOATS: { key: MoatKey; label: string; desc: string; gong: number }[] = [
  { key: 'network',   label: 'Network Effects',   desc: 'Product gets better as more users join',         gong: 3 },
  { key: 'switching', label: 'Switching Costs',   desc: 'Pain of moving to a competitor',                 gong: 4 },
  { key: 'cost',      label: 'Cost Advantage',    desc: 'Ability to deliver at lower cost than rivals',   gong: 2 },
  { key: 'data',      label: 'Data / AI Moat',    desc: 'Proprietary data that improves the product',    gong: 4 },
];

const Section2Mockup = () => {
  const [edspark, setEdspark] = useState<Record<MoatKey, number>>({ network: 2, switching: 4, cost: 2, data: 3 });
  const [revealed, setRevealed] = useState(false);

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid rgba(${ACCENT_RGB},0.25)`, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ background: '#1C1035', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#C4B5FD', fontWeight: 600, letterSpacing: '0.08em' }}>
              Competitive Moat Analysis · EdSpark vs Gong.io
            </div>
          </div>
          <button onClick={() => setRevealed(r => !r)} style={{ padding: '4px 12px', borderRadius: '4px', background: 'rgba(196,181,253,0.15)', border: '1px solid rgba(196,181,253,0.3)', color: '#C4B5FD', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
            {revealed ? 'Hide Gong' : 'Reveal Gong →'}
          </button>
        </div>

        <div style={{ background: '#fff', padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', padding: '6px 12px', borderRadius: '6px', background: '#F8F6F2' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: ACCENT }}>● EDSPARK</div>
            {revealed && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#6366F1' }}>● GONG.IO</div>}
          </div>

          {MOATS.map(moat => (
            <div key={moat.key} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C1814' }}>{moat.label}</span>
                  <span style={{ fontSize: '11px', color: '#8A8580', marginLeft: '8px' }}>{moat.desc}</span>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 700, color: ACCENT }}>{edspark[moat.key]}/5</span>
              </div>
              <div style={{ position: 'relative', height: '8px', background: '#F0EDE8', borderRadius: '4px', overflow: 'visible' }}>
                <motion.div animate={{ width: `${(edspark[moat.key] / 5) * 100}%` }} style={{ height: '100%', background: ACCENT, borderRadius: '4px', position: 'relative' }} />
                {revealed && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${(moat.gong / 5) * 100}%`, background: 'rgba(99,102,241,0.35)', borderRadius: '4px', border: '2px dashed #6366F1', boxSizing: 'border-box' }} />
                )}
              </div>
              <input type="range" min={1} max={5} value={edspark[moat.key]}
                onChange={e => setEdspark(prev => ({ ...prev, [moat.key]: Number(e.target.value) }))}
                style={{ width: '100%', marginTop: '4px', accentColor: ACCENT }} />
            </div>
          ))}
        </div>

        <div style={{ background: '#F8F6F2', borderTop: `1px solid rgba(${ACCENT_RGB},0.15)`, padding: '8px 16px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#5E6C84' }}>
            Drag sliders to rate EdSpark's moat strength · Reveal Gong to compare — where are you stronger?
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// SECTION 3: Systems Thinking Cascade
// Click a decision, see 1st and 2nd order effects
// ─────────────────────────────────────────
type DecisionKey = 'onboarding' | 'ai-score' | 'manager-dashboard';
const DECISIONS: { key: DecisionKey; label: string; first: string; second: string; third: string }[] = [
  {
    key: 'onboarding',
    label: 'Simplify onboarding to 3 steps',
    first: 'Week-1 activation rate increases from 48% to 71%',
    second: 'Reps skip the CRM sync step → coaching data is incomplete',
    third: 'AI coaching scores become unreliable → managers distrust the product',
  },
  {
    key: 'ai-score',
    label: 'Make AI call scores visible to managers only',
    first: 'Managers adopt the feature faster — 80% weekly active',
    second: 'Reps feel surveilled → engagement drops 22% among top performers',
    third: 'Best reps advocate against EdSpark in Slack communities',
  },
  {
    key: 'manager-dashboard',
    label: 'Add team-wide performance dashboard',
    first: 'Sales VPs love it — drives 3 upsell conversations in Q1',
    second: 'Individual reps see peer rankings → unhealthy competition emerges',
    third: 'Manager requests custom ranking logic → support load increases 40%',
  },
];

const Section3Mockup = () => {
  const [selected, setSelected] = useState<DecisionKey | null>(null);
  const [step, setStep] = useState(0);
  const decision = DECISIONS.find(d => d.key === selected);

  const steps = decision ? [
    { label: '1st Order', text: decision.first, color: '#0D7A5A', bg: 'rgba(13,122,90,0.08)' },
    { label: '2nd Order', text: decision.second, color: '#B5720A', bg: 'rgba(181,114,10,0.08)' },
    { label: '3rd Order', text: decision.third,  color: '#C85A40', bg: 'rgba(200,90,64,0.08)' },
  ] : [];

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid rgba(${ACCENT_RGB},0.25)`, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ background: '#0F172A', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.08em' }}>
            EdSpark Decision Simulator · Systems Thinking
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#97A0AF', letterSpacing: '0.1em', marginBottom: '10px' }}>SELECT A DECISION</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
            {DECISIONS.map(d => (
              <button key={d.key} onClick={() => { setSelected(d.key); setStep(0); }}
                style={{ padding: '10px 14px', borderRadius: '8px', border: `1.5px solid ${selected === d.key ? ACCENT : '#E0D9D0'}`, background: selected === d.key ? `rgba(${ACCENT_RGB},0.06)` : '#F8F6F2', cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontWeight: selected === d.key ? 600 : 400, color: selected === d.key ? ACCENT : '#1C1814', transition: 'all 0.15s' }}>
                → {d.label}
              </button>
            ))}
          </div>

          {decision && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                {steps.map((s, i) => (
                  <React.Fragment key={i}>
                    <button onClick={() => setStep(i)}
                      style={{ padding: '4px 10px', borderRadius: '20px', border: `1px solid ${i <= step ? s.color : '#E0D9D0'}`, background: i <= step ? s.bg : 'transparent', color: i <= step ? s.color : '#97A0AF', fontSize: '10px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', transition: 'all 0.2s' }}>
                      {s.label}
                    </button>
                    {i < steps.length - 1 && <span style={{ color: '#E0D9D0', fontSize: '14px' }}>→</span>}
                  </React.Fragment>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: '14px 16px', borderRadius: '8px', background: steps[step].bg, border: `1px solid ${steps[step].color}33` }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: steps[step].color, marginBottom: '6px' }}>{steps[step].label} EFFECT</div>
                  <div style={{ fontSize: '13px', color: '#1C1814', lineHeight: 1.6 }}>{steps[step].text}</div>
                  {step < steps.length - 1 && (
                    <button onClick={() => setStep(s => s + 1)} style={{ marginTop: '10px', padding: '4px 12px', borderRadius: '4px', background: steps[step].color, color: '#fff', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                      See next effect →
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>

        <div style={{ background: '#F8F6F2', borderTop: `1px solid rgba(${ACCENT_RGB},0.15)`, padding: '8px 16px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#5E6C84' }}>
            Pick a decision · step through 1st → 2nd → 3rd order effects to see what Priya missed
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// SECTION 4: Bet Sizing — allocate 12 engineer-weeks
// ─────────────────────────────────────────
const BETS = [
  { id: 'onboarding', label: 'Fix onboarding flow',        impact: 'HIGH',   risk: 'LOW',    minWeeks: 2, color: '#0D7A5A' },
  { id: 'analytics',  label: 'Manager analytics dashboard', impact: 'MED',    risk: 'MED',    minWeeks: 4, color: '#B5720A' },
  { id: 'salesforce', label: 'Salesforce deep integration', impact: 'HIGH',   risk: 'HIGH',   minWeeks: 8, color: '#C85A40' },
];
const TOTAL_WEEKS = 12;

const Section4Mockup = () => {
  const [allocated, setAllocated] = useState<Record<string, number>>({ onboarding: 4, analytics: 4, salesforce: 4 });
  const total = Object.values(allocated).reduce((a, b) => a + b, 0);
  const remaining = TOTAL_WEEKS - total;

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid rgba(${ACCENT_RGB},0.25)`, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ background: '#172B4D', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#B8C4D4', fontWeight: 600, letterSpacing: '0.08em' }}>
              EdSpark · Q2 Bets · 12 engineer-weeks available
            </div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: remaining === 0 ? '#28C840' : remaining < 0 ? '#FF5F57' : '#FFBD2E', fontWeight: 700 }}>
            {remaining >= 0 ? `${remaining} wks remaining` : `${Math.abs(remaining)} wks over budget`}
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px' }}>
          {BETS.map(bet => (
            <div key={bet.id} style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #F0EDE8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C1814' }}>{bet.label}</div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <span style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, background: bet.impact === 'HIGH' ? 'rgba(13,122,90,0.1)' : 'rgba(181,114,10,0.1)', color: bet.impact === 'HIGH' ? '#0D7A5A' : '#B5720A' }}>IMPACT {bet.impact}</span>
                    <span style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, background: bet.risk === 'HIGH' ? 'rgba(200,90,64,0.1)' : bet.risk === 'MED' ? 'rgba(181,114,10,0.1)' : 'rgba(13,122,90,0.1)', color: bet.risk === 'HIGH' ? '#C85A40' : bet.risk === 'MED' ? '#B5720A' : '#0D7A5A' }}>RISK {bet.risk}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => setAllocated(a => ({ ...a, [bet.id]: Math.max(bet.minWeeks, a[bet.id] - 1) }))}
                    style={{ width: '24px', height: '24px', borderRadius: '50%', border: `1px solid ${bet.color}`, background: 'transparent', color: bet.color, cursor: 'pointer', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '16px', fontWeight: 900, color: bet.color, minWidth: '32px', textAlign: 'center' }}>{allocated[bet.id]}</span>
                  <button onClick={() => setAllocated(a => ({ ...a, [bet.id]: a[bet.id] + 1 }))}
                    style={{ width: '24px', height: '24px', borderRadius: '50%', border: `1px solid ${bet.color}`, background: 'transparent', color: bet.color, cursor: 'pointer', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#8A8580' }}>wks</span>
                </div>
              </div>
              <div style={{ height: '6px', background: '#F0EDE8', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${(allocated[bet.id] / TOTAL_WEEKS) * 100}%` }} style={{ height: '100%', background: bet.color, borderRadius: '3px' }} />
              </div>
            </div>
          ))}

          <div style={{ padding: '10px 14px', borderRadius: '8px', background: remaining < 0 ? 'rgba(200,90,64,0.08)' : remaining === 0 ? 'rgba(13,122,90,0.08)' : 'rgba(124,58,237,0.06)', border: `1px solid ${remaining < 0 ? 'rgba(200,90,64,0.3)' : remaining === 0 ? 'rgba(13,122,90,0.3)' : 'rgba(124,58,237,0.2)'}` }}>
            <div style={{ fontSize: '12px', color: '#1C1814', lineHeight: 1.6 }}>
              {remaining < 0 ? `⚠️ Over budget by ${Math.abs(remaining)} weeks. Reduce allocation or cut a bet.` : remaining === 0 ? '✓ Fully allocated. Does this sequence make sense given EdSpark\'s 40% churn problem?' : `${remaining} weeks unallocated — what else deserves investment?`}
            </div>
          </div>
        </div>

        <div style={{ background: '#F8F6F2', borderTop: `1px solid rgba(${ACCENT_RGB},0.15)`, padding: '8px 16px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#5E6C84' }}>
            Adjust engineer-weeks per bet · stay within 12 total · minimum allocation shown per bet
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// SECTION 5: Land-and-Expand Account Map
// Click expansion opportunities in an enterprise account
// ─────────────────────────────────────────
type OppStatus = 'locked' | 'target' | 'active' | 'won';
interface Opp { id: string; label: string; seats: number; status: OppStatus; dept: string }

const Section5Mockup = () => {
  const [opps, setOpps] = useState<Opp[]>([
    { id: 'land',    label: 'West Coast Sales Team',    seats: 50,  status: 'won',    dept: 'Sales' },
    { id: 'east',    label: 'East Coast Sales Team',    seats: 60,  status: 'target', dept: 'Sales' },
    { id: 'se',      label: 'Solutions Engineering',    seats: 25,  status: 'target', dept: 'Pre-Sales' },
    { id: 'enablement', label: 'Sales Enablement',     seats: 15,  status: 'locked', dept: 'L&D' },
    { id: 'mgr',     label: 'Regional Sales Managers',  seats: 18,  status: 'active', dept: 'Management' },
    { id: 'rev',     label: 'Revenue Ops',              seats: 12,  status: 'locked', dept: 'Ops' },
  ]);

  const advance = (id: string) => {
    setOpps(prev => prev.map(o => {
      if (o.id !== id) return o;
      const next: Record<OppStatus, OppStatus> = { locked: 'target', target: 'active', active: 'won', won: 'won' };
      return { ...o, status: next[o.status] };
    }));
  };

  const totalWon = opps.filter(o => o.status === 'won').reduce((a, o) => a + o.seats, 0);
  const target = 500;

  const statusConfig: Record<OppStatus, { label: string; color: string; bg: string; border: string }> = {
    locked:  { label: 'LOCKED',  color: '#8A8580', bg: '#F8F6F2', border: '#E0D9D0' },
    target:  { label: 'TARGET',  color: '#B5720A', bg: 'rgba(181,114,10,0.08)', border: 'rgba(181,114,10,0.3)' },
    active:  { label: 'IN PILOT', color: ACCENT,   bg: `rgba(${ACCENT_RGB},0.08)`, border: `rgba(${ACCENT_RGB},0.3)` },
    won:     { label: 'WON',     color: '#0D7A5A', bg: 'rgba(13,122,90,0.08)', border: 'rgba(13,122,90,0.3)' },
  };

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid rgba(${ACCENT_RGB},0.25)`, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ background: '#0F2744', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#7FBAFF', fontWeight: 600, letterSpacing: '0.08em' }}>
              Apex Corp · Account Expansion Map · Target: 500 seats
            </div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 700, color: totalWon >= target ? '#28C840' : '#7FBAFF' }}>
            {totalWon}/{target} seats
          </div>
        </div>

        <div style={{ background: '#fff', padding: '16px' }}>
          <div style={{ height: '6px', background: '#F0EDE8', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
            <motion.div animate={{ width: `${Math.min(100, (totalWon / target) * 100)}%` }} style={{ height: '100%', background: '#0D7A5A', borderRadius: '3px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {opps.map(opp => {
              const cfg = statusConfig[opp.status];
              return (
                <motion.div key={opp.id} whileHover={{ y: -1 }}
                  style={{ padding: '12px', borderRadius: '8px', background: cfg.bg, border: `1.5px solid ${cfg.border}`, cursor: opp.status !== 'won' ? 'pointer' : 'default' }}
                  onClick={() => advance(opp.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C1814', lineHeight: 1.3 }}>{opp.label}</div>
                    <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, flexShrink: 0, marginLeft: '6px' }}>{cfg.label}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: '#8A8580' }}>{opp.dept}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: cfg.color }}>{opp.seats} seats</span>
                  </div>
                  {opp.status !== 'won' && (
                    <div style={{ marginTop: '8px', fontSize: '10px', color: cfg.color, fontWeight: 600 }}>
                      Click to advance →
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div style={{ background: '#F8F6F2', borderTop: `1px solid rgba(${ACCENT_RGB},0.15)`, padding: '8px 16px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#5E6C84' }}>
            Click each team to advance: Locked → Target → In Pilot → Won · reach 500 seats to complete the expand
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────
export default function Track1ProductStrategy({ onSectionChange }: { onSectionChange?: (id: string) => void }) {
  return (
    <>

      {/* ── SECTION 1: Strategy vs Features ─────── */}
      <ChapterSection id="m2s-strategy-vs-features" num="01" accentRgb={ACCENT_RGB} first>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          It&apos;s Monday morning at EdSpark. Rohan, the CEO, opens the all-hands with a slide: &ldquo;40% of new managers churn in week one. I want five new features shipped this quarter.&rdquo;
          Priya is scribbling notes. She knows the feature list is three pages long. What she doesn&apos;t know yet is whether any of those features will actually solve the problem.
        </SituationCard>

        {h2(<>When Building Is Easy, What to Build Matters More</>)}

        {para(<>
          Priya has seen this pattern before. A metric goes red, leadership calls for more features, engineering starts scoping, and six months later the metric is still red — but the product is 30% more complex.
          The problem wasn&apos;t a missing feature. It was a missing strategy.
          Product strategy is the answer to: <em>why this bet, for this customer, in this market, right now?</em>
        </>)}

        {pullQuote("Features are answers. Strategy is knowing which questions matter.")}

        {para(<>
          The wrong move is treating a strategy session like a backlog grooming. A prioritization framework (RICE, MoSCoW) is a tactic — it tells you how to sequence what you&apos;ve already decided to build.
          Strategy sits upstream. It decides which problems are worth solving at all, and which customer segments to serve.
          Stripe didn&apos;t win by shipping more payment features than PayPal. They won by targeting developers with a better API — that was the strategic insight that unlocked everything else.
        </>)}

        {keyBox("What Product Strategy Is (and Isn't)", [
          "Strategy: which customers, which problems, which bets — and why now",
          "Tactic: how you build, prioritize, and ship those bets",
          "Feature: a specific solution to a specific problem within a tactic",
        ])}

        <Section1Mockup />

        {para(<>
          After the exercise, Priya walks Rohan through the sorted list. The five features he wants are all tactics — good ones, probably — but none of them address why new managers churn in week one.
          That answer requires a different question: <em>what does a new manager actually need to succeed in their first 7 days?</em>
        </>)}

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Rohan isn&apos;t wrong to ask for features. Features ship, features are tangible, features can be measured. What&apos;s the actual risk of just building the list?</>}
          expandedContent={<>The risk is opportunity cost and compounding complexity. Every feature you ship narrows your design space for future features, adds support burden, and signals to the market what kind of product you are. Shipping the wrong features doesn&apos;t just waste engineering time — it shapes customer expectations in ways that are hard to reverse.</>}
          question="What is the primary difference between product strategy and product tactics?"
          options={[
            { text: "Strategy is long-term, tactics are short-term deliverables", correct: false, feedback: "Time horizon is a symptom, not the definition. A 6-month tactic is still a tactic." },
            { text: "Strategy defines which bets to make; tactics define how to execute them", correct: true, feedback: "Exactly. Strategy answers 'what to build and why'. Tactics answer 'how to build it well'." },
            { text: "Strategy comes from leadership; tactics come from the product team", correct: false, feedback: "Great PMs own strategy, not just execution. Waiting for leadership to set strategy is itself a tactical mindset." },
          ]}
          conceptId="product-strategy"
        />

        <QuizEngine
          conceptId="product-strategy"
          conceptName="Product Strategy"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={QUIZZES[0]}
        />

      </ChapterSection>

      {/* ── SECTION 2: Vision & Moats ─────────────── */}
      <ChapterSection id="m2s-vision-moats" num="02" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya runs a competitive analysis. Gong.io has $583M raised and 4,000 customers.
          Chorus just got acquired by ZoomInfo. Salesforce has Einstein Call Coaching baked into every Enterprise contract.
          She stares at the slide and thinks: how is EdSpark supposed to win?
        </SituationCard>

        {h2(<>You Don&apos;t Beat Giants on Features. You Build Moats.</>)}

        {para(<>
          The worst strategic mistake is trying to out-feature a well-funded competitor.
          Gong.io has 500 engineers. EdSpark has six. Feature parity is not a strategy — it&apos;s a race you will lose.
          The question isn&apos;t &ldquo;what does Gong have that we don&apos;t?&rdquo; It&apos;s &ldquo;where can we build a moat that Gong can&apos;t easily replicate?&rdquo;
        </>)}

        {pullQuote("A competitive moat isn't what you have. It's what makes switching to you painful — and switching away even more painful.")}

        {para(<>
          Priya looks at EdSpark&apos;s data: 80% of churned customers cite &ldquo;the product didn&apos;t connect to how we actually run deals.&rdquo;
          That&apos;s a clue. EdSpark&apos;s CRM integration is deeper than any competitor&apos;s — it reads deal stages, quota attainment, and manager-to-rep ratios in real time.
          No one else does this. That&apos;s not a feature. That&apos;s a switching cost — because once you&apos;ve built your coaching cadences around live CRM data, migrating to Gong means rebuilding everything.
        </>)}

        {keyBox("The Four Moat Types", [
          "Network effects: product improves as more users join (Slack, Figma)",
          "Switching costs: painful to migrate workflows, data, integrations (EdSpark's CRM depth)",
          "Cost advantage: structural cost to serve lower than competitors (AWS scale)",
          "Data / AI moat: proprietary data makes AI recommendations better over time",
        ])}

        <Section2Mockup />

        {para(<>
          Priya&apos;s analysis shows EdSpark&apos;s highest-rated moat is switching costs — specifically the CRM integration.
          Her strategic recommendation: double down on CRM depth, not breadth. Don&apos;t try to match Gong on call analytics. Win on being the only platform that knows a rep&apos;s full deal context before the coaching session starts.
        </>)}

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>If EdSpark&apos;s main moat is switching costs, what happens the day Salesforce bundles call coaching into its base tier for free?</>}
          expandedContent={<>That&apos;s the strategic risk of a single-moat strategy. The best defensive position combines moats — switching costs AND a data moat (coaching patterns that get smarter per org over time). Priya should be asking: how do we build a second moat before the first one erodes?</>}
          question="EdSpark's CRM integration creates which type of competitive moat?"
          options={[
            { text: "A network effect, because more EdSpark users share call data", correct: false, feedback: "Network effects require value to increase as the total user base grows. CRM integration benefits the individual org, not the network." },
            { text: "A switching cost moat, because migrating CRM integrations is painful", correct: true, feedback: "Exactly. Deep CRM configuration creates migration friction that protects EdSpark's installed base even when competitors ship better features." },
            { text: "A cost advantage, because deep integrations reduce EdSpark's cloud spend", correct: false, feedback: "Cost advantage moats are about structural cost-to-serve, not integration depth. This is a retention moat, not a cost moat." },
          ]}
          conceptId="competitive-moats"
        />

        <QuizEngine
          conceptId="competitive-moats"
          conceptName="Competitive Moats"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={QUIZZES[1]}
        />

      </ChapterSection>

      {/* ── SECTION 3: Systems Thinking ──────────── */}
      <ChapterSection id="m2s-systems-thinking" num="03" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya ships the simplified onboarding. Week-1 activation climbs from 48% to 71% — a clear win.
          Two weeks later, her Slack lights up. The RevOps lead flags that AI coaching scores for new reps look &ldquo;completely wrong.&rdquo;
          It turns out new users are skipping the CRM sync step — the one she removed from onboarding to make it simpler.
        </SituationCard>

        {h2(<>Every Fix Creates a New System. Think in Second-Order Effects.</>)}

        {para(<>
          Priya solved the activation problem (first-order effect) but broke the data pipeline that coaching scores depend on (second-order effect).
          This is the trap of optimizing one metric in isolation. Products are systems — changing one lever moves others.
          Systems thinking is a PM superpower because it lets you anticipate the downstream consequences of decisions before you ship them, not after.
        </>)}

        {pullQuote("First-order thinking asks: what happens next? Systems thinking asks: what happens after that?")}

        {para(<>
          The classic PM failure is solving the symptom without mapping the system. A team adds a feature to reduce support tickets — and doubles engineering complexity.
          Another team removes friction from signup — and destroys the quality signal that sales used to qualify leads.
          Before shipping any significant change, great PMs draw the causal chain: Decision → 1st effect → 2nd effect → 3rd effect. Where does it break?
        </>)}

        {keyBox("Systems Thinking Checklist", [
          "Map who else depends on what you're changing (other teams, features, metrics)",
          "Ask: if this works perfectly, what new problem does it create?",
          "Identify the feedback loops — does the fix reinforce or undermine itself?",
        ])}

        <Section3Mockup />

        {para(<>
          After running through the simulator, Priya adds a &ldquo;lightweight CRM sync&rdquo; step back into onboarding — but makes it contextual: only shown to users whose org has CRM connected.
          Activation stays high. Data quality recovers. The key was mapping the system before shipping the simplification.
        </>)}

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>If second-order effects are so important, why don&apos;t all PMs map them before shipping? What gets in the way?</>}
          expandedContent={<>Pressure. When churn is 40% and the board wants results, taking two days to map causal chains feels like delay. The real skill is doing a fast systems sketch — 20 minutes, whiteboard, just three levels deep. It doesn&apos;t have to be perfect to be useful.</>}
          question="Priya fixes onboarding and improves activation, but AI coaching scores break. This is best described as:"
          options={[
            { text: "A product regression caused by insufficient QA before shipping", correct: false, feedback: "Regression means something that worked before now breaks. This is a systemic consequence, not a code bug. QA wouldn't have caught it." },
            { text: "A second-order effect — solving one problem created a downstream impact", correct: true, feedback: "Exactly. Second-order effects are the downstream consequences of first-order changes. Priya fixed activation but disrupted the data pipeline coaching scores depend on." },
            { text: "A stakeholder misalignment between product and the RevOps team", correct: false, feedback: "Stakeholder misalignment is a communication problem. This is a systems problem — the architecture of how onboarding feeds the coaching model." },
          ]}
          conceptId="systems-thinking"
        />

        <QuizEngine
          conceptId="systems-thinking"
          conceptName="Systems Thinking"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={QUIZZES[2]}
        />

      </ChapterSection>

      {/* ── SECTION 4: Bet Sizing ─────────────────── */}
      <ChapterSection id="m2s-bet-sizing" num="04" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Q2 planning. Priya has three competing bets and twelve engineer-weeks to allocate.
          Bet A: fix onboarding (low risk, high impact on retention). Bet B: manager analytics dashboard (medium risk, medium impact). Bet C: deep Salesforce integration (high risk, highest revenue potential, 8-week minimum).
          Engineering asks: &ldquo;Which order do we go in?&rdquo;
        </SituationCard>

        {h2(<>Strategy Is Saying No to Good Ideas</>)}

        {para(<>
          The hardest part of product strategy is not finding good ideas — it&apos;s saying no to good ideas in service of the best ones.
          Bet sizing is the process of deciding how much to invest in each strategic bet relative to its expected return and risk.
          The key insight: size bets asymmetrically. Put your biggest bets on the highest-conviction opportunities. Don&apos;t spread resources evenly across everything interesting.
        </>)}

        {pullQuote("Trying to pursue every good opportunity is a strategy for pursuing none of them well.")}

        {para(<>
          A common mistake is allocating resources by committee consensus — a little for everything, no one bet gets enough to succeed.
          Amazon&apos;s strategy in AWS was the opposite: a huge, focused bet on a market no one thought Amazon should be in.
          For EdSpark, with 40% churn, Bet A (onboarding) has the clearest ROI path: fix the bleed first, then build the upsell story that justifies Bet C.
          Sequencing matters as much as allocation.
        </>)}

        {keyBox("Bet Sizing Principles", [
          "Fix the bleed before you invest in growth — leaky buckets waste every dollar",
          "High-risk bets need minimum viable validation before full investment",
          "Under-resourced bets fail — give winning bets enough to actually win",
        ])}

        <Section4Mockup />

        {para(<>
          Priya allocates 5 weeks to Bet A (enough to ship a proper fix), 3 weeks to Bet B (scoped to core analytics only), and 4 weeks to Bet C as a discovery sprint — not the full build.
          The board pushes back on not doing the Salesforce integration fully. Priya&apos;s argument: &ldquo;We can&apos;t sell enterprise integrations to customers who are still churning in week one.&rdquo;
          That&apos;s strategic sequencing. It wins.
        </>)}

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>If you always fix the bleed before you invest in growth, how do you ever build something new? Doesn&apos;t &lsquo;fix retention first&rsquo; become an excuse to never take strategic bets?</>}
          expandedContent={<>Yes — it can. The test is whether the retention problem is structural (requires strategy to fix) or tactical (requires execution to fix). If onboarding is broken, that&apos;s a tactical fix — quick, measurable, finite. If your core value prop is broken, that&apos;s a strategic problem and no growth investment will save you.</>}
          question="EdSpark has 12 engineer-weeks. Bet C (Salesforce integration) needs 8 minimum but has the highest revenue potential. What should Priya recommend?"
          options={[
            { text: "Fully fund Bet C — highest revenue potential always wins the allocation", correct: false, feedback: "High revenue potential means nothing on a product with 40% week-1 churn. You can't upsell customers who've already left." },
            { text: "Start with the retention fix, then run Bet C as a scoped discovery sprint", correct: true, feedback: "Right. Bet A unblocks the retention metric that makes Bet C investable. A discovery sprint on Bet C validates the integration scope without over-committing." },
            { text: "Split evenly across all three bets to maintain optionality this quarter", correct: false, feedback: "Even splits mean no bet gets enough resources to succeed. This is the worst of all worlds — you spend 12 weeks and ship nothing meaningful." },
          ]}
          conceptId="bet-sizing"
        />

        <QuizEngine
          conceptId="bet-sizing"
          conceptName="Bet Sizing"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={QUIZZES[3]}
        />

      </ChapterSection>

      {/* ── SECTION 5: B2B Strategy & Interviews ──── */}
      <ChapterSection id="m2s-b2b-strategy" num="05" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          EdSpark closes its first mid-market deal: Apex Corp, 50 seats, West Coast sales team only.
          The contract has a 12-month option to expand to 500 seats company-wide.
          Priya is now the DRI on making the land-and-expand strategy work. The VP of Sales at Apex says: &ldquo;Impress us in 90 days.&rdquo;
        </SituationCard>

        {h2(<>B2B Strategy: Land Small, Win Big, Expand Everywhere</>)}

        {para(<>
          Consumer products grow through virality and network effects. B2B products grow through land-and-expand.
          Land-and-expand is the dominant B2B growth motion: win a beachhead in one team or department, prove value, then use that proof to expand across the organization.
          The land is not the goal — it&apos;s the cost of getting the proof you need to expand.
        </>)}

        {pullQuote("In B2B, the first contract is a pilot. The expansion is the actual business.")}

        {para(<>
          The mistake Priya must avoid: treating the 50-seat deal as a success and moving on.
          The 50 seats are the test. What she needs in 90 days is a success story that the VP can take to the CRO — specific, measurable, attributable to EdSpark.
          Slack&apos;s land-and-expand playbook: get one team addicted, let the internal champion become a case study, let peer pressure do the expansion selling.
          It&apos;s not about features. It&apos;s about creating a win so undeniable that the champion&apos;s career becomes linked to EdSpark&apos;s success.
        </>)}

        {keyBox("Land-and-Expand Playbook", [
          "Land: target a high-visibility team with a clear pain point you can solve in 30 days",
          "Prove: get to 10+ daily active users and document one concrete, measurable win",
          "Expand: arm the champion with that win story to sell up and sideways in the org",
        ])}

        <Section5Mockup />

        {para(<>
          Priya maps Apex Corp&apos;s expansion opportunities: East Coast team, Solutions Engineering, Sales Enablement, and Revenue Ops.
          Her 90-day plan: get the West Coast team to measurable results (ramp time down 20%), then use that as the internal case study for the East Coast expansion conversation.
          Strategic thinking in interviews follows the same logic: interviewers want to see that you can identify the beachhead, sequence the expansion, and name the metric that proves the strategy is working.
        </>)}

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Land-and-expand assumes the product is good enough that the first team will become advocates. What if the 50-seat pilot is struggling — do you still try to expand?</>}
          expandedContent={<>No. And knowing when to stop expanding is as important as knowing when to push. If the pilot team is struggling, expanding multiplies the failure — you get 500 unhappy seats instead of 50. The strategic move is to shrink the scope, find the one persona or use case where EdSpark actually works, win there, and rebuild the expansion story from that narrower proof point.</>}
          question="EdSpark lands a 50-seat deal with a goal of 500 seats in 18 months. The most important 90-day milestone is:"
          options={[
            { text: "Building the enterprise SSO and admin controls before the first QBR meeting", correct: false, feedback: "Admin features are table stakes, not proof of value. A QBR with no usage story is a renewal risk, not a success signal." },
            { text: "Getting 10+ reps to daily usage and documenting one measurable business win", correct: true, feedback: "Exactly. Daily usage proves adoption. One concrete win (e.g. ramp time dropped 20%) gives the champion the story they need to justify expansion to their VP." },
            { text: "Locking in the expansion contract terms before the 90-day pilot period ends", correct: false, feedback: "Locking in contract terms before proving value is backwards. The proof creates the leverage for a good expansion contract — not the other way around." },
          ]}
          conceptId="b2b-strategy"
        />

        <QuizEngine
          conceptId="b2b-strategy"
          conceptName="B2B Strategy"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={QUIZZES[4]}
        />

      </ChapterSection>

      <NextChapterTeaser text="Next: Problem Discovery — strategy tells you which problem to solve. Discovery tells you whether you've actually found it." />

    </>
  );
}

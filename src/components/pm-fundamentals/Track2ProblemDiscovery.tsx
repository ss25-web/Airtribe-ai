'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizEngine from '../QuizEngine';
import {
  glassCard, demoLabel, h2, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser,
} from './designSystem';

// ─────────────────────────────────────────
// LOCAL HELPERS
// ─────────────────────────────────────────
const InfoBox = ({ title, accent = 'var(--teal)', children }: { title: string; accent?: string; children: React.ReactNode }) => (
  <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '20px 24px', margin: '24px 0', border: '1px solid var(--ed-rule)', borderLeft: `4px solid ${accent}` }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: accent, marginBottom: '14px' }}>{title}</div>
    {children}
  </div>
);

// ─────────────────────────────────────────
// NOTION: RESEARCH REPO MOCKUP
// ─────────────────────────────────────────
const NotionResearchRepoMockup = () => (
  <div style={{ margin: '32px 0', perspective: '1200px' }}>
  <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E0D9D0', boxShadow: '0 24px 64px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08)', background: '#fff', transform: 'perspective(1200px) rotateX(1.5deg) rotateY(-0.5deg)', transition: 'transform 0.4s ease' }}>
    <div style={{ background: '#F7F6F3', borderBottom: '1px solid #E0D9D0', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '5px' }}>
        {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />)}
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ fontSize: '11px', color: '#999', fontFamily: 'monospace', background: '#EDEDEC', padding: '3px 12px', borderRadius: '5px' }}>
          📚 EdSpark · PM Research Repository
        </div>
      </div>
    </div>
    <div style={{ display: 'flex', minHeight: '300px' }}>
      <div style={{ width: '200px', background: '#F7F6F3', borderRight: '1px solid #E0D9D0', padding: '14px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 12px', marginBottom: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#37352F', marginBottom: '2px' }}>🔭 Research Hub</div>
          <div style={{ fontSize: '10px', color: '#999' }}>Priya Sharma · PM Team</div>
        </div>
        {[
          { icon: '📋', label: 'Research Template', active: false },
          { icon: '🗂️', label: 'Insight Repository', active: true },
          { icon: '📊', label: 'Onboarding Studies', active: false },
          { icon: '📊', label: 'Retention Studies', active: false },
          { icon: '📄', label: '→ Q1 Churn Brief', active: false },
          { icon: '📄', label: '→ Manager JTBD', active: false },
          { icon: '📄', label: '→ Setup Drop-off', active: false },
        ].map(item => (
          <div key={item.label} style={{ padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '7px', background: item.active ? '#EDEDEC' : 'transparent', borderRadius: '4px', margin: '1px 4px' }}>
            <span style={{ fontSize: '12px' }}>{item.icon}</span>
            <span style={{ fontSize: '11px', color: item.active ? '#37352F' : '#888', fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: '20px 28px', background: '#fff', overflow: 'hidden' }}>
        <div style={{ fontSize: '9px', fontFamily: 'monospace', color: '#999', letterSpacing: '0.1em', marginBottom: '6px' }}>SHARED REPOSITORY · LAST UPDATED TODAY</div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#37352F', marginBottom: '4px' }}>🗂️ Insight Repository</div>
        <div style={{ fontSize: '11px', color: '#999', marginBottom: '16px' }}>16 studies · 89 tagged insights · 4 open research questions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {[
            { tag: 'Managers need to prove ROI to leadership', studies: '4 studies', strength: 'Strong', color: '#0097A7', bg: 'rgba(0,151,167,0.05)' },
            { tag: 'No feedback loop after recording upload', studies: '3 studies', strength: 'Strong', color: '#0097A7', bg: 'rgba(0,151,167,0.05)' },
            { tag: 'Setup friction under-reported vs churn signal', studies: '2 studies', strength: 'Emerging', color: '#B5720A', bg: 'rgba(181,114,10,0.05)' },
            { tag: 'Reps adoption driven by manager mandate', studies: '2 studies', strength: 'Emerging', color: '#B5720A', bg: 'rgba(181,114,10,0.05)' },
          ].map(row => (
            <div key={row.tag} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '7px', background: row.bg, border: `1px solid ${row.color}30`, borderLeft: `3px solid ${row.color}` }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '12px', color: '#37352F', lineHeight: 1.4 }}>{row.tag}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
                <span style={{ fontSize: '8px', fontWeight: 800, color: row.color, fontFamily: 'monospace', letterSpacing: '0.06em', background: `${row.color}15`, padding: '2px 6px', borderRadius: '3px' }}>{row.strength.toUpperCase()}</span>
                <span style={{ fontSize: '9px', color: '#999', fontFamily: 'monospace' }}>{row.studies}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '6px', background: 'rgba(0,151,167,0.07)', border: '1px solid rgba(0,151,167,0.2)' }}>
          <div style={{ fontSize: '9px', fontFamily: 'monospace', color: '#0097A7', letterSpacing: '0.1em', marginBottom: '4px' }}>PRIYA&apos;S NOTE</div>
          <div style={{ fontSize: '11px', color: '#555', lineHeight: 1.7 }}>
            Before starting any study: check the repo. 40% of what stakeholders call &ldquo;new research questions&rdquo; already have partial answers here. This is how you avoid re-interviewing the same users with the same questions.
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
);

// ─────────────────────────────────────────
// KRAFTFUL: TREND ANALYSIS MOCKUP
// ─────────────────────────────────────────
const KraftfulTrendMockup = () => {
  // Each month: two side-by-side bars (onboarding, value)
  const months = [
    { month: 'Oct', onboarding: 38, value: 21 },
    { month: 'Nov', onboarding: 36, value: 29 },
    { month: 'Dec', onboarding: 31, value: 38 },
    { month: 'Jan', onboarding: 28, value: 41 },
  ];
  const maxH = 110; // px height for 100%
  const series = [
    { key: 'onboarding' as const, label: 'Onboarding confusion', color: '#00BCD4', glow: 'rgba(0,188,212,0.35)' },
    { key: 'value' as const,      label: 'Value visibility gap', color: '#B794F4', glow: 'rgba(183,148,244,0.35)' },
  ];

  return (
    <div style={{ margin: '24px 0', borderRadius: '14px', overflow: 'hidden', border: '1px solid #1E3A3F', boxShadow: '0 12px 48px rgba(0,0,0,0.4)' }}>
      {/* Title bar */}
      <div style={{ background: 'linear-gradient(90deg,#0D1F24 0%,#0A1A1F 100%)', padding: '13px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, boxShadow: `0 0 4px ${c}55` }} />)}
          </div>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 800, color: '#00BCD4', letterSpacing: '0.12em', textShadow: '0 0 12px rgba(0,188,212,0.5)' }}>KRAFTFUL</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>/ EdSpark · Ticket Themes · Oct–Jan</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#28C840', boxShadow: '0 0 6px #28C840' }} />
          <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>1,240 tickets · AI analysis</div>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(180deg,#111C1F 0%,#0D1619 100%)', padding: '24px 28px' }}>
        {/* Legend */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          {series.map(s => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{ width: '12px', height: '4px', borderRadius: '2px', background: s.color, boxShadow: `0 0 6px ${s.glow}` }} />
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', height: `${maxH + 24}px`, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px', marginBottom: '8px' }}>
          {/* Y-axis labels */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: `${maxH}px`, marginBottom: '16px', flexShrink: 0 }}>
            {[40, 30, 20, 10].map(v => (
              <div key={v} style={{ fontSize: '8px', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', lineHeight: 1 }}>{v}%</div>
            ))}
          </div>
          {/* Grid lines + bars */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '20px', position: 'relative' }}>
            {/* Horizontal grid lines */}
            {[0.25, 0.5, 0.75, 1].map(f => (
              <div key={f} style={{ position: 'absolute', left: 0, right: 0, bottom: `${f * maxH}px`, borderTop: '1px dashed rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
            ))}
            {months.map((d, i) => (
              <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
                {/* Two bars side by side */}
                <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', width: '100%' }}>
                  {series.map((s, si) => {
                    const pct = d[s.key] / 50;
                    const h = Math.round(pct * maxH);
                    return (
                      <div key={s.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        {/* Value label */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.12 + si * 0.06 + 0.5, duration: 0.3 }}
                          style={{ fontSize: '9px', fontFamily: 'monospace', fontWeight: 700, color: s.color, lineHeight: 1 }}
                        >
                          {d[s.key]}%
                        </motion.div>
                        {/* Bar */}
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: `${h}px`, opacity: 1 }}
                          transition={{ delay: i * 0.12 + si * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                          style={{
                            width: '100%',
                            background: `linear-gradient(180deg, ${s.color} 0%, ${s.color}99 100%)`,
                            borderRadius: '4px 4px 1px 1px',
                            boxShadow: `0 -2px 12px ${s.glow}, inset 0 1px 0 rgba(255,255,255,0.15)`,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', marginTop: '6px', letterSpacing: '0.06em' }}>{d.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight callout */}
        <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(183,148,244,0.1) 0%, rgba(0,188,212,0.06) 100%)', border: '1px solid rgba(183,148,244,0.25)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '18px', flexShrink: 0, lineHeight: 1, marginTop: '2px' }}>✦</div>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: '#B794F4', letterSpacing: '0.12em', marginBottom: '5px' }}>AI INSIGHT</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75 }}>
              &ldquo;Onboarding confusion&rdquo; tickets are <span style={{ color: '#00BCD4', fontWeight: 600 }}>declining ↓26%</span>. &ldquo;Value visibility&rdquo; is <span style={{ color: '#B794F4', fontWeight: 600 }}>rising ↑95%</span> in 4 months. The problem may have shifted. If you&apos;re still optimising onboarding, you&apos;re solving yesterday&apos;s problem.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// DOVETAIL: INSIGHT CLUSTERS MOCKUP
// ─────────────────────────────────────────
const DovetailClustersMockup = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const clusters = [
    {
      theme: 'Managers need proof of ROI',
      count: 11, total: 14,
      quotes: [
        '"My director asked me last week if this is worth the cost." — Divya T.',
        '"I signed up to show my team I take development seriously — but I can\'t show that it\'s working." — Rahul S.',
        '"I want to walk into my next 1:1 with a number." — Sanjay M.',
      ],
      insight: 'This is a job, not a feature request. Managers need to justify EdSpark to their own managers. The product must surface visible evidence of impact — not just record calls.',
    },
    {
      theme: 'No feedback loop after recording upload',
      count: 9, total: 14,
      quotes: [
        '"I upload a recording, and then... nothing. I don\'t know what to do with it." — Kavita R.',
        '"I expected some kind of summary or score. It just sits there." — Mihir P.',
      ],
      insight: 'Users complete setup but have no model for what "using EdSpark" looks like afterward. The product has no native feedback loop post-upload.',
    },
    {
      theme: 'Onboarding friction (legacy finding)',
      count: 4, total: 14,
      quotes: ['"I got confused during setup on step 3." — Arjun K.'],
      insight: 'Still present but declining in frequency. This was the dominant signal in earlier cohorts. More recent users are finding setup easier — but churning for different reasons.',
    },
  ];
  return (
    <div style={{ margin: '32px 0', perspective: '1200px' }}>
    <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #2D1B69', boxShadow: '0 24px 64px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12)', transform: 'perspective(1200px) rotateX(1.5deg) rotateY(0.5deg)', transition: 'transform 0.4s ease' }}>
      <div style={{ background: '#1A1523', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: '#B794F4', letterSpacing: '0.1em' }}>DOVETAIL</div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>/ EdSpark Research · Manager Cohort · 14 interviews</div>
      </div>
      <div style={{ background: '#F9F8FF', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '8px', color: '#999', letterSpacing: '0.12em', marginBottom: '4px' }}>CLUSTERED THEMES · click to expand</div>
        {clusters.map((c, i) => (
          <motion.div key={i} layout style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${expanded === i ? '#7C3AED' : '#E0D9D0'}`, background: '#fff' }}>
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '6px', borderRadius: '3px', background: '#E0D9D0', overflow: 'hidden', flexShrink: 0 }}>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1523' }}>{c.theme}</span>
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: '#7C3AED', flexShrink: 0, marginLeft: '8px' }}>{c.count}/{c.total}</span>
            </button>
            <AnimatePresence>
              {expanded === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                  style={{ borderTop: '1px solid #E0D9D0', padding: '14px 16px', background: '#FDFCFF' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    {c.quotes.map((q, qi) => (
                      <div key={qi} style={{ fontSize: '12px', fontStyle: 'italic', color: '#555', padding: '8px 12px', borderRadius: '6px', background: 'rgba(124,58,237,0.05)', borderLeft: '3px solid #B794F4' }}>&ldquo;{q}&rdquo;</div>
                    ))}
                  </div>
                  <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '8px', color: '#7C3AED', letterSpacing: '0.1em', marginBottom: '5px' }}>INSIGHT</div>
                    <div style={{ fontSize: '12px', color: '#37352F', lineHeight: 1.7 }}>{c.insight}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 1: CHALLENGE THE BRIEF
// ─────────────────────────────────────────
const BRIEF_SCENARIOS = [
  {
    ceo_brief: '"We need better onboarding. Users are confused in the first week."',
    data_point: 'Kraftful shows onboarding-related tickets declining 26% while value-visibility tickets rose 95% over 4 months.',
    options: [
      { label: 'Run with it — CEO said onboarding, do onboarding', outcome: 'wrong', feedback: "You optimise for yesterday's problem. Onboarding confusion is declining — you'll ship improvements right as the root cause has shifted. 3 months wasted." },
      { label: 'Show the trend data and ask to reframe the research question', outcome: 'right', feedback: "The data reveals a shift. A good APM doesn't just execute the brief — they bring evidence that the brief may be based on stale assumptions. You earn trust by catching this early." },
      { label: 'Do both onboarding and value-visibility research in parallel', outcome: 'partial', feedback: "Hedging avoids the hard conversation. You'll deliver two shallow studies instead of one definitive one, and you still haven't resolved which problem to actually solve." },
    ],
  },
  {
    ceo_brief: '"Retention is down. We need to understand why managers are churning."',
    data_point: 'Your research repo already has a 3-month-old study on manager churn with 12 interviews. Key finding: managers churn when they can\'t demonstrate ROI to leadership.',
    options: [
      { label: 'Start new interviews — the old data is 3 months old', outcome: 'partial', feedback: "Not wrong, but not efficient. Before re-running interviews, validate whether the core finding has changed. Check if the product shipped anything in those 3 months that might shift the root cause. If not, the 3-month-old insight probably still holds." },
      { label: 'Check the repo first, then decide if new research is needed', outcome: 'right', feedback: "This is research ops maturity. You validate what you already know before spending 2 weeks re-interviewing. The repo exists precisely for this. If the core finding is stable, you can move faster." },
      { label: 'Send a survey — faster than interviews', outcome: 'wrong', feedback: "Surveys confirm hypotheses you already have. You don't have a good hypothesis yet — you have a symptom. Surveys will give you noise at scale, not insight." },
    ],
  },
];

const ChallengeBrief = () => {
  const [scene, setScene] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const sc = BRIEF_SCENARIOS[scene];
  const opt = chosen !== null ? sc.options[chosen] : null;

  return (
    <div style={glassCard('var(--purple)', '120,67,238')}>
      {demoLabel('When should you challenge the brief?', 'var(--purple)')}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {BRIEF_SCENARIOS.map((_, i) => (
          <button key={i} onClick={() => { setScene(i); setChosen(null); }}
            style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: i === scene ? 700 : 400, border: `2px solid ${i === scene ? 'var(--purple)' : 'var(--ed-rule)'}`, background: i === scene ? 'rgba(120,67,238,0.1)' : 'var(--ed-card)', color: i === scene ? 'var(--purple)' : 'var(--ed-ink3)', cursor: 'pointer' }}>
            Scenario {i + 1}
          </button>
        ))}
      </div>
      <div style={{ padding: '14px 18px', borderRadius: '10px', background: 'rgba(120,67,238,0.05)', border: '1px solid rgba(120,67,238,0.15)', marginBottom: '10px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--purple)', letterSpacing: '0.12em', marginBottom: '6px' }}>CEO BRIEF</div>
        <div style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--ed-ink)', lineHeight: 1.7 }}>{sc.ceo_brief}</div>
      </div>
      <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,151,167,0.06)', border: '1px solid rgba(0,151,167,0.2)', marginBottom: '20px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--teal)', letterSpacing: '0.12em', marginBottom: '5px' }}>YOU ALSO KNOW</div>
        <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{sc.data_point}</div>
      </div>
      {chosen === null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sc.options.map((o, i) => (
            <motion.button key={i} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} onClick={() => setChosen(i)}
              style={{ padding: '13px 16px', borderRadius: '10px', border: '2px solid rgba(120,67,238,0.18)', background: 'var(--ed-card)', cursor: 'pointer', textAlign: 'left' as const, fontSize: '13px', color: 'var(--ed-ink2)', transition: 'all 0.18s' }}>
              {o.label}
            </motion.button>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ padding: '14px 18px', borderRadius: '10px', border: `2px solid ${opt!.outcome === 'right' ? 'var(--green)' : opt!.outcome === 'partial' ? 'var(--blue)' : 'var(--coral)'}`, background: `rgba(${opt!.outcome === 'right' ? '21,129,88' : opt!.outcome === 'partial' ? '58,134,255' : '224,122,95'},0.06)`, marginBottom: '10px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', marginBottom: '7px', color: opt!.outcome === 'right' ? 'var(--green)' : opt!.outcome === 'partial' ? 'var(--blue)' : 'var(--coral)' }}>
              {opt!.outcome === 'right' ? '✓ STRONG MOVE' : opt!.outcome === 'partial' ? '~ PARTIAL' : '✗ RISKY CALL'}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>{opt!.feedback}</div>
          </div>
          <button onClick={() => setChosen(null)} style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ed-ink3)', background: 'none', border: '1px solid var(--ed-rule)', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer' }}>Try again →</button>
        </motion.div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 2: RESEARCH BIAS SPOTTER
// ─────────────────────────────────────────
const BIAS_CASES = [
  {
    scenario: 'You interview 10 managers who are still active users. 8 say they love EdSpark.',
    bias: 'Survivorship bias',
    color: 'var(--coral)',
    explanation: "You're only talking to the people who didn't leave. Churned managers — the ones who represent your actual problem — are invisible. Of course active users say they're happy. You've excluded the signal you need most.",
    fix: "Deliberately recruit churned users. If that's hard, use support ticket analysis (Kraftful) to surface the voice of users who stopped engaging.",
  },
  {
    scenario: 'You\'ve decided the problem is "no progress signal." You run interviews and find lots of supporting evidence.',
    bias: 'Confirmation bias',
    color: 'var(--purple)',
    explanation: "You're unconsciously steering questions and noticing evidence that confirms what you already believe. Disconfirming evidence gets mentally discounted. Priya almost did this — she had 'no progress signal' as her working theory and nearly missed that several users also mentioned a totally separate issue with rep-level data.",
    fix: "Before each interview, write down 'what would I learn that would prove my hypothesis wrong?' and actively listen for that.",
  },
  {
    scenario: 'The CEO asks you to investigate a specific pain point. You run 6 interviews. 5 of 6 mention it.',
    bias: 'Framing bias',
    color: 'var(--blue)',
    explanation: "The CEO framed the problem, and your participants may be responding to that frame. If you ask 'tell me about your onboarding experience,' you've primed users to think about onboarding. They'll mention onboarding-related issues even if something else is more important.",
    fix: "Open with unprimed questions: 'Walk me through your first two weeks with EdSpark' — before you ask about anything specific. Let them surface what's actually bothering them.",
  },
];

const BiasSpotter = () => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  return (
    <div style={glassCard('var(--coral)', '224,122,95')}>
      {demoLabel('Name the bias — tap to diagnose.', 'var(--coral)')}
      <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginBottom: '16px', lineHeight: 1.6 }}>Every research design has hidden biases. Senior PMs catch them before the study runs — not after the brief is written.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {BIAS_CASES.map((item, i) => {
          const isRevealed = revealed[i];
          return (
            <motion.button key={i} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
              style={{ padding: '16px 18px', borderRadius: '12px', border: `2px solid ${isRevealed ? item.color : 'rgba(224,122,95,0.2)'}`, background: 'var(--ed-card)', cursor: 'pointer', textAlign: 'left' as const, transition: 'all 0.2s' }}>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65, marginBottom: isRevealed ? '12px' : 0 }}>{item.scenario}</div>
              <AnimatePresence>
                {isRevealed && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 800, color: item.color, letterSpacing: '0.14em', marginBottom: '8px' }}>{item.bias.toUpperCase()}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7, marginBottom: '10px' }}>{item.explanation}</div>
                    <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(21,129,88,0.07)', border: '1px solid rgba(21,129,88,0.2)', borderLeft: '3px solid var(--green)' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--green)', letterSpacing: '0.12em', marginBottom: '5px' }}>HOW TO MITIGATE</div>
                      <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{item.fix}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 3: PROBLEM FRAMING SHOWDOWN
// ─────────────────────────────────────────
const FRAME_OPTIONS = [
  {
    frame: 'Onboarding is too confusing for new managers.',
    type: 'Symptom',
    color: 'var(--coral)',
    consequence: "This leads to UI fixes and tutorials. You'll ship a cleaner signup flow while churning for a completely different reason.",
  },
  {
    frame: 'Managers have no feedback loop that shows their coaching is working.',
    type: 'Root cause',
    color: 'var(--green)',
    consequence: "This opens up a much wider solution space: automated ROI summaries, coaching impact scores, manager-specific dashboards. You solve the job, not the surface symptom.",
  },
  {
    frame: 'EdSpark needs a better dashboard.',
    type: 'Solution in disguise',
    color: 'var(--purple)',
    consequence: "This isn't a problem statement — it's already a solution. You've skipped the 'why' and gone straight to the 'what.' The team will debate dashboard features instead of the real problem.",
  },
  {
    frame: 'Week-2 retention is 60% — below target.',
    type: 'Metric, not a problem',
    color: 'var(--blue)',
    consequence: "This describes a symptom in numbers. It's useful for scoping but not for guiding design. You still don't know what to fix.",
  },
];

const ProblemFramingShowdown = () => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  return (
    <div style={glassCard('var(--teal)', '0,151,167')}>
      {demoLabel('Four ways to frame the same problem — tap to evaluate.', 'var(--teal)')}
      <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginBottom: '16px', lineHeight: 1.6 }}>Same research data. Four different framings. Only one is a real problem statement that gets the team building the right thing.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {FRAME_OPTIONS.map((item, i) => {
          const isRevealed = revealed[i];
          return (
            <motion.button key={i} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
              style={{ padding: '15px 18px', borderRadius: '12px', border: `2px solid ${isRevealed ? item.color : 'rgba(0,151,167,0.18)'}`, background: 'var(--ed-card)', cursor: 'pointer', textAlign: 'left' as const, transition: 'all 0.2s' }}>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.6, marginBottom: isRevealed ? '10px' : 0, fontStyle: 'italic' }}>&ldquo;{item.frame}&rdquo;</div>
              <AnimatePresence>
                {isRevealed && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 800, color: item.color, letterSpacing: '0.14em', marginBottom: '8px' }}>{item.type.toUpperCase()}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>{item.consequence}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// QUIZZES
// ─────────────────────────────────────────
const MODULE_CONTEXT = `Module 02 of Airtribe PM Fundamentals — Track: Experienced APM.
Priya is a 2-year PM at EdSpark, leading a team doing a discovery sprint. Covers: challenging stakeholder-defined briefs, research ops and insight repositories, research bias (survivorship, confirmation, framing), strategic problem framing, and running discovery at the organisational level with Notion, Dovetail, and Kraftful.`;

const QUIZZES = [
  {
    conceptId: 'user-research',
    conceptName: 'User Research',
    question: "Your CEO says 'the onboarding is broken.' Kraftful data shows onboarding tickets declining while 'value visibility' tickets tripled. What's your move?",
    options: [
      'A. The CEO is closest to revenue — run with the onboarding brief',
      'B. Show the trend data and propose reframing the research question before committing',
      'C. Run both onboarding and value research in parallel to avoid conflict',
      'D. Do onboarding research first, then value visibility if time allows',
    ],
    correctIndex: 1,
    explanation: "The data suggests the problem has shifted. A senior PM\'s job isn\'t to execute briefs — it\'s to make sure the team is solving the right problem. You bring the evidence, frame it respectfully ('I want to validate this before we commit'), and let the data drive the conversation. Option C is hedging that delivers two shallow studies instead of one definitive answer.",
    keyInsight: "Challenging a brief isn't insubordination — it's exactly what APMs are paid for. Bring data, not opinions.",
  },
  {
    conceptId: 'customer-segments',
    conceptName: 'Customer Segments',
    question: "You need to understand why managers are churning. Your research repo has a 3-month-old study on manager churn. What do you do?",
    options: [
      'A. Ignore it — 3 months is too old in a fast-moving product',
      'B. Check the repo first, validate whether the core finding has changed, then decide if new research is needed',
      'C. Run new interviews — fresh data is always better',
      'D. Send a survey to confirm the old findings at scale',
    ],
    correctIndex: 1,
    explanation: "Research repos exist precisely for this. Before re-running expensive research, check what you already know. If the product shipped nothing in 3 months that would affect the root cause, the old insight probably still holds. 'Fresh data is always better' is a junior instinct — senior PMs compound knowledge rather than starting from zero.",
    keyInsight: "Good research ops means never starting from zero. The repo is your memory. Use it.",
  },
  {
    conceptId: 'research-methods',
    conceptName: 'Research Methods',
    question: "You interview 10 active managers. 8 say they're satisfied. You conclude 'most managers are happy.' What's wrong?",
    options: [
      'A. 10 is too small a sample — you need at least 50',
      'B. You only talked to active users. Churned users — the ones who represent the problem — are invisible.',
      'C. Satisfaction surveys are more reliable than interviews for this question',
      'D. Nothing — if 80% are satisfied, churn must be caused by something else',
    ],
    correctIndex: 1,
    explanation: "This is survivorship bias. Active users are the population that didn't fail. They can't tell you why others left. The most important signal — why managers churned — comes from churned managers who are no longer in your sample. 8/10 active users being happy is completely consistent with 40% of all managers churning.",
    keyInsight: "Your sample defines your findings. Always ask: who is excluded from my research that matters most?",
  },
  {
    conceptId: 'jtbd',
    conceptName: 'Jobs to Be Done',
    question: "Across 14 manager interviews, 11 mention needing to 'show their director that coaching is working.' What's the job?",
    options: [
      'A. Better reporting features — they want data visibility',
      'B. Build credibility with leadership using evidence of impact',
      'C. A Slack integration so managers can share updates easily',
      'D. Weekly automated summaries sent to the manager\'s inbox',
    ],
    correctIndex: 1,
    explanation: "11 of 14 managers describing the same underlying need is a clear job signal. The job isn't 'reporting' — it's political: these managers need to look competent to their own managers. That's about credibility and career safety. Any solution must make it effortless to demonstrate impact. A Slack integration or summary email is a possible feature — but feature decisions come after you've named the job correctly.",
    keyInsight: "Jobs are functional, social, and emotional. 'Prove ROI to my boss' is a social/political job — the product must serve that, not just the functional use case.",
  },
  {
    conceptId: 'insight-synthesis',
    conceptName: 'Insight Synthesis',
    question: "Your Dovetail repo shows two findings: 'ROI visibility' (11/14) and 'no feedback loop post-upload' (9/14). How do you frame the discovery brief?",
    options: [
      'A. Write two separate briefs — don\'t combine findings',
      'B. They\'re the same underlying job: managers need evidence that EdSpark is working. Frame as one root cause.',
      'C. Pick the higher-frequency finding (ROI visibility) and ignore the other',
      'D. Run more interviews to decide which finding is more important',
    ],
    correctIndex: 1,
    explanation: "'No feedback loop post-upload' and 'can't show ROI to leadership' are two expressions of the same root problem: the product never shows managers that it's working. Separating them creates two workstreams when one well-framed problem statement covers both. Synthesis is about finding the single frame that explains multiple signals — not just listing them.",
    keyInsight: "Great synthesis collapses multiple findings into one coherent problem statement. If you have 6 findings, you have a list. If you have one insight, you have a brief.",
  },
  {
    conceptId: 'problem-framing',
    conceptName: 'Problem Framing',
    question: "Which is the strongest problem statement to bring to a cross-functional team meeting?",
    options: [
      'A. "Week-2 retention is 60% — we need to fix it."',
      'B. "Onboarding needs a redesign based on user feedback."',
      'C. "Sales managers join EdSpark to prove their coaching works, but the product never gives them evidence that it does."',
      'D. "We need a manager dashboard with coaching impact scores."',
    ],
    correctIndex: 2,
    explanation: "Option A is a metric — it states the symptom in numbers. Option B is a conclusion that jumps to solution. Option D is a solution, not a problem. Option C names the user, their job, and the gap — without prescribing a solution. That's what a problem statement does: it gives the team a shared target and leaves solution space open.",
    keyInsight: "The best problem statement names who, what they're trying to do, and where the product fails them. No solution in the statement. Ever.",
  },
];

// ─────────────────────────────────────────
// INTRO HERO
// ─────────────────────────────────────────
const IntroHero = () => (
  <section style={{ background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', padding: '48px 0 40px' }}>
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 28px' }}>
      {/* Full-width text content */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--teal)', marginBottom: '12px', textTransform: 'uppercase' as const }}>
          MODULE 02 · APM TRACK
        </div>
        <h1 style={{ fontFamily: "'Lora', serif", fontSize: '32px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.2, marginBottom: '16px' }}>
          Discovery at the<br />Organisational Level
        </h1>
        <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.8, marginBottom: '24px', maxWidth: '640px' }}>
          As a senior PM, your job isn&apos;t just to do discovery. It&apos;s to build a culture where the team can&apos;t ship without it — and to challenge the briefs that point everyone at the wrong problem.
        </div>
        <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'rgba(0,151,167,0.06)', border: '1px solid rgba(0,151,167,0.18)', marginBottom: '24px', maxWidth: '580px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.14em', marginBottom: '10px' }}>APM TRACK OBJECTIVES</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '7px' }}>
            {[
              'Challenge stakeholder-defined briefs with data, not just instinct',
              'Run research that avoids survivorship, confirmation, and framing bias',
              'Build and use a team insight repository via Notion',
              'Move from a list of findings to a single, precise problem statement',
            ].map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.55 }}>{obj}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
          {[
            { name: 'Notion', desc: 'Research Repo', accent: '#0097A7' },
            { name: 'Dovetail', desc: 'Insight Clusters', accent: '#7C3AED' },
            { name: 'Kraftful', desc: 'Trend Analysis', accent: '#00BCD4' },
          ].map(t => (
            <div key={t.name} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '7px 13px', borderRadius: '7px', background: 'var(--ed-card)', border: `1px solid var(--ed-rule)`, borderLeft: `3px solid ${t.accent}` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: t.accent, letterSpacing: '0.06em' }}>{t.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Character row — all key stakeholders */}
      <div style={{ borderTop: '1px solid var(--ed-rule)', paddingTop: '20px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--ed-ink3)', marginBottom: '12px' }}>CHARACTERS IN THIS MODULE</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const }}>
          {[
            { emoji: '🧑‍💼', name: 'Priya Sharma', role: 'APM · 2 yrs · EdSpark', desc: 'Leading discovery. Her challenge: the team keeps solving yesterday\'s problem.', accent: 'var(--teal)' },
            { emoji: '👔', name: 'Rohan', role: 'CEO · EdSpark', desc: 'Sets the strategic brief. Brings strong opinions, sometimes based on stale data.', accent: '#E67E22' },
            { emoji: '🔬', name: 'Maya', role: 'User Researcher · EdSpark', desc: 'Runs the interview studies. Learns to catch survivorship bias before it corrupts the data.', accent: 'var(--purple)' },
            { emoji: '🧑‍🏫', name: 'Asha', role: 'AI Mentor', desc: 'Challenges your assumptions. Appears throughout the module to sharpen your thinking.', accent: '#4F46E5' },
          ].map(c => (
            <div key={c.name} style={{ flex: '1', minWidth: '180px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderLeft: `3px solid ${c.accent}`, padding: '12px 14px' }}>
              <div style={{ display: 'flex', gap: '9px', alignItems: 'center', marginBottom: '7px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${c.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{c.emoji}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--ed-ink)', lineHeight: 1.2 }}>{c.name}</div>
                  <div style={{ fontSize: '9px', color: c.accent, fontFamily: 'monospace', marginTop: '1px', fontWeight: 600 }}>{c.role}</div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────
export default function Track2ProblemDiscovery() {
  return (
    <article>
      <IntroHero />

      {/* PART 1 — THE BRIEF THAT'S WRONG */}
      <ChapterSection id="m2-discovery-mindset" num="01" accentRgb="0,151,167">
        <div style={{ ...h2, color: 'var(--teal)' }}>Part I · When the Brief Is Wrong</div>
        <SituationCard>
          Monday 9:30am. Priya walks into the weekly product sync. Rohan, the CEO, opens his laptop and points at a dashboard. <strong>&ldquo;Retention is still stuck at 60%. We shipped three onboarding improvements. Nothing moved. I think onboarding still isn&apos;t clear enough — let&apos;s do another round.&rdquo;</strong>
        </SituationCard>
        <p style={{ fontSize: "15px", color: "var(--ed-ink2)", lineHeight: 1.8, marginBottom: "20px" }}>
          Priya had been expecting this. She had also been running her own analysis for the past two weeks. The previous night she had pulled Kraftful and looked at support ticket trends over four months. What she found contradicted Rohan&apos;s theory.
        </p>
        <p style={{ fontSize: "15px", color: "var(--ed-ink2)", lineHeight: 1.8, marginBottom: "20px" }}>
          Onboarding-related tickets were <em>down</em> 26%. But a different cluster — tickets about not being able to show that EdSpark was working — had almost tripled.
        </p>

        <KraftfulTrendMockup />

        <p style={{ fontSize: "15px", color: "var(--ed-ink2)", lineHeight: 1.8, marginBottom: "20px" }}>
          She had two options. Nod along and run another onboarding study. Or bring the data and risk the conversation. She chose the data.
        </p>
        <p style={{ fontSize: "15px", color: "var(--ed-ink2)", lineHeight: 1.8, marginBottom: "20px" }}>
          <strong>&ldquo;Rohan, before we commit to onboarding again — I want to show you something I found in Kraftful last night. The ticket trend has shifted. The problem might have moved.&rdquo;</strong>
        </p>
        {pullQuote("Challenging a brief isn't insubordination. It's the job. A PM who executes every brief unquestioned is an order-taker, not a strategist.")}

        <Avatar
          name="Asha"
          nameColor="var(--purple-light)"
          borderColor="var(--purple)"
          content={<>&ldquo;The data doesn&apos;t just contradict Rohan&apos;s brief — it tells you something more important: the problem has moved. Onboarding was the issue three months ago. Now it&apos;s something different. If you run with the old brief, you ship the right solution to yesterday&apos;s problem.&rdquo;</>}
          expandedContent={<>This happens more than you&apos;d think. A CEO spots a problem, commissions research, ships a fix. Six months later the same metric hasn&apos;t moved — because the problem evolved and no one updated the hypothesis. <strong>The Kraftful trend chart isn&apos;t just data. It&apos;s your mandate to pause.</strong></>}
          question="Your CEO defines the research question. Your Kraftful data suggests it's based on stale assumptions. What's the right move?"
          options={[
            { text: "Run the research the CEO asked for — they have more context than you", correct: false, feedback: "The CEO has authority, not omniscience. Their brief is based on information they had at the time. If you have newer data, your job is to surface it, not bury it." },
            { text: "Show the trend data and propose reframing before committing to the study", correct: true, feedback: "Exactly right. You're not rejecting the brief — you're making sure it's still based on current reality before you invest 2 weeks running it." },
            { text: "Do both — run the original research and the new angle in parallel", correct: false, feedback: "Hedging avoids the hard conversation and delivers two shallow studies. The right move is to resolve the framing conflict before you start." },
          ]}
          conceptId="user-research"
        />

        <Avatar
          name="Rohan"
          nameColor="var(--coral)"
          borderColor="#E67E22"
          content={<>&ldquo;I realised I&apos;d been treating the brief like a fact, not a hypothesis. The data Priya showed me was three months newer than what I was working from. When the evidence shifts, the question has to shift too.&rdquo; — Rohan, after the Monday sync</>}
          expandedContent={<>The moment Priya showed Rohan the Kraftful trend, she wasn&apos;t challenging him — she was updating the shared model. <strong>A brief is a hypothesis about where the problem is.</strong> When new data arrives, good leaders update. When they don&apos;t, it&apos;s usually not stubbornness — it&apos;s that no one showed them the data clearly enough.</>}
          question="Rohan's brief is based on data from Q3. You have Q4 data that contradicts it. What's your opening line in the Monday meeting?"
          options={[
            { text: '"I think we should look at onboarding again — maybe we missed something."', correct: false, feedback: "This reinforces the old brief without surfacing the new data. You've buried the insight before the conversation even starts." },
            { text: '"Before we commit to a direction — I found something in Kraftful last night I want to show the room."', correct: true, feedback: "You're not rejecting Rohan's view — you're creating space to introduce evidence. Leading with 'I found something' positions you as bringing value, not picking a fight." },
            { text: '"The CEO brief is wrong and here\'s why."', correct: false, feedback: "Even if true, this framing makes Rohan defensive before you've shown him anything. Evidence should do the work, not your framing of it." },
          ]}
          conceptId="user-research"
        />

        <InfoBox title="The APM's research contract" accent="var(--teal)">
          {keyBox('Three questions before you run any study', [
            '1. Does existing research in the repo already answer this?',
            '2. Is the research question based on current data — or stale assumptions?',
            '3. Who defined the problem, and what might they be missing?',
          ])}
        </InfoBox>

        <ChallengeBrief />

        <QuizEngine
          conceptId={QUIZZES[0].conceptId}
          conceptName={QUIZZES[0].conceptName}
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{ conceptId: QUIZZES[0].conceptId, question: QUIZZES[0].question, options: QUIZZES[0].options, correctIndex: QUIZZES[0].correctIndex, explanation: QUIZZES[0].explanation, keyInsight: QUIZZES[0].keyInsight }}
        />
      </ChapterSection>

      {/* PART 2 — RESEARCH OPS */}
      <ChapterSection id="m2-customer-segments" num="02" accentRgb="0,151,167">
        <div style={{ ...h2, color: 'var(--teal)' }}>Part II · Research Ops: Building Team Memory</div>
        <SituationCard>
          After the Monday meeting, Rohan agreed to pause and re-scope. &ldquo;Okay, Priya — what do we actually know about why managers leave? And please don&apos;t tell me we need to start from scratch.&rdquo;
        </SituationCard>
        <p style={{ fontSize: "15px", color: "var(--ed-ink2)", lineHeight: 1.8, marginBottom: "20px" }}>
          This was a test Priya was ready for. Three months ago, when she first joined as APM, she had set up a research repository in Notion. Every study, every insight, every tagged interview quote — all in one place. She opened it now.
        </p>

        <NotionResearchRepoMockup />

        <p style={{ fontSize: "15px", color: "var(--ed-ink2)", lineHeight: 1.8, marginBottom: "20px" }}>
          The repo showed 16 studies, 89 tagged insights, and — relevant right now — a 3-month-old manager churn study with 12 interviews. The top finding: <strong>managers churn when they can&apos;t demonstrate EdSpark&apos;s ROI to their own leadership.</strong>
        </p>
        <p style={{ fontSize: "15px", color: "var(--ed-ink2)", lineHeight: 1.8, marginBottom: "20px" }}>
          &ldquo;We have this already,&rdquo; Priya said. &ldquo;The question is: has anything shipped in the last 3 months that would change this? If not, the insight still holds. We don&apos;t need to re-run the whole study. We need to validate the finding and scope the new one.&rdquo;
        </p>

        <InfoBox title="The compounding value of a research repo" accent="var(--teal)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Without a repo', text: 'Every quarter starts fresh. Same users re-interviewed. Same insights re-discovered. Knowledge lives in Slack threads and forgotten decks.' },
              { label: 'With a repo', text: 'New studies build on existing ones. You start each sprint with what you already know, not from zero. Stakeholders can\'t claim "we don\'t know" when the answer is documented.' },
            ].map(row => (
              <div key={row.label} style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.1em', marginBottom: '5px' }}>{row.label.toUpperCase()}</div>
                <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.65 }}>{row.text}</div>
              </div>
            ))}
          </div>
        </InfoBox>

        <InfoBox title="Build your research repo this week">
          <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>
            Create a Notion page with three sections: <strong>Studies</strong> (date, scope, methodology, participants), <strong>Insights</strong> (finding, strength, source studies), <strong>Open Questions</strong> (what we still don&apos;t know). Every study you run gets logged here before you present it anywhere else.
          </div>
        </InfoBox>

        <QuizEngine
          conceptId={QUIZZES[1].conceptId}
          conceptName={QUIZZES[1].conceptName}
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{ conceptId: QUIZZES[1].conceptId, question: QUIZZES[1].question, options: QUIZZES[1].options, correctIndex: QUIZZES[1].correctIndex, explanation: QUIZZES[1].explanation, keyInsight: QUIZZES[1].keyInsight }}
        />

      </ChapterSection>

      {/* PART 3 — RESEARCH BIASES */}
      <ChapterSection id="m2-research-methods" num="03" accentRgb="0,151,167">
        <div style={{ ...h2, color: 'var(--teal)' }}>Part III · The Biases That Corrupt Discovery</div>
        <SituationCard>
          Priya told her researcher, Maya, to prep a new study. Maya drafted a plan: 10 interviews with active managers who were still using the platform. &ldquo;These are our best users — they&apos;ll know the product well.&rdquo; Priya read it and called Maya immediately.
        </SituationCard>
        <p style={{ fontSize: "15px", color: "var(--ed-ink2)", lineHeight: 1.8, marginBottom: "20px" }}>
          &ldquo;Maya — the users you want to talk to are the ones who <em>didn&apos;t</em> churn. We&apos;re asking why people leave. We need to talk to people who left.&rdquo;
        </p>
        <p style={{ fontSize: "15px", color: "var(--ed-ink2)", lineHeight: 1.8, marginBottom: "20px" }}>
          This is survivorship bias — one of the most common research mistakes experienced PMs still make. But it&apos;s just one of three biases Priya had learned to spot the hard way.
        </p>

        <BiasSpotter />

        <Avatar
          name="Maya"
          nameColor="var(--coral)"
          borderColor="var(--purple)"
          content={<>&ldquo;I recruited active users because they were easier to reach. I didn&apos;t realise I&apos;d designed out the people who could actually answer the question. The fix was simple — go to the CRM, filter for accounts that went inactive in the last 3 weeks, reach out directly. The answer was always in the data I wasn&apos;t looking at.&rdquo; — Maya</>}
          expandedContent={<>Survivorship bias in research recruitment is a process failure, not a judgement failure. Maya didn&apos;t ask the wrong question — she built a sample that made the right answer impossible to find. <strong>Fix: before you recruit, write down exactly who needs to be in your sample for your research question to be answerable.</strong> Then build your recruitment list from that, not from who&apos;s easy to reach.</>}
          question="You need to understand why managers churn. Which recruitment approach gives you the most useful signal?"
          options={[
            { text: "Email your 20 most engaged active managers — they know the product deeply", correct: false, feedback: "Engaged users can tell you why they stayed. They cannot tell you why others left. You're optimising for accessibility, not relevance." },
            { text: "Pull churned managers from the CRM (inactive 10–30 days) and reach out directly", correct: true, feedback: "Correct. The signal lives with people who just made the decision you're trying to understand. Recency matters — churn reasons fade fast." },
            { text: "Post a survey to all users and segment by churn status in analysis", correct: false, feedback: "Churned users have low survey response rates by definition — they've disengaged. You'll get a biased response set and the same survivorship problem." },
          ]}
          conceptId="research-methods"
        />

        {pullQuote("The users who matter most for a churn study are the ones who can no longer reply to your emails.")}

        <Avatar
          name="Asha"
          nameColor="var(--purple-light)"
          borderColor="var(--purple)"
          content={<>&ldquo;Maya&apos;s study design has survivorship bias baked in from the first line. She didn&apos;t do it on purpose — it&apos;s an easy mistake. But notice what it reveals: she framed the research question around active users, which made churned users invisible by default. That&apos;s design bias, not data bias.&rdquo;</>}
          expandedContent={<>The fix is structural. Before you recruit participants, ask: <strong>who has to be in my sample for this question to be answerable?</strong> If your question is &ldquo;why do managers churn?&rdquo; and your sample contains zero churned managers, the study is broken before it starts. No analysis will fix a broken sample.</>}
          question="Maya wants to study 'why managers leave EdSpark.' She recruits 10 active users. What's the core flaw?"
          options={[
            { text: "Too small a sample — she needs at least 30 to be statistically valid", correct: false, feedback: "Sample size is a secondary problem here. You could have 1,000 active users in your sample and still get the wrong answer because you excluded the people who could actually answer the question." },
            { text: "She excluded the only people who can answer the question — churned users", correct: true, feedback: "Exactly. Survivorship bias: the sample only includes users who didn't exhibit the behaviour you're trying to understand. The answer to 'why do managers leave' lives with managers who have already left." },
            { text: "She should use a survey instead of interviews for a question this broad", correct: false, feedback: "Method choice matters, but it's secondary to sample design. A survey of active users has the same survivorship bias problem as interviews of active users." },
          ]}
          conceptId="research-methods"
        />

        <InfoBox title="How Dovetail helps mitigate confirmation bias" accent="var(--purple)">
          <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>
            When Priya tags interview transcripts in Dovetail, she doesn&apos;t tag by theme — she tags by verbatim moment. &ldquo;User paused for 5 seconds after clicking Add Recording&rdquo; is a tag. &ldquo;User expressed confusion&rdquo; is not. The specificity forces her to separate what happened from what she thinks it means. Interpretation comes in synthesis — not during tagging.
          </div>
        </InfoBox>

        <QuizEngine
          conceptId={QUIZZES[2].conceptId}
          conceptName={QUIZZES[2].conceptName}
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{ conceptId: QUIZZES[2].conceptId, question: QUIZZES[2].question, options: QUIZZES[2].options, correctIndex: QUIZZES[2].correctIndex, explanation: QUIZZES[2].explanation, keyInsight: QUIZZES[2].keyInsight }}
        />
      </ChapterSection>

      {/* PART 4 — THE INTERVIEWS */}
      <ChapterSection id="m2-interview" num="04" accentRgb="0,151,167">
        <div style={{ ...h2, color: 'var(--teal)' }}>Part IV · Running 14 Interviews in 8 Days</div>
        <SituationCard>
          Priya and Maya split the interviews: Priya took the churned managers (recruited via email from the CRM), Maya took the active ones. They used the same Notion template — but Priya added one rule: <strong>don&apos;t mention onboarding until the participant does.</strong>
        </SituationCard>
        <p style={{ fontSize: "15px", color: "var(--ed-ink2)", lineHeight: 1.8, marginBottom: "20px" }}>
          The rule was deliberate. If Priya asked about onboarding in the first question, every answer would be about onboarding. She wanted to know what was actually bothering people — not what she primed them to say.
        </p>
        <p style={{ fontSize: "15px", color: "var(--ed-ink2)", lineHeight: 1.8, marginBottom: "20px" }}>
          The opening question for every interview: <em>&ldquo;Walk me through the last few weeks you were using EdSpark — what was happening?&rdquo;</em>
        </p>
        <p style={{ fontSize: "15px", color: "var(--ed-ink2)", lineHeight: 1.8, marginBottom: "20px" }}>
          In interview after interview, managers said a version of the same thing without being asked: <strong>&ldquo;I didn&apos;t know if it was working.&rdquo;</strong>
        </p>

        <InfoBox title="Priya's interview do/don't rule card" accent="var(--blue)">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--coral)', letterSpacing: '0.12em', marginBottom: '8px' }}>DON&apos;T</div>
              {[
                'Ask about features before asking about problems',
                'Suggest words (confusing, frustrating, unclear)',
                'Ask compound questions (2 questions in one)',
                'Jump in when they pause — silence is data',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '7px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--coral)', flexShrink: 0 }}>✗</span>
                  <span style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--green)', letterSpacing: '0.12em', marginBottom: '8px' }}>DO</div>
              {[
                'Open with "walk me through..."',
                'Follow unexpected threads, even off-script',
                'Ask "what did you do when that happened?"',
                'End with "is there anything I didn\'t ask?"',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '7px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--green)', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </InfoBox>

        <QuizEngine
          conceptId={QUIZZES[3].conceptId}
          conceptName={QUIZZES[3].conceptName}
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{ conceptId: QUIZZES[3].conceptId, question: QUIZZES[3].question, options: QUIZZES[3].options, correctIndex: QUIZZES[3].correctIndex, explanation: QUIZZES[3].explanation, keyInsight: QUIZZES[3].keyInsight }}
        />
      </ChapterSection>

      {/* PART 5 — SYNTHESIS */}
      <ChapterSection id="m2-synthesis" num="05" accentRgb="0,151,167">
        <div style={{ ...h2, color: 'var(--teal)' }}>Part V · Synthesising 14 Interviews into One Insight</div>
        <SituationCard>
          Friday afternoon. Priya and Maya had 14 interview transcripts tagged in Dovetail. 94 individual moments. They booked a 2-hour synthesis session and opened the clusters.
        </SituationCard>
        <p style={{ fontSize: "15px", color: "var(--ed-ink2)", lineHeight: 1.8, marginBottom: "20px" }}>
          The two dominant themes were obvious — but they weren&apos;t two separate problems. As Priya looked at the quotes side by side, she saw the pattern:
        </p>
        <p style={{ fontSize: "15px", color: "var(--ed-ink2)", lineHeight: 1.8, marginBottom: "20px" }}>
          &ldquo;I didn&apos;t know if EdSpark was working&rdquo; (no feedback loop) and &ldquo;I couldn&apos;t show my director the results&rdquo; (ROI visibility) — these were two surface expressions of the <strong>same underlying job</strong>: managers needed evidence that their investment in EdSpark was producing results.
        </p>

        <DovetailClustersMockup />

        {pullQuote("Synthesis is about reducing. You start with 94 tagged moments and end with one sentence that explains all of them.")}

        <Avatar
          name="Asha"
          nameColor="var(--purple-light)"
          borderColor="var(--purple)"
          content={<>&ldquo;Priya has two findings: &apos;no feedback loop&apos; and &apos;can&apos;t show ROI.&apos; Most PMs would write two problem statements and run two separate workstreams. But they&apos;re the same root. Once you see that, everything simplifies — one brief, one team direction, one sharp question for Rohan.&rdquo;</>}
          expandedContent={<>This is what separates synthesis from summarising. <strong>Summarising</strong> is listing what you heard. <strong>Synthesising</strong> is finding the single frame that explains why you heard all of it. The Dovetail clusters give you the what. The &lsquo;why&rsquo; is the insight only a human can provide.</>}
          question="You have two Dovetail clusters: 'no feedback loop post-upload' (9/14) and 'can't show ROI to leadership' (11/14). How do you write the brief?"
          options={[
            { text: "Two separate briefs — don't collapse findings", correct: false, feedback: "They look separate but they share a root cause: the product never shows managers that it's working. Writing two briefs doubles the workstream and splits team focus unnecessarily." },
            { text: "One brief: managers can't see evidence EdSpark is working — for themselves or their leadership", correct: true, feedback: "This is the synthesis move. Both clusters are expressions of the same underlying job. One sentence covers both — and gives the team a single target to design against." },
            { text: "Pick the higher-frequency cluster (ROI, 11/14) and lead with that", correct: false, feedback: "Frequency is a signal, not a decision rule. The 9/14 cluster might be the same root cause at a different level of abstraction. Always ask what they have in common before you pick one." },
          ]}
          conceptId="insight-synthesis"
        />

        <InfoBox title="The synthesis test" accent="var(--teal)">
          <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>
            If your findings can&apos;t be summarised in one sentence that explains <em>why</em> — not just <em>what</em> — you haven&apos;t synthesised. You&apos;ve listed. The sentence Priya landed on: <strong>&ldquo;Managers hire EdSpark to prove their coaching works — but the product never shows them that it does.&rdquo;</strong>
          </div>
        </InfoBox>

        <QuizEngine
          conceptId={QUIZZES[4].conceptId}
          conceptName={QUIZZES[4].conceptName}
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{ conceptId: QUIZZES[4].conceptId, question: QUIZZES[4].question, options: QUIZZES[4].options, correctIndex: QUIZZES[4].correctIndex, explanation: QUIZZES[4].explanation, keyInsight: QUIZZES[4].keyInsight }}
        />
      </ChapterSection>

      {/* PART 6 — PROBLEM FRAMING */}
      <ChapterSection id="m2-problem-statement" num="06" accentRgb="0,151,167">
        <div style={{ ...h2, color: 'var(--teal)' }}>Part VI · Framing the Problem That Gets Teams Aligned</div>
        <SituationCard>
          Monday morning again. Priya had one slide and one sentence. She opened the meeting. &ldquo;I said we&apos;d come back with a validated research question. Here&apos;s what we found.&rdquo;
        </SituationCard>
        <p style={{ fontSize: "15px", color: "var(--ed-ink2)", lineHeight: 1.8, marginBottom: "20px" }}>
          She put the sentence on screen: <strong>&ldquo;Sales managers join EdSpark to prove their coaching is improving their team — but the product never gives them evidence that it does.&rdquo;</strong>
        </p>
        <p style={{ fontSize: "15px", color: "var(--ed-ink2)", lineHeight: 1.8, marginBottom: "20px" }}>
          Rohan leaned forward. &ldquo;That&apos;s... not what I expected.&rdquo; Then: &ldquo;But it makes total sense.&rdquo;
        </p>
        <p style={{ fontSize: "15px", color: "var(--ed-ink2)", lineHeight: 1.8, marginBottom: "20px" }}>
          In ten minutes, the team had generated five potential solutions — a coaching impact score, an automated weekly report to the manager&apos;s director, a &ldquo;proof of ROI&rdquo; one-pager template, a progress timeline view, and a Slack integration. None of them were &ldquo;fix onboarding.&rdquo;
        </p>

        <ProblemFramingShowdown />

        {pullQuote("A precise problem statement doesn't constrain solutions — it unlocks them. The team generated five ideas in ten minutes that three onboarding redesigns never would have.")}

        <InfoBox title="Write your discovery brief">
          <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>
            One sentence: <strong>[segment] are trying to [job to be done], but [the gap the product creates].</strong> No solution in the statement. If you catch yourself writing &ldquo;we should&rdquo; or &ldquo;we need to,&rdquo; you&apos;ve crossed into solution space. Back up.
          </div>
        </InfoBox>

        <QuizEngine
          conceptId={QUIZZES[5].conceptId}
          conceptName={QUIZZES[5].conceptName}
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{ conceptId: QUIZZES[5].conceptId, question: QUIZZES[5].question, options: QUIZZES[5].options, correctIndex: QUIZZES[5].correctIndex, explanation: QUIZZES[5].explanation, keyInsight: QUIZZES[5].keyInsight }}
        />
      </ChapterSection>

      {/* FINAL REFLECTION */}
      <ChapterSection id="m2-reflection" num="07" accentRgb="0,151,167">
        <div style={{ ...h2, color: 'var(--teal)' }}>Final Reflection · The Discovery Playbook for APMs</div>
        <p style={{ fontSize: "15px", color: "var(--ed-ink2)", lineHeight: 1.8, marginBottom: "20px" }}>
          Priya had done discovery before. But this sprint was different — she had run it as an APM, not as an individual contributor. She&apos;d challenged a CEO brief, used a shared repo to avoid redundant research, caught a bias in her team&apos;s study design, and compressed 14 interviews into one sentence that changed the product direction.
        </p>

        {keyBox('The APM discovery loop', [
          '1. Challenge the brief — bring data before committing to a research question',
          '2. Check the repo — don\'t start research your team has already done',
          '3. Design for bias — survivorship, confirmation, framing',
          '4. Recruit for the question — churned users for churn, active for engagement',
          '5. Synthesise to one sentence — if it takes a paragraph, you\'re still listing',
          '6. Present the problem, not the solution — let the team generate solutions from a clear brief',
        ])}

        <NextChapterTeaser text="Next module: Priya has 5 strong ideas and must decide which to build. The CEO wants the fastest win. Engineering wants to clear debt. Design wants a different fix entirely. Module 03 covers prioritisation in a room full of competing priorities." />
      </ChapterSection>
    </article>
  );
}

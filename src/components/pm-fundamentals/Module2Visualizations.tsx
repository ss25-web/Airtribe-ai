'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// ─── Shared ────────────────────────────────────────────────────────────────────
function ReplayBtn({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.button onClick={onReplay} whileHover={{ opacity: 0.75, scale: 1.03 }} whileTap={{ scale: 0.96 }}
      style={{ marginTop: '14px', padding: '6px 20px', borderRadius: '8px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--ed-rule)', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.08em' }}>
      ↺ replay
    </motion.button>
  );
}
function VizLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '18px', textTransform: 'uppercase' as const }}>
      {children}
    </div>
  );
}

// ─── 1. RESEARCH SIGNAL QUALITY BARS ──────────────────────────────────────────
// Sequential horizontal bars showing evidence strength for each research method.
// Teaches: not all research signals carry equal weight.

const SIGNALS = [
  { method: 'Direct observation', pct: 94, color: '#059669', dark: '#047857', label: 'Reveals what users actually do — not what they say they do.', miss: 'Time-intensive, small sample size.' },
  { method: 'User interviews',    pct: 78, color: '#0EA5E9', dark: '#0369A1', label: 'Surfaces motivations, context, and unmet needs.',            miss: 'Subject to recall bias and social desirability.' },
  { method: 'Usability testing',  pct: 71, color: '#6366F1', dark: '#4338CA', label: 'Shows exactly where users get stuck in a specific flow.',    miss: 'Narrow scope — doesn\'t capture strategic needs.' },
  { method: 'Analytics / data',   pct: 62, color: '#8B5CF6', dark: '#6D28D9', label: 'Tells you what happened at scale. Hard to fake.',            miss: 'Cannot explain why it happened.' },
  { method: 'User surveys',       pct: 44, color: '#F59E0B', dark: '#D97706', label: 'Good for quantifying a known hypothesis across many users.',  miss: 'Measures attitudes, not behaviour. Easy to bias.' },
  { method: 'Stakeholder input',  pct: 24, color: '#EF4444', dark: '#B91C1C', label: 'Useful for business constraints and strategic context.',      miss: 'Rarely represents what users actually experience.' },
];

export function ResearchSignalBars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0);
    SIGNALS.forEach((_, i) => {
      setTimeout(() => setVisible(i + 1), 400 + i * 480);
    });
  }, [inView, tick]);

  const replay = () => { setVisible(0); setTick(t => t + 1); };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Research Signal Quality — not all evidence carries equal weight</VizLabel>
      <div style={{ borderRadius: '20px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '28px 26px', boxShadow: '0 12px 32px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
          {SIGNALS.map((s, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: i < visible ? s.color : 'var(--ed-ink3)', transition: 'color 0.4s' }}>{s.method}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 900, color: i < visible ? s.color : 'var(--ed-rule)', transition: 'color 0.4s' }}>{i < visible ? `${s.pct}%` : '---'}</span>
              </div>
              {/* Bar track */}
              <div style={{ height: '14px', background: 'var(--ed-cream, #F5F0E8)', borderRadius: '7px', overflow: 'hidden', marginBottom: '7px' }}>
                <motion.div
                  animate={{ width: i < visible ? `${s.pct}%` : '0%' }}
                  transition={{ duration: 0.75, ease: 'easeOut', delay: 0.05 }}
                  style={{
                    height: '100%', borderRadius: '7px',
                    background: `linear-gradient(90deg, ${s.color} 0%, ${s.dark} 100%)`,
                    boxShadow: i < visible ? `0 2px 8px ${s.color}55` : 'none',
                  }}
                />
              </div>
              {/* Detail labels */}
              <AnimatePresence>
                {i < visible && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.6 }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.55 }}>
                      <span style={{ color: s.color, fontWeight: 700 }}>✓ </span>{s.label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.55 }}>
                      <span style={{ color: '#EF4444', fontWeight: 700 }}>✕ </span>{s.miss}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#059669' }}>Key insight:</strong> Use multiple methods to triangulate. No single method gives you the full picture. The goal is to reduce uncertainty — not eliminate it.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 2. RESEARCH METHODS QUADRANT MAP ─────────────────────────────────────────
// 2×2 matrix: Behavioural ↔ Attitudinal, Qualitative ↔ Quantitative.
// Each method appears in its correct quadrant sequentially.
// Teaches: pick the method that answers YOUR question type.

const METHODS = [
  { name: 'Usability\nTesting',     sub: 'Observe users doing tasks',       x: 25, y: 25, color: '#6366F1', dark: '#4338CA', glow: 'rgba(99,102,241,0.5)' },
  { name: 'In-depth\nInterviews',   sub: 'Explore motivations & context',   x: 75, y: 25, color: '#0EA5E9', dark: '#0369A1', glow: 'rgba(14,165,233,0.5)' },
  { name: 'Analytics &\nA/B Tests', sub: 'Measure what users actually do',  x: 25, y: 75, color: '#F97316', dark: '#C2410C', glow: 'rgba(249,115,22,0.5)' },
  { name: 'Surveys &\nPolls',       sub: 'Quantify opinions at scale',      x: 75, y: 75, color: '#22C55E', dark: '#15803D', glow: 'rgba(34,197,94,0.5)' },
];

export function ResearchQuadrantMap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0);
    METHODS.forEach((_, i) => setTimeout(() => setVisible(i + 1), 600 + i * 700));
  }, [inView, tick]);

  const replay = () => { setVisible(0); setTick(t => t + 1); };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Research Methods Map — pick the method that answers your question type</VizLabel>

      <div style={{ borderRadius: '20px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '24px', boxShadow: '0 12px 32px rgba(0,0,0,0.06)' }}>
        {/* Axis labels */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, color: '#6366F1', letterSpacing: '0.12em' }}>QUALITATIVE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Left axis label */}
          <div style={{ writingMode: 'vertical-lr' as const, transform: 'rotate(180deg)', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, color: '#F97316', letterSpacing: '0.12em', textAlign: 'center', flexShrink: 0 }}>BEHAVIOURAL</div>

          {/* Grid */}
          <div style={{ flex: 1, position: 'relative', aspectRatio: '1.6' }}>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="50" y1="0" x2="50" y2="100" stroke="#CBD5E1" strokeWidth="0.4" strokeDasharray="2 1.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#CBD5E1" strokeWidth="0.4" strokeDasharray="2 1.5" />
              {/* Border */}
              <rect x="0" y="0" width="100" height="100" fill="none" stroke="#CBD5E1" strokeWidth="0.6" />
            </svg>

            {/* Method cards */}
            {METHODS.map((m, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: i < visible ? 1 : 0, scale: i < visible ? 1 : 0.5 }}
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                style={{
                  position: 'absolute',
                  left: `${m.x}%`, top: `${m.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '140px', padding: '14px 14px 16px',
                  borderRadius: '14px',
                  background: `linear-gradient(145deg, ${m.color}F0 0%, ${m.dark} 100%)`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), 0 5px 0 ${m.dark}, 0 8px 0 rgba(0,0,0,0.1), 0 16px 36px ${m.glow}`,
                  textAlign: 'center' as const,
                  zIndex: 2,
                }}>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.2, marginBottom: '6px', whiteSpace: 'pre-line' }}>{m.name}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{m.sub}</div>
              </motion.div>
            ))}
          </div>

          {/* Right axis label */}
          <div style={{ writingMode: 'vertical-lr' as const, fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, color: '#0EA5E9', letterSpacing: '0.12em', textAlign: 'center', flexShrink: 0 }}>ATTITUDINAL</div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, color: '#F59E0B', letterSpacing: '0.12em' }}>QUANTITATIVE</span>
        </div>
      </div>

      <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>The wrong tool:</strong> Asking "did they like it?" (attitudinal) when you need to know "can they do it?" (behavioural). Interviews can&apos;t tell you what users actually do. Analytics can&apos;t tell you why.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 3. INTERVIEW DEPTH FUNNEL ────────────────────────────────────────────────
// A funnel narrowing from surface complaint to root cause.
// Each level is revealed sequentially. Teaches: ask "why" five times.

const FUNNEL_LEVELS = [
  { tag: 'SURFACE',       label: '"The app is confusing."',                    detail: 'What the user said — a feeling, not a fact.',          color: '#BFDBFE', text: '#1E40AF', border: '#93C5FD' },
  { tag: 'BEHAVIOUR',     label: 'They were trying to find a past call.',       detail: 'What were they actually doing? Ask: what were you doing when that happened?', color: '#A5F3FC', text: '#0E7490', border: '#67E8F9' },
  { tag: 'FRICTION',      label: 'Had to scroll through 40+ recordings.',       detail: 'Where exactly did it break? Ask: walk me through exactly what you did.', color: '#6EE7B7', text: '#065F46', border: '#34D399' },
  { tag: 'CAUSE',         label: 'No search, no date filter, no recents view.', detail: 'What is missing or broken? Ask: what would have made that easier?', color: '#FCD34D', text: '#92400E', border: '#FBBF24' },
  { tag: 'ROOT JOB',      label: 'Need to retrieve specific content on demand.',detail: 'The real job the product should do. This is your product requirement.', color: '#FCA5A5', text: '#7F1D1D', border: '#F87171' },
];

export function InterviewDepthFunnel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0);
    FUNNEL_LEVELS.forEach((_, i) => setTimeout(() => setVisible(i + 1), 500 + i * 900));
  }, [inView, tick]);

  const replay = () => { setVisible(0); setTick(t => t + 1); };

  const WIDTHS = ['100%', '84%', '68%', '52%', '38%'];

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>The Discovery Interview Funnel — every "why" goes deeper</VizLabel>

      <div style={{ borderRadius: '20px', background: 'linear-gradient(170deg, #EFF6FF 0%, #ECFDF5 50%, #FEF9C3 80%, #FEF2F2 100%)', border: '1px solid var(--ed-rule)', padding: '32px 28px', boxShadow: '0 12px 32px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0px', alignItems: 'center' }}>
          {FUNNEL_LEVELS.map((level, i) => (
            <div key={i} style={{ width: '100%', display: 'flex', flexDirection: 'column' as const, alignItems: 'center' }}>
              <AnimatePresence>
                {i < visible && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0, transformOrigin: 'top' }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{ width: WIDTHS[i], marginBottom: i < FUNNEL_LEVELS.length - 1 ? '0' : '0' }}
                  >
                    <div style={{
                      padding: '14px 18px',
                      background: level.color,
                      border: `2px solid ${level.border}`,
                      borderRadius: i === 0 ? '14px 14px 0 0' : i === FUNNEL_LEVELS.length - 1 ? '0 0 14px 14px' : '0',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ flexShrink: 0, marginTop: '2px' }}>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: level.text, letterSpacing: '0.14em', padding: '2px 7px', borderRadius: '4px', background: `${level.text}15`, border: `1px solid ${level.text}30` }}>
                            {level.tag}
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: level.text, marginBottom: '4px', lineHeight: 1.3 }}>{level.label}</div>
                          <div style={{ fontSize: '11px', color: level.text, opacity: 0.72, lineHeight: 1.55 }}>{level.detail}</div>
                        </div>
                        {i < FUNNEL_LEVELS.length - 1 && (
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: level.text, opacity: 0.5, flexShrink: 0, paddingTop: '2px' }}>WHY? →</div>
                        )}
                      </div>
                    </div>
                    {/* Funnel neck connector */}
                    {i < FUNNEL_LEVELS.length - 1 && (
                      <svg viewBox="0 0 100 12" preserveAspectRatio="none" style={{ width: '100%', height: '12px', display: 'block' }}>
                        <polygon points={`0,0 100,0 ${50 + (84 - 68) / 2 * 1.2},12 ${50 - (84 - 68) / 2 * 1.2},12`} fill={level.color} opacity="0.5" />
                      </svg>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {visible >= FUNNEL_LEVELS.length && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ marginTop: '20px', padding: '14px 18px', borderRadius: '12px', background: 'rgba(127,29,29,0.08)', border: '2px solid #F87171', textAlign: 'center' as const }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#7F1D1D', letterSpacing: '0.14em', marginBottom: '6px' }}>THIS IS YOUR REAL PRODUCT REQUIREMENT</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#7F1D1D', lineHeight: 1.5 }}>Search and retrieval for past coaching calls — not a navigation redesign.</div>
          </motion.div>
        )}
      </div>

      <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#0EA5E9' }}>The rule:</strong> Never act on the first thing a user says. Treat every complaint as a starting point for a question, not a specification. Ask &ldquo;why&rdquo; until you reach a job.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 4. AFFINITY CLUSTER ANIMATION ────────────────────────────────────────────
// Notes arrive one-by-one into their correct themed column.
// Column headers are visible from the start so learners see the pattern forming.
// Teaches: synthesis = recognising which theme each observation belongs to.

const AFFINITY_COLS = [
  {
    label: 'No clear next step',
    color: '#0F766E', bg: '#CCFBF1', border: '#5EEAD4', dark: '#0D5C55',
    notes: [
      "Finish watching — don't know what to do next",
      "What am I supposed to act on?",
      'No guidance after I get the score',
      'I feel lost after each session',
      "There's no workflow after the analysis",
    ],
  },
  {
    label: 'No benchmark for quality',
    color: '#92400E', bg: '#FEF3C7', border: '#FCD34D', dark: '#78350F',
    notes: [
      'Is 72 a good score or a bad one?',
      "My manager says 'improve' — improve what?",
      "I have no idea what 'good' looks like",
      'The data exists but I have no context',
      'What does great coaching even look like?',
    ],
  },
  {
    label: 'Need to prove coaching ROI',
    color: '#14532D', bg: '#DCFCE7', border: '#86EFAC', dark: '#0F3D21',
    notes: [
      'My VP wants to know if this is working',
      'I need proof the calls are getting better',
      'How do I show my team is improving?',
      "Can't justify the tool spend without data",
      'Budget review is next month',
    ],
  },
];

// Interleaved reveal order: 0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2
// So notes arrive alternating across columns — you see all 3 themes growing at once
const REVEAL_ORDER = [0,1,2, 0,1,2, 0,1,2, 0,1,2, 0,1,2];
const COL_NOTE_IDX = [0, 0, 0]; // tracks which note within each column to reveal next

export function AffinityClusterAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  // visibleCounts[col] = how many notes in that column are visible
  const [counts, setCounts] = useState([0, 0, 0]);
  const [done, setDone] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setCounts([0, 0, 0]);
    setDone(false);
    const colIdx = [0, 0, 0];
    const timers: ReturnType<typeof setTimeout>[] = [];

    REVEAL_ORDER.forEach((col, step) => {
      timers.push(setTimeout(() => {
        colIdx[col]++;
        setCounts([...colIdx]);
      }, 400 + step * 420));
    });
    timers.push(setTimeout(() => setDone(true), 400 + REVEAL_ORDER.length * 420 + 200));
    return () => timers.forEach(clearTimeout);
  }, [inView, tick]);

  const replay = () => { setCounts([0, 0, 0]); setDone(false); setTick(t => t + 1); };
  const total = counts.reduce((a, b) => a + b, 0);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Affinity Mapping — observations sorted into themes as you read them</VizLabel>

      <div style={{
        borderRadius: '20px',
        background: 'var(--ed-card)',
        border: '1px solid var(--ed-rule)',
        padding: '24px 20px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.07)',
      }}>
        {/* Status bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.14em' }}>
            {done ? '✓ THEMES IDENTIFIED' : total === 0 ? '● RAW OBSERVATIONS' : `◎ SORTING… ${total} / 15`}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: 15 }, (_, i) => (
              <div key={i} style={{ width: '16px', height: '4px', borderRadius: '2px', background: i < total ? AFFINITY_COLS[REVEAL_ORDER[i]].color : 'var(--ed-rule)', transition: 'background 0.3s' }} />
            ))}
          </div>
        </div>

        {/* 3 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          {AFFINITY_COLS.map((col, ci) => (
            <div key={ci}>
              {/* Column header */}
              <div style={{
                padding: '10px 14px', borderRadius: '10px',
                background: col.color,
                boxShadow: `0 4px 0 ${col.dark}, 0 6px 0 rgba(0,0,0,0.1), 0 10px 24px ${col.color}50`,
                marginBottom: '10px',
                textAlign: 'center' as const,
              }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.12em', marginBottom: '2px' }}>THEME {ci + 1}</div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.3 }}>{col.label}</div>
              </div>

              {/* Notes in this column */}
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', minHeight: '320px' }}>
                {col.notes.map((note, ni) => (
                  <AnimatePresence key={ni}>
                    {ni < counts[ci] && (
                      <motion.div
                        initial={{ opacity: 0, y: -18, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 340, damping: 26 }}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          background: col.bg,
                          border: `1.5px solid ${col.border}`,
                          boxShadow: `0 2px 8px rgba(0,0,0,0.07)`,
                          fontSize: '11px',
                          fontWeight: 600,
                          color: col.color,
                          lineHeight: 1.5,
                        }}
                      >
                        {note}
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </div>
          ))}
        </div>

        {done && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ marginTop: '18px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.25)', fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.7, textAlign: 'center' as const }}>
            <strong style={{ color: '#4F46E5' }}>3 themes emerged from 15 observations.</strong> Each theme appeared independently in at least 5 interviews — that&apos;s a pattern worth building on.
          </motion.div>
        )}
      </div>

      <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#0F766E' }}>Synthesis is not summarising.</strong> It&apos;s finding the pattern that explains multiple observations at once. A theme worth building on appears across at least 3 independent interviews.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 5. JTBD TRANSFORM ANIMATION ──────────────────────────────────────────────
// Feature requests on the left transform into Jobs-to-be-Done on the right.
// Teaches: reframe what users ask for into what job they're hiring the product for.

const JTBD_PAIRS = [
  { request: '"Give me dark mode"',      job: 'I need to use this tool comfortably at night without eye strain.', icon: '🌙' },
  { request: '"Make it load faster"',    job: 'I need to complete a task without being interrupted mid-flow.',     icon: '⚡' },
  { request: '"Add search"',             job: 'I need to retrieve a specific past call in under 30 seconds.',      icon: '🔍' },
  { request: '"Export to PDF"',          job: 'I need to share results with stakeholders who don\'t use the tool.', icon: '📤' },
];

export function JTBDTransformAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0);
    JTBD_PAIRS.forEach((_, i) => setTimeout(() => setVisible(i + 1), 600 + i * 1100));
  }, [inView, tick]);

  const replay = () => { setVisible(0); setTick(t => t + 1); };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Jobs to Be Done — reframe what users ask for into the job they need done</VizLabel>

      <div style={{ borderRadius: '20px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '28px 24px', boxShadow: '0 12px 32px rgba(0,0,0,0.06)' }}>
        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: '0', marginBottom: '20px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' as const, padding: '8px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#EF4444', letterSpacing: '0.14em' }}>USER ASKS FOR</div>
            <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', marginTop: '3px' }}>A feature request</div>
          </div>
          <div />
          <div style={{ textAlign: 'center' as const, padding: '8px 14px', borderRadius: '8px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#6366F1', letterSpacing: '0.14em' }}>REAL JOB</div>
            <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', marginTop: '3px' }}>What they&apos;re trying to accomplish</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          {JTBD_PAIRS.map((pair, i) => (
            <AnimatePresence key={i}>
              {i < visible && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: '0', alignItems: 'center' }}>
                  {/* Feature request */}
                  <div style={{
                    padding: '14px 16px', borderRadius: '12px',
                    background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.25)',
                    fontSize: '13px', fontWeight: 700, color: '#7F1D1D', fontStyle: 'italic',
                    minHeight: '54px', display: 'flex', alignItems: 'center',
                  }}>
                    {pair.request}
                  </div>
                  {/* Arrow */}
                  <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2, duration: 0.35 }}
                    style={{ textAlign: 'center' as const, fontSize: '18px', color: '#6366F1', transformOrigin: 'left' }}>
                    →
                  </motion.div>
                  {/* JTBD */}
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.4 }}
                    style={{
                      padding: '14px 16px', borderRadius: '12px',
                      background: 'rgba(99,102,241,0.07)', border: '1.5px solid rgba(99,102,241,0.28)',
                      borderLeft: '4px solid #6366F1',
                      fontSize: '12px', color: '#312E81', lineHeight: 1.6, fontWeight: 600,
                      minHeight: '54px', display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>{pair.icon}</span>
                    <span>{pair.job}</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>The JTBD reframe:</strong> Users request solutions. Your job is to find the underlying goal. The feature they ask for is one possible solution — often not the best one.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── STP FRAMEWORK ────────────────────────────────────────────────────────────
// Segmentation → Targeting → Positioning. Shown as a 3-stage journey through
// EdSpark's actual market. Teaches: without STP you try to serve everyone and
// end up being nothing to anyone.

const SEGMENTS = [
  { id: 'enterprise', label: 'Enterprise', desc: 'Fortune 500 · 500+ reps', size: 88, x: 72, y: 24, color: '#94A3B8', fit: 28,
    fitReasons: ['Too complex for current product', 'Requires procurement + legal', 'Gong already owns this market'] },
  { id: 'midmarket', label: 'Mid-Market', desc: '100–500 employees · 10–50 reps', size: 72, x: 42, y: 48, color: '#6366F1', fit: 91,
    fitReasons: ['Perfect product-market fit', 'VP can sign without procurement', 'Need to prove coaching ROI to board'] },
  { id: 'smb', label: 'SMB', desc: '10–100 employees · 2–10 reps', size: 56, x: 22, y: 30, color: '#94A3B8', fit: 44,
    fitReasons: ['Low willingness to pay', 'No dedicated coaching manager', 'High churn risk'] },
  { id: 'solo', label: 'Solo Coaches', desc: 'Independent coaches', size: 38, x: 14, y: 65, color: '#94A3B8', fit: 22,
    fitReasons: ['Tiny TAM', 'B2C unit economics', 'No team data to analyse'] },
  { id: 'training', label: 'Sales Training Cos', desc: 'L&D departments', size: 44, x: 70, y: 68, color: '#94A3B8', fit: 36,
    fitReasons: ['Different use case entirely', 'Curriculum-based, not CRM-based', 'Would require full rebuild'] },
];

const TARGETING_CRITERIA = [
  { label: 'Segment size', midmarket: '~12,000 companies in India', why: 'Large enough to build a repeatable motion' },
  { label: 'Product fit', midmarket: '91% fit score', why: 'VP can sign, needs ROI proof, coaching-mature' },
  { label: 'Reachability', midmarket: 'Reachable via LinkedIn + PLG', why: 'No 18-month enterprise sales cycle needed' },
];

export function STPFrameworkViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [stage, setStage] = useState<0|1|2|3>(0); // 0=intro, 1=segment, 2=target, 3=position
  const [hoveredSeg, setHoveredSeg] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setStage(0);
    const ts = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 2200),
      setTimeout(() => setStage(3), 4200),
    ];
    return () => ts.forEach(clearTimeout);
  }, [inView, tick]);

  const replay = () => { setStage(0); setTick(t => t + 1); };
  const hovered = SEGMENTS.find(s => s.id === hoveredSeg);
  const isTargeted = (id: string) => stage >= 2 && id === 'midmarket';
  const isFaded = (id: string) => stage >= 2 && id !== 'midmarket';

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        {['SEGMENT', 'TARGET', 'POSITION'].map((s, i) => (
          <React.Fragment key={s}>
            <motion.div
              animate={{ background: stage > i ? '#6366F1' : stage === i + 1 ? '#6366F1' : 'var(--ed-rule)', color: stage >= i + 1 ? '#fff' : 'var(--ed-ink3)' }}
              style={{ padding: '4px 12px', borderRadius: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 900, letterSpacing: '0.14em', transition: 'all 0.4s', boxShadow: stage >= i + 1 ? '0 3px 0 #3730A3' : 'none' }}>
              {s}
            </motion.div>
            {i < 2 && <div style={{ fontSize: '14px', color: 'var(--ed-ink3)' }}>→</div>}
          </React.Fragment>
        ))}
      </div>

      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}>

        {/* ── Stage header ── */}
        <AnimatePresence mode="wait">
          <motion.div key={stage} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.3 }}
            style={{ padding: '14px 20px', background: stage === 0 ? 'var(--ed-card)' : stage === 1 ? 'rgba(99,102,241,0.08)' : stage === 2 ? 'rgba(14,165,233,0.08)' : 'rgba(34,197,94,0.08)', borderBottom: '1px solid var(--ed-rule)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: stage === 0 ? 'var(--ed-ink3)' : stage === 1 ? '#6366F1' : stage === 2 ? '#0EA5E9' : '#22C55E', letterSpacing: '0.14em', marginBottom: '4px' }}>
              {stage === 0 ? 'PRIYA\'S SITUATION' : stage === 1 ? 'STEP 1 — SEGMENT THE MARKET' : stage === 2 ? 'STEP 2 — CHOOSE YOUR TARGET' : 'STEP 3 — DEFINE YOUR POSITION'}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.45 }}>
              {stage === 0 && 'Rohan says "grow the product." Without STP, Priya builds features for everyone — and nothing works well for anyone.'}
              {stage === 1 && 'EdSpark\'s total market has 5 distinct customer types. Each has different needs, budgets, and buying behaviour. Hover each bubble to see why they differ.'}
              {stage === 2 && 'Three targeting criteria narrow the choice. Mid-market clears all three. The others don\'t.'}
              {stage === 3 && 'Positioning is not a tagline — it\'s a claim about who you serve and why you\'re the right choice for them, not for everyone.'}
            </div>
          </motion.div>
        </AnimatePresence>

        <div style={{ display: 'grid', gridTemplateColumns: stage === 3 ? '1fr' : '1fr 1fr', background: 'var(--ed-card)' }}>

          {stage < 3 && (
            /* ── Bubble chart ── */
            <div style={{ position: 'relative', aspectRatio: '1.1', padding: '20px', borderRight: '1px solid var(--ed-rule)' }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                {SEGMENTS.map((seg, i) => {
                  const r = seg.size * 0.28;
                  const targeted = isTargeted(seg.id);
                  const faded = isFaded(seg.id);
                  return (
                    <motion.g key={seg.id}
                      animate={{ opacity: faded ? 0.25 : 1, scale: targeted ? 1.15 : 1 }}
                      transition={{ duration: 0.6, type: 'spring', stiffness: 180, damping: 20 }}
                      style={{ transformOrigin: `${seg.x}% ${seg.y}%`, cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredSeg(seg.id)}
                      onMouseLeave={() => setHoveredSeg(null)}>
                      <motion.circle cx={seg.x} cy={seg.y} r={r}
                        fill={targeted ? '#6366F1' : seg.color}
                        opacity={targeted ? 0.9 : 0.35}
                        animate={{ r: targeted ? r * 1.1 : r }}
                        transition={{ duration: 0.6 }}
                        style={{ filter: targeted ? 'drop-shadow(0 4px 12px rgba(99,102,241,0.6))' : 'none' }} />
                      {stage >= 1 && (
                        <text x={seg.x} y={seg.y} textAnchor="middle" dominantBaseline="middle"
                          style={{ fontSize: seg.id === 'midmarket' ? '5px' : '4.5px', fill: targeted ? '#fff' : '#374151', fontWeight: 800, fontFamily: 'system-ui', pointerEvents: 'none' }}>
                          {seg.label}
                        </text>
                      )}
                    </motion.g>
                  );
                })}
              </svg>
              {/* Hover tooltip */}
              {hoveredSeg && hovered && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', padding: '12px 14px', borderRadius: '12px', background: '#1F2937', border: `1.5px solid ${hovered.color}60`, zIndex: 10 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '10px', fontWeight: 800, color: hovered.id === 'midmarket' ? '#818CF8' : '#94A3B8', marginBottom: '6px' }}>
                    {hovered.label} — {hovered.desc}
                  </div>
                  {hovered.fitReasons.map((r, i) => (
                    <div key={i} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.55 }}>
                      {hovered.id === 'midmarket' ? '✓' : '✕'} {r}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          )}

          {/* ── Right panel content ── */}
          <div style={{ padding: '20px' }}>
            <AnimatePresence mode="wait">

              {/* Stage 1: segment list */}
              {stage === 1 && (
                <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.14em', marginBottom: '12px' }}>
                    5 SEGMENTS — ALL DIFFERENT
                  </div>
                  {SEGMENTS.map(seg => (
                    <div key={seg.id} style={{ padding: '10px 12px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}
                      onMouseEnter={() => setHoveredSeg(seg.id)} onMouseLeave={() => setHoveredSeg(null)}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ed-ink)' }}>{seg.label}</div>
                        <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{seg.desc}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Stage 2: targeting criteria */}
              {stage === 2 && (
                <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#0EA5E9', letterSpacing: '0.14em', marginBottom: '12px' }}>
                    TARGETING CRITERIA — MID-MARKET WINS
                  </div>
                  {TARGETING_CRITERIA.map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}
                      style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1.5px solid rgba(99,102,241,0.25)', marginBottom: '10px' }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#6366F1', letterSpacing: '0.12em', marginBottom: '4px' }}>{c.label.toUpperCase()}</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#22C55E', marginBottom: '3px' }}>{c.midmarket}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>{c.why}</div>
                    </motion.div>
                  ))}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                    style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(34,197,94,0.08)', border: '1.5px solid rgba(34,197,94,0.3)', fontSize: '12px', fontWeight: 700, color: '#22C55E' }}>
                    ✓ Target: Mid-market sales teams (100–500 employees, 10–50 reps)
                  </motion.div>
                </motion.div>
              )}

              {/* Stage 3: full positioning canvas */}
              {stage === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: '4px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#22C55E', letterSpacing: '0.14em', marginBottom: '16px' }}>
                    POSITIONING STATEMENT
                  </div>

                  {/* Positioning statement card */}
                  <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(99,102,241,0.07)', border: '1.5px solid rgba(99,102,241,0.3)', borderLeft: '4px solid #6366F1', marginBottom: '16px' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#6366F1', letterSpacing: '0.12em', marginBottom: '8px' }}>FOR</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '10px' }}>Mid-market sales teams (10–50 reps) who need to prove coaching ROI to leadership</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#6366F1', letterSpacing: '0.12em', marginBottom: '8px' }}>WHO NEED</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '10px' }}>Measurable coaching outcomes tied to deal performance — not just activity tracking</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#6366F1', letterSpacing: '0.12em', marginBottom: '8px' }}>UNLIKE</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '10px' }}>Gong, which is built for enterprise and focuses on call intelligence, not coaching proof</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#6366F1', letterSpacing: '0.12em', marginBottom: '8px' }}>EDSPARK IS</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#6366F1' }}>The only platform that connects CRM depth to coaching ROI — showing VPs which coaching behaviour caused which deals to close</div>
                  </div>

                  {/* Vs competitor */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                      { name: 'Gong', color: '#94A3B8', points: ['Enterprise (1000+ seats)', 'Conversation intelligence', 'All sales roles', 'Long procurement cycle'] },
                      { name: 'EdSpark', color: '#6366F1', points: ['Mid-market (10-50 reps)', 'Coaching ROI proof', 'Sales managers + VPs', 'VP signs in 1 call'] },
                    ].map((co, i) => (
                      <div key={co.name} style={{ padding: '14px', borderRadius: '12px', background: `${co.color}10`, border: `1.5px solid ${co.color}35` }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: co.color, letterSpacing: '0.12em', marginBottom: '8px' }}>{co.name}</div>
                        {co.points.map((p, pi) => <div key={pi} style={{ fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.55 }}>{p}</div>)}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Stage progress bar */}
        <div style={{ display: 'flex', gap: '0', borderTop: '1px solid var(--ed-rule)' }}>
          {[1,2,3].map((s, i) => (
            <div key={i} style={{ flex: 1, height: '4px', background: stage >= s ? '#6366F1' : 'transparent', transition: 'background 0.5s', borderRight: i < 2 ? '1px solid var(--ed-rule)' : 'none' }} />
          ))}
        </div>
      </div>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>STP is a sequence, not a list.</strong> Segmenting without targeting means you know your options but haven&apos;t made a decision. Targeting without positioning means you know who you serve but not why they should choose you. All three in order.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

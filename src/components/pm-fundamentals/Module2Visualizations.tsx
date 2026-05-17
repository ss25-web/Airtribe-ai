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

      <div style={{ borderRadius: '20px', background: 'linear-gradient(145deg, #F8F6F1 0%, #EDEAE4 100%)', border: '1px solid var(--ed-rule)', padding: '24px', boxShadow: '0 12px 32px rgba(0,0,0,0.06)' }}>
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
// Notes start scattered, then spring-animate into 3 themed clusters.
// Teaches: synthesis = finding patterns across raw observations.

const AFFINITY_NOTES = [
  // Group 0 — "No clear next step" (teal)
  { text: "I finish watching and don't know what to do", group: 0 },
  { text: "What am I supposed to act on?", group: 0 },
  { text: "No guidance after I get the score", group: 0 },
  { text: "I feel lost after each session", group: 0 },
  { text: "No workflow after the analysis", group: 0 },
  // Group 1 — "No benchmark" (orange)
  { text: "Is 72 a good score or a bad one?", group: 1 },
  { text: "My manager says 'improve' — improve what?", group: 1 },
  { text: "I have no idea what 'good' looks like", group: 1 },
  { text: "The data exists but I have no context", group: 1 },
  { text: "What does great coaching even look like?", group: 1 },
  // Group 2 — "Prove ROI" (green)
  { text: "My VP wants to know if this is working", group: 2 },
  { text: "I need proof the calls are getting better", group: 2 },
  { text: "How do I show my team is improving?", group: 2 },
  { text: "Can't justify the tool spend without data", group: 2 },
  { text: "Budget review is next month", group: 2 },
];

// Random start positions (scattered across 680 × 360)
const START_POS = [
  { x: 42,  y: 28  }, { x: 560, y: 18  }, { x: 200, y: 52  },
  { x: 400, y: 34  }, { x: 320, y: 88  }, { x: 620, y: 76  },
  { x: 80,  y: 144 }, { x: 490, y: 118 }, { x: 240, y: 132 },
  { x: 600, y: 160 }, { x: 140, y: 218 }, { x: 360, y: 186 },
  { x: 58,  y: 288 }, { x: 440, y: 268 }, { x: 270, y: 306 },
];

// Cluster end positions (3 groups, centered at ~120, ~340, ~560)
const CLUSTER_CENTERS = [
  { cx: 115, cy: 220 },  // Group 0 — teal
  { cx: 340, cy: 220 },  // Group 1 — orange
  { cx: 565, cy: 220 },  // Group 2 — green
];
const CLUSTER_LAYOUT = [
  [{ x: -70, y: -70 }, { x: 30, y: -80 }, { x: -80, y: 0 }, { x: 20, y: 10 }, { x: -30, y: 80 }],
  [{ x: -70, y: -75 }, { x: 30, y: -65 }, { x: -75, y: 5 }, { x: 25, y: 15 }, { x: -25, y: 82 }],
  [{ x: -70, y: -72 }, { x: 30, y: -82 }, { x: -80, y: 2 }, { x: 20, y: 12 }, { x: -30, y: 78 }],
];

const GROUP_COLORS = [
  { bg: '#CCFBF1', border: '#14B8A6', text: '#0F766E', label: 'No clear next step', labelBg: '#0F766E' },
  { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E', label: 'No benchmark for quality', labelBg: '#D97706' },
  { bg: '#DCFCE7', border: '#22C55E', text: '#14532D', label: 'Need to prove coaching ROI', labelBg: '#15803D' },
];

export function AffinityClusterAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [phase, setPhase] = useState<'scattered' | 'clustering' | 'done'>('scattered');
  const [notesVisible, setNotesVisible] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setPhase('scattered');
    setNotesVisible(0);

    // 1. Scatter notes in
    let t1 = 0;
    AFFINITY_NOTES.forEach((_, i) => {
      setTimeout(() => setNotesVisible(i + 1), 120 * i);
      t1 = 120 * i;
    });
    // 2. Start clustering
    const t2 = setTimeout(() => setPhase('clustering'), t1 + 1000);
    // 3. Mark done (show labels)
    const t3 = setTimeout(() => setPhase('done'), t1 + 2800);

    return () => { clearTimeout(t2); clearTimeout(t3); };
  }, [inView, tick]);

  const replay = () => { setPhase('scattered'); setNotesVisible(0); setTick(t => t + 1); };

  // Per-group note counts (for cluster layout indexing)
  const groupIndex = [0, 0, 0];

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Affinity Mapping — synthesis turns scattered observations into themes</VizLabel>

      <div style={{
        borderRadius: '20px',
        background: 'linear-gradient(145deg, #F8F6F1 0%, #EDE8DF 100%)',
        border: '1px solid var(--ed-rule)',
        overflow: 'hidden',
        boxShadow: '0 12px 32px rgba(0,0,0,0.07)',
        position: 'relative',
      }}>
        {/* Stage label */}
        <div style={{ padding: '14px 20px 0', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.14em' }}>
          {phase === 'scattered' ? '● RAW INTERVIEW OBSERVATIONS' : phase === 'clustering' ? '◎ GROUPING BY THEME…' : '✓ THEMES IDENTIFIED'}
        </div>

        <svg viewBox="0 0 680 380" style={{ width: '100%', display: 'block' }}>
          <defs>
            <filter id="noteShadow">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.12)" />
            </filter>
          </defs>

          {/* Cluster label backgrounds (shown when done) */}
          {phase === 'done' && CLUSTER_CENTERS.map((cc, gi) => (
            <motion.g key={gi} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + gi * 0.15 }}>
              <rect x={cc.cx - 95} y={50} width={190} height={28} rx="8" fill={GROUP_COLORS[gi].labelBg} />
              <text x={cc.cx} y={69} textAnchor="middle" style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fill: '#FFFFFF', fontWeight: 800, letterSpacing: '0.1em' }}>
                {GROUP_COLORS[gi].label.toUpperCase()}
              </text>
            </motion.g>
          ))}

          {/* Notes */}
          {AFFINITY_NOTES.map((note, i) => {
            const g = note.group;
            const li = groupIndex[g]++;
            const clusterLayout = CLUSTER_LAYOUT[g][li];
            const endX = CLUSTER_CENTERS[g].cx + clusterLayout.x;
            const endY = CLUSTER_CENTERS[g].cy + clusterLayout.y;
            const startX = START_POS[i]?.x ?? 300;
            const startY = START_POS[i]?.y ?? 180;
            const targetX = phase === 'scattered' ? startX : endX;
            const targetY = phase === 'scattered' ? startY : endY;
            const gc = GROUP_COLORS[g];

            return (
              <motion.g key={i}
                initial={{ opacity: 0, x: startX, y: startY }}
                animate={{ opacity: i < notesVisible ? 1 : 0, x: targetX, y: targetY }}
                transition={{ opacity: { duration: 0.2 }, x: { type: 'spring', stiffness: 80, damping: 14, delay: phase === 'clustering' ? g * 0.1 : 0 }, y: { type: 'spring', stiffness: 80, damping: 14, delay: phase === 'clustering' ? g * 0.1 : 0 } }}
              >
                <rect x={-65} y={-18} width={130} height={36} rx="7" fill={gc.bg} stroke={gc.border} strokeWidth="1.5" filter="url(#noteShadow)" />
                <text x={0} y={2} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '9px', fill: gc.text, fontFamily: 'system-ui, sans-serif', fontWeight: 600 }}>
                  {note.text.length > 34 ? note.text.slice(0, 32) + '…' : note.text}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#0F766E' }}>Synthesis is not summarising.</strong> It&apos;s finding the pattern that explains multiple observations at once. A theme worth building on appears in at least 3 different interviews.
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

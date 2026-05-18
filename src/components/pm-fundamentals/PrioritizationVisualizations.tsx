'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// ─── Shared ────────────────────────────────────────────────────────────────────
function ReplayBtn({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.button onClick={onReplay} whileHover={{ opacity: 0.75, scale: 1.03 }} whileTap={{ scale: 0.96 }}
      style={{ marginTop: '16px', padding: '7px 22px', borderRadius: '10px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--ed-rule)', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.08em' }}>
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
function InsightBox({ color, label, children }: { color: string; label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: '14px', padding: '12px 18px', borderRadius: '12px', background: `${color}0D`, border: `1px solid ${color}30`, fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
      <strong style={{ color }}>{label}</strong>{children}
    </div>
  );
}

// ─── 1. FEATURE REQUEST X-RAY ─────────────────────────────────────────────────
// An X-ray scan reveals the hidden problem skeleton beneath a surface feature request.
// Teaches: every feature request is a proposed solution — the actual problem is deeper.

const XRAY_EXAMPLES = [
  {
    request: '"Add a dark mode"',
    surface: 'Visual preference request',
    skeleton: 'Users work at night — eye strain causes them to close the app mid-session',
    realProblem: 'Session dropout during late-night workflows',
    color: '#6366F1',
  },
  {
    request: '"Make it faster"',
    surface: 'Performance complaint',
    skeleton: 'Users lose context when pages reload slowly during live coaching calls',
    realProblem: 'Interruptions kill coaching momentum at the critical moment',
    color: '#0EA5E9',
  },
  {
    request: '"Add CRM integration"',
    surface: 'Feature request from sales team',
    skeleton: 'Reps switch tabs 8+ times per call — they lose the coaching context',
    realProblem: 'Context fragmentation reduces coaching effectiveness by ~40%',
    color: '#22C55E',
  },
];

export function FeatureRequestXRay() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [active, setActive] = useState(0);
  const [scanStage, setScanStage] = useState(0); // 0=request, 1=scanning, 2=revealed
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setScanStage(0);
    const t1 = setTimeout(() => setScanStage(1), 600);
    const t2 = setTimeout(() => setScanStage(2), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView, tick, active]);

  const replay = () => { setScanStage(0); setTick(t => t + 1); };
  const ex = XRAY_EXAMPLES[active];

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>The Feature Request X-Ray — what the PM sees vs what's actually there</VizLabel>

      {/* Selector tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' as const }}>
        {XRAY_EXAMPLES.map((e, i) => (
          <button key={i} onClick={() => { setActive(i); setTick(t => t + 1); }}
            style={{
              padding: '7px 16px', borderRadius: '10px', cursor: 'pointer',
              fontSize: '12px', fontWeight: 700,
              background: active === i ? e.color : 'var(--ed-card)',
              color: active === i ? '#fff' : 'var(--ed-ink3)',
              border: `1.5px solid ${active === i ? e.color : 'var(--ed-rule)'}`,
              boxShadow: active === i ? `0 4px 0 ${e.color}60, 0 6px 16px ${e.color}35` : 'none',
              transition: 'all 0.25s',
            }}>
            Request {i + 1}
          </button>
        ))}
      </div>

      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'stretch' }}>

          {/* Left — the X-ray image */}
          <div style={{ background: '#0A1929', padding: '32px 28px', position: 'relative', overflow: 'hidden' }}>
            {/* Scan line */}
            {scanStage === 1 && (
              <motion.div
                initial={{ top: 0 }} animate={{ top: '100%' }}
                transition={{ duration: 1.6, ease: 'linear' }}
                style={{ position: 'absolute', left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, transparent, ${ex.color}, transparent)`, boxShadow: `0 0 12px ${ex.color}`, zIndex: 3 }}
              />
            )}

            {/* Label */}
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: `${ex.color}99`, letterSpacing: '0.16em', marginBottom: '20px' }}>
              {scanStage === 0 ? '● INCOMING REQUEST' : scanStage === 1 ? '◎ SCANNING…' : '✓ ANALYSIS COMPLETE'}
            </div>

            {/* Surface layer — always visible */}
            <div style={{ padding: '16px 18px', borderRadius: '14px', background: `${ex.color}15`, border: `1.5px solid ${ex.color}40`, marginBottom: '14px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: `${ex.color}`, letterSpacing: '0.14em', marginBottom: '6px' }}>SURFACE</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.3, fontStyle: 'italic' }}>{ex.request}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>{ex.surface}</div>
            </div>

            {/* Skeleton layer — revealed by scan */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: scanStage >= 2 ? 1 : 0, y: scanStage >= 2 ? 0 : 8 }}
              transition={{ duration: 0.5 }}
              style={{ padding: '16px 18px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', marginBottom: '8px' }}>SKELETON (hidden)</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65 }}>{ex.skeleton}</div>
            </motion.div>
          </div>

          {/* Right — the diagnosis */}
          <div style={{ background: 'var(--ed-card)', padding: '32px 28px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.14em', marginBottom: '14px' }}>WHAT A PM SHOULD WRITE</div>

            <AnimatePresence mode="wait">
              {scanStage < 2 ? (
                <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ color: 'var(--ed-ink3)', fontSize: '13px', fontStyle: 'italic', padding: '20px 0' }}>
                  Scanning for the real problem…
                </motion.div>
              ) : (
                <motion.div key="diagnosis" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}>
                  {/* Problem statement */}
                  <div style={{ padding: '20px 18px', borderRadius: '16px', background: `${ex.color}12`, border: `1.5px solid ${ex.color}35`, borderLeft: `4px solid ${ex.color}`, marginBottom: '14px' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: ex.color, letterSpacing: '0.14em', marginBottom: '8px' }}>REAL PROBLEM</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.5 }}>{ex.realProblem}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7, fontStyle: 'italic' }}>
                    The feature request was a symptom. This is the problem worth solving.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <InsightBox color="#6366F1" label="The PM's job: ">
        {' '}never ship the first solution someone requests. Ask why they need it. The answer is your product requirement. The feature request is just a hint.
      </InsightBox>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 2. PROBLEM STATEMENT 3-PART BUILD ────────────────────────────────────────
// A vague request animates apart into WHO / STRUGGLES WITH / CONSEQUENCE blocks,
// then snaps together as a crisp 3-part problem statement.
// Teaches: every problem statement has three required components.

const PS_EXAMPLES = [
  {
    raw: '"The app is confusing — I can\'t find anything"',
    who: { label: 'WHO', text: 'Sales managers', color: '#6366F1', dark: '#3730A3' },
    struggle: { label: 'STRUGGLE', text: 'can\'t retrieve specific call recordings quickly', color: '#0EA5E9', dark: '#0369A1' },
    consequence: { label: 'CONSEQUENCE', text: 'spend 8+ min searching before each coaching session, reducing prep quality', color: '#F97316', dark: '#C2410C' },
  },
];

export function ProblemStatement3Parts() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [stage, setStage] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setStage(0);
    const ts = [
      setTimeout(() => setStage(1), 500),  // show raw
      setTimeout(() => setStage(2), 1600), // explode into parts
      setTimeout(() => setStage(3), 2800), // WHO appears
      setTimeout(() => setStage(4), 3600), // STRUGGLE appears
      setTimeout(() => setStage(5), 4400), // CONSEQUENCE appears
      setTimeout(() => setStage(6), 5400), // snap back as statement
    ];
    return () => ts.forEach(clearTimeout);
  }, [inView, tick]);

  const replay = () => { setStage(0); setTick(t => t + 1); };
  const ex = PS_EXAMPLES[0];
  const parts = [ex.who, ex.struggle, ex.consequence];

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Problem statement anatomy — 3 required parts, no exceptions</VizLabel>

      <div style={{ borderRadius: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '32px 28px', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}>

        {/* Raw request */}
        <AnimatePresence>
          {stage >= 1 && stage < 6 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ textAlign: 'center' as const, marginBottom: '28px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.14em', marginBottom: '10px' }}>WHAT THE USER SAID</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ed-ink)', fontStyle: 'italic', padding: '14px 20px', borderRadius: '12px', background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.2)', display: 'inline-block' }}>
                {ex.raw}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3 parts */}
        {stage >= 2 && stage < 6 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '28px' }}>
            {parts.map((p, i) => (
              <AnimatePresence key={i}>
                {stage >= i + 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    style={{
                      padding: '16px 14px', borderRadius: '16px',
                      background: `linear-gradient(160deg, ${p.color}EE 0%, ${p.color} 60%, ${p.dark} 100%)`,
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4), 0 5px 0 ${p.dark}, 0 8px 0 rgba(0,0,0,0.1), 0 14px 28px ${p.color}50`,
                      textAlign: 'center' as const,
                    }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.18em', marginBottom: '8px' }}>{p.label}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.45 }}>{p.text}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>
        )}

        {/* Assembled problem statement */}
        <AnimatePresence>
          {stage >= 6 && (
            <motion.div initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              style={{ padding: '22px 24px', borderRadius: '18px', background: 'var(--ed-card)', border: '2px solid #6366F1', boxShadow: '0 6px 0 #3730A3, 0 10px 0 rgba(0,0,0,0.08), 0 20px 40px rgba(99,102,241,0.2)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#6366F1', letterSpacing: '0.16em', marginBottom: '12px' }}>✓ COMPLETE PROBLEM STATEMENT</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.75 }}>
                <span style={{ color: '#6366F1' }}>{ex.who.text}</span>
                {' '}<span style={{ color: 'var(--ed-ink3)' }}>who</span>{' '}
                <span style={{ color: '#0EA5E9' }}>{ex.struggle.text}</span>
                {', '}
                <span style={{ color: '#F97316' }}>{ex.consequence.text}</span>.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {stage < 2 && (
          <div style={{ textAlign: 'center' as const, padding: '20px 0', color: 'var(--ed-ink3)', fontSize: '13px', fontStyle: 'italic' }}>
            Watch the request transform into a structured problem statement…
          </div>
        )}
      </div>

      <InsightBox color="#6366F1" label="The template: ">
        {' '}[WHO] who [STRUGGLE TO DO X], [CONSEQUENCE]. Every word earns its place. If you can&apos;t fill all three, you don&apos;t understand the problem yet.
      </InsightBox>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 3. RICE COMPONENT SCALE ──────────────────────────────────────────────────
// A balance scale where RICE components are clay weights placed one by one.
// The needle swings as each component changes the score.
// Teaches: RICE is a structured conversation — each input is a deliberate estimate.

const RICE_WEIGHTS = [
  { label: 'Reach', value: 800, unit: 'users/quarter', color: '#6366F1', dark: '#3730A3', contribution: 'High', note: 'How many users hit this problem per quarter?' },
  { label: 'Impact', value: 3, unit: 'out of 5', color: '#0EA5E9', dark: '#0369A1', contribution: 'Medium', note: 'How much does solving this move the needle per user?' },
  { label: 'Confidence', value: 80, unit: '%', color: '#22C55E', dark: '#15803D', contribution: 'High', note: 'How confident are you in these estimates?' },
  { label: 'Effort', value: 3, unit: 'eng-weeks', color: '#F97316', dark: '#C2410C', contribution: 'Low', note: 'Total team effort to build and ship.' },
];

export function RICEComponentScale() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [revealed, setRevealed] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setRevealed(0);
    RICE_WEIGHTS.forEach((_, i) => setTimeout(() => setRevealed(i + 1), 600 + i * 900));
  }, [inView, tick]);

  const replay = () => { setRevealed(0); setTick(t => t + 1); };
  const score = revealed >= 4
    ? Math.round((RICE_WEIGHTS[0].value * RICE_WEIGHTS[1].value * (RICE_WEIGHTS[2].value / 100)) / RICE_WEIGHTS[3].value)
    : null;

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>RICE in action — each component is a deliberate estimate, not a guess</VizLabel>

      <div style={{ borderRadius: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '28px', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}>
        {/* Formula header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' as const }}>
          {['Reach × Impact × Confidence', '÷ Effort', '= RICE Score'].map((t, i) => (
            <div key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: i === 2 ? '#6366F1' : 'var(--ed-ink3)', letterSpacing: '0.1em' }}>{t}</div>
          ))}
        </div>

        {/* Component cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
          {RICE_WEIGHTS.map((w, i) => {
            const show = i < revealed;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16, scale: 0.85 }}
                animate={{ opacity: show ? 1 : 0.25, y: show ? 0 : 16, scale: show ? 1 : 0.85 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                style={{
                  padding: '14px 12px', borderRadius: '16px',
                  background: show ? `linear-gradient(160deg, ${w.color}EE 0%, ${w.color} 60%, ${w.dark} 100%)` : 'var(--ed-rule)',
                  boxShadow: show ? `inset 0 1px 0 rgba(255,255,255,0.4), 0 5px 0 ${w.dark}, 0 8px 0 rgba(0,0,0,0.1), 0 14px 28px ${w.color}45` : 'none',
                  textAlign: 'center' as const,
                }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: show ? 'rgba(255,255,255,0.65)' : 'var(--ed-ink3)', letterSpacing: '0.14em', marginBottom: '6px' }}>{w.label}</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: show ? '#FFFFFF' : 'var(--ed-rule)', fontFamily: 'monospace', marginBottom: '4px' }}>{w.value}{w.unit.includes('%') ? '%' : ''}</div>
                <div style={{ fontSize: '9px', color: show ? 'rgba(255,255,255,0.7)' : 'var(--ed-ink3)', lineHeight: 1.4 }}>{w.unit.replace('%', '')}</div>
                {show && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    style={{ marginTop: '8px', fontSize: '9px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, fontStyle: 'italic' }}>
                    {w.note}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Score reveal */}
        <AnimatePresence>
          {score !== null && (
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '20px', borderRadius: '18px', background: 'rgba(99,102,241,0.08)', border: '2px solid rgba(99,102,241,0.3)' }}>
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#6366F1', letterSpacing: '0.16em', marginBottom: '6px' }}>RICE SCORE</div>
                <div style={{ fontSize: '52px', fontWeight: 900, fontFamily: 'monospace', color: '#6366F1', lineHeight: 1 }}>{score}</div>
                <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', marginTop: '4px' }}>({RICE_WEIGHTS[0].value} × {RICE_WEIGHTS[1].value} × {RICE_WEIGHTS[2].value}%) ÷ {RICE_WEIGHTS[3].value}</div>
              </div>
              <div style={{ maxWidth: '220px', fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
                Now compare this score against competing features. Change Effort to 6 weeks — the score halves. Effort is the most underestimated input.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <InsightBox color="#6366F1" label="RICE is a conversation starter, not a verdict. ">
        The score is only as honest as the inputs. The team argument usually happens at Reach and Confidence — that&apos;s where the real calibration lives.
      </InsightBox>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 4. CORRELATION VS MECHANISM ──────────────────────────────────────────────
// The same Amplitude chart, two interpretations. Shows why data alone is insufficient.
// Teaches: your job isn't to read the chart — it's to name the mechanism hypothesis.

const COHORT_DATA = [
  { label: '0–1 sessions', retention: 34, color: '#EF4444' },
  { label: '2 sessions',   retention: 61, color: '#F59E0B' },
  { label: '3 sessions',   retention: 79, color: '#22C55E' },
  { label: '4+ sessions',  retention: 91, color: '#059669' },
];

export function CorrelationVsMechanism() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [mode, setMode] = useState<'correlation' | 'mechanism'>('correlation');
  const [barsVisible, setBarsVisible] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setBarsVisible(false);
    const t = setTimeout(() => setBarsVisible(true), 400);
    return () => clearTimeout(t);
  }, [inView, tick]);

  const replay = () => { setBarsVisible(false); setTick(t => t + 1); };

  const hypotheses = [
    { label: 'Hypothesis A (popular)', text: 'More sessions CAUSE retention — add features that create session frequency.', risk: 'HIGH RISK', riskColor: '#EF4444', note: 'Forces artificial engagement. May damage trust.', icon: '⚠️' },
    { label: 'Hypothesis B (deeper)', text: 'Users who get value naturally have more sessions AND retain — sessions are a symptom of value, not the cause.', risk: 'LOWER RISK', riskColor: '#22C55E', note: 'Improve the value delivered per session, not the session count.', icon: '✓' },
  ];

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Correlation vs mechanism — the chart tells you what, not why</VizLabel>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {(['correlation', 'mechanism'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            style={{
              padding: '8px 18px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
              background: mode === m ? (m === 'correlation' ? '#F59E0B' : '#6366F1') : 'var(--ed-card)',
              color: mode === m ? '#fff' : 'var(--ed-ink3)',
              border: `1.5px solid ${mode === m ? 'transparent' : 'var(--ed-rule)'}`,
              boxShadow: mode === m ? `0 4px 0 ${m === 'correlation' ? '#D97706' : '#3730A3'}, 0 8px 16px ${m === 'correlation' ? 'rgba(245,158,11,0.3)' : 'rgba(99,102,241,0.3)'}` : 'none',
              transition: 'all 0.25s',
            }}>
            {m === 'correlation' ? '📊 What the chart shows' : '🔬 What the PM must ask'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Chart */}
        <div style={{ borderRadius: '20px', overflow: 'hidden', background: '#1B2A47', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 16px 40px rgba(0,0,0,0.2)' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
            SESSION FREQUENCY vs 90-DAY RETENTION
          </div>
          <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
            {COHORT_DATA.map((d, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)' }}>{d.label}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 800, color: d.color }}>{d.retention}%</span>
                </div>
                <div style={{ height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', overflow: 'hidden' }}>
                  <motion.div animate={{ width: barsVisible ? `${d.retention}%` : '0%' }}
                    transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
                    style={{ height: '100%', background: d.color, borderRadius: '5px', boxShadow: `0 0 8px ${d.color}60` }} />
                </div>
              </div>
            ))}
            {mode === 'correlation' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                style={{ marginTop: '8px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', fontSize: '11px', color: '#F59E0B', fontWeight: 600 }}>
                ↑ Strong correlation between session frequency and retention
              </motion.div>
            )}
            {mode === 'mechanism' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                style={{ marginTop: '8px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: '11px', color: '#EF4444', fontWeight: 600 }}>
                ⚠ Does session frequency CAUSE retention — or do healthy users just happen to have both?
              </motion.div>
            )}
          </div>
        </div>

        {/* Interpretation */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          <AnimatePresence mode="wait">
            {mode === 'correlation' ? (
              <motion.div key="corr" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                style={{ padding: '18px', borderRadius: '16px', background: 'rgba(245,158,11,0.08)', border: '1.5px solid rgba(245,158,11,0.25)', borderLeft: '4px solid #F59E0B' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#F59E0B', letterSpacing: '0.14em', marginBottom: '8px' }}>WHAT THE DATA SHOWS</div>
                <div style={{ fontSize: '13px', color: 'var(--ed-ink)', fontWeight: 600, lineHeight: 1.6 }}>Users who have 4+ sessions in week 1 retain at 91%. Users with 0–1 sessions retain at 34%.</div>
                <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.65 }}>This is a real pattern in the data. The correlation is clear and statistically strong.</div>
              </motion.div>
            ) : (
              <motion.div key="mech" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
                {hypotheses.map((h, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}
                    style={{ padding: '16px 16px', borderRadius: '14px', background: `${h.riskColor}0D`, border: `1.5px solid ${h.riskColor}30`, borderLeft: `4px solid ${h.riskColor}`, marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em' }}>{h.label}</div>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: h.riskColor, fontFamily: 'monospace' }}>{h.icon} {h.risk}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink)', fontWeight: 600, lineHeight: 1.6, marginBottom: '6px' }}>{h.text}</div>
                    <div style={{ fontSize: '11px', color: h.riskColor, fontWeight: 600 }}>{h.note}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <InsightBox color="#6366F1" label="The PM&apos;s job: ">
        {' '}name the mechanism hypothesis, not just read the chart. &ldquo;If we improve session depth, retention improves because users reach their first coaching win&rdquo; — now you can test it, not just act on it.
      </InsightBox>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 7. MOSCOW BOARD ──────────────────────────────────────────────────────────
// Features drop into 4 colour-coded columns. The "Won't" column teaches discipline.
// Teaches: MoSCoW = categorical clarity when RICE scores cluster too closely.

const MOSCOW_FEATURES = [
  { id: 'f1', text: 'Fix onboarding step 3 (40% drop-off)', col: 0 },
  { id: 'f2', text: 'Session search by date', col: 0 },
  { id: 'f3', text: 'Manager analytics dashboard', col: 1 },
  { id: 'f4', text: 'Slack share button', col: 1 },
  { id: 'f5', text: 'Dark mode', col: 2 },
  { id: 'f6', text: 'Keyboard shortcuts', col: 2 },
  { id: 'f7', text: 'Mobile app (Q2)', col: 3 },
  { id: 'f8', text: 'AI coaching recommendations', col: 3 },
];

const MOSCOW_COLS = [
  { label: 'Must Have',   sub: 'Ship is blocked without these', color: '#22C55E', dark: '#15803D' },
  { label: 'Should Have', sub: 'Important, not blocking',       color: '#6366F1', dark: '#3730A3' },
  { label: 'Could Have',  sub: 'Nice to have, defer if tight',  color: '#F59E0B', dark: '#D97706' },
  { label: "Won't Have",  sub: "Not this cycle — and that's OK", color: '#EF4444', dark: '#B91C1C' },
];

export function MoSCoWBoard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0);
    MOSCOW_FEATURES.forEach((_, i) => setTimeout(() => setVisible(i + 1), 400 + i * 500));
  }, [inView, tick]);

  const replay = () => { setVisible(0); setTick(t => t + 1); };
  const byCol = (ci: number) => MOSCOW_FEATURES.filter(f => f.col === ci);
  const globalIdx = (f: typeof MOSCOW_FEATURES[0]) => MOSCOW_FEATURES.indexOf(f);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>MoSCoW framework — categorical clarity when RICE scores are too close to call</VizLabel>

      <div style={{ borderRadius: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--ed-rule)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ed-ink3)', fontWeight: 700 }}>EdSpark &middot; Q2 Sprint Planning &middot; MoSCoW Sort</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {MOSCOW_COLS.map((col, ci) => (
            <div key={ci} style={{ borderRight: ci < 3 ? '1px solid var(--ed-rule)' : 'none', padding: '16px 14px', minHeight: '280px' }}>
              <div style={{ marginBottom: '14px' }}>
                <div style={{ padding: '6px 12px', borderRadius: '8px', background: col.color, boxShadow: `0 4px 0 ${col.dark}, 0 6px 12px ${col.color}40`, display: 'inline-block', marginBottom: '6px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '0.12em' }}>{col.label.toUpperCase()}</div>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.4 }}>{col.sub}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                {byCol(ci).map(f => {
                  const show = globalIdx(f) < visible;
                  return (
                    <AnimatePresence key={f.id}>
                      {show && (
                        <motion.div
                          initial={{ opacity: 0, y: -20, scale: 0.85 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                          style={{ padding: '10px 12px', borderRadius: '10px', background: `${col.color}10`, border: `1.5px solid ${col.color}30`, fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink)', lineHeight: 1.45 }}>
                          {f.text}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--ed-rule)', background: 'rgba(239,68,68,0.05)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '18px', flexShrink: 0 }}>💡</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
            <strong style={{ color: '#EF4444' }}>The hardest column is Won&apos;t.</strong> Saying no to things you want to build — and being explicit about it — is the discipline that makes the other three columns credible.
          </div>
        </div>
      </div>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>When to use MoSCoW over RICE:</strong> when you have too many similarly-scored items and need categorical clarity for a sprint. MoSCoW is faster; RICE is more defensible to stakeholders. Use both.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 8. USER STORY BUILDER ─────────────────────────────────────────────────────
// Vague spec transforms into a 3-part user story. Bad vs Good comparison.
// Teaches: As a [WHO] / I want [WHAT] / so that [WHY].

const USER_STORY_EXAMPLES = [
  { bad: '"Add search"', who: 'a sales manager reviewing yesterday\'s coaching calls', want: 'find any recording by date, rep name, or keyword in under 10 seconds', sothat: 'I can prep for a follow-up call without switching tabs or losing context', color: '#6366F1' },
  { bad: '"Improve onboarding"', who: 'a new sales rep on day 1', want: 'complete my first coaching session setup without asking my manager for help', sothat: 'I see value from EdSpark before my first weekly review — and stay active', color: '#0EA5E9' },
  { bad: '"Better reporting"', who: 'a VP of Sales reviewing team performance', want: "see each rep's coaching engagement score alongside their quota attainment", sothat: 'I can correlate coaching effort with revenue outcomes in one view, not two', color: '#22C55E' },
];

export function UserStoryBuilder() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [activeEx, setActiveEx] = useState(0);
  const [stage, setStage] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setStage(0);
    const ts = [
      setTimeout(() => setStage(1), 800),
      setTimeout(() => setStage(2), 2000),
      setTimeout(() => setStage(3), 3200),
      setTimeout(() => setStage(4), 4400),
    ];
    return () => ts.forEach(clearTimeout);
  }, [inView, tick, activeEx]);

  const replay = () => { setStage(0); setTick(t => t + 1); };
  const ex = USER_STORY_EXAMPLES[activeEx];
  const parts = [
    { prefix: 'As', field: ex.who, color: ex.color, label: 'WHO' },
    { prefix: 'I want to', field: ex.want, color: '#F97316', label: 'WHAT' },
    { prefix: 'so that', field: ex.sothat, color: '#22C55E', label: 'WHY / VALUE' },
  ];

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>User stories — As a [who], I want [action], so that [value]</VizLabel>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' as const }}>
        {USER_STORY_EXAMPLES.map((e, i) => (
          <button key={i} onClick={() => { setActiveEx(i); setTick(t => t + 1); }}
            style={{ padding: '7px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, background: activeEx === i ? e.color : 'var(--ed-card)', color: activeEx === i ? '#fff' : 'var(--ed-ink3)', border: `1.5px solid ${activeEx === i ? e.color : 'var(--ed-rule)'}`, boxShadow: activeEx === i ? `0 4px 0 ${e.color}60, 0 6px 16px ${e.color}35` : 'none', transition: 'all 0.25s' }}>
            {e.bad}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.25)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#EF4444', letterSpacing: '0.14em', marginBottom: '10px' }}>❌ WHAT THE TICKET SAYS</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ed-ink)', fontStyle: 'italic', marginBottom: '12px' }}>{ex.bad}</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.65 }}>Three engineers read this. They each build something different. Two of them build the wrong thing. Nobody is wrong — the spec was wrong.</div>
        </div>

        <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--ed-card)', border: `1.5px solid ${stage >= 4 ? ex.color : 'var(--ed-rule)'}`, transition: 'border-color 0.4s', boxShadow: stage >= 4 ? `0 6px 0 ${ex.color}40, 0 10px 24px ${ex.color}20` : 'none' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: stage >= 4 ? ex.color : 'var(--ed-ink3)', letterSpacing: '0.14em', marginBottom: '14px', transition: 'color 0.4s' }}>
            {stage < 4 ? '◎ BUILDING USER STORY…' : '✓ USER STORY COMPLETE'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
            {parts.map((p, i) => (
              <AnimatePresence key={i}>
                {stage >= i + 1 && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: p.color, letterSpacing: '0.14em', marginBottom: '4px' }}>{p.label}</div>
                    <div style={{ fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.6 }}>
                      <span style={{ color: 'var(--ed-ink3)', fontStyle: 'italic' }}>{p.prefix} </span>
                      <span style={{ color: p.color, fontWeight: 700 }}>{p.field}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>The &ldquo;so that&rdquo; is the hardest part</strong> — and the most important. It forces you to name the value, not just the action. Without it, the engineer builds the feature; with it, they understand the goal.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 9. FIGJAM BOARD MOCKUP ────────────────────────────────────────────────────
// Working FigJam-style board: team sticky notes appear, votes show, themes cluster.
// Teaches: FigJam = shared PM thinking space before decisions get made.

const FJ_NOTES = [
  { id: 'n1', text: "Users don't finish setup", bg: '#FDE68A', fg: '#78350F', votes: 4, x: 8,  y: 30 },
  { id: 'n2', text: 'Step 3 has no guidance',   bg: '#FDE68A', fg: '#78350F', votes: 2, x: 26, y: 16 },
  { id: 'n3', text: 'First session = blank screen', bg: '#FDE68A', fg: '#78350F', votes: 3, x: 17, y: 46 },
  { id: 'n4', text: "Can't find old calls",     bg: '#BAE6FD', fg: '#0C4A6E', votes: 5, x: 44, y: 22 },
  { id: 'n5', text: 'No search by date',        bg: '#BAE6FD', fg: '#0C4A6E', votes: 4, x: 58, y: 34 },
  { id: 'n6', text: 'Scroll through 40+ calls', bg: '#BAE6FD', fg: '#0C4A6E', votes: 3, x: 50, y: 48 },
  { id: 'n7', text: 'VP wants ROI data',        bg: '#D9F99D', fg: '#14532D', votes: 3, x: 74, y: 20 },
  { id: 'n8', text: 'No before/after view',     bg: '#D9F99D', fg: '#14532D', votes: 2, x: 82, y: 32 },
  { id: 'n9', text: "Can't export results",     bg: '#D9F99D', fg: '#14532D', votes: 1, x: 76, y: 46 },
];

const FJ_THEMES = [
  { label: 'Onboarding drop-off', color: '#F59E0B', x: 8,  y: 7 },
  { label: 'Recording retrieval', color: '#0EA5E9', x: 44, y: 7 },
  { label: 'Proving ROI',         color: '#22C55E', x: 74, y: 7 },
];

const FJ_TEAM = [
  { initials: 'P', color: '#6366F1' },
  { initials: 'M', color: '#E07A5F' },
  { initials: 'K', color: '#0097A7' },
];

export function FigJamBoardMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [notesVisible, setNotesVisible] = useState(0);
  const [showThemes, setShowThemes] = useState(false);
  const [activeTool, setActiveTool] = useState('cursor');
  const [selected, setSelected] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setNotesVisible(0); setShowThemes(false);
    FJ_NOTES.forEach((_, i) => setTimeout(() => setNotesVisible(i + 1), 300 + i * 300));
    setTimeout(() => setShowThemes(true), 300 + FJ_NOTES.length * 300 + 700);
  }, [inView, tick]);

  const replay = () => { setNotesVisible(0); setShowThemes(false); setSelected(null); setTick(t => t + 1); };
  const totalVotes = FJ_NOTES.reduce((s, n) => s + n.votes, 0);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>FigJam — where PM thinking becomes visible and shared with the team</VizLabel>

      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.1)' }}>
        {/* Title bar */}
        <div style={{ background: '#1E1E1E', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ width: '20px', height: '20px', borderRadius: '5px', background: 'linear-gradient(135deg, #F24E1E, #FF7262)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900, color: '#fff', flexShrink: 0 }}>F</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: 600, flex: 1 }}>EdSpark &middot; Q2 Discovery — Problem Brainstorm</div>
          <div style={{ display: 'flex' }}>
            {FJ_TEAM.map((t, i) => (
              <div key={i} style={{ width: '26px', height: '26px', borderRadius: '50%', background: t.color, border: '2px solid #1E1E1E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: '#fff', marginLeft: i > 0 ? '-6px' : '0' }}>
                {t.initials}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>3 online</div>
        </div>

        {/* Toolbar */}
        <div style={{ background: '#2C2C2C', padding: '6px', display: 'flex', justifyContent: 'center', gap: '2px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {[['cursor','↖'],['sticky','📝'],['text','T'],['shape','□'],['pen','✏'],['comment','💬']].map(([tool, icon]) => (
            <button key={tool} onClick={() => setActiveTool(tool)}
              style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: activeTool === tool ? '#F24E1E' : 'transparent', color: activeTool === tool ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              {icon}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div style={{ background: '#F5F5F0', position: 'relative', height: '360px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, #C0C0B8 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.5, pointerEvents: 'none' }} />

          {/* Theme labels */}
          {showThemes && FJ_THEMES.map((t, i) => (
            <motion.div key={t.label} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
              style={{ position: 'absolute', left: `${t.x}%`, top: `${t.y}%`, padding: '3px 10px', borderRadius: '5px', background: t.color, fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#fff', letterSpacing: '0.1em', boxShadow: `0 2px 0 ${t.color}80`, whiteSpace: 'nowrap' as const }}>
              {t.label.toUpperCase()}
            </motion.div>
          ))}

          {/* Notes */}
          {FJ_NOTES.map((note, i) => {
            const show = i < notesVisible;
            const isSel = selected === note.id;
            return (
              <AnimatePresence key={note.id}>
                {show && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
                    animate={{ opacity: 1, scale: isSel ? 1.08 : 1, rotate: isSel ? 0 : (i % 3 - 1) * 2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    onClick={() => setSelected(isSel ? null : note.id)}
                    style={{ position: 'absolute', left: `${note.x}%`, top: `${note.y + 12}%`, width: '130px', background: note.bg, borderRadius: '3px', padding: '10px 10px 22px', cursor: 'pointer', boxShadow: isSel ? '0 8px 20px rgba(0,0,0,0.2)' : '0 3px 8px rgba(0,0,0,0.12)', zIndex: isSel ? 5 : 1 }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: note.fg, lineHeight: 1.45 }}>{note.text}</div>
                    <div style={{ position: 'absolute', bottom: '6px', left: '8px', display: 'flex', gap: '3px', alignItems: 'center' }}>
                      {Array.from({ length: Math.min(note.votes, 5) }, (_, vi) => (
                        <div key={vi} style={{ width: '7px', height: '7px', borderRadius: '50%', background: FJ_TEAM[vi % FJ_TEAM.length].color }} />
                      ))}
                      <span style={{ fontSize: '8px', color: note.fg, opacity: 0.6, fontWeight: 700, marginLeft: '2px' }}>{note.votes}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}

          {/* Zoom controls */}
          <div style={{ position: 'absolute', bottom: '10px', right: '12px', display: 'flex', gap: '4px' }}>
            {['−', '+', '⊡'].map(btn => (
              <div key={btn} style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'rgba(0,0,0,0.5)', cursor: 'pointer', fontWeight: 700 }}>{btn}</div>
            ))}
            <div style={{ padding: '0 8px', height: '26px', borderRadius: '6px', background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', fontSize: '10px', color: 'rgba(0,0,0,0.5)', fontFamily: 'monospace' }}>75%</div>
          </div>
        </div>

        {/* Status bar */}
        <div style={{ background: '#1E1E1E', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>
            {notesVisible} notes &middot; {totalVotes} votes &middot; {showThemes ? '3 themes identified' : 'grouping…'}
          </div>
          {showThemes && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontFamily: 'monospace', fontSize: '9px', color: '#34D399', fontWeight: 700 }}>
              ✓ Themes clustered — ready to write problem statements
            </motion.div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(242,78,30,0.07)', border: '1px solid rgba(242,78,30,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#F24E1E' }}>FigJam&apos;s job in PM work:</strong> make raw inputs visible and shared before they become decisions. Votes surface which problems the whole team feels — not just the loudest stakeholder.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 5. NOW / NEXT / LATER ORBITS ─────────────────────────────────────────────
// Features orbit a "ship this sprint" centre at three distances.
// NOW = tight orbit. NEXT = mid. LATER = outer. Auto-sorts on scroll.
// Teaches: Now/Next/Later isn't just time — it's strategic phase and dependencies.

const ORBIT_FEATURES = [
  { label: 'Session scheduling',   orbit: 0, color: '#22C55E', dark: '#15803D', reason: 'Directly attacks week-2 churn. No dependencies.' },
  { label: 'Fix onboarding step 3',orbit: 0, color: '#22C55E', dark: '#15803D', reason: 'Blocks 40% of users. 3 days to ship.' },
  { label: 'Analytics dashboard',  orbit: 1, color: '#6366F1', dark: '#3730A3', reason: 'Needs clean data from onboarding fix first.' },
  { label: 'CRM sync v2',          orbit: 1, color: '#6366F1', dark: '#3730A3', reason: 'API scope depends on enterprise validation.' },
  { label: 'AI recommendations',   orbit: 2, color: '#94A3B8', dark: '#64748B', reason: 'Requires 6 months of usage data to train model.' },
  { label: 'Mobile app',           orbit: 2, color: '#94A3B8', dark: '#64748B', reason: 'Nice-to-have. No enterprise RFP requirement yet.' },
];

const ORBIT_LABELS = [
  { label: 'NOW', sub: 'This sprint', color: '#22C55E', r: 90 },
  { label: 'NEXT', sub: 'Next quarter', color: '#6366F1', r: 155 },
  { label: 'LATER', sub: 'When conditions change', color: '#94A3B8', r: 215 },
];

export function NowNextLaterOrbits() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0);
    ORBIT_FEATURES.forEach((_, i) => setTimeout(() => setVisible(i + 1), 500 + i * 500));
  }, [inView, tick]);

  const replay = () => { setVisible(0); setActiveFeature(null); setTick(t => t + 1); };
  const CX = 240, CY = 240;

  // Distribute features evenly around each orbit
  const orbitCounts = [0, 0, 0];
  const positions = ORBIT_FEATURES.map(f => {
    const count = ORBIT_FEATURES.filter(x => x.orbit === f.orbit).length;
    const idx = orbitCounts[f.orbit]++;
    const angle = (idx / count) * 2 * Math.PI - Math.PI / 2 + (f.orbit * 0.4);
    const r = ORBIT_LABELS[f.orbit].r;
    return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
  });

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Now / Next / Later — strategic phase, not just time</VizLabel>

      <div style={{ borderRadius: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '28px', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: '28px', alignItems: 'center' }}>

          {/* Orbit diagram */}
          <div style={{ position: 'relative' }}>
            <svg viewBox="0 0 480 480" style={{ width: '100%', display: 'block' }}>
              {/* Orbit rings */}
              {ORBIT_LABELS.map((o, i) => (
                <circle key={i} cx={CX} cy={CY} r={o.r} fill="none" stroke={o.color} strokeWidth="1.5"
                  strokeDasharray={i === 2 ? '6 4' : i === 1 ? '3 3' : '0'} opacity={i === 2 ? 0.3 : 0.5} />
              ))}

              {/* Center "ship this sprint" hub */}
              <circle cx={CX} cy={CY} r="36" fill="#22C55E" style={{ filter: 'drop-shadow(0 4px 12px rgba(34,197,94,0.5))' }} />
              <motion.circle cx={CX} cy={CY} r="44" fill="none" stroke="#22C55E" strokeWidth="2"
                animate={{ r: [44, 52, 44], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }} />
              <text x={CX} y={CY - 6} textAnchor="middle" style={{ fontSize: '8px', fill: 'white', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.1em' }}>SHIP</text>
              <text x={CX} y={CY + 8} textAnchor="middle" style={{ fontSize: '8px', fill: 'white', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.1em' }}>THIS</text>

              {/* Feature nodes */}
              {ORBIT_FEATURES.map((f, i) => {
                const pos = positions[i];
                const show = i < visible;
                const isActive = activeFeature === i;
                return (
                  <motion.g key={i} initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.3 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                    style={{ cursor: 'pointer', transformOrigin: `${pos.x}px ${pos.y}px` }}
                    onClick={() => setActiveFeature(activeFeature === i ? null : i)}>
                    <circle cx={pos.x} cy={pos.y} r={isActive ? 26 : 22} fill={f.color}
                      style={{ filter: isActive ? `drop-shadow(0 4px 10px ${f.color}80)` : 'none', transition: 'r 0.2s' }} />
                    {isActive && <circle cx={pos.x} cy={pos.y} r="32" fill="none" stroke={f.color} strokeWidth="2" opacity="0.4" />}
                    <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle"
                      style={{ fontSize: '7px', fill: 'white', fontFamily: 'system-ui', fontWeight: 800, pointerEvents: 'none' }}>
                      {f.label.split(' ')[0]}
                    </text>
                  </motion.g>
                );
              })}

              {/* Orbit labels */}
              {ORBIT_LABELS.map((o, i) => (
                <text key={i} x={CX + o.r} y={CY + 12} textAnchor="start"
                  style={{ fontSize: '8px', fill: o.color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.1em', opacity: 0.8 }}>
                  {o.label}
                </text>
              ))}
            </svg>
          </div>

          {/* Feature detail */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
            <AnimatePresence mode="wait">
              {activeFeature !== null ? (
                <motion.div key={activeFeature} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ padding: '18px 16px', borderRadius: '16px', background: `${ORBIT_FEATURES[activeFeature].color}12`, border: `1.5px solid ${ORBIT_FEATURES[activeFeature].color}35`, borderLeft: `4px solid ${ORBIT_FEATURES[activeFeature].color}` }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: ORBIT_FEATURES[activeFeature].color, letterSpacing: '0.14em', marginBottom: '6px' }}>
                    {ORBIT_LABELS[ORBIT_FEATURES[activeFeature].orbit].label} — {ORBIT_LABELS[ORBIT_FEATURES[activeFeature].orbit].sub}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ed-ink)', marginBottom: '8px' }}>{ORBIT_FEATURES[activeFeature].label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{ORBIT_FEATURES[activeFeature].reason}</div>
                </motion.div>
              ) : (
                <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ fontSize: '13px', color: 'var(--ed-ink3)', fontStyle: 'italic', marginBottom: '16px' }}>Click any feature to see why it&apos;s in its orbit.</div>
                  {ORBIT_LABELS.map((o, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: o.color, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: o.color }}>{o.label}</div>
                        <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{o.sub}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <InsightBox color="#6366F1" label="&ldquo;Later&rdquo; is not &ldquo;never&rdquo;. ">
        {' '}It&apos;s &ldquo;not this quarter, and here is what would move it closer.&rdquo; Features in the outer orbit have specific unlock conditions — when those conditions are met, they move inward.
      </InsightBox>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 6. KILL CRITERIA MONITOR ─────────────────────────────────────────────────
// A live monitoring panel for a deferred feature.
// 3 conditions tick from unmet → met. When all 3 trigger: feature flips NOW.
// Teaches: "later" with conditions is a commitment. "Later" without is a promise you won't keep.

const MONITOR_CONDITIONS = [
  { id: 'nps', label: 'NPS exceeds 72', metric: 'Track NPS monthly', color: '#6366F1', trigger: 'Month-3 NPS: 74 ✓' },
  { id: 'churn', label: 'Week-1 churn below 25%', metric: 'Amplitude cohort watch', color: '#0EA5E9', trigger: 'Sprint 14 cohort: 23% ✓' },
  { id: 'requests', label: '3+ enterprise deals cite it', metric: 'Sales CRM tag "CRM-blocker"', color: '#F97316', trigger: 'Deals: Infosys, Zendesk, Apex ✓' },
];

export function KillCriteriaMonitor() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [metCount, setMetCount] = useState(0);
  const [promoted, setPromoted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setMetCount(0); setPromoted(false);
    const ts = [
      ...MONITOR_CONDITIONS.map((_, i) => setTimeout(() => setMetCount(i + 1), 1200 + i * 1400)),
      setTimeout(() => setPromoted(true), 1200 + MONITOR_CONDITIONS.length * 1400 + 600),
    ];
    return () => ts.forEach(clearTimeout);
  }, [inView, tick]);

  const replay = () => { setMetCount(0); setPromoted(false); setTick(t => t + 1); };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Kill criteria monitoring — &ldquo;later&rdquo; with conditions is a commitment</VizLabel>

      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}>
        {/* Header */}
        <div style={{ background: '#0F172A', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', marginBottom: '3px' }}>MONITORING</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>CRM Integration v2</div>
          </div>
          <motion.div
            animate={{ background: promoted ? '#22C55E' : '#64748B', boxShadow: promoted ? '0 4px 0 #15803D, 0 8px 16px rgba(34,197,94,0.4)' : 'none' }}
            style={{ padding: '6px 16px', borderRadius: '10px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, color: '#FFFFFF', transition: 'all 0.5s' }}>
            {promoted ? '→ NOW' : 'LATER'}
          </motion.div>
        </div>

        {/* Conditions */}
        <div style={{ background: 'var(--ed-card)', padding: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.14em', marginBottom: '14px' }}>
            MOVE TO NOW WHEN ALL CONDITIONS MET
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
            {MONITOR_CONDITIONS.map((c, i) => {
              const met = i < metCount;
              return (
                <motion.div key={c.id}
                  animate={{ background: met ? `${c.color}12` : 'var(--ed-card)', borderColor: met ? `${c.color}40` : 'var(--ed-rule)' }}
                  style={{ padding: '14px 16px', borderRadius: '14px', border: '1.5px solid var(--ed-rule)', transition: 'all 0.4s', borderLeft: `4px solid ${met ? c.color : 'var(--ed-rule)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: met ? c.color : 'var(--ed-ink)', marginBottom: '3px', transition: 'color 0.4s' }}>{c.label}</div>
                      <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>{c.metric}</div>
                    </div>
                    <motion.div
                      animate={{ background: met ? c.color : 'var(--ed-rule)' }}
                      style={{ width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px', transition: 'background 0.4s' }}>
                      {met ? '✓' : '—'}
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {met && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.35 }}
                        style={{ marginTop: '8px', fontSize: '11px', color: c.color, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", overflow: 'hidden' }}>
                        {c.trigger}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Promotion event */}
          <AnimatePresence>
            {promoted && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                style={{ marginTop: '16px', padding: '16px 18px', borderRadius: '14px', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.4)', borderLeft: '4px solid #22C55E' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#22C55E', letterSpacing: '0.14em', marginBottom: '6px' }}>ALL CONDITIONS MET → MOVING TO NOW</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.6 }}>
                  CRM Integration v2 is now unblocked. The team had clarity for 3 months — no guessing, no lobbying, just monitoring.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <InsightBox color="#6366F1" label="Kill criteria are not hedges. ">
        {' '}They&apos;re monitoring contracts that give teams agency. &ldquo;Later&rdquo; without conditions becomes &ldquo;never.&rdquo; &ldquo;Later&rdquo; with conditions becomes a commitment everyone can track.
      </InsightBox>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── FIVE WHYS ────────────────────────────────────────────────────────────────
// First-principles problem decomposition: drill to root cause by asking "why"
// five times. Each layer peels back a symptom to reveal a deeper cause.
// Teaches: you can't solve a problem you haven't correctly diagnosed.

const FIVE_WHYS_CHAIN = [
  { layer: 1, observation: '40% of users churn in week 2', type: 'Symptom', color: '#EF4444', dark: '#B91C1C', note: 'This is what shows up in your metrics dashboard.' },
  { layer: 2, observation: 'Users don\'t return after their first coaching session', type: 'Behaviour', color: '#F97316', dark: '#C2410C', note: 'This is what session recordings show. Users open the app once and never come back.' },
  { layer: 3, observation: 'The first session gives no clear next step', type: 'Experience', color: '#F59E0B', dark: '#D97706', note: 'Users watch a recording, see a score, and then stare at a blank screen. Nothing tells them what to do next.' },
  { layer: 4, observation: 'The product has no "session 2" onboarding', type: 'Product gap', color: '#6366F1', dark: '#3730A3', note: 'The onboarding was built for day 1. Nobody designed for what success looks like after the first session.' },
  { layer: 5, observation: 'The PM never asked "what does success look like in session 2?"', type: 'Root cause', color: '#22C55E', dark: '#15803D', note: 'This is the real problem. The question wasn\'t asked during discovery. The spec was written for the happy path only.' },
];

export function FivePlusWhysViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [depth, setDepth] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setDepth(0);
    FIVE_WHYS_CHAIN.forEach((_, i) => setTimeout(() => setDepth(i + 1), 500 + i * 1000));
  }, [inView, tick]);

  const replay = () => { setDepth(0); setTick(t => t + 1); };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ padding: '4px 12px', borderRadius: '8px', background: '#EF4444', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '0.14em', boxShadow: '0 3px 0 #B91C1C' }}>
          THE 5 WHYS
        </div>
        <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', fontWeight: 600 }}>First-principles drill — each Why peels back a symptom to reveal the real cause</div>
      </div>

      <div style={{ borderRadius: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '24px', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0' }}>
          {FIVE_WHYS_CHAIN.map((w, i) => {
            const show = i < depth;
            const isLast = i === FIVE_WHYS_CHAIN.length - 1;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-start' }}>
                <AnimatePresence>
                  {show && (
                    <motion.div initial={{ opacity: 0, x: -14, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                      style={{ width: '100%', padding: '16px 18px', borderRadius: '14px', background: isLast ? `${w.color}12` : 'var(--ed-card)', border: `1.5px solid ${w.color}40`, borderLeft: `4px solid ${w.color}`, marginBottom: !isLast ? '0' : '0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: w.color, letterSpacing: '0.14em' }}>
                          {isLast ? '🎯 ROOT CAUSE' : `WHY ${w.layer} — ${w.type.toUpperCase()}`}
                        </div>
                        <div style={{ width: '24px', height: '24px', borderRadius: '8px', background: w.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: '11px', fontWeight: 900, color: '#fff', flexShrink: 0, boxShadow: `0 3px 0 ${w.dark}` }}>
                          {w.layer}
                        </div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: isLast ? 900 : 700, color: isLast ? w.color : 'var(--ed-ink)', marginBottom: '5px', lineHeight: 1.35 }}>{w.observation}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.6, fontStyle: 'italic' }}>{w.note}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!isLast && show && i < depth - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 18px' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: FIVE_WHYS_CHAIN[i + 1]?.color ?? '#6366F1', letterSpacing: '0.12em' }}>→ WHY?</div>
                    <div style={{ flex: 1, height: '1px', background: 'var(--ed-rule)' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {depth >= FIVE_WHYS_CHAIN.length && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ marginTop: '16px', padding: '14px 18px', borderRadius: '14px', background: 'rgba(34,197,94,0.08)', border: '1.5px solid rgba(34,197,94,0.3)', fontSize: '13px', fontWeight: 700, color: '#22C55E', lineHeight: 1.6 }}>
            ✓ Root cause found. Now rebuild the solution from the ground up — not from the symptom.
          </motion.div>
        )}
      </div>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#EF4444' }}>First-principles rule:</strong> when you find the root cause, delete everything between it and your proposed solution. Rebuild from the root — not from the symptom. The solution to a missing question is asking the question, not redesigning the onboarding.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── TAM ESTIMATION ───────────────────────────────────────────────────────────
// Back-of-envelope estimation: how to make fast, defensible market size estimates.
// Interactive Fermi problem: "How big is EdSpark's TAM in India?"
// Teaches: PMs who can size a market quickly earn credibility in boardrooms.

export function TAMEstimationViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const [inputs, setInputs] = useState({
    companies: 50000,
    salesTeamPct: 35,
    coachingMaturePct: 25,
    willPayPct: 40,
    avgARR: 12000,
  });
  const [revealed, setRevealed] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setRevealed(0);
    [0,1,2,3,4].forEach(i => setTimeout(() => setRevealed(i + 1), 400 + i * 600));
  }, [inView, tick]);

  const steps = [
    { label: 'Mid-market companies in India', value: inputs.companies, unit: 'companies', key: 'companies' as const, min: 20000, max: 150000, step: 5000, rationale: 'Companies with 100–500 employees in India with an organised sales function.' },
    { label: 'Have an active sales team', value: inputs.salesTeamPct, unit: '%', key: 'salesTeamPct' as const, min: 15, max: 60, step: 5, rationale: 'Not all mid-market companies have a structured outbound/inside sales team. Many are distribution or service businesses.' },
    { label: 'Have coaching maturity', value: inputs.coachingMaturePct, unit: '%', key: 'coachingMaturePct' as const, min: 10, max: 50, step: 5, rationale: 'Companies where a manager actively reviews rep performance and wants to improve it — not just track headcount.' },
    { label: 'Would pay for a tool', value: inputs.willPayPct, unit: '%', key: 'willPayPct' as const, min: 20, max: 70, step: 5, rationale: 'Of coaching-mature companies, those with budget and willingness to move away from spreadsheets + calls.' },
    { label: 'Average annual contract value', value: inputs.avgARR, unit: '₹/yr', key: 'avgARR' as const, min: 5000, max: 50000, step: 1000, rationale: 'Mid-market pricing. Enough to justify a sales motion but below enterprise procurement thresholds.' },
  ];

  const tam = Math.round(
    inputs.companies *
    (inputs.salesTeamPct / 100) *
    (inputs.coachingMaturePct / 100) *
    (inputs.willPayPct / 100) *
    inputs.avgARR / 10000000
  );

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ padding: '4px 12px', borderRadius: '8px', background: '#F97316', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '0.14em', boxShadow: '0 3px 0 #C2410C' }}>
          TAM ESTIMATION
        </div>
        <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', fontWeight: 600 }}>Back-of-envelope: EdSpark&apos;s total addressable market in India</div>
      </div>

      <div style={{ borderRadius: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '28px', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '28px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
            {steps.map((s, i) => (
              <AnimatePresence key={s.key}>
                {i < revealed && (
                  <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'flex-end' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '2px' }}>{s.label}</div>
                        <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontStyle: 'italic' }}>{s.rationale}</div>
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 900, color: '#F97316', flexShrink: 0, marginLeft: '12px' }}>
                        {s.value.toLocaleString()}{s.unit !== 'companies' && s.unit !== '₹/yr' ? '%' : s.unit === '₹/yr' ? ' ₹' : ''}
                      </div>
                    </div>
                    <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                      onChange={e => setInputs(prev => ({ ...prev, [s.key]: Number(e.target.value) }))}
                      style={{ width: '100%', accentColor: '#F97316', cursor: 'pointer' }} />
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>

          <motion.div animate={{ opacity: revealed >= 5 ? 1 : 0.3 }} transition={{ duration: 0.5 }}
            style={{ padding: '20px', borderRadius: '18px', background: 'linear-gradient(160deg, #F97316 0%, #C2410C 100%)', boxShadow: '0 6px 0 #9A3412, 0 10px 0 rgba(0,0,0,0.1), 0 20px 40px rgba(249,115,22,0.45)', textAlign: 'center' as const }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.18em', marginBottom: '10px' }}>ESTIMATED TAM</div>
            <div style={{ fontFamily: 'monospace', fontSize: '36px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1, marginBottom: '6px' }}>₹{tam}Cr</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '14px' }}>per year</div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.25)', marginBottom: '14px' }} />
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, fontStyle: 'italic' }}>
              Adjust assumptions to stress-test. The number matters less than the defensibility of each assumption.
            </div>
          </motion.div>
        </div>
      </div>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#F97316' }}>The skill is in the assumptions, not the arithmetic.</strong> A TAM estimate is only as good as the reasoning behind each number. Walk through every assumption in the room — that&apos;s what earns credibility, not the final figure.
      </div>
    </div>
  );
}

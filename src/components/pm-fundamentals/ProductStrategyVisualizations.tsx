'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// ─── Shared helpers ────────────────────────────────────────────────────────────
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
// Claymorphism card helper
const clay = (color: string, dark: string, glow: string, extra?: React.CSSProperties): React.CSSProperties => ({
  background: `linear-gradient(160deg, ${color}EE 0%, ${color} 55%, ${dark} 100%)`,
  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4), 0 6px 0 ${dark}, 0 10px 0 rgba(0,0,0,0.12), 0 18px 36px ${glow}`,
  borderRadius: '18px',
  ...extra,
});

// ─── 1. SYSTEMS THINKING RIPPLE ───────────────────────────────────────────────
// A stone dropped in still water. Each ripple ring = one order of product effect.
// Teaches: product decisions create 1st, 2nd, 3rd order consequences you didn't plan for.

const RIPPLE_EFFECTS = [
  {
    order: '1st order', color: '#22C55E', glow: 'rgba(34,197,94,0.5)',
    title: 'Onboarding completion: 40% → 72%',
    desc: 'The activation fix works. More users reach the core product.',
  },
  {
    order: '2nd order', color: '#F59E0B', glow: 'rgba(245,158,11,0.5)',
    title: 'CRM sync breaks for 20% of Salesforce orgs',
    desc: 'More users hitting CRM sync surfaces an untested edge case. Dev discovers it mid-sprint.',
  },
  {
    order: '3rd order', color: '#EF4444', glow: 'rgba(239,68,68,0.5)',
    title: 'Enterprise deal delayed 6 weeks',
    desc: 'Two enterprise prospects pause. CRM reliability is their non-negotiable. The Salesforce bet needs hardening before close.',
  },
];

export function SystemsThinkingRipple() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [stage, setStage] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setStage(0);
    const ts = [
      setTimeout(() => setStage(1), 600),
      setTimeout(() => setStage(2), 1800),
      setTimeout(() => setStage(3), 3200),
      setTimeout(() => setStage(4), 4600),
    ];
    return () => ts.forEach(clearTimeout);
  }, [inView, tick]);

  const replay = () => { setStage(0); setTick(t => t + 1); };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Systems thinking — every decision sends ripples you didn't plan for</VizLabel>

      <div style={{
        borderRadius: '24px', overflow: 'hidden',
        background: 'linear-gradient(170deg, #0D1B2A 0%, #0A2540 60%, #0D1B2A 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 24px 56px rgba(0,0,0,0.35)',
        padding: '36px 28px',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>

          {/* Left: ripple diagram */}
          <div style={{ position: 'relative', aspectRatio: '1' }}>
            <svg viewBox="0 0 300 300" style={{ width: '100%', height: '100%' }}>
              <defs>
                {RIPPLE_EFFECTS.map((r, i) => (
                  <radialGradient key={i} id={`ripGrad${i}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={r.color} stopOpacity="0.12" />
                    <stop offset="100%" stopColor={r.color} stopOpacity="0" />
                  </radialGradient>
                ))}
              </defs>

              {/* Ripple rings — outermost first */}
              {RIPPLE_EFFECTS.map((r, i) => {
                const radius = 118 - i * 36;
                const show = stage >= 4 - i;
                return (
                  <motion.circle key={i} cx="150" cy="150" r={radius}
                    fill={`url(#ripGrad${i})`}
                    stroke={r.color} strokeWidth="2.5" strokeDasharray="6 4"
                    initial={{ opacity: 0, scale: 0.2 }} animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.2 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  />
                );
              })}

              {/* Drop point glow */}
              {stage >= 1 && (
                <motion.circle cx="150" cy="150" r="14" fill="#6366F1"
                  initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.6 }}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(99,102,241,0.8))' }}
                />
              )}
              {stage >= 1 && (
                <text x="150" y="155" textAnchor="middle" dominantBaseline="middle"
                  style={{ fontSize: '8px', fill: 'white', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.1em' }}>
                  DECISION
                </text>
              )}

              {/* Order labels on rings */}
              {RIPPLE_EFFECTS.map((r, i) => {
                const radius = 118 - i * 36;
                const show = stage >= 4 - i;
                if (!show) return null;
                return (
                  <motion.text key={i} x={150 + radius - 2} y={148}
                    textAnchor="start" dominantBaseline="middle"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    style={{ fontSize: '8px', fill: r.color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.1em' }}>
                    {r.order.toUpperCase()}
                  </motion.text>
                );
              })}
            </svg>
          </div>

          {/* Right: sequential effect cards */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
            {stage < 1 && (
              <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', fontStyle: 'italic', textAlign: 'center' as const, padding: '40px 0' }}>
                Decision drops in 1 second…
              </div>
            )}
            {RIPPLE_EFFECTS.map((r, i) => (
              <AnimatePresence key={i}>
                {stage >= i + 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                    style={{
                      padding: '14px 16px', borderRadius: '14px',
                      background: `${r.color}18`,
                      border: `1.5px solid ${r.color}45`,
                      borderLeft: `4px solid ${r.color}`,
                    }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: r.color, letterSpacing: '0.14em', marginBottom: '6px' }}>
                      {r.order.toUpperCase()} EFFECT
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '5px', lineHeight: 1.35 }}>{r.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{r.desc}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '14px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#EF4444' }}>The trap:</strong> First-order thinking asks "what happens next?" Strategic thinking asks "what happens after that — and after that?" Map the 3rd order before you commit the sprint.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 2. COMPETITIVE MOAT RADAR ────────────────────────────────────────────────
// Radar chart comparing EdSpark vs Gong across 4 moat types.
// Each axis animates in separately. EdSpark's only real edge = switching costs.
// Teaches: find the ONE moat you can own, not the one you wish you had.

const MOAT_AXES = [
  { label: 'Network Effects', gong: 82, edspark: 28, angle: -90, desc: 'Gong has 100k+ seats; more data = smarter AI. EdSpark\'s coaching insights don\'t compound across orgs.' },
  { label: 'Switching Costs', gong: 44, edspark: 78, angle: 0, desc: 'EdSpark\'s CRM depth creates painful migration. Gong is pluggable — easy to leave.' },
  { label: 'Cost Advantage', gong: 55, edspark: 38, angle: 90, desc: 'Neither company has a structural cost edge. Infrastructure costs are broadly similar at this scale.' },
  { label: 'Data / AI Moat', gong: 76, edspark: 32, angle: 180, desc: 'Gong\'s call AI is trained on billions of minutes. EdSpark is 24 months behind on training data volume.' },
];

function moatPoint(val: number, angle: number, maxR: number) {
  const r = (val / 100) * maxR;
  const rad = (angle - 90) * Math.PI / 180;
  return { x: 150 + r * Math.cos(rad), y: 150 + r * Math.sin(rad) };
}

export function CompetitiveMoatRadar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visibleAxes, setVisibleAxes] = useState(0);
  const [showGong, setShowGong] = useState(false);
  const [showEds, setShowEds] = useState(false);
  const [activeAxis, setActiveAxis] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const MAX_R = 100;

  useEffect(() => {
    if (!inView) return;
    setVisibleAxes(0); setShowGong(false); setShowEds(false);
    const ts = [
      setTimeout(() => setVisibleAxes(1), 400),
      setTimeout(() => setVisibleAxes(2), 900),
      setTimeout(() => setVisibleAxes(3), 1400),
      setTimeout(() => setVisibleAxes(4), 1900),
      setTimeout(() => setShowGong(true), 2600),
      setTimeout(() => setShowEds(true), 3600),
    ];
    return () => ts.forEach(clearTimeout);
  }, [inView, tick]);

  const replay = () => { setVisibleAxes(0); setShowGong(false); setShowEds(false); setTick(t => t + 1); };

  const gongPts = MOAT_AXES.map(a => moatPoint(a.gong, a.angle, MAX_R));
  const edsPts = MOAT_AXES.map(a => moatPoint(a.edspark, a.angle, MAX_R));
  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Competitive moat analysis — find the one moat you can actually own</VizLabel>

      <div style={{
        borderRadius: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)',
        padding: '28px', boxShadow: '0 16px 40px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'center' }}>

          {/* Radar */}
          <div style={{ position: 'relative' }}>
            <svg viewBox="0 0 300 300" style={{ width: '100%' }}>
              {/* Grid circles */}
              {[25, 50, 75, 100].map(r => (
                <circle key={r} cx="150" cy="150" r={r} fill="none" stroke="var(--ed-rule)" strokeWidth="1" strokeDasharray="3 3" />
              ))}
              {/* Axes */}
              {MOAT_AXES.slice(0, visibleAxes).map((a, i) => {
                const end = moatPoint(100, a.angle, MAX_R);
                const labelPt = moatPoint(115, a.angle, MAX_R);
                return (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <line x1="150" y1="150" x2={end.x} y2={end.y} stroke="var(--ed-rule)" strokeWidth="1.5" />
                    <text x={labelPt.x} y={labelPt.y} textAnchor="middle" dominantBaseline="middle"
                      style={{ fontSize: '8.5px', fill: 'var(--ed-ink3)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, cursor: 'pointer' }}
                      onClick={() => setActiveAxis(activeAxis === i ? null : i)}>
                      {a.label}
                    </text>
                  </motion.g>
                );
              })}
              {/* Gong shape */}
              {showGong && visibleAxes === 4 && (
                <motion.path d={toPath(gongPts)} fill="rgba(139,92,246,0.25)" stroke="#8B5CF6" strokeWidth="2.5"
                  initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ transformOrigin: '150px 150px' }}
                  transition={{ type: 'spring', stiffness: 120, damping: 16 }} />
              )}
              {/* EdSpark shape */}
              {showEds && visibleAxes === 4 && (
                <motion.path d={toPath(edsPts)} fill="rgba(20,184,166,0.3)" stroke="#14B8A6" strokeWidth="2.5"
                  initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ transformOrigin: '150px 150px' }}
                  transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.2 }} />
              )}
              {/* Data points */}
              {showEds && MOAT_AXES.map((a, i) => {
                const pt = edsPts[i];
                return <circle key={i} cx={pt.x} cy={pt.y} r="5" fill="#14B8A6" stroke="white" strokeWidth="1.5"
                  style={{ cursor: 'pointer' }} onClick={() => setActiveAxis(activeAxis === i ? null : i)} />;
              })}
              {showGong && MOAT_AXES.map((a, i) => {
                const pt = gongPts[i];
                return <circle key={i} cx={pt.x} cy={pt.y} r="5" fill="#8B5CF6" stroke="white" strokeWidth="1.5" />;
              })}
            </svg>
            {/* Legend */}
            {showEds && (
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '8px' }}>
                {[{ color: '#8B5CF6', label: 'Gong.io' }, { color: '#14B8A6', label: 'EdSpark' }].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: l.color }} />
                    <span style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Insight panel */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
            <AnimatePresence mode="wait">
              {activeAxis !== null ? (
                <motion.div key={`axis-${activeAxis}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ padding: '18px 16px', borderRadius: '16px', background: '#14B8A618', border: '1.5px solid #14B8A640', borderLeft: '4px solid #14B8A6' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#14B8A6', letterSpacing: '0.14em', marginBottom: '6px' }}>{MOAT_AXES[activeAxis].label.toUpperCase()}</div>
                  <div style={{ display: 'flex', gap: '14px', marginBottom: '10px' }}>
                    <div><div style={{ fontFamily: 'monospace', fontSize: '22px', fontWeight: 900, color: '#8B5CF6' }}>{MOAT_AXES[activeAxis].gong}</div><div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>Gong</div></div>
                    <div><div style={{ fontFamily: 'monospace', fontSize: '22px', fontWeight: 900, color: '#14B8A6' }}>{MOAT_AXES[activeAxis].edspark}</div><div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>EdSpark</div></div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{MOAT_AXES[activeAxis].desc}</div>
                </motion.div>
              ) : (
                <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ padding: '18px 16px', borderRadius: '16px', background: 'rgba(20,184,166,0.08)', border: '1.5px solid rgba(20,184,166,0.25)', borderLeft: '4px solid #14B8A6', marginBottom: '12px' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#14B8A6', letterSpacing: '0.14em', marginBottom: '6px' }}>EDSPARK'S ONLY STRUCTURAL ADVANTAGE</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.5 }}>CRM depth creates a migration cost Gong can't easily match in the mid-market.</div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', fontStyle: 'italic', lineHeight: 1.65 }}>Click any axis to understand each moat dimension.</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '14px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#8B5CF6' }}>Moat-building rule:</strong> Don&apos;t build the moat you wish you had. Build deeper in the one where leaving is already painful. EdSpark&apos;s edge is switching costs — every feature should compound that, not spread thin.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 3. BET SEQUENCING STAIRCASE ──────────────────────────────────────────────
// Three bets as staircase steps. Each completed step unlocks the next.
// Shows what happens with sequential vs parallel approach.
// Teaches: sequence creates momentum. Parallelism splits resources and kills signal.

const BETS = [
  { label: 'Fix Onboarding', sub: 'Activation 40% → 72%', color: '#22C55E', dark: '#15803D', glow: 'rgba(34,197,94,0.5)', unlock: 'Generates clean cohort data for analytics.' },
  { label: 'Analytics Dashboard', sub: 'Prove coaching ROI', color: '#6366F1', dark: '#3730A3', glow: 'rgba(99,102,241,0.5)', unlock: 'Gives champions proof to unlock enterprise budgets.' },
  { label: 'Salesforce Integration', sub: 'Enterprise expansion', color: '#F97316', dark: '#C2410C', glow: 'rgba(249,115,22,0.5)', unlock: 'Series B narrative: from activation to enterprise land.' },
];

export function BetSequenceStaircase() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [mode, setMode] = useState<'sequential' | 'parallel'>('sequential');
  const [activeStep, setActiveStep] = useState(-1);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setActiveStep(-1);
    const ts = BETS.map((_, i) => setTimeout(() => setActiveStep(i), 600 + i * 1400));
    return () => ts.forEach(clearTimeout);
  }, [inView, tick, mode]);

  const replay = () => { setActiveStep(-1); setTick(t => t + 1); };

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Bet sequencing — each completed bet creates conditions for the next</VizLabel>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {(['sequential', 'parallel'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); replay(); }}
            style={{
              padding: '8px 18px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
              background: mode === m ? (m === 'sequential' ? '#22C55E' : '#EF4444') : 'var(--ed-card)',
              color: mode === m ? '#fff' : 'var(--ed-ink3)',
              border: `1.5px solid ${mode === m ? 'transparent' : 'var(--ed-rule)'}`,
              boxShadow: mode === m ? `0 4px 0 ${m === 'sequential' ? '#15803D' : '#B91C1C'}, 0 8px 16px ${m === 'sequential' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` : 'none',
              transition: 'all 0.25s',
            }}>
            {m === 'sequential' ? '✓ Sequential (smart)' : '✕ Parallel (trap)'}
          </button>
        ))}
      </div>

      <div style={{
        borderRadius: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)',
        padding: '32px 28px', boxShadow: '0 16px 40px rgba(0,0,0,0.07)',
        perspective: '800px',
      }}>
        {mode === 'sequential' ? (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0' }}>
            {BETS.map((bet, i) => {
              const isActive = activeStep >= i;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: i < BETS.length - 1 ? '0' : '0' }}>
                  {/* Left: step indicator with connector */}
                  <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', flexShrink: 0 }}>
                    <motion.div
                      animate={{ background: isActive ? bet.color : 'var(--ed-rule)', boxShadow: isActive ? `0 4px 0 ${bet.dark}, 0 8px 16px ${bet.glow}` : 'none' }}
                      transition={{ duration: 0.4 }}
                      style={{ width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 900, color: isActive ? 'white' : 'var(--ed-ink3)', fontFamily: 'monospace', transition: 'color 0.4s' }}>
                      {isActive ? '✓' : `0${i + 1}`}
                    </motion.div>
                    {i < BETS.length - 1 && (
                      <div style={{ width: '2px', height: '32px', background: isActive && activeStep > i ? bet.color : 'var(--ed-rule)', transition: 'background 0.5s 0.3s' }} />
                    )}
                  </div>
                  {/* Right: bet card */}
                  <motion.div
                    animate={{ opacity: isActive ? 1 : 0.4, x: isActive ? 0 : 12 }}
                    transition={{ duration: 0.45, type: 'spring', stiffness: 280, damping: 22 }}
                    style={{ flex: 1, marginBottom: i < BETS.length - 1 ? '32px' : '0' }}>
                    <div style={{
                      padding: '16px 18px', borderRadius: '14px',
                      background: isActive ? `${bet.color}14` : 'transparent',
                      border: `1.5px solid ${isActive ? bet.color + '40' : 'var(--ed-rule)'}`,
                      borderLeft: isActive ? `4px solid ${bet.color}` : '1.5px solid var(--ed-rule)',
                      transition: 'all 0.4s',
                    }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: isActive ? bet.color : 'var(--ed-ink2)', marginBottom: '4px', transition: 'color 0.4s' }}>{bet.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginBottom: isActive && activeStep > i ? '8px' : '0' }}>{bet.sub}</div>
                      <AnimatePresence>
                        {isActive && activeStep > i && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            style={{ fontSize: '12px', color: BETS[i + 1]?.color ?? bet.color, fontWeight: 600, lineHeight: 1.55, overflow: 'hidden' }}>
                            → {bet.unlock}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Parallel mode — all three fail */
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
            <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.3)', marginBottom: '8px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#EF4444', letterSpacing: '0.14em', marginBottom: '6px' }}>⚠ 12 ENGINEER-WEEKS SPLIT 3 WAYS</div>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.6 }}>4 weeks each. Not enough to ship any of them well. All three stall. No signal. No momentum.</div>
            </div>
            {BETS.map((bet, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}
                style={{ padding: '14px 16px', borderRadius: '14px', background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.25)', opacity: 0.8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ed-ink2)', marginBottom: '3px' }}>{bet.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>{bet.sub}</div>
                  </div>
                  <div style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', fontSize: '11px', fontWeight: 800, color: '#EF4444', fontFamily: 'monospace' }}>4wk — stalled</div>
                </div>
              </motion.div>
            ))}
            <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: '12px', color: '#EF4444', fontWeight: 700, lineHeight: 1.6, marginTop: '4px' }}>
              Result: 12 weeks burned, zero shipped, no retention data, Series B story weakened.
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '14px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#22C55E' }}>Sequencing rule:</strong> Fix structural leaks before growth bets. Under-resourced bets fail more than delayed bets. Each step should generate the evidence and conditions the next step needs.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 4. PORTFOLIO CASCADE VIZ (Track 2) ──────────────────────────────────────
// Horizontal timeline. Toggle Meridian Corp bet on/off.
// Teaches: adding one bet cascades delays across the whole portfolio — visible cost.

const BASE_BETS = [
  { label: 'Forecasting', weeks: 8, color: '#6366F1', dark: '#3730A3', impact: '90+ customers waiting on this', delay: 8 },
  { label: 'Analytics v2', weeks: 6, color: '#0EA5E9', dark: '#0369A1', impact: 'Board deck delayed', delay: 3 },
  { label: 'Mobile Access', weeks: 7, color: '#22C55E', dark: '#15803D', impact: 'Enterprise access pushed to Q3', delay: 5 },
];

export function PortfolioCascadeViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [meridianOn, setMeridianOn] = useState(false);
  const [activeDelay, setActiveDelay] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setMeridianOn(true), 1200);
    return () => clearTimeout(t);
  }, [inView, tick]);

  const replay = () => { setMeridianOn(false); setTick(t => t + 1); };
  const totalDelay = BASE_BETS.reduce((s, b) => s + b.delay, 0);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Portfolio cascade — adding one bet shifts everything downstream</VizLabel>

      <div style={{ borderRadius: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '28px', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}>
        {/* Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '2px' }}>Meridian Corp custom work</div>
            <div style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>$240K ARR · 2 engineers × 10 weeks</div>
          </div>
          <button onClick={() => setMeridianOn(m => !m)}
            style={{
              padding: '9px 20px', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: 800,
              background: meridianOn ? '#EF4444' : 'rgba(34,197,94,0.1)',
              color: meridianOn ? '#fff' : '#22C55E',
              border: `1.5px solid ${meridianOn ? '#EF4444' : '#22C55E40'}`,
              boxShadow: meridianOn ? '0 4px 0 #B91C1C, 0 8px 16px rgba(239,68,68,0.3)' : 'none',
              transition: 'all 0.3s',
            }}>
            {meridianOn ? '✕ Remove from Q2' : '+ Add to Q2'}
          </button>
        </div>

        {/* Meridian row */}
        <AnimatePresence>
          {meridianOn && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ marginBottom: '16px', padding: '14px 16px', borderRadius: '14px', background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.35)', borderLeft: '4px solid #EF4444', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#EF4444', letterSpacing: '0.12em', marginBottom: '4px' }}>ADDED TO Q2</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#EF4444' }}>Meridian Corp Custom Work</div>
                </div>
                <div style={{ padding: '4px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.15)', fontSize: '12px', fontWeight: 800, color: '#EF4444', fontFamily: 'monospace' }}>10 weeks</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Portfolio bets */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          {BASE_BETS.map((bet, i) => {
            const slipped = meridianOn;
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '12px', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ed-ink2)' }}>{bet.label}</div>
                <div style={{ position: 'relative', height: '32px', borderRadius: '8px', background: 'var(--ed-rule)', overflow: 'visible' }}>
                  {/* Base block */}
                  <motion.div
                    animate={{ width: `${(bet.weeks / 14) * 100}%` }}
                    style={{ height: '100%', borderRadius: '8px', background: `linear-gradient(90deg, ${bet.color} 0%, ${bet.dark} 100%)`, boxShadow: `0 3px 0 ${bet.dark}` }} />
                  {/* Delay extension */}
                  {slipped && (
                    <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: `${(bet.delay / 14) * 100}%`, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 120, damping: 20, delay: i * 0.15 }}
                      style={{
                        position: 'absolute', top: 0, left: `${(bet.weeks / 14) * 100}%`, height: '100%',
                        borderRadius: '0 8px 8px 0', background: 'rgba(239,68,68,0.35)',
                        border: '1.5px dashed rgba(239,68,68,0.6)', cursor: 'pointer',
                      }}
                      onClick={() => setActiveDelay(activeDelay === i ? null : i)}>
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '10px', fontWeight: 800, color: '#EF4444', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                        +{bet.delay}wk
                      </div>
                    </motion.div>
                  )}
                </div>
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: slipped ? '#EF4444' : bet.color, fontWeight: 700, width: '60px', textAlign: 'right' as const }}>
                  {bet.weeks}{slipped ? `+${bet.delay}` : ''}wk
                </div>
              </div>
            );
          })}
        </div>

        {/* Delay detail */}
        <AnimatePresence>
          {activeDelay !== null && meridianOn && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', fontSize: '12px', color: '#EF4444', fontWeight: 600, lineHeight: 1.65 }}>
              <strong>Impact of +{BASE_BETS[activeDelay].delay} week delay:</strong> {BASE_BETS[activeDelay].impact}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary */}
        {meridianOn && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            style={{ marginTop: '18px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', fontSize: '13px', color: '#EF4444', fontWeight: 700, lineHeight: 1.6 }}>
            Meridian consumes 2/4 engineers for 10 weeks. The cascade = <strong>{totalDelay} weeks</strong> of total delay across {BASE_BETS.length} bets serving 190+ accounts. Toggle off to see the cost disappear.
          </motion.div>
        )}
      </div>

      <div style={{ marginTop: '14px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>The cascade rule:</strong> Name every downstream consequence before you commit. The customers complaining loudest shape the roadmap. The customers leaving quietly reveal your real strategy problem.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 5. KILL CRITERIA VAULT (Track 2) ─────────────────────────────────────────
// PM pre-commits 5 kill criteria before shipping. 6 months later vault opens.
// Criteria checked against real data. Sunk cost is struck through.
// Teaches: kill criteria are about future value, not past investment.

const KILL_CRITERIA = [
  { label: 'ICP Fit', question: 'Does it serve core sales managers — not a secondary persona?', verdict: false, data: '68% of users are ops/CS, not the core ICP. The feature is attracting the wrong buyer.' },
  { label: 'Willingness-to-Pay', question: '3+ customers confirmed willingness to pay above baseline?', verdict: false, data: '12 interviews. Zero confirmed they\'d pay more for it. One said they expected it as a "free upgrade."' },
  { label: 'Defensibility', question: 'Does it create switching costs Gong can\'t copy in 6 months?', verdict: false, data: 'Gong shipped an identical feature 10 days after EdSpark launched. No structural moat.' },
  { label: 'Opportunity Cost', question: 'Is this the best use of 6 remaining engineer-weeks?', verdict: false, data: 'Forecasting (90+ customers waiting) would generate 4× ARR impact per engineer-week.' },
  { label: 'Usage Signal', question: 'Are users who adopt it retaining at higher rates (causal, not correlation)?', verdict: true, data: 'Controlled cohort confirms causation. Users with 5+ uses retain at 81% vs 52%. This signal is real.' },
];

export function KillCriteriaVault() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [phase, setPhase] = useState<'locked' | 'unlocking' | 'checking' | 'done'>('locked');
  const [checkedCount, setCheckedCount] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setPhase('locked'); setCheckedCount(0);
    const ts = [
      setTimeout(() => setPhase('unlocking'), 800),
      setTimeout(() => setPhase('checking'), 2000),
      ...KILL_CRITERIA.map((_, i) => setTimeout(() => setCheckedCount(i + 1), 2600 + i * 700)),
      setTimeout(() => setPhase('done'), 2600 + KILL_CRITERIA.length * 700 + 300),
    ];
    return () => ts.forEach(clearTimeout);
  }, [inView, tick]);

  const replay = () => { setPhase('locked'); setCheckedCount(0); setTick(t => t + 1); };
  const passed = KILL_CRITERIA.filter(c => c.verdict).length;
  const failed = KILL_CRITERIA.filter(c => !c.verdict).length;

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Kill criteria vault — pre-commit before shipping, check after</VizLabel>

      <div style={{ borderRadius: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '28px', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}>
        {/* Phase header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px', padding: '14px 18px', borderRadius: '14px', background: phase === 'done' ? (failed >= 3 ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)') : 'rgba(99,102,241,0.08)', border: `1.5px solid ${phase === 'done' ? (failed >= 3 ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)') : 'rgba(99,102,241,0.2)'}` }}>
          <div style={{ fontSize: '28px' }}>
            {phase === 'locked' ? '🔒' : phase === 'unlocking' ? '🔓' : phase === 'checking' ? '⚖️' : failed >= 3 ? '🛑' : '✅'}
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.14em', marginBottom: '3px' }}>
              {phase === 'locked' ? 'PRE-LAUNCH · CRITERIA SEALED' : phase === 'unlocking' ? '6 MONTHS LATER · OPENING VAULT' : phase === 'checking' ? 'CHECKING CRITERIA AGAINST REAL DATA' : failed >= 3 ? 'VERDICT · KILL' : 'VERDICT · CONTINUE'}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)' }}>
              {phase === 'locked' ? 'AI Call Summarization — kill criteria locked in before Sprint 1.' : phase === 'unlocking' ? '60% built. 6 weeks remain. Time to check the vault.' : phase === 'checking' ? `Checking ${checkedCount} of ${KILL_CRITERIA.length} criteria…` : `${passed} passed · ${failed} failed · ${failed >= 3 ? 'Reallocate remaining 6 weeks to Forecasting.' : 'Marginal — discuss with team.'}`}
            </div>
          </div>
        </div>

        {/* Criteria cards */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
          {KILL_CRITERIA.map((c, i) => {
            const checked = i < checkedCount;
            const color = checked ? (c.verdict ? '#22C55E' : '#EF4444') : '#6366F1';
            return (
              <motion.div key={i}
                animate={{ opacity: phase === 'locked' ? 0.5 : 1 }}
                style={{ padding: '14px 16px', borderRadius: '14px', background: checked ? `${color}10` : 'var(--ed-card)', border: `1.5px solid ${checked ? color + '40' : 'var(--ed-rule)'}`, borderLeft: `4px solid ${checked ? color : 'var(--ed-rule)'}`, transition: 'all 0.4s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color, letterSpacing: '0.12em' }}>{c.label.toUpperCase()}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.6, marginBottom: checked ? '8px' : '0' }}>{c.question}</div>
                    {checked && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        style={{ fontSize: '11px', color: c.verdict ? '#22C55E' : '#EF4444', lineHeight: 1.55, fontWeight: 600, overflow: 'hidden' }}>
                        {c.data}
                      </motion.div>
                    )}
                  </div>
                  <div style={{ flexShrink: 0, width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: checked ? `${color}20` : 'var(--ed-rule)', fontSize: '14px', transition: 'all 0.3s' }}>
                    {checked ? (c.verdict ? '✓' : '✕') : '—'}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sunk cost strike-through */}
        {phase === 'done' && failed >= 3 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ marginTop: '18px', padding: '14px 18px', borderRadius: '14px', background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.3)', borderLeft: '4px solid #EF4444' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#EF4444', letterSpacing: '0.14em', marginBottom: '8px' }}>SUNK COST ARGUMENT</div>
            <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', textDecoration: 'line-through', opacity: 0.55, marginBottom: '8px' }}>
              "We're 60% done. It would be a waste to stop now."
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#EF4444', lineHeight: 1.6 }}>
              The 60% is gone regardless. The question is: what should the remaining 6 weeks do? They earn their keep by shipping Forecasting — not finishing something that fails 4 of 5 criteria.
            </div>
          </motion.div>
        )}
      </div>

      <div style={{ marginTop: '14px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#6366F1' }}>Kill criteria rule:</strong> Write them before the sprint starts, when you&apos;re emotionally unattached. &ldquo;We will kill this if X, Y, Z.&rdquo; When the data comes in, the framework decides — not sunk cost.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

// ─── 6. LAND AND EXPAND NETWORK (Track 1) ─────────────────────────────────────
// Company org chart. EdSpark lands in Sales team, then product proof
// spreads organically to adjacent teams. Teaches: expansion is product strategy.

const TEAMS = [
  { id: 'sales',    label: 'Sales',           x: 50, y: 50,  color: '#22C55E', dark: '#15803D', status: 'landed',  proof: 'Landed ✓' },
  { id: 'cs',       label: 'Customer\nSuccess', x: 78, y: 32, color: '#6366F1', dark: '#3730A3', status: 'locked',  proof: '10+ DAU + win story' },
  { id: 'mktg',     label: 'Marketing',        x: 78, y: 68, color: '#0EA5E9', dark: '#0369A1', status: 'locked',  proof: '10+ DAU + ROI metric' },
  { id: 'ops',      label: 'Revenue\nOps',     x: 22, y: 32, color: '#F59E0B', dark: '#D97706', status: 'locked',  proof: 'Champion referral' },
  { id: 'finance',  label: 'Finance',          x: 22, y: 68, color: '#EF4444', dark: '#B91C1C', status: 'locked',  proof: 'VP sponsor required' },
  { id: 'leadership', label: 'Leadership',     x: 50, y: 12, color: '#8B5CF6', dark: '#6D28D9', status: 'locked',  proof: 'NPS 9+ + expansion ARR' },
];

const EDGES = [
  ['sales', 'cs'], ['sales', 'mktg'], ['sales', 'ops'], ['sales', 'finance'], ['sales', 'leadership'],
];

export function LandExpandNetwork() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [unlockedCount, setUnlockedCount] = useState(1); // sales is always unlocked
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setUnlockedCount(1);
    const ts = TEAMS.slice(1).map((_, i) => setTimeout(() => setUnlockedCount(i + 2), 1200 + i * 1400));
    return () => ts.forEach(clearTimeout);
  }, [inView, tick]);

  const replay = () => { setUnlockedCount(1); setTick(t => t + 1); };

  const totalSeats = 120;
  const seatsWon = Math.round((unlockedCount / TEAMS.length) * totalSeats);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <VizLabel>Land-and-expand — proof unlocks adjacent teams. This is product strategy, not sales.</VizLabel>

      <div style={{ borderRadius: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '28px', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '24px', alignItems: 'center' }}>

          {/* Network diagram */}
          <div style={{ position: 'relative', aspectRatio: '1' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {/* Edges */}
              {EDGES.map(([a, b], i) => {
                const ta = TEAMS.find(t => t.id === a)!;
                const tb = TEAMS.find(t => t.id === b)!;
                const bothUnlocked = TEAMS.findIndex(t => t.id === a) < unlockedCount && TEAMS.findIndex(t => t.id === b) < unlockedCount;
                return (
                  <motion.line key={i}
                    x1={ta.x} y1={ta.y} x2={tb.x} y2={tb.y}
                    stroke={bothUnlocked ? ta.color : 'var(--ed-rule)'}
                    strokeWidth={bothUnlocked ? '1.5' : '0.8'}
                    strokeDasharray={bothUnlocked ? '0' : '2 2'}
                    animate={{ stroke: bothUnlocked ? ta.color : '#CBD5E1' }}
                    transition={{ duration: 0.5 }}
                  />
                );
              })}
              {/* Team nodes */}
              {TEAMS.map((team, i) => {
                const isUnlocked = i < unlockedCount;
                return (
                  <motion.g key={team.id}
                    animate={{ opacity: isUnlocked ? 1 : 0.35 }}
                    transition={{ duration: 0.5 }}>
                    <motion.circle cx={team.x} cy={team.y} r="9"
                      animate={{
                        fill: isUnlocked ? team.color : '#CBD5E1',
                        filter: isUnlocked ? `drop-shadow(0 3px 6px ${team.color}60)` : 'none',
                      }}
                      transition={{ duration: 0.5 }} />
                    {isUnlocked && (
                      <motion.circle cx={team.x} cy={team.y} r="12"
                        fill="none" stroke={team.color} strokeWidth="1.5" strokeOpacity="0.35"
                        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4 }} />
                    )}
                    <text x={team.x} y={team.y + 16} textAnchor="middle"
                      style={{ fontSize: '5.5px', fontFamily: 'system-ui', fontWeight: 700, fill: isUnlocked ? team.color : '#94A3B8', whiteSpace: 'pre' }}>
                      {team.label.split('\n')[0]}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>

          {/* Right: proof progress */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
            {/* Seat counter */}
            <div style={{ padding: '14px 16px', borderRadius: '16px', background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.3)', marginBottom: '6px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#22C55E', letterSpacing: '0.14em', marginBottom: '4px' }}>APEX CORP EXPANSION</div>
              <div style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'monospace', color: '#22C55E' }}>{seatsWon}<span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--ed-ink3)' }}> / {totalSeats} seats</span></div>
            </div>
            {/* Team status list */}
            {TEAMS.map((team, i) => {
              const isUnlocked = i < unlockedCount;
              return (
                <div key={team.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: isUnlocked ? 1 : 0.45, transition: 'opacity 0.4s' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isUnlocked ? team.color : 'var(--ed-rule)', flexShrink: 0, transition: 'background 0.4s' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: isUnlocked ? 'var(--ed-ink)' : 'var(--ed-ink3)', transition: 'color 0.4s' }}>{team.label.replace('\n', ' ')}</div>
                    {!isUnlocked && <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', fontStyle: 'italic' }}>{team.proof}</div>}
                    {isUnlocked && i > 0 && <div style={{ fontSize: '9px', color: team.color, fontWeight: 700 }}>Unlocked ✓</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '14px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#22C55E' }}>Expansion rule:</strong> The first contract is an entrance exam, not the business. Locked teams reveal exactly which product bets to fund next. Expansion is driven by product proof — not the CS handoff.
      </div>
      <ReplayBtn onReplay={replay} />
    </div>
  );
}

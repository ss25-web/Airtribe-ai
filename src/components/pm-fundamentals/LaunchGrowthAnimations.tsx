'use client';

/**
 * LaunchGrowthAnimations — Module 08 visual teaching illustrations.
 * Auto-playing, non-interactive. Each animation teaches one concept
 * through movement before learners interact with the tool.
 *
 * 1. LaunchPipelineAnimation   — launch is a sequence of stages, not a moment
 * 2. AhaMomentFlowAnimation    — growth starts when users reach value, not acquisition
 * 3. GrowthFlywheelAnimation   — funnel stops; loops compound
 * 4. MonetizationLadderAnimation — pricing shapes who climbs and how far
 * 5. GTMMotionAnimation        — PLG vs Hybrid vs Sales-led side by side
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT = '#0D7A5A';

const AnimationShell = ({ title, caption, children }: {
  title: string; caption: string; children: React.ReactNode;
}) => (
  <div style={{ margin: '28px 0', borderRadius: '16px', overflow: 'hidden', background: 'var(--ed-card)', border: `1.5px solid ${ACCENT}25`, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
    <div style={{ padding: '10px 18px', background: `linear-gradient(135deg, ${ACCENT}18 0%, ${ACCENT}08 100%)`, borderBottom: `1px solid ${ACCENT}20`, display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, textTransform: 'uppercase' as const }}>3D Illustration</div>
      <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>· {title}</div>
    </div>
    <div style={{ padding: '28px 24px', background: `linear-gradient(160deg, rgba(13,122,90,0.04) 0%, rgba(13,122,90,0.02) 100%)`, minHeight: '200px' }}>
      {children}
    </div>
    <div style={{ padding: '10px 18px', borderTop: `1px solid ${ACCENT}15`, fontSize: '11px', color: 'var(--ed-ink3)', fontStyle: 'italic', lineHeight: 1.5 }}>
      {caption}
    </div>
  </div>
);

// ─────────────────────────────────────────
// 1 · LAUNCH PIPELINE
// ─────────────────────────────────────────
const PIPELINE_STAGES = [
  { label: 'Concept',        emoji: '📋', color: '#94a3b8', stakeholders: 'PM + Design',        gate: 'Hypothesis defined' },
  { label: 'MVP',            emoji: '⚡', color: '#3A86FF', stakeholders: 'PM + Eng + Design',   gate: 'Core value testable' },
  { label: 'Internal Beta',  emoji: '🔬', color: '#7843EE', stakeholders: 'Team only',            gate: 'Stable enough to use' },
  { label: 'Pilot',          emoji: '🎯', color: '#E67E22', stakeholders: 'Trusted accounts',     gate: 'Edge cases mapped' },
  { label: 'Phased Release', emoji: '🌊', color: '#0097A7', stakeholders: 'Segment + CS + Sales', gate: 'Support ready' },
  { label: 'Broad Launch',   emoji: '🚀', color: ACCENT,    stakeholders: 'All users + GTM',      gate: 'Full readiness' },
];

export function LaunchPipelineAnimation() {
  const [active, setActive] = useState(0);
  const [particlePos, setParticlePos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(a => {
        const next = (a + 1) % PIPELINE_STAGES.length;
        return next;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setParticlePos(active);
  }, [active]);

  return (
    <AnimationShell title="Launch Pipeline" caption="A product moves through distinct gates — each one proving readiness before the next stage expands exposure.">
      {/* Stage cards */}
      <div style={{ display: 'flex', gap: '0', alignItems: 'stretch', marginBottom: '20px' }}>
        {PIPELINE_STAGES.map((stage, i) => {
          const isPast = i < active;
          const isCurrent = i === active;
          return (
            <React.Fragment key={stage.label}>
              <motion.div
                animate={{ scale: isCurrent ? 1.04 : 1, opacity: isPast ? 0.55 : 1 }}
                transition={{ duration: 0.35 }}
                style={{ flex: 1, borderRadius: '12px', border: `2px solid ${isCurrent ? stage.color : isPast ? stage.color + '40' : 'var(--ed-rule)'}`, background: isCurrent ? `${stage.color}18` : isPast ? `${stage.color}08` : 'var(--ed-card)', padding: '12px 8px', textAlign: 'center' as const, boxShadow: isCurrent ? `0 4px 20px ${stage.color}35` : 'none', position: 'relative' as const, overflow: 'hidden', transition: 'border-color 0.3s, background 0.3s' }}>
                {isCurrent && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }}
                    style={{ position: 'absolute' as const, inset: 0, background: `radial-gradient(circle at center, ${stage.color}20 0%, transparent 70%)`, borderRadius: '10px' }} />
                )}
                <div style={{ fontSize: '22px', marginBottom: '6px' }}>{stage.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: '10px', color: isCurrent ? stage.color : isPast ? stage.color + '80' : 'var(--ed-ink3)', lineHeight: 1.3, marginBottom: '4px' }}>{stage.label}</div>
                <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', lineHeight: 1.4, display: isCurrent ? 'block' : 'none' }}>{stage.stakeholders}</div>
              </motion.div>
              {i < PIPELINE_STAGES.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px', flexShrink: 0 }}>
                  <motion.div animate={{ opacity: i < active ? 1 : 0.2, scaleX: i < active ? 1 : 0.6 }}
                    transition={{ duration: 0.4 }}
                    style={{ width: '24px', height: '3px', borderRadius: '2px', background: i < active ? PIPELINE_STAGES[i + 1 <= active ? i : active].color : 'var(--ed-rule)', position: 'relative' as const }}>
                    {i === active - 1 && (
                      <motion.div animate={{ x: ['-100%', '150%'] }} transition={{ duration: 0.8, ease: 'easeInOut' }}
                        style={{ position: 'absolute' as const, top: '-1px', width: '8px', height: '5px', borderRadius: '3px', background: PIPELINE_STAGES[active].color, boxShadow: `0 0 8px ${PIPELINE_STAGES[active].color}` }} />
                    )}
                  </motion.div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Current gate */}
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '8px', background: `${PIPELINE_STAGES[active].color}12`, border: `1px solid ${PIPELINE_STAGES[active].color}40` }}>
          <span style={{ fontSize: '18px' }}>{PIPELINE_STAGES[active].emoji}</span>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: PIPELINE_STAGES[active].color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>CURRENT GATE</div>
            <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.5 }}><strong>{PIPELINE_STAGES[active].label}:</strong> {PIPELINE_STAGES[active].gate} — {PIPELINE_STAGES[active].stakeholders}</div>
          </div>
        </motion.div>
      </AnimatePresence>
    </AnimationShell>
  );
}

// ─────────────────────────────────────────
// 2 · AHA MOMENT FLOW
// ─────────────────────────────────────────
const JOURNEY_STAGES = [
  { label: 'Acquisition', emoji: '👤' },
  { label: 'Onboarding',  emoji: '🚪' },
  { label: 'First Action', emoji: '⚡' },
  { label: 'Aha Moment',  emoji: '💡' },
  { label: 'Repeat Use',  emoji: '🔄' },
];

const FLOW_DATA = {
  before: { rates: [100, 65, 38, 18, 9],  color: '#dc2626', label: 'Before optimization' },
  after:  { rates: [100, 82, 67, 52, 44], color: ACCENT,    label: 'After reducing friction' },
};

export function AhaMomentFlowAnimation() {
  const [mode, setMode] = useState<'before' | 'after'>('before');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 3200);
    return () => clearInterval(t);
  }, []);

  // Auto-toggle between before/after
  useEffect(() => {
    setMode(tick % 2 === 0 ? 'before' : 'after');
  }, [tick]);

  const data = FLOW_DATA[mode];
  const maxW = 320;

  return (
    <AnimationShell title="Aha Moment Flow" caption="Growth does not start at acquisition. It starts when users reach meaningful value — and the gap between the two is where most products lose.">
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'center' }}>
        {(['before', 'after'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            style={{ padding: '5px 16px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${FLOW_DATA[m].color}`, background: mode === m ? `${FLOW_DATA[m].color}18` : 'var(--ed-card)', color: mode === m ? FLOW_DATA[m].color : 'var(--ed-ink3)', transition: 'all 0.2s' }}>
            {FLOW_DATA[m].label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
        {JOURNEY_STAGES.map((stage, i) => {
          const pct = data.rates[i];
          const barW = (pct / 100) * maxW;
          const dropPct = i > 0 ? data.rates[i - 1] - pct : 0;
          const isAha = stage.label === 'Aha Moment';
          return (
            <div key={stage.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '90px', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <span style={{ fontSize: '16px' }}>{stage.emoji}</span>
                <span style={{ fontSize: '11px', fontWeight: isAha ? 700 : 400, color: isAha ? data.color : 'var(--ed-ink2)', lineHeight: 1.3 }}>{stage.label}</span>
              </div>
              <div style={{ flex: 1, position: 'relative' as const, height: '28px' }}>
                <div style={{ height: '100%', borderRadius: '6px', background: 'var(--ed-rule)', overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: barW }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ height: '100%', borderRadius: '6px', background: isAha ? data.color : `${data.color}70`, display: 'flex', alignItems: 'center', paddingLeft: '8px', minWidth: 0, boxShadow: isAha ? `0 0 12px ${data.color}50` : 'none' }}>
                    {barW > 30 && (
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' as const }}>{pct}%</span>
                    )}
                  </motion.div>
                </div>
                {i > 0 && dropPct > 5 && (
                  <div style={{ position: 'absolute' as const, right: 0, top: '50%', transform: 'translateY(-50%)', fontSize: '9px', color: '#dc2626', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, whiteSpace: 'nowrap' as const }}>
                    -{dropPct}% dropped
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', textAlign: 'center' as const, lineHeight: 1.5 }}>
          {mode === 'before'
            ? `Only ${data.rates[3]}% of acquired users reach the aha moment. Most drop off before experiencing core value.`
            : `${data.rates[3]}% reach the aha moment. Better onboarding and reduced friction create a compounding activation lift.`}
        </div>
      </div>
    </AnimationShell>
  );
}

// ─────────────────────────────────────────
// 3 · GROWTH FLYWHEEL
// ─────────────────────────────────────────
export function GrowthFlywheelAnimation() {
  const [cycle, setCycle] = useState(0);
  const [dotPos, setDotPos] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setDotPos(p => (p + 1) % 8);
    }, 400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCycle(c => c + 1), 400);
    return () => clearInterval(t);
  }, []);

  const FUNNEL = [
    { label: 'Awareness',   w: 240, users: 1000, color: '#3A86FF' },
    { label: 'Sign Up',     w: 180, users: 420,  color: '#7843EE' },
    { label: 'Activation',  w: 130, users: 210,  color: '#E67E22' },
    { label: 'Conversion',  w: 88,  users: 95,   color: ACCENT },
    { label: 'Stops here',  w: 60,  users: 0,    color: '#94a3b8' },
  ];

  const LOOP_NODES = [
    { label: 'User Gets Value',     angle: 270, emoji: '⭐', color: ACCENT },
    { label: 'Invites Teammates',   angle: 315, emoji: '✉️', color: '#3A86FF' },
    { label: 'New User Joins',      angle: 0,   emoji: '👤', color: '#7843EE' },
    { label: 'Deeper Adoption',     angle: 45,  emoji: '📈', color: '#E67E22' },
    { label: 'More Collaboration',  angle: 90,  emoji: '🤝', color: '#0097A7' },
    { label: 'More Invites',        angle: 135, emoji: '📤', color: '#3A86FF' },
    { label: 'Growth Compounds',    angle: 180, emoji: '🔄', color: ACCENT },
    { label: 'Loop Repeats',        angle: 225, emoji: '⚡', color: ACCENT },
  ];

  const cx = 120, cy = 110, r = 75;
  const toXY = (deg: number) => ({
    x: cx + r * Math.cos((deg * Math.PI) / 180),
    y: cy + r * Math.sin((deg * Math.PI) / 180),
  });

  return (
    <AnimationShell title="Growth Flywheel" caption="A funnel stops when external push stops. A loop creates conditions where usage generates more usage — compounding each cycle.">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'center' }}>
        {/* Left: Linear funnel */}
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '12px', textAlign: 'center' as const }}>LINEAR FUNNEL</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '3px' }}>
            {FUNNEL.map((step, i) => (
              <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <motion.div
                  style={{ height: '28px', borderRadius: '5px', background: step.w === 60 ? '#e2e8f0' : `${step.color}55`, border: `1.5px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  animate={{ width: step.w }}
                  transition={{ duration: 0.5 }}>
                  {step.users > 0 && <span style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: step.color, whiteSpace: 'nowrap' as const }}>{step.users.toLocaleString()}</span>}
                </motion.div>
                <span style={{ fontSize: '9px', color: step.w === 60 ? '#94a3b8' : 'var(--ed-ink3)', width: '70px' }}>{step.label}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' as const, marginTop: '10px', fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>Stops without push ✗</div>
        </div>

        {/* Right: Circular loop */}
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '8px', textAlign: 'center' as const }}>GROWTH LOOP</div>
          <svg width="240" height="220" viewBox="0 0 240 220" style={{ display: 'block', margin: '0 auto' }}>
            {/* Circle track */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={`${ACCENT}20`} strokeWidth="2" strokeDasharray="6 4" />
            {/* Animated arc */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={ACCENT} strokeWidth="2.5" strokeDasharray="30 320" strokeLinecap="round"
              style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'spin 4s linear infinite' }} />

            {/* Nodes */}
            {LOOP_NODES.filter((_, i) => i % 2 === 0).map((node, i) => {
              const pos = toXY(node.angle);
              const isActive = dotPos === i * 2 || dotPos === i * 2 + 1;
              return (
                <g key={node.label}>
                  <circle cx={pos.x} cy={pos.y} r={isActive ? 14 : 11} fill={isActive ? node.color : `${node.color}30`} stroke={node.color} strokeWidth="1.5" style={{ transition: 'all 0.3s' }} />
                  <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="12">{node.emoji}</text>
                </g>
              );
            })}

            {/* Moving dot */}
            {(() => {
              const angle = (dotPos / 8) * 360 - 90;
              const pos = toXY(angle);
              return (
                <circle cx={pos.x} cy={pos.y} r="5" fill={ACCENT} style={{ filter: `drop-shadow(0 0 4px ${ACCENT})`, transition: 'cx 0.38s ease-in-out, cy 0.38s ease-in-out' }} />
              );
            })()}

            {/* Center: growing users count */}
            <text x={cx} y={cy - 8} textAnchor="middle" fontSize="18" fontWeight="bold" fill={ACCENT}>
              {(100 * Math.pow(1.08, Math.floor(cycle / 2))).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="var(--ed-ink3)">users</text>
            <text x={cx} y={cy + 22} textAnchor="middle" fontSize="8" fill={ACCENT} fontWeight="700">& growing</text>
          </svg>
          <div style={{ textAlign: 'center' as const, fontSize: '10px', color: ACCENT, fontWeight: 600, marginTop: '4px' }}>Compounds each cycle ✓</div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -350; } }
      `}</style>
    </AnimationShell>
  );
}

// ─────────────────────────────────────────
// 4 · MONETIZATION LADDER
// ─────────────────────────────────────────
const LADDER_RUNGS = [
  { label: 'Free',          emoji: '🆓', color: '#94a3b8', trigger: 'No barrier — just sign up',                   users: 100 },
  { label: 'Freemium',      emoji: '🔓', color: '#3A86FF', trigger: 'Hit a meaningful limit → upgrade',             users: 45  },
  { label: 'Usage-Based',   emoji: '📊', color: '#E67E22', trigger: 'Value grows → cost grows with it',             users: 28  },
  { label: 'Team Plan',     emoji: '👥', color: '#7843EE', trigger: 'Champion brings teammates in',                 users: 16  },
  { label: 'Enterprise',    emoji: '🏢', color: ACCENT,    trigger: 'Full org commitment, procurement, SLA',         users: 7   },
];

export function MonetizationLadderAnimation() {
  const [highlight, setHighlight] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHighlight(h => (h + 1) % LADDER_RUNGS.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <AnimationShell title="Monetization Ladder" caption="Each pricing tier captures different users at different moments. The model you choose shapes which rung most users stop at — and what it takes to climb higher.">
      <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch' }}>
        {/* Ladder */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, gap: '6px', justifyContent: 'center' }}>
          {[...LADDER_RUNGS].reverse().map((rung, ri) => {
            const i = LADDER_RUNGS.length - 1 - ri;
            const isActive = highlight === i;
            return (
              <motion.div key={rung.label}
                animate={{ x: isActive ? 6 : 0, scale: isActive ? 1.02 : 1 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', border: `1.5px solid ${isActive ? rung.color : rung.color + '35'}`, background: isActive ? `${rung.color}14` : 'var(--ed-card)', transition: 'background 0.3s, border-color 0.3s', boxShadow: isActive ? `0 4px 16px ${rung.color}25` : 'none' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{rung.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: isActive ? rung.color : 'var(--ed-ink)' }}>{rung.label}</div>
                  <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.4, marginTop: '1px' }}>{rung.trigger}</div>
                </div>
                <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: '14px', color: rung.color }}>{rung.users}%</div>
                  <div style={{ fontSize: '9px', color: 'var(--ed-ink3)' }}>reach</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Conversion funnel bars */}
        <div style={{ width: '120px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', gap: '6px', alignItems: 'flex-end' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: '2px', textAlign: 'right' as const }}>REACH</div>
          {[...LADDER_RUNGS].reverse().map((rung, ri) => {
            const i = LADDER_RUNGS.length - 1 - ri;
            const isActive = highlight === i;
            return (
              <div key={rung.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '36px' }}>
                <motion.div
                  animate={{ width: rung.users * 1.1 }}
                  style={{ height: '22px', borderRadius: '5px', background: isActive ? rung.color : `${rung.color}40`, minWidth: '4px', transition: 'background 0.3s', width: `${rung.users * 1.1}px` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </AnimationShell>
  );
}

// ─────────────────────────────────────────
// 5 · B2B GTM MOTION
// ─────────────────────────────────────────
const GTM_TRACKS = [
  {
    id: 'plg', label: 'Product-Led (PLG)', color: '#3A86FF', speed: 'fast',
    steps: [
      { emoji: '🆓', label: 'Free Signup' },
      { emoji: '💡', label: 'In-app Aha' },
      { emoji: '📤', label: 'Viral Spread' },
      { emoji: '💳', label: 'Auto Convert' },
      { emoji: '📈', label: 'Expand Seats' },
    ],
    tags: ['Low complexity', 'Fast time-to-value', 'Low price point'],
    stepDelay: 600,
  },
  {
    id: 'hybrid', label: 'Hybrid', color: ACCENT, speed: 'medium',
    steps: [
      { emoji: '🔬', label: 'Self-serve Trial' },
      { emoji: '💡', label: 'Product Activation' },
      { emoji: '📞', label: 'Sales Touch' },
      { emoji: '✅', label: 'Proof of Value' },
      { emoji: '📈', label: 'Land & Expand' },
    ],
    tags: ['Medium complexity', 'Mixed motion', 'Product leads'],
    stepDelay: 900,
  },
  {
    id: 'sales', label: 'Sales-Led', color: '#7843EE', speed: 'deliberate',
    steps: [
      { emoji: '📬', label: 'Sales Outreach' },
      { emoji: '🎯', label: 'Discovery + Demo' },
      { emoji: '🏗️', label: 'Enterprise Pilot' },
      { emoji: '👥', label: 'Stakeholder Buy-in' },
      { emoji: '📝', label: 'Contract + Rollout' },
    ],
    tags: ['High complexity', 'Multi-stakeholder', 'High ACV'],
    stepDelay: 1200,
  },
];

export function GTMMotionAnimation() {
  const [steps, setSteps] = useState([0, 0, 0]);

  useEffect(() => {
    const intervals = GTM_TRACKS.map((track, ti) =>
      setInterval(() => {
        setSteps(prev => {
          const next = [...prev];
          next[ti] = (next[ti] + 1) % (track.steps.length + 2);
          return next;
        });
      }, track.stepDelay)
    );
    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <AnimationShell title="B2B GTM Motion" caption="The right GTM motion matches the product's complexity, time-to-value, and buyer count — not which motion sounds most modern.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {GTM_TRACKS.map((track, ti) => {
          const currentStep = steps[ti] % track.steps.length;
          const isProgressing = steps[ti] < track.steps.length;
          return (
            <div key={track.id} style={{ borderRadius: '12px', border: `1.5px solid ${track.color}35`, background: `${track.color}08`, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '10px 12px', background: `${track.color}18`, borderBottom: `1px solid ${track.color}25` }}>
                <div style={{ fontWeight: 700, fontSize: '12px', color: track.color, marginBottom: '4px' }}>{track.label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px' }}>
                  {track.tags.map(tag => (
                    <span key={tag} style={{ fontSize: '8px', padding: '2px 6px', borderRadius: '4px', background: `${track.color}20`, color: track.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column' as const, gap: '5px' }}>
                {track.steps.map((step, si) => {
                  const isDone = si < currentStep;
                  const isCurrent = si === currentStep;
                  return (
                    <motion.div key={step.label}
                      animate={{ opacity: isDone ? 0.45 : isCurrent ? 1 : 0.25, x: isCurrent ? 3 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '6px 8px', borderRadius: '7px', background: isCurrent ? `${track.color}18` : 'transparent', border: `1px solid ${isCurrent ? track.color + '40' : 'transparent'}`, transition: 'background 0.3s, border-color 0.3s' }}>
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>{step.emoji}</span>
                      <span style={{ fontSize: '11px', fontWeight: isCurrent ? 700 : 400, color: isCurrent ? track.color : 'var(--ed-ink2)' }}>{step.label}</span>
                      {isDone && <span style={{ marginLeft: 'auto', fontSize: '10px', color: track.color }}>✓</span>}
                      {isCurrent && (
                        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                          style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: track.color, flexShrink: 0 }} />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Speed indicator */}
              <div style={{ padding: '6px 12px', borderTop: `1px solid ${track.color}15`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '9px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>PACE</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: track.color, fontFamily: "'JetBrains Mono', monospace" }}>{track.speed.toUpperCase()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </AnimationShell>
  );
}

// ─────────────────────────────────────────
// T2-A · PHASED ROLLOUT CONTROL ANIMATION
// ─────────────────────────────────────────
const ROLLOUT_LAYERS = [
  { label: 'Internal Team',   emoji: '🏠', color: '#64748b', risk: 5,  signal: 20, support: 95 },
  { label: 'Design Partners', emoji: '🤝', color: '#3A86FF', risk: 15, signal: 45, support: 85 },
  { label: 'Pilot Accounts',  emoji: '🎯', color: '#E67E22', risk: 30, signal: 65, support: 75 },
  { label: 'Segmented',       emoji: '🌊', color: '#7843EE', risk: 55, signal: 80, support: 60 },
  { label: 'Broad Launch',    emoji: '🚀', color: ACCENT,    risk: 90, signal: 95, support: 45 },
];

export function PhasedRolloutControlAnimation() {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % ROLLOUT_LAYERS.length), 2200);
    return () => clearInterval(t);
  }, []);

  const layer = ROLLOUT_LAYERS[active];

  return (
    <AnimationShell title="Phased Rollout Control" caption="Mature rollout is a governance system — each stage expands exposure while improving signal quality, with a defined blast radius at every step.">
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', marginBottom: '20px' }}>
        {ROLLOUT_LAYERS.map((l, i) => {
          const isActive = i === active;
          const isPast = i < active;
          return (
            <div key={l.label} style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '6px' }}>
              <motion.div animate={{ height: `${20 + l.risk * 1.3}px`, opacity: isActive ? 1 : isPast ? 0.45 : 0.25 }} transition={{ duration: 0.5 }}
                style={{ width: '100%', borderRadius: '5px 5px 0 0', background: isActive ? l.color : l.color + '60', boxShadow: isActive ? `0 0 16px ${l.color}50` : 'none' }} />
              <div style={{ fontSize: '18px' }}>{l.emoji}</div>
              <div style={{ fontSize: '9px', fontWeight: isActive ? 700 : 400, color: isActive ? l.color : 'var(--ed-ink3)', textAlign: 'center' as const, lineHeight: 1.3 }}>{l.label}</div>
            </div>
          );
        })}
      </div>

      <motion.div key={active} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {[
          { label: 'Blast Radius', value: layer.risk, color: layer.risk > 50 ? '#dc2626' : '#E67E22', invert: false },
          { label: 'Signal Quality', value: layer.signal, color: layer.signal > 60 ? ACCENT : '#E67E22', invert: false },
          { label: 'Support Capacity', value: layer.support, color: layer.support > 70 ? ACCENT : '#E67E22', invert: false },
        ].map(m => (
          <div key={m.label} style={{ padding: '10px', borderRadius: '8px', background: `${m.color}12`, border: `1px solid ${m.color}35`, textAlign: 'center' as const }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: m.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: '4px' }}>{m.label}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 900, fontSize: '20px', color: m.color }}>{m.value}%</div>
          </div>
        ))}
      </motion.div>
    </AnimationShell>
  );
}

// ─────────────────────────────────────────
// T2-B · LAND AND EXPAND ANIMATION
// ─────────────────────────────────────────
const EXPAND_STAGES = [
  { label: 'Champion',          emoji: '⭐', color: '#E67E22', nodes: 1 },
  { label: 'First Team',        emoji: '👥', color: '#3A86FF', nodes: 4 },
  { label: 'Proof of Value',    emoji: '📊', color: '#7843EE', nodes: 4 },
  { label: 'Paid Conversion',   emoji: '💳', color: ACCENT,    nodes: 4 },
  { label: 'Adjacent Team',     emoji: '🏢', color: ACCENT,    nodes: 8 },
  { label: 'Org-Wide Adoption', emoji: '🚀', color: ACCENT,    nodes: 16 },
];

export function LandAndExpandAnimation() {
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStageIdx(i => (i + 1) % EXPAND_STAGES.length), 1800);
    return () => clearInterval(t);
  }, []);

  const stage = EXPAND_STAGES[stageIdx];

  return (
    <AnimationShell title="Land-and-Expand Flow" caption="Enterprise expansion is not a sales outcome — it is a product-and-GTM system where each stage deliberately builds the conditions for the next.">
      {/* Visual org spread */}
      <div style={{ textAlign: 'center' as const, marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' as const, minHeight: '80px', alignItems: 'center' }}>
          {Array.from({ length: Math.min(stage.nodes, 16) }, (_, i) => (
            <motion.div key={`${stageIdx}-${i}`} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.06, type: 'spring', stiffness: 300 }}
              style={{ width: i === 0 ? '40px' : '28px', height: i === 0 ? '40px' : '28px', borderRadius: '50%', background: i === 0 ? '#E67E22' : stage.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: i === 0 ? '18px' : '12px', boxShadow: i === 0 ? `0 0 16px ${stage.color}60` : `0 2px 8px ${stage.color}30`, border: i === 0 ? '2px solid white' : 'none' }}>
              {i === 0 ? '⭐' : '👤'}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stage progress */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', justifyContent: 'center' }}>
        {EXPAND_STAGES.map((s, i) => (
          <div key={s.label} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '4px', flex: 1 }}>
            <motion.div animate={{ scale: i === stageIdx ? 1.2 : 1, opacity: i > stageIdx ? 0.3 : 1 }}
              style={{ width: '28px', height: '28px', borderRadius: '50%', background: i <= stageIdx ? s.color : 'var(--ed-rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', boxShadow: i === stageIdx ? `0 0 12px ${s.color}60` : 'none', transition: 'background 0.4s' }}>
              {i < stageIdx ? '✓' : s.emoji}
            </motion.div>
            <div style={{ fontSize: '8px', color: i === stageIdx ? s.color : 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", fontWeight: i === stageIdx ? 700 : 400, textAlign: 'center' as const, lineHeight: 1.3 }}>
              {s.label.split(' ')[0]}
            </div>
          </div>
        ))}
      </div>

      <motion.div key={stageIdx} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        style={{ padding: '12px 16px', borderRadius: '8px', background: `${stage.color}12`, border: `1px solid ${stage.color}40`, display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontSize: '20px' }}>{stage.emoji}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '12px', color: stage.color }}>{stage.label}</div>
          <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', marginTop: '2px' }}>
            {stage.nodes} user{stage.nodes > 1 ? 's' : ''} in the product · {stageIdx < EXPAND_STAGES.length - 1 ? 'advancing →' : 'expansion complete ✓'}
          </div>
        </div>
      </motion.div>
    </AnimationShell>
  );
}

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

function ReplayBtn({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.button onClick={onReplay} whileHover={{ opacity: 0.75, scale: 1.03 }} whileTap={{ scale: 0.96 }}
      style={{ marginTop: '16px', padding: '7px 22px', borderRadius: '10px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--ed-rule)', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.08em' }}>
      ↺ replay
    </motion.button>
  );
}

function InsightBox({ color, label, children }: { color: string; label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: '14px', padding: '12px 18px', borderRadius: '12px', background: `${color}0D`, border: `1px solid ${color}30`, fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
      <strong style={{ color }}>{label}</strong>{children}
    </div>
  );
}

// ─── M01 · T2 · OUTPUT VS OUTCOME FACTORY ──────────────────────────────────────
// Split factory floor. Left: conveyor belt endlessly spitting out Feature boxes.
// Right: metric board shows the real results — flat lines, one green spike.
// Teaches: shipping ≠ impact. Outputs are easy to count. Outcomes are what matter.

const FEATURES = [
  { label: 'Dark Mode', week: 'W1', shipped: true },
  { label: 'CSV Export', week: 'W2', shipped: true },
  { label: 'Bulk Edit', week: 'W3', shipped: true },
  { label: 'Onboarding', week: 'W4', shipped: true },
];

const METRICS = [
  { label: 'Week-2 Retention', before: 60, after: 88, color: '#22C55E', mattered: true },
  { label: 'DAU', before: 72, after: 74, color: '#94A3B8', mattered: false },
  { label: 'Support Tickets', before: 50, after: 48, color: '#94A3B8', mattered: false },
  { label: 'NPS Score', before: 34, after: 36, color: '#94A3B8', mattered: false },
];

export function OutputVsOutcomeFactory() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [stage, setStage] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setStage(0);
    const ts = [1, 2, 3, 4, 5].map((s, i) => setTimeout(() => setStage(s), 300 + i * 700));
    return () => ts.forEach(clearTimeout);
  }, [inView, tick]);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.1)' }}>
        {/* Header */}
        <div style={{ background: '#1C1917', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 900, color: '#F97316', letterSpacing: '0.18em' }}>EDSPARK FACTORY FLOOR · Q2</div>
          <div style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>4 FEATURES SHIPPED THIS QUARTER</div>
        </div>

        {/* Main split panel */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', background: '#0F172A' }}>
          {/* LEFT — Output side */}
          <div style={{ padding: '20px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#F97316', letterSpacing: '0.16em', marginBottom: '14px' }}>OUTPUTS (SHIPPED)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {FEATURES.map((f, i) => (
                <AnimatePresence key={f.label}>
                  {stage >= i + 1 && (
                    <motion.div
                      initial={{ x: -40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#F0E8D8' }}>{f.label}</div>
                        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{f.week} · DONE</div>
                      </div>
                      <div style={{ fontSize: '10px', color: '#22C55E' }}>✓</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>
            {stage >= 4 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                style={{ marginTop: '14px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(249,115,22,0.06)', fontFamily: 'monospace', fontSize: '10px', color: '#F97316', textAlign: 'center' }}>
                4/4 SHIPPED ON TIME ✓
              </motion.div>
            )}
          </div>

          {/* Divider */}
          <div style={{ background: 'rgba(255,255,255,0.06)' }} />

          {/* RIGHT — Outcome side */}
          <div style={{ padding: '20px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#22C55E', letterSpacing: '0.16em', marginBottom: '14px' }}>OUTCOMES (MOVED)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {METRICS.map((m, i) => (
                <AnimatePresence key={m.label}>
                  {stage >= 2 && (
                    <motion.div
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 22, delay: i * 0.15 }}
                      style={{ padding: '10px 14px', borderRadius: '10px', background: m.mattered ? 'rgba(34,197,94,0.08)' : 'rgba(148,163,184,0.05)', border: `1px solid ${m.mattered ? 'rgba(34,197,94,0.3)' : 'rgba(148,163,184,0.12)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: m.mattered ? '#F0E8D8' : 'rgba(240,232,216,0.4)' }}>{m.label}</div>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: m.mattered ? '#22C55E' : '#475569' }}>
                          {m.mattered ? `+${m.after - m.before}pp` : `+${m.after - m.before}pp`}
                        </div>
                      </div>
                      {/* Mini bar chart */}
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '20px' }}>
                        <div style={{ width: '16px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', height: `${m.before * 0.2}px` }} />
                        <div style={{ width: '16px', background: m.color, borderRadius: '2px', height: `${m.after * 0.2}px`, boxShadow: m.mattered ? `0 0 8px ${m.color}` : 'none' }} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>
          </div>
        </div>

        {/* Footer punchline */}
        {stage >= 5 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: '#1C1917', padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#F97316', textAlign: 'center', letterSpacing: '0.06em' }}>
            3 of 4 features shipped on time. 1 of 4 moved the metric that mattered.
          </motion.div>
        )}
      </div>
      <InsightBox color="#22C55E" label="Outcome ≠ output: ">
        {' '}a team can ship 100% on time and miss the quarter entirely. The only score that matters is whether user behaviour changed in the direction the business needs.
      </InsightBox>
      <ReplayBtn onReplay={() => { setStage(0); setTick(t => t + 1); }} />
    </div>
  );
}

// ─── M02 · T2 · MOAT CROSS-SECTION ────────────────────────────────────────────
// Geological cross-section like a textbook diagram. Surface = competitors.
// 4 underground strata from shallow to deep: Switching Costs, Network Effects,
// Data Flywheel, Structural Lock-in. Teaches: depth = defensibility.

const STRATA = [
  { label: 'Switching Costs', sublabel: 'Migration pain, data lock, re-training', color: '#F59E0B', depth: 40, icon: '🔒' },
  { label: 'Network Effects', sublabel: 'Each new user makes the product better for all', color: '#6366F1', depth: 90, icon: '🕸' },
  { label: 'Data Flywheel', sublabel: 'More usage → better model → more usage', color: '#0EA5E9', depth: 145, icon: '🌀' },
  { label: 'Structural Lock-in', sublabel: 'Embedded in workflows, contracts, compliance', color: '#22C55E', depth: 210, icon: '🏛' },
];

export function MoatCrossSectionViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0);
    STRATA.forEach((_, i) => setTimeout(() => setVisible(i + 1), 600 + i * 750));
  }, [inView, tick]);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.1)' }}>
        <svg viewBox="0 0 620 440" style={{ width: '100%', display: 'block' }}>
          <defs>
            <linearGradient id="ground-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6B4C2A" />
              <stop offset="25%" stopColor="#4A3520" />
              <stop offset="60%" stopColor="#2D1F0E" />
              <stop offset="100%" stopColor="#1A1008" />
            </linearGradient>
            <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="#BFDBFE" />
            </linearGradient>
            <filter id="moat-glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* Sky */}
          <rect x="0" y="0" width="620" height="75" fill="url(#sky-grad)" />

          {/* Competitors label at top */}
          <text x="310" y="22" textAnchor="middle" style={{ fontSize: '9px', fill: '#1E40AF', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.12em' }}>SURFACE · COMPETITORS CAN SEE THIS</text>

          {/* Competitor icons on surface */}
          {[160, 240, 380, 460].map((cx, i) => (
            <g key={i}>
              <circle cx={cx} cy={55} r="12" fill="rgba(30,64,175,0.15)" stroke="#93C5FD" strokeWidth="1.5" />
              <text x={cx} y={60} textAnchor="middle" style={{ fontSize: '12px' }}>⚡</text>
            </g>
          ))}
          <text x="310" y="72" textAnchor="middle" style={{ fontSize: '8px', fill: '#3B82F6', fontFamily: 'monospace' }}>New entrants can reach here in 6 months</text>

          {/* Ground surface line */}
          <rect x="0" y="75" width="620" height="8" fill="#7C5C3A" />
          <line x1="0" y1="75" x2="620" y2="75" stroke="#8B6340" strokeWidth="2" />

          {/* Underground body */}
          <rect x="0" y="83" width="620" height="357" fill="url(#ground-grad)" />

          {/* Company product line going deep */}
          <line x1="310" y1="75" x2="310" y2="420" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="6 4" />
          <text x="310" y="440" textAnchor="middle" style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>EDSPARK MOAT DEPTH</text>

          {/* Strata layers */}
          {STRATA.map((s, i) => {
            const y = 83 + s.depth;
            const show = i < visible;
            return (
              <g key={s.label}>
                {/* Layer separator line */}
                {show && (
                  <motion.line x1="0" y1={y} x2="620" y2={y}
                    stroke={s.color} strokeWidth="1" opacity="0.3"
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformOrigin: '310px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }} />
                )}

                {/* Stratum label card */}
                {show && (
                  <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 22 }}>
                    {/* Left label */}
                    <rect x="8" y={y + 4} width="260" height="46" rx="8"
                      fill={`${s.color}1A`} stroke={`${s.color}50`} strokeWidth="1.2" />
                    <text x="18" y={y + 22} style={{ fontSize: '11px', fill: s.color, fontFamily: 'system-ui', fontWeight: 800 }}>
                      {s.icon} {s.label}
                    </text>
                    <text x="18" y={y + 38} style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.45)', fontFamily: 'system-ui' }}>
                      {s.sublabel}
                    </text>

                    {/* Depth indicator on right */}
                    <rect x="352" y={y + 10} width="60" height="24" rx="6" fill={`${s.color}20`} stroke={`${s.color}40`} strokeWidth="1" />
                    <text x="382" y={y + 26} textAnchor="middle" style={{ fontSize: '9px', fill: s.color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.08em' }}>
                      {`L${i + 1}`}
                    </text>

                    {/* Lock icon — harder to reach = more locks */}
                    {Array.from({ length: i + 1 }).map((_, li) => (
                      <text key={li} x={430 + li * 16} y={y + 26} style={{ fontSize: '10px', fill: s.color, opacity: 0.8 }}>🔒</text>
                    ))}
                  </motion.g>
                )}
              </g>
            );
          })}

          {visible >= STRATA.length && (
            <motion.text x="310" y="398" textAnchor="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: '9px', fill: 'rgba(34,197,94,0.7)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', fontWeight: 800 }}>
              ⬇ STRUCTURAL LOCK-IN · COMPETITORS CANNOT REACH THIS LAYER
            </motion.text>
          )}
        </svg>
      </div>
      <InsightBox color="#6366F1" label="Moat depth = time to replicate: ">
        {' '}switching costs take months to build. Network effects take years. A data flywheel compounds over time. Structural lock-in is nearly permanent. Strategy is choosing which layers to build first.
      </InsightBox>
      <ReplayBtn onReplay={() => { setVisible(0); setTick(t => t + 1); }} />
    </div>
  );
}

// ─── M03 · T2 · BUYING COMMITTEE ROOM ─────────────────────────────────────────
// Top-down bird's-eye view of an enterprise boardroom. 6 seats, each a different
// buying role. Thought bubbles emerge with their specific concern. Teaches: B2B
// sales is never one person — every seat has a different agenda.

const SEATS = [
  { role: 'Economic Buyer', concern: 'What is the ROI? Will the CFO approve?', color: '#F59E0B', cx: 310, cy: 90, angle: 0 },
  { role: 'Champion', concern: 'This solves my team\'s pain. I want it to work.', color: '#22C55E', cx: 480, cy: 160, angle: 60 },
  { role: 'Technical Evaluator', concern: 'How does it integrate with Salesforce?', color: '#0EA5E9', cx: 470, cy: 310, angle: 120 },
  { role: 'End User', concern: 'Will this actually be easy to use daily?', color: '#6366F1', cx: 310, cy: 380, angle: 180 },
  { role: 'Influencer', concern: 'What do G2 reviews say? Who else uses this?', color: '#EC4899', cx: 150, cy: 310, angle: 240 },
  { role: 'Blocker', concern: 'We already have a vendor. Why switch now?', color: '#EF4444', cx: 140, cy: 160, angle: 300 },
];

export function BuyingCommitteeRoomViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0); setActive(null);
    SEATS.forEach((_, i) => setTimeout(() => setVisible(i + 1), 400 + i * 500));
    setTimeout(() => setActive(0), 400 + SEATS.length * 500 + 300);
  }, [inView, tick]);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.1)' }}>
        <svg viewBox="0 0 620 470" style={{ width: '100%', display: 'block', background: '#F8F7F4' }}>
          <defs>
            <filter id="seat-shadow"><feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.12)"/></filter>
          </defs>

          {/* Room floor */}
          <rect x="30" y="40" width="560" height="390" rx="20" fill="#FFFFFF" stroke="#E5E0D8" strokeWidth="2" filter="url(#seat-shadow)" />

          {/* Title */}
          <text x="310" y="28" textAnchor="middle" style={{ fontSize: '9px', fill: '#6B7280', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.14em' }}>ENTERPRISE BUYING COMMITTEE · EDSPARK DEAL #4471</text>

          {/* Conference table — top-down oval */}
          <ellipse cx="310" cy="235" rx="130" ry="80" fill="#D1C4A0" stroke="#B8A880" strokeWidth="3" filter="url(#seat-shadow)" />
          <ellipse cx="310" cy="232" rx="125" ry="76" fill="#C9B990" />
          <text x="310" y="228" textAnchor="middle" style={{ fontSize: '10px', fill: '#7C6A40', fontFamily: 'system-ui', fontWeight: 700 }}>BOARDROOM</text>
          <text x="310" y="244" textAnchor="middle" style={{ fontSize: '8px', fill: '#9C8A60', fontFamily: 'monospace' }}>EdSpark Deal Review</text>

          {/* Seats */}
          {SEATS.map((s, i) => {
            const show = i < visible;
            const isActive = active === i;
            return (
              <g key={s.role} onClick={() => setActive(isActive ? null : i)} style={{ cursor: 'pointer' }}>
                {/* Chair */}
                {show && (
                  <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }} style={{ transformOrigin: `${s.cx}px ${s.cy}px` }}>
                    <circle cx={s.cx} cy={s.cy} r="28" fill={isActive ? s.color : '#FFFFFF'} stroke={s.color} strokeWidth={isActive ? 3 : 2}
                      filter="url(#seat-shadow)" style={{ transition: 'fill 0.25s' }} />
                    {/* Role label */}
                    <text x={s.cx} y={s.cy - 5} textAnchor="middle" style={{ fontSize: '7px', fill: isActive ? '#FFFFFF' : s.color, fontFamily: 'system-ui', fontWeight: 900, pointerEvents: 'none' }}>
                      {s.role.split(' ')[0]}
                    </text>
                    <text x={s.cx} y={s.cy + 7} textAnchor="middle" style={{ fontSize: '6px', fill: isActive ? 'rgba(255,255,255,0.8)' : '#6B7280', fontFamily: 'system-ui', pointerEvents: 'none' }}>
                      {s.role.split(' ').slice(1).join(' ')}
                    </text>
                  </motion.g>
                )}

                {/* Thought bubble */}
                {show && isActive && (
                  <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
                    {/* Connector dots */}
                    <circle cx={s.cx + (310 - s.cx) * -0.3} cy={s.cy + (235 - s.cy) * -0.3} r="3" fill={s.color} opacity="0.6" />
                    <circle cx={s.cx + (310 - s.cx) * -0.2} cy={s.cy + (235 - s.cy) * -0.2} r="5" fill={s.color} opacity="0.4" />
                    {/* Bubble */}
                    <rect x={s.cx > 310 ? s.cx - 180 : s.cx + 32} y={s.cy - 36}
                      width="160" height="58" rx="10"
                      fill={s.color} filter="url(#seat-shadow)" />
                    <text x={s.cx > 310 ? s.cx - 172 : s.cx + 40} y={s.cy - 20}
                      style={{ fontSize: '8px', fill: '#fff', fontFamily: 'system-ui' }}>
                      {s.concern.substring(0, 28)}
                    </text>
                    <text x={s.cx > 310 ? s.cx - 172 : s.cx + 40} y={s.cy - 6}
                      style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.85)', fontFamily: 'system-ui' }}>
                      {s.concern.substring(28, 56)}
                    </text>
                  </motion.g>
                )}
              </g>
            );
          })}

          {visible >= SEATS.length && (
            <motion.text x="310" y="455" textAnchor="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: '9px', fill: '#6B7280', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>
              tap any seat to see their concern
            </motion.text>
          )}
        </svg>
      </div>
      <InsightBox color="#F59E0B" label="B2B deals have 6+ decision-makers: ">
        {' '}your champion loves you. Your blocker has a competing vendor. Your technical evaluator cares about APIs. Win all the seats, not just your contact.
      </InsightBox>
      <ReplayBtn onReplay={() => { setVisible(0); setActive(null); setTick(t => t + 1); }} />
    </div>
  );
}

// ─── M04 · T2 · KILL CRITERIA CONTRACT ────────────────────────────────────────
// A legal contract document. Three clauses type-write onto the page one by one.
// Each clause is an IF → THEN kill condition. A pen signs at the bottom.
// Teaches: pre-commit kill criteria before the experiment — not during review.

const CLAUSES = [
  {
    num: 'CLAUSE I',
    condition: 'IF week-4 engagement rate falls below 20%',
    consequence: 'THEN the Onboarding Revamp initiative shall be terminated.',
    color: '#6366F1',
  },
  {
    num: 'CLAUSE II',
    condition: 'IF customer acquisition cost exceeds 3× baseline by end of sprint 6',
    consequence: 'THEN the Sales-Led Expansion pilot shall be discontinued.',
    color: '#EF4444',
  },
  {
    num: 'CLAUSE III',
    condition: 'IF NPS delta is below +8 after two full cohorts',
    consequence: 'THEN the redesigned onboarding flow shall be reverted.',
    color: '#F59E0B',
  },
];

export function KillCriteriaContractViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [stage, setStage] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [tick, setTick] = useState(0);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setStage(0); setCharIdx(0); setSigned(false);
    CLAUSES.forEach((_, i) => setTimeout(() => setStage(i + 1), 700 + i * 1000));
    setTimeout(() => setSigned(true), 700 + CLAUSES.length * 1000 + 600);
  }, [inView, tick]);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.1)' }}>
        {/* Document header */}
        <div style={{ background: '#1E1B4B', padding: '14px 24px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 900, color: '#A5B4FC', letterSpacing: '0.2em', textAlign: 'center' }}>
            PRODUCT BET — KILL CRITERIA AGREEMENT
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(165,180,252,0.4)', textAlign: 'center', marginTop: '4px', letterSpacing: '0.1em' }}>
            EDSPARK · SIGNED BEFORE EXPERIMENT BEGINS · NOT AFTER
          </div>
        </div>

        {/* Document body */}
        <div style={{ background: '#FEFCE8', padding: '28px 32px', minHeight: '320px' }}>
          <div style={{ fontFamily: 'serif', fontSize: '11px', color: '#374151', marginBottom: '20px', lineHeight: 1.8 }}>
            The undersigned product team agrees that the following criteria, if met, constitute grounds for immediate termination of the named initiative — regardless of team sentiment, sunk cost, or stakeholder pressure.
          </div>

          {CLAUSES.map((c, i) => (
            <AnimatePresence key={c.num}>
              {stage >= i + 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                  style={{ marginBottom: '18px', paddingLeft: '16px', borderLeft: `3px solid ${c.color}` }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 900, color: c.color, letterSpacing: '0.15em', marginBottom: '4px' }}>
                    {c.num}
                  </div>
                  <div style={{ fontFamily: 'serif', fontSize: '12px', color: '#1F2937', lineHeight: 1.7 }}>
                    <span style={{ background: `${c.color}18`, padding: '1px 4px', borderRadius: '3px' }}>{c.condition}</span>
                    {' — '}
                    <strong>{c.consequence}</strong>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}

          {/* Signature line */}
          {stage >= CLAUSES.length && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ marginTop: '28px', borderTop: '1px solid #D1D5DB', paddingTop: '16px', display: 'flex', gap: '40px', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: '8px', color: '#9CA3AF', letterSpacing: '0.1em', marginBottom: '8px' }}>PM SIGNATURE</div>
                {signed ? (
                  <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
                    style={{ fontFamily: 'cursive', fontSize: '22px', color: '#1E1B4B', borderBottom: '1px solid #374151', paddingBottom: '2px', transformOrigin: 'left' }}>
                    Priya Sharma
                  </motion.div>
                ) : (
                  <div style={{ width: '140px', height: '28px', borderBottom: '1px solid #D1D5DB' }} />
                )}
              </div>
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: '8px', color: '#9CA3AF', letterSpacing: '0.1em', marginBottom: '8px' }}>DATE</div>
                <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#374151' }}>{signed ? '2026-05-19' : '___________'}</div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '7px', color: '#9CA3AF', letterSpacing: '0.08em' }}>
                  SIGNED BEFORE<br />EXPERIMENT STARTED
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <InsightBox color="#6366F1" label="Pre-mortem in writing: ">
        {' '}kill criteria written before the experiment begins remove the emotional renegotiation that happens at review. "We almost hit the number" can&apos;t override a contract you signed when you were rational.
      </InsightBox>
      <ReplayBtn onReplay={() => { setStage(0); setSigned(false); setTick(t => t + 1); }} />
    </div>
  );
}

// ─── M05 · T2 · DESIGN SYSTEM SHOVEL ──────────────────────────────────────────
// Split panel. Left: person digging with bare hands — slow, inefficient, per-hole
// effort. Right: same person with a shovel — same motion, dramatically more output.
// Progress bars show velocity difference. Teaches: design systems = leverage.

export function DesignSystemShovelViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [progress, setProgress] = useState({ hands: 0, shovel: 0 });
  const [stage, setStage] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setProgress({ hands: 0, shovel: 0 }); setStage(0);
    const t1 = setTimeout(() => setStage(1), 400);
    let handsVal = 0;
    let shovelVal = 0;
    const interval = setInterval(() => {
      handsVal = Math.min(handsVal + 1.2, 100);
      shovelVal = Math.min(shovelVal + 5.8, 100);
      setProgress({ hands: handsVal, shovel: shovelVal });
      if (shovelVal >= 100) {
        clearInterval(interval);
        setStage(2);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [inView, tick]);

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.1)' }}>
        {/* Header */}
        <div style={{ background: '#1C1917', padding: '12px 20px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 900, color: '#F97316', letterSpacing: '0.18em' }}>DESIGN SYSTEM · LEVERAGE COMPARISON</div>
        </div>

        {/* Split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr' }}>
          {/* Left — bare hands */}
          <div style={{ background: '#FEF2F2', padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '48px' }}>🙌</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 900, color: '#DC2626', letterSpacing: '0.12em' }}>WITHOUT DESIGN SYSTEM</div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '6px', lineHeight: 1.6 }}>Every component built from scratch. Each team makes slightly different decisions. Consistency requires constant review.</div>
            </div>

            {/* Progress bar */}
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#DC2626', fontWeight: 700 }}>Screens shipped</div>
                <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#DC2626', fontWeight: 700 }}>{Math.round(progress.hands)}%</div>
              </div>
              <div style={{ height: '10px', borderRadius: '5px', background: '#FECACA', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${progress.hands}%` }} transition={{ duration: 0 }}
                  style={{ height: '100%', background: '#EF4444', borderRadius: '5px' }} />
              </div>
            </div>

            {/* Per-screen effort */}
            <div style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#FEE2E2', border: '1px solid #FECACA' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#991B1B', fontWeight: 700 }}>Effort per screen: ~3.5 days</div>
              <div style={{ fontFamily: 'monospace', fontSize: '8px', color: '#B91C1C', marginTop: '4px' }}>Design + review + QA every time</div>
            </div>

            {/* Feature count bubbles */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
              {['Button A', 'Button A\'', 'Button A\"', 'Input X', 'Input X2', 'Card Y', 'Card Y\''].map((f, i) => (
                <div key={i} style={{ padding: '4px 8px', borderRadius: '6px', background: '#FEE2E2', border: '1px solid #FECACA', fontSize: '8px', color: '#DC2626', fontFamily: 'monospace' }}>{f}</div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ background: '#E5E7EB' }} />

          {/* Right — shovel */}
          <div style={{ background: '#F0FDF4', padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '48px' }}>⛏</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 900, color: '#16A34A', letterSpacing: '0.12em' }}>WITH DESIGN SYSTEM</div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '6px', lineHeight: 1.6 }}>Tokens, components, and patterns pre-built. Teams compose, not create. Consistency is automatic, not reviewed.</div>
            </div>

            {/* Progress bar */}
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#16A34A', fontWeight: 700 }}>Screens shipped</div>
                <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#16A34A', fontWeight: 700 }}>{Math.round(progress.shovel)}%</div>
              </div>
              <div style={{ height: '10px', borderRadius: '5px', background: '#BBF7D0', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${progress.shovel}%` }} transition={{ duration: 0 }}
                  style={{ height: '100%', background: '#22C55E', borderRadius: '5px', boxShadow: '0 0 8px rgba(34,197,94,0.5)' }} />
              </div>
            </div>

            {/* Per-screen effort */}
            <div style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#DCFCE7', border: '1px solid #BBF7D0' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#14532D', fontWeight: 700 }}>Effort per screen: ~0.5 days</div>
              <div style={{ fontFamily: 'monospace', fontSize: '8px', color: '#166534', marginTop: '4px' }}>Compose components, done</div>
            </div>

            {/* Consistent components */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
              {['Button', 'Input', 'Card', 'Modal', 'Badge', 'Table', 'Form'].map((f, i) => (
                <div key={i} style={{ padding: '4px 8px', borderRadius: '6px', background: '#DCFCE7', border: '1px solid #BBF7D0', fontSize: '8px', color: '#16A34A', fontFamily: 'monospace' }}>{f}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Velocity footer */}
        {stage >= 2 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: '#1C1917', padding: '14px 24px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 900, color: '#EF4444' }}>~3.5×</div>
              <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>days per screen (no DS)</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 900, color: '#22C55E' }}>~0.5×</div>
              <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>days per screen (with DS)</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 900, color: '#F97316' }}>7×</div>
              <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>velocity multiplier</div>
            </div>
          </motion.div>
        )}
      </div>
      <InsightBox color="#22C55E" label="Design systems are PM leverage: ">
        {' '}the upfront investment in tokens, components, and patterns pays off every sprint. When you ship a design system, you&apos;re shipping all future screens at a discount.
      </InsightBox>
      <ReplayBtn onReplay={() => { setProgress({ hands: 0, shovel: 0 }); setStage(0); setTick(t => t + 1); }} />
    </div>
  );
}

// ─── M06 · T2 · QBR PYRAMID ────────────────────────────────────────────────────
// A stone pyramid cross-section viewed from the front. 3 layers.
// Base = Data (wide, heavy, many numbers). Middle = Insight (synthesised).
// Apex = Ask (single, sharp, one sentence). Reveal bottom to top.
// Teaches: QBR structure — lead with the Ask, not the data dump.

const PYRAMID_LAYERS = [
  {
    label: 'DATA', y: 280, height: 70, width: 520, color: '#64748B', textColor: '#F1F5F9',
    items: ['DAU: 4,200 (+12% MoM)', 'Week-2 retention: 88%', 'Support tickets: -34%', 'CAC: $680 (-8%)', 'NPS: 52 (+14pts)'],
    desc: 'Raw numbers. Necessary but not sufficient.',
  },
  {
    label: 'INSIGHT', y: 190, height: 90, width: 360, color: '#6366F1', textColor: '#EDE9FE',
    items: ['Onboarding fix drove retention recovery', 'Champions correlate with accounts > 8 seats', 'Support drop = product confidence improving'],
    desc: 'Pattern across the data. One paragraph.',
  },
  {
    label: 'ASK', y: 100, height: 90, width: 200, color: '#F59E0B', textColor: '#FFFBEB',
    items: ['Approve $120K to hire 2 CSMs for enterprise tier before Q3'],
    desc: 'One sentence. One number. One decision.',
  },
];

export function QBRPyramidViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [visible, setVisible] = useState(0);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setVisible(0); setActiveLayer(null);
    PYRAMID_LAYERS.forEach((_, i) => setTimeout(() => setVisible(i + 1), 500 + i * 800));
    setTimeout(() => setActiveLayer(2), 500 + PYRAMID_LAYERS.length * 800 + 200);
  }, [inView, tick]);

  const cx = 310;

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.1)' }}>
        <svg viewBox="0 0 620 420" style={{ width: '100%', display: 'block', background: '#1E1B2E' }}>
          <defs>
            <filter id="pyr-glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          <text x="310" y="30" textAnchor="middle" style={{ fontSize: '9px', fill: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.16em' }}>
            QBR STRUCTURE — TAP LAYER TO INSPECT
          </text>

          {/* Pyramid layers (rendered bottom to top) */}
          {[...PYRAMID_LAYERS].reverse().map((layer, ri) => {
            const i = PYRAMID_LAYERS.length - 1 - ri;
            const show = i < visible;
            const isActive = activeLayer === i;
            const halfW = layer.width / 2;
            const topY = layer.y;
            const botY = layer.y + layer.height;
            const taperRatio = i === 0 ? 1.18 : 1;

            return (
              <g key={layer.label} onClick={() => setActiveLayer(isActive ? null : i)} style={{ cursor: 'pointer' }}>
                {show && (
                  <motion.g initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
                    style={{ transformOrigin: `${cx}px ${botY}px` }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
                    {/* Trapezoid */}
                    <polygon
                      points={`${cx - halfW * 0.7},${topY} ${cx + halfW * 0.7},${topY} ${cx + halfW * taperRatio},${botY} ${cx - halfW * taperRatio},${botY}`}
                      fill={isActive ? layer.color : `${layer.color}55`}
                      stroke={layer.color}
                      strokeWidth={isActive ? 2.5 : 1.5}
                      style={{ transition: 'fill 0.25s' }}
                    />
                    {/* Layer label */}
                    <text x={cx} y={topY + layer.height / 2 + 5} textAnchor="middle"
                      style={{ fontSize: '12px', fill: layer.textColor, fontFamily: 'JetBrains Mono, monospace', fontWeight: 900, letterSpacing: '0.18em', pointerEvents: 'none' }}>
                      {layer.label}
                    </text>

                    {/* Expanded detail panel */}
                    {isActive && (
                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                        <rect x={cx + halfW * 0.75} y={topY + 6} width="175" height={Math.max(40, layer.items.length * 18 + 16)} rx="8"
                          fill="rgba(15,12,30,0.92)" stroke={layer.color} strokeWidth="1.5" />
                        {layer.items.map((item, ii) => (
                          <text key={ii} x={cx + halfW * 0.75 + 10} y={topY + 22 + ii * 17}
                            style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.75)', fontFamily: 'system-ui' }}>
                            · {item}
                          </text>
                        ))}
                      </motion.g>
                    )}
                  </motion.g>
                )}
              </g>
            );
          })}

          {/* Arrow labels on left */}
          {visible >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <text x="50" y="155" textAnchor="middle" style={{ fontSize: '8px', fill: '#F59E0B', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.1em' }}>LEAD WITH</text>
              <text x="50" y="168" textAnchor="middle" style={{ fontSize: '8px', fill: '#F59E0B', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.1em' }}>THIS ↗</text>
              <text x="50" y="390" textAnchor="middle" style={{ fontSize: '8px', fill: '#64748B', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, letterSpacing: '0.06em' }}>BACKUP ↗</text>
              <text x="50" y="403" textAnchor="middle" style={{ fontSize: '8px', fill: '#64748B', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, letterSpacing: '0.06em' }}>MATERIAL</text>
            </motion.g>
          )}

          {visible >= 3 && (
            <motion.text x="310" y="415" textAnchor="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: '9px', fill: 'rgba(245,158,11,0.6)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>
              Most QBRs are built upside-down. Fix the structure.
            </motion.text>
          )}
        </svg>
      </div>
      <InsightBox color="#F59E0B" label="QBR = Ask first, data last: ">
        {' '}open with the one decision you need. Then one paragraph of insight. Then the data appendix. Most teams do this backwards — 40 slides of data and a whispered ask at the end.
      </InsightBox>
      <ReplayBtn onReplay={() => { setVisible(0); setActiveLayer(null); setTick(t => t + 1); }} />
    </div>
  );
}

// ─── M07 · T2 · ACCOUNT HEALTH COCKPIT ────────────────────────────────────────
// An airplane cockpit instrument panel with 6 round analog gauges.
// Each gauge = one account health metric. 2 gauges are in the red zone.
// Teaches: account health needs multiple simultaneous signals — one gauge is never enough.

const GAUGES = [
  { label: 'Engagement Score', value: 28, max: 100, danger: true, unit: '/100', color: '#EF4444' },
  { label: 'License Usage', value: 74, max: 100, danger: false, unit: '%', color: '#22C55E' },
  { label: 'Support Tickets', value: 87, max: 100, danger: true, unit: '/mo', color: '#EF4444' },
  { label: 'NPS Score', value: 52, max: 100, danger: false, unit: 'pts', color: '#22C55E' },
  { label: 'Time to Value', value: 62, max: 100, danger: false, unit: 'days', color: '#F59E0B' },
  { label: 'Expansion Rev', value: 80, max: 100, danger: false, unit: '%', color: '#22C55E' },
];

function Gauge({ label, value, max, danger, unit, color, animate }: typeof GAUGES[0] & { animate: boolean }) {
  const pct = value / max;
  const startAngle = -225;
  const totalArc = 270;
  const angle = startAngle + pct * totalArc;
  const r = 38;
  const cx = 50, cy = 50;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const nx = (deg: number) => cx + r * Math.cos(toRad(deg));
  const ny = (deg: number) => cy + r * Math.sin(toRad(deg));

  // Arc path
  const arcPath = (endAngle: number, radius: number) => {
    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    return `M ${nx(startAngle)} ${ny(startAngle)} A ${radius} ${radius} 0 ${largeArc} 1 ${nx(endAngle)} ${ny(endAngle)}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <svg viewBox="0 0 100 90" style={{ width: '90px', height: '80px' }}>
        {/* Gauge background */}
        <circle cx={cx} cy={cy} r={r + 6} fill="#1A1A2E" />
        <circle cx={cx} cy={cy} r={r + 4} fill="#0F0F1A" stroke={danger ? '#EF444440' : '#22222240'} strokeWidth="1.5" />

        {/* Danger zone arc */}
        {danger && (
          <path d={arcPath(startAngle + 0.25 * totalArc, r)} fill="none" stroke="#EF444430" strokeWidth="8" strokeLinecap="round" />
        )}

        {/* Background arc */}
        <path d={arcPath(startAngle + totalArc, r)} fill="none" stroke="#2D2D3D" strokeWidth="6" strokeLinecap="round" />

        {/* Value arc */}
        {animate && (
          <motion.path d={arcPath(angle, r)} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            style={{ filter: danger ? `drop-shadow(0 0 4px ${color})` : 'none' }} />
        )}

        {/* Needle */}
        {animate && (
          <motion.line
            x1={cx} y1={cy}
            x2={cx + (r - 10) * Math.cos(toRad(angle))}
            y2={cy + (r - 10) * Math.sin(toRad(angle))}
            stroke={color} strokeWidth="2.5" strokeLinecap="round"
            initial={{ rotate: startAngle - angle }} animate={{ rotate: 0 }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          />
        )}

        {/* Centre dot */}
        <circle cx={cx} cy={cy} r="4" fill={color} />

        {/* Value text */}
        <text x={cx} y={cy + 16} textAnchor="middle" style={{ fontSize: '11px', fill: color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 900 }}>
          {value}{unit}
        </text>

        {/* Danger indicator */}
        {danger && (
          <motion.text x={cx} y="84" textAnchor="middle" animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}
            style={{ fontSize: '7px', fill: '#EF4444', fontFamily: 'monospace', fontWeight: 900 }}>
            ⚠ ALERT
          </motion.text>
        )}
      </svg>
      <div style={{ fontFamily: 'monospace', fontSize: '8px', color: danger ? '#EF4444' : 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: '80px', lineHeight: 1.3, fontWeight: danger ? 700 : 400 }}>
        {label}
      </div>
    </div>
  );
}

export function AccountHealthCockpit() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [animating, setAnimating] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setAnimating(false);
    setTimeout(() => setAnimating(true), 400);
  }, [inView, tick]);

  const dangerCount = GAUGES.filter(g => g.danger).length;

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.1)' }}>
        {/* Cockpit header */}
        <div style={{ background: '#0A0A1A', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 900, color: '#94A3B8', letterSpacing: '0.16em' }}>ACCOUNT HEALTH COCKPIT</div>
            <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(148,163,184,0.4)', marginTop: '3px' }}>ACME CORP · PLAN: ENTERPRISE · $180K ARR</div>
          </div>
          {dangerCount > 0 && animating && (
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}
              style={{ padding: '6px 14px', borderRadius: '8px', background: '#7F1D1D', border: '1px solid #EF4444', fontFamily: 'monospace', fontSize: '9px', fontWeight: 900, color: '#FCA5A5', letterSpacing: '0.12em' }}>
              {dangerCount} ALERTS ACTIVE
            </motion.div>
          )}
        </div>

        {/* Gauge panel */}
        <div style={{ background: '#080814', padding: '24px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', justifyItems: 'center', maxWidth: '520px', margin: '0 auto' }}>
            {GAUGES.map((g) => (
              <Gauge key={g.label} {...g} animate={animating} />
            ))}
          </div>
        </div>

        {/* Status bar */}
        {animating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            style={{ background: '#0A0A1A', padding: '10px 20px', borderTop: '1px solid rgba(239,68,68,0.3)', display: 'flex', gap: '24px', alignItems: 'center' }}>
            <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}
              style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#FCA5A5', fontWeight: 700 }}>
              LOW ENGAGEMENT + HIGH SUPPORT TICKETS = CHURN RISK. INTERVENTION REQUIRED.
            </div>
          </motion.div>
        )}
      </div>
      <InsightBox color="#EF4444" label="Never fly on one instrument: ">
        {' '}NPS alone can be 52 while engagement collapses. License usage can look healthy while support tickets spike. Account health is a cockpit, not a single dial. All 6 gauges need to be green.
      </InsightBox>
      <ReplayBtn onReplay={() => { setAnimating(false); setTick(t => t + 1); }} />
    </div>
  );
}

// ─── M08 · T2 · FUNNEL VS LOOP ────────────────────────────────────────────────
// Left: a leaky funnel. 1,000 users enter at the top. At each stage band the
// survivors carry on but a visible spray of dots leaks out to a "LOST" pile on
// the right — 96% gone by the bottom. Right: a compounding loop. 100 seed users
// at the centre; each cycle adds new dots connected by invite-edges to existing
// users. After 4 cycles the network has 7x more nodes. Teaches: funnels leak,
// loops compound — the same underlying number behaves opposite over time.

// Deterministic pseudo-random offset (avoids hydration mismatches)
const fjit = (i: number, salt: number) => ((Math.sin((i + 1) * salt) * 10000) % 1 + 1) % 1;

const FN_STAGES = [
  { label: 'AWARE',  count: 1000, color: '#A78BFA', dark: '#6D28D9', topY: 102, botY: 178, topW: 240, botW: 180 },
  { label: 'TRIAL',  count: 400,  color: '#8B5CF6', dark: '#5B21B6', topY: 188, botY: 264, topW: 180, botW: 124 },
  { label: 'ACTIVE', count: 120,  color: '#7C3AED', dark: '#4C1D95', topY: 274, botY: 350, topW: 124, botW: 70  },
  { label: 'PAID',   count: 40,   color: '#6D28D9', dark: '#3B0764', topY: 360, botY: 432, topW: 70,  botW: 36  },
];

export function FunnelVsLoopViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [fnStage, setFnStage] = useState(0);
  const [loopCycle, setLoopCycle] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setFnStage(0); setLoopCycle(0);
    FN_STAGES.forEach((_, i) => setTimeout(() => setFnStage(i + 1), 500 + i * 700));
    [1,2,3,4].forEach((c) => setTimeout(() => setLoopCycle(c), 500 + c * 800));
  }, [inView, tick]);

  // Centre x for funnel panel: 175 (panel width 350)
  const FN_CX = 175;
  // Centre x for loop panel: 540 (panel width 360)
  const LP_CX = 540;
  const LP_CY = 268;

  // Loop nodes per cycle (concentric, growing)
  const cyclePoints: Array<{ x: number; y: number; cycle: number; parentIdx: number }> = [];
  // Cycle 0: 6 seed users in inner ring
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    cyclePoints.push({ x: LP_CX + Math.cos(ang) * 22, y: LP_CY + Math.sin(ang) * 22, cycle: 0, parentIdx: -1 });
  }
  // Cycle 1: each seed invites 1 → +6 = 12 total
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2 + 0.18;
    cyclePoints.push({ x: LP_CX + Math.cos(ang) * 56, y: LP_CY + Math.sin(ang) * 56, cycle: 1, parentIdx: i });
  }
  // Cycle 2: each cycle-1 invites ~1.3 → +9 ≈ 21 total
  for (let i = 0; i < 9; i++) {
    const ang = (i / 9) * Math.PI * 2 + 0.34;
    cyclePoints.push({ x: LP_CX + Math.cos(ang) * 86, y: LP_CY + Math.sin(ang) * 86, cycle: 2, parentIdx: 6 + (i % 6) });
  }
  // Cycle 3: +12 ≈ 33 total
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2 + 0.5;
    cyclePoints.push({ x: LP_CX + Math.cos(ang) * 116, y: LP_CY + Math.sin(ang) * 116, cycle: 3, parentIdx: 15 + (i % 9) });
  }
  // Cycle 4: +16 ≈ 49 total
  for (let i = 0; i < 16; i++) {
    const ang = (i / 16) * Math.PI * 2 + 0.66;
    cyclePoints.push({ x: LP_CX + Math.cos(ang) * 144, y: LP_CY + Math.sin(ang) * 144, cycle: 4, parentIdx: 27 + (i % 12) });
  }

  // Funnel survivor counts mapped to visible dot scale (÷25, min 1)
  const funnelDots = (count: number) => Math.max(1, Math.round(count / 25));

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.10)' }}>
        <svg viewBox="0 0 720 520" style={{ width: '100%', display: 'block' }}>
          <defs>
            <linearGradient id="fnl-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDF4FF" /><stop offset="100%" stopColor="#FAE8FF" />
            </linearGradient>
            <linearGradient id="lp-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F0FDF4" /><stop offset="100%" stopColor="#DCFCE7" />
            </linearGradient>
            <filter id="fl-soft"><feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.12)"/></filter>
            <filter id="lp-glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* Background panels */}
          <rect x="0" y="0" width="358" height="520" fill="url(#fnl-bg)" />
          <rect x="362" y="0" width="358" height="520" fill="url(#lp-bg)" />
          <line x1="360" y1="0" x2="360" y2="520" stroke="rgba(0,0,0,0.08)" strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="360" cy="260" r="22" fill="#FFFFFF" stroke="rgba(0,0,0,0.15)" strokeWidth="1.2" filter="url(#fl-soft)" />
          <text x="360" y="265" textAnchor="middle" style={{ fontSize: '10px', fill: '#6B7280', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.16em', fontWeight: 900 }}>VS</text>

          {/* ═══ LEFT · FUNNEL ═══ */}
          <text x={FN_CX} y="40" textAnchor="middle" style={{ fontSize: '11px', fill: '#A21CAF', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.2em', fontWeight: 900 }}>TRADITIONAL FUNNEL</text>
          <text x={FN_CX} y="56" textAnchor="middle" style={{ fontSize: '10px', fill: '#86198F', fontFamily: "system-ui", fontStyle: 'italic' }}>linear · lossy · paid traffic refills it</text>

          {/* Top inlet — 40 dots of "1,000 enter" */}
          <text x={FN_CX} y="80" textAnchor="middle" style={{ fontSize: '9px', fill: '#6B7280', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em', fontWeight: 700 }}>1,000 USERS IN</text>
          {Array.from({ length: 40 }).map((_, i) => (
            <circle key={`in-${i}`} cx={FN_CX - 120 + (i % 10) * 26.7 + fjit(i, 17) * 8} cy={88 + Math.floor(i / 10) * 4} r="2.6" fill="#A78BFA" opacity="0.85" />
          ))}

          {/* Funnel stages */}
          {FN_STAGES.map((s, i) => {
            const show = fnStage > i;
            return (
              <motion.g key={s.label} initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }} transition={{ duration: 0.5 }}>
                {/* Trapezoid band */}
                <polygon
                  points={`${FN_CX - s.topW/2},${s.topY} ${FN_CX + s.topW/2},${s.topY} ${FN_CX + s.botW/2},${s.botY} ${FN_CX - s.botW/2},${s.botY}`}
                  fill={`${s.color}22`} stroke={s.color} strokeWidth="1.6"
                />
                {/* Stage label */}
                <text x={FN_CX - s.topW/2 - 6} y={s.topY + 14} textAnchor="end" style={{ fontSize: '9.5px', fill: s.dark, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.18em', fontWeight: 800 }}>{s.label}</text>
                <text x={FN_CX - s.topW/2 - 6} y={s.topY + 28} textAnchor="end" style={{ fontSize: '11px', fill: '#1F2937', fontFamily: "'JetBrains Mono', monospace", fontWeight: 900 }}>{s.count.toLocaleString()}</text>
                {/* Survivor dots inside trapezoid */}
                {Array.from({ length: funnelDots(s.count) }).map((_, di) => {
                  const cols = Math.min(funnelDots(s.count), Math.max(3, Math.floor(s.botW / 9)));
                  const rows = Math.ceil(funnelDots(s.count) / cols);
                  const r = Math.floor(di / cols), c = di % cols;
                  const x = FN_CX - (cols-1)*4 + c*8;
                  const y = s.topY + 38 + r*7;
                  return <circle key={di} cx={x} cy={y} r="2.3" fill={s.color} opacity="0.95" />;
                })}
                {/* Leakage spray — dots streaming out to the right "LOST" pile */}
                {i < FN_STAGES.length - 1 && Array.from({ length: 6 }).map((_, li) => (
                  <motion.circle
                    key={`leak-${li}`}
                    cx={FN_CX + s.botW/2 + 4 + li * 6}
                    cy={s.botY - 4 + li * 3}
                    r="2.2" fill={s.color} opacity={0.5 - li * 0.04}
                    initial={{ x: 0, y: 0 }}
                    animate={{ x: [0, 30 + li * 3, 60 + li * 5], y: [0, 18 + li * 2, 40 + li * 3], opacity: [0.5, 0.4, 0.15] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: li * 0.18 }}
                  />
                ))}
                {/* Leak count label */}
                {i < FN_STAGES.length - 1 && (
                  <text x={FN_CX + s.botW/2 + 26} y={s.botY + 4} style={{ fontSize: '8px', fill: '#DC2626', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>
                    −{s.count - FN_STAGES[i+1].count}
                  </text>
                )}
              </motion.g>
            );
          })}

          {/* "LOST" pile in bottom-right of funnel panel */}
          {fnStage >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
              <rect x="262" y="378" width="86" height="56" rx="6" fill="rgba(220,38,38,0.08)" stroke="#FCA5A5" strokeWidth="0.8" strokeDasharray="3 2" />
              <text x="305" y="394" textAnchor="middle" style={{ fontSize: '8px', fill: '#DC2626', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.16em', fontWeight: 800 }}>LOST</text>
              <text x="305" y="411" textAnchor="middle" style={{ fontSize: '16px', fill: '#DC2626', fontFamily: "'JetBrains Mono', monospace", fontWeight: 900 }}>960</text>
              <text x="305" y="425" textAnchor="middle" style={{ fontSize: '8px', fill: '#7F1D1D', fontFamily: "system-ui", fontStyle: 'italic' }}>require paid refill</text>
            </motion.g>
          )}

          {/* Final survivors marker */}
          {fnStage >= FN_STAGES.length && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <text x={FN_CX} y="455" textAnchor="middle" style={{ fontSize: '9px', fill: '#6B7280', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em', fontWeight: 700 }}>SURVIVORS</text>
              <text x={FN_CX} y="478" textAnchor="middle" style={{ fontSize: '26px', fill: '#6D28D9', fontFamily: "'JetBrains Mono', monospace", fontWeight: 900 }}>40</text>
              <text x={FN_CX} y="496" textAnchor="middle" style={{ fontSize: '9px', fill: '#86198F', fontFamily: "system-ui", fontStyle: 'italic' }}>4% conversion · 96% lost</text>
            </motion.g>
          )}

          {/* ═══ RIGHT · LOOP ═══ */}
          <text x={LP_CX} y="40" textAnchor="middle" style={{ fontSize: '11px', fill: '#15803D', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.2em', fontWeight: 900 }}>PRODUCT-LED LOOP</text>
          <text x={LP_CX} y="56" textAnchor="middle" style={{ fontSize: '10px', fill: '#166534', fontFamily: "system-ui", fontStyle: 'italic' }}>viral · compounding · refills itself</text>

          <text x={LP_CX} y="80" textAnchor="middle" style={{ fontSize: '9px', fill: '#6B7280', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em', fontWeight: 700 }}>1,000 SEED USERS</text>

          {/* Cycle rings (visual elevation) */}
          {[22, 56, 86, 116, 144].map((r, i) => (
            <circle key={i} cx={LP_CX} cy={LP_CY} r={r} fill="none" stroke="#86EFAC" strokeWidth="0.5" strokeDasharray="2 3" opacity={loopCycle >= i ? 0.5 : 0} />
          ))}

          {/* Invite edges */}
          {cyclePoints.map((p, i) => {
            if (p.parentIdx < 0) return null;
            if (loopCycle < p.cycle) return null;
            const parent = cyclePoints[p.parentIdx];
            return (
              <motion.line key={`e${i}`}
                x1={parent.x} y1={parent.y} x2={p.x} y2={p.y}
                stroke="#22C55E" strokeWidth="0.9" opacity="0.55"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }}
              />
            );
          })}

          {/* Loop nodes */}
          {cyclePoints.map((p, i) => {
            if (loopCycle < p.cycle) return null;
            const isSeed = p.cycle === 0;
            return (
              <motion.g key={`n${i}`} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }} transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.1 + (i * 0.015) }}>
                <circle cx={p.x} cy={p.y} r={isSeed ? 5 : 3.6} fill={isSeed ? '#15803D' : '#22C55E'} stroke="#FFF" strokeWidth="1.2" filter="url(#lp-glow)" />
              </motion.g>
            );
          })}

          {/* Centre seed label */}
          <circle cx={LP_CX} cy={LP_CY} r="6" fill="#15803D" stroke="#FFF" strokeWidth="1.4" />
          <text x={LP_CX} y={LP_CY + 2} textAnchor="middle" style={{ fontSize: '6px', fill: '#FFF', fontFamily: "'JetBrains Mono', monospace", fontWeight: 900 }}>1k</text>

          {/* Cycle counters */}
          {[1,2,3,4].map((c) => {
            const counts = [1000, 1400, 2100, 3150, 4730];
            const show = loopCycle >= c;
            const angle = (c - 0.5) / 4 * Math.PI - Math.PI / 2;
            const lx = LP_CX + Math.cos(angle) * 168;
            const ly = LP_CY + Math.sin(angle) * 168;
            return show ? (
              <motion.g key={c} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.4 }}>
                <rect x={lx - 28} y={ly - 12} width="56" height="24" rx="4" fill="#FFFFFF" stroke="#22C55E" strokeWidth="0.8" filter="url(#fl-soft)" />
                <text x={lx} y={ly - 1} textAnchor="middle" style={{ fontSize: '7px', fill: '#15803D', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', fontWeight: 800 }}>{`C${c}`}</text>
                <text x={lx} y={ly + 8} textAnchor="middle" style={{ fontSize: '9px', fill: '#1F2937', fontFamily: "'JetBrains Mono', monospace", fontWeight: 900 }}>{counts[c].toLocaleString()}</text>
              </motion.g>
            ) : null;
          })}

          {/* Loop final result */}
          {loopCycle >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
              <text x={LP_CX} y="455" textAnchor="middle" style={{ fontSize: '9px', fill: '#6B7280', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em', fontWeight: 700 }}>AFTER 4 CYCLES</text>
              <text x={LP_CX} y="478" textAnchor="middle" style={{ fontSize: '26px', fill: '#15803D', fontFamily: "'JetBrains Mono', monospace", fontWeight: 900 }}>4,730</text>
              <text x={LP_CX} y="496" textAnchor="middle" style={{ fontSize: '9px', fill: '#166534', fontFamily: "system-ui", fontStyle: 'italic' }}>k = 1.4 · loop refills itself</text>
            </motion.g>
          )}
        </svg>
      </div>
      <InsightBox color="#22C55E" label="Funnels leak. Loops compound. ">
        {' '}Same 1,000 users, two physics. In a funnel each stage subtracts; you finish with 40 and need paid traffic to refill. In a loop each cycle multiplies; same 1,000 reach 4,730 in four cycles because every delighted user invites the next. The funnel costs CAC every month. The loop pays itself back.
      </InsightBox>
      <ReplayBtn onReplay={() => { setFnStage(0); setLoopCycle(0); setTick(t => t + 1); }} />
    </div>
  );
}

// ─── M09 · T2 · TECH DEBT FOUNDATION ──────────────────────────────────────────
// A building cross-section viewed from the front. Floors = features shipped.
// Foundation shows cracks that grow as more floors are added.
// Teaches: tech debt is a structural problem — adding features on a cracked
// foundation makes everything eventually unstable.

const FLOORS = [
  { label: 'Dark Mode', year: 'Y1' },
  { label: 'API v2', year: 'Y1' },
  { label: 'Bulk Actions', year: 'Y2' },
  { label: 'Analytics Tab', year: 'Y2' },
  { label: 'Integrations', year: 'Y3' },
  { label: 'AI Coaching', year: 'Y3' },
];

const CRACKS = [
  { x1: 120, y1: 340, x2: 145, y2: 360, x3: 138, y3: 375 },
  { x1: 280, y1: 345, x2: 265, y2: 368, x3: 278, y3: 380 },
  { x1: 350, y1: 338, x2: 370, y2: 355, x3: 362, y3: 372 },
  { x1: 440, y1: 343, x2: 428, y2: 363, x3: 440, y3: 378 },
];

export function TechDebtFoundationViz() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [floorsVisible, setFloorsVisible] = useState(0);
  const [cracksVisible, setCracksVisible] = useState(0);
  const [warning, setWarning] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setFloorsVisible(0); setCracksVisible(0); setWarning(false);
    FLOORS.forEach((_, i) => {
      setTimeout(() => {
        setFloorsVisible(i + 1);
        if (i >= 2) setCracksVisible(prev => Math.min(prev + 1, CRACKS.length));
      }, 500 + i * 600);
    });
    setTimeout(() => setWarning(true), 500 + FLOORS.length * 600 + 400);
  }, [inView, tick]);

  const buildingLeft = 80;
  const buildingRight = 540;
  const buildingW = buildingRight - buildingLeft;
  const floorH = 42;
  const foundY = 340;

  return (
    <div ref={ref} style={{ margin: '36px 0' }}>
      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 20px 48px rgba(0,0,0,0.1)' }}>
        <svg viewBox="0 0 620 450" style={{ width: '100%', display: 'block' }}>
          <defs>
            <linearGradient id="sky-td" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DBEAFE" />
              <stop offset="100%" stopColor="#EFF6FF" />
            </linearGradient>
            <linearGradient id="ground-td" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6B4C2A" />
              <stop offset="100%" stopColor="#3B2206" />
            </linearGradient>
            <linearGradient id="wall-td" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <filter id="crack-glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* Sky */}
          <rect x="0" y="0" width="620" height="350" fill="url(#sky-td)" />

          {/* Ground */}
          <rect x="0" y="385" width="620" height="65" fill="url(#ground-td)" />
          <rect x="0" y="385" width="620" height="6" fill="#8B6340" />

          {/* Building floors — rendered bottom to top */}
          {FLOORS.map((floor, i) => {
            const fi = FLOORS.length - 1 - i;
            const show = fi < floorsVisible;
            const floorY = foundY - (fi + 1) * floorH;
            const danger = fi >= 4;
            return (
              <g key={floor.label}>
                {show && (
                  <motion.g initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
                    style={{ transformOrigin: `310px ${floorY + floorH}px` }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
                    {/* Floor slab */}
                    <rect x={buildingLeft} y={floorY} width={buildingW} height={floorH - 2} fill={danger ? '#FEF3C7' : '#F1F5F9'} stroke={danger ? '#F59E0B' : '#CBD5E1'} strokeWidth="1.5" />
                    {/* Window grid */}
                    {[0.2, 0.4, 0.6, 0.8].map((wx, wi) => (
                      <rect key={wi} x={buildingLeft + buildingW * wx - 14} y={floorY + 8} width="28" height="22" rx="3"
                        fill={danger ? '#FEF08A' : '#BFDBFE'} stroke={danger ? '#F59E0B' : '#93C5FD'} strokeWidth="1" opacity="0.8" />
                    ))}
                    {/* Floor label */}
                    <text x={buildingLeft + buildingW * 0.92} y={floorY + 26} textAnchor="middle"
                      style={{ fontSize: '7px', fill: danger ? '#92400E' : '#475569', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800 }}>
                      {floor.label}
                    </text>
                    {/* Year tag */}
                    <rect x={buildingLeft + 6} y={floorY + 13} width="26" height="14" rx="3" fill={danger ? '#F59E0B' : '#6366F1'} opacity="0.8" />
                    <text x={buildingLeft + 19} y={floorY + 24} textAnchor="middle"
                      style={{ fontSize: '7px', fill: '#fff', fontFamily: 'monospace', fontWeight: 900 }}>
                      {floor.year}
                    </text>
                    {/* Warning on top floors */}
                    {danger && warning && (
                      <motion.text x="310" y={floorY + 26} textAnchor="middle"
                        animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.9 }}
                        style={{ fontSize: '9px', fill: '#DC2626', fontFamily: 'monospace', fontWeight: 700 }}>
                        ⚠ UNSTABLE
                      </motion.text>
                    )}
                  </motion.g>
                )}
              </g>
            );
          })}

          {/* Building walls */}
          {floorsVisible > 0 && (
            <>
              <line x1={buildingLeft} y1={foundY} x2={buildingLeft} y2={foundY - floorsVisible * floorH} stroke="#94A3B8" strokeWidth="3" />
              <line x1={buildingRight} y1={foundY} x2={buildingRight} y2={foundY - floorsVisible * floorH} stroke="#94A3B8" strokeWidth="3" />
            </>
          )}

          {/* Foundation */}
          <rect x={buildingLeft - 20} y={foundY} width={buildingW + 40} height="30" fill="#78716C" stroke="#57534E" strokeWidth="2" />
          <text x="310" y={foundY + 19} textAnchor="middle"
            style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.7)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.12em' }}>
            LEGACY CODEBASE · CIRCA 2019
          </text>

          {/* Cracks */}
          {CRACKS.map((c, ci) => {
            const show = ci < cracksVisible;
            return show && (
              <motion.g key={ci} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                filter="url(#crack-glow)">
                <polyline points={`${c.x1},${c.y1} ${c.x2},${c.y2} ${c.x3},${c.y3}`}
                  fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  opacity="0.85" />
                {/* Crack extends up into wall */}
                <motion.line x1={c.x1} y1={c.y1} x2={c.x1 + (c.x2 - c.x1) * 0.5} y2={c.y1 - 30}
                  stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.8 }} />
              </motion.g>
            );
          })}

          {/* Debt label */}
          {cracksVisible >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <rect x="10" y="346" width="60" height="24" rx="6" fill="rgba(239,68,68,0.12)" stroke="#EF444450" strokeWidth="1" />
              <text x="40" y="362" textAnchor="middle" style={{ fontSize: '7px', fill: '#EF4444', fontFamily: 'monospace', fontWeight: 900, letterSpacing: '0.08em' }}>TECH DEBT</text>
            </motion.g>
          )}

          {/* Ground label */}
          <text x="310" y="415" textAnchor="middle" style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>
            THE GROUND DOESN'T CARE HOW MANY FLOORS YOU'VE SHIPPED
          </text>

          {warning && (
            <motion.text x="310" y="440" textAnchor="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: '9px', fill: '#EF4444', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, letterSpacing: '0.06em' }}>
              4 cracks visible · 2 floors at risk · refactor now or evacuate later
            </motion.text>
          )}
        </svg>
      </div>
      <InsightBox color="#EF4444" label="Tech debt is a foundation problem: ">
        {' '}every feature you ship on a cracked foundation increases structural risk. The crack doesn&apos;t care about your roadmap. Refactor early (cheap) or face a rewrite when the building sways (very expensive).
      </InsightBox>
      <ReplayBtn onReplay={() => { setFloorsVisible(0); setCracksVisible(0); setWarning(false); setTick(t => t + 1); }} />
    </div>
  );
}

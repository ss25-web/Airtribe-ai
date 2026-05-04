'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ShellProps = {
  title: string;
  caption: string;
  children: React.ReactNode;
};

type TintCardProps = {
  accent: string;
  label: string;
  text: string;
  active?: boolean;
  minHeight?: number;
};

const PM_INDIGO = '#6A57E8';
const PM_TEAL = '#2C9DB6';
const PM_CORAL = '#E68760';
const PM_GREEN = '#52B281';
const PM_ROSE = '#D96D92';
const PM_LAVENDER = '#A18AF0';

const surfaceShadow = '0 12px 24px rgba(28, 24, 20, 0.08)';
const raisedShadow = (accent: string) =>
  `0 18px 28px ${accent}1c, 0 6px 0 ${accent}14, inset 0 1px 0 rgba(255,255,255,0.42)`;

const Shell = ({ title, caption, children }: ShellProps) => (
  <div style={{ margin: '34px 0 40px' }}>
    <div
      style={{
        fontSize: '18px',
        fontWeight: 800,
        color: 'var(--ed-ink)',
        lineHeight: 1.22,
        marginBottom: '18px',
        maxWidth: '700px',
      }}
    >
      {title}
    </div>
    {children}
    <div
      style={{
        paddingTop: '14px',
        fontSize: '12px',
        lineHeight: 1.72,
        color: 'var(--ed-ink3)',
      }}
    >
      {caption}
    </div>
  </div>
);

const Stage = ({ children, height = 470 }: { children: React.ReactNode; height?: number }) => (
  <div
    style={{
      position: 'relative',
      height,
      overflow: 'visible',
      borderRadius: '36px',
      background:
        'radial-gradient(circle at 50% 46%, rgba(106,87,232,0.16) 0%, rgba(106,87,232,0.07) 24%, rgba(44,157,182,0.04) 42%, transparent 70%)',
    }}
  >
    {children}
  </div>
);

const TintCard = ({ accent, label, text, active = false, minHeight = 132 }: TintCardProps) => (
  <motion.div
    animate={{
      y: active ? -5 : 0,
      scale: active ? 1.015 : 1,
      boxShadow: active ? raisedShadow(accent) : surfaceShadow,
    }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    style={{
      position: 'relative',
      borderRadius: '28px',
      minHeight,
      padding: '18px 18px 16px',
      background: `linear-gradient(160deg, color-mix(in srgb, var(--ed-card) 92%, ${accent} 8%) 0%, color-mix(in srgb, var(--ed-card) 84%, ${accent} 16%) 100%)`,
      border: `1px solid color-mix(in srgb, ${accent} 30%, var(--ed-rule) 70%)`,
      overflow: 'hidden',
    }}
  >
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 'auto 18px -12px 18px',
        height: '18px',
        borderRadius: '999px',
        background: `${accent}18`,
        filter: 'blur(8px)',
      }}
    />
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '999px',
          background: `linear-gradient(145deg, color-mix(in srgb, var(--ed-card) 28%, ${accent} 72%), ${accent})`,
          boxShadow: `0 5px 14px ${accent}22`,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '8px',
          fontWeight: 800,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: accent,
        }}
      >
        {label}
      </div>
    </div>
    <div style={{ fontSize: '13px', lineHeight: 1.64, color: 'var(--ed-ink2)', fontWeight: 650 }}>{text}</div>
  </motion.div>
);

const SummaryStrip = ({ accent, label, text }: { accent: string; label: string; text: string }) => (
  <div
    style={{
      flex: '1 1 260px',
      borderRadius: '20px',
      padding: '14px 16px',
      background: `linear-gradient(160deg, color-mix(in srgb, var(--ed-card) 94%, ${accent} 6%) 0%, color-mix(in srgb, var(--ed-card) 88%, ${accent} 12%) 100%)`,
      border: `1px solid color-mix(in srgb, ${accent} 24%, var(--ed-rule) 76%)`,
      boxShadow: surfaceShadow,
    }}
  >
    <div
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '8px',
        fontWeight: 800,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: accent,
        marginBottom: '8px',
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: '12px', lineHeight: 1.66, color: 'var(--ed-ink2)' }}>{text}</div>
  </div>
);

const ConnectorLine = ({
  x1,
  y1,
  x2,
  y2,
  stroke,
  delay = 0,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  delay?: number;
}) => (
  <motion.line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke={stroke}
    strokeWidth="3"
    strokeLinecap="round"
    initial={{ pathLength: 0.3, opacity: 0.3 }}
    animate={{ pathLength: [0.3, 1, 0.3], opacity: [0.24, 0.72, 0.24] }}
    transition={{ duration: 2.4, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
);

export function DecisionRippleVisual() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((v) => (v + 1) % 4), 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <Shell
      title="A PM decision ripples across the whole system."
      caption="One product decision propagates through user experience, team coordination, business outcomes, and measurement at the same time."
    >
      <Stage height={540}>
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 540"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <defs>
            <radialGradient id="pmGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(106,87,232,0.26)" />
              <stop offset="55%" stopColor="rgba(106,87,232,0.08)" />
              <stop offset="100%" stopColor="rgba(106,87,232,0)" />
            </radialGradient>
          </defs>
          <ellipse cx="500" cy="270" rx="192" ry="150" fill="url(#pmGlow)" />
          <ConnectorLine x1={500} y1={270} x2={500} y2={118} stroke={PM_TEAL} />
          <ConnectorLine x1={500} y1={270} x2={228} y2={270} stroke={PM_LAVENDER} delay={0.2} />
          <ConnectorLine x1={500} y1={270} x2={772} y2={270} stroke={PM_CORAL} delay={0.4} />
          <ConnectorLine x1={500} y1={270} x2={500} y2={430} stroke={PM_GREEN} delay={0.6} />
        </svg>

        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '1fr 180px 1fr',
            gridTemplateRows: '136px 176px 136px',
            gap: '26px 36px',
            alignItems: 'center',
            height: '100%',
            padding: '28px 28px',
          }}
        >
          <div style={{ gridColumn: '2', gridRow: '1', width: '260px', justifySelf: 'center' }}>
            <TintCard
              accent={PM_TEAL}
              label="User Friction"
              text="Someone cannot find last Tuesday's call."
              active={active === 0}
            />
          </div>

          <div style={{ gridColumn: '1', gridRow: '2' }}>
            <TintCard
              accent={PM_LAVENDER}
              label="Team Alignment"
              text="Design, engineering, and PM need the same problem frame."
              active={active === 1}
            />
          </div>

          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: [0, 2, 0],
              scale: active === 0 ? [1, 1.02, 1] : 1,
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              gridColumn: '2',
              gridRow: '2',
              width: '170px',
              height: '170px',
              justifySelf: 'center',
              alignSelf: 'center',
              position: 'relative',
              zIndex: 2,
              borderRadius: '46px',
              background: `linear-gradient(160deg, ${PM_INDIGO} 0%, #5842dd 58%, #3f2ab7 100%)`,
              boxShadow: '0 24px 36px rgba(90,66,221,0.24), 0 8px 0 rgba(63,42,183,0.32), inset 0 1px 0 rgba(255,255,255,0.42)',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '16px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 'auto 18px -14px',
                height: '24px',
                borderRadius: '999px',
                background: 'rgba(90,66,221,0.22)',
                filter: 'blur(10px)',
              }}
            />
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.16em', fontWeight: 800 }}>
              PM CALL
            </div>
            <div style={{ fontSize: '17px', lineHeight: 1.38, fontWeight: 800, marginTop: '10px' }}>
              What is worth solving now?
            </div>
          </motion.div>

          <div style={{ gridColumn: '3', gridRow: '2' }}>
            <TintCard
              accent={PM_CORAL}
              label="Business Outcome"
              text="The fix should reduce churn, not just look cleaner."
              active={active === 2}
            />
          </div>

          <div style={{ gridColumn: '2', gridRow: '3', width: '260px', justifySelf: 'center' }}>
            <TintCard
              accent={PM_GREEN}
              label="Success Metric"
              text="Did users find recordings in under 30 seconds?"
              active={active === 3}
            />
          </div>
        </div>
      </Stage>
    </Shell>
  );
}

export function ProblemSolutionDriftVisual() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive(v => (v + 1) % 5), 1500);
    return () => clearInterval(timer);
  }, []);

  // Fixed pixel dimensions — guarantees card 04 sits exactly under card 03
  const CW = 176; // card width
  const AW = 52;  // arrow width
  // Total row width = CW*3 + AW*2 = 528 + 104 = 632
  // Card 03 starts at CW*2 + AW*2 = 456. Bottom spacer = CW + AW = 228 → 05(CW) + ←(AW) + 04(CW)

  const STEPS = [
    { num: '01', label: 'COMPLAINT',    desc: 'The app is confusing.',     color: '#E8875A', icon: '💬' },
    { num: '02', label: 'WRONG JUMP',   desc: 'Redesign navigation.',      color: '#D96D92', icon: '🧭' },
    { num: '03', label: 'REWIND',       desc: 'Stop. Ask what happened.',  color: '#7B6BD1', icon: '⏮' },
    { num: '04', label: 'ACTUAL TASK',  desc: 'Find last Tuesday call.',   color: '#2C9DB6', icon: '🔍' },
    { num: '05', label: 'REAL BLOCKER', desc: 'Search, not layout.',       color: '#52B281', icon: '📄' },
  ];

  const FOOTERS = [
    { color: '#E8875A', title: 'Symptoms feel urgent',    desc: 'Complaints arrive with emotional weight.' },
    { color: '#D96D92', title: 'Strong motion slows',     desc: 'Avoid solutioning until the problem is clear.' },
    { color: '#7B6BD1', title: 'Reframe the question',    desc: 'Ask what the user was trying to do, not what broke.' },
    { color: '#2C9DB6', title: 'Solve the right thing',   desc: 'Fix the blocker that prevents progress.' },
    { color: '#52B281', title: 'Measure the outcome',     desc: 'Check if the real task gets done.' },
  ];

  // Card component — uses CW for exact width matching
  const StepCard = ({ step, idx }: { step: typeof STEPS[0]; idx: number }) => {
    const isActive = active === idx;
    return (
      <motion.div
        animate={{
          y: isActive ? -8 : 0,
          boxShadow: isActive
            ? `0 20px 32px ${step.color}2a, 0 6px 0 ${step.color}20`
            : `0 6px 18px rgba(0,0,0,0.09), 0 4px 0 rgba(0,0,0,0.06)`,
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          width: `${CW}px`, flexShrink: 0,
          borderRadius: '22px',
          background: `linear-gradient(145deg, var(--ed-card), color-mix(in srgb, var(--ed-card) 86%, ${step.color} 14%))`,
          border: `1px solid color-mix(in srgb, ${step.color} 24%, var(--ed-rule) 76%)`,
          padding: '18px 14px 16px', position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: '12px', right: '12px', fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', fontWeight: 800, color: step.color, opacity: 0.6 }}>
          {step.num}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(145deg, ${step.color}bb, ${step.color})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', boxShadow: `0 8px 20px ${step.color}45` }}>
            {step.icon}
          </div>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 800, letterSpacing: '0.11em', color: step.color, marginBottom: '6px', textAlign: 'center' as const }}>
          {step.label}
        </div>
        <div style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--ed-ink2)', fontWeight: 500, textAlign: 'center' as const }}>
          {step.desc}
        </div>
      </motion.div>
    );
  };

  const ClayArrow = ({
    c1,
    c2,
    direction = 'right',
  }: {
    c1: string;
    c2: string;
    direction?: 'right' | 'left' | 'down';
  }) => {
    const isVertical = direction === 'down';
    const railStyle: React.CSSProperties = {
      width: isVertical ? 13 : 34,
      height: isVertical ? 28 : 13,
      borderRadius: '999px',
      background: isVertical
        ? `linear-gradient(180deg, ${c1} 0%, ${c2} 100%)`
        : `linear-gradient(90deg, ${c1} 0%, ${c2} 100%)`,
      boxShadow: `0 8px 14px ${c2}28, inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -2px 0 rgba(0,0,0,0.12)`,
      opacity: 0.95,
    };

    const headStyle: React.CSSProperties = {
      width: 22,
      height: 22,
      borderRadius: '7px',
      background: `linear-gradient(145deg, color-mix(in srgb, var(--ed-card) 18%, ${c2} 82%) 0%, ${c2} 100%)`,
      boxShadow: `0 9px 15px ${c2}2e, inset 0 1px 0 rgba(255,255,255,0.48), inset 0 -2px 0 rgba(0,0,0,0.14)`,
      clipPath: 'polygon(18% 8%, 100% 50%, 18% 92%, 36% 50%)',
      transform:
        direction === 'left'
          ? 'rotate(180deg)'
          : direction === 'down'
            ? 'rotate(90deg)'
            : undefined,
    };

    return (
      <motion.div
        animate={isVertical ? { y: [0, 4, 0] } : { x: direction === 'left' ? [0, -4, 0] : [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: isVertical ? CW : AW,
          height: isVertical ? 46 : 42,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection:
            direction === 'left'
              ? 'row-reverse'
              : direction === 'down'
                ? 'column'
                : 'row',
          gap: isVertical ? 0 : -2,
        }}
      >
        <div style={railStyle} />
        <div style={{ ...headStyle, marginLeft: direction === 'right' ? -4 : 0, marginRight: direction === 'left' ? -4 : 0, marginTop: direction === 'down' ? -4 : 0 }} />
      </motion.div>
    );
  };

  const ArrowR = ({ c1, c2 }: { c1: string; c2: string }) => <ClayArrow c1={c1} c2={c2} direction="right" />;
  const ArrowL = ({ c1, c2 }: { c1: string; c2: string }) => <ClayArrow c1={c1} c2={c2} direction="left" />;

  return (
    <Shell title="The instinctive solution drifts. The right workflow rewinds first." caption="">
      <div style={{ fontSize: '14px', color: 'var(--ed-ink3)', lineHeight: 1.65, marginBottom: '24px', marginTop: '-8px' }}>
        Strong PM motion slows down, reframes the user task, and only then narrows to a fix.
      </div>

      {/* ── DIAGRAM — fixed-width container guarantees pixel-perfect alignment ── */}
      <div style={{ padding: '8px 0 0' }}>
        {/* Fixed-width inner — CW*3 + AW*2 = 632px */}
        <div style={{ width: `${CW * 3 + AW * 2}px`, margin: '0 auto' }}>

          {/* ROW 1 — 01 → 02 → 03 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <StepCard step={STEPS[0]} idx={0} />
            <ArrowR c1={STEPS[0].color} c2={STEPS[1].color} />
            <StepCard step={STEPS[1]} idx={1} />
            <ArrowR c1={STEPS[1].color} c2={STEPS[2].color} />
            <StepCard step={STEPS[2]} idx={2} />
          </div>

          {/* VERTICAL ARROW — 03 ↓ 04
              Spacer = CW*2 + AW*2 pushes arrow to sit over card 03 center */}
          <div style={{ display: 'flex', alignItems: 'center', height: '46px' }}>
            <div style={{ width: `${CW * 2 + AW * 2}px`, flexShrink: 0 }} />
            <ClayArrow c1={STEPS[2].color} c2={STEPS[3].color} direction="down" />
          </div>

          {/* ROW 2 — [spacer CW+AW] [05] [←] [04]
              04 starts at CW*2+AW*2 = 456 → same x as card 03 ✓ */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: `${CW + AW}px`, flexShrink: 0 }} />
            <StepCard step={STEPS[4]} idx={4} />
            <ArrowL c1={STEPS[3].color} c2={STEPS[4].color} />
            <StepCard step={STEPS[3]} idx={3} />
          </div>
        </div>
      </div>

      {/* ── FOOTER STRIP ── */}
      <div style={{
        display: 'flex', marginTop: '18px',
        paddingTop: '14px', borderTop: '1px solid var(--ed-rule)',
      }}>
        {FOOTERS.map((f, i) => (
          <div key={i} style={{
            flex: 1, display: 'flex', alignItems: 'flex-start', gap: '7px',
            padding: '0 10px',
            borderRight: i < 4 ? '1px solid var(--ed-rule)' : 'none',
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: `linear-gradient(145deg, ${f.color}bb 0%, ${f.color} 100%)`,
              flexShrink: 0, marginTop: '1px',
            }} />
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '2px', lineHeight: 1.3 }}>
                {f.title}
              </div>
              <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', lineHeight: 1.45 }}>
                {f.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CLOSING QUOTE ── */}
      <div style={{
        marginTop: '16px', padding: '14px 18px', borderRadius: '12px',
        background: 'rgba(106,87,232,0.05)', border: '1px solid rgba(106,87,232,0.14)',
        display: 'flex', alignItems: 'flex-start', gap: '10px',
      }}>
        <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>⭐</span>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '3px' }}>
            One loop. Every product decision you&apos;ll ever make.
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', fontStyle: 'italic', lineHeight: 1.55 }}>
            Don&apos;t just ship features. Solve the real problem, then prove it worked.
          </div>
        </div>
      </div>
    </Shell>
  );
}

export function DecisionQualitySplitVisual() {
  const quadrants = [
    {
      id: 'dangerous',
      title: 'Dangerous Win',
      process: 'Weak process',
      result: 'Good outcome',
      accent: PM_CORAL,
      x: 0,
      lesson: 'Luck can reward the wrong reasoning. This is the quadrant that quietly trains bad PM judgment.',
      move: 'Replay the assumptions before celebrating the metric.',
    },
    {
      id: 'validated',
      title: 'Validated Win',
      process: 'Strong process',
      result: 'Good outcome',
      accent: PM_GREEN,
      x: 1,
      lesson: 'The outcome supports the reasoning. Capture the decision pattern so the team can reuse it.',
      move: 'Document what mattered, what was ignored, and why.',
    },
    {
      id: 'expected',
      title: 'Expected Miss',
      process: 'Weak process',
      result: 'Bad outcome',
      accent: PM_CORAL,
      x: 0,
      lesson: 'Bad process met a bad result. The fix starts with the decision method, not the next feature idea.',
      move: 'Reset the frame and gather the missing evidence.',
    },
    {
      id: 'unlucky',
      title: 'Unlucky Miss',
      process: 'Strong process',
      result: 'Bad outcome',
      accent: PM_TEAL,
      x: 1,
      lesson: 'A good call can still lose when context shifts. Do not punish the team for uncertainty it could not control.',
      move: 'Separate external change from flawed reasoning.',
    },
  ];
  const [activeId, setActiveId] = useState('dangerous');
  const active = quadrants.find(q => q.id === activeId) ?? quadrants[0];

  return (
    <Shell
      title="Decision quality and outcome quality move on different layers."
      caption="Senior PM growth starts when we stop grading ourselves only by what happened. The process and the outcome must be inspected separately."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 260px', gap: '24px', alignItems: 'stretch' }}>
        <div style={{ position: 'relative', minHeight: '360px', padding: '10px 0', perspective: '900px' }}>
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: '100%' }}>
            {quadrants.map(q => {
              const isActive = activeId === q.id;
              return (
                <motion.button
                  key={q.id}
                  type="button"
                  onClick={() => setActiveId(q.id)}
                  whileHover={{ y: -8, rotateX: 5, rotateY: q.x === 0 ? -4 : 4 }}
                  animate={{
                    y: isActive ? -10 : 0,
                    scale: isActive ? 1.035 : 1,
                    boxShadow: isActive
                      ? `0 22px 34px ${q.accent}30, 0 8px 0 ${q.accent}24, inset 0 1px 0 rgba(255,255,255,0.18)`
                      : `0 12px 22px ${q.accent}18, 0 5px 0 ${q.accent}14, inset 0 1px 0 rgba(255,255,255,0.12)`,
                  }}
                  transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                  style={{
                    border: `1px solid ${q.accent}33`,
                    borderRadius: 26,
                    background: `linear-gradient(145deg, var(--ed-card), ${q.accent}10)`,
                    padding: '20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transformStyle: 'preserve-3d',
                    minHeight: 138,
                  }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: 14, background: `linear-gradient(145deg, var(--ed-card), ${q.accent}44)`, boxShadow: `0 10px 18px ${q.accent}24`, marginBottom: 14 }} />
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 800, letterSpacing: '0.14em', color: q.accent, marginBottom: 8, textTransform: 'uppercase' }}>{q.result}</div>
                  <div style={{ fontSize: 18, fontWeight: 850, color: 'var(--ed-ink)', lineHeight: 1.15, marginBottom: 8 }}>{q.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--ed-ink3)', lineHeight: 1.45 }}>{q.process}</div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <motion.div
          key={active.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            borderRadius: 24,
            padding: '22px 20px',
            background: `linear-gradient(145deg, var(--ed-card), ${active.accent}12)`,
            border: `1px solid ${active.accent}30`,
            boxShadow: `0 16px 26px ${active.accent}1c, 0 6px 0 ${active.accent}16, inset 0 1px 0 rgba(255,255,255,0.14)`,
            alignSelf: 'center',
          }}
        >
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 800, letterSpacing: '0.14em', color: active.accent, marginBottom: 8 }}>WHAT TO LEARN</div>
          <div style={{ fontSize: 22, fontWeight: 850, color: 'var(--ed-ink)', marginBottom: 12 }}>{active.title}</div>
          <div style={{ fontSize: 13, color: 'var(--ed-ink2)', lineHeight: 1.65, marginBottom: 16 }}>{active.lesson}</div>
          <div style={{ borderTop: '1px solid var(--ed-rule)', paddingTop: 14 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 800, letterSpacing: '0.14em', color: active.accent, marginBottom: 6 }}>NEXT MOVE</div>
            <div style={{ fontSize: 12, color: 'var(--ed-ink3)', lineHeight: 1.55 }}>{active.move}</div>
          </div>
        </motion.div>
      </div>
    </Shell>
  );
}

export function TradeoffPrismVisual() {
  const tradeoffs = {
    business: {
      label: 'Business',
      accent: PM_CORAL,
      values: { business: 92, user: 58, tech: 44 },
      cost: 'Revenue clarity rises, but user trust and engineering flexibility get compressed.',
      compresses: 'User empathy and system health',
    },
    user: {
      label: 'User',
      accent: PM_GREEN,
      values: { business: 60, user: 92, tech: 56 },
      cost: 'User fit improves, but the roadmap needs a sharper revenue story and tighter scope.',
      compresses: 'Commercial focus and delivery speed',
    },
    tech: {
      label: 'Tech',
      accent: PM_TEAL,
      values: { business: 52, user: 64, tech: 92 },
      cost: 'Architecture gets stronger, but stakeholders feel the slower feature pulse immediately.',
      compresses: 'Short-term growth and visible output',
    },
  };
  const [focus, setFocus] = useState<keyof typeof tradeoffs>('business');
  const state = tradeoffs[focus];
  const pillars = [
    { id: 'business' as const, label: 'Business', accent: PM_CORAL },
    { id: 'user' as const, label: 'User', accent: PM_GREEN },
    { id: 'tech' as const, label: 'Tech', accent: PM_TEAL },
  ];

  return (
    <Shell
      title="Every optimization lifts one pillar and pulls tension through the other two."
      caption="There is no stable center forever. Product tradeoffs are living structures: when one dimension rises, the costs migrate somewhere else in the system."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 270px', gap: '26px', alignItems: 'center' }}>
        <div style={{ position: 'relative', minHeight: 330, padding: '18px 20px 10px', perspective: '980px' }}>
          <div style={{ position: 'absolute', left: '8%', right: '8%', bottom: 28, height: 44, borderRadius: '999px', background: 'radial-gradient(ellipse at center, rgba(106,87,232,0.22), rgba(106,87,232,0.04) 58%, transparent 72%)', filter: 'blur(2px)' }} />
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: 300, gap: 38, transform: 'rotateX(8deg)', transformStyle: 'preserve-3d' }}>
            {pillars.map((pillar, index) => {
              const value = state.values[pillar.id];
              const selected = focus === pillar.id;
              return (
                <motion.button
                  key={pillar.id}
                  type="button"
                  onClick={() => setFocus(pillar.id)}
                  whileHover={{ y: -10 }}
                  animate={{ y: selected ? -16 : 0, scale: selected ? 1.04 : 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  style={{ width: 132, height: 280, border: 0, background: 'transparent', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', transformStyle: 'preserve-3d' }}
                >
                  <motion.div animate={{ scaleX: selected ? 1.14 : 0.92, opacity: selected ? 0.42 : 0.24 }} style={{ position: 'absolute', bottom: 26, width: 118, height: 24, borderRadius: '999px', background: pillar.accent, filter: 'blur(16px)' }} />
                  <motion.div
                    animate={{ height: value * 2.1 }}
                    transition={{ type: 'spring', stiffness: 190, damping: 22 }}
                    style={{
                      position: 'relative',
                      width: 88,
                      minHeight: 96,
                      borderRadius: '18px 18px 12px 12px',
                      background: `linear-gradient(180deg, color-mix(in srgb, var(--ed-card) 32%, ${pillar.accent} 68%) 0%, ${pillar.accent} 68%, color-mix(in srgb, black 14%, ${pillar.accent} 86%) 100%)`,
                      boxShadow: selected
                        ? `0 28px 38px ${pillar.accent}38, 12px 14px 0 ${pillar.accent}20, inset 0 2px 0 rgba(255,255,255,0.55)`
                        : `0 18px 28px ${pillar.accent}25, 8px 10px 0 ${pillar.accent}16, inset 0 2px 0 rgba(255,255,255,0.45)`,
                      border: '1px solid rgba(255,255,255,0.45)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div style={{ position: 'absolute', left: 8, right: 8, top: -12, height: 22, borderRadius: '50%', background: `linear-gradient(145deg, color-mix(in srgb, var(--ed-card) 58%, ${pillar.accent} 42%), ${pillar.accent}88)`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22)' }} />
                    <div style={{ position: 'absolute', right: -13, top: 14, bottom: 8, width: 18, borderRadius: '0 12px 12px 0', background: `linear-gradient(180deg, ${pillar.accent}88, color-mix(in srgb, black 22%, ${pillar.accent} 78%))`, transform: 'skewY(34deg)', opacity: 0.7 }} />
                    <div style={{ position: 'absolute', inset: '28px 12px auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 850, letterSpacing: '0.16em', color: '#fff', textTransform: 'uppercase', textAlign: 'center', textShadow: '0 1px 8px rgba(0,0,0,0.2)' }}>{pillar.label}</div>
                    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 24, fontSize: 24, fontWeight: 900, color: '#fff', textAlign: 'center', textShadow: '0 2px 12px rgba(0,0,0,0.22)' }}>{value}%</div>
                  </motion.div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: pillar.accent, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{selected ? 'OPTIMIZED' : `PILLAR ${index + 1}`}</div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <motion.div key={focus} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} style={{ borderRadius: '20px', background: 'var(--ed-card)', padding: '18px 16px', boxShadow: `0 10px 22px ${state.accent}1a, 0 4px 0 ${state.accent}14, inset 0 1px 0 rgba(255,255,255,0.18)` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, letterSpacing: '0.14em', color: state.accent, marginBottom: '6px' }}>CURRENT OPTIMIZATION</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ed-ink)', marginBottom: '14px' }}>{state.label}</div>
            {pillars.map(p => (
              <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: p.accent, width: '50px' }}>{p.label}</div>
                <div style={{ flex: 1, height: '6px', background: 'var(--ed-rule)', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div animate={{ width: `${state.values[p.id]}%` }} transition={{ type: 'spring', stiffness: 190, damping: 22 }} style={{ height: '100%', background: p.accent, borderRadius: '3px' }} />
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: p.accent, width: '24px', textAlign: 'right' }}>{state.values[p.id]}%</div>
              </div>
            ))}
          </motion.div>
          <motion.div key={state.cost} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: 0.06 }} style={{ borderRadius: '16px', padding: '14px 16px', background: `${state.accent}0A`, border: `1px solid ${state.accent}22`, borderLeft: `4px solid ${state.accent}` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, letterSpacing: '0.14em', color: state.accent, marginBottom: '6px' }}>SYSTEM COST</div>
            <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65, marginBottom: 10 }}>{state.cost}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 800, letterSpacing: '0.14em', color: state.accent, marginBottom: 5 }}>COMPRESSES</div>
            <div style={{ fontSize: 12, color: 'var(--ed-ink3)', lineHeight: 1.55 }}>{state.compresses}</div>
          </motion.div>
        </div>
      </div>
    </Shell>
  );
}

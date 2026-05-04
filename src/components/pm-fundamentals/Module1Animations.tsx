'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
      overflow: 'hidden',
      borderRadius: '36px',
      background:
        'radial-gradient(circle at 50% 46%, rgba(106,87,232,0.12) 0%, rgba(106,87,232,0.05) 20%, rgba(44,157,182,0.03) 40%, transparent 68%), linear-gradient(180deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.08) 100%)',
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
      background: `linear-gradient(160deg, color-mix(in srgb, white 94%, ${accent} 6%) 0%, color-mix(in srgb, white 88%, ${accent} 12%) 100%)`,
      border: `1px solid color-mix(in srgb, ${accent} 26%, #d9d1c6 74%)`,
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
          background: `linear-gradient(145deg, color-mix(in srgb, white 28%, ${accent} 72%), ${accent})`,
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
      background: `linear-gradient(160deg, color-mix(in srgb, white 95%, ${accent} 5%) 0%, color-mix(in srgb, white 90%, ${accent} 10%) 100%)`,
      border: `1px solid color-mix(in srgb, ${accent} 22%, #ddd6ca 78%)`,
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
      <Stage height={500}>
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 500"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <defs>
            <radialGradient id="pmGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(106,87,232,0.26)" />
              <stop offset="55%" stopColor="rgba(106,87,232,0.08)" />
              <stop offset="100%" stopColor="rgba(106,87,232,0)" />
            </radialGradient>
          </defs>
          <ellipse cx="500" cy="250" rx="192" ry="150" fill="url(#pmGlow)" />
          <ConnectorLine x1={500} y1={252} x2={500} y2={110} stroke={PM_TEAL} />
          <ConnectorLine x1={500} y1={252} x2={228} y2={252} stroke={PM_LAVENDER} delay={0.2} />
          <ConnectorLine x1={500} y1={252} x2={772} y2={252} stroke={PM_CORAL} delay={0.4} />
          <ConnectorLine x1={500} y1={252} x2={500} y2={396} stroke={PM_GREEN} delay={0.6} />
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
            padding: '18px 28px',
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

  const STEPS = [
    { num: '01', label: 'COMPLAINT',    desc: '“The app is confusing.”', color: '#E8875A', icon: '💬' },
    { num: '02', label: 'WRONG JUMP',   desc: 'Redesign navigation',              color: '#D96D92', icon: '🧭' },
    { num: '03', label: 'REWIND',       desc: 'Stop. Ask what happened.',         color: '#7B6BD1', icon: '⏮' },
    { num: '04', label: 'ACTUAL TASK',  desc: 'Find last Tuesday’s call',     color: '#2C9DB6', icon: '🔍' },
    { num: '05', label: 'REAL BLOCKER', desc: 'Search and retrieval, not layout', color: '#52B281', icon: '📄' },
  ];

  const FOOTERS = [
    { color: '#E8875A', title: 'Symptoms feel urgent',    desc: 'Complaints arrive with emotional weight.' },
    { color: '#D96D92', title: 'Strong motion slows',     desc: 'Avoid solutioning until the problem is clear.' },
    { color: '#7B6BD1', title: 'Reframe the question',    desc: 'Ask what the user was trying to do, not what’s broken.' },
    { color: '#2C9DB6', title: 'Solve the right thing',   desc: 'Fix the blocker that prevents progress.' },
    { color: '#52B281', title: 'Measure the outcome',     desc: 'Check if the real task gets done.' },
  ];

  const StepCard = ({ step }: { step: typeof STEPS[0] }) => {
    const isActive = step.num === STEPS[active].num;
    return (
      <motion.div
        animate={{
          y: isActive ? -7 : 0,
          boxShadow: isActive
            ? `0 18px 30px ${step.color}28, 0 5px 0 ${step.color}22, inset 0 1px 0 rgba(255,255,255,0.85)`
            : `0 5px 16px rgba(0,0,0,0.08), 0 3px 0 rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.85)`,
        }}
        transition={{ duration: 0.38, ease: 'easeOut' }}
        style={{
          borderRadius: '24px',
          background: '#ffffff',
          padding: '18px 15px 15px',
          width: '162px',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        {/* Step number */}
        <div style={{
          position: 'absolute', top: '12px', right: '13px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px', fontWeight: 800,
          color: step.color, opacity: 0.65,
        }}>
          {step.num}
        </div>
        {/* Icon circle */}
        <div style={{
          width: 58, height: 58, borderRadius: '50%',
          background: `linear-gradient(145deg, ${step.color}cc 0%, ${step.color} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '26px', marginBottom: '12px',
          boxShadow: `0 6px 14px ${step.color}40`,
        }}>
          {step.icon}
        </div>
        {/* Label */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '9px', fontWeight: 800, letterSpacing: '0.1em',
          color: step.color, marginBottom: '5px',
        }}>
          {step.label}
        </div>
        {/* Description */}
        <div style={{ fontSize: '13px', lineHeight: 1.5, color: '#4A4540', fontWeight: 500 }}>
          {step.desc}
        </div>
      </motion.div>
    );
  };

  const ArrowR = ({ c1, c2 }: { c1: string; c2: string }) => (
    <svg width="46" height="22" viewBox="0 0 46 22" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`psr${c1.slice(1)}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c1} stopOpacity="0.55" />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <path d="M3 11 H36 M30 5 L42 11 L30 17"
        stroke={`url(#psr${c1.slice(1)})`}
        strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );

  const ArrowL = ({ c1, c2 }: { c1: string; c2: string }) => (
    <svg width="46" height="22" viewBox="0 0 46 22" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={`psl${c1.slice(1)}`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor={c1} stopOpacity="0.55" />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <path d="M43 11 H10 M16 5 L4 11 L16 17"
        stroke={`url(#psl${c1.slice(1)})`}
        strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );

  return (
    <Shell
      title="The instinctive solution drifts. The right workflow rewinds first."
      caption=""
    >
      {/* Subtitle */}
      <div style={{ fontSize: '14px', color: 'var(--ed-ink3)', lineHeight: 1.65, marginBottom: '22px', marginTop: '-10px' }}>
        Strong PM motion slows down, reframes the user task, and only then narrows to a fix.
      </div>

      {/* ── DIAGRAM CANVAS ── */}
      <div style={{
        borderRadius: '32px',
        background: 'radial-gradient(ellipse at 50% 35%, rgba(123,107,209,0.09) 0%, rgba(44,157,182,0.05) 50%, transparent 72%), linear-gradient(180deg, rgba(238,240,250,0.88) 0%, rgba(248,249,252,0.94) 100%)',
        padding: '28px 24px 28px',
      }}>
        {/* ROW 1 — 01 → 02 → 03 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <StepCard step={STEPS[0]} />
          <ArrowR c1={STEPS[0].color} c2={STEPS[1].color} />
          <StepCard step={STEPS[1]} />
          <ArrowR c1={STEPS[1].color} c2={STEPS[2].color} />
          <StepCard step={STEPS[2]} />
        </div>

        {/* VERTICAL CONNECTOR — 03 ↓ 04 (right-aligned above card 04) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '5px' }}>
          {/* Down arrow sits above card 04 which is rightmost in bottom row */}
          <div style={{ width: '162px', display: 'flex', justifyContent: 'center', paddingBottom: '5px' }}>
            <svg width="22" height="30" viewBox="0 0 22 30">
              <path d="M11 2 V23 M5 17 L11 28 L17 17"
                stroke={STEPS[2].color} strokeWidth="2.8"
                strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
            </svg>
          </div>

          {/* ROW 2 — 05 ← 04  (04 is rightmost = under 03, 05 extends left) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <StepCard step={STEPS[4]} />
            <ArrowL c1={STEPS[3].color} c2={STEPS[4].color} />
            <StepCard step={STEPS[3]} />
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
  const frames = [
    {
      leftAccent: PM_GREEN,
      rightAccent: PM_CORAL,
      leftTitle: 'Good process',
      leftText: 'Strong reasoning, clear tradeoff, bad market timing.',
      rightTitle: 'Bad process',
      rightText: 'Weak reasoning, lucky outcome, misleading success.',
    },
    {
      leftAccent: PM_TEAL,
      rightAccent: PM_INDIGO,
      leftTitle: 'Review the decision',
      leftText: 'What information did we have, and what did we assume?',
      rightTitle: 'Review the outcome',
      rightText: 'What changed externally that our process could not control?',
    },
  ];
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setFrame((v) => (v + 1) % frames.length), 2200);
    return () => clearInterval(timer);
  }, [frames.length]);

  const current = frames[frame];

  return (
    <Shell
      title="Decision quality and outcome quality move on different layers."
      caption="Senior PM growth starts when we stop grading ourselves only by what happened. The process and the outcome must be inspected separately."
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr', gap: '18px', alignItems: 'center' }}>
        <TintCard accent={current.leftAccent} label={current.leftTitle} text={current.leftText} active minHeight={166} />
        <div style={{ position: 'relative', height: '170px' }}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '10px',
              transform: 'translateX(-50%)',
              borderRadius: '999px',
              background: 'linear-gradient(180deg, rgba(106,87,232,0.08) 0%, rgba(106,87,232,0.32) 50%, rgba(106,87,232,0.08) 100%)',
            }}
          />
          <motion.div
            animate={{ y: frame === 0 ? [14, 78, 14] : [78, 14, 78] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '74px',
              height: '74px',
              borderRadius: '24px',
              background: `linear-gradient(145deg, ${PM_INDIGO} 0%, #5240d9 100%)`,
              boxShadow: '0 16px 26px rgba(82,64,217,0.22), inset 0 1px 0 rgba(255,255,255,0.38)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '12px',
              lineHeight: 1.3,
              padding: '8px',
            }}
          >
            Outcome
          </motion.div>
        </div>
        <TintCard accent={current.rightAccent} label={current.rightTitle} text={current.rightText} active minHeight={166} />
      </div>
    </Shell>
  );
}

export function TradeoffPrismVisual() {
  const states = [
    {
      focus: 'Ship fast',
      accent: PM_CORAL,
      business: 86,
      user: 64,
      tech: 40,
      note: 'Fast shipping buys momentum but stores hidden debt under the floorboards.',
    },
    {
      focus: 'Protect quality',
      accent: PM_TEAL,
      business: 58,
      user: 78,
      tech: 84,
      note: 'Technical rigor increases long-term velocity but compresses short-term feature output.',
    },
    {
      focus: 'Push growth',
      accent: PM_INDIGO,
      business: 92,
      user: 72,
      tech: 46,
      note: 'Growth pressure can stretch the product away from its cleanest user fit.',
    },
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((v) => (v + 1) % states.length), 2200);
    return () => clearInterval(timer);
  }, [states.length]);

  const state = states[active];
  const pillars = [
    { label: 'Business', value: state.business, accent: PM_CORAL },
    { label: 'User', value: state.user, accent: PM_GREEN },
    { label: 'Tech', value: state.tech, accent: PM_TEAL },
  ];

  return (
    <Shell
      title="Every optimization lifts one pillar and pulls tension through the other two."
      caption="There is no stable center forever. Product tradeoffs are living structures: when one dimension rises, the costs migrate somewhere else in the system."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 250px', gap: '24px', alignItems: 'center' }}>
        <div
          style={{
            position: 'relative',
            height: '286px',
            borderRadius: '28px',
            padding: '18px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.76) 0%, rgba(106,87,232,0.06) 100%)',
            boxShadow: surfaceShadow,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '10%',
              right: '10%',
              bottom: '24px',
              height: '20px',
              borderRadius: '999px',
              background: 'rgba(106,87,232,0.08)',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', gap: '16px' }}>
            {pillars.map((pillar) => (
              <div key={pillar.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                <motion.div
                  animate={{ height: `${pillar.value}%` }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  style={{
                    width: '100%',
                    maxWidth: '110px',
                    minHeight: '78px',
                    borderRadius: '18px 18px 12px 12px',
                    background: `linear-gradient(180deg, color-mix(in srgb, white 20%, ${pillar.accent} 80%) 0%, ${pillar.accent} 100%)`,
                    border: '1px solid rgba(255,255,255,0.32)',
                    boxShadow: `0 16px 24px ${pillar.accent}1a, inset 0 1px 0 rgba(255,255,255,0.36)`,
                  }}
                />
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: pillar.accent, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  {pillar.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <SummaryStrip accent={state.accent} label="Current Optimization" text={state.focus} />
          <SummaryStrip accent={state.accent} label="System Cost" text={state.note} />
        </div>
      </div>
    </Shell>
  );
}

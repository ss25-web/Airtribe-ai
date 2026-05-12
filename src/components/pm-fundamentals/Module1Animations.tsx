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
  const [path, setPath] = useState<'reactive' | 'investigative' | null>(null);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const REACTIVE = [
    { action: 'Assume the cause', detail: '"The navigation must be confusing. Users can\'t find what they need."', consequence: 'No conversation with the user. The PM guesses.' },
    { action: 'Scope the solution', detail: '"Redesign the navigation. 3 engineers, 3 weeks. Let\'s fix it."', consequence: 'Sprint committed. Zero user research done.' },
    { action: 'Ship it', detail: 'New navigation launches. Cleaner menus, relabelled sections, better hierarchy.', consequence: 'Team is proud. 40% of users still churn in week 2.' },
    { action: 'Miss the problem', detail: '"Why didn\'t churn drop? The nav looks much better now."', consequence: 'You solved the symptom. The real problem was search.' },
  ];

  const INVESTIGATIVE = [
    { action: 'Ask what they were trying to do', detail: '"What were you doing when the app felt confusing?"', consequence: '"I was trying to find my call recording from last Tuesday."' },
    { action: 'Discover the actual task', detail: '"They needed to retrieve a specific past recording — not browse."', consequence: 'This is a retrieval problem, not a navigation problem.' },
    { action: 'Find the real blocker', detail: '"There\'s no search. No date filter. No recent recordings view."', consequence: 'Root cause found in 15 minutes of conversation.' },
    { action: 'Build the targeted fix', detail: '"Add search with date filtering to recordings."', consequence: '1 engineer, 3 days. Churn in week 2 drops immediately.' },
  ];

  const COLORS = {
    reactive: { accent: '#E8875A', bg: '#E8875A0d', border: '#E8875A28', result: '#EF4444', resultBg: '#EF444410' },
    investigative: { accent: '#0D9488', bg: '#0D94880d', border: '#0D948828', result: '#16A34A', resultBg: '#16A34A10' },
  };

  function choosePath(chosen: 'reactive' | 'investigative') {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPath(chosen);
    setStep(0);
    setRunning(true);
  }

  useEffect(() => {
    if (!running || path === null) return;
    const steps = path === 'reactive' ? REACTIVE : INVESTIGATIVE;
    if (step >= steps.length) { setRunning(false); return; }
    timerRef.current = setTimeout(() => setStep(s => s + 1), 900);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, step, path]);

  function reset() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPath(null); setStep(0); setRunning(false);
  }

  const steps = path === 'reactive' ? REACTIVE : path === 'investigative' ? INVESTIGATIVE : [];
  const cols = path ? COLORS[path] : COLORS.reactive;

  return (
    <div style={{ margin: '32px 0' }}>
      {/* ── Complaint card ── */}
      <div style={{ padding: '18px 22px', borderRadius: '14px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', marginBottom: '20px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#E8875A', letterSpacing: '0.14em', marginBottom: '8px' }}>USER COMPLAINT — EdSpark, churned sales manager</div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.45, fontStyle: 'italic' }}>
          &ldquo;The app is confusing. I can&apos;t find anything.&rdquo;
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--ed-ink3)' }}>You have one hour before the sprint planning meeting. What do you do?</div>
      </div>

      {/* ── Path selector ── */}
      {!path && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          {[
            { key: 'reactive' as const, label: '⚡ Reactive PM', sub: 'You know what the problem is. Jump straight to a solution.', color: '#E8875A' },
            { key: 'investigative' as const, label: '🔍 Investigative PM', sub: 'Slow down. Ask what the user was actually trying to do.', color: '#0D9488' },
          ].map(opt => (
            <motion.button key={opt.key} onClick={() => choosePath(opt.key)}
              whileHover={{ scale: 1.02, y: -3 }} whileTap={{ scale: 0.98 }}
              style={{ padding: '18px 16px', borderRadius: '14px', cursor: 'pointer', textAlign: 'left' as const,
                background: `color-mix(in srgb, var(--ed-card) 90%, ${opt.color} 10%)`,
                border: `2px solid ${opt.color}30`,
                boxShadow: `0 4px 14px ${opt.color}18` }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: opt.color, marginBottom: '7px' }}>{opt.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.55 }}>{opt.sub}</div>
            </motion.button>
          ))}
        </div>
      )}

      {/* ── Active path ── */}
      <AnimatePresence>
        {path && (
          <motion.div key={path} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Path header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '6px 14px', borderRadius: '8px', background: `${cols.accent}18`, border: `1.5px solid ${cols.accent}30`, fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, color: cols.accent }}>
                {path === 'reactive' ? '⚡ Reactive PM' : '🔍 Investigative PM'}
              </div>
              <motion.button onClick={reset} whileHover={{ opacity: 0.7 }}
                style={{ marginLeft: 'auto', padding: '5px 12px', borderRadius: '7px', cursor: 'pointer', background: 'none', border: '1px solid var(--ed-rule)', fontSize: '11px', color: 'var(--ed-ink3)' }}>
                ← Try the other path
              </motion.button>
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '18px' }}>
              {steps.slice(0, step).map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid ${cols.border}` }}>
                  <div style={{ padding: '12px 16px', background: cols.bg, borderBottom: `1px solid ${cols.border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '6px', background: cols.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ed-ink)' }}>{s.action}</div>
                  </div>
                  <div style={{ padding: '12px 16px', background: 'var(--ed-card)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.1em', marginBottom: '5px' }}>WHAT THE PM DID</div>
                      <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.6, fontStyle: 'italic' }}>{s.detail}</div>
                    </div>
                    <div style={{ borderLeft: `1px solid var(--ed-rule)`, paddingLeft: '12px' }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: cols.accent, letterSpacing: '0.1em', marginBottom: '5px' }}>WHAT HAPPENED</div>
                      <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{s.consequence}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Result */}
            <AnimatePresence>
              {!running && step >= steps.length && (
                <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  style={{ padding: '18px 22px', borderRadius: '14px', background: path === 'reactive' ? '#EF444410' : '#16A34A10', border: `2px solid ${path === 'reactive' ? '#EF444430' : '#16A34A30'}`, borderLeft: `4px solid ${path === 'reactive' ? '#EF4444' : '#16A34A'}` }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: path === 'reactive' ? '#EF4444' : '#16A34A', letterSpacing: '0.12em', marginBottom: '8px' }}>
                    {path === 'reactive' ? '⚠ OUTCOME — 3 weeks, wrong problem' : '✓ OUTCOME — 3 days, right problem'}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.6 }}>
                    {path === 'reactive'
                      ? 'Navigation redesign ships. Looks cleaner. Churn in week 2 stays at 40%. The real problem was search — users couldn\'t find past recordings by date. No one asked.'
                      : 'One conversation surfaced the real task: retrieval, not navigation. Search with date filtering ships in 3 days. Churn in week 2 drops. The complaint was a symptom. The task was the problem.'}
                  </div>
                  <motion.button onClick={reset} whileHover={{ opacity: 0.8 }} style={{ marginTop: '14px', padding: '8px 18px', borderRadius: '9px', cursor: 'pointer', background: path === 'reactive' ? '#EF444418' : '#16A34A18', border: `1px solid ${path === 'reactive' ? '#EF444430' : '#16A34A30'}`, fontSize: '12px', fontWeight: 700, color: path === 'reactive' ? '#EF4444' : '#16A34A' }}>
                    {path === 'reactive' ? '← See the investigative path' : '← See what happens reactively'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* In-progress hint */}
            {running && (
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', fontStyle: 'italic', textAlign: 'center' as const }}>Following the {path} PM&apos;s next move…</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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

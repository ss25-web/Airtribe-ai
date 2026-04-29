'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT = '#16A34A';
const ACCENT_RGB = '22,163,74';

const TiltCard = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });
  const handle = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -6, y: ((e.clientX - r.left) / r.width - 0.5) * 6, scale: 1.012 });
  };
  return (
    <div onMouseMove={handle} onMouseLeave={() => setTilt({ x: 0, y: 0, scale: 1 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`, transition: 'transform 0.18s ease', willChange: 'transform', ...style }}>
      {children}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PREDICT THE OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

const PREDICT_CHALLENGES = [
  {
    id: 'dynamic-rebind',
    title: 'Dynamic typing in action',
    code: `score = 10
print(type(score).__name__)
score = "ten"
print(type(score).__name__)`,
    options: ['int\nstr', 'int\nint', 'TypeError', 'str\nstr'],
    correct: 0,
    explanation: 'Python lets the name score rebind from int to str at runtime. type() returns the current type of the value the name points to — not a fixed type.',
  },
  {
    id: 'strong-coercion',
    title: 'Strong typing blocks silent coercion',
    code: `total = "10" + 5
print(total)`,
    options: ['"105"', '15', 'TypeError', '"10" 5'],
    correct: 2,
    explanation: 'Python is strongly typed — it refuses to silently combine a str and int. This raises TypeError at runtime. You must be explicit: int("10") + 5 = 15, or "10" + str(5) = "105".',
  },
  {
    id: 'explicit-convert',
    title: 'Explicit type conversion',
    code: `user_input = "42"
result = int(user_input) + 8
print(result)`,
    options: ['428', '50', 'TypeError', '"50"'],
    correct: 1,
    explanation: 'int("42") converts the string to an integer first. Then 42 + 8 = 50. This is the correct pattern for working with user input that arrives as a string.',
  },
  {
    id: 'none-type',
    title: 'None has its own type',
    code: `value = None
print(type(value).__name__)
print(value == False)`,
    options: ['NoneType\nTrue', 'NoneType\nFalse', 'None\nFalse', 'bool\nTrue'],
    correct: 1,
    explanation: 'None is its own type: NoneType. None == False is False — they are different values. None means "absent", False means "boolean false". Use "is None" to check for None.',
  },
];

export function PredictOutput() {
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const challenge = PREDICT_CHALLENGES[idx];

  const next = () => {
    setIdx(i => (i + 1) % PREDICT_CHALLENGES.length);
    setChosen(null);
    setRevealed(false);
  };

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(22,163,74,0.2)', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', background: 'var(--ed-card)' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0f172a 100%)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: ACCENT }}>Predict the Output</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(241,245,249,0.4)', marginTop: '2px' }}>{challenge.title}</div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(241,245,249,0.4)' }}>
            {idx + 1} / {PREDICT_CHALLENGES.length}
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          {/* Code */}
          <div style={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '16px', border: '1px solid rgba(134,239,172,0.12)' }}>
            <div style={{ background: '#1e293b', padding: '7px 14px', fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", color: '#64748b', letterSpacing: '0.08em' }}>
              predict.py
            </div>
            <pre style={{ background: '#0f172a', color: '#86efac', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', lineHeight: 1.8, padding: '16px 20px', margin: 0, overflowX: 'auto' as const }}>
              {challenge.code}
            </pre>
          </div>

          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ed-ink3)', marginBottom: '10px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}>
            WHAT DOES THIS PRINT?
          </div>

          {/* Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            {challenge.options.map((opt, i) => {
              const isChosen = chosen === i;
              const isCorrect = i === challenge.correct;
              let bg = 'var(--ed-cream)';
              let border = 'var(--ed-rule)';
              let color = 'var(--ed-ink2)';
              if (revealed && isCorrect) { bg = `rgba(${ACCENT_RGB},0.12)`; border = ACCENT; color = ACCENT; }
              else if (revealed && isChosen && !isCorrect) { bg = 'rgba(239,68,68,0.1)'; border = '#EF4444'; color = '#EF4444'; }
              else if (isChosen) { bg = `rgba(${ACCENT_RGB},0.08)`; border = ACCENT; color = ACCENT; }
              return (
                <motion.button key={i} whileHover={!revealed ? { scale: 1.02 } : {}} onClick={() => !revealed && setChosen(i)}
                  style={{ padding: '10px 14px', borderRadius: '8px', background: bg, border: `1.5px solid ${border}`, cursor: revealed ? 'default' : 'pointer', textAlign: 'left' as const, fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color, lineHeight: 1.5, transition: 'all 0.15s', whiteSpace: 'pre' as const }}>
                  {opt}
                </motion.button>
              );
            })}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {!revealed && (
              <button onClick={() => chosen !== null && setRevealed(true)} disabled={chosen === null}
                style={{ padding: '8px 20px', borderRadius: '8px', background: chosen !== null ? ACCENT : 'var(--ed-rule)', color: chosen !== null ? '#fff' : 'var(--ed-ink3)', border: 'none', fontSize: '11px', fontWeight: 700, cursor: chosen !== null ? 'pointer' : 'not-allowed', transition: 'all 0.15s' }}>
                Reveal answer
              </button>
            )}
            {revealed && (
              <button onClick={next}
                style={{ padding: '8px 20px', borderRadius: '8px', background: ACCENT, color: '#fff', border: 'none', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                Next challenge &rarr;
              </button>
            )}
            <div style={{ display: 'flex', gap: '5px', marginLeft: 'auto' }}>
              {PREDICT_CHALLENGES.map((_, i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === idx ? ACCENT : 'var(--ed-rule)', transition: 'background 0.2s' }} />
              ))}
            </div>
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {revealed && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '10px', background: chosen === challenge.correct ? `rgba(${ACCENT_RGB},0.08)` : 'rgba(239,68,68,0.07)', border: `1px solid ${chosen === challenge.correct ? ACCENT : '#EF4444'}30`, fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
                <div style={{ fontWeight: 700, color: chosen === challenge.correct ? ACCENT : '#EF4444', marginBottom: '4px', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace" }}>
                  {chosen === challenge.correct ? 'Correct!' : 'Not quite —'}
                </div>
                {challenge.explanation}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TiltCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PR1 HERO VISUAL ARTIFACT  (mini studio card)
// ─────────────────────────────────────────────────────────────────────────────

export function PR1HeroArtifact() {
  return (
    <div style={{ flexShrink: 0, width: '220px' }}>
      <div className="float3d" style={{
        borderRadius: '16px', overflow: 'hidden',
        boxShadow: '0 32px 64px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        {/* Editor header */}
        <div style={{ background: '#1e293b', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
          <div style={{ marginLeft: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#64748b' }}>main.py</div>
        </div>
        {/* Code */}
        <div style={{ background: '#0f172a', padding: '12px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', lineHeight: 1.8 }}>
          <div><span style={{ color: '#93c5fd' }}>user_name</span><span style={{ color: '#94a3b8' }}> = </span><span style={{ color: '#86efac' }}>&quot;Ravi&quot;</span></div>
          <div><span style={{ color: '#93c5fd' }}>order_total</span><span style={{ color: '#94a3b8' }}> = </span><span style={{ color: '#fbbf24' }}>499.0</span></div>
          <div><span style={{ color: '#93c5fd' }}>is_paid</span><span style={{ color: '#94a3b8' }}> = </span><span style={{ color: '#c084fc' }}>True</span></div>
          <div style={{ marginTop: '6px' }}><span style={{ color: '#64748b' }}>{'# str + float = TypeError'}</span></div>
          <div><span style={{ color: '#f87171' }}>print</span><span style={{ color: '#94a3b8' }}>(user_name </span><span style={{ color: '#f87171' }}>+</span><span style={{ color: '#94a3b8' }}> order_total)</span></div>
        </div>
        {/* Terminal output */}
        <div style={{ background: '#020617', padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#64748b', marginBottom: '4px' }}>Terminal</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#f87171', lineHeight: 1.6 }}>TypeError: can only concatenate</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#f87171' }}>str (not &quot;float&quot;) to str</div>
          <div style={{ marginTop: '6px', padding: '4px 8px', borderRadius: '4px', background: `rgba(${ACCENT_RGB},0.15)`, fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: ACCENT }}>Strong typing at work</div>
        </div>
        {/* Type labels */}
        <div style={{ background: '#1e293b', padding: '8px 14px', display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
          {[{ label: 'str', color: '#93c5fd' }, { label: 'float', color: '#fbbf24' }, { label: 'bool', color: '#c084fc' }].map(t => (
            <div key={t.label} style={{ padding: '2px 8px', borderRadius: '10px', background: `${t.color}18`, border: `1px solid ${t.color}40`, fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: t.color }}>{t.label}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

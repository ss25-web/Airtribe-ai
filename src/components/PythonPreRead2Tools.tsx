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
// CLASS OR DICT?
// ─────────────────────────────────────────────────────────────────────────────

const CLASS_OR_DICT_SCENARIOS = [
  { id: 's1', desc: 'A user profile with name, email, and tier', correct: 'class', reason: 'Needs methods: display_info(), is_admin(), update_tier(). State + behavior = class.' },
  { id: 's2', desc: 'Country codes mapped to country names (e.g. "IN" -> "India")', correct: 'dict', reason: 'Pure data lookup. No behavior needed. A dict is simpler and clearer.' },
  { id: 's3', desc: 'A bank account that can deposit, withdraw, and check balance', correct: 'class', reason: 'State (balance) + behavior (deposit, withdraw) that must stay consistent. Exactly what a class is for.' },
  { id: 's4', desc: 'A request body with user_id, action, and timestamp fields', correct: 'dict', reason: 'Parsed request data is just named fields read once. A dict (or dataclass) is appropriate.' },
  { id: 's5', desc: 'A shopping cart that can add items, remove items, and calculate total', correct: 'class', reason: 'The cart has mutable state (items list) and several behaviors. A class keeps them together safely.' },
  { id: 's6', desc: 'Error code to error message mapping used for API responses', correct: 'dict', reason: 'Static lookup table — no state changes, no behavior. A dict is the right, simpler tool.' },
];

export function ClassOrDictLab() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const answer = (id: string, choice: string) => {
    if (revealed[id]) return;
    setAnswers(a => ({ ...a, [id]: choice }));
    setRevealed(r => ({ ...r, [id]: true }));
  };

  const score = CLASS_OR_DICT_SCENARIOS.filter(s => answers[s.id] === s.correct).length;
  const done = Object.keys(revealed).length === CLASS_OR_DICT_SCENARIOS.length;

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(22,163,74,0.2)', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', background: 'var(--ed-card)' }}>
        <div style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0f172a 100%)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: ACCENT }}>Class or Dict?</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(241,245,249,0.4)', marginTop: '2px' }}>Choose the right structure for each scenario</div>
          </div>
          {done && <div style={{ padding: '4px 12px', borderRadius: '20px', background: `rgba(${ACCENT_RGB},0.2)`, fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, color: ACCENT }}>{score}/{CLASS_OR_DICT_SCENARIOS.length} correct</div>}
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
          {CLASS_OR_DICT_SCENARIOS.map(s => {
            const chosen = answers[s.id];
            const isRevealed = revealed[s.id];
            const isCorrect = chosen === s.correct;
            return (
              <div key={s.id} style={{ padding: '12px 14px', borderRadius: '10px', background: isRevealed ? (isCorrect ? `rgba(${ACCENT_RGB},0.07)` : 'rgba(239,68,68,0.07)') : 'var(--ed-cream)', border: `1px solid ${isRevealed ? (isCorrect ? ACCENT : '#EF4444') + '40' : 'var(--ed-rule)'}` }}>
                <div style={{ fontSize: '13px', color: 'var(--ed-ink)', marginBottom: '8px' }}>{s.desc}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const, alignItems: 'flex-start' }}>
                  {['class', 'dict'].map(choice => {
                    const isCh = chosen === choice;
                    const isCorr = choice === s.correct;
                    let bg = 'var(--ed-bg)';
                    let border = 'var(--ed-rule)';
                    let color = 'var(--ed-ink3)';
                    if (isRevealed && isCorr) { bg = `rgba(${ACCENT_RGB},0.15)`; border = ACCENT; color = ACCENT; }
                    else if (isRevealed && isCh && !isCorr) { bg = 'rgba(239,68,68,0.12)'; border = '#EF4444'; color = '#EF4444'; }
                    else if (isCh) { bg = `rgba(${ACCENT_RGB},0.1)`; border = ACCENT; color = ACCENT; }
                    return (
                      <button key={choice} onClick={() => answer(s.id, choice)}
                        style={{ padding: '5px 18px', borderRadius: '7px', border: `1.5px solid ${border}`, background: bg, color, fontSize: '11px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", cursor: isRevealed ? 'default' : 'pointer', transition: 'all 0.15s' }}>
                        {choice}
                      </button>
                    );
                  })}
                  {isRevealed && (
                    <motion.div initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                      style={{ fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.55, flex: 1, minWidth: '160px' }}>
                      {s.reason}
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {done && (
          <div style={{ padding: '12px 20px', background: 'var(--ed-cream)', borderTop: '1px solid var(--ed-rule)', fontSize: '11px', color: 'var(--ed-ink3)', textAlign: 'center' as const }}>
            {score >= 5 ? 'Strong instinct — you can tell when state + behavior calls for a class.' : 'Review: reach for a class when you need methods on top of state. Use a dict for pure data.'}
          </div>
        )}
      </div>
    </TiltCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSITION VS INHERITANCE
// ─────────────────────────────────────────────────────────────────────────────

const COMP_SCENARIOS = [
  { id: 'c1', a: 'AdminUser', b: 'User', correct: 'is-a', reason: 'AdminUser is a more specific kind of User. True specialization — inheritance is correct.' },
  { id: 'c2', a: 'Order', b: 'PaymentProcessor', correct: 'uses-a', reason: 'An Order uses a PaymentProcessor, but is not a type of one. Composition keeps them decoupled.' },
  { id: 'c3', a: 'Car', b: 'Vehicle', correct: 'is-a', reason: 'Car is genuinely a more specific Vehicle. Inheritance reflects the real relationship.' },
  { id: 'c4', a: 'Notification', b: 'EmailClient', correct: 'uses-a', reason: 'A Notification uses an EmailClient to deliver itself, but is not an email client. Composition.' },
  { id: 'c5', a: 'PremiumUser', b: 'User', correct: 'is-a', reason: 'PremiumUser is a specialized User with extra capabilities. is-a holds.' },
  { id: 'c6', a: 'Report', b: 'DataFormatter', correct: 'uses-a', reason: 'A Report uses a DataFormatter to prepare output. Different domains, no inheritance needed.' },
];

export function CompositionVsInheritanceLab() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const answer = (id: string, choice: string) => {
    if (revealed[id]) return;
    setAnswers(a => ({ ...a, [id]: choice }));
    setRevealed(r => ({ ...r, [id]: true }));
  };

  const score = COMP_SCENARIOS.filter(s => answers[s.id] === s.correct).length;
  const done = Object.keys(revealed).length === COMP_SCENARIOS.length;

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(124,58,237,0.2)', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', background: 'var(--ed-card)' }}>
        <div style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0f172a 100%)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: '#7C3AED' }}>Composition or Inheritance?</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(241,245,249,0.4)', marginTop: '2px' }}>Identify the real relationship — is-a or uses-a</div>
          </div>
          {done && <div style={{ padding: '4px 12px', borderRadius: '20px', background: 'rgba(124,58,237,0.2)', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, color: '#7C3AED' }}>{score}/{COMP_SCENARIOS.length} correct</div>}
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
          {COMP_SCENARIOS.map(s => {
            const chosen = answers[s.id];
            const isRevealed = revealed[s.id];
            const isCorrect = chosen === s.correct;
            return (
              <div key={s.id} style={{ padding: '12px 14px', borderRadius: '10px', background: isRevealed ? (isCorrect ? `rgba(${ACCENT_RGB},0.07)` : 'rgba(239,68,68,0.07)') : 'var(--ed-cream)', border: `1px solid ${isRevealed ? (isCorrect ? ACCENT : '#EF4444') + '40' : 'var(--ed-rule)'}` }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                  <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 800, color: '#7C3AED', background: 'rgba(124,58,237,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{s.a}</code>
                  <span style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>and</span>
                  <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 800, color: '#3B82F6', background: 'rgba(59,130,246,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{s.b}</code>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const, alignItems: 'flex-start' }}>
                  {['is-a', 'uses-a'].map(choice => {
                    const isCh = chosen === choice;
                    const isCorr = choice === s.correct;
                    let bg = 'var(--ed-bg)'; let border = 'var(--ed-rule)'; let color = 'var(--ed-ink3)';
                    if (isRevealed && isCorr) { bg = `rgba(${ACCENT_RGB},0.15)`; border = ACCENT; color = ACCENT; }
                    else if (isRevealed && isCh && !isCorr) { bg = 'rgba(239,68,68,0.12)'; border = '#EF4444'; color = '#EF4444'; }
                    else if (isCh) { bg = 'rgba(124,58,237,0.1)'; border = '#7C3AED'; color = '#7C3AED'; }
                    return (
                      <button key={choice} onClick={() => answer(s.id, choice)}
                        style={{ padding: '5px 18px', borderRadius: '7px', border: `1.5px solid ${border}`, background: bg, color, fontSize: '11px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", cursor: isRevealed ? 'default' : 'pointer', transition: 'all 0.15s' }}>
                        {choice}
                      </button>
                    );
                  })}
                  {isRevealed && (
                    <motion.div initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                      style={{ fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.55, flex: 1, minWidth: '160px' }}>
                      {s.reason}
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {done && (
          <div style={{ padding: '12px 20px', background: 'var(--ed-cream)', borderTop: '1px solid var(--ed-rule)', fontSize: '11px', color: 'var(--ed-ink3)', textAlign: 'center' as const }}>
            {score >= 5 ? 'Solid judgment — composition for cross-domain reuse, inheritance only for true specialization.' : 'Rule of thumb: if you can say "[A] is a type of [B]" naturally, inheritance fits. Otherwise, compose.'}
          </div>
        )}
      </div>
    </TiltCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODULE ARCHITECTURE BUILDER  (messy file refactor)
// ─────────────────────────────────────────────────────────────────────────────

const FILES = [
  { id: 'f1', name: 'user.py',         correct: 'users',    icon: '🧑' },
  { id: 'f2', name: 'auth.py',         correct: 'users',    icon: '🔑' },
  { id: 'f3', name: 'card_payment.py', correct: 'payments', icon: '💳' },
  { id: 'f4', name: 'upi_payment.py',  correct: 'payments', icon: '📱' },
  { id: 'f5', name: 'order.py',        correct: 'orders',   icon: '📦' },
  { id: 'f6', name: 'invoice.py',      correct: 'orders',   icon: '🧾' },
  { id: 'f7', name: 'validators.py',   correct: 'utils',    icon: '✔' },
  { id: 'f8', name: 'helpers.py',      correct: 'utils',    icon: '🔧' },
];

const PACKAGES = ['users', 'payments', 'orders', 'utils'];
const PKG_COLORS: Record<string, string> = { users: '#3B82F6', payments: ACCENT, orders: '#CA8A04', utils: '#7C3AED' };
const PKG_HINTS: Record<string, string> = { users: 'User models, auth', payments: 'Payment gateways', orders: 'Order & invoicing', utils: 'Validators, helpers' };

export function ModuleArchitectureBuilder() {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean | null>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const place = (fileId: string, pkg: string) => {
    const file = FILES.find(f => f.id === fileId)!;
    setPlacements(p => ({ ...p, [fileId]: pkg }));
    setFeedback(f => ({ ...f, [fileId]: file.correct === pkg }));
    setSelected(null);
  };

  const score = FILES.filter(f => feedback[f.id] === true).length;
  const done = Object.keys(feedback).length === FILES.length;

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(202,138,4,0.2)', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', background: 'var(--ed-card)' }}>
        <div style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0f172a 100%)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: '#CA8A04' }}>Module Architecture Builder</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(241,245,249,0.4)', marginTop: '2px' }}>Organize files into the right packages</div>
          </div>
          {done && <div style={{ padding: '4px 12px', borderRadius: '20px', background: 'rgba(202,138,4,0.2)', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, color: '#CA8A04' }}>{score}/{FILES.length} correct</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '0', minHeight: '260px' }}>
          {/* Unplaced files */}
          <div style={{ padding: '16px', borderRight: '1px solid var(--ed-rule)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.1em', marginBottom: '10px', textTransform: 'uppercase' as const }}>project/</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '5px' }}>
              {FILES.filter(f => !placements[f.id]).map(f => (
                <motion.div key={f.id} whileHover={{ x: 2 }} onClick={() => setSelected(sel => sel === f.id ? null : f.id)}
                  style={{ padding: '6px 10px', borderRadius: '7px', background: selected === f.id ? 'rgba(202,138,4,0.12)' : 'var(--ed-cream)', border: `1px solid ${selected === f.id ? '#CA8A04' : 'var(--ed-rule)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.12s' }}>
                  <span style={{ fontSize: '12px' }}>{f.icon}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: selected === f.id ? '#CA8A04' : 'var(--ed-ink2)', fontWeight: selected === f.id ? 700 : 400 }}>{f.name}</span>
                </motion.div>
              ))}
              {FILES.filter(f => !placements[f.id]).length === 0 && (
                <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontStyle: 'italic' }}>All files placed!</div>
              )}
            </div>
          </div>

          {/* Package zones */}
          <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {PACKAGES.map(pkg => {
              const color = PKG_COLORS[pkg];
              const placedHere = FILES.filter(f => placements[f.id] === pkg);
              return (
                <div key={pkg} onClick={() => selected && place(selected, pkg)}
                  style={{ padding: '12px', borderRadius: '10px', background: selected ? `${color}0D` : 'var(--ed-cream)', border: `1.5px dashed ${selected ? color : 'var(--ed-rule)'}`, cursor: selected ? 'pointer' : 'default', minHeight: '90px', transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '2px', background: color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, color }}>{pkg}/</span>
                    <span style={{ fontSize: '9px', color: 'var(--ed-ink3)' }}>{PKG_HINTS[pkg]}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px' }}>
                    {placedHere.map(f => (
                      <div key={f.id} style={{ padding: '2px 8px', borderRadius: '5px', background: feedback[f.id] ? `${color}18` : 'rgba(239,68,68,0.12)', border: `1px solid ${feedback[f.id] ? color + '50' : '#EF444450'}`, fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: feedback[f.id] ? color : '#EF4444', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        {feedback[f.id] ? '✔' : '✗'} {f.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selected && (
          <div style={{ padding: '8px 20px', background: 'rgba(202,138,4,0.08)', borderTop: '1px solid rgba(202,138,4,0.2)', fontSize: '11px', color: '#CA8A04', fontFamily: "'JetBrains Mono', monospace" }}>
            Placing: {FILES.find(f => f.id === selected)?.name} &mdash; click a package to place it
          </div>
        )}

        {done && (
          <div style={{ padding: '12px 20px', background: 'var(--ed-cream)', borderTop: '1px solid var(--ed-rule)', fontSize: '11px', color: 'var(--ed-ink3)', textAlign: 'center' as const }}>
            {score === FILES.length ? 'Perfect structure. Each package owns one domain responsibility.' : `${score}/${FILES.length} correct. Wrong placements show which files live in the wrong namespace.`}
          </div>
        )}
      </div>
    </TiltCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PR2 HERO VISUAL ARTIFACT
// ─────────────────────────────────────────────────────────────────────────────

export function PR2HeroArtifact() {
  return (
    <div style={{ flexShrink: 0, width: '220px' }}>
      <div className="float3d" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 32px 64px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {/* File tree header */}
        <div style={{ background: '#1e293b', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
          <div style={{ marginLeft: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#64748b' }}>project/</div>
        </div>
        {/* File tree */}
        <div style={{ background: '#0f172a', padding: '10px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', lineHeight: 2 }}>
          {[
            { indent: 0, label: 'users/',     color: '#3B82F6' },
            { indent: 1, label: 'user.py',    color: '#94a3b8' },
            { indent: 1, label: 'auth.py',    color: '#94a3b8' },
            { indent: 0, label: 'payments/',  color: ACCENT },
            { indent: 1, label: 'gateway.py', color: '#94a3b8' },
            { indent: 0, label: 'orders/',    color: '#CA8A04' },
            { indent: 1, label: 'order.py',   color: '#94a3b8' },
            { indent: 0, label: 'utils/',     color: '#7C3AED' },
            { indent: 1, label: 'helpers.py', color: '#94a3b8' },
          ].map((row, i) => (
            <div key={i} style={{ paddingLeft: `${row.indent * 16}px`, color: row.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
              {row.indent > 0 && <span style={{ color: '#334155' }}>└ </span>}
              {row.label}
            </div>
          ))}
        </div>
        {/* Blueprint card */}
        <div style={{ background: '#1e293b', padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: '#7C3AED', fontWeight: 700, marginBottom: '5px' }}>Class: User</div>
          {['name: str', 'email: str', 'is_active: bool', 'display_info()'].map((attr, i) => (
            <div key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: i < 3 ? '#93c5fd' : ACCENT, paddingLeft: '8px', opacity: i < 3 ? 1 : 0.8 }}>{attr}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

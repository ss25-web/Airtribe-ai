'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── SALES-LED vs PRODUCT-LED GROWTH ─────────────────────────────────────────
// Not every product suits PLG. The motion is a product decision — driven by
// ACV, time-to-value, buying committee, and onboarding complexity.
// Learner inputs their product's characteristics and gets a recommendation
// with the reasoning behind it. Teaches the decision framework, not the answer.

const QUESTIONS = [
  {
    id: 'acv',
    label: 'Average contract value (ACV)',
    options: [
      { value: 'low',    label: 'Under ₹2L / $2,500',  plgScore: 3, slgScore: 0, note: 'Low ACV can\'t support a human sales process — CAC would exceed LTV.' },
      { value: 'mid',    label: '₹2L–₹10L / $2.5k–$12k', plgScore: 2, slgScore: 1, note: 'PLG with a low-touch sales assist ("product-led sales") is often optimal here.' },
      { value: 'high',   label: 'Over ₹10L / $12,000',  plgScore: 0, slgScore: 3, note: 'High ACV justifies a dedicated sales rep — and typically requires one for procurement.' },
    ],
  },
  {
    id: 'ttv',
    label: 'Time for a user to get value from the product',
    options: [
      { value: 'fast',   label: 'Under 10 minutes',  plgScore: 3, slgScore: 0, note: 'Fast time-to-value enables self-serve — users can evaluate and adopt without hand-holding.' },
      { value: 'medium', label: '1 hour – 1 day',    plgScore: 2, slgScore: 1, note: 'Possible self-serve but benefits from guided onboarding.' },
      { value: 'slow',   label: 'Weeks of setup',    plgScore: 0, slgScore: 3, note: 'Long implementation cycles need a sales rep to manage and defend the timeline.' },
    ],
  },
  {
    id: 'committee',
    label: 'Number of stakeholders in the buying decision',
    options: [
      { value: 'solo',   label: '1 person decides',     plgScore: 3, slgScore: 0, note: 'Individual decisions favour PLG — the user and the buyer are the same person.' },
      { value: 'small',  label: '2–3 people (manager + IC)', plgScore: 2, slgScore: 1, note: 'Small committee — a champion can often drive adoption internally.' },
      { value: 'large',  label: '5+ people (committee)', plgScore: 0, slgScore: 3, note: 'Large buying committee requires a sales rep to manage multiple stakeholders and procurement.' },
    ],
  },
  {
    id: 'virality',
    label: 'Does value increase when more team members use it?',
    options: [
      { value: 'high',   label: 'Yes — deeply collaborative', plgScore: 3, slgScore: 0, note: 'Collaborative products spread virally inside companies — each user invites more.' },
      { value: 'some',   label: 'Somewhat — shared data benefits', plgScore: 1, slgScore: 1, note: 'Some virality but won\'t drive organic expansion on its own.' },
      { value: 'none',   label: 'No — individual tool',   plgScore: 0, slgScore: 2, note: 'No virality means you can\'t rely on expansion from within — need sales to land new accounts.' },
    ],
  },
  {
    id: 'complexity',
    label: 'How complex is the initial product setup?',
    options: [
      { value: 'simple', label: 'Sign up and go',          plgScore: 3, slgScore: 0, note: 'No-touch onboarding is the PLG dream — users can self-evaluate.' },
      { value: 'medium', label: 'Some config, no IT',       plgScore: 1, slgScore: 1, note: 'Works with strong in-app guidance and a support chat option.' },
      { value: 'hard',   label: 'Requires IT / integration', plgScore: 0, slgScore: 3, note: 'IT-required setup makes self-serve nearly impossible — users can\'t evaluate without help.' },
    ],
  },
];

type AnswerMap = Record<string, { value: string; plgScore: number; slgScore: number; note: string }>;

export function PLGvsSalesLedViz() {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [showResult, setShowResult] = useState(false);

  const totalPLG = Object.values(answers).reduce((s, a) => s + a.plgScore, 0);
  const totalSLG = Object.values(answers).reduce((s, a) => s + a.slgScore, 0);
  const maxScore = QUESTIONS.length * 3;
  const answered = Object.keys(answers).length;
  const allAnswered = answered === QUESTIONS.length;

  const getVerdict = () => {
    const plgPct = totalPLG / maxScore;
    const slgPct = totalSLG / maxScore;
    if (plgPct >= 0.7) return { motion: 'Product-Led Growth (PLG)', color: '#22C55E', dark: '#15803D', desc: 'Your product has the characteristics that make self-serve work: fast time-to-value, low ACV, individual or small buying decisions, low complexity. Users can evaluate and adopt without a sales rep.' };
    if (slgPct >= 0.7) return { motion: 'Sales-Led Growth (SLG)', color: '#6366F1', dark: '#3730A3', desc: 'Your product requires a sales motion: high ACV, long implementation, committee buying, or no virality. A dedicated rep manages the process and defends the timeline.' };
    return { motion: 'Hybrid: Product-Led Sales (PLS)', color: '#F97316', dark: '#C2410C', desc: 'Your product sits in the middle. Use PLG to generate demand and get users into the product, then use a low-touch sales rep to convert active users into paying contracts. The product does the qualifying; sales does the closing.' };
  };

  const answer = (qId: string, opt: typeof QUESTIONS[0]['options'][0]) => {
    setAnswers(prev => ({ ...prev, [qId]: opt }));
    setShowResult(false);
  };

  return (
    <div style={{ margin: '36px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ padding: '4px 12px', borderRadius: '8px', background: '#22C55E', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '0.14em', boxShadow: '0 3px 0 #15803D' }}>
          PLG vs SALES-LED
        </div>
        <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', fontWeight: 600 }}>Answer 5 questions about your product — get a recommended GTM motion with reasoning.</div>
      </div>

      <div style={{ borderRadius: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '24px', boxShadow: '0 16px 40px rgba(0,0,0,0.07)' }}>

        {/* Progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em' }}>
            {answered} / {QUESTIONS.length} QUESTIONS ANSWERED
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {QUESTIONS.map((q, i) => (
              <div key={i} style={{ width: '20px', height: '6px', borderRadius: '3px', background: answers[q.id] ? '#22C55E' : 'var(--ed-rule)', transition: 'background 0.3s' }} />
            ))}
          </div>
        </div>

        {/* Questions */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px', marginBottom: '24px' }}>
          {QUESTIONS.map((q) => {
            const sel = answers[q.id];
            return (
              <div key={q.id}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '10px' }}>{q.label}</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                  {q.options.map((opt) => {
                    const isSelected = sel?.value === opt.value;
                    const barColor = opt.plgScore > opt.slgScore ? '#22C55E' : opt.slgScore > opt.plgScore ? '#6366F1' : '#F97316';
                    return (
                      <motion.button key={opt.value} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => answer(q.id, opt)}
                        style={{ padding: '12px 14px', borderRadius: '12px', border: `1.5px solid ${isSelected ? barColor + '60' : 'var(--ed-rule)'}`, background: isSelected ? `${barColor}10` : 'var(--ed-card)', cursor: 'pointer', textAlign: 'left' as const, transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ fontSize: '12px', fontWeight: isSelected ? 700 : 500, color: isSelected ? barColor : 'var(--ed-ink2)' }}>{opt.label}</div>
                          {isSelected && <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 800, color: barColor, flexShrink: 0 }}>selected</div>}
                        </div>
                        {isSelected && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.25 }}
                            style={{ marginTop: '6px', fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.55, overflow: 'hidden' }}>
                            {opt.note}
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Score bars */}
        {answered > 0 && (
          <div style={{ marginBottom: '20px', padding: '16px', borderRadius: '14px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '12px' }}>SCORE SO FAR</div>
            {[{ label: 'PLG signal', score: totalPLG, color: '#22C55E' }, { label: 'Sales-Led signal', score: totalSLG, color: '#6366F1' }].map(row => (
              <div key={row.label} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: row.color }}>{row.label}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 900, color: row.color }}>{row.score}/{maxScore}</div>
                </div>
                <div style={{ height: '8px', background: 'var(--ed-rule)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div animate={{ width: `${(row.score / maxScore) * 100}%` }} transition={{ duration: 0.5 }}
                    style={{ height: '100%', background: row.color, borderRadius: '4px', boxShadow: `0 0 8px ${row.color}60` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Result */}
        {allAnswered && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setShowResult(true)}
            style={{ padding: '12px 28px', borderRadius: '14px', cursor: 'pointer', fontSize: '13px', fontWeight: 800, background: 'linear-gradient(160deg, #22C55E 0%, #15803D 100%)', color: '#fff', border: 'none', boxShadow: '0 5px 0 #0F5E32, 0 8px 20px rgba(34,197,94,0.35)', marginBottom: '16px' }}>
            Get my GTM recommendation →
          </motion.button>
        )}

        <AnimatePresence>
          {showResult && allAnswered && (() => {
            const v = getVerdict();
            return (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: '20px', borderRadius: '16px', background: `${v.color}10`, border: `2px solid ${v.color}40`, borderLeft: `4px solid ${v.color}` }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: v.color, letterSpacing: '0.16em', marginBottom: '8px' }}>RECOMMENDED MOTION</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: v.color, marginBottom: '10px' }}>{v.motion}</div>
                <div style={{ fontSize: '13px', color: 'var(--ed-ink)', fontWeight: 600, lineHeight: 1.7, marginBottom: '16px' }}>{v.desc}</div>
                <div style={{ height: '1px', background: `${v.color}25`, marginBottom: '14px' }} />
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '8px' }}>HOW YOUR ANSWERS DROVE THIS</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                  {QUESTIONS.map(q => {
                    const sel = answers[q.id];
                    if (!sel) return null;
                    const barColor = sel.plgScore > sel.slgScore ? '#22C55E' : sel.slgScore > sel.plgScore ? '#6366F1' : '#F97316';
                    return (
                      <div key={q.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: barColor, flexShrink: 0, marginTop: '4px' }} />
                        <div style={{ fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.55 }}>
                          <strong style={{ color: barColor }}>{q.label}:</strong> {sel.note}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#22C55E' }}>The motion is a product question:</strong> the right GTM motion follows from what the product is and who it serves — not from what the founders prefer. PLG is not inherently better. Sales-led is not inherently worse. The fit is what matters.
      </div>
    </div>
  );
}

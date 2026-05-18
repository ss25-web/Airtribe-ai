'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── AI FEATURE QUALITY CRITERIA ──────────────────────────────────────────────
// The new PM skill: articulating what "good" looks like for AI features.
// AI outputs are non-deterministic — the same input can produce different
// outputs. A spec that says "the AI should detect coaching moments" is
// incomplete. This tool teaches how to write criteria that actually work.
//
// Interactive: learner judges 6 acceptance criteria as Good/Bad, then sees
// the fix. Then tries writing their own criterion and gets scored.

const CRITERIA_EXAMPLES = [
  {
    feature: 'AI coaching moment detection',
    criterion: 'The AI should accurately identify coaching moments in call recordings.',
    verdict: 'bad',
    problem: '"Accurately" is undefined. What counts as accurate? How do you measure it? Who decides if it\'s right?',
    fix: 'The model must identify coaching moments that a trained sales coach would agree with in at least 80% of cases, as measured by human review of 50 randomly sampled calls per quarter.',
    dimension: 'No measurability',
  },
  {
    feature: 'AI coaching moment detection',
    criterion: 'When a rep mishandles a pricing objection, the AI flags it as a "Pricing Skills" coaching moment. A human reviewer agrees with the flag in ≥80% of cases.',
    verdict: 'good',
    problem: null,
    fix: null,
    dimension: 'Specific + measurable + testable',
  },
  {
    feature: 'AI call summary',
    criterion: 'The AI generates a summary of each sales call.',
    verdict: 'bad',
    problem: 'What should the summary contain? How long? What counts as a "good" summary? How do you know if it\'s hallucinating?',
    fix: 'The AI generates a 3–5 sentence summary of each call that includes: (1) prospect\'s stated problem, (2) objections raised, (3) agreed next step. The summary must not contain any information not present in the transcript (no hallucination).',
    dimension: 'No structure or anti-hallucination check',
  },
  {
    feature: 'AI call summary',
    criterion: 'The AI summary must never state a next step that was not explicitly agreed in the call. Tested by comparing 100 summaries to transcripts — zero fabricated next steps allowed.',
    verdict: 'good',
    problem: null,
    fix: null,
    dimension: 'Anti-hallucination criterion with test method',
  },
  {
    feature: 'AI rep skill scoring',
    criterion: 'The AI scores reps on a scale of 1–10 for each coaching dimension. Scores must not drift by more than 0.5 points when the same call is scored twice.',
    verdict: 'good',
    problem: null,
    fix: null,
    dimension: 'Consistency criterion — tests for non-determinism',
  },
  {
    feature: 'AI rep skill scoring',
    criterion: 'The AI should give fair and consistent scores to all reps.',
    verdict: 'bad',
    problem: '"Fair" is not a testable criterion. "Consistent" is not defined. There\'s no way to run a test that determines if this criterion is met or failed.',
    fix: 'The AI must not produce scores that differ by more than 1 point when the same 30-second clip is scored 5 times in a row. This tests output consistency.',
    dimension: 'Untestable criterion',
  },
];

const VERDICT_COLORS = {
  good: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.3)', color: '#22C55E' },
  bad:  { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.3)',  color: '#EF4444' },
};

export function AIQualityCriteriaViz() {
  const [judged, setJudged] = useState<Record<number, 'good' | 'bad' | null>>({});
  const [showFix, setShowFix] = useState<Set<number>>(new Set());
  const [activeIdx, setActiveIdx] = useState(0);

  const judge = (idx: number, verdict: 'good' | 'bad') => {
    setJudged(prev => ({ ...prev, [idx]: verdict }));
  };

  const revealFix = (idx: number) => setShowFix(prev => new Set([...prev, idx]));
  const correct = Object.entries(judged).filter(([i, v]) => v === CRITERIA_EXAMPLES[Number(i)].verdict).length;
  const total = Object.keys(judged).length;

  return (
    <div style={{ margin: '36px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ padding: '4px 12px', borderRadius: '8px', background: '#8B5CF6', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '0.14em', boxShadow: '0 3px 0 #6D28D9' }}>
          AI QUALITY CRITERIA
        </div>
        <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', fontWeight: 600 }}>Judge each criterion — Good or Bad? Then see what makes it fail and how to fix it.</div>
      </div>

      {/* Score */}
      {total > 0 && (
        <div style={{ marginBottom: '16px', padding: '8px 16px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em' }}>YOUR SCORE</div>
          <div style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: 900, color: correct === total ? '#22C55E' : '#F97316' }}>{correct}/{total}</div>
          <div style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>criteria correctly identified</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '14px' }}>
        {CRITERIA_EXAMPLES.map((ex, i) => {
          const userVerdict = judged[i];
          const isCorrect = userVerdict === ex.verdict;
          const isWrong = userVerdict !== null && userVerdict !== ex.verdict;
          const fixShown = showFix.has(i);
          const feedbackColor = isCorrect ? '#22C55E' : '#EF4444';

          return (
            <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', border: `1.5px solid ${userVerdict ? (isCorrect ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)') : 'var(--ed-rule)'}`, transition: 'border-color 0.3s' }}>
              {/* Header */}
              <div style={{ padding: '12px 16px', background: 'var(--ed-card)', borderBottom: '1px solid var(--ed-rule)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#8B5CF6', letterSpacing: '0.12em' }}>CRITERION {i + 1}</div>
                <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>Feature: {ex.feature}</div>
                <div style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', padding: '2px 8px', borderRadius: '5px', background: 'var(--ed-rule)' }}>{ex.dimension}</div>
              </div>

              {/* Criterion text */}
              <div style={{ padding: '14px 16px', background: userVerdict ? (isCorrect ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)') : 'var(--ed-card)' }}>
                <div style={{ fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: '14px' }}>
                  &ldquo;{ex.criterion}&rdquo;
                </div>

                {/* Judge buttons */}
                {!userVerdict && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {(['good', 'bad'] as const).map(v => (
                      <motion.button key={v} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => judge(i, v)}
                        style={{ padding: '8px 22px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: 800, background: v === 'good' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: v === 'good' ? '#22C55E' : '#EF4444', border: `1.5px solid ${v === 'good' ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)'}` }}>
                        {v === 'good' ? '✓ Good criterion' : '✕ Bad criterion'}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Feedback */}
                {userVerdict && (
                  <AnimatePresence>
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <div style={{ padding: '4px 12px', borderRadius: '8px', background: `${feedbackColor}15`, border: `1px solid ${feedbackColor}40`, fontSize: '11px', fontWeight: 800, color: feedbackColor }}>
                          {isCorrect ? `✓ Correct — this is a ${ex.verdict} criterion` : `✕ Not quite — this is actually a ${ex.verdict} criterion`}
                        </div>
                      </div>

                      {ex.problem && (
                        <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '8px', fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>
                          <strong style={{ color: '#EF4444' }}>Why it fails:</strong> {ex.problem}
                        </div>
                      )}

                      {ex.fix && !fixShown && (
                        <motion.button whileHover={{ scale: 1.02 }} onClick={() => revealFix(i)}
                          style={{ padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 700, background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.3)' }}>
                          Show the fixed version →
                        </motion.button>
                      )}

                      {ex.fix && fixShown && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', fontSize: '12px', color: 'var(--ed-ink)', lineHeight: 1.7 }}>
                          <strong style={{ color: '#22C55E' }}>Fixed:</strong> {ex.fix}
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '14px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#8B5CF6' }}>The PM communication skill for AI:</strong> every AI feature needs at least one criterion that can be tested. &ldquo;The AI should be accurate&rdquo; is not testable. &ldquo;The AI must agree with a human reviewer in 80% of cases, measured monthly&rdquo; is.
      </div>
    </div>
  );
}

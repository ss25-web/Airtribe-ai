'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizEngine from '../QuizEngine';
import {
  glassCard, demoLabel, h2, para, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser,
} from './designSystem';
import { MentorFace } from './MentorFaces';

// ─────────────────────────────────────────
// CONVERSATION SCENE — Priya ↔ stakeholder
// ─────────────────────────────────────────
type CSLine = { speaker: 'priya' | 'other'; text: string };
const ConversationScene = ({ mentor, name, role, accent = 'var(--teal)', lines }: {
  mentor: 'rohan' | 'kiran' | 'maya' | 'dev' | 'asha'; name: string; role: string; accent?: string; lines: CSLine[];
}) => (
  <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {lines.map((l, i) => {
      const isPriya = l.speaker === 'priya';
      return (
        <div key={i} style={{ display: 'flex', flexDirection: isPriya ? 'row-reverse' : 'row', gap: '10px', alignItems: 'flex-end' }}>
          <div style={{ flexShrink: 0 }}>
            {isPriya ? <MentorFace mentor="priya" size={38} /> : <MentorFace mentor={mentor} size={38} />}
          </div>
          <div style={{ maxWidth: '72%' }}>
            {(i === 0 || lines[i - 1].speaker !== l.speaker) && <div style={{ fontSize: '10px', fontWeight: 700, color: isPriya ? 'var(--indigo)' : accent, marginBottom: '4px', textAlign: isPriya ? 'right' : 'left', letterSpacing: '0.04em' }}>{isPriya ? 'Priya' : name} <span style={{ fontWeight: 400, opacity: 0.65 }}>· {isPriya ? 'PM' : role}</span></div>}
            <div style={{ background: isPriya ? 'rgba(99,102,241,0.13)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isPriya ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: isPriya ? '14px 14px 4px 14px' : '14px 14px 14px 4px', padding: '10px 14px', fontSize: '13.5px', color: 'var(--ed-ink)', lineHeight: 1.65 }}>{l.text}</div>
          </div>
        </div>
      );
    })}
  </div>
);

// ─────────────────────────────────────────
// LOCAL HELPERS
// ─────────────────────────────────────────
const InfoBox = ({ title, accent = 'var(--teal)', children }: { title: string; accent?: string; children: React.ReactNode }) => (
  <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '20px 24px', margin: '24px 0', border: '1px solid var(--ed-rule)', borderLeft: `4px solid ${accent}` }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: accent, marginBottom: '14px' }}>{title}</div>
    {children}
  </div>
);

// ─────────────────────────────────────────
// TILT CARD — 3D mouse-tracking wrapper
// ─────────────────────────────────────────
const TiltCard = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -6, y: x * 6, scale: 1.012 });
  };
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0, scale: 1 })}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`,
        transition: 'transform 0.18s ease',
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ─────────────────────────────────────────
// NOTION: RESEARCH REPO SEARCH (interactive)
// ─────────────────────────────────────────
const NotionRepoSearch = () => {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [decision, setDecision] = useState<number | null>(null);

  const existingStudy = {
    title: 'Manager Churn — Exit Interview Study',
    date: '3 months ago',
    interviews: 12,
    finding: 'Managers churn when they cannot demonstrate EdSpark\'s ROI to their own leadership. Of 12 churned managers, 9 cited inability to "show results" as their primary reason for stopping.',
    status: 'No major product changes shipped since this study that would affect the root cause.',
  };

  const decisions = [
    {
      label: 'Start fresh — 3-month-old data is too stale to trust',
      correct: false,
      feedback: 'Starting fresh costs 2 weeks and 12+ interviews — and often produces the same finding. Before re-running, validate whether anything has changed. If the product shipped nothing relevant in 3 months, the insight likely still holds.',
    },
    {
      label: 'Validate the core finding and scope new research only for what may have changed',
      correct: true,
      feedback: 'This is research ops maturity. You build on what you already know instead of starting from zero. Run 4–5 targeted interviews to validate the 3-month-old finding, then focus new effort on any areas where the product has shipped changes since. Faster delivery, compounding team knowledge.',
    },
    {
      label: 'Accept the existing study as current — no new research needed',
      correct: false,
      feedback: 'Dangerous without validation. The product may have shipped something since this study that shifts the root cause. Research has a shelf life. Validate before you assume it is still current — especially before bringing it to a cross-functional meeting.',
    },
  ];

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E0D9D0', boxShadow: '0 24px 64px rgba(0,0,0,0.14)' }}>
        <div style={{ background: '#F7F6F3', borderBottom: '1px solid #E0D9D0', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57', '#FFBD2E', '#28C840'].map(c => <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ fontSize: '11px', color: '#999', fontFamily: 'monospace', background: '#EDEDEC', padding: '3px 12px', borderRadius: '5px' }}>
              📚 EdSpark &middot; PM Research Repository
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', minHeight: '360px' }}>
          <div style={{ width: '190px', background: '#F7F6F3', borderRight: '1px solid #E0D9D0', padding: '14px 0', flexShrink: 0 }}>
            <div style={{ padding: '0 12px', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#37352F' }}>🔭 Research Hub</div>
            </div>
            {[
              { icon: '🗂️', label: 'Insight Repository', active: false },
              { icon: '📊', label: 'Onboarding Studies', active: false },
              { icon: '📊', label: 'Retention Studies', active: true },
              { icon: '📄', label: '→ Manager Churn', active: false },
              { icon: '📄', label: '→ Onboarding Drop', active: false },
              { icon: '❓', label: 'Open Questions', active: false },
            ].map(item => (
              <div key={item.label} style={{ padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '7px', background: item.active ? '#EDEDEC' : 'transparent', borderRadius: '4px', margin: '1px 4px' }}>
                <span style={{ fontSize: '12px' }}>{item.icon}</span>
                <span style={{ fontSize: '11px', color: item.active ? '#37352F' : '#888', fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
              </div>
            ))}
          </div>

          <div style={{ flex: 1, padding: '20px 24px', background: '#fff' }}>
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,151,167,0.07)', border: '1px solid rgba(0,151,167,0.2)', marginBottom: '16px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '8px', color: '#0097A7', letterSpacing: '0.1em', marginBottom: '4px' }}>NEW RESEARCH REQUEST &middot; FROM ROHAN</div>
              <div style={{ fontSize: '13px', color: '#37352F', fontStyle: 'italic' as const }}>&ldquo;Understand why managers are churning from EdSpark.&rdquo;</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#999', letterSpacing: '0.08em', marginBottom: '6px' }}>BEFORE STARTING NEW RESEARCH &mdash; SEARCH THE REPO FIRST</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && query.trim()) setSearched(true); }}
                  placeholder='Try "manager churn" or "retention"...'
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1.5px solid #E0D9D0', fontSize: '12px', fontFamily: 'monospace', outline: 'none', background: '#FAFAF9' }}
                />
                <button
                  onClick={() => { if (query.trim()) setSearched(true); }}
                  style={{ padding: '8px 16px', borderRadius: '6px', background: '#37352F', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px', fontWeight: 700 }}
                >
                  Search
                </button>
              </div>
            </div>

            <AnimatePresence>
              {searched && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#999', letterSpacing: '0.08em', marginBottom: '8px' }}>1 RESULT FOUND</div>
                  <div style={{ padding: '14px 16px', borderRadius: '8px', border: '1.5px solid #0097A7', background: 'rgba(0,151,167,0.04)', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#37352F' }}>{existingStudy.title}</div>
                      <span style={{ fontFamily: 'monospace', fontSize: '9px', color: '#999' }}>{existingStudy.date}</span>
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#0097A7', marginBottom: '8px' }}>{existingStudy.interviews} interviews</div>
                    <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.7, marginBottom: '8px' }}><strong>Finding:</strong> {existingStudy.finding}</div>
                    <div style={{ fontSize: '11px', color: '#888', fontStyle: 'italic' as const }}>{existingStudy.status}</div>
                  </div>

                  <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#5E6C84', letterSpacing: '0.08em', marginBottom: '8px' }}>THIS STUDY IS 3 MONTHS OLD. WHAT DO YOU RECOMMEND?</div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '7px' }}>
                    {decisions.map((d, i) => {
                      const isPicked = decision === i;
                      return (
                        <div key={i}>
                          <button
                            onClick={() => setDecision(i)}
                            style={{
                              width: '100%', textAlign: 'left' as const, padding: '10px 14px', borderRadius: '7px', cursor: 'pointer',
                              border: `1.5px solid ${isPicked ? (d.correct ? '#0D7A5A' : '#FF5630') : '#E0D9D0'}`,
                              background: isPicked ? (d.correct ? 'rgba(13,122,90,0.06)' : 'rgba(255,86,48,0.05)') : '#FAFAF9',
                              fontSize: '12px', color: '#37352F', lineHeight: 1.5,
                            }}
                          >
                            <span style={{ fontFamily: 'monospace', fontSize: '9px', color: '#999', marginRight: '6px' }}>{String.fromCharCode(65 + i)}.</span>
                            {d.label}
                          </button>
                          <AnimatePresence>
                            {isPicked && (
                              <motion.div key="feedback" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                                <div style={{ padding: '8px 14px', fontSize: '11px', color: d.correct ? '#0D7A5A' : '#C85A40', background: d.correct ? 'rgba(13,122,90,0.05)' : 'rgba(200,90,64,0.05)', borderRadius: '0 0 7px 7px', lineHeight: 1.6 }}>
                                  {d.correct ? '✓ ' : '✗ '}{d.feedback}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// KRAFTFUL: HYPOTHESIS TESTER (interactive)
// ─────────────────────────────────────────
const KraftfulHypothesisTester = () => {
  type Hyp = 'ceo' | 'priya';
  const [active, setActive] = useState<Hyp>('ceo');
  const [seenPriya, setSeenPriya] = useState(false);
  const bothSeen = seenPriya;
  const months = ['Oct', 'Nov', 'Dec', 'Jan'];
  const hyps: Record<Hyp, { label: string; color: string; values: number[]; trend: string; insight: string; verdict: string }> = {
    ceo: {
      label: 'Onboarding confusion tickets',
      color: '#00BCD4',
      values: [38, 36, 31, 28],
      trend: '-26%',
      insight: 'Onboarding-related tickets declined 26% over 4 months. The three onboarding improvements shipped last quarter are working. This problem is resolving.',
      verdict: "CEO's hypothesis is built on stale data. Onboarding is improving, not worsening.",
    },
    priya: {
      label: 'Value visibility gap tickets',
      color: '#B794F4',
      values: [21, 29, 38, 41],
      trend: '+95%',
      insight: 'Value visibility tickets have nearly doubled in 4 months. Users report they cannot tell if EdSpark is producing results. This is accelerating.',
      verdict: "This is the growing problem. Optimising onboarding now means solving yesterday's issue.",
    },
  };
  const d = hyps[active];
  const maxVal = 45;
  const handleTab = (h: Hyp) => { setActive(h); if (h === 'priya') setSeenPriya(true); };
  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #1E3A3F', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        <div style={{ background: 'linear-gradient(90deg,#0D1F24 0%,#0A1A1F 100%)', padding: '13px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#FF5F57', '#FFBD2E', '#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, boxShadow: `0 0 4px ${c}55` }} />)}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 800, color: '#00BCD4', letterSpacing: '0.12em', textShadow: '0 0 12px rgba(0,188,212,0.5)' }}>KRAFTFUL</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>/ EdSpark &middot; Ticket Trends &middot; Hypothesis Tester</div>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', color: bothSeen ? '#28C840' : 'rgba(255,255,255,0.3)' }}>
            {bothSeen ? '✓ both hypotheses reviewed' : 'view both to compare'}
          </div>
        </div>
        <div style={{ background: '#111C1F', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)', paddingTop: '1px' }}>HYPOTHESIS:</div>
          {(['ceo', 'priya'] as Hyp[]).map(h => (
            <button key={h} onClick={() => handleTab(h)} style={{ padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '10px', fontWeight: active === h ? 700 : 400, border: `1.5px solid ${active === h ? hyps[h].color : 'rgba(255,255,255,0.12)'}`, background: active === h ? `${hyps[h].color}18` : 'transparent', color: active === h ? hyps[h].color : 'rgba(255,255,255,0.45)' }}>
              {h === 'ceo' ? 'CEO: Onboarding is broken' : 'Priya: Value visibility gap'}
            </button>
          ))}
        </div>
        <div style={{ background: 'linear-gradient(180deg,#111C1F 0%,#0D1619 100%)', padding: '24px 28px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '9px', color: d.color, letterSpacing: '0.1em', marginBottom: '16px', fontWeight: 700 }}>
            {d.label} &mdash; Oct to Jan &mdash; <span style={{ fontSize: '13px' }}>{d.trend}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '20px' }}>
            {months.map((month, i) => (
              <div key={month} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>{month}</div>
                <div style={{ flex: 1, height: '22px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div
                    key={`${active}-${i}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.values[i] / maxVal) * 100}%` }}
                    transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.07 }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${d.color} 0%, ${d.color}88 100%)`, borderRadius: '4px', boxShadow: `0 0 8px ${d.color}44` }}
                  />
                </div>
                <div style={{ width: '32px', fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: d.color, textAlign: 'right' as const }}>{d.values[i]}%</div>
              </div>
            ))}
          </div>
          <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '12px 16px', borderRadius: '10px', background: `${d.color}12`, border: `1px solid ${d.color}35`, display: 'flex', gap: '10px' }}>
            <div style={{ fontSize: '16px', flexShrink: 0, lineHeight: 1.4 }}>✦</div>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: d.color, letterSpacing: '0.12em', marginBottom: '5px' }}>AI INSIGHT</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75 }}>{d.insight}</div>
              {bothSeen && <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 600, color: d.color }}>{d.verdict}</div>}
            </div>
          </motion.div>
        </div>
        <AnimatePresence>
          {bothSeen && (
            <motion.div key="verdict" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
              <div style={{ background: '#0D1F24', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '10px 20px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#28C840', lineHeight: 1.6 }}>
                  ✓ Both hypotheses reviewed &mdash; onboarding is declining while value visibility is rising. The problem has shifted. This is Priya&apos;s case to Rohan.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// DOVETAIL: SYNTHESIS BOARD (interactive)
// ─────────────────────────────────────────
const DovetailSynthesisBoard = () => {
  type Tag = 'loop' | 'roi';
  const quotes = [
    { text: 'I upload a recording and then nothing. I do not know what to do with it.' },
    { text: 'My director asked me last week if this is worth the cost.' },
    { text: 'I expected some kind of summary or score. It just sits there.' },
    { text: 'I signed up to show my team I take development seriously, but I cannot show it is working.' },
    { text: 'I want to walk into my next 1:1 with a number.' },
    { text: 'There is no signal. I do not know if EdSpark is doing anything useful.' },
  ];
  const [tags, setTags] = useState<Partial<Record<number, Tag>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [problemChoice, setProblemChoice] = useState<number | null>(null);
  const allTagged = Object.keys(tags).length === quotes.length;
  const tagColors: Record<Tag, string> = { loop: '#0097A7', roi: '#7C3AED' };
  const problems = [
    { text: 'EdSpark onboarding is confusing — new managers do not know what to do after signing up.', correct: false, type: 'Symptom', feedback: 'Onboarding confusion is a surface signal that is actually declining in frequency. None of these 6 quotes mention onboarding. You have the wrong frame for this data.' },
    { text: 'Sales managers cannot see evidence that EdSpark is working — for themselves or their leadership.', correct: true, type: 'Root cause', feedback: 'This is the synthesis. Both "no feedback loop" and "cannot show ROI" are expressions of the same gap: the product never shows managers it is working. One sentence covers both clusters and gives the team a single, clear target.' },
    { text: 'EdSpark needs better reporting features and a manager-facing dashboard.', correct: false, type: 'Solution in disguise', feedback: 'This is already a solution. You skipped the "why" and went to "what." The team will debate dashboard designs instead of the real problem. Problem statements must never name a feature.' },
  ];
  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #2D1B69', boxShadow: '0 24px 64px rgba(0,0,0,0.22)' }}>
        <div style={{ background: '#1A1523', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57', '#FFBD2E', '#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: '#B794F4', letterSpacing: '0.1em' }}>DOVETAIL</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>/ Synthesis Board &middot; 14 interviews &middot; 94 tagged moments</div>
          <div style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '9px', color: allTagged ? '#28C840' : 'rgba(255,255,255,0.3)' }}>
            {Object.keys(tags).length}/{quotes.length} tagged
          </div>
        </div>
        <div style={{ background: '#F9F8FF', padding: '16px 20px' }}>
          {!submitted ? (
            <>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#7C3AED', letterSpacing: '0.1em', marginBottom: '12px' }}>TAG EACH QUOTE &mdash; WHICH THEME DOES IT BELONG TO?</div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                {(['loop', 'roi'] as Tag[]).map(t => (
                  <div key={t} style={{ padding: '4px 10px', borderRadius: '5px', background: `${tagColors[t]}12`, border: `1px solid ${tagColors[t]}30`, fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: tagColors[t], letterSpacing: '0.06em' }}>
                    {t === 'loop' ? 'Feedback Loop' : 'ROI Visibility'}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '14px' }}>
                {quotes.map((q, i) => {
                  const assigned = tags[i];
                  return (
                    <div key={i} style={{ padding: '10px 14px', borderRadius: '8px', background: '#fff', border: `1.5px solid ${assigned ? tagColors[assigned] : '#E0D9D0'}`, display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ fontSize: '12px', fontStyle: 'italic' as const, color: '#37352F', flex: 1, lineHeight: 1.55 }}>&ldquo;{q.text}&rdquo;</div>
                      <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                        {(['loop', 'roi'] as Tag[]).map(t => (
                          <button key={t} onClick={() => setTags(prev => ({ ...prev, [i]: t }))} style={{ padding: '4px 8px', borderRadius: '5px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, border: `1.5px solid ${assigned === t ? tagColors[t] : '#E0D9D0'}`, background: assigned === t ? `${tagColors[t]}18` : '#F9F8FF', color: assigned === t ? tagColors[t] : '#999' }}>
                            {t === 'loop' ? 'Loop' : 'ROI'}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <AnimatePresence>
                {allTagged && (
                  <motion.div key="syn-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <button onClick={() => setSubmitted(true)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#7C3AED', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em' }}>
                      SYNTHESISE &rarr;
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)', marginBottom: '14px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#7C3AED', letterSpacing: '0.1em', marginBottom: '6px' }}>SYNTHESIS INSIGHT</div>
                <div style={{ fontSize: '13px', color: '#37352F', lineHeight: 1.7 }}>
                  Both clusters &mdash; &ldquo;feedback loop&rdquo; and &ldquo;ROI visibility&rdquo; &mdash; describe the same underlying gap: <strong>the product never shows managers that it is working.</strong> Two themes on the surface. One root cause underneath.
                </div>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: '#5E6C84', letterSpacing: '0.08em', marginBottom: '8px' }}>NOW WRITE THE PROBLEM STATEMENT &mdash; WHICH FRAMING CAPTURES THE ROOT CAUSE?</div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '7px' }}>
                {problems.map((p, i) => {
                  const isPicked = problemChoice === i;
                  return (
                    <div key={i}>
                      <button onClick={() => setProblemChoice(i)} style={{ width: '100%', textAlign: 'left' as const, padding: '10px 14px', borderRadius: '7px', cursor: 'pointer', border: `1.5px solid ${isPicked ? (p.correct ? '#0D7A5A' : '#FF5630') : '#E0D9D0'}`, background: isPicked ? (p.correct ? 'rgba(13,122,90,0.06)' : 'rgba(255,86,48,0.05)') : '#fff', fontSize: '12px', fontStyle: 'italic' as const, color: '#37352F', lineHeight: 1.5 }}>
                        &ldquo;{p.text}&rdquo;
                        {isPicked && <span style={{ marginLeft: '8px', fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, fontStyle: 'normal' as const, color: p.correct ? '#0D7A5A' : '#FF5630' }}>{p.type.toUpperCase()}</span>}
                      </button>
                      <AnimatePresence>
                        {isPicked && (
                          <motion.div key="ps-fb" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                            <div style={{ padding: '8px 14px', fontSize: '11px', color: p.correct ? '#0D7A5A' : '#C85A40', background: p.correct ? 'rgba(13,122,90,0.05)' : 'rgba(200,90,64,0.05)', borderRadius: '0 0 7px 7px', lineHeight: 1.6 }}>
                              {p.correct ? '✓ ' : '✗ '}{p.feedback}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => { setSubmitted(false); setTags({}); setProblemChoice(null); }} style={{ marginTop: '12px', fontSize: '11px', fontFamily: 'monospace', color: '#7C3AED', background: 'none', border: '1px solid rgba(124,58,237,0.3)', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                Reset &rarr;
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 1: CHALLENGE THE BRIEF
// ─────────────────────────────────────────
const BRIEF_SCENARIOS = [
  {
    ceo_brief: '"We need better onboarding. Users are confused in the first week."',
    data_point: 'Kraftful shows onboarding-related tickets declining 26% while value-visibility tickets rose 95% over 4 months.',
    options: [
      { label: 'Run with it — CEO said onboarding, do onboarding', outcome: 'wrong', feedback: "You optimise for yesterday's problem. Onboarding confusion is declining — you'll ship improvements right as the root cause has shifted. 3 months wasted." },
      { label: 'Show the trend data and ask to reframe the research question', outcome: 'right', feedback: "The data reveals a shift. A good APM doesn't just execute the brief — they bring evidence that the brief may be based on stale assumptions. You earn trust by catching this early." },
      { label: 'Do both onboarding and value-visibility research in parallel', outcome: 'partial', feedback: "Hedging avoids the hard conversation. You'll deliver two shallow studies instead of one definitive one, and you still haven't resolved which problem to actually solve." },
    ],
  },
  {
    ceo_brief: '"Retention is down. We need to understand why managers are churning."',
    data_point: 'Your research repo already has a 3-month-old study on manager churn with 12 interviews. Key finding: managers churn when they can\'t demonstrate ROI to leadership.',
    options: [
      { label: 'Start new interviews — the old data is 3 months old', outcome: 'partial', feedback: "Not wrong, but not efficient. Before re-running interviews, validate whether the core finding has changed. Check if the product shipped anything in those 3 months that might shift the root cause. If not, the 3-month-old insight probably still holds." },
      { label: 'Check the repo first, then decide if new research is needed', outcome: 'right', feedback: "This is research ops maturity. You validate what you already know before spending 2 weeks re-interviewing. The repo exists precisely for this. If the core finding is stable, you can move faster." },
      { label: 'Send a survey — faster than interviews', outcome: 'wrong', feedback: "Surveys confirm hypotheses you already have. You don't have a good hypothesis yet — you have a symptom. Surveys will give you noise at scale, not insight." },
    ],
  },
];

const ChallengeBrief = () => {
  const [scene, setScene] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const sc = BRIEF_SCENARIOS[scene];
  const opt = chosen !== null ? sc.options[chosen] : null;

  return (
    <div style={glassCard('var(--purple)', '120,67,238')}>
      {demoLabel('When should you challenge the brief?', 'var(--purple)')}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {BRIEF_SCENARIOS.map((_, i) => (
          <button key={i} onClick={() => { setScene(i); setChosen(null); }}
            style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: i === scene ? 700 : 400, border: `2px solid ${i === scene ? 'var(--purple)' : 'var(--ed-rule)'}`, background: i === scene ? 'rgba(120,67,238,0.1)' : 'var(--ed-card)', color: i === scene ? 'var(--purple)' : 'var(--ed-ink3)', cursor: 'pointer' }}>
            Scenario {i + 1}
          </button>
        ))}
      </div>
      <div style={{ padding: '14px 18px', borderRadius: '10px', background: 'rgba(120,67,238,0.05)', border: '1px solid rgba(120,67,238,0.15)', marginBottom: '10px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--purple)', letterSpacing: '0.12em', marginBottom: '6px' }}>CEO BRIEF</div>
        <div style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--ed-ink)', lineHeight: 1.7 }}>{sc.ceo_brief}</div>
      </div>
      <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,151,167,0.06)', border: '1px solid rgba(0,151,167,0.2)', marginBottom: '20px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--teal)', letterSpacing: '0.12em', marginBottom: '5px' }}>YOU ALSO KNOW</div>
        <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{sc.data_point}</div>
      </div>
      {chosen === null ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sc.options.map((o, i) => (
            <motion.button key={i} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} onClick={() => setChosen(i)}
              style={{ padding: '13px 16px', borderRadius: '10px', border: '2px solid rgba(120,67,238,0.18)', background: 'var(--ed-card)', cursor: 'pointer', textAlign: 'left' as const, fontSize: '13px', color: 'var(--ed-ink2)', transition: 'all 0.18s' }}>
              {o.label}
            </motion.button>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ padding: '14px 18px', borderRadius: '10px', border: `2px solid ${opt!.outcome === 'right' ? 'var(--green)' : opt!.outcome === 'partial' ? 'var(--blue)' : 'var(--coral)'}`, background: `rgba(${opt!.outcome === 'right' ? '21,129,88' : opt!.outcome === 'partial' ? '58,134,255' : '224,122,95'},0.06)`, marginBottom: '10px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', marginBottom: '7px', color: opt!.outcome === 'right' ? 'var(--green)' : opt!.outcome === 'partial' ? 'var(--blue)' : 'var(--coral)' }}>
              {opt!.outcome === 'right' ? '✓ STRONG MOVE' : opt!.outcome === 'partial' ? '~ PARTIAL' : '✗ RISKY CALL'}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>{opt!.feedback}</div>
          </div>
          <button onClick={() => setChosen(null)} style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ed-ink3)', background: 'none', border: '1px solid var(--ed-rule)', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer' }}>Try again →</button>
        </motion.div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 2: RESEARCH BIAS SPOTTER
// ─────────────────────────────────────────
const BIAS_CASES = [
  {
    scenario: 'You interview 10 managers who are still active users. 8 say they love EdSpark.',
    bias: 'Survivorship bias',
    color: 'var(--coral)',
    explanation: "You're only talking to the people who didn't leave. Churned managers — the ones who represent your actual problem — are invisible. Of course active users say they're happy. You've excluded the signal you need most.",
    fix: "Deliberately recruit churned users. If that's hard, use support ticket analysis (Kraftful) to surface the voice of users who stopped engaging.",
  },
  {
    scenario: 'You\'ve decided the problem is "no progress signal." You run interviews and find lots of supporting evidence.',
    bias: 'Confirmation bias',
    color: 'var(--purple)',
    explanation: "You're unconsciously steering questions and noticing evidence that confirms what you already believe. Disconfirming evidence gets mentally discounted. Priya almost did this — she had 'no progress signal' as her working theory and nearly missed that several users also mentioned a totally separate issue with rep-level data.",
    fix: "Before each interview, write down 'what would I learn that would prove my hypothesis wrong?' and actively listen for that.",
  },
  {
    scenario: 'The CEO asks you to investigate a specific pain point. You run 6 interviews. 5 of 6 mention it.',
    bias: 'Framing bias',
    color: 'var(--blue)',
    explanation: "The CEO framed the problem, and your participants may be responding to that frame. If you ask 'tell me about your onboarding experience,' you've primed users to think about onboarding. They'll mention onboarding-related issues even if something else is more important.",
    fix: "Open with unprimed questions: 'Walk me through your first two weeks with EdSpark' — before you ask about anything specific. Let them surface what's actually bothering them.",
  },
];

const BiasSpotter = () => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  return (
    <div style={glassCard('var(--coral)', '224,122,95')}>
      {demoLabel('Name the bias — tap to diagnose.', 'var(--coral)')}
      <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginBottom: '16px', lineHeight: 1.6 }}>Every research design has hidden biases. Senior PMs catch them before the study runs — not after the brief is written.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {BIAS_CASES.map((item, i) => {
          const isRevealed = revealed[i];
          return (
            <motion.button key={i} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
              style={{ padding: '16px 18px', borderRadius: '12px', border: `2px solid ${isRevealed ? item.color : 'rgba(224,122,95,0.2)'}`, background: 'var(--ed-card)', cursor: 'pointer', textAlign: 'left' as const, transition: 'all 0.2s' }}>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65, marginBottom: isRevealed ? '12px' : 0 }}>{item.scenario}</div>
              <AnimatePresence>
                {isRevealed && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 800, color: item.color, letterSpacing: '0.14em', marginBottom: '8px' }}>{item.bias.toUpperCase()}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7, marginBottom: '10px' }}>{item.explanation}</div>
                    <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(21,129,88,0.07)', border: '1px solid rgba(21,129,88,0.2)', borderLeft: '3px solid var(--green)' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--green)', letterSpacing: '0.12em', marginBottom: '5px' }}>HOW TO MITIGATE</div>
                      <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{item.fix}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 3: PROBLEM FRAMING SHOWDOWN
// ─────────────────────────────────────────
const FRAME_OPTIONS = [
  {
    frame: 'Onboarding is too confusing for new managers.',
    type: 'Symptom',
    color: 'var(--coral)',
    consequence: "This leads to UI fixes and tutorials. You'll ship a cleaner signup flow while churning for a completely different reason.",
  },
  {
    frame: 'Managers have no feedback loop that shows their coaching is working.',
    type: 'Root cause',
    color: 'var(--green)',
    consequence: "This opens up a much wider solution space: automated ROI summaries, coaching impact scores, manager-specific dashboards. You solve the job, not the surface symptom.",
  },
  {
    frame: 'EdSpark needs a better dashboard.',
    type: 'Solution in disguise',
    color: 'var(--purple)',
    consequence: "This isn't a problem statement — it's already a solution. You've skipped the 'why' and gone straight to the 'what.' The team will debate dashboard features instead of the real problem.",
  },
  {
    frame: 'Week-2 retention is 60% — below target.',
    type: 'Metric, not a problem',
    color: 'var(--blue)',
    consequence: "This describes a symptom in numbers. It's useful for scoping but not for guiding design. You still don't know what to fix.",
  },
];

const ProblemFramingShowdown = () => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  return (
    <div style={glassCard('var(--teal)', '0,151,167')}>
      {demoLabel('Four ways to frame the same problem — tap to evaluate.', 'var(--teal)')}
      <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginBottom: '16px', lineHeight: 1.6 }}>Same research data. Four different framings. Only one is a real problem statement that gets the team building the right thing.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {FRAME_OPTIONS.map((item, i) => {
          const isRevealed = revealed[i];
          return (
            <motion.button key={i} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
              style={{ padding: '15px 18px', borderRadius: '12px', border: `2px solid ${isRevealed ? item.color : 'rgba(0,151,167,0.18)'}`, background: 'var(--ed-card)', cursor: 'pointer', textAlign: 'left' as const, transition: 'all 0.2s' }}>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.6, marginBottom: isRevealed ? '10px' : 0, fontStyle: 'italic' }}>&ldquo;{item.frame}&rdquo;</div>
              <AnimatePresence>
                {isRevealed && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 800, color: item.color, letterSpacing: '0.14em', marginBottom: '8px' }}>{item.type.toUpperCase()}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>{item.consequence}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// QUIZZES
// ─────────────────────────────────────────
const MODULE_CONTEXT = `Module 02 of Airtribe PM Fundamentals — Track: Experienced APM.
Priya is a 2-year PM at EdSpark, leading a team doing a discovery sprint. Covers: challenging stakeholder-defined briefs, research ops and insight repositories, research bias (survivorship, confirmation, framing), strategic problem framing, and running discovery at the organisational level with Notion, Dovetail, and Kraftful.`;

const QUIZZES = [
  {
    conceptId: 'user-research',
    conceptName: 'User Research',
    question: "Your CEO says 'the onboarding is broken.' Kraftful data shows onboarding tickets declining while 'value visibility' tickets tripled. What's your move?",
    options: [
      'A. The CEO is closest to revenue — run with the onboarding brief',
      'B. Show the trend data and propose reframing the research question before committing',
      'C. Run both onboarding and value research in parallel to avoid conflict',
      'D. Do onboarding research first, then value visibility if time allows',
    ],
    correctIndex: 1,
    explanation: "The data suggests the problem has shifted. A senior PM\'s job isn\'t to execute briefs — it\'s to make sure the team is solving the right problem. You bring the evidence, frame it respectfully ('I want to validate this before we commit'), and let the data drive the conversation. Option C is hedging that delivers two shallow studies instead of one definitive answer.",
    keyInsight: "Challenging a brief isn't insubordination — it's exactly what APMs are paid for. Bring data, not opinions.",
  },
  {
    conceptId: 'customer-segments',
    conceptName: 'Customer Segments',
    question: "You need to understand why managers are churning. Your research repo has a 3-month-old study on manager churn. What do you do?",
    options: [
      'A. Ignore it — 3 months is too old in a fast-moving product',
      'B. Check the repo first, validate whether the core finding has changed, then decide if new research is needed',
      'C. Run new interviews — fresh data is always better',
      'D. Send a survey to confirm the old findings at scale',
    ],
    correctIndex: 1,
    explanation: "Research repos exist precisely for this. Before re-running expensive research, check what you already know. If the product shipped nothing in 3 months that would affect the root cause, the old insight probably still holds. 'Fresh data is always better' is a junior instinct — senior PMs compound knowledge rather than starting from zero.",
    keyInsight: "Good research ops means never starting from zero. The repo is your memory. Use it.",
  },
  {
    conceptId: 'research-methods',
    conceptName: 'Research Methods',
    question: "You interview 10 active managers. 8 say they're satisfied. You conclude 'most managers are happy.' What's wrong?",
    options: [
      'A. 10 is too small a sample — you need at least 50',
      'B. You only talked to active users. Churned users — the ones who represent the problem — are invisible.',
      'C. Satisfaction surveys are more reliable than interviews for this question',
      'D. Nothing — if 80% are satisfied, churn must be caused by something else',
    ],
    correctIndex: 1,
    explanation: "This is survivorship bias. Active users are the population that didn't fail. They can't tell you why others left. The most important signal — why managers churned — comes from churned managers who are no longer in your sample. 8/10 active users being happy is completely consistent with 40% of all managers churning.",
    keyInsight: "Your sample defines your findings. Always ask: who is excluded from my research that matters most?",
  },
  {
    conceptId: 'jtbd',
    conceptName: 'Jobs to Be Done',
    question: "Across 14 manager interviews, 11 mention needing to 'show their director that coaching is working.' What's the job?",
    options: [
      'A. Better reporting features — they want data visibility',
      'B. Build credibility with leadership using evidence of impact',
      'C. A Slack integration so managers can share updates easily',
      'D. Weekly automated summaries sent to the manager\'s inbox',
    ],
    correctIndex: 1,
    explanation: "11 of 14 managers describing the same underlying need is a clear job signal. The job isn't 'reporting' — it's political: these managers need to look competent to their own managers. That's about credibility and career safety. Any solution must make it effortless to demonstrate impact. A Slack integration or summary email is a possible feature — but feature decisions come after you've named the job correctly.",
    keyInsight: "Jobs are functional, social, and emotional. 'Prove ROI to my boss' is a social/political job — the product must serve that, not just the functional use case.",
  },
  {
    conceptId: 'insight-synthesis',
    conceptName: 'Insight Synthesis',
    question: "Your Dovetail repo shows two findings: 'ROI visibility' (11/14) and 'no feedback loop post-upload' (9/14). How do you frame the discovery brief?",
    options: [
      'A. Write two separate briefs — don\'t combine findings',
      'B. They\'re the same underlying job: managers need evidence that EdSpark is working. Frame as one root cause.',
      'C. Pick the higher-frequency finding (ROI visibility) and ignore the other',
      'D. Run more interviews to decide which finding is more important',
    ],
    correctIndex: 1,
    explanation: "'No feedback loop post-upload' and 'can't show ROI to leadership' are two expressions of the same root problem: the product never shows managers that it's working. Separating them creates two workstreams when one well-framed problem statement covers both. Synthesis is about finding the single frame that explains multiple signals — not just listing them.",
    keyInsight: "Great synthesis collapses multiple findings into one coherent problem statement. If you have 6 findings, you have a list. If you have one insight, you have a brief.",
  },
  {
    conceptId: 'problem-framing',
    conceptName: 'Problem Framing',
    question: "Which is the strongest problem statement to bring to a cross-functional team meeting?",
    options: [
      'A. "Week-2 retention is 60% — we need to fix it."',
      'B. "Onboarding needs a redesign based on user feedback."',
      'C. "Sales managers join EdSpark to prove their coaching works, but the product never gives them evidence that it does."',
      'D. "We need a manager dashboard with coaching impact scores."',
    ],
    correctIndex: 2,
    explanation: "Option A is a metric — it states the symptom in numbers. Option B is a conclusion that jumps to solution. Option D is a solution, not a problem. Option C names the user, their job, and the gap — without prescribing a solution. That's what a problem statement does: it gives the team a shared target and leaves solution space open.",
    keyInsight: "The best problem statement names who, what they're trying to do, and where the product fails them. No solution in the statement. Ever.",
  },
];

// ─────────────────────────────────────────
// INTRO HERO
// ─────────────────────────────────────────
const IntroHero = () => (
  <section style={{ background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', padding: '48px 0 40px' }}>
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 28px' }}>
      {/* Full-width text content */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--teal)', marginBottom: '12px', textTransform: 'uppercase' as const }}>
          MODULE 02 · APM TRACK
        </div>
        <h1 style={{ fontFamily: "'Lora', serif", fontSize: '32px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.2, marginBottom: '16px' }}>
          Discovery at the<br />Organisational Level
        </h1>
        <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.8, marginBottom: '24px', maxWidth: '640px' }}>
          As a senior PM, your job isn&apos;t just to do discovery. It&apos;s to build a culture where the team can&apos;t ship without it — and to challenge the briefs that point everyone at the wrong problem.
        </div>
        <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'rgba(0,151,167,0.06)', border: '1px solid rgba(0,151,167,0.18)', marginBottom: '24px', maxWidth: '580px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.14em', marginBottom: '10px' }}>APM TRACK OBJECTIVES</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '7px' }}>
            {[
              'Challenge stakeholder-defined briefs with data, not just instinct',
              'Run research that avoids survivorship, confirmation, and framing bias',
              'Build and use a team insight repository via Notion',
              'Move from a list of findings to a single, precise problem statement',
            ].map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>✓</span>
                <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.55 }}>{obj}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
          {[
            { name: 'Notion', desc: 'Research Repo', accent: '#0097A7' },
            { name: 'Dovetail', desc: 'Insight Clusters', accent: '#7C3AED' },
            { name: 'Kraftful', desc: 'Trend Analysis', accent: '#00BCD4' },
          ].map(t => (
            <div key={t.name} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '7px 13px', borderRadius: '7px', background: 'var(--ed-card)', border: `1px solid var(--ed-rule)`, borderLeft: `3px solid ${t.accent}` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: t.accent, letterSpacing: '0.06em' }}>{t.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Character row — all key stakeholders */}
      <div style={{ borderTop: '1px solid var(--ed-rule)', paddingTop: '20px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--ed-ink3)', marginBottom: '12px' }}>CHARACTERS IN THIS MODULE</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const }}>
          {[
            { emoji: '🧑‍💼', name: 'Priya Sharma', role: 'APM · 2 yrs · EdSpark', desc: 'Leading discovery. Her challenge: the team keeps solving yesterday\'s problem.', accent: 'var(--teal)' },
            { emoji: '👔', name: 'Rohan', role: 'CEO · EdSpark', desc: 'Sets the strategic brief. Brings strong opinions, sometimes based on stale data.', accent: '#E67E22' },
            { emoji: '🎨', name: 'Maya', role: 'Designer · EdSpark', desc: 'Helps run interview studies. Learns to catch survivorship bias before it corrupts the data.', accent: 'var(--purple)' },
            { emoji: '🧑‍🏫', name: 'Asha', role: 'AI Mentor', desc: 'Challenges your assumptions. Appears throughout the module to sharpen your thinking.', accent: '#4F46E5' },
          ].map(c => (
            <div key={c.name} style={{ flex: '1', minWidth: '180px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderLeft: `3px solid ${c.accent}`, padding: '12px 14px' }}>
              <div style={{ display: 'flex', gap: '9px', alignItems: 'center', marginBottom: '7px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${c.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{c.emoji}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--ed-ink)', lineHeight: 1.2 }}>{c.name}</div>
                  <div style={{ fontSize: '9px', color: c.accent, fontFamily: 'monospace', marginTop: '1px', fontWeight: 600 }}>{c.role}</div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────
export default function Track2ProblemDiscovery() {
  return (
    <article>
      <IntroHero />

      {/* PART 1 — THE BRIEF THAT'S WRONG */}
      <ChapterSection id="m2-discovery-mindset" num="01" accentRgb="0,151,167">
        {h2(<>Part I · When the Brief Is Wrong</>)}
        <SituationCard>
          Monday 9:30am. Priya walks into the weekly product sync. Rohan, the CEO, opens his laptop and points at a dashboard. <strong>&ldquo;Retention is still stuck at 60%. We shipped three onboarding improvements. Nothing moved. I think onboarding still isn&apos;t clear enough — let&apos;s do another round.&rdquo;</strong>
        </SituationCard>
        {para(<>
          Priya had been expecting this. She had also been running her own analysis for the past two weeks. The previous night she had pulled Kraftful and looked at support ticket trends over four months. What she found contradicted Rohan&apos;s theory.
        </>)}
        {para(<>
          Onboarding-related tickets were <em>down</em> 26%. But a different cluster — tickets about not being able to show that EdSpark was working — had almost tripled.
        </>)}

        <KraftfulHypothesisTester />

        {para(<>
          She had two options. Nod along and run another onboarding study. Or bring the data and risk the conversation. She chose the data.
        </>)}
        {para(<>
          <strong>&ldquo;Rohan, before we commit to onboarding again — I want to show you something I found in Kraftful last night. The ticket trend has shifted. The problem might have moved.&rdquo;</strong>
        </>)}
        {pullQuote("Challenging a brief isn't insubordination. It's the job. A PM who executes every brief unquestioned is an order-taker, not a strategist.")}

        <ConversationScene
          mentor="asha" name="Asha" role="Senior PM · EdSpark" accent="var(--purple)"
          lines={[
            { speaker: 'priya', text: "The Kraftful data contradicts Rohan\u2019s brief. The problem has shifted \u2014 it\u2019s not onboarding anymore. But Rohan defined the research question." },
            { speaker: 'other', text: "The data doesn\u2019t just contradict the brief \u2014 it tells you something more important: the problem has moved. If you run with the old brief, you ship the right solution to yesterday\u2019s problem." },
            { speaker: 'priya', text: "So I need to go back to Rohan before we start." },
            { speaker: 'other', text: "Before you commit to the study. Show him the trend. The Kraftful chart isn\u2019t just data \u2014 it\u2019s your mandate to pause." },
          ]}
        />
        <Avatar
          name="Asha"
          nameColor="var(--purple-light)"
          borderColor="var(--purple)"
          content={<>A CEO spots a problem, commissions research, ships a fix. Six months later the same metric hasn\u2019t moved \u2014 because the problem evolved and no one updated the hypothesis. Challenging a brief isn\u2019t insubordination. It\u2019s the job.</>}
          expandedContent={<>A brief is a hypothesis about where the problem is. When new data arrives, good leaders update it. When they don\u2019t, it\u2019s usually not stubbornness \u2014 it\u2019s that no one showed them the data clearly enough.</>}
          question="Your CEO defines the research question. Your Kraftful data suggests it's based on stale assumptions. What's the right move?"
          options={[
            { text: "Run the research the CEO asked for — they have more context than you", correct: false, feedback: "The CEO has authority, not omniscience. Their brief is based on information they had at the time. If you have newer data, your job is to surface it, not bury it." },
            { text: "Show the trend data and propose reframing before committing to the study", correct: true, feedback: "Exactly right. You're not rejecting the brief — you're making sure it's still based on current reality before you invest 2 weeks running it." },
            { text: "Do both — run the original research and the new angle in parallel", correct: false, feedback: "Hedging avoids the hard conversation and delivers two shallow studies. The right move is to resolve the framing conflict before you start." },
          ]}
          conceptId="user-research"
        />

        <ConversationScene
          mentor="rohan" name="Rohan" role="CEO · EdSpark" accent="var(--coral)"
          lines={[
            { speaker: 'priya', text: "Before we commit to a direction \u2014 I found something in Kraftful last night I want to show the room." },
            { speaker: 'other', text: "Show me." },
            { speaker: 'priya', text: "The onboarding complaint trend has dropped 40% in three months. The new spike is ROI visibility \u2014 managers can\u2019t show their leadership that EdSpark is working." },
            { speaker: 'other', text: "I\u2019d been treating the brief like a fact, not a hypothesis. The data you\u2019re showing me is three months newer than what I was working from. When the evidence shifts, the question has to shift too." },
          ]}
        />
        <Avatar
          name="Rohan"
          nameColor="var(--coral)"
          borderColor="#E67E22"
          content={<>A brief is a hypothesis about where the problem is \u2014 not a permanent directive. When new data arrives, good leaders update it. Priya wasn\u2019t challenging Rohan \u2014 she was updating the shared model. That\u2019s the PM\u2019s job.</>}
          expandedContent={<>The moment Priya showed Rohan the Kraftful trend, she positioned herself as bringing value, not picking a fight. Evidence should do the work \u2014 not the framing of the disagreement.</>}
          question="Rohan's brief is based on data from Q3. You have Q4 data that contradicts it. What's your opening line in the Monday meeting?"
          options={[
            { text: '"I think we should look at onboarding again — maybe we missed something."', correct: false, feedback: "This reinforces the old brief without surfacing the new data. You've buried the insight before the conversation even starts." },
            { text: '"Before we commit to a direction — I found something in Kraftful last night I want to show the room."', correct: true, feedback: "You're not rejecting Rohan's view — you're creating space to introduce evidence. Leading with 'I found something' positions you as bringing value, not picking a fight." },
            { text: '"The CEO brief is wrong and here\'s why."', correct: false, feedback: "Even if true, this framing makes Rohan defensive before you've shown him anything. Evidence should do the work, not your framing of it." },
          ]}
          conceptId="user-research"
        />

        <InfoBox title="The APM's research contract" accent="var(--teal)">
          {keyBox('Three questions before you run any study', [
            '1. Does existing research in the repo already answer this?',
            '2. Is the research question based on current data — or stale assumptions?',
            '3. Who defined the problem, and what might they be missing?',
          ])}
        </InfoBox>

        <ChallengeBrief />

        <QuizEngine
          conceptId={QUIZZES[0].conceptId}
          conceptName={QUIZZES[0].conceptName}
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{ conceptId: QUIZZES[0].conceptId, question: QUIZZES[0].question, options: QUIZZES[0].options, correctIndex: QUIZZES[0].correctIndex, explanation: QUIZZES[0].explanation, keyInsight: QUIZZES[0].keyInsight }}
        />
      </ChapterSection>

      {/* PART 2 — RESEARCH OPS */}
      <ChapterSection id="m2-customer-segments" num="02" accentRgb="0,151,167">
        {h2(<>Part II · Research Ops: Building Team Memory</>)}
        <SituationCard>
          After the Monday meeting, Rohan agreed to pause and re-scope. &ldquo;Okay, Priya — what do we actually know about why managers leave? And please don&apos;t tell me we need to start from scratch.&rdquo;
        </SituationCard>
        {para(<>
          This was a test Priya was ready for. Three months ago, when she first joined as APM, she had set up a research repository in Notion. Every study, every insight, every tagged interview quote — all in one place. She opened it now.
        </>)}

        <NotionRepoSearch />

        {para(<>
          The repo showed 16 studies, 89 tagged insights, and — relevant right now — a 3-month-old manager churn study with 12 interviews. The top finding: <strong>managers churn when they can&apos;t demonstrate EdSpark&apos;s ROI to their own leadership.</strong>
        </>)}
        {para(<>
          &ldquo;We have this already,&rdquo; Priya said. &ldquo;The question is: has anything shipped in the last 3 months that would change this? If not, the insight still holds. We don&apos;t need to re-run the whole study. We need to validate the finding and scope the new one.&rdquo;
        </>)}

        <InfoBox title="The compounding value of a research repo" accent="var(--teal)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Without a repo', text: 'Every quarter starts fresh. Same users re-interviewed. Same insights re-discovered. Knowledge lives in Slack threads and forgotten decks.' },
              { label: 'With a repo', text: 'New studies build on existing ones. You start each sprint with what you already know, not from zero. Stakeholders can\'t claim "we don\'t know" when the answer is documented.' },
            ].map(row => (
              <div key={row.label} style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.1em', marginBottom: '5px' }}>{row.label.toUpperCase()}</div>
                <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.65 }}>{row.text}</div>
              </div>
            ))}
          </div>
        </InfoBox>

        <InfoBox title="Build your research repo this week">
          <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>
            Create a Notion page with three sections: <strong>Studies</strong> (date, scope, methodology, participants), <strong>Insights</strong> (finding, strength, source studies), <strong>Open Questions</strong> (what we still don&apos;t know). Every study you run gets logged here before you present it anywhere else.
          </div>
        </InfoBox>

        <ConversationScene
          mentor="rohan" name="Rohan" role="CEO · EdSpark" accent="#E67E22"
          lines={[
            { speaker: 'other', text: "Do we actually know anything about why managers churn, or are we starting from scratch?" },
            { speaker: 'priya', text: "We have a 3-month-old study. 12 interviews. Top finding: managers couldn\u2019t demonstrate EdSpark\u2019s ROI to their own leadership." },
            { speaker: 'other', text: "Is that finding still valid?" },
            { speaker: 'priya', text: "Nothing has shipped that would change the root cause. We validate the finding and scope the new question \u2014 we don\u2019t re-run the whole study." },
          ]}
        />

        <QuizEngine
          conceptId={QUIZZES[1].conceptId}
          conceptName={QUIZZES[1].conceptName}
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{ conceptId: QUIZZES[1].conceptId, question: QUIZZES[1].question, options: QUIZZES[1].options, correctIndex: QUIZZES[1].correctIndex, explanation: QUIZZES[1].explanation, keyInsight: QUIZZES[1].keyInsight }}
        />

      </ChapterSection>

      {/* PART 3 — RESEARCH BIASES */}
      <ChapterSection id="m2-research-methods" num="03" accentRgb="0,151,167">
        {h2(<>Part III · The Biases That Corrupt Discovery</>)}
        <SituationCard>
          Priya asked Maya, EdSpark&apos;s designer, to help prep the interview study. Maya drafted a plan: 10 interviews with active managers who were still using the platform. &ldquo;These are our best users — they&apos;ll know the product well.&rdquo; Priya read it and called Maya immediately.
        </SituationCard>
        {para(<>
          &ldquo;Maya — the users you want to talk to are the ones who <em>didn&apos;t</em> churn. We&apos;re asking why people leave. We need to talk to people who left.&rdquo;
        </>)}
        {para(<>
          This is survivorship bias — one of the most common research mistakes experienced PMs still make. But it&apos;s just one of three biases Priya had learned to spot the hard way.
        </>)}

        <BiasSpotter />

        <ConversationScene
          mentor="maya" name="Maya" role="Designer · EdSpark" accent="var(--coral)"
          lines={[
            { speaker: 'priya', text: "Maya \u2014 the users you want to talk to are the ones who didn\u2019t churn. We\u2019re asking why people leave. We need to talk to people who left." },
            { speaker: 'other', text: "I recruited active users because they were easier to reach. I didn\u2019t realise I\u2019d designed out the people who could actually answer the question." },
            { speaker: 'priya', text: "The fix is in the CRM \u2014 filter for accounts that went inactive in the last 3 weeks and reach out directly." },
            { speaker: 'other', text: "The answer was always in the data I wasn\u2019t looking at." },
          ]}
        />
        <Avatar
          name="Maya"
          nameColor="var(--coral)"
          borderColor="var(--purple)"
          content={<>Survivorship bias in research recruitment is a process failure, not a judgement failure. Maya didn\u2019t ask the wrong question \u2014 she built a sample that made the right answer impossible to find. Before you recruit, write down exactly who needs to be in your sample for the research question to be answerable.</>}
          expandedContent={<>Then build your recruitment list from that \u2014 not from who\u2019s easy to reach. The most important users for a churn study are the ones who can no longer reply to your emails.</>}
          question="You need to understand why managers churn. Which recruitment approach gives you the most useful signal?"
          options={[
            { text: "Email your 20 most engaged active managers — they know the product deeply", correct: false, feedback: "Engaged users can tell you why they stayed. They cannot tell you why others left. You're optimising for accessibility, not relevance." },
            { text: "Pull churned managers from the CRM (inactive 10–30 days) and reach out directly", correct: true, feedback: "Correct. The signal lives with people who just made the decision you're trying to understand. Recency matters — churn reasons fade fast." },
            { text: "Post a survey to all users and segment by churn status in analysis", correct: false, feedback: "Churned users have low survey response rates by definition — they've disengaged. You'll get a biased response set and the same survivorship problem." },
          ]}
          conceptId="research-methods"
        />

        {pullQuote("The users who matter most for a churn study are the ones who can no longer reply to your emails.")}

        <ConversationScene
          mentor="asha" name="Asha" role="Senior PM · EdSpark" accent="var(--purple)"
          lines={[
            { speaker: 'priya', text: "Maya\u2019s study design has survivorship bias baked in from the first line. How do I explain that without making it sound like a criticism?" },
            { speaker: 'other', text: "She didn\u2019t do it on purpose \u2014 it\u2019s an easy mistake. But notice what it reveals: she framed the question around active users, which made churned users invisible by default. That\u2019s design bias, not data bias." },
            { speaker: 'priya', text: "So the fix is structural \u2014 recruit from the right pool first." },
            { speaker: 'other', text: "Before you recruit anyone, ask: who has to be in my sample for this question to be answerable? If your sample contains zero churned managers, the study is broken before it starts. No analysis fixes a broken sample." },
          ]}
        />
        <Avatar
          name="Asha"
          nameColor="var(--purple-light)"
          borderColor="var(--purple)"
          content={<>Survivorship bias is a process failure, not a judgement failure. The fix: before you recruit, write down exactly who needs to be in your sample for the research question to be answerable. Then build your recruitment list from that \u2014 not from who\u2019s easy to reach.</>}
          expandedContent={<>If your question is \u201cwhy do managers churn?\u201d and your sample contains zero churned managers, the study is broken before it starts. You could run 50 perfect interviews and still get the wrong answer.</>}
          question="Maya wants to study 'why managers leave EdSpark.' She recruits 10 active users. What's the core flaw?"
          options={[
            { text: "Too small a sample — she needs at least 30 to be statistically valid", correct: false, feedback: "Sample size is a secondary problem here. You could have 1,000 active users in your sample and still get the wrong answer because you excluded the people who could actually answer the question." },
            { text: "She excluded the only people who can answer the question — churned users", correct: true, feedback: "Exactly. Survivorship bias: the sample only includes users who didn't exhibit the behaviour you're trying to understand. The answer to 'why do managers leave' lives with managers who have already left." },
            { text: "She should use a survey instead of interviews for a question this broad", correct: false, feedback: "Method choice matters, but it's secondary to sample design. A survey of active users has the same survivorship bias problem as interviews of active users." },
          ]}
          conceptId="research-methods"
        />

        <InfoBox title="How Dovetail helps mitigate confirmation bias" accent="var(--purple)">
          <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>
            When Priya tags interview transcripts in Dovetail, she doesn&apos;t tag by theme — she tags by verbatim moment. &ldquo;User paused for 5 seconds after clicking Add Recording&rdquo; is a tag. &ldquo;User expressed confusion&rdquo; is not. The specificity forces her to separate what happened from what she thinks it means. Interpretation comes in synthesis — not during tagging.
          </div>
        </InfoBox>

        <QuizEngine
          conceptId={QUIZZES[2].conceptId}
          conceptName={QUIZZES[2].conceptName}
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{ conceptId: QUIZZES[2].conceptId, question: QUIZZES[2].question, options: QUIZZES[2].options, correctIndex: QUIZZES[2].correctIndex, explanation: QUIZZES[2].explanation, keyInsight: QUIZZES[2].keyInsight }}
        />
      </ChapterSection>

      {/* PART 4 — THE INTERVIEWS */}
      <ChapterSection id="m2-interview" num="04" accentRgb="0,151,167">
        {h2(<>Part IV · Running 14 Interviews in 8 Days</>)}
        <SituationCard>
          Priya and Maya split the interviews: Priya took the churned managers (recruited via email from the CRM), Maya took the active ones. They used the same Notion template — but Priya added one rule: <strong>don&apos;t mention onboarding until the participant does.</strong>
        </SituationCard>
        {para(<>
          The rule was deliberate. If Priya asked about onboarding in the first question, every answer would be about onboarding. She wanted to know what was actually bothering people — not what she primed them to say.
        </>)}
        {para(<>
          The opening question for every interview: <em>&ldquo;Walk me through the last few weeks you were using EdSpark — what was happening?&rdquo;</em>
        </>)}
        {para(<>
          In interview after interview, managers said a version of the same thing without being asked: <strong>&ldquo;I didn&apos;t know if it was working.&rdquo;</strong>
        </>)}

        <InfoBox title="Priya's interview do/don't rule card" accent="var(--blue)">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--coral)', letterSpacing: '0.12em', marginBottom: '8px' }}>DON&apos;T</div>
              {[
                'Ask about features before asking about problems',
                'Suggest words (confusing, frustrating, unclear)',
                'Ask compound questions (2 questions in one)',
                'Jump in when they pause — silence is data',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '7px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--coral)', flexShrink: 0 }}>✗</span>
                  <span style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--green)', letterSpacing: '0.12em', marginBottom: '8px' }}>DO</div>
              {[
                'Open with "walk me through..."',
                'Follow unexpected threads, even off-script',
                'Ask "what did you do when that happened?"',
                'End with "is there anything I didn\'t ask?"',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '7px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--green)', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </InfoBox>

        <ConversationScene
          mentor="maya" name="Maya" role="Designer · EdSpark" accent="#C85A40"
          lines={[
            { speaker: 'other', text: "I asked my first three participants about onboarding straight away. They all gave me onboarding feedback. I think I found the issue." },
            { speaker: 'priya', text: "You primed them. Lead with onboarding and every answer is about onboarding \u2014 even if something else is bothering them more." },
            { speaker: 'other', text: "So what\u2019s the right opener?" },
            { speaker: 'priya', text: "\u2018Walk me through the last few weeks you were using EdSpark.\u2019 Then follow the thread. Let them surface the real problem before you ask about anything specific." },
          ]}
        />

        <QuizEngine
          conceptId={QUIZZES[3].conceptId}
          conceptName={QUIZZES[3].conceptName}
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{ conceptId: QUIZZES[3].conceptId, question: QUIZZES[3].question, options: QUIZZES[3].options, correctIndex: QUIZZES[3].correctIndex, explanation: QUIZZES[3].explanation, keyInsight: QUIZZES[3].keyInsight }}
        />
      </ChapterSection>

      {/* PART 5 — SYNTHESIS */}
      <ChapterSection id="m2-synthesis" num="05" accentRgb="0,151,167">
        {h2(<>Part V · Synthesising 14 Interviews into One Insight</>)}
        <SituationCard>
          Friday afternoon. Priya and Maya had 14 interview transcripts tagged in Dovetail. 94 individual moments. They booked a 2-hour synthesis session and opened the clusters.
        </SituationCard>
        {para(<>
          The two dominant themes were obvious — but they weren&apos;t two separate problems. As Priya looked at the quotes side by side, she saw the pattern:
        </>)}
        {para(<>
          &ldquo;I didn&apos;t know if EdSpark was working&rdquo; (no feedback loop) and &ldquo;I couldn&apos;t show my director the results&rdquo; (ROI visibility) — these were two surface expressions of the <strong>same underlying job</strong>: managers needed evidence that their investment in EdSpark was producing results.
        </>)}

        <DovetailSynthesisBoard />

        {pullQuote("Synthesis is about reducing. You start with 94 tagged moments and end with one sentence that explains all of them.")}

        <ConversationScene
          mentor="asha" name="Asha" role="Senior PM · EdSpark" accent="var(--purple)"
          lines={[
            { speaker: 'priya', text: "I have two clusters: \u2018no feedback loop\u2019 and \u2018can\u2019t show ROI.\u2019 Do I write two separate briefs?" },
            { speaker: 'other', text: "Most PMs would. But they\u2019re the same root. Once you see that, everything simplifies \u2014 one brief, one team direction, one sharp question for Rohan." },
            { speaker: 'priya', text: "Managers can\u2019t see evidence EdSpark is working \u2014 for themselves or their leadership." },
            { speaker: 'other', text: "That\u2019s your brief. One sentence that covers both clusters. That\u2019s synthesis." },
          ]}
        />
        <Avatar
          name="Asha"
          nameColor="var(--purple-light)"
          borderColor="var(--purple)"
          content={<>Summarising is listing what you heard. Synthesising is finding the single frame that explains why you heard all of it. The Dovetail clusters give you the what. The \u2018why\u2019 is the insight only a human can provide.</>}
          expandedContent={<>Two clusters that look separate often share a root cause. When you find it, you reduce the workstream, sharpen the brief, and give the team one target to design against instead of two.</>}
          question="You have two Dovetail clusters: 'no feedback loop post-upload' (9/14) and 'can't show ROI to leadership' (11/14). How do you write the brief?"
          options={[
            { text: "Two separate briefs — don't collapse findings", correct: false, feedback: "They look separate but they share a root cause: the product never shows managers that it's working. Writing two briefs doubles the workstream and splits team focus unnecessarily." },
            { text: "One brief: managers can't see evidence EdSpark is working — for themselves or their leadership", correct: true, feedback: "This is the synthesis move. Both clusters are expressions of the same underlying job. One sentence covers both — and gives the team a single target to design against." },
            { text: "Pick the higher-frequency cluster (ROI, 11/14) and lead with that", correct: false, feedback: "Frequency is a signal, not a decision rule. The 9/14 cluster might be the same root cause at a different level of abstraction. Always ask what they have in common before you pick one." },
          ]}
          conceptId="insight-synthesis"
        />

        <InfoBox title="The synthesis test" accent="var(--teal)">
          <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>
            If your findings can&apos;t be summarised in one sentence that explains <em>why</em> — not just <em>what</em> — you haven&apos;t synthesised. You&apos;ve listed. The sentence Priya landed on: <strong>&ldquo;Managers hire EdSpark to prove their coaching works — but the product never shows them that it does.&rdquo;</strong>
          </div>
        </InfoBox>

        <QuizEngine
          conceptId={QUIZZES[4].conceptId}
          conceptName={QUIZZES[4].conceptName}
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{ conceptId: QUIZZES[4].conceptId, question: QUIZZES[4].question, options: QUIZZES[4].options, correctIndex: QUIZZES[4].correctIndex, explanation: QUIZZES[4].explanation, keyInsight: QUIZZES[4].keyInsight }}
        />
      </ChapterSection>

      {/* PART 6 — PROBLEM FRAMING */}
      <ChapterSection id="m2-problem-statement" num="06" accentRgb="0,151,167">
        {h2(<>Part VI · Framing the Problem That Gets Teams Aligned</>)}
        <SituationCard>
          Monday morning again. Priya had one slide and one sentence. She opened the meeting. &ldquo;I said we&apos;d come back with a validated research question. Here&apos;s what we found.&rdquo;
        </SituationCard>
        {para(<>
          She put the sentence on screen: <strong>&ldquo;Sales managers join EdSpark to prove their coaching is improving their team — but the product never gives them evidence that it does.&rdquo;</strong>
        </>)}
        {para(<>
          Rohan leaned forward. &ldquo;That&apos;s... not what I expected.&rdquo; Then: &ldquo;But it makes total sense.&rdquo;
        </>)}
        {para(<>
          In ten minutes, the team had generated five potential solutions — a coaching impact score, an automated weekly report to the manager&apos;s director, a &ldquo;proof of ROI&rdquo; one-pager template, a progress timeline view, and a Slack integration. None of them were &ldquo;fix onboarding.&rdquo;
        </>)}

        <ProblemFramingShowdown />

        {pullQuote("A precise problem statement doesn't constrain solutions — it unlocks them. The team generated five ideas in ten minutes that three onboarding redesigns never would have.")}

        <InfoBox title="Write your discovery brief">
          <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>
            One sentence: <strong>[segment] are trying to [job to be done], but [the gap the product creates].</strong> No solution in the statement. If you catch yourself writing &ldquo;we should&rdquo; or &ldquo;we need to,&rdquo; you&apos;ve crossed into solution space. Back up.
          </div>
        </InfoBox>

        <ConversationScene
          mentor="rohan" name="Rohan" role="CEO · EdSpark" accent="#E67E22"
          lines={[
            { speaker: 'priya', text: "Here\u2019s what we found: managers join EdSpark to prove their coaching is improving their team \u2014 but the product never gives them evidence that it does." },
            { speaker: 'other', text: "That\u2019s not what I expected. But it makes complete sense." },
            { speaker: 'priya', text: "In ten minutes the team generated five solutions. None of them were \u2018fix onboarding.\u2019" },
            { speaker: 'other', text: "A precise problem statement doesn\u2019t constrain the team. It frees them. I\u2019m approving this as the research brief." },
          ]}
        />

        <QuizEngine
          conceptId={QUIZZES[5].conceptId}
          conceptName={QUIZZES[5].conceptName}
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{ conceptId: QUIZZES[5].conceptId, question: QUIZZES[5].question, options: QUIZZES[5].options, correctIndex: QUIZZES[5].correctIndex, explanation: QUIZZES[5].explanation, keyInsight: QUIZZES[5].keyInsight }}
        />
      </ChapterSection>

      {/* FINAL REFLECTION */}
      <ChapterSection id="m2-reflection" num="07" accentRgb="0,151,167">
        {h2(<>Final Reflection · The Discovery Playbook for APMs</>)}
        {para(<>
          Priya had done discovery before. But this sprint was different — she had run it as an APM, not as an individual contributor. She&apos;d challenged a CEO brief, used a shared repo to avoid redundant research, caught a bias in her team&apos;s study design, and compressed 14 interviews into one sentence that changed the product direction.
        </>)}

        {keyBox('The APM discovery loop', [
          '1. Challenge the brief — bring data before committing to a research question',
          '2. Check the repo — don\'t start research your team has already done',
          '3. Design for bias — survivorship, confirmation, framing',
          '4. Recruit for the question — churned users for churn, active for engagement',
          '5. Synthesise to one sentence — if it takes a paragraph, you\'re still listing',
          '6. Present the problem, not the solution — let the team generate solutions from a clear brief',
        ])}

        <ConversationScene
          mentor="asha" name="Asha" role="Senior PM" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "I challenged Rohan\u2019s brief, caught a bias in Maya\u2019s study design, and compressed 14 interviews into one sentence that changed the direction." },
            { speaker: 'other', text: "That\u2019s APM-level discovery. Not running more research \u2014 running smarter research and compressing it into something the team can act on." },
            { speaker: 'priya', text: "The sentence unlocked five ideas in ten minutes." },
            { speaker: 'other', text: "The best discovery brief doesn\u2019t answer the question. It makes the question so clear that the answers become obvious." },
          ]}
        />

        <NextChapterTeaser text="Next module: Priya has 5 strong ideas and must decide which to build. The CEO wants the fastest win. Engineering wants to clear debt. Design wants a different fix entirely. Module 03 covers prioritisation in a room full of competing priorities." />
      </ChapterSection>
    </article>
  );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizEngine from '../QuizEngine';
import {
  h2, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser, ApplyItBox, para,
  TiltCard, CharacterChip,
} from './designSystem';
import { MentorFace } from './MentorFaces';

const ACCENT     = '#7C3AED';
const ACCENT_RGB = '124,58,237';
const MODULE_CONTEXT = `Priya Sharma is an APM at EdSpark, a B2B SaaS platform for sales coaching. EdSpark has 40% week-1 churn and a Series A board meeting in 6 weeks. This module follows Priya as she builds EdSpark's product strategy from scratch — five decisions that will define the company's direction.`;

// ─────────────────────────────────────────
// QUIZZES — tied to the storyline
// ─────────────────────────────────────────
const QUIZZES = [
  {
    conceptId: 'product-strategy',
    question: "Rohan opens the strategy session with: \"We need 5 features before the board meeting.\" What should Priya do first?",
    options: [
      'A. Scope the features so engineering can estimate timelines immediately',
      'B. Ask why each feature is on the list before any engineering time is committed',
      'C. Build a RICE matrix to rank all 47 backlog items by impact and effort',
      'D. Get engineering buy-in on which features are actually feasible this quarter',
    ],
    correctIndex: 1,
    explanation: "Features without strategy are guesses. Priya needs to understand why each item is on the list — does it address the 40% churn? Does it connect to why EdSpark wins? Scoping before asking 'why' means executing the wrong plan efficiently.",
    keyInsight: "The PM's first move is always diagnosis, never execution.",
  },
  {
    conceptId: 'competitive-moats',
    question: "Kiran reveals that 70% of churned customers cited missing CRM integration. EdSpark's deep CRM sync is best described as:",
    options: [
      'A. A network effect — more EdSpark users improve the quality of shared CRM data',
      'B. A switching cost moat — migrating CRM-configured coaching workflows is painful',
      'C. A cost advantage — deep integrations reduce EdSpark\'s support ticket volume',
      'D. A data moat — CRM data trains the AI to produce more accurate coaching scores',
    ],
    correctIndex: 1,
    explanation: "CRM-configured coaching workflows create real switching costs. Once a sales org has built their coaching cadences around EdSpark's live deal data, migrating to Gong means rebuilding everything. That's a retention moat, not a cost or data moat.",
  },
  {
    conceptId: 'systems-thinking',
    question: "Priya simplifies onboarding and activation jumps from 48% to 71%. Two weeks later, AI coaching scores break because users skip the CRM sync step she removed. This is:",
    options: [
      'A. A product regression — engineering shipped a bug in the coaching data pipeline',
      'B. A second-order effect — fixing activation inadvertently broke coaching data quality',
      'C. A stakeholder misalignment between product and RevOps team requirements',
      'D. A measurement problem — the coaching score metric was never properly defined',
    ],
    correctIndex: 1,
    explanation: "Second-order effects are downstream consequences of first-order fixes. Priya improved activation (intended) but broke the CRM sync → coaching data pipeline (unintended). No amount of QA would have caught this — it's a systems design problem.",
  },
  {
    conceptId: 'bet-sizing',
    question: "EdSpark has 12 engineer-weeks. The board wants churn fixed AND a growth story. What sequence should Priya recommend?",
    options: [
      'A. All three bets in parallel — this shows the board maximum ambition and speed',
      'B. Onboarding fix first, then analytics scoped to reveal insights, then Salesforce discovery',
      'C. Salesforce integration first — highest revenue potential justifies taking the risk',
      'D. Only Bet A this quarter — ship nothing else until the retention problem is fully solved',
    ],
    correctIndex: 1,
    explanation: "Sequencing is strategy. Onboarding fix unblocks the retention metric. Analytics tightly scoped reveals manager-involvement patterns that inform the Salesforce scope. A discovery sprint de-risks Bet C before full investment. Each bet unlocks the next.",
  },
  {
    conceptId: 'b2b-strategy',
    question: "EdSpark just signed Apex Corp for 50 seats with a 500-seat expansion goal in 18 months. The most critical 90-day product milestone is:",
    options: [
      'A. Shipping the enterprise admin dashboard and SSO before the first QBR meeting',
      'B. Getting 10+ reps to daily usage and documenting one concrete, measurable win',
      'C. Locking in the expansion contract terms while the goodwill from closing is still warm',
      'D. Running a user research sprint with all 50 Apex reps to surface feature gaps early',
    ],
    correctIndex: 1,
    explanation: "Land-and-expand wins at the team level before it wins at the org level. 10+ daily active users proves adoption. One concrete win (ramp time down 20%, conversion up) gives the champion the story they need to take to their VP. That proof drives expansion.",
  },
];

const PARTS = [
  { num: '01', id: 'm2s-strategy-vs-features', label: "Strategy vs Features — when building is easy, what to build matters more" },
  { num: '02', id: 'm2s-vision-moats',          label: "Vision & Competitive Moats — the three-year question your roadmap can't answer" },
  { num: '03', id: 'm2s-systems-thinking',      label: "Systems Thinking — every decision has a third-order effect nobody planned for" },
  { num: '04', id: 'm2s-bet-sizing',            label: "Bet Sizing — twelve engineer-weeks, three bets, one right answer" },
  { num: '05', id: 'm2s-b2b-strategy',          label: "B2B Strategy — land, expand, and never lose an enterprise account again" },
];

const CHARACTERS: { mentor: 'priya' | 'rohan' | 'kiran' | 'asha'; accent: string; desc: string }[] = [
  { mentor: 'priya', accent: '#4F46E5', desc: "Your protagonist. First real strategy call. The feature list is three pages long." },
  { mentor: 'rohan', accent: '#E67E22', desc: "Wants five features by quarter-end. The board meeting is in six weeks." },
  { mentor: 'kiran', accent: '#0097A7', desc: "Brings the one data point that changes Priya's entire analysis." },
  { mentor: 'asha',  accent: '#7843EE', desc: "AI mentor. Asks the question Priya hasn't thought to ask yet." },
];

// ─────────────────────────────────────────
// CHARACTER MOMENT — inline avatar for Rohan / Kiran dialogue
// Each character has one specific job: Rohan creates pressure, Kiran
// delivers ground truth, and their appearance is always purposeful.
// ─────────────────────────────────────────
const CharacterMoment = ({ mentor, name, role, accent, children }: {
  mentor: 'rohan' | 'kiran';
  name: string;
  role: string;
  accent: string;
  children: React.ReactNode;
}) => (
  <div style={{
    margin: '28px 0', padding: '18px 20px', borderRadius: '10px',
    background: `${accent}08`,
    border: `1px solid ${accent}22`,
    borderLeft: `3px solid ${accent}`,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
      <MentorFace mentor={mentor} size={38} />
      <div>
        <div style={{ fontWeight: 700, fontSize: '13px', color: accent }}>{name}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.06em' }}>{role}</div>
      </div>
    </div>
    <div style={{ fontSize: '14px', color: 'var(--ed-ink)', lineHeight: 1.8 }}>
      {children}
    </div>
  </div>
);

// ─────────────────────────────────────────
// CONVERSATION SCENE — full back-and-forth dialogue between Priya and a stakeholder
// Shows the real-time decision pressure that PMs navigate in 1:1 conversations.
// ─────────────────────────────────────────
type DialogueLine = { speaker: 'priya' | 'other'; text: string };
const ConversationScene = ({
  mentor, name, role, accent, lines,
}: {
  mentor: 'rohan' | 'kiran' | 'maya' | 'dev';
  name: string; role: string; accent: string;
  lines: DialogueLine[];
}) => (
  <div style={{ margin: '28px 0', padding: '20px', borderRadius: '12px', background: 'var(--ed-card)', border: `1px solid ${accent}22` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', paddingBottom: '14px', borderBottom: `1px solid ${accent}18` }}>
      <MentorFace mentor={mentor} size={36} />
      <div>
        <div style={{ fontWeight: 700, fontSize: '13px', color: accent }}>{name}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.06em' }}>{role}</div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#4F46E5', fontWeight: 600 }}>PRIYA</div>
        <MentorFace mentor="priya" size={38} />
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {lines.map((line, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: line.speaker === 'priya' ? 'row-reverse' : 'row', gap: '8px', alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0, marginTop: '2px' }}>
            <MentorFace mentor={line.speaker === 'priya' ? 'priya' : mentor} size={38} />
          </div>
          <div style={{ maxWidth: '78%' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: line.speaker === 'priya' ? '#4F46E5' : accent, fontWeight: 700, marginBottom: '4px', textAlign: line.speaker === 'priya' ? 'right' : 'left', letterSpacing: '0.07em' }}>
              {line.speaker === 'priya' ? 'PRIYA' : name.toUpperCase()}
            </div>
            <div style={{
              padding: '10px 14px',
              borderRadius: line.speaker === 'priya' ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
              background: line.speaker === 'priya' ? 'rgba(79,70,229,0.10)' : `${accent}0F`,
              border: `1px solid ${line.speaker === 'priya' ? 'rgba(79,70,229,0.18)' : `${accent}22`}`,
              fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.75,
            }}>
              &ldquo;{line.text}&rdquo;
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);


// ─────────────────────────────────────────
// SECTION 1: Strategy vs Features Sorter
// Items are drawn directly from Rohan's all-hands slide.
// The learner sorts them as Priya would — strategy vs tactic.
// The reveal shows why none of Rohan's features address the root cause.
// ─────────────────────────────────────────
const ITEMS = [
  { id: 'a', text: 'Target mid-market sales orgs with 20–100 rep teams only',    correct: 'strategy' },
  { id: 'b', text: 'Add CSV export for call recordings',                          correct: 'tactic'   },
  { id: 'c', text: 'Win on CRM depth before expanding to other integrations',     correct: 'strategy' },
  { id: 'd', text: 'Fix the Slack notification delay bug',                        correct: 'tactic'   },
  { id: 'e', text: 'Be the coaching platform that changes rep behavior measurably', correct: 'strategy' },
  { id: 'f', text: 'Add weekly email digest of manager coaching scores',          correct: 'tactic'   },
  { id: 'g', text: 'Land 3 marquee logos before Series A closes',                 correct: 'strategy' },
  { id: 'h', text: 'Reduce onboarding from 7 steps to 3',                        correct: 'tactic'   },
];

const Section1Mockup = () => {
  const [sorted, setSorted] = useState<Record<string, 'strategy' | 'tactic'>>({});
  const [checked, setChecked] = useState(false);

  const sort = (id: string, bucket: 'strategy' | 'tactic') => {
    if (checked) return;
    setSorted(prev => ({ ...prev, [id]: bucket }));
  };

  const unsorted = ITEMS.filter(i => !sorted[i.id]);
  const strategyItems = ITEMS.filter(i => sorted[i.id] === 'strategy');
  const tacticItems   = ITEMS.filter(i => sorted[i.id] === 'tactic');
  const correct = checked ? ITEMS.filter(i => sorted[i.id] === i.correct).length : 0;

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid rgba(${ACCENT_RGB},0.25)`, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        {/* Header */}
        <div style={{ background: ACCENT, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#fff', fontWeight: 600, letterSpacing: '0.08em' }}>
              EdSpark Strategy Review · Sort Rohan&apos;s list
            </div>
          </div>
          {!checked && unsorted.length === 0 && (
            <button onClick={() => setChecked(true)} style={{ padding: '4px 12px', borderRadius: '4px', background: '#fff', color: ACCENT, fontSize: '11px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              Check →
            </button>
          )}
          {checked && (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#fff', fontWeight: 700 }}>
              {correct}/{ITEMS.length} correct
            </div>
          )}
        </div>

        <div style={{ background: '#fff', padding: '16px' }}>
          {/* Unsorted pool */}
          {unsorted.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#97A0AF', letterSpacing: '0.1em', marginBottom: '8px' }}>
                FROM ROHAN&apos;S ALL-HANDS SLIDE — click Strategy or Tactic to sort each item
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {unsorted.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'stretch', gap: '0' }}>
                    <button onClick={() => sort(item.id, 'strategy')}
                      style={{ padding: '8px 14px', borderRadius: '6px 0 0 6px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.3)', borderRight: 'none', cursor: 'pointer', fontSize: '10px', color: ACCENT, fontWeight: 700, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>
                      Strategy
                    </button>
                    <div style={{ flex: 1, padding: '8px 12px', background: '#F8F6F2', border: '1px solid #E0D9D0', fontSize: '12px', color: '#1C1814', display: 'flex', alignItems: 'center' }}>{item.text}</div>
                    <button onClick={() => sort(item.id, 'tactic')}
                      style={{ padding: '8px 14px', borderRadius: '0 6px 6px 0', background: 'rgba(200,90,64,0.08)', border: '1px solid rgba(200,90,64,0.3)', borderLeft: 'none', cursor: 'pointer', fontSize: '10px', color: '#C85A40', fontWeight: 700, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>
                      Tactic
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buckets */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { key: 'strategy', label: 'STRATEGY', color: ACCENT, bg: 'rgba(124,58,237,0.06)', border: 'rgba(124,58,237,0.2)', items: strategyItems },
              { key: 'tactic',   label: 'FEATURE / TACTIC', color: '#C85A40', bg: 'rgba(200,90,64,0.06)', border: 'rgba(200,90,64,0.2)', items: tacticItems },
            ].map(bucket => (
              <div key={bucket.key} style={{ background: bucket.bg, borderRadius: '8px', border: `1px solid ${bucket.border}`, padding: '12px', minHeight: '80px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: bucket.color, letterSpacing: '0.12em', marginBottom: '8px' }}>{bucket.label}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {bucket.items.map(item => {
                    const isCorrect = item.correct === bucket.key;
                    return (
                      <div key={item.id} style={{ fontSize: '12px', color: '#1C1814', padding: '5px 8px', borderRadius: '5px', background: checked ? (isCorrect ? 'rgba(13,122,90,0.1)' : 'rgba(200,64,64,0.1)') : '#fff', border: `1px solid ${checked ? (isCorrect ? 'rgba(13,122,90,0.3)' : 'rgba(200,64,64,0.3)') : '#E0D9D0'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <span>{item.text}</span>
                        {checked && <span style={{ fontSize: '13px', flexShrink: 0 }}>{isCorrect ? '✓' : '✗'}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {checked && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: ACCENT, marginBottom: '6px' }}>THE INSIGHT</div>
              <div style={{ fontSize: '13px', color: '#1C1814', lineHeight: 1.65 }}>
                Rohan&apos;s list has four legitimate strategies — but none of them say <em>why EdSpark wins against Gong.io</em> specifically, or which customer segment to target first. Strategy without a clear theory of differentiation is just ambition.
              </div>
            </motion.div>
          )}
        </div>

        <div style={{ background: '#F8F6F2', borderTop: `1px solid rgba(${ACCENT_RGB},0.15)`, padding: '8px 16px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#5E6C84' }}>
            Sort every item · then check — count how many of Rohan&apos;s asks were actually strategic bets
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// SECTION 2: Competitive Moat Analyzer
// Priya rates EdSpark's moat strength. Then reveals Gong's.
// The gap in switching costs is the insight — it's EdSpark's only real edge.
// ─────────────────────────────────────────
type MoatKey = 'network' | 'switching' | 'cost' | 'data';
const MOATS: { key: MoatKey; label: string; desc: string; gong: number; insight: string }[] = [
  { key: 'network',   label: 'Network Effects',  desc: 'Value increases as more users join the platform',     gong: 3, insight: 'Gong builds call benchmarks across their customer base. EdSpark has fewer users — this gap is hard to close.' },
  { key: 'switching', label: 'Switching Costs',  desc: 'Pain of migrating workflows and integrations away',   gong: 4, insight: 'Both have high switching costs — but EdSpark\'s CRM depth creates even more workflow lock-in for SMB sales teams.' },
  { key: 'cost',      label: 'Cost Advantage',   desc: 'Structural ability to serve customers at lower cost', gong: 2, insight: 'EdSpark\'s focused scope keeps costs lower. But Gong\'s scale will eventually win on infrastructure.' },
  { key: 'data',      label: 'Data / AI Moat',   desc: 'Proprietary data that compounds product intelligence', gong: 4, insight: 'Gong has 4,000 customers feeding their AI. EdSpark\'s AI accuracy will lag until they reach meaningful scale.' },
];

const Section2Mockup = () => {
  const [edspark, setEdspark] = useState<Record<MoatKey, number>>({ network: 2, switching: 4, cost: 3, data: 2 });
  const [revealed, setRevealed] = useState(false);
  const [activeInsight, setActiveInsight] = useState<MoatKey | null>(null);

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid rgba(${ACCENT_RGB},0.25)`, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ background: '#1C1035', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#C4B5FD', fontWeight: 600, letterSpacing: '0.08em' }}>
              EdSpark · Competitive Moat Assessment
            </div>
          </div>
          <button onClick={() => setRevealed(r => !r)} style={{ padding: '4px 12px', borderRadius: '4px', background: 'rgba(196,181,253,0.15)', border: '1px solid rgba(196,181,253,0.3)', color: '#C4B5FD', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
            {revealed ? 'Hide Gong.io' : 'Reveal Gong.io →'}
          </button>
        </div>

        <div style={{ background: '#fff', padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px', padding: '6px 12px', borderRadius: '6px', background: '#F8F6F2' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: ACCENT }}>● EDSPARK (drag to rate)</div>
            {revealed && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#6366F1' }}>● GONG.IO (actual)</div>}
          </div>

          {MOATS.map(moat => (
            <div key={moat.key} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C1814' }}>{moat.label}</span>
                  <span style={{ fontSize: '11px', color: '#8A8580', marginLeft: '8px' }}>{moat.desc}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {revealed && (
                    <button onClick={() => setActiveInsight(activeInsight === moat.key ? null : moat.key)}
                      style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.3)', color: '#6366F1', fontSize: '9px', fontWeight: 600, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" }}>
                      WHY?
                    </button>
                  )}
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 700, color: ACCENT }}>{edspark[moat.key]}/5</span>
                </div>
              </div>
              <div style={{ position: 'relative', height: '8px', background: '#F0EDE8', borderRadius: '4px', overflow: 'visible', marginBottom: '4px' }}>
                <motion.div animate={{ width: `${(edspark[moat.key] / 5) * 100}%` }} style={{ height: '100%', background: ACCENT, borderRadius: '4px', position: 'relative' }} />
                {revealed && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${(moat.gong / 5) * 100}%`, background: 'rgba(99,102,241,0.28)', borderRadius: '4px', border: '2px dashed #6366F1', boxSizing: 'border-box' }} />
                )}
              </div>
              <input type="range" min={1} max={5} value={edspark[moat.key]}
                onChange={e => setEdspark(prev => ({ ...prev, [moat.key]: Number(e.target.value) }))}
                style={{ width: '100%', accentColor: ACCENT }} />
              <AnimatePresence>
                {activeInsight === moat.key && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ marginTop: '8px', padding: '10px 12px', borderRadius: '6px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '12px', color: '#1C1814', lineHeight: 1.6 }}>
                    {moat.insight}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div style={{ background: '#F8F6F2', borderTop: `1px solid rgba(${ACCENT_RGB},0.15)`, padding: '8px 16px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#5E6C84' }}>
            Rate EdSpark&apos;s moat strength 1–5 · Reveal Gong to see the gap · click WHY to understand each difference
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// SECTION 3: Decision Cascade Simulator
// Priya faces Rohan's three asks for Q2.
// Each decision path shows the chain of effects.
// The insight: rushing two big bets in parallel with 6 engineers breaks both.
// ─────────────────────────────────────────
type DecisionKey = 'sequence' | 'parallel' | 'salesforce-first';
const DECISIONS: { key: DecisionKey; label: string; sublabel: string; first: string; second: string; third: string }[] = [
  {
    key: 'sequence',
    label: 'Fix onboarding first, then Salesforce',
    sublabel: 'Sequence the bets — one at a time',
    first: 'Onboarding ships in week 4. Week-1 churn drops from 40% to 22%.',
    second: 'Retention metric cleans up before the board meeting. Series A story is credible.',
    third: 'Salesforce integration starts with real usage data to scope it right — less rework, better outcome.',
  },
  {
    key: 'parallel',
    label: 'Run onboarding + Salesforce in parallel',
    sublabel: 'Two bets, same quarter, 6 engineers',
    first: 'Both projects slip 3 weeks. Rohan asks for status updates daily.',
    second: 'Neither ships before the board meeting. Churn is still 40%. The slide is empty.',
    third: 'Team is burnt out. Q3 starts with two half-finished bets and no momentum.',
  },
  {
    key: 'salesforce-first',
    label: 'Prioritize Salesforce — it closes enterprise deals',
    sublabel: 'Highest revenue potential, ship it first',
    first: 'Salesforce integration ships. Two enterprise prospects move forward in the pipeline.',
    second: 'Week-1 churn is still 40%. The root problem wasn\'t Salesforce access.',
    third: 'Board meeting: strong pipeline, broken retention. Series A is conditional on fixing churn before close.',
  },
];

const Section3Mockup = () => {
  const [selected, setSelected] = useState<DecisionKey | null>(null);
  const [step, setStep] = useState(0);
  const decision = DECISIONS.find(d => d.key === selected);

  const steps = decision ? [
    { label: '1st Order', text: decision.first,  color: '#0D7A5A', bg: 'rgba(13,122,90,0.08)' },
    { label: '2nd Order', text: decision.second, color: '#B5720A', bg: 'rgba(181,114,10,0.08)' },
    { label: '3rd Order', text: decision.third,  color: '#C85A40', bg: 'rgba(200,90,64,0.08)' },
  ] : [];

  const handleSelect = (key: DecisionKey) => {
    setSelected(key);
    setStep(0);
  };

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid rgba(${ACCENT_RGB},0.25)`, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ background: '#0F172A', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.08em' }}>
            EdSpark Q2 · Decision Cascade · 6 weeks to board meeting
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#97A0AF', letterSpacing: '0.1em', marginBottom: '12px' }}>
            ROHAN WANTS ALL THREE THIS QUARTER — PICK YOUR RECOMMENDATION
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {DECISIONS.map(d => (
              <button key={d.key} onClick={() => handleSelect(d.key)}
                style={{
                  padding: '12px 16px', borderRadius: '8px', textAlign: 'left',
                  background: selected === d.key ? `rgba(${ACCENT_RGB},0.08)` : '#F8F6F2',
                  border: `1.5px solid ${selected === d.key ? ACCENT : '#E0D9D0'}`,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: selected === d.key ? ACCENT : '#1C1814', marginBottom: '2px' }}>{d.label}</div>
                <div style={{ fontSize: '11px', color: '#8A8580' }}>{d.sublabel}</div>
              </button>
            ))}
          </div>

          {decision && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' as const }}>
                {steps.map((s, i) => (
                  <React.Fragment key={i}>
                    <button onClick={() => setStep(i)}
                      style={{ padding: '4px 10px', borderRadius: '20px', border: `1px solid ${i <= step ? s.color : '#E0D9D0'}`, background: i <= step ? s.bg : 'transparent', color: i <= step ? s.color : '#97A0AF', fontSize: '10px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', transition: 'all 0.2s' }}>
                      {s.label}
                    </button>
                    {i < steps.length - 1 && <span style={{ color: '#E0D9D0', fontSize: '14px' }}>→</span>}
                  </React.Fragment>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: '14px 16px', borderRadius: '8px', background: steps[step].bg, border: `1px solid ${steps[step].color}33` }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: steps[step].color, marginBottom: '6px' }}>{steps[step].label} EFFECT</div>
                  <div style={{ fontSize: '13px', color: '#1C1814', lineHeight: 1.65 }}>{steps[step].text}</div>
                  {step < steps.length - 1 && (
                    <button onClick={() => setStep(s => s + 1)} style={{ marginTop: '10px', padding: '4px 12px', borderRadius: '4px', background: steps[step].color, color: '#fff', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                      See next effect →
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>

        <div style={{ background: '#F8F6F2', borderTop: `1px solid rgba(${ACCENT_RGB},0.15)`, padding: '8px 16px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#5E6C84' }}>
            Pick a recommendation · step through 1st → 2nd → 3rd order effects to see where each path leads
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// SECTION 4: Bet Sizing — allocate 12 engineer-weeks
// The allocation forces a real trade-off decision.
// Going over budget or under-investing in Bet A both produce bad outcomes.
// ─────────────────────────────────────────
const BETS = [
  { id: 'onboarding', label: 'Fix onboarding flow',         impact: 'HIGH',  risk: 'LOW',  minWeeks: 2, color: '#0D7A5A', note: 'Directly attacks 40% churn. Clean metric story for the board.' },
  { id: 'analytics',  label: 'Manager analytics dashboard', impact: 'MED',   risk: 'MED',  minWeeks: 3, color: '#B5720A', note: "Reveals which managers are driving retention — or killing it." },
  { id: 'salesforce', label: 'Salesforce deep integration',  impact: 'HIGH',  risk: 'HIGH', minWeeks: 4, color: '#C85A40', note: 'High revenue potential but 8+ weeks for full build. Scope to discovery sprint first.' },
];
const TOTAL_WEEKS = 12;

const Section4Mockup = () => {
  const [allocated, setAllocated] = useState<Record<string, number>>({ onboarding: 5, analytics: 4, salesforce: 3 });
  const [expanded, setExpanded] = useState<string | null>(null);
  const total = Object.values(allocated).reduce((a, b) => a + b, 0);
  const remaining = TOTAL_WEEKS - total;

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid rgba(${ACCENT_RGB},0.25)`, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ background: '#172B4D', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#B8C4D4', fontWeight: 600, letterSpacing: '0.08em' }}>
              EdSpark · Q2 Bets · 12 engineer-weeks · Board meeting in 6 weeks
            </div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: remaining === 0 ? '#28C840' : remaining < 0 ? '#FF5F57' : '#FFBD2E', fontWeight: 700 }}>
            {remaining >= 0 ? `${remaining} wks left` : `${Math.abs(remaining)} wks over`}
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px' }}>
          {BETS.map(bet => (
            <div key={bet.id} style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #F0EDE8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C1814' }}>{bet.label}</div>
                    <button onClick={() => setExpanded(expanded === bet.id ? null : bet.id)}
                      style={{ padding: '1px 7px', borderRadius: '3px', background: `${bet.color}12`, border: `1px solid ${bet.color}30`, color: bet.color, fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', fontWeight: 700 }}>
                      WHY
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, background: bet.impact === 'HIGH' ? 'rgba(13,122,90,0.1)' : 'rgba(181,114,10,0.1)', color: bet.impact === 'HIGH' ? '#0D7A5A' : '#B5720A' }}>IMPACT {bet.impact}</span>
                    <span style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, background: bet.risk === 'HIGH' ? 'rgba(200,90,64,0.1)' : bet.risk === 'MED' ? 'rgba(181,114,10,0.1)' : 'rgba(13,122,90,0.1)', color: bet.risk === 'HIGH' ? '#C85A40' : bet.risk === 'MED' ? '#B5720A' : '#0D7A5A' }}>RISK {bet.risk}</span>
                  </div>
                  <AnimatePresence>
                    {expanded === bet.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#5E6C84', lineHeight: 1.6, borderLeft: `2px solid ${bet.color}`, paddingLeft: '10px' }}>{bet.note}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
                  <button onClick={() => setAllocated(a => ({ ...a, [bet.id]: Math.max(bet.minWeeks, a[bet.id] - 1) }))}
                    style={{ width: '26px', height: '26px', borderRadius: '50%', border: `1px solid ${bet.color}`, background: 'transparent', color: bet.color, cursor: 'pointer', fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '16px', fontWeight: 900, color: bet.color, minWidth: '32px', textAlign: 'center' }}>{allocated[bet.id]}</span>
                  <button onClick={() => setAllocated(a => ({ ...a, [bet.id]: a[bet.id] + 1 }))}
                    style={{ width: '26px', height: '26px', borderRadius: '50%', border: `1px solid ${bet.color}`, background: 'transparent', color: bet.color, cursor: 'pointer', fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#8A8580' }}>wks</span>
                </div>
              </div>
              <div style={{ height: '6px', background: '#F0EDE8', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${(allocated[bet.id] / TOTAL_WEEKS) * 100}%` }} style={{ height: '100%', background: bet.color, borderRadius: '3px' }} />
              </div>
            </div>
          ))}

          <div style={{ padding: '12px 14px', borderRadius: '8px', background: remaining < 0 ? 'rgba(200,90,64,0.08)' : remaining === 0 ? 'rgba(13,122,90,0.08)' : 'rgba(124,58,237,0.06)', border: `1px solid ${remaining < 0 ? 'rgba(200,90,64,0.3)' : remaining === 0 ? 'rgba(13,122,90,0.3)' : 'rgba(124,58,237,0.2)'}` }}>
            <div style={{ fontSize: '13px', color: '#1C1814', lineHeight: 1.65 }}>
              {remaining < 0
                ? `⚠️ Over budget by ${Math.abs(remaining)} weeks. Something has to give — which bet are you cutting?`
                : remaining === 0
                ? "✓ Fully allocated. Does onboarding get enough to actually fix churn before the board meeting?"
                : `${remaining} weeks unallocated — is that a buffer or a missing bet?`}
            </div>
          </div>
        </div>

        <div style={{ background: '#F8F6F2', borderTop: `1px solid rgba(${ACCENT_RGB},0.15)`, padding: '8px 16px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#5E6C84' }}>
            +/− to adjust weeks · min allocation per bet shown · stay within 12 total · click WHY to understand each bet
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// SECTION 5: Land-and-Expand Account Map
// EdSpark just signed Apex Corp. 50 seats now, 500 seats needed for Series A.
// Each click advances an opportunity stage — the product must generate the proof.
// ─────────────────────────────────────────
type OppStatus = 'locked' | 'target' | 'pilot' | 'won';
interface Opp { id: string; label: string; seats: number; status: OppStatus; dept: string; proof: string }

const Section5Mockup = () => {
  const [opps, setOpps] = useState<Opp[]>([
    { id: 'land',       label: 'West Coast Sales Team',   seats: 50,  status: 'won',    dept: 'Sales',      proof: 'Ramp time: 90d → 58d · 12 daily active users' },
    { id: 'east',       label: 'East Coast Sales Team',   seats: 60,  status: 'target', dept: 'Sales',      proof: 'West Coast win story shared by champion at regional kickoff' },
    { id: 'se',         label: 'Solutions Engineering',   seats: 25,  status: 'target', dept: 'Pre-Sales',  proof: 'Call recordings help SE prep enterprise demos' },
    { id: 'enablement', label: 'Sales Enablement',        seats: 15,  status: 'locked', dept: 'L&D',        proof: 'Needs admin dashboard + training content tool first' },
    { id: 'mgr',        label: 'Regional Sales Managers', seats: 18,  status: 'pilot',  dept: 'Management', proof: 'Team dashboards showing coaching ROI — VP loves the data' },
    { id: 'rev',        label: 'Revenue Operations',      seats: 12,  status: 'locked', dept: 'Ops',        proof: 'Needs Salesforce integration to make RevOps workflows viable' },
  ]);

  const advance = (id: string) => {
    setOpps(prev => prev.map(o => {
      if (o.id !== id) return o;
      const next: Record<OppStatus, OppStatus> = { locked: 'target', target: 'pilot', pilot: 'won', won: 'won' };
      return { ...o, status: next[o.status] };
    }));
  };

  const totalWon = opps.filter(o => o.status === 'won').reduce((a, o) => a + o.seats, 0);
  const target = 500;

  const statusConfig: Record<OppStatus, { label: string; color: string; bg: string; border: string }> = {
    locked:  { label: 'LOCKED',   color: '#8A8580', bg: '#F8F6F2',                  border: '#E0D9D0' },
    target:  { label: 'TARGET',   color: '#B5720A', bg: 'rgba(181,114,10,0.08)',    border: 'rgba(181,114,10,0.3)' },
    pilot:   { label: 'IN PILOT', color: ACCENT,    bg: `rgba(${ACCENT_RGB},0.08)`, border: `rgba(${ACCENT_RGB},0.3)` },
    won:     { label: 'WON',      color: '#0D7A5A', bg: 'rgba(13,122,90,0.08)',     border: 'rgba(13,122,90,0.3)' },
  };

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid rgba(${ACCENT_RGB},0.25)`, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ background: '#0F2744', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#7FBAFF', fontWeight: 600, letterSpacing: '0.08em' }}>
              Apex Corp · Land &amp; Expand Map · Series A target: 500 seats
            </div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 700, color: totalWon >= 500 ? '#28C840' : '#7FBAFF' }}>
            {totalWon}/{target} seats won
          </div>
        </div>

        <div style={{ background: '#fff', padding: '16px' }}>
          <div style={{ height: '6px', background: '#F0EDE8', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
            <motion.div animate={{ width: `${Math.min(100, (totalWon / target) * 100)}%` }} style={{ height: '100%', background: '#0D7A5A', borderRadius: '3px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {opps.map(opp => {
              const cfg = statusConfig[opp.status];
              return (
                <motion.div key={opp.id} whileHover={opp.status !== 'won' ? { y: -1 } : {}}
                  style={{ padding: '12px', borderRadius: '8px', background: cfg.bg, border: `1.5px solid ${cfg.border}`, cursor: opp.status !== 'won' ? 'pointer' : 'default' }}
                  onClick={() => opp.status !== 'won' && advance(opp.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C1814', lineHeight: 1.3, flex: 1 }}>{opp.label}</div>
                    <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, flexShrink: 0, marginLeft: '6px' }}>{cfg.label}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#8A8580' }}>{opp.dept}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: cfg.color }}>{opp.seats} seats</span>
                  </div>
                  <div style={{ fontSize: '10px', color: opp.status === 'locked' ? '#AAA' : cfg.color, lineHeight: 1.5, fontStyle: 'italic' }}>
                    {opp.status === 'locked' ? `🔒 ${opp.proof}` : opp.proof}
                  </div>
                  {opp.status !== 'won' && opp.status !== 'locked' && (
                    <div style={{ marginTop: '8px', fontSize: '10px', color: cfg.color, fontWeight: 600 }}>
                      Advance → {opp.status === 'target' ? 'In Pilot' : 'Won'}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div style={{ background: '#F8F6F2', borderTop: `1px solid rgba(${ACCENT_RGB},0.15)`, padding: '8px 16px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#5E6C84' }}>
            Click unlocked teams to advance · locked teams show what product work unblocks them · reach 500 seats
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────
export default function Track1ProductStrategy({
  onSectionChange,
  completedSections = new Set<string>(),
}: {
  onSectionChange?: (id: string) => void;
  completedSections?: Set<string>;
}) {
  void onSectionChange;
  const donePct = Math.round((completedSections.size / PARTS.length) * 100);
  const nextPart = PARTS.find(p => !completedSections.has(p.id));
  return (
    <>

      {/* ── HERO ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', marginBottom: '56px', flexWrap: 'wrap' as const }}
      >
        {/* Left column */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ed-ink3)', marginBottom: '28px', letterSpacing: '0.04em' }}>
            PM Fundamentals <span style={{ margin: '0 8px', color: 'var(--ed-rule)' }}>›</span>
            <span style={{ color: 'var(--ed-ink2)' }}>Foundations Track</span>
            <span style={{ margin: '0 10px', color: 'var(--ed-rule)' }}>·</span>
            <span style={{ color: 'var(--ed-ink3)' }}>50 min · 5 parts</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(26px, 3.2vw, 44px)', fontWeight: 700, lineHeight: 1.12,
            letterSpacing: '-0.025em', marginBottom: '18px', color: 'var(--ed-ink)',
            fontFamily: "'Lora', 'Georgia', 'Times New Roman', serif",
          }}>
            Product Strategy &amp;<br />
            <span style={{ color: ACCENT }}>Strategic Thinking</span>
          </h1>

          <p style={{ fontSize: '17px', color: 'var(--ed-ink2)', lineHeight: 1.8, maxWidth: '500px', marginBottom: '36px' }}>
            Rohan gives Priya six weeks and one instruction: &ldquo;Don&apos;t bring me a feature list. Bring me a strategy.&rdquo;
            Follow her as each section of this module becomes one piece of the answer.
          </p>

          {/* Parts grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '28px' }}>
            {PARTS.map(p => (
              <div key={p.num} style={{
                padding: '11px 14px', borderRadius: '7px',
                background: 'var(--ed-card)', border: '1px solid var(--ed-rule)',
                display: 'flex', gap: '10px', alignItems: 'baseline',
              }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: ACCENT, flexShrink: 0 }}>{p.num}.</span>
                <span style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.4 }}>{p.label}</span>
              </div>
            ))}
          </div>

          {/* How this works */}
          <div style={{
            padding: '18px 22px', borderRadius: '8px', background: 'var(--ed-card)',
            borderTop: '1px solid var(--ed-rule)', borderRight: '1px solid var(--ed-rule)',
            borderBottom: '1px solid var(--ed-rule)', borderLeft: `4px solid ${ACCENT}`,
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: ACCENT, textTransform: 'uppercase' as const, marginBottom: '10px' }}>How this works</div>
            <div style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.8 }}>
              <strong style={{ color: 'var(--ed-ink)' }}>Rohan</strong> creates the pressure. <strong style={{ color: 'var(--ed-ink)' }}>Kiran</strong> brings the data that reframes the picture.
              <strong style={{ color: 'var(--ed-ink)' }}> Asha</strong> asks the one question that stops Priya cold at each inflection point.
              Every interactive is a tool Priya actually uses — not a demo.
            </div>
          </div>

          {/* Characters */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--ed-ink3)', marginBottom: '10px' }}>CHARACTERS IN THIS MODULE</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const }}>
              {CHARACTERS.map(c => (
                <CharacterChip name={{ priya: 'Priya', rohan: 'Rohan', kiran: 'Kiran', asha: 'Asha' }[c.mentor] ?? ''} role={{ priya: 'APM · EdSpark', rohan: 'CEO · EdSpark', kiran: 'Data Analyst', asha: 'AI Mentor' }[c.mentor] ?? ''} accent={c.accent}>
                  <MentorFace mentor={c.mentor} size={52} />
                </CharacterChip>
              ))}
            </div>
          </div>
        </div>

        {/* Right: 3D floating module card */}
        <div style={{ flexShrink: 0, width: '168px', paddingTop: '48px' }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <div className="float3d" style={{ transformStyle: 'preserve-3d' }}>
              <div style={{
                background: 'linear-gradient(145deg, #1A1218 0%, #241228 100%)',
                borderRadius: '14px', padding: '20px 18px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE 02</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>Product Strategy</div>
                <div style={{ fontSize: '10px', color: 'rgba(240,232,216,0.45)', marginBottom: '16px' }}>Foundations Track</div>
                <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '14px' }}>
                  <motion.div animate={{ width: `${donePct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ height: '100%', background: ACCENT, borderRadius: '1px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {PARTS.map(p => {
                    const done = completedSections.has(p.id);
                    const isNext = p.id === nextPart?.id;
                    return (
                      <div key={p.num} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <div style={{
                          width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                          background: done ? '#0D7A5A' : isNext ? ACCENT : 'rgba(255,255,255,0.06)',
                          border: `1px solid ${done ? '#0D7A5A' : isNext ? ACCENT : 'rgba(255,255,255,0.1)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '7px', color: done || isNext ? '#fff' : 'rgba(255,255,255,0.3)',
                          fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                          transition: 'background 0.3s, border-color 0.3s',
                        }}>{done ? '✓' : p.num}</div>
                        <div style={{ fontSize: '9px', color: done ? 'rgba(240,232,216,0.5)' : isNext ? 'rgba(240,232,216,0.9)' : 'rgba(240,232,216,0.3)', lineHeight: 1.3, flex: 1, transition: 'color 0.3s' }}>
                          {p.label.split(' — ')[0]}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: '16px', padding: '8px 10px', borderRadius: '6px', background: `${ACCENT}22`, border: `1px solid ${ACCENT}44` }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: ACCENT, fontWeight: 700, marginBottom: '2px' }}>
                    {donePct === 100 ? 'COMPLETE' : 'NEXT UP'}
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(240,232,216,0.6)' }}>
                    {donePct === 100 ? 'All 5 parts done' : nextPart ? nextPart.label.split(' — ')[0] : 'Strategy vs Features'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── SECTION 1: Strategy vs Features ─────── */}
      <ChapterSection id="m2s-strategy-vs-features" num="01" accentRgb={ACCENT_RGB} first>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Monday morning. Rohan calls Priya into his office before the all-hands. The door closes.
          He pulls up a slide: one number, centered, red. <strong>40%</strong>. Week-1 churn. &ldquo;The board sees this in six weeks,&rdquo; he says. &ldquo;I don&apos;t want a feature list. I want a strategy. Something that tells the board exactly why we win — and exactly what we&apos;re betting on.&rdquo;
          Priya nods. She has never built a strategy from scratch.
        </SituationCard>

        <ConversationScene
          mentor="rohan" name="Rohan" role="CEO · EdSpark" accent="#E67E22"
          lines={[
            { speaker: 'other', text: "I've got 47 items in the backlog. Engineers asking what to build, sales asking for integrations, CS asking for better reporting. I need you to tell me what actually matters — and why." },
            { speaker: 'priya', text: "Which problem are we actually solving? Not which feature — which problem." },
            { speaker: 'other', text: "40% week-one churn. Pick whatever fixes it fastest. The board sees this in six weeks." },
            { speaker: 'priya', text: "We don\u2019t have a problem statement yet — we have a symptom. The backlog can\u2019t tell us why they\u2019re churning. Only the customers can." },
          ]}
        />

        {h2(<>Features Are Answers. Strategy Is Knowing Which Questions Matter.</>)}

        {para(<>
          Priya&apos;s instinct is to open the backlog and start sorting. That&apos;s the wrong move.
          A feature list is a collection of answers. Strategy is the process of figuring out which questions are worth asking at all.
          The Spanish restaurant El Bulli didn&apos;t win by adding more dishes than its competitors — it won by redefining what fine dining meant entirely. The question was different, so the answers were different.
          EdSpark&apos;s question isn&apos;t &ldquo;what features should we ship?&rdquo; It&apos;s &ldquo;what does a new sales manager need to stop churning in week one — and can we build a defensible position around solving that?&rdquo;
        </>)}

        {pullQuote("The board doesn\u2019t want a roadmap. They want a reason to believe.")}

        {para(<>
          Product strategy has three components: a <em>theory of the customer</em> (who you&apos;re serving and why they choose you), a <em>theory of differentiation</em> (what you do that competitors can&apos;t easily replicate), and a <em>theory of sequencing</em> (which bets to make in which order to get there).
          None of these are features. They&apos;re the frame that makes features legible.
          Priya&apos;s job for the next six weeks is to build all three.
        </>)}

        {keyBox("Strategy vs Tactics", [
          "Strategy: which customers, which problems, which bets — and why now, in this market",
          "Tactic: how you execute within a chosen bet (prioritization, sprint planning, RICE)",
          "Feature: a specific solution to a specific problem within a tactic",
          "The failure mode: treating a tactic as a strategy, or a feature as a bet",
        ])}

        <Section1Mockup />

        {para(<>
          Priya runs through Rohan&apos;s list. Four of the eight items are genuine strategic bets — focused, differentiated, hard to copy. Four are tactics: good work, probably necessary, but not the reason EdSpark wins.
          The problem is that Rohan&apos;s list has no theory of differentiation. It doesn&apos;t say <em>why EdSpark</em> — what makes a mid-market sales org choose EdSpark over Gong.io&apos;s free trial.
          Before she can answer that, she needs to understand what EdSpark actually has that Gong doesn&apos;t.
        </>)}

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>&ldquo;Are you sorting features — or solving the 40% churn problem? Because those are two completely different exercises.&rdquo;</>}
          expandedContent={<>Sorting items into &ldquo;strategy&rdquo; and &ldquo;tactic&rdquo; buckets is useful — but only if each strategic bet connects back to a specific theory of why you win. If you can&apos;t answer &ldquo;why does this bet help us beat Gong at the segment we&apos;re targeting&rdquo;, it&apos;s not a strategy — it&apos;s an aspiration. Priya&apos;s next job is to find EdSpark&apos;s actual edge.</>}
          question="Rohan wants five features shipped before the board meeting. What is Priya's correct first move?"
          options={[
            { text: "Start scoping features so engineering can begin estimating timelines today", correct: false, feedback: "Scoping before diagnosis means executing the wrong plan efficiently. The backlog doesn't tell you which problem to solve." },
            { text: "Ask why each feature is on the list before committing any engineering time", correct: true, feedback: "Right. The five features are answers. Priya needs to understand which questions they're answering — and whether those questions are the right ones." },
            { text: "Build a RICE matrix across all 47 backlog items to rank them by impact", correct: false, feedback: "RICE is a prioritization tactic — it helps you sequence items you've already decided to build. It doesn't tell you whether the items are strategic bets worth building at all." },
          ]}
          conceptId="product-strategy"
        />

        <QuizEngine
          conceptId="product-strategy"
          conceptName="Product Strategy"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={QUIZZES[0]}
        />

      </ChapterSection>

      {/* ── SECTION 2: Vision & Moats ─────────────── */}
      <ChapterSection id="m2s-vision-moats" num="02" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya spends two days on competitive research. The picture is not encouraging.
          Gong.io: $583M raised, 4,000 customers, 500 engineers. Chorus: acquired by ZoomInfo for $575M.
          Salesforce has Einstein Call Coaching baked into every Enterprise contract at no extra charge.
          She stares at the slide and thinks: <em>how is EdSpark supposed to win?</em>
          Then Kiran walks over.
        </SituationCard>

        <ConversationScene
          mentor="kiran" name="Kiran" role="Data Analyst · EdSpark" accent="#0097A7"
          lines={[
            { speaker: 'other', text: "I pulled the churn exit data. 70% of customers who churned in the first month cited the same thing: the product didn\u2019t connect to how they actually run deals. Not the AI. Not the call quality. The CRM connection." },
            { speaker: 'priya', text: "That\u2019s not a feature gap. That\u2019s a workflow dependency. If they can\u2019t see live pipeline data inside EdSpark, the coaching scores are meaningless." },
            { speaker: 'other', text: "Exactly. And nobody asked which CRM workflows actually matter. They built the generic sync." },
            { speaker: 'priya', text: "Then that\u2019s where EdSpark\u2019s moat starts. Not more features — deeper integration than Gong is willing to build for a 40-person team." },
          ]}
        />

        {h2(<>You Can&rsquo;t Out-Feature Gong. You Build a Moat They Can&rsquo;t Cross.</>)}

        {para(<>
          Kiran&apos;s data point reframes everything. The competitive threat isn&apos;t Gong&apos;s call analytics — it&apos;s that Gong targets large enterprises. They don&apos;t care about a 40-person sales team&apos;s CRM configuration. EdSpark does.
          EdSpark&apos;s six engineers can&apos;t build more features than Gong. But they can build <em>deeper</em> for the segment Gong ignores: mid-market B2B sales orgs who need their coaching platform to actually know their deals.
          That&apos;s not a feature gap. That&apos;s a strategic opening.
        </>)}

        {pullQuote("Specialize to survive. Let the giants fight their own wars.")}

        {para(<>
          A competitive moat is not what you have today — it&apos;s what makes switching to a competitor painful tomorrow.
          EdSpark&apos;s CRM integration does something subtle: once a sales org configures their coaching cadences around live deal data — call scores tied to quota attainment, manager alerts triggered by deal stage changes — ripping it out means rebuilding their entire coaching workflow from scratch.
          That&apos;s a switching cost. And switching costs compound: the longer EdSpark is embedded, the more the org&apos;s coaching patterns become <em>dependent</em> on the integration.
          Gong can copy the feature. They can&apos;t copy the fact that your customers have spent 18 months building their workflows around yours.
        </>)}

        {keyBox("The Four Moat Types — Where EdSpark Sits", [
          "Network effects: product improves as total users grow — Gong has this, EdSpark doesn't yet",
          "Switching costs: painful to migrate workflows and integrations — EdSpark's real edge",
          "Cost advantage: structural lower cost to serve — neither has this cleanly",
          "Data / AI moat: proprietary training data makes AI better over time — Gong leads, EdSpark must close",
        ])}

        <Section2Mockup />

        {para(<>
          Priya&apos;s moat analysis shows one clear answer: EdSpark&apos;s switching costs from CRM depth are stronger than Gong&apos;s in the mid-market segment — <em>if</em> EdSpark invests in deepening that integration, not broadening into analytics and reporting that Gong already does well.
          The strategic recommendation takes shape: don&apos;t compete on Gong&apos;s terrain. Win on being the only coaching platform that knows a rep&apos;s full deal context before the session starts. Make the CRM integration so deep that every other coaching tool feels like it&apos;s operating blind.
          That&apos;s the three-year vision. Now she needs to know what bets get EdSpark there — and in what order.
        </>)}

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>&ldquo;If your moat is switching costs from CRM depth — what happens the day Salesforce bundles a coaching layer into its base tier for free?&rdquo;</>}
          expandedContent={<>That&apos;s the right question to ask right now. A single-moat strategy is fragile. The best defensive position stacks moats: switching costs now, a data moat as usage grows (coaching patterns that get smarter per org over time), and eventually a network effect if you can build benchmarking across similar-sized orgs. Priya should ask: how do we build a second moat before the first one erodes?</>}
          question="Kiran's data reveals 70% of churned customers cited missing CRM integration. EdSpark's deep CRM sync is best described as:"
          options={[
            { text: "A network effect — more EdSpark users improve the quality of shared call benchmarks", correct: false, feedback: "Network effects require value to grow as the total user base grows. CRM integration benefits each org individually — it doesn't compound across orgs." },
            { text: "A switching cost moat — migrating CRM-configured coaching workflows is painful", correct: true, feedback: "Exactly. Coaching cadences configured around live deal data take months to build. Migrating to a competitor means starting that work over. That's real switching cost." },
            { text: "A cost advantage — deep integrations reduce EdSpark's engineering maintenance overhead", correct: false, feedback: "Cost advantage moats are about structural cost-to-serve relative to competitors. Integration depth is a retention mechanism, not a cost structure play." },
          ]}
          conceptId="competitive-moats"
        />

        <QuizEngine
          conceptId="competitive-moats"
          conceptName="Competitive Moats"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={QUIZZES[1]}
        />

      </ChapterSection>

      {/* ── SECTION 3: Systems Thinking ──────────── */}
      <ChapterSection id="m2s-systems-thinking" num="03" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Week two. Rohan calls a 1:1. He comes in energized, speaking fast. &ldquo;Three things this quarter,&rdquo; he says, counting on his fingers. &ldquo;Fix the onboarding — you&apos;re right, that&apos;s the bleed. Get the Salesforce integration to beta — two enterprise prospects are waiting. And I want the manager analytics dashboard so the board can see we&apos;re building toward the data moat.&rdquo;
          Priya&apos;s hand tightens around her pen. She starts to say yes to all three.
        </SituationCard>

        <ConversationScene
          mentor="rohan" name="Rohan" role="CEO · EdSpark" accent="#E67E22"
          lines={[
            { speaker: 'other', text: "Three things this quarter — fix onboarding, get Salesforce to beta, build the manager analytics dashboard. Run them in parallel. We can\u2019t afford to move slow." },
            { speaker: 'priya', text: "Running two large bets simultaneously with six engineers doesn\u2019t produce two half-finished products on schedule. It produces two fully-broken products three weeks late." },
            { speaker: 'other', text: "Walk me through the math then." },
            { speaker: 'priya', text: "Onboarding first — that stops the churn bleed. Then analytics tells us why churn is changing. Then Salesforce gets scoped from actual data instead of assumptions. Each bet unlocks the next one." },
          ]}
        />

        {h2(<>First-Order Thinking Asks What Happens Next. Strategy Asks What Happens After That.</>)}

        {para(<>
          Rohan&apos;s instinct is correct in isolation: onboarding matters, Salesforce matters, analytics matter. The mistake is treating them as independent parallel bets.
          With six engineers, running two large bets simultaneously doesn&apos;t produce two half-finished products on schedule. It produces two fully-broken products three weeks late.
          The reason is second-order effects. Every engineering decision creates dependencies — on shared infrastructure, on team cognitive load, on the QA pipeline, on each other&apos;s code. Running parallel bets isn&apos;t twice the output. It&apos;s half the focus applied to everything.
        </>)}

        {pullQuote("Doing two things at once with a small team doesn\u2019t split the work. It multiplies the risk.")}

        {para(<>
          Systems thinking is the practice of mapping the downstream effects of decisions before you commit to them.
          The question Priya needs to ask isn&apos;t &ldquo;can we build all three?&rdquo; It&apos;s &ldquo;if we build all three at once, what breaks — and where does that break show up in the product, the team, and the metrics Rohan will present to the board?&rdquo;
          That question has a concrete, uncomfortable answer. The simulator below makes it visible.
        </>)}

        <Section3Mockup />

        {para(<>
          The cascade is clear. Sequencing — onboarding first, then Salesforce as a scoped discovery sprint, then analytics built on real retention data — produces better outcomes than parallelism. Not because it&apos;s slower. Because each completed bet creates the conditions for the next bet to succeed.
          Onboarding fixed means churn drops. Churn dropped means the retention story exists for the board. Retention story exists means Salesforce integration can be scoped based on which enterprise workflows actually matter — instead of guessing.
          Priya needs to bring Rohan the sequencing argument, not just the &ldquo;we can&apos;t do all three&rdquo; argument.
        </>)}

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>&ldquo;What would happen if you sequenced these three bets — one fully done before the next starts? Walk Rohan through the third-order effects of that world versus the parallel world.&rdquo;</>}
          expandedContent={<>This is the PM&apos;s core persuasion tool with executives who want speed: show the third-order effects, not just the first-order constraints. Rohan already knows you can&apos;t do everything at once — he&apos;s heard that before. What he hasn&apos;t seen is the specific downstream consequence: that rushing all three means the board sees no movement on churn AND no completed integration AND a half-built analytics view. The sequenced world gets him a cleaner deck.</>}
          question="Priya simplifies onboarding and activation jumps from 48% to 71%. Two weeks later, AI coaching scores break because users skip the CRM sync step she removed. This is:"
          options={[
            { text: "A product regression — engineering shipped a bug in the coaching data pipeline", correct: false, feedback: "Regression means something that worked before now breaks due to a code change. This is a systems consequence — the architectural dependency between onboarding steps and data quality wasn't mapped." },
            { text: "A second-order effect — fixing activation broke the data quality coaching depends on", correct: true, feedback: "Exactly. Priya solved the first-order problem (activation) but created a downstream consequence (broken coaching data). Systems thinking would have caught this before shipping." },
            { text: "A stakeholder misalignment — RevOps didn't communicate their data requirements to product", correct: false, feedback: "Stakeholder misalignment is a communication problem. This is a design problem — Priya didn't map how the onboarding change would affect downstream features." },
          ]}
          conceptId="systems-thinking"
        />

        <QuizEngine
          conceptId="systems-thinking"
          conceptName="Systems Thinking"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={QUIZZES[2]}
        />

      </ChapterSection>

      {/* ── SECTION 4: Bet Sizing ─────────────────── */}
      <ChapterSection id="m2s-bet-sizing" num="04" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Week three. Priya stands at the whiteboard in Rohan&apos;s office with a marker and twelve boxes — one per engineer-week.
          Three bets. Twelve weeks. The math doesn&apos;t add up if she&apos;s not careful.
          Rohan watches from the chair. &ldquo;Show me how you&apos;d sequence it.&rdquo;
        </SituationCard>

        <ConversationScene
          mentor="kiran" name="Kiran" role="Data Analyst · EdSpark" accent="#0097A7"
          lines={[
            { speaker: 'other', text: "One thing on the analytics dashboard: if we scope it right — specifically around manager involvement rates and coaching frequency — it\u2019ll tell us why churn is dropping. Or why it\u2019s not." },
            { speaker: 'priya', text: "You\u2019re saying it\u2019s not just a board slide. It\u2019s the instrument that tells us how to scope the next bet." },
            { speaker: 'other', text: "Exactly. Build the right dashboard and you know which CRM workflows actually matter to managers — not which ones we assumed mattered." },
            { speaker: 'priya', text: "Then we scope it tight. Coaching frequency and manager involvement only. Nothing else on the dashboard until churn drops." },
          ]}
        />

        {h2(<>Bet Sizing Is Sequencing. The Right Order Unlocks the Next Bet.</>)}

        {para(<>
          Bet sizing is not just resource allocation — it&apos;s the art of sequencing bets so each completed bet creates the conditions for the next one to succeed with less risk.
          The onboarding fix (Bet A) isn&apos;t just about churn. It&apos;s the foundation. Without it, the analytics dashboard (Bet B) has no clean data to analyze — it&apos;s measuring a product that&apos;s still broken at entry. And without Bet B&apos;s insights, the Salesforce integration (Bet C) is scoped from assumptions instead of evidence.
          Each bet unlocks the next. That&apos;s the sequencing argument Priya needs to make to Rohan.
        </>)}

        {pullQuote("The best bet is not the one with the highest expected value. It\u2019s the one that makes every subsequent bet better.")}

        {para(<>
          The trap is Bet C. Salesforce integration has the highest revenue potential and two enterprise prospects waiting. The temptation is to front-load it.
          But enterprise prospects can wait six weeks. A board meeting cannot. And if Priya arrives at the board meeting with a Salesforce integration in beta but 40% churn unchanged, she has a growth story and a retention crisis — which is exactly the kind of mixed signal that delays a Series A.
          Fix the bleed first. Then build the story.
        </>)}

        {keyBox("Bet Sizing Principles", [
          "Fix structural leaks before growth investments — churn is a structural leak",
          "Sequence bets so each creates signal that de-risks the next",
          "Under-resourced bets fail more than delayed bets — give winning bets enough to actually win",
          "A discovery sprint is not a failure to commit — it's risk-adjusted investment",
        ])}

        <Section4Mockup />

        {para(<>
          Priya fills in the whiteboard: five weeks for onboarding (enough to ship a proper fix, not a patch), three weeks for analytics scoped to coaching frequency and manager involvement only, four weeks for a Salesforce discovery sprint — not a full build.
          Rohan stares at it. &ldquo;The board is going to ask why Salesforce isn&apos;t done.&rdquo;
          Priya&apos;s answer: &ldquo;Because we can&apos;t sell enterprise integrations to customers who are still churning in week one. Bet A is what makes Bet C worth the investment.&rdquo;
          That&apos;s strategic sequencing. It wins.
        </>)}

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>&ldquo;If you always prioritize fixing retention before growth, how do you ever take a strategic bet that creates new value instead of just protecting what exists?&rdquo;</>}
          expandedContent={<>The test is whether the retention problem is structural or tactical. Structural means the core value proposition is broken — no growth investment fixes that, it just adds users who will also churn. Tactical means execution is rough but the value prop works — in which case a growth bet makes sense in parallel. EdSpark&apos;s 40% churn is structural: new managers can&apos;t find their first value moment. That&apos;s a strategy problem, not a marketing problem.</>}
          question="EdSpark has 12 engineer-weeks. The board wants churn fixed AND a growth story. What sequence should Priya recommend?"
          options={[
            { text: "All three bets in parallel — shows the board maximum ambition and urgency", correct: false, feedback: "Parallel bets with 6 engineers means none of them ship before the board meeting. Maximum ambition, zero execution signal." },
            { text: "Onboarding fix first, analytics scoped tightly, then Salesforce discovery sprint", correct: true, feedback: "Right. Bet A unblocks the retention metric. Analytics scoped to coaching frequency reveals why churn is changing. Discovery sprint de-risks Bet C scope before full investment." },
            { text: "Salesforce integration first — highest revenue potential always justifies the timeline", correct: false, feedback: "High revenue potential on a product with 40% week-1 churn is a leaky bucket. The board will see enterprise pipeline AND broken retention. Series A gets conditional." },
          ]}
          conceptId="bet-sizing"
        />

        <QuizEngine
          conceptId="bet-sizing"
          conceptName="Bet Sizing"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={QUIZZES[3]}
        />

      </ChapterSection>

      {/* ── SECTION 5: B2B Strategy ───────────────── */}
      <ChapterSection id="m2s-b2b-strategy" num="05" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Week five. Priya gets a Slack message from Marcus, the enterprise sales rep: &ldquo;WE CLOSED APEX CORP. 50 seats. 6-month pilot. Call me when you get a minute 🎉&rdquo;
          Priya opens a spreadsheet. Apex Corp. 50 seats. Series A target: 500+ seats in enterprise accounts.
          Marcus is celebrating his commission. Priya is calculating what it will take to turn 50 into 500.
        </SituationCard>

        <ConversationScene
          mentor="dev" name="Marcus" role="Enterprise Sales · EdSpark" accent="#16A34A"
          lines={[
            { speaker: 'other', text: "Priya! We closed Apex Corp. 50 seats, six-month pilot, $40K contract. I\u2019ve been chasing this account for three months — finally." },
            { speaker: 'priya', text: "Congratulations. What\u2019s their expansion potential? How many reps does Apex have in total?" },
            { speaker: 'other', text: "...I don\u2019t know. I hadn\u2019t thought past the close." },
            { speaker: 'priya', text: "The $40K contract is the entrance fee to the conversation, not the contract itself. Tell me about their org structure — because that\u2019s what we\u2019re actually selling to." },
          ]}
        />

        {h2(<>In B2B, the First Contract Is a Pilot. The Expansion Is the Actual Business.</>)}

        {para(<>
          Consumer products grow through virality. B2B products grow through land-and-expand: win a beachhead in one team, prove value so undeniable that the internal champion has no choice but to take it to their VP, then ride the internal selling motion to adjacent teams and departments.
          The 50-seat Apex deal is not a win. It&apos;s an entrance exam.
          What EdSpark does with those 50 seats in 90 days determines whether Apex Corp becomes a 500-seat account or a cautionary tale in the next board deck.
        </>)}

        {pullQuote("The land is not the goal. It\u2019s the cost of admission to earn the proof that drives the expand.")}

        {para(<>
          The mistake Priya must avoid: treating Apex Corp as a customer success problem and handing it off to support.
          Land-and-expand is a product strategy. The product has to generate proof — measurable, attributable, undeniable — that the champion can take to their VP and say: &ldquo;Look at this number. This is why we need to expand.&rdquo;
          Slack&apos;s expansion playbook wasn&apos;t driven by sales outreach to other teams. It was driven by the West Coast engineering team telling the East Coast team: &ldquo;You need to be on this.&rdquo; The product created the expansion pressure. Sales just closed the paperwork.
          For EdSpark, that proof is specific: ramp time for new reps. If EdSpark can show Apex Corp that reps coached on the platform hit full productivity 30 days faster than the control group, that number sells the next 450 seats.
        </>)}

        {keyBox("Land-and-Expand Playbook", [
          "Land: win a high-visibility team with a concrete pain point — make it easy to prove ROI",
          "Prove: 10+ daily active users + one measurable business win the champion can reference",
          "Expand: arm the champion with that win story to sell sideways and upward in the org",
          "Gate expansions: locked teams tell Priya exactly which product bets to prioritize next",
        ])}

        <Section5Mockup />

        {para(<>
          Priya maps Apex Corp&apos;s expansion path. Two teams are immediately targetable: East Coast Sales (same pain, same use case) and Regional Sales Managers (need the coaching ROI data Kiran pointed to).
          Two teams are locked: Sales Enablement needs an admin tool EdSpark hasn&apos;t built, and Revenue Ops needs the Salesforce integration still in discovery sprint.
          That&apos;s not a problem. That&apos;s a roadmap. The locked teams tell Priya exactly which bets to fund next quarter.
        </>)}

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>&ldquo;What specific data points will Apex Corp&apos;s champion need to convince their VP to expand from 50 to 500 seats? Name the number — not the feature.&rdquo;</>}
          expandedContent={<>This is the reframe that separates product-led expansion from sales-led expansion. Priya shouldn&apos;t be asking &ldquo;what features does Apex need?&rdquo; — she should be asking &ldquo;what number will make the champion&apos;s argument irrefutable?&rdquo; In EdSpark&apos;s case: ramp time reduction (days), call conversion rate change (%), and manager time saved per week (hours). Three numbers. One story. If the product can&apos;t generate those numbers, the expansion stalls regardless of how good the features are.</>}
          question="EdSpark just signed Apex Corp for 50 seats. The expansion goal is 500 seats in 18 months. The most critical 90-day product milestone is:"
          options={[
            { text: "Shipping the enterprise admin dashboard and SSO before the first QBR meeting", correct: false, feedback: "Admin features are table stakes. A QBR with no usage story and no business win is a renewal risk, not a success signal." },
            { text: "Getting 10+ reps to daily usage and documenting one measurable business win", correct: true, feedback: "Daily usage proves adoption. One concrete win — ramp time down 30 days, conversion up 12% — gives the champion the number they need to sell expansion internally." },
            { text: "Locking in expansion contract terms while goodwill from the close is still high", correct: false, feedback: "Locking expansion terms before proving value is backwards. The proof creates the leverage for a good expansion contract — not the other way around." },
          ]}
          conceptId="b2b-strategy"
        />

        <QuizEngine
          conceptId="b2b-strategy"
          conceptName="B2B Strategy"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={QUIZZES[4]}
        />

      </ChapterSection>

      <ApplyItBox prompt="Pick a product you know well. Write its one-sentence strategy (who it serves, what it helps them do, how it wins). Then write one bet it should make this year and one it should explicitly not make. What makes the second one tempting but wrong?" />
      <NextChapterTeaser text="Strategy tells you which problem to solve. Discovery tells you whether you've actually found it. Next: Problem Discovery." />

    </>
  );
}

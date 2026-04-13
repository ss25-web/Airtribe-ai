'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizEngine from '../QuizEngine';
import {
  h2, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser, para,
} from './designSystem';
import { MentorFace } from './MentorFaces';

const ACCENT     = '#7C3AED';
const ACCENT_RGB = '124,58,237';

// ─────────────────────────────────────────
// QUIZZES — APM level: strategy under pressure, platform thinking, portfolio management
// ─────────────────────────────────────────
const QUIZZES = [
  {
    conceptId: 'strategy-discipline',
    question: "Meridian Corp sends Priya a Gong case study and a 30-day ultimatum. Rohan is in her calendar in 10 minutes. What does Priya do first?",
    options: [
      'A. Segment Meridian against EdSpark\'s ICP — NPS, support cost, churn risk — before any engineering call',
      'B. Schedule a call with Meridian\'s VP to map out their exact requirements in detail',
      'C. Build a lightweight MVP of Deal Intelligence AI to test Meridian\'s actual usage patterns',
      'D. Present Rohan with a revenue impact model of building vs. not building for Meridian',
    ],
    correctIndex: 0,
    explanation: "The data question always comes before the engineering question. Meridian's NPS is 21 vs a company average of 67. Their support cost is 5× other accounts. Before the meeting with Rohan, Priya needs to know whether Meridian is a customer to save or a segment-of-one trap.",
    keyInsight: "Strategic discipline means diagnosing before deciding — especially under time pressure.",
  },
  {
    conceptId: 'platform-inflection',
    question: "After the Meridian crisis, Rohan proposes making EdSpark a 'platform' so no customer can outgrow it. Which signal is the strongest indicator that EdSpark is actually ready to become a platform?",
    options: [
      'A. When EdSpark has enough customers that an app marketplace would attract third-party builders',
      'B. When the engineering team can build and maintain platform APIs without delaying core product',
      'C. When EdSpark\'s core value can be amplified by third parties via APIs without EdSpark\'s direct effort',
      'D. When a competitor like Gong launches a platform, forcing EdSpark to match their ecosystem scope',
    ],
    correctIndex: 2,
    explanation: "Platform readiness is about extensibility of core value, not team capacity or competitive pressure. If third parties can build on EdSpark's coaching data and CRM sync to create use cases EdSpark never imagined — that's the platform inflection. Competitive response is never a platform strategy.",
    keyInsight: "Platforms emerge from extensible core value, not from defensive feature matching.",
  },
  {
    conceptId: 'portfolio-systems-thinking',
    question: "Priya adds the Meridian bet to Q2. The forecasting feature — requested by 75% of customers — is already in the sprint. Both share 4 engineers. What's the right move?",
    options: [
      'A. Pause the forecasting feature and fully staff the Meridian bet to avoid the ultimatum deadline',
      'B. Model the cascade: which bets slip, by how many weeks, and what is the user impact of each delay',
      'C. Ask engineering to find efficiency gains that let both bets run in parallel without slipping',
      'D. Reduce the Meridian bet to a two-week discovery sprint to minimize the engineering footprint',
    ],
    correctIndex: 1,
    explanation: "Portfolio thinking means seeing the downstream effects before committing. Adding the Meridian bet without modeling the cascade means Priya is making a single-bet decision while managing a multi-bet portfolio. The forecasting feature's delay affects 90+ customers — that's a second bet being cancelled without anyone naming it.",
    keyInsight: "Every bet you add implicitly cancels or delays another. Name the tradeoff before making it.",
  },
  {
    conceptId: 'kill-criteria',
    question: "AI call summarization is 60% built. Customer interviews show low willingness to pay. The engineering team estimates 6 weeks to finish. What should Priya recommend?",
    options: [
      'A. Complete the feature — at 60% built, the marginal cost to finish is low versus the sunk investment',
      'B. Do a 2-week customer discovery sprint to validate willingness to pay before spending the final 6 weeks',
      'C. Reduce scope to a minimal version so the team can ship something rather than nothing',
      'D. Kill it — the opportunity cost of the remaining 6 weeks outweighs any value it would deliver',
    ],
    correctIndex: 3,
    explanation: "Sunk cost is irrelevant to the kill decision. The right frame is: 'What is the best use of the next 6 weeks?' If low WTP means the feature doesn't move retention or revenue, the 60% already spent doesn't change that math. Kill criteria exist precisely to prevent emotional decision-making about built-but-not-shipped work.",
    keyInsight: "Kill criteria are about future value, not past investment. The 60% is gone either way.",
  },
  {
    conceptId: 'series-b-narrative',
    question: "Priya is building EdSpark's Series B deck. Three narrative framings are on the table. Which framing do top-tier investors actually fund at Series B?",
    options: [
      'A. Category leadership: EdSpark is the only platform that measurably changes rep behavior, defensible by CRM depth',
      'B. Growth story: ARR grew from zero to $3.2M in 24 months, proving product-market fit at speed',
      'C. Market size: $12B TAM in sales enablement, EdSpark positioned to capture 2% with enterprise motion',
      'D. Customer love: NPS 67, 94% renewal rate, and three enterprise logos signed in the last quarter',
    ],
    correctIndex: 0,
    explanation: "Series B investors are buying a category. Growth proves execution but doesn't explain defensibility. TAM framing signals the team doesn't have a crisp theory of why they win. Customer love is evidence but not a thesis. Category leadership — a specific, defensible position that compounds — is what venture checks are written for.",
    keyInsight: "Series B is a category bet. Give investors a reason EdSpark wins, not just a reason it grows.",
  },
];

const PARTS = [
  { num: '01', label: "Strategy Discipline — when the pressure to react is loudest, holding the line is hardest" },
  { num: '02', label: "Platform vs Product — the question that changes your Series B valuation" },
  { num: '03', label: "Portfolio Thinking — three bets, one team, and the cascade nobody names" },
  { num: '04', label: "Kill Criteria — how to stop something you've already started" },
  { num: '05', label: "The Series B Story — investors don't fund metrics, they fund theses" },
];

const CHARACTERS: { mentor: 'priya' | 'rohan' | 'kiran' | 'asha'; accent: string; desc: string }[] = [
  { mentor: 'priya', accent: '#4F46E5', desc: "Two years in. She built the first strategy. Now she has to defend it against pressure she didn't anticipate." },
  { mentor: 'rohan', accent: '#E67E22', desc: "Series A just closed. He's seen the Gong case study Meridian sent. He wants action before the next board call." },
  { mentor: 'kiran', accent: '#0097A7', desc: "Meridian is 0.8% of users and 12% of support tickets. He has the slide ready. Nobody asked him yet." },
  { mentor: 'asha',  accent: '#7843EE', desc: "Never gives answers. Asks the question Priya hasn't thought to ask herself." },
];

// ─────────────────────────────────────────
// CHARACTER MOMENT — inline avatar for Rohan / Kiran
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
    background: `${accent}08`, border: `1px solid ${accent}22`,
    borderLeft: `3px solid ${accent}`,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
      <MentorFace mentor={mentor} size={38} />
      <div>
        <div style={{ fontWeight: 700, fontSize: '13px', color: accent }}>{name}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.06em' }}>{role}</div>
      </div>
    </div>
    <div style={{ fontSize: '14px', color: 'var(--ed-ink)', lineHeight: 1.8 }}>{children}</div>
  </div>
);

// ─────────────────────────────────────────
// CONVERSATION SCENE — full back-and-forth dialogue between Priya and a stakeholder
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
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`, transition: 'transform 0.18s ease', willChange: 'transform', ...style }}
    >
      {children}
    </div>
  );
};

// ─────────────────────────────────────────
// SECTION 1: Amplitude-style Customer Segment Analysis
// Priya clicks between segments to see Meridian's real numbers.
// The data tells the story: Meridian is high-cost, low-fit, low-NPS.
// Teaches: don't let one customer's revenue hide their true strategic cost.
// ─────────────────────────────────────────
type Seg1 = 'all' | 'meridian' | 'smb' | 'mid';
const SEG_DATA: Record<Seg1, { label: string; arr: string; nps: number; churn: string; support: string; seats: string; color: string; note: string }> = {
  all:      { label: 'All Customers',    arr: '$3.2M', nps: 67, churn: '8%',  support: '100 tix/mo', seats: '120 accts',   color: ACCENT,     note: 'Baseline view across the full customer base.' },
  smb:      { label: 'SMB (10–50 seats)',arr: '$1.8M', nps: 72, churn: '6%',  support: '45 tix/mo',  seats: '98 accts',    color: '#0D7A5A',  note: 'Core ICP. Low support cost, high NPS, sticky renewal.' },
  mid:      { label: 'Mid-Market',       arr: '$1.16M',nps: 71, churn: '9%',  support: '62 tix/mo',  seats: '21 accts',    color: '#B5720A',  note: 'Healthy segment. Slight churn uptick from complex onboarding.' },
  meridian: { label: 'Meridian Corp',    arr: '$240K', nps: 21, churn: '38%', support: '280 tix/mo', seats: '1 acct · 200 seats', color: '#C85A40', note: 'Highest revenue per account. Lowest NPS. Highest support cost. Outlier.' },
};

const Section1Mockup = () => {
  const [seg, setSeg] = useState<Seg1>('all');
  const d = SEG_DATA[seg];

  const metrics = [
    { label: 'ARR',         value: d.arr,     bar: seg === 'all' ? 100 : seg === 'smb' ? 56 : seg === 'mid' ? 36 : 7 },
    { label: 'NPS',         value: String(d.nps), bar: (d.nps / 80) * 100, color: d.nps < 40 ? '#C85A40' : '#0D7A5A' },
    { label: 'Churn Rate',  value: d.churn,   bar: parseFloat(d.churn) * 2.5, color: parseFloat(d.churn) > 15 ? '#C85A40' : '#0D7A5A' },
    { label: 'Support Load',value: d.support, bar: seg === 'meridian' ? 100 : seg === 'mid' ? 22 : seg === 'smb' ? 16 : 36 },
  ];

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid rgba(${ACCENT_RGB},0.25)`, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        {/* Header */}
        <div style={{ background: '#1B2A47', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#7FBAFF', fontWeight: 600, letterSpacing: '0.08em' }}>
              EdSpark · Customer Health Analysis · Amplitude
            </div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#4A90D9', letterSpacing: '0.08em' }}>120 accounts · $3.2M ARR</div>
        </div>

        {/* Segment switcher */}
        <div style={{ background: '#12213A', padding: '10px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
          {(Object.keys(SEG_DATA) as Seg1[]).map(s => (
            <button key={s} onClick={() => setSeg(s)} style={{
              padding: '5px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em', transition: 'all 0.15s',
              background: seg === s ? SEG_DATA[s].color : 'rgba(255,255,255,0.06)',
              color: seg === s ? '#fff' : '#7FBAFF',
            }}>{SEG_DATA[s].label}</button>
          ))}
        </div>

        <div style={{ background: '#1B2A47', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap' as const, gap: '8px' }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#4A90D9', letterSpacing: '0.12em', marginBottom: '4px' }}>SEGMENT</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: d.color }}>{d.label}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#7FBAFF', marginTop: '2px' }}>{d.seats}</div>
            </div>
            <div style={{ padding: '10px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${d.color}44` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#4A90D9', marginBottom: '4px' }}>ANALYST NOTE</div>
              <div style={{ fontSize: '12px', color: '#B8D4F0', lineHeight: 1.5, maxWidth: '280px' }}>{d.note}</div>
            </div>
          </div>

          {metrics.map(m => (
            <div key={m.label} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#7FBAFF', letterSpacing: '0.06em' }}>{m.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: m.color || d.color }}>{m.value}</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${Math.min(m.bar, 100)}%` }} transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{ height: '100%', background: m.color || d.color, borderRadius: '3px' }} />
              </div>
            </div>
          ))}

          {seg === 'meridian' && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(200,90,64,0.12)', border: '1px solid rgba(200,90,64,0.3)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#C85A40', fontWeight: 700, marginBottom: '5px' }}>KIRAN&apos;S FLAG</div>
              <div style={{ fontSize: '12px', color: '#E8C4BC', lineHeight: 1.6 }}>
                Meridian&apos;s support cost is 2.8× their ARR contribution per-seat. Their NPS is below the threshold where renewal becomes a retention conversation, not a product one. Building for them doesn&apos;t fix this — it delays it.
              </div>
            </motion.div>
          )}
        </div>

        <div style={{ background: '#12213A', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px 16px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#4A90D9' }}>
            Click each segment to see their full health profile · Meridian last
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// SECTION 2: Platform Readiness Matrix
// Priya evaluates 4 potential platform extensions against 3 criteria.
// Only one clears all three — that's the real platform move.
// Teaches: platform inflection has criteria, not just ambition.
// ─────────────────────────────────────────
type ExtKey = 'deal-intel' | 'forecasting' | 'rev-ops' | 'api';
const EXTENSIONS: { key: ExtKey; label: string; desc: string }[] = [
  { key: 'deal-intel',  label: 'Deal Intelligence AI',       desc: 'Gong-like win/loss analysis from call data' },
  { key: 'forecasting', label: 'Sales Forecasting Engine',   desc: 'Manager-level pipeline forecasting from CRM' },
  { key: 'rev-ops',     label: 'RevOps Analytics Suite',     desc: 'Cross-team revenue operations reporting' },
  { key: 'api',         label: 'Coaching API + Marketplace', desc: 'Let third parties build on EdSpark coaching data' },
];
const CRITERIA_P: { key: string; label: string; desc: string }[] = [
  { key: 'core', label: 'Core value preserved', desc: 'Extension amplifies coaching depth — not a pivot to a new problem' },
  { key: 'ext',  label: 'Third-party extensible', desc: 'Other companies can build on this without EdSpark doing all the work' },
  { key: 'net',  label: 'Network effects',        desc: 'More users of this extension increases value for everyone' },
];
// Pre-filled correct answers
const CORRECT_PLATFORM: Record<ExtKey, Record<string, boolean>> = {
  'deal-intel':  { core: false, ext: false, net: false },
  'forecasting': { core: true,  ext: false, net: false },
  'rev-ops':     { core: false, ext: false, net: false },
  'api':         { core: true,  ext: true,  net: true  },
};

const Section2Mockup = () => {
  const [answers, setAnswers] = useState<Record<ExtKey, Record<string, boolean | null>>>({
    'deal-intel':  { core: null, ext: null, net: null },
    'forecasting': { core: null, ext: null, net: null },
    'rev-ops':     { core: null, ext: null, net: null },
    'api':         { core: null, ext: null, net: null },
  });
  const [checked, setChecked] = useState(false);

  const toggle = (ext: ExtKey, crit: string) => {
    if (checked) return;
    setAnswers(prev => ({ ...prev, [ext]: { ...prev[ext], [crit]: !prev[ext][crit] } }));
  };

  const score = (ext: ExtKey) => Object.values(answers[ext]).filter(v => v === true).length;
  const allFilled = (Object.keys(answers) as ExtKey[]).every(ext =>
    Object.values(answers[ext]).every(v => v !== null)
  );

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid rgba(${ACCENT_RGB},0.25)`, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ background: '#1A1D21', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#C4B5FD', fontWeight: 600 }}>
              EdSpark · Platform Readiness Assessment
            </div>
          </div>
          {allFilled && !checked && (
            <button onClick={() => setChecked(true)} style={{ padding: '4px 12px', borderRadius: '4px', background: ACCENT, color: '#fff', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>
              Score →
            </button>
          )}
        </div>

        <div style={{ background: '#fff', padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(3, 1fr)', gap: '6px', marginBottom: '4px' }}>
            <div />
            {CRITERIA_P.map(c => (
              <div key={c.key} style={{ textAlign: 'center' as const, padding: '8px 4px', background: `rgba(${ACCENT_RGB},0.06)`, borderRadius: '6px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: ACCENT, letterSpacing: '0.1em', marginBottom: '3px' }}>{c.label}</div>
                <div style={{ fontSize: '10px', color: '#8A8580', lineHeight: 1.4 }}>{c.desc}</div>
              </div>
            ))}
          </div>

          {EXTENSIONS.map(ext => (
            <div key={ext.key} style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(3, 1fr)', gap: '6px', marginBottom: '8px', alignItems: 'center' }}>
              <div style={{ padding: '10px 12px', background: '#F8F6F2', borderRadius: '6px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1C1814', marginBottom: '2px' }}>{ext.label}</div>
                <div style={{ fontSize: '10px', color: '#8A8580' }}>{ext.desc}</div>
                {checked && (
                  <div style={{ marginTop: '6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700,
                    color: score(ext.key) === 3 ? '#0D7A5A' : score(ext.key) === 0 ? '#C85A40' : '#B5720A' }}>
                    {score(ext.key)}/3 criteria met {score(ext.key) === 3 ? '✓ Platform candidate' : '✗ Not ready'}
                  </div>
                )}
              </div>
              {CRITERIA_P.map(c => {
                const val = answers[ext.key][c.key];
                const correct = CORRECT_PLATFORM[ext.key][c.key];
                const showResult = checked;
                const isWrong = showResult && val !== correct;
                return (
                  <button key={c.key} onClick={() => toggle(ext.key, c.key)} style={{
                    height: '56px', borderRadius: '6px', border: `2px solid ${showResult ? (isWrong ? '#C85A40' : val === true ? '#0D7A5A' : '#E0D9D0') : val === true ? ACCENT : '#E0D9D0'}`,
                    background: showResult ? (isWrong ? 'rgba(200,90,64,0.08)' : val === true ? 'rgba(13,122,90,0.08)' : '#F8F6F2') : val === true ? `rgba(${ACCENT_RGB},0.08)` : '#F8F6F2',
                    cursor: checked ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', transition: 'all 0.15s',
                  }}>
                    {val === null ? '—' : val === true ? (showResult ? (correct ? '✓' : '✗') : '✓') : (showResult ? (correct ? '✗' : '—') : '×')}
                  </button>
                );
              })}
            </div>
          ))}

          {checked && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '12px', padding: '14px 16px', borderRadius: '8px', background: 'rgba(13,122,90,0.06)', border: '1px solid rgba(13,122,90,0.25)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#0D7A5A', marginBottom: '6px' }}>THE FINDING</div>
              <div style={{ fontSize: '13px', color: '#1C1814', lineHeight: 1.65 }}>
                Only the Coaching API clears all three criteria. Deal Intelligence AI preserves nothing — it&apos;s Gong with EdSpark&apos;s name on it. A platform strategy that starts with an API layer lets EdSpark stay focused while third parties extend its reach. The alternative is becoming a feature factory.
              </div>
            </motion.div>
          )}
        </div>

        <div style={{ background: '#F8F6F2', borderTop: `1px solid rgba(${ACCENT_RGB},0.15)`, padding: '8px 16px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#5E6C84' }}>
            For each extension, mark ✓ if it meets the criterion · Score to see which extension is actually platform-ready
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// SECTION 3: Portfolio Dependency Cascade
// Toggle the Meridian bet ON — watch it cascade through 3 other bets.
// Teaches: every added bet is also a decision about what slips.
// ─────────────────────────────────────────
type BetId = 'forecasting' | 'analytics' | 'mobile' | 'meridian';
const BASE_BETS: { id: BetId; label: string; weeks: number; color: string; users: string }[] = [
  { id: 'forecasting', label: 'Sales Forecasting (75% of users requested)', weeks: 5, color: '#0D7A5A', users: '90+ accounts' },
  { id: 'analytics',   label: 'Manager Coaching Analytics',                 weeks: 4, color: '#B5720A', users: '60+ accounts' },
  { id: 'mobile',      label: 'Mobile App (iOS)',                           weeks: 6, color: ACCENT,    users: '40+ accounts' },
];
const CASCADE_DELAY: Record<Exclude<BetId,'meridian'>, number> = {
  forecasting: 8,
  analytics:   3,
  mobile:      5,
};

const Section3Mockup = () => {
  const [meridianOn, setMeridianOn] = useState(false);
  const [showImpact, setShowImpact] = useState<BetId | null>(null);

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid rgba(${ACCENT_RGB},0.25)`, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ background: '#172B4D', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#B8C4D4', fontWeight: 600 }}>
              EdSpark · Q2 Portfolio · Dependency Map · 4 engineers shared
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: meridianOn ? '#C85A40' : '#7FBAFF' }}>
              {meridianOn ? 'MERIDIAN BET: ON' : 'MERIDIAN BET: OFF'}
            </span>
            <button onClick={() => { setMeridianOn(m => !m); setShowImpact(null); }} style={{
              padding: '4px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700,
              background: meridianOn ? '#C85A40' : 'rgba(255,255,255,0.1)', color: '#fff', transition: 'all 0.2s',
            }}>
              {meridianOn ? 'Remove' : 'Add to Q2 →'}
            </button>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#97A0AF', letterSpacing: '0.1em', marginBottom: '16px' }}>
            CURRENT Q2 SPRINT — 4 ENGINEERS · {meridianOn ? 'MERIDIAN ADDED — CASCADE ACTIVE' : 'CLICK "ADD TO Q2" TO SEE CASCADE'}
          </div>

          {BASE_BETS.map(bet => {
            const delay = meridianOn ? CASCADE_DELAY[bet.id as Exclude<BetId, 'meridian'>] : 0;
            const totalWeeks = bet.weeks + delay;
            return (
              <div key={bet.id} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C1814' }}>{bet.label}</span>
                    <span style={{ marginLeft: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#97A0AF' }}>{bet.users}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {delay > 0 && (
                      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        onClick={() => setShowImpact(showImpact === bet.id ? null : bet.id)}
                        style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(200,90,64,0.08)', border: '1px solid rgba(200,90,64,0.3)', color: '#C85A40', fontSize: '9px', fontWeight: 600, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" }}>
                        +{delay}wks slipped
                      </motion.button>
                    )}
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: delay > 0 ? '#C85A40' : bet.color }}>
                      {totalWeeks}w
                    </span>
                  </div>
                </div>
                <div style={{ height: '10px', background: '#F0EDE8', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', display: 'flex', borderRadius: '5px', overflow: 'hidden' }}>
                    <motion.div animate={{ width: `${(bet.weeks / 14) * 100}%` }} transition={{ duration: 0.4 }}
                      style={{ background: bet.color, height: '100%' }} />
                    {delay > 0 && (
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(delay / 14) * 100}%` }} transition={{ duration: 0.5, delay: 0.1 }}
                        style={{ background: 'rgba(200,90,64,0.5)', height: '100%' }} />
                    )}
                  </div>
                </div>
                <AnimatePresence>
                  {showImpact === bet.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden' }}>
                      <div style={{ marginTop: '8px', padding: '10px 14px', borderRadius: '6px', background: 'rgba(200,90,64,0.06)', border: '1px solid rgba(200,90,64,0.2)', fontSize: '12px', color: '#1C1814', lineHeight: 1.6 }}>
                        {bet.id === 'forecasting' && 'This 8-week slip pushes the forecasting feature past the Series B data room window. 90+ accounts waiting for this — and Priya will have to explain why a 1-account request delayed a 90-account feature.'}
                        {bet.id === 'analytics' && 'Analytics slips 3 weeks — not catastrophic alone, but it delays the manager retention data that would prove EdSpark\'s core value story for Series B.'}
                        {bet.id === 'mobile' && 'Mobile slips 5 weeks into Q3. The two enterprise prospects who asked for mobile access last month become Q3 problems.'}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Meridian bet row */}
          <AnimatePresence>
            {meridianOn && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                style={{ marginTop: '8px', padding: '14px 16px', borderRadius: '8px', background: 'rgba(200,90,64,0.06)', border: '1.5px solid rgba(200,90,64,0.35)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#C85A40' }}>Deal Intelligence AI (Meridian)</span>
                    <span style={{ marginLeft: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#C85A40' }}>1 account</span>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#C85A40' }}>10w</span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#C85A40', lineHeight: 1.6 }}>
                  Adding this bet consumes 2 of 4 engineers for 10 weeks. The cascade above is the hidden cost — 16 total weeks of delay across 3 bets that serve 190+ accounts.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ background: '#F8F6F2', borderTop: `1px solid rgba(${ACCENT_RGB},0.15)`, padding: '8px 16px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#5E6C84' }}>
            Toggle the Meridian bet · click any slipped bet to see the user impact · every bet you add cancels something else
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// SECTION 4: Kill / Continue Decision Framework
// 5 criteria applied to AI Call Summarization (60% built, low WTP).
// The framework makes the case — even if the PM is reluctant.
// Teaches: kill decisions require a process, not just courage.
// ─────────────────────────────────────────
const KILL_CRITERIA = [
  { id: 'icp',    q: 'Does this feature serve EdSpark\'s core ICP — sales managers coaching reps — or a secondary persona?', killAnswer: false, killLabel: 'No → Misaligned with ICP' },
  { id: 'wtp',    q: 'Have 3+ customers confirmed they would pay specifically for AI call summarization at current pricing?',   killAnswer: false, killLabel: 'No → No validated WTP' },
  { id: 'moat',   q: 'Does this feature create switching costs or competitive differentiation that Gong cannot easily copy?',  killAnswer: false, killLabel: 'No → No defensibility' },
  { id: 'opp',    q: 'Is the 6 weeks remaining the best possible use of those engineers vs. the forecasting feature?',         killAnswer: false, killLabel: 'No → Better alternatives exist' },
  { id: 'signal', q: 'Do users who activate any call feature show meaningfully better 30-day retention than those who don\'t?',killAnswer: true,  killLabel: 'Yes → But correlation ≠ causation' },
];

const Section4Mockup = () => {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>(Object.fromEntries(KILL_CRITERIA.map(c => [c.id, null])));
  const [showVerdict, setShowVerdict] = useState(false);

  const allAnswered = Object.values(answers).every(v => v !== null);
  const killScore = KILL_CRITERIA.filter(c => answers[c.id] === c.killAnswer).length;

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid rgba(${ACCENT_RGB},0.25)`, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ background: '#0F172A', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
              Feature Kill/Continue Framework · AI Call Summarization (60% built)
            </div>
          </div>
          {allAnswered && !showVerdict && (
            <button onClick={() => setShowVerdict(true)} style={{ padding: '4px 12px', borderRadius: '4px', background: '#C85A40', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>
              Get verdict →
            </button>
          )}
        </div>

        <div style={{ background: '#fff', padding: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#97A0AF', letterSpacing: '0.1em', marginBottom: '16px' }}>
            ANSWER HONESTLY — THE FRAMEWORK SHOULD DRIVE THE DECISION, NOT CONFIRM YOUR INSTINCT
          </div>

          {KILL_CRITERIA.map((c, i) => (
            <div key={c.id} style={{ marginBottom: '14px', padding: '14px 16px', borderRadius: '8px', background: '#F8F6F2', border: `1px solid ${answers[c.id] !== null && showVerdict ? (answers[c.id] === c.killAnswer ? 'rgba(200,90,64,0.3)' : '#E0D9D0') : '#E0D9D0'}` }}>
              <div style={{ fontSize: '13px', color: '#1C1814', lineHeight: 1.6, marginBottom: '10px' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#97A0AF', marginRight: '8px' }}>{String(i+1).padStart(2,'0')}</span>
                {c.q}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Yes', 'No'].map(opt => {
                  const val = opt === 'Yes';
                  const isSelected = answers[c.id] === val;
                  const isKillSignal = showVerdict && val === c.killAnswer;
                  return (
                    <button key={opt} onClick={() => !showVerdict && setAnswers(prev => ({ ...prev, [c.id]: val }))} style={{
                      padding: '6px 20px', borderRadius: '6px', border: `1.5px solid ${isSelected ? ACCENT : '#E0D9D0'}`,
                      background: isSelected ? `rgba(${ACCENT_RGB},0.08)` : '#fff',
                      color: isSelected ? ACCENT : '#97A0AF', fontWeight: 700, fontSize: '12px',
                      cursor: showVerdict ? 'default' : 'pointer', transition: 'all 0.15s',
                    }}>{opt}</button>
                  );
                })}
                {showVerdict && answers[c.id] === c.killAnswer && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ alignSelf: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#C85A40', fontWeight: 700 }}>
                    → {c.killLabel}
                  </motion.span>
                )}
              </div>
            </div>
          ))}

          <AnimatePresence>
            {showVerdict && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: '16px', padding: '16px 20px', borderRadius: '10px',
                  background: killScore >= 3 ? 'rgba(200,90,64,0.06)' : 'rgba(13,122,90,0.06)',
                  border: `1.5px solid ${killScore >= 3 ? 'rgba(200,90,64,0.3)' : 'rgba(13,122,90,0.3)'}` }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: killScore >= 3 ? '#C85A40' : '#0D7A5A', marginBottom: '8px' }}>
                  VERDICT: {killScore >= 3 ? `KILL IT — ${killScore}/5 kill criteria met` : `CONTINUE — ONLY ${killScore}/5 kill criteria met`}
                </div>
                <div style={{ fontSize: '13px', color: '#1C1814', lineHeight: 1.65 }}>
                  {killScore >= 3
                    ? 'The sunk cost of 60% is irrelevant to this decision. The next 6 weeks are the only thing on the table — and they produce a feature with low ICP fit, no validated WTP, and no competitive moat. Redirect those engineers to the forecasting feature that 90+ accounts are waiting for.'
                    : 'The criteria suggest continuing. But revisit WTP validation before committing the full 6 weeks — even a go/no-go checkpoint at week 3 protects against overinvestment.'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ background: '#F8F6F2', borderTop: `1px solid rgba(${ACCENT_RGB},0.15)`, padding: '8px 16px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#5E6C84' }}>
            Answer all 5 criteria honestly — then get the framework verdict · the sunk cost is not one of the criteria
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// SECTION 5: Series B Narrative Framer
// Three narrative framings. Each produces a different investor reaction.
// Teaches: Series B is a category bet, not a growth bet.
// ─────────────────────────────────────────
type Framing = 'growth' | 'category' | 'market';
const FRAMINGS: { key: Framing; label: string; pitch: string; reaction: string; concern: string | null; score: number; color: string }[] = [
  {
    key: 'growth',
    label: 'Growth Story',
    pitch: '"EdSpark went from $0 to $3.2M ARR in 24 months. 94% renewal rate. 120 customers. We\'re raising Series B to pour fuel on this growth."',
    reaction: 'Interested but cautious.',
    concern: 'Growth without defensibility is a growth trap. What stops Gong from copying your top 3 features and outspending you in sales?',
    score: 2, color: '#B5720A',
  },
  {
    key: 'category',
    label: 'Category Leadership',
    pitch: '"EdSpark is the only coaching platform that changes rep behavior measurably — not just logs calls. Our CRM depth creates switching costs no point solution can match. We\'re raising to own this category before Gong notices it."',
    reaction: 'Leaning in.',
    concern: null,
    score: 5, color: '#0D7A5A',
  },
  {
    key: 'market',
    label: 'Market Size',
    pitch: '"The sales enablement TAM is $12B. EdSpark is positioned to capture 2% with the right enterprise motion. Series B funds the GTM expansion."',
    reaction: 'Politely skeptical.',
    concern: 'TAM-first pitches signal the team doesn\'t have a crisp theory of why they win — only where they hope to sell. What\'s the wedge that gets you to $12M ARR?',
    score: 1, color: '#C85A40',
  },
];

const Section5Mockup = () => {
  const [chosen, setChosen] = useState<Framing | null>(null);
  const framing = FRAMINGS.find(f => f.key === chosen);

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid rgba(${ACCENT_RGB},0.25)`, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ background: '#1C1035', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#C4B5FD', fontWeight: 600, letterSpacing: '0.08em' }}>
            EdSpark · Series B Narrative · Pitch.com
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#97A0AF', letterSpacing: '0.1em', marginBottom: '14px' }}>
            PRIYA HAS 3 NARRATIVE FRAMINGS — PICK THE ONE SHE LEADS WITH
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {FRAMINGS.map(f => (
              <button key={f.key} onClick={() => setChosen(f.key)} style={{
                padding: '14px 18px', borderRadius: '8px', textAlign: 'left',
                background: chosen === f.key ? `${f.color}10` : '#F8F6F2',
                border: `1.5px solid ${chosen === f.key ? f.color : '#E0D9D0'}`,
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: chosen === f.key ? f.color : '#1C1814', marginBottom: '6px' }}>{f.label}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.6, fontStyle: 'italic' }}>{f.pitch}</div>
                  </div>
                  {chosen === f.key && (
                    <div style={{ display: 'flex', gap: '3px', flexShrink: 0, alignItems: 'center', paddingTop: '2px' }}>
                      {[1,2,3,4,5].map(i => (
                        <div key={i} style={{ width: '10px', height: '10px', borderRadius: '2px', background: i <= f.score ? f.color : '#E0D9D0' }} />
                      ))}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {framing && (
              <motion.div key={framing.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ padding: '16px 20px', borderRadius: '10px', background: `${framing.color}08`, border: `1.5px solid ${framing.color}33` }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: framing.color, marginBottom: '8px', letterSpacing: '0.1em' }}>
                  INVESTOR REACTION — {framing.reaction.toUpperCase()}
                </div>
                {framing.concern ? (
                  <>
                    <div style={{ fontSize: '13px', color: '#1C1814', lineHeight: 1.65, marginBottom: '10px', fontStyle: 'italic' }}>
                      &ldquo;{framing.concern}&rdquo;
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: framing.color, letterSpacing: '0.06em' }}>
                      TRY A DIFFERENT FRAMING →
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '13px', color: '#1C1814', lineHeight: 1.65 }}>
                    &ldquo;Category leadership with a specific, defensible moat — CRM depth creating real switching costs. This is what Series B checks are written for. Walk me through the path to $12M ARR.&rdquo;
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ background: '#F8F6F2', borderTop: `1px solid rgba(${ACCENT_RGB},0.15)`, padding: '8px 16px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#5E6C84' }}>
            Pick a framing · see the investor reaction · there is one right answer and two expensive mistakes
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
export default function Track2ProductStrategy() {
  return (
    <article style={{ maxWidth: '720px', margin: '0 auto', padding: '0 0 80px' }}>

      {/* ── HERO ───────────────────────────────────────────── */}
      <div style={{ background: 'var(--ed-cream)', borderRadius: '14px', padding: '40px 40px 36px', marginBottom: '0', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-16px', top: '-8px', fontSize: '160px', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.05)`, fontFamily: "'Lora','Georgia',serif", letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>02</div>

        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: '10px' }}>
          Module 02 · Scale Track · Product Strategy
        </div>
        <h1 style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, color: 'var(--ed-ink)', lineHeight: 1.15, letterSpacing: '-0.025em', fontFamily: "'Lora','Georgia',serif", marginBottom: '14px' }}>
          Strategy Holds or It Breaks
        </h1>
        {para(<>Series A is closed. Priya has a team, a roadmap, and a strategy she built from scratch. Then Meridian Corp sends Rohan a Gong case study with a 30-day ultimatum. This module is about what happens to strategy when it meets real pressure — and the five decisions that determine whether EdSpark reaches Series B with a story investors believe.</>)}

        {/* Five parts */}
        <div style={{ marginTop: '28px' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: ACCENT, marginBottom: '12px' }}>
            FIVE DECISIONS · FIVE SECTIONS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {PARTS.map(p => (
              <div key={p.num} style={{ display: 'flex', alignItems: 'baseline', gap: '12px', padding: '8px 12px', borderRadius: '6px', background: `rgba(${ACCENT_RGB},0.04)`, border: `1px solid rgba(${ACCENT_RGB},0.1)` }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 700, color: ACCENT, flexShrink: 0 }}>{p.num}</span>
                <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.5 }}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Characters */}
        <div style={{ marginTop: '28px' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: ACCENT, marginBottom: '12px' }}>WHO IS IN THIS MODULE</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(156px, 1fr))', gap: '10px' }}>
            {CHARACTERS.map(c => (
              <div key={c.mentor} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '14px 12px', borderRadius: '10px', background: 'var(--ed-card)', border: `1px solid ${c.accent}22`, textAlign: 'center' as const }}>
                <MentorFace mentor={c.mentor} size={44} />
                <div style={{ fontWeight: 700, fontSize: '12px', color: c.accent }}>{c.mentor === 'priya' ? 'Priya' : c.mentor === 'rohan' ? 'Rohan' : c.mentor === 'kiran' ? 'Kiran' : 'Asha'}</div>
                <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How this works */}
        <div style={{ marginTop: '24px', padding: '16px 20px', background: `rgba(${ACCENT_RGB},0.05)`, borderRadius: '10px', border: `1px solid rgba(${ACCENT_RGB},0.15)` }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, marginBottom: '8px' }}>HOW THIS WORKS</div>
          <p style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75, margin: 0 }}>
            Rohan creates the pressure. Kiran brings the data that reframes what the pressure actually is. Asha asks the question that stops Priya — and you — from making the obvious but wrong move. Every interactive tool is something Priya actually uses to make a real decision. Nothing here is a demo.
          </p>
        </div>
      </div>

      {/* ── SECTION 1: Strategy Under Pressure ──────────────────── */}
      <ChapterSection id="m2a-strategy-pressure" num="01" accentRgb={ACCENT_RGB} first>
        {h2(<>When Pressure Arrives, Strategy Is the First Thing to Go</>)}

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Monday morning. Rohan forwards Priya a Gong case study — sent by Meridian Corp&apos;s VP of Sales with a note: &ldquo;We need Deal Intelligence AI by end of quarter or we&apos;re moving to Gong.&rdquo; Meridian is 200 seats. $240,000 ARR. The next board call is in three weeks.
        </SituationCard>

        {para(<>Every experienced PM will eventually face a version of this moment. A big customer, a credible competitor, and a CEO who hears $240K at risk and wants action. The question isn&apos;t whether to feel the urgency — it&apos;s whether to let the urgency make the decision.</>)}

        <ConversationScene
          mentor="rohan" name="Rohan" role="CEO · EdSpark" accent="#E67E22"
          lines={[
            { speaker: 'other', text: "Meridian is 200 seats and $240K ARR. If they leave with a Gong case study, we lose three more like them before the board call. Build the Deal Intelligence AI \u2014 it\u2019s a no-brainer." },
            { speaker: 'priya', text: "What\u2019s Meridian\u2019s NPS? Their support ticket volume? Their expansion potential beyond 200 seats?" },
            { speaker: 'other', text: "I don\u2019t know the details \u2014 but $240K is $240K. We can\u2019t just let that walk." },
            { speaker: 'priya', text: "Let me show you the full segment analysis before we make an engineering call. Because I think Meridian is telling us something we haven\u2019t heard yet." },
          ]}
        />

        {para(<>Rohan is right about the stakes and wrong about the solution. $240,000 in ARR sounds like a lot until you see what Meridian actually costs to serve — and what it would cost to build their way.</>)}

        {keyBox('What Priya does before the engineering call', [
          'Pulls Meridian\'s full health data: NPS, support tickets, churn signals, revenue per seat',
          'Compares Meridian\'s metrics to the rest of the customer base — not the absolute number',
          'Asks: is Meridian an outlier in our ICP, or a leading indicator of where all customers go?',
          'Only then does she form a recommendation — before the meeting with Rohan, not during it',
        ])}

        {para(<>The segment analysis below is the tool Priya uses. Click through each customer segment before looking at Meridian last. The contrast is the lesson.</>)}

        <Section1Mockup />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Meridian is 10% of your ARR. But are they 10% of your market — or 10% of your problem?</>}
          expandedContent={<>There are two very different things a big customer can signal. They can be a leading indicator — showing you where your whole market is heading. Or they can be an outlier — a customer with a use case that diverges from your ICP so far that serving them means not serving everyone else. Kiran&apos;s data suggests Meridian is the second. But Rohan is reacting to the first. The analysis you just ran is how Priya tells the difference before the meeting — not during it.</>}
          question="Meridian's NPS is 21. EdSpark's average is 67. What does that gap tell you?"
          options={[
            { text: 'EdSpark has a product quality problem that Meridian is surfacing first', correct: false, feedback: 'A company-wide product problem would show up across segments, not just Meridian. The SMB and mid-market segments both have NPS above 70.' },
            { text: 'Meridian\'s use case is misaligned with what EdSpark was built to do', correct: true, feedback: 'Exactly. NPS below 30 in one segment while the rest are above 70 is the signature of a segment-of-one outlier — not a product problem. Meridian is asking EdSpark to be something it\'s not.' },
            { text: 'Meridian needs a dedicated customer success manager, not a new feature', correct: false, feedback: 'CS can help, but a 46-point NPS gap isn\'t a relationship problem. It\'s a product-fit problem. They\'d need the same thing from Gong.' },
            { text: 'The NPS methodology is flawed when applied to enterprise accounts', correct: false, feedback: 'The methodology applies consistently across segments. The gap is real data, not a measurement artifact.' },
          ]}
          conceptId="strategy-discipline"
        />

        <QuizEngine
          conceptId="strategy-discipline"
          conceptName="Strategy Discipline Under Pressure"
          moduleContext="Priya faces the Meridian ultimatum. Rohan wants the feature built. Kiran has the data. What does Priya do first?"
          staticQuiz={{
            conceptId: 'strategy-discipline',
            question: QUIZZES[0].question,
            options: QUIZZES[0].options,
            correctIndex: QUIZZES[0].correctIndex,
            explanation: QUIZZES[0].explanation,
            keyInsight: QUIZZES[0].keyInsight,
          }}
        />
      </ChapterSection>

      {/* ── SECTION 2: Platform vs Point Solution ───────────────── */}
      <ChapterSection id="m2a-platform-inflection" num="02" accentRgb={ACCENT_RGB}>
        {h2(<>Platform or Product: The Question That Determines Your Valuation</>)}

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya presents the Meridian analysis to Rohan. He takes it in. Then: &ldquo;Fine. We don&apos;t build for Meridian specifically. But this won&apos;t be the last time we have this conversation. What if EdSpark became a platform? No customer could ever outgrow us.&rdquo; It&apos;s a good instinct. It&apos;s also a trap if the timing is wrong.
        </SituationCard>

        {para(<>Platform is not a feature set — it&apos;s an architecture decision that changes everything downstream: engineering, go-to-market, pricing, and what the company optimizes for. Most Series A companies that &ldquo;become platforms&rdquo; become complex products that serve nobody well.</>)}

        {pullQuote("A platform exists when third parties can create value on top of your core that you couldn't create yourself. Until then, it's a product with more features.")}

        <ConversationScene
          mentor="kiran" name="Kiran" role="Data Analyst · EdSpark" accent="#0097A7"
          lines={[
            { speaker: 'other', text: "If we build platform APIs, our 120 SMB customers won\u2019t use them \u2014 they don\u2019t have engineering teams. The companies who would use the API are enterprise accounts we haven\u2019t won yet." },
            { speaker: 'priya', text: "So what\u2019s the actual platform inflection signal? When do we know we\u2019re ready?" },
            { speaker: 'other', text: "When our coaching data is good enough that a third party builds on top of it without us asking them to. We\u2019re not there \u2014 the CRM sync gaps mean our data model still has holes." },
            { speaker: 'priya', text: "Then we\u2019re clear with Rohan: platform is a 12\u201318 month horizon, not a Q2 roadmap item. Let\u2019s show him which extension actually clears the criteria." },
          ]}
        />

        {para(<>Kiran isn&apos;t saying never. He&apos;s saying: not yet, not for these reasons. The platform readiness matrix below asks the three questions that separate genuine platform inflection from premature complexity. Try each of Rohan&apos;s proposed extensions.</>)}

        <Section2Mockup />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>If your 120 happiest customers don&apos;t need a platform — who exactly is the platform for?</>}
          expandedContent={<>Platform decisions get made for two reasons: because your core customers are asking for extensibility, or because you&apos;re trying to defensively expand before a competitor does. The first is a signal. The second is a reaction. The matrix you just used reveals which of those is driving EdSpark&apos;s platform conversation — and only the Coaching API clears all three criteria because it amplifies coaching depth for existing customers while enabling third-party extensions. Every other extension is a new product disguised as a platform feature.</>}
          question="EdSpark decides to build platform APIs. What's the earliest leading indicator that it was the right call?"
          options={[
            { text: 'Three enterprise deals specifically cited the API in their procurement criteria', correct: false, feedback: 'This indicates the API is a sales tool, not a platform signal. Enterprise procurement criteria change — a real platform signal is usage, not procurement.' },
            { text: 'Two third-party builders ship integrations that EdSpark\'s own team wouldn\'t have built', correct: true, feedback: 'This is the platform signal — third parties creating value that EdSpark couldn\'t or wouldn\'t create directly. It proves the core value is extensible and that the ecosystem is self-sustaining.' },
            { text: 'API calls grow 40% month-over-month for three consecutive months', correct: false, feedback: 'Usage growth is a health signal, but it doesn\'t confirm the platform thesis. EdSpark\'s own integrations could drive this number. What matters is who\'s building and why.' },
            { text: 'The engineering team builds the API layer without delaying core product', correct: false, feedback: 'Execution quality is table stakes — it proves the team can ship but says nothing about whether the platform is working. A smoothly-built API with no third-party adoption is still a failed platform.' },
          ]}
          conceptId="platform-inflection"
        />

        <QuizEngine
          conceptId="platform-inflection"
          conceptName="Platform vs Point Solution Inflection"
          moduleContext="Rohan proposes making EdSpark a platform after the Meridian crisis. Priya has to evaluate when — and whether — platform is the right move."
          staticQuiz={{
            conceptId: 'platform-inflection',
            question: QUIZZES[1].question,
            options: QUIZZES[1].options,
            correctIndex: QUIZZES[1].correctIndex,
            explanation: QUIZZES[1].explanation,
            keyInsight: QUIZZES[1].keyInsight,
          }}
        />
      </ChapterSection>

      {/* ── SECTION 3: Portfolio Systems Thinking ───────────────── */}
      <ChapterSection id="m2a-portfolio-systems" num="03" accentRgb={ACCENT_RGB}>
        {h2(<>Every Bet You Add Cancels Something Else — Name the Tradeoff</>)}

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Q2 planning. Priya has 4 engineers, three committed bets, and a cross-functional team that just spent two days aligning on the sprint. Then the Meridian situation escalates. Rohan wants to add Deal Intelligence AI to Q2. &ldquo;Can&apos;t we just fit it in?&rdquo;
        </SituationCard>

        {para(<>The word &ldquo;fit&rdquo; is how scope creep starts. No bet exists in isolation — they share engineers, they share attention, and when one grows, the others shrink. The cascade is real and it&apos;s always larger than it first appears.</>)}

        <ConversationScene
          mentor="rohan" name="Rohan" role="CEO · EdSpark" accent="#E67E22"
          lines={[
            { speaker: 'other', text: "For every dollar we spend on the Meridian bet, I need to see a clear path to $3 back. Two engineers for 10 weeks. Make it work." },
            { speaker: 'priya', text: "Two engineers on Meridian means Smart Coaching Prompts and Q4 Reporting both slip by six weeks. Those are features 90% of our customer base is waiting for." },
            { speaker: 'other', text: "Meridian could pull out while we\u2019re raising. That\u2019s $240K gone and a bad story for the board." },
            { speaker: 'priya', text: "And losing Smart Coaching Prompts delays our NPS story for everyone else. Let me show you the full cascade before we decide \u2014 because every bet we add cancels something else." },
          ]}
        />

        {para(<>Two engineers for 10 weeks is not a small ask when the team has 4. Toggle the Meridian bet in the dependency map below and watch what happens to the three bets that were already in the sprint. Click the slipped bets to see the user impact.</>)}

        <Section3Mockup />

        {keyBox('What portfolio-level systems thinking looks like', [
          'Before adding any bet, model which bets it delays and by how many weeks',
          'Translate delays into user impact — not just schedule risk',
          'Present the tradeoff explicitly: "Adding Meridian slips forecasting 8 weeks and affects 90+ accounts"',
          'Make Rohan choose with full information — not partial information framed as "we\'ll make it work"',
        ])}

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Which feature are you more afraid to miss: the one Meridian is asking for, or the one 90 accounts are waiting for?</>}
          expandedContent={<>The cascade map makes it concrete: adding the Meridian bet delays the forecasting feature by 8 weeks. 90+ accounts are waiting for that feature. But those accounts don&apos;t send escalation emails — they just quietly churn when their roadmap requests keep getting deprioritized. The customers who complain loudest shape roadmaps. The customers who leave quietly reveal strategy. The cascade you just ran is the tool that makes the quiet cost visible before it happens.</>}
          question="Priya presents the cascade to Rohan. He says: 'Then find two more engineers.' What does Priya do?"
          options={[
            { text: 'Hire two contractors to run the Meridian bet without pulling from the core team', correct: false, feedback: 'Contractors need onboarding time and context — in a 10-week sprint, you lose 2–3 weeks before they\'re productive. The math doesn\'t work, and you\'ve added coordination overhead.' },
            { text: 'Accept the directive and plan to re-negotiate later when the slippage becomes visible', correct: false, feedback: 'Waiting for slippage to become visible is reactive management. By the time it\'s visible, you\'ve lost the ability to course-correct. This is how "we\'ll make it work" turns into a missed quarter.' },
            { text: 'Reframe the decision: "We can add Meridian if we explicitly kill the forecasting bet this quarter"', correct: true, feedback: 'This is the right framing. Not "we\'ll find engineers" but "here\'s what we give up." Making Rohan name the sacrifice converts a scope creep request into a real tradeoff decision with accountability on both sides.' },
            { text: 'Run a sprint to reduce the Meridian feature scope until it fits within 2 engineer-weeks', correct: false, feedback: 'Scope reduction might work for simple features, but Deal Intelligence AI isn\'t a small feature — Gong built it over two years. A 2-week version doesn\'t solve Meridian\'s problem and creates expectation debt.' },
          ]}
          conceptId="portfolio-systems-thinking"
        />

        <QuizEngine
          conceptId="portfolio-systems-thinking"
          conceptName="Portfolio-Level Systems Thinking"
          moduleContext="Priya has 4 engineers and 3 committed Q2 bets. Rohan wants to add the Meridian bet. The cascade is real."
          staticQuiz={{
            conceptId: 'portfolio-systems-thinking',
            question: QUIZZES[2].question,
            options: QUIZZES[2].options,
            correctIndex: QUIZZES[2].correctIndex,
            explanation: QUIZZES[2].explanation,
            keyInsight: QUIZZES[2].keyInsight,
          }}
        />
      </ChapterSection>

      {/* ── SECTION 4: Kill Criteria ─────────────────────────────── */}
      <ChapterSection id="m2a-kill-criteria" num="04" accentRgb={ACCENT_RGB}>
        {h2(<>Stopping Something You&apos;ve Already Started</>)}

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          The portfolio decision surfaces another problem. While reviewing Q2, Priya realizes: AI Call Summarization has been 60% built for six weeks. Customer interviews show low willingness to pay. The team has 6 weeks left to finish it. Nobody wants to be the person who says stop.
        </SituationCard>

        {para(<>The sunk cost fallacy is the most common reason good PMs ship features nobody uses. &ldquo;We&apos;ve already invested so much&rdquo; is not a criterion. Kill decisions require a framework — not because the math is hard, but because the politics are.</>)}

        <ConversationScene
          mentor="rohan" name="Rohan" role="CEO · EdSpark" accent="#E67E22"
          lines={[
            { speaker: 'other', text: "We\u2019ve already sunk $150,000 into this. I don\u2019t care if the willingness to pay is low \u2014 we can\u2019t just abandon it." },
            { speaker: 'priya', text: "The $150,000 is gone whether we ship it or not. The question is what the next six weeks should produce." },
            { speaker: 'other', text: "That\u2019s easy to say. The team will feel like failures if we kill it at 60% built." },
            { speaker: 'priya', text: "Or we tell them the truth: what they built taught us what customers don\u2019t actually need. That\u2019s not waste \u2014 that\u2019s discovery. Let me walk you through the kill criteria." },
          ]}
        />

        {para(<>Rohan is expressing a human instinct, not a business logic. The $150,000 is gone whether EdSpark ships the feature or not. The only question on the table is what the next 6 weeks should produce. Answer the five kill criteria below — then let the framework make the case.</>)}

        <Section4Mockup />

        <ConversationScene
          mentor="kiran" name="Kiran" role="Data Analyst · EdSpark" accent="#0097A7"
          lines={[
            { speaker: 'other', text: "I ran the numbers. Users who activate any call feature have 12% better 30-day retention \u2014 but that\u2019s correlation with call recording, not summarization specifically." },
            { speaker: 'priya', text: "So we can\u2019t attribute the retention lift to summarization. We\u2019re missing the counterfactual." },
            { speaker: 'other', text: "Right. We need users who use call recording but not summarization to know if summarization is doing anything on its own. We don\u2019t have that cohort yet." },
            { speaker: 'priya', text: "Then we don\u2019t have the evidence to justify six more weeks. That\u2019s the answer Rohan needs to hear." },
          ]}
        />

        {pullQuote("A kill decision is not admitting failure. It's reallocating future capacity to something that earns it.")}

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Gong didn&apos;t build AI summarization either. So who told EdSpark this was a must-have?</>}
          expandedContent={<>Kill decisions often fail because the PM is trying to prove the feature wasn&apos;t a mistake — instead of asking whether the next 6 weeks should be spent on it. The framework you just ran makes the question concrete: kill criteria aren&apos;t a verdict on the past, they&apos;re an allocation decision about the future. The 60% already built is context, not evidence.</>}
          question="The kill criteria framework says 4/5 point toward killing the feature. Rohan still wants to ship it. What does Priya do?"
          options={[
            { text: 'Defer to Rohan — he has visibility into customer relationships she doesn\'t', correct: false, feedback: 'Visibility into relationships doesn\'t override willingness-to-pay data, ICP misalignment, or opportunity cost. Deferring without presenting the framework means the decision will be repeated for the next 60%-built feature.' },
            { text: 'Present the framework outcome and the opportunity cost explicitly, then let Rohan decide with full information', correct: true, feedback: 'The PM\'s job is to surface the framework result and the alternative use of those 6 weeks — specifically, the forecasting feature waiting for those same engineers. Rohan can still choose to ship; he just has to choose with the tradeoff visible.' },
            { text: 'Kill it unilaterally — the framework is clear and the PM owns the roadmap', correct: false, feedback: 'Unilateral kills of $150K investments without CEO alignment create trust problems that outlast the feature. The framework gives Priya the argument — it doesn\'t give her the authority to bypass the conversation.' },
            { text: 'Reduce scope to a 1-week MVP version to recover some value from the investment', correct: false, feedback: 'Scope reduction doesn\'t fix the WTP problem or the ICP misalignment. A 1-week MVP of a feature with no validated demand is still a feature with no validated demand — shipped faster.' },
          ]}
          conceptId="kill-criteria"
        />

        <QuizEngine
          conceptId="kill-criteria"
          conceptName="Kill Criteria and Resource Reallocation"
          moduleContext="AI Call Summarization is 60% built with low WTP. 6 weeks remain. Rohan is resistant. The sunk cost fallacy is in the room."
          staticQuiz={{
            conceptId: 'kill-criteria',
            question: QUIZZES[3].question,
            options: QUIZZES[3].options,
            correctIndex: QUIZZES[3].correctIndex,
            explanation: QUIZZES[3].explanation,
            keyInsight: QUIZZES[3].keyInsight,
          }}
        />
      </ChapterSection>

      {/* ── SECTION 5: Series B Narrative ────────────────────────── */}
      <ChapterSection id="m2a-series-b-narrative" num="05" accentRgb={ACCENT_RGB}>
        {h2(<>The Story Investors Fund Is Not the Story You Think It Is</>)}

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Six weeks after the Meridian crisis. Priya held the line. The forecasting feature shipped. Meridian churned — but EdSpark&apos;s SMB NPS hit 76 and renewal rate climbed to 96%. Now Rohan is building the Series B deck. He asks Priya: &ldquo;What&apos;s our story?&rdquo;
        </SituationCard>

        {para(<>A Series B raise is not a growth story — any decent company growing 2× YoY has a growth story. Series B investors are buying a thesis about why one company owns a category. The narrative that gets a term sheet is the one that explains defensibility, not just velocity.</>)}

        <ConversationScene
          mentor="kiran" name="Kiran" role="Data Analyst · EdSpark" accent="#0097A7"
          lines={[
            { speaker: 'other', text: "If we lead with growth metrics, investors will ask what stops Gong from copying our features and outspending us in sales. Our $3.2M ARR doesn\u2019t answer that question." },
            { speaker: 'priya', text: "What does answer it?" },
            { speaker: 'other', text: "Our CRM switching cost data. Average tenure of a churned customer: 2.8 months. Average tenure of a customer with full CRM sync: 19 months. That\u2019s the moat, not the feature set." },
            { speaker: 'priya', text: "So the Series B story isn\u2019t \u2018we grew fast\u2019 \u2014 it\u2019s \u2018we grew precisely, into a segment where leaving us is operationally painful.\u2019" },
          ]}
        />

        {para(<>Three narrative framings are on the table. Each one is true — EdSpark grew fast, the TAM is large, and customers love the product. But only one of them is a Series B thesis. Try all three below before deciding.</>)}

        <Section5Mockup />

        {keyBox('What makes a Series B narrative defensible', [
          'A specific theory of why you win — not just where you compete',
          'A moat that compounds over time (switching costs, data, network effects)',
          'A crisp path from current ARR to Series B target that a board can pressure-test',
          'Evidence that your best customers cannot easily leave — not just that they\'re happy',
        ])}

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Are you telling investors why EdSpark grows — or why EdSpark wins?</>}
          expandedContent={<>Growth tells investors you&apos;ve found something. Defensibility tells them you can keep it. The narrative framer above shows the difference: growth and TAM stories invite the question "why can't Gong do this?" — and you don't have a good answer if you're competing on features. The category leadership framing works because it centers on the switching cost moat — CRM-integrated coaching workflows that are too painful to rebuild on a competitor's platform. That's a thesis. The others are metrics.</>}
          question="EdSpark's Series B deck leads with CRM switching costs as the primary moat. An investor asks: 'What happens when Gong builds CRM depth?' How does Priya answer?"
          options={[
            { text: 'EdSpark will have 18 months of compounding data advantage that Gong can\'t acquire quickly', correct: false, feedback: 'Data moats are real but fragile — Gong has 4,000 customers feeding their AI. This argument puts EdSpark in a race it\'s already behind in.' },
            { text: 'By then EdSpark will have expanded into RevOps, creating a broader platform moat', correct: false, feedback: 'Platform expansion as a defensive answer signals the current moat isn\'t durable. Investors hear: "we\'re going to run from Gong into a market we\'re not yet in."' },
            { text: 'EdSpark targets SMB sales teams — CRM depth in that segment is a different build from Gong\'s enterprise focus', correct: true, feedback: 'Segment specificity is the answer. Gong is built for enterprise; their CRM complexity is different from SMB workflows. EdSpark\'s moat is deep in the segment that Gong doesn\'t prioritize — that\'s a durable answer because it\'s structural, not a feature race.' },
            { text: 'EdSpark will accelerate the Salesforce integration to widen the switching cost gap first', correct: false, feedback: 'Accelerating a single integration is a feature response, not a strategic answer. It says "we\'ll move faster" not "we\'re structurally different." Investors fund structural advantage, not execution speed alone.' },
          ]}
          conceptId="series-b-narrative"
        />

        <QuizEngine
          conceptId="series-b-narrative"
          conceptName="Series B Narrative Strategy"
          moduleContext="EdSpark has $3.2M ARR, 96% renewal, NPS 76. Three narrative framings for Series B. One is a thesis investors write checks for."
          staticQuiz={{
            conceptId: 'series-b-narrative',
            question: QUIZZES[4].question,
            options: QUIZZES[4].options,
            correctIndex: QUIZZES[4].correctIndex,
            explanation: QUIZZES[4].explanation,
            keyInsight: QUIZZES[4].keyInsight,
          }}
        />

        <NextChapterTeaser text="Next up: Problem Discovery — where strategy meets the real, messy world of users, and the gap between what they say and what they actually do." />
      </ChapterSection>

    </article>
  );
}

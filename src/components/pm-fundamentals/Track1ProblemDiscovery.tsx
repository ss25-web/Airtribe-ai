'use client';

import React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizEngine from '../QuizEngine';
import {
  glassCard, demoLabel, chLabel, h2, para, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, ApplyItBox, PMPrincipleBox, NextChapterTeaser,
} from './designSystem';

// Local helper for rich-content key boxes (keyBox only accepts string[])
const InfoBox = ({ title, accent = 'var(--teal)', children }: { title: string; accent?: string; children: React.ReactNode }) => (
  <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '20px 24px', margin: '24px 0', border: '1px solid var(--ed-rule)', borderLeft: `4px solid ${accent}` }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: accent, marginBottom: '14px' }}>{title}</div>
    {children}
  </div>
);

const MODULE_CONTEXT = `Module 02 of Airtribe PM Fundamentals — Track: New to PM.
Continues with Priya Sharma, PM at EdSpark (B2B SaaS for sales coaching). Covers: user discovery mindset, customer segmentation, Jobs to Be Done, research methods (interviews vs analytics), running good user interviews, insight synthesis, and writing a discovery brief.`;

const QUIZZES = [
  {
    question: "Your manager says 'Users are confused — fix it.' What's your first move?",
    options: [
      'A. Redesign the confusing section based on your best guess',
      'B. Go talk to 5–6 users who experienced confusion before deciding anything',
      'C. Run a survey to all users asking what they find confusing',
      'D. Ask design to run a usability test on the current flow',
    ],
    correctIndex: 1,
    explanation: "'Confused' is a symptom. You don't know yet where, who, when, or why. Talking to 5–6 actual users who experienced the issue gives you specificity — fast. A survey at this stage only tells you opinions, not root causes.",
    conceptId: 'user-research',
    keyInsight: 'Start with conversations, not solutions. Five real conversations beat fifty survey responses when you don\'t yet know what to ask.',
  },
  {
    question: "EdSpark has 500 users. You need to understand why some churn. Who do you interview?",
    options: [
      'A. The 10 most active users — they know the product best',
      'B. A random sample of 20 users to avoid bias',
      'C. Users who churned in the past 2 weeks — they remember why they left',
      'D. Enterprise customers — they pay the most',
    ],
    correctIndex: 2,
    explanation: "Research is about answering a specific question. If the question is 'why do users churn?', you talk to churned users — while it's still fresh. Active users can't tell you why others left. Enterprise customers are a different segment entirely.",
    conceptId: 'customer-segments',
    keyInsight: 'Match your research participants to your research question. The wrong respondents give you the wrong insights.',
  },
  {
    question: "You want to understand users' core motivations for using EdSpark. Which method fits?",
    options: [
      'A. A/B test two onboarding flows',
      'B. Analyse session recordings from the last 30 days',
      'C. 1:1 open-ended user interviews',
      'D. An NPS survey sent to all users',
    ],
    correctIndex: 2,
    explanation: "A/B tests tell you which performs better — not why. Session recordings show behaviour, not motivation. NPS shows satisfaction at a point in time. 1:1 interviews are the only method that lets you follow threads: 'Tell me more about that...' Motivation requires conversation.",
    conceptId: 'research-methods',
    keyInsight: 'Match the method to the question. Interviews for motivation and context. Analytics for scale and patterns. Use both together.',
  },
  {
    question: "During an interview you ask: 'Would you use a daily digest email feature?' What's wrong with this?",
    options: [
      "A. Nothing — it's important to validate features with users",
      'B. It\'s a leading question that tells you nothing — people say yes to hypotheticals',
      'C. The question is too narrow; ask about all email preferences',
      'D. You should show a prototype first before asking',
    ],
    correctIndex: 1,
    explanation: "Asking users if they'd use a hypothetical feature almost always gets a 'yes' — because agreeing is easy and costs nothing. What people say they'll do and what they actually do are very different. Instead, ask: 'Tell me about the last time you wanted to share results with your team. What did you do?'",
    conceptId: 'user-research',
    keyInsight: "Ask about past behaviour, not hypothetical intent. 'Tell me about the last time...' beats 'Would you use...' every time.",
  },
  {
    question: "A user says: 'I just want to find things faster.' As a PM, what does this tell you?",
    options: [
      'A. Build a better search — speed is the job',
      'B. That speed is a signal, not the job — keep asking why until you find what they\'re actually trying to accomplish',
      'C. Run an experiment on load time to test the hypothesis',
      'D. Add a keyboard shortcut for power users',
    ],
    correctIndex: 1,
    explanation: "'Find things faster' is a means, not an end. Faster to do what? Find which things? For what purpose? The job might be 'prep for a coaching call in under 5 minutes' or 'prove ROI to my manager before Friday.' Two very different jobs — and two very different solutions.",
    conceptId: 'jtbd',
    keyInsight: "Every feature request hides the real job. Keep asking why until you hit an outcome that matters to the user's life.",
  },
  {
    question: "After 8 user interviews you have 40 handwritten notes. What do you do next?",
    options: [
      'A. Write up each interview as a separate report',
      'B. Find the quote that best proves your original hypothesis',
      'C. Group notes by theme across all interviews, not by user',
      'D. Share all raw notes with the team and let them decide',
    ],
    correctIndex: 2,
    explanation: "Grouping by user hides patterns. Grouping by theme reveals them. You're looking for themes that appear across multiple users — those are real signals. A single user mentioning something might be noise. Four out of eight saying the same thing is an insight.",
    conceptId: 'insight-synthesis',
    keyInsight: 'Patterns across users are insights. One user\'s opinion is a data point. Group by theme to find what really matters.',
  },
  {
    question: "You've finished your research. How do you present the findings to your team?",
    options: [
      "A. 'I think we should redesign the onboarding — here's my plan'",
      "B. 'We discovered that new users struggle to complete their first setup because they don't understand what the product does for them in context of their actual work'",
      "C. 'Six users gave feedback — here are their quotes'",
      "D. 'The research was inconclusive — we need more interviews'",
    ],
    correctIndex: 1,
    explanation: "Research findings should be framed as discoveries, not opinions — and definitely not as solutions. Your job at this stage is to get the team to understand the problem, not to pitch a fix. When you present the problem clearly, the team finds better solutions than you would alone.",
    conceptId: 'problem-framing',
    keyInsight: "Present what you learned, not what you think should be built. A clear problem statement is more powerful than a premature solution.",
  },
];

// ─────────────────────────────────────────
// INTERACTIVE 1: RESEARCH METHOD CHOOSER
// ─────────────────────────────────────────
const RESEARCH_SCENARIOS = [
  {
    scenario: "You want to know WHY 40% of new users churn in week 1.",
    methods: [
      { label: 'User interviews', fit: 'Best fit', color: 'var(--green)', rgb: '21,129,88', reason: "You don't know what to look for yet. Interviews let you follow unexpected threads. They're the best tool when the question is open-ended." },
      { label: 'Session recordings', fit: 'Useful but partial', color: 'var(--blue)', rgb: '58,134,255', reason: "Shows what users do, not why they leave. Use after interviews to confirm patterns you already discovered." },
      { label: 'Exit survey', fit: 'Weak signal', color: 'var(--coral)', rgb: '224,122,95', reason: "Users fill these after they've already decided to leave. Responses are often vague ('not what I needed'). Better than nothing, but not enough on its own." },
    ],
  },
  {
    scenario: "You want to know which of two onboarding flows converts better.",
    methods: [
      { label: 'A/B test', fit: 'Best fit', color: 'var(--green)', rgb: '21,129,88', reason: "You have a clear success metric (conversion rate) and enough traffic to get statistical significance. This is exactly what A/B tests are built for." },
      { label: 'User interviews', fit: 'Wrong tool', color: 'var(--coral)', rgb: '224,122,95', reason: "Interviews give you opinions, not outcomes. People's stated preferences often don't predict their actual behaviour. Test it instead." },
      { label: 'Funnel analytics', fit: 'Useful signal', color: 'var(--blue)', rgb: '58,134,255', reason: "Shows where the drop-off happens but not which variant wins. Combine with the A/B test, don't replace it." },
    ],
  },
  {
    scenario: "You want to understand what 'job' users hire EdSpark to do.",
    methods: [
      { label: 'JTBD interviews', fit: 'Best fit', color: 'var(--green)', rgb: '21,129,88', reason: "Ask users to walk you through their decision to start using EdSpark. The moment of 'switch' reveals the job. You can't get this from data alone." },
      { label: 'NPS survey', fit: 'Wrong tool', color: 'var(--coral)', rgb: '224,122,95', reason: "NPS tells you how satisfied users are — not what job they hired the product to do. These are different questions." },
      { label: 'Usage analytics', fit: 'Partial context', color: 'var(--blue)', rgb: '58,134,255', reason: "Analytics show what features users touch, which hints at the job. But it's indirect — two users touching the same feature might have completely different jobs." },
    ],
  },
];

const ResearchMethodChooser = () => {
  const [activeScenario, setActiveScenario] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const scenario = RESEARCH_SCENARIOS[activeScenario];

  const reveal = (key: string) => setRevealed(r => ({ ...r, [key]: true }));

  return (
    <div style={glassCard('var(--teal)', '0,151,167')}>
      {demoLabel('Match the research method to the question', 'var(--teal)')}

      {/* Scenario tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {RESEARCH_SCENARIOS.map((s, i) => (
          <button key={i} onClick={() => { setActiveScenario(i); setRevealed({}); }}
            style={{ padding: '6px 12px', borderRadius: '7px', fontSize: '11px', fontWeight: i === activeScenario ? 700 : 400, border: `2px solid ${i === activeScenario ? 'var(--teal)' : 'var(--ed-rule)'}`, background: i === activeScenario ? 'rgba(0,151,167,0.1)' : 'var(--ed-card)', color: i === activeScenario ? 'var(--teal)' : 'var(--ed-ink3)', cursor: 'pointer', transition: 'all 0.18s' }}>
            Scenario {i + 1}
          </button>
        ))}
      </div>

      {/* Scenario description */}
      <div style={{ padding: '14px 18px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', marginBottom: '20px', fontSize: '14px', fontStyle: 'italic', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        &ldquo;{scenario.scenario}&rdquo;
      </div>

      {/* Methods */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {scenario.methods.map((m, i) => {
          const key = `${activeScenario}-${i}`;
          const isRevealed = revealed[key];
          return (
            <motion.button key={key} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}
              onClick={() => reveal(key)}
              style={{ padding: '14px 18px', borderRadius: '12px', border: `2px solid ${isRevealed ? m.color : 'rgba(0,151,167,0.18)'}`, background: isRevealed ? `rgba(${m.rgb},0.06)` : 'var(--ed-card)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isRevealed ? '8px' : 0 }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ed-ink)' }}>{m.label}</span>
                {isRevealed && <span style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 800, color: m.color, letterSpacing: '0.1em' }}>{m.fit.toUpperCase()}</span>}
              </div>
              <AnimatePresence>
                {isRevealed && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>{m.reason}</div>
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
// INTERACTIVE 2: INTERVIEW QUESTION QUALITY
// ─────────────────────────────────────────
const INTERVIEW_QS = [
  {
    question: '"Would you use a feature that automatically organises your call recordings?"',
    verdict: 'Avoid',
    verdictColor: 'var(--coral)',
    why: "Hypothetical. Users say 'yes' to things they'll never use. This tells you nothing about actual behaviour.",
    better: '"Tell me about the last time you went looking for a specific call recording. What happened?"',
  },
  {
    question: '"Tell me about the last time you had to prepare for a coaching session. What did you do?"',
    verdict: 'Great',
    verdictColor: 'var(--green)',
    why: "Past behaviour is real. This opens a story — and stories contain the jobs, workarounds, and pain points you're looking for.",
    better: null,
  },
  {
    question: '"Don\'t you find the current search frustrating?"',
    verdict: 'Avoid',
    verdictColor: 'var(--coral)',
    why: "Leading. You're suggesting the answer. Users will often agree just to be polite — giving you confirmation bias, not insight.",
    better: '"How do you typically find what you\'re looking for in EdSpark?"',
  },
  {
    question: `"What\u2019s the hardest part of your job right now?"`,
    verdict: 'Great',
    verdictColor: 'var(--green)',
    why: "Broad, open, non-leading. The answer might surprise you — and surprises are the most valuable thing research can give you.",
    better: null,
  },
  {
    question: '"On a scale of 1–5, how satisfied are you with EdSpark?"',
    verdict: 'Context-dependent',
    verdictColor: 'var(--blue)',
    why: "Useful for benchmarking, not for discovery. A '3' tells you almost nothing. Only useful if followed up with 'Tell me more about that...'",
    better: null,
  },
];

const InterviewQuality = () => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <div style={glassCard('var(--purple)', '120,67,238')}>
      {demoLabel('Good question or one to avoid? Tap to see why.', 'var(--purple)')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {INTERVIEW_QS.map((item, i) => {
          const isRevealed = revealed[i];
          return (
            <motion.button key={i} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}
              onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
              style={{ padding: '16px 18px', borderRadius: '12px', border: `2px solid ${isRevealed ? item.verdictColor : 'rgba(120,67,238,0.18)'}`, background: isRevealed ? 'var(--ed-card)' : 'var(--ed-card)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--ed-ink2)', lineHeight: 1.6, marginBottom: isRevealed ? '10px' : 0 }}>{item.question}</div>
              <AnimatePresence>
                {isRevealed && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 800, color: item.verdictColor, letterSpacing: '0.12em', marginBottom: '8px' }}>{item.verdict.toUpperCase()}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7, marginBottom: item.better ? '10px' : 0 }}>{item.why}</div>
                    {item.better && (
                      <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(21,129,88,0.07)', border: '1px solid rgba(21,129,88,0.2)', borderLeft: '3px solid var(--green)' }}>
                        <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--green)', letterSpacing: '0.12em', marginBottom: '5px' }}>TRY INSTEAD</div>
                        <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', fontStyle: 'italic', lineHeight: 1.6 }}>{item.better}</div>
                      </div>
                    )}
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
// INTERACTIVE 3: JTBD MATCHER
// ─────────────────────────────────────────
const JTBD_ITEMS = [
  {
    quote: '"I need to quickly prep for my 2pm coaching call without digging through old recordings."',
    job: 'Fast context retrieval before a call',
    notJob: 'Organising recordings',
    explanation: "The urgency and the time-bound nature reveal the real job: speed + recency, not organisation. A good search or 'recent calls' view solves this — a folder system does not.",
  },
  {
    quote: '"My manager wants to see proof that the coaching programme is working."',
    job: 'Build credibility with leadership using data',
    notJob: 'Better reporting features',
    explanation: "This person doesn't want a report — they want to look good to their manager. The job is political and social: demonstrating impact. The product needs to make that easy, not just produce data.",
  },
  {
    quote: '"I want to share this call snippet with the new hire so they can learn faster."',
    job: 'Accelerate team learning through examples',
    notJob: 'Sharing / collaboration',
    explanation: "Generic 'sharing' misses the job. This is about mentoring, not communication. The product should surface clips that make for good teaching moments — not just send a link.",
  },
];

const JTBDMatcher = () => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <div style={glassCard('var(--coral)', '224,122,95')}>
      {demoLabel("What's the real job? Tap to reveal.", 'var(--coral)')}
      <div style={{ marginBottom: '14px', fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>
        Users say what they want. PMs listen for what they're actually trying to accomplish.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {JTBD_ITEMS.map((item, i) => {
          const isRevealed = revealed[i];
          return (
            <motion.button key={i} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}
              onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
              style={{ padding: '16px 18px', borderRadius: '12px', border: `2px solid ${isRevealed ? 'var(--coral)' : 'rgba(224,122,95,0.2)'}`, background: 'var(--ed-card)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--ed-ink)', lineHeight: 1.6, marginBottom: isRevealed ? '12px' : 0 }}>&ldquo;{item.quote}&rdquo;</div>
              <AnimatePresence>
                {isRevealed && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(21,129,88,0.08)', border: '1px solid rgba(21,129,88,0.2)' }}>
                        <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--green)', letterSpacing: '0.1em', marginBottom: '5px' }}>THE JOB</div>
                        <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', fontWeight: 600, lineHeight: 1.5 }}>{item.job}</div>
                      </div>
                      <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(224,122,95,0.07)', border: '1px solid rgba(224,122,95,0.2)' }}>
                        <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--coral)', letterSpacing: '0.1em', marginBottom: '5px' }}>NOT THE JOB</div>
                        <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', fontWeight: 600, lineHeight: 1.5 }}>{item.notJob}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>{item.explanation}</div>
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
// INTERACTIVE 4: INSIGHT OR OPINION?
// ─────────────────────────────────────────
const INSIGHT_ITEMS = [
  { statement: '"Users probably find the dashboard confusing because it has too many options."', type: 'Opinion', color: 'var(--coral)', explanation: "No evidence. 'Probably' and 'I think' are opinion markers. This might feel true but it's just a hypothesis." },
  { statement: '"5 of 8 interviewed users couldn\'t complete account setup without asking for help."', type: 'Insight', color: 'var(--green)', explanation: "Specific, observable, and reproducible. 5/8 is a meaningful signal. This came from actual user sessions, not inference." },
  { statement: '"I think the main problem is that users don\'t understand our value prop."', type: 'Opinion', color: 'var(--coral)', explanation: "This is a hypothesis, not a finding. It might be right — but you need evidence. Have users told you this directly?" },
  { statement: '"Every interviewed user mentioned looking for recordings from specific sales reps, not dates."', type: 'Insight', color: 'var(--green)', explanation: "Unprompted and consistent across all users. That's a pattern. It directly implies the current search (by date) doesn't match how users think." },
  { statement: '"Users want more integrations — it came up in customer support tickets."', type: 'Partial insight', color: 'var(--blue)', explanation: "Support tickets are a real signal, but they over-represent users who had a problem. You don't know if this is 2% of users or 80%. Validate with research before acting." },
];

const InsightOrOpinion = () => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <div style={glassCard('var(--blue)', '58,134,255')}>
      {demoLabel('Insight, opinion, or in between? Tap to reveal.', 'var(--blue)')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {INSIGHT_ITEMS.map((item, i) => {
          const isRevealed = revealed[i];
          return (
            <motion.button key={i} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}
              onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
              style={{ padding: '14px 18px', borderRadius: '12px', border: `2px solid ${isRevealed ? item.color : 'rgba(58,134,255,0.2)'}`, background: 'var(--ed-card)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: isRevealed ? '10px' : 0 }}>{item.statement}</div>
              <AnimatePresence>
                {isRevealed && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 800, color: item.color, letterSpacing: '0.12em', marginBottom: '7px' }}>{item.type.toUpperCase()}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>{item.explanation}</div>
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
// INTERACTIVE 5: DISCOVERY BRIEF BUILDER
// ─────────────────────────────────────────
const BRIEF_OPTIONS = {
  segment: {
    label: 'Who is affected?',
    options: [
      'New users in their first 2 weeks',
      'Sales managers reviewing team performance',
      'Power users with 50+ saved recordings',
    ],
  },
  behaviour: {
    label: 'What are they trying to do?',
    options: [
      'understand the product well enough to complete their first setup',
      'find coaching insights from specific team members quickly',
      'track whether their coaching efforts are improving rep performance',
    ],
  },
  barrier: {
    label: 'What gets in the way?',
    options: [
      'the onboarding doesn\'t connect the product to their real workflow',
      'search only works by date, not by rep or keyword',
      'there\'s no way to filter results by outcome or improvement over time',
    ],
  },
} as const;
type BriefField = keyof typeof BRIEF_OPTIONS;

const DiscoveryBriefBuilder = () => {
  const [sel, setSel] = useState<Partial<Record<BriefField, string>>>({});
  const order: BriefField[] = ['segment', 'behaviour', 'barrier'];
  const currentStep = order.find(f => !sel[f]) ?? null;
  const done = order.every(f => sel[f]);

  const pick = (field: BriefField, val: string) => setSel(s => ({ ...s, [field]: val }));
  const reset = () => setSel({});

  return (
    <div style={glassCard('var(--teal)', '0,151,167')}>
      {demoLabel('Build a discovery brief — the output of good research', 'var(--teal)')}

      {/* Live brief */}
      <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', marginBottom: '20px', fontSize: '14px', lineHeight: 1.9, color: 'var(--ed-ink2)' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>DISCOVERY BRIEF</span>
        <span style={{ color: sel.segment ? 'var(--ed-ink)' : 'var(--ed-ink3)', fontStyle: sel.segment ? 'normal' : 'italic', fontWeight: sel.segment ? 600 : 400 }}>{sel.segment ?? '[ who is affected ]'}</span>
        {' are trying to '}
        <span style={{ color: sel.behaviour ? 'var(--ed-ink)' : 'var(--ed-ink3)', fontStyle: sel.behaviour ? 'normal' : 'italic', fontWeight: sel.behaviour ? 600 : 400 }}>{sel.behaviour ?? '[ do what ]'}</span>
        {', but '}
        <span style={{ color: sel.barrier ? 'var(--ed-ink)' : 'var(--ed-ink3)', fontStyle: sel.barrier ? 'normal' : 'italic', fontWeight: sel.barrier ? 600 : 400 }}>{sel.barrier ?? '[ what gets in the way ]'}</span>
        {done ? '.' : ' …'}
      </div>

      {/* Step chooser */}
      {!done && currentStep && (
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ed-ink2)', marginBottom: '10px' }}>
            Step {order.indexOf(currentStep) + 1} / 3 — {BRIEF_OPTIONS[currentStep].label}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {BRIEF_OPTIONS[currentStep].options.map((opt, i) => (
              <motion.button key={i} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                onClick={() => pick(currentStep, opt)}
                style={{ padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(0,151,167,0.22)', background: 'var(--ed-card)', cursor: 'pointer', textAlign: 'left', fontSize: '13px', color: 'var(--ed-ink2)', transition: 'all 0.18s' }}>
                {opt}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ padding: '14px 18px', borderRadius: '10px', background: 'rgba(21,129,88,0.08)', border: '1px solid rgba(21,129,88,0.2)', borderLeft: '4px solid var(--green)', marginBottom: '12px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--green)', letterSpacing: '0.12em', marginBottom: '6px' }}>BRIEF COMPLETE</div>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>
                This is what a discovery brief looks like: a specific user, a specific job, and a specific barrier. From here your team can debate solutions — not whether there's a problem.
              </div>
            </div>
            <motion.button whileHover={{ opacity: 0.8 }} onClick={reset}
              style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ed-ink3)', background: 'none', border: '1px solid var(--ed-rule)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
              Try different choices →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────
// INTRO HERO
// ─────────────────────────────────────────
const IntroHero = () => (
  <section style={{ background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', padding: '48px 0 40px' }}>
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'flex-start', gap: '40px', flexWrap: 'wrap' as const }}>
      <div style={{ flex: 1, minWidth: '280px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--teal)', marginBottom: '12px', textTransform: 'uppercase' as const }}>
          MODULE 02 · PROBLEM DISCOVERY
        </div>
        <h1 style={{ fontFamily: "'Lora', serif", fontSize: '32px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.2, marginBottom: '16px' }}>
          Problem Discovery<br />&amp; User Research
        </h1>
        <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.8, marginBottom: '24px' }}>
          Before you build anything, you need to understand who has the problem, what they&apos;re actually trying to do, and why existing solutions aren&apos;t working. That&apos;s discovery.
        </div>

        {/* Learning objectives */}
        <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'rgba(0,151,167,0.06)', border: '1px solid rgba(0,151,167,0.18)', marginBottom: '24px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.14em', marginBottom: '10px' }}>BY THE END OF THIS MODULE</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '7px' }}>
            {[
              'Know when to research before you build — and what method to use',
              'Run a user interview that gives you real insight, not just polite agreement',
              'Identify the real job a user is trying to get done',
              'Turn messy interview notes into a crisp problem statement',
            ].map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>→</span>
                <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{obj}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '18px 22px', borderRadius: '8px', background: 'var(--ed-card)', borderTop: '1px solid var(--ed-rule)', borderRight: '1px solid var(--ed-rule)', borderBottom: '1px solid var(--ed-rule)', borderLeft: '4px solid var(--teal)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--teal)', textTransform: 'uppercase' as const, marginBottom: '10px' }}>
            How this works
          </div>
          <div style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.8 }}>
            Priya is now three weeks into EdSpark. Her manager just handed her a number: <strong style={{ color: 'var(--ed-ink)' }}>40% of new users churn in two weeks.</strong> Fix it by Friday. She opens Figma. <strong style={{ color: 'var(--ed-ink)' }}>Asha walks by.</strong>
          </div>
        </div>
      </div>

      {/* Module card */}
      <div style={{ flexShrink: 0, width: '168px', paddingTop: '48px' }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <div className="float3d" style={{ transformStyle: 'preserve-3d' }}>
            <div style={{ background: 'linear-gradient(145deg, #0A1A1C 0%, #0D2426 100%)', borderRadius: '14px', padding: '20px 18px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: '#00BCD4', marginBottom: '10px' }}>MODULE 02</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#E8F8FA', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>Problem Discovery</div>
              <div style={{ fontSize: '10px', color: 'rgba(232,248,250,0.45)', marginBottom: '16px' }}>Foundations Track</div>
              <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '14px' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '15%' }} transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }} style={{ height: '100%', background: '#00BCD4', borderRadius: '1px' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[{ val: '6', lbl: 'parts' }, { val: '45', lbl: 'min' }].map(s => (
                  <div key={s.lbl} style={{ flex: 1, padding: '6px 0', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', textAlign: 'center' as const }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#E8F8FA', fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</div>
                    <div style={{ fontSize: '8px', color: 'rgba(232,248,250,0.4)', letterSpacing: '0.08em' }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'linear-gradient(135deg, #7843EE, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.8" strokeLinejoin="round" /><path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </div>
          <span style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', letterSpacing: '0.1em' }}>AIRTRIBE LEARN</span>
        </div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────
export default function Track1ProblemDiscovery() {
  return (
    <>
      <IntroHero />

      {/* ── PART 1: Don't Build Yet ── */}
      <ChapterSection num="01" accentRgb="0,151,167" id="m2-discovery-mindset" first>
        <div className="rv">
          {chLabel('Part 1 · Discovery Mindset', 'var(--teal)')}
          {h2(<>The most expensive thing you can build is the wrong thing</>)}

          <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'rgba(0,151,167,0.06)', border: '1px solid rgba(0,151,167,0.18)', marginBottom: '28px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.14em', marginBottom: '10px' }}>BY THE END OF THIS PART</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '7px' }}>
              {['Understand why discovery comes before building', 'Recognise the difference between a symptom and a root cause', 'Know when you have enough to act — and when you don\'t'].map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          <SituationCard accent="var(--teal)" accentRgb="0,151,167">
            Monday morning. Rohan, EdSpark&apos;s head of product, calls Priya into his office. He pulls up a chart: a 40% drop in users between day 1 and day 14. &ldquo;Fix this,&rdquo; he says. &ldquo;I want a plan by Friday.&rdquo; Priya nods. She walks back to her desk and opens Figma.
          </SituationCard>

          {para(<>She starts wireframing a new onboarding flow. It feels productive. She moves things around. Adds a progress bar. Simplifies a few steps. By lunchtime she has something that looks clean and logical. She&apos;s almost excited to present it.</>)}

          {para(<>Asha leans over. &ldquo;What are you building?&rdquo;</>)}
          {para(<>&ldquo;A better onboarding,&rdquo; Priya says. &ldquo;40% of users churn in two weeks. The onboarding is probably where they drop off.&rdquo;</>)}
          {para(<>Asha looks at the screen. &ldquo;Have you talked to any of those 40%?&rdquo;</>)}
          {para(<>Priya pauses. &ldquo;No. But it seems obvious that onboarding is the issue. Where else would they be dropping?&rdquo;</>)}
          {para(<>Asha pulls up a chair.</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Asha"
            nameColor="var(--purple-light)"
            borderColor="var(--purple)"
            content={<>&ldquo;Here&apos;s what you know: 40% of users don&apos;t come back after two weeks. That&apos;s a symptom. You don&apos;t know yet what causes it — or whether your redesign will help.<br /><br />&ldquo;You&apos;re about to spend three days building a solution to a problem you haven&apos;t defined yet. What happens if the real problem is pricing? Or that users don&apos;t understand how EdSpark fits into their daily workflow? Or that the sales team is promising features that don&apos;t exist?<br /><br />&ldquo;A redesigned onboarding won&apos;t fix any of those.&rdquo;</>}
            expandedContent={<>The discovery phase is uncomfortable because it feels unproductive. You&apos;re not building anything. You&apos;re asking questions, sitting with uncertainty, and resisting the urge to jump to solutions. But this is exactly where the leverage is. The average cost of building a feature based on a wrong assumption is 3–5x more than the cost of a few hours of research. Discovery is the highest-ROI thing a PM does — it&apos;s just harder to show in a Jira ticket.</>}
            conceptId="user-research"
            question="A PM has a hypothesis that slow load times are causing churn. The right first move is:"
            options={[
              { text: "Brief engineering to optimize load times — the data supports it", correct: false, feedback: "Load time might be a factor, but 'might be' isn't enough to brief engineering. Test the hypothesis first with real users before committing resources." },
              { text: "Talk to churned users to understand why they actually left before building anything", correct: true, feedback: "Correct. The hypothesis might be right — but it also might not. User conversations cost hours. An engineering sprint costs weeks. Validate first." },
              { text: "Run an A/B test on the current experience to measure impact", correct: false, feedback: "A/B tests answer 'which performs better' — not 'why are users leaving'. You need qualitative research first to understand the problem." },
            ]}
          />
        </div>

        <div className="rv">
          {para(<>Priya stares at her Figma file. &ldquo;But Rohan wants a plan by Friday. I can&apos;t spend all week talking to users.&rdquo;</>)}
          {para(<>Asha: &ldquo;You don&apos;t need all week. You need five conversations. Six at most. Block two hours today, two hours tomorrow morning. By Wednesday afternoon you&apos;ll know more than any amount of wireframing would tell you.&rdquo;</>)}
          {pullQuote('Build the right thing slowly. Don\'t build the wrong thing fast.', 'var(--teal)')}

          <InfoBox title="The Discovery Principle" accent="var(--teal)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Symptoms', desc: 'What you can observe: churn rate, drop-off, support tickets, NPS' },
                { label: 'Root causes', desc: "Why it's happening: something users don't understand, can't do, or don't value" },
                { label: 'Solutions', desc: 'What you might build — only chosen after you understand the root cause' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ padding: '3px 10px', borderRadius: '20px', background: 'rgba(0,151,167,0.12)', border: '1px solid rgba(0,151,167,0.25)', fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--teal)', flexShrink: 0, whiteSpace: 'nowrap' }}>{item.label}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.6, paddingTop: '3px' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </InfoBox>

          <ResearchMethodChooser />
        </div>
      </ChapterSection>

      {/* ── PART 2: Know Your Users ── */}
      <ChapterSection num="02" accentRgb="120,67,238" id="m2-customer-segments">
        <div className="rv">
          {chLabel('Part 2 · Customer Segments', 'var(--purple)')}
          {h2(<>Not all users are the same problem</>)}

          <SituationCard accent="var(--purple)" accentRgb="120,67,238">
            Priya starts by pulling up the list of churned users. There are 340 of them over the past 30 days. She feels overwhelmed. &ldquo;I can&apos;t interview 340 people.&rdquo; Maya, EdSpark&apos;s designer, rolls her chair over. &ldquo;You don&apos;t need to. First, split them into groups.&rdquo;
          </SituationCard>

          {para(<>Maya pulls up a spreadsheet. She starts dividing the churned users by role: sales reps, sales managers, team leads. Then by company size: solo, small team (2–10), larger org (&gt;50 reps). Then by where they dropped off: some never completed setup; others used the product for a week then stopped; others never invited a teammate.</>)}

          {para(<>&ldquo;These aren&apos;t the same problem,&rdquo; Maya says. &ldquo;A solo sales rep who never completed setup is a different issue than a manager who used EdSpark for a week and then stopped. Build one persona and you get a solution that fits neither of them.&rdquo;</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Maya"
            nameColor="var(--coral)"
            borderColor="var(--coral)"
            content={<>&ldquo;Customer segmentation isn&apos;t about creating marketing personas with stock-photo names. It&apos;s about finding the groups where the problem is actually different.<br /><br />&ldquo;For EdSpark, I&apos;d bet the drop-off at setup completion is a different problem than the drop-off after one week. One is about understanding the product quickly. The other might be about habit formation, or about the product not fitting into their existing workflow.<br /><br />&ldquo;You need to find out which group is larger — and which one is more solvable.&rdquo;</>}
            expandedContent={<>There&apos;s a useful exercise called &apos;Who has this problem most acutely?&apos; For any given issue, some users feel it sharply and some barely notice it. Start by finding the segment that feels the pain most. They&apos;ll give you the clearest signal in research — and solving for them often helps adjacent segments too. This is why B2B products often focus on a single role (e.g. &apos;sales manager&apos;) before expanding: clearer problem, faster signal, easier to measure success.</>}
            conceptId="customer-segments"
            question="You're researching why users churn. Who should you talk to first?"
            options={[
              { text: "Your 10 most engaged users — they understand the product best", correct: false, feedback: "Engaged users can tell you what's working — but not why others leave. They've already solved whatever problem caused churn. Talk to people who left." },
              { text: "Churned users who left in the last 2–3 weeks — the memory is still fresh", correct: true, feedback: "Exactly. Recent churners can tell you why they left while it's still clear. Older churners forget or rationalise differently. Recency matters in research." },
              { text: "A random sample of all users to avoid selection bias", correct: false, feedback: "Random sampling makes sense for quantitative surveys. For qualitative discovery, you want people who actually experienced the problem you're investigating." },
            ]}
          />
        </div>

        <div className="rv">
          {para(<>Priya looks at the segments. The largest group — 180 users — never completed their initial setup. The second group — 110 users — completed setup but churned after 5–7 days. &ldquo;Let&apos;s focus on the first group,&rdquo; she says. &ldquo;It&apos;s bigger and the problem is probably more acute.&rdquo;</>)}
          {para(<>Maya nods. &ldquo;Good. Now — within that group, who should you actually interview?&rdquo;</>)}

          {pullQuote("The right segment is the one where your question has a specific, observable answer.", 'var(--purple)')}

          <InfoBox title="Jobs to Be Done (JTBD)" accent="var(--purple)">
            <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.8 }}>
              Before picking your research segment, ask: <strong>what job did they hire EdSpark to do?</strong><br /><br />
              The &ldquo;job&rdquo; is the progress a user is trying to make in a specific context. Not &ldquo;manage coaching sessions&rdquo; — that&apos;s a feature description. The job might be: &ldquo;help my team improve their close rate so I don&apos;t lose my bonus target.&rdquo; Two managers could use EdSpark for completely different jobs — and need completely different things.
            </div>
          </InfoBox>

          <JTBDMatcher />
        </div>
      </ChapterSection>

      {/* ── PART 3: Choose Your Method ── */}
      <ChapterSection num="03" accentRgb="58,134,255" id="m2-research-methods">
        <div className="rv">
          {chLabel('Part 3 · Research Methods', 'var(--blue)')}
          {h2(<>Pick the right tool for the question you&apos;re asking</>)}

          <SituationCard accent="var(--blue)" accentRgb="58,134,255">
            Priya mentions she&apos;s going to run some research. Kiran, EdSpark&apos;s analyst, immediately pulls up a dashboard. &ldquo;We already have data,&rdquo; he says. &ldquo;Session recordings, funnel analytics, heatmaps. What are you looking for? I can query it.&rdquo; Meanwhile Dev says, &ldquo;I can set up event tracking for whatever you need.&rdquo; Priya looks between them. &ldquo;So... do I even need to talk to users?&rdquo;
          </SituationCard>

          {para(<>Asha, who&apos;s been listening from across the room: &ldquo;Yes. Analytics tell you what happened. Users tell you why.&rdquo;</>)}
          {para(<>Kiran raises an eyebrow. &ldquo;Data doesn&apos;t lie.&rdquo; Asha: &ldquo;Data doesn&apos;t lie — but it also doesn&apos;t explain itself. You can see that 40% of users drop off at step 3. You cannot see whether it&apos;s because step 3 is confusing, because they got interrupted, or because they realised they signed up for the wrong product.&rdquo;</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Kiran"
            nameColor="var(--teal)"
            borderColor="var(--teal)"
            content={<>&ldquo;Fair. Here&apos;s what I actually use analytics for: to scope the problem before research, and to validate hypotheses after it.<br /><br />&ldquo;Before: look at where drop-off happens, which segments are affected most, what actions users take before they leave. This gives you a hypothesis to test — and helps you ask better interview questions.<br /><br />&ldquo;After: once you have a theory from research, you use analytics to check if it holds at scale. 'Five users told me X' + 'the data shows 70% of churned users never did Y' — that&apos;s a strong signal.&rdquo;</>}
            expandedContent={<>The research stack at a well-run product team: Interviews (qualitative) → Insight. Analytics (quantitative) → Scale. Session recordings → Behaviour patterns. A/B tests → Causality. Surveys → Broad signal at scale. Most teams over-index on surveys and analytics — and under-invest in actual conversations. The result is lots of what and almost no why. Use both. Start with conversations when the problem is fuzzy. Use data to confirm what you found — or to find the next fuzzy problem.</>}
            conceptId="research-methods"
            question="Your analytics show users drop off at step 3 of 5 in onboarding. What do you do next?"
            options={[
              { text: "Redesign step 3 — the data clearly shows that's where the problem is", correct: false, feedback: "Data shows where drop-off happens, not why. Users might be dropping at step 3 because step 2 confused them. Talk to users before redesigning." },
              { text: "Talk to 5 users who dropped off at step 3 to understand what went wrong at that moment", correct: true, feedback: "Right. The analytics give you a hypothesis: something happens at step 3. Now test it with conversations. 'Walk me through what happened when you were setting up EdSpark.' Then listen." },
              { text: "Run an A/B test on step 3 to see which version converts better", correct: false, feedback: "A/B tests are great for validating fixes — but you don't know what to fix yet. Build the hypothesis with research first, then test with data." },
            ]}
          />
        </div>

        <div className="rv">
          {para(<>Dev leans forward. &ldquo;So what&apos;s the research plan? I can help instrument whatever you need to measure.&rdquo;</>)}
          {para(<>Priya thinks about it. &ldquo;I&apos;ll start with 6 user interviews — churned users who never completed setup. I want to understand why in their own words. Then I&apos;ll look at the analytics to see if what they tell me shows up in the data.&rdquo;</>)}
          {para(<>Asha smiles. &ldquo;That&apos;s the right order. Qualitative first to build the hypothesis. Quantitative to test it.&rdquo;</>)}

          {pullQuote("Qualitative research finds the why. Quantitative research checks if the why is widespread.", 'var(--blue)')}

          <InfoBox title="Research Methods Overview" accent="var(--blue)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { method: 'User interviews', best: 'Why do users behave this way?', limit: 'Small sample, not statistically significant' },
                { method: 'Funnel analytics', best: 'Where do users drop off at scale?', limit: 'Shows what, not why' },
                { method: 'Session recordings', best: 'Exactly where do users get confused?', limit: 'Behaviour without context or motivation' },
                { method: 'Surveys', best: 'Broad patterns across many users', limit: 'Only as good as your questions; no follow-ups' },
                { method: 'A/B tests', best: 'Does change X improve metric Y?', limit: 'Requires traffic, time, and a clear hypothesis first' },
              ].map(row => (
                <div key={row.method} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr', gap: '10px', alignItems: 'start', fontSize: '12px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--ed-ink)', fontFamily: 'monospace', fontSize: '11px' }}>{row.method}</div>
                  <div style={{ color: 'var(--green)', lineHeight: 1.5 }}>✓ {row.best}</div>
                  <div style={{ color: 'var(--ed-ink3)', lineHeight: 1.5 }}>✗ {row.limit}</div>
                </div>
              ))}
            </div>
          </InfoBox>

          <InsightOrOpinion />
        </div>
      </ChapterSection>

      {/* ── PART 4: Run the Interview ── */}
      <ChapterSection num="04" accentRgb="224,122,95" id="m2-interview">
        <div className="rv">
          {chLabel('Part 4 · The Interview', 'var(--coral)')}
          {h2(<>How to ask questions that give you real answers</>)}

          <SituationCard accent="var(--coral)" accentRgb="224,122,95">
            Tuesday morning. Priya has her first user interview scheduled: Rahul, a sales rep who signed up for EdSpark two weeks ago and never came back after day 3. She&apos;s nervous. She&apos;s prepared 20 questions. Asha looks at the list and sighs.
          </SituationCard>

          {para(<>&ldquo;You only need five questions,&rdquo; Asha says. &ldquo;Actually, you only need one: &apos;Tell me what happened when you first signed up.&apos; Then just follow the story.&rdquo;</>)}
          {para(<>&ldquo;But what if they don&apos;t mention the things I care about?&rdquo;</>)}
          {para(<>&ldquo;Then maybe those things don&apos;t matter to them as much as you thought. That&apos;s a valuable insight too.&rdquo;</>)}
          {para(<>Priya does the interview. She makes three mistakes in the first ten minutes:</>)}
          {para(<>First, she asks: &ldquo;Would you find it helpful if EdSpark sent you a daily recap?&rdquo; Rahul says yes. (He probably would have said yes to anything that sounded helpful.) Second, she asks: &ldquo;Did you find the onboarding confusing?&rdquo; Rahul says &ldquo;a little.&rdquo; (Leading question — he agreed because that seemed to be what she was looking for.) Third, she moves on before Rahul finishes a sentence that started with: &ldquo;What I actually wanted was...&rdquo;</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Asha"
            nameColor="var(--purple-light)"
            borderColor="var(--purple)"
            content={<>&ldquo;The most important skill in user research is listening past the first answer.<br /><br />&ldquo;When Rahul said &apos;I wanted to check how my calls were going&apos; — that&apos;s the job. Not &apos;I wanted to use EdSpark&apos;. Not &apos;I wanted to analyse recordings&apos;. He wanted to know if he was improving. That&apos;s a fundamentally different job than what EdSpark currently optimises for.<br /><br />&ldquo;You interrupted him before he finished. The most valuable insights are often in the second half of a sentence.&rdquo;</>}
            expandedContent={<>The two questions to always have ready: &apos;Can you tell me more about that?&apos; and &apos;What happened next?&apos; These two prompts will pull more signal from a 30-minute interview than any list of prepared questions. Good interviews feel like conversations, not interrogations. The user should be talking 80% of the time. If you find yourself talking more than that, you&apos;re interviewing wrong.</>}
            conceptId="user-research"
            question="Midway through an interview, a user says 'I just wanted something simpler' and moves on. You should:"
            options={[
              { text: "Accept the answer and move to your next question", correct: false, feedback: "'Simpler' means nothing by itself. Simpler than what? In what way? This is a signal, not an insight. Follow it." },
              { text: "Ask: 'Can you tell me what specifically felt complex when you were using it?'", correct: true, feedback: "Correct. 'Simpler' is an evaluation, not a description. Your job is to get them to describe what they experienced. 'Tell me more about that' is the most underused question in research." },
              { text: "Note 'user wants simpler UI' in your research report", correct: false, feedback: "Never transcribe user evaluations as insights. 'Simpler' is a reaction. You need the experience underneath it before you can know what to fix." },
            ]}
          />
        </div>

        <div className="rv">
          {para(<>After the call, Priya reviews her notes. Despite the mistakes, she got something useful: Rahul didn&apos;t churn because the onboarding was confusing. He churned because he came back on day 3, couldn&apos;t remember why he&apos;d signed up, and didn&apos;t have time to figure it out. &ldquo;I just forgot what it was supposed to do for me,&rdquo; he said.</>)}
          {para(<>That&apos;s not an onboarding flow problem. That&apos;s a value proposition clarity problem.</>)}
          {pullQuote("Users don't leave because of bugs. They leave because they can't see how the product fits into their life.", 'var(--coral)')}

          <InterviewQuality />

          <InfoBox title="The 5 Rules of Good Interviews" accent="var(--coral)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { num: '01', rule: 'Ask about the past, not the future', detail: '"Tell me about the last time..." beats "Would you ever..." every time.' },
                { num: '02', rule: 'Never ask leading questions', detail: '"Did you find it confusing?" vs "Walk me through what happened here."' },
                { num: '03', rule: 'Let silence work', detail: 'Wait 3 seconds after they answer. People often add the most valuable thing after the pause.' },
                { num: '04', rule: 'Follow the "I actually wanted..."', detail: 'Any sentence that starts with what they wanted is a job. Never let it pass without "Tell me more."' },
                { num: '05', rule: 'Aim for their story, not your checklist', detail: '5 good follow-up questions > 20 prepared ones. Follow the narrative.' },
              ].map(item => (
                <div key={item.num} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: 'var(--coral)', flexShrink: 0, paddingTop: '3px' }}>{item.num}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ed-ink)', marginBottom: '3px' }}>{item.rule}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </InfoBox>
        </div>
      </ChapterSection>

      {/* ── PART 5: Synthesis ── */}
      <ChapterSection num="05" accentRgb="21,129,88" id="m2-synthesis">
        <div className="rv">
          {chLabel('Part 5 · Insight Synthesis', 'var(--green)')}
          {h2(<>From 40 notes to 3 insights</>)}

          <SituationCard accent="var(--green)" accentRgb="21,129,88">
            Wednesday afternoon. Priya has completed 6 interviews. She has 8 pages of notes, 3 pages of quotes, and a growing sense of dread. The interviews were fascinating. But she has no idea how to turn them into something useful. She stares at her notes. They stare back.
          </SituationCard>

          {para(<>Asha sits next to her. &ldquo;What&apos;s the same across all six?&rdquo; Priya flips through. She notices something. Three out of six users mentioned some version of: &ldquo;I couldn&apos;t remember what EdSpark was supposed to do for me.&rdquo; Two others mentioned: &ldquo;I didn&apos;t have time to figure it out on my own.&rdquo; One had a totally different issue: &ldquo;My manager set it up wrong and I had no admin access.&rdquo;</>)}
          {para(<>&ldquo;That last one is an outlier,&rdquo; Asha says. &ldquo;Real signal is patterns. What appears in 4 out of 6 conversations is more likely a problem than what appears once.&rdquo;</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Maya"
            nameColor="var(--coral)"
            borderColor="var(--coral)"
            content={<>&ldquo;The technique is called affinity mapping. You put each observation on a card — or a sticky note — then group by theme, not by user.<br /><br />&ldquo;Most people&apos;s instinct is to write up each interview separately. That hides the patterns. Instead, take all 40 notes and ask: which of these belong together?<br /><br />&ldquo;What you&apos;ll find is that 40 notes collapse into 5–7 themes. And then 2–3 of those themes appear across almost every user. Those are your insights. The rest is noise.&rdquo;</>}
            expandedContent={<>A useful distinction: an observation is something a user said or did. An insight is what it means — why it matters, what it implies about the problem. 'User couldn't find the search bar' is an observation. 'Users can't navigate to their most-used feature because the UI structure doesn't match how they think about their workflow' is an insight. Good synthesis converts observations into insights. Bad synthesis just collects quotes.</>}
            conceptId="insight-synthesis"
            question="After 6 interviews, 4 users mentioned they 'couldn't figure out what to do first.' 2 users mentioned pricing confusion. You should:"
            options={[
              { text: "Report both equally — all feedback matters", correct: false, feedback: "Not all feedback is equally weighted. Frequency across independent respondents is the signal. 4/6 on 'what to do first' is a finding. 2/6 on pricing might be real but warrants more investigation." },
              { text: "Focus your brief on 'unclear first action' — 4/6 is a strong pattern; flag pricing as a hypothesis to test", correct: true, feedback: "Correct. Pattern = insight. 4/6 users independently saying the same thing is unlikely to be coincidence. Pricing at 2/6 is worth noting — but not yet an insight. Investigate separately." },
              { text: "Ignore pricing — only focus on what the majority said", correct: false, feedback: "Don't ignore it — note it as a hypothesis worth testing. It might reveal a second distinct problem. But don't give it equal weight to the majority pattern." },
            ]}
          />
        </div>

        <div className="rv">
          {para(<>By Thursday morning, Priya has grouped her notes into three themes:</>)}

          <InfoBox title="Priya's Three Insights from 6 Interviews" accent="var(--green)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { num: '1', insight: 'Value amnesia', detail: "4 of 6 users said they couldn't remember why they signed up — or what EdSpark was supposed to do for them — when they returned after day 1.", implication: "The product doesn't reinforce its own value at the moment of return." },
                { num: '2', insight: 'No obvious first step', detail: "3 of 6 users described opening the product and not knowing where to start. They had completed setup but didn't know what to actually do with it.", implication: 'Setup completion ≠ onboarding success. There\'s a gap between "account created" and "first value moment."' },
                { num: '3', insight: 'No reason to come back', detail: '2 of 6 users described EdSpark as something they\'d use "eventually" but felt no urgency. Nothing in the product created a reason to return.', implication: 'The product has no activation hook — no early win that makes users feel the product is already working for them.' },
              ].map(item => (
                <div key={item.num} style={{ paddingBottom: '12px', borderBottom: '1px solid var(--ed-rule)' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '6px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(21,129,88,0.15)', border: '1px solid rgba(21,129,88,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, color: 'var(--green)', flexShrink: 0 }}>{item.num}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', paddingTop: '2px' }}>{item.insight}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65, marginBottom: '6px', paddingLeft: '30px' }}>{item.detail}</div>
                  <div style={{ fontSize: '11px', color: 'var(--green)', lineHeight: 1.6, paddingLeft: '30px', fontStyle: 'italic' }}>→ {item.implication}</div>
                </div>
              ))}
            </div>
          </InfoBox>

          {pullQuote("The goal of synthesis isn't to summarise what you heard. It's to say what it means.", 'var(--green)')}
        </div>
      </ChapterSection>

      {/* ── PART 6: Discovery Brief ── */}
      <ChapterSection num="06" accentRgb="181,114,10" id="m2-problem-statement">
        <div className="rv">
          {chLabel('Part 6 · The Discovery Brief', 'var(--amber)')}
          {h2(<>The document that turns research into action</>)}

          <SituationCard accent="var(--amber)" accentRgb="181,114,10">
            Thursday afternoon. Priya has her insights. Now she needs to present to Rohan on Friday. She starts writing: &ldquo;Based on user interviews, I recommend redesigning...&rdquo; Asha stops her. &ldquo;Don&apos;t start with the solution. Start with what you found. Let the problem make the case for itself.&rdquo;
          </SituationCard>

          {para(<>&ldquo;If I just present the problem, Rohan will ask: &apos;so what do we do?&apos;&rdquo;</>)}
          {para(<>&ldquo;Yes, he will. And you&apos;ll say: &apos;I have hypotheses, but I want the team to ideate together first — because I might be missing something.&apos; That&apos;s how you involve the team in the solution without giving up ownership of the problem.&rdquo;</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Dev"
            nameColor="var(--blue)"
            borderColor="var(--blue)"
            content={<>&ldquo;As an engineer, the single most valuable thing a PM can hand me is a clear problem statement. Not a wireframe. Not a spec. A problem statement.<br /><br />&ldquo;When I understand the problem, I can suggest solutions you haven&apos;t thought of. I can tell you what&apos;s technically easy vs. what&apos;s expensive. I can propose a smaller version that gets 80% of the value in 20% of the time.<br /><br />&ldquo;A wireframe tells me what to build. A problem statement lets me help you figure out the right thing to build. Big difference.&rdquo;</>}
            expandedContent={<>The best discovery briefs have four components: (1) Who — the specific user segment affected. (2) What they&apos;re trying to do — the job. (3) What gets in the way — the specific barrier. (4) Why it matters now — the business context. Notice: no solution. The solution emerges when the team hears the problem together. A PM who presents a solution at this stage has usually already decided what to build before the team had a chance to think about it.</>}
            conceptId="problem-framing"
            question="You finish research and present to your team. Which opening is best?"
            options={[
              { text: "'I think we should add a daily highlights email — here's why the research supports it'", correct: false, feedback: "This is leading with the solution. You're using research to justify a decision you've already made. It limits the team's ability to think of better options." },
              { text: "'We found that 4 of 6 churned users couldn't remember EdSpark's value when they returned. Here's what that means for us.'", correct: true, feedback: "Lead with the insight. Let the team sit with the problem before jumping to solutions. This builds shared understanding — and usually produces better ideas than you'd have alone." },
              { text: "'The research was interesting but inconclusive — we need to do more interviews before we can act'", correct: false, feedback: "6 interviews with a 4/6 signal on a clear theme is actionable. 'Inconclusive' usually means you're avoiding the discomfort of commitment. Act on what you know; refine as you learn." },
            ]}
          />
        </div>

        <div className="rv">
          {para(<>Priya writes her discovery brief. One page. Three insights. A clear problem statement. No solution proposed — just the framing.</>)}
          {para(<>Friday morning. She presents it to Rohan and the team. Maya immediately says: &ldquo;What if the product showed a personalised &apos;your highlights from this week&apos; when you open it — so the value is obvious from day one?&rdquo; Dev says: &ldquo;We already have the data to do that in a day. Let me prototype something.&rdquo; Kiran says: &ldquo;I can instrument it and we&apos;ll know within two weeks whether it changes day-7 retention.&rdquo;</>)}
          {para(<>Priya didn&apos;t solve the problem. She defined it clearly enough that the team solved it themselves — and faster than she could have alone.</>)}

          {pullQuote("A PM's job isn't to have the answer. It's to frame the question so clearly that the answer becomes obvious.", 'var(--amber)')}

          <DiscoveryBriefBuilder />

          <PMPrincipleBox
            principle="Symptom → Research → Insight → Brief → Ideation. Every product decision starts with understanding, not assumption."
          />
        </div>
      </ChapterSection>

      {/* ── FINAL REFLECTION ── */}
      <ChapterSection num="07" accentRgb="79,70,229" id="m2-reflection">
        <div className="rv">
          {chLabel('Final Reflection · Module 02', 'var(--purple)')}
          {h2(<>What Priya now knows that she didn&apos;t on Monday</>)}

          {para(<>Five days ago, Priya&apos;s instinct was to open Figma. She had a problem, and her job — as she understood it then — was to solve it.</>)}
          {para(<>What she knows now: the problem wasn&apos;t what she thought. And the solution that felt obvious on Monday would have been wrong. The redesigned onboarding she almost built wouldn&apos;t have addressed value amnesia, or the missing first-step clarity, or the lack of an activation hook. It would have been a better onboarding for a problem that didn&apos;t exist.</>)}
          {para(<>She didn&apos;t waste three days shipping the wrong thing. She spent two days understanding the right problem. And the team shipped a prototype in a day.</>)}

          {pullQuote("Discovery is not a phase. It's a habit. The best PMs never stop asking why before they start asking how.", 'var(--purple)')}

          <InfoBox title="The Discovery Toolkit" accent="var(--purple)">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { icon: '🎯', label: 'Discovery mindset', text: 'Resist the solution. Understand first.' },
                { icon: '👥', label: 'Segmentation', text: 'Different users = different problems.' },
                { icon: '💼', label: 'JTBD', text: 'Find the job, not just the complaint.' },
                { icon: '🔬', label: 'Research methods', text: 'Match the method to the question.' },
                { icon: '🎤', label: 'Good interviews', text: 'Past behaviour. Open questions. Follow the story.' },
                { icon: '🗂️', label: 'Synthesis', text: 'Patterns > individual quotes.' },
              ].map(item => (
                <div key={item.label} style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(120,67,238,0.06)', border: '1px solid rgba(120,67,238,0.15)' }}>
                  <div style={{ fontSize: '18px', marginBottom: '6px' }}>{item.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>{item.text}</div>
                </div>
              ))}
            </div>
          </InfoBox>

          <ApplyItBox
            prompt="Pick one thing your team is about to build. Ask: have we talked to users about this problem, or just assumed it exists? Then write a one-sentence brief: [Segment] is trying to [do what] but [barrier]. Does everyone agree with it?"
          />
        </div>

        <div className="rv">
          <QuizEngine conceptId="user-research" conceptName="User Research" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[0]} />
          <QuizEngine conceptId="customer-segments" conceptName="Customer Segments" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[1]} />
          <QuizEngine conceptId="research-methods" conceptName="Research Methods" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[2]} />
          <QuizEngine conceptId="user-research" conceptName="Interview Technique" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[3]} />
          <QuizEngine conceptId="jtbd" conceptName="Jobs to Be Done" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[4]} />
          <QuizEngine conceptId="insight-synthesis" conceptName="Insight Synthesis" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[5]} />
          <QuizEngine conceptId="problem-framing" conceptName="Problem Framing" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[6]} />
          <NextChapterTeaser
            text="Module 03 · Problem Framing & Prioritization — You've discovered the problem. Now: how do you decide which problem to solve first when there are always more problems than time?"
          />
        </div>
      </ChapterSection>
    </>
  );
}

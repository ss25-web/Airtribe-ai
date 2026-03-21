'use client';

import React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizEngine from '../QuizEngine';
import {
  glassCard, demoLabel, chLabel, h2, para, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, ApplyItBox, PMPrincipleBox, NextChapterTeaser,
} from './designSystem';

// Local helper for rich-content boxes
const InfoBox = ({ title, accent = 'var(--teal)', children }: { title: string; accent?: string; children: React.ReactNode }) => (
  <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '20px 24px', margin: '24px 0', border: '1px solid var(--ed-rule)', borderLeft: `4px solid ${accent}` }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: accent, marginBottom: '14px' }}>{title}</div>
    {children}
  </div>
);

// Tool badge
const ToolBadge = ({ name, desc, accent = 'var(--teal)' }: { name: string; desc: string; accent?: string }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '8px', background: 'var(--ed-card)', border: `1px solid var(--ed-rule)`, borderLeft: `3px solid ${accent}`, margin: '4px 0' }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: accent, letterSpacing: '0.08em' }}>{name}</div>
    <div style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>{desc}</div>
  </div>
);

const MODULE_CONTEXT = `Module 02 of Airtribe PM Fundamentals — Track: New to PM.
Continues with Priya Sharma, PM at EdSpark (B2B SaaS for sales coaching). She must investigate why 40% of users churn in week 2. Covers: resisting premature solutions, customer segmentation, Jobs to Be Done, choosing research methods (using Notion for notes, Dovetail for synthesis, Kraftful for AI analysis), running user interviews, affinity mapping, and writing a discovery brief.`;

const QUIZZES = [
  {
    question: "Your manager says '40% of users churn in week 2 — fix it.' You have a theory about onboarding. What do you do first?",
    options: [
      'A. Start redesigning the onboarding — your instinct is probably right',
      'B. Talk to 5–6 churned users before touching anything',
      'C. Run a survey to all users asking what they find confusing',
      'D. Ask engineering to instrument better analytics first',
    ],
    correctIndex: 1,
    explanation: "Your instinct might be right — or it might be completely wrong. Priya spent a weekend building 14 Figma screens for an onboarding problem that turned out not to be an onboarding problem at all. Five conversations would have saved two days. Talk first, build second.",
    conceptId: 'user-research',
    keyInsight: "The cost of five conversations is hours. The cost of building the wrong thing is weeks. Always talk first.",
  },
  {
    question: "EdSpark has 340 churned users last month. You need to understand why managers specifically are churning. Who do you interview?",
    options: [
      'A. Your 10 most active managers — they know the product best',
      'B. A random sample of 20 users to avoid selection bias',
      'C. Managers who churned in the last 2–3 weeks — while it\'s still fresh',
      'D. Enterprise managers — they represent the most valuable segment',
    ],
    correctIndex: 2,
    explanation: "Research participants must match your research question. If the question is 'why do managers churn?', you talk to churned managers — and recent ones, because memory fades fast. Active managers can't tell you why others left. Enterprise managers are a different segment with different context.",
    conceptId: 'customer-segments',
    keyInsight: "Match participants to the question. The wrong respondents give you the wrong insights.",
  },
  {
    question: "Kiran's Amplitude data shows 43% of managers never click 'Add Recording' in their first session. What does this tell you?",
    options: [
      'A. The button is broken or hard to find — fix the UI',
      'B. WHERE the problem shows up. Not WHY. Interview users to find the root cause.',
      'C. Managers don\'t understand the product — add an onboarding tutorial',
      'D. The product isn\'t useful to managers — consider a pivot',
    ],
    correctIndex: 1,
    explanation: "Analytics show you where and when. They don't show you why. 43% never clicking 'Add Recording' could mean the button is hard to find, OR they don't understand why to add recordings, OR they got interrupted, OR they're waiting for their team to set up first. Only conversations reveal which it is.",
    conceptId: 'research-methods',
    keyInsight: "Data shows you where. Interviews show you why. Use both — but in the right order.",
  },
  {
    question: "Midway through an interview, Rahul says 'I wasn't sure what to do next.' You should:",
    options: [
      'A. Note "user felt lost" and move to the next question',
      'B. Ask: "When you say you weren\'t sure what to do — can you walk me through what you tried?"',
      'C. Validate: "Did you find the product confusing?"',
      'D. Move on — you have 20 more questions to get through',
    ],
    correctIndex: 1,
    explanation: "'I wasn't sure what to do next' is an observation, not an insight. What did he try? What was he hoping to see? What would have made it clear? The follow-up question is the whole job. Asking 'did you find it confusing?' is leading — you're suggesting the answer. And racing through 20 questions means you'll miss the one thing that matters.",
    conceptId: 'user-research',
    keyInsight: "'Tell me more' and 'Can you walk me through that?' are the two most powerful interview questions. Use them every time.",
  },
  {
    question: "Rahul said 'I just wanted to see if my coaching was actually working.' As a PM, what's the job?",
    options: [
      'A. Better analytics dashboard — that\'s what he\'s asking for',
      'B. Coaching effectiveness visibility — he hired EdSpark to prove his coaching is improving his team',
      'C. Notification emails — remind managers to check their data',
      'D. A/B test the dashboard layout to see what drives engagement',
    ],
    correctIndex: 1,
    explanation: "'See if coaching was working' isn't a request for a dashboard — it's a job: prove to himself (and his manager) that he's making his team better. That's about confidence, credibility, and career safety. The product solution might be a dashboard — or an automated report, or a Slack summary, or a weekly email. The job determines the direction. The feature is just one possible answer.",
    conceptId: 'jtbd',
    keyInsight: "Every feature request hides a job. Find the job first — then decide what to build.",
  },
  {
    question: "After 6 interviews you have 8 pages of notes. 5 of 6 users mentioned not knowing what to do after setup. 1 user had a billing issue. How do you weight these?",
    options: [
      'A. Report both equally — all feedback is valid',
      'B. 5/6 on "no clear next step" is your primary finding; flag billing as a separate data point',
      'C. Throw out the billing issue — outliers skew findings',
      'D. Do more interviews until billing comes up again before deciding',
    ],
    correctIndex: 1,
    explanation: "Frequency across independent respondents is signal. 5 of 6 users independently describing the same experience is a finding — not a coincidence. 1 user with a billing issue is a data point worth noting, but it's a different problem requiring separate investigation. Don't let one loud outlier dilute a clear pattern.",
    conceptId: 'insight-synthesis',
    keyInsight: "Patterns across users are insights. Individual issues are data points. Weight them accordingly.",
  },
  {
    question: "You've written your discovery brief. How do you open the Friday meeting with Rohan?",
    options: [
      'A. \"I recommend adding example coaching sessions to onboarding — here\'s the plan.\"',
      'B. \"We discovered that managers join EdSpark to prove their coaching is working — but the product never shows them what good looks like. Here\'s what we found.\"',
      'C. \"The research was interesting. I have some thoughts but want more data before proposing anything.\"',
      'D. \"Users are confused — we need to redesign the onboarding flow.\"',
    ],
    correctIndex: 1,
    explanation: "Option A leads with a solution — you've already decided, and the meeting becomes a presentation, not a problem-solving session. Option B leads with the discovery — you present what you learned and let the team think. Option C is avoidance. Option D is a vague symptom, not an insight. Lead with what you learned. The team will find better solutions than you would alone.",
    conceptId: 'problem-framing',
    keyInsight: "Present the problem, not the solution. A clear problem statement unlocks the team's best thinking.",
  },
];

// ─────────────────────────────────────────
// INTERACTIVE 1: RESEARCH METHOD CHOOSER
// ─────────────────────────────────────────
const RESEARCH_SCENARIOS = [
  {
    scenario: "You want to know WHY 40% of managers churn in week 2, but you have no hypothesis yet.",
    methods: [
      { label: 'User interviews', fit: 'Best fit', color: 'var(--green)', rgb: '21,129,88', reason: "You don't know what to look for yet. Interviews let you follow unexpected threads — like when Rahul mentioned coaching evidence rather than onboarding confusion. The right tool when the problem is still fuzzy." },
      { label: 'Session recordings', fit: 'Useful but partial', color: 'var(--blue)', rgb: '58,134,255', reason: "Shows what users do, not why they stop. Use after interviews to confirm patterns — 'do users actually pause at this screen the way Rahul described?'" },
      { label: 'NPS survey', fit: 'Wrong tool', color: 'var(--coral)', rgb: '224,122,95', reason: "NPS tells you satisfaction at a single point in time. It won't tell you why users churned, or what they were trying to accomplish when they gave up." },
    ],
  },
  {
    scenario: "Kiran found that managers who add a recording in session 1 retain at 78%. You want to know which onboarding prompt drives this behaviour.",
    methods: [
      { label: 'A/B test', fit: 'Best fit', color: 'var(--green)', rgb: '21,129,88', reason: "You have a clear success metric (recording added in session 1), a hypothesis, and enough traffic. A/B tests are built for exactly this: 'does change X cause behaviour Y?'" },
      { label: 'User interviews', fit: 'Wrong tool here', color: 'var(--coral)', rgb: '224,122,95', reason: "You're past the 'why' question — Kiran's data already gave you the hypothesis. Interviews give you opinions on hypotheticals. Test behaviour instead." },
      { label: 'Funnel analytics', fit: 'Partial signal', color: 'var(--blue)', rgb: '58,134,255', reason: "Useful for measuring the current baseline before the test, and tracking results after. Doesn't tell you which variant wins on its own." },
    ],
  },
  {
    scenario: "Maya wants to understand what 'job' managers hire EdSpark to do when they first sign up.",
    methods: [
      { label: 'JTBD interviews', fit: 'Best fit', color: 'var(--green)', rgb: '21,129,88', reason: "Ask users to walk you through the moment they decided to sign up. 'What was going on in your work life when you first looked for a product like this?' The switch moment reveals the job — no other method gets there." },
      { label: 'Usage analytics', fit: 'Indirect hint', color: 'var(--blue)', rgb: '58,134,255', reason: "Which features they touch hints at the job, but two users touching the same feature might have completely different jobs. Analytics are a starting point, not the answer." },
      { label: 'Support tickets via Kraftful', fit: 'Good starting point', color: 'var(--teal)', rgb: '0,151,167', reason: "Kraftful can cluster tickets by theme and reveal patterns in what users struggle with. Great for scoping — but support tickets over-represent frustrated users, not successful ones. Combine with interviews." },
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
      {demoLabel('Match the method to the question', 'var(--teal)')}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {RESEARCH_SCENARIOS.map((s, i) => (
          <button key={i} onClick={() => { setActiveScenario(i); setRevealed({}); }}
            style={{ padding: '6px 12px', borderRadius: '7px', fontSize: '11px', fontWeight: i === activeScenario ? 700 : 400, border: `2px solid ${i === activeScenario ? 'var(--teal)' : 'var(--ed-rule)'}`, background: i === activeScenario ? 'rgba(0,151,167,0.1)' : 'var(--ed-card)', color: i === activeScenario ? 'var(--teal)' : 'var(--ed-ink3)', cursor: 'pointer', transition: 'all 0.18s' }}>
            Scenario {i + 1}
          </button>
        ))}
      </div>
      <div style={{ padding: '14px 18px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', marginBottom: '20px', fontSize: '14px', fontStyle: 'italic', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        &ldquo;{scenario.scenario}&rdquo;
      </div>
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
    question: '"Would you use a feature that shows example coaching sessions in onboarding?"',
    verdict: 'Avoid',
    verdictColor: 'var(--coral)',
    why: "Hypothetical. Users say yes to things they'll never use — agreeing is easy and costs nothing. This tells you nothing about actual behaviour. Rahul would have said yes to this, then churned anyway.",
    better: '"Tell me about a time you tried to figure out what good coaching looks like. What did you do?"',
  },
  {
    question: '"Walk me through what happened when you first logged into EdSpark."',
    verdict: 'Great',
    verdictColor: 'var(--green)',
    why: "Past behaviour, open-ended, non-leading. This is how Priya found out Rahul completed setup but then didn't know what to do — a detail that never would have appeared in a survey.",
    better: null,
  },
  {
    question: '"Did you find it confusing when you couldn\'t figure out where to start?"',
    verdict: 'Avoid',
    verdictColor: 'var(--coral)',
    why: "Double problem: leading (suggesting 'confusing') and compound (two questions in one). The user will agree because it seems like what you want to hear. Priya made this mistake live — Rahul said 'a little, yeah' and she nearly moved on.",
    better: '"When you weren\'t sure what to do next — what did you try?"',
  },
  {
    question: '"What was going on in your work at the time that made you look for something like EdSpark?"',
    verdict: 'Great',
    verdictColor: 'var(--green)',
    why: "This is the JTBD opener. It surfaces the context, the trigger, and the job — all in one question. Rahul's answer ('my team's close rate had dropped two quarters in a row') revealed more about the job than any product question would have.",
    better: null,
  },
  {
    question: '"On a scale of 1–10, how likely are you to recommend EdSpark to a colleague?"',
    verdict: 'Context-dependent',
    verdictColor: 'var(--blue)',
    why: "Useful for benchmarking NPS at scale — but useless in a discovery interview. A '4' tells you almost nothing. Only useful if immediately followed by 'tell me more about what's driving that score' — and then the number doesn't matter anyway.",
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
              style={{ padding: '16px 18px', borderRadius: '12px', border: `2px solid ${isRevealed ? item.verdictColor : 'rgba(120,67,238,0.18)'}`, background: 'var(--ed-card)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
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
    job: 'Fast context retrieval before a time-pressured meeting',
    notJob: 'Recording organisation',
    explanation: "The urgency and time-bound nature reveal the real job: speed + recency under pressure, not organisation. A search bar that shows 'most recent from this rep' solves it. A folder system doesn't.",
  },
  {
    quote: '"My manager wants to see proof that the coaching programme is working."',
    job: 'Build credibility with leadership using data',
    notJob: 'Better reporting features',
    explanation: "This person doesn't want a report — they want to look competent to their boss. The job is political: demonstrate impact. The product needs to make that effortless, not just export data.",
  },
  {
    quote: '"I joined EdSpark because my team\'s close rate dropped two quarters in a row and I needed to do something."',
    job: 'Prove to myself and my manager that I\'m fixing the problem',
    notJob: 'Sales coaching tools',
    explanation: "Rahul's actual job. He's not shopping for a coaching tool — he's under performance pressure and needs evidence that he's responding to it. EdSpark is a credibility tool as much as a coaching tool.",
  },
];

const JTBDMatcher = () => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  return (
    <div style={glassCard('var(--coral)', '224,122,95')}>
      {demoLabel("What's the real job? Tap to reveal.", 'var(--coral)')}
      <div style={{ marginBottom: '14px', fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>Users say what they want. PMs listen for what they&apos;re actually trying to accomplish.</div>
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
                        <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--green)', letterSpacing: '0.1em', marginBottom: '5px' }}>THE REAL JOB</div>
                        <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', fontWeight: 600, lineHeight: 1.5 }}>{item.job}</div>
                      </div>
                      <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(224,122,95,0.07)', border: '1px solid rgba(224,122,95,0.2)' }}>
                        <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--coral)', letterSpacing: '0.1em', marginBottom: '5px' }}>NOT JUST</div>
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
  { statement: '"Users probably find the product confusing because it has too many options."', type: 'Opinion', color: 'var(--coral)', explanation: "No evidence. 'Probably' is an opinion marker. This might be true — but it might not. You need to observe it happening before you can act on it." },
  { statement: '"5 of 6 interviewed managers said they didn\'t know what to do after completing account setup."', type: 'Insight', color: 'var(--green)', explanation: "Specific, observable, and consistent across independent respondents. This is what Priya found. It directly implies there\'s a gap between setup completion and the product delivering value." },
  { statement: '"I think the main issue is managers don\'t understand the product\'s value proposition."', type: 'Opinion', color: 'var(--coral)', explanation: "This is a hypothesis, not a finding. It might be right — but 'I think' without evidence is just an assumption wearing the clothes of an insight." },
  { statement: '"Every interviewed manager mentioned wanting to show their boss that coaching was having an impact."', type: 'Insight', color: 'var(--green)', explanation: "Consistent, unprompted, across all participants. That's the job — and it implies EdSpark needs to make coaching impact visible, not just record calls." },
  { statement: '"Kraftful clustered 34% of support tickets as \'not knowing where to start\' — so that\'s the main problem."', type: 'Partial insight', color: 'var(--blue)', explanation: "Support tickets are real signal, but they over-represent users who were frustrated enough to write in. They may not represent the silent majority who just churned. Use it to scope interviews, not to make the final call." },
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
      'Sales managers at small teams (2–20 reps)',
      'Individual sales reps in their first week',
      'Power users with 50+ saved recordings',
    ],
  },
  behaviour: {
    label: 'What are they trying to do?',
    options: [
      'prove that their coaching is improving their team\'s close rate',
      'find specific coaching moments quickly before a call',
      'understand whether EdSpark is worth continuing to use',
    ],
  },
  barrier: {
    label: 'What gets in the way?',
    options: [
      'the product never shows them what good coaching looks like, so they can\'t tell if they\'re using it right',
      'search only works by date, not by rep name or call outcome',
      'there\'s no signal that the product is working — no benchmark, no improvement score, no highlight',
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
      {demoLabel('Build a discovery brief — the output that gets teams aligned', 'var(--teal)')}
      <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', marginBottom: '20px', fontSize: '14px', lineHeight: 1.9, color: 'var(--ed-ink2)' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>DISCOVERY BRIEF</span>
        <span style={{ color: sel.segment ? 'var(--ed-ink)' : 'var(--ed-ink3)', fontStyle: sel.segment ? 'normal' : 'italic', fontWeight: sel.segment ? 600 : 400 }}>{sel.segment ?? '[ who is affected ]'}</span>
        {' are trying to '}
        <span style={{ color: sel.behaviour ? 'var(--ed-ink)' : 'var(--ed-ink3)', fontStyle: sel.behaviour ? 'normal' : 'italic', fontWeight: sel.behaviour ? 600 : 400 }}>{sel.behaviour ?? '[ do what ]'}</span>
        {', but '}
        <span style={{ color: sel.barrier ? 'var(--ed-ink)' : 'var(--ed-ink3)', fontStyle: sel.barrier ? 'normal' : 'italic', fontWeight: sel.barrier ? 600 : 400 }}>{sel.barrier ?? '[ what gets in the way ]'}</span>
        {done ? '.' : ' …'}
      </div>
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
                This is what Priya handed Rohan on Friday. Specific user, specific job, specific barrier — no solution. The team generated three solutions in ten minutes. That&apos;s what a clear problem statement does.
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
          The most expensive thing a PM can build is the wrong thing. Discovery is how you avoid it — not by doing more research, but by talking to the right people before you open Figma.
        </div>
        <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'rgba(0,151,167,0.06)', border: '1px solid rgba(0,151,167,0.18)', marginBottom: '24px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.14em', marginBottom: '10px' }}>BY THE END OF THIS MODULE</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '7px' }}>
            {[
              'Stop building before you understand the problem',
              'Run a user interview that gives you real insight, not polite agreement',
              'Find the job a user is actually trying to get done',
              'Turn messy notes into a crisp brief that gets the team aligned in 10 minutes',
            ].map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>→</span>
                <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tools used in this module */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', letterSpacing: '0.14em', marginBottom: '10px' }}>TOOLS PRIYA USES IN THIS MODULE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <ToolBadge name="Notion" desc="Interview notes template + affinity mapping board" accent="var(--blue)" />
            <ToolBadge name="Dovetail" desc="Research repository — tag, cluster, find patterns" accent="var(--purple)" />
            <ToolBadge name="Kraftful" desc="AI analysis of support tickets — fast pattern detection" accent="var(--teal)" />
          </div>
        </div>

        <div style={{ padding: '18px 22px', borderRadius: '8px', background: 'var(--ed-card)', borderTop: '1px solid var(--ed-rule)', borderRight: '1px solid var(--ed-rule)', borderBottom: '1px solid var(--ed-rule)', borderLeft: '4px solid var(--teal)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--teal)', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Where we left Priya</div>
          <div style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.8 }}>
            It&apos;s Monday morning. Rohan messaged Friday at 11:43pm: <strong style={{ color: 'var(--ed-ink)' }}>&ldquo;Need a plan on week-2 churn. Stakeholder call Thursday. Make it good.&rdquo;</strong> Priya spent the weekend building. She has 14 screens in Figma. She&apos;s about to send the link in Slack.
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
          {h2(<>You spent the weekend building the wrong thing</>)}

          <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'rgba(0,151,167,0.06)', border: '1px solid rgba(0,151,167,0.18)', marginBottom: '28px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.14em', marginBottom: '10px' }}>BY THE END OF THIS PART</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '7px' }}>
              {['Know why symptoms and root causes are not the same thing', 'Understand the cost of building before understanding', "See what Asha's discovery process looks like in Notion"].map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          <SituationCard accent="var(--teal)" accentRgb="0,151,167">
            9:17am Monday. Priya has 14 screens in Figma — a completely redesigned onboarding: 7 steps collapsed to 4, new progress indicators, rewritten welcome email, cleaner copy. She worked Saturday and Sunday on it. She&apos;s proud of it. She&apos;s about to paste the link into Slack when Asha pulls up a chair.
          </SituationCard>

          {para(<>&ldquo;Nice mockup,&rdquo; Asha says, looking at the screen. &ldquo;When did you talk to users?&rdquo;</>)}
          {para(<>&ldquo;I haven&apos;t yet. But the problem seems—&rdquo;</>)}
          {para(<>Asha interrupts quietly. &ldquo;Pull up the churn data. When exactly are users dropping off?&rdquo;</>)}
          {para(<>Priya clicks through to the dashboard. She&apos;d looked at the headline number — 40% — but not the shape of it. The drop-off isn&apos;t on day 1. It peaks between days 3 and 7. &ldquo;Day 3 to 7,&rdquo; she says slowly.</>)}
          {para(<>&ldquo;And do those users complete setup before they churn?&rdquo;</>)}
          {para(<>Another click. 62% of churned users completed setup. &ldquo;Yes,&rdquo; Priya says. &ldquo;Most of them.&rdquo;</>)}
          {para(<>Asha lets that sit for a moment. &ldquo;So they get through your onboarding. They create an account, set everything up. And then they leave anyway.&rdquo;</>)}
          {para(<>Priya stares at the screen. She has 14 screens of a redesigned onboarding for users who already got through the onboarding just fine. She closes Figma.</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Asha"
            nameColor="var(--purple-light)"
            borderColor="var(--purple)"
            content={<>&ldquo;Here&apos;s what happened. You saw a number — 40% churn — and your brain immediately jumped to a cause: &apos;the onboarding must be confusing.&apos; Then you spent a weekend solving that cause before checking whether it was real.<br /><br />&ldquo;The number is a symptom. You don&apos;t know the cause yet. It could be onboarding. Or the product doesn&apos;t show value fast enough. Or managers don&apos;t know what to do once they set it up. Or the sales team is promising features that don&apos;t exist. Your redesign doesn&apos;t help with any of those.<br /><br />&ldquo;You caught it before you shipped it. Most PMs don&apos;t.&rdquo;</>}
            expandedContent={<>Asha opens a Notion doc on her laptop. &ldquo;This is the template I use for every discovery sprint — interview notes, patterns, brief, all in one place. I&apos;ll share it with you.&rdquo; The template has three sections: raw notes from each interview, an affinity map organized by theme (not by user), and a one-page brief at the end. &ldquo;By Wednesday you&apos;ll have something better than 14 Figma screens. And it&apos;ll actually solve the right problem.&rdquo;</>}
            conceptId="user-research"
            question="Your manager says '40% of users churn in week 2 — fix it.' You have a theory about onboarding. What do you do first?"
            options={[
              { text: "Start redesigning the onboarding — your instinct is probably right", correct: false, feedback: "Priya's instinct was wrong. She spent a weekend building 14 screens for a problem that didn't exist. Talk to users first — before you invest any time in solutions." },
              { text: "Talk to 5–6 churned users before touching anything", correct: true, feedback: "Exactly what Asha recommended. Five conversations take hours. A weekend of building takes a weekend. Talk first, build second." },
              { text: "Run a survey to all users asking what they find confusing", correct: false, feedback: "Surveys give you opinions on a question you've already assumed. When you don't know what the problem is, you need conversations — not checkboxes." },
            ]}
          />
        </div>

        <div className="rv">
          {pullQuote("Build the right thing slowly. Don't build the wrong thing fast.", 'var(--teal)')}

          <InfoBox title="Symptom vs Root Cause" accent="var(--teal)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Symptom', desc: "What you observe: '40% churn in week 2.' Real, measurable, but tells you nothing about why." },
                { label: 'Theory', desc: "What your brain invents to explain it: 'The onboarding is confusing.' May be right. May be completely wrong." },
                { label: 'Root cause', desc: "What's actually happening: You can only find this by talking to users. It might match your theory. It often doesn't." },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ padding: '3px 10px', borderRadius: '20px', background: 'rgba(0,151,167,0.12)', border: '1px solid rgba(0,151,167,0.25)', fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--teal)', flexShrink: 0, whiteSpace: 'nowrap' }}>{item.label}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.6, paddingTop: '3px' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </InfoBox>

          <QuizEngine conceptId="user-research" conceptName="User Research" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[0]} />

          <ResearchMethodChooser />
        </div>
      </ChapterSection>

      {/* ── PART 2: Know Your Users ── */}
      <ChapterSection num="02" accentRgb="120,67,238" id="m2-customer-segments">
        <div className="rv">
          {chLabel('Part 2 · Customer Segments', 'var(--purple)')}
          {h2(<>340 churned users. Three completely different problems.</>)}

          <SituationCard accent="var(--purple)" accentRgb="120,67,238">
            Priya pulls up the list of churned users. 340 names, emails, account types. She stares at it. &ldquo;I can&apos;t interview 340 people.&rdquo; Maya, EdSpark&apos;s designer, rolls her chair over. &ldquo;You don&apos;t need to. You need to figure out which 340 people this actually is.&rdquo;
          </SituationCard>

          {para(<>Maya opens a spreadsheet. She starts sorting — first by role: 180 are individual sales reps, 110 are sales managers, 50 are ops or admin. Then by company size: solo, small team (2–20 reps), larger org (20+). Then by where they stopped: 220 churned after setup, 80 churned before completing it, 40 set up and used it for a few sessions then stopped.</>)}
          {para(<>&ldquo;Now look at this,&rdquo; Maya says. She points at the manager segment. &ldquo;A sales manager who churned after 5 days of using it — what job were they trying to do when they signed up?&rdquo;</>)}
          {para(<>Priya: &ldquo;Improve their team&apos;s coaching?&rdquo;</>)}
          {para(<>&ldquo;Specifically. They&apos;re not using EdSpark themselves — they&apos;re using it to manage their team&apos;s development. Now look at the sales rep who churned on day 2. What job were they trying to do?&rdquo;</>)}
          {para(<>&ldquo;Track their own performance?&rdquo;</>)}
          {para(<>&ldquo;Completely different job. Different context, different success criteria, different failure mode. If you build one solution for 'churned users,' it fits neither of them.&rdquo;</>)}
          {para(<>Priya looks at the two groups. EdSpark is called a &ldquo;Sales Coaching Platform.&rdquo; The managers are the buyers — the people who pay for it and decide whether to keep it. &ldquo;Then I research the managers,&rdquo; she says. &ldquo;That&apos;s the segment that matters most for retention.&rdquo;</>)}
          {para(<>&ldquo;Good,&rdquo; Maya says. &ldquo;Now: which managers? You need to narrow further.&rdquo;</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Maya"
            nameColor="var(--coral)"
            borderColor="var(--coral)"
            content={<>&ldquo;I&apos;ve set up a Dovetail workspace for the team. Every research session goes in there — interview transcript, clips, tags. By the time you&apos;ve done 5 interviews, the patterns start forming automatically.<br /><br />&ldquo;Here&apos;s what I&apos;d recommend: interview managers who churned in the last 10 days, at teams of 5–20 reps. That&apos;s your most representative group — not enterprise (too complex), not solo reps (different job), not ancient history (memory fades). I&apos;ll add you to the workspace tonight.&rdquo;</>}
            expandedContent={<>Dovetail is a research repository that stores transcripts, recordings, and notes from interviews. The real value comes from tagging: as you read each interview, you tag observations (e.g. &ldquo;didn&apos;t know what to do first,&rdquo; &ldquo;wanted to see an example&rdquo;). Once all interviews are tagged, Dovetail shows you which tags appear most — automatically surfacing the patterns. It turns 8 pages of notes into a prioritized list of themes. Priya will use it in Part 5 to build her synthesis.</>}
            conceptId="customer-segments"
            question="EdSpark has 340 churned users last month. You need to understand why managers specifically are churning. Who do you interview?"
            options={[
              { text: "Your 10 most active managers — they know the product best", correct: false, feedback: "Active managers can tell you what's working. They can't tell you why others left. You need churned users, not retained ones." },
              { text: "Managers who churned in the last 2–3 weeks — while it's still fresh", correct: true, feedback: "Exactly. Recent churners remember why they left. Older churners rationalise differently ('I just got busy') or forget entirely. Recency matters enormously in research." },
              { text: "A random sample of all 340 churned users to avoid bias", correct: false, feedback: "Random sampling makes sense for surveys with statistical claims. For qualitative discovery, you want people whose experience matches your research question — recent churned managers, not a random cross-section." },
            ]}
          />
        </div>

        <div className="rv">
          {pullQuote("Segmentation isn't about personas with names and stock photos. It's about finding where the problem is actually different.", 'var(--purple)')}

          <InfoBox title="Jobs to Be Done" accent="var(--purple)">
            <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.85 }}>
              The &ldquo;job&rdquo; is the progress a person is trying to make in a specific situation. Not &ldquo;use EdSpark&rdquo; — that&apos;s a feature. The job might be: <em>&ldquo;prove to my director that my coaching programme is improving the team&apos;s numbers before the quarterly review.&rdquo;</em><br /><br />
              Two managers could use EdSpark for completely different jobs — one tracking team improvement, one benchmarking her reps before a reorg. They&apos;d need different things. Find the job before you design the solution.
            </div>
          </InfoBox>

          <QuizEngine conceptId="customer-segments" conceptName="Customer Segments" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[1]} />

          <JTBDMatcher />
        </div>
      </ChapterSection>

      {/* ── PART 3: Choose Your Method ── */}
      <ChapterSection num="03" accentRgb="58,134,255" id="m2-research-methods">
        <div className="rv">
          {chLabel('Part 3 · Research Methods', 'var(--blue)')}
          {h2(<>Data shows you where. Users tell you why.</>)}

          <SituationCard accent="var(--blue)" accentRgb="58,134,255">
            Before Priya books a single interview, Kiran rolls his chair over with his laptop open. &ldquo;Before you talk to anyone — look at this.&rdquo; Three Amplitude charts. He&apos;s been sitting on these for a week.
          </SituationCard>

          {para(<>The first chart: 43% of managers who complete setup never click &ldquo;Add Recording&rdquo; in their first session. The second: of managers who <em>do</em> add a recording in session 1, 78% are still active in week 2. Of managers who don&apos;t, 91% churn. Third chart: median time between signup and first recording is 4.2 days — for churned users. For retained users, it&apos;s 18 hours.</>)}
          {para(<>&ldquo;So,&rdquo; Kiran says, &ldquo;if a manager adds their first recording within 24 hours of signup, they almost always stick. If they don&apos;t add one in the first 4 days, they almost always leave.&rdquo;</>)}
          {para(<>Priya: &ldquo;So the fix is to get them to add a recording faster. Better prompt, maybe a tooltip—&rdquo;</>)}
          {para(<>Asha: &ldquo;Maybe. Or maybe the problem is they don&apos;t understand <em>why</em> to add a recording. Or they don&apos;t know what to look for once they do. The data shows WHERE the problem is. It doesn&apos;t show WHY.&rdquo;</>)}
          {para(<>Kiran nods, surprisingly. &ldquo;Exactly. I can tell you that not adding a recording predicts churn. I can&apos;t tell you what&apos;s going through their head when they don&apos;t.&rdquo;</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Kiran"
            nameColor="var(--teal)"
            borderColor="var(--teal)"
            content={<>&ldquo;One more thing before you go interview people. We ran three months of EdSpark support tickets through Kraftful last week. The AI clustered them by theme automatically.<br /><br />&ldquo;34% of tickets: &lsquo;not knowing where to start.&rsquo; 28%: &lsquo;not understanding the difference between features.&rsquo; 18%: technical issues. 20% other.<br /><br />&ldquo;This is a good starting point — it tells you what people who write in are struggling with. But remember: these are users who cared enough to reach out. The silent churners might have a completely different experience. Use Kraftful to sharpen your interview questions, not to replace them.&rdquo;</>}
            expandedContent={<>Kraftful uses AI to analyze patterns in customer feedback — support tickets, app store reviews, user surveys — and group them into themes automatically. It&apos;s useful for understanding what users who surface issues are experiencing. The limitation: it only captures people who chose to say something. If 40% of users churn silently, Kraftful tells you nothing about them. Use it to scope your research — not to finish it.</>}
            conceptId="research-methods"
            question="Kiran's Amplitude data shows 43% of managers never click 'Add Recording' in their first session. What does this tell you?"
            options={[
              { text: "The button is broken or hard to find — fix the UI", correct: false, feedback: "That's one possible cause. But it could also mean they don't understand WHY to add a recording, or they're waiting for their team to use it first, or they got interrupted. Data shows where. Interviews show why." },
              { text: "WHERE the problem shows up. Not WHY. Interview users to find the root cause.", correct: true, feedback: "Exactly what Asha said. Kiran's data is invaluable — it narrows the problem to a specific behaviour. Now you need to understand what's behind that behaviour. That requires conversations." },
              { text: "Managers don't find the product useful — consider a different approach", correct: false, feedback: "78% of managers who DO add a recording stay active. The product is useful — for users who get past this specific point. The problem is getting them there, not the product itself." },
            ]}
          />
        </div>

        <div className="rv">
          {para(<>Priya writes in her Notion doc: <em>&ldquo;Research question: Why do managers not add a recording in their first 24 hours? What&apos;s happening in their head at that point?&rdquo;</em> Kiran&apos;s data gave her a specific behaviour to investigate. Now she needs to understand what&apos;s behind it.</>)}

          {pullQuote("Qualitative research finds the why. Quantitative confirms whether the why is widespread.", 'var(--blue)')}

          <InfoBox title="When to use each method" accent="var(--blue)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { method: 'User interviews', use: "When the problem is fuzzy and you don't know what to look for", limit: 'Small sample — can\'t prove scale' },
                { method: 'Funnel analytics', use: 'Finding where users drop off at scale', limit: 'Shows what, not why' },
                { method: 'Kraftful / AI ticket analysis', use: 'Fast pattern detection across support tickets and feedback', limit: 'Only captures users who spoke up' },
                { method: 'A/B tests', use: 'Testing whether change X causes behaviour Y', limit: 'Needs a clear hypothesis and enough traffic first' },
                { method: 'Dovetail', use: 'Organising and finding patterns across interview notes', limit: 'Only as good as your tagging' },
              ].map(row => (
                <div key={row.method} style={{ paddingBottom: '8px', borderBottom: '1px solid var(--ed-rule)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--ed-ink)', fontSize: '12px', marginBottom: '4px' }}>{row.method}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--green)', lineHeight: 1.5 }}>✓ {row.use}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>✗ {row.limit}</div>
                  </div>
                </div>
              ))}
            </div>
          </InfoBox>

          <QuizEngine conceptId="research-methods" conceptName="Research Methods" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[2]} />

          <InsightOrOpinion />
        </div>
      </ChapterSection>

      {/* ── PART 4: Run the Interview ── */}
      <ChapterSection num="04" accentRgb="224,122,95" id="m2-interview">
        <div className="rv">
          {chLabel('Part 4 · The Interview', 'var(--coral)')}
          {h2(<>Rahul says the thing that changes everything</>)}

          <SituationCard accent="var(--coral)" accentRgb="224,122,95">
            Tuesday 11am. Priya has her first interview: Rahul Shah, sales manager at a 12-person team. He signed up for EdSpark 9 days ago and stopped logging in after day 6. He agreed to a 30-minute call. Priya has 22 questions prepared. Asha looked at the list before the call: &ldquo;You need one. &lsquo;Tell me what happened when you first signed up for EdSpark.&rsquo; Then follow the story.&rdquo;
          </SituationCard>

          {para(<>The call starts. Priya takes a breath and asks the one question.</>)}
          {para(<>Rahul: &ldquo;Yeah — so I saw an ad, it said something about improving coaching outcomes. That&apos;s exactly what I&apos;d been thinking about. My team&apos;s close rate had dropped two quarters in a row and my director was asking questions. I figured I needed to do something visible. I signed up.&rdquo;</>)}
          {para(<>Priya is writing fast. [Job: prove to director that I&apos;m responding to the performance drop. Not &lsquo;improve coaching&apos; — prove I&apos;m doing something about the problem.]</>)}
          {para(<>Priya: &ldquo;What happened when you first got into the product?&rdquo;</>)}
          {para(<>Rahul: &ldquo;Setup was pretty smooth actually. Connected my team&apos;s accounts, configured the basics — took maybe 20 minutes. Then I was on the main dashboard and I just... wasn&apos;t sure what to do next. There were charts. Some options. But nothing was telling me where to start.&rdquo;</>)}
          {para(<>Priya (internal): He got through setup. He&apos;s describing exactly what Kiran&apos;s data showed — he didn&apos;t add a recording in his first session. But why?</>)}
          {para(<>Priya: &ldquo;What did you do when you weren&apos;t sure what to do?&rdquo;</>)}
          {para(<>Rahul laughs a little. &ldquo;Honestly? Opened another tab. Checked some emails. Told myself I&apos;d come back and figure it out properly when I had more time.&rdquo;</>)}
          {para(<>Priya makes her first mistake: &ldquo;Did you find it confusing?&rdquo;</>)}
          {para(<>Rahul: &ldquo;A little, yeah.&rdquo;</>)}
          {para(<>Priya writes: &ldquo;User found product confusing.&rdquo; She moves to her next question. But a Slack message pops up from Asha, who&apos;s been reading the transcript in real time: <em>&ldquo;Don&apos;t accept &apos;confusing.&apos; Ask what was confusing. Dig.&rdquo;</em></>)}
          {para(<>Priya: &ldquo;Sorry — going back for a second. When you say confusing, can you be more specific about what felt unclear?&rdquo;</>)}
          {para(<>Rahul: &ldquo;I knew I was supposed to add call recordings. But I didn&apos;t understand... what I was supposed to do with them. Like, what am I looking for? What does good coaching sound like? I&apos;ve been a manager for 3 years but I&apos;ve never actually heard someone tell me what great sales coaching looks like in a recording. The product just gave me the tool. It didn&apos;t tell me how to use it.&rdquo;</>)}
          {para(<>Priya goes very still. <em>That</em> is not an onboarding problem.</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Asha"
            nameColor="var(--purple-light)"
            borderColor="var(--purple)"
            content={<>&ldquo;Rahul didn&apos;t churn because the product was confusing. He churned because EdSpark assumes managers already know what great coaching looks like. They don&apos;t. The product gave him a toolbox without showing him how to use a single tool.<br /><br />&ldquo;Your 14 Figma screens would have simplified the account setup process that Rahul had no problem with. And then he&apos;d still leave at exactly the same point, for exactly the same reason.<br /><br />&ldquo;The follow-up question — &apos;can you be more specific?&apos; — is the whole job. That&apos;s where the insight lives. Always.&rdquo;</>}
            expandedContent={<>After the call, Priya adds Rahul&apos;s transcript to Dovetail and starts tagging. One tag immediately: &ldquo;doesn&apos;t know what good looks like.&rdquo; Another: &ldquo;job is proving value to director.&rdquo; She has five more interviews to run. But she already has a hypothesis to test: EdSpark never shows users what good coaching looks like — and managers, specifically, have never been taught this either. The product assumes expertise the user doesn&apos;t have.</>}
            conceptId="user-research"
            question="Midway through an interview, Rahul says 'I wasn't sure what to do next.' You should:"
            options={[
              { text: "Note 'user felt lost' and move to the next question", correct: false, feedback: "'Wasn't sure what to do next' is an observation, not an insight. What did he try? What was he expecting to see? What would have made it clear? The follow-up is the actual research." },
              { text: "Ask: 'When you say you weren't sure — can you walk me through what you tried?'", correct: true, feedback: "Exactly. 'Tell me more' and 'walk me through what you tried' are the two most powerful follow-ups in research. Priya used them — and Rahul's answer changed her entire understanding of the problem." },
              { text: "Validate: 'Did you find it confusing?'", correct: false, feedback: "This is leading — you're suggesting the answer. Rahul said 'a little yeah' because it seemed like what Priya wanted to hear. It's confirmation bias disguised as research." },
            ]}
          />
        </div>

        <div className="rv">
          {pullQuote("The insight isn't in the first answer. It's in the question after the first answer.", 'var(--coral)')}

          <InterviewQuality />

          <InfoBox title="The 5 rules Priya learned the hard way" accent="var(--coral)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { num: '01', rule: "Ask about what happened, not what they'd do", detail: "'Walk me through your first session' beats 'would you use this feature' every time." },
                { num: '02', rule: 'Never suggest the answer', detail: '"Did you find it confusing?" vs "What felt unclear?" — the first one gave Priya a useless answer.' },
                { num: '03', rule: "Don't accept the first answer", detail: "Rahul's breakthrough came when Priya asked a follow-up Asha pushed her to ask. The real insight is almost never in the first sentence." },
                { num: '04', rule: 'Silence is a tool', detail: 'Three seconds of silence after an answer. Users often add the most important thing after they think you\'re done listening.' },
                { num: '05', rule: 'The story is the research', detail: 'Drop your question list. Follow what the user is telling you. The unexpected thread is usually where the real problem lives.' },
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

          <QuizEngine conceptId="user-research" conceptName="Interview Technique" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[3]} />
        </div>
      </ChapterSection>

      {/* ── PART 5: Synthesis ── */}
      <ChapterSection num="05" accentRgb="21,129,88" id="m2-synthesis">
        <div className="rv">
          {chLabel('Part 5 · Insight Synthesis', 'var(--green)')}
          {h2(<>Eight pages of notes. Three things that matter.</>)}

          <SituationCard accent="var(--green)" accentRgb="21,129,88">
            Wednesday afternoon. Priya has run 6 interviews. She&apos;s added all six transcripts to Dovetail. Now she&apos;s in the tagging phase — reading each interview, highlighting key moments, applying tags. It&apos;s slow. It&apos;s also where the actual research happens.
          </SituationCard>

          {para(<>Tag: <em>&ldquo;doesn&apos;t know what good looks like&rdquo;</em> — Rahul, interview 1. She keeps reading.</>)}
          {para(<>Interview 2: Kavita, a sales manager at a 7-person team. &ldquo;I connected everything, set it up, and then I opened a recording and just... watched it. I didn&apos;t know what I was looking for. Was that a good call? A bad one? I had no frame of reference.&rdquo; Tag: <em>&ldquo;doesn&apos;t know what good looks like.&rdquo;</em></>)}
          {para(<>Interview 3: Sanjay. Different team, different city, different role. But at minute 12 he says: &ldquo;I kept hoping the product would tell me what to do with the data. Like, here&apos;s what this means about your team.&rdquo; Tag: <em>&ldquo;doesn&apos;t know what good looks like.&rdquo;</em></>)}
          {para(<>By interview 5, the same tag has appeared in 5 of 5 sessions. Priya looks at her Dovetail board. That tag — unprompted, across five independent conversations — is glowing. It&apos;s not confirmation bias. It&apos;s a pattern.</>)}
          {para(<>The 6th interview is different. Mihir had a billing issue on day 2 and gave up. That&apos;s its own problem, logged separately. It doesn&apos;t dilute the pattern in the other five.</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Maya"
            nameColor="var(--coral)"
            borderColor="var(--coral)"
            content={<>&ldquo;What Dovetail does automatically — once you tag — is show you which themes appear across the most interviews. You can literally see: &apos;this observation appeared in 5 of 6 sessions.&apos; That&apos;s your primary finding.<br /><br />&ldquo;But the tool doesn&apos;t tell you what it means. That&apos;s yours. Your 5 managers didn&apos;t just have trouble with a feature — they lacked a mental model for good coaching. EdSpark gives them a mirror but no benchmark. That&apos;s a completely different problem than UX confusion.<br /><br />&ldquo;That&apos;s not in the data. That&apos;s your synthesis.&rdquo;</>}
            expandedContent={<>The difference between a note and an insight: a note is what happened. An insight is what it means. &ldquo;User didn&apos;t know what to do after setup&rdquo; is a note. &ldquo;EdSpark assumes managers know what great coaching looks like — but most of them have never been taught&rdquo; is an insight. It explains the pattern, points to a root cause, and implies a direction without dictating a solution. That&apos;s the goal of synthesis.</>}
            conceptId="insight-synthesis"
            question="After 6 interviews you have 8 pages of notes. 5 of 6 users mentioned not knowing what to do after setup. 1 user had a billing issue. How do you weight these?"
            options={[
              { text: "Report both equally — all feedback is valid", correct: false, feedback: "All feedback is data — but not all data is equal. 5/6 independent users saying the same thing unprompted is a pattern. 1 user with a billing issue is a separate problem that needs its own investigation." },
              { text: "5/6 on 'no clear next step' is your primary finding; flag billing as a separate data point", correct: true, feedback: "Exactly. Priya's report led with the 5/6 pattern. The billing issue was noted in an appendix as 'worth investigating separately.' Weighted correctly, the findings are clear." },
              { text: "Do more interviews until billing comes up again before deciding", correct: false, feedback: "You'd be chasing a pattern that probably doesn't exist. 6 interviews on a consistent theme is enough to act. Do more research if you're uncertain — not to balance a clear finding against an outlier." },
            ]}
          />
        </div>

        <div className="rv">
          {para(<>By Thursday morning, Priya has her synthesis. From 8 pages of notes, three insights:</>)}

          <InfoBox title="Priya's Three Findings — from 6 interviews via Dovetail" accent="var(--green)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                {
                  num: '1', tag: '5 of 6 interviews', insight: 'No benchmark for good',
                  detail: "Managers set up EdSpark and open recordings — but don't know what to look for. They've never been shown what great sales coaching sounds like. EdSpark provides the mirror; nobody provided the reference.",
                  implication: "The problem isn't feature confusion — it's missing context. The product assumes expertise the user doesn't have.",
                },
                {
                  num: '2', tag: '4 of 6 interviews', insight: 'Job is visibility, not improvement',
                  detail: "Managers signed up not to improve coaching but to prove to their director that they were responding to a performance problem. They need evidence of action as much as actual coaching improvement.",
                  implication: "The product needs to make coaching effort visible quickly — not just track it quietly in the background.",
                },
                {
                  num: '3', tag: '3 of 6 interviews', insight: 'No signal that it\'s working',
                  detail: "After adding recordings, managers had no way to tell if anything was improving. No before/after, no benchmark, no nudge from the product.",
                  implication: "Without a signal of progress, there's no reason to come back. The product has no activation moment — no early win.",
                },
              ].map(item => (
                <div key={item.num} style={{ paddingBottom: '12px', borderBottom: '1px solid var(--ed-rule)' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '6px', alignItems: 'flex-start' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(21,129,88,0.15)', border: '1px solid rgba(21,129,88,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, color: 'var(--green)', flexShrink: 0, marginTop: '1px' }}>{item.num}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)' }}>{item.insight}</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--green)', background: 'rgba(21,129,88,0.1)', padding: '2px 7px', borderRadius: '10px' }}>{item.tag}</div>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65, marginBottom: '6px' }}>{item.detail}</div>
                      <div style={{ fontSize: '11px', color: 'var(--green)', lineHeight: 1.6, fontStyle: 'italic' }}>→ {item.implication}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </InfoBox>

          {pullQuote("A note is what happened. An insight is what it means. Synthesis is the gap between them.", 'var(--green)')}

          <QuizEngine conceptId="insight-synthesis" conceptName="Insight Synthesis" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[5]} />
        </div>
      </ChapterSection>

      {/* ── PART 6: Discovery Brief ── */}
      <ChapterSection num="06" accentRgb="181,114,10" id="m2-problem-statement">
        <div className="rv">
          {chLabel('Part 6 · The Discovery Brief', 'var(--amber)')}
          {h2(<>One page that unlocks the whole team</>)}

          <SituationCard accent="var(--amber)" accentRgb="181,114,10">
            Thursday evening. The stakeholder call is tomorrow at 10am. Priya opens Notion and starts writing her brief. Her first draft begins: &ldquo;Based on user interviews, I recommend adding example coaching sessions to the onboarding flow...&rdquo; She sends it to Asha. Asha replies in 3 minutes: &ldquo;You led with a solution. What did you discover?&rdquo;
          </SituationCard>

          {para(<>Priya stares at the screen. She&apos;s been sitting on this hypothesis since Rahul&apos;s interview two days ago. She knows what she wants to build. She&apos;s already thought about how it would work. But Asha is right — the brief is supposed to describe the problem, not prescribe the answer.</>)}
          {para(<>She deletes everything after the first paragraph and starts again.</>)}
          {para(<>The second draft: &ldquo;Sales managers at small teams (5–20 reps) sign up for EdSpark with one job in mind: prove to their leadership that they&apos;re responding to a performance problem. But the product assumes they already know what great coaching looks like. They don&apos;t. So they complete setup, open a recording, and have no frame of reference for what they&apos;re seeing. 5 of 6 churned managers described a version of this: &lsquo;I didn&apos;t know what I was supposed to be creating.&rsquo; The product has never shown them what success looks like.&rdquo;</>)}
          {para(<>She shows it to Asha. A single reply: &ldquo;That&apos;s it.&rdquo;</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Dev"
            nameColor="var(--blue)"
            borderColor="var(--blue)"
            content={<>&ldquo;Priya showed us the brief on Friday morning. Rohan read it in 90 seconds. Then he looked up and said, &apos;What&apos;s the fix?&apos;<br /><br />&ldquo;Priya said, &apos;I have a hypothesis, but I want to hear what the team thinks first.&apos;<br /><br />&ldquo;I said: what if we showed an anonymised example coaching session the first time you add a recording — a real before/after call with commentary? I can build that in a day, maybe less. Maya said: or a 60-second video. Kiran said: let&apos;s A/B test both. Two weeks, measure day-14 retention.<br /><br />&ldquo;When Priya arrived Monday with 14 wireframes, I would have built exactly what she asked for. It would have been wrong. On Friday she gave us the problem. We built the right thing together.&rdquo;</>}
            expandedContent={<>The brief doesn&apos;t end with a solution for a reason. When a PM presents a clear problem, the team&apos;s collective intelligence — engineering&apos;s knowledge of what&apos;s feasible, design&apos;s knowledge of what&apos;s usable, analytics&apos;s knowledge of what&apos;s measurable — produces better ideas than any one person could generate alone. The PM&apos;s job is to make the problem so clear that the solution becomes obvious. Not to arrive with both.</>}
            conceptId="problem-framing"
            question="You've written your discovery brief. How do you open the Friday meeting with Rohan?"
            options={[
              { text: "\"I recommend adding example coaching sessions to onboarding — here's the plan.\"", correct: false, feedback: "You've already decided — and the meeting becomes a presentation, not a problem-solving session. Dev wouldn't have proposed the before/after idea if Priya had arrived with wireframes." },
              { text: "\"We discovered that managers join EdSpark to prove their coaching is working — but the product never shows them what good looks like. Here's what we found.\"", correct: true, feedback: "This is exactly what Priya did. She led with the discovery, not the solution. In ten minutes, the team generated three solutions she hadn't thought of — including one that was better than her original idea." },
              { text: "\"The research was interesting but I need more interviews before proposing anything.\"", correct: false, feedback: "5 of 6 churned managers saying the same thing unprompted is enough to act. 'Needs more research' is sometimes avoidance — a way of delaying the discomfort of commitment." },
            ]}
          />
        </div>

        <div className="rv">
          {pullQuote("Make the problem so clear that the solution becomes obvious. That's the PM's job in discovery.", 'var(--amber)')}

          <DiscoveryBriefBuilder />

          <PMPrincipleBox
            principle="Symptom → Research → Insight → Brief → Ideation. Discovery is not a phase — it's the habit that separates PMs who build the right thing from PMs who build things right."
          />

          <QuizEngine conceptId="problem-framing" conceptName="Problem Framing" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[6]} />
        </div>
      </ChapterSection>

      {/* ── FINAL REFLECTION ── */}
      <ChapterSection num="07" accentRgb="120,67,238" id="m2-reflection">
        <div className="rv">
          {chLabel('Final Reflection · Module 02', 'var(--purple)')}
          {h2(<>What changed between Monday and Friday</>)}

          {para(<>Monday morning: 14 Figma screens. A redesigned onboarding for a problem that didn&apos;t exist. Two days of weekend work pointed in completely the wrong direction.</>)}
          {para(<>Friday morning: one page. Three insights. A brief that took ten minutes to produce three better ideas than the one Priya had arrived with on Monday.</>)}
          {para(<>She didn&apos;t know what the problem was until she asked. The Amplitude data gave her where. Kraftful gave her a starting hypothesis. The interviews gave her why. Dovetail helped her see the pattern. The brief turned the pattern into something her team could act on.</>)}
          {para(<>None of that required genius. It required asking before building.</>)}

          {pullQuote("Discovery is not a phase. It's the habit you build to stop solving the wrong problems.", 'var(--purple)')}

          <InfoBox title="The full toolkit Priya used this week" accent="var(--purple)">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { icon: '🔭', label: 'Discovery first', text: 'Resist the solution. Kiran\'s data, not Figma.' },
                { icon: '👥', label: 'Segmentation', text: 'Managers ≠ reps. Different jobs, different problems.' },
                { icon: '💼', label: 'JTBD', text: 'Rahul\'s job: prove coaching works to his director.' },
                { icon: '📊', label: 'Amplitude + Kraftful', text: 'Where it breaks + what users already say.' },
                { icon: '🎤', label: 'Interviews', text: 'Follow the story. Follow-ups over question lists.' },
                { icon: '🗂️', label: 'Dovetail + Notion', text: 'Tag, cluster, find the pattern. Then write the brief.' },
              ].map(item => (
                <div key={item.label} style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(120,67,238,0.06)', border: '1px solid rgba(120,67,238,0.15)' }}>
                  <div style={{ fontSize: '18px', marginBottom: '6px' }}>{item.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>{item.text}</div>
                </div>
              ))}
            </div>
          </InfoBox>
        </div>

        <div className="rv">
          <QuizEngine conceptId="jtbd" conceptName="Jobs to Be Done" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[4]} />

          <ApplyItBox
            prompt="Pick one thing your team is building right now. Write the job: '[User type] is trying to [accomplish what] in [what situation].' Now ask: have you talked to anyone who's failed to accomplish that job? If not — that's this week's research."
          />

          <NextChapterTeaser
            text="Module 03 · Problem Framing & Prioritization — Priya has three insights and a brief. Now: which one does she solve first? And how does she make that case to a team that wants to build all three?"
          />
        </div>
      </ChapterSection>
    </>
  );
}

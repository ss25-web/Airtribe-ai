'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizEngine from '../QuizEngine';
import {
  glassCard, demoLabel, chLabel, h2, para, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, ApplyItBox, PMPrincipleBox, NextChapterTeaser,
} from './designSystem';

const MODULE_CONTEXT = `Module 01 of Airtribe PM Fundamentals — Track: New to PM.
Follows Priya Sharma, first-time PM at EdSpark (B2B SaaS for sales coaching). Covers: PM role and responsibilities, problem vs solution thinking, working with teams, decision-making and tradeoffs, building with alignment, measuring outcomes, the Understand-Decide-Build-Measure loop.`;

const QUIZZES = [
  {
    question: "Your manager says 'Fix the payment flow — it's broken.' You have no data. What's your first move?",
    options: [
      'A. Start redesigning the payment UI',
      'B. Ask engineering to rebuild the flow',
      "C. Talk to users who had issues — find out what 'broken' actually means",
      'D. Add more payment options',
    ],
    correctIndex: 2,
    explanation: "You don't know yet what's broken. 'Fix the payment flow' is a direction, not a problem definition. Talk to users first. Their experience will tell you where the real issue is.",
    conceptId: 'pm-role',
    keyInsight: "Understand before you decide. Your job is to define the right problem — not jump to the first plausible fix.",
  },
  {
    question: "A user says 'I want a dark mode.' What does this tell you as a PM?",
    options: [
      'A. Add dark mode to the roadmap',
      'B. The user is right — dark mode is table stakes',
      "C. Someone wants something. You don't know why yet — dig deeper before deciding",
      'D. Survey all users about dark mode',
    ],
    correctIndex: 2,
    explanation: "A feature request is a signal, not a specification. The user wants dark mode — but why? Eye strain? They use the product at night? Preference? Each answer leads to different solutions. Ask why before you decide what to build.",
    conceptId: 'problem-definition',
    keyInsight: "Feature requests are symptoms. Always ask why before you decide what to build.",
  },
  {
    question: "You need a feature built. You have a solution in mind. What do you share with the engineer?",
    options: [
      'A. A detailed wireframe of exactly what to build',
      'B. The user problem and context — then ask for their input on options',
      'C. Just the deadline',
      'D. A spec with every edge case covered',
    ],
    correctIndex: 1,
    explanation: "Engineers make better implementation decisions when they understand the problem, not just the solution. They'll also catch issues with your proposed solution that you didn't see. Give context first.",
    conceptId: 'collaboration',
    keyInsight: "Share the problem. The team will find a better solution than you would alone.",
  },
  {
    question: "Sales wants a CRM integration. Customer success wants better reporting. You have 1 engineer for 2 weeks. How do you decide?",
    options: [
      'A. Build whichever stakeholder is more senior',
      'B. Build whichever takes fewer engineering days',
      'C. Find out what outcome the business most needs to drive right now — then pick what helps most',
      'D. Do both at 50% quality',
    ],
    correctIndex: 2,
    explanation: "Without knowing what outcome matters most (retention? revenue? activation?), you're just guessing. Get context first. Then choose the feature that moves the needle on what matters most right now.",
    conceptId: 'prioritization',
    keyInsight: "Before you prioritize features, know what outcome you're trying to drive.",
  },
  {
    question: "Midway through a sprint, you realize the engineer understood 'share results' differently than you meant. What do you do?",
    options: [
      'A. Wait until it ships, then give feedback',
      'B. Clarify immediately — catching it now is cheaper than fixing it after',
      'C. Write a more detailed spec for next time',
      'D. Escalate to the engineering manager',
    ],
    correctIndex: 1,
    explanation: "Misalignment compounds. A small misunderstanding on day 3 of a sprint becomes a big rebuild on day 14. Catch it early. Clarifying mid-sprint is not micromanaging — it's good alignment.",
    conceptId: 'collaboration',
    keyInsight: "Catch misalignments early. Small misunderstandings at the start become expensive problems at the end.",
  },
  {
    question: "Your new feature has been live for 2 weeks. How do you know if it worked?",
    options: [
      'A. If no one complained, it worked',
      'B. If the team is happy with how it shipped',
      'C. Check the metric you defined as success before you shipped',
      'D. Wait for the quarterly review',
    ],
    correctIndex: 2,
    explanation: "If you didn't define what 'working' looks like before you shipped, you have no way to evaluate it after. Define the success metric first. Then check it within a week of launch.",
    conceptId: 'north-star',
    keyInsight: "Define what success looks like before you build. Measure it after you ship.",
  },
  {
    question: "Which order correctly describes how a PM should approach any product decision?",
    options: [
      'A. Build → Measure → Understand → Decide',
      'B. Decide → Understand → Build → Measure',
      'C. Understand → Decide → Build → Measure',
      'D. Understand → Build → Measure → Decide',
    ],
    correctIndex: 2,
    explanation: "Understand the problem first. Then decide what to do about it. Then build — with the team aligned. Then measure whether it worked. This loop repeats for every feature, every sprint, every quarter.",
    conceptId: 'north-star',
    keyInsight: "Understand → Decide → Build → Measure. This loop never stops.",
  },
];

// ─────────────────────────────────────────
// INTERACTIVE 1: PM ROLE CHECKER
// ─────────────────────────────────────────
const PMRoleChecker = () => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const tasks = [
    { text: 'Decide what problem to solve next', owner: 'PM', reason: 'You own the what and why — which problems are worth solving.', color: 'var(--purple)', rgb: '120,67,238' },
    { text: 'Choose the programming language', owner: 'Engineering', reason: 'Engineers own the how — the technical implementation decisions.', color: 'var(--blue)', rgb: '58,134,255' },
    { text: 'Sketch the onboarding screens', owner: 'Design', reason: 'Designers own the experience — how users interact with the product.', color: 'var(--coral)', rgb: '224,122,95' },
    { text: 'Set the pricing model', owner: 'Business', reason: 'Business owns the commercial model — how the company makes money.', color: 'var(--teal)', rgb: '0,151,167' },
    { text: 'Write the feature spec', owner: 'PM', reason: 'You translate user problems into clear requirements for the team.', color: 'var(--purple)', rgb: '120,67,238' },
    { text: 'Build the API endpoint', owner: 'Engineering', reason: 'Engineers own the implementation — how features are built technically.', color: 'var(--blue)', rgb: '58,134,255' },
  ];

  return (
    <div style={glassCard('var(--purple)', '120,67,238')}>
      {demoLabel('Tap each task — whose job is it?', 'var(--purple)')}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {tasks.map((t, i) => (
          <motion.button key={i} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
            onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
            style={{ padding: '14px 16px', borderRadius: '14px', border: `2px solid ${revealed[i] ? t.color : 'rgba(120,67,238,0.18)'}`, background: revealed[i] ? `rgba(${t.rgb},0.08)` : 'var(--ed-card)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
            <div style={{ fontSize: '12px', color: 'var(--tx2)', marginBottom: revealed[i] ? '8px' : '0', lineHeight: 1.5 }}>{t.text}</div>
            <AnimatePresence>
              {revealed[i] && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, fontFamily: 'monospace', color: t.color, letterSpacing: '0.1em', marginBottom: '4px' }}>{t.owner.toUpperCase()}</div>
                  <div style={{ fontSize: '11px', color: 'var(--tx3)', lineHeight: 1.6 }}>{t.reason}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 2: SYMPTOM OR PROBLEM
// ─────────────────────────────────────────
const SymptomOrProblem = () => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const items = [
    { statement: '"The app is confusing."', verdict: 'Symptom', verdictColor: 'var(--coral)', explanation: "This is a feeling, not a problem. What task caused the confusion? Where exactly? We don't know yet. Dig deeper." },
    { statement: '"Users can\'t find call recordings from specific contacts in under 30 seconds."', verdict: 'Problem Statement', verdictColor: 'var(--green)', explanation: "Specific. Measurable. Describes what users are trying to do and where they struggle. Doesn't assume a solution." },
    { statement: '"The checkout button doesn\'t work."', verdict: 'Symptom', verdictColor: 'var(--coral)', explanation: "Maybe. Or maybe they didn't see it. Or had a payment error. Or the page timed out. 'Doesn't work' hides the real issue." },
    { statement: '"28% of users abandon checkout at the payment step, primarily due to unsupported payment methods."', verdict: 'Problem Statement', verdictColor: 'var(--green)', explanation: "This tells you who (28%), what (abandon), where (payment step), and why (unsupported methods). Now you can solve it." },
  ];

  return (
    <div style={glassCard('var(--teal)', '0,151,167')}>
      {demoLabel('Symptom or Problem Statement? Tap to find out.', 'var(--teal)')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, i) => (
          <motion.button key={i} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}
            onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
            style={{ padding: '16px 18px', borderRadius: '14px', border: `2px solid ${revealed[i] ? item.verdictColor : 'rgba(0,151,167,0.18)'}`, background: revealed[i] ? `rgba(${item.verdictColor === 'var(--green)' ? '21,129,88' : '224,122,95'},0.06)` : 'var(--ed-card)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
            <div style={{ fontSize: '13px', color: 'var(--tx2)', fontStyle: 'italic', marginBottom: revealed[i] ? '10px' : '0', lineHeight: 1.6 }}>{item.statement}</div>
            <AnimatePresence>
              {revealed[i] && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, fontFamily: 'monospace', color: item.verdictColor, letterSpacing: '0.12em', marginBottom: '6px' }}>{item.verdict.toUpperCase()}</div>
                  <div style={{ fontSize: '12px', color: 'var(--tx3)', lineHeight: 1.7 }}>{item.explanation}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 3: PRIORITY CALL
// ─────────────────────────────────────────
const PriorityCall = () => {
  const [chosen, setChosen] = useState<'a' | 'b' | null>(null);

  return (
    <div style={glassCard('var(--coral)', '224,122,95')}>
      {demoLabel('You have 1 engineer · 2 weeks · Make the call', 'var(--coral)')}
      <div style={{ fontSize: '13px', color: 'var(--tx3)', marginBottom: '16px', lineHeight: 1.7 }}>
        EdSpark is losing 40% of users in their first two weeks. At the same time, 3 enterprise customers are asking for a Salesforce integration. You can only do one.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        {[
          { key: 'a' as const, label: 'Salesforce Integration', sub: '3 enterprise customers asked · Medium engagement impact · 3-week build', color: 'var(--blue)', rgb: '58,134,255' },
          { key: 'b' as const, label: 'Onboarding Improvement', sub: '40% of users churn week 1 · High retention impact · 2-week build', color: 'var(--green)', rgb: '21,129,88' },
        ].map(opt => (
          <motion.button key={opt.key} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setChosen(opt.key)}
            style={{ padding: '18px 16px', borderRadius: '14px', border: `2px solid ${chosen === opt.key ? opt.color : `rgba(${opt.rgb},0.2)`}`, background: chosen === opt.key ? `rgba(${opt.rgb},0.1)` : 'var(--ed-card)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: chosen === opt.key ? opt.color : 'var(--tx)', marginBottom: '8px' }}>{opt.label}</div>
            {opt.sub.split(' · ').map((line, j) => (
              <div key={j} style={{ fontSize: '11px', color: 'var(--tx3)', lineHeight: 1.7 }}>{line}</div>
            ))}
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {chosen && (
          <motion.div key={chosen} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ padding: '16px 20px', borderRadius: '12px', background: chosen === 'b' ? 'rgba(21,129,88,0.08)' : 'rgba(58,134,255,0.08)', border: `1px solid ${chosen === 'b' ? 'rgba(21,129,88,0.2)' : 'rgba(58,134,255,0.2)'}`, borderLeft: `4px solid ${chosen === 'b' ? 'var(--green)' : 'var(--blue)'}` }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: chosen === 'b' ? 'var(--green)' : 'var(--blue)', marginBottom: '8px' }}>PM REASONING</div>
            {chosen === 'b' ? (
              <div style={{ fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.75 }}>
                Good call. 200 churning users per month is a bigger problem than 3 vocal customers. Onboarding fixes the leak before you pour more water in. That said — if those 3 customers represent 60% of ARR, the calculus changes. <em>Context always determines priority.</em>
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.75 }}>
                This can be right — if those 3 customers are existential to EdSpark's survival. But if they're not, you're solving for 3 people while 200 users leave every month. Make sure you know why you're making this call — instinct is not a strategy.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 4: METRIC PICKER
// ─────────────────────────────────────────
const MetricPicker = () => {
  const [chosen, setChosen] = useState<number | null>(null);

  const options = [
    { label: 'Page views on the onboarding page', quality: 'Weak', color: 'var(--coral)', explanation: "Tells you people saw it. Not whether it helped them do anything." },
    { label: 'Onboarding completion rate', quality: 'Best', color: 'var(--green)', explanation: "Did users make it through all steps? This is the core behavior you were trying to change. Start here." },
    { label: 'Time spent on the onboarding page', quality: 'Partial', color: 'var(--blue)', explanation: "Longer time could mean confusion, not engagement. This metric needs context to interpret." },
    { label: 'New user signups', quality: 'Wrong layer', color: 'var(--tx3)', explanation: "That's acquisition. You're trying to improve what happens after signup — not whether people sign up at all." },
  ];

  return (
    <div style={glassCard('var(--teal)', '0,151,167')}>
      {demoLabel('EdSpark\'s onboarding just shipped. Which metric do you check first?', 'var(--teal)')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {options.map((opt, i) => (
          <motion.button key={i} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}
            onClick={() => setChosen(i)}
            style={{ padding: '14px 18px', borderRadius: '12px', border: `2px solid ${chosen === i ? opt.color : 'rgba(0,151,167,0.18)'}`, background: chosen === i ? 'var(--ed-card)' : 'var(--ed-card)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: chosen === i ? '8px' : '0' }}>
              <span style={{ fontSize: '13px', color: 'var(--tx2)' }}>{opt.label}</span>
              {chosen === i && <span style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: opt.color, letterSpacing: '0.1em' }}>{opt.quality.toUpperCase()}</span>}
            </div>
            <AnimatePresence>
              {chosen === i && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <div style={{ fontSize: '12px', color: 'var(--tx3)', lineHeight: 1.7 }}>{opt.explanation}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 5: PROBLEM STATEMENT BUILDER
// ─────────────────────────────────────────
const PSB_STEPS = {
  who: {
    label: 'Who is affected?',
    options: ['Power users managing multiple accounts', 'New users in their first session', 'Admins doing bulk operations'],
  },
  what: {
    label: 'What were they trying to do?',
    options: ['export their monthly coaching reports', 'complete their first setup step', 'search for a specific call recording'],
  },
  where: {
    label: 'Where does it break down?',
    options: ['the file format doesn\'t match what their tool expects', 'the step loads but shows no progress', 'results don\'t appear even after several seconds'],
  },
} as const;
type PSBField = keyof typeof PSB_STEPS;

const ProblemStatementBuilder = () => {
  const [sel, setSel] = useState<Partial<Record<PSBField, string>>>({});
  const order: PSBField[] = ['who', 'what', 'where'];
  const currentStep = order.find(f => !sel[f]) ?? null;
  const done = order.every(f => sel[f]);

  const pick = (field: PSBField, val: string) => setSel(s => ({ ...s, [field]: val }));
  const reset = () => setSel({});

  return (
    <div style={glassCard('var(--teal)', '0,151,167')}>
      {demoLabel('Build a real problem statement — step by step', 'var(--teal)')}

      {/* Complaint */}
      <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'var(--ed-indigo-bg)', border: '1px solid var(--ed-indigo-border)', marginBottom: '20px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-indigo)', letterSpacing: '0.12em', marginBottom: '6px' }}>CUSTOMER COMPLAINT</div>
        <div style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--ed-ink)', lineHeight: 1.6 }}>&ldquo;The export feature is broken.&rdquo;</div>
      </div>

      {/* Assembled statement (builds live) */}
      <div style={{ padding: '14px 18px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', marginBottom: '20px', fontSize: '14px', lineHeight: 1.8, color: 'var(--ed-ink2)' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>YOUR PROBLEM STATEMENT</span>
        <span style={{ color: sel.who ? 'var(--ed-ink)' : 'var(--ed-ink3)', fontStyle: sel.who ? 'normal' : 'italic' }}>{sel.who ?? '[ who is affected ]'}</span>
        {' trying to '}
        <span style={{ color: sel.what ? 'var(--ed-ink)' : 'var(--ed-ink3)', fontStyle: sel.what ? 'normal' : 'italic' }}>{sel.what ?? '[ do what ]'}</span>
        {' find that '}
        <span style={{ color: sel.where ? 'var(--ed-ink)' : 'var(--ed-ink3)', fontStyle: sel.where ? 'normal' : 'italic' }}>{sel.where ?? '[ breaks where ]'}</span>
        {done ? '.' : ' …'}
      </div>

      {/* Step buttons */}
      {!done && currentStep && (
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ed-ink2)', marginBottom: '10px' }}>
            Step {order.indexOf(currentStep) + 1} / 3 — {PSB_STEPS[currentStep].label}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PSB_STEPS[currentStep].options.map((opt, i) => (
              <motion.button key={i} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }} onClick={() => pick(currentStep, opt)}
                style={{ padding: '12px 16px', borderRadius: '10px', border: '2px solid rgba(0,151,167,0.22)', background: 'var(--ed-card)', cursor: 'pointer', textAlign: 'left', fontSize: '13px', color: 'var(--ed-ink2)', transition: 'all 0.18s' }}>
                {opt}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Completed state */}
      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ padding: '14px 18px', borderRadius: '10px', background: 'var(--ed-green-bg)', border: '1px solid var(--ed-green-border)', borderLeft: '4px solid var(--ed-green)', marginBottom: '12px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-green)', letterSpacing: '0.12em', marginBottom: '6px' }}>COMPLETE PROBLEM STATEMENT</div>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>
                This has WHO, WHAT, and WHERE — the three things that make a problem statement actionable. From here, you can go find the root cause without building the wrong thing first.
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
// INTERACTIVE 6: RICE PRIORITIZATION LAB
// ─────────────────────────────────────────
const RICE_FEATURES = [
  { name: 'Search Improvements', color: 'var(--purple)', rgb: '120,67,238', defaults: { reach: 800, impact: 3, confidence: 85, effort: 2 } },
  { name: 'Onboarding Flow',     color: 'var(--green)',  rgb: '21,129,88',  defaults: { reach: 600, impact: 5, confidence: 90, effort: 2 } },
  { name: 'Mobile App',          color: 'var(--blue)',   rgb: '58,134,255', defaults: { reach: 400, impact: 4, confidence: 60, effort: 8 } },
  { name: 'Salesforce Integration', color: 'var(--teal)', rgb: '0,151,167', defaults: { reach: 150, impact: 5, confidence: 70, effort: 4 } },
];
type RiceScores = { reach: number; impact: number; confidence: number; effort: number };

const riceScore = (s: RiceScores) => Math.round((s.reach * s.impact * (s.confidence / 100)) / s.effort);

const RICELab = () => {
  const [active, setActive] = useState(0);
  const [scores, setScores] = useState<RiceScores[]>(RICE_FEATURES.map(f => ({ ...f.defaults })));

  const allScores = scores.map(riceScore);
  const maxScore = Math.max(...allScores, 1);
  const ranked = RICE_FEATURES.map((f, i) => ({ ...f, score: allScores[i], idx: i }))
    .sort((a, b) => b.score - a.score);

  const upd = (field: keyof RiceScores, val: number) =>
    setScores(s => s.map((item, i) => i === active ? { ...item, [field]: val } : item));

  const cur = scores[active];
  const feat = RICE_FEATURES[active];

  const sliders: Array<{ key: keyof RiceScores; label: string; min: number; max: number; step: number; unit: string; desc: string }> = [
    { key: 'reach',      label: 'Reach',      min: 50,  max: 2000, step: 50,  unit: ' users/mo',  desc: 'How many users affected per month?' },
    { key: 'impact',     label: 'Impact',     min: 1,   max: 5,    step: 1,   unit: 'x',          desc: '1 = minimal · 3 = medium · 5 = massive' },
    { key: 'confidence', label: 'Confidence', min: 50,  max: 100,  step: 5,   unit: '%',           desc: 'How confident in your estimates?' },
    { key: 'effort',     label: 'Effort',     min: 1,   max: 12,   step: 1,   unit: ' weeks',     desc: 'Engineering weeks to ship?' },
  ];

  return (
    <div style={glassCard('var(--coral)', '224,122,95')}>
      {demoLabel('RICE Calculator — adjust the inputs, watch the ranking change', 'var(--coral)')}

      {/* Feature tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {RICE_FEATURES.map((f, i) => (
          <button key={i} onClick={() => setActive(i)}
            style={{ padding: '7px 14px', borderRadius: '8px', border: `2px solid ${i === active ? f.color : 'var(--ed-rule)'}`, background: i === active ? `rgba(${f.rgb},0.1)` : 'var(--ed-card)', cursor: 'pointer', fontSize: '12px', fontWeight: i === active ? 700 : 400, color: i === active ? f.color : 'var(--ed-ink3)', transition: 'all 0.18s' }}>
            {f.name}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {sliders.map(sl => (
          <div key={sl.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ed-ink2)' }}>{sl.label}</span>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: feat.color, fontWeight: 700 }}>{cur[sl.key]}{sl.unit}</span>
            </div>
            <input type="range" min={sl.min} max={sl.max} step={sl.step} value={cur[sl.key]}
              onChange={e => upd(sl.key, Number(e.target.value))}
              style={{ width: '100%', accentColor: feat.color, cursor: 'pointer' }} />
            <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '2px' }}>{sl.desc}</div>
          </div>
        ))}
      </div>

      {/* RICE score for active */}
      <div style={{ padding: '12px 18px', borderRadius: '10px', background: `rgba(${feat.rgb},0.08)`, border: `1px solid rgba(${feat.rgb},0.25)`, marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', color: feat.color, letterSpacing: '0.12em', marginBottom: '2px' }}>RICE SCORE</div>
          <div style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>({cur.reach} × {cur.impact} × {cur.confidence}%) ÷ {cur.effort}</div>
        </div>
        <motion.div key={allScores[active]} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'monospace', color: feat.color }}>
          {allScores[active]}
        </motion.div>
      </div>

      {/* Ranked output */}
      <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.1em', marginBottom: '10px' }}>PRIORITY RANKING</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {ranked.map((f, rank) => (
          <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--ed-ink3)', width: '16px', textAlign: 'right' }}>#{rank + 1}</span>
            <span style={{ fontSize: '12px', color: f.idx === active ? f.color : 'var(--ed-ink2)', fontWeight: f.idx === active ? 700 : 400, width: '170px', flexShrink: 0 }}>{f.name}</span>
            <div style={{ flex: 1, height: '6px', background: 'var(--ed-rule)', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${(f.score / maxScore) * 100}%` }} transition={{ duration: 0.4 }}
                style={{ height: '100%', borderRadius: '3px', background: f.color }} />
            </div>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: f.color, width: '40px', textAlign: 'right', fontWeight: 700 }}>{f.score}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7, borderTop: '1px solid var(--ed-rule)', paddingTop: '12px' }}>
        Try setting Effort to 12 weeks for any feature — watch how it collapses the score. Effort is the most underestimated input in prioritization.
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 7: ALIGNMENT COST SIMULATOR
// ─────────────────────────────────────────
const SPEC_ITEMS = [
  {
    spec: 'Share results',
    vague: 'What does "share" mean? Link, email, Slack, export?',
    devBuilt: 'Dev built a "Copy link" button.',
    intended: 'You meant Slack integration — where EdSpark users actually work.',
    clarifyQ: 'How do users normally share results — link, email, or an integration like Slack?',
    rework: 4,
    ambiguity: 'HIGH' as const,
  },
  {
    spec: 'Add search functionality',
    vague: 'Search by what? Date, name, keyword, duration?',
    devBuilt: 'Dev built date-range search.',
    intended: '78% of users search by contact name — per Kiran\'s data.',
    clarifyQ: 'What do users search by most — contact name, date, or transcript keywords?',
    rework: 3,
    ambiguity: 'HIGH' as const,
  },
  {
    spec: 'Show a loading state',
    vague: 'Spinner, skeleton, progress bar, or message?',
    devBuilt: 'Dev used a generic spinner.',
    intended: 'A progress bar with estimated time — users on slow connections thought it was frozen.',
    clarifyQ: 'Should the loading state show progress or just indicate work is happening?',
    rework: 1,
    ambiguity: 'MEDIUM' as const,
  },
];

const AlignmentSim = () => {
  type Decision = 'clarify' | 'wait';
  const [idx, setIdx] = useState(0);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [phase, setPhase] = useState<'deciding' | 'outcome'>('deciding');

  const decide = (d: Decision) => {
    const next = [...decisions, d];
    setDecisions(next);
    setPhase('outcome');
  };

  const proceed = () => {
    if (idx + 1 < SPEC_ITEMS.length) {
      setIdx(i => i + 1);
      setPhase('deciding');
    }
  };

  const reset = () => { setIdx(0); setDecisions([]); setPhase('deciding'); };

  const totalRework = decisions.reduce((sum, d, i) => sum + (d === 'wait' ? SPEC_ITEMS[i].rework : 0), 0);
  const daysSaved = decisions.reduce((sum, d, i) => sum + (d === 'clarify' ? SPEC_ITEMS[i].rework : 0), 0);
  const done = decisions.length === SPEC_ITEMS.length;
  const item = SPEC_ITEMS[idx];
  const lastDecision = decisions[idx];

  return (
    <div style={glassCard('var(--green)', '21,129,88')}>
      {demoLabel('Sprint Alignment Simulator — clarify or ship and see what happens', 'var(--green)')}

      {/* Progress + running score */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {SPEC_ITEMS.map((_, i) => (
            <div key={i} style={{ width: '24px', height: '4px', borderRadius: '2px', background: i < decisions.length ? (decisions[i] === 'clarify' ? 'var(--ed-green)' : 'var(--coral)') : 'var(--ed-rule)', transition: 'background 0.3s' }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 900, fontFamily: 'monospace', color: 'var(--coral)' }}>{totalRework}d</div>
            <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.08em' }}>REWORK</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 900, fontFamily: 'monospace', color: 'var(--ed-green)' }}>{daysSaved}d</div>
            <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.08em' }}>SAVED</div>
          </div>
        </div>
      </div>

      {!done ? (
        <>
          {/* Spec item */}
          <div style={{ padding: '16px 18px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.1em' }}>SPEC ITEM {idx + 1} / {SPEC_ITEMS.length}</div>
              <span style={{ fontFamily: 'monospace', fontSize: '9px', padding: '2px 8px', borderRadius: '4px', background: item.ambiguity === 'HIGH' ? 'rgba(224,122,95,0.12)' : 'rgba(0,151,167,0.12)', color: item.ambiguity === 'HIGH' ? 'var(--coral)' : 'var(--teal)', fontWeight: 700 }}>{item.ambiguity} AMBIGUITY</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ed-ink)', fontFamily: 'monospace', marginBottom: '8px' }}>&ldquo;{item.spec}&rdquo;</div>
            <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', fontStyle: 'italic' }}>{item.vague}</div>
          </div>

          {/* Decision or outcome */}
          <AnimatePresence mode="wait">
            {phase === 'deciding' ? (
              <motion.div key="deciding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', marginBottom: '12px' }}>Sprint starts tomorrow. Do you clarify this now?</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => decide('clarify')}
                    style={{ padding: '14px 16px', borderRadius: '10px', border: '2px solid rgba(21,129,88,0.3)', background: 'var(--ed-card)', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-green)', marginBottom: '6px' }}>✓ Clarify now</div>
                    <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>Ask Dev one question before the sprint starts.</div>
                  </motion.button>
                  <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => decide('wait')}
                    style={{ padding: '14px 16px', borderRadius: '10px', border: '2px solid rgba(224,122,95,0.3)', background: 'var(--ed-card)', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--coral)', marginBottom: '6px' }}>→ Let Dev figure it out</div>
                    <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>They&apos;ll make a reasonable assumption.</div>
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="outcome" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                {lastDecision === 'clarify' ? (
                  <div style={{ padding: '14px 18px', borderRadius: '10px', background: 'var(--ed-green-bg)', border: '1px solid var(--ed-green-border)', borderLeft: '4px solid var(--ed-green)', marginBottom: '12px' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-green)', letterSpacing: '0.12em', marginBottom: '6px' }}>CLARIFICATION SENT</div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink)', marginBottom: '6px' }}>You asked: &ldquo;{item.clarifyQ}&rdquo;</div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{item.intended} Dev builds the right thing from day one. <strong style={{ color: 'var(--ed-green)' }}>+{item.rework} days saved.</strong></div>
                  </div>
                ) : (
                  <div style={{ padding: '14px 18px', borderRadius: '10px', background: 'rgba(224,122,95,0.08)', border: '1px solid rgba(224,122,95,0.2)', borderLeft: '4px solid var(--coral)', marginBottom: '12px' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--coral)', letterSpacing: '0.12em', marginBottom: '6px' }}>2 WEEKS LATER</div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink)', marginBottom: '6px' }}>{item.devBuilt}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{item.intended} <strong style={{ color: 'var(--coral)' }}>Rework: {item.rework} days.</strong></div>
                  </div>
                )}
                {idx + 1 < SPEC_ITEMS.length && (
                  <motion.button whileHover={{ opacity: 0.8 }} onClick={proceed}
                    style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--ed-ink2)', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                    Next spec item →
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        /* End summary */
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', marginBottom: '14px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.1em', marginBottom: '14px' }}>SPRINT COMPLETE — YOUR ALIGNMENT SCORE</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div style={{ textAlign: 'center', padding: '12px', borderRadius: '8px', background: 'var(--ed-cream)' }}>
                <div style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'monospace', color: 'var(--ed-green)' }}>{daysSaved}d</div>
                <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>saved</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', borderRadius: '8px', background: 'var(--ed-cream)' }}>
                <div style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'monospace', color: 'var(--coral)' }}>{totalRework}d</div>
                <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>rework</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', borderRadius: '8px', background: 'var(--ed-cream)' }}>
                <div style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'monospace', color: totalRework === 0 ? 'var(--ed-green)' : totalRework <= 3 ? 'var(--blue)' : 'var(--coral)' }}>
                  {totalRework === 0 ? 'A+' : totalRework <= 3 ? 'B+' : 'C'}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>grade</div>
              </div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>
              {totalRework === 0
                ? 'Perfect alignment. Every clarification you asked saved real time. This is what good spec hygiene looks like.'
                : totalRework <= 3
                ? `You caught some, missed some. ${totalRework} days of rework is recoverable — but it adds up across every sprint.`
                : `${totalRework} days of rework in a single sprint. One 5-minute question per item would have saved all of it.`}
            </div>
          </div>
          <motion.button whileHover={{ opacity: 0.8 }} onClick={reset}
            style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ed-ink3)', background: 'none', border: '1px solid var(--ed-rule)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
            Try again →
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// INTRO HERO — editorial
// ─────────────────────────────────────────
const PARTS = [
  { roman: 'I',   label: 'What a PM actually does' },
  { roman: 'II',  label: 'Problem vs solution thinking' },
  { roman: 'III', label: 'Working with teams' },
  { roman: 'IV',  label: 'Making hard decisions' },
  { roman: 'V',   label: 'Building with alignment' },
  { roman: 'VI',  label: 'Measuring outcomes' },
];

const IntroHero = () => (
  <section style={{ padding: '56px 0 48px', borderBottom: '1px solid var(--ed-rule)', position: 'relative', overflow: 'hidden' }}>

    {/* Background decorative dots */}
    <div aria-hidden="true" style={{
      position: 'absolute', right: '-40px', top: '20px', width: '320px', height: '320px',
      backgroundImage: 'radial-gradient(circle, var(--ed-rule) 1px, transparent 1px)',
      backgroundSize: '22px 22px', opacity: 0.6, pointerEvents: 'none',
    }} />

    <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
      {/* Left: text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Breadcrumb */}
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ed-ink3)', marginBottom: '28px', letterSpacing: '0.04em' }}>
          PM Fundamentals <span style={{ margin: '0 8px', color: 'var(--ed-rule)' }}>›</span>
          <span style={{ color: 'var(--ed-ink2)' }}>Foundations Track</span>
          <span style={{ margin: '0 10px', color: 'var(--ed-rule)' }}>·</span>
          <span style={{ color: 'var(--ed-ink3)' }}>30 min · 7 parts</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(26px, 3.2vw, 44px)', fontWeight: 700, lineHeight: 1.12,
          letterSpacing: '-0.025em', marginBottom: '18px', color: 'var(--ed-ink)',
          fontFamily: "'Lora', 'Georgia', 'Times New Roman', serif",
        }}>
          Everything you need to know<br />
          <span style={{ color: 'var(--ed-indigo)' }}>to think like a PM</span>
        </h1>

        <p style={{ fontSize: '17px', color: 'var(--ed-ink2)', lineHeight: 1.8, maxWidth: '500px', marginBottom: '36px' }}>
          30 minutes. 7 concepts. One story. Follow Priya through her first weeks as a product manager — her confusion is your curriculum.
        </p>

        {/* Parts grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '28px' }}>
          {PARTS.map(m => (
            <div key={m.roman} style={{
              padding: '11px 14px', borderRadius: '7px',
              background: 'var(--ed-card)',
              border: '1px solid var(--ed-rule)',
              display: 'flex', gap: '10px', alignItems: 'baseline',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
                fontWeight: 700, color: 'var(--ed-indigo)', flexShrink: 0,
              }}>{m.roman}.</span>
              <span style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.4 }}>{m.label}</span>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{
          padding: '18px 22px', borderRadius: '8px',
          background: 'var(--ed-card)',
          borderTop: '1px solid var(--ed-rule)',
          borderRight: '1px solid var(--ed-rule)',
          borderBottom: '1px solid var(--ed-rule)',
          borderLeft: '4px solid var(--ed-indigo)',
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700,
            letterSpacing: '0.16em', color: 'var(--ed-indigo)', textTransform: 'uppercase' as const,
            marginBottom: '10px',
          }}>How this works</div>
          <div style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.8 }}>
            Each part follows <strong style={{ color: 'var(--ed-ink)' }}>Priya Sharma</strong>, a first-time PM at EdSpark, through a real situation that surfaces one key idea. Four guides — <strong style={{ color: 'var(--ed-ink)' }}>Asha</strong>, <strong style={{ color: 'var(--ed-ink)' }}>Dev</strong>, <strong style={{ color: 'var(--ed-ink)' }}>Maya</strong>, and <strong style={{ color: 'var(--ed-ink)' }}>Kiran</strong> — appear when Priya gets stuck.
          </div>
        </div>
      </div>

      {/* Right: 3D floating module card */}
      <div style={{ flexShrink: 0, width: '168px', paddingTop: '48px' }}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}>
          <div className="float3d" style={{ transformStyle: 'preserve-3d' }}>
          <div style={{
            background: 'linear-gradient(145deg, #1A1612 0%, #2A2018 100%)',
            borderRadius: '14px',
            padding: '20px 18px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            {/* Card header */}
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: '#7843EE', marginBottom: '10px' }}>
              MODULE 01
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>
              PM Fundamentals
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(240,232,216,0.45)', marginBottom: '16px' }}>
              Foundations Track
            </div>

            {/* Progress bar */}
            <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '14px' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '30%' }}
                transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
                style={{ height: '100%', background: '#4F46E5', borderRadius: '1px' }}
              />
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {[{ val: '7', lbl: 'parts' }, { val: '30', lbl: 'min' }].map(s => (
                <div key={s.lbl} style={{
                  flex: 1, padding: '6px 0', borderRadius: '6px',
                  background: 'rgba(255,255,255,0.05)', textAlign: 'center' as const,
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#F0E8D8', fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</div>
                  <div style={{ fontSize: '8px', color: 'rgba(240,232,216,0.4)', letterSpacing: '0.08em' }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </motion.div>

        {/* Airtribe badge */}
        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
          <div style={{
            width: '16px', height: '16px', borderRadius: '4px',
            background: 'linear-gradient(135deg, #7843EE, #4F46E5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
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
export default function Track1NewPM() {
  return (
    <>
      <IntroHero />

      {/* ── PART 1: What is a PM ── */}
      <ChapterSection num="01" accentRgb="120,67,238" id="part1-what-is-pm" first>
        <div className="rv">
          {chLabel('Part 1 · The PM Role', 'var(--purple)')}
          {h2(<>What does a Product Manager actually do?</>)}

          {/* Learning objectives */}
          <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'rgba(120,67,238,0.06)', border: '1px solid rgba(120,67,238,0.18)', marginBottom: '28px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--purple)', letterSpacing: '0.14em', marginBottom: '10px' }}>BY THE END OF THIS PART</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '7px' }}>
              {[
                'Understand what a PM actually owns — and what they don\'t',
                'Know how a PM fits next to engineering, design, and business',
                'Recognise the difference between a problem and a solution',
              ].map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--purple)', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>→</span>
                  <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          <SituationCard accent="var(--purple)" accentRgb="120,67,238">
            Priya&apos;s first day at EdSpark. She&apos;s been given the title &ldquo;Product Manager.&rdquo; She expected to design features, manage a team, sit in strategy meetings. Instead, her manager says six words: &ldquo;You&apos;re responsible for the product.&rdquo; Priya nods. She has no idea what that means.
          </SituationCard>

          {para(<>She spends the morning looking busy. She opens Figma. Closes it. Opens Jira. Closes it. By 11am she types into Google: &ldquo;what does a product manager actually do.&rdquo; The results are not helpful.</>)}

          {para(<>That afternoon, Asha — a senior PM who&apos;s been at EdSpark three years — pulls up a chair.</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Asha"
            nameColor="var(--purple-light)"
            borderColor="var(--purple)"
            content={<>&ldquo;What do you think your job is?&rdquo; she asks.<br /><br />Priya: &ldquo;Build features? Manage the roadmap? Make decisions about the product?&rdquo;<br /><br />Asha: &ldquo;Close. But not quite. Here&apos;s the thing — engineers build the product. Designers shape how it feels. Business decides how it makes money. So what&apos;s left for you?&rdquo;<br /><br />Priya: &ldquo;I... don&apos;t know.&rdquo;<br /><br />Asha: &ldquo;Your job is to make sure the <em>right</em> thing gets built. Not to build it yourself. The PM is the person who asks: <em>why are we building this at all?</em> And: <em>is this the most important thing to build right now?</em>&rdquo;</>}
            expandedContent={<>Think of it this way. Engineering owns the HOW — how features are built, what&apos;s technically possible. Design owns the experience — how it looks and feels for users. Business owns the commercial model — how the company makes money. The PM is the one who connects all three and asks: given what users need, what&apos;s technically feasible, and what the business requires — what should we actually build? That&apos;s the whole job. It sounds simple. In practice, it&apos;s the hardest role on the team.</>}
          />
        </div>

        <div className="rv">
          {para(<>Priya thinks about it. &ldquo;So I don&apos;t tell engineers what to build?&rdquo;</>)}
          {para(<>Asha: &ldquo;You tell them <em>what problem to solve</em>. They figure out how to solve it. That distinction matters more than you think.&rdquo;</>)}
          {pullQuote('A PM\'s job isn\'t to have the best ideas. It\'s to make sure the team is solving the most important problem.', 'var(--purple)')}
        </div>

        <div className="rv">
          <div style={{ margin: '8px 0 24px' }}><PMRoleChecker /></div>

          {keyBox('What a PM owns — and what they don\'t', [
            'WHAT gets built — which problem to solve, and why now',
            'WHY it gets built — the user need and business goal behind it',
            'WHETHER it worked — measuring the outcome, not just the output',
            'NOT the how — that belongs to engineering',
            'NOT the visual design — that belongs to design',
          ], 'var(--purple)')}

          <PMPrincipleBox principle="A PM's job isn't to build features — it's to figure out what's worth building and why." color="var(--purple)" />
          <ApplyItBox prompt="Think of a product you use every day. What problem does it solve for you? Now ask: who at that company decides what gets built next? That's the PM." color="var(--purple)" />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine conceptId="pm-role" conceptName="The PM Role" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[0]} />
        </div>
        <NextChapterTeaser text="Priya gets her first user complaint on day 3. Her instinct is to fix it immediately — open Figma, sketch a solution, move fast. That instinct is the mistake. Next: The First Mistake." accent="var(--teal)" />
      </ChapterSection>

      {/* ── PART 2: The First Mistake ── */}
      <ChapterSection num="02" accentRgb="0,151,167" id="part2-first-mistake">
        <div className="rv">
          {chLabel('Part 2 · Problem vs Solution Thinking', 'var(--teal)')}
          {h2(<>Don&apos;t solve the problem yet. Understand it first.</>)}
          <SituationCard accent="var(--teal)" accentRgb="0,151,167">
            Three days in. An email arrives from a customer: &ldquo;Your app is confusing. I can never find what I need.&rdquo; Priya opens Figma. She starts sketching a new navigation. She feels productive. She&apos;s making a classic mistake.
          </SituationCard>

          {para(<>Maya, the designer, walks past Priya&apos;s screen and stops.</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Maya"
            nameColor="var(--coral)"
            borderColor="var(--coral)"
            content={<>&ldquo;What did the user say exactly?&rdquo;<br /><br />Priya: &ldquo;The app is confusing.&rdquo;<br /><br />Maya: &ldquo;That&apos;s a feeling. Not a problem. What were they trying to do when they felt confused?&rdquo;<br /><br />Priya: &ldquo;I... don&apos;t know. I assumed it was navigation.&rdquo;<br /><br />Maya: &ldquo;Maybe. Or maybe they couldn&apos;t find a specific feature. Or the language was unclear. Or the page loaded slowly. Or they were new and had no idea where to start. Each of those is a completely different fix.&rdquo;</>}
            expandedContent={<>Designers see this constantly — a complaint comes in, someone jumps to a visual solution, and we end up redesigning things that weren&apos;t the problem. The most expensive thing in product is building the right solution to the wrong problem. Before you open Figma, write one sentence: &ldquo;Users who are trying to [X] experience [Y] because [Z].&rdquo; If you can&apos;t fill in all three, you&apos;re not ready to design anything yet.</>}
          />
        </div>

        <div className="rv">
          {para(<>Priya closes Figma. She emails the customer one question: &ldquo;What were you trying to do when it felt confusing?&rdquo;</>)}
          {para(<>The customer replies: &ldquo;I was trying to find the call recording from last Tuesday.&rdquo;</>)}
          {para(<>It wasn&apos;t navigation. It was search.</>)}
          {pullQuote('A symptom is not a problem. Dig one level deeper before you touch Figma.', 'var(--teal)')}
        </div>

        <div className="rv">
          <Avatar
            name="Asha"
            nameColor="var(--purple-light)"
            borderColor="var(--purple)"
            content={<>Priya tells Asha what happened. &ldquo;I almost redesigned the entire navigation for a search problem.&rdquo;<br /><br />Asha: &ldquo;This happens to everyone. We call it solution-first thinking. You see a complaint, your brain jumps to a fix. The fix feels productive. But you&apos;ve skipped the most important step.&rdquo;<br /><br />Priya: &ldquo;Understanding the actual problem.&rdquo;<br /><br />Asha: &ldquo;Exactly. A user complaint is a signal, not a specification. It tells you something is wrong. It doesn&apos;t tell you what.&rdquo;</>}
            expandedContent={<>Here&apos;s the test I use. A good problem statement has three parts: WHO is experiencing it, WHAT they&apos;re trying to do, and WHERE it breaks down. &ldquo;The app is confusing&rdquo; has none of those. &ldquo;Users trying to find past call recordings can&apos;t locate them in under 30 seconds&rdquo; has all three. That second version tells you exactly what to solve — and gives you a way to know when you&apos;ve solved it.</>}
          />
        </div>

        <div className="rv" style={{ margin: '24px 0' }}>
          <SymptomOrProblem />
        </div>

        <div className="rv" style={{ margin: '24px 0' }}>
          <ProblemStatementBuilder />
        </div>

        <div className="rv">
          <PMPrincipleBox principle="Define the problem before you define the solution. Users describe symptoms — not root causes." color="var(--teal)" />
          <ApplyItBox prompt="Think of the last feature request you heard. Was it a problem statement or a solution request? Rewrite it as a problem: 'Users who are trying to [X] experience [Y].'" color="var(--teal)" />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine conceptId="problem-definition" conceptName="Problem vs Solution Thinking" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[1]} />
        </div>
        <NextChapterTeaser text="Now Priya knows the real problem. She has a solution in mind. She walks over to Dev. That conversation doesn't go how she expected. Next: Working with Teams." accent="var(--blue)" />
      </ChapterSection>

      {/* ── PART 3: Working with Teams ── */}
      <ChapterSection num="03" accentRgb="58,134,255" id="part3-teams">
        <div className="rv">
          {chLabel('Part 3 · Working with Teams', 'var(--blue)')}
          {h2(<>You don&apos;t manage anyone. That&apos;s the point.</>)}
          <SituationCard accent="var(--blue)" accentRgb="58,134,255">
            Priya walks over to Dev with a rough wireframe. She&apos;s sketched a search bar for the recordings page. &ldquo;Can you add this? I need it by Friday.&rdquo; Dev looks at the wireframe, then at Priya.
          </SituationCard>
        </div>

        <div className="rv">
          <Avatar
            name="Dev"
            nameColor="var(--blue)"
            borderColor="var(--blue)"
            content={<>&ldquo;What kind of search?&rdquo;<br /><br />Priya: &ldquo;Just... search. For recordings.&rdquo;<br /><br />Dev: &ldquo;By date? By contact name? Keywords in the transcript? Duration? Those are four completely different things to build. Also — Friday? We have two other things this sprint. To do this properly, I&apos;d need at least a week.&rdquo;<br /><br />Priya feels like she&apos;s failed some test she didn&apos;t know she was taking.<br /><br />Dev: &ldquo;Don&apos;t worry. But next time — tell me the problem. Not the solution. Let me figure out what&apos;s actually buildable and what tradeoffs you&apos;d be making.&rdquo;</>}
            expandedContent={<>I don&apos;t say this to make PMs feel bad. I say it because when someone gives me a wireframe without context, I build exactly what&apos;s in the wireframe — even if there&apos;s a better solution two feet away. But when someone tells me the problem, I bring everything I know about the system to it. I&apos;ll often find an approach that&apos;s faster to build and solves the problem better. Give me the problem. I&apos;ll find a way in.</>}
          />
        </div>

        <div className="rv">
          {para(<>Priya goes back. This time she says: &ldquo;Users are struggling to find past call recordings from specific contacts. 34% of search attempts end with users giving up. What are our options?&rdquo;</>)}
          {para(<>Dev: &ldquo;Okay. That I can work with. Give me a day.&rdquo;</>)}
          {para(<>While she&apos;s at it, Priya asks Maya what she&apos;s observed about how users search.</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Maya"
            nameColor="var(--coral)"
            borderColor="var(--coral)"
            content={<>&ldquo;I&apos;ve been watching session recordings for weeks,&rdquo; Maya says. &ldquo;Users search by contact name — not date. They remember who they talked to. Not when. If you build date-based search, it&apos;ll solve the wrong problem.&rdquo;</>}
            expandedContent={<>This is why design research matters before the build starts, not after. Session recordings, user interviews, click maps — they all tell you how users actually behave, not how they say they behave. The gap between those two is often where product decisions go wrong.</>}
          />
          <Avatar
            name="Kiran"
            nameColor="var(--teal)"
            borderColor="var(--teal)"
            content={<>Kiran pulls up the analytics. &ldquo;Confirms it. 78% of search queries in the logs include a person&apos;s name. Only 12% include a date. If you optimize for dates, you&apos;re solving for 12% of the problem.&rdquo;</>}
            expandedContent={<>Data doesn&apos;t replace judgment — it informs it. In this case, the data makes the decision obvious. But even when it&apos;s less clear, start with the data before you start with assumptions. You&apos;ll be surprised how often the data tells you something you didn&apos;t expect.</>}
          />
        </div>

        <div className="rv">
          {para(<>Priya realizes: she had a wireframe but no insight. The team had insight she hadn&apos;t asked for.</>)}
          {para(<>Her job isn&apos;t to hand down solutions. It&apos;s to bring the problem to the team — and let specialists solve it together.</>)}

          {keyBox('PM as the alignment role', [
            'Share the user problem — not the feature spec',
            'Give context on WHY this matters now',
            'Ask "what are our options?" — not "can you build this?"',
            'The team will find a better solution together than you will alone',
          ], 'var(--blue)')}

          <PMPrincipleBox principle="PMs lead through context, not commands. Give the problem. The team finds the solution." color="var(--blue)" />
          <ApplyItBox prompt="Think of the last time you asked someone to build something. Did you share the problem or the solution? What information were you holding back that they could have used?" color="var(--blue)" />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine conceptId="collaboration" conceptName="Working with Teams" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[2]} />
        </div>
        <NextChapterTeaser text="The team knows what to build. But there are five other things they could build. Priya has one engineer. Two weeks. She has to choose. Next: Making Decisions." accent="var(--coral)" />
      </ChapterSection>

      {/* ── PART 4: Making Decisions ── */}
      <ChapterSection num="04" accentRgb="224,122,95" id="part4-decisions">
        <div className="rv">
          {chLabel('Part 4 · Making Decisions & Tradeoffs', 'var(--coral)')}
          {h2(<>You can&apos;t build everything. That&apos;s not a bug — it&apos;s the job.</>)}
          <SituationCard accent="var(--coral)" accentRgb="224,122,95">
            Sprint planning. Priya&apos;s list: search improvements, onboarding flow, mobile app, Salesforce integration, notification system. One engineer. Two weeks. Every stakeholder believes their item is the most important. The VP of Sales is very loud about the Salesforce integration.
          </SituationCard>
        </div>

        <div className="rv">
          <Avatar
            name="Asha"
            nameColor="var(--purple-light)"
            borderColor="var(--purple)"
            content={<>Priya brings the list to Asha. &ldquo;How do I choose?&rdquo;<br /><br />Asha: &ldquo;Before you pick a feature — what outcome is EdSpark trying to improve right now?&rdquo;<br /><br />Priya: &ldquo;Users like the product?&rdquo;<br /><br />Asha: &ldquo;More specifically. Are you trying to grow? Retain? Activate? Those are different problems with different solutions. You can&apos;t prioritize features without knowing what goal you&apos;re prioritizing toward.&rdquo;</>}
            expandedContent={<>This is the mistake I see most often in new PMs — prioritizing features without anchoring to an outcome. Every stakeholder will tell you their feature is the most important. They&apos;re not lying. From their vantage point, it is. Your job is to find the outcome that matters most to the business right now, and pick the feature that most directly drives it. That gives you a defensible reason to say no to everything else.</>}
          />
        </div>

        <div className="rv">
          {para(<>Priya does the work. Talks to the CEO. Talks to customer success. Asks Kiran to pull the data.</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Kiran"
            nameColor="var(--teal)"
            borderColor="var(--teal)"
            content={<>&ldquo;40% of users churn in the first two weeks,&rdquo; Kiran says, pulling up a cohort chart. &ldquo;They sign up. They poke around. They leave and never come back. We traced it — most of them never completed onboarding. They never got to the first value moment.&rdquo;<br /><br />Priya: &ldquo;So the Salesforce integration...&rdquo;<br /><br />Kiran: &ldquo;Three customers asked. We lose 200 users a month to bad onboarding.&rdquo;</>}
            expandedContent={<>The Salesforce integration might be the right call if those three customers represent 60% of ARR. That&apos;s a business decision, not a product decision. But if you&apos;re making it without knowing that number, you&apos;re guessing. Always find the numbers before you make the call.</>}
          />
        </div>

        <div className="rv">
          {para(<>Now the choice is clearer. Priya chooses onboarding.</>)}
          {para(<>The VP of Sales is unhappy. He sends a message in Slack. Priya takes a breath and replies with the data.</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Asha"
            nameColor="var(--purple-light)"
            borderColor="var(--purple)"
            content={<>&ldquo;You&apos;re going to be saying no to someone, always,&rdquo; Asha tells her. &ldquo;The question isn&apos;t how to avoid that. It&apos;s how to make sure the no is the right no. A no backed by data and strategy is something people can respect, even if they don&apos;t like it. A no that&apos;s just &apos;not right now&apos; is just friction.&rdquo;</>}
            expandedContent={<>Prioritization is a negotiation, not a formula. Frameworks like RICE help you structure the conversation and surface assumptions. But the actual decision requires judgment — about the business stage, the competitive environment, the team&apos;s capacity. Get comfortable making that call, owning it, and explaining it clearly. That&apos;s what separates a PM from a backlog manager.</>}
          />
        </div>

        <div className="rv" style={{ margin: '24px 0' }}>
          <PriorityCall />
        </div>

        <div className="rv" style={{ margin: '24px 0' }}>
          <RICELab />
        </div>

        <div className="rv">
          <PMPrincipleBox principle="Before you prioritize features, know what outcome you're trying to drive. Then choose what most directly gets you there." color="var(--coral)" />
          <ApplyItBox prompt="What's the single most important metric your product needs to improve right now? If you don't know, find out before your next sprint planning." color="var(--coral)" />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine conceptId="prioritization" conceptName="Making Decisions & Tradeoffs" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[3]} />
        </div>
        <NextChapterTeaser text="Priya chose. The build begins. Two weeks later, something small went wrong. Very small. And very expensive. Next: Building & Alignment." accent="var(--green)" />
      </ChapterSection>

      {/* ── PART 5: Building & Alignment ── */}
      <ChapterSection num="05" accentRgb="21,129,88" id="part5-building">
        <div className="rv">
          {chLabel('Part 5 · Building & Staying Aligned', 'var(--green)')}
          {h2(<>A spec is not a contract. Alignment is a habit.</>)}
          <SituationCard accent="var(--green)" accentRgb="21,129,88">
            The onboarding feature ships. Three steps: upload a recording, analyze it, share the results. Priya tests it herself. Steps 1 and 2 work perfectly. Step 3: &ldquo;Share results via link.&rdquo; She checks her spec. She wrote &ldquo;share results.&rdquo; That&apos;s all she wrote. Dev built a link. Most EdSpark users share to Slack.
          </SituationCard>

          {para(<>Priya stares at the screen. She reads her spec again. It was ambiguous. Dev made a reasonable assumption. It&apos;s not his fault.</>)}
          {para(<>She goes to find Dev anyway — not to complain, but to understand.</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Dev"
            nameColor="var(--blue)"
            borderColor="var(--blue)"
            content={<>&ldquo;You wrote &apos;share results.&apos; I built that,&rdquo; Dev says. &ldquo;I didn&apos;t know how sharing usually happens. If you know that, tell me. I&apos;m not guessing to annoy you — I genuinely didn&apos;t have that context.&rdquo;<br /><br />Priya: &ldquo;Fair. I should have specified.&rdquo;<br /><br />Dev: &ldquo;Also — did you check in during the sprint at all?&rdquo;<br /><br />Priya: &ldquo;No. I didn&apos;t want to micromanage.&rdquo;<br /><br />Dev: &ldquo;There&apos;s a difference. Checking in is not micromanaging.&rdquo;</>}
            expandedContent={<>A spec is a starting point, not a complete specification of reality. Things that feel obvious to a PM are often genuinely ambiguous to an engineer who hasn&apos;t been in every stakeholder conversation. The solution isn&apos;t longer specs — it&apos;s more conversation. Check in mid-sprint. Ask: does your understanding of &apos;done&apos; match mine? If not, fix it then — not in the retrospective.</>}
          />
        </div>

        <div className="rv">
          <Avatar
            name="Asha"
            nameColor="var(--purple-light)"
            borderColor="var(--purple)"
            content={<>Priya: &ldquo;Should I have been more specific in the spec?&rdquo;<br /><br />Asha: &ldquo;Sometimes. But the bigger question — did you talk to Dev at all during those two weeks?&rdquo;<br /><br />Priya: &ldquo;No. I assumed it was going fine.&rdquo;<br /><br />Asha: &ldquo;That assumption cost you a week of re-work. Alignment isn&apos;t a kickoff meeting. It&apos;s a habit. You&apos;re not done when the sprint starts.&rdquo;</>}
            expandedContent={<>The most common thing I hear from PMs is &apos;I don&apos;t want to micromanage.&apos; I understand the instinct. But there&apos;s a meaningful difference between checking on a person and checking on shared understanding. You&apos;re not checking whether Dev is working hard. You&apos;re checking whether what&apos;s being built still matches what you both meant when the sprint started. That&apos;s not micromanagement. That&apos;s product management.</>}
          />
        </div>

        <div className="rv">
          {keyBox('How to stay aligned during a build', [
            'Check in midway — not to manage, to catch misunderstandings early',
            'If a word in your spec could mean two things, clarify it before it\'s built',
            'Read your spec from the engineer\'s perspective — what assumptions would you make?',
            'A quick 10-minute sync mid-sprint is cheaper than a week of rework at the end',
          ], 'var(--green)')}

          <PMPrincipleBox principle="Alignment isn't a kickoff meeting. It's a continuous habit. Small misunderstandings at the start become expensive problems at the end." color="var(--green)" />
          <ApplyItBox prompt="Think of the last thing you handed off to someone. What word or phrase in your brief could have been misunderstood? What would you clarify next time?" color="var(--green)" />
        </div>

        <div className="rv" style={{ margin: '24px 0' }}>
          <AlignmentSim />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine conceptId="collaboration" conceptName="Building & Alignment" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[4]} />
        </div>
        <NextChapterTeaser text="The feature ships. The team celebrates. Two weeks pass. Kiran walks over with data. Priya won't like what she sees. Next: Measuring Outcomes." accent="var(--teal)" />
      </ChapterSection>

      {/* ── PART 6: Measuring Outcomes ── */}
      <ChapterSection num="06" accentRgb="0,151,167" id="part6-measuring">
        <div className="rv">
          {chLabel('Part 6 · Measuring What Matters', 'var(--teal)')}
          {h2(<>Shipping is not success. Measuring is.</>)}
          <SituationCard accent="var(--teal)" accentRgb="0,151,167">
            Two weeks after the onboarding feature ships, Kiran sits down next to Priya with a laptop. &ldquo;Have you looked at the data?&rdquo; Priya had been working on the next feature. She assumed onboarding was fine. &ldquo;Completion rate is 22%. We expected 60.&rdquo; Priya&apos;s stomach drops.
          </SituationCard>
        </div>

        <div className="rv">
          <Avatar
            name="Kiran"
            nameColor="var(--teal)"
            borderColor="var(--teal)"
            content={<>&ldquo;What did you define as success before we shipped?&rdquo;<br /><br />Priya: &ldquo;Users completing onboarding.&rdquo;<br /><br />Kiran: &ldquo;What number? And when were you going to check?&rdquo;<br /><br />Priya doesn&apos;t have answers.<br /><br />Kiran: &ldquo;That&apos;s the problem. If you didn&apos;t define what &apos;working&apos; looks like before you shipped, you can&apos;t know if it&apos;s working after.&rdquo;</>}
            expandedContent={<>Before every launch, I ask PMs three questions: What behavior are you trying to change? What number tells you that behavior has changed? When are you checking? If you can&apos;t answer all three, the feature isn&apos;t ready to ship — or at least, you&apos;re not ready to evaluate it. Shipping without measurement is just hope.</>}
          />
        </div>

        <div className="rv">
          {para(<>They dig in together. Watch session recordings. Talk to users who didn&apos;t complete.</>)}
          {para(<>The culprit: Step 2 — &ldquo;Analyze&rdquo; — takes 45 seconds to load. On a slow connection it looks frozen. Users assume it broke. They leave.</>)}
          {para(<>The feature wasn&apos;t broken. The experience was. And they only found it because Kiran pulled the data.</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Kiran"
            nameColor="var(--teal)"
            borderColor="var(--teal)"
            content={<>&ldquo;The metric told us something was wrong. The investigation told us what. That&apos;s how it&apos;s supposed to work.&rdquo;<br /><br />Priya: &ldquo;What should I have done differently?&rdquo;<br /><br />Kiran: &ldquo;Before you shipped: define what success looks like in a number. After you ship: check it within a week. Don&apos;t wait a month. A week. Things that are broken need to be found fast.&rdquo;</>}
            expandedContent={<>The metric I care about most for any new feature isn&apos;t the vanity metric — page views, impressions. It&apos;s the completion metric: did users do the thing the feature was designed for? For onboarding, that&apos;s completion rate. For search, it&apos;s successful searches. For sharing, it&apos;s shares that resulted in someone opening the shared content. Find the behavior that proves the feature is doing what it was meant to do. That&apos;s your metric.</>}
          />
        </div>

        <div className="rv" style={{ margin: '24px 0' }}>
          <MetricPicker />
        </div>

        <div className="rv">
          {keyBox('How to measure like a PM', [
            'Before you build: define what success looks like — in a number',
            'After you ship: check that number within one week, not one month',
            'Look downstream: did users complete the core action — not just open the feature?',
            'The metric tells you something\'s wrong. Investigation tells you what.',
          ], 'var(--teal)')}

          <PMPrincipleBox principle="Measure what happens after you ship. Define what 'working' looks like before you build — so you know what to look for after." color="var(--teal)" />
          <ApplyItBox prompt="Name a feature you shipped recently. What metric would tell you it worked? Did you check it? If not — check it now." color="var(--teal)" />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine conceptId="north-star" conceptName="Measuring Outcomes" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[5]} />
        </div>
        <NextChapterTeaser text="Priya's been here six weeks. She opens her notebook late one evening. Something connects. Next: Putting it all together." accent="var(--purple)" />
      </ChapterSection>

      {/* ── FINAL REFLECTION ── */}
      <ChapterSection num="07" accentRgb="120,67,238" id="final-reflection">
        <div className="rv">
          {chLabel('Final Reflection', 'var(--purple)')}
          {h2(<>One loop. Every product decision you&apos;ll ever make.</>)}
          <SituationCard accent="var(--purple)" accentRgb="120,67,238">
            Priya sits at her desk late one evening. Six weeks in. She opens a notebook from her first day. She reads what she wrote at the top: &ldquo;PM = mini-CEO?&rdquo; She crosses it out. She writes something else.
          </SituationCard>

          {para(<>She thinks back through the last six weeks. The confused user she almost solved wrong. The wireframe Dev took apart in two minutes. The sprint planning where she had no answer to Asha&apos;s question. The feature that shipped correctly but misunderstood. The metric that told her something was broken two weeks after launch.</>)}
          {para(<>She writes out what actually happened, in order:</>)}
        </div>

        <div className="rv">
          {pullQuote('She understood a problem. She decided what mattered. She built it with a team. She measured whether it worked.', 'var(--purple)')}
        </div>

        <div className="rv">
          <Avatar
            name="Asha"
            nameColor="var(--purple-light)"
            borderColor="var(--purple)"
            content={<>Asha appears in the doorway. Still here?<br /><br />&ldquo;Just connecting some dots,&rdquo; Priya says.<br /><br />Asha walks over. Reads what Priya wrote. &ldquo;Understand. Decide. Build. Measure.&rdquo; She nods. &ldquo;That&apos;s it. That&apos;s the whole loop.&rdquo;<br /><br />Priya: &ldquo;Is it always that simple?&rdquo;<br /><br />Asha: &ldquo;The loop is simple. The work inside it isn&apos;t. But if you always know which part you&apos;re in — you&apos;ll know what to do next.&rdquo;</>}
            expandedContent={<>Every product decision you&apos;ll ever make lives somewhere in that loop. And the loop never stops. You finish measuring, and you start understanding again. A new problem surfaces. You decide what matters. You build. You measure. The PMs who plateau are the ones who skip steps — who build without understanding, or ship without measuring. The ones who grow are the ones who run the full loop, every time, even when it&apos;s uncomfortable.</>}
          />
        </div>

        <div className="rv">
          {keyBox('The PM loop — four questions', [
            'Understand: What is the actual problem, and who has it?',
            'Decide: What\'s the most important thing to work on right now, and why?',
            'Build: Is the whole team working toward the same definition of done?',
            'Measure: Did what we built actually solve the problem?',
          ], 'var(--purple)')}

          {pullQuote('Being a PM is not a title. It\'s a way of thinking.', 'var(--purple)')}

          <ApplyItBox prompt="Think about the last product decision you made or observed. Which part of the loop was missing — Understand, Decide, Build, or Measure? What would have changed if that step had been done?" color="var(--purple)" />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine conceptId="north-star" conceptName="The PM Loop" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[6]} />
        </div>
      </ChapterSection>
    </>
  );
}

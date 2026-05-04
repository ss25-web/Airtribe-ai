'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizEngine from '../QuizEngine';
import {
  glassCard, demoLabel, chLabel, h2, para, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, ApplyItBox, PMPrincipleBox, NextChapterTeaser, TiltCard,
} from './designSystem';
import { MentorFace } from './MentorFaces';
import { DecisionQualitySplitVisual, TradeoffPrismVisual } from './Module1Animations';

// ─────────────────────────────────────────
// CONVERSATION SCENE — chat-bubble dialogue between Priya and a stakeholder
// ─────────────────────────────────────────
type DialogueLine = { speaker: 'priya' | 'other'; text: string };
const ConversationScene = ({
  mentor, name, role, accent, lines,
}: {
  mentor: 'rohan' | 'kiran' | 'maya' | 'dev' | 'asha';
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

const MODULE_CONTEXT = `Module 01 of Airtribe PM Fundamentals — Track: Experienced APM.
Follows Priya Sharma, 2 years into her PM role at EdSpark (B2B sales coaching SaaS). Her metrics look fine. Her products ship on time. But something's not right at a deeper level. Covers: decision quality vs outcome quality, product triangle tradeoffs, problem framing, research bias, strategy as saying no, PMF local maxima, stakeholder negotiation, guardrail metrics.`;

const QUIZZES = [
  {
    question: "A PM makes the right decision but gets a bad outcome due to market conditions. This means:",
    options: ['A. Decision quality and outcome quality are the same thing', 'B. They got unlucky but the decision was still good', 'C. They should have predicted market conditions', 'D. PM judgment can\'t be evaluated without outcomes'],
    correctIndex: 1,
    explanation: "Decision quality is about the reasoning process, not the result. A good decision can lead to a bad outcome if circumstances change unexpectedly. Conflating the two leads to outcome bias — learning the wrong lessons from results.",
    conceptId: 'pm-role',
    keyInsight: "PM effectiveness is defined by decision quality, not outcome quality.",
  },
  {
    question: "You can ship fast OR reduce tech debt. Doing both is impossible right now. What's the PM's job?",
    options: ['A. Find a way to do both', 'B. Delay the decision', 'C. Make the tradeoff explicit, choose one based on current context, and communicate why', 'D. Defer to engineering'],
    correctIndex: 2,
    explanation: "Tradeoffs are unavoidable. A PM who tries to avoid making them creates ambiguity that engineering will resolve in unpredictable ways. Make the tradeoff explicit, own the call, and explain the reasoning.",
    conceptId: 'pm-role',
    keyInsight: "Tradeoffs are unavoidable. Clarity of thinking matters more than frameworks.",
  },
  {
    question: "Same retention drop. CEO: 'pricing issue.' Engineering: 'tech debt.' Design: 'UX problem.' Who's right?",
    options: ['A. CEO — business context matters most', 'B. Engineering — they see the code', 'C. Probably all partially right — the frame determines the diagnosis', 'D. Run an A/B test'],
    correctIndex: 2,
    explanation: "Problem framing is shaped by each stakeholder's vantage point. The CEO sees revenue signals. Engineering sees system fragility. Design sees friction. Each frame is partially accurate. The PM's job is to synthesize, not arbitrate.",
    conceptId: 'problem-definition',
    keyInsight: "Problem framing determines solution space. Misdiagnosis is the most common failure mode.",
  },
  {
    question: "You only interviewed users who stayed. Your research says 'users love the product.' What's the risk?",
    options: ['A. No risk — those are your real users', 'B. Survivorship bias — churned users may have completely different experiences', 'C. Too small a sample', 'D. Interview method is unreliable'],
    correctIndex: 1,
    explanation: "Survivorship bias means you're only seeing the population that didn't fail. Churned users might tell you the most important thing about why your product isn't working — but they're invisible in research that only samples retained users.",
    conceptId: 'problem-definition',
    keyInsight: "Each research method has tradeoffs and biases. Goal is to reduce uncertainty, not find absolute truth.",
  },
  {
    question: "EdSpark is expanding to HR teams. Sales team retention starts dropping. This is:",
    options: ['A. Unrelated coincidence', 'B. Expected — new users always displace old ones', 'C. A sign that strategy without focus dilutes core value', 'D. A data quality issue'],
    correctIndex: 2,
    explanation: "When EdSpark expanded to HR, the product got more generic to accommodate a different use case. Sales teams — who found deep, specific value — now find a product that fits them 70% as well. Strategy is defined by tradeoffs, and this one was made implicitly.",
    conceptId: 'strategy',
    keyInsight: "Strategy is defined by tradeoffs. Bad strategy avoids hard choices.",
  },
  {
    question: "Month-1 retention is 70% for early cohorts and 35% for recent cohorts. What does this likely signal?",
    options: ['A. Product is getting worse', 'B. Earlier cohorts were power users — mainstream users have different needs', 'C. Seasonality', 'D. Tech performance issues'],
    correctIndex: 1,
    explanation: "Early adopters are self-selected power users. They have high tolerance for rough edges and high motivation to make the product work. When you expand to mainstream users, you're now serving people who won't work around friction. PMF must be continuously maintained as the user base evolves.",
    conceptId: 'strategy',
    keyInsight: "PMF is not binary — it evolves. Different segments may have different levels of fit.",
  },
  {
    question: "Stakeholder A's feature scores 8.4 in RICE. Stakeholder B disputes the reach estimate. What happens next?",
    options: ['A. Defend the estimate — math is math', 'B. Defer to the higher-ranked stakeholder', 'C. Challenge the assumption together — RICE is a structured conversation starter, not a verdict', 'D. Run more research before deciding'],
    correctIndex: 2,
    explanation: "RICE scores are only as good as their inputs. When stakeholders dispute inputs, that's a feature, not a bug — it surfaces the real disagreement. The scoring system can be gamed when stakeholders aren't aligned on inputs. Prioritization is a negotiation, not a formula.",
    conceptId: 'prioritization',
    keyInsight: "Prioritization is a negotiation between competing priorities. Frameworks support decisions, not replace judgment.",
  },
  {
    question: "North star (sessions/user) hits all-time high. Support tickets up 40%. NPS drops 8 points. Churn up 15%. What do you do?",
    options: ['A. Trust the north star — it\'s your primary metric', 'B. Investigate — guardrail metrics are deteriorating, suggesting the north star is diverging from real value', 'C. Fix the support issue separately', 'D. This is expected during growth phases'],
    correctIndex: 1,
    explanation: "When guardrail metrics deteriorate while the north star rises, the north star is likely diverging from the actual value it was meant to proxy. Users may be 'active' in ways that don't deliver value — or the product is creating friction that drives support and churn despite high session counts.",
    conceptId: 'north-star',
    keyInsight: "A single metric cannot capture all dimensions of success. Guardrail metrics are essential.",
  },
  {
    question: "An engineer ships a technically correct feature that misses what users actually needed. Most likely cause?",
    options: ['A. Bad engineering', 'B. PM didn\'t provide enough detail', 'C. The engineer\'s mental model of the problem didn\'t match the user\'s actual situation', 'D. Design handoff was incomplete'],
    correctIndex: 2,
    explanation: "Execution failures often stem from misaligned mental models — not lack of effort. The engineer built what they understood the problem to be. That understanding was subtly different from reality. Alignment is about mental models, not just specs.",
    conceptId: 'collaboration',
    keyInsight: "Execution failures often stem from misaligned mental models rather than lack of effort.",
  },
  {
    question: "You notice a small misunderstanding in a kick-off meeting about what 'done' means. Do you address it?",
    options: ['A. No — small things work themselves out', 'B. Yes — small misalignments at definition compound into major execution failures', 'C. Wait until sprint review', 'D. Send an email later'],
    correctIndex: 1,
    explanation: "Small misalignments at the start of a sprint compound into major failures at the end. Two people building toward slightly different definitions of 'done' will diverge over two weeks into something neither intended. Address misalignment at the moment you see it.",
    conceptId: 'collaboration',
    keyInsight: "Alignment is continuous, not one-time. Small misunderstandings scale into major issues.",
  },
  {
    question: "DAUs are up 20%. To know if this is meaningful, you also need:",
    options: ['A. Nothing — DAU is self-explanatory', 'B. Context: what actions users are taking, whether those actions create value, and what changed', 'C. More time to see if it holds', 'D. Competitor benchmarks'],
    correctIndex: 1,
    explanation: "DAU is a count, not a verdict. 20% more daily active users could mean 20% more value delivered — or 20% more users opening the app and leaving immediately. Metrics are proxies. Context determines whether the proxy is still pointing at the right thing.",
    conceptId: 'north-star',
    keyInsight: "Metrics are proxies for reality and can mislead if not interpreted carefully.",
  },
  {
    question: "Your north star is 'successful transactions completed.' Engagement metrics are rising but transaction success isn't. This suggests:",
    options: ['A. Engagement will eventually drive transactions', 'B. The north star is working — engagement is a leading indicator', 'C. Users are engaged but something blocks them from completing the core value action — investigate', 'D. Focus on engagement first'],
    correctIndex: 2,
    explanation: "Engagement without conversion means users are willing to try — but something is blocking the core action. The north star isn't broken; it's working exactly as intended by revealing that engagement activity and value delivery have diverged. That's the thing to investigate.",
    conceptId: 'north-star',
    keyInsight: "Metrics can be gamed. Context is critical for interpretation.",
  },
];

// ─────────────────────────────────────────
// INTERACTIVE 1: TRADEOFF MATRIX
// ─────────────────────────────────────────
const TradeoffMatrix = () => {
  const [active, setActive] = useState<number | null>(null);

  const tradeoffs = [
    {
      action: 'Ship fast',
      consequence: 'Tech debt accumulates',
      downstream: 'Future velocity slows — each sprint takes longer as engineers work around fragile code',
      color: 'var(--coral)',
      rgb: '224,122,95',
    },
    {
      action: 'Fix tech debt',
      consequence: 'Feature velocity drops',
      downstream: 'Stakeholders see a "slow quarter." Market window may close. Users wait for features that matter to them',
      color: 'var(--blue)',
      rgb: '58,134,255',
    },
    {
      action: 'Scale quickly',
      consequence: 'Core product gets generalized',
      downstream: 'Power users who loved v1 find v3 too generic. Retention in early cohorts begins to drop',
      color: 'var(--purple)',
      rgb: '120,67,238',
    },
    {
      action: 'Optimize for revenue',
      consequence: 'User experience degrades',
      downstream: 'NPS declines. Power users leave. Organic growth stalls. You\'ve traded long-term growth for short-term numbers',
      color: 'var(--teal)',
      rgb: '0,151,167',
    },
  ];

  return (
    <div style={glassCard('var(--purple)', '120,67,238')}>
      {demoLabel('⚖️ Click Each Decision — See the Downstream Tradeoff', 'var(--purple)')}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        {tradeoffs.map((t, i) => (
          <motion.button key={i}
            whileHover={{ y: -3, boxShadow: `0 14px 24px rgba(${t.rgb},0.18), 0 4px 0 rgba(${t.rgb},0.2), inset 0 1px 0 rgba(255,255,255,0.85)` }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActive(active === i ? null : i)}
            animate={{ boxShadow: active === i ? `0 10px 20px rgba(${t.rgb},0.18), 0 4px 0 rgba(${t.rgb},0.16), inset 0 1px 0 rgba(255,255,255,0.85)` : `0 4px 12px rgba(0,0,0,0.07), 0 3px 0 rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.85)` }}
            style={{
              padding: '18px 16px', borderRadius: '18px',
              border: `2px solid ${active === i ? `rgba(${t.rgb},0.55)` : 'rgba(0,0,0,0.04)'}`,
              background: active === i ? `rgba(${t.rgb},0.06)` : '#ffffff',
              cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s, background 0.2s',
            }}>
            <div style={{ fontSize: '9px', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: t.color, marginBottom: '6px', letterSpacing: '0.1em' }}>OPTIMIZE FOR</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--tx,#1C1814)', marginBottom: '8px' }}>{t.action}</div>
            <div style={{ fontSize: '11px', color: 'var(--tx3,#8A8580)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: t.color, fontWeight: 700 }}>→</span> {t.consequence}
            </div>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {active !== null && (
          <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ padding: '16px 20px', borderRadius: '12px', background: `rgba(${tradeoffs[active].rgb},0.06)`, border: `1px solid rgba(${tradeoffs[active].rgb},0.2)`, borderLeft: `4px solid ${tradeoffs[active].color}` }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: tradeoffs[active].color, marginBottom: '8px' }}>DOWNSTREAM CONSEQUENCE</div>
            <div style={{ fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.75 }}>{tradeoffs[active].downstream}</div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--tx3)', fontStyle: 'italic' }}>There is no perfect balance — only contextual optimization. The PM's job is to make the tradeoff explicit and own it.</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 2: PM TRIANGLE (APM VERSION)
// ─────────────────────────────────────────
const PMTriangleDiagramAPM = () => {
  const [active, setActive] = useState<'user' | 'business' | 'tech' | null>(null);

  const costs = {
    user: {
      label: 'Optimize for User',
      cost: 'Scaling quickly for users introduces tech debt and blows the budget. The product becomes expensive to maintain and impossible to iterate on.',
      tradeoff: 'User value ↑ · Technical fragility ↑ · Cost efficiency ↓',
      color: 'var(--teal)',
    },
    business: {
      label: 'Optimize for Business',
      cost: 'Maximizing revenue metrics this quarter means cutting corners on user experience and deferring features users actually need.',
      tradeoff: 'Revenue ↑ · User satisfaction ↓ · Long-term retention risk ↑',
      color: 'var(--purple)',
    },
    tech: {
      label: 'Optimize for Tech',
      cost: 'Fixing tech debt and building a perfect architecture slows feature delivery. Users wait. Competitors move. Business opportunity costs mount.',
      tradeoff: 'Code quality ↑ · Feature velocity ↓ · Market window risk ↑',
      color: 'var(--blue)',
    },
  };

  return (
    <div style={glassCard('var(--purple)', '120,67,238')}>
      {demoLabel('🔺 Optimization Costs — Click Each Corner', 'var(--purple)')}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <svg width="340" height="270" viewBox="0 0 340 270" style={{ overflow: 'visible' }}>
          <defs>
            <radialGradient id="triGlow" cx="50%" cy="55%" r="50%">
              <stop offset="0%" stopColor="rgba(120,67,238,0.12)" />
              <stop offset="100%" stopColor="rgba(120,67,238,0.03)" />
            </radialGradient>
            <linearGradient id="bizGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(161,138,240,0.9)" />
              <stop offset="100%" stopColor="rgba(120,67,238,1)" />
            </linearGradient>
            <linearGradient id="techGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(100,160,255,0.9)" />
              <stop offset="100%" stopColor="rgba(58,134,255,1)" />
            </linearGradient>
            <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(44,180,200,0.9)" />
              <stop offset="100%" stopColor="rgba(0,151,167,1)" />
            </linearGradient>
          </defs>
          {/* Triangle fill */}
          <polygon points="170,28 58,232 282,232" fill="url(#triGlow)" stroke="rgba(120,67,238,0.2)" strokeWidth="1.5" />
          {/* Center label */}
          <text x="170" y="142" textAnchor="middle" fill="var(--svg-muted,#aaa)" fontSize="9" fontFamily="'JetBrains Mono',monospace" fontWeight="700" letterSpacing="1.5">CONTEXTUAL</text>
          <text x="170" y="155" textAnchor="middle" fill="var(--svg-muted,#aaa)" fontSize="9" fontFamily="'JetBrains Mono',monospace" fontWeight="700" letterSpacing="1.5">OPTIMIZATION</text>

          {/* Business node */}
          <motion.g whileHover={{ scale: 1.08 }} style={{ cursor: 'pointer', transformOrigin: '170px 28px' }} onClick={() => setActive(active === 'business' ? null : 'business')}>
            <circle cx="170" cy="28" r="34" fill={active === 'business' ? 'url(#bizGrad)' : 'rgba(120,67,238,0.14)'} stroke="rgba(120,67,238,0.6)" strokeWidth="2" />
            {active === 'business' && <circle cx="170" cy="28" r="34" fill="none" stroke="rgba(120,67,238,0.3)" strokeWidth="8" />}
            <text x="170" y="23" textAnchor="middle" fill={active === 'business' ? '#fff' : 'var(--purple,#7843EE)'} fontSize="9" fontFamily="'JetBrains Mono',monospace" fontWeight="800">BUSI-</text>
            <text x="170" y="35" textAnchor="middle" fill={active === 'business' ? '#fff' : 'var(--purple,#7843EE)'} fontSize="9" fontFamily="'JetBrains Mono',monospace" fontWeight="800">NESS</text>
          </motion.g>

          {/* Tech node */}
          <motion.g whileHover={{ scale: 1.08 }} style={{ cursor: 'pointer', transformOrigin: '58px 232px' }} onClick={() => setActive(active === 'tech' ? null : 'tech')}>
            <circle cx="58" cy="232" r="34" fill={active === 'tech' ? 'url(#techGrad)' : 'rgba(58,134,255,0.14)'} stroke="rgba(58,134,255,0.6)" strokeWidth="2" />
            {active === 'tech' && <circle cx="58" cy="232" r="34" fill="none" stroke="rgba(58,134,255,0.3)" strokeWidth="8" />}
            <text x="58" y="228" textAnchor="middle" fill={active === 'tech' ? '#fff' : 'var(--blue,#3A86FF)'} fontSize="9" fontFamily="'JetBrains Mono',monospace" fontWeight="800">TECH</text>
            <text x="58" y="240" textAnchor="middle" fill={active === 'tech' ? '#fff' : 'var(--blue,#3A86FF)'} fontSize="9" fontFamily="'JetBrains Mono',monospace" fontWeight="800">NICAL</text>
          </motion.g>

          {/* User node */}
          <motion.g whileHover={{ scale: 1.08 }} style={{ cursor: 'pointer', transformOrigin: '282px 232px' }} onClick={() => setActive(active === 'user' ? null : 'user')}>
            <circle cx="282" cy="232" r="34" fill={active === 'user' ? 'url(#userGrad)' : 'rgba(0,151,167,0.14)'} stroke="rgba(0,151,167,0.6)" strokeWidth="2" />
            {active === 'user' && <circle cx="282" cy="232" r="34" fill="none" stroke="rgba(0,151,167,0.3)" strokeWidth="8" />}
            <text x="282" y="228" textAnchor="middle" fill={active === 'user' ? '#fff' : 'var(--teal,#0097A7)'} fontSize="9" fontFamily="'JetBrains Mono',monospace" fontWeight="800">USER</text>
            <text x="282" y="240" textAnchor="middle" fill={active === 'user' ? '#fff' : 'var(--teal,#0097A7)'} fontSize="9" fontFamily="'JetBrains Mono',monospace" fontWeight="800">VALUE</text>
          </motion.g>
        </svg>

        <AnimatePresence mode="wait">
          {active ? (
            <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              style={{ width: '100%', padding: '18px 20px', borderRadius: '16px', background: `${costs[active].color}0C`, border: `1px solid ${costs[active].color}28`, borderLeft: `4px solid ${costs[active].color}` }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: costs[active].color, marginBottom: '8px' }}>
                {costs[active].label} — Optimization Cost
              </div>
              <div style={{ fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.72, marginBottom: '10px' }}>{costs[active].cost}</div>
              <div style={{ fontSize: '11px', fontFamily: "'JetBrains Mono',monospace", color: costs[active].color, opacity: 0.8 }}>{costs[active].tradeoff}</div>
            </motion.div>
          ) : (
            <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ fontSize: '12px', color: 'var(--tx3)', textAlign: 'center' as const, fontFamily: "'JetBrains Mono',monospace", padding: '8px' }}>
              Click a corner to reveal what you sacrifice when you over-optimize it
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 3: PROBLEM FRAMING SIMULATOR
// ─────────────────────────────────────────
const ProblemFramingSimulator = () => {
  const [active, setActive] = useState<number | null>(null);

  const stakeholders = [
    {
      name: 'CEO',
      emoji: '💼',
      frame: 'Revenue risk',
      diagnosis: 'We\'re losing customers because our pricing isn\'t competitive or our contract renewal process is broken.',
      solution: 'Discount more aggressively or restructure pricing tiers. Launch a "retention offer" program.',
      color: 'var(--coral)',
      rgb: '224,122,95',
    },
    {
      name: 'Engineering',
      emoji: '⚙️',
      frame: 'Technical debt',
      diagnosis: 'Our infrastructure is slow. The app has known bugs that affect daily use. Users are hitting pain points we haven\'t had time to fix.',
      solution: 'Dedicate two sprints to debt reduction. The retention problem is a symptom of code quality.',
      color: 'var(--blue)',
      rgb: '58,134,255',
    },
    {
      name: 'Design',
      emoji: '🎨',
      frame: 'UX friction',
      diagnosis: 'Users drop off in the coaching setup flow. The interface is confusing after recent updates. We added features without rethinking the experience.',
      solution: 'Redesign onboarding and the coaching session setup. Run usability tests. Fix the information architecture.',
      color: 'var(--teal)',
      rgb: '0,151,167',
    },
  ];

  return (
    <div style={glassCard('var(--teal)', '0,151,167')}>
      {demoLabel('🔍 Retention dropped 15%. Three teams. Three diagnoses.', 'var(--teal)')}
      <div style={{ fontSize: '13px', color: 'var(--tx3)', marginBottom: '16px' }}>Each stakeholder sees the same problem through a different lens. Click each to see their frame — and what solution it leads to.</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        {stakeholders.map((s, i) => (
          <motion.button key={i} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => setActive(active === i ? null : i)}
            style={{ padding: '14px 12px', borderRadius: '14px', border: `2px solid ${active === i ? s.color : `rgba(${s.rgb},0.2)`}`, background: active === i ? `rgba(${s.rgb},0.1)` : 'var(--ed-card)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.emoji}</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: s.color, marginBottom: '2px' }}>{s.name}</div>
            <div style={{ fontSize: '10px', color: 'var(--tx3)', fontFamily: 'monospace' }}>{s.frame}</div>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {active !== null && (
          <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ padding: '16px 20px', borderRadius: '12px', background: `rgba(${stakeholders[active].rgb},0.06)`, border: `1px solid rgba(${stakeholders[active].rgb},0.2)` }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.1em', color: stakeholders[active].color, marginBottom: '4px' }}>HOW THEY DIAGNOSE IT</div>
              <div style={{ fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.7 }}>{stakeholders[active].diagnosis}</div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.1em', color: 'var(--tx3)', marginBottom: '4px' }}>THEIR PROPOSED SOLUTION</div>
              <div style={{ fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.7 }}>{stakeholders[active].solution}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {active !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', color: 'var(--tx3)', lineHeight: 1.7, fontStyle: 'italic' }}>
          Notice: none of them are wrong. Each frame reveals a real dimension of the problem. The PM&apos;s job is to synthesize these frames — not pick the loudest one — and find the diagnosis that explains all three perspectives.
        </motion.div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 4: RESEARCH BIAS IDENTIFIER
// ─────────────────────────────────────────
const ResearchBiasIdentifier = () => {
  const [guesses, setGuesses] = useState<Record<number, string>>({});

  const scenarios = [
    {
      story: 'EdSpark interviewed 12 users about their experience. All 12 were users who had been active for 6+ months.',
      options: ['Confirmation bias', 'Survivorship bias', 'Recency bias'],
      answer: 'Survivorship bias',
      explanation: 'By sampling only long-term retained users, the research inherently excludes churned users — who might have the most important feedback about why the product fails.',
    },
    {
      story: 'A product survey asked: "How helpful was EdSpark in improving your sales technique?" with options ranging from "Somewhat helpful" to "Extremely helpful."',
      options: ['Leading question bias', 'Confirmation bias', 'Acquiescence bias'],
      answer: 'Confirmation bias',
      explanation: 'The question presupposes the product was helpful. It only offers positive response options, so it will confirm whatever hypothesis it was built to confirm — that users find it helpful.',
    },
    {
      story: 'Priya interviewed a sales rep three days after they had a frustrating call with EdSpark support.',
      options: ['Recency bias', 'Survivorship bias', 'Social desirability bias'],
      answer: 'Recency bias',
      explanation: 'A bad experience with support is salient and emotional. That experience colors the user\'s perception of the entire product, making their feedback unrepresentative of their overall experience.',
    },
  ];

  const guess = (scenarioIdx: number, option: string) => {
    if (guesses[scenarioIdx] !== undefined) return;
    setGuesses(g => ({ ...g, [scenarioIdx]: option }));
  };

  return (
    <div style={glassCard('var(--teal)', '0,151,167')}>
      {demoLabel('🔬 Spot the Research Bias in Each Scenario', 'var(--teal)')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {scenarios.map((s, i) => {
          const hasGuessed = guesses[i] !== undefined;
          const isCorrect = guesses[i] === s.answer;
          return (
            <div key={i} style={{ padding: '16px 20px', borderRadius: '14px', background: 'var(--ed-card)', border: `1px solid ${hasGuessed ? (isCorrect ? 'rgba(21,129,88,0.3)' : 'rgba(224,122,95,0.3)') : 'rgba(0,151,167,0.2)'}`, transition: 'border 0.3s' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--teal)', marginBottom: '8px', letterSpacing: '0.1em' }}>SCENARIO {i + 1}</div>
              <div style={{ fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '14px' }}>"{s.story}"</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
                {s.options.map(opt => {
                  const isGuessed = guesses[i] === opt;
                  const isRight = hasGuessed && opt === s.answer;
                  const isWrong = hasGuessed && isGuessed && !isRight;
                  return (
                    <motion.button key={opt} whileHover={!hasGuessed ? { scale: 1.03 } : {}} onClick={() => guess(i, opt)}
                      style={{ padding: '7px 14px', borderRadius: '8px', border: `2px solid ${isRight ? 'var(--green)' : isWrong ? 'var(--coral)' : isGuessed ? 'var(--teal)' : 'rgba(0,151,167,0.2)'}`, background: isRight ? 'rgba(21,129,88,0.1)' : isWrong ? 'rgba(224,122,95,0.1)' : 'var(--ed-card)', cursor: hasGuessed ? 'default' : 'pointer', fontSize: '11px', fontWeight: 700, color: isRight ? 'var(--green)' : isWrong ? 'var(--coral)' : 'var(--tx2)', transition: 'all 0.2s' }}>
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
              <AnimatePresence>
                {hasGuessed && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ marginTop: '12px', padding: '12px 14px', borderRadius: '8px', background: isCorrect ? 'rgba(21,129,88,0.08)' : 'rgba(224,122,95,0.08)', fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.7 }}>
                    <strong style={{ color: isCorrect ? 'var(--green)' : 'var(--coral)' }}>{isCorrect ? '✓ Correct. ' : `✗ It's ${s.answer}. `}</strong>
                    {s.explanation}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 5: STRATEGY TRADEOFF SCENARIO
// ─────────────────────────────────────────
const StrategyTradeoffScenario = () => {
  const [step, setStep] = useState<'initial' | 'surface' | 'consequence'>('initial');

  return (
    <div style={glassCard('var(--blue)', '58,134,255')}>
      {demoLabel('🎯 EdSpark Expansion Decision — Unpack the Tradeoff', 'var(--blue)')}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--tx)', marginBottom: '8px' }}>The proposal on the table:</div>
        <div style={{ padding: '14px 18px', borderRadius: '12px', background: 'rgba(58,134,255,0.06)', border: '1px solid rgba(58,134,255,0.2)', fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.7, fontStyle: 'italic' }}>
          "EdSpark should expand from serving sales teams to also serving HR teams. HR teams have training budgets, similar user size, and are already in the enterprise. Looks like a natural adjacency."
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' as const }}>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setStep('surface')}
          style={{ padding: '10px 18px', borderRadius: '10px', border: `2px solid ${step === 'surface' || step === 'consequence' ? 'var(--blue)' : 'rgba(58,134,255,0.25)'}`, background: step === 'surface' || step === 'consequence' ? 'rgba(58,134,255,0.1)' : 'var(--ed-card)', cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: 'var(--blue)', transition: 'all 0.2s' }}>
          Why it looks good on paper →
        </motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setStep('consequence')}
          style={{ padding: '10px 18px', borderRadius: '10px', border: `2px solid ${step === 'consequence' ? 'var(--coral)' : 'rgba(224,122,95,0.25)'}`, background: step === 'consequence' ? 'rgba(224,122,95,0.1)' : 'var(--ed-card)', cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: 'var(--coral)', transition: 'all 0.2s' }}>
          What actually happens →
        </motion.button>
      </div>
      <AnimatePresence mode="wait">
        {step === 'surface' && (
          <motion.div key="surface" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(21,129,88,0.06)', border: '1px solid rgba(21,129,88,0.2)', borderLeft: '4px solid var(--green)' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--green)', marginBottom: '8px' }}>SURFACE-LEVEL CASE</div>
            {['New revenue stream — HR is a large, untapped market', 'Similar company size and enterprise dynamics', 'Training budgets already allocated — easier sell', 'Reduces concentration risk from being sales-team-only'].map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '12px', color: 'var(--tx2)' }}>
                <span style={{ color: 'var(--green)', flexShrink: 0 }}>✓</span>{t}
              </div>
            ))}
          </motion.div>
        )}
        {step === 'consequence' && (
          <motion.div key="consequence" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(224,122,95,0.06)', border: '1px solid rgba(224,122,95,0.2)', borderLeft: '4px solid var(--coral)' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--coral)', marginBottom: '8px' }}>WHAT ACTUALLY HAPPENS</div>
            {['To serve HR, EdSpark generalizes its coaching features — they become "good enough" for both, great for neither', 'Sales team retention drops: power users who loved deep sales coaching now find a generic training product', 'Engineering is split: call coaching roadmap and LMS features pull in opposite directions', 'Sales cycles lengthen: "EdSpark for HR" doesn\'t fit the original ICP anymore', 'Core product value erodes before the HR segment reaches meaningful revenue'].map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '12px', color: 'var(--tx2)' }}>
                <span style={{ color: 'var(--coral)', flexShrink: 0 }}>✗</span>{t}
              </div>
            ))}
            <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', fontSize: '12px', color: 'var(--tx3)', fontStyle: 'italic' }}>
              Strategy is what you DON&apos;T do. Saying no to adjacent opportunities that dilute core value is often more important than saying yes to new markets.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 6: PMF LOCAL MAXIMA DEMO
// ─────────────────────────────────────────
const PMFLocalMaximaDemo = () => {
  const [selectedCohort, setSelectedCohort] = useState<number>(0);

  const cohorts = [
    { label: 'Q1 2023 (Early adopters)', month1: 85, month3: 72, month6: 68, note: 'Early adopters are self-selected — high motivation, high tolerance for rough edges. They will make your product work. Their retention looks like PMF.' },
    { label: 'Q3 2023 (Growth cohort)', month1: 78, month3: 58, month6: 42, note: 'As EdSpark grew, it reached users who aren\'t self-selected believers. They need the product to work for them without effort. Retention starts declining.' },
    { label: 'Q1 2024 (Mainstream)', month1: 71, month3: 38, month6: 22, note: 'Mainstream users have different expectations. They won\'t figure out workarounds. The product needs to solve their problem immediately. PMF with early adopters does not mean PMF with mainstream.' },
    { label: 'Q3 2024 (Recent)', month1: 65, month3: 31, month6: 18, note: 'Each new cohort retains worse. This is not a marketing problem — it\'s a product-market fit divergence. The product is drifting from what new users need.' },
  ];

  const c = cohorts[selectedCohort];
  const bars = [
    { label: 'Month 1', value: c.month1, color: 'var(--green)' },
    { label: 'Month 3', value: c.month3, color: 'var(--blue)' },
    { label: 'Month 6', value: c.month6, color: selectedCohort >= 2 ? 'var(--coral)' : 'var(--teal)' },
  ];

  return (
    <div style={glassCard('var(--blue)', '58,134,255')}>
      {demoLabel('📈 Cohort Retention — The PMF Divergence', 'var(--blue)')}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' as const }}>
        {cohorts.map((coh, i) => (
          <motion.button key={i} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setSelectedCohort(i)}
            style={{ padding: '6px 12px', borderRadius: '8px', border: `2px solid ${selectedCohort === i ? 'var(--blue)' : 'rgba(58,134,255,0.2)'}`, background: selectedCohort === i ? 'rgba(58,134,255,0.12)' : 'var(--ed-card)', cursor: 'pointer', fontSize: '10px', fontWeight: 700, color: selectedCohort === i ? 'var(--blue)' : 'var(--tx3)', transition: 'all 0.2s', fontFamily: 'monospace' }}>
            {coh.label.split(' ')[0]} {coh.label.split(' ')[1]}
          </motion.button>
        ))}
      </div>
      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--tx)', marginBottom: '16px' }}>{c.label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        {bars.map(bar => (
          <div key={bar.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: 'var(--tx3)', fontFamily: 'monospace' }}>{bar.label}</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: bar.color, fontFamily: 'monospace' }}>{bar.value}%</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div key={`${selectedCohort}-${bar.label}`} initial={{ width: 0 }} animate={{ width: `${bar.value}%` }} transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ height: '100%', background: bar.color, borderRadius: '4px' }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid rgba(255,255,255,0.07)', fontSize: '12px', color: 'var(--tx2)', lineHeight: 1.75, fontStyle: 'italic' }}>
        {c.note}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 7: STAKEHOLDER NEGOTIATION
// ─────────────────────────────────────────
const StakeholderNegotiation = () => {
  const [phase, setPhase] = useState<'scores' | 'dispute' | 'resolution'>('scores');

  const features = [
    { name: 'AI call summary', owner: 'VP Sales', rice: 8.4, color: 'var(--coral)' },
    { name: 'LMS integrations', owner: 'VP Customer Success', rice: 6.1, color: 'var(--blue)' },
    { name: 'Coach leaderboard', owner: 'VP Product', rice: 4.8, color: 'var(--purple)' },
  ];

  return (
    <div style={glassCard('var(--coral)', '224,122,95')}>
      {demoLabel('🤝 Prioritization Negotiation — Three Stakeholders, Three Features', 'var(--coral)')}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' as const }}>
        {(['scores', 'dispute', 'resolution'] as const).map(p => (
          <motion.button key={p} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setPhase(p)}
            style={{ padding: '8px 14px', borderRadius: '8px', border: `2px solid ${phase === p ? 'var(--coral)' : 'rgba(224,122,95,0.25)'}`, background: phase === p ? 'rgba(224,122,95,0.1)' : 'var(--ed-card)', cursor: 'pointer', fontSize: '11px', fontWeight: 700, color: phase === p ? 'var(--coral)' : 'var(--tx3)', transition: 'all 0.2s', fontFamily: 'monospace' }}>
            {p === 'scores' ? '1. RICE scores' : p === 'dispute' ? '2. The dispute' : '3. Resolution'}
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {phase === 'scores' && (
          <motion.div key="scores" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ fontSize: '12px', color: 'var(--tx3)', marginBottom: '12px' }}>The RICE scores say this is clear-cut:</div>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', padding: '12px 16px', borderRadius: '10px', background: 'var(--ed-card)', border: `1px solid rgba(255,255,255,0.07)` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--tx)', marginBottom: '2px' }}>{f.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--tx3)', fontFamily: 'monospace' }}>Owner: {f.owner}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: f.color }}>{f.rice}</div>
                  <div style={{ fontSize: '9px', color: 'var(--tx3)', fontFamily: 'monospace' }}>RICE score</div>
                </div>
              </div>
            ))}
            <div style={{ fontSize: '12px', color: 'var(--tx3)', fontStyle: 'italic', marginTop: '8px' }}>AI call summary wins. Case closed? Not quite.</div>
          </motion.div>
        )}
        {phase === 'dispute' && (
          <motion.div key="dispute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ fontSize: '12px', color: 'var(--tx3)', marginBottom: '12px' }}>The VP of Customer Success disputes the AI call summary's Reach number:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { speaker: 'VP CS', color: 'var(--blue)', text: '"Reach of 2,400 users? Our enterprise cohort is only 800. Where did 2,400 come from?"' },
                { speaker: 'VP Sales', color: 'var(--coral)', text: '"That\'s the total user base including SMB. Enterprise is our ICP — the score should use 800."' },
                { speaker: 'VP Product', color: 'var(--purple)', text: '"If we recalculate with 800, the AI summary score drops to 2.8. LMS integrations becomes top priority."' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '12px 16px', borderRadius: '10px', background: `${item.color}08`, border: `1px solid ${item.color}25`, borderLeft: `3px solid ${item.color}` }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'monospace', color: item.color, marginBottom: '4px' }}>{item.speaker}</div>
                  <div style={{ fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.7, fontStyle: 'italic' }}>{item.text}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {phase === 'resolution' && (
          <motion.div key="resolution" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '14px 18px', borderRadius: '12px', background: 'rgba(21,129,88,0.08)', border: '1px solid rgba(21,129,88,0.2)', fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.75 }}>
                <strong style={{ color: 'var(--green)' }}>What PM Priya does:</strong> She doesn't defend the original Reach estimate. She opens the disagreement. "Let's align on who we're building for first — our full user base, or our ICP enterprise cohort? That answer determines every RICE score we run."
              </div>
              <div style={{ padding: '14px 18px', borderRadius: '12px', background: 'rgba(224,122,95,0.06)', border: '1px solid rgba(224,122,95,0.15)', fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.75 }}>
                <strong style={{ color: 'var(--coral)' }}>The real lesson:</strong> The dispute wasn't about the AI call summary. It was about who EdSpark's strategy is actually for. RICE exposed the disagreement — it didn't create it. Prioritization is a negotiation about strategy, not a math problem.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 8: GUARDRAIL METRICS DEMO
// ─────────────────────────────────────────
const GuardrailMetricsDemo = () => {
  const [revealed, setRevealed] = useState(false);

  const northStar = { label: 'Sessions per user', value: '+18%', trend: 'up', color: 'var(--green)' };
  const guardrails = [
    { label: 'Support tickets per user', value: '+41%', trend: 'up', signal: 'bad', note: 'Users are encountering problems they can\'t solve on their own — possibly bugs or confusing new features' },
    { label: 'Net Promoter Score', value: '-8 pts', trend: 'down', signal: 'bad', note: 'Users who would recommend the product is declining — core satisfaction is eroding' },
    { label: 'Monthly churn rate', value: '+15%', trend: 'up', signal: 'bad', note: 'More users are leaving each month despite higher session counts — engagement isn\'t delivering value' },
  ];

  return (
    <div style={glassCard('var(--purple)', '120,67,238')}>
      {demoLabel('📊 North Star vs Guardrail Metrics — Spot the Divergence', 'var(--purple)')}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.1em', color: 'var(--purple)', marginBottom: '10px' }}>NORTH STAR</div>
        <div style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(21,129,88,0.1)', border: '2px solid rgba(21,129,88,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--tx)', marginBottom: '2px' }}>{northStar.label}</div>
            <div style={{ fontSize: '11px', color: 'var(--tx3)' }}>This quarter vs last quarter</div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--green)' }}>{northStar.value}</div>
        </div>
      </div>
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setRevealed(true)}
        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `2px solid ${revealed ? 'rgba(224,122,95,0.4)' : 'rgba(120,67,238,0.3)'}`, background: revealed ? 'rgba(224,122,95,0.06)' : 'rgba(120,67,238,0.08)', cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: revealed ? 'var(--coral)' : 'var(--purple)', marginBottom: '16px', transition: 'all 0.3s', fontFamily: 'monospace' }}>
        {revealed ? '⚠ GUARDRAIL METRICS BELOW' : 'Reveal guardrail metrics →'}
      </motion.button>
      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {guardrails.map((g, i) => (
                <div key={i} style={{ padding: '14px 18px', borderRadius: '12px', background: 'rgba(224,122,95,0.08)', border: '1px solid rgba(224,122,95,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--tx)', marginBottom: '4px' }}>{g.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--tx3)', lineHeight: 1.6 }}>{g.note}</div>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--coral)', flexShrink: 0 }}>{g.value}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '14px 18px', borderRadius: '12px', background: 'rgba(120,67,238,0.08)', border: '1px solid rgba(120,67,238,0.2)', fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.75 }}>
              <strong style={{ color: 'var(--purple)' }}>The question for Priya:</strong> When guardrail metrics are this far off, does the north star still represent real value? More sessions per user — but those sessions are generating support tickets, not satisfaction. The north star may be diverging from the actual value it was meant to measure. This is when you override the north star.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────
// INTRO HERO
// ─────────────────────────────────────────
// INTRO HERO — editorial (APM track)
// ─────────────────────────────────────────
const APM_MODULES = [
  { roman: 'I',   label: 'Decision quality vs outcome quality' },
  { roman: 'II',  label: 'The hidden cost of every tradeoff' },
  { roman: 'III', label: 'Problem framing and research bias' },
  { roman: 'IV',  label: 'Strategy as what you say no to' },
  { roman: 'V',   label: 'Prioritization under stakeholder pressure' },
  { roman: 'VI',  label: 'Guardrail metrics and PMF drift' },
];

const IntroHero = () => (
  <section style={{ padding: '56px 0 48px', borderBottom: '1px solid var(--ed-rule)' }}>
    {/* Breadcrumb */}
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ed-ink3)', marginBottom: '32px', letterSpacing: '0.04em' }}>
      PM Fundamentals <span style={{ margin: '0 8px', color: 'var(--ed-ink3)' }}>›</span>
      <span style={{ color: 'var(--ed-ink2)' }}>Advanced Track</span>
      <span style={{ margin: '0 10px', color: 'var(--ed-rule)' }}>·</span>
      <span style={{ color: 'var(--ed-ink3)' }}>30 min · 12 concepts</span>
    </div>

    {/* Title */}
    <h1 style={{
      fontSize: 'clamp(28px, 3.6vw, 48px)', fontWeight: 700, lineHeight: 1.12,
      letterSpacing: '-0.025em', marginBottom: '20px', color: 'var(--ed-ink)',
      fontFamily: "'Lora', 'Georgia', 'Times New Roman', serif",
    }}>
      You ship. You execute. You&apos;re good.<br />
      <span style={{ color: 'var(--purple)' }}>Here&apos;s what&apos;s holding you back.</span>
    </h1>

    <p style={{ fontSize: '17px', color: 'var(--ed-ink2)', lineHeight: 1.8, maxWidth: '560px', marginBottom: '40px' }}>
      This track assumes you know how to run a sprint. What it covers is harder: the subtle errors in thinking that create execution failures, strategy drift, and invisible ceilings — and how to fix them.
    </p>

    {/* Modules grid */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '36px' }}>
      {APM_MODULES.map(m => (
        <div key={m.roman} style={{
          padding: '12px 14px', borderRadius: '6px',
          background: 'var(--ed-card)', border: '1px solid var(--ed-rule)',
          display: 'flex', gap: '10px', alignItems: 'baseline',
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
            fontWeight: 700, color: 'var(--purple)', flexShrink: 0,
          }}>{m.roman}.</span>
          <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.4 }}>{m.label}</span>
        </div>
      ))}
    </div>

    {/* How it works */}
    <div style={{
      padding: '20px 24px', borderRadius: '8px',
      background: 'var(--ed-card)', border: '1px solid var(--ed-rule)',
      borderLeft: '4px solid var(--purple)',
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700,
        letterSpacing: '0.16em', color: 'var(--purple)', textTransform: 'uppercase' as const,
        marginBottom: '10px',
      }}>How this is structured</div>
      <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.8 }}>
        Each module follows <strong style={{ color: 'var(--ed-ink)' }}>Priya Sharma</strong> — now two years into her PM role at EdSpark — as she hits the ceiling that execution-focused PMs always hit. Each scenario exposes a specific failure mode in thinking. Her mistakes are the curriculum.
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────
export default function Track2APM() {
  return (
    <>
      <IntroHero />

      {/* ── M1: PM Role (APM) ── */}
      <ChapterSection num="01" accent="var(--purple)" accentRgb="120,67,238" id="m1-pm-role" first>
        <div className="rv">
          {chLabel('Module 01 · The PM Role — Advanced', 'var(--purple)')}
          {h2(<>Two years in. The metrics look fine. Something&apos;s still wrong.</>)}

          {/* Advanced track framing */}
          <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'rgba(120,67,238,0.06)', border: '1px solid rgba(120,67,238,0.18)', marginBottom: '28px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--purple)', letterSpacing: '0.14em', marginBottom: '10px' }}>HOW THIS TRACK IS DIFFERENT</div>
            <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75, marginBottom: '12px' }}>
              The Foundations track teaches what a PM does. This track asks a harder question: <strong style={{ color: 'var(--ed-ink)' }}>why do experienced PMs still make the same mistakes?</strong> You already know the vocabulary. The gap is in how you apply it under real pressure.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '7px' }}>
              {[
                'Distinguish decision quality from outcome quality — and learn from the right one',
                'Understand why tradeoffs are unavoidable — and how to make them explicit',
                'Recognise activity as a trap that disguises lack of progress',
              ].map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--purple)', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>→</span>
                  <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          <SituationCard accent="var(--purple)" accentRgb="120,67,238">
            Tuesday, 4:15 PM. Priya&apos;s sprint review. Green across the board — shipped on time, under estimate, three new features live. Her manager says &ldquo;great quarter.&rdquo; She smiles. But she&apos;s been running this pattern for six months. Shipped everything. Hit no major milestones. Users open the product, poke around, leave. She can&apos;t name what&apos;s off. She just knows something is.
          </SituationCard>
        </div>

        <div className="rv">
          {para(<>Two years in, the tactical PM skills are solid. You can write a spec, run a sprint, unblock engineering. What gets harder to see: whether the decisions you&apos;re making are actually good ones, or just ones that end arguments and clear the board.</>)}
          {para(<>PM effectiveness isn&apos;t defined by activity — it&apos;s defined by decision quality. A PM can be constantly busy, constantly shipping, and still be making poor decisions. The difference is whether your reasoning process is sound, not whether the outcome was good. Markets change. Competition surprises you. Good decisions produce bad outcomes sometimes. The goal is to reason well — not to just be right.</>)}
          {pullQuote('You can ship every sprint and still make no progress. Activity is not the same as impact.', 'var(--purple)')}
        </div>

        <div className="rv">
          {keyBox('Decision quality vs outcome quality', [
            'Decision quality: your reasoning process was sound given available information',
            'Outcome quality: what actually happened — influenced by factors outside your control',
            'Conflating the two leads to outcome bias: learning wrong lessons from both wins and losses',
            'A good decision with a bad outcome is still a good decision — investigate circumstances, not the process',
            'Clarity of thinking matters more than having the right framework',
          ], 'var(--purple)')}
        </div>

        <div className="rv">
          <DecisionQualitySplitVisual />
        </div>

        <TiltCard style={{ margin: '32px 0' }}><TradeoffMatrix /></TiltCard>

        <div className="rv">
          <ConversationScene
            mentor="rohan" name="Rohan" role="CEO · EdSpark" accent="#E67E22"
            lines={[
              { speaker: 'other', text: "The board was thrilled with the speed. Now engineering tells me your next four features take twice as long. Explain that to me." },
              { speaker: 'priya', text: "I made the tradeoff — fast ship, accept the debt. What I didn\u2019t do was name it explicitly, so nobody planned for the paydown." },
              { speaker: 'other', text: "You should have told me that before the sprint closed, not after the consequences arrived." },
              { speaker: 'priya', text: "The decision was right for the moment. Not communicating it explicitly was the mistake I won\u2019t repeat." },
            ]}
          />
          <Avatar
            name="Asha"
            nameColor="var(--purple-light)"
            borderColor="var(--purple)"
            content={<>Priya&apos;s quiet discomfort is a sign she&apos;s ready to move past execution-as-identity. The PMs who plateau are the ones who keep measuring themselves by shipping. The ones who grow start measuring themselves by what happened <em>after</em> the ship.</>}
            expandedContent={<>The question I ask APMs who are stuck: &ldquo;In the last three decisions you made, what did you predict would happen, what did you think the tradeoff was, and were you right?&rdquo; Most can&apos;t answer. That&apos;s the gap. PM growth at this level isn&apos;t about learning new frameworks — it&apos;s about building a decision log and actually reviewing it.</>}
          />
          <PMPrincipleBox principle="PM effectiveness is defined by decision quality, not activity. Tradeoffs are unavoidable. Clarity of thinking matters more than frameworks." color="var(--purple)" />
          <ApplyItBox prompt="Name the last three product decisions you made. For each: what tradeoff did you make explicit? What did you predict? Were you right? If you can't answer, that's where to start." color="var(--purple)" />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine
            conceptId="pm-role"
            conceptName="The PM Role"
            moduleContext={MODULE_CONTEXT}
            staticQuiz={QUIZZES[0]}
          />
        </div>
        <NextChapterTeaser text="The product triangle you learned as a new PM is more complex than it looks. Optimizing one corner silently degrades the others — often weeks later. Next: the real cost of each corner." accent="var(--purple)" />
      </ChapterSection>

      {/* ── M1: Product Triangle (APM) ── */}
      <ChapterSection num="02" accent="var(--purple)" accentRgb="120,67,238" id="m1-product-triangle">
        <div className="rv">
          {chLabel('Module 01 · What is Product Management', 'var(--purple)')}
          {h2(<>Every optimization has a cost. The triangle doesn't balance — it shifts.</>)}
          <SituationCard accent="var(--purple)" accentRgb="120,67,238">
            Priya's team just shipped a major feature in half the normal time. Stakeholders are thrilled. Three weeks later, engineering tells her that two of her next four features will take twice as long because of code shortcuts taken in the fast sprint. She did the math: she bought 4 weeks of stakeholder satisfaction and spent 8 weeks of future velocity. The tradeoff was invisible at decision time.
          </SituationCard>
          {para(<>The product triangle isn't about maintaining balance across three dimensions. It's about understanding that optimizing any dimension creates real costs in the others — costs that often materialize later, not immediately. Shipping fast creates tech debt. Fixing tech debt slows features. Scaling quickly generalizes the product. Optimizing for revenue degrades user experience.</>)}
          {para(<>There is no perfect balance. There is only contextual optimization — choosing which dimension to prioritize given your current situation, with full awareness of what you're trading away. The PM's job is to make that tradeoff explicit before the decision is made, not to discover it three sprints later.</>)}
        </div>

        <div className="rv">
          {keyBox('How tradeoffs compound over time', [
            'Optimizing one dimension degrades another — often with a time delay',
            'Scaling quickly introduces tech debt that slows future velocity',
            'Fixing tech debt creates a "feature gap" that competitors can exploit',
            'Tradeoffs shift over time as company stage, market, and technology change',
            'The contextual question: what dimension is most critical to optimize for RIGHT NOW?',
          ], 'var(--purple)')}
        </div>

        <div className="rv">
          <TradeoffPrismVisual />
        </div>

        <TiltCard style={{ margin: '32px 0' }}><PMTriangleDiagramAPM /></TiltCard>

        <div className="rv">
          <ConversationScene
            mentor="dev" name="Dev" role="Engineer · EdSpark" accent="#3A86FF"
            lines={[
              { speaker: 'other', text: "The fast sprint bought you four weeks of happy stakeholders and cost us eight weeks of velocity. I need you to sit with that math." },
              { speaker: 'priya', text: "I do. What I got wrong wasn\u2019t the tradeoff — it was not scheduling the debt paydown before the sprint closed." },
              { speaker: 'other', text: "Every time we skip that conversation, I end up explaining it in the next sprint planning instead of building." },
              { speaker: 'priya', text: "Let\u2019s make it a standing item: what debt are we accepting this sprint, and when do we address it." },
            ]}
          />
          <Avatar
            emoji="🤖"
            name="Dev"
            nameColor="var(--blue)"
            borderColor="var(--blue)"
            content={<>Priya's fast-ship decision wasn't wrong. It might have been exactly right for that moment. The failure was not naming the tradeoff at decision time. If you'd told engineering "we're prioritizing speed and accepting tech debt this sprint — let's quantify that debt and schedule paydown," the outcome would have been the same but the team would have been aligned and prepared.</>}
            expandedContent={<>Every PM decision is a hypothesis about which dimension to optimize, for how long, and at what cost. Write it down. "We're choosing to optimize for user growth this quarter at the cost of some technical fragility — we'll address that in Q2." That sentence alone changes how engineering approaches the sprint, how design scopes their work, and how you review the quarter.</>}
          />
          <PMPrincipleBox principle="There is no perfect balance — only contextual optimization. Tradeoffs shift over time. The job is to make them explicit before the decision, not after." color="var(--purple)" />
          <ApplyItBox prompt="What dimension is your team currently over-optimizing? What cost has accumulated that hasn't been acknowledged explicitly? Name it in your next team meeting." color="var(--purple)" />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine
            conceptId="pm-role"
            conceptName="Product Value Triangle"
            moduleContext={MODULE_CONTEXT}
            staticQuiz={QUIZZES[1]}
          />
        </div>
        <NextChapterTeaser text="The tricky part of problem definition at this level: the same problem looks completely different depending on who's framing it. Next: how framing determines your solution space." accent="var(--teal)" />
      </ChapterSection>

      {/* ── M2: Problem vs Solution (APM) ── */}
      <ChapterSection num="03" accent="var(--teal)" accentRgb="0,151,167" id="m2-problem-solution">
        <div className="rv">
          {chLabel('Module 02 · Understanding Users & Problems', 'var(--teal)')}
          {h2(<>The problem you're solving depends on who's describing it</>)}
          <SituationCard accent="var(--teal)" accentRgb="0,151,167">
            Monthly business review. EdSpark's retention dropped 15% this quarter. Three back-to-back stakeholder conversations, three completely different diagnoses. The CEO is worried about pricing relative to competitors. Engineering is flagging performance regressions. Design is pointing at the onboarding redesign that shipped last month. Priya has to decide which problem to solve. She realizes: each of them is right. And each of their solutions would make things worse if the others are also true.
          </SituationCard>
          {para(<>Problem definition is ambiguous at this level. It's not that users describe symptoms — you already know that. The deeper problem: the same set of data, presented to different stakeholders, generates different diagnoses because each person's mental model shapes what they see. Problem framing determines solution space. If you frame retention as a pricing problem, you'll cut prices. If you frame it as a UX problem, you'll redesign. Both might be wrong.</>)}
          {para(<>Misdiagnosis is the most common PM failure at the senior level. Not because PMs are incompetent, but because incomplete or conflicting data allows multiple plausible stories. The PM's job is to create a synthesis frame — one that accounts for the different stakeholder perspectives and points to the intervention that addresses the most probable root cause.</>)}
        </div>

        <div className="rv">
          {keyBox('How to synthesize competing problem frames', [
            'Collect each stakeholder\'s frame explicitly — make them visible side by side',
            'Identify which parts of each frame could be simultaneously true',
            'Find the diagnosis that explains the most evidence from the most frames',
            'Design research to distinguish between the remaining plausible explanations',
            'Write the problem statement as a synthesis, not an arbitration',
          ], 'var(--teal)')}
        </div>

        <TiltCard style={{ margin: '32px 0' }}><ProblemFramingSimulator /></TiltCard>

        <div className="rv">
          <ConversationScene
            mentor="kiran" name="Kiran" role="Data Analyst · EdSpark" accent="#0097A7"
            lines={[
              { speaker: 'other', text: "Retention dropped 15%. CEO says pricing. Engineering says debt. Design says onboarding. They\u2019re all looking at the same number and seeing different movies." },
              { speaker: 'priya', text: "Which frame does your data actually support?" },
              { speaker: 'other', text: "All three, partially — the error rate spiked after the onboarding change, which also correlated with the price increase quarter. It\u2019s not one cause." },
              { speaker: 'priya', text: "Then our job isn\u2019t to pick a frame — it\u2019s to find the hypothesis that explains all three signals at once." },
            ]}
          />
          <Avatar
            emoji="🤖"
            name="Asha"
            nameColor="var(--teal)"
            borderColor="var(--teal)"
            content={<>Each stakeholder's frame is shaped by their information environment. The CEO sees competitor win/loss data. Engineering sees error logs. Design sees usability sessions. None of them sees all of it. The PM is the only person whose job is to synthesize all three signals into a coherent hypothesis.</>}
            expandedContent={<>The most dangerous move in a multi-stakeholder problem: choosing one frame and acting on it. The second most dangerous: averaging all three frames into a solution that addresses none of them. The right move is to find the hypothesis that explains all three frames, design the cheapest test to confirm or deny it, and then act with appropriate conviction.</>}
          />
          <PMPrincipleBox principle="Problem framing determines solution space. Different stakeholders interpret the same issue differently. Misdiagnosis is the most common failure mode." color="var(--teal)" />
          <ApplyItBox prompt="Name your team's top-priority problem right now. Write out three different stakeholder frames for the same problem. What does the synthesis hypothesis look like?" color="var(--teal)" />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine
            conceptId="problem-definition"
            conceptName="Problem vs Solution"
            moduleContext={MODULE_CONTEXT}
            staticQuiz={QUIZZES[2]}
          />
        </div>
        <NextChapterTeaser text="The problem framing depends on the data you have. But every research method introduces its own distortion. Next: how to identify bias before it corrupts your diagnosis." accent="var(--teal)" />
      </ChapterSection>

      {/* ── M2: Research Methods (APM) ── */}
      <ChapterSection num="04" accent="var(--teal)" accentRgb="0,151,167" id="m2-research">
        <div className="rv">
          {chLabel('Module 02 · Understanding Users & Problems', 'var(--teal)')}
          {h2(<>All research introduces distortion. The goal is to know which kind.</>)}
          <SituationCard accent="var(--teal)" accentRgb="0,151,167">
            Priya runs an interview study to understand retention. She interviews 12 users. The results are glowing — users love EdSpark, find it valuable, would recommend it. She prepares the findings. Her manager asks: "Who did you interview?" Priya lists the users. Her manager: "These are all 6-month+ retained users. What did your churned users say?" Priya hadn't thought to interview them. She realizes: she only interviewed the survivors.
          </SituationCard>
          {para(<>Every research method introduces bias. Interviews with retained users give you survivorship bias — you only see the population that didn't fail. Surveys that ask leading questions introduce confirmation bias. Interviews conducted right after a bad support experience introduce recency bias. All data is directional. That's not a weakness — it's the nature of evidence. The PM's job is to know which bias is present and account for it.</>)}
          {para(<>At this level, the goal isn't to find unbiased research — that doesn't exist. The goal is to identify the direction of each bias and triangulate toward something closer to truth. If your interviews skew toward happy users, design research that explicitly samples unhappy ones. If your surveys ask about satisfaction, design one that asks about friction. Balance the systematic distortions.</>)}
        </div>

        <div className="rv">
          {keyBox('Research biases to watch for', [
            'Survivorship bias: only sampling users who stayed — churned users are invisible',
            'Confirmation bias: research designed to validate what you already believe',
            'Recency bias: user feedback colored by a recent salient experience',
            'Social desirability bias: users tell you what they think you want to hear',
            'Method choice bias: the tool you choose shapes what you can find',
          ], 'var(--teal)')}
        </div>

        <TiltCard style={{ margin: '32px 0' }}><ResearchBiasIdentifier /></TiltCard>

        <div className="rv">
          <ConversationScene
            mentor="kiran" name="Kiran" role="Data Analyst · EdSpark" accent="#0097A7"
            lines={[
              { speaker: 'other', text: "Your research says users love the product. You interviewed 12 people. All 12 are still active customers." },
              { speaker: 'priya', text: "The churned users\u2026 they\u2019re not in the sample at all." },
              { speaker: 'other', text: "They voted with their feet and you never asked them why — so you only understand the experience of the people who stayed." },
              { speaker: 'priya', text: "Which is exactly the population we don\u2019t need to understand better. We need to talk to the people who left." },
            ]}
          />
          <Avatar
            emoji="🤖"
            name="Asha"
            nameColor="var(--teal)"
            borderColor="var(--teal)"
            content={<>Priya's survivorship bias mistake is incredibly common. The users who churn are the most important signals you're missing. They voted with their feet. Their mental model of the product's value didn't match its actual delivery. If you never interview them, you can never understand why your retention ceiling exists.</>}
            expandedContent={<>The research stack I recommend for APMs: design every study with an explicit bias inventory. Before you run it, write down: what population am I sampling? What am I not sampling? What questions am I asking? What am I not asking? What experience are interviewees currently having that might color their responses? Then decide whether you can account for those biases or whether you need a different study design.</>}
          />
          <PMPrincipleBox principle="Each research method has tradeoffs and biases. The goal is to reduce uncertainty, not find absolute truth. All data is directional — know which direction." color="var(--teal)" />
          <ApplyItBox prompt="In your last research study, which users did you not interview? What might they have told you that your current findings can't capture? What would it take to find out?" color="var(--teal)" />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine
            conceptId="problem-definition"
            conceptName="User Research Methods"
            moduleContext={MODULE_CONTEXT}
            staticQuiz={QUIZZES[3]}
          />
        </div>
        <NextChapterTeaser text="Understanding problems clearly is necessary but not sufficient. You still have to choose which problems to solve and which markets to enter. Next: strategy as the art of saying no." accent="var(--blue)" />
      </ChapterSection>

      {/* ── M3: Strategy (APM) ── */}
      <ChapterSection num="05" accent="var(--blue)" accentRgb="58,134,255" id="m3-strategy">
        <div className="rv">
          {chLabel('Module 03 · Product Strategy', 'var(--blue)')}
          {h2(<>Strategy is what you say no to. Good opportunities are the hardest ones to decline.</>)}
          <SituationCard accent="var(--blue)" accentRgb="58,134,255">
            Q3 planning. EdSpark's BD team brings in a proposal: expand from sales teams to HR teams. "HR has training budgets, similar enterprise dynamics, and we already have contacts." The revenue case is real. The CEO is excited. Three people on the leadership team are already half-sold. Priya is the PM on point. She does the analysis. On paper, the move is clearly good. But something doesn't add up.
          </SituationCard>
          {para(<>Strategy is not a plan. It's a set of coherent choices under constraints, often requiring saying no to genuinely good opportunities. The EdSpark-to-HR expansion isn't obviously wrong — it's actually a reasonable business case. That's what makes it dangerous. The hardest strategic decisions aren't between a good option and a bad one. They're between a good option and a better-for-your-specific-context option.</>)}
          {para(<>Bad strategy avoids hard choices. It looks like: "let's serve everyone," "let's test and learn," "let's pursue the adjacent market while protecting our core." These feel like smart hedges. They're actually the absence of a strategic call. Real strategy means naming what you're not going to do — and accepting the opportunity cost of that choice.</>)}
        </div>

        <div className="rv">
          {keyBox('Strategy as a set of coherent choices', [
            'Strategy requires saying no to good opportunities that would dilute core value',
            'Every market expansion is a tradeoff between breadth and depth',
            'Bad strategy avoids hard choices — it hedges rather than commits',
            'What you don\'t do defines your strategy as much as what you do',
            'Test: can your strategy generate a prediction about what you won\'t build?',
          ], 'var(--blue)')}
        </div>

        <TiltCard style={{ margin: '32px 0' }}><StrategyTradeoffScenario /></TiltCard>

        <div className="rv">
          <ConversationScene
            mentor="rohan" name="Rohan" role="CEO · EdSpark" accent="#E67E22"
            lines={[
              { speaker: 'other', text: "HR teams have training budgets, similar enterprise dynamics, and we already have contacts there. This is a clean expansion." },
              { speaker: 'priya', text: "On paper, yes. But our best sales team customers value us because we\u2019re built specifically for their workflows — generalize to HR and we stop being excellent for anyone." },
              { speaker: 'other', text: "We\u2019re leaving real revenue on the table by staying narrow." },
              { speaker: 'priya', text: "And if we take it, we might lose the customers who value us most — which is a worse outcome than the revenue we didn\u2019t capture." },
            ]}
          />
          <Avatar
            emoji="🤖"
            name="Asha"
            nameColor="var(--blue)"
            borderColor="var(--blue)"
            content={<>The EdSpark-to-HR expansion feels like risk mitigation. In practice, it's a different kind of risk: the risk of becoming mediocre at two things instead of excellent at one. The companies that build category-defining products almost always expand after they've dominated their core — not while they're still establishing it.</>}
            expandedContent={<>The strategic test I apply: if you made this move and it succeeded perfectly, what would your product look like in 18 months? Would your best current users still find it excellent? If the answer is "they'd find it good but more general," you've just described how to lose your most valuable customers in exchange for a larger, less committed audience.</>}
          />
          <PMPrincipleBox principle="Strategy is defined by tradeoffs. Expanding to new markets may dilute core value. Bad strategy avoids hard choices — it refuses to commit." color="var(--blue)" />
          <ApplyItBox prompt="What opportunity has your team discussed pursuing that you've been hedging on? Write the case for saying no to it. What do you protect by not going there?" color="var(--blue)" />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine
            conceptId="strategy"
            conceptName="Product Strategy"
            moduleContext={MODULE_CONTEXT}
            staticQuiz={QUIZZES[4]}
          />
        </div>
        <NextChapterTeaser text="EdSpark had PMF with early users. Now it's growing — and something's changing. Next: why PMF can mislead you and how to tell if it's still real." accent="var(--blue)" />
      </ChapterSection>

      {/* ── M3: PMF (APM) ── */}
      <ChapterSection num="06" accent="var(--blue)" accentRgb="58,134,255" id="m3-pmf">
        <div className="rv">
          {chLabel('Module 03 · Product Strategy', 'var(--blue)')}
          {h2(<>PMF isn't binary. You can have it with one segment and lose it with the next.</>)}
          <SituationCard accent="var(--blue)" accentRgb="58,134,255">
            Q4 business review. EdSpark's early cohorts are still excellent — Q1 2023 users have 68% six-month retention. But Priya notices something: each new cohort retains worse than the last. Q3 2024 cohort has 18% six-month retention. The CEO reads this as "growth is hard." Priya reads it differently. The product hasn't changed dramatically. The users have. And the product isn't working as well for the users they're now attracting.
          </SituationCard>
          {para(<>PMF is not a destination. It's a relationship between your product and a specific user population — and that relationship has to be continuously maintained as the population evolves. Early adopters are self-selected: they have high tolerance for friction, high motivation to make the product work, and needs that often closely match what the product was built for. As you grow, you reach users who don't share those qualities.</>)}
          {para(<>The local maxima problem: you find PMF with early adopters and mistake it for universal PMF. Each new cohort you acquire is subtly different from the one before. The product that delighted your first 200 customers may frustrate your next 2,000. Retention curves diverging by cohort is the signal. The question is whether you see it before it becomes a crisis.</>)}
        </div>

        <div className="rv">
          {keyBox('How PMF evolves', [
            'PMF is a relationship between product and user population — populations change',
            'Early adopters have different needs and tolerances than mainstream users',
            'Local maxima: you hit PMF with early adopters but not mainstream users',
            'Retention by cohort is the diagnostic — diverging curves signal a PMF problem',
            'PMF must be continuously maintained, not declared and forgotten',
          ], 'var(--blue)')}
        </div>

        <TiltCard style={{ margin: '32px 0' }}><PMFLocalMaximaDemo /></TiltCard>

        <div className="rv">
          <ConversationScene
            mentor="kiran" name="Kiran" role="Data Analyst · EdSpark" accent="#0097A7"
            lines={[
              { speaker: 'other', text: "Q1 2023 cohort: 68% month-6 retention. Q3 2024 cohort: 18%. Each new cohort retains worse than the last." },
              { speaker: 'priya', text: "Rohan reads this as \u2018growth is hard.\u2019 I think the product isn\u2019t keeping up with the users we\u2019re now acquiring." },
              { speaker: 'other', text: "Early adopters tolerated the friction because they really wanted it to work. The new cohort doesn\u2019t have that patience." },
              { speaker: 'priya', text: "Then this isn\u2019t a growth problem — it\u2019s a product-market fit problem with a new segment we\u2019ve never designed for." },
            ]}
          />
          <Avatar
            emoji="🤖"
            name="Kiran"
            nameColor="var(--coral)"
            borderColor="var(--coral)"
            content={<>The most important retention analysis a growth-stage PM can run: cohort-by-cohort retention curves. If month-6 retention is stable across cohorts, your PMF is holding as you grow. If each new cohort retains worse, you're acquiring users who don't yet find enough value to stay. That's a product problem, not a marketing problem.</>}
            expandedContent={<>The question I ask when I see diverging cohort retention: "What's different about the users in recent cohorts versus early ones?" This forces research on the new user population — who are they, what are they trying to do, what does their experience of the product look like in week 2 and week 8? Often, the finding is that the product was never designed for the persona it's now acquiring at scale.</>}
          />
          <PMPrincipleBox principle="PMF is not binary — it evolves. Different segments may have different levels of fit. Local maxima can mislead teams. PMF must be continuously maintained." color="var(--blue)" />
          <ApplyItBox prompt="Pull your cohort retention curves. Is month-6 retention stable across cohorts from last year to this year? If it's declining, what changed about the users you're acquiring?" color="var(--blue)" />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine
            conceptId="strategy"
            conceptName="Product-Market Fit"
            moduleContext={MODULE_CONTEXT}
            staticQuiz={QUIZZES[5]}
          />
        </div>
        <NextChapterTeaser text="You have a clear problem. Now you have to convince four stakeholders who each have different data and different opinions. Next: why prioritization at this level is negotiation, not math." accent="var(--coral)" />
      </ChapterSection>

      {/* ── M4: Prioritization (APM) ── */}
      <ChapterSection num="07" accent="var(--coral)" accentRgb="224,122,95" id="m4-prioritization">
        <div className="rv">
          {chLabel('Module 04 · Prioritization', 'var(--coral)')}
          {h2(<>Prioritization is a negotiation about strategy. The RICE score starts the conversation.</>)}
          <SituationCard accent="var(--coral)" accentRgb="224,122,95">
            Sprint planning. Priya presents her prioritized backlog. Feature A has the highest RICE score. The VP of Sales immediately questions the Reach estimate. The VP of Customer Success says the effort score is too low. The engineering lead says Confidence should be 40%, not 80%. Within 15 minutes, three people have disputed different inputs, and every score has shifted. Priya realizes: they're not arguing about scores. They're arguing about strategy.
          </SituationCard>
          {para(<>At the beginner level, prioritization feels like a sorting problem — rank features by score, build the top one. At the experienced level, you realize that prioritization is actually a negotiation between competing priorities, each backed by a stakeholder with different incentives, different information, and a different definition of "most important."</>)}
          {para(<>Frameworks don't resolve that negotiation. They structure it. When the VP of Sales disputes your Reach estimate, she's not questioning your math — she's questioning your strategic assumption about who the product is for. That's the real conversation. RICE made it visible. Now you need to navigate it.</>)}
        </div>

        <div className="rv">
          {keyBox('Prioritization as negotiation', [
            'Stakeholder influence affects outcomes — not just merit of features',
            'Disputing a RICE input is often a proxy for disagreeing about strategy',
            'The real question: whose users are we prioritizing for this sprint?',
            'Frameworks surface assumptions — they don\'t resolve strategic disagreements',
            'Alignment on inputs requires alignment on strategy first',
          ], 'var(--coral)')}
        </div>

        <TiltCard style={{ margin: '32px 0' }}><StakeholderNegotiation /></TiltCard>

        <div className="rv">
          <ConversationScene
            mentor="rohan" name="Rohan" role="CEO · EdSpark" accent="#E67E22"
            lines={[
              { speaker: 'other', text: "Your reach estimate for Feature A is off — you\u2019re underestimating by at least 40%. I want it rescored." },
              { speaker: 'priya', text: "Walk me through your number — because what I\u2019m disputing isn\u2019t the math, it\u2019s the strategic assumption underneath it." },
              { speaker: 'other', text: "We\u2019re targeting enterprise, not SMB. Your reach figure assumes SMB volumes." },
              { speaker: 'priya', text: "Then this isn\u2019t a RICE disagreement — it\u2019s a \u2018who are we building for this quarter\u2019 disagreement, and that\u2019s the conversation we should be having." },
            ]}
          />
          <Avatar
            emoji="🤖"
            name="Dev"
            nameColor="var(--blue)"
            borderColor="var(--blue)"
            content={<>Every RICE dispute I've been in eventually reveals a strategy disagreement underneath. "Who is our primary user?" "What stage are we at — growth or retention?" "Are we enterprise or SMB?" Prioritization can't resolve those questions. But it will always surface them. That's a feature, not a bug.</>}
            expandedContent={<>The move I make when a RICE debate gets circular: stop scoring and ask the strategy question directly. "Before we agree on the Reach estimate, let's agree on who we're optimizing for this quarter — the enterprise cohort or the full user base. That answer determines every input." Once that's settled, the math becomes easier and the negotiation more productive.</>}
          />
          <PMPrincipleBox principle="Prioritization is a negotiation between competing priorities. Frameworks support decisions, not replace judgment. Stakeholder influence affects outcomes." color="var(--coral)" />
          <ApplyItBox prompt="In your last prioritization meeting, what was the real disagreement underneath the feature debate? Name it. What strategic question would have resolved it earlier?" color="var(--coral)" />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine
            conceptId="prioritization"
            conceptName="Why Prioritization Matters"
            moduleContext={MODULE_CONTEXT}
            staticQuiz={QUIZZES[6]}
          />
        </div>
        <NextChapterTeaser text="Scoring systems can be gamed. Experienced PMs know this. Next: how frameworks create false precision and when to override them." accent="var(--coral)" />
      </ChapterSection>

      {/* ── M4: Frameworks (APM) ── */}
      <ChapterSection num="08" accent="var(--coral)" accentRgb="224,122,95" id="m4-frameworks">
        <div className="rv">
          {chLabel('Module 04 · Prioritization', 'var(--coral)')}
          {h2(<>Frameworks create false precision. Experienced PMs use them as tools, not verdicts.</>)}
          <SituationCard accent="var(--coral)" accentRgb="224,122,95">
            Priya notices something over the course of two quarters. The RICE scores her team produces always seem to favor the features the most senior stakeholder wanted to build. Not because the math is wrong — the inputs are plausible. But the inputs are being shaped by what conclusion people want to reach. The framework didn't remove politics. It just gave politics a spreadsheet.
          </SituationCard>
          {para(<>RICE and similar frameworks create an illusion of objectivity. They take assumptions — reach, impact, confidence, effort — and process them into a number that looks authoritative. But the number is only as good as the inputs, and inputs can be gamed. People inflate Reach for features they want to build. They underestimate Effort for features they want to deprioritize. The framework becomes a post-hoc rationalization engine.</>)}
          {para(<>Experienced PMs use frameworks as tools, not rules. The framework's value isn't the output number — it's the process of making assumptions explicit and checkable. When a stakeholder wants to dispute an input, that's healthy. When the framework is used to shut down debate rather than start it, something has gone wrong.</>)}
        </div>

        <div className="rv">
          {keyBox('Using frameworks well at the senior level', [
            'Fill in inputs before you know which feature "wins" — avoids backfilling',
            'Fill in inputs as a team, not alone — reduces individual bias',
            'Treat disputed inputs as signal: what assumption is actually in conflict?',
            'Use the score to structure the conversation, not close it',
            'Context matters more than formula — know when to override the score',
          ], 'var(--coral)')}
          {pullQuote("All models are wrong, but some are useful. — George Box", 'var(--coral)')}
        </div>

        <div className="rv">
          <ConversationScene
            mentor="dev" name="Dev" role="Engineer · EdSpark" accent="#3A86FF"
            lines={[
              { speaker: 'other', text: "RICE scores are in. Feature B wins — reach 8,000, impact high, confidence 80%, effort 3 weeks." },
              { speaker: 'priya', text: "That\u2019s the third time in two quarters the top RICE score matched exactly what leadership wanted before we ran the numbers." },
              { speaker: 'other', text: "\u2026I didn\u2019t backfill on purpose. But you might be right that I filled in what felt reasonable given the direction." },
              { speaker: 'priya', text: "That\u2019s how it works — nobody games it consciously. Run the inputs before you know which feature you want to win." },
            ]}
          />
          <Avatar
            emoji="🤖"
            name="Dev"
            nameColor="var(--blue)"
            borderColor="var(--blue)"
            content={<>The tell that a framework is being gamed: the scores always match what leadership already wanted. If your RICE outputs have never surprised you, your team is backfilling, not forecasting. The framework is a mirror, not a compass.</>}
            expandedContent={<>The way I prevent framework gaming: run a pre-mortem on the inputs before running the scores. "If we're wrong about the Reach estimate, in which direction are we likely to be wrong? Are we incentivized to overestimate or underestimate?" Getting people to name their incentive before they name their estimate is the most powerful honesty mechanism I know for prioritization.</>}
          />
          <PMPrincipleBox principle="Frameworks can create false precision. Use them as tools, not rules. Scoring systems can be gamed. Context matters more than formula." color="var(--coral)" />
          <ApplyItBox prompt="Review the last RICE exercise your team ran. Did any stakeholder's favored feature score unusually well? What input drove the result? Was it defensible or backfilled?" color="var(--coral)" />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine
            conceptId="prioritization"
            conceptName="Prioritization Frameworks"
            moduleContext={MODULE_CONTEXT}
            staticQuiz={QUIZZES[7]}
          />
        </div>
        <NextChapterTeaser text="Frameworks are for decisions. Execution is about alignment — and alignment fails in ways that have nothing to do with the quality of your decisions. Next: what actually goes wrong in execution." accent="var(--green)" />
      </ChapterSection>

      {/* ── M5: Cross-functional work (APM) ── */}
      <ChapterSection num="09" accent="var(--green)" accentRgb="21,129,88" id="m5-teams">
        <div className="rv">
          {chLabel('Module 05 · Execution & Collaboration', 'var(--green)')}
          {h2(<>Misalignment is the default state. Communication quality determines execution quality.</>)}
          <SituationCard accent="var(--green)" accentRgb="21,129,88">
            Priya's search feature shipped clean. But three weeks later, usage is flat. She digs into the design handoff notes. The spec said "filter by date." Design interpreted that as upload date — the date the recording was added to the system. Engineering built exactly what design specified. Users needed call date — the date the conversation happened. Three people, one ambiguous phrase, three weeks of work aimed at the wrong target.
          </SituationCard>
          {para(<>At the beginner level, collaboration is about communication style and stakeholder management. At the experienced level, you realize the real challenge is resolving conflicts between different mental models of the same problem. Priya, design, and engineering all thought they were aligned. They weren't — they had subtly different mental representations of what "date filtering" meant to users.</>)}
          {para(<>Misalignment is the default state of every cross-functional team. People bring different domain knowledge, different information, and different experiences to the same conversation. "Alignment" is not a one-time event — it's a continuous process of surfacing and resolving differences in how people understand the problem and the solution.</>)}
        </div>

        <div className="rv">
          {keyBox('How to create real alignment', [
            'Alignment is about mental models, not agreement on specs',
            'The test: can your engineer explain the user\'s problem in their own words?',
            'Resolve conflicts by surfacing mental model differences explicitly',
            'Communication quality determines execution quality at every stage',
            'Misalignment compounds: small differences at kick-off become large divergences at ship',
          ], 'var(--green)')}
        </div>

        <div className="rv">
          <ConversationScene
            mentor="dev" name="Dev" role="Engineer · EdSpark" accent="#3A86FF"
            lines={[
              { speaker: 'other', text: "We built what design specified — \u2018filter by date.\u2019 In the data model that\u2019s upload date. That\u2019s what we shipped." },
              { speaker: 'priya', text: "Users needed call date — the date the conversation happened. That\u2019s a completely different field." },
              { speaker: 'other', text: "If the spec had said \u2018call date\u2019 I would have built call date. One word, three different assumptions." },
              { speaker: 'priya', text: "I used one ambiguous phrase and none of us thought to ask what the other person meant by it." },
            ]}
          />
          <Avatar
            emoji="🤖"
            name="Asha"
            nameColor="var(--purple-light)"
            borderColor="var(--purple)"
            content={<>Priya's date filter bug is the single most important example in this track. Three people worked hard on the same feature and built the wrong thing — not because of incompetence, but because one ambiguous word ("date") carried different meanings for each of them. This is how most execution failures work.</>}
            expandedContent={<>The mental model test I teach: after a kick-off meeting, ask each person to write down independently: "A user will open this feature and do what, exactly?" Compare the answers before work begins. If three people write three different scenarios, you haven't aligned — you've agreed to proceed with hidden divergence. Surface it now, before three weeks of work.</>}
          />
          <PMPrincipleBox principle="Collaboration is about resolving conflicts and aligning incentives. Misalignment is the default state. Communication quality determines execution quality." color="var(--green)" />
          <ApplyItBox prompt="After your next kick-off, ask each participant independently: 'What will a user do with this feature on day 1?' If the answers differ, you have a mental model gap to resolve before work starts." color="var(--green)" />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine
            conceptId="collaboration"
            conceptName="Working with Teams"
            moduleContext={MODULE_CONTEXT}
            staticQuiz={QUIZZES[8]}
          />
        </div>
        <NextChapterTeaser text="Mental model gaps compound over time. A small misalignment at kick-off becomes a shipped product nobody wanted. Next: how execution failures really happen." accent="var(--green)" />
      </ChapterSection>

      {/* ── M5: Execution Risks (APM) ── */}
      <ChapterSection num="10" accent="var(--green)" accentRgb="21,129,88" id="m5-execution">
        <div className="rv">
          {chLabel('Module 05 · Execution & Collaboration', 'var(--green)')}
          {h2(<>Execution failures are rarely about effort. They're about diverging mental models.</>)}
          <SituationCard accent="var(--green)" accentRgb="21,129,88">
            Post-mortem. The date filter bug. Priya leads the retro. Everyone on the team was working hard. Nobody was confused. They shipped exactly what they thought was right. The post-mortem surfaces: Priya had been thinking about this from a user's perspective — "find the call from Tuesday." Design was thinking from a data architecture perspective — "when was this uploaded?" Engineering was building what design specified. Three valid perspectives, one catastrophic mismatch. Nobody was wrong. The mental models were.
          </SituationCard>
          {para(<>Execution failures at the senior PM level rarely come from lack of clarity in the spec or poor engineering. They come from small differences in mental models that nobody thought to surface — because each person assumed their model was shared. The engineer who built the upload-date filter wasn't incompetent. Their mental model of "what date means to this user" was simply different from the actual user's mental model.</>)}
          {para(<>The compounding problem: misalignments that are small at kick-off grow larger over time. A slightly different understanding of who the feature is for in week one becomes a feature that serves the wrong user in week three. By the time it ships, the divergence is significant. But the problem was visible — and fixable — on day one.</>)}
        </div>

        <div className="rv">
          {keyBox('How to catch mental model divergence early', [
            'Walk through a specific user scenario together before sprint starts',
            'Ask each team member to narrate the user\'s experience independently',
            'Surface ambiguous terms explicitly: what does "date" mean in this context?',
            'Small misalignments at definition compound into major execution failures',
            'Alignment is continuous: check in at midpoint with a user scenario walkthrough',
          ], 'var(--green)')}
        </div>

        <div className="rv">
          <ConversationScene
            mentor="asha" name="Asha" role="AI Mentor" accent="#7843EE"
            lines={[
              { speaker: 'other', text: "Everyone on the team worked hard. Nobody was confused. They built exactly what they thought was right. So where did it go wrong?" },
              { speaker: 'priya', text: "The kickoff. I said \u2018filter by date\u2019 and assumed we all meant the same thing." },
              { speaker: 'other', text: "What would you have had to ask at kickoff to catch it?" },
              { speaker: 'priya', text: "\u2018Walk me through exactly what a user does when they open this filter.\u2019 That one question would have surfaced it in 30 seconds." },
            ]}
          />
          <Avatar
            emoji="🤖"
            name="Asha"
            nameColor="var(--teal)"
            borderColor="var(--teal)"
            content={<>Mental models are invisible until they diverge. The only way to surface them early is to make implicit assumptions explicit. "When I say 'filter by date,' what's the user trying to do?" That question, asked in kick-off, would have caught the entire bug before a line of code was written.</>}
            expandedContent={<>The research on team cognition is clear: shared mental models significantly improve team performance. But shared mental models don't form automatically — they require explicit conversation and verification. The post-meeting "alignment check" that most teams skip is actually the most important execution tool you have. Write down: what we're building, for whom, solving what exact problem, with what success criteria. Share it. Ask people to disagree. Surface the gaps.</>}
          />
          <PMPrincipleBox principle="Execution failures often stem from misaligned mental models rather than lack of effort. Alignment is continuous, not one-time. Small misunderstandings scale into major issues." color="var(--green)" />
          <ApplyItBox prompt="Review your last post-mortem. Was the root cause really what the team named? Or was there a mental model divergence underneath it that nobody surfaced? What would have caught it at kick-off?" color="var(--green)" />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine
            conceptId="collaboration"
            conceptName="Execution Risks"
            moduleContext={MODULE_CONTEXT}
            staticQuiz={QUIZZES[9]}
          />
        </div>
        <NextChapterTeaser text="The execution is solid. Now: are you measuring the right thing? And are you measuring it honestly? Next: metrics as proxies and when they mislead." accent="var(--purple)" />
      </ChapterSection>

      {/* ── M6: Metrics (APM) ── */}
      <ChapterSection num="11" accent="var(--purple)" accentRgb="120,67,238" id="m6-metrics">
        <div className="rv">
          {chLabel('Module 06 · Metrics & Growth', 'var(--purple)')}
          {h2(<>Metrics are proxies. They measure a shadow of what you care about — and the shadow can move independently.</>)}
          <SituationCard accent="var(--purple)" accentRgb="120,67,238">
            End of quarter. EdSpark's DAU is up 20%. Priya's manager is pleased. Priya is not. She digs into what users are actually doing during those active sessions. Turns out: a large fraction of the DAU increase is users who come back, check their notification badge, and leave within 30 seconds. They're "daily active" by definition. They're not engaging with the product by any meaningful measure. The metric is technically accurate. It's not measuring what everyone assumed it was measuring.
          </SituationCard>
          {para(<>Metrics are proxies for reality. A proxy is useful only as long as it stays correlated with what it's meant to represent. DAU is a proxy for "users who are getting value from the product." When users come back to check a badge and leave, DAU rises but value delivery doesn't. The proxy has decoupled from its referent. This is how metrics mislead.</>)}
          {para(<>The deeper problem: metrics can be gamed, intentionally or not. When "daily actives" becomes a success metric, the product starts optimizing for behaviors that produce daily actives — notifications, streaks, badges — without necessarily producing user value. Goodhart's Law: when a measure becomes a target, it ceases to be a good measure. Context is the only thing that prevents this.</>)}
        </div>

        <div className="rv">
          {keyBox('Interpreting metrics at the senior level', [
            'Every metric is a proxy — understand what it\'s proxying for',
            'Ask: under what conditions would this metric rise without real value increasing?',
            'Track the metric AND the behavior it\'s meant to proxy',
            'Context changes the meaning: what changed when the metric moved?',
            'Metrics can be gamed — design them to be hard to game',
          ], 'var(--purple)')}
        </div>

        <div className="rv">
          <ConversationScene
            mentor="kiran" name="Kiran" role="Data Analyst \u00b7 EdSpark" accent="#0097A7"
            lines={[
              { speaker: 'other', text: "DAU is up 20%. Your manager is happy. But I pulled the session depth — a big chunk of that lift is users who open the app, check the notification badge, and leave in under 30 seconds." },
              { speaker: 'priya', text: "So they\u2019re daily active by definition but not engaging with anything." },
              { speaker: 'other', text: "Exactly. The metric is technically correct. The story everyone\u2019s telling about it is wrong." },
              { speaker: 'priya', text: "We need to redefine \u2018active\u2019 before the next review. \u2018Completes at least one core action\u2019 — something that actually requires using the product." },
            ]}
          />
          <Avatar
            emoji="🤖"
            name="Kiran"
            nameColor="var(--coral)"
            borderColor="var(--coral)"
            content={<>The DAU finding reveals an interpretive failure, not a data failure. The data was correct — the story people told about it was wrong. Define what \u201cactive\u201d means before you set it as a success metric.</>}
            expandedContent={<>The metric design question I always ask: \u201cWhat user behavior would make this number go up without the product delivering real value?\u201d If the answer is easy — if users can game it by opening the app and closing it — design a tighter metric. The harder it is to satisfy the metric without delivering value, the more reliable it is as a signal.</>}
          />
          <PMPrincipleBox principle="Metrics are proxies for reality and can mislead if not interpreted carefully. Metrics can be gamed. Context is critical for interpretation." color="var(--purple)" />
          <ApplyItBox prompt="For each metric your team tracks: what user behavior would make this number rise without real value increasing? If you can answer easily, the metric needs tightening." color="var(--purple)" />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine
            conceptId="north-star"
            conceptName="Understanding Metrics"
            moduleContext={MODULE_CONTEXT}
            staticQuiz={QUIZZES[10]}
          />
        </div>
        <NextChapterTeaser text="If one metric can mislead you, imagine what happens when that metric is your north star. Next: guardrail metrics and when to override your most important number." accent="var(--purple)" />
      </ChapterSection>

      {/* ── M6: North Star (APM) ── */}
      <ChapterSection num="12" accent="var(--purple)" accentRgb="120,67,238" id="m6-north-star">
        <div className="rv">
          {chLabel('Module 06 · Metrics & Growth', 'var(--purple)')}
          {h2(<>The north star can be right and still mislead you. Guardrail metrics are how you know.</>)}
          <SituationCard accent="var(--purple)" accentRgb="120,67,238">
            Q4 business review. Sessions per user — EdSpark's north star — hit an all-time high. Priya is about to call it a success. Then she opens the support dashboard: tickets per user up 41%. She opens the NPS tracking: down 8 points. Churn: up 15%. More sessions, more problems, lower satisfaction, more users leaving. The north star is going up. Everything else is going wrong.
          </SituationCard>
          {para(<>A single metric cannot capture all dimensions of success. The north star is a directional heuristic — it's meant to be correlated with value delivery. But correlations can break. Sessions per user can rise because users are active. It can also rise because users are confused, repeatedly attempting actions they can't complete, and generating support tickets in the process. The metric can't distinguish the two.</>)}
          {para(<>This is why guardrail metrics exist. They don't replace the north star — they protect it. When guardrail metrics deteriorate while the north star rises, you've found evidence that the north star is diverging from its intended meaning. That's the moment to investigate, not celebrate. Optimizing a single metric may harm others. The north star is only reliable in context.</>)}
        </div>

        <div className="rv">
          {keyBox('Guardrail metrics in practice', [
            'Guardrail metrics protect against north star divergence — track them alongside it',
            'When guardrails deteriorate while north star rises, investigate immediately',
            'Common guardrails: NPS, churn, support ticket volume, core action completion',
            'Optimizing north star at the expense of guardrails is a losing trade',
            'Decide in advance: what guardrail values would cause you to override the north star?',
          ], 'var(--purple)')}
          {pullQuote("When a measure becomes a target, it ceases to be a good measure. — Charles Goodhart", 'var(--purple)')}
        </div>

        <TiltCard style={{ margin: '32px 0' }}><GuardrailMetricsDemo /></TiltCard>

        <div className="rv">
          <ConversationScene
            mentor="kiran" name="Kiran" role="Data Analyst \u00b7 EdSpark" accent="#0097A7"
            lines={[
              { speaker: 'priya', text: "Sessions per user hit an all-time high. The board is going to call this a win." },
              { speaker: 'other', text: "Before you do — check the guardrails. Support tickets per user: up 41%. NPS: down 8 points. Churn: up 15%." },
              { speaker: 'priya', text: "More sessions, more problems, lower satisfaction, more users leaving. The north star is going up while everything else is going wrong." },
              { speaker: 'other', text: "Users are having more sessions because they\u2019re confused, not because they\u2019re getting value. The metric can\u2019t tell the difference — that\u2019s what guardrails are for." },
            ]}
          />
          <Avatar
            emoji="🤖"
            name="Kiran"
            nameColor="var(--coral)"
            borderColor="var(--coral)"
            content={<>The north star divergence is the most sophisticated failure mode here. Sessions are up — because users are confused and looping. The metric became a local optimum disconnected from actual value. That\u2019s what guardrails catch before the board review.</>}
            expandedContent={<>The guardrail design question I always ask: \u201cIf the north star rose 30% but these three other things happened, would I still consider this a success?\u201d The \u201cthree other things\u201d are your guardrails. Define them before you start optimizing. If you define them after the fact, you\u2019ll rationalize away any deterioration that\u2019s inconvenient. Guardrails only work if they\u2019re non-negotiable in advance.</>}
          />
          <PMPrincipleBox principle="A single metric cannot capture all dimensions of success. Optimizing one metric may harm others. Guardrail metrics are essential to protect your north star." color="var(--purple)" />
          <ApplyItBox prompt="Design three guardrail metrics for your current north star. For each: define the threshold that would cause you to pause north star optimization. Write those numbers down before your next review." color="var(--purple)" />
        </div>

        <div className="rv" style={{ marginTop: '28px' }}>
          <QuizEngine
            conceptId="north-star"
            conceptName="North Star Metric"
            moduleContext={MODULE_CONTEXT}
            staticQuiz={QUIZZES[11]}
          />
        </div>
      </ChapterSection>
    </>
  );
}

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

const MODULE_CONTEXT = `Module 02 of Airtribe PM Fundamentals — Track: Experienced APM.
Follows Priya Sharma, Senior PM at EdSpark, 2 years into her role. The CEO wants to expand to Enterprise. Priya must design and run a research program to validate the opportunity honestly — fighting organizational bias, triangulating across methods, and delivering findings that include uncertainty. Covers: research program design, organizational bias, mixed-methods triangulation, survivorship bias, synthesis under uncertainty, and strategic discovery communication.`;

const QUIZZES = [
  {
    question: "Your CEO wants to validate an enterprise expansion. Sales is bullish. Three prospects are already talking to sales. What's the first thing you do?",
    options: [
      'A. Interview the three interested prospects — they are real enterprise signal',
      'B. Design a research program that could find a "no" as easily as a "yes" — including churned trials, competitor customers, and neutral prospects',
      'C. Run a survey to existing SMB customers asking if they want enterprise features',
      'D. Agree to validate the expansion — leadership has already directionally decided',
    ],
    correctIndex: 1,
    explanation: "Three prospects who are already talking to sales are pre-filtered for interest. They cannot tell you whether the market is ready — they can only tell you they're interested. A real research program must be designed to find disconfirming evidence as readily as confirming evidence. If your research design can only return a 'yes,' you're not doing discovery — you're doing confirmation.",
    conceptId: 'user-research',
    keyInsight: "Discovery is only valuable if it can return a 'no.' A research program that can only confirm the hypothesis isn't research — it's rationalization.",
  },
  {
    question: "You're interviewing enterprise prospects to validate an expansion. Shreya's 3 prospects are interested. What's the survivorship risk here?",
    options: [
      'A. None — interested prospects are your target market',
      'B. They self-selected by reaching out. They are not representative of the enterprise market — they represent the subset that already wants to buy',
      'C. The risk is sample size — 3 is too few to be statistically significant',
      'D. The risk is recency bias — they may have changed their mind since they first reached out',
    ],
    correctIndex: 1,
    explanation: "Survivorship bias here means you're only seeing the enterprises that survived the 'interested enough to contact sales' filter. The silent majority of enterprises haven't reached out — because they're skeptical, unaware, or have already ruled you out. The three who called Shreya tell you the ceiling of enthusiasm, not the floor. To understand the real market, you need to talk to enterprises that haven't called.",
    conceptId: 'customer-segments',
    keyInsight: "Self-selected participants always over-represent interest. The most important research participants are often the ones who didn't show up.",
  },
  {
    question: "Your interviews say enterprise customers are very excited. Your competitive analysis of Gong reviews shows SSO, Salesforce integration, and SCIM provisioning as table stakes. These findings conflict. What do you do?",
    options: [
      'A. Trust the interviews — direct customer voice is more reliable than competitive analysis',
      'B. Trust the competitive analysis — it represents a larger sample',
      'C. Dig into the discrepancy — enthusiasm in interviews may be real AND table stakes requirements may exist. Both can be true simultaneously',
      'D. Run more interviews until one finding dominates',
    ],
    correctIndex: 2,
    explanation: "Qualitative and quantitative findings conflicting is not a problem — it's a signal. In this case, both are true: enterprise customers ARE excited about EdSpark's core value (interviews), AND they will require capabilities EdSpark doesn't have before they can sign (competitive analysis). The resolution is segmentation: smaller enterprises (50-100 reps) may be excited and not require SSO/Salesforce. Larger enterprises (200+) are excited but have table stakes requirements that block the deal. You need both findings to tell the complete story.",
    conceptId: 'research-methods',
    keyInsight: "When methods conflict, the conflict is the insight. Two contradictory findings usually mean your population isn't homogeneous.",
  },
  {
    question: "You've completed 8 interviews. 5 of 8 mentioned Salesforce integration as critical. How do you communicate this finding's confidence level?",
    options: [
      'A. High confidence — 5/8 is a clear majority',
      'B. State the finding with its evidence base: "5 of 8 enterprise interviews mentioned Salesforce integration as a requirement. This is a directional signal that warrants validation — not a statistical conclusion."',
      'C. Low confidence — qualitative research can never be conclusive',
      'D. Don\'t mention confidence levels — executives want clarity, not hedging',
    ],
    correctIndex: 1,
    explanation: "Research confidence is not binary. 5/8 in qualitative research is meaningful signal — it's not random noise. But it's also not statistically representative of all enterprise accounts. The right move is to state the finding, state the evidence, state the confidence level, and state what would increase confidence. Executives can work with 'directional signal — warrants validation.' They cannot work with findings that pretend more certainty than exists, or findings that are so hedged they communicate nothing.",
    conceptId: 'insight-synthesis',
    keyInsight: "Every research finding has a confidence level. Communicating it is not weakness — it's precision. Hiding it creates decisions based on false certainty.",
  },
  {
    question: "Your discovery finds that 'enterprise' is ready — but only for the 50-100 rep segment, not 200+. The CEO expected a broader green light. How do you frame the finding?",
    options: [
      'A. Soften it — say "there\'s opportunity in enterprise with some caveats"',
      'B. Split the finding: "EdSpark is ready for mid-market (50-100 reps). Not ready for large enterprise (200+). Here is the specific gap and a path to close it."',
      'C. Report both segments as viable to avoid conflict',
      'D. Recommend delaying the decision until more research is done',
    ],
    correctIndex: 1,
    explanation: "\"Pursue but not yet\" is a legitimate finding — but it must be specific. Vague hesitation ('some caveats') gives the CEO no decision-making surface. A split finding with specific criteria (segment size, capability gap, timeline to close) gives them three things: what to do now (pilot mid-market), what NOT to do (large enterprise this year), and what would unlock the next step (Salesforce integration, SSO). Specificity is what makes a nuanced finding actionable rather than evasive.",
    conceptId: 'problem-framing',
    keyInsight: "A 'not yet' finding is only useful if it's specific about who, what gap, and what would need to change. Vague hesitation is not a recommendation.",
  },
  {
    question: "In enterprise deals, the VP Sales signs the contract, the Sales Manager uses the product, and IT approves integrations. Whose job does EdSpark need to solve?",
    options: [
      'A. The VP Sales — they control the budget and make the final call',
      'B. The Sales Manager — they are the daily user and will drive adoption',
      'C. All three — each controls a different veto point, and failing any one kills the deal',
      'D. IT — integration requirements are the most common deal blocker',
    ],
    correctIndex: 2,
    explanation: "Enterprise JTBD is multi-layered in a way SMB is not. The VP Sales hires EdSpark to standardize coaching and prove ROI to the board. The Sales Manager hires EdSpark to make their reps better without adding to their workload. IT hires EdSpark to not create compliance or security problems. These are three distinct jobs. If EdSpark only solves for the Sales Manager (great product, bad integrations), IT will block the deal. If it only solves for IT (perfect SSO, mediocre product), the manager won't champion it. In enterprise, the job is not singular — it's a coalition.",
    conceptId: 'jtbd',
    keyInsight: "In enterprise, there is no single 'user' with a single job. Discovery must map every veto holder — their job, their criteria, and their failure mode.",
  },
];

// ─────────────────────────────────────────
// INTERACTIVE 1: SPOT THE RESEARCH BIAS
// ─────────────────────────────────────────
const BIAS_DESIGNS = [
  {
    design: '"Interview Shreya\'s 3 interested prospects to understand enterprise demand."',
    biasType: 'Selection / Survivorship bias',
    color: 'var(--coral)',
    rgb: '224,122,95',
    verdict: 'Biased',
    explanation: "These 3 prospects self-selected by contacting sales. They've already passed the 'interested enough to reach out' filter. They cannot tell you whether enterprise customers broadly will buy — they can only tell you that interested ones exist. You're missing every company that considered EdSpark and said no.",
  },
  {
    design: '"Survey all current SMB customers: would you use enterprise features like SSO and admin reporting?"',
    biasType: 'Wrong population',
    color: 'var(--coral)',
    rgb: '224,122,95',
    verdict: 'Biased',
    explanation: "SMB customers are not enterprise buyers. They have different workflows, different IT requirements, different buying processes. Asking SMB customers about enterprise features is like asking weekend cyclists whether they'd buy a Tour de France training plan. They might say yes. Their answer tells you nothing about whether enterprise customers will buy.",
  },
  {
    design: '"Run competitive analysis on Gong and Salesloft reviews — what enterprise features do buyers mention most?"',
    biasType: 'No bias identified',
    color: 'var(--green)',
    rgb: '21,129,88',
    verdict: 'Good approach',
    explanation: "Competitor reviews from enterprise customers are a goldmine: they reveal what features enterprise buyers consider table stakes, what frustrates them, and what they love. Unlike interviews with pre-filtered prospects, reviews represent the full range of enterprise buyers — including disappointed ones. This is exactly what Priya should add to her research program.",
  },
  {
    design: '"Ask the sales team what enterprise customers say they want most."',
    biasType: 'Organizational bias',
    color: 'var(--coral)',
    rgb: '224,122,95',
    verdict: 'Biased',
    explanation: "Sales teams hear from the enterprises they're already in conversations with — another pre-filtered group. They also have an incentive to hear 'we can close this' rather than 'this market isn't ready.' The information passes through two filters (who talks to sales, what sales chooses to relay) before reaching you. Go to the source. Talk to enterprise customers directly.",
  },
];

const SpotTheResearchBias = () => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <div style={glassCard('var(--coral)', '224,122,95')}>
      {demoLabel('Spot the research bias. Tap each design to reveal.', 'var(--coral)')}
      <div style={{ marginBottom: '14px', fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>
        Four research designs. Three have a bias. One is sound. Can you tell which is which before you tap?
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {BIAS_DESIGNS.map((item, i) => {
          const isRevealed = revealed[i];
          return (
            <motion.button
              key={i}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
              style={{
                padding: '16px 18px',
                borderRadius: '12px',
                border: `2px solid ${isRevealed ? item.color : 'rgba(224,122,95,0.18)'}`,
                background: isRevealed ? `rgba(${item.rgb},0.05)` : 'var(--ed-card)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--ed-ink)', lineHeight: 1.6, marginBottom: isRevealed ? '12px' : 0 }}>
                {item.design}
              </div>
              <AnimatePresence>
                {isRevealed && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 800, color: item.color, letterSpacing: '0.12em' }}>{item.verdict.toUpperCase()}</span>
                      <span style={{ padding: '2px 8px', borderRadius: '12px', background: `rgba(${item.rgb},0.12)`, fontSize: '10px', fontWeight: 700, color: item.color, fontFamily: 'monospace' }}>{item.biasType}</span>
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
// INTERACTIVE 2: BUYER / USER / CHAMPION MAP
// ─────────────────────────────────────────
const ENTERPRISE_ROLES = [
  {
    role: 'VP Sales',
    label: 'Economic Buyer',
    color: 'var(--purple)',
    rgb: '120,67,238',
    cares: [
      'ROI — cost per rep trained vs. revenue per rep generated',
      'Proof it works — board-level reporting, not anecdote',
      'Contract terms — annual billing, MSA, liability clauses',
      'Does this fit our current sales motion?',
    ],
    veto: 'Signs or kills the deal. If EdSpark cannot show clear ROI, this person doesn\'t sign.',
    quote: '"Show me the numbers. I need to justify this to my CFO in a spreadsheet."',
  },
  {
    role: 'Sales Manager',
    label: 'Power User / Champion',
    color: 'var(--blue)',
    rgb: '58,134,255',
    cares: [
      'Ease of use — will my reps actually adopt this?',
      'Workflow fit — does it plug into what we already do?',
      'Visibility — can I see who\'s improving and who isn\'t?',
      'Manager overhead — how much work does this add to my week?',
    ],
    veto: 'Will not champion what they don\'t believe in. If it doesn\'t fit their workflow, they go quiet and the deal dies.',
    quote: '"I need something my reps will actually use. They\'ll route around anything that feels like admin."',
  },
  {
    role: 'IT / Sales Ops',
    label: 'Gatekeeper',
    color: 'var(--teal)',
    rgb: '0,151,167',
    cares: [
      'SSO / SAML — does it integrate with Okta or Azure AD?',
      'Salesforce integration — can it pull deal data without manual entry?',
      'SCIM provisioning — can we auto-provision and deprovision users?',
      'Data residency and SOC 2 compliance',
    ],
    veto: 'A hard "no" from IT blocks the contract regardless of enthusiasm from everyone else.',
    quote: '"We can\'t onboard any tool that doesn\'t pass our security review. What\'s your SOC 2 status?"',
  },
  {
    role: 'Sales Rep',
    label: 'End User',
    color: 'var(--green)',
    rgb: '21,129,88',
    cares: [
      'Does this help me close more deals?',
      'Minimum overhead — they will avoid tools that create friction',
      'Coaching they can act on — not just recording, but insight',
      'Not feeling surveilled — psychological safety matters',
    ],
    veto: 'Doesn\'t control the contract, but low adoption will kill renewal. If reps don\'t use it, the manager won\'t renew.',
    quote: '"I\'ll use it if it actually helps me. If it feels like my manager spying on me, I\'ll work around it."',
  },
];

const BuyerUserChampionMap = () => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div style={glassCard('var(--purple)', '120,67,238')}>
      {demoLabel('Enterprise deal roles — tap each to reveal what they care about', 'var(--purple)')}
      <div style={{ marginBottom: '14px', fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>
        In enterprise, &ldquo;the customer&rdquo; is four different people with four different jobs. Failing any one of them can kill the deal — even if the others love it.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        {ENTERPRISE_ROLES.map((role, i) => (
          <motion.button
            key={i}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActive(active === i ? null : i)}
            style={{
              padding: '16px 14px',
              borderRadius: '14px',
              border: `2px solid ${active === i ? role.color : `rgba(${role.rgb},0.2)`}`,
              background: active === i ? `rgba(${role.rgb},0.08)` : 'var(--ed-card)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 800, color: role.color, marginBottom: '2px' }}>{role.role}</div>
            <div style={{ fontSize: '9px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--ed-ink3)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{role.label}</div>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {active !== null && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              padding: '18px 20px',
              borderRadius: '12px',
              background: `rgba(${ENTERPRISE_ROLES[active].rgb},0.06)`,
              border: `1px solid rgba(${ENTERPRISE_ROLES[active].rgb},0.2)`,
              borderLeft: `4px solid ${ENTERPRISE_ROLES[active].color}`,
            }}
          >
            <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: ENTERPRISE_ROLES[active].color, marginBottom: '12px' }}>
              {ENTERPRISE_ROLES[active].role.toUpperCase()} — {ENTERPRISE_ROLES[active].label.toUpperCase()}
            </div>
            <div style={{ fontSize: '12px', fontStyle: 'italic', color: 'var(--ed-ink2)', lineHeight: 1.6, marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--ed-rule)' }}>
              &ldquo;{ENTERPRISE_ROLES[active].quote}&rdquo;
            </div>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.1em', color: 'var(--ed-ink3)', marginBottom: '8px' }}>WHAT THEY CARE ABOUT</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {ENTERPRISE_ROLES[active].cares.map((c, ci) => (
                  <div key={ci} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.5 }}>
                    <span style={{ color: ENTERPRISE_ROLES[active].color, flexShrink: 0 }}>→</span>{c}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(224,122,95,0.07)', border: '1px solid rgba(224,122,95,0.2)' }}>
              <div style={{ fontSize: '9px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--coral)', letterSpacing: '0.1em', marginBottom: '4px' }}>VETO CONDITION</div>
              <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{ENTERPRISE_ROLES[active].veto}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────
// INTERACTIVE 3: CONFIDENCE LADDER
// ─────────────────────────────────────────
const CONFIDENCE_FINDINGS = [
  {
    finding: '"Enterprise customers want Salesforce integration."',
    context: 'Source: Dev Mehta, one VP Sales at a 200-person company, mentioned it as a requirement.',
    correctLevel: 'Low',
    correctColor: 'var(--coral)',
    correctRgb: '224,122,95',
    explanation: "One interview is a hypothesis, not a finding. Dev's requirement is real — but you don't know if it's universal, segment-specific, or idiosyncratic. The right move: treat this as a research question, not a finding. Ask the next 4-5 enterprise prospects about Salesforce before you claim it's a market requirement.",
  },
  {
    finding: '"3 of 4 large enterprise interviews (200+ reps) mentioned Salesforce integration as a deal-blocker."',
    context: 'Source: 4 interviews with VP Sales or CROs at 200+ rep companies conducted in the same week.',
    correctLevel: 'Medium',
    correctColor: 'var(--blue)',
    correctRgb: '58,134,255',
    explanation: "Three of four independent respondents mentioning the same thing is meaningful signal — it's not coincidence. But it's still a small qualitative sample. The right confidence statement: 'strong directional signal that Salesforce integration is a requirement for this segment. Recommend validating with 3-4 more interviews before treating it as a confirmed blocker.' Don't over-claim, but don't under-claim either.",
  },
  {
    finding: '"Mid-market prospects (50-100 reps) have minimal IT requirements and are enthusiastic about EdSpark\'s current feature set."',
    context: 'Source: 4 of 4 mid-market interviews, plus Amplitude data showing similar-sized current customers have higher retention than SMB.',
    correctLevel: 'High',
    correctColor: 'var(--green)',
    correctRgb: '21,129,88',
    explanation: "Qualitative and quantitative triangulate here: every mid-market interview matched the pattern, AND existing product data supports it. This is as close to high-confidence as qualitative research gets. You can present this finding without heavy hedging — while still noting it's based on a specific sample — and recommend action: pilot with 3 mid-market accounts.",
  },
];

const ConfidenceLadder = () => {
  const [selections, setSelections] = useState<Record<number, string>>({});

  const levels = [
    { label: 'Low', color: 'var(--coral)', rgb: '224,122,95' },
    { label: 'Medium', color: 'var(--blue)', rgb: '58,134,255' },
    { label: 'High', color: 'var(--green)', rgb: '21,129,88' },
  ];

  return (
    <div style={glassCard('var(--blue)', '58,134,255')}>
      {demoLabel('Confidence Ladder — rate each finding, then reveal the answer', 'var(--blue)')}
      <div style={{ marginBottom: '14px', fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>
        Every research finding has a confidence level. The right level depends on sample size, method triangulation, and consistency. Rate each finding before revealing the explanation.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {CONFIDENCE_FINDINGS.map((item, i) => {
          const selected = selections[i];
          const isCorrect = selected === item.correctLevel;
          const hasAnswered = !!selected;
          return (
            <div
              key={i}
              style={{
                padding: '18px 20px',
                borderRadius: '14px',
                background: 'var(--ed-card)',
                border: `1px solid ${hasAnswered ? (isCorrect ? 'rgba(21,129,88,0.3)' : 'rgba(224,122,95,0.3)') : 'rgba(58,134,255,0.18)'}`,
                transition: 'border 0.3s',
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--blue)', marginBottom: '8px', letterSpacing: '0.1em' }}>FINDING {i + 1}</div>
              <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--ed-ink)', lineHeight: 1.6, marginBottom: '8px' }}>{item.finding}</div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5, marginBottom: '14px', fontStyle: 'italic' }}>{item.context}</div>
              {!hasAnswered && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  {levels.map(level => (
                    <motion.button
                      key={level.label}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSelections(s => ({ ...s, [i]: level.label }))}
                      style={{
                        padding: '7px 16px',
                        borderRadius: '8px',
                        border: `2px solid rgba(${level.rgb},0.3)`,
                        background: 'var(--ed-card)',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: level.color,
                        fontFamily: 'monospace',
                        transition: 'all 0.18s',
                      }}
                    >
                      {level.label}
                    </motion.button>
                  ))}
                </div>
              )}
              <AnimatePresence>
                {hasAnswered && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 800, color: isCorrect ? 'var(--green)' : 'var(--coral)', letterSpacing: '0.12em' }}>
                        {isCorrect ? '✓ CORRECT' : `✗ ANSWER: ${item.correctLevel.toUpperCase()}`}
                      </span>
                      <span style={{ padding: '2px 10px', borderRadius: '12px', background: `rgba(${item.correctRgb},0.12)`, fontSize: '10px', fontWeight: 700, color: item.correctColor, fontFamily: 'monospace' }}>{item.correctLevel} Confidence</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>{item.explanation}</div>
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
// INTRO HERO
// ─────────────────────────────────────────
const IntroHero = () => (
  <section style={{ background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', padding: '48px 0 40px' }}>
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'flex-start', gap: '40px', flexWrap: 'wrap' as const }}>
      <div style={{ flex: 1, minWidth: '280px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--purple)', marginBottom: '12px', textTransform: 'uppercase' as const }}>
          MODULE 02 · PROBLEM DISCOVERY · ADVANCED TRACK
        </div>
        <h1 style={{ fontFamily: "'Lora', serif", fontSize: '32px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1.2, marginBottom: '16px' }}>
          Discovery Under<br /><span style={{ color: 'var(--purple)' }}>Organizational Pressure</span>
        </h1>
        <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.8, marginBottom: '24px' }}>
          Anyone can do discovery when the organization has no opinion. The hard version is what Priya faces now: a CEO who&apos;s already decided, a sales lead who&apos;s already bullish, and board pressure in the background. Real discovery means designing a research program that could still find a &ldquo;no.&rdquo;
        </div>
        <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'rgba(120,67,238,0.06)', border: '1px solid rgba(120,67,238,0.18)', marginBottom: '24px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--purple)', letterSpacing: '0.14em', marginBottom: '10px' }}>BY THE END OF THIS MODULE</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '7px' }}>
            {[
              'Design a research program that can return a "no" as easily as a "yes"',
              'Map enterprise buyer vs. user vs. gatekeeper — and know whose job matters',
              'Triangulate across qualitative interviews, competitive analysis, and usage data',
              'Communicate research findings with precise confidence levels',
              'Deliver a "pursue but not yet" finding to a room that expected a green light',
            ].map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--purple)', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>→</span>
                <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{obj}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', letterSpacing: '0.14em', marginBottom: '10px' }}>TOOLS PRIYA USES IN THIS MODULE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <ToolBadge name="Dovetail" desc="Tag 8 interview transcripts — find patterns across enterprise segments" accent="var(--purple)" />
            <ToolBadge name="Kraftful" desc="Analyze Gong and Salesloft reviews — extract enterprise table stakes" accent="var(--teal)" />
            <ToolBadge name="Amplitude" desc="Identify SMB accounts behaving like enterprise — find proxy signal" accent="var(--blue)" />
          </div>
        </div>

        <div style={{ padding: '18px 22px', borderRadius: '8px', background: 'var(--ed-card)', borderTop: '1px solid var(--ed-rule)', borderRight: '1px solid var(--ed-rule)', borderBottom: '1px solid var(--ed-rule)', borderLeft: '4px solid var(--purple)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--purple)', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Two years later</div>
          <div style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.8 }}>
            Priya is now a Senior PM at EdSpark. Last Thursday Rohan messaged her: <strong style={{ color: 'var(--ed-ink)' }}>&ldquo;Need you to validate our enterprise push. Board is asking. Can you give me something by end of month?&rdquo;</strong> Priya knows what that message really means.
          </div>
        </div>
      </div>

      {/* Module card */}
      <div style={{ flexShrink: 0, width: '168px', paddingTop: '48px' }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <div className="float3d" style={{ transformStyle: 'preserve-3d' }}>
            <div style={{ background: 'linear-gradient(145deg, #130A2A 0%, #1A0D36 100%)', borderRadius: '14px', padding: '20px 18px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: '#A78BFA', marginBottom: '10px' }}>MODULE 02</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#F5F0FF', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>Problem Discovery</div>
              <div style={{ fontSize: '10px', color: 'rgba(245,240,255,0.45)', marginBottom: '16px' }}>Advanced Track</div>
              <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '14px' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '15%' }} transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }} style={{ height: '100%', background: '#A78BFA', borderRadius: '1px' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[{ val: '7', lbl: 'parts' }, { val: '50', lbl: 'min' }].map(s => (
                  <div key={s.lbl} style={{ flex: 1, padding: '6px 0', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', textAlign: 'center' as const }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#F5F0FF', fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</div>
                    <div style={{ fontSize: '8px', color: 'rgba(245,240,255,0.4)', letterSpacing: '0.08em' }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────
export default function Track2ProblemDiscovery() {
  return (
    <>
      <IntroHero />

      {/* ── PART 1: Research Design ── */}
      <ChapterSection num="01" accentRgb="120,67,238" id="m2-discovery-mindset" first>
        <div className="rv">
          {chLabel('Part 1 · Research Design', 'var(--purple)')}
          {h2(<>The CEO wants &ldquo;validation.&rdquo; That&apos;s a different thing than discovery.</>)}

          <div style={{ padding: '16px 20px', borderRadius: '10px', background: 'rgba(120,67,238,0.06)', border: '1px solid rgba(120,67,238,0.18)', marginBottom: '28px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--purple)', letterSpacing: '0.14em', marginBottom: '10px' }}>IN THIS PART</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '7px' }}>
              {[
                'Spot the difference between "validation" and discovery',
                'Design a research program that can return a no',
                'Identify the three most common biased research designs',
              ].map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--purple)', fontWeight: 700, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          <SituationCard accent="var(--purple)" accentRgb="120,67,238">
            Thursday, 10:04am. Priya walks into Rohan&apos;s office. He&apos;s standing at his standing desk. &ldquo;Sit down, quick one.&rdquo; He pulls up a slide — a single bar chart, three companies, three logos: Gong, Salesloft, and EdSpark. &ldquo;We&apos;re the only one in this space not going upmarket. Shreya has three enterprise prospects right now who reached out to us. Board wants to know if this is a real opportunity. I need you to validate the enterprise expansion by end of month.&rdquo;
          </SituationCard>

          {para(<>Priya asks: &ldquo;Validate meaning — confirm it&apos;s a good opportunity? Or research whether it is?&rdquo;</>)}
          {para(<>Rohan pauses. &ldquo;Research whether it is. But realistically — yes, I think it&apos;s a good opportunity. The question is what the market looks like and what we need to build.&rdquo;</>)}
          {para(<>[Priya makes a note. He&apos;s already decided. Shreya&apos;s already bullish. There&apos;s board pressure. This is the hardest kind of discovery — the kind where the organization has directionally chosen the answer and wants research to confirm it. The trap is subtle: if she designs a research program around Shreya&apos;s 3 interested prospects, she&apos;ll find what they want her to find. She needs to design research that could find a &ldquo;no.&rdquo;]</>)}
          {para(<>She goes back to her desk and opens a blank doc. Research program. She writes three columns: <em>What we want to be true, What would make it false, How to find out.</em></>)}
        </div>

        <div className="rv">
          <Avatar
            name="Arjun"
            nameColor="var(--purple-light)"
            borderColor="var(--purple)"
            content={<>&ldquo;Here&apos;s the trap with organizational bias in research design: the methods you choose determine the findings you&apos;re capable of finding.<br /><br />&ldquo;If your program only interviews interested prospects, it can only confirm interest. If your program only talks to sales reps about what enterprise customers want, it can only find what sales has heard. A well-designed research program must include people who could say no — churned enterprise trials, enterprises who chose a competitor, neutral prospects who haven&apos;t engaged yet.<br /><br />&ldquo;When Rohan said &apos;validate,&apos; Priya heard the right question: am I designing research that could find a &apos;no&apos;?&rdquo;</>}
            expandedContent={<>Arjun&apos;s framework for research program design: (1) State your hypothesis. (2) Write down everything that would make it false. (3) Design methods that could surface each falsifying case. If you can&apos;t name a method that would find a &ldquo;no,&rdquo; your research program is not a research program — it&apos;s a confirmation exercise. At Priya&apos;s level, this is a career-defining skill: the PM who brings real findings, including hard ones, becomes the person leadership trusts. The PM who only confirms hypotheses becomes the person who runs roadshows.</>}
            conceptId="user-research"
            question="Your CEO wants to validate an enterprise expansion. Sales is bullish. Three prospects are already talking to sales. What's the first thing you do?"
            options={[
              { text: "Interview the three interested prospects — they are real enterprise signal", correct: false, feedback: "They are real signal — but biased signal. They self-selected by reaching out to sales. They can tell you what excited enterprises sound like. They cannot tell you whether the enterprise market broadly is ready. You need research that could find a 'no.'" },
              { text: "Design a research program that could find a 'no' as easily as a 'yes' — including churned trials, competitor customers, and neutral prospects", correct: true, feedback: "Exactly. The hardest part of discovery under organizational pressure is maintaining the possibility of an unwelcome finding. A program that can only confirm the hypothesis is not discovery — it's rationalization with methodology." },
              { text: "Agree to validate the expansion — leadership has already directionally decided", correct: false, feedback: "This is how PMs become rubber stamps. If discovery can only return the answer leadership wants, it doesn't protect anyone — not the business, not the team, and not you. Priya's value is precisely her willingness to design research that could find a no." },
            ]}
          />
        </div>

        <div className="rv">
          {pullQuote("Discovery only has value if it can return a finding the organization doesn't want.", 'var(--purple)')}

          <InfoBox title="Priya's Research Program Design" accent="var(--purple)">
            <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.85 }}>
              She decides on three parallel tracks — each capable of finding disconfirming evidence:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              {[
                { track: 'Track 1: Interviews', desc: '8 interviews — 4 with enterprise prospects Shreya hasn\'t talked to yet, 2 with churned enterprise trials (if any exist), 2 with enterprise accounts at competitors. Specifically NOT Shreya\'s 3 prospects as the primary sample.', accent: 'var(--purple)' },
                { track: 'Track 2: Competitive analysis', desc: 'Kraftful analysis of Gong and Salesloft reviews from enterprise customers — what features do they call out? What do they say they\'re missing? What are table stakes in this space?', accent: 'var(--teal)' },
                { track: 'Track 3: Usage data', desc: 'Amplitude: do any current SMB accounts look enterprise-adjacent (team size, usage patterns)? How do they behave differently? Can EdSpark serve them today?', accent: 'var(--blue)' },
              ].map(item => (
                <div key={item.track} style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--ed-card)', border: `1px solid var(--ed-rule)`, borderLeft: `3px solid ${item.accent}` }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: item.accent, letterSpacing: '0.08em', marginBottom: '5px' }}>{item.track.toUpperCase()}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </InfoBox>

          <QuizEngine conceptId="user-research" conceptName="User Research" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[0]} />

          <SpotTheResearchBias />
        </div>
      </ChapterSection>

      {/* ── PART 2: Who You're Researching ── */}
      <ChapterSection num="02" accentRgb="0,151,167" id="m2-customer-segments">
        <div className="rv">
          {chLabel('Part 2 · Who You\'re Researching', 'var(--teal)')}
          {h2(<>Shreya&apos;s prospects are not the enterprise market. They&apos;re the most excited slice of it.</>)}

          <SituationCard accent="var(--teal)" accentRgb="0,151,167">
            Priya meets with Shreya to understand her 3 prospects before she designs the interview list. Shreya pulls up her CRM. Company A: 180 reps, VP Sales very engaged, demoed twice. Company B: 95 reps, Sales Manager reached out after seeing a LinkedIn post. Company C: 280 reps, early-stage conversation, CRO interested. &ldquo;These are warm leads. Dev at Company C is particularly excited.&rdquo; Priya thanks her and goes back to her desk. She opens her research program doc and writes: <em>These three accounts are the ceiling of enthusiasm, not the floor. Do not make them my primary sample.</em>
          </SituationCard>

          {para(<>The problem isn&apos;t that Shreya&apos;s prospects are wrong signal. The problem is they&apos;re filtered signal. These are enterprises that heard about EdSpark and reached out. Every enterprise that heard about EdSpark and said &ldquo;no thanks&rdquo; is invisible to Priya right now.</>)}
          {para(<>She maps out what a representative enterprise sample would actually look like. She needs: enterprises that reached out AND enterprises that didn&apos;t. Enterprises that are currently evaluating EdSpark AND enterprises currently using a competitor. The ones who tried a trial and churned. The ones who are roughly the right profile but have never heard of EdSpark. <em>That&apos;s a research population.</em></>)}
          {para(<>She also notices something in the CRM data: Company A has a VP Sales as the primary contact. Company B&apos;s contact is a Sales Manager. Company C is a CRO. These are different roles with different jobs. The VP Sales is the economic buyer — she controls the budget and signs the contract. The Sales Manager is the daily user and champion. The CRO is thinking about strategy, not features. Priya makes a column: <em>Who I&apos;m talking to vs. Who actually uses it.</em></>)}
        </div>

        <div className="rv">
          <Avatar
            name="Arjun"
            nameColor="var(--teal)"
            borderColor="var(--teal)"
            content={<>&ldquo;In enterprise, you have to hold two completely different questions in your head at the same time: who buys it, and who uses it. These are almost never the same person.<br /><br />&ldquo;Shreya&apos;s contact at Company A is a VP Sales. She controls the budget. She cares about ROI, board-level metrics, and contract terms. She will never open EdSpark on a Tuesday afternoon. The sales manager who reports to her will.<br /><br />&ldquo;If Priya only interviews the economic buyer, she&apos;ll understand the buying decision but miss what drives adoption and renewal. If she only interviews the end user, she&apos;ll understand product-market fit but miss what closes the deal in the first place. She needs both.&rdquo;</>}
            expandedContent={<>The classic enterprise discovery mistake: treating &ldquo;enterprise customer&rdquo; as a single person. There are typically four roles in enterprise deals: economic buyer (controls budget), champion (daily user, internal advocate), gatekeeper (IT, security, compliance), and end user (individual contributors who will either adopt or route around it). Discovery must map all four. A product can nail the economic buyer&apos;s ROI story and still die because IT blocked the integration, or because end users ignored it. Priya&apos;s interview plan needs representation from each layer.</>}
            conceptId="customer-segments"
            question="You're interviewing enterprise prospects to validate an expansion. Shreya's 3 prospects are interested. What's the survivorship risk here?"
            options={[
              { text: "None — interested prospects are your target market", correct: false, feedback: "Interested prospects are one slice of your target market — the slice that already decided to engage. The enterprises that considered EdSpark and said 'not for us' are your target market too. You can't learn from them if they're not in your research." },
              { text: "They self-selected by reaching out. They are not representative of the enterprise market — they represent the subset that already wants to buy", correct: true, feedback: "Exactly. Survivorship bias means you only see the 'survivors' of the 'interested enough to contact sales' filter. The most important insight might be why the majority of enterprise accounts haven't reached out." },
              { text: "The risk is sample size — 3 is too few to be statistically significant", correct: false, feedback: "Sample size is a concern, but it's not the survivorship issue. Even if you had 30 of Shreya's prospects, they'd all have the same selection bias — they all reached out. The right fix is different population, not more of the same population." },
            ]}
          />
        </div>

        <div className="rv">
          {pullQuote("The most important research participants are often the ones who didn't show up.", 'var(--teal)')}

          <InfoBox title="Mapping the Enterprise Research Population" accent="var(--teal)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { group: 'Interested prospects (Shreya\'s 3)', why: 'Ceiling of enthusiasm. Tells you what excited enterprises look like. Cannot tell you if the market is broadly ready.', include: true },
                { group: 'Enterprises evaluating competitors', why: 'The most valuable signal: same buying context, different vendor choice. Why not EdSpark? What\'s the gap?', include: true },
                { group: 'Churned enterprise trials (if any)', why: 'Priya checks and finds 2 accounts that trialed enterprise pricing and didn\'t convert. Interview these first — they tried and rejected.', include: true },
                { group: 'Enterprise-adjacent SMB accounts', why: 'Amplitude shows 4 SMB accounts with 40-60 users behaving differently than typical SMB. Are they a proxy for mid-market?', include: true },
                { group: 'Existing SMB customers asked about enterprise features', why: 'Wrong population — they have different context, IT requirements, and buying processes. Their answers won\'t transfer.', include: false },
              ].map(item => (
                <div key={item.group} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, marginTop: '2px', fontWeight: 800, fontSize: '13px', color: item.include ? 'var(--green)' : 'var(--coral)' }}>{item.include ? '✓' : '✗'}</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '2px' }}>{item.group}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>{item.why}</div>
                  </div>
                </div>
              ))}
            </div>
          </InfoBox>

          <QuizEngine conceptId="customer-segments" conceptName="Customer Segments" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[1]} />

          <BuyerUserChampionMap />
        </div>
      </ChapterSection>

      {/* ── PART 3: Triangulating Evidence ── */}
      <ChapterSection num="03" accentRgb="58,134,255" id="m2-research-methods">
        <div className="rv">
          {chLabel('Part 3 · Triangulating Evidence', 'var(--blue)')}
          {h2(<>The interviews say &ldquo;excited.&rdquo; The competitive analysis says &ldquo;table stakes missing.&rdquo; Both are right.</>)}

          <SituationCard accent="var(--blue)" accentRgb="58,134,255">
            Week two. Priya has completed 8 interviews and run Kraftful across 1,400 Gong and Salesloft reviews from enterprise customers. She&apos;s also pulled an Amplitude segment: accounts with 40+ users in a single domain, using EdSpark at least 3x/week. There are 6 of them in the current SMB base. She opens Dovetail and looks at her tags across all 8 interviews. Three themes surface immediately — each with a count beside it.
          </SituationCard>

          {para(<>Theme 1: &ldquo;excited about core product.&rdquo; Tagged in all 8 interviews. Every enterprise prospect, regardless of size, is genuinely interested in what EdSpark does. This is not manufactured enthusiasm — they lit up when she demoed the coaching replay feature.</>)}
          {para(<>Theme 2: &ldquo;asking about Salesforce integration.&rdquo; Tagged in 3 of 4 interviews with large enterprise (200+ reps), 0 of 4 interviews with mid-market (50-100 reps). &ldquo;Does it pull deal data from Salesforce automatically?&rdquo; One VP Sales at a 280-person company had asked it four times across two meetings.</>)}
          {para(<>Theme 3: &ldquo;IT/compliance questions.&rdquo; SSO, SCIM provisioning, data residency. Tagged in 4 of 4 large enterprise interviews, 1 of 4 mid-market. The Kraftful analysis confirmed it: in Gong and Salesloft enterprise reviews, the top unmet needs were &ldquo;better Salesforce field mapping&rdquo; and &ldquo;regional SSO configuration.&rdquo; These aren&apos;t feature requests for Gong — they&apos;re signals about what enterprise buyers consider baseline.</>)}
          {para(<>The finding is not &ldquo;enterprise is ready&rdquo; or &ldquo;enterprise is not ready.&rdquo; It&apos;s: there are two different enterprise segments with two different gaps. And Priya has data from three different methods pointing to the same split.</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Arjun"
            nameColor="var(--blue)"
            borderColor="var(--blue)"
            content={<>&ldquo;This is what triangulation looks like in practice — not just using multiple methods, but using them to resolve apparent contradictions.<br /><br />&ldquo;Your interviews say customers are excited. Your competitive analysis says table stakes are missing. A less careful PM would pick one and run with it. But both findings are true — they just apply to different segments. The interviews revealed genuine enthusiasm. The competitive analysis revealed that enthusiasm doesn&apos;t equal readiness for large enterprise. The Amplitude data showed EdSpark already has some mid-market-adjacent accounts who behave differently than SMB.<br /><br />&ldquo;The three methods together told a story that none of them could tell alone.&rdquo;</>}
            expandedContent={<>Using Dovetail for multi-interview synthesis: Priya tags every observation with the account size, role, and theme. By interview 8, Dovetail&apos;s tag cloud shows exactly where the split is. The Kraftful analysis is the critical counterpoint: it represents thousands of enterprise customers at competitor products, not just 8 interviews. When qualitative and competitive analysis align on a specific gap (Salesforce integration, SSO), that gap is no longer a hypothesis — it&apos;s validated across multiple independent sources. That&apos;s when a finding earns high confidence.</>}
            conceptId="research-methods"
            question="Your interviews say enterprise customers are very excited. Your competitive analysis of Gong reviews shows SSO, Salesforce integration, and SCIM provisioning as table stakes. These findings conflict. What do you do?"
            options={[
              { text: "Trust the interviews — direct customer voice is more reliable than competitive analysis", correct: false, feedback: "Both are real evidence. The interviews are from 8 accounts — the competitive analysis represents thousands of enterprise customers at similar products. Discarding one source because it conflicts with another misses the point: conflicts between methods usually mean your population isn't homogeneous." },
              { text: "Dig into the discrepancy — enthusiasm in interviews may be real AND table stakes requirements may exist. Both can be true simultaneously", correct: true, feedback: "This is exactly the right move. Enthusiasm and table stakes requirements are not mutually exclusive — enterprise customers can be excited about what EdSpark does AND require capabilities EdSpark doesn't have. The resolution is segmentation." },
              { text: "Run more interviews until one finding dominates", correct: false, feedback: "More interviews with the same population won't resolve a conflict caused by a heterogeneous population. The conflict is telling you the population isn't uniform — you need to stratify, not add volume." },
            ]}
          />
        </div>

        <div className="rv">
          {pullQuote("When methods conflict, the conflict is the insight. It usually means your population isn't homogeneous.", 'var(--blue)')}

          <InfoBox title="Method Triangulation Matrix" accent="var(--blue)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { method: 'Dovetail (interview synthesis)', found: 'Segment split: mid-market excited, low IT requirements. Large enterprise excited but asking for Salesforce + SSO repeatedly.', limit: 'Only 8 accounts — directional signal, not statistical proof.' },
                { method: 'Kraftful (competitor review analysis)', found: 'Gong and Salesloft enterprise users consistently mention Salesforce integration and SSO as table stakes — not differentiators. These are baseline expectations.', limit: 'Competitor customers, not EdSpark prospects. Transferable inference, not direct evidence.' },
                { method: 'Amplitude (usage pattern analysis)', found: '6 current SMB accounts behaving like mid-market: 40+ users, 3x/week usage, multiple team leads accessing. Retention is 20% higher than typical SMB.', limit: 'Small n. Correlation between account size and retention — causation requires validation.' },
              ].map(row => (
                <div key={row.method} style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderLeft: '3px solid var(--blue)' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: 'var(--blue)', letterSpacing: '0.08em', marginBottom: '6px' }}>{row.method.toUpperCase()}</div>
                  <div style={{ fontSize: '12px', color: 'var(--green)', lineHeight: 1.5, marginBottom: '5px' }}>✓ {row.found}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>⚠ {row.limit}</div>
                </div>
              ))}
            </div>
          </InfoBox>

          <QuizEngine conceptId="research-methods" conceptName="Research Methods" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[2]} />
        </div>
      </ChapterSection>

      {/* ── PART 4: The Bias in the Room ── */}
      <ChapterSection num="04" accentRgb="224,122,95" id="m2-interview">
        <div className="rv">
          {chLabel('Part 4 · The Bias in the Room', 'var(--coral)')}
          {h2(<>Dev Mehta isn&apos;t asking for features. He&apos;s describing table stakes EdSpark doesn&apos;t have.</>)}

          <SituationCard accent="var(--coral)" accentRgb="224,122,95">
            Interview 6. Dev Mehta, VP Sales at a 220-person SaaS company. Shreya had flagged him: &ldquo;very warm, has budget, wants to move fast.&rdquo; Priya joins the call at 11am with her Notion doc open and her Dovetail recorder running. Dev gets on immediately, no small talk: &ldquo;Great to meet you. Quick question before we start — does EdSpark integrate with Salesforce natively? And what&apos;s your SSO story?&rdquo;
          </SituationCard>

          {para(<>Priya answers honestly: Salesforce integration is on the roadmap. SSO is in development. She asks if she can understand his context before they dive into features.</>)}
          {para(<>Dev is thoughtful. He explains: he manages 220 sales reps across 4 regions. His team has 14 managers. Coaching happens at the manager level, but he needs visibility across all 14 teams. &ldquo;My biggest problem,&rdquo; he says, &ldquo;is that I can see deal pipeline in Salesforce. I cannot see coaching quality. I have no idea which of my 14 managers is actually developing their reps versus just checking the box.&rdquo;</>)}
          {para(<>Priya is writing fast. [The job isn&apos;t &ldquo;coach better.&rdquo; The job is &ldquo;standardize coaching quality across 220 reps at scale while maintaining compliance and regional visibility.&rdquo; That is a fundamentally different job than what EdSpark&apos;s SMB customers are hiring it for.]</>)}
          {para(<>Dev continues. Does EdSpark support SCIM provisioning? Can they limit admin access by region? Can the system auto-assign recordings to the correct manager based on Salesforce team hierarchy? Priya answers honestly to each: no, in development, not yet. Dev nods. &ldquo;Look — I genuinely like what you&apos;re building. But we can&apos;t run 220 reps through a tool that IT hasn&apos;t cleared and that doesn&apos;t talk to our CRM. That&apos;s not a nice-to-have for us. It&apos;s day one.&rdquo;</>)}
          {para(<>After the call, Priya sits with her notes for a moment. Dev isn&apos;t blocking the deal because he doesn&apos;t like EdSpark. He&apos;s blocking it because EdSpark isn&apos;t ready for his job. That&apos;s a different thing entirely.</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Arjun"
            nameColor="var(--coral)"
            borderColor="var(--coral)"
            content={<>&ldquo;Notice what happened in that call. Dev said &apos;I genuinely like what you&apos;re building.&apos; Shreya would hear that and call him a warm lead. But Priya heard something different: a customer who wants to buy and can&apos;t — because the product isn&apos;t ready for his specific job.<br /><br />&ldquo;The organizational bias trap: when Priya reports back to Shreya, Shreya will say &apos;but Dev said he&apos;s interested!&apos; That&apos;s not wrong — he is interested. But interest is not a leading indicator of a closed deal when table stakes are missing. Priya has to hold the complexity: Dev is genuinely enthusiastic AND EdSpark cannot serve him today. Both sentences are true.&rdquo;</>}
            expandedContent={<>The hardest moment in discovery is when organizational bias meets a nuanced finding. Sales hears &ldquo;interested&rdquo; and marks it as pipeline. Product hears &ldquo;missing table stakes&rdquo; and needs to communicate that as a blocker — without dismissing the genuine interest. The right framing: &ldquo;Dev is a real enterprise buyer with real intent. He cannot sign without Salesforce integration and SSO. These are not features we could de-risk — they are prerequisites for his buying process. If we pursue Dev without those capabilities, we extend his sales cycle by 4-6 months and close at lower probability than SMB.&rdquo;</>}
            conceptId="jtbd"
            question="In enterprise deals, the VP Sales signs the contract, the Sales Manager uses the product, and IT approves integrations. Whose job does EdSpark need to solve?"
            options={[
              { text: "The VP Sales — they control the budget and make the final call", correct: false, feedback: "The VP Sales controls the budget — but if IT blocks the integration or if the Sales Manager won't champion it, the VP Sales won't sign either. Economic buyers follow the recommendation of their trusted lieutenants. You need all three." },
              { text: "All three — each controls a different veto point, and failing any one kills the deal", correct: true, feedback: "Exactly. Enterprise deals are coalition decisions. The VP Sales needs the ROI story. The Sales Manager needs the product to fit their workflow. IT needs security and compliance cleared. Failing any one of these kills the deal — even if the other two are enthusiastic." },
              { text: "IT — integration requirements are the most common deal blocker", correct: false, feedback: "IT requirements are frequently the deal blocker — but they're not the only one. A product that IT loves but the Sales Manager won't champion will also die. You need to solve for all three, even if IT is where most deals currently get stuck." },
            ]}
          />
        </div>

        <div className="rv">
          {pullQuote("'Interested' and 'ready to buy' are not the same signal. Discovery means knowing the difference.", 'var(--coral)')}

          <InfoBox title="Handling Organizational Bias: The Shreya Conversation" accent="var(--coral)">
            <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.85, marginBottom: '14px' }}>
              After the Dev Mehta interview, Priya pulls Shreya aside. Shreya is excited: &ldquo;Dev&apos;s interested! That&apos;s great.&rdquo; Here&apos;s how Priya handles it:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Confirm the enthusiasm first', text: '"Yes — Dev genuinely likes EdSpark\'s core value prop. He spent 40 minutes with me and was specific about what he\'d use it for. That\'s real."', color: 'var(--green)' },
                { label: 'Then surface the blocker with specificity', text: '"He also told me three times that Salesforce integration and SSO are day-one requirements for his IT team. Not nice-to-haves — deal blockers. He can\'t get it past procurement without them."', color: 'var(--coral)' },
                { label: 'Separate interest from timeline', text: '"Dev is in the right segment to buy EdSpark eventually. He is not in the right segment to buy EdSpark this quarter without those capabilities. I want to flag that before we build pipeline around him."', color: 'var(--blue)' },
              ].map(item => (
                <div key={item.label} style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--ed-card)', border: `1px solid var(--ed-rule)`, borderLeft: `3px solid ${item.color}` }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: item.color, letterSpacing: '0.08em', marginBottom: '5px' }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontSize: '12px', fontStyle: 'italic', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{item.text}</div>
                </div>
              ))}
            </div>
          </InfoBox>

          <QuizEngine conceptId="jtbd" conceptName="Jobs to Be Done" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[5]} />
        </div>
      </ChapterSection>

      {/* ── PART 5: Synthesis Under Uncertainty ── */}
      <ChapterSection num="05" accentRgb="21,129,88" id="m2-synthesis">
        <div className="rv">
          {chLabel('Part 5 · Synthesis Under Uncertainty', 'var(--green)')}
          {h2(<>8 interviews. Two completely different pictures. One research program.</>)}

          <SituationCard accent="var(--green)" accentRgb="21,129,88">
            End of week two. Priya opens Dovetail. 8 transcripts, 214 tags, 31 unique themes. She&apos;s been staring at it for two hours. At the surface level, the data looks contradictory: enterprise customers are enthusiastic AND the deal blockers are significant. She could report it as &ldquo;mixed findings&rdquo; and leave the decision to Rohan. But that&apos;s not the job. The job is synthesis.
          </SituationCard>

          {para(<>She filters by account size and the picture clarifies. Below 100 reps: all 4 accounts interviewed expressed enthusiasm, minimal IT requirements, asked about features rather than integrations, and said they could get approval through their manager without an IT review. Above 200 reps: all 4 accounts expressed enthusiasm but raised Salesforce integration, SSO, SCIM provisioning, and data residency. Three of four said these were prerequisites, not preferences.</>)}
          {para(<>The finding isn&apos;t &ldquo;enterprise is ready&rdquo; or &ldquo;enterprise is not ready.&rdquo; The finding is: <em>there is a segment within enterprise for which EdSpark is ready today, and a larger segment for which it isn&apos;t — and they differ systematically by company size.</em> This is more useful than either a simple yes or no.</>)}
          {para(<>She also pulls the Amplitude data. The 6 SMB-adjacent accounts with 40+ users have week-2 retention of 71% — compared to 52% for typical SMB. They use the manager dashboard at 3x the rate. They have multiple team leads. This is a proxy signal: mid-market accounts that ended up in EdSpark&apos;s SMB funnel are already performing like successful enterprise accounts, because they&apos;re closer to the right segment.</>)}
          {para(<>Priya writes the synthesis: <em>EdSpark is ready for mid-market enterprise (50-100 reps). It is not ready for large enterprise (200+). The capability gap at 200+ is structural — Salesforce integration, SSO, SCIM — and would require a dedicated engineering investment before those deals can close reliably.</em></>)}
        </div>

        <div className="rv">
          <Avatar
            name="Arjun"
            nameColor="var(--green)"
            borderColor="var(--green)"
            content={<>&ldquo;Synthesis under uncertainty means resisting two bad instincts: false precision and false humility.<br /><br />&ldquo;False precision: declaring &apos;enterprise is ready&apos; because the interviews were enthusiastic. That ignores the table stakes findings.<br /><br />&ldquo;False humility: reporting &apos;mixed findings, needs more research.&apos; That&apos;s avoidance. Priya has real evidence. The evidence supports a specific, segmented claim. She should make it — with appropriate confidence levels attached.<br /><br />&ldquo;The synthesis isn&apos;t &apos;yes&apos; or &apos;no.&apos; It&apos;s &apos;yes for this specific segment, not yet for this other segment, here&apos;s what changes that.&apos; That&apos;s actionable.&rdquo;</>}
            expandedContent={<>How Priya weights the findings: qualitative findings need to be assessed against sample size, consistency across independent respondents, and triangulation with other methods. 4 of 4 large enterprise accounts mentioning the same blockers — across independent interviews — is high-confidence directional signal. 4 of 4 mid-market accounts expressing enthusiasm without IT blockers, corroborated by Amplitude retention data from similar-sized accounts, is high-confidence signal in the other direction. Priya can present the split with confidence precisely because both sides of the finding are supported by consistent, triangulated evidence.</>}
            conceptId="insight-synthesis"
            question="You've completed 8 interviews. 5 of 8 mentioned Salesforce integration as critical. How do you communicate this finding's confidence level?"
            options={[
              { text: "High confidence — 5/8 is a clear majority", correct: false, feedback: "5/8 in qualitative research is meaningful signal — but it's not 'high confidence' without further context. What segment are those 5 in? Does it triangulate with competitive analysis? Saying 'high confidence' without those qualifiers over-claims the finding." },
              { text: "State the finding with its evidence base: '5 of 8 enterprise interviews mentioned Salesforce integration as a requirement. This is a directional signal that warrants validation — not a statistical conclusion.'", correct: true, feedback: "This is precisely right. You state the finding, the evidence base, and the confidence level. Executives can work with 'directional signal that warrants validation.' That's useful. Hiding the uncertainty or over-claiming the certainty both create worse decisions." },
              { text: "Don't mention confidence levels — executives want clarity, not hedging", correct: false, feedback: "Confidence levels are not hedging — they're precision. An executive making a $500K engineering investment on 'Salesforce integration is required' deserves to know if that's based on 5 interviews or 500. Hiding uncertainty feels like clarity but creates decisions built on false certainty." },
            ]}
          />
        </div>

        <div className="rv">
          {pullQuote("Synthesis under uncertainty is not about finding the answer. It's about being specific about what you know, what you don't, and what would change the finding.", 'var(--green)')}

          <ConfidenceLadder />

          <QuizEngine conceptId="insight-synthesis" conceptName="Insight Synthesis" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[3]} />
        </div>
      </ChapterSection>

      {/* ── PART 6: Strategic Discovery Brief ── */}
      <ChapterSection num="06" accentRgb="0,151,167" id="m2-problem-statement">
        <div className="rv">
          {chLabel('Part 6 · Strategic Discovery Brief', 'var(--teal)')}
          {h2(<>The brief says &ldquo;pursue — but not 200+, not yet.&rdquo; Rohan expected a broader green light.</>)}

          <SituationCard accent="var(--teal)" accentRgb="0,151,167">
            End of month. Priya sends her brief to Rohan at 9:14am, one hour before the meeting. The subject line: &ldquo;Enterprise Research — Findings & Recommendation.&rdquo; He reads it in 8 minutes — she can see the read receipt. No reply. When she walks into the meeting, Rohan is already there with Shreya and the engineering lead, Vikram. They&apos;ve all read the brief.
          </SituationCard>

          {para(<>Priya opens her laptop. She doesn&apos;t lead with the recommendation. She leads with what she found.</>)}
          {para(<>&ldquo;I ran 8 interviews, a competitive analysis of 1,400 enterprise reviews from Gong and Salesloft, and pulled usage data on our 6 largest SMB accounts. Here&apos;s the finding: enterprise is not one market. There are two segments with two different readiness levels. Mid-market — 50 to 100 reps — is ready for EdSpark today. They&apos;re enthusiastic, have minimal IT requirements, and we already have 6 SMB accounts in this range with 71% week-2 retention. Large enterprise — 200-plus reps — is interested but blocked. Three of four large enterprise accounts cited Salesforce integration, SSO, and SCIM provisioning as day-one requirements. Those are not differentiators for us — they&apos;re table stakes that Gong and Salesloft already have.&rdquo;</>)}
          {para(<>Shreya pushes back immediately. &ldquo;But Dev Mehta is interested. We have a real pipeline opportunity.&rdquo;</>)}
          {para(<>&ldquo;Dev is a real opportunity — eventually. Without Salesforce integration and SSO, his sales cycle extends by 4 to 6 months and his probability of closing this quarter drops to under 20%. I checked with two enterprise AEs externally on this — that&apos;s consistent with what they see.&rdquo;</>)}
          {para(<>Rohan is quiet for a moment. &ldquo;So your recommendation is — don&apos;t go enterprise?&rdquo;</>)}
          {para(<>&ldquo;My recommendation is: go mid-market enterprise now. Define our enterprise motion as the 50-to-100 rep segment. Pilot with 3 accounts in that range, track week-2 retention and expansion revenue. Build a roadmap for the large enterprise capability gap — Salesforce integration should be the first investment if we want to unlock 200+. But don&apos;t pitch Dev Mehta as a this-quarter deal. We&apos;re not ready for his job yet.&rdquo;</>)}
          {para(<>Rohan leans back. Shreya is still skeptical. But the data is specific. Priya doesn&apos;t fill the silence.</>)}
        </div>

        <div className="rv">
          <Avatar
            name="Arjun"
            nameColor="var(--teal)"
            borderColor="var(--teal)"
            content={<>&ldquo;This is the hardest delivery in discovery: a &apos;pursue but not yet&apos; finding to a room that expected a green light.<br /><br />&ldquo;Notice what Priya didn&apos;t do. She didn&apos;t soften it to avoid conflict. She didn&apos;t say &apos;there&apos;s opportunity with some caveats.&apos; She was specific: which segment is ready, which isn&apos;t, what the specific gap is, what closing it would require. Specificity is what makes a nuanced finding usable rather than evasive.<br /><br />&ldquo;And she held the line. When Shreya pushed back on Dev, Priya had the receipts — specific data, external validation. She didn&apos;t capitulate. That&apos;s the job.&rdquo;</>}
            expandedContent={<>The structure of Priya&apos;s brief: (1) Scope and method — what she did and how. (2) Findings by segment — mid-market vs large enterprise, with evidence for each. (3) Confidence levels — what&apos;s high confidence (mid-market readiness), what&apos;s directional (large enterprise blockers), what&apos;s unknown (exact sales cycle extension). (4) Recommendation — specific, time-bound, with a clear success metric (week-2 retention and expansion revenue in pilot accounts). (5) What would change the finding — if EdSpark ships Salesforce integration, the large enterprise opportunity reopens. This structure makes the brief actionable even when the finding is uncomfortable.</>}
            conceptId="problem-framing"
            question="Your discovery finds that 'enterprise' is ready — but only for the 50-100 rep segment, not 200+. The CEO expected a broader green light. How do you frame the finding?"
            options={[
              { text: "Soften it — say 'there's opportunity in enterprise with some caveats'", correct: false, feedback: "Vague softening is the worst of both worlds: it doesn't protect the business from a bad bet, and it doesn't give leadership a useful decision surface. Rohan can't act on 'some caveats.' He can act on 'mid-market is ready, large enterprise requires Salesforce integration first.'" },
              { text: "Split the finding: 'EdSpark is ready for mid-market (50-100 reps). Not ready for large enterprise (200+). Here is the specific gap and a path to close it.'", correct: true, feedback: "This is the right move. Specificity makes a nuanced finding actionable. 'Pursue but not yet' is a valid recommendation — but only when it's accompanied by: who to pursue, who not to pursue, what gap exists, and what would close it." },
              { text: "Report both segments as viable to avoid conflict", correct: false, feedback: "This is the PM-as-rubber-stamp failure mode. If you report large enterprise as viable when your data shows it isn't, you're not doing discovery — you're giving Rohan permission to make a bad bet while feeling like he has research backing. That's worse than not doing the research." },
            ]}
          />
        </div>

        <div className="rv">
          {pullQuote("The PM who brings hard findings earns more trust than the PM who confirms what leadership wants to hear.", 'var(--teal)')}

          <InfoBox title="The Discovery Brief — What Priya Sent" accent="var(--teal)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                {
                  section: 'Headline Finding',
                  content: 'EdSpark is ready for mid-market enterprise expansion (50-100 rep teams). It is not ready for large enterprise (200+ rep teams) without Salesforce integration, SSO, and SCIM provisioning.',
                  color: 'var(--teal)',
                },
                {
                  section: 'Evidence — Mid-Market Ready',
                  content: '4 of 4 mid-market interviews: enthusiastic, minimal IT requirements, able to approve purchase at manager level. Amplitude: 6 existing accounts in this range, 71% week-2 retention vs 52% SMB average. No deal blockers identified.',
                  color: 'var(--green)',
                },
                {
                  section: 'Evidence — Large Enterprise Not Ready',
                  content: '3 of 4 large enterprise interviews: Salesforce integration cited as day-one requirement. 4 of 4: IT review required (SSO, SCIM). Kraftful analysis of Gong/Salesloft reviews: Salesforce integration and SSO are table stakes in this segment, not differentiators.',
                  color: 'var(--coral)',
                },
                {
                  section: 'Recommendation',
                  content: 'Define enterprise motion as 50-100 rep teams. Pilot with 3 mid-market accounts. Track: week-2 retention and expansion revenue by month 3. Build Salesforce integration as Phase 2 prerequisite for large enterprise motion.',
                  color: 'var(--blue)',
                },
                {
                  section: 'What Would Change This Finding',
                  content: 'Salesforce integration (native, bi-directional) + SSO (SAML/Okta) would remove the primary blockers for large enterprise. With those capabilities, re-run discovery on 200+ rep segment.',
                  color: 'var(--purple)',
                },
              ].map(item => (
                <div key={item.section} style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderLeft: `3px solid ${item.color}` }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: item.color, letterSpacing: '0.08em', marginBottom: '5px', textTransform: 'uppercase' as const }}>{item.section}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{item.content}</div>
                </div>
              ))}
            </div>
          </InfoBox>

          <QuizEngine conceptId="problem-framing" conceptName="Problem Framing" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[4]} />
        </div>
      </ChapterSection>

      {/* ── FINAL REFLECTION ── */}
      <ChapterSection num="07" accentRgb="120,67,238" id="m2-reflection">
        <div className="rv">
          {chLabel('Final Reflection', 'var(--purple)')}
          {h2(<>Discovery at this level isn&apos;t about finding the problem. It&apos;s about scoping which problem is worth solving and for whom.</>)}

          <SituationCard accent="var(--purple)" accentRgb="120,67,238">
            Two weeks later. Rohan has approved the mid-market pilot. Three accounts, 50-100 reps each. Shreya is working them actively. Priya is the DRI on the pilot metrics. It&apos;s less exciting than an enterprise push. It&apos;s also not a $600,000 bet placed on inadequate infrastructure. In the pipeline review, Rohan mentions to the board: &ldquo;We&apos;re doing enterprise carefully. We defined our entry segment, we&apos;re piloting before committing resources.&rdquo; Priya hears this and recognizes it: her finding, delivered carefully, is now company strategy.
          </SituationCard>

          {para(<>The difference between discovery at the foundation level and discovery at the senior level isn&apos;t the methods. Priya still does interviews. She still looks at Amplitude. She still synthesizes in Dovetail.</>)}
          {para(<>The difference is the operating context. At the foundation level, discovery happens in a relatively neutral environment: here&apos;s a problem, go find the cause. At the senior level, discovery happens inside organizational pressure. The CEO has a direction. Sales has a pipeline. The board has an expectation. The PM&apos;s job is to do real discovery anyway — to design a research program that could return a finding nobody wants, and then to deliver that finding clearly if the data supports it.</>)}
          {para(<>The hardest part isn&apos;t the interviews. It isn&apos;t the synthesis. It&apos;s the moment you walk into a room where everyone expects you to say yes and you have to say &ldquo;yes, but not the way you thought, and here&apos;s the specific reason why.&rdquo; And you have to hold that line when Shreya pushes back, when Rohan goes quiet, when the silence suggests you got it wrong.</>)}
          {para(<>You didn&apos;t get it wrong. The data says what it says. That&apos;s the job.</>)}
        </div>

        <div className="rv">
          {pullQuote("The PM who can say 'no' with data earns the right to say 'yes' and be believed.", 'var(--purple)')}

          {keyBox('What changed at the senior level', [
            'Discovery happens inside organizational bias — you must design against it',
            'The research program, not just the interviews, determines what findings are possible',
            'Enterprise is not a single segment — segment your findings as carefully as your participants',
            'Confidence levels are precision, not hedging — communicate them explicitly',
            'A "pursue but not yet" finding is only useful if it specifies who, what gap, and what changes it',
            'Holding the line when the room pushes back is part of the research process',
          ])}

          <PMPrincipleBox principle="Discovery at scale is not about being smarter than the organization. It&apos;s about being the person the organization trusts to tell them what they need to know — even when it&apos;s not what they want to hear. That trust is built one honest finding at a time." />

          <ApplyItBox prompt="Think about a decision your team is currently leaning toward. Write down: (1) What would make this decision wrong? (2) Is anyone in your research program positioned to surface that disconfirming case? (3) If not — what would you add?" />

          <NextChapterTeaser text="Next: turning strategic discovery into a problem statement engineering can build toward without solving it too early." />
        </div>
      </ChapterSection>
    </>
  );
}

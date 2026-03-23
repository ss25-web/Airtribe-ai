'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import QuizEngine from '../QuizEngine';
import {
  ApplyItBox,
  Avatar,
  ChapterSection,
  NextChapterTeaser,
  PMPrincipleBox,
  SituationCard,
  chLabel,
  demoLabel,
  glassCard,
  h2,
  keyBox,
  para,
  pullQuote,
} from './designSystem';

const MODULE_CONTEXT = `Module 02 of Airtribe PM Fundamentals — Track: Experienced APM.
Priya is evaluating whether EdSpark should move upmarket into enterprise. Leadership wants a green light, sales sees opportunity, and discovery must still remain honest. Covers: confirmation bias, enterprise stakeholder mapping, mixed-method discovery, confidence signaling, and strategic recommendation writing.`;

const QUIZZES = [
  {
    question: 'Your CEO wants enterprise validation and sales already has 3 warm prospects. What is the strongest first move?',
    options: [
      'Interview the 3 warm prospects because they are real pipeline signal',
      'Design a discovery plan that includes disconfirming evidence from lost deals, neutral prospects, competitor users, and product data',
      'Survey current SMB customers about enterprise features',
      'Accept that the strategic direction is already decided and focus only on execution risks',
    ],
    correctIndex: 1,
    explanation: 'Good discovery is built so it can produce a credible no. Warm pipeline is useful, but it is already positively filtered.',
    conceptId: 'user-research',
    keyInsight: 'Discovery is only trustworthy when the design can disconfirm the hypothesis.',
  },
  {
    question: 'Interview excitement and review-mined table stakes conflict. What should Priya do?',
    options: [
      'Trust interviews over review mining',
      'Trust review mining over interviews',
      'Use segmentation to explain why both may be true at once',
      'Run more interviews until one answer wins',
    ],
    correctIndex: 2,
    explanation: 'Methods disagreeing often points to a non-homogeneous market, not bad research.',
    conceptId: 'research-methods',
    keyInsight: 'When methods conflict, the conflict is often the insight.',
  },
  {
    question: 'Priya has 8 interviews and 5 mention Salesforce integration as required. How should she report it?',
    options: [
      'As high confidence because 5 out of 8 is a majority',
      'As a directional signal with its evidence base and explicit confidence',
      'Without confidence language so executives are not confused',
      'Not at all until she has a survey',
    ],
    correctIndex: 1,
    explanation: 'Executives need the evidence and the confidence level, not fake certainty.',
    conceptId: 'insight-synthesis',
    keyInsight: 'Confidence language is precision, not hedging.',
  },
  {
    question: 'Discovery says 50-100 rep teams are viable now, but 200+ teams are not. What is the strongest recommendation?',
    options: [
      'Say enterprise is promising with caveats',
      'Pilot the 50-100 rep segment and explicitly name the gaps blocking 200+ teams',
      'Say no to enterprise until all uncertainty is gone',
      'Broaden the recommendation to avoid disappointing sales',
    ],
    correctIndex: 1,
    explanation: 'A useful recommendation is narrow, explicit, and tied to the capability gap that would reopen the larger opportunity later.',
    conceptId: 'problem-framing',
    keyInsight: 'Nuanced recommendations only work when they are still concrete.',
  },
];

const InfoBox = ({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) => (
  <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '20px 24px', margin: '24px 0', border: '1px solid var(--ed-rule)', borderLeft: `4px solid ${accent}` }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: accent, marginBottom: '14px' }}>{title}</div>
    {children}
  </div>
);

const ToolBadge = ({ name, desc, accent }: { name: string; desc: string; accent: string }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderLeft: `3px solid ${accent}`, margin: '4px 10px 4px 0' }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: accent, letterSpacing: '0.08em' }}>{name}</div>
    <div style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>{desc}</div>
  </div>
);

const BIAS_CASES = [
  { setup: 'Talk only to the 3 prospects already in sales pipeline.', verdict: 'Biased', accent: '#E07A5F', reason: 'They are pre-filtered for interest and cannot tell Priya whether the broader market is truly ready.' },
  { setup: 'Interview lost enterprise deals from the last 90 days.', verdict: 'Strong', accent: '#158158', reason: 'Lost deals often surface blockers more honestly than active opportunities.' },
  { setup: 'Survey current SMB customers about enterprise SSO needs.', verdict: 'Wrong population', accent: '#E07A5F', reason: 'SMB customers cannot answer enterprise procurement and security questions.' },
  { setup: 'Mine competitor reviews before interviews begin.', verdict: 'Strong', accent: '#158158', reason: 'This exposes the category table stakes that interviews may not volunteer immediately.' },
];

function BiasBoard() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div style={glassCard('var(--purple)', '120,67,238')}>
      {demoLabel('Bias check', 'var(--purple)')}
      <div style={{ marginBottom: '14px', fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>Tap each move and judge whether it expands the truth or just confirms the room&apos;s current excitement.</div>
      <div style={{ display: 'grid', gap: '10px' }}>
        {BIAS_CASES.map((item, index) => {
          const open = openIndex === index;
          return (
            <motion.button key={item.setup} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} onClick={() => setOpenIndex(open ? null : index)} style={{ textAlign: 'left', padding: '16px 18px', borderRadius: '12px', border: `1px solid ${open ? item.accent : 'var(--ed-rule)'}`, background: open ? 'var(--ed-cream)' : 'var(--ed-card)', cursor: 'pointer' }}>
              <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--ed-ink)', lineHeight: 1.6 }}>{item.setup}</div>
              <AnimatePresence>
                {open && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                    <div style={{ marginTop: '12px', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', color: item.accent }}>{item.verdict.toUpperCase()}</div>
                    <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>{item.reason}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

const ROLES = [
  { role: 'VP Sales', type: 'Economic buyer', accent: '#7843EE', question: 'Will this create enough measurable value to justify the spend?' },
  { role: 'Sales Manager', type: 'Champion / power user', accent: '#3A86FF', question: 'Will this fit my team workflow and improve rep performance?' },
  { role: 'IT / Sales Ops', type: 'Gatekeeper', accent: '#0097A7', question: 'Can this pass identity, integration, and security requirements?' },
  { role: 'Rep', type: 'End user', accent: '#158158', question: 'Will this help me win, or just watch me more closely?' },
];

function StakeholderMap() {
  const [active, setActive] = useState(0);
  const role = ROLES[active];
  return (
    <div style={glassCard('var(--blue)', '58,134,255')}>
      {demoLabel('Enterprise coalition', 'var(--blue)')}
      <div style={{ marginBottom: '14px', fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>Enterprise &ldquo;customer&rdquo; is a stack of veto points. Discovery fails if Priya only learns from the loudest one.</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
        {ROLES.map((item, index) => (
          <motion.button key={item.role} whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} onClick={() => setActive(index)} style={{ textAlign: 'left', padding: '14px', borderRadius: '12px', border: `1px solid ${active === index ? item.accent : 'var(--ed-rule)'}`, background: active === index ? 'var(--ed-cream)' : 'var(--ed-card)', cursor: 'pointer' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: item.accent }}>{item.role}</div>
            <div style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{item.type}</div>
          </motion.button>
        ))}
      </div>
      <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderLeft: `4px solid ${role.accent}` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: role.accent, letterSpacing: '0.08em', marginBottom: '6px' }}>Core discovery question</div>
        <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{role.question}</div>
      </div>
    </div>
  );
}

const CONFIDENCE_ITEMS = [
  { label: 'Strong directional', accent: '#158158', text: 'Repeated signal across interviews plus corroboration from product or market evidence.' },
  { label: 'Emerging pattern', accent: '#B5720A', text: 'Interesting repetition, but still thin on segmentation or cross-method support.' },
  { label: 'Single anecdote', accent: '#E07A5F', text: 'Worth logging, but not enough to drive strategy on its own.' },
];

function ConfidenceLadder() {
  const [selected, setSelected] = useState(0);
  const active = CONFIDENCE_ITEMS[selected];
  return (
    <div style={glassCard('var(--green)', '21,129,88')}>
      {demoLabel('Confidence signaling', 'var(--green)')}
      <div style={{ marginBottom: '14px', fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>A good PM does not just state findings. They state the strength of the evidence behind them.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {CONFIDENCE_ITEMS.map((item, index) => (
          <motion.button key={item.label} whileHover={{ x: 2 }} whileTap={{ scale: 0.99 }} onClick={() => setSelected(index)} style={{ textAlign: 'left', padding: '12px 14px', borderRadius: '10px', border: `1px solid ${selected === index ? item.accent : 'var(--ed-rule)'}`, background: selected === index ? 'var(--ed-cream)' : 'var(--ed-card)', cursor: 'pointer' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: item.accent }}>{item.label}</div>
          </motion.button>
        ))}
      </div>
      <div style={{ padding: '14px 16px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderLeft: `4px solid ${active.accent}` }}>
        <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{active.text}</div>
      </div>
    </div>
  );
}

export default function Track2ProblemDiscovery() {
  return (
    <>
      <ChapterSection num="01" accentRgb="120,67,238" id="m2-discovery-mindset" first>
        <div className="rv">
          {chLabel('Part 1 · Bias-Resistant Discovery', 'var(--purple)')}
          {h2(<>Leadership already wants a yes. Priya has to design research that can still return no.</>)}
          <SituationCard accent="var(--purple)" accentRgb="120,67,238">Rohan believes enterprise is the obvious next move. Sales already has 3 promising accounts. Priya knows the risk: if she only studies enthusiasm, she will learn that enthusiastic buyers are enthusiastic. That is not strategy. That is confirmation.</SituationCard>
          {para(<>Strategic discovery begins before the first interview. Priya&apos;s real first move is designing a research program that can surface disconfirming evidence: lost deals, neutral prospects, competitor customers, and product data on EdSpark&apos;s largest current accounts.</>)}
          <Avatar
            name="Asha"
            nameColor="var(--purple)"
            borderColor="var(--purple)"
            content={<>&ldquo;If the study cannot credibly say no, it is not discovery. It is staged agreement.&rdquo;</>}
            expandedContent={<>Priya writes down what evidence would strengthen the enterprise hypothesis, what would weaken it, and which voices are already over-represented in the room. That quiet prep work is what protects the business from self-deception.</>}
            conceptId="user-research"
            question="Your CEO wants enterprise validation and sales already has 3 warm prospects. What is the strongest first move?"
            options={[
              { text: 'Interview the 3 warm prospects because they are real pipeline signal', correct: false, feedback: 'They are already filtered for interest, so they cannot answer the broader market question alone.' },
              { text: 'Design a discovery plan that includes disconfirming evidence from lost deals, neutral prospects, competitor users, and product data', correct: true, feedback: 'Exactly. Good discovery widens the sample until the answer can move in either direction.' },
              { text: 'Survey current SMB customers about enterprise features', correct: false, feedback: 'That asks the wrong population to answer an enterprise buying question.' },
            ]}
          />
          {pullQuote('The first job of discovery under pressure is not asking better questions. It is choosing a research design that can survive ambition.', 'var(--purple)')}
          <BiasBoard />
          <QuizEngine conceptId="user-research" conceptName="Bias-Resistant Research" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[0]} />
        </div>
      </ChapterSection>

      <ChapterSection num="02" accentRgb="58,134,255" id="m2-customer-segments">
        <div className="rv">
          {chLabel('Part 2 · Decision-Maker Map', 'var(--blue)')}
          {h2(<>Enterprise is not one customer. It is a coalition with different jobs and veto power.</>)}
          <SituationCard accent="var(--blue)" accentRgb="58,134,255">Shreya keeps saying &ldquo;the customer wants this.&rdquo; Priya pushes back: which customer? The budget owner, the manager champion, IT, or the rep who lives with the tool every day?</SituationCard>
          {para(<>At this level, discovery becomes stakeholder architecture. Priya has to understand who signs, who can stall, who drives adoption, and who determines renewal. A single positive interview can hide four separate failure modes if she collapses them into one persona.</>)}
          <StakeholderMap />
          <InfoBox title="What changes in enterprise JTBD?" accent="var(--blue)">
            {para(<>In SMB, it is sometimes acceptable to talk about &ldquo;the user.&rdquo; In enterprise, that shortcut breaks. Buyer job, champion job, gatekeeper job, and end-user job must be mapped separately or the recommendation will overfit to the loudest stakeholder.</>)}
          </InfoBox>
        </div>
      </ChapterSection>

      <ChapterSection num="03" accentRgb="0,151,167" id="m2-research-methods">
        <div className="rv">
          {chLabel('Part 3 · Mixed-Methods Plan', 'var(--teal)')}
          {h2(<>Priya does not need more opinions. She needs triangulation.</>)}
          <SituationCard accent="var(--teal)" accentRgb="0,151,167">Interview excitement says the bet might be real. Competitor review mining says enterprise table stakes are higher than EdSpark&apos;s current stack. Product data on larger accounts suggests a possible wedge. None of these methods is enough alone. Together, they can become a decision.</SituationCard>
          <div style={{ margin: '12px 0 18px' }}>
            <ToolBadge name="Dovetail" desc="Cluster interview evidence by account size and stakeholder type" accent="var(--teal)" />
            <ToolBadge name="Kraftful" desc="Mine competitor reviews for category table stakes and common blockers" accent="var(--teal)" />
            <ToolBadge name="Amplitude" desc="Check whether EdSpark's largest current accounts already behave differently" accent="var(--teal)" />
          </div>
          <Avatar
            name="Dev"
            nameColor="var(--teal)"
            borderColor="var(--teal)"
            content={<>&ldquo;When methods disagree, don&apos;t rush to pick a winner. Contradiction often means the market has a hidden segmentation variable.&rdquo;</>}
            expandedContent={<>Mid-market teams can love the product and buy quickly. Larger enterprise teams can love the value proposition and still be blocked by SSO, procurement, or CRM integration. Both findings can be true at the same time.</>}
            conceptId="research-methods"
            question="Interview excitement and review-mined table stakes conflict. What should Priya do?"
            options={[
              { text: 'Trust interviews over review mining', correct: false, feedback: 'That throws away a valuable disconfirming source.' },
              { text: 'Trust review mining over interviews', correct: false, feedback: 'That is also too simplistic. Each method sees a different slice.' },
              { text: 'Use segmentation to explain why both may be true at once', correct: true, feedback: 'Exactly. Contradiction often means the market is not homogeneous.' },
            ]}
          />
          <QuizEngine conceptId="research-methods" conceptName="Method Triangulation" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[1]} />
        </div>
      </ChapterSection>

      <ChapterSection num="04" accentRgb="181,114,10" id="m2-interview">
        <div className="rv">
          {chLabel('Part 4 · Signal-Rich Interviews', 'var(--amber)')}
          {h2(<>The hard part is not getting enthusiasm. It is learning what must be true before enthusiasm becomes a real deal.</>)}
          <SituationCard accent="var(--amber)" accentRgb="181,114,10">When a prospect says &ldquo;this looks compelling,&rdquo; Priya never writes that sentence down by itself. She immediately follows with procurement path, IT review, alternative today, and what would still delay the rollout.</SituationCard>
          {para(<>Advanced interviews are less about collecting opinions and more about pressure-testing the path to reality. Priya is listening for dependencies, veto points, and what has killed similar purchases before.</>)}
          <InfoBox title="Prompts Priya uses when a prospect sounds excited" accent="var(--amber)">
            {keyBox('Follow-up prompts', [
              'What would your IT or ops team need to see before this moves forward?',
              'If this were approved, what would still slow rollout?',
              'What alternative are you using today, even if it is messy?',
              'Who becomes uncomfortable if this becomes standard across the org?',
            ], 'var(--amber)')}
          </InfoBox>
        </div>
      </ChapterSection>

      <ChapterSection num="05" accentRgb="21,129,88" id="m2-synthesis">
        <div className="rv">
          {chLabel('Part 5 · Confidence & Tradeoffs', 'var(--green)')}
          {h2(<>Priya must say what is true, how true it seems, and where certainty stops.</>)}
          <SituationCard accent="var(--green)" accentRgb="21,129,88">Eight interviews in, the pattern becomes clear. Teams under 100 reps are excited and operationally lighter. Teams over 200 reps are interested, but the same blockers repeat: SSO, Salesforce integration, security review, procurement drag. Priya now has a recommendation, but only if she states confidence honestly.</SituationCard>
          <ConfidenceLadder />
          <Avatar
            name="Maya"
            nameColor="var(--green)"
            borderColor="var(--green)"
            content={<>&ldquo;False precision is dangerous, but false humility is lazy. &lsquo;Mixed findings, needs more research&rsquo; often hides the fact that a segmented recommendation is already possible.&rdquo;</>}
            expandedContent={<>Priya&apos;s answer is not yes or no. It is: yes for a smaller, faster-moving segment; not yet for large enterprise; here is the missing capability stack; here is what would reopen the call.</>}
            conceptId="insight-synthesis"
            question="Priya has 8 interviews and 5 mention Salesforce integration as required. How should she report it?"
            options={[
              { text: 'As high confidence because 5 out of 8 is a majority', correct: false, feedback: 'That overstates what the evidence can support by itself.' },
              { text: 'As a directional signal with its evidence base and explicit confidence', correct: true, feedback: 'Yes. Evidence plus confidence level is the honest and useful version.' },
              { text: 'Without confidence language so executives are not confused', correct: false, feedback: 'Hiding uncertainty creates worse decisions, not cleaner ones.' },
            ]}
          />
          <QuizEngine conceptId="insight-synthesis" conceptName="Confidence Signaling" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[2]} />
        </div>
      </ChapterSection>

      <ChapterSection num="06" accentRgb="120,67,238" id="m2-problem-statement">
        <div className="rv">
          {chLabel('Part 6 · Strategic Brief', 'var(--purple)')}
          {h2(<>The recommendation is not “enterprise yes.” It is “mid-market now, large enterprise later, with a clear unlock path.”</>)}
          <SituationCard accent="var(--purple)" accentRgb="120,67,238">In the review meeting, sales wants a broad green light. Priya doesn&apos;t give one. She recommends a 50-100 rep wedge with a measured pilot and explicitly names the large-enterprise blockers EdSpark is not yet ready to handle.</SituationCard>
          <InfoBox title="What Priya puts in the brief" accent="var(--purple)">
            {keyBox('Brief structure', [
              'Headline finding: there is a viable mid-market wedge, not a blanket enterprise green light',
              'Evidence: interviews, review mining, and behavior from EdSpark’s larger current accounts',
              'Capability gap: SSO, Salesforce integration, and enterprise provisioning remain blockers for 200+ teams',
              'Action: pilot the 50-100 rep segment with explicit success metrics',
              'Re-open criteria: what new capability would justify revisiting larger enterprise later',
            ], 'var(--purple)')}
          </InfoBox>
          <QuizEngine conceptId="problem-framing" conceptName="Strategic Framing" moduleContext={MODULE_CONTEXT} staticQuiz={QUIZZES[3]} />
        </div>
      </ChapterSection>

      <ChapterSection num="07" accentRgb="0,151,167" id="m2-reflection">
        <div className="rv">
          {chLabel('Final Reflection', 'var(--teal)')}
          {h2(<>At senior level, discovery is part research craft and part organizational courage.</>)}
          <SituationCard accent="var(--teal)" accentRgb="0,151,167">Two weeks later, the company is piloting a narrower mid-market entry instead of making a broad enterprise promise. It is less dramatic than the original narrative. It is also much harder to waste six months chasing the wrong segment.</SituationCard>
          {para(<>The methods did not become magical at this level. Interviews are still interviews. Notes are still notes. What changed is the operating environment. Priya had to discover while ambition, pipeline pressure, and executive expectation all bent toward a pre-written answer.</>)}
          {pullQuote('The PM who can say “not yet” with evidence protects more company value than the PM who says “yes” too early.', 'var(--teal)')}
          <PMPrincipleBox principle="Strategic discovery is not about sounding smarter than the room. It is about giving the room a more honest map of reality than it had before." />
          <ApplyItBox prompt="Pick one strategic bet your team already seems excited about. Write down: what evidence would seriously weaken the bet, who is most likely to surface that evidence, and whether they are represented in your current research plan." />
          <NextChapterTeaser text="Next: turning discovery into a problem statement engineering can build toward without collapsing back into solution-first thinking." />
        </div>
      </ChapterSection>
    </>
  );
}

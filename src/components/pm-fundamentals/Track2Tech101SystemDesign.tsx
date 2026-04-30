'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  h2, para, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser, ApplyItBox, ConversationScene,
} from './designSystem';
import { MentorFace } from './MentorFaces';
import QuizEngine from '../QuizEngine';

const ACCENT     = '#7843EE';
const ACCENT_RGB = '120,67,238';
const MODULE_NUM = '09';
const MODULE_LABEL = 'Tech 101 & System Design';

const PARTS = [
  { num: '01', id: 'm9t2-debt',        label: 'Technical Debt Is Product Debt When It Changes Speed, Trust, or Range' },
  { num: '02', id: 'm9t2-platform',    label: 'Feature Architecture vs Platform Architecture' },
  { num: '03', id: 'm9t2-data',        label: 'If Instrumentation Is Weak, the Strategy Conversation Is Weak' },
  { num: '04', id: 'm9t2-contracts',   label: 'API Contracts Are Also Organizational Contracts' },
  { num: '05', id: 'm9t2-reliability', label: 'Reliability Is Part of the Value Proposition in Enterprise Products' },
  { num: '06', id: 'm9t2-buildvsbuy',  label: 'Build vs Buy Is a Product Advantage Decision' },
  { num: '07', id: 'm9t2-planning',    label: 'Senior PM Credibility Comes from Structured Uncertainty' },
];

const PMPrinciple = ({ text }: { text: string }) => (
  <div style={{ margin: '28px 0', padding: '20px 24px', background: `rgba(${ACCENT_RGB},0.06)`, borderLeft: `4px solid ${ACCENT}`, borderRadius: '0 8px 8px 0' }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', color: ACCENT, marginBottom: '8px', textTransform: 'uppercase' as const }}>PM Principle</div>
    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ed-ink)', lineHeight: 1.65, fontStyle: 'italic', fontFamily: "'Lora', serif" }}>&ldquo;{text}&rdquo;</div>
  </div>
);

// Simple visual components defined locally for Track 2

const DebtArchitectureMap = () => {
  const stages = [
    { label: 'Clean architecture', shortcuts: 0, velocity: 90, color: '#16A34A' },
    { label: 'First shortcuts', shortcuts: 2, velocity: 78, color: '#CA8A04' },
    { label: 'Accumulated debt', shortcuts: 6, velocity: 52, color: '#E67E22' },
    { label: 'Fear to change', shortcuts: 12, velocity: 28, color: '#EF4444' },
  ];
  return (
    <div style={{ margin: '28px 0', borderRadius: '12px', overflow: 'hidden', background: 'var(--ed-card)', border: `1.5px solid ${ACCENT}25` }}>
      <div style={{ padding: '10px 18px', background: `${ACCENT}10`, borderBottom: `1px solid ${ACCENT}20`, fontSize: '9px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>Debt Accumulation Architecture Map</div>
      <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {stages.map((s, i) => (
          <div key={i} style={{ padding: '14px 12px', borderRadius: '10px', background: `${s.color}0D`, border: `1px solid ${s.color}30`, textAlign: 'center' as const }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: s.color, marginBottom: '8px', lineHeight: 1.3 }}>{s.label}</div>
            <div style={{ height: '60px', background: 'var(--ed-cream)', borderRadius: '4px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden', marginBottom: '6px' }}>
              <div style={{ width: '100%', background: s.color, height: `${s.velocity}%`, transition: 'height 0.4s', borderRadius: '2px' }} />
            </div>
            <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>{s.velocity}% velocity</div>
            {s.shortcuts > 0 && <div style={{ fontSize: '8px', color: s.color, marginTop: '4px' }}>{s.shortcuts} shortcuts</div>}
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 18px', borderTop: `1px solid ${ACCENT}15`, fontSize: '11px', color: 'var(--ed-ink3)', fontStyle: 'italic' }}>
        Technical debt matters to PMs when it changes roadmap speed, reliability, or confidence in adjacent launches.
      </div>
    </div>
  );
};

const FeaturePlatformVisual = () => {
  return (
    <div style={{ margin: '28px 0', borderRadius: '12px', overflow: 'hidden', background: 'var(--ed-card)', border: `1.5px solid ${ACCENT}25` }}>
      <div style={{ padding: '10px 18px', background: `${ACCENT}10`, borderBottom: `1px solid ${ACCENT}20`, fontSize: '9px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>Feature Branch vs Platform Spine</div>
      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#CA8A04', marginBottom: '12px', fontFamily: "'JetBrains Mono', monospace" }}>ONE-OFF FEATURE BRANCH</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
            {['Admin reporting (v1)', '↓', '(dead end — no reuse)', '↓', 'Rebuld for mobile', '↓', 'Rebuild for analytics'].map((item, i) => (
              <div key={i} style={{ padding: '6px 10px', borderRadius: '6px', background: i % 2 === 0 ? 'rgba(202,138,4,0.1)' : 'transparent', border: i % 2 === 0 ? '1px solid rgba(202,138,4,0.2)' : 'none', fontSize: '10px', color: i === 2 ? '#EF4444' : 'var(--ed-ink3)', textAlign: i % 2 === 1 ? 'center' as const : 'left' as const }}>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', marginBottom: '12px', fontFamily: "'JetBrains Mono', monospace" }}>PLATFORM SPINE</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
            {['Admin reporting (v1)', '↓', 'Shared data contract', '↓', '↙ Mobile  ↘ Analytics', '↓', '↙ Partner API  ↘ Export'].map((item, i) => (
              <div key={i} style={{ padding: '6px 10px', borderRadius: '6px', background: i % 2 === 0 ? 'rgba(22,163,74,0.08)' : 'transparent', border: i % 2 === 0 ? '1px solid rgba(22,163,74,0.2)' : 'none', fontSize: '10px', color: 'var(--ed-ink3)', textAlign: i % 2 === 1 ? 'center' as const : 'left' as const }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '10px 18px', borderTop: `1px solid ${ACCENT}15`, fontSize: '11px', color: 'var(--ed-ink3)', fontStyle: 'italic' }}>
        Platform is not cleaner feature design. It is justified shared leverage — worth the cost only when consumers are real and near-term.
      </div>
    </div>
  );
};

const MetricSplitScreen = () => {
  return (
    <div style={{ margin: '28px 0', borderRadius: '12px', overflow: 'hidden', background: 'var(--ed-card)', border: `1.5px solid ${ACCENT}25` }}>
      <div style={{ padding: '10px 18px', background: `${ACCENT}10`, borderBottom: `1px solid ${ACCENT}20`, fontSize: '9px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>Metric Truth Split-Screen</div>
      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {[
          { label: 'Dashboard A', event: 'workspace_opened', props: 'user_id, timestamp', value: '2,847 MAU', color: '#3B82F6' },
          { label: 'Dashboard B', event: 'workspace_opened', props: 'user_id, timestamp, team_id, session_type', value: '1,203 MAU', color: '#EF4444' },
        ].map((d, i) => (
          <div key={i} style={{ padding: '14px', borderRadius: '10px', background: `${d.color}0A`, border: `1px solid ${d.color}25` }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: d.color, marginBottom: '8px' }}>{d.label}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)', marginBottom: '4px' }}>event: {d.event}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)', marginBottom: '10px' }}>props: {d.props}</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: d.color, fontFamily: "'JetBrains Mono', monospace" }}>{d.value}</div>
          </div>
        ))}
        <div style={{ gridColumn: '1 / -1', padding: '10px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '11px', color: 'var(--ed-ink2)' }}>
          Same event name. Different property sets. Same-sounding metric. Different numbers. Different truths.
        </div>
      </div>
      <div style={{ padding: '10px 18px', borderTop: `1px solid ${ACCENT}15`, fontSize: '11px', color: 'var(--ed-ink3)', fontStyle: 'italic' }}>
        Weak instrumentation does not only hurt analytics. It weakens the strategic conversations built on top of them.
      </div>
    </div>
  );
};

const DependencyConstellation = () => {
  const consumers = ['Web App', 'Mobile', 'Analytics', 'Partner API', 'Admin Exports'];
  return (
    <div style={{ margin: '28px 0', borderRadius: '12px', overflow: 'hidden', background: 'var(--ed-card)', border: `1.5px solid ${ACCENT}25` }}>
      <div style={{ padding: '10px 18px', background: `${ACCENT}10`, borderBottom: `1px solid ${ACCENT}20`, fontSize: '9px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>Dependency Constellation</div>
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' as const }}>
        {consumers.map((c, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '6px' }}>
            <div style={{ padding: '6px 12px', borderRadius: '8px', background: `${ACCENT}12`, border: `1px solid ${ACCENT}30`, fontSize: '10px', color: ACCENT, fontWeight: 600 }}>{c}</div>
            <div style={{ fontSize: '16px', color: ACCENT }}>&#8595;</div>
          </div>
        ))}
        <div style={{ width: '100%', padding: '10px 16px', borderRadius: '10px', background: '#0f172a', border: `2px solid ${ACCENT}50`, textAlign: 'center' as const }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: ACCENT, fontWeight: 700 }}>GET /api/v1/admin/workspaces/usage</div>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>One contract &mdash; five consumers &mdash; any change ripples outward</div>
        </div>
      </div>
      <div style={{ padding: '10px 18px', borderTop: `1px solid ${ACCENT}15`, fontSize: '11px', color: 'var(--ed-ink3)', fontStyle: 'italic' }}>
        A technical contract becomes an organizational contract once multiple teams plan around it.
      </div>
    </div>
  );
};

export default function Track2Tech101SystemDesign({
  completedSections = new Set<string>(),
}: {
  completedSections?: Set<string>;
}) {
  const donePct  = Math.round((completedSections.size / PARTS.length) * 100);
  const nextPart = PARTS.find(p => !completedSections.has(p.id));

  return (
    <article style={{ padding: '0 0 80px' }}>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', padding: '72px 0 48px', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-20px', top: '-10px', fontSize: 'clamp(140px,18vw,220px)', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.06)`, fontFamily: "'Lora',Georgia,serif", letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>{MODULE_NUM}</div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '14px', textTransform: 'uppercase' as const }}>
              PM Fundamentals &middot; Module {MODULE_NUM} &middot; APM Track
            </div>
            <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.03em', color: 'var(--ed-ink)', marginBottom: '16px', fontFamily: "'Lora',Georgia,serif" }}>
              {MODULE_LABEL}
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora',Georgia,serif", marginBottom: '40px' }}>
              &ldquo;You already know the vocabulary. This track teaches you where technical conversations change the product strategy, risk profile, and execution model.&rdquo;
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '40px' }}>
              {([
                { mentor: 'priya' as const, accent: ACCENT,    name: 'Priya',  role: 'APM / PM Lead', desc: 'Navigating the boundary between product strategy and technical consequence at scale.' },
                { mentor: 'asha'  as const, accent: '#0097A7', name: 'Asha',   role: 'AI PM Mentor',  desc: 'Pushes Priya from vocabulary to judgment: where technical constraints reshape strategy.' },
                { mentor: 'dev'   as const, accent: '#3A86FF', name: 'Dev',    role: 'Engineer',      desc: 'Debt, architecture bets, contract design, and platform vs feature decisions.' },
                { mentor: 'kiran' as const, accent: '#E67E22', name: 'Kiran',  role: 'Data Analyst',  desc: 'Metric truth, instrumentation discipline, and analytical trust.' },
                { mentor: 'rohan' as const, accent: '#E67E22', name: 'Rohan',  role: 'CEO / Leadership', desc: 'Business pressure, reliability commitments, and trust in technical delivery.' },
              ]).map(c => (
                <div key={c.mentor + c.name} style={{ background: `${c.accent}0D`, border: `1px solid ${c.accent}33`, borderRadius: '10px', padding: '14px 16px', minWidth: '140px', flex: '1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <MentorFace mentor={c.mentor} size={40} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: c.accent, lineHeight: 1.2 }}>{c.name}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.04em' }}>{c.role}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{c.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '20px 24px', borderLeft: `4px solid ${ACCENT}`, border: '1px solid var(--ed-rule)', borderLeftWidth: '4px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '12px', textTransform: 'uppercase' as const }}>APM Track Focus</div>
              {[
                'Where technical debt becomes product drag — and how to frame it for leadership',
                'When to platform vs when one-off feature thinking is actually the right bet',
                'How instrumentation quality, API contracts, and reliability shape strategic trust',
              ].map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 2 ? '10px' : 0, alignItems: 'flex-start' }}>
                  <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '12px', marginTop: '2px' }}>0{i + 1}</span>
                  <span style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flexShrink: 0, width: '168px', paddingTop: '48px' }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <div className="float3d" style={{ transformStyle: 'preserve-3d' }}>
                <div style={{ background: 'linear-gradient(145deg, #0D0820 0%, #150D2A 100%)', borderRadius: '14px', padding: '20px 18px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE {MODULE_NUM} · APM</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora',serif", lineHeight: 1.25, marginBottom: '4px' }}>Tech 101</div>
                  <div style={{ fontSize: '10px', color: 'rgba(240,232,216,0.45)', marginBottom: '16px' }}>APM / Scale Track</div>
                  <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '14px' }}>
                    <motion.div animate={{ width: `${donePct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: ACCENT, borderRadius: '1px' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {PARTS.map(p => {
                      const done = completedSections.has(p.id);
                      const isNext = p.id === nextPart?.id;
                      return (
                        <div key={p.num} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, background: done ? '#0D7A5A' : isNext ? ACCENT : 'rgba(255,255,255,0.06)', border: `1px solid ${done ? '#0D7A5A' : isNext ? ACCENT : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: done || isNext ? '#fff' : 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>
                            {done ? '✓' : p.num}
                          </div>
                          <div style={{ fontSize: '9px', color: done ? 'rgba(240,232,216,0.5)' : isNext ? 'rgba(240,232,216,0.9)' : 'rgba(240,232,216,0.3)', lineHeight: 1.3, flex: 1 }}>
                            {p.label.split(' ')[0]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── PART 1 · TECHNICAL DEBT AS PRODUCT DEBT ── */}
      <ChapterSection id="m9t2-debt" num="01" accentRgb={ACCENT_RGB} first>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya wants to accelerate enterprise rollout of Enterprise Admin Workspace. Dev says shipping on top of the current reporting and permissions layer would increase fragility fast. What sounds like an engineering hygiene conversation is actually a product throughput conversation. If the architecture becomes harder to change, the roadmap becomes slower and riskier &mdash; whether leadership notices immediately or not.
        </SituationCard>

        <ConversationScene mentor="dev" name="Dev" role="Engineer" accent="#3A86FF" lines={[
          { speaker: 'priya', text: 'Are we delaying product momentum for engineering cleanliness?' },
          { speaker: 'other', text: 'No. We are deciding whether the current architecture can support the product motion you want next. If we ship on top of this layer, every future change costs significantly more.' },
          { speaker: 'priya', text: 'So the debt is real for me as a PM only when it changes how fast we can iterate?' },
          { speaker: 'other', text: 'Debt is a PM problem the moment it changes roadmap speed, reliability risk, or confidence in adjacent launches.' },
        ]} />

        {h2(<>Technical debt matters to PMs when it changes velocity, trust, or range</>)}

        {para(<>Technical debt is not an engineering cleanliness concern. It is a product throughput concern the moment it constrains iteration speed, increases reliability risk, or reduces confidence in adjacent product bets. PMs who dismiss debt conversations as engineering concerns are misunderstanding where the constraint is sitting. The constraint is in their own roadmap.</>)}

        <DebtArchitectureMap />

        {keyBox('When debt becomes a product problem', [
          'Roadmap speed — shipping on fragile architecture makes every subsequent feature slower to build',
          'Reliability risk — brittle systems have higher failure rates, which damages user trust and enterprise renewals',
          'Scope confidence — teams fear touching debt areas, so scope grows unpredictably during planning',
          'Adjacent launches — debt in one system creates unexpected coupling in nearby features',
        ])}

        <PMPrinciple text="Technical debt matters to PMs when it changes roadmap speed, reliability, or trust." />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Technical debt matters to PMs when it changes how safely and quickly the team can keep learning. It is not about code quality. It is about how constrained the product motion becomes as debt accumulates.</>}
          question="When should a PM treat technical debt as a product problem instead of an engineering concern?"
          options={[
            { text: 'When the engineering team raises it in a sprint retrospective', correct: false, feedback: 'Timing depends on impact, not the meeting in which it is raised. A PM should treat debt as their problem when it starts affecting roadmap speed, reliability risk, or scope confidence.' },
            { text: 'When it changes roadmap speed, reliability, scope confidence, or user trust', correct: true, feedback: 'Correct. Debt is a PM concern when it materially constrains product motion. That is when it stops being an engineering preference and becomes a product throughput issue.' },
            { text: 'When the architecture is older than 18 months and should be rebuilt regardless', correct: false, feedback: 'Age is not the criterion. Impact is. Well-maintained old code may have no debt impact. New code with poor design may already be constraining velocity.' },
          ]}
          conceptId="tech101-apm-debt"
        />

        <ApplyItBox prompt="Identify one area in your product where engineering has flagged debt or fragility. Estimate: if this debt continues accumulating, what happens to iteration speed in 6 months? What does that mean for the roadmap? That is the PM framing for the debt conversation." />

        <QuizEngine
          conceptId="tech101-apm-debt"
          conceptName="Technical Debt as Product Debt"
          moduleContext="PM Module 09 APM Track. Learner understands technical debt from a product strategy perspective."
          staticQuiz={{
            conceptId: 'tech101-apm-debt',
            question: "Engineering says the current permissions layer is fragile and risky to build on. What is the most useful PM response?",
            options: [
              'Defer to engineering judgment and adjust the timeline accordingly',
              'Push back — the product cannot wait for a full permissions rewrite to ship',
              'Ask what the debt concretely costs in roadmap speed and reliability risk, then frame it as a product tradeoff decision',
              'Escalate to leadership for a decision on engineering vs product priority',
            ],
            correctIndex: 2,
            explanation: "The PM response is to make the cost concrete and bring it into the product planning frame. Not defer, not dismiss — convert the technical concern into a product tradeoff between speed now and constraint later, then decide with full visibility.",
          }}
        />

      </ChapterSection>

      {/* ── PART 2 · FEATURE VS PLATFORM ARCHITECTURE ── */}
      <ChapterSection id="m9t2-platform" num="02" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          The team debates whether Enterprise Admin Workspace reporting should stay a one-off feature path or become the first layer of a broader admin platform that other surfaces can reuse later. Priya is caught between near-term delivery pressure and long-term leverage logic. The question is no longer &ldquo;can we build it?&rdquo; but &ldquo;what kind of architectural bet does the product actually justify right now?&rdquo;
        </SituationCard>

        <ConversationScene mentor="dev" name="Dev" role="Engineer" accent="#3A86FF" lines={[
          { speaker: 'priya', text: 'If reuse is possible, shouldn\'t we platform it now and get the leverage earlier?' },
          { speaker: 'other', text: 'Only if reuse is real, near enough, and stable enough to justify the complexity. Platform thinking that outruns actual consumer needs creates expensive infrastructure nobody uses.' },
          { speaker: 'priya', text: 'So platforming too early can be just as harmful as one-off building too long?' },
          { speaker: 'other', text: 'Yes. Platform is not cleaner feature design. It is justified shared leverage. The question is: are the consumers real and near-term enough to justify the cost?' },
        ]} />

        {h2(<>Platform is justified shared leverage &mdash; not architectural preference</>)}

        {para(<>Platforming too early is one of the most expensive mistakes in product engineering. It creates abstractions nobody uses, slows initial delivery, and makes the system harder to change when the actual use cases arrive and look different from what was imagined. The right time to platform is when the signal is clear: multiple real, near-term, stable-enough consumers with enough shared shape to justify a shared contract.</>)}

        <FeaturePlatformVisual />

        {keyBox('When to platform vs when to stay one-off', [
          'Multiple near-term consumers with stable shared needs &rarr; platform signal',
          'One or two speculative future consumers &rarr; build one-off and observe',
          'Consumers with radically different shape or pace &rarr; abstraction probably too early',
          'Same consumer needs repeated three times &rarr; rule of three: now consider platform',
        ])}

        <PMPrinciple text="Platform is not cleaner feature design. It is justified shared leverage." />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Repeated, credible, near-term reuse across multiple consumers with stable shared needs is the strongest signal to start thinking platform instead of one-off. Before that signal is clear, one-off keeps the team learning faster.</>}
          question="What is the strongest signal that a team should start thinking platform instead of one-off feature?"
          options={[
            { text: 'The current feature took too long to build and needs architectural improvement', correct: false, feedback: 'Speed to build is an engineering quality concern, not a platform signal. Platform thinking is justified by consumer demand, not by build experience.' },
            { text: 'Repeated, credible, near-term reuse across multiple consumers with stable shared needs', correct: true, feedback: 'Correct. Real platform decisions require real consumers — teams or surfaces with legitimate, near-term, stable demand for the shared capability. Speculative future consumers do not justify platform complexity.' },
            { text: 'Senior engineering leadership prefers platform architecture on principle', correct: false, feedback: 'Architectural preference is not a product signal. Platform decisions should be driven by demonstrated consumer demand, not engineering aesthetics.' },
          ]}
          conceptId="tech101-apm-platform"
        />

        <ApplyItBox prompt="For a current or planned feature: list who would actually reuse it. Are they real teams or speculative? Is the timeline near-term or distant? Is the shared shape stable enough? Score each dimension — that is your platform readiness assessment." />

        <QuizEngine
          conceptId="tech101-apm-platform"
          conceptName="Feature vs Platform Architecture"
          moduleContext="PM Module 09 APM Track. Learner understands when to make platform vs one-off architectural bets."
          staticQuiz={{
            conceptId: 'tech101-apm-platform',
            question: "A PM proposes building a 'flexible reporting platform' before any second consumer exists. What risk should an experienced PM flag?",
            options: [
              'Reporting platforms are always too complex to build without dedicated infra teams',
              'Over-engineering before consumer demand is validated often creates expensive infrastructure nobody uses',
              'Platforms require a separate product team and cannot be run by a feature PM',
              'The first consumer should always be internal to reduce external risk',
            ],
            correctIndex: 1,
            explanation: "Building platform abstractions before consumer demand is validated is a classic product-engineering mistake. The abstraction is optimized for imagined future use cases that may arrive differently or never. One-off first, platform when consumers are proven.",
          }}
        />

      </ChapterSection>

      {/* ── PART 3 · DATA TRUTH AND INSTRUMENTATION ── */}
      <ChapterSection id="m9t2-data" num="03" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Kiran shows Priya two dashboards for enterprise workspace usage that disagree. Both are technically valid. Neither is trustworthy enough for a strategic decision. Priya realizes the problem is not reporting polish. The problem is that event definitions, property capture, and schema discipline were loose enough to let multiple truths coexist.
        </SituationCard>

        <ConversationScene mentor="kiran" name="Kiran" role="Data Analyst" accent="#E67E22" lines={[
          { speaker: 'priya', text: 'How can both dashboards exist if we\'re tracking the same behavior?' },
          { speaker: 'other', text: 'Because the event names match, but the definitions and properties do not. "Workspace opened" means different things to different teams — and nobody noticed until we tried to make strategic decisions from it.' },
          { speaker: 'priya', text: 'So we can believe we have one metric while actually carrying multiple truths?' },
          { speaker: 'other', text: 'Exactly. Weak instrumentation does not only hurt analytics. It weakens every strategy conversation that depends on it.' },
        ]} />

        {h2(<>Metrics only align teams when the underlying definitions are trusted</>)}

        {para(<>Strategic conversations collapse when teams are using the same metric name to mean different things. Event definitions, property discipline, and schema consistency are not data hygiene tasks &mdash; they are the foundation that makes product strategy conversations trustworthy. PMs who treat instrumentation as a low-priority backlog item are slowly eroding the quality of every product review they run.</>)}

        <MetricSplitScreen />

        {para(<>The APM fix is not just better tracking. It is defining what events mean before they are implemented, auditing instrumentation as part of feature scope, and treating &ldquo;we can track that later&rdquo; as a risk statement that requires a plan.</>)}

        <PMPrinciple text="If instrumentation is loose, strategy conversations become fiction faster than anyone notices." />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Metrics only align teams when the underlying event definitions and properties are disciplined enough to deserve trust. A metric that cannot be audited is not a metric &mdash; it is a consensus illusion.</>}
          question="What is the most dangerous consequence of loose instrumentation in a scaling product org?"
          options={[
            { text: 'Charts and dashboards will look cluttered and be hard to read', correct: false, feedback: 'Aesthetic clarity is a symptom, not the root risk. Loose instrumentation creates diverging truths that undermine strategic decisions, not just visual confusion.' },
            { text: 'The team starts making strategic decisions on competing versions of truth without realizing it', correct: true, feedback: 'Correct. When event definitions drift, teams genuinely believe they are using the same metric while reasoning from different underlying realities. Strategic alignment becomes impossible to achieve.' },
            { text: 'Engineering will refuse to build features that require new event tracking', correct: false, feedback: 'Engineering rarely refuses instrumentation work — it is typically low-complexity. The strategic risk is entirely on the product side: bad data producing bad decisions.' },
          ]}
          conceptId="tech101-apm-data"
        />

        <ApplyItBox prompt="Pick your product's most important metric. Can you describe exactly what event or events it counts, what properties are captured, and what scenarios are excluded? If any part of that is uncertain, you have an instrumentation trust problem." />

        <QuizEngine
          conceptId="tech101-apm-data"
          conceptName="Instrumentation and Metric Trust"
          moduleContext="PM Module 09 APM Track. Learner understands how instrumentation quality shapes strategic trust."
          staticQuiz={{
            conceptId: 'tech101-apm-data',
            question: "Two teams report different retention numbers for the same cohort. What is the PM's most important first question?",
            options: [
              'Which team\'s analyst is more reliable and experienced?',
              'Do both teams use the same definition of retention, the same event, and the same property set?',
              'Which number is higher, and should we report the more favorable one?',
              'When should we schedule an analytics review to align the numbers?',
            ],
            correctIndex: 1,
            explanation: "Diverging numbers almost always trace back to definition differences — event names that match but capture different things. The PM question is definitional, not statistical. Aligning the definition is the fix; the number alignment follows.",
          }}
        />

      </ChapterSection>

      {/* ── PART 4 · API CONTRACTS AS ORGANIZATIONAL CONTRACTS ── */}
      <ChapterSection id="m9t2-contracts" num="04" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Enterprise Admin Workspace reporting now has several consumers: web, mobile, exports, analytics, and future partner access. Priya understands that a field rename or auth change is not just a technical modification. It is a coordination event across multiple teams. What used to feel like one service boundary now looks like an organizational boundary.
        </SituationCard>

        <ConversationScene mentor="asha" name="Asha" role="AI PM Mentor" accent="#0097A7" lines={[
          { speaker: 'priya', text: 'I thought contract quality mostly affected the implementation team.' },
          { speaker: 'other', text: 'At this stage, contract quality affects every downstream consumer and the teams behind them. A field rename is a coordination event across five teams now — not just a refactor.' },
          { speaker: 'priya', text: 'So a weak API slows coordination as much as it slows coding?' },
          { speaker: 'other', text: 'Yes. Technical contracts become organizational contracts once multiple teams plan around them. That is the senior PM insight.' },
        ]} />

        {h2(<>A technical contract is also an organizational coordination surface</>)}

        {para(<>Once multiple teams depend on a contract, changes to that contract are not technical decisions &mdash; they are coordination decisions. Renaming a field, tightening auth, removing a response property: each of these breaks planning assumptions held by teams the implementing team may not even talk to regularly. Senior PMs who notice dependency multiplication early can sequence work to protect downstream teams and maintain trust.</>)}

        <DependencyConstellation />

        {keyBox('What senior PMs notice about API contracts', [
          'Dependency multiplication — how many consumers are planning around this contract?',
          'Contract stability signals — how likely is this contract to change in the next two quarters?',
          'Breaking change cost — which downstream teams would be affected by a field change?',
          'Versioning strategy — is there a plan for evolving the contract without breaking consumers?',
        ])}

        <PMPrinciple text="A technical contract becomes an organizational contract once multiple teams plan around it." />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Contract changes are not just refactors. Once teams depend on an API, a contract change is a coordination event. Senior PMs track dependency growth and protect downstream teams from unexpected breaking changes during planning.</>}
          question="Why should senior PMs care about API contract stability?"
          options={[
            { text: 'To ensure the API can support high traffic volumes at launch', correct: false, feedback: 'Traffic capacity is a scalability concern, not a contract stability concern. Contract stability is about protecting downstream teams from unexpected changes to the interface they depend on.' },
            { text: 'Because weak contracts create downstream dependency risk, coordination drag, and hidden roadmap coupling', correct: true, feedback: 'Correct. Once multiple teams depend on a contract, any change becomes a cross-team coordination event. Weak, unstable contracts make roadmap parallelism harder and slow down dependent teams.' },
            { text: 'To reduce the documentation burden on the engineering team that owns the API', correct: false, feedback: 'Documentation is a benefit of contract clarity, not the primary reason it matters strategically. The strategic reason is protecting downstream teams from unexpected breaking changes.' },
          ]}
          conceptId="tech101-apm-contracts"
        />

        <ApplyItBox prompt="Map the most-used API in your product. How many teams or surfaces depend on it? Is there a versioning strategy? What would happen if a field were renamed or removed? Your answer reveals your current dependency coupling risk." />

        <QuizEngine
          conceptId="tech101-apm-contracts"
          conceptName="API Contracts and Organizational Dependency"
          moduleContext="PM Module 09 APM Track. Learner understands how API contracts become organizational coordination surfaces."
          staticQuiz={{
            conceptId: 'tech101-apm-contracts',
            question: "An engineer proposes removing an unused field from a widely used API response. What should a senior PM check first?",
            options: [
              'Whether the field adds unnecessary payload size and response latency',
              'Who consumes this API and whether any downstream team depends on that field being present',
              'Whether the field was ever documented in the public API reference',
              'Whether the field is currently tested in QA regression suites',
            ],
            correctIndex: 1,
            explanation: "Before any breaking contract change, the PM must map downstream consumers. 'Unused' often means unused by the team that built it — not unused by the teams consuming it. Consumer mapping prevents unexpected downstream breaks.",
          }}
        />

      </ChapterSection>

      {/* ── PART 5 · RELIABILITY AS ENTERPRISE VALUE ── */}
      <ChapterSection id="m9t2-reliability" num="05" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Enterprise admins are not reacting to reporting delays the way self-serve users do. They are not merely annoyed. They are losing trust in whether the product can support operational workflows at all. Priya realizes that reliability and latency are no longer implementation concerns hiding under a working feature. They are now part of what the product is promising to serious customers.
        </SituationCard>

        <ConversationScene mentor="rohan" name="Rohan" role="CEO" accent="#E67E22" lines={[
          { speaker: 'priya', text: 'So the product can still be valuable even if the system occasionally struggles under load?' },
          { speaker: 'other', text: 'Not if the customer experiences the struggle as unreliability in a workflow they depend on. These are enterprise admins. When their tools are uncertain, they lose trust in our ability to deliver.' },
          { speaker: 'priya', text: 'So reliability feels closer to positioning than to infrastructure for this segment.' },
          { speaker: 'other', text: 'In enterprise contexts, that is exactly what it is.' },
        ]} />

        {h2(<>Reliability is part of the value proposition in enterprise products</>)}

        {para(<>Consumer products tolerate occasional slowness if the core experience is compelling enough. Enterprise products operate differently. When an admin&apos;s workflow depends on a tool, that tool&apos;s reliability becomes part of the purchasing decision and the renewal conversation. Repeated latency, uncertain exports, and system errors are not just UX problems &mdash; they are trust erosion events that accumulate until renewal confidence drops.</>)}

        <div style={{ margin: '28px 0', borderRadius: '12px', overflow: 'hidden', background: 'var(--ed-card)', border: `1.5px solid ${ACCENT}25` }}>
          <div style={{ padding: '10px 18px', background: `${ACCENT}10`, borderBottom: `1px solid ${ACCENT}20`, fontSize: '9px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>Trust Erosion Timeline</div>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'First slowdown', icon: '⏳', desc: 'Admin notices delay. Waits. Succeeds.', color: '#CA8A04' },
              { label: 'Repeated slowdowns', icon: '⚠', desc: 'Admin mentions it to team. Starts logging issues.', color: '#E67E22' },
              { label: 'Workarounds appear', icon: '🔧', desc: 'Admin builds a spreadsheet workaround instead of using the product.', color: '#EF4444' },
              { label: 'Renewal conversation', icon: '💬', desc: 'CS flags reliability as a risk. Admin lists it as a concern in the renewal call.', color: '#EF4444' },
              { label: 'Confidence drops', icon: '📉', desc: 'Renewal probability decreases. Churn risk registers.', color: '#DC2626' },
            ].map((stage, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 14px', borderRadius: '8px', background: `${stage.color}0A`, border: `1px solid ${stage.color}25` }}>
                <div style={{ fontSize: '18px', flexShrink: 0 }}>{stage.icon}</div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: stage.color, marginBottom: '2px' }}>{stage.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>{stage.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '10px 18px', borderTop: `1px solid ${ACCENT}15`, fontSize: '11px', color: 'var(--ed-ink3)', fontStyle: 'italic' }}>
            Reliability erosion in enterprise is gradual until it is suddenly decisive.
          </div>
        </div>

        <PMPrinciple text="In enterprise contexts, reliability is often part of the value proposition — not just a quality bar to clear." />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Enterprise users do not separate product value from operational reliability once the workflow becomes important enough. A PM who treats reliability as infrastructure polish is misunderstanding the B2B trust model.</>}
          question="When does reliability become a product issue rather than a backend issue?"
          options={[
            { text: 'When the engineering team flags it in an incident review', correct: false, feedback: 'Timing is based on impact to the customer, not the internal process in which it is raised. Reliability becomes a product issue when it changes user trust, adoption depth, or renewal confidence.' },
            { text: 'When unreliable behavior changes user trust, adoption depth, or renewal confidence', correct: true, feedback: 'Correct. Reliability becomes a product concern when it changes the customer\'s relationship with the product — trust, depth of adoption, and willingness to renew.' },
            { text: 'Only when the SLA is breached and a formal incident is declared', correct: false, feedback: 'SLA breaches are formal thresholds, not the real indicator. Enterprise trust erodes well before an SLA is breached — through repeated slowdowns that do not meet the formal incident bar.' },
          ]}
          conceptId="tech101-apm-reliability"
        />

        <ApplyItBox prompt="For your most business-critical feature: if the response time doubled at peak load, what would happen to enterprise admin behavior? Would they wait? Build workarounds? Escalate? Your answer describes your reliability risk profile." />

        <QuizEngine
          conceptId="tech101-apm-reliability"
          conceptName="Reliability as Enterprise Value"
          moduleContext="PM Module 09 APM Track. Learner understands how reliability shapes B2B trust and renewal risk."
          staticQuiz={{
            conceptId: 'tech101-apm-reliability',
            question: "An enterprise admin reports that a dashboard 'feels unreliable' despite technically working. What is the most useful PM frame for this?",
            options: [
              'A UX problem — redesign the dashboard to look more stable even at variable speeds',
              'An engineering problem — optimize the backend query until the perception changes',
              'A trust architecture problem — the product is not communicating its system state well enough for the user to feel informed and safe',
              'A support problem — assign a CSM to monitor the account more closely',
            ],
            correctIndex: 2,
            explanation: "'Feels unreliable' is usually a trust communication gap. The product is not giving the user enough signal about what is happening and when it will finish. That is a product design issue — combining performance work with intentional UX for uncertain states.",
          }}
        />

      </ChapterSection>

      {/* ── PART 6 · BUILD VS BUY ── */}
      <ChapterSection id="m9t2-buildvsbuy" num="06" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          The team debates whether to build reporting and access controls fully in-house or use vendor tooling. Priya is tempted by speed. Dev worries about future control. Leadership wants leverage without accidental lock-in. The conversation becomes useful only when Priya stops treating build-vs-buy as a procurement shortcut and starts treating it as a decision about where product advantage should live.
        </SituationCard>

        <ConversationScene mentor="asha" name="Asha" role="AI PM Mentor" accent="#0097A7" lines={[
          { speaker: 'priya', text: 'If a vendor gets us there faster, shouldn\'t we default to that?' },
          { speaker: 'other', text: 'Only if the thing we are outsourcing is not where product differentiation or future control will matter.' },
          { speaker: 'priya', text: 'So speed is one dimension, but not the decisive one by itself.' },
          { speaker: 'other', text: 'Build vs buy is a bet on what should remain yours. That is a product strategy decision, not a procurement one.' },
        ]} />

        {h2(<>Build vs buy is a bet on where product advantage should live</>)}

        {para(<>Vendor tooling accelerates initial delivery but transfers control. For capabilities that are utility &mdash; where the market has many equally good solutions and differentiation does not live &mdash; vendors win on economics. For capabilities where the product&apos;s competitive advantage depends on control, customization, or future extensibility, vendor abstraction eventually blocks the roadmap. The question is not &ldquo;what is faster now?&rdquo; but &ldquo;what should we own in 18 months?&rdquo;</>)}

        {keyBox('Build vs buy evaluation frame', [
          'Utility vs differentiation — is this capability where we compete, or just something we need?',
          'Lock-in risk — what happens if the vendor raises prices, changes the API, or gets acquired?',
          'Control points — which future product decisions require ownership of this capability?',
          'Extensibility — can we customize this vendor solution when customer needs diverge from the vendor\'s roadmap?',
        ])}

        <PMPrinciple text="Build vs buy is a bet on what should remain yours." />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>The right build-vs-buy decision depends on whether the capability is utility, leverage, or future differentiation. Utilities should be bought. Differentiators should be owned. The risk is misclassifying a differentiator as a utility because the vendor is faster today.</>}
          question="What is the strongest reason not to outsource a capability even if a vendor is faster?"
          options={[
            { text: 'Vendor dependencies always create security vulnerabilities in enterprise products', correct: false, feedback: 'Security is a specific risk to evaluate, not a universal argument against vendors. The strategic reason is about competitive advantage and future control.' },
            { text: 'Because the capability may become core to product differentiation, control, or future roadmap flexibility', correct: true, feedback: 'Correct. If the capability is where competitive advantage lives or where future roadmap options must remain open, vendor abstraction will eventually block decisions that require ownership.' },
            { text: 'Because building internally is always cheaper at scale than paying vendor licensing fees', correct: false, feedback: 'Build vs buy economics vary significantly by capability and scale. Vendor solutions often remain cheaper even at scale when the utility category is not where the product competes.' },
          ]}
          conceptId="tech101-apm-buildvsbuy"
        />

        <ApplyItBox prompt="For a capability you are currently considering or have recently bought from a vendor: where does the vendor's roadmap diverge from your product's future needs? What decisions would you lose the ability to make? That is your lock-in risk profile." />

        <QuizEngine
          conceptId="tech101-apm-buildvsbuy"
          conceptName="Build vs Buy as Product Strategy"
          moduleContext="PM Module 09 APM Track. Learner understands build vs buy as a product advantage decision."
          staticQuiz={{
            conceptId: 'tech101-apm-buildvsbuy',
            question: "A vendor offers a reporting solution that covers 80% of the PM's requirements faster and cheaper. What is the right PM question before deciding?",
            options: [
              'Can the vendor cover the remaining 20% in their next product release?',
              'Does the 20% gap overlap with where product differentiation or future control will matter?',
              'Can engineering build equivalent functionality faster than the vendor\'s integration timeline?',
              'Is the vendor\'s pricing model compatible with the company\'s current revenue per customer?',
            ],
            correctIndex: 1,
            explanation: "The 20% gap is the strategic question, not the 80% coverage. If the gap is in utility features, buying is right. If the gap is where competitive advantage, customer customization, or future extensibility matters — the vendor relationship will eventually constrain the roadmap.",
          }}
        />

      </ChapterSection>

      {/* ── PART 7 · SENIOR PM CREDIBILITY ── */}
      <ChapterSection id="m9t2-planning" num="07" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya needs to commit upward on timing while preserving engineering trust downward. The old temptation is to convert uncertainty into confidence theater. The stronger move is to make uncertainty legible early enough that the organization can make better sequencing decisions without pretending the unknowns do not exist.
        </SituationCard>

        <ConversationScene mentor="asha" name="Asha" role="AI PM Mentor" accent="#0097A7" lines={[
          { speaker: 'priya', text: 'If I present ranges instead of certainty, won\'t leadership hear weakness?' },
          { speaker: 'other', text: 'Only if the ranges are vague. Structured uncertainty sounds stronger than fake precision. "We are confident in Q2 because scope is clean, but Q3 depends on this schema decision" is a senior PM communication.' },
          { speaker: 'priya', text: 'So the goal is not to eliminate uncertainty. It is to classify it so the org can act on it.' },
          { speaker: 'other', text: 'Exactly. Clean uncertainty is much easier to plan around than hidden uncertainty.' },
        ]} />

        {h2(<>Senior PMs earn trust by making uncertainty actionable, not by hiding it</>)}

        {para(<>Confidence theater &mdash; delivering certain-sounding timelines to avoid hard conversations &mdash; consistently destroys PM credibility faster than transparent uncertainty. When the schedule slips, the failure is visible to everyone. When a PM clearly articulates what is known, what is contingent, and what requires a decision, leadership can sequence around the actual risk rather than being surprised by it.</>)}

        <div style={{ margin: '28px 0', borderRadius: '12px', overflow: 'hidden', background: 'var(--ed-card)', border: `1.5px solid ${ACCENT}25` }}>
          <div style={{ padding: '10px 18px', background: `${ACCENT}10`, borderBottom: `1px solid ${ACCENT}20`, fontSize: '9px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>Confidence Band Roadmap</div>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Now — Q1', type: 'Committed', desc: 'Scope is clean. Permissions specified. Schema confirmed. Estimate trustworthy.', width: '100%', color: ACCENT },
              { label: 'Q2', type: 'Planned', desc: 'Depends on Q1 learnings + schema migration timeline. Confident but contingent.', width: '80%', color: '#3B82F6' },
              { label: 'Q3', type: 'Range', desc: 'Architecture decision in Q1 affects this significantly. Two paths possible.', width: '55%', color: '#CA8A04' },
              { label: 'Q4+', type: 'Contingent', desc: 'Requires platform decision that is not yet made. Cannot commit.', width: '30%', color: '#E67E22' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '60px', flexShrink: 0 }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: row.color }}>{row.label}</div>
                  <div style={{ fontSize: '8px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>{row.type}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: '12px', background: 'var(--ed-rule)', borderRadius: '3px', overflow: 'hidden', marginBottom: '4px' }}>
                    <div style={{ width: row.width, height: '100%', background: row.color, borderRadius: '3px' }} />
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{row.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '10px 18px', borderTop: `1px solid ${ACCENT}15`, fontSize: '11px', color: 'var(--ed-ink3)', fontStyle: 'italic' }}>
            Structured uncertainty lets leadership make real decisions. Fake precision forces them to make decisions based on fiction.
          </div>
        </div>

        {keyBox('How senior PMs communicate technical uncertainty', [
          'Classify uncertainty by type: scope unknowns, architecture decisions, dependency timelines, external factors',
          'Near-term commitments are solid because ambiguity has been resolved — say so explicitly',
          'Medium-term items are planned with contingencies — name the contingencies',
          'Long-term items are estimates with stated assumptions — make the assumptions visible',
        ])}

        <PMPrinciple text="Senior PMs earn trust not by sounding certain too early, but by making the shape of uncertainty actionable." />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>My job in technical planning is not to remove uncertainty theatrically. It is to expose the right uncertainty early enough that the team can make better decisions. Structured uncertainty is a senior PM skill &mdash; not a weakness.</>}
          question="What makes technical planning communication sound senior rather than defensive?"
          options={[
            { text: 'Providing a single, confident delivery date with no caveats to signal decisiveness', correct: false, feedback: 'Single confident dates without caveats signal fragility — they will be revised when scope becomes concrete. Senior communication shows structure: what is committed, what is contingent, and why.' },
            { text: 'Exposing the right uncertainty clearly enough that teams can make better decisions around it', correct: true, feedback: 'Correct. Senior planning communication classifies uncertainty: near-term commitments are solid, medium-term is planned with named contingencies, long-term carries explicit assumptions. This is actionable, not defensive.' },
            { text: 'Demonstrating deep technical knowledge by explaining the architecture in detail', correct: false, feedback: 'Depth of technical vocabulary is not what makes planning communication sound senior. Structured uncertainty — classifying what is known, contingent, or unknown — is what earns trust.' },
          ]}
          conceptId="tech101-apm-planning"
        />

        <ApplyItBox prompt="For your next planning communication upward: separate the timeline into committed, planned with contingencies, and contingent on open decisions. Name the contingency for each uncertain item. That structure is what transforms a guess into a trustworthy plan." />

        <QuizEngine
          conceptId="tech101-apm-planning"
          conceptName="Senior PM Planning Credibility"
          moduleContext="PM Module 09 APM Track. Learner understands how to communicate structured uncertainty to build planning trust."
          staticQuiz={{
            conceptId: 'tech101-apm-planning',
            question: "Leadership asks a PM for a firm Q3 delivery date on a feature with several unresolved dependencies. What is the senior PM response?",
            options: [
              'Provide Q3 as committed — under-promise to give engineering buffer',
              'Decline to give any date until all dependencies are resolved',
              'Provide a confidence band: committed items in Q3, contingent items that require a decision by a specific date to maintain that timeline',
              'Ask engineering to provide the date directly so the PM is not accountable for accuracy',
            ],
            correctIndex: 2,
            explanation: "The senior PM provides a confidence band: what is solid and why, what is contingent and on what decision, and by when that decision needs to be made. This gives leadership real information to act on rather than false certainty or unhelpful deflection.",
          }}
        />

        <NextChapterTeaser text="Next: LLMs, RAGs, and AI Foundations &mdash; how the AI models powering modern products actually work, and what PMs need to understand to make good bets on them." />

      </ChapterSection>

    </article>
  );
}

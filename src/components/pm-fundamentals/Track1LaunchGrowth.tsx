'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  h2, para, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser, ApplyItBox, ConversationScene,
} from './designSystem';
import { MentorFace } from './MentorFaces';
import QuizEngine from '../QuizEngine';
import {
  MVPScopeBuilder,
  LaunchReadinessSimulator,
  AhaMomentJourneyLab,
  GrowthLoopPlayground,
  PricingModelExplorer,
  GTMPathVisualizer,
} from './LaunchGrowthTools';
import {
  LaunchPipelineAnimation,
  AhaMomentFlowAnimation,
  GrowthFlywheelAnimation,
  MonetizationLadderAnimation,
  GTMMotionAnimation,
} from './LaunchGrowthAnimations';

const ACCENT     = '#0D7A5A';
const ACCENT_RGB = '13,122,90';
const MODULE_NUM = '08';
const MODULE_LABEL = 'Launch, Growth & Go-to-Market';

const PARTS = [
  { num: '01', id: 'm8-launch',   label: 'Launching Is Not Just Publishing' },
  { num: '02', id: 'm8-mvp',     label: 'The MVP Fight' },
  { num: '03', id: 'm8-rollout', label: 'Launch Plan → Rollout Strategy' },
  { num: '04', id: 'm8-aha',     label: 'The Aha Moment Problem' },
  { num: '05', id: 'm8-growth',  label: 'Growth Thinking in Systems' },
  { num: '06', id: 'm8-pricing', label: 'Monetization as Product Design' },
  { num: '07', id: 'm8-gtm',     label: 'B2B GTM Motion' },
];

const PMPrinciple = ({ text }: { text: string }) => (
  <div style={{ margin: '28px 0', padding: '20px 24px', background: `rgba(${ACCENT_RGB},0.06)`, borderLeft: `4px solid ${ACCENT}`, borderRadius: '0 8px 8px 0' }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', color: ACCENT, marginBottom: '8px', textTransform: 'uppercase' as const }}>PM Principle</div>
    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ed-ink)', lineHeight: 1.65, fontStyle: 'italic', fontFamily: "'Lora', serif" }}>&ldquo;{text}&rdquo;</div>
  </div>
);

export default function Track1LaunchGrowth({
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
              PM Fundamentals &middot; Module {MODULE_NUM}
            </div>
            <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.03em', color: 'var(--ed-ink)', marginBottom: '16px', fontFamily: "'Lora',Georgia,serif" }}>
              {MODULE_LABEL}
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora',Georgia,serif", marginBottom: '40px' }}>
              &ldquo;Shipping code is not the same thing as launching a product well.&rdquo;
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '40px' }}>
              {([
                { mentor: 'priya' as const, accent: ACCENT,    name: 'Priya',  role: 'PM · EdSpark',       desc: 'Comfortable building. Now learning that launch, distribution, and GTM require completely different thinking.' },
                { mentor: 'asha'  as const, accent: '#0097A7', name: 'Asha',   role: 'PM Mentor',          desc: 'Launch is not an event. It is a sequence of decisions.' },
                { mentor: 'rohan' as const, accent: '#E67E22', name: 'Rohit',  role: 'Growth Lead',        desc: 'Pushes for momentum, broader distribution, faster learning.' },
                { mentor: 'kiran' as const, accent: '#3A86FF', name: 'Kiran',  role: 'Data Partner',       desc: 'Helps define what launch success and activation actually mean.' },
                { mentor: 'maya'  as const, accent: '#C85A40', name: 'Sonal',  role: 'Customer Success',   desc: 'Brings account risk, onboarding pain, and enterprise readiness into the room.' },
              ]).map(c => (
                <div key={c.mentor} style={{ background: `${c.accent}0D`, border: `1px solid ${c.accent}33`, borderRadius: '10px', padding: '14px 16px', minWidth: '140px', flex: '1' }}>
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
              <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '12px', textTransform: 'uppercase' as const }}>Learning Objectives</div>
              {[
                'Distinguish between shipping and launching — and know how to scope a launch for the right level of risk and learning',
                'Build a rollout strategy, not just a release date — and get users to their aha moment before scale',
                'Understand growth loops, monetization tradeoffs, and B2B GTM motion as one connected PM responsibility',
              ].map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 2 ? '10px' : 0, alignItems: 'flex-start' }}>
                  <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '12px', marginTop: '2px' }}>0{i + 1}</span>
                  <span style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dark module card */}
          <div style={{ flexShrink: 0, width: '168px', paddingTop: '48px' }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <div className="float3d" style={{ transformStyle: 'preserve-3d' }}>
                <div style={{ background: 'linear-gradient(145deg, #0A1A12 0%, #0D2418 100%)', borderRadius: '14px', padding: '20px 18px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE {MODULE_NUM}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora',serif", lineHeight: 1.25, marginBottom: '4px' }}>Launch &amp; Growth</div>
                  <div style={{ fontSize: '10px', color: 'rgba(240,232,216,0.45)', marginBottom: '16px' }}>Foundations Track</div>
                  <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '14px' }}>
                    <motion.div animate={{ width: `${donePct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ height: '100%', background: ACCENT, borderRadius: '1px' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
                    {PARTS.map(p => {
                      const done = completedSections.has(p.id);
                      const isNext = p.id === nextPart?.id;
                      return (
                        <div key={p.num} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, background: done ? ACCENT : isNext ? ACCENT : 'rgba(255,255,255,0.06)', border: `1px solid ${done ? ACCENT : isNext ? ACCENT : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: done || isNext ? '#fff' : 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, opacity: done ? 0.7 : 1 }}>
                            {done ? '✓' : p.num}
                          </div>
                          <div style={{ fontSize: '9px', color: done ? 'rgba(240,232,216,0.4)' : isNext ? 'rgba(240,232,216,0.9)' : 'rgba(240,232,216,0.25)', lineHeight: 1.3, flex: 1 }}>
                            {p.label.split(' ').slice(0, 4).join(' ')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: '16px', padding: '8px 10px', borderRadius: '6px', background: `${ACCENT}22`, border: `1px solid ${ACCENT}44` }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', color: ACCENT, fontWeight: 700, marginBottom: '2px' }}>{donePct === 100 ? 'COMPLETE' : 'NEXT UP'}</div>
                    <div style={{ fontSize: '9px', color: 'rgba(240,232,216,0.6)' }}>{donePct === 100 ? 'All 7 parts done' : nextPart ? nextPart.label.split(' ').slice(0,4).join(' ') : 'Launching Is Not Just Publishing'}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── PART 1 ── */}
      <ChapterSection id="m8-launch" num="01" accentRgb={ACCENT_RGB} first>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Team Workspace is finally close. The prototype is stable. The workflow works. And now everyone is asking the same question: <strong>&ldquo;When do we launch?&rdquo;</strong> Rohit: <strong>&ldquo;Let&apos;s get this in front of as many users as possible.&rdquo;</strong> Dev: <strong>&ldquo;That&apos;s not a launch plan. That&apos;s exposure.&rdquo;</strong> Sonal: <strong>&ldquo;If this goes wide too early and enterprise admins hit confusion, support absorbs the damage.&rdquo;</strong> Meera asks the sharpest question: <strong>&ldquo;What exactly are we trying to achieve with this launch?&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="asha" name="Asha" role="PM Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "I've been treating launch like a date. Get it ready, push it out." },
            { speaker: 'other', text: "Shipping means the product exists. Launching means the product is being introduced into the world in a deliberate way. Those are completely different things." },
            { speaker: 'priya', text: "So what does a deliberate launch actually involve?" },
            { speaker: 'other', text: "Who gets access first, what they can do, what support exists, what the team is trying to learn, what success looks like in week one, and what happens if things go wrong. All of that is the launch." },
          ]}
        />

        {h2(<>Stop asking &ldquo;Are we ready to release?&rdquo; — start asking &ldquo;What kind of launch are we ready for?&rdquo;</>)}

        {para(<>A product launch is not only publish the build, send the email, update the changelog. It is also: who gets access first, what should they be able to do, what support exists if they get stuck, what the team is hoping to learn, what success looks like in the first week, and what should happen if things go wrong.</>)}

        {keyBox('What "launch" actually includes', [
          'Audience — who gets access first and why',
          'Readiness — what the product can and cannot do reliably',
          'Risk — blast radius if something breaks',
          'Message — what story accompanies the release',
          'Success criteria — what does the team need to learn',
          'Rollout shape — how does access expand over time',
        ])}

        <PMPrinciple text="Shipping code is not the same thing as launching a product well." />

        <ApplyItBox prompt="Think of a feature you use often. Was it launched to everyone at once, to a subset first, as a beta, or through a phased rollout? Why might the launch shape have mattered for the product's success?" />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>The teams that treat launch as a single event tend to get two failure modes: they launch too early and burn trust, or they launch too late and lose momentum. The discipline is not choosing between fast and careful — it is knowing what kind of launch the product is actually ready for.</>}
          question="What is the biggest mistake in treating launch as a single event?"
          options={[
            { text: 'It makes the calendar too crowded', correct: false, feedback: 'Calendar management is not the primary risk of treating launch as a single event.' },
            { text: 'It ignores readiness, audience, risk, and learning goals', correct: true, feedback: 'Exactly. Launch is a set of decisions — not a moment. Collapsing it into a date means skipping all of them.' },
            { text: 'It slows down engineering', correct: false, feedback: 'Engineering speed is not the primary issue with treating launch as a single event.' },
          ]}
          conceptId="launch-growth-basics"
        />

        <QuizEngine
          conceptId="launch-growth-basics"
          conceptName="Launch Strategy"
          moduleContext="Module 08 of Airtribe PM Fundamentals. Covers launch strategy, MVP scoping, phased rollout, aha moments, growth loops, monetization, and B2B GTM motion. Follows Priya Sharma launching Team Workspace at EdSpark."
          staticQuiz={{
            conceptId: "launch-growth-basics",
            question: "What is the biggest mistake in treating launch as a single event?",
            options: ['It makes the calendar too crowded', 'It ignores readiness, audience, risk, and learning goals', 'It makes marketing campaigns harder to plan', 'It slows down engineering timelines'],
            correctIndex: 1,
            explanation: "Launch is a set of decisions — audience, readiness, risk, message, success criteria, rollout shape. Treating it as a date means skipping all of them.",
          }}
        />
      </ChapterSection>

      {/* ── PART 2 ── */}
      <ChapterSection id="m8-mvp" num="02" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya meets Dev and Maya to finalize launch scope. The original Team Workspace included 8 features. The debate gets messy. Maya: <strong>&ldquo;If teammates don&apos;t know when they&apos;ve been tagged, collaboration will feel broken.&rdquo;</strong> Dev: <strong>&ldquo;If we do permissions halfway, rollout risk goes up fast.&rdquo;</strong> Rohit: <strong>&ldquo;If we&apos;re going to launch, let&apos;s make sure it&apos;s big enough to matter.&rdquo;</strong> That sentence almost derails the room.
        </SituationCard>

        <ConversationScene
          mentor="asha" name="Asha" role="PM Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "Everyone thinks their feature is essential to the MVP." },
            { speaker: 'other', text: "That's because they're confusing 'what makes it feel complete' with 'what we need to test the core hypothesis.'" },
            { speaker: 'priya', text: "What's the core hypothesis for Team Workspace?" },
            { speaker: 'other', text: "If Team Workspace works, what is the one user behavior you most need to validate? Answer that — and scope follows from it." },
          ]}
        />

        {h2(<>MVP is a discipline about learning, not a shortcut about shipping</>)}

        {para(<>An MVP is not the smallest thing a team can build. It is the smallest version that can deliver meaningful value, test the core hypothesis, teach the team something real, and avoid pretending to be the final product. Teams often overscope because they are unconsciously trying to launch something that feels complete. But an MVP is not about feeling complete — it is about being complete <em>enough to learn honestly</em>.</>)}

        <MVPScopeBuilder />

        <PMPrinciple text="An MVP is not the smallest product. It is the smallest product that can test meaningful value honestly." />

        <ApplyItBox prompt="Think of one product you know. What is the smallest version of it that would still let users experience the core value — not all the value, just the reason the product exists?" />

        <QuizEngine
          conceptId="mvp-scoping"
          conceptName="MVP Scoping"
          moduleContext="Module 08 of Airtribe PM Fundamentals. MVP is the smallest version that can test meaningful value and teach the team something real."
          staticQuiz={{
            conceptId: "mvp-scoping",
            question: "What is the strongest definition of an MVP?",
            options: ['The fastest thing a team can ship this sprint', 'The smallest version that can still validate core value and teach the team something real', 'A rough version with missing logic and no design polish', 'A launch that feels exciting enough to announce externally'],
            correctIndex: 1,
            explanation: "MVP is a learning discipline, not a speed shortcut. The 'minimum' refers to scope — and the right scope is whatever is needed to test the core hypothesis honestly.",
          }}
        />
      </ChapterSection>

      {/* ── PART 3 ── */}
      <ChapterSection id="m8-rollout" num="03" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          MVP is clearer. Now: <strong>&ldquo;How do we release it?&rdquo;</strong> Rohit: <strong>&ldquo;If we launch narrowly, we learn slowly.&rdquo;</strong> Sonal: <strong>&ldquo;If we launch too broadly, we create support chaos and burn trust.&rdquo;</strong> Dev: <strong>&ldquo;Wide release means wider blast radius if something subtle breaks.&rdquo;</strong> Priya feels stuck — until Meera reframes it: <strong>&ldquo;Why are we acting like the only two choices are soft launch or full launch?&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="kiran" name="Meera" role="Business Lead · EdSpark" accent="#7843EE"
          lines={[
            { speaker: 'priya', text: "So what's the right rollout shape for Team Workspace?" },
            { speaker: 'other', text: "Start with internal team use. Then trusted design partners. Then a pilot customer set. Then a limited segment. Then broader. Each stage teaches something before the next one expands." },
            { speaker: 'priya', text: "That sounds like it would slow us down." },
            { speaker: 'other', text: "It lets you move faster without pretending certainty is higher than it is. Phased release is not hesitation. It is controlled learning." },
          ]}
        />

        {h2(<>Rollout strategy is part of product strategy</>)}

        {keyBox('What phased launch gives you that full launch doesn\'t', [
          'Catch edge cases before they reach your whole user base',
          'Observe actual behavior before making changes at scale',
          'Reduce blast radius if something unexpected breaks',
          'Improve onboarding before the volumes that make mistakes expensive',
          'Gather proof of value before big GTM and marketing motions',
          'Build confidence without committing certainty you don\'t have yet',
        ])}

        <LaunchPipelineAnimation />
        <LaunchReadinessSimulator />

        <PMPrinciple text="Phased release is not lack of confidence. It is disciplined exposure." />

        <ApplyItBox prompt="Think of one feature that should not go to all users at once. What signal would you need from each phase before expanding to the next? What would cause you to pause or roll back?" />

        <QuizEngine
          conceptId="launch-rollout"
          conceptName="Phased Rollout Strategy"
          moduleContext="Module 08 of Airtribe PM Fundamentals. Phased release as controlled learning, not hesitation."
          staticQuiz={{
            conceptId: "launch-rollout",
            question: "Why do mature teams often use phased launches instead of broad launch from day one?",
            options: ['Because they are bad at planning and need more time', 'Because phased launches reduce risk while improving the quality of early learning', 'Because marketing prefers smaller initial campaigns', 'Because broad launches are considered outdated practice'],
            correctIndex: 1,
            explanation: "Phased release lets teams catch edge cases early, observe real behavior, and build proof of value — all before the scale that makes mistakes expensive.",
          }}
        />
      </ChapterSection>

      {/* ── PART 4 ── */}
      <ChapterSection id="m8-aha" num="04" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          First pilot usage reviewed. The product is getting opened. The feature is being explored. But repeat usage is weak. Rohit: <strong>&ldquo;We got people in. Why aren&apos;t they sticking?&rdquo;</strong> Maya answers immediately: <strong>&ldquo;Because reaching the feature is not the same thing as reaching the value.&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="maya" name="Maya" role="Design Lead · EdSpark" accent="#C85A40"
          lines={[
            { speaker: 'priya', text: "What is the aha moment for Team Workspace?" },
            { speaker: 'other', text: "A manager shares notes on a call, a teammate sees the context clearly, and the collaboration actually improves the review workflow. That's the aha — not 'opened the feature.'" },
            { speaker: 'priya', text: "So users are aware of the feature but not reaching the value." },
            { speaker: 'other', text: "That's the gap. The question shifts from 'how do we get users in?' to 'how do we get the right users to the first meaningful value moment quickly?'" },
          ]}
        />

        {h2(<>The aha moment is the point where the product begins to feel worth returning to</>)}

        {para(<>A product can be discoverable and still not be compelling. A product can be well built and still take too long to prove its value. That is why distribution and activation belong in the same conversation. Getting users into the product is not enough — you need to get them to the moment where the product clicks.</>)}

        <AhaMomentFlowAnimation />
        <AhaMomentJourneyLab />

        <PMPrinciple text="Getting users in is not the same as getting users to value." />

        <ApplyItBox prompt="Think of one product feature. What is the exact moment where a new user would say 'okay, now I get why this is useful'? How many steps does it currently take to reach that moment — and what could you remove?" />

        <QuizEngine
          conceptId="activation-aha"
          conceptName="Aha Moment and Activation"
          moduleContext="Module 08 of Airtribe PM Fundamentals. The aha moment is when users reach first meaningful product value."
          staticQuiz={{
            conceptId: "activation-aha",
            question: "What is the strongest definition of an aha moment?",
            options: ['The first screen a user sees after signing up', 'The moment a user reaches meaningful product value for the first time', 'The moment they complete the signup flow', 'The moment the product sends a re-engagement email'],
            correctIndex: 1,
            explanation: "The aha moment is not an interface event — it is a value event. It is the specific moment where the product becomes worth returning to in the user's mind.",
          }}
        />
      </ChapterSection>

      {/* ── PART 5 ── */}
      <ChapterSection id="m8-growth" num="05" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Once the pilot stabilizes, Rohit pushes hard: <strong>&ldquo;We can&apos;t think about this like a one-time announcement. We need to think about how this grows.&rdquo;</strong> Priya expects an acquisition discussion. Instead, Rohit draws a loop. Maya adds: <strong>&ldquo;If the product only grows when marketing keeps pushing from the outside, that&apos;s not a strong growth system.&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="asha" name="Asha" role="PM Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "What's the difference between a funnel and a growth loop?" },
            { speaker: 'other', text: "A funnel is a path users move through. A growth loop is a system where usage creates more usage. Funnels describe progression. Loops describe compounding." },
            { speaker: 'priya', text: "So for Team Workspace the loop would be: manager uses it, invites teammates, teammates collaborate, usage deepens, more people join?" },
            { speaker: 'other', text: "Exactly. Now growth no longer looks like 'more people at the top.' It looks like a product system that creates its own momentum." },
          ]}
        />

        {h2(<>Does this product grow only through external push — or does usage create more usage?</>)}

        {para(<>Not every product has true network effects. And PLG is not always the right answer. But every PM should be able to ask: if we stop pushing from the outside, does this product continue to grow? If the answer is no, that is not a failure — but it is a strategic fact that shapes how you resource growth and plan GTM.</>)}

        <GrowthFlywheelAnimation />
        <GrowthLoopPlayground />

        <PMPrinciple text="Strong growth systems do not just bring users in. They create conditions for usage to generate more usage." />

        <ApplyItBox prompt="Think of one product you know well. Does usage naturally create more usage, invites, content, or collaboration? If yes — where exactly is the loop? If no — what would need to be true for one to exist?" />

        <QuizEngine
          conceptId="growth-loops"
          conceptName="Growth Loops vs Funnels"
          moduleContext="Module 08 of Airtribe PM Fundamentals. Growth loops vs linear funnels, compounding growth systems."
          staticQuiz={{
            conceptId: "growth-loops",
            question: "What is the key difference between a funnel and a growth loop?",
            options: ['Funnels are better for B2B and loops are better for B2C', 'Funnels require more marketing budget than loops', 'Funnels describe progression through stages; loops describe systems where usage generates more usage', 'Loops do not require users to take any action'],
            correctIndex: 2,
            explanation: "A funnel is a linear path. A loop is a compounding system. The difference matters because loops reduce dependence on external push — growth comes from within the product itself.",
          }}
        />
      </ChapterSection>

      {/* ── PART 6 ── */}
      <ChapterSection id="m8-pricing" num="06" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Team Workspace is showing value in pilot accounts. Meera raises the next question: <strong>&ldquo;How will we monetize this?&rdquo;</strong> Priya expected pricing to come later — or to belong to business, not product. But the discussion quickly makes it obvious: monetization is deeply tied to product behavior.
        </SituationCard>

        <ConversationScene
          mentor="kiran" name="Meera" role="Business Lead · EdSpark" accent="#7843EE"
          lines={[
            { speaker: 'priya', text: "Can't we figure out pricing after we've validated the product?" },
            { speaker: 'other', text: "Pricing shapes what users try, what they delay, when they feel enough value to pay, and how they perceive what's premium. It's already shaping product behavior before the first invoice." },
            { speaker: 'priya', text: "So the wrong paywall could actually block users from reaching the aha moment." },
            { speaker: 'other', text: "Exactly. Maya's been saying that for an hour. Monetization is product design with a price tag attached." },
          ]}
        />

        {h2(<>Pricing shapes access, perception, upgrade behavior, and user incentives</>)}

        {para(<>A freemium model can widen adoption but may delay revenue. Usage-based pricing can align with value but make costs feel uncertain. Enterprise pricing can deepen account value but slow initial access. A trial can accelerate discovery but create urgency before habit forms. None of these are purely finance decisions — they are product decisions with behavioral consequences.</>)}

        <MonetizationLadderAnimation />
        <PricingModelExplorer />

        <PMPrinciple text="Monetization is not just a business decision. It is a product design decision with behavioral consequences." />

        <ApplyItBox prompt="Think of one product you pay for. How does its pricing model shape: when you tried it, when you upgraded, what value you expected, and how often you use it? Now reverse it — if the model were different, would your behavior have been different?" />

        <QuizEngine
          conceptId="pricing-monetization"
          conceptName="Pricing as Product Design"
          moduleContext="Module 08 of Airtribe PM Fundamentals. Pricing models and their behavioral impact on adoption, activation, and value capture."
          staticQuiz={{
            conceptId: "pricing-monetization",
            question: "Why is monetization a product decision, not just a finance decision?",
            options: ['Because finance teams should not be involved in pricing', 'Because pricing shapes user behavior, access timing, upgrade incentives, and perceived value', 'Because product teams prefer to control revenue decisions', 'Because all modern products should use freemium models'],
            correctIndex: 1,
            explanation: "Pricing determines who tries the product, when they hit limits, what feels premium, and when they convert. Each of those is a product behavior question — not just a revenue question.",
          }}
        />
      </ChapterSection>

      {/* ── PART 7 ── */}
      <ChapterSection id="m8-gtm" num="07" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          With launch, activation, growth, and pricing getting clearer, the final question appears: <strong>&ldquo;What GTM motion fits this product?&rdquo;</strong> Rohit wants self-serve. Sonal: <strong>&ldquo;Larger accounts will need help onboarding this well.&rdquo;</strong> Meera: <strong>&ldquo;If this creates team-level value, should we think product-led, sales-led, or hybrid?&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="asha" name="Asha" role="PM Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "How do I decide between PLG, sales-led, and hybrid?" },
            { speaker: 'other', text: "Self-serve vs enterprise is not a branding choice. It is a motion choice. And the motion should match the product reality: complexity, time-to-value, price point, onboarding effort, and how many people are involved in the buying decision." },
            { speaker: 'priya', text: "So if Team Workspace takes a while to set up and needs admin involvement, that points away from pure PLG." },
            { speaker: 'other', text: "Right. And once you pick a motion, it shapes your entire downstream path — pilot structure, proof-of-value stages, how expansion happens. GTM is part of product strategy, not separate from it." },
          ]}
        />

        {h2(<>The right GTM motion fits the product&apos;s complexity, value, and adoption path</>)}

        {para(<>If the product is easy to understand, low-friction, and can prove value quickly — product-led motion can work well. If the product is higher-value, more complex, needs setup help, or requires stakeholder buying — sales-led motion may make more sense. Many products live in between, and the hybrid path is often the most honest answer.</>)}

        <GTMMotionAnimation />
        <GTMPathVisualizer />

        <PMPrinciple text="The right GTM motion is not the one that sounds modern. It is the one that fits the product's complexity, value, and adoption path." />

        <ApplyItBox prompt="Think of one B2B product. Where does it sit on: product complexity, time-to-value, price point, onboarding effort, and number of stakeholders? Based on those five variables — which GTM motion would you recommend and why?" />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>The most common GTM mistake is choosing a motion because it sounds modern — &ldquo;we&apos;re PLG&rdquo; — without checking whether the product reality supports it. PLG fails when time-to-value is long, price is high, or multiple stakeholders are involved. Sales-led fails when the product is simple enough to self-serve and sales adds friction instead of value.</>}
          question="What is the strongest reason to choose a sales-led or hybrid motion over pure PLG?"
          options={[
            { text: 'PLG is an outdated strategy for most companies', correct: false, feedback: 'PLG is effective for the right products — the issue is matching the motion to the product, not ideology.' },
            { text: 'The product has higher complexity, longer onboarding, more stakeholders, or higher-value buying decisions', correct: true, feedback: 'Exactly. When the product requires explanation, setup help, or multi-person buying, PLG stalls. Sales-led or hybrid matches the reality.' },
            { text: 'The marketing team prefers a sales-led approach', correct: false, feedback: 'Marketing preference is not the right driver for GTM motion selection.' },
          ]}
          conceptId="b2b-gtm"
        />

        <QuizEngine
          conceptId="b2b-gtm"
          conceptName="B2B GTM Motion"
          moduleContext="Module 08 of Airtribe PM Fundamentals. PLG vs sales-led vs hybrid GTM motion selection based on product variables."
          staticQuiz={{
            conceptId: "b2b-gtm",
            question: "What is the strongest reason to choose a sales-led or hybrid motion over pure PLG?",
            options: ['PLG is outdated as a growth strategy', 'The product has higher complexity, longer onboarding, more stakeholders, or higher-value buying decisions', 'The marketing team has limited budget for self-serve content', 'Enterprise users generally dislike self-serve products'],
            correctIndex: 1,
            explanation: "GTM motion follows product reality. When onboarding requires help, buying involves multiple stakeholders, or price justifies sales investment — PLG alone will stall.",
          }}
        />

        <NextChapterTeaser text="Next up: Tech 101 for PMs — how APIs, databases, and system design work, and how to collaborate confidently with engineering without needing to code." />
      </ChapterSection>

    </article>
  );
}

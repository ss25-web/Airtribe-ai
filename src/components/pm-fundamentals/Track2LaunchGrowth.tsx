'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  glassCard, demoLabel, h2, para, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser, ApplyItBox,
  ConversationScene, PMPrincipleBox,
} from './designSystem';
import { MentorFace } from './MentorFaces';
import QuizEngine from '../QuizEngine';
import {
  MVPScopeBuilder,
  AhaMomentJourneyLab,
  GrowthLoopPlayground,
  PricingModelExplorer,
  GTMPathVisualizer,
  ReleaseControlTower,
  EnterpriseExpansionEngine,
} from './LaunchGrowthTools';
import {
  AhaMomentFlowAnimation,
  GrowthFlywheelAnimation,
  MonetizationLadderAnimation,
  GTMMotionAnimation,
  PhasedRolloutControlAnimation,
  LandAndExpandAnimation,
} from './LaunchGrowthAnimations';

const ACCENT     = '#0D7A5A';
const ACCENT_RGB = '13,122,90';
const MODULE_NUM = '08';
const MODULE_CONTEXT = `Module 08 of Airtribe PM Fundamentals — Scale Track. Follows Priya Sharma, established PM at EdSpark (B2B SaaS), leading Team Workspace rollout into a serious enterprise market. Covers launch motion design, MVP as learning architecture, rollout governance, distribution-activation linkage, growth systems, monetization as motion design, and GTM fit.`;

const PARTS = [
  { num: '01', id: 'm8-launch',   label: 'Launch as Motion, Not Date' },
  { num: '02', id: 'm8-mvp',     label: 'MVP as Learning Architecture' },
  { num: '03', id: 'm8-rollout', label: 'Rollout as Governance' },
  { num: '04', id: 'm8-aha',     label: 'Distribution & Activation Linked' },
  { num: '05', id: 'm8-growth',  label: 'Beyond Funnels: Growth Systems' },
  { num: '06', id: 'm8-pricing', label: 'Monetization as Motion Design' },
  { num: '07', id: 'm8-gtm',     label: 'GTM Fit, Not GTM Fashion' },
];

export default function Track2LaunchGrowth({
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
              PM Fundamentals &middot; Module {MODULE_NUM} &middot; Scale Track
            </div>
            <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.03em', color: 'var(--ed-ink)', marginBottom: '16px', fontFamily: "'Lora',Georgia,serif" }}>
              Launch, Growth &amp; Go-to-Market
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ed-ink2)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '560px' }}>
              You already know how to ship. This module is about the harder questions: what launch motion fits the product&apos;s maturity, how growth systems compound without external push, and when GTM motion is a product-fit decision rather than a trend choice.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '40px' }}>
              {([
                { mentor: 'priya' as const, accent: ACCENT,    name: 'Priya',  role: 'PM · EdSpark',       desc: 'Now dealing with launch and GTM questions that are business decisions with product consequences.' },
                { mentor: 'asha'  as const, accent: '#0097A7', name: 'Asha',   role: 'PM Mentor',          desc: 'Pushes Priya to see launch and growth as systems, not moments.' },
                { mentor: 'rohan' as const, accent: '#E67E22', name: 'Rohit',  role: 'Growth Lead',        desc: 'Pushes for speed, leverage, and scalable distribution.' },
                { mentor: 'maya'  as const, accent: '#C85A40', name: 'Sonal',  role: 'Customer Success',   desc: 'Brings account-level truth: onboarding, adoption depth, renewal risk.' },
                { mentor: 'kiran' as const, accent: '#3A86FF', name: 'Meera',  role: 'Business Leader',    desc: 'Looks at launch, monetization, and GTM through business outcomes and strategic fit.' },
              ]).map(c => (
                <div key={c.mentor + c.name} style={{ background: `${c.accent}0D`, border: `1px solid ${c.accent}33`, borderRadius: '10px', padding: '14px 16px', minWidth: '140px', flex: '1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <MentorFace mentor={c.mentor} size={40} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: c.accent }}>{c.name}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.04em' }}>{c.role}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{c.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '20px 24px', borderLeft: `4px solid ${ACCENT}`, border: '1px solid var(--ed-rule)', borderLeftWidth: '4px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '12px', textTransform: 'uppercase' as const }}>What you&apos;ll be able to do</div>
              {[
                'Choose the right launch motion for the product\'s maturity — not just a release date',
                'Design rollout as a governance system, not just a cautious sequencing habit',
                'Distinguish growth systems from funnels, and align monetization and GTM to how the product actually creates value',
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
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE {MODULE_NUM} · SCALE</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora',serif", lineHeight: 1.25, marginBottom: '4px' }}>Launch &amp; Growth</div>
                  <div style={{ fontSize: '10px', color: 'rgba(240,232,216,0.45)', marginBottom: '16px' }}>Scale Track</div>
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
                    <div style={{ fontSize: '9px', color: 'rgba(240,232,216,0.6)' }}>{donePct === 100 ? 'All 7 parts done' : nextPart ? nextPart.label.split(' ').slice(0,4).join(' ') : 'Launch as Motion'}</div>
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
          The room is fuller than usual. CS is here. Sales sent input. Leadership wants context. Team Workspace is no longer being treated like just another feature — it has strategic weight. Rohit: <strong>&ldquo;We have enough signal. Get this into market properly.&rdquo;</strong> Dev: <strong>&ldquo;What do you mean by properly?&rdquo;</strong> Meera resets the room: <strong>&ldquo;What kind of launch are we actually trying to run?&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="asha" name="Asha" role="PM Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "I thought the launch question was whether the product is ready." },
            { speaker: 'other', text: "Experienced teams don't ask whether the product is ready. They ask what launch motion the product is ready for." },
            { speaker: 'priya', text: "What's the difference?" },
            { speaker: 'other', text: "A launch motion says something about what the team knows, what they still need to learn, how much risk they can absorb, and what kind of market signal they want next. It's a strategic choice, not a binary." },
          ]}
        />

        {h2(<>Launch motions are not just execution details</>)}

        <div style={glassCard(ACCENT, ACCENT_RGB)}>
          {demoLabel('The spectrum of launch motions', ACCENT)}
          {keyBox('Each motion says something different', [
            'Internal beta — hypothesis unvalidated; team learning in safety',
            'Closed design-partner rollout — strong signal needed from specific users',
            'Pilot accounts — value needs to be real before broader risk',
            'Segmented release — controlled expansion with defined blast radius',
            'Enterprise-led introduction — sales motion precedes broad product exposure',
            'Self-serve rollout — product complexity and onboarding support high-confidence',
          ])}
        </div>

        {pullQuote("Launch is not a date decision. It is a motion decision. The right motion answers: what does the team know, what do they still need to learn, and how much risk can they absorb right now?")}

        <PMPrincipleBox principle="An experienced PM doesn't ask 'are we ready to launch?' They ask 'what launch motion matches our current level of readiness, our learning goals, and our risk appetite?'" />

        <ApplyItBox prompt="Think of one serious product launch you know. What motion did it use — and what did that motion say about the team's confidence, the market maturity, and what they were trying to learn?" />

        <QuizEngine
          conceptId="launch-growth-basics"
          conceptName="Launch Motion Strategy"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "launch-growth-basics",
            question: "What is the strongest sign that a launch discussion has matured beyond simple release planning?",
            options: ['More teams are present in the launch meeting', 'The conversation includes audience sequencing, readiness level, risk, and learning goals', 'Marketing has been involved from the start', 'Engineering has asked for more time'],
            correctIndex: 1,
            explanation: "A mature launch discussion is a motion design discussion — not a release date conversation. When the team debates audience sequencing, risk appetite, and what they're trying to learn, that's the right level.",
          }}
        />
      </ChapterSection>

      {/* ── PART 2 ── */}
      <ChapterSection id="m8-mvp" num="02" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          The MVP discussion is harder than expected. Rohit wants enough surface area for the launch to matter. Sonal wants enough onboarding for enterprise not to fail. Dev wants technical integrity. Meera wants value that justifies GTM effort. Everyone agrees they can&apos;t launch everything. Nobody agrees on what &ldquo;enough&rdquo; means. Asha stops Priya before she falls into the familiar trap of treating MVP as a feature-trimming exercise.
        </SituationCard>

        <ConversationScene
          mentor="asha" name="Asha" role="PM Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "I'm trying to find the right scope by cutting features." },
            { speaker: 'other', text: "That's the wrong frame. You're not trimming — you're architecting for learning quality." },
            { speaker: 'priya', text: "What's the difference?" },
            { speaker: 'other', text: "Trimming asks: what can we remove? Learning architecture asks: what is essential for honest value, honest learning, and safe operational exposure? Those questions produce very different scopes." },
          ]}
        />

        {h2(<>MVP as strategic learning architecture</>)}

        <div style={glassCard(ACCENT, ACCENT_RGB)}>
          {demoLabel('How experienced PMs group scope', ACCENT)}
          {keyBox('Four categories, not one list', [
            'Core value components — without these, the product can\'t test its core hypothesis',
            'Adoption-enabling components — without these, users can\'t reach value (onboarding, setup, permissions)',
            'Operational safety components — without these, the rollout creates unacceptable risk',
            '"Completeness" extras — makes the product feel done; does not enable learning',
          ])}
        </div>

        <MVPScopeBuilder />

        {pullQuote("A mature MVP is not just smaller. It is intentionally shaped to produce honest value and high-quality learning — without pretending readiness it doesn't yet have.")}

        <PMPrincipleBox principle="The deeper MVP failure mode is not under-scoping — it's launching something that looks more complete than it is, producing confidence without evidence." />

        <ApplyItBox prompt="Think of one serious launch. What was included because it was truly necessary — and what was likely included just to make the launch feel more complete? What would honest learning have required?" />

        <QuizEngine
          conceptId="mvp-scoping"
          conceptName="MVP as Learning Architecture"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "mvp-scoping",
            question: "What is the strongest reason an experienced PM might reject a 'smaller' MVP?",
            options: ['It has fewer features than leadership wants to see', 'It may be too incomplete to produce honest learning about real user value', 'Leadership generally prefers bigger launches', 'Engineering dislikes releasing incomplete products'],
            correctIndex: 1,
            explanation: "The goal of an MVP is not just shipping faster — it is learning honestly. If the scope is too thin, users can't reach real value, and the learning is false negative. That is worse than a slower, better-scoped release.",
          }}
        />
      </ChapterSection>

      {/* ── PART 3 ── */}
      <ChapterSection id="m8-rollout" num="03" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          The rollout discussion becomes simultaneously more technical and more strategic. Dev: <strong>&ldquo;If we&apos;re serious about enterprise, we need a stronger phased control plan.&rdquo;</strong> Rohit: <strong>&ldquo;If every launch is slow-motion, we lose speed.&rdquo;</strong> Sonal: <strong>&ldquo;If rollout is sloppy, CS becomes your control system by accident.&rdquo;</strong> Meera sharpens it: <strong>&ldquo;If this creates unexpected friction, how quickly can we detect it, contain it, and decide whether to expand or pause?&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="asha" name="Asha" role="PM Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "I've been thinking of phased rollout as cautious sequencing. Meera's question made it sound like something more serious." },
            { speaker: 'other', text: "At a beginner level, phased rollout feels like caution. At a more advanced level it becomes a release governance system — with control logic, rollback triggers, and defined decision criteria at each stage." },
            { speaker: 'priya', text: "So the question isn't just 'who gets access first.'" },
            { speaker: 'other', text: "The question is: if something goes wrong, how fast do you know, how fast do you contain it, and how fast do you decide what to do next?" },
          ]}
        />

        {h2(<>Rollout as a control problem, not just a sequencing preference</>)}

        <div style={glassCard(ACCENT, ACCENT_RGB)}>
          {demoLabel('What mature rollout governance actually controls', ACCENT)}
          {keyBox('The full control system', [
            'Audience gates — who gets access, in what order, based on what criteria',
            'Feature flags — ability to disable without redeployment',
            'Instrumentation — are we actually measuring what matters?',
            'Rollback logic — what triggers a pause or rollback, who decides',
            'Support readiness — is CS ready to absorb the incoming load?',
            'Expansion criteria — what does "safe to widen" actually require?',
          ])}
        </div>

        <PhasedRolloutControlAnimation />
        <ReleaseControlTower />

        {pullQuote("A mature rollout is not just phased exposure. It is controlled exposure with governance — including defined criteria for advancing, pausing, and rolling back.")}

        <PMPrincipleBox principle="The maturity test is not whether the team can launch. It is whether the team can control the consequences of launching — and respond intelligently when reality differs from the plan." />

        <ApplyItBox prompt="Think of one launch where rollout control would matter more than speed. Write the three things you would need to know before deciding to expand from pilot to segmented release." />

        <QuizEngine
          conceptId="launch-rollout"
          conceptName="Release Governance"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "launch-rollout",
            question: "What makes advanced release management different from a simple phased launch?",
            options: ['It includes more meetings and sign-offs', 'It adds control logic, rollout governance, and defined rollback decision-making', 'It always takes longer than a standard release', 'It avoids exposing the product to beta users'],
            correctIndex: 1,
            explanation: "Simple phased launches sequence exposure. Advanced release governance defines control logic — what triggers expansion, what triggers pause, who decides, and how fast the team can contain unexpected consequences.",
          }}
        />
      </ChapterSection>

      {/* ── PART 4 ── */}
      <ChapterSection id="m8-aha" num="04" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          A month into rollout. Rohit: <strong>&ldquo;We need more exposure. Top of funnel is too narrow.&rdquo;</strong> Maya disagrees: <strong>&ldquo;We don&apos;t have an exposure problem. We have a value-realization problem.&rdquo;</strong> Sonal: <strong>&ldquo;Some teams are getting in but the admin never gets the rest of the group to stable usage.&rdquo;</strong> Priya realizes: distribution is inseparable from activation.
        </SituationCard>

        <ConversationScene
          mentor="maya" name="Maya" role="Design Lead · EdSpark" accent="#C85A40"
          lines={[
            { speaker: 'priya', text: "If we grow distribution, won't activation problems fix themselves with more users?" },
            { speaker: 'other', text: "No. If users arrive and don't reach value quickly enough, more users just means more users who didn't reach value." },
            { speaker: 'priya', text: "So the aha moment for Team Workspace isn't just 'user opens feature.'" },
            { speaker: 'other', text: "The aha is account-shaped. The right user sets it up. Collaboration begins. The workflow improves. Another person participates. Value becomes visible and repeatable. That takes a very different distribution strategy than just top-of-funnel volume." },
          ]}
        />

        {h2(<>Distribution strategy is activation strategy</>)}

        <div style={glassCard(ACCENT, ACCENT_RGB)}>
          {demoLabel('The distribution-activation linkage for B2B', ACCENT)}
          {para(<>In many B2B products, awareness grows faster than clarity. A user can arrive, open the product, and leave without experiencing any value — because distribution delivered volume without activation design. The question shifts from &ldquo;how do we get more users in?&rdquo; to &ldquo;how do we design the path from first exposure to repeatable realized value?&rdquo;</>)}
        </div>

        <AhaMomentFlowAnimation />
        <AhaMomentJourneyLab />

        {pullQuote("Distribution is not just about getting users in. It is about getting the right users to repeatable value — and in B2B, that often means the right user brings a team, not just themselves.")}

        <PMPrincipleBox principle="When you see a distribution problem, check whether it is actually an activation problem in disguise. More users into a broken value path creates more evidence of the same failure." />

        <ApplyItBox prompt="Think of one product with multi-user value. What has to happen after first exposure for the product to become genuinely sticky — not just individually, but at the team or account level?" />

        <QuizEngine
          conceptId="activation-aha"
          conceptName="Distribution and Activation Linkage"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "activation-aha",
            question: "What is the strongest reason a distribution problem may actually be an activation problem?",
            options: ['Marketing is consistently underperforming', 'Users may be entering the product without reaching meaningful value quickly enough', 'Distribution always comes before activation in the funnel', 'Activation only matters for consumer products'],
            correctIndex: 1,
            explanation: "More traffic into a broken activation path creates more of the same failure. The right question is not how to get more users in — it is how to get the right users to repeatable value before expanding distribution.",
          }}
        />
      </ChapterSection>

      {/* ── PART 5 ── */}
      <ChapterSection id="m8-growth" num="05" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          &ldquo;Growth planning&rdquo; meeting. Priya expects channel ideas. Rohit draws systems instead: usage loops, invite flows, shared artifacts, collaboration propagation, retention-based compounding. <strong>&ldquo;Funnels still matter,&rdquo;</strong> he says. <strong>&ldquo;But funnels alone don&apos;t explain compounding.&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="asha" name="Asha" role="PM Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "Does Team Workspace have a real growth loop or are we going to rely on external push?" },
            { speaker: 'other', text: "Ask yourself: does collaboration inside the product naturally create more team adoption? Does one team's success make expansion to another team easier? Does usage create context that makes the product more valuable?" },
            { speaker: 'priya', text: "If the answers are yes, that's a loop?" },
            { speaker: 'other', text: "That's the beginning of one. The difference is whether growth requires a fresh push each time or whether the product itself creates conditions for compounding." },
          ]}
        />

        {h2(<>When growth becomes a system rather than a campaign</>)}

        <div style={glassCard(ACCENT, ACCENT_RGB)}>
          {demoLabel('How loop thinking changes growth strategy', ACCENT)}
          {keyBox('From campaign to system', [
            'Campaign thinking: spend X, get Y users, repeat',
            'Loop thinking: value creates behavior, behavior creates more users or deeper adoption, which creates more value',
            'The strategic question: what in the product creates self-reinforcing growth once value is reached?',
            'The honest audit: if external push stopped today, what would happen to growth in week 4?',
          ])}
        </div>

        <GrowthFlywheelAnimation />
        <GrowthLoopPlayground />

        {pullQuote("Funnels describe movement. Growth systems describe compounding. The PM question is not just how to fill the funnel — it is what in the product creates its own momentum after value is reached.")}

        <PMPrincipleBox principle="A product that only grows when marketing keeps pushing is not product-led growth. It is marketing-led persistence. The distinction matters when resources are constrained and when the market gets competitive." />

        <ApplyItBox prompt="Think of one product you know well. What part of the experience, if any, creates more adoption, more usage, or more expansion without needing a fresh external push? If nothing, what would need to be true for a loop to exist?" />

        <QuizEngine
          conceptId="growth-loops"
          conceptName="Growth Systems vs Funnels"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "growth-loops",
            question: "What is the strongest sign that a product has a real growth system rather than only a funnel?",
            options: ['More users are signing up each month', 'Product usage itself creates more usage, adoption, or expansion without fresh external push', 'Marketing spend is high and consistent', 'The homepage conversion rate is above benchmark'],
            correctIndex: 1,
            explanation: "A real growth system is self-reinforcing — value creates behavior that creates more users or deeper adoption, which creates more value. Funnels require constant refilling. Loops compound.",
          }}
        />
      </ChapterSection>

      {/* ── PART 6 ── */}
      <ChapterSection id="m8-pricing" num="06" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Monetization comes back to the table — and Priya expects a pricing conversation. What she gets is closer to a motion design conversation. Meera wants monetization that captures value without slowing early adoption. Rohit wants enough openness for the product to spread. Maya warns: <strong>&ldquo;If we monetize before users feel the value, we&apos;ll kill trust. If we delay too long, we train users to think the value should be free.&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="kiran" name="Meera" role="Business Leader · EdSpark" accent="#7843EE"
          lines={[
            { speaker: 'priya', text: "Is this a product decision or a business decision?" },
            { speaker: 'other', text: "It's both at the same time. Pricing determines who gets in, when they hit a limit, when they upgrade, whether adoption stalls, and whether the motion favors self-serve or requires sales. Those are product consequences." },
            { speaker: 'priya', text: "So we can't separate pricing from GTM motion." },
            { speaker: 'other', text: "They're the same decision. Choose the pricing model and you've chosen a significant part of the GTM motion that follows." },
          ]}
        />

        {h2(<>Pricing as motion design: shaping adoption, expansion, and conversion</>)}

        <MonetizationLadderAnimation />
        <PricingModelExplorer />

        {pullQuote("Pricing is not just value capture. It is motion design for adoption, expansion, and business fit — and the wrong model can create beautiful top-line numbers while quietly destroying product health.")}

        <PMPrincipleBox principle="Experienced PMs treat pricing as a product-and-GTM decision, not a business-team decision. The model you choose shapes what users try, when they upgrade, whether adoption stalls, and how the commercial motion develops." />

        <ApplyItBox prompt="Think of one SaaS product. What behavior is its pricing model trying to create — faster trial, wider adoption, deeper usage, team expansion, or enterprise commitment? Does the model succeed at creating that behavior?" />

        <QuizEngine
          conceptId="pricing-monetization"
          conceptName="Monetization as Motion Design"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "pricing-monetization",
            question: "Why is monetization a GTM motion decision as much as a pricing decision?",
            options: ['Because finance teams should not own pricing alone', 'Because pricing shapes how users adopt, upgrade, expand, and enter the commercial relationship', 'Because all B2B products eventually need enterprise pricing', 'Because product teams control billing systems'],
            correctIndex: 1,
            explanation: "Pricing determines the behavior it creates: who gets in, when they hit friction, when they convert, whether adoption stalls before value. Those are GTM motion outcomes — not just revenue optimization choices.",
          }}
        />
      </ChapterSection>

      {/* ── PART 7 ── */}
      <ChapterSection id="m8-gtm" num="07" accentRgb={ACCENT_RGB}>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          The question everyone has been circling finally lands: <strong>&ldquo;What GTM motion actually fits Team Workspace?&rdquo;</strong> Rohit argues for product-led. Sonal: <strong>&ldquo;For smaller teams maybe. Larger accounts need structured onboarding, stakeholder buy-in, and proof of value.&rdquo;</strong> Meera: <strong>&ldquo;This is not about what motion sounds modern. It is about what motion fits the product.&rdquo;</strong>
        </SituationCard>

        <ConversationScene
          mentor="maya" name="Sonal" role="Customer Success · EdSpark" accent="#C85A40"
          lines={[
            { speaker: 'other', text: "Let me map what success actually looks like for an enterprise account: champion identified, setup completed, workflow adopted, value observed, stakeholders aligned, paid conversion, usage broadened." },
            { speaker: 'priya', text: "That's not just sales — that's a product journey." },
            { speaker: 'other', text: "Exactly. And if the product doesn't support that journey — if onboarding is weak, proof is invisible, or adoption can't spread — no GTM motion will compensate for it." },
            { speaker: 'priya', text: "So the GTM decision starts with: does the product support the adoption journey the motion requires?" },
            { speaker: 'other', text: "Now you're asking the right question." },
          ]}
        />

        {h2(<>GTM fit is a product question disguised as a business question</>)}

        <div style={glassCard(ACCENT, ACCENT_RGB)}>
          {demoLabel('The variables that determine GTM fit', ACCENT)}
          {keyBox('What motion should match', [
            'Product complexity — does it require explanation, setup, or integration to create value?',
            'Time-to-value — can a user experience meaningful value in minutes, days, or months?',
            'Buyer involvement — is it one person\'s decision or does it require a committee?',
            'Onboarding effort — does success require human support or can it be self-serve?',
            'Expansion potential — does value deepen with more users or more usage?',
          ])}
        </div>

        <GTMMotionAnimation />
        <GTMPathVisualizer />

        <LandAndExpandAnimation />
        <EnterpriseExpansionEngine />

        {pullQuote("The right GTM motion is not the one that sounds most modern. It is the one that fits how the product is adopted, valued, and expanded — and supports the account journey that creates durable commercial relationships.")}

        <PMPrincipleBox principle="GTM motion is a product-fit decision. Choose the motion, and you've implicitly committed to a product design: onboarding depth, proof-of-value design, collaboration structure, and expansion enablement." />

        <ApplyItBox prompt="For Team Workspace: write the product capabilities that would need to exist for a pure PLG motion to work. Then write what's currently missing. That gap is the decision." />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>The most common GTM mistake at senior level is choosing a motion because it sounds strategically sophisticated — &ldquo;we&apos;re going enterprise&rdquo; or &ldquo;we&apos;re going PLG&rdquo; — without checking whether the product actually supports the adoption journey that motion requires. The motion is the consequence of the product reality, not a branding decision.</>}
          question="What is the strongest reason a product may need hybrid or sales-led GTM instead of pure PLG?"
          options={[
            { text: 'PLG is mostly a marketing idea and hard to execute', correct: false, feedback: 'PLG works well for the right products. The issue is not PLG vs sales-led ideology — it is fit.' },
            { text: 'The product may require structured onboarding, more stakeholders, proof of value, or a higher-friction buying motion', correct: true, feedback: 'Exactly. When the product\'s adoption journey requires human support, stakeholder alignment, or structured proof — PLG alone will stall. The motion must match the journey.' },
            { text: 'Enterprise customers generally dislike product-led experiences', correct: false, feedback: 'Enterprise customers adopt PLG products all the time when the value is clear and onboarding is straightforward. It depends on the product, not the segment label.' },
          ]}
          conceptId="b2b-gtm"
        />

        <QuizEngine
          conceptId="b2b-gtm"
          conceptName="GTM Motion Fit"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "b2b-gtm",
            question: "What is the strongest reason a product may need hybrid or sales-led GTM instead of pure PLG?",
            options: ['PLG is mainly a marketing concept and hard to execute', 'The product may require structured onboarding, more stakeholders, stronger proof, or a higher-friction buying decision', 'Enterprise users generally dislike self-serve products', 'Sales teams prefer complex buying processes'],
            correctIndex: 1,
            explanation: "GTM motion follows product adoption reality. When value requires setup, multiple stakeholders, or a structured proof-of-value period — PLG alone will stall. The motion must support the journey the product actually requires.",
          }}
        />

        <NextChapterTeaser text="Next up: Tech 101 for PMs — APIs, databases, and system design. How to collaborate confidently with engineering without needing to code." />
      </ChapterSection>

    </article>
  );
}

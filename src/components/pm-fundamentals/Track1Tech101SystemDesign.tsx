'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  h2, para, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser, ApplyItBox, ConversationScene, CharacterChip,
} from './designSystem';
import { MentorFace } from './MentorFaces';
import QuizEngine from '../QuizEngine';
import {
  FeatureToSystemMapper,
  LoadingStateDesignBoard,
  QueryPathWalkthrough,
  EndpointContractViewer,
  AccessDecisionSimulator,
  SyncAsyncExperienceBoard,
  ScopeToEstimateDecomposer,
} from './Tech101Tools3D';
import {
  LayeredStackVisual,
  LatencyPressureVisual,
  SchemaRelationshipBoard,
  RequestResponseFlow,
  PermissionMatrixBloom,
  ScaleStressAnimation,
  EstimateBreakdownCascade,
} from './Tech101Animations';

const ACCENT     = '#7843EE';
const ACCENT_RGB = '120,67,238';
const MODULE_NUM = '09';
const MODULE_LABEL = 'Tech 101 & System Design';

const PARTS = [
  { num: '01', id: 'm9-stack',       label: 'What the User Sees vs What the System Does' },
  { num: '02', id: 'm9-latency',     label: 'When Technical Performance Becomes UX' },
  { num: '03', id: 'm9-schema',      label: 'Data Shape Decides What the Product Can Know' },
  { num: '04', id: 'm9-api',         label: 'APIs Are Product Contracts' },
  { num: '05', id: 'm9-permissions', label: 'Enterprise Complexity Is Often Permission Complexity' },
  { num: '06', id: 'm9-scale',       label: 'At Scale, System Behavior Changes Product Behavior' },
  { num: '07', id: 'm9-estimation',  label: 'Why Estimates Expand When Scope Becomes Real' },
];

const PMPrinciple = ({ text }: { text: string }) => (
  <div style={{ margin: '28px 0', padding: '20px 24px', background: `rgba(${ACCENT_RGB},0.06)`, borderLeft: `4px solid ${ACCENT}`, borderRadius: '0 8px 8px 0' }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', color: ACCENT, marginBottom: '8px', textTransform: 'uppercase' as const }}>PM Principle</div>
    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ed-ink)', lineHeight: 1.65, fontStyle: 'italic', fontFamily: "'Lora', serif" }}>&ldquo;{text}&rdquo;</div>
  </div>
);

export default function Track1Tech101SystemDesign({
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
              &ldquo;The product is not just screens and flows. It is a set of systems making those screens and flows possible.&rdquo;
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '40px' }}>
              {([
                { mentor: 'priya' as const, accent: ACCENT,    name: 'Priya', role: 'APM · EdSpark' },
                { mentor: 'asha'  as const, accent: '#0097A7', name: 'Asha',  role: 'AI PM Mentor' },
                { mentor: 'dev'   as const, accent: '#3A86FF', name: 'Dev',   role: 'Engineer · EdSpark' },
                { mentor: 'kiran' as const, accent: '#E67E22', name: 'Kiran', role: 'Data Analyst' },
                { mentor: 'maya'  as const, accent: '#C85A40', name: 'Maya',  role: 'Designer' },
              ]).map(c => (
                <CharacterChip key={c.mentor} name={c.name} role={c.role} accent={c.accent}>
                  <MentorFace mentor={c.mentor} size={52} />
                </CharacterChip>
              ))}
            </div>

            <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '20px 24px', borderLeft: `4px solid ${ACCENT}`, border: '1px solid var(--ed-rule)', borderLeftWidth: '4px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '12px', textTransform: 'uppercase' as const }}>Learning Objectives</div>
              {[
                'Explain what the system must do for a feature to exist — across frontend, backend, API, and data layers',
                'Recognize where latency, permissions, data shape, and scale create consequences that change product design',
                'Participate in sprint estimation and technical tradeoff discussions without pretending to be an engineer',
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
                <div style={{ background: 'linear-gradient(145deg, #0D0820 0%, #150D2A 100%)', borderRadius: '14px', padding: '20px 18px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE {MODULE_NUM}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora',serif", lineHeight: 1.25, marginBottom: '4px' }}>Tech 101</div>
                  <div style={{ fontSize: '10px', color: 'rgba(240,232,216,0.45)', marginBottom: '16px' }}>Foundations Track</div>
                  <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '14px' }}>
                    <motion.div animate={{ width: `${donePct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ height: '100%', background: ACCENT, borderRadius: '1px' }} />
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
                  <div style={{ marginTop: '16px', padding: '8px 10px', borderRadius: '6px', background: `${ACCENT}22`, border: `1px solid ${ACCENT}44` }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', color: ACCENT, fontWeight: 700, marginBottom: '2px' }}>{donePct === 100 ? 'COMPLETE' : 'NEXT UP'}</div>
                    <div style={{ fontSize: '9px', color: 'rgba(240,232,216,0.6)' }}>{donePct === 100 ? 'All 7 parts done' : nextPart ? nextPart.label.split(' ')[0] : PARTS[0].label.split(' ')[0]}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── PART 1 · WHAT THE USER SEES VS WHAT THE SYSTEM DOES ── */}
      <ChapterSection id="m9-stack" num="01" accentRgb={ACCENT_RGB} first>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya describes Enterprise Admin Workspace as &ldquo;just a dashboard with filters, export, and role-based views.&rdquo; Dev looks at the sentence for a second and says: &ldquo;That is not one thing. That is a user interface, a reporting path, a permission system, and a background job.&rdquo; Priya feels the room shift. She thought she was naming a feature. Dev heard four technical systems hiding in one PM sentence.
        </SituationCard>

        <ConversationScene mentor="dev" name="Dev" role="Engineer" accent="#3A86FF" lines={[
          { speaker: 'priya', text: 'From the user side, it feels pretty simple. Filter, view, export.' },
          { speaker: 'other', text: 'From the system side, simple user flows can still cross four different layers. You just described UI work, a data retrieval problem, a permission gate, and a background job.' },
          { speaker: 'priya', text: 'So when I say "just add a filter," I may be compressing multiple kinds of work into one phrase?' },
          { speaker: 'other', text: 'Every time. The phrase sounds like one decision. The system hears four responsibilities.' },
        ]} />

        {h2(<>A feature is not what the user sees &mdash; it is what the system must do</>)}

        {para(<>Frontend, backend, database, and API are not just implementation vocabulary. They describe four genuinely different kinds of engineering work that can be scheduled, priced, tested, and can fail independently. When a PM collapses all four into one request, the team must silently decompose it before they can even estimate it. That&apos;s invisible work the PM created.</>)}

        <LayeredStackVisual />

        {keyBox('The four-layer model', [
          'UI Layer — what the user sees and touches. State management, rendering, component behavior.',
          'API contract — the promise between frontend and backend. Request shape, response shape, errors.',
          'Backend services — business logic, validation, permission enforcement, data orchestration.',
          'Data store — tables, queries, relationships, migrations, schema design.',
        ])}

        <FeatureToSystemMapper />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>PMs do not need to memorize architecture diagrams. They do need to stop speaking as if the interface is the entire product. When a PM names a feature, they are implicitly naming every system responsibility required to make that feature true.</>}
          question="When a PM says 'just add a filter,' what are they most likely underestimating?"
          options={[
            { text: 'The design time required to make the filter look good', correct: false, feedback: 'Visual design is usually the smallest part. The filter triggers query logic, permission filtering, and API changes that are invisible from the UI.' },
            { text: 'That even small visible changes can trigger multiple system responsibilities', correct: true, feedback: 'Correct. A filter change may require: new query params, permission-aware data scoping, API contract update, and a UI loading state. None of these are visible from the feature description.' },
            { text: 'That frontend engineers are slow at building filters', correct: false, feedback: 'This is a team dynamic assumption, not a systems-thinking insight. The real issue is the hidden scope beneath the visible change.' },
          ]}
          conceptId="tech101-system-layers"
        />

        <ApplyItBox prompt="Pick one feature from your current roadmap. Write it as a PM typically does in one sentence. Now list every system responsibility that sentence might be hiding. Which of those hides the most engineering cost?" />

        <QuizEngine
          conceptId="tech101-system-layers"
          conceptName="System Layers"
          moduleContext="PM Module 09: Tech 101 &amp; System Design. Learners are PMs learning to see system consequences behind product requests."
          staticQuiz={{
            conceptId: 'tech101-system-layers',
            question: "A PM writes: 'Users should be able to see a usage report filtered by team.' How many distinct system concerns might this create?",
            options: [
              'One — it is a reporting feature and reports are one kind of work',
              'Two — frontend display and backend data retrieval',
              'Multiple — frontend state, API contract, permission gate, query complexity, possibly async export',
              'None — it is a data concern, not a product concern',
            ],
            correctIndex: 2,
            explanation: "A filtered report visible to specific roles involves: UI table and filter components, an API endpoint with the right contract, backend permission enforcement, a query that joins teams to workspaces, and possibly an async export job. One PM sentence, multiple system concerns.",
          }}
        />

      </ChapterSection>

      {/* ── PART 2 · WHEN TECHNICAL PERFORMANCE BECOMES UX ── */}
      <ChapterSection id="m9-latency" num="02" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Maya presents a polished admin table with rich filters and instant-feeling interactions. Dev says the backend can return the data, but not at that speed once enterprise accounts grow. Priya initially hears this as implementation friction. Maya reframes it immediately: if the table feels uncertain or frozen, users will not experience it as slow. They will experience it as broken.
        </SituationCard>

        <ConversationScene mentor="maya" name="Maya" role="Designer" accent="#C85A40" lines={[
          { speaker: 'priya', text: 'If the data eventually loads, is this really a product issue?' },
          { speaker: 'other', text: 'Users do not grade us on eventual correctness. They grade us on what the waiting feels like.' },
          { speaker: 'priya', text: 'So latency is not just a performance concern — it changes what we have to design.' },
          { speaker: 'other', text: 'Yes. If we know the backend needs 3 seconds, the UX requirement is not "make it faster." The UX requirement is "make 3 seconds trustworthy."' },
        ]} />

        {h2(<>When timing changes user trust, timing becomes part of the product design</>)}

        {para(<>Backend engineers can optimize. But there is a level of latency that optimization cannot eliminate. At that point, the product must communicate. Empty table states, silent spinners, and frozen pages are not neutral &mdash; they are product decisions by default. PMs who treat performance as a purely engineering concern hand-wave away one of the most visible layers of product quality.</>)}

        <LatencyPressureVisual />

        {para(<>Pagination, caching, lazy loading, and query cost are not implementation details. They define what the product promises about response speed &mdash; and broken promises destroy enterprise trust faster than any missing feature.</>)}

        <LoadingStateDesignBoard />

        <PMPrinciple text="When system timing changes user trust, timing is part of the product design." />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Loading states are a product requirement, not a design nicety. They communicate system state to users. A PM who does not spec them is letting the system communicate randomly.</>}
          question="When a backend response is slower than the UI implies, what becomes the PM's job?"
          options={[
            { text: 'Pressure engineering to optimize until the response matches design expectations', correct: false, feedback: 'Pressure without understanding scope creates technical debt. Optimization has limits. The PM question is how to design the waiting state intentionally.' },
            { text: 'Redesign the feature to remove the slow operation entirely', correct: false, feedback: 'Sometimes valid — but this avoids the design challenge rather than solving it. The PM needs to first understand whether the wait can be made trustworthy.' },
            { text: 'Redefine the UX so the waiting state is intentional, legible, and trustworthy', correct: true, feedback: 'Correct. If the backend reliably takes 3 seconds, the product must communicate clearly during that window. Loading states, progress indicators, and ETAs are product decisions.' },
          ]}
          conceptId="tech101-latency-ux"
        />

        <ApplyItBox prompt="Pick a feature in your product that involves loading data. Is there a meaningful loading state? Does the user know what to expect? What would 'trustworthy waiting' look like for this feature?" />

        <QuizEngine
          conceptId="tech101-latency-ux"
          conceptName="Latency and UX"
          moduleContext="PM Module 09: Tech 101. Learner understands that technical performance becomes a product design responsibility."
          staticQuiz={{
            conceptId: 'tech101-latency-ux',
            question: "Why should a PM care about API response time?",
            options: [
              'To be able to set engineering targets during sprint planning',
              'Because slow responses directly change what the UX must communicate and design for',
              'Because faster APIs always cost less to run in production',
              'Because users always report performance in support tickets',
            ],
            correctIndex: 1,
            explanation: "Slow responses change what the product must communicate. A 3-second load with no feedback feels broken. The same 3-second load with a progress indicator and expected wait feels reliable. PM and design choices determine which experience users get.",
          }}
        />

      </ChapterSection>

      {/* ── PART 3 · DATA SHAPE ── */}
      <ChapterSection id="m9-schema" num="03" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Kiran asks a deceptively simple question: &ldquo;Where is team ownership stored right now?&rdquo; Priya cannot answer. The room goes quiet because the reporting feature suddenly depends on a relationship nobody has fully defined. What looked like a dashboard problem is now a data-shape problem.
        </SituationCard>

        <ConversationScene mentor="kiran" name="Kiran" role="Data Analyst" accent="#E67E22" lines={[
          { speaker: 'priya', text: 'I assumed we already had the information somewhere.' },
          { speaker: 'other', text: 'A business concept is not useful unless the system stores it in a queryable way. The concept of "team admin" exists in everyone\'s head. That doesn\'t mean it exists in the database.' },
          { speaker: 'priya', text: 'So if we never structured the relationship, the feature is weaker than I thought?' },
          { speaker: 'other', text: 'Not weaker. It requires a schema change before we can build it — which changes the estimate and the timeline.' },
        ]} />

        {h2(<>Product capability depends on data structure</>)}

        {para(<>Reporting, permissions, and metrics all depend on relationships between entities in the data model. If those relationships are missing, loosely defined, or not queryable, product features that depend on them become impossible or very expensive to build &mdash; even if the business concept seems obvious. A product feature is not real until the data shape that supports it is real.</>)}

        <SchemaRelationshipBoard />

        {para(<>PMs do not need to design schemas. They do need to ask three questions early: What entities does this feature require? How do they relate? What fields does each entity need for this feature to be possible? Asking late means discovering constraints during sprint planning instead of during discovery.</>)}

        <QueryPathWalkthrough />

        <PMPrinciple text="If the product never structured the data, the product never truly captured the capability." />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>PMs often ask reporting questions as if the data automatically exists. Kiran&apos;s role is to make hidden data assumptions visible before they become sprint-week surprises.</>}
          question="What PM mistake often begins with 'we can always track that later'?"
          options={[
            { text: 'Launching without enough user testing on the core flow', correct: false, feedback: 'User testing gaps are important, but this phrase is specifically about data and instrumentation — deferring structured data capture until it becomes urgently needed.' },
            { text: 'Treating missing data structure as a future detail instead of a current product limitation', correct: true, feedback: 'Correct. "Track later" turns into schema migrations, backfills, and reporting gaps. Data structure decisions made early protect the product\'s analytical and operational capabilities.' },
            { text: 'Over-engineering the data model before the product has found product-market fit', correct: false, feedback: 'Over-engineering is the opposite problem. "Track later" is under-investment in data structure — deferring structure that is actually needed for core product capabilities.' },
          ]}
          conceptId="tech101-data-shape"
        />

        <ApplyItBox prompt="For your current or most recent feature: What entities does it rely on? Do all of those relationships exist in the data model today? Ask someone on your data or engineering team — you may be surprised." />

        <QuizEngine
          conceptId="tech101-data-shape"
          conceptName="Data Shape and Product Capability"
          moduleContext="PM Module 09: Tech 101. Learner is understanding that product capability depends on data structure."
          staticQuiz={{
            conceptId: 'tech101-data-shape',
            question: "A PM wants to build a report showing workspace usage by team. What data question should they ask first?",
            options: [
              'Which chart type communicates this best?',
              'How many rows of data will this table show?',
              'Does the current data model link teams to workspaces in a queryable way?',
              'What load time is acceptable for this report?',
            ],
            correctIndex: 2,
            explanation: "The schema question must come first. If team-to-workspace relationships are not defined and stored, the report cannot be built regardless of UI, performance, or design choices. PMs who skip this discover it during sprint planning, not discovery.",
          }}
        />

      </ChapterSection>

      {/* ── PART 4 · APIs ARE PRODUCT CONTRACTS ── */}
      <ChapterSection id="m9-api" num="04" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya asks whether the same reporting experience can be shown in the mobile app. Dev says the real question is not whether the data exists. The real question is whether the current API contract is stable, permission-safe, and shaped correctly for another surface. Priya realizes she has been treating APIs like invisible plumbing instead of product boundaries.
        </SituationCard>

        <ConversationScene mentor="dev" name="Dev" role="Engineer" accent="#3A86FF" lines={[
          { speaker: 'priya', text: 'If the backend already has the data, why is reuse still complicated?' },
          { speaker: 'other', text: 'Because the contract defines who can ask for it, what shape it comes back in, and what errors we need to handle. An endpoint that works for the web app may not be right for mobile.' },
          { speaker: 'priya', text: 'So the feature is not really reusable unless the contract was designed for reuse.' },
          { speaker: 'other', text: 'Exactly. And weak contracts create downstream ambiguity even when the system technically works.' },
        ]} />

        {h2(<>An API is a promise &mdash; not a pipe</>)}

        {para(<>APIs define what can be asked for, by whom, in what format, and what comes back. PMs who treat APIs as invisible plumbing tend to write vague feature specs that hide contract questions: What fields does this endpoint return? Who is allowed to call it? What happens when the auth token is expired? What data does the mobile version actually need? Vague contracts produce engineering guesswork that surfaces as bugs in production.</>)}

        <RequestResponseFlow />

        <EndpointContractViewer />

        <PMPrinciple text="A weak API contract creates downstream ambiguity even when the system technically works." />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>APIs are not invisible implementation detail. They are promises that shape reuse, reliability, and scope clarity. If the contract is vague, the feature is vague &mdash; regardless of how polished the UI looks.</>}
          question="Why should a PM care about API contract quality?"
          options={[
            { text: 'So they can evaluate engineering performance during code reviews', correct: false, feedback: 'PMs do not review code. Contract quality matters because it shapes downstream scope clarity, reuse potential, and how well design can model error states.' },
            { text: 'Because vague contracts create ambiguity in reuse, scope, design behavior, and coordination', correct: true, feedback: 'Correct. A vague API contract means: engineers guess, designers cannot model error states, mobile teams hit unexpected limitations, and future reuse becomes expensive rework.' },
            { text: 'Because well-designed APIs are faster to build than vague ones', correct: false, feedback: 'Not reliably true. Good API design takes deliberate upfront work. The value is downstream — it prevents ambiguity that becomes expensive much later.' },
          ]}
          conceptId="tech101-api-contracts"
        />

        <ApplyItBox prompt="Think of a feature that uses an API. What does the contract for that API say about: who can call it, what fields it returns, and what errors it handles? If you cannot answer those questions without asking engineering, the contract is probably under-specified." />

        <QuizEngine
          conceptId="tech101-api-contracts"
          conceptName="APIs as Product Contracts"
          moduleContext="PM Module 09: Tech 101. Learner understands that APIs are product-level promises, not implementation details."
          staticQuiz={{
            conceptId: 'tech101-api-contracts',
            question: "A PM says 'we'll just reuse the existing endpoint for the mobile app.' What risk should an experienced PM flag?",
            options: [
              'Mobile development is slower than web and will delay the timeline',
              'The existing endpoint\'s contract may not be shaped correctly for mobile needs or security requirements',
              'Reuse is always preferred and this is actually a good default plan',
              'Mobile users do not need the same data as web users',
            ],
            correctIndex: 1,
            explanation: "Endpoint reuse without checking contract compatibility creates risk. The web endpoint may return more fields than mobile needs (data exposure), use auth mechanisms not suited to mobile, or be optimized for large screens rather than mobile payload sizes.",
          }}
        />

      </ChapterSection>

      {/* ── PART 5 · ENTERPRISE COMPLEXITY IS PERMISSION COMPLEXITY ── */}
      <ChapterSection id="m9-permissions" num="05" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Rohan gives what sounds like a clear rule: admins should see everything, managers should see their teams, and users should see only their own workspace. Priya thinks the spec sounds simple. Dev translates it into a permission matrix with roles, actions, exceptions, and edge cases. The feature just got much larger without changing a single visible screen.
        </SituationCard>

        <ConversationScene mentor="dev" name="Dev" role="Engineer" accent="#3A86FF" lines={[
          { speaker: 'priya', text: 'I thought the access model was already clear. Three rules for three roles.' },
          { speaker: 'other', text: 'Clear in English. Not clear in system behavior. What about managers trying to export cross-team data? Admins accessing archived workspaces? Users who belong to multiple teams?' },
          { speaker: 'priya', text: 'So one sentence is not enough for access design.' },
          { speaker: 'other', text: 'In enterprise products, it rarely is. If permissions matter, you need a matrix, not a sentence.' },
        ]} />

        {h2(<>Enterprise product design is often access design</>)}

        {para(<>Enterprise software sells to organizations where power and visibility are distributed across roles. Every role-action-resource combination is a decision. PMs who hand-wave permission logic with one sentence force engineers to guess &mdash; which means they will guess wrong on edge cases. Those wrong guesses surface in production as security issues, data leaks, or user-facing permission errors that destroy trust fast.</>)}

        <PermissionMatrixBloom />

        <AccessDecisionSimulator />

        <PMPrinciple text="If permissions matter, you need a matrix, not a sentence." />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Access logic becomes complex faster than PMs expect. The earlier it is made explicit &mdash; role by action by resource &mdash; the safer the roadmap becomes. Engineers cannot guess the right edge case behavior. PMs must specify it.</>}
          question="What is the biggest risk when PMs under-spec permissions?"
          options={[
            { text: 'The product will look inconsistent to users with different roles', correct: false, feedback: 'Visual inconsistency is a symptom, not the root risk. The deeper problem is that engineers must guess at access logic, which creates security risk and unpredictable behavior.' },
            { text: 'Engineers must guess at access logic, expanding hidden scope and launch risk', correct: true, feedback: 'Correct. Vague permission specs mean every edge case is an engineering judgment call. Wrong calls create security gaps, data exposure, and post-launch rework.' },
            { text: 'Permissions are usually configured by the customer, so PMs can defer to them', correct: false, feedback: 'Enterprise products have both product-defined and customer-configured access logic. PMs must still specify the base permission model clearly before customer customization is layered on top.' },
          ]}
          conceptId="tech101-permissions"
        />

        <ApplyItBox prompt="For your most recent B2B or multi-user feature: List the roles that exist. For each role, list what they can view, edit, export, and delete. Do any cells in that matrix feel ambiguous? That ambiguity is the hidden scope." />

        <QuizEngine
          conceptId="tech101-permissions"
          conceptName="Permissions and Enterprise Complexity"
          moduleContext="PM Module 09: Tech 101. Learner understands that enterprise features require explicit permission matrices, not high-level role descriptions."
          staticQuiz={{
            conceptId: 'tech101-permissions',
            question: "Why does 'admins can do everything' fail as a product requirement for enterprise software?",
            options: [
              'Because admins should never have full access to all data for security reasons',
              'Because it does not specify behavior for edge cases: archived data, cross-team exports, bulk delete, inherited roles',
              'Because enterprise software does not support unlimited admin access in practice',
              'Because it requires a separate admin portal that was not scoped',
            ],
            correctIndex: 1,
            explanation: "'Admins can do everything' is a starting point, not a spec. Edge cases — archiving, bulk actions, inherited vs direct membership, temporary access grants — all require explicit decisions. Leaving them unspecified means engineers will decide, often differently across the codebase.",
          }}
        />

      </ChapterSection>

      {/* ── PART 6 · SCALE ── */}
      <ChapterSection id="m9-scale" num="06" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          The pilot works. Adoption grows. Reporting slows. Exports queue. Admin frustration rises. Priya now has to understand what scale means at a product level. Dev does not need her to design infrastructure. He does need her to understand that a product flow that works at low volume may need a different UX shape at high volume.
        </SituationCard>

        <ConversationScene mentor="dev" name="Dev" role="Engineer" accent="#3A86FF" lines={[
          { speaker: 'priya', text: 'Can engineering just optimize this path?' },
          { speaker: 'other', text: 'Maybe the backend can improve. But some of this is not optimization — the flow itself needs a different shape at this load.' },
          { speaker: 'priya', text: 'You mean the user experience has to change because the system changed?' },
          { speaker: 'other', text: 'Yes. At scale, system behavior and product behavior stop being separable. "Export now" becomes "we\'ll notify you when it\'s ready." That\'s a product change, not just an infra change.' },
        ]} />

        {h2(<>Scale is not just bigger traffic &mdash; it is a different product operating mode</>)}

        {para(<>When system behavior changes at scale, the product flow must reflect the new reality. Synchronous actions become asynchronous. Instant responses become queued responses. One-step actions become job-status flows. PMs who treat all of this as &quot;engineering to solve later&quot; end up shipping experiences that feel broken at enterprise load even when the system is functioning correctly.</>)}

        <ScaleStressAnimation />

        <SyncAsyncExperienceBoard />

        <PMPrinciple text="At scale, product behavior and system behavior stop being separable." />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Scale forces product decisions, not just infrastructure decisions. When the system cannot respond instantly at enterprise load, the PM must answer: what experience shape is right for this system behavior? That is a product question, not a performance ticket.</>}
          question="If a report takes 40 seconds at enterprise scale, what question should the PM ask first?"
          options={[
            { text: 'Can engineering reduce the query time by optimizing the database index?', correct: false, feedback: 'Optimization is worth exploring, but starting there assumes the problem is purely technical. The PM question is: even if it takes 40 seconds, what experience shape makes that trustworthy?' },
            { text: 'What user experience shape fits this system behavior — not just whether engineering can speed it up', correct: true, feedback: 'Correct. Some operations take time at enterprise scale regardless of optimization. The PM\'s job is to design the waiting state: async with notification, background job, or estimated progress.' },
            { text: 'Should this feature be removed from the product until performance improves?', correct: false, feedback: 'Removing the feature is one option, but the right question is first whether the experience can be redesigned to fit the system\'s realistic behavior under load.' },
          ]}
          conceptId="tech101-scale"
        />

        <ApplyItBox prompt="Think of a feature in your product that might behave differently at 10x current scale. What becomes slower? What breaks? Does the UX handle that gracefully — or does it assume a speed the system may not always deliver?" />

        <QuizEngine
          conceptId="tech101-scale"
          conceptName="Scale and Product Behavior"
          moduleContext="PM Module 09: Tech 101. Learner understands that scale changes product operating modes, not just backend performance."
          staticQuiz={{
            conceptId: 'tech101-scale',
            question: "What is the most important thing a PM should understand about 'scale' as a product concern?",
            options: [
              'Scale means the engineering team needs more servers and infrastructure budget',
              'Scale can force product behavior changes — sync becomes async, instant becomes queued, and UX flows must adapt',
              'Scale problems can always be solved by optimization without changing user-facing behavior',
              'Scale is only relevant for consumer products with millions of users',
            ],
            correctIndex: 1,
            explanation: "Scale changes how the system behaves under load — and those changes often require product and UX decisions, not just infrastructure. Background jobs, queued exports, and async notifications are product experience choices that scale forces.",
          }}
        />

      </ChapterSection>

      {/* ── PART 7 · ESTIMATION ── */}
      <ChapterSection id="m9-estimation" num="07" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya enters sprint planning with what she thinks is a clearly defined feature. Engineering decomposes it into frontend work, permission logic, reporting queries, instrumentation, QA states, rollout work, and one migration step nobody expected. Her confidence in the timeline suddenly looks na&iuml;ve &mdash; not because the team is slow, but because the feature has become concrete.
        </SituationCard>

        <ConversationScene mentor="dev" name="Dev" role="Engineer" accent="#3A86FF" lines={[
          { speaker: 'priya', text: 'I thought we were estimating one feature.' },
          { speaker: 'other', text: 'We are. We are estimating the real version of it now.' },
          { speaker: 'priya', text: 'So estimate growth is a sign that hidden ambiguity is being exposed, not that engineering is being conservative?' },
          { speaker: 'other', text: 'Exactly. Better decomposition does not create uncertainty. It reveals uncertainty that was already there, hidden inside the scope.' },
        ]} />

        {h2(<>Estimate quality depends on how much ambiguity the scope still contains</>)}

        {para(<>Estimates expand when scope becomes concrete. The ambiguity was always there &mdash; in the permission edge cases, the missing data migration, the analytics instrumentation that was assumed but not specified. PMs who feel surprised by estimate expansion were carrying hidden assumptions. The engineering decomposition is making the real feature visible for the first time.</>)}

        <EstimateBreakdownCascade />

        {para(<>Good PMs improve estimate quality by making ambiguity visible earlier: clarifying permission logic in discovery, confirming data schema readiness before sprint planning, specifying rollout behavior before the feature is estimated. That is not about reducing scope. It is about reducing unknowns.</>)}

        <ScopeToEstimateDecomposer />

        <PMPrinciple text="Estimate quality depends on how much ambiguity the scope still contains." />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Engineers do not expand estimates to be difficult. They expand them when the hidden work finally becomes visible enough to reason about honestly. A PM who removes ambiguity before planning makes the estimate trustworthy &mdash; not by cutting scope, but by clarifying it.</>}
          question="What usually makes an engineering estimate more trustworthy?"
          options={[
            { text: 'Stronger deadline pressure from product and leadership', correct: false, feedback: 'Pressure does not improve estimate accuracy — it encourages optimism bias and hidden risk. Trustworthy estimates come from reduced ambiguity, not increased pressure.' },
            { text: 'Sharper scope boundaries and earlier visibility into hidden dependencies and uncertainty', correct: true, feedback: 'Correct. Estimates improve when: permissions are specified, schema readiness is confirmed, rollout behavior is defined, and edge cases are named. Less ambiguity in the scope = more trustworthy estimate.' },
            { text: 'Breaking the feature into smaller tickets so individual estimates are smaller', correct: false, feedback: 'Small tickets can help with tracking, but the same ambiguity exists whether it is in one ticket or twenty. The estimate improves when hidden assumptions are made explicit — not just when scope is divided.' },
          ]}
          conceptId="tech101-estimation"
        />

        <ApplyItBox prompt="Before your next sprint planning session: for the feature being estimated, write down any unresolved questions about permissions, data shape, API contracts, analytics instrumentation, or rollout behavior. How many are still open? That number predicts estimate confidence." />

        <QuizEngine
          conceptId="tech101-estimation"
          conceptName="Estimation and Scope Clarity"
          moduleContext="PM Module 09: Tech 101. Learner understands that estimates expand because scope contains hidden assumptions, not because engineering is conservative."
          staticQuiz={{
            conceptId: 'tech101-estimation',
            question: "Engineering decomposes a 'simple' feature into 8 tasks. What is the most constructive PM response?",
            options: [
              'Challenge the team to reduce the estimate by descoping lower-priority tasks',
              'Accept the estimate but escalate timeline concerns to leadership immediately',
              'Ask which tasks have hidden uncertainty and use that to improve scope clarity before committing',
              'Approve the estimate as-is since engineering knows best and PM input is not helpful here',
            ],
            correctIndex: 2,
            explanation: "The productive response is to identify which workstreams have unknown edges or dependencies, then use that as input to sharpen scope before the commitment. PMs who engage with decomposition improve estimate quality — not by cutting, but by clarifying.",
          }}
        />

        <NextChapterTeaser text="Next: LLMs, RAGs, and AI Foundations &mdash; how the AI models powering modern products actually work, and what PMs need to understand to make good bets on them." />

      </ChapterSection>

    </article>
  );
}

'use client';

/**
 * TEMPLATE — Track2 content file for a new PM module (APM / Scale track).
 *
 * HOW TO USE:
 *  1. Copy this file, rename to Track2<ModuleName>.tsx
 *  2. Fill in ACCENT, ACCENT_RGB, MODULE_NUM, MODULE_LABEL, MODULE_CONTEXT, PARTS
 *  3. Build local mockup components above the export (Amplitude, Jira, Notion, etc.)
 *  4. This file is rendered by ModuleShell when track === 'apm'
 *     ModuleShell passes completedSections — accept it for the dark module card
 *  5. npm run build — must be clean before pushing
 *
 * Track2 vs Track1 differences:
 *  - Tone: peer-level, not intro. Assume the learner already codes/manages products.
 *    Open with "You already know X. The question is when to use it."
 *  - Use PMPrincipleBox, pullQuote, glassCard/demoLabel liberally
 *  - Include one interactive tool mockup per major section (Amplitude, Jira, Notion, etc.)
 *  - Conversations are with Rohan (pressure/stakeholder) or Asha (strategic reframe),
 *    not just Asha explaining basics
 *  - Avatar options have nuanced wrong answers — no obviously dumb distractors
 *
 * SECTION IDs must match:
 *   - PARTS[].id         (dark module card progress)
 *   - ModuleConfig sections[].id  (left nav — same config used for both tracks)
 *   - <ChapterSection id="...">   (IntersectionObserver target)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizEngine from '../QuizEngine';
import {
  glassCard, demoLabel, h2, para, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser, ApplyItBox,
  TiltCard, ConversationScene, PMPrincipleBox,
} from './designSystem';
import { MentorFace } from './MentorFaces';

// ─────────────────────────────────────────
// MODULE IDENTITY — edit these
// ─────────────────────────────────────────
const ACCENT     = '#REPLACE_ME';   // e.g. '#158158'
const ACCENT_RGB = 'REPLACE_ME';    // e.g. '21,129,88'
const MODULE_NUM = 'XX';            // e.g. '05'
const MODULE_LABEL = 'Replace Me';  // e.g. 'Analytics & Metrics'
const MODULE_CONTEXT = `Module XX of Airtribe PM Fundamentals — Track: APM (Scale Track).
Follows Priya Sharma, 2-year APM at EdSpark (B2B SaaS for sales coaching). Replace with a 2-3 sentence description of what this module covers at the APM level.`;

// ─────────────────────────────────────────
// PARTS — must match ModuleConfig sections[] and ChapterSection ids
// ─────────────────────────────────────────
const PARTS = [
  { num: '01', id: 'mXX-part-one',   label: 'Part One — short hook phrase' },
  { num: '02', id: 'mXX-part-two',   label: 'Part Two — short hook phrase' },
  { num: '03', id: 'mXX-part-three', label: 'Part Three — short hook phrase' },
];

// ─────────────────────────────────────────
// LOCAL TOOL MOCKUPS
// Build one per major section. See CLAUDE.md for styling guidelines per tool type.
// ─────────────────────────────────────────

// Example: Amplitude-style analytics dashboard
const ExampleToolMockup = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Overview', 'Cohorts', 'Funnels'];

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #2A3A5C', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        {/* Header bar */}
        <div style={{ background: '#1B2A47', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
              <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />
            ))}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
            Tool Name &middot; Replace with context
          </div>
        </div>
        {/* Tab bar */}
        <div style={{ background: '#142138', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 0 }}>
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setActiveTab(i)} style={{
              padding: '8px 16px', fontSize: '11px', fontWeight: activeTab === i ? 700 : 400,
              color: activeTab === i ? '#fff' : 'rgba(255,255,255,0.4)',
              background: activeTab === i ? ACCENT + '22' : 'none',
              borderBottom: activeTab === i ? `2px solid ${ACCENT}` : '2px solid transparent',
              border: 'none', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
            }}>{t}</button>
          ))}
        </div>
        {/* Content area */}
        <div style={{ background: '#0F1B2D', padding: '24px', minHeight: '200px' }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>
                Replace with tab {tabs[activeTab]} content
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </TiltCard>
  );
};

// ─────────────────────────────────────────
// EXPORT DEFAULT
// ─────────────────────────────────────────
export default function Track2ModuleName({
  completedSections = new Set<string>(),
}: {
  completedSections?: Set<string>;
}) {
  const donePct  = Math.round((completedSections.size / PARTS.length) * 100);
  const nextPart = PARTS.find(p => !completedSections.has(p.id));

  return (
    <article style={{ padding: '0 0 80px' }}>

      {/* ── HERO ──────────────────────────────────────── */}
      <div style={{ position: 'relative', padding: '72px 0 48px', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{
          position: 'absolute', right: '-20px', top: '-10px',
          fontSize: 'clamp(140px, 18vw, 220px)', fontWeight: 700, lineHeight: 1,
          color: `rgba(${ACCENT_RGB},0.06)`, fontFamily: "'Lora', Georgia, serif",
          letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none',
        }}>{MODULE_NUM}</div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '14px', textTransform: 'uppercase' as const }}>
              PM Fundamentals &middot; Module {MODULE_NUM} &middot; Scale Track
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.03em', color: 'var(--ed-ink)', marginBottom: '16px', fontFamily: "'Lora', Georgia, serif" }}>
              {MODULE_LABEL}
            </h1>

            {/* APM-level framing — peer tone, not intro */}
            <p style={{ fontSize: '16px', color: 'var(--ed-ink2)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '560px' }}>
              You already know the basics. This module is about where experienced PMs get this wrong —
              replace with one sentence on the specific failure mode this module addresses.
            </p>

            {/* Character cards — APM track typically uses Rohan for pressure, Asha for strategy */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '40px' }}>
              {([
                { mentor: 'priya' as const, accent: ACCENT,    desc: "Two years in. Replace with her specific APM-level stake in this module." },
                { mentor: 'rohan' as const, accent: '#E67E22', desc: "Creates the pressure that forces the strategic call." },
                { mentor: 'asha'  as const, accent: '#0097A7', desc: "Reframes the problem at the level Priya isn't seeing yet." },
                // { mentor: 'kiran' as const, accent: '#3A86FF', desc: "Brings the data that changes the analysis." },
              ] as { mentor: 'priya'|'asha'|'rohan'|'kiran'|'maya'|'dev'; accent: string; desc: string }[]).map(c => (
                <div key={c.mentor} style={{ background: `${c.accent}0D`, border: `1px solid ${c.accent}33`, borderRadius: '10px', padding: '14px 16px', minWidth: '150px', flex: '1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <MentorFace mentor={c.mentor} size={44} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: c.accent, lineHeight: 1.2 }}>{{ priya: 'Priya', asha: 'Asha', rohan: 'Rohan', kiran: 'Kiran', maya: 'Maya', dev: 'Dev' }[c.mentor]}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.04em' }}>{{ priya: 'APM · 2 yrs', asha: 'AI Mentor', rohan: 'CEO · EdSpark', kiran: 'Data Analyst', maya: 'Designer', dev: 'Engineer' }[c.mentor]}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{c.desc}</div>
                </div>
              ))}
            </div>

            {/* What you'll be able to do — APM framing: outcome, not topic */}
            <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '20px 24px', borderLeft: `4px solid ${ACCENT}`, border: '1px solid var(--ed-rule)', borderLeftWidth: '4px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '12px', textTransform: 'uppercase' as const }}>
                What you&apos;ll be able to do
              </div>
              {[
                'Outcome one — what the APM-level learner will be able to do after this module.',
                'Outcome two — frame as "know when to..." or "be able to distinguish..." not just "understand X".',
                'Outcome three — specific enough to be testable.',
              ].map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 2 ? '10px' : 0, alignItems: 'flex-start' }}>
                  <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '12px', marginTop: '2px' }}>0{i + 1}</span>
                  <span style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating dark module card — same as Track1, auto-driven by PARTS + completedSections */}
          <div style={{ flexShrink: 0, width: '168px', paddingTop: '48px' }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <div className="float3d" style={{ transformStyle: 'preserve-3d' }}>
                <div style={{ background: 'linear-gradient(145deg, #1A1218 0%, #241228 100%)', borderRadius: '14px', padding: '20px 18px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE {MODULE_NUM}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>{MODULE_LABEL}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(240,232,216,0.45)', marginBottom: '16px' }}>Scale Track</div>
                  <div style={{ height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '1px', marginBottom: '14px' }}>
                    <motion.div animate={{ width: `${donePct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }}
                      style={{ height: '100%', background: ACCENT, borderRadius: '1px' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {PARTS.map(p => {
                      const done   = completedSections.has(p.id);
                      const isNext = p.id === nextPart?.id;
                      return (
                        <div key={p.num} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0, background: done ? '#0D7A5A' : isNext ? ACCENT : 'rgba(255,255,255,0.06)', border: `1px solid ${done ? '#0D7A5A' : isNext ? ACCENT : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: done || isNext ? '#fff' : 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, transition: 'background 0.3s, border-color 0.3s' }}>
                            {done ? '✓' : p.num}
                          </div>
                          <div style={{ fontSize: '9px', color: done ? 'rgba(240,232,216,0.5)' : isNext ? 'rgba(240,232,216,0.9)' : 'rgba(240,232,216,0.3)', lineHeight: 1.3, flex: 1, transition: 'color 0.3s' }}>
                            {p.label.split(' — ')[0]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: '16px', padding: '8px 10px', borderRadius: '6px', background: `${ACCENT}22`, border: `1px solid ${ACCENT}44` }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: ACCENT, fontWeight: 700, marginBottom: '2px' }}>
                      {donePct === 100 ? 'COMPLETE' : 'NEXT UP'}
                    </div>
                    <div style={{ fontSize: '9px', color: 'rgba(240,232,216,0.6)' }}>
                      {donePct === 100 ? `All ${PARTS.length} parts done` : nextPart ? nextPart.label.split(' — ')[0] : PARTS[0].label.split(' — ')[0]}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── SECTION 01 ─────────────────────────────────── */}
      <ChapterSection id="mXX-part-one" num="01" accentRgb={ACCENT_RGB} first>

        {/* APM sections: open with pressure/situation, not a definition */}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Scene-setter: place Priya in a specific high-stakes moment at EdSpark.
          Rohan/stakeholder is applying pressure. What does she want to say vs. what should she say?
        </SituationCard>

        {para(<>Opening paragraph — establish what Priya already knows and where that knowledge breaks down.</>)}

        {h2(<>Heading that names the insight, not the topic</>)}

        {para(<>Body paragraph — teach the nuance. APM learners know the basics; this is about the edge cases.</>)}

        {/* Tool mockup — one per section. Replace ExampleToolMockup with a real one */}
        <ExampleToolMockup />

        {pullQuote("A memorable one-liner that captures the APM-level insight. Should feel like something a VP would say in a review.")}

        <ConversationScene
          mentor="rohan" name="Rohan" role="CEO · EdSpark" accent="#E67E22"
          lines={[
            { speaker: 'other', text: "Rohan's framing of the situation — often a constraint or a demand." },
            { speaker: 'priya', text: "Priya's response — should show APM-level thinking, not a junior answer." },
            { speaker: 'other', text: "Rohan pushes back or escalates." },
            { speaker: 'priya', text: "Priya holds the line with data or reframing." },
          ]}
        />

        {/* glassCard + demoLabel for interactive concept exploration */}
        <div style={glassCard(ACCENT, ACCENT_RGB)}>
          {demoLabel('Concept label — tap to explore.', ACCENT)}
          {para(<>Content inside the glass card. Good for comparison tables, decision frameworks, or multi-option explorations.</>)}
        </div>

        <PMPrincipleBox principle="The principle this section teaches, stated as a decision rule. Good principles are specific enough to be wrong sometimes." />

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>APM-level reinforcement — assumes the learner knows the basics, pushes toward the nuanced judgment call.</>}
          expandedContent={<>Expanded explanation — give the full mental model, not just the answer.</>}
          question="APM-level scenario question — no obviously wrong answers."
          options={[
            { text: 'Plausible but wrong option A', correct: false, feedback: 'Why this sounds right but misses something important.' },
            { text: 'Correct option', correct: true, feedback: 'Why this is the right call and what it protects against.' },
            { text: 'Plausible but wrong option C', correct: false, feedback: 'What this approach optimises for incorrectly.' },
          ]}
          conceptId="replace-concept-id"
        />

        <QuizEngine
          conceptId="replace-concept-id"
          conceptName="Replace Concept Name"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={{
            conceptId: "replace-concept-id",
            question: "APM-level scenario question?",
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctIndex: 1,
            explanation: "Why Option B is the right call — reference the specific trade-off that distinguishes it.",
          }}
        />

        <ApplyItBox prompt="APM apply-it: a real decision the learner can make this week, not a theoretical exercise." />

      </ChapterSection>

      {/* ── SECTION 02 ─────────────────────────────────── */}
      <ChapterSection id="mXX-part-two" num="02" accentRgb={ACCENT_RGB}>
        {para(<>Section two content — repeat the same pattern above.</>)}
      </ChapterSection>

      {/* ── SECTION 03 ─────────────────────────────────── */}
      <ChapterSection id="mXX-part-three" num="03" accentRgb={ACCENT_RGB}>
        {para(<>Section three content.</>)}
        <NextChapterTeaser text="One sentence teasing what comes next in the curriculum." />
      </ChapterSection>

    </article>
  );
}

'use client';

/**
 * TEMPLATE — Track1 content file for a new PM module.
 *
 * HOW TO USE:
 *  1. Copy this file, rename to Track1<ModuleName>.tsx
 *  2. Fill in ACCENT, ACCENT_RGB, MODULE_NUM, MODULE_LABEL, PARTS, characters, objectives, sections
 *  3. Create matching Track2<ModuleName>.tsx (stub is fine: `export default function Track2... { return <div>Coming soon</div> }`)
 *  4. Create <ModuleName>Module.tsx — copy the wrapper block at the bottom of this file into a new file
 *  5. Add import + route in src/app/page.tsx
 *  6. Add to CourseOverview MODULES array with available: true
 *  7. npm run build — must be clean before pushing
 *
 * SECTION IDs must match across three places:
 *   - PARTS[].id         (dark module card + progress tracking)
 *   - ModuleConfig sections[].id  (left nav + scroll tracking)
 *   - <ChapterSection id="...">   (IntersectionObserver target)
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  h2, para, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser, ApplyItBox, ConversationScene,
} from './designSystem';
import { MentorFace } from './MentorFaces';
import QuizEngine from '../QuizEngine';

// ─────────────────────────────────────────
// MODULE IDENTITY — edit these
// ─────────────────────────────────────────
const ACCENT     = '#REPLACE_ME';   // e.g. '#158158'
const ACCENT_RGB = 'REPLACE_ME';    // e.g. '21,129,88'
const MODULE_NUM = 'XX';            // e.g. '05'
const MODULE_LABEL = 'Replace Me';  // e.g. 'Analytics & Metrics'

// ─────────────────────────────────────────
// PARTS — one entry per ChapterSection
// id must match ChapterSection id AND ModuleConfig sections[].id
// ─────────────────────────────────────────
const PARTS = [
  { num: '01', id: 'mXX-part-one',   label: 'Part One — short hook phrase' },
  { num: '02', id: 'mXX-part-two',   label: 'Part Two — short hook phrase' },
  { num: '03', id: 'mXX-part-three', label: 'Part Three — short hook phrase' },
  // add more as needed
];

// ─────────────────────────────────────────
// EXPORT DEFAULT
// ─────────────────────────────────────────
export default function Track1ModuleName({
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
        {/* Watermark number */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '-20px', top: '-10px',
          fontSize: 'clamp(140px, 18vw, 220px)', fontWeight: 700, lineHeight: 1,
          color: `rgba(${ACCENT_RGB},0.06)`, fontFamily: "'Lora', Georgia, serif",
          letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none',
        }}>{MODULE_NUM}</div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          {/* Left: text content */}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '14px', textTransform: 'uppercase' as const }}>
              PM Fundamentals &middot; Module {MODULE_NUM}
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.03em', color: 'var(--ed-ink)', marginBottom: '16px', fontFamily: "'Lora', Georgia, serif" }}>
              {MODULE_LABEL}
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif", marginBottom: '40px' }}>
              &ldquo;Replace with a memorable one-liner.&rdquo;
            </p>

            {/* Character cards — remove/add mentors as needed */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '40px' }}>
              {([
                { mentor: 'priya' as const, accent: ACCENT,    desc: "Your protagonist. Replace with her specific stake in this module." },
                { mentor: 'asha'  as const, accent: '#0097A7', desc: "AI mentor. Asks the question Priya hasn't asked yet." },
                // { mentor: 'rohan' as const, accent: '#E67E22', desc: "CEO. Sets pressure." },
                // { mentor: 'kiran' as const, accent: '#3A86FF', desc: "Data analyst. Brings the number." },
                // { mentor: 'maya'  as const, accent: '#C85A40', desc: "Designer." },
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

            {/* Learning objectives */}
            <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '20px 24px', borderLeft: `4px solid ${ACCENT}`, border: '1px solid var(--ed-rule)', borderLeftWidth: '4px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '12px', textTransform: 'uppercase' as const }}>
                Learning Objectives
              </div>
              {[
                'Objective one — outcome-focused, not topic-focused.',
                'Objective two — what will the learner be able to do?',
                'Objective three — keep to three.',
              ].map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 2 ? '10px' : 0, alignItems: 'flex-start' }}>
                  <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '12px', marginTop: '2px' }}>0{i + 1}</span>
                  <span style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: floating dark module card — do not edit, driven by PARTS + completedSections */}
          <div style={{ flexShrink: 0, width: '168px', paddingTop: '48px' }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <div className="float3d" style={{ transformStyle: 'preserve-3d' }}>
                <div style={{ background: 'linear-gradient(145deg, #1A1218 0%, #241228 100%)', borderRadius: '14px', padding: '20px 18px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE {MODULE_NUM}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>{MODULE_LABEL}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(240,232,216,0.45)', marginBottom: '16px' }}>Foundations Track</div>
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

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Scene-setter: place Priya in a concrete situation with a clear tension.
          What does she want? What is standing in her way?
        </SituationCard>

        {para(<>Opening paragraph — ground the concept in Priya&apos;s situation before naming it.</>)}

        {h2(<>Section heading — frame the insight, not the topic</>)}

        {para(<>Body paragraph — teach the concept by showing what it looks like in practice.</>)}

        <ConversationScene
          mentor="asha" name="Asha" role="AI Mentor" accent="#0097A7"
          lines={[
            { speaker: 'priya', text: "Priya's question or mistaken assumption." },
            { speaker: 'other', text: "Asha reframes the thinking — doesn't just answer, shifts the model." },
            { speaker: 'priya', text: "Follow-up showing Priya starting to get it." },
            { speaker: 'other', text: "The insight that closes the gap." },
          ]}
        />

        {keyBox('Key Takeaway', [
          'Point one — concrete and memorable.',
          'Point two — one sentence each.',
          'Point three — learner can act on this.',
        ])}

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>Short reinforcement of the section concept.</>}
          question="What is the key insight from this section?"
          options={[
            { text: 'Wrong option', correct: false, feedback: 'Why this misses the point.' },
            { text: 'Correct option', correct: true,  feedback: 'Why this is right.' },
            { text: 'Plausible but wrong', correct: false, feedback: 'What this confuses.' },
          ]}
          conceptId="replace-concept-id"
        />

        <QuizEngine
          conceptId="replace-concept-id"
          conceptName="Replace Concept Name"
          moduleContext="Brief context for the AI quiz generator."
          staticQuiz={{
            conceptId: "replace-concept-id",
            question: "Multiple-choice question about the concept?",
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctIndex: 1,
            explanation: "Why Option B is correct — one or two sentences.",
          }}
        />

        <ApplyItBox prompt="Concrete apply-it prompt — what should the learner do right now with this insight?" />

      </ChapterSection>

      {/* ── SECTION 02 ─────────────────────────────────── */}
      {/* Repeat the same pattern: SituationCard → para → h2 → para → ConversationScene → keyBox → Avatar → QuizEngine → ApplyItBox */}
      <ChapterSection id="mXX-part-two" num="02" accentRgb={ACCENT_RGB}>
        {para(<>Section two content goes here.</>)}
      </ChapterSection>

      {/* ── SECTION 03 ─────────────────────────────────── */}
      {/* Last section — end with NextChapterTeaser */}
      <ChapterSection id="mXX-part-three" num="03" accentRgb={ACCENT_RGB}>
        {para(<>Section three content goes here.</>)}
        <NextChapterTeaser text="One sentence teasing what comes next in the curriculum." />
      </ChapterSection>

    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODULE WRAPPER — copy this block into a NEW file: src/components/<Name>Module.tsx
// Do NOT keep this in the Track1 file.
// ─────────────────────────────────────────────────────────────────────────────
//
// 'use client';
// import ModuleShell, { type ModuleConfig } from '@/components/ModuleShell';
// import type { Track } from './pm-fundamentals/designSystem';
// import Track1ModuleName from './pm-fundamentals/Track1ModuleName';
// import Track2ModuleName from './pm-fundamentals/Track2ModuleName';
//
// const CONFIG: ModuleConfig = {
//   accent: '#REPLACE_ME',
//   accentRgb: 'REPLACE_ME',
//   moduleNum: 'XX',
//   moduleLabel: 'Replace Me',
//   moduleTime: '45 min · N parts',
//   completionEmoji: '🎯',
//   completionMessage: 'One or two sentences summarising what the learner accomplished.',
//   sections: [
//     { id: 'mXX-part-one',   label: 'Part One'   },
//     { id: 'mXX-part-two',   label: 'Part Two'   },
//     { id: 'mXX-part-three', label: 'Part Three' },
//   ],
//   concepts: [
//     { id: 'concept-slug', label: 'Concept Name', color: '#REPLACE_ME' },
//   ],
//   achievements: [
//     { id: 'mXX-part-one',   icon: '🌱', label: 'Badge One',   desc: 'One-line badge description.' },
//     { id: 'mXX-part-two',   icon: '🔍', label: 'Badge Two',   desc: 'One-line badge description.' },
//     { id: 'mXX-part-three', icon: '🎯', label: 'Badge Three', desc: 'One-line badge description.' },
//   ],
// };
//
// interface Props { onBack: () => void; track?: Track | null; }
//
// export default function ModuleNameModule({ onBack, track }: Props) {
//   return <ModuleShell config={CONFIG} track={track} onBack={onBack}
//                       Track1={Track1ModuleName} Track2={Track2ModuleName} />;
// }

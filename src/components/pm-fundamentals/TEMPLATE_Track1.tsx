'use client';
/**
 * TEMPLATE_Track1.tsx — Reusable skeleton for new PM Fundamentals Track 1 (new-pm) modules.
 *
 * HOW TO USE:
 *   1. Copy this file → rename Track1YourModuleName.tsx
 *   2. Search for every TODO and fill it in
 *   3. Add/remove ChapterSection blocks to match your section count
 *   4. Replace each TOOL_Mockup with an authentic interactive component
 *   5. Run `npm run build` before committing
 *
 * STRUCTURE OF EVERY SECTION:
 *   SituationCard (scene-setter)
 *   → h2 (section title)
 *   → para / pullQuote / keyBox (concept explanation)
 *   → Tool mockup (interactive, wrapped in TiltCard)
 *   → Avatar/Asha (challenge assumption, optional MCQ)
 *   → QuizEngine (end of section, matches QUIZZES[n])
 *
 * See CLAUDE.md for full design-system API reference.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuizEngine from '../QuizEngine';
import {
  glassCard, demoLabel, h2, pullQuote, keyBox,
  ChapterSection, Avatar, SituationCard, NextChapterTeaser, para,
} from './designSystem';
import { MentorFace } from './MentorFaces';

// ─────────────────────────────────────────
// CONSTANTS — TODO: fill in for your module
// ─────────────────────────────────────────
const ACCENT = '#TODO';           // e.g. '#C85A40'
const ACCENT_RGB = 'TODO';        // e.g. '200,90,64'
const MODULE_CONTEXT = `TODO`;    // One paragraph: what module covers, who Priya is, what EdSpark problem is relevant

// ─────────────────────────────────────────
// QUIZZES — one entry per ChapterSection
// Rules:
//   - conceptId must match QuizEngine conceptId AND staticQuiz.conceptId
//   - All options within ~15 chars of each other (no length-bias for correct answer)
//   - correct: true for exactly one option per quiz
// ─────────────────────────────────────────
const QUIZZES = [
  {
    // QuizEngine staticQuiz format:
    //   options: string[]  — plain strings, add "A. / B. / C." prefixes inline
    //   correctIndex: number  — 0-based index of the correct option
    //   explanation: string  — shown after answering (not per-option)
    //   keyInsight?: string  — optional pull-quote shown after correct answer
    //   conceptId: string  — must match the QuizEngine's conceptId prop
    //
    // MCQ length rule: all options must be within ~15 chars of each other.
    // Wrong options must be elaborated; correct option should be concise and precise.
    conceptId: 'TODO-section-1-slug',
    question: 'TODO: Question for section 1?',
    options: [
      'A. TODO wrong option — elaborate to match correct option length',
      'B. TODO correct option — concise and precise',
      'C. TODO wrong option — plausible but flawed, similar length to B',
      'D. TODO wrong option — equally long, misses the key point',
    ],
    correctIndex: 1,
    explanation: 'TODO: Explanation shown after answering — 2–3 sentences. Reference Priya\'s story if possible.',
    keyInsight: 'TODO: Optional one-liner insight. Or delete this line.',
  },
  {
    conceptId: 'TODO-section-2-slug',
    question: 'TODO: Question for section 2?',
    options: [
      'A. TODO wrong A — same length as correct',
      'B. TODO correct B — precise and concise',
      'C. TODO wrong C — similar length, wrong reasoning',
    ],
    correctIndex: 1,
    explanation: 'TODO: Explanation for section 2 quiz.',
  },
  // Add more entries to match your section count
];

// ─────────────────────────────────────────
// TILT CARD — 3D mouse-tracking wrapper
// Copy this verbatim — do not modify
// ─────────────────────────────────────────
const TiltCard = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -6, y: x * 6, scale: 1.012 });
  };
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0, scale: 1 })}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`,
        transition: 'transform 0.18s ease',
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ─────────────────────────────────────────
// LOCAL INTERACTIVE TOOL MOCKUPS
//
// One component per section. Replace each stub with a real interactive component.
// RULES:
//   - Must be wrapped in <TiltCard style={{ margin: '32px 0' }}>
//   - Must reflect the ACTUAL use case of the tool (not just a static screenshot)
//   - Must carry teaching load — the interaction should reinforce the section's concept
//   - Use useState for all interactive state
//   - Use motion.div + AnimatePresence from framer-motion for transitions
//   - Jira-style header: background '#172B4D', monospace chips
//   - Amplitude-style header: background '#1B2A47', label color '#7FBAFF'
//   - Slack-style header: background '#1A1D21', channel '#' prefix
//   - Notion-style header: sidebar '#F7F6F3'
//
// See project memory for full pattern descriptions per tool type.
// ─────────────────────────────────────────

const Section1ToolMockup = () => {
  // TODO: Replace with real interactive component
  // Example patterns: Jira backlog triage, Amplitude funnel, RICE calculator,
  // Slack response composer, Notion affinity board, Dovetail transcript tagging,
  // Kraftful raw-to-cluster flow
  const [active, setActive] = useState(false);
  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{
        borderRadius: '12px', overflow: 'hidden',
        border: `1px solid rgba(${ACCENT_RGB},0.25)`,
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
      }}>
        {/* Header bar — replace with tool-appropriate header */}
        <div style={{ background: ACCENT, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
              <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
            ))}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#fff', fontWeight: 600, letterSpacing: '0.08em' }}>
            TODO: Tool Name &middot; Context Label
          </div>
        </div>
        {/* Body — TODO: replace with interactive content */}
        <div style={{ background: '#fff', padding: '24px', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            onClick={() => setActive(!active)}
            style={{ padding: '10px 20px', borderRadius: '8px', border: `2px solid ${ACCENT}`, background: active ? ACCENT : '#fff', color: active ? '#fff' : ACCENT, cursor: 'pointer', fontFamily: 'monospace', fontSize: '12px', fontWeight: 700 }}
          >
            TODO: Replace this stub with real interaction
          </button>
        </div>
        {/* Footer hint */}
        <div style={{ background: '#F8F6F2', borderTop: `1px solid rgba(${ACCENT_RGB},0.15)`, padding: '8px 16px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#5E6C84' }}>
            TODO: Footer hint text — what should the learner try?
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

const Section2ToolMockup = () => {
  // TODO: Replace with real interactive component for section 2
  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid rgba(${ACCENT_RGB},0.25)`, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', background: '#fff', padding: '24px', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#97A0AF' }}>TODO: Section 2 tool mockup</div>
      </div>
    </TiltCard>
  );
};

// Add more Section_N_ToolMockup components as needed

// ─────────────────────────────────────────
// MAIN EXPORT
// Props: same as all Track1 components
// ─────────────────────────────────────────
export default function Track1_TODO_ModuleName({ onSectionChange }: { onSectionChange?: (id: string) => void }) {
  return (
    <>

      {/* ── SECTION 1 ─────────────────────────────── */}
      <ChapterSection id="mN-section-1-slug" num="01" accentRgb={ACCENT_RGB} first>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          TODO: Scene-setter for section 1. 2–4 sentences. What is Priya facing right now?
          Who is in the room? What is the pressure or decision?
        </SituationCard>

        {h2(<>TODO: Section 1 Heading</>)}

        {para(<>
          TODO: Opening paragraph explaining the core concept of this section.
          Keep it grounded in Priya&apos;s situation. 3–5 sentences.
        </>)}

        {pullQuote("TODO: A punchy one-liner that captures the section's core insight.")}

        {para(<>
          TODO: Second paragraph. Go deeper. Give an example. Contrast the wrong approach
          with the right one. Mention a real PM scenario.
        </>)}

        {keyBox("TODO: Key Takeaways Title", [
          "TODO: First key point — specific and actionable",
          "TODO: Second key point",
          "TODO: Third key point",
        ])}

        <Section1ToolMockup />

        {para(<>
          TODO: Bridge paragraph after the mockup. What did Priya take away from this tool?
          How does it connect to the next idea?
        </>)}

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>TODO: Asha&apos;s short challenge or insight for section 1. 1–2 sentences.</>}
          expandedContent={<>TODO: Asha&apos;s deeper explanation when expanded. 2–4 sentences.</>}
          question="TODO: Asha's inline MCQ question?"
          options={[
            { text: "TODO wrong option A", correct: false, feedback: "TODO why wrong." },
            { text: "TODO correct option B", correct: true, feedback: "TODO why right." },
            { text: "TODO wrong option C", correct: false, feedback: "TODO why wrong." },
          ]}
          conceptId="TODO-section-1-slug"
        />

        <QuizEngine
          conceptId="TODO-section-1-slug"
          conceptName="TODO: Concept Name"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={QUIZZES[0]}
        />

      </ChapterSection>

      {/* ── SECTION 2 ─────────────────────────────── */}
      <ChapterSection id="mN-section-2-slug" num="02" accentRgb={ACCENT_RGB}>

        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          TODO: Scene-setter for section 2. New beat in Priya&apos;s story.
        </SituationCard>

        {h2(<>TODO: Section 2 Heading</>)}

        {para(<>TODO: Section 2 opening paragraph.</>)}

        {para(<>TODO: Section 2 second paragraph.</>)}

        <Section2ToolMockup />

        {para(<>TODO: Bridge paragraph after section 2 mockup.</>)}

        <Avatar
          name="Asha"
          nameColor="var(--teal)"
          borderColor="var(--teal)"
          content={<>TODO: Asha&apos;s section 2 insight.</>}
          question="TODO: Section 2 inline MCQ?"
          options={[
            { text: "TODO wrong A", correct: false, feedback: "TODO." },
            { text: "TODO correct B", correct: true, feedback: "TODO." },
            { text: "TODO wrong C", correct: false, feedback: "TODO." },
          ]}
          conceptId="TODO-section-2-slug"
        />

        <QuizEngine
          conceptId="TODO-section-2-slug"
          conceptName="TODO: Concept Name 2"
          moduleContext={MODULE_CONTEXT}
          staticQuiz={QUIZZES[1]}
        />

      </ChapterSection>

      {/* Add more ChapterSection blocks as needed for sections 3, 4, 5... */}

      {/* ── CHAPTER TEASER ────────────────────────── */}
      <NextChapterTeaser text="TODO: One sentence teasing what comes in the next module." />

    </>
  );
}

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import QuizEngine from './QuizEngine';
import GenAIAvatar, { GenAIMentorFace, GenAIConversationScene, AaravFace, RheaFace } from './GenAIAvatar';
import type { GenAIMentorId } from './GenAIAvatar';
import type { GenAITrack } from './genaiTypes';
import {
  ApplyItBox, ChapterSection, NextChapterTeaser, PMPrincipleBox, SituationCard,
  TiltCard, chLabel, h2, keyBox, para, pullQuote,
} from './pm-fundamentals/designSystem';

const ACCENT = '#0891B2';
const ACCENT_RGB = '8,145,178';
const MODULE_NUM = '03';

const CONCEPTS = [
  { id: 'genai-m3-research',     label: 'Triangulating Sources',         color: '#0891B2' },
  { id: 'genai-m3-compression',  label: 'Compression vs Transcription',  color: '#7C3AED' },
  { id: 'genai-m3-5w1h',         label: '5W1H Framework',                color: '#2563EB' },
  { id: 'genai-m3-cove',         label: 'COVE Evaluation',               color: '#0F766E' },
  { id: 'genai-m3-draft',        label: 'Audience-First Drafting',       color: '#C2410C' },
];

const SECTIONS = [
  { id: 'genai-m3-research',    label: '1. Triangulating Sources' },
  { id: 'genai-m3-compression', label: '2. Summarization as Compression' },
  { id: 'genai-m3-5w1h',        label: '3. The 5W1H Framework' },
  { id: 'genai-m3-cove',        label: '4. COVE Evaluation' },
  { id: 'genai-m3-draft',       label: '5. Drafting from Synthesis' },
];

const BADGES = [
  { id: 'genai-m3-research',    icon: 'RS', label: 'Researcher',    color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC' },
  { id: 'genai-m3-compression', icon: 'CX', label: 'Compressor',    color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  { id: 'genai-m3-5w1h',        icon: '5W', label: '5W1H Pro',      color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { id: 'genai-m3-cove',        icon: 'CV', label: 'COVE Analyst',  color: '#0F766E', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'genai-m3-draft',       icon: 'DR', label: 'Drafter',       color: '#C2410C', bg: '#FFF7ED', border: '#FED7AA' },
];

const QUIZZES = [
  {
    conceptId: 'genai-m3-research',
    question: {
      tech: "Aarav's research assistant returns a confident policy summary citing three clauses. A senior analyst finds a fourth clause in an amendment document that wasn't in the pipeline. What's the correct diagnosis?",
      'non-tech': "Rhea's Claude prompt reads only the current exception ticket. A recommendation turns out wrong because it missed the prior week's context thread. What should Rhea change first?",
    },
    options: {
      tech: [
        'A. The model needs a larger context window to catch more clauses',
        'B. The pipeline is missing the amendment document as an input source',
        'C. The prompt needs to explicitly ask the model to look for amendments',
        "D. The model's temperature is too low — it's being too conservative",
      ],
      'non-tech': [
        'A. Rewrite the summarisation prompt to ask for more detail',
        'B. Add the prior exception thread as an input source to the pipeline',
        'C. Switch to a more capable model that handles longer context',
        'D. Ask analysts to review AI summaries before acting on them',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 1 },
    explanation: {
      tech: "The amendment document was never passed to the model — a larger context window cannot read a file the pipeline never loaded. Source coverage is a design decision, not a prompt instruction.",
      'non-tech': "The prior thread is a required input for this exception type. Without it, the model has half the context a senior analyst would use. Adding it to the pipeline is the highest-leverage fix.",
    },
    keyInsight: "Research pipelines that read one source are compression tools, not research tools. Triangulation requires intentional multi-source architecture.",
  },
  {
    conceptId: 'genai-m3-compression',
    question: {
      tech: "Aarav's prompt says 'summarise the key clauses in three bullets.' Analysts say the output is accurate but they can't use it to decide. What is the most targeted fix?",
      'non-tech': "Rhea's brief describes the exception backlog accurately. Her director says she can't tell what she's being asked to do. What does Rhea need to add to the drafting prompt?",
    },
    options: {
      tech: [
        'A. Increase the number of bullets from three to five',
        'B. Add the decision the analyst is making as a parameter to the prompt',
        'C. Use a stronger model that produces more decision-oriented outputs',
        'D. Add few-shot examples of good summaries to the prompt',
      ],
      'non-tech': [
        'A. Make the brief longer and more detailed',
        'B. Add a section listing all open exceptions',
        'C. Add a decision frame and recommendation to the end of the output structure',
        'D. Switch to a model better suited to executive communication',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 2 },
    explanation: {
      tech: "Adding the decision type (approve/escalate/deny) transforms the compression function. The model selects and weights information differently when it knows what decision the output serves.",
      'non-tech': "A brief without a recommendation leaves the reader to infer your position. The decision frame — what is the director being asked to decide, and what do you recommend — is the core output of a brief.",
    },
    keyInsight: "Compression without a specified purpose produces accurate summaries that nobody acts on.",
  },
  {
    conceptId: 'genai-m3-5w1h',
    question: {
      tech: "Two analysts run the same research query and get different summaries from the same pipeline. What is the most likely root cause?",
      'non-tech': "Rhea's brief is thorough but her manager keeps saying 'what do I do with this.' What 5W1H question is Rhea failing to answer?",
    },
    options: {
      tech: [
        'A. The model has high temperature, causing non-deterministic outputs',
        'B. The query is ambiguous — unspecified dimensions are filled differently across runs',
        'C. The documents are inconsistent and produce different summaries by section priority',
        'D. The pipeline needs a caching layer to return consistent outputs for identical queries',
      ],
      'non-tech': [
        'A. WHO — she does not know who her reader is',
        "B. WHAT — she's answering the wrong question (what happened vs. what requires your attention)",
        "C. WHERE — she's not specifying the right backlog scope",
        "D. HOW — she's not specifying the right output format",
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 1 },
    explanation: {
      tech: "'The same query' with different implicit contexts fills unspecified dimensions differently. Standardising the query inputs with 5W1H — WHO, WHAT, WHEN, WHERE, WHY, HOW — eliminates the variance.",
      'non-tech': "Rhea is answering 'what happened this week' when her manager is asking 'does anything need my attention.' Same data source, different question, completely different brief.",
    },
    keyInsight: "5W1H doesn't structure the output. It structures the question you're actually answering — before you write a word.",
  },
  {
    conceptId: 'genai-m3-cove',
    question: {
      tech: "Aarav's pipeline produces a summary citing '23% of outpatient surgery claims in this category result in secondary review.' The source documents don't contain this figure. Which COVE dimension catches this first?",
      'non-tech': "Rhea's brief includes 'exception resolution time improved 18% since implementing the new protocol.' Her data team can't find the source. What is the correct COVE diagnosis?",
    },
    options: {
      tech: [
        'A. Completeness — the output missed other statistics in the documents',
        'B. Originality — the model drew the figure from training data, not the provided documents',
        'C. Efficiency — the statistic makes the output unnecessarily long',
        'D. Verifiability — the claim cannot be traced to a specific source sentence in the inputs',
      ],
      'non-tech': [
        'A. Completeness — the brief missed other improvement metrics',
        'B. Originality only — Claude generated a number from training patterns',
        'C. Verifiability only — the 18% cannot be traced to a specific data source',
        'D. Both Originality and Verifiability — the number is model-generated AND unverifiable',
      ],
    },
    correctIndex: { tech: 3, 'non-tech': 3 },
    explanation: {
      tech: "Verifiability is the first practical check: trace the claim to a specific source sentence. If '23%' isn't in any of the provided documents, the claim is model-generated — regardless of how confident it sounds.",
      'non-tech': "The 18% figure fails on two dimensions: Originality (generated by Claude, not retrieved from Rhea's data) and Verifiability (cannot be traced to a source). Both flags should have triggered review before forwarding.",
    },
    keyInsight: "Convincing is not the same as correct. Specific numbers that can't be traced are the most expensive kind of wrong — they get quoted before anyone checks.",
  },
  {
    conceptId: 'genai-m3-draft',
    question: {
      tech: "Aarav's synthesis prompt produces technically accurate briefs. His manager says they 'read like technical documents' and can't be used in stakeholder meetings. What is the most targeted fix?",
      'non-tech': "Rhea sends the same brief to her team, director, and regional manager. Her team says too high-level, her regional manager never responds. What is the root cause?",
    },
    options: {
      tech: [
        'A. The synthesis needs to be shorter before drafting begins',
        'B. The drafting prompt needs an audience parameter — who reads it and what decision they make',
        'C. The model needs few-shot examples of stakeholder briefs',
        'D. The manager needs training on how to read technical briefs',
      ],
      'non-tech': [
        'A. The brief needs to be longer to serve all three audiences simultaneously',
        'B. Rhea should write three separate briefs manually for each audience',
        'C. The drafting prompt needs an audience parameter — one synthesis, three audience profiles, three separate prompts',
        'D. The regional manager is the problem — she does not engage with written briefs',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 2 },
    explanation: {
      tech: "Wikipedia-style output is what you get when the audience is 'general reader.' Adding audience — role, prior knowledge, decision, format — transforms the same synthesis into a brief the audience can use.",
      'non-tech': "One drafting prompt cannot serve three audiences. Three audience profiles — each specifying who reads, what they know, what they decide, how they read — produce three useful briefs from the same research.",
    },
    keyInsight: "The synthesis is the raw material. Who reads it determines what you build from it.",
  },
];

const SECTION_XP = 50;
const QUIZ_XP = 100;

const TRACK_META: Record<GenAITrack, { label: string; introTitle: string; moduleContext: string }> = {
  'non-tech': {
    label: 'Workflow & Operator Track',
    introTitle: 'Research, Summarization & Drafting · Operator Lens',
    moduleContext: `GenAI Launchpad · Non-Tech Track · Pre-Read 03 · Research, Summarization & Drafting. Follows Rhea, an operations lead at Northstar Health, as she discovers that AI-generated summaries look complete but miss the 'so what' — and rebuilds her approach from source selection through to audience-first drafting.`,
  },
  tech: {
    label: 'Tech Builder Track',
    introTitle: 'Research, Summarization & Drafting · Builder Lens',
    moduleContext: `GenAI Launchpad · Tech Track · Pre-Read 03 · Research, Summarization & Drafting. Follows Aarav, a platform engineer at Northstar Health, as he diagnoses why his research assistant produces fluent but untrustworthy outputs — and rebuilds it as a proper multi-stage pipeline with source triangulation, COVE evaluation, and audience-parameterised drafting.`,
  },
};

type Props = { track: GenAITrack; onBack: () => void };

function computeXP(completedSections: Set<string>, conceptStates: Record<string, { pKnow: number }>) {
  const readingXP = completedSections.size * SECTION_XP;
  const quizXP = Object.values(conceptStates).reduce((sum, s) => sum + Math.round(s.pKnow * QUIZ_XP), 0);
  return { readingXP, quizXP, total: readingXP + quizXP };
}

function getLevel(total: number) {
  if (total >= 600) return { label: 'Builder',   color: '#0891B2', min: 600 };
  if (total >= 350) return { label: 'Operator',  color: '#2563EB', min: 350 };
  if (total >= 150) return { label: 'Explorer',  color: '#0F766E', min: 150 };
  return { label: 'Curious', color: 'var(--ed-ink3)', min: 0 };
}

function getNextLevel(total: number) {
  if (total < 150) return { label: 'Explorer', min: 150 };
  if (total < 350) return { label: 'Operator',  min: 350 };
  if (total < 600) return { label: 'Builder',   min: 600 };
  return null;
}

function LeftNav({ completedSections, activeSection }: { completedSections: Set<string>; activeSection: string | null }) {
  const donePct = Math.round((completedSections.size / SECTIONS.length) * 100);
  return (
    <aside style={{ position: 'sticky', top: '80px' }}>
      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '18px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid var(--ed-rule)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '8px' }}>Contents</div>
          <div style={{ height: '2px', background: 'var(--ed-rule)', borderRadius: '1px', overflow: 'hidden' }}>
            <motion.div style={{ height: '100%', background: ACCENT }} animate={{ width: `${donePct}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '6px' }}>{donePct}% · {completedSections.size}/{SECTIONS.length} parts</div>
        </div>
        <nav>
          {SECTIONS.map((section, idx) => {
            const done = completedSections.has(section.id);
            const active = activeSection === section.id && !done;
            return (
              <motion.button
                key={section.id}
                onClick={() => document.querySelector(`[data-section="${section.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                whileHover={{ x: 2 }}
                style={{ display: 'flex', alignItems: 'baseline', gap: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', textAlign: 'left' as const, borderLeft: active ? `2px solid ${ACCENT}` : '2px solid transparent', paddingLeft: '8px', marginLeft: '-8px' }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: done || active ? ACCENT : 'var(--ed-rule)', minWidth: '20px' }}>{String(idx + 1).padStart(2, '0')}.</span>
                <span style={{ fontSize: '12px', fontWeight: active ? 600 : 400, color: done ? 'var(--ed-ink2)' : active ? 'var(--ed-ink)' : 'var(--ed-ink3)', lineHeight: 1.4 }}>{section.label}{done ? ' ✓' : ''}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

function Sidebar({ completedSections, progressPct, prevXp }: { completedSections: Set<string>; progressPct: number; prevXp: number }) {
  const store = useLearnerStore();
  const xp = computeXP(completedSections, store.conceptStates);
  const level = getLevel(xp.total);
  const nextLevel = getNextLevel(xp.total);

  return (
    <aside style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column' as const, gap: '14px' }}>
      {/* XP Card */}
      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '2px' }}>Level</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: level.color }}>{level.label}</div>
          </div>
          <div style={{ textAlign: 'right' as const }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '2px' }}>XP</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: ACCENT, fontFamily: "'JetBrains Mono', monospace" }}>{xp.total}</div>
          </div>
        </div>
        {nextLevel && (
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '9px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>→ {nextLevel.label}</span>
              <span style={{ fontSize: '9px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>{nextLevel.min - xp.total} XP away</span>
            </div>
            <div style={{ height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${Math.min(100, ((xp.total - level.min) / (nextLevel.min - level.min)) * 100)}%` }} style={{ height: '100%', background: ACCENT }} transition={{ duration: 0.6 }} />
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1, background: 'var(--ed-cream)', borderRadius: '6px', padding: '8px', textAlign: 'center' as const }}>
            <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', marginBottom: '2px', textTransform: 'uppercase' as const }}>Reading</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'JetBrains Mono', monospace" }}>{xp.readingXP}</div>
          </div>
          <div style={{ flex: 1, background: 'var(--ed-cream)', borderRadius: '6px', padding: '8px', textAlign: 'center' as const }}>
            <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', marginBottom: '2px', textTransform: 'uppercase' as const }}>Quizzes</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'JetBrains Mono', monospace" }}>{xp.quizXP}</div>
          </div>
        </div>
      </div>
      {/* Badges */}
      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '12px' }}>Badges</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
          {BADGES.map((badge) => {
            const unlocked = completedSections.has(badge.id);
            return (
              <div key={badge.id} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '4px', opacity: unlocked ? 1 : 0.3 }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: unlocked ? badge.bg : 'var(--ed-rule)', border: `1.5px solid ${unlocked ? badge.border : 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: unlocked ? badge.color : 'var(--ed-ink3)' }}>{badge.icon}</span>
                </div>
                <div style={{ fontSize: '8px', color: unlocked ? 'var(--ed-ink3)' : 'transparent', fontWeight: 600, textAlign: 'center' as const, maxWidth: '40px', lineHeight: 1.2 }}>{badge.label}</div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Concept Mastery */}
      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-indigo)', marginBottom: '10px' }}>Concept Mastery</div>
        {CONCEPTS.map((concept) => {
          const state = store.conceptStates[concept.id] || { pKnow: 0 };
          const pct = Math.round(state.pKnow * 100);
          return (
            <div key={concept.id} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--ed-ink2)', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{concept.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: concept.color, fontWeight: 700, marginLeft: '8px', flexShrink: 0 }}>{pct}%</span>
              </div>
              <div style={{ height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${pct}%` }} style={{ height: '100%', background: concept.color }} transition={{ duration: 0.6 }} />
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: '10px', fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>Complete quizzes and mentor checks to raise mastery scores</div>
      </div>
    </aside>
  );
}

function CoreContent({ track }: { track: GenAITrack }) {
  const moduleContext = TRACK_META[track].moduleContext;
  return (
    <>
      {/* Module Hero */}
      <div style={{ background: 'var(--ed-cream)', borderRadius: '14px', padding: '36px 36px 28px', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-12px', top: '-8px', fontSize: '140px', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.05)`, fontFamily: "'Lora','Georgia',serif", letterSpacing: '-0.04em', userSelect: 'none' as const, pointerEvents: 'none' as const }}>03</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '10px', textTransform: 'uppercase' as const }}>GenAI Launchpad · Pre-Read 03</div>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.025em', color: 'var(--ed-ink)', marginBottom: '10px', fontFamily: "'Lora', Georgia, serif" }}>Research, Summarization &amp; Drafting</h1>
          <p style={{ fontSize: '15px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif", marginBottom: '28px' }}>&ldquo;A summary that looks complete is the most dangerous kind of wrong.&rdquo;</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const, marginBottom: '24px' }}>
            <div style={{ background: track === 'tech' ? 'rgba(15,118,110,0.08)' : `rgba(${ACCENT_RGB},0.08)`, border: `1.5px solid ${track === 'tech' ? 'rgba(15,118,110,0.3)' : `rgba(${ACCENT_RGB},0.3)`}`, borderRadius: '10px', padding: '14px 16px', flex: '1.5', minWidth: '180px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                {track === 'tech' ? <AaravFace size={44} /> : <RheaFace size={44} />}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: track === 'tech' ? '#0F766E' : ACCENT }}>{track === 'tech' ? 'Aarav' : 'Rhea'}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.04em' }}>{track === 'tech' ? 'Platform Engineer · Northstar Health' : 'Operations Lead · Northstar Health'}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: track === 'tech' ? '#0F766E' : ACCENT, background: track === 'tech' ? 'rgba(15,118,110,0.1)' : `rgba(${ACCENT_RGB},0.1)`, padding: '2px 7px', borderRadius: '4px', letterSpacing: '0.06em' }}>PROTAGONIST</div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{track === 'tech' ? "Research assistant is live. Summaries read fluently. Analysts flag them as untrustworthy — a policy amendment buried in footnotes was never in the pipeline." : "Team spent 3+ hours on research prep last week. Rolled out Claude. Saved 20 minutes. Not 3 hours. Analysts still re-read source docs because the summaries don't catch edge cases."}</div>
            </div>
            {([
              { name: 'Anika', role: 'AI Workflow Strategist', desc: 'Asks what sources the pipeline was designed to read before debugging the model.', color: '#7C3AED', mentorId: 'anika' as GenAIMentorId },
              { name: 'Rohan', role: 'Automation Engineer',    desc: 'Wants to know what the output contract is before touching the summarisation prompt.', color: '#2563EB', mentorId: 'rohan' as GenAIMentorId },
              { name: 'Leela', role: 'Risk & Compliance',      desc: 'First to ask where a specific statistic in the AI output actually came from.', color: '#C2410C', mentorId: 'leela' as GenAIMentorId },
            ]).map(m => (
              <div key={m.name} style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '12px 14px', flex: '1', minWidth: '130px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <GenAIMentorFace mentor={m.mentorId} size={34} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '12px', color: m.color, lineHeight: 1.2 }}>{m.name}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--ed-ink3)', letterSpacing: '0.03em' }}>{m.role}</div>
                  </div>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{m.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '16px 20px', border: '1px solid var(--ed-rule)', borderLeft: `3px solid ${ACCENT}` }}>
            <div style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '10px', textTransform: 'uppercase' as const }}>Learning Objectives</div>
            {[
              'Design a multi-source research pipeline that triangulates instead of compresses',
              'Write summarisation prompts that specify a decision, not just a topic',
              'Apply the 5W1H framework to the brief before writing it, not after',
              'Use COVE to evaluate any AI output before it crosses a handoff point',
              'Parameterise drafting prompts by audience so one synthesis serves multiple readers',
            ].map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 4 ? '8px' : 0, alignItems: 'flex-start' }}>
                <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", marginTop: '2px' }}>0{i + 1}</span>
                <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '10px', padding: '16px 20px', borderRadius: '10px', background: track === 'tech' ? 'rgba(15,118,110,0.08)' : `rgba(${ACCENT_RGB},0.08)`, border: `1px solid ${track === 'tech' ? 'rgba(15,118,110,0.18)' : `rgba(${ACCENT_RGB},0.18)`}` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: track === 'tech' ? '#0F766E' : ACCENT, marginBottom: '8px' }}>{TRACK_META[track].label.toUpperCase()}</div>
        <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>{track === 'tech' ? "Your lens: how do you build a research pipeline that analysts can actually trust — one that triangulates sources, surfaces conflicts, and produces decision-grade briefs, not fluent summaries?" : "Your lens: how do you design an AI-assisted research workflow that saves real hours, not just minutes — by getting source selection, summarisation purpose, and audience fit right before touching the prompt?"}</div>
      </div>

      {/* ── SECTION 01 ── */}
      <ChapterSection id="genai-m3-research" num="01" accentRgb={ACCENT_RGB} first>
        {chLabel('Research, Summarization & Drafting')}
        {para(track === 'tech'
          ? "In Pre-Read 02, Aarav learned to write structured prompts — system messages, output schemas, few-shot examples, context budgeting. That discipline improved consistency. But his research assistant is now producing consistent outputs that analysts don't trust. The issue isn't the prompt. It's what goes into the pipeline before the prompt ever runs."
          : "In Pre-Read 02, Rhea learned to write disciplined prompts — role, format, constraints, length, examples. The outputs are cleaner. But analysts still re-read source documents because the AI summaries look complete and miss critical context. The issue isn't the prompt. It's what the prompt is reading."
        )}
        {h2("Research isn't finding answers. It's triangulating sources.")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can identify every source a claims analyst would consult for a given query type and design a pipeline that reads all of them — not just the most obvious one."
          : "\u25b6 After this section, you can list the sources your team's research pipeline currently reads and the sources it should read — and close the gap."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? <>Aarav&apos;s claims research assistant has been live for one week. Three analysts have flagged the same issue in three different ways: the summaries are fluent, well-structured, and wrong in ways that aren&apos;t immediately visible. One analyst escalated a claim using a policy clause the AI cited — and it was overridden in a 2022 amendment that lives in a separate document the pipeline never read.</>
            : <>Rhea&apos;s team ran their first week of AI-assisted exception prep. Usage was high — 7 of 8 analysts used it. In Tuesday&apos;s review meeting, two escalation recommendations turned out to be based on summaries that missed the context from the prior week&apos;s thread. The AI had no knowledge of the prior thread because it only read the current exception ticket.</>}
        </SituationCard>
        {para(track === 'tech'
          ? "A single-document summary cannot triangulate — it can only compress. The footnote contradiction isn't a model failure or a prompt failure. It's a source coverage failure. The pipeline was designed to read the primary policy document. Amendments, case precedents, and internal guidelines live in separate files. The model summarised what it was given. What it was given was incomplete."
          : "The model never tells you what it's missing. It fills every gap with plausible-sounding content. When the exception ticket is the only input, the model produces a competent summary of the exception ticket. It has no mechanism to ask for the prior thread — and no way to signal that its output is missing three weeks of context."
        )}
        {keyBox('Why single-source research pipelines fail', [
          "Policy ecosystems are multi-document: primary policy + amendments + case precedents + internal guidelines rarely live in one file. A pipeline that reads one document is reading one snapshot of a larger system.",
          "The model never signals incomplete context — it produces fluent output regardless. Confident tone is not evidence of completeness. Fluent and incomplete is harder to catch than broken.",
          "Triangulation requires explicit pipeline architecture: run targeted extractions per source, then a synthesis step that surfaces agreements and flags conflicts across sources.",
          "The question 'what sources belong in this research type?' must be answered by a human before the pipeline is built — it cannot be inferred by the model from the query.",
          "Source coverage is a design decision, not a prompt instruction. Telling the model to 'be comprehensive' does not cause it to read files it was never given.",
        ], ACCENT)}
        <GenAIConversationScene
          mentor={track === 'non-tech' ? 'kabir' : 'anika'}
          track={track}
          accent={track === 'non-tech' ? '#0F766E' : '#7C3AED'}
          techLines={[
            { speaker: 'protagonist', text: "The pipeline is working. Analysts are using it. But I'm getting flagged on output quality — the summaries read perfectly." },
            { speaker: 'mentor', text: "Show me the pipeline. Walk me through what goes into the prompt." },
            { speaker: 'protagonist', text: "We pull the primary policy document, pass it to Claude, ask for a structured summary with the key clauses and any exceptions noted." },
            { speaker: 'mentor', text: "One document. You're building a research tool on one document per query." },
            { speaker: 'protagonist', text: "It's the authoritative source. Why would I need more?" },
            { speaker: 'mentor', text: "Because policy documents get amended. Amendments live in separate files. Precedents live in case histories. Your pipeline is summarising one snapshot of a policy ecosystem, not the ecosystem." },
            { speaker: 'protagonist', text: "So the pipeline needs to pull all of those?" },
            { speaker: 'mentor', text: "It needs to triangulate them. Run targeted extractions per source, then a synthesis step that surfaces where they agree and flags where they conflict. Right now you have a compression tool dressed up as a research tool." },
            { speaker: 'protagonist', text: "But if I pull five documents into one prompt, the context window gets unwieldy." },
            { speaker: 'mentor', text: "Then you don't pull five documents into one prompt. You run five targeted extractions and feed a synthesis prompt the outputs. Research is a pipeline, not a single call." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "The adoption was great. But Tuesday's meeting was a disaster — two recommendations were wrong because the AI didn't know about the prior week's context." },
            { speaker: 'mentor', text: "What did you give the AI to work with?" },
            { speaker: 'protagonist', text: "The current exception ticket. That's everything the analyst has in front of them." },
            { speaker: 'mentor', text: "Is the current ticket actually everything relevant to the decision?" },
            { speaker: 'protagonist', text: "Well — no. There's usually a thread. Prior actions, previous escalations. But that's all in the history." },
            { speaker: 'mentor', text: "So your AI is making recommendations based on one data point, and you're surprised it misses context that lives somewhere else." },
            { speaker: 'protagonist', text: "I thought the model was smart enough to ask for more context if it needed it." },
            { speaker: 'mentor', text: "The model never tells you what it doesn't have. It fills gaps with plausible-sounding content. Research means giving it all the relevant sources, not the most obvious one." },
            { speaker: 'protagonist', text: "So I need to pull the prior thread into the prompt too?" },
            { speaker: 'mentor', text: "You need to decide which sources belong in the research pipeline for this exception type — current ticket, prior thread, relevant policy clause, any open flags. Then build the pipeline to assemble those. The AI didn't fail. Your source selection did." },
          ]}
        />
        <GenAIAvatar
          name={track === 'non-tech' ? 'Kabir' : 'Anika'}
          nameColor={track === 'non-tech' ? '#0F766E' : '#7C3AED'}
          borderColor={track === 'non-tech' ? '#0F766E' : '#7C3AED'}
          conceptId="genai-m3-research"
          content={<>{track === 'tech' ? "A research pipeline that reads one document per query isn't doing research — it's doing compression. The design question is: what are all the sources that belong in this query type? That question must be answered by a human, not inferred by the model." : "The model produces plausible outputs from whatever it's given. 'Comprehensive' is a property of your source selection, not your prompt. An analyst's tacit knowledge about which sources matter is the most important thing to encode in the pipeline."}</>}
          expandedContent={track === 'tech' ? "Source coverage is an architectural decision. You cannot fix a pipeline that reads the wrong inputs by improving the prompt — the model can only work with what it receives. Map every source a senior analyst would consult for this query type, then build the pipeline to assemble those inputs before the prompt runs." : "The gap between 'AI gave me a summary' and 'AI gave me a brief I can act on' is almost always a source selection problem. A research pipeline checklist — what sources does this exception type require? — is more valuable than a better prompt."}
          question={track === 'tech' ? "Aarav's pipeline returns a confident policy summary citing three clauses. A senior analyst finds a fourth clause in an amendment document not in the pipeline. What's the correct diagnosis?" : "Rhea's Claude prompt reads only the current exception ticket. An analyst's recommendation turns out wrong because it missed the prior week's context thread. What should Rhea change first?"}
          options={track === 'tech' ? [
            { text: "The model needs a larger context window to catch more clauses", correct: false, feedback: "Context window is not the problem — the document was never passed to the model. You cannot summarise what was never given." },
            { text: "The prompt needs to explicitly ask the model to look for amendments", correct: false, feedback: "Instructing the model to look for amendments doesn't give it access to the amendment file. Source access is a pipeline design decision." },
            { text: "The pipeline is missing the amendment document as an input source", correct: true, feedback: "Correct. The amendment document belongs in the source list for this query type. The model cannot read what the pipeline doesn't provide." },
            { text: "The model's temperature is too low — it's being too conservative", correct: false, feedback: "Temperature affects creativity and variation, not source coverage. The model produces whatever it can from the inputs it receives." },
          ] : [
            { text: "Rewrite the summarisation prompt to ask for more detail", correct: false, feedback: "The prompt quality isn't the bottleneck. The issue is what data the prompt receives, not how it asks for it." },
            { text: "Add the prior exception thread as an input source to the pipeline", correct: true, feedback: "Correct. The prior thread is a required input for this exception type. Without it, the model has half the context a senior analyst would use." },
            { text: "Switch to a more capable model that handles longer context", correct: false, feedback: "Model capability isn't the bottleneck. The pipeline is missing a source — a stronger model with the same incomplete input produces the same incomplete output." },
            { text: "Ask analysts to review AI summaries before acting on them", correct: false, feedback: "Human review catches errors after the fact. The goal is to give the model correct inputs so it produces useful outputs in the first place." },
          ]}
        />
        <ApplyItBox prompt={track === 'tech' ? "Take the last claim your research assistant got wrong or incomplete. Map every document a senior analyst would actually consult for that claim type — primary policy, amendments, case precedents, internal memos. Count how many your current pipeline reads. Identify the highest-value missing source and sketch a targeted extraction step to pull it." : "Pick one exception type your team handles weekly. List every piece of context a strong analyst would pull before making a recommendation: current ticket, prior thread, relevant policy clause, any open flags. Check which of those your current Claude prompt actually receives. The gap is your pipeline redesign."} />
        <QuizEngine
          conceptId="genai-m3-research"
          conceptName="Triangulating Sources"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m3-research',
            question: QUIZZES[0].question[track],
            options: QUIZZES[0].options[track],
            correctIndex: QUIZZES[0].correctIndex[track],
            explanation: QUIZZES[0].explanation[track],
            keyInsight: QUIZZES[0].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Aarav has the right sources in the pipeline. Analysts still say the summaries aren't actionable. Next: the difference between compressing a document and compressing for a decision." : "Rhea's pipeline now reads the right sources. Analysts still re-read originals because the summaries don't tell them what to do. Next: what a decision-grade summary actually looks like."} />
      </ChapterSection>

      {/* ── SECTION 02 ── */}
      <ChapterSection id="genai-m3-compression" num="02" accentRgb={ACCENT_RGB}>
        {h2("Summarization is compression. What survives depends on what you\u2019re compressing for.")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can add a decision frame to any summarisation prompt and explain why the same source document produces different outputs for different decision types."
          : "\u25b6 After this section, you can rewrite a summary prompt to produce a brief that ends with a recommendation — not a description."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? <>Aarav fixes the source coverage problem. Three documents now feed the pipeline. Analysts say the outputs are better. But they still can&apos;t use the summaries to decide without re-reading the originals. The summaries are accurate three-bullet recaps. They&apos;re not decision support.</>
            : <>Rhea redesigns her pipeline to pull the prior thread alongside the current ticket. Her team is happier. But her director looked at last week&apos;s briefing and said: &ldquo;I can&apos;t tell if I&apos;m being asked to act on this or just informed.&rdquo; The summaries describe the situation. They don&apos;t frame the decision.</>}
        </SituationCard>
        {para(track === 'tech'
          ? "What survives summarisation depends on the compression function. 'Important clauses' and 'clauses relevant to approve/escalate/deny' compress the same document differently. The first produces a general overview. The second produces decision support. Neither is wrong — they are different specifications producing different outputs."
          : "A report gives the reader everything relevant and lets them decide. A brief gives the reader what they need to make a specific decision and says what the decision should be. If your director has to infer what you think she should do, your brief failed at its core job."
        )}
        {pullQuote(track === 'tech' ? "Accurate and unusable is worse than slightly wrong and actionable. At least the analyst knows where to push back." : "Uncertainty is an actionable output. Neutral description isn't.")}
        {keyBox(track === 'tech' ? "Compression is purposeful, not neutral" : "Brief vs. report: writing for a decision, not a reader", [
          track === 'tech'
            ? "What survives summarisation depends on the compression function. 'Important clauses' and 'clauses relevant to approve/escalate/deny' compress the same document differently."
            : "A report gives the reader everything relevant and lets them decide. A brief gives the reader what they need to make a specific decision and says what the decision should be. Those are different documents.",
          track === 'tech'
            ? "Decision-support summaries require three inputs: who is reading, what decision they're making, what information would change that decision. Without all three, you get a description."
            : "If your brief doesn't end with a recommendation or decision frame, you've written a report. That's not wrong — it's just a different document than your director asked for.",
          track === 'tech'
            ? "Parameterise the decision frame: a prompt template with a decision_type variable produces more consistent, actionable outputs than N separate prompts for each analyst role."
            : "Uncertainty is an actionable output: 'I don't have enough data to recommend action' tells the reader what's needed next. Neutral description tells them nothing.",
          track === 'tech'
            ? "The reader's job title is not enough to specify audience. A claims analyst doing first-pass triage and a claims analyst doing escalation review need different summaries of the same document."
            : "AI produces whatever output structure you specify. 'Write a summary' and 'write a brief that ends with a recommendation and a confidence level' produce completely different documents.",
          track === 'tech'
            ? "Fluent + accurate + useless is the most dangerous output type — it gets approved, acted on, and is wrong in ways the reader can't see."
            : "Comprehensiveness is a failure mode when the reader has a specific question. Every line in the brief either answers that question or it doesn't belong.",
        ], '#7C3AED')}
        <GenAIConversationScene
          mentor="rohan"
          track={track}
          accent="#2563EB"
          techLines={[
            { speaker: 'protagonist', text: "I fixed the source coverage. Three documents now. Analysts still say they can't use it to decide — they have to re-read the originals." },
            { speaker: 'mentor', text: "What does your summarisation prompt ask for?" },
            { speaker: 'protagonist', text: "'Summarise the key clauses and any exceptions in three bullet points.'" },
            { speaker: 'mentor', text: "Three bullet points of what? For who? To do what?" },
            { speaker: 'protagonist', text: "The key clauses. That's what analysts need." },
            { speaker: 'mentor', text: "What do analysts actually do with the output?" },
            { speaker: 'protagonist', text: "They decide whether to approve, escalate, or deny the claim." },
            { speaker: 'mentor', text: "Then the summary isn't for reading — it's for deciding. 'Key clauses' and 'decision-relevant clauses for approve/escalate/deny' are different prompts." },
            { speaker: 'protagonist', text: "So I need to specify the decision in the prompt?" },
            { speaker: 'mentor', text: "You need to specify the reader, the decision they're making, and what information changes that decision. Compression without a purpose function produces accurate summaries that nobody acts on." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "My director said she couldn't tell if she was being asked to act or just informed. The summaries describe the situation perfectly." },
            { speaker: 'mentor', text: "What does your director do after reading the brief?" },
            { speaker: 'protagonist', text: "She decides whether to flag anything for leadership or let the team handle it." },
            { speaker: 'mentor', text: "Does your brief tell her what you think she should do?" },
            { speaker: 'protagonist', text: "No. I didn't want to presume. I thought I should give her the facts." },
            { speaker: 'mentor', text: "Then you've written a report, not a brief. A brief compresses to a recommended action. A report compresses to a complete picture. Those are different documents." },
            { speaker: 'protagonist', text: "I'm not always sure what the recommendation should be." },
            { speaker: 'mentor', text: "Then the brief should say that — 'this week's pattern is ambiguous; here's what I'd want to know before deciding.' Uncertainty is an actionable output. Neutral description isn't." },
            { speaker: 'protagonist', text: "So the brief prompt needs to end with a recommendation?" },
            { speaker: 'mentor', text: "It needs to end with a decision frame: what is the reader being asked to do? If your director is deciding whether to escalate, the brief concludes with your read on that question. Everything above it is supporting evidence." },
          ]}
        />
        <GenAIAvatar
          name="Rohan"
          nameColor="#2563EB"
          borderColor="#2563EB"
          conceptId="genai-m3-compression"
          content={<>{track === 'tech' ? "A summarisation prompt that doesn't specify the decision is a compression function with an undefined purpose. The output is accurate in the same way a phone book is accurate — complete, useless for any specific action." : "Every brief has an implied recommendation, even when you don't write it. The question is whether the reader can find it. If your director has to infer what you think she should do, your brief failed at its core job."}</>}
          expandedContent={track === 'tech' ? "Parameterise the decision frame as a variable in your prompt template: READER, DECISION_TYPE, WHAT_CHANGES_THE_DECISION. The same summarisation function produces analyst-triage briefs and compliance-review briefs from the same sources — with different compression functions." : "The fix is structural, not cosmetic. Add three lines to your briefing prompt before the instruction: READER (your director), DECISION (escalate or delegate?), RECOMMENDATION_REQUIRED (yes — end the brief with your read). Run it on last week's data and compare her response."}
          question={track === 'tech' ? "Aarav's prompt says 'summarise the key clauses in three bullets.' Analysts say the output is accurate but they can't use it to decide. What is the most targeted fix?" : "Rhea's brief describes the exception backlog accurately. Her director says she can't tell what she's being asked to do. What does Rhea need to add to the drafting prompt?"}
          options={track === 'tech' ? [
            { text: "Increase the number of bullets from three to five", correct: false, feedback: "More bullets produce more information, not more actionability. The problem is that the output has no decision frame — five accurate bullets without one are still unusable." },
            { text: "Add the decision the analyst is making as a parameter to the prompt", correct: true, feedback: "Correct. Adding the decision type (approve/escalate/deny) transforms the compression function. The model selects and weights information differently when it knows what decision the output serves." },
            { text: "Use a stronger model that produces more decision-oriented outputs", correct: false, feedback: "Model capability isn't the bottleneck. A stronger model produces a more fluent version of the same purposeless summary without a decision frame." },
            { text: "Add few-shot examples of good summaries to the prompt", correct: false, feedback: "Few-shot examples help with format and style. They don't introduce a decision frame unless the examples themselves demonstrate decision-oriented structure." },
          ] : [
            { text: "Make the brief longer and more detailed", correct: false, feedback: "Length doesn't create actionability. A longer description is still a description." },
            { text: "Add a section listing all open exceptions", correct: false, feedback: "A comprehensive list of exceptions is a report, not a brief. The director already has access to the exception list." },
            { text: "Add a decision frame and recommendation to the end of the output structure", correct: true, feedback: "Correct. A brief without a recommendation leaves the reader to infer your position. The decision frame — what is the director being asked to decide, and what do you recommend — is the core output of a brief." },
            { text: "Switch to a model better suited to executive communication", correct: false, feedback: "Model selection doesn't solve a structural prompt problem. Both models will produce a description if the prompt asks for a description." },
          ]}
        />
        <ApplyItBox prompt={track === 'tech' ? "Take your current summarisation prompt. Add three lines before the instruction: READER: [who uses this output], DECISION: [what they're deciding], CHANGES_DECISION_IF: [what information would flip the outcome]. Rewrite the instruction to produce an output that serves that decision. Compare analyst feedback on the old vs. new version." : "Take last week's exception brief. Identify the one recommendation you were implicitly making but didn't state. Rewrite the final section to state it explicitly with a confidence level (High/Medium/Low) and the one piece of information that would change your read. Send the rewritten version to your director and note the difference in how she responds."} />
        <QuizEngine
          conceptId="genai-m3-compression"
          conceptName="Compression vs Transcription"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m3-compression',
            question: QUIZZES[1].question[track],
            options: QUIZZES[1].options[track],
            correctIndex: QUIZZES[1].correctIndex[track],
            explanation: QUIZZES[1].explanation[track],
            keyInsight: QUIZZES[1].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Aarav's summaries now serve the analyst's decision. But two analysts running the same query still get different outputs. The problem is upstream of the model — in how the query itself is formed." : "Rhea's briefs now end with a recommendation. But her regional manager keeps sending them back with 'too much — what do I do with this?' The problem is not in the summary. It's in the question she's answering."} />
      </ChapterSection>

      {/* ── SECTION 03 ── */}
      <ChapterSection id="genai-m3-5w1h" num="03" accentRgb={ACCENT_RGB}>
        {h2("5W1H isn\u2019t a checklist for the output. It\u2019s a diagnostic for the brief before you write a word.")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can convert any open-ended research query into a 5W1H-structured query template and explain why it eliminates output variance that prompt changes can't fix."
          : "\u25b6 After this section, you can run 5W1H on your reader before writing a brief — and cut every line that doesn't answer the question they actually brought to it."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? <>Aarav has been asked to build a research brief template for the claims team before they run any AI query. The request came after two analysts ran the same query and got contradictory outputs — same documents, different summaries. Aarav realises the problem isn&apos;t in the pipeline. It&apos;s in how the query is formed.</>
            : <>Rhea&apos;s Monday briefings are consistently structured now, but her regional manager sent back three in a row with the same note: &ldquo;Too much. What am I supposed to do with this?&rdquo; Rhea realises she has been answering questions her manager didn&apos;t ask.</>}
        </SituationCard>
        {para(track === 'tech'
          ? "Ambiguous queries produce variable outputs across runs — the model fills unspecified dimensions with plausible defaults that differ between calls. Two analysts asking 'the same question' with different implicit context generate different prompts. The fix is not in the prompt template. It's in the query template that generates the prompt."
          : "A brief that covers everything relevant is a report. A brief that answers one specific question is a brief. The difference is in applying 5W1H to the reader — not to the content you have — before writing anything."
        )}
        {keyBox('5W1H applied upstream of the prompt', [
          "WHO: who is the affected party in this query? (policy tier, claimant type, analyst role) — specifies the scope the model extracts for",
          "WHAT: what is the specific claim scenario or exception type? — eliminates the generic industry-overview trap",
          "WHEN: when does this policy version apply? (effective date, coverage period) — prevents the model defaulting to general policy principles",
          "WHERE: what jurisdiction, plan type, or regional context applies? — scopes the extraction to the relevant policy domain",
          "WHY: why is this being researched? what decision will this output inform? — transforms compression function from 'summarise' to 'support this decision'",
          "HOW: how will the output be used? (analyst triage / compliance review / director brief) — determines the format and level of detail",
        ], '#2563EB')}
        <GenAIConversationScene
          mentor={track === 'non-tech' ? 'kabir' : 'leela'}
          track={track}
          accent={track === 'non-tech' ? '#0F766E' : '#C2410C'}
          techLines={[
            { speaker: 'protagonist', text: "Two analysts ran the same query on the same policy document. Completely different summaries. Same prompt, same documents, same model. I don't understand how that's possible." },
            { speaker: 'mentor', text: "What was the query?" },
            { speaker: 'protagonist', text: "'Summarise coverage dispute handling for outpatient surgery claims.'" },
            { speaker: 'mentor', text: "That query has no who. No when. No jurisdiction. No claim type. Is 'outpatient surgery' the same across all policy tiers?" },
            { speaker: 'protagonist', text: "No — there are three tiers with different coverage limits." },
            { speaker: 'mentor', text: "So the query was ambiguous. Two analysts' prompts diverged slightly in context — one probably added their claim number, one didn't. The pipeline filled the ambiguity differently." },
            { speaker: 'protagonist', text: "So the fix is a more specific query?" },
            { speaker: 'mentor', text: "The fix is a query template that forces the analyst to specify WHO is affected, WHAT claim type, WHEN the policy applies, WHERE the jurisdiction, WHY this is being researched, and HOW the output will be used. You answer those before you write the query." },
            { speaker: 'protagonist', text: "That's a form, not a prompt." },
            { speaker: 'mentor', text: "Yes. The form produces the prompt. 5W1H is a pre-query diagnostic, not a summary structure. It catches the question before it becomes a bad prompt." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "My manager sent back three briefs with 'too much — what am I supposed to do with this?' I thought I was being thorough." },
            { speaker: 'mentor', text: "What does your manager use the brief for?" },
            { speaker: 'protagonist', text: "She reviews it before the regional call. She needs to know if anything in our backlog requires her attention." },
            { speaker: 'mentor', text: "That's a specific filter: does anything here require my attention? Does your brief answer that question directly?" },
            { speaker: 'protagonist', text: "It covers everything that happened that week." },
            { speaker: 'mentor', text: "Right — you answered 'what happened' when she asked 'does anything require my attention.' Different question." },
            { speaker: 'protagonist', text: "So I should filter to escalations only?" },
            { speaker: 'mentor', text: "You should run 5W1H on the brief before writing it. WHO: your manager. WHAT: items requiring her attention. WHEN: before the regional call. WHY: so she can prepare. HOW: she'll decide whether to raise or delegate. Every sentence in the brief either answers her question or it's cut." },
            { speaker: 'protagonist', text: "That's a much shorter brief." },
            { speaker: 'mentor', text: "Yes. Short and answered is worth more than long and comprehensive." },
          ]}
        />
        {PMPrincipleBox({ label: '◈ Principle', principle: "Before writing a research brief or query, state in one sentence who is reading it, what decision they're making with it, and what would make them say 'this is exactly what I needed.' If you can't, the brief isn't ready to write." })}
        <GenAIAvatar
          name={track === 'non-tech' ? 'Kabir' : 'Leela'}
          nameColor={track === 'non-tech' ? '#0F766E' : '#C2410C'}
          borderColor={track === 'non-tech' ? '#0F766E' : '#C2410C'}
          conceptId="genai-m3-5w1h"
          content={<>{track === 'tech' ? "Query variance is almost always upstream of the model — it's in the query itself. Two analysts asking 'the same' question with different implicit contexts get different answers. 5W1H standardises the context before the prompt is written, not after." : "Comprehensiveness is a failure mode when the reader has a specific question. 5W1H forces you to state that question before you start — and then to answer only that question, with everything else cut."}</>}
          expandedContent={track === 'tech' ? "A query template that enforces 5W1H before the prompt is generated reduces output variance dramatically — not because the model changed, but because the ambiguity was removed upstream. Two analysts filling the same template get the same prompt structure, with only the case-specific values differing." : "The 'how' in 5W1H is the most neglected dimension: how will the reader use this output? That question determines format — a Slack message, a slide, a recommendation memo — not the content of what you know. Get 'how' wrong and the content is irrelevant."}
          question={track === 'tech' ? "Two analysts run the same research query and get different summaries from the same pipeline. What is the most likely root cause?" : "Rhea's brief is thorough but her manager keeps saying 'what do I do with this.' What 5W1H question is Rhea failing to answer?"}
          options={track === 'tech' ? [
            { text: "The model has high temperature, causing non-deterministic outputs", correct: false, feedback: "Temperature causes phrasing variance, not structural variance in which policy clauses are included. The query's unspecified dimensions cause structural output differences." },
            { text: "The query is ambiguous — unspecified dimensions are filled differently across runs", correct: true, feedback: "Correct. 'The same query' with different implicit contexts fills unspecified dimensions differently. Standardising the query inputs with 5W1H eliminates the variance." },
            { text: "The documents are inconsistent and produce different summaries by section priority", correct: false, feedback: "Document inconsistency would produce the same inconsistency for all analysts. Variation between analysts indicates the source is in query formation, not document quality." },
            { text: "The pipeline needs a caching layer to return consistent outputs for identical queries", correct: false, feedback: "Caching returns identical outputs for byte-identical queries — but if two analysts' queries differ at all, caching doesn't help. Fix the query before you cache it." },
          ] : [
            { text: "WHO — she does not know who her reader is", correct: false, feedback: "Rhea knows her reader — she's written for her manager before. The problem is not identifying the reader, it's identifying the reader's specific question in this context." },
            { text: "WHAT — she's answering the wrong question (what happened vs. what requires your attention)", correct: true, feedback: "Correct. Rhea is answering 'what happened this week' when her manager is asking 'does anything need my attention.' Same data source, different question, completely different brief." },
            { text: "WHERE — she's not specifying the right backlog scope", correct: false, feedback: "Scope is a secondary issue. The primary failure is that even the correctly scoped backlog is being presented as information rather than a decision filter." },
            { text: "HOW — she's not specifying the right output format", correct: false, feedback: "Format follows function. The format problem will resolve when the question being answered is correct. A well-formatted answer to the wrong question is still the wrong answer." },
          ]}
        />
        <ApplyItBox prompt={track === 'tech' ? "Take the most common research query your claims analysts run. Write out the 5W1H for it: WHO is affected (tier/type), WHAT claim scenario, WHEN the policy applies, WHERE the jurisdiction, WHY this is being researched, HOW the output is used. Convert each answer into a parameter in the query template. Run the old and new template on the same policy document and compare output consistency across three runs." : "Pull last week's brief that got the most 'too much' feedback. Write the 5W1H for your reader: WHO is reading, WHAT question are they bringing, WHEN do they need to decide, WHERE in the process does this brief land, WHY this week vs. any other, HOW will they act on it. Count how many sentences in your brief don't directly answer her question. Those are the cuts."} />
        <QuizEngine
          conceptId="genai-m3-5w1h"
          conceptName="5W1H Framework"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m3-5w1h',
            question: QUIZZES[2].question[track],
            options: QUIZZES[2].options[track],
            correctIndex: QUIZZES[2].correctIndex[track],
            explanation: QUIZZES[2].explanation[track],
            keyInsight: QUIZZES[2].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Aarav's queries are now structured. His manager asks him to demo the research assistant to the compliance team — and two days before the presentation, a compliance officer finds that three statistics in the sample outputs can't be traced to any source document." : "Rhea's briefs are now structured and targeted. She sends one to her director with a specific claim: 'Exception resolution time improved 18% since the new protocol.' A week later, the data team asks where that number came from."} />
      </ChapterSection>

      {/* ── SECTION 04 ── */}
      <ChapterSection id="genai-m3-cove" num="04" accentRgb={ACCENT_RGB}>
        {h2("Convincing is not the same as correct. COVE is how you tell the difference.")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can apply COVE to any AI output before it crosses a handoff point — and redesign the prompt to surface unverifiable claims before they reach compliance."
          : "\u25b6 After this section, you can run the verifiability check on any specific claim in a brief before forwarding it — and recognise the pattern of AI-generated statistics that sound sourced but aren't."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? <>Aarav&apos;s pipeline is producing well-structured, well-sourced summaries. His manager asks him to present the research assistant to the compliance team. Two days before the presentation, a compliance officer reviews five sample outputs and flags that three contain statistics presented as facts — with no traceable source in the documents provided.</>
            : <>Rhea sent her director a brief with a specific claim: &ldquo;Exception resolution time has improved 18% since implementing the new triage protocol.&rdquo; Her director quoted the figure in a leadership meeting. A week later, the data team asked where the 18% came from. Nobody could trace it. It came from a Claude output.</>}
        </SituationCard>
        {para(track === 'tech'
          ? "The model produces confident outputs regardless of whether the source documents support the claim. When the prompt asks for 'key metrics and outcomes,' and the documents don't contain metrics, the model generates plausible-sounding ones from training data. That's not a hallucination in the dramatic sense — it's the model completing a pattern. The prompt invited it."
          : "Specific-sounding statistics are the most dangerous AI output type: they're specific enough to sound sourced and general enough to be unfalsifiable until someone looks. The 18% figure passed the sound-right test, the confident-tone test, and the formatting test. It failed the only test that matters: can you trace it to a source?"
        )}
        {keyBox('COVE: the four-question review', [
          "Completeness: does the output cover all the dimensions the decision requires? Gaps are usually invisible — the output looks complete because it doesn't announce what it missed.",
          "Originality: did the model draw from the provided sources, or from training data? Training-data content sounds authoritative and may be outdated or jurisdiction-specific in ways that don't apply.",
          "Verifiability: every specific claim — statistic, date, policy clause, case outcome — should trace to a specific sentence in the provided documents. If it can't be found there, assume it was generated.",
          "Efficiency: is the output the right length and format for the decision? Over-length outputs bury critical information; under-length outputs omit it. Neither serves the decision.",
          "Design COVE into the prompt: ask the model to cite its source sentence for each claim. It won't catch everything, but it surfaces unverifiable claims faster than manual review.",
        ], '#0F766E')}
        <GenAIConversationScene
          mentor="leela"
          track={track}
          accent="#C2410C"
          techLines={[
            { speaker: 'protagonist', text: "Compliance flagged three of my sample outputs. They say the statistics can't be verified in the source documents. I pulled the documents — they're right. The numbers aren't there." },
            { speaker: 'mentor', text: "What was your prompt?" },
            { speaker: 'protagonist', text: "'Summarise the key metrics and outcomes referenced in these documents.'" },
            { speaker: 'mentor', text: "The documents didn't have metrics. So where did the model get them?" },
            { speaker: 'protagonist', text: "Training data, probably. Industry averages." },
            { speaker: 'mentor', text: "So your prompt asked for metrics, the documents didn't have them, and the model generated plausible ones. That's not a model failure — that's your prompt inviting a hallucination." },
            { speaker: 'protagonist', text: "How was I supposed to know the documents didn't have metrics?" },
            { speaker: 'mentor', text: "You run COVE. Verifiability first: every claim in the output should trace to a line in the input. If it can't, it's generated, not found. You review for that before the output reaches anyone downstream." },
            { speaker: 'protagonist', text: "So I need a verification step in the pipeline?" },
            { speaker: 'mentor', text: "Two things: a prompt that asks the model to cite the specific source sentence for every claim it makes, and a human review step for outputs that will be used in compliance contexts. The model can help you catch its own hallucinations if you design the prompt to surface them." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "The 18% figure came from a Claude output. I didn't check it. My director quoted it to leadership. The data team can't find the source." },
            { speaker: 'mentor', text: "How did the number get into the brief?" },
            { speaker: 'protagonist', text: "I asked Claude to 'identify any improvements since implementing the triage protocol.' It returned the 18% figure with a confident tone. It looked like analysis." },
            { speaker: 'mentor', text: "Confident tone is the danger signal, not the assurance. The more specific a number sounds, the more important it is to verify it." },
            { speaker: 'protagonist', text: "How was I supposed to know it wasn't in the data?" },
            { speaker: 'mentor', text: "COVE. Verifiability: every specific claim — especially any percentage, trend, or comparison — needs a traceable source. If you can't point to a row in your data or a line in a document, the claim doesn't go in the brief." },
            { speaker: 'protagonist', text: "That would take forever to check everything." },
            { speaker: 'mentor', text: "You don't check everything. You apply COVE selectively to claims that will be quoted. A number your director will repeat to leadership is a claim that requires verification. That's five minutes, not forever." },
            { speaker: 'protagonist', text: "What do I do about the 18% that's already out there?" },
            { speaker: 'mentor', text: "You correct it proactively — before someone else does. And you add a standing rule: any specific statistic in a brief that will be forwarded gets a source citation in parentheses. If you can't write the citation, the number doesn't go in." },
          ]}
        />
        {PMPrincipleBox({ label: '◈ Principle', principle: "Apply COVE at the handoff point — before output crosses from your workflow into someone else's decision. Completeness, Originality, Verifiability, Efficiency: four questions, five minutes, before you forward anything." })}
        <GenAIAvatar
          name="Leela"
          nameColor="#C2410C"
          borderColor="#C2410C"
          conceptId="genai-m3-cove"
          content={<>{track === 'tech' ? "The model produces confident outputs regardless of whether the source documents support the claim. Designing your prompt to require source citations for each claim doesn't eliminate hallucination — but it makes unverifiable claims visible before they reach compliance." : "Specific-sounding numbers in AI outputs are not analysis — they're pattern completion. The model generates what a statistic would look like in this context. The question is always: can you find this number in a source, or did the model produce it?"}</>}
          expandedContent={track === 'tech' ? "COVE is a 5-minute review, not a full audit. Apply it selectively to claims that will be acted on or forwarded — not to every line of every output. The highest-risk outputs are those containing specific numbers, dates, or named precedents, because they're precise enough to be acted on and authoritative-sounding enough to bypass scrutiny." : "The pattern is always the same: specific number, confident tone, no citation. Train yourself to pause on any specific statistic in an AI output and ask: where exactly does this come from? If you can't answer in 10 seconds, don't include it in a brief that will be forwarded."}
          question={track === 'tech' ? "Aarav's pipeline produces a summary citing '23% of outpatient surgery claims in this category result in secondary review.' The source documents don't contain this figure. Which COVE dimension catches this first?" : "Rhea's brief includes 'exception resolution time improved 18% since implementing the new protocol.' Her data team can't find the source. What is the correct COVE diagnosis?"}
          options={track === 'tech' ? [
            { text: "Completeness — the output missed other statistics in the documents", correct: false, feedback: "Completeness checks for missing required information, not for invented information. The issue is a claim that can't be sourced — that's a Verifiability failure." },
            { text: "Originality — the model drew the figure from training data, not the provided documents", correct: false, feedback: "Originality is the correct root-cause dimension — but Verifiability is the first practical check. If you can't verify the source, Origin doesn't matter for the immediate decision." },
            { text: "Efficiency — the statistic makes the output unnecessarily long", correct: false, feedback: "Efficiency is about length relative to the decision's needs — not about whether individual claims are accurate." },
            { text: "Verifiability — the claim cannot be traced to a specific source sentence in the inputs", correct: true, feedback: "Correct. Verifiability is the first check: trace the claim to a specific source sentence. If '23%' appears nowhere in the provided documents, the claim is model-generated regardless of how confident it sounds." },
          ] : [
            { text: "Completeness — the brief missed other improvement metrics", correct: false, feedback: "Completeness would catch missing improvement types — not a fabricated figure. The problem is that 18% is present but unverifiable, not that other metrics are absent." },
            { text: "Originality only — Claude generated a number from training patterns", correct: false, feedback: "Originality is correct — the number came from Claude's pattern completion, not Rhea's data. But B alone doesn't capture that it also failed the practical verifiability test." },
            { text: "Verifiability only — the 18% cannot be traced to a specific data source", correct: false, feedback: "Verifiability is correct as a standalone answer — but it misses that the root cause is model generation, not just a missing citation." },
            { text: "Both Originality and Verifiability — the number is model-generated AND unverifiable", correct: true, feedback: "Correct. The 18% figure fails on two dimensions: Originality (generated, not retrieved) and Verifiability (cannot be traced to a source). Both flags should have triggered review before forwarding." },
          ]}
        />
        <ApplyItBox prompt={track === 'tech' ? "Take three outputs from your current research pipeline. For each, run COVE: (1) list the specific claims the output makes; (2) attempt to trace each claim to a specific sentence in the source documents; (3) flag any claim that can't be traced. Count the unverifiable claims per output. If it's more than one, redesign the prompt to ask the model to cite its source for each claim it makes." : "Pull the last brief you forwarded to your director. Identify every specific number, percentage, or trend statement in it. For each, spend 60 seconds trying to find the source in your data or documents. Mark each as Verified, Unverified, or Model-generated. Any Unverified or Model-generated claim that was forwarded is a process gap — decide what review step would catch it next time."} />
        <QuizEngine
          conceptId="genai-m3-cove"
          conceptName="COVE Evaluation"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m3-cove',
            question: QUIZZES[3].question[track],
            options: QUIZZES[3].options[track],
            correctIndex: QUIZZES[3].correctIndex[track],
            explanation: QUIZZES[3].explanation[track],
            keyInsight: QUIZZES[3].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Aarav now has a COVE-checked pipeline that compliance has approved. The last problem: his manager says the outputs 'read like technical documents.' The research is correct. The audience fit is wrong." : "Rhea's pipeline now produces COVE-verified briefs. The final step: she's sending the same brief to three different audiences. Her regional manager still doesn't respond."} />
      </ChapterSection>

      {/* ── SECTION 05 ── */}
      <ChapterSection id="genai-m3-draft" num="05" accentRgb={ACCENT_RGB}>
        {h2("Drafting from synthesis: the audience decides what matters, not the content.")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can write an audience profile for three different readers of the same research output and parameterise a drafting prompt so one synthesis produces three different briefs."
          : "\u25b6 After this section, you can design a briefing workflow where one synthesis feeds three different audience-specific drafting prompts — so your team, your director, and your regional manager each receive the brief they actually need."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? <>Aarav is building the final stage of the research pipeline — the drafting step. He has a synthesis prompt that produces a comprehensive, COVE-checked output from the triangulated sources. His manager says it reads like a technical document, not a decision brief. Aarav realises he has been designing for content completeness, not audience fit.</>
            : <>Rhea&apos;s pipeline now runs research, validates sources, and produces a structured summary. The final step is drafting the brief. She has three different audiences: her team (operational detail), her director (escalation decisions), her regional manager (strategic flags). She has been sending the same brief to all three.</>}
        </SituationCard>
        {para(track === 'tech'
          ? "The same synthesis produces different briefs for different audiences — not because the facts changed but because different roles filter for different signals. Technical accuracy and audience fit are orthogonal. A technically accurate document that doesn't fit the audience's decision context is worse than no document — it creates false confidence."
          : "One synthesis document is the source of truth. Three drafting prompts with different audience parameters produce three different briefs from the same underlying research. The work of drafting is deciding what the audience needs, not what the content contains."
        )}
        {keyBox(track === 'tech' ? "Audience parameters for a drafting prompt" : "Three audiences, three drafts, one synthesis", [
          track === 'tech'
            ? "AUDIENCE (role/title): specifies who is reading. 'Claims analyst' and 'VP of Operations' need different language density, different assumed prior knowledge, different action verbs."
            : "One synthesis, three audience-parameterised prompts. The AI drafts each brief. The human designs the audience profiles. Those are different jobs — only one of them can be delegated.",
          track === 'tech'
            ? "PRIOR_KNOWLEDGE: what does this audience already know about this topic? A compliance officer doesn't need the policy explained. An analyst on their first week does."
            : "Your team needs operational detail: what to do, in what order, with what exceptions. Your director needs decision triggers: what escalates, what doesn't, your recommendation.",
          track === 'tech'
            ? "DECISION: what will this audience decide after reading? The answer determines which information is foregrounded and which is supporting evidence."
            : "Your regional manager needs pattern signals: what in your data has cross-region implications. That's a completely different filter on the same source material.",
          track === 'tech'
            ? "FORMAT: how will the audience consume it? Async read, meeting prep, quick scan. The same content packaged as a narrative, a table, and a bullet list gets used differently."
            : "Format is audience too: your team reads in Slack, your director reads in a doc, your regional manager reads in a summary table. The same content packaged differently gets used differently.",
          track === 'tech'
            ? "The model drafts for whatever audience you specify. If you don't specify one, it defaults to 'general reader' — which serves nobody in a professional decision context."
            : "The audience question is: what decision are they making, and what do they already know? Every other specification follows from those two answers.",
        ], '#C2410C')}
        <GenAIConversationScene
          mentor="anika"
          track={track}
          accent="#7C3AED"
          techLines={[
            { speaker: 'protagonist', text: "The synthesis output is comprehensive — all sources covered, COVE-checked, structured. My manager says it reads like a technical document and she can't use it in a stakeholder meeting." },
            { speaker: 'mentor', text: "What does your drafting prompt say?" },
            { speaker: 'protagonist', text: "'Synthesise the research into a comprehensive brief covering all key findings.'" },
            { speaker: 'mentor', text: "Comprehensive to a platform engineer and comprehensive to a VP of Operations are different documents. Your prompt has no audience." },
            { speaker: 'protagonist', text: "I specify the topic. Isn't that enough context?" },
            { speaker: 'mentor', text: "No. The same topic requires different language, different detail level, different structure depending on who decides with it. A comprehensive brief for an engineer has API references and edge cases. A stakeholder brief has implications, risks, and a recommended action." },
            { speaker: 'protagonist', text: "So I need a different prompt for each audience?" },
            { speaker: 'mentor', text: "Or one prompt with audience as a parameter: AUDIENCE, PRIOR_KNOWLEDGE, DECISION, FORMAT. Feed the same synthesis into different audience frames and you get different briefs. The content doesn't change — the lens does." },
            { speaker: 'protagonist', text: "That means I need to know my audiences well enough to specify those parameters." },
            { speaker: 'mentor', text: "That's the work. The AI drafts from whatever frame you give it. Specifying the audience is not an AI problem — it's a product design problem." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "I've been sending the same brief to my team, my director, and my regional manager. My team finds it too high-level. My manager finds it useful. My regional manager hasn't responded in two weeks." },
            { speaker: 'mentor', text: "What does your regional manager do with the brief, when she does respond?" },
            { speaker: 'protagonist', text: "She flags anything with cross-region implications for a leadership discussion." },
            { speaker: 'mentor', text: "So she needs a brief filtered to cross-region patterns, not a summary of your team's week." },
            { speaker: 'protagonist', text: "My team's week is all I have." },
            { speaker: 'mentor', text: "Your team's week contains signals about cross-region patterns. A brief for your regional manager extracts those signals and frames them as implications — not your team's operations." },
            { speaker: 'protagonist', text: "That's a fundamentally different brief." },
            { speaker: 'mentor', text: "Yes. Drafting from synthesis means the synthesis is the raw material — what you build from it depends entirely on who's reading and what they do with it. One synthesis, three drafts, three prompts." },
            { speaker: 'protagonist', text: "So the AI writes three different versions from the same underlying research?" },
            { speaker: 'mentor', text: "Yes. You design the audience profiles. The AI drafts from them. The work of drafting is deciding what the audience needs — not what the content contains." },
          ]}
        />
        {PMPrincipleBox({ label: '◈ Principle', principle: "Design three audience profiles before you write one drafting prompt: who reads it, what they already know, what decision they're making, how they'll consume it. The model drafts from the profile, not from the content." })}
        <GenAIAvatar
          name="Anika"
          nameColor="#7C3AED"
          borderColor="#7C3AED"
          conceptId="genai-m3-draft"
          content={<>{track === 'tech' ? "Comprehensive briefs that don't fit the audience's decision context are worse than no brief — they create false confidence. Audience design is a product problem that happens before the model drafts anything." : "One synthesis, three drafts. The work isn't in the AI — it's in knowing your audiences well enough to specify what each of them needs. That knowledge can't be delegated to the model."}</>}
          expandedContent={track === 'tech' ? "Technical accuracy and audience fit are orthogonal. You can have both, either, or neither. The model produces technically accurate content easily. Audience fit requires you to specify the audience precisely enough that the model knows what to foreground, what to background, and what to cut." : "The gap between 'I sent a brief' and 'she responded to the brief' is almost always an audience fit problem. Your regional manager's silence is data — it means the brief isn't answering her question. The fix is an audience profile, not a better synthesis."}
          question={track === 'tech' ? "Aarav's synthesis prompt produces technically accurate briefs. His manager says they 'read like technical documents.' What is the most targeted fix?" : "Rhea sends the same brief to her team, director, and regional manager. Team says too high-level, regional manager never responds. What is the root cause?"}
          options={track === 'tech' ? [
            { text: "The synthesis needs to be shorter before drafting begins", correct: false, feedback: "Length is a symptom of missing audience specification, not the root cause. A shorter technical document is still a technical document." },
            { text: "The drafting prompt needs an audience parameter specifying who reads it and what decision they make", correct: true, feedback: "Correct. Adding audience — role, prior knowledge, decision, format — transforms the same synthesis into a brief the audience can actually use. The model drafts for whatever frame it's given." },
            { text: "The model needs few-shot examples of stakeholder briefs", correct: false, feedback: "Few-shot examples improve format consistency. They don't introduce audience fit unless the examples themselves are for the right audience." },
            { text: "The manager needs training on how to read technical briefs", correct: false, feedback: "The audience doesn't adapt to the document — the document adapts to the audience. That's the design principle." },
          ] : [
            { text: "The brief needs to be longer to serve all three audiences simultaneously", correct: false, feedback: "One longer brief serving all three audiences is not audience design — it's information overload for all three. A brief that tries to serve everyone serves nobody." },
            { text: "Rhea should write three separate briefs manually for each audience", correct: false, feedback: "Manually writing three briefs defeats the point of the pipeline. The goal is one synthesis, three audience-parameterised drafting prompts, three AI-drafted briefs." },
            { text: "The drafting prompt needs an audience parameter — one synthesis, three audience profiles, three separate prompts", correct: true, feedback: "Correct. The root cause is that one drafting prompt can't serve three audiences. Three audience profiles — each specifying who reads, what they know, what they decide, how they read — produce three useful briefs from the same research." },
            { text: "The regional manager is the problem — she doesn't engage with written briefs", correct: false, feedback: "The regional manager's silence is data, not a personality problem. She's not responding because the brief isn't answering her question. Fix the audience profile before diagnosing the reader." },
          ]}
        />
        <ApplyItBox prompt={track === 'tech' ? "Identify the three most different audiences for your research pipeline outputs (e.g., claims analyst, compliance officer, product manager). Write an AUDIENCE PROFILE for each: role, prior knowledge of the claim type, decision they make from the brief, format they use. Build a drafting prompt template where audience is a variable. Run the same synthesis through all three profiles and compare — which output would actually be used, and why?" : "Pick the brief you send to your regional manager that she never responds to. Write her AUDIENCE PROFILE: her role, what she already knows about your team's operations, the one decision she makes from your briefs, how she reads it (morning scan / pre-meeting prep). Rewrite the drafting prompt to produce a brief for that profile specifically — filtering to cross-region signals, framing as implications, ending with a flag or 'no action needed.' Send it and note the response rate change."} />
        <QuizEngine
          conceptId="genai-m3-draft"
          conceptName="Audience-First Drafting"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m3-draft',
            question: QUIZZES[4].question[track],
            options: QUIZZES[4].options[track],
            correctIndex: QUIZZES[4].correctIndex[track],
            explanation: QUIZZES[4].explanation[track],
            keyInsight: QUIZZES[4].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Aarav now has a research pipeline that triangulates, compresses for decisions, applies 5W1H upstream, passes COVE, and drafts for audiences. Next module: wiring the whole thing into an automated workflow so analysts stop copy-pasting into ChatGPT." : "Rhea's research workflow now produces COVE-verified, audience-specific briefs. Next module: automating the plumbing around the AI calls so the workflow runs on its own every Monday morning."} />
      </ChapterSection>
    </>
  );
}

export default function GenAIPreRead3({ track, onBack }: Props) {
  const store = useLearnerStore();
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const prevXpRef = useRef(0);

  useEffect(() => {
    store.initSession();
    CONCEPTS.forEach((concept) => store.ensureConceptState(concept.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.getAttribute('data-section');
        if (!sectionId) return;
        if (entry.isIntersecting) {
          if (entry.intersectionRatio >= 0.1) setActiveSection(sectionId);
          if (entry.intersectionRatio >= 0.25) {
            setCompletedSections((prev) => new Set([...prev, sectionId]));
            store.markSectionViewed(sectionId);
          }
        }
      });
    }, { threshold: [0.1, 0.25, 0.5] });

    const timer = setTimeout(() => {
      document.querySelectorAll('[data-section]').forEach((el) => observer.observe(el));
    }, 150);

    return () => { clearTimeout(timer); observer.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressPct = Math.round((completedSections.size / SECTIONS.length) * 100);

  return (
    <div className="editorial" style={{ background: 'var(--ed-cream)', minHeight: '100vh' }}>
      {/* Top Nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
              <motion.button whileHover={{ opacity: 0.75 }} whileTap={{ scale: 0.97 }} onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', cursor: 'pointer', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>&larr;</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)', fontFamily: "'JetBrains Mono', monospace" }}>Back</span>
              </motion.button>
              <span style={{ color: 'var(--ed-rule)', fontSize: '18px' }}>|</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: `linear-gradient(135deg, ${ACCENT} 0%, #0369A1 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 8px rgba(${ACCENT_RGB},0.3)` }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', fontWeight: 800, color: 'var(--ed-ink)', lineHeight: 1 }}>Airtribe</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 600, color: 'var(--ed-ink3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Learn</div>
                </div>
              </div>
              <span style={{ color: 'var(--ed-rule)', fontSize: '18px' }}>|</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>GenAI Launchpad</span>
                <span style={{ color: 'var(--ed-rule)', fontSize: '12px' }}>&rsaquo;</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink2)' }}>{TRACK_META[track].introTitle}</span>
              </div>
            </div>
            <div style={{ flex: 1, maxWidth: '240px', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 24px' }}>
              <div style={{ flex: 1, height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: ACCENT, borderRadius: '2px' }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: ACCENT, flexShrink: 0 }}>{progressPct}%</span>
            </div>
            <div style={{ width: '80px', flexShrink: 0 }} />
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px minmax(0, 1fr) 240px', gap: '40px', alignItems: 'start', paddingTop: '36px' }}>
          <div style={{ alignSelf: 'stretch' }}>
            <LeftNav completedSections={completedSections} activeSection={activeSection} />
          </div>
          <motion.main initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} style={{ minWidth: 0 }}>
            <CoreContent track={track} />
            <AnimatePresence>
              {progressPct >= 80 ? (
                <motion.div initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} style={{ padding: '40px 32px', background: 'var(--ed-card)', borderRadius: '10px', textAlign: 'center' as const, position: 'relative', overflow: 'hidden', marginBottom: '40px', border: '1px solid var(--ed-rule)', borderTop: `4px solid ${ACCENT}` }}>
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: '40px', marginBottom: '14px' }}>&#9678;</motion.div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px', color: 'var(--ed-ink)', fontFamily: "'Lora', 'Georgia', serif" }}>Pre-Read 03 Complete</h3>
                  <p style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.8, maxWidth: '430px', margin: '0 auto 24px' }}>
                    {track === 'tech' ? 'You now have the research pipeline toolkit: triangulated source architecture, decision-framed compression, 5W1H query templates, COVE evaluation, and audience-parameterised drafting.' : 'You now know how to build a research workflow that saves real hours: source selection, decision-grade summarisation, 5W1H briefing, COVE verification, and audience-specific drafting.'}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <div style={{ height: '60px' }} />
          </motion.main>
          <div style={{ alignSelf: 'stretch' }}>
            <Sidebar completedSections={completedSections} progressPct={progressPct} prevXp={prevXpRef.current} />
          </div>
        </div>
      </div>
    </div>
  );
}

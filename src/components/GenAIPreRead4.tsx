'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import GenAIStreakCard, { GenAILatestBadgePanel } from './GenAISidebarExtras';
import QuizEngine from './QuizEngine';
import GenAIAvatar, { GenAIMentorFace, GenAIConversationScene, AaravFace, RheaFace } from './GenAIAvatar';
import type { GenAIMentorId } from './GenAIAvatar';
import type { GenAITrack } from './genaiTypes';
import {
  ApplyItBox, ChapterSection, NextChapterTeaser, PMPrincipleBox, SituationCard,
  TiltCard, chLabel, h2, keyBox, para, pullQuote,
} from './pm-fundamentals/designSystem';

const ACCENT = '#0F766E';
const ACCENT_RGB = '15,118,110';
const MODULE_NUM = '04';

const CONCEPTS = [
  { id: 'genai-m4-mindset', label: 'Workflow Mindset',   color: '#0F766E' },
  { id: 'genai-m4-nodes',   label: 'Triggers & Nodes',   color: '#7C3AED' },
  { id: 'genai-m4-connect', label: 'Auth & Trust',        color: '#2563EB' },
  { id: 'genai-m4-errors',  label: 'Error Handling',      color: '#C2410C' },
  { id: 'genai-m4-e2e',     label: 'End-to-End Thinking', color: '#0891B2' },
];

const SECTIONS = [
  { id: 'genai-m4-mindset', label: '1. The Workflow Mindset' },
  { id: 'genai-m4-nodes',   label: '2. Triggers, Nodes & Data Flow' },
  { id: 'genai-m4-connect', label: '3. Credentials & Auth' },
  { id: 'genai-m4-errors',  label: '4. Error Handling' },
  { id: 'genai-m4-e2e',     label: '5. First End-to-End Workflow' },
];

const BADGES = [
  { id: 'genai-m4-mindset', icon: '🧠', label: 'Node Thinker',   color: '#0F766E', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'genai-m4-nodes',   icon: '🔀', label: 'Flow Architect', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  { id: 'genai-m4-connect', icon: '🔐', label: 'Auth Aware',      color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { id: 'genai-m4-errors',  icon: '🚨', label: 'Error Handler',   color: '#C2410C', bg: '#FFF7ED', border: '#FED7AA' },
  { id: 'genai-m4-e2e',     icon: '🚀', label: 'End-to-End',      color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC' },
];

const QUIZZES = [
  {
    conceptId: 'genai-m4-mindset',
    question: {
      tech: "Aarav wants to start building the AI classification node. Rohan asks him to do something first. What?",
      'non-tech': "Rhea asks where the AI goes in her automation workflow. Kabir doesn't answer. What does he ask instead?",
    },
    options: {
      tech: [
        'A. Choose between OpenAI and Anthropic for the AI node',
        'B. Document the current manual process node by node — input schema and output contract',
        'C. Get sign-off from compliance before automating exception handling',
        'D. Set up n8n credentials before mapping the workflow',
      ],
      'non-tech': [
        'A. What AI model Rhea wants to use',
        'B. How many exceptions the team processes per week',
        "C. What Rhea does between 7am Monday and the moment she hits send — the full manual process",
        'D. Whether Rhea has n8n access set up already',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 2 },
    explanation: {
      tech: "The workflow spec — current process, input schema, output contract, edge cases — is the prerequisite. Building the AI node first produces a fast solution to an undefined problem.",
      'non-tech': "Kabir maps the manual process before touching n8n — because automation of a fuzzy process produces a fast, fuzzy automated process. The manual steps are the workflow spec.",
    },
    keyInsight: "Automation is about reliable data plumbing first. The AI node is one step in a pipeline, not the pipeline itself.",
  },
  {
    conceptId: 'genai-m4-nodes',
    question: {
      tech: "Aarav builds: Email Trigger → AI Classify → Slack Notify. The Slack node fails with 'invalid data.' The AI node returns a JSON string, not an object. What is the root cause?",
      'non-tech': "Rhea's workflow runs but the Google Sheet never updates. The Write node shows green (success) but the sheet is blank. What should she check first?",
    },
    options: {
      tech: [
        'A. The Slack node API has changed and needs updating',
        'B. A JSON Parse node is missing between AI Classify and Slack Notify — the data shape does not match',
        'C. The AI node temperature is too high, causing malformed JSON',
        'D. The Email Trigger is passing the wrong fields to the AI node',
      ],
      'non-tech': [
        'A. Google Sheets permissions need to be re-granted',
        'B. The Write node is mapped to the wrong column in the sheet',
        'C. The node before the Write node is passing empty fields — the Write node succeeded in writing nothing',
        'D. The workflow needs to be re-activated after adding the Write node',
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 2 },
    explanation: {
      tech: "Most n8n failures at the boundary between an AI node and a downstream node are data shape mismatches — the AI returns a string, downstream expects an object. A Parse or Set node in between transforms the shape.",
      'non-tech': "Green nodes confirm execution, not correct output. A Write node that receives empty fields writes empty fields successfully. The bug is in the upstream node, not the Write node.",
    },
    keyInsight: "Green nodes confirm execution, not correct output. Data shape errors between nodes are the most common source of silent failures.",
  },
  {
    conceptId: 'genai-m4-connect',
    question: {
      tech: "Aarav creates an n8n credential for the OpenAI API using the team's shared API key. Rohan asks him to change it. Why?",
      'non-tech': "Rhea's assistant sets up the Google Sheets credential using Rhea's personal Google account. Kabir says this is a problem. What is the risk?",
    },
    options: {
      tech: [
        "A. Shared API keys can't be used in n8n credentials",
        'B. A shared key means any workflow run by any team member is billed to the same budget with no per-workflow cost tracking or rotation capability',
        'C. OpenAI rate limits are per-key, so a shared key will hit limits faster',
        'D. Rohan prefers service accounts for all API connections',
      ],
      'non-tech': [
        "A. Personal Google accounts can't be used for Google Sheets in n8n",
        "B. If Rhea leaves the company or changes her password, the workflow breaks and no one else can fix it without re-credentialing",
        'C. Personal accounts have lower Google Sheets API rate limits',
        "D. The workflow will only run when Rhea is logged in",
      ],
    },
    correctIndex: { tech: 1, 'non-tech': 1 },
    explanation: {
      tech: "Shared API keys are a cost, security, and rotation problem: every workflow uses the same budget pool, you can't audit per-workflow usage, and rotating the key breaks everything at once. Service accounts per workflow solve this.",
      'non-tech': "Personal account credentials create a single point of failure. When the person changes their password, enables 2FA, or leaves — the workflow breaks. Team-owned service credentials are the correct design.",
    },
    keyInsight: "Credentials are infrastructure. Personal credentials in production workflows are a single point of failure waiting to happen.",
  },
  {
    conceptId: 'genai-m4-errors',
    question: {
      tech: "Aarav's workflow runs overnight. In the morning, 14 of 22 exceptions were classified and routed. 8 are missing. The workflow shows no errors. What is the most likely design gap?",
      'non-tech': "Rhea's Monday report workflow ran, sent the email, but the email body was empty. Nobody noticed until her director asked at 10am. What is the process gap?",
    },
    options: {
      tech: [
        "A. The AI classification node timed out on 8 exceptions and the workflow skipped them silently",
        'B. The email trigger only captured 14 of 22 exceptions',
        'C. The Slack notification failed and the exceptions are in a dead-letter queue',
        'D. n8n has an execution limit that capped the run at 14 items',
      ],
      'non-tech': [
        'A. The Google Sheets connection failed and the data was not available for the summary',
        'B. The workflow has no output validation step — it sent whatever the AI produced, including empty output, without checking it first',
        'C. Claude produced an empty output because the input data was malformed',
        "D. The email node sent successfully but the recipient's email client stripped the body",
      ],
    },
    correctIndex: { tech: 0, 'non-tech': 1 },
    explanation: {
      tech: "Silent skips are an error handling design gap: the node errored, the workflow's error mode was set to 'continue,' and 8 items were dropped without any alert or dead-letter mechanism. Always design explicit failure paths.",
      'non-tech': "The workflow sent successfully — an empty output is a correct execution of the wrong design. Output validation before the send step catches empty, malformed, or too-short outputs and either retries or alerts instead of sending.",
    },
    keyInsight: "Success means the workflow executed. It does not mean the output was correct. Output validation before handoff is a required step, not an optional one.",
  },
  {
    conceptId: 'genai-m4-e2e',
    question: {
      tech: "Aarav's first end-to-end workflow succeeds on a real exception. He marks it production-ready. Rohan asks one question before signing off. What is it?",
      'non-tech': "Rhea's Monday report workflow works on test data. She is ready to run it live. Kabir asks her to run one more test. What kind?",
    },
    options: {
      tech: [
        'A. What happens when the AI classification returns a low-confidence result?',
        'B. How long does the workflow take to run on a single exception?',
        'C. Does the Slack notification render correctly on mobile?',
        'D. Is the workflow connected to the right n8n environment?',
      ],
      'non-tech': [
        "A. Run it on last week's real data and compare the output to the manual report she wrote",
        'B. Test it with an empty dataset to confirm it handles the edge case',
        'C. Run it twice to confirm it is idempotent',
        'D. Check that the email address is correct before going live',
      ],
    },
    correctIndex: { tech: 0, 'non-tech': 0 },
    explanation: {
      tech: "Happy path success is not production readiness. The failure case — low-confidence classification — is the most important path to design. What does the workflow do when the AI isn't sure? That decision must exist before go-live.",
      'non-tech': "Comparing AI output to a manually produced baseline is the most direct quality check. If the AI-generated Monday report wouldn't have told Rhea what she needed to know last week, it's not production-ready.",
    },
    keyInsight: "Test the failure path as rigorously as the success path. Production readiness means you know what the workflow does when it goes wrong.",
  },
];

const SECTION_XP = 50;
const QUIZ_XP = 100;

const TRACK_META: Record<GenAITrack, { label: string; introTitle: string; moduleContext: string }> = {
  'non-tech': {
    label: 'Workflow & Operator Track',
    introTitle: 'Workflow Automation with n8n · Operator Lens',
    moduleContext: `GenAI Launchpad · Non-Tech Track · Pre-Read 04 · Workflow Automation with n8n. Follows Rhea, an operations lead at Northstar Health, as she automates her Monday exception summary — and discovers that the AI call is one node in a pipeline, and the rest of the pipeline is what determines whether the output is ever used.`,
  },
  tech: {
    label: 'Tech Builder Track',
    introTitle: 'Workflow Automation with n8n · Builder Lens',
    moduleContext: `GenAI Launchpad · Tech Track · Pre-Read 04 · Workflow Automation with n8n. Follows Aarav, a platform engineer at Northstar Health, as he builds the first automated exception classification workflow — and learns that the AI node is three lines of a thirty-line workflow spec, and the other twenty-seven lines determine everything.`,
  },
};

type Props = { track: GenAITrack; onBack: () => void };

function computeXP(completedSections: Set<string>, conceptStates: Record<string, { pKnow: number }>) {
  const readingXP = completedSections.size * SECTION_XP;
  const quizXP = Object.values(conceptStates).reduce((sum, s) => sum + Math.round(s.pKnow * QUIZ_XP), 0);
  return { readingXP, quizXP, total: readingXP + quizXP };
}

function getLevel(total: number) {
  if (total >= 600) return { label: 'Builder',  color: '#0F766E', min: 600 };
  if (total >= 350) return { label: 'Operator', color: '#2563EB', min: 350 };
  if (total >= 150) return { label: 'Explorer', color: '#0F766E', min: 150 };
  return { label: 'Curious', color: 'var(--ed-ink3)', min: 0 };
}

function getNextLevel(total: number) {
  if (total < 150) return { label: 'Explorer', min: 150 };
  if (total < 350) return { label: 'Operator', min: 350 };
  if (total < 600) return { label: 'Builder',  min: 600 };
  return null;
}

function LeftNav({ completedSections, activeSection }: { completedSections: Set<string>; activeSection: string | null }) {
  const donePct = Math.round((completedSections.size / SECTIONS.length) * 100);
  return (
    <aside style={{ position: 'sticky', top: '80px', alignSelf: 'start' }}>
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
    <aside style={{ position: 'sticky', top: '80px', alignSelf: 'start', display: 'flex', flexDirection: 'column' as const, gap: '14px' }}>
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
                  <span style={{ fontSize: '17px', fontWeight: 700, color: unlocked ? badge.color : 'var(--ed-ink3)' }}>{badge.icon}</span>
                </div>
                <div style={{ fontSize: '8px', color: unlocked ? 'var(--ed-ink3)' : 'transparent', fontWeight: 600, textAlign: 'center' as const, maxWidth: '40px', lineHeight: 1.2 }}>{badge.label}</div>
              </div>
            );
          })}
        </div>
        <GenAILatestBadgePanel badges={BADGES} completedSections={completedSections} />
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
      <GenAIStreakCard />
    </aside>
  );
}

// ── M4 Interactive Tools ─────────────────────────────────────────────────────

// Section 01: Workflow step labeler — user tags which step is AI vs. surrounding engineering
const WorkflowAnatomy = ({ track }: { track: GenAITrack }) => {
  const steps = track === 'tech' ? [
    { id: 'a', label: 'Email arrives → parse sender, subject, body', correctType: 'trigger', hint: 'This is what starts the workflow. It reads the raw event.' },
    { id: 'b', label: 'Extract policy_code from subject (or mark as MISSING)', correctType: 'transform', hint: 'Pure data shaping — conditional logic on a field. No AI involved.' },
    { id: 'c', label: 'Format exception description into a structured prompt', correctType: 'transform', hint: 'A Set node assembles the text the AI will receive. Still engineering.' },
    { id: 'd', label: 'OpenAI classifies exception into one of 8 categories + confidence score', correctType: 'ai', hint: 'Language work — one AI call. Note: all surrounding steps are not AI.' },
    { id: 'e', label: 'Write classification + confidence to Google Sheets row', correctType: 'output', hint: 'A Sheets node writes structured data. Engineering, not AI.' },
  ] : [
    { id: 'a', label: 'Schedule fires at 7am every Monday', correctType: 'trigger', hint: 'A Cron trigger — starts the workflow on a time condition.' },
    { id: 'b', label: 'Fetch all exception rows from this week\'s sheet', correctType: 'data', hint: 'A Google Sheets read node — retrieves structured data from an external system.' },
    { id: 'c', label: 'Format rows into a single summary_input text block', correctType: 'transform', hint: 'A Set node assembles the data. All engineering — no AI yet.' },
    { id: 'd', label: 'Claude reads summary_input and drafts the brief', correctType: 'ai', hint: 'The one AI call. Everything before and after this is data engineering.' },
    { id: 'e', label: 'Send brief as email to director@northstar.com', correctType: 'output', hint: 'A Gmail send node. Engineering — delivers the AI output.' },
  ];
  const types = [
    { key: 'trigger', label: 'Trigger', color: '#0F766E' },
    { key: 'data', label: 'Data', color: '#2563EB' },
    { key: 'transform', label: 'Transform', color: '#7C3AED' },
    { key: 'ai', label: 'AI Node', color: '#F59E0B' },
    { key: 'output', label: 'Output', color: '#16A34A' },
  ];
  const [tags, setTags] = useState<Record<string, string>>({});
  const allTagged = steps.every(s => tags[s.id]);
  const score = steps.filter(s => tags[s.id] === s.correctType).length;
  const aiCount = steps.filter(s => s.correctType === 'ai').length;
  return (
    <div style={{ background: '#0D1117', borderRadius: '12px', padding: '20px 24px', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#8B949E', marginBottom: '6px' }}>WORKFLOW STEP LABELER</div>
      <div style={{ fontSize: '13px', color: '#C9D1D9', fontWeight: 600, marginBottom: '4px', fontFamily: 'sans-serif' }}>Tag each step: what kind of node does this work?</div>
      <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '14px' }}>Hint: only {aiCount} of {steps.length} steps need an AI node.</div>
      <div style={{ display: 'grid', gap: '8px', marginBottom: '14px' }}>
        {steps.map((s, i) => {
          const tagged = tags[s.id];
          const correct = tagged === s.correctType;
          const typeInfo = types.find(t => t.key === tagged);
          return (
            <div key={s.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${tagged ? (correct ? '#16A34A' : '#DC2626') : '#374151'}`, borderRadius: '8px', padding: '10px 12px' }}>
              <div style={{ fontSize: '11px', color: '#C9D1D9', marginBottom: '8px', fontFamily: 'sans-serif' }}><span style={{ color: '#6B7280', marginRight: '6px' }}>{i + 1}.</span>{s.label}</div>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' as const }}>
                {types.map(t => (
                  <div key={t.key} onClick={() => !tagged && setTags(prev => ({ ...prev, [s.id]: t.key }))} style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, cursor: tagged ? 'default' : 'pointer', border: `1.5px solid ${tagged === t.key ? t.color : '#374151'}`, background: tagged === t.key ? `${t.color}15` : 'transparent', color: tagged === t.key ? t.color : '#6B7280' }}>{t.label}</div>
                ))}
              </div>
              {tagged && <div style={{ marginTop: '7px', fontSize: '10px', color: correct ? '#6EE7B7' : '#FCA5A5', lineHeight: 1.5 }}>{correct ? '✓' : `✗ This is a ${s.correctType} node.`} {s.hint}</div>}
            </div>
          );
        })}
      </div>
      {allTagged && <div style={{ padding: '10px 14px', borderRadius: '7px', background: score === steps.length ? 'rgba(22,163,74,0.1)' : 'rgba(245,158,11,0.08)', border: `1px solid ${score === steps.length ? '#16A34A' : '#F59E0B'}40`, fontSize: '13px', fontWeight: 700, color: score === steps.length ? '#6EE7B7' : '#F59E0B' }}>{score}/{steps.length} correct. {score === steps.length ? `${steps.length - aiCount} surrounding nodes are engineering — only the AI node is AI.` : 'Review the corrected tags above.'}</div>}
    </div>
  );
};

// Section 02: Node categorizer — user sorts nodes into the right category bucket
const NodeTypeMapCard = ({ track }: { track: GenAITrack }) => {
  const nodeItems = track === 'tech' ? [
    { id: 'email', label: 'Gmail Trigger', correctCat: 'trigger' }, { id: 'http', label: 'HTTP Request', correctCat: 'data' },
    { id: 'set', label: 'Set Node', correctCat: 'transform' }, { id: 'openai', label: 'OpenAI Node', correctCat: 'ai' },
    { id: 'sheets', label: 'Google Sheets', correctCat: 'data' }, { id: 'code', label: 'Code Node', correctCat: 'transform' },
    { id: 'webhook', label: 'Webhook Trigger', correctCat: 'trigger' }, { id: 'claude', label: 'Anthropic Node', correctCat: 'ai' },
  ] : [
    { id: 'sched', label: 'Schedule Trigger', correctCat: 'trigger' }, { id: 'sheets', label: 'Google Sheets', correctCat: 'data' },
    { id: 'set', label: 'Set Node', correctCat: 'transform' }, { id: 'claude', label: 'Anthropic Node', correctCat: 'ai' },
    { id: 'form', label: 'Google Forms', correctCat: 'trigger' }, { id: 'if', label: 'IF Node', correctCat: 'transform' },
    { id: 'airtable', label: 'Airtable', correctCat: 'data' }, { id: 'openai', label: 'OpenAI Node', correctCat: 'ai' },
  ];
  const cats = [
    { key: 'trigger', label: 'Trigger', color: '#0F766E', note: 'Starts the workflow' },
    { key: 'data', label: 'Data', color: '#2563EB', note: 'Reads/writes external data' },
    { key: 'transform', label: 'Transform', color: '#7C3AED', note: 'Shapes data between nodes' },
    { key: 'ai', label: 'AI Node', color: '#F59E0B', note: 'Language work only' },
  ];
  const [selected, setSelected] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const allPlaced = nodeItems.every(n => placements[n.id]);
  const score = nodeItems.filter(n => placements[n.id] === n.correctCat).length;
  return (
    <div style={{ background: '#FAFAF9', border: '1px solid #E7E5E4', borderRadius: '12px', padding: '20px 24px' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.14em', color: '#78716C', marginBottom: '6px' }}>NODE CATEGORIZER</div>
      <div style={{ fontSize: '13px', color: '#292524', fontWeight: 600, marginBottom: '4px' }}>Click a node, then click the bucket it belongs in.</div>
      <div style={{ fontSize: '11px', color: '#78716C', marginBottom: '14px' }}>Correctly sort all 8 nodes.</div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const, marginBottom: '16px' }}>
        {nodeItems.map(n => {
          const placed = placements[n.id];
          const cat = cats.find(c => c.key === placed);
          const correct = placed && placed === n.correctCat;
          return (
            <div key={n.id} onClick={() => !placed && setSelected(n.id === selected ? null : n.id)} style={{ padding: '7px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: placed ? 'default' : 'pointer', border: `2px solid ${n.id === selected ? '#0F766E' : placed ? (correct ? '#16A34A' : '#DC2626') : '#E7E5E4'}`, background: placed ? (correct ? '#F0FDF4' : '#FEF2F2') : n.id === selected ? 'rgba(15,118,110,0.06)' : '#fff', color: placed ? (correct ? '#166534' : '#991B1B') : n.id === selected ? '#0F766E' : '#292524', transition: 'all 0.15s' }}>{cat ? `${cat.label}: ` : ''}{n.label}</div>
          );
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        {cats.map(cat => (
          <div key={cat.key} onClick={() => { if (selected && !placements[selected]) { setPlacements(prev => ({ ...prev, [selected]: cat.key })); setSelected(null); } }} style={{ padding: '10px 14px', borderRadius: '8px', border: `2px dashed ${selected ? cat.color : cat.color + '60'}`, background: selected ? `${cat.color}08` : 'transparent', cursor: selected ? 'pointer' : 'default', transition: 'all 0.15s' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: cat.color, marginBottom: '2px' }}>{cat.label}</div>
            <div style={{ fontSize: '9px', color: '#78716C' }}>{cat.note}</div>
          </div>
        ))}
      </div>
      {allPlaced && <div style={{ padding: '10px 14px', borderRadius: '7px', background: score === nodeItems.length ? '#F0FDF4' : '#FFFBEB', border: `1px solid ${score === nodeItems.length ? '#BBF7D0' : '#FDE68A'}`, fontSize: '13px', fontWeight: 700, color: score === nodeItems.length ? '#166534' : '#92400E' }}>{score}/{nodeItems.length} correct. {score < nodeItems.length ? 'Incorrect items are shown in red — click to retry.' : 'Perfect — you can read an n8n canvas node by node.'}</div>}
    </div>
  );
};

// Section 03: Credential Risk Assessor — user rates 3 scenarios, sees consequences
const CredentialCard = ({ track }: { track: GenAITrack }) => {
  const scenarios = [
    {
      id: 'api', setup: `${track === 'tech' ? 'Aarav' : 'Rhea'} stores the OpenAI API key in the n8n team credential vault, scoped to the automation project only.`,
      correctRisk: 'low', explain: 'Team vault + scoped key = correct. If the key is compromised, it only affects this project. Anyone on the team can rotate it without breaking the workflow.',
    },
    {
      id: 'oauth', setup: `${track === 'tech' ? 'Aarav' : 'Rhea'} authenticates the Google Sheets node using her personal @northstar.com Google account via OAuth.`,
      correctRisk: 'high', explain: 'Personal OAuth is the single most common production failure mode. When she resets her password, enables new 2FA, or leaves the company, the token is invalidated and the workflow silently breaks at 7am Monday.',
    },
    {
      id: 'svc', setup: `${track === 'tech' ? 'Aarav' : 'Rhea'} creates a Google service account (team-automation@northstar.iam) and uses it for all Google integrations.`,
      correctRisk: 'low', explain: 'Service account = team-owned, not tied to any individual. Survives password changes, 2FA updates, and offboarding. This is the correct credential pattern for automation.',
    },
  ];
  const risks = [{ key: 'low', label: 'Low Risk', color: '#16A34A' }, { key: 'medium', label: 'Medium Risk', color: '#F59E0B' }, { key: 'high', label: 'High Risk', color: '#DC2626' }];
  const [picks, setPicks] = useState<Record<string, string>>({});
  const allPicked = scenarios.every(s => picks[s.id]);
  const score = scenarios.filter(s => picks[s.id] === s.correctRisk).length;
  return (
    <div style={{ background: '#0D1117', borderRadius: '12px', padding: '20px 24px', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#8B949E', marginBottom: '6px' }}>CREDENTIAL RISK ASSESSOR</div>
      <div style={{ fontSize: '13px', color: '#C9D1D9', fontWeight: 600, marginBottom: '14px', fontFamily: 'sans-serif' }}>Rate the risk of each credential setup. What breaks if something goes wrong?</div>
      <div style={{ display: 'grid', gap: '12px' }}>
        {scenarios.map(s => {
          const picked = picks[s.id];
          const correct = picked === s.correctRisk;
          return (
            <div key={s.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${picked ? (correct ? '#16A34A' : '#DC2626') : '#374151'}`, borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ fontSize: '12px', color: '#C9D1D9', lineHeight: 1.6, marginBottom: '10px', fontFamily: 'sans-serif' }}>{s.setup}</div>
              {!picked && <div style={{ display: 'flex', gap: '8px' }}>
                {risks.map(r => <div key={r.key} onClick={() => setPicks(prev => ({ ...prev, [s.id]: r.key }))} style={{ flex: 1, padding: '7px', borderRadius: '6px', textAlign: 'center' as const, cursor: 'pointer', border: `1.5px solid ${r.color}50`, fontSize: '11px', fontWeight: 700, color: r.color, background: `${r.color}08` }}>{r.label}</div>)}
              </div>}
              {picked && <div style={{ fontSize: '11px', color: correct ? '#6EE7B7' : '#FCA5A5', lineHeight: 1.6 }}>{correct ? '✓ Correct.' : `✗ This is ${s.correctRisk} risk.`} {s.explain}</div>}
            </div>
          );
        })}
      </div>
      {allPicked && <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '7px', background: score === 3 ? 'rgba(22,163,74,0.1)' : 'rgba(245,158,11,0.08)', border: `1px solid ${score === 3 ? '#16A34A' : '#F59E0B'}40`, fontSize: '13px', fontWeight: 700, color: score === 3 ? '#6EE7B7' : '#F59E0B' }}>{score}/3 correct. {score < 3 ? 'Personal OAuth is the most commonly underrated risk.' : 'Good — you can spot credential risk before it breaks production at 2am.'}</div>}
    </div>
  );
};

// Section 04: Failure Router — node fails, user picks the response, sees consequences
const ErrorPathCard = ({ track }: { track: GenAITrack }) => {
  const failures = track === 'tech' ? [
    {
      id: 'ai', node: 'OpenAI Classify', fail: 'API returns 429 Too Many Requests (rate limit)',
      opts: [
        { key: 'retry', label: 'Retry once, then continue', result: 'Second call also rate-limited. Item written with classification = null. Silent data corruption in tracker.', wrong: true },
        { key: 'skip', label: 'Skip item, continue workflow', result: 'Item silently dropped. Tracker has no record. Analyst never knows this exception wasn\'t classified.', wrong: true },
        { key: 'halt', label: 'Halt + alert Slack + dead-letter', result: 'Workflow stops. Slack fires. Item written to dead-letter queue for manual review. Nothing lost, nothing silent.', wrong: false },
        { key: 'ignore', label: 'Log warning, continue anyway', result: 'Log entry created but workflow proceeds with empty classification. Dashboard shows 0 errors, but tracker has corrupt data.', wrong: true },
      ],
    },
    {
      id: 'validate', node: 'Validate Output', fail: 'AI returned 8 characters — way below expected length',
      opts: [
        { key: 'send', label: 'Forward output anyway — node succeeded', result: 'An 8-character classification goes to the tracker. Analyst opens the record and sees garbage. Pipeline appeared to succeed.', wrong: true },
        { key: 'retry', label: 'Retry the AI node with the same input', result: 'Second call may produce the same truncated output. Root cause (malformed input) is unchanged.', wrong: true },
        { key: 'route', label: 'Route to error path — Slack alert + dead-letter', result: 'Analyst gets Slack: "Validate Output failed — output too short." Item queued for manual triage. Nothing forwarded to tracker.', wrong: false },
        { key: 'skip', label: 'Skip this item, process the next', result: 'Item silently disappears from pipeline. No alert, no record, no way to know it was dropped.', wrong: true },
      ],
    },
  ] : [
    {
      id: 'sheets', node: 'Google Sheets Read', fail: 'OAuth token expired (Rhea reset her password yesterday)',
      opts: [
        { key: 'retry', label: 'Retry once automatically', result: 'Token is still invalid. Second attempt fails. Workflow halts with no alert. Director receives nothing at 7am — no explanation.', wrong: true },
        { key: 'skip', label: 'Skip the data step, run AI on empty input', result: 'Claude receives an empty input and produces a blank or confused summary. This goes to the director.', wrong: true },
        { key: 'halt', label: 'Halt + send Slack to Rhea: "Sheets auth failed"', result: 'Workflow stops. Rhea gets Slack at 7:05am. She re-authenticates. Director receives a 20-minute delayed but correct brief.', wrong: false },
        { key: 'log', label: 'Log the error, continue with cached data from last week', result: 'Director receives last week\'s brief dated today. She makes decisions on stale data. No one knows.', wrong: true },
      ],
    },
    {
      id: 'validate', node: 'Validate Output', fail: 'AI returned only 40 characters — far below the 100-char minimum',
      opts: [
        { key: 'send', label: 'Send it — the AI node returned successfully', result: 'Director receives a 40-character email: "No exceptions this week." In a week with 3 SLA breaches. She takes no action.', wrong: true },
        { key: 'retry', label: 'Retry the AI node', result: 'Same sparse input may produce the same thin output. Root cause not addressed.', wrong: true },
        { key: 'route', label: 'Route to error path — alert Rhea before sending', result: 'Rhea gets: "Summary validation failed — 40 chars, missing \'exceptions\'." She reviews the input data and finds the sheet was blank (holiday week). She sends a manual note to director.', wrong: false },
        { key: 'skip', label: 'Skip sending — no brief is better than a bad brief', result: 'True, but director doesn\'t know why. She\'ll assume Rhea forgot. A brief failure notification is better than silence.', wrong: true },
      ],
    },
  ];
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const current = failures[step];
  const picked = picks[current?.id];
  const pickedOpt = current?.opts.find(o => o.key === picked);
  return (
    <div style={{ background: '#FAFAF9', border: '1px solid #E7E5E4', borderRadius: '12px', padding: '20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.14em', color: '#78716C' }}>FAILURE ROUTER — scenario {step + 1} of {failures.length}</div>
        {step < failures.length - 1 && picked && <div onClick={() => setStep(s => s + 1)} style={{ fontSize: '11px', fontWeight: 700, color: '#0F766E', cursor: 'pointer' }}>Next scenario →</div>}
      </div>
      {current && <>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#292524', marginBottom: '4px' }}>Node: <span style={{ color: '#0F766E' }}>{current.node}</span></div>
          <div style={{ fontSize: '13px', color: '#292524', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '7px', padding: '10px 12px', fontWeight: 500 }}>&#9888; Failure: {current.fail}</div>
        </div>
        <div style={{ fontSize: '12px', color: '#78716C', marginBottom: '10px' }}>How do you respond?</div>
        <div style={{ display: 'grid', gap: '7px' }}>
          {current.opts.map(opt => (
            <div key={opt.key} onClick={() => !picked && setPicks(prev => ({ ...prev, [current.id]: opt.key }))} style={{ padding: '10px 12px', borderRadius: '7px', cursor: picked ? 'default' : 'pointer', border: `1.5px solid ${picked === opt.key ? (opt.wrong ? '#DC2626' : '#16A34A') : picked && !opt.wrong ? '#16A34A' : '#E7E5E4'}`, background: picked === opt.key ? (opt.wrong ? '#FEF2F2' : '#F0FDF4') : picked && !opt.wrong ? '#F0FDF4' : '#fff', fontSize: '12px', color: '#292524' }}>
              {opt.label}
              {picked && picked === opt.key && <div style={{ marginTop: '6px', fontSize: '11px', color: opt.wrong ? '#DC2626' : '#166534', lineHeight: 1.5 }}>{opt.wrong ? '✗' : '✓'} {opt.result}</div>}
              {picked && picked !== opt.key && !opt.wrong && <div style={{ marginTop: '6px', fontSize: '11px', color: '#166534', lineHeight: 1.5 }}>✓ This was the right choice: {opt.result}</div>}
            </div>
          ))}
        </div>
      </>}
      {step === failures.length - 1 && picked && <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '7px', background: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: '12px', color: '#166534' }}>Rule: alert + dead-letter beats retry, skip, and silence for every failure mode. Nothing should disappear without a trace.</div>}
    </div>
  );
};

// Section 05: n8n canvas explorer — full workflow as interactive n8n-style canvas
interface M4Node { id: string; x: number; y: number; label: string; typeLabel: string; icon: string; color: string; desc: string; input: string; output: string; risk: string; }
interface M4Conn { from: string; to: string; isError?: boolean; fromBottom?: boolean; }

const N8nCanvasExplorer = ({ track }: { track: GenAITrack }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const NW = 160, NH = 56;

  const techNodes: M4Node[] = [
    { id: 'trigger', x: 10, y: 30, label: 'Gmail Trigger', typeLabel: 'TRIGGER', icon: '✉', color: '#0F766E',
      desc: 'Fires when an exception email lands in the monitored inbox. Passes sender, subject, and body downstream.',
      input: 'event-driven — no input', output: '{ sender, subject, body, timestamp }',
      risk: 'If the mailbox rule changes, this trigger stops firing with no alert.' },
    { id: 'parse', x: 194, y: 30, label: 'Set Node', typeLabel: 'TRANSFORM', icon: '⚙', color: '#7C3AED',
      desc: 'Extracts policy_code from subject. Assembles the structured prompt the AI will receive. No AI here — pure data engineering.',
      input: '{ subject, body }', output: '{ policy_code, prompt_text }',
      risk: 'When subject has no policy code, policy_code = "MISSING". The AI must handle this variant.' },
    { id: 'ai', x: 378, y: 30, label: 'OpenAI Node', typeLabel: 'AI NODE', icon: '◈', color: '#F59E0B',
      desc: 'Classifies the exception into 1 of 8 defined categories. Returns category name + confidence score (0.0–1.0).',
      input: '{ prompt_text }', output: '{ category, confidence }',
      risk: 'Rate limits return 429. Hallucinated categories can pass schema validation. Confidence score ≠ correctness.' },
    { id: 'validate', x: 562, y: 30, label: 'Validate Output', typeLabel: 'TRANSFORM', icon: '✓', color: '#2563EB',
      desc: 'Checks: confidence ≥ 0.72 AND category is a valid enum value. Routes to Sheets on pass, error path on fail.',
      input: '{ category, confidence }', output: 'pass → Sheets | fail → Error path',
      risk: 'Threshold must be calibrated on labeled data — 0.72 is an example, not a universal number.' },
    { id: 'sheets', x: 746, y: 30, label: 'Google Sheets', typeLabel: 'OUTPUT', icon: '⊞', color: '#16A34A',
      desc: 'Appends a row to the exception tracker: policy_code, category, confidence, run_id, timestamp.',
      input: '{ policy_code, category, confidence }', output: 'Row appended to tracker sheet',
      risk: 'Must use a service account credential — not personal OAuth. Personal tokens break on password reset.' },
    { id: 'error', x: 562, y: 170, label: 'Slack + Dead-Letter', typeLabel: 'ERROR PATH', icon: '⚠', color: '#DC2626',
      desc: 'Fires when validation fails. Sends alert to #exceptions-alert. Writes item to dead-letter sheet for manual triage.',
      input: '{ error_reason, original_input }', output: 'Slack message + dead-letter row written',
      risk: 'Nothing disappears silently. Every failed item must be retrievable for reprocessing.' },
  ];

  const techConns: M4Conn[] = [
    { from: 'trigger', to: 'parse' },
    { from: 'parse', to: 'ai' },
    { from: 'ai', to: 'validate' },
    { from: 'validate', to: 'sheets' },
    { from: 'validate', to: 'error', isError: true, fromBottom: true },
  ];

  const nonTechNodes: M4Node[] = [
    { id: 'trigger', x: 10, y: 30, label: 'Schedule Trigger', typeLabel: 'TRIGGER', icon: '◷', color: '#0F766E',
      desc: 'Fires every Monday at 07:00. Passes run timestamp downstream. No external event dependency.',
      input: 'time-driven — no input', output: '{ run_timestamp }',
      risk: 'Timezone must match team timezone — a mismatch silently delivers the brief at the wrong time.' },
    { id: 'sheets', x: 194, y: 30, label: 'Google Sheets', typeLabel: 'DATA', icon: '⊞', color: '#16A34A',
      desc: "Reads all exception rows from the current week's sheet. Returns an array of row objects.",
      input: '{ spreadsheet_id, range }', output: '[{ date, type, SLA_status, notes }]',
      risk: 'Service account required — not personal OAuth. Personal tokens fail when password changes.' },
    { id: 'set', x: 378, y: 30, label: 'Set Node', typeLabel: 'TRANSFORM', icon: '⚙', color: '#7C3AED',
      desc: 'Formats the row array into a single summary_input text block. Assembles the Claude prompt. No AI here.',
      input: '[{ date, type, SLA_status, notes }]', output: '{ summary_input, row_count }',
      risk: 'If sheet is empty (holiday week), summary_input is blank. The AI must receive an explicit empty-week instruction.' },
    { id: 'ai', x: 562, y: 30, label: 'Claude Node', typeLabel: 'AI NODE', icon: '◈', color: '#F59E0B',
      desc: 'Reads summary_input and drafts the weekly brief. This is the only AI call in the entire workflow.',
      input: '{ summary_input }', output: '{ brief_text }',
      risk: 'Sparse input → sparse output. An empty sheet produces a confident "no exceptions" — which may be factually wrong.' },
    { id: 'validate', x: 746, y: 30, label: 'Validate Output', typeLabel: 'TRANSFORM', icon: '✓', color: '#2563EB',
      desc: 'Checks brief_text length ≥ 100 chars AND contains the keyword "exception". Routes to Gmail on pass, Slack on fail.',
      input: '{ brief_text }', output: 'pass → Gmail | fail → Slack alert',
      risk: 'These checks verify form, not quality. A 100-char bad brief passes. Content review is always human work.' },
    { id: 'gmail', x: 930, y: 30, label: 'Gmail Send', typeLabel: 'OUTPUT', icon: '✉', color: '#EA580C',
      desc: 'Sends the validated brief to director@northstar.com. Subject includes run date and exception count.',
      input: '{ brief_text, run_timestamp, row_count }', output: 'Email delivered to director inbox',
      risk: 'Service account must have Gmail send permission with domain-wide delegation configured.' },
    { id: 'error', x: 746, y: 170, label: 'Slack Alert → Rhea', typeLabel: 'ERROR PATH', icon: '⚠', color: '#DC2626',
      desc: 'Fires on validation failure. Alerts Rhea via Slack before anything reaches the director. Better silence than a bad brief.',
      input: '{ error_reason, brief_text }', output: 'Slack message to Rhea with failure details',
      risk: 'Alerting Rhea, not the director, on failure is a deliberate design choice — Rhea decides the next step.' },
  ];

  const nonTechConns: M4Conn[] = [
    { from: 'trigger', to: 'sheets' },
    { from: 'sheets', to: 'set' },
    { from: 'set', to: 'ai' },
    { from: 'ai', to: 'validate' },
    { from: 'validate', to: 'gmail' },
    { from: 'validate', to: 'error', isError: true, fromBottom: true },
  ];

  const nodes = track === 'tech' ? techNodes : nonTechNodes;
  const conns = track === 'tech' ? techConns : nonTechConns;
  const sel = nodes.find(n => n.id === selected);
  const CW = track === 'tech' ? 926 : 1110;

  const getPath = (conn: M4Conn): string => {
    const f = nodes.find(n => n.id === conn.from);
    const t = nodes.find(n => n.id === conn.to);
    if (!f || !t) return '';
    if (conn.fromBottom) {
      const x1 = f.x + NW / 2, y1 = f.y + NH;
      const x2 = t.x + NW / 2, y2 = t.y;
      const my = (y1 + y2) / 2;
      return `M ${x1} ${y1} C ${x1} ${my} ${x2} ${my} ${x2} ${y2}`;
    }
    const x1 = f.x + NW, y1 = f.y + NH / 2;
    const x2 = t.x, y2 = t.y + NH / 2;
    const cx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${cx} ${y1} ${cx} ${y2} ${x2} ${y2}`;
  };

  return (
    <div style={{ background: '#0F1117', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Window chrome */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '10px', background: '#141920' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {(['#FF5F57', '#FFBD2E', '#28C840'] as const).map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ flex: 1, textAlign: 'center' as const, fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>
          n8n — {track === 'tech' ? 'exception-classifier.json' : 'monday-brief.json'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
          <span style={{ fontSize: '9px', color: '#22C55E', fontFamily: "'JetBrains Mono', monospace" }}>ACTIVE</span>
        </div>
      </div>
      {/* Canvas */}
      <div style={{ overflowX: 'auto' as const, padding: '24px 20px 20px',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '22px 22px', backgroundColor: '#0F1117' }}>
        <div style={{ position: 'relative' as const, width: CW, height: 260 }}>
          <svg style={{ position: 'absolute' as const, top: 0, left: 0, width: CW, height: 260, pointerEvents: 'none' as const, overflow: 'visible' as const }}>
            {conns.map(conn => (
              <path key={`${conn.from}-${conn.to}`}
                d={getPath(conn)}
                stroke={conn.isError ? '#DC262655' : 'rgba(255,255,255,0.15)'}
                strokeWidth={1.5} fill="none"
                strokeDasharray={conn.isError ? '5 4' : undefined} />
            ))}
          </svg>
          {nodes.map(node => {
            const isSel = selected === node.id;
            return (
              <div key={node.id} onClick={() => setSelected(isSel ? null : node.id)}
                style={{ position: 'absolute' as const, left: node.x, top: node.y, width: NW, height: NH,
                  background: isSel ? '#1C2333' : '#181F2E',
                  border: `1.5px solid ${isSel ? node.color : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '8px', cursor: 'pointer', overflow: 'hidden',
                  boxShadow: isSel ? `0 0 0 2px ${node.color}25, 0 8px 28px rgba(0,0,0,0.35)` : '0 2px 8px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s' }}>
                <div style={{ height: '3px', background: node.color }} />
                <div style={{ padding: '7px 9px', display: 'flex', alignItems: 'center', gap: '8px', height: `${NH - 3}px` }}>
                  <div style={{ width: 28, height: 28, borderRadius: '6px', background: `${node.color}1A`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', flexShrink: 0, color: node.color }}>{node.icon}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#E2E8F0', lineHeight: 1.2, marginBottom: '3px',
                      whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.label}</div>
                    <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                      color: node.color, letterSpacing: '0.08em' }}>{node.typeLabel}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Detail panel */}
      {sel ? (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '16px 20px',
          background: `linear-gradient(135deg, ${sel.color}0A 0%, transparent 60%)` }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: '9px', background: `${sel.color}1A`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', flexShrink: 0, color: sel.color }}>{sel.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' as const }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#E2E8F0' }}>{sel.label}</span>
                <span style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                  color: sel.color, background: `${sel.color}18`, padding: '2px 7px', borderRadius: '4px' }}>{sel.typeLabel}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(226,232,240,0.75)', lineHeight: 1.65, margin: '0 0 12px' }}>{sel.desc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                {[{ label: 'INPUT', val: sel.input }, { label: 'OUTPUT', val: sel.output }].map(item => (
                  <div key={item.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '7px', padding: '8px 10px' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'rgba(255,255,255,0.28)', fontWeight: 700, marginBottom: '4px', letterSpacing: '0.1em' }}>{item.label}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(226,232,240,0.65)', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5 }}>{item.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)',
                borderRadius: '6px', padding: '7px 10px', fontSize: '10px', color: 'rgba(252,165,165,0.85)', lineHeight: 1.6 }}>
                <span style={{ fontWeight: 700 }}>&#9888; Risk: </span>{sel.risk}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,0.05)',
          fontSize: '10px', color: 'rgba(255,255,255,0.22)', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center' as const }}>
          Click any node to inspect its input schema, output contract, and production risk
        </div>
      )}
    </div>
  );
};

// ── End M4 Interactive Tools ──────────────────────────────────────────────────

function CoreContent({ track, completedSections, activeSection }: { track: GenAITrack; completedSections: Set<string>; activeSection: string | null }) {
  const nextSection = SECTIONS.find(s => !completedSections.has(s.id));
  const moduleContext = TRACK_META[track].moduleContext;
  return (
    <>
      {/* Module Hero */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', marginBottom: '28px' }}>
      <div style={{ flex: 1, minWidth: 0, background: 'var(--ed-cream)', borderRadius: '14px', padding: '36px 36px 28px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-12px', top: '-8px', fontSize: '140px', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.05)`, fontFamily: "'Lora','Georgia',serif", letterSpacing: '-0.04em', userSelect: 'none' as const, pointerEvents: 'none' as const }}>04</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '10px', textTransform: 'uppercase' as const }}>GenAI Launchpad · Pre-Read 04</div>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.025em', color: 'var(--ed-ink)', marginBottom: '10px', fontFamily: "'Lora', Georgia, serif" }}>Workflow Automation with n8n</h1>
          <p style={{ fontSize: '15px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif", marginBottom: '28px' }}>&ldquo;Adding AI to a broken process doesn&apos;t fix the process. It automates the broken parts faster.&rdquo;</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const, marginBottom: '24px' }}>
            <div style={{ background: `rgba(${ACCENT_RGB},0.08)`, border: `1.5px solid rgba(${ACCENT_RGB},0.3)`, borderRadius: '10px', padding: '14px 16px', flex: '1.5', minWidth: '180px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                {track === 'tech' ? <AaravFace size={44} /> : <RheaFace size={44} />}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: ACCENT }}>{track === 'tech' ? 'Aarav' : 'Rhea'}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.04em' }}>{track === 'tech' ? 'Platform Engineer · Northstar Health' : 'Operations Lead · Northstar Health'}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: ACCENT, background: `rgba(${ACCENT_RGB},0.1)`, padding: '2px 7px', borderRadius: '4px', letterSpacing: '0.06em' }}>PROTAGONIST</div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{track === 'tech' ? "Ticket: automate exception classification with AI. Opens n8n. First instinct: find an AI node and start there. No process map. No input schema. No definition of what 'classified' means." : "Has been using Claude manually — different prompts each time, outputs scattered in Slack, no record of what worked. Wants to automate the Monday morning exception summary she's been generating by hand."}</div>
            </div>
            {([
              { name: 'Rohan', role: 'Automation Engineer',     desc: "Always asks what the current process does, step by step, before touching n8n.", color: '#2563EB', mentorId: 'rohan' as GenAIMentorId },
              { name: 'Kabir', role: 'Operations Intelligence', desc: "Maps the manual workflow before asking where the AI fits.", color: '#0F766E', mentorId: 'kabir' as GenAIMentorId },
              { name: 'Leela', role: 'Risk & Compliance',       desc: "Asks about credential ownership and what breaks when someone leaves.", color: '#C2410C', mentorId: 'leela' as GenAIMentorId },
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
              'Map a manual process as a node diagram before opening n8n',
              'Design the input schema and output contract for an AI node before writing the prompt',
              'Explain how credentials, OAuth, and service accounts work — and why personal credentials are a reliability risk',
              'Build explicit error paths for every node: timeout, malformed output, silent failure',
              'Define production readiness as testing the failure path, not just the happy path',
            ].map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 4 ? '8px' : 0, alignItems: 'flex-start' }}>
                <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", marginTop: '2px' }}>0{i + 1}</span>
                <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{obj}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', padding: '16px 20px', borderRadius: '10px', background: `rgba(${ACCENT_RGB},0.08)`, border: `1px solid rgba(${ACCENT_RGB},0.18)` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: ACCENT, marginBottom: '8px' }}>{TRACK_META[track].label.toUpperCase()}</div>
            <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>{track === 'tech' ? "Your lens: how do you build a reliable automated pipeline where the AI node is one piece of a well-engineered system — with proper credentials, error handling, and failure paths that work at 2am without anyone watching?" : "Your lens: how do you turn a manual Monday morning workflow into a reliable automated system — standardising the prompt, the data pull, the output check, and the send, so your director gets the right brief whether or not you're at your desk?"}</div>
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, width: '162px', paddingTop: '8px' }}>
        <div className="float3d" style={{ background: 'linear-gradient(145deg, #0F0A1E 0%, #1A0F2E 100%)', borderRadius: '14px', padding: '18px 16px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE 04</div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>Workflow Automation</div>
          <div style={{ fontSize: '9px', color: 'rgba(240,232,216,0.45)', marginBottom: '14px' }}>GenAI Launchpad</div>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '12px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
            {SECTIONS.map((s, i) => {
              const done = completedSections.has(s.id);
              const active = activeSection === s.id;
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0, background: done ? '#22C55E' : active ? ACCENT : 'rgba(255,255,255,0.06)', border: `1px solid ${done ? '#22C55E' : active ? ACCENT : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: done || active ? '#fff' : 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, transition: 'all 0.3s' }}>{done ? '✓' : `0${i + 1}`}</div>
                  <div style={{ fontSize: '8px', color: done ? 'rgba(240,232,216,0.55)' : active ? 'rgba(240,232,216,0.95)' : 'rgba(240,232,216,0.3)', lineHeight: 1.3, flex: 1, transition: 'color 0.3s' }}>{s.label.replace(/^\d+\.\s+/, '')}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: '12px', padding: '7px 10px', borderRadius: '6px', background: `${ACCENT}22`, border: `1px solid ${ACCENT}44` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', color: ACCENT, fontWeight: 700, marginBottom: '2px' }}>{nextSection ? 'NEXT UP' : 'COMPLETE ✓'}</div>
            <div style={{ fontSize: '8px', color: 'rgba(240,232,216,0.6)' }}>{nextSection ? nextSection.label.replace(/^\d+\.\s+/, '') : 'All sections read!'}</div>
          </div>
        </div>
      </div>
      </div>

      {/* ── SECTION 01 ── */}
      <ChapterSection id="genai-m4-mindset" num="01" accentRgb={ACCENT_RGB} first>
        {chLabel('Workflow Automation with n8n')}
        {para(track === 'tech'
          ? "In Pre-Read 03, Aarav built a research pipeline with proper source triangulation and COVE evaluation. The outputs are trustworthy. But every research run is still manual — an analyst opens ChatGPT, pastes the prompt, copies the output. No audit trail. No consistency. No record of what ran. This module is about wiring that pipeline into a system."
          : "In Pre-Read 03, Rhea rebuilt her research workflow with proper source selection and audience-parameterised drafting. The outputs are better. But each run is still manual — different prompts each Monday, results scattered in Slack threads, no way to compare last week's brief to this week's. This module is about standardising what she's built."
        )}
        {h2("The workflow mindset: AI is a node. Everything around it is still engineering.")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can draw a node diagram for the current manual exception process — and identify exactly where the AI node belongs in it."
          : "\u25b6 After this section, you can write out your Monday morning process step by step and identify which steps are engineering problems before the AI call ever runs."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? <>Aarav has been handed a ticket: &ldquo;Build an automated exception classification system using AI.&rdquo; He opens n8n. His first instinct is to find an AI node and start there. He has no map of the current exception intake process, no schema for the input data, and no definition of what &ldquo;classified&rdquo; means as an output.</>
            : <>Rhea has decided to automate her Monday morning exception summary using n8n. Kabir sits down with her. Her first question is: &ldquo;Where do I put the AI?&rdquo; Kabir does not answer it. He asks her what happens between 7am Monday and the moment she sends the summary.</>}
        </SituationCard>
        {para(track === 'tech'
          ? "The instinct to start with the AI node is almost universal — and almost always wrong. The AI node executes whatever you pass it. The input design determines everything. Before you know what the AI receives, how it's formatted, and what the output contract looks like, you don't have an AI problem. You have a process design problem."
          : "The question 'where does the AI go?' assumes you already know what the workflow does. Kabir's question — what happens step by step between trigger and send — is the actual prerequisite. You cannot automate something you haven't described. Automation of a fuzzy process produces a fast, fuzzy automated process."
        )}
        {pullQuote("Adding AI to a broken process doesn't fix the process. It automates the broken parts faster.")}
        {keyBox(track === 'tech' ? "Building a workflow spec before touching n8n" : "The automation is in the plumbing, not the AI", [
          track === 'tech'
            ? "Map the current process node by node before designing automation: trigger, data sources, transformation steps, decision points, outputs, destination systems. The AI node belongs to one step in that map."
            : "The Monday summary workflow has five steps: trigger, data pull, AI summarisation, output validation, email send. Three of those five steps have nothing to do with AI quality.",
          track === 'tech'
            ? "Input schema first: what data does the AI node actually receive? Field names, data types, what's missing in edge cases. The 40% case where input is incomplete is not an edge case — it's a requirement."
            : "The hardest parts of workflow automation are the edge cases: empty data, API failures, unexpected input formats. These have nothing to do with how good your AI prompt is.",
          track === 'tech'
            ? "Output contract second: what does a correctly classified exception look like? One of eight categories, confidence score, fallback for low-confidence? Define the contract before the prompt."
            : "Automating a manual process first requires documenting the manual process precisely: what triggers it, what data it uses, what the output looks like, where it goes. You cannot automate something you haven't described.",
          track === 'tech'
            ? "The AI node is 3 lines in a 30-line workflow spec. The other 27 lines are authentication, data transformation, error routing, notification, and logging — all engineering problems with no AI involvement."
            : "AI tools feel like the point. They're not — they're one node. The workflow is the point. A broken workflow with great AI produces great outputs that nobody sees.",
          track === 'tech'
            ? "Automation that 'adds AI' without mapping the surrounding process creates a faster version of the existing confusion, not a reliable system."
            : "The question 'where does the AI go?' is always secondary to 'what does the full workflow do from trigger to verified output?'",
        ], ACCENT)}
        <GenAIConversationScene
          mentor={track === 'non-tech' ? 'kabir' : 'rohan'}
          track={track}
          accent={track === 'non-tech' ? '#0F766E' : '#2563EB'}
          techLines={[
            { speaker: 'protagonist', text: "I've got the ticket — automate exception classification with AI. I've been looking at the n8n OpenAI node. Where should I start?" },
            { speaker: 'mentor', text: "Not with the AI node. Walk me through the current process, step by step, from when an exception comes in to when it lands in the right analyst's queue." },
            { speaker: 'protagonist', text: "Email comes in, analyst opens it, reads it, decides the category, moves it to the right queue in the tracker." },
            { speaker: 'mentor', text: "What's the input to the decision step? Exactly what does the analyst read?" },
            { speaker: 'protagonist', text: "The exception description. Sometimes there's a policy code in the subject line." },
            { speaker: 'mentor', text: "Is the policy code always present?" },
            { speaker: 'protagonist', text: "No. Maybe 60% of the time." },
            { speaker: 'mentor', text: "So your AI node has to handle both cases. What's the output of the decision? What does 'classified' look like in the tracker?" },
            { speaker: 'protagonist', text: "A category label. One of eight." },
            { speaker: 'mentor', text: "Before you touch n8n: document the input schema, document the eight output categories with examples, document the 40% case where there's no policy code. That's your workflow spec. The AI node is three lines of that spec. The rest is engineering." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "I want to automate the Monday summary. Where does the AI go in n8n?" },
            { speaker: 'mentor', text: "Before we talk about where — tell me what you do between 7am Monday and the moment you hit send." },
            { speaker: 'protagonist', text: "I open the exception tracker, filter to last week's closed items, copy them into a doc, then write the summary myself — or I've been pasting them into Claude lately." },
            { speaker: 'mentor', text: "Where does the tracker data live? Google Sheets?" },
            { speaker: 'protagonist', text: "Yes. One sheet per week." },
            { speaker: 'mentor', text: "And where does the summary go when you're done?" },
            { speaker: 'protagonist', text: "Email to my director and the regional manager." },
            { speaker: 'mentor', text: "So the workflow is: trigger at 7am Monday → pull last week's sheet → pass to Claude → send email. The AI is one node in the middle. The harder questions are step one and what happens when Claude returns an empty summary." },
            { speaker: 'protagonist', text: "I hadn't thought about the empty summary case." },
            { speaker: 'mentor', text: "That's step five. What happens when Claude returns nothing, or when the sheet has no data because it was a holiday week? Those are the nodes you need to design before you build the happy path." },
          ]}
        />
        <GenAIAvatar
          name={track === 'non-tech' ? 'Kabir' : 'Rohan'}
          nameColor={track === 'non-tech' ? '#0F766E' : '#2563EB'}
          borderColor={track === 'non-tech' ? '#0F766E' : '#2563EB'}
          conceptId="genai-m4-mindset"
          content={<>{track === 'tech' ? "The first question in workflow automation isn't 'where does AI go?' — it's 'what is the current process, exactly?' Automating a fuzzy process produces a fuzzy automated process. The input design determines everything." : "Automation feels like AI. It's actually plumbing. The AI call is one node. The workflow is everything around it: what triggers it, what data it pulls, what happens when the output is empty, where the result goes. Get the plumbing right first."}</>}
          expandedContent={track === 'tech' ? "The workflow spec has two parts: the happy path (trigger → data → AI → route → notify) and the failure paths (what happens at each node when it times out, returns unexpected data, or succeeds but produces the wrong output). Both must exist before the first line of n8n config is written." : "Write your manual process as if handing it to someone new: 'Every Monday at 7am, the first thing I do is...' Keep going until the email is sent. Count the distinct steps. Identify the step most likely to fail silently. That step needs error handling before you automate anything."}
          question={track === 'tech' ? "Aarav wants to start building the AI classification node. Rohan asks him to do something first. What?" : "Rhea asks where the AI goes in her automation workflow. Kabir doesn't answer. What does he ask instead?"}
          options={track === 'tech' ? [
            { text: "Choose between OpenAI and Anthropic for the AI node", correct: false, feedback: "Model selection is a late-stage decision — it depends on the input/output contract, latency requirements, and cost. You can't choose a model without a workflow spec." },
            { text: "Document the current manual process node by node — input schema and output contract", correct: true, feedback: "Correct. The workflow spec — current process, input schema, output contract, edge cases — is the prerequisite. Building the AI node first produces a fast solution to an undefined problem." },
            { text: "Get sign-off from compliance before automating exception handling", correct: false, feedback: "Compliance review is necessary but downstream. The prerequisite is understanding what the workflow actually does before involving stakeholders." },
            { text: "Set up n8n credentials before mapping the workflow", correct: false, feedback: "Credentials are needed to test, not to design. Setting them up before the workflow is mapped is premature." },
          ] : [
            { text: "What AI model Rhea wants to use", correct: false, feedback: "Model selection comes after understanding what the workflow needs to do. Answering 'which AI' before mapping the process is putting the AI first." },
            { text: "How many exceptions the team processes per week", correct: false, feedback: "Volume is useful context but not the prerequisite. Understanding the current process step by step is what enables workflow design." },
            { text: "What Rhea does between 7am Monday and the moment she hits send — the full manual process", correct: true, feedback: "Correct. Kabir maps the manual process before touching n8n — because automation of a fuzzy process produces a fast, fuzzy automated process. The manual steps are the workflow spec." },
            { text: "Whether Rhea has n8n access set up already", correct: false, feedback: "Access is a setup task, not a design task. It's irrelevant until the workflow is designed." },
          ]}
        />
        <TiltCard style={{ margin: '28px 0' }}><WorkflowAnatomy track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'tech' ? "Take the exception classification workflow you've been asked to build. Draw a node diagram with: trigger node, data input node(s), any transformation nodes needed before the AI call, the AI node with its input/output contract, any transformation nodes after the AI call, and the final output node. Count how many nodes are not the AI node. For each non-AI node, write one sentence describing what it does and what it outputs. This is your workflow spec." : "Write out your Monday morning exception summary process as if handing it to someone new. Start with 'Every Monday at 7am, the first thing I do is...' and keep going until the email is sent. Count the distinct steps. Identify which step is the AI call. Identify which step is most likely to fail silently. That step needs error handling before you automate anything."} />
        <QuizEngine
          conceptId="genai-m4-mindset"
          conceptName="Workflow Mindset"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m4-mindset',
            question: QUIZZES[0].question[track],
            options: QUIZZES[0].options[track],
            correctIndex: QUIZZES[0].correctIndex[track],
            explanation: QUIZZES[0].explanation[track],
            keyInsight: QUIZZES[0].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Aarav has his workflow spec. He opens n8n for the first time. His first instinct is to connect the Email Trigger straight to the AI node. Rohan points to the data panel and asks him to look at what the trigger actually outputs." : "Rhea has her process documented. Kabir shows her n8n. She drags in the OpenAI node first. Kabir asks her to move it to the right side of the canvas."} />
      </ChapterSection>

      {/* ── SECTION 02 ── */}
      <ChapterSection id="genai-m4-nodes" num="02" accentRgb={ACCENT_RGB}>
        {h2("Triggers, nodes, and the data flow graph: everything is JSON moving between boxes.")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can read any n8n node's output schema, identify a data shape mismatch at an edge, and insert the correct transformation node to fix it."
          : "\u25b6 After this section, you can build the left side of a workflow — trigger, data pull, format transform — and verify each handoff before adding the AI node."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? <>Aarav has his workflow spec. He opens n8n for the first time. He sees a canvas. He drags in an Email Trigger. The first thing he does is look for an AI node. Rohan stops him and points to the data panel on the right side of the Email Trigger node.</>
            : <>Rhea has her process documented. She opens n8n. Kabir shows her the canvas and asks her to drag in the first node without telling her which one to use. She drags in an OpenAI node. Kabir asks her to move it to the right side of the canvas.</>}
        </SituationCard>
        {para(track === 'tech'
          ? "The n8n canvas is a picture of data flowing between transformations. Every edge in the graph is a JSON handoff. The AI node receives text — not email objects, not sheet rows, not raw API responses. Every upstream node either produces the right shape for the next node, or you need a transformation node between them."
          : "A workflow is data moving through transformations, not a list of tools connected together. The AI node is always in the middle. Something must prepare the data before it. Something must handle the output after it. Those flanking nodes are as important as the AI node — and they must be built and tested first."
        )}
        {keyBox(track === 'tech' ? "Designing the data flow before wiring nodes" : "Thinking in flows, not nodes", [
          track === 'tech'
            ? "Every n8n node has an input schema and an output schema. Design both before connecting nodes — a mismatched edge is the most common source of workflow failures."
            : "A workflow is data moving through transformations — not a list of tools connected together. Think about what the data looks like at each step, not which tool does what.",
          track === 'tech'
            ? "The AI node receives text. Raw email objects, sheet rows, and webhook payloads are not text — they need a transformation step before the AI sees them."
            : "The AI node is always in the middle. Something must prepare the data before it, and something must handle the output after it. Those flanking nodes are as important as the AI node.",
          track === 'tech'
            ? "Edge cases in input data (missing fields, unexpected nulls, arrays vs. single values) must be handled by transformation nodes before they reach the AI. The AI does not validate input."
            : "The Schedule Trigger fires at a time — it doesn't know anything about the data. The data must be pulled, cleaned, and formatted by nodes between the trigger and the AI.",
          track === 'tech'
            ? "Draw the full node graph on paper before building it in n8n: trigger → transform → AI → transform → route → output → notify. Label each edge with the data shape it carries."
            : "When a node turns green, it means it ran without error — not that its output is what you expected. Always check the output data, not just the status colour.",
          track === 'tech'
            ? "n8n's data panel (click any node after a test run) shows the exact JSON at every edge. Use it to verify handoffs before wiring the next node."
            : "n8n workflows are readable left to right: trigger is leftmost, final output is rightmost. Every node in between is a transformation or a decision. Build left to right and test each connection before adding the next node.",
        ], '#7C3AED')}
        <GenAIConversationScene
          mentor="rohan"
          track={track}
          accent="#2563EB"
          techLines={[
            { speaker: 'protagonist', text: "I've got the Email Trigger in. I can see there's an OpenAI node. Should I connect them?" },
            { speaker: 'mentor', text: "Before you connect anything — click the Email Trigger and look at the data panel. What fields does it output?" },
            { speaker: 'protagonist', text: "Subject, from, body, date, attachments list." },
            { speaker: 'mentor', text: "That's the output schema of the trigger. That's what the next node receives. Does your AI classification prompt need just the body, or the body plus the subject?" },
            { speaker: 'protagonist', text: "Both. The policy code is sometimes in the subject." },
            { speaker: 'mentor', text: "So before the AI node, you need a Set node that combines subject and body into a single 'classification_input' field. Otherwise the AI node gets the full email object and your prompt has to fish around in it." },
            { speaker: 'protagonist', text: "Can't I just reference both fields in the prompt template?" },
            { speaker: 'mentor', text: "You can. But when subject is missing — your 40% case — the prompt gets 'undefined' in that slot and your classification degrades. A Set node with a conditional handles the missing case before the prompt sees it." },
            { speaker: 'protagonist', text: "So the node graph is: Email Trigger → Set (build input) → OpenAI (classify) → Set (parse output) → Route → Slack." },
            { speaker: 'mentor', text: "That's a workflow. The canvas is just the picture of data flowing between transformations. Every edge is a JSON handoff. Design the JSON at each edge before you build the node." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "I put the OpenAI node in first. Seems like the right starting point." },
            { speaker: 'mentor', text: "Push it to the right. It's not your first node. What triggers this workflow?" },
            { speaker: 'protagonist', text: "It should run every Monday at 7am." },
            { speaker: 'mentor', text: "That's a Schedule Trigger. Add that to the left side. What does it need to do first — before the AI?" },
            { speaker: 'protagonist', text: "Pull the exception data from the sheet." },
            { speaker: 'mentor', text: "Google Sheets node. Add it between the trigger and the AI. Now what does the AI need to receive from the sheet?" },
            { speaker: 'protagonist', text: "All the rows from last week." },
            { speaker: 'mentor', text: "All the rows, or a formatted list? The AI node doesn't know what a 'row' is. It receives text. You need a Set node or a Code node between the Sheets pull and the AI that formats the rows into a clean text block the prompt can use." },
            { speaker: 'protagonist', text: "Oh. So the AI never touches the raw sheet data." },
            { speaker: 'mentor', text: "Correct. Raw data goes in, transformed text comes out, AI gets the text. Every edge in the graph is a handoff — you design each handoff before you wire the nodes." },
          ]}
        />
        {pullQuote("Every edge in the workflow is a JSON handoff. Design the handoff before you build the node.")}
        {PMPrincipleBox({ label: '◈ Principle', principle: "Before connecting any two nodes, write down the exact data shape the left node outputs and the exact data shape the right node expects. If they don't match, you need a transformation node between them." })}
        <GenAIAvatar
          name="Rohan"
          nameColor="#2563EB"
          borderColor="#2563EB"
          conceptId="genai-m4-nodes"
          content={<>{track === 'tech' ? "Data shape mismatches between nodes are silent failures — the workflow looks connected but the downstream node receives garbage. Design the JSON at every edge before wiring. The data panel shows you exactly what each node outputs." : "The AI node is never your first node. It's always in the middle. Build left to right: trigger → data → format → AI. Test each connection before adding the next node. Green means executed, not correct."}</>}
          expandedContent={track === 'tech' ? "The most common n8n failure pattern: AI node returns a JSON string ('{ \"category\": \"escalate\" }') and the downstream routing node expects a parsed object. The fix is a JSON Parse node or a Set node that extracts the field. Check the data panel output at every edge — the shape mismatch is always visible there before it causes an error downstream." : "The Set node is your most important non-AI node. It takes whatever the Sheets pull returns (arrays, nested objects, inconsistent field names) and transforms it into a clean, predictable text block. Run it once on real sheet data and inspect the output before connecting the AI node — every formatting problem you catch here prevents a silent failure later."}
          question={track === 'tech' ? "Aarav builds: Email Trigger → AI Classify → Slack Notify. The Slack node fails with 'invalid data.' The AI node returns a JSON string, not an object. What is the root cause?" : "Rhea's workflow runs but the Google Sheet never updates. The Write node shows green but the sheet is blank. What should she check first?"}
          options={track === 'tech' ? [
            { text: "The Slack node API has changed and needs updating", correct: false, feedback: "An API change would produce a different error — an authentication failure or a 404, not 'invalid data.' The error message points to a data shape problem." },
            { text: "A JSON Parse node is missing between AI Classify and Slack Notify — the data shape doesn't match", correct: true, feedback: "Correct. The AI node returned a JSON string. The Slack node expected a parsed object with specific fields. A Parse node between them transforms the shape and resolves the mismatch." },
            { text: "The AI node temperature is too high, causing malformed JSON", correct: false, feedback: "Temperature affects content variation, not JSON formatting. A malformed JSON would produce a parse error, not an 'invalid data' error in the downstream node." },
            { text: "The Email Trigger is passing the wrong fields to the AI node", correct: false, feedback: "If the trigger were the problem, the AI node would fail — not the Slack node. The failure is at the AI → Slack boundary, which points to a data shape mismatch at that edge." },
          ] : [
            { text: "Google Sheets permissions need to be re-granted", correct: false, feedback: "A permissions failure would produce an error on the Sheets Write node — not a green success status with an empty sheet." },
            { text: "The Write node is mapped to the wrong column in the sheet", correct: false, feedback: "Wrong column mapping would write data to the wrong column, not produce an empty sheet. The issue is that no data is being written at all." },
            { text: "The node before the Write node is passing empty fields — the Write node succeeded in writing nothing", correct: true, feedback: "Correct. Green nodes confirm execution, not correct output. The Write node received empty fields and wrote them successfully. The bug is in the upstream node — the Set or Code node that should be formatting the AI output before the Write step." },
            { text: "The workflow needs to be re-activated after adding the Write node", correct: false, feedback: "Re-activation affects whether the workflow runs on the next trigger — it doesn't affect a run that already succeeded with a green status." },
          ]}
        />
        <TiltCard style={{ margin: '28px 0' }}><NodeTypeMapCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'tech' ? "In n8n, add an Email Trigger node and run a test with one real exception email. Open the data panel and copy the JSON output. Write the exact Set node mapping you'd need to produce a single 'classification_input' field that handles both the 'subject has policy code' and 'subject has no policy code' cases. Verify the Set node output is correct for both cases before connecting the OpenAI node." : "In n8n, add a Schedule Trigger, a Google Sheets node connected to your exception sheet, and a Set node. Run the Sheets node and look at the data panel output. Write down: what fields does each row have? Which fields does your summary prompt actually need? Build the Set node to extract only those fields into a clean text block, and test it returns what you expect before adding the AI node."} />
        <QuizEngine
          conceptId="genai-m4-nodes"
          conceptName="Triggers & Nodes"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m4-nodes',
            question: QUIZZES[1].question[track],
            options: QUIZZES[1].options[track],
            correctIndex: QUIZZES[1].correctIndex[track],
            explanation: QUIZZES[1].explanation[track],
            keyInsight: QUIZZES[1].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Aarav's node graph is right. Rohan looks at the credentials and asks him to explain who owns each one — and what happens to the workflow if the API key is rotated next week." : "Rhea's data flow is right. Her assistant set up the Google Sheets credential using Rhea's personal Google account. Kabir has one question about what happens when Rhea is on leave."} />
      </ChapterSection>

      {/* ── SECTION 03 ── */}
      <ChapterSection id="genai-m4-connect" num="03" accentRgb={ACCENT_RGB}>
        {h2("Credentials, auth, and the trust model: who owns the connection, and what breaks when they leave.")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can explain the difference between personal credentials and service accounts, and redesign any workflow that uses personal credentials in a production context."
          : "\u25b6 After this section, you can identify every credential your workflow uses, who owns it, and what happens to the workflow if that person's access changes."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? <>Aarav&apos;s workflow is wired. He used the team&apos;s shared OpenAI API key for the classification node and his own Slack token for the notification. Rohan looks at the credentials list and asks him one question: &ldquo;What happens to this workflow if you rotate the API key next week?&rdquo; Aarav realises he doesn&apos;t have an answer.</>
            : <>Rhea&apos;s workflow is nearly complete. Her assistant set up the Google Sheets credential using Rhea&apos;s personal Google account because it was the fastest path. Kabir asks: &ldquo;What happens to the Monday summary if Rhea is on leave and changes her password?&rdquo; Nobody in the room has an answer.</>}
        </SituationCard>
        {para(track === 'tech'
          ? "Credentials are infrastructure. They are not configuration. A workflow that depends on a personal API key or a personal OAuth token has a single point of failure that has nothing to do with code quality. When that person rotates their key, changes their password, or leaves the team, the workflow breaks — silently, at 2am, before the Monday report runs."
          : "The Google Sheets OAuth token is tied to the Google account that created it. When Rhea changes her password, enables 2FA, or leaves the company, the token is revoked. The workflow fails. Nobody knows until the director notices the missing brief. The fix is not technical — it's an ownership decision that must be made before the workflow goes live."
        )}
        {keyBox(track === 'tech' ? "The credential design checklist" : "Workflow credentials: ownership and failure modes", [
          track === 'tech'
            ? "Every credential in a production workflow has an owner. The owner question is: if this credential breaks, who is responsible and who can fix it? Personal credentials answer: one person who might be unavailable."
            : "Every credential in a workflow has an owner — the person whose account was used to authenticate. When that person leaves, changes their password, or revokes access, the workflow breaks.",
          track === 'tech'
            ? "Shared API keys are a cost, security, and rotation problem: every workflow uses the same budget pool, you can't audit per-workflow usage, and rotating the key breaks all workflows using it simultaneously."
            : "The fix is a team-owned service account or a shared workspace account — an account that belongs to the team, not a person. Any team member can re-authenticate it if it expires.",
          track === 'tech'
            ? "Service accounts are the correct design for production workflows: one service account per workflow or per service, dedicated budget limits, rotation independent of any individual's credentials."
            : "Before any workflow goes live, audit every credential: Google Sheets OAuth, email send auth, AI API key. For each, ask: if the owner leaves tomorrow, can someone else re-authenticate without their personal login?",
          track === 'tech'
            ? "OAuth tokens (Google Sheets, Gmail, Slack) expire and must be re-authorised. Personal OAuth tokens can only be re-authorised by the person who created them — or by revoking and re-creating with a different account."
            : "OAuth tokens expire on a schedule and must be renewed by the account that created them. If that account is a personal account, renewal requires that person to be available. If it's a service account, any admin can renew it.",
          track === 'tech'
            ? "The compliance rule: any workflow that handles sensitive data (patient records, exception flags, policy decisions) must use auditable credentials — so there's a record of which workflow ran as which identity."
            : "Credentials are not a technical detail — they're an operational risk decision. Personal credentials in a team workflow create a dependency on one person's continued employment and password management.",
        ], '#2563EB')}
        <GenAIConversationScene
          mentor={track === 'non-tech' ? 'kabir' : 'leela'}
          track={track}
          accent={track === 'non-tech' ? '#0F766E' : '#C2410C'}
          techLines={[
            { speaker: 'protagonist', text: "The workflow is wired. I used the team's shared OpenAI API key and my own Slack token for notifications." },
            { speaker: 'mentor', text: "Two problems. Walk me through what 'shared API key' means for billing." },
            { speaker: 'protagonist', text: "We all use the same key. It's in the team's account." },
            { speaker: 'mentor', text: "So every workflow that runs — yours, anyone else who uses that key — draws from the same budget with no way to tell which workflow spent what." },
            { speaker: 'protagonist', text: "I hadn't thought about that." },
            { speaker: 'mentor', text: "And your personal Slack token. What happens when you rotate it for security reasons? Or when you leave the team?" },
            { speaker: 'protagonist', text: "The Slack notifications break." },
            { speaker: 'mentor', text: "At 2am on a Monday. Before the exception briefing goes out. And whoever is on call has to find your credentials to fix it." },
            { speaker: 'protagonist', text: "So I need a service account for each external service." },
            { speaker: 'mentor', text: "Service account for the AI API with its own budget limit. Team-owned OAuth token for Slack — not tied to you personally. One credential per workflow, owned by the team, with documented rotation policy. That's credential hygiene." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "My assistant set up the Google Sheets credential with my personal Google account. It was fastest — I was already logged in." },
            { speaker: 'mentor', text: "What happens to that credential when you enable two-factor authentication on your Google account?" },
            { speaker: 'protagonist', text: "I... don't know. Does it break?" },
            { speaker: 'mentor', text: "The OAuth token is tied to your current session. Major account security changes can force re-authentication. And when you re-authenticate, the token is tied to your account again — it can only be renewed by you." },
            { speaker: 'protagonist', text: "So if I'm on holiday and the token expires—" },
            { speaker: 'mentor', text: "No one else can fix it without your login. The Monday brief doesn't send. Your director notices at 10am when there's nothing in her inbox." },
            { speaker: 'protagonist', text: "What's the fix?" },
            { speaker: 'mentor', text: "A team Google account — a shared workspace account that any admin can access. Set up the credential under that account. Then re-authentication is a team task, not a personal dependency." },
          ]}
        />
        {PMPrincipleBox({ label: '◈ Principle', principle: "Before a workflow goes live, audit every credential. For each: who owns it, what happens if they leave, can someone else re-authenticate it. Personal credentials in production workflows are a reliability risk, not a shortcut." })}
        <GenAIAvatar
          name="Leela"
          nameColor="#C2410C"
          borderColor="#C2410C"
          conceptId="genai-m4-connect"
          content={<>{track === 'tech' ? "Credentials are infrastructure — they have the same failure modes as servers. Personal credentials create a dependency on one person's continued availability, current password, and active employment. Design for team ownership from day one." : "The question 'who owns this credential?' is not a technical question — it's an operational risk question. Personal credentials in a team workflow are a single point of failure that shows up at the worst possible time."}</>}
          expandedContent={track === 'tech' ? "The compliance dimension: in regulated environments (health insurance, financial services), every workflow action must be traceable to an identity. Shared API keys make that audit trail meaningless — every action looks like it came from the same identity. Service accounts with workflow-specific credentials give you the audit trail compliance requires." : "Build a credential audit table for every production workflow: credential name, service it accesses, account that owns it, expiry date, who can renew it. If 'who can renew it' is one person, that's a risk item. Fix it before go-live, not after the first failure."}
          question={track === 'tech' ? "Aarav creates an n8n credential for the OpenAI API using the team's shared API key. Rohan asks him to change it. Why?" : "Rhea's assistant sets up the Google Sheets credential using Rhea's personal Google account. Kabir says this is a problem. What is the risk?"}
          options={track === 'tech' ? [
            { text: "Shared API keys can't be used in n8n credentials", correct: false, feedback: "Shared API keys work technically in n8n — the issue is operational: no per-workflow cost tracking, no rotation capability, and a shared security boundary." },
            { text: "A shared key means any workflow is billed to the same budget with no per-workflow tracking or rotation capability", correct: true, feedback: "Correct. Every workflow using the shared key draws from the same budget, you can't audit per-workflow usage, and rotating the key breaks all workflows simultaneously. Service accounts per workflow solve all three problems." },
            { text: "OpenAI rate limits are per-key, so a shared key will hit limits faster", correct: false, feedback: "Rate limits are a real concern with shared keys, but that's secondary to the billing, audit, and rotation problems. The primary issue is operational ownership." },
            { text: "Rohan prefers service accounts for all API connections", correct: false, feedback: "Personal preference isn't the reason. Service accounts are the correct design because they enable per-workflow cost tracking, independent rotation, and a clear ownership model." },
          ] : [
            { text: "Personal Google accounts can't be used for Google Sheets in n8n", correct: false, feedback: "Personal accounts work technically — the credential will authenticate successfully. The problem is operational: what happens when that account's access changes." },
            { text: "If Rhea leaves or changes her password, the workflow breaks and no one else can fix it without re-credentialing", correct: true, feedback: "Correct. The OAuth token is tied to Rhea's personal account. When her access changes — password reset, 2FA setup, employment change — the token is revoked or invalidated. A team service account removes this single point of failure." },
            { text: "Personal accounts have lower Google Sheets API rate limits", correct: false, feedback: "Rate limits are the same for personal and service accounts at the API level. The problem is ownership and continuity, not throughput." },
            { text: "The workflow will only run when Rhea is logged in", correct: false, feedback: "OAuth tokens are stored by n8n and used server-side — the workflow runs independently of whether Rhea is logged into her browser. The risk is token invalidation when her account security changes." },
          ]}
        />
        <TiltCard style={{ margin: '28px 0' }}><CredentialCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'tech' ? "List every credential your current or planned n8n workflow uses: AI API key, Slack token, Google Sheets OAuth, email send auth. For each, write down: (1) whose account owns it, (2) what happens if that person rotates or revokes it, (3) who can fix it at 2am if it breaks. Identify any credential where the answer to (3) is 'only one person' and redesign those as service accounts or shared team credentials." : "For the Monday summary workflow, list every external service it connects to and the credential type used for each. For each credential, answer: (1) whose personal account is it tied to, (2) what's the token expiry, (3) who can renew it if the owner is unavailable. If any credential is tied to a single person, create a team Google/Slack/email account and migrate the credential before the workflow goes live."} />
        <QuizEngine
          conceptId="genai-m4-connect"
          conceptName="Auth & Trust"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m4-connect',
            question: QUIZZES[2].question[track],
            options: QUIZZES[2].options[track],
            correctIndex: QUIZZES[2].correctIndex[track],
            explanation: QUIZZES[2].explanation[track],
            keyInsight: QUIZZES[2].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Credentials are fixed. The workflow runs overnight for the first time. In the morning, 14 of 22 exceptions were classified. 8 are missing. The workflow shows no errors." : "Credentials are fixed. The workflow runs on Monday morning. Rhea's director calls to ask why the email body is empty. The workflow shows all green nodes."} />
      </ChapterSection>

      {/* ── SECTION 04 ── */}
      <ChapterSection id="genai-m4-errors" num="04" accentRgb={ACCENT_RGB}>
        {h2("Error handling: what the workflow does when a node fails at 2am.")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can answer three questions for every node in a workflow: what happens on timeout, what happens on unexpected output format, what happens when the node succeeds but the output is wrong."
          : "\u25b6 After this section, you can add an output validation step before any send node — so the workflow alerts you instead of sending an empty email."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? <>The overnight classification workflow has run. In the morning: 14 of 22 exceptions are classified and routed. 8 are missing. The n8n execution log shows no errors — every node ran green. Rohan looks at the error handling settings and immediately sees the problem.</>
            : <>Rhea&apos;s Monday report workflow ran. It sent the email. But the email body is empty. Her director calls at 10am to ask what happened. The n8n execution log shows all green nodes. Rhea realises the workflow succeeded at a task she didn&apos;t define correctly.</>}
        </SituationCard>
        {para(track === 'tech'
          ? "Green nodes mean the node executed without throwing an error. They do not mean the output was correct or complete. In n8n, nodes have error handling modes: 'stop workflow' (halt on any error), 'continue' (skip the failed item and keep running), and 'retry on fail.' The default for most nodes is 'continue' — which means 8 failed items are silently dropped without any alert."
          : "The workflow sent an email — that's a successful execution. The email body was empty — that's a correct execution of a workflow that never checked whether it had anything to send. Output validation is a distinct step that must be designed explicitly: check the AI output before passing it to the send node, and define what happens when the check fails."
        )}
        {keyBox(track === 'tech' ? "The three error questions for every node" : "Output validation: the step between AI and send", [
          track === 'tech'
            ? "For every node, answer: (1) what should happen if this node times out? (2) what if it returns an unexpected format? (3) what if it succeeds but the output is wrong? These are different failure modes requiring different responses."
            : "Output validation is a Set node or Code node between the AI output and the send node. It checks: is the output non-empty? Is it above a minimum length? Does it contain the required sections? If not, it routes to an alert or a retry, not to the send.",
          track === 'tech'
            ? "The three error responses: (1) retry with exponential backoff — for transient failures like rate limits or API timeouts; (2) route to error branch — for structural failures like malformed output; (3) alert and halt — for compliance-critical failures where any continuation is risky."
            : "The failure modes for a summary workflow: AI returns empty output (holiday week with no data), AI returns a very short output (data pull was incomplete), AI output is missing required sections (prompt was changed). Each needs a different response: retry, alert, or abort.",
          track === 'tech'
            ? "The dead-letter pattern: items that fail processing go to a dead-letter queue (a separate sheet, a Slack channel, a database table) instead of being silently dropped. The queue is reviewed manually. No item is lost."
            : "The alert-and-abort pattern: if the validation check fails, send an alert to Rhea's Slack saying 'Monday summary validation failed — [reason]' and do not send the email. Better to get an alert than to send an empty brief to the director.",
          track === 'tech'
            ? "n8n error handling settings: in the node settings panel, set 'On Error' to 'Continue Error Output' to route failed items to an error branch instead of silently dropping them."
            : "The validation node is also a data quality checkpoint: if the AI output consistently fails validation, that's a signal that the upstream data or the prompt has changed. The validation failure rate is a workflow health metric.",
          track === 'tech'
            ? "Silent failures in compliance workflows are more dangerous than loud failures. A loud failure triggers a fix. A silent failure produces wrong decisions that nobody knows to question."
            : "Design the failure path first, before the happy path. Ask: what's the worst thing this workflow could do silently? That's the first validation check to add.",
        ], '#C2410C')}
        <GenAIConversationScene
          mentor={track === 'non-tech' ? 'kabir' : 'rohan'}
          track={track}
          accent={track === 'non-tech' ? '#0F766E' : '#2563EB'}
          techLines={[
            { speaker: 'protagonist', text: "The workflow ran overnight. 14 of 22 exceptions were classified. 8 are missing. No errors in the log. I don't understand how items can disappear without an error." },
            { speaker: 'mentor', text: "What's the error handling mode on the AI classification node?" },
            { speaker: 'protagonist', text: "I didn't change it. Default, I think." },
            { speaker: 'mentor', text: "Default in n8n is 'Continue' — when the node errors, it skips the item and keeps running. 8 items errored, got skipped, no alert fired." },
            { speaker: 'protagonist', text: "So the workflow just... dropped them?" },
            { speaker: 'mentor', text: "Silently. With green status. Every node executed successfully — it's just that 8 of those executions produced an error that was swallowed." },
            { speaker: 'protagonist', text: "How do I find out what happened to them?" },
            { speaker: 'mentor', text: "First: change the error mode to 'Continue Error Output' — that routes failed items to an error branch instead of dropping them. Second: add a dead-letter queue — any item that errors gets written to a separate sheet for manual review. Third: add an alert — if the error branch fires, send a Slack message before the next morning." },
            { speaker: 'protagonist', text: "So every node needs an error branch?" },
            { speaker: 'mentor', text: "Every node that processes critical data. For each node, answer three questions: what happens on timeout, what happens on unexpected format, what happens on silent success with wrong output. Design the response to each before you test the happy path." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "The workflow ran, all green, and sent an empty email. My director called to ask what happened." },
            { speaker: 'mentor', text: "What does your workflow do between the AI output and the email send?" },
            { speaker: 'protagonist', text: "Nothing. AI output goes straight to the email node." },
            { speaker: 'mentor', text: "So when the AI returns an empty string — because it was a holiday week with no exception data — the email node received an empty string and sent it successfully." },
            { speaker: 'protagonist', text: "I thought the AI would just... not produce an output if there was nothing to summarise." },
            { speaker: 'mentor', text: "The AI produces an output from whatever it receives. If it receives an empty data set, it might produce 'No exceptions this week' or it might produce nothing at all, depending on the prompt. Neither case should reach your director without a check." },
            { speaker: 'protagonist', text: "So I need a validation step." },
            { speaker: 'mentor', text: "An IF node before the email send: if the AI output is empty or under 50 characters, route to a Slack alert that says 'Monday summary is empty — check the exception sheet.' Don't send the email. Better your director sees no email and an alert than an email with nothing in it." },
          ]}
        />
        <GenAIAvatar
          name="Rohan"
          nameColor="#2563EB"
          borderColor="#2563EB"
          conceptId="genai-m4-errors"
          content={<>{track === 'tech' ? "Silent failures are more dangerous than loud ones. A loud failure triggers a fix immediately. A silent failure produces wrong decisions that nobody knows to question — and the workflow keeps running with the same flaw until someone notices the downstream impact." : "Output validation is not optional. Every automated workflow that produces output consumed by humans must check that output before sending it. The cost of a validation step is one node. The cost of skipping it is your director making decisions based on empty briefs."}</>}
          expandedContent={track === 'tech' ? "The three-question framework for every node: (1) timeout — use retry with exponential backoff for API timeouts; (2) unexpected format — route to error branch with the raw output logged; (3) successful but wrong — add output validation checks (minimum length, required fields, confidence score threshold). Design each response before running the first test." : "The validation node pattern: add a Code node before any send step. It checks output_length > 100 and output.includes('exceptions') (or whatever required sections you defined). If the check fails, the Code node throws an error that routes to an alert branch. If it passes, the data flows to the email node. This is a five-minute build that prevents the most expensive silent failure."}
          question={track === 'tech' ? "Aarav's overnight workflow ran with all green nodes. 8 of 22 exceptions are missing. No errors appear in the execution log. What is the most likely design gap?" : "Rhea's Monday report workflow ran with all green nodes and sent an empty email. What is the process gap?"}
          options={track === 'tech' ? [
            { text: "The AI classification node timed out on 8 exceptions and the workflow skipped them silently", correct: true, feedback: "Correct. The default error handling mode is 'Continue' — when a node errors, it skips the item and keeps running. 8 items errored, were dropped, and no alert fired. Changing to 'Continue Error Output' routes failed items to an error branch instead." },
            { text: "The email trigger only captured 14 of 22 exceptions", correct: false, feedback: "If the trigger missed 8 items, those items would never appear in the execution log at all — not even as attempted and skipped. The fact that all nodes show green means 22 items were processed, with 8 failing silently during processing." },
            { text: "The Slack notification failed and the exceptions are in a dead-letter queue", correct: false, feedback: "If exceptions were in a dead-letter queue, they would be visible somewhere. The symptom is that 8 items are completely missing — which points to silent drops, not queuing." },
            { text: "n8n has an execution limit that capped the run at 14 items", correct: false, feedback: "n8n does have execution limits on some plans, but hitting an execution limit produces a specific error message, not a silent drop of specific items within a single run." },
          ] : [
            { text: "The Google Sheets connection failed and the data was not available for the summary", correct: false, feedback: "A Sheets connection failure would produce an error on the Sheets node — not a green status. The green nodes confirm the data was retrieved successfully. The problem is what happened after retrieval." },
            { text: "The workflow has no output validation step — it sent whatever the AI produced, including empty output, without checking it first", correct: true, feedback: "Correct. The AI received an empty dataset (holiday week) and produced an empty output. The email node received that empty output and sent it successfully. Output validation before the send step would have caught this and routed to an alert instead." },
            { text: "Claude produced an empty output because the input data was malformed", correct: false, feedback: "Malformed input might cause Claude to produce a generic or error-type output, but not necessarily empty. The root cause is that no validation check exists between the AI output and the send — so whatever Claude produces, including nothing, goes directly to the email." },
            { text: "The email node sent successfully but the email client stripped the body", correct: false, feedback: "Email client rendering issues affect HTML formatting — they don't strip the entire body from a plain-text email. If the body arrived empty, it was sent empty." },
          ]}
        />
        <TiltCard style={{ margin: '28px 0' }}><ErrorPathCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'tech' ? "For each node in your exception classification workflow, answer three questions: (1) what happens if this node times out — retry, skip, or halt? (2) what happens if it returns an unexpected format — log and continue, or alert and halt? (3) what happens if it succeeds but produces a wrong output — how would you know? Add an error branch to any node where your answer to any question is 'I don't know.' Add a dead-letter queue write step to capture any item that fails processing." : "Add a validation node to your Monday summary workflow. Before the email send, add an IF node that checks: (1) is the AI output more than 100 characters? (2) does it contain the word 'exceptions'? If either check fails, route to a Slack alert that says 'Monday summary validation failed — [output_length] characters, missing expected content.' Test it by temporarily modifying the prompt to return a short output and verify the alert fires."} />
        <QuizEngine
          conceptId="genai-m4-errors"
          conceptName="Error Handling"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m4-errors',
            question: QUIZZES[3].question[track],
            options: QUIZZES[3].options[track],
            correctIndex: QUIZZES[3].correctIndex[track],
            explanation: QUIZZES[3].explanation[track],
            keyInsight: QUIZZES[3].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Error handling is in place. Aarav runs the full workflow end-to-end on a real exception. It succeeds. He marks it production-ready. Rohan has one question before signing off — and it's not about the success case." : "Validation is in place. Rhea runs the full workflow on test data. It works. She tells Kabir she's ready to go live. He asks her to run one more test — one she hasn't tried yet."} />
      </ChapterSection>

      {/* ── SECTION 05 ── */}
      <ChapterSection id="genai-m4-e2e" num="05" accentRgb={ACCENT_RGB}>
        {h2("Your first end-to-end workflow: production readiness means testing the failure path, not just the happy path.")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can define production readiness for a classification workflow — including the confidence threshold design, the human review queue, and what a 'verified output' means in a compliance context."
          : "\u25b6 After this section, you can run the baseline comparison test — comparing AI output to a manually produced reference — and explain why happy-path success doesn't mean production readiness."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'tech'
            ? <>Aarav runs the full end-to-end workflow on a real exception. Trigger fires. Email parsed. Classification runs. Slack notification sent. It works. He marks the workflow production-ready. Rohan asks him one question: &ldquo;What does the workflow do when the AI returns a confidence score below 0.6?&rdquo; Aarav has no answer.</>
            : <>Rhea&apos;s workflow runs successfully on her test dataset. All nodes green. Output looks reasonable. She tells Kabir she&apos;s ready to go live. Kabir asks her to run one more test before she does. Not a technical test — a quality test. He asks her to compare the AI output to last week&apos;s manually written brief.</>}
        </SituationCard>
        {para(track === 'tech'
          ? "Happy path success is not production readiness. The classification workflow succeeds when the AI returns a confident, correctly formatted category for a clean input. Production is full of inputs that aren't clean and AI calls that aren't confident. The failure path — what happens when confidence is low, when the category is ambiguous, when the input is malformed — must be designed before the workflow goes live."
          : "Test data passes because it was designed to pass. The real question is whether the workflow produces the same quality output as the manual process it's replacing. The baseline comparison test — run the workflow on last week's real data and compare the output to the brief that was actually sent — is the only test that answers the production readiness question directly."
        )}
        {keyBox(track === 'tech' ? "Designing the confidence threshold and human review queue" : "The baseline comparison test", [
          track === 'tech'
            ? "Every AI classification output has a confidence score or an implied confidence level. 'High confidence' without a calibration threshold is meaningless — it must be a number calibrated on labeled examples from your actual data."
            : "The baseline test: run the workflow on the last N weeks of real data. Compare each AI-generated output to the manually written brief for the same week. For each comparison, ask: would this AI brief have told me what I needed to know? Would my director have been able to act on it?",
          track === 'tech'
            ? "The confidence threshold design: items above threshold auto-route; items below threshold go to a human review queue. The threshold must be set based on labeled data — not intuition. An arbitrary threshold produces auto-routed items that are confidently wrong."
            : "The quality bar: the AI brief should be at least as useful as the manual brief for the three most common decision types. If it fails for any of those three, the workflow is not production-ready for that case.",
          track === 'tech'
            ? "The human review queue is a workflow component, not an escape hatch. It has an SLA (how long can an item sit before it must be reviewed?), a capacity design (how many items per day can analysts handle?), and a feedback loop (what happens to low-confidence items that analysts classify? Does that data improve the threshold?)."
            : "The failure cases to test explicitly: a holiday week with no exceptions, a week with an unusually high exception count, a week where all exceptions are the same type. Each of these is a realistic production scenario that test data rarely covers.",
          track === 'tech'
            ? "Verified output in a compliance context: the output of an automated classification must be traceable — which workflow, which model version, which prompt version, which input produced this classification. Logging these at the time of classification is a compliance requirement, not a feature."
            : "Go-live means the workflow runs without human supervision. The production readiness question is: if I don't look at the workflow output for a full week, will my director have received accurate, actionable briefs every Monday? If the answer is 'probably,' the workflow is not production-ready.",
          track === 'tech'
            ? "The go-live checklist: (1) confidence threshold calibrated on labeled data; (2) human review queue designed with SLA; (3) failure paths tested explicitly; (4) credentials owned by team accounts; (5) dead-letter queue in place; (6) compliance logging active."
            : "After go-live: monitor the first four weeks manually. Compare AI output to your manual check each week. Track validation failure rate. If the quality is consistently meeting the bar, reduce manual oversight. If it's not, diagnose before reducing oversight.",
        ], '#0891B2')}
        <GenAIConversationScene
          mentor={track === 'non-tech' ? 'kabir' : 'rohan'}
          track={track}
          accent={track === 'non-tech' ? '#0F766E' : '#2563EB'}
          techLines={[
            { speaker: 'protagonist', text: "The end-to-end test worked. Exception came in, got classified correctly, Slack notification fired. I'm marking it production-ready." },
            { speaker: 'mentor', text: "One question before you do. What does the workflow do when the AI classification returns a confidence score below 0.6?" },
            { speaker: 'protagonist', text: "I... don't have a confidence score in the output. I'm just using the category label." },
            { speaker: 'mentor', text: "So every classification auto-routes, regardless of how uncertain the model was?" },
            { speaker: 'protagonist', text: "The category label looks correct in the test." },
            { speaker: 'mentor', text: "Test data is clean. Production has ambiguous exceptions — categories that could legitimately be two things, descriptions that don't match any training pattern. What does the workflow do with those?" },
            { speaker: 'protagonist', text: "I don't know. Route them to... a default category?" },
            { speaker: 'mentor', text: "You need to add a confidence field to the AI output, set a threshold — calibrated on labeled examples, not guessed — and route below-threshold items to a human review queue. That queue needs an SLA. That queue needs capacity planning. And you need to log which workflow version produced which classification for compliance." },
            { speaker: 'protagonist', text: "I didn't think of any of that." },
            { speaker: 'mentor', text: "Happy path success is the beginning of production readiness, not the end. Test the failure path as rigorously as the success path. What the workflow does when it's uncertain is more important than what it does when it's confident." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "The workflow ran on test data. All green. Output looks good. I'm ready to go live." },
            { speaker: 'mentor', text: "Before you do — run it on last week's real data. The actual exception sheet from last Monday. Compare the AI output to the brief you actually sent." },
            { speaker: 'protagonist', text: "I didn't save last week's brief." },
            { speaker: 'mentor', text: "Find it. The test data was designed to pass. Last week's real data had whatever last week actually had — the edge cases, the ambiguities, the exceptions that don't fit neatly into a category." },
            { speaker: 'protagonist', text: "Okay. I ran it. The AI brief is shorter than mine and misses the pattern I flagged about regional escalations." },
            { speaker: 'mentor', text: "That's the answer to the production readiness question. The AI brief wouldn't have given your director what she needed last week. What's missing from the prompt?" },
            { speaker: 'protagonist', text: "It doesn't look for cross-regional patterns. I do that manually." },
            { speaker: 'mentor', text: "Then the workflow isn't ready until that step is designed — either as a prompt addition or as a separate analysis node. Go-live means no human supervision. If the output fails your quality bar for a realistic week, it fails the production test." },
          ]}
        />
        {PMPrincipleBox({ label: '◈ Principle', principle: "Production readiness is not 'the happy path works.' It is: I know what the workflow does in every failure case, I've tested those cases explicitly, and the output meets the quality bar of the manual process it replaces." })}
        <GenAIAvatar
          name={track === 'non-tech' ? 'Kabir' : 'Rohan'}
          nameColor={track === 'non-tech' ? '#0F766E' : '#2563EB'}
          borderColor={track === 'non-tech' ? '#0F766E' : '#2563EB'}
          conceptId="genai-m4-e2e"
          content={<>{track === 'tech' ? "Happy path success is the beginning of the production readiness test, not the end. The failure path — what the workflow does when confidence is low, input is malformed, or the API is slow — is what matters when the workflow runs at 2am without anyone watching." : "Test data passes because it was designed to pass. The baseline comparison test — run on last week's real data, compared to the brief that was actually sent — is the only test that answers the production readiness question."}</>}
          expandedContent={track === 'tech' ? "The confidence threshold is the most common production readiness gap in classification workflows. Teams set it arbitrarily (0.8 sounds good) without calibrating on labeled data. If 40% of your production inputs have ambiguous categories, an arbitrary 0.8 threshold produces a human review queue that's 40% of volume — which no analyst team can handle. Calibrate the threshold to a queue volume your team can actually review." : "The four-week monitoring protocol: for the first four weeks after go-live, Rhea reads the AI brief before sending it. She notes anything she would have changed. At week 4, she reviews the change list — if there are recurring patterns, they're prompt improvements. If the list is empty for the last two weeks, full automation is justified."}
          question={track === 'tech' ? "Aarav's end-to-end workflow succeeds on a real exception. He marks it production-ready. Rohan asks one question before signing off. What is it?" : "Rhea's Monday report workflow works on her test data. She's ready to go live. Kabir asks her to run one more test. What kind?"}
          options={track === 'tech' ? [
            { text: "What happens when the AI classification returns a low-confidence result?", correct: true, feedback: "Correct. Happy path success doesn't test the failure case. Every classification workflow needs a confidence threshold, a human review queue for below-threshold items, and defined SLAs for that queue. Without these, ambiguous items auto-route regardless of model certainty." },
            { text: "How long does the workflow take to run on a single exception?", correct: false, feedback: "Latency is a performance concern, not a production readiness concern. A workflow that takes 5 seconds per exception is production-ready if it handles the failure path correctly. A workflow that takes 0.5 seconds but silently drops low-confidence items is not." },
            { text: "Does the Slack notification render correctly on mobile?", correct: false, feedback: "Notification rendering is a UX detail. It doesn't affect whether exceptions are correctly classified or whether ambiguous items are handled appropriately." },
            { text: "Is the workflow connected to the right n8n environment?", correct: false, feedback: "Environment configuration is a setup check — not a production readiness question. Production readiness is about what the workflow does when things go wrong, not which environment it's pointed at." },
          ] : [
            { text: "Run it on last week's real data and compare the output to the manual report she wrote", correct: true, feedback: "Correct. Test data passes because it was designed to pass. The baseline comparison test — run on real data, compared to the manually produced brief — is the only test that directly answers whether the workflow meets the quality bar of the process it replaces." },
            { text: "Test it with an empty dataset to confirm it handles the edge case", correct: false, feedback: "Edge case testing is important but secondary. The primary production readiness test is whether the output meets the quality bar for normal production data — the kind of data the workflow will run on every week." },
            { text: "Run it twice to confirm it is idempotent", correct: false, feedback: "Idempotency (same output for same input on multiple runs) is a correctness property, but it doesn't test quality. A workflow can be perfectly idempotent and still produce briefs that miss critical patterns." },
            { text: "Check that the email address is correct before going live", correct: false, feedback: "Email address verification is a pre-flight check — important but not the production readiness test. The production readiness question is whether the output quality justifies removing human oversight." },
          ]}
        />
        <div style={{ margin: '28px 0' }}><N8nCanvasExplorer track={track} /></div>
        <ApplyItBox prompt={track === 'tech' ? "Before marking any classification workflow production-ready, complete this checklist: (1) add a confidence field to AI output and set a threshold calibrated on 20+ labeled examples; (2) build a human review queue for below-threshold items with a defined daily SLA; (3) log workflow version, model version, and prompt hash for every classification; (4) test three explicit failure cases: empty input, ambiguous input, and input that belongs to two categories. Document the workflow's behaviour for each. Sign off only when all four are done." : "Pull last week's real exception sheet. Run your workflow on it and save the AI output. Then pull the brief you actually sent last week. Compare them line by line. For each difference, write one sentence: is this a prompt gap (the prompt doesn't ask for this), a data gap (the data wasn't in the sheet), or a quality bar gap (the AI version is acceptable but different)? Count the prompt gaps. Each one is a workflow improvement before go-live."} />
        <QuizEngine
          conceptId="genai-m4-e2e"
          conceptName="End-to-End Thinking"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m4-e2e',
            question: QUIZZES[4].question[track],
            options: QUIZZES[4].options[track],
            correctIndex: QUIZZES[4].correctIndex[track],
            explanation: QUIZZES[4].explanation[track],
            keyInsight: QUIZZES[4].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "The exception classification workflow is live at 20 records per day. Leadership wants 200. Aarav adds a Loop node. 200 OpenAI calls fire simultaneously — and hit the rate limit." : "The Monday summary workflow is live and working. Her manager asks for a second: a weekly renewal digest covering 80 accounts from a new spreadsheet. Rhea adds a Loop node. First run: one output. The other 79 renewals never processed."} />
      </ChapterSection>
    </>
  );
}

export default function GenAIPreRead4({ track, onBack }: Props) {
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
          setActiveSection(sectionId);
          setCompletedSections((prev) => new Set([...prev, sectionId]));
          store.markSectionViewed(sectionId);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -25% 0px' });

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
                <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: `linear-gradient(135deg, ${ACCENT} 0%, #0D9488 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 8px rgba(${ACCENT_RGB},0.3)` }}>
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
            <CoreContent track={track} completedSections={completedSections} activeSection={activeSection} />
            <AnimatePresence>
              {progressPct >= 80 ? (
                <motion.div initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} style={{ padding: '40px 32px', background: 'var(--ed-card)', borderRadius: '10px', textAlign: 'center' as const, position: 'relative', overflow: 'hidden', marginBottom: '40px', border: '1px solid var(--ed-rule)', borderTop: `4px solid ${ACCENT}` }}>
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: '40px', marginBottom: '14px' }}>&#9678;</motion.div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px', color: 'var(--ed-ink)', fontFamily: "'Lora', 'Georgia', serif" }}>Pre-Read 04 Complete</h3>
                  <p style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.8, maxWidth: '430px', margin: '0 auto 24px' }}>
                    {track === 'tech' ? 'You now have the workflow automation toolkit: process-first spec design, JSON edge handoffs, service-account credential hygiene, explicit error paths with dead-letter queues, and failure-path production readiness.' : 'You now know how to automate the Monday workflow reliably: trigger design, data transformation, output validation, team-owned credentials, and the baseline comparison test before going live.'}
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

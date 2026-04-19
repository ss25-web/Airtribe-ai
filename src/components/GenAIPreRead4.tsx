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
  { id: 'genai-m4-mindset', icon: 'WF', label: 'Node Thinker',   color: '#0F766E', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'genai-m4-nodes',   icon: 'TR', label: 'Flow Architect', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  { id: 'genai-m4-connect', icon: 'AT', label: 'Auth Aware',      color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { id: 'genai-m4-errors',  icon: 'EH', label: 'Error Handler',   color: '#C2410C', bg: '#FFF7ED', border: '#FED7AA' },
  { id: 'genai-m4-e2e',     icon: 'E2', label: 'End-to-End',      color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC' },
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

// ── M4 TiltCard Mockups ──────────────────────────────────────────────────────

const WorkflowAnatomy = ({ track }: { track: GenAITrack }) => {
  const nodes = track === 'tech' ? [
    { label: 'Email\nTrigger', icon: '✉', color: '#0F766E', type: 'TRIGGER' },
    { label: 'Extract\nFields', icon: '⬡', color: '#2563EB', type: 'DATA' },
    { label: 'Format\nInput', icon: '⟳', color: '#7C3AED', type: 'TRANSFORM' },
    { label: 'OpenAI\nClassify', icon: '✦', color: '#F59E0B', type: 'AI NODE', highlight: true },
    { label: 'Write to\nTracker', icon: '⊞', color: '#16A34A', type: 'OUTPUT' },
  ] : [
    { label: 'Schedule\nTrigger', icon: '⏱', color: '#0F766E', type: 'TRIGGER' },
    { label: 'Sheets\nFetch', icon: '⊞', color: '#2563EB', type: 'DATA' },
    { label: 'Set\nFields', icon: '⟳', color: '#7C3AED', type: 'TRANSFORM' },
    { label: 'Claude\nSummarise', icon: '✦', color: '#F59E0B', type: 'AI NODE', highlight: true },
    { label: 'Send\nEmail', icon: '✉', color: '#16A34A', type: 'OUTPUT' },
  ];
  return (
    <div style={{ background: '#0D1117', borderRadius: '12px', padding: '20px 24px', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#8B949E', marginBottom: '20px' }}>WORKFLOW ANATOMY — AI IS ONE NODE IN FIVE</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', overflowX: 'auto' as const }}>
        {nodes.map((n, i) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '6px', minWidth: '72px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '10px', background: n.highlight ? `rgba(245,158,11,0.15)` : 'rgba(255,255,255,0.04)', border: `2px solid ${n.highlight ? n.color : n.color + '50'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: n.highlight ? `0 0 16px ${n.color}40` : 'none' }}>{n.icon}</div>
              <div style={{ fontSize: '8px', fontWeight: 700, color: n.highlight ? n.color : '#6B7280', letterSpacing: '0.06em', textAlign: 'center' as const }}>{n.type}</div>
              <div style={{ fontSize: '10px', color: n.highlight ? '#C9D1D9' : '#9CA3AF', textAlign: 'center' as const, lineHeight: 1.3, whiteSpace: 'pre-line' as const }}>{n.label}</div>
            </div>
            {i < nodes.length - 1 && <div style={{ color: '#374151', fontSize: '18px', margin: '0 4px', paddingBottom: '28px', flexShrink: 0 }}>—</div>}
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: '16px', padding: '8px 12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '6px', fontSize: '10px', color: '#D97706' }}>The AI node (highlighted) executes whatever you pass it. The 4 surrounding nodes determine what it receives and what happens to its output.</div>
    </div>
  );
};

const NodeTypeMapCard = ({ track }: { track: GenAITrack }) => {
  const categories = [
    {
      label: 'TRIGGER NODES', color: '#0F766E', bg: 'rgba(15,118,110,0.08)', border: 'rgba(15,118,110,0.2)',
      nodes: track === 'tech' ? ['Email / Gmail', 'Webhook (HTTP)', 'Schedule / Cron', 'Form submission'] : ['Schedule / Cron', 'Google Form', 'Webhook (HTTP)', 'Manual trigger'],
      note: 'Start the workflow. One per workflow.',
    },
    {
      label: 'DATA NODES', color: '#2563EB', bg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.2)',
      nodes: track === 'tech' ? ['HTTP Request', 'Google Sheets', 'Postgres / MySQL', 'AWS S3'] : ['Google Sheets', 'Airtable', 'HTTP Request', 'Gmail read'],
      note: 'Fetch or write external data.',
    },
    {
      label: 'TRANSFORM NODES', color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)',
      nodes: ['Set (rename/format fields)', 'Code (custom JS/Python)', 'IF / Switch (branching)', 'Merge (combine inputs)'],
      note: 'Shape data between nodes.',
    },
    {
      label: 'AI NODES', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)',
      nodes: ['OpenAI (GPT-4, GPT-3.5)', 'Anthropic (Claude)', 'Google AI (Gemini)', 'AI Agent (with tools)'],
      note: 'Language work only. Needs clean input.',
    },
  ];
  return (
    <div style={{ background: '#FAFAF9', border: '1px solid #E7E5E4', borderRadius: '12px', padding: '20px 24px' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.14em', color: '#78716C', marginBottom: '14px' }}>n8n NODE TYPE MAP — WHAT EACH CATEGORY DOES</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {categories.map((cat) => (
          <div key={cat.label} style={{ background: cat.bg, border: `1px solid ${cat.border}`, borderRadius: '8px', padding: '12px 14px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: cat.color, letterSpacing: '0.1em', marginBottom: '8px' }}>{cat.label}</div>
            {cat.nodes.map((n, i) => (
              <div key={i} style={{ fontSize: '10px', color: '#44403C', marginBottom: '4px', paddingLeft: '8px', borderLeft: `2px solid ${cat.border}` }}>{n}</div>
            ))}
            <div style={{ marginTop: '8px', fontSize: '9px', color: '#78716C', fontStyle: 'italic' }}>{cat.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CredentialCard = ({ track }: { track: GenAITrack }) => {
  const creds = [
    {
      type: 'API Key', color: '#2563EB', risk: 'LOW RISK', riskColor: '#16A34A',
      owner: 'Shared team key — stored in n8n credential manager',
      note: 'Key is scoped, revocable, not tied to any individual login.',
    },
    {
      type: 'OAuth 2.0 (Personal Account)', color: '#F59E0B', risk: 'HIGH RISK', riskColor: '#DC2626',
      owner: track === 'tech' ? "Aarav's personal Google account" : "Rhea's personal Google account",
      note: 'Token invalidates on password change, 2FA update, or offboarding. Single point of failure.',
    },
    {
      type: 'Service Account (Recommended)', color: '#0F766E', risk: 'RECOMMENDED', riskColor: '#0F766E',
      owner: 'team-automation@northstar.iam — shared, no personal login dependency',
      note: 'Team-owned, survives personnel changes, auditable in IAM console.',
    },
  ];
  return (
    <div style={{ background: '#0D1117', borderRadius: '12px', padding: '20px 24px', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#8B949E', marginBottom: '16px' }}>CREDENTIAL TYPES — OWNERSHIP & FAILURE RISK</div>
      <div style={{ display: 'grid', gap: '10px' }}>
        {creds.map((c) => (
          <div key={c.type} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${c.color}30`, borderRadius: '8px', padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: c.color }}>{c.type}</div>
              <div style={{ fontSize: '8px', fontWeight: 700, color: c.riskColor, background: `${c.riskColor}15`, padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.08em' }}>{c.risk}</div>
            </div>
            <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '4px' }}>Owner: <span style={{ color: '#C9D1D9' }}>{c.owner}</span></div>
            <div style={{ fontSize: '10px', color: '#6B7280', fontStyle: 'italic' }}>{c.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ErrorPathCard = ({ track }: { track: GenAITrack }) => {
  const trigger = track === 'tech' ? 'Email Trigger' : 'Schedule Trigger';
  const aiNode = track === 'tech' ? 'OpenAI Classify' : 'Claude Summarise';
  const output = track === 'tech' ? 'Write to Tracker' : 'Send Email';
  return (
    <div style={{ background: '#FAFAF9', border: '1px solid #E7E5E4', borderRadius: '12px', padding: '20px 24px' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.14em', color: '#78716C', marginBottom: '16px' }}>ERROR ROUTING — EVERY NODE NEEDS A FAILURE PATH</div>
      <div style={{ display: 'grid', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const }}>
          {[trigger, 'Set Fields', aiNode, 'Validate Output', output].map((n, i, arr) => (
            <React.Fragment key={i}>
              <div style={{ padding: '6px 12px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', fontSize: '10px', color: '#166534', fontWeight: 500 }}>{n}</div>
              {i < arr.length - 1 && <div style={{ color: '#16A34A', fontSize: '12px' }}>→</div>}
            </React.Fragment>
          ))}
          <div style={{ marginLeft: '4px', padding: '4px 8px', background: '#F0FDF4', border: '1px dashed #BBF7D0', borderRadius: '4px', fontSize: '9px', color: '#16A34A', fontWeight: 700 }}>✓ SUCCESS PATH</div>
        </div>
        <div style={{ borderLeft: '2px solid #E7E5E4', marginLeft: '60px', paddingLeft: '12px', display: 'grid', gap: '6px' }}>
          <div style={{ fontSize: '9px', color: '#78716C', fontFamily: "'JetBrains Mono', monospace" }}>⤷ ANY NODE FAILURE →</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const }}>
            {['Error Catch', 'Slack Alert', 'Dead Letter Queue'].map((n, i, arr) => (
              <React.Fragment key={i}>
                <div style={{ padding: '6px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', fontSize: '10px', color: '#991B1B', fontWeight: 500 }}>{n}</div>
                {i < arr.length - 1 && <div style={{ color: '#DC2626', fontSize: '12px' }}>→</div>}
              </React.Fragment>
            ))}
            <div style={{ marginLeft: '4px', padding: '4px 8px', background: '#FEF2F2', border: '1px dashed #FECACA', borderRadius: '4px', fontSize: '9px', color: '#DC2626', fontWeight: 700 }}>✗ ERROR PATH</div>
          </div>
          <div style={{ fontSize: '9px', color: '#78716C', fontStyle: 'italic' }}>Slack alert fires → on-call reviews dead letter → manual reprocess. Nothing lost silently.</div>
        </div>
        <div style={{ padding: '8px 12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '6px', fontSize: '10px', color: '#92400E', fontFamily: "'JetBrains Mono', monospace" }}>Validate Output checks: output length &gt; 50 chars AND required fields present. Fails → error path, not silent send.</div>
      </div>
    </div>
  );
};

const E2EWorkflowCanvas = ({ track }: { track: GenAITrack }) => {
  const nodes = track === 'tech' ? [
    { label: 'Email Trigger', sub: 'On receive', color: '#0F766E', icon: '✉' },
    { label: 'Set Fields', sub: 'policy_code, body', color: '#7C3AED', icon: '⟳' },
    { label: 'OpenAI', sub: 'classify → JSON', color: '#F59E0B', icon: '✦' },
    { label: 'IF Node', sub: 'confidence ≥ 0.8', color: '#2563EB', icon: '⟨⟩' },
    { label: 'Write Tracker', sub: 'Sheets row append', color: '#16A34A', icon: '⊞' },
    { label: 'Human Review', sub: 'Slack alert', color: '#DC2626', icon: '⚑' },
  ] : [
    { label: 'Mon 7am', sub: 'Schedule trigger', color: '#0F766E', icon: '⏱' },
    { label: 'Fetch Sheet', sub: 'Exception rows', color: '#2563EB', icon: '⊞' },
    { label: 'Set Fields', sub: 'exception_text', color: '#7C3AED', icon: '⟳' },
    { label: 'Claude', sub: 'summarise → text', color: '#F59E0B', icon: '✦' },
    { label: 'Validate', sub: 'length + keywords', color: '#0891B2', icon: '✓' },
    { label: 'Send Email', sub: 'Director + CC', color: '#16A34A', icon: '✉' },
  ];
  return (
    <div style={{ background: '#172B4D', borderRadius: '12px', padding: '20px 24px', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#8993A4' }}>n8n CANVAS — {track === 'tech' ? 'EXCEPTION CLASSIFICATION WORKFLOW' : 'MONDAY SUMMARY WORKFLOW'}</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['#FF5F57', '#FFBD2E', '#28CA41'].map((c, i) => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', flexWrap: 'wrap' as const }}>
        {nodes.map((n, i) => (
          <React.Fragment key={i}>
            <div style={{ background: '#253858', border: `1.5px solid ${n.color}60`, borderRadius: '8px', padding: '10px 12px', minWidth: '80px', textAlign: 'center' as const, borderTop: `3px solid ${n.color}` }}>
              <div style={{ fontSize: '16px', marginBottom: '4px' }}>{n.icon}</div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#C1C7D0', marginBottom: '2px' }}>{n.label}</div>
              <div style={{ fontSize: '8px', color: '#8993A4' }}>{n.sub}</div>
            </div>
            {i < nodes.length - 1 && i !== 3 && <div style={{ color: '#4C5F79', fontSize: '16px', paddingTop: '16px', flexShrink: 0 }}>→</div>}
            {i === 3 && track === 'tech' && <div style={{ color: '#4C5F79', fontSize: '11px', paddingTop: '16px', flexShrink: 0 }}>→↓</div>}
          </React.Fragment>
        ))}
      </div>
      {track === 'tech' && <div style={{ marginTop: '10px', fontSize: '9px', color: '#8993A4' }}>IF confidence &lt; 0.8 → routes to Human Review (Slack). IF confidence ≥ 0.8 → writes to Tracker directly.</div>}
    </div>
  );
};

// ── End M4 TiltCard Mockups ───────────────────────────────────────────────────

function CoreContent({ track }: { track: GenAITrack }) {
  const moduleContext = TRACK_META[track].moduleContext;
  return (
    <>
      {/* Module Hero */}
      <div style={{ background: 'var(--ed-cream)', borderRadius: '14px', padding: '36px 36px 28px', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
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
        </div>
      </div>

      <div style={{ marginBottom: '10px', padding: '16px 20px', borderRadius: '10px', background: `rgba(${ACCENT_RGB},0.08)`, border: `1px solid rgba(${ACCENT_RGB},0.18)` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: ACCENT, marginBottom: '8px' }}>{TRACK_META[track].label.toUpperCase()}</div>
        <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>{track === 'tech' ? "Your lens: how do you build a reliable automated pipeline where the AI node is one piece of a well-engineered system — with proper credentials, error handling, and failure paths that work at 2am without anyone watching?" : "Your lens: how do you turn a manual Monday morning workflow into a reliable automated system — standardising the prompt, the data pull, the output check, and the send, so your director gets the right brief whether or not you're at your desk?"}</div>
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
        <TiltCard style={{ margin: '28px 0' }}><E2EWorkflowCanvas track={track} /></TiltCard>
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
        <NextChapterTeaser text={track === 'tech' ? "The exception classification workflow is live at 20 records per day. Leadership wants 200. Aarav adds a Loop node. 200 OpenAI calls fire simultaneously — and hit the rate limit." : "The Monday summary workflow is live. Rhea wants individual briefings for all 8 analysts. She adds a Loop node. Three analysts get empty briefings. She doesn't know why."} />
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
            <CoreContent track={track} />
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

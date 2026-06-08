'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import QuizEngine from './QuizEngine';
import GenAIAvatar, { GenAIConversationScene, GenAIHeroCharacterStrip } from './GenAIAvatar';
import type { GenAITrack } from './genaiTypes';
import {
  ApplyItBox,
  ChapterSection,
  NextChapterTeaser,
  PMPrincipleBox,
  SituationCard,
  TiltCard,
  chLabel,
  h2,
  keyBox,
  para,
  pullQuote,
} from './pm-fundamentals/designSystem';
import GenAIPreReadLayout from './GenAIPreReadLayout';

const ACCENT = '#7C3AED';
const ACCENT_RGB = '124,58,237';
const TRACK_META: Record<GenAITrack, { label: string; shortLabel: string; introTitle: string; moduleContext: string }> = {
  'builder': {
    label: 'Builder Track',
    shortLabel: 'Non-Tech',
    introTitle: 'Introduction to GenAI · Operator Lens',
    moduleContext: `GenAI Launchpad · Non-Tech Track · Pre-Read 01 · Introduction to Generative AI.
Follows Rhea, an operations lead at Northstar Health, as she moves from confused AI experiments to a clear mental model for what GenAI is, what it reliably does, and how to select a first use case worth building.`,
  },
  engineer: {
    label: 'Engineer Track',
    shortLabel: 'Tech',
    introTitle: 'Introduction to GenAI · Builder Lens',
    moduleContext: `GenAI Launchpad · Tech Track · Pre-Read 01 · Introduction to Generative AI.
Follows Aarav, a platform engineer at Northstar Health, as he moves from a vague integration ticket to a clear framework for evaluating LLM use cases, understanding capability zones, and selecting the right first candidate.`,
  },
};


const QUIZZES = [
  {
    question: "AI keeps returning wrong policy details. A colleague says the model is too weak. What is the stronger first response?",
    options: [
      'A. Agree — policy tasks need a stronger model trained on recent data',
      'B. Check what context was sent and whether retrieval was part of the design',
      'C. Write much longer prompts with the full policy text pasted inline each time',
      'D. Run the prompt on three different models and use the most consistent answer',
    ],
    correctIndex: 1,
    explanation: 'Policy details require specific, current information the model cannot hold in weights. The fix is a retrieval layer — not a stronger model. Stronger models hallucinate policy details just as confidently.',
    conceptId: 'genai-m1-what-it-is',
    keyInsight: 'The model completes. It does not retrieve. These are different failure modes with different fixes.',
  },
  {
    question: 'Which task belongs in the reliable zone without a retrieval layer?',
    options: [
      'A. Check whether each exception was resolved within the 48-hour SLA window',
      'B. Classify inbound requests by type based on their description',
      'C. Pull and summarise the last 20 unread emails automatically',
      'D. Look up the current premium rate for a given policy and coverage tier',
    ],
    correctIndex: 1,
    explanation: 'Classification from a description with defined categories is a language task — no external data needed. The others require live system access the model does not have.',
    conceptId: 'genai-m1-capabilities',
    keyInsight: 'Reliable zone = language in, language out, no live data required. Everything else needs retrieval infrastructure.',
  },
  {
    question: 'A summarisation task gives excellent output sometimes and generic output other times. Most likely cause?',
    options: [
      'A. The model is non-deterministic and high variance is a fundamental limitation',
      'B. The brief is missing format or length constraints',
      'C. The prompt needs more examples to anchor the style and register',
      'D. The model is degrading — retraining on domain data would stabilise it',
    ],
    correctIndex: 1,
    explanation: 'When format, length, and structure are unspecified, the model fills those gaps differently each run. Defining them tightens variance dramatically without any model changes.',
    conceptId: 'genai-m1-mental-model',
    keyInsight: 'Variance almost always signals an underspecified brief, not a broken model.',
  },
  {
    question: 'A model works well in demo but produces poor outputs in staging. First thing to investigate?',
    options: [
      'A. Whether model drift has occurred between the demo and staging environments',
      'B. Whether the context in staging is as complete and clean as in the demo',
      'C. Whether the prompt template is rendering differently across environments',
      'D. Whether a higher-tier model is needed to handle real production edge cases',
    ],
    correctIndex: 1,
    explanation: 'Demo data is curated to be clean. Staging data is real — missing fields, truncated text, edge cases. That difference in context quality almost always explains the output quality gap.',
    conceptId: 'genai-m1-context',
    keyInsight: 'Demo-to-production gaps are a context problem. The payload is the first thing to inspect.',
  },
  {
    question: 'Which candidate makes the best first AI use case?',
    options: [
      'A. Auto-approve routine policy exceptions to cut manual review time significantly',
      'B. Classify inbound requests and flag uncertain cases for human review',
      'C. Migrate the case management system to a fully autonomous AI agent pipeline',
      'D. Generate and send personalised customer emails with async human spot-checks',
    ],
    correctIndex: 1,
    explanation: 'Classification with a review gate is bounded, language-based, easy to verify, and recoverable. The others involve irreversibility, high stakes, or scope that outpaces what the system has earned.',
    conceptId: 'genai-m1-use-case-readiness',
    keyInsight: 'Win clearly, verify easily, fail cheaply. That is the brief for the first use case.',
  },
];

const CONCEPTS = [
  { id: 'genai-m1-what-it-is', label: 'What GenAI Is', color: '#7C3AED' },
  { id: 'genai-m1-capabilities', label: 'Capability Map', color: '#2563EB' },
  { id: 'genai-m1-mental-model', label: 'Mental Model', color: '#0F766E' },
  { id: 'genai-m1-context', label: 'Context as Input', color: '#C2410C' },
  { id: 'genai-m1-use-case-readiness', label: 'Use-Case Readiness', color: '#DC2626' },
];
const SECTIONS = [
  { id: 'genai-m1-whatitis', label: 'What Is This Thing?' },
  { id: 'genai-m1-capabilities', label: 'The Capability Map' },
  { id: 'genai-m1-mental-model', label: 'The Mental Model Shift' },
  { id: 'genai-m1-context', label: 'Context Is the Input' },
  { id: 'genai-m1-apply', label: 'Your First Use Case' },
];
const BADGES = [
  { id: 'genai-m1-whatitis', icon: '🤖', label: 'Model', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  { id: 'genai-m1-capabilities', icon: '🧭', label: 'Capability', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { id: 'genai-m1-mental-model', icon: '🧠', label: 'Mindset', color: '#0F766E', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'genai-m1-context', icon: '🧩', label: 'Context', color: '#C2410C', bg: '#FFF7ED', border: '#FED7AA' },
  { id: 'genai-m1-apply', icon: '🎯', label: 'Use Case', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
];
const SECTION_XP = 50;
const QUIZ_XP = 100;


// TokenProbCard rebuilt as the OpenAI Playground Completion view with the
// Show probabilities toggle ON. The completion at the top renders each
// generated token with a transparent purple highlight whose intensity
// matches that token's probability — exactly how the real Playground
// shows logprobs. Hovering a token reveals its top-3 next-token candidates
// in a popover (probability distribution as a bar chart).
const TokenProbCard = ({ track }: { track: GenAITrack }) => {
  type Token = { word: string; chosenP: number; alts: { label: string; p: number }[] };
  const promptText = track === 'engineer'
    ? 'The next AI completion will be'
    : 'The escalation procedure for this case is';
  const tokens: Token[] = track === 'engineer'
    ? [
        { word: 'The',       chosenP: 0.72, alts: [{ label: 'The', p: 0.72 }, { label: 'A', p: 0.14 }, { label: 'This', p: 0.09 }] },
        { word: ' model',    chosenP: 0.68, alts: [{ label: ' model', p: 0.68 }, { label: ' system', p: 0.18 }, { label: ' API', p: 0.09 }] },
        { word: ' generates', chosenP: 0.55, alts: [{ label: ' generates', p: 0.55 }, { label: ' predicts', p: 0.28 }, { label: ' returns', p: 0.12 }] },
        { word: ' plausible', chosenP: 0.41, alts: [{ label: ' plausible', p: 0.41 }, { label: ' likely', p: 0.33 }, { label: ' probable', p: 0.19 }] },
        { word: ' text.',     chosenP: 0.58, alts: [{ label: ' text.', p: 0.58 }, { label: ' output.', p: 0.24 }, { label: ' content.', p: 0.13 }] },
      ]
    : [
        { word: 'The',         chosenP: 0.72, alts: [{ label: 'The', p: 0.72 }, { label: 'A', p: 0.14 }, { label: 'This', p: 0.09 }] },
        { word: ' procedure',  chosenP: 0.61, alts: [{ label: ' procedure', p: 0.61 }, { label: ' process', p: 0.23 }, { label: ' protocol', p: 0.11 }] },
        { word: ' for',        chosenP: 0.79, alts: [{ label: ' for', p: 0.79 }, { label: ' when', p: 0.12 }, { label: ' in', p: 0.07 }] },
        { word: ' compliance', chosenP: 0.48, alts: [{ label: ' compliance', p: 0.48 }, { label: ' regulatory', p: 0.31 }, { label: ' internal', p: 0.17 }] },
        { word: ' issues.',    chosenP: 0.54, alts: [{ label: ' issues.', p: 0.54 }, { label: ' matters.', p: 0.26 }, { label: ' concerns.', p: 0.15 }] },
      ];

  const [hover, setHover] = useState<number | null>(null);

  const playgroundBg = '#0F0F0F';
  const panelBg = '#171717';
  const panelBorder = '1px solid #262626';
  const labelStyle: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: '#737373', textTransform: 'uppercase' as const };

  return (
    <div style={{
      background: playgroundBg, borderRadius: 12, overflow: 'hidden',
      border: '1px solid #1F1F1F', boxShadow: '0 14px 36px rgba(0,0,0,0.45)',
      color: '#E5E5E5', fontFamily: "Inter, -apple-system, system-ui, sans-serif",
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: panelBorder, background: '#0A0A0A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, background: 'linear-gradient(135deg, #10A37F, #0E8567)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 900 }}>◯</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#E5E5E5' }}>Playground</div>
          <div style={{ fontSize: 10, color: '#525252' }}>·</div>
          <div style={{ fontSize: 11, color: '#A3A3A3' }}>Completion</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(16,163,127,0.12)', border: '1px solid rgba(16,163,127,0.40)', fontSize: 10, color: '#10A37F', fontFamily: "'JetBrains Mono', monospace" }}>show probabilities · ON</div>
          <div style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600, color: '#A3A3A3', border: '1px solid #262626' }}>View code</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 200px', gap: 0 }}>
        {/* LEFT: completion */}
        <div style={{ borderRight: panelBorder }}>
          <div style={{ padding: '14px 16px 10px', borderBottom: panelBorder }}>
            <div style={labelStyle}>PROMPT</div>
            <div style={{ marginTop: 6, padding: '10px 12px', background: panelBg, border: panelBorder, borderRadius: 7, fontSize: 13, color: '#E5E5E5', fontFamily: "'JetBrains Mono', monospace" }}>
              {promptText}<span style={{ color: '#525252' }}>▎</span>
            </div>
          </div>

          {/* Completion area with logprobs highlighting */}
          <div style={{ padding: '14px 16px 14px', minHeight: 110, position: 'relative' as const }}>
            <div style={labelStyle}>COMPLETION · top-prob highlighting</div>
            <div style={{ marginTop: 6, padding: '12px 14px', background: panelBg, border: panelBorder, borderRadius: 7, fontFamily: "'JetBrains Mono', monospace", fontSize: 14, lineHeight: 2, position: 'relative' as const, minHeight: 56 }}>
              {/* Prompt prefix in light gray */}
              <span style={{ color: '#525252' }}>{promptText}</span>
              {/* Generated tokens with intensity-based highlighting */}
              {tokens.map((t, i) => {
                const isHover = hover === i;
                return (
                  <span
                    key={i}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    style={{
                      background: `rgba(124,58,237,${0.18 + (1 - t.chosenP) * 0.40})`,
                      borderRadius: 3,
                      padding: '1px 1px',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      boxShadow: isHover ? '0 0 0 1.5px rgba(167,139,250,0.65)' : 'none',
                      color: '#F5F5F5',
                    }}
                  >{t.word}</span>
                );
              })}
              <span style={{ color: '#525252' }}>▎</span>

              {/* Popover for hovered token */}
              {hover !== null && (
                <div style={{
                  position: 'absolute' as const,
                  top: 0, right: 14,
                  width: 240,
                  background: '#0A0A0A',
                  border: '1px solid #3F3F46',
                  borderRadius: 7,
                  padding: '10px 12px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
                  zIndex: 5,
                  fontFamily: 'inherit',
                }}>
                  <div style={{ ...labelStyle, marginBottom: 8 }}>TOP-3 NEXT TOKENS</div>
                  {tokens[hover].alts.map((a, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      <div style={{ minWidth: 86, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: j === 0 ? '#A78BFA' : '#A3A3A3' }}>{a.label || '∅'}</div>
                      <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 2.5 }}>
                        <div style={{ height: '100%', width: `${a.p * 100}%`, background: j === 0 ? '#7C3AED' : 'rgba(124,58,237,0.35)', borderRadius: 2.5 }} />
                      </div>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: j === 0 ? '#A78BFA' : '#737373', minWidth: 32, textAlign: 'right' as const }}>{Math.round(a.p * 100)}%</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid #262626', fontSize: 9.5, color: '#737373', lineHeight: 1.5 }}>
                    Model chose <strong style={{ color: '#A78BFA' }}>{tokens[hover].alts[0].label.trim()}</strong> at {Math.round(tokens[hover].chosenP * 100)}% — picked, sampled, moved on.
                  </div>
                </div>
              )}
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: '#737373', lineHeight: 1.6 }}>
              Highlight intensity ∝ <span style={{ color: '#E5E5E5' }}>1 − probability</span> · hover any token to see its candidates · the model picks the top, repeats, no reasoning.
            </div>
          </div>

          {/* Bottom token stream */}
          <div style={{ padding: '10px 16px', borderTop: panelBorder, background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap' as const }}>
              {tokens.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#A78BFA' }}>{t.word.replace(' ', '·')}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#525252' }}>{Math.round(t.chosenP * 100)}</span>
                </div>
              ))}
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#525252' }}>greedy · top_k=1</span>
          </div>
        </div>

        {/* RIGHT: controls */}
        <div style={{ padding: '14px 14px 14px' }}>
          <div style={labelStyle}>MODEL</div>
          <div style={{ marginTop: 6, padding: '6px 10px', background: panelBg, border: panelBorder, borderRadius: 6, fontSize: 11.5, color: '#E5E5E5', display: 'flex', justifyContent: 'space-between' }}>
            <span>gpt-4o</span><span style={{ color: '#525252' }}>▾</span>
          </div>

          <div style={{ marginTop: 14, ...labelStyle }}>TEMPERATURE</div>
          <div style={{ marginTop: 6, padding: '6px 10px', background: panelBg, border: panelBorder, borderRadius: 6 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#E5E5E5', textAlign: 'center' as const }}>0.00</div>
          </div>

          <div style={{ marginTop: 14, ...labelStyle }}>TOP_P</div>
          <div style={{ marginTop: 6, padding: '6px 10px', background: panelBg, border: panelBorder, borderRadius: 6 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#E5E5E5', textAlign: 'center' as const }}>1.00</div>
          </div>

          <div style={{ marginTop: 14, ...labelStyle }}>LEGEND</div>
          <div style={{ marginTop: 6, display: 'grid', gap: 4 }}>
            {[
              { intensity: 0.85, label: 'low confidence' },
              { intensity: 0.55, label: 'medium' },
              { intensity: 0.20, label: 'high confidence' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 16, height: 12, background: `rgba(124,58,237,${l.intensity})`, borderRadius: 3 }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#A3A3A3' }}>{l.label}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, padding: '8px 10px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.30)', borderRadius: 6, fontSize: 10, color: '#C4B5FD', lineHeight: 1.55 }}>
            <strong>Generation ≠ retrieval.</strong> Every token is a probabilistic pick from the model's weights — no lookup happened.
          </div>
        </div>
      </div>
    </div>
  );
};

// CapabilityZoneCard rebuilt as a Linear-style kanban board. Real Linear
// chrome: dark sidebar with team / view list, top bar with the project
// title and STATUS / BAG breadcrumb, three columns (Reliable / Extended
// / Unreliable) with status pills, draggable task cards with Linear's
// monospace ticket IDs (TASK-1..6) and priority dots. Wrong drops shake
// red; correct drops land in the column.
type ZoneKey = 'reliable' | 'extended' | 'unreliable';
const CapabilityZoneCard = ({ track }: { track: GenAITrack }) => {
  const ZONES: { key: ZoneKey; label: string; color: string; bg: string; pill: string; sub: string }[] = [
    { key: 'reliable',   label: 'Reliable',   color: '#10B981', bg: 'rgba(16,185,129,0.06)',  pill: 'IN PROGRESS', sub: 'Text in, text out.' },
    { key: 'extended',   label: 'Extended',   color: '#F59E0B', bg: 'rgba(245,158,11,0.06)',  pill: 'BLOCKED',     sub: 'Reliable with retrieval.' },
    { key: 'unreliable', label: 'Unreliable', color: '#EF4444', bg: 'rgba(239,68,68,0.06)',   pill: 'CANCELLED',   sub: 'Wrong even with help.' },
  ];

  type Task = { id: string; ticket: string; label: string; zone: ZoneKey; why: string; priority: 'urgent' | 'high' | 'med' | 'low' };
  const TASKS: Task[] = track === 'engineer'
    ? [
        { id: 't1', ticket: 'AI-101', label: 'Summarise a case note',                   zone: 'reliable',   priority: 'med',    why: 'Pure language work — input and output are text.' },
        { id: 't2', ticket: 'AI-102', label: 'Classify a support ticket',               zone: 'reliable',   priority: 'med',    why: 'Reading text and applying a label is a language task.' },
        { id: 't3', ticket: 'AI-103', label: 'Look up current coverage rate for a plan', zone: 'extended',  priority: 'high',   why: 'Needs a DB query first; model handles the language.' },
        { id: 't4', ticket: 'AI-104', label: 'Answer a policy question with citations', zone: 'extended',   priority: 'high',   why: 'Reliable once relevant policy text is retrieved (RAG).' },
        { id: 't5', ticket: 'AI-105', label: 'Compute exact claim adjustment amounts', zone: 'unreliable', priority: 'urgent', why: 'Precise arithmetic — even with retrieval the model drifts.' },
        { id: 't6', ticket: 'AI-106', label: 'Approve a high-stakes claim',            zone: 'unreliable', priority: 'urgent', why: 'Legally binding determination — fluency ≠ correctness.' },
      ]
    : [
        { id: 't1', ticket: 'OPS-101', label: 'Draft a provider complaint reply',         zone: 'reliable',   priority: 'med',    why: 'Drafting from a complaint description is language work.' },
        { id: 't2', ticket: 'OPS-102', label: 'Classify an escalation by category',       zone: 'reliable',   priority: 'med',    why: 'Reading the text and picking a label is a language task.' },
        { id: 't3', ticket: 'OPS-103', label: 'Answer a handbook policy question',        zone: 'extended',   priority: 'high',   why: 'Reliable when the right section is retrieved into the prompt.' },
        { id: 't4', ticket: 'OPS-104', label: 'Look up current premium for a plan',       zone: 'extended',   priority: 'high',   why: 'Needs a plan-DB lookup before the model can respond.' },
        { id: 't5', ticket: 'OPS-105', label: 'Check whether an SLA window is met live',  zone: 'unreliable', priority: 'urgent', why: 'Needs real timestamps; silent-failure risk too high.' },
        { id: 't6', ticket: 'OPS-106', label: 'Make a binding compliance determination',  zone: 'unreliable', priority: 'urgent', why: 'Cannot be safely automated by a completion model.' },
      ];

  const [placed, setPlaced] = useState<Record<string, ZoneKey>>({});
  const [picked, setPicked] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);

  const tray = TASKS.filter(t => !placed[t.id]);
  const correctCount = Object.entries(placed).filter(([id, z]) => TASKS.find(t => t.id === id)?.zone === z).length;
  const sorted = Object.keys(placed).length === TASKS.length;

  const tryDrop = (zone: ZoneKey) => {
    if (!picked) return;
    const task = TASKS.find(t => t.id === picked);
    if (!task) return;
    if (task.zone !== zone) {
      setWrong(picked);
      setTimeout(() => setWrong(null), 600);
      return;
    }
    setPlaced(prev => ({ ...prev, [picked]: zone }));
    setPicked(null);
  };
  const reset = () => { setPlaced({}); setPicked(null); setWrong(null); };

  const projectName = track === 'engineer' ? 'claims-ai/triage' : 'ops-ai/exception-triage';

  // Linear colours
  const linearBg = '#08090A';
  const linearPanel = '#101113';
  const linearPanelLight = '#181A1D';
  const linearBorder = '#222428';
  const inkPrimary = '#E1E3E6';
  const inkSecondary = '#888C94';
  const inkMuted = '#5D6168';
  const linearAccent = '#5E6AD2';

  const priorityIcon = (p: Task['priority']) => {
    const color = p === 'urgent' ? '#EF4444' : p === 'high' ? '#F59E0B' : p === 'med' ? '#888C94' : '#5D6168';
    const bars = p === 'urgent' ? 4 : p === 'high' ? 3 : p === 'med' ? 2 : 1;
    return (
      <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 1.5, height: 11 }}>
        {[1, 2, 3, 4].map(b => (
          <div key={b} style={{ width: 2.5, height: 3 + b * 1.5, background: b <= bars ? color : '#2A2D33', borderRadius: 1 }} />
        ))}
      </div>
    );
  };

  return (
    <div style={{
      background: linearBg,
      borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${linearBorder}`,
      boxShadow: '0 14px 36px rgba(0,0,0,0.45)',
      color: inkPrimary,
      fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
    }}>
      {/* Title bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: linearPanel, borderBottom: `1px solid ${linearBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, background: linearAccent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11 }}>L</div>
          <span style={{ fontSize: 12, fontWeight: 700, color: inkPrimary }}>Linear</span>
          <span style={{ color: inkMuted, fontSize: 11 }}>/</span>
          <span style={{ fontSize: 11.5, color: inkSecondary, fontFamily: "'JetBrains Mono', monospace" }}>{projectName}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ padding: '3px 9px', borderRadius: 4, background: linearPanelLight, border: `1px solid ${linearBorder}`, fontSize: 10, color: inkSecondary }}>Filter</div>
          <div style={{ padding: '3px 9px', borderRadius: 4, background: linearPanelLight, border: `1px solid ${linearBorder}`, fontSize: 10, color: inkSecondary }}>Group by status</div>
        </div>
      </div>

      {/* View tabs */}
      <div style={{ padding: '6px 14px', background: linearBg, borderBottom: `1px solid ${linearBorder}`, display: 'flex', gap: 4 }}>
        {['Active', 'Backlog', 'All issues'].map((v, i) => (
          <div key={v} style={{
            padding: '4px 10px', borderRadius: 5, fontSize: 11,
            fontWeight: 600,
            color: i === 0 ? inkPrimary : inkMuted,
            background: i === 0 ? linearPanelLight : 'transparent',
          }}>{v}</div>
        ))}
        <div style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: inkMuted, alignSelf: 'center' as const }}>{TASKS.length - tray.length}/{TASKS.length} sorted</div>
      </div>

      {/* Three columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderBottom: `1px solid ${linearBorder}` }}>
        {ZONES.map((z, i) => {
          const occupants = TASKS.filter(t => placed[t.id] === z.key);
          const isDropTarget = picked !== null;
          return (
            <div
              key={z.key}
              onClick={() => isDropTarget && tryDrop(z.key)}
              style={{
                background: isDropTarget ? z.bg : linearBg,
                borderRight: i < 2 ? `1px solid ${linearBorder}` : 'none',
                padding: '10px 12px',
                minHeight: 180,
                cursor: isDropTarget ? 'pointer' : 'default',
                transition: 'background 0.15s',
              }}
            >
              {/* Column header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', border: `2px solid ${z.color}`, background: 'transparent' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: inkPrimary }}>{z.label}</span>
                  <span style={{ fontSize: 10, color: inkMuted, fontFamily: "'JetBrains Mono', monospace" }}>{occupants.length}</span>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, fontWeight: 700, color: z.color, letterSpacing: '0.08em' }}>{z.pill}</span>
              </div>
              <div style={{ fontSize: 9.5, color: inkMuted, marginBottom: 10 }}>{z.sub}</div>

              {/* Cards */}
              <div style={{ display: 'grid', gap: 5 }}>
                {occupants.map(t => (
                  <div key={t.id} style={{
                    padding: '7px 9px',
                    background: linearPanelLight,
                    border: `1px solid ${z.color}40`,
                    borderRadius: 6,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      {priorityIcon(t.priority)}
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: inkMuted }}>{t.ticket}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 9, color: z.color }}>✓</span>
                    </div>
                    <div style={{ fontSize: 11, color: inkPrimary, fontWeight: 600, marginBottom: 3 }}>{t.label}</div>
                    <div style={{ fontSize: 9.5, color: z.color, lineHeight: 1.45 }}>{t.why}</div>
                  </div>
                ))}
                {occupants.length === 0 && (
                  <div style={{ fontSize: 10, color: '#3A3D43', fontStyle: 'italic' as const, padding: '8px 0' }}>No issues</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Backlog tray */}
      {!sorted && (
        <div style={{ padding: '10px 12px', background: linearPanel }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', border: `2px solid #888C94`, background: 'transparent' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: inkPrimary }}>Backlog</span>
              <span style={{ fontSize: 10, color: inkMuted, fontFamily: "'JetBrains Mono', monospace" }}>{tray.length}</span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: inkMuted }}>{picked ? 'click a column to assign' : 'click a card to pick it up'}</span>
          </div>
          <div style={{ display: 'grid', gap: 4 }}>
            {tray.map(t => {
              const isPicked = picked === t.id;
              const isWrong = wrong === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPicked(prev => prev === t.id ? null : t.id)}
                  style={{
                    appearance: 'none', cursor: 'pointer',
                    background: isPicked ? 'rgba(94,106,210,0.15)' : linearPanelLight,
                    border: `1px solid ${isWrong ? '#EF4444' : isPicked ? linearAccent : linearBorder}`,
                    borderRadius: 6,
                    padding: '7px 10px',
                    textAlign: 'left' as const,
                    fontFamily: 'inherit',
                    animation: isWrong ? 'cz-shake 0.4s' : undefined,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {priorityIcon(t.priority)}
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: inkMuted }}>{t.ticket}</span>
                    <span style={{ fontSize: 11, color: inkPrimary, flex: 1 }}>{t.label}</span>
                    {isPicked && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: linearAccent, letterSpacing: '0.10em' }}>PICKED ↑</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Status bar */}
      <div style={{ padding: '6px 14px', background: linearPanel, borderTop: `1px solid ${linearBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: sorted ? '#10B981' : inkMuted }}>
          {sorted ? `✓ ALL ${TASKS.length} ISSUES TRIAGED · ${correctCount}/${TASKS.length} correct` : `${correctCount}/${TASKS.length} triaged`}
        </span>
        {Object.keys(placed).length > 0 && (
          <button type="button" onClick={reset} style={{ appearance: 'none', cursor: 'pointer', background: 'transparent', border: `1px solid ${linearBorder}`, borderRadius: 5, padding: '3px 10px', fontSize: 10, fontWeight: 700, color: inkSecondary, fontFamily: "'JetBrains Mono', monospace" }}>↺ RESET</button>
        )}
      </div>

      <style>{`@keyframes cz-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }`}</style>
    </div>
  );
};

// PromptCompareCard rebuilt as two real ChatGPT windows side-by-side.
// Same model badge (GPT-4o), same temperature, same user — only the
// system+user message changes. Left column shows the vague brief and
// generic-filler reply; right column shows the specified brief and
// structured analysis. Toggle pill highlights the active column.
const PromptCompareCard = ({ track }: { track: GenAITrack }) => {
  const protagonist = track === 'engineer' ? 'Aarav' : 'Rhea';
  const vague = track === 'engineer' ? 'Summarise this case note.' : 'What should I do about this case?';
  const specific = track === 'engineer'
    ? 'You are a claims triage assistant. Given the case note below, write a 3-sentence summary covering: (1) category, (2) key action required, (3) urgency level. Use plain language for a case worker. No bullet points.'
    : 'You are a healthcare operations assistant. Given the escalation below, write a 2-sentence summary: one sentence stating the category, one sentence stating the recommended next step. Plain language. Max 60 words.';
  const vagueOutput = track === 'engineer'
    ? 'The case note discusses a patient claim that was submitted. There are some issues that may need attention from the relevant team. Further review is recommended.'
    : 'Based on the information provided, there are several considerations for this case. The appropriate team should review and determine next steps based on current policies.';
  const specificOutput = track === 'engineer'
    ? 'Category: Disputed claim — pharmacy benefit. Action: Escalate to pharmacy review within 48h — override requested by treating physician. Urgency: High.'
    : 'Category: Overdue exception request — provider credentialing. Recommended next step: Assign to credentialing team with 24h SLA flag; case has been pending 11 days past standard window.';
  const taskInput = track === 'engineer'
    ? 'Patient: Sarah Donovan, 42F · Plan B Tier 2 · Treating physician Dr. Patel requested override for compounded pharmacy benefit; system rejected …'
    : 'Provider: Dr. Mehta, Northstar West clinic. Credentialing exception submitted 11 days ago. Status: awaiting CMS verification. SLA: 14 days …';

  const [focused, setFocused] = useState<'vague' | 'specific' | null>(null);

  const cgptBg = '#212121';
  const cgptSurface = '#2F2F2F';
  const cgptInk = '#ECECEC';
  const cgptSub = '#A0A0A0';
  const cgptMuted = '#666666';
  const cgptAccent = '#10A37F';
  const border = '#3F3F3F';

  const Window = ({ kind }: { kind: 'vague' | 'specific' }) => {
    const isVague = kind === 'vague';
    const isFocus = focused === kind;
    const accent = isVague ? '#EF4444' : '#10A37F';
    const verdict = isVague
      ? 'Model filled every missing dimension with generic filler.'
      : 'Format, role, length, audience all named — model has nothing left to invent.';
    return (
      <div
        onMouseEnter={() => setFocused(kind)}
        onMouseLeave={() => setFocused(null)}
        style={{
          background: cgptBg,
          borderRight: isVague ? `1px solid ${border}` : 'none',
          display: 'flex', flexDirection: 'column' as const,
          minWidth: 0,
        }}
      >
        {/* ChatGPT window header */}
        <div style={{ padding: '8px 14px', borderBottom: `1px solid ${border}`, background: '#181818', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, background: cgptAccent, color: '#fff', fontWeight: 900, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>◯</div>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: cgptInk }}>ChatGPT</span>
            <span style={{ color: cgptMuted, fontSize: 10 }}>·</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: cgptSub }}>{isVague ? `${protagonist} — first try` : `${protagonist} — after coaching`}</span>
          </div>
          <div style={{ padding: '2px 7px', borderRadius: 4, background: `${accent}1A`, border: `1px solid ${accent}50`, fontSize: 9.5, fontWeight: 800, color: accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>{isVague ? 'VAGUE' : 'SPECIFIED'}</div>
        </div>

        {/* Chat thread */}
        <div style={{ padding: '14px 14px', flex: 1, minHeight: 0 }}>
          {/* System message banner (specific only) */}
          {!isVague && (
            <div style={{ padding: '8px 11px', background: 'rgba(16,163,127,0.07)', border: `1px dashed rgba(16,163,127,0.40)`, borderRadius: 7, marginBottom: 10 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: cgptAccent, letterSpacing: '0.10em', marginBottom: 3 }}>SYSTEM · custom instructions</div>
              <div style={{ fontSize: 11, color: cgptInk, lineHeight: 1.55, fontFamily: "'JetBrains Mono', monospace" }}>{specific.split('. ')[0]}.</div>
            </div>
          )}

          {/* User bubble */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#444', color: '#fff', fontWeight: 800, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{protagonist[0]}</div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: cgptMuted, letterSpacing: '0.10em' }}>{protagonist.toUpperCase()}</span>
            </div>
            <div style={{ maxWidth: '90%', padding: '9px 12px', background: cgptSurface, borderRadius: '12px 12px 4px 12px', fontSize: 12, color: cgptInk, lineHeight: 1.55, fontStyle: isVague ? 'italic' as const : 'normal' as const }}>
              {isVague ? vague : specific}
              <div style={{ marginTop: 6, padding: '6px 9px', background: '#1A1A1A', borderRadius: 6, fontSize: 10.5, color: cgptSub, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5 }}>{taskInput}</div>
            </div>
          </div>

          {/* Assistant bubble */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: cgptAccent, color: '#fff', fontWeight: 900, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>◯</div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: cgptMuted, letterSpacing: '0.10em' }}>CHATGPT</span>
              <span style={{ fontSize: 9, color: cgptMuted, fontFamily: "'JetBrains Mono', monospace" }}>· gpt-4o</span>
            </div>
            <div style={{ maxWidth: '90%', padding: '9px 12px', background: 'transparent', border: `1px solid ${isFocus ? accent : border}`, borderRadius: '12px 12px 12px 4px', fontSize: 12, color: cgptInk, lineHeight: 1.6 }}>
              {isVague ? vagueOutput : specificOutput}
            </div>
          </div>
        </div>

        {/* Verdict footer */}
        <div style={{ padding: '8px 14px', borderTop: `1px solid ${border}`, background: '#181818' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: accent, letterSpacing: '0.10em', marginBottom: 3, fontWeight: 700 }}>{isVague ? '✗ WHY THIS DRIFTS' : '✓ WHY THIS LANDS'}</div>
          <div style={{ fontSize: 10.5, color: cgptSub, lineHeight: 1.55 }}>{verdict}</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      background: cgptBg, borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${border}`, boxShadow: '0 14px 36px rgba(0,0,0,0.45)',
      color: cgptInk, fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
    }}>
      {/* Top bar */}
      <div style={{ padding: '8px 14px', background: '#0E0E0E', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['#FF5F57', '#FEBC2E', '#28C840'] as const).map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: cgptMuted, letterSpacing: '0.10em' }}>SAME MODEL · SAME USER · SAME INPUT · DIFFERENT BRIEF</span>
        <div style={{ width: 30 }} />
      </div>

      {/* Side-by-side windows */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <Window kind="vague" />
        <Window kind="specific" />
      </div>
    </div>
  );
};

// Tab-switchable context packet. Toggle to see the same prompt run on a
// complete vs broken payload — and what the model actually returned in each.
// ContextPacketCard rebuilt as a real Postman / Insomnia request inspector.
// HTTP method + URL bar at the top, environment selector with COMPLETE/BROKEN
// switching, a 200 OK status row with response time, then the request body
// (JSON) on the left and the response body (model output) on the right.
// Fields in the request body render with proper syntax tinting and missing
// values get the red null/blank flag treatment that any API debugger uses.
const ContextPacketCard = ({ track }: { track: GenAITrack }) => {
  type Field = { key: string; value: string; ok: boolean; type?: 'string' | 'number' | 'null' };
  const goodFields: Field[] = track === 'engineer'
    ? [
        { key: 'patient_id',   value: '"PT-88412"',        ok: true,  type: 'string' },
        { key: 'claim_amount', value: '2840.00',           ok: true,  type: 'number' },
        { key: 'case_note',    value: '"847 chars — complete"', ok: true, type: 'string' },
        { key: 'intake_form',  value: '{ … structured }',  ok: true,  type: 'string' },
        { key: 'policy_tier',  value: '"Tier 2 — PPO"',    ok: true,  type: 'string' },
      ]
    : [
        { key: 'case_id',        value: '"ESC-2024-7712"',         ok: true, type: 'string' },
        { key: 'category',       value: '"Provider credentialing"', ok: true, type: 'string' },
        { key: 'submitted_date', value: '"2024-03-01"',             ok: true, type: 'string' },
        { key: 'case_notes',     value: '"1204 chars — complete"',  ok: true, type: 'string' },
        { key: 'attachments',    value: '["PDF-1.pdf", "PDF-2.pdf"]', ok: true, type: 'string' },
      ];
  const badFields: Field[] = track === 'engineer'
    ? [
        { key: 'patient_id',   value: '"PT-88412"',              ok: true,  type: 'string' },
        { key: 'claim_amount', value: 'null',                    ok: false, type: 'null' },
        { key: 'case_note',    value: '"truncated at 256 chars…"', ok: false, type: 'string' },
        { key: 'intake_form',  value: '"flattened string blob"', ok: false, type: 'string' },
        { key: 'policy_tier',  value: 'null',                    ok: false, type: 'null' },
      ]
    : [
        { key: 'case_id',        value: '"ESC-2024-4405"',  ok: true,  type: 'string' },
        { key: 'category',       value: '""',               ok: false, type: 'string' },
        { key: 'submitted_date', value: '"2022-11-14"',     ok: true,  type: 'string' },
        { key: 'case_notes',     value: 'null',             ok: false, type: 'null' },
        { key: 'attachments',    value: '["unavailable", "unavailable"]', ok: false, type: 'string' },
      ];
  const goodOutput = track === 'engineer'
    ? 'Category: Disputed pharmacy benefit claim. Action: Escalate to pharmacy review within 48h — override requested by treating physician. Urgency: High. Risk: $2,840 exposure on PT-88412 if SLA breached.'
    : 'Category: Provider credentialing exception, submitted 2024-03-01 (case 7712). Recommended next step: Route to credentialing team; attached docs cover physician licensure and OON contract — sufficient for review without follow-up.';
  const badOutput = track === 'engineer'
    ? 'A patient case was reviewed and requires further triage. The claim is being processed per standard procedure. Please escalate as needed.'
    : 'Based on the available information, this case requires standard review. We recommend following the appropriate escalation process based on category and urgency.';

  const [env, setEnv] = useState<'good' | 'bad'>('good');
  const active = env === 'good'
    ? { fields: goodFields, output: goodOutput, accent: '#16A34A', label: 'PROD · complete packet',  pill: '200 OK', warning: 0 }
    : { fields: badFields,  output: badOutput,  accent: '#EF4444', label: 'PROD · broken packet',   pill: '200 OK', warning: badFields.filter(f => !f.ok).length };
  const url = track === 'engineer'
    ? 'POST  https://api.northstar.health/v1/claims/{id}/triage'
    : 'POST  https://api.northstar.health/v1/exceptions/triage';

  const inkPrimary = '#E5E7EB';
  const inkSub = '#9CA3AF';
  const inkMuted = '#5F6671';
  const panelBg = '#1E1E1E';
  const panelLight = '#252526';
  const border = '#2D2D30';
  const postman = '#FF6C37';

  return (
    <div style={{
      background: panelBg, borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${border}`, boxShadow: '0 14px 36px rgba(0,0,0,0.45)',
      color: inkPrimary, fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
    }}>
      {/* Title bar */}
      <div style={{ padding: '8px 14px', background: '#191919', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 18, height: 18, borderRadius: 4, background: postman, color: '#fff', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>P</div>
        <span style={{ fontSize: 12, fontWeight: 700, color: inkPrimary }}>Postman</span>
        <span style={{ color: inkMuted, fontSize: 11 }}>·</span>
        <span style={{ fontSize: 11, color: inkSub }}>northstar / triage-request</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: inkMuted, letterSpacing: '0.10em' }}>ENVIRONMENT</span>
          {(['good', 'bad'] as const).map(e => (
            <button
              key={e}
              type="button"
              onClick={() => setEnv(e)}
              style={{
                appearance: 'none', cursor: 'pointer',
                background: env === e ? (e === 'good' ? 'rgba(22,163,74,0.18)' : 'rgba(239,68,68,0.18)') : 'transparent',
                border: `1px solid ${env === e ? (e === 'good' ? '#22C55E' : '#EF4444') : border}`,
                borderRadius: 5, padding: '3px 10px',
                fontSize: 10, fontWeight: 700,
                color: env === e ? (e === 'good' ? '#86EFAC' : '#FCA5A5') : inkMuted,
                fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em',
              }}
            >{e === 'good' ? 'COMPLETE' : 'BROKEN'}</button>
          ))}
        </div>
      </div>

      {/* URL bar with HTTP method */}
      <div style={{ padding: '10px 14px', background: '#1F1F1F', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ padding: '5px 12px', background: postman, color: '#fff', borderRadius: 5, fontWeight: 800, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>POST</div>
        <div style={{ flex: 1, padding: '5px 11px', background: '#262626', border: `1px solid ${border}`, borderRadius: 5, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: inkPrimary }}>{url.split('  ')[1]}</div>
        <button type="button" style={{ appearance: 'none', cursor: 'default', padding: '5px 14px', background: '#0E84F5', border: 'none', borderRadius: 5, fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: 'inherit' }}>Send</button>
      </div>

      {/* Status row */}
      <div style={{ padding: '6px 14px', background: '#181818', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
        <span style={{ color: '#22C55E', fontWeight: 700 }}>● {active.pill}</span>
        <span style={{ color: inkSub }}>Time <span style={{ color: inkPrimary }}>340 ms</span></span>
        <span style={{ color: inkSub }}>Size <span style={{ color: inkPrimary }}>{env === 'good' ? '1.4 KB' : '0.8 KB'}</span></span>
        {active.warning > 0 && <span style={{ color: '#FBBF24', marginLeft: 'auto', fontWeight: 700 }}>⚠ {active.warning} fields null / truncated</span>}
      </div>

      {/* Body + response */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        {/* Request body */}
        <div style={{ borderRight: `1px solid ${border}` }}>
          <div style={{ padding: '7px 14px', background: panelLight, borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: inkMuted, letterSpacing: '0.10em' }}>REQUEST BODY · JSON</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: inkMuted }}>{active.fields.length} keys</span>
          </div>
          <div style={{ padding: '10px 0', background: '#1A1A1A', fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, lineHeight: 1.65 }}>
            <div style={{ display: 'flex', paddingLeft: 8 }}>
              <span style={{ width: 24, color: inkMuted, textAlign: 'right', paddingRight: 10 }}>1</span>
              <span style={{ color: inkPrimary }}>{'{'}</span>
            </div>
            {active.fields.map((f, i) => (
              <div key={f.key} style={{ display: 'flex', paddingLeft: 8, background: !f.ok ? 'rgba(239,68,68,0.06)' : 'transparent' }}>
                <span style={{ width: 24, color: inkMuted, textAlign: 'right', paddingRight: 10 }}>{i + 2}</span>
                <span style={{ paddingLeft: 14 }}>
                  <span style={{ color: '#9CDCFE' }}>"{f.key}"</span>
                  <span style={{ color: inkPrimary }}>: </span>
                  <span style={{ color: f.type === 'null' ? '#EF4444' : f.type === 'number' ? '#B5CEA8' : '#CE9178' }}>{f.value}</span>
                  {i < active.fields.length - 1 && <span style={{ color: inkPrimary }}>,</span>}
                  {!f.ok && <span style={{ marginLeft: 10, color: '#EF4444', fontSize: 9.5 }}>// missing</span>}
                </span>
              </div>
            ))}
            <div style={{ display: 'flex', paddingLeft: 8 }}>
              <span style={{ width: 24, color: inkMuted, textAlign: 'right', paddingRight: 10 }}>{active.fields.length + 2}</span>
              <span style={{ color: inkPrimary }}>{'}'}</span>
            </div>
          </div>
        </div>

        {/* Response */}
        <div>
          <div style={{ padding: '7px 14px', background: panelLight, borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: inkMuted, letterSpacing: '0.10em' }}>RESPONSE · model output</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#22C55E' }}>200 OK</span>
          </div>
          <div style={{ padding: '12px 14px', background: '#1A1A1A', fontSize: 11.5, color: inkPrimary, lineHeight: 1.65, minHeight: 120 }}>
            {active.output}
          </div>
        </div>
      </div>

      {/* Verdict bar */}
      <div style={{ padding: '8px 14px', background: env === 'good' ? 'rgba(34,197,94,0.10)' : 'rgba(239,68,68,0.10)', borderTop: `1px solid ${active.accent}40` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: active.accent, letterSpacing: '0.10em', fontWeight: 700, marginBottom: 3 }}>
          {env === 'good' ? '✓ MODEL WROTE FROM FACTS' : '✗ MODEL DRIFTED INTO PLAUSIBLE FILLER'}
        </div>
        <div style={{ fontSize: 10.5, color: inkSub, lineHeight: 1.55 }}>
          {env === 'good'
            ? 'Every required field present and well-typed — model has hard facts to write from.'
            : `${active.warning} fields silently null or truncated · model can\'t see the gap and fills it with generic prose. Status code is still 200 — nothing alerts.`}
        </div>
      </div>
    </div>
  );
};

// ── Section 5: Use-Case Readiness Scorer (interactive) ──────────────────────
// Learner picks one of three candidate first AI use cases (auto-approve,
// classify-with-review, autonomous intake) and walks through five readiness
// criteria. Each row reveals a pass/fail verdict with a one-line explanation;
// a final verdict ribbon shows whether this is a safe first build.
const UseCaseReadinessCard = ({ track }: { track: GenAITrack }) => {
  type CriterionKey = 'language' | 'bounded' | 'verify' | 'recover' | 'observe';
  type Outcome = { pass: boolean; note: string };
  type Candidate = {
    id: 'auto' | 'review' | 'autonomous';
    label: string;
    blurb: string;
    verdict: 'Build first' | 'Wait — needs review step' | 'Don’t build';
    verdictColor: string;
    rows: Record<CriterionKey, Outcome>;
  };

  const CRITERIA: { key: CriterionKey; label: string; sub: string }[] = [
    { key: 'language', label: 'Language-based', sub: 'Text in, text out — no live data lookup.' },
    { key: 'bounded',  label: 'Bounded output', sub: 'A category, draft or summary — not a final action.' },
    { key: 'verify',   label: 'Easy to verify', sub: 'A human can spot a wrong output quickly.' },
    { key: 'recover',  label: 'Recoverable',    sub: 'Errors caught before they affect anything downstream.' },
    { key: 'observe',  label: 'Observable',     sub: 'You can see what the model gets wrong, not just right.' },
  ];

  const CANDIDATES: Candidate[] = track === 'engineer'
    ? [
        {
          id: 'auto',
          label: 'Auto-approve routine exceptions at >80% confidence',
          blurb: 'Biggest headline ROI. No human in the loop. Confidence threshold gates the action.',
          verdict: 'Don’t build',
          verdictColor: '#DC2626',
          rows: {
            language: { pass: false, note: 'Approval requires policy + claim record. That’s a lookup, not language work.' },
            bounded:  { pass: false, note: 'Output is an irreversible decision on a live case.' },
            verify:   { pass: false, note: 'Nobody reads correct approvals — wrong ones are invisible.' },
            recover:  { pass: false, note: 'Wrong approval routes through downstream systems silently.' },
            observe:  { pass: false, note: 'You see headline volume, not the failure pattern.' },
          },
        },
        {
          id: 'review',
          label: 'Classify case requests + flag low-confidence for human review',
          blurb: 'Model suggests a category. Human confirms anything uncertain. Tickets land in the right queue.',
          verdict: 'Build first',
          verdictColor: '#16A34A',
          rows: {
            language: { pass: true,  note: 'Reading a request and assigning a label is pure language work.' },
            bounded:  { pass: true,  note: 'Output is one label from a small set — not an action.' },
            verify:   { pass: true,  note: 'A reviewer can confirm or override a label in seconds.' },
            recover:  { pass: true,  note: 'Wrong labels are caught at review before anything routes.' },
            observe:  { pass: true,  note: 'You log every disagreement — that’s your failure-mode dataset.' },
          },
        },
        {
          id: 'autonomous',
          label: 'Autonomous intake agent: monitor, route, act',
          blurb: 'Long-running agent watches the queue and takes action without checkpoints.',
          verdict: 'Don’t build',
          verdictColor: '#DC2626',
          rows: {
            language: { pass: false, note: 'Routing decisions touch live system state — not in the prompt.' },
            bounded:  { pass: false, note: 'Multi-step actions, not a single bounded output.' },
            verify:   { pass: false, note: 'A reviewer can’t reconstruct what the agent did across N steps.' },
            recover:  { pass: false, note: 'Side-effects from step 3 are live by the time step 7 fails.' },
            observe:  { pass: false, note: 'Compound failure modes — hard to attribute which step went wrong.' },
          },
        },
      ]
    : [
        {
          id: 'auto',
          label: 'Auto-resolve routine exceptions at >80% confidence',
          blurb: 'Biggest headcount story. No human in the loop. Confidence score gates the action.',
          verdict: 'Don’t build',
          verdictColor: '#DC2626',
          rows: {
            language: { pass: false, note: 'Resolving an exception needs policy + case data the model can’t see.' },
            bounded:  { pass: false, note: 'The output is a real action affecting the submitter — not just text.' },
            verify:   { pass: false, note: 'Nobody reads correct resolutions; wrong ones surface only downstream.' },
            recover:  { pass: false, note: 'A wrong resolution notice is hard to walk back.' },
            observe:  { pass: false, note: 'You see how many got resolved — not how many got resolved wrong.' },
          },
        },
        {
          id: 'review',
          label: 'Classify escalations + flag low-confidence for human review',
          blurb: 'Model suggests a category and urgency. A reviewer confirms anything uncertain before it routes.',
          verdict: 'Build first',
          verdictColor: '#16A34A',
          rows: {
            language: { pass: true,  note: 'Reading an escalation and assigning a category is language work.' },
            bounded:  { pass: true,  note: 'Output is one label — bounded, not an action.' },
            verify:   { pass: true,  note: 'A reviewer can confirm or correct in under a minute.' },
            recover:  { pass: true,  note: 'Wrong labels caught at the review step before routing.' },
            observe:  { pass: true,  note: 'Every reviewer correction is data on where the model fails.' },
          },
        },
        {
          id: 'autonomous',
          label: 'AI drafts complaint responses sent after a 30-sec spot check',
          blurb: 'AI writes the reply, an assistant glances, then it goes out the door.',
          verdict: 'Wait — needs review step',
          verdictColor: '#D97706',
          rows: {
            language: { pass: true,  note: 'Drafting a reply from a complaint description is language work.' },
            bounded:  { pass: true,  note: 'Output is a draft — bounded.' },
            verify:   { pass: false, note: '30-second spot checks miss tone errors and factual drift.' },
            recover:  { pass: false, note: 'A bad reply is already in the provider’s inbox.' },
            observe:  { pass: false, note: 'You won’t see the bad drafts that slipped through.' },
          },
        },
      ];

  const [pickedId, setPickedId] = useState<Candidate['id']>('review');
  const [revealed, setRevealed] = useState<Record<CriterionKey, boolean>>({
    language: false, bounded: false, verify: false, recover: false, observe: false,
  });

  const picked = CANDIDATES.find(c => c.id === pickedId)!;
  const revealedCount = (Object.keys(revealed) as CriterionKey[]).filter(k => revealed[k]).length;
  const allRevealed = revealedCount === CRITERIA.length;
  const passCount = (Object.keys(revealed) as CriterionKey[]).filter(k => revealed[k] && picked.rows[k].pass).length;

  const switchCandidate = (id: Candidate['id']) => {
    setPickedId(id);
    setRevealed({ language: false, bounded: false, verify: false, recover: false, observe: false });
  };

  const verdictPriority = picked.verdict === 'Build first' ? 'urgent' : picked.verdict === 'Wait — needs review step' ? 'high' : 'low';

  // Linear colours
  const linearBg = '#08090A';
  const linearPanel = '#101113';
  const linearPanelLight = '#181A1D';
  const linearBorder = '#222428';
  const inkPrimary = '#E1E3E6';
  const inkSecondary = '#888C94';
  const inkMuted = '#5D6168';
  const linearAccent = '#5E6AD2';

  return (
    <div style={{
      background: linearBg, borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${linearBorder}`, boxShadow: '0 14px 36px rgba(0,0,0,0.45)',
      color: inkPrimary, fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
    }}>
      {/* Title bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: linearPanel, borderBottom: `1px solid ${linearBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, background: linearAccent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11 }}>L</div>
          <span style={{ fontSize: 12, fontWeight: 700, color: inkPrimary }}>Linear</span>
          <span style={{ color: inkMuted, fontSize: 11 }}>/</span>
          <span style={{ fontSize: 11.5, color: inkSecondary, fontFamily: "'JetBrains Mono', monospace" }}>ai-platform/first-build-triage</span>
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: inkMuted, letterSpacing: '0.10em' }}>BUILD-FIRST DECISION</span>
      </div>

      {/* Candidate row — like Linear's "Cycle" issue list */}
      <div style={{ padding: '10px 14px', background: linearBg, borderBottom: `1px solid ${linearBorder}` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: inkMuted, letterSpacing: '0.12em', marginBottom: 8 }}>CANDIDATES · 3 issues</div>
        <div style={{ display: 'grid', gap: 5 }}>
          {CANDIDATES.map((c, i) => {
            const isActive = c.id === pickedId;
            const priorityColor = c.verdict === 'Build first' ? '#10B981' : c.verdict === 'Wait — needs review step' ? '#F59E0B' : '#EF4444';
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => switchCandidate(c.id)}
                style={{
                  appearance: 'none', cursor: 'pointer',
                  display: 'block', width: '100%',
                  padding: '7px 10px',
                  background: isActive ? 'rgba(94,106,210,0.10)' : linearPanelLight,
                  border: `1px solid ${isActive ? linearAccent : linearBorder}`,
                  borderRadius: 6,
                  textAlign: 'left' as const,
                  fontFamily: 'inherit',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Linear-style status circle */}
                  <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${priorityColor}`, background: 'transparent', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: inkMuted }}>AI-1{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, color: inkPrimary, fontWeight: 600, marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontSize: 10, color: inkMuted, lineHeight: 1.45 }}>{c.blurb}</div>
                  </div>
                  {isActive && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: linearAccent, fontWeight: 800, letterSpacing: '0.10em' }}>FOCUSED</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Body: criteria checklist + issue detail */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 200px', gap: 0 }}>
        {/* Criteria checklist */}
        <div style={{ borderRight: `1px solid ${linearBorder}`, padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: inkMuted, letterSpacing: '0.12em' }}>READINESS CRITERIA · {revealedCount}/{CRITERIA.length} REVEALED</span>
          </div>

          {CRITERIA.map(c => {
            const isRevealed = revealed[c.key];
            const row = picked.rows[c.key];
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setRevealed(prev => ({ ...prev, [c.key]: true }))}
                disabled={isRevealed}
                style={{
                  appearance: 'none', cursor: isRevealed ? 'default' : 'pointer',
                  display: 'block', width: '100%',
                  padding: '8px 0',
                  background: 'transparent',
                  border: 'none', borderBottom: `1px solid ${linearBorder}`,
                  textAlign: 'left' as const,
                  fontFamily: 'inherit',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  {/* Linear-style checkbox */}
                  <div style={{
                    width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                    border: `1.5px solid ${isRevealed ? (row.pass ? '#10B981' : '#EF4444') : '#3A3D43'}`,
                    background: isRevealed ? (row.pass ? '#10B981' : 'transparent') : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isRevealed && row.pass ? '#fff' : '#EF4444', fontSize: 10, fontWeight: 800,
                    marginTop: 1,
                  }}>{isRevealed ? (row.pass ? '✓' : '✗') : ''}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: inkPrimary, textDecoration: isRevealed && row.pass ? 'line-through' : 'none' }}>{c.label}</span>
                      {isRevealed && <span style={{ padding: '1px 6px', borderRadius: 3, background: row.pass ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: row.pass ? '#10B981' : '#EF4444', fontWeight: 800, letterSpacing: '0.06em' }}>{row.pass ? 'PASS' : 'FAIL'}</span>}
                    </div>
                    <div style={{ fontSize: 10.5, color: inkMuted, lineHeight: 1.5 }}>{c.sub}</div>
                    {isRevealed && (
                      <div style={{ marginTop: 5, fontSize: 10.5, color: row.pass ? '#86EFAC' : '#FCA5A5', lineHeight: 1.55 }}>{row.note}</div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right rail — issue properties */}
        <div style={{ padding: '12px 14px', background: linearPanel, display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: inkMuted, letterSpacing: '0.12em', marginBottom: 5 }}>PROPERTIES</div>
            {[
              { k: 'Status',   v: allRevealed ? picked.verdict : 'Triage', c: allRevealed ? picked.verdictColor : '#888C94' },
              { k: 'Priority', v: verdictPriority === 'urgent' ? 'Urgent' : verdictPriority === 'high' ? 'High' : 'Low', c: verdictPriority === 'urgent' ? '#EF4444' : verdictPriority === 'high' ? '#F59E0B' : '#888C94' },
              { k: 'Cycle',    v: 'AI Q1 sprint', c: inkPrimary },
              { k: 'Label',    v: picked.id === 'auto' ? 'risky' : picked.id === 'review' ? 'ready' : 'complex', c: picked.id === 'auto' ? '#EF4444' : picked.id === 'review' ? '#10B981' : '#F59E0B' },
            ].map(p => (
              <div key={p.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                <span style={{ fontSize: 10.5, color: inkMuted }}>{p.k}</span>
                <span style={{ fontSize: 10.5, color: p.c, fontWeight: 700 }}>{p.v}</span>
              </div>
            ))}
          </div>

          {/* Pass count */}
          <div style={{ padding: '8px 10px', background: linearBg, border: `1px solid ${linearBorder}`, borderRadius: 6 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: inkMuted, letterSpacing: '0.10em' }}>SCORE</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 3 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 800, color: allRevealed ? picked.verdictColor : inkPrimary }}>{passCount}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: inkMuted }}>/ {CRITERIA.length}</span>
            </div>
            <div style={{ fontSize: 9.5, color: inkMuted, marginTop: 3 }}>criteria pass</div>
          </div>

          {/* Verdict callout */}
          {allRevealed && (
            <div style={{ padding: '9px 11px', background: `${picked.verdictColor}1A`, border: `1px solid ${picked.verdictColor}55`, borderRadius: 6 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: picked.verdictColor, letterSpacing: '0.10em', fontWeight: 700, marginBottom: 3 }}>VERDICT</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: inkPrimary, lineHeight: 1.4 }}>{picked.verdict}</div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '7px 14px', background: linearPanel, borderTop: `1px solid ${linearBorder}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: inkMuted, letterSpacing: '0.06em' }}>
        Three concrete candidates · five lenses · one bar. The first build maximises observability, not headline impact.
      </div>
    </div>
  );
};

// ── End TiltCard Mockups ─────────────────────────────────────────────────────


function CoreContent({ track, completedSections = new Set<string>(), activeSection = null }: { track: GenAITrack; completedSections?: Set<string>; activeSection?: string | null }) {
  const nextSection = SECTIONS.find(s => !completedSections.has(s.id));
  const moduleContext = TRACK_META[track].moduleContext;

  return (
    <>
      {/* ── Module Hero ── */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', marginBottom: '28px' }}>
      <div style={{ flex: 1, minWidth: 0, background: 'var(--ed-cream)', borderRadius: '14px', padding: '36px 36px 28px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-12px', top: '-8px', fontSize: '140px', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.05)`, fontFamily: "'Lora','Georgia',serif", letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>01</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '10px', textTransform: 'uppercase' as const }}>
            GenAI Launchpad · Pre-Read 01
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.025em', color: 'var(--ed-ink)', marginBottom: '10px', fontFamily: "'Lora', Georgia, serif" }}>
            What Is This Thing, Actually?
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif", marginBottom: '28px' }}>
            &ldquo;Before you prompt anything, understand what you are talking to.&rdquo;
          </p>

          {/* Characters */}
          <GenAIHeroCharacterStrip track={track} mentors={['anika', 'rohan', 'leela', 'kabir']} />
          <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '16px 20px', border: '1px solid var(--ed-rule)', borderLeft: `3px solid ${ACCENT}` }}>
            <div style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '10px', textTransform: 'uppercase' as const }}>Learning Objectives</div>
            {[
              'Understand what GenAI actually is — a probabilistic completion system, not an oracle',
              'Map the capability zones: what LLMs reliably do well vs where they reliably fail',
              'Make the mental model shift from search query to task specification',
              'Select your first AI use case using five concrete readiness criteria',
            ].map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 3 ? '8px' : 0, alignItems: 'flex-start' }}>
                <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", marginTop: '2px' }}>0{i + 1}</span>
                <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, width: '162px', paddingTop: '8px' }}>
        <div className="float3d" style={{ background: 'linear-gradient(145deg, #0F0A1E 0%, #1A0F2E 100%)', borderRadius: '14px', padding: '18px 16px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE 01</div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>What Is GenAI?</div>
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

      {/* Track lens banner */}
      <div style={{ marginBottom: '10px', padding: '16px 20px', borderRadius: '10px', background: track === 'engineer' ? 'rgba(15,118,110,0.08)' : 'rgba(124,58,237,0.08)', border: `1px solid ${track === 'engineer' ? 'rgba(15,118,110,0.18)' : 'rgba(124,58,237,0.18)'}` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: track === 'engineer' ? '#0F766E' : '#7C3AED', marginBottom: '8px' }}>
          {TRACK_META[track].label.toUpperCase()}
        </div>
        <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>
          {track === 'engineer'
            ? 'Your lens throughout this module: what type of task is this, and is it in the reliable zone? Before evaluating any integration, you will evaluate the task itself — input consistency, output contract, failure cost, and context availability.'
            : 'Your lens throughout this module: what does this tool actually do, and where does it genuinely help? Before building anything, you will build a clear mental model of what AI is, what it is good for, and which of your tasks belong to it.'}
        </div>
      </div>

      <ChapterSection num="01" accentRgb={ACCENT_RGB} id="genai-m1-whatitis" first>
        {chLabel('Week 0 · Introduction to Generative AI')}
        {h2('It does not look things up. It generates what probably comes next.')}
        {para(track === 'engineer'
          ? "\u25b6 After this section, you can explain why adding a stronger model won\’t fix a retrieval problem — and name the architectural component that actually is missing."
          : "\u25b6 After this section, you can tell the difference between a model problem and an information problem, and know which one to fix."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? <>Aarav&apos;s team shipped an LLM call that returns coverage rates during claims triage. Three days after demo, the data team flags it: the numbers look right but aren&apos;t. No one panics — it was a prototype. But Aarav pulls the API call apart looking for the bug. There is no bug. The model returned plausible rates because plausible rates are what the training data looked like. There is no claim system in the call. No policy database. Just a question and a model that answered it. He messages Rohan: <em>&ldquo;I think I fundamentally misunderstood what this thing actually does.&rdquo;</em></>
            : <>Rhea&apos;s team has been using an AI assistant for policy questions for three weeks. Good adoption, saves time. Then someone follows an AI-generated escalation procedure that turns out to be wrong. Rhea calls the vendor. The support rep says: <em>&ldquo;The model doesn&apos;t have access to your internal systems. It responds based on training data.&rdquo;</em> She sits with that for a while. They had been asking it questions as if it were a well-informed colleague who had read the Northstar handbook. It hadn&apos;t. It had read everything else. She messages Anika.</>}
        </SituationCard>
        <GenAIConversationScene
          mentor={track === 'engineer' ? 'rohan' : 'anika'}
          track={track}
          accent={track === 'engineer' ? '#2563EB' : ACCENT}
          techLines={[
            { speaker: 'protagonist', text: "I upgraded to a larger model but the coverage rates are still wrong. There must be a bug in the API call." },
            { speaker: 'mentor', text: "Walk me through the call. Is there a retrieval layer — anything pulling from the claims system?" },
            { speaker: 'protagonist', text: "No retrieval. I'm just passing the question directly to the model." },
            { speaker: 'mentor', text: "Then the model generated plausible rates from training data. It has no idea what Northstar's actual rates are — you never gave it Northstar's rates." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "The AI gave us a wrong escalation procedure. I'm looking at other tools — this one clearly doesn't understand healthcare compliance." },
            { speaker: 'mentor', text: "Tell me exactly what you asked it. Not what you wanted to know — what did you literally type?" },
            { speaker: 'protagonist', text: "I asked it to give me the escalation procedure for a compliance incident." },
            { speaker: 'mentor', text: "It generated the most plausible procedure from its training data. Northstar's actual handbook was never in the conversation — no model has that unless you put it there." },
          ]}
        />
        <GenAIAvatar
          name={track === 'engineer' ? 'Rohan' : 'Anika'}
          nameColor={ACCENT}
          borderColor={ACCENT}
          conceptId="genai-m1-what-it-is"
          content={track === 'engineer'
            ? "The model has no claims system in your call — it generated statistically plausible rates. That\’s not a bug. It\’s the architecture."
            : "The model generated a plausible escalation procedure from generic training data. Northstar\’s actual handbook was never part of the conversation."}
          expandedContent={track === 'engineer'
            ? "There's no claims system in your call. No policy database. So the model did what it always does: it generated the most statistically plausible continuation of the text you gave it. Rates in the right format, right range, right level of precision — because that's what coverage rate responses look like in the training data. The model has no way to know what Northstar's actual rates are. You didn't give it Northstar's rates. This isn't a hallucination bug to fix. It's an architecture question: you were asking a completion system to do retrieval. Those are different jobs."
            : "The model gave you the most plausible escalation procedure it could construct from everything it's been trained on — general healthcare operations, compliance docs, whatever made it into the pretraining set. That's not a malfunction. That's what it does. It generates the most likely continuation of the text you gave it. It has no idea what Northstar's actual procedure is unless you put it in the conversation yourself. No model does — not this one, not a newer one. What broke wasn't the model's reliability. It was the assumption underneath the question."}
          question={track === 'engineer'
            ? "The data team wants to upgrade to a larger, newer model to fix the accuracy issue. What would you tell them?"
            : "Your colleague says the model is just not reliable enough for policy questions yet. What's the stronger diagnosis?"}
          options={track === 'engineer'
            ? [
                { text: 'Agree — a model trained on more recent healthcare data would return accurate rates', correct: false, feedback: 'No version of this model has Northstar\'s specific rates in its weights. A newer model would generate equally plausible but equally wrong numbers.' },
                { text: 'The model is doing its job — the call needs a retrieval layer to pull actual rates from the claims system', correct: true, feedback: 'Exactly. The fix is architecture, not model quality. The model handles the language work. A retrieval layer connects it to live data.' },
                { text: 'Fine-tune the model on Northstar\'s historical claims data to improve accuracy', correct: false, feedback: 'Fine-tuning on historical data improves pattern matching, not real-time accuracy. It still won\'t have current rates.' },
                { text: 'Update the prompt to explicitly instruct the model not to make up numbers', correct: false, feedback: 'You can\'t prompt your way out of an architecture gap. Instructing the model not to hallucinate doesn\'t give it access to Northstar\'s actual rates — it will still generate from training patterns.' },
              ]
            : [
                { text: 'Agree — policy compliance tasks need a model trained on more recent regulatory data', correct: false, feedback: 'Training recency doesn\'t change the fundamental issue. No model has Northstar\'s internal procedures unless you give them as input.' },
                { text: 'The model is working as designed — it was being asked for specific data it cannot have without retrieval', correct: true, feedback: 'Yes. Policy procedures exist in specific documents, not in training patterns. The fix is putting those documents in the context, not finding a better model.' },
                { text: 'Write longer prompts that include more context about what Northstar does', correct: false, feedback: 'More context helps, but if the actual procedure document isn\'t in the prompt, no amount of background context produces the correct procedure.' },
                { text: 'Switch to a model with internet access so it can look up the correct procedure', correct: false, feedback: 'Internet access doesn\'t give the model Northstar\'s internal procedure. That lives in your internal documentation, not on the web.' },
              ]}
        />
        {para(track === 'engineer'
          ? 'Generative AI models are completion systems. Given a sequence of text, they generate the most statistically plausible continuation based on patterns in training data. They have no live connection to the world — no access to your databases, no ability to check current state, no memory between calls. They generate. They do not retrieve. That distinction is not a limitation to be patched. It is the architecture.'
          : 'Generative AI models are completion systems. They generate the most plausible continuation of whatever text they receive. They have no connection to live systems, no access to internal documents they weren\'t given, and no ability to flag when they don\'t actually know something. Certainty is a text style — the model can sound completely confident about things it is factually wrong about, because confidence is in the training data too.')}
        <GenAIAvatar
          name="Kabir"
          nameColor={ACCENT}
          borderColor={ACCENT}
          conceptId="genai-m1-what-it-is"
          content={track === 'engineer'
            ? "Before you redesign anything — what kind of task was the coverage rate lookup, at its core? Language task or data lookup?"
            : "Rhea, before you update your team\’s guidelines — I want to ask you one question. The escalation procedure task: was that a language problem or an information lookup?"}
          expandedContent={track === 'engineer'
            ? "That's the filter I use first. Language task: the input is text, the output is text, and you don't need anything from an external system to answer correctly. Data lookup: the correct answer lives in a specific record somewhere. Coverage rates are a lookup — they live in a claims system. The model is genuinely excellent at language tasks. It is not a database. Once you separate those two categories, most of the confusion about when to use AI and when not to dissolves immediately."
            : "Those are two different jobs. Language task: rewrite this, summarise that, draft a response — the model works from what's in the prompt and its training. Information lookup: tell me the current escalation procedure, pull the right premium for this tier — the correct answer lives in a specific document or system. The model is very good at language work. It is not a retrieval system. The moment you ask it to look something up that isn't in the context, you've crossed from one category to the other. Most AI failures I've seen come from that exact crossing."}
          question={track === 'engineer'
            ? "Which of these is a pure language task that works without a retrieval layer?"
            : "Your team wants to use AI for two tasks: drafting responses to provider complaints, and checking whether claims were processed within SLA. Which one fits the language task category?"}
          options={track === 'engineer'
            ? [
                { text: 'Return the current deductible for a given plan and coverage tier', correct: false, feedback: 'Current deductibles live in a plan database. That\'s a data lookup — the model needs retrieval to answer correctly.' },
                { text: 'Rewrite a dense case note into plain language for a patient communication', correct: true, feedback: 'The input is the case note. The output is a rewritten version. Nothing from an external system is required. That\'s a language task the model can do directly.' },
                { text: 'Check whether an exception request was resolved within the 48-hour SLA window', correct: false, feedback: 'SLA compliance requires a timestamp lookup from your case management system. Data lookup, not language task.' },
                { text: 'Generate a risk score for a claim based on its category and value', correct: false, feedback: 'Risk scoring on specific claim values requires arithmetic on real financial data — that\'s a data lookup and calculation, not a language task.' },
              ]
            : [
                { text: 'SLA checking — that\'s a pattern-matching task LLMs handle well', correct: false, feedback: 'SLA checking requires live timestamp data from your claims system. The model can\'t look that up without retrieval infrastructure.' },
                { text: 'Drafting complaint responses — the model only needs what\'s in the prompt, no live data required', correct: true, feedback: 'Yes. A good complaint response requires understanding the situation and writing well — both language work. The draft goes to a human before sending anyway.' },
                { text: 'Both work — modern LLMs are capable enough for both categories', correct: false, feedback: 'Capability isn\'t the issue. Architecture is. SLA checking requires current data the model simply doesn\'t have without a retrieval layer.' },
                { text: 'Complaint drafting, but only after connecting it to the patient database for richer context', correct: false, feedback: 'Complaint drafting works without the database — the situation description you paste in is sufficient. Adding a database connection is extra complexity that doesn\'t change the fundamental task type.' },
              ]}
        />
        {keyBox('What GenAI actually is', [
          'A probabilistic completion system — it generates the most plausible next text, not the most accurate.',
          'Excellent at language work: summarise, classify, draft, rewrite, extract from documents you provide.',
          'Disconnected from live data — it needs retrieval infrastructure for anything that requires current or proprietary facts.',
        ], ACCENT)}
        {para(track === 'engineer'
          ? "A retrieval layer is the component that sits between your application and the model. When a user asks about current coverage rates, the retrieval layer queries your claims system first, then passes the actual rate — alongside the question — to the model as part of the prompt. The model\’s job is language work: formatting, synthesising, explaining the result. The retrieval layer\’s job is fetching the fact. They are different components doing different jobs. Without a retrieval layer, you are asking the model to remember something it was never given."
          : "A retrieval layer is the part of an AI system that looks things up before the model responds. Think of it like a research assistant: before the model writes anything, the retrieval layer finds the relevant policy document, the specific procedure, or the correct figure — and puts it in the prompt as context. Without this layer, the model writes from training data. With it, the model writes from the specific document you gave it. Most early AI failures happen because teams skip this step and ask the model to recall things it was never shown."
        )}
        {track === 'engineer' ? keyBox('What a retrieval layer looks like in the call flow', [
          '1. User query arrives (e.g. "What is the deductible for Plan B, Tier 2?").',
          '2. Retrieval step: your code queries the plan database — SELECT deductible FROM plans WHERE plan=\'B\' AND tier=2 — and gets back the actual figure.',
          '3. Model call: you construct the prompt with the retrieved fact inline — "The Tier 2 deductible for Plan B is $1,400. Given this, answer the following question: ..." The model formats, explains, and responds.',
          '4. The model never touches the database. It only sees what your retrieval step fetched and injected.',
          'Common patterns: SQL lookup for structured records, vector search for document retrieval (RAG), API call for live system state. The pattern depends on where the fact lives — not on the model.',
        ], ACCENT) : keyBox('What to ask IT to build — and what you own', [
          'What IT builds: a way to attach the relevant document or record to every AI request before it reaches the model. For policy questions, that means: given the question, find the right policy document and include it in the prompt automatically.',
          'What you own: specifying which document or data source is the right one for each task, and verifying the output is using the attached content — not making things up.',
          'The simplest version: IT stores your policy documents in a searchable index. When a question comes in, the system finds the most relevant document and prepends it to the prompt. The model reads the document you gave it and answers from that.',
          'The signal that retrieval is working: ask the model a question whose answer only appears in your internal document. If the answer is correct, the document reached the model. If it hallucinated, the retrieval step failed or was skipped.',
        ], ACCENT)}
        {PMPrincipleBox({ label: '◈ Principle', principle: 'Before asking whether AI can do something, ask whether it has — or can be given — the information it needs to answer correctly.' })}
        <TiltCard style={{ margin: '28px 0' }}><TokenProbCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'engineer' ? "Look at the last AI API call your team shipped. Was the model doing language work (completing, transforming, classifying text you gave it) or implicitly expected to know live facts? If the latter — where would the retrieval layer need to sit?" : "Think of one task your team has tried with AI that gave unreliable results. Was it a language task or an information lookup? If it was a lookup — what would a correct design have looked like?"} />
        <QuizEngine conceptId="genai-m1-what-it-is" conceptName="What GenAI Is" moduleContext={moduleContext} staticQuiz={QUIZZES[0]} />
        <NextChapterTeaser text={track === 'engineer' ? "Aarav knows what the model is now. The next question is which tasks it's reliable on — and where even the most capable model consistently fails. That boundary matters more than model quality." : "Rhea knows what the model is now. The next question is which tasks it genuinely helps with and where it's reliably wrong — and that line has almost nothing to do with which tool you pick."} />
      </ChapterSection>

      <ChapterSection num="02" accentRgb={ACCENT_RGB} id="genai-m1-capabilities">
        {chLabel('The Capability Map')}
        {h2('Every model has a reliable zone. Most teams use it outside that zone.')}
        {para(track === 'engineer'
          ? "\u25b6 After this section, you can classify any proposed LLM integration into Reliable, Extended, or Unreliable zone using three diagnostic questions — and explain what to do differently in each zone."
          : "\u25b6 After this section, you can map your team\’s AI tasks across the three zones and identify which ones need a retrieval layer or human review step to be safe."
        )}
        <SituationCard accent="#2563EB" accentRgb="37,99,235" label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? <>Aarav takes a whiteboard and maps everything his team has tried with LLMs in the last quarter. Left side: worked reliably. Right side: failed or got flagged. Middle: inconsistent. He stares at the left side — classification, summarisation, extraction from forms, rewriting dense notes. He stares at the right side — arithmetic on claim amounts, questions about current patient records, contract language that had to be legally exact. The pattern is uncomfortable because it was obvious in retrospect. The model wasn&apos;t bad at some things and good at others randomly. It had a zone. Nobody had looked for it. He calls Rohan.</>
            : <>Rhea makes a list. Every AI experiment her team has run in the last two months — she writes them on a whiteboard and draws three columns. The left column fills quickly: draft an email, summarise a case note, reformat a form for a different audience. All of them language, no single right answer, easy for a human to review. The right column is slower but the pattern is just as clear: check an SLA window, look up a current premium, verify a policy was filed. All of them needing live data, all of them silently wrong when the model tried. She had never made this map before. She had been treating AI as either magic or useless. She calls Rohan.</>}
        </SituationCard>
        <GenAIConversationScene
          mentor="rohan"
          track={track}
          accent="#2563EB"
          techLines={[
            { speaker: 'protagonist', text: "I mapped everything out — classification, summarisation, extraction on the left. Arithmetic on claim amounts, current patient records, exact contract language on the right." },
            { speaker: 'mentor', text: "Good map. What do all the left-side tasks have in common that the right side doesn\’t?" },
            { speaker: 'protagonist', text: "The left side... doesn\’t need anything from an external system. Text in, text out. Everything needed is in the prompt." },
            { speaker: 'mentor', text: "That\’s the reliable zone. The model generates equally fluently in both columns — it just can\’t warn you when it\’s outside it." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "Left column fills fast: draft email, summarise case note, reformat a form. Right column: SLA check, current premium lookup, policy verification — all wrong." },
            { speaker: 'mentor', text: "Good map. Now look at the right column failures. Were any of those still running in production when they failed?" },
            { speaker: 'protagonist', text: "Yes — the SLA checker was deployed. It was flagging cases for weeks before someone noticed something was off." },
            { speaker: 'mentor', text: "That\’s the real risk. Not that the model failed — it\’s that nobody could tell it had." },
          ]}
        />
        <GenAIAvatar
          name="Rohan"
          nameColor="#2563EB"
          borderColor="#2563EB"
          conceptId="genai-m1-capabilities"
          content={track === 'engineer'
            ? "Good map. What does the left side have in common that the right side doesn\’t?"
            : "Good map. Now look at the right column — the failures. Were any of those still running when they failed?"}
          expandedContent={track === 'engineer'
            ? "The left side is language work. Text in, text out, everything the model needs is in the prompt. The right side is either data lookups or precision tasks where being 95% right is a liability. That's the reliable zone — language tasks where the model works from what you've given it and errors are catchable before they cause harm. Outside that zone, the model doesn't warn you. It keeps generating with exactly the same confidence. Classification works. Arithmetic on novel numbers does not. The model looks equally certain in both cases. You have to know the zones before you assign the tasks, because the model won't tell you when it's out of its depth."
            : "That's the question that matters. A model being wrong in a demo is an interesting finding. A model being wrong in a deployed workflow, on real cases, before anyone checks — that's a different problem. The capability map isn't just about what the model can do. It's about where errors are catchable. In your left column, a human reads the draft before anything happens. In your right column, the model gives a wrong number or a wrong status check and it might act on it before you see it. The zone a task lives in tells you what verification you need to build around it."}
          question={track === 'engineer'
            ? "Your team wants to use AI to extract structured fields from free-text intake forms — category, urgency, callback needed. What zone does that sit in?"
            : "You want to use AI to flag inbound escalations that need same-day response. What zone does that sit in?"}
          options={track === 'engineer'
            ? [
                { text: 'Unreliable — structured extraction needs deterministic parsing logic, not AI', correct: false, feedback: 'Extraction from free text is a core LLM strength. Given a clear schema, they reliably pull structured fields from unstructured input.' },
                { text: 'Reliable — extracting defined fields from text you provide is a language task with no live data dependency', correct: true, feedback: 'Yes. The form is in the context window, the schema is specified, no external system required. Reliable zone.' },
                { text: 'Extended — you\'d need retrieval infrastructure to make this work consistently', correct: false, feedback: 'Retrieval is for when you need to look things up from external systems. If the form is in the prompt, you already have what the model needs.' },
                { text: 'Reliable, but only after fine-tuning the model on intake form examples first', correct: false, feedback: 'Fine-tuning isn\'t needed for extraction from forms you provide. A well-specified prompt with the form in context handles this reliably without additional training.' },
              ]
            : [
                { text: 'Unreliable — urgency flagging requires clinical judgment the model can\'t make', correct: false, feedback: 'Classifying from a text description is a language task. It doesn\'t require clinical judgment — it requires reading the description and applying defined criteria.' },
                { text: 'Reliable — reading a case description and flagging urgency is a language task, as long as a human reviews before action', correct: true, feedback: 'Right. The model reads text and assigns a category. No live data required. And with a review step, errors are caught before they affect the case.' },
                { text: 'Extended — you\'d need retrieval of the patient\'s history to flag urgency accurately', correct: false, feedback: 'For a first pass on inbound escalations, the description itself is often enough to flag urgency. Retrieval can be added later, but it\'s not the baseline requirement.' },
                { text: 'Unreliable — the model can\'t be consistent enough across different urgency definitions', correct: false, feedback: 'Inconsistency is a prompt specification problem, not a fundamental model limitation. Define the urgency criteria explicitly in the prompt and the model applies them reliably.' },
              ]}
        />
        {para(track === 'engineer'
          ? 'The zones are: reliable (language in, language out, no live data required), extended (retrieval-augmented or tool-augmented tasks that work with the right infrastructure), and unreliable (precise calculations on real numbers, real-time data without retrieval, legally exact outputs). The model generates equally fluently in all three. Only the first zone doesn\'t require you to build around its failures.'
          : 'The zones are: reliable (language work — summarise, classify, draft, extract — where the model works from what you give it), extended (tasks that need retrieval or tools to work correctly), and unreliable (precise arithmetic, live data without retrieval, legally exact claims). A map like the one on your whiteboard is more useful than any benchmark score.')}
        <GenAIAvatar
          name="Leela"
          nameColor="#2563EB"
          borderColor="#2563EB"
          conceptId="genai-m1-capabilities"
          content={track === 'engineer'
            ? "Aarav, the arithmetic thing on your whiteboard — claim amounts — is that in production right now?"
            : "Rhea, I want to ask you about the middle column. The inconsistent ones. When they worked, who was checking the output before anything happened with it?"}
          expandedContent={track === 'engineer'
            ? "Because that's the one I'd pull immediately. Arithmetic on real financial figures is in the unreliable zone, and the failure mode isn't 'obviously broken output' — it's 'plausibly formatted but wrong number.' Nobody flags a number that's off by 4%. It passes review. It processes. The pattern I look for is: what does a wrong output look like, and would anyone notice before it has an effect? Unreliable zone tasks with invisible failure modes are the most dangerous thing on that whiteboard."
            : "That's the pattern I always look for. When AI output has a human in the review loop, errors get caught — you learn something, you fix something, and the person affected doesn't get hurt. When AI output acts directly on something, a wrong output and a right output look the same until something downstream breaks. Your middle column is worth examining: for each one, ask whether a wrong output was catchable or whether it just proceeded. That answer tells you a lot about how to redesign those workflows."}
          question={track === 'engineer'
            ? "Your team is debating whether to add AI to two more tasks: auto-formatting outgoing case correspondence, and automatically calculating and applying claim adjustments. Which is most operationally safe to proceed with?"
            : "Two tasks are up for discussion: AI-drafted summaries that go to case workers for review, and AI-generated urgency flags that auto-route cases with no human check. What's the key difference?"}
          options={track === 'engineer'
            ? [
                { text: 'Both — AI accuracy is high enough that the risk difference is minimal', correct: false, feedback: 'Accuracy rates are averages. Claim adjustments that are wrong 2% of the time, undetected, are a financial and compliance liability. Format errors in correspondence are caught in review.' },
                { text: 'Formatting correspondence — errors are visible and low-stakes. Claim calculations are in the unreliable zone with consequential, potentially invisible errors', correct: true, feedback: 'Exactly. Formatting is a reliable-zone task with easy verification. Arithmetic on real claim amounts is unreliable, and wrong outputs in financial calculation can pass unnoticed.' },
                { text: 'Claim adjustments — more value, and accuracy rates on structured tasks are high enough to proceed', correct: false, feedback: 'Value doesn\'t determine safety. Arithmetic on novel numbers in the unreliable zone produces errors that look exactly like correct outputs.' },
                { text: 'Neither — both require domain expertise the model doesn\'t have', correct: false, feedback: 'Formatting correspondence doesn\'t require domain expertise — it\'s a language task the model handles well. The distinction is reliable zone (formatting) vs unreliable zone (arithmetic on real numbers), not domain expertise.' },
              ]
            : [
                { text: 'Auto-routing is more efficient — it removes a bottleneck from the review process', correct: false, feedback: 'Efficiency is the right goal eventually. But removing the human checkpoint means the model\'s errors act on real cases before anyone sees them.' },
                { text: 'Auto-routing removes the human checkpoint — a wrong urgency flag routes a case incorrectly with no one noticing until something downstream breaks', correct: true, feedback: 'Yes. In the first workflow, a wrong summary goes to a case worker who catches it. In the second, a wrong flag routes a case — and the affected person may not know until it\'s too late.' },
                { text: 'Both are equivalent — the model\'s accuracy on urgency flagging is high enough to proceed without review', correct: false, feedback: 'Accuracy rates don\'t address what happens in the failures. The question is whether errors are catchable, not just rare.' },
                { text: 'AI-drafted summaries are riskier — a wrong summary could mislead a case worker more than a wrong route', correct: false, feedback: 'A wrong summary goes to a case worker who reads it before acting — they catch it. A wrong urgency flag auto-routes before anyone sees it. The review step is the key difference, not which task feels higher-stakes.' },
              ]}
        />
        {keyBox('The three zones', [
          'Reliable: summarise, classify, draft, explain, extract, reformat. Language in, language out — no live data.',
          'Extended: retrieval-augmented Q&A, structured outputs, tool-augmented workflows. Works with the right infrastructure.',
          'Unreliable: real-time data lookups, precise arithmetic, legally exact claims, novel edge cases.',
        ], '#2563EB')}
        {keyBox('Zone check: three questions for any new task', [
          'Q1. Does this task need a fact from a system not already in the prompt — a live record, a current status, a database value? → Yes: Extended or Unreliable.',
          'Q2. Does a correct answer require precise arithmetic or a legally exact output where being close is not good enough? → Yes: Unreliable.',
          'Q3. Is everything the model needs already in the prompt — text in, text out, no external lookup required? → Yes: Reliable.',
          'If Q1 and Q2 are both No and Q3 is Yes: Reliable. If Q1 is Yes but the task can be solved with the right retrieval infrastructure: Extended. If Q2 is Yes regardless of anything else: Unreliable.',
        ], '#2563EB')}
        {para(track === 'engineer'
          ? "Applied: Aarav wants to auto-calculate claim adjustment amounts. Q1: Yes — the claim amount lives in a database, not the prompt. Q2: Yes — arithmetic on real financial figures where a 3% error is a compliance issue. Zone: Unreliable. The fix is not a better prompt — it is removing this task from LLM scope and using a deterministic calculation layer."
          : "Applied: Rhea wants to flag overdue insurance exceptions. Q1: Yes — overdue status requires checking a timestamp in the case management system, which is not in the prompt. Zone: Extended. The model can classify exception descriptions you give it, but it cannot determine whether a deadline has passed without a retrieval layer pulling that data first."
        )}
        <TiltCard style={{ margin: '28px 0' }}><CapabilityZoneCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'engineer' ? "Map your last three LLM integration attempts across the three zones. For the failures — which zone were they actually in, and what was the failure mode? Visible or invisible?" : "Take your whiteboard map and add one column: for each task, who sees the output before it affects anything? That column tells you which tasks need redesigning."} />
        <QuizEngine conceptId="genai-m1-capabilities" conceptName="Capability Map" moduleContext={moduleContext} staticQuiz={QUIZZES[1]} />
        <NextChapterTeaser text={track === 'engineer' ? "Aarav has the capability map. But knowing the zones doesn't tell you how to assign tasks reliably. That takes a different shift — from the way you've been thinking about prompts." : "Rhea has the capability map. But knowing where AI is reliable doesn't automatically mean her team will use it well. That depends on something about how they're communicating with it."} />
      </ChapterSection>

      <ChapterSection num="03" accentRgb={ACCENT_RGB} id="genai-m1-mental-model">
        {chLabel('The Mental Model Shift')}
        {h2('You are not asking a question. You are specifying a task.')}
        {para(track === 'engineer'
          ? "\u25b6 After this section, you can diagnose a prompt variance problem and specify the missing dimensions — role, format, constraints, length, example — that collapse it."
          : "\u25b6 After this section, you can rewrite a vague prompt by identifying every unspecified dimension and filling it in deliberately."
        )}
        <SituationCard accent="#0F766E" accentRgb="15,118,110" label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? <>Aarav notices the variance problem. Same endpoint, same model, same task — &ldquo;summarise this case note&rdquo; — and the outputs range from sharp and structured to meandering and vague. He spends two hours blaming the model version. Then he looks more carefully at the calls themselves. The good outputs came from Aisha&apos;s prompts. The bad ones came from Imran&apos;s. The model is the same. The prompts are not. Aisha&apos;s specify a role, output format, required fields, and length. Imran&apos;s are three words followed by a case note. He messages Anika.</>
            : <>Rhea watches her team use the AI assistant for a week. She notices something: the people who get useful, consistent results are writing very different prompts from the people who get frustrating ones. Aisha&apos;s prompts are long — role, format, what to include, what to skip, how long the output should be. Imran&apos;s are short: &ldquo;Summarise this.&rdquo; &ldquo;What should I do about this case?&rdquo; Same model. The outputs barely resemble each other. Rhea thinks it might be a skill gap — that Aisha has some intuition Imran hasn&apos;t developed. She messages Anika to check.</>}
        </SituationCard>
        <GenAIConversationScene
          mentor="anika"
          track={track}
          accent="#0F766E"
          techLines={[
            { speaker: 'protagonist', text: "Same model, same task — Aisha gets sharp, structured outputs. Imran gets meandering ones. I can\’t explain it." },
            { speaker: 'mentor', text: "Read me one of Imran\’s prompts and one of Aisha\’s. Exactly as written." },
            { speaker: 'protagonist', text: "Imran: \‘Summarise this case note.\’ Aisha: role, task, format, length, what to exclude, one example output." },
            { speaker: 'mentor', text: "Imran\’s prompt has one dimension specified. Aisha\’s has six. Every gap Imran leaves, the model fills with whatever seems statistically plausible — differently each run." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "Aisha gets useful outputs consistently. Imran gets all over the place. I assumed Aisha just has better instincts." },
            { speaker: 'mentor', text: "It\’s not instincts. \‘Summarise this\’ is a question. Aisha\’s version is a specification. They\’re different briefs." },
            { speaker: 'protagonist', text: "So the model is choosing everything Imran didn\’t specify — format, length, what to include." },
            { speaker: 'mentor', text: "And it chooses differently every run. Aisha\’s prompts don\’t leave anything to chance. That\’s not intuition — it\’s discipline." },
          ]}
        />
        <GenAIAvatar
          name="Anika"
          nameColor="#0F766E"
          borderColor="#0F766E"
          conceptId="genai-m1-mental-model"
          content={track === 'engineer'
            ? "Imran\’s prompt has one dimension specified. Aisha\’s has five. Every unspecified dimension is a choice the model makes for you."
            : "It\’s not a skill gap. Aisha is specifying a task. Imran is asking a question. Those are not the same thing."}
          expandedContent={track === 'engineer'
            ? "There it is. Imran's prompt has one dimension specified: the task. Aisha's has five: role, task, format, length, and constraints. Every dimension that's unspecified in a prompt is a decision the model makes for you — format, length, perspective, tone, level of detail, what to include. It fills those gaps with the most statistically plausible defaults from its training data. Sometimes that matches what you want. Often it doesn't. Imran's variance isn't a model problem. It's a specification problem. The model is doing exactly what it was asked to do — it just had to choose everything Imran didn't specify."
            : "When you type 'Summarise this', the model has to decide: how long? What format? What to include? What to leave out? What level of detail? It fills every one of those gaps with whatever seems most plausible based on its training. Sometimes that matches what you needed. Often it doesn't. Aisha's prompts leave almost no gaps. Imran's prompts are almost entirely gaps. The model isn't performing differently — it's just completing very different briefs. The good news is this is immediately fixable. You don't need a new tool, a new model, or any technical changes."}
          question={track === 'engineer'
            ? "Imran says 'I can't control model variance — it's a fundamental limitation.' What would you tell him?"
            : "Imran wants to know what to add to his prompt first. What would you start with?"}
          options={track === 'engineer'
            ? [
                { text: 'Agree — LLM variance is a known limitation that can\'t be engineered around', correct: false, feedback: 'Variance exists, but it fills the space you leave for it. Specify format, length, and constraints, and the variance mostly disappears.' },
                { text: 'The model is filling the gaps he\'s leaving. If he specifies format, length, and what to include, the variance will collapse', correct: true, feedback: 'Exactly. "Summarise this" leaves every dimension open. "Write a 3-sentence summary covering category, key action, and urgency — in plain language for a case worker" doesn\'t.' },
                { text: 'He needs to provide more context about each case to get consistent outputs', correct: false, feedback: 'More case context helps the model understand the situation. But output variance is about output specification — format, length, structure — not input volume.' },
                { text: 'Switch to a lower temperature setting to reduce the model\'s randomness', correct: false, feedback: 'Temperature reduction helps at the margins, but output variance from an underspecified brief isn\'t primarily a temperature problem. A lower-temperature model still has to choose format, length, and structure when you leave them open.' },
              ]
            : [
                { text: 'More context about the case — the model needs more background to produce a good summary', correct: false, feedback: 'More input context helps the model understand the situation. But the inconsistency is about output specification — Imran\'s prompt doesn\'t tell the model what format, length, or structure to use.' },
                { text: 'Format and length — define what the output should look like before anything else', correct: true, feedback: 'Yes. "Write a 3-sentence summary in plain language, covering: what happened, what action is needed, and urgency level" immediately collapses most of the variance.' },
                { text: 'A role instruction — telling the model it\'s a claims specialist', correct: false, feedback: 'Role helps orient the model, but if format and length are still unspecified, the outputs will still vary significantly.' },
                { text: 'A stricter instruction at the end — \'be consistent and professional\'', correct: false, feedback: 'Vague quality instructions don\'t anchor specific dimensions. \'Be consistent\' doesn\'t tell the model what consistent looks like. Format and length specifications do.' },
              ]}
        />
        {para(track === 'engineer'
          ? 'The shift is from question-asking to task specification. A question is "summarise this." A specification is: role, task, format, constraints, length, and what to exclude. When those dimensions are defined, the model stops choosing them. Variance drops. Not because the model improved — because the brief stopped leaving things to chance.'
          : 'The shift is from asking to specifying. A question leaves gaps. A specification fills them. When format, length, constraints, and structure are defined, the model executes your choices instead of making its own. That\'s true for a three-sentence summary, a draft email, or a structured triage report.')}
        <GenAIAvatar
          name="Kabir"
          nameColor="#0F766E"
          borderColor="#0F766E"
          conceptId="genai-m1-mental-model"
          content={track === 'engineer'
            ? "Aarav, there\’s one more thing Aisha does that Imran doesn\’t. Look at her prompts again."
            : "Rhea, there\’s one thing I\’ve watched consistently narrow the gap between what people want and what the model produces. Does Aisha ever include an example in her prompts?"}
          expandedContent={track === 'engineer'
            ? "She includes an example output. Not always — but for any task where the format really matters, she pastes one previous output and says 'like this.' I've watched teams spend hours writing instruction paragraphs trying to explain exactly what format they need, and then still be surprised when the model interprets it differently. One concrete example teaches format, tone, level of detail, and scope simultaneously. It shows the model what you mean instead of describing it. That's the fastest way to collapse the gap between the output you're imagining and the output you get."
            : "That's the pattern. Instructions tell the model what you want. Examples show it. When Aisha includes a sample output, the model has a concrete reference for length, format, and style — not a description to interpret. I've seen teams spend a whole afternoon writing detailed prompt instructions and still get variance because there's always room to interpret a description differently. One well-chosen example closes most of that gap immediately."}
          question={track === 'engineer'
            ? "You're building a reusable prompt for weekly case triage summaries. What's the most efficient way to lock in consistent format?"
            : "You're writing a prompt for a recurring task — weekly escalation summaries for the director. What's the fastest way to make sure the format stays consistent?"}
          options={track === 'engineer'
            ? [
                { text: 'Write comprehensive format instructions covering every structural edge case', correct: false, feedback: 'Comprehensive instructions help but still leave interpretation space. One example is more efficient — it shows exactly what you mean.' },
                { text: 'Include one example of a good output as a reference for the model to match', correct: true, feedback: 'One well-chosen example teaches format, tone, length, and structure simultaneously. It\'s the fastest way to get consistent outputs on a recurring task.' },
                { text: 'Run it a few times and manually select the best output as the template', correct: false, feedback: 'That helps you identify what good looks like, but without embedding that standard in the prompt, every new run is still a lottery.' },
                { text: 'Add a chain-of-thought instruction so the model explains its formatting choices', correct: false, feedback: 'Chain-of-thought is useful for reasoning tasks. For format consistency on a recurring task, an example output is more direct — it shows the model what to produce rather than asking it to reason about how.' },
              ]
            : [
                { text: 'Write detailed formatting instructions and test against five cases before going live', correct: false, feedback: 'Detailed instructions help, but they still leave room for interpretation. An example gives the model a concrete reference that doesn\'t depend on interpretation.' },
                { text: 'Include one good previous summary as an example so the model has a concrete reference', correct: true, feedback: 'Exactly. One example teaches format, length, and tone simultaneously — more efficiently than any description.' },
                { text: 'Ask the model to suggest a format, then standardise on what it proposes', correct: false, feedback: 'That gives you a model-chosen format. For a recurring task with a specific audience, the format should come from you.' },
                { text: 'Send the prompt to three team members and use whichever version produces the most consistent outputs', correct: false, feedback: 'Testing with team members evaluates outputs, but doesn\'t anchor format in the prompt. An example output is what makes every future run consistent — not just the ones your team tested.' },
              ]}
        />
        {pullQuote('Vague brief, model chooses. Specific brief, you choose. The model executes either way.')}
        <TiltCard style={{ margin: '28px 0' }}><PromptCompareCard track={track} /></TiltCard>
        {keyBox('Elements of a clear task specification', [
          'Role: who the model should act as ("You are a claims triage analyst").',
          'Task: what to do, precisely ("Classify this request into one of five categories").',
          'Format: what the output must look like ("Return three sentences: what happened, action needed, urgency").',
          'Constraints: what to include, exclude, or prioritise.',
          'Example: one sample input-output pair that shows rather than describes.',
        ], '#0F766E')}
        {PMPrincipleBox({ label: '◈ Principle', principle: 'Every gap in a prompt is a decision the model makes for you. Decide intentionally or accept whatever the model chooses.' })}
        <ApplyItBox prompt={track === 'engineer' ? "Take the worst-performing prompt in your current stack. List every unspecified dimension: role, output format, length, constraints, examples. Add them one at a time. Which change had the biggest effect on variance?" : "Find a prompt your team uses that gives inconsistent results. Count the gaps — format, length, perspective, what to exclude. Add specifications for each. Compare the output before and after."} />
        <QuizEngine conceptId="genai-m1-mental-model" conceptName="Mental Model Shift" moduleContext={moduleContext} staticQuiz={QUIZZES[2]} />
        <NextChapterTeaser text={track === 'engineer' ? "Aarav has the specification mindset. But a well-specified prompt still fails when what the model receives is broken. The context packet is often where the real problem lives." : "Rhea can write better prompts now. But there's one more variable that determines whether a good prompt produces a good output — and it has nothing to do with the prompt itself."} />
      </ChapterSection>

      <ChapterSection num="04" accentRgb={ACCENT_RGB} id="genai-m1-context">
        {chLabel('Context Is the Input')}
        {h2('The quality of the output is bounded by the quality of what went in.')}
        {para(track === 'engineer'
          ? "\u25b6 After this section, you can identify a context assembly failure in a staging environment and know to fix the data pipeline before touching the prompt."
          : "\u25b6 After this section, you can audit what the model actually receives in a failing case and distinguish a context quality problem from a prompt problem."
        )}
        <SituationCard accent="#C2410C" accentRgb="194,65,12" label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? <>Aarav&apos;s team has a prompt that works well in testing — sharp outputs, right format, right length. In staging, the same prompt produces degraded outputs on roughly one in five cases. He spends most of a day in the prompt, adding constraints, clarifying the format spec, running A/B tests. The outputs barely change. Finally, a colleague suggests inspecting the actual payloads. He pulls up a failing case. The context packet has a patient record where three fields are null, a case note truncated at the API limit, and an intake form where structured fields were flattened into a single unbroken string. He messages Rohan.</>
            : <>Rhea&apos;s team has been using the summary tool for six weeks. Mostly good. Then she notices the failure cases aren&apos;t random — they cluster around older cases, cases from before the system migration, cases where the PDF attachments didn&apos;t load. She pulls up a good summary and a bad one side by side. Same prompt. The bad one came from a case with half the fields blank and two attachments that show as &ldquo;unavailable.&rdquo; She&apos;d been assuming it was the prompt. She messages Rohan.</>}
        </SituationCard>
        <GenAIConversationScene
          mentor="rohan"
          track={track}
          accent="#C2410C"
          techLines={[
            { speaker: 'protagonist', text: "My prompt works perfectly in testing. In staging, 1-in-5 cases degrade. I\’ve spent a day tightening the constraints." },
            { speaker: 'mentor', text: "Stop touching the prompt. Pull up a failing staging case and tell me exactly what the model received." },
            { speaker: 'protagonist', text: "Three null fields, a case note truncated at the API limit, one form flattened into an unbroken string." },
            { speaker: 'mentor', text: "The model didn\’t fail. It generated the best output it could from broken inputs. The bug is in your context assembly pipeline, not the prompt." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "The failures cluster around older cases and cases where PDFs didn\’t load. I\’ve been rewriting the prompt for a week." },
            { speaker: 'mentor', text: "The prompt isn\’t your problem. Pull up a bad case and tell me what was actually in the record the model received." },
            { speaker: 'protagonist', text: "Half the fields are blank. Two attachments show as unavailable." },
            { speaker: 'mentor', text: "The model produced a summary of what it was given. It doesn\’t have a way to say \‘this isn\’t enough.\’ Context quality failure — not a prompt failure." },
          ]}
        />
        <GenAIAvatar
          name="Rohan"
          nameColor="#C2410C"
          borderColor="#C2410C"
          conceptId="genai-m1-context"
          content={track === 'engineer'
            ? "Before we touch the prompt — tell me what the model actually received in a failing case. Exactly what was in the payload."
            : "Before you change the prompt — pull up a failing case and tell me what's actually in the record the model received."}
          expandedContent={track === 'engineer'
            ? "There it is. The model didn't fail. It did exactly what it was supposed to do — it generated the most plausible summary from what it received. Three null fields, a truncated case note, and a flattened form. That's not enough information to produce a sharp output. The model doesn't have a way to say 'this context is broken, I can't work with this.' It just generates from whatever it has. The context is the actual input. Everything the model knows about your specific case has to be in that payload at inference time. No memory between calls. No ability to look things up. If the context is broken, the output will reflect that — and it will look like a model failure when it's actually a data pipeline failure."
            : "That's the answer. The prompt is the same. The model is the same. The context is different. The good summary came from a complete record. The bad one came from a skeleton with missing attachments and blank fields. The model doesn't have a way to flag that something is missing — it generates from whatever it receives. So it produced a summary of the information that was there. That's not a model inconsistency problem. That's a context quality problem. The two cases might as well have been sent to a different model — because from the model's perspective, they might as well have been completely different documents."}
          question={track === 'engineer'
            ? "Your team proposes upgrading to a larger model to fix the staging inconsistency. What would you say?"
            : "You've been debugging the prompt for a week. A colleague says 'just upgrade the model.' What's your response now?"}
          options={track === 'engineer'
            ? [
                { text: 'Agree — a larger model handles incomplete context better', correct: false, feedback: 'A larger model receiving a context packet with null fields and a truncated case note will produce a better-written bad output. The constraint is the data, not the model.' },
                { text: 'Fix the context assembly pipeline first — the model is doing its job with broken inputs', correct: true, feedback: 'Exactly. The model generates from what it receives. If the payload is broken, the fix is in the data pipeline, not the model.' },
                { text: 'Add fallback instructions to the prompt for when fields are missing', correct: false, feedback: 'Fallback instructions help the model handle missing data more gracefully. But they don\'t fix missing data. The context assembly layer needs to validate before inference.' },
                { text: 'Rewrite the prompt to explicitly handle each missing field scenario', correct: false, feedback: 'You can\'t write your way out of missing data. If the case note is truncated at the API limit, no prompt instruction recovers what was cut off. Fix the data pipeline.' },
              ]
            : [
                { text: 'Agree — a better model would infer missing information from the partial context', correct: false, feedback: 'Models can\'t conjure information that isn\'t there. A larger model generates a more fluent summary of nothing.' },
                { text: 'The model is working correctly — the issue is incomplete context reaching the model. That\'s a data pipeline problem', correct: true, feedback: 'Yes. Same prompt, same model, different inputs. The variable is the context packet. Fix that layer first.' },
                { text: 'Keep debugging the prompt — there\'s probably a constraint that would make the model handle incomplete records better', correct: false, feedback: 'You can instruct the model to handle missing data gracefully, but instructions can\'t substitute for actual information. If the attachment didn\'t load, no prompt instruction retrieves it.' },
                { text: 'Add a verification step after the summary is generated, asking the model to check its own output', correct: false, feedback: 'Self-verification doesn\'t work when the model doesn\'t know what information is missing. It can only check what it received — not what should have been there.' },
              ]}
        />
        {para(track === 'engineer'
          ? 'Context is not configuration. It is the actual input the model receives at inference time. Everything the model knows about your specific case must be in the context window. The model has no memory between calls, no access to your systems, no ability to retrieve information it was not sent. Output quality is bounded by context quality — not by model quality.'
          : 'The model has no memory between calls and no access to systems it wasn\'t given. Every fact it needs to produce a good output has to be in the context window when you make the call. A good prompt with broken context produces a broken output — not because the model failed, but because it did exactly what you asked with what you gave it.')}
        <GenAIAvatar
          name="Leela"
          nameColor="#C2410C"
          borderColor="#C2410C"
          conceptId="genai-m1-context"
          content={track === 'engineer'
            ? "Aarav — how long was the staging environment running before you caught this?"
            : "Rhea, I want to ask you about the six weeks before you noticed the pattern."}
          expandedContent={track === 'engineer'
            ? "Because that's the design problem I'm most concerned about. Not that the context packets were broken — that's fixable. The problem is the system had no way to know a context packet was broken. A null field, a truncated note, a flattened form — those all produced outputs that looked like outputs. Not error states. Not flags. Just a summary, formatted correctly, sent to whoever was waiting for it. The question for your context assembly layer is: what does it do when a required field is missing? Does it fail loudly and route the case for human review? Or does it silently proceed?"
            : "For six weeks, bad summaries were going to case workers on those older cases. Some of them may have acted on incomplete information. The thing about context quality failures is they're silent — the output looks like an output. It doesn't look like an error. Nobody sees a red flag. They just see a summary that's a bit thin or misses something important. The design question is: what should your system do when a required field is missing or an attachment doesn't load? Because right now, the answer is: proceed and generate anyway."}
          question={track === 'engineer'
            ? "You're redesigning the context assembly layer. What's the most important safeguard to add?"
            : "You're redesigning the summary workflow. What's the most important thing to add to the context assembly step?"}
          options={track === 'engineer'
            ? [
                { text: 'Log all API calls so you can inspect failing cases after the fact', correct: false, feedback: 'Logging is essential for debugging, but it doesn\'t prevent bad outputs from being delivered. The safeguard needs to be before inference.' },
                { text: 'Validate required fields before sending to the model — if they\'re missing, flag the case for human review instead of running inference', correct: true, feedback: 'Exactly. Silent failures are the most dangerous kind. Validate context completeness before the call. If something critical is missing, the system should know that and act accordingly.' },
                { text: 'Add a confidence score output so downstream users know when to verify the summary', correct: false, feedback: 'Confidence scores help, but they reflect the model\'s self-assessment, not context completeness. A model receiving a broken context packet doesn\'t necessarily output a low confidence score.' },
                { text: 'Set up automated regression testing that runs on a weekly batch of real cases', correct: false, feedback: 'Regression testing catches patterns after delivery. The safeguard needs to be pre-inference — if a required field is missing, the case shouldn\'t reach the model at all.' },
              ]
            : [
                { text: 'Add a disclaimer to every AI summary reminding case workers to verify against the original record', correct: false, feedback: 'Disclaimers shift the burden to the case worker without fixing the underlying issue. If the context is broken, the summary is unreliable regardless of the disclaimer.' },
                { text: 'Validate that required fields are present and attachments loaded before running the model — route incomplete cases to human review', correct: true, feedback: 'Yes. The safeguard goes before inference, not after. If the context is incomplete, the system should flag it — not silently generate a degraded summary.' },
                { text: 'Have case workers rate summaries so you can identify which ones the model struggled with', correct: false, feedback: 'Rating helps you find past failures. It doesn\'t prevent future ones from reaching case workers first.' },
                { text: 'Re-run the model on failing cases with a different prompt once they\'re identified', correct: false, feedback: 'Re-running with a different prompt doesn\'t help if the context is still broken. If the attachments didn\'t load and the fields are blank, a different prompt gets the same bad inputs.' },
              ]}
        />
        {keyBox('What belongs in a good context packet', [
          'The task input: the document, case note, or record being processed — complete and correctly structured.',
          'Relevant background: role of the reader, purpose of the output, what\'s already known.',
          'Constraints: what to include, exclude, or flag in the output.',
          'Validation: required fields present, attachments loaded, data not truncated.',
        ], '#C2410C')}
        {PMPrincipleBox({ label: '◈ Principle', principle: 'The model cannot produce what it does not have. Fix the context before you fix the prompt.' })}
        <TiltCard style={{ margin: '28px 0' }}><ContextPacketCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'engineer' ? "Pick a production LLM call with inconsistent outputs. Compare the context packets across good and bad cases. What fields are present in good runs but missing or malformed in bad ones? What does the context assembly layer need to validate before inference?" : "Find a case where an AI tool gave you a surprisingly poor output. What was actually in the context it received? Was anything missing, truncated, or in the wrong format? What would a validated context packet look like for that case?"} />
        <QuizEngine conceptId="genai-m1-context" conceptName="Context as Input" moduleContext={moduleContext} staticQuiz={QUIZZES[3]} />
        <NextChapterTeaser text={track === 'engineer' ? "Aarav has the four fundamentals: what the model is, where it's reliable, how to specify tasks, and why context quality matters. The last question is the one that has to come before any of this reaches production." : "Rhea has the four fundamentals. The last question is the most practical: given everything she now knows, which use case does she actually build first?"} />
      </ChapterSection>

      <ChapterSection num="05" accentRgb={ACCENT_RGB} id="genai-m1-apply">
        {chLabel('Your First Use Case')}
        {h2('Win clearly. Verify easily. Fail cheaply.')}
        {para(track === 'engineer'
          ? "\u25b6 After this section, you can apply three selection criteria to a list of AI candidates and make the case for which one is safe and learnable enough to build first."
          : "\u25b6 After this section, you can evaluate a proposed AI use case against three readiness criteria and identify the smallest version of the idea that passes all three."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? <>Aarav has three candidates for a first production AI integration. Option one: auto-approve routine claims exceptions when AI confidence is above a threshold — biggest efficiency gain, clearest ROI. Option two: classify inbound case requests by type and urgency, flagging low-confidence cases for human review. Option three: an autonomous intake agent that monitors the queue, routes requests, and takes action without human checkpoints — most technically interesting. He builds the ROI case for option one. Then he messages Anika before the presentation.</>
            : <>Rhea has three options to bring to her director. Option one: auto-resolve routine exception requests where the AI confidence is above 80% — biggest headline number, clearest headcount case. Option two: classify inbound escalations by category and urgency, with human review of anything below a confidence threshold. Option three: AI drafts responses to provider complaints, sent directly after a quick assistant spot-check. She&apos;s been building the case for option one. She calls Anika the night before the presentation.</>}
        </SituationCard>
        <GenAIConversationScene
          mentor="anika"
          track={track}
          accent={ACCENT}
          techLines={[
            { speaker: 'protagonist', text: "Option one has the clearest ROI — auto-approve routine claims when AI confidence clears 80%. I\’ve built the case." },
            { speaker: 'mentor', text: "Walk me through it. What happens to a case when the confidence score is high but the decision is wrong?" },
            { speaker: 'protagonist', text: "It gets approved and routes through the system. Nobody reviews it before it acts." },
            { speaker: 'mentor', text: "Confidence is the model\’s estimate of its own certainty — not accuracy. At 80%, one in five confident decisions is wrong. Your ROI deck doesn\’t price that in." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "Option one has the best headline number — auto-resolve exceptions at 80% confidence. That\’s the headcount case my director wants." },
            { speaker: 'mentor', text: "Walk me through what an incorrectly resolved exception looks like to the person who submitted it." },
            { speaker: 'protagonist', text: "They\’d get a resolution notice. But if it was wrong\… they might not know until something downstream broke." },
            { speaker: 'mentor', text: "And can you tell how many wrong resolutions there have been? That\’s the question your director will ask when the first one surfaces." },
          ]}
        />
        <GenAIAvatar
          name="Anika"
          nameColor={ACCENT}
          borderColor={ACCENT}
          conceptId="genai-m1-use-case-readiness"
          content={track === 'engineer'
            ? "Walk me through option one. What happens to a case when the AI confidence score is wrong?"
            : "Walk me through option one. Auto-resolve at 80% confidence. What does an incorrectly resolved exception look like to the person who submitted it?"}
          expandedContent={track === 'engineer'
            ? "A confidence score is not accuracy. It's the model's estimate of its own certainty — which correlates with accuracy but is not the same thing. An 80% threshold means roughly 1 in 5 decisions the model is confident about are wrong. Now: what does an incorrectly auto-approved exception look like, end to end? Does it route somewhere before anyone sees it? Does the person affected know? Can they appeal? Can you tell how many there have been? That's the question the ROI presentation hasn't answered. The first use case doesn't have to be the most impressive one. It has to be one where you can see what the system is doing, learn from its mistakes, and improve it. You can't do that with option one."
            : "Do they get a notification? Can they see what happened? Is there a flag in your system that says 'AI-resolved, no human review'? Because here's what I know: a confidence score is the model's estimate of its own certainty, not a guarantee of accuracy. At 80%, 1 in 5 cases the model thinks it's sure about are wrong. If those wrong cases auto-resolve and nobody catches them, you don't have an efficiency gain. You have a liability you don't know the size of yet. The first use case is how you learn what your model gets wrong. That learning requires being able to see the failures. Option one makes them invisible."}
          question={track === 'engineer'
            ? "Your director pushes back: 'Option two doesn't show enough efficiency gain. Why start there?' What's the right argument?"
            : "Your director says 'Option two doesn't move the needle on headcount. Why would we do this?' What do you say?"}
          options={track === 'engineer'
            ? [
                { text: 'Option two is safer from a compliance standpoint, which limits our liability exposure', correct: false, feedback: 'That frames it as caution vs. results. The real argument is about what you can actually build reliably and what you learn from it.' },
                { text: 'Option two teaches us where the model fails before those failures affect outcomes — that\'s what earns the right to do option one later', correct: true, feedback: 'Exactly. Six weeks of option two tells you which case types the model misclassifies, what the context looks like when it fails, and what accuracy looks like on real data. Option one without that foundation is a liability.' },
                { text: 'Option one requires more infrastructure than we have right now', correct: false, feedback: 'Infrastructure is a real consideration but not the strongest argument. The core issue is what happens when the model is wrong and whether you\'ll know.' },
                { text: 'Option three is the better learning opportunity — more complexity means more to learn', correct: false, feedback: 'More complexity means more variables, harder-to-attribute failures, and harder-to-recover mistakes. The first use case should maximise observability, not complexity.' },
              ]
            : [
                { text: 'Option two is the safe, compliance-friendly choice while we prove the technology', correct: false, feedback: 'That frames option two as the cautious option. It\'s actually the strategic one — it generates the data that makes option one viable later.' },
                { text: 'Option two teaches us exactly where the model fails before those failures affect real cases — that\'s what makes option one possible to do safely', correct: true, feedback: 'Exactly. Option two is how you build the foundation. Six weeks of classification data tells you what the model gets wrong, how often, and on which case types. Without that, option one\'s 80% confidence threshold is a number with no context.' },
                { text: 'Option one requires more technical complexity than we\'re ready for right now', correct: false, feedback: 'Complexity is a real factor, but the stronger argument is about observability. Option one without a review step makes failures invisible until they\'ve had an effect.' },
                { text: 'Start with option three — the drafting task is the one staff will actually adopt', correct: false, feedback: 'Adoption isn\'t the right first criterion. Option three sends AI drafts with minimal human review — it removes most of the human checkpoint. Option two\'s review step is what makes it learnable.' },
              ]}
        />
        {para(track === 'engineer'
          ? 'The first use case is not about maximum impact. It is about building something you can see, understand, and improve. Bounded output, human checkpoint, easy verification, recoverable failures. Classification with a review gate is the archetype — the model suggests, a human confirms, and the team learns exactly where the model fails before those failures affect anything.'
          : 'The first use case is not the most efficient one. It is the most learnable one. Bounded output, human review, easy verification, recoverable errors. Classification with a review step is the archetype — the model reads, categorises, flags uncertainty, and a human confirms. The team learns what the model gets wrong before any of that affects a case.')}
        <GenAIAvatar
          name="Kabir"
          nameColor={ACCENT}
          borderColor={ACCENT}
          conceptId="genai-m1-use-case-readiness"
          content={track === 'engineer'
            ? "Aarav, I want to ask you something different. After six weeks of running option two — what would you need to see before you\’d feel comfortable removing the review step?"
            : "Rhea, after six weeks of running option two — what would you need to see before you\’d feel ready to move to option one?"}
          expandedContent={track === 'engineer'
            ? "That's the question that turns a pilot into a strategy. You'd want to know: which case types does the model classify correctly 98%+ of the time? Which ones does it consistently get wrong? What does the context look like in the failures — are there patterns? How long does the review step actually take when a human catches a bad classification? Those six weeks turn the 80% confidence threshold from a number into a decision. You don't remove the review step. You narrow it — apply it only to the case types where the model has earned that trust. That's how you get to option one. Not by starting there."
            : "That's the question that connects option two to option one. Not 'when have we run it long enough?' but 'what does the data show us?' Which escalation categories is the model consistently right on? Which ones does it misclassify, and what do those cases look like? How often does the human reviewer change the classification? Once you have that, you're not guessing about 80% confidence — you have actual accuracy rates on your actual cases. You extend autonomy to the categories the model has earned it on. That's how option one becomes viable. Not by starting there on faith."}
          question={track === 'engineer'
            ? "After six weeks, your classification model is 94% accurate on routine cases. Someone proposes removing the review step. What do you check first?"
            : "After six weeks, the model is correctly flagging 93% of escalations. Your director wants to move to auto-routing with no human review. What's the first question you ask?"}
          options={track === 'engineer'
            ? [
                { text: 'Whether 94% meets the industry benchmark for this classification task', correct: false, feedback: 'Benchmarks compare you to other models. They don\'t tell you what the 6% failures look like in your specific workflow.' },
                { text: 'What the 6% misclassifications are — which case types, and whether a wrong classification causes recoverable or unrecoverable harm', correct: true, feedback: 'Exactly. 94% sounds high. But if the 6% that are wrong are the highest-stakes cases, removing the review step is a different decision than it looks. The failure cases tell you more than the accuracy rate does.' },
                { text: 'Whether the model has been trained on enough domain-specific cases to generalise reliably', correct: false, feedback: 'Training coverage is worth understanding, but after six weeks of live data, the question is about the actual failure modes you\'ve observed.' },
                { text: 'Whether the team has enough capacity to keep reviewing the edge cases the model flags', correct: false, feedback: 'Capacity matters for the review step, but the first question is about the failure pattern. Understanding what the 6% looks like determines whether narrowing the review step is safe — not whether you have enough reviewers.' },
              ]
            : [
                { text: 'Whether the model\'s accuracy rate is high enough to meet the SLA we\'ve committed to', correct: false, feedback: 'SLA compliance is a goal, but it doesn\'t answer what happens when the model is wrong. The question is about failure mode, not error rate.' },
                { text: 'What the 7% misclassifications look like — which case types, and whether an incorrectly routed case causes harm before it\'s caught', correct: true, feedback: 'Yes. 93% sounds reliable. But if the cases the model misclassifies are the highest-urgency ones, auto-routing them is a different risk than the headline number suggests.' },
                { text: 'Whether we can build an escalation path so misrouted cases get flagged eventually', correct: false, feedback: 'An escalation path helps catch failures after they happen. The question is whether you understand the failure pattern well enough to design that path correctly.' },
                { text: 'Whether the 93% accuracy has been consistent across all six weeks of the pilot', correct: false, feedback: 'Consistency over time matters, but it still doesn\'t tell you what the failures look like. A model that\'s consistently 93% accurate on low-stakes cases might still be failing on the highest-urgency ones.' },
              ]}
        />
        {track === 'builder' ? keyBox('Walking two tasks through the criteria — Rhea\’s candidates', [
          'Task A: AI drafts responses to provider complaints, reviewed by an assistant before sending.',
          '  \u2713 Win clearly: a good draft is readable, on-tone, and addresses the complaint. Rhea can define that before running it.',
          '  \u2713 Verify easily: the assistant reads it in 30 seconds and spots anything wrong.',
          '  \u2713 Fail cheaply: a bad draft gets edited or discarded. Nothing is sent without human sign-off.',
          '  \u2192 Passes all three. Good first use case.',
          '',
          'Task B: AI checks whether claims were processed within the SLA window.',
          '  \u2717 Win clearly: seems clear — yes or no answer. But the correct answer requires a timestamp from the case management system.',
          '  \u2717 Fail cheaply: if the model generates a wrong SLA status and it acts on a case before anyone checks, harm is done silently.',
          '  \u2192 Fails. Not a language task — it requires live data the model cannot access. Extended zone at minimum.',
        ], ACCENT) : keyBox('Walking two tasks through the criteria — Aarav\’s candidates', [
          'Task A: AI auto-formats outgoing case correspondence to the required template.',
          '  \u2713 Win clearly: correct formatting is visually verifiable — the fields are in the right place, the structure matches the template.',
          '  \u2713 Verify easily: anyone can read the output and spot a misplaced field or wrong section header.',
          '  \u2713 Fail cheaply: a bad format gets caught in the review step before the letter goes out.',
          '  \u2192 Passes all three. Good first use case.',
          '',
          'Task B: AI auto-calculates and applies claim adjustment amounts.',
          '  \u2717 Win clearly: the correct adjustment depends on policy terms and claim data in external systems — you cannot verify correctness from the prompt alone.',
          '  \u2717 Fail cheaply: a wrong adjustment that applies automatically is a financial and compliance error. It may not surface until something downstream breaks.',
          '  \u2192 Fails. Precise arithmetic on real claim data is Unreliable zone. Even 98% accuracy means systematic errors at scale.',
        ], ACCENT)}
        {keyBox('First use case readiness criteria', [
          'Language-based: text in, text out. No live database access needed.',
          'Bounded output: category, summary, or draft — not a final decision or irreversible action.',
          'Easy to verify: a human can quickly check whether the output is right.',
          'Recoverable: errors are caught before they affect anything downstream.',
          'Observable: you can see what the model gets wrong, not just what it gets right.',
        ], ACCENT)}
        {PMPrincipleBox({ label: '◈ Principle', principle: 'Win clearly, verify easily, fail cheaply. That is the brief for the first use case.' })}
        <TiltCard style={{ margin: '28px 0' }}><UseCaseReadinessCard track={track} /></TiltCard>
        <ApplyItBox prompt={track === 'engineer' ? "Name three AI integration candidates from your current backlog. Run each through the five criteria: language-based, bounded output, easy to verify, recoverable, observable failures. Which one scores best? What does running it first teach you that the others can't?" : "Name one AI workflow you've been considering. Run it through the five criteria. Where does it pass, where does it fail? What's the smallest, most learnable version of the same idea that clears all five?"} />
        <QuizEngine conceptId="genai-m1-use-case-readiness" conceptName="Use-Case Readiness" moduleContext={moduleContext} staticQuiz={QUIZZES[4]} />
        <NextChapterTeaser text={track === 'engineer' ? "Aarav has the mental model, the capability map, the specification habit, the context discipline, and a first use case worth building. Pre-Read 02 goes inside the model: how to write prompts that stay reliable when real, messy data is flowing through them." : "Rhea now has everything she needs to think clearly about GenAI. Pre-Read 02 goes deeper: how to write prompts that produce consistent, reliable outputs when the data is real and the stakes are higher."} />
      </ChapterSection>
    </>
  );
}

type Props = { track: GenAITrack; onBack: () => void; onNext?: () => void; nextLabel?: string };

export default function GenAIPreRead1({ track, onBack, onNext, nextLabel }: Props) {
  const completionMessage = track === 'engineer'
    ? 'You now have the right Week 0 builder mental model: AI workflows are not just model calls. They are systems with triggers, payloads, orchestration, validation, review loops, and recovery paths.'
    : 'You now have the right Week 0 workflow mental model: AI workflows are not just prompts. They are systems with triggers, context, orchestration, review loops, and recovery paths.';
  return (
    <GenAIPreReadLayout
      moduleNum="01" moduleLabel={TRACK_META[track].introTitle}
      accent={ACCENT} accentRgb={ACCENT_RGB}
      sections={SECTIONS} badges={BADGES} concepts={CONCEPTS}
      completionEmoji="◎" completionMessage={completionMessage} onBack={onBack} onNext={onNext} nextLabel={nextLabel}
    >
      <CoreContent track={track} />
    </GenAIPreReadLayout>
  );
}

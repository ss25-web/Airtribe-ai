'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import GenAIPreReadLayout from './GenAIPreReadLayout';
import GenAIStreakCard, { GenAILatestBadgePanel } from './GenAISidebarExtras';
import QuizEngine from './QuizEngine';
import GenAIAvatar, { GenAIConversationScene, GenAIHeroCharacterStrip } from './GenAIAvatar';
import type { GenAITrack } from './genaiTypes';
import {
  ApplyItBox, ChapterSection, NextChapterTeaser, PMPrincipleBox, SituationCard,
  TiltCard, chLabel, h2, keyBox, para, pullQuote,
} from './pm-fundamentals/designSystem';
import { filterWorkflows, type WorkflowScenario } from '@/data/genai/pr4-workflow-anatomy';
import { filterNodeSets, type NodeSetScenario } from '@/data/genai/pr4-node-type-map';
import { filterCredScenarios, type CredScenario } from '@/data/genai/pr4-credentials';
import { filterErrorPathScenarios, type ErrorPathScenario } from '@/data/genai/pr4-error-path';
import { filterCanvasScenarios, type CanvasScenario, type M4Node, type M4Conn } from '@/data/genai/pr4-canvas-explorer';

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
  { id: 'genai-m4-e2e',     icon: '🎯', label: 'End-to-End',      color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC' },
];

const QUIZZES = [
  {
    conceptId: 'genai-m4-mindset',
    question: {
      engineer: "Aarav wants to start building the AI classification node. Rohan asks him to do something first. What?",
      'builder': "Rhea asks where the AI goes in her automation workflow. Kabir doesn't answer. What does he ask instead?",
    },
    options: {
      engineer: [
        'A. Pick the AI provider — OpenAI vs Anthropic vs Bedrock — and stub the node',
        'B. Document the current manual process node-by-node with input and output contracts',
        'C. Get compliance sign-off on automating the exception-handling decision path',
        'D. Provision n8n credentials and a shared service account before building anything',
      ],
      'builder': [
        'A. Which AI model Rhea wants to use as the classifier node in the workflow',
        'B. How many exceptions the team currently processes through the manual path each week',
        'C. What Rhea actually does between 7am Monday and the moment she hits send',
        'D. Whether Rhea already has n8n access set up and the credentials configured',
      ],
    },
    correctIndex: { engineer: 1, 'builder': 2 },
    explanation: {
      engineer: "The workflow spec — current process, input schema, output contract, edge cases — is the prerequisite. Building the AI node first produces a fast solution to an undefined problem.",
      'builder': "Kabir maps the manual process before touching n8n — automating a fuzzy process produces a fast, fuzzy automated process. The manual steps are the spec.",
    },
    keyInsight: "Automation is about reliable data plumbing first. The AI node is one step in a pipeline, not the pipeline itself.",
  },
  {
    conceptId: 'genai-m4-nodes',
    question: {
      engineer: "Aarav builds: Email Trigger → AI Classify → Slack Notify. The Slack node fails with 'invalid data.' The AI node returns a JSON string, not an object. What is the root cause?",
      'builder': "Rhea's workflow runs but the Google Sheet never updates. The Write node shows green (success) but the sheet is blank. What should she check first?",
    },
    options: {
      engineer: [
        'A. The Slack API version has changed and the node connector needs a version bump',
        'B. A JSON Parse node is missing between AI Classify and Slack — data shape mismatch',
        'C. The AI node temperature is too high, so it produces malformed JSON some of the time',
        'D. The Email Trigger is passing the wrong fields to the AI node in the body payload',
      ],
      'builder': [
        'A. Google Sheets permissions have expired and need to be re-granted to the workflow',
        'B. The Write node is mapped to a column that does not exist on the destination sheet',
        'C. The node before Write is passing empty fields — Write succeeded in writing nothing',
        'D. The workflow needs to be re-activated after adding the Write node to the canvas',
      ],
    },
    correctIndex: { engineer: 1, 'builder': 2 },
    explanation: {
      engineer: "n8n boundary failures between an AI node and a downstream node are almost always shape mismatches — string vs object. A Parse or Set node transforms the shape.",
      'builder': "Green nodes confirm execution, not correct output. A Write node that receives empty fields writes empty fields successfully. The bug is upstream.",
    },
    keyInsight: "Green nodes confirm execution, not correct output. Shape errors between nodes are the most common silent-failure mode.",
  },
  {
    conceptId: 'genai-m4-connect',
    question: {
      engineer: "Aarav creates an n8n credential for OpenAI using the team's shared API key. Rohan asks him to change it. Why?",
      'builder': "Rhea's assistant sets up the Google Sheets credential using Rhea's personal Google account. Kabir says this is a problem. What is the risk?",
    },
    options: {
      engineer: [
        "A. Shared API keys are not technically supported by n8n's credential store",
        'B. Shared key means no per-workflow cost tracking, no audit, no safe rotation',
        'C. OpenAI rate limits apply per key, so the shared key throttles every workflow',
        'D. Rohan prefers per-service accounts as a default standard for API connections',
      ],
      'builder': [
        "A. Personal Google accounts technically can't be wired into n8n's Sheets credential",
        "B. If Rhea leaves or rotates her password, the workflow breaks and no one can fix it",
        'C. Personal accounts hit Google Sheets API rate limits faster than service accounts',
        "D. The workflow will only run when Rhea is actively logged into her Google account",
      ],
    },
    correctIndex: { engineer: 1, 'builder': 1 },
    explanation: {
      engineer: "Shared keys are a cost, security, and rotation problem at once — same budget pool, no per-workflow attribution, rotating the key breaks every workflow simultaneously. Per-workflow service accounts solve all three.",
      'builder': "Personal credentials are a single point of failure. Password rotation, 2FA changes, or the person leaving — and the workflow breaks. Team-owned service credentials are the correct design.",
    },
    keyInsight: "Credentials are infrastructure. Personal credentials in production workflows are a single point of failure waiting to happen.",
  },
  {
    conceptId: 'genai-m4-errors',
    question: {
      engineer: "Aarav's workflow runs overnight. In the morning, 14 of 22 exceptions were classified and routed. 8 are missing. The workflow shows no errors. What is the most likely design gap?",
      'builder': "Rhea's Monday report workflow ran, sent the email, but the body was empty. Nobody noticed until her director asked at 10am. What is the process gap?",
    },
    options: {
      engineer: [
        "A. The AI node timed out on 8 items and the workflow continued past them silently",
        'B. The email trigger only captured 14 of 22 exception emails from the source inbox',
        'C. The Slack notify node failed and the 8 items routed to an unread dead-letter queue',
        'D. The n8n instance has an execution-volume cap that throttled the run at 14 items',
      ],
      'builder': [
        'A. The Google Sheets connection failed mid-run and the report had no data to summarise',
        'B. The workflow has no output validation — it shipped whatever the AI returned, blank included',
        'C. Claude produced an empty output because the input data this week was malformed somehow',
        "D. The email node sent successfully but the recipient's mail client stripped the body content",
      ],
    },
    correctIndex: { engineer: 0, 'builder': 1 },
    explanation: {
      engineer: "Silent skips are an error-handling design gap: the node failed, error mode was set to 'continue,' and 8 items dropped with no alert or dead-letter handling. Failure paths must be explicit.",
      'builder': "The workflow sent successfully — an empty output is a correct execution of the wrong design. Output validation before send catches empty/malformed output and either retries or alerts.",
    },
    keyInsight: "Success means the workflow executed. It does not mean the output was correct. Output validation before handoff is required, not optional.",
  },
  {
    conceptId: 'genai-m4-e2e',
    question: {
      engineer: "Aarav's first end-to-end workflow succeeds on a real exception. He marks it production-ready. Rohan asks one question before signing off. What is it?",
      'builder': "Rhea's Monday report workflow works on test data. She is ready to run it live. Kabir asks her to run one more test. What kind?",
    },
    options: {
      engineer: [
        'A. What happens when the AI classification returns a low-confidence result?',
        'B. How long does the workflow take to run on a single exception?',
        'C. Does the Slack notification render correctly on mobile?',
        'D. Is the workflow connected to the right n8n environment?',
      ],
      'builder': [
        "A. Run it on last week's real data and compare the output to the manual report she wrote",
        'B. Test it with an empty dataset to confirm it handles the edge case',
        'C. Run it twice to confirm it is idempotent',
        'D. Check that the email address is correct before going live',
      ],
    },
    correctIndex: { engineer: 0, 'builder': 0 },
    explanation: {
      engineer: "Happy path success is not production readiness. The failure case — low-confidence classification — is the most important path to design. What does the workflow do when the AI isn't sure? That decision must exist before go-live.",
      'builder': "Comparing AI output to a manually produced baseline is the most direct quality check. If the AI-generated Monday report wouldn't have told Rhea what she needed to know last week, it's not production-ready.",
    },
    keyInsight: "Test the failure path as rigorously as the success path. Production readiness means you know what the workflow does when it goes wrong.",
  },
];

const SECTION_XP = 50;
const QUIZ_XP = 100;

const TRACK_META: Record<GenAITrack, { label: string; introTitle: string; moduleContext: string }> = {
  'builder': {
    label: 'Builder Track',
    introTitle: 'Workflow Automation with n8n · Operator Lens',
    moduleContext: `GenAI Launchpad · Non-Tech Track · Pre-Read 04 · Workflow Automation with n8n. Follows Rhea, an operations lead at Northstar Health, as she automates her Monday exception summary — and discovers that the AI call is one node in a pipeline, and the rest of the pipeline is what determines whether the output is ever used.`,
  },
  engineer: {
    label: 'Engineer Track',
    introTitle: 'Workflow Automation with n8n · Builder Lens',
    moduleContext: `GenAI Launchpad · Tech Track · Pre-Read 04 · Workflow Automation with n8n. Follows Aarav, a platform engineer at Northstar Health, as he builds the first automated exception classification workflow — and learns that the AI node is three lines of a thirty-line workflow spec, and the other twenty-seven lines determine everything.`,
  },
};

type Props = { track: GenAITrack; onBack: () => void; onNext?: () => void; nextLabel?: string };

function computeXP(completedSections: Set<string>, conceptStates: Record<string, { pKnow: number }>) {
  const readingXP = completedSections.size * SECTION_XP;
  const quizXP = Object.values(conceptStates).reduce((sum, s) => sum + Math.round(s.pKnow * QUIZ_XP), 0);
  return { readingXP, quizXP, total: readingXP + quizXP };
}


// ── M4 Interactive Tools ─────────────────────────────────────────────────────
// All five tools render as authentic n8n editor mockups. Shared canvas
// primitives live in ./n8nCanvas so PR5's tools use the same look-and-feel.

import { NODE_TYPES, type NodeTypeKey, N8N_NW, N8N_NH, N8nFrame, N8nNodeCard, n8nBezier, N8nCanvas } from './n8nCanvas';

// Section 01: Workflow step labeler — rendered as a real n8n canvas where the
// learner clicks each ghost-node, picks its TYPE from the palette, and the
// node materialises with its type bar + icon. Mis-tags flash red.
const WorkflowAnatomy = ({ track }: { track: GenAITrack }) => {
  const scenarios = filterWorkflows(track);
  const [scenarioId, setScenarioId] = useState<string>(scenarios[0].id);
  const scenario: WorkflowScenario = scenarios.find(s => s.id === scenarioId) ?? scenarios[0];
  const steps = scenario.steps;

  const [tags, setTags] = useState<Record<string, NodeTypeKey>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  useEffect(() => { setTags({}); setSelectedId(null); setWrongFlash(null); }, [scenario.id]);

  const allTagged = steps.every(s => tags[s.id]);
  const score = steps.filter(s => tags[s.id] === s.correctType).length;
  const aiCount = steps.filter(s => s.correctType === 'ai').length;

  const tryTag = (id: string, type: NodeTypeKey) => {
    const step = steps.find(s => s.id === id);
    if (!step) return;
    if (step.correctType !== type) {
      setWrongFlash(id);
      setTimeout(() => setWrongFlash(null), 600);
      return;
    }
    setTags(prev => ({ ...prev, [id]: type }));
    setSelectedId(null);
  };

  const reset = () => { setTags({}); setSelectedId(null); };

  return (
    <N8nFrame filename={scenario.filename} status={allTagged ? 'ACTIVE' : 'EDITING'}>
      {/* Scenario picker */}
      <div style={{ padding: '8px 16px', background: '#141B27', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em' }}>WORKFLOW</span>
        <select
          value={scenarioId}
          onChange={(e) => setScenarioId(e.target.value)}
          style={{ flex: 1, appearance: 'none' as const, cursor: 'pointer', background: '#0A0D14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 5, padding: '5px 10px', fontSize: 11, fontWeight: 600, color: '#E2E8F0', fontFamily: 'inherit' }}
        >
          {scenarios.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{scenarios.length} presets</span>
      </div>

      <N8nCanvas width={920} height={110}>
        <svg style={{ position: 'absolute' as const, top: 0, left: 0, width: 920, height: 110, pointerEvents: 'none' as const, overflow: 'visible' as const }}>
          <defs>
            <marker id="wa-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.25)" />
            </marker>
          </defs>
          {steps.slice(0, -1).map((s, i) => {
            const next = steps[i + 1];
            return (
              <path key={s.id}
                d={n8nBezier(s.x + N8N_NW, 30 + N8N_NH / 2, next.x, 30 + N8N_NH / 2)}
                stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} fill="none" markerEnd="url(#wa-arrow)"
              />
            );
          })}
        </svg>
        {steps.map(s => {
          const taggedType = tags[s.id] ?? null;
          const isWrong = wrongFlash === s.id;
          const isSelected = selectedId === s.id;
          return (
            <div key={s.id} style={{ animation: isWrong ? 'wa-shake 0.4s' : undefined }}>
              <N8nNodeCard
                x={s.x} y={30}
                label={s.label}
                typeKey={isWrong ? 'error' : taggedType}
                icon={s.icon}
                selected={isSelected}
                ghost={!taggedType}
                onClick={() => !taggedType && setSelectedId(prev => prev === s.id ? null : s.id)}
                status={taggedType ? 'ok' : undefined}
              />
            </div>
          );
        })}
      </N8nCanvas>

      {/* Type palette (active when a node is selected) */}
      <div style={{ padding: '10px 16px', background: '#141920', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em' }}>
            NODE PALETTE {selectedId ? `· tagging ${steps.find(s => s.id === selectedId)?.label}` : '· click an empty node above'}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>
            {Object.keys(tags).length}/{steps.length} tagged · only {aiCount} of {steps.length} is AI
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
          {(Object.entries(NODE_TYPES) as [NodeTypeKey, typeof NODE_TYPES[NodeTypeKey]][]).filter(([k]) => k !== 'error').map(([key, info]) => (
            <button
              key={key}
              type="button"
              onClick={() => selectedId && tryTag(selectedId, key)}
              disabled={!selectedId}
              style={{
                appearance: 'none',
                cursor: selectedId ? 'pointer' : 'not-allowed',
                padding: '6px 12px',
                background: selectedId ? `${info.color}1A` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${selectedId ? `${info.color}66` : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 5,
                fontSize: 10.5,
                fontWeight: 700,
                color: selectedId ? info.color : 'rgba(255,255,255,0.3)',
                fontFamily: 'inherit',
                letterSpacing: '0.04em',
              }}
            >{info.label}</button>
          ))}
        </div>
      </div>

      {/* Status / verdict */}
      {(selectedId && tags[selectedId]) || allTagged ? null : null}
      {allTagged ? (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '10px 16px', background: score === steps.length ? 'rgba(22,163,74,0.08)' : 'rgba(245,158,11,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 11.5, color: score === steps.length ? '#86EFAC' : '#FBBF24', lineHeight: 1.55 }}>
            <span style={{ fontWeight: 700 }}>{score}/{steps.length} tagged correctly.</span> {score === steps.length ? `${steps.length - aiCount} of these ${steps.length} steps are engineering. Only the AI node is AI.` : 'A wrong type flashed red and was reverted.'}
          </div>
          <button type="button" onClick={reset} style={{ appearance: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 5, padding: '5px 12px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', monospace" }}>RESET</button>
        </div>
      ) : (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px 16px', background: '#0A0D14', fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>
          Hint: {selectedId ? steps.find(s => s.id === selectedId)?.hint : 'Click any empty node in the canvas to tag its type.'}
        </div>
      )}

      <style>{`@keyframes wa-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }`}</style>
    </N8nFrame>
  );
};

// Section 02: Node categoriser — rendered as the real n8n node palette
// (left rail of integrations) plus four bucket lanes on the canvas. The
// learner clicks a palette node then clicks a lane; correct matches dock
// the node into the lane in n8n-card style, wrong attempts flash and stay
// in the palette.
const NodeTypeMapCard = ({ track }: { track: GenAITrack }) => {
  const scenarios = filterNodeSets(track);
  const [scenarioId, setScenarioId] = useState<string>(scenarios[0].id);
  const scenario: NodeSetScenario = scenarios.find(s => s.id === scenarioId) ?? scenarios[0];
  const nodeItems = scenario.items;
  const CATS: NodeTypeKey[] = ['trigger', 'data', 'transform', 'ai'];

  const [selected, setSelected] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, NodeTypeKey>>({});
  const [wrong, setWrong] = useState<string | null>(null);

  useEffect(() => { setSelected(null); setPlacements({}); setWrong(null); }, [scenario.id]);

  const place = (id: string, cat: NodeTypeKey) => {
    const item = nodeItems.find(n => n.id === id);
    if (!item) return;
    if (item.correctCat !== cat) {
      setWrong(id);
      setTimeout(() => setWrong(null), 600);
      return;
    }
    setPlacements(prev => ({ ...prev, [id]: cat }));
    setSelected(null);
  };

  const reset = () => { setSelected(null); setPlacements({}); };
  const unplaced = nodeItems.filter(n => !placements[n.id]);
  const allPlaced = unplaced.length === 0;

  return (
    <N8nFrame filename="node-categories.json" status={allPlaced ? 'ACTIVE' : 'EDITING'}>
      {/* Scenario picker */}
      <div style={{ padding: '8px 16px', background: '#141B27', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em' }}>NODE SET</span>
        <select
          value={scenarioId}
          onChange={(e) => setScenarioId(e.target.value)}
          style={{ flex: 1, appearance: 'none' as const, cursor: 'pointer', background: '#0A0D14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 5, padding: '5px 10px', fontSize: 11, fontWeight: 600, color: '#E2E8F0', fontFamily: 'inherit' }}
        >
          {scenarios.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{scenarios.length} presets</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', gap: 0 }}>
        {/* Left palette */}
        <div style={{ background: '#0A0D14', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '12px 12px', maxHeight: 360, overflow: 'auto' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', marginBottom: 10 }}>NODE PALETTE</div>
          {unplaced.length === 0 ? (
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' as const, padding: 8 }}>All nodes placed.</div>
          ) : unplaced.map(n => {
            const isSel = selected === n.id;
            const isWrong = wrong === n.id;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setSelected(prev => prev === n.id ? null : n.id)}
                style={{
                  appearance: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  marginBottom: 6,
                  padding: '7px 9px',
                  background: isSel ? 'rgba(124,58,237,0.15)' : '#141B27',
                  border: `1.5px solid ${isWrong ? '#DC2626' : isSel ? '#A78BFA' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 7,
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontFamily: 'inherit',
                  textAlign: 'left' as const,
                  animation: isWrong ? 'nt-shake 0.4s' : undefined,
                }}
              >
                <div style={{ width: 24, height: 24, borderRadius: 5, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'rgba(255,255,255,0.75)', flexShrink: 0 }}>{n.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#E2E8F0', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.label}</div>
              </button>
            );
          })}
        </div>

        {/* Canvas with 4 lanes */}
        <div style={{
          padding: '16px 18px',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '22px 22px', backgroundColor: '#0F1117',
          minHeight: 360,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {CATS.map(cat => {
              const info = NODE_TYPES[cat];
              const items = nodeItems.filter(n => placements[n.id] === cat);
              const isActive = selected !== null;
              return (
                <div
                  key={cat}
                  onClick={() => selected && place(selected, cat)}
                  style={{
                    background: isActive ? `${info.color}10` : 'rgba(255,255,255,0.02)',
                    border: `1.5px dashed ${isActive ? info.color : `${info.color}55`}`,
                    borderRadius: 9,
                    padding: 10,
                    minHeight: 152,
                    cursor: isActive ? 'pointer' : 'default',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: info.color }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: info.color, letterSpacing: '0.12em' }}>{info.label.toUpperCase()}</span>
                  </div>
                  <div style={{ display: 'grid', gap: 5 }}>
                    {items.length === 0 && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' as const, padding: '4px 2px' }}>(drop nodes here)</div>}
                    {items.map(n => (
                      <div key={n.id} style={{ background: '#181F2E', border: `1px solid ${info.color}55`, borderRadius: 6, padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 5, background: `${info.color}1F`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: info.color, flexShrink: 0 }}>{n.icon}</div>
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: '#E2E8F0' }}>{n.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status bar */}
      {allPlaced ? (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '10px 16px', background: 'rgba(22,163,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11.5, color: '#86EFAC' }}><span style={{ fontWeight: 700 }}>All 8 nodes placed.</span> Every n8n node belongs in exactly one of these four lanes.</span>
          <button type="button" onClick={reset} style={{ appearance: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 5, padding: '5px 12px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', monospace" }}>RESET</button>
        </div>
      ) : (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px 16px', background: '#0A0D14', fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>
          {selected ? `Picked ${nodeItems.find(n => n.id === selected)?.label} — click a lane to drop it.` : 'Click a node in the palette, then click the lane it belongs in.'}
        </div>
      )}

      <style>{`@keyframes nt-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }`}</style>
    </N8nFrame>
  );
};

// Section 03: Credential vault — rendered as n8n's actual Credentials page
// (Settings → Credentials). Each row shows provider logo, credential name,
// scope, who owns it, last rotated. The learner picks risk per row.
const CredentialCard = ({ track }: { track: GenAITrack }) => {
  const scenarios = filterCredScenarios(track);
  const [scenarioId, setScenarioId] = useState<string>(scenarios[0].id);
  const scenario: CredScenario = scenarios.find(s => s.id === scenarioId) ?? scenarios[0];
  const creds = scenario.creds;

  const RISKS = [
    { key: 'low' as const,    label: 'LOW',    color: '#16A34A' },
    { key: 'medium' as const, label: 'MEDIUM', color: '#F59E0B' },
    { key: 'high' as const,   label: 'HIGH',   color: '#DC2626' },
  ];
  const [picks, setPicks] = useState<Record<string, 'low' | 'medium' | 'high'>>({});

  useEffect(() => { setPicks({}); }, [scenario.id]);

  const allPicked = creds.every(c => picks[c.id]);
  const score = creds.filter(c => picks[c.id] === c.correctRisk).length;

  return (
    <N8nFrame filename="credentials" status={allPicked ? 'ACTIVE' : 'AUDITING'}>
      {/* Scenario picker */}
      <div style={{ padding: '8px 16px', background: '#141B27', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em' }}>VAULT</span>
        <select
          value={scenarioId}
          onChange={(e) => setScenarioId(e.target.value)}
          style={{ flex: 1, appearance: 'none' as const, cursor: 'pointer', background: '#0A0D14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 5, padding: '5px 10px', fontSize: 11, fontWeight: 600, color: '#E2E8F0', fontFamily: 'inherit' }}
        >
          {scenarios.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{scenarios.length} presets</span>
      </div>

      <div style={{ padding: '12px 16px', background: '#0F1117', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.16em' }}>SETTINGS · CREDENTIALS</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', marginTop: 4 }}>{creds.length} credentials configured</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ padding: '5px 10px', borderRadius: 5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 10, color: 'rgba(255,255,255,0.6)', fontFamily: "'JetBrains Mono', monospace" }}>Filter: all</div>
            <div style={{ padding: '5px 10px', borderRadius: 5, background: '#FF6D5A', fontSize: 10, color: '#fff', fontWeight: 700 }}>+ New credential</div>
          </div>
        </div>
      </div>

      {/* Header row */}
      <div style={{ padding: '8px 16px', background: '#0A0D14', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: '2.4fr 1.6fr 2fr 1fr 1.4fr', gap: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em' }}>
        <span>NAME</span><span>OWNER</span><span>SCOPE</span><span>ROTATED</span><span style={{ textAlign: 'right' }}>RISK</span>
      </div>

      {/* Rows */}
      {creds.map(c => {
        const picked = picks[c.id];
        const correct = picked === c.correctRisk;
        const rowBg = picked ? (correct ? 'rgba(22,163,74,0.05)' : 'rgba(220,38,38,0.05)') : '#0F1117';
        return (
          <div key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: rowBg }}>
            <div style={{ padding: '10px 16px', display: 'grid', gridTemplateColumns: '2.4fr 1.6fr 2fr 1fr 1.4fr', gap: 10, alignItems: 'center' }}>
              {/* name + logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: 5, background: c.logoBg, color: '#fff', fontWeight: 900, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.logo}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#E2E8F0', fontFamily: "'JetBrains Mono', monospace" }}>{c.name}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{c.provider} · {c.type === 'api' ? 'API Key' : c.type === 'oauth' ? 'OAuth 2.0' : 'Service Account'}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', monospace" }}>{c.owner}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: "'JetBrains Mono', monospace" }}>{c.scope}</div>
              <div style={{ fontSize: 11, color: c.rotated.startsWith('Never') ? '#FCA5A5' : 'rgba(255,255,255,0.6)', fontFamily: "'JetBrains Mono', monospace" }}>{c.rotated}</div>
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                {RISKS.map(r => {
                  const isOn = picked === r.key;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setPicks(prev => ({ ...prev, [c.id]: r.key }))}
                      disabled={!!picked}
                      style={{
                        appearance: 'none',
                        cursor: picked ? 'default' : 'pointer',
                        padding: '4px 9px',
                        borderRadius: 4,
                        background: isOn ? `${r.color}24` : 'transparent',
                        border: `1px solid ${isOn ? r.color : `${r.color}40`}`,
                        fontSize: 9, fontWeight: 800,
                        color: isOn ? r.color : `${r.color}AA`,
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: '0.06em',
                      }}
                    >{r.label}</button>
                  );
                })}
              </div>
            </div>
            {picked && (
              <div style={{ padding: '0 16px 10px', display: 'grid', gridTemplateColumns: '1fr', gap: 6 }}>
                <div style={{ background: correct ? 'rgba(22,163,74,0.10)' : 'rgba(220,38,38,0.10)', border: `1px solid ${correct ? '#16A34A55' : '#DC262655'}`, borderRadius: 6, padding: '7px 10px', fontSize: 11, color: correct ? '#86EFAC' : '#FCA5A5', lineHeight: 1.55 }}>
                  <span style={{ fontWeight: 700 }}>{correct ? '✓ Correct' : `✗ Actually ${c.correctRisk.toUpperCase()} risk`}</span> · {c.explain}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {allPicked && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '10px 16px', background: score === creds.length ? 'rgba(22,163,74,0.08)' : 'rgba(245,158,11,0.08)' }}>
          <span style={{ fontSize: 11.5, color: score === creds.length ? '#86EFAC' : '#FBBF24' }}>
            <span style={{ fontWeight: 700 }}>{score}/{creds.length} correct.</span> {score < creds.length ? 'Personal OAuth is the most commonly underrated risk in production workflows.' : 'You can spot credential risk before it breaks production at 2am.'}
          </span>
        </div>
      )}
    </N8nFrame>
  );
};

// Section 04: Failure Router — rendered as the actual n8n canvas where one
// node has gone red, and the learner picks the error route by clicking one
// of four candidate downstream nodes. The chosen branch animates into
// existence with a red bezier; wrong choices fade in muted.
const ErrorPathCard = ({ track }: { track: GenAITrack }) => {
  const scenarios = filterErrorPathScenarios(track);
  const [scenarioId, setScenarioId] = useState<string>(scenarios[0].id);
  const scenario: ErrorPathScenario = scenarios.find(s => s.id === scenarioId) ?? scenarios[0];
  const failures = scenario.failures;
  // Keep the legacy literal block alive but unused — we read from `failures` above.
  const _LEGACY_FAILURES = track === 'engineer' ? [
    {
      id: 'ai',
      nodeLabel: 'OpenAI Classify', nodeIcon: '◈',
      failTitle: '429 Too Many Requests',
      failDetail: 'Rate limit on the classifier API. The item that triggered the workflow is now in limbo.',
      choices: [
        { id: 'retry-silent', label: 'Retry → continue silently',     icon: '↻',  verdict: 'silent-fail', result: 'Second call also rate-limited. Item written with classification = null. Silent data corruption in the tracker.' },
        { id: 'skip',         label: 'Skip item, next iteration',      icon: '↷',  verdict: 'silent-fail', result: 'Item silently dropped. Tracker has no record of it. Analyst never learns the exception was not classified.' },
        { id: 'dead-letter',  label: 'Alert Slack + dead-letter queue', icon: '⚠', verdict: 'correct-route', result: 'Workflow halts on this item. Slack pings. Dead-letter row captures input + error. Nothing lost, nothing silent.' },
        { id: 'log-only',     label: 'Log warning, keep going',         icon: '☰', verdict: 'silent-fail', result: 'Log entry created but workflow proceeds with empty classification. Dashboard shows 0 errors. Tracker shows garbage.' },
      ],
    },
    {
      id: 'validate',
      nodeLabel: 'Validate Output', nodeIcon: '✓',
      failTitle: 'Output too short (8 chars)',
      failDetail: 'AI returned a category 8 characters long. Schema check failed.',
      choices: [
        { id: 'forward',      label: 'Forward anyway — node returned',  icon: '→',  verdict: 'silent-fail', result: 'An 8-character classification reaches the tracker. Analyst opens the record and sees garbage. Pipeline appeared to succeed.' },
        { id: 'retry-same',   label: 'Retry AI with same input',         icon: '↻', verdict: 'silent-fail', result: 'Same malformed prompt produces the same truncated output. Root cause unchanged; you just doubled the cost.' },
        { id: 'route',        label: 'Route → Slack + dead-letter',      icon: '⚠', verdict: 'correct-route', result: 'Slack: "Validate Output failed — output too short." Item queued for human triage. Nothing forwarded.' },
        { id: 'skip-next',    label: 'Skip item, process next',          icon: '↷', verdict: 'silent-fail', result: 'Item silently disappears. No alert, no record, no way to know it was dropped.' },
      ],
    },
  ] : [
    {
      id: 'sheets',
      nodeLabel: 'Google Sheets Read', nodeIcon: '⊞',
      failTitle: 'OAuth token expired',
      failDetail: 'Rhea reset her password yesterday. The token tied to her personal account is invalid.',
      choices: [
        { id: 'retry',        label: 'Retry once automatically',          icon: '↻', verdict: 'silent-fail', result: 'Token is still invalid. Second attempt fails. Workflow halts with no alert. Director receives nothing at 7am.' },
        { id: 'skip-empty',   label: 'Skip data step, run AI on empty',   icon: '↷', verdict: 'silent-fail', result: 'Claude receives empty input, produces a confused summary. The director acts on a brief that has no basis in data.' },
        { id: 'alert-rhea',   label: 'Halt + Slack Rhea: "auth failed"',  icon: '⚠', verdict: 'correct-route', result: 'Workflow stops. Rhea gets Slack at 7:05am, re-authenticates. Director receives the correct brief 20 minutes late.' },
        { id: 'stale',        label: 'Use cached data from last week',    icon: '☰', verdict: 'silent-fail', result: 'Director receives last week\'s brief dated today. She makes decisions on stale data. No one knows.' },
      ],
    },
    {
      id: 'validate',
      nodeLabel: 'Validate Output', nodeIcon: '✓',
      failTitle: 'Brief too short (40 chars)',
      failDetail: 'Brief from Claude was 40 chars — far below the 100-char minimum and missing the keyword "exception".',
      choices: [
        { id: 'send',         label: 'Send it — AI node returned ok',     icon: '→', verdict: 'silent-fail', result: 'Director receives a 40-character email: "No exceptions this week." In a week with 3 SLA breaches. She takes no action.' },
        { id: 'retry-ai',     label: 'Retry the AI node',                  icon: '↻', verdict: 'silent-fail', result: 'Same sparse input produces the same thin output. Root cause (the input data) is not addressed.' },
        { id: 'alert-rhea',   label: 'Halt + alert Rhea first',           icon: '⚠', verdict: 'correct-route', result: 'Rhea gets: "Summary validation failed — 40 chars, missing \'exceptions\'." She finds the sheet was blank (holiday week) and sends a manual note.' },
        { id: 'silent-skip',  label: 'Skip sending — no brief at all',    icon: '↷', verdict: 'silent-fail', result: 'No brief, no explanation. Director assumes Rhea forgot. A "failed" notification beats silence.' },
      ],
    },
  ];

  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [allDone, setAllDone] = useState(false);

  useEffect(() => { setStep(0); setPicks({}); setAllDone(false); }, [scenario.id]);

  const current = failures[step];
  const picked = picks[current?.id];
  const pickedChoice = current?.choices.find(c => c.id === picked);

  const advance = () => {
    if (step < failures.length - 1) setStep(s => s + 1);
    else setAllDone(true);
  };
  const reset = () => { setStep(0); setPicks({}); setAllDone(false); };

  // Node geometry for the canvas
  const failX = 200, failY = 22;
  const okPathX = 460, okPathY = 22;
  const upstreamX = 30;

  // Choice nodes laid out under the failing node
  const choiceLayout = [
    { dx: -40,  dy: 130 },
    { dx: 145,  dy: 130 },
    { dx: 330,  dy: 130 },
    { dx: 515,  dy: 130 },
  ];

  return (
    <N8nFrame filename={scenario.filename} status={picked ? (pickedChoice?.verdict === 'correct-route' ? 'ACTIVE' : 'FAILING') : 'ERROR'}>
      {/* Scenario picker */}
      <div style={{ padding: '8px 16px', background: '#141B27', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em' }}>FAILURE SCENARIO</span>
        <select
          value={scenarioId}
          onChange={(e) => setScenarioId(e.target.value)}
          style={{ flex: 1, appearance: 'none' as const, cursor: 'pointer', background: '#0A0D14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 5, padding: '5px 10px', fontSize: 11, fontWeight: 600, color: '#E2E8F0', fontFamily: 'inherit' }}
        >
          {scenarios.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{scenarios.length} presets</span>
      </div>

      {/* Scenario header */}
      <div style={{ padding: '10px 16px', background: 'rgba(220,38,38,0.10)', borderBottom: '1px solid rgba(220,38,38,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#DC2626', color: '#fff', fontSize: 12, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>!</div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#FCA5A5', letterSpacing: '0.14em' }}>EXECUTION {step + 1} OF {failures.length} · {current.failTitle.toUpperCase()}</div>
            <div style={{ fontSize: 11.5, color: '#FECACA', marginTop: 2 }}>{current.failDetail}</div>
          </div>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#FCA5A5' }}>step {step + 1}/{failures.length}</div>
      </div>

      <N8nCanvas width={760} height={250}>
        <svg style={{ position: 'absolute' as const, top: 0, left: 0, width: 760, height: 250, pointerEvents: 'none' as const, overflow: 'visible' as const }}>
          <defs>
            <marker id={`ep-arrow-${step}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.25)" />
            </marker>
            <marker id={`ep-arrow-err-${step}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#DC2626" />
            </marker>
          </defs>
          {/* upstream → failing node */}
          <path d={n8nBezier(upstreamX + N8N_NW, failY + N8N_NH / 2, failX, failY + N8N_NH / 2)} stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} fill="none" markerEnd={`url(#ep-arrow-${step})`} />
          {/* failing node → happy path next (greyed when failing) */}
          <path d={n8nBezier(failX + N8N_NW, failY + N8N_NH / 2, okPathX, okPathY + N8N_NH / 2)} stroke="rgba(255,255,255,0.10)" strokeWidth={1.5} fill="none" strokeDasharray="4 5" />
          {/* failing node → chosen error path */}
          {pickedChoice && (() => {
            const idx = current.choices.findIndex(c => c.id === picked);
            const layout = choiceLayout[idx];
            const cx = failX + N8N_NW / 2;
            const cy = failY + N8N_NH;
            const tx = failX + layout.dx + N8N_NW / 2;
            const ty = layout.dy;
            return <path d={n8nBezier(cx, cy, tx, ty, 'down')} stroke={pickedChoice.verdict === 'correct-route' ? '#16A34A' : '#DC2626'} strokeWidth={2} fill="none" markerEnd={pickedChoice.verdict === 'correct-route' ? undefined : `url(#ep-arrow-err-${step})`} />;
          })()}
        </svg>

        {/* Upstream node */}
        <N8nNodeCard x={upstreamX} y={failY} label={scenario.upstream.label} typeKey={scenario.upstream.type} icon={scenario.upstream.icon} />
        {/* Failing node */}
        <div style={{ animation: 'ep-pulse 1.4s ease-in-out infinite' }}>
          <N8nNodeCard x={failX} y={failY} label={current.nodeLabel} typeKey={'error'} icon={current.nodeIcon} status="fail" />
        </div>
        {/* Happy path */}
        <N8nNodeCard x={okPathX} y={okPathY} label={scenario.happyPath.label} typeKey={'output'} icon={scenario.happyPath.icon} ghost />

        {/* Choice nodes — render all four; chosen wrong fades muted, correct lights green */}
        {current.choices.map((c, i) => {
          const layout = choiceLayout[i];
          const isPicked = picked === c.id;
          const isAnswered = !!picked;
          const isCorrect = c.verdict === 'correct-route';
          const ghost = !isPicked && (!isAnswered || !isCorrect);
          return (
            <div key={c.id} style={{ opacity: isAnswered && !isPicked && !isCorrect ? 0.35 : 1, transition: 'opacity 0.3s' }}>
              <N8nNodeCard
                x={failX + layout.dx}
                y={layout.dy}
                label={c.label}
                typeKey={isPicked ? (isCorrect ? 'output' : 'error') : (isAnswered && isCorrect ? 'output' : null)}
                icon={c.icon}
                ghost={ghost}
                onClick={isAnswered ? undefined : () => setPicks(prev => ({ ...prev, [current.id]: c.id }))}
                status={isPicked ? (isCorrect ? 'ok' : 'fail') : (isAnswered && isCorrect ? 'ok' : undefined)}
              />
            </div>
          );
        })}
      </N8nCanvas>

      {/* Verdict panel */}
      {pickedChoice && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 16px', background: pickedChoice.verdict === 'correct-route' ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: pickedChoice.verdict === 'correct-route' ? '#86EFAC' : '#FCA5A5', fontWeight: 700, letterSpacing: '0.14em' }}>
              {pickedChoice.verdict === 'correct-route' ? '✓ FAILURE CAUGHT' : '✗ SILENT FAILURE'}
            </div>
            {!allDone && (
              <button type="button" onClick={advance} style={{ appearance: 'none', cursor: 'pointer', background: pickedChoice.verdict === 'correct-route' ? '#0F766E' : 'rgba(255,255,255,0.06)', border: `1px solid ${pickedChoice.verdict === 'correct-route' ? '#10B981' : 'rgba(255,255,255,0.12)'}`, borderRadius: 5, padding: '5px 12px', fontSize: 10, fontWeight: 700, color: '#fff', fontFamily: "'JetBrains Mono', monospace" }}>
                {step < failures.length - 1 ? 'NEXT SCENARIO →' : 'FINISH'}
              </button>
            )}
          </div>
          <div style={{ fontSize: 11.5, color: pickedChoice.verdict === 'correct-route' ? '#A7F3D0' : '#FECACA', lineHeight: 1.55 }}>{pickedChoice.result}</div>
        </div>
      )}

      {/* All-done summary */}
      {allDone && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 16px', background: 'rgba(15,118,110,0.10)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 11.5, color: '#A7F3D0', lineHeight: 1.55 }}><span style={{ fontWeight: 700 }}>Rule:</span> alert + dead-letter beats retry, skip, and silence for every failure mode. Nothing should disappear without a trace.</div>
          <button type="button" onClick={reset} style={{ appearance: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 5, padding: '5px 12px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', monospace" }}>RESET</button>
        </div>
      )}

      <style>{`@keyframes ep-pulse { 0%, 100% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.02); filter: brightness(1.2); } }`}</style>
    </N8nFrame>
  );
};

// Section 05: n8n canvas explorer — full workflow as interactive n8n-style canvas
// (Types M4Node + M4Conn now live in the dataset module.)

const N8nCanvasExplorer = ({ track }: { track: GenAITrack }) => {
  const canvasScenarios = filterCanvasScenarios(track);
  const [canvasId, setCanvasId] = useState<string>(canvasScenarios[0].id);
  const canvas: CanvasScenario = canvasScenarios.find(c => c.id === canvasId) ?? canvasScenarios[0];

  const [selected, setSelected] = useState<string | null>(null);
  const NW = 160, NH = 56;

  useEffect(() => { setSelected(null); }, [canvas.id]);

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

  const nodes = canvas.nodes;
  const conns = canvas.conns;
  // Suppress unused-warnings for the legacy literal blocks above; they’re
  // kept inline for diff minimality but read from `canvas` at render time.
  void techNodes; void techConns; void nonTechNodes; void nonTechConns;
  const sel = nodes.find(n => n.id === selected);
  const CW = canvas.width;

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
          n8n — {canvas.filename}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
          <span style={{ fontSize: '9px', color: '#22C55E', fontFamily: "'JetBrains Mono', monospace" }}>ACTIVE</span>
        </div>
      </div>
      {/* Canvas picker */}
      <div style={{ padding: '8px 16px', background: '#141B27', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em' }}>CANVAS</span>
        <select
          value={canvasId}
          onChange={(e) => setCanvasId(e.target.value)}
          style={{ flex: 1, appearance: 'none' as const, cursor: 'pointer', background: '#0A0D14', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 5, padding: '5px 10px', fontSize: 11, fontWeight: 600, color: '#E2E8F0', fontFamily: 'inherit' }}
        >
          {canvasScenarios.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{canvasScenarios.length} presets</span>
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

function CoreContent({ track, completedSections = new Set<string>(), activeSection = null }: { track: GenAITrack; completedSections?: Set<string>; activeSection?: string | null }) {
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
          <GenAIHeroCharacterStrip track={track} mentors={['anika', 'rohan', 'leela', 'kabir']} />
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
            <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>{track === 'engineer' ? "Your lens: how do you build a reliable automated pipeline where the AI node is one piece of a well-engineered system — with proper credentials, error handling, and failure paths that work at 2am without anyone watching?" : "Your lens: how do you turn a manual Monday morning workflow into a reliable automated system — standardising the prompt, the data pull, the output check, and the send, so your director gets the right brief whether or not you're at your desk?"}</div>
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
        {para(track === 'engineer'
          ? "In Pre-Read 03, Aarav built a research pipeline with proper source triangulation and COVE evaluation. The outputs are trustworthy. But every research run is still manual — an analyst opens ChatGPT, pastes the prompt, copies the output. No audit trail. No consistency. No record of what ran. This module is about wiring that pipeline into a system."
          : "In Pre-Read 03, Rhea rebuilt her research workflow with proper source selection and audience-parameterised drafting. The outputs are better. But each run is still manual — different prompts each Monday, results scattered in Slack threads, no way to compare last week's brief to this week's. This module is about standardising what she's built."
        )}
        {h2("The workflow mindset: AI is a node. Everything around it is still engineering.")}
        {para(track === 'engineer'
          ? "\u25b6 After this section, you can draw a node diagram for the current manual exception process — and identify exactly where the AI node belongs in it."
          : "\u25b6 After this section, you can write out your Monday morning process step by step and identify which steps are engineering problems before the AI call ever runs."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? <>Aarav has been handed a ticket: &ldquo;Build an automated exception classification system using AI.&rdquo; He opens n8n. His first instinct is to find an AI node and start there. He has no map of the current exception intake process, no schema for the input data, and no definition of what &ldquo;classified&rdquo; means as an output.</>
            : <>Rhea has decided to automate her Monday morning exception summary using n8n. Kabir sits down with her. Her first question is: &ldquo;Where do I put the AI?&rdquo; Kabir does not answer it. He asks her what happens between 7am Monday and the moment she sends the summary.</>}
        </SituationCard>
        {para(track === 'engineer'
          ? "The instinct to start with the AI node is almost universal — and almost always wrong. The AI node executes whatever you pass it. The input design determines everything. Before you know what the AI receives, how it's formatted, and what the output contract looks like, you don't have an AI problem. You have a process design problem."
          : "The question 'where does the AI go?' assumes you already know what the workflow does. Kabir's question — what happens step by step between trigger and send — is the actual prerequisite. You cannot automate something you haven't described. Automation of a fuzzy process produces a fast, fuzzy automated process."
        )}
        {pullQuote("Adding AI to a broken process doesn't fix the process. It automates the broken parts faster.")}
        {keyBox(track === 'engineer' ? "Building a workflow spec before touching n8n" : "The automation is in the plumbing, not the AI", [
          track === 'engineer'
            ? "Map the current process node by node before designing automation: trigger, data sources, transformation steps, decision points, outputs, destination systems. The AI node belongs to one step in that map."
            : "The Monday summary workflow has five steps: trigger, data pull, AI summarisation, output validation, email send. Three of those five steps have nothing to do with AI quality.",
          track === 'engineer'
            ? "Input schema first: what data does the AI node actually receive? Field names, data types, what's missing in edge cases. The 40% case where input is incomplete is not an edge case — it's a requirement."
            : "The hardest parts of workflow automation are the edge cases: empty data, API failures, unexpected input formats. These have nothing to do with how good your AI prompt is.",
          track === 'engineer'
            ? "Output contract second: what does a correctly classified exception look like? One of eight categories, confidence score, fallback for low-confidence? Define the contract before the prompt."
            : "Automating a manual process first requires documenting the manual process precisely: what triggers it, what data it uses, what the output looks like, where it goes. You cannot automate something you haven't described.",
          track === 'engineer'
            ? "The AI node is 3 lines in a 30-line workflow spec. The other 27 lines are authentication, data transformation, error routing, notification, and logging — all engineering problems with no AI involvement."
            : "AI tools feel like the point. They're not — they're one node. The workflow is the point. A broken workflow with great AI produces great outputs that nobody sees.",
          track === 'engineer'
            ? "Automation that 'adds AI' without mapping the surrounding process creates a faster version of the existing confusion, not a reliable system."
            : "The question 'where does the AI go?' is always secondary to 'what does the full workflow do from trigger to verified output?'",
        ], ACCENT)}
        <GenAIConversationScene
          mentor={track === 'builder' ? 'kabir' : 'rohan'}
          track={track}
          accent={track === 'builder' ? '#0F766E' : '#2563EB'}
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
          name={track === 'builder' ? 'Kabir' : 'Rohan'}
          nameColor={track === 'builder' ? '#0F766E' : '#2563EB'}
          borderColor={track === 'builder' ? '#0F766E' : '#2563EB'}
          conceptId="genai-m4-mindset"
          content={<>{track === 'engineer' ? "The first question in workflow automation isn't 'where does AI go?' — it's 'what is the current process, exactly?' Automating a fuzzy process produces a fuzzy automated process. The input design determines everything." : "Automation feels like AI. It's actually plumbing. The AI call is one node. The workflow is everything around it: what triggers it, what data it pulls, what happens when the output is empty, where the result goes. Get the plumbing right first."}</>}
          expandedContent={track === 'engineer' ? "The workflow spec has two parts: the happy path (trigger → data → AI → route → notify) and the failure paths (what happens at each node when it times out, returns unexpected data, or succeeds but produces the wrong output). Both must exist before the first line of n8n config is written." : "Write your manual process as if handing it to someone new: 'Every Monday at 7am, the first thing I do is...' Keep going until the email is sent. Count the distinct steps. Identify the step most likely to fail silently. That step needs error handling before you automate anything."}
          question={track === 'engineer' ? "Aarav wants to start building the AI classification node. Rohan asks him to do something first. What?" : "Rhea asks where the AI goes in her automation workflow. Kabir doesn't answer. What does he ask instead?"}
          options={track === 'engineer' ? [
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
        <ApplyItBox prompt={track === 'engineer' ? "Take the exception classification workflow you've been asked to build. Draw a node diagram with: trigger node, data input node(s), any transformation nodes needed before the AI call, the AI node with its input/output contract, any transformation nodes after the AI call, and the final output node. Count how many nodes are not the AI node. For each non-AI node, write one sentence describing what it does and what it outputs. This is your workflow spec." : "Write out your Monday morning exception summary process as if handing it to someone new. Start with 'Every Monday at 7am, the first thing I do is...' and keep going until the email is sent. Count the distinct steps. Identify which step is the AI call. Identify which step is most likely to fail silently. That step needs error handling before you automate anything."} />
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
        <NextChapterTeaser text={track === 'engineer' ? "Aarav has his workflow spec. He opens n8n for the first time. His first instinct is to connect the Email Trigger straight to the AI node. Rohan points to the data panel and asks him to look at what the trigger actually outputs." : "Rhea has her process documented. Kabir shows her n8n. She drags in the OpenAI node first. Kabir asks her to move it to the right side of the canvas."} />
      </ChapterSection>

      {/* ── SECTION 02 ── */}
      <ChapterSection id="genai-m4-nodes" num="02" accentRgb={ACCENT_RGB}>
        {h2("Triggers, nodes, and the data flow graph: everything is JSON moving between boxes.")}
        {para(track === 'engineer'
          ? "\u25b6 After this section, you can read any n8n node's output schema, identify a data shape mismatch at an edge, and insert the correct transformation node to fix it."
          : "\u25b6 After this section, you can build the left side of a workflow — trigger, data pull, format transform — and verify each handoff before adding the AI node."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? <>Aarav has his workflow spec. He opens n8n for the first time. He sees a canvas. He drags in an Email Trigger. The first thing he does is look for an AI node. Rohan stops him and points to the data panel on the right side of the Email Trigger node.</>
            : <>Rhea has her process documented. She opens n8n. Kabir shows her the canvas and asks her to drag in the first node without telling her which one to use. She drags in an OpenAI node. Kabir asks her to move it to the right side of the canvas.</>}
        </SituationCard>
        {para(track === 'engineer'
          ? "The n8n canvas is a picture of data flowing between transformations. Every edge in the graph is a JSON handoff. The AI node receives text — not email objects, not sheet rows, not raw API responses. Every upstream node either produces the right shape for the next node, or you need a transformation node between them."
          : "A workflow is data moving through transformations, not a list of tools connected together. The AI node is always in the middle. Something must prepare the data before it. Something must handle the output after it. Those flanking nodes are as important as the AI node — and they must be built and tested first."
        )}
        {keyBox(track === 'engineer' ? "Designing the data flow before wiring nodes" : "Thinking in flows, not nodes", [
          track === 'engineer'
            ? "Every n8n node has an input schema and an output schema. Design both before connecting nodes — a mismatched edge is the most common source of workflow failures."
            : "A workflow is data moving through transformations — not a list of tools connected together. Think about what the data looks like at each step, not which tool does what.",
          track === 'engineer'
            ? "The AI node receives text. Raw email objects, sheet rows, and webhook payloads are not text — they need a transformation step before the AI sees them."
            : "The AI node is always in the middle. Something must prepare the data before it, and something must handle the output after it. Those flanking nodes are as important as the AI node.",
          track === 'engineer'
            ? "Edge cases in input data (missing fields, unexpected nulls, arrays vs. single values) must be handled by transformation nodes before they reach the AI. The AI does not validate input."
            : "The Schedule Trigger fires at a time — it doesn't know anything about the data. The data must be pulled, cleaned, and formatted by nodes between the trigger and the AI.",
          track === 'engineer'
            ? "Draw the full node graph on paper before building it in n8n: trigger → transform → AI → transform → route → output → notify. Label each edge with the data shape it carries."
            : "When a node turns green, it means it ran without error — not that its output is what you expected. Always check the output data, not just the status colour.",
          track === 'engineer'
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
          content={<>{track === 'engineer' ? "Data shape mismatches between nodes are silent failures — the workflow looks connected but the downstream node receives garbage. Design the JSON at every edge before wiring. The data panel shows you exactly what each node outputs." : "The AI node is never your first node. It's always in the middle. Build left to right: trigger → data → format → AI. Test each connection before adding the next node. Green means executed, not correct."}</>}
          expandedContent={track === 'engineer' ? "The most common n8n failure pattern: AI node returns a JSON string ('{ \"category\": \"escalate\" }') and the downstream routing node expects a parsed object. The fix is a JSON Parse node or a Set node that extracts the field. Check the data panel output at every edge — the shape mismatch is always visible there before it causes an error downstream." : "The Set node is your most important non-AI node. It takes whatever the Sheets pull returns (arrays, nested objects, inconsistent field names) and transforms it into a clean, predictable text block. Run it once on real sheet data and inspect the output before connecting the AI node — every formatting problem you catch here prevents a silent failure later."}
          question={track === 'engineer' ? "Aarav builds: Email Trigger → AI Classify → Slack Notify. The Slack node fails with 'invalid data.' The AI node returns a JSON string, not an object. What is the root cause?" : "Rhea's workflow runs but the Google Sheet never updates. The Write node shows green but the sheet is blank. What should she check first?"}
          options={track === 'engineer' ? [
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
        <ApplyItBox prompt={track === 'engineer' ? "In n8n, add an Email Trigger node and run a test with one real exception email. Open the data panel and copy the JSON output. Write the exact Set node mapping you'd need to produce a single 'classification_input' field that handles both the 'subject has policy code' and 'subject has no policy code' cases. Verify the Set node output is correct for both cases before connecting the OpenAI node." : "In n8n, add a Schedule Trigger, a Google Sheets node connected to your exception sheet, and a Set node. Run the Sheets node and look at the data panel output. Write down: what fields does each row have? Which fields does your summary prompt actually need? Build the Set node to extract only those fields into a clean text block, and test it returns what you expect before adding the AI node."} />
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
        <NextChapterTeaser text={track === 'engineer' ? "Aarav's node graph is right. Rohan looks at the credentials and asks him to explain who owns each one — and what happens to the workflow if the API key is rotated next week." : "Rhea's data flow is right. Her assistant set up the Google Sheets credential using Rhea's personal Google account. Kabir has one question about what happens when Rhea is on leave."} />
      </ChapterSection>

      {/* ── SECTION 03 ── */}
      <ChapterSection id="genai-m4-connect" num="03" accentRgb={ACCENT_RGB}>
        {h2("Credentials, auth, and the trust model: who owns the connection, and what breaks when they leave.")}
        {para(track === 'engineer'
          ? "\u25b6 After this section, you can explain the difference between personal credentials and service accounts, and redesign any workflow that uses personal credentials in a production context."
          : "\u25b6 After this section, you can identify every credential your workflow uses, who owns it, and what happens to the workflow if that person's access changes."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? <>Aarav&apos;s workflow is wired. He used the team&apos;s shared OpenAI API key for the classification node and his own Slack token for the notification. Rohan looks at the credentials list and asks him one question: &ldquo;What happens to this workflow if you rotate the API key next week?&rdquo; Aarav realises he doesn&apos;t have an answer.</>
            : <>Rhea&apos;s workflow is nearly complete. Her assistant set up the Google Sheets credential using Rhea&apos;s personal Google account because it was the fastest path. Kabir asks: &ldquo;What happens to the Monday summary if Rhea is on leave and changes her password?&rdquo; Nobody in the room has an answer.</>}
        </SituationCard>
        {para(track === 'engineer'
          ? "Credentials are infrastructure. They are not configuration. A workflow that depends on a personal API key or a personal OAuth token has a single point of failure that has nothing to do with code quality. When that person rotates their key, changes their password, or leaves the team, the workflow breaks — silently, at 2am, before the Monday report runs."
          : "The Google Sheets OAuth token is tied to the Google account that created it. When Rhea changes her password, enables 2FA, or leaves the company, the token is revoked. The workflow fails. Nobody knows until the director notices the missing brief. The fix is not technical — it's an ownership decision that must be made before the workflow goes live."
        )}
        {keyBox(track === 'engineer' ? "The credential design checklist" : "Workflow credentials: ownership and failure modes", [
          track === 'engineer'
            ? "Every credential in a production workflow has an owner. The owner question is: if this credential breaks, who is responsible and who can fix it? Personal credentials answer: one person who might be unavailable."
            : "Every credential in a workflow has an owner — the person whose account was used to authenticate. When that person leaves, changes their password, or revokes access, the workflow breaks.",
          track === 'engineer'
            ? "Shared API keys are a cost, security, and rotation problem: every workflow uses the same budget pool, you can't audit per-workflow usage, and rotating the key breaks all workflows using it simultaneously."
            : "The fix is a team-owned service account or a shared workspace account — an account that belongs to the team, not a person. Any team member can re-authenticate it if it expires.",
          track === 'engineer'
            ? "Service accounts are the correct design for production workflows: one service account per workflow or per service, dedicated budget limits, rotation independent of any individual's credentials."
            : "Before any workflow goes live, audit every credential: Google Sheets OAuth, email send auth, AI API key. For each, ask: if the owner leaves tomorrow, can someone else re-authenticate without their personal login?",
          track === 'engineer'
            ? "OAuth tokens (Google Sheets, Gmail, Slack) expire and must be re-authorised. Personal OAuth tokens can only be re-authorised by the person who created them — or by revoking and re-creating with a different account."
            : "OAuth tokens expire on a schedule and must be renewed by the account that created them. If that account is a personal account, renewal requires that person to be available. If it's a service account, any admin can renew it.",
          track === 'engineer'
            ? "The compliance rule: any workflow that handles sensitive data (patient records, exception flags, policy decisions) must use auditable credentials — so there's a record of which workflow ran as which identity."
            : "Credentials are not a technical detail — they're an operational risk decision. Personal credentials in a team workflow create a dependency on one person's continued employment and password management.",
        ], '#2563EB')}
        <GenAIConversationScene
          mentor={track === 'builder' ? 'kabir' : 'leela'}
          track={track}
          accent={track === 'builder' ? '#0F766E' : '#C2410C'}
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
          content={<>{track === 'engineer' ? "Credentials are infrastructure — they have the same failure modes as servers. Personal credentials create a dependency on one person's continued availability, current password, and active employment. Design for team ownership from day one." : "The question 'who owns this credential?' is not a technical question — it's an operational risk question. Personal credentials in a team workflow are a single point of failure that shows up at the worst possible time."}</>}
          expandedContent={track === 'engineer' ? "The compliance dimension: in regulated environments (health insurance, financial services), every workflow action must be traceable to an identity. Shared API keys make that audit trail meaningless — every action looks like it came from the same identity. Service accounts with workflow-specific credentials give you the audit trail compliance requires." : "Build a credential audit table for every production workflow: credential name, service it accesses, account that owns it, expiry date, who can renew it. If 'who can renew it' is one person, that's a risk item. Fix it before go-live, not after the first failure."}
          question={track === 'engineer' ? "Aarav creates an n8n credential for the OpenAI API using the team's shared API key. Rohan asks him to change it. Why?" : "Rhea's assistant sets up the Google Sheets credential using Rhea's personal Google account. Kabir says this is a problem. What is the risk?"}
          options={track === 'engineer' ? [
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
        <ApplyItBox prompt={track === 'engineer' ? "List every credential your current or planned n8n workflow uses: AI API key, Slack token, Google Sheets OAuth, email send auth. For each, write down: (1) whose account owns it, (2) what happens if that person rotates or revokes it, (3) who can fix it at 2am if it breaks. Identify any credential where the answer to (3) is 'only one person' and redesign those as service accounts or shared team credentials." : "For the Monday summary workflow, list every external service it connects to and the credential type used for each. For each credential, answer: (1) whose personal account is it tied to, (2) what's the token expiry, (3) who can renew it if the owner is unavailable. If any credential is tied to a single person, create a team Google/Slack/email account and migrate the credential before the workflow goes live."} />
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
        <NextChapterTeaser text={track === 'engineer' ? "Credentials are fixed. The workflow runs overnight for the first time. In the morning, 14 of 22 exceptions were classified. 8 are missing. The workflow shows no errors." : "Credentials are fixed. The workflow runs on Monday morning. Rhea's director calls to ask why the email body is empty. The workflow shows all green nodes."} />
      </ChapterSection>

      {/* ── SECTION 04 ── */}
      <ChapterSection id="genai-m4-errors" num="04" accentRgb={ACCENT_RGB}>
        {h2("Error handling: what the workflow does when a node fails at 2am.")}
        {para(track === 'engineer'
          ? "\u25b6 After this section, you can answer three questions for every node in a workflow: what happens on timeout, what happens on unexpected output format, what happens when the node succeeds but the output is wrong."
          : "\u25b6 After this section, you can add an output validation step before any send node — so the workflow alerts you instead of sending an empty email."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? <>The overnight classification workflow has run. In the morning: 14 of 22 exceptions are classified and routed. 8 are missing. The n8n execution log shows no errors — every node ran green. Rohan looks at the error handling settings and immediately sees the problem.</>
            : <>Rhea&apos;s Monday report workflow ran. It sent the email. But the email body is empty. Her director calls at 10am to ask what happened. The n8n execution log shows all green nodes. Rhea realises the workflow succeeded at a task she didn&apos;t define correctly.</>}
        </SituationCard>
        {para(track === 'engineer'
          ? "Green nodes mean the node executed without throwing an error. They do not mean the output was correct or complete. In n8n, nodes have error handling modes: 'stop workflow' (halt on any error), 'continue' (skip the failed item and keep running), and 'retry on fail.' The default for most nodes is 'continue' — which means 8 failed items are silently dropped without any alert."
          : "The workflow sent an email — that's a successful execution. The email body was empty — that's a correct execution of a workflow that never checked whether it had anything to send. Output validation is a distinct step that must be designed explicitly: check the AI output before passing it to the send node, and define what happens when the check fails."
        )}
        {keyBox(track === 'engineer' ? "The three error questions for every node" : "Output validation: the step between AI and send", [
          track === 'engineer'
            ? "For every node, answer: (1) what should happen if this node times out? (2) what if it returns an unexpected format? (3) what if it succeeds but the output is wrong? These are different failure modes requiring different responses."
            : "Output validation is a Set node or Code node between the AI output and the send node. It checks: is the output non-empty? Is it above a minimum length? Does it contain the required sections? If not, it routes to an alert or a retry, not to the send.",
          track === 'engineer'
            ? "The three error responses: (1) retry with exponential backoff — for transient failures like rate limits or API timeouts; (2) route to error branch — for structural failures like malformed output; (3) alert and halt — for compliance-critical failures where any continuation is risky."
            : "The failure modes for a summary workflow: AI returns empty output (holiday week with no data), AI returns a very short output (data pull was incomplete), AI output is missing required sections (prompt was changed). Each needs a different response: retry, alert, or abort.",
          track === 'engineer'
            ? "The dead-letter pattern: items that fail processing go to a dead-letter queue (a separate sheet, a Slack channel, a database table) instead of being silently dropped. The queue is reviewed manually. No item is lost."
            : "The alert-and-abort pattern: if the validation check fails, send an alert to Rhea's Slack saying 'Monday summary validation failed — [reason]' and do not send the email. Better to get an alert than to send an empty brief to the director.",
          track === 'engineer'
            ? "n8n error handling settings: in the node settings panel, set 'On Error' to 'Continue Error Output' to route failed items to an error branch instead of silently dropping them."
            : "The validation node is also a data quality checkpoint: if the AI output consistently fails validation, that's a signal that the upstream data or the prompt has changed. The validation failure rate is a workflow health metric.",
          track === 'engineer'
            ? "Silent failures in compliance workflows are more dangerous than loud failures. A loud failure triggers a fix. A silent failure produces wrong decisions that nobody knows to question."
            : "Design the failure path first, before the happy path. Ask: what's the worst thing this workflow could do silently? That's the first validation check to add.",
        ], '#C2410C')}
        <GenAIConversationScene
          mentor={track === 'builder' ? 'kabir' : 'rohan'}
          track={track}
          accent={track === 'builder' ? '#0F766E' : '#2563EB'}
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
          content={<>{track === 'engineer' ? "Silent failures are more dangerous than loud ones. A loud failure triggers a fix immediately. A silent failure produces wrong decisions that nobody knows to question — and the workflow keeps running with the same flaw until someone notices the downstream impact." : "Output validation is not optional. Every automated workflow that produces output consumed by humans must check that output before sending it. The cost of a validation step is one node. The cost of skipping it is your director making decisions based on empty briefs."}</>}
          expandedContent={track === 'engineer' ? "The three-question framework for every node: (1) timeout — use retry with exponential backoff for API timeouts; (2) unexpected format — route to error branch with the raw output logged; (3) successful but wrong — add output validation checks (minimum length, required fields, confidence score threshold). Design each response before running the first test." : "The validation node pattern: add a Code node before any send step. It checks output_length > 100 and output.includes('exceptions') (or whatever required sections you defined). If the check fails, the Code node throws an error that routes to an alert branch. If it passes, the data flows to the email node. This is a five-minute build that prevents the most expensive silent failure."}
          question={track === 'engineer' ? "Aarav's overnight workflow ran with all green nodes. 8 of 22 exceptions are missing. No errors appear in the execution log. What is the most likely design gap?" : "Rhea's Monday report workflow ran with all green nodes and sent an empty email. What is the process gap?"}
          options={track === 'engineer' ? [
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
        <ApplyItBox prompt={track === 'engineer' ? "For each node in your exception classification workflow, answer three questions: (1) what happens if this node times out — retry, skip, or halt? (2) what happens if it returns an unexpected format — log and continue, or alert and halt? (3) what happens if it succeeds but produces a wrong output — how would you know? Add an error branch to any node where your answer to any question is 'I don't know.' Add a dead-letter queue write step to capture any item that fails processing." : "Add a validation node to your Monday summary workflow. Before the email send, add an IF node that checks: (1) is the AI output more than 100 characters? (2) does it contain the word 'exceptions'? If either check fails, route to a Slack alert that says 'Monday summary validation failed — [output_length] characters, missing expected content.' Test it by temporarily modifying the prompt to return a short output and verify the alert fires."} />
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
        <NextChapterTeaser text={track === 'engineer' ? "Error handling is in place. Aarav runs the full workflow end-to-end on a real exception. It succeeds. He marks it production-ready. Rohan has one question before signing off — and it's not about the success case." : "Validation is in place. Rhea runs the full workflow on test data. It works. She tells Kabir she's ready to go live. He asks her to run one more test — one she hasn't tried yet."} />
      </ChapterSection>

      {/* ── SECTION 05 ── */}
      <ChapterSection id="genai-m4-e2e" num="05" accentRgb={ACCENT_RGB}>
        {h2("Your first end-to-end workflow: production readiness means testing the failure path, not just the happy path.")}
        {para(track === 'engineer'
          ? "\u25b6 After this section, you can define production readiness for a classification workflow — including the confidence threshold design, the human review queue, and what a 'verified output' means in a compliance context."
          : "\u25b6 After this section, you can run the baseline comparison test — comparing AI output to a manually produced reference — and explain why happy-path success doesn't mean production readiness."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'engineer' ? '◎ Aarav\’s Situation' : '◎ Rhea\’s Situation'}>
          {track === 'engineer'
            ? <>Aarav runs the full end-to-end workflow on a real exception. Trigger fires. Email parsed. Classification runs. Slack notification sent. It works. He marks the workflow production-ready. Rohan asks him one question: &ldquo;What does the workflow do when the AI returns a confidence score below 0.6?&rdquo; Aarav has no answer.</>
            : <>Rhea&apos;s workflow runs successfully on her test dataset. All nodes green. Output looks reasonable. She tells Kabir she&apos;s ready to go live. Kabir asks her to run one more test before she does. Not a technical test — a quality test. He asks her to compare the AI output to last week&apos;s manually written brief.</>}
        </SituationCard>
        {para(track === 'engineer'
          ? "Happy path success is not production readiness. The classification workflow succeeds when the AI returns a confident, correctly formatted category for a clean input. Production is full of inputs that aren't clean and AI calls that aren't confident. The failure path — what happens when confidence is low, when the category is ambiguous, when the input is malformed — must be designed before the workflow goes live."
          : "Test data passes because it was designed to pass. The real question is whether the workflow produces the same quality output as the manual process it's replacing. The baseline comparison test — run the workflow on last week's real data and compare the output to the brief that was actually sent — is the only test that answers the production readiness question directly."
        )}
        {keyBox(track === 'engineer' ? "Designing the confidence threshold and human review queue" : "The baseline comparison test", [
          track === 'engineer'
            ? "Every AI classification output has a confidence score or an implied confidence level. 'High confidence' without a calibration threshold is meaningless — it must be a number calibrated on labeled examples from your actual data."
            : "The baseline test: run the workflow on the last N weeks of real data. Compare each AI-generated output to the manually written brief for the same week. For each comparison, ask: would this AI brief have told me what I needed to know? Would my director have been able to act on it?",
          track === 'engineer'
            ? "The confidence threshold design: items above threshold auto-route; items below threshold go to a human review queue. The threshold must be set based on labeled data — not intuition. An arbitrary threshold produces auto-routed items that are confidently wrong."
            : "The quality bar: the AI brief should be at least as useful as the manual brief for the three most common decision types. If it fails for any of those three, the workflow is not production-ready for that case.",
          track === 'engineer'
            ? "The human review queue is a workflow component, not an escape hatch. It has an SLA (how long can an item sit before it must be reviewed?), a capacity design (how many items per day can analysts handle?), and a feedback loop (what happens to low-confidence items that analysts classify? Does that data improve the threshold?)."
            : "The failure cases to test explicitly: a holiday week with no exceptions, a week with an unusually high exception count, a week where all exceptions are the same type. Each of these is a realistic production scenario that test data rarely covers.",
          track === 'engineer'
            ? "Verified output in a compliance context: the output of an automated classification must be traceable — which workflow, which model version, which prompt version, which input produced this classification. Logging these at the time of classification is a compliance requirement, not a feature."
            : "Go-live means the workflow runs without human supervision. The production readiness question is: if I don't look at the workflow output for a full week, will my director have received accurate, actionable briefs every Monday? If the answer is 'probably,' the workflow is not production-ready.",
          track === 'engineer'
            ? "The go-live checklist: (1) confidence threshold calibrated on labeled data; (2) human review queue designed with SLA; (3) failure paths tested explicitly; (4) credentials owned by team accounts; (5) dead-letter queue in place; (6) compliance logging active."
            : "After go-live: monitor the first four weeks manually. Compare AI output to your manual check each week. Track validation failure rate. If the quality is consistently meeting the bar, reduce manual oversight. If it's not, diagnose before reducing oversight.",
        ], '#0891B2')}
        <GenAIConversationScene
          mentor={track === 'builder' ? 'kabir' : 'rohan'}
          track={track}
          accent={track === 'builder' ? '#0F766E' : '#2563EB'}
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
          name={track === 'builder' ? 'Kabir' : 'Rohan'}
          nameColor={track === 'builder' ? '#0F766E' : '#2563EB'}
          borderColor={track === 'builder' ? '#0F766E' : '#2563EB'}
          conceptId="genai-m4-e2e"
          content={<>{track === 'engineer' ? "Happy path success is the beginning of the production readiness test, not the end. The failure path — what the workflow does when confidence is low, input is malformed, or the API is slow — is what matters when the workflow runs at 2am without anyone watching." : "Test data passes because it was designed to pass. The baseline comparison test — run on last week's real data, compared to the brief that was actually sent — is the only test that answers the production readiness question."}</>}
          expandedContent={track === 'engineer' ? "The confidence threshold is the most common production readiness gap in classification workflows. Teams set it arbitrarily (0.8 sounds good) without calibrating on labeled data. If 40% of your production inputs have ambiguous categories, an arbitrary 0.8 threshold produces a human review queue that's 40% of volume — which no analyst team can handle. Calibrate the threshold to a queue volume your team can actually review." : "The four-week monitoring protocol: for the first four weeks after go-live, Rhea reads the AI brief before sending it. She notes anything she would have changed. At week 4, she reviews the change list — if there are recurring patterns, they're prompt improvements. If the list is empty for the last two weeks, full automation is justified."}
          question={track === 'engineer' ? "Aarav's end-to-end workflow succeeds on a real exception. He marks it production-ready. Rohan asks one question before signing off. What is it?" : "Rhea's Monday report workflow works on her test data. She's ready to go live. Kabir asks her to run one more test. What kind?"}
          options={track === 'engineer' ? [
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
        <ApplyItBox prompt={track === 'engineer' ? "Before marking any classification workflow production-ready, complete this checklist: (1) add a confidence field to AI output and set a threshold calibrated on 20+ labeled examples; (2) build a human review queue for below-threshold items with a defined daily SLA; (3) log workflow version, model version, and prompt hash for every classification; (4) test three explicit failure cases: empty input, ambiguous input, and input that belongs to two categories. Document the workflow's behaviour for each. Sign off only when all four are done." : "Pull last week's real exception sheet. Run your workflow on it and save the AI output. Then pull the brief you actually sent last week. Compare them line by line. For each difference, write one sentence: is this a prompt gap (the prompt doesn't ask for this), a data gap (the data wasn't in the sheet), or a quality bar gap (the AI version is acceptable but different)? Count the prompt gaps. Each one is a workflow improvement before go-live."} />
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
        <NextChapterTeaser text={track === 'engineer' ? "The exception classification workflow is live at 20 records per day. Leadership wants 200. Aarav adds a Loop node. 200 OpenAI calls fire simultaneously — and hit the rate limit." : "The Monday summary workflow is live and working. Her manager asks for a second: a weekly renewal digest covering 80 accounts from a new spreadsheet. Rhea adds a Loop node. First run: one output. The other 79 renewals never processed."} />
      </ChapterSection>
    </>
  );
}

export default function GenAIPreRead4({ track, onBack, onNext, nextLabel }: Props) {
  const completionMessage = track === 'engineer'
    ? 'You now have the workflow automation toolkit: process-first spec design, JSON edge handoffs, service-account credential hygiene, explicit error paths with dead-letter queues, and failure-path production readiness.'
    : 'You now know how to automate the Monday workflow reliably: trigger design, data transformation, output validation, team-owned credentials, and the baseline comparison test before going live.';
  return (
    <GenAIPreReadLayout
      moduleNum="04" moduleLabel={TRACK_META[track].introTitle}
      accent={ACCENT} accentRgb={ACCENT_RGB}
      sections={SECTIONS} badges={BADGES} concepts={CONCEPTS}
      completionEmoji="◎" completionMessage={completionMessage} onBack={onBack} onNext={onNext} nextLabel={nextLabel}
    >
      <CoreContent track={track} />
    </GenAIPreReadLayout>
  );
}

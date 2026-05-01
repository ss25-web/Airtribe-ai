'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import GenAIStreakCard, { GenAILatestBadgePanel } from './GenAISidebarExtras';
import QuizEngine from './QuizEngine';
import GenAIAvatar, { GenAIConversationScene, AaravFace, RheaFace, GenAIMentorFace } from './GenAIAvatar';
import type { GenAIMentorId } from './GenAIAvatar';
import type { GenAITrack } from './genaiTypes';
import {
  ApplyItBox, ChapterSection, NextChapterTeaser, PMPrincipleBox, SituationCard,
  TiltCard, chLabel, h2, keyBox, para, pullQuote,
} from './pm-fundamentals/designSystem';
import { AirtribeLogo, DarkModeToggle } from './AirtribeBrand';

const ACCENT = '#B45309';
const ACCENT_RGB = '180,83,9';
const MODULE_NUM = '07';

const CONCEPTS = [
  { id: 'genai-m7-lastmile',    label: 'The Last-Mile Gap', color: '#B45309' },
  { id: 'genai-m7-anatomy',     label: 'MCP Anatomy',       color: '#2563EB' },
  { id: 'genai-m7-build',       label: 'Building Tools',    color: '#0891B2' },
  { id: 'genai-m7-permissions', label: 'Scope & Trust',     color: '#059669' },
  { id: 'genai-m7-production',  label: 'MCP in Production', color: '#7C3AED' },
];

const SECTIONS = [
  { id: 'genai-m7-lastmile',    label: '1. The Last-Mile Problem' },
  { id: 'genai-m7-anatomy',     label: '2. What MCP Actually Is' },
  { id: 'genai-m7-build',       label: '3. Your First MCP Tool' },
  { id: 'genai-m7-permissions', label: '4. Scope, Trust & Permissions' },
  { id: 'genai-m7-production',  label: '5. MCP in Production' },
];

const BADGES = [
  { id: 'genai-m7-lastmile',    icon: '🔗', label: 'Last Mile',    color: '#B45309', bg: '#FEF3C7', border: '#FDE68A' },
  { id: 'genai-m7-anatomy',     icon: '🧩', label: 'Anatomy',      color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { id: 'genai-m7-build',       icon: '🛠️', label: 'Tool Builder', color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC' },
  { id: 'genai-m7-permissions', icon: '🛡️', label: 'Scoper',       color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'genai-m7-production',  icon: '🚀', label: 'Prod Ready',   color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
];

const QUIZZES = [
  {
    conceptId: 'genai-m7-lastmile',
    question: {
      tech: "Aarav's agent responds 'I cannot access adjuster workloads without live data.' The route logic works. What is the actual gap?",
      'non-tech': "Rhea's AI summary is accurate but can't answer 'is this account in our CRM?' even though the CRM exists. What is missing?",
    },
    options: {
      tech: [
        { text: "The model is too weak to handle live data lookups", correct: false, feedback: "Model capability is not the issue — the AI has no mechanism to call external systems, regardless of model size." },
        { text: "There is no bridge from the model to live enterprise systems", correct: true, feedback: "The last-mile gap: the model can reason but has no sanctioned, structured way to call the HR database at runtime." },
        { text: "The system prompt doesn't include adjuster workload data", correct: false, feedback: "Pasting live data into the system prompt is not scalable and requires a separate pipeline to stay fresh." },
        { text: "The claims classifier needs access to a larger context window", correct: false, feedback: "Context window size is unrelated to the ability to call external APIs at runtime." },
      ],
      'non-tech': [
        { text: "The AI needs to be retrained on CRM data to answer CRM questions", correct: false, feedback: "Retraining is expensive and still wouldn't give real-time access to live CRM records." },
        { text: "There is no tool connecting the AI to the live CRM system", correct: true, feedback: "The AI can only reason about data already in the prompt. A tool is what lets it query the CRM at runtime." },
        { text: "The n8n workflow needs more HTTP nodes to pull CRM data first", correct: false, feedback: "Pre-pulling data works for fixed queries but breaks for dynamic questions — you can't predict every question in advance." },
        { text: "The AI model needs a higher API tier to access external databases", correct: false, feedback: "API tier controls rate limits, not the ability to call custom enterprise tools." },
      ],
    },
  },
  {
    conceptId: 'genai-m7-anatomy',
    question: {
      tech: "Aarav writes a tool description: 'Gets HR data.' What is the critical missing element?",
      'non-tech': "Rhea sets up a Salesforce lookup tool in n8n but the AI calls it for every message, even general questions. What is wrong with her tool setup?",
    },
    options: {
      tech: [
        { text: "It needs the tool's return type and field names listed", correct: false, feedback: "Return type docs are helpful but not what controls when the tool fires. The model needs decision constraints." },
        { text: "It is missing when to call this tool and when NOT to call it", correct: true, feedback: "A tool description without a decision boundary is an open invitation. The model needs explicit scope: when YES and when NO." },
        { text: "It should include the HR database URL and auth method", correct: false, feedback: "Auth details don't belong in a public tool description — and they still don't tell the model when to use the tool." },
        { text: "The tool name should be more descriptive of its function", correct: false, feedback: "Name clarity helps but the decision logic lives in the description, not the name." },
      ],
      'non-tech': [
        { text: "The Salesforce credential is misconfigured and the tool never returns data", correct: false, feedback: "If the tool never returned data the agent would error, not call it repeatedly." },
        { text: "The tool description lacks a 'when NOT to call this' constraint", correct: true, feedback: "Without a negative constraint the model treats the tool as broadly useful. Add: 'Do not call for general questions where account data is already in context.'" },
        { text: "The tool needs a human-approval node before every Salesforce lookup", correct: false, feedback: "Human approval is a governance control, not a fix for a missing call-scope definition." },
        { text: "The n8n workflow trigger is set too broadly and fires too often", correct: false, feedback: "The workflow trigger fires the workflow — the AI inside the workflow decides when to call each tool." },
      ],
    },
  },
  {
    conceptId: 'genai-m7-build',
    question: {
      tech: "Aarav's get_adjuster_load() tool returns a JSON blob with 40 fields. The agent uses only 3 of them. What is the practical consequence?",
      'non-tech': "Rhea's tool returns the full Salesforce account record (60 fields). The AI uses the account_status field. What is the issue?",
    },
    options: {
      tech: [
        { text: "The agent may become confused by irrelevant fields and hallucinate wrong values", correct: false, feedback: "The model won't hallucinate from excess fields, but token waste and context dilution are real risks." },
        { text: "Unnecessary tokens increase cost and dilute the fields the agent actually needs", correct: true, feedback: "Every unused field consumes context and costs tokens. Tools should return only what the agent needs to act on." },
        { text: "The JSON schema becomes invalid if more than 10 fields are returned", correct: false, feedback: "There is no field count limit — the issue is cost and context efficiency, not schema validity." },
        { text: "The agent will fail to parse the response and throw an error", correct: false, feedback: "Parsing doesn't fail on extra fields — the agent just ignores them, wasting context." },
      ],
      'non-tech': [
        { text: "The workflow will fail because n8n can't handle Salesforce responses over 50 fields", correct: false, feedback: "n8n handles large JSON responses. The issue is cost and response quality, not system capacity." },
        { text: "60 fields of unused data consume tokens and may cause the agent to miss the key field", correct: true, feedback: "Smaller, focused responses help the model reason more accurately and cost less per call." },
        { text: "Salesforce will block the request for returning too many fields at once", correct: false, feedback: "Salesforce returns what the API query requests — the field count is your control, not Salesforce's limit." },
        { text: "The tool call will timeout because the response payload is too large", correct: false, feedback: "Timeouts are caused by latency, not field count. The real issue is context efficiency." },
      ],
    },
  },
  {
    conceptId: 'genai-m7-permissions',
    question: {
      tech: "Aarav's MCP server uses a single API key with full HR access. A bug causes it to be called with adjuster_id='*'. What should have prevented this?",
      'non-tech': "Rhea's Salesforce tool credential has full read-write access. The AI agent accidentally calls an update-record action. What control was missing?",
    },
    options: {
      tech: [
        { text: "Input validation in the MCP server rejecting wildcard IDs", correct: true, feedback: "The tool should validate inputs before calling downstream systems. A scoped key adds defence-in-depth but input validation is the first line." },
        { text: "A more descriptive tool name that discourages wildcard usage", correct: false, feedback: "The model doesn't use a tool name as a security boundary — only server-side validation stops wildcard calls." },
        { text: "Rate limiting on the MCP server to slow down bulk requests", correct: false, feedback: "Rate limiting slows damage but doesn't prevent invalid inputs from reaching HR." },
        { text: "A longer system prompt warning the model not to use wildcards", correct: false, feedback: "Prompt-based constraints can be bypassed by prompt injection. Server-side validation is the reliable control." },
      ],
      'non-tech': [
        { text: "A human-in-the-loop approval before any write action is executed", correct: true, feedback: "For write operations in production systems, a human approval node is the correct guardrail. Read tools are generally safe to call without approval." },
        { text: "A more specific tool description telling the AI not to update records", correct: false, feedback: "Prompt-based constraints don't replace access controls — a compromised or confused AI can still call write endpoints." },
        { text: "A separate n8n workflow for read vs. write operations", correct: false, feedback: "Separate workflows are an architectural preference, not a security control. The credential scope is the real control." },
        { text: "Switching to a read-only Salesforce credential for all tool calls", correct: false, feedback: "Read-only credentials are best practice but the question asks what was missing for the write-action case specifically." },
      ],
    },
  },
  {
    conceptId: 'genai-m7-production',
    question: {
      tech: "Aarav's production logs show get_policy_details called 340 times in one hour — 8× above normal. What is the correct first response?",
      'non-tech': "Rhea's n8n execution log shows her Salesforce tool returning 403 Forbidden on every call after 2pm yesterday. What should she check first?",
    },
    options: {
      tech: [
        { text: "Immediately disable the tool to prevent further overuse", correct: false, feedback: "Disabling a production tool without diagnosis risks breaking dependent workflows." },
        { text: "Inspect the tool call inputs to find whether a prompt loop is generating repeated calls", correct: true, feedback: "A spike pattern usually means a loop or a broken stopping condition. Read the inputs before disabling anything." },
        { text: "Increase the rate limit ceiling to accommodate higher demand", correct: false, feedback: "Raising limits without understanding why they're being hit encourages runaway cost." },
        { text: "Switch to a model with lower tool-call frequency by default", correct: false, feedback: "Models don't have 'call frequency settings' — the call rate is driven by prompt loops or bad stopping conditions." },
      ],
      'non-tech': [
        { text: "Re-deploy the entire workflow to pick up fresh credentials", correct: false, feedback: "Re-deployment doesn't fix a 403 if the underlying cause is a credential expiry or permission change." },
        { text: "Check whether the Salesforce credential expired or was revoked after 2pm", correct: true, feedback: "403 Forbidden after a specific time almost always means the auth token expired or a permission was changed. Check the credential vault." },
        { text: "Add a retry node to the workflow to handle intermittent 403 errors", correct: false, feedback: "Retrying a 403 won't work — the server is actively denying the request, not returning a transient error." },
        { text: "Reduce the workflow trigger frequency to avoid hitting Salesforce rate limits", correct: false, feedback: "Rate limits return 429, not 403. A 403 is an access-denied error, not a rate error." },
      ],
    },
  },
];

const SECTION_XP = 50;
const QUIZ_XP = 100;

function computeXP(completedSections: Set<string>, conceptStates: Record<string, { pKnow: number }>) {
  const readingXP = completedSections.size * SECTION_XP;
  const quizXP = Object.values(conceptStates).reduce((sum, s) => sum + Math.round(s.pKnow * QUIZ_XP), 0);
  return { readingXP, quizXP, total: readingXP + quizXP };
}

function getLevel(total: number) {
  if (total >= 600) return { label: 'Builder',  color: '#B45309', min: 600 };
  if (total >= 350) return { label: 'Operator', color: '#2563EB', min: 350 };
  if (total >= 150) return { label: 'Explorer', color: '#0891B2', min: 150 };
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

// ── Interactive Tool Mockups ─────────────────────────────────────────────────

const MCPVsApiCompareCard = ({ track }: { track: GenAITrack }) => {
  const [mcpEnabled, setMcpEnabled] = useState(false);

  const withoutMcp = track === 'tech'
    ? { prompt: 'Route CLM-8847 to the least-loaded adjuster.', response: "I don't have access to adjuster workload data. I can categorize the claim by type, but I cannot determine which adjuster has the lightest current caseload without a live data connection." }
    : { prompt: 'Is Hartwell Group\u2019s renewal in our CRM system?', response: "I don\u2019t have access to your CRM. Based on the information you\u2019ve provided, Hartwell Group appears to be a renewal account, but I cannot confirm whether they are currently in the system." };

  const withMcp = track === 'tech'
    ? {
        toolCall: 'get_adjuster_load(department="claims")',
        toolResult: '[{id:"ADJ-04", cases_open:3, capacity:"high"}, {id:"ADJ-07", cases_open:8, capacity:"low"}, {id:"ADJ-12", cases_open:5, capacity:"med"}]',
        response: 'Routing CLM-8847 to ADJ-04. They have 3 open cases and high available capacity — the lowest current load in the claims team.',
      }
    : {
        toolCall: 'lookup_crm_account(account_name="Hartwell Group")',
        toolResult: '{found: true, account_id: "ACC-2204", status: "active", renewal_date: "2026-05-12", owner: "Leila Ramos"}',
        response: 'Yes — Hartwell Group is in the CRM. Account ACC-2204, active, renewal due 12 May 2026, owned by Leila Ramos.',
      };

  return (
    <div style={{ background: '#0D1117', borderRadius: '12px', padding: '20px 24px', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#8B949E', marginBottom: '4px' }}>AI WITHOUT MCP vs. AI WITH MCP</div>
      <div style={{ fontSize: '9px', color: '#6B7280', marginBottom: '16px' }}>The same question. Before and after adding a tool.</div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 14px', marginBottom: '12px' }}>
        <div style={{ fontSize: '9px', color: '#8B949E', marginBottom: '6px' }}>USER PROMPT</div>
        <div style={{ fontSize: '11px', color: '#C9D1D9', lineHeight: 1.6 }}>&ldquo;{withoutMcp.prompt}&rdquo;</div>
      </div>

      <AnimatePresence mode="wait">
        {!mcpEnabled ? (
          <motion.div key="without" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '8px', padding: '12px 14px', marginBottom: '14px' }}>
              <div style={{ fontSize: '9px', color: '#FCA5A5', marginBottom: '6px' }}>AI RESPONSE — NO TOOLS</div>
              <div style={{ fontSize: '11px', color: '#C9D1D9', lineHeight: 1.6, fontStyle: 'italic' }}>{withoutMcp.response}</div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="with" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div style={{ background: 'rgba(180,83,9,0.08)', border: '1px solid rgba(180,83,9,0.3)', borderRadius: '8px', padding: '12px 14px', marginBottom: '6px' }}>
              <div style={{ fontSize: '9px', color: '#FCD34D', marginBottom: '6px' }}>TOOL CALL</div>
              <div style={{ fontSize: '10px', color: '#B45309' }}>{withMcp.toolCall}</div>
            </div>
            <div style={{ background: 'rgba(5,150,105,0.07)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: '8px', padding: '12px 14px', marginBottom: '6px' }}>
              <div style={{ fontSize: '9px', color: '#6EE7B7', marginBottom: '6px' }}>TOOL RESPONSE</div>
              <div style={{ fontSize: '9px', color: '#A7F3D0', lineHeight: 1.7 }}>{withMcp.toolResult}</div>
            </div>
            <div style={{ background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '8px', padding: '12px 14px', marginBottom: '14px' }}>
              <div style={{ fontSize: '9px', color: '#93C5FD', marginBottom: '6px' }}>AI RESPONSE — WITH TOOL</div>
              <div style={{ fontSize: '11px', color: '#C9D1D9', lineHeight: 1.6 }}>{withMcp.response}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        onClick={() => setMcpEnabled(v => !v)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '6px', background: mcpEnabled ? '#B45309' : 'rgba(255,255,255,0.06)', border: `1px solid ${mcpEnabled ? '#B45309' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', fontSize: '10px', fontWeight: 700, color: mcpEnabled ? '#fff' : '#9CA3AF' }}
      >
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: mcpEnabled ? '#FCD34D' : '#374151' }} />
        {mcpEnabled ? 'MCP Enabled' : 'Add MCP Tool'}
      </div>
    </div>
  );
};

const MCPToolSchemaBuilderCard = ({ track }: { track: GenAITrack }) => {
  const [toolName, setToolName] = useState(track === 'tech' ? 'get_adjuster_load' : 'lookup_crm_account');
  const [desc, setDesc] = useState('');
  const [paramName, setParamName] = useState(track === 'tech' ? 'department' : 'account_name');
  const [paramType, setParamType] = useState('string');
  const [showSchema, setShowSchema] = useState(false);

  const hasWhen = desc.toLowerCase().includes('when') || desc.toLowerCase().includes('use this');
  const hasWhenNot = desc.toLowerCase().includes('not') || desc.toLowerCase().includes('do not') || desc.toLowerCase().includes("don't");
  const descScore = (hasWhen ? 1 : 0) + (hasWhenNot ? 1 : 0) + (desc.length > 30 ? 1 : 0);

  const schema = {
    name: toolName || 'my_tool',
    description: desc || '(write a description above)',
    inputSchema: {
      type: 'object',
      properties: {
        [paramName || 'param']: { type: paramType, description: `The ${paramName || 'param'} to look up` },
      },
      required: [paramName || 'param'],
    },
  };

  return (
    <div style={{ background: '#FAFAF9', border: '1px solid #E7E5E4', borderRadius: '12px', padding: '20px 24px' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.14em', color: '#78716C', marginBottom: '4px' }}>MCP TOOL SCHEMA BUILDER</div>
      <div style={{ fontSize: '11px', color: '#78716C', marginBottom: '16px' }}>Build a tool definition. Watch the schema generate in real time.</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: '#78716C', marginBottom: '4px', textTransform: 'uppercase' as const }}>Tool Name</div>
          <input value={toolName} onChange={e => setToolName(e.target.value)} style={{ width: '100%', padding: '7px 10px', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", border: '1px solid #E7E5E4', borderRadius: '6px', background: '#fff', color: '#292524', outline: 'none', boxSizing: 'border-box' as const }} placeholder="e.g. get_adjuster_load" />
        </div>
        <div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: '#78716C', marginBottom: '4px', textTransform: 'uppercase' as const }}>Parameter</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input value={paramName} onChange={e => setParamName(e.target.value)} style={{ flex: 1, padding: '7px 10px', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", border: '1px solid #E7E5E4', borderRadius: '6px', background: '#fff', color: '#292524', outline: 'none' }} placeholder="param_name" />
            <select value={paramType} onChange={e => setParamType(e.target.value)} style={{ padding: '7px 8px', fontSize: '10px', border: '1px solid #E7E5E4', borderRadius: '6px', background: '#fff', color: '#292524', outline: 'none' }}>
              <option>string</option><option>number</option><option>boolean</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, color: '#78716C', textTransform: 'uppercase' as const }}>Description</div>
          <div style={{ fontSize: '9px', color: descScore === 3 ? '#16A34A' : descScore >= 1 ? '#D97706' : '#DC2626' }}>
            {descScore === 3 ? '✓ Strong' : descScore >= 1 ? '⚠ Partial' : '✗ Too vague'}
          </div>
        </div>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} style={{ width: '100%', padding: '8px 10px', fontSize: '11px', border: '1px solid #E7E5E4', borderRadius: '6px', background: '#fff', color: '#292524', outline: 'none', resize: 'none', lineHeight: 1.6, boxSizing: 'border-box' as const }} placeholder={track === 'tech' ? "Use this tool when the user asks about adjuster availability or caseload. Do not call for policy questions or claim status." : "Use this tool when the user asks about a specific account by name or ID. Do not call for general trend questions."} />
        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
          {[{ label: 'has when-to-call', pass: hasWhen }, { label: 'has when-NOT-to-call', pass: hasWhenNot }, { label: 'sufficient length', pass: desc.length > 30 }].map(c => (
            <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: c.pass ? '#16A34A' : '#9CA3AF' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.pass ? '#16A34A' : '#E5E7EB' }} />{c.label}
            </div>
          ))}
        </div>
      </div>

      <div onClick={() => setShowSchema(v => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '6px', background: '#B45309', cursor: 'pointer', fontSize: '10px', fontWeight: 700, color: '#fff', marginBottom: showSchema ? '12px' : 0 }}>
        {showSchema ? 'Hide' : 'Generate'} Schema
      </div>

      {showSchema && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#0D1117', borderRadius: '8px', padding: '12px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#A78BFA', lineHeight: 1.8 }}>
          <pre style={{ margin: 0, color: '#C9D1D9', whiteSpace: 'pre-wrap' as const }}>{JSON.stringify(schema, null, 2)}</pre>
        </motion.div>
      )}
    </div>
  );
};

const MCPFlowStepperCard = ({ track }: { track: GenAITrack }) => {
  const steps = track === 'tech' ? [
    { type: 'USER', label: 'User Message', color: '#6B7280', text: '"Route claim CLM-8847 to the best available adjuster in the claims team."' },
    { type: 'REASON', label: 'AI Reasoning', color: '#B45309', text: 'I need to know current adjuster workloads before I can route. I should call get_adjuster_load() for the claims department.' },
    { type: 'TOOL CALL', label: 'Tool Call', color: '#F59E0B', text: 'get_adjuster_load(department="claims")' },
    { type: 'TOOL RESPONSE', label: 'Tool Response', color: '#059669', text: '[{id:"ADJ-04",cases_open:3,capacity:"high"},{id:"ADJ-07",cases_open:8,capacity:"low"},{id:"ADJ-12",cases_open:5,capacity:"med"}]' },
    { type: 'REASON', label: 'AI Reasoning', color: '#B45309', text: 'ADJ-04 has the fewest open cases (3) and highest capacity. That\'s the correct route.' },
    { type: 'ANSWER', label: 'Final Answer', color: '#2563EB', text: 'Routing CLM-8847 to ADJ-04. They have 3 open cases and high available capacity — lowest current load in the claims team.' },
  ] : [
    { type: 'USER', label: 'User Message', color: '#6B7280', text: '"Is Hartwell Group in our CRM and when is their renewal?"' },
    { type: 'REASON', label: 'AI Reasoning', color: '#B45309', text: 'The user is asking about a specific account by name. I should call lookup_crm_account() for Hartwell Group.' },
    { type: 'TOOL CALL', label: 'Tool Call', color: '#F59E0B', text: 'lookup_crm_account(account_name="Hartwell Group")' },
    { type: 'TOOL RESPONSE', label: 'Tool Response', color: '#059669', text: '{found:true,account_id:"ACC-2204",status:"active",renewal_date:"2026-05-12",owner:"Leila Ramos"}' },
    { type: 'REASON', label: 'AI Reasoning', color: '#B45309', text: 'Account found, active, renewal in May. I have everything I need to answer the question directly.' },
    { type: 'ANSWER', label: 'Final Answer', color: '#2563EB', text: 'Yes — Hartwell Group is in the CRM. Account ACC-2204, active, renewal due 12 May 2026, owned by Leila Ramos.' },
  ];

  const [current, setCurrent] = useState(0);
  const done = current >= steps.length;

  return (
    <div style={{ background: '#0D1117', borderRadius: '12px', padding: '20px 24px', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#8B949E', marginBottom: '4px' }}>MCP FLOW STEPPER</div>
      <div style={{ fontSize: '9px', color: '#6B7280', marginBottom: '16px' }}>Step through a live MCP request. See every stage of the reasoning loop.</div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px', marginBottom: '16px' }}>
        {steps.slice(0, Math.max(1, current)).map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
            style={{ padding: '10px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${step.color}33` }}>
            <div style={{ fontSize: '8px', fontWeight: 700, color: step.color, letterSpacing: '0.12em', marginBottom: '5px' }}>{step.type}</div>
            <div style={{ fontSize: '10px', color: '#C9D1D9', lineHeight: 1.6 }}>{step.text}</div>
          </motion.div>
        ))}
        {!done && (
          <div style={{ padding: '10px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.015)', border: '1px dashed rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em' }}>{steps[current]?.type ?? 'DONE'}</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {!done
          ? <div onClick={() => setCurrent(v => v + 1)} style={{ padding: '7px 16px', background: '#B45309', borderRadius: '6px', fontSize: '10px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
              {current === 0 ? 'Start Flow' : 'Next Step'} →
            </div>
          : <>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#6EE7B7' }}>✓ Complete — {steps.length} steps</div>
              <div onClick={() => setCurrent(0)} style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '10px', color: '#9CA3AF', cursor: 'pointer' }}>Reset</div>
            </>
        }
        {!done && current > 0 && <div style={{ fontSize: '9px', color: '#6B7280', alignSelf: 'center' }}>{current} / {steps.length}</div>}
      </div>
    </div>
  );
};

const MCPPermissionAuditCard = ({ track }: { track: GenAITrack }) => {
  const tools = track === 'tech' ? [
    { name: 'get_adjuster_load()', action: 'Reads adjuster caseload from HR API', type: 'READ', answer: 'safe', risk: 'No data modified. Safe to call without approval.' },
    { name: 'update_claim_status()', action: 'Writes new status to claims database', type: 'WRITE', answer: 'review', risk: 'Modifies production records. Needs human-in-the-loop.' },
    { name: 'send_adjuster_email()', action: 'Sends email from adjuster account', type: 'SEND', answer: 'review', risk: 'External-facing action. Must require explicit confirmation.' },
    { name: 'get_policy_clause()', action: 'Reads policy text from document store', type: 'READ', answer: 'safe', risk: 'Read-only on non-sensitive documents. Safe.' },
    { name: 'delete_claim_record()', action: 'Permanently deletes a claim row', type: 'DELETE', answer: 'block', risk: 'Irreversible. Should never be callable by AI directly.' },
  ] : [
    { name: 'lookup_crm_account()', action: 'Reads account data from Salesforce', type: 'READ', answer: 'safe', risk: 'Read-only. Safe to call without approval.' },
    { name: 'update_renewal_date()', action: 'Updates renewal date in Salesforce', type: 'WRITE', answer: 'review', risk: 'Modifies CRM records. Needs human approval node.' },
    { name: 'send_renewal_email()', action: 'Sends renewal email to account holder', type: 'SEND', answer: 'review', risk: 'External email to customer. Must confirm before sending.' },
    { name: 'get_exception_list()', action: 'Reads open exceptions from worksheet', type: 'READ', answer: 'safe', risk: 'Read-only lookup. Safe.' },
    { name: 'archive_account()', action: 'Marks account as closed in Salesforce', type: 'DELETE', answer: 'block', risk: 'Hard to reverse. Must never fire without multi-step approval.' },
  ];

  type Rating = 'safe' | 'review' | 'block';
  const [picks, setPicks] = useState<Record<number, Rating>>({});
  const [revealed, setRevealed] = useState(false);
  const allPicked = tools.every((_, i) => picks[i]);
  const score = revealed ? tools.filter((t, i) => picks[i] === t.answer).length : 0;

  const ratingColors: Record<Rating, { bg: string; border: string; label: string }> = {
    safe:   { bg: 'rgba(22,163,74,0.12)',  border: '#16A34A', label: 'SAFE' },
    review: { bg: 'rgba(245,158,11,0.12)', border: '#D97706', label: 'REVIEW' },
    block:  { bg: 'rgba(220,38,38,0.1)',   border: '#DC2626', label: 'BLOCK' },
  };

  return (
    <div style={{ background: '#FAFAF9', border: '1px solid #E7E5E4', borderRadius: '12px', padding: '20px 24px' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.14em', color: '#78716C', marginBottom: '4px' }}>MCP PERMISSION AUDIT</div>
      <div style={{ fontSize: '11px', color: '#78716C', marginBottom: '14px' }}>Classify each tool: SAFE (call without approval), REVIEW (human gate), or BLOCK (never callable by AI)?</div>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '14px' }}>
        {tools.map((tool, i) => {
          const pick = picks[i];
          const isRight = revealed && pick === tool.answer;
          const isWrong = revealed && pick && pick !== tool.answer;
          return (
            <div key={i} style={{ padding: '10px 12px', background: isRight ? 'rgba(22,163,74,0.05)' : isWrong ? 'rgba(220,38,38,0.04)' : '#fff', border: `1px solid ${isRight ? 'rgba(22,163,74,0.25)' : isWrong ? 'rgba(220,38,38,0.2)' : '#E7E5E4'}`, borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#B45309', marginBottom: '2px' }}>{tool.name}</div>
                  <div style={{ fontSize: '10px', color: '#57534E', lineHeight: 1.4 }}>{tool.action}</div>
                </div>
                <div style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '8px', fontWeight: 700, background: tool.type === 'READ' ? 'rgba(37,99,235,0.1)' : tool.type === 'WRITE' ? 'rgba(245,158,11,0.1)' : tool.type === 'SEND' ? 'rgba(124,58,237,0.1)' : 'rgba(220,38,38,0.1)', color: tool.type === 'READ' ? '#2563EB' : tool.type === 'WRITE' ? '#D97706' : tool.type === 'SEND' ? '#7C3AED' : '#DC2626', flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" }}>{tool.type}</div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['safe', 'review', 'block'] as Rating[]).map(opt => {
                  const rc = ratingColors[opt];
                  const selected = pick === opt;
                  return (
                    <div key={opt} onClick={() => !revealed && setPicks(p => ({ ...p, [i]: opt }))}
                      style={{ padding: '4px 12px', borderRadius: '5px', fontSize: '9px', fontWeight: 700, cursor: revealed ? 'default' : 'pointer', background: selected ? rc.bg : '#F5F5F4', border: `1px solid ${selected ? rc.border : '#E7E5E4'}`, color: selected ? rc.border : '#9CA3AF', fontFamily: "'JetBrains Mono', monospace" }}>
                      {rc.label}
                    </div>
                  );
                })}
                {revealed && <div style={{ marginLeft: 'auto', fontSize: '9px', color: isRight ? '#16A34A' : '#DC2626', fontStyle: 'italic', alignSelf: 'center' }}>{isRight ? '✓ ' : '✗ '}{isRight ? '' : `→ ${tool.answer.toUpperCase()} · `}{tool.risk}</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {!revealed && <div onClick={() => allPicked && setRevealed(true)} style={{ padding: '7px 16px', background: allPicked ? '#B45309' : 'rgba(180,83,9,0.15)', borderRadius: '6px', fontSize: '11px', color: allPicked ? '#fff' : '#9CA3AF', cursor: allPicked ? 'pointer' : 'not-allowed', fontWeight: 700 }}>Audit</div>}
        {revealed && <div style={{ fontSize: '12px', fontWeight: 700, color: score === 5 ? '#16A34A' : '#F59E0B' }}>{score}/5 correct</div>}
        {revealed && <div onClick={() => { setPicks({}); setRevealed(false); }} style={{ padding: '7px 14px', background: '#F5F5F4', border: '1px solid #E7E5E4', borderRadius: '6px', fontSize: '10px', color: '#78716C', cursor: 'pointer' }}>Reset</div>}
      </div>
    </div>
  );
};

const MCPLogReaderCard = ({ track }: { track: GenAITrack }) => {
  const logs = track === 'tech' ? [
    { time: '14:02:11', tool: 'get_adjuster_load',   status: 200, ms: 82,  calls: 4,  flag: false },
    { time: '14:02:19', tool: 'get_policy_clause',   status: 200, ms: 61,  calls: 340, flag: true, anomaly: 'Called 340× in 60 min — 8× above baseline. Likely a prompt loop.' },
    { time: '14:03:02', tool: 'update_claim_status', status: 403, ms: 12,  calls: 7,  flag: true, anomaly: '403 Forbidden — token may lack write scope or has expired.' },
    { time: '14:03:44', tool: 'get_adjuster_load',   status: 200, ms: 1840, calls: 3, flag: true, anomaly: 'Latency spike: 1840ms vs 82ms normal — HR API may be under load.' },
    { time: '14:04:10', tool: 'send_adjuster_email', status: 200, ms: 210,  calls: 2, flag: false },
  ] : [
    { time: '14:02:11', tool: 'lookup_crm_account',  status: 200, ms: 94,   calls: 5,  flag: false },
    { time: '14:02:19', tool: 'get_renewal_status',  status: 200, ms: 77,   calls: 88, flag: true, anomaly: 'Called 88× in 30 min — probable loop in agent prompt.' },
    { time: '14:03:02', tool: 'update_renewal_date', status: 403, ms: 11,   calls: 4,  flag: true, anomaly: '403 Forbidden — Salesforce credential may have expired or been revoked.' },
    { time: '14:03:44', tool: 'lookup_crm_account',  status: 200, ms: 2200, calls: 6,  flag: true, anomaly: 'Latency 2200ms vs 94ms baseline — Salesforce rate throttle possible.' },
    { time: '14:04:10', tool: 'send_renewal_email',  status: 200, ms: 188,  calls: 3,  flag: false },
  ];

  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const correctFlags = new Set(logs.map((l, i) => l.flag ? i : -1).filter(i => i >= 0));
  const score = revealed ? [...flagged].filter(i => logs[i]?.flag).length - [...flagged].filter(i => !logs[i]?.flag).length : 0;

  return (
    <div style={{ background: '#0D1117', borderRadius: '12px', padding: '20px 24px', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#8B949E', marginBottom: '4px' }}>MCP PRODUCTION LOG READER</div>
      <div style={{ fontSize: '9px', color: '#6B7280', marginBottom: '16px' }}>Flag the entries that need investigation. Click a row to mark it.</div>

      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 50px 60px 50px', gap: '8px', padding: '5px 10px', fontSize: '8px', color: '#6B7280', letterSpacing: '0.1em', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '4px' }}>
          <span>TIME</span><span>TOOL</span><span>STATUS</span><span>LATENCY</span><span>CALLS</span>
        </div>
        {logs.map((log, i) => {
          const isFlagged = flagged.has(i);
          const isCorrect = revealed && log.flag && isFlagged;
          const isMissed = revealed && log.flag && !isFlagged;
          const isFalsePos = revealed && !log.flag && isFlagged;
          return (
            <div key={i} onClick={() => !revealed && setFlagged(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; })}
              style={{ display: 'grid', gridTemplateColumns: '80px 1fr 50px 60px 50px', gap: '8px', padding: '8px 10px', borderRadius: '6px', cursor: revealed ? 'default' : 'pointer', background: isCorrect ? 'rgba(22,163,74,0.08)' : isMissed ? 'rgba(220,38,38,0.06)' : isFalsePos ? 'rgba(220,38,38,0.06)' : isFlagged ? 'rgba(245,158,11,0.07)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isCorrect ? 'rgba(22,163,74,0.2)' : isMissed ? 'rgba(220,38,38,0.2)' : isFalsePos ? 'rgba(220,38,38,0.2)' : isFlagged ? 'rgba(245,158,11,0.25)' : 'transparent'}`, marginBottom: '3px' }}>
              <span style={{ fontSize: '9px', color: '#6B7280' }}>{log.time}</span>
              <div>
                <span style={{ fontSize: '10px', color: isFlagged ? '#FCD34D' : '#C9D1D9' }}>{log.tool}</span>
                {revealed && log.anomaly && <div style={{ fontSize: '8px', color: isCorrect ? '#6EE7B7' : '#FCA5A5', marginTop: '2px', lineHeight: 1.4 }}>{log.anomaly}</div>}
                {revealed && isFalsePos && <div style={{ fontSize: '8px', color: '#FCA5A5', marginTop: '2px' }}>No anomaly — this is within normal range.</div>}
              </div>
              <span style={{ fontSize: '9px', color: log.status === 200 ? '#6EE7B7' : '#FCA5A5', fontWeight: 700 }}>{log.status}</span>
              <span style={{ fontSize: '9px', color: log.ms > 1000 ? '#FCD34D' : '#8B949E' }}>{log.ms}ms</span>
              <span style={{ fontSize: '9px', color: log.calls > 50 ? '#FCA5A5' : '#8B949E', fontWeight: log.calls > 50 ? 700 : 400 }}>{log.calls}×</span>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {!revealed && <div onClick={() => flagged.size > 0 && setRevealed(true)} style={{ padding: '7px 16px', background: flagged.size > 0 ? '#B45309' : 'rgba(180,83,9,0.2)', borderRadius: '6px', fontSize: '10px', color: flagged.size > 0 ? '#fff' : '#9CA3AF', cursor: flagged.size > 0 ? 'pointer' : 'not-allowed', fontWeight: 700 }}>Analyse Logs</div>}
        {revealed && <div style={{ fontSize: '11px', fontWeight: 700, color: score >= 2 ? '#6EE7B7' : '#F59E0B' }}>{[...correctFlags].filter(i => flagged.has(i)).length}/{correctFlags.size} anomalies found</div>}
        {revealed && <div onClick={() => { setFlagged(new Set()); setRevealed(false); }} style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '10px', color: '#9CA3AF', cursor: 'pointer' }}>Reset</div>}
        {!revealed && flagged.size === 0 && <span style={{ fontSize: '9px', color: '#6B7280' }}>Click rows to flag anomalies</span>}
      </div>
    </div>
  );
};

// AirtribeLogo imported from AirtribeBrand.tsx

// ── Main Export ──────────────────────────────────────────────────────────────

type Props = { track: GenAITrack; onBack: () => void };

export default function GenAIPreRead7({ track, onBack }: Props) {
  const store = useLearnerStore();
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const prevXpRef = React.useRef(0);

  useEffect(() => {
    store.initSession();
    CONCEPTS.forEach(c => store.ensureConceptState(c.id));
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.querySelector(`[data-section="${id}"]`);
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection(id);
          const t = setTimeout(() => {
            store.markSectionViewed(id);
            setCompletedSections(prev => new Set([...prev, id]));
          }, 150);
          timers.push(t);
        }
      }, { threshold: 0.25 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => { observers.forEach(o => o.disconnect()); timers.forEach(t => clearTimeout(t)); };
  }, []);

  const progressPct = Math.round((completedSections.size / SECTIONS.length) * 100);
  const trackMeta = track === 'tech'
    ? { label: 'Tech Builder Track', shortLabel: 'Tech', introTitle: 'Model Context Protocol · Builder Lens' }
    : { label: 'Workflow & Operator Track', shortLabel: 'Non-Tech', introTitle: 'Model Context Protocol · Operator Lens' };

  const quizData = QUIZZES.map(q => ({
    conceptId: q.conceptId,
    question: (q.question as Record<string, string>)[track] ?? q.question['tech'],
    options: ((q.options as Record<string, { text: string; correct: boolean; feedback: string }[]>)[track] ?? q.options['tech']),
  }));

  const MENTORS: { name: string; role: string; desc: string; color: string; mentorId: GenAIMentorId }[] = [
    { name: 'Anika',  role: 'AI Workflow Strategist',   desc: 'Asks who owns the failure mode before anyone designs the happy path.',              color: '#7C3AED', mentorId: 'anika' },
    { name: 'Rohan',  role: 'Automation Engineer',       desc: 'Thinks in payloads, retries, and what the system does at 2am.',                    color: '#2563EB', mentorId: 'rohan' },
    { name: 'Leela',  role: 'Risk & Compliance',         desc: 'First to ask what happens to people when the workflow is wrong.',                   color: '#C2410C', mentorId: 'leela' },
    { name: 'Kabir',  role: 'Operations Intelligence',   desc: 'Distinguishes repetitive work from work that is actually ready for AI.',            color: '#0F766E', mentorId: 'kabir' },
  ];

  const protagonist = track === 'tech' ? 'Aarav' : 'Rhea';
  const protagonistRole = track === 'tech' ? 'Platform Engineer · Northstar Health' : 'Operations Lead · Northstar Health';
  const protagonistDesc = track === 'tech'
    ? 'His claims routing agent classifies perfectly. But every time it tries to assign a case to an adjuster, it can\u2019t reach the HR system. The data exists. The bridge doesn\u2019t.'
    : 'Her n8n workflows summarise and classify in seconds. But when her director asks \u2018is Hartwell Group in the CRM?\u2019 the AI can\u2019t answer. The CRM is there. The connection isn\u2019t.';

  return (
    <div className="editorial" style={{ background: 'var(--ed-cream)', minHeight: '100vh' }}>
      {/* Top Nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
              <motion.button whileHover={{ opacity: 0.75 }} whileTap={{ scale: 0.97 }} onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', cursor: 'pointer', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>←</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)', fontFamily: "'JetBrains Mono', monospace" }}>Back</span>
              </motion.button>
              <span style={{ color: 'var(--ed-rule)', fontSize: '18px' }}>|</span>
              <AirtribeLogo />
              <span style={{ color: 'var(--ed-rule)', fontSize: '18px' }}>|</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>GenAI Launchpad</span>
                <span style={{ color: 'var(--ed-rule)', fontSize: '12px' }}>›</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink2)' }}>{trackMeta.introTitle}</span>
              </div>
            </div>
            <div style={{ flex: 1, maxWidth: '240px', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 24px' }}>
              <div style={{ flex: 1, height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: ACCENT, borderRadius: '2px' }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: ACCENT, flexShrink: 0 }}>{progressPct}%</span>
            </div>
            <DarkModeToggle />
          </motion.div>
        </div>
      </div>

      {/* 3-column grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px minmax(0,1fr) 240px', gap: '40px', alignItems: 'start', paddingTop: '36px' }}>
          <div style={{ alignSelf: 'stretch' }}>
            <LeftNav completedSections={completedSections} activeSection={activeSection} />
          </div>

          <motion.main initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} style={{ minWidth: 0 }}>

            {/* ── Module Hero (inside grid) ── */}
            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', marginBottom: '28px' }}>
              <div style={{ flex: 1, minWidth: 0, background: 'var(--ed-cream)', borderRadius: '14px', padding: '36px 36px 28px', position: 'relative', overflow: 'hidden' }}>
                <div aria-hidden="true" style={{ position: 'absolute', right: '-12px', top: '-8px', fontSize: '140px', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.05)`, fontFamily: "'Lora','Georgia',serif", letterSpacing: '-0.04em', userSelect: 'none' as const, pointerEvents: 'none' as const }}>07</div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '10px', textTransform: 'uppercase' as const }}>
                    GenAI Launchpad · Pre-Read 07
                  </div>
                  <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.025em', color: 'var(--ed-ink)', marginBottom: '10px', fontFamily: "'Lora', Georgia, serif" }}>
                    Model Context Protocol
                  </h1>
                  <p style={{ fontSize: '15px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora', Georgia, serif", marginBottom: '28px' }}>
                    &ldquo;Before you expose a tool to a model, understand what the model will do when it calls it.&rdquo;
                  </p>
                  {/* Characters */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const, marginBottom: '24px' }}>
                    <div style={{ width: '108px', flexShrink: 0, padding: '16px 10px 14px', borderRadius: '20px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
                      <div style={{ borderRadius: '14px', overflow: 'hidden', flexShrink: 0 }}>
                        {track === 'tech' ? <AaravFace size={52} /> : <RheaFace size={52} />}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: ACCENT, lineHeight: 1.2 }}>{protagonist}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'var(--ed-ink3)', lineHeight: 1.4 }}>{protagonistRole}</div>
                    </div>
                    {MENTORS.map(m => (
                      <div key={m.name} style={{ width: '108px', flexShrink: 0, padding: '16px 10px 14px', borderRadius: '20px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
                        <div style={{ borderRadius: '14px', overflow: 'hidden', flexShrink: 0 }}>
                          <GenAIMentorFace mentor={m.mentorId} size={52} />
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: m.color, lineHeight: 1.2 }}>{m.name}</div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'var(--ed-ink3)', lineHeight: 1.4 }}>{m.role}</div>
                      </div>
                    ))}
                  </div>
                  {/* Learning objectives */}
                  <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '16px 20px', border: '1px solid var(--ed-rule)', borderLeft: `3px solid ${ACCENT}` }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '10px', textTransform: 'uppercase' as const }}>Learning Objectives</div>
                    {[
                      'Understand the last-mile gap — why capable models still can\u2019t reach live systems on their own',
                      'Read an MCP tool schema and know exactly which part controls when it fires',
                      'Scope tool permissions using the principle of least privilege',
                      'Monitor production tool call logs to catch volume anomalies, auth failures, and latency drift',
                    ].map((obj, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 3 ? '8px' : 0, alignItems: 'flex-start' }}>
                        <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", marginTop: '2px' }}>0{i + 1}</span>
                        <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          {/* ── Section 1: The Last-Mile Problem ── */}
          <ChapterSection id="genai-m7-lastmile" num="01" accentRgb={ACCENT_RGB} first>
            {para(track === 'tech'
              ? "In Pre-Read 06, Aarav built an agent that classifies claims, reasons through policy lookups, and drafts resolution responses using the ReAct loop. The agent runs well on the data it has. This pre-read is about the gap it keeps hitting: tasks that require live data from systems the model has no bridge to."
              : "In Pre-Read 06, Rhea's n8n agent can answer fixed questions from data she pre-loads into the workflow, and uses tool-call nodes to call a handful of configured integrations. This pre-read is about the question her director keeps asking — one that requires the AI to query a live system it has no connection to."
            )}
            <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '\u25ce Aarav\u2019s Situation' : '\u25ce Rhea\u2019s Situation'}>
              {track === 'tech'
                ? "Aarav's agent correctly classifies incoming claims by category. But every time it tries to suggest routing — which adjuster to assign — it outputs: 'I don\u2019t have access to adjuster workload data.' The HR system exists. The API exists. The model just has no way to reach it."
                : "Rhea's director asks her to build an AI assistant that can answer: 'Is Hartwell Group in our CRM and when is their renewal?' The AI can summarise data Rhea pastes in. But it cannot look up a live CRM record. The CRM is there. The connection isn't."}
            </SituationCard>
            {h2(<>The Last-Mile Problem</>)}
            {para(<>A language model can reason about any information placed in its context window. What it cannot do — by itself — is reach outside that window to fetch live data from an external system. This is the last-mile problem: the model is capable, the data exists, but there is no bridge between them. Plugging in a URL or pasting an API response into the prompt works for one request. It does not scale. The solution is a structured protocol for giving models access to external tools.</>)}
            <GenAIConversationScene
              mentor="anika"
              track={track}
              accent={ACCENT}
              techLines={[
                { speaker: 'protagonist', text: "The agent routes correctly when I paste the adjuster list into the prompt. Can I just do that in production?" },
                { speaker: 'mentor', text: "You could. But adjuster load changes every hour. You'd need a pipeline that fetches the list, refreshes it, and injects it into every prompt. That's a fragile pre-step — and it sends data the model doesn't need for most requests." },
                { speaker: 'protagonist', text: "So a tool that the model calls only when it actually needs the workload data?" },
                { speaker: 'mentor', text: "Exactly. The model sees a tool description, decides to call it, sends the query, gets back exactly the data it needs, and uses it to route. No pre-fetching. No prompt stuffing. The tool runs on demand." },
                { speaker: 'protagonist', text: "How does the model know when to call the tool vs. answer from context?" },
                { speaker: 'mentor', text: "That's what the tool description controls. Write it precisely. We'll cover that in the next section." },
              ]}
              nonTechLines={[
                { speaker: 'protagonist', text: "Can I paste the CRM export into the AI every morning so it always knows the latest accounts?" },
                { speaker: 'mentor', text: "You could, but a weekly export would be stale by Tuesday. And if your CRM has thousands of accounts, you're hitting context limits and sending data that's irrelevant to most questions." },
                { speaker: 'protagonist', text: "So the AI should look up just the account it needs, when it needs it?" },
                { speaker: 'mentor', text: "That's the idea. An MCP tool is a lookup the AI can call at runtime — not a pre-loaded data dump. n8n's Agent node can call these tools when the question calls for live data." },
                { speaker: 'protagonist', text: "Does it always call the CRM tool, or only when the question is about an account?" },
                { speaker: 'mentor', text: "Only when the question calls for it — and the tool description is what tells it when that is. We'll write one in the next section." },
              ]}
            />
            {keyBox('Core Concepts', [
              'Last-mile gap — the model can reason about data in its context, but has no built-in mechanism to fetch live data from external systems. The gap sits between model capability and enterprise data.',
              'Tool call vs. prompt injection — pre-loading data into every prompt is fragile, stale, and token-wasteful. A tool call fetches exactly the data needed, at the moment it is needed, triggered by the model\u2019s own reasoning.',
              'MCP (Model Context Protocol) — a standard protocol for defining tools that AI models can call. Each tool has a name, a description, and an input schema. The model reads the description and decides when to call the tool.',
              'On-demand access — tools are not called on every prompt. The model evaluates whether it needs external data to answer, then calls the relevant tool. Most prompts don\u2019t trigger any tool call.',
            ], ACCENT)}
            {pullQuote("The model isn\u2019t broken when it says it can\u2019t access live data. It\u2019s telling you exactly what\u2019s missing: a bridge.")}
            <GenAIAvatar
              name="Anika"
              nameColor={ACCENT}
              borderColor={ACCENT}
              content={<>The instinct to pre-load all relevant data into the prompt is understandable but doesn&apos;t hold in production. Data changes. Context windows overflow. The model reasons about what it has, not what it should have. The correct architecture is: give the model tools, and let it pull data when it needs it.</>}
              expandedContent={<>MCP emerged from Anthropic in late 2024 as a response to the fragmentation problem: every team was wiring their own custom tool-calling format. MCP provides a single standard that is model-agnostic, composable, and auditable. Tools built to MCP spec work with Claude, GPT, and any model that supports the protocol &mdash; without rewiring.</>}
              question={(quizData[0].question)}
              options={quizData[0].options}
              conceptId="genai-m7-lastmile"
            />
            <TiltCard style={{ margin: '28px 0' }}><MCPVsApiCompareCard track={track} /></TiltCard>
            <ApplyItBox prompt={track === 'tech'
              ? "List 3 questions your users ask that your current AI cannot answer because it lacks live data. For each: name the system that holds the answer (HR, CRM, claims DB). These are your first MCP tool candidates."
              : "List 3 questions your director or team asks that your n8n AI workflows can't currently answer. For each: which system holds that data? That list is your MCP tool roadmap."} />
          </ChapterSection>

          {/* ── Section 2: What MCP Actually Is ── */}
          <ChapterSection id="genai-m7-anatomy" num="02" accentRgb={ACCENT_RGB}>
            <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '\u25ce Aarav\u2019s Situation' : '\u25ce Rhea\u2019s Situation'}>
              {track === 'tech'
                ? "Aarav registers his first MCP tool: get_adjuster_load. The model calls it — but it calls it on every single message, whether the question is about routing or not. Even a simple 'what day is it?' triggers the adjuster workload lookup. He traces the problem to one field."
                : "Rhea sets up her first tool node in the n8n Agent and links it to a Salesforce HTTP request. The AI calls it on every message — even for questions about exception summaries that have nothing to do with accounts. She looks at the Description field she left as 'Gets account data.'"}
            </SituationCard>
            {h2(<>The Three Parts of an MCP Tool</>)}
            {para(<>Every MCP tool has three required elements. The name is an identifier — it is how the model refers to the tool in its reasoning. The input schema is a JSON Schema definition of what the tool accepts — field names, types, which are required. The description is the instruction: it tells the model when to call the tool and, critically, when not to. A missing or vague description is not a gap in documentation — it is a broken instruction that causes the model to mis-call, over-call, or under-call the tool.</>)}
            <GenAIConversationScene
              mentor="rohan"
              track={track}
              accent="#2563EB"
              techLines={[
                { speaker: 'protagonist', text: "The description just says 'Gets adjuster workload from HR.' Is that not enough?" },
                { speaker: 'mentor', text: "It describes what the tool does. It says nothing about when to call it. The model sees a useful-sounding tool and calls it for every request that could plausibly involve people." },
                { speaker: 'protagonist', text: "So I need to tell it when NOT to call it?" },
                { speaker: 'mentor', text: "Both directions. When: 'Call this when the user asks about adjuster availability, caseload, or routing.' When not: 'Do not call for policy questions, claim status, or requests where no routing decision is needed.'" },
                { speaker: 'protagonist', text: "That's just one sentence each." },
                { speaker: 'mentor', text: "Yes. One sentence per direction is usually enough. It gives the model a decision boundary, not just a definition." },
              ]}
              nonTechLines={[
                { speaker: 'protagonist', text: "'Gets account data' — I thought that was clear." },
                { speaker: 'mentor', text: "It describes what the node returns. It doesn't say when the AI should call it. So the AI treats it as a general-purpose lookup and fires it for every question." },
                { speaker: 'protagonist', text: "What should I write instead?" },
                { speaker: 'mentor', text: "Something like: 'Call this when the user asks about a specific account by name or ID. Do not call for general trend questions, exception summaries, or when account data is already in context.'" },
                { speaker: 'protagonist', text: "So the description is really the decision rule?" },
                { speaker: 'mentor', text: "Exactly. Think of it as a routing condition written in plain English. The AI reads it to decide whether this tool is relevant right now." },
              ]}
            />
            {keyBox('Core Concepts', [
              'Tool name — unique identifier used in tool call payloads. Convention: snake_case verb_noun (e.g. get_adjuster_load, update_claim_status). The name appears in logs — make it readable.',
              'Tool description — the decision rule. Must include: what the tool does, when to call it, and when NOT to call it. A vague description is a broken instruction. Write it like a routing condition, not a marketing line.',
              'Input schema — JSON Schema definition of tool parameters. Field names, types (string/number/boolean), which are required vs. optional. The model uses this to construct the correct call payload.',
              'Over-call vs. under-call — over-call: vague description causes the tool to fire when irrelevant (wastes tokens, may cause side effects). Under-call: description is too restrictive and the tool never fires when needed. Both are description bugs.',
            ], '#2563EB')}
            {pullQuote("A tool description isn\u2019t documentation. It\u2019s a routing condition the model evaluates every time it reads your prompt.")}
            <GenAIAvatar
              name="Rohan"
              nameColor="#2563EB"
              borderColor="#2563EB"
              content={<>Test tool descriptions in isolation before wiring them to live systems. Give the model a prompt where the tool should NOT fire — a question about something unrelated. If it fires anyway, the description is missing a constraint. Fix the description, not the prompt.</>}
              expandedContent={<>The input schema is as important as the description. If you mark a field as optional but the tool\u2019s backend actually requires it, the agent will generate calls that fail at runtime. Define the schema from the tool&apos;s real behavior — not from what you hope the model will infer. Required fields that the model can derive should still be marked required in the schema.</>}
              question={quizData[1].question}
              options={quizData[1].options}
              conceptId="genai-m7-anatomy"
            />
            <TiltCard style={{ margin: '28px 0' }}><MCPToolSchemaBuilderCard track={track} /></TiltCard>
            <ApplyItBox prompt={track === 'tech'
              ? "Take one of your MCP tool candidates from Section 1. Write its description: one sentence for when to call it, one sentence for when NOT to call it. Then write the input schema: what parameter(s) does it take, and which are required?"
              : "Pick one of your data-lookup candidates from Section 1. In the n8n tool node Description field, write: 'Call this when [specific condition]. Do not call when [counterexample].' Test it with a question that should NOT trigger the tool. Does it fire?"} />
          </ChapterSection>

          {/* ── Section 3: Your First MCP Tool ── */}
          <ChapterSection id="genai-m7-build" num="03" accentRgb={ACCENT_RGB}>
            <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '\u25ce Aarav\u2019s Situation' : '\u25ce Rhea\u2019s Situation'}>
              {track === 'tech'
                ? "Aarav writes the tool description, adds the input schema, and deploys his first MCP server. The model calls it correctly. But the tool returns the full HR employee record — 40 fields — and the agent only uses 3: adjuster_id, cases_open, and available_capacity. The other 37 fields are burning tokens on every call."
                : "Rhea's Salesforce lookup tool now fires correctly — only when account-specific questions arrive. But the tool returns the full Salesforce account object: 60 fields. The AI uses account_status, renewal_date, and owner_name. She needs to understand what to do with the other 57 fields."}
            </SituationCard>
            {h2(<>Build Small, Return Less</>)}
            {para(<>When building your first MCP tool, two things matter more than anything else: call it with the minimum input the backend needs, and return only the fields the model will actually use. Every unused field in a tool response is a wasted token — and in a ReAct loop that may run 5-10 iterations, token waste compounds. The discipline of lean tool responses is not premature optimization: it is the difference between a tool that runs cleanly and one that slowly inflates cost and degrades model reasoning as the context fills.</>)}
            <GenAIConversationScene
              mentor="kabir"
              track={track}
              accent="#0891B2"
              techLines={[
                { speaker: 'protagonist', text: "The tool returns the full HR record. Should I filter server-side or client-side?" },
                { speaker: 'mentor', text: "Server-side. The MCP server should return exactly what the agent needs — not the full object it fetches from HR. Create a response model with just the 3 fields and serialize only those." },
                { speaker: 'protagonist', text: "Is that an MCP requirement or a best practice?" },
                { speaker: 'mentor', text: "Best practice, but one with a real consequence: a 40-field response in a 6-step ReAct loop can add 2,000+ tokens per run. At scale, that's measurable cost and slower reasoning." },
                { speaker: 'protagonist', text: "What if someone later needs field 4?" },
                { speaker: 'mentor', text: "Add it when that need arrives. Tools evolve. Start lean — you can always add fields. Removing them later breaks callers." },
              ]}
              nonTechLines={[
                { speaker: 'protagonist', text: "Should I filter the Salesforce response in n8n before it reaches the AI?" },
                { speaker: 'mentor', text: "Yes. Add a Set node after the HTTP Request — pick exactly the 3 fields the AI needs and discard the rest. The AI gets a clean, focused payload." },
                { speaker: 'protagonist', text: "Does it matter that much? It's just a few extra fields." },
                { speaker: 'mentor', text: "Each field adds tokens. In a workflow that runs 50 times a day with 5 tool calls each, a 60-field response vs. a 3-field response can be the difference between a $12/month workflow and a $120/month one." },
                { speaker: 'protagonist', text: "How do I know which fields to keep?" },
                { speaker: 'mentor', text: "Ask: what does the AI need to form its answer? Keep those. Delete everything else. You can always add back fields when a new question type needs them." },
              ]}
            />
            {keyBox('Core Concepts', [
              'Lean tool response — return only the fields the model will use. Every extra field costs tokens and dilutes the context the model reasons from. Define a response model that selects exactly what the tool\u2019s callers need.',
              'Tool server anatomy (tech) — an MCP server exposes tool definitions via a manifest endpoint and handles tool call requests. A minimal Python implementation uses FastAPI or a dedicated MCP framework with @tool decorators.',
              'n8n tool node anatomy (non-tech) — HTTP Request node connected to the AI Agent as a tool. The node URL, headers, and body are configured as the tool\u2019s action. A Set node downstream filters the response to only the fields needed.',
              'Tool versioning — once a tool is in production with a callers using it, changing its name or required fields breaks those callers. Add new fields safely; deprecate old fields with a version flag before removing.',
            ], '#0891B2')}
            {pullQuote("Start with the 3 fields the model actually uses. You can add the 4th when someone asks for it. You can\u2019t unbloom a context window.")}
            <GenAIAvatar
              name="Kabir"
              nameColor="#0891B2"
              borderColor="#0891B2"
              content={<>The most common first-tool mistake isn&apos;t bad schemas or vague descriptions &mdash; it&apos;s returning the full upstream API response verbatim. Every upstream system has fields that are useful to humans or other systems but irrelevant to an AI reasoning about a specific question. Your MCP tool is an adapter: it calls upstream, filters, and returns a purposeful subset.</>}
              expandedContent={<>When you build your tool server, consider adding a test harness that calls every registered tool with a sample input and validates the response shape before deployment. MCP tools are backend services &mdash; they should be tested like backend services, not debugged through the agent in production.</>}
              question={quizData[2].question}
              options={quizData[2].options}
              conceptId="genai-m7-build"
            />
            <TiltCard style={{ margin: '28px 0' }}><MCPFlowStepperCard track={track} /></TiltCard>
            <ApplyItBox prompt={track === 'tech'
              ? "Build the stub for get_adjuster_load(): define the input schema (department: string), write the description (when + when-not), and define the response model with only the 3 fields: adjuster_id, cases_open, available_capacity. Do not connect it to HR yet — just get the shape right."
              : "In n8n, set up the Salesforce HTTP Request tool node. After the request, add a Set node that outputs only: account_id, account_status, renewal_date, owner_name. Test it with a sample account name. Confirm the AI receives only 4 fields."} />
          </ChapterSection>

          {/* ── Section 4: Scope, Trust & Permissions ── */}
          <ChapterSection id="genai-m7-permissions" num="04" accentRgb={ACCENT_RGB}>
            <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '\u25ce Aarav\u2019s Situation' : '\u25ce Rhea\u2019s Situation'}>
              {track === 'tech'
                ? "Aarav demos the routing agent to a manager. The manager asks: 'Can it look up any employee, or just adjusters?' Aarav checks his MCP server — the API key it uses has full HR access. The tool accepts any adjuster_id. Including one that starts with 'EXEC-'. He realizes the scope is wider than intended."
                : "Rhea's tool is working. Her director asks: 'Can this AI update a renewal date if it decides one needs changing?' Rhea checks the Salesforce credential — it has read and write access. Her current tool only reads. But nothing stops someone from adding a write action later with the same key."}
            </SituationCard>
            {h2(<>Scope Your Tools, Not Just Your Prompts</>)}
            {para(<>The description you write tells the model when to call a tool. But the model\u2019s decision is not the security boundary. A confused model, a prompt injection, or a future agent change can still call a tool even when the description says not to. Real permission control lives in three places: the server-side input validation that rejects malformed or out-of-scope calls, the scoped credential that limits what the tool can do even if called, and — for write actions — the human-in-the-loop gate that requires explicit approval before any modification. Description-based constraints are useful; they are not sufficient.</>)}
            <GenAIConversationScene
              mentor="leela"
              track={track}
              accent="#059669"
              techLines={[
                { speaker: 'protagonist', text: "I'll add a check in the tool description: 'Only call for adjuster IDs, not executive IDs.'" },
                { speaker: 'mentor', text: "That\u2019s a good first step but not the security boundary. Prompt-based constraints can be bypassed by prompt injection. The server needs to validate the adjuster_id format before calling HR." },
                { speaker: 'protagonist', text: "So server-side validation: reject any ID that doesn't match the ADJ-XX pattern?" },
                { speaker: 'mentor', text: "Yes. And scope the API key to only the HR endpoint that serves adjuster caseload — not the full HR data API. Defense in depth: the model only calls when appropriate, the server validates input, the key only works for one endpoint." },
                { speaker: 'protagonist', text: "What about write tools?" },
                { speaker: 'mentor', text: "Write tools need a human gate. The model generates the action. A human approves or rejects it. The tool only executes after approval. Never let AI write directly to production records without a gate." },
              ]}
              nonTechLines={[
                { speaker: 'protagonist', text: "Should I just give the AI a read-only Salesforce credential?" },
                { speaker: 'mentor', text: "For read tools, yes — a read-only credential is the right scope. For any tool that could write, you also need a human approval node before the action fires." },
                { speaker: 'protagonist', text: "If the credential is read-only, doesn't that prevent write actions automatically?" },
                { speaker: 'mentor', text: "It prevents accidental writes from the current tool. But when you or someone else adds a write tool later and reuses the same credential — which happens — the scope was already too wide. Credential scope should match tool purpose exactly." },
                { speaker: 'protagonist', text: "One credential per tool intent?" },
                { speaker: 'mentor', text: "Or at least: one read-only credential for lookup tools, one write-scoped credential for update tools, and a human approval node before any write tool can execute. Three layers: scope, validate, approve." },
              ]}
            />
            {keyBox('Core Concepts', [
              'Principle of least privilege — each tool should use a credential scoped to exactly what it needs: read-only for lookups, write-scoped for updates. Overly broad credentials turn bugs into incidents.',
              'Server-side input validation — the MCP server validates all inputs before calling downstream systems. Never trust the model\u2019s output as safe input. Check types, ranges, and patterns on the server side.',
              'Human-in-the-loop for write actions — any tool that modifies production data (update, create, delete) should require human approval before executing. The model proposes; the human confirms.',
              'Prompt constraints vs. security controls — description-based constraints guide the model. Server-side validation and credential scope enforce security. Both are needed; neither replaces the other.',
            ], '#059669')}
            {pullQuote("The model\u2019s decision to call a tool is not a security boundary. Validation is. Credential scope is. The approval gate is.")}
            <GenAIAvatar
              name="Leela"
              nameColor="#059669"
              borderColor="#059669"
              content={<>The most common permission mistake is treating tool descriptions as access controls. They aren&apos;t. A vague prompt injection can tell the model the description rules don&apos;t apply. The server doesn&apos;t know about that — it just receives a call. Server-side validation is what the injected prompt can&apos;t override.</>}
              expandedContent={<>Audit your tool permissions before going to production using the three questions: Can this tool be called with inputs it wasn&apos;t designed for? Can the credential it uses do more than the tool needs? If this tool fires unexpectedly, what is the worst-case impact? The answers reveal where your security controls are thin.</>}
              question={quizData[3].question}
              options={quizData[3].options}
              conceptId="genai-m7-permissions"
            />
            <TiltCard style={{ margin: '28px 0' }}><MCPPermissionAuditCard track={track} /></TiltCard>
            <ApplyItBox prompt={track === 'tech'
              ? "Audit your planned MCP tools using the 3-question test: (1) Can it be called with out-of-scope inputs? (2) Is the credential scoped to only what the tool needs? (3) For any write tool — is there a human gate? Fix the first gap you find."
              : "Go to your n8n credential vault. For each tool credential: is it read-only or read-write? If it\u2019s read-write, does it belong to a tool that only reads? Create a read-only credential variant for every read-only tool you have."} />
          </ChapterSection>

          {/* ── Section 5: MCP in Production ── */}
          <ChapterSection id="genai-m7-production" num="05" accentRgb={ACCENT_RGB}>
            <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '\u25ce Aarav\u2019s Situation' : '\u25ce Rhea\u2019s Situation'}>
              {track === 'tech'
                ? "Aarav\u2019s MCP server has been live for 3 days. He opens the tool call logs and sees get_policy_clause called 340 times in the last hour. Normal is around 40. The other tools are at baseline. No alerts fired. He wasn\u2019t looking."
                : "Rhea\u2019s Salesforce lookup has been live for a week. A colleague says the AI stopped answering CRM questions correctly this afternoon. Rhea checks the n8n execution log for the first time. Every tool call since 14:03 shows a 403 Forbidden error."}
            </SituationCard>
            {h2(<>Read Your Logs Before Your Users Do</>)}
            {para(<>A tool running in production is a service, and services need to be monitored. The three signals that matter for MCP tools are call frequency (is a tool being called more or less than expected?), status codes (are calls succeeding, or are credentials failing?), and latency (is a downstream system slowing down?). None of these show up in user complaints until the damage is done. Building the habit of reading tool call logs — before users report problems — is the difference between proactive ops and reactive firefighting.</>)}
            <GenAIConversationScene
              mentor="anika"
              track={track}
              accent={ACCENT}
              techLines={[
                { speaker: 'protagonist', text: "340 calls in an hour for get_policy_clause. The tool itself is working — all 200s, normal latency. What causes a spike like this?" },
                { speaker: 'mentor', text: "Usually a loop. Either the agent\u2019s stopping condition isn\u2019t working, or a new workflow is calling the agent in a tight loop. Check the tool call inputs — are they all identical? Identical inputs to the same tool is a classic loop signature." },
                { speaker: 'protagonist', text: "They are. All the same policy query, repeating." },
                { speaker: 'mentor', text: "Find the caller. Something is triggering the agent with the same input repeatedly. Could be a webhook firing on every DB row change, a UI retry loop, or a scheduled job that should run hourly but is running every minute." },
                { speaker: 'protagonist', text: "Should I have an alert for this?" },
                { speaker: 'mentor', text: "Yes. Tool call volume 3x above the 7-day average is your first alert. Add it now while the loop is fresh in your mind." },
              ]}
              nonTechLines={[
                { speaker: 'protagonist', text: "403 errors since 14:03. How do I know if it\u2019s the credential or Salesforce?" },
                { speaker: 'mentor', text: "403 Forbidden almost always means the server understood the request but refused it — which is an access issue, not a network issue. First check: when did your Salesforce credential last refresh? OAuth tokens typically expire." },
                { speaker: 'protagonist', text: "My token was set to expire monthly. I set it up 31 days ago." },
                { speaker: 'mentor', text: "There it is. Refresh the token in the n8n credential vault and re-test the tool. For future workflows, set a calendar reminder to refresh OAuth credentials before expiry — or enable auto-refresh if Salesforce allows it." },
                { speaker: 'protagonist', text: "How would I have caught this before my colleague noticed?" },
                { speaker: 'mentor', text: "Check your execution log every morning — takes 2 minutes. Look for any tool with a non-200 status code. A 403 on day one would have been caught before users noticed." },
              ]}
            />
            {keyBox('Core Concepts', [
              'Tool call logs — every tool call should be logged with: timestamp, tool name, input hash, response status, latency, and caller ID. These logs are the primary diagnostic surface for MCP issues.',
              'Volume anomalies — a tool called significantly more than baseline usually means a loop, a misconfigured trigger, or a new upstream caller. Volume spikes that don\u2019t appear in error logs are the hardest to catch without monitoring.',
              'Status code patterns — 200 = success; 403 = auth/permission failure (check credentials); 429 = rate limit (check call frequency); 500 = server error (check the tool\u2019s upstream). Each code has a different first-response action.',
              'Latency baselines — establish normal latency for each tool in the first week. A 3× latency increase on a healthy endpoint often signals upstream API load, database contention, or an MCP server resource limit.',
            ], '#7C3AED')}
            {pullQuote("The failure you catch in logs on day 3 is the incident you prevent on day 10.")}
            <GenAIAvatar
              name="Anika"
              nameColor={ACCENT}
              borderColor={ACCENT}
              content={<>Monitoring tools is not optional. An MCP server with no observability is a black box that only reveals problems through user complaints. Instrument every tool call — volume, latency, status code, and caller — from day one. Logs you don&apos;t write become evidence you don&apos;t have.</>}
              expandedContent={<>For teams running multiple MCP tools, consider a central tool call dashboard that shows each tool&apos;s daily call count, p95 latency, and error rate alongside a 7-day sparkline. The pattern recognition that catches loops and auth failures comes from seeing relative change, not absolute numbers. A tool called 40 times at 200ms is fine. That same tool called 400 times at 1800ms is two different incidents hiding as one number.</>}
              question={quizData[4].question}
              options={quizData[4].options}
              conceptId="genai-m7-production"
            />
            <TiltCard style={{ margin: '28px 0' }}><MCPLogReaderCard track={track} /></TiltCard>
            <ApplyItBox prompt={track === 'tech'
              ? "Before deploying your MCP tool: define the 3 monitoring signals you will check (volume, latency, error rate) and the threshold that would trigger investigation for each. Write them into a comment in the server code so the next person who touches it knows the baselines."
              : "After your Salesforce tool is live for 3 days, open the n8n execution log. Find the tool\u2019s entries. Note: how many calls? Any non-200 status codes? Any latency above 2 seconds? These three numbers are your production baseline."} />
            <NextChapterTeaser text={track === 'tech'
              ? "Pre-Read 08 is about a harder problem: the agent is running and calling tools correctly — but you don't know if the answers it's producing are actually good. Evaluation is the discipline of measuring that, systematically."
              : "Pre-Read 08 covers the question Rhea's director will eventually ask: 'How do we know the AI is actually right?' Her workflows are producing outputs. Pre-Read 08 is about building the system that tells you which ones to trust."} />
          </ChapterSection>

          </motion.main>

          <div style={{ alignSelf: 'stretch' }}>
            <Sidebar completedSections={completedSections} progressPct={progressPct} prevXp={prevXpRef.current} />
          </div>
        </div>
      </div>
    </div>
  );
}

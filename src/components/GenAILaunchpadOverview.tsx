'use client';

import { motion } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import type { GenAITrack } from './genaiTypes';
import { AirtribeLogo } from './AirtribeBrand';

// ─── Curriculum data — mirrors the published Builder / Engineer PDFs ──────
// Phase-grouped modules. Each module has: youllLearn bullets · optional
// framework · tools list · "what you'll be able to do" outcome. preReadNum
// (when set) maps the module to one of the existing PR1-PR7 components.

type ModuleCard = {
  num: string;
  label: string;
  youllLearn: string[];
  framework?: { name: string; desc: string };
  tools: string[];
  outcome: string;
  accent: string;
  preReadNum?: string;
};
type Phase = { name: string; subtitle?: string; modules: ModuleCard[] };

// Phase 1 — shared Foundations (M1-M3) across both tracks
const FOUNDATIONS_PHASE = (accent: string): Phase => ({
  name: 'Phase 1 · AI Foundations',
  modules: [
    {
      num: '01',
      label: 'AI Fluency & Prompting',
      youllLearn: [
        'How LLMs actually work: tokens, context windows, temperature, the mental model that changes how you prompt',
        'The model landscape: when to use GPT, Claude, or Gemini (and what it costs)',
        'The TCREF Framework, the prompting system behind reliable, repeatable AI output',
        'Advanced techniques: zero-shot, few-shot, chain-of-thought, meta-prompting',
        'How to avoid hallucinations and use AI responsibly at work',
      ],
      framework: { name: 'Framework', desc: 'A structured prompting system to get reliable, repeatable output from any AI model.' },
      tools: ['ChatGPT', 'Claude', 'Gemini', 'Google AI Studio', 'OpenAI Playground'],
      outcome: "You'll be able to choose the right AI model for any task, write prompts that get consistent results every time, and diagnose exactly why AI fails when it does.",
      accent,
      preReadNum: '01',
    },
    {
      num: '02',
      label: 'AI Workflows & Productivity',
      youllLearn: [
        'AI for research: turn 10 tabs of information into one sharp brief',
        'AI for writing and presentations: from rough notes to polished deliverables in minutes',
        'AI for meetings: auto-summaries, action items, follow-up drafts',
        'How to connect AI to the tools you already use: Gmail, Calendar, Drive, Slack',
        'Build your own Custom GPT / Claude Project / Gemini Gem for your most repeated work',
      ],
      tools: ['NotebookLM', 'Chronicle', 'Wispr Flow', 'ElevenLabs', 'Claude', 'Gemini', 'ChatGPT'],
      outcome: "You'll be able to complete in 30 minutes what used to take 2+ hours, with a live automated workflow running without you.",
      accent,
      preReadNum: '02',
    },
    {
      num: '03',
      label: 'AI Agents & Track Selection',
      youllLearn: [
        'What an AI agent actually is, and when to use one vs a workflow vs a prompt',
        'The full automation spectrum: no-code to low-code to code, same outcome, different depth',
        'Watch one automation built three ways, live',
        'Hear from past cohort builders: what they shipped, what they learned',
        "See what's possible with AI image, voice, and video",
      ],
      framework: { name: 'Framework', desc: 'A decision framework to know exactly when to use a prompt, a workflow, or a full AI agent.' },
      tools: ['ChatGPT', 'Claude', 'n8n (demo)', 'Replit (demo)', 'Midjourney', 'ElevenLabs', 'RunwayML'],
      outcome: "You'll be able to ship your first AI agent and choose the right track for your goals with full confidence.",
      accent,
      preReadNum: '03',
    },
  ],
});

// Builder Track — 14 modules, 4 phases
const BUILDER_CURRICULUM: Phase[] = [
  FOUNDATIONS_PHASE('#0F766E'),
  {
    name: 'Phase 2 · Automation Mastery',
    modules: [
      {
        num: '04',
        label: 'Workflow Automation with n8n',
        youllLearn: [
          'How to identify which tasks are actually worth automating, and calculate the ROI',
          'n8n fundamentals: nodes, triggers, connections, credentials',
          'Multi-step workflows with AI reasoning built in',
          'Error handling, retries, and human approval gates',
        ],
        framework: { name: 'Framework', desc: 'A prioritization system to identify which tasks are worth automating and calculate the ROI before building anything.' },
        tools: ['n8n', 'OpenAI API', 'Claude API'],
        outcome: "You'll be able to build production-ready automations from scratch: a lead qualification bot, a content approval pipeline, and a data enrichment workflow.",
        accent: '#0F766E',
        preReadNum: '04',
      },
      {
        num: '05',
        label: 'AI Agents for Business',
        youllLearn: [
          "Agents that don't just answer questions, they take action (email, CRM updates, Slack alerts)",
          'How to give agents memory so they learn from past interactions',
          'Multi-step agents that plan, execute, and verify their own work',
          'Voice agents for lead qualification and customer support, no code required',
        ],
        framework: { name: 'Framework', desc: 'A framework to decide how much autonomy to give each agent, from AI-assisted to fully autonomous.' },
        tools: ['n8n', 'Zapier', 'Make.com', 'Claude API', 'OpenAI API', 'MCP', 'Vapi'],
        outcome: "You'll be able to deploy a live agent monitoring real data and taking action, and a voice agent handling inbound queries autonomously.",
        accent: '#0F766E',
        preReadNum: '05',
      },
      {
        num: '06',
        label: 'Data Analysis with AI',
        youllLearn: [
          'Ask questions of your data in plain English, no SQL required',
          'Upload a CSV and get charts, trends, and anomalies in minutes',
          "Build AI-powered dashboards and reports your team will actually use",
          'Go from raw data to a clear "so what" every time',
        ],
        framework: { name: 'Framework', desc: 'A structured analysis approach: question to hypothesis to data to insight to action, every time.' },
        tools: ['ChatGPT', 'Claude', 'Excel', 'Python', 'SQL'],
        outcome: "You'll be able to deliver a complete data analysis: hypothesis to insight, in 20 minutes flat.",
        accent: '#0F766E',
      },
    ],
  },
  {
    name: 'Phase 3 · Product Building',
    modules: [
      {
        num: '07',
        label: 'Tech for Builders',
        youllLearn: [
          'How web apps work: frontend, backend, database, API, the mental model not the syntax',
          'GitHub and Vercel: deploy your first live page',
          'How to read error messages and know what to give AI when something breaks',
        ],
        tools: ['GitHub', 'Vercel', 'Chrome DevTools', 'Postman', 'Claude'],
        outcome: "You'll be able to read a codebase, trace a bug to its source, and deploy a live page, without writing a single line of code.",
        accent: '#0F766E',
      },
      {
        num: '08',
        label: 'AI Product Thinking & Vibe Coding',
        youllLearn: [
          "How to decide what to build, who it's for, and why AI is the right solution",
          'How to scope your MVP to test the one assumption that matters most',
          'What vibe coding is: you describe, AI builds',
          'Replit, Cursor, Claude Code: which tool to use and when',
        ],
        framework: { name: 'Framework', desc: 'A decision framework to validate if AI is the right solution, and a scoping method to identify the one assumption your MVP must prove first.' },
        tools: ['Replit', 'Cursor', 'Claude Code'],
        outcome: "You'll be able to go from idea to working web app in a single session.",
        accent: '#0F766E',
      },
      {
        num: '09',
        label: 'Building AI-Powered Products',
        youllLearn: [
          'Add a chatbot, recommendation engine, or AI search to your product',
          'Connect your app to OpenAI, Claude, or any AI API',
          'Let your product answer questions from your own data',
          "Design AI UX that doesn't frustrate users",
        ],
        tools: ['Claude API', 'OpenAI API', 'Composio', 'Replit / Cursor'],
        outcome: "You'll be able to add a working AI feature to any product, and ship it to users.",
        accent: '#0F766E',
      },
      {
        num: '10',
        label: 'GTM & Growth',
        youllLearn: [
          'Build a content engine: one brief to blog, LinkedIn, X, email, automatically',
          'Position your product to win: what makes you different and who cares most',
          'Find your growth bottleneck and fix it with AI-powered experiments',
          'Produce ad creatives, product demo videos, and personalized outreach with AI',
          'GEO: how to get your product cited by ChatGPT, Perplexity, and Google AI Overviews',
        ],
        framework: { name: 'Framework', desc: 'A positioning system, growth funnel analysis method, and experiment prioritization approach for launching and growing your product.' },
        tools: ['Claude', 'ChatGPT', 'HeyGen', 'ElevenLabs', 'AdCreative.ai', 'Buffer'],
        outcome: "You'll be able to launch with a full GTM plan, a running content engine, and an AI-produced product demo, ready to drive real acquisition.",
        accent: '#0F766E',
      },
    ],
  },
  {
    name: 'Phase 4 · Capstone',
    modules: [
      {
        num: '11',
        label: 'Capstone Build (Weeks 11–12)',
        youllLearn: [
          'Launch an MVP: an AI-powered product shipped to real users',
          'Build an automation system: an end-to-end workflow running for a real brand',
          'Ship an internal tool: deployed inside your company with teammates actively using it',
        ],
        tools: [],
        outcome: "You'll be able to present a working AI-powered build, not a prototype, not a demo, something people are actually using.",
        accent: '#0F766E',
      },
      {
        num: '13',
        label: 'Adoption Sprint',
        youllLearn: [
          "Take your build to real users, collect usage data, and iterate based on what you observe",
          "The program doesn't end when you build it — it ends when someone uses it",
        ],
        tools: [],
        outcome: "You'll be able to show real usage evidence: who used your build, what they did, and what you changed because of it.",
        accent: '#0F766E',
      },
      {
        num: '14',
        label: 'Demo Day',
        youllLearn: [
          'Present your build live to the cohort and industry leaders',
          'Show what you built, who used it, and what you learned',
        ],
        tools: [],
        outcome: "You'll be able to walk away with a portfolio-ready case study and the confidence to pitch your work to anyone.",
        accent: '#0F766E',
      },
    ],
  },
];

// Engineer Track — 15 modules, 4 phases
const ENGINEER_CURRICULUM: Phase[] = [
  FOUNDATIONS_PHASE('#1E40AF'),
  {
    name: 'Phase 2 · Bridge',
    modules: [
      {
        num: '04',
        label: 'ML Foundations for AI Engineers',
        youllLearn: [
          'How LLMs are actually built: pre-training, fine-tuning, RLHF',
          'The training vs inference cost trade-off that drives every production decision',
          'When NOT to use an LLM, and what to use instead',
          'Fine-tune a small open-source model. Feel the training loop once.',
        ],
        framework: { name: 'Framework', desc: 'A decision framework for when NOT to use an LLM, and what to reach for instead.' },
        tools: ['Hugging Face', 'Unsloth', 'Google Colab'],
        outcome: "You'll be able to explain how any LLM was built, fine-tune one yourself, and make principled decisions about when to use AI vs simpler alternatives.",
        accent: '#1E40AF',
      },
      {
        num: '05',
        label: 'LLM APIs & Production Patterns',
        youllLearn: [
          'OpenAI, Anthropic, Google APIs: authentication, function calling, structured outputs',
          'Streaming, async patterns, and chunked transfer for real-time UX',
          'How to pick the right model: quality vs cost vs latency, and build a cost model',
          'Retries, fallbacks, rate limits: production-grade API patterns',
          'Ship a feature using Cursor or Claude Code, AI pair-programming in practice',
        ],
        framework: { name: 'Framework', desc: 'A model selection framework across quality, cost, and latency to pick the right model for any task.' },
        tools: ['Python', 'OpenAI SDK', 'Anthropic SDK', 'Google AI SDK', 'Cursor', 'Claude Code'],
        outcome: "You'll be able to build a production Python service that calls multiple LLM APIs, handles failures gracefully, and tracks cost per request.",
        accent: '#1E40AF',
      },
    ],
  },
  {
    name: 'Phase 3 · Build AI Features',
    modules: [
      {
        num: '06',
        label: 'RAG Systems End-to-End',
        youllLearn: [
          'The full RAG stack: ingestion, chunking, embedding, storage, retrieval, generation',
          'Chunking strategies, embedding model selection, vector database tradeoffs',
          'Hybrid search, reranking, metadata filtering, how to make retrieval actually work',
          'Multimodal RAG: retrieving images and text together',
          'Document AI: PDFs, scanned docs, and messy real-world sources',
        ],
        framework: { name: 'Framework', desc: 'A decision framework for choosing between prompting, RAG, and fine-tuning based on what your system actually needs.' },
        tools: ['Python', 'LangChain', 'Pinecone', 'pgvector', 'OpenAI Embeddings', 'LlamaParse', 'CLIP'],
        outcome: "You'll be able to ship a production-ready RAG pipeline, and defend every architectural decision behind it.",
        accent: '#1E40AF',
      },
      {
        num: '07',
        label: 'Context Engineering',
        youllLearn: [
          "How to design what goes into an LLM's context window, and what to ruthlessly cut",
          'Dynamic context assembly: RAG retrievals + agent memory + tool outputs + user state',
          'Prompt caching, context compression, and long-context failure modes',
          'Keeping AI responses safe and isolated across different users in production',
        ],
        framework: { name: 'Framework', desc: 'A context budgeting framework for deciding what goes in, what gets retrieved, and what gets cut.' },
        tools: ['Anthropic SDK', 'OpenAI SDK', 'LangChain', 'tiktoken', 'LangSmith'],
        outcome: "You'll be able to design context pipelines that cut cost and improve output quality, for any AI system you build.",
        accent: '#1E40AF',
      },
      {
        num: '08',
        label: 'Building Agents',
        youllLearn: [
          'When a workflow beats an agent, and how to make that call every time',
          'LangGraph for production agents: ReAct, plan-and-execute, tool-use patterns',
          'MCP (Model Context Protocol): connect your agent to any external tool or data source',
          'Short-term and long-term agent memory: conversation state + semantic stores',
          'Vision agents: agents that read screenshots, charts, and documents',
        ],
        framework: { name: 'Framework', desc: 'A decision framework for when to use a workflow vs a true agent, so you only add complexity when it measurably wins.' },
        tools: ['LangChain', 'LangGraph', 'mem0', 'MCP SDK', 'Pinecone/pgvector', 'GPT-5/Claude vision'],
        outcome: "You'll be able to build a production-grade AI agent with memory, tool use, and vision, with tests to prove it works.",
        accent: '#1E40AF',
        preReadNum: '07',
      },
      {
        num: '09',
        label: 'Advanced Agents',
        youllLearn: [
          'How to scope agent autonomy, and enforce it through tool permissions and execution boundaries',
          'Agent security: sandboxed execution, audit logging, jailbreak resistance',
          'Multi-agent systems: coordinator, sequential, parallel, reviewer patterns',
          'Voice agents: STT to agent to TTS, with Twilio, Vapi, or LiveKit',
          'Background processing: async execution, job queues, webhook completion',
        ],
        framework: { name: 'Framework', desc: 'A framework for scoping and enforcing agent autonomy safely in production.' },
        tools: ['LangChain', 'LangGraph', 'MCP SDK', 'Redis', 'Whisper', 'ElevenLabs', 'Twilio/Vapi'],
        outcome: "You'll be able to run a secure, multi-agent system in production, with async processing, audit logging, and optional voice capabilities.",
        accent: '#1E40AF',
        preReadNum: '06',
      },
    ],
  },
  {
    name: 'Phase 4 · Production AI Engineering',
    modules: [
      {
        num: '10',
        label: 'AI Observability',
        youllLearn: [
          'How to trace, log, and monitor every LLM call in production',
          'Build cost and latency dashboards broken down by feature and user',
          'Semantic caching, prompt caching, response caching, where the savings actually are',
          'Prompt versioning: treat prompts like code, version control, A/B tests, rollback',
          'Debug a failed request end-to-end: from user input through LLM, retrieval, and tool calls',
        ],
        framework: { name: 'Framework', desc: 'A systematic cost optimization approach: measure first, then cache, route, trim, and optimize in the right order.' },
        tools: ['Langfuse', 'OpenTelemetry', 'Python'],
        outcome: "You'll be able to have full visibility into any AI system: traces, cost dashboards, versioned prompts, and the ability to debug any failure end-to-end.",
        accent: '#1E40AF',
      },
      {
        num: '11',
        label: 'Evals & Error Analysis',
        youllLearn: [
          'Why AI features fail silently, and how to build the systems that catch failures first',
          'Read real traces, label real failures, build evals from what actually breaks',
          'Deterministic checks, LLM-as-judge scoring, and how to validate your judge',
          'Quality regression tests that block deploys when the AI degrades',
        ],
        framework: { name: 'Framework', desc: 'An error-analysis-first approach to building evals from what actually breaks in production, not what you imagine might break.' },
        tools: ['Python', 'pytest', 'Langfuse', 'Promptfoo / Inspect AI'],
        outcome: "You'll be able to build an eval suite and CI pipeline that automatically catches quality regressions before they reach users.",
        accent: '#1E40AF',
      },
      {
        num: '12',
        label: 'Capstone Build (Weeks 12–13)',
        youllLearn: [
          'Production RAG system: deployed as a service with ingestion, retrieval, generation, evaluation, and monitoring',
          'AI agent platform: multi-agent system with MCP integration, observability, and production deployment',
          'AI feature for an existing app: search, recommendations, chat, or analysis, fully instrumented and shipped',
        ],
        tools: [],
        outcome: "You'll be able to present a production-grade AI system: deployed, monitored, tested, and documented end-to-end.",
        accent: '#1E40AF',
      },
      {
        num: '14',
        label: 'Adoption Sprint',
        youllLearn: [
          'Ship to real users. Watch real usage data. Fix real problems.',
          "The program doesn't end when you merge the PR, it ends when someone relies on what you built.",
        ],
        tools: [],
        outcome: "You'll be able to show real users on your system and production data proving it holds up under real traffic.",
        accent: '#1E40AF',
      },
      {
        num: '15',
        label: 'Demo Day & Code Review',
        youllLearn: [
          'Code review with engineering mentors. Live demo in front of the cohort and industry engineers.',
          "Show what's deployed, who's using it, and what the data shows.",
        ],
        tools: [],
        outcome: "You'll be able to walk away with a production-grade portfolio project, a reviewed codebase, and the credibility to back it up in any engineering interview.",
        accent: '#1E40AF',
      },
    ],
  },
];

const CURRICULUM: Record<GenAITrack, Phase[]> = {
  builder: BUILDER_CURRICULUM,
  engineer: ENGINEER_CURRICULUM,
};

const PROJECTS_LABEL = {
  builder: 'Past Builder builds',
  engineer: 'Past Engineer builds',
};

type ModuleStatus = 'locked' | 'available' | 'in-progress' | 'completed';

const GENAI_MODULE_SECTIONS: Record<string, { moduleId: string; total: number }> = {
  '01': { moduleId: 'genai-pr-01', total: 5 },
  '02': { moduleId: 'genai-pr-02', total: 5 },
  '03': { moduleId: 'genai-pr-03', total: 5 },
  '04': { moduleId: 'genai-pr-04', total: 5 },
  '05': { moduleId: 'genai-pr-05', total: 5 },
  '06': { moduleId: 'genai-pr-06', total: 5 },
  '07': { moduleId: 'genai-pr-07', total: 5 },
};

interface Props {
  track: GenAITrack;
  onBack: () => void;
  onStartModule: (num: string) => void;
}

const TRACK_META: Record<GenAITrack, {
  label: string;
  sublabel: string;
  desc: string;
  color: string;
  bg: string;
  border: string;
  phaseHeaderBg: string;
  emoji: string;
  totalModules: number;
}> = {
  builder: {
    label: 'Builder Track',
    sublabel: 'Founders, operators, and anyone on a non-technical team',
    desc: 'For founders, operators, and anyone on a non-technical team who wants to automate work and build AI products, no coding required. 14 modules · ship AI workflows & products.',
    color: '#0F766E',
    bg: 'rgba(15,118,110,0.08)',
    border: 'rgba(15,118,110,0.2)',
    phaseHeaderBg: 'linear-gradient(120deg, #0B3D2E 0%, #064E3B 100%)',
    emoji: '🛠️',
    totalModules: 14,
  },
  engineer: {
    label: 'Engineer Track',
    sublabel: 'Engineers ready to become world-class 10x AI Engineers',
    desc: 'For engineers ready to become world-class 10x AI Engineers. 15 modules · basic coding knowledge required · ship production AI systems.',
    color: '#1E40AF',
    bg: 'rgba(30,64,175,0.08)',
    border: 'rgba(30,64,175,0.2)',
    phaseHeaderBg: 'linear-gradient(120deg, #0F2862 0%, #1E40AF 100%)',
    emoji: '⚙️',
    totalModules: 15,
  },
};

export default function GenAILaunchpadOverview({ track, onBack, onStartModule }: Props) {
  const meta = TRACK_META[track];
  const completedSections = useLearnerStore(s => s.completedSections);
  const phases = CURRICULUM[track];

  const getModuleProgress = (preReadNum: string | undefined, available: boolean) => {
    if (!preReadNum) return { completedCount: 0, totalSections: 0, percent: 0, status: 'locked' as ModuleStatus };
    const sectionMeta = GENAI_MODULE_SECTIONS[preReadNum];
    const completedCount = sectionMeta ? completedSections[sectionMeta.moduleId]?.length ?? 0 : 0;
    const totalSections = sectionMeta?.total ?? 0;
    const percent = totalSections > 0 ? Math.min(100, Math.round((completedCount / totalSections) * 100)) : 0;
    let status: ModuleStatus = available ? 'available' : 'locked';
    if (available && completedCount > 0) status = 'in-progress';
    if (available && totalSections > 0 && completedCount >= totalSections) status = 'completed';
    return { completedCount, totalSections, percent, status };
  };

  const totalAvailable = phases.reduce((sum, p) => sum + p.modules.filter(m => m.preReadNum).length, 0);

  return (
    <div className="editorial" style={{ minHeight: '100vh', background: 'var(--ed-cream)' }}>
      {/* Top bar */}
      <div className="screen-topbar" style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--ed-card)', borderBottom: '1px solid var(--ed-rule)',
        padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ed-ink3)', fontSize: 13, fontFamily: 'inherit' }}>
          ← Back
        </button>
        <AirtribeLogo />
        <div style={{ width: 60 }} />
      </div>

      <div className="overview-content" style={{ maxWidth: 920, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Track banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{
            borderRadius: 24, padding: '28px 32px', marginBottom: 36,
            background: `linear-gradient(115deg, ${meta.color}22 0%, ${meta.color}0C 45%, var(--ed-card) 100%)`,
            boxShadow: `0 8px 0 ${meta.color}38, 0 20px 48px ${meta.color}1C, inset 0 1.5px 0 rgba(255,255,255,0.75)`,
            border: `1.5px solid ${meta.color}2A`,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20,
            flexWrap: 'wrap' as const, position: 'relative' as const, overflow: 'hidden',
          }}>
          <div style={{ position: 'absolute', top: -40, left: -10, width: 200, height: 200, borderRadius: '50%', background: meta.color, opacity: 0.13, filter: 'blur(50px)', pointerEvents: 'none' }} />
          <div style={{ flex: 1, minWidth: 220, position: 'relative' as const }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: meta.color, marginBottom: 12 }}>
              COURSE CURRICULUM
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                background: meta.color,
                boxShadow: `0 5px 0 ${meta.color}55, 0 8px 24px ${meta.color}35, inset 0 1px 0 rgba(255,255,255,0.3)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
              }}>{meta.emoji}</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: meta.color, fontFamily: "'Lora', serif", lineHeight: 1.2 }}>{meta.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ed-ink3)', letterSpacing: '0.06em', marginTop: 3 }}>{meta.sublabel}</div>
              </div>
            </div>
            <div style={{ fontSize: 14, color: 'var(--ed-ink)', lineHeight: 1.7, maxWidth: 540 }}>{meta.desc}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 150, position: 'relative' as const }}>
            <div style={{ padding: '10px 16px', borderRadius: 14, background: 'var(--ed-card)', boxShadow: `0 4px 0 ${meta.color}28, inset 0 1px 0 rgba(255,255,255,0.9)`, border: `1px solid ${meta.color}1E` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: meta.color, letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 2, fontWeight: 700 }}>Modules</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ed-ink)' }}>{meta.totalModules} modules</div>
            </div>
            <div style={{ padding: '10px 16px', borderRadius: 14, background: 'var(--ed-card)', boxShadow: `0 4px 0 ${meta.color}28, inset 0 1px 0 rgba(255,255,255,0.9)`, border: `1px solid ${meta.color}1E` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: meta.color, letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 2, fontWeight: 700 }}>Available now</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ed-ink)' }}>{totalAvailable} pre-reads</div>
            </div>
          </div>
        </motion.div>

        {/* Phased curriculum */}
        {phases.map((phase, phaseIdx) => (
          <div key={phase.name} style={{ marginBottom: 32 }}>
            {/* Phase header */}
            <motion.div
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: phaseIdx * 0.05 }}
              style={{
                background: meta.phaseHeaderBg,
                color: '#fff',
                padding: '12px 20px',
                borderRadius: 10,
                marginBottom: 14,
                fontFamily: "'Lora', serif",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: '0.02em',
                boxShadow: `0 4px 0 ${meta.color}33, 0 8px 20px ${meta.color}1A`,
              }}>
              {phase.name}
            </motion.div>

            {/* Modules */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {phase.modules.map((mod, modIdx) => {
                const available = !!mod.preReadNum;
                const progress = getModuleProgress(mod.preReadNum, available);
                const ctaLabel = progress.status === 'completed' ? 'Review' : progress.status === 'in-progress' ? 'Continue' : 'Start pre-read';
                const statusLabel = progress.status === 'completed' ? 'COMPLETED' : progress.status === 'in-progress' ? 'IN PROGRESS' : available ? 'AVAILABLE' : 'COMING SOON';

                return (
                  <motion.div
                    key={mod.num}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: modIdx * 0.04 }}
                    style={{
                      borderRadius: 12,
                      background: 'var(--ed-card)',
                      border: `1px solid ${available ? `${meta.color}33` : 'var(--ed-rule)'}`,
                      overflow: 'hidden',
                      opacity: available ? 1 : 0.82,
                      boxShadow: available ? `0 2px 12px ${meta.color}10` : 'none',
                    }}>
                    {/* Module header */}
                    <div style={{
                      padding: '14px 20px',
                      background: meta.phaseHeaderBg,
                      color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>Module {mod.num}</div>
                        <div style={{ fontFamily: "'Lora', serif", fontSize: 15.5, fontWeight: 700 }}>{mod.label}</div>
                      </div>
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, fontWeight: 700,
                        padding: '3px 10px', borderRadius: 4, letterSpacing: '0.12em',
                        background: available ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.92)',
                      }}>{statusLabel}</div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '18px 20px' }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: 8 }}>YOU&apos;LL LEARN:</div>
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--ed-ink2)', lineHeight: 1.7, marginBottom: mod.framework ? 14 : 12 }}>
                        {mod.youllLearn.map((b, i) => (
                          <li key={i} style={{ marginBottom: 4 }}>{b}</li>
                        ))}
                      </ul>

                      {/* Framework callout */}
                      {mod.framework && (
                        <div style={{
                          display: 'grid', gridTemplateColumns: '108px 1fr', gap: 0,
                          marginBottom: 12, borderRadius: 6, overflow: 'hidden',
                          border: '1px solid var(--ed-rule)',
                        }}>
                          <div style={{ background: '#E8E5DE', padding: '12px 14px', display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontFamily: "'Lora', serif", fontSize: 14, fontWeight: 700, color: '#1F1A14' }}>{mod.framework.name}</span>
                          </div>
                          <div style={{ background: 'var(--ed-card)', padding: '12px 14px', fontSize: 12.5, color: 'var(--ed-ink2)', lineHeight: 1.55 }}>
                            {mod.framework.desc}
                          </div>
                        </div>
                      )}

                      {/* Tools box */}
                      {mod.tools.length > 0 && (
                        <div style={{ marginBottom: 12, borderRadius: 6, overflow: 'hidden', border: '1px solid #11151A' }}>
                          <div style={{ padding: '8px 14px', background: '#11151A', fontFamily: "'Lora', serif", fontSize: 12.5, fontWeight: 700, color: '#fff' }}>Tools</div>
                          <div style={{ padding: '10px 14px', background: '#000', fontFamily: 'inherit', fontSize: 12.5, color: 'rgba(255,255,255,0.86)', lineHeight: 1.6 }}>
                            {mod.tools.join(' · ')}
                          </div>
                        </div>
                      )}

                      {/* Outcome (What You Will Be Able To Do) */}
                      <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #0A0F12' }}>
                        <div style={{ background: 'linear-gradient(90deg, #6BE5C5 0%, #4DB89A 100%)', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: "'Lora', serif", fontSize: 13, fontWeight: 700, color: '#0A1A14' }}>What You Will Be Able To Do</span>
                        </div>
                        <div style={{ background: '#0B1117', padding: '12px 14px', fontSize: 12.5, color: 'rgba(255,255,255,0.86)', lineHeight: 1.65 }}>
                          {mod.outcome}
                        </div>
                      </div>

                      {/* Progress + CTA */}
                      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                        {progress.totalSections > 0 && (
                          <>
                            <div style={{ flex: 1, height: 5, borderRadius: 999, background: 'var(--ed-cream)', overflow: 'hidden', border: '1px solid var(--ed-rule)' }}>
                              <div style={{ width: `${progress.percent}%`, height: '100%', borderRadius: 999, background: meta.color }} />
                            </div>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: meta.color, fontWeight: 700 }}>
                              {progress.completedCount}/{progress.totalSections}
                            </span>
                          </>
                        )}
                        {available ? (
                          <button
                            onClick={() => onStartModule(mod.preReadNum!)}
                            style={{
                              padding: '7px 18px', borderRadius: 6,
                              background: meta.color, color: '#fff', border: 'none',
                              fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                              whiteSpace: 'nowrap' as const,
                            }}>{ctaLabel} →</button>
                        ) : (
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--ed-ink3)', letterSpacing: '0.08em' }}>
                            🔒 COMING SOON
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div style={{ marginTop: 28, padding: '20px 24px', borderRadius: 10, background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', fontSize: 13, color: 'var(--ed-ink3)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--ed-ink2)' }}>{PROJECTS_LABEL[track]}.</strong>{' '}
          Pre-reads unlock before each live cohort session so you arrive with context, not questions about the basics. The {meta.totalModules}-module {meta.label.toLowerCase()} runs across four phases — Foundations, then track-specific depth, ending in a capstone build that ships to real users.
        </div>
      </div>
    </div>
  );
}

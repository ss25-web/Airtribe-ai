'use client';

import { motion } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import type { GenAITrack } from './genaiTypes';
import { AirtribeLogo } from './AirtribeBrand';

// Modules with `preReadNum` route to that existing PR component (PR1-PR7).
// Modules without `preReadNum` render as Coming Soon.
//
// Structure: existing 14 cohort modules first (M01-M14 — current cohort
// curriculum, PR1-PR7 built, M08-M14 coming), then the new Builder /
// Engineer curriculum appended after (M15+ for Builder, M15+ for Engineer).

type ModuleCard = {
  num: string;
  phase: string;
  label: string;
  desc: string;
  duration: string;
  tools: string[];
  accent: string;
  preReadNum?: string;
};

// ─── EXISTING COHORT MODULES (M01-M14, shared by both tracks) ──────────
const EXISTING_MODULES: ModuleCard[] = [
  {
    num: '01',
    phase: 'Feb 7–13',
    label: 'Introduction to Generative AI',
    desc: 'How AI-native workflows differ from traditional systems, where LLMs fit in the stack, and the mental models that separate useful AI from hype.',
    duration: 'Pre-read · 20 min',
    tools: ['ChatGPT', 'Claude', 'Gemini'],
    preReadNum: '01',
    accent: '#7C3AED',
  },
  {
    num: '02',
    phase: 'Feb 14–20',
    label: 'Prompt Engineering & LLM Foundations',
    desc: 'Crispy Framework for prompt structure, zero-shot vs few-shot, context window management, cost-efficient model selection, and recursive prompt refinement.',
    duration: 'Live sessions · 2',
    tools: ['OpenAI Playground', 'Claude', 'Zapier'],
    preReadNum: '02',
    accent: '#2563EB',
  },
  {
    num: '03',
    phase: 'Feb 21–27',
    label: 'Research, Summarization & Drafting',
    desc: 'The Research → Summarize → Draft workflow, the 5W1H framework for summaries, COVE evaluation, and audience-specific insight compression.',
    duration: 'Live sessions · 2',
    tools: ['ChatGPT', 'Claude', 'Perplexity'],
    preReadNum: '03',
    accent: '#0891B2',
  },
  {
    num: '04',
    phase: 'Feb 28 – Mar 6',
    label: 'Workflow Automation with n8n',
    desc: 'n8n fundamentals: triggers, nodes, app integrations, cloud hosting, AI agents, and database setup for dynamic data handling.',
    duration: 'Live sessions · 2',
    tools: ['n8n', 'Webhooks', 'Google Sheets'],
    preReadNum: '04',
    accent: '#0F766E',
  },
  {
    num: '05',
    phase: 'Mar 7–13',
    label: 'Advanced n8n: Loops, Transforms & AI Agents',
    desc: 'Advanced workflow patterns: data transformation, conditional logic, loops, batching, human-in-the-loop systems, and building chat-based AI agents with memory.',
    duration: 'Live sessions · 2',
    tools: ['n8n', 'OpenAI', 'Gmail'],
    preReadNum: '05',
    accent: '#059669',
  },
  {
    num: '06',
    phase: 'Mar 14–20',
    label: 'AI Agent Workflows — Building & Scaling',
    desc: 'AI agent automation, HR evaluation workflows, Gmail draft automation, LinkedIn content generation, approval flows, SERP-based content, and complaint categorization with RAG scoring.',
    duration: 'Live sessions · 2',
    tools: ['n8n', 'Gemini', 'LinkedIn'],
    preReadNum: '06',
    accent: '#7C3AED',
  },
  {
    num: '07',
    phase: 'Mar 21–27',
    label: 'Model Context Protocol (MCP)',
    desc: 'MCP fundamentals, building MCP servers, integrating LLMs with Gmail and Calendar, n8n-based MCP workflows, browser and file-system automation, and Telegram bot setup.',
    duration: 'Live sessions · 2',
    tools: ['MCP', 'Claude', 'n8n'],
    preReadNum: '07',
    accent: '#B45309',
  },
  {
    num: '08',
    phase: 'Mar 28 – Apr 3',
    label: 'RAG & Multi-Agent Orchestration',
    desc: 'RAG fundamentals, vectorization, chunking, Pinecone setup, multi-agent orchestration patterns, email-to-structured-data workflows, and scalable retrieval-augmented pipelines.',
    duration: 'Live sessions · 2',
    tools: ['Pinecone', 'n8n', 'Supabase'],
    accent: '#C2410C',
  },
  {
    num: '09',
    phase: 'Apr 4–10',
    label: 'Tech Foundations & Vibe Coding',
    desc: 'Frontend, backend, and database architecture; AI-assisted "vibe coding" with Cursor and Replit; Git/GitHub fundamentals; building and deploying apps with Streamlit.',
    duration: 'Live sessions · 2',
    tools: ['Cursor', 'Replit', 'GitHub'],
    accent: '#0369A1',
  },
  {
    num: '10',
    phase: 'Apr 11–17',
    label: 'Vibe Coding: Design → Debug → Deploy',
    desc: 'Rapid app building with Lovable, AI-assisted frontend and full-stack development, backend–frontend API integration, authentication, webhook handling, and portfolio-ready AI projects.',
    duration: 'Live sessions · 2',
    tools: ['Lovable', 'Replit', 'Copilot'],
    accent: '#6D28D9',
  },
  {
    num: '11',
    phase: 'Apr 18–24',
    label: 'Building Brand Identity with GenAI',
    desc: 'Brand core, emotional tone, manifesto, moodboard, brand story, and hero visual creation using GenAI. Key brand systems: imagery, color, and typography into a Brand Book.',
    duration: 'Live session · 1',
    tools: ['Midjourney', 'ChatGPT', 'Canva'],
    accent: '#DC2626',
  },
  {
    num: '12',
    phase: 'Apr 25 – May 1',
    label: 'Brand Book: Hands-On Lab',
    desc: 'Bring your brand identity together into a complete, cohesive Brand Book through a structured hands-on lab session.',
    duration: 'Lab session · 1',
    tools: ['Figma', 'Canva', 'GenAI'],
    accent: '#BE185D',
  },
  {
    num: '13',
    phase: 'May 2–8',
    label: 'Brand Assets & Campaign Creation',
    desc: 'Manifesto visual, lifestyle visual, hero product visual, mockups, video loops, audio signatures, and a launch-ready campaign system — all built with GenAI tools.',
    duration: 'Live session · 1',
    tools: ['Runway', 'ElevenLabs', 'Adobe'],
    accent: '#B45309',
  },
  {
    num: '14',
    phase: 'May 9–15',
    label: 'Voice Agents',
    desc: 'How voice agents work end-to-end, designing system prompts for voice, building inbound voice agents with Vapi, creating voice clones with ElevenLabs, and n8n automation integration.',
    duration: 'Live session · 1',
    tools: ['Vapi', 'ElevenLabs', 'n8n'],
    accent: '#0F766E',
  },
];

// ─── NEW BUILDER MODULES (appended after existing M14, so num starts at 15) ──
const NEW_BUILDER_MODULES: ModuleCard[] = [
  {
    num: '15',
    phase: 'Builder · Phase 1 · AI Foundations',
    label: 'AI Fluency & Prompting',
    desc: 'How LLMs actually work: tokens, context windows, temperature. The TCREF Framework for reliable, repeatable prompts. Zero-shot, few-shot, chain-of-thought, meta-prompting. How to avoid hallucinations.',
    duration: 'Pre-read · 20 min',
    tools: ['ChatGPT', 'Claude', 'Gemini', 'Google AI Studio', 'OpenAI Playground'],
    accent: '#7C3AED',
  },
  {
    num: '16',
    phase: 'Builder · Phase 1 · AI Foundations',
    label: 'AI Workflows & Productivity',
    desc: 'AI for research, writing, presentations, and meetings. Connect AI to Gmail, Calendar, Drive, Slack. Build your own Custom GPT / Claude Project / Gemini Gem for your most repeated work.',
    duration: 'Live sessions · 2',
    tools: ['NotebookLM', 'Chronicle', 'Wispr Flow', 'ElevenLabs', 'Claude'],
    accent: '#2563EB',
  },
  {
    num: '17',
    phase: 'Builder · Phase 1 · AI Foundations',
    label: 'AI Agents & Track Selection',
    desc: 'What an AI agent is, and when to use one vs a workflow vs a prompt. The automation spectrum from no-code to code. Watch one automation built three ways. Choose your track with confidence.',
    duration: 'Live sessions · 2',
    tools: ['ChatGPT', 'Claude', 'n8n', 'Replit', 'Midjourney'],
    accent: '#0891B2',
  },
  {
    num: '18',
    phase: 'Builder · Phase 2 · Automation Mastery',
    label: 'Workflow Automation with n8n',
    desc: 'Identify which tasks are worth automating and calculate ROI. n8n fundamentals: nodes, triggers, connections, credentials. Multi-step workflows with AI reasoning, error handling, retries, and approval gates.',
    duration: 'Live sessions · 2',
    tools: ['n8n', 'OpenAI API', 'Claude API'],
    accent: '#0F766E',
  },
  {
    num: '19',
    phase: 'Builder · Phase 2 · Automation Mastery',
    label: 'AI Agents for Business',
    desc: "Agents that don't just answer questions — they take action (email, CRM, Slack). Memory for past interactions. Multi-step planning, execution, and verification. Voice agents for lead-qual and support.",
    duration: 'Live sessions · 2',
    tools: ['n8n', 'Zapier', 'Make.com', 'Claude API', 'MCP', 'Vapi'],
    accent: '#059669',
  },
  {
    num: '20',
    phase: 'Builder · Phase 2 · Automation Mastery',
    label: 'Data Analysis with AI',
    desc: 'Ask questions of your data in plain English — no SQL. Upload a CSV, get charts, trends, and anomalies in minutes. Build AI-powered dashboards and go from raw data to a clear "so what" every time.',
    duration: 'Live sessions · 2',
    tools: ['ChatGPT', 'Claude', 'Excel', 'Python', 'SQL'],
    accent: '#7C3AED',
  },
  {
    num: '21',
    phase: 'Builder · Phase 3 · Product Building',
    label: 'Tech for Builders',
    desc: 'How web apps work: frontend, backend, database, API. GitHub and Vercel: deploy your first live page. Read error messages and know what to give AI when something breaks.',
    duration: 'Live sessions · 2',
    tools: ['GitHub', 'Vercel', 'Chrome DevTools', 'Postman', 'Claude'],
    accent: '#B45309',
  },
  {
    num: '22',
    phase: 'Builder · Phase 3 · Product Building',
    label: 'AI Product Thinking & Vibe Coding',
    desc: "Decide what to build, who it's for, and why AI is the right solution. Scope your MVP to test the one assumption that matters most. Vibe coding: you describe, AI builds. Replit, Cursor, Claude Code.",
    duration: 'Live sessions · 2',
    tools: ['Replit', 'Cursor', 'Claude Code'],
    accent: '#C2410C',
  },
  {
    num: '23',
    phase: 'Builder · Phase 3 · Product Building',
    label: 'Building AI-Powered Products',
    desc: "Add a chatbot, recommendation engine, or AI search to your product. Connect to OpenAI, Claude, or any AI API. Answer questions from your own data. Design AI UX that doesn't frustrate users.",
    duration: 'Live sessions · 2',
    tools: ['Claude API', 'OpenAI API', 'Composio', 'Replit', 'Cursor'],
    accent: '#0369A1',
  },
  {
    num: '24',
    phase: 'Builder · Phase 3 · Product Building',
    label: 'GTM & Growth',
    desc: 'Build a content engine: one brief to blog, LinkedIn, X, email. Position your product to win. Find growth bottlenecks and fix them with AI experiments. Produce ad creatives, demo videos, personalized outreach, and get cited by ChatGPT, Perplexity, and Google AI Overviews.',
    duration: 'Live sessions · 2',
    tools: ['Claude', 'ChatGPT', 'HeyGen', 'ElevenLabs', 'AdCreative.ai', 'Buffer'],
    accent: '#6D28D9',
  },
  {
    num: '25',
    phase: 'Builder · Phase 4 · Capstone',
    label: 'Capstone Build',
    desc: 'Choose your build — launch an MVP, build an automation system end-to-end for a real brand, or ship an internal tool deployed inside your company with teammates actively using it.',
    duration: 'Build sprint · 2 weeks',
    tools: ['Replit', 'Cursor', 'Claude', 'n8n'],
    accent: '#DC2626',
  },
  {
    num: '26',
    phase: 'Builder · Phase 4 · Capstone',
    label: 'Capstone Build (continued)',
    desc: 'Continue the capstone build. Present a working AI-powered build, not a prototype, not a demo — something people are actually using.',
    duration: 'Build sprint · 2 weeks',
    tools: ['Replit', 'Cursor', 'Claude', 'n8n'],
    accent: '#BE185D',
  },
  {
    num: '27',
    phase: 'Builder · Phase 4 · Capstone',
    label: 'Adoption Sprint',
    desc: 'Take your build to real users, collect usage data, and iterate based on what you observe — not what you assumed. The program ends when someone uses it, not when you build it.',
    duration: 'Sprint · 1 week',
    tools: ['Analytics', 'Hotjar', 'User interviews'],
    accent: '#B45309',
  },
  {
    num: '28',
    phase: 'Builder · Phase 4 · Capstone',
    label: 'Demo Day',
    desc: 'Present your build live to the cohort and industry leaders. Show what you built, who used it, and what you learned. Walk away with a portfolio-ready case study.',
    duration: 'Live session · 1',
    tools: ['Slides', 'Loom', 'Live demo'],
    accent: '#0F766E',
  },
];

// Engineer Track — 15 modules. Phase 1 mirrors Builder (PR1-PR3). Phase 2+
// is engineering-side content (ML Foundations, LLM APIs, RAG, Context Eng,
// Agents, Observability, Evals). M08 (Building Agents) reuses PR6 since the
// existing pre-read covers agent workflows; M09 (Advanced Agents) reuses
// PR7 since MCP is core to advanced agent tooling.
// ─── NEW ENGINEER MODULES (appended after existing M14, so num starts at 15) ──
const NEW_ENGINEER_MODULES: ModuleCard[] = [
  {
    num: '15',
    phase: 'Engineer · Phase 1 · AI Foundations',
    label: 'AI Fluency & Prompting',
    desc: 'How LLMs actually work: tokens, context windows, temperature. The TCREF Framework for reliable, repeatable prompts. Zero-shot, few-shot, chain-of-thought, meta-prompting. How to avoid hallucinations.',
    duration: 'Pre-read · 20 min',
    tools: ['ChatGPT', 'Claude', 'Gemini', 'Google AI Studio', 'OpenAI Playground'],
    accent: '#7C3AED',
  },
  {
    num: '16',
    phase: 'Engineer · Phase 1 · AI Foundations',
    label: 'AI Workflows & Productivity',
    desc: 'AI for research, writing, presentations, and meetings. Connect AI to Gmail, Calendar, Drive, Slack. Build your own Custom GPT / Claude Project / Gemini Gem for your most repeated work.',
    duration: 'Live sessions · 2',
    tools: ['NotebookLM', 'Chronicle', 'Wispr Flow', 'ElevenLabs', 'Claude'],
    accent: '#2563EB',
  },
  {
    num: '17',
    phase: 'Engineer · Phase 1 · AI Foundations',
    label: 'AI Agents & Track Selection',
    desc: 'What an AI agent is, and when to use one vs a workflow vs a prompt. The automation spectrum from no-code to code. Watch one automation built three ways. Choose your track with confidence.',
    duration: 'Live sessions · 2',
    tools: ['ChatGPT', 'Claude', 'n8n', 'Replit', 'Midjourney'],
    accent: '#0891B2',
  },
  {
    num: '18',
    phase: 'Engineer · Phase 2 · Bridge',
    label: 'ML Foundations for AI Engineers',
    desc: 'How LLMs are actually built: pre-training, fine-tuning, RLHF. The training vs inference cost trade-off that drives every production decision. When NOT to use an LLM. Fine-tune a small open-source model and feel the training loop once.',
    duration: 'Live sessions · 2',
    tools: ['Hugging Face', 'Unsloth', 'Google Colab'],
    accent: '#0F766E',
  },
  {
    num: '19',
    phase: 'Engineer · Phase 2 · Bridge',
    label: 'LLM APIs & Production Patterns',
    desc: 'OpenAI, Anthropic, Google APIs: authentication, function calling, structured outputs. Streaming, async patterns, chunked transfer. Pick the right model: quality vs cost vs latency. Retries, fallbacks, rate limits. Ship a feature using Cursor or Claude Code.',
    duration: 'Live sessions · 2',
    tools: ['Python', 'OpenAI SDK', 'Anthropic SDK', 'Cursor', 'Claude Code'],
    accent: '#059669',
  },
  {
    num: '20',
    phase: 'Engineer · Phase 3 · Build AI Features',
    label: 'RAG Systems End-to-End',
    desc: 'The full RAG stack: ingestion, chunking, embedding, storage, retrieval, generation. Hybrid search, reranking, metadata filtering. Multimodal RAG. Document AI for PDFs, scanned docs, and messy real-world sources.',
    duration: 'Live sessions · 2',
    tools: ['Python', 'LangChain', 'Pinecone', 'pgvector', 'OpenAI Embeddings'],
    accent: '#2563EB',
  },
  {
    num: '21',
    phase: 'Engineer · Phase 3 · Build AI Features',
    label: 'Context Engineering',
    desc: "How to design what goes into an LLM's context window, and what to ruthlessly cut. Dynamic context assembly: RAG retrievals + agent memory + tool outputs + user state. Prompt caching, context compression, long-context failure modes.",
    duration: 'Live sessions · 2',
    tools: ['Anthropic SDK', 'OpenAI SDK', 'LangChain', 'tiktoken', 'LangSmith'],
    accent: '#7C3AED',
  },
  {
    num: '22',
    phase: 'Engineer · Phase 3 · Build AI Features',
    label: 'Building Agents',
    desc: 'When a workflow beats an agent and how to make that call every time. LangGraph for production agents: ReAct, plan-and-execute, tool-use patterns. MCP: connect your agent to any external tool or data source. Short and long-term agent memory.',
    duration: 'Live sessions · 2',
    tools: ['LangChain', 'LangGraph', 'mem0', 'MCP SDK', 'Pinecone/pgvector'],
    accent: '#C2410C',
  },
  {
    num: '23',
    phase: 'Engineer · Phase 3 · Build AI Features',
    label: 'Advanced Agents',
    desc: 'How to scope agent autonomy and enforce it through tool permissions and execution boundaries. Agent security: sandboxed execution, audit logging, jailbreak resistance. Multi-agent systems: coordinator, sequential, parallel, reviewer patterns. Voice agents and background processing.',
    duration: 'Live sessions · 2',
    tools: ['LangChain', 'LangGraph', 'MCP SDK', 'Redis', 'Whisper', 'ElevenLabs'],
    accent: '#B45309',
  },
  {
    num: '24',
    phase: 'Engineer · Phase 4 · Production AI Engineering',
    label: 'AI Observability',
    desc: 'Trace, log, and monitor every LLM call in production. Cost and latency dashboards broken down by feature and user. Semantic caching, prompt caching, response caching. Prompt versioning: treat prompts like code. Debug a failed request end-to-end.',
    duration: 'Live sessions · 2',
    tools: ['Langfuse', 'OpenTelemetry', 'Python'],
    accent: '#0369A1',
  },
  {
    num: '25',
    phase: 'Engineer · Phase 4 · Production AI Engineering',
    label: 'Evals & Error Analysis',
    desc: 'Why AI features fail silently and how to build the systems that catch failures first. Read real traces, label real failures, build evals from what actually breaks. Deterministic checks, LLM-as-judge scoring, validating your judge. Regression tests that block deploys.',
    duration: 'Live sessions · 2',
    tools: ['Python', 'pytest', 'Langfuse', 'Promptfoo', 'Inspect AI'],
    accent: '#6D28D9',
  },
  {
    num: '26',
    phase: 'Engineer · Phase 4 · Production AI Engineering',
    label: 'Capstone Build',
    desc: 'Production RAG system, AI agent platform, or AI feature for an existing app — fully instrumented, evaluated, and shipped. Choose your build.',
    duration: 'Build sprint · 2 weeks',
    tools: ['Python', 'Langfuse', 'LangChain', 'Pinecone'],
    accent: '#DC2626',
  },
  {
    num: '27',
    phase: 'Engineer · Phase 4 · Production AI Engineering',
    label: 'Capstone Build (continued)',
    desc: "Continue the capstone build. Present a production-grade AI system: deployed, monitored, tested, and documented end-to-end.",
    duration: 'Build sprint · 2 weeks',
    tools: ['Python', 'Langfuse', 'LangChain', 'Pinecone'],
    accent: '#BE185D',
  },
  {
    num: '28',
    phase: 'Engineer · Phase 4 · Production AI Engineering',
    label: 'Adoption Sprint',
    desc: "Ship to real users. Watch real usage data. Fix real problems. The program doesn't end when you merge the PR, it ends when someone relies on what you built.",
    duration: 'Sprint · 1 week',
    tools: ['Analytics', 'Langfuse', 'User interviews'],
    accent: '#B45309',
  },
  {
    num: '29',
    phase: 'Engineer · Phase 4 · Production AI Engineering',
    label: 'Demo Day & Code Review',
    desc: "Code review with engineering mentors. Live demo in front of the cohort and industry engineers. Show what's deployed, who's using it, and what the data shows. Walk away with a portfolio project and a reviewed codebase.",
    duration: 'Live session · 1',
    tools: ['Slides', 'Loom', 'GitHub'],
    accent: '#0F766E',
  },
];

// ─── Composed per-track lists ──────────────────────────────────────────
const BUILDER_MODULES = [...EXISTING_MODULES, ...NEW_BUILDER_MODULES];
const ENGINEER_MODULES = [...EXISTING_MODULES, ...NEW_ENGINEER_MODULES];

const PROJECTS = [
  'AI-powered support ticket automation',
  'Sales ops & lead qualification agent',
  'HR resume screening workflow',
  'Research & competitive intelligence pipeline',
  'Personal AI email & task assistant',
];

const DIFFERENTIATORS = [
  'Cohort-based progression with accountability',
  'Live guided sessions focused on building',
  'Real-time debugging and workflow walkthroughs',
  'Peer learning through shared failures and use cases',
  'Instructor support during actual implementation',
];

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
  emoji: string;
}> = {
  'builder': {
    label: 'Builder Track',
    sublabel: 'Founders, operators, and anyone on a non-technical team',
    desc: 'For founders, operators, and anyone on a non-technical team who wants to automate work and build AI products, no coding required. 14 modules · ship AI workflows & products.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
    border: 'rgba(124,58,237,0.2)',
    emoji: '🧭',
  },
  engineer: {
    label: 'Engineer Track',
    sublabel: 'Engineers ready to become world-class 10x AI Engineers',
    desc: 'For engineers ready to become world-class 10x AI Engineers. 15 modules · basic coding required · ship production AI systems.',
    color: '#0F766E',
    bg: 'rgba(15,118,110,0.08)',
    border: 'rgba(15,118,110,0.2)',
    emoji: '🛠️',
  },
};

export default function GenAILaunchpadOverview({ track, onBack, onStartModule }: Props) {
  const meta = TRACK_META[track];
  const completedSections = useLearnerStore(s => s.completedSections);
  const modules = track === 'engineer' ? ENGINEER_MODULES : BUILDER_MODULES;
  const totalModules = modules.length;
  const availableModules = modules.filter(m => m.preReadNum).length;
  const getModuleProgress = (preReadNum: string | undefined, available: boolean) => {
    const sectionMeta = preReadNum ? GENAI_MODULE_SECTIONS[preReadNum] : undefined;
    const completedCount = sectionMeta ? completedSections[sectionMeta.moduleId]?.length ?? 0 : 0;
    const totalSections = sectionMeta?.total ?? 0;
    const percent = totalSections > 0 ? Math.min(100, Math.round((completedCount / totalSections) * 100)) : 0;
    let status: ModuleStatus = available ? 'available' : 'locked';

    if (available && completedCount > 0) status = 'in-progress';
    if (available && totalSections > 0 && completedCount >= totalSections) status = 'completed';

    return { completedCount, totalSections, percent, status };
  };

  return (
    <div className="editorial" style={{ minHeight: '100vh', background: 'var(--ed-cream)' }}>

      {/* Top bar */}
      <div className="screen-topbar" style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--ed-card)', borderBottom: '1px solid var(--ed-rule)',
        padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ed-ink3)', fontSize: '13px', fontFamily: 'inherit' }}>
          ← Back
        </button>
        <AirtribeLogo />
        <div style={{ width: '60px' }} />
      </div>

      <div className="overview-content" style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Track banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{
            borderRadius: '24px', padding: '28px 32px', marginBottom: '40px',
            background: `linear-gradient(115deg, ${meta.color}22 0%, ${meta.color}0C 45%, var(--ed-card) 100%)`,
            boxShadow: `0 8px 0 ${meta.color}38, 0 20px 48px ${meta.color}1C, inset 0 1.5px 0 rgba(255,255,255,0.75)`,
            border: `1.5px solid ${meta.color}2A`,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px',
            flexWrap: 'wrap' as const, position: 'relative' as const, overflow: 'hidden',
          }}>
          <div style={{ position: 'absolute', top: '-40px', left: '-10px', width: '200px', height: '200px', borderRadius: '50%', background: meta.color, opacity: 0.13, filter: 'blur(50px)', pointerEvents: 'none' }} />
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' as const }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', color: meta.color, marginBottom: '12px' }}>
              YOUR ASSIGNED TRACK
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px', flexShrink: 0,
                background: meta.color,
                boxShadow: `0 5px 0 ${meta.color}55, 0 8px 24px ${meta.color}35, inset 0 1px 0 rgba(255,255,255,0.3)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px',
              }}>{meta.emoji}</div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: meta.color, fontFamily: "'Lora', serif", lineHeight: 1.2 }}>{meta.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)', letterSpacing: '0.06em', marginTop: '3px' }}>{meta.sublabel}</div>
              </div>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--ed-ink)', lineHeight: 1.7, maxWidth: '480px' }}>{meta.desc}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px', position: 'relative' as const }}>
            {[
              { label: 'Modules', value: `${totalModules} modules` },
              { label: 'Available now', value: `${availableModules} pre-reads` },
            ].map(s => (
              <div key={s.label} style={{
                padding: '10px 16px', borderRadius: '14px',
                background: 'var(--ed-card)',
                boxShadow: `0 4px 0 ${meta.color}28, inset 0 1px 0 rgba(255,255,255,0.9)`,
                border: `1px solid ${meta.color}1E`,
              }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: meta.color, letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '2px', fontWeight: 700 }}>{s.label}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Module list header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '4px' }}>Your Learning Path</h2>
            <div style={{ fontSize: '13px', color: 'var(--ed-ink3)' }}>{availableModules} pre-reads are available now. More modules unlock week by week as the cohort progresses.</div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>
            {availableModules} of {totalModules} available
          </div>
        </div>

        {/* Module cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {modules.map((mod, i) => {
            const available = !!mod.preReadNum;
            const moduleProgress = getModuleProgress(mod.preReadNum, available);
            const ctaLabel = moduleProgress.status === 'completed'
              ? 'Review'
              : moduleProgress.status === 'in-progress'
                ? 'Continue'
                : 'Start';
            const statusLabel = moduleProgress.status === 'completed'
              ? 'COMPLETED'
              : moduleProgress.status === 'in-progress'
                ? 'IN PROGRESS'
                : 'AVAILABLE NOW';

            return (
            <motion.div
              key={mod.num}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              onClick={available ? () => onStartModule(mod.preReadNum!) : undefined}
              style={{
                borderRadius: '10px', padding: '18px 20px',
                background: 'var(--ed-card)',
                border: available ? `1.5px solid ${mod.accent}` : '1px solid var(--ed-rule)',
                borderLeft: `4px solid ${available ? mod.accent : 'var(--ed-rule)'}`,
                cursor: available ? 'pointer' : 'default',
                opacity: available ? 1 : 0.65,
                display: 'flex', alignItems: 'center', gap: '16px',
                transition: 'box-shadow 0.2s, transform 0.2s',
                boxShadow: available ? `0 2px 12px ${mod.accent}14` : 'none',
              }}
              whileHover={available ? { y: -2, boxShadow: `0 6px 20px ${mod.accent}22` } : {}}>

              {/* Module number */}
              <div style={{
                width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0,
                background: available ? mod.accent : 'var(--ed-cream)',
                border: available ? 'none' : '1px solid var(--ed-rule)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700,
                color: available ? '#fff' : 'var(--ed-ink3)',
              }}>
                {mod.num}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' as const }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif" }}>{mod.label}</span>
                  {available && (
                    <span style={{
                      padding: '2px 8px', borderRadius: '20px', fontSize: '8px',
                      fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.1em',
                      background: moduleProgress.status === 'completed' ? 'rgba(15,118,110,0.12)' : mod.accent,
                      color: moduleProgress.status === 'completed' ? '#0F766E' : '#fff',
                      border: moduleProgress.status === 'completed' ? '1px solid rgba(15,118,110,0.28)' : 'none',
                    }}>{statusLabel}</span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.55, marginBottom: '8px' }}>{mod.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' as const }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)' }}>⏱ {mod.duration}</span>
                </div>
                {moduleProgress.totalSections > 0 && moduleProgress.status !== 'available' && (
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ height: '5px', flex: 1, borderRadius: '999px', background: 'var(--ed-cream)', overflow: 'hidden', border: '1px solid var(--ed-rule)' }}>
                      <div style={{ width: `${moduleProgress.percent}%`, height: '100%', borderRadius: '999px', background: mod.accent }} />
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: mod.accent, fontWeight: 700 }}>
                      {moduleProgress.completedCount}/{moduleProgress.totalSections}
                    </span>
                  </div>
                )}
              </div>

              {/* Right side */}
              <div style={{ flexShrink: 0 }}>
                {available ? (
                  <div style={{
                    padding: '8px 16px', borderRadius: '6px',
                    background: mod.accent, color: '#fff',
                    fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
                    whiteSpace: 'nowrap' as const,
                  }}>
                    {ctaLabel} →
                  </div>
                ) : (
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '9px',
                    color: 'var(--ed-ink3)', letterSpacing: '0.08em',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    🔒 COMING SOON
                  </div>
                )}
              </div>
            </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <div style={{ marginTop: '40px', padding: '20px 24px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', fontSize: '13px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--ed-ink2)' }}>Cohort-based · n8n-first.</strong> Each module unlocks as the cohort progresses. Pre-reads are available before each live session so you arrive with context, not questions about the basics.
        </div>
      </div>
    </div>
  );
}

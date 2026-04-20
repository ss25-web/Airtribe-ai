'use client';

import { motion } from 'framer-motion';
import type { GenAITrack } from './genaiTypes';

const MODULES = [
  {
    num: '01',
    phase: 'Feb 7–13',
    label: 'Introduction to Generative AI',
    desc: 'How AI-native workflows differ from traditional systems, where LLMs fit in the stack, and the mental models that separate useful AI from hype.',
    duration: 'Pre-read · 20 min',
    tools: ['ChatGPT', 'Claude', 'Gemini'],
    available: true,
    accent: '#7C3AED',
  },
  {
    num: '02',
    phase: 'Feb 14–20',
    label: 'Prompt Engineering & LLM Foundations',
    desc: 'Crispy Framework for prompt structure, zero-shot vs few-shot, context window management, cost-efficient model selection, and recursive prompt refinement.',
    duration: 'Live sessions · 2',
    tools: ['OpenAI Playground', 'Claude', 'Zapier'],
    available: true,
    accent: '#2563EB',
  },
  {
    num: '03',
    phase: 'Feb 21–27',
    label: 'Research, Summarization & Drafting',
    desc: 'The Research → Summarize → Draft workflow, the 5W1H framework for summaries, COVE evaluation, and audience-specific insight compression.',
    duration: 'Live sessions · 2',
    tools: ['ChatGPT', 'Claude', 'Perplexity'],
    available: true,
    accent: '#0891B2',
  },
  {
    num: '04',
    phase: 'Feb 28 – Mar 6',
    label: 'Workflow Automation with n8n',
    desc: 'n8n fundamentals: triggers, nodes, app integrations, cloud hosting, AI agents, and database setup for dynamic data handling.',
    duration: 'Live sessions · 2',
    tools: ['n8n', 'Webhooks', 'Google Sheets'],
    available: true,
    accent: '#0F766E',
  },
  {
    num: '05',
    phase: 'Mar 7–13',
    label: 'Advanced n8n: Loops, Transforms & AI Agents',
    desc: 'Advanced workflow patterns: data transformation, conditional logic, loops, batching, human-in-the-loop systems, and building chat-based AI agents with memory.',
    duration: 'Live sessions · 2',
    tools: ['n8n', 'OpenAI', 'Gmail'],
    available: true,
    accent: '#059669',
  },
  {
    num: '06',
    phase: 'Mar 14–20',
    label: 'AI Agent Workflows — Building & Scaling',
    desc: 'EI agent automation, HR evaluation workflows, Gmail draft automation, LinkedIn content generation, approval flows, SERP-based content, and complaint categorization with RAG scoring.',
    duration: 'Live sessions · 2',
    tools: ['n8n', 'Gemini', 'LinkedIn'],
    available: true,
    accent: '#7C3AED',
  },
  {
    num: '07',
    phase: 'Mar 21–27',
    label: 'Model Context Protocol (MCP)',
    desc: 'MCP fundamentals, building MCP servers, integrating LLMs with Gmail and Calendar, n8n-based MCP workflows, browser and file-system automation, and Telegram bot setup.',
    duration: 'Live sessions · 2',
    tools: ['MCP', 'Claude', 'n8n'],
    available: true,
    accent: '#B45309',
  },
  {
    num: '08',
    phase: 'Mar 28 – Apr 3',
    label: 'RAG & Multi-Agent Orchestration',
    desc: 'RAG fundamentals, vectorization, chunking, Pinecone setup, multi-agent orchestration patterns, email-to-structured-data workflows, and scalable retrieval-augmented pipelines.',
    duration: 'Live sessions · 2',
    tools: ['Pinecone', 'n8n', 'Supabase'],
    available: false,
    accent: '#C2410C',
  },
  {
    num: '09',
    phase: 'Apr 4–10',
    label: 'Tech Foundations & Vibe Coding',
    desc: 'Frontend, backend, and database architecture; AI-assisted "vibe coding" with Cursor and Replit; Git/GitHub fundamentals; building and deploying apps with Streamlit.',
    duration: 'Live sessions · 2',
    tools: ['Cursor', 'Replit', 'GitHub'],
    available: false,
    accent: '#0369A1',
  },
  {
    num: '10',
    phase: 'Apr 11–17',
    label: 'Vibe Coding: Design → Debug → Deploy',
    desc: 'Rapid app building with Lovable, AI-assisted frontend and full-stack development, backend–frontend API integration, authentication, webhook handling, and portfolio-ready AI projects.',
    duration: 'Live sessions · 2',
    tools: ['Lovable', 'Replit', 'Copilot'],
    available: false,
    accent: '#6D28D9',
  },
  {
    num: '11',
    phase: 'Apr 18–24',
    label: 'Building Brand Identity with GenAI',
    desc: 'Brand core, emotional tone, manifesto, moodboard, brand story, and hero visual creation using GenAI. Key brand systems: imagery, color, and typography into a Brand Book.',
    duration: 'Live session · 1',
    tools: ['Midjourney', 'ChatGPT', 'Canva'],
    available: false,
    accent: '#DC2626',
  },
  {
    num: '12',
    phase: 'Apr 25 – May 1',
    label: 'Brand Book: Hands-On Lab',
    desc: 'Bring your brand identity together into a complete, cohesive Brand Book through a structured hands-on lab session.',
    duration: 'Lab session · 1',
    tools: ['Figma', 'Canva', 'GenAI'],
    available: false,
    accent: '#BE185D',
  },
  {
    num: '13',
    phase: 'May 2–8',
    label: 'Brand Assets & Campaign Creation',
    desc: 'Manifesto visual, lifestyle visual, hero product visual, mockups, video loops, audio signatures, and a launch-ready campaign system — all built with GenAI tools.',
    duration: 'Live session · 1',
    tools: ['Runway', 'ElevenLabs', 'Adobe'],
    available: false,
    accent: '#B45309',
  },
  {
    num: '14',
    phase: 'May 9–15',
    label: 'Voice Agents',
    desc: 'How voice agents work end-to-end, designing system prompts for voice, building inbound voice agents with Vapi, creating voice clones with ElevenLabs, and n8n automation integration.',
    duration: 'Live session · 1',
    tools: ['Vapi', 'ElevenLabs', 'n8n'],
    available: false,
    accent: '#0F766E',
  },
];

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
  module01Desc: string;
  module01Tools: string[];
}> = {
  'non-tech': {
    label: 'Workflow & Operator Track',
    sublabel: 'PMs, founders, ops, growth, and business teams',
    desc: 'Built for learners who need business-first language: which workflows deserve AI, where review checkpoints belong, and how to design safe, useful systems before getting deep into implementation detail.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
    border: 'rgba(124,58,237,0.2)',
    emoji: '🧭',
    module01Desc: 'How AI-native workflows differ from traditional systems, where n8n fits in the stack, and how non-technical teams should reason about triggers, review loops, and safe automation boundaries.',
    module01Tools: ['n8n', 'Webhooks', 'Slack'],
  },
  tech: {
    label: 'Tech Builder Track',
    sublabel: 'Engineers, developers, and hands-on automation builders',
    desc: 'Built for learners who want implementation depth: payloads, workflow boundaries, structured outputs, retries, observability, and how n8n becomes the control surface for production-grade AI systems.',
    color: '#0F766E',
    bg: 'rgba(15,118,110,0.08)',
    border: 'rgba(15,118,110,0.2)',
    emoji: '🛠️',
    module01Desc: 'How AI-native workflows differ from traditional systems, where n8n fits in the stack, and how technical teams should think about payloads, control logic, approvals, and execution reliability.',
    module01Tools: ['n8n', 'HTTP', 'JSON'],
  },
};

export default function GenAILaunchpadOverview({ track, onBack, onStartModule }: Props) {
  const meta = TRACK_META[track];
  const modules = MODULES.map((module) =>
    module.num === '01'
      ? { ...module, desc: meta.module01Desc, tools: meta.module01Tools }
      : module
  );

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)', letterSpacing: '0.1em' }}>
            GENAI LAUNCHPAD
          </span>
        </div>
        <div style={{ width: '60px' }} />
      </div>

      <div className="overview-content" style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Track banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{
            borderRadius: '14px', padding: '28px 32px', marginBottom: '40px',
            background: meta.bg, border: `1.5px solid ${meta.border}`,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px',
            flexWrap: 'wrap' as const,
          }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', color: meta.color, marginBottom: '10px' }}>
              YOUR ASSIGNED TRACK
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '24px' }}>{meta.emoji}</span>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", lineHeight: 1.2 }}>{meta.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: meta.color, letterSpacing: '0.06em', marginTop: '2px' }}>{meta.sublabel}</div>
              </div>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7, maxWidth: '480px' }}>{meta.desc}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
            {[
              { label: 'Duration', value: 'Weeks 0–15' },
              { label: 'Modules', value: '6 modules' },
              { label: 'Start with', value: 'Pre-read 01' },
            ].map(s => (
              <div key={s.label} style={{ padding: '8px 14px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'var(--ed-ink3)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '2px' }}>{s.label}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Module list header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '4px' }}>Your Learning Path</h2>
            <div style={{ fontSize: '13px', color: 'var(--ed-ink3)' }}>Pre-reads 01–04 are available now. More modules unlock week by week as the cohort progresses.</div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>
            6 of 6 available
          </div>
        </div>

        {/* Module cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {modules.map((mod, i) => (
            <motion.div
              key={mod.num}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              onClick={mod.available ? () => onStartModule(mod.num) : undefined}
              style={{
                borderRadius: '10px', padding: '18px 20px',
                background: 'var(--ed-card)',
                border: mod.available ? `1.5px solid ${mod.accent}` : '1px solid var(--ed-rule)',
                borderLeft: `4px solid ${mod.available ? mod.accent : 'var(--ed-rule)'}`,
                cursor: mod.available ? 'pointer' : 'default',
                opacity: mod.available ? 1 : 0.65,
                display: 'flex', alignItems: 'center', gap: '16px',
                transition: 'box-shadow 0.2s, transform 0.2s',
                boxShadow: mod.available ? `0 2px 12px ${mod.accent}14` : 'none',
              }}
              whileHover={mod.available ? { y: -2, boxShadow: `0 6px 20px ${mod.accent}22` } : {}}>

              {/* Module number */}
              <div style={{
                width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0,
                background: mod.available ? mod.accent : 'var(--ed-cream)',
                border: mod.available ? 'none' : '1px solid var(--ed-rule)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700,
                color: mod.available ? '#fff' : 'var(--ed-ink3)',
              }}>
                {mod.num}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' as const }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif" }}>{mod.label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: mod.accent, letterSpacing: '0.06em' }}>{mod.phase}</span>
                  {mod.available && (
                    <span style={{
                      padding: '2px 8px', borderRadius: '20px', fontSize: '8px',
                      fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.1em',
                      background: mod.accent, color: '#fff',
                    }}>AVAILABLE NOW</span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.55, marginBottom: '8px' }}>{mod.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' as const }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)' }}>⏱ {mod.duration}</span>
                  <span style={{ color: 'var(--ed-rule)', fontSize: '10px' }}>·</span>
                  {mod.tools.slice(0, 3).map(t => (
                    <span key={t} style={{
                      padding: '2px 7px', borderRadius: '4px', fontSize: '9px',
                      fontFamily: "'JetBrains Mono', monospace",
                      background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)',
                      color: 'var(--ed-ink3)',
                    }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Right side */}
              <div style={{ flexShrink: 0 }}>
                {mod.available ? (
                  <div style={{
                    padding: '8px 16px', borderRadius: '6px',
                    background: mod.accent, color: '#fff',
                    fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
                    whiteSpace: 'nowrap' as const,
                  }}>
                    Start →
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
          ))}
        </div>

        {/* Footer note */}
        <div style={{ marginTop: '40px', padding: '20px 24px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', fontSize: '13px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--ed-ink2)' }}>Cohort-based · n8n-first.</strong> Each module unlocks as the cohort progresses. Pre-reads are available before each live session so you arrive with context, not questions about the basics.
        </div>
      </div>
    </div>
  );
}

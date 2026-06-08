'use client';

import { motion } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import type { GenAITrack } from './genaiTypes';
import { AirtribeLogo } from './AirtribeBrand';

const MODULES = [
  {
    num: '01',
    phase: 'Phase 1 · AI Foundations',
    label: 'AI Fluency & Prompting',
    desc: 'How LLMs actually work: tokens, context windows, temperature. The TCREF Framework for reliable, repeatable prompts. Zero-shot, few-shot, chain-of-thought, meta-prompting. How to avoid hallucinations.',
    duration: 'Pre-read · 20 min',
    tools: ['ChatGPT', 'Claude', 'Gemini', 'Google AI Studio', 'OpenAI Playground'],
    available: true,
    accent: '#7C3AED',
  },
  {
    num: '02',
    phase: 'Phase 1 · AI Foundations',
    label: 'AI Workflows & Productivity',
    desc: 'AI for research, writing, presentations, and meetings. Connect AI to Gmail, Calendar, Drive, Slack. Build your own Custom GPT / Claude Project / Gemini Gem for your most repeated work.',
    duration: 'Live sessions · 2',
    tools: ['NotebookLM', 'Chronicle', 'Wispr Flow', 'ElevenLabs', 'Claude'],
    available: true,
    accent: '#2563EB',
  },
  {
    num: '03',
    phase: 'Phase 1 · AI Foundations',
    label: 'AI Agents & Track Selection',
    desc: 'What an AI agent is, and when to use one vs a workflow vs a prompt. The automation spectrum from no-code to code. Watch one automation built three ways. Choose your track with confidence.',
    duration: 'Live sessions · 2',
    tools: ['ChatGPT', 'Claude', 'n8n', 'Replit', 'Midjourney'],
    available: true,
    accent: '#0891B2',
  },
  {
    num: '04',
    phase: 'Phase 2 · Automation Mastery',
    label: 'Workflow Automation with n8n',
    desc: 'Identify which tasks are worth automating and calculate ROI. n8n fundamentals: nodes, triggers, connections, credentials. Multi-step workflows with AI reasoning, error handling, retries, and approval gates.',
    duration: 'Live sessions · 2',
    tools: ['n8n', 'OpenAI API', 'Claude API'],
    available: true,
    accent: '#0F766E',
  },
  {
    num: '05',
    phase: 'Phase 2 · Automation Mastery',
    label: 'AI Agents for Business',
    desc: "Agents that don't just answer questions — they take action (email, CRM, Slack). Memory for past interactions. Multi-step planning, execution, and verification. Voice agents for lead-qual and support.",
    duration: 'Live sessions · 2',
    tools: ['n8n', 'Zapier', 'Make.com', 'Claude API', 'MCP', 'Vapi'],
    available: true,
    accent: '#059669',
  },
  {
    num: '06',
    phase: 'Phase 2 · Automation Mastery',
    label: 'Data Analysis with AI',
    desc: 'Ask questions of your data in plain English — no SQL. Upload a CSV, get charts, trends, and anomalies in minutes. Build AI-powered dashboards and go from raw data to a clear "so what" every time.',
    duration: 'Live sessions · 2',
    tools: ['ChatGPT', 'Claude', 'Excel', 'Python', 'SQL'],
    available: true,
    accent: '#7C3AED',
  },
  {
    num: '07',
    phase: 'Phase 3 · Product Building',
    label: 'Tech for Builders',
    desc: 'How web apps work: frontend, backend, database, API. GitHub and Vercel: deploy your first live page. Read error messages and know what to give AI when something breaks.',
    duration: 'Live sessions · 2',
    tools: ['GitHub', 'Vercel', 'Chrome DevTools', 'Postman', 'Claude'],
    available: true,
    accent: '#B45309',
  },
  {
    num: '08',
    phase: 'Phase 3 · Product Building',
    label: 'AI Product Thinking & Vibe Coding',
    desc: "Decide what to build, who it's for, and why AI is the right solution. Scope your MVP to test the one assumption that matters most. Vibe coding: you describe, AI builds. Replit, Cursor, Claude Code.",
    duration: 'Live sessions · 2',
    tools: ['Replit', 'Cursor', 'Claude Code'],
    available: false,
    accent: '#C2410C',
  },
  {
    num: '09',
    phase: 'Phase 3 · Product Building',
    label: 'Building AI-Powered Products',
    desc: "Add a chatbot, recommendation engine, or AI search to your product. Connect to OpenAI, Claude, or any AI API. Answer questions from your own data. Design AI UX that doesn't frustrate users.",
    duration: 'Live sessions · 2',
    tools: ['Claude API', 'OpenAI API', 'Composio', 'Replit', 'Cursor'],
    available: false,
    accent: '#0369A1',
  },
  {
    num: '10',
    phase: 'Phase 3 · Product Building',
    label: 'GTM & Growth',
    desc: 'Build a content engine: one brief to blog, LinkedIn, X, email. Position your product to win. Find growth bottlenecks and fix them with AI experiments. Produce ad creatives, demo videos, personalized outreach, and get cited by ChatGPT, Perplexity, and Google AI Overviews.',
    duration: 'Live sessions · 2',
    tools: ['Claude', 'ChatGPT', 'HeyGen', 'ElevenLabs', 'AdCreative.ai', 'Buffer'],
    available: false,
    accent: '#6D28D9',
  },
  {
    num: '11',
    phase: 'Phase 4 · Capstone',
    label: 'Capstone Build',
    desc: 'Choose your build — launch an MVP, build an automation system end-to-end for a real brand, or ship an internal tool deployed inside your company with teammates actively using it.',
    duration: 'Build sprint · 2 weeks',
    tools: ['Replit', 'Cursor', 'Claude', 'n8n'],
    available: false,
    accent: '#DC2626',
  },
  {
    num: '12',
    phase: 'Phase 4 · Capstone',
    label: 'Capstone Build (continued)',
    desc: 'Continue the capstone build. Present a working AI-powered build, not a prototype, not a demo — something people are actually using.',
    duration: 'Build sprint · 2 weeks',
    tools: ['Replit', 'Cursor', 'Claude', 'n8n'],
    available: false,
    accent: '#BE185D',
  },
  {
    num: '13',
    phase: 'Phase 4 · Capstone',
    label: 'Adoption Sprint',
    desc: 'Take your build to real users, collect usage data, and iterate based on what you observe — not what you assumed. The program ends when someone uses it, not when you build it.',
    duration: 'Sprint · 1 week',
    tools: ['Analytics', 'Hotjar', 'User interviews'],
    available: false,
    accent: '#B45309',
  },
  {
    num: '14',
    phase: 'Phase 4 · Capstone',
    label: 'Demo Day',
    desc: 'Present your build live to the cohort and industry leaders. Show what you built, who used it, and what you learned. Walk away with a portfolio-ready case study.',
    duration: 'Live session · 1',
    tools: ['Slides', 'Loom', 'Live demo'],
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
  module01Desc: string;
  module01Tools: string[];
}> = {
  'builder': {
    label: 'Builder Track',
    sublabel: 'Founders, operators, and anyone on a non-technical team',
    desc: 'For founders, operators, and anyone on a non-technical team who wants to automate work and build AI products, no coding required. 14 modules · ship AI workflows & products.',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
    border: 'rgba(124,58,237,0.2)',
    emoji: '🧭',
    module01Desc: 'How LLMs actually work — tokens, context windows, temperature. The TCREF Framework for reliable, repeatable prompts. Zero-shot, few-shot, chain-of-thought, meta-prompting. How non-technical teams use AI responsibly at work.',
    module01Tools: ['ChatGPT', 'Claude', 'Gemini', 'OpenAI Playground'],
  },
  engineer: {
    label: 'Engineer Track',
    sublabel: 'Engineers ready to become world-class 10x AI Engineers',
    desc: 'For engineers ready to become world-class 10x AI Engineers. 15 modules · basic coding required · ship production AI systems.',
    color: '#0F766E',
    bg: 'rgba(15,118,110,0.08)',
    border: 'rgba(15,118,110,0.2)',
    emoji: '🛠️',
    module01Desc: 'How LLMs actually work — tokens, context windows, temperature. The TCREF Framework for reliable, repeatable prompts. Zero-shot, few-shot, chain-of-thought, meta-prompting. The model landscape and what it costs.',
    module01Tools: ['ChatGPT', 'Claude', 'Gemini', 'OpenAI Playground'],
  },
};

export default function GenAILaunchpadOverview({ track, onBack, onStartModule }: Props) {
  const meta = TRACK_META[track];
  const completedSections = useLearnerStore(s => s.completedSections);
  const modules = MODULES.map((module) =>
    module.num === '01'
      ? { ...module, desc: meta.module01Desc, tools: meta.module01Tools }
      : module
  );
  const getModuleProgress = (moduleNum: string, available: boolean) => {
    const sectionMeta = GENAI_MODULE_SECTIONS[moduleNum];
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
              { label: 'Modules', value: '14 modules' },
              { label: 'Start with', value: 'Pre-read 01' },
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
            <div style={{ fontSize: '13px', color: 'var(--ed-ink3)' }}>Pre-reads 01–04 are available now. More modules unlock week by week as the cohort progresses.</div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>
            6 of 6 available
          </div>
        </div>

        {/* Module cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {modules.map((mod, i) => {
            const moduleProgress = getModuleProgress(mod.num, mod.available);
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
                  {mod.available && (
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
                {mod.available ? (
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

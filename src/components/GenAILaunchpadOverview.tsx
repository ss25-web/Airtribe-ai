'use client';

import { motion } from 'framer-motion';
import type { GenAITrack } from './genaiTypes';

const MODULES = [
  {
    num: '01',
    phase: 'Week 0',
    label: 'Orientation & AI Mindset',
    desc: 'How AI-native workflows differ from traditional systems, where n8n fits in the stack, and the first webhook → LLM → Slack mental model.',
    duration: 'Pre-read · 20 min',
    tools: ['n8n', 'Webhooks', 'Slack'],
    available: true,
    accent: '#7C3AED',
  },
  {
    num: '02',
    phase: 'Weeks 1–3',
    label: 'Prompt Engineering & LLM Foundations',
    desc: 'Prompt structure, reliability, hallucinations, context windows, and how LLM behavior changes inside real automation systems.',
    duration: 'Pre-read · planned',
    tools: ['ChatGPT', 'Claude', 'OpenAI Playground'],
    available: false,
    accent: '#2563EB',
  },
  {
    num: '03',
    phase: 'Weeks 4–9',
    label: 'n8n-Centric Automation & AI Agents',
    desc: 'Deep workflow design, retries, fallbacks, approvals, agent loops, and production-style orchestration patterns in n8n.',
    duration: 'Track block · planned',
    tools: ['n8n', 'LangChain', 'CrewAI'],
    available: false,
    accent: '#0F766E',
  },
  {
    num: '04',
    phase: 'Weeks 10–11',
    label: 'Build & Launch an AI Tool',
    desc: 'Expose workflows through webhooks or forms, validate inputs at the boundary, and keep n8n as the execution and decision layer.',
    duration: 'Pre-read · planned',
    tools: ['n8n', 'Supabase', 'Vercel'],
    available: false,
    accent: '#C2410C',
  },
  {
    num: '05',
    phase: 'Weeks 12–13',
    label: 'Multimodal AI',
    desc: 'Image, audio, and video workflows with async job control, polling, timeout handling, and output review loops.',
    duration: 'Advanced track · planned',
    tools: ['Flux', 'Runway', 'ElevenLabs'],
    available: false,
    accent: '#DC2626',
  },
  {
    num: '06',
    phase: 'Weeks 13–15',
    label: 'Capstone Project & Demo Day',
    desc: 'Ship a portfolio-ready, production-style GenAI system with strong workflow clarity, reliability, and maintainability.',
    duration: 'Capstone · planned',
    tools: ['n8n', 'APIs', 'Observability'],
    available: false,
    accent: '#7C2D12',
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
  onStartPreRead: () => void;
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

export default function GenAILaunchpadOverview({ track, onBack, onStartPreRead }: Props) {
  const meta = TRACK_META[track];
  const modules = MODULES.map((module) =>
    module.num === '01'
      ? { ...module, desc: meta.module01Desc, tools: meta.module01Tools }
      : module
  );

  return (
    <div className="editorial" style={{ minHeight: '100vh', background: 'var(--ed-cream)' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'var(--ed-card)',
          borderBottom: '1px solid var(--ed-rule)',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
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

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            borderRadius: '18px',
            padding: '32px',
            marginBottom: '30px',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(79,70,229,0.08))',
            border: '1px solid rgba(124,58,237,0.18)',
          }}
        >
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', color: '#7C3AED', marginBottom: '14px' }}>
            N8N-CENTRIC AUTOMATION & AI AGENTS
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 54px)', lineHeight: 1.06, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '16px' }}>
            GenAI Launchpad
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--ed-ink2)', lineHeight: 1.75, maxWidth: '760px', marginBottom: '24px' }}>
            A cohort-based, hands-on program that takes learners from GenAI fundamentals to production-grade AI workflows and agentic systems. n8n is the orchestration layer throughout: workflow control, decisioning, retries, observability, and reliability live there.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
            {[
              { label: 'Format', value: 'Cohort-based' },
              { label: 'Core Spine', value: 'n8n-first' },
              { label: 'Arc', value: 'Weeks 0–15' },
              { label: 'Outcome', value: 'Production-ready systems' },
            ].map((item) => (
              <div key={item.label} style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'var(--ed-ink3)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          style={{
            borderRadius: '14px',
            padding: '24px 26px',
            marginBottom: '26px',
            background: meta.bg,
            border: `1.5px solid ${meta.border}`,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap',
          }}
        >
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
            <div style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7, maxWidth: '560px' }}>{meta.desc}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
            <div style={{ padding: '8px 14px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'var(--ed-ink3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Module 01 Lens</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)' }}>{track === 'tech' ? 'Implementation-first' : 'Workflow-first'}</div>
            </div>
            <div style={{ padding: '8px 14px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'var(--ed-ink3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Language Shift</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)' }}>{track === 'tech' ? 'Payloads, nodes, retries' : 'Use cases, review loops'}</div>
            </div>
          </div>
        </motion.div>

        <section style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap' as const, gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '4px' }}>Program Structure</h2>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink3)' }}>Each pre-read or phase block gets its own module card. Actions live with the module, not elsewhere on the page.</div>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>
              1 of 6 available
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {modules.map((mod, index) => (
              <motion.div
                key={mod.num}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                style={{
                  borderRadius: '10px',
                  padding: '18px 20px',
                  background: 'var(--ed-card)',
                  border: mod.available ? `1.5px solid ${mod.accent}` : '1px solid var(--ed-rule)',
                  borderLeft: `4px solid ${mod.available ? mod.accent : 'var(--ed-rule)'}`,
                  opacity: mod.available ? 1 : 0.7,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    flexShrink: 0,
                    background: mod.available ? mod.accent : 'var(--ed-cream)',
                    border: mod.available ? 'none' : '1px solid var(--ed-rule)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 700,
                    color: mod.available ? '#fff' : 'var(--ed-ink3)',
                  }}
                >
                  {mod.num}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' as const }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif" }}>{mod.label}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: mod.accent, letterSpacing: '0.08em' }}>
                      {mod.phase}
                    </span>
                    {mod.available && (
                      <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.1em', background: mod.accent, color: '#fff' }}>
                        AVAILABLE NOW
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.6, marginBottom: '8px' }}>{mod.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' as const }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)' }}>{mod.duration}</span>
                    <span style={{ color: 'var(--ed-rule)', fontSize: '10px' }}>·</span>
                    {mod.tools.map((tool) => (
                      <span key={tool} style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', color: 'var(--ed-ink3)' }}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  {mod.available ? (
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onStartPreRead}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '6px',
                        background: mod.accent,
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap' as const,
                      }}
                    >
                      Open Pre-Read →
                    </motion.button>
                  ) : (
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.08em', whiteSpace: 'nowrap' as const }}>
                      COMING SOON
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '18px', marginBottom: '28px' }}>
          <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#7C3AED', letterSpacing: '0.12em', marginBottom: '10px' }}>WHO THIS IS FOR</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '12px' }}>Built for operators who want real system capability</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
              <div>Product managers and product leaders</div>
              <div>Engineers and developers</div>
              <div>Founders, operators, growth, and ops professionals</div>
              <div>No prior API or automation experience required; APIs, JSON, and webhooks are taught contextually through real workflows.</div>
            </div>
          </div>

          <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#0F766E', letterSpacing: '0.12em', marginBottom: '10px' }}>WHY IT FEELS DIFFERENT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
              {DIFFERENTIATORS.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
          <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#C2410C', letterSpacing: '0.12em', marginBottom: '10px' }}>GUIDED PROJECTS</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '12px' }}>Production-style workflows, built step by step</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PROJECTS.map((project) => (
                <div key={project} style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', fontSize: '13px', color: 'var(--ed-ink2)' }}>
                  {project}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#2563EB', letterSpacing: '0.12em', marginBottom: '10px' }}>PROGRAM PROMISE</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '12px' }}>The goal is not tool familiarity. It is system capability.</h3>
            <div style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
              Learners should leave able to design, reason about, debug, and maintain AI workflows that solve real operational problems. That means n8n is not treated as decoration around the model. It is the layer where reliability, control, and maintainability are enforced.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

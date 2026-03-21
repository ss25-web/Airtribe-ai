'use client';

import { motion } from 'framer-motion';
import type { Track } from './pm-fundamentals/designSystem';

const TRACK_META = {
  'new-pm': {
    label: 'Breakout Track',
    sublabel: '0–2 years experience',
    desc: 'Master the core PM frameworks, build a standout capstone project, and learn to translate ideas into clear requirements. Built for people entering product for the first time.',
    color: '#4F46E5',
    bg: 'rgba(79,70,229,0.08)',
    border: 'rgba(79,70,229,0.2)',
    emoji: '🌱',
  },
  'apm': {
    label: 'Scale Track',
    sublabel: '2–7 years experience',
    desc: 'Go beyond features to own a product roadmap, lead cross-functional teams with influence, and use AI-driven analytics to make data-informed decisions.',
    color: '#7843EE',
    bg: 'rgba(120,67,238,0.08)',
    border: 'rgba(120,67,238,0.2)',
    emoji: '⚡',
  },
};

const MODULES = [
  {
    num: '01',
    label: 'Fundamentals of Product Management',
    desc: "The PM role in tech companies, what separates great PMs from good ones, how product thinking solves problems at scale, and how GenAI is transforming every PM's toolkit.",
    duration: '45 min',
    tools: ['ChatGPT', 'Claude', 'Lovable'],
    available: true,
    accent: '#4F46E5',
  },
  {
    num: '02',
    label: 'Problem Discovery & User Research',
    desc: 'Define customer segments, run user interviews, and turn messy research notes into a crisp problem statement that gets the team aligned.',
    duration: '45 min',
    tools: ['Notion', 'Dovetail', 'Kraftful'],
    available: true,
    accent: '#0097A7',
  },
  {
    num: '03',
    label: 'Problem Framing & Prioritization',
    desc: 'Jobs to Be Done, RICE, MoSCoW — and AI tools to accelerate decision-making and roadmap prioritization.',
    duration: '45 min',
    tools: ['OpenAI', 'Jira', 'Kraftful'],
    available: false,
    accent: '#0097A7',
  },
  {
    num: '04',
    label: 'UX & Design Collaboration',
    desc: 'Express product ideas visually, give actionable design feedback, and validate with users — using AI to speed up prototyping.',
    duration: '45 min',
    tools: ['Figma', 'Lovable AI'],
    available: false,
    accent: '#E07A5F',
  },
  {
    num: '05',
    label: 'Communication for PMs',
    desc: 'Manage stakeholders, write effective PRDs, and present product roadmaps clearly. Practice with AI for executive-level audiences.',
    duration: '40 min',
    tools: ['OpenAI', 'Jasper AI'],
    available: false,
    accent: '#E07A5F',
  },
  {
    num: '06',
    label: 'Analytics & Metrics',
    desc: 'Define success metrics, North Star metrics, funnel and cohort analysis. Run A/B tests and predictive modelling with AI.',
    duration: '50 min',
    tools: ['Google Analytics', 'Amplitude', 'ChatGPT'],
    available: false,
    accent: '#158158',
  },
  {
    num: '07',
    label: 'Product Launch & Growth',
    desc: 'Distribution, targeting, and iterative launches. AI-driven growth strategies, positioning, and adoption frameworks.',
    duration: '40 min',
    tools: ['Jasper AI', 'Amplitude', 'ChatGPT'],
    available: false,
    accent: '#158158',
  },
  {
    num: '08',
    label: 'Tech 101 for PMs',
    desc: 'APIs, databases, system design, and scalability — enough to collaborate confidently with engineering teams.',
    duration: '45 min',
    tools: ['Postman', 'ChatGPT'],
    available: false,
    accent: '#7843EE',
  },
  {
    num: '09',
    label: 'LLMs & RAGs for PMs',
    desc: 'How AI systems work, prompt engineering for PM workflows, and retrieval-augmented generation for smarter products.',
    duration: '50 min',
    tools: ['LangChain', 'OpenAI Playground'],
    available: false,
    accent: '#7843EE',
  },
  {
    num: '10',
    label: 'Vibe Coding for PMs',
    desc: 'Build dashboards, prototypes, and automation tools using AI prompts — products that would normally take weeks, in hours.',
    duration: '50 min',
    tools: ['Lovable AI', 'Replit', 'Copilot'],
    available: false,
    accent: '#B5720A',
  },
  {
    num: '11',
    label: 'AI Systems in Action',
    desc: 'Design workflows, build multi-agent systems, and understand AI product monetization and evaluation.',
    duration: '50 min',
    tools: ['Zapier', 'Make', 'Crew AI', 'GPTs'],
    available: false,
    accent: '#B5720A',
  },
];

interface Props {
  track: Track;
  onStartModule: (moduleNum: string) => void;
  onBack: () => void;
}

export default function CourseOverview({ track, onStartModule, onBack }: Props) {
  const meta = TRACK_META[track];

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
          <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: 'linear-gradient(135deg, #7843EE, #4F46E5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)', letterSpacing: '0.1em' }}>
            AI-FIRST PRODUCT MANAGEMENT
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
              { label: 'Duration', value: '16 weeks' },
              { label: 'Modules', value: '11 modules' },
              { label: 'Start with', value: 'Module 1' },
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
            <div style={{ fontSize: '13px', color: 'var(--ed-ink3)' }}>Modules 1–2 are available now. Modules 3–11 unlock week by week.</div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>
            2 of 11 available
          </div>
        </div>

        {/* Module cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MODULES.map((mod, i) => (
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
                boxShadow: mod.available ? '0 2px 12px rgba(79,70,229,0.08)' : 'none',
              }}
              whileHover={mod.available ? { y: -2, boxShadow: '0 6px 20px rgba(79,70,229,0.14)' } : {}}>

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
        <div style={{ marginTop: '32px', padding: '16px 20px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', textAlign: 'center' as const }}>
          <div style={{ fontSize: '13px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>
            Modules 1–11 are part of the <strong style={{ color: 'var(--ed-ink)' }}>AI-First Product Management</strong> program.
            Module 1 is available now — the full program unlocks week by week.
          </div>
        </div>
      </div>
    </div>
  );
}

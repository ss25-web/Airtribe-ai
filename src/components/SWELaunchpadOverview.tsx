'use client';

import { motion } from 'framer-motion';
import type { SWETrack } from './sweTypes';

const MODULES = [
  {
    num: '01',
    phase: 'Week 0',
    label: 'How Software Actually Works',
    baseDuration: 'Pre-read · 25 min',
    tools: { python: ['Python 3', 'pip', 'VS Code'], java: ['JDK 21', 'Maven', 'VS Code'], nodejs: ['Node.js', 'npm', 'VS Code'] },
    available: true,
    accent: '#16A34A',
  },
  {
    num: '02',
    phase: 'Weeks 1–2',
    label: 'Core Language Fundamentals',
    baseDuration: 'Pre-read · planned',
    tools: { python: ['Variables', 'Functions', 'OOP'], java: ['Types', 'Classes', 'Interfaces'], nodejs: ['ES6+', 'Closures', 'Async'] },
    available: false,
    accent: '#0369A1',
  },
  {
    num: '03',
    phase: 'Weeks 3–5',
    label: 'Building Your First API',
    baseDuration: 'Track block · planned',
    tools: { python: ['FastAPI', 'Pydantic', 'uvicorn'], java: ['Spring Boot', 'REST', 'JPA'], nodejs: ['Express', 'REST', 'Middleware'] },
    available: false,
    accent: '#7C3AED',
  },
  {
    num: '04',
    phase: 'Weeks 6–8',
    label: 'Data, Storage & Persistence',
    baseDuration: 'Pre-read · planned',
    tools: { python: ['SQLAlchemy', 'PostgreSQL', 'Redis'], java: ['Hibernate', 'JDBC', 'PostgreSQL'], nodejs: ['Prisma', 'PostgreSQL', 'MongoDB'] },
    available: false,
    accent: '#CA8A04',
  },
  {
    num: '05',
    phase: 'Weeks 9–11',
    label: 'Testing, Debugging & Reliability',
    baseDuration: 'Pre-read · planned',
    tools: { python: ['pytest', 'coverage', 'logging'], java: ['JUnit 5', 'Mockito', 'TestContainers'], nodejs: ['Jest', 'Supertest', 'Debugging'] },
    available: false,
    accent: '#DC2626',
  },
  {
    num: '06',
    phase: 'Weeks 12–14',
    label: 'Deploying & Shipping to Production',
    baseDuration: 'Capstone · planned',
    tools: { python: ['Docker', 'CI/CD', 'Railway'], java: ['Docker', 'GitHub Actions', 'AWS'], nodejs: ['Docker', 'Vercel', 'GitHub Actions'] },
    available: false,
    accent: '#7C2D12',
  },
];

const TRACK_META: Record<SWETrack, {
  label: string;
  sublabel: string;
  desc: string;
  color: string;
  bg: string;
  border: string;
  emoji: string;
  module01Desc: string;
}> = {
  python: {
    label: 'Python Track',
    sublabel: 'Data engineers, automation builders, and ML practitioners',
    desc: 'Built for learners who want to write clean, expressive code fast. Python is the language of data pipelines, ML models, and automation scripts. You will build real projects while mastering the language\'s philosophy: readability counts.',
    color: '#16A34A',
    bg: 'rgba(22,163,74,0.08)',
    border: 'rgba(22,163,74,0.2)',
    emoji: '🐍',
    module01Desc: 'How Python code runs through the CPython interpreter, what pip and virtual environments do, how to read a traceback, and what makes Python different from compiled languages — before writing your first script.',
  },
  java: {
    label: 'Java Track',
    sublabel: 'Backend engineers, enterprise developers, and Android builders',
    desc: 'Built for learners who want structure, reliability, and production-grade thinking from day one. Java\'s strong typing and the JVM ecosystem teach you how to build systems that scale — and how to reason about code that outlasts the team that wrote it.',
    color: '#0369A1',
    bg: 'rgba(3,105,161,0.08)',
    border: 'rgba(3,105,161,0.2)',
    emoji: '☕',
    module01Desc: 'How Java compiles to bytecode, what the JVM actually does at runtime, how Maven manages dependencies, and why Java\'s verbosity is a feature for teams — before writing your first class.',
  },
  nodejs: {
    label: 'Node.js Track',
    sublabel: 'Full-stack developers, web engineers, and API builders',
    desc: 'Built for learners who already know or are learning JavaScript on the frontend and want to take those skills to the backend. Node\'s event-driven model and the npm ecosystem let you build APIs, real-time features, and full-stack products with one language.',
    color: '#CA8A04',
    bg: 'rgba(202,138,4,0.08)',
    border: 'rgba(202,138,4,0.2)',
    emoji: '⚡',
    module01Desc: 'How Node.js runs JavaScript outside the browser using V8, what the event loop actually is, how npm and package.json work, and when async/await matters — before building your first HTTP server.',
  },
};

interface Props {
  track: SWETrack;
  onBack: () => void;
  onStartPreRead: () => void;
}

export default function SWELaunchpadOverview({ track, onBack, onStartPreRead }: Props) {
  const meta = TRACK_META[track];

  const modules = MODULES.map(mod => ({
    ...mod,
    tools: mod.tools[track],
    desc: mod.num === '01' ? meta.module01Desc : getModuleDesc(mod.num, track),
  }));

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
          <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: 'linear-gradient(135deg, #16A34A, #0369A1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
              <rect x="9" y="2" width="5" height="5" rx="1" fill="white" />
              <rect x="2" y="9" width="5" height="5" rx="1" fill="white" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
            </svg>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)', letterSpacing: '0.1em' }}>
            SOFTWARE ENGINEERING LAUNCHPAD
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
              { label: 'Duration', value: 'Weeks 0–14' },
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
            <div style={{ fontSize: '13px', color: 'var(--ed-ink3)' }}>Pre-read 01 is available now. More modules unlock as the cohort progresses.</div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>
            1 of 6 available
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
              onClick={mod.available ? onStartPreRead : undefined}
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

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' as const }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif" }}>{mod.label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: mod.accent, letterSpacing: '0.06em' }}>{mod.phase}</span>
                  {mod.available && (
                    <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.1em', background: mod.accent, color: '#fff' }}>
                      AVAILABLE NOW
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.55, marginBottom: '8px' }}>{mod.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' as const }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)' }}>⏱ {mod.baseDuration}</span>
                  <span style={{ color: 'var(--ed-rule)', fontSize: '10px' }}>·</span>
                  {mod.tools.slice(0, 3).map((t: string) => (
                    <span key={t} style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', color: 'var(--ed-ink3)' }}>{t}</span>
                  ))}
                </div>
              </div>

              <div style={{ flexShrink: 0 }}>
                {mod.available ? (
                  <div style={{ padding: '8px 16px', borderRadius: '6px', background: mod.accent, color: '#fff', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap' as const }}>
                    Start →
                  </div>
                ) : (
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🔒 COMING SOON
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '40px', padding: '20px 24px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', fontSize: '13px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--ed-ink2)' }}>Cohort-based · build-first.</strong> Each module unlocks as the cohort progresses. Pre-reads are available before each live session so you arrive ready to build, not to listen to theory.
        </div>
      </div>
    </div>
  );
}

function getModuleDesc(num: string, track: SWETrack): string {
  const descs: Record<string, Record<SWETrack, string>> = {
    '02': {
      python: 'Variables, data types, control flow, functions, and object-oriented programming in Python. You will learn when to use classes vs functions and how to write Pythonic code that other engineers will want to read.',
      java: 'Primitive types, classes, interfaces, inheritance, and generics in Java. You will learn why Java\'s type system catches bugs before they reach production and how to structure code that survives team growth.',
      nodejs: 'ES6+ syntax, closures, prototypes, async/await, and the event loop in depth. You will learn how JavaScript\'s flexibility works for you — and when it works against you.',
    },
    '03': {
      python: 'Build a REST API with FastAPI including request validation, response models, and automatic documentation. You will understand how HTTP works, what a route handler does, and how to structure a real backend.',
      java: 'Build a REST API with Spring Boot including controllers, services, repositories, and dependency injection. You will understand the layered architecture that most enterprise Java backends follow.',
      nodejs: 'Build a REST API with Express.js including routing, middleware, error handling, and request validation. You will understand the request-response cycle and how middleware chains compose into a real backend.',
    },
    '04': {
      python: 'Connect your FastAPI app to PostgreSQL with SQLAlchemy ORM. You will write migrations, model relationships, handle transactions, and learn when to drop down to raw SQL for performance.',
      java: 'Connect your Spring Boot app to PostgreSQL with Spring Data JPA. You will understand entity mapping, JPQL queries, transactions, and when Hibernate\'s magic becomes a liability.',
      nodejs: 'Connect your Express app to PostgreSQL with Prisma ORM. You will write schema files, run migrations, query with type safety, and understand how connection pooling keeps production fast.',
    },
    '05': {
      python: 'Write pytest unit and integration tests, measure coverage, and learn to debug Python with breakpoints and logging. You will ship code you can actually trust.',
      java: 'Write JUnit 5 tests, mock dependencies with Mockito, and spin up real databases in tests with TestContainers. You will learn what makes a test reliable versus one that creates false confidence.',
      nodejs: 'Write Jest unit tests and Supertest integration tests for your Express API. You will learn how to mock modules, test async code, and catch regressions before your users do.',
    },
    '06': {
      python: 'Containerise your Python app with Docker, set up a GitHub Actions CI pipeline, and deploy to a cloud provider. You will go from "works on my machine" to a URL you can share.',
      java: 'Containerise your Spring Boot app with Docker, configure GitHub Actions for build and test, and deploy to AWS or Railway. You will learn how Java apps run in production containers.',
      nodejs: 'Deploy your Node.js app with Vercel or Docker, set up GitHub Actions for continuous deployment, and add environment variable management. You will ship to production with confidence.',
    },
  };
  return descs[num]?.[track] ?? 'Content planned for this module.';
}

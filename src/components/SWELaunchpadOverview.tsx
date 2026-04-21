'use client';

import { motion } from 'framer-motion';
import type { SWETrack, SWELevel } from './sweTypes';

// ── Shared module list (Python & Node.js) ──────────────────────────────────
const SHARED_MODULES: { num: string; phase: string; label: string; baseDuration: string; tools: Record<string, string[]>; available: boolean; accent: string; desc?: string }[] = [
  {
    num: '00', phase: 'Before You Begin', label: 'Language Basics',
    baseDuration: 'Interactive · 30 min · 3D tools',
    tools: { python: ['Variables', 'Types', 'Functions'], nodejs: ['let/const', 'Arrays', 'Async'] },
    available: true, accent: '#7C3AED',
    desc: 'Five interactive 3D sections covering variables, types, control flow, functions, and your first real program — with Three.js-powered visualisations for each concept. No experience required.',
  },
  {
    num: '01', phase: 'Week 0', label: 'How Software Actually Works',
    baseDuration: 'Pre-read · 25 min',
    tools: { python: ['Python 3', 'pip', 'VS Code'], nodejs: ['Node.js', 'npm', 'VS Code'] },
    available: true, accent: '#16A34A',
  },
  {
    num: '02', phase: 'Weeks 1–2', label: 'Core Language Fundamentals',
    baseDuration: 'Pre-read · planned',
    tools: { python: ['Variables', 'Functions', 'OOP'], nodejs: ['ES6+', 'Closures', 'Async'] },
    available: false, accent: '#0369A1',
  },
  {
    num: '03', phase: 'Weeks 3–5', label: 'Building Your First API',
    baseDuration: 'Track block · planned',
    tools: { python: ['FastAPI', 'Pydantic', 'uvicorn'], nodejs: ['Express', 'REST', 'Middleware'] },
    available: false, accent: '#7C3AED',
  },
  {
    num: '04', phase: 'Weeks 6–8', label: 'Data, Storage & Persistence',
    baseDuration: 'Pre-read · planned',
    tools: { python: ['SQLAlchemy', 'PostgreSQL', 'Redis'], nodejs: ['Prisma', 'PostgreSQL', 'MongoDB'] },
    available: false, accent: '#CA8A04',
  },
  {
    num: '05', phase: 'Weeks 9–11', label: 'Testing, Debugging & Reliability',
    baseDuration: 'Pre-read · planned',
    tools: { python: ['pytest', 'coverage', 'logging'], nodejs: ['Jest', 'Supertest', 'Debugging'] },
    available: false, accent: '#DC2626',
  },
  {
    num: '06', phase: 'Weeks 12–14', label: 'Deploying & Shipping to Production',
    baseDuration: 'Capstone · planned',
    tools: { python: ['Docker', 'CI/CD', 'Railway'], nodejs: ['Docker', 'Vercel', 'GitHub Actions'] },
    available: false, accent: '#7C2D12',
  },
];

// ── Java-specific module list (12 pre-reads) ────────────────────────────────
const JAVA_MODULES = [
  {
    num: '00', phase: 'Before You Begin', label: 'Language Basics: Java',
    baseDuration: 'Interactive · 30 min · 3D tools',
    tools: ['Variables', 'Types', 'OOP Intro'],
    available: true, accent: '#7C3AED',
    desc: 'Five interactive 3D sections covering Java variables, types, control flow, functions, and your first real Java program — with Three.js-powered 3D visualisations for each concept.',
  },
  {
    num: '01', phase: 'Week 0', label: 'Web & Backend Foundations',
    baseDuration: 'Pre-read · 25 min',
    tools: ['HTTP/DNS', 'Postman', 'REST'],
    available: true, accent: '#16A34A',
    desc: 'How the internet actually works — DNS resolution, client-server architecture, load balancers, and caching layers. You will also explore HTTP methods, CORS, authentication basics, and how to design and test APIs securely with Postman. The foundation every backend engineer builds on.',
  },
  {
    num: '02', phase: 'Weeks 1–2', label: 'Java Language Basics',
    baseDuration: 'Pre-read · planned',
    tools: ['JDK 21', 'Maven', 'IntelliJ'],
    available: false, accent: '#0EA5E9',
    desc: 'Java from scratch — what makes it object-oriented and platform-independent, how the JVM compiles source to bytecode, variables, primitive and reference types, constructors, loops, conditionals, method overloading, and input validation. You will write your first working Java programs and understand why Java is built the way it is.',
  },
  {
    num: '03', phase: 'Week 3', label: 'JVM Architecture & Memory',
    baseDuration: 'Pre-read · planned',
    tools: ['JVM', 'Heap/Stack', 'GC'],
    available: false, accent: '#6366F1',
    desc: 'What actually happens when your Java code runs — class loading, linking, initialisation, and the JIT compiler. You will understand how the heap and stack divide memory, how garbage collection reclaims it, and why JVM profiling is not optional for production systems.',
  },
  {
    num: '04', phase: 'Weeks 4–5', label: 'OOP: Core Pillars',
    baseDuration: 'Pre-read · planned',
    tools: ['Encapsulation', 'Inheritance', 'Polymorphism'],
    available: false, accent: '#7C3AED',
    desc: 'The four pillars of OOP applied in Java — encapsulation with access modifiers, single-inheritance hierarchies, constructor chaining with this and super, method overriding with @Override, and polymorphism that lets one interface handle many types. You will design class hierarchies and understand exactly why Java avoids multiple inheritance.',
  },
  {
    num: '05', phase: 'Weeks 6–7', label: 'OOP Applied: Abstraction & Interfaces',
    baseDuration: 'Pre-read · planned',
    tools: ['Abstract Classes', 'Interfaces', 'LMS Design'],
    available: false, accent: '#9333EA',
    desc: 'Hiding complexity behind clean contracts — when to use abstract classes versus interfaces, how default and static interface methods work, and how method overloading gives flexibility. You will apply all four OOP pillars to design a real Learner Management System, mapping entities, composition, aggregation, and association relationships.',
  },
  {
    num: '06', phase: 'Week 8', label: 'SOLID & Design Principles',
    baseDuration: 'Pre-read · planned',
    tools: ['SOLID', 'DRY', 'Composition'],
    available: false, accent: '#C026D3',
    desc: 'The principles that turn working code into maintainable code — Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. Plus DRY, KISS, and YAGNI to cut noise. You will learn why composition beats inheritance, and how constructor and interface injection reduces coupling.',
  },
  {
    num: '07', phase: 'Weeks 9–10', label: 'Design Patterns & Low-Level Design',
    baseDuration: 'Track block · planned',
    tools: ['Strategy', 'Builder', 'Singleton'],
    available: false, accent: '#DB2777',
    desc: 'Patterns that make systems reusable and extendable — Strategy, Builder, and Singleton applied to real problems. You will design a complete Parking Lot system across four sessions: identify entities (vehicles, spots, floors, payments), map relationships, implement payment strategies with the Strategy pattern, and produce class diagrams ready to implement.',
  },
  {
    num: '08', phase: 'Week 11', label: 'Spring Boot & Dependency Injection',
    baseDuration: 'Pre-read · planned',
    tools: ['Spring Boot', 'DI / IoC', '@Bean'],
    available: false, accent: '#0369A1',
    desc: 'Where Java design meets real web development — the Spring Framework, inversion of control, and how Spring Boot configures a fully running backend in minutes. You will set up your first project, understand the application context, and wire beans with @Component, @Service, @Repository, and @Autowired.',
  },
  {
    num: '09', phase: 'Weeks 12–13', label: 'REST APIs with Spring Boot',
    baseDuration: 'Pre-read · planned',
    tools: ['@RestController', 'HTTP Status', 'Error Handling'],
    available: false, accent: '#0891B2',
    desc: 'Build APIs that connect your backend to real users — controllers, service layers, and repositories following the layered architecture every professional Java backend uses. You will name endpoints correctly, return proper HTTP status codes, handle errors gracefully, and understand how Spring Boot auto-configuration eliminates boilerplate.',
  },
  {
    num: '10', phase: 'Weeks 14–15', label: 'Entity Modeling & Databases',
    baseDuration: 'Pre-read · planned',
    tools: ['JPA', 'Hibernate', 'PostgreSQL'],
    available: false, accent: '#CA8A04',
    desc: 'How backends persist data — JPA entity mapping with @Entity, @OneToMany, @ManyToMany, and cascading. You will use Hibernate, write DTOs to prevent circular references, add @JsonIgnore and @Valid annotations, handle transactions, and switch between H2 for tests and MySQL for production.',
  },
  {
    num: '11', phase: 'Weeks 16–18', label: 'Testing & Security',
    baseDuration: 'Pre-read · planned',
    tools: ['JUnit 5', 'Mockito', 'Spring Security'],
    available: false, accent: '#DC2626',
    desc: 'Two skills that production code cannot ship without. Testing: JUnit 5 unit tests, Mockito mocks, @MockBean integration tests with in-memory databases, and test coverage in CI pipelines. Security: Spring Security RBAC, JWT token generation and verification, bcrypt password hashing, email verification, and @PreAuthorize guards for protected routes.',
  },
  {
    num: '12', phase: 'Weeks 19–22', label: 'Async, Concurrency & Advanced Java',
    baseDuration: 'Capstone · planned',
    tools: ['WebFlux', 'ThreadPools', 'JVisualVM'],
    available: false, accent: '#7C2D12',
    desc: 'High-performance backend engineering — async with Spring WebFlux, reactive streams (Mono & Flux), non-blocking APIs, and callback chaining. Then multithreading: Thread states, executor services, thread pools, synchronization, and race condition prevention. Finally, JVM profiling with JVisualVM and IntelliJ Profiler to tune CPU, memory, and thread behaviour under real load.',
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
  stats: { label: string; value: string }[];
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
    stats: [
      { label: 'Duration', value: 'Weeks 0–14' },
      { label: 'Modules', value: '6 modules' },
      { label: 'Start with', value: 'Pre-read 01' },
    ],
  },
  java: {
    label: 'Java Track',
    sublabel: 'Backend engineers, system designers, and enterprise developers',
    desc: 'Built for learners who want to master backend engineering from first principles. You\'ll go deep on OOP, SOLID design, and low-level design before building production-grade APIs with Spring Boot — the way professional backend teams actually ship.',
    color: '#0369A1',
    bg: 'rgba(3,105,161,0.08)',
    border: 'rgba(3,105,161,0.2)',
    emoji: '☕',
    module01Desc: 'How the internet works end-to-end — DNS resolution, client-server architecture, load balancers, and caching. Plus HTTP methods, CORS, authentication basics, and how to test APIs with Postman — everything you need before writing your first Java line.',
    stats: [
      { label: 'Duration', value: 'Weeks 0–25' },
      { label: 'Sessions', value: '31 sessions' },
      { label: 'Start with', value: 'Session 1' },
    ],
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
    stats: [
      { label: 'Duration', value: 'Weeks 0–14' },
      { label: 'Modules', value: '6 modules' },
      { label: 'Start with', value: 'Pre-read 01' },
    ],
  },
};

interface Props {
  track: SWETrack;
  level: SWELevel;
  onBack: () => void;
  onStartPreRead: (moduleNum: string) => void;
}

const LEVEL_BADGE: Record<SWELevel, { label: string; color: string; bg: string }> = {
  beginner: { label: 'Beginner', color: '#6366F1', bg: 'rgba(99,102,241,0.1)' },
  advanced: { label: 'Advanced', color: '#0369A1', bg: 'rgba(3,105,161,0.1)' },
};

export default function SWELaunchpadOverview({ track, level, onBack, onStartPreRead }: Props) {
  const meta = TRACK_META[track];
  const levelBadge = LEVEL_BADGE[level];

  const modules = track === 'java'
    ? JAVA_MODULES
    : SHARED_MODULES.map(mod => ({
        ...mod,
        tools: mod.tools[track] ?? [],
        desc: mod.num === '01' ? meta.module01Desc : getModuleDesc(mod.num, track),
      }));

  const availableCount = modules.filter(m => m.available).length;

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
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", lineHeight: 1.2 }}>{meta.label}</div>
                  <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.1em', background: levelBadge.bg, color: levelBadge.color, border: `1px solid ${levelBadge.color}30` }}>
                    {level === 'advanced' ? '🚀' : '🌱'} {levelBadge.label.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: meta.color, letterSpacing: '0.06em', marginTop: '2px' }}>{meta.sublabel}</div>
              </div>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7, maxWidth: '480px' }}>{meta.desc}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
            {meta.stats.map(s => (
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
            <div style={{ fontSize: '13px', color: 'var(--ed-ink3)' }}>Language Basics is available now. More modules unlock as the cohort progresses.</div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>
            {availableCount} of {modules.length} available
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
              onClick={mod.available ? () => onStartPreRead(mod.num) : undefined}
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

// Java descriptions are inline in JAVA_MODULES. This function handles Python & Node.js only.
function getModuleDesc(num: string, track: SWETrack): string {
  const descs: Record<string, Partial<Record<SWETrack, string>>> = {
    '02': {
      python: 'Variables, data types, control flow, functions, and object-oriented programming in Python. You will learn when to use classes vs functions and how to write Pythonic code that other engineers will want to read.',
      nodejs: 'ES6+ syntax, closures, prototypes, async/await, and the event loop in depth. You will learn how JavaScript\'s flexibility works for you — and when it works against you.',
    },
    '03': {
      python: 'Build a REST API with FastAPI including request validation, response models, and automatic documentation. You will understand how HTTP works, what a route handler does, and how to structure a real backend.',
      nodejs: 'Build a REST API with Express.js including routing, middleware, error handling, and request validation. You will understand the request-response cycle and how middleware chains compose into a real backend.',
    },
    '04': {
      python: 'Connect your FastAPI app to PostgreSQL with SQLAlchemy ORM. You will write migrations, model relationships, handle transactions, and learn when to drop down to raw SQL for performance.',
      nodejs: 'Connect your Express app to PostgreSQL with Prisma ORM. You will write schema files, run migrations, query with type safety, and understand how connection pooling keeps production fast.',
    },
    '05': {
      python: 'Write pytest unit and integration tests, measure coverage, and learn to debug Python with breakpoints and logging. You will ship code you can actually trust.',
      nodejs: 'Write Jest unit tests and Supertest integration tests for your Express API. You will learn how to mock modules, test async code, and catch regressions before your users do.',
    },
    '06': {
      python: 'Containerise your Python app with Docker, set up a GitHub Actions CI pipeline, and deploy to a cloud provider. You will go from "works on my machine" to a URL you can share.',
      nodejs: 'Deploy your Node.js app with Vercel or Docker, set up GitHub Actions for continuous deployment, and add environment variable management. You will ship to production with confidence.',
    },
  };
  return descs[num]?.[track] ?? 'Content planned for this module.';
}

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import QuizEngine from './QuizEngine';
import type { SWETrack, SWELevel } from './sweTypes';
import {
  ApplyItBox, ChapterSection, NextChapterTeaser,
  chLabel, h2, keyBox, para, pullQuote,
} from './pm-fundamentals/designSystem';

const ACCENT_RGB = '22,163,74';
const MODULE_TIME = '25 min · 4 parts';

const TRACK_META: Record<SWETrack, {
  label: string; shortLabel: string; introTitle: string;
  protagonist: string; protagonistRole: string; company: string; moduleContext: string;
  mentor: string; mentorRole: string; mentorColor: string;
  accentColor: string; accentGradient: string;
}> = {
  python: {
    label: 'Python Track', shortLabel: 'Python', introTitle: 'How Software Works · Python Lens',
    protagonist: 'Aisha Patel', protagonistRole: 'Junior Data Engineer', company: 'Mosaic Analytics',
    moduleContext: 'SWE Launchpad · Python · Pre-Read 01. Follows Aisha, a junior data engineer at Mosaic Analytics, as she learns how Python code actually runs, what the terminal is for, and how to read her first error.',
    mentor: 'Riya', mentorRole: 'Data Engineering Lead', mentorColor: '#0369A1',
    accentColor: '#16A34A', accentGradient: 'linear-gradient(135deg, #16A34A, #0D9488)',
  },
  java: {
    label: 'Java Track', shortLabel: 'Java', introTitle: 'How Software Works · Java Lens',
    protagonist: 'Vikram Nair', protagonistRole: 'Junior Backend Engineer', company: 'Finova Systems',
    moduleContext: 'SWE Launchpad · Java · Pre-Read 01. Follows Vikram, a junior backend engineer at Finova Systems, as he learns how Java compiles and runs, what the JVM actually does, and why types matter.',
    mentor: 'Kavya', mentorRole: 'Senior Backend Engineer', mentorColor: '#7C3AED',
    accentColor: '#0369A1', accentGradient: 'linear-gradient(135deg, #0369A1, #7C3AED)',
  },
  nodejs: {
    label: 'Node.js Track', shortLabel: 'Node.js', introTitle: 'How Software Works · Node.js Lens',
    protagonist: 'Leo Chen', protagonistRole: 'Junior Full-Stack Developer', company: 'Launchly',
    moduleContext: 'SWE Launchpad · Node.js · Pre-Read 01. Follows Leo, a junior full-stack developer at Launchly, as he learns how Node.js runs JavaScript outside the browser and how to build his first HTTP server.',
    mentor: 'Mei', mentorRole: 'Senior Full-Stack Engineer', mentorColor: '#DC2626',
    accentColor: '#CA8A04', accentGradient: 'linear-gradient(135deg, #CA8A04, #16A34A)',
  },
};

const SECTIONS = [
  { id: 'swe-m1-how-code-runs',      label: 'How Code Runs' },
  { id: 'swe-m1-dev-environment',    label: 'Your Dev Environment' },
  { id: 'swe-m1-language-ecosystem', label: 'Your Language & Ecosystem' },
  { id: 'swe-m1-reading-errors',     label: 'Reading Errors & Debugging' },
];
const CONCEPTS = ['swe-m1-execution', 'swe-m1-environment', 'swe-m1-ecosystem', 'swe-m1-debugging'];
const ACHIEVEMENTS = [
  { id: 'swe-m1-how-code-runs',      icon: '⚙️', label: 'Executor',  desc: 'Understood how code becomes output' },
  { id: 'swe-m1-dev-environment',    icon: '🛠️', label: 'Set Up',    desc: 'Mastered the dev environment' },
  { id: 'swe-m1-language-ecosystem', icon: '🌐', label: 'Explorer',  desc: 'Explored the language ecosystem' },
  { id: 'swe-m1-reading-errors',     icon: '🔍', label: 'Debugger',  desc: 'Learned to read errors and debug' },
];
const CONCEPT_DETAILS = [
  { id: 'swe-m1-execution',   label: 'Execution Model',    color: '#16A34A' },
  { id: 'swe-m1-environment', label: 'Dev Environment',    color: '#0369A1' },
  { id: 'swe-m1-ecosystem',   label: 'Language Ecosystem', color: '#7C3AED' },
  { id: 'swe-m1-debugging',   label: 'Debugging Mindset',  color: '#C85A40' },
];
const LEVELS = [
  { min: 0,   label: 'Curious',      color: 'var(--ed-ink3)' },
  { min: 150, label: 'Thinker',      color: '#0097A7' },
  { min: 350, label: 'Practitioner', color: '#3A86FF' },
  { min: 600, label: 'PM-Minded',    color: '#4F46E5' },
  { min: 850, label: 'PM Thinker',   color: '#C85A40' },
];
function getLevel(xp: number) { let l = LEVELS[0]; for (const lvl of LEVELS) { if (xp >= lvl.min) l = lvl; } return l; }
function getNextLevel(xp: number) { const i = LEVELS.findIndex(l => l.min > xp); return i === -1 ? null : LEVELS[i]; }
const ROMAN = ['I', 'II', 'III', 'IV'];
const toRoman = (n: number) => ROMAN[n - 1] ?? String(n);

// ─── Custom story + character components ───────────────────────────────────

const StoryCard = ({ protagonist, accentColor, children }: { protagonist: string; accentColor: string; children: React.ReactNode }) => (
  <div style={{ position: 'relative', background: 'var(--ed-amber-bg)', borderRadius: '6px', padding: '20px 24px', margin: '0 0 28px', borderTop: '1px solid var(--ed-amber-border)', borderRight: '1px solid var(--ed-amber-border)', borderBottom: '1px solid var(--ed-amber-border)', borderLeft: `4px solid ${accentColor}` }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: accentColor, marginBottom: '10px' }}>◎ {protagonist}&apos;s Situation</div>
    <div style={{ fontSize: '15px', color: 'var(--ed-ink)', lineHeight: 1.85, fontStyle: 'italic', fontFamily: "'Lora', 'Georgia', serif" }}>{children}</div>
  </div>
);

const MentorCard = ({ name, role, color, children }: { name: string; role: string; color: string; children: React.ReactNode }) => (
  <div style={{ background: 'var(--ed-card)', border: `1px solid var(--ed-rule)`, borderLeft: `4px solid ${color}`, borderRadius: '8px', padding: '18px 20px', margin: '24px 0' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{name[0]}</div>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', lineHeight: 1 }}>{name}</div>
        <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", marginTop: '2px' }}>{role}</div>
      </div>
      <div style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: '20px', fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, background: `${color}14`, color, border: `1px solid ${color}30` }}>Mentor</div>
    </div>
    <div style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.8, fontStyle: 'italic', fontFamily: "'Lora', 'Georgia', serif" }}>{children}</div>
  </div>
);

// ─── Interactive: Execution Flow (Section 01) ─────────────────────────────

const ExecutionFlow = ({ track, accentColor }: { track: SWETrack; accentColor: string }) => {
  const [step, setStep] = useState(0);
  const steps = track === 'java' ? [
    { label: 'You write code', icon: '📝', desc: 'You type Java source code in Main.java — human-readable instructions for the computer.', detail: 'Source code is just text. The computer cannot run it yet.' },
    { label: 'javac compiles', icon: '⚙️', desc: 'javac (the Java compiler) reads your .java file and checks for type errors, syntax errors, and structural issues.', detail: 'If there are errors, compilation stops here. Nothing runs.' },
    { label: 'Bytecode produced', icon: '📦', desc: 'Compilation produces a .class file — bytecode. Not machine code yet, but a portable intermediate format the JVM understands.', detail: 'The same .class file runs on Windows, Mac, Linux — any machine with a JVM.' },
    { label: 'JVM executes', icon: '🚀', desc: 'The JVM (Java Virtual Machine) reads bytecode and translates it to native machine instructions using JIT compilation.', detail: 'The JVM also manages memory, handles garbage collection, and enforces safety rules at runtime.' },
  ] : track === 'python' ? [
    { label: 'You write code', icon: '📝', desc: 'You write Python source code in script.py — clean, readable instructions.', detail: 'Source code is just text. The computer cannot execute it directly.' },
    { label: 'CPython reads', icon: '⚙️', desc: 'When you run python script.py, the CPython interpreter starts reading your file from the top.', detail: 'Unlike Java, there is no separate compile step — the interpreter reads and runs simultaneously.' },
    { label: 'Bytecode cached', icon: '📦', desc: 'Internally, CPython compiles your code to bytecode (.pyc files) for caching. You rarely see this.', detail: 'This is an implementation detail. The key point is Python reads and runs — no separate javac step.' },
    { label: 'CPython executes', icon: '🚀', desc: 'CPython evaluates each expression, calls functions, and produces output — line by line.', detail: 'If a line is never reached (inside an untested branch), its errors never surface. That is why testing matters.' },
  ] : [
    { label: 'You write code', icon: '📝', desc: 'You write JavaScript in app.js — the same language you know from the browser.', detail: 'JavaScript is text. Node.js is what gives it the ability to run outside a browser.' },
    { label: 'Node loads file', icon: '⚙️', desc: 'You run node app.js. Node reads your file and hands it to the V8 JavaScript engine.', detail: 'V8 is the same engine Chrome uses. It compiles JavaScript directly to native machine code.' },
    { label: 'V8 compiles & runs', icon: '🚀', desc: 'V8 JIT-compiles your JavaScript to native machine code and executes it immediately.', detail: 'V8 is fast — it does not interpret line by line. It compiles entire functions before running them.' },
    { label: 'Event loop starts', icon: '🔄', desc: 'Once the initial code runs, Node starts the event loop — waiting for callbacks, timers, or I/O events.', detail: 'This is why Node stays alive after your main code finishes: it is waiting for async work to complete.' },
  ];

  return (
    <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', padding: '20px 22px', margin: '28px 0' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: accentColor, marginBottom: '16px' }}>INTERACTIVE · EXECUTION FLOW</div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' as const }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            style={{ padding: '6px 14px', borderRadius: '20px', border: `1.5px solid ${i === step ? accentColor : 'var(--ed-rule)'}`, background: i === step ? `${accentColor}12` : 'var(--ed-cream)', cursor: 'pointer', fontSize: '11px', fontWeight: i === step ? 700 : 400, color: i === step ? accentColor : 'var(--ed-ink3)', fontFamily: 'inherit', transition: 'all 0.15s' }}>
            {i + 1}. {s.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: `${accentColor}14`, border: `1.5px solid ${accentColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{steps[step].icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '8px' }}>{steps[step].label}</div>
              <div style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7, marginBottom: '10px' }}>{steps[step].desc}</div>
              <div style={{ padding: '10px 14px', borderRadius: '6px', background: `${accentColor}08`, border: `1px solid ${accentColor}20`, fontSize: '12px', color: accentColor, fontFamily: "'JetBrains Mono', monospace" }}>{steps[step].detail}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--ed-rule)' }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{ padding: '6px 16px', borderRadius: '6px', border: '1px solid var(--ed-rule)', background: 'var(--ed-cream)', cursor: step === 0 ? 'not-allowed' : 'pointer', opacity: step === 0 ? 0.4 : 1, fontSize: '12px', color: 'var(--ed-ink3)', fontFamily: 'inherit' }}>← Previous</button>
        <span style={{ fontSize: '11px', color: 'var(--ed-ink3)', alignSelf: 'center' }}>{step + 1} / {steps.length}</span>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} style={{ padding: '6px 16px', borderRadius: '6px', border: '1px solid var(--ed-rule)', background: 'var(--ed-cream)', cursor: step === steps.length - 1 ? 'not-allowed' : 'pointer', opacity: step === steps.length - 1 ? 0.4 : 1, fontSize: '12px', color: 'var(--ed-ink3)', fontFamily: 'inherit' }}>Next →</button>
      </div>
    </div>
  );
};

// ─── Interactive: Environment Mistake Spotter (Section 02) ────────────────

const EnvMistakes = ({ track, accentColor }: { track: SWETrack; accentColor: string }) => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const items = track === 'python' ? [
    { mistake: 'You install a library with pip install flask, then run the project and get ModuleNotFoundError.', diagnosis: 'You installed flask globally or into the wrong venv. Always check: is the right virtual environment active? Run pip list to see what is installed where.', bad: true },
    { mistake: 'You commit node_modules/ to git because removing it breaks your imports.', diagnosis: 'Wrong tool, right instinct. In Python, you commit requirements.txt — not the packages. Anyone cloning your repo runs pip install -r requirements.txt to restore them.', bad: true },
    { mistake: 'You create a new venv for each project and freeze requirements.txt before sharing.', diagnosis: 'Correct. This is the professional Python workflow. Each project has its own isolated environment, and requirements.txt reproducibly captures exactly what is needed.', bad: false },
  ] : track === 'java' ? [
    { mistake: 'You clone a project and run mvn compile. It fails with "could not find dependency". You manually download the JAR from Maven Central.', diagnosis: 'Never manually manage JARs. Maven downloads all dependencies declared in pom.xml automatically when you run mvn compile or mvn install. Trust the build tool.', bad: true },
    { mistake: 'You install JDK 21 on your machine. Your team member uses JDK 17. The code works for you but fails for them with "incompatible class version error".', diagnosis: 'JDK version mismatches cause subtle bugs. Set the java.version in pom.xml and document the minimum JDK requirement in the README. Your CI should match production.', bad: true },
    { mistake: 'You use Maven wrapper (mvnw) checked into the repo so all team members use the same Maven version automatically.', diagnosis: 'Correct. mvnw guarantees everyone uses the same Maven version regardless of their local installation. This is standard practice in professional Java projects.', bad: false },
  ] : [
    { mistake: 'You clone a project and run node app.js. It crashes with "Cannot find module express". You copy node_modules/ from a similar project.', diagnosis: 'Never copy node_modules across projects. Run npm install instead — it reads package.json and downloads exactly the right versions for this project.', bad: true },
    { mistake: 'You run npm install --force to resolve a peer dependency warning and commit the result.', diagnosis: 'Force-installing bypasses version checks and can introduce incompatibilities. Investigate the warning first — it usually means two packages expect different versions of a shared dependency.', bad: true },
    { mistake: 'You use package-lock.json committed to git so the exact dependency tree is reproducible across all machines.', diagnosis: 'Correct. package-lock.json locks every dependency to a specific version. With it, npm ci installs the exact same tree everywhere — your machine, CI, and production.', bad: false },
  ];

  return (
    <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', padding: '20px 22px', margin: '28px 0' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: accentColor, marginBottom: '6px' }}>INTERACTIVE · ENVIRONMENT DIAGNOSIS</div>
      <div style={{ fontSize: '13px', color: 'var(--ed-ink3)', marginBottom: '16px' }}>Three scenarios. Is each one a mistake or correct practice? Click to find out.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, i) => (
          <motion.button key={i} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
            style={{ textAlign: 'left' as const, padding: '14px 18px', borderRadius: '10px', border: `1.5px solid ${revealed[i] ? (item.bad ? '#DC2626' : '#16A34A') : 'var(--ed-rule)'}`, background: revealed[i] ? (item.bad ? 'rgba(220,38,38,0.05)' : 'rgba(22,163,74,0.05)') : 'var(--ed-cream)', cursor: 'pointer', transition: 'all 0.18s', fontFamily: 'inherit' }}>
            <div style={{ fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.6, marginBottom: revealed[i] ? '10px' : '0' }}>{item.mistake}</div>
            <AnimatePresence>
              {revealed[i] && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', color: item.bad ? '#DC2626' : '#16A34A' }}>{item.bad ? '✗ MISTAKE' : '✓ CORRECT'}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>{item.diagnosis}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ─── Interactive: Library Matcher (Section 03) ────────────────────────────

const LibraryMatcher = ({ track, accentColor }: { track: SWETrack; accentColor: string }) => {
  const [chosen, setChosen] = useState<Record<number, number>>({});
  const items = track === 'python' ? [
    { task: 'Build a REST API with automatic docs', options: ['pandas', 'FastAPI', 'pytest', 'NumPy'], correct: 1, explanation: 'FastAPI is the modern Python choice for REST APIs — it uses type hints to generate automatic OpenAPI docs, handles validation, and is async-ready.' },
    { task: 'Analyse a CSV with millions of rows', options: ['Flask', 'requests', 'pandas', 'SQLAlchemy'], correct: 2, explanation: 'pandas is the standard for tabular data analysis in Python. For very large datasets, Polars is faster — but pandas is what you learn first.' },
    { task: 'Write automated unit tests', options: ['schedule', 'pytest', 'click', 'httpx'], correct: 1, explanation: 'pytest is the Python testing standard. It has a clean syntax, great fixtures, and a huge plugin ecosystem. Write tests from day one.' },
  ] : track === 'java' ? [
    { task: 'Build a production REST API with DI and security', options: ['JDBC', 'Spring Boot', 'JUnit 5', 'Lombok'], correct: 1, explanation: 'Spring Boot is the industry standard for Java web APIs. It auto-configures dependency injection, web server, and security so you write business logic, not boilerplate.' },
    { task: 'Map Java classes to database tables', options: ['Maven', 'Mockito', 'Hibernate JPA', 'Guava'], correct: 2, explanation: 'Hibernate (via Spring Data JPA) maps Java objects to database rows. You define @Entity classes and relationships; Hibernate handles SQL generation.' },
    { task: 'Write unit tests with mocked dependencies', options: ['TestContainers', 'Mockito', 'SLF4J', 'Flyway'], correct: 1, explanation: 'Mockito lets you replace real dependencies (databases, HTTP clients) with fakes in unit tests. TestContainers is for integration tests with real databases in Docker.' },
  ] : [
    { task: 'Build a minimal, flexible HTTP server', options: ['Socket.io', 'NestJS', 'Express', 'Prisma'], correct: 2, explanation: 'Express is the foundational Node.js web framework. Minimal, unopinionated, and used by millions of APIs. Learn it before moving to more opinionated alternatives.' },
    { task: 'Add real-time bidirectional communication', options: ['Express', 'Socket.io', 'Prisma', 'Jest'], correct: 1, explanation: 'Socket.io adds WebSocket support over Node.js. It is the standard for real-time features — chat, live updates, collaborative editing.' },
    { task: 'Query a database with type-safe models', options: ['axios', 'dotenv', 'Prisma', 'bcrypt'], correct: 2, explanation: 'Prisma is the modern TypeScript-first ORM for Node.js. It generates a type-safe client from your schema, making database queries safe and autocomplete-friendly.' },
  ];

  return (
    <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', padding: '20px 22px', margin: '28px 0' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: accentColor, marginBottom: '6px' }}>INTERACTIVE · PICK THE RIGHT LIBRARY</div>
      <div style={{ fontSize: '13px', color: 'var(--ed-ink3)', marginBottom: '16px' }}>For each task, choose the library that fits best.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {items.map((item, qi) => (
          <div key={qi} style={{ padding: '16px', borderRadius: '10px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ed-ink)', marginBottom: '12px', lineHeight: 1.5 }}>Task: {item.task}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {item.options.map((opt, oi) => {
                const picked = chosen[qi] === oi;
                const correct = oi === item.correct;
                const revealed = qi in chosen;
                return (
                  <motion.button key={oi} whileHover={!revealed ? { y: -1 } : {}} whileTap={!revealed ? { scale: 0.98 } : {}}
                    onClick={() => !revealed && setChosen(c => ({ ...c, [qi]: oi }))}
                    style={{ padding: '10px 14px', borderRadius: '8px', border: `1.5px solid ${revealed ? (correct ? '#16A34A' : picked ? '#DC2626' : 'var(--ed-rule)') : 'var(--ed-rule)'}`, background: revealed ? (correct ? 'rgba(22,163,74,0.08)' : picked ? 'rgba(220,38,38,0.06)' : 'var(--ed-card)') : 'var(--ed-card)', cursor: revealed ? 'default' : 'pointer', textAlign: 'left' as const, transition: 'all 0.15s', fontFamily: 'inherit' }}>
                    <div style={{ fontSize: '12px', fontWeight: correct && revealed ? 700 : 400, color: revealed ? (correct ? '#16A34A' : picked ? '#DC2626' : 'var(--ed-ink3)') : 'var(--ed-ink2)' }}>
                      {revealed && correct ? '✓ ' : revealed && picked && !correct ? '✗ ' : ''}{opt}
                    </div>
                  </motion.button>
                );
              })}
            </div>
            {qi in chosen && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '6px', background: `${accentColor}08`, border: `1px solid ${accentColor}20`, fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
                {item.explanation}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Interactive: Traceback Reader (Section 04) ──────────────────────────

const TracebackReader = ({ track, accentColor }: { track: SWETrack; accentColor: string }) => {
  const [step, setStep] = useState(0);
  const content = track === 'python' ? {
    error: `Traceback (most recent call last):
  File "pipeline.py", line 34, in run_pipeline
    result = process_batch(data)
  File "pipeline.py", line 18, in process_batch
    return [transform(row) for row in rows]
  File "pipeline.py", line 18, in <listcomp>
    return [transform(row) for row in rows]
  File "pipeline.py", line 9, in transform
    return row['value'] * multiplier
KeyError: 'value'`,
    steps: [
      { label: 'Find the error type', highlight: 'KeyError', explanation: 'Start at the bottom. KeyError means you accessed a dictionary key that does not exist. The key is \'value\'. Not a typo error, not a network error — a missing key.' },
      { label: 'Find the error location', highlight: 'pipeline.py", line 9', explanation: 'Line 9 in pipeline.py is where the problem is. Your code. Not a library. The transform function tried to access row[\'value\'] on a row that didn\'t have that key.' },
      { label: 'Read the call chain', highlight: 'run_pipeline → process_batch → transform', explanation: 'The traceback reads bottom-up. run_pipeline called process_batch, which called transform — which crashed. The root cause is in transform, not in the callers.' },
      { label: 'Form a hypothesis', highlight: '', explanation: 'Some rows in data don\'t have a \'value\' key. Maybe the data source changed schema. Maybe an API returned a different field name. Fix: add a guard — row.get(\'value\', 0) — or validate the schema at ingestion.' },
    ],
  } : track === 'java' ? {
    error: `Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.length()" because "this.userName" is null
	at com.finova.UserService.validateUser(UserService.java:42)
	at com.finova.AuthController.login(AuthController.java:28)
	at com.finova.Application.main(Application.java:15)`,
    steps: [
      { label: 'Find the exception type', highlight: 'NullPointerException', explanation: 'NullPointerException means you called a method on a null reference. The message is unusually specific in Java 14+: "Cannot invoke String.length() because this.userName is null". Read it carefully — it tells you exactly what was null.' },
      { label: 'Find your code in the trace', highlight: 'UserService.java:42', explanation: 'Ignore lines starting with at com.sun.*, at java.*, at org.springframework.*. Those are library code. The first line pointing to YOUR package — com.finova — is where the bug lives. Line 42 of UserService.java.' },
      { label: 'Trace the call chain', highlight: 'main → login → validateUser', explanation: 'Application.main called AuthController.login, which called UserService.validateUser at line 42. The null value was probably passed in from the login call — check what AuthController passes to validateUser.' },
      { label: 'Form a hypothesis', highlight: '', explanation: 'userName is null when validateUser is called. Either the login request had a null username field, or the User object was constructed without setting userName. Add a null check or use @NotNull validation at the API boundary.' },
    ],
  } : {
    error: `TypeError: Cannot read properties of undefined (reading 'email')
    at formatUser (/app/utils/formatUser.js:12:28)
    at /app/routes/users.js:34:22
    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
    at next (/app/node_modules/express/lib/router/route.js:149:13)`,
    steps: [
      { label: 'Find the error type', highlight: 'TypeError: Cannot read properties of undefined', explanation: 'TypeError with "Cannot read properties of undefined" means you tried to access .email on something that is undefined. Not null — undefined. The property or variable was never set.' },
      { label: 'Find your code in the trace', highlight: 'formatUser.js:12', explanation: 'Skip node_modules lines — those are Express internals. The first line pointing to /app/ is yours. Line 12 of utils/formatUser.js — that is where the crash happened. The .email access.' },
      { label: 'Trace the call chain', highlight: 'routes/users.js:34 → formatUser', explanation: 'routes/users.js at line 34 called formatUser, passing something that turned out to be undefined. Check what data routes/users.js pulls from the request or database before calling formatUser.' },
      { label: 'Form a hypothesis', highlight: '', explanation: 'A user object that was expected to exist came back as undefined. Likely: a database query returned undefined for a user that doesn\'t exist, or the request body was missing a field. Add a guard: if (!user) return res.status(404).json({ error: \'User not found\' }).' },
    ],
  };

  return (
    <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', padding: '20px 22px', margin: '28px 0' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: accentColor, marginBottom: '6px' }}>INTERACTIVE · READ THIS ERROR</div>
      <div style={{ fontSize: '13px', color: 'var(--ed-ink3)', marginBottom: '16px' }}>A real error from a real codebase. Walk through reading it like a senior engineer would.</div>
      <div style={{ padding: '14px 16px', borderRadius: '8px', background: '#1C1814', border: '1px solid #332D24', marginBottom: '20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#EDE5D5', lineHeight: 1.7, whiteSpace: 'pre-wrap' as const, overflow: 'auto' }}>
        {content.error}
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' as const }}>
        {content.steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            style={{ padding: '5px 12px', borderRadius: '20px', border: `1.5px solid ${i === step ? accentColor : i < step ? `${accentColor}60` : 'var(--ed-rule)'}`, background: i === step ? `${accentColor}12` : i < step ? `${accentColor}06` : 'var(--ed-cream)', cursor: 'pointer', fontSize: '11px', fontWeight: i === step ? 700 : 400, color: i === step ? accentColor : i < step ? accentColor : 'var(--ed-ink3)', fontFamily: 'inherit', transition: 'all 0.15s' }}>
            {i < step ? '✓' : i + 1}. {s.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
          <div style={{ padding: '14px 18px', borderRadius: '8px', background: `${accentColor}08`, border: `1px solid ${accentColor}20` }}>
            {content.steps[step].highlight && (
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: accentColor, fontWeight: 700, marginBottom: '8px', padding: '4px 10px', background: `${accentColor}14`, borderRadius: '4px', display: 'inline-block' }}>{content.steps[step].highlight}</div>
            )}
            <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>{content.steps[step].explanation}</div>
          </div>
        </motion.div>
      </AnimatePresence>
      {step < content.steps.length - 1 && (
        <div style={{ textAlign: 'right' as const, marginTop: '12px' }}>
          <button onClick={() => setStep(s => s + 1)} style={{ padding: '8px 20px', borderRadius: '6px', background: accentColor, color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit' }}>Next step →</button>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface Props { track: SWETrack; level: SWELevel; onBack: () => void; }

export default function SWEPreRead1({ track, level, onBack }: Props) {
  const meta = TRACK_META[track];
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  const store = useLearnerStore();

  const SECTION_XP = 50;
  const QUIZ_XP = 100;
  const readingXP = completedSections.size * SECTION_XP;
  const quizXP = CONCEPTS.reduce((sum, c) => sum + Math.round((store.conceptStates[c]?.pKnow ?? 0) * QUIZ_XP), 0);
  const totalXP = readingXP + quizXP;

  const [showGain, setShowGain] = useState(false);
  const [gainAmt, setGainAmt] = useState(0);
  const gainRef = useRef(0);
  useEffect(() => {
    const diff = totalXP - gainRef.current;
    if (diff > 0) { setGainAmt(diff); setShowGain(true); gainRef.current = totalXP; const t = setTimeout(() => setShowGain(false), 1800); return () => clearTimeout(t); }
  }, [totalXP]);

  const progressPct = Math.round((completedSections.size / SECTIONS.length) * 100);
  const xpLevel = getLevel(totalXP);
  const nextLevel = getNextLevel(totalXP);
  const levelPct = nextLevel ? Math.round(((totalXP - xpLevel.min) / (nextLevel.min - xpLevel.min)) * 100) : 100;

  useEffect(() => {
    store.initSession();
    CONCEPTS.forEach(c => store.ensureConceptState(c));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('data-section');
        if (!id) return;
        if (entry.isIntersecting) {
          if (entry.intersectionRatio >= 0.1) setActiveSection(id);
          if (entry.intersectionRatio >= 0.25) { setCompletedSections(p => new Set([...p, id])); store.markSectionViewed(id); }
        }
      });
    }, { threshold: [0.1, 0.25, 0.5] });
    const t = setTimeout(() => { document.querySelectorAll('[data-section]').forEach(el => obs.observe(el)); }, 150);
    return () => { clearTimeout(t); obs.disconnect(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardStyle: React.CSSProperties = { background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' };

  return (
    <div className="editorial" style={{ minHeight: '100vh', background: 'var(--ed-cream)' }}>

      {/* Top nav — matches PMFundamentalsModule structure exactly */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', backdropFilter: 'blur(12px)', transition: 'background 0.4s' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
              <motion.button whileHover={{ opacity: 0.75 }} whileTap={{ scale: 0.97 }} onClick={onBack}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', cursor: 'pointer', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>←</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)', fontFamily: "'JetBrains Mono', monospace" }}>Back</span>
              </motion.button>
              <span style={{ color: 'var(--ed-rule)', fontSize: '18px' }}>|</span>
              <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: meta.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" /><path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
              <span style={{ color: 'var(--ed-rule)', fontSize: '18px' }}>|</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>SWE Launchpad</span>
                <span style={{ color: 'var(--ed-rule)', fontSize: '12px' }}>›</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink2)' }}>{meta.shortLabel} · Pre-Read 01</span>
              </div>
            </div>
            <div style={{ flex: 1, maxWidth: '240px', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 24px' }}>
              <div style={{ flex: 1, height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: meta.accentColor, borderRadius: '2px' }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: meta.accentColor, flexShrink: 0 }}>{progressPct}%</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: meta.accentColor, flexShrink: 0 }}>{totalXP} XP</div>
          </div>
        </div>
      </div>

      {/* 3-column layout — matches PMFundamentalsModule exactly */}
      <div className="three-col-wrap" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
      <div className="three-col-grid" style={{ display: 'grid', gridTemplateColumns: '200px minmax(0, 1fr) 240px', gap: '40px', alignItems: 'start', paddingTop: '36px' }}>

        {/* Left nav */}
        <aside className="left-col" style={{ position: 'sticky', top: '57px', height: 'fit-content' }}>
          <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px 14px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid var(--ed-rule)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '8px' }}>Contents</div>
              <div style={{ height: '2px', background: 'var(--ed-rule)', borderRadius: '1px', overflow: 'hidden' }}><motion.div style={{ height: '100%', background: meta.accentColor, borderRadius: '1px' }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} /></div>
              <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '6px' }}>{progressPct}% · {completedSections.size}/{SECTIONS.length} parts</div>
            </div>
            <nav>
              {SECTIONS.map((sec, idx) => {
                const done = completedSections.has(sec.id);
                const active = activeSection === sec.id && !done;
                return (
                  <motion.button key={sec.id} onClick={() => document.querySelector(`[data-section="${sec.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })} whileHover={{ x: 2 }}
                    style={{ display: 'flex', alignItems: 'baseline', gap: '8px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '5px 0', textAlign: 'left' as const, borderLeft: active ? `2px solid ${meta.accentColor}` : '2px solid transparent', paddingLeft: '8px', marginLeft: '-8px', transition: 'border-color 0.2s' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: done || active ? meta.accentColor : 'var(--ed-rule)', flexShrink: 0, minWidth: '18px', lineHeight: 1 }}>{toRoman(idx + 1)}.</span>
                    <span style={{ fontSize: '11px', fontWeight: active ? 600 : 400, color: done ? 'var(--ed-ink2)' : active ? 'var(--ed-ink)' : 'var(--ed-ink3)', lineHeight: 1.4, wordBreak: 'break-word' as const, transition: 'color 0.2s' }}>{sec.label}{done ? ' ✓' : ''}</span>
                  </motion.button>
                );
              })}
            </nav>
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--ed-rule)' }}>
              <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>Following {meta.protagonist.split(' ')[0]}&apos;s journey</div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div style={{ paddingTop: '4px', paddingBottom: '80px', minWidth: 0 }}>

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '48px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: meta.accentColor, marginBottom: '12px' }}>SOFTWARE ENGINEERING LAUNCHPAD · {meta.shortLabel.toUpperCase()} · PRE-READ 01</div>
            <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '16px' }}>{meta.introTitle}</h1>
            <p style={{ fontSize: '16px', color: 'var(--ed-ink2)', lineHeight: 1.75, maxWidth: '580px', marginBottom: '24px' }}>Most people learning to code jump straight to syntax. This pre-read goes one level deeper — how the machine executes your instructions, what tools sit between you and production, and how to think when something goes wrong.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' as const }}>
              {[{ label: 'Time', value: '25 min read' }, { label: 'Protagonist', value: meta.protagonist }, { label: 'Company', value: meta.company }].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '6px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginTop: '1px' }}>{item.label}</span>
                  <span style={{ color: 'var(--ed-ink2)', fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── SECTION 01 ───────────────────────────────── */}
          <ChapterSection id="swe-m1-how-code-runs" num="01" accentRgb={ACCENT_RGB} first>
            {chLabel('The Execution Model')}
            {h2(<>When you run a program, what actually happens?</>)}

            <StoryCard protagonist={meta.protagonist.split(' ')[0]} accentColor={meta.accentColor}>
              {track === 'python' && <>Aisha opens her terminal for the first time since joining Mosaic Analytics and types <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>python pipeline.py</code>. Something prints. The script runs. She has no idea what just happened between pressing Enter and seeing the output — it feels like magic, and she knows that is a problem.</>}
              {track === 'java' && <>Vikram sits at his desk on his first day at Finova Systems, staring at two commands he has to run to execute one Java file: <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>javac Main.java</code> then <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>java Main</code>. His onboarding doc just says &ldquo;compile then run.&rdquo; He writes down his question for Kavya: <em>why two commands?</em></>}
              {track === 'nodejs' && <>Leo has been writing JavaScript for six months — buttons, forms, DOM manipulation. His first task at Launchly is to add a field to the backend API. He opens the file. It is JavaScript. But there is no HTML anywhere, no document.getElementById, nothing he recognises from the browser. He runs <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>node app.js</code> and a server starts. He messages Mei: &ldquo;How is this JavaScript?&rdquo;</>}
            </StoryCard>

            {para(<>Your source code — the text you write in your editor — is not what the computer runs. The computer runs machine code: sequences of ones and zeros that tell the CPU exactly what to do. Everything in between is translation. What makes languages different is <em>when and how</em> that translation happens.</>)}

            {h2(<>The translation chain</>)}

            {track === 'python' && para(<>Python is an <strong>interpreted language</strong>. When you run <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>python pipeline.py</code>, the <strong>CPython interpreter</strong> reads your source code and executes it directly — no separate compile step. This is why Python errors sometimes only surface when a specific line is reached: the interpreter has not read ahead.</>)}
            {track === 'java' && para(<>Java uses a <strong>two-step model</strong>. First, <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>javac</code> compiles your source code into <strong>bytecode</strong> — not machine code, but a portable intermediate format. Then the <strong>JVM (Java Virtual Machine)</strong> reads that bytecode and translates it to native instructions at runtime, using JIT compilation. Two commands, two jobs.</>)}
            {track === 'nodejs' && para(<>Node.js is a <strong>JavaScript runtime</strong> built on Chrome&apos;s <strong>V8 engine</strong> — the same engine that runs JavaScript in your browser. V8 JIT-compiles JavaScript directly to native machine code. Node.js adds what the browser cannot offer: file system access, network sockets, and the ability to run as a server. Same language, different environment.</>)}

            <ExecutionFlow track={track} accentColor={meta.accentColor} />

            <MentorCard name={meta.mentor} role={meta.mentorRole} color={meta.mentorColor}>
              {track === 'python' && <>&ldquo;When you hit a confusing bug six months from now — one that only appears in production, or only on specific data — you will come back to this. The execution model tells you <em>where</em> errors can hide. In Python, they hide in branches you never test. Write tests from the start.&rdquo;</>}
              {track === 'java' && <>&ldquo;New engineers always find the two-step annoying at first. But once you have shipped a system that runs for three years without a type-related bug, you understand why we take the compile step. The compiler is your first reviewer — and it works for free.&rdquo;</>}
              {track === 'nodejs' && <>&ldquo;The V8 engine doesn&apos;t care if you call it from a browser or a terminal. It just compiles and runs JavaScript. What makes Node.js powerful isn&apos;t the language — it&apos;s everything Node wraps around V8. The file system, the event loop, the HTTP module. Learn what Node adds. That&apos;s where the real work happens.&rdquo;</>}
            </MentorCard>

            {track === 'java' && keyBox('The JVM Promise', [
              'Write once, run anywhere — the same .class files run on any OS with a JVM installed',
              'The compiler catches type errors before the program ever runs',
              'The JVM manages memory automatically via garbage collection',
              'JIT compilation makes Java surprisingly fast at runtime despite the extra layer',
            ])}
            {track === 'python' && keyBox('The CPython Model', [
              'Source code (.py) → CPython interpreter → execution',
              'Errors are runtime by default — they appear when a line is reached',
              'Python also compiles to bytecode (.pyc) internally for caching — you rarely see this',
              'The interpreter is itself a program: type python3 --version to see which one you have',
            ])}
            {track === 'nodejs' && keyBox('The V8 + Node.js Model', [
              'JavaScript source → V8 engine → native machine code (JIT compiled)',
              'Node.js adds APIs the browser doesn\'t have: file system, network, OS access',
              'The same JS engine runs in Chrome (browser) and in your terminal (Node)',
              'node --version tells you the Node runtime version; this implies a V8 version too',
            ])}

            {pullQuote('Understanding your runtime is not academic. When a bug only appears under load, or a library behaves differently in production than on your machine, the execution model is usually why.')}

            <QuizEngine conceptId="swe-m1-execution" conceptName="Execution Model" moduleContext={meta.moduleContext}
              staticQuiz={track === 'java' ? {
                conceptId: 'swe-m1-execution',
                question: 'A Java program compiles fine but crashes at runtime with a NullPointerException. What does this tell you about Java\'s execution model?',
                options: ['A. The compiler missed the bug because it only checks types and syntax, not all runtime behaviour', 'B. The JVM is faulty and should have caught this at compile time', 'C. The program was not compiled with javac — it ran the raw .java source'],
                correctIndex: 0,
                explanation: 'The compiler checks types and syntax, but some errors only manifest when specific code paths run at runtime. NullPointerException is a runtime condition — the JVM cannot know at compile time whether a reference will be null.',
              } : track === 'python' ? {
                conceptId: 'swe-m1-execution',
                question: 'A Python script has a logic error on line 42 but runs fine when line 42 is never reached. What does this reveal?',
                options: ['A. CPython interprets code line by line — lines not reached are not executed', 'B. Python ignores logic errors in some files', 'C. The script is cached from a previous valid run'],
                correctIndex: 0,
                explanation: 'CPython does parse the whole file for syntax before running, but logic errors inside un-reached branches only surface when those branches execute. This is exactly why test coverage that exercises all branches matters.',
              } : {
                conceptId: 'swe-m1-execution',
                question: 'A Node.js app works fine locally but crashes in production when a specific API endpoint is called. Most likely cause?',
                options: ['A. A code path reached in production was never exercised during local testing', 'B. Node.js behaves differently per operating system due to V8 differences', 'C. Production uses a different JavaScript version than development'],
                correctIndex: 0,
                explanation: 'Node runs the same V8 engine locally and in production. Environmental differences — missing env vars, different data shapes, higher concurrency — expose code paths that local testing missed. The engine is the same; the inputs are different.',
              }}
            />
          </ChapterSection>

          {/* ── SECTION 02 ───────────────────────────────── */}
          <ChapterSection id="swe-m1-dev-environment" num="02" accentRgb={ACCENT_RGB}>
            {chLabel('The Developer Environment')}
            {h2(<>Your tools before you write a single line</>)}

            <StoryCard protagonist={meta.protagonist.split(' ')[0]} accentColor={meta.accentColor}>
              {track === 'python' && <>Two days in, Aisha sends Riya a message: &ldquo;I installed pandas on my laptop and it works fine, but the pipeline keeps crashing on the shared server with ModuleNotFoundError.&rdquo; Riya replies in thirty seconds: &ldquo;Are you using a virtual environment?&rdquo; Aisha has no idea what that means.</>}
              {track === 'java' && <>Vikram clones the Finova payments service and runs <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>mvn compile</code>. It fails immediately: &ldquo;could not find dependency: spring-boot-starter-web.&rdquo; He messages Kavya in a panic. She responds: &ldquo;Maven is downloading the dependencies. It is fine. Give it a minute — it is just the first time.&rdquo; He watches 47 JARs download one by one and feels slightly better.</>}
              {track === 'nodejs' && <>Leo clones the Launchly API repo and runs <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>node server.js</code>. It crashes immediately: &ldquo;Cannot find module &apos;express&apos;.&rdquo; He checks the repo — express is listed in package.json. He messages Mei. She sends back a one-word reply: <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>npm install</code>. He runs it, 180 packages appear. The server starts.</>}
            </StoryCard>

            {para(<>Professional engineers spend deliberate time on their environment — the set of tools, configurations, and habits that let them write, run, and debug code reliably. Getting this wrong early causes a specific kind of suffering: hours lost to problems that have nothing to do with the actual code you are trying to write.</>)}

            {h2(<>The Terminal</>)}
            {para(<>The terminal is where you will spend a surprising amount of your time as a developer. It is how you install dependencies, start servers, run tests, manage files, and interact with version control. Every professional engineer is comfortable here.</>)}

            {keyBox('Terminal commands you need immediately', [
              'pwd — print working directory (where are you?)',
              'ls (Mac/Linux) / dir (Windows) — list files in current directory',
              'cd folder-name — navigate into a directory',
              'cd .. — go up one level',
              'Ctrl+C — stop a running process (the most important shortcut)',
            ])}

            {h2(<>
              {track === 'python' && 'pip and Virtual Environments'}
              {track === 'java' && 'The JDK and Maven'}
              {track === 'nodejs' && 'npm and package.json'}
            </>)}

            {track === 'python' && (<>
              {para(<><strong>pip</strong> is Python&apos;s package manager. It downloads libraries from PyPI (the Python Package Index) and installs them on your machine. The problem is that if you install everything globally, different projects will conflict with each other — one needs pandas 1.5, another needs 2.0.</>)}
              {para(<>The solution is a <strong>virtual environment</strong>: a self-contained Python installation per project. When you activate it, pip installs go into that project&apos;s folder, not system-wide. This is what Aisha was missing.</>)}
              {keyBox('Virtual environment workflow', [
                'python3 -m venv venv — create a virtual environment in a folder called venv',
                'source venv/bin/activate (Mac/Linux) or venv\\Scripts\\activate (Windows) — activate it',
                'pip install pandas — installs into the venv, not globally',
                'pip freeze > requirements.txt — save a list of installed packages for the team',
                'deactivate — exit the virtual environment',
              ])}
            </>)}
            {track === 'java' && (<>
              {para(<>The <strong>JDK (Java Development Kit)</strong> includes the compiler (<code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>javac</code>), the runtime, and the standard library. You cannot write or run Java without it. Install JDK 21 — the current LTS version. Never install just the JRE; you need the full kit to compile.</>)}
              {para(<><strong>Maven</strong> is a build tool and dependency manager. Your project&apos;s dependencies are declared in <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>pom.xml</code>. Maven reads that file, downloads the JAR files from Maven Central, compiles your code, and runs tests. You never manage JARs manually. This is what those 47 downloads Vikram saw were.</>)}
              {keyBox('Maven workflow', [
                'mvn compile — compile the project',
                'mvn test — run all tests',
                'mvn package — build a .jar file',
                'mvn spring-boot:run — start a Spring Boot app directly',
                'pom.xml — the file that defines your dependencies (like package.json for Java)',
              ])}
            </>)}
            {track === 'nodejs' && (<>
              {para(<><strong>npm</strong> (Node Package Manager) comes bundled with Node.js. When you run <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>npm install express</code>, npm downloads express and its dependencies into a folder called <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>node_modules</code>. When you clone a project, <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>node_modules</code> is not there — it is in <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>.gitignore</code>. That is why Leo needed to run <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>npm install</code> first.</>)}
              {para(<><strong>package.json</strong> declares what your project needs. <strong>package-lock.json</strong> pins every dependency to a specific version so all team members get identical installs. Always commit both files, never commit node_modules.</>)}
              {keyBox('npm workflow', [
                'npm init -y — create a package.json with defaults',
                'npm install <package> — add a dependency',
                'npm install --save-dev <package> — add a dev-only dependency (tests, build tools)',
                'npm ci — fast, reproducible install using package-lock.json (use in CI)',
                '.gitignore node_modules — never commit this folder (it is huge and reproducible)',
              ])}
            </>)}

            <EnvMistakes track={track} accentColor={meta.accentColor} />

            <MentorCard name={meta.mentor} role={meta.mentorRole} color={meta.mentorColor}>
              {track === 'python' && <>&ldquo;Every Python developer has lost hours to the venv confusion. Once. You do it once, you understand, and you never forget to activate it again. The thing to internalise is: your environment IS part of your code. A script that only works in one specific setup is not a reliable script.&rdquo;</>}
              {track === 'java' && <>&ldquo;Maven is verbose and the XML is ugly, but it solves a real problem: reproducible builds. Your machine, my machine, the CI server, and production should all build the same thing from the same pom.xml. When they do not, the build tool is usually why. Learn to read pom.xml early.&rdquo;</>}
              {track === 'nodejs' && <>&ldquo;The first rule of joining any Node.js project: npm install. The second rule: commit package-lock.json. Without the lock file, two developers can run npm install on the same package.json and get different versions of a transitive dependency. That is how &apos;it works on my machine&apos; bugs are born.&rdquo;</>}
            </MentorCard>

            {h2(<>Version Control: Git</>)}
            {para(<>Git is not optional. Every professional engineering team uses version control. Git lets you save checkpoints of your code, experiment in branches without fear, and collaborate through pull requests. Your first day on any team involves cloning a git repository.</>)}

            {keyBox('Git commands you need on day one', [
              'git clone <url> — download a repository from GitHub',
              'git status — see what has changed since the last commit',
              'git add . — stage all changed files',
              'git commit -m "describe what changed" — save a checkpoint',
              'git push — upload your commits to the remote repository',
            ])}

            <QuizEngine conceptId="swe-m1-environment" conceptName="Developer Environment" moduleContext={meta.moduleContext}
              staticQuiz={track === 'python' ? {
                conceptId: 'swe-m1-environment',
                question: 'A colleague\'s Python script works but yours crashes with "ModuleNotFoundError: No module named pandas". Most likely cause?',
                options: ['A. Your virtual environment does not have pandas installed, or you are in the wrong venv', 'B. Python version mismatch — pandas only works on Python 2', 'C. The module name should be capitalised: "Pandas"'],
                correctIndex: 0,
                explanation: 'Each virtual environment has its own installed packages. If you activated a different venv, or no venv at all, the package will not be found even if it is installed elsewhere on your system.',
              } : track === 'java' ? {
                conceptId: 'swe-m1-environment',
                question: 'You clone a Java project and run mvn compile. It fails with "could not find dependency". What is most likely needed?',
                options: ['A. Maven needs to download the dependencies listed in pom.xml to your local cache', 'B. The JDK is not installed', 'C. There is a syntax error in the import statement'],
                correctIndex: 0,
                explanation: 'Maven reads pom.xml to know what to download, but a fresh clone has no local Maven cache. Running mvn compile triggers the download automatically — this is normal on a first clone.',
              } : {
                conceptId: 'swe-m1-environment',
                question: 'You clone a Node.js project and run node server.js. It crashes with "Cannot find module \'express\'". What is the fix?',
                options: ['A. Run npm install — node_modules is not committed to git', 'B. Express is not compatible with your Node.js version', 'C. Change the import from require() to import'],
                correctIndex: 0,
                explanation: 'node_modules is listed in .gitignore and never committed. When you clone a project, npm install reads package.json and downloads all dependencies. This is always the first step after cloning any Node.js project.',
              }}
            />
          </ChapterSection>

          {/* ── SECTION 03 ───────────────────────────────── */}
          <ChapterSection id="swe-m1-language-ecosystem" num="03" accentRgb={ACCENT_RGB}>
            {chLabel('The Ecosystem')}
            {h2(<>
              {track === 'python' && <>Why Mosaic Analytics runs on Python</>}
              {track === 'java' && <>Why Finova&apos;s backend is Java</>}
              {track === 'nodejs' && <>Why Launchly&apos;s API is Node.js</>}
            </>)}

            <StoryCard protagonist={meta.protagonist.split(' ')[0]} accentColor={meta.accentColor}>
              {track === 'python' && <>At Mosaic&apos;s weekly engineering standup, Aisha asks the question that has been on her mind: &ldquo;Why Python? My university used Java. Wouldn&apos;t a compiled language be faster?&rdquo; The room goes quiet for a moment. Then Riya smiles. &ldquo;Faster at what?&rdquo; she asks.</>}
              {track === 'java' && <>Vikram&apos;s friend at a startup texts him: &ldquo;Java? Really? Why not Node or Python? Nobody builds new things in Java.&rdquo; Vikram does not know what to say. He mentions it to Kavya. She shrugs. &ldquo;Ask me again in a year, after you&apos;ve seen what happens to a Python codebase when forty engineers are changing it at the same time.&rdquo;</>}
              {track === 'nodejs' && <>Leo&apos;s computer science professor always said JavaScript was &ldquo;just a frontend toy.&rdquo; Leo is now looking at 50,000 lines of production JavaScript running Launchly&apos;s entire backend. He asks Mei: &ldquo;Is this normal? Running JavaScript on the server?&rdquo; She does not even look up. &ldquo;It&apos;s been normal for over a decade.&rdquo;</>}
            </StoryCard>

            {track === 'python' && (<>
              {para(<>Riya&apos;s question is the right one. Python is not fast at CPU computation — compared to Java or C++, CPython is slow. But for most software engineering work, the bottleneck is <strong>network I/O and database queries</strong>, not raw CPU speed. A data pipeline that spends 90% of its time waiting for a database to respond is not going to run meaningfully faster in a compiled language.</>)}
              {para(<>Python&apos;s real power is its ecosystem. The combination of <strong>pandas</strong> and <strong>NumPy</strong> for data, <strong>scikit-learn</strong> and <strong>PyTorch</strong> for ML, and <strong>FastAPI</strong> for web APIs means that Python is often the <em>only</em> language a data-heavy team needs. Instagram, Dropbox, and Spotify run Python backends at scale. The bottleneck is almost never the language.</>)}
            </>)}
            {track === 'java' && (<>
              {para(<>Kavya&apos;s point is about <em>what happens at scale</em>. Java is 30 years old and still powers the backend of most banks, telecoms, and large e-commerce systems. This is not inertia — it is intentional. Java&apos;s <strong>strong type system</strong> catches an entire class of bugs before they reach production. When a refactor touches 200 files, the compiler tells you every place that broke.</>)}
              {para(<>The <strong>Spring ecosystem</strong> is what most Java backend engineers use in production. Spring Boot auto-configures dependency injection, web server, security, and observability — you write business logic, not plumbing. Learning Spring Boot is learning how professional Java backend development actually works at companies that have been running Java services for ten years.</>)}
            </>)}
            {track === 'nodejs' && (<>
              {para(<>Mei is right — Node.js has been production-grade backend infrastructure for over a decade. It succeeded for one reason initially: JavaScript was already everywhere. Developers who knew the frontend could write backend code without learning a new language. But Node brought something the professor didn&apos;t mention: a concurrency model that is genuinely excellent for the kind of work APIs do.</>)}
              {para(<>Node uses a <strong>single-threaded event loop</strong>. Instead of blocking a thread while waiting for a database query, Node registers a callback and moves on. When the I/O completes, the callback fires. A single Node process can handle thousands of concurrent connections without the memory overhead of thread-per-request systems. Netflix, LinkedIn, and Uber use Node for this reason.</>)}
            </>)}

            {keyBox(track === 'python' ? 'Python ecosystem by domain' : track === 'java' ? 'Java ecosystem by domain' : 'Node.js ecosystem by domain',
              track === 'python' ? [
                'Web APIs: FastAPI (modern, async), Flask (minimal), Django (batteries included)',
                'Data analysis: pandas, NumPy, Polars (the fast modern alternative to pandas)',
                'Machine learning: scikit-learn, PyTorch, TensorFlow, Hugging Face',
                'Automation & scripting: subprocess, pathlib, shutil, schedule',
                'Testing: pytest (the standard — write it from day one)',
              ] : track === 'java' ? [
                'Web APIs: Spring Boot (the industry standard), Quarkus, Micronaut',
                'Data access: Spring Data JPA, Hibernate ORM, JDBC',
                'Security: Spring Security',
                'Messaging: Kafka clients, Spring Kafka, RabbitMQ',
                'Testing: JUnit 5, Mockito, TestContainers',
              ] : [
                'Web frameworks: Express (minimal, flexible), Fastify (fast), NestJS (opinionated)',
                'Database ORMs: Prisma (TypeScript-first), Drizzle, Sequelize',
                'Real-time: Socket.io, WebSocket (ws)',
                'Testing: Jest, Vitest, Supertest',
                'Strong typing: TypeScript (strongly recommended from day one)',
              ]
            )}

            <LibraryMatcher track={track} accentColor={meta.accentColor} />

            {pullQuote(
              track === 'python' ? 'In Python, there is almost always a library for what you need. The skill is knowing which one to trust — and when to reach for it versus writing it yourself.' :
              track === 'java' ? 'Java verbosity is a feature at scale. When six engineers are modifying the same service, explicit types and structure prevent the codebase from becoming incomprehensible.' :
              'The event loop is Node\'s superpower for I/O-heavy work. But CPU-intensive tasks block the single thread — know the difference, and know when to reach for worker threads or a separate service.'
            )}

            <QuizEngine conceptId="swe-m1-ecosystem" conceptName="Language Ecosystem" moduleContext={meta.moduleContext}
              staticQuiz={track === 'python' ? {
                conceptId: 'swe-m1-ecosystem',
                question: 'A Python data pipeline is slow under load. A colleague suggests rewriting it in Rust. What is the stronger first investigation?',
                options: ['A. Profile where the time is actually going — it is likely I/O or an inefficient query, not Python speed', 'B. Python is simply too slow for production pipelines and Rust is the right call', 'C. Switch from pandas to NumPy — NumPy is optimised for large datasets'],
                correctIndex: 0,
                explanation: 'Most pipeline slowness comes from blocking I/O, N+1 queries, or missing indexes — not the language runtime. Profile before rewriting. Instagram and Dropbox run Python backends at scale. Measure first.',
              } : track === 'java' ? {
                conceptId: 'swe-m1-ecosystem',
                question: 'A new team member asks why the Java codebase uses explicit interfaces everywhere instead of just concrete classes. What is the most accurate explanation?',
                options: ['A. Interfaces let multiple implementations be swapped without changing calling code — enabling testing and extensibility', 'B. Java requires interfaces for all objects by language specification', 'C. Interfaces improve runtime performance because the JVM optimises them specially'],
                correctIndex: 0,
                explanation: 'Programming to an interface is a core Java design principle. It enables mocking in tests, multiple implementations, and reduces coupling between components. This is a deliberate design choice, not a language requirement.',
              } : {
                conceptId: 'swe-m1-ecosystem',
                question: 'A Node.js API handles 10,000 req/s of simple JSON queries fine but slows dramatically when generating a large PDF report. Most likely cause?',
                options: ['A. PDF generation is CPU-intensive and blocks Node\'s single-threaded event loop', 'B. Node cannot handle more than 10,000 requests — this is an architectural limit', 'C. The PDF library is not compatible with the Node version'],
                correctIndex: 0,
                explanation: 'Node\'s event loop handles I/O concurrency well but is blocked by CPU-heavy work. PDF generation is CPU-bound. The fix is offloading to a worker thread (worker_threads module) or a dedicated microservice.',
              }}
            />
          </ChapterSection>

          {/* ── SECTION 04 ───────────────────────────────── */}
          <ChapterSection id="swe-m1-reading-errors" num="04" accentRgb={ACCENT_RGB}>
            {chLabel('Debugging Mindset')}
            {h2(<>Reading errors like a senior engineer</>)}

            <StoryCard protagonist={meta.protagonist.split(' ')[0]} accentColor={meta.accentColor}>
              {track === 'python' && <>On her third day, Aisha runs the data pipeline and sees a wall of red text. Her first instinct is to copy the whole thing into a Google search. She pastes it into Slack instead, adding: &ldquo;I don&apos;t understand what this means.&rdquo; Riya sends back three words: &ldquo;Read the last line.&rdquo;</>}
              {track === 'java' && <>Vikram is refactoring the user service when a NullPointerException appears. He stares at the stack trace — fifteen lines of text, most of them starting with <code style={{ fontFamily: 'monospace', fontSize: '12px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>at org.springframework</code>. He feels completely lost. He asks Kavya to come look. She glances at the screen for three seconds and points: &ldquo;Line 42, UserService. That is your code. Start there.&rdquo;</>}
              {track === 'nodejs' && <>Leo pushes a small change to the users route and the whole API crashes. The terminal shows a TypeError with a 12-line stack trace. He immediately opens Google. Mei walks past his desk: &ldquo;Did you read the error?&rdquo; He pauses. He had not. He had just seen red text and panicked.</>}
            </StoryCard>

            {para(<>The single largest productivity gap between a junior and senior engineer is not syntax knowledge. It is how fast they go from &ldquo;something is broken&rdquo; to &ldquo;I know exactly what is broken and why.&rdquo; Senior engineers are fast at debugging not because they have seen every error — it is because they read errors before doing anything else.</>)}

            {h2(<>How to read a {track === 'java' ? 'stack trace' : track === 'python' ? 'traceback' : 'Node.js error'}</>)}

            {track === 'python' && (<>
              {para(<>Python tracebacks read <strong>bottom to top</strong>. The last line is the actual error — error type and message. The lines above it are the call chain. The most useful line is usually the last one that points to <em>your</em> file, not a library you imported.</>)}
              {keyBox('Reading a Python traceback', [
                '"Traceback (most recent call last):" — always the header, ignore it',
                'Lines with your file path — these are where YOUR code is involved',
                'Lines with site-packages/ — library code, usually not the root cause',
                'Last line = error type + message: KeyError: \'value\' — start here',
              ])}
            </>)}
            {track === 'java' && (<>
              {para(<>Java stack traces are verbose but information-rich. The first line names the exception and its message — that is your starting point. Everything below is the call chain. The rule Kavya used: <strong>find the first line that starts with your package</strong>, not a library package. That is your code. That is where you start.</>)}
              {keyBox('Reading a Java stack trace', [
                'Line 1: exception type + message — this is what broke and how',
                'at com.yourpackage.YourClass (YourClass.java:42) — this is your code',
                'at java.* or org.springframework.* — library code, skip these first',
                '"Caused by:" further down means a wrapped exception — read that section too',
              ])}
            </>)}
            {track === 'nodejs' && (<>
              {para(<>Node.js errors have three parts: an error type (TypeError, ReferenceError), a message describing what broke, and a stack trace showing the call chain. The rule Mei teaches: <strong>find the first line that points to a file in your project</strong>, not in node_modules. That is where the crash started.</>)}
              {keyBox('Reading a Node.js error', [
                'Line 1: error type + message — read this first, always',
                'Find the first line pointing to YOUR project file (not node_modules/)',
                'That file and line number is where the problem started',
                'For async errors: look for "at process.nextTick" or "at Promise" — async stack frames',
              ])}
            </>)}

            <TracebackReader track={track} accentColor={meta.accentColor} />

            <MentorCard name={meta.mentor} role={meta.mentorRole} color={meta.mentorColor}>
              {track === 'python' && <>&ldquo;When you get an error, your job for the next 60 seconds is to be a detective, not a fixer. Read the type. Read the message. Read the line number. Form one hypothesis before you touch the keyboard. If you skip this step and start changing things randomly, you will fix the wrong thing — or break something else trying to fix the first thing.&rdquo;</>}
              {track === 'java' && <>&ldquo;The mistake junior engineers make is trying to understand every line of a stack trace. You do not need to. You need to find YOUR code in it. Library frames are just noise — they tell you the path the exception took through the framework. Your frames tell you what you did wrong.&rdquo;</>}
              {track === 'nodejs' && <>&ldquo;The error message is telling you something specific. TypeError: Cannot read properties of undefined — someone is calling a method on a value that turned out to be undefined. That is actionable. The message tells you the type. The stack trace tells you the location. You have everything you need before you search for anything.&rdquo;</>}
            </MentorCard>

            {h2(<>The debugging loop</>)}
            {para(<>Professional debugging is hypothesis-driven. You read the error, form a theory about what caused it at that specific line, test that theory with a print statement or breakpoint, and revise. Jumping straight to Google before doing this step adds noise and slows you down.</>)}

            {keyBox('The debugging loop', [
              '1. Read the error fully — type, message, file, line number',
              '2. Form a hypothesis: what condition at that exact line causes this exact error?',
              '3. Verify your hypothesis with a print/log or breakpoint',
              '4. If wrong, revise the hypothesis — do not change random things hoping it fixes',
              '5. Once fixed, understand why — this is the step where learning happens',
            ])}

            {pullQuote('The engineers who ship reliable code fastest are not the ones who never have bugs. They are the ones who understand errors faster when bugs appear.')}

            <ApplyItBox prompt={
              track === 'python'
                ? 'Open your terminal and run: python3 -c "x = None; print(x.upper())". Read the traceback. Before searching anything, identify: (1) the error type on the last line, (2) the line number, (3) what value x has and why .upper() fails on it. Then fix it.'
                : track === 'java'
                ? 'Write a Java main method that tries to call .length() on a String variable you initialise to null. Compile and run it. Identify in the stack trace: (1) the exception type, (2) the first line pointing to your code, (3) what null-check you would add to prevent this.'
                : 'Create a file: const obj = undefined; console.log(obj.name); Run it with node. Before searching: identify (1) the error type, (2) the line in the stack pointing to your file, (3) whether a guard like obj?.name would prevent the crash.'
            } />

            <QuizEngine conceptId="swe-m1-debugging" conceptName="Debugging Mindset" moduleContext={meta.moduleContext}
              staticQuiz={{
                conceptId: 'swe-m1-debugging',
                question: 'A junior engineer gets an error they don\'t recognise. They immediately copy it into Google and paste a Stack Overflow fix. It doesn\'t work. What should they have done first?',
                options: ['A. Read the full error including file name and line number, then form a hypothesis before searching', 'B. Ask a senior engineer immediately — junior engineers shouldn\'t debug alone', 'C. Delete the code that caused the error and rewrite it from scratch'],
                correctIndex: 0,
                explanation: 'The error message plus file and line almost always point to the root cause. Hypothesis-driven debugging is faster than pattern-matching from search results. Senior engineers expect you to have understood the error before escalating.',
              }}
            />

            <NextChapterTeaser text="In Pre-Read 02, you will learn the core language fundamentals — variables, data types, control flow, and the design patterns professional engineers use to write readable, maintainable code." />
          </ChapterSection>

        </div>{/* end main content */}

        {/* Right sidebar */}
        <aside className="right-col" style={{ position: 'sticky', top: '57px', height: 'fit-content', paddingTop: '0', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          <div style={{ ...cardStyle, borderTop: `3px solid ${meta.accentColor}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '2px' }}>Level</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: xpLevel.color, whiteSpace: 'nowrap' as const }}>{xpLevel.label}</div>
              </div>
              <div style={{ textAlign: 'right' as const, position: 'relative', overflow: 'visible' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '2px' }}>XP</div>
                <motion.div key={totalXP} animate={{ scale: [1.12, 1] }} transition={{ duration: 0.25 }} style={{ fontSize: '22px', fontWeight: 900, color: meta.accentColor, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{totalXP}</motion.div>
                <AnimatePresence>{showGain && (<motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -20 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} style={{ position: 'absolute', right: 0, top: '-6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: meta.accentColor, pointerEvents: 'none', whiteSpace: 'nowrap' as const }}>+{gainAmt}</motion.div>)}</AnimatePresence>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              {[{ label: 'Reading', val: readingXP, color: meta.accentColor }, { label: 'Quizzes', val: quizXP, color: '#0D7A5A' }].map(b => (
                <div key={b.label} style={{ flex: 1, padding: '5px 8px', borderRadius: '5px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
                  <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', marginBottom: '2px', textTransform: 'uppercase' as const }}>{b.label}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: b.color }}>{b.val} xp</div>
                </div>
              ))}
            </div>
            {nextLevel ? (<>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{levelPct}% to {nextLevel.label}</span>
                <span style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>{nextLevel.min - totalXP} xp</span>
              </div>
              <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}><motion.div animate={{ width: `${levelPct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: meta.accentColor, borderRadius: '2px' }} /></div>
            </>) : <div style={{ fontSize: '11px', color: meta.accentColor, fontWeight: 700 }}>✦ Max level reached</div>}
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)' }}>Module Progress</div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: meta.accentColor }}>{progressPct}%</span>
            </div>
            <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}><motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: meta.accentColor, borderRadius: '2px' }} /></div>
            <div style={{ marginTop: '6px', fontSize: '10px', color: 'var(--ed-ink3)' }}>{completedSections.size} of {SECTIONS.length} parts · {MODULE_TIME}</div>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)' }}>Badges</div>
              <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{ACHIEVEMENTS.filter(a => completedSections.has(a.id)).length}/{ACHIEVEMENTS.length}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', padding: '2px' }}>
              {ACHIEVEMENTS.map(a => {
                const unlocked = completedSections.has(a.id);
                return (
                  <div key={a.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                    <motion.div whileHover={{ scale: 1.08 }} title={unlocked ? `${a.label}: ${a.desc}` : 'Locked'}
                      style={{ width: '36px', height: '36px', borderRadius: '8px', background: unlocked ? `rgba(${ACCENT_RGB},0.12)` : 'var(--ed-cream)', border: `1px solid ${unlocked ? `rgba(${ACCENT_RGB},0.3)` : 'var(--ed-rule)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', filter: unlocked ? 'none' : 'grayscale(1) opacity(0.3)', transition: 'all 0.3s', cursor: 'default' }}>
                      {a.icon}
                    </motion.div>
                    <div style={{ fontSize: '8px', color: unlocked ? 'var(--ed-ink3)' : 'transparent', fontWeight: 600, textAlign: 'center' as const, maxWidth: '40px', lineHeight: 1.2, wordBreak: 'break-word' as const }}>{a.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ ...cardStyle, borderLeft: `3px solid ${meta.accentColor}` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '10px' }}>Concept Mastery</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {CONCEPT_DETAILS.map(c => {
                const pct = Math.round((store.conceptStates[c.id]?.pKnow ?? 0) * 100);
                return (
                  <div key={c.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--ed-ink2)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{c.label}</span>
                      <span style={{ fontSize: '10px', color: pct > 0 ? c.color : 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, flexShrink: 0 }}>{pct}%</span>
                    </div>
                    <div style={{ height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}><motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: c.color, borderRadius: '2px' }} /></div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '10px', fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>Complete quizzes to raise mastery scores</div>
          </div>

          {store.streakDays > 0 && (
            <div style={{ ...cardStyle, borderLeft: '3px solid #C85A40' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <motion.span animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ fontSize: '20px', flexShrink: 0 }}>🔥</motion.span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#C85A40', lineHeight: 1 }}>{store.streakDays} day{store.streakDays !== 1 ? 's' : ''}</div>
                  <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '2px' }}>learning streak</div>
                </div>
              </div>
            </div>
          )}

        </aside>

      </div>
      </div>
    </div>
  );
}

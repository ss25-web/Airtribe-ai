'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import QuizEngine from './QuizEngine';
import type { SWETrack, SWELevel } from './sweTypes';
import {
  ApplyItBox,
  ChapterSection,
  NextChapterTeaser,
  SituationCard,
  chLabel,
  h2,
  keyBox,
  para,
  pullQuote,
} from './pm-fundamentals/designSystem';

const ACCENT = '#16A34A';
const ACCENT_RGB = '22,163,74';

const TRACK_META: Record<SWETrack, {
  label: string;
  shortLabel: string;
  introTitle: string;
  protagonist: string;
  protagonistRole: string;
  company: string;
  moduleContext: string;
  accentColor: string;
  accentGradient: string;
}> = {
  python: {
    label: 'Python Track',
    shortLabel: 'Python',
    introTitle: 'How Software Works · Python Lens',
    protagonist: 'Aisha Patel',
    protagonistRole: 'Junior Data Engineer, Mosaic Analytics',
    company: 'Mosaic Analytics',
    moduleContext: 'Software Engineering Launchpad · Python Track · Pre-Read 01. Follows Aisha, a junior data engineer at Mosaic Analytics, as she learns how Python code actually runs, what the terminal is for, and how to read her first error message.',
    accentColor: '#16A34A',
    accentGradient: 'linear-gradient(135deg, #16A34A, #0D9488)',
  },
  java: {
    label: 'Java Track',
    shortLabel: 'Java',
    introTitle: 'How Software Works · Java Lens',
    protagonist: 'Vikram Nair',
    protagonistRole: 'Junior Backend Engineer, Finova Systems',
    company: 'Finova Systems',
    moduleContext: 'Software Engineering Launchpad · Java Track · Pre-Read 01. Follows Vikram, a junior backend engineer at Finova Systems, as he learns how Java compiles and runs, what the JVM actually does, and why types matter before writing his first class.',
    accentColor: '#0369A1',
    accentGradient: 'linear-gradient(135deg, #0369A1, #7C3AED)',
  },
  nodejs: {
    label: 'Node.js Track',
    shortLabel: 'Node.js',
    introTitle: 'How Software Works · Node.js Lens',
    protagonist: 'Leo Chen',
    protagonistRole: 'Junior Full-Stack Developer, Launchly',
    company: 'Launchly',
    moduleContext: 'Software Engineering Launchpad · Node.js Track · Pre-Read 01. Follows Leo, a junior full-stack developer at Launchly, as he learns how Node.js runs JavaScript outside the browser, what the event loop really means, and how to build his first HTTP server.',
    accentColor: '#CA8A04',
    accentGradient: 'linear-gradient(135deg, #CA8A04, #16A34A)',
  },
};

const SECTIONS = [
  { id: 'swe-m1-how-code-runs', label: 'How Code Runs' },
  { id: 'swe-m1-dev-environment', label: 'Your Dev Environment' },
  { id: 'swe-m1-language-ecosystem', label: 'Your Language & Ecosystem' },
  { id: 'swe-m1-reading-errors', label: 'Reading Errors & Debugging' },
];

const CONCEPTS = ['swe-m1-execution', 'swe-m1-environment', 'swe-m1-ecosystem', 'swe-m1-debugging'];
const SECTION_XP = 50;
const QUIZ_XP = 100;

interface Props {
  track: SWETrack;
  level: SWELevel;
  onBack: () => void;
}

export default function SWEPreRead1({ track, level, onBack }: Props) {
  const meta = TRACK_META[track];
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  const store = useLearnerStore();

  const readingXP = completedSections.size * SECTION_XP;
  const quizXP = CONCEPTS.reduce((sum, c) => {
    const pKnow = store.conceptStates[c]?.pKnow ?? 0;
    return sum + Math.round(pKnow * QUIZ_XP);
  }, 0);
  const totalXP = readingXP + quizXP;

  useEffect(() => {
    store.initSession();
    CONCEPTS.forEach(c => store.ensureConceptState(c));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = entry.target.getAttribute('data-section');
        if (!sectionId) return;
        if (entry.isIntersecting) {
          if (entry.intersectionRatio >= 0.1) setActiveSection(sectionId);
          if (entry.intersectionRatio >= 0.25) {
            setCompletedSections(prev => new Set([...prev, sectionId]));
            store.markSectionViewed(sectionId);
          }
        }
      });
    }, { threshold: [0.1, 0.25, 0.5] });

    const timer = setTimeout(() => {
      document.querySelectorAll('[data-section]').forEach(el => obs.observe(el));
    }, 150);

    return () => { clearTimeout(timer); obs.disconnect(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="editorial" style={{ minHeight: '100vh', background: 'var(--ed-cream)' }}>

      {/* Top nav */}
      <div className="screen-topbar" style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'var(--ed-card)', borderBottom: '1px solid var(--ed-rule)',
        padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ed-ink3)', fontSize: '13px', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          <div style={{ flexShrink: 0, width: '20px', height: '20px', borderRadius: '4px', background: meta.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
              <rect x="9" y="2" width="5" height="5" rx="1" fill="white" />
              <rect x="2" y="9" width="5" height="5" rx="1" fill="white" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
            </svg>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.1em', whiteSpace: 'nowrap' as const }}>
            SWE · {meta.shortLabel.toUpperCase()} · {level === 'advanced' ? '🚀 ADVANCED' : '🌱 BEGINNER'} · PRE-READ 01
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: meta.accentColor, fontWeight: 700 }}>
            {totalXP} XP
          </div>
          <div style={{ width: '80px', height: '4px', borderRadius: '2px', background: 'var(--ed-rule)', overflow: 'hidden' }}>
            <motion.div animate={{ width: `${Math.min((completedSections.size / SECTIONS.length) * 100, 100)}%` }} style={{ height: '100%', background: meta.accentGradient, borderRadius: '2px' }} />
          </div>
        </div>
      </div>

      {/* 3-column layout */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '200px 1fr 220px', gap: '0', padding: '0 24px' }}>

        {/* Left nav */}
        <div style={{ position: 'sticky', top: '57px', height: 'fit-content', paddingTop: '40px', paddingRight: '24px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--ed-ink3)', marginBottom: '12px', textTransform: 'uppercase' as const }}>
            Sections
          </div>
          {SECTIONS.map(s => (
            <div
              key={s.id}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              style={{
                padding: '7px 10px', borderRadius: '6px', marginBottom: '2px', cursor: 'pointer',
                fontSize: '12px', lineHeight: 1.4,
                color: activeSection === s.id ? meta.accentColor : 'var(--ed-ink3)',
                background: activeSection === s.id ? `rgba(${ACCENT_RGB},0.08)` : 'transparent',
                borderLeft: `2px solid ${activeSection === s.id ? meta.accentColor : 'transparent'}`,
                fontWeight: activeSection === s.id ? 600 : 400,
                transition: 'all 0.15s',
              }}>
              {completedSections.has(s.id) && <span style={{ marginRight: '4px', fontSize: '10px' }}>✓</span>}
              {s.label}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ paddingTop: '40px', paddingBottom: '80px', borderLeft: '1px solid var(--ed-rule)', borderRight: '1px solid var(--ed-rule)', paddingLeft: '40px', paddingRight: '40px', minWidth: 0 }}>

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '48px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: meta.accentColor, marginBottom: '12px' }}>
              SOFTWARE ENGINEERING LAUNCHPAD · {meta.shortLabel.toUpperCase()} · PRE-READ 01
            </div>
            <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '16px' }}>
              {meta.introTitle}
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ed-ink2)', lineHeight: 1.75, maxWidth: '580px', marginBottom: '24px' }}>
              Most people learning to code jump straight to syntax. This pre-read goes one level deeper — how the machine executes your instructions, what tools sit between you and production, and how to think when something goes wrong.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' as const }}>
              {[
                { label: 'Time', value: '25 min read' },
                { label: 'Protagonist', value: meta.protagonist },
                { label: 'Company', value: meta.company },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '6px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginTop: '1px' }}>{item.label}</span>
                  <span style={{ color: 'var(--ed-ink2)', fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 01 — How Code Runs */}
          <ChapterSection id="swe-m1-how-code-runs" num="01" accentRgb={ACCENT_RGB} first>
            {chLabel('The Execution Model')}
            {h2(<>When you run a program, what actually happens?</>)}

            <SituationCard accent={meta.accentColor} accentRgb={ACCENT_RGB}>
              {track === 'python' && (
                <>Aisha runs her first Python file with <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>python script.py</code> in the terminal. Something prints. She has no idea what just happened between her typing that command and seeing the output.</>
              )}
              {track === 'java' && (
                <>Vikram types <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>javac Main.java</code> and then <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>java Main</code>. Two commands just to run one file. His colleague says this is &ldquo;the Java way&rdquo; but does not explain why.</>
              )}
              {track === 'nodejs' && (
                <>Leo types <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>node app.js</code> in his terminal. This is JavaScript — the same language he has been writing in the browser. But something feels different. There is no HTML. There is no DOM. Just a blank terminal waiting.</>
              )}
            </SituationCard>

            {para(<>Your source code — the text you write in your editor — is not what the computer runs. The computer runs machine code: sequences of ones and zeros that tell the CPU exactly what to do. Everything in between is translation.</>)}

            {h2(<>Compiled vs Interpreted</>)}
            {para(<>Languages differ in <em>when</em> that translation happens. This distinction shapes everything: startup speed, error timing, tooling, and the kind of mistakes you catch before vs after shipping.</>)}

            {track === 'java' && (
              <>
                {para(<>Java uses a two-step model. First, <strong>javac</strong> (the compiler) reads your <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>.java</code> files and produces <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>.class</code> files — not machine code, but <strong>bytecode</strong>: a portable intermediate representation. Then the <strong>Java Virtual Machine (JVM)</strong> reads that bytecode and runs it. The JVM translates bytecode to native machine instructions just in time (JIT compilation) as your program runs.</>)}
                {keyBox('The JVM Promise', [
                  'Write once, run anywhere — the same .class files run on any OS with a JVM installed',
                  'The compiler catches type errors before the program ever runs',
                  'The JVM manages memory automatically via garbage collection',
                  'JIT compilation makes Java surprisingly fast at runtime despite the extra layer',
                ])}
              </>
            )}
            {track === 'python' && (
              <>
                {para(<>Python is an <strong>interpreted language</strong>. When you run <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>python script.py</code>, the <strong>CPython interpreter</strong> reads your source code line by line and executes it immediately. There is no separate compile step. This is why Python errors often only appear when a specific line of code is reached — the interpreter has not read ahead.</>)}
                {keyBox('The CPython Model', [
                  'Source code (.py) → CPython interpreter → execution',
                  'Errors are runtime by default — they appear when a line is reached',
                  'Python also compiles to bytecode (.pyc) internally for caching — you rarely see this',
                  'The interpreter is itself a program: type python3 --version to see which one you have',
                ])}
              </>
            )}
            {track === 'nodejs' && (
              <>
                {para(<>Node.js is a <strong>JavaScript runtime</strong> built on Chrome&apos;s <strong>V8 engine</strong> — the same engine that runs JavaScript in your browser. V8 compiles JavaScript to native machine code directly (no intermediate bytecode). This is why Node can be surprisingly fast for a &ldquo;scripting&rdquo; language.</>)}
                {keyBox('The V8 Model', [
                  'JavaScript source → V8 engine → native machine code (JIT compiled)',
                  'Node.js adds APIs that browsers don\'t have: file system, network, OS access',
                  'The same JS engine runs in Chrome (browser) and in your terminal (Node)',
                  'node --version tells you the Node runtime version; this also implies a V8 version',
                ])}
              </>
            )}

            {pullQuote('Understanding your runtime is not academic. When a bug only appears under load, or a library behaves differently in production than on your machine, the execution model is usually why.')}

            <QuizEngine
              conceptId="swe-m1-execution"
              conceptName="Execution Model"
              moduleContext={meta.moduleContext}
              staticQuiz={track === 'java' ? {
                conceptId: 'swe-m1-execution',
                question: 'A Java program compiles fine but crashes at runtime with a NullPointerException. What does this tell you about Java\'s execution model?',
                options: [
                  'A. The compiler missed the bug because it only checks syntax, not all runtime behaviour',
                  'B. The JVM is faulty and should have caught this at compile time',
                  'C. The program was not compiled with javac — it ran the raw .java source',
                ],
                correctIndex: 0,
                explanation: 'The compiler checks types and syntax, but some errors only manifest when specific code paths run. NullPointerException is a runtime condition — the JVM enforces additional constraints that cannot be checked statically.',
                keyInsight: 'Compile-time safety catches type errors. Runtime behaviour depends on actual values, which the compiler cannot predict.',
              } : track === 'python' ? {
                conceptId: 'swe-m1-execution',
                question: 'A Python script has a syntax error on line 42 but the script runs fine when line 42 is never reached. What does this reveal?',
                options: [
                  'A. CPython interprets code line by line — lines not reached are not executed',
                  'B. Python ignores syntax errors in some files',
                  'C. The script is cached from a previous valid run',
                ],
                correctIndex: 0,
                explanation: 'CPython does parse the whole file for syntax before running, but logic errors inside un-reached branches only surface when those branches execute. This is why test coverage that exercises all branches matters.',
                keyInsight: 'Python\'s interpreter model means bugs in untested branches can ship silently.',
              } : {
                conceptId: 'swe-m1-execution',
                question: 'A Node.js app works fine on your machine but crashes in production when a specific API endpoint is called. Most likely cause?',
                options: [
                  'A. A code path reached in production was never exercised during local testing',
                  'B. Node.js behaves differently per operating system due to V8 differences',
                  'C. Production uses a different JavaScript version than development',
                ],
                correctIndex: 0,
                explanation: 'Node runs the same V8 engine locally and in production. Environmental differences (missing env vars, different data shapes, higher concurrency) expose code paths that local testing missed — not a runtime difference.',
                keyInsight: 'The engine is the same everywhere. The difference is what code paths get exercised.',
              }}
            />
          </ChapterSection>

          {/* Section 02 — Dev Environment */}
          <ChapterSection id="swe-m1-dev-environment" num="02" accentRgb={ACCENT_RGB}>
            {chLabel('The Developer Environment')}
            {h2(<>Your tools before you write a single line</>)}

            {para(<>Professional engineers spend significant time thinking about their environment — the set of tools, configurations, and habits that let them write, run, and debug code reliably. Getting this right early prevents weeks of &ldquo;works on my machine&rdquo; problems later.</>)}

            {h2(<>The Terminal</>)}
            {para(<>The terminal (also called the command line or shell) is where you will spend a surprising amount of your time as a developer. It is not just for running scripts — it is how you install dependencies, start servers, run tests, manage files, and interact with version control.</>)}

            {keyBox('Terminal basics you need immediately', [
              'pwd — print working directory (where are you right now?)',
              'ls (Mac/Linux) or dir (Windows) — list files in current directory',
              'cd folder-name — change into a directory',
              'cd .. — go up one level',
              'Ctrl+C — stop a running process (the most important shortcut)',
            ])}

            {h2(<>Your Editor: VS Code</>)}
            {para(<>VS Code is the industry standard for most software engineering work. The features that matter most early on are: syntax highlighting (code in different colours), the integrated terminal (run commands without leaving the editor), and the file explorer (see your project structure).</>)}

            {h2(<>
              {track === 'python' && 'Python: pip and Virtual Environments'}
              {track === 'java' && 'Java: the JDK and Maven'}
              {track === 'nodejs' && 'Node.js: npm and package.json'}
            </>)}

            {track === 'python' && (
              <>
                {para(<><strong>pip</strong> is Python&apos;s package manager. When you run <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>pip install requests</code>, it downloads the <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>requests</code> library from PyPI (the Python Package Index) and installs it on your machine.</>)}
                {para(<>The problem: if you install every package globally, different projects will conflict with each other. The solution is a <strong>virtual environment</strong> — a self-contained Python installation per project. You activate it, and pip installs only go into that project&apos;s folder.</>)}
                {keyBox('Virtual environment workflow', [
                  'python3 -m venv venv — create a virtual environment in a folder called venv',
                  'source venv/bin/activate (Mac/Linux) or venv\\Scripts\\activate (Windows)',
                  'pip install <package> — installs into the venv, not globally',
                  'pip freeze > requirements.txt — saves a list of installed packages',
                  'deactivate — exit the virtual environment',
                ])}
              </>
            )}
            {track === 'java' && (
              <>
                {para(<>The <strong>JDK (Java Development Kit)</strong> includes the compiler (<code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>javac</code>), the runtime (<code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>java</code>), and the standard library. You cannot write or run Java without it. Install JDK 21 (the current LTS version).</>)}
                {para(<><strong>Maven</strong> is a build tool and dependency manager. You describe your project and its dependencies in a file called <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>pom.xml</code>, and Maven downloads them, compiles your code, and runs tests. You will almost never manage JAR files manually.</>)}
                {keyBox('Maven workflow', [
                  'mvn compile — compile the project',
                  'mvn test — run all tests',
                  'mvn package — build a .jar file',
                  'mvn spring-boot:run — start a Spring Boot app directly',
                  'pom.xml — the file that defines your project dependencies (like package.json for Java)',
                ])}
              </>
            )}
            {track === 'nodejs' && (
              <>
                {para(<><strong>npm</strong> (Node Package Manager) comes bundled with Node.js. When you run <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>npm install express</code>, npm downloads the <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>express</code> package and its dependencies into a <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>node_modules</code> folder.</>)}
                {para(<><strong>package.json</strong> is the heart of every Node.js project. It lists your project&apos;s name, version, scripts (like how to start or test the app), and dependencies. Running <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>npm install</code> in a cloned project reads this file and downloads everything it needs.</>)}
                {keyBox('npm workflow', [
                  'npm init -y — create a package.json with defaults',
                  'npm install <package> — add a dependency',
                  'npm install --save-dev <package> — add a dev-only dependency (tests, build tools)',
                  'npm run start — run the "start" script defined in package.json',
                  '.gitignore node_modules — never commit this folder (it is huge and reproducible)',
                ])}
              </>
            )}

            {h2(<>Version Control: Git</>)}
            {para(<>Git is not optional. Every professional engineering team uses version control. Git lets you save checkpoints of your code (commits), experiment without fear (branches), and collaborate with others (pull requests).</>)}

            {keyBox('Git commands you need on day one', [
              'git init — start tracking a folder with git',
              'git add . — stage all changed files',
              'git commit -m "describe what changed" — save a checkpoint',
              'git log — see the history of commits',
              'git status — see what has changed since the last commit',
            ])}

            <QuizEngine
              conceptId="swe-m1-environment"
              conceptName="Developer Environment"
              moduleContext={meta.moduleContext}
              staticQuiz={track === 'python' ? {
                conceptId: 'swe-m1-environment',
                question: 'A colleague\'s Python script works fine but yours crashes with "ModuleNotFoundError: No module named requests". Most likely cause?',
                options: [
                  'A. Your virtual environment does not have requests installed, or you are in the wrong venv',
                  'B. Python version mismatch — requests only works on Python 2',
                  'C. The module name should be capitalised: "Requests"',
                ],
                correctIndex: 0,
                explanation: 'Each virtual environment has its own installed packages. If you activated a different venv than your colleague, or no venv at all, the package will not be found in that environment.',
                keyInsight: 'Always check which venv is active before debugging package errors.',
              } : track === 'java' ? {
                conceptId: 'swe-m1-environment',
                question: 'You clone a Java project and run mvn compile. It fails with "could not find dependency". What is most likely missing?',
                options: [
                  'A. Maven has not downloaded the dependencies listed in pom.xml to the local cache',
                  'B. The JDK is not installed',
                  'C. There is a bug in the import statement',
                ],
                correctIndex: 0,
                explanation: 'Maven reads pom.xml to know what to download, but a fresh clone has no local cache. Running mvn install or letting your IDE resolve dependencies fetches the JARs.',
                keyInsight: 'pom.xml declares dependencies; Maven downloads them. A fresh clone always needs a dependency fetch.',
              } : {
                conceptId: 'swe-m1-environment',
                question: 'You clone a Node.js project and run node app.js. It crashes with "Cannot find module \'express\'". What is the fix?',
                options: [
                  'A. Run npm install — node_modules is never committed to git',
                  'B. Express is not compatible with your Node.js version',
                  'C. Change the import statement from require() to import',
                ],
                correctIndex: 0,
                explanation: 'node_modules is listed in .gitignore and never committed. When you clone a project, npm install reads package.json and downloads all dependencies into node_modules.',
                keyInsight: 'First thing after cloning a Node.js project: npm install.',
              }}
            />
          </ChapterSection>

          {/* Section 03 — Language Ecosystem */}
          <ChapterSection id="swe-m1-language-ecosystem" num="03" accentRgb={ACCENT_RGB}>
            {chLabel('The Ecosystem')}
            {h2(<>
              {track === 'python' && <>Why engineers reach for Python</>}
              {track === 'java' && <>Why enterprises run on Java</>}
              {track === 'nodejs' && <>Why JavaScript conquered the backend</>}
            </>)}

            {track === 'python' && (
              <>
                {para(<>Python is not fast. Compared to Java or C++, CPython is slow. But for most software engineering work, the bottleneck is network I/O and database queries — not CPU cycles. Python&apos;s productivity advantage more than compensates.</>)}
                {para(<>Python&apos;s real power is its ecosystem. The combination of <strong>NumPy</strong> and <strong>pandas</strong> for data, <strong>scikit-learn</strong> and <strong>PyTorch</strong> for ML, and <strong>FastAPI</strong> for web APIs means that Python is often the only language a data-heavy team needs. The community around these libraries is unmatched.</>)}
                {keyBox('Python ecosystem by domain', [
                  'Web APIs: FastAPI (modern, fast), Flask (minimal), Django (batteries included)',
                  'Data analysis: pandas, NumPy, Polars (the fast modern alternative to pandas)',
                  'Machine learning: scikit-learn, PyTorch, TensorFlow, Hugging Face',
                  'Automation & scripting: subprocess, pathlib, shutil, schedule',
                  'Testing: pytest (the standard — write it from day one)',
                ])}
                {pullQuote('In Python, there is almost always a library for what you need. The skill is knowing which one to trust.')}
              </>
            )}

            {track === 'java' && (
              <>
                {para(<>Java is 30 years old and still powers the backend of most banks, telecoms, and large e-commerce systems. This is not inertia — it is intentional. Java&apos;s strong type system, mature tooling, and JVM performance make it genuinely good for systems that need to run correctly at scale for decades.</>)}
                {para(<>The <strong>Spring ecosystem</strong> is what most Java backend engineers use. Spring Boot in particular makes it fast to build production-ready REST APIs with dependency injection, data access, security, and observability already wired in. Learning Spring Boot is learning how professional Java backend development actually works.</>)}
                {keyBox('Java ecosystem by domain', [
                  'Web APIs: Spring Boot (the industry standard), Quarkus, Micronaut',
                  'Data access: Spring Data JPA, Hibernate ORM, JDBC',
                  'Security: Spring Security',
                  'Messaging: Kafka clients, Spring Kafka, RabbitMQ',
                  'Testing: JUnit 5, Mockito, TestContainers',
                ])}
                {pullQuote('Java verbosity is a feature at scale. When six engineers are modifying the same service, explicit types and structure are what prevent the codebase from becoming incomprehensible.')}
              </>
            )}

            {track === 'nodejs' && (
              <>
                {para(<>Node.js succeeded for one reason: JavaScript was already everywhere. Developers who knew the frontend could now write backend code without learning a new language. But Node brought something else — a genuinely different concurrency model that turns out to be excellent for I/O-heavy services.</>)}
                {para(<>Node uses a <strong>single-threaded event loop</strong>. Instead of blocking a thread while waiting for a database query or file read, Node registers a callback and moves on. When the I/O completes, the callback fires. This means a single Node process can handle thousands of concurrent connections without the overhead of thread-per-request systems. It is why Node performs well as an API gateway or real-time backend.</>)}
                {keyBox('Node.js ecosystem by domain', [
                  'Web frameworks: Express (minimal, flexible), Fastify (fast), NestJS (opinionated, TypeScript-first)',
                  'Database ORMs: Prisma (TypeScript-first), Drizzle, Sequelize',
                  'Real-time: Socket.io, WebSocket (ws)',
                  'Testing: Jest, Vitest, Supertest',
                  'Runtime security and typing: TypeScript (strongly recommended from day one)',
                ])}
                {pullQuote('The event loop is Node\'s superpower for I/O-heavy work. But CPU-intensive tasks block it — know the difference.')}
              </>
            )}

            <QuizEngine
              conceptId="swe-m1-ecosystem"
              conceptName="Language Ecosystem"
              moduleContext={meta.moduleContext}
              staticQuiz={track === 'python' ? {
                conceptId: 'swe-m1-ecosystem',
                question: 'A Python web API is slow under load. A colleague suggests rewriting it in Rust. What is the stronger first investigation?',
                options: [
                  'A. Profile where the time is actually going — it is probably I/O or an inefficient query, not Python speed',
                  'B. Python is simply too slow for production web APIs and Rust is the right call',
                  'C. Switch from FastAPI to Django — Django is optimised for high throughput',
                ],
                correctIndex: 0,
                explanation: 'Most web API slowness comes from blocking I/O, N+1 queries, or missing indexes — not the language runtime. Instagram, Dropbox, and Spotify run Python backends at scale. Profile before rewriting.',
                keyInsight: 'Measure before rewriting. The bottleneck is almost never the language.',
              } : track === 'java' ? {
                conceptId: 'swe-m1-ecosystem',
                question: 'A new team member asks why the Java codebase uses explicit interfaces everywhere. What is the most accurate explanation?',
                options: [
                  'A. Interfaces allow multiple implementations to be swapped without changing calling code — enabling testing and extensibility',
                  'B. Java requires interfaces for all objects by language specification',
                  'C. Interfaces improve runtime performance because the JVM optimises them specially',
                ],
                correctIndex: 0,
                explanation: 'Programming to an interface is a core Java design principle. It enables mocking in tests, multiple implementations, and reduces coupling between components. It is a design choice, not a language requirement.',
                keyInsight: 'Interfaces in Java are about flexibility and testability, not performance.',
              } : {
                conceptId: 'swe-m1-ecosystem',
                question: 'Your Node.js API handles 10,000 req/s of simple JSON queries fine but slows dramatically when generating a large PDF. Most likely cause?',
                options: [
                  'A. PDF generation is CPU-intensive and blocks Node\'s single-threaded event loop',
                  'B. Node cannot handle more than 10,000 requests — this is an architectural limit',
                  'C. The PDF library is not compatible with the Node version',
                ],
                correctIndex: 0,
                explanation: 'Node\'s event loop handles I/O concurrency well but is blocked by CPU-heavy work. PDF generation is CPU-bound. The fix is offloading to a worker thread or a separate service.',
                keyInsight: 'Event loop = great for I/O. CPU work blocks it. Know the difference.',
              }}
            />
          </ChapterSection>

          {/* Section 04 — Reading Errors */}
          <ChapterSection id="swe-m1-reading-errors" num="04" accentRgb={ACCENT_RGB}>
            {chLabel('Debugging Mindset')}
            {h2(<>Reading errors like a senior engineer</>)}

            {para(<>The single largest productivity gap between a junior and senior engineer is not syntax knowledge. It is how fast they go from &ldquo;something is broken&rdquo; to &ldquo;I know exactly what is broken and why.&rdquo; That skill is built from one habit: reading the error message carefully before doing anything else.</>)}

            {track === 'python' && (
              <>
                {para(<>Python error messages are called <strong>tracebacks</strong>. They show the call stack — the chain of function calls that led to the error — with the most recent call at the bottom. The bottom line is usually the most important. Read from bottom to top.</>)}
                {keyBox('Reading a Python traceback', [
                  'The last line tells you the error type (ValueError, TypeError, etc.) and what went wrong',
                  'The second-to-last block tells you the exact file and line number where it broke',
                  'Work up the stack only if you need to understand how you got there',
                  'Search the exact error type + message if you don\'t recognise it — Stack Overflow will have it',
                ])}
              </>
            )}
            {track === 'java' && (
              <>
                {para(<>Java exceptions are verbose but information-rich. The first line names the exception and its message. Everything below it is the stack trace — function calls that led there. The line that matters is usually the first one in <em>your</em> code (not in a library).</>)}
                {keyBox('Reading a Java stack trace', [
                  'Exception type on line 1: NullPointerException, IllegalArgumentException, etc.',
                  'at com.yourpackage.YourClass.yourMethod(YourClass.java:42) — this is your code',
                  'Lines from java.* or org.springframework.* are library code — skip past them to find yours',
                  'Caused by: at the bottom of a trace means a wrapped exception — read that too',
                ])}
              </>
            )}
            {track === 'nodejs' && (
              <>
                {para(<>Node.js errors include a type (TypeError, ReferenceError), a message, and a stack trace. The stack trace shows the call chain. The key line is usually the first one pointing to a file in your project (not in node_modules).</>)}
                {keyBox('Reading a Node.js error', [
                  'Error type + message on line 1: TypeError: Cannot read properties of undefined',
                  'Find the first line that points to YOUR file, not node_modules',
                  'That file and line number is where the problem started',
                  'For async errors, look for lines marked at process.nextTick or at Promise — they indicate async stack frames',
                ])}
              </>
            )}

            {h2(<>The debugging loop</>)}
            {para(<>Professional debugging is not random. It is a hypothesis-driven loop: read the error, form a theory, test the theory, revise. Jumping straight to Google or AI tools without reading the error first adds noise instead of signal.</>)}

            {keyBox('The debugging loop', [
              '1. Read the error message fully — what type, what line, what message?',
              '2. Form a hypothesis: what condition could cause exactly this error at exactly this line?',
              '3. Add a print/log statement or set a breakpoint to verify your hypothesis',
              '4. If wrong, revise — do not change random things and hope it fixes itself',
              '5. Once fixed, understand why it was wrong — this is where learning happens',
            ])}

            {pullQuote('The engineers who ship reliable code fastest are not the ones who never have bugs. They are the ones who understand errors faster when bugs appear.')}

            <ApplyItBox prompt={
              track === 'python'
                ? 'Open your terminal and run: python3 -c "x = None; print(x.upper())". Read the traceback. Identify: (1) the error type, (2) what line it occurred on, (3) what you would change to fix it. Then fix it.'
                : track === 'java'
                ? 'Write a Java class with a main method that tries to call .length() on a null String. Compile and run it. Identify in the stack trace: (1) the exception type, (2) the line in your code, (3) what null check would prevent this.'
                : 'Open a new Node.js file. Write: const obj = null; console.log(obj.name); Run it with node. Read the error. Identify: (1) the error type, (2) the line, (3) what guard would prevent this (hint: optional chaining).'
            } />

            <QuizEngine
              conceptId="swe-m1-debugging"
              conceptName="Debugging Mindset"
              moduleContext={meta.moduleContext}
              staticQuiz={{
                conceptId: 'swe-m1-debugging',
                question: 'A junior engineer gets an error they don\'t recognise. They immediately search for the error message online and copy a Stack Overflow answer. It doesn\'t fix the problem. What should they have done first?',
                options: [
                  'A. Read the full error including file name and line number, then form a hypothesis before searching',
                  'B. Ask a senior engineer immediately — online resources can mislead junior engineers',
                  'C. Delete the code that caused the error and rewrite it from scratch',
                ],
                correctIndex: 0,
                explanation: 'The error message plus the specific file and line almost always point to the root cause. Hypothesis-driven debugging is faster than pattern matching from search results. Senior engineers expect juniors to have understood the error before escalating.',
                keyInsight: 'Read the error fully. Form a hypothesis. Then search if needed.',
              }}
            />

            <NextChapterTeaser text="In Pre-Read 02, you will learn the core language fundamentals — variables, data types, control flow, and the patterns professional engineers use to write readable, maintainable code." />
          </ChapterSection>

        </div>

        {/* Right sidebar */}
        <div style={{ position: 'sticky', top: '57px', height: 'fit-content', paddingTop: '40px', paddingLeft: '24px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--ed-ink3)', marginBottom: '12px', textTransform: 'uppercase' as const }}>
            Progress
          </div>
          <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', marginBottom: '12px' }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: meta.accentColor, fontFamily: "'JetBrains Mono', monospace" }}>{totalXP}</div>
            <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', marginTop: '2px' }}>XP earned</div>
          </div>
          <div style={{ padding: '14px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ed-ink)' }}>{completedSections.size} / {SECTIONS.length}</div>
            <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', marginTop: '2px' }}>Sections read</div>
          </div>

          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--ed-ink3)', marginBottom: '10px', textTransform: 'uppercase' as const }}>
            Key concepts
          </div>
          {[
            track === 'python' ? 'CPython interpreter' : track === 'java' ? 'JVM + bytecode' : 'V8 engine',
            track === 'python' ? 'Virtual environments' : track === 'java' ? 'JDK + Maven' : 'npm + package.json',
            track === 'python' ? 'Python ecosystem' : track === 'java' ? 'Spring ecosystem' : 'Event loop',
            'Debugging loop',
          ].map(concept => (
            <div key={concept} style={{ padding: '7px 10px', borderRadius: '6px', marginBottom: '4px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.4 }}>
              {concept}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

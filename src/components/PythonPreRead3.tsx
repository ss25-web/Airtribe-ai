'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useLearnerStore } from '@/lib/learnerStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterSection, para, h2, keyBox, ApplyItBox } from './pm-fundamentals/designSystem';
import SWEPreReadLayout from './SWEPreReadLayout';
import QuizEngine from './QuizEngine';
import { TracebackReaderLab, FileFormatChooser, DependencyRepairSim, ReproducibilityChecklist, PR3HeroArtifact } from './PythonPreRead3Tools';
import { PythonMentorFace } from './PythonMentorFace';

const ACCENT = '#16A34A';
const ACCENT_RGB = '22,163,74';
const MODULE_ID = 'python-pr-03';

const SECTIONS = [
  { id: 'pr3-file-io',       label: 'File I/O: Code Meets the Outside World', icon: '📂' },
  { id: 'pr3-exceptions',    label: 'Errors Are Part of the System',           icon: '⚠️' },
  { id: 'pr3-except-handle', label: 'Handling Exceptions Well',                icon: '🛡️' },
  { id: 'pr3-environments',  label: 'Virtual Environments',                    icon: '🔒' },
  { id: 'pr3-pip',           label: 'pip and Dependencies',                    icon: '📦' },
  { id: 'pr3-requirements',  label: 'requirements.txt: Making It Sharable',   icon: '📄' },
  { id: 'pr3-reflection',    label: 'Backend Engineering Is More Than Logic',  icon: '🌍' },
];

const TRACK_CONFIG = {
  name: 'Python', accent: ACCENT, accentRgb: ACCENT_RGB,
  protagonist: 'Arjun', role: 'Aspiring Backend Engineer', company: 'Learning Python',
  mentor: 'Nisha', mentorRole: 'Backend Mentor', mentorColor: '#0369A1',
};

const CodeBlock = ({ code, filename }: { code: string; filename?: string }) => (
  <div style={{ margin: '18px 0', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(134,239,172,0.15)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
    {filename && <div style={{ background: '#1e293b', padding: '7px 16px', fontSize: '10px', fontFamily: "'JetBrains Mono',monospace", color: '#64748b', letterSpacing: '0.08em', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{filename}</div>}
    <pre style={{ background: '#0f172a', color: '#86efac', fontFamily: "'JetBrains Mono',monospace", fontSize: '13px', lineHeight: 1.75, padding: '18px 22px', margin: 0, overflowX: 'auto' as const }}>
      <code>{code}</code>
    </pre>
  </div>
);

const SceneSetter = ({ title, story, mentorQuote, mentorName, mentorColor }: { title: string; story: string; mentorQuote: string; mentorName: string; mentorColor: string }) => (
  <div style={{ margin: '0 0 26px', padding: '18px 22px', background: `rgba(${ACCENT_RGB},0.05)`, borderLeft: `4px solid ${ACCENT}`, borderRadius: '0 10px 10px 0', border: `1px solid ${ACCENT}25`, borderLeftWidth: '4px' }}>
    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, marginBottom: '7px', textTransform: 'uppercase' as const }}>{title}</div>
    <div style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.75, marginBottom: '12px' }}>{story}</div>
    <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', padding: '9px 12px', borderRadius: '7px', background: `${mentorColor}10`, border: `1px solid ${mentorColor}30` }}>
      <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: `${mentorColor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', color: mentorColor, flexShrink: 0 }}>{mentorName[0]}</div>
      <div style={{ fontSize: '13px', color: 'var(--ed-ink)', fontStyle: 'italic', lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: mentorColor, fontStyle: 'normal' }}>{mentorName}: </span>&ldquo;{mentorQuote}&rdquo;
      </div>
    </div>
  </div>
);

const ConvoScene = ({ lines, mentorName, mentorColor }: { lines: { speaker: 'arjun' | 'mentor'; text: string }[]; mentorName: string; mentorColor: string }) => (
  <div style={{ margin: '22px 0', display: 'flex', flexDirection: 'column' as const, gap: '9px' }}>
    {lines.map((line, i) => {
      const isMentor = line.speaker === 'mentor';
      return (
        <div key={i} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', flexDirection: isMentor ? 'row-reverse' : 'row' as const }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: isMentor ? `${mentorColor}22` : `rgba(${ACCENT_RGB},0.18)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', color: isMentor ? mentorColor : ACCENT, flexShrink: 0 }}>{isMentor ? mentorName[0] : 'A'}</div>
          <div style={{ maxWidth: '80%' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: isMentor ? mentorColor : ACCENT, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.08em', marginBottom: '3px', textAlign: isMentor ? 'right' as const : 'left' as const }}>{isMentor ? mentorName.toUpperCase() : 'ARJUN'}</div>
            <div style={{ padding: '9px 13px', borderRadius: isMentor ? '12px 4px 12px 12px' : '4px 12px 12px 12px', background: isMentor ? `${mentorColor}10` : `rgba(${ACCENT_RGB},0.08)`, border: `1px solid ${isMentor ? mentorColor : ACCENT}22`, fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.65 }}>{line.text}</div>
          </div>
        </div>
      );
    })}
  </div>
);

const PythonPrinciple = ({ text }: { text: string }) => (
  <div style={{ margin: '26px 0', padding: '18px 22px', background: `rgba(${ACCENT_RGB},0.07)`, borderLeft: `4px solid ${ACCENT}`, borderRadius: '0 8px 8px 0' }}>
    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', color: ACCENT, marginBottom: '7px', textTransform: 'uppercase' as const }}>Python Principle</div>
    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ed-ink)', lineHeight: 1.65, fontStyle: 'italic', fontFamily: "'Lora',serif" }}>&ldquo;{text}&rdquo;</div>
  </div>
);

// ── SHARED TERMINAL SHELL ────────────────────────────────────────────────────
const Terminal = ({ title, lines, height = 180 }: { title: string; lines: { text: string; color?: string }[]; height?: number }) => (
  <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
    <div style={{ background: '#1e293b', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', gap: '5px' }}>
        {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />)}
      </div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#64748b', letterSpacing: '0.06em' }}>{title}</span>
    </div>
    <div style={{ background: '#0f172a', padding: '14px 16px', minHeight: height, fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', lineHeight: 1.75, overflowY: 'auto' as const }}>
      {lines.map((l, i) => (
        <div key={i} style={{ color: l.color ?? '#94a3b8', whiteSpace: 'pre' as const }}>{l.text || ' '}</div>
      ))}
    </div>
  </div>
);

// ── TOOL 1: EXCEPTION CODE EXECUTOR — live step-by-step execution ───────────
type HandlingStrategy = 'none' | 'broad' | 'specific' | 'finally';

const EXEC_DATA: Record<HandlingStrategy, {
  label: string; good: boolean;
  codeLines: { text: string; color?: string }[];
  execution: { line: number; output: { text: string; color: string }[] }[];
}> = {
  none: {
    label: 'No handling', good: false,
    codeLines: [
      { text: 'with open("orders.txt") as f:',   color: '#86efac' },
      { text: '    data = f.read()',              color: '#86efac' },
      { text: 'print(data)',                      color: '#86efac' },
    ],
    execution: [
      { line: 0, output: [{ text: '→ Attempting to open orders.txt...', color: '#94a3b8' }] },
      { line: 1, output: [{ text: '✗ FileNotFoundError: [Errno 2] No such file or directory: \'orders.txt\'', color: '#f87171' }, { text: 'Traceback (most recent call last):', color: '#f87171' }, { text: '  File "script.py", line 1, in <module>', color: '#f87171' }, { text: 'Process finished with exit code 1', color: '#94a3b8' }] },
    ],
  },
  broad: {
    label: 'Broad except', good: false,
    codeLines: [
      { text: 'try:',                              color: '#86efac' },
      { text: '    with open("orders.txt") as f:', color: '#86efac' },
      { text: '        data = f.read()',            color: '#86efac' },
      { text: 'except:',                           color: '#fbbf24' },
      { text: '    print("Something went wrong")',  color: '#fbbf24' },
    ],
    execution: [
      { line: 0, output: [{ text: '→ Entering try block...', color: '#94a3b8' }] },
      { line: 1, output: [{ text: '→ Attempting to open orders.txt...', color: '#94a3b8' }] },
      { line: 3, output: [{ text: '→ Error occurred — caught by broad except', color: '#fbbf24' }] },
      { line: 4, output: [{ text: 'Something went wrong', color: '#94a3b8' }, { text: '⚠ Real cause hidden. Could be any error — including bugs in your own code.', color: '#fbbf24' }] },
    ],
  },
  specific: {
    label: 'Specific except', good: true,
    codeLines: [
      { text: 'try:',                                  color: '#86efac' },
      { text: '    with open("orders.txt") as f:',     color: '#86efac' },
      { text: '        data = f.read()',                color: '#86efac' },
      { text: 'except FileNotFoundError:',             color: '#4ade80' },
      { text: '    print("File not found — check path.")', color: '#4ade80' },
    ],
    execution: [
      { line: 0, output: [{ text: '→ Entering try block...', color: '#94a3b8' }] },
      { line: 1, output: [{ text: '→ Attempting to open orders.txt...', color: '#94a3b8' }] },
      { line: 3, output: [{ text: '→ FileNotFoundError caught specifically', color: '#4ade80' }] },
      { line: 4, output: [{ text: 'File not found — check path.', color: '#4ade80' }, { text: '✓ Exact error handled. All other errors still surface.', color: '#4ade80' }] },
    ],
  },
  finally: {
    label: 'With finally', good: true,
    codeLines: [
      { text: 'try:',                                  color: '#86efac' },
      { text: '    with open("orders.txt") as f:',     color: '#86efac' },
      { text: '        data = f.read()',                color: '#86efac' },
      { text: 'except FileNotFoundError:',             color: '#4ade80' },
      { text: '    print("File not found.")',           color: '#4ade80' },
      { text: 'finally:',                              color: '#60a5fa' },
      { text: '    print("Cleanup — always runs.")',    color: '#60a5fa' },
    ],
    execution: [
      { line: 0, output: [{ text: '→ Entering try block...', color: '#94a3b8' }] },
      { line: 1, output: [{ text: '→ Attempting to open orders.txt...', color: '#94a3b8' }] },
      { line: 3, output: [{ text: '→ FileNotFoundError caught', color: '#4ade80' }] },
      { line: 4, output: [{ text: 'File not found.', color: '#4ade80' }] },
      { line: 5, output: [{ text: '→ finally block — always executes', color: '#60a5fa' }] },
      { line: 6, output: [{ text: 'Cleanup — always runs.', color: '#60a5fa' }, { text: '✓ Cleanup guaranteed regardless of success or failure.', color: '#4ade80' }] },
    ],
  },
};

function ExceptionFlowLab() {
  const [strategy, setStrategy] = useState<HandlingStrategy>('none');
  const [execStep, setExecStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [outputLines, setOutputLines] = useState<{ text: string; color: string }[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const d = EXEC_DATA[strategy];

  const run = () => {
    setRunning(true);
    setExecStep(0);
    setOutputLines([{ text: '$ python script.py', color: '#64748b' }]);
  };

  useEffect(() => {
    if (!running) return;
    const steps = d.execution;
    if (execStep < steps.length) {
      timerRef.current = setTimeout(() => {
        const step = steps[execStep];
        setOutputLines(prev => [...prev, ...step.output]);
        setExecStep(s => s + 1);
      }, 900);
    } else {
      setRunning(false);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [running, execStep, d]);

  const reset = () => { setExecStep(-1); setRunning(false); setOutputLines([]); };
  const activeCodeLine = running && execStep < d.execution.length ? d.execution[execStep]?.line ?? -1 : -1;

  return (
    <div style={{ background: 'var(--ed-card)', borderRadius: '16px', border: `1.5px solid ${ACCENT}35`, overflow: 'hidden', margin: '28px 0', boxShadow: '0 6px 24px rgba(0,0,0,0.12)' }}>
      <div style={{ padding: '14px 20px', background: `linear-gradient(135deg, ${ACCENT}22 0%, ${ACCENT}10 100%)`, borderBottom: `1px solid ${ACCENT}25`, display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: `${ACCENT}28`, fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💻</div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, textTransform: 'uppercase' as const }}>Exception Code Executor</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>Choose a handling strategy. Run the script. Watch execution step through the code live.</div>
        </div>
      </div>
      <div style={{ padding: '20px 24px', background: `linear-gradient(160deg, rgba(${ACCENT_RGB},0.04) 0%, rgba(${ACCENT_RGB},0.02) 100%)` }}>
        {/* Strategy selector */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
          {(Object.keys(EXEC_DATA) as HandlingStrategy[]).map(key => {
            const item = EXEC_DATA[key];
            return (
              <motion.button key={key} whileHover={{ y: -1 }} onClick={() => { setStrategy(key); reset(); }}
                style={{ flex: 1, padding: '8px 6px', borderRadius: '8px', border: `2px solid ${strategy === key ? (item.good ? ACCENT : '#dc2626') : 'var(--ed-rule)'}`, background: strategy === key ? (item.good ? `rgba(${ACCENT_RGB},0.12)` : 'rgba(220,38,38,0.1)') : 'var(--ed-card)', color: strategy === key ? (item.good ? ACCENT : '#dc2626') : 'var(--ed-ink3)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '3px' }}>
                <span>{item.good ? '✓' : '⚠'}</span>
                <span style={{ fontSize: '10px' }}>{item.label}</span>
              </motion.button>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          {/* Code editor */}
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.08em', marginBottom: '6px' }}>script.py</div>
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
              <div style={{ background: '#1e293b', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />)}
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#64748b' }}>script.py</span>
              </div>
              <div style={{ background: '#0f172a', padding: '14px 0' }}>
                {d.codeLines.map((line, i) => {
                  const isActive = activeCodeLine === i;
                  return (
                    <motion.div key={`${strategy}-${i}`} animate={{ background: isActive ? 'rgba(96,165,250,0.12)' : 'transparent' }}
                      style={{ display: 'flex', alignItems: 'center', paddingLeft: '0', transition: 'background 0.3s' }}>
                      <span style={{ width: '32px', textAlign: 'right' as const, paddingRight: '12px', fontSize: '10px', color: '#374151', fontFamily: "'JetBrains Mono',monospace", flexShrink: 0, userSelect: 'none' as const }}>{i + 1}</span>
                      {isActive && <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.6, repeat: Infinity }} style={{ width: '3px', height: '14px', background: '#60a5fa', borderRadius: '1px', marginRight: '6px', flexShrink: 0 }} />}
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: line.color ?? '#86efac', paddingRight: '16px', whiteSpace: 'pre' as const }}>{line.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Terminal output */}
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.08em', marginBottom: '6px' }}>Terminal Output</div>
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
              <div style={{ background: '#1e293b', padding: '7px 14px', display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />)}
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#64748b' }}>bash</span>
                {running && <motion.div animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: '#28C840' }} />}
              </div>
              <div style={{ background: '#0a0f1e', padding: '14px 16px', minHeight: '160px', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', lineHeight: 1.8 }}>
                {outputLines.length === 0 ? (
                  <span style={{ color: '#374151' }}>Click Run to execute the script...</span>
                ) : (
                  outputLines.map((l, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
                      style={{ color: l.color, whiteSpace: 'pre-wrap' as const }}>{l.text}</motion.div>
                  ))
                )}
                {running && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ color: ACCENT }}>▋</motion.span>}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <motion.button whileHover={{ scale: 1.02 }} onClick={run} disabled={running}
            style={{ padding: '10px 22px', borderRadius: '8px', background: running ? '#1e293b' : ACCENT, color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: running ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {running ? '⏳ Running...' : '▶  Run script.py'}
          </motion.button>
          {outputLines.length > 0 && !running && (
            <button onClick={reset} style={{ padding: '10px 16px', borderRadius: '8px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', color: 'var(--ed-ink3)', fontSize: '12px', cursor: 'pointer' }}>↺ Reset</button>
          )}
          {!EXEC_DATA[strategy].good && outputLines.length > 0 && !running && (
            <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#E67E22', fontWeight: 600 }}>⚠ Try &ldquo;Specific except&rdquo; or &ldquo;With finally&rdquo;</div>
          )}
          {EXEC_DATA[strategy].good && outputLines.length > 0 && !running && (
            <div style={{ marginLeft: 'auto', fontSize: '11px', color: ACCENT, fontWeight: 600 }}>✓ This is good exception handling</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ANIMATION 1: EXCEPTION PATHWAYS ─────────────────────────────────────────
type ExPath = 'none' | 'broad' | 'specific' | 'finally';

const PATH_META: Record<ExPath, { label: string; color: string; emoji: string; steps: string[]; desc: string }> = {
  none:     { label: 'No handling',     color: '#dc2626', emoji: '💥', steps: ['risky code', 'CRASH ✗'], desc: 'Unhandled exception. Traceback printed. Execution stops completely.' },
  broad:    { label: 'Broad except',    color: '#E67E22', emoji: '⚠️', steps: ['risky code', 'fails', 'except: (vague)', 'continues ⚠'], desc: "Script continues — but the real cause is hidden. Debugging becomes much harder." },
  specific: { label: 'Specific except', color: ACCENT,    emoji: '✓',  steps: ['risky code', 'fails', 'except FileNotFoundError', 'clear message ✓'], desc: 'Only the expected error is caught. Clear, targeted. Everything else still surfaces.' },
  finally:  { label: 'With finally',    color: ACCENT,    emoji: '✓',  steps: ['risky code', 'fails', 'except — handled ✓', 'finally: cleanup ✓'], desc: 'Specific handling + cleanup that always runs, whether success or failure.' },
};

function ExceptionPathwaysAnimation() {
  const [active, setActive] = useState<ExPath>('none');
  const paths: ExPath[] = ['none', 'broad', 'specific', 'finally'];
  const d = PATH_META[active];

  useEffect(() => {
    const t = setInterval(() => setActive(a => paths[(paths.indexOf(a) + 1) % paths.length]), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: 'var(--ed-card)', borderRadius: '16px', border: `1.5px solid ${d.color}35`, overflow: 'hidden', margin: '28px 0', boxShadow: `0 6px 24px ${d.color}18`, transition: 'border-color 0.4s, box-shadow 0.4s' }}>
      <div style={{ padding: '12px 20px', background: `linear-gradient(135deg, ${d.color}20 0%, ${d.color}0C 100%)`, borderBottom: `1px solid ${d.color}25`, display: 'flex', gap: '10px', alignItems: 'center', transition: 'background 0.4s' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: `${d.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🔀</div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: d.color, textTransform: 'uppercase' as const }}>Exception Pathways · {d.label}</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '1px' }}>Click any path or wait — auto-cycles through all four approaches.</div>
        </div>
      </div>
      <div style={{ padding: '20px 24px', background: `linear-gradient(160deg, rgba(${ACCENT_RGB},0.04) 0%, rgba(${ACCENT_RGB},0.02) 100%)` }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '18px' }}>
          {paths.map(p => (
            <motion.button key={p} whileHover={{ y: -1 }} onClick={() => setActive(p)}
              style={{ flex: 1, padding: '7px 5px', borderRadius: '7px', border: `2px solid ${active === p ? PATH_META[p].color : 'var(--ed-rule)'}`, background: active === p ? `${PATH_META[p].color}15` : 'var(--ed-card)', color: active === p ? PATH_META[p].color : 'var(--ed-ink3)', fontSize: '10px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
              {PATH_META[p].emoji} {PATH_META[p].label}
            </motion.button>
          ))}
        </div>

        {/* Pipeline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const, marginBottom: '16px' }}>
          <div style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(58,134,255,0.12)', border: '1.5px solid rgba(58,134,255,0.4)', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', fontWeight: 700, color: '#3A86FF', whiteSpace: 'nowrap' as const }}>try:</div>
          {d.steps.map((step, i) => (
            <React.Fragment key={i}>
              <motion.div key={`arrow-${active}-${i}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: i * 0.15, duration: 0.3 }}
                style={{ width: '16px', height: '2px', background: d.color, borderRadius: '1px', flexShrink: 0, transformOrigin: 'left' }} />
              <motion.div key={`step-${active}-${i}`} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15 + 0.1 }}
                style={{ padding: '7px 11px', borderRadius: '7px', background: `${d.color}14`, border: `1.5px solid ${d.color}50`, fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', fontWeight: 700, color: d.color, whiteSpace: 'nowrap' as const }}>
                {step}
              </motion.div>
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ padding: '10px 14px', borderRadius: '8px', background: d.color === ACCENT ? `rgba(${ACCENT_RGB},0.07)` : `${d.color}10`, border: `1px solid ${d.color}30`, fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.65 }}>
            {d.desc}
          </motion.div>
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '14px' }}>
          {paths.map(p => <div key={p} onClick={() => setActive(p)} style={{ width: active === p ? '24px' : '8px', height: '8px', borderRadius: '4px', background: active === p ? d.color : 'var(--ed-rule)', cursor: 'pointer', transition: 'all 0.3s' }} />)}
        </div>
      </div>
    </div>
  );
}

// ── TOOL 2: PACKAGE MANAGER SIMULATOR ───────────────────────────────────────
const PROJ_DATA = [
  { name: 'project-a', needs: { name: 'requests', version: '2.28' }, color: '#3A86FF' },
  { name: 'project-b', needs: { name: 'requests', version: '2.31' }, color: '#7843EE' },
  { name: 'project-c', needs: { name: 'flask',    version: '2.0'  }, color: '#E67E22' },
];
const AVAILABLE_PKGS = [
  { name: 'requests', version: '2.31', emoji: '📡' },
  { name: 'flask',    version: '2.0',  emoji: '🌶️' },
  { name: 'numpy',    version: '1.24', emoji: '🔢' },
];

function EnvironmentIsolationLab() {
  const [mode, setMode] = useState<'global' | 'isolated'>('global');
  const [globalPkgs, setGlobalPkgs] = useState<string[]>([]);
  const [isolated, setIsolated] = useState<Record<string, string[]>>({});
  const [cmdOutput, setCmdOutput] = useState<{ text: string; color: string }[]>([{ text: '$ ', color: '#64748b' }]);
  const [selectedProj, setSelectedProj] = useState<string | null>(null);

  const installGlobal = (pkgName: string) => {
    if (globalPkgs.includes(pkgName)) return;
    const pkg = AVAILABLE_PKGS.find(p => p.name === pkgName)!;
    setCmdOutput(prev => [
      ...prev,
      { text: `pip install ${pkgName}`, color: '#94a3b8' },
      { text: `Collecting ${pkgName}==${pkg.version}...`, color: '#60a5fa' },
      { text: `Successfully installed ${pkgName}-${pkg.version}`, color: '#4ade80' },
      { text: '$ ', color: '#64748b' },
    ]);
    setGlobalPkgs(prev => [...prev, pkgName]);
  };

  const installIsolated = (proj: string, pkgName: string) => {
    const pkg = AVAILABLE_PKGS.find(p => p.name === pkgName)!;
    setCmdOutput(prev => [
      ...prev,
      { text: `(${proj}) pip install ${pkgName}`, color: '#94a3b8' },
      { text: `Installing into ${proj}/venv...`, color: '#60a5fa' },
      { text: `Successfully installed ${pkgName}-${pkg.version}`, color: '#4ade80' },
      { text: '$ ', color: '#64748b' },
    ]);
    setIsolated(prev => ({ ...prev, [proj]: [...(prev[proj] ?? []), pkgName] }));
  };

  const resetAll = () => { setGlobalPkgs([]); setIsolated({}); setCmdOutput([{ text: '$ ', color: '#64748b' }]); setSelectedProj(null); };

  const conflicts = mode === 'global' && globalPkgs.includes('requests')
    ? PROJ_DATA.filter(p => p.needs.name === 'requests')
    : [];

  return (
    <div style={{ background: 'var(--ed-card)', borderRadius: '16px', border: `1.5px solid ${ACCENT}35`, overflow: 'hidden', margin: '28px 0', boxShadow: '0 6px 24px rgba(0,0,0,0.12)' }}>
      <div style={{ padding: '14px 20px', background: `linear-gradient(135deg, ${ACCENT}22 0%, ${ACCENT}10 100%)`, borderBottom: `1px solid ${ACCENT}25`, display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: `${ACCENT}28`, fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, textTransform: 'uppercase' as const }}>Package Manager Simulator</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>Install packages globally or into isolated environments. See conflicts happen — then fix them.</div>
        </div>
        <button onClick={resetAll} style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', border: '1px solid var(--ed-rule)', background: 'var(--ed-card)', color: 'var(--ed-ink3)' }}>↺ Reset</button>
      </div>
      <div style={{ padding: '20px 24px', background: `linear-gradient(160deg, rgba(${ACCENT_RGB},0.04) 0%, rgba(${ACCENT_RGB},0.02) 100%)` }}>
        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '16px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--ed-rule)' }}>
          {(['global', 'isolated'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); resetAll(); }}
              style={{ flex: 1, padding: '10px', border: 'none', cursor: 'pointer', background: mode === m ? (m === 'global' ? '#dc2626' : ACCENT) : 'var(--ed-card)', color: mode === m ? '#fff' : 'var(--ed-ink3)', fontWeight: mode === m ? 700 : 400, fontSize: '12px', borderRight: m === 'global' ? '1px solid var(--ed-rule)' : 'none', transition: 'all 0.2s' }}>
              {m === 'global' ? '🌐 Global environment' : '📦 Virtual environments (venv)'}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {/* Left: projects + install controls */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
            {mode === 'global' && (
              <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(220,38,38,0.08)', border: '1.5px solid rgba(220,38,38,0.3)' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: '#dc2626', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.1em', marginBottom: '8px' }}>🌐 GLOBAL PYTHON ENVIRONMENT</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px', marginBottom: '8px' }}>
                  {globalPkgs.length === 0 ? <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>Nothing installed yet</span> : globalPkgs.map(p => {
                    const pkg = AVAILABLE_PKGS.find(x => x.name === p)!;
                    return <span key={p} style={{ padding: '3px 9px', borderRadius: '5px', fontSize: '11px', fontFamily: "'JetBrains Mono',monospace", background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.35)', color: '#f87171' }}>{pkg.emoji} {p}=={pkg.version}</span>;
                  })}
                </div>
                <div style={{ fontSize: '9px', fontWeight: 700, color: '#dc2626', fontFamily: "'JetBrains Mono',monospace", marginBottom: '5px' }}>pip install →</div>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' as const }}>
                  {AVAILABLE_PKGS.map(pkg => (
                    <motion.button key={pkg.name} whileHover={{ y: -1 }} onClick={() => installGlobal(pkg.name)} disabled={globalPkgs.includes(pkg.name)}
                      style={{ padding: '4px 10px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, cursor: globalPkgs.includes(pkg.name) ? 'default' : 'pointer', fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${globalPkgs.includes(pkg.name) ? 'var(--ed-rule)' : 'rgba(220,38,38,0.4)'}`, background: globalPkgs.includes(pkg.name) ? 'var(--ed-card)' : 'rgba(220,38,38,0.08)', color: globalPkgs.includes(pkg.name) ? 'var(--ed-ink3)' : '#f87171', opacity: globalPkgs.includes(pkg.name) ? 0.5 : 1 }}>
                      {globalPkgs.includes(pkg.name) ? '✓' : '+'} {pkg.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Project containers */}
            {PROJ_DATA.map(proj => {
              const isConflict = conflicts.some(c => c.name === proj.name);
              const projPkgs = isolated[proj.name] ?? [];
              const needsMet = mode === 'isolated' ? projPkgs.includes(proj.needs.name) : globalPkgs.includes(proj.needs.name);
              const hasConflictHere = mode === 'global' && isConflict;

              return (
                <motion.div key={proj.name} animate={{ borderColor: hasConflictHere ? '#dc2626' : needsMet && !hasConflictHere ? `${ACCENT}60` : `${proj.color}30` }}
                  onClick={() => mode === 'isolated' && setSelectedProj(selectedProj === proj.name ? null : proj.name)}
                  style={{ padding: '12px 14px', borderRadius: '10px', border: '1.5px solid', background: hasConflictHere ? 'rgba(220,38,38,0.06)' : needsMet && !hasConflictHere ? `rgba(${ACCENT_RGB},0.06)` : 'var(--ed-card)', cursor: mode === 'isolated' ? 'pointer' : 'default', transition: 'all 0.3s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', fontWeight: 700, color: proj.color }}>{proj.name}/</code>
                    {mode === 'isolated' && <span style={{ fontSize: '9px', fontFamily: "'JetBrains Mono',monospace", color: ACCENT, padding: '1px 6px', borderRadius: '4px', background: `rgba(${ACCENT_RGB},0.1)` }}>venv/</span>}
                    {hasConflictHere && <span style={{ fontSize: '10px', color: '#dc2626', fontWeight: 700, marginLeft: 'auto' }}>⚠ conflict</span>}
                    {needsMet && !hasConflictHere && <span style={{ fontSize: '10px', color: ACCENT, fontWeight: 700, marginLeft: 'auto' }}>✓ ready</span>}
                  </div>
                  <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>needs: {proj.needs.name}=={proj.needs.version}</code>
                  {mode === 'isolated' && projPkgs.length > 0 && (
                    <div style={{ marginTop: '5px', display: 'flex', gap: '4px', flexWrap: 'wrap' as const }}>
                      {projPkgs.map(p => { const pkg = AVAILABLE_PKGS.find(x => x.name === p)!; return <span key={p} style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '10px', fontFamily: "'JetBrains Mono',monospace", background: `rgba(${ACCENT_RGB},0.1)`, color: ACCENT }}>{pkg.emoji} {p}=={pkg.version}</span>; })}
                    </div>
                  )}
                  {mode === 'isolated' && selectedProj === proj.name && !projPkgs.includes(proj.needs.name) && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden', marginTop: '8px', display: 'flex', gap: '5px', flexWrap: 'wrap' as const }}>
                      {AVAILABLE_PKGS.map(pkg => (
                        <motion.button key={pkg.name} whileHover={{ y: -1 }} onClick={e => { e.stopPropagation(); installIsolated(proj.name, pkg.name); }}
                          disabled={projPkgs.includes(pkg.name)}
                          style={{ padding: '3px 9px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", border: `1px solid ${ACCENT}40`, background: `rgba(${ACCENT_RGB},0.08)`, color: ACCENT, opacity: projPkgs.includes(pkg.name) ? 0.4 : 1 }}>
                          {projPkgs.includes(pkg.name) ? '✓' : '+'} pip install {pkg.name}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}

            {conflicts.length >= 2 && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.35)', fontSize: '12px', color: '#f87171', fontWeight: 600, lineHeight: 1.6 }}>
                ⚠ project-a needs requests==2.28 but project-b needs requests==2.31. Global env can only hold one — one project will get the wrong version.
              </motion.div>
            )}
          </div>

          {/* Right: terminal */}
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.08em', marginBottom: '6px' }}>Terminal</div>
            <Terminal title="bash" lines={cmdOutput} height={220} />
            {mode === 'isolated' && !selectedProj && (
              <div style={{ marginTop: '8px', padding: '8px 12px', borderRadius: '7px', background: `rgba(${ACCENT_RGB},0.06)`, border: `1px solid ${ACCENT}20`, fontSize: '11px', color: 'var(--ed-ink3)' }}>
                Click a project container to install packages into its isolated environment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ANIMATION 2: PACKAGE INSTALLATION FLOW ───────────────────────────────────
function PackageInstallationFlow() {
  const [phase, setPhase] = useState(0);
  const phases = [
    { label: 'Clean environment',     color: '#64748b', desc: 'No external packages yet. Only stdlib available.' },
    { label: 'pip install requests',  color: '#3A86FF', desc: 'requests downloads and enters the environment.' },
    { label: 'Machine A: works ✓',   color: ACCENT,    desc: 'import requests succeeds. Code runs.' },
    { label: 'Machine B: fails ✗',   color: '#dc2626', desc: 'requests not installed. ModuleNotFoundError.' },
  ];
  const cur = phases[phase];

  useEffect(() => {
    const t = setInterval(() => setPhase(p => (p + 1) % phases.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: 'var(--ed-card)', borderRadius: '16px', border: `1.5px solid ${cur.color}35`, overflow: 'hidden', margin: '28px 0', boxShadow: `0 6px 24px ${cur.color}18`, transition: 'all 0.4s' }}>
      <div style={{ padding: '12px 20px', background: `linear-gradient(135deg, ${cur.color}20 0%, ${cur.color}0C 100%)`, borderBottom: `1px solid ${cur.color}25`, display: 'flex', gap: '10px', alignItems: 'center', transition: 'background 0.4s' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: `${cur.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📦</div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: cur.color, textTransform: 'uppercase' as const }}>Package Installation Flow</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '1px' }}>Watch how pip changes the project — and what happens without it on another machine.</div>
        </div>
      </div>
      <div style={{ padding: '20px 24px', background: `linear-gradient(160deg, rgba(${ACCENT_RGB},0.04) 0%, rgba(${ACCENT_RGB},0.02) 100%)` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
          {/* Environment box */}
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.08em', marginBottom: '8px' }}>PYTHON ENVIRONMENT (venv/)</div>
            <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', minHeight: '80px', position: 'relative' as const }}>
              <AnimatePresence>
                {phase >= 1 && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 12px', borderRadius: '7px', background: 'rgba(58,134,255,0.12)', border: '1.5px solid rgba(58,134,255,0.4)' }}>
                    <span style={{ fontSize: '14px' }}>📦</span>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', fontWeight: 700, color: '#3A86FF' }}>requests</div>
                      <div style={{ fontSize: '9px', color: 'var(--ed-ink3)' }}>installed ✓</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {phase === 0 && <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', fontStyle: 'italic' }}>Empty — no packages yet</div>}
            </div>
          </div>
          {/* Two machines */}
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
            <motion.div animate={{ background: phase >= 2 ? `rgba(${ACCENT_RGB},0.1)` : 'var(--ed-card)', borderColor: phase >= 2 ? `${ACCENT}50` : 'rgba(226,232,240,1)' }}
              style={{ padding: '10px 12px', borderRadius: '8px', border: '1.5px solid', transition: 'all 0.5s' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: phase >= 2 ? ACCENT : 'var(--ed-ink3)' }}>💻 Machine A</div>
              <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: phase >= 2 ? ACCENT : '#64748b' }}>{phase >= 2 ? 'import requests  # ✓ works' : 'import requests  # ...'}</code>
            </motion.div>
            <motion.div animate={{ background: phase >= 3 ? 'rgba(220,38,38,0.08)' : 'var(--ed-card)', borderColor: phase >= 3 ? 'rgba(220,38,38,0.4)' : 'rgba(226,232,240,1)' }}
              style={{ padding: '10px 12px', borderRadius: '8px', border: '1.5px solid', transition: 'all 0.5s' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: phase >= 3 ? '#dc2626' : 'var(--ed-ink3)' }}>💻 Machine B (no pip install)</div>
              <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: phase >= 3 ? '#dc2626' : '#64748b' }}>{phase >= 3 ? 'ModuleNotFoundError  # ✗' : 'import requests  # ...'}</code>
            </motion.div>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={phase} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: '10px 14px', borderRadius: '8px', background: `${cur.color}10`, border: `1px solid ${cur.color}30`, fontSize: '12px', color: cur.color, lineHeight: 1.6, fontWeight: 600 }}>
            {cur.label} — {cur.desc}
          </motion.div>
        </AnimatePresence>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '14px' }}>
          {phases.map((_, i) => <div key={i} onClick={() => setPhase(i)} style={{ width: phase === i ? '24px' : '8px', height: '8px', borderRadius: '4px', background: phase === i ? cur.color : 'var(--ed-rule)', cursor: 'pointer', transition: 'all 0.3s' }} />)}
        </div>
      </div>
    </div>
  );
}

// ── TOOL 3: TWO-MACHINE TERMINAL WORKSPACE ───────────────────────────────────
const MACHINE_A_HISTORY = [
  { text: '(venv) $ pip install requests flask pydantic', color: '#94a3b8' },
  { text: 'Successfully installed requests-2.31.0 flask-3.0.0 pydantic-2.0.0', color: '#4ade80' },
  { text: '(venv) $ python app.py', color: '#94a3b8' },
  { text: 'Server running at http://localhost:8000', color: '#4ade80' },
];

type ReproPhase = 0 | 1 | 2 | 3 | 4;

const REPRO_PHASES: { btnLabel: string; machineAExtra: { text: string; color: string }[]; machineBLines: { text: string; color: string }[]; insight: string; insightColor: string }[] = [
  {
    btnLabel: 'Try running on Machine B →',
    machineAExtra: [],
    machineBLines: [
      { text: '$ git clone repo && cd project', color: '#94a3b8' },
      { text: "Cloning into 'project'...", color: '#60a5fa' },
      { text: '$ python app.py', color: '#94a3b8' },
      { text: "ModuleNotFoundError: No module named 'requests'", color: '#f87171' },
      { text: 'Error: Missing dependencies. Which ones? What versions?', color: '#f87171' },
    ],
    insight: 'Machine B has the code but not the dependencies. There is no record of what to install.',
    insightColor: '#f87171',
  },
  {
    btnLabel: 'Guess the dependencies →',
    machineAExtra: [],
    machineBLines: [
      { text: '$ pip install requests', color: '#94a3b8' },
      { text: 'Installed requests-2.31.0', color: '#4ade80' },
      { text: '$ python app.py', color: '#94a3b8' },
      { text: "ModuleNotFoundError: No module named 'flask'", color: '#f87171' },
      { text: '$ pip install flask', color: '#94a3b8' },
      { text: 'Installed flask-3.0.0', color: '#4ade80' },
      { text: '$ python app.py', color: '#94a3b8' },
      { text: "ModuleNotFoundError: No module named 'pydantic'", color: '#f87171' },
      { text: 'Still guessing...', color: '#fbbf24' },
    ],
    insight: 'Guessing dependencies one error at a time. Slow, error-prone, and version mismatches are likely.',
    insightColor: '#fbbf24',
  },
  {
    btnLabel: 'Generate requirements.txt →',
    machineAExtra: [
      { text: '(venv) $ pip freeze > requirements.txt', color: '#94a3b8' },
      { text: '📄 requirements.txt created', color: '#60a5fa' },
      { text: 'requests==2.31.0', color: '#60a5fa' },
      { text: 'flask==3.0.0', color: '#60a5fa' },
      { text: 'pydantic==2.0.0', color: '#60a5fa' },
    ],
    machineBLines: [],
    insight: 'pip freeze captures every package and its exact version. Machine A now has a reproducibility contract.',
    insightColor: '#60a5fa',
  },
  {
    btnLabel: 'Install on Machine B with requirements.txt →',
    machineAExtra: [
      { text: '(venv) $ pip freeze > requirements.txt', color: '#94a3b8' },
      { text: '📄 requirements.txt → pushed to repo', color: '#4ade80' },
    ],
    machineBLines: [
      { text: '$ git pull  # requirements.txt now in repo', color: '#94a3b8' },
      { text: '$ python -m venv venv && source venv/bin/activate', color: '#94a3b8' },
      { text: '$ pip install -r requirements.txt', color: '#94a3b8' },
      { text: 'Collecting requests==2.31.0...', color: '#60a5fa' },
      { text: 'Collecting flask==3.0.0...', color: '#60a5fa' },
      { text: 'Collecting pydantic==2.0.0...', color: '#60a5fa' },
      { text: 'Successfully installed all packages ✓', color: '#4ade80' },
      { text: '$ python app.py', color: '#94a3b8' },
      { text: 'Server running at http://localhost:8000 ✓', color: '#4ade80' },
    ],
    insight: '✓ Exact same environment. requirements.txt turned a local setup into a reproducible contract.',
    insightColor: ACCENT,
  },
];

function ReproducibilityWorkspace() {
  const [phase, setPhase] = useState<ReproPhase>(0);
  const [running, setRunning] = useState(false);
  const [visibleBLines, setVisibleBLines] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cur = REPRO_PHASES[phase];

  const advance = () => {
    if (phase >= REPRO_PHASES.length - 1) return;
    const nextPhase = (phase + 1) as ReproPhase;
    setPhase(nextPhase);
    setRunning(true);
    setVisibleBLines(0);
  };

  useEffect(() => {
    if (!running) return;
    const target = REPRO_PHASES[phase].machineBLines.length;
    if (visibleBLines < target) {
      timerRef.current = setTimeout(() => setVisibleBLines(v => v + 1), 500);
    } else {
      setRunning(false);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [running, visibleBLines, phase]);

  const machineALines: { text: string; color: string }[] = [
    ...MACHINE_A_HISTORY,
    ...cur.machineAExtra,
  ];

  return (
    <div style={{ background: 'var(--ed-card)', borderRadius: '16px', border: `1.5px solid ${ACCENT}35`, overflow: 'hidden', margin: '28px 0', boxShadow: '0 6px 24px rgba(0,0,0,0.12)' }}>
      <div style={{ padding: '14px 20px', background: `linear-gradient(135deg, ${ACCENT}22 0%, ${ACCENT}10 100%)`, borderBottom: `1px solid ${ACCENT}25`, display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: `${ACCENT}28`, fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🖥️</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: ACCENT, textTransform: 'uppercase' as const }}>Two-Machine Workspace</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '2px' }}>Share a Python project — watch what breaks without requirements.txt, then fix it.</div>
        </div>
        <button onClick={() => { setPhase(0); setVisibleBLines(0); setRunning(false); }} style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', border: '1px solid var(--ed-rule)', background: 'var(--ed-card)', color: 'var(--ed-ink3)' }}>↺ Restart</button>
      </div>
      <div style={{ padding: '20px 24px', background: `linear-gradient(160deg, rgba(${ACCENT_RGB},0.04) 0%, rgba(${ACCENT_RGB},0.02) 100%)` }}>
        {/* Progress steps */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
          {['No req', 'Guess', 'Capture', 'Transfer'].map((lbl, i) => (
            <div key={lbl} style={{ flex: 1, padding: '5px', borderRadius: '6px', background: i <= phase ? (i < 2 ? 'rgba(220,38,38,0.12)' : `rgba(${ACCENT_RGB},0.12)`) : 'var(--ed-card)', border: `1px solid ${i <= phase ? (i < 2 ? 'rgba(220,38,38,0.4)' : `${ACCENT}40`) : 'var(--ed-rule)'}`, textAlign: 'center' as const }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: i <= phase ? (i < 2 ? '#dc2626' : ACCENT) : 'var(--ed-ink3)', fontFamily: "'JetBrains Mono',monospace" }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Two terminals */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.08em', marginBottom: '6px' }}>💻 Arjun&apos;s Machine</div>
            <Terminal title="arjun@macbook: ~/project" lines={machineALines} height={200} />
          </div>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: phase >= 3 ? ACCENT : '#dc2626', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.08em', marginBottom: '6px' }}>
              💻 Another Engineer&apos;s Machine {phase === 0 && '— clone + run'}
            </div>
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${phase >= 3 ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`, boxShadow: '0 8px 32px rgba(0,0,0,0.35)', transition: 'border-color 0.4s' }}>
              <div style={{ background: '#1e293b', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />)}
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#64748b' }}>engineer@laptop: ~/project</span>
                {running && <motion.div animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: '#28C840' }} />}
              </div>
              <div style={{ background: '#0a0f1e', padding: '14px 16px', minHeight: '200px', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', lineHeight: 1.8 }}>
                {cur.machineBLines.slice(0, visibleBLines).map((l, i) => (
                  <motion.div key={`${phase}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: l.color, whiteSpace: 'pre-wrap' as const }}>{l.text}</motion.div>
                ))}
                {running && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ color: ACCENT }}>▋</motion.span>}
                {cur.machineBLines.length === 0 && phase === 2 && (
                  <span style={{ color: '#374151', fontStyle: 'italic' }}>requirements.txt received — ready to install...</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Insight + advance button */}
        <AnimatePresence mode="wait">
          <motion.div key={phase} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: '10px 14px', borderRadius: '8px', background: `${cur.insightColor}10`, border: `1px solid ${cur.insightColor}35`, fontSize: '12px', color: cur.insightColor, lineHeight: 1.65, marginBottom: '12px', fontWeight: 600 }}>
            {cur.insight}
          </motion.div>
        </AnimatePresence>

        {phase < REPRO_PHASES.length - 1 && (
          <motion.button whileHover={{ scale: 1.02 }} onClick={advance} disabled={running}
            style={{ padding: '10px 22px', borderRadius: '8px', background: running ? '#1e293b' : ACCENT, color: '#fff', fontSize: '12px', fontWeight: 700, border: 'none', cursor: running ? 'default' : 'pointer' }}>
            {running ? '⏳ Running...' : cur.btnLabel}
          </motion.button>
        )}
        {phase === REPRO_PHASES.length - 1 && (
          <div style={{ fontSize: '12px', color: ACCENT, fontWeight: 700 }}>
            🎯 Both machines now have identical environments. requirements.txt is the reproducibility contract.
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
interface Props { onBack: () => void; }

export default function PythonPreRead3({ onBack }: Props) {
  const store = useLearnerStore();
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set(['pr3-file-io']));

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { const id = e.target.getAttribute("data-section"); if (id) { setActiveSection(id); setCompletedModules(prev => new Set([...prev, id])); store.markSectionCompleted(MODULE_ID, id); } } });
    }, { threshold: 0.05, rootMargin: '0px 0px -20% 0px' });
    const tid = setTimeout(() => { document.querySelectorAll('[data-section]').forEach(el => obs.observe(el)); }, 150);
    return () => { clearTimeout(tid); obs.disconnect(); };
  }, []);

  return (
    <SWEPreReadLayout trackConfig={TRACK_CONFIG} moduleLabel="PYTHON PRE-READ 03" title="Python in the Real World" sections={SECTIONS} completedModules={completedModules} activeSection={activeSection} onBack={onBack}>

      {/* HERO */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '52px' }}>
        <p style={{ fontSize: '17px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "'Lora',Georgia,serif", marginBottom: '34px', maxWidth: '580px' }}>
          &ldquo;Backend code is not just judged by whether it runs. It is judged by whether it can be run, shared, debugged, and trusted.&rdquo;
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '34px' }}>
          {([
            { char: 'arjun' as const, n:'Arjun', r:'Backend Learner', d:'Can write Python. Now discovering that real development includes much more.', c:ACCENT },
            { char: 'nisha' as const, n:'Nisha', r:'Backend Mentor', d:'Helps understand the why behind engineering workflow and discipline.', c:'#0369A1' },
            { char: 'kabir' as const, n:'Kabir', r:'Senior Backend Engineer', d:'Thinks in reproducibility, debugging, and reliable code.', c:'#7843EE' },
            { char: 'meera' as const, n:'Meera', r:'Data-focused Teammate', d:'Cares about careful handling of input, output, and failure.', c:'#C85A40' },
          ]).map(c => (
            <div key={c.n} style={{ background: `${c.c}0D`, border: `1px solid ${c.c}33`, borderRadius: '10px', padding: '12px 14px', flex: '1', minWidth: '130px' }}>
              <div style={{ marginBottom: '6px' }}><PythonMentorFace char={c.char} size={38} /></div>
              <div style={{ fontWeight: 700, fontSize: '12px', color: c.c, marginBottom: '2px' }}>{c.n}</div>
              <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', fontFamily: 'monospace', letterSpacing: '0.04em', marginBottom: '5px' }}>{c.r}</div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{c.d}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '18px 22px', borderLeft: `4px solid ${ACCENT}`, border: '1px solid var(--ed-rule)', borderLeftWidth: '4px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '10px', textTransform: 'uppercase' as const }}>What you will be able to do</div>
              {['Read and write files in text, JSON, and CSV using pathlib', 'Read a Python traceback and identify file, line, error type, and cause', 'Handle specific exceptions without hiding useful diagnostic information', 'Set up a reproducible Python environment with venv and requirements.txt'].map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 3 ? '8px' : 0, alignItems: 'flex-start' }}>
                  <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '11px', marginTop: '2px' }}>0{i + 1}</span>
                  <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>{obj}</span>
                </div>
              ))}
              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--ed-rule)', display: 'flex', gap: '16px', fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>
                <span>7 sections</span>
                <span>&#xB7;</span>
                <span>&#x7E;30 min</span>
                <span>&#xB7;</span>
                <span>Python Pre-Read 03</span>
              </div>
            </div>
          </div>
          <PR3HeroArtifact />
        </div>
      </motion.div>

      {/* PART 1 */}
      <ChapterSection id="pr3-file-io" data-nav-id="pr3-file-io" num="01" accentRgb={ACCENT_RGB} first>
        <SceneSetter title="The script that worked until it needed real input." story="Arjun writes a small script to process order data. Until now, he hardcoded values: names, prices, discounts. Now he wants the script to read from a file. He creates orders.txt, reads it, and it works. Then Kabir asks: what happens when the file is huge? Or missing? Or structured differently than expected?" mentorQuote="File I/O is where your code stops talking only to itself." mentorName="Nisha" mentorColor="#0369A1" />
        <CodeBlock filename="file_io.py" code={`# Reading
with open("orders.txt", "r") as file:
    content = file.read()
    print(content)

# Writing (overwrites)
with open("notes.txt", "w") as file:
    file.write("Hello, backend world")

# Appending
with open("log.txt", "a") as file:
    file.write("New entry\\n")`} />
        {para(<>The <code>with open(...)</code> pattern handles file closing cleanly even when something goes wrong. A file is not just text — it is input. And input changes what the program must be ready for.</>)}
        {keyBox('Why file I/O matters', ['Backend systems constantly interact with files: logs, uploads, reports, exports, config', 'Outside data can be missing, malformed, or larger than expected', '"r" = read, "w" = write (overwrites), "a" = append', 'with open(...) ensures clean file handling even on failure'])}

        {h2(<>Real data formats: pathlib, JSON, and CSV</>)}

        {para(<>Most backend file work is not plain text. Data arrives as JSON from APIs, CSV from spreadsheets and exports, or structured configs. Python has built-in support for all three — plus <code>pathlib</code> for writing paths that work across operating systems without string hacks.</>)}

        <CodeBlock filename="pathlib_usage.py" code={`from pathlib import Path

# pathlib gives you cross-platform path handling
base = Path("data")
file = base / "orders.json"  # joins paths correctly on all OSes

print(file.exists())         # True / False — no guessing
print(file.suffix)           # ".json"
print(file.stem)             # "orders"
print(file.parent)           # "data"

# Safe to open with context manager
with file.open("r") as f:
    content = f.read()`} />

        <CodeBlock filename="json_io.py" code={`import json

# Reading JSON from a file
with open("order.json", "r") as f:
    order = json.load(f)          # parse JSON -> Python dict/list
    print(order["customer"])

# Writing a Python object as JSON
result = {"order_id": 101, "total": 499.0, "paid": True}
with open("result.json", "w") as f:
    json.dump(result, f, indent=2) # indent=2 makes it human-readable`} />

        <CodeBlock filename="csv_io.py" code={`import csv

# Reading a CSV file into rows
with open("orders.csv", "r") as f:
    reader = csv.DictReader(f)    # each row becomes a dict using headers
    for row in reader:
        print(row["customer"], row["amount"])

# Writing rows to a CSV file
with open("report.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["customer", "amount"])
    writer.writeheader()
    writer.writerow({"customer": "Ravi", "amount": "499.0"})`} />

        <div style={{ margin: '16px 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
          {[
            { label: 'Plain text', desc: 'Logs, config, simple output', color: ACCENT, example: 'open("log.txt")' },
            { label: 'JSON', desc: 'APIs, configs, nested data', color: '#3B82F6', example: 'json.load(f)' },
            { label: 'CSV', desc: 'Reports, exports, tabular data', color: '#7C3AED', example: 'csv.DictReader(f)' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '12px 14px', borderRadius: '10px', background: `${item.color}0D`, border: `1px solid ${item.color}30` }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: item.color, marginBottom: '4px' }}>{item.label}</div>
              <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginBottom: '6px' }}>{item.desc}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: item.color }}>{item.example}</div>
            </div>
          ))}
        </div>

        <PythonPrinciple text="File I/O matters because real programs work with data that lives outside the code." />
        <FileFormatChooser />

        <ApplyItBox prompt="Think of one backend scenario where data would naturally come from or go to a file — logs, order exports, configuration, uploaded data. What could go wrong?" />
        <QuizEngine conceptId="python-file-io" conceptName="File I/O" moduleContext="Python Pre-Read 03."
          staticQuiz={{ conceptId: "python-file-io", question: "Why is file I/O an important shift for beginners?", options: ['It makes Python more complex', 'Code starts interacting with data that lives outside the script itself', 'Files replace all Python variables', 'Backend engineers never use variables'], correctIndex: 1, explanation: "Hardcoded values only test logic in isolation. File I/O introduces the reality that data comes from outside — and outside data can be missing, wrong-shaped, or unpredictably large." }} />
      </ChapterSection>

      {/* PART 2 */}
      <ChapterSection id="pr3-exceptions" data-nav-id="pr3-exceptions" num="02" accentRgb={ACCENT_RGB}>
        <SceneSetter title="The day a missing file taught Arjun that errors are part of the system." story="Arjun runs the script again. It crashes — the file path is wrong. He stares at the traceback feeling the usual beginner reaction: something is broken. Kabir looks at the error and says something unexpected." mentorQuote="This is not a weird interruption. This is part of the system." mentorName="Kabir" mentorColor="#7843EE" />
        <ConvoScene lines={[
          { speaker: 'arjun', text: "If my code crashes, doesn't that mean it's broken?" },
          { speaker: 'mentor', text: "Not necessarily. In real systems, things go wrong constantly: files missing, values invalid, network timing out. Code that assumes perfection becomes fragile very quickly." },
          { speaker: 'arjun', text: "So I should design for things going wrong?" },
          { speaker: 'mentor', text: "Design for the failures you can anticipate. That's what exception handling is for." },
        ]} mentorName="Kabir" mentorColor="#7843EE" />
        <CodeBlock filename="exception_basic.py" code={`try:
    with open("orders.txt", "r") as file:
        content = file.read()
        print(content)
except FileNotFoundError:
    print("The file was not found. Check the path.")`} />
        <ExceptionFlowLab />

        {h2(<>Reading a traceback</>)}

        {para(<>A traceback is not an enemy — it is a diagnostic report. Python prints the full call stack, the file and line where the error occurred, and the error type with its message. Learning to read one top-to-bottom (or bottom-to-top for the cause) turns a crash into a clear diagnosis.</>)}

        <CodeBlock filename="traceback_example.txt" code={`Traceback (most recent call last):          <- 1. Start here: call stack
  File "main.py", line 12, in <module>       <- 2. Which file and line
    result = process_order("abc")
  File "orders.py", line 7, in process_order <- 3. Which function
    total = int(amount) + 50
ValueError: invalid literal for int()        <- 4. Error type and message
with base 10: 'abc'

# How to read it:
# 1. Go to the BOTTOM — that's the actual error
# 2. Error type: ValueError (not a file issue — a data issue)
# 3. Line 7 in orders.py: int(amount) where amount = 'abc'
# 4. Fix: validate input before passing it, or catch ValueError explicitly`} />

        <div style={{ margin: '16px 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          {[
            { num: '1', label: 'Traceback header', desc: 'Shows the call stack top-to-bottom', color: '#3B82F6' },
            { num: '2', label: 'File + line', desc: 'Exact location in your codebase', color: ACCENT },
            { num: '3', label: 'Error type', desc: 'ValueError, TypeError, FileNotFoundError...', color: '#CA8A04' },
            { num: '4', label: 'Error message', desc: 'Specific description of what failed', color: '#EF4444' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', background: `${item.color}0D`, border: `1px solid ${item.color}25` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, color: item.color, marginBottom: '4px' }}>{item.num} {item.label}</div>
              <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <PythonPrinciple text="Exceptions are not a side topic. They are part of how real programs survive imperfect conditions." />
        <TracebackReaderLab />

        <ApplyItBox prompt="Think of one thing that can go wrong in a backend system. What would graceful handling look like — not just stopping the crash, but making the failure useful and informative?" />
        <QuizEngine conceptId="python-exceptions" conceptName="Exception Handling" moduleContext="Python Pre-Read 03."
          staticQuiz={{ conceptId: "python-exceptions", question: "Why is exception handling important in backend code?", options: ['It makes code look more advanced', 'It helps the program deal with failure conditions more intentionally and clearly', 'It removes all bugs from the program', 'It avoids the need to use files'], correctIndex: 1, explanation: "Real programs face constant failure conditions. Exception handling makes failure explicit and manageable — rather than letting programs crash or fail silently." }} />
      </ChapterSection>

      {/* PART 3 */}
      <ChapterSection id="pr3-except-handle" data-nav-id="pr3-except-handle" num="03" accentRgb={ACCENT_RGB}>
        <SceneSetter title="The error that should not have been silenced." story="Arjun starts wrapping everything in try/except. At first it feels like progress. Then Kabir sees: try: amount = int('abc') — except: print('Something went wrong'). He stops Arjun immediately." mentorQuote="What exactly went wrong? 'I don't know, but at least the script didn't crash.' — This is where exception handling becomes dangerous." mentorName="Kabir" mentorColor="#7843EE" />
        <CodeBlock filename="except_comparison.py" code={`# ✗ Bad: catches everything, hides the real cause
try:
    amount = int("abc")
except:
    print("Something went wrong")

# ✓ Better: specific exception with clear message
try:
    amount = int("abc")
except ValueError:
    print("Invalid number format — expected a number.")

# ✓ With finally: cleanup always runs
try:
    with open("orders.txt") as f:
        data = f.read()
except FileNotFoundError:
    print("File not found.")
finally:
    print("Cleanup — always runs, success or failure.")`} />
        <ExceptionPathwaysAnimation />
        <ConvoScene lines={[
          { speaker: 'mentor', text: "The goal is not to suppress errors. It is to understand and handle the right errors at the right level." },
          { speaker: 'arjun', text: "So broad except treats a missing file, a bad input, and a bug as if they're the same?" },
          { speaker: 'mentor', text: "Exactly. Each deserves a different response. Treating them identically makes debugging much harder." },
        ]} mentorName="Meera" mentorColor="#C85A40" />
        <PythonPrinciple text="Good exception handling does not hide failure. It makes failure understandable and manageable." />
        <ApplyItBox prompt="What is one error in a small Python program that should be caught with a specific exception — and what information should the error message provide to be useful?" />
        <QuizEngine conceptId="python-specific-exceptions" conceptName="Specific Exception Handling" moduleContext="Python Pre-Read 03."
          staticQuiz={{ conceptId: "python-specific-exceptions", question: "What is the biggest risk of using a broad except everywhere?", options: ['Makes the program run too fast', 'Hides useful debugging information and lets unexpected problems pass silently', 'Replaces all named functions', 'Prevents file reading from working'], correctIndex: 1, explanation: "Broad except treats all failures as identical. FileNotFoundError, ValueError, and programming bugs all look the same — making debugging harder and behavior less predictable." }} />
      </ChapterSection>

      {/* PART 4 */}
      <ChapterSection id="pr3-environments" data-nav-id="pr3-environments" num="04" accentRgb={ACCENT_RGB}>
        <SceneSetter title="The day Arjun installed a package and accidentally learned about environments." story="Arjun needs a third-party package. He installs it. It works on his machine. Then Kabir asks: where exactly did you install it? If I clone your project right now, will my machine behave the same way?" mentorQuote="A virtual environment protects one project from leaking into another." mentorName="Nisha" mentorColor="#0369A1" />
        <ConvoScene lines={[
          { speaker: 'arjun', text: "Why does it matter where the package is installed? It works, doesn't it?" },
          { speaker: 'mentor', text: "Project A needs requests 2.28. Project B needs 2.31. A third breaks when you upgrade. If everything is global, you can't have both — and another machine has neither." },
          { speaker: 'arjun', text: "So every project needs its own Python setup?" },
          { speaker: 'mentor', text: "That's exactly what a virtual environment gives you — an isolated package space per project." },
        ]} mentorName="Kabir" mentorColor="#7843EE" />
        <CodeBlock filename="venv_setup.sh" code={`# Create a virtual environment
python -m venv venv

# Activate (macOS/Linux)
source venv/bin/activate

# Activate (Windows)
venv\\Scripts\\activate

# Now pip only installs into THIS project's environment
pip install requests`} />
        <EnvironmentIsolationLab />
        <PythonPrinciple text="Virtual environments matter because real projects need isolated, reproducible dependency setups." />
        <ApplyItBox prompt="Why might two Python projects on the same machine need different dependency setups? What happens to both if only one version of a shared package can exist globally?" />
        <QuizEngine conceptId="python-venv" conceptName="Virtual Environments" moduleContext="Python Pre-Read 03."
          staticQuiz={{ conceptId: "python-venv", question: "What problem does a virtual environment solve?", options: ['Makes Python execute faster', "Isolates a project's dependencies from other projects and the global Python install", 'Replaces the need for pip entirely', 'Removes the need for any packages'], correctIndex: 1, explanation: "Different projects need different package versions. Without isolation, upgrading for one project breaks another. A virtual environment gives each project its own clean package space." }} />
      </ChapterSection>

      {/* PART 5 */}
      <ChapterSection id="pr3-pip" data-nav-id="pr3-pip" num="05" accentRgb={ACCENT_RGB}>
        <SceneSetter title="The pip conversation that finally made dependencies feel real." story="Once Arjun understands environments, pip starts making more sense. Before, 'pip install' felt like something you typed because tutorials said to. Kabir wants him to stop treating it casually." mentorQuote="When you install a package, you're changing the project's dependency state. If your code depends on it and the environment doesn't have it, your code isn't truly runnable yet." mentorName="Kabir" mentorColor="#7843EE" />
        <CodeBlock filename="pip_usage.py" code={`# Install a package into the active environment
pip install requests

# Your code can now use it:
import requests

response = requests.get("https://api.example.com/orders")
print(response.json())`} />
        <PackageInstallationFlow />

        <DependencyRepairSim />

        <PythonPrinciple text="Installing a package is not just a setup action. It changes the dependency state your project relies on." />
        <ApplyItBox prompt="Think of one package a backend project might depend on. What error would another engineer see if they cloned the code but did not install that package?" />
        <QuizEngine conceptId="python-pip" conceptName="pip and Dependencies" moduleContext="Python Pre-Read 03."
          staticQuiz={{ conceptId: "python-pip", question: "Why does 'pip install' matter beyond just making imports work?", options: ["It changes the project's dependency environment — other machines need the same packages", 'It changes Python syntax rules for the project', 'It replaces all variables', 'It speeds up file reading'], correctIndex: 0, explanation: "pip install changes the environment state the project relies on. Without that package on another machine — or in another environment — the code cannot run." }} />
      </ChapterSection>

      {/* PART 6 */}
      <ChapterSection id="pr3-requirements" data-nav-id="pr3-requirements" num="06" accentRgb={ACCENT_RGB}>
        <SceneSetter title="The file that made the project shareable." story="Kabir asks: what happens if I clone your project today? Arjun starts listing steps: create venv, install packages, maybe guess the right versions... Kabir nods. 'And that is exactly the problem.'" mentorQuote="requirements.txt is one of the simplest ways a Python project explains how to recreate itself." mentorName="Nisha" mentorColor="#0369A1" />
        <CodeBlock filename="requirements_workflow.sh" code={`# Generate requirements.txt from current environment
pip freeze > requirements.txt

# It looks like:
# requests==2.31.0
# flask==3.0.0
# pydantic==2.0.0

# Another engineer reproduces the exact environment:
pip install -r requirements.txt`} />
        <ReproducibilityWorkspace />
        {keyBox('The full reproducible workflow', ['1. python -m venv venv — create an isolated environment', '2. source venv/bin/activate — enter the environment', '3. pip install <packages> — add what the project needs', '4. pip freeze > requirements.txt — capture the dependency state', '5. pip install -r requirements.txt — any machine recreates it exactly'])}

        <div style={{ margin: '16px 0', padding: '14px 18px', borderRadius: '10px', background: 'rgba(202,138,4,0.08)', border: '1px solid rgba(202,138,4,0.3)' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#CA8A04', marginBottom: '6px', textTransform: 'uppercase' as const, fontFamily: "'JetBrains Mono', monospace" }}>Warning: pip freeze can capture too much</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>
            If your virtual environment is messy or has leftover packages from experiments, <code>pip freeze</code> captures all of them — not just what your project actually needs. A clean venv with only the necessary packages installed gives a more reliable <code>requirements.txt</code>.
          </div>
        </div>

        <div style={{ margin: '16px 0', padding: '14px 18px', borderRadius: '10px', background: `rgba(${ACCENT_RGB},0.07)`, border: `1px solid rgba(${ACCENT_RGB},0.25)` }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: ACCENT, marginBottom: '6px', textTransform: 'uppercase' as const, fontFamily: "'JetBrains Mono', monospace" }}>Modern note: pyproject.toml</div>
          <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65, marginBottom: '8px' }}>
            <code>requirements.txt</code> is beginner-friendly and very common. Increasingly, modern Python projects use <code>pyproject.toml</code> — a single file that declares the project name, version, dependencies, and build configuration in one place. Tools like <code>poetry</code>, <code>hatch</code>, and <code>uv</code> all use this format.
          </div>
          <CodeBlock code={`# pyproject.toml (modern approach — increasingly common)
[project]
name = "order-service"
version = "0.1.0"
dependencies = [
    "requests>=2.28",
    "fastapi>=0.100"
]`} />
        </div>

        <ReproducibilityChecklist />

        <PythonPrinciple text="A Python project is not truly shareable until its dependency setup is reproducible." />
        <ApplyItBox prompt="Why is 'it works on my machine' a warning sign in software engineering? What would need to be true for it to work on any machine?" />
        <QuizEngine conceptId="python-requirements" conceptName="requirements.txt" moduleContext="Python Pre-Read 03."
          staticQuiz={{ conceptId: "python-requirements", question: "What is the main purpose of requirements.txt?", options: ['To store Python function definitions', "To record the project's package dependencies so any machine can reproduce the setup", 'To replace the pip command entirely', 'To manage file reading operations'], correctIndex: 1, explanation: "requirements.txt captures exact packages and versions. pip install -r requirements.txt recreates the same environment on any machine — turning 'it works on my machine' into 'it works everywhere.'" }} />
      </ChapterSection>

      {/* PART 7 */}
      <ChapterSection id="pr3-reflection" data-nav-id="pr3-reflection" num="07" accentRgb={ACCENT_RGB}>
        <SceneSetter title="The week Arjun realized backend engineering is more than writing logic." story="At the end of the week, Arjun says: 'I think I kept treating Python like a language only.' Nisha asks: 'And now?' Arjun thinks for a second." mentorQuote="Now it feels more like a working environment." mentorName="Kabir" mentorColor="#7843EE" />
        <ConvoScene lines={[
          { speaker: 'mentor', text: "Backend code is not just judged by whether it runs. It is judged by whether it can be run, shared, debugged, and trusted." },
          { speaker: 'arjun', text: "I always thought the hard part was the logic. Now I see that making it reliable, shareable, and predictable is just as hard." },
          { speaker: 'mentor', text: "And that's what separates scripts from engineering." },
        ]} mentorName="Kabir" mentorColor="#7843EE" />
        {keyBox('What real Python development actually includes', ['File I/O — interacting with data outside the code', 'Exception handling — designing for failure, not just success', 'Virtual environments — isolation that prevents dependency chaos', 'pip and requirements — project state management, not just setup', 'Reproducibility — code that works everywhere, not just on your laptop'])}
        <PythonPrinciple text="Real Python development is not just about writing logic. It is about making code runnable, reliable, and reproducible in the real world." />
        <div style={{ margin: '28px 0', padding: '22px', background: 'var(--ed-card)', borderRadius: '12px', border: `1.5px solid ${ACCENT}25` }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '12px', textTransform: 'uppercase' as const }}>Thought Exercise</div>
          {para(<>Imagine you are sharing a small Python backend project with another engineer. Your project reads input from a file, handles invalid data, uses a third-party package, runs inside a virtual environment, and depends on a requirements file.</>)}
          {para(<>Ask yourself: what would break if the file were missing? What exceptions should be handled? What would happen without environment isolation? What would happen if dependencies were not recorded? Write the full setup flow from scratch.</>)}
        </div>
        <QuizEngine conceptId="python-realworld" conceptName="Python Real-World Workflow" moduleContext="Python Pre-Read 03."
          staticQuiz={{ conceptId: "python-realworld", question: "Which sequence best reflects strong beginner backend-Python workflow thinking?", options: ['Write code — run locally — hope it works elsewhere', 'Write logic — ignore failure — install packages globally', 'Write code — handle expected failures — isolate environment — manage dependencies — make setup reproducible', 'Use one global environment for all projects forever'], correctIndex: 2, explanation: "Real backend workflow includes anticipating failures, isolating environments, managing dependencies explicitly, and ensuring another engineer can run the same code on a different machine." }} />
      </ChapterSection>

    </SWEPreReadLayout>
  );
}

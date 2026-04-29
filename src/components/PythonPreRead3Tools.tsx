'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT = '#16A34A';
const ACCENT_RGB = '22,163,74';

const TiltCard = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });
  const handle = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -6, y: ((e.clientX - r.left) / r.width - 0.5) * 6, scale: 1.012 });
  };
  return (
    <div onMouseMove={handle} onMouseLeave={() => setTilt({ x: 0, y: 0, scale: 1 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`, transition: 'transform 0.18s ease', willChange: 'transform', ...style }}>
      {children}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// INTERACTIVE TRACEBACK READER
// ─────────────────────────────────────────────────────────────────────────────

const TRACEBACKS = [
  {
    id: 't1',
    lines: [
      { text: 'Traceback (most recent call last):', type: 'header', color: '#94a3b8' },
      { text: '  File "main.py", line 14, in <module>', type: 'file-line', color: '#93c5fd' },
      { text: '    process_order(user_id, amount)', type: 'code', color: '#94a3b8' },
      { text: '  File "orders.py", line 7, in process_order', type: 'file-line', color: '#93c5fd' },
      { text: '    total = int(amount) + tax', type: 'code', color: '#94a3b8' },
      { text: 'ValueError: invalid literal for int() with base 10: "abc"', type: 'error', color: '#f87171' },
    ],
    questions: [
      { label: 'Which file contains the bug?', correctAnswer: 'orders.py', hint: 'Look at the last "File" line before the error.' },
      { label: 'Which line number?', correctAnswer: '7', hint: 'The line number in the innermost frame.' },
      { label: 'What error type?', correctAnswer: 'ValueError', hint: 'It appears before the colon on the last line.' },
      { label: 'What is the likely cause?', correctAnswer: 'amount is a string "abc", not a number', hint: 'int() failed — what did it receive?' },
    ],
    fix: 'Validate that amount is a numeric string before calling int(). Use try/except ValueError around the conversion or check amount.isnumeric() first.',
  },
  {
    id: 't2',
    lines: [
      { text: 'Traceback (most recent call last):', type: 'header', color: '#94a3b8' },
      { text: '  File "app.py", line 23, in <module>', type: 'file-line', color: '#93c5fd' },
      { text: '    data = load_config("settings.json")', type: 'code', color: '#94a3b8' },
      { text: '  File "config.py", line 5, in load_config', type: 'file-line', color: '#93c5fd' },
      { text: '    with open(path) as f:', type: 'code', color: '#94a3b8' },
      { text: 'FileNotFoundError: [Errno 2] No such file: "settings.json"', type: 'error', color: '#f87171' },
    ],
    questions: [
      { label: 'Which file contains the bug?', correctAnswer: 'config.py', hint: 'The innermost frame is the actual failure point.' },
      { label: 'Which line number?', correctAnswer: '5', hint: 'The line number in config.py.' },
      { label: 'What error type?', correctAnswer: 'FileNotFoundError', hint: 'Before the colon at the end.' },
      { label: 'What is the likely cause?', correctAnswer: 'settings.json does not exist at the expected path', hint: 'The error message says "No such file".' },
    ],
    fix: 'Check that settings.json exists before opening. Use Path("settings.json").exists() first, or catch FileNotFoundError and provide a clear message about where the config file should be.',
  },
];

export function TracebackReaderLab() {
  const [tbIdx, setTbIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>(['', '', '', '']);
  const [checked, setChecked] = useState(false);
  const tb = TRACEBACKS[tbIdx];

  const check = () => setChecked(true);
  const next = () => {
    setTbIdx(i => (i + 1) % TRACEBACKS.length);
    setAnswers(['', '', '', '']);
    setChecked(false);
  };

  const correctCount = tb.questions.filter((q, i) => {
    const a = answers[i].toLowerCase().trim();
    const c = q.correctAnswer.toLowerCase();
    return a === c || c.includes(a) || a.includes(c.split(' ')[0]);
  }).length;

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', background: 'var(--ed-card)' }}>
        <div style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0f172a 100%)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: '#f87171' }}>Traceback Reader</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(241,245,249,0.4)', marginTop: '2px' }}>Read the traceback. Answer the diagnostic questions.</div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(241,245,249,0.4)' }}>{tbIdx + 1} / {TRACEBACKS.length}</div>
        </div>

        {/* Terminal panel */}
        <div style={{ background: '#020617', padding: '16px 20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', lineHeight: 1.9 }}>
          <div style={{ color: '#4ade80', marginBottom: '6px', fontSize: '9px' }}>$ python main.py</div>
          {tb.lines.map((line, i) => (
            <div key={i} style={{ color: line.color, paddingLeft: line.type === 'code' ? '4px' : '0' }}>{line.text}</div>
          ))}
        </div>

        {/* Diagnostic questions */}
        <div style={{ padding: '16px 20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#3B82F6', letterSpacing: '0.1em', marginBottom: '12px', textTransform: 'uppercase' as const }}>Diagnose this traceback</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {tb.questions.map((q, i) => {
              const isCorrect = checked && (() => {
                const a = answers[i].toLowerCase().trim();
                const c = q.correctAnswer.toLowerCase();
                return a === c || c.includes(a) || a.includes(c.split(' ')[0]);
              })();
              return (
                <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', background: checked ? (isCorrect ? `rgba(${ACCENT_RGB},0.08)` : 'rgba(239,68,68,0.08)') : 'var(--ed-cream)', border: `1px solid ${checked ? (isCorrect ? ACCENT : '#EF4444') + '40' : 'var(--ed-rule)'}` }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink2)', marginBottom: '5px' }}>{q.label}</div>
                  <input value={answers[i]} onChange={e => setAnswers(a => { const n = [...a]; n[i] = e.target.value; return n; })} disabled={checked}
                    placeholder={q.hint} style={{ width: '100%', padding: '5px 8px', borderRadius: '5px', border: `1px solid ${checked ? (isCorrect ? ACCENT : '#EF4444') + '60' : 'var(--ed-rule)'}`, background: 'var(--ed-bg)', fontSize: '11px', color: 'var(--ed-ink)', fontFamily: "'JetBrains Mono', monospace", boxSizing: 'border-box' as const }} />
                  {checked && (
                    <div style={{ marginTop: '4px', fontSize: '9px', color: isCorrect ? ACCENT : '#EF4444' }}>
                      {isCorrect ? 'Correct' : `Expected: ${q.correctAnswer}`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
            {!checked ? (
              <button onClick={check} disabled={answers.some(a => !a.trim())}
                style={{ padding: '8px 20px', borderRadius: '8px', background: answers.every(a => a.trim()) ? '#f87171' : 'var(--ed-rule)', color: answers.every(a => a.trim()) ? '#fff' : 'var(--ed-ink3)', border: 'none', fontSize: '11px', fontWeight: 700, cursor: answers.every(a => a.trim()) ? 'pointer' : 'not-allowed' }}>
                Check diagnosis
              </button>
            ) : (
              <button onClick={next}
                style={{ padding: '8px 20px', borderRadius: '8px', background: ACCENT, color: '#fff', border: 'none', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                Next traceback &rarr;
              </button>
            )}
            {checked && <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', alignSelf: 'center' }}>{correctCount}/{tb.questions.length} correct</div>}
          </div>

          {checked && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: `rgba(${ACCENT_RGB},0.08)`, border: `1px solid rgba(${ACCENT_RGB},0.25)`, fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
              <strong style={{ color: ACCENT }}>Fix: </strong>{tb.fix}
            </motion.div>
          )}
        </div>
      </div>
    </TiltCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FILE FORMAT CHOOSER
// ─────────────────────────────────────────────────────────────────────────────

const FORMAT_SCENARIOS = [
  { id: 'ff1', desc: 'Server access logs — timestamped lines, append-only', correct: 'text', reason: 'Sequential lines with no structure needed. Plain text (or .log) is standard for append-only logs.' },
  { id: 'ff2', desc: 'Weekly sales report — rows for each product with columns', correct: 'csv', reason: 'Tabular data with rows and columns. CSV is the standard format for spreadsheet-style data.' },
  { id: 'ff3', desc: 'API response with nested user, orders, and line items', correct: 'json', reason: 'Nested, hierarchical data. JSON handles key-value nesting that flat CSV cannot represent.' },
  { id: 'ff4', desc: 'Export of 5,000 customer records for a BI tool', correct: 'csv', reason: 'Flat, structured records at scale. CSV is widely supported by BI tools and databases.' },
  { id: 'ff5', desc: 'App configuration: database URL, port, debug flag', correct: 'json', reason: 'Config files need named keys and often nested sections. JSON (or TOML) fits better than CSV.' },
  { id: 'ff6', desc: 'Simple output written to disk — one line per result', correct: 'text', reason: 'Line-by-line results with no structure. Plain text is the simplest and most readable format.' },
];

const FORMAT_COLORS: Record<string, string> = { text: '#CA8A04', csv: '#3B82F6', json: ACCENT };
const FORMAT_ICONS: Record<string, string> = { text: '.txt', csv: '.csv', json: '.json' };

export function FileFormatChooser() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const answer = (id: string, fmt: string) => {
    if (revealed[id]) return;
    setAnswers(a => ({ ...a, [id]: fmt }));
    setRevealed(r => ({ ...r, [id]: true }));
  };

  const score = FORMAT_SCENARIOS.filter(s => answers[s.id] === s.correct).length;
  const done = Object.keys(revealed).length === FORMAT_SCENARIOS.length;

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '16px', overflow: 'hidden', border: `1px solid rgba(${ACCENT_RGB},0.2)`, boxShadow: '0 8px 40px rgba(0,0,0,0.12)', background: 'var(--ed-card)' }}>
        <div style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0f172a 100%)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: ACCENT }}>File Format Chooser</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(241,245,249,0.4)', marginTop: '2px' }}>Choose text, CSV, or JSON for each scenario</div>
          </div>
          {done && <div style={{ padding: '4px 12px', borderRadius: '20px', background: `rgba(${ACCENT_RGB},0.2)`, fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, color: ACCENT }}>{score}/{FORMAT_SCENARIOS.length} correct</div>}
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
          {FORMAT_SCENARIOS.map(s => {
            const chosen = answers[s.id];
            const isRevealed = revealed[s.id];
            const isCorrect = chosen === s.correct;
            return (
              <div key={s.id} style={{ padding: '12px 14px', borderRadius: '10px', background: isRevealed ? (isCorrect ? `rgba(${ACCENT_RGB},0.07)` : 'rgba(239,68,68,0.07)') : 'var(--ed-cream)', border: `1px solid ${isRevealed ? (isCorrect ? ACCENT : '#EF4444') + '40' : 'var(--ed-rule)'}` }}>
                <div style={{ fontSize: '13px', color: 'var(--ed-ink)', marginBottom: '8px' }}>{s.desc}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const, alignItems: 'flex-start' }}>
                  {['text', 'csv', 'json'].map(fmt => {
                    const isCh = chosen === fmt;
                    const isCorr = fmt === s.correct;
                    const color = FORMAT_COLORS[fmt];
                    let bg = 'var(--ed-bg)'; let border = 'var(--ed-rule)'; let col = 'var(--ed-ink3)';
                    if (isRevealed && isCorr) { bg = `${color}18`; border = color; col = color; }
                    else if (isRevealed && isCh && !isCorr) { bg = 'rgba(239,68,68,0.12)'; border = '#EF4444'; col = '#EF4444'; }
                    else if (isCh) { bg = `${color}12`; border = color; col = color; }
                    return (
                      <button key={fmt} onClick={() => answer(s.id, fmt)}
                        style={{ padding: '5px 16px', borderRadius: '7px', border: `1.5px solid ${border}`, background: bg, color: col, fontSize: '10px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", cursor: isRevealed ? 'default' : 'pointer', transition: 'all 0.15s' }}>
                        {FORMAT_ICONS[fmt]}
                      </button>
                    );
                  })}
                  {isRevealed && (
                    <motion.div initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                      style={{ fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.55, flex: 1, minWidth: '160px' }}>
                      {s.reason}
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {done && (
          <div style={{ padding: '12px 20px', background: 'var(--ed-cream)', borderTop: '1px solid var(--ed-rule)', fontSize: '11px', color: 'var(--ed-ink3)', textAlign: 'center' as const }}>
            {score >= 5 ? 'Good format judgment. Text for lines, CSV for tables, JSON for nested structure.' : 'Key rule: flat data = CSV, nested/keyed data = JSON, line-by-line = text.'}
          </div>
        )}
      </div>
    </TiltCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEPENDENCY REPAIR SIMULATION  (terminal-style)
// ─────────────────────────────────────────────────────────────────────────────

type RepairStep = { cmd: string; output: string; color: string; hint: string; label: string };

const REPAIR_STEPS: RepairStep[] = [
  {
    label: 'Check what went wrong',
    cmd: '$ python main.py',
    output: 'ModuleNotFoundError: No module named \'requests\'',
    color: '#f87171',
    hint: 'The module is missing from the current environment.',
  },
  {
    label: 'Check if venv is active',
    cmd: '$ which python',
    output: '/usr/bin/python3  ← system Python, not your venv!',
    color: '#fbbf24',
    hint: 'The venv is not activated — packages installed into it are not visible.',
  },
  {
    label: 'Activate the virtual environment',
    cmd: '$ source venv/bin/activate',
    output: '(venv) $  ← the prefix tells you the venv is now active',
    color: ACCENT,
    hint: 'Now pip and python point to the venv, not the system.',
  },
  {
    label: 'Install the missing package',
    cmd: '(venv) $ pip install requests',
    output: 'Successfully installed requests-2.31.0',
    color: ACCENT,
    hint: 'The package is now installed inside your venv.',
  },
  {
    label: 'Update requirements.txt',
    cmd: '(venv) $ pip freeze > requirements.txt',
    output: 'requirements.txt updated with requests==2.31.0',
    color: '#3B82F6',
    hint: 'Lock the dependency so any machine can reproduce this setup.',
  },
  {
    label: 'Verify the fix',
    cmd: '(venv) $ python main.py',
    output: 'Order system started successfully.',
    color: ACCENT,
    hint: 'The program runs. The dependency is resolved and recorded.',
  },
];

export function DependencyRepairSim() {
  const [step, setStep] = useState(-1);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [step]);

  const advance = () => setStep(s => Math.min(REPAIR_STEPS.length - 1, s + 1));
  const reset = () => setStep(-1);

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', background: 'var(--ed-card)' }}>
        <div style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0f172a 100%)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: '#3B82F6' }}>Dependency Repair Simulation</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(241,245,249,0.4)', marginTop: '2px' }}>Fix a ModuleNotFoundError step by step</div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(241,245,249,0.4)' }}>
            {step + 1} / {REPAIR_STEPS.length} steps
          </div>
        </div>

        {/* Step progress */}
        <div style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '6px' }}>
          {REPAIR_STEPS.map((s, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: '2px', background: i <= step ? (i === 0 ? '#f87171' : i < 2 ? '#fbbf24' : ACCENT) : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
          ))}
        </div>

        {/* Terminal */}
        <div ref={termRef} style={{ background: '#020617', padding: '16px 20px', minHeight: '160px', maxHeight: '220px', overflowY: 'auto' as const, fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', lineHeight: 1.8 }}>
          {step === -1 && (
            <div style={{ color: '#4ade80', opacity: 0.6 }}>Click &quot;Next step&quot; to start debugging...</div>
          )}
          {REPAIR_STEPS.slice(0, step + 1).map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
              <div style={{ color: '#4ade80', marginTop: i > 0 ? '8px' : '0' }}>{s.cmd}</div>
              <div style={{ color: s.color, paddingLeft: '2px' }}>{s.output}</div>
            </motion.div>
          ))}
        </div>

        {/* Current step hint */}
        {step >= 0 && step < REPAIR_STEPS.length && (
          <div style={{ padding: '10px 20px', background: 'rgba(59,130,246,0.08)', borderTop: '1px solid rgba(59,130,246,0.15)', fontSize: '11px', color: '#93c5fd', lineHeight: 1.6 }}>
            <strong style={{ color: '#3B82F6' }}>Step {step + 1}: {REPAIR_STEPS[step].label} — </strong>{REPAIR_STEPS[step].hint}
          </div>
        )}

        {/* Controls */}
        <div style={{ padding: '12px 20px', background: 'var(--ed-cream)', borderTop: '1px solid var(--ed-rule)', display: 'flex', gap: '8px' }}>
          <button onClick={reset} style={{ padding: '7px 16px', borderRadius: '7px', border: '1px solid var(--ed-rule)', background: 'var(--ed-bg)', fontSize: '11px', cursor: 'pointer', color: 'var(--ed-ink3)' }}>Reset</button>
          <button onClick={advance} disabled={step >= REPAIR_STEPS.length - 1}
            style={{ padding: '7px 20px', borderRadius: '7px', background: step >= REPAIR_STEPS.length - 1 ? 'var(--ed-rule)' : '#3B82F6', color: step >= REPAIR_STEPS.length - 1 ? 'var(--ed-ink3)' : '#fff', border: 'none', fontSize: '11px', fontWeight: 700, cursor: step >= REPAIR_STEPS.length - 1 ? 'not-allowed' : 'pointer' }}>
            {step === -1 ? 'Start debugging' : step >= REPAIR_STEPS.length - 1 ? 'Fixed!' : 'Next step'}
          </button>
          {step >= REPAIR_STEPS.length - 1 && (
            <div style={{ fontSize: '11px', color: ACCENT, fontWeight: 700, alignSelf: 'center' }}>ModuleNotFoundError resolved.</div>
          )}
        </div>
      </div>
    </TiltCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REPRODUCIBILITY CHECKLIST
// ─────────────────────────────────────────────────────────────────────────────

const CHECKLIST_ITEMS = [
  { id: 'c1', label: 'Has a requirements.txt with all dependencies pinned', critical: true },
  { id: 'c2', label: 'venv/ folder is in .gitignore (not committed)', critical: true },
  { id: 'c3', label: 'No hardcoded absolute paths (uses pathlib or relative paths)', critical: true },
  { id: 'c4', label: 'All third-party imports appear in requirements.txt', critical: true },
  { id: 'c5', label: 'README explains how to set up the environment', critical: false },
  { id: 'c6', label: 'Python version is documented (e.g. python-version file)', critical: false },
  { id: 'c7', label: 'Tested on a clean environment by another person or machine', critical: false },
  { id: 'c8', label: 'No secrets or API keys in source files', critical: true },
];

export function ReproducibilityChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id: string) => {
    if (submitted) return;
    setChecked(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const criticalMet = CHECKLIST_ITEMS.filter(i => i.critical && checked.has(i.id)).length;
  const totalCritical = CHECKLIST_ITEMS.filter(i => i.critical).length;
  const totalChecked = checked.size;
  const isShareable = criticalMet === totalCritical;

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius: '16px', overflow: 'hidden', border: `1px solid rgba(${ACCENT_RGB},0.2)`, boxShadow: '0 8px 40px rgba(0,0,0,0.12)', background: 'var(--ed-card)' }}>
        <div style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0f172a 100%)', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: ACCENT }}>Reproducibility Checklist</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(241,245,249,0.4)', marginTop: '2px' }}>Is this project shareable with another engineer?</div>
        </div>

        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '7px' }}>
            {CHECKLIST_ITEMS.map(item => {
              const isChecked = checked.has(item.id);
              return (
                <div key={item.id} onClick={() => toggle(item.id)}
                  style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '9px 12px', borderRadius: '8px', background: isChecked ? `rgba(${ACCENT_RGB},0.08)` : 'var(--ed-cream)', border: `1px solid ${isChecked ? ACCENT + '40' : 'var(--ed-rule)'}`, cursor: submitted ? 'default' : 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '4px', border: `2px solid ${isChecked ? ACCENT : 'var(--ed-rule)'}`, background: isChecked ? ACCENT : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px', transition: 'all 0.15s' }}>
                    {isChecked && <div style={{ width: 8, height: 8, background: '#fff', borderRadius: '2px' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '12px', color: isChecked ? 'var(--ed-ink)' : 'var(--ed-ink2)', lineHeight: 1.5 }}>{item.label}</span>
                    {item.critical && <span style={{ marginLeft: '6px', padding: '1px 6px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: '8px', fontWeight: 700, color: '#EF4444', fontFamily: "'JetBrains Mono', monospace" }}>critical</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: '14px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--ed-ink3)', marginBottom: '4px' }}>
              <span>{totalChecked} / {CHECKLIST_ITEMS.length} items checked</span>
              <span style={{ color: criticalMet === totalCritical ? ACCENT : '#EF4444' }}>{criticalMet}/{totalCritical} critical</span>
            </div>
            <div style={{ height: 6, borderRadius: '3px', background: 'var(--ed-rule)', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${(totalChecked / CHECKLIST_ITEMS.length) * 100}%` }} style={{ height: '100%', background: isShareable ? ACCENT : '#CA8A04', borderRadius: '3px' }} />
            </div>
          </div>

          <button onClick={() => setSubmitted(true)} disabled={submitted}
            style={{ padding: '8px 20px', borderRadius: '8px', background: submitted ? 'var(--ed-rule)' : ACCENT, color: submitted ? 'var(--ed-ink3)' : '#fff', border: 'none', fontSize: '11px', fontWeight: 700, cursor: submitted ? 'default' : 'pointer' }}>
            {submitted ? 'Reviewed' : 'Check shareability'}
          </button>

          {submitted && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '10px', background: isShareable ? `rgba(${ACCENT_RGB},0.09)` : 'rgba(239,68,68,0.08)', border: `1px solid ${isShareable ? ACCENT : '#EF4444'}35`, fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
              <div style={{ fontWeight: 700, color: isShareable ? ACCENT : '#EF4444', marginBottom: '4px' }}>
                {isShareable ? 'Project is shareable.' : 'Not yet shareable — critical items missing.'}
              </div>
              {!isShareable && (
                <div>Missing critical items: {CHECKLIST_ITEMS.filter(i => i.critical && !checked.has(i.id)).map(i => i.label).join(', ')}.</div>
              )}
              {isShareable && <div>All critical requirements are met. Another engineer can clone and reproduce this environment.</div>}
            </motion.div>
          )}
        </div>
      </div>
    </TiltCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PR3 HERO VISUAL ARTIFACT
// ─────────────────────────────────────────────────────────────────────────────

export function PR3HeroArtifact() {
  return (
    <div style={{ flexShrink: 0, width: '220px' }}>
      <div className="float3d" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 32px 64px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Machine A */}
        <div style={{ background: '#1e293b', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: ACCENT, fontWeight: 700 }}>Machine A</div>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: ACCENT }} />
        </div>
        <div style={{ background: '#020617', padding: '10px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', lineHeight: 1.9 }}>
          <div style={{ color: '#4ade80' }}>$ python -m venv venv</div>
          <div style={{ color: '#4ade80' }}>$ pip install requests</div>
          <div style={{ color: '#3B82F6' }}>$ pip freeze &gt; requirements.txt</div>
          <div style={{ color: ACCENT, marginTop: '4px' }}>requirements.txt created</div>
        </div>
        {/* requirements.txt card */}
        <div style={{ background: '#0f172a', padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: '#3B82F6', fontWeight: 700, marginBottom: '3px' }}>requirements.txt</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: '#94a3b8' }}>requests==2.31.0</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: '#94a3b8' }}>fastapi==0.103.0</div>
        </div>
        {/* Arrow */}
        <div style={{ background: '#1e293b', padding: '5px 14px', textAlign: 'center' as const, fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: ACCENT }}>
          &#8659; git push / share &#8659;
        </div>
        {/* Machine B */}
        <div style={{ background: '#1e293b', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#3B82F6', fontWeight: 700 }}>Machine B</div>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#3B82F6' }} />
        </div>
        <div style={{ background: '#020617', padding: '10px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', lineHeight: 1.9 }}>
          <div style={{ color: '#4ade80' }}>$ pip install -r requirements.txt</div>
          <div style={{ color: ACCENT }}>Successfully installed 2 packages</div>
          <div style={{ color: '#4ade80', marginTop: '4px' }}>$ python main.py</div>
          <div style={{ color: ACCENT }}>Order system started.</div>
        </div>
      </div>
    </div>
  );
}

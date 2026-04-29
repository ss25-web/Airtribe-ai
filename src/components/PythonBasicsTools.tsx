'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT = '#16A34A';
const ACCENT_RGB = '22,163,74';

const TiltCard = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -6, y: x * 6, scale: 1.012 });
  };
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0, scale: 1 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`, transition: 'transform 0.18s ease', willChange: 'transform', ...style }}
    >
      {children}
    </div>
  );
};

const ToolShell = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
  <TiltCard style={{ margin: '32px 0' }}>
    <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(22,163,74,0.2)', boxShadow: '0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(22,163,74,0.1)', background: 'var(--ed-card)' }}>
      <div style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0f172a 100%)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 32, height: 32, borderRadius: '8px', background: `rgba(${ACCENT_RGB},0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 14, height: 14, borderRadius: '3px', background: ACCENT }} />
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#F1F5F9', fontFamily: "'JetBrains Mono', monospace" }}>{title}</div>
          <div style={{ fontSize: '10px', color: 'rgba(241,245,249,0.45)', fontFamily: "'JetBrains Mono', monospace" }}>{subtitle}</div>
        </div>
      </div>
      {children}
    </div>
  </TiltCard>
);

// ─────────────────────────────────────────────────────────────────────────────
// TOOL 1 · PYTHON EXECUTION PIPELINE  (identity section)
// ─────────────────────────────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  {
    num: '1', label: 'Source Code', sub: 'You write Python code',
    color: '#3B82F6', icon: '</>',
    detail: 'main.py',
    preview: 'print("Order system started")',
    badge: 'Editor',
  },
  {
    num: '2', label: 'Compilation', sub: 'Code is parsed and compiled',
    color: ACCENT, icon: '⚙',
    detail: 'Compiler',
    preview: 'Lexical Analysis → Parsing → AST Generation → Optimization',
    badge: 'Compilation Chamber',
  },
  {
    num: '3', label: 'Bytecode', sub: 'Platform-independent bytecode produced',
    color: '#7C3AED', icon: '.pyc',
    detail: 'bytecode.pyc',
    preview: '0  LOAD_NAME    0 (print)\n2  LOAD_CONST   0\n4  CALL_FUNCTION 1\n6  POP_TOP\n8  LOAD_CONST   1 (None)\n10 RETURN_VALUE',
    badge: 'Bytecode Object',
  },
  {
    num: '4', label: 'Python VM', sub: 'PVM executes the bytecode',
    color: '#CA8A04', icon: 'PVM',
    detail: 'Python Virtual Machine',
    preview: 'Frame  ·  Evaluation Loop  ·  Stack  ·  Built-ins',
    badge: 'PVM Engine',
  },
  {
    num: '5', label: 'Output', sub: 'Results are displayed',
    color: '#0891B2', icon: '>_',
    detail: 'Terminal',
    preview: '$ python main.py\nOrder system started\n$',
    badge: 'Program Output',
  },
];

export function PythonExecutionPipeline() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (playing) {
      timerRef.current = setTimeout(() => {
        setStep(s => {
          if (s >= PIPELINE_STAGES.length - 1) { setPlaying(false); return s; }
          return s + 1;
        });
      }, 900);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [playing, step]);

  const reset = () => { setStep(0); setPlaying(false); };

  return (
    <ToolShell title="Python Execution Pipeline" subtitle="From your code to program output">
      {/* Stage headers */}
      <div style={{ padding: '20px 20px 0', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
        {PIPELINE_STAGES.map((s, i) => (
          <React.Fragment key={i}>
            <div
              onClick={() => { setStep(i); setPlaying(false); }}
              style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '4px', cursor: 'pointer', minWidth: '80px' }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step >= i ? s.color : 'var(--ed-cream)',
                border: `2px solid ${step >= i ? s.color : 'var(--ed-rule)'}`,
                fontSize: '10px', fontWeight: 800, color: step >= i ? '#fff' : 'var(--ed-ink3)',
                fontFamily: "'JetBrains Mono', monospace",
                transition: 'all 0.3s',
                boxShadow: step === i ? `0 0 14px ${s.color}60` : 'none',
              }}>{s.num}</div>
              <div style={{ fontSize: '9px', fontWeight: step === i ? 800 : 500, color: step === i ? s.color : 'var(--ed-ink3)', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.3 }}>{s.label}</div>
              <div style={{ fontSize: '8px', color: 'var(--ed-ink3)', textAlign: 'center', maxWidth: '70px', lineHeight: 1.3 }}>{s.sub}</div>
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <div style={{ width: 32, height: 2, background: step > i ? PIPELINE_STAGES[i + 1].color : 'var(--ed-rule)', borderRadius: '2px', transition: 'background 0.3s', flexShrink: 0, marginBottom: '28px' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Active stage detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          style={{ margin: '16px 20px', padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)', border: `1px solid ${PIPELINE_STAGES[step].color}40`, minHeight: '100px' }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ width: 44, height: 44, borderRadius: '10px', background: `${PIPELINE_STAGES[step].color}20`, border: `1px solid ${PIPELINE_STAGES[step].color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, color: PIPELINE_STAGES[step].color, flexShrink: 0 }}>
              {PIPELINE_STAGES[step].icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: PIPELINE_STAGES[step].color, letterSpacing: '0.1em', marginBottom: '6px' }}>
                {PIPELINE_STAGES[step].detail}
              </div>
              <pre style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#86EFAC', lineHeight: 1.7, whiteSpace: 'pre-wrap' as const }}>
                {PIPELINE_STAGES[step].preview}
              </pre>
            </div>
          </div>
          <div style={{ marginTop: '10px', display: 'inline-block', padding: '3px 10px', borderRadius: '20px', background: `${PIPELINE_STAGES[step].color}18`, border: `1px solid ${PIPELINE_STAGES[step].color}40`, fontSize: '9px', fontWeight: 700, color: PIPELINE_STAGES[step].color, fontFamily: "'JetBrains Mono', monospace" }}>
            {PIPELINE_STAGES[step].badge}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress + Controls */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{ flex: 1, height: 4, background: 'var(--ed-cream)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div animate={{ width: `${((step + 1) / PIPELINE_STAGES.length) * 100}%` }} style={{ height: '100%', background: PIPELINE_STAGES[step].color, borderRadius: '2px' }} transition={{ duration: 0.3 }} />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>
            {step + 1} / {PIPELINE_STAGES.length}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button onClick={reset} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--ed-rule)', background: 'var(--ed-cream)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: 'var(--ed-ink2)' }}>
            Replay
          </button>
          <button onClick={() => { setStep(s => Math.max(0, s - 1)); setPlaying(false); }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--ed-rule)', background: 'var(--ed-cream)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: 'var(--ed-ink2)' }}>
            Slow Down
          </button>
          <button
            onClick={() => {
              if (step >= PIPELINE_STAGES.length - 1) { reset(); setTimeout(() => setPlaying(true), 50); }
              else setPlaying(p => !p);
            }}
            style={{ padding: '8px 24px', borderRadius: '8px', background: ACCENT, color: '#fff', border: 'none', fontSize: '11px', fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 12px rgba(${ACCENT_RGB},0.35)` }}
          >
            {playing ? 'Pause' : 'Step Through'}
          </button>
        </div>
      </div>

      {/* Key Insight */}
      <div style={{ margin: '0 20px 20px', padding: '12px 16px', borderRadius: '10px', background: `rgba(${ACCENT_RGB},0.07)`, border: `1px solid rgba(${ACCENT_RGB},0.2)`, fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700, color: ACCENT }}>Key Insight: </span>
        Python is compiled to bytecode, not machine code. This makes it portable and able to run anywhere the Python VM exists.
      </div>
    </ToolShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL 2 · VARIABLE BINDING AND TYPE STUDIO  (types section)
// ─────────────────────────────────────────────────────────────────────────────

type PyType = 'string' | 'integer' | 'boolean' | 'float';

const TYPE_COLORS: Record<PyType, string> = {
  string: '#3B82F6',
  integer: '#CA8A04',
  boolean: ACCENT,
  float: '#7C3AED',
};

const TYPE_LABELS: Record<PyType, string> = {
  string: 'abc',
  integer: '123',
  boolean: 'T/F',
  float: '1.23',
};

const INITIAL_VARS = [
  { name: 'customer_name', type: 'string' as PyType, value: '"Rohan"' },
  { name: 'order_total', type: 'integer' as PyType, value: '499' },
  { name: 'is_paid', type: 'boolean' as PyType, value: 'False' },
  { name: 'discount_rate', type: 'float' as PyType, value: '0.10' },
];

const OPERATIONS: Record<PyType, { name: string; desc: string; example: string }[]> = {
  string: [
    { name: 'Concatenate ( + )', desc: 'Combine two strings', example: '"Rohan" + " Kumar" = "Rohan Kumar"' },
    { name: 'Length ( len )', desc: 'Count characters', example: 'len("Rohan") = 5' },
  ],
  integer: [
    { name: 'Add ( + )', desc: 'Add numbers', example: '499 + 250 = 749' },
    { name: 'Compare ( == )', desc: 'Compare values', example: '499 > 250 = True' },
  ],
  boolean: [
    { name: 'Logic ( and / or )', desc: 'Boolean logic', example: 'True and False = False' },
    { name: 'Negate ( not )', desc: 'Flip truth value', example: 'not False = True' },
  ],
  float: [
    { name: 'Multiply ( * )', desc: 'Scale by factor', example: '499 * 0.10 = 49.9' },
    { name: 'Round ( round )', desc: 'Round to decimals', example: 'round(49.9, 0) = 50.0' },
  ],
};

export function VariableBindingStudio() {
  const [selected, setSelected] = useState<number>(0);
  const v = INITIAL_VARS[selected];

  return (
    <ToolShell title="Variable Binding and Type Studio" subtitle="Names bind to values. Values have types.">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0', minHeight: '340px' }}>
        {/* Name Binding */}
        <div style={{ padding: '16px', borderRight: '1px solid var(--ed-rule)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '12px', textTransform: 'uppercase' as const }}>
            1 &nbsp; Name Binding
          </div>
          <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', marginBottom: '10px' }}>Variables (names) in your program</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
            {INITIAL_VARS.map((vr, i) => (
              <div
                key={i} onClick={() => setSelected(i)}
                style={{ padding: '10px 12px', borderRadius: '8px', border: `1px solid ${selected === i ? TYPE_COLORS[vr.type] : 'var(--ed-rule)'}`, background: selected === i ? `${TYPE_COLORS[vr.type]}10` : 'var(--ed-cream)', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '5px', background: TYPE_COLORS[vr.type], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 800, color: '#fff', fontFamily: "'JetBrains Mono', monospace" }}>
                    {TYPE_LABELS[vr.type]}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'JetBrains Mono', monospace" }}>{vr.name}</div>
                </div>
                <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>{vr.type}</div>
                <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT }} />
                  <div style={{ fontSize: '9px', color: ACCENT, fontWeight: 700 }}>Bound</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Value Space */}
        <div style={{ padding: '16px', borderRight: '1px solid var(--ed-rule)', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '4px', textTransform: 'uppercase' as const, alignSelf: 'flex-start' }}>
            2 &nbsp; Value Space
          </div>
          {INITIAL_VARS.map((vr, i) => (
            <motion.div
              key={i}
              animate={{ scale: selected === i ? 1.08 : 0.95, opacity: selected === i ? 1 : 0.45 }}
              transition={{ duration: 0.2 }}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', background: `${TYPE_COLORS[vr.type]}18`, border: `2px solid ${selected === i ? TYPE_COLORS[vr.type] : 'transparent'}`, cursor: 'pointer', boxShadow: selected === i ? `0 6px 20px ${TYPE_COLORS[vr.type]}30` : 'none' }}
              onClick={() => setSelected(i)}
            >
              <div style={{ fontSize: '18px', fontWeight: 900, color: TYPE_COLORS[vr.type], textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>{vr.value}</div>
              <div style={{ textAlign: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '20px', background: `${TYPE_COLORS[vr.type]}25`, color: TYPE_COLORS[vr.type], fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{vr.type}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Types & Operations */}
        <div style={{ padding: '16px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '12px', textTransform: 'uppercase' as const }}>
            3 &nbsp; Types &amp; Operations
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const, marginBottom: '12px' }}>
            {(['string', 'integer', 'boolean', 'float'] as PyType[]).map(t => (
              <div key={t} style={{ padding: '4px 10px', borderRadius: '6px', background: v.type === t ? TYPE_COLORS[t] : `${TYPE_COLORS[t]}15`, border: `1px solid ${TYPE_COLORS[t]}50`, fontSize: '9px', fontWeight: 800, color: v.type === t ? '#fff' : TYPE_COLORS[t], fontFamily: "'JetBrains Mono', monospace" }}>
                {TYPE_LABELS[t]} {t}
              </div>
            ))}
          </div>
          <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Valid Operations</div>
          {OPERATIONS[v.type].map((op, i) => (
            <div key={i} style={{ marginBottom: '10px', padding: '10px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '2px' }}>{op.name}</div>
              <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginBottom: '6px' }}>{op.desc}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: TYPE_COLORS[v.type], background: `${TYPE_COLORS[v.type]}10`, padding: '4px 8px', borderRadius: '4px' }}>{op.example}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ padding: '12px 16px', background: 'var(--ed-cream)', borderTop: '1px solid var(--ed-rule)', display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--ed-ink2)', flexWrap: 'wrap' as const, alignItems: 'center' }}>
        <div>
          <span style={{ fontWeight: 700, color: TYPE_COLORS[v.type] }}>{v.name}</span>
          <span> is bound to the {v.type} value </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: TYPE_COLORS[v.type], fontWeight: 700 }}>{v.value}</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          {INITIAL_VARS.map((vr, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: TYPE_COLORS[vr.type], opacity: selected === i ? 1 : 0.35 }} />
          ))}
        </div>
      </div>
    </ToolShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL 3 · BRANCHING AND TRUTHINESS ENGINE  (flow section)
// ─────────────────────────────────────────────────────────────────────────────

type BranchInputs = { is_paid: boolean; order_total: number; items: number; promo_code: string };

const TRUTHINESS_EXAMPLES = [
  { val: '0', truthy: false },
  { val: '1', truthy: true },
  { val: '""', truthy: false },
  { val: '"SALE"', truthy: true },
  { val: '[]', truthy: false },
  { val: '[1,2]', truthy: true },
];

function getActiveBranch(inputs: BranchInputs): number {
  if (inputs.is_paid) return 0;
  if (inputs.order_total > 1000) return 1;
  if (inputs.items === 0) return 2;
  if (inputs.promo_code !== '') return 3;
  return 4;
}

const BRANCH_LABELS = ['TRUE Branch', 'ELIF Branch', 'ELIF Branch', 'ELIF Branch', 'FALSE Branch'];
const BRANCH_COLORS = [ACCENT, '#3B82F6', '#7C3AED', '#CA8A04', '#EF4444'];
const CONDITIONS = [
  { label: 'is_paid', sub: 'is True' },
  { label: 'order_total > 1000', sub: '' },
  { label: 'items', sub: '(empty list)' },
  { label: 'promo_code', sub: '(non-empty string)' },
  { label: 'else', sub: 'Default / Fallback' },
];

export function BranchingEngine() {
  const [inputs, setInputs] = useState<BranchInputs>({ is_paid: true, order_total: 1500, items: 0, promo_code: 'SALE' });
  const active = getActiveBranch(inputs);

  return (
    <ToolShell title="Branching and Truthiness Engine" subtitle="Visualize how values flow through conditions and branches">
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 200px', gap: '0', minHeight: '380px' }}>
        {/* Left: Inputs + Truthiness */}
        <div style={{ padding: '16px', borderRight: '1px solid var(--ed-rule)', display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '10px', textTransform: 'uppercase' as const }}>
              1 &nbsp; Inputs
            </div>
            {/* is_paid */}
            <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: ACCENT, fontFamily: "'JetBrains Mono', monospace" }}>is_paid</div>
                <button onClick={() => setInputs(v => ({ ...v, is_paid: !v.is_paid }))} style={{ padding: '2px 10px', borderRadius: '12px', background: inputs.is_paid ? ACCENT : 'var(--ed-rule)', border: 'none', color: inputs.is_paid ? '#fff' : 'var(--ed-ink3)', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>
                  {inputs.is_paid ? 'True' : 'False'}
                </button>
              </div>
            </div>
            {/* order_total */}
            <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', marginBottom: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#3B82F6', fontFamily: "'JetBrains Mono', monospace", marginBottom: '4px' }}>order_total</div>
              <input type="number" value={inputs.order_total} onChange={e => setInputs(v => ({ ...v, order_total: Number(e.target.value) }))} style={{ width: '100%', padding: '3px 6px', borderRadius: '5px', border: '1px solid var(--ed-rule)', background: 'var(--ed-bg)', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", color: '#3B82F6', fontWeight: 700, boxSizing: 'border-box' as const }} />
            </div>
            {/* items */}
            <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#7C3AED', fontFamily: "'JetBrains Mono', monospace" }}>items (count)</div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <button onClick={() => setInputs(v => ({ ...v, items: Math.max(0, v.items - 1) }))} style={{ width: 20, height: 20, borderRadius: '4px', border: '1px solid var(--ed-rule)', background: 'var(--ed-bg)', cursor: 'pointer', fontSize: '12px', color: 'var(--ed-ink2)' }}>-</button>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', fontFamily: "'JetBrains Mono', monospace", minWidth: '20px', textAlign: 'center' }}>{inputs.items}</span>
                  <button onClick={() => setInputs(v => ({ ...v, items: v.items + 1 }))} style={{ width: 20, height: 20, borderRadius: '4px', border: '1px solid var(--ed-rule)', background: 'var(--ed-bg)', cursor: 'pointer', fontSize: '12px', color: 'var(--ed-ink2)' }}>+</button>
                </div>
              </div>
            </div>
            {/* promo_code */}
            <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#CA8A04', fontFamily: "'JetBrains Mono', monospace", marginBottom: '4px' }}>promo_code</div>
              <input value={inputs.promo_code} onChange={e => setInputs(v => ({ ...v, promo_code: e.target.value }))} style={{ width: '100%', padding: '3px 6px', borderRadius: '5px', border: '1px solid var(--ed-rule)', background: 'var(--ed-bg)', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: '#CA8A04', fontWeight: 700, boxSizing: 'border-box' as const }} />
            </div>
          </div>

          {/* Truthiness Lab */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '8px', textTransform: 'uppercase' as const }}>
              2 &nbsp; Truthiness Lab
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              {TRUTHINESS_EXAMPLES.map((ex, i) => (
                <div key={i} style={{ padding: '5px 8px', borderRadius: '6px', background: ex.truthy ? `rgba(${ACCENT_RGB},0.1)` : 'rgba(239,68,68,0.08)', border: `1px solid ${ex.truthy ? ACCENT : '#EF4444'}25` }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink)' }}>{ex.val}</div>
                  <div style={{ fontSize: '9px', color: ex.truthy ? ACCENT : '#EF4444', fontWeight: 700 }}>{ex.truthy ? 'True' : 'False'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Decision Gate */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '4px', textTransform: 'uppercase' as const, alignSelf: 'flex-start' }}>
            3 &nbsp; Decision Gate
          </div>
          {CONDITIONS.map((c, i) => (
            <motion.div
              key={i}
              animate={{ scale: active === i ? 1.04 : 1 }}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: active === i ? `${BRANCH_COLORS[i]}18` : 'var(--ed-cream)', border: `2px solid ${active === i ? BRANCH_COLORS[i] : 'var(--ed-rule)'}`, display: 'flex', gap: '10px', alignItems: 'center', boxShadow: active === i ? `0 4px 14px ${BRANCH_COLORS[i]}30` : 'none', transition: 'all 0.2s' }}
            >
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: active === i ? BRANCH_COLORS[i] : 'var(--ed-rule)', color: '#fff', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: active === i ? BRANCH_COLORS[i] : 'var(--ed-ink)', fontFamily: "'JetBrains Mono', monospace" }}>{c.label}</div>
                {c.sub && <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{c.sub}</div>}
              </div>
              {active === i && <div style={{ marginLeft: 'auto', fontSize: '9px', fontWeight: 800, color: BRANCH_COLORS[i] }}>ACTIVE</div>}
            </motion.div>
          ))}
        </div>

        {/* Right: Branches + Trace */}
        <div style={{ padding: '16px', borderLeft: '1px solid var(--ed-rule)', display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '4px', textTransform: 'uppercase' as const }}>
            4 &nbsp; Result
          </div>
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ padding: '16px', borderRadius: '10px', background: `${BRANCH_COLORS[active]}18`, border: `2px solid ${BRANCH_COLORS[active]}`, textAlign: 'center', boxShadow: `0 6px 20px ${BRANCH_COLORS[active]}25` }}
          >
            <div style={{ fontSize: '13px', fontWeight: 900, color: BRANCH_COLORS[active], fontFamily: "'JetBrains Mono', monospace", marginBottom: '4px' }}>{BRANCH_LABELS[active]}</div>
            <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>Execute this block</div>
          </motion.div>

          <div style={{ marginTop: '8px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.1em', marginBottom: '6px', textTransform: 'uppercase' as const }}>Execution Trace</div>
            {CONDITIONS.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: active === i ? BRANCH_COLORS[i] : active > i ? `rgba(${ACCENT_RGB},0.4)` : 'var(--ed-rule)', flexShrink: 0 }} />
                <div style={{ fontSize: '9px', color: active === i ? BRANCH_COLORS[i] : 'var(--ed-ink3)', fontWeight: active === i ? 700 : 400, fontFamily: "'JetBrains Mono', monospace" }}>
                  {c.label} {active === i ? '-- TAKEN' : active > i ? '-- skipped' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '10px 16px', background: 'var(--ed-cream)', borderTop: '1px solid var(--ed-rule)', fontSize: '11px', color: 'var(--ed-ink3)', textAlign: 'center' as const }}>
        Change input values to see how the active branch changes. Python evaluates conditions top to bottom.
      </div>
    </ToolShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL 4 · LOOP TIMELINE SIMULATOR  (loops section)
// ─────────────────────────────────────────────────────────────────────────────

const FOR_ITEMS = [
  { id: '#1001', emoji: '☕', price: '$120.50' },
  { id: '#1002', emoji: '🎧', price: '$89.00' },
  { id: '#1003', emoji: '🎒', price: '$215.75' },
  { id: '#1004', emoji: '🍶', price: '$42.30' },
  { id: '#1005', emoji: '👟', price: '$310.00' },
  { id: '#1006', emoji: '📔', price: '$75.20' },
];

export function LoopSimulator() {
  const [forStep, setForStep] = useState(0);
  const [whileStep, setWhileStep] = useState(0);
  const [forPlaying, setForPlaying] = useState(false);
  const [whilePlaying, setWhilePlaying] = useState(false);
  const forRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const whileRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (forPlaying) {
      forRef.current = setInterval(() => {
        setForStep(s => {
          if (s >= FOR_ITEMS.length - 1) { setForPlaying(false); return s; }
          return s + 1;
        });
      }, 700);
    } else if (forRef.current) clearInterval(forRef.current);
    return () => { if (forRef.current) clearInterval(forRef.current); };
  }, [forPlaying]);

  useEffect(() => {
    if (whilePlaying) {
      whileRef.current = setInterval(() => {
        setWhileStep(s => {
          if (s >= FOR_ITEMS.length - 1) { setWhilePlaying(false); return s; }
          return s + 1;
        });
      }, 700);
    } else if (whileRef.current) clearInterval(whileRef.current);
    return () => { if (whileRef.current) clearInterval(whileRef.current); };
  }, [whilePlaying]);

  return (
    <ToolShell title="Loop Timeline Simulator" subtitle="Visualize repetition. Understand flow. Build intuition.">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
        {/* For Loop */}
        <div style={{ padding: '16px', borderRight: '1px solid var(--ed-rule)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ padding: '4px 10px', borderRadius: '20px', background: `rgba(${ACCENT_RGB},0.15)`, border: `1px solid ${ACCENT}40`, fontSize: '11px', fontWeight: 800, color: ACCENT, fontFamily: "'JetBrains Mono', monospace" }}>For Loop Mode</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)' }}>for ( )</div>
          </div>

          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginBottom: '6px' }}>Iterating through orders</div>
          <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '10px' }}>for i = 0 to orders.length - 1</div>

          {/* Timeline */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' as const, paddingBottom: '8px' }}>
            {FOR_ITEMS.map((item, i) => (
              <div key={i} style={{ flexShrink: 0, textAlign: 'center' as const }}>
                <div style={{ fontSize: '8px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '3px' }}>{i}</div>
                <div style={{ width: 52, padding: '8px 4px', borderRadius: '8px', background: forStep === i ? `rgba(${ACCENT_RGB},0.15)` : 'var(--ed-cream)', border: `2px solid ${forStep === i ? ACCENT : forStep > i ? `rgba(${ACCENT_RGB},0.3)` : 'var(--ed-rule)'}`, cursor: 'pointer', transition: 'all 0.2s', boxShadow: forStep === i ? `0 4px 12px rgba(${ACCENT_RGB},0.2)` : 'none' }} onClick={() => { setForStep(i); setForPlaying(false); }}>
                  <div style={{ fontSize: '16px', marginBottom: '2px' }}>{item.emoji}</div>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: 'var(--ed-ink2)', fontFamily: "'JetBrains Mono', monospace' " }}>Order</div>
                  <div style={{ fontSize: '7px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>{item.id}</div>
                  <div style={{ fontSize: '8px', color: ACCENT, fontWeight: 700 }}>{item.price}</div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: forStep >= i ? ACCENT : 'var(--ed-rule)', margin: '6px auto 0', border: forStep === i ? `2px solid ${ACCENT}` : 'none', boxShadow: forStep === i ? `0 0 6px ${ACCENT}` : 'none' }} />
              </div>
            ))}
          </div>

          {/* Current action */}
          <div style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', fontSize: '10px', color: 'var(--ed-ink2)', fontFamily: "'JetBrains Mono', monospace" }}>
            Processing orders[{forStep}] &#8594; Order {FOR_ITEMS[forStep].id} ({FOR_ITEMS[forStep].price})
          </div>
          <div style={{ marginTop: '8px', padding: '10px', borderRadius: '8px', background: '#0d1117', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#86EFAC', lineHeight: 1.7 }}>
            {'for (i = 0; i < orders.length; i++) {'}<br />
            &nbsp;&nbsp;{'processOrder(orders[i]);'}<br />
            {'}'}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' as const }}>
            <button onClick={() => { setForStep(0); setForPlaying(false); }} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--ed-rule)', background: 'var(--ed-cream)', fontSize: '10px', cursor: 'pointer', color: 'var(--ed-ink2)' }}>&#9664;&#9664; Reset</button>
            <button onClick={() => { setForStep(s => Math.max(0, s - 1)); setForPlaying(false); }} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--ed-rule)', background: 'var(--ed-cream)', fontSize: '10px', cursor: 'pointer', color: 'var(--ed-ink2)' }}>&#9664; Back</button>
            <button onClick={() => { setForStep(s => Math.min(FOR_ITEMS.length - 1, s + 1)); setForPlaying(false); }} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--ed-rule)', background: 'var(--ed-cream)', fontSize: '10px', cursor: 'pointer', color: 'var(--ed-ink2)' }}>Step &#9654;</button>
            <button onClick={() => setForPlaying(p => !p)} style={{ padding: '5px 14px', borderRadius: '6px', background: ACCENT, color: '#fff', border: 'none', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>
              {forPlaying ? 'Pause' : 'Auto Play'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>
            <span>Iteration: {forStep + 1}/{FOR_ITEMS.length}</span>
          </div>
        </div>

        {/* While Loop */}
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', fontSize: '11px', fontWeight: 800, color: '#3B82F6', fontFamily: "'JetBrains Mono', monospace" }}>While Loop Mode</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)' }}>while ( )</div>
          </div>

          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginBottom: '4px' }}>Process orders while condition is true</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)', marginBottom: '10px' }}>while (count &lt; orders.length)</div>

          {/* Condition Gate + Body */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', border: '2px solid rgba(59,130,246,0.4)', textAlign: 'center' as const }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#3B82F6', marginBottom: '4px', textTransform: 'uppercase' as const, fontFamily: "'JetBrains Mono', monospace" }}>Condition Gate</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink2)', marginBottom: '4px' }}>count &lt; orders.length</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 900, color: '#3B82F6' }}>{whileStep} &lt; {FOR_ITEMS.length}</div>
              <div style={{ marginTop: '4px', padding: '2px 10px', borderRadius: '12px', background: whileStep < FOR_ITEMS.length ? `rgba(${ACCENT_RGB},0.2)` : 'rgba(239,68,68,0.2)', display: 'inline-block', fontSize: '10px', fontWeight: 800, color: whileStep < FOR_ITEMS.length ? ACCENT : '#EF4444' }}>
                {whileStep < FOR_ITEMS.length ? 'TRUE' : 'FALSE'}
              </div>
            </div>
            <div style={{ fontSize: '18px', color: 'var(--ed-ink3)' }}>&#8594;</div>
            <div style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(59,130,246,0.08)', border: '2px solid rgba(59,130,246,0.3)', textAlign: 'center' as const }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#3B82F6', marginBottom: '4px', textTransform: 'uppercase' as const, fontFamily: "'JetBrains Mono', monospace" }}>Loop Body</div>
              {whileStep < FOR_ITEMS.length ? (
                <>
                  <div style={{ fontSize: '14px', margin: '4px 0' }}>{FOR_ITEMS[whileStep].emoji}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#3B82F6', fontWeight: 700 }}>Order {FOR_ITEMS[whileStep].id}</div>
                  <div style={{ fontSize: '9px', color: ACCENT, fontWeight: 700 }}>{FOR_ITEMS[whileStep].price}</div>
                </>
              ) : (
                <div style={{ fontSize: '11px', color: ACCENT, fontWeight: 700 }}>Loop Complete</div>
              )}
            </div>
          </div>

          {/* Execution Log */}
          <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', maxHeight: '120px', overflowY: 'auto' as const }}>
            <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: '6px', textTransform: 'uppercase' as const, fontFamily: "'JetBrains Mono', monospace" }}>Execution Log</div>
            {FOR_ITEMS.slice(0, whileStep + 1).map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", color: i === whileStep ? ACCENT : 'var(--ed-ink3)', marginBottom: '2px', fontWeight: i === whileStep ? 700 : 400 }}>
                <span>{i + 1}</span>
                <span>count = {i}</span>
                <span style={{ color: ACCENT, fontWeight: 700 }}>TRUE</span>
                <span>Processed Order {item.id}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' as const }}>
            <button onClick={() => { setWhileStep(0); setWhilePlaying(false); }} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--ed-rule)', background: 'var(--ed-cream)', fontSize: '10px', cursor: 'pointer', color: 'var(--ed-ink2)' }}>&#9664;&#9664; Reset</button>
            <button onClick={() => { setWhileStep(s => Math.max(0, s - 1)); setWhilePlaying(false); }} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--ed-rule)', background: 'var(--ed-cream)', fontSize: '10px', cursor: 'pointer', color: 'var(--ed-ink2)' }}>&#9664; Back</button>
            <button onClick={() => { setWhileStep(s => Math.min(FOR_ITEMS.length, s + 1)); setWhilePlaying(false); }} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--ed-rule)', background: 'var(--ed-cream)', fontSize: '10px', cursor: 'pointer', color: 'var(--ed-ink2)' }}>Step &#9654;</button>
            <button onClick={() => setWhilePlaying(p => !p)} style={{ padding: '5px 14px', borderRadius: '6px', background: '#3B82F6', color: '#fff', border: 'none', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>
              {whilePlaying ? 'Pause' : 'Auto Play'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '10px 16px', background: 'var(--ed-cream)', borderTop: '1px solid var(--ed-rule)', display: 'flex', gap: '24px', flexWrap: 'wrap' as const, fontSize: '11px', color: 'var(--ed-ink3)' }}>
        <span><strong style={{ color: ACCENT }}>for</strong> loops iterate over a sequence a fixed number of times.</span>
        <span><strong style={{ color: '#3B82F6' }}>while</strong> loops continue as long as a condition is True.</span>
      </div>
    </ToolShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL 5 · FUNCTION FLOW AND SCOPE STUDIO  (functions section)
// ─────────────────────────────────────────────────────────────────────────────

const AMOUNT_OPTIONS = [120.00, 89.99, 250.50, 37.49];

export function FunctionFlowStudio() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showComparison, setShowComparison] = useState(true);
  const amount = AMOUNT_OPTIONS[selectedIdx];
  const discountRate = 0.15;
  const discount = +(amount * discountRate).toFixed(2);
  const discountedAmount = +(amount - discount).toFixed(2);

  return (
    <ToolShell title="Function Flow and Scope Studio" subtitle="Visualize. Understand. Reuse.">
      {/* Main flow */}
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 180px', gap: '0', padding: '16px', alignItems: 'center' }}>
        {/* Input */}
        <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <div style={{ fontSize: '9px', fontWeight: 800, color: '#3B82F6', marginBottom: '8px', textTransform: 'uppercase' as const, fontFamily: "'JetBrains Mono', monospace" }}>Input</div>
          <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', marginBottom: '8px' }}>Arguments from caller</div>
          <div style={{ fontSize: '10px', color: '#3B82F6', fontFamily: "'JetBrains Mono', monospace", marginBottom: '6px' }}>amount (number)</div>
          {AMOUNT_OPTIONS.map((a, i) => (
            <div
              key={i} onClick={() => setSelectedIdx(i)}
              style={{ padding: '5px 8px', borderRadius: '6px', background: selectedIdx === i ? 'rgba(59,130,246,0.2)' : 'transparent', border: selectedIdx === i ? '1px solid rgba(59,130,246,0.5)' : '1px solid transparent', marginBottom: '3px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {selectedIdx === i && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3B82F6', flexShrink: 0 }} />}
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: selectedIdx === i ? 800 : 400, color: selectedIdx === i ? '#3B82F6' : 'var(--ed-ink2)' }}>{a.toFixed(2)}</span>
            </div>
          ))}
          <div style={{ marginTop: '8px', padding: '4px 8px', borderRadius: '6px', background: `rgba(${ACCENT_RGB},0.1)`, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT }} />
            <span style={{ fontSize: '9px', color: ACCENT, fontWeight: 700 }}>Live Input</span>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '28px', fontWeight: 900, color: '#3B82F6', marginTop: '8px', textAlign: 'center' as const }}>
            {amount.toFixed(2)}
          </div>
        </div>

        {/* Function Machine */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', padding: '0 16px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: 900, color: 'var(--ed-ink)', marginBottom: '12px' }}>
            apply_discount(<span style={{ color: '#3B82F6' }}>amount</span>)
          </div>
          <div style={{ width: '100%', padding: '16px', borderRadius: '14px', background: '#0d1117', border: '2px solid rgba(124,58,237,0.4)', boxShadow: '0 0 24px rgba(124,58,237,0.15)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: ACCENT, letterSpacing: '0.1em', marginBottom: '10px', textAlign: 'center' as const }}>EXECUTING...</div>
            <div style={{ padding: '10px', borderRadius: '8px', border: '1px dashed rgba(124,58,237,0.5)', background: 'rgba(124,58,237,0.05)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#7C3AED', letterSpacing: '0.08em', marginBottom: '8px' }}>LOCAL SCOPE (inside function) &#x1F512;</div>
              {[
                { name: 'discountRate', type: 'number', value: discountRate.toFixed(2) },
                { name: 'discount', type: 'number', value: discount.toFixed(2) },
                { name: 'discountedAmount', type: 'return', value: discountedAmount.toFixed(2) },
              ].map((v, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '4px' }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#F1F5F9', fontWeight: 700 }}>{v.name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: v.type === 'return' ? '#7C3AED' : 'rgba(241,245,249,0.4)' }}>{v.type}</div>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 800, color: ACCENT }}>{v.value}</div>
                </div>
              ))}
              <div style={{ marginTop: '6px', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'rgba(241,245,249,0.4)', fontStyle: 'italic' }}>
                // Local variables exist only within this function scope
              </div>
            </div>
          </div>
          <div style={{ marginTop: '10px', padding: '6px 14px', borderRadius: '20px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', fontSize: '10px', color: 'var(--ed-ink3)' }}>
            This function can be reused anywhere in your code
          </div>
        </div>

        {/* Output */}
        <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.3)' }}>
          <div style={{ fontSize: '9px', fontWeight: 800, color: '#7C3AED', marginBottom: '8px', textTransform: 'uppercase' as const, fontFamily: "'JetBrains Mono', monospace" }}>Output</div>
          <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', marginBottom: '8px' }}>Return value to caller</div>
          <div style={{ fontSize: '10px', color: '#7C3AED', fontFamily: "'JetBrains Mono', monospace", marginBottom: '8px' }}>discountedAmount</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '32px', fontWeight: 900, color: '#7C3AED', textAlign: 'center' as const, padding: '10px', borderRadius: '8px', background: 'rgba(124,58,237,0.1)' }}>
            {discountedAmount.toFixed(2)}
          </div>
          <div style={{ marginTop: '10px', padding: '8px', borderRadius: '8px', background: `rgba(${ACCENT_RGB},0.1)`, border: `1px solid rgba(${ACCENT_RGB},0.3)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: ACCENT, fontWeight: 700 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: `rgba(${ACCENT_RGB},0.2)`, border: `1px solid ${ACCENT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>&#10003;</div>
              Flow Complete
            </div>
            <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', marginTop: '2px' }}>Return value delivered to caller</div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div style={{ margin: '0 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ed-ink)' }}>Compare View</div>
          <button onClick={() => setShowComparison(c => !c)} style={{ padding: '4px 12px', borderRadius: '20px', background: showComparison ? ACCENT : 'var(--ed-cream)', color: showComparison ? '#fff' : 'var(--ed-ink2)', border: `1px solid ${showComparison ? ACCENT : 'var(--ed-rule)'}`, fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>
            {showComparison ? 'ON' : 'OFF'}
          </button>
        </div>
        {showComparison && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'stretch' }}>
            <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#EF4444', marginBottom: '4px' }}>WITHOUT FUNCTION</div>
              <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', marginBottom: '8px' }}>Same logic written multiple times</div>
              {['discountRate = 0.15', 'discount = amount * discountRate', 'result = amount - discount'].map((line, i) => (
                <div key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#EF4444', marginBottom: '2px' }}>{i + 1} &nbsp; {line}</div>
              ))}
              <div style={{ marginTop: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#EF4444', opacity: 0.6 }}>8 &nbsp; discountRate = 0.15</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#EF4444', opacity: 0.6 }}>9 &nbsp; ... (repeated)</div>
              <div style={{ marginTop: '6px', fontSize: '9px', color: '#EF4444' }}>Update the logic in many places. Easy to miss one.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--ed-ink3)' }}>VS</div>
            <div style={{ padding: '12px', borderRadius: '10px', background: `rgba(${ACCENT_RGB},0.05)`, border: `1px solid rgba(${ACCENT_RGB},0.2)` }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: ACCENT, marginBottom: '4px' }}>WITH FUNCTION</div>
              <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', marginBottom: '8px' }}>Logic defined once, used everywhere</div>
              {['final = apply_discount(120.00)', 'total = apply_discount(89.99)', 'grandTotal = apply_discount(250.50)'].map((line, i) => (
                <div key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: ACCENT, marginBottom: '2px' }}>{i + 1} &nbsp; {line}</div>
              ))}
              <div style={{ marginTop: '6px', padding: '6px 8px', borderRadius: '6px', background: `rgba(${ACCENT_RGB},0.1)`, fontSize: '9px', color: ACCENT }}>One change here updates everywhere it&apos;s used.</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '10px 16px', background: 'var(--ed-cream)', borderTop: '1px solid var(--ed-rule)', display: 'flex', gap: '20px', flexWrap: 'wrap' as const, fontSize: '10px', color: 'var(--ed-ink3)' }}>
        <span>&#9675; Parameters bring data in</span>
        <span>&#9633; Local scope keeps data private</span>
        <span>&#8594; Functions return a value</span>
        <span>&#9851; Reusable code saves time</span>
      </div>
    </ToolShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOL 6 · DATA STRUCTURE DECISION STUDIO  (dataStructures section)
// ─────────────────────────────────────────────────────────────────────────────

const SCENARIOS = [
  { id: 's1', label: 'Order Amounts', preview: '[120.50, 89.00, 120.50, 75.25]', badge: 'Numbers', correct: 'list', reason: 'Ordered, allows duplicates (120.50 appears twice), values change as orders come in.' },
  { id: 's2', label: 'Product Tags', preview: '["sale", "new", "sale", "eco"]', badge: 'Text (may repeat)', correct: 'list', reason: 'Tags have order and can repeat. A set would remove the duplicate "sale".' },
  { id: 's3', label: 'Customer Profile', preview: '{"id": 101, "name": "Aisha", "tier": "Gold"}', badge: 'Key-Value Pairs', correct: 'dict', reason: 'Named fields (id, name, tier) map to their values - that is a dictionary.' },
  { id: 's4', label: 'Delivery Coordinates', preview: '(28.6139, 77.2090)', badge: 'Fixed Pair', correct: 'tuple', reason: 'Coordinates are a fixed pair - order matters, values should never change.' },
  { id: 's5', label: 'Cart Item Names', preview: '["Shirt", "Shoes", "Shirt", "Hat"]', badge: 'Text (ordered)', correct: 'list', reason: 'Cart items have order, can repeat, and change over time - that is a list.' },
  { id: 's6', label: 'Unique Coupon Codes', preview: '{"SAVE10", "WELCOME", "FREESHIP"}', badge: 'Text (unique)', correct: 'set', reason: 'Coupon codes need uniqueness - a set automatically removes duplicates.' },
];

const STRUCTURES = [
  { id: 'list', label: 'List', color: ACCENT, tagline: 'Ordered · Mutable · Duplicates OK', props: ['Preserves order', 'Allows duplicates'], badgeLabel: 'Order preserved' },
  { id: 'tuple', label: 'Tuple', color: '#3B82F6', tagline: 'Ordered · Immutable · Duplicates OK', props: ['Fixed & immutable', 'Good for fixed data'], badgeLabel: 'Fixed & stable' },
  { id: 'set', label: 'Set', color: '#7C3AED', tagline: 'Unordered · Unique · No Duplicates', props: ['Removes duplicates', 'Order not guaranteed'], badgeLabel: 'Only unique values' },
  { id: 'dict', label: 'Dictionary', color: '#CA8A04', tagline: 'Unordered · Key-Value · Unique Keys', props: ['Key → Value mapping', 'Fast lookup by key'], badgeLabel: 'Key-Value mapping' },
];

export function DataStructureStudio() {
  const [selected, setSelected] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean | null>>({});

  const tryPlace = (scenarioId: string, structureId: string) => {
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;
    const isCorrect = scenario.correct === structureId;
    setPlacements(p => ({ ...p, [scenarioId]: structureId }));
    setFeedback(f => ({ ...f, [scenarioId]: isCorrect }));
    setSelected(null);
  };

  const score = Object.values(feedback).filter(v => v === true).length;
  const total = SCENARIOS.length;

  return (
    <ToolShell title="Data Structure Decision Studio" subtitle="Drag data scenarios into the right structure">
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '0', minHeight: '340px' }}>
        {/* Scenarios */}
        <div style={{ padding: '16px', borderRight: '1px solid var(--ed-rule)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '10px', textTransform: 'uppercase' as const }}>Data Scenarios</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
            {SCENARIOS.map(s => {
              const placed = placements[s.id];
              const isCorrect = feedback[s.id];
              return (
                <div
                  key={s.id}
                  onClick={() => !placed && setSelected(sel => sel === s.id ? null : s.id)}
                  style={{ padding: '8px 10px', borderRadius: '8px', background: placed ? (isCorrect ? `rgba(${ACCENT_RGB},0.08)` : 'rgba(239,68,68,0.08)') : selected === s.id ? 'rgba(59,130,246,0.1)' : 'var(--ed-cream)', border: `1px solid ${placed ? (isCorrect ? ACCENT : '#EF4444') : selected === s.id ? '#3B82F6' : 'var(--ed-rule)'}`, cursor: placed ? 'default' : 'pointer', transition: 'all 0.15s' }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '2px' }}>{s.label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{s.preview}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '8px', padding: '2px 6px', borderRadius: '10px', background: 'var(--ed-rule)', color: 'var(--ed-ink3)', fontWeight: 600 }}>{s.badge}</span>
                    {placed && <span style={{ fontSize: '8px', fontWeight: 700, color: isCorrect ? ACCENT : '#EF4444' }}>{isCorrect ? '&#10003; correct' : '&#10007; try again'}</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: '10px', padding: '8px', borderRadius: '8px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', fontSize: '10px', color: 'var(--ed-ink3)' }}>
            Score: <strong style={{ color: ACCENT }}>{score}</strong> / {total} correct
          </div>
        </div>

        {/* Structures */}
        <div style={{ padding: '16px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '10px', textTransform: 'uppercase' as const }}>
            {selected ? `Click a structure to place "${SCENARIOS.find(s => s.id === selected)?.label}"` : 'Select a scenario then click a structure'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {STRUCTURES.map(st => {
              const placedHere = SCENARIOS.filter(s => placements[s.id] === st.id);
              return (
                <div
                  key={st.id}
                  onClick={() => selected && tryPlace(selected, st.id)}
                  style={{ padding: '14px', borderRadius: '12px', background: selected ? `${st.color}10` : 'var(--ed-cream)', border: `2px solid ${selected ? st.color + '60' : 'var(--ed-rule)'}`, cursor: selected ? 'pointer' : 'default', transition: 'all 0.15s', boxShadow: selected ? `0 4px 16px ${st.color}20` : 'none' }}
                >
                  <div style={{ fontSize: '16px', fontWeight: 900, color: st.color, fontFamily: "'Lora', serif", marginBottom: '2px' }}>{st.label}</div>
                  <div style={{ fontSize: '9px', color: 'var(--ed-ink3)', marginBottom: '8px' }}>{st.tagline}</div>
                  {st.props.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: st.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '9px', color: 'var(--ed-ink3)' }}>{p}</span>
                    </div>
                  ))}
                  {placedHere.length > 0 && (
                    <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap' as const, gap: '4px' }}>
                      {placedHere.map(s => (
                        <div key={s.id} style={{ padding: '2px 8px', borderRadius: '10px', background: feedback[s.id] ? `rgba(${ACCENT_RGB},0.15)` : 'rgba(239,68,68,0.15)', border: `1px solid ${feedback[s.id] ? ACCENT : '#EF4444'}`, fontSize: '9px', fontWeight: 700, color: feedback[s.id] ? ACCENT : '#EF4444' }}>
                          {s.label}
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ marginTop: '8px', padding: '4px 8px', borderRadius: '20px', background: `${st.color}15`, display: 'inline-block', fontSize: '9px', fontWeight: 700, color: st.color }}>{st.badgeLabel}</div>
                </div>
              );
            })}
          </div>

          {/* Show feedback for last placed */}
          {selected === null && Object.keys(feedback).length > 0 && (() => {
            const last = Object.keys(feedback).at(-1);
            if (!last) return null;
            const s = SCENARIOS.find(sc => sc.id === last);
            if (!s) return null;
            return (
              <div style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '8px', background: feedback[last] ? `rgba(${ACCENT_RGB},0.08)` : 'rgba(239,68,68,0.08)', border: `1px solid ${feedback[last] ? ACCENT : '#EF4444'}30`, fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.6 }}>
                <strong style={{ color: feedback[last] ? ACCENT : '#EF4444' }}>{s.label}: </strong>{s.reason}
              </div>
            );
          })()}
        </div>
      </div>

      <div style={{ padding: '10px 16px', background: 'var(--ed-cream)', borderTop: '1px solid var(--ed-rule)', display: 'flex', gap: '16px', flexWrap: 'wrap' as const, fontSize: '10px', color: 'var(--ed-ink3)' }}>
        {STRUCTURES.map(st => (
          <span key={st.id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '2px', background: st.color }} />
            <strong style={{ color: st.color }}>{st.label}</strong>&nbsp;{st.tagline.split(' · ')[0]}
          </span>
        ))}
        <button onClick={() => { setPlacements({}); setFeedback({}); setSelected(null); }} style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: '6px', border: '1px solid var(--ed-rule)', background: 'var(--ed-bg)', fontSize: '10px', cursor: 'pointer', color: 'var(--ed-ink3)' }}>Reset Lab</button>
      </div>
    </ToolShell>
  );
}

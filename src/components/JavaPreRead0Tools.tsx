'use client';

/**
 * JavaPreRead0Tools — 3D educational visuals + IDE simulator for Java Pre-Read 00.
 * All visuals are interactive and teach concrete Java concepts.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT = '#3B82F6';   // Java blue
const V_ACC  = '#7843EE';   // violet (Kavya)
const sp = { type: 'spring' as const, stiffness: 300, damping: 24 };

// ─── Shared primitives ───────────────────────────────────────────────────────

const TiltCard = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });
  return (
    <div
      onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); const x = (e.clientX-r.left)/r.width-0.5; const y = (e.clientY-r.top)/r.height-0.5; setTilt({ x: y*-6, y: x*6, scale: 1.012 }); }}
      onMouseLeave={() => setTilt({ x:0, y:0, scale:1 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`, transition: 'transform 0.18s ease', ...style }}
    >{children}</div>
  );
};

const ToolShell = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
  <TiltCard style={{ margin: '32px 0' }}>
    <div style={{ borderRadius: '16px', overflow: 'hidden', border: `1px solid ${ACCENT}28`, boxShadow: `0 8px 40px rgba(0,0,0,0.14), 0 2px 8px ${ACCENT}12`, background: 'var(--ed-card)' }}>
      <div style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0f172a 100%)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: '5px' }}>{['#ff5f57','#ffbd2e','#28c840'].map(c => <div key={c} style={{ width:10,height:10,borderRadius:'50%',background:c }} />)}</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize:11, color:'#94a3b8', flex:1 }}>{title}</div>
        <div style={{ fontSize:10, color:`${ACCENT}99`, fontFamily:"'JetBrains Mono',monospace" }}>{subtitle}</div>
      </div>
      <div style={{ padding:'20px' }}>{children}</div>
    </div>
  </TiltCard>
);

const Chip = ({ label, active, accent, onClick }: { label: string; active: boolean; accent: string; onClick: () => void }) => (
  <motion.button onClick={onClick} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
    style={{ padding:'6px 12px', borderRadius:'8px', cursor:'pointer', fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:800,
      background: active ? `linear-gradient(145deg,${accent}cc,${accent})` : 'var(--ed-card)',
      border: `1.5px solid ${active ? accent : `${accent}28`}`,
      color: active ? '#fff' : accent,
    }}>
    {label}
  </motion.button>
);

// ─── 1. JAVA RUNTIME CONVEYOR ────────────────────────────────────────────────
// Visual: source.java → javac compiler → .class bytecode → JVM chamber → output

const PIPELINE_STEPS = [
  { id: 'write',    label: 'Write',    desc: 'Developer writes Main.java source code',         icon: '📝', color: '#3B82F6' },
  { id: 'compile',  label: 'Compile',  desc: 'javac checks types and produces .class bytecode',icon: '⚙',  color: '#7843EE' },
  { id: 'bytecode', label: 'Bytecode', desc: '.class files contain platform-neutral instructions', icon: '📦', color: '#D97706' },
  { id: 'jvm',      label: 'JVM',      desc: 'JVM loads bytecode, allocates stack and heap',   icon: '🔮', color: '#0097A7' },
  { id: 'output',   label: 'Output',   desc: 'Console prints the result',                       icon: '✅', color: '#16A34A' },
];

export function JavaRuntimeConveyor() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState(false);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function runPipeline(withError: boolean) {
    if (running) return;
    timers.current.forEach(clearTimeout); timers.current = [];
    setRunning(true); setError(false); setStep(0);
    const limit = withError ? 2 : PIPELINE_STEPS.length;
    PIPELINE_STEPS.slice(0, limit).forEach((_, i) => {
      const t = setTimeout(() => {
        setStep(i);
        if (withError && i === limit - 1) setError(true);
        if (i === limit - 1) { const ct = setTimeout(() => setRunning(false), 600); timers.current.push(ct); }
      }, i * 700);
      timers.current.push(t);
    });
  }

  return (
    <ToolShell title="JavaRuntimeConveyor.java" subtitle="Source → JVM → Output">
      {/* Controls */}
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <motion.button onClick={() => runPipeline(false)} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
          style={{ padding:'8px 18px', borderRadius:10, cursor:'pointer', background:`linear-gradient(145deg,#4ade80,#16A34A)`, color:'#fff', border:'none', fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:800 }}>
          ▶ Run Valid Program
        </motion.button>
        <motion.button onClick={() => runPipeline(true)} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
          style={{ padding:'8px 18px', borderRadius:10, cursor:'pointer', background:`linear-gradient(145deg,#f87171,#EF4444)`, color:'#fff', border:'none', fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:800 }}>
          ⚡ Trigger Compile Error
        </motion.button>
      </div>

      {/* Pipeline */}
      <div style={{ display:'flex', alignItems:'center', gap:0, perspective:'800px' }}>
        {PIPELINE_STEPS.map((s, i) => {
          const isPast  = step > i;
          const isCur   = step === i;
          const blocked = error && i >= 2;
          const color   = blocked ? '#EF4444' : s.color;
          return (
            <React.Fragment key={s.id}>
              <motion.div
                animate={{ scale: isCur ? 1.08 : 1, y: isCur ? -6 : 0,
                  boxShadow: isCur ? `0 16px 32px ${color}40` : isPast ? `0 6px 12px ${color}20` : 'none' }}
                transition={sp}
                style={{
                  flex:1, padding:'14px 8px', borderRadius:14, textAlign:'center' as const,
                  background: (isCur || isPast) && !blocked
                    ? `linear-gradient(145deg, ${color}22, ${color}12)` : 'var(--ed-cream)',
                  border: `2px solid ${(isCur || isPast) && !blocked ? color : `${color}20`}`,
                  opacity: running && !isCur && !isPast ? 0.35 : 1,
                }}
              >
                <div style={{ fontSize:22, marginBottom:6 }}>{blocked ? '✗' : isPast ? '✓' : s.icon}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color, marginBottom:4, letterSpacing:'0.08em' }}>{s.label}</div>
                <div style={{ fontSize:9, color:'var(--ed-ink3)', lineHeight:1.5 }}>
                  {blocked ? 'Caught at compile-time — JVM never sees this code' : s.desc}
                </div>
                {isCur && !blocked && <motion.div animate={{ scale:[1,1.4,1], opacity:[1,0.6,1] }} transition={{ duration:0.6, repeat:Infinity }}
                  style={{ width:8, height:8, borderRadius:'50%', background:color, margin:'8px auto 0', boxShadow:`0 0 10px ${color}` }} />}
              </motion.div>
              {i < PIPELINE_STEPS.length - 1 && (
                <div style={{ width:24, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="24" height="16"><path d={`M2 8 H16 M12 3 L20 8 L12 13`} stroke={isPast && !error ? '#16A34A' : '#94a3b8'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Teaching label */}
      <AnimatePresence mode="wait">
        {step >= 0 && running && (
          <motion.div key={step} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.25 }}
            style={{ marginTop:14, padding:'10px 14px', borderRadius:10, background: error && step>=2 ? '#EF444410' : `${PIPELINE_STEPS[step]?.color || ACCENT}0d`,
              border: `1px solid ${error && step>=2 ? '#EF444428' : `${PIPELINE_STEPS[step]?.color || ACCENT}28`}`,
              fontFamily:"'JetBrains Mono',monospace", fontSize:10, color: error && step>=2 ? '#EF4444' : PIPELINE_STEPS[step]?.color }}>
            {error && step >= 2 ? '⚠ Compile-time error: caught before JVM — bug stops here, not in production' : PIPELINE_STEPS[step]?.desc}
          </motion.div>
        )}
      </AnimatePresence>
    </ToolShell>
  );
}

// ─── 2. STACK & HEAP MEMORY THEATER ──────────────────────────────────────────

type MemOp = 'int' | 'string' | 'object' | 'copy' | 'mutate';
interface StackSlot { name: string; type: string; value: string; color: string; refId?: string }
interface HeapObj  { id: string; type: string; fields: { k: string; v: string }[]; color: string }

const MEM_OPS: { id: MemOp; label: string; desc: string; color: string }[] = [
  { id:'int',    label:'int amount = 500',       desc:'Primitive — value stored directly in stack slot', color:'#3B82F6' },
  { id:'string', label:'String cur = "INR"',     desc:'Reference — String object lives on heap',        color:'#7843EE' },
  { id:'object', label:'new Transaction(...)',    desc:'Object created on heap, reference in stack',     color:'#0097A7' },
  { id:'copy',   label:'Transaction copy = tx',  desc:'Two stack references point to the same object',  color:'#D97706' },
  { id:'mutate', label:'tx.amount = 200000',     desc:'Mutating via either reference changes the object', color:'#E8875A' },
];

export function StackHeapTheater() {
  const [stack, setStack] = useState<StackSlot[]>([]);
  const [heap,  setHeap]  = useState<HeapObj[]>([]);
  const [last,  setLast]  = useState<MemOp | null>(null);

  function apply(op: MemOp) {
    setLast(op);
    if (op === 'int')    setStack(s => [...s, { name:'amount', type:'int',    value:'500',   color:'#3B82F6' }]);
    if (op === 'string') { setStack(s => [...s, { name:'currency', type:'String', value:'→ heap', color:'#7843EE', refId:'str1' }]); setHeap(h => [...h, { id:'str1', type:'String', fields:[{k:'value',v:'"INR"'}], color:'#7843EE' }]); }
    if (op === 'object') { setStack(s => [...s, { name:'tx', type:'Transaction', value:'→ heap', color:'#0097A7', refId:'obj1' }]); setHeap(h => [...h, { id:'obj1', type:'Transaction', fields:[{k:'id',v:'"TX-1001"'},{k:'amount',v:'150000'},{k:'currency',v:'"USD"'}], color:'#0097A7' }]); }
    if (op === 'copy')   setStack(s => [...s, { name:'copy', type:'Transaction', value:'→ heap', color:'#D97706', refId:'obj1' }]);
    if (op === 'mutate') setHeap(h => h.map(o => o.id==='obj1' ? { ...o, fields: o.fields.map(f => f.k==='amount' ? {k:'amount',v:'200000'} : f) } : o));
  }

  function reset() { setStack([]); setHeap([]); setLast(null); }

  return (
    <ToolShell title="StackHeapTheater.java" subtitle="Primitives vs References">
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const, marginBottom:16 }}>
        {MEM_OPS.map(op => <Chip key={op.id} label={op.label} active={last===op.id} accent={op.color} onClick={() => apply(op.id)} />)}
        <motion.button onClick={reset} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
          style={{ padding:'6px 12px', borderRadius:8, cursor:'pointer', background:'var(--ed-cream)', border:'1px solid var(--ed-rule)', fontSize:10, color:'var(--ed-ink3)', fontFamily:"'JetBrains Mono',monospace" }}>↺</motion.button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Stack */}
        <div style={{ borderRadius:12, border:'1.5px solid #3B82F620', background:'rgba(59,130,246,0.04)', padding:14 }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:'#3B82F6', letterSpacing:'0.12em', marginBottom:10 }}>STACK (local variables)</div>
          <div style={{ display:'flex', flexDirection:'column' as const, gap:6 }}>
            <AnimatePresence>
              {stack.map((slot, i) => (
                <motion.div key={i} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }} transition={sp}
                  style={{ padding:'8px 10px', borderRadius:8, background:`${slot.color}12`, border:`1.5px solid ${slot.color}28`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:slot.color, fontWeight:700 }}>{slot.type}</div>
                    <div style={{ fontSize:11, fontWeight:700, color:'var(--ed-ink)' }}>{slot.name}</div>
                  </div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:slot.refId ? '#D97706' : slot.color, fontWeight:700 }}>{slot.value}</div>
                </motion.div>
              ))}
            </AnimatePresence>
            {stack.length === 0 && <div style={{ fontSize:10, color:'var(--ed-ink3)', fontStyle:'italic', textAlign:'center' as const, padding:'12px 0' }}>Click an operation above</div>}
          </div>
        </div>

        {/* Heap */}
        <div style={{ borderRadius:12, border:'1.5px solid #7843EE20', background:'rgba(120,67,238,0.04)', padding:14 }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:'#7843EE', letterSpacing:'0.12em', marginBottom:10 }}>HEAP (objects)</div>
          <div style={{ display:'flex', flexDirection:'column' as const, gap:6 }}>
            <AnimatePresence>
              {heap.map(obj => (
                <motion.div key={obj.id} initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }} transition={sp}
                  style={{ padding:'8px 10px', borderRadius:8, background:`${obj.color}10`, border:`1.5px solid ${obj.color}28` }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:obj.color, fontWeight:800, marginBottom:6 }}>{obj.type} #{obj.id}</div>
                  {obj.fields.map(f => (
                    <div key={f.k} style={{ display:'flex', gap:8, fontSize:10, color:'var(--ed-ink2)' }}>
                      <span style={{ color:'var(--ed-ink3)', minWidth:60 }}>{f.k}:</span>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", color: last==='mutate' && f.k==='amount' ? '#E8875A' : 'var(--ed-ink)' }}>{f.v}</span>
                    </div>
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>
            {heap.length === 0 && <div style={{ fontSize:10, color:'var(--ed-ink3)', fontStyle:'italic', textAlign:'center' as const, padding:'12px 0' }}>No heap objects yet</div>}
          </div>
        </div>
      </div>

      {last && (
        <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
          style={{ marginTop:12, padding:'8px 12px', borderRadius:8, background:`${MEM_OPS.find(o=>o.id===last)?.color ?? ACCENT}0d`,
            border:`1px solid ${MEM_OPS.find(o=>o.id===last)?.color ?? ACCENT}28`, fontSize:11, color:'var(--ed-ink2)' }}>
          {MEM_OPS.find(o=>o.id===last)?.desc}
        </motion.div>
      )}
    </ToolShell>
  );
}

// ─── 3. BUSINESS RULE GATE ───────────────────────────────────────────────────

export function BusinessRuleGate() {
  const [amount,   setAmount]   = useState(50000);
  const [currency, setCurrency] = useState('INR');

  const highVal  = amount > 100000;
  const intl     = currency !== 'INR';
  const risk     = highVal && intl ? 'HIGH — REVIEW' : highVal ? 'ELEVATED — DOMESTIC' : 'NORMAL — PASS';
  const riskColor = highVal && intl ? '#EF4444' : highVal ? '#D97706' : '#16A34A';

  const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'SGD'];

  return (
    <ToolShell title="BusinessRuleGate.java" subtitle="if / else — product rules as executable gates">
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:16 }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:'var(--ed-ink3)', marginBottom:8, letterSpacing:'0.1em' }}>
            AMOUNT: ₹{amount.toLocaleString()}
          </div>
          <input type="range" min={0} max={500000} step={5000} value={amount} onChange={e => setAmount(+e.target.value)}
            style={{ width:'100%', accentColor: ACCENT }} />
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:'var(--ed-ink3)', marginTop:4, fontFamily:"'JetBrains Mono',monospace" }}>
            <span>₹0</span><span style={{ color:amount>100000?'#D97706':undefined }}>₹1,00,000 threshold</span><span>₹5,00,000</span>
          </div>
        </div>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:'var(--ed-ink3)', marginBottom:8, letterSpacing:'0.1em' }}>CURRENCY</div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const }}>
            {CURRENCIES.map(c => <Chip key={c} label={c} active={currency===c} accent={c==='INR'?'#16A34A':'#3B82F6'} onClick={() => setCurrency(c)} />)}
          </div>
        </div>
      </div>

      {/* Code block showing active branch */}
      <div style={{ borderRadius:10, overflow:'hidden', marginBottom:14, border:'1px solid rgba(255,255,255,0.06)' }}>
        <pre style={{ background:'#0f172a', color:'#94a3b8', fontFamily:"'JetBrains Mono',monospace", fontSize:12, lineHeight:1.9, padding:'16px 20px', margin:0, overflowX:'auto' as const }}>
{`if (`}<span style={{ color: highVal ? '#f472b6' : '#64748b' }}>{`amount > 100000`}</span>{` && `}<span style={{ color: intl ? '#f472b6' : '#64748b' }}>{`!currency.equals("INR")`}</span>{`) {
    riskLevel = `}<span style={{ color:'#EF4444', fontWeight:700 }}>{`"HIGH"`}</span>{`;   // → `}<span style={{ color:highVal&&intl?'#EF4444':'#64748b', fontWeight:700 }}>ACTIVE PATH</span>{`
} else if (`}<span style={{ color: highVal && !intl ? '#f472b6' : '#64748b' }}>{`amount > 100000`}</span>{`) {
    riskLevel = `}<span style={{ color:'#D97706' }}>{`"ELEVATED"`}</span>{`;  // → `}<span style={{ color:highVal&&!intl?'#D97706':'#64748b', fontWeight:700 }}>ACTIVE PATH</span>{`
} else {
    riskLevel = `}<span style={{ color:'#16A34A' }}>{`"NORMAL"`}</span>{`;    // → `}<span style={{ color:!highVal?'#16A34A':'#64748b', fontWeight:700 }}>ACTIVE PATH</span>{`
}`}
        </pre>
      </div>

      {/* Result */}
      <motion.div animate={{ background:`${riskColor}12`, borderColor:`${riskColor}30` }} transition={{ duration:0.3 }}
        style={{ padding:'12px 18px', borderRadius:12, border:'1.5px solid', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:'var(--ed-ink3)' }}>riskLevel =</div>
        <motion.div key={risk} initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
          style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:900, color:riskColor }}>
          "{risk}"
        </motion.div>
      </motion.div>
    </ToolShell>
  );
}

// ─── 4. COLLECTION PROCESSING FACTORY ───────────────────────────────────────

interface TxCard { id: string; amount: number; currency: string; result?: string }

const FACTORY_TRANSACTIONS: TxCard[] = [
  { id:'TX-1001', amount:150000, currency:'USD' },
  { id:'TX-1002', amount:9000,   currency:'INR' },
  { id:'TX-1003', amount:220000, currency:'EUR' },
  { id:'TX-1004', amount:3500,   currency:'INR' },
  { id:'TX-1005', amount:75000,  currency:'SGD' },
];

function classifyTx(tx: TxCard): string {
  if (tx.amount > 100000 && tx.currency !== 'INR') return 'REVIEW';
  return 'APPROVED';
}

export function CollectionProcessingFactory() {
  const [txs, setTxs] = useState<TxCard[]>(FACTORY_TRANSACTIONS.map(t => ({...t})));
  const [curIdx, setCurIdx] = useState(-1);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function run() {
    if (running) return;
    timers.current.forEach(clearTimeout); timers.current = [];
    setRunning(true);
    setTxs(FACTORY_TRANSACTIONS.map(t => ({...t})));
    setCurIdx(-1);

    txs.forEach((_, i) => {
      const t = setTimeout(() => {
        setCurIdx(i);
        setTxs(prev => prev.map((tx, idx) => idx === i ? { ...tx, result: classifyTx(tx) } : tx));
        if (i === FACTORY_TRANSACTIONS.length - 1) {
          const ct = setTimeout(() => setRunning(false), 600);
          timers.current.push(ct);
        }
      }, i * 700 + 200);
      timers.current.push(t);
    });
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    setTxs(FACTORY_TRANSACTIONS.map(t => ({...t})));
    setCurIdx(-1); setRunning(false);
  }

  const processed = txs.filter(t => t.result).length;

  return (
    <ToolShell title="CollectionFactory.java" subtitle="for (Transaction tx : transactions)">
      <div style={{ display:'flex', gap:10, marginBottom:16, alignItems:'center' }}>
        <motion.button onClick={run} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }} disabled={running}
          style={{ padding:'8px 18px', borderRadius:10, cursor:running?'not-allowed':'pointer', background:`linear-gradient(145deg,#4ade80,#16A34A)`, color:'#fff', border:'none', fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:800 }}>
          ▶ Process List
        </motion.button>
        <motion.button onClick={reset} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
          style={{ padding:'8px 14px', borderRadius:10, cursor:'pointer', background:'var(--ed-cream)', border:'1px solid var(--ed-rule)', fontSize:10, color:'var(--ed-ink3)', fontFamily:"'JetBrains Mono',monospace" }}>
          ↺ Reset
        </motion.button>
        <div style={{ marginLeft:'auto', fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:ACCENT }}>{processed}/{txs.length} processed</div>
      </div>

      {/* Active code line */}
      <div style={{ borderRadius:8, background:'#0f172a', padding:'10px 16px', marginBottom:14, fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:'#94a3b8' }}>
        {'for ('}
        <span style={{ color: curIdx >= 0 ? '#34d399' : '#64748b', fontWeight:700 }}>Transaction tx</span>
        {' : '}
        <span style={{ color: ACCENT }}>transactions</span>
        {') { classify('}
        <span style={{ color: curIdx >= 0 ? '#34d399' : '#64748b' }}>tx</span>
        {'); }'}
        {curIdx >= 0 && <span style={{ marginLeft:16, color:'#D97706' }}>← tx = {txs[curIdx]?.id}</span>}
      </div>

      {/* Transaction cards */}
      <div style={{ display:'flex', flexDirection:'column' as const, gap:6 }}>
        {txs.map((tx, i) => {
          const isCur = i === curIdx;
          const done  = !!tx.result;
          const rc    = tx.result === 'REVIEW' ? '#EF4444' : '#16A34A';
          return (
            <motion.div key={tx.id}
              animate={{ scale: isCur ? 1.025 : 1, x: isCur ? 6 : 0,
                boxShadow: isCur ? `0 6px 20px ${ACCENT}35` : done ? `0 2px 6px ${rc}18` : 'none' }}
              transition={sp}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderRadius:10,
                background: isCur ? `${ACCENT}0d` : done ? `${rc}08` : 'var(--ed-cream)',
                border: `1.5px solid ${isCur ? ACCENT : done ? rc+'28' : 'var(--ed-rule)'}` }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color: isCur ? ACCENT : 'var(--ed-ink3)', minWidth:80 }}>{tx.id}</div>
              <div style={{ fontSize:10, color:'var(--ed-ink2)', flex:1 }}>₹{tx.amount.toLocaleString()} · {tx.currency}</div>
              {done && (
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={sp}
                  style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:rc, background:`${rc}14`, padding:'2px 8px', borderRadius:6 }}>
                  {tx.result}
                </motion.div>
              )}
              {isCur && !done && <motion.div animate={{ scale:[1,1.3,1], opacity:[1,0.5,1] }} transition={{ duration:0.5, repeat:Infinity }}
                style={{ width:8, height:8, borderRadius:'50%', background:ACCENT, boxShadow:`0 0 8px ${ACCENT}` }} />}
            </motion.div>
          );
        })}
      </div>
    </ToolShell>
  );
}

// ─── 5. CLASS BLUEPRINT ASSEMBLER ────────────────────────────────────────────

type Piece = 'field-id' | 'field-amount' | 'field-currency' | 'constructor' | 'method';
const PIECES: { id: Piece; label: string; code: string; color: string; desc: string }[] = [
  { id:'field-id',       label:'+ id field',       code:'String id;',                           color:'#3B82F6', desc:'Field: id stores the transaction identifier' },
  { id:'field-amount',   label:'+ amount field',    code:'int amount;',                          color:'#3B82F6', desc:'Field: amount stores the transaction value' },
  { id:'field-currency', label:'+ currency field',  code:'String currency;',                     color:'#3B82F6', desc:'Field: currency stores the currency code' },
  { id:'constructor',    label:'+ constructor',     code:'Transaction(id, amount, currency)',     color:'#7843EE', desc:'Constructor: creates a valid Transaction instance' },
  { id:'method',         label:'+ method',          code:'boolean requiresReview() { ... }',     color:'#0097A7', desc:'Method: behaviour attached to this object' },
];

export function ClassBlueprintAssembler() {
  const [added, setAdded] = useState<Set<Piece>>(new Set());

  function add(id: Piece) { setAdded(s => new Set([...s, id])); }

  const hasAllFields = (['field-id','field-amount','field-currency'] as Piece[]).every(p => added.has(p));
  const hasConstructor = added.has('constructor');
  const hasMethod = added.has('method');

  return (
    <ToolShell title="ClassBlueprintAssembler.java" subtitle="class Transaction { ... }">
      {/* Palette */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const, marginBottom:16 }}>
        {PIECES.map(p => (
          <Chip key={p.id} label={p.label} active={added.has(p.id)} accent={p.color}
            onClick={() => !added.has(p.id) && add(p.id)} />
        ))}
        <Chip label="↺ Reset" active={false} accent="#94a3b8" onClick={() => setAdded(new Set())} />
      </div>

      {/* Blueprint */}
      <div style={{ borderRadius:10, overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ background:'#0f172a', padding:'16px 20px', fontFamily:"'JetBrains Mono',monospace", fontSize:12, lineHeight:2, color:'#94a3b8' }}>
          <div style={{ color:'#60a5fa' }}>{'class '}<span style={{ color:'#34d399' }}>Transaction</span>{' {'}</div>
          <AnimatePresence>
            {(['field-id','field-amount','field-currency'] as Piece[]).map(id => added.has(id) && (
              <motion.div key={id} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} style={{ paddingLeft:24, color:'#86efac' }}>
                {PIECES.find(p=>p.id===id)?.code}
              </motion.div>
            ))}
            {added.has('constructor') && (
              <motion.div initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} style={{ paddingLeft:24, color:'#c084fc' }}>
                {'Transaction(String id, int amount, String currency) { ... }'}
              </motion.div>
            )}
            {added.has('method') && (
              <motion.div initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} style={{ paddingLeft:24, color:'#67e8f9' }}>
                {'boolean requiresReview() { return amount > 100000; }'}
              </motion.div>
            )}
          </AnimatePresence>
          <div style={{ color:'#60a5fa' }}>{'}'}</div>
        </div>
      </div>

      {/* Status */}
      <div style={{ marginTop:12, display:'flex', gap:8, flexWrap:'wrap' as const }}>
        {[
          { label:'Fields defined', done: hasAllFields,    color:'#3B82F6' },
          { label:'Constructor added', done: hasConstructor, color:'#7843EE' },
          { label:'Method attached', done: hasMethod,       color:'#0097A7' },
        ].map(s => (
          <div key={s.label} style={{ padding:'4px 10px', borderRadius:7, background:`${s.color}${s.done?'14':'0a'}`, border:`1px solid ${s.color}${s.done?'35':'18'}`, fontSize:10, color:s.done?s.color:'var(--ed-ink3)', fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>
            {s.done ? '✓ ' : '○ '}{s.label}
          </div>
        ))}
      </div>

      {hasAllFields && hasConstructor && (
        <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
          style={{ marginTop:10, padding:'8px 12px', borderRadius:8, background:'#16A34A0d', border:'1px solid #16A34A28', fontSize:11, color:'#16A34A' }}>
          ✓ Ready to instantiate: <span style={{ fontFamily:"'JetBrains Mono',monospace" }}>new Transaction("TX-1001", 150000, "USD")</span>
        </motion.div>
      )}
    </ToolShell>
  );
}

// ─── 6. EXCEPTION RUNWAY ─────────────────────────────────────────────────────

export function ExceptionRunway() {
  const [blankId,    setBlankId]    = useState(false);
  const [negAmount,  setNegAmount]  = useState(false);
  const [phase, setPhase] = useState<'idle'|'validating'|'passed'|'thrown'>('idle');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function runValidation() {
    timers.current.forEach(clearTimeout); timers.current = [];
    setPhase('validating');
    const t = setTimeout(() => setPhase(blankId || negAmount ? 'thrown' : 'passed'), 900);
    timers.current.push(t);
  }
  function reset() { setPhase('idle'); timers.current.forEach(clearTimeout); }

  const thrownMsg = blankId ? 'IllegalArgumentException: Transaction id is required' : 'IllegalArgumentException: Amount cannot be negative';

  return (
    <ToolShell title="ExceptionRunway.java" subtitle="validate() — fail early, fail clearly">
      {/* Controls */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        {[
          { label:'Blank transaction ID', value:blankId, set:setBlankId, color:'#EF4444' },
          { label:'Negative amount (-500)', value:negAmount, set:setNegAmount, color:'#D97706' },
        ].map(ctrl => (
          <div key={ctrl.label} onClick={() => { ctrl.set(!ctrl.value); reset(); }}
            style={{ padding:'10px 14px', borderRadius:10, cursor:'pointer',
              background: ctrl.value ? `${ctrl.color}12` : 'var(--ed-cream)',
              border: `1.5px solid ${ctrl.value ? ctrl.color+'40' : 'var(--ed-rule)'}`,
              display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:16, height:16, borderRadius:4, background: ctrl.value ? ctrl.color : 'var(--ed-rule)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {ctrl.value && <span style={{ fontSize:10, color:'#fff', fontWeight:700 }}>✓</span>}
            </div>
            <div style={{ fontSize:11, fontWeight:600, color: ctrl.value ? ctrl.color : 'var(--ed-ink2)' }}>{ctrl.label}</div>
          </div>
        ))}
      </div>

      {/* Code */}
      <div style={{ borderRadius:8, background:'#0f172a', padding:'12px 16px', marginBottom:14, fontFamily:"'JetBrains Mono',monospace", fontSize:12, lineHeight:1.9, color:'#94a3b8' }}>
        {'static void validate(Transaction tx) {'}
        <br />
        {'  if ('}
        <span style={{ color: blankId ? '#f87171' : '#64748b' }}>{'tx.id == null || tx.id.isBlank()'}</span>
        {') {'}<br />
        {'    '}
        <span style={{ color: blankId ? '#f87171' : '#64748b' }}>{'throw new IllegalArgumentException("Transaction id is required");'}</span>
        <br />{'  }'}<br />
        {'  if ('}
        <span style={{ color: negAmount ? '#fbbf24' : '#64748b' }}>{'tx.amount < 0'}</span>
        {') {'}<br />
        {'    '}
        <span style={{ color: negAmount ? '#fbbf24' : '#64748b' }}>{'throw new IllegalArgumentException("Amount cannot be negative");'}</span>
        <br />{'  }'}<br />
        {'}'}
      </div>

      <div style={{ display:'flex', gap:10, marginBottom:14 }}>
        <motion.button onClick={runValidation} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
          style={{ padding:'8px 18px', borderRadius:10, cursor:'pointer', background:`linear-gradient(145deg,${blankId||negAmount?'#f87171,#EF4444':'#4ade80,#16A34A'})`, color:'#fff', border:'none', fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:800 }}>
          ▶ validate(tx)
        </motion.button>
        {phase !== 'idle' && <motion.button onClick={reset} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
          style={{ padding:'8px 14px', borderRadius:10, cursor:'pointer', background:'var(--ed-cream)', border:'1px solid var(--ed-rule)', fontSize:10, color:'var(--ed-ink3)', fontFamily:"'JetBrains Mono',monospace" }}>↺</motion.button>}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'validating' && (
          <motion.div key="validating" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ padding:'10px 14px', borderRadius:10, background:`${ACCENT}0d`, border:`1px solid ${ACCENT}28`, fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:ACCENT }}>
            ⏳ Running validate(tx)...
          </motion.div>
        )}
        {phase === 'thrown' && (
          <motion.div key="thrown" initial={{ opacity:0, y:6, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0 }}
            style={{ padding:'12px 16px', borderRadius:10, background:'#EF444410', border:'1.5px solid #EF444430', borderLeft:'4px solid #EF4444' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:'#EF4444', marginBottom:4, letterSpacing:'0.1em' }}>EXCEPTION THROWN — execution stops here</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:'#fca5a5' }}>{thrownMsg}</div>
            <div style={{ marginTop:8, fontSize:10, color:'var(--ed-ink3)' }}>Invalid state caught at validation boundary — data never reaches downstream logic</div>
          </motion.div>
        )}
        {phase === 'passed' && (
          <motion.div key="passed" initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            style={{ padding:'12px 16px', borderRadius:10, background:'#16A34A10', border:'1.5px solid #16A34A30', borderLeft:'4px solid #16A34A' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:'#16A34A', marginBottom:4, letterSpacing:'0.1em' }}>VALIDATION PASSED</div>
            <div style={{ fontSize:11, color:'var(--ed-ink2)' }}>Transaction is safe to process — all guards cleared, execution continues</div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolShell>
  );
}

// ─── 7. JAVA IDE SIMULATOR ───────────────────────────────────────────────────

type Exercise = 'hello' | 'fix-type' | 'guard' | 'object' | 'validator';

const EXERCISES: { id: Exercise; label: string; file: string; starter: string; hint: string; check: (code: string) => string | null }[] = [
  {
    id: 'hello',
    label: '01. Hello LedgerLite',
    file: 'Main.java',
    starter: `public class Main {
    public static void main(String[] args) {
        System.out.println("LedgerLite risk check started");
    }
}`,
    hint: 'Click Run to execute this complete program',
    check: code => code.includes('System.out.println') ? null : 'Need System.out.println()',
  },
  {
    id: 'fix-type',
    label: '02. Fix The Type',
    file: 'TypeFix.java',
    starter: `public class TypeFix {
    public static void main(String[] args) {
        int amount = "500"; // ← fix this line
        System.out.println(amount);
    }
}`,
    hint: 'Change "500" (String) to 500 (int)',
    check: code => {
      if (code.includes('int amount = "500"')) return 'COMPILE ERROR: incompatible types: String cannot be converted to int';
      if (code.includes('int amount = 500')) return null;
      return 'Try: int amount = 500;';
    },
  },
  {
    id: 'guard',
    label: '03. Write A Guard',
    file: 'Guard.java',
    starter: `static boolean isHighValue(int amount) {
    // TODO: return true if amount > 100000
}`,
    hint: 'return amount > 100000;',
    check: code => code.includes('amount > 100000') ? null : 'Not yet — need amount > 100000',
  },
  {
    id: 'object',
    label: '04. Create A Transaction',
    file: 'Objects.java',
    starter: `Transaction tx = // TODO: create TX-2001, amount 150000, currency "USD"`,
    hint: 'new Transaction("TX-2001", 150000, "USD")',
    check: code => code.includes('new Transaction') ? null : 'Use new Transaction(...) to create an object',
  },
  {
    id: 'validator',
    label: '05. Complete The Validator',
    file: 'TransactionValidator.java',
    starter: `static void validate(Transaction tx) {
    if (tx.id == null || tx.id.isBlank()) {
        // TODO: throw IllegalArgumentException
    }
    if (tx.amount < 0) {
        // TODO: throw IllegalArgumentException
    }
}`,
    hint: 'throw new IllegalArgumentException("message")',
    check: code => {
      if (!code.includes('throw new IllegalArgumentException'))
        return 'Need: throw new IllegalArgumentException(...)';
      return null;
    },
  },
];

export function JavaIDESimulator() {
  const [exercise, setExercise] = useState<Exercise>('hello');
  const [code, setCode] = useState(EXERCISES[0].starter);
  const [output, setOutput] = useState<{ lines: string[]; isError: boolean } | null>(null);
  const [running, setRunning] = useState(false);

  const ex = EXERCISES.find(e => e.id === exercise)!;

  function selectExercise(id: Exercise) {
    const newEx = EXERCISES.find(e => e.id === id)!;
    setExercise(id);
    setCode(newEx.starter);
    setOutput(null);
  }

  function run() {
    if (running) return;
    setRunning(true);
    setTimeout(() => {
      const err = ex.check(code);
      if (err) {
        const isCompile = err.includes('COMPILE ERROR') || err.includes('incompatible');
        setOutput({ isError: true, lines: isCompile
          ? [`$ javac ${ex.file}`, `${ex.file}:3: error: ${err.replace('COMPILE ERROR: ','')}`, `1 error`]
          : [`$ javac ${ex.file}`, `✓ Compiled`, `$ java ${ex.file.replace('.java','')}`, `⚠ ${err}`]
        });
      } else {
        const okLines = exercise === 'hello'
          ? [`$ javac ${ex.file}`, `✓ Compiled`, `$ java Main`, `LedgerLite risk check started`]
          : exercise === 'fix-type'
          ? [`$ javac ${ex.file}`, `✓ Compiled`, `$ java TypeFix`, `500`]
          : exercise === 'guard'
          ? [`$ javac ${ex.file}`, `✓ Compiled`, `isHighValue(150000) → true`, `isHighValue(9000)  → false`]
          : exercise === 'object'
          ? [`$ javac ${ex.file}`, `✓ Compiled`, `tx = Transaction{id=TX-2001, amount=150000, currency=USD}`]
          : [`$ javac ${ex.file}`, `✓ Compiled`, `$ java Main`, `TX-1001 → REVIEW`, `TX-1002 → APPROVED`, `TX-1003 (blank id) → IllegalArgumentException: Transaction id is required`];
        setOutput({ isError: false, lines: okLines });
      }
      setRunning(false);
    }, 600);
  }

  return (
    <TiltCard style={{ margin: '32px 0' }}>
      <div style={{ borderRadius:16, overflow:'hidden', border:`1px solid ${ACCENT}28`, boxShadow:`0 10px 40px rgba(0,0,0,0.18)`, background:'#0f172a' }}>
        {/* Header */}
        <div style={{ background:'#0d1117', padding:'10px 16px', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display:'flex', gap:5 }}>{['#ff5f57','#ffbd2e','#28c840'].map(c => <div key={c} style={{ width:10, height:10, borderRadius:'50%', background:c }} />)}</div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:'#64748b' }}>Java IDE · Simulated Environment</div>
          <div style={{ marginLeft:'auto', fontSize:9, color:`${ACCENT}99`, fontFamily:"'JetBrains Mono',monospace" }}>finova-systems/ledgerlite</div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', minHeight:420 }}>
          {/* File tree */}
          <div style={{ borderRight:'1px solid rgba(255,255,255,0.06)', padding:'12px 8px' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:'#475569', letterSpacing:'0.12em', padding:'0 8px 8px', marginBottom:6, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>EXERCISES</div>
            {EXERCISES.map(e => (
              <div key={e.id} onClick={() => selectExercise(e.id)}
                style={{ padding:'6px 10px', borderRadius:6, cursor:'pointer', marginBottom:2,
                  background: exercise===e.id ? `${ACCENT}18` : 'transparent',
                  color: exercise===e.id ? ACCENT : '#64748b',
                  fontSize:10, fontFamily:"'JetBrains Mono',monospace",
                  borderLeft: `2px solid ${exercise===e.id ? ACCENT : 'transparent'}` }}>
                {e.label}
              </div>
            ))}
            <div style={{ marginTop:16, padding:'0 8px 8px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:'#475569', letterSpacing:'0.12em', marginBottom:8 }}>SRC</div>
            {['Transaction.java','TransactionValidator.java','Main.java'].map(f => (
              <div key={f} style={{ padding:'4px 10px', fontSize:9, color:'#475569', fontFamily:"'JetBrains Mono',monospace" }}>📄 {f}</div>
            ))}
          </div>

          {/* Editor + console */}
          <div style={{ display:'flex', flexDirection:'column' as const }}>
            {/* File tab */}
            <div style={{ background:'#0d1117', padding:'0 0 0 12px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:0 }}>
              <div style={{ padding:'8px 14px', fontSize:11, fontFamily:"'JetBrains Mono',monospace", color:ACCENT, borderBottom:`2px solid ${ACCENT}`, background:'#0f172a' }}>{ex.file}</div>
              <div style={{ marginLeft:'auto', padding:'0 14px' }}>
                <motion.button onClick={run} disabled={running} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                  style={{ padding:'5px 14px', borderRadius:6, cursor:running?'not-allowed':'pointer', background:`linear-gradient(145deg,#4ade80,#16A34A)`, color:'#fff', border:'none', fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:800 }}>
                  {running ? '⏳' : '▶ Run'}
                </motion.button>
              </div>
            </div>

            {/* Code editor */}
            <textarea
              value={code}
              onChange={e => { setCode(e.target.value); setOutput(null); }}
              spellCheck={false}
              style={{ flex:1, background:'#0f172a', color:'#e2e8f0', fontFamily:"'JetBrains Mono',monospace", fontSize:12, lineHeight:1.8, padding:'16px 20px', border:'none', outline:'none', resize:'none', minHeight:220 }}
            />

            {/* Console */}
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', background:'#0d1117', padding:'10px 16px', minHeight:100 }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:'#475569', marginBottom:8, letterSpacing:'0.12em' }}>CONSOLE</div>
              {output ? (
                <div>
                  {output.lines.map((line, i) => (
                    <div key={i} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, lineHeight:1.8,
                      color: output.isError ? '#f87171' : line.startsWith('$') ? '#64748b' : line.startsWith('✓') ? '#4ade80' : '#e2e8f0' }}>
                      {line}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:'#475569', fontStyle:'italic' }}>
                  💡 {ex.hint}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

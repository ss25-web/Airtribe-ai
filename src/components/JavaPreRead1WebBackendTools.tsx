'use client';
/**
 * JavaPreRead1WebBackendTools
 * 5 animated 3D visuals + 7 interactive tools + API Lab for Java Pre-Read 01.
 */
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT = '#3B82F6';
const sp = { type: 'spring' as const, stiffness: 280, damping: 24 };

// ─── Shared ───────────────────────────────────────────────────────────────────

const TiltCard = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  const [t, setT] = useState({ x: 0, y: 0, s: 1 });
  return (
    <div onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); setT({ x: (e.clientY-r.top)/r.height*-6-3, y: (e.clientX-r.left)/r.width*6-3, s: 1.012 }); }}
      onMouseLeave={() => setT({ x:0, y:0, s:1 })}
      style={{ transform: `perspective(1000px) rotateX(${t.x}deg) rotateY(${t.y}deg) scale(${t.s})`, transition: 'transform 0.18s ease', ...style }}>
      {children}
    </div>
  );
};

const Shell = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
  <TiltCard style={{ margin: '28px 0' }}>
    <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${ACCENT}28`, boxShadow: `0 8px 40px rgba(0,0,0,0.14)`, background: 'var(--ed-card)' }}>
      <div style={{ background: 'linear-gradient(135deg,#0d1117,#0f172a)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: 5 }}>{['#ff5f57','#ffbd2e','#28c840'].map(c => <div key={c} style={{ width:9,height:9,borderRadius:'50%',background:c }}/>)}</div>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:'#94a3b8', flex:1 }}>{title}</div>
        <div style={{ fontSize:9, color:`${ACCENT}99`, fontFamily:"'JetBrains Mono',monospace" }}>{subtitle}</div>
      </div>
      <div style={{ padding:20 }}>{children}</div>
    </div>
  </TiltCard>
);

const Btn = ({ label, active, accent, onClick }: { label:string; active:boolean; accent:string; onClick:()=>void }) => (
  <motion.button onClick={onClick} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
    style={{ padding:'6px 12px', borderRadius:8, cursor:'pointer', fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:800,
      background: active ? `linear-gradient(145deg,${accent}cc,${accent})` : 'var(--ed-card)',
      border:`1.5px solid ${active?accent:`${accent}28`}`, color:active?'#fff':accent }}>
    {label}
  </motion.button>
);

const CodePre = ({ code }: { code: string }) => (
  <pre style={{ background:'#0f172a', color:'#93c5fd', fontFamily:"'JetBrains Mono',monospace", fontSize:12, lineHeight:1.8, padding:'14px 18px', margin:'12px 0', borderRadius:10, overflow:'auto' as const }}><code>{code}</code></pre>
);

// ─── VISUAL 1: DNS Lookup Flight Path ─────────────────────────────────────────

const DNS_STEPS = [
  { id:'browser', label:'Browser Cache',      icon:'🌐', color:'#3B82F6', desc:'Check local cache first' },
  { id:'os',      label:'OS Cache',           icon:'💻', color:'#7843EE', desc:'Check OS resolver cache' },
  { id:'isp',     label:'Recursive Resolver', icon:'📡', color:'#0097A7', desc:'ISP resolver queries upstream' },
  { id:'auth',    label:'Authoritative DNS',  icon:'🏛', color:'#D97706', desc:'Source of truth for the zone' },
  { id:'ip',      label:'IP Address',         icon:'📍', color:'#16A34A', desc:'203.0.113.42 returned' },
];

export function DNSLookupVisual() {
  const [mode, setMode] = useState<'hit'|'miss'>('miss');
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function run() {
    if (running) return;
    timers.current.forEach(clearTimeout); timers.current=[];
    setRunning(true); setStep(-1);
    const steps = mode==='hit' ? [0,4] : [0,1,2,3,4];
    steps.forEach((si,i) => {
      const t = setTimeout(() => {
        setStep(si);
        if (i===steps.length-1) { const ct=setTimeout(()=>{setRunning(false);},600); timers.current.push(ct); }
      }, i*700);
      timers.current.push(t);
    });
  }

  return (
    <Shell title="DNSLookupFlightPath.java" subtitle="Domain → IP Resolution">
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' as const }}>
        <Btn label="Cache Hit" active={mode==='hit'} accent={C.green} onClick={()=>{setMode('hit');setStep(-1);}} />
        <Btn label="Cache Miss" active={mode==='miss'} accent={C.amber} onClick={()=>{setMode('miss');setStep(-1);}} />
        <motion.button onClick={run} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
          style={{ padding:'6px 16px', borderRadius:8, cursor:'pointer', background:`linear-gradient(145deg,#4ade80,#16A34A)`, color:'#fff', border:'none', fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:800 }}>
          ▶ Resolve
        </motion.button>
      </div>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:'#60a5fa', marginBottom:14 }}>
        ledgerlite.finova.com
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:0, perspective:'900px' }}>
        {DNS_STEPS.map((s,i) => {
          const skip = mode==='hit' && i>0 && i<4;
          const active = step===i;
          const done = step>i && !(skip);
          if (skip && step>=0) return null;
          return (
            <React.Fragment key={s.id}>
              <motion.div animate={{ scale:active?1.08:1, y:active?-4:0, boxShadow:active?`0 12px 28px ${s.color}45`:'none' }} transition={sp}
                style={{ flex:1, padding:'12px 8px', borderRadius:12, textAlign:'center' as const, background:`${(active||done)?s.color+'18':'var(--ed-cream)'}`, border:`2px solid ${(active||done)?s.color:`${s.color}22`}`, opacity:running&&!active&&!done?0.35:1 }}>
                <div style={{ fontSize:20, marginBottom:4 }}>{done?'✓':s.icon}</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, fontWeight:800, color:s.color, letterSpacing:'0.06em', marginBottom:3 }}>{s.label}</div>
                <div style={{ fontSize:9, color:'var(--ed-ink3)', lineHeight:1.4 }}>{s.desc}</div>
              </motion.div>
              {i<DNS_STEPS.length-1 && !skip && <div style={{ width:20, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="20" height="14"><path d={`M2 7 H14 M10 3 L18 7 L10 11`} stroke={done||active?'#16A34A':'#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
              </div>}
            </React.Fragment>
          );
        })}
      </div>
      {step===4 && <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} style={{ marginTop:14, padding:'10px 14px', borderRadius:10, background:'#16A34A0d', border:'1px solid #16A34A28', fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:'#16A34A' }}>
        ✓ ledgerlite.finova.com → 203.0.113.42 — browser can now open a TCP connection
      </motion.div>}
    </Shell>
  );
}

// ─── VISUAL 2: HTTP Packet Scanner ────────────────────────────────────────────

const HTTP_PARTS = [
  { id:'method',  label:'Method',  color:'#3B82F6', value:'GET',             detail:'What action: GET reads, POST creates, PATCH updates, DELETE removes' },
  { id:'path',    label:'Path',    color:'#7843EE', value:'/api/transactions?risk=high', detail:'Which resource and filter params' },
  { id:'headers', label:'Headers', color:'#D97706', value:'Host · Authorization · Accept', detail:'Metadata: who you are, what you want, what format' },
  { id:'body',    label:'Body',    color:'#0097A7', value:'(empty — GET has no body)', detail:'Data payload — present on POST/PATCH with JSON' },
];

export function HTTPPacketScanner() {
  const [active, setActive] = useState<string|null>(null);
  const [view, setView] = useState<'request'|'response'>('request');

  return (
    <Shell title="HTTPPacketScanner.java" subtitle="Anatomy of a request">
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <Btn label="Request" active={view==='request'} accent={ACCENT} onClick={()=>{setView('request');setActive(null);}} />
        <Btn label="Response" active={view==='response'} accent='#16A34A' onClick={()=>{setView('response');setActive(null);}} />
      </div>
      {view==='request' ? (
        <>
          <CodePre code={`GET /api/transactions?risk=high HTTP/1.1\nHost: ledgerlite.finova.com\nAccept: application/json\nAuthorization: Bearer eyJhbGci...`} />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginTop:12 }}>
            {HTTP_PARTS.map(p => (
              <motion.div key={p.id} onClick={() => setActive(active===p.id?null:p.id)} whileHover={{ y:-3 }} whileTap={{ scale:0.97 }}
                animate={{ boxShadow:active===p.id?`0 8px 24px ${p.color}35`:'none' }}
                style={{ padding:'12px 10px', borderRadius:12, textAlign:'center' as const, cursor:'pointer', background:active===p.id?`${p.color}14`:'var(--ed-cream)', border:`2px solid ${active===p.id?p.color:`${p.color}22`}` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:p.color, marginBottom:4 }}>{p.label}</div>
                <div style={{ fontSize:9, color:'var(--ed-ink3)', lineHeight:1.4 }}>{p.value}</div>
              </motion.div>
            ))}
          </div>
          <AnimatePresence>
            {active && <motion.div key={active} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              style={{ marginTop:12, padding:'10px 14px', borderRadius:10, background:`${HTTP_PARTS.find(p=>p.id===active)?.color}0d`, border:`1px solid ${HTTP_PARTS.find(p=>p.id===active)?.color}28`, fontSize:12, color:'var(--ed-ink2)' }}>
              {HTTP_PARTS.find(p=>p.id===active)?.detail}
            </motion.div>}
          </AnimatePresence>
        </>
      ) : (
        <CodePre code={`HTTP/1.1 200 OK\nContent-Type: application/json\nAccess-Control-Allow-Origin: *\n\n[\n  { "id": "TX-1001", "amount": 150000, "currency": "USD", "risk": "HIGH" },\n  { "id": "TX-1003", "amount": 220000, "currency": "EUR", "risk": "HIGH" }\n]`} />
      )}
      <div style={{ marginTop:10, fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:'var(--ed-ink3)' }}>↑ Click a part to inspect it</div>
    </Shell>
  );
}

// ─── TOOL 1: REST Route Workshop ─────────────────────────────────────────────

const C = { blue:'#3B82F6', purple:'#7843EE', teal:'#0097A7', amber:'#D97706', green:'#16A34A', coral:'#E8875A', red:'#EF4444' };

const REST_SCENARIOS = [
  { action:'Show high-risk transactions for dashboard', method:'GET',   path:'/api/transactions?risk=high',         quality:100 },
  { action:'Create a new transaction',                  method:'POST',  path:'/api/transactions',                   quality:100 },
  { action:'Mark transaction TX-1001 as reviewed',      method:'PATCH', path:'/api/transactions/TX-1001/status',    quality:100 },
  { action:'Delete transaction TX-1001',                method:'DELETE',path:'/api/transactions/TX-1001',           quality:100 },
  { action:'Get single transaction details',            method:'GET',   path:'/api/transactions/:id',               quality:100 },
];
const BAD_PATHS = ['/getHighRiskThingsForDashboard','/doEverything','/java/runHighRiskButton','/showAll','/fetchData'];

export function RESTRouteWorkshop() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string|null>(null);
  const sc = REST_SCENARIOS[idx];

  const options = [sc.path, BAD_PATHS[idx]].sort(() => Math.random()-0.5);

  function next() { setPicked(null); setIdx(i=>(i+1)%REST_SCENARIOS.length); }

  return (
    <Shell title="RESTRouteWorkshop.java" subtitle="Map product actions to REST">
      <div style={{ padding:'14px 18px', borderRadius:12, background:`${ACCENT}0a`, border:`1px solid ${ACCENT}22`, borderLeft:`4px solid ${ACCENT}`, marginBottom:16 }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, fontWeight:800, color:ACCENT, marginBottom:6, letterSpacing:'0.12em' }}>PRODUCT ACTION</div>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--ed-ink)' }}>{sc.action}</div>
        <div style={{ marginTop:6, fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.purple }}>Method: {sc.method}</div>
      </div>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, fontWeight:800, color:'var(--ed-ink3)', marginBottom:8, letterSpacing:'0.1em' }}>CHOOSE THE BEST REST PATH:</div>
      <div style={{ display:'flex', flexDirection:'column' as const, gap:8, marginBottom:14 }}>
        {options.map(opt => {
          const correct = opt===sc.path;
          const chosen = picked===opt;
          const bgColor = chosen ? (correct?`${C.green}14`:`${C.red}0d`) : 'var(--ed-cream)';
          return (
            <motion.button key={opt} onClick={() => setPicked(opt)} disabled={!!picked}
              whileHover={!picked?{ x:4 }:{}}
              style={{ padding:'10px 14px', borderRadius:10, cursor:picked?'default':'pointer', textAlign:'left' as const,
                background:bgColor, border:`1.5px solid ${chosen?(correct?C.green:C.red):'var(--ed-rule)'}`,
                fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:chosen?(correct?C.green:C.red):'var(--ed-ink2)' }}>
              {opt}
              {chosen && <span style={{ marginLeft:8, fontWeight:800 }}>{correct?'✓ REST-style resource endpoint':'✗ Avoid action names in paths'}</span>}
            </motion.button>
          );
        })}
      </div>
      {picked && <motion.button onClick={next} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
        style={{ padding:'8px 18px', borderRadius:10, cursor:'pointer', background:`linear-gradient(145deg,#4ade80,${C.green})`, color:'#fff', border:'none', fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:800 }}>
        Next scenario →
      </motion.button>}
    </Shell>
  );
}

// ─── TOOL 2: Status Code Decision Deck ────────────────────────────────────────

const STATUS_SCENARIOS = [
  { scenario:'Valid GET /api/transactions — list returned', correct:200, codes:[200,201,404,500] },
  { scenario:'POST /api/transactions — new record created', correct:201, codes:[200,201,400,404] },
  { scenario:'Missing required field in POST body',         correct:400, codes:[200,400,401,500] },
  { scenario:'GET /api/transactions without token',         correct:401, codes:[200,401,403,404] },
  { scenario:'Valid token but wrong role for endpoint',     correct:403, codes:[401,403,404,500] },
  { scenario:'GET /api/transactions/TX-UNKNOWN',            correct:404, codes:[200,400,404,500] },
  { scenario:'Database crashed unexpectedly',               correct:500, codes:[400,404,500,503] },
];

const STATUS_LABELS: Record<number,string> = { 200:'200 OK', 201:'201 Created', 400:'400 Bad Request', 401:'401 Unauthorized', 403:'403 Forbidden', 404:'404 Not Found', 500:'500 Internal Server Error', 503:'503 Service Unavailable' };
const STATUS_COLORS: Record<number,string> = { 200:C.green, 201:C.teal, 400:C.amber, 401:C.coral, 403:C.coral, 404:C.amber, 500:C.red, 503:C.red };

export function StatusCodeDeck() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number|null>(null);
  const sc = STATUS_SCENARIOS[idx];
  const score = useRef(0);

  function pick(code: number) {
    if (picked!==null) return;
    setPicked(code);
    if (code===sc.correct) score.current++;
  }
  function next() { setPicked(null); setIdx(i=>(i+1)%STATUS_SCENARIOS.length); }

  return (
    <Shell title="StatusCodeDeck.java" subtitle="Choose the right response">
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14, alignItems:'center' }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:'var(--ed-ink3)' }}>Scenario {idx+1}/{STATUS_SCENARIOS.length}</div>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:C.green, fontWeight:700 }}>Score: {score.current}</div>
      </div>
      <div style={{ padding:'14px 18px', borderRadius:12, background:'var(--ed-cream)', border:'1px solid var(--ed-rule)', marginBottom:16, fontSize:14, fontWeight:600, color:'var(--ed-ink)', lineHeight:1.5 }}>
        {sc.scenario}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
        {sc.codes.map(code => {
          const correct = code===sc.correct;
          const chosen = picked===code;
          const dimmed = picked!==null && !chosen;
          return (
            <motion.button key={code} onClick={() => pick(code)} disabled={picked!==null}
              whileHover={!picked?{ scale:1.03, y:-2 }:{}}
              style={{ padding:'12px', borderRadius:10, cursor:picked?'default':'pointer', textAlign:'center' as const,
                background: chosen ? `${STATUS_COLORS[code]}18` : 'var(--ed-card)',
                border:`2px solid ${chosen?(correct?C.green:C.red):`${STATUS_COLORS[code]}30`}`,
                opacity: dimmed?0.4:1, color: STATUS_COLORS[code], fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:800 }}>
              {STATUS_LABELS[code]}
            </motion.button>
          );
        })}
      </div>
      {picked!==null && (
        <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}>
          <div style={{ padding:'10px 14px', borderRadius:10, background:`${picked===sc.correct?C.green:C.red}0d`, border:`1px solid ${picked===sc.correct?C.green:C.red}28`, fontSize:12, color: picked===sc.correct?C.green:C.red, marginBottom:10 }}>
            {picked===sc.correct?`✓ Correct — ${STATUS_LABELS[sc.correct]}`:`✗ Expected ${STATUS_LABELS[sc.correct]} — ${STATUS_LABELS[sc.correct].split(' ').slice(1).join(' ')} means the request was understood but the resource was not found or invalid`}
          </div>
          <motion.button onClick={next} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
            style={{ padding:'8px 18px', borderRadius:10, cursor:'pointer', background:`linear-gradient(145deg,#4ade80,${C.green})`, color:'#fff', border:'none', fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:800 }}>
            Next →
          </motion.button>
        </motion.div>
      )}
    </Shell>
  );
}

// ─── VISUAL 3: CORS Browser Gate ─────────────────────────────────────────────

export function CORSBrowserGate() {
  const [frontOrigin, setFrontOrigin] = useState('http://localhost:3000');
  const [apiOrigin,   setApiOrigin]   = useState('http://localhost:8080');
  const [allowedOrigin, setAllowedOrigin] = useState('http://localhost:3000');
  const [phase, setPhase] = useState<'idle'|'running'|'allowed'|'blocked'>('idle');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function send() {
    timers.current.forEach(clearTimeout); timers.current=[];
    setPhase('running');
    const allowed = frontOrigin===allowedOrigin;
    const t = setTimeout(() => setPhase(allowed?'allowed':'blocked'), 1200);
    timers.current.push(t);
  }

  const blocked = phase==='blocked';

  return (
    <Shell title="CORSBrowserGate.java" subtitle="Origin enforcement">
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        {[
          { label:'Frontend Origin', value:frontOrigin, set:setFrontOrigin, options:['http://localhost:3000','http://localhost:4000','https://app.finova.com'] },
          { label:'API Origin',      value:apiOrigin,   set:setApiOrigin,   options:['http://localhost:8080','https://api.finova.com'] },
          { label:'Server CORS: Access-Control-Allow-Origin', value:allowedOrigin, set:setAllowedOrigin, options:['http://localhost:3000','http://localhost:4000','*','https://app.finova.com'] },
        ].map(ctrl => (
          <div key={ctrl.label}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, fontWeight:800, color:'var(--ed-ink3)', marginBottom:5, letterSpacing:'0.1em' }}>{ctrl.label.toUpperCase()}</div>
            <select value={ctrl.value} onChange={e=>{ ctrl.set(e.target.value); setPhase('idle'); }}
              style={{ width:'100%', padding:'6px 8px', borderRadius:8, border:'1px solid var(--ed-rule)', background:'var(--ed-card)', color:'var(--ed-ink)', fontSize:11, fontFamily:"'JetBrains Mono',monospace" }}>
              {ctrl.options.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Pipeline */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14, perspective:'600px' }}>
        {[
          { label:'Browser', note:frontOrigin, color:C.blue, icon:'🌐' },
          { label:'API Server', note:apiOrigin, color:C.teal, icon:'⚙' },
          { label:'Browser Gate', note:'CORS check', color:blocked?C.red:C.green, icon:blocked?'🚫':'✅' },
        ].map((node,i) => (
          <React.Fragment key={node.label}>
            <div style={{ flex:1, padding:'10px 8px', borderRadius:12, textAlign:'center' as const, background:`${node.color}10`, border:`1.5px solid ${node.color}28` }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{node.icon}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:node.color }}>{node.label}</div>
              <div style={{ fontSize:8, color:'var(--ed-ink3)', marginTop:2 }}>{node.note}</div>
            </div>
            {i<2 && <div style={{ fontSize:16, color:`${phase==='running'?C.amber:'var(--ed-ink3)'}` }}>→</div>}
          </React.Fragment>
        ))}
      </div>

      <motion.button onClick={send} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }} style={{ padding:'8px 18px', borderRadius:10, cursor:'pointer', background:`linear-gradient(145deg,${ACCENT}cc,${ACCENT})`, color:'#fff', border:'none', fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:800, marginBottom:12 }}>
        ▶ Send Request
      </motion.button>

      <AnimatePresence mode="wait">
        {phase==='allowed' && <motion.div key="ok" initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
          style={{ padding:'10px 14px', borderRadius:10, background:`${C.green}0d`, border:`1px solid ${C.green}28`, borderLeft:`4px solid ${C.green}` }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:C.green, marginBottom:3 }}>ALLOWED</div>
          <div style={{ fontSize:11, color:'var(--ed-ink2)' }}>Browser received response — Access-Control-Allow-Origin header matched the frontend origin.</div>
          <CodePre code={`Access-Control-Allow-Origin: ${allowedOrigin}`} />
        </motion.div>}
        {phase==='blocked' && <motion.div key="err" initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
          style={{ padding:'10px 14px', borderRadius:10, background:`${C.red}0d`, border:`1px solid ${C.red}28`, borderLeft:`4px solid ${C.red}` }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:C.red, marginBottom:3 }}>BLOCKED BY CORS</div>
          <div style={{ fontSize:11, color:'var(--ed-ink2)', marginBottom:8 }}>Browser blocked the response. The server's CORS header does not allow {frontOrigin}.</div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:C.red }}>Access-Control-Allow-Origin: {allowedOrigin}</div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:'var(--ed-ink3)', marginTop:4 }}>Expected: {frontOrigin}</div>
        </motion.div>}
      </AnimatePresence>
    </Shell>
  );
}

// ─── VISUAL 4: Auth Checkpoint Tunnel ─────────────────────────────────────────

type TokenType = 'none'|'analyst'|'manager';
type EndpointType = 'own'|'manager';

export function AuthCheckpointTunnel() {
  const [token, setToken] = useState<TokenType>('none');
  const [endpoint, setEndpoint] = useState<EndpointType>('own');
  const [phase, setPhase] = useState<'idle'|'running'|'done'>('idle');
  const [result, setResult] = useState<{status:number;msg:string;pass1:boolean;pass2:boolean}|null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function run() {
    timers.current.forEach(clearTimeout); timers.current=[];
    setPhase('running'); setResult(null);
    const pass1 = token!=='none';
    const pass2 = pass1 && (endpoint==='own' || token==='manager');
    const status = !pass1?401:!pass2?403:200;
    const msg = !pass1?'No token — identity unknown':'401 Unauthorized'===String(status)?'Identity failed':!pass2?'Authenticated but role insufficient — 403 Forbidden':'200 OK — identity verified, role permitted';
    const t = setTimeout(() => { setResult({status,msg,pass1,pass2}); setPhase('done'); }, 1100);
    timers.current.push(t);
  }

  return (
    <Shell title="AuthCheckpointTunnel.java" subtitle="Authentication → Authorization">
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, fontWeight:800, color:'var(--ed-ink3)', marginBottom:6, letterSpacing:'0.1em' }}>TOKEN</div>
          <div style={{ display:'flex', flexDirection:'column' as const, gap:5 }}>
            {(['none','analyst','manager'] as TokenType[]).map(t => <Btn key={t} label={t==='none'?'No token':t} active={token===t} accent={t==='none'?C.red:t==='analyst'?C.blue:C.purple} onClick={()=>{setToken(t);setPhase('idle');setResult(null);}} />)}
          </div>
        </div>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, fontWeight:800, color:'var(--ed-ink3)', marginBottom:6, letterSpacing:'0.1em' }}>ENDPOINT</div>
          <div style={{ display:'flex', flexDirection:'column' as const, gap:5 }}>
            <Btn label="Own queue (any role)" active={endpoint==='own'} accent={C.teal} onClick={()=>{setEndpoint('own');setPhase('idle');setResult(null);}} />
            <Btn label="All high-risk (manager only)" active={endpoint==='manager'} accent={C.amber} onClick={()=>{setEndpoint('manager');setPhase('idle');setResult(null);}} />
          </div>
        </div>
      </div>

      {/* Tunnel stages */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
        {[
          { label:'Identity Scanner', pass: result?.pass1, pending: phase==='running' },
          { label:'Permission Scanner', pass: result?.pass2, pending: phase==='running' && result?.pass1 },
          { label:'Response', pass: result?.pass1&&result?.pass2, pending:false },
        ].map((stage, i) => {
          const col = stage.pass===true?C.green:stage.pass===false?C.red:C.blue;
          return (
            <React.Fragment key={stage.label}>
              <div style={{ flex:1, padding:'10px', borderRadius:12, textAlign:'center' as const, background:stage.pass!==undefined?`${col}10`:'var(--ed-cream)', border:`1.5px solid ${stage.pass!==undefined?col:'var(--ed-rule)'}` }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, fontWeight:800, color:stage.pass!==undefined?col:'var(--ed-ink3)', marginBottom:3 }}>{stage.label}</div>
                <div style={{ fontSize:16 }}>{stage.pass===true?'✓':stage.pass===false?'✗':'⬡'}</div>
              </div>
              {i<2 && <div style={{ color:'var(--ed-ink3)' }}>→</div>}
            </React.Fragment>
          );
        })}
      </div>

      <motion.button onClick={run} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }} style={{ padding:'8px 18px', borderRadius:10, cursor:'pointer', background:`linear-gradient(145deg,${ACCENT}cc,${ACCENT})`, color:'#fff', border:'none', fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:800, marginBottom:12 }}>
        ▶ Send Request
      </motion.button>

      <AnimatePresence>
        {result && <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
          style={{ padding:'10px 14px', borderRadius:10, background:`${result.status===200?C.green:C.red}0d`, border:`1px solid ${result.status===200?C.green:C.red}28`, borderLeft:`4px solid ${result.status===200?C.green:C.red}` }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:800, color:result.status===200?C.green:C.red, marginBottom:4 }}>
            HTTP {result.status} {result.status===200?'OK':result.status===401?'Unauthorized':'Forbidden'}
          </div>
          <div style={{ fontSize:12, color:'var(--ed-ink2)' }}>{result.msg}</div>
        </motion.div>}
      </AnimatePresence>
    </Shell>
  );
}

// ─── TOOL: Postman Mission Control (API Lab) ──────────────────────────────────

type Role = 'anonymous'|'analyst'|'manager';

const ROUTES = [
  { method:'GET',    path:'/api/transactions',          authRequired:true,  roles:['analyst','manager'], query:'?risk=high', status:200, body:[{id:'TX-1001',amount:150000,currency:'USD',risk:'HIGH'},{id:'TX-1003',amount:220000,currency:'EUR',risk:'HIGH'}] },
  { method:'GET',    path:'/api/transactions/:id',       authRequired:true,  roles:['analyst','manager'], status:200, body:{id:'TX-1001',amount:150000,currency:'USD',risk:'HIGH'} },
  { method:'POST',   path:'/api/transactions',           authRequired:true,  roles:['manager'],           status:201, body:{id:'TX-1004',created:true} },
  { method:'DELETE', path:'/api/transactions/:id',       authRequired:true,  roles:['manager'],           status:405, body:{error:'Method not allowed'} },
];

export function PostmanMissionControl() {
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('/api/transactions?risk=high');
  const [role, setRole] = useState<Role>('anonymous');
  const [output, setOutput] = useState<{status:number;body:unknown;time:number}|null>(null);

  function send() {
    const start = Date.now();
    const route = ROUTES.find(r => {
      const rp = r.path.replace(':id','TX-1001');
      const rq = path.replace(/\?.*$/,'');
      const fq = path.replace(/\?.*$/,'');
      return r.method===method && (rp===fq || r.path===path || (r.path+r.query)===path || r.path===fq);
    });
    if (!route) { setOutput({ status:404, body:{error:'Not Found'}, time:Date.now()-start }); return; }
    if (route.authRequired && role==='anonymous') { setOutput({ status:401, body:{error:'Unauthorized — token required'}, time:Date.now()-start }); return; }
    if (!route.roles.includes(role)) { setOutput({ status:403, body:{error:`Forbidden — ${role} role cannot access this endpoint`}, time:Date.now()-start }); return; }
    setOutput({ status:route.status, body:route.body, time:Date.now()-start+Math.round(Math.random()*30+20) });
  }

  const sc = output?.status;
  const scColor = sc===200||sc===201?C.green:sc===401||sc===403?C.amber:sc===404?C.coral:C.red;

  return (
    <Shell title="PostmanMissionControl.java" subtitle="API test suite — LedgerLite">
      <div style={{ display:'grid', gridTemplateColumns:'120px 1fr 160px', gap:8, marginBottom:14, alignItems:'end' }}>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, fontWeight:800, color:'var(--ed-ink3)', marginBottom:5 }}>METHOD</div>
          <select value={method} onChange={e=>setMethod(e.target.value)}
            style={{ width:'100%', padding:'6px 8px', borderRadius:8, border:'1px solid var(--ed-rule)', background:'var(--ed-card)', color:ACCENT, fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:800 }}>
            {['GET','POST','PATCH','DELETE'].map(m=><option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, fontWeight:800, color:'var(--ed-ink3)', marginBottom:5 }}>URL</div>
          <input value={path} onChange={e=>setPath(e.target.value)}
            style={{ width:'100%', padding:'6px 10px', borderRadius:8, border:'1px solid var(--ed-rule)', background:'var(--ed-card)', color:'var(--ed-ink)', fontFamily:"'JetBrains Mono',monospace", fontSize:11 }} />
        </div>
        <div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, fontWeight:800, color:'var(--ed-ink3)', marginBottom:5 }}>AUTH ROLE</div>
          <select value={role} onChange={e=>setRole(e.target.value as Role)}
            style={{ width:'100%', padding:'6px 8px', borderRadius:8, border:'1px solid var(--ed-rule)', background:'var(--ed-card)', color:'var(--ed-ink)', fontFamily:"'JetBrains Mono',monospace", fontSize:11 }}>
            <option value="anonymous">No token</option>
            <option value="analyst">Analyst</option>
            <option value="manager">Manager</option>
          </select>
        </div>
      </div>

      {/* Quick tests */}
      <div style={{ marginBottom:12 }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, fontWeight:800, color:'var(--ed-ink3)', marginBottom:6, letterSpacing:'0.1em' }}>QUICK SCENARIOS</div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const }}>
          {[
            { label:'High-risk list',    method:'GET',    path:'/api/transactions?risk=high', role:'manager' as Role },
            { label:'Missing token',     method:'GET',    path:'/api/transactions?risk=high', role:'anonymous' as Role },
            { label:'Wrong role',        method:'POST',   path:'/api/transactions',           role:'analyst' as Role },
            { label:'Not found',         method:'GET',    path:'/api/transactions/TX-404',    role:'manager' as Role },
          ].map(s => <motion.button key={s.label} onClick={() => { setMethod(s.method); setPath(s.path); setRole(s.role); setOutput(null); }}
            whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
            style={{ padding:'5px 10px', borderRadius:7, cursor:'pointer', background:'var(--ed-cream)', border:'1px solid var(--ed-rule)', fontSize:10, color:'var(--ed-ink3)', fontFamily:"'JetBrains Mono',monospace" }}>
            {s.label}
          </motion.button>)}
        </div>
      </div>

      <motion.button onClick={send} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }} style={{ padding:'9px 20px', borderRadius:10, cursor:'pointer', background:`linear-gradient(145deg,#4ade80,${C.green})`, color:'#fff', border:'none', fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:800, marginBottom:14 }}>
        ▶ Send
      </motion.button>

      <AnimatePresence mode="wait">
        {output && <motion.div key={JSON.stringify(output)} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
          <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:8 }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:900, color:scColor }}>{output.status}</div>
            <div style={{ fontSize:10, color:'var(--ed-ink3)', fontFamily:"'JetBrains Mono',monospace" }}>{output.time}ms</div>
          </div>
          <pre style={{ background:'#0f172a', color:scColor, fontFamily:"'JetBrains Mono',monospace", fontSize:12, lineHeight:1.8, padding:'14px 18px', borderRadius:10, margin:0, overflowX:'auto' as const }}>
            {JSON.stringify(output.body, null, 2)}
          </pre>
        </motion.div>}
      </AnimatePresence>
    </Shell>
  );
}

// ─── Hero Illustration ─────────────────────────────────────────────────────────

export function LedgerLiteWebWorld() {
  const nodes = [
    { icon:'💻', label:'Analyst Browser',    desc:'Click: Review High-Risk',  color:'#3B82F6', x:0 },
    { icon:'📡', label:'DNS Resolver',        desc:'finova.com → 203.0.113.42', color:'#7843EE', x:1 },
    { icon:'⚖',  label:'Load Balancer',       desc:'Routes traffic to services',color:'#D97706', x:2 },
    { icon:'☕', label:'Java Backend',         desc:'Spring Boot service',       color:'#16A34A', x:3 },
    { icon:'🗄',  label:'Database',           desc:'Transaction records',        color:'#0097A7', x:4 },
  ];
  return (
    <div style={{ margin:'28px 0', padding:'28px 24px', borderRadius:24, background:'linear-gradient(160deg,rgba(59,130,246,0.06),rgba(120,67,238,0.06))', border:'1px solid rgba(59,130,246,0.15)', perspective:'900px' }}>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:ACCENT, letterSpacing:'0.16em', marginBottom:16, textTransform:'uppercase' as const }}>LedgerLite Web Request World</div>
      <div style={{ display:'flex', alignItems:'center', gap:0 }}>
        {nodes.map((n,i) => (
          <React.Fragment key={n.label}>
            <motion.div animate={{ y:[0,-4,0] }} transition={{ duration:3+i*0.4, repeat:Infinity, ease:'easeInOut', delay:i*0.3 }}
              style={{ flex:1, padding:'14px 8px', borderRadius:16, textAlign:'center' as const, background:`${n.color}10`, border:`2px solid ${n.color}28`, boxShadow:`5px 5px 0 ${n.color}18, 0 10px 24px ${n.color}12` }}>
              <div style={{ fontSize:26, marginBottom:6 }}>{n.icon}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, fontWeight:800, color:n.color, marginBottom:3 }}>{n.label}</div>
              <div style={{ fontSize:8, color:'var(--ed-ink3)', lineHeight:1.4 }}>{n.desc}</div>
            </motion.div>
            {i<nodes.length-1 && (
              <div style={{ flexShrink:0, width:28, display:'flex', flexDirection:'column' as const, alignItems:'center', gap:2 }}>
                <motion.div animate={{ opacity:[0.3,1,0.3] }} transition={{ duration:1.4, repeat:Infinity, delay:i*0.3 }}
                  style={{ width:'100%', height:2, background:`linear-gradient(90deg,${nodes[i].color},${nodes[i+1].color})`, borderRadius:1 }} />
                <div style={{ fontSize:8, color:'var(--ed-ink3)' }}>→</div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop:14, fontSize:11, color:'var(--ed-ink3)', fontStyle:'italic', textAlign:'center' as const }}>
        One click. Five systems. Every Java backend engineer learns to trace this path.
      </div>
    </div>
  );
}

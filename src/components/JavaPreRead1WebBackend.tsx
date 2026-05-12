'use client';
/**
 * JavaPreRead1WebBackend — Java Pre-Read 01: Web & Backend Foundations
 * From Browser Click to Java Service
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import SWEPreReadLayout from './SWEPreReadLayout';
import { SWEMentorFace } from './sweDesignSystem';
import QuizEngine from './QuizEngine';
import {
  LedgerLiteWebWorld,
  DNSLookupVisual,
  HTTPPacketScanner,
  RESTRouteWorkshop,
  StatusCodeDeck,
  CORSBrowserGate,
  AuthCheckpointTunnel,
  PostmanMissionControl,
} from './JavaPreRead1WebBackendTools';

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT     = '#3B82F6';
const ACCENT_RGB = '59,130,246';
const MODULE_ID  = 'java-pr-01';

const SECTIONS = [
  { id: 'dns',          label: 'DNS and the First Hop'              },
  { id: 'http',         label: 'HTTP Request Anatomy'                },
  { id: 'rest',         label: 'REST and Resources'                  },
  { id: 'status-codes', label: 'Status Codes'                        },
  { id: 'headers',      label: 'Headers, JSON and Content Types'     },
  { id: 'cors',         label: 'CORS and Browser Trust'              },
  { id: 'auth',         label: 'Authentication and Authorization'    },
  { id: 'api-testing',  label: 'Postman and API Testing'             },
];

const CONCEPTS = [
  { id: 'dns',          label: 'DNS & Routing',       color: '#3B82F6' },
  { id: 'http',         label: 'HTTP Anatomy',         color: '#7843EE' },
  { id: 'rest',         label: 'REST Design',          color: '#0097A7' },
  { id: 'status-codes', label: 'Status Codes',         color: '#D97706' },
  { id: 'headers',      label: 'Headers & JSON',       color: '#E8875A' },
  { id: 'cors',         label: 'CORS & Browser Trust', color: '#16A34A' },
  { id: 'auth',         label: 'Auth Basics',          color: '#7843EE' },
  { id: 'api-testing',  label: 'API Testing',          color: '#3B82F6' },
];

const TRACK_CONFIG = {
  name: 'Java',
  accent: ACCENT,
  accentRgb: ACCENT_RGB,
  protagonist: 'Vikram',
  role: 'Junior Backend Engineer',
  company: 'Finova Systems',
  mentor: 'Kavya',
  mentorRole: 'Senior Backend Engineer',
  mentorColor: '#7843EE',
};

// ─── Shared components ────────────────────────────────────────────────────────

const CharCard = ({ name, role, color }: { name: string; role: string; color: string }) => (
  <div style={{ width:108, flexShrink:0, padding:'14px 10px', borderRadius:20, background:'var(--ed-card)', border:'1px solid var(--ed-rule)', boxShadow:'0 1px 6px rgba(0,0,0,0.04)', display:'flex', flexDirection:'column' as const, alignItems:'center', gap:7, textAlign:'center' as const }}>
    <div style={{ borderRadius:14, overflow:'hidden', flexShrink:0 }}>
      <SWEMentorFace name={name} size={52} />
    </div>
    <div style={{ fontSize:11, fontWeight:700, color, lineHeight:1.2 }}>{name}</div>
    <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:8, color:'var(--ed-ink3)', lineHeight:1.4 }}>{role}</div>
  </div>
);

function ConvoLine({ speaker, text, color }: { speaker: string; text: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = '0'; el.style.transform = 'translateX(-48px) scale(0.97)'; el.style.transition = 'none';
    let io: IntersectionObserver;
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.55s cubic-bezier(0.34,1.48,0.64,1), transform 0.55s cubic-bezier(0.34,1.48,0.64,1)';
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { requestAnimationFrame(() => { el.style.opacity='1'; el.style.transform='translateX(0) scale(1)'; }); io.disconnect(); }
      }, { threshold: 0.15 });
      io.observe(el);
    });
    return () => { cancelAnimationFrame(raf); io?.disconnect(); el.style.opacity=''; el.style.transform=''; el.style.transition=''; };
  }, []);
  return (
    <div ref={ref} style={{ display:'flex', gap:12, alignItems:'flex-start', margin:'10px 0' }}>
      <div style={{ flexShrink:0, marginTop:2 }}><SWEMentorFace name={speaker} size={38} /></div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, color, marginBottom:5, letterSpacing:'0.08em', textTransform:'uppercase' as const }}>{speaker}</div>
        <div style={{ fontSize:13, color:'var(--ed-ink2)', lineHeight:1.72, background:`${color}08`, padding:'10px 14px', borderRadius:'0 12px 12px 12px', border:`1px solid ${color}18` }}>&ldquo;{text}&rdquo;</div>
      </div>
    </div>
  );
}

function Thought({ name, text, color }: { name: string; text: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = '0'; el.style.transform = 'translateX(-48px) scale(0.97)'; el.style.transition = 'none';
    let io: IntersectionObserver;
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.55s cubic-bezier(0.34,1.48,0.64,1), transform 0.55s cubic-bezier(0.34,1.48,0.64,1)';
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { requestAnimationFrame(() => { el.style.opacity='1'; el.style.transform='translateX(0) scale(1)'; }); io.disconnect(); }
      }, { threshold: 0.15 });
      io.observe(el);
    });
    return () => { cancelAnimationFrame(raf); io?.disconnect(); el.style.opacity=''; el.style.transform=''; el.style.transition=''; };
  }, []);
  return (
    <div ref={ref} style={{ margin:'14px 0', padding:'10px 16px', borderRadius:10, background:`${color}07`, border:`1px dashed ${color}28`, borderLeft:`3px solid ${color}` }}>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, fontWeight:700, color, marginBottom:4, letterSpacing:'0.08em' }}>{name} thinks</div>
      <div style={{ fontSize:13, color:'var(--ed-ink2)', fontStyle:'italic', lineHeight:1.65 }}>{text}</div>
    </div>
  );
}

const CodeBlock = ({ code, filename }: { code: string; filename?: string }) => (
  <div style={{ margin:'16px 0', borderRadius:12, overflow:'hidden', border:'1px solid rgba(96,165,250,0.15)', boxShadow:'0 4px 20px rgba(0,0,0,0.18)' }}>
    {filename && <div style={{ background:'#1e293b', padding:'7px 16px', fontSize:9, fontFamily:"'JetBrains Mono',monospace", color:'#64748b', letterSpacing:'0.08em', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{filename}</div>}
    <pre style={{ background:'#0f172a', color:'#93c5fd', fontFamily:"'JetBrains Mono',monospace", fontSize:12, lineHeight:1.75, padding:'16px 20px', margin:0, overflowX:'auto' as const }}><code>{code}</code></pre>
  </div>
);

const SectionIntro = ({ eyebrow, heading, sub }: { eyebrow: string; heading: string; sub?: string }) => (
  <div style={{ marginBottom:28 }}>
    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:ACCENT, letterSpacing:'0.18em', textTransform:'uppercase' as const, marginBottom:8 }}>{eyebrow}</div>
    <h2 style={{ fontFamily:"'Lora',Georgia,serif", fontSize:'clamp(22px,3vw,32px)', fontWeight:700, color:'var(--ed-ink)', lineHeight:1.25, letterSpacing:'-0.02em', marginBottom:sub?10:0 }}>{heading}</h2>
    {sub && <p style={{ fontSize:15, color:'var(--ed-ink3)', lineHeight:1.75 }}>{sub}</p>}
  </div>
);

const KeyBox = ({ title, items, color = ACCENT }: { title: string; items: string[]; color?: string }) => (
  <div style={{ margin:'18px 0', padding:'16px 20px', borderRadius:12, background:`${color}08`, border:`1px solid ${color}22`, borderLeft:`4px solid ${color}` }}>
    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color, letterSpacing:'0.12em', marginBottom:10, textTransform:'uppercase' as const }}>{title}</div>
    <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column' as const, gap:7 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', fontSize:13, color:'var(--ed-ink2)', lineHeight:1.6 }}>
          <span style={{ color, fontWeight:700, flexShrink:0, marginTop:1 }}>→</span><span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

interface Props { onBack: () => void; onNext?: () => void; nextLabel?: string; }

export default function JavaPreRead1WebBackend({ onBack, onNext, nextLabel }: Props) {
  const store = useLearnerStore();
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    store.initSession();
    CONCEPTS.forEach(c => store.ensureConceptState(c.id));
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.getAttribute('data-section');
          if (id) { setActiveSection(id); setCompletedModules(prev => new Set([...prev, id])); store.markSectionCompleted(MODULE_ID, id); }
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20% 0px' });
    const tid = setTimeout(() => { document.querySelectorAll('[data-section]').forEach(el => obs.observe(el)); }, 150);
    return () => { clearTimeout(tid); obs.disconnect(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SWEPreReadLayout
      trackConfig={TRACK_CONFIG}
      moduleLabel="JAVA PRE-READ 01"
      title="Web & Backend Foundations: From Browser Click to Java Service"
      sections={SECTIONS}
      concepts={CONCEPTS}
      completedModules={completedModules}
      activeSection={activeSection}
      onBack={onBack} onNext={onNext} nextLabel={nextLabel}
      hideArticleHeader
    >
      {/* ── HERO ── */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
        style={{ display:'flex', gap:40, alignItems:'flex-start', marginBottom:56, flexWrap:'wrap' as const }}>

        <div style={{ flex:1, minWidth:320 }}>
          <h1 style={{ fontSize:'clamp(28px,3.5vw,44px)', fontWeight:900, lineHeight:1.1, letterSpacing:'-0.03em', color:'var(--ed-ink)', marginBottom:14, fontFamily:"'Lora',serif" }}>
            Web & Backend Foundations:<br />
            <span style={{ color:ACCENT }}>From Browser Click to Java Service</span>
          </h1>
          <p style={{ fontSize:16, color:'var(--ed-ink2)', lineHeight:1.8, maxWidth:520, marginBottom:28, fontStyle:'italic', fontFamily:"'Lora',serif" }}>
            &ldquo;Before Spring Boot, understand the journey. A browser click becomes DNS, HTTP, routing, validation, Java code, response, and browser enforcement.&rdquo;
          </p>

          <div style={{ padding:'14px 18px', borderRadius:12, background:`${ACCENT}08`, border:`1px solid ${ACCENT}22`, borderLeft:`4px solid ${ACCENT}`, marginBottom:28 }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:8, fontWeight:800, color:ACCENT, letterSpacing:'0.15em', marginBottom:12 }}>SITUATION</div>
            <div style={{ fontSize:13, color:'var(--ed-ink2)', lineHeight:1.72, marginBottom:10 }}>
              Vikram&apos;s transaction validator works. Rohan asks the question every backend engineer eventually hears:
            </div>
            <ConvoLine speaker="Rohan" text="Can analysts click a button in the dashboard and see only the transactions that need review?" color="#E8875A" />
            <Thought name="Vikram" text="The Java code already works. The frontend can just call it." color={ACCENT} />
            <ConvoLine speaker="Kavya" text="A browser cannot call a Java method. It sends an HTTP request to a server. The backend's job is to make that request understandable, safe, and predictable." color="#7843EE" />
          </div>

          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:'var(--ed-ink3)', letterSpacing:'0.15em', marginBottom:12, textTransform:'uppercase' as const }}>Characters</div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' as const }}>
            {[
              { name:'Vikram', role:'Junior Backend Eng', color:ACCENT },
              { name:'Kavya',  role:'Senior Backend Eng', color:'#7843EE' },
              { name:'Maya',   role:'QA Engineer',        color:'#D97706' },
              { name:'Rohan',  role:'Product Manager',    color:'#E8875A' },
              { name:'Dev',    role:'DevOps/SRE',         color:'#16A34A' },
              { name:'Asha',   role:'Security Engineer',  color:'#6D28D9' },
            ].map(c => <CharCard key={c.name} {...c} />)}
          </div>
        </div>

        {/* Dark module card */}
        <div style={{ flexShrink:0, width:196, paddingTop:36 }}>
          <div className="float3d" style={{ background:'linear-gradient(145deg,#1e293b,#0f172a)', borderRadius:16, padding:'22px 18px', boxShadow:'0 28px 56px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:ACCENT, letterSpacing:'0.2em', marginBottom:9 }}>MODULE 01</div>
            <div style={{ fontSize:13, fontWeight:800, color:'#F1F5F9', fontFamily:"'Lora',serif", lineHeight:1.35, marginBottom:4 }}>Web & Backend Foundations</div>
            <div style={{ fontSize:10, color:'rgba(241,245,249,0.5)', marginBottom:16 }}>Java · Finova Systems</div>
            <div style={{ height:1, background:'rgba(255,255,255,0.1)', marginBottom:14 }} />
            <div style={{ display:'flex', flexDirection:'column' as const, gap:8 }}>
              {SECTIONS.map((s,i) => (
                <div key={s.id} style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <div style={{ width:4, height:4, borderRadius:'50%', flexShrink:0, background: i===0?ACCENT:'rgba(255,255,255,0.2)' }} />
                  <div style={{ fontSize:9, color: i===0?'#F1F5F9':'rgba(241,245,249,0.35)', fontWeight: i===0?700:400, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{s.label.split(':')[0]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <LedgerLiteWebWorld />

      {/* ── SECTION 01: DNS ── */}
      <section data-section="dns" style={{ marginTop:64 }}>
        <SectionIntro eyebrow="Section 01 · DNS" heading="A URL has to find a server before Java can run" />
        <ConvoLine speaker="Vikram" text="So the browser goes straight to our Java app?" color={ACCENT} />
        <ConvoLine speaker="Dev" text="Not yet. First the browser has to find where that name lives. Names are for humans. Networks route to IP addresses." color="#16A34A" />
        <p style={{ fontSize:14, color:'var(--ed-ink2)', lineHeight:1.75, margin:'16px 0' }}>
          When a user types a URL or clicks a link, the browser needs an IP address. DNS maps a domain name to an address where traffic can be sent.
        </p>
        <KeyBox title="DNS resolution steps" items={[
          'Browser sees ledgerlite.finova.com',
          'Browser or OS checks cache first — faster path if already resolved',
          'On cache miss: DNS resolvers look up the address through root → TLD → authoritative servers',
          'Browser receives IP address: 203.0.113.42',
          'Browser can now open a TCP connection — DNS is done',
        ]} />
        <CodeBlock code={`Human URL:  https://ledgerlite.finova.com/review\nNetwork:    ledgerlite.finova.com → 203.0.113.42`} />
        <DNSLookupVisual />
        <QuizEngine conceptId="dns" conceptName="DNS & Routing" moduleContext="Java Pre-Read 01 · Finova Systems"
          staticQuiz={{ conceptId:'dns', question:'What does DNS do in the browser request flow?',
            options:['Runs Java code on the server','Converts a domain name into an address the network can route to','Adds authorization headers to requests','Stores the response body in the browser'],
            correctIndex:1, explanation:'DNS maps human-readable names like ledgerlite.finova.com to network addresses. It does not execute backend code.' }} />
      </section>

      {/* ── SECTION 02: HTTP ── */}
      <section data-section="http" style={{ marginTop:64 }}>
        <SectionIntro eyebrow="Section 02 · HTTP Anatomy" heading="An HTTP request is the browser's message to the backend" />
        <ConvoLine speaker="Vikram" text="There are headers, method, status, payload, timing. This is more than a URL." color={ACCENT} />
        <ConvoLine speaker="Kavya" text="That row is the contract between the frontend and backend. Learn to read it before writing controllers." color="#7843EE" />
        <KeyBox title="An HTTP request has structured parts" items={[
          'Method — what kind of action: GET reads, POST creates, PATCH updates, DELETE removes',
          'URL/path — which resource is being addressed',
          'Headers — metadata: authorization, content type, cache preferences',
          'Body — data sent with the request, usually JSON on POST/PATCH',
        ]} />
        <CodeBlock filename="request.http" code={`GET /api/transactions?risk=high HTTP/1.1\nHost: ledgerlite.finova.com\nAccept: application/json\nAuthorization: Bearer eyJhbGci...`} />
        <CodeBlock filename="response.http" code={`HTTP/1.1 200 OK\nContent-Type: application/json\n\n[\n  { "id": "TX-1001", "amount": 150000, "currency": "USD", "risk": "HIGH" }\n]`} />
        <HTTPPacketScanner />
        <QuizEngine conceptId="http" conceptName="HTTP Anatomy" moduleContext="Java Pre-Read 01"
          staticQuiz={{ conceptId:'http', question:'Which part of an HTTP request usually tells the backend what action is being requested?',
            options:['Method','Font size','DNS cache','Browser tab title'],
            correctIndex:0, explanation:'The method (GET, POST, PATCH) describes the requested action on the resource.' }} />
      </section>

      {/* ── SECTION 03: REST ── */}
      <section data-section="rest" style={{ marginTop:64 }}>
        <SectionIntro eyebrow="Section 03 · REST" heading="REST turns product actions into resource operations" />
        <p style={{ fontSize:14, color:'var(--ed-ink2)', lineHeight:1.75, margin:'0 0 12px' }}>Rohan writes the endpoint he wants in a ticket: <code style={{ background:'var(--ed-cream)', padding:'2px 7px', borderRadius:5, fontFamily:"'JetBrains Mono',monospace", fontSize:12 }}>/getHighRiskThingsForDashboard</code></p>
        <ConvoLine speaker="Kavya" text="That path names a button. A backend endpoint should name a resource. The action comes from the method and query." color="#7843EE" />
        <KeyBox title="REST-style endpoint design" items={[
          'GET /api/transactions?risk=high — read filtered list',
          'GET /api/transactions/TX-1001 — read one record',
          'POST /api/transactions — create a new record',
          'PATCH /api/transactions/TX-1001/status — update part of a record',
          'DELETE /api/transactions/TX-1001 — remove a record',
        ]} />
        <RESTRouteWorkshop />
        <QuizEngine conceptId="rest" conceptName="REST Design" moduleContext="Java Pre-Read 01"
          staticQuiz={{ conceptId:'rest', question:'Which endpoint is the better REST-style design for reading high-risk transactions?',
            options:['GET /getHighRiskThingsForDashboard','GET /api/transactions?risk=high','POST /doEverything','GET /java/runHighRiskButton'],
            correctIndex:1, explanation:'Name the resource (transactions) and use query params to filter. Avoid action names in paths.' }} />
      </section>

      {/* ── SECTION 04: STATUS CODES ── */}
      <section data-section="status-codes" style={{ marginTop:64 }}>
        <SectionIntro eyebrow="Section 04 · Status Codes" heading="A status code is the backend's first answer" />
        <p style={{ fontSize:14, color:'var(--ed-ink2)', lineHeight:1.75, margin:'0 0 12px' }}>Maya runs a request for a transaction that does not exist. The response body says &ldquo;No transaction found&rdquo; but the status code is <code style={{ background:'var(--ed-cream)', padding:'2px 7px', borderRadius:5, fontFamily:"'JetBrains Mono',monospace", fontSize:12 }}>200</code>.</p>
        <ConvoLine speaker="Maya" text="The frontend thinks this succeeded. The message says it failed. Which one should my test trust?" color="#D97706" />
        <ConvoLine speaker="Kavya" text="The status code should tell the truth first. The body can explain it." color="#7843EE" />
        <KeyBox title="Status codes to know" items={[
          '200 OK — request succeeded and data returned',
          '201 Created — new resource was created',
          '400 Bad Request — client sent invalid input',
          '401 Unauthorized — authentication missing or invalid',
          '403 Forbidden — authenticated but not allowed to access',
          '404 Not Found — resource does not exist',
          '500 Internal Server Error — backend failed unexpectedly',
        ]} />
        <StatusCodeDeck />
        <QuizEngine conceptId="status-codes" conceptName="Status Codes" moduleContext="Java Pre-Read 01"
          staticQuiz={{ conceptId:'status-codes', question:'A transaction ID does not exist. Which status code should the API return?',
            options:['200 OK','201 Created','404 Not Found','500 Internal Server Error'],
            correctIndex:2, explanation:'The request was understandable but the requested resource does not exist — 404.' }} />
      </section>

      {/* ── SECTION 05: HEADERS ── */}
      <section data-section="headers" style={{ marginTop:64 }}>
        <SectionIntro eyebrow="Section 05 · Headers & JSON" heading="Headers explain the message. JSON carries the data." />
        <p style={{ fontSize:14, color:'var(--ed-ink2)', lineHeight:1.75, margin:'0 0 12px' }}>Vikram sends a JSON body from the frontend. The backend rejects it.</p>
        <ConvoLine speaker="Vikram" text="The JSON looks valid." color={ACCENT} />
        <ConvoLine speaker="Kavya" text="The server also needs to know what kind of body it is receiving. That is what headers are for." color="#7843EE" />
        <KeyBox title="Common headers" items={[
          'Content-Type: application/json — tells server the body format',
          'Accept: application/json — tells server the response format wanted',
          'Authorization: Bearer <token> — proves caller identity',
          'Cache-Control: no-store — prevents caching sensitive data',
        ]} />
        <CodeBlock code={`// Without Content-Type: server may reject or misparse body\nPOST /api/transactions\n\n{ "id": "TX-1001", "amount": 150000 }   // ignored!\n\n// With Content-Type: server parses correctly\nPOST /api/transactions\nContent-Type: application/json\n\n{ "id": "TX-1001", "amount": 150000, "currency": "USD" }`} />
        <QuizEngine conceptId="headers" conceptName="Headers & JSON" moduleContext="Java Pre-Read 01"
          staticQuiz={{ conceptId:'headers', question:'Which header tells the backend that the request body is JSON?',
            options:['Content-Type: application/json','Cache-Control: max-age=3600','Host: ledgerlite.finova.com','Accept-Language: en'],
            correctIndex:0, explanation:'Content-Type describes the format of the request body so the server knows how to parse it.' }} />
      </section>

      {/* ── SECTION 06: CORS ── */}
      <section data-section="cors" style={{ marginTop:64 }}>
        <SectionIntro eyebrow="Section 06 · CORS" heading="The browser enforces boundaries your backend must respect" />
        <p style={{ fontSize:14, color:'var(--ed-ink2)', lineHeight:1.75, margin:'0 0 12px' }}>
          Maya opens the dashboard at <code style={{ background:'var(--ed-cream)', padding:'2px 7px', borderRadius:5, fontFamily:"'JetBrains Mono',monospace", fontSize:12 }}>localhost:3000</code>. The API is running at <code style={{ background:'var(--ed-cream)', padding:'2px 7px', borderRadius:5, fontFamily:"'JetBrains Mono',monospace", fontSize:12 }}>localhost:8080</code>. The request fails with a CORS error.
        </p>
        <ConvoLine speaker="Vikram" text="But the API works in Postman." color={ACCENT} />
        <ConvoLine speaker="Asha" text="Postman is not a browser. Browsers protect users by enforcing origin rules. An origin is protocol + domain + port. Even different ports count as different origins." color="#6D28D9" />
        <KeyBox title="CORS headers the server must return" items={[
          'Access-Control-Allow-Origin: http://localhost:3000',
          'Access-Control-Allow-Methods: GET, POST, PATCH',
          'Access-Control-Allow-Headers: Authorization, Content-Type',
        ]} />
        <CORSBrowserGate />
        <QuizEngine conceptId="cors" conceptName="CORS & Browser Trust" moduleContext="Java Pre-Read 01"
          staticQuiz={{ conceptId:'cors', question:'Why can a request work in Postman but fail in the browser?',
            options:['Postman deletes the backend code','Browsers enforce origin rules through CORS, while Postman is not bound by the same browser policy','Java cannot return JSON to browsers','DNS only works for Postman'],
            correctIndex:1, explanation:'The browser enforces cross-origin restrictions. Postman is an API client, not a browser page running under origin rules.' }} />
      </section>

      {/* ── SECTION 07: AUTH ── */}
      <section data-section="auth" style={{ marginTop:64 }}>
        <SectionIntro eyebrow="Section 07 · Auth Basics" heading="Who are you, and what are you allowed to do?" />
        <ConvoLine speaker="Rohan" text="Can we just hide the button for analysts?" color="#E8875A" />
        <ConvoLine speaker="Asha" text="Hide the button, yes. But the backend still has to enforce the rule. Frontend visibility is not security." color="#6D28D9" />
        <KeyBox title="Two separate questions" items={[
          'Authentication — who is making the request? Verify the token, identify the user.',
          'Authorization — what is that user allowed to do? Check permissions for this endpoint.',
          'Missing token → 401 Unauthorized',
          'Valid token but wrong role → 403 Forbidden',
          'Valid token and permitted role → 200 OK + data',
        ]} />
        <CodeBlock code={`GET /api/transactions?risk=high\nAuthorization: Bearer eyJhbGci...\n\n// Backend flow:\n// 1. Verify token signature\n// 2. Extract user identity\n// 3. Check role permissions\n// 4. Return only data allowed for that role`} />
        <AuthCheckpointTunnel />
        <QuizEngine conceptId="auth" conceptName="Auth Basics" moduleContext="Java Pre-Read 01"
          staticQuiz={{ conceptId:'auth', question:'What is the difference between authentication and authorization?',
            options:['Authentication asks who the user is. Authorization asks what they can do.','Authentication is only for CSS. Authorization is only for DNS.','They are the same thing.','Authorization always happens before the user is identified.'],
            correctIndex:0, explanation:'Authentication identifies the caller. Authorization checks what that caller is permitted to do.' }} />
      </section>

      {/* ── SECTION 08: API TESTING ── */}
      <section data-section="api-testing" style={{ marginTop:64 }}>
        <SectionIntro eyebrow="Section 08 · API Testing" heading="Test the API contract before the UI depends on it" />
        <ConvoLine speaker="Maya" text="If the endpoint is clear, I can test it without the UI. If I need the UI to test the API, the contract is not clear enough." color="#D97706" />
        <KeyBox title="LedgerLite API test checklist" items={[
          'GET /api/transactions?risk=high with manager token → 200 + transaction list',
          'GET /api/transactions?risk=high without token → 401',
          'GET /api/transactions?risk=high with analyst token for manager route → 403',
          'GET /api/transactions/TX-UNKNOWN → 404',
          'POST /api/transactions with missing id field → 400',
        ]} />
        <PostmanMissionControl />

        {/* Final reflection */}
        <div style={{ marginTop:32, padding:'18px 24px', borderRadius:14, background:`${ACCENT}07`, border:`1.5px solid ${ACCENT}22`, borderLeft:`4px solid ${ACCENT}` }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:ACCENT, letterSpacing:'0.12em', marginBottom:10 }}>FINAL REFLECTION</div>
          <ConvoLine speaker="Kavya" text="Now you are ready for Spring Boot. Not because you know annotations, but because you know what the annotations will be serving: HTTP contracts." color="#7843EE" />
        </div>

        <QuizEngine conceptId="api-testing" conceptName="API Testing" moduleContext="Java Pre-Read 01"
          staticQuiz={{ conceptId:'api-testing', question:'Why test an API in Postman before wiring the frontend?',
            options:['To prove the API contract works independently from UI behavior','To avoid choosing status codes','To bypass all authentication permanently','To convert Java into JavaScript'],
            correctIndex:0, explanation:'Direct API testing verifies method, URL, headers, body, response, and status before frontend integration.' }} />

        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ marginTop:40, padding:32, background:'var(--ed-card)', borderRadius:14, textAlign:'center' as const, border:`1px solid var(--ed-rule)`, borderTop:`4px solid ${ACCENT}` }}>
          <motion.div animate={{ rotate:[0,8,-8,0] }} transition={{ repeat:Infinity, duration:2 }} style={{ fontSize:36, marginBottom:12 }}>🌐</motion.div>
          <h3 style={{ fontFamily:"'Lora',Georgia,serif", fontSize:22, fontWeight:700, marginBottom:10, color:'var(--ed-ink)' }}>Java Pre-Read 01 Complete</h3>
          <p style={{ fontSize:14, color:'var(--ed-ink2)', lineHeight:1.8, maxWidth:420, margin:'0 auto 24px' }}>
            You traced one dashboard click from DNS to HTTP, REST, headers, CORS, auth, and API testing. The next Java module introduces Spring Boot to build these contracts in code.
          </p>
          <motion.button onClick={onBack} whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            style={{ padding:'12px 28px', borderRadius:8, background:ACCENT, color:'#fff', fontSize:14, fontWeight:600, border:'none', cursor:'pointer' }}>
            Back to Curriculum →
          </motion.button>
        </motion.div>
      </section>
    </SWEPreReadLayout>
  );
}

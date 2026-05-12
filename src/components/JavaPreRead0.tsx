'use client';

/**
 * JavaPreRead0 — Java Pre-Read 00: Language Basics — The Java Runtime Lens
 * Follows Vikram Rao as he builds a transaction validator for LedgerLite at Finova Systems.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import SWEPreReadLayout from './SWEPreReadLayout';
import { SWEMentorFace } from './sweDesignSystem';
import QuizEngine from './QuizEngine';
import {
  JavaRuntimeConveyor,
  StackHeapTheater,
  BusinessRuleGate,
  CollectionProcessingFactory,
  ClassBlueprintAssembler,
  ExceptionRunway,
  JavaIDESimulator,
} from './JavaPreRead0Tools';

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT     = '#3B82F6';
const ACCENT_RGB = '59,130,246';
const MODULE_ID  = 'java-pr-00';

const SECTIONS = [
  { id: 'java-identity',  label: 'Java Identity: Source, Compiler, JVM',       icon: '☕' },
  { id: 'variables',      label: 'Variables and Types: Promises Before Values', icon: '🏷️' },
  { id: 'control-flow',   label: 'Control Flow: Business Rules Become Gates',   icon: '🔀' },
  { id: 'loops',          label: 'Loops and Collections: Processing Many',       icon: '🔁' },
  { id: 'methods',        label: 'Methods and Scope: Name the Unit of Work',    icon: '🔧' },
  { id: 'objects',        label: 'Objects and Classes: Put Meaning Around Data',icon: '📦' },
  { id: 'errors',         label: 'Errors and Validation: Fail Predictably',     icon: '🛡️' },
  { id: 'challenge',      label: 'Final Challenge: Build MiniTransactionValidator', icon: '🏆' },
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

const CONCEPTS = [
  { id: 'java-runtime',      label: 'Java Runtime Pipeline', color: '#3B82F6' },
  { id: 'java-types',        label: 'Type Safety',           color: '#7843EE' },
  { id: 'java-memory',       label: 'Stack & Heap Memory',   color: '#0097A7' },
  { id: 'java-control-flow', label: 'Control Flow',          color: '#D97706' },
  { id: 'java-collections',  label: 'Collections & Loops',   color: '#E8875A' },
  { id: 'java-methods',      label: 'Methods & Scope',       color: '#16A34A' },
  { id: 'java-objects',      label: 'Objects & Classes',     color: '#7843EE' },
  { id: 'java-validation',   label: 'Validation',            color: '#EF4444' },
];

// ─── Shared components ────────────────────────────────────────────────────────

const CharCard = ({ name, role, color }: { name: string; role: string; color: string }) => (
  <div style={{ width: 108, flexShrink: 0, padding: '16px 10px 14px', borderRadius: 20, background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8, textAlign: 'center' as const }}>
    <div style={{ borderRadius: 14, overflow: 'hidden', flexShrink: 0 }}>
      <SWEMentorFace name={name} size={52} />
    </div>
    <div style={{ fontSize: 12, fontWeight: 700, color, lineHeight: 1.2 }}>{name}</div>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: 'var(--ed-ink3)', lineHeight: 1.4 }}>{role}</div>
  </div>
);

const CodeBlock = ({ code, filename }: { code: string; filename?: string }) => (
  <div style={{ margin:'20px 0', borderRadius:12, overflow:'hidden', border:'1px solid rgba(96,165,250,0.15)', boxShadow:'0 4px 20px rgba(0,0,0,0.2)' }}>
    {filename && (
      <div style={{ background:'#1e293b', padding:'8px 16px', fontSize:10, fontFamily:"'JetBrains Mono',monospace", color:'#64748b', letterSpacing:'0.08em', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        {filename}
      </div>
    )}
    <pre style={{ background:'#0f172a', color:'#93c5fd', fontFamily:"'JetBrains Mono',monospace", fontSize:13, lineHeight:1.75, padding:'20px 24px', margin:0, overflowX:'auto' as const }}>
      <code>{code}</code>
    </pre>
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
    <div ref={ref} style={{ display:'flex', gap:12, alignItems:'flex-start', margin:'10px 0', padding:'12px 16px', borderRadius:12, background:'var(--ed-card)', border:`1px solid ${color}1E`, boxShadow:`0 4px 0 ${color}18, inset 0 1px 0 rgba(255,255,255,0.7)` }}>
      <div style={{ flexShrink:0, marginTop:2 }}><SWEMentorFace name={speaker} size={38} /></div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, color, marginBottom:5, letterSpacing:'0.08em', textTransform:'uppercase' as const }}>{speaker}</div>
        <div style={{ fontSize:13, color:'var(--ed-ink)', lineHeight:1.72, background:`${color}0A`, padding:'10px 14px', borderRadius:'0 12px 12px 12px', border:`1px solid ${color}22`, boxShadow:`0 2px 0 ${color}15` }}>&ldquo;{text}&rdquo;</div>
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
    <div ref={ref} style={{ margin:'16px 0', padding:'12px 16px', borderRadius:12, background:'var(--ed-card)', border:`1px solid ${color}22`, borderLeft:`3px solid ${color}`, boxShadow:`0 4px 0 ${color}14, inset 0 1px 0 rgba(255,255,255,0.7)` }}>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:700, color, marginBottom:5, letterSpacing:'0.08em' }}>{name} thinks</div>
      <div style={{ fontSize:13, color:'var(--ed-ink2)', fontStyle:'italic', lineHeight:1.65 }}>{text}</div>
    </div>
  );
}

const SectionIntro = ({ eyebrow, heading, children }: { eyebrow: string; heading: string; children?: React.ReactNode }) => (
  <div style={{ marginBottom:32 }}>
    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:ACCENT, letterSpacing:'0.18em', textTransform:'uppercase' as const, marginBottom:8 }}>{eyebrow}</div>
    <h2 style={{ fontFamily:"'Lora',Georgia,serif", fontSize:'clamp(22px,3vw,32px)', fontWeight:700, color:'var(--ed-ink)', lineHeight:1.25, letterSpacing:'-0.02em', marginBottom:14 }}>{heading}</h2>
    {children}
  </div>
);

const KeyBox = ({ title, items }: { title: string; items: string[] }) => (
  <div style={{ margin:'20px 0', padding:'16px 20px', borderRadius:12, background:`${ACCENT}08`, border:`1px solid ${ACCENT}22`, borderLeft:`4px solid ${ACCENT}` }}>
    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:ACCENT, letterSpacing:'0.12em', marginBottom:10, textTransform:'uppercase' as const }}>{title}</div>
    <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex', flexDirection:'column' as const, gap:7 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', fontSize:13, color:'var(--ed-ink2)', lineHeight:1.6 }}>
          <span style={{ color:ACCENT, fontWeight:700, flexShrink:0, marginTop:1 }}>→</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

interface Props { onBack: () => void; onNext?: () => void; nextLabel?: string; }

export default function JavaPreRead0({ onBack, onNext, nextLabel }: Props) {
  const store = useLearnerStore();
  const [activeSection, setActiveSection]   = useState(SECTIONS[0].id);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    store.initSession();
    CONCEPTS.forEach(c => store.ensureConceptState(c.id));
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.getAttribute('data-section');
          if (id) {
            setActiveSection(id);
            setCompletedModules(prev => new Set([...prev, id]));
            store.markSectionCompleted(MODULE_ID, id);
          }
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
      moduleLabel="JAVA PRE-READ 00"
      title="Language Basics: The Java Runtime Lens"
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

        {/* Left: heading + quote + objectives + characters */}
        <div style={{ flex:1, minWidth:320 }}>
          <h1 style={{ fontSize:'clamp(28px,3.5vw,44px)', fontWeight:900, lineHeight:1.1, letterSpacing:'-0.03em', color:'var(--ed-ink)', marginBottom:16, fontFamily:"'Lora',serif" }}>
            Language Basics:<br />
            <span style={{ color:ACCENT }}>The Java Runtime Lens</span>
          </h1>

          <p style={{ fontSize:17, color:'var(--ed-ink2)', lineHeight:1.8, maxWidth:520, marginBottom:32, fontStyle:'italic', fontFamily:"'Lora',serif" }}>
            &ldquo;Java is not just syntax. It is a contract between your source code, the compiler, the JVM, and the production system that has to trust it.&rdquo;
          </p>

          {/* Learning objectives */}
          <div style={{ background:'var(--ed-card)', borderRadius:10, padding:'20px 24px', border:'1px solid var(--ed-rule)', borderLeft:`4px solid ${ACCENT}`, boxShadow:'0 2px 12px rgba(0,0,0,0.03)', marginBottom:32 }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:ACCENT, letterSpacing:'0.15em', marginBottom:14, textTransform:'uppercase' as const }}>Learning Objectives</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:12 }}>
              {[
                'Explain how .java source becomes JVM bytecode',
                'Use types to make values and operations explicit',
                'Translate product rules into control flow',
                'Process many records with loops and collections',
                'Extract methods with clear inputs and outputs',
                'Model real concepts with classes and objects',
                'Validate unsafe states before they spread',
                'Assemble a small Java transaction validator',
              ].map((obj, i) => (
                <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  <span style={{ color:ACCENT, fontWeight:800, fontFamily:"'JetBrains Mono',monospace", fontSize:11, marginTop:2, flexShrink:0 }}>0{i+1}</span>
                  <span style={{ fontSize:12, color:'var(--ed-ink2)', lineHeight:1.5 }}>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Characters */}
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:'var(--ed-ink3)', letterSpacing:'0.15em', marginBottom:14, textTransform:'uppercase' as const }}>Characters in this Module</div>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' as const }}>
            {[
              { name:'Vikram', role:'Junior Backend Engineer', color:ACCENT },
              { name:'Kavya',  role:'Senior Backend Engineer', color:'#7843EE' },
              { name:'Maya',   role:'QA Engineer',             color:'#D97706' },
              { name:'Rohan',  role:'Product Manager',         color:'#E8875A' },
              { name:'Dev',    role:'DevOps/SRE',              color:'#16A34A' },
            ].map(c => <CharCard key={c.name} {...c} />)}
          </div>
        </div>

        {/* Right: dark module card */}
        <div style={{ flexShrink:0, width:200, paddingTop:40 }}>
          <div className="float3d" style={{ background:'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)', borderRadius:16, padding:'24px 20px', boxShadow:'0 32px 64px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, fontWeight:800, color:ACCENT, letterSpacing:'0.2em', marginBottom:10 }}>MODULE 00</div>
            <div style={{ fontSize:14, fontWeight:800, color:'#F1F5F9', fontFamily:"'Lora',serif", lineHeight:1.3, marginBottom:4 }}>Language Basics</div>
            <div style={{ fontSize:10, color:'rgba(241,245,249,0.5)', marginBottom:18 }}>Java · Finova Systems</div>
            <div style={{ height:1, background:'rgba(255,255,255,0.1)', marginBottom:14 }} />
            <div style={{ display:'flex', flexDirection:'column' as const, gap:8 }}>
              {SECTIONS.map((s, i) => (
                <div key={s.id} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:4, height:4, borderRadius:'50%', flexShrink:0, background: i === 0 ? ACCENT : 'rgba(255,255,255,0.2)' }} />
                  <div style={{ fontSize:9, color: i === 0 ? '#F1F5F9' : 'rgba(241,245,249,0.38)', fontWeight: i === 0 ? 700 : 400, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{s.label.split(':')[0]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── SECTION 01: JAVA IDENTITY ── */}
      <section data-section="java-identity">
        <SectionIntro eyebrow="Section 01 · Java Identity" heading="A Java program is built before it runs">
          <p style={{ fontSize:15, color:'var(--ed-ink3)', lineHeight:1.75 }}>
            Rohan drops into the backend channel just after standup. What sounds like a two-line rule turns into Vikram&apos;s first lesson in how Java actually works.
          </p>
        </SectionIntro>

        <ConvoLine speaker="Rohan" text="Can we flag risky transactions before they hit the analyst queue? High-value international payments should not look the same as normal transfers." color="#E8875A" />
        <Thought name="Vikram" text="That sounds like an if statement. Maybe two." color={ACCENT} />
        <p style={{ fontSize:14, color:'var(--ed-ink2)', lineHeight:1.75, margin:'16px 0' }}>
          He writes a tiny Java file and expects to run it like a script. The IDE complains before anything reaches the console.
        </p>
        <ConvoLine speaker="Kavya" text="That stop sign is the point. Java has a build step. Source code becomes bytecode before the JVM runs it. If the contract is broken, the JVM never gets the chance to guess." color="#7843EE" />

        <KeyBox title="Java has three mental layers" items={[
          'Source code — the .java file humans edit',
          'Compilation — javac checks the source and produces bytecode (.class files)',
          'Runtime — the JVM loads and runs bytecode on any platform',
        ]} />

        <CodeBlock filename="Main.java" code={`public class Main {
    public static void main(String[] args) {
        System.out.println("LedgerLite risk check started");
    }
}`} />

        <KeyBox title="What each part does" items={[
          'public class Main — Java code lives inside classes. The filename must match the class name.',
          'main — the program entry point. The JVM looks for this exact signature.',
          'String[] args — inputs passed from the command line.',
          'System.out.println — write text to the console.',
        ]} />

        <JavaRuntimeConveyor />

        <QuizEngine
          conceptId="java-runtime"
          conceptName="Java Runtime Pipeline"
          moduleContext="Java Pre-Read 00 · Finova Systems. Vikram learns why Java has a build step."
          staticQuiz={{
            conceptId: 'java-runtime',
            question: 'What happens before Java code runs on the JVM?',
            options: [
              'The browser interprets the .java file directly',
              'javac compiles source code into bytecode',
              'The database converts Java into SQL',
              'Java skips compilation when code is short',
            ],
            correctIndex: 1,
            explanation: 'Java source is compiled into bytecode by javac first. The JVM then runs that bytecode — no source interpretation, no guessing.',
          }}
        />

        <p style={{ fontSize:13, color:'var(--ed-ink3)', fontStyle:'italic', marginTop:20, lineHeight:1.7 }}>
          Vikram now understands why Java needs the compiler. His next mistake is smaller but more revealing: he gives a number the wrong kind of value.
        </p>
      </section>

      {/* ── SECTION 02: VARIABLES AND TYPES ── */}
      <section data-section="variables" style={{ marginTop:64 }}>
        <SectionIntro eyebrow="Section 02 · Variables and Types" heading="A type is a promise the compiler can check">
          <p style={{ fontSize:15, color:'var(--ed-ink3)', lineHeight:1.75 }}>
            Vikram starts modeling one transaction. Amount, currency, country, risk. He immediately hits a compile error that teaches him something important.
          </p>
        </SectionIntro>

        <p style={{ fontSize:14, color:'var(--ed-ink2)', lineHeight:1.75, margin:'0 0 12px' }}>He writes:</p>
        <CodeBlock code={`int amount = "500";`} />

        <ConvoLine speaker="Vikram" text="But the text says 500. A human can see it is a number." color={ACCENT} />
        <ConvoLine speaker="Kavya" text="A human can infer. A backend system should not have to. In Java, the type tells the program which operations are legal." color="#7843EE" />

        <CodeBlock filename="Transaction.java" code={`int amount = 500;           // whole number
String currency = "INR";   // text
boolean highValue = amount > 100000;  // true or false
double fee = 12.75;        // decimal number`} />

        <KeyBox title="Primitive vs Reference" items={[
          'Primitive (int, boolean, double, char): value stored directly in the variable',
          'Reference (String, Transaction, List): variable holds a reference — the object lives on the heap',
          'Two reference variables can point to the same object — mutating through one affects the other',
        ]} />

        <StackHeapTheater />

        <QuizEngine
          conceptId="java-types"
          conceptName="Java Type Safety"
          moduleContext="Java Pre-Read 00 · Variables and types."
          staticQuiz={{
            conceptId: 'java-types',
            question: 'Why does `int amount = "500";` fail to compile?',
            options: [
              'Java does not support numbers',
              'The variable name is too long',
              'A String value cannot be assigned to an int',
              'The code needs a loop',
            ],
            correctIndex: 2,
            explanation: '"500" is a String. int expects a whole number. The compiler catches this type mismatch before the JVM ever gets a chance to run.',
          }}
        />

        <QuizEngine
          conceptId="java-memory"
          conceptName="Primitive vs Reference"
          moduleContext="Java Pre-Read 00 · Stack and heap memory model."
          staticQuiz={{
            conceptId: 'java-memory',
            question: 'Which Java value is a reference to an object on the heap?',
            options: [
              'int amount = 500;',
              'boolean approved = true;',
              'Transaction tx = new Transaction(...);',
              "char grade = 'A';",
            ],
            correctIndex: 2,
            explanation: 'tx stores a reference to a Transaction object on the heap. int, boolean, and char are primitives — their values live directly in stack slots.',
          }}
        />
      </section>

      {/* ── SECTION 03: CONTROL FLOW ── */}
      <section data-section="control-flow" style={{ marginTop:64 }}>
        <SectionIntro eyebrow="Section 03 · Control Flow" heading="Product rules become gates">
          <p style={{ fontSize:15, color:'var(--ed-ink3)', lineHeight:1.75 }}>
            Rohan clarifies the request. Kavya pushes Vikram to stop writing comments and start writing conditions.
          </p>
        </SectionIntro>

        <ConvoLine speaker="Rohan" text="High-value international payments should go to review. Normal domestic payments should pass through." color="#E8875A" />
        <p style={{ fontSize:14, color:'var(--ed-ink2)', margin:'12px 0', lineHeight:1.75 }}>Vikram writes a comment: <code style={{ background:'var(--ed-cream)', padding:'2px 6px', borderRadius:4, fontFamily:"'JetBrains Mono',monospace", fontSize:12 }}>// flag risky transactions</code></p>
        <ConvoLine speaker="Kavya" text="A comment cannot route a transaction. Make the rule executable." color="#7843EE" />

        <CodeBlock filename="RiskCheck.java" code={`String riskLevel;

if (amount > 100000 && !currency.equals("INR")) {
    riskLevel = "HIGH";
} else {
    riskLevel = "NORMAL";
}`} />

        <KeyBox title="Reading the condition" items={[
          'amount > 100000 — checks the size. Only high-value transactions pass this gate.',
          '!currency.equals("INR") — checks non-INR currency. The ! means "not".',
          '&& — both conditions must be true simultaneously.',
          'The output is explicit: either "HIGH" or "NORMAL" — never vague.',
        ]} />

        <ConvoLine speaker="Maya" text="What about INR 200000? What about USD 300? What about a missing currency?" color="#D97706" />
        <ConvoLine speaker="Kavya" text="That is why branches need examples. Every branch is a promise about behavior." color="#7843EE" />

        <BusinessRuleGate />

        <QuizEngine
          conceptId="java-control-flow"
          conceptName="Java Control Flow"
          moduleContext="Java Pre-Read 00 · Control flow and business rules."
          staticQuiz={{
            conceptId: 'java-control-flow',
            question: 'Which condition best represents "high-value non-INR transaction"?',
            options: [
              'amount > 100000 && !currency.equals("INR")',
              'amount > 100000 || currency.equals("INR")',
              'amount < 100000 && currency.equals("INR")',
              'currency = "INR"',
            ],
            correctIndex: 0,
            explanation: 'Both conditions must be true simultaneously: amount > 100000 AND currency is not INR. && enforces both must hold — || would be too permissive.',
          }}
        />
      </section>

      {/* ── SECTION 04: LOOPS ── */}
      <section data-section="loops" style={{ marginTop:64 }}>
        <SectionIntro eyebrow="Section 04 · Loops and Collections" heading="A loop applies one rule to many records">
          <p style={{ fontSize:15, color:'var(--ed-ink3)', lineHeight:1.75 }}>
            One transaction validator is not enough. Maya sends 200 test records.
          </p>
        </SectionIntro>

        <ConvoLine speaker="Maya" text="Here are 200 transactions. Some are tiny, some are international, some are malformed. Your validator should not only work on the first example." color="#D97706" />
        <Thought name="Vikram" text="So I need the same rule across a list." color={ACCENT} />
        <ConvoLine speaker="Kavya" text="Exactly. A collection holds many values. A loop moves through them one at a time." color="#7843EE" />

        <CodeBlock filename="Processor.java" code={`List<Integer> amounts = List.of(1200, 450000, 9000);

for (int amount : amounts) {
    System.out.println(classify(amount));
}`} />

        <p style={{ fontSize:14, color:'var(--ed-ink2)', margin:'16px 0', lineHeight:1.75 }}>Then upgrade to transaction objects:</p>

        <CodeBlock filename="Processor.java" code={`List<Transaction> transactions = List.of(tx1, tx2, tx3);

for (Transaction tx : transactions) {
    String result = TransactionValidator.classify(tx);
    System.out.println(result);
}`} />

        <KeyBox title="The collection mental model" items={[
          'List<Transaction> — an ordered group of Transaction objects',
          'for (Transaction tx : transactions) — tx is the current item. The body runs once per item.',
          'Map<String, Integer> — a lookup from key to value (e.g., currency → exchange rate)',
          'The loop body is a promise: same rule, every input in the collection',
        ]} />

        <CollectionProcessingFactory />

        <QuizEngine
          conceptId="java-collections"
          conceptName="Java Collections and Loops"
          moduleContext="Java Pre-Read 00 · Loops and collections."
          staticQuiz={{
            conceptId: 'java-collections',
            question: 'In `for (Transaction tx : transactions)`, what does `tx` represent?',
            options: [
              'The whole list',
              'The current transaction being processed',
              'The JVM runtime',
              'The compiled .class file',
            ],
            correctIndex: 1,
            explanation: 'In an enhanced for loop, tx is the current item from the collection. The loop body runs once per transaction in the list.',
          }}
        />
      </section>

      {/* ── SECTION 05: METHODS ── */}
      <section data-section="methods" style={{ marginTop:64 }}>
        <SectionIntro eyebrow="Section 05 · Methods and Scope" heading="Name the unit of work">
          <p style={{ fontSize:15, color:'var(--ed-ink3)', lineHeight:1.75 }}>
            Vikram&apos;s main method now has printing, rule checks, sample data, and error handling in one place. Kavya points out the problem.
          </p>
        </SectionIntro>

        <ConvoLine speaker="Kavya" text="If everything lives in main, nothing has a name. If nothing has a name, nothing is easy to test." color="#7843EE" />

        <CodeBlock filename="TransactionValidator.java" code={`static boolean isHighValue(int amount) {
    return amount > 100000;
}

static boolean isInternational(String currency) {
    return !currency.equals("INR");
}

static String classify(int amount, String currency) {
    if (isHighValue(amount) && isInternational(currency)) {
        return "REVIEW";
    }
    return "APPROVED";
}`} />

        <KeyBox title="What makes a good method" items={[
          'Parameters are inputs — declared with a type, scoped to this method only',
          'Return type is the output promise — the caller can rely on it',
          'Variables inside a method are invisible outside it (scope)',
          'Method names should reflect product meaning, not implementation trivia',
        ]} />

        <ConvoLine speaker="Kavya" text="A method is not just shorter code. It is a reusable decision with a name." color="#7843EE" />

        <QuizEngine
          conceptId="java-methods"
          conceptName="Java Methods and Scope"
          moduleContext="Java Pre-Read 00 · Methods and scope."
          staticQuiz={{
            conceptId: 'java-methods',
            question: 'Why extract `isHighValue(int amount)` into its own method?',
            options: [
              'To hide code from the compiler',
              'To create a named, reusable rule with a clear input and output',
              'To make Java dynamically typed',
              'To avoid writing tests',
            ],
            correctIndex: 1,
            explanation: 'Methods name behavior, accept typed inputs, and return explicit outputs. isHighValue becomes a reusable, testable rule — not just shorter code.',
          }}
        />
      </section>

      {/* ── SECTION 06: OBJECTS AND CLASSES ── */}
      <section data-section="objects" style={{ marginTop:64 }}>
        <SectionIntro eyebrow="Section 06 · Objects and Classes" heading="A class keeps related meaning together">
          <p style={{ fontSize:15, color:'var(--ed-ink3)', lineHeight:1.75 }}>
            Maya reports a strange result: the validator marked an INR transaction as USD. Amount and currency had travelled as separate variables and got mixed up.
          </p>
        </SectionIntro>

        <ConvoLine speaker="Maya" text="The validator marked an INR transaction as USD. I think the amount and currency came from different rows." color="#D97706" />
        <ConvoLine speaker="Vikram" text="I passed them as separate variables." color={ACCENT} />
        <ConvoLine speaker="Kavya" text="Then the code had no way to know they belonged together. Make the concept real." color="#7843EE" />

        <CodeBlock filename="Transaction.java" code={`class Transaction {
    String id;
    int amount;
    String currency;

    Transaction(String id, int amount, String currency) {
        this.id = id;
        this.amount = amount;
        this.currency = currency;
    }
}`} />

        <CodeBlock code={`Transaction tx = new Transaction("TX-1001", 150000, "USD");`} />

        <KeyBox title="Class concepts" items={[
          'class Transaction — the blueprint. Defines the shape every instance will have.',
          'id, amount, currency — fields. The state belonging to one transaction.',
          'Transaction(...) — the constructor. Creates one valid starting instance.',
          'new Transaction(...) — creates an object. The instance lives on the heap.',
        ]} />

        <ClassBlueprintAssembler />

        <QuizEngine
          conceptId="java-objects"
          conceptName="Java Classes and Objects"
          moduleContext="Java Pre-Read 00 · Classes and instances."
          staticQuiz={{
            conceptId: 'java-objects',
            question: 'What is a Java class best understood as?',
            options: [
              'A one-time variable',
              'A blueprint for creating objects with related data and behavior',
              'A database table Java automatically saves',
              'A console command',
            ],
            correctIndex: 1,
            explanation: 'A class defines the shape and behavior that object instances will have. Transaction is the blueprint — new Transaction(...) stamps one instance from it.',
          }}
        />
      </section>

      {/* ── SECTION 07: ERRORS AND VALIDATION ── */}
      <section data-section="errors" style={{ marginTop:64 }}>
        <SectionIntro eyebrow="Section 07 · Errors and Validation" heading="Invalid states should stop early">
          <p style={{ fontSize:15, color:'var(--ed-ink3)', lineHeight:1.75 }}>
            Dev joins the review after a staging failure. The service accepted a transaction with a blank ID — and silently continued.
          </p>
        </SectionIntro>

        <ConvoLine speaker="Dev" text="The service accepted a transaction with a blank ID. The logs show review decisions, but no one can trace which transaction caused them." color="#16A34A" />
        <ConvoLine speaker="Vikram" text="The code did not crash." color={ACCENT} />
        <ConvoLine speaker="Dev" text="That is the problem. It kept going with data it could not trust." color="#16A34A" />

        <CodeBlock filename="TransactionValidator.java" code={`static void validate(Transaction tx) {
    if (tx.id == null || tx.id.isBlank()) {
        throw new IllegalArgumentException("Transaction id is required");
    }

    if (tx.amount < 0) {
        throw new IllegalArgumentException("Amount cannot be negative");
    }
}`} />

        <KeyBox title="Validation principles" items={[
          'Validate near the boundary — check input before it enters deeper processing',
          'Exceptions explain the violated rule — the message is documentation',
          'Failing early prevents silent data corruption downstream',
          'A blank ID that passes validation becomes untraceable in production logs',
        ]} />

        <ConvoLine speaker="Kavya" text="Java cannot know your business rules by itself. But once you state them, it can help enforce them." color="#7843EE" />

        <ExceptionRunway />

        <QuizEngine
          conceptId="java-validation"
          conceptName="Java Validation and Exceptions"
          moduleContext="Java Pre-Read 00 · Validation and exception handling."
          staticQuiz={{
            conceptId: 'java-validation',
            question: 'Why throw an exception for a blank transaction ID?',
            options: [
              'To make the code longer',
              'To fail early when the program reaches an invalid state',
              'To skip compilation',
              'To convert the ID into a number',
            ],
            correctIndex: 1,
            explanation: 'Blank IDs are invalid. Throwing an exception stops execution immediately, preventing unsafe data from reaching downstream systems where failures become untraceable.',
          }}
        />
      </section>

      {/* ── SECTION 08: FINAL CHALLENGE ── */}
      <section data-section="challenge" style={{ marginTop:64 }}>
        <SectionIntro eyebrow="Section 08 · Final Challenge" heading="Build the MiniTransactionValidator">
          <p style={{ fontSize:15, color:'var(--ed-ink3)', lineHeight:1.75 }}>
            Rohan wants the feature in the sprint demo. Maya wants testable behavior. Dev wants predictable logs. Kavya gives Vikram one final task.
          </p>
        </SectionIntro>

        <ConvoLine speaker="Kavya" text="Do not build a giant system. Build one honest slice. Source, types, rule, loop, object, validation, output. If that slice is clear, the service can grow safely." color="#7843EE" />

        <p style={{ fontSize:14, color:'var(--ed-ink2)', lineHeight:1.75, margin:'16px 0' }}>
          Use the IDE panel below to complete the validator. Work through each exercise in order — from Hello LedgerLite to the full transaction pipeline.
        </p>

        <KeyBox title="Expected behavior" items={[
          'TX-1001 (USD 150,000) → prints REVIEW',
          'TX-1002 (INR 9,000) → prints APPROVED',
          'TX-1003 (blank ID) → throws IllegalArgumentException: Transaction id is required',
        ]} />

        <JavaIDESimulator />

        <div style={{ marginTop:32, padding:'20px 24px', borderRadius:14, background:`${ACCENT}08`, border:`1.5px solid ${ACCENT}22`, borderLeft:`4px solid ${ACCENT}` }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:800, color:ACCENT, letterSpacing:'0.12em', marginBottom:8 }}>FINAL REFLECTION</div>
          <p style={{ fontSize:14, color:'var(--ed-ink2)', lineHeight:1.75, marginBottom:12 }}>
            When a product request says &ldquo;just flag risky transactions&rdquo;, what are the hidden Java contracts you now know to ask for?
          </p>
          <p style={{ fontSize:13, color:'var(--ed-ink3)', fontStyle:'italic', lineHeight:1.7 }}>
            The PM should clarify what counts as risky, which fields define a transaction, what invalid data should be rejected, what output the service should produce, and how failures should appear in logs.
          </p>
        </div>

      </section>
    </SWEPreReadLayout>
  );
}

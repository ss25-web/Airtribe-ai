'use client';
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useLearnerStore } from '@/lib/learnerStore';
import { motion } from 'framer-motion';
import {
  ChapterSection, para, h2, TiltCard, ApplyItBox, keyBox, PMPrincipleBox
} from './pm-fundamentals/designSystem';
import SWEPreReadLayout from './SWEPreReadLayout';
import { QuickTry, SituationCard, SWEConversationScene, SWEMentorFace } from './sweDesignSystem';

const ACCENT = '#16A34A';
const ACCENT_RGB = '22,163,74';
const MODULE_ID = 'python-pr-01';

const SECTIONS = [
  { id: 'intro', label: 'Introduction & Storyline' },
  { id: 'execution', label: '1–3. Execution & PVM' },
  { id: 'types-vars', label: '4–6. Typing, Variables & Data' },
  { id: 'collections', label: '7. Collections' },
  { id: 'control', label: '8–9. Control Flow & Example' },
  { id: 'exercise', label: '10. Thought Exercise' },
];

const TRACK_CONFIG = {
  name: 'Python',
  accent: '#16A34A',
  accentRgb: '22,163,74',
  protagonist: 'Aisha',
  role: 'Junior Software Engineer',
  company: 'Vela',
  mentor: 'Riya',
  mentorRole: 'Senior Software Engineer',
  mentorColor: '#0369A1'
};

const CodeBlock = ({ code }: { code: string }) => (
  <pre style={{
    background: '#0f172a', color: '#86efac', fontFamily: "'JetBrains Mono', monospace",
    fontSize: '14px', lineHeight: 1.7, borderRadius: '10px', padding: '20px 24px',
    margin: '24px 0', overflowX: 'auto', border: '1px solid rgba(134,239,172,0.12)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
  }}>
    <code>{code}</code>
  </pre>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: '24px' }}>
    {h2(children)}
    <div style={{ width: '40px', height: '3px', background: ACCENT, borderRadius: '2px', marginTop: '-8px' }} />
  </div>
);

interface Props { onBack: () => void }

export default function PythonPreRead1({ onBack }: Props) {
  const store = useLearnerStore();
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  
  const completedModules = useMemo(() => {
    return new Set(store.completedSections[MODULE_ID] || [SECTIONS[0].id]);
  }, [store.completedSections]);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.getAttribute('data-nav-id');
          if (id) {
            setActiveSection(id);
            store.markSectionCompleted(MODULE_ID, id);
          }
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20% 0px' });
    
    document.querySelectorAll('[data-nav-id]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <SWEPreReadLayout
      trackConfig={TRACK_CONFIG}
      moduleLabel="PYTHON PRE-READ 01"
      title="Core Language & Data Model"
      sections={SECTIONS}
      completedModules={completedModules}
      activeSection={activeSection}
      onBack={onBack}
    >
      {/* ── MODULE HERO ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', marginBottom: '56px', flexWrap: 'wrap' }}
      >
        {/* Left Column: Title & Objectives */}
        <div style={{ flex: 1, minWidth: '320px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ed-ink3)', marginBottom: '28px', letterSpacing: '0.04em' }}>
            Software Engineering <span style={{ margin: '0 8px', color: 'var(--ed-rule)' }}>›</span>
            <span style={{ color: 'var(--ed-ink2)' }}>Python Track</span>
            <span style={{ margin: '0 10px', color: 'var(--ed-rule)' }}>·</span>
            <span style={{ color: 'var(--ed-ink3)' }}>45 min · 6 parts</span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, lineHeight: 1.1, 
            letterSpacing: '-0.03em', color: 'var(--ed-ink)', marginBottom: '18px',
            fontFamily: "'Lora', serif" 
          }}>
            Core Language &<br />
            <span style={{ color: ACCENT }}>Python Data Model</span>
          </h1>

          <p style={{ fontSize: '17px', color: 'var(--ed-ink2)', lineHeight: 1.8, maxWidth: '540px', marginBottom: '36px', fontStyle: 'italic', fontFamily: "'Lora', serif" }}>
            &ldquo;Python is not just a language; it is a mental model for how objects behave and interact in memory.&rdquo;
          </p>

          {/* Learning Objectives Card */}
          <div style={{ 
            background: 'var(--ed-card)', borderRadius: '10px', padding: '24px', 
            border: '1px solid var(--ed-rule)', borderLeft: `4px solid ${ACCENT}`,
            boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: ACCENT, letterSpacing: '0.15em', marginBottom: '16px', textTransform: 'uppercase' }}>Learning Objectives</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                'Understand how Python runs your code (PVM)',
                'Master the "Variables as Names" mental model',
                'Differentiate between Mutable and Immutable objects',
                'Navigate Python\'s built-in collection types'
              ].map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: ACCENT, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', marginTop: '2px' }}>0{i+1}</span>
                  <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.5 }}>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Floating Module Card */}
        <div style={{ flexShrink: 0, width: '200px', paddingTop: '40px' }}>
          <div className="float3d" style={{ 
            background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)', 
            borderRadius: '16px', padding: '24px 20px', 
            boxShadow: '0 32px 64px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: ACCENT, letterSpacing: '0.2em', marginBottom: '12px' }}>MODULE 01</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#F1F5F9', fontFamily: "'Lora', serif", lineHeight: 1.3, marginBottom: '6px' }}>Language Basics</div>
            <div style={{ fontSize: '10px', color: 'rgba(241,245,249,0.5)', marginBottom: '20px' }}>Python Track</div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '16px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SECTIONS.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: i === 0 ? ACCENT : 'rgba(255,255,255,0.2)' }} />
                  <div style={{ fontSize: '9px', color: i === 0 ? '#F1F5F9' : 'rgba(241,245,249,0.4)', fontWeight: i === 0 ? 700 : 400 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── CHARACTERS LINEUP ── */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.15em', marginBottom: '16px', textTransform: 'uppercase' }}>Characters in this Module</div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {[
            { name: 'Aisha', role: 'Junior SE · Blue Basket', desc: "Starting her first day. Needs to understand how Python's engine actually handles her data before shipping features.", color: ACCENT, mentor: false },
            { name: 'Riya', role: 'Senior SE · Mentor', desc: "Believes clear mental models beat memorized syntax. She'll be pushing Aisha to think in objects, not just lines.", color: '#0369A1', mentor: true }
          ].map((c, i) => (
            <div key={i} style={{ 
              flex: 1, minWidth: '240px', background: 'var(--ed-card)', borderRadius: '12px', border: '1px solid var(--ed-rule)', padding: '20px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)', position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${c.color}` }}>
                  {c.mentor ? <SWEMentorFace name={c.name} size={44} /> : <div style={{ width: 44, height: 44, background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '14px' }}>AI</div>}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: c.color }}>{c.name}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: 'var(--ed-ink3)' }}>{c.role}</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.6, fontStyle: 'italic' }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <ChapterSection id="intro" data-nav-id="intro" num="01" accentRgb={ACCENT_RGB} first>
        <SectionTitle>The Situation</SectionTitle>
        <SituationCard protagonist="Aisha" accentColor={ACCENT}>
          Aisha has just joined Blue Basket. Her first task seems simple: update the inventory system to handle new product arrivals. She opens the existing Python code, but it looks different from the scripts she wrote in college. Variables are being assigned to other variables, and changes in one part of the code seem to affect data elsewhere. Riya sees her hesitation and pulls up a chair.
        </SituationCard>

        <SWEConversationScene
          track="python"
          mentorName="Riya"
          mentorRole="Senior Software Engineer"
          mentorColor="#0369A1"
          lines={[
            { speaker: 'protagonist', text: "I'm looking at this list of products, and I'm worried about accidentally modifying the database when I just want to filter some items." },
            { speaker: 'mentor', text: "That's a very valid concern in Python. People get tripped up because they think variables are like 'boxes' holding data." },
            { speaker: 'protagonist', text: "Aren't they? I put 'price = 10' and x is the box for 10." },
            { speaker: 'mentor', text: "In Python, it's more like a luggage tag. 'price' is a tag you've clipped onto the object '10'. If you clip another tag to it, they're both pointing to the same thing." },
          ]}
        />
      </ChapterSection>

      <ChapterSection id="execution" data-nav-id="execution" num="01" accentRgb={ACCENT_RGB}>
        <SectionTitle>1. What Python is and how it runs</SectionTitle>
        {para(<>Python is a <strong>high-level, general-purpose language</strong>.</>)}
        {para('A high-level language is designed for humans to read and write more easily. It hides many low-level machine details.')}
        {para('A general-purpose language is not limited to one use case. Python can be used for backend development, automation, data work, AI, scripting, testing, and education.')}
        {para('That flexibility is one reason Python is often the first programming language people learn.')}

        <div style={{ height: '40px' }} />

        <SectionTitle>2. Python Execution Model</SectionTitle>
        {para('A simple way to think about Python execution is:')}
        <div style={{ fontFamily: "'JetBrains Mono', monospace", background: 'var(--ed-card)', padding: '16px 24px', borderRadius: '8px', border: '1px solid var(--ed-rule)', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--ed-ink)', margin: '24px 0' }}>
          Source Code → Bytecode → Python Virtual Machine
        </div>

        {para(<strong>Source code</strong>)}
        {para('This is the .py file you write.')}
        
        <QuickTry
          track="python"
          problem="Multiply price by quantity and print the result."
          initialCode={`price = 100\nquantity = 3\n# Print the total price`}
          hint="Try print(price * quantity)"
          onRun={() => {}}
          evaluateOutput={(code) => {
            if (code.includes('print(price * quantity)')) return { status: 'success', text: '300' };
            if (code.includes('print')) return { status: 'success', text: '(Result printed)' };
            return { status: 'success', text: '(No output yet...)' };
          }}
        />

        {para(<strong>Compilation to bytecode</strong>)}
        {para('Python compiles the source into bytecode, which is an intermediate representation.')}

        {para(<strong>Execution by PVM</strong>)}
        {para('That bytecode is executed by the Python Virtual Machine (PVM).')}
        {para('This is a useful mental model because it explains why Python is portable and why your code often behaves similarly across systems.')}

        <TiltCard style={{ marginTop: '32px' }}>
          <ApplyItBox color={ACCENT} prompt="Create a 3D educational mockup showing how Python code runs. Scene should show three floating panels from left to right labeled “Source Code”, “Bytecode”, and “Python Virtual Machine”. The first panel should display simple readable Python code. The second should show abstract intermediate instruction blocks, not machine code gibberish. The third should show a clean engine-like virtual execution box processing instructions. Add directional arrows between stages. Make it look like a premium beginner-friendly technical explainer with soft shadows, subtle depth, readable typography, neutral background, and minimal green-blue accent lighting. No clutter, no cartoon style, no extra objects." />
        </TiltCard>

        <div style={{ height: '40px' }} />

        <SectionTitle>3. Python Virtual Machine (PVM)</SectionTitle>
        {para('The PVM is the software layer that executes Python bytecode.')}
        {para('A beginner does not need to know all internal details, but one thing matters:')}
        <blockquote style={{ borderLeft: `4px solid ${ACCENT}`, padding: '16px 24px', background: `${ACCENT}10`, borderRadius: '0 8px 8px 0', margin: '24px 0', fontSize: '18px', fontStyle: 'italic', fontFamily: "'Lora', serif", color: 'var(--ed-ink)' }}>
          Python code does not directly become CPU instructions in the simplest beginner mental model. It moves through an abstraction layer.
        </blockquote>
        {para('This abstraction helps Python feel consistent across platforms.')}
      </ChapterSection>

      <ChapterSection id="types-vars" data-nav-id="types-vars" num="02" accentRgb={ACCENT_RGB}>
        <SectionTitle>4. Typing in Python</SectionTitle>
        {para(<>Python is <strong>dynamically typed</strong> and <strong>strongly typed</strong>.</>)}
        
        {para(<strong>Dynamic typing</strong>)}
        {para('You do not declare variable types in advance.')}
        <CodeBlock code={`x = 10\nname = "Asha"\nis_open = True`} />
        {para('Python figures out the type at runtime.')}

        {para(<strong>Strong typing</strong>)}
        {para('Python does not allow careless mixing of incompatible types.')}
        
        <QuickTry
          track="python"
          problem="Try to combine a string and a number. See Python's strong typing in action."
          initialCode={`# Python is strongly typed.\n# Try: print("Total: " + 100)`}
          hint="Try print('Total: ' + str(100)) to fix it!"
          onRun={() => {}}
          evaluateOutput={(code) => {
            if (code.includes('"Total: " + 100') || code.includes("'Total: ' + 100")) return { status: 'error', text: 'TypeError: can only concatenate str (not "int") to str' };
            if (code.includes('str(100)')) return { status: 'success', text: 'Total: 100' };
            return { status: 'success', text: '(Output matches your code...)' };
          }}
        />

        <div style={{ height: '40px' }} />

        <SectionTitle>5. Variables as references</SectionTitle>
        {para(<>A Python variable is better understood as a <strong>name bound to an object</strong>.</>)}
        <CodeBlock code={`x = 10\ny = x`} />
        {para('Here, x and y both refer to the same object.')}
        {para('This becomes very important with mutable collections.')}
        <CodeBlock code={`items = ["pen", "book"]\ncart = items\ncart.append("bottle")\nprint(items)`} />
        {para('Output:')}
        <CodeBlock code={`['pen', 'book', 'bottle']`} />
        {para('Why? Because both names refer to the same list object.')}

        <TiltCard style={{ marginTop: '32px' }}>
          <ApplyItBox color={ACCENT} prompt="Create a 3D educational mockup explaining Python variables as references. Show two floating label cards named “x” and “y” pointing toward the same glowing object card labeled “10”. The composition should clearly communicate that variable names refer to objects, not boxes storing separate copies. Use clean connector lines, minimal scene design, premium educational styling, soft studio light, and readable labels. Neutral background with subtle depth. No childish illustrations." />
        </TiltCard>

        <div style={{ height: '40px' }} />

        <SectionTitle>6. Core Data Types</SectionTitle>
        
        {para(<strong>Numbers</strong>)}
        {para('Python supports integers and floating-point numbers.')}
        <CodeBlock code={`count = 5\nrating = 4.5`} />

        {para(<strong>Booleans</strong>)}
        {para('Booleans represent truth values.')}
        <CodeBlock code={`is_member = True\nis_stock_available = False`} />

        {para(<strong>Floating-point precision issues</strong>)}
        <CodeBlock code={`print(0.1 + 0.2)`} />
        {para('You may see:')}
        <CodeBlock code={`0.30000000000000004`} />
        {para('That happens because decimal fractions are often approximated in binary floating-point representation.')}

        {para(<strong>Strings</strong>)}
        {para(<>Strings represent text and are <strong>immutable</strong>.</>)}
        <CodeBlock code={`name = "Blue Basket"\nprint(name[0])\nprint(name[0:4])`} />
        {para('Strings support slicing, concatenation, membership checks, and many helper methods.')}
      </ChapterSection>

      <ChapterSection id="collections" data-nav-id="collections" num="03" accentRgb={ACCENT_RGB}>
        <SectionTitle>7. Collections and Data Structures</SectionTitle>
        
        {para(<strong>Lists</strong>)}
        {para('Ordered and mutable.')}
        <CodeBlock code={`products = ["milk", "bread", "eggs"]\nproducts.append("butter")`} />

        {para(<strong>Tuples</strong>)}
        {para('Ordered and immutable.')}
        <CodeBlock code={`location = (12.97, 77.59)`} />

        {para(<strong>Sets</strong>)}
        {para('Unique and unordered.')}
        <CodeBlock code={`tags = {"grocery", "fresh", "organic"}`} />

        {para(<strong>Dictionaries</strong>)}
        {para('Key-value mappings with fast lookup.')}
        
        <QuickTry
          track="python"
          problem="Access the price from the product dictionary."
          initialCode={`product = {\n    "name": "milk",\n    "price": 40,\n    "in_stock": True\n}\n# Print the price of the product`}
          hint="Try print(product['price'])"
          onRun={() => {}}
          evaluateOutput={(code) => {
            if (code.includes('product["price"]') || code.includes("product['price']")) return { status: 'success', text: '40' };
            return { status: 'success', text: '(Access a key to see its value!)' };
          }}
        />

        <TiltCard style={{ marginTop: '32px' }}>
          <ApplyItBox color={ACCENT} prompt="Create a 3D comparative educational mockup showing four Python collection types side by side. Panel 1 labeled “List” should show ordered editable items. Panel 2 labeled “Tuple” should show ordered locked items. Panel 3 labeled “Set” should show unique scattered tokens with duplicates removed visually. Panel 4 labeled “Dictionary” should show key-value cards connected in pairs. Make the layout balanced, premium, and very clear for beginners. Use minimal colors, soft shadows, readable labels, and clean depth. No unnecessary effects." />
        </TiltCard>
      </ChapterSection>

      <ChapterSection id="control" data-nav-id="control" num="04" accentRgb={ACCENT_RGB}>
        <SectionTitle>8. Control Flow</SectionTitle>
        {para('Control flow helps programs make decisions and repeat work.')}
        
        {para(<strong>Conditionals</strong>)}
        <CodeBlock code={`stock = 10\nif stock > 0:\n    print("Item available")\nelse:\n    print("Out of stock")`} />

        {para(<strong>Truthy vs falsy</strong>)}
        {para('Empty strings, empty lists, zero, None, and False behave as falsy values.')}
        <CodeBlock code={`cart = []\nif cart:\n    print("Cart has items")\nelse:\n    print("Cart is empty")`} />

        {para(<strong>Loops</strong>)}
        
        <QuickTry
          track="python"
          problem="Loop through products and print them."
          initialCode={`products = ["milk", "bread", "eggs"]\n# Write a for loop here`}
          hint="Try: for p in products: print(p)"
          onRun={() => {}}
          evaluateOutput={(code) => {
            if (code.includes('for') && code.includes('print')) return { status: 'success', text: 'milk\nbread\neggs' };
            return { status: 'success', text: '(Try writing a for loop!)' };
          }}
        />

        <div style={{ height: '40px' }} />

        <SectionTitle>9. Mini example</SectionTitle>
        <CodeBlock code={`products = {\n    "milk": 40,\n    "bread": 25,\n    "eggs": 60\n}\n\ncart = ["milk", "eggs"]\ntotal = 0\n\nfor item in cart:\n    if item in products:\n        total += products[item]\n\nif total > 0:\n    print("Total bill:", total)\nelse:\n    print("Cart is empty")`} />

        <TiltCard style={{ marginTop: '32px' }}>
          <ApplyItBox color={ACCENT} prompt="Create a 3D educational flowchart mockup for Python control flow. Show a decision diamond labeled “if / elif / else”, a looping circular path labeled “for / while”, and two side markers labeled “break” and “continue”. The visual should feel like a polished IDE concept board with readable labels, arrow-based logic, subtle depth, premium minimal design, and beginner-friendly clarity. Keep the background neutral and uncluttered." />
        </TiltCard>
      </ChapterSection>

      <ChapterSection id="exercise" data-nav-id="exercise" num="05" accentRgb={ACCENT_RGB}>
        <SectionTitle>10. Thought exercise</SectionTitle>
        {para('Imagine you are building the first version of Blue Basket’s store assistant.')}
        {para('Which Python structures would you use for these, and why?')}
        <ul style={{ fontSize: '16px', lineHeight: 1.85, color: 'var(--ed-ink2)', paddingLeft: '24px' }}>
          <li>a shopping cart,</li>
          <li>store coordinates,</li>
          <li>unique promo codes already used,</li>
          <li>customer profile details,</li>
          <li>checking whether the store should display “open” or “closed”.</li>
        </ul>
      </ChapterSection>
    </SWEPreReadLayout>
  );
}

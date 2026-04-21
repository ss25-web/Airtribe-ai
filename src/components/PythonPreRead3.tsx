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
const MODULE_ID = 'python-pr-03';

const SECTIONS = [
  { id: 'intro', label: 'Why this pre-read matters' },
  { id: 'reliability', label: '1. Reliability' },
  { id: 'io-formats', label: '2–3. File I/O & Formats' },
  { id: 'exceptions', label: '4–5. Exceptions & Defensive Code' },
  { id: 'environments', label: '6–8. Venvs, PIP, Reproducibility' },
  { id: 'types-integration', label: '9–11. Types, Example & Exercise' },
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

export default function PythonPreRead3({ onBack }: Props) {
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
      moduleLabel="PYTHON PRE-READ 03"
      title="Reliability, Environments, and Readiness"
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
            <span style={{ color: 'var(--ed-ink3)' }}>50 min · 6 parts</span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, lineHeight: 1.1, 
            letterSpacing: '-0.03em', color: 'var(--ed-ink)', marginBottom: '18px',
            fontFamily: "'Lora', serif" 
          }}>
            Reliability &<br />
            <span style={{ color: ACCENT }}>Production Readiness</span>
          </h1>

          <p style={{ fontSize: '17px', color: 'var(--ed-ink2)', lineHeight: 1.8, maxWidth: '540px', marginBottom: '36px', fontStyle: 'italic', fontFamily: "'Lora', serif" }}>
            &ldquo;Ready in dev is not ready in production. Software that lasts is software that anticipates failure.&rdquo;
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
                'Build resilient systems with Exception Handling',
                'Isolate dependencies using Virtual Environments',
                'Prepare for scale with Type Hinting',
                'Standardize IO with proper File Handling and JSON'
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
            background: 'linear-gradient(145deg, #1E3A8A 0%, #1E40AF 100%)', 
            borderRadius: '16px', padding: '24px 20px', 
            boxShadow: '0 32px 64px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#BFDBFE', letterSpacing: '0.2em', marginBottom: '12px' }}>MODULE 03</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#F1F5F9', fontFamily: "'Lora', serif", lineHeight: 1.3, marginBottom: '6px' }}>Production Readiness</div>
            <div style={{ fontSize: '10px', color: 'rgba(241,245,249,0.5)', marginBottom: '20px' }}>Python Track</div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '16px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SECTIONS.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: i === 0 ? '#60A5FA' : 'rgba(255,255,255,0.2)' }} />
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
            { name: 'Aisha', role: 'Junior SE · Blue Basket', desc: "Feeling confident after finishing her logic. Now Aisha faces the reality of production: missing files, wrong library versions, and data edge cases.", color: ACCENT, mentor: false },
            { name: 'Riya', role: 'Senior SE · Mentor', desc: "Known for code that 'never breaks'. Riya will teach Aisha how to build defensive shells around her functions.", color: '#0369A1', mentor: true }
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
        <SectionTitle>The Reality Check</SectionTitle>
        <SituationCard protagonist="Aisha" accentColor={ACCENT}>
          Aisha's inventory system is finally logic-complete. It runs perfectly on her laptop. She hands it to the operations team, but an hour later, she gets a Slack message: "The script crashed. Something about a missing CSV file." Then another: "Wait, it says I'm missing a library called 'pandas'." Riya smiles—this is the rite of passage.
        </SituationCard>

        <SWEConversationScene
          track="python"
          mentorName="Riya"
          mentorRole="Senior Software Engineer"
          mentorColor="#0369A1"
          lines={[
            { speaker: 'protagonist', text: "It works on my machine! I don't understand why they're getting errors. They're just supposed to run 'python main.py'." },
            { speaker: 'mentor', text: "Welcome to the real world. Your machine is a curated garden. Production is a wild jungle of different versions, missing files, and bad inputs." },
            { speaker: 'protagonist', text: "So I have to write code that 'expects' to fail? That sounds like I'm not confident in my logic." },
            { speaker: 'mentor', text: "Confidence comes from knowing exactly how your code will fail. Reliability isn't about code that never crashes—it's about code that explains why it crashed and doesn't take the whole server down with it." },
          ]}
        />
      </ChapterSection>

      <ChapterSection id="reliability" data-nav-id="reliability" num="01" accentRgb={ACCENT_RGB}>
        <SectionTitle>1. Reliability in Python Programs</SectionTitle>
        {para('Reliable programs behave sensibly in both normal and abnormal conditions.')}
        {para('That means:')}
        <ul style={{ fontSize: '16px', lineHeight: 1.85, color: 'var(--ed-ink2)', paddingLeft: '24px' }}>
          <li>they work for expected input,</li>
          <li>they fail clearly for bad input,</li>
          <li>they remain maintainable,</li>
          <li>they communicate problems well.</li>
        </ul>
      </ChapterSection>

      <ChapterSection id="io-formats" data-nav-id="io-formats" num="02" accentRgb={ACCENT_RGB}>
        <SectionTitle>2. File Input/Output (I/O)</SectionTitle>
        {para(<strong>File modes</strong>)}
        <ul style={{ fontSize: '16px', lineHeight: 1.85, color: 'var(--ed-ink2)', paddingLeft: '24px', marginBottom: '24px' }}>
          <li>r read</li>
          <li>w write</li>
          <li>a append</li>
          <li>b binary</li>
        </ul>

        {para(<strong>Safe file handling with with</strong>)}
        
        <QuickTry
          track="python"
          problem="Open a file safely and print its contents."
          initialCode={`# Safe way to handle files\nwith open("inventory.txt", "w") as f:\n    f.write("Milk: 20\\nBread: 10")\n\n# Now read it back\nwith open("inventory.txt", "r") as f:\n    print(f.read())`}
          hint="Try printing f.read()"
          onRun={() => {}}
          evaluateOutput={(code) => {
            if (code.includes('f.read()')) return { status: 'success', text: 'Milk: 20\nBread: 10' };
            return { status: 'success', text: '(File system simulation active)' };
          }}
        />

        <div style={{ height: '40px' }} />

        <SectionTitle>3. Working with File Formats</SectionTitle>
        {para(<strong>Text files</strong>)}
        {para('Good for logs and simple outputs.')}

        {para(<strong>CSV files</strong>)}
        <CodeBlock code={`import csv\nwith open("products.csv", "r") as file:\n    reader = csv.DictReader(file)\n    for row in reader:\n        print(row["name"], row["price"])`} />

        {para(<strong>JSON files</strong>)}
        
        <QuickTry
          track="python"
          problem="Load data from a JSON string."
          initialCode={`import json\n\ndata_str = '{"name": "Milk", "price": 40}'\n# Load the data into a dictionary\ndata = json.loads(data_str)\nprint(data["name"])`}
          hint="Try print(data['price'])"
          onRun={() => {}}
          evaluateOutput={(code) => {
            if (code.includes('data["name"]') || code.includes("data['name']")) return { status: 'success', text: 'Milk' };
            if (code.includes('data["price"]') || code.includes("data['price']")) return { status: 'success', text: '40' };
            return { status: 'success', text: '(JSON parsed!)' };
          }}
        />

        <TiltCard style={{ marginTop: '32px' }}>
          <ApplyItBox color={ACCENT} prompt="Create a 3D comparative educational mockup showing three file formats used in Python: text, CSV, and JSON. Display three floating cards side by side with readable sample structure on each. Text should look like simple lines, CSV should look like rows and columns, JSON should look like nested key-value objects. Make it premium, clean, and clearly instructional. Avoid clutter and keep labels highly readable." />
        </TiltCard>
      </ChapterSection>

      <ChapterSection id="exceptions" data-nav-id="exceptions" num="03" accentRgb={ACCENT_RGB}>
        <SectionTitle>4. Exception Handling</SectionTitle>
        {para('Python uses exceptions to handle failure.')}
        
        <QuickTry
          track="python"
          problem="Use try/except to handle a division by zero error."
          initialCode={`try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print("Cannot divide by zero!")`}
          hint="Try adding result = 10 / 2 inside the try block to see the difference."
          onRun={() => {}}
          evaluateOutput={(code) => {
            if (code.includes('10 / 0')) return { status: 'success', text: 'Cannot divide by zero!' };
            if (code.includes('10 / 2')) return { status: 'success', text: '5.0' };
            return { status: 'success', text: '(Exception handled!)' };
          }}
        />

        {para(<strong>else and finally</strong>)}
        <CodeBlock code={`try:\n    value = int("42")\nexcept ValueError:\n    print("Invalid")\nelse:\n    print("Success", value)\nfinally:\n    print("Done")`} />

        <TiltCard style={{ marginTop: '32px' }}>
          <ApplyItBox color={ACCENT} prompt="Create a 3D educational mockup visualizing Python exception handling. Show a main execution path entering a “try” block, branching to clearly labeled “except” handlers for different error types, an “else” success path, and a “finally” cleanup path. The composition should clearly teach flow of control. Use polished technical styling, readable labels, subtle depth." />
        </TiltCard>

        <div style={{ height: '40px' }} />

        <SectionTitle>5. Defensive Programming</SectionTitle>
        {para('Defensive programming means planning for bad input and failure.')}

        {para(<strong>Input validation</strong>)}
        <CodeBlock code={`def calculate_total(price, quantity):\n    if not isinstance(quantity, int):\n        raise TypeError("quantity must be an integer")\n    if quantity < 0:\n        raise ValueError("quantity cannot be negative")\n    return price * quantity`} />
      </ChapterSection>

      <ChapterSection id="environments" data-nav-id="environments" num="04" accentRgb={ACCENT_RGB}>
        <SectionTitle>6. Virtual Environments</SectionTitle>
        {para('Virtual environments isolate dependencies for each project.')}
        <CodeBlock code={`python -m venv venv`} />
        
        <SectionTitle>7. Package Management (pip)</SectionTitle>
        <CodeBlock code={`pip install requests\npip install --upgrade requests`} />

        <SectionTitle>8. Reproducible Environments</SectionTitle>
        {para('A requirements.txt file helps keep environments consistent.')}
        <CodeBlock code={`requests==2.32.0\npandas==2.2.2`} />
      </ChapterSection>

      <ChapterSection id="types-integration" data-nav-id="types-integration" num="05" accentRgb={ACCENT_RGB}>
        <SectionTitle>9. Type Hints</SectionTitle>
        {para('Type hints improve readability and tooling.')}
        <CodeBlock code={`def calculate_total(price: float, quantity: int) -> float:\n    return price * quantity`} />

        <TiltCard style={{ marginTop: '32px' }}>
          <ApplyItBox color={ACCENT} prompt="Create a 3D educational mockup explaining Python type hints. Show a code card with a function signature using annotations, and surrounding helper panels representing IDE suggestions, error checking. The visual should communicate that type hints improve clarity and tooling." />
        </TiltCard>

        <div style={{ height: '40px' }} />

        <SectionTitle>10. Bringing everything together</SectionTitle>
        <CodeBlock code={`import json\n\nclass InvalidOrderError(Exception):\n    pass\n\n\ndef save_order(order: dict, filename: str) -> None:\n    if "customer" not in order or "items" not in order:\n        raise InvalidOrderError("order must include customer and items")\n\n    with open(filename, "w") as file:\n        json.dump(order, file)\n\n\ntry:\n    order_data = {\n        "customer": "Riya",\n        "items": ["milk", "bread"]\n    }\n    save_order(order_data, "order.json")\nexcept InvalidOrderError as e:\n    print("Order error:", e)\nexcept OSError as e:\n    print("File error:", e)\nelse:\n    print("Order saved successfully")`} />

        <div style={{ height: '40px' }} />

        <SectionTitle>11. Thought exercise</SectionTitle>
        {para('Imagine Blue Basket is about to be used by real customers.')}
        {para('What could go wrong in these situations, and how would you design for safety?')}
        <ul style={{ fontSize: '16px', lineHeight: 1.85, color: 'var(--ed-ink2)', paddingLeft: '24px' }}>
          <li>a product file is missing,</li>
          <li>a customer enters text instead of quantity,</li>
          <li>a JSON file has incomplete order data,</li>
          <li>a teammate runs the project without the right packages,</li>
          <li>a developer misunderstands what type a function expects.</li>
        </ul>
      </ChapterSection>
    </SWEPreReadLayout>
  );
}

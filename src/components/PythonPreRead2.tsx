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
const MODULE_ID = 'python-pr-02';

const SECTIONS = [
  { id: 'intro', label: 'Why this pre-read matters' },
  { id: 'functions', label: '1–3. Functions & Parameters' },
  { id: 'adv-functions', label: '4–6. First-Class, Lambdas, HOFs' },
  { id: 'oop', label: '7–9. OOP, Classes, Encapsulation' },
  { id: 'adv-oop', label: '10–12. Inheritance, Poly, ABCs' },
  { id: 'modules', label: '13–14. Modules & Packages' },
  { id: 'exercise', label: '15–16. Example & Exercise' },
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

export default function PythonPreRead2({ onBack }: Props) {
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
      moduleLabel="PYTHON PRE-READ 02"
      title="Functions, OOP, and Code Organization"
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
            <span style={{ color: 'var(--ed-ink3)' }}>55 min · 7 parts</span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, lineHeight: 1.1, 
            letterSpacing: '-0.03em', color: 'var(--ed-ink)', marginBottom: '18px',
            fontFamily: "'Lora', serif" 
          }}>
            Logic, Abstraction &<br />
            <span style={{ color: ACCENT }}>Code Organization</span>
          </h1>

          <p style={{ fontSize: '17px', color: 'var(--ed-ink2)', lineHeight: 1.8, maxWidth: '540px', marginBottom: '36px', fontStyle: 'italic', fontFamily: "'Lora', serif" }}>
            &ldquo;Computational thinking is about separating what a piece of code does from how it is implemented.&rdquo;
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
                'Define reusable logic with Functions and Scope',
                'Pass behavior around with First-Class and Lambda functions',
                'Model complex data with Classes and Objects',
                'Orchestrate large systems using Modules and Packages'
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
            background: 'linear-gradient(145deg, #064E3B 0%, #065F46 100%)', 
            borderRadius: '16px', padding: '24px 20px', 
            boxShadow: '0 32px 64px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#A7F3D0', letterSpacing: '0.2em', marginBottom: '12px' }}>MODULE 02</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#F1F5F9', fontFamily: "'Lora', serif", lineHeight: 1.3, marginBottom: '6px' }}>Logic & Abstraction</div>
            <div style={{ fontSize: '10px', color: 'rgba(241,245,249,0.5)', marginBottom: '20px' }}>Python Track</div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '16px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SECTIONS.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: i === 0 ? '#34D399' : 'rgba(255,255,255,0.2)' }} />
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
            { name: 'Aisha', role: 'Junior SE · Blue Basket', desc: "Her logic works, but it's getting long. Aisha needs to bridge the gap between 'code that runs' and 'code that lives' for others to read.", color: ACCENT, mentor: false },
            { name: 'Riya', role: 'Senior SE · Mentor', desc: "Focuses on 'systems thinking'. Riya will challenge Aisha to wrap complexity into simple, clean interfaces.", color: '#0369A1', mentor: true }
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
        <SectionTitle>The Next Challenge</SectionTitle>
        <SituationCard protagonist="Aisha" accentColor={ACCENT}>
          The inventory system is growing. Aisha now needs to calculate discounts, verify shipping addresses, and format receipts. She has dozens of blocks of code doing similar things. Every time she finds a bug in one calculation, she has to fix it in five other places. Riya notices her frustration.
        </SituationCard>

        <SWEConversationScene
          track="python"
          mentorName="Riya"
          mentorRole="Senior Software Engineer"
          mentorColor="#0369A1"
          lines={[
            { speaker: 'protagonist', text: "I've copied this discount logic three times now. It works, but it feels like I'm building a house by gluing bricks together one by one." },
            { speaker: 'mentor', text: "That's exactly what it is. You're building a 'script', not a 'system'. Systems are built with machines that build the bricks for you." },
            { speaker: 'protagonist', text: "So I should use functions? I know how to define them, but I don't know when a block of code 'earned' the right to be a function." },
            { speaker: 'mentor', text: "If you have to describe what a block of code does in a sentence, and that sentence contains the word 'and', it's probably two functions. Logic organization is about isolating behaviors." },
          ]}
        />
      </ChapterSection>

      <ChapterSection id="functions" data-nav-id="functions" num="01" accentRgb={ACCENT_RGB}>
        <SectionTitle>1. Functions as Building Blocks</SectionTitle>
        {para('A function is a named reusable block of logic.')}
        <CodeBlock code={`def calculate_total(price, quantity):\n    return price * quantity`} />
        {para('Functions help reduce repetition and improve modularity.')}

        <TiltCard style={{ marginTop: '32px' }}>
          <ApplyItBox color={ACCENT} prompt="Create a 3D educational mockup visualizing a Python function as a transformation unit. Show an input tray labeled “arguments”, a central processing box labeled with a simple function definition, and an output tray labeled “return value”. Make it feel like a premium technical teaching diagram, not industrial machinery. Use floating cards, clean arrows, readable code snippet styling, soft light, neutral background, and minimal accents." />
        </TiltCard>

        <div style={{ height: '40px' }} />

        <SectionTitle>2. Defining and Calling Functions</SectionTitle>
        {para(<strong>Syntax</strong>)}
        
        <QuickTry
          track="python"
          problem="Complete the greet function and call it."
          initialCode={`def greet(name):\n    # Return a hello message\n    return f"Hello, {name}"\n\n# Call the function here\nprint(greet("Aisha"))`}
          hint="Try greet('Your Name')"
          onRun={() => {}}
          evaluateOutput={(code) => {
            const match = code.match(/greet\(['"](.*)['"]\)/);
            if (match) return { status: 'success', text: `Hello, ${match[1]}` };
            return { status: 'success', text: '(Try calling the function!)' };
          }}
        />
        
        {para(<strong>Parameters vs arguments</strong>)}
        <ul style={{ fontSize: '16px', lineHeight: 1.85, color: 'var(--ed-ink2)', paddingLeft: '24px', marginBottom: '24px' }}>
          <li>Parameters are declared in the function definition.</li>
          <li>Arguments are the actual values passed in a function call.</li>
        </ul>

        <div style={{ height: '40px' }} />

        <SectionTitle>3. Function Parameters in Depth</SectionTitle>
        {para(<strong>Positional arguments</strong>)}
        <CodeBlock code={`def introduce(name, city):\n    print(name, city)`} />
        
        {para(<strong>Keyword arguments</strong>)}
        <CodeBlock code={`introduce(city="Bengaluru", name="Asha")`} />

        {para(<strong>Default parameters</strong>)}
        <CodeBlock code={`def greet(name, greeting="Hello"):\n    print(greeting, name)`} />

        {para(<strong>Variable-length arguments</strong>)}
        <CodeBlock code={`def add_all(*args):\n    return sum(args)\n\ndef show_profile(**kwargs):\n    print(kwargs)`} />
      </ChapterSection>

      <ChapterSection id="adv-functions" data-nav-id="adv-functions" num="02" accentRgb={ACCENT_RGB}>
        <SectionTitle>4. Functions as First-Class Objects</SectionTitle>
        {para('In Python, functions can be assigned, passed, and returned.')}
        <CodeBlock code={`def greet(name):\n    return f"Hello, {name}"\n\nsay_hello = greet\nprint(say_hello("Asha"))`} />
        
        <QuickTry
          track="python"
          problem="Assign a function to a new name and call it."
          initialCode={`def square(x): return x * x\n\n# Assign square to 'f'\nf = square\n# Print f(5)`}
          hint="Try print(f(5))"
          onRun={() => {}}
          evaluateOutput={(code) => {
            if (code.includes('f(5)')) return { status: 'success', text: '25' };
            return { status: 'success', text: '(Assign and call!)' };
          }}
        />

        <TiltCard style={{ marginTop: '32px' }}>
          <ApplyItBox color={ACCENT} prompt="Create a 3D educational mockup showing that functions are first-class objects in Python. Show one function card being assigned to a variable card, another function card being passed into a second function, and a third path showing a function being returned from another function. The layout should clearly communicate assign, pass, and return behaviors. Use premium UI-style cards, connector arrows, readable labels, subtle depth, and a clean technical style." />
        </TiltCard>

        <div style={{ height: '40px' }} />

        <SectionTitle>5. Lambda Functions</SectionTitle>
        {para('Lambdas are short anonymous functions.')}
        <CodeBlock code={`square = lambda x: x * x`} />
        {para('They are often used with tools like map and filter.')}

        <div style={{ height: '40px' }} />

        <SectionTitle>6. Higher-Order Functions</SectionTitle>
        {para(<strong>map</strong>)}
        <CodeBlock code={`numbers = [1, 2, 3]\nprint(list(map(lambda x: x * 2, numbers)))`} />

        {para(<strong>filter</strong>)}
        <CodeBlock code={`numbers = [1, 2, 3, 4]\nprint(list(filter(lambda x: x % 2 == 0, numbers)))`} />
      </ChapterSection>

      <ChapterSection id="oop" data-nav-id="oop" num="03" accentRgb={ACCENT_RGB}>
        <SectionTitle>7. Object-Oriented Programming (OOP)</SectionTitle>
        {para('OOP is a way to structure code around objects that combine data and behavior.')}
        {para('For Blue Basket, Product, Customer, and Cart are natural examples of objects.')}

        <div style={{ height: '40px' }} />

        <SectionTitle>8. Classes and Objects</SectionTitle>
        
        <QuickTry
          track="python"
          problem="Create a class and instantiate it."
          initialCode={`class Product:\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\n\n# Create a product object\nmilk = Product("Milk", 40)\nprint(milk.name)`}
          hint="Try print(milk.price)"
          onRun={() => {}}
          evaluateOutput={(code) => {
            if (code.includes('milk.name')) return { status: 'success', text: 'Milk' };
            if (code.includes('milk.price')) return { status: 'success', text: '40' };
            return { status: 'success', text: '(Result printed)' };
          }}
        />

        <TiltCard style={{ marginTop: '32px' }}>
          <ApplyItBox color={ACCENT} prompt="Create a 3D educational mockup explaining Python classes and objects. Show one larger blueprint-style card labeled “Class: Product” containing attributes and methods, and two smaller instance cards labeled “milk” and “bread” created from that blueprint. Add arrows from class to instances. Make the scene clean, structured, readable, and visually premium, like a polished software education graphic. No cartoon characters." />
        </TiltCard>

        <div style={{ height: '40px' }} />

        <SectionTitle>9. Encapsulation and State</SectionTitle>
        {para('Encapsulation means keeping related data and behavior together while controlling how state changes.')}
        
        {para(<strong>Public, protected, private-like attributes</strong>)}
        {para('Python uses conventions:')}
        <ul style={{ fontSize: '16px', lineHeight: 1.85, color: 'var(--ed-ink2)', paddingLeft: '24px', marginBottom: '24px' }}>
          <li>name → public</li>
          <li>_name → protected by convention</li>
          <li>__name → name-mangled private-like</li>
        </ul>
        <CodeBlock code={`class Wallet:\n    def __init__(self, balance):\n        self._balance = balance\n\n    def deposit(self, amount):\n        if amount > 0:\n            self._balance += amount`} />
      </ChapterSection>

      <ChapterSection id="adv-oop" data-nav-id="adv-oop" num="04" accentRgb={ACCENT_RGB}>
        <SectionTitle>10. Inheritance</SectionTitle>
        {para('Inheritance lets one class build on another.')}
        <CodeBlock code={`class User:\n    def __init__(self, name):\n        self.name = name\n\n    def greet(self):\n        print(f"Hello, {self.name}")\n\nclass Customer(User):\n    def __init__(self, name, member_id):\n        super().__init__(name)\n        self.member_id = member_id`} />

        {para(<strong>Method overriding</strong>)}
        <CodeBlock code={`class Admin(User):\n    def greet(self):\n        print(f"Admin access granted to {self.name}")`} />

        <TiltCard style={{ marginTop: '32px' }}>
          <ApplyItBox color={ACCENT} prompt="Create a 3D educational mockup for inheritance in Python. Show a parent card labeled “User” at the top and child cards labeled “Customer” and “Admin” below it. Add inheritance connector lines downward. Show one inherited method card and one overridden method card to explain reuse and specialization. Keep the design minimal, readable, and premium with soft shadows and technical clarity." />
        </TiltCard>

        <div style={{ height: '40px' }} />

        <SectionTitle>11. Polymorphism</SectionTitle>
        {para('Different objects can respond differently to the same method.')}
        <CodeBlock code={`class CardPayment:\n    def process(self):\n        print("Processing card payment")\n\nclass UpiPayment:\n    def process(self):\n        print("Processing UPI payment")`} />

        <div style={{ height: '40px' }} />
        
        <SectionTitle>12. Abstract Base Classes</SectionTitle>
        <CodeBlock code={`from abc import ABC, abstractmethod\n\nclass PaymentMethod(ABC):\n    @abstractmethod\n    def process(self, amount):\n        pass`} />
        {para('Abstract base classes define interfaces and expected behavior.')}
      </ChapterSection>

      <ChapterSection id="modules" data-nav-id="modules" num="05" accentRgb={ACCENT_RGB}>
        <SectionTitle>13. Modules and Namespaces</SectionTitle>
        {para('A module is just a Python file.')}
        <CodeBlock code={`import math\nprint(math.sqrt(16))`} />
        {para('Namespaces help Python map names to objects and avoid collisions.')}

        <div style={{ height: '40px' }} />

        <SectionTitle>14. Packages and Project Structure</SectionTitle>
        {para('As projects grow, directory-based organization becomes necessary.')}
        <CodeBlock code={`blue_basket/\n    app.py\n    products/\n        catalog.py\n        inventory.py\n    orders/\n        cart.py\n        checkout.py\n    users/\n        customer.py\n        auth.py`} />

        <TiltCard style={{ marginTop: '32px' }}>
          <ApplyItBox color={ACCENT} prompt="Create a 3D educational mockup showing Python code organization. Display a root project folder as a clean floating structure with subfolders and module files. Include readable labels like “app.py”, “users”, “orders”, “products”, and show how modules sit inside packages. Make it look like a polished IDE file explorer translated into a 3D teaching visual. Minimal, clean, premium, with readable text and subtle depth." />
        </TiltCard>
      </ChapterSection>

      <ChapterSection id="exercise" data-nav-id="exercise" num="06" accentRgb={ACCENT_RGB}>
        <SectionTitle>15. Mini example</SectionTitle>
        <CodeBlock code={`class Product:\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\n\nclass Cart:\n    def __init__(self):\n        self.items = []\n\n    def add_item(self, product):\n        self.items.append(product)\n\n    def total(self):\n        return sum(item.price for item in self.items)\n\ndef apply_discount(amount):\n    if amount > 100:\n        return amount - 10\n    return amount`} />

        <div style={{ height: '40px' }} />

        <SectionTitle>16. Thought exercise</SectionTitle>
        {para('Blue Basket is expanding. Which parts would you model as classes and which parts would you keep as functions?')}
        <ul style={{ fontSize: '16px', lineHeight: 1.85, color: 'var(--ed-ink2)', paddingLeft: '24px' }}>
          <li>customer,</li>
          <li>product,</li>
          <li>shopping cart,</li>
          <li>payment methods,</li>
          <li>discount rules.</li>
        </ul>
      </ChapterSection>
    </SWEPreReadLayout>
  );
}

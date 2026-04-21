'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, RoundedBox, Sphere } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import type { SWETrack, SWELevel } from './sweTypes';
import { BASICS_STORY } from './sweBasicsStoryData';
import { StoryCard, SWEConversationScene, SWEAvatar, QuickTry, DataBehaviorVisualizer } from './sweDesignSystem';

// --- Types ---
interface Props { track: SWETrack; level: SWELevel; onBack: () => void; }

const TRACK_CONFIG: Record<SWETrack, {
  name: string; emoji: string; color: string; colorHex: number;
  gradientA: string; gradientB: string; bg: string;
}> = {
  java: { name: 'Java', emoji: '☕', color: '#0369A1', colorHex: 0x0369a1, gradientA: '#0369A1', gradientB: '#7C3AED', bg: 'rgba(3,105,161,0.06)' },
  python: { name: 'Python', emoji: '🐍', color: '#16A34A', colorHex: 0x16a34a, gradientA: '#16A34A', gradientB: '#0D9488', bg: 'rgba(22,163,74,0.06)' },
  nodejs: { name: 'Node.js', emoji: '⚡', color: '#CA8A04', colorHex: 0xca8a04, gradientA: '#CA8A04', gradientB: '#16A34A', bg: 'rgba(202,138,4,0.06)' },
};

// --- Navigation ---
const SECTIONS = [
  { id: 'identity', label: 'Language Identity' },
  { id: 'types', label: 'Variables & Types' },
  { id: 'flow', label: 'Control Flow' },
  { id: 'loops', label: 'Loops' },
  { id: 'functions', label: 'Functions' },
  { id: 'objects', label: 'Objects & Memory' },
  { id: 'dataStructures', label: 'Data Structures' },
  { id: 'challenge', label: 'Final Challenge' },
];

// --- 3D Visualizer Components ---

function MemoryBox3D({ label, value, color, delay }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => { const t = setTimeout(() => setScale(1), delay); return () => clearTimeout(t); }, [delay]);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={[scale, scale, scale]}>
        <RoundedBox args={[2, 1.2, 0.4]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
        </RoundedBox>
        <Text position={[0, 0.2, 0.25]} fontSize={0.15} color="#ffffff">{label}</Text>
        <Text position={[0, -0.2, 0.25]} fontSize={0.2} color="#ffffff" font={undefined}>{value}</Text>
      </mesh>
    </Float>
  );
}

// --- Section Helper Component ---

function StoryBlock({ sectionId, track, level, children }: { sectionId: string; track: SWETrack; level: SWELevel; children?: React.ReactNode }) {
  const story = BASICS_STORY[track]?.[level]?.[sectionId];
  const cfg = TRACK_CONFIG[track];
  
  if (!story) return null;

  return (
    <div style={{ marginBottom: '80px', paddingTop: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, letterSpacing: '0.2em', color: cfg.color, marginBottom: '8px', textTransform: 'uppercase' }}>
          SECTION: {sectionId}
        </div>
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '12px', lineHeight: 1.1 }}>
          {story.open}
        </h2>
      </div>

      <StoryCard protagonist="Protagonist" accentColor={cfg.color}>
         {story.story}
      </StoryCard>

      <SWEConversationScene track={track} lines={story.avatarLines} mentorName={story.mentorName} mentorRole={story.mentorRole} mentorColor={story.mentorColor} />

      <div style={{ marginTop: '32px' }}>
        {children}
      </div>

      {story.quiz && (
        <div style={{ marginTop: '32px' }}>
          <SWEAvatar 
            name={story.mentorName} 
            role={story.mentorRole} 
            color={story.mentorColor} 
            content="Before we move on, let's test your understanding." 
            question={story.quiz.question} 
            options={story.quiz.options} 
            conceptId={story.quiz.conceptId} 
          />
        </div>
      )}
    </div>
  );
}

export default function SWELanguageBasics({ track, level, onBack }: Props) {
  const cfg = TRACK_CONFIG[track];
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string>('identity');

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('data-section');
        if (id && entry.isIntersecting) {
          setActiveSection(id);
          setCompletedSections(p => new Set([...p, id]));
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -20% 0px' });
    
    const elements = document.querySelectorAll('[data-section]');
    elements.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [track, level]);

  const totalXP = completedSections.size * 100;
  const progressPct = Math.round((completedSections.size / SECTIONS.length) * 100);

  return (
    <div className="editorial" style={{ minHeight: '100vh', background: 'var(--ed-cream)', color: 'var(--ed-ink)' }}>
      
      {/* Premium Top Bar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(252, 251, 247, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--ed-rule)', padding: '12px 28px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.button whileHover={{ x: -2 }} onClick={onBack} style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" }}>
              ← BACK
            </motion.button>
            <div style={{ fontSize: '14px', fontWeight: 800, color: cfg.color }}>{cfg.emoji} {cfg.name} Basics</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', letterSpacing: '0.1em' }}>PROGRESS</div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: cfg.color }}>{progressPct}%</div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 900 }}>
              {totalXP / 100}
            </div>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 28px', display: 'grid', gridTemplateColumns: '220px 1fr 260px', gap: '60px' }}>
        
        {/* Left ScrollSpy Nav */}
        <aside style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.2em', marginBottom: '24px' }}>STRUCTURE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {SECTIONS.map((s, i) => {
              const active = activeSection === s.id;
              const done = completedSections.has(s.id);
              return (
                <div key={s.id} onClick={() => document.querySelector(`[data-section="${s.id}"]`)?.scrollIntoView({ behavior: 'smooth' })} style={{ 
                  fontSize: '13px', padding: '8px 0', cursor: 'pointer', color: active ? cfg.color : done ? 'var(--ed-ink)' : 'var(--ed-ink3)',
                  fontWeight: active ? 800 : 400, borderLeft: `2px solid ${active ? cfg.color : 'transparent'}`, paddingLeft: '12px',
                  transition: 'all 0.2s'
                }}>
                  {String(i + 1).padStart(2, '0')}. {s.label} {done ? '✓' : ''}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Content Flow */}
        <main style={{ maxWidth: '800px' }}>
          <header style={{ marginBottom: '80px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: cfg.color, letterSpacing: '0.3em', marginBottom: '16px' }}>MODULE 00</div>
            <h1 style={{ fontSize: '56px', fontWeight: 900, fontFamily: "'Lora', serif", lineHeight: 1.05, marginBottom: '24px', letterSpacing: '-0.03em' }}>
              The First Principles of {cfg.name}
            </h1>
            <p style={{ fontSize: '20px', lineHeight: 1.6, color: 'var(--ed-ink2)', maxWidth: '600px' }}>
              Software engineering isn't about memorizing syntax. It's about understanding <strong>how a language thinks</strong>.
            </p>
          </header>

          <div data-section="identity">
            <StoryBlock sectionId="identity" track={track} level={level}>
               <div style={{ height: '300px', background: 'var(--ed-card)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--ed-rule)' }}>
                 <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                       <Sphere args={[1.5, 32, 32]}>
                          <meshStandardMaterial color={cfg.color} wireframe />
                       </Sphere>
                    </Float>
                 </Canvas>
               </div>
            </StoryBlock>
          </div>

          <div data-section="types">
            <StoryBlock sectionId="types" track={track} level={level}>
              <QuickTry 
                track={track} 
                initialCode={track === 'python' ? 'x = 10\ny = "20"\nprint(f"Result: {x + int(y)}")' : 'int x = 10;\nString y = "20";\nSystem.out.println("Result: " + (x + Integer.parseInt(y)));'}
                problem="Types define how data interacts. Try adding a number to a string-wrapped value."
                hint="You must explicitly convert types in most professional languages."
                onRun={() => {}}
              />
            </StoryBlock>
          </div>

          <div data-section="flow">
            <StoryBlock sectionId="flow" track={track} level={level}>
              <QuickTry 
                track={track} 
                initialCode={track === 'python' ? 'age = 22\nif age >= 18:\n    print("Access Granted")\nelse:\n    print("Access Denied")' : 'int age = 22;\nif (age >= 18) {\n    System.out.println("Access Granted");\n} else {\n    System.out.println("Access Denied");\n}'}
                problem="Control flow creates the decision trees of your software."
                hint="Change the age variable to trigger the else block."
                onRun={() => {}}
              />
            </StoryBlock>
          </div>

          <div data-section="loops">
            <StoryBlock sectionId="loops" track={track} level={level}>
              <QuickTry 
                track={track} 
                initialCode={track === 'python' ? 'for i in range(1, 6):\n    print(f"Processing record {i}...")' : 'for (int i = 1; i <= 5; i++) {\n    System.out.println("Processing record " + i + "...");\n}'}
                problem="Automation is why we write code. Process five records in a single block."
                hint="The loop condition determines when to stop."
                onRun={() => {}}
              />
            </StoryBlock>
          </div>

          <div data-section="functions">
            <StoryBlock sectionId="functions" track={track} level={level}>
               <div style={{ height: '300px', background: '#0a0f1e', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
                  <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[5, 5, 5]} />
                    <MemoryBox3D label="Stack Trace" value={track === 'python' ? 'def func()...' : 'public void...'} color={cfg.color} delay={0} />
                  </Canvas>
               </div>
              <QuickTry 
                track={track} 
                initialCode={track === 'python' ? 'def solve(a, b):\n    return a * b\n\nprint(f"Product: {solve(5, 5)}")' : 'public static int solve(int a, int b) {\n    return a * b;\n}\n\nSystem.out.println("Product: " + solve(5, 5));'}
                problem="Functions are the building blocks of reusable logic."
                hint="Return the result of your calculation."
                onRun={() => {}}
              />
            </StoryBlock>
          </div>

          <div data-section="objects">
            <StoryBlock sectionId="objects" track={track} level={level}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                 <div style={{ padding: '24px', background: 'var(--ed-card)', border: `2px solid ${cfg.color}`, borderRadius: '12px' }}>
                    <div style={{ fontSize: '10px', color: cfg.color, fontWeight: 800, marginBottom: '8px' }}>THE HEAP</div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>Complex Object Data</div>
                 </div>
                 <div style={{ padding: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontWeight: 800, marginBottom: '8px' }}>THE STACK</div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>Memory References</div>
                 </div>
              </div>
            </StoryBlock>
          </div>

          <div data-section="dataStructures">
            <StoryBlock sectionId="dataStructures" track={track} level={level}>
              <DataBehaviorVisualizer />
            </StoryBlock>
          </div>

          <div data-section="challenge">
            <StoryBlock sectionId="challenge" track={track} level={level}>
              <div style={{ padding: '60px 40px', background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)', borderRadius: '20px', textAlign: 'center', border: `1px solid ${cfg.color}40`, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎯</div>
                <h3 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '16px', fontFamily: "'Lora', serif" }}>
                  First Milestone Reached.
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 32px' }}>
                  You've decoded the identity of {cfg.name}. Now, let's see how professional software is actually built.
                </p>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBack} style={{ 
                  padding: '16px 48px', background: cfg.color, color: '#fff', border: 'none', borderRadius: '12px', 
                  fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 24px ${cfg.color}40`
                }}>
                  UNLOCK PRE-READ 01 →
                </motion.button>
              </div>
            </StoryBlock>
          </div>
        </main>

        {/* Right Info Column */}
        <aside style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
          <div style={{ background: 'var(--ed-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--ed-rule)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
             <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.1em', marginBottom: '16px' }}>LEARNING STATS</div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                   <div style={{ fontSize: '24px', fontWeight: 900 }}>{totalXP}</div>
                   <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>TOTAL XP EARNED</div>
                </div>
                <div style={{ height: '1px', background: 'var(--ed-rule)' }} />
                <div>
                   <div style={{ fontSize: '16px', fontWeight: 800 }}>{completedSections.size} / {SECTIONS.length}</div>
                   <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>SECTIONS MASTERED</div>
                </div>
             </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

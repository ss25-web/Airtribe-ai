'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import type { SWETrack, SWELevel } from './sweTypes';
import { BASICS_STORY } from './sweBasicsStoryData';
import SWEPreReadLayout from './SWEPreReadLayout';
import { 
  SWEConversationScene, 
  QuickTry, 
  ProtagonistAvatar,
  SWEMentorFace,
  DataBehaviorVisualizer
} from './sweDesignSystem';
import {
  chLabel,
  h2,
  ChapterSection,
} from './pm-fundamentals/designSystem';
import {
  PythonExecutionPipeline,
  VariableBindingStudio,
  BranchingEngine,
  LoopSimulator,
  FunctionFlowStudio,
  DataStructureStudio,
} from './PythonBasicsTools';

interface Props {
  track: SWETrack;
  level: SWELevel;
  onBack: () => void;
}

const MODULE_ID = 'swe-pr-00';

export default function SWELanguageBasics({ track, level, onBack }: Props) {
  const markSectionCompleted = useLearnerStore(s => s.markSectionCompleted);
  const storedSections = useLearnerStore(s => s.completedSections[MODULE_ID] ?? []);

  const [hydrated, setHydrated] = useState(false);
  const [activeSection, setActiveSection] = useState('identity');
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set(['identity']));

  useEffect(() => {
    // Restore persisted progress and always include the default 'identity' section
    setCompletedModules(new Set(['identity', ...storedSections]));
    setHydrated(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    let obs: IntersectionObserver | null = null;
    const tid = setTimeout(() => {
      obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-nav-id');
            if (id) {
              setActiveSection(id);
              setCompletedModules(prev => { const n = new Set(prev); n.add(id); return n; });
              markSectionCompleted(MODULE_ID, id);
            }
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -20% 0px' });
      document.querySelectorAll('[data-nav-id]').forEach(el => obs!.observe(el));
    }, 150);
    return () => { clearTimeout(tid); obs?.disconnect(); };
  }, [hydrated, markSectionCompleted]);

  if (!hydrated) return null;

  const trackConfig = {
    python: {
      name: 'Python',
      accent: '#16A34A',
      accentRgb: '22,163,74',
      protagonist: 'Aisha',
      role: 'Junior Software Engineer',
      company: 'Vela',
      mentor: 'Riya',
      mentorRole: 'Senior Software Engineer',
      mentorColor: '#0369A1'
    },
    java: {
      name: 'Java',
      accent: '#0369A1',
      accentRgb: '3,105,161',
      protagonist: 'Vikram',
      role: 'Junior Backend Engineer',
      company: 'Finova Systems',
      mentor: 'Kavya',
      mentorRole: 'Senior Backend Engineer',
      mentorColor: '#7C3AED'
    },
    nodejs: {
      name: 'Node.js',
      accent: '#CA8A04',
      accentRgb: '202,138,4',
      protagonist: 'Leo',
      role: 'Junior Full-Stack Developer',
      company: 'Launchly',
      mentor: 'Mei',
      mentorRole: 'Senior Full-Stack Engineer',
      mentorColor: '#DC2626'
    }
  }[track];

  const SECTIONS = [
    { id: 'identity', label: 'Language Identity' },
    { id: 'types', label: 'Variables & Types' },
    { id: 'flow', label: 'Control Flow' },
    { id: 'loops', label: 'Loops & Iteration' },
    { id: 'functions', label: 'Functions & Scope' },
    { id: 'objects', label: 'Objects & Data' },
    { id: 'dataStructures', label: 'Data Structures' },
    { id: 'challenge', label: 'Final Challenge' }
  ];

  const getStory = (id: string) => {
    return BASICS_STORY[track]?.[level]?.[id] || null;
  };

  return (
    <SWEPreReadLayout
      trackConfig={trackConfig}
      moduleLabel={`${trackConfig.name.toUpperCase()} PRE-READ 00`}
      title={`Language Basics: The ${trackConfig.name} Lens`}
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
        <div style={{ flex: 1, minWidth: '320px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ed-ink3)', marginBottom: '28px', letterSpacing: '0.04em' }}>
            Software Engineering <span style={{ margin: '0 8px', color: 'var(--ed-rule)' }}>›</span>
            <span style={{ color: 'var(--ed-ink2)' }}>{trackConfig.name} Track</span>
            <span style={{ margin: '0 10px', color: 'var(--ed-rule)' }}>·</span>
            <span style={{ color: 'var(--ed-ink3)' }}>25 min · 8 parts</span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, lineHeight: 1.1, 
            letterSpacing: '-0.03em', color: 'var(--ed-ink)', marginBottom: '18px',
            fontFamily: "'Lora', serif" 
          }}>
            Computational Foundations:<br />
            <span style={{ color: trackConfig.accent }}>The {trackConfig.name} Mindset</span>
          </h1>

          <p style={{ fontSize: '17px', color: 'var(--ed-ink2)', lineHeight: 1.8, maxWidth: '540px', marginBottom: '36px', fontStyle: 'italic', fontFamily: "'Lora', serif" }}>
            &ldquo;Software engineering isn&apos;t about memorizing syntax. It&apos;s about understanding how a language thinks and models reality.&rdquo;
          </p>

          <div style={{ 
            background: 'var(--ed-card)', borderRadius: '10px', padding: '24px', 
            border: '1px solid var(--ed-rule)', borderLeft: `4px solid ${trackConfig.accent}`,
            boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: trackConfig.accent, letterSpacing: '0.15em', marginBottom: '16px', textTransform: 'uppercase' }}>Learning Objectives</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                'Identify a language\'s core identity and design goals',
                'Master variables and the underlying type system',
                'Orchestrate logic with control flow and iteration',
                'Model complex data relationships using objects'
              ].map((obj, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: trackConfig.accent, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', marginTop: '2px' }}>0{i+1}</span>
                  <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.5 }}>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flexShrink: 0, width: '200px', paddingTop: '40px' }}>
          <div className="float3d" style={{ 
            background: `linear-gradient(145deg, #1e293b 0%, #0f172a 100%)`, 
            borderRadius: '16px', padding: '24px 20px', 
            boxShadow: '0 32px 64px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: trackConfig.accent, letterSpacing: '0.2em', marginBottom: '12px' }}>MODULE 00</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#F1F5F9', fontFamily: "'Lora', serif", lineHeight: 1.3, marginBottom: '6px' }}>Computational Thinking</div>
            <div style={{ fontSize: '10px', color: 'rgba(241,245,249,0.5)', marginBottom: '20px' }}>SWE Launchpad</div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '16px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SECTIONS.slice(0, 5).map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: i === 0 ? trackConfig.accent : 'rgba(255,255,255,0.2)' }} />
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
            { name: trackConfig.protagonist, role: `${trackConfig.role} · ${trackConfig.company}`, desc: `Just joined ${trackConfig.company}. Needs to bridge the gap between "knowing code" and "engineering systems" in ${trackConfig.name}.`, color: trackConfig.accent, mentor: false },
            { name: trackConfig.mentor, role: trackConfig.mentorRole, desc: "A veteran engineer who prioritizes clarity over cleverness. She'll be guiding you through the architectural decisions of this language.", color: trackConfig.mentorColor, mentor: true }
          ].map((c, i) => (
            <div key={i} style={{ 
              flex: 1, minWidth: '240px', background: 'var(--ed-card)', borderRadius: '12px', border: '1px solid var(--ed-rule)', padding: '20px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
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

      {SECTIONS.map((section, idx) => {
        const s = getStory(section.id);
        if (!s) return null;

        return (
          <div key={section.id} id={section.id} data-nav-id={section.id} style={{ marginBottom: '100px' }}>
            <ChapterSection id={`ch-${idx}`} num={(idx + 1).toString().padStart(2, '0')} accentRgb={trackConfig.accentRgb}>
              {chLabel(section.label)}
              {h2(<>{s.open}</>)}
              
              <ProtagonistAvatar
                name={trackConfig.protagonist}
                role={trackConfig.role}
                color={trackConfig.accent}
                content={s.story}
              />
              
              <SWEConversationScene
                track={track}
                lines={s.avatarLines}
                mentorName={s.mentorName}
                mentorRole={s.mentorRole}
                mentorColor={s.mentorColor}
              />

              {section.id === 'types' && track === 'python' && <VariableBindingStudio />}
              {section.id === 'types' && track !== 'python' && (
                <QuickTry
                  track={track}
                  problem="Define variables and observe behavior."
                  initialCode={track === 'java' ? 'int x = 10;\nString y = "20";\n// Try System.out.println(x + y);' : 'const x = 10;\nconst y = "20";\n// Try console.log(x + y);'}
                  hint="Check the types before adding."
                  onRun={() => markSectionCompleted(MODULE_ID, 'types')}
                  evaluateOutput={(code) => {
                    const hasOutput = code.includes('console.log(x + y)') || code.includes('System.out.println(x + y)');
                    if (hasOutput && code.includes('"20"')) return { status: 'success', text: '1020' };
                    if (hasOutput) return { status: 'success', text: '30' };
                    return { status: 'success', text: '(No output.)' };
                  }}
                />
              )}

              {section.id === 'flow' && track === 'python' && <BranchingEngine />}
              {section.id === 'flow' && track !== 'python' && (
                <QuickTry
                  track={track}
                  problem="Trigger the alternate logic block."
                  initialCode={track === 'java' ? 'boolean active = false;\nif (active) {\n    System.out.println("System ON");\n} else {\n    System.out.println("System OFF");\n}' : 'const active = false;\nif (active) {\n    console.log("System ON");\n} else {\n    console.log("System OFF");\n}'}
                  hint="Change active to true."
                  onRun={() => markSectionCompleted(MODULE_ID, 'flow')}
                  evaluateOutput={(code) => {
                    const isActive = code.includes('true') && !code.includes('false');
                    return { status: 'success', text: isActive ? 'System ON' : 'System OFF' };
                  }}
                />
              )}

              {section.id === 'loops' && track === 'python' && <LoopSimulator />}
              {section.id === 'loops' && track !== 'python' && (
                <QuickTry
                  track={track}
                  problem="Automate a repetitive task with a loop."
                  initialCode={track === 'java' ? 'for (int i = 1; i <= 3; i++) {\n    System.out.println("Loading record " + i + "...");\n}' : 'for (let i = 1; i <= 3; i++) {\n    console.log("Loading record " + i + "...");\n}'}
                  hint="Change the range or limit to 10."
                  onRun={() => markSectionCompleted(MODULE_ID, 'loops')}
                  evaluateOutput={(code) => {
                    const match = code.match(/<=\s*(\d+)/);
                    let limit = 4;
                    if (match) limit = parseInt(match[1], 10);
                    let res = '';
                    for (let i = 1; i <= Math.min(limit, 20); i++) res += `Loading record ${i}...\n`;
                    return { status: 'success', text: res.trim() || 'No output.' };
                  }}
                />
              )}

              {section.id === 'functions' && track === 'python' && <FunctionFlowStudio />}
              {section.id === 'functions' && track !== 'python' && (
                <QuickTry
                  track={track}
                  problem="Encapsulate logic in a reusable function."
                  initialCode={track === 'java' ? 'public static String greet(String name) {\n    return "Hello, " + name + "!";\n}\n\nSystem.out.println(greet("Vikram"));' : 'const greet = (name) => `Hello, ${name}!`;\n\nconsole.log(greet("Leo"));'}
                  hint="Call the function with your own name."
                  onRun={() => markSectionCompleted(MODULE_ID, 'functions')}
                  evaluateOutput={(code) => {
                    const match = code.match(/greet\(\s*['"]([^'"]+)['"]\s*\)/);
                    const name = match ? match[1] : (track === 'java' ? 'Vikram' : 'Leo');
                    return { status: 'success', text: `Hello, ${name}!` };
                  }}
                />
              )}

              {section.id === 'identity' && track === 'python' && <PythonExecutionPipeline />}

              {section.id === 'objects' && (
                <div style={{ margin: '24px 0' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ padding: '16px', borderRadius: '12px', background: `${trackConfig.accent}12`, border: `1px solid ${trackConfig.accent}30` }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: trackConfig.accent, marginBottom: '8px', textTransform: 'uppercase' }}>Memory Heap</div>
                      <div style={{ fontSize: '12px', color: 'var(--ed-ink2)' }}>Complex object data sits here forever until garbage collected.</div>
                    </div>
                    <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--ed-ink3)', marginBottom: '8px', textTransform: 'uppercase' }}>Execution Stack</div>
                      <div style={{ fontSize: '12px', color: 'var(--ed-ink2)' }}>Small pointers to the heap objects. Lightweight and fast.</div>
                    </div>
                  </div>
                </div>
              )}

              {section.id === 'dataStructures' && track === 'python' && <DataStructureStudio />}
              {section.id === 'dataStructures' && track !== 'python' && (
                <div style={{ margin: '24px 0' }}>
                  <DataBehaviorVisualizer />
                  <QuickTry
                    track={track}
                    problem="Use a fast-lookup structure (Dictionary/Map)."
                    initialCode={track === 'java' ? 'Map<String, Integer> prices = Map.of("apple", 50, "berry", 120);\nSystem.out.println("Price of berry: " + prices.get("berry"));' : 'const prices = { apple: 50, berry: 120 };\nconsole.log("Price of berry:", prices.berry);'}
                    hint="Look up the price of an apple."
                    onRun={() => markSectionCompleted(MODULE_ID, 'dataStructures')}
                    evaluateOutput={(code) => {
                      if (code.includes('apple')) return { status: 'success', text: 'Price of apple: 50' };
                      return { status: 'success', text: 'Price of berry: 120' };
                    }}
                  />
                </div>
              )}
            </ChapterSection>
          </div>
        );
      })}

      {/* Final Challenge UI */}
      <div id="challenge" data-nav-id="challenge" style={{ marginTop: '60px' }}>
        <section style={{ padding: '60px 40px', background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)', borderRadius: '20px', textAlign: 'center', border: `1px solid ${trackConfig.accent}40`, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌟</div>
          <h3 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '16px', fontFamily: "'Lora', serif" }}>
            Foundations Mastered!
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 32px' }}>
            You have a solid lens on {trackConfig.name}. You&apos;re ready to dive into the professional patterns of Software Engineering.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={onBack} 
            style={{ 
              padding: '16px 48px', background: trackConfig.accent, color: '#fff', border: 'none', borderRadius: '12px', 
              fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 24px ${trackConfig.accent}40`
            }}
          >
            GO TO PRE-READ 01 →
          </motion.button>
        </section>
      </div>
    </SWEPreReadLayout>
  );
}

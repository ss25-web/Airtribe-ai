'use client';

import { motion } from 'framer-motion';
import type { SWETrack } from './sweTypes';
import { PythonLogo, JavaLogo, NodejsLogo } from './SWELogos';

const TRACKS: {
  id: SWETrack;
  label: string;
  title: string;
  parts: string;
  description: string;
  tags: string[];
  headerBg: string;
  headerAccent: string;
  color: string;
  Logo: React.ComponentType<{ size?: number }>;
}[] = [
  {
    id: 'python',
    label: 'TRACK',
    title: 'Python\nTrack',
    parts: 'Placement quiz · Beginner or Advanced',
    description: 'Python is the language of data science, automation, and AI. Its clean, readable syntax makes it the easiest first language — and its ecosystem (pandas, FastAPI, PyTorch) makes it genuinely powerful for professional work.',
    tags: ['Data & ML', 'Automation', 'Web APIs', 'Beginner-friendly'],
    color: '#16A34A',
    headerBg: 'linear-gradient(145deg, #14532D 0%, #064E3B 100%)',
    headerAccent: '#86EFAC',
    Logo: PythonLogo,
  },
  {
    id: 'java',
    label: 'TRACK',
    title: 'Java\nTrack',
    parts: 'Placement quiz · Beginner or Advanced',
    description: 'Java is the language of enterprise backends, fintech systems, and Android. Its strong type system and the Spring ecosystem teach you to build reliable, maintainable code at scale — the kind that runs for a decade.',
    tags: ['Enterprise', 'Spring Boot', 'Strong Typing', 'Backend'],
    color: '#0369A1',
    headerBg: 'linear-gradient(145deg, #1E3A5F 0%, #0F2847 100%)',
    headerAccent: '#93C5FD',
    Logo: JavaLogo,
  },
  {
    id: 'nodejs',
    label: 'TRACK',
    title: 'Node.js\nTrack',
    parts: 'Placement quiz · Beginner or Advanced',
    description: 'Node.js runs JavaScript on the server. If you already know or are learning JS for the web, you can reuse those skills on the backend. Its event loop excels at real-time features and high-concurrency APIs.',
    tags: ['Full-Stack', 'JavaScript', 'Real-Time', 'Web'],
    color: '#CA8A04',
    headerBg: 'linear-gradient(145deg, #422006 0%, #2C1A04 100%)',
    headerAccent: '#FCD34D',
    Logo: NodejsLogo,
  },
];

interface Props {
  onSelect: (track: SWETrack) => void;
  onBack: () => void;
}

export default function SWETrackSelection({ onSelect, onBack }: Props) {
  return (
    <div className="editorial" style={{ minHeight: '100vh', background: 'var(--ed-cream)' }}>

      {/* Top bar */}
      <div className="screen-topbar" style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--ed-card)', borderBottom: '1px solid var(--ed-rule)',
        padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ed-ink3)', fontSize: '13px', fontFamily: 'inherit' }}>
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '22px', height: '22px', borderRadius: '5px',
            background: 'linear-gradient(135deg, #16A34A, #0369A1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)', letterSpacing: '0.1em' }}>
            SOFTWARE ENGINEERING LAUNCHPAD
          </span>
        </div>
        <div style={{ width: '60px' }} />
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '52px 28px 80px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, lineHeight: 1.1,
            letterSpacing: '-0.03em', color: 'var(--ed-ink)', textAlign: 'center',
            fontFamily: "'Lora', 'Georgia', serif", marginBottom: '16px',
          }}>
            Choose your language track
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--ed-ink3)', lineHeight: 1.65, maxWidth: '480px', margin: '0 auto' }}>
            Pick the track that fits your goals. A short placement quiz will then set your starting level — beginner or advanced.
          </p>
        </motion.div>

        {/* Track cards */}
        <div className="series-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {TRACKS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
              onClick={() => onSelect(t.id)}
              whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
              style={{
                borderRadius: '12px', overflow: 'hidden',
                border: '1px solid var(--ed-rule)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                background: 'var(--ed-card)',
                transition: 'box-shadow 0.3s, transform 0.3s',
              }}>

              {/* Colored header — keeps its own dark gradient in both modes */}
              <div style={{
                background: t.headerBg, padding: '28px 24px 24px',
                minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.04,
                  backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                  pointerEvents: 'none',
                }} />

                <div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700,
                    letterSpacing: '0.18em', color: t.headerAccent, marginBottom: '14px',
                  }}>
                    {t.label}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <div style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                      <t.Logo size={28} />
                    </div>
                    <h2 style={{
                      fontFamily: "'Lora', 'Georgia', serif", fontSize: '22px', fontWeight: 700,
                      color: '#FFFFFF', lineHeight: 1.2, letterSpacing: '-0.01em',
                      whiteSpace: 'pre-line' as const,
                    }}>{t.title}</h2>
                  </div>
                </div>

                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
                  color: 'rgba(255,255,255,0.55)', marginTop: '12px',
                }}>{t.parts}</div>
              </div>

              {/* Card body */}
              <div style={{ padding: '20px 24px 22px' }}>
                <p style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75, marginBottom: '16px' }}>
                  {t.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                  {t.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                      color: 'var(--ed-ink3)', border: '1px solid var(--ed-rule)', background: 'var(--ed-cream)',
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ textAlign: 'center', fontSize: '13px', color: 'var(--ed-ink3)', marginTop: '36px', fontFamily: "'JetBrains Mono', monospace" }}>
          Not sure? Python is the most beginner-friendly starting point.
        </motion.p>
      </div>
    </div>
  );
}

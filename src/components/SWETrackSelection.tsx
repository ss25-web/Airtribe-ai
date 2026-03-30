'use client';

import { motion } from 'framer-motion';
import type { SWETrack } from './sweTypes';
import { PythonLogo, JavaLogo, NodejsLogo } from './SWELogos';

const TRACK_LOGOS = { python: PythonLogo, java: JavaLogo, nodejs: NodejsLogo };

const TRACKS: {
  id: SWETrack;
  name: string;
  tagline: string;
  desc: string;
  bestFor: string;
  build: string;
  tags: string[];
  color: string;
  gradient: string;
  headerBg: string;
  headerAccent: string;
}[] = [
  {
    id: 'python',
    name: 'Python',
    tagline: 'Simple syntax, powerful ecosystem',
    desc: 'Python is the language of data science, automation, and AI. Its clean, readable syntax makes it the easiest first language — and its ecosystem (pandas, FastAPI, PyTorch) makes it genuinely powerful for professional work.',
    bestFor: 'Data analysts, aspiring ML engineers, automation builders, and anyone who wants fast results',
    build: 'Data pipelines, REST APIs, automation scripts, ML models',
    tags: ['Data & ML', 'Automation', 'Web APIs', 'Beginner-friendly'],
    color: '#16A34A',
    gradient: 'linear-gradient(135deg, #16A34A, #0D9488)',
    headerBg: 'linear-gradient(145deg, #14532D 0%, #064E3B 100%)',
    headerAccent: '#86EFAC',
  },
  {
    id: 'java',
    name: 'Java',
    tagline: 'Strong types, enterprise-grade systems',
    desc: 'Java is the language of enterprise backends, fintech systems, and Android. Its strong type system and the Spring ecosystem teach you to build reliable, maintainable code at scale — the kind that runs for a decade.',
    bestFor: 'Aspiring backend engineers, those targeting enterprise or fintech roles, and Android developers',
    build: 'REST APIs, microservices, enterprise backends, Android apps',
    tags: ['Enterprise', 'Spring Boot', 'Strong Typing', 'Backend'],
    color: '#0369A1',
    gradient: 'linear-gradient(135deg, #0369A1, #7C3AED)',
    headerBg: 'linear-gradient(145deg, #1E3A5F 0%, #0F2847 100%)',
    headerAccent: '#93C5FD',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    tagline: 'JavaScript everywhere — frontend to backend',
    desc: 'Node.js runs JavaScript on the server. If you already know or are learning JS for the web, you can reuse those skills on the backend. Its event loop excels at real-time features and high-concurrency APIs.',
    bestFor: 'Frontend developers going full-stack, web product engineers, and anyone building real-time features',
    build: 'Web APIs, real-time apps, full-stack products, developer tools',
    tags: ['Full-Stack', 'JavaScript', 'Real-Time', 'Web'],
    color: '#CA8A04',
    gradient: 'linear-gradient(135deg, #CA8A04, #16A34A)',
    headerBg: 'linear-gradient(145deg, #422006 0%, #2C1A04 100%)',
    headerAccent: '#FCD34D',
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
          <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: 'linear-gradient(135deg, #16A34A, #0369A1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
              <rect x="9" y="2" width="5" height="5" rx="1" fill="white" />
              <rect x="2" y="9" width="5" height="5" rx="1" fill="white" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
            </svg>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)', letterSpacing: '0.1em' }}>
            SOFTWARE ENGINEERING LAUNCHPAD
          </span>
        </div>
        <div style={{ width: '60px' }} />
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '52px 24px 80px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: '#16A34A', marginBottom: '14px' }}>
            CHOOSE YOUR TRACK
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '14px' }}>
            Which language do you want to learn?
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto' }}>
            Pick the track that fits your goals. After you choose, a short quiz will place you at the right level — beginner or advanced.
          </p>
        </motion.div>

        {/* Track cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
          {TRACKS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 + i * 0.08 }}
              whileHover={{ y: -5, boxShadow: `0 20px 50px ${t.color}22` }}
              onClick={() => onSelect(t.id)}
              style={{
                borderRadius: '12px', overflow: 'hidden',
                border: `1px solid var(--ed-rule)`,
                background: 'var(--ed-card)',
                cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.25s, transform 0.25s',
              }}>

              {/* Coloured header */}
              <div style={{
                background: t.headerBg, padding: '24px 22px 20px',
                minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.04,
                  backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)',
                  backgroundSize: '20px 20px', pointerEvents: 'none',
                }} />
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: t.headerAccent, marginBottom: '10px' }}>
                    TRACK
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                      {(() => { const Logo = TRACK_LOGOS[t.id]; return <Logo size={32} />; })()}
                    </div>
                    <h2 style={{ fontFamily: "'Lora', serif", fontSize: '20px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1 }}>{t.name}</h2>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>{t.tagline}</div>
                </div>
                <div style={{
                  marginTop: '14px', padding: '7px 14px', borderRadius: '6px',
                  background: t.color, color: '#fff',
                  fontSize: '12px', fontWeight: 600, textAlign: 'center', fontFamily: 'inherit',
                }}>
                  Choose {t.name} →
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: '18px 22px 20px' }}>
                <p style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.75, marginBottom: '12px' }}>
                  {t.desc}
                </p>
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--ed-ink3)', textTransform: 'uppercase' as const, marginBottom: '4px' }}>You will build</div>
                  <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>{t.build}</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '5px' }}>
                  {t.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '2px 8px', borderRadius: '20px', fontSize: '10px',
                      color: t.color, border: `1px solid ${t.color}40`,
                      background: `${t.color}0A`,
                      fontFamily: "'JetBrains Mono', monospace",
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
          style={{ textAlign: 'center', fontSize: '12px', color: 'var(--ed-ink3)', marginTop: '36px', fontFamily: "'JetBrains Mono', monospace" }}>
          Not sure? Python is the most beginner-friendly starting point.
        </motion.p>
      </div>
    </div>
  );
}

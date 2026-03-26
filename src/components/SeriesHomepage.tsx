'use client';

import { motion } from 'framer-motion';

interface Props {
  onSelectPM: () => void;
  onSelectGenAI: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

const SERIES = [
  {
    id: 'pm',
    label: 'START HERE',
    title: 'Product Management\nLaunchpad',
    parts: '4 pre-reads · placement quiz',
    description: 'The core mental models every PM needs — from defining problems correctly, to making tradeoff decisions, to measuring what actually matters. Starts with a 10-question quiz to assign your level.',
    tags: ['Strategy', 'Prioritization', 'Metrics'],
    headerBg: 'linear-gradient(145deg, #2C3654 0%, #1E2640 100%)',
    headerAccent: '#8B9CC8',
    available: true,
  },
  {
    id: 'genai',
    label: 'SERIES',
    title: 'GenAI\nLaunchpad',
    parts: 'Cohort-based · n8n-first',
    description: 'Move from GenAI fundamentals to production-grade AI workflows and agentic systems with n8n as the orchestration layer.',
    tags: ['n8n', 'Agents', 'Automation'],
    headerBg: 'linear-gradient(145deg, #5B2DA6 0%, #3D1D75 100%)',
    headerAccent: '#C4A8F8',
    available: true,
  },
  {
    id: 'swe',
    label: 'SERIES',
    title: 'Software Development\nLaunchpad',
    parts: '3 pre-reads · coming soon',
    description: 'What engineers actually do all day, how to read a system design doc, why tech debt matters, and how to make better decisions with your engineering team.',
    tags: ['Engineering', 'Systems', 'APIs'],
    headerBg: 'linear-gradient(145deg, #0A5C45 0%, #073D2F 100%)',
    headerAccent: '#6ED4B0',
    available: false,
  },
];

export default function SeriesHomepage({ onSelectPM, onSelectGenAI, darkMode, onToggleDark }: Props) {
  const bg      = darkMode ? '#131110' : '#F6F1E7';
  const card    = darkMode ? '#1D1A16' : '#FFFFFF';
  const ink     = darkMode ? '#EDE5D5' : '#1C1814';
  const ink2    = darkMode ? '#C2B9A6' : '#6A6560';
  const rule    = darkMode ? '#332D24' : '#D4CEC6';
  const tagBg   = darkMode ? '#252018' : '#F6F1E7';
  const tagText = darkMode ? '#7A7268' : '#6A6560';
  const footer  = darkMode ? '#4A4540' : '#9A9490';

  return (
    <div style={{ minHeight: '100vh', background: bg, transition: 'background 0.3s, color 0.3s' }}>

      {/* Top bar with theme toggle */}
      <div className="series-topbar" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 28px', maxWidth: '980px', margin: '0 auto',
      }}>
        {/* Airtribe wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '7px',
            background: 'linear-gradient(135deg, #7843EE 0%, #4F46E5 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(120,67,238,0.3)',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', fontWeight: 800, color: ink, letterSpacing: '-0.02em', lineHeight: 1 }}>
              Airtribe
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 600, color: tagText, letterSpacing: '0.1em', lineHeight: 1, marginTop: '2px', textTransform: 'uppercase' as const }}>
              Learn
            </div>
          </div>
        </div>

        {/* Dark mode toggle */}
        <button
          type="button"
          onClick={onToggleDark}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: '34px', height: '34px', borderRadius: '8px',
            background: darkMode ? '#252018' : '#FFFFFF',
            border: `1px solid ${rule}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', transition: 'all 0.2s',
          }}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Gradient accent bar */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, #7843EE 0%, #4F46E5 50%, #0097A7 100%)', maxWidth: '100%' }} />

      {/* Main content */}
      <div className="series-main" style={{ maxWidth: '980px', margin: '0 auto', padding: '52px 28px 48px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.1,
            letterSpacing: '-0.03em', color: ink, textAlign: 'center',
            fontFamily: "'Lora', 'Georgia', serif", marginBottom: '16px',
            transition: 'color 0.3s',
          }}>
            Airtribe Learn
          </h1>
          <p style={{ fontSize: '18px', color: ink2, textAlign: 'center', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 52px', transition: 'color 0.3s' }}>
            Interactive pre-reads for product builders — built with pedagogy, not slides.
          </p>
        </motion.div>

        {/* Series grid */}
        <div className="series-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {SERIES.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
              onClick={s.available ? (s.id === 'pm' ? onSelectPM : s.id === 'genai' ? onSelectGenAI : undefined) : undefined}
              whileHover={s.available ? { y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.18)' } : {}}
              style={{
                borderRadius: '12px', overflow: 'hidden',
                border: `1px solid ${rule}`,
                boxShadow: darkMode ? '0 2px 12px rgba(0,0,0,0.25)' : '0 2px 12px rgba(0,0,0,0.06)',
                cursor: s.available ? 'pointer' : 'default',
                background: card,
                transition: 'box-shadow 0.3s, transform 0.3s, background 0.3s',
              }}>

              {/* Colored header */}
              <div style={{
                background: s.headerBg, padding: '28px 24px 24px',
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
                    letterSpacing: '0.18em', color: s.headerAccent, marginBottom: '14px',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                    {s.label}
                    {!s.available && (
                      <span style={{ padding: '1px 6px', borderRadius: '3px', background: 'rgba(255,255,255,0.12)', fontSize: '8px', color: 'rgba(255,255,255,0.6)' }}>
                        coming soon
                      </span>
                    )}
                  </div>
                  <h2 style={{
                    fontFamily: "'Lora', 'Georgia', serif", fontSize: '22px', fontWeight: 700,
                    color: '#FFFFFF', lineHeight: 1.2, letterSpacing: '-0.01em',
                    whiteSpace: 'pre-line' as const,
                  }}>{s.title}</h2>
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
                  color: 'rgba(255,255,255,0.55)', marginTop: '12px',
                }}>{s.parts}</div>
              </div>

              {/* Card body */}
              <div style={{ padding: '20px 24px 22px' }}>
                <p style={{ fontSize: '13px', color: ink2, lineHeight: 1.75, marginBottom: '16px', transition: 'color 0.3s' }}>
                  {s.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                  {s.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                      color: tagText, border: `1px solid ${rule}`, background: tagBg,
                      transition: 'all 0.3s',
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', fontSize: '12px', color: footer, marginTop: '40px', fontFamily: "'JetBrains Mono', monospace", transition: 'color 0.3s' }}>
          More launchpads coming in 2026 · All pre-reads are free
        </motion.p>
      </div>
    </div>
  );
}

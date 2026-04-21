import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SWETrack } from './sweTypes';
import { useLearnerStore } from '@/lib/learnerStore';

export type CSLine = { speaker: 'protagonist' | 'mentor'; text: string };

export const ProtagonistAvatar = ({ name, role, color, content, expandedContent, compact }: {
  name: string; role: string; color: string;
  content: React.ReactNode;
  expandedContent?: React.ReactNode;
  compact?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div whileHover={{ y: -1, boxShadow: '0 8px 28px rgba(0,0,0,0.1)' }}
      style={{ background: 'var(--ed-card)', borderRadius: '10px', border: '1px solid var(--ed-rule)', borderLeft: `4px solid ${color}`, marginTop: compact ? '10px' : '28px', overflow: 'hidden', transition: 'box-shadow 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      {/* Header */}
      <div onClick={() => setOpen(o => !o)} style={{ padding: '7px 18px', background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, display: 'inline-block' }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color }}>You</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'var(--ed-ink3)', letterSpacing: '0.06em', marginLeft: '4px' }}>· what you&apos;re thinking</span>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>▼</motion.span>
      </div>
      {/* Body */}
      <div style={{ padding: '18px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <SWEMentorFace name={name} size={66} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '1px' }}>{name}</div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '10px', letterSpacing: '0.04em' }}>{role}</div>
          <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.82, fontStyle: 'italic', fontFamily: "'Lora', 'Georgia', serif" }}>{content}</div>
        </div>
      </div>
      {/* Expanded */}
      <AnimatePresence>
        {open && expandedContent && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px 20px', borderTop: '1px solid var(--ed-rule)', background: 'var(--ed-cream)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '3px', flexShrink: 0, background: color, borderRadius: '2px', alignSelf: 'stretch', opacity: 0.35 }} />
              <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.9, fontStyle: 'italic', fontFamily: "'Lora', 'Georgia', serif" }}>{expandedContent}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const StoryCard = ({ protagonist, accentColor, children, open, story }: { protagonist?: string; accentColor?: string; children?: React.ReactNode; open?: string; story?: string }) => (
  <div style={{ position: 'relative', background: 'var(--ed-amber-bg)', borderRadius: '6px', padding: '20px 24px', margin: '0 0 28px', borderTop: '1px solid var(--ed-amber-border)', borderRight: '1px solid var(--ed-amber-border)', borderBottom: '1px solid var(--ed-amber-border)', borderLeft: `4px solid ${accentColor ?? '#B45309'}` }}>
    {(protagonist || open) && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: accentColor ?? '#B45309', marginBottom: '10px' }}>{open ? `◎ ${open}` : `◎ ${protagonist}\u2019s Situation`}</div>}
    <div style={{ fontSize: '15px', color: 'var(--ed-ink)', lineHeight: 1.85, fontStyle: 'italic', fontFamily: "'Lora', 'Georgia', serif" }}>{story ?? children}</div>
  </div>
);export const SWEMentorFace = ({ name, size = 66 }: { name: string; size?: number }) => {
  const [blink, setBlink] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const schedule = () => {
      timerRef.current = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); schedule(); }, 120);
      }, 2800 + Math.random() * 2400);
    };
    schedule();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);
  const eyeRy = blink ? 0.7 : 4.8;

  const faces: Record<string, React.ReactNode> = {
    Riya: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#024F8C" />
        <path d="M 34 90 Q 50 102 66 90" fill="#0369A1" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#BF8B5A" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#BF8B5A" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#BF8B5A" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#BF8B5A" />
        <ellipse cx="50" cy="22" rx="28" ry="15" fill="#1A0A05" />
        <path d="M 22 30 Q 28 22 50 20 Q 72 22 78 30 L 76 44 Q 64 37 50 37 Q 36 37 24 44 Z" fill="#1A0A05" />
        <ellipse cx="50" cy="10" rx="9" ry="8" fill="#1A0A05" />
        <ellipse cx="50" cy="9" rx="6" ry="4" fill="#2A1005" />
        <path d="M 31 42 Q 38 40 45 42" stroke="#1A0A05" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 55 42 Q 62 40 69 42" stroke="#1A0A05" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#3A2417" /><circle cx="62.5" cy="50.5" r="3.3" fill="#3A2417" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 57 Q 50 62 53 57" stroke="#A96938" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 40 67 Q 50 73 60 67" stroke="#9C5D3B" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Kavya: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#4F35B8" />
        <path d="M 34 90 Q 50 102 66 90" fill="#7C3AED" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#D4956B" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#D4956B" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#D4956B" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#D4956B" />
        <circle cx="24" cy="59" r="2.5" fill="#F0C040" />
        <circle cx="76" cy="59" r="2.5" fill="#F0C040" />
        <ellipse cx="50" cy="22" rx="27" ry="15" fill="#0D0D0D" />
        <path d="M 23 31 Q 28 22 50 20 Q 72 22 77 31 L 76 46 Q 65 39 50 39 Q 35 39 24 46 Z" fill="#0D0D0D" />
        <path d="M 23 46 Q 20 62 22 74 Q 27 65 27 54 Z" fill="#0D0D0D" />
        <path d="M 77 46 Q 80 62 78 74 Q 73 65 73 54 Z" fill="#0D0D0D" />
        <path d="M 31 42 Q 38 40 45 42" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 55 42 Q 62 40 69 42" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#2A1810" /><circle cx="62.5" cy="50.5" r="3.3" fill="#2A1810" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 57 Q 50 62 53 57" stroke="#B07050" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 40 67 Q 50 73 60 67" stroke="#9C6845" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Mei: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#991B1B" />
        <path d="M 34 90 Q 50 102 66 90" fill="#DC2626" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#E8C8A5" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#E8C8A5" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#E8C8A5" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#E8C8A5" />
        <ellipse cx="50" cy="22" rx="27" ry="14" fill="#111111" />
        <path d="M 23 28 Q 30 20 50 18 Q 70 20 77 28 L 77 46 Q 66 38 50 38 Q 34 38 23 46 Z" fill="#111111" />
        <path d="M 23 46 Q 20 62 24 78 Q 28 68 28 56 Z" fill="#111111" />
        <path d="M 77 46 Q 80 62 76 78 Q 72 68 72 56 Z" fill="#111111" />
        <path d="M 25 33 Q 37 28 50 28 Q 63 28 75 33 Q 63 37 50 37 Q 37 37 25 33 Z" fill="#111111" />
        <path d="M 31 41 Q 38 40 45 41" stroke="#111111" strokeWidth="2.3" strokeLinecap="round" fill="none" />
        <path d="M 55 41 Q 62 40 69 41" stroke="#111111" strokeWidth="2.3" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#2A1C14" /><circle cx="62.5" cy="50.5" r="3.3" fill="#2A1C14" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 57 Q 50 61 53 57" stroke="#C09070" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M 41 67 Q 50 72 59 67" stroke="#B07860" strokeWidth="1.9" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Dev: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#92400E" />
        <path d="M 34 90 Q 50 102 66 90" fill="#D97706" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#BF9070" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#BF9070" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#BF9070" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#BF9070" />
        <ellipse cx="50" cy="22" rx="26" ry="12" fill="#1A0A05" />
        <path d="M 24 28 Q 30 22 50 20 Q 70 22 76 28 L 76 38 Q 64 32 50 32 Q 36 32 24 38 Z" fill="#1A0A05" />
        <path d="M 31 42 Q 38 40 45 42" stroke="#1A0A05" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 55 42 Q 62 40 69 42" stroke="#1A0A05" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#3A2010" /><circle cx="62.5" cy="50.5" r="3.3" fill="#3A2010" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <rect x="29" y="44" width="18" height="12" rx="3" stroke="#333" strokeWidth="1.4" fill="none" />
        <rect x="53" y="44" width="18" height="12" rx="3" stroke="#333" strokeWidth="1.4" fill="none" />
        <line x1="47" y1="50" x2="53" y2="50" stroke="#333" strokeWidth="1.4" />
        <path d="M 47 58 Q 50 63 53 58" stroke="#A07048" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 40 68 Q 50 74 60 68" stroke="#906038" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Sam: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#065F46" />
        <path d="M 34 90 Q 50 102 66 90" fill="#059669" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#A07850" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#A07850" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#A07850" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#A07850" />
        <ellipse cx="50" cy="24" rx="26" ry="14" fill="#150805" />
        <path d="M 24 30 Q 32 20 50 19 Q 68 20 76 30 L 75 42 Q 64 35 50 35 Q 36 35 25 42 Z" fill="#150805" />
        <path d="M 24 30 Q 18 38 20 46 Q 24 40 25 32 Z" fill="#150805" />
        <path d="M 76 30 Q 82 38 80 46 Q 76 40 75 32 Z" fill="#150805" />
        <path d="M 31 43 Q 38 41 45 43" stroke="#150805" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 55 43 Q 62 41 69 43" stroke="#150805" strokeWidth="2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="51" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="51" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="51.5" r="3.3" fill="#2A1808" /><circle cx="62.5" cy="51.5" r="3.3" fill="#2A1808" /></>}
        {!blink && <><circle cx="39.5" cy="50.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="50.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 58 Q 50 63 53 58" stroke="#8A6030" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 40 68 Q 50 75 60 68" stroke="#7A5228" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Priya: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#5B21B6" />
        <path d="M 34 90 Q 50 102 66 90" fill="#7C3AED" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#BF8B5A" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#BF8B5A" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#BF8B5A" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#BF8B5A" />
        <path d="M 22 35 Q 28 22 50 20 Q 72 22 78 35 L 76 52 Q 66 44 50 44 Q 34 44 24 52 Z" fill="#0D0505" />
        <ellipse cx="50" cy="10" rx="12" ry="11" fill="#0D0505" />
        <circle cx="50" cy="6" r="5" fill="#0D0505" />
        <path d="M 22 35 Q 18 50 20 62 Q 24 52 24 38 Z" fill="#0D0505" />
        <path d="M 78 35 Q 82 50 80 62 Q 76 52 76 38 Z" fill="#0D0505" />
        <path d="M 31 43 Q 38 41 45 43" stroke="#0D0505" strokeWidth="2.3" strokeLinecap="round" fill="none" />
        <path d="M 55 43 Q 62 41 69 43" stroke="#0D0505" strokeWidth="2.3" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="51" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="51" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="51.5" r="3.3" fill="#2A1408" /><circle cx="62.5" cy="51.5" r="3.3" fill="#2A1408" /></>}
        {!blink && <><circle cx="39.5" cy="50.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="50.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 58 Q 50 63 53 58" stroke="#A97040" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 40 68 Q 50 74 60 68" stroke="#9C6038" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Suresh: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#1E3A8A" />
        <path d="M 34 90 Q 50 102 66 90" fill="#2563EB" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#6B3820" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#6B3820" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#6B3820" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#6B3820" />
        <ellipse cx="50" cy="22" rx="27" ry="14" fill="#0A0505" />
        <path d="M 23 28 Q 30 20 50 18 Q 70 20 77 28 L 76 44 Q 65 37 50 37 Q 35 37 24 44 Z" fill="#0A0505" />
        <path d="M 23 28 Q 19 36 20 44 Q 24 38 24 30 Z" fill="#888" />
        <path d="M 77 28 Q 81 36 80 44 Q 76 38 76 30 Z" fill="#888" />
        <path d="M 23 28 Q 28 22 36 21 Q 32 26 23 28 Z" fill="#888" />
        <path d="M 77 28 Q 72 22 64 21 Q 68 26 77 28 Z" fill="#888" />
        <path d="M 32 43 Q 38 41 45 43" stroke="#0A0505" strokeWidth="2.3" strokeLinecap="round" fill="none" />
        <path d="M 55 43 Q 62 41 68 43" stroke="#0A0505" strokeWidth="2.3" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="51" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="51" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="51.5" r="3.3" fill="#1A0808" /><circle cx="62.5" cy="51.5" r="3.3" fill="#1A0808" /></>}
        {!blink && <><circle cx="39.5" cy="50.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="50.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 58 Q 50 62 53 58" stroke="#5A2810" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 41 67 Q 50 72 59 67" stroke="#4A2010" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Ananya: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#9D174D" />
        <path d="M 34 90 Q 50 102 66 90" fill="#DB2777" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#C89070" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#C89070" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#C89070" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#C89070" />
        <ellipse cx="50" cy="22" rx="28" ry="15" fill="#0F0808" />
        <path d="M 22 30 Q 28 20 50 18 Q 72 20 78 30 L 77 46 Q 65 38 50 38 Q 35 38 23 46 Z" fill="#0F0808" />
        <path d="M 22 30 Q 17 48 18 68 Q 22 56 22 42 Z" fill="#0F0808" />
        <path d="M 78 30 Q 83 48 82 68 Q 78 56 78 42 Z" fill="#0F0808" />
        <path d="M 31 42 Q 38 40 45 42" stroke="#0F0808" strokeWidth="2.1" strokeLinecap="round" fill="none" />
        <path d="M 55 42 Q 62 40 69 42" stroke="#0F0808" strokeWidth="2.1" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#2A1408" /><circle cx="62.5" cy="50.5" r="3.3" fill="#2A1408" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 57 Q 50 62 53 57" stroke="#A87050" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 40 67 Q 50 74 60 67" stroke="#9A6040" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Rahul: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#0E7490" />
        <path d="M 34 90 Q 50 102 66 90" fill="#0891B2" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#9E7060" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#9E7060" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#9E7060" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#9E7060" />
        <ellipse cx="50" cy="23" rx="26" ry="14" fill="#180808" />
        <path d="M 24 29 Q 30 21 50 19 Q 70 21 76 29 L 75 42 Q 64 35 50 35 Q 36 35 25 42 Z" fill="#180808" />
        <path d="M 32 42 Q 38 40 45 42" stroke="#180808" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 55 42 Q 62 40 68 42" stroke="#180808" strokeWidth="2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#2A1408" /><circle cx="62.5" cy="50.5" r="3.3" fill="#2A1408" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 57 Q 50 62 53 57" stroke="#886040" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 40 68 Q 50 74 60 68" stroke="#7A5030" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Jordan: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#3F6212" />
        <path d="M 34 90 Q 50 102 66 90" fill="#65A30D" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#C0A880" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#C0A880" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#C0A880" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#C0A880" />
        <ellipse cx="50" cy="22" rx="28" ry="14" fill="#4A2E10" />
        <path d="M 22 28 Q 30 19 50 18 Q 70 19 78 28 L 76 44 Q 68 34 55 33 Q 44 34 30 38 Q 26 38 22 42 Z" fill="#4A2E10" />
        <path d="M 22 28 Q 19 40 20 52 Q 23 44 23 34 Z" fill="#4A2E10" />
        <path d="M 76 28 Q 79 36 78 46 Q 77 40 77 34 Z" fill="#4A2E10" />
        <path d="M 31 42 Q 38 40 45 42" stroke="#4A2E10" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 55 42 Q 62 40 69 42" stroke="#4A2E10" strokeWidth="2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#3A2810" /><circle cx="62.5" cy="50.5" r="3.3" fill="#3A2810" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 57 Q 50 62 53 57" stroke="#A08858" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M 40 68 Q 50 74 60 68" stroke="#907848" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Carlos: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#78350F" />
        <path d="M 34 90 Q 50 102 66 90" fill="#B45309" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#9A6050" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#9A6050" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#9A6050" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#9A6050" />
        <ellipse cx="50" cy="22" rx="26" ry="13" fill="#1A0A05" />
        <path d="M 24 27 Q 30 20 50 18 Q 70 20 76 27 L 76 38 Q 64 32 50 32 Q 36 32 24 38 Z" fill="#1A0A05" />
        <path d="M 31 42 Q 38 40 45 42" stroke="#1A0A05" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 55 42 Q 62 40 69 42" stroke="#1A0A05" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#2A1008" /><circle cx="62.5" cy="50.5" r="3.3" fill="#2A1008" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 35 61 Q 43 64 50 63 Q 57 64 65 61" stroke="#6A3820" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M 37 65 Q 43 69 50 68 Q 57 69 63 65" stroke="#7A4028" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M 40 58 Q 43 60 46 58" stroke="#7A4028" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M 54 58 Q 57 60 60 58" stroke="#7A4028" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Aisha: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#1D4ED8" />
        <path d="M 34 90 Q 50 102 66 90" fill="#3B82F6" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#D4956B" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#D4956B" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#D4956B" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#D4956B" />
        <ellipse cx="50" cy="22" rx="27" ry="15" fill="#0D0505" />
        <path d="M 23 30 Q 28 20 50 18 Q 72 20 77 30 L 76 46 Q 65 38 50 38 Q 35 38 24 46 Z" fill="#0D0505" />
        <path d="M 23 46 Q 19 62 20 76 Q 25 65 25 52 Z" fill="#0D0505" />
        <path d="M 77 46 Q 81 62 80 76 Q 75 65 75 52 Z" fill="#0D0505" />
        <path d="M 31 42 Q 38 40 45 42" stroke="#0D0505" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 55 42 Q 62 40 69 42" stroke="#0D0505" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#2A1408" /><circle cx="62.5" cy="50.5" r="3.3" fill="#2A1408" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 57 Q 50 62 53 57" stroke="#B07050" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 40 67 Q 50 73 60 67" stroke="#9C6040" strokeWidth="2.1" fill="none" strokeLinecap="round" />
        <circle cx="36" cy="58" r="2.5" fill="rgba(210,120,80,0.35)" />
        <circle cx="64" cy="58" r="2.5" fill="rgba(210,120,80,0.35)" />
      </svg>
    ),
    Vikram: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#0F4C81" />
        <path d="M 34 90 Q 50 102 66 90" fill="#1A6AAF" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#8B5A3A" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#8B5A3A" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#8B5A3A" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#8B5A3A" />
        <ellipse cx="50" cy="22" rx="26" ry="14" fill="#0A0505" />
        <path d="M 24 28 Q 30 20 50 18 Q 70 20 76 28 L 76 42 Q 64 35 50 35 Q 36 35 24 42 Z" fill="#0A0505" />
        <path d="M 24 28 Q 20 38 22 48 Q 25 40 25 32 Z" fill="#0A0505" />
        <path d="M 76 28 Q 80 38 78 48 Q 75 40 75 32 Z" fill="#0A0505" />
        <path d="M 32 42 Q 38 40 45 42" stroke="#0A0505" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 55 42 Q 62 40 68 42" stroke="#0A0505" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#1A0808" /><circle cx="62.5" cy="50.5" r="3.3" fill="#1A0808" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 57 Q 50 61 53 57" stroke="#7A4020" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 40 67 Q 50 72 60 67" stroke="#6A3010" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 35 61 Q 44 65 50 64 Q 56 65 65 61" stroke="#6A3010" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Leo: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#B45309" />
        <path d="M 34 90 Q 50 102 66 90" fill="#D97706" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#E0B890" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#E0B890" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#E0B890" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#E0B890" />
        <ellipse cx="50" cy="23" rx="27" ry="14" fill="#2A1808" />
        <path d="M 23 29 Q 30 20 50 18 Q 70 20 77 29 L 76 44 Q 66 36 55 35 Q 44 36 30 40 Q 26 40 23 44 Z" fill="#2A1808" />
        <path d="M 23 29 Q 19 40 20 52 Q 24 43 24 34 Z" fill="#2A1808" />
        <path d="M 77 29 Q 81 38 80 48 Q 77 41 77 34 Z" fill="#2A1808" />
        <path d="M 66 20 Q 74 24 78 32 Q 72 26 66 20 Z" fill="#2A1808" />
        <path d="M 31 43 Q 38 41 45 43" stroke="#2A1808" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 55 43 Q 62 41 69 43" stroke="#2A1808" strokeWidth="2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="51" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="51" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="51.5" r="3.3" fill="#3A2010" /><circle cx="62.5" cy="51.5" r="3.3" fill="#3A2010" /></>}
        {!blink && <><circle cx="39.5" cy="50.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="50.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 58 Q 50 63 53 58" stroke="#C09060" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M 40 68 Q 50 74 60 68" stroke="#B08050" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <motion.div
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: size, height: size, borderRadius: '16px', flexShrink: 0,
        overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
      }}>
      {faces[name] ?? (
        <div style={{ width: '100%', height: '100%', background: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: size * 0.32, fontWeight: 800, color: '#fff' }}>{name[0]}</span>
        </div>
      )}
    </motion.div>
  );
};

export const SWEAvatar = ({ name, role, color, content, expandedContent, question, options, conceptId, compact }: {
  name: string; role: string; color: string;
  content: React.ReactNode;
  expandedContent?: React.ReactNode;
  compact?: boolean;
  question?: string;
  options?: { text: string; correct: boolean; feedback: string }[];
  conceptId?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const store = useLearnerStore();
  const answered = selectedIdx !== null;
  const isCorrect = answered && options ? options[selectedIdx].correct : false;
  const handleAnswer = (i: number) => {
    if (answered) return;
    setSelectedIdx(i);
    if (conceptId && options) store.recordQuizAttempt(conceptId, options[i].correct);
  };
  return (
    <motion.div whileHover={{ y: -1, boxShadow: '0 8px 28px rgba(0,0,0,0.1)' }}
      style={{ background: 'var(--ed-card)', borderRadius: '10px', border: '1px solid var(--ed-rule)', borderLeft: `4px solid ${color}`, marginTop: compact ? '10px' : '28px', overflow: 'hidden', transition: 'box-shadow 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      {/* Header */}
      <div onClick={() => setOpen(o => !o)} style={{ padding: '7px 18px', background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, display: 'inline-block' }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color }}>Mentor</span>
          {question && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'var(--ed-ink3)', letterSpacing: '0.06em', marginLeft: '4px' }}>· has a question for you</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {question && answered && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: isCorrect ? '#0D7A5A' : '#C85A40', letterSpacing: '0.06em' }}>{isCorrect ? '✓ right track' : '✗ revisit'}</span>}
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>▼</motion.span>
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: '18px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <SWEMentorFace name={name} size={66} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '1px' }}>{name}</div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '10px', letterSpacing: '0.04em' }}>{role}</div>
          <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.82 }}>{content}</div>
        </div>
      </div>
      {/* Expanded */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            {expandedContent && (
              <div style={{ padding: '16px 18px 20px', borderTop: '1px solid var(--ed-rule)', background: 'var(--ed-cream)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '3px', flexShrink: 0, background: color, borderRadius: '2px', alignSelf: 'stretch', opacity: 0.35 }} />
                <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.9 }}>{expandedContent}</div>
              </div>
            )}
            {question && options && (
              <div style={{ padding: '18px 20px 20px', borderTop: '1px solid var(--ed-rule)', background: 'var(--ed-cream)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff' }}>{name[0]}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', letterSpacing: '0.12em' }}>{name.toUpperCase().split(' ')[0]} ASKS</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ed-ink)', lineHeight: 1.55, marginBottom: '14px', fontFamily: "'Lora', serif" }}>{question}</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                  {options.map((opt, i) => {
                    const isSelected = selectedIdx === i;
                    const showResult = answered && isSelected;
                    const rc = opt.correct ? '#0D7A5A' : '#C85A40';
                    return (
                      <motion.button key={i} whileHover={!answered ? { x: 3 } : {}} whileTap={!answered ? { scale: 0.99 } : {}} onClick={() => handleAnswer(i)}
                        style={{ textAlign: 'left' as const, padding: '12px 16px', borderRadius: '8px', border: showResult ? `2px solid ${rc}` : isSelected ? `2px solid ${color}` : '1.5px solid var(--ed-rule)', background: showResult ? (opt.correct ? 'rgba(13,122,90,0.06)' : 'rgba(200,90,64,0.06)') : isSelected ? `${color}08` : 'var(--ed-card)', cursor: answered ? 'default' : 'pointer', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.55, fontFamily: 'inherit', transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '10px', opacity: answered && !isSelected ? 0.5 : 1 }}>
                        <span style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, border: showResult ? `1.5px solid ${rc}` : '1.5px solid var(--ed-rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: showResult ? rc : 'var(--ed-ink3)', background: showResult ? (opt.correct ? 'rgba(13,122,90,0.06)' : 'rgba(200,90,64,0.06)') : 'transparent', transition: 'all 0.15s' }}>
                          {showResult ? (opt.correct ? '✓' : '✗') : String.fromCharCode(65 + i)}
                        </span>
                        {opt.text}
                      </motion.button>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {answered && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                      style={{ marginTop: '12px', padding: '12px 14px', borderRadius: '8px', background: isCorrect ? 'rgba(13,122,90,0.06)' : 'rgba(181,114,10,0.06)', border: `1px solid ${isCorrect ? 'rgba(13,122,90,0.2)' : 'rgba(181,114,10,0.2)'}` }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', color: isCorrect ? '#0D7A5A' : '#B5720A', marginBottom: '5px' }}>{isCorrect ? '✓ RIGHT TRACK' : '→ THINK AGAIN'}</div>
                      <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{options[selectedIdx!].feedback}</div>
                      {conceptId && <div style={{ marginTop: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'var(--ed-ink3)', letterSpacing: '0.08em' }}>{isCorrect ? '↑ concept mastery updated' : '· try the section quiz for more practice'}</div>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const SWEConversationScene = ({
  track, lines, mentorName, mentorRole, mentorColor,
}: {
  track: SWETrack;
  lines: CSLine[];
  mentorName: string;
  mentorRole: string;
  mentorColor: string;
}) => {
  const protagonistName = track === 'python' ? 'Aisha' : track === 'java' ? 'Vikram' : 'Leo';
  const protagonistColor = track === 'python' ? '#16A34A' : track === 'java' ? '#0369A1' : '#CA8A04';
  const protagonistRole = track === 'python' ? 'Junior Software Engineer' : track === 'java' ? 'Junior Backend Engineer' : 'Junior Full-Stack Developer';

  return (
    <div style={{ margin: '28px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {lines.map((l, i) => {
        const isProtagonist = l.speaker === 'protagonist';
        const prevDifferent = i === 0 || lines[i - 1].speaker !== l.speaker;
        const bubble = (
          <motion.div
            whileHover={isProtagonist ? {} : { y: -2, boxShadow: `0 6px 20px ${mentorColor}22` }}
            transition={{ duration: 0.2 }}
            style={{
              background: isProtagonist ? `${protagonistColor}12` : 'var(--ed-card)',
              border: `1px solid ${isProtagonist ? `${protagonistColor}28` : mentorColor + '30'}`,
              borderLeft: isProtagonist ? undefined : `3px solid ${mentorColor}`,
              borderRadius: isProtagonist ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
              padding: '10px 14px', fontSize: '13.5px', color: 'var(--ed-ink)', lineHeight: 1.68,
              boxShadow: isProtagonist ? 'none' : '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            {l.text}
          </motion.div>
        );
        return (
          <div key={i} style={{ display: 'flex', flexDirection: isProtagonist ? 'row-reverse' : 'row', gap: '12px', alignItems: 'flex-end' }}>
            {/* Avatar */}
            {prevDifferent ? (
              isProtagonist ? (
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: protagonistColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0, boxShadow: `0 2px 8px ${protagonistColor}40` }}>
                  {protagonistName.slice(0, 2)}
                </div>
              ) : (
                <div style={{ width: 48, height: 48, flexShrink: 0, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${mentorColor}`, boxShadow: `0 2px 10px ${mentorColor}30` }}>
                  <SWEMentorFace name={mentorName} size={48} />
                </div>
              )
            ) : (
              <div style={{ width: isProtagonist ? 42 : 48, flexShrink: 0 }} />
            )}
            {/* Bubble + name */}
            <div style={{ maxWidth: '70%' }}>
              {prevDifferent && (
                <div style={{ fontSize: '10px', fontWeight: 700, color: isProtagonist ? protagonistColor : mentorColor, marginBottom: '5px', textAlign: isProtagonist ? 'right' : 'left', letterSpacing: '0.05em', fontFamily: "'JetBrains Mono', monospace" }}>
                  {isProtagonist ? protagonistName : mentorName}
                  <span style={{ fontWeight: 400, opacity: 0.65 }}> &middot; {isProtagonist ? protagonistRole : mentorRole}</span>
                </div>
              )}
              {bubble}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── QuickTry: Interactive Micro-Practice ─────────────────────────────
export const QuickTry = ({
  track, initialCode, problem, hint, onRun
}: {
  track: SWETrack; initialCode: string; problem: string; hint: string; onRun: (code: string) => void;
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'running' | 'success'>('idle');

  const handleRun = () => {
    setStatus('running');
    setTimeout(() => {
      setOutput('Success: Code executed successfully.');
      setStatus('success');
      onRun(code);
    }, 800);
  };

  const accentColor = track === 'python' ? '#16A34A' : track === 'java' ? '#0369A1' : '#CA8A04';

  return (
    <div style={{ margin: '24px 0', borderRadius: '12px', border: '1px solid var(--ed-rule)', overflow: 'hidden', background: '#0d1117' }}>
      <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: accentColor }} />
          <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, letterSpacing: '0.1em' }}>MICRO-PRACTICE</span>
        </div>
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{ fontSize: '14px', color: '#e2e8f0', marginBottom: '16px', lineHeight: 1.6 }}>{problem}</div>
        <textarea 
          value={code} 
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          style={{ width: '100%', minHeight: '120px', background: '#161b22', border: '1px solid #30363d', borderRadius: '6px', color: '#e6edf3', padding: '12px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', lineHeight: 1.6, resize: 'vertical' }} 
        />
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleRun}
            style={{ padding: '8px 24px', background: accentColor, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
          >
            {status === 'running' ? 'RUNNING...' : 'RUN CODE'}
          </motion.button>
          <div style={{ fontSize: '12px', color: '#8b949e', fontStyle: 'italic' }}>Hint: {hint}</div>
        </div>
        {output && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '16px', padding: '12px', background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: '6px', color: '#4ade80', fontSize: '13px', fontFamily: "'JetBrains Mono', monospace" }}>
            {output}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ─── DataBehaviorVisualizer: 2D Visualizer ─────────────────────────────
export const DataBehaviorVisualizer = () => {
  const [items, setItems] = useState<string[]>(['Alice', 'Bob', 'Charlie']);
  const [type, setType] = useState<'list' | 'set' | 'map'>('list');

  return (
    <div style={{ margin: '24px 0', padding: '24px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px' }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        {(['list', 'set', 'map'] as const).map(t => (
          <button key={t} onClick={() => setType(t)} style={{ padding: '6px 16px', borderRadius: '20px', border: type === t ? 'none' : '1px solid var(--ed-rule)', background: type === t ? '#333' : 'transparent', color: type === t ? '#fff' : 'var(--ed-ink)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', minHeight: '100px', alignItems: 'center' }}>
        {items.map((item, i) => (
          <motion.div key={i} layout initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ padding: '12px 20px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>
            {type === 'map' ? `ID_${i+1}: ${item}` : item}
          </motion.div>
        ))}
        <button onClick={() => setItems([...items, 'NewItem'])} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px dashed var(--ed-rule)', background: 'transparent', color: 'var(--ed-ink3)', cursor: 'pointer', fontSize: '20px' }}>+</button>
      </div>
      <div style={{ marginTop: '20px', fontSize: '12px', color: 'var(--ed-ink3)', fontStyle: 'italic' }}>
        {type === 'list' && "Lists keep items in the exact order you add them."}
        {type === 'set' && "Sets automatically remove duplicates. No two items can be the same."}
        {type === 'map' && "Maps link Keys (IDs) to Values (Names) for instant lookup."}
      </div>
    </div>
  );
};

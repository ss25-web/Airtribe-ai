'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MentorFace } from './MentorFaces';

const ACCENT     = '#E07A5F';
const ACCENT_RGB = '224,122,95';

export default function Track2CommunicationPM({
  completedSections = new Set<string>(),
}: {
  completedSections?: Set<string>;
}) {
  return (
    <article style={{ padding: '0 0 80px' }}>
      <div style={{ position: 'relative', padding: '72px 0 48px', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-20px', top: '-10px', fontSize: 'clamp(140px, 18vw, 220px)', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.06)`, fontFamily: "'Lora', Georgia, serif", letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>06</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '14px', textTransform: 'uppercase' as const }}>PM Fundamentals &middot; Module 06 &middot; Scale Track</div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.03em', color: 'var(--ed-ink)', marginBottom: '16px', fontFamily: "'Lora', Georgia, serif" }}>Effective Communication</h1>
          <p style={{ fontSize: '16px', color: 'var(--ed-ink2)', lineHeight: 1.8, marginBottom: '40px', maxWidth: '560px' }}>
            You already know how to communicate. This module is about communication at scale — across conflicting stakeholders, enterprise customers, leadership, and ambiguous situations where precision and trust are both on the line.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px 28px', background: 'var(--ed-card)', borderRadius: '12px', border: '1px solid var(--ed-rule)', borderLeft: `4px solid ${ACCENT}` }}>
            <MentorFace mentor="asha" size={48} />
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '6px', textTransform: 'uppercase' as const }}>Coming Soon</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ed-ink)', marginBottom: '4px' }}>Scale Track content is in development.</div>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>This track follows Aarav Menon, Senior PM at CloudBridge, through stakeholder calibration, exec QBRs, enterprise roadmap negotiation, and building a communication operating system.</div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

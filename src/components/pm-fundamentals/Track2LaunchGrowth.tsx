'use client';

import React from 'react';
import { MentorFace } from './MentorFaces';

const ACCENT = '#0D7A5A';

export default function Track2LaunchGrowth({ completedSections = new Set<string>() }: { completedSections?: Set<string> }) {
  return (
    <article style={{ padding: '0 0 80px' }}>
      <div style={{ position: 'relative', padding: '72px 0 48px', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-20px', top: '-10px', fontSize: 'clamp(140px,18vw,220px)', fontWeight: 700, lineHeight: 1, color: 'rgba(13,122,90,0.06)', fontFamily: "'Lora',Georgia,serif", letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>08</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '14px', textTransform: 'uppercase' as const }}>PM Fundamentals &middot; Module 08 &middot; Scale Track</div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.03em', color: 'var(--ed-ink)', marginBottom: '16px', fontFamily: "'Lora',Georgia,serif" }}>Launch, Growth &amp; Go-to-Market</h1>
          <p style={{ fontSize: '16px', color: 'var(--ed-ink2)', lineHeight: 1.8, marginBottom: '40px', maxWidth: '560px' }}>
            You already know how to ship. This track is about the harder decisions: enterprise launch sequencing, growth system design under org complexity, monetization strategy, and choosing the GTM motion that matches your product reality at scale.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px 28px', background: 'var(--ed-card)', borderRadius: '12px', border: '1px solid var(--ed-rule)', borderLeft: `4px solid ${ACCENT}` }}>
            <MentorFace mentor="asha" size={48} />
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '6px', textTransform: 'uppercase' as const }}>Coming Soon</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ed-ink)', marginBottom: '4px' }}>Scale Track content is in development.</div>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>Covers enterprise launch sequencing, growth system design under org pressure, monetization strategy at scale, and choosing between PLG, hybrid, and sales-led motions with evidence.</div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

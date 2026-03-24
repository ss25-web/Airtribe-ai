'use client';

import React from 'react';
import { ChapterSection, NextChapterTeaser, SituationCard } from './designSystem';
import { para } from './designSystem';

const ACCENT     = '#E07A5F';
const ACCENT_RGB = '224,122,95';

export default function Track2UXDesign() {
  return (
    <article style={{ maxWidth: '720px', margin: '0 auto', padding: '0 0 80px' }}>

      <div style={{ background: 'var(--ed-cream)', borderRadius: '14px', padding: '40px 40px 32px', marginBottom: '0', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-16px', top: '-8px', fontSize: '160px', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.05)`, fontFamily: "'Lora','Georgia',serif", letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>04</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: '10px' }}>Module 04 · Scale Track</div>
        <h1 style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, color: 'var(--ed-ink)', lineHeight: 1.15, letterSpacing: '-0.025em', fontFamily: "'Lora','Georgia',serif", marginBottom: '12px' }}>
          UX Leadership & Design Systems
        </h1>
        {para(<>Priya is no longer filing UX bugs. She&apos;s setting design principles, running design critiques, and deciding when to invest in a design system vs. moving fast with inconsistency. This track covers design decision frameworks, working with senior designers, and building products at the intersection of speed and craft.</>)}
        <div style={{ marginTop: '24px', padding: '16px 20px', background: `rgba(${ACCENT_RGB},0.06)`, borderRadius: '10px', border: `1px solid rgba(${ACCENT_RGB},0.15)` }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: '8px' }}>Coming soon</div>
          <p style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7, margin: 0 }}>
            The APM track for this module is in production. Track 1 is available now — it covers the UX debug loop, spec completeness, and how loading states can be the difference between 30% and 58% completion.
          </p>
        </div>
      </div>

      <ChapterSection id="m4-apm-preview" num="01" accentRgb={ACCENT_RGB} first>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Priya&apos;s team has shipped 12 features this quarter. The design quality is inconsistent — some screens feel polished, others feel cobbled together. A new designer just joined and has opinions. The CPO wants a design system. Priya has 2 engineers and 6 weeks.
        </SituationCard>
        {para(<>Where the New PM track asks &ldquo;how do I write a complete spec,&rdquo; the APM track asks: how do you build design culture, set quality bars, and decide when craft is worth the investment?</>)}
        {para(<>Topics: design principles vs. design systems, running effective design critiques, when to go fast vs. when to go right, measuring UX quality, and building a shared visual language with a small team.</>)}
        <NextChapterTeaser text="Next up: Communication for PMs — from product decisions to stakeholder alignment." />
      </ChapterSection>

    </article>
  );
}

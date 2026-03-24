'use client';

import React from 'react';
import { ChapterSection, NextChapterTeaser, SituationCard } from './designSystem';
import { para } from './designSystem';

const ACCENT     = '#C85A40';
const ACCENT_RGB = '200,90,64';

export default function Track2Prioritization() {
  return (
    <article style={{ maxWidth: '720px', margin: '0 auto', padding: '0 0 80px' }}>

      {/* Hero */}
      <div style={{ ...{ background: 'var(--ed-cream)', borderRadius: '14px', padding: '40px 40px 32px', marginBottom: '0', position: 'relative', overflow: 'hidden' } }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-16px', top: '-8px', fontSize: '160px', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.05)`, fontFamily: "'Lora','Georgia',serif", letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>03</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: '10px' }}>Module 03 · Scale Track</div>
        <h1 style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, color: 'var(--ed-ink)', lineHeight: 1.15, letterSpacing: '-0.025em', fontFamily: "'Lora','Georgia',serif", marginBottom: '12px' }}>
          Strategic Prioritisation at Scale
        </h1>
        {para(<>Priya is no longer choosing between four backlog items. She&apos;s managing a 30-item roadmap, three competing product bets, and a board that wants quarterly commitments. This module covers opportunity scoring, Now/Next/Later roadmaps, kill criteria, and how to say no to good ideas.</>)}
        <div style={{ marginTop: '24px', padding: '16px 20px', background: 'rgba(200,90,64,0.06)', borderRadius: '10px', border: '1px solid rgba(200,90,64,0.15)' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: '8px' }}>Coming soon</div>
          <p style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7, margin: 0 }}>
            This track is currently in production. Track 1 (New PM) is available now — it covers the fundamentals of problem framing and RICE prioritisation with Priya&apos;s story.
          </p>
        </div>
      </div>

      <ChapterSection id="m3-apm-preview" num="01" accentRgb={ACCENT_RGB} first>
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
          Q2 planning. Priya has 30 items on the roadmap, a VP asking for CRM integration, an ML team pitching a new recommendation engine, and a board deck due Friday. She has capacity for two bets.
        </SituationCard>
        {para(<>Where the New PM track asks &ldquo;how do I pick between four tasks,&rdquo; the APM track asks something harder: how do you hold a portfolio of bets, say no to good ideas, and build a roadmap that survives contact with reality?</>)}
        {para(<>Topics this track will cover: opportunity scoring vs. RICE, the Now/Next/Later framework, kill criteria for features already in flight, managing upward on priority calls, and using AI tools to accelerate roadmap synthesis.</>)}
        <NextChapterTeaser text="Next up: UX & Design Collaboration — turning a prioritised problem into something users can actually react to." />
      </ChapterSection>

    </article>
  );
}

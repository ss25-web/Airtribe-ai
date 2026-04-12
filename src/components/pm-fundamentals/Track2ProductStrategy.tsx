'use client';

import React from 'react';
import { NextChapterTeaser } from './designSystem';

export default function Track2ProductStrategy() {
  return (
    <>
      <div style={{
        padding: '48px 32px', textAlign: 'center', background: 'var(--ed-card)',
        borderRadius: '12px', border: '1px solid var(--ed-rule)', marginBottom: '32px',
      }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🧭</div>
        <h2 style={{ fontFamily: "'Lora', serif", fontSize: '22px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '12px' }}>
          Scale Track — Coming Soon
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.8, maxWidth: '440px', margin: '0 auto' }}>
          The APM track for Product Strategy goes deeper into portfolio-level strategy,
          platform thinking, and leading strategy across multiple product lines.
          Check back soon.
        </p>
      </div>
      <NextChapterTeaser text="Next up: Problem Discovery — where strategy meets the real messy world of users." />
    </>
  );
}

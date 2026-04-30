'use client';

import React, { useEffect, useState } from 'react';

// ─── Correct Airtribe logo — two interlocking chevron/diamond shapes ──────────

export function AirtribeLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* Two-tone geometric mark matching Airtribe brand */}
      <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
        <path d="M0 10L7 0L14 10L7 20Z" fill="#8B5CF6" />
        <path d="M8 10L15 0L22 10L15 20Z" fill="#4338CA" />
      </svg>
      <span style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '14px',
        fontWeight: 700,
        color: 'var(--ed-ink)',
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}>
        Airtribe
      </span>
    </div>
  );
}

// ─── Global dark mode toggle — reads/writes same localStorage key as page.tsx ─

const LS_DARK = 'airtribe_dark';

export function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Sync with whatever state page.tsx already set
    const saved = localStorage.getItem(LS_DARK) === 'true';
    setDark(saved);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(LS_DARK, String(next));
  };

  return (
    <button
      onClick={toggle}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 32, height: 32,
        borderRadius: '8px',
        border: '1px solid var(--ed-rule)',
        background: 'var(--ed-card)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '15px',
        flexShrink: 0,
        transition: 'background 0.15s',
      }}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}

'use client';

import React, { useEffect, useState } from 'react';

// ─── Correct Airtribe logo — two interlocking chevron/diamond shapes ──────────

export function AirtribeLogo({ color = 'var(--ed-ink)' }: { color?: string } = {}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
      {/*
        Two overlapping diamond/chevron shapes — no background box.
        Left: lighter violet #8B5CF6  Right: deeper indigo #4338CA
        They overlap at roughly 40% of their width, right draws on top.
      */}
      <svg width="30" height="22" viewBox="0 0 30 22" fill="none">
        <path d="M0 11L9 0L18 11L9 22Z" fill="#8B5CF6" />
        <path d="M8 11L17 0L26 11L17 22Z" fill="#4338CA" />
      </svg>
      <span style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '14px',
        fontWeight: 700,
        color,
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

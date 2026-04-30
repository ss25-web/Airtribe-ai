'use client';

import React, { useEffect, useState } from 'react';

export function AirtribeLogo({ color = 'var(--ed-ink)' }: { color?: string } = {}) {
  void color;

  return (
    <img
      src="/Airtribe-ai/airtribe-logo.png"
      alt="Airtribe"
      style={{ display: 'block', width: '128px', height: 'auto', flexShrink: 0 }}
    />
  );
}

const LS_DARK = 'airtribe_dark';

export function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
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
        width: 32,
        height: 32,
        borderRadius: '8px',
        border: '1px solid var(--ed-rule)',
        background: 'var(--ed-card)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '15px',
        flexShrink: 0,
        transition: 'background 0.15s',
      }}
    >
      {dark ? '\u2600\ufe0f' : '\ud83c\udf19'}
    </button>
  );
}

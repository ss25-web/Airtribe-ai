'use client';

// Shared LangSmith/LangGraph Studio chrome used across GenAI PR6 (Agents).
// Every agent tool renders with the same product chrome — sidebar with the
// LangSmith logo, project breadcrumb, the navy/teal palette LangSmith uses,
// monospace traces, dark canvas, and the LangSmith dot logo.

import React from 'react';

export const LS = {
  bg: '#0B0F19',
  panel: '#101524',
  panelAlt: '#0E1320',
  border: '#1B2236',
  borderLight: '#243049',
  inkPrimary: '#E5E7EB',
  inkSecondary: '#9CA3AF',
  inkMuted: '#6B7280',
  accent: '#10B981',   // LangSmith teal/green
  accentAlt: '#22D3EE', // LangGraph cyan
  reason: '#A78BFA',
  act: '#FCD34D',
  obs: '#34D399',
  err: '#F87171',
};

export const LangSmithFrame = ({ project, run, view, status = 'success', children }: {
  project: string;
  run?: string;
  view: string;
  status?: 'success' | 'error' | 'pending';
  children: React.ReactNode;
}) => (
  <div style={{
    background: LS.bg,
    borderRadius: 12,
    overflow: 'hidden',
    border: `1px solid ${LS.border}`,
    boxShadow: '0 14px 36px rgba(0,0,0,0.45)',
    color: LS.inkPrimary,
    fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
  }}>
    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: `1px solid ${LS.border}`, background: '#080B14' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* LangSmith mark — three dots in a triangle */}
        <div style={{ width: 22, height: 22, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 7, width: 6, height: 6, borderRadius: '50%', background: LS.accent }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 6, height: 6, borderRadius: '50%', background: LS.accent }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 6, height: 6, borderRadius: '50%', background: LS.accent }} />
          <div style={{ position: 'absolute', top: 6, left: 3, width: 16, height: 1, background: 'rgba(16,185,129,0.40)' }} />
          <div style={{ position: 'absolute', top: 6, left: 9, width: 1, height: 11, background: 'rgba(16,185,129,0.40)', transform: 'rotate(28deg)', transformOrigin: 'top left' }} />
          <div style={{ position: 'absolute', top: 6, right: 9, width: 1, height: 11, background: 'rgba(16,185,129,0.40)', transform: 'rotate(-28deg)', transformOrigin: 'top right' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: LS.inkPrimary, letterSpacing: '-0.01em' }}>LangSmith</span>
          <span style={{ fontSize: 10, color: LS.inkMuted }}>·</span>
          <span style={{ fontSize: 10.5, color: LS.inkSecondary, fontWeight: 600 }}>{project}</span>
          {run && (
            <>
              <span style={{ fontSize: 10, color: LS.inkMuted }}>/</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: LS.accentAlt }}>{run}</span>
            </>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: LS.inkMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{view}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 5, background: status === 'success' ? 'rgba(16,185,129,0.14)' : status === 'error' ? 'rgba(248,113,113,0.14)' : 'rgba(252,211,77,0.14)', border: `1px solid ${status === 'success' ? 'rgba(16,185,129,0.40)' : status === 'error' ? 'rgba(248,113,113,0.40)' : 'rgba(252,211,77,0.40)'}` }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: status === 'success' ? LS.accent : status === 'error' ? LS.err : '#FCD34D' }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: status === 'success' ? LS.accent : status === 'error' ? LS.err : '#FCD34D', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>{status.toUpperCase()}</span>
        </div>
      </div>
    </div>
    {children}
  </div>
);

export const LangSmithLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9, fontWeight: 700,
    letterSpacing: '0.16em', color: LS.inkMuted,
    textTransform: 'uppercase',
  }}>{children}</div>
);

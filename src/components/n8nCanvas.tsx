'use client';

// Shared n8n editor primitives used across GenAI Pre-Reads 4 and 5.
// Every tool that teaches an n8n concept renders with the same window
// chrome, dotted canvas grid, node cards (coloured top bar + icon block
// + label + TYPE chip + status dot) and SVG bezier connectors with
// arrowheads so the learner sees the same n8n editor everywhere.

import React from 'react';

export const NODE_TYPES = {
  trigger:   { label: 'Trigger',     color: '#0F766E' },
  data:      { label: 'Data',        color: '#2563EB' },
  transform: { label: 'Transform',   color: '#7C3AED' },
  ai:        { label: 'AI Node',     color: '#F59E0B' },
  output:    { label: 'Output',      color: '#16A34A' },
  error:     { label: 'Error Path',  color: '#DC2626' },
  loop:      { label: 'Loop',        color: '#0891B2' },
  wait:      { label: 'Wait',        color: '#A855F7' },
  memory:    { label: 'Memory',      color: '#EAB308' },
} as const;
export type NodeTypeKey = keyof typeof NODE_TYPES;

export const N8N_NW = 168;
export const N8N_NH = 62;

export const N8nFrame = ({ filename, status = 'ACTIVE', children }: { filename: string; status?: string; children: React.ReactNode }) => (
  <div style={{ background: '#0F1117', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
    <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '10px', background: '#141920' }}>
      <div style={{ display: 'flex', gap: '5px' }}>
        {(['#FF5F57', '#FFBD2E', '#28C840'] as const).map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
      </div>
      <div style={{ flex: 1, textAlign: 'center' as const, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>
        n8n — {filename}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: status === 'ACTIVE' ? '#22C55E' : status === 'ERROR' ? '#DC2626' : '#F59E0B' }} />
        <span style={{ fontSize: 9, color: status === 'ACTIVE' ? '#22C55E' : status === 'ERROR' ? '#DC2626' : '#F59E0B', fontFamily: "'JetBrains Mono', monospace" }}>{status}</span>
      </div>
    </div>
    {children}
  </div>
);

export const N8nNodeCard = ({ x, y, label, typeKey, icon, selected, ghost, w = N8N_NW, h = N8N_NH, onClick, status, subLabel }: {
  x: number; y: number; label: string; typeKey: NodeTypeKey | null;
  icon: string; selected?: boolean; ghost?: boolean; w?: number; h?: number;
  onClick?: () => void; status?: 'ok' | 'fail' | 'pending'; subLabel?: string;
}) => {
  const type = typeKey ? NODE_TYPES[typeKey] : { label: '—', color: '#374151' };
  const isGhost = !typeKey || ghost;
  return (
    <div onClick={onClick} style={{
      position: 'absolute' as const, left: x, top: y, width: w, height: h,
      background: isGhost ? 'rgba(255,255,255,0.04)' : (selected ? '#1C2333' : '#181F2E'),
      border: `1.5px ${isGhost ? 'dashed' : 'solid'} ${selected ? type.color : isGhost ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 8, cursor: onClick ? 'pointer' : 'default', overflow: 'hidden',
      boxShadow: selected ? `0 0 0 2px ${type.color}25, 0 8px 28px rgba(0,0,0,0.35)` : '0 2px 8px rgba(0,0,0,0.2)',
      transition: 'all 0.2s',
    }}>
      <div style={{ height: 3, background: isGhost ? 'rgba(255,255,255,0.12)' : type.color }} />
      <div style={{ padding: '7px 9px', display: 'flex', alignItems: 'center', gap: 8, height: h - 3 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 6,
          background: isGhost ? 'rgba(255,255,255,0.06)' : `${type.color}1A`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0,
          color: isGhost ? 'rgba(255,255,255,0.35)' : type.color,
        }}>{icon}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: isGhost ? 'rgba(226,232,240,0.55)' : '#E2E8F0', lineHeight: 1.2, marginBottom: 3, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
          <div style={{ fontSize: 8, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: isGhost ? 'rgba(255,255,255,0.35)' : type.color, letterSpacing: '0.08em' }}>{subLabel ?? type.label.toUpperCase()}</div>
        </div>
        {status === 'ok' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />}
        {status === 'fail' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626', flexShrink: 0 }} />}
        {status === 'pending' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B', flexShrink: 0 }} />}
      </div>
    </div>
  );
};

export const n8nBezier = (x1: number, y1: number, x2: number, y2: number, side: 'side' | 'down' | 'up' = 'side') => {
  if (side === 'down') {
    const my = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${my} ${x2} ${my} ${x2} ${y2}`;
  }
  if (side === 'up') {
    const my = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${my} ${x2} ${my} ${x2} ${y2}`;
  }
  const cx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${cx} ${y1} ${cx} ${y2} ${x2} ${y2}`;
};

export const N8nCanvas = ({ width, height, children }: { width: number; height: number; children: React.ReactNode }) => (
  <div style={{
    overflowX: 'auto' as const, padding: '24px 20px 20px',
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
    backgroundSize: '22px 22px', backgroundColor: '#0F1117',
  }}>
    <div style={{ position: 'relative' as const, width, height }}>{children}</div>
  </div>
);

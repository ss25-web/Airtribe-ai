'use client';

// Shared Claude Desktop / MCP chrome used across GenAI PR7 (MCP).
// Every MCP tool wraps in ClaudeDesktopFrame so the chat panes, settings
// pages, and developer logs all look like they live inside the same
// Claude Desktop app — coral logo, dark sidebar, claude-3-5-sonnet badge,
// MCP-tools tray, and the unmistakable Claude UI tone.

import React from 'react';

export const CD = {
  bg: '#1A1A1A',
  sidebar: '#0F0F0F',
  panel: '#212121',
  panelAlt: '#171717',
  border: '#2A2A2A',
  borderLight: '#3A3A3A',
  inkPrimary: '#F5F5F5',
  inkSecondary: '#A3A3A3',
  inkMuted: '#737373',
  accent: '#C66B3D',          // Claude/Anthropic coral
  accentDark: '#A35528',
  tool: '#A78BFA',
  user: '#FAFAFA',
};

export const ClaudeDesktopFrame = ({ chatTitle = 'New chat', view, model = 'claude-3-5-sonnet', mcpServers = 0, children }: {
  chatTitle?: string;
  view: string;
  model?: string;
  mcpServers?: number;
  children: React.ReactNode;
}) => (
  <div style={{
    background: CD.bg,
    borderRadius: 12,
    overflow: 'hidden',
    border: `1px solid ${CD.border}`,
    boxShadow: '0 14px 36px rgba(0,0,0,0.45)',
    color: CD.inkPrimary,
    fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
  }}>
    {/* Window titlebar — macOS-style */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', background: '#0A0A0A', borderBottom: `1px solid ${CD.border}` }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {(['#FF5F57', '#FEBC2E', '#28C840'] as const).map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 16, height: 16, borderRadius: 4, background: CD.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 10, fontFamily: 'serif' }}>A</div>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: CD.inkPrimary }}>Claude</span>
        <span style={{ fontSize: 10, color: CD.inkMuted }}>·</span>
        <span style={{ fontSize: 10.5, color: CD.inkSecondary }}>{chatTitle}</span>
      </div>
      <div style={{ fontSize: 10, color: CD.inkMuted, fontFamily: "'JetBrains Mono', monospace" }}>{view}</div>
    </div>

    {/* Top toolbar — model badge + MCP servers indicator */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: CD.panelAlt, borderBottom: `1px solid ${CD.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 9px', background: 'rgba(198,107,61,0.10)', border: `1px solid ${CD.accent}40`, borderRadius: 5 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: CD.accent }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: CD.accent, fontWeight: 700 }}>{model}</span>
        </div>
        {mcpServers > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', background: 'rgba(167,139,250,0.10)', border: `1px solid ${CD.tool}40`, borderRadius: 5 }}>
            <span style={{ fontSize: 11, color: CD.tool }}>⚒</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: CD.tool, fontWeight: 700 }}>{mcpServers} MCP server{mcpServers === 1 ? '' : 's'}</span>
          </div>
        )}
      </div>
      <div style={{ fontSize: 10, color: CD.inkMuted }}>⋯</div>
    </div>
    {children}
  </div>
);

export const CDLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9, fontWeight: 700,
    letterSpacing: '0.16em',
    color: CD.inkMuted,
    textTransform: 'uppercase',
  }}>{children}</div>
);

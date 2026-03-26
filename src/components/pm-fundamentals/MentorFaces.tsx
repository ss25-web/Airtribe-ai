'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────
// MENTOR PRESETS
// ─────────────────────────────────────────
export type MentorId = 'asha' | 'dev' | 'maya' | 'kiran' | 'priya' | 'rohan';

export const MENTOR_META: Record<MentorId, { name: string; role: string; accent: string }> = {
  asha:  { name: 'Asha',  role: 'PM Mentor',       accent: '#7843EE' },
  dev:   { name: 'Dev',   role: 'Engineer',         accent: '#3A86FF' },
  maya:  { name: 'Maya',  role: 'Designer',         accent: '#E07A5F' },
  kiran: { name: 'Kiran', role: 'Data & Analytics', accent: '#0097A7' },
  priya: { name: 'Priya', role: 'APM · EdSpark',    accent: '#4F46E5' },
  rohan: { name: 'Rohan', role: 'CEO · EdSpark',    accent: '#E67E22' },
};

// ─────────────────────────────────────────
// ASHA — PM Mentor  (warm brown skin, dark bun, round glasses)
// ─────────────────────────────────────────
const AshaFace = ({ blink }: { blink: boolean }) => (
  <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
    {/* Shirt / collar */}
    <ellipse cx="50" cy="106" rx="38" ry="18" fill="#5B21B6" />
    <path d="M 34 90 Q 50 102 66 90" fill="#7843EE" />
    {/* Neck */}
    <rect x="42" y="76" width="16" height="18" rx="6" fill="#C89060" />
    {/* Head */}
    <ellipse cx="50" cy="52" rx="26" ry="30" fill="#C89060" />
    {/* Ears */}
    <ellipse cx="24" cy="54" rx="5" ry="7" fill="#C89060" />
    <ellipse cx="76" cy="54" rx="5" ry="7" fill="#C89060" />
    <ellipse cx="25" cy="54" rx="3" ry="4.5" fill="#B07040" />
    <ellipse cx="75" cy="54" rx="3" ry="4.5" fill="#B07040" />
    {/* Hair — bun style */}
    <ellipse cx="50" cy="26" rx="26" ry="16" fill="#1C0A02" />
    <ellipse cx="50" cy="14" rx="10" ry="9" fill="#1C0A02" />
    <ellipse cx="50" cy="19" rx="7" ry="6" fill="#2C1A12" />
    {/* Side hair */}
    <ellipse cx="26" cy="40" rx="5" ry="12" fill="#1C0A02" />
    <ellipse cx="74" cy="40" rx="5" ry="12" fill="#1C0A02" />
    {/* Eyebrows */}
    <path d="M 32 41 Q 39 38 45 40" stroke="#1C0A02" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M 55 40 Q 61 38 68 41" stroke="#1C0A02" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    {/* Eye whites */}
    <ellipse cx="38" cy="50" rx="7" ry={blink ? 0.6 : 5.5} fill="white" />
    <ellipse cx="62" cy="50" rx="7" ry={blink ? 0.6 : 5.5} fill="white" />
    {/* Irises */}
    {!blink && <><circle cx="38" cy="51" r="3.5" fill="#4A2C0A" /><circle cx="62" cy="51" r="3.5" fill="#4A2C0A" /></>}
    {/* Pupils */}
    {!blink && <><circle cx="38.8" cy="51" r="1.8" fill="#0D0808" /><circle cx="62.8" cy="51" r="1.8" fill="#0D0808" /></>}
    {/* Eye shine */}
    {!blink && <><circle cx="40" cy="49.5" r="0.9" fill="rgba(255,255,255,0.85)" /><circle cx="64" cy="49.5" r="0.9" fill="rgba(255,255,255,0.85)" /></>}
    {/* Glasses */}
    <rect x="29" y="44.5" width="18" height="12" rx="5" fill="none" stroke="#1C0A02" strokeWidth="1.8" />
    <rect x="53" y="44.5" width="18" height="12" rx="5" fill="none" stroke="#1C0A02" strokeWidth="1.8" />
    <line x1="47" y1="50" x2="53" y2="50" stroke="#1C0A02" strokeWidth="1.6" />
    <line x1="23" y1="49" x2="29" y2="50" stroke="#1C0A02" strokeWidth="1.4" />
    <line x1="71" y1="50" x2="77" y2="49" stroke="#1C0A02" strokeWidth="1.4" />
    {/* Nose */}
    <ellipse cx="50" cy="60" rx="2.5" ry="3.5" fill="#B07040" />
    {/* Mouth */}
    <path d="M 40 68 Q 50 74 60 68" stroke="#A06030" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M 41 68.5 Q 50 72 59 68.5" fill="rgba(180,80,60,0.4)" />
  </svg>
);

// ─────────────────────────────────────────
// DEV — Engineer  (deep brown skin, natural hair, beard, square glasses)
// ─────────────────────────────────────────
const DevFace = ({ blink }: { blink: boolean }) => (
  <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
    {/* Shirt */}
    <ellipse cx="50" cy="106" rx="38" ry="18" fill="#065F7A" />
    <path d="M 34 90 Q 50 102 66 90" fill="#0097A7" />
    {/* Neck */}
    <rect x="42" y="76" width="16" height="18" rx="6" fill="#6B3522" />
    {/* Head */}
    <ellipse cx="50" cy="52" rx="27" ry="30" fill="#6B3522" />
    {/* Ears */}
    <ellipse cx="23" cy="53" rx="5" ry="7.5" fill="#6B3522" />
    <ellipse cx="77" cy="53" rx="5" ry="7.5" fill="#6B3522" />
    <ellipse cx="24" cy="53" rx="3" ry="5" fill="#5A2C1A" />
    <ellipse cx="76" cy="53" rx="3" ry="5" fill="#5A2C1A" />
    {/* Natural hair — top rounded cap with texture */}
    <ellipse cx="50" cy="26" rx="27" ry="15" fill="#0F0F0F" />
    <ellipse cx="50" cy="22" rx="23" ry="13" fill="#1A1A1A" />
    {/* Tight curl texture suggestions */}
    <ellipse cx="35" cy="24" rx="5" ry="4" fill="#0F0F0F" />
    <ellipse cx="50" cy="21" rx="5" ry="4" fill="#0F0F0F" />
    <ellipse cx="65" cy="24" rx="5" ry="4" fill="#0F0F0F" />
    {/* Side hair */}
    <ellipse cx="25" cy="38" rx="5" ry="11" fill="#0F0F0F" />
    <ellipse cx="75" cy="38" rx="5" ry="11" fill="#0F0F0F" />
    {/* Eyebrows — strong */}
    <path d="M 31 40 Q 39 37 46 39.5" stroke="#0F0F0F" strokeWidth="2.8" strokeLinecap="round" fill="none" />
    <path d="M 54 39.5 Q 61 37 69 40" stroke="#0F0F0F" strokeWidth="2.8" strokeLinecap="round" fill="none" />
    {/* Eye whites */}
    <ellipse cx="38" cy="49" rx="7" ry={blink ? 0.6 : 5.5} fill="white" />
    <ellipse cx="62" cy="49" rx="7" ry={blink ? 0.6 : 5.5} fill="white" />
    {/* Irises */}
    {!blink && <><circle cx="38" cy="50" r="3.5" fill="#2C1A0E" /><circle cx="62" cy="50" r="3.5" fill="#2C1A0E" /></>}
    {!blink && <><circle cx="38.8" cy="50" r="1.8" fill="#050202" /><circle cx="62.8" cy="50" r="1.8" fill="#050202" /></>}
    {!blink && <><circle cx="40" cy="48.5" r="0.9" fill="rgba(255,255,255,0.8)" /><circle cx="64" cy="48.5" r="0.9" fill="rgba(255,255,255,0.8)" /></>}
    {/* Rectangular glasses */}
    <rect x="28" y="43.5" width="20" height="11" rx="3" fill="none" stroke="#0F0F0F" strokeWidth="2" />
    <rect x="52" y="43.5" width="20" height="11" rx="3" fill="none" stroke="#0F0F0F" strokeWidth="2" />
    <line x1="48" y1="49" x2="52" y2="49" stroke="#0F0F0F" strokeWidth="1.8" />
    <line x1="22" y1="48" x2="28" y2="48.5" stroke="#0F0F0F" strokeWidth="1.6" />
    <line x1="72" y1="48.5" x2="78" y2="48" stroke="#0F0F0F" strokeWidth="1.6" />
    {/* Nose */}
    <ellipse cx="50" cy="59" rx="2.5" ry="3.5" fill="#5A2C1A" />
    {/* Beard — lower face coverage */}
    <path d="M 30 66 Q 30 80 50 83 Q 70 80 70 66 Q 62 70 50 71 Q 38 70 30 66 Z" fill="#100A06" opacity="0.85" />
    {/* Mustache */}
    <path d="M 40 65 Q 50 69 60 65" stroke="#0F0F0F" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    {/* Mouth under beard */}
    <path d="M 42 67 Q 50 71 58 67" stroke="#A06030" strokeWidth="1.8" strokeLinecap="round" fill="none" />
  </svg>
);

// ─────────────────────────────────────────
// MAYA — Designer  (light skin, auburn bob, blue eyes)
// ─────────────────────────────────────────
const MayaFace = ({ blink }: { blink: boolean }) => (
  <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
    {/* Shirt */}
    <ellipse cx="50" cy="106" rx="38" ry="18" fill="#B85A42" />
    <path d="M 34 90 Q 50 102 66 90" fill="#E07A5F" />
    {/* Neck */}
    <rect x="42" y="76" width="16" height="18" rx="6" fill="#FCCBA0" />
    {/* Head */}
    <ellipse cx="50" cy="52" rx="25" ry="30" fill="#FCCBA0" />
    {/* Ears */}
    <ellipse cx="25" cy="54" rx="4.5" ry="7" fill="#FCCBA0" />
    <ellipse cx="75" cy="54" rx="4.5" ry="7" fill="#FCCBA0" />
    <ellipse cx="26" cy="54" rx="2.8" ry="4.5" fill="#EBB080" />
    <ellipse cx="74" cy="54" rx="2.8" ry="4.5" fill="#EBB080" />
    {/* Bob hair — top */}
    <ellipse cx="50" cy="25" rx="25" ry="14" fill="#8B2500" />
    {/* Bob side panels */}
    <rect x="25" y="28" width="12" height="36" rx="6" fill="#8B2500" />
    <rect x="63" y="28" width="12" height="36" rx="6" fill="#8B2500" />
    {/* Hair top detail */}
    <ellipse cx="50" cy="22" rx="22" ry="11" fill="#A03010" />
    <path d="M 32 28 Q 50 20 68 28" fill="#8B2500" />
    {/* Eyebrows — defined arch */}
    <path d="M 30 41 Q 38 37 44 40" stroke="#6B1800" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M 56 40 Q 62 37 70 41" stroke="#6B1800" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    {/* Eye whites */}
    <ellipse cx="37" cy="49" rx="7.5" ry={blink ? 0.6 : 5.5} fill="white" />
    <ellipse cx="63" cy="49" rx="7.5" ry={blink ? 0.6 : 5.5} fill="white" />
    {/* Blue irises */}
    {!blink && <><circle cx="37" cy="50" r="3.5" fill="#2563EB" /><circle cx="63" cy="50" r="3.5" fill="#2563EB" /></>}
    {!blink && <><circle cx="37.8" cy="50" r="1.8" fill="#0A0A20" /><circle cx="63.8" cy="50" r="1.8" fill="#0A0A20" /></>}
    {!blink && <><circle cx="39" cy="48.5" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="65" cy="48.5" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
    {/* Nose — small and defined */}
    <ellipse cx="50" cy="59" rx="2" ry="3" fill="#EBB080" />
    {/* Cheek blush */}
    <ellipse cx="27" cy="57" rx="6" ry="4" fill="rgba(220,100,80,0.15)" />
    <ellipse cx="73" cy="57" rx="6" ry="4" fill="rgba(220,100,80,0.15)" />
    {/* Mouth — confident smile */}
    <path d="M 39 67 Q 50 73 61 67" stroke="#C07050" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M 40 67.5 Q 50 71.5 60 67.5" fill="rgba(200,80,60,0.35)" />
  </svg>
);

// ─────────────────────────────────────────
// KIRAN — Data & Analytics  (warm tan, dark short hair, strong features)
// ─────────────────────────────────────────
const KiranFace = ({ blink }: { blink: boolean }) => (
  <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
    {/* Shirt */}
    <ellipse cx="50" cy="106" rx="38" ry="18" fill="#1E40AF" />
    <path d="M 34 90 Q 50 102 66 90" fill="#3A86FF" />
    {/* Neck */}
    <rect x="42" y="76" width="16" height="18" rx="6" fill="#C87941" />
    {/* Head */}
    <ellipse cx="50" cy="52" rx="26" ry="30" fill="#C87941" />
    {/* Ears */}
    <ellipse cx="24" cy="53" rx="5" ry="7" fill="#C87941" />
    <ellipse cx="76" cy="53" rx="5" ry="7" fill="#C87941" />
    <ellipse cx="25" cy="53" rx="3" ry="4.5" fill="#A86030" />
    <ellipse cx="75" cy="53" rx="3" ry="4.5" fill="#A86030" />
    {/* Short hair — close fade cut */}
    <ellipse cx="50" cy="24" rx="26" ry="14" fill="#1F2937" />
    <ellipse cx="50" cy="22" rx="24" ry="12" fill="#262F3D" />
    {/* Hairline */}
    <path d="M 26 32 Q 50 26 74 32" fill="#1F2937" />
    {/* Side temples */}
    <ellipse cx="26" cy="37" rx="4.5" ry="9" fill="#1F2937" />
    <ellipse cx="74" cy="37" rx="4.5" ry="9" fill="#1F2937" />
    {/* Eyebrows — sharp and strong */}
    <path d="M 30 41 Q 39 37.5 46 40" stroke="#1F2937" strokeWidth="2.8" strokeLinecap="round" fill="none" />
    <path d="M 54 40 Q 61 37.5 70 41" stroke="#1F2937" strokeWidth="2.8" strokeLinecap="round" fill="none" />
    {/* Eye whites */}
    <ellipse cx="38" cy="50" rx="7.5" ry={blink ? 0.6 : 5.5} fill="white" />
    <ellipse cx="62" cy="50" rx="7.5" ry={blink ? 0.6 : 5.5} fill="white" />
    {/* Dark irises */}
    {!blink && <><circle cx="38" cy="51" r="3.5" fill="#1F2937" /><circle cx="62" cy="51" r="3.5" fill="#1F2937" /></>}
    {!blink && <><circle cx="38.8" cy="51" r="1.8" fill="#0A0C10" /><circle cx="62.8" cy="51" r="1.8" fill="#0A0C10" /></>}
    {!blink && <><circle cx="40" cy="49.5" r="0.9" fill="rgba(255,255,255,0.85)" /><circle cx="64" cy="49.5" r="0.9" fill="rgba(255,255,255,0.85)" /></>}
    {/* Nose */}
    <ellipse cx="50" cy="60" rx="3" ry="4" fill="#A86030" />
    <ellipse cx="46" cy="62" rx="2" ry="2.5" fill="#A86030" />
    <ellipse cx="54" cy="62" rx="2" ry="2.5" fill="#A86030" />
    {/* Mouth — straight with slight upward curve */}
    <path d="M 40 68 Q 50 73 60 68" stroke="#9A5020" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M 41 68.5 Q 50 72 59 68.5" fill="rgba(170,70,30,0.3)" />
    {/* Jaw definition */}
    <ellipse cx="50" cy="80" rx="20" ry="6" fill="#B86A30" opacity="0.3" />
  </svg>
);

// ─────────────────────────────────────────
// PRIYA — APM protagonist  (warm medium-brown skin, long dark hair, eager look)
// ─────────────────────────────────────────
const PriyaFace = ({ blink }: { blink: boolean }) => (
  <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
    {/* Shirt */}
    <ellipse cx="50" cy="106" rx="38" ry="18" fill="#2E2A8A" />
    <path d="M 34 90 Q 50 102 66 90" fill="#4F46E5" />
    {/* Neck */}
    <rect x="42" y="76" width="16" height="18" rx="6" fill="#C27844" />
    {/* Head */}
    <ellipse cx="50" cy="52" rx="25" ry="30" fill="#C27844" />
    {/* Ears */}
    <ellipse cx="25" cy="54" rx="4.5" ry="7" fill="#C27844" />
    <ellipse cx="75" cy="54" rx="4.5" ry="7" fill="#C27844" />
    <ellipse cx="26" cy="54" rx="2.8" ry="4.5" fill="#A66030" />
    <ellipse cx="74" cy="54" rx="2.8" ry="4.5" fill="#A66030" />
    {/* Hair — long, parted middle, side panels */}
    <ellipse cx="50" cy="25" rx="27" ry="15" fill="#180A02" />
    <ellipse cx="50" cy="22" rx="23" ry="12" fill="#241008" />
    {/* Side hair panels — long */}
    <ellipse cx="23" cy="50" rx="5.5" ry="20" fill="#180A02" />
    <ellipse cx="77" cy="50" rx="5.5" ry="20" fill="#180A02" />
    {/* Hair highlight */}
    <path d="M 44 18 Q 50 16 56 18" stroke="#3A1A08" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Eyebrows — neat arch */}
    <path d="M 31 41 Q 38 38 44 40" stroke="#180A02" strokeWidth="2.0" strokeLinecap="round" fill="none" />
    <path d="M 56 40 Q 62 38 69 41" stroke="#180A02" strokeWidth="2.0" strokeLinecap="round" fill="none" />
    {/* Eye whites */}
    <ellipse cx="38" cy="50" rx="7" ry={blink ? 0.6 : 5.2} fill="white" />
    <ellipse cx="62" cy="50" rx="7" ry={blink ? 0.6 : 5.2} fill="white" />
    {/* Warm dark irises */}
    {!blink && <><circle cx="38" cy="51" r="3.4" fill="#3B1F08" /><circle cx="62" cy="51" r="3.4" fill="#3B1F08" /></>}
    {!blink && <><circle cx="38.8" cy="51" r="1.7" fill="#0D0808" /><circle cx="62.8" cy="51" r="1.7" fill="#0D0808" /></>}
    {!blink && <><circle cx="40" cy="49.5" r="0.9" fill="rgba(255,255,255,0.88)" /><circle cx="64" cy="49.5" r="0.9" fill="rgba(255,255,255,0.88)" /></>}
    {/* Nose */}
    <ellipse cx="50" cy="59" rx="2.2" ry="3.2" fill="#A66030" />
    {/* Mouth — slight determined smile */}
    <path d="M 41 67 Q 50 72 59 67" stroke="#9A5020" strokeWidth="2.0" strokeLinecap="round" fill="none" />
    <path d="M 42 67.5 Q 50 71 58 67.5" fill="rgba(180,70,30,0.3)" />
  </svg>
);

// ─────────────────────────────────────────
// ROHAN — CEO  (medium-dark warm brown skin, short greying hair, authority)
// ─────────────────────────────────────────
const RohanFace = ({ blink }: { blink: boolean }) => (
  <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
    {/* Shirt — business dark */}
    <ellipse cx="50" cy="106" rx="38" ry="18" fill="#1A1A2E" />
    <path d="M 34 90 Q 50 102 66 90" fill="#2D3270" />
    {/* Tie suggestion */}
    <path d="M 47 90 L 50 104 L 53 90" fill="#7C2D8A" />
    {/* Neck */}
    <rect x="42" y="76" width="16" height="18" rx="6" fill="#8B5A35" />
    {/* Head */}
    <ellipse cx="50" cy="52" rx="27" ry="30" fill="#8B5A35" />
    {/* Ears */}
    <ellipse cx="24" cy="53" rx="5" ry="8" fill="#8B5A35" />
    <ellipse cx="76" cy="53" rx="5" ry="8" fill="#8B5A35" />
    <ellipse cx="25" cy="53" rx="3" ry="5" fill="#7A4A25" />
    <ellipse cx="75" cy="53" rx="3" ry="5" fill="#7A4A25" />
    {/* Hair — short, greying at temples */}
    <ellipse cx="50" cy="24" rx="28" ry="15" fill="#2A2020" />
    <ellipse cx="50" cy="22" rx="24" ry="12" fill="#302828" />
    {/* Grey temples */}
    <ellipse cx="27" cy="34" rx="6" ry="9" fill="#7A7070" />
    <ellipse cx="73" cy="34" rx="6" ry="9" fill="#7A7070" />
    {/* Strong eyebrows */}
    <path d="M 30 40 Q 39 36 46 39" stroke="#2A1A0A" strokeWidth="2.8" strokeLinecap="round" fill="none" />
    <path d="M 54 39 Q 61 36 70 40" stroke="#2A1A0A" strokeWidth="2.8" strokeLinecap="round" fill="none" />
    {/* Eye whites */}
    <ellipse cx="38" cy="50" rx="7" ry={blink ? 0.6 : 5.0} fill="white" />
    <ellipse cx="62" cy="50" rx="7" ry={blink ? 0.6 : 5.0} fill="white" />
    {/* Dark irises */}
    {!blink && <><circle cx="38" cy="51" r="3.3" fill="#1A1008" /><circle cx="62" cy="51" r="3.3" fill="#1A1008" /></>}
    {!blink && <><circle cx="38.8" cy="51" r="1.7" fill="#0A0804" /><circle cx="62.8" cy="51" r="1.7" fill="#0A0804" /></>}
    {!blink && <><circle cx="40" cy="49.5" r="0.9" fill="rgba(255,255,255,0.82)" /><circle cx="64" cy="49.5" r="0.9" fill="rgba(255,255,255,0.82)" /></>}
    {/* Nose — broader */}
    <ellipse cx="50" cy="59" rx="3" ry="4" fill="#7A4A25" />
    <ellipse cx="45.5" cy="62" rx="2" ry="2.4" fill="#7A4A25" />
    <ellipse cx="54.5" cy="62" rx="2" ry="2.4" fill="#7A4A25" />
    {/* Subtle stubble */}
    <ellipse cx="50" cy="70" rx="16" ry="8" fill="rgba(42,30,20,0.15)" />
    {/* Mouth — confident */}
    <path d="M 41 68 Q 50 72 59 68" stroke="#7A4020" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M 42 68.5 Q 50 71.5 58 68.5" fill="rgba(150,60,20,0.25)" />
    {/* Laugh lines */}
    <path d="M 30 58 Q 29 64 32 68" stroke="rgba(100,60,30,0.2)" strokeWidth="1.5" fill="none" />
    <path d="M 70 58 Q 71 64 68 68" stroke="rgba(100,60,30,0.2)" strokeWidth="1.5" fill="none" />
  </svg>
);

// ─────────────────────────────────────────
// FACE SELECTOR
// ─────────────────────────────────────────
const FACE_MAP: Record<MentorId, React.FC<{ blink: boolean }>> = {
  asha:  AshaFace,
  dev:   DevFace,
  maya:  MayaFace,
  kiran: KiranFace,
  priya: PriyaFace,
  rohan: RohanFace,
};

// ─────────────────────────────────────────
// MAIN EXPORTED COMPONENT
// ─────────────────────────────────────────
export const MentorFace = ({ mentor, size = 72 }: { mentor: MentorId; size?: number }) => {
  const [blink, setBlink] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const schedule = () => {
      timerRef.current = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          schedule();
        }, 130);
      }, 2600 + Math.random() * 2800);
    };
    schedule();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const FaceComponent = FACE_MAP[mentor];
  const meta = MENTOR_META[mentor];

  return (
    <motion.div
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: size,
        height: size,
        borderRadius: '16px',
        overflow: 'hidden',
        flexShrink: 0,
        background: `${meta.accent}15`,
        border: `2px solid ${meta.accent}`,
        boxShadow: `0 0 20px ${meta.accent}40`,
      }}>
      <FaceComponent blink={blink} />
    </motion.div>
  );
};

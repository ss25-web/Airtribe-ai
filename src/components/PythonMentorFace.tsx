'use client';

import React, { useEffect, useRef, useState } from 'react';

// ─── Python-specific mentor avatar system ────────────────────────────────────
// Arjun  — curious beginner backend engineer (young, warm brown, short dark hair)
// Nisha  — calm first-principles mentor (South Asian female, neat hair, glasses)
// Kabir  — senior backend engineer / reliability mindset (stubble, focused)
// Meera  — data-shape and transformation thinker (analytical, thoughtful)

export type PythonCharId = 'arjun' | 'nisha' | 'kabir' | 'meera';

export const PYTHON_CHAR_META: Record<PythonCharId, { name: string; role: string; accent: string }> = {
  arjun: { name: 'Arjun', role: 'Aspiring Backend Engineer', accent: '#16A34A' },
  nisha: { name: 'Nisha', role: 'Backend Mentor',            accent: '#0369A1' },
  kabir: { name: 'Kabir', role: 'Senior Backend Engineer',   accent: '#7843EE' },
  meera: { name: 'Meera', role: 'Data-focused Teammate',     accent: '#C85A40' },
};

// ─── Arjun ────────────────────────────────────────────────────────────────────
// Young, curious, eager. Warm medium-brown skin, short slightly-tousled dark hair.
// Green shirt (Python). Open expression, slight smile.
const ArjunFace = ({ blink }: { blink: boolean }) => (
  <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
    {/* Shirt */}
    <ellipse cx="50" cy="106" rx="38" ry="18" fill="#145E30" />
    <path d="M 34 90 Q 50 102 66 90" fill="#16A34A" />
    {/* Neck */}
    <rect x="42" y="76" width="16" height="18" rx="6" fill="#C8865A" />
    {/* Head */}
    <ellipse cx="50" cy="52" rx="26" ry="29" fill="#D4956A" />
    {/* Ears */}
    <ellipse cx="24" cy="53" rx="5" ry="7" fill="#D4956A" />
    <ellipse cx="76" cy="53" rx="5" ry="7" fill="#D4956A" />
    <ellipse cx="25" cy="53" rx="3" ry="4.5" fill="#BB7850" />
    <ellipse cx="75" cy="53" rx="3" ry="4.5" fill="#BB7850" />
    {/* Hair — short, slightly messy */}
    <ellipse cx="50" cy="27" rx="26" ry="14" fill="#0F0F0F" />
    <ellipse cx="50" cy="22" rx="20" ry="10" fill="#1A1A1A" />
    {/* Slight hair tuft */}
    <ellipse cx="44" cy="22" rx="5" ry="4" fill="#0A0A0A" />
    <ellipse cx="55" cy="21" rx="4" ry="3.5" fill="#0A0A0A" />
    <ellipse cx="26" cy="38" rx="5" ry="10" fill="#0F0F0F" />
    <ellipse cx="74" cy="38" rx="5" ry="10" fill="#0F0F0F" />
    {/* Eyebrows — relaxed, slightly raised (curious look) */}
    <path d="M 31 41 Q 38 38 44 40" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M 56 40 Q 62 38 69 41" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Eyes */}
    <ellipse cx="38" cy="50" rx="7" ry={blink ? 0.7 : 5.5} fill="white" />
    <ellipse cx="62" cy="50" rx="7" ry={blink ? 0.7 : 5.5} fill="white" />
    {!blink && <><circle cx="38.5" cy="51" r="3.5" fill="#3A1E0A" /><circle cx="62.5" cy="51" r="3.5" fill="#3A1E0A" /></>}
    {!blink && <><circle cx="39.2" cy="51" r="1.8" fill="#080808" /><circle cx="63.2" cy="51" r="1.8" fill="#080808" /></>}
    {!blink && <><circle cx="40" cy="49.5" r="0.9" fill="rgba(255,255,255,0.85)" /><circle cx="64" cy="49.5" r="0.9" fill="rgba(255,255,255,0.85)" /></>}
    {/* Nose */}
    <ellipse cx="50" cy="60" rx="2.5" ry="3.5" fill="#BB7850" />
    {/* Mouth — slight smile */}
    <path d="M 40 68 Q 50 75 60 68" stroke="#9A5A38" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M 41 68.5 Q 50 73 59 68.5" fill="rgba(180,80,55,0.35)" />
  </svg>
);

// ─── Nisha ────────────────────────────────────────────────────────────────────
// Female, calm, composed. South Asian, neat dark bun/updo, round glasses.
// Deep blue shirt. Gentle closed-mouth smile.
const NishaFace = ({ blink }: { blink: boolean }) => (
  <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
    {/* Shirt */}
    <ellipse cx="50" cy="106" rx="38" ry="18" fill="#1E3A5F" />
    <path d="M 34 90 Q 50 102 66 90" fill="#0369A1" />
    {/* Neck */}
    <rect x="42" y="76" width="16" height="18" rx="6" fill="#B87040" />
    {/* Head */}
    <ellipse cx="50" cy="52" rx="25" ry="29" fill="#C07850" />
    {/* Ears */}
    <ellipse cx="25" cy="53" rx="5" ry="7" fill="#C07850" />
    <ellipse cx="75" cy="53" rx="5" ry="7" fill="#C07850" />
    <ellipse cx="26" cy="53" rx="3" ry="4.5" fill="#A85E30" />
    <ellipse cx="74" cy="53" rx="3" ry="4.5" fill="#A85E30" />
    {/* Small earrings */}
    <circle cx="25" cy="56" r="2" fill="#0369A1" opacity="0.8" />
    <circle cx="75" cy="56" r="2" fill="#0369A1" opacity="0.8" />
    {/* Hair — neat, pulled back bun */}
    <ellipse cx="50" cy="26" rx="25" ry="15" fill="#0D0505" />
    <ellipse cx="50" cy="15" rx="9" ry="8" fill="#0D0505" />
    <ellipse cx="50" cy="19" rx="6" ry="5" fill="#1A0A08" />
    <ellipse cx="27" cy="38" rx="4" ry="11" fill="#0D0505" />
    <ellipse cx="73" cy="38" rx="4" ry="11" fill="#0D0505" />
    {/* Eyebrows — calm arches */}
    <path d="M 31 42 Q 38 39 44 41" stroke="#0D0505" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M 56 41 Q 62 39 69 42" stroke="#0D0505" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    {/* Eyes */}
    <ellipse cx="38" cy="50" rx="7" ry={blink ? 0.7 : 5.5} fill="white" />
    <ellipse cx="62" cy="50" rx="7" ry={blink ? 0.7 : 5.5} fill="white" />
    {!blink && <><circle cx="38.5" cy="51" r="3.5" fill="#2A1005" /><circle cx="62.5" cy="51" r="3.5" fill="#2A1005" /></>}
    {!blink && <><circle cx="39.2" cy="51" r="1.8" fill="#060606" /><circle cx="63.2" cy="51" r="1.8" fill="#060606" /></>}
    {!blink && <><circle cx="40" cy="49.5" r="0.9" fill="rgba(255,255,255,0.85)" /><circle cx="64" cy="49.5" r="0.9" fill="rgba(255,255,255,0.85)" /></>}
    {/* Round glasses */}
    <circle cx="38" cy="50" r="8" fill="none" stroke="#1A2A40" strokeWidth="1.8" />
    <circle cx="62" cy="50" r="8" fill="none" stroke="#1A2A40" strokeWidth="1.8" />
    <line x1="46" y1="50" x2="54" y2="50" stroke="#1A2A40" strokeWidth="1.6" />
    <line x1="23" y1="49" x2="30" y2="50" stroke="#1A2A40" strokeWidth="1.4" />
    <line x1="70" y1="50" x2="77" y2="49" stroke="#1A2A40" strokeWidth="1.4" />
    {/* Nose */}
    <ellipse cx="50" cy="60" rx="2" ry="3" fill="#A05030" />
    {/* Mouth — calm, gentle */}
    <path d="M 41 68 Q 50 73 59 68" stroke="#904030" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M 42 68.2 Q 50 71.5 58 68.2" fill="rgba(170,70,50,0.3)" />
  </svg>
);

// ─── Kabir ────────────────────────────────────────────────────────────────────
// Male, senior, reliability mindset. Medium-dark brown skin, short neat hair,
// subtle stubble. Dark navy shirt. Focused/thoughtful expression.
const KabirFace = ({ blink }: { blink: boolean }) => (
  <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
    {/* Shirt */}
    <ellipse cx="50" cy="106" rx="38" ry="18" fill="#0F1B30" />
    <path d="M 34 90 Q 50 102 66 90" fill="#1E3A5F" />
    {/* Neck */}
    <rect x="42" y="76" width="16" height="18" rx="6" fill="#7A4525" />
    {/* Head */}
    <ellipse cx="50" cy="52" rx="27" ry="30" fill="#8B5535" />
    {/* Ears */}
    <ellipse cx="23" cy="54" rx="5" ry="7.5" fill="#8B5535" />
    <ellipse cx="77" cy="54" rx="5" ry="7.5" fill="#8B5535" />
    <ellipse cx="24" cy="54" rx="3" ry="5" fill="#7A4525" />
    <ellipse cx="76" cy="54" rx="3" ry="5" fill="#7A4525" />
    {/* Hair — short, neat */}
    <ellipse cx="50" cy="26" rx="27" ry="15" fill="#101010" />
    <ellipse cx="50" cy="22" rx="22" ry="11" fill="#181818" />
    <ellipse cx="26" cy="38" rx="5" ry="11" fill="#101010" />
    <ellipse cx="74" cy="38" rx="5" ry="11" fill="#101010" />
    {/* Stubble / beard shadow */}
    <ellipse cx="50" cy="72" rx="16" ry="8" fill="rgba(0,0,0,0.18)" />
    <ellipse cx="38" cy="68" rx="7" ry="5" fill="rgba(0,0,0,0.12)" />
    <ellipse cx="62" cy="68" rx="7" ry="5" fill="rgba(0,0,0,0.12)" />
    {/* Eyebrows — strong, slightly furrowed (focused) */}
    <path d="M 30 41 Q 37.5 37.5 44 40" stroke="#101010" strokeWidth="2.8" strokeLinecap="round" fill="none" />
    <path d="M 56 40 Q 62.5 37.5 70 41" stroke="#101010" strokeWidth="2.8" strokeLinecap="round" fill="none" />
    {/* Slight inner brow tension */}
    <path d="M 43 40 L 45 42" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M 57 42 L 57 40" stroke="#101010" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Eyes */}
    <ellipse cx="38" cy="51" rx="7" ry={blink ? 0.7 : 5} fill="white" />
    <ellipse cx="62" cy="51" rx="7" ry={blink ? 0.7 : 5} fill="white" />
    {!blink && <><circle cx="38.5" cy="52" r="3.2" fill="#1E0A04" /><circle cx="62.5" cy="52" r="3.2" fill="#1E0A04" /></>}
    {!blink && <><circle cx="39" cy="52" r="1.7" fill="#050505" /><circle cx="63" cy="52" r="1.7" fill="#050505" /></>}
    {!blink && <><circle cx="40" cy="50.5" r="0.9" fill="rgba(255,255,255,0.85)" /><circle cx="64" cy="50.5" r="0.9" fill="rgba(255,255,255,0.85)" /></>}
    {/* Nose */}
    <ellipse cx="50" cy="61" rx="3" ry="4" fill="#7A4525" />
    {/* Mouth — firm, straight, slight set expression */}
    <path d="M 40 70 Q 50 73 60 70" stroke="#6A3015" strokeWidth="2.2" strokeLinecap="round" fill="none" />
  </svg>
);

// ─── Meera ────────────────────────────────────────────────────────────────────
// Female, data-focused, analytical. Warm brown skin, long dark hair (loose sides),
// deep purple shirt. Thoughtful expression, slightly tilted.
const MeeraFace = ({ blink }: { blink: boolean }) => (
  <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
    {/* Shirt */}
    <ellipse cx="50" cy="106" rx="38" ry="18" fill="#2D1B69" />
    <path d="M 34 90 Q 50 102 66 90" fill="#4F46E5" />
    {/* Neck */}
    <rect x="42" y="76" width="16" height="18" rx="6" fill="#B87048" />
    {/* Head */}
    <ellipse cx="50" cy="52" rx="25" ry="29" fill="#C87A50" />
    {/* Ears */}
    <ellipse cx="25" cy="53" rx="5" ry="7" fill="#C87A50" />
    <ellipse cx="75" cy="53" rx="5" ry="7" fill="#C87A50" />
    <ellipse cx="26" cy="53" rx="3" ry="4.5" fill="#A85E35" />
    <ellipse cx="74" cy="53" rx="3" ry="4.5" fill="#A85E35" />
    {/* Hair — longer sides, slight waves, frames face */}
    <ellipse cx="50" cy="26" rx="25" ry="14" fill="#0C0505" />
    <ellipse cx="50" cy="21" rx="19" ry="10" fill="#180A08" />
    {/* Long side hair strands */}
    <ellipse cx="24" cy="50" rx="6" ry="16" fill="#0C0505" />
    <ellipse cx="76" cy="50" rx="6" ry="16" fill="#0C0505" />
    {/* Slight wave texture */}
    <path d="M 20 40 Q 23 50 20 60" stroke="#180A08" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M 80 40 Q 77 50 80 60" stroke="#180A08" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Eyebrows — thoughtful, slightly arched */}
    <path d="M 31 42 Q 38.5 39 44 41.5" stroke="#0C0505" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M 56 41.5 Q 62 38.5 69 42" stroke="#0C0505" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    {/* Eyes — slightly wider, observant */}
    <ellipse cx="38" cy="51" rx="7" ry={blink ? 0.7 : 6} fill="white" />
    <ellipse cx="62" cy="51" rx="7" ry={blink ? 0.7 : 6} fill="white" />
    {!blink && <><circle cx="38.5" cy="52" r="3.8" fill="#2A0808" /><circle cx="62.5" cy="52" r="3.8" fill="#2A0808" /></>}
    {!blink && <><circle cx="39.2" cy="52" r="1.9" fill="#080505" /><circle cx="63.2" cy="52" r="1.9" fill="#080505" /></>}
    {!blink && <><circle cx="40" cy="50.5" r="0.9" fill="rgba(255,255,255,0.85)" /><circle cx="64" cy="50.5" r="0.9" fill="rgba(255,255,255,0.85)" /></>}
    {/* Nose */}
    <ellipse cx="50" cy="61" rx="2.2" ry="3.2" fill="#A05030" />
    {/* Mouth — thoughtful, slight asymmetry */}
    <path d="M 40 69 Q 50 74.5 60 69" stroke="#904030" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M 41 69.5 Q 50 73 59 69.5" fill="rgba(175,75,50,0.3)" />
  </svg>
);

// ─── Animated wrapper ─────────────────────────────────────────────────────────

const FACES: Record<PythonCharId, React.FC<{ blink: boolean }>> = {
  arjun: ArjunFace,
  nisha: NishaFace,
  kabir: KabirFace,
  meera: MeeraFace,
};

interface PythonMentorFaceProps {
  char: PythonCharId;
  size?: number;
}

export function PythonMentorFace({ char, size = 48 }: PythonMentorFaceProps) {
  const [blink, setBlink] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 4000;
      timerRef.current = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 120);
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const FaceComponent = FACES[char];
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
      <FaceComponent blink={blink} />
    </div>
  );
}

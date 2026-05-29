'use client';

import { motion } from 'framer-motion';
import { AirtribeLogo, DarkModeToggle } from './AirtribeBrand';

export interface TrackChoiceOption<T extends string> {
  id: T;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  accentRgb: string;
  icon: string;
  details: string[];
}

interface Props<T extends string> {
  label: string;
  title: string;
  subtitle: string;
  options: TrackChoiceOption<T>[];
  onSelect: (id: T) => void;
  onBack: () => void;
}

// Leather palette per track — both brown books, slightly different leather shades
// so the two volumes still feel like sibling volumes of the same series.
const LEATHER: Record<number, {
  coverTop: string; coverBottom: string;
  spineTop: string; spineMid: string; spineBot: string;
  edgeDark: string;
  inkOnCover: string;
}> = {
  0: { // Foundations — warm tan leather
    coverTop: '#A87045', coverBottom: '#7C4A24',
    spineTop: '#7C4A24', spineMid: '#5C3517', spineBot: '#3F2410',
    edgeDark: '#3F2410',
    inkOnCover: '#F6E5C4',
  },
  1: { // Scale — deeper oxblood / aged leather
    coverTop: '#8E4F2E', coverBottom: '#5E2F18',
    spineTop: '#5E2F18', spineMid: '#3F1E0D', spineBot: '#2A1206',
    edgeDark: '#2A1206',
    inkOnCover: '#F4DEB2',
  },
};

function ChoiceCard<T extends string>({ option, index, onSelect }: {
  option: TrackChoiceOption<T>;
  index: number;
  onSelect: (id: T) => void;
}) {
  const skin = LEATHER[index % 2];
  // Tilt each book slightly toward the centre of the spread.
  const tiltY = index % 2 === 0 ? 14 : -14;
  const hoverY = index % 2 === 0 ? 6 : -6;

  // Page edge stripes — produces the layered-paper look.
  const pageStripe =
    'repeating-linear-gradient(' +
    '180deg, ' +
    '#F4E7CC 0px, #F4E7CC 1px, ' +
    '#E1CFA4 1px, #E1CFA4 1.5px, ' +
    '#D7C290 1.5px, #D7C290 2px' +
    ')';
  const pageStripeH =
    'repeating-linear-gradient(' +
    '90deg, ' +
    '#F4E7CC 0px, #F4E7CC 1px, ' +
    '#E1CFA4 1px, #E1CFA4 1.5px, ' +
    '#D7C290 1.5px, #D7C290 2px' +
    ')';

  const SPINE_W = 22;       // spine thickness (left side strip)
  const PAGE_DEPTH = 14;    // page stack thickness (top / right / bottom)

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 + index * 0.08 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onSelect(option.id)}
      style={{
        appearance: 'none',
        background: 'transparent',
        border: 'none',
        padding: '12px',
        cursor: 'pointer',
        textAlign: 'left' as const,
        perspective: '1400px',
        perspectiveOrigin: '50% 40%',
        width: '100%',
        maxWidth: 260,
        justifySelf: 'center',
      }}
    >
      <motion.div
        initial={{ rotateY: tiltY, rotateX: 3, y: 0 }}
        whileHover={{ rotateY: hoverY, rotateX: 1, y: -6 }}
        transition={{ duration: 0.5, ease: [0.2, 0.65, 0.3, 0.95] }}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '0.7',
          transformStyle: 'preserve-3d' as const,
        }}
      >
        {/* Ground shadow */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: '10%',
            right: '10%',
            bottom: '-18px',
            height: '24px',
            background:
              'radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.12) 55%, transparent 80%)',
            filter: 'blur(10px)',
            transform: 'translateZ(-1px)',
            pointerEvents: 'none',
          }}
        />

        {/* TOP edge — stacked page leaves seen from above */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: SPINE_W,
            right: 0,
            top: 0,
            height: PAGE_DEPTH,
            transform: `translateY(-${PAGE_DEPTH}px) rotateX(90deg)`,
            transformOrigin: 'bottom center',
            background: pageStripe,
            boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.18)',
            borderRadius: '2px 4px 0 0',
            pointerEvents: 'none',
          }}
        />

        {/* RIGHT edge — fanned page edges */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: PAGE_DEPTH,
            transform: `translateX(${PAGE_DEPTH}px) rotateY(90deg)`,
            transformOrigin: 'left center',
            background: pageStripeH,
            boxShadow: 'inset 1px 0 0 rgba(0,0,0,0.10)',
            borderRadius: '0 4px 4px 0',
            pointerEvents: 'none',
          }}
        />

        {/* BOTTOM edge — pages */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: SPINE_W,
            right: 0,
            bottom: 0,
            height: PAGE_DEPTH,
            transform: `translateY(${PAGE_DEPTH}px) rotateX(-90deg)`,
            transformOrigin: 'top center',
            background: pageStripe,
            boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.20)',
            borderRadius: '0 0 4px 2px',
            pointerEvents: 'none',
          }}
        />

        {/* SPINE — left side strip, leather + bands + vertical title */}
        <div
          style={{
            position: 'absolute',
            left: -SPINE_W,
            top: 0,
            bottom: 0,
            width: SPINE_W,
            transform: 'rotateY(-90deg)',
            transformOrigin: 'right center',
            background: `linear-gradient(180deg, ${skin.spineTop} 0%, ${skin.spineMid} 50%, ${skin.spineBot} 100%)`,
            borderRadius: '3px 0 0 3px',
            boxShadow:
              'inset -1px 0 0 rgba(0,0,0,0.4), inset 2px 0 0 rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 9,
              fontWeight: 700,
              color: skin.inkOnCover,
              writingMode: 'vertical-rl' as const,
              transform: 'rotate(180deg)',
              letterSpacing: '0.08em',
              textShadow: '0 1px 0 rgba(0,0,0,0.35)',
              whiteSpace: 'nowrap',
              opacity: 0.92,
            }}
          >
            AIRTRIBE · {option.title.toUpperCase()}
          </div>
          {/* Gilt bands */}
          <div style={{ position: 'absolute', top: '12%', left: 2, right: 2, height: 1.5, background: 'rgba(244,222,178,0.55)' }} />
          <div style={{ position: 'absolute', top: '20%', left: 2, right: 2, height: 0.5, background: 'rgba(244,222,178,0.35)' }} />
          <div style={{ position: 'absolute', bottom: '20%', left: 2, right: 2, height: 0.5, background: 'rgba(244,222,178,0.35)' }} />
          <div style={{ position: 'absolute', bottom: '12%', left: 2, right: 2, height: 1.5, background: 'rgba(244,222,178,0.55)' }} />
        </div>

        {/* FRONT COVER — leather, embossed border, gilt title */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '2px 6px 6px 2px',
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(255,220,170,0.18) 0%, transparent 55%),
              radial-gradient(ellipse at 70% 80%, rgba(0,0,0,0.22) 0%, transparent 60%),
              linear-gradient(160deg, ${skin.coverTop} 0%, ${skin.coverBottom} 100%)
            `,
            border: `1px solid ${skin.edgeDark}`,
            borderLeft: `2px solid ${skin.edgeDark}`,
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.18),
              inset 0 -2px 6px rgba(0,0,0,0.35),
              inset 3px 0 6px rgba(0,0,0,0.30),
              0 14px 26px rgba(60,30,10,0.35),
              0 6px 10px rgba(0,0,0,0.20)
            `,
            padding: '16px 14px 14px',
            display: 'flex',
            flexDirection: 'column' as const,
            color: skin.inkOnCover,
            transform: 'translateZ(0)',
          }}
        >
          {/* Embossed inner frame */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 8,
              borderRadius: 3,
              border: `1px solid rgba(244,222,178,0.32)`,
              boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.25)',
              pointerEvents: 'none',
            }}
          />
          {/* Decorative gilt corners */}
          {[{ t: 12, l: 12 }, { t: 12, r: 12 }, { b: 12, l: 12 }, { b: 12, r: 12 }].map((p, i) => (
            <div
              key={i}
              aria-hidden
              style={{
                position: 'absolute',
                top: p.t,
                left: p.l,
                right: p.r,
                bottom: p.b,
                width: 8,
                height: 8,
                border: `1px solid rgba(244,222,178,0.45)`,
                borderRight: (p.r !== undefined) ? '1px solid rgba(244,222,178,0.45)' : 'none',
                borderLeft: (p.l !== undefined) ? '1px solid rgba(244,222,178,0.45)' : 'none',
                borderTop: (p.t !== undefined) ? '1px solid rgba(244,222,178,0.45)' : 'none',
                borderBottom: (p.b !== undefined) ? '1px solid rgba(244,222,178,0.45)' : 'none',
                opacity: 0.7,
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Icon block — embossed circle */}
          <div
            style={{
              alignSelf: 'center',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, rgba(244,222,178,0.95), rgba(180,130,60,0.85))`,
              color: skin.edgeDark,
              fontSize: 14,
              fontWeight: 900,
              fontFamily: "'Lora', Georgia, serif",
              marginTop: 6,
              marginBottom: 10,
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.35), 0 1px 1px rgba(0,0,0,0.25)',
              letterSpacing: '0.02em',
            }}
          >
            {option.icon}
          </div>

          {/* Eyebrow */}
          <div
            style={{
              textAlign: 'center' as const,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 7.5,
              fontWeight: 800,
              color: skin.inkOnCover,
              opacity: 0.78,
              letterSpacing: '0.28em',
              textTransform: 'uppercase' as const,
              marginBottom: 6,
            }}
          >
            {option.eyebrow}
          </div>

          {/* Title — gilt-letterpress */}
          <h2
            style={{
              margin: 0,
              textAlign: 'center' as const,
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 16,
              lineHeight: 1.15,
              color: skin.inkOnCover,
              letterSpacing: '-0.01em',
              textShadow:
                '0 1px 0 rgba(0,0,0,0.30), 0 0 1px rgba(255,235,180,0.55)',
              marginBottom: 8,
            }}
          >
            {option.title}
          </h2>

          {/* Hairline */}
          <div
            aria-hidden
            style={{
              alignSelf: 'center',
              width: 30,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${skin.inkOnCover}, transparent)`,
              opacity: 0.55,
              marginBottom: 8,
            }}
          />

          {/* Description */}
          <p
            style={{
              margin: '0 4px 8px',
              textAlign: 'center' as const,
              color: skin.inkOnCover,
              opacity: 0.85,
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 10.5,
              lineHeight: 1.45,
              flex: 1,
            }}
          >
            {option.description}
          </p>

          {/* Tag chips — small gilt pills */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const, justifyContent: 'center', marginBottom: 4 }}>
            {option.details.map(detail => (
              <span
                key={detail}
                style={{
                  padding: '2px 6px',
                  borderRadius: 3,
                  border: `0.5px solid rgba(244,222,178,0.45)`,
                  background: 'rgba(0,0,0,0.18)',
                  color: skin.inkOnCover,
                  fontSize: 8.5,
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {detail}
              </span>
            ))}
          </div>

          {/* OPEN hint */}
          <div
            style={{
              textAlign: 'center' as const,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 8,
              fontWeight: 800,
              letterSpacing: '0.22em',
              color: skin.inkOnCover,
              opacity: 0.78,
              marginTop: 4,
            }}
          >
            ◆ OPEN ◆
          </div>
        </div>
      </motion.div>
    </motion.button>
  );
}

export default function TrackChoiceCards<T extends string>({
  label,
  title,
  subtitle,
  options,
  onSelect,
  onBack,
}: Props<T>) {
  return (
    <div className="editorial" style={{ minHeight: '100vh', background: 'var(--ed-cream)', color: 'var(--ed-ink)' }}>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'var(--ed-cream)',
        borderBottom: '1px solid var(--ed-rule)',
        padding: '14px 28px',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'var(--ed-card)',
              border: '1px solid var(--ed-rule)',
              borderRadius: 10,
              padding: '8px 13px',
              cursor: 'pointer',
              color: 'var(--ed-ink2)',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Back
          </button>
          <AirtribeLogo />
          <DarkModeToggle />
        </div>
      </header>

      <main style={{ maxWidth: 920, margin: '0 auto', padding: '56px 28px 100px' }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ textAlign: 'center', marginBottom: 50 }}
        >
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: 'var(--ed-ink3)',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}>
            {label}
          </div>
          <h1 style={{
            margin: '0 auto 16px',
            maxWidth: 760,
            fontFamily: "'Lora', Georgia, serif",
            fontSize: 'clamp(34px, 5vw, 58px)',
            lineHeight: 1,
            letterSpacing: '-0.035em',
            color: 'var(--ed-ink)',
          }}>
            {title}
          </h1>
          <p style={{ margin: '0 auto', maxWidth: 620, color: 'var(--ed-ink2)', fontSize: 16, lineHeight: 1.7 }}>
            {subtitle}
          </p>
        </motion.div>

        {/* Shelf */}
        <div style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 36,
          justifyItems: 'center',
          alignItems: 'end',
          padding: '24px 28px 8px',
          maxWidth: 760,
          margin: '0 auto',
        }}>
          {options.map((option, index) => (
            <ChoiceCard key={option.id} option={option} index={index} onSelect={onSelect} />
          ))}

          {/* Wooden shelf plank under the books */}
          <div
            aria-hidden
            style={{
              gridColumn: '1 / -1',
              height: 10,
              marginTop: 22,
              borderRadius: 3,
              background:
                'linear-gradient(180deg, #B58A5C 0%, #8E6534 45%, #6B4A23 100%)',
              boxShadow:
                '0 6px 16px rgba(60,30,10,0.35), inset 0 1px 0 rgba(255,230,190,0.45), inset 0 -1px 0 rgba(0,0,0,0.4)',
            }}
          />
          <div
            aria-hidden
            style={{
              gridColumn: '1 / -1',
              height: 4,
              marginTop: -2,
              borderRadius: 2,
              background: 'linear-gradient(180deg, #4A2E14 0%, #2A1808 100%)',
              opacity: 0.85,
              boxShadow: '0 8px 18px rgba(0,0,0,0.25)',
            }}
          />
        </div>
      </main>
    </div>
  );
}

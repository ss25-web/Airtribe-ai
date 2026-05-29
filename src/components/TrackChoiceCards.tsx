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

function ChoiceCard<T extends string>({ option, index, onSelect }: {
  option: TrackChoiceOption<T>;
  index: number;
  onSelect: (id: T) => void;
}) {
  // Open angles: each book tilts slightly toward the centre of the spread.
  const baseRotateY = index % 2 === 0 ? -16 : 16;
  const hoverRotateY = index % 2 === 0 ? -6 : 6;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(option.id)}
      style={{
        appearance: 'none',
        background: 'transparent',
        border: 'none',
        padding: '20px 20px 50px',
        cursor: 'pointer',
        textAlign: 'left' as const,
        perspective: '1800px',
        perspectiveOrigin: '50% 35%',
      }}
    >
      <motion.div
        initial={{ rotateY: baseRotateY, rotateX: 4, y: 0 }}
        whileHover={{ rotateY: hoverRotateY, rotateX: 1, y: -8 }}
        transition={{ duration: 0.5, ease: [0.2, 0.65, 0.3, 0.95] }}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '0.78',
          transformStyle: 'preserve-3d' as const,
        }}
      >
        {/* Ground shadow under the book */}
        <div
          style={{
            position: 'absolute',
            left: '8%',
            right: '8%',
            bottom: '-32px',
            height: '40px',
            background: `radial-gradient(ellipse at center, rgba(${option.accentRgb},0.28) 0%, rgba(${option.accentRgb},0.10) 50%, transparent 75%)`,
            filter: 'blur(14px)',
            transform: 'translateZ(-1px)',
            pointerEvents: 'none',
          }}
        />

        {/* TOP edge of the book — the leaves stack, viewed from above */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: 'translateZ(38px)',
            transformStyle: 'preserve-3d',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '14px',
              right: '4px',
              top: '-1px',
              height: '38px',
              transform: 'rotateX(90deg)',
              transformOrigin: 'top center',
              background:
                'repeating-linear-gradient(180deg, #FBF6E6 0px, #FBF6E6 2px, #E5D6A8 2.5px, #E5D6A8 3px)',
              borderRadius: '2px 4px 0 0',
              boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.05)',
            }}
          />
        </div>

        {/* RIGHT edge of the book — pages fanned slightly */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            bottom: '4px',
            right: '0',
            width: '38px',
            transform: 'rotateY(90deg)',
            transformOrigin: 'left center',
            background:
              'repeating-linear-gradient(90deg, #FBF6E6 0px, #FBF6E6 2px, #E5D6A8 2.5px, #E5D6A8 3px)',
            borderRadius: '0 4px 4px 0',
            boxShadow: 'inset 1px 0 0 rgba(0,0,0,0.05)',
            pointerEvents: 'none',
          }}
        />

        {/* BOTTOM edge of the book */}
        <div
          style={{
            position: 'absolute',
            left: '14px',
            right: '4px',
            bottom: '-1px',
            height: '38px',
            transform: 'translateZ(0) rotateX(-90deg)',
            transformOrigin: 'top center',
            background:
              'repeating-linear-gradient(180deg, #E5D6A8 0px, #E5D6A8 2px, #FBF6E6 2.5px, #FBF6E6 3px)',
            borderRadius: '0 0 4px 2px',
            pointerEvents: 'none',
          }}
        />

        {/* SPINE — the left side strip */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '38px',
            transform: 'rotateY(-90deg) translateZ(0)',
            transformOrigin: 'right center',
            background: `linear-gradient(180deg, ${option.accent} 0%, rgba(${option.accentRgb},0.7) 60%, rgba(${option.accentRgb},0.85) 100%)`,
            borderRadius: '4px 0 0 4px',
            boxShadow: 'inset -1px 0 0 rgba(0,0,0,0.18), inset 2px 0 0 rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          {/* Vertical title up the spine */}
          <div
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 13,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.94)',
              writingMode: 'vertical-rl' as const,
              transform: 'rotate(180deg)',
              letterSpacing: '0.04em',
              textShadow: '0 1px 1px rgba(0,0,0,0.18)',
              whiteSpace: 'nowrap',
            }}
          >
            {option.title}
          </div>
          {/* Spine bands */}
          <div style={{ position: 'absolute', top: '14%', left: 4, right: 4, height: '2px', background: 'rgba(255,255,255,0.25)' }} />
          <div style={{ position: 'absolute', bottom: '14%', left: 4, right: 4, height: '2px', background: 'rgba(255,255,255,0.25)' }} />
        </div>

        {/* FRONT COVER — the face the user reads */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '4px 14px 14px 4px',
            background: `
              linear-gradient(135deg, rgba(${option.accentRgb},0.18) 0%, rgba(${option.accentRgb},0.04) 60%, var(--ed-card) 100%),
              var(--ed-card)
            `,
            border: `1.5px solid rgba(${option.accentRgb},0.32)`,
            borderLeft: `4px solid ${option.accent}`,
            boxShadow: `
              0 1px 0 rgba(255,255,255,0.6) inset,
              -2px 0 0 rgba(0,0,0,0.12) inset,
              0 30px 60px rgba(${option.accentRgb},0.22),
              0 18px 30px rgba(0,0,0,0.12)
            `,
            padding: '28px 26px 26px',
            display: 'flex',
            flexDirection: 'column' as const,
            transform: 'translateZ(0)',
          }}
        >
          {/* Embossed corner ornament */}
          <div
            style={{
              position: 'absolute',
              right: 14,
              top: 14,
              width: 44,
              height: 44,
              borderRadius: 8,
              border: `1px solid rgba(${option.accentRgb},0.35)`,
              opacity: 0.5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 18,
              top: 18,
              width: 36,
              height: 36,
              borderRadius: 6,
              border: `0.5px solid rgba(${option.accentRgb},0.55)`,
              opacity: 0.6,
            }}
          />

          {/* Icon block */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 54,
              height: 54,
              borderRadius: 14,
              background: `linear-gradient(145deg, ${option.accent}, rgba(${option.accentRgb},0.78))`,
              fontSize: 26,
              marginBottom: 20,
              boxShadow: `
                0 8px 16px rgba(${option.accentRgb},0.32),
                inset 0 1px 0 rgba(255,255,255,0.35)
              `,
              color: '#FFFFFF',
            }}
          >
            {option.icon}
          </div>

          {/* Eyebrow */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9.5,
              fontWeight: 800,
              color: option.accent,
              letterSpacing: '0.22em',
              textTransform: 'uppercase' as const,
              marginBottom: 10,
            }}
          >
            {option.eyebrow}
          </div>

          {/* Title */}
          <h2
            style={{
              margin: 0,
              marginBottom: 14,
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 'clamp(22px, 2.6vw, 30px)',
              lineHeight: 1.08,
              color: 'var(--ed-ink)',
              letterSpacing: '-0.025em',
            }}
          >
            {option.title}
          </h2>

          {/* Hairline divider */}
          <div
            style={{
              width: 38,
              height: 2,
              borderRadius: 1,
              background: `linear-gradient(90deg, ${option.accent}, transparent)`,
              marginBottom: 14,
            }}
          />

          {/* Description */}
          <p
            style={{
              margin: '0 0 16px',
              color: 'var(--ed-ink2)',
              fontSize: 13.5,
              lineHeight: 1.65,
              flex: 1,
            }}
          >
            {option.description}
          </p>

          {/* Tag chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
            {option.details.map(detail => (
              <span
                key={detail}
                style={{
                  padding: '4px 9px',
                  borderRadius: 4,
                  border: `1px solid rgba(${option.accentRgb},0.28)`,
                  background: `rgba(${option.accentRgb},0.08)`,
                  color: option.accent,
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                }}
              >
                {detail}
              </span>
            ))}
          </div>

          {/* Open-this-book hint at footer */}
          <div
            style={{
              position: 'absolute',
              right: 22,
              bottom: 18,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9.5,
              fontWeight: 800,
              letterSpacing: '0.16em',
              color: option.accent,
              opacity: 0.85,
            }}
          >
            OPEN →
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

      <main style={{ maxWidth: 1160, margin: '0 auto', padding: '56px 28px 80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ textAlign: 'center', marginBottom: 42 }}
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

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 22,
        }}>
          {options.map((option, index) => (
            <ChoiceCard key={option.id} option={option} index={index} onSelect={onSelect} />
          ))}
        </div>
      </main>
    </div>
  );
}

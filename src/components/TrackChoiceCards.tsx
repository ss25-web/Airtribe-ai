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
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 24, rotateX: -4 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.45, delay: 0.08 + index * 0.08 }}
      whileHover={{
        y: -8,
        rotateX: 3,
        rotateY: index % 2 === 0 ? -3 : 3,
        boxShadow: `0 28px 80px rgba(${option.accentRgb},0.22)`,
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(option.id)}
      style={{
        appearance: 'none',
        border: `1.5px solid rgba(${option.accentRgb},0.28)`,
        background: 'var(--ed-card)',
        borderRadius: '28px',
        padding: 0,
        overflow: 'hidden',
        cursor: 'pointer',
        textAlign: 'left',
        boxShadow: '0 12px 36px rgba(0,0,0,0.08)',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        style={{
          minHeight: 190,
          padding: '26px 26px 22px',
          background: `linear-gradient(145deg, rgba(${option.accentRgb},0.24), rgba(${option.accentRgb},0.06))`,
          borderBottom: `1px solid rgba(${option.accentRgb},0.18)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -34,
            top: -34,
            width: 126,
            height: 126,
            borderRadius: 34,
            background: `rgba(${option.accentRgb},0.14)`,
            transform: 'rotate(18deg)',
          }}
        />
        <div style={{ position: 'relative' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 58,
            height: 58,
            borderRadius: 20,
            background: `rgba(${option.accentRgb},0.16)`,
            border: `1px solid rgba(${option.accentRgb},0.28)`,
            fontSize: 28,
            marginBottom: 22,
          }}>
            {option.icon}
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            fontWeight: 800,
            color: option.accent,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            {option.eyebrow}
          </div>
          <h2 style={{
            margin: 0,
            fontFamily: "'Lora', Georgia, serif",
            fontSize: 'clamp(24px, 3vw, 34px)',
            lineHeight: 1.05,
            color: 'var(--ed-ink)',
            letterSpacing: '-0.02em',
          }}>
            {option.title}
          </h2>
        </div>
      </div>
      <div style={{ padding: '22px 26px 26px' }}>
        <p style={{ margin: '0 0 18px', color: 'var(--ed-ink2)', fontSize: 14, lineHeight: 1.7 }}>
          {option.description}
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {option.details.map(detail => (
            <span
              key={detail}
              style={{
                padding: '5px 10px',
                borderRadius: 999,
                border: '1px solid var(--ed-rule)',
                background: 'var(--ed-cream)',
                color: 'var(--ed-ink3)',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {detail}
            </span>
          ))}
        </div>
      </div>
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

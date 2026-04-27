'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import type { SWETrack, SWELevel } from './sweTypes';
import { BASICS_STORY } from './sweBasicsStoryData';
import SWEPreReadLayout from './SWEPreReadLayout';
import {
  ProtagonistAvatar,
  QuickTry,
  SituationCard,
  SWEAvatar,
  SWEConversationScene,
} from './sweDesignSystem';
import {
  chLabel,
  ChapterSection,
  h2,
  keyBox,
  NextChapterTeaser,
} from './pm-fundamentals/designSystem';

interface Props {
  track: SWETrack;
  level: SWELevel;
  onBack: () => void;
}

const MODULE_ID = 'swe-pr-00';

const TRACK_CONFIG = {
  python: {
    name: 'Python',
    accent: '#16A34A',
    accentRgb: '22,163,74',
    protagonist: 'Aisha',
    role: 'Backend Learner',
    company: 'Blue Basket',
    mentor: 'Riya',
    mentorRole: 'Backend Mentor',
    mentorColor: '#2563EB',
  },
  java: {
    name: 'Java',
    accent: '#0369A1',
    accentRgb: '3,105,161',
    protagonist: 'Vikram',
    role: 'Junior Backend Engineer',
    company: 'Finova Systems',
    mentor: 'Kavya',
    mentorRole: 'Senior Backend Engineer',
    mentorColor: '#7C3AED',
  },
  nodejs: {
    name: 'Node.js',
    accent: '#CA8A04',
    accentRgb: '202,138,4',
    protagonist: 'Leo',
    role: 'Junior Full-Stack Developer',
    company: 'Launchly',
    mentor: 'Mei',
    mentorRole: 'Senior Full-Stack Engineer',
    mentorColor: '#DC2626',
  },
} as const;

const PYTHON_SECTIONS = [
  { id: 'identity', label: 'Execution Pipeline', icon: '01' },
  { id: 'types', label: 'Variable Binding', icon: '02' },
  { id: 'flow', label: 'Branching & Truthiness', icon: '03' },
  { id: 'loops', label: 'Loop Progression', icon: '04' },
  { id: 'functions', label: 'Functions & Scope', icon: '05' },
  { id: 'dataStructures', label: 'Data Structures', icon: '06' },
  { id: 'challenge', label: 'Final Lens', icon: '07' },
];

const LEGACY_SECTIONS = [
  { id: 'identity', label: 'Language Identity' },
  { id: 'types', label: 'Variables & Types' },
  { id: 'flow', label: 'Control Flow' },
  { id: 'loops', label: 'Loops & Iteration' },
  { id: 'functions', label: 'Functions & Scope' },
  { id: 'objects', label: 'Objects & Data' },
  { id: 'dataStructures', label: 'Data Structures' },
  { id: 'challenge', label: 'Final Challenge' },
];

const PYTHON_CONCEPT_IDS = [
  'python-execution-pipeline',
  'python-variable-binding',
  'python-truthiness',
  'python-loops',
  'python-function-scope',
  'python-data-structures',
  'python-lens-synthesis',
];

function StudioChrome({
  title,
  subtitle,
  accent,
  actions,
  children,
}: {
  title: string;
  subtitle: string;
  accent: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        margin: '28px 0 20px',
        borderRadius: '24px',
        background: 'linear-gradient(180deg, #fcfdff 0%, #f3f7ff 100%)',
        border: '1px solid rgba(148, 163, 184, 0.24)',
        boxShadow: '0 24px 60px rgba(37, 99, 235, 0.08)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '28px 28px 18px',
          borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '16px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 900,
              lineHeight: 1.05,
              color: '#0f172a',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: '6px',
              fontSize: '17px',
              color: '#475569',
              lineHeight: 1.55,
            }}
          >
            {subtitle}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              borderRadius: '16px',
              background: '#ffffff',
              border: '1px solid rgba(148, 163, 184, 0.24)',
              padding: '8px 14px',
              color: '#334155',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '999px',
                background: accent,
                boxShadow: `0 0 0 4px ${accent}22`,
              }}
            />
            3D Mode
          </div>
          {actions}
        </div>
      </div>
      <div style={{ padding: '22px 22px 24px' }}>{children}</div>
    </div>
  );
}

function MetricPill({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div
      style={{
        borderRadius: '14px',
        padding: '12px 14px',
        background: '#ffffff',
        border: `1px solid ${tone}33`,
        minWidth: '120px',
      }}
    >
      <div
        style={{
          fontSize: '10px',
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#64748b',
          marginBottom: '4px',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: '20px', fontWeight: 900, color: tone }}>{value}</div>
    </div>
  );
}

function MachineCard({
  title,
  tone,
  caption,
  active,
  children,
}: {
  title: string;
  tone: string;
  caption: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={{
        y: active ? -4 : 0,
        boxShadow: active
          ? `0 24px 50px ${tone}30`
          : '0 14px 28px rgba(15, 23, 42, 0.08)',
      }}
      transition={{ duration: 0.25 }}
      style={{
        borderRadius: '22px',
        background: '#ffffff',
        border: `1px solid ${tone}33`,
        overflow: 'hidden',
        minHeight: '320px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '14px 16px',
          background: `linear-gradient(180deg, ${tone}16 0%, #ffffff 100%)`,
          borderBottom: `1px solid ${tone}22`,
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 800, color: tone }}>{title}</div>
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{caption}</div>
      </div>
      <div style={{ padding: '16px', flex: 1 }}>{children}</div>
    </motion.div>
  );
}

function PythonExecutionPipelineStudio() {
  const stages = [
    {
      key: 'source',
      label: 'Source Code',
      color: '#2563EB',
      note: 'You write Python code',
    },
    {
      key: 'compile',
      label: 'Compilation / Translation',
      color: '#22C55E',
      note: 'Code is parsed and compiled',
    },
    {
      key: 'bytecode',
      label: 'Bytecode',
      color: '#7C3AED',
      note: 'Platform-independent instructions are produced',
    },
    {
      key: 'pvm',
      label: 'Python Virtual Machine',
      color: '#F97316',
      note: 'The runtime executes the bytecode',
    },
    {
      key: 'output',
      label: 'Output',
      color: '#06B6D4',
      note: 'Results are displayed',
    },
  ];

  const examples = [
    'print("Order system started")',
    'total = 499 + 120',
    'is_paid = True',
  ];

  const [exampleIndex, setExampleIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <StudioChrome
      title="Python Execution Pipeline"
      subtitle="From your code to program output. See the runtime chain instead of treating execution like magic."
      accent="#2563EB"
      actions={
        <>
          <button
            onClick={() => {
              setActiveStep(0);
              setExampleIndex((current) => (current + 1) % examples.length);
            }}
            style={studioButtonStyle}
          >
            Replay
          </button>
          <button
            onClick={() => setActiveStep((current) => (current + 1) % stages.length)}
            style={{ ...studioButtonStyle, background: '#2563EB', color: '#ffffff' }}
          >
            Step Through
          </button>
        </>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {stages.map((stage, index) => (
          <div
            key={stage.key}
            style={{
              borderRadius: '18px',
              background: '#ffffff',
              border: `1px solid ${stage.color}${index <= activeStep ? '55' : '22'}`,
              padding: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '10px',
                  background: stage.color,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                {index + 1}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{stage.label}</div>
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.5, color: '#64748b' }}>{stage.note}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.85fr 0.8fr 0.95fr 0.9fr', gap: '14px', alignItems: 'stretch' }}>
        <MachineCard title="main.py" caption="Editor" tone="#2563EB" active={activeStep === 0}>
          <div style={terminalLikeCard('#F8FBFF', '#CBD5E1', '#0f172a')}>
            <div style={{ display: 'grid', gridTemplateColumns: '26px 1fr', gap: '10px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>
              <div style={{ color: '#94a3b8' }}>1</div>
              <div style={{ color: '#0f172a' }}>
                <span style={{ color: '#2563EB' }}>print</span>
                <span style={{ color: '#334155' }}>(</span>
                <span style={{ color: '#DC2626' }}>"{examples[exampleIndex].replace(/^print\("/, '').replace(/"\)$/, '')}"</span>
                <span style={{ color: '#334155' }}>)</span>
              </div>
              <div style={{ color: '#94a3b8' }}>2</div>
              <div style={{ color: '#cbd5e1' }}> </div>
              <div style={{ color: '#94a3b8' }}>3</div>
              <div style={{ color: '#cbd5e1' }}> </div>
            </div>
          </div>
        </MachineCard>

        <MachineCard title="Compiler" caption="Compilation Chamber" tone="#22C55E" active={activeStep === 1}>
          <div style={{ display: 'grid', gap: '10px' }}>
            {['Lexical Analysis', 'Parsing', 'AST Generation', 'Optimization'].map((item, index) => (
              <motion.div
                key={item}
                animate={{ opacity: activeStep >= 1 ? 1 : 0.55, x: activeStep === 1 ? [0, 3, 0] : 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                style={{
                  borderRadius: '14px',
                  background: '#ECFDF5',
                  border: '1px solid #86EFAC',
                  padding: '12px 14px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#166534',
                }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </MachineCard>

        <MachineCard title="bytecode.pyc" caption="Bytecode Object" tone="#7C3AED" active={activeStep === 2}>
          <div style={terminalLikeCard('#FBF8FF', '#E9D5FF', '#3b0764')}>
            {[
              '0  LOAD_NAME      0 (print)',
              '2  LOAD_CONST     0 ("Order system started")',
              '4  CALL_FUNCTION  1',
              '6  POP_TOP',
              '8  LOAD_CONST     1 (None)',
              '10 RETURN_VALUE',
            ].map((line) => (
              <div key={line} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#4c1d95', lineHeight: 1.9 }}>
                {line}
              </div>
            ))}
          </div>
        </MachineCard>

        <MachineCard title="Python Virtual Machine" caption="PVM Engine" tone="#F97316" active={activeStep === 3}>
          <div style={{ display: 'grid', gap: '10px' }}>
            {['Frame', 'Evaluation Loop', 'Stack', 'Built-in Functions'].map((item) => (
              <motion.div
                key={item}
                animate={{ scale: activeStep === 3 ? [1, 1.02, 1] : 1 }}
                transition={{ duration: 0.4 }}
                style={{
                  borderRadius: '14px',
                  background: '#FFF7ED',
                  border: '1px solid #FDBA74',
                  padding: '12px 14px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#9A3412',
                }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </MachineCard>

        <MachineCard title="Terminal" caption="Program Output" tone="#06B6D4" active={activeStep === 4}>
          <div style={terminalLikeCard('#0F172A', '#1E293B', '#E2E8F0')}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#4ADE80', lineHeight: 1.9 }}>$ python main.py</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#E2E8F0', lineHeight: 1.9 }}>
              {exampleIndex === 1 ? '619' : exampleIndex === 2 ? 'True' : 'Order system started'}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#4ADE80', lineHeight: 1.9 }}>$</div>
          </div>
        </MachineCard>
      </div>

      <div
        style={{
          marginTop: '18px',
          display: 'grid',
          gridTemplateColumns: '1.45fr 0.8fr',
          gap: '16px',
        }}
      >
        <div
          style={{
            borderRadius: '18px',
            background: '#ffffff',
            border: '1px solid rgba(148, 163, 184, 0.24)',
            padding: '16px 18px',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '10px' }}>
            How it works
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '10px' }}>
            {[
              'You write code in Python.',
              'Python checks syntax and builds a structured representation.',
              'Bytecode is generated as a low-level instruction set.',
              'The PVM executes those instructions step by step.',
              'The result appears as program behavior or output.',
            ].map((text, index) => (
              <div key={text} style={{ fontSize: '12px', lineHeight: 1.55, color: '#475569' }}>
                <div style={{ fontWeight: 800, color: stages[index].color, marginBottom: '6px' }}>{index + 1}</div>
                {text}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            borderRadius: '18px',
            background: '#ffffff',
            border: '1px solid rgba(148, 163, 184, 0.24)',
            padding: '16px 18px',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '10px' }}>
            Key insight
          </div>
          <div style={{ fontSize: '14px', lineHeight: 1.7, color: '#334155' }}>
            Python is compiled to bytecode, not directly to machine code. That is why the runtime matters. Your source code moves through a pipeline before the computer behaves.
          </div>
        </div>
      </div>
    </StudioChrome>
  );
}

function VariableBindingStudio() {
  const variables = [
    { name: 'customer_name', type: 'string', value: '"Rohan"', color: '#3B82F6' },
    { name: 'order_total', type: 'integer', value: '499', color: '#F97316' },
    { name: 'is_paid', type: 'boolean', value: 'False', color: '#22C55E' },
    { name: 'discount_rate', type: 'float', value: '0.10', color: '#8B5CF6' },
  ];

  const typeInfo = {
    string: {
      label: 'string',
      operations: [
        { label: 'Concatenate (+)', example: '"Rohan" + " Kumar" = "Rohan Kumar"' },
        { label: 'Slice / access', example: '"Rohan"[0] = "R"' },
      ],
    },
    integer: {
      label: 'integer',
      operations: [
        { label: 'Add (+)', example: '499 + 250 = 749' },
        { label: 'Compare (> or <)', example: '499 > 250 = True' },
      ],
    },
    boolean: {
      label: 'boolean',
      operations: [
        { label: 'Drive conditions', example: 'if is_paid: ...' },
        { label: 'Combine logic', example: 'is_paid and has_stock' },
      ],
    },
    float: {
      label: 'float',
      operations: [
        { label: 'Precise numeric math', example: '499 * 0.10 = 49.9' },
        { label: 'Use in formulas', example: 'discount = total * rate' },
      ],
    },
  } as const;

  const [selectedType, setSelectedType] = useState<keyof typeof typeInfo>('string');
  const [activeVariable, setActiveVariable] = useState('customer_name');

  return (
    <StudioChrome
      title="Variable Binding and Type Studio"
      subtitle="Names bind to values. Values have types. Types shape what operations actually make sense."
      accent="#7C3AED"
      actions={
        <>
          <button onClick={() => setSelectedType('string')} style={studioButtonStyle}>
            3D Mode
          </button>
          <button onClick={() => setSelectedType('integer')} style={studioButtonStyle}>
            Flow Mode
          </button>
        </>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.7fr 1fr', gap: '18px' }}>
        <div style={panelStyle}>
          <div style={panelTitleStyle}>1. Name Binding</div>
          <div style={panelSubtitleStyle}>Variables are names in your program.</div>
          <div style={{ display: 'grid', gap: '12px', marginTop: '18px' }}>
            {variables.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setSelectedType(item.type as keyof typeof typeInfo);
                  setActiveVariable(item.name);
                }}
                style={{
                  textAlign: 'left',
                  borderRadius: '18px',
                  border: `1px solid ${item.color}33`,
                  background: activeVariable === item.name ? `${item.color}12` : '#ffffff',
                  padding: '16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      background: item.color,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 900,
                    }}
                  >
                    {item.type === 'string' ? 'abc' : item.type === 'integer' ? '123' : item.type === 'boolean' ? 'T/F' : '1.23'}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{item.type}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={panelStyle}>
          <div style={panelTitleStyle}>2. Value Space</div>
          <div style={panelSubtitleStyle}>Typed values live here. Active bindings glow because names point to objects.</div>
          <div style={{ display: 'grid', gap: '16px', marginTop: '18px' }}>
            {variables.map((item) => (
              <motion.div
                key={item.name}
                animate={{ scale: activeVariable === item.name ? 1.02 : 1, y: activeVariable === item.name ? -2 : 0 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 24px 1fr',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{ height: '2px', background: activeVariable === item.name ? item.color : `${item.color}55`, borderRadius: '999px' }} />
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '999px',
                    background: '#ffffff',
                    border: `3px solid ${item.color}`,
                    boxShadow: `0 0 0 6px ${item.color}15`,
                  }}
                />
                <div
                  style={{
                    borderRadius: '22px',
                    background: `linear-gradient(180deg, ${item.color}E6 0%, ${item.color}CC 100%)`,
                    color: '#ffffff',
                    padding: '18px 20px',
                    boxShadow: `0 18px 36px ${item.color}26`,
                  }}
                >
                  <div style={{ fontSize: '34px', fontWeight: 900, lineHeight: 1.05 }}>{item.value}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, opacity: 0.9, marginTop: '6px' }}>{item.type}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <div
            style={{
              marginTop: '16px',
              borderRadius: '16px',
              background: '#ffffff',
              border: '1px dashed #C4B5FD',
              padding: '14px 16px',
              fontSize: '13px',
              color: '#6D28D9',
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            Active bindings: 4 / 4
          </div>
        </div>

        <div style={panelStyle}>
          <div style={panelTitleStyle}>3. Types & Operations</div>
          <div style={panelSubtitleStyle}>Types enable some operations and block others.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px', marginTop: '18px' }}>
            {(Object.keys(typeInfo) as Array<keyof typeof typeInfo>).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{
                  borderRadius: '14px',
                  border: selectedType === type ? `2px solid ${variables.find((item) => item.type === type)?.color}` : '1px solid #CBD5E1',
                  background: '#ffffff',
                  padding: '12px 10px',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#0f172a',
                  cursor: 'pointer',
                }}
              >
                {typeInfo[type].label}
              </button>
            ))}
          </div>
          <div style={{ marginTop: '18px', display: 'grid', gap: '12px' }}>
            {typeInfo[selectedType].operations.map((operation) => (
              <div
                key={operation.label}
                style={{
                  borderRadius: '16px',
                  background: '#ffffff',
                  border: '1px solid rgba(148, 163, 184, 0.24)',
                  padding: '14px',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>{operation.label}</div>
                <div style={{ fontSize: '12px', lineHeight: 1.6, color: '#64748b' }}>{operation.example}</div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: '16px',
              borderRadius: '16px',
              background: '#F8FAFC',
              border: '1px dashed #CBD5E1',
              padding: '14px',
              fontSize: '13px',
              lineHeight: 1.6,
              color: '#475569',
            }}
          >
            <strong style={{ color: '#0f172a' }}>Binding insight:</strong> {activeVariable} is currently bound to the {selectedType} value{' '}
            {variables.find((item) => item.name === activeVariable)?.value}. Type is what keeps your thinking clean.
          </div>
        </div>
      </div>
    </StudioChrome>
  );
}

function BranchingTruthinessStudio() {
  const [inputs, setInputs] = useState({
    isPaid: true,
    orderTotal: 1500,
    itemsEmpty: true,
    promoCode: true,
  });
  const [traceIndex, setTraceIndex] = useState(0);

  const conditions = [
    {
      label: 'is_paid',
      detail: inputs.isPaid ? 'is True' : 'is False',
      hit: inputs.isPaid,
      color: '#22C55E',
      branch: 'Path A',
    },
    {
      label: 'order_total > 1000',
      detail: `${inputs.orderTotal} > 1000`,
      hit: !inputs.isPaid && inputs.orderTotal > 1000,
      color: '#3B82F6',
      branch: 'Path B',
    },
    {
      label: 'items',
      detail: inputs.itemsEmpty ? '(empty list)' : '(non-empty list)',
      hit: !inputs.isPaid && !(inputs.orderTotal > 1000) && !inputs.itemsEmpty,
      color: '#8B5CF6',
      branch: 'Path C',
    },
    {
      label: 'promo_code',
      detail: inputs.promoCode ? '(non-empty string)' : '(empty string)',
      hit: !inputs.isPaid && !(inputs.orderTotal > 1000) && inputs.itemsEmpty && inputs.promoCode,
      color: '#F97316',
      branch: 'Path D',
    },
  ];

  const firstTrue = conditions.findIndex((item) => item.hit);
  const activePath = firstTrue === -1 ? 'else' : conditions[firstTrue].branch;

  return (
    <StudioChrome
      title="Branching and Truthiness Engine"
      subtitle="Visualize how values move through conditions and branches. In Python, the first true path wins."
      accent="#7C3AED"
      actions={
        <>
          <button onClick={() => setTraceIndex(0)} style={studioButtonStyle}>
            Reset
          </button>
          <button onClick={() => setTraceIndex((current) => Math.min(current + 1, 4))} style={{ ...studioButtonStyle, background: '#7C3AED', color: '#ffffff' }}>
            Step
          </button>
        </>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '0.72fr 1.35fr 0.8fr', gap: '18px' }}>
        <div style={panelStyle}>
          <div style={panelTitleStyle}>1. Inputs</div>
          <div style={panelSubtitleStyle}>Values entering the decision gate.</div>
          <div style={{ display: 'grid', gap: '12px', marginTop: '18px' }}>
            {[
              { key: 'isPaid', label: 'is_paid', color: '#22C55E', type: 'toggle' as const },
              { key: 'orderTotal', label: 'order_total', color: '#3B82F6', type: 'number' as const },
              { key: 'itemsEmpty', label: 'items', color: '#8B5CF6', type: 'toggle' as const },
              { key: 'promoCode', label: 'promo_code', color: '#F97316', type: 'toggle' as const },
            ].map((field) => (
              <div
                key={field.key}
                style={{
                  borderRadius: '16px',
                  background: '#ffffff',
                  border: `1px solid ${field.color}33`,
                  padding: '14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{field.label}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      {field.key === 'itemsEmpty'
                        ? inputs.itemsEmpty
                          ? '[]'
                          : '[1, 2]'
                        : field.key === 'promoCode'
                          ? inputs.promoCode
                            ? '"SALE"'
                            : '""'
                          : field.key === 'orderTotal'
                            ? inputs.orderTotal
                            : inputs.isPaid
                              ? 'True'
                              : 'False'}
                    </div>
                  </div>
                  {field.type === 'number' ? (
                    <button
                      onClick={() =>
                        setInputs((current) => ({
                          ...current,
                          orderTotal: current.orderTotal > 1000 ? 499 : 1500,
                        }))
                      }
                      style={{ ...studioButtonStyle, padding: '8px 12px' }}
                    >
                      Toggle
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setInputs((current) => ({
                          ...current,
                          [field.key]: !current[field.key as keyof typeof current],
                        }))
                      }
                      style={{
                        width: '56px',
                        height: '32px',
                        borderRadius: '999px',
                        border: 'none',
                        background:
                          field.key === 'isPaid'
                            ? inputs.isPaid
                              ? '#22C55E'
                              : '#CBD5E1'
                            : field.key === 'itemsEmpty'
                              ? inputs.itemsEmpty
                                ? '#8B5CF6'
                                : '#CBD5E1'
                              : inputs.promoCode
                                ? '#F97316'
                                : '#CBD5E1',
                        padding: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '999px',
                          background: '#ffffff',
                          transform:
                            field.key === 'isPaid'
                              ? `translateX(${inputs.isPaid ? '24px' : '0'})`
                              : field.key === 'itemsEmpty'
                                ? `translateX(${inputs.itemsEmpty ? '24px' : '0'})`
                                : `translateX(${inputs.promoCode ? '24px' : '0'})`,
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={panelStyle}>
          <div style={panelTitleStyle}>2. Decision Gate</div>
          <div style={panelSubtitleStyle}>Conditions are evaluated from top to bottom.</div>
          <div
            style={{
              marginTop: '18px',
              borderRadius: '26px',
              background: 'linear-gradient(180deg, #1E293B 0%, #111827 100%)',
              padding: '20px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ display: 'grid', gap: '12px' }}>
              {conditions.map((condition, index) => {
                const isVisible = traceIndex >= index;
                const isActive = activePath === condition.branch;
                return (
                  <motion.div
                    key={condition.label}
                    animate={{ opacity: isVisible ? 1 : 0.45, x: isActive ? 6 : 0 }}
                    style={{
                      borderRadius: '18px',
                      background: isActive ? `${condition.color}22` : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${isActive ? `${condition.color}99` : 'rgba(255,255,255,0.12)'}`,
                      padding: '14px 16px',
                      display: 'grid',
                      gridTemplateColumns: '40px 1fr auto',
                      gap: '12px',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '14px',
                        background: condition.color,
                        color: '#ffffff',
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>{condition.label}</div>
                      <div style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '2px' }}>{condition.detail}</div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: isActive ? '#ffffff' : '#94A3B8' }}>
                      {isActive ? 'ACTIVE' : 'CHECK'}
                    </div>
                  </motion.div>
                );
              })}
              <div
                style={{
                  borderRadius: '18px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  padding: '14px 16px',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#F8FAFC',
                }}
              >
                else: default fallback path
              </div>
            </div>
          </div>
        </div>

        <div style={panelStyle}>
          <div style={panelTitleStyle}>3. Execution Trace</div>
          <div style={panelSubtitleStyle}>Watch which branch actually wins.</div>
          <div style={{ display: 'grid', gap: '10px', marginTop: '18px' }}>
            {conditions.map((condition, index) => {
              const skipped = firstTrue !== -1 && index > firstTrue;
              const active = activePath === condition.branch;
              return (
                <div
                  key={condition.label}
                  style={{
                    borderRadius: '14px',
                    background: active ? '#ECFDF5' : '#ffffff',
                    border: `1px solid ${active ? '#86EFAC' : '#E2E8F0'}`,
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                    {index + 1}. {condition.label}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    {active ? `${condition.branch} selected` : skipped ? 'Skipped after earlier true branch' : 'Checked but not taken'}
                  </div>
                </div>
              );
            })}
            <div
              style={{
                borderRadius: '16px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                padding: '14px',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>
                Current state
              </div>
              <div style={{ marginTop: '8px', fontSize: '22px', fontWeight: 900, color: '#16A34A' }}>
                {activePath === 'else' ? 'Fallback' : activePath}
              </div>
              <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, marginTop: '8px' }}>
                Python checks conditions in order. The first truthy condition wins, then execution enters that branch.
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudioChrome>
  );
}

function LoopTimelineStudio() {
  const orders = [
    { id: '#1001', amount: '$120.50', icon: 'Cup' },
    { id: '#1002', amount: '$89.00', icon: 'Headset' },
    { id: '#1003', amount: '$215.75', icon: 'Bag' },
    { id: '#1004', amount: '$42.30', icon: 'Bottle' },
    { id: '#1005', amount: '$310.00', icon: 'Shoes' },
    { id: '#1006', amount: '$75.20', icon: 'Notebook' },
  ];
  const [mode, setMode] = useState<'for' | 'while'>('for');
  const [index, setIndex] = useState(2);

  const safeIndex = Math.max(0, Math.min(index, orders.length - 1));
  const currentOrder = orders[safeIndex];
  const whileCount = mode === 'while' ? safeIndex + 1 : safeIndex;

  return (
    <StudioChrome
      title="Loop Timeline Simulator"
      subtitle="Visualize repetition, index movement, condition rechecks, and why loops are about controlled progression over time."
      accent="#8B5CF6"
      actions={
        <>
          <button onClick={() => setIndex(0)} style={studioButtonStyle}>
            Reset All
          </button>
          <button onClick={() => setMode((current) => (current === 'for' ? 'while' : 'for'))} style={studioButtonStyle}>
            {mode === 'for' ? 'While Mode' : 'For Mode'}
          </button>
        </>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
            <div>
              <div style={panelTitleStyle}>For Loop Mode</div>
              <div style={panelSubtitleStyle}>Iterating through orders one item at a time.</div>
            </div>
            <MetricPill label="Iteration" value={`${safeIndex + 1} / ${orders.length}`} tone="#8B5CF6" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '10px', marginTop: '18px' }}>
            {orders.map((order, orderIndex) => {
              const active = orderIndex === safeIndex;
              const done = orderIndex < safeIndex;
              return (
                <motion.div
                  key={order.id}
                  animate={{ y: active ? -6 : 0, scale: active ? 1.03 : 1 }}
                  style={{
                    borderRadius: '18px',
                    background: '#ffffff',
                    border: active ? '2px solid #A78BFA' : '1px solid #E2E8F0',
                    boxShadow: active ? '0 18px 34px rgba(139, 92, 246, 0.16)' : 'none',
                    padding: '14px 10px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b' }}>{orderIndex}</div>
                  <div style={{ marginTop: '10px', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{order.id}</div>
                  <div style={{ marginTop: '8px', fontSize: '13px', color: '#475569' }}>{order.amount}</div>
                  <div style={{ marginTop: '10px', fontSize: '11px', fontWeight: 800, color: done ? '#16A34A' : active ? '#8B5CF6' : '#94A3B8' }}>
                    {done ? 'Processed' : active ? 'Current' : 'Waiting'}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: '18px',
              borderRadius: '18px',
              background: '#0F172A',
              border: '1px solid #1E293B',
              padding: '18px',
            }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#C4B5FD', lineHeight: 1.8 }}>
              for i in range(len(orders)):
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;process_order(orders[i])
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '16px' }}>
              <MetricPill label="Current index" value={`${safeIndex}`} tone="#8B5CF6" />
              <MetricPill label="Total items" value={`${orders.length}`} tone="#2563EB" />
            </div>
          </div>
        </div>

        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
            <div>
              <div style={panelTitleStyle}>While Loop Mode</div>
              <div style={panelSubtitleStyle}>Process orders while a condition remains true.</div>
            </div>
            <MetricPill label="Condition" value={`${whileCount} < ${orders.length}`} tone="#22C55E" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '14px', marginTop: '18px' }}>
            <div
              style={{
                borderRadius: '20px',
                background: 'linear-gradient(180deg, #14532D 0%, #166534 100%)',
                padding: '18px',
                color: '#ffffff',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.8 }}>
                Condition Gate
              </div>
              <div style={{ marginTop: '16px', fontSize: '15px', fontWeight: 800 }}>count &lt; orders.length</div>
              <div style={{ marginTop: '12px', fontSize: '34px', fontWeight: 900 }}>{whileCount} &lt; {orders.length}</div>
              <div style={{ marginTop: '10px', fontSize: '18px', fontWeight: 900 }}>
                {whileCount < orders.length ? 'TRUE' : 'FALSE'}
              </div>
            </div>
            <div
              style={{
                borderRadius: '20px',
                background: 'linear-gradient(180deg, #1D4ED8 0%, #1E3A8A 100%)',
                padding: '18px',
                color: '#ffffff',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.8 }}>
                Loop Body Chamber
              </div>
              <div style={{ marginTop: '18px', fontSize: '15px', fontWeight: 800 }}>process_order(orders[count])</div>
              <div style={{ marginTop: '18px', borderRadius: '16px', background: 'rgba(255,255,255,0.08)', padding: '14px' }}>
                <div style={{ fontSize: '13px', opacity: 0.8 }}>Currently processing</div>
                <div style={{ marginTop: '8px', fontSize: '24px', fontWeight: 900 }}>{currentOrder.id}</div>
                <div style={{ marginTop: '4px', fontSize: '14px', opacity: 0.9 }}>{currentOrder.amount}</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '18px', display: 'grid', gap: '8px' }}>
            {orders.map((order, orderIndex) => (
              <div
                key={order.id}
                style={{
                  borderRadius: '14px',
                  background: orderIndex <= safeIndex ? '#ECFDF5' : '#ffffff',
                  border: `1px solid ${orderIndex <= safeIndex ? '#86EFAC' : '#E2E8F0'}`,
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>count = {orderIndex}</span>
                <span style={{ fontSize: '12px', color: '#475569' }}>
                  {orderIndex < safeIndex ? `Processed ${order.id}` : orderIndex === safeIndex ? `Current ${order.id}` : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '18px', flexWrap: 'wrap' }}>
        <button onClick={() => setIndex((current) => Math.max(0, current - 1))} style={studioButtonStyle}>
          Step Back
        </button>
        <button onClick={() => setIndex((current) => Math.min(orders.length - 1, current + 1))} style={studioButtonStyle}>
          Step
        </button>
        <button onClick={() => setIndex((current) => Math.min(orders.length - 1, current + 2))} style={studioButtonStyle}>
          Continue
        </button>
      </div>
    </StudioChrome>
  );
}

function FunctionScopeStudio() {
  const [amount, setAmount] = useState(120);
  const discountRate = 0.15;
  const discount = Number((amount * discountRate).toFixed(2));
  const discountedAmount = Number((amount - discount).toFixed(2));

  const options = [120, 89.99, 250.5, 37.49];

  return (
    <StudioChrome
      title="Function Flow and Scope Studio"
      subtitle="Functions bring data in, create local scope, do work, and return a value to the caller."
      accent="#7C3AED"
      actions={
        <>
          <button onClick={() => setAmount(120)} style={studioButtonStyle}>
            Reset
          </button>
          <button onClick={() => setAmount(options[(options.indexOf(amount) + 1) % options.length])} style={{ ...studioButtonStyle, background: '#7C3AED', color: '#ffffff' }}>
            Run
          </button>
        </>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '0.7fr 1.4fr 0.78fr', gap: '18px' }}>
        <div style={panelStyle}>
          <div style={panelTitleStyle}>Input</div>
          <div style={panelSubtitleStyle}>Arguments from the caller.</div>
          <div style={{ display: 'grid', gap: '10px', marginTop: '18px' }}>
            {options.map((value) => (
              <button
                key={value}
                onClick={() => setAmount(value)}
                style={{
                  textAlign: 'left',
                  borderRadius: '14px',
                  border: amount === value ? '2px solid #60A5FA' : '1px solid #CBD5E1',
                  background: '#ffffff',
                  padding: '12px 14px',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#0f172a',
                  cursor: 'pointer',
                }}
              >
                {value.toFixed(2)}
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: '16px',
              borderRadius: '16px',
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              padding: '14px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2563EB' }}>
              Live input
            </div>
            <div style={{ marginTop: '8px', fontSize: '34px', fontWeight: 900, color: '#1D4ED8' }}>{amount.toFixed(2)}</div>
          </div>
        </div>

        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
              apply_discount(<span style={{ color: '#2563EB' }}>amount</span>)
            </div>
          </div>
          <div
            style={{
              borderRadius: '28px',
              background: 'linear-gradient(180deg, #334155 0%, #0F172A 100%)',
              padding: '24px',
              color: '#ffffff',
              boxShadow: '0 30px 60px rgba(15, 23, 42, 0.18)',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#86EFAC' }}>
              Local scope (inside function)
            </div>
            <div style={{ display: 'grid', gap: '12px', marginTop: '18px' }}>
              {[
                ['discountRate', discountRate.toFixed(2)],
                ['discount', discount.toFixed(2)],
                ['discountedAmount', discountedAmount.toFixed(2)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    borderRadius: '18px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    padding: '14px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#F8FAFC' }}>{label}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{label === 'discountedAmount' ? 'return value' : 'local variable'}</div>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: label === 'discountedAmount' ? '#C4B5FD' : '#86EFAC' }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: '16px',
                borderRadius: '16px',
                border: '1px dashed rgba(134, 239, 172, 0.4)',
                padding: '12px 14px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                color: '#86EFAC',
              }}
            >
              Local variables exist only while this function is running.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: '12px', alignItems: 'center', marginTop: '18px' }}>
            <div
              style={{
                borderRadius: '18px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                padding: '16px',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#DC2626', marginBottom: '8px' }}>
                Without function
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', lineHeight: 1.8, color: '#7F1D1D' }}>
                discountRate = 0.15
                <br />
                discount = amount * discountRate
                <br />
                result = amount - discount
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 900, color: '#94A3B8' }}>VS</div>
            <div
              style={{
                borderRadius: '18px',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                padding: '16px',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#16A34A', marginBottom: '8px' }}>
                With function
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', lineHeight: 1.8, color: '#166534' }}>
                final = apply_discount(120.00)
                <br />
                total = apply_discount(89.99)
                <br />
                grandTotal = apply_discount(250.50)
              </div>
            </div>
          </div>
        </div>

        <div style={panelStyle}>
          <div style={panelTitleStyle}>Output</div>
          <div style={panelSubtitleStyle}>Return value to the caller.</div>
          <div
            style={{
              marginTop: '18px',
              borderRadius: '20px',
              background: '#ffffff',
              border: '1px solid #E9D5FF',
              padding: '18px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>discountedAmount</div>
            <div style={{ fontSize: '42px', fontWeight: 900, color: '#7C3AED', lineHeight: 1 }}>{discountedAmount.toFixed(2)}</div>
          </div>
          <div
            style={{
              marginTop: '16px',
              borderRadius: '18px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              padding: '16px',
              fontSize: '13px',
              lineHeight: 1.7,
              color: '#475569',
            }}
          >
            Parameters bring data in. Local scope keeps temporary values private. The return value is the only thing the caller receives back.
          </div>
        </div>
      </div>
    </StudioChrome>
  );
}

function DataStructureDecisionStudio() {
  type StructureKey = 'list' | 'tuple' | 'set' | 'dict';

  const scenarios = [
    {
      label: 'Order Amounts',
      values: '[120.50, 89.00, 120.50, 75.25]',
      target: 'list' as StructureKey,
      helper: 'Numbers in order',
    },
    {
      label: 'Product Tags',
      values: '["sale", "new", "sale", "eco"]',
      target: 'set' as StructureKey,
      helper: 'Text may repeat',
    },
    {
      label: 'Customer Profile',
      values: '{"id": 101, "name": "Aisha", "tier": "Gold"}',
      target: 'dict' as StructureKey,
      helper: 'Key-value pairs',
    },
    {
      label: 'Delivery Coordinates',
      values: '(28.6139, 77.2090)',
      target: 'tuple' as StructureKey,
      helper: 'Fixed pair',
    },
  ];

  const structures = {
    list: {
      title: 'List',
      color: '#16A34A',
      summary: 'Ordered, mutable, duplicates allowed',
      detail: ['Preserves order', 'Allows duplicates'],
    },
    tuple: {
      title: 'Tuple',
      color: '#2563EB',
      summary: 'Ordered, immutable, stable fixed data',
      detail: ['Fixed and immutable', 'Good for coordinates'],
    },
    set: {
      title: 'Set',
      color: '#8B5CF6',
      summary: 'Unordered, unique values only',
      detail: ['Removes duplicates', 'Fast membership checks'],
    },
    dict: {
      title: 'Dictionary',
      color: '#F97316',
      summary: 'Key-value mapping for named lookup',
      detail: ['Maps keys to values', 'Fast lookup by key'],
    },
  } as const;

  const [selectedScenario, setSelectedScenario] = useState(scenarios[1]);

  return (
    <StudioChrome
      title="Data Structure Decision Studio"
      subtitle="Choose a scenario, compare the four structures, and focus on the behavior that matters most."
      accent="#F97316"
      actions={
        <>
          <button onClick={() => setSelectedScenario(scenarios[0])} style={studioButtonStyle}>
            Reset Lab
          </button>
          <button style={{ ...studioButtonStyle, background: '#F97316', color: '#ffffff' }}>
            Best Fit: {structures[selectedScenario.target].title}
          </button>
        </>
      }
    >
      <div
        style={{
          borderRadius: '20px',
          border: '1px solid rgba(124, 58, 237, 0.22)',
          background: 'linear-gradient(180deg, #24124A 0%, #1A1235 100%)',
          overflow: 'hidden',
          boxShadow: '0 18px 44px rgba(15, 23, 42, 0.16)',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(249, 115, 22, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            📦
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#22C55E' }}>
              Python Data Structure Lab
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(226, 232, 240, 0.76)', marginTop: '3px' }}>
              Pick a scenario, then inspect why one structure fits better than the others.
            </div>
          </div>
        </div>

        <div style={{ padding: '22px', display: 'grid', gap: '18px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(196, 181, 253, 0.9)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: '10px' }}>
              DATA SCENARIOS - click to inspect
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {scenarios.map((scenario) => {
                const active = scenario.label === selectedScenario.label;
                return (
                  <button
                    key={scenario.label}
                    onClick={() => setSelectedScenario(scenario)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      background: active ? 'rgba(139, 92, 246, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1.5px solid ${active ? '#A855F7' : 'rgba(167, 139, 250, 0.24)'}`,
                      color: active ? '#F5F3FF' : '#E2E8F0',
                      minWidth: '220px',
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: 800 }}>{scenario.label}</div>
                    <div style={{ marginTop: '6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', lineHeight: 1.65, color: active ? '#DDD6FE' : 'rgba(226, 232, 240, 0.72)' }}>
                      {scenario.values}
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '11px', color: active ? '#C4B5FD' : 'rgba(226, 232, 240, 0.6)' }}>{scenario.helper}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {(Object.keys(structures) as Array<keyof typeof structures>).map((key) => {
              const structure = structures[key];
              const active = selectedScenario.target === key;

              return (
                <motion.div
                  key={key}
                  animate={{ y: active ? -2 : 0 }}
                  style={{
                    borderRadius: '14px',
                    border: `2px dashed ${active ? structure.color : 'rgba(167, 139, 250, 0.24)'}`,
                    background: active ? `${structure.color}14` : 'rgba(255, 255, 255, 0.03)',
                    padding: '14px 16px',
                    minHeight: '160px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: 800, color: structure.color }}>
                      {key === 'list' ? '[ ]' : key === 'tuple' ? '( )' : key === 'set' ? '{ }' : '{k:v}'}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', color: structure.color }}>
                      {structure.title.toLowerCase()}
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: 'rgba(226, 232, 240, 0.72)', marginBottom: '10px' }}>{structure.summary}</div>

                  <div style={{ display: 'grid', gap: '8px' }}>
                    {key === 'list' && (
                      <div style={{ ...compactSampleStyle, color: '#DBEAFE' }}>[120.50, 89.00, 120.50, 75.25]</div>
                    )}
                    {key === 'tuple' && (
                      <div style={{ ...compactSampleStyle, color: '#DBEAFE' }}>(28.6139, 77.2090)</div>
                    )}
                    {key === 'set' && (
                      <div style={{ ...compactSampleStyle, color: '#E9D5FF' }}>{'{"sale", "new", "eco"}'}</div>
                    )}
                    {key === 'dict' && (
                      <div style={{ ...compactSampleStyle, color: '#FED7AA' }}>{'{ "id": 101, "name": "Aisha" }'}</div>
                    )}
                  </div>

                  <div style={{ marginTop: '12px', display: 'grid', gap: '4px' }}>
                    {structure.detail.map((item) => (
                      <div key={item} style={{ fontSize: '12px', color: active ? '#F8FAFC' : 'rgba(226, 232, 240, 0.72)' }}>
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
            <div
              style={{
                borderRadius: '14px',
                border: '1px solid rgba(34, 197, 94, 0.24)',
                background: 'rgba(15, 23, 42, 0.24)',
                padding: '16px',
              }}
            >
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#22C55E', marginBottom: '8px' }}>
                Python principle
              </div>
              <div style={{ fontSize: '15px', lineHeight: 1.75, color: '#F8FAFC', fontStyle: 'italic', fontFamily: "'Lora', serif" }}>
                "The right Python structure depends on the shape and meaning of the data, not just on syntax."
              </div>
            </div>

            <div
              style={{
                borderRadius: '14px',
                border: '1px solid rgba(167, 139, 250, 0.28)',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '16px',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#F5F3FF', marginBottom: '8px' }}>
                {structures[selectedScenario.target].title} fits because
              </div>
              <div style={{ fontSize: '12px', lineHeight: 1.7, color: 'rgba(226, 232, 240, 0.78)' }}>
                {selectedScenario.target === 'list' && 'Order matters and duplicates are allowed. Lists preserve sequence as items arrive.'}
                {selectedScenario.target === 'tuple' && 'The data is fixed in shape and should stay stable after creation.'}
                {selectedScenario.target === 'set' && 'Uniqueness matters more than order. Sets automatically remove duplicates.'}
                {selectedScenario.target === 'dict' && 'Named lookup matters. Dictionaries map each field to a clear key.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudioChrome>
  );
}

function PythonLanguageBasics({ onBack }: { onBack: () => void }) {
  const store = useLearnerStore();
  const [hydrated, setHydrated] = useState(false);
  const [activeSection, setActiveSection] = useState('identity');

  const completedModules = useMemo(() => {
    return new Set(store.completedSections[MODULE_ID] || ['identity']);
  }, [store.completedSections]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    PYTHON_CONCEPT_IDS.forEach((id) => store.ensureConceptState(id));
  }, [store]);

  useEffect(() => {
    if (!hydrated) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-nav-id');
            if (id) {
              setActiveSection(id);
              store.markSectionCompleted(MODULE_ID, id);
            }
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20% 0px' }
    );

    document.querySelectorAll('[data-nav-id]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [hydrated, store]);

  if (!hydrated) return null;

  const trackConfig = TRACK_CONFIG.python;

  return (
    <SWEPreReadLayout
      trackConfig={trackConfig}
      moduleLabel="PYTHON PRE-READ 00"
      title="The Python Lens - How Python Thinks"
      sections={PYTHON_SECTIONS}
      completedModules={completedModules}
      activeSection={activeSection}
      onBack={onBack}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          marginBottom: '48px',
          padding: '32px',
          borderRadius: '26px',
          background: 'linear-gradient(135deg, #F6FFF7 0%, #EFF6FF 52%, #F8FAFC 100%)',
          border: '1px solid rgba(34, 197, 94, 0.18)',
          boxShadow: '0 24px 50px rgba(15, 23, 42, 0.05)',
        }}
      >
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#64748b', letterSpacing: '0.06em', marginBottom: '20px' }}>
          Python Foundations for Backend Engineers · Pre-course · 30-35 min · 7 parts
        </div>
        <h2
          style={{
            fontSize: 'clamp(34px, 4.2vw, 54px)',
            lineHeight: 1.02,
            fontWeight: 900,
            color: '#0f172a',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            marginBottom: '18px',
          }}
        >
          Stop seeing Python as syntax.
          <br />
          Start seeing it as a system of values, decisions, repetition, and structure.
        </h2>
        <p style={{ maxWidth: '760px', fontSize: '17px', lineHeight: 1.85, color: '#334155', marginBottom: '26px' }}>
          Aisha is helping Blue Basket build a tiny internal tool. The product is small, but the engineering lens is not. This pre-read is about understanding what Python is doing when code runs, what variables actually are, how decisions are made, how loops progress, why functions matter, and how data structures shape performance.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px' }}>
          <MetricPill label="Focus" value="Python mental model" tone="#16A34A" />
          <MetricPill label="Setting" value="Blue Basket" tone="#2563EB" />
          <MetricPill label="Visuals" value="6 teaching tools" tone="#7C3AED" />
          <MetricPill label="Goal" value="Think like an engineer" tone="#F97316" />
        </div>
      </motion.div>

      <div id="identity" data-nav-id="identity" style={{ marginBottom: '92px' }}>
        <ChapterSection id="python-p0-identity" num="01" accentRgb={trackConfig.accentRgb} first>
          {chLabel('Execution Pipeline')}
          {h2(<>The day Aisha realized Python is a system of instructions</>)}
          <SituationCard protagonist="Aisha" accentColor="#2563EB" story="Aisha&apos;s first task at Blue Basket is tiny: print a message when the order-processing script starts. The line works. The message appears. But she has no real model of what the runtime just did." />
          <ProtagonistAvatar
            name="Aisha"
            role="Backend Learner · Blue Basket"
            color={trackConfig.accent}
            content="I can run a line of Python. But if I am honest, my mental model is still: I type code, and somehow the computer does it."
          />
          <SWEConversationScene
            track="python"
            lines={[
              { speaker: 'protagonist', text: 'When I hit run, what actually happens between the file and the output?' },
              { speaker: 'mentor', text: 'Your source code is not the output. Python parses it, compiles it into bytecode, then the Python Virtual Machine executes that bytecode step by step.' },
              { speaker: 'protagonist', text: 'So execution is a pipeline, not a jump straight from text to behavior.' },
              { speaker: 'mentor', text: 'Exactly. That is the first mental shift. Python is a structured instruction system executed by a runtime.' },
            ]}
            mentorName="Riya"
            mentorRole="Backend Mentor"
            mentorColor="#2563EB"
          />
          {keyBox('Key Idea', [
            'Python code is not just written. It is processed through an execution pipeline.',
            'Source code becomes bytecode.',
            'The Python Virtual Machine executes that bytecode instruction by instruction.',
          ], '#2563EB')}
          <PythonExecutionPipelineStudio />
          <SWEAvatar
            name="Riya"
            role="Backend Mentor"
            color="#2563EB"
            content={<>The runtime matters because Python is not magic text. Once you see the pipeline, debugging and performance questions stop feeling mystical.</>}
            expandedContent={<>You do not need deep internals yet. But you do need the right shape of understanding: source, translation, bytecode, runtime execution, output. That is enough to anchor everything that comes next.</>}
            question="What is the most useful beginner mental model of Python?"
            conceptId="python-execution-pipeline"
            options={[
              { text: 'Python is a magic tool that mostly understands English.', correct: false, feedback: 'Python is readable, but it is still a formal language executed by a runtime. Treating it like magic leads to shallow debugging.' },
              { text: 'Python is a structured instruction system executed by a runtime.', correct: true, feedback: 'That is the right lens. Code moves through a pipeline before the computer produces behavior or output.' },
              { text: 'Python is mainly a design tool for writing quick pseudocode.', correct: false, feedback: 'Readable syntax helps, but Python still has a precise execution model.' },
              { text: 'Python only works because the internet interprets it for you.', correct: false, feedback: 'Execution happens locally through the Python runtime, not through the network.' },
            ]}
          />
        </ChapterSection>
      </div>

      <div id="types" data-nav-id="types" style={{ marginBottom: '92px' }}>
        <ChapterSection id="python-p0-types" num="02" accentRgb={trackConfig.accentRgb}>
          {chLabel('Variable Binding')}
          {h2(<>The variable that was not a box</>)}
          <SituationCard protagonist="Aisha" accentColor="#7C3AED" story="Aisha stores customer_name, order_total, is_paid, and discount_rate. It feels simple until a TypeError reminds her that values are not all the same kind of thing." />
          <ProtagonistAvatar
            name="Aisha"
            role="Backend Learner · Blue Basket"
            color={trackConfig.accent}
            content="I thought variables were little boxes. Then Python refused to add a string and a number, and suddenly types started feeling very real."
          />
          <SWEConversationScene
            track="python"
            lines={[
              { speaker: 'protagonist', text: 'I wrote print("Total: " + 40) and it crashed. I thought Python was flexible.' },
              { speaker: 'mentor', text: 'Python is dynamically typed, not carelessly typed. It figures out types at runtime, but it will not silently merge incompatible kinds of values.' },
              { speaker: 'protagonist', text: 'So a variable is not a box. It is a name that points to a value with a type.' },
              { speaker: 'mentor', text: 'Exactly. That is why type shapes what operations are valid and what mistakes show up clearly.' },
            ]}
            mentorName="Riya"
            mentorRole="Backend Mentor"
            mentorColor="#7C3AED"
          />
          {keyBox('Key Idea', [
            'Variables are names bound to values.',
            'Values have types.',
            'Type determines what operations actually make sense.',
          ], '#7C3AED')}
          <VariableBindingStudio />
          <QuickTry
            track="python"
            problem="Try combining values and see which operations fit the type."
            initialCode={'customer_name = "Rohan"\norder_total = 499\nprint(customer_name + " Kumar")\n# Try changing this to print(customer_name + order_total)'}
            hint="Strings can join strings. Numbers can add to numbers."
            onRun={() => store.markSectionCompleted(MODULE_ID, 'types')}
            evaluateOutput={(code) => {
              if (code.includes('customer_name + order_total')) {
                return { status: 'error', text: "TypeError: can only concatenate str (not 'int') to str" };
              }
              return { status: 'success', text: 'Rohan Kumar' };
            }}
          />
          <SWEAvatar
            name="Riya"
            role="Backend Mentor"
            color="#7C3AED"
            content={<>When you confuse the kind of data you are holding, your code may still look neat for a while, but your thinking gets messy fast.</>}
            expandedContent={<>Strong Python habits start with precision. Ask what kind of value this is, what operations fit it, and whether a later reader can tell that just from the names and structure.</>}
            question="What is the most accurate beginner description of a Python variable?"
            conceptId="python-variable-binding"
            options={[
              { text: 'A decoration added to code to make it readable.', correct: false, feedback: 'Good names help readability, but a variable is more than decoration. It is how the program refers to values.' },
              { text: 'A name bound to a value.', correct: true, feedback: 'That is the right model. The variable gives the program a stable way to refer to a value of some type.' },
              { text: 'A function that stores text only.', correct: false, feedback: 'Variables can refer to strings, numbers, booleans, objects, collections, and more.' },
              { text: 'A tool that only makes sense for numbers.', correct: false, feedback: 'Variables are fundamental across every kind of value, not just numeric ones.' },
            ]}
          />
        </ChapterSection>
      </div>

      <div id="flow" data-nav-id="flow" style={{ marginBottom: '92px' }}>
        <ChapterSection id="python-p0-flow" num="03" accentRgb={trackConfig.accentRgb}>
          {chLabel('Branching & Truthiness')}
          {h2(<>The order check that introduced control flow</>)}
          <SituationCard protagonist="Aisha" accentColor="#22C55E" story="Blue Basket now needs decision-making: confirm paid orders, flag large baskets, and handle empty carts. For the first time, the script stops being a fixed sequence and starts becoming conditional." />
          <ProtagonistAvatar
            name="Aisha"
            role="Backend Learner · Blue Basket"
            color={trackConfig.accent}
            content="This is where code started feeling alive. It was no longer doing everything in one straight line. It was choosing a path."
          />
          <SWEConversationScene
            track="python"
            lines={[
              { speaker: 'protagonist', text: 'I used if cart == [] to check for emptiness. It worked, but it felt clumsy.' },
              { speaker: 'mentor', text: 'In Python, empty lists, empty strings, zero, and None are falsy. You can often express the idea more directly with if not cart.' },
              { speaker: 'protagonist', text: 'So truthiness is how values behave when Python evaluates a condition.' },
              { speaker: 'mentor', text: 'Yes. Then if, elif, and else decide which branch execution should actually take.' },
            ]}
            mentorName="Riya"
            mentorRole="Backend Mentor"
            mentorColor="#22C55E"
          />
          {keyBox('Key Idea', [
            'Programs become useful when they make decisions based on values.',
            'Python evaluates conditions from top to bottom.',
            'Many values carry truthiness even without explicit comparison.',
          ], '#22C55E')}
          <BranchingTruthinessStudio />
          <QuickTry
            track="python"
            problem="Change the condition and follow a different execution path."
            initialCode={'is_paid = False\nitems = []\nif is_paid:\n    print("Order confirmed")\nelif items:\n    print("Items present")\nelse:\n    print("Payment pending")'}
            hint="Try setting is_paid to True or items to [1]."
            onRun={() => store.markSectionCompleted(MODULE_ID, 'flow')}
            evaluateOutput={(code) => {
              if (code.includes('is_paid = True')) return { status: 'success', text: 'Order confirmed' };
              if (code.includes('items = [1]')) return { status: 'success', text: 'Items present' };
              return { status: 'success', text: 'Payment pending' };
            }}
          />
          <SWEAvatar
            name="Riya"
            role="Backend Mentor"
            color="#22C55E"
            content={<>Values alone are not enough. Programs matter when they can decide what to do next.</>}
            expandedContent={<>The teaching job here is flow, not syntax memorization. The learner should leave seeing conditions as gates through which values move, with truthiness deciding how those gates behave.</>}
            question="What is the most important idea behind Python control flow?"
            conceptId="python-truthiness"
            options={[
              { text: 'Every condition must compare two numbers explicitly.', correct: false, feedback: 'Comparisons are common, but Python can also evaluate truthiness directly on many values.' },
              { text: 'Control flow decides which path execution should take based on values.', correct: true, feedback: 'That is the core idea. Conditions route execution through one branch instead of another.' },
              { text: 'if and else are mostly formatting features for readability.', correct: false, feedback: 'They affect actual execution, not just presentation.' },
              { text: 'Truthiness only matters for booleans.', correct: false, feedback: 'Empty strings, empty lists, zero, and None also participate in truthiness.' },
            ]}
          />
        </ChapterSection>
      </div>

      <div id="loops" data-nav-id="loops" style={{ marginBottom: '92px' }}>
        <ChapterSection id="python-p0-loops" num="04" accentRgb={trackConfig.accentRgb}>
          {chLabel('Loop Progression')}
          {h2(<>The moment repetition became visible</>)}
          <SituationCard protagonist="Aisha" accentColor="#8B5CF6" story="Blue Basket now has a cart full of products. Aisha needs to process item after item without rewriting the same action six times." />
          <ProtagonistAvatar
            name="Aisha"
            role="Backend Learner · Blue Basket"
            color={trackConfig.accent}
            content="Loops stopped being abstract when I could actually see the cursor move from order to order and watch the condition get rechecked."
          />
          <SWEConversationScene
            track="python"
            lines={[
              { speaker: 'protagonist', text: 'I kept reaching for manual counters and then ran into off-by-one mistakes.' },
              { speaker: 'mentor', text: 'Python often lets you loop over the collection directly. When you do need indexing, be deliberate about what changes each iteration.' },
              { speaker: 'protagonist', text: 'So the important thing is not the keyword. It is the progression: current item, next item, recheck, repeat.' },
              { speaker: 'mentor', text: 'Exactly. Loops are temporal. That is why motion teaches this better than a static paragraph.' },
            ]}
            mentorName="Riya"
            mentorRole="Backend Mentor"
            mentorColor="#8B5CF6"
          />
          {keyBox('Key Idea', [
            'Loops repeat controlled work over time.',
            'for loops move through a sequence.',
            'while loops repeat while a condition remains true.',
          ], '#8B5CF6')}
          <LoopTimelineStudio />
          <SWEAvatar
            name="Riya"
            role="Backend Mentor"
            color="#8B5CF6"
            content={<>A loop is easier to understand when you can see state changing from one iteration to the next.</>}
            expandedContent={<>The teaching job here is progression over time: current position, work happening, and the moment the system decides whether to continue, skip, or stop.</>}
            question="Why are loops especially well suited to motion-based teaching?"
            conceptId="python-loops"
            options={[
              { text: 'Because loops are mostly about pretty animation.', correct: false, feedback: 'The value is not decoration. It is that loops are temporal systems with repeated state change.' },
              { text: 'Because loops repeat actions and recheck state over time.', correct: true, feedback: 'Exactly. Motion helps the learner see the cursor advance, the condition recheck, and the exit moment.' },
              { text: 'Because Python loops are too complex to explain in text.', correct: false, feedback: 'Text still matters. Motion just handles progression better.' },
              { text: 'Because while loops always need graphics to run.', correct: false, feedback: 'The code runs fine without visuals. The visuals improve understanding, not execution.' },
            ]}
          />
        </ChapterSection>
      </div>

      <div id="functions" data-nav-id="functions" style={{ marginBottom: '92px' }}>
        <ChapterSection id="python-p0-functions" num="05" accentRgb={trackConfig.accentRgb}>
          {chLabel('Functions & Scope')}
          {h2(<>The day duplication started to feel expensive</>)}
          <SituationCard protagonist="Aisha" accentColor="#7C3AED" story="Aisha has written discount logic in multiple places across Blue Basket. It works, but every future change now means fixing the same idea in several places." />
          <ProtagonistAvatar
            name="Aisha"
            role="Backend Learner · Blue Basket"
            color={trackConfig.accent}
            content="The problem was not that the code failed. The problem was that it forced me to edit the same idea everywhere."
          />
          <SWEConversationScene
            track="python"
            lines={[
              { speaker: 'protagonist', text: 'I keep rewriting the same discount logic in checkout, orders, and reporting.' },
              { speaker: 'mentor', text: 'That is exactly what functions solve. Put the logic behind a name, give it input, let it work in local scope, and return the value you need.' },
              { speaker: 'protagonist', text: 'So scope is the boundary that keeps temporary variables private.' },
              { speaker: 'mentor', text: 'Yes. Parameters bring data in. Local scope protects intermediate work. The return value is what comes back out.' },
            ]}
            mentorName="Riya"
            mentorRole="Backend Mentor"
            mentorColor="#7C3AED"
          />
          {keyBox('Key Idea', [
            'Functions package logic into reusable units.',
            'Parameters carry data in.',
            'Local scope keeps temporary variables inside the function.',
            'Return values deliver results back to the caller.',
          ], '#7C3AED')}
          <FunctionScopeStudio />
          <QuickTry
            track="python"
            problem="Reuse logic instead of repeating it inline."
            initialCode={'def apply_discount(amount):\n    discount_rate = 0.15\n    discount = amount * discount_rate\n    return amount - discount\n\nprint(apply_discount(120))'}
            hint="Change the amount or the discount_rate."
            onRun={() => store.markSectionCompleted(MODULE_ID, 'functions')}
            evaluateOutput={(code) => {
              const match = code.match(/apply_discount\((\d+)\)/);
              const amount = match ? Number(match[1]) : 120;
              const rateMatch = code.match(/discount_rate = ([0-9.]+)/);
              const rate = rateMatch ? Number(rateMatch[1]) : 0.15;
              return { status: 'success', text: String(Number((amount - amount * rate).toFixed(2))) };
            }}
          />
          <SWEAvatar
            name="Riya"
            role="Backend Mentor"
            color="#7C3AED"
            content={<>Functions are not just about saving keystrokes. They protect clarity by giving repeated logic one home.</>}
            expandedContent={<>Once a behavior has one stable name, your codebase becomes easier to explain, reuse, test, and change. That is a maintainability win, not just a style win.</>}
            question="Why do functions matter beyond reducing repetition?"
            conceptId="python-function-scope"
            options={[
              { text: 'They make code look more advanced, even if behavior stays messy.', correct: false, feedback: 'Style is not the point. Functions help structure behavior and isolate logic.' },
              { text: 'They package logic into reusable units with clear input, local scope, and output.', correct: true, feedback: 'That is the full mental model. Functions manage both reuse and reasoning.' },
              { text: 'They remove the need to think about variables at all.', correct: false, feedback: 'Variables still matter. Functions just create better boundaries for how values move.' },
              { text: 'They are only useful in large codebases, not small scripts.', correct: false, feedback: 'Even tiny scripts benefit once the same idea appears in more than one place.' },
            ]}
          />
        </ChapterSection>
      </div>

      <div id="dataStructures" data-nav-id="dataStructures" style={{ marginBottom: '92px' }}>
        <ChapterSection id="python-p0-data-structures" num="06" accentRgb={trackConfig.accentRgb}>
          {chLabel('Data Structures')}
          {h2(<>The choice that changes both meaning and performance</>)}
          <SituationCard protagonist="Aisha" accentColor="#F97316" story="Blue Basket now has order amounts, product tags, customer profiles, and coordinates. The values matter, but so does the shape of the container holding them." />
          <ProtagonistAvatar
            name="Aisha"
            role="Backend Learner · Blue Basket"
            color={trackConfig.accent}
            content="I used to reach for one structure by habit. Now I see that each structure is a promise about behavior."
          />
          <SWEConversationScene
            track="python"
            lines={[
              { speaker: 'protagonist', text: 'I kept using lists for everything, even when I needed uniqueness or named lookup.' },
              { speaker: 'mentor', text: 'That works until scale or clarity pushes back. Lists preserve order. Tuples signal fixed data. Sets remove duplicates. Dictionaries map keys to values.' },
              { speaker: 'protagonist', text: 'So picking a structure is not cosmetic. It changes performance, readability, and what the code communicates.' },
              { speaker: 'mentor', text: 'Exactly. Shape the structure to fit the job.' },
            ]}
            mentorName="Riya"
            mentorRole="Backend Mentor"
            mentorColor="#F97316"
          />
          {keyBox('Key Idea', [
            'Lists are ordered and mutable.',
            'Tuples are ordered and fixed.',
            'Sets remove duplicates and make membership checks fast.',
            'Dictionaries organize data by key for instant lookup.',
          ], '#F97316')}
          <DataStructureDecisionStudio />
          <SWEAvatar
            name="Riya"
            role="Backend Mentor"
            color="#F97316"
            content={<>A data structure is not just a container. It is a behavioral contract.</>}
            expandedContent={<>The learner should leave this section understanding that structure choice affects meaning, performance, and maintainability all at once. That is why this belongs in a decision lab, not a flashcard.</>}
            question="What is the best mental model for choosing a Python data structure?"
            conceptId="python-data-structures"
            options={[
              { text: 'Use lists for everything because they are the most familiar.', correct: false, feedback: 'Familiarity helps at first, but the wrong structure hides intent and can slow programs down.' },
              { text: 'Choose the structure whose behavior matches the problem: order, uniqueness, fixed shape, or key-based lookup.', correct: true, feedback: 'Exactly. The structure should fit the data shape and the access pattern.' },
              { text: 'Always prefer tuples because they are more advanced.', correct: false, feedback: 'Tuples are useful, but only when fixed, stable structure is what you want.' },
              { text: 'The structure does not matter if the values are correct.', correct: false, feedback: 'It matters for meaning, readability, and performance.' },
            ]}
          />
        </ChapterSection>
      </div>

      <div id="challenge" data-nav-id="challenge" style={{ marginBottom: '64px' }}>
        <ChapterSection id="python-p0-final" num="07" accentRgb={trackConfig.accentRgb}>
          {chLabel('Final Lens')}
          {h2(<>Almost everything in programming begins here</>)}
          <SituationCard protagonist="Aisha" accentColor="#16A34A" story="Blue Basket is still a tiny internal tool. But Aisha can now feel that the same mental model will scale: values, decisions, repetition, structure, and the right data shape." />
          <ProtagonistAvatar
            name="Aisha"
            role="Backend Learner · Blue Basket"
            color={trackConfig.accent}
            content="Python no longer feels like scattered syntax. It feels like a clean way to describe what should happen, when it should happen, and what should happen next."
          />
          {keyBox('What this pre-read changed', [
            'You saw Python execution as a pipeline.',
            'You treated variables as bindings to typed values.',
            'You saw conditions as branch gates.',
            'You watched loops progress through time.',
            'You understood functions as reusable scope boundaries.',
            'You matched data shapes to the right structures.',
          ], '#16A34A')}
          <SWEAvatar
            name="Riya"
            role="Backend Mentor"
            color="#16A34A"
            content={<>A beginner celebrates when code runs. A stronger engineer asks what model makes the behavior understandable, reusable, and trustworthy.</>}
            expandedContent={<>That is the lens you are carrying into Pre-read 01. Syntax matters, but mental models matter more. Once those are strong, the rest of the course has somewhere solid to attach.</>}
            question="What is the best summary of what this pre-read was trying to teach?"
            conceptId="python-lens-synthesis"
            options={[
              { text: 'A list of Python syntax rules to memorize before class.', correct: false, feedback: 'Syntax appears here, but the deeper goal was building mental models, not collecting rules.' },
              { text: 'A way to see Python as a system of values, decisions, repetition, and structure.', correct: true, feedback: 'That is the lens. Once you see the system, the syntax has context and purpose.' },
              { text: 'A reminder that backend engineering mostly means copying tutorial code.', correct: false, feedback: 'This pre-read pushes in the opposite direction: understand the behavior so you can reason independently.' },
              { text: 'A crash course in performance tuning the CPython interpreter internals.', correct: false, feedback: 'Runtime understanding mattered, but only at the level needed to anchor strong beginner thinking.' },
            ]}
          />
          <NextChapterTeaser text="Next up: Python Foundations for Backend Engineers, where the lens you built here starts turning into durable coding habits." />
        </ChapterSection>
      </div>

      <section
        style={{
          padding: '52px 42px',
          background: 'linear-gradient(135deg, #0F172A 0%, #111827 100%)',
          borderRadius: '28px',
          border: '1px solid rgba(34, 197, 94, 0.28)',
          boxShadow: '0 24px 48px rgba(15, 23, 42, 0.16)',
          textAlign: 'center',
          color: '#F8FAFC',
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#86EFAC', marginBottom: '14px' }}>
          Pre-read 00 complete
        </div>
        <h3 style={{ fontSize: '34px', lineHeight: 1.08, fontWeight: 900, marginBottom: '14px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          You have a Python lens now.
        </h3>
        <p style={{ maxWidth: '640px', margin: '0 auto 26px', fontSize: '16px', lineHeight: 1.8, color: '#CBD5E1' }}>
          The next pre-read will move from mental model to concrete Python habits: data types, functions, lambda thinking, and the foundations that backend engineers actually use every day.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          style={{
            padding: '16px 34px',
            borderRadius: '16px',
            border: 'none',
            cursor: 'pointer',
            background: 'linear-gradient(180deg, #22C55E 0%, #16A34A 100%)',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 800,
            boxShadow: '0 16px 32px rgba(34, 197, 94, 0.26)',
          }}
        >
          Go to Pre-read 01
        </motion.button>
      </section>
    </SWEPreReadLayout>
  );
}

function LegacyLanguageBasics({ track, level, onBack }: Props) {
  const store = useLearnerStore();
  const [hydrated, setHydrated] = useState(false);
  const [activeSection, setActiveSection] = useState('identity');

  const completedModules = useMemo(() => {
    return new Set(store.completedSections[MODULE_ID] || ['identity']);
  }, [store.completedSections]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-nav-id');
            if (id) {
              setActiveSection(id);
              store.markSectionCompleted(MODULE_ID, id);
            }
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20% 0px' }
    );

    document.querySelectorAll('[data-nav-id]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [hydrated, store]);

  if (!hydrated) return null;

  const trackConfig = TRACK_CONFIG[track];
  const getStory = (id: string) => BASICS_STORY[track]?.[level]?.[id] || null;

  return (
    <SWEPreReadLayout
      trackConfig={trackConfig}
      moduleLabel={`${trackConfig.name.toUpperCase()} PRE-READ 00`}
      title={`Language Basics: The ${trackConfig.name} Lens`}
      sections={LEGACY_SECTIONS}
      completedModules={completedModules}
      activeSection={activeSection}
      onBack={onBack}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', marginBottom: '56px', flexWrap: 'wrap' }}
      >
        <div style={{ flex: 1, minWidth: '320px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ed-ink3)', marginBottom: '28px', letterSpacing: '0.04em' }}>
            Software Engineering <span style={{ margin: '0 8px', color: 'var(--ed-rule)' }}>&gt;</span>{' '}
            <span style={{ color: 'var(--ed-ink2)' }}>{trackConfig.name} Track</span>
            <span style={{ margin: '0 10px', color: 'var(--ed-rule)' }}>·</span>
            <span style={{ color: 'var(--ed-ink3)' }}>25 min · 8 parts</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--ed-ink)',
              marginBottom: '18px',
              fontFamily: "'Lora', serif",
            }}
          >
            Computational Foundations:
            <br />
            <span style={{ color: trackConfig.accent }}>The {trackConfig.name} Mindset</span>
          </h1>

          <p
            style={{
              fontSize: '17px',
              color: 'var(--ed-ink2)',
              lineHeight: 1.8,
              maxWidth: '540px',
              marginBottom: '36px',
              fontStyle: 'italic',
              fontFamily: "'Lora', serif",
            }}
          >
            &ldquo;Software engineering isn&apos;t about memorizing syntax. It&apos;s about understanding how a language thinks and models reality.&rdquo;
          </p>
        </div>
      </motion.div>

      {LEGACY_SECTIONS.map((section, index) => {
        const story = getStory(section.id);
        if (!story) return null;

        return (
          <div key={section.id} id={section.id} data-nav-id={section.id} style={{ marginBottom: '92px' }}>
            <ChapterSection id={`legacy-${section.id}`} num={(index + 1).toString().padStart(2, '0')} accentRgb={trackConfig.accentRgb} first={index === 0}>
              {chLabel(section.label)}
              {h2(<>{story.open}</>)}
              <ProtagonistAvatar
                name={trackConfig.protagonist}
                role={trackConfig.role}
                color={trackConfig.accent}
                content={story.story}
              />
              <SWEConversationScene
                track={track}
                lines={story.avatarLines}
                mentorName={story.mentorName}
                mentorRole={story.mentorRole}
                mentorColor={story.mentorColor}
              />

              {section.id === 'types' && (
                <QuickTry
                  track={track}
                  problem="Define variables and observe behavior."
                  initialCode={
                    track === 'java'
                      ? 'int x = 10;\nString y = "20";\n// Try System.out.println(x + y);'
                      : 'const x = 10;\nconst y = "20";\n// Try console.log(x + y);'
                  }
                  hint="Check the types before adding."
                  onRun={() => store.markSectionCompleted(MODULE_ID, 'types')}
                  evaluateOutput={(code) => {
                    const hasOutput = code.includes('console.log(x + y)') || code.includes('System.out.println(x + y)');
                    if (hasOutput && code.includes('"20"')) return { status: 'success', text: '1020' };
                    if (hasOutput) return { status: 'success', text: '30' };
                    return { status: 'success', text: '(No output.)' };
                  }}
                />
              )}

              {section.id === 'flow' && (
                <QuickTry
                  track={track}
                  problem="Trigger the alternate logic block."
                  initialCode={
                    track === 'java'
                      ? 'boolean active = false;\nif (active) {\n    System.out.println("System ON");\n} else {\n    System.out.println("System OFF");\n}'
                      : 'const active = false;\nif (active) {\n    console.log("System ON");\n} else {\n    console.log("System OFF");\n}'
                  }
                  hint="Change active to true."
                  onRun={() => store.markSectionCompleted(MODULE_ID, 'flow')}
                  evaluateOutput={(code) => {
                    const isActive = code.includes('true') && !code.includes('false');
                    return { status: 'success', text: isActive ? 'System ON' : 'System OFF' };
                  }}
                />
              )}

              {section.id === 'loops' && (
                <QuickTry
                  track={track}
                  problem="Automate a repetitive task with a loop."
                  initialCode={
                    track === 'java'
                      ? 'for (int i = 1; i <= 3; i++) {\n    System.out.println("Loading record " + i + "...");\n}'
                      : 'for (let i = 1; i <= 3; i++) {\n    console.log("Loading record " + i + "...");\n}'
                  }
                  hint="Change the limit to 10."
                  onRun={() => store.markSectionCompleted(MODULE_ID, 'loops')}
                  evaluateOutput={(code) => {
                    const match = code.match(/<=\s*(\d+)/);
                    const limit = match ? Number(match[1]) : 3;
                    let output = '';
                    for (let i = 1; i <= Math.min(limit, 12); i += 1) output += `Loading record ${i}...\n`;
                    return { status: 'success', text: output.trim() };
                  }}
                />
              )}

              {section.id === 'functions' && (
                <QuickTry
                  track={track}
                  problem="Encapsulate logic in a reusable function."
                  initialCode={
                    track === 'java'
                      ? 'public static String greet(String name) {\n    return "Hello, " + name + "!";\n}\n\nSystem.out.println(greet("Vikram"));'
                      : 'const greet = (name) => `Hello, ${name}!`;\n\nconsole.log(greet("Leo"));'
                  }
                  hint="Call the function with your own name."
                  onRun={() => store.markSectionCompleted(MODULE_ID, 'functions')}
                  evaluateOutput={(code) => {
                    const match = code.match(/greet\(\s*["']([^"']+)["']\s*\)/);
                    const name = match ? match[1] : track === 'java' ? 'Vikram' : 'Leo';
                    return { status: 'success', text: `Hello, ${name}!` };
                  }}
                />
              )}

              {section.id === 'dataStructures' && (
                <div style={{ marginTop: '24px' }}>
                  {keyBox('Structure Lens', [
                    'Lists preserve order.',
                    'Sets remove duplicates.',
                    'Maps / objects support lookup by key.',
                  ], trackConfig.accent)}
                </div>
              )}
            </ChapterSection>
          </div>
        );
      })}
    </SWEPreReadLayout>
  );
}

export default function SWELanguageBasics({ track, level, onBack }: Props) {
  if (track === 'python') {
    return <PythonLanguageBasics onBack={onBack} />;
  }

  return <LegacyLanguageBasics track={track} level={level} onBack={onBack} />;
}

const studioButtonStyle: React.CSSProperties = {
  borderRadius: '14px',
  border: '1px solid rgba(148, 163, 184, 0.24)',
  background: '#ffffff',
  color: '#334155',
  padding: '10px 14px',
  fontSize: '14px',
  fontWeight: 800,
  cursor: 'pointer',
};

const panelStyle: React.CSSProperties = {
  borderRadius: '22px',
  background: 'rgba(255,255,255,0.9)',
  border: '1px solid rgba(148, 163, 184, 0.24)',
  padding: '18px',
};

const panelTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 900,
  color: '#0f172a',
};

const panelSubtitleStyle: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.55,
  color: '#64748b',
  marginTop: '4px',
};

const slotStyle: React.CSSProperties = {
  borderRadius: '12px',
  background: '#F8FAFC',
  border: '1px solid #E2E8F0',
  padding: '10px 12px',
  fontSize: '12px',
  color: '#334155',
  lineHeight: 1.5,
};

const compactSampleStyle: React.CSSProperties = {
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  background: 'rgba(15, 23, 42, 0.36)',
  padding: '10px 12px',
  fontSize: '12px',
  lineHeight: 1.6,
  fontFamily: "'JetBrains Mono', monospace",
};

function terminalLikeCard(background: string, border: string, text: string): React.CSSProperties {
  return {
    borderRadius: '18px',
    background,
    border: `1px solid ${border}`,
    padding: '14px',
    color: text,
    minHeight: '220px',
  };
}

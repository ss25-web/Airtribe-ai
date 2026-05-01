'use client';
import React, { useEffect, useRef, useState, CSSProperties, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import GenAIStreakCard, { GenAILatestBadgePanel } from './GenAISidebarExtras';
import QuizEngine from './QuizEngine';
import GenAIAvatar, { GenAIMentorFace, GenAIConversationScene, AaravFace, RheaFace } from './GenAIAvatar';
import type { GenAIMentorId } from './GenAIAvatar';
import type { GenAITrack } from './genaiTypes';
import {
  ApplyItBox, ChapterSection, NextChapterTeaser, PMPrincipleBox, SituationCard,
  chLabel, h2, keyBox, para, pullQuote, TiltCard,
} from './pm-fundamentals/designSystem';
import { AirtribeLogo, DarkModeToggle } from './AirtribeBrand';

const ACCENT = '#2563EB';
const ACCENT_RGB = '37,99,235';
const MODULE_NUM = '02';

// --- Data Arrays & Constants ---

const CONCEPTS = [
  { id: 'genai-m2-anatomy', label: 'Prompt Anatomy', color: '#2563EB' },
  { id: 'genai-m2-fewshot', label: 'Zero-Shot vs Few-Shot', color: '#0F766E' },
  { id: 'genai-m2-context', label: 'Context Window', color: '#7C3AED' },
  { id: 'genai-m2-models', label: 'Model Selection', color: '#C2410C' },
  { id: 'genai-m2-refine', label: 'The Refinement Loop', color: '#DB2777' },
];

const SECTIONS = [
  { id: 'genai-m2-anatomy', label: '1. The Anatomy of a Prompt' },
  { id: 'genai-m2-fewshot', label: '2. Zero-Shot vs Few-Shot' },
  { id: 'genai-m2-context', label: '3. Context Window: What Goes In Matters' },
  { id: 'genai-m2-models', label: '4. Model Selection & Cost' },
  { id: 'genai-m2-refine', label: '5. The Refinement Loop' },
];

const QUIZZES = [
  {
    conceptId: 'genai-m2-anatomy',
    question: {
      'non-tech': "Rhea's discharge summary prompt gives inconsistent tone — formal sometimes, casual others. What's the most targeted fix?",
      'tech': "Aarav's entity extraction returns incomplete JSON sometimes. What's the most targeted first fix?",
    },
    options: {
      'non-tech': [
        "A) Add 'be professional'",
        "B) Specify role: 'You are a clinical documentation assistant'",
        "C) Add more patient context",
        "D) Use a different model",
      ],
      'tech': [
        "A) Increase temperature",
        "B) Add more examples",
        "C) Define output schema in response_format",
        "D) Switch to GPT-4o",
      ],
    },
    correctIndex: { 'non-tech': 1, 'tech': 2 },
    explanation: {
      'non-tech': "Specifying the model's role provides a clear persona and tone, guiding its output more consistently than a vague instruction like 'be professional'.",
      'tech': "For structured outputs like JSON, explicitly defining the schema in the `response_format` parameter (or system message for older APIs) is crucial for consistency and completeness.",
    },
    keyInsight: "A clear role and output format are foundational for consistent prompt results.",
  },
  {
    conceptId: 'genai-m2-fewshot',
    question: {
      'non-tech': "Slightly critical feedback keeps classifying as Neutral instead of Negative. Best fix?",
      'tech': "Network connectivity tickets misclassify despite 5 examples. Most impactful fix?",
    },
    options: {
      'non-tech': [
        "A) Add more Neutral examples",
        "B) Add examples of borderline-negative labeled as Negative",
        "C) Tell the model to be stricter",
        "D) Ask model to explain its reasoning",
      ],
      'tech': [
        "A) Add more diverse examples for that category",
        "B) Fine-tune the model",
        "C) Implement RAG",
        "D) Add confidence threshold",
      ],
    },
    correctIndex: { 'non-tech': 1, 'tech': 0 },
    explanation: {
      'non-tech': "Few-shot examples are most effective when they clarify ambiguous cases. Providing examples of what *should* be negative, especially borderline ones, helps the model learn the nuanced boundary.",
      'tech': "If examples aren't working, it often means the examples themselves aren't representative enough of the real-world variations. Adding more diverse examples helps the model generalize better.",
    },
    keyInsight: "Few-shot examples teach nuance and edge cases, improving model accuracy on specific domain data.",
  },
  {
    conceptId: 'genai-m2-context',
    question: {
      'non-tech': "Summarizing hundreds of pages for specialist referral gives generic output. Best first step?",
      'tech': "RAG chatbot hallucinating with 5-7 large docs in context. Best fix?",
    },
    options: {
      'non-tech': [
        "A) Tell model to be more detailed",
        "B) Manually extract relevant sections then summarize those",
        "C) Chunk into 10-page pieces",
        "D) Request bigger context window",
      ],
      'tech': [
        "A) Summarize each retrieved doc first, then answer from summaries",
        "B) Add more docs",
        "C) Switch to GPT-4o",
        "D) Add system message saying 'only use provided context'",
      ],
    },
    correctIndex: { 'non-tech': 1, 'tech': 0 },
    explanation: {
      'non-tech': "LLMs struggle with very long contexts, often missing details in the middle. Pre-processing to extract and prioritize key information reduces noise and ensures critical details are seen.",
      'tech': "Large documents can overwhelm the context window, leading to 'lost in the middle' issues or hallucinations. Summarizing each retrieved document before feeding it to the main LLM reduces token count and improves focus.",
    },
    keyInsight: "Context window management is about strategic information delivery, not just dumping data.",
  },
  {
    conceptId: 'genai-m2-models',
    question: {
      'non-tech': "Two workflows: high-volume simple emails + low-volume complex referrals. Which model strategy?",
      'tech': "Daily reports (medium complexity, 100/day) + weekly insights (high complexity, 5/week). Budget constrained. Strategy?",
    },
    options: {
      'non-tech': [
        "A) GPT-4o for both",
        "B) Haiku for both",
        "C) Haiku for emails, GPT-4o for referrals",
        "D) Gemini Flash for both",
      ],
      'tech': [
        "A) GPT-4o for both",
        "B) GPT-3.5-turbo for daily, GPT-4o for weekly",
        "C) Haiku for both",
        "D) Gemini Flash for both",
      ],
    },
    correctIndex: { 'non-tech': 2, 'tech': 1 },
    explanation: {
      'non-tech': "Matching model capabilities to task complexity and volume is key. Haiku is cost-effective and fast for simple, high-volume tasks, while GPT-4o excels at complex reasoning for critical, lower-volume tasks.",
      'tech': "A hybrid strategy optimizes for both cost and quality. Use a more powerful model for high-value, complex tasks and a more economical model for routine, medium-complexity tasks.",
    },
    keyInsight: "Model selection is a strategic decision balancing cost, speed, and quality for specific tasks.",
  },
  {
    conceptId: 'genai-m2-refine',
    question: {
      'non-tech': "V3 consent form prompt is more concise but now omits a legal disclaimer that V1 always included. Next step?",
      'tech': "V2 improved summaries for most cases but introduced a regression for edge cases. Before deploying V3 to prod, what's critical?",
    },
    options: {
      'non-tech': [
        "A) Revert to V1",
        "B) Compare V1 and V3, identify the change, add explicit constraint",
        "C) Add 'include all legal disclaimers'",
        "D) Ask legal to simplify the disclaimer",
      ],
      'tech': [
        "A) A/B test with internal users",
        "B) Run V3 against golden dataset, compare metrics vs V1+V2",
        "C) Manually review 10-20 outputs",
        "D) Commit and push to git",
      ],
    },
    correctIndex: { 'non-tech': 1, 'tech': 1 },
    explanation: {
      'non-tech': "The refinement loop requires systematic comparison. Identifying the specific change that caused the regression allows for a targeted fix, ensuring the desired conciseness is kept while restoring the disclaimer.",
      'tech': "A golden dataset is crucial for detecting regressions. Running V3 against it and comparing performance metrics to previous versions ensures that improvements haven't come at the cost of new errors, especially for edge cases.",
    },
    keyInsight: "Prompt refinement is an iterative, data-driven process requiring version control and robust testing.",
  },
];

const BADGES = [
  { id: 'genai-m2-anatomy', icon: '🧱', label: 'Anatomy', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { id: 'genai-m2-fewshot', icon: '🎯', label: 'Few-Shot', color: '#0F766E', bg: '#ECFDF5', border: '#A7F3D0' },
  { id: 'genai-m2-context', icon: '🪟', label: 'Context', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  { id: 'genai-m2-models', icon: '⚖️', label: 'Models', color: '#C2410C', bg: '#FFF7ED', border: '#FED7AA' },
  { id: 'genai-m2-refine', icon: '🔁', label: 'Refine', color: '#DB2777', bg: '#FDF2F8', border: '#FBCFE8' },
];

const SECTION_XP = 50;
const MAX_QUIZ_XP_PER_CONCEPT = 100;

function computeXP(completedSections: Set<string>, conceptStates: Record<string, { pKnow: number }>) {
  const readingXP = completedSections.size * SECTION_XP;
  const quizXP = Object.values(conceptStates).reduce((sum, state) => sum + Math.round(state.pKnow * MAX_QUIZ_XP_PER_CONCEPT), 0);
  return { readingXP, quizXP, total: readingXP + quizXP };
}

function getLevel(total: number) {
  if (total >= 600) return { label: 'Builder', color: '#2563EB', min: 600 };
  if (total >= 350) return { label: 'Operator', color: '#0F766E', min: 350 };
  if (total >= 150) return { label: 'Explorer', color: '#7C3AED', min: 150 };
  return { label: 'Curious', color: 'var(--ed-ink3)', min: 0 };
}

function getNextLevel(total: number) {
  if (total < 150) return { label: 'Explorer', min: 150 };
  if (total < 350) return { label: 'Operator', min: 350 };
  if (total < 600) return { label: 'Builder', min: 600 };
  return null;
}

// AirtribeLogo imported from AirtribeBrand.tsx

// --- Shared Components ---

// --- Interactive Tool Components ---

const PromptBuilderTool: React.FC<{ track: GenAITrack }> = ({ track }) => {
  const [activeChips, setActiveChips] = useState<{ [key: string]: boolean }>({
    Role: false,
    Task: false,
    Context: false,
    Format: false,
    Constraints: false,
  });

  const toggleChip = (chip: string) => {
    setActiveChips((prev) => ({ ...prev, [chip]: !prev[chip] }));
  };

  const chips = ['Role', 'Task', 'Context', 'Format', 'Constraints'];

  const assembledPrompt = chips
    .filter((chip) => activeChips[chip])
    .map((chip) => {
      if (track === 'non-tech') {
        switch (chip) {
          case 'Role': return 'You are a clinical documentation assistant.';
          case 'Task': return 'Summarize the patient\'s discharge plan.';
          case 'Context': return 'Use only the provided care notes from the last 7 days.';
          case 'Format': return 'Output a bulleted list of key actions for home care.';
          case 'Constraints': return 'Ensure a professional, empathetic tone. Do not include PHI directly.';
          default: return '';
        }
      } else { // tech track
        switch (chip) {
          case 'Role': return 'System: You are an API endpoint for generating code snippets.';
          case 'Task': return 'User: Generate a Python function to parse CSV data.';
          case 'Context': return 'System: The CSV has headers. Use the `csv` module. User: Data: [CSV_DATA_HERE]';
          case 'Format': return 'System: Output only the Python code block, no explanations. User: Format: JSON with `code` field.';
          case 'Constraints': return 'System: Ensure the function handles missing values gracefully. User: Max 100 lines of code.';
          default: return '';
        }
      }
    })
    .join('\n\n');

  const qualityScore = Object.values(activeChips).filter(Boolean).length * 20;
  const qualityColor = qualityScore === 100 ? '#22C55E' : '#EAB308';

  const chipStyle: CSSProperties = {
    padding: '10px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '8px',
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
    display: 'inline-block',
    marginRight: '10px',
    fontWeight: 600,
    fontSize: '14px',
  };

  return (
    <TiltCard style={{
      background: '#0F172A',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      color: '#E2E8F0',
      maxWidth: '700px',
      margin: '0 auto',
    }}>
      <div style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 700, color: ACCENT }}>
        Assemble Your Prompt
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {chips.map((chip) => (
          <div
            key={chip}
            onClick={() => toggleChip(chip)}
            style={{
              ...chipStyle,
              backgroundColor: activeChips[chip] ? ACCENT : '#1E293B',
              border: `1px solid ${activeChips[chip] ? ACCENT : '#475569'}`,
              color: activeChips[chip] ? 'white' : '#CBD5E1',
            }}
          >
            {chip}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '8px' }}>Assembled Prompt:</div>
        <div style={{
          backgroundColor: '#1E293B',
          border: '1px solid #475569',
          borderRadius: '8px',
          padding: '15px',
          minHeight: '120px',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          fontSize: '13px',
          color: '#E2E8F0',
        }}>
          {assembledPrompt || 'Click chips above to build your prompt...'}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
        <div style={{ fontSize: '14px', color: '#94A3B8' }}>Output Quality:</div>
        <motion.div
          key={qualityScore}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: qualityColor,
            minWidth: '60px',
            textAlign: 'right',
          }}
        >
          {qualityScore}%
        </motion.div>
      </div>
    </TiltCard>
  );
};

const FewShotLabeler: React.FC<{ track: GenAITrack }> = ({ track }) => {
  const examples = [
    {
      id: 1,
      text: track === 'non-tech'
        ? "Patient's procedure was pre-authorized, but the claim was denied due to 'lack of medical necessity' by the reviewer."
        : "User reported 'cannot connect to VPN', but logs show successful authentication. Suspect local network issue.",
      label: '',
      correctLabel: track === 'non-tech' ? 'Pre-Auth - Medical Necessity' : 'Network - Local',
    },
    {
      id: 2,
      text: track === 'non-tech'
        ? "Claim for physical therapy denied as 'exceeds coverage limits' despite clear physician order for 12 sessions."
        : "Database query performance is degrading. Index rebuilds didn't help. Looking at slow query logs.",
      label: '',
      correctLabel: track === 'non-tech' ? 'Coverage Limit' : 'Database - Performance',
    },
    {
      id: 3,
      text: track === 'non-tech'
        ? "Emergency room visit for severe abdominal pain, but insurance states 'non-emergent' and denied claim."
        : "Server X is unresponsive. Ping fails. Checked power, network cable. Suspect hardware failure.",
      label: '',
      correctLabel: track === 'non-tech' ? 'Non-Emergent Denial' : 'Server - Hardware',
    },
  ];

  const labels = track === 'non-tech'
    ? ['Pre-Auth - Medical Necessity', 'Coverage Limit', 'Non-Emergent Denial', 'Billing Error']
    : ['Network - Local', 'Database - Performance', 'Server - Hardware', 'Application - Bug'];

  const [exampleStates, setExampleStates] = useState(examples);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleLabelChange = (id: number, newLabel: string) => {
    setExampleStates((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, label: newLabel } : ex))
    );
    setAccuracy(null);
    setShowResults(false);
  };

  const runClassification = () => {
    const correctCount = exampleStates.filter((ex) => ex.label === ex.correctLabel).length;
    const newAccuracy = (correctCount / examples.length) * 100;
    setAccuracy(newAccuracy);
    setShowResults(true);
  };

  const zeroShotAccuracy = 62; // Baseline

  const containerStyle: CSSProperties = {
    background: '#0F172A',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    color: '#E2E8F0',
    maxWidth: '700px',
    margin: '0 auto',
  };

  const exampleCardStyle: CSSProperties = {
    backgroundColor: '#1E293B',
    border: '1px solid #475569',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    fontSize: '14px',
    color: '#CBD5E1',
  };

  const labelSelectStyle: CSSProperties = {
    width: '100%',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #475569',
    backgroundColor: '#334155',
    color: '#E2E8F0',
    marginTop: '10px',
    fontSize: '14px',
  };

  const buttonStyle: CSSProperties = {
    backgroundColor: ACCENT,
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
    marginTop: '15px',
    transition: 'background-color 0.2s ease',
  };

  return (
    <TiltCard style={containerStyle}>
      <div style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 700, color: ACCENT }}>
        Few-Shot Classification
      </div>

      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '8px' }}>Unlabeled Examples:</div>
        {exampleStates.map((ex) => (
          <div key={ex.id} style={exampleCardStyle}>
            <p>{ex.text}</p>
            <select
              value={ex.label}
              onChange={(e) => handleLabelChange(ex.id, e.target.value)}
              style={labelSelectStyle}
            >
              <option value="">Select a label</option>
              {labels.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        onClick={runClassification}
        disabled={exampleStates.some(ex => !ex.label)}
        style={{
          ...buttonStyle,
          opacity: exampleStates.some(ex => !ex.label) ? 0.6 : 1,
          cursor: exampleStates.some(ex => !ex.label) ? 'not-allowed' : 'pointer',
        }}
      >
        Run Classification
      </button>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #475569' }}
          >
            <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '10px' }}>Classification Results:</div>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#94A3B8' }}>Zero-Shot Baseline</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#EAB308' }}>{zeroShotAccuracy}%</div>
              </div>
              <div style={{ fontSize: '30px', color: '#94A3B8' }}>→</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#94A3B8' }}>With Your Examples</div>
                <motion.div
                  key={accuracy}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ fontSize: '28px', fontWeight: 700, color: accuracy && accuracy > zeroShotAccuracy ? '#22C55E' : '#EAB308' }}
                >
                  {accuracy !== null ? `${accuracy}%` : '-'}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TiltCard>
  );
};

const ContextWindowInspector: React.FC<{ track: GenAITrack }> = ({ track }) => {
  const segmentsData = [
    { id: 's1', label: 'Intro & Patient Demographics', tokens: 200, content: track === 'non-tech' ? 'Patient: Jane Doe, 68 y.o. Admitted 2023-10-26 with pneumonia.' : 'Incident: DB outage. Server: DB01. Time: 2023-10-26 14:00 UTC.' },
    { id: 's2', label: 'Admission Notes & History', tokens: 200, content: track === 'non-tech' ? 'History of COPD, hypertension. Presented with cough, fever, dyspnea.' : 'Root cause: High CPU on DB01. Initial diagnosis: runaway query.' },
    { id: 's3', label: 'Treatment & Progress', tokens: 200, content: track === 'non-tech' ? 'Started on Azithromycin, O2 therapy. Improved respiratory status by day 3.' : 'Actions: Killed PID 12345. DB service restarted. Monitoring metrics.' },
    { id: 's4', label: 'Critical Event / Key Finding', tokens: 200, content: track === 'non-tech' ? 'NOTE: Developed acute kidney injury on day 4 due to suspected drug interaction with ACE inhibitor. ACE stopped, renal function improving.' : 'CRITICAL: During restart, data corruption detected in `user_sessions` table. Recovery from backup initiated.' },
    { id: 's5', label: 'Discharge Plan / Resolution', tokens: 200, content: track === 'non-tech' ? 'Discharge planned for 2023-11-02. Follow-up with nephrology. Home care instructions provided.' : 'Resolution: `user_sessions` restored. Service fully operational by 16:30 UTC. Post-mortem scheduled.' },
  ];

  const [includedSegments, setIncludedSegments] = useState<string[]>(segmentsData.map(s => s.id));

  const toggleSegment = (id: string) => {
    setIncludedSegments((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const totalTokens = includedSegments.reduce((sum, id) => {
    const segment = segmentsData.find(s => s.id === id);
    return sum + (segment?.tokens || 0);
  }, 0);

  const maxTokens = 1000;

  const missedInfo = segmentsData
    .filter(s => !includedSegments.includes(s.id))
    .map(s => s.content);

  const containerStyle: CSSProperties = {
    background: '#0F172A',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    color: '#E2E8F0',
    maxWidth: '700px',
    margin: '0 auto',
  };

  const segmentChipStyle: CSSProperties = {
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '8px',
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
    display: 'inline-block',
    marginRight: '10px',
    fontSize: '13px',
    fontWeight: 500,
  };

  const outputPanelStyle: CSSProperties = {
    backgroundColor: '#1E293B',
    border: '1px solid #475569',
    borderRadius: '8px',
    padding: '15px',
    minHeight: '100px',
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#E2E8F0',
    marginTop: '15px',
  };

  return (
    <TiltCard style={containerStyle}>
      <div style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 700, color: ACCENT }}>
        Context Window Inspector
      </div>

      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '8px' }}>Document Segments:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {segmentsData.map((segment) => (
            <div
              key={segment.id}
              onClick={() => toggleSegment(segment.id)}
              style={{
                ...segmentChipStyle,
                backgroundColor: includedSegments.includes(segment.id) ? ACCENT : '#1E293B',
                border: `1px solid ${includedSegments.includes(segment.id) ? ACCENT : '#475569'}`,
                color: includedSegments.includes(segment.id) ? 'white' : '#CBD5E1',
              }}
            >
              {segment.label} ({segment.tokens} tokens)
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingTop: '10px', borderTop: '1px solid #475569' }}>
        <div style={{ fontSize: '14px', color: '#94A3B8' }}>Tokens in Context:</div>
        <motion.div
          key={totalTokens}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: totalTokens > maxTokens ? '#EF4444' : '#22C55E',
          }}
        >
          {totalTokens} / {maxTokens}
        </motion.div>
      </div>

      <div>
        <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '8px' }}>
          What the Model Might Miss (Excluded Context):
        </div>
        <div style={outputPanelStyle}>
          <AnimatePresence mode="wait">
            {missedInfo.length > 0 ? (
              <motion.div
                key="missed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {missedInfo.map((info, i) => (
                  <p key={i} style={{ marginBottom: '8px' }}>
                    <span style={{ color: '#EF4444', fontWeight: 600 }}>[MISSED]</span> {info}
                  </p>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="all-included"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ color: '#22C55E' }}
              >
                All relevant context is included.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TiltCard>
  );
};

const ModelSelectorTool: React.FC<{ track: GenAITrack }> = ({ track }) => {
  type Model = 'GPT-4o' | 'Claude Haiku' | 'Gemini Flash';
  type TaskType = 'summarization' | 'classification' | 'complex_reasoning';

  const models = {
    'GPT-4o': { cost: 5, speed: 'Fast', quality: { summarization: 90, classification: 95, complex_reasoning: 98 } }, // per 1M tokens
    'Claude Haiku': { cost: 0.25, speed: 'Very Fast', quality: { summarization: 85, classification: 92, complex_reasoning: 80 } },
    'Gemini Flash': { cost: 0.35, speed: 'Very Fast', quality: { summarization: 88, classification: 90, complex_reasoning: 85 } },
  };

  const tasks: { id: string; label: string; type: TaskType; volume: number; optimalModel: Model }[] = [
    {
      id: 'task1',
      label: track === 'non-tech' ? 'High-volume intake form summarization' : 'Daily log anomaly detection',
      type: 'summarization',
      volume: 200, // per day
      optimalModel: 'Claude Haiku',
    },
    {
      id: 'task2',
      label: track === 'non-tech' ? 'Insurance exception classification' : 'IT ticket routing',
      type: 'classification',
      volume: 100, // per day
      optimalModel: 'Claude Haiku',
    },
    {
      id: 'task3',
      label: track === 'non-tech' ? 'Complex patient care plan generation' : 'Root cause analysis for critical incidents',
      type: 'complex_reasoning',
      volume: 5, // per day
      optimalModel: 'GPT-4o',
    },
  ];

  const [selectedModels, setSelectedModels] = useState<{ [key: string]: Model }>(
    Object.fromEntries(tasks.map(task => [task.id, 'GPT-4o']))
  );

  const handleModelChange = (taskId: string, model: Model) => {
    setSelectedModels((prev) => ({ ...prev, [taskId]: model }));
  };

  const calculateMonthlyCost = () => {
    let totalCost = 0;
    tasks.forEach(task => {
      const model = selectedModels[task.id];
      const modelCostPer1M = models[model].cost; // Cost per 1M tokens
      const dailyVolume = task.volume;
      // Assuming average 2k tokens per interaction (input+output) for simplicity
      // 2k tokens * dailyVolume * 30 days / 1,000,000 tokens * modelCostPer1M
      totalCost += (2000 * dailyVolume * 30 / 1_000_000) * modelCostPer1M;
    });
    return totalCost;
  };

  const totalMonthlyCost = calculateMonthlyCost();

  const containerStyle: CSSProperties = {
    background: '#0F172A',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    color: '#E2E8F0',
    maxWidth: '700px',
    margin: '0 auto',
  };

  const taskCardStyle: CSSProperties = {
    backgroundColor: '#1E293B',
    border: '1px solid #475569',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
  };

  const selectStyle: CSSProperties = {
    width: '100%',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #475569',
    backgroundColor: '#334155',
    color: '#E2E8F0',
    marginTop: '10px',
    fontSize: '14px',
  };

  const modelInfoStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#94A3B8',
    marginTop: '5px',
  };

  return (
    <TiltCard style={containerStyle}>
      <div style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 700, color: ACCENT }}>
        Model Selection & Cost Estimator
      </div>

      {tasks.map((task) => {
        const selectedModel = selectedModels[task.id];
        const modelData = models[selectedModel];
        const isOptimal = selectedModel === task.optimalModel;

        return (
          <div key={task.id} style={taskCardStyle}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#CBD5E1', marginBottom: '8px' }}>
              {task.label} <span style={{ fontSize: '12px', color: '#94A3B8' }}>({task.volume}/day)</span>
            </div>
            <select
              value={selectedModel}
              onChange={(e) => handleModelChange(task.id, e.target.value as Model)}
              style={selectStyle}
            >
              {Object.keys(models).map((modelName) => (
                <option key={modelName} value={modelName}>
                  {modelName}
                </option>
              ))}
            </select>
            <div style={modelInfoStyle}>
              <span>Cost: ~${modelData.cost.toFixed(2)}/1M tokens</span>
              <span>Speed: {modelData.speed}</span>
              <span>Quality: {modelData.quality[task.type]}%</span>
            </div>
            {isOptimal && (
              <div style={{ fontSize: '12px', color: '#22C55E', marginTop: '5px', fontWeight: 600 }}>
                Optimal choice for this task!
              </div>
            )}
          </div>
        );
      })}

      <div style={{
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid #475569',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '16px', fontWeight: 600, color: '#CBD5E1' }}>Estimated Monthly Cost:</div>
        <motion.div
          key={totalMonthlyCost}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ fontSize: '28px', fontWeight: 700, color: totalMonthlyCost < 1000 ? '#22C55E' : '#EAB308' }}
        >
          ${totalMonthlyCost.toFixed(2)}
        </motion.div>
      </div>
    </TiltCard>
  );
};

const PromptDiffViewer: React.FC<{ track: GenAITrack }> = ({ track }) => {
  const [version, setVersion] = useState(1);

  const prompts = {
    v1: {
      text: track === 'non-tech'
        ? "Write a discharge summary for this patient."
        : "Summarize incident report.",
      output: track === 'non-tech'
        ? "Patient was discharged. They should follow up with their doctor. Take medications as prescribed. (Vague, misses key details)"
        : "The system had an issue. It was fixed. (Generic, lacks specifics)",
    },
    v2: {
      text: track === 'non-tech'
        ? `You are a clinical documentation assistant. Summarize the patient's discharge plan from the provided care notes. Output a bulleted list of key actions for home care. Ensure a professional, empathetic tone.`
        : `System: You are an API endpoint for generating structured summaries.
User: Summarize the incident report.
System: Output a JSON object with fields: 'incident_id', 'root_cause', 'resolution_steps', 'impact'.`,
      output: track === 'non-tech'
        ? "• Patient discharged on 2023-11-02.\n• Follow up with nephrology within 2 weeks.\n• Continue Azithromycin for 5 days. (Better, but still misses AKI context)"
        : `{ "incident_id": "INC-2023-10-26-001", "root_cause": "Runaway query on DB01", "resolution_steps": ["Killed PID 12345", "Restarted DB service"], "impact": "Partial service degradation for 2.5 hours." } (Structured, but misses data corruption detail)`,
    },
    v3: {
      text: track === 'non-tech'
        ? `You are a clinical documentation assistant. Summarize the patient's discharge plan from the provided care notes (last 7 days only). Output a bulleted list of key actions for home care. Ensure a professional, empathetic tone.
Example: For a patient with AKI, include specific dietary restrictions and follow-up with nephrology.`
        : `System: You are an API endpoint for generating structured summaries.
User: Summarize the incident report.
System: Output a JSON object with fields: 'incident_id', 'root_cause', 'resolution_steps', 'impact', 'data_integrity_status'.
Example: If 'data corruption detected', set 'data_integrity_status' to 'Compromised, restored from backup'.`,
      output: track === 'non-tech'
        ? "• Patient discharged on 2023-11-02.\n• Follow up with nephrology within 2 weeks for AKI management.\n• Continue Azithromycin for 5 days.\n• Dietary restrictions: low sodium, monitor fluid intake. (Comprehensive, includes AKI specifics)"
        : `{ "incident_id": "INC-2023-10-26-001", "root_cause": "Runaway query on DB01", "resolution_steps": ["Killed PID 12345", "Restarted DB service", "Restored user_sessions table"], "impact": "Partial service degradation for 2.5 hours.", "data_integrity_status": "Compromised, restored from backup" } (Complete, includes critical data integrity info)`,
    },
  };

  const currentPrompt = prompts[`v${version}` as keyof typeof prompts].text;
  const currentOutput = prompts[`v${version}` as keyof typeof prompts].output;

  const getDiff = (prev: string, current: string) => {
    const prevLines = prev.split('\n');
    const currentLines = current.split('\n');
    const diff: { type: 'added' | 'removed' | 'unchanged'; text: string }[] = [];

    // Simple line-by-line diff for illustration
    const maxLength = Math.max(prevLines.length, currentLines.length);
    for (let i = 0; i < maxLength; i++) {
      const prevLine = prevLines[i];
      const currentLine = currentLines[i];

      if (prevLine === currentLine) {
        diff.push({ type: 'unchanged', text: currentLine });
      } else {
        if (prevLine !== undefined && !currentLines.includes(prevLine)) {
          diff.push({ type: 'removed', text: prevLine });
        }
        if (currentLine !== undefined && !prevLines.includes(currentLine)) {
          diff.push({ type: 'added', text: currentLine });
        } else if (currentLine !== undefined && prevLines.includes(currentLine) && prevLine !== currentLine) {
          // If line changed but exists in both, treat as changed (simplified)
          diff.push({ type: 'unchanged', text: currentLine });
        }
      }
    }
    return diff.filter(d => d.text !== undefined);
  };

  const diffOutput = version > 1 ? getDiff(prompts[`v${version - 1}` as keyof typeof prompts].text, currentPrompt) : [{ type: 'unchanged', text: currentPrompt }];

  const containerStyle: CSSProperties = {
    background: '#0F172A',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    color: '#E2E8F0',
    maxWidth: '700px',
    margin: '0 auto',
  };

  const promptBoxStyle: CSSProperties = {
    backgroundColor: '#1E293B',
    border: '1px solid #475569',
    borderRadius: '8px',
    padding: '15px',
    minHeight: '150px',
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#E2E8F0',
    marginBottom: '15px',
  };

  const outputBoxStyle: CSSProperties = {
    ...promptBoxStyle,
    minHeight: '100px',
    backgroundColor: '#1E293B',
  };

  const buttonStyle: CSSProperties = {
    backgroundColor: ACCENT,
    color: 'white',
    padding: '8px 15px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    margin: '0 5px',
    transition: 'background-color 0.2s ease',
  };

  return (
    <TiltCard style={containerStyle}>
      <div style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 700, color: ACCENT }}>
        Prompt Refinement Loop
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setVersion(1)}
          style={{ ...buttonStyle, backgroundColor: version === 1 ? ACCENT : '#334155' }}
        >
          Version 1
        </button>
        <button
          onClick={() => setVersion(2)}
          style={{ ...buttonStyle, backgroundColor: version === 2 ? ACCENT : '#334155' }}
        >
          Version 2
        </button>
        <button
          onClick={() => setVersion(3)}
          style={{ ...buttonStyle, backgroundColor: version === 3 ? ACCENT : '#334155' }}
        >
          Version 3
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '8px' }}>Current Prompt (v{version}):</div>
        <div style={promptBoxStyle}>
          <AnimatePresence mode="wait">
            <motion.div
              key={version}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {diffOutput.map((line, i) => (
                <span key={i} style={{
                  color: line.type === 'added' ? '#22C55E' : (line.type === 'removed' ? '#EF4444' : '#E2E8F0'),
                  textDecoration: line.type === 'removed' ? 'line-through' : 'none',
                  display: 'block',
                }}>
                  {line.text}
                </span>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '8px' }}>Model Output:</div>
        <div style={outputBoxStyle}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`output-${version}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentOutput}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </TiltCard>
  );
};

// --- Track Meta ---

const TRACK_META: Record<GenAITrack, { label: string; introTitle: string; moduleContext: string }> = {
  'non-tech': {
    label: 'Workflow & Operator Track',
    introTitle: 'Prompt Engineering · Operator Lens',
    moduleContext: `GenAI Launchpad · Non-Tech Track · Pre-Read 02 · Prompt Engineering & LLM Foundations. Follows Rhea, an operations lead at Northstar Health, as she moves from inconsistent AI outputs to reliable, structured prompts — mastering prompt anatomy, few-shot examples, context management, model selection, and iterative refinement.`,
  },
  tech: {
    label: 'Tech Builder Track',
    introTitle: 'Prompt Engineering · Builder Lens',
    moduleContext: `GenAI Launchpad · Tech Track · Pre-Read 02 · Prompt Engineering & LLM Foundations. Follows Aarav, a platform engineer at Northstar Health, as he moves from unpredictable API responses to production-grade prompt engineering — covering system messages, response_format constraints, token budgets, model routing, and prompt versioning.`,
  },
};

// --- Left Nav ---

function LeftNav({ completedSections, activeSection, track }: { completedSections: Set<string>; activeSection: string | null; track: GenAITrack }) {
  const donePct = Math.round((completedSections.size / SECTIONS.length) * 100);
  return (
    <aside style={{ position: 'sticky', top: '80px', alignSelf: 'start' }}>
      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '18px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid var(--ed-rule)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ed-ink3)', marginBottom: '8px' }}>Contents</div>
          <div style={{ height: '2px', background: 'var(--ed-rule)', borderRadius: '1px', overflow: 'hidden' }}>
            <motion.div style={{ height: '100%', background: ACCENT }} animate={{ width: `${donePct}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '6px' }}>{donePct}% · {completedSections.size}/{SECTIONS.length} parts</div>
        </div>
        <nav>
          {SECTIONS.map((section, idx) => {
            const done = completedSections.has(section.id);
            const active = activeSection === section.id && !done;
            return (
              <motion.button
                key={section.id}
                onClick={() => document.querySelector(`[data-section="${section.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                whileHover={{ x: 2 }}
                style={{ display: 'flex', alignItems: 'baseline', gap: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', textAlign: 'left', borderLeft: active ? `2px solid ${ACCENT}` : '2px solid transparent', paddingLeft: '8px', marginLeft: '-8px' }}
              >
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: done || active ? ACCENT : 'var(--ed-rule)', minWidth: '20px' }}>{String(idx + 1).padStart(2, '0')}.</span>
                <span style={{ fontSize: '12px', fontWeight: active ? 600 : 400, color: done ? 'var(--ed-ink2)' : active ? 'var(--ed-ink)' : 'var(--ed-ink3)', lineHeight: 1.4 }}>{section.label}{done ? ' ✓' : ''}</span>
              </motion.button>
            );
          })}
        </nav>
        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--ed-rule)', fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>
          Week 0 pre-read · {TRACK_META[track].label}
        </div>
      </div>
    </aside>
  );
}

// --- Sidebar ---

function Sidebar({ completedSections, progressPct, prevXp }: { completedSections: Set<string>; progressPct: number; prevXp: number }) {
  const store = useLearnerStore();
  const xp = computeXP(completedSections, store.conceptStates);
  const total = xp.total;
  const level = getLevel(total);
  const nextLvl = getNextLevel(total);
  const levelPct = nextLvl ? Math.round(((total - level.min) / (nextLvl.min - level.min)) * 100) : 100;
  const [showGain, setShowGain] = useState(false);
  const [gainAmt, setGainAmt] = useState(0);
  const gainRef = useRef(prevXp);

  useEffect(() => {
    const diff = total - gainRef.current;
    if (diff > 0) {
      setGainAmt(diff);
      setShowGain(true);
      gainRef.current = total;
      const timer = setTimeout(() => setShowGain(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [total]);

  return (
    <aside style={{ position: 'sticky', top: '80px', alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderTop: `3px solid ${ACCENT}`, borderRadius: '10px', padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ed-ink3)', marginBottom: '2px' }}>Level</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: level.color }}>{level.label}</div>
          </div>
          <div style={{ textAlign: 'right', position: 'relative' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ed-ink3)', marginBottom: '2px' }}>XP</div>
            <motion.div key={total} animate={{ scale: [1.12, 1] }} transition={{ duration: 0.25 }} style={{ fontSize: '22px', fontWeight: 900, color: ACCENT, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{total}</motion.div>
            <AnimatePresence>{showGain ? <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -20 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} style={{ position: 'absolute', right: 0, top: '-6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: '#0D7A5A' }}>+{gainAmt}</motion.div> : null}</AnimatePresence>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
          <div style={{ flex: 1, padding: '5px 8px', borderRadius: '5px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
            <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', marginBottom: '2px', textTransform: 'uppercase' }}>Reading</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: ACCENT }}>{xp.readingXP} xp</div>
          </div>
          <div style={{ flex: 1, padding: '5px 8px', borderRadius: '5px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
            <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', marginBottom: '2px', textTransform: 'uppercase' }}>Quizzes</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0D7A5A' }}>{xp.quizXP} xp</div>
          </div>
        </div>
        {nextLvl ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{levelPct}% to {nextLvl.label}</span>
              <span style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>{nextLvl.min - total} xp</span>
            </div>
            <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${levelPct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: ACCENT, borderRadius: '2px' }} />
            </div>
          </>
        ) : <div style={{ fontSize: '11px', color: ACCENT, fontWeight: 700 }}>✦ Max level reached</div>}
      </div>

      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)' }}>Module Progress</div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: ACCENT }}>{progressPct}%</span>
        </div>
        <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
          <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: ACCENT, borderRadius: '2px' }} />
        </div>
        <div style={{ marginTop: '6px', fontSize: '10px', color: 'var(--ed-ink3)' }}>{completedSections.size} of {SECTIONS.length} parts · 20 min</div>
      </div>

      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ed-ink3)' }}>Badges</div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{completedSections.size}/{BADGES.length}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {BADGES.map((badge) => {
            const unlocked = completedSections.has(badge.id);
            return (
              <div key={badge.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: unlocked ? badge.bg : 'var(--ed-cream)', border: `1px solid ${unlocked ? badge.border : 'var(--ed-rule)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: 800, color: unlocked ? badge.color : 'var(--ed-ink3)', filter: unlocked ? 'none' : 'grayscale(1) opacity(0.35)', boxShadow: unlocked ? `0 6px 16px ${badge.color}22` : 'none' }}>{badge.icon}</div>
                <div style={{ fontSize: '8px', color: unlocked ? 'var(--ed-ink3)' : 'transparent', fontWeight: 600, textAlign: 'center', maxWidth: '40px', lineHeight: 1.2 }}>{badge.label}</div>
              </div>
            );
          })}
        </div>
        <GenAILatestBadgePanel badges={BADGES} completedSections={completedSections} />
      </div>

      <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderLeft: `3px solid ${ACCENT}`, borderRadius: '10px', padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: ACCENT, marginBottom: '10px' }}>Concept Mastery</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {CONCEPTS.map((concept) => {
            const state = store.conceptStates[concept.id];
            const pct = state ? Math.round(state.pKnow * 100) : 0;
            return (
              <div key={concept.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--ed-ink2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{concept.label}</span>
                  <span style={{ fontSize: '10px', color: pct > 0 ? concept.color : 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{pct}%</span>
                </div>
                <div style={{ height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: concept.color, borderRadius: '2px' }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: '10px', fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>Complete quizzes and mentor checks to raise mastery scores</div>
      </div>
      <GenAIStreakCard />
    </aside>
  );
}

// --- Main Content Component ---

function CoreContent({ track, completedSections, activeSection }: { track: GenAITrack; completedSections: Set<string>; activeSection: string | null }) {
  const nextSection = SECTIONS.find(s => !completedSections.has(s.id));
  const moduleContext = TRACK_META[track].moduleContext;


  return (
    <>
      {/* Module Hero */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', marginBottom: '28px' }}>
      <div style={{ flex: 1, minWidth: 0, background: 'var(--ed-cream)', borderRadius: '14px', padding: '36px 36px 28px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', right: '-12px', top: '-8px', fontSize: '140px', fontWeight: 700, lineHeight: 1, color: `rgba(${ACCENT_RGB},0.05)`, fontFamily: "\'Lora\',\'Georgia\',serif", letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>02</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "\'JetBrains Mono\', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: ACCENT, marginBottom: '10px', textTransform: 'uppercase' as const }}>GenAI Launchpad · Pre-Read 02</div>
          <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.025em', color: 'var(--ed-ink)', marginBottom: '10px', fontFamily: "\'Lora\', Georgia, serif" }}>Getting the Model to Do What You Mean</h1>
          <p style={{ fontSize: '15px', color: 'var(--ed-ink3)', fontStyle: 'italic', fontFamily: "\'Lora\', Georgia, serif", marginBottom: '28px' }}>&ldquo;A prompt is a specification. Vague specs produce vague outputs.&rdquo;</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const, marginBottom: '24px' }}>
            <div style={{ background: track === 'tech' ? 'rgba(15,118,110,0.08)' : `rgba(${ACCENT_RGB},0.08)`, border: `1.5px solid ${track === 'tech' ? 'rgba(15,118,110,0.3)' : `rgba(${ACCENT_RGB},0.3)`}`, borderRadius: '10px', padding: '14px 16px', flex: '1.5', minWidth: '180px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                {track === 'tech' ? <AaravFace size={44} /> : <RheaFace size={44} />}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: track === 'tech' ? '#0F766E' : ACCENT }}>{track === 'tech' ? 'Aarav' : 'Rhea'}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '9px', color: 'var(--ed-ink3)', letterSpacing: '0.04em' }}>{track === 'tech' ? 'Platform Engineer · Northstar Health' : 'Operations Lead · Northstar Health'}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontFamily: "\'JetBrains Mono\', monospace", fontSize: '8px', fontWeight: 700, color: track === 'tech' ? '#0F766E' : ACCENT, background: track === 'tech' ? 'rgba(15,118,110,0.1)' : `rgba(${ACCENT_RGB},0.1)`, padding: '2px 7px', borderRadius: '4px', letterSpacing: '0.06em' }}>PROTAGONIST</div>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{track === 'tech' ? "LLM integration is working in dev — unpredictable in staging. Time to treat prompts like code." : "Discharge summaries are good half the time. She needs to understand why, and fix it."}</div>
            </div>
            {([
              { name: 'Anika', role: 'AI Workflow Strategist', desc: 'Asks what spec the model was given before debugging the model.', color: '#7C3AED', mentorId: 'anika' as const },
              { name: 'Kabir', role: 'Operations Intelligence', desc: 'Distinguishes what few-shot examples teach vs what you think they teach.', color: '#0F766E', mentorId: 'kabir' as const },
              { name: 'Leela', role: 'Risk & Compliance', desc: 'First to flag when a prompt refinement introduces a safety regression.', color: '#C2410C', mentorId: 'leela' as const },
            ] as const).map(m => (
              <div key={m.name} style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '12px 14px', flex: '1', minWidth: '130px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <GenAIMentorFace mentor={m.mentorId} size={34} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '12px', color: m.color, lineHeight: 1.2 }}>{m.name}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'var(--ed-ink3)', letterSpacing: '0.03em' }}>{m.role}</div>
                  </div>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.5, fontStyle: 'italic' }}>{m.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--ed-card)', borderRadius: '8px', padding: '16px 20px', border: '1px solid var(--ed-rule)', borderLeft: `3px solid ${ACCENT}` }}>
            <div style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', marginBottom: '10px', textTransform: 'uppercase' as const }}>Learning Objectives</div>
            {[
              'Understand the five anatomy components of a reliable prompt',
              'Use zero-shot and few-shot examples to inject domain knowledge',
              'Manage context windows so critical information reaches the model',
              'Select models based on task complexity, volume, and cost',
              'Build an iterative refinement loop with version control and regression testing',
            ].map((obj, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: i < 4 ? '8px' : 0, alignItems: 'flex-start' }}>
                <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, fontSize: '11px', fontFamily: "\'JetBrains Mono\', monospace", marginTop: '2px' }}>0{i + 1}</span>
                <span style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ flexShrink: 0, width: '162px', paddingTop: '8px' }}>
        <div className="float3d" style={{ background: 'linear-gradient(145deg, #0F0A1E 0%, #1A0F2E 100%)', borderRadius: '14px', padding: '18px 16px', boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT, marginBottom: '10px' }}>MODULE 02</div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#F0E8D8', fontFamily: "'Lora', serif", lineHeight: 1.25, marginBottom: '4px' }}>Prompting the Model</div>
          <div style={{ fontSize: '9px', color: 'rgba(240,232,216,0.45)', marginBottom: '14px' }}>GenAI Launchpad</div>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '12px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px' }}>
            {SECTIONS.map((s, i) => {
              const done = completedSections.has(s.id);
              const active = activeSection === s.id;
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0, background: done ? '#22C55E' : active ? ACCENT : 'rgba(255,255,255,0.06)', border: `1px solid ${done ? '#22C55E' : active ? ACCENT : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: done || active ? '#fff' : 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, transition: 'all 0.3s' }}>{done ? '✓' : `0${i + 1}`}</div>
                  <div style={{ fontSize: '8px', color: done ? 'rgba(240,232,216,0.55)' : active ? 'rgba(240,232,216,0.95)' : 'rgba(240,232,216,0.3)', lineHeight: 1.3, flex: 1, transition: 'color 0.3s' }}>{s.label.replace(/^\d+\.\s+/, '')}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: '12px', padding: '7px 10px', borderRadius: '6px', background: `${ACCENT}22`, border: `1px solid ${ACCENT}44` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '7px', color: ACCENT, fontWeight: 700, marginBottom: '2px' }}>{nextSection ? 'NEXT UP' : 'COMPLETE ✓'}</div>
            <div style={{ fontSize: '8px', color: 'rgba(240,232,216,0.6)' }}>{nextSection ? nextSection.label.replace(/^\d+\.\s+/, '') : 'All sections read!'}</div>
          </div>
        </div>
      </div>
      </div>

      <div style={{ marginBottom: '10px', padding: '16px 20px', borderRadius: '10px', background: track === 'tech' ? 'rgba(15,118,110,0.08)' : `rgba(${ACCENT_RGB},0.08)`, border: `1px solid ${track === 'tech' ? 'rgba(15,118,110,0.18)' : `rgba(${ACCENT_RGB},0.18)`}` }}>
        <div style={{ fontFamily: "\'JetBrains Mono\', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: track === 'tech' ? '#0F766E' : ACCENT, marginBottom: '8px' }}>{TRACK_META[track].label.toUpperCase()}</div>
        <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>{track === 'tech' ? "Your lens: how do you write prompts that behave like production code — predictable, testable, safe to iterate on?" : "Your lens: how do you translate a fuzzy operational requirement into a prompt that gives consistent, trustworthy outputs every time?"}</div>
      </div>

      <ChapterSection id="genai-m2-anatomy" num="01" accentRgb={ACCENT_RGB} first>
        {chLabel('Prompt Engineering & LLM Foundations')}
        {para(track === 'tech'
          ? "In Pre-Read 01, Aarav built the mental model: GenAI completes, it does not retrieve; tasks have zones; outputs are bounded by context quality. That foundation is necessary but not sufficient. The gap between knowing what a prompt should do and writing one that reliably does it is where most integrations fail. This pre-read goes inside the call — the system message, the few-shot examples, the context budget, the model choice, the versioning discipline. Each section is a lever Aarav can pull on the ticket classifier, the incident summariser, or any LLM call his team ships."
          : "In Pre-Read 01, Rhea built the mental model: the model generates, it does not look things up; tasks belong in zones; a vague brief gives the model permission to choose everything. That understanding changes how you think about AI failures. This pre-read is about what to actually do about them — how to write prompts that stop being inconsistent, how to teach the model your domain, how to manage what it can see, how to pick the right model, and how to change prompts without breaking what works."
        )}
        {h2("The Anatomy of a Prompt")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can write a system message and user message that specify all five anatomy components for any LLM call — and annotate which component each line is doing."
          : "\u25b6 After this section, you can write a complete, structured prompt for your most-used AI task, with role, format, and constraints all explicitly specified."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'non-tech'
            ? <>Rhea&apos;s first discharge summary prompt: &ldquo;Write a discharge summary for this patient.&rdquo; The outputs are wildly inconsistent &mdash; sometimes complete, sometimes missing critical medications. Her instinct is that the model is bad. Anika has a different diagnosis: the prompt is a vague brief.</>
            : <>Aarav&apos;s first API call for entity extraction: just the raw user message, no system prompt, no output format. The result is verbose, occasionally hallucinated, and unpredictable in structure. He runs it again with the same input and gets a different response. Rohan points to the missing output contract instead.</>}
        </SituationCard>
        {para(track === 'non-tech'
          ? "A prompt is not a question — it is a specification. When Rhea writes 'Write a discharge summary', she has specified nothing. The model fills every unspecified dimension with its own defaults: tone, length, what to include."
          : "Without a system message, the model has no persona, no role constraints, no output contract. It behaves like a general-purpose chatbot. Aarav's extraction task needs the model to behave like a structured API endpoint — that requires an explicit specification."
        )}
        {para(track === 'non-tech'
          ? "The five anatomy components: Role (who the model should act as), Task (what it needs to do), Context (what information to use), Format (how the output should be structured), Constraints (rules, tone, exclusions). Each component eliminates a dimension of variance."
          : "The five components map to API parameters: System Message (role, scope, instructions), User Message (specific task + input data), Context Payload, Response Format (JSON schema, markdown), Parameters (temperature, max_tokens). Together they define a deterministic contract."
        )}
        {pullQuote("A vague brief produces a vague output. The model is not failing — you are underspecifying.")}
        {track === 'non-tech' ? keyBox("What Rhea\u2019s discharge summary prompt looks like assembled", [
          'SYSTEM: You are a clinical documentation specialist at Northstar Health. Write in formal clinical register. Do not speculate beyond the information provided. If a field is missing from the record, write \u201cnot documented\u201d — do not infer.',
          'USER: Write a discharge summary for the patient below. Include these sections in order: (1) Primary diagnosis, (2) Medications prescribed — name, dose, and frequency for each, (3) Follow-up appointments with dates and department, (4) Restrictions or instructions. Maximum 200 words total.',
          '[Patient record inserted here]',
          '———',
          '\u2192 Role: \u201cclinical documentation specialist\u201d — anchors tone, register, and persona.',
          '\u2192 Constraint: \u201cdo not speculate\u201d — prevents the model filling in missing fields with plausible guesses.',
          '\u2192 Format: four numbered sections in a fixed order — eliminates structural variance across runs.',
          '\u2192 Length: 200-word cap — eliminates length variance.',
          '\u2192 Context: patient record is inserted at runtime, not typed manually each time.',
        ], ACCENT) : keyBox("What Aarav\u2019s entity extraction prompt looks like assembled", [
          'SYSTEM: You are a structured data extraction API. Return only valid JSON matching the schema below. Never include explanation, prose, or keys not in the schema.',
          'Schema: { "category": "hardware | software | network | access | other", "urgency": "low | medium | high", "callback_required": true | false, "summary": "<one sentence, max 20 words>" }',
          'USER: Extract the required fields from the support ticket below.',
          '[Ticket text inserted here]',
          '———',
          '\u2192 Role: \u201cstructured data extraction API\u201d — signals JSON-only output, no prose.',
          '\u2192 Output schema: defined explicitly — model cannot invent new fields or omit required ones.',
          '\u2192 Constraint: \u201cnever include explanation\u201d — prevents model adding context outside the JSON structure.',
          '\u2192 Enum values listed: model selects from defined options instead of generating free-form categories.',
          '\u2192 Context: ticket text inserted at runtime via placeholder.',
        ], ACCENT)}
        <PromptBuilderTool track={track} />
        <GenAIConversationScene
          mentor={track === 'non-tech' ? 'anika' : 'rohan'}
          track={track}
          accent={track === 'non-tech' ? '#7C3AED' : '#2563EB'}
          techLines={[
            { speaker: 'protagonist', text: "Entity extraction is returning incomplete JSON on about 1-in-4 calls. I\u2019ve been varying the phrasing." },
            { speaker: 'mentor', text: "Before you touch the phrasing — is the output schema defined anywhere in the system message?" },
            { speaker: 'protagonist', text: "It\u2019s in the user message as an instruction, not a formal schema." },
            { speaker: 'mentor', text: "An instruction leaves interpretation room. A schema doesn\u2019t. Define the output contract and the model stops guessing what to include." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "My discharge summaries vary wildly in tone. Sometimes clinical, sometimes conversational. I\u2019ve tried different phrasings." },
            { speaker: 'mentor', text: "Before reaching for a different model — what exactly is specified in your prompt, and what\u2019s left open?" },
            { speaker: 'protagonist', text: "I specify the task and the length. But not a role or a format." },
            { speaker: 'mentor', text: "Tone is one of the dimensions you left open. \u2018You are a clinical documentation specialist\u2019 at the top is the single highest-leverage change you can make." },
          ]}
        />
        <GenAIAvatar
          name={track === 'non-tech' ? 'Anika' : 'Rohan'}
          nameColor={track === 'non-tech' ? '#7C3AED' : '#2563EB'}
          borderColor={track === 'non-tech' ? '#7C3AED' : '#2563EB'}
          conceptId="genai-m2-anatomy"
          content={<>{track === 'non-tech' ? "Before reaching for a different model, ask: what exactly was specified, and what was left open?" : "Every prompt you write is an API contract. If you wouldn\u2019t ship an API without a response schema, don\u2019t ship a prompt without an output format."}</>}
          expandedContent={track === 'non-tech' ? "Consistency isn't a model capability — it's a prompt property. A well-specified prompt will outperform a vague prompt on a much stronger model." : "System messages are your configuration layer. Treat them with the same discipline as service configuration — version-controlled, reviewed, tested."}
          question={track === 'non-tech' ? "Rhea\u2019s discharge summaries vary wildly in tone. What single prompt change has the most impact?" : "Aarav\u2019s entity extraction returns incomplete JSON on 1 in 4 calls. Best targeted fix?"}
          options={track === 'non-tech' ? [
            { text: "Add \u2018use professional language\u2019 at the end of the prompt", correct: false, feedback: "Vague style instructions don\u2019t anchor tone — the model interprets them differently each run." },
            { text: "Open with \u2018You are a clinical documentation assistant\u2019", correct: true, feedback: "A role declaration anchors persona, tone, and vocabulary. It\u2019s the highest-leverage single change." },
            { text: "Add five example sentences showing the preferred tone", correct: false, feedback: "Examples help, but a role declaration is a higher-leverage starting point." },
            { text: "Use a more capable model that defaults to formal clinical register", correct: false, feedback: "Model capability doesn\u2019t determine register when no role is specified — a stronger model still defaults to its own judgment about tone. The role declaration is what anchors it." },
          ] : [
            { text: "Increase temperature to get more varied outputs to choose from", correct: false, feedback: "Higher temperature increases randomness — the opposite of what structured extraction needs." },
            { text: "Define the output schema in response_format or the system message", correct: true, feedback: "An explicit schema tells the model exactly what fields to populate, eliminating structural guesswork." },
            { text: "Add a retry loop to discard malformed responses", correct: false, feedback: "Retries treat the symptom, not the cause. Define the output contract instead." },
            { text: "Add more JSON examples to the user message to show the model the expected format", correct: false, feedback: "Examples reinforce the schema but don\u2019t replace it. Without a schema constraint, the model can still invent fields or omit required ones. Define the schema in the system message first." },
          ]}
        />
        <ApplyItBox prompt={track === 'tech' ? "Look at your last LLM API call. Which of the five anatomy components are missing? Add a system message with role + output format constraint and compare the output." : "Find a prompt your team uses that gives inconsistent results. Identify the missing anatomy components and add them one at a time."} />
        <QuizEngine
          conceptId="genai-m2-anatomy"
          conceptName="Prompt Anatomy"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m2-anatomy',
            question: QUIZZES[0].question[track],
            options: QUIZZES[0].options[track],
            correctIndex: QUIZZES[0].correctIndex[track],
            explanation: QUIZZES[0].explanation[track],
            keyInsight: QUIZZES[0].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Aarav now has a structured prompt. But the model still lacks Northstar\u2019s domain knowledge. Next: how to transfer that knowledge without fine-tuning." : "Rhea\u2019s prompts are now structured. But the model still misclassifies her domain-specific insurance categories. Next: how to teach it her domain."} />
      </ChapterSection>

      <ChapterSection id="genai-m2-fewshot" num="02" accentRgb={ACCENT_RGB}>
        {chLabel('Zero-Shot vs Few-Shot')}
        {h2("Examples don\u2019t clarify — they transfer domain knowledge.")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can identify which category in a classifier needs boundary examples, write those examples using a repeatable process, and know when to stop adding them."
          : "\u25b6 After this section, you can write a boundary example for your most-confused classification pair and explain why it works better than adding more clear-cut examples."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'non-tech'
            ? <>Rhea is classifying insurance exceptions using a zero-shot prompt. Accuracy is 68%. &ldquo;Pre-Authorization &mdash; Medical Necessity&rdquo; keeps miscategorising as &ldquo;Coverage Limit&rdquo; &mdash; a subtle distinction that matters operationally. Adding &ldquo;classify carefully&rdquo; changes nothing.</>
            : <>Aarav&rsquo;s IT ticket classifier runs at 70% accuracy. Network connectivity tickets involving VPN authentication failures keep routing to the wrong team. The categories exist in the prompt. The problem is the model has never seen Northstar&rsquo;s specific failure patterns.</>}
        </SituationCard>
        {para(track === 'non-tech'
          ? "Zero-shot prompting relies on the model's pre-trained knowledge. When your categories have internal meanings not aligned with general language use, the model has no way to learn the distinction from a label alone."
          : "The model's training data doesn't include Northstar's internal ticket taxonomy. Without domain-specific examples, it applies general IT knowledge. For a routing system, 'close' means misrouted tickets."
        )}
        {para(track === 'non-tech'
          ? "Three labeled examples of the ambiguous boundary — showing exactly what distinguishes a 'Pre-Authorization' denial from a 'Coverage Limit' denial in Northstar's context — can move accuracy from 68% to 91% with no other changes."
          : "Adding three to five labeled examples per problematic category transfers the classification logic directly. The model learns the boundary you care about, not the one it guessed."
        )}
        {keyBox('Two modes of example usage', [
          'Task exemplars: show the model a correct input-output pair for the whole task',
          'Boundary examples: show the model where hard-to-distinguish cases land',
          'Edge cases: show the model what should NOT be classified as a given label',
        ], '#0F766E')}
        {keyBox('How many examples, and when to stop', [
          'New domain category the model has never seen: start with 5 — 3 clear representative cases, 2 showing the boundaries of the category.',
          'Confused boundary (two classes the model keeps conflating): start with 3 examples that sit exactly on the line between them. Clear-cut examples of either class are not what the model needs.',
          'Already-working category: 1\u20132 task exemplars to anchor style and format. Do not keep adding.',
          'Stopping signal 1: run the updated prompt on 20 new inputs. If the confused category\u2019s accuracy has not improved by at least 10 percentage points, your examples are not targeting the right boundary — not the right quantity.',
          'Stopping signal 2: the misclassified cases shift to a different category pair. That is your next boundary to target. Stop adding to the current set.',
        ], '#0F766E')}
        {para(track === 'non-tech'
          ? "How Rhea wrote a boundary example for Pre-Authorization vs Coverage Limit: (1) She found a real exception request where the patient\u2019s procedure was medically required but not pre-authorised — the case that kept getting mis-labelled. (2) She wrote the input as a one-sentence description: \u2018Patient requires MRI for suspected disc herniation. Procedure is medically indicated but prior authorisation was not obtained.\u2019 (3) She labelled it explicitly: Pre-Authorization \u2013 Medical Necessity. (4) She added a note in the prompt: \u2018This is Pre-Authorization, not Coverage Limit — the procedure is covered but the approval step was missed.\u2019 That note is the boundary signal the model needs."
          : "How Aarav wrote a boundary example for VPN auth failure tickets: (1) He found a real ticket that kept routing to the wrong team — a VPN timeout that looked like a general network issue. (2) He wrote the input verbatim: \u2018User cannot connect to VPN from home network. Credentials valid. Connection times out after 30 seconds.\u2019 (3) He labelled it: Network \u2013 VPN Authentication. (4) He added a note: \u2018This is VPN Authentication, not General Network — credentials are valid, the failure is in the auth handshake, not the connection layer.\u2019 Three examples like this moved the routing accuracy for VPN tickets from 58% to 91%."
        )}
        <FewShotLabeler track={track} />
        <GenAIConversationScene
          mentor="kabir"
          track={track}
          accent="#0F766E"
          techLines={[
            { speaker: 'protagonist', text: "I added five examples per category. VPN auth failure tickets still route to the wrong team." },
            { speaker: 'mentor', text: "The question for each example isn\u2019t \u2018is it correct\u2019 — it\u2019s \u2018does it show the model the boundary it keeps getting wrong?\u2019" },
            { speaker: 'protagonist', text: "My examples are all clear-cut tickets. The VPN failures are the ambiguous edge cases." },
            { speaker: 'mentor', text: "Examples are most valuable exactly where the model\u2019s prior is weakest. You need boundary examples — showing where the ambiguous cases actually land." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "Slightly critical feedback keeps classifying as Neutral instead of Negative. I\u2019ve added more examples but it\u2019s not improving." },
            { speaker: 'mentor', text: "What kind of examples did you add — clear negatives or borderline cases?" },
            { speaker: 'protagonist', text: "Clear negatives. Obvious complaints." },
            { speaker: 'mentor', text: "The model already handles obvious negatives. Add one example of a near-neutral comment that should be Negative. That\u2019s the boundary it needs to see." },
          ]}
        />
        <GenAIAvatar
          name="Kabir"
          nameColor="#0F766E"
          borderColor="#0F766E"
          conceptId="genai-m2-fewshot"
          content={<>The question to ask about a few-shot example isn\u2019t \u201cis it correct?\u201d — it\u2019s \u201cdoes it show the model the boundary it keeps getting wrong?\u201d</>}
          expandedContent="Most teams add examples of the most common case. Classification errors almost always happen on the most ambiguous cases. Examples are most valuable where the model's prior is weakest."
          question={track === 'non-tech' ? "Slightly critical feedback keeps classifying as Neutral. What kind of example helps most?" : "Network tickets misclassify despite 5 examples. Most impactful fix?"}
          options={track === 'non-tech' ? [
            { text: "More clearly positive examples to anchor the Positive end", correct: false, feedback: "The unclear boundary is Neutral vs Negative — not Positive vs Neutral." },
            { text: "Borderline-negative examples explicitly labelled as Negative", correct: true, feedback: "Edge-case examples teach exactly where the ambiguous boundary sits." },
            { text: "A longer instruction explaining what Negative means", correct: false, feedback: "Instructions describe; examples demonstrate. For subtle boundaries, demonstration wins." },
            { text: "More clearly negative examples so the model learns the Negative category better", correct: false, feedback: "The model already handles obvious negatives correctly. More examples of what it already knows won\u2019t fix the boundary confusion — the mislabelling happens at the Neutral/Negative line, not in the clear-cut cases." },
          ] : [
            { text: "Fine-tune the model on Northstar\u2019s full ticket history", correct: false, feedback: "Fine-tuning is expensive and a last resort. More representative few-shot examples come first." },
            { text: "Add more varied examples covering different connectivity failure scenarios", correct: true, feedback: "Low accuracy with examples usually means they aren\u2019t representative of real-world variance." },
            { text: "Switch to a more powerful model and use the same examples", correct: false, feedback: "A stronger model won\u2019t compensate for unrepresentative examples — it\u2019ll just fail more confidently." },
            { text: "Remove the VPN Authentication category and merge it with General Network", correct: false, feedback: "Collapsing categories removes real operational distinctions — VPN auth failures and general network issues route to different teams for a reason. The fix is better examples, not fewer categories." },
          ]}
        />
        <ApplyItBox prompt={track === 'tech' ? "Find a classification endpoint. How many labeled examples per class? For the three most-confused categories, write one boundary example each and measure accuracy." : "Think of an AI task where your team has complained about wrong categories. Write three labeled examples for the most-confused category and add them to the prompt."} />
        <QuizEngine
          conceptId="genai-m2-fewshot"
          conceptName="Zero-Shot vs Few-Shot"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m2-fewshot',
            question: QUIZZES[1].question[track],
            options: QUIZZES[1].options[track],
            correctIndex: QUIZZES[1].correctIndex[track],
            explanation: QUIZZES[1].explanation[track],
            keyInsight: QUIZZES[1].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Aarav has structured prompts and domain examples. But his chatbot forgets context after a few turns. Next: what actually reaches the model — and what gets silently dropped." : "Rhea\u2019s prompts are well-structured with the right examples. But her summarizer still misses a critical finding on page 7. Next: what the model can actually see."} />
      </ChapterSection>

      <ChapterSection id="genai-m2-context" num="03" accentRgb={ACCENT_RGB}>
        {chLabel('Context Window: What Goes In Matters')}
        {h2("The context window is a spotlight, not a searchlight.")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can diagnose a context window failure from API logs and apply the correct fix — sliding window, front-loading, or periodic summarisation — to your specific situation."
          : "\u25b6 After this section, you can identify when a missed output was caused by context placement and restructure a prompt to front-load what the model must not miss."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'non-tech'
            ? <>Rhea feeds 10 pages of patient notes into her summarizer. The output is &ldquo;generally fine&rdquo; until a pharmacist flags a critical drug interaction on page 7 was not in the summary. The model processed the full document and still missed it. This is a context management problem.</>
            : <>Aarav&rsquo;s internal support chatbot forgets user instructions after 5&ndash;6 turns. He checks the API logs: the cumulative message history silently exceeds the model&rsquo;s 16k token limit. Older messages are dropped without any error.</>}
        </SituationCard>
        {para(track === 'non-tech'
          ? "LLMs process everything within a fixed context window. When content is long, attention distributes unevenly: information in the middle of a large context is systematically less likely to appear in the output — the 'lost in the middle' phenomenon."
          : "Every token in the API request counts toward the context window limit. Once that limit is reached, oldest content is silently truncated. The model never receives it, returns no error, and produces degraded outputs."
        )}
        {para(track === 'non-tech'
          ? "The fix isn\u2019t a bigger context window — it\u2019s intelligent pre-processing: extract critical flags first (adverse drug reactions, key diagnoses), place them at the beginning of the prompt, then include only the relevant sections."
          : "The fix is explicit context budget management: monitor prompt_tokens in the API response, implement a sliding window retaining only the most recent N turns, and periodically summarize older conversation into a compressed context block."
        )}
        <ContextWindowInspector track={track} />
        <GenAIConversationScene
          mentor="anika"
          track={track}
          accent="#7C3AED"
          techLines={[
            { speaker: 'protagonist', text: "The chatbot loses context after 5\u20136 turns. I\u2019m looking at upgrading to a model with a larger context window." },
            { speaker: 'mentor', text: "Check your API response logs first. What\u2019s the prompt_tokens count at the point it starts forgetting?" },
            { speaker: 'protagonist', text: "It\u2019s maxing out. The cumulative message history hits the limit silently — no error, just truncation." },
            { speaker: 'mentor', text: "A bigger window delays the problem. A sliding window or periodic summarization solves it. The model can only use what\u2019s in front of it — old messages that were truncated are gone." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "My summarizer processed all 10 pages of patient notes. The critical drug interaction on page 7 isn\u2019t in the output." },
            { speaker: 'mentor', text: "Where did you place the most critical information in the prompt — beginning, middle, or end?" },
            { speaker: 'protagonist', text: "Original document order. Page 7 of 10, so the middle." },
            { speaker: 'mentor', text: "Attention distributes unevenly in long contexts — information in the middle is systematically under-represented. Front-load what matters most." },
          ]}
        />
        <GenAIAvatar
          name="Anika"
          nameColor="#7C3AED"
          borderColor="#7C3AED"
          conceptId="genai-m2-context"
          content={<>The model can only use what\u2019s in front of it. If the most critical information is buried in the middle of a large context, it has the same effect as if you never included it.</>}
          expandedContent="Researchers have documented the 'lost in the middle' effect: critical information in the middle of a long context has lower retrieval accuracy than information at the start or end. Front-load what matters most."
          question={track === 'non-tech' ? "Rhea\u2019s summarizer misses a critical drug reaction buried on page 7 of 10. Best fix?" : "Aarav\u2019s chatbot forgets instructions after 6 turns. Root cause?"}
          options={track === 'non-tech' ? [
            { text: "Request a model with a larger context window", correct: false, feedback: "A bigger window doesn\u2019t fix \u2018lost in the middle\u2019 — it can make it worse by adding more surrounding filler." },
            { text: "Pre-extract critical flags and place them at the top of the prompt", correct: true, feedback: "The model prioritizes context at the start. Front-loading critical information ensures it\u2019s seen and included." },
            { text: "Break the document into chunks and summarize each separately", correct: false, feedback: "Chunking can fragment relationships across sections and may miss the critical finding entirely." },
            { text: "Ask the model to re-read the document from page 7 in a follow-up prompt", correct: false, feedback: "Each API call is stateless — there is no document the model has from a previous turn. The only way to ensure critical information is attended to is to front-load it in the same prompt." },
          ] : [
            { text: "Model weights decay during long sessions, losing earlier instructions", correct: false, feedback: "Model weights don\u2019t change during inference. The context window is the only memory in a session." },
            { text: "Cumulative chat history silently exceeds the token limit, dropping old messages", correct: true, feedback: "Once the context window fills, oldest content is truncated with no error. Monitor prompt_tokens in API responses." },
            { text: "System message instructions get overridden by user messages over time", correct: false, feedback: "System messages persist but still consume tokens. The issue is budget exhaustion, not override logic." },
            { text: "The model deprioritizes earlier turns as conversation length grows", correct: false, feedback: "The model doesn\u2019t deprioritize — it truncates. When the context limit is reached, oldest messages are dropped entirely, not down-weighted. They simply don\u2019t exist in the next API call." },
          ]}
        />
        <ApplyItBox prompt={track === 'tech' ? "Check your most-used LLM call\u2019s token count in the API response. Where is the critical information in the prompt? What would happen if you moved it to the top?" : "Think of an AI summary that missed something important. Where was that information in the source document? What would pre-extraction have looked like?"} />
        <QuizEngine
          conceptId="genai-m2-context"
          conceptName="Context Window"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m2-context',
            question: QUIZZES[2].question[track],
            options: QUIZZES[2].options[track],
            correctIndex: QUIZZES[2].correctIndex[track],
            explanation: QUIZZES[2].explanation[track],
            keyInsight: QUIZZES[2].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Aarav\u2019s prompts are structured, domain-aware, and context-managed. Now he\u2019s running $12k/month on GPT-4o for tasks that don\u2019t need it. Next: how to select the right model for each task." : "Rhea\u2019s prompts are working reliably. Now Anika asks: is she using the right model for each task, or paying for capability she doesn\u2019t need?"} />
      </ChapterSection>

      <ChapterSection id="genai-m2-models" num="04" accentRgb={ACCENT_RGB}>
        {chLabel('Model Selection & Cost')}
        {h2("The best model for a task is the smallest one that meets the quality bar.")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can define a quality bar for a task, run a structured 20-input evaluation, and make a cost-justified routing decision between model tiers."
          : "\u25b6 After this section, you can define what \u2018good enough\u2019 means for a specific task, test a cheaper model against that bar, and decide whether hybrid routing makes sense for your workflow."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'non-tech'
            ? <>Rhea assumes GPT-4o is right for everything. She runs it on 200 intake form summaries per day and 5 complex referral letters. Anika points out that for structured summarization at high volume, Claude Haiku produces nearly identical quality at a fraction of the cost.</>
            : <>Aarav\u2019s ticket classifier costs $12,000/month on GPT-4o. Rohan flags this as unsustainable. The task is classification with 7 categories and 5 few-shot examples per category. It doesn\u2019t require frontier reasoning.</>}
        </SituationCard>
        {para(track === 'non-tech'
          ? "Model selection is a cost-quality tradeoff. GPT-4o excels at complex reasoning and nuanced writing. For Rhea\u2019s structured intake summaries — consistent inputs producing bulleted outputs — a smaller model delivers the same quality at 20\u00d7 lower cost."
          : "Model capability scales with cost, but not linearly. For classification with clear categories and domain examples, the performance delta between GPT-4o and Claude Haiku is small. The cost delta is not. A hybrid strategy is almost always the right architecture."
        )}
        {para(track === 'non-tech'
          ? "GPT-4o is for frontier reasoning: open-ended generation, multi-step analysis, tasks where quality variance has high consequences. For structured, high-volume language tasks with clear success criteria, a smaller model is the engineering-correct choice."
          : "Aarav\u2019s team finds Haiku achieves 92% accuracy vs GPT-4o\u2019s 95% at 1/20th the cost. Hybrid: route clear-cut tickets to Haiku, ambiguous ones to GPT-4o. Result: effective 94.7% accuracy at $2.4k/month."
        )}
        <ModelSelectorTool track={track} />
        <GenAIConversationScene
          mentor="kabir"
          track={track}
          accent="#0F766E"
          techLines={[
            { speaker: 'protagonist', text: "I want to evaluate which model to use for the ticket classifier. Should I start with the most capable and work down?" },
            { speaker: 'mentor', text: "Wrong direction. Define the minimum quality bar first. Then find the cheapest model that clears it." },
            { speaker: 'protagonist', text: "For the ticket classifier — consistent categorization across 7 classes, with domain examples provided." },
            { speaker: 'mentor', text: "That doesn\u2019t require frontier reasoning. You\u2019re spending GPT-4o rates on a task a smaller model handles at 95% accuracy for a fraction of the cost." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "I\u2019ve been using GPT-4o for everything — 200 high-volume intake summaries and 5 complex referral letters per day." },
            { speaker: 'mentor', text: "Before choosing a model, what\u2019s the minimum quality bar for each task separately?" },
            { speaker: 'protagonist', text: "Intake summaries just need structured bullets. Referrals need nuanced clinical reasoning." },
            { speaker: 'mentor', text: "Those are two different bars. A smaller model clears the intake bar at 20\u00d7 lower cost. Save GPT-4o for the referrals." },
          ]}
        />
        <GenAIAvatar
          name="Kabir"
          nameColor="#0F766E"
          borderColor="#0F766E"
          conceptId="genai-m2-models"
          content={<>Define the minimum quality bar first. Then find the cheapest model that clears it — never start from the top down.</>}
          expandedContent="'What\u2019s the best model?' is the wrong question. 'What\u2019s the minimum capability required?' is the right one. This leads to hybrid architectures that are both cost-efficient and reliable."
          question={track === 'non-tech' ? "Rhea has 200 structured summaries/day and 5 complex referrals/day. Best model strategy?" : "Daily reports at 100/day (medium complexity) and weekly insights at 5/week (high complexity). Budget is tight. Best strategy?"}
          options={track === 'non-tech' ? [
            { text: "GPT-4o for everything — quality matters most in healthcare", correct: false, feedback: "GPT-4o at 200/day is expensive overkill for structured summarization. Quality gaps are marginal; cost gaps are not." },
            { text: "Haiku for high-volume summaries, GPT-4o for complex referrals", correct: true, feedback: "Match model capability to task complexity. Small models at scale, frontier models for irreducible complexity." },
            { text: "Gemini Flash for everything — it\u2019s the cheapest per token", correct: false, feedback: "Cheapest per token isn\u2019t always cheapest overall. Complex referrals may need multiple retries on a weaker model." },
            { text: "Start with the smallest model for everything and upgrade only if quality fails", correct: false, feedback: "Starting from the bottom risks deploying an inadequate model on complex referrals before you\u2019ve established the quality bar. Define the bar per task first, then find the cheapest model that clears it." },
          ] : [
            { text: "GPT-4o for both to ensure consistent quality", correct: false, feedback: "Running GPT-4o on 100 daily medium-complexity reports is ~10\u00d7 more expensive than necessary." },
            { text: "GPT-3.5-turbo or Haiku for daily reports, GPT-4o for weekly insights", correct: true, feedback: "Hybrid routing optimizes cost per task tier. Most savings come from the high-volume medium-complexity work." },
            { text: "Haiku for both to minimize total monthly cost", correct: false, feedback: "Haiku may underperform on high-complexity weekly insights where multi-step reasoning is required." },
            { text: "Run a cost analysis and use whatever model the budget allows", correct: false, feedback: "Budget constraints shape the decision, but they don\u2019t replace the quality bar. If a cheaper model doesn\u2019t clear the bar for your high-complexity task, using it because it\u2019s affordable produces unacceptable outputs at any price." },
          ]}
        />
        <ApplyItBox prompt={track === 'tech' ? "Map your team\u2019s LLM API calls by volume and task complexity. Which high-volume calls could move to a smaller model? Estimate the monthly cost difference." : "List two AI tasks your team uses. Look up cost per 1M tokens for the current model vs the tier below. What\u2019s the monthly delta at your current volume?"} />
        {track === 'tech' ? keyBox('How to actually find where the quality bar sits', [
          '1. Pull 20 representative inputs from your real task — not hand-picked examples, but a random sample including messy, ambiguous, and edge-case inputs.',
          '2. Define a pass/fail rubric for each input before you run any model. For classification: correct label. For extraction: all required fields present and correctly typed. For summarisation: must include X, must not include Y. Write it down first — do not judge outputs by feel.',
          '3. Run all 20 inputs through the candidate smaller model (e.g. Haiku or GPT-3.5-turbo) and your current model. Score each output against the rubric.',
          '4. Compare the failure cases — not the accuracy number. Where does the smaller model fail? Are those failures on critical inputs or edge cases you can handle separately?',
          '5. If the smaller model passes your rubric on 18/20 and the 2 failures are low-stakes or rare: it clears the bar. Route those inputs to the smaller model. Send the 2 failure patterns to the frontier model.',
          'Cost check: (volume × cost_per_token_small) + (failure_rate × volume × cost_per_token_frontier). That number vs your current bill is the real decision.',
        ], ACCENT) : keyBox('How to test whether a smaller model meets your quality bar', [
          '1. Pick one task (start with your highest-volume one — that is where the cost saving is largest).',
          '2. Collect 15\u201320 real outputs from that task that you already know are correct. These are your quality benchmark.',
          '3. Run the same inputs through a cheaper model tier. Review each output side by side with your benchmark.',
          '4. Define your bar before you look: for intake summaries, the bar might be \u201call required fields present, no invented information, tone appropriate for clinical handover.\u201d Write that down first.',
          '5. Count how many outputs from the cheaper model pass that bar without any editing. If it is 17 out of 20, the bar is cleared for routine cases. Route complex cases (referral letters, anything requiring clinical reasoning) to the frontier model.',
          'The question is not \u201cis the cheaper model as good?\u201d — it is \u201cdoes it clear the minimum bar for this specific task?\u201d Those are different questions with different answers.',
        ], ACCENT)}
        <QuizEngine
          conceptId="genai-m2-models"
          conceptName="Model Selection"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m2-models',
            question: QUIZZES[3].question[track],
            options: QUIZZES[3].options[track],
            correctIndex: QUIZZES[3].correctIndex[track],
            explanation: QUIZZES[3].explanation[track],
            keyInsight: QUIZZES[3].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Aarav has structure, examples, context management, and model routing. But prompt changes are unversioned. The last question: how to iterate safely." : "Rhea has reliable prompts for every task tier. But she\u2019s been making changes by trial and error with no way to detect regressions. Last question: how to improve without breaking what works."} />
      </ChapterSection>

      <ChapterSection id="genai-m2-refine" num="05" accentRgb={ACCENT_RGB}>
        {chLabel('The Refinement Loop')}
        {h2("Prompts are code. They need versioning, testing, and regression checks.")}
        {para(track === 'tech'
          ? "\u25b6 After this section, you can set up a minimal prompt versioning workflow — git directory, golden dataset, eval script, promotion rule — before shipping any prompt change to production."
          : "\u25b6 After this section, you can maintain a version log and golden cases sheet that would have caught the V1\u2192V3 compliance regression before it reached production."
        )}
        <SituationCard accent={ACCENT} accentRgb={ACCENT_RGB} label={track === 'tech' ? '◎ Aarav\u2019s Situation' : '◎ Rhea\u2019s Situation'}>
          {track === 'non-tech'
            ? <>Rhea has improved her discharge summary prompt across three versions. V3 is more concise. But a compliance auditor flags a legal disclaimer always present in V1 is now missing. She has no record of what changed and no way to know which edit caused the regression.</>
            : <>Aarav deploys a prompt update (V2) that improves summary quality for most cases. Two days later, a team lead flags edge-case incident reports are missing the resolution step. No golden dataset, no version diff, no automated way to detect this regression before production.</>}
        </SituationCard>
        {para(track === 'non-tech'
          ? "A prompt is a living document governing critical outputs. When you change it without tracking what changed, you\u2019re deploying code without version control. The first time you introduce a regression that reaches a patient or regulator, the absence of a refinement loop becomes a liability."
          : "Prompt engineering without a testing framework is technical debt at the application layer. Every untracked change is a potential regression. Production AI systems need the same discipline as production code."
        )}
        {para(track === 'non-tech'
          ? "Rhea\u2019s refinement loop: store each version with a changelog. Maintain 'golden cases' — inputs where you know exactly what the correct output looks like. Before replacing V2 with V3, verify V3 passes all golden cases."
          : "Aarav\u2019s workflow: store prompts in a prompts/ directory in git. Build a golden dataset of 50\u2013100 labeled examples covering normal cases, edge cases, and previously seen failures. Automate evaluation on every PR."
        )}
        {track === 'non-tech' ? keyBox('What Rhea\u2019s minimal refinement loop looks like in practice', [
          'Version doc: one shared Google Doc with a simple table — columns: Version, Date, What changed, Why. One row per edit. Takes two minutes to fill in.',
          'Golden cases sheet: a separate spreadsheet with 10\u201315 rows. Each row: the input text, what the output MUST include, what it must NOT include. Start with the cases that have failed or been flagged before.',
          'Before replacing V2 with V3: paste each golden case input into the new prompt and check the output against the \u201cmust include / must not include\u201d columns manually. Flag any row where V3 fails something V2 passed.',
          'Promotion rule: if V3 fails even one compliance-critical golden case (missing disclaimer, wrong section, wrong tone), do not ship it. Fix the regression first.',
          'This is not a heavy process — 10 golden cases takes about 20 minutes to check. The V1\u2192V3 disclaimer regression would have been caught in the first row.',
        ], '#DB2777') : keyBox('What Aarav\u2019s minimal refinement loop looks like in practice', [
          'prompts/ directory in git: one .txt or .md file per prompt, named by use case (e.g. incident_summariser_v3.txt). Commit message must state what changed and why — not just \u201cupdate prompt\u201d.',
          'golden_dataset.jsonl: 50\u2013100 examples in JSON Lines format. Each entry has an input and expected output fields (or must_include / must_not_include for open-ended tasks). Cover normal cases, known edge cases, and every failure mode seen in production.',
          'eval.py: a script that loads the current prompt, runs each golden case through the model, and prints pass/fail per row plus overall accuracy per category. Run it locally before opening a PR.',
          'Promotion rule: a new prompt version ships only if eval accuracy is equal to or better than the previous version on every category — not just overall. An improvement in Category A that causes a regression in Category B does not pass.',
          'The V2 regression (missing resolution step in edge-case reports) would have appeared as a failing row in eval.py before it ever reached production.',
        ], '#DB2777')}
        {pullQuote("You cannot improve a prompt safely without knowing what it does consistently right.")}
        <PromptDiffViewer track={track} />
        <GenAIConversationScene
          mentor="leela"
          track={track}
          accent="#C2410C"
          techLines={[
            { speaker: 'protagonist', text: "V2 improved summary quality for most cases but introduced a regression — edge-case incident reports are missing the resolution step." },
            { speaker: 'mentor', text: "Every prompt change is a hypothesis. Before you ship V3, what would tell you V3 doesn\u2019t introduce the same regression?" },
            { speaker: 'protagonist', text: "I need a golden dataset — normal cases, edge cases, and the specific failure mode from V2." },
            { speaker: 'mentor', text: "Run V3 against that dataset before it touches production. An undocumented prompt change that removes a safety instruction is indistinguishable from a silent code change." },
          ]}
          nonTechLines={[
            { speaker: 'protagonist', text: "V3 is more concise. Then the compliance auditor found the legal disclaimer is missing — it was always in V1." },
            { speaker: 'mentor', text: "Every prompt change is a hypothesis. What should you have tested before replacing V2?" },
            { speaker: 'protagonist', text: "I need golden cases — inputs where I know exactly what the correct output should include." },
            { speaker: 'mentor', text: "The disclaimer wasn\u2019t an accident — it was a requirement you stopped enforcing. Verify compliance-critical outputs before any version goes live." },
          ]}
        />
        <GenAIAvatar
          name="Leela"
          nameColor="#C2410C"
          borderColor="#C2410C"
          conceptId="genai-m2-refine"
          content={<>Every prompt change is a hypothesis. You need to know what it might break, not just what it might improve.</>}
          expandedContent="From a compliance perspective, an undocumented prompt change that removes a safety instruction is indistinguishable from a silent code change that introduces a compliance violation. Treat prompts with the same governance as any production artifact."
          question={track === 'non-tech' ? "V3 consent form prompt omits a legal disclaimer that V1 always included. Next step?" : "V2 improved summaries for most cases but introduced edge-case regressions. Before shipping V3, what\u2019s critical?"}
          options={track === 'non-tech' ? [
            { text: "Revert to V1 — safety and compliance take precedence", correct: false, feedback: "Reverting discards valid improvements. Diagnose the specific change that caused the regression and fix it surgically." },
            { text: "Diff V1 and V3, identify what dropped the disclaimer, add an explicit constraint", correct: true, feedback: "Systematic comparison lets you preserve the improvement while restoring the requirement. That\u2019s the refinement loop." },
            { text: "Ask legal to simplify the disclaimer to fit the concise format", correct: false, feedback: "That changes the requirement, not the prompt. The problem is prompt regression." },
            { text: "Ship V3 and add a manual review step specifically for disclaimer presence", correct: false, feedback: "Adding post-hoc review for a known regression is the wrong direction. Find and fix the regression in the prompt, verify it passes all golden cases, then ship. Review is for unknown failures — not ones you\u2019ve already identified." },
          ] : [
            { text: "A/B test V3 with 10% of production traffic", correct: false, feedback: "Production A/B testing is risky when regressions are already known. Verify against a golden dataset first." },
            { text: "Run V3 against the golden dataset and compare metrics against V1 and V2", correct: true, feedback: "A golden dataset is your regression test suite for prompts. No deployment without it." },
            { text: "Manually review 10\u201320 outputs and use judgment", correct: false, feedback: "Manual spot-checks miss systematic failures. A golden dataset scales verification beyond human review." },
            { text: "Ask the team lead who flagged the regression to validate V3 outputs manually", correct: false, feedback: "Human spot-checking is valuable but doesn\u2019t catch failures that only appear under specific input patterns. The golden dataset exists precisely because a handful of manually reviewed cases can miss the failure mode entirely." },
          ]}
        />
        <ApplyItBox prompt={track === 'tech' ? "Does your team have a golden dataset for your most-used prompt? If not, identify 20 representative test cases and store them with expected outputs — that\u2019s your regression baseline." : "Think of the last time an AI tool gave different outputs from before. What would a golden case set look like for that task? Write down 5 representative inputs and expected outputs."} />
        <QuizEngine
          conceptId="genai-m2-refine"
          conceptName="Refinement Loop"
          moduleContext={moduleContext}
          staticQuiz={{
            conceptId: 'genai-m2-refine',
            question: QUIZZES[4].question[track],
            options: QUIZZES[4].options[track],
            correctIndex: QUIZZES[4].correctIndex[track],
            explanation: QUIZZES[4].explanation[track],
            keyInsight: QUIZZES[4].keyInsight,
          }}
        />
        <NextChapterTeaser text={track === 'tech' ? "Aarav now has the full prompt engineering stack. Pre-Read 03 is about a harder problem — his prompts are right but analysts still don't trust the outputs. The issue isn't prompting. It's what goes into the pipeline before the prompt ever runs." : "Rhea has reliable, structured prompts for every task tier. Pre-Read 03 is about a problem prompting alone can't fix — her AI outputs look complete but miss critical context. The issue isn't how she asks. It's what she's asking the model to read."} />
      </ChapterSection>
    </>
  );
}

// --- Default Export ---

interface Props {
  track: GenAITrack;
  onBack: () => void;
}

export default function GenAIPreRead2({ track, onBack }: Props) {
  const store = useLearnerStore();
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const prevXpRef = useRef(0);

  useEffect(() => {
    store.initSession();
    CONCEPTS.forEach((concept) => store.ensureConceptState(concept.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.getAttribute('data-section');
        if (!sectionId) return;
        if (entry.isIntersecting) {
          setActiveSection(sectionId);
          setCompletedSections((prev) => new Set([...prev, sectionId]));
          store.markSectionViewed(sectionId);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -25% 0px' });

    const timer = setTimeout(() => {
      document.querySelectorAll('[data-section]').forEach((element) => sectionObserver.observe(element));
    }, 150);

    return () => {
      clearTimeout(timer);
      sectionObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressPct = Math.round((completedSections.size / SECTIONS.length) * 100);

  return (
    <div className="editorial" style={{ background: 'var(--ed-cream)', minHeight: '100vh' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
              <motion.button whileHover={{ opacity: 0.75 }} whileTap={{ scale: 0.97 }} onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', cursor: 'pointer', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>&larr;</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)', fontFamily: "\'JetBrains Mono\', monospace" }}>Back</span>
              </motion.button>
              <span style={{ color: 'var(--ed-rule)', fontSize: '18px' }}>|</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: `linear-gradient(135deg, ${ACCENT} 0%, #1D4ED8 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 8px rgba(${ACCENT_RGB},0.3)` }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily: "\'Plus Jakarta Sans\', sans-serif", fontSize: '13px', fontWeight: 800, color: 'var(--ed-ink)', lineHeight: 1 }}>Airtribe</div>
                  <div style={{ fontFamily: "\'JetBrains Mono\', monospace", fontSize: '8px', fontWeight: 600, color: 'var(--ed-ink3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Learn</div>
                </div>
              </div>
              <span style={{ color: 'var(--ed-rule)', fontSize: '18px' }}>|</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <span style={{ fontFamily: "\'JetBrains Mono\', monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>GenAI Launchpad</span>
                <span style={{ color: 'var(--ed-rule)', fontSize: '12px' }}>&rsaquo;</span>
                <span style={{ fontFamily: "\'JetBrains Mono\', monospace", fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink2)' }}>{TRACK_META[track].introTitle}</span>
              </div>
            </div>
            <div style={{ flex: 1, maxWidth: '240px', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 24px' }}>
              <div style={{ flex: 1, height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: ACCENT, borderRadius: '2px' }} />
              </div>
              <span style={{ fontFamily: "\'JetBrains Mono\', monospace", fontSize: '10px', fontWeight: 700, color: ACCENT, flexShrink: 0 }}>{progressPct}%</span>
            </div>
            <DarkModeToggle />
          </motion.div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px minmax(0, 1fr) 240px', gap: '40px', alignItems: 'start', paddingTop: '36px' }}>
          <div style={{ alignSelf: 'stretch' }}>
            <LeftNav completedSections={completedSections} activeSection={activeSection} track={track} />
          </div>
          <motion.main initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} style={{ minWidth: 0 }}>
            <CoreContent track={track} completedSections={completedSections} activeSection={activeSection} />
            <AnimatePresence>
              {progressPct >= 80 ? (
                <motion.div initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} style={{ padding: '40px 32px', background: 'var(--ed-card)', borderRadius: '10px', textAlign: 'center', position: 'relative', overflow: 'hidden', marginBottom: '40px', border: '1px solid var(--ed-rule)', borderTop: `4px solid ${ACCENT}` }}>
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: '40px', marginBottom: '14px' }}>&#9678;</motion.div>
                  <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '10px', color: 'var(--ed-ink)', fontFamily: "\'Lora\', \'Georgia\', serif" }}>Pre-Read 02 Complete</h3>
                  <p style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.8, maxWidth: '430px', margin: '0 auto 24px' }}>
                    {track === 'tech' ? 'You now have the core prompt engineering toolkit: anatomy, few-shot transfer, context budgeting, model routing, and safe iteration with regression testing.' : 'You now know how to write prompts that work reliably: structured anatomy, domain examples, context management, the right model, and a safe refinement process.'}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <div style={{ height: '60px' }} />
          </motion.main>
          <div style={{ alignSelf: 'stretch' }}>
            <Sidebar completedSections={completedSections} progressPct={progressPct} prevXp={prevXpRef.current} />
          </div>
        </div>
      </div>
    </div>
  );
}

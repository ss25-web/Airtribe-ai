// ─── PR1 · TokenProbCard dataset ──────────────────────────────────────
// Each entry pairs a starter prompt with a hand-authored continuation
// (5–7 tokens). Every token carries a realistic probability and its
// top-3 alternatives, modelling how a real LLM would generate the next
// piece of text. This is a CURATED dataset — every continuation reads
// as proper English. The card UI matches the learner's typed prompt
// against the closest starter (or lets them pick directly from the
// preset list) and streams the corresponding tokens.
//
// To expand: add more entries here, or generate via content-gen script.

export type TokenStep = {
  word: string;       // the chosen token (leading space included if needed)
  p: number;          // probability of being picked (0..1)
  alts: { label: string; p: number }[];  // top-3 candidates incl. the chosen one
};

export type TokenStarter = {
  id: string;
  domain: 'general' | 'engineering' | 'operations' | 'healthcare' | 'product';
  prompt: string;
  tokens: TokenStep[];
};

export const TOKEN_PROB_DATASET: TokenStarter[] = [
  // ─── GENERAL · how LLMs work ──────────────────────────────────────
  {
    id: 'g-llm-1',
    domain: 'general',
    prompt: 'The model generates',
    tokens: [
      { word: ' plausible', p: 0.42, alts: [{ label: ' plausible', p: 0.42 }, { label: ' fluent',     p: 0.27 }, { label: ' coherent',  p: 0.18 }] },
      { word: ' text',      p: 0.58, alts: [{ label: ' text',      p: 0.58 }, { label: ' output',    p: 0.22 }, { label: ' answers',  p: 0.13 }] },
      { word: ' from',      p: 0.48, alts: [{ label: ' from',      p: 0.48 }, { label: ' by',        p: 0.28 }, { label: ' using',    p: 0.17 }] },
      { word: ' learned',   p: 0.34, alts: [{ label: ' learned',   p: 0.34 }, { label: ' statistical',p: 0.31 }, { label: ' training', p: 0.22 }] },
      { word: ' patterns',  p: 0.62, alts: [{ label: ' patterns',  p: 0.62 }, { label: ' weights',   p: 0.21 }, { label: ' data',     p: 0.12 }] },
      { word: '.',          p: 0.71, alts: [{ label: '.',          p: 0.71 }, { label: ' in',        p: 0.16 }, { label: ' and',     p: 0.09 }] },
    ],
  },
  {
    id: 'g-next-token-1',
    domain: 'general',
    prompt: 'The next token depends on',
    tokens: [
      { word: ' the',         p: 0.78, alts: [{ label: ' the',        p: 0.78 }, { label: ' previous',   p: 0.14 }, { label: ' all',       p: 0.05 }] },
      { word: ' previous',    p: 0.52, alts: [{ label: ' previous',   p: 0.52 }, { label: ' surrounding',p: 0.28 }, { label: ' input',     p: 0.14 }] },
      { word: ' tokens',      p: 0.74, alts: [{ label: ' tokens',     p: 0.74 }, { label: ' words',      p: 0.16 }, { label: ' context',   p: 0.07 }] },
      { word: ',',            p: 0.46, alts: [{ label: ',',           p: 0.46 }, { label: ' and',        p: 0.34 }, { label: ' only',      p: 0.14 }] },
      { word: ' not',         p: 0.58, alts: [{ label: ' not',        p: 0.58 }, { label: ' never',      p: 0.18 }, { label: ' rarely',    p: 0.14 }] },
      { word: ' on',          p: 0.42, alts: [{ label: ' on',         p: 0.42 }, { label: ' a',          p: 0.31 }, { label: ' factual',   p: 0.19 }] },
      { word: ' truth',       p: 0.51, alts: [{ label: ' truth',      p: 0.51 }, { label: ' facts',      p: 0.32 }, { label: ' lookup',    p: 0.13 }] },
    ],
  },
  {
    id: 'g-llm-hallucinate-1',
    domain: 'general',
    prompt: 'When the model hallucinates it is',
    tokens: [
      { word: ' still',       p: 0.46, alts: [{ label: ' still',      p: 0.46 }, { label: ' simply',     p: 0.27 }, { label: ' really',    p: 0.18 }] },
      { word: ' generating',  p: 0.61, alts: [{ label: ' generating', p: 0.61 }, { label: ' producing',  p: 0.21 }, { label: ' returning', p: 0.12 }] },
      { word: ' the',         p: 0.66, alts: [{ label: ' the',        p: 0.66 }, { label: ' a',          p: 0.21 }, { label: ' its',       p: 0.09 }] },
      { word: ' most',        p: 0.52, alts: [{ label: ' most',       p: 0.52 }, { label: ' next',       p: 0.28 }, { label: ' likely',    p: 0.14 }] },
      { word: ' plausible',   p: 0.49, alts: [{ label: ' plausible',  p: 0.49 }, { label: ' likely',     p: 0.32 }, { label: ' probable',  p: 0.14 }] },
      { word: ' continuation',p: 0.54, alts: [{ label: ' continuation',p:0.54 }, { label: ' token',      p: 0.28 }, { label: ' phrase',    p: 0.13 }] },
      { word: '.',            p: 0.69, alts: [{ label: '.',           p: 0.69 }, { label: ' it',         p: 0.17 }, { label: ',',          p: 0.09 }] },
    ],
  },
  {
    id: 'g-prompt-design-1',
    domain: 'general',
    prompt: 'A good prompt should',
    tokens: [
      { word: ' name',        p: 0.42, alts: [{ label: ' name',       p: 0.42 }, { label: ' define',     p: 0.27 }, { label: ' specify',   p: 0.21 }] },
      { word: ' the',         p: 0.68, alts: [{ label: ' the',        p: 0.68 }, { label: ' a',          p: 0.18 }, { label: ' both',      p: 0.08 }] },
      { word: ' role',        p: 0.51, alts: [{ label: ' role',       p: 0.51 }, { label: ' task',       p: 0.27 }, { label: ' output',    p: 0.16 }] },
      { word: ',',            p: 0.49, alts: [{ label: ',',           p: 0.49 }, { label: ' and',        p: 0.34 }, { label: ' the',       p: 0.11 }] },
      { word: ' the',         p: 0.62, alts: [{ label: ' the',        p: 0.62 }, { label: ' an',         p: 0.18 }, { label: ' format',    p: 0.13 }] },
      { word: ' format',      p: 0.48, alts: [{ label: ' format',     p: 0.48 }, { label: ' audience',   p: 0.27 }, { label: ' length',    p: 0.18 }] },
      { word: ',',            p: 0.52, alts: [{ label: ',',           p: 0.52 }, { label: ' and',        p: 0.31 }, { label: '.',          p: 0.13 }] },
    ],
  },

  // ─── ENGINEERING · prediction & inference ─────────────────────────
  {
    id: 'e-completion-1',
    domain: 'engineering',
    prompt: 'The next AI completion will be',
    tokens: [
      { word: ' a',           p: 0.41, alts: [{ label: ' a',          p: 0.41 }, { label: ' just',       p: 0.28 }, { label: ' another',   p: 0.18 }] },
      { word: ' probabilistic',p:0.46, alts: [{ label: ' probabilistic',p:0.46 }, { label: ' statistical',p:0.31 }, { label: ' learned',   p: 0.17 }] },
      { word: ' pick',        p: 0.52, alts: [{ label: ' pick',       p: 0.52 }, { label: ' sample',     p: 0.27 }, { label: ' draw',      p: 0.16 }] },
      { word: ' from',        p: 0.58, alts: [{ label: ' from',       p: 0.58 }, { label: ' over',       p: 0.23 }, { label: ' across',    p: 0.14 }] },
      { word: ' a',           p: 0.62, alts: [{ label: ' a',          p: 0.62 }, { label: ' the',        p: 0.27 }, { label: ' learned',   p: 0.08 }] },
      { word: ' distribution',p: 0.66, alts: [{ label: ' distribution',p:0.66 }, { label: ' vocabulary', p: 0.21 }, { label: ' space',     p: 0.09 }] },
      { word: '.',            p: 0.73, alts: [{ label: '.',           p: 0.73 }, { label: ',',           p: 0.14 }, { label: ' of',       p: 0.08 }] },
    ],
  },
  {
    id: 'e-context-1',
    domain: 'engineering',
    prompt: 'In production the context window',
    tokens: [
      { word: ' has',         p: 0.46, alts: [{ label: ' has',        p: 0.46 }, { label: ' is',         p: 0.32 }, { label: ' becomes',   p: 0.14 }] },
      { word: ' to',          p: 0.51, alts: [{ label: ' to',         p: 0.51 }, { label: ' a',          p: 0.27 }, { label: ' been',      p: 0.16 }] },
      { word: ' be',          p: 0.78, alts: [{ label: ' be',         p: 0.78 }, { label: ' carry',      p: 0.13 }, { label: ' hold',      p: 0.06 }] },
      { word: ' carefully',   p: 0.44, alts: [{ label: ' carefully',  p: 0.44 }, { label: ' explicitly', p: 0.29 }, { label: ' rigorously',p: 0.18 }] },
      { word: ' budgeted',    p: 0.46, alts: [{ label: ' budgeted',   p: 0.46 }, { label: ' managed',    p: 0.32 }, { label: ' designed',  p: 0.16 }] },
      { word: '.',            p: 0.71, alts: [{ label: '.',           p: 0.71 }, { label: ' per',        p: 0.17 }, { label: ',',          p: 0.08 }] },
    ],
  },
  {
    id: 'e-cost-1',
    domain: 'engineering',
    prompt: 'Inference cost scales with',
    tokens: [
      { word: ' the',         p: 0.56, alts: [{ label: ' the',        p: 0.56 }, { label: ' input',      p: 0.21 }, { label: ' both',      p: 0.16 }] },
      { word: ' number',      p: 0.47, alts: [{ label: ' number',     p: 0.47 }, { label: ' total',      p: 0.28 }, { label: ' count',     p: 0.16 }] },
      { word: ' of',          p: 0.83, alts: [{ label: ' of',         p: 0.83 }, { label: ' in',         p: 0.09 }, { label: ' over',      p: 0.04 }] },
      { word: ' tokens',      p: 0.78, alts: [{ label: ' tokens',     p: 0.78 }, { label: ' requests',   p: 0.13 }, { label: ' users',     p: 0.06 }] },
      { word: ' processed',   p: 0.42, alts: [{ label: ' processed',  p: 0.42 }, { label: ' generated',  p: 0.31 }, { label: ' per',       p: 0.21 }] },
      { word: ' per',         p: 0.51, alts: [{ label: ' per',        p: 0.51 }, { label: ',',           p: 0.28 }, { label: ' across',    p: 0.13 }] },
      { word: ' request',     p: 0.61, alts: [{ label: ' request',    p: 0.61 }, { label: ' call',       p: 0.27 }, { label: ' query',     p: 0.09 }] },
    ],
  },
  {
    id: 'e-retrieval-1',
    domain: 'engineering',
    prompt: 'Retrieval augmented generation lets the model',
    tokens: [
      { word: ' ground',      p: 0.46, alts: [{ label: ' ground',     p: 0.46 }, { label: ' base',       p: 0.27 }, { label: ' anchor',    p: 0.17 }] },
      { word: ' its',         p: 0.52, alts: [{ label: ' its',        p: 0.52 }, { label: ' the',        p: 0.28 }, { label: ' each',      p: 0.13 }] },
      { word: ' answer',      p: 0.46, alts: [{ label: ' answer',     p: 0.46 }, { label: ' response',   p: 0.31 }, { label: ' output',    p: 0.18 }] },
      { word: ' in',          p: 0.61, alts: [{ label: ' in',         p: 0.61 }, { label: ' on',         p: 0.23 }, { label: ' against',   p: 0.11 }] },
      { word: ' retrieved',   p: 0.42, alts: [{ label: ' retrieved',  p: 0.42 }, { label: ' real',       p: 0.28 }, { label: ' supplied',  p: 0.21 }] },
      { word: ' documents',   p: 0.51, alts: [{ label: ' documents',  p: 0.51 }, { label: ' context',    p: 0.31 }, { label: ' sources',   p: 0.13 }] },
      { word: '.',            p: 0.73, alts: [{ label: '.',           p: 0.73 }, { label: ' instead',    p: 0.14 }, { label: ',',          p: 0.08 }] },
    ],
  },
  {
    id: 'e-evals-1',
    domain: 'engineering',
    prompt: 'A production AI feature needs',
    tokens: [
      { word: ' clear',       p: 0.41, alts: [{ label: ' clear',      p: 0.41 }, { label: ' deterministic',p:0.27 }, { label: ' explicit',  p: 0.18 }] },
      { word: ' evals',       p: 0.46, alts: [{ label: ' evals',      p: 0.46 }, { label: ' tests',      p: 0.31 }, { label: ' contracts', p: 0.17 }] },
      { word: ' to',          p: 0.62, alts: [{ label: ' to',         p: 0.62 }, { label: ',',           p: 0.21 }, { label: ' that',      p: 0.13 }] },
      { word: ' catch',       p: 0.42, alts: [{ label: ' catch',      p: 0.42 }, { label: ' detect',     p: 0.31 }, { label: ' prevent',   p: 0.19 }] },
      { word: ' silent',      p: 0.46, alts: [{ label: ' silent',     p: 0.46 }, { label: ' real',       p: 0.27 }, { label: ' quality',   p: 0.18 }] },
      { word: ' failures',    p: 0.61, alts: [{ label: ' failures',   p: 0.61 }, { label: ' regressions',p: 0.23 }, { label: ' errors',    p: 0.12 }] },
      { word: '.',            p: 0.72, alts: [{ label: '.',           p: 0.72 }, { label: ' in',         p: 0.16 }, { label: ',',          p: 0.08 }] },
    ],
  },

  // ─── OPERATIONS · escalations & workflows ─────────────────────────
  {
    id: 'o-escalation-1',
    domain: 'operations',
    prompt: 'The escalation procedure for this case is',
    tokens: [
      { word: ' to',          p: 0.51, alts: [{ label: ' to',         p: 0.51 }, { label: ' documented',p: 0.28 }, { label: ' available', p: 0.13 }] },
      { word: ' route',       p: 0.42, alts: [{ label: ' route',      p: 0.42 }, { label: ' notify',    p: 0.31 }, { label: ' contact',   p: 0.18 }] },
      { word: ' it',          p: 0.61, alts: [{ label: ' it',         p: 0.61 }, { label: ' the',       p: 0.23 }, { label: ' that',      p: 0.11 }] },
      { word: ' to',          p: 0.71, alts: [{ label: ' to',         p: 0.71 }, { label: ' through',   p: 0.18 }, { label: ' via',       p: 0.07 }] },
      { word: ' the',         p: 0.78, alts: [{ label: ' the',        p: 0.78 }, { label: ' a',         p: 0.13 }, { label: ' senior',    p: 0.06 }] },
      { word: ' clinical',    p: 0.43, alts: [{ label: ' clinical',   p: 0.43 }, { label: ' compliance', p: 0.28 }, { label: ' review',    p: 0.21 }] },
      { word: ' lead',        p: 0.56, alts: [{ label: ' lead',       p: 0.56 }, { label: ' team',      p: 0.27 }, { label: ' reviewer',  p: 0.13 }] },
    ],
  },
  {
    id: 'o-workflow-1',
    domain: 'operations',
    prompt: 'The Monday brief should summarise',
    tokens: [
      { word: ' last',        p: 0.47, alts: [{ label: ' last',       p: 0.47 }, { label: ' the',       p: 0.31 }, { label: ' this',      p: 0.16 }] },
      { word: ' week',        p: 0.67, alts: [{ label: ' week',       p: 0.67 }, { label: ' month',     p: 0.18 }, { label: ' sprint',    p: 0.09 }] },
      { word: '\'s',          p: 0.78, alts: [{ label: '\'s',         p: 0.78 }, { label: '',           p: 0.16 }, { label: ' total',     p: 0.04 }] },
      { word: ' exceptions',  p: 0.42, alts: [{ label: ' exceptions', p: 0.42 }, { label: ' incidents', p: 0.31 }, { label: ' tickets',   p: 0.18 }] },
      { word: ' grouped',     p: 0.46, alts: [{ label: ' grouped',    p: 0.46 }, { label: ' organised', p: 0.31 }, { label: ' broken',    p: 0.17 }] },
      { word: ' by',          p: 0.79, alts: [{ label: ' by',         p: 0.79 }, { label: ' into',      p: 0.13 }, { label: ' across',    p: 0.06 }] },
      { word: ' category',    p: 0.58, alts: [{ label: ' category',   p: 0.58 }, { label: ' severity',  p: 0.27 }, { label: ' status',    p: 0.11 }] },
    ],
  },
  {
    id: 'o-categorize-1',
    domain: 'operations',
    prompt: 'When classifying support tickets',
    tokens: [
      { word: ' the',         p: 0.49, alts: [{ label: ' the',        p: 0.49 }, { label: ' it',        p: 0.27 }, { label: ' AI',        p: 0.17 }] },
      { word: ' model',       p: 0.52, alts: [{ label: ' model',      p: 0.52 }, { label: ' system',    p: 0.27 }, { label: ' workflow',  p: 0.14 }] },
      { word: ' needs',       p: 0.41, alts: [{ label: ' needs',      p: 0.41 }, { label: ' must',      p: 0.31 }, { label: ' should',    p: 0.21 }] },
      { word: ' a',           p: 0.57, alts: [{ label: ' a',          p: 0.57 }, { label: ' the',       p: 0.28 }, { label: ' clear',     p: 0.11 }] },
      { word: ' clear',       p: 0.42, alts: [{ label: ' clear',      p: 0.42 }, { label: ' fixed',     p: 0.31 }, { label: ' bounded',   p: 0.18 }] },
      { word: ' label',       p: 0.46, alts: [{ label: ' label',      p: 0.46 }, { label: ' category',  p: 0.31 }, { label: ' taxonomy',  p: 0.17 }] },
      { word: ' set',         p: 0.51, alts: [{ label: ' set',        p: 0.51 }, { label: ' space',     p: 0.31 }, { label: ' list',      p: 0.13 }] },
    ],
  },

  // ─── HEALTHCARE · clinical & claims ───────────────────────────────
  {
    id: 'h-discharge-1',
    domain: 'healthcare',
    prompt: 'The patient discharge summary requires',
    tokens: [
      { word: ' a',           p: 0.41, alts: [{ label: ' a',          p: 0.41 }, { label: ' the',       p: 0.27 }, { label: ' clear',     p: 0.18 }] },
      { word: ' clear',       p: 0.46, alts: [{ label: ' clear',      p: 0.46 }, { label: ' complete', p: 0.27 }, { label: ' structured',p: 0.18 }] },
      { word: ' medication',  p: 0.41, alts: [{ label: ' medication', p: 0.41 }, { label: ' diagnosis', p: 0.31 }, { label: ' follow',    p: 0.18 }] },
      { word: ' list',        p: 0.51, alts: [{ label: ' list',       p: 0.51 }, { label: ' record',   p: 0.27 }, { label: ' reconciliation',p:0.13 }] },
      { word: ' and',         p: 0.62, alts: [{ label: ' and',        p: 0.62 }, { label: ',',          p: 0.21 }, { label: ' plus',      p: 0.11 }] },
      { word: ' follow',      p: 0.52, alts: [{ label: ' follow',     p: 0.52 }, { label: ' a',         p: 0.27 }, { label: ' specialist',p: 0.14 }] },
      { word: '-up',          p: 0.78, alts: [{ label: '-up',         p: 0.78 }, { label: ' up',        p: 0.16 }, { label: '-on',       p: 0.04 }] },
    ],
  },
  {
    id: 'h-triage-1',
    domain: 'healthcare',
    prompt: 'When triaging an incoming referral',
    tokens: [
      { word: ' the',         p: 0.52, alts: [{ label: ' the',        p: 0.52 }, { label: ' AI',        p: 0.21 }, { label: ' first',     p: 0.17 }] },
      { word: ' system',      p: 0.42, alts: [{ label: ' system',     p: 0.42 }, { label: ' assistant', p: 0.31 }, { label: ' model',     p: 0.19 }] },
      { word: ' must',        p: 0.41, alts: [{ label: ' must',       p: 0.41 }, { label: ' needs',     p: 0.31 }, { label: ' should',    p: 0.21 }] },
      { word: ' flag',        p: 0.46, alts: [{ label: ' flag',       p: 0.46 }, { label: ' identify',  p: 0.27 }, { label: ' detect',    p: 0.18 }] },
      { word: ' urgency',     p: 0.47, alts: [{ label: ' urgency',    p: 0.47 }, { label: ' missing',   p: 0.31 }, { label: ' critical',  p: 0.16 }] },
      { word: ' before',      p: 0.46, alts: [{ label: ' before',     p: 0.46 }, { label: ' and',       p: 0.31 }, { label: ' rather',    p: 0.18 }] },
      { word: ' routing',     p: 0.51, alts: [{ label: ' routing',    p: 0.51 }, { label: ' acting',    p: 0.27 }, { label: ' handling',  p: 0.16 }] },
    ],
  },
  {
    id: 'h-claim-1',
    domain: 'healthcare',
    prompt: 'A claim is denied when',
    tokens: [
      { word: ' the',         p: 0.62, alts: [{ label: ' the',        p: 0.62 }, { label: ' supporting',p: 0.21 }, { label: ' it',        p: 0.13 }] },
      { word: ' documentation',p:0.46, alts: [{ label: ' documentation',p:0.46}, { label: ' policy',    p: 0.31 }, { label: ' clinical',  p: 0.17 }] },
      { word: ' does',        p: 0.51, alts: [{ label: ' does',       p: 0.51 }, { label: ' fails',     p: 0.27 }, { label: ' is',        p: 0.14 }] },
      { word: ' not',         p: 0.81, alts: [{ label: ' not',        p: 0.81 }, { label: '\'t',        p: 0.13 }, { label: ' clearly',   p: 0.04 }] },
      { word: ' meet',        p: 0.62, alts: [{ label: ' meet',       p: 0.62 }, { label: ' establish', p: 0.21 }, { label: ' support',   p: 0.11 }] },
      { word: ' medical',     p: 0.51, alts: [{ label: ' medical',    p: 0.51 }, { label: ' the',       p: 0.31 }, { label: ' coverage',  p: 0.13 }] },
      { word: ' necessity',   p: 0.74, alts: [{ label: ' necessity',  p: 0.74 }, { label: ' criteria',  p: 0.18 }, { label: ' standards', p: 0.05 }] },
    ],
  },

  // ─── PRODUCT · roadmaps & decisions ───────────────────────────────
  {
    id: 'p-priority-1',
    domain: 'product',
    prompt: 'The team should prioritise',
    tokens: [
      { word: ' the',         p: 0.51, alts: [{ label: ' the',        p: 0.51 }, { label: ' work',      p: 0.27 }, { label: ' features',  p: 0.16 }] },
      { word: ' problem',     p: 0.41, alts: [{ label: ' problem',    p: 0.41 }, { label: ' work',      p: 0.31 }, { label: ' fix',       p: 0.18 }] },
      { word: ' most',        p: 0.48, alts: [{ label: ' most',       p: 0.48 }, { label: ' with',      p: 0.27 }, { label: ' that',      p: 0.18 }] },
      { word: ' likely',      p: 0.51, alts: [{ label: ' likely',     p: 0.51 }, { label: ' grounded',  p: 0.27 }, { label: ' aligned',   p: 0.13 }] },
      { word: ' to',          p: 0.79, alts: [{ label: ' to',         p: 0.79 }, { label: ' that',      p: 0.13 }, { label: ',',          p: 0.05 }] },
      { word: ' move',        p: 0.42, alts: [{ label: ' move',       p: 0.42 }, { label: ' shift',     p: 0.27 }, { label: ' improve',   p: 0.21 }] },
      { word: ' the',         p: 0.67, alts: [{ label: ' the',        p: 0.67 }, { label: ' key',       p: 0.23 }, { label: ' target',    p: 0.07 }] },
    ],
  },
  {
    id: 'p-roadmap-1',
    domain: 'product',
    prompt: 'A good roadmap explains',
    tokens: [
      { word: ' why',         p: 0.46, alts: [{ label: ' why',        p: 0.46 }, { label: ' what',      p: 0.31 }, { label: ' the',       p: 0.18 }] },
      { word: ' each',        p: 0.47, alts: [{ label: ' each',       p: 0.47 }, { label: ' the',       p: 0.27 }, { label: ' every',     p: 0.18 }] },
      { word: ' bet',         p: 0.46, alts: [{ label: ' bet',        p: 0.46 }, { label: ' initiative',p: 0.31 }, { label: ' project',   p: 0.18 }] },
      { word: ' matters',     p: 0.51, alts: [{ label: ' matters',    p: 0.51 }, { label: ' is',        p: 0.27 }, { label: ' deserves',  p: 0.14 }] },
      { word: ' now',         p: 0.42, alts: [{ label: ' now',        p: 0.42 }, { label: ' more',      p: 0.31 }, { label: ' over',      p: 0.18 }] },
      { word: ',',            p: 0.51, alts: [{ label: ',',           p: 0.51 }, { label: ' rather',    p: 0.27 }, { label: ' instead',   p: 0.18 }] },
      { word: ' not',         p: 0.62, alts: [{ label: ' not',        p: 0.62 }, { label: ' rather',    p: 0.21 }, { label: ' versus',    p: 0.13 }] },
    ],
  },
  {
    id: 'p-launch-1',
    domain: 'product',
    prompt: 'Before launching a new feature',
    tokens: [
      { word: ' the',         p: 0.62, alts: [{ label: ' the',        p: 0.62 }, { label: ' a',         p: 0.17 }, { label: ' product',   p: 0.13 }] },
      { word: ' team',        p: 0.51, alts: [{ label: ' team',       p: 0.51 }, { label: ' PM',        p: 0.27 }, { label: ' product',   p: 0.16 }] },
      { word: ' should',      p: 0.48, alts: [{ label: ' should',     p: 0.48 }, { label: ' needs',     p: 0.27 }, { label: ' must',      p: 0.18 }] },
      { word: ' define',      p: 0.42, alts: [{ label: ' define',     p: 0.42 }, { label: ' identify',  p: 0.31 }, { label: ' confirm',   p: 0.21 }] },
      { word: ' the',         p: 0.78, alts: [{ label: ' the',        p: 0.78 }, { label: ' clear',     p: 0.13 }, { label: ' measurable',p: 0.05 }] },
      { word: ' success',     p: 0.62, alts: [{ label: ' success',    p: 0.62 }, { label: ' adoption',  p: 0.21 }, { label: ' activation',p: 0.12 }] },
      { word: ' metric',      p: 0.74, alts: [{ label: ' metric',     p: 0.74 }, { label: ' criteria',  p: 0.18 }, { label: ' threshold', p: 0.05 }] },
    ],
  },
  {
    id: 'p-experiment-1',
    domain: 'product',
    prompt: 'When the experiment ships',
    tokens: [
      { word: ' the',         p: 0.62, alts: [{ label: ' the',        p: 0.62 }, { label: ' you',       p: 0.16 }, { label: ' we',        p: 0.13 }] },
      { word: ' first',       p: 0.42, alts: [{ label: ' first',      p: 0.42 }, { label: ' team',      p: 0.31 }, { label: ' result',    p: 0.18 }] },
      { word: ' results',     p: 0.46, alts: [{ label: ' results',    p: 0.46 }, { label: ' signal',    p: 0.31 }, { label: ' metrics',   p: 0.18 }] },
      { word: ' must',        p: 0.42, alts: [{ label: ' must',       p: 0.42 }, { label: ' should',    p: 0.31 }, { label: ' need',      p: 0.21 }] },
      { word: ' be',          p: 0.83, alts: [{ label: ' be',         p: 0.83 }, { label: ' get',       p: 0.09 }, { label: ' come',      p: 0.05 }] },
      { word: ' read',        p: 0.41, alts: [{ label: ' read',       p: 0.41 }, { label: ' interpreted',p: 0.31 }, { label: ' studied',  p: 0.18 }] },
      { word: ' against',     p: 0.51, alts: [{ label: ' against',    p: 0.51 }, { label: ' with',      p: 0.27 }, { label: ' beside',    p: 0.13 }] },
    ],
  },

  // ─── More general · usage patterns ────────────────────────────────
  {
    id: 'g-error-1',
    domain: 'general',
    prompt: 'The most common error when using AI is',
    tokens: [
      { word: ' assuming',    p: 0.46, alts: [{ label: ' assuming',   p: 0.46 }, { label: ' treating',  p: 0.27 }, { label: ' thinking',  p: 0.18 }] },
      { word: ' that',        p: 0.71, alts: [{ label: ' that',       p: 0.71 }, { label: ' the',       p: 0.16 }, { label: ' it',        p: 0.09 }] },
      { word: ' fluency',     p: 0.42, alts: [{ label: ' fluency',    p: 0.42 }, { label: ' confidence',p: 0.31 }, { label: ' coherence', p: 0.18 }] },
      { word: ' equals',      p: 0.51, alts: [{ label: ' equals',     p: 0.51 }, { label: ' means',     p: 0.27 }, { label: ' implies',   p: 0.16 }] },
      { word: ' accuracy',    p: 0.62, alts: [{ label: ' accuracy',   p: 0.62 }, { label: ' truth',     p: 0.21 }, { label: ' correctness',p:0.12 }] },
      { word: '.',            p: 0.78, alts: [{ label: '.',           p: 0.78 }, { label: ' ,',         p: 0.13 }, { label: ' or',        p: 0.06 }] },
    ],
  },
  {
    id: 'g-spec-1',
    domain: 'general',
    prompt: 'The product spec should describe',
    tokens: [
      { word: ' every',       p: 0.46, alts: [{ label: ' every',      p: 0.46 }, { label: ' all',       p: 0.31 }, { label: ' the',       p: 0.18 }] },
      { word: ' state',       p: 0.46, alts: [{ label: ' state',      p: 0.46 }, { label: ' edge',      p: 0.31 }, { label: ' failure',   p: 0.18 }] },
      { word: ' the',         p: 0.62, alts: [{ label: ' the',        p: 0.62 }, { label: ' a',         p: 0.21 }, { label: ' your',      p: 0.11 }] },
      { word: ' user',        p: 0.72, alts: [{ label: ' user',       p: 0.72 }, { label: ' system',    p: 0.18 }, { label: ' app',       p: 0.06 }] },
      { word: ' can',         p: 0.51, alts: [{ label: ' can',        p: 0.51 }, { label: ' will',      p: 0.27 }, { label: ' might',     p: 0.18 }] },
      { word: ' encounter',   p: 0.46, alts: [{ label: ' encounter',  p: 0.46 }, { label: ' reach',     p: 0.31 }, { label: ' end',       p: 0.17 }] },
      { word: ',',            p: 0.52, alts: [{ label: ',',           p: 0.52 }, { label: '.',          p: 0.31 }, { label: ' including', p: 0.13 }] },
    ],
  },
  {
    id: 'g-feedback-1',
    domain: 'general',
    prompt: 'Users abandon a screen when',
    tokens: [
      { word: ' they',        p: 0.81, alts: [{ label: ' they',       p: 0.81 }, { label: ' nothing',   p: 0.09 }, { label: ' there',     p: 0.06 }] },
      { word: ' get',         p: 0.42, alts: [{ label: ' get',        p: 0.42 }, { label: ' receive',   p: 0.31 }, { label: ' have',      p: 0.21 }] },
      { word: ' no',          p: 0.62, alts: [{ label: ' no',         p: 0.62 }, { label: ' zero',      p: 0.21 }, { label: ' silent',    p: 0.13 }] },
      { word: ' feedback',    p: 0.74, alts: [{ label: ' feedback',   p: 0.74 }, { label: ' confirmation',p:0.16 }, { label: ' response',  p: 0.07 }] },
      { word: ' within',      p: 0.46, alts: [{ label: ' within',     p: 0.46 }, { label: ' after',     p: 0.27 }, { label: ' for',       p: 0.21 }] },
      { word: ' a',           p: 0.62, alts: [{ label: ' a',          p: 0.62 }, { label: ' the',       p: 0.18 }, { label: ' twelve',    p: 0.13 }] },
      { word: ' few',         p: 0.42, alts: [{ label: ' few',        p: 0.42 }, { label: ' short',     p: 0.31 }, { label: ' couple',    p: 0.21 }] },
    ],
  },
];

// Fallback continuation when nothing in the dataset matches the
// learner's free-text prompt. Generic but grammatical, with realistic
// probability distribution.
export const TOKEN_PROB_FALLBACK: TokenStep[] = [
  { word: ' is',         p: 0.42, alts: [{ label: ' is',         p: 0.42 }, { label: ' was',       p: 0.27 }, { label: ' will',      p: 0.18 }] },
  { word: ' typically',  p: 0.41, alts: [{ label: ' typically',  p: 0.41 }, { label: ' usually',   p: 0.31 }, { label: ' generally', p: 0.21 }] },
  { word: ' determined', p: 0.46, alts: [{ label: ' determined', p: 0.46 }, { label: ' shaped',    p: 0.27 }, { label: ' decided',   p: 0.18 }] },
  { word: ' by',         p: 0.78, alts: [{ label: ' by',         p: 0.78 }, { label: ' through',   p: 0.13 }, { label: ' from',      p: 0.06 }] },
  { word: ' the',        p: 0.81, alts: [{ label: ' the',        p: 0.81 }, { label: ' your',      p: 0.09 }, { label: ' a',         p: 0.06 }] },
  { word: ' surrounding',p: 0.42, alts: [{ label: ' surrounding',p: 0.42 }, { label: ' supplied',  p: 0.31 }, { label: ' learned',   p: 0.18 }] },
  { word: ' context',    p: 0.71, alts: [{ label: ' context',    p: 0.71 }, { label: ' input',     p: 0.18 }, { label: ' tokens',    p: 0.08 }] },
];

// ─── Fuzzy match utility ─────────────────────────────────────────
// Lowercase, strip punctuation, tokenize. Score each starter prompt
// against the input by word overlap. Returns the best match or null
// if no entry shares a meaningful number of words.
export function matchStarter(input: string, minOverlap = 0.4): TokenStarter | null {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean);
  const inputTokens = new Set(normalize(input));
  if (inputTokens.size === 0) return null;
  let best: { s: TokenStarter; score: number } | null = null;
  for (const s of TOKEN_PROB_DATASET) {
    const promptTokens = normalize(s.prompt);
    if (promptTokens.length === 0) continue;
    const overlap = promptTokens.filter(t => inputTokens.has(t)).length / promptTokens.length;
    if (!best || overlap > best.score) best = { s, score: overlap };
  }
  return best && best.score >= minOverlap ? best.s : null;
}

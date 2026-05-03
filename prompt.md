# Airtribe Learn — Full Codex Reference

Complete guide for building new modules, interactive tools, animations, and understanding the badge/tracker system.

---

## Project Overview

**What it is:** Next.js 16 interactive learning platform for PM, GenAI, and SWE courses.
**Live:** `ss25-web.github.io/Airtribe-ai`
**Repo:** `https://github.com/ss25-web/Airtribe-ai.git`, branch `master`
**Deploy:** push to master → GitHub Actions → GitHub Pages (static export)

**Stack:**
- Next.js 16 App Router, TypeScript, static export
- Framer Motion for animations
- Zustand (`useLearnerStore`) for XP, streaks, concept mastery — persisted to localStorage
- All styles inline — no Tailwind, no CSS files, no external UI libs
- FSRS algorithm for spaced repetition scoring

---

## Directory Structure

```
src/
  app/
    page.tsx                    ← root router — all navigation state lives here
    globals.css                 ← CSS design tokens (--ed-ink, --ed-card, etc.)
  components/
    AirtribeBrand.tsx           ← shared AirtribeLogo + DarkModeToggle
    ModuleShell.tsx             ← shared wrapper for PM modules 06+
    CourseOverview.tsx          ← module curriculum grid
    SeriesHomepage.tsx          ← landing page
    SWEPreReadLayout.tsx        ← shared layout for ALL SWE/Python pre-reads
    SWELanguageBasics.tsx       ← SWE pre-read 00 (language basics)
    PythonPreRead1/2/3.tsx      ← Python pre-reads 01-03
    PythonMentorFace.tsx        ← Python character SVG faces
    PythonPreRead1/2/3Tools.tsx ← Python interactive tools
    PythonBasicsTools.tsx       ← Python pre-read 0 interactive tools
    GenAIPreRead1-7.tsx         ← GenAI pre-reads
    pm-fundamentals/
      designSystem.tsx          ← ALL shared PM components (h2, para, ChapterSection, etc.)
      MentorFaces.tsx           ← PM character SVG faces
      Track1*.tsx / Track2*.tsx ← module content files
      Tech101Animations.tsx     ← example auto-running visuals
      Tech101Tools3D.tsx        ← example interactive tools
      TEMPLATE_Track1.tsx       ← COPY THIS to start a new PM module
```

---

## CSS Design Tokens

All components use CSS variables that automatically handle dark/light mode:

```
var(--ed-ink)    dark text (light mode: #1C1814, dark mode: #F2EFFF)
var(--ed-ink2)   medium text
var(--ed-ink3)   muted text / captions
var(--ed-rule)   borders and dividers
var(--ed-card)   card background (white in light, deep purple in dark)
var(--ed-cream)  page background
var(--ed-bg)     deepest background
```

Dark mode is triggered by `html.dark` class on `document.documentElement`.
Inside `.editorial` elements, CSS variables resolve correctly.
Outside `.editorial` (e.g. SeriesHomepage), pass colors as JS variables.

---

## PM Module Architecture

### Routing (page.tsx)

```tsx
if (activeModule === '09') return <Tech101SystemDesignModule track={assignedTrack} onBack={goBackToOverview} />;
if (activeModule === '08') return <LaunchGrowthModule track={assignedTrack} onBack={goBackToOverview} />;
// ...
// default → PMFundamentalsModule (Module 01)
```

### Module File Structure (one module = 3 files)

```
Track1<ModuleName>.tsx         ← new-pm track content
Track2<ModuleName>.tsx         ← apm track content (can be stub)
<ModuleName>Module.tsx         ← wrapper (in src/components/, NOT pm-fundamentals/)
```

### Module Accents

| Module | Accent | AccentRgb |
|--------|--------|-----------|
| 01 PM Fundamentals | `#4F46E5` | `79,70,229` |
| 02 Product Strategy | `#7C3AED` | `124,58,237` |
| 03 Problem Discovery | `#0097A7` | `0,151,167` |
| 04 Prioritization | `#C85A40` | `200,90,64` |
| 05 UX Design | `#E07A5F` | `224,122,95` |
| 06 Communication | `#0891B2` | `8,145,178` |
| 07 Analytics | `#158158` | `21,129,88` |
| 08 Launch & Growth | `#0D7A5A` | `13,122,90` |
| 09 Tech 101 | `#7843EE` | `120,67,238` |

---

## Creating a New PM Module — Step by Step

### Step 1: Create Track1 content file

Copy `pm-fundamentals/TEMPLATE_Track1.tsx` → `pm-fundamentals/Track1<ModuleName>.tsx`

Fill in at the top:
```tsx
const ACCENT     = '#YOUR_COLOR';
const ACCENT_RGB = 'R,G,B';
const MODULE_NUM = '10';
const MODULE_LABEL = 'Your Module Name';

const PARTS = [
  { num: '01', id: 'm10-section-one',   label: 'Section One Hook' },
  { num: '02', id: 'm10-section-two',   label: 'Section Two Hook' },
  // ...
];
```

**CRITICAL — IDs must match in 3 places:**
1. `PARTS[].id`
2. `ModuleConfig sections[].id` in the wrapper file
3. `<ChapterSection id="...">` in the JSX

### Step 2: Create Track2 content file

Minimum stub:
```tsx
'use client';
export default function Track2ModuleName({ completedSections = new Set<string>() }: { completedSections?: Set<string> }) {
  return <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--ed-ink3)' }}>APM track coming soon.</div>;
}
```

### Step 3: Create module wrapper file

Create `src/components/<ModuleName>Module.tsx`:
```tsx
'use client';
import ModuleShell, { type ModuleConfig } from '@/components/ModuleShell';
import type { Track } from './pm-fundamentals/designSystem';
import Track1ModuleName from './pm-fundamentals/Track1ModuleName';
import Track2ModuleName from './pm-fundamentals/Track2ModuleName';

const CONFIG: ModuleConfig = {
  accent: '#YOUR_COLOR',
  accentRgb: 'R,G,B',
  moduleNum: '10',
  moduleLabel: 'Your Module Name',
  moduleTime: '45 min · 7 parts',
  completionEmoji: '🎯',
  completionMessage: 'What the learner accomplished — 1-2 sentences.',
  sections: [
    { id: 'm10-section-one', label: 'Section One' },
    { id: 'm10-section-two', label: 'Section Two' },
    // one entry per ChapterSection
  ],
  concepts: [
    { id: 'concept-slug', label: 'Concept Name', color: '#YOUR_COLOR' },
    // one per quiz concept
  ],
  achievements: [
    { id: 'm10-section-one', icon: '🌱', label: 'Badge Name', desc: 'One-line description.' },
    // one per section — id must match section id
  ],
};

interface Props { onBack: () => void; track?: Track | null; }

export default function ModuleNameModule({ onBack, track }: Props) {
  return <ModuleShell config={CONFIG} track={track} onBack={onBack}
                      Track1={Track1ModuleName} Track2={Track2ModuleName} />;
}
```

### Step 4: Wire into page.tsx

```tsx
import ModuleNameModule from '@/components/ModuleNameModule';

// in the reading stage handler:
if (activeModule === '10') {
  return <ModuleNameModule track={assignedTrack} onBack={goBackToOverview} />;
}
```

### Step 5: Unlock in CourseOverview.tsx

Find the module in the `MODULES` array and set `available: true`.

### Step 6: Build before pushing

```bash
npm run build   # must pass cleanly
git add src/components/<ModuleName>Module.tsx src/components/pm-fundamentals/Track1*.tsx ...
git commit -m "..."
git push
```

---

## How Badges and Tracker Work

This is the most important system to understand. There are two separate patterns.

### Pattern A — ModuleShell (PM modules 06+)

Used by: Tech101, LaunchGrowth, Analytics, Communication, UX Design (modules 06-09+).

**How it works:**
- `ModuleShell` uses `useLearnerStore(s => s.completedSections)` to read section completion
- Stores sections under key `moduleId` (e.g. `'launch-growth'`)
- Each `ChapterSection` renders with `data-section={id}` attribute
- `ModuleShell` sets up an IntersectionObserver watching `[data-section]` elements
- When a section is 25% visible: calls `store.markSectionCompleted(moduleId, sectionId)`
- Progress bar, badges, and XP all update automatically from the store

**Learner store API:**
```tsx
const store = useLearnerStore();
store.markSectionCompleted('module-id', 'section-id'); // marks one section done
store.completedSections['module-id'] // string[] of completed section ids
```

**Badge display in ModuleShell:**
Badges render for each item in `config.achievements`. A badge is earned when `completedSections['moduleId'].includes(achievement.id)`. Achievement IDs must match section IDs exactly.

**Updating PM module badges - checklist:**
- Find the wrapper file first: `src/components/<ModuleName>Module.tsx`.
- Update `CONFIG.sections` and `CONFIG.achievements` together. They must have the same section IDs in the same conceptual order.
- Every `achievement.id` must exactly match one `CONFIG.sections[].id` and one `<ChapterSection id="...">` in the Track file.
- If adding/removing/renaming a section, update all four places in one pass: Track `PARTS`, wrapper `CONFIG.sections`, wrapper `CONFIG.achievements`, and Track `<ChapterSection id>`.
- Do not invent a separate badge ID. The badge ID is the section ID.
- After editing badges, search the module for the old ID with `rg "old-id" src/components` and make sure no stale IDs remain.
- To verify in UI, scroll each section until the tracker/badge marks complete. If a badge does not unlock, the cause is almost always an ID mismatch or the rendered section missing `data-section`.

### Pattern B — SWEPreReadLayout (Python/SWE pre-reads)

Used by: SWELanguageBasics (pre-read 0), PythonPreRead1, PythonPreRead2, PythonPreRead3.

**How it works:**
- The pre-read file manages its own `completedModules` as local `useState<Set<string>>`
- The file sets up an IntersectionObserver in a `useEffect`
- On mount, initializes from persisted store: `useLearnerStore(s => s.completedSections[MODULE_ID] ?? [])`
- `SWEPreReadLayout` receives `completedModules: Set<string>` as a prop
- Badge display: `completedModules.has(s.id)` for each section in `sections` prop

**CRITICAL — SWELanguageBasics uses `data-nav-id`, PythonPreRead1-3 use `data-section`:**

SWELanguageBasics observer:
```tsx
const obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('data-nav-id'); // ← data-nav-id
      if (id) {
        setActiveSection(id);
        setCompletedModules(prev => { const n = new Set(prev); n.add(id); return n; });
        markSectionCompleted(MODULE_ID, id);
      }
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20% 0px' });
```

PythonPreRead1/2/3 observer:
```tsx
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.getAttribute("data-section"); // ← data-section
      if (id) { setActiveSection(id); setCompletedModules(prev => new Set([...prev, id])); store.markSectionCompleted(MODULE_ID, id); }
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20% 0px' });
const tid = setTimeout(() => {
  document.querySelectorAll('[data-section]').forEach(el => obs.observe(el));
}, 150); // 150ms delay to ensure DOM is ready
```

**Full SWEPreReadLayout pre-read boilerplate:**
```tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useLearnerStore } from '@/lib/learnerStore';
import { ChapterSection, ... } from './pm-fundamentals/designSystem';
import SWEPreReadLayout from './SWEPreReadLayout';

const MODULE_ID = 'python-pr-01';

const SECTIONS = [
  { id: 'section-one', label: 'Section One Label', icon: '🐍' },
  { id: 'section-two', label: 'Section Two Label', icon: '📦' },
];

const TRACK_CONFIG = { name: 'Python', accent: '#16A34A', accentRgb: '22,163,74', ... };

export default function PythonPreReadN({ onBack }: { onBack: () => void }) {
  const store = useLearnerStore();
  const markSectionCompleted = useLearnerStore(s => s.markSectionCompleted);
  const storedSections = useLearnerStore(s => s.completedSections[MODULE_ID] ?? []);

  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [completedModules, setCompletedModules] = useState<Set<string>>(
    new Set([SECTIONS[0].id]) // initialize first section as always visible
  );

  useEffect(() => {
    // Restore persisted + always include first section
    setCompletedModules(new Set([SECTIONS[0].id, ...storedSections]));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let obs: IntersectionObserver | null = null;
    const tid = setTimeout(() => {
      obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section');
            if (id) {
              setActiveSection(id);
              setCompletedModules(prev => { const n = new Set(prev); n.add(id); return n; });
              markSectionCompleted(MODULE_ID, id);
            }
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -20% 0px' });
      document.querySelectorAll('[data-section]').forEach(el => obs!.observe(el));
    }, 150);
    return () => { clearTimeout(tid); obs?.disconnect(); };
  }, [markSectionCompleted]);

  return (
    <SWEPreReadLayout
      trackConfig={TRACK_CONFIG}
      moduleLabel="PYTHON PRE-READ 0N"
      title="Title of This Pre-Read"
      sections={SECTIONS}
      completedModules={completedModules}
      activeSection={activeSection}
      onBack={onBack}
    >
      <ChapterSection id="section-one" num="01" accentRgb="22,163,74" first>
        {/* content */}
      </ChapterSection>
      <ChapterSection id="section-two" num="02" accentRgb="22,163,74">
        {/* content */}
      </ChapterSection>
    </SWEPreReadLayout>
  );
}
```

---

## Design System Components (designSystem.tsx)

Import from `./designSystem` in Track files.

**CRITICAL: h2, para, keyBox are FUNCTIONS — call them with JSX children:**
```tsx
{h2(<>Section Heading</>)}                              // ✅
{para(<>Body paragraph text.</>)}                       // ✅
{keyBox('Key Takeaways', ['Point one', 'Point two'])}  // ✅
```

### ChapterSection
Required props: `id`, `num`, `accentRgb`. Optional: `first` (removes top border on first section).
```tsx
<ChapterSection id="m10-section-one" num="01" accentRgb="R,G,B" first>
  {/* section content */}
</ChapterSection>
```
`id` must match `PARTS[].id`, `ModuleConfig.sections[].id`, and `ModuleConfig.achievements[].id`.

### SituationCard
```tsx
<SituationCard accent={ACCENT} accentRgb={ACCENT_RGB}>
  Scene-setter text placing Priya in a concrete situation.
</SituationCard>
```

### ConversationScene
For back-and-forth dialogue. All text must be plain JS strings (no HTML entities).
```tsx
<ConversationScene
  mentor="dev" name="Dev" role="Engineer" accent="#3A86FF"
  lines={[
    { speaker: 'priya', text: "Priya's question." },
    { speaker: 'other', text: "Dev's response — shifts her mental model." },
    { speaker: 'priya', text: "Follow-up showing she's starting to get it." },
    { speaker: 'other', text: "The insight that closes the gap." },
  ]}
/>
```
`mentor` must be one of: `'rohan' | 'kiran' | 'maya' | 'dev' | 'asha'`.

### Avatar (Asha only — interactive expandable card)
```tsx
<Avatar
  name="Asha"
  nameColor="var(--teal)"
  borderColor="var(--teal)"
  content={<>Short insight — 1-2 sentences.</>}
  question="MCQ question?"
  options={[
    { text: 'Wrong option — same length as correct', correct: false, feedback: 'Why wrong.' },
    { text: 'Correct option — concise and precise', correct: true,  feedback: 'Why right.' },
    { text: 'Plausible but flawed — similar length', correct: false, feedback: 'What this confuses.' },
  ]}
  conceptId="unique-concept-slug"
/>
```
**MCQ length rule:** All options must be within ~15 chars of each other. Never make the correct answer visually longer.

### QuizEngine
```tsx
<QuizEngine
  conceptId="unique-concept-slug"        // must match Avatar conceptId
  conceptName="Human-Readable Name"
  moduleContext="One sentence of context for AI quiz generation."
  staticQuiz={{
    conceptId: "unique-concept-slug",    // repeat here too — required
    question: "The MCQ question?",
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctIndex: 2,
    explanation: "Why Option C is correct — 1-2 sentences.",
  }}
/>
```

### ApplyItBox
```tsx
<ApplyItBox prompt="What should the learner do right now with this insight?" />
```

### NextChapterTeaser (last section only)
```tsx
<NextChapterTeaser text="One sentence teasing what comes next." />
```

### CharacterChip (hero section character display)
```tsx
import { CharacterChip } from './designSystem';
import { MentorFace } from './MentorFaces';

// In the hero character row:
<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
  {([
    { mentor: 'priya' as const, accent: ACCENT,    name: 'Priya', role: 'APM · EdSpark' },
    { mentor: 'asha'  as const, accent: '#0097A7', name: 'Asha',  role: 'AI Mentor' },
    { mentor: 'dev'   as const, accent: '#3A86FF', name: 'Dev',   role: 'Engineer' },
  ]).map(c => (
    <CharacterChip key={c.mentor} name={c.name} role={c.role} accent={c.accent}>
      <MentorFace mentor={c.mentor} size={52} />
    </CharacterChip>
  ))}
</div>
```
CharacterChip is: fixed 108px, squircle (borderRadius 20px), opaque `var(--ed-card)`, vertical layout (face → name → role), no description text.

---

## TiltCard (3D mouse-tracking wrapper)

**Every interactive tool mockup must be wrapped in TiltCard.** Define locally in each tools file or import from designSystem:

```tsx
const TiltCard = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });
  const handle = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -6, y: ((e.clientX - r.left) / r.width - 0.5) * 6, scale: 1.012 });
  };
  return (
    <div onMouseMove={handle} onMouseLeave={() => setTilt({ x: 0, y: 0, scale: 1 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`, transition: 'transform 0.18s ease', willChange: 'transform', ...style }}>
      {children}
    </div>
  );
};
```

---

## Creating 3D Auto-Running Animations (Tech101Animations pattern)

These are self-running visuals placed inline in content. They teach by motion, no interaction required.

### AnimationShell wrapper

```tsx
const AnimationShell = ({ caption, children }: {
  title?: string; caption: string; children: React.ReactNode;
}) => (
  <div style={{ margin: '32px 0' }}>
    {children}
    <div style={{ padding: '8px 4px 0', fontSize: '11px', color: 'var(--ed-ink3)', fontStyle: 'italic', lineHeight: 1.6 }}>
      {caption}
    </div>
  </div>
);
```

**Key rules:**
- NO labeled header bar — the animation is the visual, not a boxed card
- The `caption` below explains what the animation teaches
- Children render directly with their own styling (dark background if needed, etc.)
- DO NOT wrap children in another card/border — let the content define its own shape

### 3D visual containment, padding, and resolution rules

Use this checklist before building any 3D-looking animation, SVG board, canvas, or interactive visual:

- The outer visual must have a stable box: `width: '100%'`, `maxWidth: '100%'`, `overflow: 'hidden'`, and a fixed `minHeight` or `aspectRatio`.
- Prefer `aspectRatio: '16 / 9'` for wide system diagrams, `aspectRatio: '4 / 3'` for dense boards, and `aspectRatio: '1 / 1'` only for compact widgets.
- Set responsive padding with `padding: 'clamp(14px, 3vw, 28px)'`. Do not use huge fixed padding that crushes mobile.
- Keep inner content inside a safe area. Leave at least 24px visual margin from every edge in desktop layouts and 14px on mobile.
- Do not position important labels at `x=0`, `right: 0`, `top: 0`, or near the SVG/canvas edge. Text will clip.
- For SVG, use one `viewBox` and keep all geometry in that coordinate system. Start with `viewBox="0 0 800 450"` for 16:9 visuals.
- For SVG text, use `textAnchor="middle"` for centered labels, keep labels short, and give every label enough rectangle width for the longest word.
- For canvas/WebGL, render into a container with a known CSS size, then set canvas backing resolution using `devicePixelRatio` capped at 2.
- Never let the canvas decide layout height from its bitmap attributes alone. CSS controls layout; bitmap resolution controls sharpness.
- If a visual has layers, put decorative movement behind the teaching labels. Labels, buttons, and key states must remain readable at rest.
- Test at 390px mobile width and around 900px content width. Nothing should clip, overlap, or require horizontal scrolling.

**Reliable visual container pattern:**
```tsx
const VisualFrame = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      width: '100%',
      maxWidth: '100%',
      aspectRatio: '16 / 9',
      minHeight: 260,
      maxHeight: 520,
      overflow: 'hidden',
      borderRadius: 14,
      background: '#0f172a',
      padding: 'clamp(14px, 3vw, 28px)',
      position: 'relative',
    }}
  >
    {children}
  </div>
);
```

**Responsive SVG pattern:**
```tsx
<svg
  viewBox="0 0 800 450"
  preserveAspectRatio="xMidYMid meet"
  style={{ width: '100%', height: '100%', display: 'block' }}
>
  {/* Keep important content inside x=48..752 and y=36..414 */}
</svg>
```

### Animation pattern — cycling through states

```tsx
export function MyAnimation() {
  const [step, setStep] = useState(0);
  const STATES = ['State A', 'State B', 'State C'];

  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % STATES.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <AnimationShell caption="Caption explaining what this teaches.">
      <div style={{ borderRadius: '12px', background: '#0f172a', padding: '24px' }}>
        {/* Use motion.div with animate prop for smooth transitions */}
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Visual content for current step */}
        </motion.div>
      </div>
    </AnimationShell>
  );
}
```

### Animation pattern — sequential reveal (step by step)

```tsx
export function SchemaBoard() {
  const [linesLit, setLinesLit] = useState(0);

  useEffect(() => {
    const steps = [900, 700, 700, 700, 2000];
    const timers: ReturnType<typeof setTimeout>[] = [];
    let accumulated = 0;
    steps.forEach((delay, i) => {
      accumulated += delay;
      timers.push(setTimeout(() => {
        setLinesLit(i + 1);
        if (i === steps.length - 1) {
          setTimeout(() => setLinesLit(0), 1500); // reset
        }
      }, accumulated));
    });
    return () => timers.forEach(clearTimeout);
  }, [linesLit === 0 ? linesLit : -1]); // re-run only after reset

  return (
    <AnimationShell caption="Relationships illuminate one by one.">
      {/* SVG for schema board — all in one coordinate space */}
      <div style={{ borderRadius: '12px', border: '1px solid var(--ed-rule)', background: 'var(--ed-card)', padding: '20px' }}>
        <svg viewBox="0 0 560 260" style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Lines */}
          <line x1={150} y1={62} x2={410} y2={62}
            stroke={linesLit >= 1 ? '#3B82F6' : 'var(--ed-rule)'}
            strokeWidth={linesLit >= 1 ? 2.5 : 1.5}
            style={{ transition: 'stroke 0.35s, opacity 0.35s' }} />
          {/* Entity boxes */}
          <rect x={40} y={50} width={120} height={48} rx={10}
            fill="#3B82F612" stroke="#3B82F6" strokeWidth={2} />
          <text x={100} y={79} textAnchor="middle" fontSize="14" fontWeight="700" fill="#3B82F6">
            Users
          </text>
        </svg>
      </div>
    </AnimationShell>
  );
}
```

**SVG animation rules:**
- Use a single `viewBox` — all entity positions and line endpoints in SVG coordinates. Never mix HTML absolute positioning with SVG coordinates.
- Use CSS `transition` on SVG attributes for smooth state changes
- Light background (`var(--ed-card)`) with colored borders for daytime readability
- Dark background (`#0f172a`) only for terminal/code-style visuals

### Animation pattern — progress bar / load indicator

```tsx
// Use Framer Motion's animate prop for animated width/height
<motion.div
  animate={{ width: `${pct}%` }}
  transition={{ duration: 0.5 }}
  style={{ height: '100%', background: color, borderRadius: '2px' }}
/>
```

---

## Creating 3D Interactive Tools (Tech101Tools3D pattern)

Interactive tools go in a separate `*Tools3D.tsx` file and are imported into the Track content file.

### ToolShell (standard interactive tool wrapper)

```tsx
const ToolShell = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
  <TiltCard style={{ margin: '32px 0' }}>
    <div style={{ borderRadius: '16px', overflow: 'hidden', border: `1.5px solid ${ACCENT}30`, boxShadow: `0 8px 40px rgba(${ACCENT_RGB},0.12)`, background: 'var(--ed-card)' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0f0f1a 100%)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 32, height: 32, borderRadius: '8px', background: `${ACCENT}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 14, height: 14, borderRadius: '3px', background: ACCENT }} />
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#F1F5F9', fontFamily: "'JetBrains Mono', monospace" }}>{title}</div>
          <div style={{ fontSize: '10px', color: 'rgba(241,245,249,0.45)', fontFamily: "'JetBrains Mono', monospace" }}>{subtitle}</div>
        </div>
      </div>
      {children}
    </div>
  </TiltCard>
);
```

**Interactive tool containment rules:**
- ToolShell owns the outer border, shadow, radius, and header. The tool body should not create a second outer card.
- The immediate body wrapper should use `padding: 'clamp(14px, 3vw, 22px)'`, `overflow: 'hidden'`, and `maxWidth: '100%'`.
- If the tool has columns, use `gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'` so it collapses cleanly on mobile.
- For drag/drop or 3D zones, give the zone a stable `minHeight` and `aspectRatio`; do not let state changes resize the tool.
- Keep controls outside the animated/canvas area when possible, usually in a footer with a top border.
- Do not hide essential feedback only in hover states. Touch users need click/tap feedback.
- On every interactive tool, check these states: untouched, selected, revealed/success, reset, and narrow mobile.

### Tool pattern — click to select, reveal feedback

```tsx
export function MyTool() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const OPTIONS = [
    { label: 'Option A', correct: false, feedback: 'Why A is wrong.' },
    { label: 'Option B', correct: true,  feedback: 'Why B is right.' },
    { label: 'Option C', correct: false, feedback: 'Why C is wrong.' },
  ];

  return (
    <ToolShell title="Tool Name" subtitle="What this tool teaches">
      <div style={{ padding: '16px 20px' }}>
        {OPTIONS.map((opt, i) => {
          const isChosen = selected === i;
          const isCorrect = opt.correct;
          let bg = 'var(--ed-cream)', border = 'var(--ed-rule)', color = 'var(--ed-ink2)';
          if (revealed && isCorrect) { bg = `rgba(22,163,74,0.12)`; border = '#16A34A'; color = '#16A34A'; }
          else if (revealed && isChosen) { bg = 'rgba(239,68,68,0.1)'; border = '#EF4444'; color = '#EF4444'; }
          else if (isChosen) { bg = `${ACCENT}12`; border = ACCENT; color = ACCENT; }
          return (
            <motion.div key={i} whileHover={!revealed ? { x: 3 } : {}}
              onClick={() => !revealed && setSelected(i)}
              style={{ padding: '10px 14px', borderRadius: '8px', background: bg,
                border: `1.5px solid ${border}`, cursor: revealed ? 'default' : 'pointer',
                marginBottom: '8px', color, transition: 'all 0.15s' }}>
              {opt.label}
            </motion.div>
          );
        })}

        {!revealed ? (
          <button onClick={() => selected !== null && setRevealed(true)}
            disabled={selected === null}
            style={{ padding: '8px 20px', borderRadius: '8px', background: selected !== null ? ACCENT : 'var(--ed-rule)',
              color: selected !== null ? '#fff' : 'var(--ed-ink3)', border: 'none',
              fontSize: '11px', fontWeight: 700, cursor: selected !== null ? 'pointer' : 'not-allowed' }}>
            Reveal answer
          </button>
        ) : (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: `rgba(22,163,74,0.08)`,
            border: '1px solid rgba(22,163,74,0.3)', fontSize: '12px', color: 'var(--ed-ink2)' }}>
            {OPTIONS[selected!].feedback}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
```

### Tool pattern — terminal step-through simulation

```tsx
export function TerminalSim() {
  const [step, setStep] = useState(-1);
  const STEPS = [
    { cmd: '$ python main.py', output: 'ModuleNotFoundError: No module named requests', color: '#f87171' },
    { cmd: '$ source venv/bin/activate', output: '(venv) $ ← venv is now active', color: '#16A34A' },
    { cmd: '(venv) $ pip install requests', output: 'Successfully installed requests-2.31.0', color: '#16A34A' },
  ];

  return (
    <ToolShell title="Terminal Simulator" subtitle="Step through to fix the error">
      <div style={{ background: '#020617', padding: '16px 20px', minHeight: '140px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', lineHeight: 1.8 }}>
        {STEPS.slice(0, step + 1).map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            <div style={{ color: '#4ade80' }}>{s.cmd}</div>
            <div style={{ color: s.color }}>{s.output}</div>
          </motion.div>
        ))}
      </div>
      <div style={{ padding: '10px 20px', background: 'var(--ed-cream)', borderTop: '1px solid var(--ed-rule)', display: 'flex', gap: '8px' }}>
        <button onClick={() => setStep(-1)} style={{ padding: '6px 14px', borderRadius: '7px', border: '1px solid var(--ed-rule)', background: 'var(--ed-bg)', fontSize: '11px', cursor: 'pointer', color: 'var(--ed-ink3)' }}>Reset</button>
        <button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
          disabled={step >= STEPS.length - 1}
          style={{ padding: '6px 16px', borderRadius: '7px', background: ACCENT, color: '#fff', border: 'none', fontSize: '11px', fontWeight: 700, cursor: step < STEPS.length - 1 ? 'pointer' : 'not-allowed', opacity: step >= STEPS.length - 1 ? 0.5 : 1 }}>
          {step === -1 ? 'Start' : 'Next step →'}
        </button>
      </div>
    </ToolShell>
  );
}
```

### Tool pattern — side-by-side comparison (no tabs)

Show all states simultaneously. Never use tabs for comparisons — show all panels side by side.

```tsx
export function ComparisonBoard() {
  const PANELS = [
    { label: 'Bad approach', color: '#EF4444', mood: 'Broken', content: <BadContent /> },
    { label: 'Better', color: '#CA8A04', mood: 'Uncertain', content: <BetterContent /> },
    { label: 'Best approach', color: '#16A34A', mood: 'Clear', content: <BestContent /> },
  ];
  return (
    <ToolShell title="Comparison Board" subtitle="All three approaches visible at once">
      <div style={{ padding: '16px 20px', display: 'flex', gap: '12px' }}>
        {PANELS.map((p, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ padding: '5px 10px', borderRadius: '6px 6px 0 0', background: `${p.color}15`, border: `1px solid ${p.color}30`, borderBottom: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: p.color }}>{p.label}</div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
            </div>
            <div style={{ borderRadius: '0 0 8px 8px', border: `1px solid ${p.color}30`, background: '#0f172a', padding: '14px' }}>
              {p.content}
            </div>
            <div style={{ marginTop: '6px', padding: '6px 10px', borderRadius: '6px', background: `${p.color}08`, border: `1px solid ${p.color}20`, fontSize: '10px', color: p.color, fontWeight: 700 }}>
              {p.mood}
            </div>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
```

---

## Characters and Faces

### PM Characters (MentorFace)

```tsx
import { MentorFace } from './MentorFaces';
// Valid ids: 'priya' | 'asha' | 'rohan' | 'kiran' | 'maya' | 'dev'
<MentorFace mentor="asha" size={52} />
```

| Name | MentorId | Role | Accent |
|------|----------|------|--------|
| Priya | `priya` | APM · EdSpark | module accent |
| Asha | `asha` | AI Mentor | `#0097A7` |
| Rohan | `rohan` | CEO · EdSpark | `#E67E22` |
| Kiran | `kiran` | Data Analyst | `#3A86FF` |
| Maya | `maya` | Designer | `#C85A40` |
| Dev | `dev` | Engineer | `#3A86FF` |

### Python Characters (PythonMentorFace)

```tsx
import { PythonMentorFace } from '../PythonMentorFace';
// Valid ids: 'arjun' | 'nisha' | 'kabir' | 'meera'
<PythonMentorFace char="arjun" size={52} />
```

### SWE Characters (SWEMentorFace)

```tsx
import { SWEMentorFace } from './sweDesignSystem';
// Supports names: 'Aisha', 'Riya', 'Vikram', 'Kavya', 'Leo', 'Mei', and others
<SWEMentorFace name="Aisha" size={52} />
```

---

## Brand Components (AirtribeBrand.tsx)

Always import logo and dark mode toggle from this shared file:

```tsx
import { AirtribeLogo, DarkModeToggle } from './AirtribeBrand';
// or from '@/components/AirtribeBrand' if in a subdirectory

// AirtribeLogo accepts optional color prop for use outside .editorial:
<AirtribeLogo />                    // inside .editorial — uses var(--ed-ink)
<AirtribeLogo color={inkColor} />   // outside .editorial — pass JS color variable

// DarkModeToggle — reads/writes localStorage 'airtribe_dark',
// toggles document.documentElement.classList 'dark'
<DarkModeToggle />
```

Every pre-read layout (ModuleShell, SWEPreReadLayout, GenAI pre-reads) includes `<DarkModeToggle />` in its sticky nav header.

---

## Routing (page.tsx)

All navigation state lives in `page.tsx`. Key stages:

```
'home'          → SeriesHomepage
'quiz'          → PlacementQuiz (PM track assignment)
'overview'      → CourseOverview (PM module list)
'reading'       → PM module content (activeModule determines which)
'genai-quiz'    → GenAIPlacementQuiz
'genai'         → GenAILaunchpadOverview
'genai-reading' → GenAI pre-reads (genaiModule determines which)
'swe-select'    → SWETrackSelection
'swe-quiz'      → SWEPlacementQuiz
'swe'           → SWELaunchpadOverview
'swe-lang-basics' → SWELanguageBasics (pre-read 00)
'swe-reading'   → SWE pre-reads (sweTrack + sweModule determine which)
```

To add a new PM module:
```tsx
import NewModule from '@/components/NewModule';
// in the reading stage:
if (activeModule === 'N') return <NewModule track={assignedTrack} onBack={goBackToOverview} />;
```

To add a new Python pre-read:
```tsx
import PythonPreRead4 from '@/components/PythonPreRead4';
// in the swe-reading stage, Python branch:
if (sweModule === '04') return <PythonPreRead4 onBack={goBackToSWEOverview} />;
```

---

## SWELaunchpadOverview — Progress State

Module cards show live progress from the learner store. For Python pre-reads, the section counts are defined in `SWELaunchpadOverview.tsx`:

```tsx
const PYTHON_MODULE_SECTIONS: Record<string, { moduleId: string; total: number }> = {
  '00': { moduleId: 'swe-pr-00',    total: 8 },
  '01': { moduleId: 'python-pr-01', total: 8 },
  '02': { moduleId: 'python-pr-02', total: 8 },
  '03': { moduleId: 'python-pr-03', total: 7 },
};
```

When adding a new Python pre-read (e.g. `04`), add its entry here with the correct moduleId and total section count.

Card states: `locked` | `available` | `in-progress` | `completed`
CTA labels: `Start →` | `Continue →` | `Review →`

---

## Common Pitfalls

### JSX text nodes — no HTML entities, no unicode escapes

```tsx
// ❌ WRONG — renders literally as &amp; in JSX text
<>{h2(<>Data Types &amp; Structures</>)}</>

// ✅ CORRECT — use literal Unicode character
<>{h2(<>Data Types & Structures</>)}</>

// ✅ Also fine in JS string props
role: 'APM · EdSpark'  // literal middot character
```

### No \uXXXX in JSX text nodes

```tsx
// ❌ WRONG — renders as literal ’
{h2(<>You Can’t Cross</>)}

// ✅ CORRECT — use HTML entity in JSX text
{h2(<>You Can&rsquo;t Cross</>)}

// ✅ Fine in JS string (e.g. props, data)
title: "You Can’t Cross"  // works in JS strings
```

### ChapterSection requires id + num + accentRgb

```tsx
// ❌ Missing required props — will crash
<ChapterSection id="m10-section">...</ChapterSection>

// ✅ All three required
<ChapterSection id="m10-section" num="01" accentRgb="R,G,B" first>
```

### Avatar — only for Asha

Only `name="Asha"` is reliably mapped in the Avatar component. For other characters (Kiran, Rohan, Dev), use a custom div or ConversationScene.

### QuizEngine staticQuiz — conceptId required inside too

```tsx
<QuizEngine
  conceptId="slug"              // required on component
  staticQuiz={{
    conceptId: "slug",          // also required INSIDE staticQuiz
    question: "...",
    ...
  }}
/>
```

### Section ID must match in all 3 places

When creating a new section, the same ID string must appear in:
1. `PARTS` array (Track file) — `{ id: 'm10-slug', ... }`
2. `CONFIG.sections` (Module wrapper) — `{ id: 'm10-slug', label: '...' }`
3. `CONFIG.achievements` (Module wrapper) — `{ id: 'm10-slug', ... }`
4. `<ChapterSection id="m10-slug">` (Track file JSX)

If any of these mismatch, the badge for that section will never mark as complete.

### CharacterChip — no description text

CharacterChip shows name + short role only. Do NOT include a `desc` or `description` field in character data — it is intentionally excluded from the chip display.

### Build before pushing

```bash
npm run build  # must pass with zero TypeScript errors
```

---

## Section Content Rhythm (per section)

Each ChapterSection should follow this rhythm:

1. **SituationCard** — place Priya/protagonist in a concrete situation
2. **ConversationScene** — 4-turn dialogue showing the mistaken model being corrected
3. **h2** + **para** — concept explanation grounded in the situation
4. **Auto-animation** — teaching visual (if applicable to this module)
5. **Interactive tool** — learner manipulates the concept
6. **keyBox** or **PMPrinciple** — 3 memorable takeaways
7. **Avatar** (Asha) — reinforcement with embedded MCQ
8. **QuizEngine** — standalone MCQ for XP
9. **ApplyItBox** — concrete action prompt

Not all sections need all 9 steps. At minimum: SituationCard + h2 + para + keyBox + QuizEngine.

---

## XP and Gamification

- `SECTION_XP = 50` per section completed (triggered by IntersectionObserver)
- `MAX_QUIZ_XP_PER_CONCEPT = 100` per concept (FSRS pKnow based)
- Levels: Curious (0) → Thinker (150) → Practitioner (350) → PM-Minded (600) → PM Thinker (850)
- Lead Engineer / Senior Developer (SWE levels in SWEPreReadLayout)

XP is persisted in Zustand store + localStorage. Never resets on navigation.

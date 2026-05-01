const fs = require('fs');

const path = 'src/components/SWELanguageBasics.tsx';
let content = fs.readFileSync(path, 'utf8');

// The new Components to insert
const newSections = `
// ─── Micro-Practice ────────────────────────────────────────────────────────
function QuickTry({ track, conceptId, label, placeholder, solution }: { track: SWETrack, conceptId: string, label: string, placeholder: string, solution: string }) {
  const [code, setCode] = React.useState(placeholder);
  const [complete, setComplete] = React.useState(false);
  
  const check = () => {
    if (code.replace(/\\s+/g, '').includes(solution.replace(/\\s+/g, ''))) {
      setComplete(true);
    }
  };
  
  return (
    <div style={{ marginTop: '24px', marginBottom: '24px', border: '1px solid var(--ed-rule)', borderRadius: '10px', overflow: 'hidden', background: '#0f172a' }}>
      <div style={{ background: '#1e293b', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>⚡ QUICK TRY: {label}</span>
        {complete && <span style={{ color: '#10b981', fontSize: '12px' }}>✓ +50 XP</span>}
      </div>
      <div style={{ padding: '16px' }}>
        <textarea 
          value={code} 
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
          disabled={complete}
          style={{ width: '100%', minHeight: '60px', background: 'transparent', border: 'none', color: '#cbd5e1', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', outline: 'none', resize: 'vertical' }}
        />
        {!complete && (
          <button onClick={check} style={{ marginTop: '12px', padding: '6px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" }}>
            Run
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Visualizers ──────────────────────────────────────────────────────────
function DataBehaviorVisualizer() {
  const [mode, setMode] = React.useState<'array' | 'set' | 'map'>('array');
  const [items, setItems] = React.useState<any[]>(['apple', 'banana', 'apple']);
  
  const pushToStruct = () => {
    if (mode === 'array') setItems([...items, 'apple']);
    if (mode === 'set') {
      const idx = items.indexOf('apple');
      if (idx !== -1) {
        // Flash collision
        const el = document.getElementById('set-box');
        if (el) { el.style.border = '2px solid red'; setTimeout(() => el.style.border = '2px solid #059669', 300); }
      } else {
        setItems([...items, 'apple']);
      }
    }
    if (mode === 'map') setItems([...items.filter(i => i.k !== 'usr1'), {k: 'usr1', v: 'Aisha'}]);
  };
  
  React.useEffect(() => {
    if (mode === 'array') setItems(['apple', 'banana', 'apple']);
    if (mode === 'set') setItems(['apple', 'banana']);
    if (mode === 'map') setItems([{k: 'usr1', v: 'Aisha'}, {k: 'usr2', v: 'Leo'}]);
  }, [mode]);

  return (
    <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', padding: '24px', margin: '32px 0' }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        {['array', 'set', 'map'].map(m => (
          <button key={m} onClick={() => setMode(m as any)} style={{ padding: '8px 16px', borderRadius: '20px', border: mode === m ? '2px solid #0369a1' : '1px solid var(--ed-rule)', background: mode === m ? '#e0f2fe' : 'var(--ed-cream)', color: mode === m ? '#0369a1' : 'var(--ed-ink)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase' }}>
            {m}
          </button>
        ))}
      </div>
      
      <div id="set-box" style={{ display: 'flex', gap: '10px', alignItems: 'center', transition: 'all 0.3s', minHeight: '60px', padding: '16px', background: 'var(--ed-cream)', borderRadius: '8px', border: '2px solid #059669' }}>
        {items.map((it, i) => (
          <div key={i} style={{ padding: '8px 16px', background: '#d1fae5', color: '#065f46', borderRadius: '6px', fontSize: '13px', fontFamily: "'JetBrains Mono', monospace" }}>
            {mode === 'map' ? \`\${it.k} : \${it.v}\` : it}
          </div>
        ))}
        {mode !== 'map' && <button onClick={pushToStruct} style={{ padding: '4px 8px', borderRadius: '4px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer' }}>+ Add 'apple'</button>}
      </div>
      
      <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--ed-ink2)' }}>
        {mode === 'array' && "Arrays blindly append. Notice how 'apple' appears multiple times."}
        {mode === 'set' && "Sets mathematically enforce uniqueness. Try adding 'apple' — it's blocked instantly."}
        {mode === 'map' && "Maps link distinct keys to values for O(1) lookups. No looping required to find 'usr1'."}
      </p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// 7 Sections Pedagogy
// ════════════════════════════════════════════════════════════════════════════════

function Section1Variables({ track, level }: Props) {
  const story = BASICS_STORY[track][level].variables || BASICS_STORY['python']['beginner'].variables;
  return (
    <section>
      <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: "'Lora', serif", color: 'var(--ed-ink)', marginBottom: '24px' }}>1. Variables & Output</h2>
      <StoryCard open={story.open} story={story.story} />
      <SWEConversationScene lines={story.avatarLines} mentorName={story.mentorName} mentorRole={story.mentorRole} mentorColor={story.mentorColor} />
      <QuickTry track={track} conceptId="variables" label="Declare & Print" placeholder={track==='python'?"# Assign 42 to x, then print it\\nx =":track==='java'?"// Assign 42 to x, then print it\\nint x =":"// Assign 42 to x, then print it\\nconst x ="} solution="42" />
    </section>
  );
}

function Section2ControlFlow({ track, level }: Props) {
  const story = BASICS_STORY[track][level].flow || BASICS_STORY['python']['beginner'].flow;
  return (
    <section>
      <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: "'Lora', serif", color: 'var(--ed-ink)', marginBottom: '24px' }}>2. Control Flow</h2>
      <StoryCard open={story.open} story={story.story} />
      <SWEConversationScene lines={story.avatarLines} mentorName={story.mentorName} mentorRole={story.mentorRole} mentorColor={story.mentorColor} />
      <QuickTry track={track} conceptId="flow" label="If/Else Branching" placeholder={track==='python'?"score = 80\\n# Write an if/else to print 'Pass' if score > 50":"const score = 80;\\n// Write an if/else to log 'Pass' if score > 50"} solution={track==='java'?"System.out.println":"print"} />
    </section>
  );
}

function Section3Loops({ track, level }: Props) {
  const story = BASICS_STORY[track][level].loops || BASICS_STORY['python']['beginner'].loops;
  return (
    <section>
      <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: "'Lora', serif", color: 'var(--ed-ink)', marginBottom: '24px' }}>3. Iteration & Loops</h2>
      <StoryCard open={story.open} story={story.story} />
      <SWEConversationScene lines={story.avatarLines} mentorName={story.mentorName} mentorRole={story.mentorRole} mentorColor={story.mentorColor} />
      <QuickTry track={track} conceptId="loops" label="Loop 1 to 5" placeholder={track==='python'?"# Write a loop to print 1 to 5\\n":"// Write a loop to print 1 to 5\\n"} solution="5" />
    </section>
  );
}

function Section4Functions({ track, level }: Props) {
  const story = BASICS_STORY[track][level].functions || BASICS_STORY['python']['beginner'].functions;
  return (
    <section>
      <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: "'Lora', serif", color: 'var(--ed-ink)', marginBottom: '24px' }}>4. Encapsulation (Functions)</h2>
      <StoryCard open={story.open} story={story.story} />
      <SWEConversationScene lines={story.avatarLines} mentorName={story.mentorName} mentorRole={story.mentorRole} mentorColor={story.mentorColor} />
      <QuickTry track={track} conceptId="fx" label="Write add()" placeholder={track==='python'?"# def add(a, b): return a + b\\n":"// function add(a, b) { return a + b; }\\n"} solution="+" />
    </section>
  );
}

function Section5Objects({ track, level }: Props) {
  const story = BASICS_STORY[track][level].objects || BASICS_STORY['python']['beginner'].objects;
  return (
    <section>
      <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: "'Lora', serif", color: 'var(--ed-ink)', marginBottom: '24px' }}>5. Objects & Memory</h2>
      <StoryCard open={story.open} story={story.story} />
      <SWEConversationScene lines={story.avatarLines} mentorName={story.mentorName} mentorRole={story.mentorRole} mentorColor={story.mentorColor} />
      {/* Retain 3D Memory Box to show references */}
      <div style={{ height: '300px', background: '#000', borderRadius: '12px', marginTop: '24px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 12, left: 16, zIndex: 10, color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.1em' }}>HEAP VISUALIZER (3D)</div>
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 4, 8], fov: 40 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[5, 10, 5]} intensity={0.8} />
              <MemoryBox position={[-2, 0, 0]} label="Stack" color="#ef4444" />
              <MemoryBox position={[2, 0, 0]} label="Heap (Object)" color="#10b981" />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </Suspense>
      </div>
    </section>
  );
}

function Section6DataStructures({ track, level }: Props) {
  const story = BASICS_STORY[track][level].dataStructures || BASICS_STORY['python']['beginner'].dataStructures;
  return (
    <section>
      <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: "'Lora', serif", color: 'var(--ed-ink)', marginBottom: '24px' }}>6. Fast Data (Sets & Maps)</h2>
      <StoryCard open={story.open} story={story.story} />
      <SWEConversationScene lines={story.avatarLines} mentorName={story.mentorName} mentorRole={story.mentorRole} mentorColor={story.mentorColor} />
      <DataBehaviorVisualizer />
    </section>
  );
}

function Section7Challenge({ track, level }: Props) {
  const story = BASICS_STORY[track][level].challenge || BASICS_STORY['python']['beginner'].challenge;
  return (
    <section>
      <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: "'Lora', serif", color: 'var(--ed-ink)', marginBottom: '24px' }}>7. Final Challenge: Build it.</h2>
      <StoryCard open={story.open} story={story.story} />
      <SWEConversationScene lines={story.avatarLines} mentorName={story.mentorName} mentorRole={story.mentorRole} mentorColor={story.mentorColor} />
      <div style={{ background: 'var(--ed-card)', padding: '24px', border: '1px solid var(--ed-rule)', borderRadius: '12px', marginTop: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '12px' }}>Real World Task</h3>
        <p style={{ fontSize: '14px', color: 'var(--ed-ink2)' }}>{track === 'java' ? 'Build a simple Contact Manager Class using a HashMap to store IDs and fetch Names instantly.' : track === 'python' ? 'Build a Number Guessing loop using a Set to block duplicate guesses.' : 'Build a To-Do list using Array methods and Map structures.'}</p>
        <QuickTry track={track} conceptId="challenge" label="Build App" placeholder={"// Scaffold structure loaded...\\n"} solution={track === 'python' ? 'def' : 'return'} />
      </div>
    </section>
  );
}
`;

// Replace everything from `function Section1Identity` up to `// Main Export`
const startRegex = /function Section1Identity.*?\{.*?(?=function Section|\/\/ ════════════════════════════════════════════════════════════════════════════════\n\/\/ Main Export)/s;
const bulkCut = /function Section1Identity.*?(?=\/\/ ════════════════════════════════════════════════════════════════════════════════\n\/\/ Main Export)/s;

content = content.replace(bulkCut, newSections);

// Now update ACHIEVEMENTS using standard string replace
content = content.replace(
  /const ACHIEVEMENTS = \[.*?\];/s,
  "const ACHIEVEMENTS = [\n" +
  "  { id: 'variables', label: 'Variables', icon: '📝', desc: 'Declared state' },\n" +
  "  { id: 'flow', label: 'Flow', icon: '🔀', desc: 'Control logic' },\n" +
  "  { id: 'loops', label: 'Loops', icon: '🔄', desc: 'Iteration logic' },\n" +
  "  { id: 'functions', label: 'Functions', icon: '📦', desc: 'Encapsulated code' },\n" +
  "  { id: 'objects', label: 'Objects', icon: '🧩', desc: 'State instances' },\n" +
  "  { id: 'dataStructures', label: 'Sets & Maps', icon: '⚡', desc: 'O(1) Data lookup' },\n" +
  "  { id: 'challenge', label: 'Scaffold Built', icon: '🏗️', desc: 'First mini-app' },\n" +
  "];"
);

content = content.replace(
  /const SECTIONS = \[.*?\];/s,
  "const SECTIONS = [\n" +
  "  { id: 'variables', label: 'Variables & Output' },\n" +
  "  { id: 'flow', label: 'Control Flow' },\n" +
  "  { id: 'loops', label: 'Loops' },\n" +
  "  { id: 'functions', label: 'Functions' },\n" +
  "  { id: 'objects', label: 'Objects & Memory' },\n" +
  "  { id: 'dataStructures', label: 'Data Structures' },\n" +
  "  { id: 'challenge', label: 'Final Challenge' },\n" +
  "];"
);

// Update rendering `<div data-section...>` inside Main Export
content = content.replace(
  /<div data-section="identity">.*?<div data-section="challenge">.*?<\/div>/s,
  '<div data-section="variables"><Section1Variables track={track} level={level} /></div>\n' +
  '<div data-section="flow"><Section2ControlFlow track={track} level={level} /></div>\n' +
  '<div data-section="loops"><Section3Loops track={track} level={level} /></div>\n' +
  '<div data-section="functions"><Section4Functions track={track} level={level} /></div>\n' +
  '<div data-section="objects"><Section5Objects track={track} level={level} /></div>\n' +
  '<div data-section="dataStructures"><Section6DataStructures track={track} level={level} /></div>\n' +
  '<div data-section="challenge"><Section7Challenge track={track} level={level} /></div>'
);

// Update active section hook state
content = content.replace(
  /const \[activeSection, setActiveSection\] = useState<string>\('identity'\);/,
  "const [activeSection, setActiveSection] = useState<string>('variables');"
);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully injected 7-section blueprint.');

'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, OrbitControls, RoundedBox, MeshDistortMaterial, Sphere, Torus } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import type { SWETrack, SWELevel } from './sweTypes';
import { BASICS_STORY } from './sweBasicsStoryData';
import { StoryCard, SWEConversationScene, SWEAvatar } from './sweDesignSystem';
// ─── Types ────────────────────────────────────────────────────────────────────
interface Props { track: SWETrack; level: SWELevel; onBack: () => void; }

// ─── Track palette & identity ─────────────────────────────────────────────────
const TRACK_CONFIG: Record<SWETrack, {
  name: string; emoji: string; color: string; colorHex: number;
  gradientA: string; gradientB: string; bg: string;
  tagline: string;
}> = {
  java: {
    name: 'Java', emoji: '☕', color: '#0369A1', colorHex: 0x0369a1,
    gradientA: '#0369A1', gradientB: '#7C3AED', bg: 'rgba(3,105,161,0.06)',
    tagline: 'Compiled · Strongly Typed · JVM-Powered',
  },
  python: {
    name: 'Python', emoji: '🐍', color: '#16A34A', colorHex: 0x16a34a,
    gradientA: '#16A34A', gradientB: '#0D9488', bg: 'rgba(22,163,74,0.06)',
    tagline: 'Interpreted · Dynamically Typed · Batteries Included',
  },
  nodejs: {
    name: 'Node.js', emoji: '⚡', color: '#CA8A04', colorHex: 0xca8a04,
    gradientA: '#CA8A04', gradientB: '#16A34A', bg: 'rgba(202,138,4,0.06)',
    tagline: 'Event-Driven · Non-Blocking · V8-Powered',
  },
};

// ─── Language DNA data ────────────────────────────────────────────────────────
const DNA_CARDS: Record<SWETrack, { label: string; icon: string; detail: string; color: string }[]> = {
  java: [
    { label: 'Strongly Typed', icon: '🔒', detail: 'Every variable has a declared type. The compiler catches type errors before your code runs — not at 3am in production.', color: '#0369A1' },
    { label: 'Compiled to Bytecode', icon: '⚙️', detail: 'javac turns your .java source into .class bytecode. The JVM runs that bytecode on any OS — Write Once, Run Anywhere.', color: '#7C3AED' },
    { label: 'JVM Managed Memory', icon: '🧠', detail: 'The JVM allocates heap memory for objects and runs garbage collection automatically. You rarely call free().', color: '#0891B2' },
    { label: 'Object-Oriented', icon: '📦', detail: "Everything lives inside a class. Java forces you into OOP — which scales to teams of 100+ engineers writing the same codebase.", color: '#059669' },
    { label: 'Verbose by Design', icon: '📝', detail: 'Java is explicit. This feels slow at first. At scale, explicitness means fewer "what does this do?" conversations.', color: '#D97706' },
    { label: 'Platform Independent', icon: '🌍', detail: 'Your .class files run on any machine that has a JVM — Linux servers, Windows desktops, Android phones.', color: '#DC2626' },
  ],
  python: [
    { label: 'Dynamically Typed', icon: '🔄', detail: 'Variables have no declared type. x = 5 then x = "hello" is perfectly valid. Power and footgun rolled into one.', color: '#16A34A' },
    { label: 'Interpreted', icon: '▶️', detail: 'CPython reads your source line by line and runs it. No compile step. Errors surface at runtime, not compile time.', color: '#0D9488' },
    { label: 'Everything is an Object', icon: '🌐', detail: 'Even integers and functions are objects in Python. type(42) is <class int>. This uniformity makes Python feel magical.', color: '#7C3AED' },
    { label: 'Indentation = Syntax', icon: '⬇️', detail: "Whitespace is not cosmetic — it defines code blocks. No curly braces. Get the indent wrong and you'll get an IndentationError.", color: '#0369A1' },
    { label: 'Batteries Included', icon: '🔋', detail: 'The standard library covers HTTP, JSON, regex, math, CSV, datetime, and more. Most tasks need zero external packages.', color: '#D97706' },
    { label: 'Readable First', icon: '📖', detail: "Python's philosophy: code is read far more often than it's written. Readability counts — it's in the Zen of Python.", color: '#DC2626' },
  ],
  nodejs: [
    { label: 'JavaScript Runtime', icon: '🟨', detail: 'Node.js is not a language — it is a runtime that lets JavaScript run outside the browser on servers and CLIs.', color: '#CA8A04' },
    { label: 'Event-Driven', icon: '🔔', detail: "Your code registers handlers, Node runs the event loop, events fire handlers. This is why one Node process can handle thousands of simultaneous connections.", color: '#16A34A' },
    { label: 'Non-Blocking I/O', icon: '🚦', detail: 'File reads, DB queries, HTTP calls — Node starts them and moves on. Callbacks or Promises fire when they complete. Nothing blocks.', color: '#0369A1' },
    { label: 'V8-Powered', icon: '⚡', detail: "Node uses Chrome's V8 engine, which JIT-compiles JavaScript to native machine code. It's fast — not Python fast, but production-fast.", color: '#7C3AED' },
    { label: 'npm Ecosystem', icon: '📦', detail: 'npm hosts 2M+ packages. Express, React, lodash, moment — most of what you need is one npm install away.', color: '#0891B2' },
    { label: 'One Language Full Stack', icon: '🔗', detail: 'JavaScript on the frontend, Node.js on the backend. Share types, utilities, and validation logic between both.', color: '#DC2626' },
  ],
};

// ─── Type data ────────────────────────────────────────────────────────────────
const TYPE_DATA: Record<SWETrack, { name: string; example: string; color: string; note: string }[]> = {
  java: [
    { name: 'int', example: 'int age = 25;', color: '#0369A1', note: '32-bit integer. Primitive — lives on the stack.' },
    { name: 'double', example: 'double price = 9.99;', color: '#7C3AED', note: '64-bit float. Use this for decimals, not float.' },
    { name: 'boolean', example: 'boolean isActive = true;', color: '#059669', note: 'Only true or false. 1 bit of information.' },
    { name: 'String', example: 'String name = "Vikram";', color: '#D97706', note: 'Reference type — lives on the heap. Immutable.' },
    { name: 'int[]', example: 'int[] scores = {90, 85, 78};', color: '#DC2626', note: 'Fixed-size array. Length set at creation.' },
    { name: 'var', example: 'var msg = "Hello";', color: '#0891B2', note: 'Java 10+. Type inferred at compile time. Still strongly typed.' },
  ],
  python: [
    { name: 'int', example: 'age = 25', color: '#16A34A', note: 'Arbitrary precision — no overflow. type(age) → <class int>' },
    { name: 'float', example: 'price = 9.99', color: '#0D9488', note: '64-bit IEEE 754. Watch out for 0.1 + 0.2 ≠ 0.3.' },
    { name: 'bool', example: 'is_active = True', color: '#7C3AED', note: 'True/False (capitalised). bool is a subclass of int.' },
    { name: 'str', example: "name = 'Aisha'", color: '#D97706', note: 'Immutable sequence of Unicode characters.' },
    { name: 'list', example: 'scores = [90, 85, 78]', color: '#0369A1', note: 'Mutable, ordered, heterogeneous. Your workhorse.' },
    { name: 'dict', example: "user = {'id': 1, 'name': 'Aisha'}", color: '#DC2626', note: 'Hash map. O(1) lookups by key.' },
  ],
  nodejs: [
    { name: 'number', example: 'const age = 25;', color: '#CA8A04', note: '64-bit float for everything. Integers are just floats without a decimal.' },
    { name: 'string', example: "const name = 'Leo';", color: '#16A34A', note: 'Primitive — but auto-boxing makes it behave like an object.' },
    { name: 'boolean', example: 'const isActive = true;', color: '#7C3AED', note: "true/false (lowercase). 12 things are falsy in JS — know them all.", },
    { name: 'array', example: 'const scores = [90, 85, 78];', color: '#0369A1', note: 'Objects with numeric keys. push(), map(), filter() are your tools.' },
    { name: 'object', example: "const user = { id: 1, name: 'Leo' };", color: '#0891B2', note: 'Key-value pairs. References, not copies — mutations surprise beginners.' },
    { name: 'undefined', example: 'let x; // undefined', color: '#DC2626', note: 'Variable declared but not assigned. Different from null.' },
  ],
};

// ─── Control flow data ────────────────────────────────────────────────────────
const FLOW_DATA: Record<SWETrack, { title: string; code: string[]; highlight: string }[]> = {
  java: [
    { title: 'if / else', code: ['if (score >= 90) {', '  grade = "A";', '} else if (score >= 70) {', '  grade = "B";', '} else {', '  grade = "C";', '}'], highlight: '#0369A1' },
    { title: 'for loop', code: ['for (int i = 0; i < 5; i++) {', '  System.out.println(i);', '}'], highlight: '#7C3AED' },
    { title: 'while loop', code: ['while (count > 0) {', '  process(count);', '  count--;', '}'], highlight: '#059669' },
    { title: 'enhanced for', code: ['for (String name : names) {', '  System.out.println(name);', '}'], highlight: '#D97706' },
  ],
  python: [
    { title: 'if / elif / else', code: ['if score >= 90:', '    grade = "A"', 'elif score >= 70:', '    grade = "B"', 'else:', '    grade = "C"'], highlight: '#16A34A' },
    { title: 'for loop', code: ['for i in range(5):', '    print(i)'], highlight: '#0D9488' },
    { title: 'while loop', code: ['while count > 0:', '    process(count)', '    count -= 1'], highlight: '#7C3AED' },
    { title: 'list comprehension', code: ['evens = [x for x in range(10)', '         if x % 2 == 0]'], highlight: '#D97706' },
  ],
  nodejs: [
    { title: 'if / else', code: ['if (score >= 90) {', "  grade = 'A';", '} else if (score >= 70) {', "  grade = 'B';", '} else {', "  grade = 'C';", '}'], highlight: '#CA8A04' },
    { title: 'for loop', code: ['for (let i = 0; i < 5; i++) {', '  console.log(i);', '}'], highlight: '#16A34A' },
    { title: 'forEach', code: ['names.forEach(name => {', '  console.log(name);', '});'], highlight: '#7C3AED' },
    { title: 'map / filter', code: ['const evens = nums', '  .filter(n => n % 2 === 0)', '  .map(n => n * 2);'], highlight: '#0369A1' },
  ],
};

// ─── Function data ────────────────────────────────────────────────────────────
const FUNCTION_DATA: Record<SWETrack, {
  beginner: { code: string[]; callLine: string; returnLine: string; desc: string };
  advanced: { code: string[]; callLine: string; returnLine: string; desc: string };
}> = {
  java: {
    beginner: {
      code: ['public static int add(int a, int b) {', '    return a + b;', '}', '', 'int result = add(3, 4);'],
      callLine: 'add(3, 4)', returnLine: '→ 7',
      desc: 'Static method: belongs to the class, not an instance. return type must match declaration.',
    },
    advanced: {
      code: ['class Calculator {', '    private int base;', '    Calculator(int base) { this.base = base; }', '    public int add(int n) { return base + n; }', '}', '', 'var calc = new Calculator(10);', 'calc.add(5); // → 15'],
      callLine: 'calc.add(5)', returnLine: '→ 15',
      desc: 'Instance method: uses this.base from the object. Constructor initialises state. new creates a heap object.',
    },
  },
  python: {
    beginner: {
      code: ['def add(a, b):', '    return a + b', '', 'result = add(3, 4)'],
      callLine: 'add(3, 4)', returnLine: '→ 7',
      desc: 'def defines a function. No type declarations. return is explicit — without it, function returns None.',
    },
    advanced: {
      code: ['def make_adder(base):', '    def add(n):', '        return base + n  # closure', '    return add', '', 'add10 = make_adder(10)', 'add10(5)  # → 15'],
      callLine: 'add10(5)', returnLine: '→ 15',
      desc: 'Closure: inner function add captures base from outer scope. make_adder returns a function — functions are first-class objects.',
    },
  },
  nodejs: {
    beginner: {
      code: ['function add(a, b) {', '  return a + b;', '}', '', 'const result = add(3, 4);'],
      callLine: 'add(3, 4)', returnLine: '→ 7',
      desc: 'Function declaration: hoisted to top of scope. return is explicit. No return = undefined.',
    },
    advanced: {
      code: ['const makeAdder = (base) => {', '  return (n) => base + n;  // closure', '};', '', 'const add10 = makeAdder(10);', 'add10(5); // → 15'],
      callLine: 'add10(5)', returnLine: '→ 15',
      desc: 'Arrow function closure: base persists in the returned function. Arrow functions inherit this from lexical scope — no binding surprises.',
    },
  },
};

// ─── Code challenge data ──────────────────────────────────────────────────────
const CHALLENGE_DATA: Record<SWETrack, Record<SWELevel, {
  intro: string; lines: string[]; blanks: { line: number; placeholder: string; answer: string; hint: string }[];
  output: string; filename: string;
}>> = {
  java: {
    beginner: {
      intro: 'Complete this Java class that prints the sum of numbers 1 to 5.',
      filename: 'Main.java',
      lines: [
        'public class Main {',
        '    public static void main(String[] args) {',
        '        int sum = ____;',
        '        for (int i = 1; i <= 5; i++) {',
        '            sum = sum ____ i;',
        '        }',
        '        System.out.println("Sum: " ____ sum);',
        '    }',
        '}',
      ],
      blanks: [
        { line: 2, placeholder: '____', answer: '0', hint: 'Initialise sum to zero before the loop' },
        { line: 4, placeholder: '____', answer: '+', hint: 'We are adding i to the running total' },
        { line: 6, placeholder: '____', answer: '+', hint: 'String concatenation in Java uses +' },
      ],
      output: '> javac Main.java\n> java Main\nSum: 15',
    },
    advanced: {
      intro: 'Complete the Stream pipeline that filters even numbers and squares them.',
      filename: 'StreamDemo.java',
      lines: [
        'import java.util.List;',
        '',
        'public class StreamDemo {',
        '    public static void main(String[] args) {',
        '        List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);',
        '        nums.stream()',
        '            .filter(n -> n ____ 2 == 0)',
        '            .map(n -> n ____ n)',
        '            .forEach(System.out::____);',
        '    }',
        '}',
      ],
      blanks: [
        { line: 6, placeholder: '____', answer: '%', hint: 'Modulo operator checks divisibility' },
        { line: 7, placeholder: '____', answer: '*', hint: 'Square a number by multiplying by itself' },
        { line: 8, placeholder: '____', answer: 'println', hint: 'The method reference System.out::??? prints a line' },
      ],
      output: '> javac StreamDemo.java\n> java StreamDemo\n4\n16\n36',
    },
  },
  python: {
    beginner: {
      intro: "Complete the function that returns the sum of all numbers in a list.",
      filename: 'solution.py',
      lines: [
        'def total(numbers):',
        '    result = ____',
        '    for num ____ numbers:',
        '        result ____ num',
        '    return result',
        '',
        'print(total([1, 2, 3, 4, 5]))',
      ],
      blanks: [
        { line: 1, placeholder: '____', answer: '0', hint: 'Start your running total at zero' },
        { line: 2, placeholder: '____', answer: 'in', hint: 'Python for loops use the "in" keyword' },
        { line: 3, placeholder: '____', answer: '+= ', hint: 'Augmented assignment: result = result + num' },
      ],
      output: '$ python solution.py\n15',
    },
    advanced: {
      intro: 'Complete the list comprehension and generator function.',
      filename: 'advanced.py',
      lines: [
        'def even_squares(n):',
        '    return [x__2 for x in range(n) if x ____ 2 == 0]',
        '',
        'def running_total(nums):',
        '    total = 0',
        '    for n in nums:',
        '        total ____ n',
        '        ____ total',
        '',
        'print(even_squares(7))',
        'print(list(running_total([1,2,3])))',
      ],
      blanks: [
        { line: 1, placeholder: '__2', answer: '**2', hint: 'Python exponentiation operator is **' },
        { line: 1, placeholder: '____', answer: '%', hint: 'Modulo to check even' },
        { line: 6, placeholder: '____', answer: '+=', hint: 'Increment total by n' },
        { line: 7, placeholder: '____', answer: 'yield', hint: 'Generator keyword — pause and emit a value' },
      ],
      output: '$ python advanced.py\n[0, 4, 16, 36]\n[1, 3, 6]',
    },
  },
  nodejs: {
    beginner: {
      intro: 'Complete the function that filters odd numbers and doubles the rest.',
      filename: 'solution.js',
      lines: [
        'function processNumbers(nums) {',
        '  return nums',
        '    .____(n => n % 2 === 0)',
        '    .map(n => n ____ 2);',
        '}',
        '',
        'console.log(processNumbers([1, 2, 3, 4, 5, 6]));',
      ],
      blanks: [
        { line: 2, placeholder: '____', answer: 'filter', hint: 'Array method that keeps only items matching a condition' },
        { line: 3, placeholder: '____', answer: '*', hint: 'Multiply each number by 2 to double it' },
      ],
      output: '$ node solution.js\n[ 4, 8, 12 ]',
    },
    advanced: {
      intro: 'Complete the async function that fetches users and maps their names.',
      filename: 'fetch-users.js',
      lines: [
        'const fetchUsers = ____ (url) => {',
        '  const res = ____ fetch(url);',
        '  if (!res.ok) throw new Error(`HTTP ${res.status}`);',
        '  const data = ____ res.json();',
        '  return data.____(u => u.name);',
        '};',
        '',
        'fetchUsers("https://api.example.com/users")',
        '  .then(names => console.log(names))',
        '  .catch(console.error);',
      ],
      blanks: [
        { line: 0, placeholder: '____', answer: 'async', hint: 'Makes a function return a Promise and allows await inside' },
        { line: 1, placeholder: '____', answer: 'await', hint: 'Pause until the Promise resolves' },
        { line: 3, placeholder: '____', answer: 'await', hint: '.json() is async too — you need to await it' },
        { line: 4, placeholder: '____', answer: 'map', hint: 'Transform array items with this method' },
      ],
      output: '$ node fetch-users.js\n[ "Alex", "Jordan", "Sam" ]',
    },
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// 3D Tools (React Three Fiber)
// ════════════════════════════════════════════════════════════════════════════════

// ── Tool 1: LanguageDNA — 3D card carousel ────────────────────────────────────
function DNACard({ card, index, total, active, onClick, trackColor }: {
  card: { label: string; icon: string; detail: string; color: string };
  index: number; total: number; active: boolean; onClick: () => void; trackColor: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const angle = (index / total) * Math.PI * 2;
  const radius = 3.2;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    if (active) {
      meshRef.current.position.lerp(new THREE.Vector3(0, 0, 1.5), 0.08);
      meshRef.current.scale.lerp(new THREE.Vector3(1.18, 1.18, 1.18), 0.08);
    } else {
      const targetX = Math.sin(angle + clock.getElapsedTime() * 0.18) * radius;
      const targetZ = Math.cos(angle + clock.getElapsedTime() * 0.18) * radius;
      meshRef.current.position.lerp(new THREE.Vector3(targetX, Math.sin(clock.getElapsedTime() * 0.4 + index) * 0.15, targetZ), 0.04);
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);
    }
    meshRef.current.lookAt(0, meshRef.current.position.y, 0);
  });

  return (
    <mesh ref={meshRef} position={[x, 0, z]} onClick={onClick}>
      <RoundedBox args={[1.6, 2.2, 0.1]} radius={0.12} smoothness={4}>
        <meshStandardMaterial
          color={active ? card.color : '#1e293b'}
          emissive={active ? card.color : '#0f172a'}
          emissiveIntensity={active ? 0.6 : 0.15}
          roughness={0.2}
          metalness={0.4}
        />
      </RoundedBox>
      <Text position={[0, 0.55, 0.07]} fontSize={0.28} color="#ffffff" anchorX="center" anchorY="middle" font={undefined}>
        {card.icon}
      </Text>
      <Text position={[0, 0.1, 0.07]} fontSize={0.155} color="#f1f5f9" anchorX="center" anchorY="middle" maxWidth={1.3} textAlign="center" font={undefined}>
        {card.label}
      </Text>
    </mesh>
  );
}

function LanguageDNA3D({ track }: { track: SWETrack }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const cards = DNA_CARDS[track];
  const cfg = TRACK_CONFIG[track];

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 4, 4]} intensity={2} color={cfg.color} />
      <pointLight position={[0, -4, -4]} intensity={1} color="#ffffff" />
      {cards.map((card, i) => (
        <DNACard
          key={i} card={card} index={i} total={cards.length}
          active={activeIdx === i}
          onClick={() => setActiveIdx(activeIdx === i ? null : i)}
          trackColor={cfg.colorHex}
        />
      ))}
    </group>
  );
}

// ── Tool 2: MemoryVisualizer — 3D boxes ───────────────────────────────────────
function MemoryBox({ position, label, value, typeColor, filled, delay }: {
  position: [number, number, number]; label: string; value: string;
  typeColor: string; filled: boolean; delay: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setScale(1), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useFrame(() => {
    if (!meshRef.current) return;
    const target = filled ? 1 : 0.92;
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.06);
  });

  const color = filled ? typeColor : '#1e293b';

  return (
    <group position={position}>
      <mesh ref={meshRef} scale={[scale, scale, scale]}>
        <RoundedBox args={[1.8, 1.1, 0.3]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            color={color}
            emissive={filled ? typeColor : '#000000'}
            emissiveIntensity={filled ? 0.3 : 0}
            roughness={0.3}
            metalness={0.5}
            transparent
            opacity={scale}
          />
        </RoundedBox>
        <Text position={[0, 0.18, 0.18]} fontSize={0.14} color="#94a3b8" anchorX="center" anchorY="middle" font={undefined}>
          {label}
        </Text>
        {filled && (
          <Text position={[0, -0.12, 0.18]} fontSize={0.17} color="#ffffff" anchorX="center" anchorY="middle" font={undefined}>
            {value}
          </Text>
        )}
      </mesh>
    </group>
  );
}

function MemoryVisualizer3D({ track, activeType }: { track: SWETrack; activeType: number }) {
  const types = TYPE_DATA[track];
  const cols = 3;
  const cfg = TRACK_CONFIG[track];

  return (
    <group>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 5, 5]} intensity={2.5} color={cfg.color} />
      <pointLight position={[-5, -3, 3]} intensity={1} color="#6366f1" />
      {types.map((t, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <MemoryBox
            key={i}
            position={[(col - 1) * 2.1, (1 - row) * 1.4, 0]}
            label={t.name}
            value={t.example.split('=')[1]?.trim().replace(';', '') ?? t.name}
            typeColor={t.color}
            filled={i === activeType}
            delay={i * 120}
          />
        );
      })}
    </group>
  );
}

// ── Tool 3: FlowAnimator — 3D path with particle ──────────────────────────────
function PathNode({ position, label, active, color }: {
  position: [number, number, number]; label: string; active: boolean; color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!meshRef.current) return;
    const t = active ? 1.15 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(t, t, t), 0.1);
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <Sphere args={[0.22, 16, 16]}>
          <meshStandardMaterial
            color={active ? color : '#334155'}
            emissive={active ? color : '#000000'}
            emissiveIntensity={active ? 0.8 : 0}
            roughness={0.2}
            metalness={0.6}
          />
        </Sphere>
      </mesh>
      <Text position={[0, -0.38, 0]} fontSize={0.14} color={active ? '#ffffff' : '#94a3b8'} anchorX="center" maxWidth={1.2} textAlign="center" font={undefined}>
        {label}
      </Text>
    </group>
  );
}

function Particle({ color, nodes, speed }: { color: string; nodes: [number, number, number][]; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current = (t.current + delta * speed) % 1;
    const total = nodes.length - 1;
    const seg = t.current * total;
    const segIdx = Math.floor(seg);
    const segT = seg - segIdx;
    const a = nodes[Math.min(segIdx, total)];
    const b = nodes[Math.min(segIdx + 1, total)];
    if (!meshRef.current || !a || !b) return;
    meshRef.current.position.set(
      a[0] + (b[0] - a[0]) * segT,
      a[1] + (b[1] - a[1]) * segT,
      a[2] + (b[2] - a[2]) * segT,
    );
  });

  return (
    <mesh ref={meshRef}>
      <Sphere args={[0.08, 8, 8]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </Sphere>
    </mesh>
  );
}

function FlowAnimator3D({ track, activeFlow }: { track: SWETrack; activeFlow: number }) {
  const cfg = TRACK_CONFIG[track];
  const paths: [number, number, number][][] = [
    [[-2.5, 1.5, 0], [-2.5, 0.5, 0], [-1.0, -0.3, 0], [-1.0, -1.2, 0]],
    [[0.5, 1.5, 0], [0.5, 0.5, 0], [0.5, -0.5, 0], [0.5, -1.5, 0]],
    [[2.5, 1.5, 0], [2.5, 0.5, 0], [2.5, -0.5, 0], [1.2, -1.2, 0]],
    [[-0.8, 1.5, 0], [0.2, 0.8, 0], [0.2, -0.2, 0], [0.2, -1.2, 0]],
  ];
  const nodeLabels = ['Start', 'Condition', 'True', 'End'];
  const nodePositions: [number, number, number][] = [[-1, 1.5, 0], [-1, 0.5, 0], [-1, -0.5, 0], [-1, -1.4, 0]];

  return (
    <group>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 4, 4]} intensity={2} color={cfg.color} />
      {nodePositions.map((pos, i) => (
        <PathNode key={i} position={pos} label={nodeLabels[i]} active={activeFlow >= 0} color={cfg.color} />
      ))}
      {paths[activeFlow >= 0 ? Math.min(activeFlow, paths.length - 1) : 0] && (
        <Particle
          color={cfg.color}
          nodes={paths[activeFlow >= 0 ? Math.min(activeFlow, paths.length - 1) : 0]}
          speed={0.8}
        />
      )}
    </group>
  );
}

// ── Tool 4: StackFrameViewer — 3D push/pop stack ──────────────────────────────
function StackFrame3D({ track, level }: { track: SWETrack; level: SWELevel }) {
  const cfg = TRACK_CONFIG[track];
  const fn = FUNCTION_DATA[track][level];
  const [step, setStep] = useState(0);
  const maxSteps = 3;

  const frames = [
    { label: 'main()', color: '#334155', y: -1 },
    { label: fn.callLine, color: cfg.color, y: 0 },
    { label: fn.returnLine, color: '#059669', y: 1 },
  ].slice(0, step + 1);

  useEffect(() => {
    const t = setInterval(() => setStep(s => s < maxSteps - 1 ? s + 1 : 0), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 4, 4]} intensity={2} color={cfg.color} />
      <pointLight position={[4, 0, 2]} intensity={1} color="#6366f1" />

      {/* Stack base */}
      <mesh position={[0, -1.8, 0]}>
        <RoundedBox args={[3.2, 0.12, 0.8]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.3} />
        </RoundedBox>
      </mesh>

      <Text position={[-1.2, -1.8, 0.45]} fontSize={0.13} color="#475569" anchorX="left" font={undefined}>
        CALL STACK
      </Text>

      {/* Stack frames */}
      {frames.map((frame, i) => (
        <Float key={i} speed={1} rotationIntensity={0.02} floatIntensity={0.05}>
          <group position={[0, -1.4 + i * 0.88, 0]}>
            <RoundedBox args={[3.0, 0.72, 0.6]} radius={0.08} smoothness={4}>
              <meshStandardMaterial
                color={frame.color}
                emissive={i === frames.length - 1 ? frame.color : '#000000'}
                emissiveIntensity={i === frames.length - 1 ? 0.4 : 0}
                roughness={0.3}
                metalness={0.5}
              />
            </RoundedBox>
            <Text position={[0, 0, 0.32]} fontSize={0.18} color="#f8fafc" anchorX="center" anchorY="middle" font={undefined}>
              {frame.label}
            </Text>
          </group>
        </Float>
      ))}
    </group>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// Section Components (2D + 3D combined)
// ════════════════════════════════════════════════════════════════════════════════

const canvas3dStyle: React.CSSProperties = {
  width: '100%', height: '340px', borderRadius: '14px',
  background: 'linear-gradient(135deg, #0a0f1e 0%, #0f172a 60%, #1a1035 100%)',
  border: '1px solid rgba(255,255,255,0.06)',
};

// ── Section 1: Language Identity ──────────────────────────────────────────────
function Section1Identity({ track, level }: { track: SWETrack; level: SWELevel }) {
  const cfg = TRACK_CONFIG[track];
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const cards = DNA_CARDS[track];
  const storyBlock = BASICS_STORY[track][level].identity;

  return (
    <section style={{ marginBottom: '64px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: cfg.color, marginBottom: '8px' }}>
          SECTION 01 · LANGUAGE IDENTITY
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '10px', lineHeight: 1.25 }}>
          What makes {cfg.name} {cfg.name === 'Node.js' ? '' : 'the language it is'}?
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7, maxWidth: '640px' }}>
          {level === 'beginner'
            ? `Before writing a single line, understand ${cfg.name}'s core identity. These six characteristics shape every decision you'll make as a ${cfg.name} developer.`
            : `You already code. What you need is the mental model that separates ${cfg.name} practitioners from ${cfg.name} power-users. These characteristics have deep implications — click each to understand why.`
          }
        </p>
      </div>

      <StoryCard protagonist={storyBlock.avatarLines[0].speaker === 'protagonist' ? storyBlock.avatarLines[0].speaker : 'Protagonist'} accentColor={cfg.color}>
         <span style={{ fontWeight: 700, color: cfg.color }}>{storyBlock.open}</span> &mdash; {storyBlock.story}
      </StoryCard>

      <SWEConversationScene track={track} lines={storyBlock.avatarLines} mentorName={storyBlock.mentorName} mentorRole={storyBlock.mentorRole} mentorColor={storyBlock.mentorColor} />

      {storyBlock.quiz && (
        <SWEAvatar name={storyBlock.mentorName} role={storyBlock.mentorRole} color={storyBlock.mentorColor} content="Are you sure you completely understand this principle before moving on?" question={storyBlock.quiz.question} options={storyBlock.quiz.options} conceptId={storyBlock.quiz.conceptId} />
      )}

      {/* 3D carousel */}
      <div style={canvas3dStyle}>
        <Canvas camera={{ position: [0, 0.8, 6.5], fov: 52 }}>
          <Suspense fallback={null}>
            <LanguageDNA3D track={track} />
          </Suspense>
        </Canvas>
      </div>
      <p style={{ fontSize: '11px', color: 'var(--ed-ink3)', textAlign: 'center', marginTop: '8px', fontFamily: "'JetBrains Mono', monospace" }}>
        ↻ Cards rotate automatically · click any card to read more
      </p>

      {/* Detail cards below */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px', marginTop: '24px' }}>
        {cards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3, boxShadow: `0 8px 24px ${card.color}20` }}
            onClick={() => setActiveCard(activeCard === i ? null : i)}
            style={{
              padding: '16px 18px', borderRadius: '10px',
              background: activeCard === i ? `${card.color}15` : 'var(--ed-card)',
              border: `1.5px solid ${activeCard === i ? card.color : 'var(--ed-rule)'}`,
              cursor: 'pointer', transition: 'border 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px' }}>{card.icon}</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)' }}>{card.label}</span>
            </div>
            <AnimatePresence>
              {activeCard === i && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65, marginTop: '6px', paddingTop: '6px', borderTop: `1px solid ${card.color}30` }}>
                    {card.detail}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── Section 2: Variables & Types ──────────────────────────────────────────────
function Section2Types({ track, level }: { track: SWETrack; level: SWELevel }) {
  const cfg = TRACK_CONFIG[track];
  const types = TYPE_DATA[track];
  const [activeType, setActiveType] = useState(0);
  const storyBlock = BASICS_STORY[track][level].types;

  useEffect(() => {
    const t = setInterval(() => setActiveType(i => (i + 1) % types.length), 2200);
    return () => clearInterval(t);
  }, [types.length]);

  return (
    <section style={{ marginBottom: '64px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: cfg.color, marginBottom: '8px' }}>
          SECTION 02 · VARIABLES & TYPES
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '10px', lineHeight: 1.25 }}>
          How {cfg.name} stores and types data
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7, maxWidth: '640px' }}>
          {level === 'beginner'
            ? `Types determine what kind of data a variable can hold. In ${cfg.name}, understanding types early saves you hours of confusing errors.`
            : `Types are a contract. ${track === 'java' ? 'Java enforces this contract at compile time — violations never reach production.' : track === 'python' ? "Python enforces it at runtime — which is why type hints exist." : "JavaScript coerces types silently — which is why you need to know the rules."}`
          }
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        {/* 3D memory visualizer */}
        <div>
          <div style={canvas3dStyle}>
            <Canvas camera={{ position: [0, 0, 5.5], fov: 50 }}>
              <Suspense fallback={null}>
                <MemoryVisualizer3D track={track} activeType={activeType} />
              </Suspense>
            </Canvas>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--ed-ink3)', textAlign: 'center', marginTop: '8px', fontFamily: "'JetBrains Mono', monospace" }}>
            highlighted box cycles through types automatically
          </p>
        </div>

        {/* Type list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {types.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 4 }}
              onClick={() => setActiveType(i)}
              style={{
                padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
                background: activeType === i ? `${t.color}15` : 'var(--ed-card)',
                border: `1.5px solid ${activeType === i ? t.color : 'var(--ed-rule)'}`,
                borderLeft: `4px solid ${t.color}`,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
                <code style={{ fontSize: '12px', fontWeight: 700, color: t.color, fontFamily: "'JetBrains Mono', monospace" }}>{t.name}</code>
                <code style={{ fontSize: '11px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.example}</code>
              </div>
              {activeType === i && (
                <div style={{ fontSize: '11px', color: 'var(--ed-ink2)', lineHeight: 1.55, marginTop: '4px' }}>{t.note}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 3: Control Flow ───────────────────────────────────────────────────
function Section3Flow({ track, level }: { track: SWETrack; level: SWELevel }) {
  const cfg = TRACK_CONFIG[track];
  const flows = FLOW_DATA[track];
  const [activeFlow, setActiveFlow] = useState(0);
  const current = flows[activeFlow];
  const storyBlock = BASICS_STORY[track][level].flow;

  return (
    <section style={{ marginBottom: '64px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: cfg.color, marginBottom: '8px' }}>
          SECTION 03 · CONTROL FLOW
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '10px', lineHeight: 1.25 }}>
          How {cfg.name} controls execution
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7, maxWidth: '640px' }}>
          {level === 'beginner'
            ? `Control flow is how you make decisions in code. These four patterns cover 90% of what you'll write in ${cfg.name}.`
            : `Control flow is where language philosophy shows. ${track === 'java' ? "Java's traditional C-style syntax is maximally explicit. With Java 14+, switch expressions and pattern matching are closing the gap." : track === 'python' ? "Python's list comprehensions and walrus operator reward fluency. But readability counts — a clever one-liner that confuses your team is bad code." : "JavaScript's map/filter/reduce chains are functional and expressive. Know when they serve the reader and when a plain loop is clearer."}`
          }
        </p>
      </div>

      <StoryCard protagonist={storyBlock.avatarLines[0].speaker === 'protagonist' ? storyBlock.avatarLines[0].speaker : 'Protagonist'} accentColor={cfg.color}>
         <span style={{ fontWeight: 700, color: cfg.color }}>{storyBlock.open}</span> &mdash; {storyBlock.story}
      </StoryCard>

      <SWEConversationScene track={track} lines={storyBlock.avatarLines} mentorName={storyBlock.mentorName} mentorRole={storyBlock.mentorRole} mentorColor={storyBlock.mentorColor} />

      {storyBlock.quiz && (
        <SWEAvatar name={storyBlock.mentorName} role={storyBlock.mentorRole} color={storyBlock.mentorColor} content="Control flow dictates execution context. Ensure you understand this." question={storyBlock.quiz.question} options={storyBlock.quiz.options} conceptId={storyBlock.quiz.conceptId} />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start', marginTop: '28px' }}>
        {/* Code + flow tabs */}
        <div>
          {/* tabs */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {flows.map((f, i) => (
              <button key={i} onClick={() => setActiveFlow(i)} style={{
                padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace",
                fontWeight: activeFlow === i ? 700 : 400,
                background: activeFlow === i ? cfg.color : 'var(--ed-card)',
                color: activeFlow === i ? '#fff' : 'var(--ed-ink3)',
                border: `1px solid ${activeFlow === i ? cfg.color : 'var(--ed-rule)'}`,
                cursor: 'pointer',
              }}>{f.title}</button>
            ))}
          </div>
          {/* code block */}
          <AnimatePresence mode="wait">
            <motion.div key={activeFlow} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <div style={{ background: '#0d1117', borderRadius: '10px', padding: '20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', lineHeight: 1.75, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#6b7280', marginBottom: '10px', letterSpacing: '0.1em' }}>
                  {track === 'java' ? 'Main.java' : track === 'python' ? 'flow.py' : 'flow.js'} · {current.title}
                </div>
                {current.code.map((line, i) => (
                  <div key={i} style={{ color: '#e2e8f0' }}>
                    <span style={{ color: '#374151', marginRight: '14px', fontSize: '11px', userSelect: 'none' }}>{String(i + 1).padStart(2, ' ')}</span>
                    <span style={{ color: line.trim().startsWith('//') || line.trim().startsWith('#') ? '#6b7280' : '#e2e8f0' }}>{line}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3D flow animator */}
        <div>
          <div style={canvas3dStyle}>
            <Canvas camera={{ position: [0, 0, 6], fov: 48 }}>
              <Suspense fallback={null}>
                <FlowAnimator3D track={track} activeFlow={activeFlow} />
              </Suspense>
            </Canvas>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--ed-ink3)', textAlign: 'center', marginTop: '8px', fontFamily: "'JetBrains Mono', monospace" }}>
            particle traces execution path as code runs
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Section 4: Functions & Scope ──────────────────────────────────────────────
function Section4Functions({ track, level }: { track: SWETrack; level: SWELevel }) {
  const cfg = TRACK_CONFIG[track];
  const fn = FUNCTION_DATA[track][level];
  const storyBlock = BASICS_STORY[track][level].functions;

  return (
    <section style={{ marginBottom: '64px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: cfg.color, marginBottom: '8px' }}>
          SECTION 04 · FUNCTIONS & SCOPE
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '10px', lineHeight: 1.25 }}>
          How {cfg.name} handles functions and the call stack
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7, maxWidth: '640px' }}>{fn.desc}</p>
      </div>

      <StoryCard protagonist={storyBlock.avatarLines[0].speaker === 'protagonist' ? storyBlock.avatarLines[0].speaker : 'Protagonist'} accentColor={cfg.color}>
         <span style={{ fontWeight: 700, color: cfg.color }}>{storyBlock.open}</span> &mdash; {storyBlock.story}
      </StoryCard>

      <SWEConversationScene track={track} lines={storyBlock.avatarLines} mentorName={storyBlock.mentorName} mentorRole={storyBlock.mentorRole} mentorColor={storyBlock.mentorColor} />

      {storyBlock.quiz && (
        <SWEAvatar name={storyBlock.mentorName} role={storyBlock.mentorRole} color={storyBlock.mentorColor} content="Do you grok the stack traces and function closures yet?" question={storyBlock.quiz.question} options={storyBlock.quiz.options} conceptId={storyBlock.quiz.conceptId} />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start', marginTop: '28px' }}>
        {/* Code */}
        <div>
          <div style={{ background: '#0d1117', borderRadius: '10px', padding: '20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', lineHeight: 1.75, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#6b7280', marginBottom: '10px', letterSpacing: '0.1em' }}>
              {track === 'java' ? (level === 'beginner' ? 'Main.java' : 'Calculator.java') : track === 'python' ? (level === 'beginner' ? 'funcs.py' : 'closures.py') : (level === 'beginner' ? 'funcs.js' : 'closures.js')} · {level === 'advanced' ? 'advanced' : 'beginner'}
            </div>
            {fn.code.map((line, i) => (
              <div key={i} style={{ color: line.includes('//') ? '#6b7280' : line.includes('#') ? '#6b7280' : '#e2e8f0' }}>
                <span style={{ color: '#374151', marginRight: '14px', fontSize: '11px', userSelect: 'none' }}>{String(i + 1).padStart(2, ' ')}</span>
                {line}
              </div>
            ))}
          </div>

          {/* result pill */}
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderRadius: '8px', background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#94a3b8' }}>{fn.callLine}</span>
            <span style={{ color: '#059669', fontSize: '14px' }}>→</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 700, color: '#059669' }}>{fn.returnLine.replace('→ ', '')}</span>
          </div>
        </div>

        {/* 3D Stack */}
        <div>
          <div style={canvas3dStyle}>
            <Canvas camera={{ position: [0, 1, 6], fov: 50 }}>
              <Suspense fallback={null}>
                <StackFrame3D track={track} level={level} />
              </Suspense>
            </Canvas>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--ed-ink3)', textAlign: 'center', marginTop: '8px', fontFamily: "'JetBrains Mono', monospace" }}>
            frames push onto the call stack as functions are called
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Section 5: Code Challenge ─────────────────────────────────────────────────
function Section5Challenge({ track, level }: { track: SWETrack; level: SWELevel }) {
  const cfg = TRACK_CONFIG[track];
  const challenge = CHALLENGE_DATA[track][level];
  const [answers, setAnswers] = useState<string[]>(challenge.blanks.map(() => ''));
  const storyBlock = BASICS_STORY[track][level].challenge;
  const [checked, setChecked] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const allCorrect = challenge.blanks.every((b, i) => answers[i].trim() === b.answer.trim());

  const handleCheck = () => {
    setChecked(true);
    if (allCorrect) setTimeout(() => setShowOutput(true), 600);
  };

  const reset = () => { setAnswers(challenge.blanks.map(() => '')); setChecked(false); setShowOutput(false); };

  let blankIdx = 0;
  const renderedLines = challenge.lines.map((line, lineIdx) => {
    const blank = challenge.blanks.find(b => b.line === lineIdx);
    if (!blank) {
      return (
        <div key={lineIdx}>
          <span style={{ color: '#374151', marginRight: '14px', fontSize: '11px', userSelect: 'none' }}>{String(lineIdx + 1).padStart(2, ' ')}</span>
          <span style={{ color: '#e2e8f0' }}>{line}</span>
        </div>
      );
    }
    const bIdx = blankIdx++;
    const ans = answers[bIdx];
    const isCorrect = checked && ans.trim() === blank.answer.trim();
    const isWrong = checked && ans.trim() !== blank.answer.trim();
    const parts = line.split(blank.placeholder);

    return (
      <div key={lineIdx} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '2px' }}>
        <span style={{ color: '#374151', marginRight: '14px', fontSize: '11px', userSelect: 'none' }}>{String(lineIdx + 1).padStart(2, ' ')}</span>
        <span style={{ color: '#e2e8f0' }}>{parts[0]}</span>
        <input
          value={ans}
          onChange={e => { const next = [...answers]; next[bIdx] = e.target.value; setAnswers(next); setChecked(false); setShowOutput(false); }}
          placeholder={blank.placeholder}
          style={{
            background: isCorrect ? 'rgba(5,150,105,0.2)' : isWrong ? 'rgba(220,38,38,0.2)' : 'rgba(255,255,255,0.07)',
            border: `1.5px solid ${isCorrect ? '#059669' : isWrong ? '#DC2626' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: '4px', color: '#f8fafc', fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px', padding: '1px 6px',
            width: `${Math.max(blank.answer.length * 10 + 20, 60)}px`,
            outline: 'none', transition: 'border 0.2s',
          }}
        />
        <span style={{ color: '#e2e8f0' }}>{parts[1]}</span>
        {isWrong && (
          <span style={{ fontSize: '10px', color: '#f87171', fontFamily: "'JetBrains Mono', monospace", marginLeft: '6px' }}>hint: {blank.hint}</span>
        )}
      </div>
    );
  });

  return (
    <section style={{ marginBottom: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: cfg.color, marginBottom: '8px' }}>
          SECTION 05 · WRITE IT YOURSELF
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '10px', lineHeight: 1.25 }}>
          Your first {cfg.name} program
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7, maxWidth: '640px' }}>{challenge.intro}</p>
      </div>

      <StoryCard protagonist={storyBlock.avatarLines[0].speaker === 'protagonist' ? storyBlock.avatarLines[0].speaker : 'Protagonist'} accentColor={cfg.color}>
         <span style={{ fontWeight: 700, color: cfg.color }}>{storyBlock.open}</span> &mdash; {storyBlock.story}
      </StoryCard>

      <SWEConversationScene track={track} lines={storyBlock.avatarLines} mentorName={storyBlock.mentorName} mentorRole={storyBlock.mentorRole} mentorColor={storyBlock.mentorColor} />

      {/* Code editor */}
      <div style={{ background: '#0d1117', borderRadius: '10px', padding: '0', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
        {/* Editor header */}
        <div style={{ background: '#161b22', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f87171' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fbbf24' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34d399' }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#6b7280', marginLeft: '8px' }}>{challenge.filename}</span>
        </div>
        <div style={{ padding: '20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', lineHeight: 2.1 }}>
          {renderedLines}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '16px', alignItems: 'center' }}>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleCheck} style={{
          padding: '10px 24px', borderRadius: '8px', background: cfg.color, color: '#fff',
          fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        }}>
          ▶ Run
        </motion.button>
        <motion.button whileHover={{ opacity: 0.75 }} onClick={reset} style={{
          padding: '10px 18px', borderRadius: '8px', background: 'var(--ed-card)',
          color: 'var(--ed-ink3)', fontSize: '13px', border: '1px solid var(--ed-rule)',
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Reset
        </motion.button>
        {checked && !allCorrect && (
          <span style={{ fontSize: '12px', color: '#f87171', fontFamily: "'JetBrains Mono', monospace" }}>
            ✗ Some answers need fixing — check the hints
          </span>
        )}
      </div>

      {/* Terminal output */}
      <AnimatePresence>
        {showOutput && allCorrect && (
          <motion.div initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
            <div style={{ marginTop: '16px', background: '#0d1117', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(5,150,105,0.3)' }}>
              <div style={{ background: '#161b22', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: '#059669', fontWeight: 700 }}>✓ OUTPUT</span>
              </div>
              <div style={{ padding: '16px 20px' }}>
                {challenge.output.split('\n').map((line, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: line.startsWith('>') || line.startsWith('$') ? '#94a3b8' : '#34d399', lineHeight: 1.9 }}>
                      {line}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)', fontSize: '13px', color: '#059669', fontWeight: 600 }}>
              🎉 Perfect. Your first {cfg.name} program runs correctly.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// Main Export
// ════════════════════════════════════════════════════════════════════════════════
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const toRoman = (n: number) => ROMAN[n - 1] ?? String(n);

const ACHIEVEMENTS = [
  { id: 'identity', label: 'DNA Decode', icon: '🧬', desc: 'Explored language identity' },
  { id: 'types', label: 'Type Safe', icon: '🔒', desc: 'Mastered data types' },
  { id: 'flow', label: 'Flow Control', icon: '🔀', desc: 'Tested control flow branching' },
  { id: 'functions', label: 'Stack Master', icon: '🥞', desc: 'Pushed limits of the call stack' },
  { id: 'challenge', label: 'First Blood', icon: '💻', desc: 'Wrote your first program' },
];

export default function SWELanguageBasics({ track, level, onBack }: Props) {
  const cfg = TRACK_CONFIG[track];
  
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string>('identity');

  const SECTIONS = [
    { id: 'identity', label: 'Language Identity' },
    { id: 'types', label: 'Variables & Types' },
    { id: 'flow', label: 'Control Flow' },
    { id: 'functions', label: 'Functions & Scope' },
    { id: 'challenge', label: 'Write It Yourself' },
  ];

  const totalXP = completedSections.size * 100; // 100 xp per section
  const progressPct = Math.round((completedSections.size / SECTIONS.length) * 100);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('data-section');
        if (!id) return;
        if (entry.isIntersecting) {
          setActiveSection(id);
          setCompletedSections(p => new Set([...p, id]));
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -25% 0px' });
    const t = setTimeout(() => { document.querySelectorAll('[data-section]').forEach(el => obs.observe(el)); }, 150);
    return () => { clearTimeout(t); obs.disconnect(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardStyle: React.CSSProperties = { background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' };

  return (
    <div className="editorial" style={{ minHeight: '100vh', background: 'var(--ed-cream)' }}>

      {/* Top nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', backdropFilter: 'blur(12px)', transition: 'background 0.4s' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
              <motion.button whileHover={{ opacity: 0.75 }} whileTap={{ scale: 0.97 }} onClick={onBack}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', cursor: 'pointer', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', color: 'var(--ed-ink3)' }}>←</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)', fontFamily: "'JetBrains Mono', monospace" }}>Back</span>
              </motion.button>
              <span style={{ color: 'var(--ed-rule)', fontSize: '18px' }}>|</span>
              <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: `linear-gradient(135deg, ${cfg.gradientA}, ${cfg.gradientB})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '11px' }}>{cfg.emoji}</span>
              </div>
              <span style={{ color: 'var(--ed-rule)', fontSize: '18px' }}>|</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>SWE Launchpad</span>
                <span style={{ color: 'var(--ed-rule)', fontSize: '12px' }}>›</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink2)' }}>{cfg.name} · Language Basics</span>
              </div>
            </div>
            <div style={{ flex: 1, maxWidth: '240px', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 24px' }}>
              <div style={{ flex: 1, height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: cfg.color, borderRadius: '2px' }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: cfg.color, flexShrink: 0 }}>{progressPct}%</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: cfg.color, flexShrink: 0 }}>{totalXP} XP</div>
          </div>
        </div>
      </div>

      {/* 3-column layout */}
      <div className="three-col-wrap" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
        <div className="three-col-grid" style={{ display: 'grid', gridTemplateColumns: '200px minmax(0, 1fr) 240px', gap: '40px', alignItems: 'start', paddingTop: '36px' }}>

          {/* Left nav */}
          <aside className="left-col" style={{ position: 'sticky', top: '57px', height: 'fit-content' }}>
            <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px 14px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid var(--ed-rule)' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ed-ink3)', marginBottom: '8px' }}>Contents</div>
                <div style={{ height: '2px', background: 'var(--ed-rule)', borderRadius: '1px', overflow: 'hidden' }}><motion.div style={{ height: '100%', background: cfg.color, borderRadius: '1px' }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} /></div>
                <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '6px' }}>{progressPct}% · {completedSections.size}/{SECTIONS.length} parts</div>
              </div>
              <nav>
                {SECTIONS.map((sec, idx) => {
                  const done = completedSections.has(sec.id);
                  const active = activeSection === sec.id && !done;
                  return (
                    <motion.button key={sec.id} onClick={() => document.querySelector(`[data-section="${sec.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })} whileHover={{ x: 2 }}
                      style={{ display: 'flex', alignItems: 'baseline', gap: '8px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '5px 0', textAlign: 'left', borderLeft: active ? `2px solid ${cfg.color}` : '2px solid transparent', paddingLeft: '8px', marginLeft: '-8px', transition: 'border-color 0.2s' }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: done || active ? cfg.color : 'var(--ed-rule)', flexShrink: 0, minWidth: '18px', lineHeight: 1 }}>{toRoman(idx + 1)}.</span>
                      <span style={{ fontSize: '11px', fontWeight: active ? 600 : 400, color: done ? 'var(--ed-ink2)' : active ? 'var(--ed-ink)' : 'var(--ed-ink3)', lineHeight: 1.4, wordBreak: 'break-word', transition: 'color 0.2s' }}>{sec.label}{done ? ' ✓' : ''}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div style={{ paddingTop: '4px', paddingBottom: '80px', minWidth: 0 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '48px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: cfg.color, marginBottom: '12px' }}>BEFORE YOU BEGIN · LANGUAGE BASICS</div>
              <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '16px' }}>
                {cfg.emoji} {cfg.name}: {level === 'beginner' ? 'Building Your Foundation' : 'The Mental Models That Matter'}
              </h1>
              <p style={{ fontSize: '16px', color: 'var(--ed-ink2)', lineHeight: 1.75, maxWidth: '580px', marginBottom: '24px' }}>
                {level === 'beginner'
                  ? `This pre-read gives you the language fundamentals before your first session — variables, types, control flow, functions, and your first real ${cfg.name} program. No experience required.`
                  : `You know how to code. This pre-read sharpens the ${cfg.name}-specific mental models — the execution model, type system decisions, and language idioms that separate fluent ${cfg.name} from just-compiled ${cfg.name}.`
                }
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {[{ label: 'Time', value: '30 min interact' }, { label: 'Format', value: '3D Tools' }, { label: 'Track', value: cfg.name }].map(item => (
                  <div key={item.label} style={{ display: 'flex', gap: '6px', fontSize: '12px' }}>
                    <span style={{ color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '1px' }}>{item.label}</span>
                    <span style={{ color: 'var(--ed-ink2)', fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div data-section="identity"><Section1Identity track={track} level={level} /></div>
            <div data-section="types"><Section2Types track={track} level={level} /></div>
            <div data-section="flow"><Section3Flow track={track} level={level} /></div>
            <div data-section="functions"><Section4Functions track={track} level={level} /></div>
            <div data-section="challenge"><Section5Challenge track={track} level={level} /></div>

            {/* Completion CTA */}
            <div style={{ padding: '28px 32px', borderRadius: '14px', background: `linear-gradient(135deg, ${cfg.gradientA}10, ${cfg.gradientB}08)`, border: `1.5px solid ${cfg.color}25`, textAlign: 'center', marginTop: '64px' }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>✅</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '8px' }}>
                {cfg.name} basics complete. You're ready for Pre-Read 01.
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65, maxWidth: '480px', margin: '0 auto 20px' }}>
                Pre-Read 01 picks up from here — you'll see how code actually executes, what the dev environment is doing, and how to read errors like a professional.
              </p>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onBack} style={{
                padding: '12px 32px', borderRadius: '10px', background: cfg.color, color: '#fff',
                fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Back to Learning Path →
              </motion.button>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="right-col" style={{ position: 'sticky', top: '57px', height: 'fit-content', paddingTop: '0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ ...cardStyle, borderTop: `3px solid ${cfg.color}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ed-ink3)', marginBottom: '2px' }}>Level</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: cfg.color, whiteSpace: 'nowrap' }}>{level === 'advanced' ? 'Advanced' : 'Beginner'}</div>
                </div>
                <div style={{ textAlign: 'right', position: 'relative', overflow: 'visible' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ed-ink3)', marginBottom: '2px' }}>XP</div>
                  <motion.div key={totalXP} animate={{ scale: [1.12, 1] }} transition={{ duration: 0.25 }} style={{ fontSize: '22px', fontWeight: 900, color: cfg.color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{totalXP}</motion.div>
                </div>
              </div>
              <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}><motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: cfg.color, borderRadius: '2px' }} /></div>
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)' }}>Module Progress</div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: cfg.color }}>{progressPct}%</span>
              </div>
              <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}><motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: cfg.color, borderRadius: '2px' }} /></div>
              <div style={{ marginTop: '6px', fontSize: '10px', color: 'var(--ed-ink3)' }}>{completedSections.size} of {SECTIONS.length} parts</div>
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ed-ink3)' }}>Badges</div>
                <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{ACHIEVEMENTS.filter(a => completedSections.has(a.id)).length}/{ACHIEVEMENTS.length}</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '2px' }}>
                {ACHIEVEMENTS.map(a => {
                  const unlocked = completedSections.has(a.id);
                  return (
                    <motion.div key={a.id} whileHover={{ scale: 1.08 }} title={unlocked ? `${a.label}: ${a.desc}` : 'Locked'}
                      style={{ width: '40px', height: '40px', borderRadius: '8px', background: unlocked ? `var(--ed-cream)` : 'var(--ed-cream)', border: `1px solid ${unlocked ? cfg.color : 'var(--ed-rule)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', filter: unlocked ? 'none' : 'grayscale(1) opacity(0.3)', transition: 'all 0.3s', cursor: 'default' }}>
                      {a.icon}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

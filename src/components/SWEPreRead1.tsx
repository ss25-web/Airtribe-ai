'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearnerStore } from '@/lib/learnerStore';
import QuizEngine from './QuizEngine';
import type { SWETrack, SWELevel } from './sweTypes';
import {
  ApplyItBox, ChapterSection, NextChapterTeaser, PMPrincipleBox,
  chLabel, h2, keyBox, para, pullQuote, TiltCard,
} from './pm-fundamentals/designSystem';

const ACCENT_RGB = '22,163,74';
const MODULE_TIME = '25 min · 4 parts';

const TRACK_META: Record<SWETrack, {
  label: string; shortLabel: string; introTitle: string;
  protagonist: string; protagonistRole: string; company: string; moduleContext: string;
  mentor: string; mentorRole: string; mentorColor: string;
  accentColor: string; accentGradient: string;
}> = {
  python: {
    label: 'Python Track', shortLabel: 'Python', introTitle: 'How Software Works · Python Lens',
    protagonist: 'Aisha Patel', protagonistRole: 'Junior Data Engineer', company: 'Mosaic Analytics',
    moduleContext: 'SWE Launchpad · Python · Pre-Read 01. Follows Aisha, a junior data engineer at Mosaic Analytics, as she learns how Python code actually runs, what the terminal is for, and how to read her first error.',
    mentor: 'Riya', mentorRole: 'Data Engineering Lead', mentorColor: '#0369A1',
    accentColor: '#16A34A', accentGradient: 'linear-gradient(135deg, #16A34A, #0D9488)',
  },
  java: {
    label: 'Java Track', shortLabel: 'Java', introTitle: 'How Software Works · Java Lens',
    protagonist: 'Vikram Nair', protagonistRole: 'Junior Backend Engineer', company: 'Finova Systems',
    moduleContext: 'SWE Launchpad · Java · Pre-Read 01. Follows Vikram, a junior backend engineer at Finova Systems, as he learns how Java compiles and runs, what the JVM actually does, and why types matter.',
    mentor: 'Kavya', mentorRole: 'Senior Backend Engineer', mentorColor: '#7C3AED',
    accentColor: '#0369A1', accentGradient: 'linear-gradient(135deg, #0369A1, #7C3AED)',
  },
  nodejs: {
    label: 'Node.js Track', shortLabel: 'Node.js', introTitle: 'How Software Works · Node.js Lens',
    protagonist: 'Leo Chen', protagonistRole: 'Junior Full-Stack Developer', company: 'Launchly',
    moduleContext: 'SWE Launchpad · Node.js · Pre-Read 01. Follows Leo, a junior full-stack developer at Launchly, as he learns how Node.js runs JavaScript outside the browser and how to build his first HTTP server.',
    mentor: 'Mei', mentorRole: 'Senior Full-Stack Engineer', mentorColor: '#DC2626',
    accentColor: '#CA8A04', accentGradient: 'linear-gradient(135deg, #CA8A04, #16A34A)',
  },
};

const SECTIONS = [
  { id: 'swe-m1-how-code-runs',      label: 'How Code Runs' },
  { id: 'swe-m1-dev-environment',    label: 'Your Dev Environment' },
  { id: 'swe-m1-language-ecosystem', label: 'Your Language & Ecosystem' },
  { id: 'swe-m1-reading-errors',     label: 'Reading Errors & Debugging' },
];
const CONCEPTS = ['swe-m1-execution', 'swe-m1-environment', 'swe-m1-ecosystem', 'swe-m1-debugging'];
const ACHIEVEMENTS = [
  { id: 'swe-m1-how-code-runs',      icon: '⚙️', label: 'Executor',  desc: 'Understood how code becomes output' },
  { id: 'swe-m1-dev-environment',    icon: '🛠️', label: 'Set Up',    desc: 'Mastered the dev environment' },
  { id: 'swe-m1-language-ecosystem', icon: '🌐', label: 'Explorer',  desc: 'Explored the language ecosystem' },
  { id: 'swe-m1-reading-errors',     icon: '🔍', label: 'Debugger',  desc: 'Learned to read errors and debug' },
];
const CONCEPT_DETAILS = [
  { id: 'swe-m1-execution',   label: 'Execution Model',    color: '#16A34A' },
  { id: 'swe-m1-environment', label: 'Dev Environment',    color: '#0369A1' },
  { id: 'swe-m1-ecosystem',   label: 'Language Ecosystem', color: '#7C3AED' },
  { id: 'swe-m1-debugging',   label: 'Debugging Mindset',  color: '#C85A40' },
];
const LEVELS = [
  { min: 0,   label: 'Curious',      color: 'var(--ed-ink3)' },
  { min: 150, label: 'Thinker',      color: '#0097A7' },
  { min: 350, label: 'Practitioner', color: '#3A86FF' },
  { min: 600, label: 'PM-Minded',    color: '#4F46E5' },
  { min: 850, label: 'PM Thinker',   color: '#C85A40' },
];
function getLevel(xp: number) { let l = LEVELS[0]; for (const lvl of LEVELS) { if (xp >= lvl.min) l = lvl; } return l; }
function getNextLevel(xp: number) { const i = LEVELS.findIndex(l => l.min > xp); return i === -1 ? null : LEVELS[i]; }
const ROMAN = ['I', 'II', 'III', 'IV'];
const toRoman = (n: number) => ROMAN[n - 1] ?? String(n);

// ─── Advanced-track story content (Gemini-generated) ────────────────────────
type AdvOpt = { text: string; correct: boolean; feedback: string };
type AdvBeat = { name: string; role: string; color: string; content: string; expanded: string; question: string; opts: AdvOpt[] };
type AdvSection = Record<SWETrack, { open: string; story: string; b1: AdvBeat; bridge: string; b2: AdvBeat }>;

const ADV: Record<'s01'|'s02'|'s03'|'s04', AdvSection> = {
  s01: {
    python: {
      open: "My new data processing script is super efficient. Local tests with 10,000 rows passed in seconds, so scaling to 50 million in production should be a linear increase in time. No surprises here.",
      story: "Aisha watches the production dashboard. Her script, which processed a small sample quickly, now chugs. The CPU hovers near 100%, but throughput remains abysmal. Memory usage climbs steadily, then drops sharply, indicating garbage collection pauses. The 50M-row batch is projected to take hours, not minutes, and the psutil output shows intermittent, inexplicable stalls.",
      b1: {
        name: 'Dev', role: 'Senior Data Scientist', color: '#D97706',
        content: "Aisha, check your pandas DataFrame operations. Are you doing any implicit copies? That can kill performance on large datasets, especially with memory.",
        expanded: "Deep copies create temporary objects, doubling memory footprint. Also ensure you're using vectorized operations where possible. Python's loops are just too slow for big data. It's usually a memory or algorithm issue.",
        question: "What is the primary reason Aisha's Python script, efficient on small samples, performs poorly at scale despite optimized DataFrame operations?",
        opts: [
          { text: 'Insufficient CPU cores are allocated to the production environment, hindering parallel processing.', correct: false, feedback: "Python's GIL limits true parallelism for CPU-bound tasks in a single process, so more cores alone won't help." },
          { text: 'Memory pressure and the GIL cause frequent garbage collection pauses and serialization bottlenecks.', correct: true, feedback: 'At scale, the GIL prevents multiple threads from running Python bytecode simultaneously and memory pressure triggers costly GC cycles.' },
          { text: 'The underlying storage system has high latency, leading to slow data retrieval for the large dataset.', correct: false, feedback: 'Storage latency is a factor, but the observed CPU spikes and GC pauses point to in-memory processing bottlenecks.' },
        ],
      },
      bridge: "Dev's point about copies is valid, but I've already optimized those. The CPU is high yet the script isn't faster. It feels like something is blocking, not just slowing down. There's a deeper bottleneck I haven't named yet.",
      b2: {
        name: 'Riya', role: 'Data Engineering Lead', color: '#0369A1',
        content: "Aisha, at this scale the GIL and Python's memory management become critical. Profiling reveals significant time in object allocation and garbage collection, not your actual logic.",
        expanded: "For 50M rows, memory pressure triggers frequent GC pauses that halt execution. The GIL further limits true concurrency for CPU-bound tasks. Consider offloading to Polars or PySpark, or a multi-process architecture to bypass the GIL for specific bottlenecks.",
        question: "To effectively scale Python data processing beyond GIL limitations and memory pressure, what is the most appropriate strategy?",
        opts: [
          { text: 'Increase the number of threads within the Python process to achieve better parallel execution.', correct: false, feedback: 'The GIL prevents multiple Python threads from running bytecode concurrently, so more threads do not help CPU-bound tasks.' },
          { text: 'Use multi-process architectures or offload heavy computation to C-based libraries or specialized frameworks.', correct: true, feedback: 'Multi-processing bypasses the GIL, and C-based libraries like NumPy or frameworks like Polars release the GIL during their execution.' },
          { text: "Optimize the Python interpreter's internal GC threshold settings for improved memory handling.", correct: false, feedback: 'Minor GC tuning helps at the margins; fundamental scaling issues require architectural changes beyond interpreter settings.' },
        ],
      },
    },
    java: {
      open: "My new API endpoint passed all local integration tests with flying colors. It handles concurrent data insertion perfectly under test load. I'm confident it's production-ready.",
      story: "Vikram deploys his new API. Load tests begin at 1000 concurrent users. Initially requests are fast, but after a few minutes latency spikes. Error logs fill with Connection pool exhausted messages and Deadlock detected exceptions. The API becomes unresponsive despite seemingly low individual request times.",
      b1: {
        name: 'Rahul', role: 'Junior Backend Engineer', color: '#0891B2',
        content: "Vikram, are you sure your database queries are optimized? Slow queries hold connections open and exhaust the pool. Maybe add some indexes or refactor the joins.",
        expanded: "An N+1 query problem or missing indexes would definitely cause this. Each slow query ties up a database connection. Check your ORM mappings too; sometimes they generate inefficient SQL under load.",
        question: "What is the most likely underlying cause of Connection pool exhausted errors and API unresponsiveness under concurrent load?",
        opts: [
          { text: "The database server's network bandwidth is insufficient to handle the high volume of concurrent requests.", correct: false, feedback: 'Network bandwidth issues appear as latency, not connection exhaustion. Pool exhaustion points to resource contention at the application level.' },
          { text: 'Unmanaged shared resources or non-thread-safe code within the API cause contention and connection starvation.', correct: true, feedback: 'Race conditions or lack of synchronization prevent connections from being released correctly, starving new requests of available connections.' },
          { text: "The application server's CPU is overloaded, preventing it from processing requests fast enough to free connections.", correct: false, feedback: 'High CPU can contribute, but connection exhaustion stems from threads holding resources too long, not just slow processing speed.' },
        ],
      },
      bridge: "Rahul's right about query optimization but I've already reviewed those — they're efficient. The deadlocks are the tell. It's like something internal to the application is getting tangled, not just slow external calls.",
      b2: {
        name: 'Kavya', role: 'Senior Backend Engineer', color: '#7C3AED',
        content: "Vikram, concurrent access to shared resources without proper synchronization causes deadlocks and connection pool exhaustion. Your local single-threaded tests will never expose this.",
        expanded: "You need to ensure all shared state — counters, caches, connection handles — is protected with locks or concurrent data structures. Also review transaction boundaries: every code path must release the connection, including exception paths.",
        question: "To prevent thread-safety issues and connection pool exhaustion in a concurrent Java application, what is a crucial practice?",
        opts: [
          { text: "Rely solely on the application server's default connection pooling settings to manage database connections.", correct: false, feedback: 'Default settings may be insufficient; correct resource handling in code is required alongside proper pool configuration.' },
          { text: 'Implement proper synchronization mechanisms for all shared resources and ensure every critical section is thread-safe.', correct: true, feedback: 'Using synchronized blocks, ReentrantLock, or java.util.concurrent utilities protects shared state from race conditions and deadlocks.' },
          { text: 'Increase the maximum number of connections in the database pool to accommodate more concurrent users.', correct: false, feedback: 'Increasing pool size is a temporary workaround; it masks the underlying thread-safety issue and still leads to exhaustion under load.' },
        ],
      },
    },
    nodejs: {
      open: "Async/await makes my Node.js code look synchronous, so it should execute in a predictable linear fashion even under multiple concurrent requests. That's the whole point of async/await.",
      story: "Leo's new endpoint, built with a chain of await calls, is deployed. Under light load it works perfectly. During a peak traffic surge, users report intermittent data inconsistencies: a request for resource A occasionally returns data from a different user's concurrent request, baffling Leo since his await chain should prevent any interleaving.",
      b1: {
        name: 'Jordan', role: 'Frontend Engineer', color: '#65A30D',
        content: "Leo, are you sure you're not caching user-specific data in a module-level variable? Or maybe some middleware is modifying the request object before your handler runs?",
        expanded: "Global state is a common trap in Node.js. If you're storing anything tied to a specific request outside the request context, concurrent requests will definitely stomp on each other's data. Check your middleware chain carefully.",
        question: "What is the most likely reason for data inconsistencies in Leo's async/await API under concurrent requests?",
        opts: [
          { text: 'The database transaction isolation level is too low, allowing dirty reads or non-repeatable reads between requests.', correct: false, feedback: 'Database isolation can cause this, but the issue points more to application-level state management given the await structure.' },
          { text: 'Shared mutable state is inadvertently modified across concurrent requests due to event loop interleaving between awaits.', correct: true, feedback: 'Async/await only guarantees sequential execution within a single logical flow. The event loop still interleaves different request handlers.' },
          { text: 'The event loop is becoming saturated, causing requests to be processed out of order and corrupting data.', correct: false, feedback: 'Event loop saturation causes latency, not corruption. Corruption implies shared state being overwritten by concurrent handlers.' },
        ],
      },
      bridge: "Jordan's point about module-level state is making me rethink. My await chain handles one request's flow, but it doesn't stop other incoming requests from running their own chains concurrently. Could my service layer be using a shared object?",
      b2: {
        name: 'Mei', role: 'Senior Full-Stack Engineer', color: '#DC2626',
        content: "Leo, async/await manages control flow for one request's execution, but Node.js's event loop still interleaves different concurrent request handlers between every await.",
        expanded: "Shared mutable state — even seemingly local variables in module scope — can be accessed by different requests. Always pass request-specific data down the call stack or use a context library, and never mutate module-level variables inside request handlers.",
        question: "How should Leo address shared mutable state causing data inconsistencies in his Node.js API under concurrency?",
        opts: [
          { text: 'Refactor all async/await code to use Promises and callbacks to avoid implicit state sharing between handlers.', correct: false, feedback: 'Async/await is syntactic sugar for Promises and does not change how Node.js handles shared state or concurrent execution.' },
          { text: 'Ensure all request-specific data is passed explicitly down the call stack or managed via request-scoped context.', correct: true, feedback: 'Scoping state to the request prevents concurrent handlers from accessing or modifying each other\'s data inadvertently.' },
          { text: "Implement explicit mutex locks around shared variables to prevent concurrent modifications inside async handlers.", correct: false, feedback: "Node.js's single-threaded model makes explicit locks usually unnecessary, and adding them without understanding the event loop adds complexity." },
        ],
      },
    },
  },
  s02: {
    python: {
      open: "My requirements.txt pins all direct dependencies precisely. This guarantees a stable and reproducible environment across all machines. Minor sub-dependency version bumps should be harmless — they're backward-compatible by convention.",
      story: "Aisha deploys a new feature. Suddenly production starts throwing ImportError on a module that worked perfectly in staging. The error traces to a deep transitive dependency, cryptography, which received a minor version update. Her pinned direct dependencies are unchanged, but the sub-dependency's API broke compatibility silently.",
      b1: {
        name: 'Dev', role: 'Senior Data Scientist', color: '#D97706',
        content: "Aisha, sometimes pip's resolver is tricky. Did you try a clean pip install --no-cache-dir? Might be a corrupted cached package causing the mismatch.",
        expanded: "Pip caches wheels, and sometimes an old or corrupted cache entry leads to unexpected mismatches. Clearing it forces a fresh download. Also ensure the base Python version is identical in staging and production.",
        question: "What is the root cause of Aisha's production ImportError despite all direct dependencies being pinned in requirements.txt?",
        opts: [
          { text: 'A manual pip install was executed in production, accidentally installing an incompatible version of a package.', correct: false, feedback: 'While possible, the more systemic issue here is unpinned transitive dependencies creating a reproducibility gap.' },
          { text: 'A transitive dependency updated its minor version, introducing a breaking API change not caught by direct dependency pinning.', correct: true, feedback: 'Pinning only direct dependencies leaves transitive dependencies free to update, and minor versions can still introduce breaking changes.' },
          { text: "The production environment's underlying OS libraries are incompatible with the installed Python packages.", correct: false, feedback: 'OS library incompatibility is possible, but the error pointing to a Python module API change strongly suggests a Python-level version conflict.' },
        ],
      },
      bridge: "Dev's suggestion about cache didn't solve it. The error points to a specific breaking change in a deep dependency. My requirements.txt isn't capturing the full dependency graph state — just the top layer. How do I pin everything?",
      b2: {
        name: 'Riya', role: 'Data Engineering Lead', color: '#0369A1',
        content: "Aisha, direct pinning isn't enough. You need full dependency locking — transitives included — to prevent unexpected breaking changes from any level of the dependency tree.",
        expanded: "Use pip-tools to generate a requirements.txt that includes all transitive dependencies with pinned versions. Run pip-compile on your high-level requirements file and commit the output. That file is your environment's exact fingerprint.",
        question: "What is the most robust method to ensure a fully reproducible Python environment including all transitive dependencies?",
        opts: [
          { text: 'Manually inspect and add every transitive dependency and its version to the requirements.txt file.', correct: false, feedback: 'Manual inspection is error-prone and impractical for complex projects with dozens of transitive dependencies.' },
          { text: 'Use a dependency locking tool like pip-tools to generate a comprehensive requirements.txt with all pinned versions.', correct: true, feedback: 'pip-tools automatically resolves and pins all direct and transitive dependencies, producing a fully reproducible lockfile.' },
          { text: 'Regularly update all dependencies to their latest versions to benefit from bug fixes and avoid old compatibility issues.', correct: false, feedback: 'Regular updates are good hygiene, but they do not guarantee reproducibility. A lockfile is needed to freeze the exact environment state.' },
        ],
      },
    },
    java: {
      open: "Adding a new library to Maven is straightforward. I just need the artifact ID and version, and Maven handles the rest. One dependency block, done.",
      story: "Vikram adds a new logging library to his project. Upon rebuilding, the application fails to start with a NoSuchMethodError originating from an older XML parsing library that the project already uses. Maven's build output showed warnings about version conflicts, but Vikram did not understand their significance until the application refused to boot.",
      b1: {
        name: 'Rahul', role: 'Junior Backend Engineer', color: '#0891B2',
        content: "Vikram, did you check the new library's dependencies? Maybe it's bringing in an older version of something we already depend on and they're clashing.",
        expanded: "Transitive dependencies are a pain. A new library can pull in an older, incompatible version of a common library you're already using. Maven tries to resolve it with nearest-first, but not always correctly. You might need to explicitly exclude it.",
        question: "What is the primary reason for the NoSuchMethodError after adding a new library to Vikram's Maven project?",
        opts: [
          { text: 'The new logging library is fundamentally incompatible with the existing application runtime environment.', correct: false, feedback: 'Fundamental incompatibility would manifest as a ClassNotFoundException. NoSuchMethodError specifically points to a version conflict on a shared dependency.' },
          { text: "A transitive dependency of the new library introduced an older version of an existing library, removing an expected method.", correct: true, feedback: "Maven's nearest-first resolution may select the older version if it appears closer in the dependency tree, removing APIs the application expects." },
          { text: "The application server's classpath is misconfigured, loading the wrong version of the XML parsing library.", correct: false, feedback: 'Classpath misconfiguration is possible, but Maven manages the classpath. The issue likely stems from Maven resolution logic itself.' },
        ],
      },
      bridge: "Rahul's on the right track — it's a transitive conflict. Maven showed those warnings but I didn't know what nearest-first meant or how to force a specific version. I need to understand how to take control of the resolution.",
      b2: {
        name: 'Kavya', role: 'Senior Backend Engineer', color: '#7C3AED',
        content: "Vikram, Maven's nearest-first conflict resolution picks the version closest to your project in the dependency tree. When that version is older than expected, methods disappear at runtime.",
        expanded: "Manage this with exclusions in the offending dependency block, or declare the desired version explicitly in your pom.xml dependencyManagement section. Always run mvn dependency:tree before adding a new library to understand the full graph you're inheriting.",
        question: "To resolve a transitive dependency version conflict in Maven, what is the most effective approach?",
        opts: [
          { text: 'Remove the conflicting library from the project even if it provides critical functionality.', correct: false, feedback: 'Removing a critical library is not viable. The goal is to control which version is selected, not eliminate the dependency.' },
          { text: 'Use exclusions on the new dependency or declare the desired version in dependencyManagement to override resolution.', correct: true, feedback: 'Exclusions prevent the unwanted transitive version from entering the graph; dependencyManagement enforces the version you want across the whole project.' },
          { text: 'Rename the conflicting package to avoid a namespace collision and allow both versions to coexist on the classpath.', correct: false, feedback: 'Package renaming is not a standard Maven practice and does not resolve version conflicts — it just hides them and creates new ones.' },
        ],
      },
    },
    nodejs: {
      open: "My Dockerfile builds successfully and the app runs perfectly in the container. The order of instructions shouldn't matter much as long as the end result works. It's just a sequence of shell commands.",
      story: "Leo makes a minor code change and rebuilds his Docker image. The docker build takes eight minutes. He watches npm install execute every single time, downloading hundreds of packages, even though package.json has not changed. His teammates in the Slack channel are asking why every PR takes this long to pass CI.",
      b1: {
        name: 'Carlos', role: 'DevOps Engineer', color: '#B45309',
        content: "Leo, are you copying your application code before npm install? That invalidates the layer cache for node_modules every time any file changes, not just package.json.",
        expanded: "Docker caches layers sequentially. If COPY . . happens before npm install, then any file change — even a comment — invalidates that COPY layer and everything after it, forcing npm install to re-run from scratch every single build.",
        question: "Why is Leo's Docker image rebuild taking eight minutes for minor code changes when dependencies have not changed?",
        opts: [
          { text: "The Docker daemon's build cache is corrupted and needs to be manually cleared and regenerated.", correct: false, feedback: 'A corrupted cache causes one-off failures, not consistently slow builds on every code change. The pattern points to a structural Dockerfile issue.' },
          { text: 'The COPY . . instruction is placed before npm install, invalidating the node_modules cache layer on every code change.', correct: true, feedback: 'Docker invalidates all layers from the first changed instruction forward. Copying all source code early forces npm install to rerun unnecessarily.' },
          { text: 'The base Node.js image is outdated, causing slow package downloads and compilation during each build.', correct: false, feedback: 'An outdated base image might slow downloads, but it would not explain why npm install reruns on minor code changes that leave package.json untouched.' },
        ],
      },
      bridge: "Carlos hit it. I always put COPY . . first to get all files into the image context. But if that invalidates the npm install cache every time, my whole Dockerfile layer strategy is backwards. The order of instructions defines the caching boundary.",
      b2: {
        name: 'Mei', role: 'Senior Full-Stack Engineer', color: '#DC2626',
        content: "Leo, Docker layers cache sequentially from top to bottom. COPY your package files first, run npm install, then COPY your source code. That way npm install only reruns when dependencies actually change.",
        expanded: "The package.json and package-lock.json layer changes rarely, so npm install gets cached. Your source code layer changes frequently, but it comes after — so it only invalidates itself. This simple ordering turns an 8-minute build into a 30-second one for code-only changes.",
        question: "What is the optimal Dockerfile instruction order to leverage layer caching for a Node.js application?",
        opts: [
          { text: 'Place COPY . . at the beginning so all files are available before any subsequent instructions run.', correct: false, feedback: 'Copying everything early invalidates the cache for all subsequent layers, including npm install, on every code change.' },
          { text: 'Copy only package.json and package-lock.json first, run npm install, then copy the rest of the application code.', correct: true, feedback: 'This order caches the npm install layer until dependencies change, while source code changes only invalidate the later COPY layer.' },
          { text: 'Run npm install on the host machine and then COPY the node_modules directory into the Docker image directly.', correct: false, feedback: 'Copying node_modules from the host can cause platform-specific binary mismatches and makes the build non-reproducible across environments.' },
        ],
      },
    },
  },
  s03: {
    python: {
      open: "Polars offers a 10x speedup over pandas. I'm confident that replacing our pandas operations with Polars will dramatically speed up the entire data pipeline. The benchmarks are clear.",
      story: "Aisha presents her Polars migration proposal to the team, citing impressive benchmarks for CPU-bound columnar operations. She outlines the refactor plan and estimates two weeks of work. Riya opens the pipeline's Datadog dashboard and points to the flame graph: 78% of wall-clock time is spent waiting on S3 reads and Redshift query results. The CPU computation Polars optimizes is 9% of total runtime.",
      b1: {
        name: 'Dev', role: 'Senior Data Scientist', color: '#D97706',
        content: "Polars is fast, no doubt. But have we actually profiled where our pipeline's bottlenecks are? Benchmarks on synthetic data don't always match production behavior.",
        expanded: "A blanket replacement might not yield the expected gains if the real delays are in I/O operations — fetching from S3, writing to Redshift — rather than in-memory computation. Polars is great but it won't speed up a network round trip.",
        question: "What is the most important factor to evaluate before migrating a data pipeline to a faster processing library like Polars?",
        opts: [
          { text: "The new library's raw computational benchmark scores on large in-memory datasets.", correct: false, feedback: 'Benchmark scores only matter if in-memory computation is the bottleneck. If most time is spent on I/O, a faster compute library changes nothing.' },
          { text: 'Whether the pipeline is CPU-bound or I/O-bound, identified through profiling the actual production workload.', correct: true, feedback: 'Profiling reveals where time is actually spent. Optimizing CPU-bound operations with a faster library only helps if CPU is the real bottleneck.' },
          { text: 'The ease of migrating existing pandas code to the new library\'s API to minimize refactor effort.', correct: false, feedback: 'Migration effort is a practical concern but secondary — if the bottleneck is I/O, even an easy migration will not improve pipeline speed.' },
        ],
      },
      bridge: "Dev's question about bottlenecks landed differently seeing the actual flame graph. I had benchmarks showing Polars is faster at computation, but I never checked what percentage of our pipeline time is actually computation versus waiting on S3 and Redshift.",
      b2: {
        name: 'Riya', role: 'Data Engineering Lead', color: '#0369A1',
        content: "Aisha, before any library migration, profile the end-to-end pipeline under production load. Our bottleneck is I/O wait, not CPU. Polars won't touch that.",
        expanded: "The right optimization here is parallel S3 reads, query pushdown to Redshift, or smarter partitioning — not a compute library swap. The lesson is: measure first, then optimize. A two-week refactor that moves a 9% metric is engineering theater.",
        question: "When a data pipeline profiling reveals 78% of runtime is I/O wait, what is the correct optimization strategy?",
        opts: [
          { text: 'Replace the compute library with a faster one to reduce the CPU-bound portion of execution time.', correct: false, feedback: 'Optimizing the 22% CPU portion will have minimal impact when 78% of time is blocked on I/O that the compute library cannot affect.' },
          { text: 'Target the I/O operations directly — parallel reads, query pushdown, or smarter data partitioning strategies.', correct: true, feedback: "Reducing I/O wait directly attacks the dominant bottleneck. This is where most of the pipeline's time is actually spent." },
          { text: 'Add more CPU cores to the processing environment to handle both compute and I/O operations faster.', correct: false, feedback: 'More CPU helps CPU-bound work. I/O wait is blocked on network and storage latency, which more cores cannot reduce.' },
        ],
      },
    },
    java: {
      open: "Spring Boot is overkill for this new microservice. We don't need all that framework overhead and boilerplate for a simple notification service. A lightweight framework will be faster to build and easier to maintain.",
      story: "Vikram advocates strongly for a minimalist Java framework for the new payment notification microservice, emphasizing its small footprint and fast startup. The architecture review begins. Suresh opens a slide showing the 23 other microservices at Finova, each with standardized health endpoints, Prometheus metrics, centralized config via Spring Cloud Config, and OAuth2 integration. He asks Vikram how the new service will wire into each of these.",
      b1: {
        name: 'Suresh', role: 'Principal Architect', color: '#2563EB',
        content: "How will this lightweight service expose health endpoints, emit Prometheus metrics, pull config from our vault, and integrate with our OAuth2 provider? Walk me through each one.",
        expanded: "A lighter framework might feel simpler in isolation. But at Finova, consistency across the microservice fleet is itself a feature. Operators need every service to behave predictably. Diverging from the standard stack creates a unique support burden every time the service needs to be debugged or upgraded.",
        question: "When selecting a framework for a new microservice in an established enterprise, what is a crucial consideration beyond initial development speed?",
        opts: [
          { text: "The framework's community size and third-party library ecosystem for rapid feature development.", correct: false, feedback: 'Community size helps, but in an enterprise with 20+ existing services, integration consistency with the current stack matters far more.' },
          { text: 'Its seamless integration with the existing enterprise observability, security, and configuration management patterns.', correct: true, feedback: 'Enterprise microservices need standardized health checks, metrics, and auth. A divergent framework creates a unique operational burden for every incident.' },
          { text: 'The minimum memory footprint and container startup time of the framework under production load.', correct: false, feedback: 'Performance characteristics matter, but they are secondary to ensuring the service integrates correctly with the existing infrastructure and tooling.' },
        ],
      },
      bridge: "Suresh's questions caught me off guard. I was thinking about the code I'd write, not the 23 other services this one needs to behave like. Boilerplate is not just ceremony — it's how every service at Finova connects to the same operational backbone.",
      b2: {
        name: 'Kavya', role: 'Senior Backend Engineer', color: '#7C3AED',
        content: "Vikram, Spring Boot's starters exist precisely because those 23 concerns — health, metrics, config, security — are solved problems. The boilerplate is the integration.",
        expanded: "A new engineer joining the team can understand any Spring Boot service immediately because they all follow the same patterns. If you build a bespoke lightweight service, you own every integration forever. In a large engineering org, consistency is worth more than cleverness.",
        question: "What is a primary advantage of using a standardized framework like Spring Boot across an enterprise microservice fleet?",
        opts: [
          { text: 'It forces developers to write less total code across all services, reducing the overall engineering headcount needed.', correct: false, feedback: 'Spring Boot reduces boilerplate for common concerns but does not reduce total code. Its primary value is standardization, not line count reduction.' },
          { text: 'It provides standardized patterns for operational concerns like observability, security, and config that work consistently fleet-wide.', correct: true, feedback: "Spring Boot's strength is that every service exposes the same operational surface. This makes the entire fleet predictable to run and debug." },
          { text: 'It guarantees the fastest possible runtime performance for all microservice operations regardless of workload type.', correct: false, feedback: 'Performance depends on code quality and architecture. Spring Boot optimizes for developer experience and operational consistency, not peak throughput.' },
        ],
      },
    },
    nodejs: {
      open: "Our notification service is full of runtime type errors. Rewriting it in TypeScript will eliminate these issues and make it robust. Static typing is the answer to our reliability problems.",
      story: "Leo pitches the TypeScript rewrite in the sprint planning. He has prepared examples of the runtime errors it would prevent. Mei pulls up the service's test coverage report: 40% coverage, with the entire retry logic and the webhook delivery module untested. She sets it next to Leo's error log. Most of the production incidents trace to those two untested modules.",
      b1: {
        name: 'Jordan', role: 'Frontend Engineer', color: '#65A30D',
        content: "TypeScript definitely helps, but are these service crashes actually from type mismatches? A lot of bugs I've seen in Node services come from untested code paths, not wrong types.",
        expanded: "Static types catch type errors at compile time, which is great. But they can't catch incorrect business logic, missing edge case handling, or faulty external API integration behavior. Those need tests, not type annotations.",
        question: "What is a key limitation of a static type system like TypeScript in preventing all categories of production bugs?",
        opts: [
          { text: 'It significantly adds to build time and tooling complexity, slowing down developer iteration cycles.', correct: false, feedback: 'Build overhead is a practical tradeoff but it is not a limitation of what TypeScript can prevent. The question is about bug prevention coverage.' },
          { text: 'It cannot prevent logic errors, incorrect business rules, or unexpected behavior from external API responses at runtime.', correct: true, feedback: 'Type systems ensure structural correctness but cannot guarantee that the logic itself is correct or that external dependencies behave as assumed.' },
          { text: 'It is designed primarily for frontend development and lacks the tooling support needed for production Node.js backends.', correct: false, feedback: 'TypeScript has excellent support for Node.js backends with specific type definitions and is widely used in production server environments.' },
        ],
      },
      bridge: "Jordan pointing at the untested modules shifted something. The type errors I can point to are real but small. The incidents that paged us at 2am were all from the retry logic and webhook module — neither has a single test.",
      b2: {
        name: 'Mei', role: 'Senior Full-Stack Engineer', color: '#DC2626',
        content: "Leo, the instability is not the language — it's the 40% coverage. TypeScript would have caught none of the incidents that actually happened. The retry logic and webhook module need tests, not types.",
        expanded: "TypeScript is valuable and I'd support migrating incrementally. But it won't fix untested code. A rewrite in TypeScript with 40% coverage is still a service that fails under conditions you've never tested. Cover the retry logic and webhook delivery first — that's where the pain actually lives.",
        question: "What is the most impactful first step to improve reliability in a critical backend service with 40% test coverage?",
        opts: [
          { text: 'Rewrite the service in a statically typed language to eliminate the category of runtime type errors.', correct: false, feedback: 'A rewrite in TypeScript with the same test coverage would still fail on the same untested code paths that cause the current incidents.' },
          { text: 'Increase test coverage specifically on the highest-risk modules identified by the production incident history.', correct: true, feedback: 'Targeting tests at the modules that actually caused incidents addresses the real source of unreliability before adding new abstraction layers.' },
          { text: 'Add comprehensive input validation and error handling across all API endpoints to catch bad data early.', correct: false, feedback: 'Input validation is good hygiene but does not address the untested retry and webhook logic that is causing the actual production failures.' },
        ],
      },
    },
  },
  s04: {
    python: {
      open: "There's a KeyError in the logs. Easy fix — I'll add a .get() with a default value. Pipeline won't crash anymore. That's the error handled.",
      story: "Aisha spots KeyError: customer_id in the daily pipeline logs, adds a .get call with a default of UNKNOWN, deploys. The pipeline runs without error. Over the next three days, the customer analytics dashboard fills with UNKNOWN entries, distorting every revenue report. Priya spots the anomaly in the weekly data review and traces it back to the silent default that masked a broken upstream data feed.",
      b1: {
        name: 'Dev', role: 'Senior Data Scientist', color: '#D97706',
        content: "Adding a default stops the crash, but did we figure out why customer_id is suddenly missing? That key has always been there.",
        expanded: "Silencing an error with a default is sometimes right, but here we should investigate whether an upstream API changed its schema or there's a data quality issue. An UNKNOWN customer_id will distort every downstream metric that depends on it.",
        question: "What is the most critical step after silencing a KeyError with a default value in a data pipeline?",
        opts: [
          { text: 'Verify the pipeline runs without errors for several days to confirm the fix is stable.', correct: false, feedback: 'The pipeline running without errors confirms the default is working, not that the data being produced is correct or meaningful.' },
          { text: 'Investigate why the key is missing to determine whether a data contract upstream has changed unexpectedly.', correct: true, feedback: 'A suddenly missing required key signals a contract break. Silencing it without investigation produces silently wrong data, which is worse than a crash.' },
          { text: 'Document the default value behavior and notify stakeholders that some records will show UNKNOWN.', correct: false, feedback: 'Documentation is appropriate if the default is intentional. First you need to determine whether this is expected behavior or a bug in the upstream source.' },
        ],
      },
      bridge: "Dev's question is the one I avoided. I was proud of the fast fix, but defaulting to UNKNOWN means the pipeline is now producing wrong data silently. The error is gone but the problem is still running in production, quietly.",
      b2: {
        name: 'Riya', role: 'Data Engineering Lead', color: '#0369A1',
        content: "Aisha, always trace the lineage. A KeyError on a required field means a data contract upstream changed. Defaulting to UNKNOWN is worse than crashing — it produces confident wrong data.",
        expanded: "Check the upstream API's changelog or contact that team. This is exactly why we need schema validation at ingestion boundaries, not just error handling. A pipeline that crashes loudly is easier to debug than one that silently writes wrong values for three days.",
        question: "What is the most effective long-term strategy to prevent data contract changes from silently corrupting a production data pipeline?",
        opts: [
          { text: 'Apply defensive defaults for all dictionary key accesses throughout the pipeline to prevent any crashes.', correct: false, feedback: 'Defensive defaults mask contract violations rather than detecting them. The goal is to catch schema changes at ingestion, not hide their effects downstream.' },
          { text: 'Implement schema validation at ingestion boundaries so that contract changes surface as loud failures immediately.', correct: true, feedback: 'Schema validation at the entry point catches contract breaks before wrong data propagates downstream, making failures loud and localized rather than silent and widespread.' },
          { text: 'Regularly review and manually update field access code to match any upstream API documentation changes.', correct: false, feedback: 'Manual reviews are reactive and slow. Automated schema validation catches contract changes immediately, without depending on human review cycles.' },
        ],
      },
    },
    java: {
      open: "NullPointerException — classic. Stack trace points right to line 84. Add a null check there, problem solved. Another bug squashed.",
      story: "Vikram reads the stack trace, finds the exact line, adds if (paymentDetails != null). The NPE disappears from logs. Two days later Kavya flags a silent regression: a subset of payment processing requests are now silently skipped rather than failing loud. The null check that prevented the crash also prevented the retry logic from triggering, and real payments are being dropped.",
      b1: {
        name: 'Rahul', role: 'Junior Backend Engineer', color: '#0891B2',
        content: "That null check stopped the crash, but was paymentDetails ever supposed to be null? It feels like something that should always be present.",
        expanded: "If paymentDetails is always supposed to exist, then null means something upstream is broken — a service returned an unexpected response, or a database query returned nothing when it should always return a result. The null is a signal, not just a missing value.",
        question: "After fixing a NullPointerException with a null check, what is the most important follow-up question?",
        opts: [
          { text: 'Is the null check implementation robust enough to handle all possible null scenarios in future requests?', correct: false, feedback: 'Defensive robustness is good, but the prior question is whether this null should ever occur at all, which the check has now hidden.' },
          { text: 'Why did this value become null — is this an expected condition or a signal that something upstream is broken?', correct: true, feedback: 'A null on a value that should always be present is a symptom. Fixing the symptom without finding the cause leaves the upstream breakage undetected.' },
          { text: 'Should the null case return a default response instead of silently skipping the operation entirely?', correct: false, feedback: 'Choosing between skip and default is a design question. It should only be answered after understanding whether this null is expected or anomalous.' },
        ],
      },
      bridge: "Rahul's right. I stopped the crash but I didn't ask whether paymentDetails should ever be null. If it shouldn't, then my null check is hiding a broken upstream call, and now real payments are silently being skipped.",
      b2: {
        name: 'Kavya', role: 'Senior Backend Engineer', color: '#7C3AED',
        content: "Vikram, a null check is a symptom fix. The stack trace shows where it failed. You need to trace backward to where paymentDetails is populated and find out why it's null.",
        expanded: "Was a downstream service returning 404 instead of a default response? Did the database return an empty result set when it should always have a row? Debugging in a microservice system means tracing across service boundaries, not just fixing the line that threw the exception.",
        question: "What is the most effective approach to debugging a NullPointerException in a microservice architecture?",
        opts: [
          { text: 'Add a null check at the point of the exception and log a warning so the issue is visible in future monitoring.', correct: false, feedback: 'Logging helps, but the fix still masks the upstream problem. The payment being silently skipped will not appear as an error in logs.' },
          { text: "Trace the value's origin by following the call chain and logs across service boundaries to find why it became null.", correct: true, feedback: 'Tracing to the origin reveals whether a downstream service is failing, a query is returning empty results, or a code path is not setting the value as expected.' },
          { text: 'Refactor the method to use Optional to make null handling explicit and idiomatic throughout the codebase.', correct: false, feedback: 'Optional improves code clarity for nullable values, but it does not explain why a value that should always be present is suddenly null.' },
        ],
      },
    },
    nodejs: {
      open: "I stepped through the debugger, watched send() execute exactly once. The duplicate notification bug must be intermittent network retries from the delivery provider. Not our code.",
      story: "Leo runs the debugger, confirms sendNotification is called once per request in his trace. He closes the ticket as a delivery provider issue. The next morning there are 847 duplicate notification reports. Carlos runs a concurrent load test against staging: every run with 20+ simultaneous requests produces duplicates. Leo's debugger trace was single-threaded and never showed the race.",
      b1: {
        name: 'Jordan', role: 'Frontend Engineer', color: '#65A30D',
        content: "Leo, could the duplicates be from two requests hitting the endpoint simultaneously? A debugger trace only shows one request at a time — it can't show concurrent racing.",
        expanded: "If two requests arrive close together, they might both pass an already-sent check before either one has written the sent flag. A single-threaded debugger session will never reproduce that. You need a concurrent test to observe the race.",
        question: "What is a critical limitation of using a single-threaded debugger session to diagnose intermittent duplicate-action bugs?",
        opts: [
          { text: 'The debugger pauses execution, which changes the timing and may cause the program to bypass certain code paths.', correct: false, feedback: 'Debugger pausing can affect timing-sensitive bugs, but the more fundamental issue is that a single session only traces one request and misses concurrent interactions.' },
          { text: "A debugger traces one request's execution path and cannot reveal race conditions between concurrent requests.", correct: true, feedback: "Concurrent race conditions only appear when multiple requests interleave. A single-request trace appears clean because it doesn't show what another request is doing simultaneously." },
          { text: 'Debuggers do not have access to the Node.js event loop internals, making async bugs invisible in traces.', correct: false, feedback: 'Modern debuggers can show async call stacks, but the missing piece here is concurrency across multiple requests, not async visibility within one.' },
        ],
      },
      bridge: "Jordan pointing at concurrency changed my read of the bug. My debugger confirmed one request is correct. But if two requests arrive 50ms apart, they could both pass the sent check before either writes the result. That race is invisible in a single trace.",
      b2: {
        name: 'Mei', role: 'Senior Full-Stack Engineer', color: '#DC2626',
        content: "Leo, this is a non-atomic check-then-act pattern. Two concurrent requests both read sent=false, both proceed, both send. Your debugger only shows the world from one request's perspective.",
        expanded: "The fix is an atomic upsert or a database-level unique constraint that rejects the second insert. You can also use a distributed lock keyed on the notification ID. The general lesson is: whenever correctness depends on reading state before writing it, that operation must be atomic.",
        question: "What is the correct strategy to prevent duplicate actions caused by a race condition in a concurrent web service?",
        opts: [
          { text: 'Add retry logic with exponential backoff so duplicate requests are automatically de-duplicated by the delivery provider.', correct: false, feedback: 'Retry logic addresses delivery reliability, not the race condition in your own check-then-act logic that is causing the duplicates in the first place.' },
          { text: 'Make the check-and-set operation atomic using a database constraint, atomic upsert, or distributed lock keyed on the resource.', correct: true, feedback: 'Atomic operations guarantee that the second concurrent request fails rather than proceeding, because the state can only transition from unsent to sent once.' },
          { text: 'Increase server processing speed so that the window for concurrent races is too small to occur in practice.', correct: false, feedback: 'Reducing the race window lowers the probability but does not eliminate it. Under sufficient load, any non-zero window will eventually produce duplicates.' },
        ],
      },
    },
  },
};

// ─── Custom story + character components ───────────────────────────────────

const ProtagonistAvatar = ({ name, role, color, content, expandedContent }: {
  name: string; role: string; color: string;
  content: React.ReactNode;
  expandedContent?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div whileHover={{ y: -1, boxShadow: '0 8px 28px rgba(0,0,0,0.1)' }}
      style={{ background: 'var(--ed-card)', borderRadius: '10px', border: '1px solid var(--ed-rule)', borderLeft: `4px solid ${color}`, marginTop: '28px', overflow: 'hidden', transition: 'box-shadow 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      {/* Header */}
      <div onClick={() => setOpen(o => !o)} style={{ padding: '7px 18px', background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, display: 'inline-block' }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color }}>You</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'var(--ed-ink3)', letterSpacing: '0.06em', marginLeft: '4px' }}>· what you&apos;re thinking</span>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>▼</motion.span>
      </div>
      {/* Body */}
      <div style={{ padding: '18px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <SWEMentorFace name={name} size={66} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '1px' }}>{name}</div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '10px', letterSpacing: '0.04em' }}>{role}</div>
          <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.82, fontStyle: 'italic', fontFamily: "'Lora', 'Georgia', serif" }}>{content}</div>
        </div>
      </div>
      {/* Expanded */}
      <AnimatePresence>
        {open && expandedContent && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px 20px', borderTop: '1px solid var(--ed-rule)', background: 'var(--ed-cream)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '3px', flexShrink: 0, background: color, borderRadius: '2px', alignSelf: 'stretch', opacity: 0.35 }} />
              <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.9, fontStyle: 'italic', fontFamily: "'Lora', 'Georgia', serif" }}>{expandedContent}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StoryCard = ({ protagonist, accentColor, children }: { protagonist: string; accentColor: string; children: React.ReactNode }) => (
  <div style={{ position: 'relative', background: 'var(--ed-amber-bg)', borderRadius: '6px', padding: '20px 24px', margin: '0 0 28px', borderTop: '1px solid var(--ed-amber-border)', borderRight: '1px solid var(--ed-amber-border)', borderBottom: '1px solid var(--ed-amber-border)', borderLeft: `4px solid ${accentColor}` }}>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: accentColor, marginBottom: '10px' }}>◎ {protagonist}&apos;s Situation</div>
    <div style={{ fontSize: '15px', color: 'var(--ed-ink)', lineHeight: 1.85, fontStyle: 'italic', fontFamily: "'Lora', 'Georgia', serif" }}>{children}</div>
  </div>
);

// ─── SWEMentorFace ────────────────────────────────────────────────────────────
const SWEMentorFace = ({ name, size = 66 }: { name: string; size?: number }) => {
  const [blink, setBlink] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const schedule = () => {
      timerRef.current = setTimeout(() => {
        setBlink(true);
        setTimeout(() => { setBlink(false); schedule(); }, 120);
      }, 2800 + Math.random() * 2400);
    };
    schedule();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);
  const eyeRy = blink ? 0.7 : 4.8;

  const faces: Record<string, React.ReactNode> = {
    Riya: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#024F8C" />
        <path d="M 34 90 Q 50 102 66 90" fill="#0369A1" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#BF8B5A" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#BF8B5A" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#BF8B5A" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#BF8B5A" />
        <ellipse cx="50" cy="22" rx="28" ry="15" fill="#1A0A05" />
        <path d="M 22 30 Q 28 22 50 20 Q 72 22 78 30 L 76 44 Q 64 37 50 37 Q 36 37 24 44 Z" fill="#1A0A05" />
        <ellipse cx="50" cy="10" rx="9" ry="8" fill="#1A0A05" />
        <ellipse cx="50" cy="9" rx="6" ry="4" fill="#2A1005" />
        <path d="M 31 42 Q 38 40 45 42" stroke="#1A0A05" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 55 42 Q 62 40 69 42" stroke="#1A0A05" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#3A2417" /><circle cx="62.5" cy="50.5" r="3.3" fill="#3A2417" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 57 Q 50 62 53 57" stroke="#A96938" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 40 67 Q 50 73 60 67" stroke="#9C5D3B" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Kavya: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#4F35B8" />
        <path d="M 34 90 Q 50 102 66 90" fill="#7C3AED" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#D4956B" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#D4956B" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#D4956B" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#D4956B" />
        <circle cx="24" cy="59" r="2.5" fill="#F0C040" />
        <circle cx="76" cy="59" r="2.5" fill="#F0C040" />
        <ellipse cx="50" cy="22" rx="27" ry="15" fill="#0D0D0D" />
        <path d="M 23 31 Q 28 22 50 20 Q 72 22 77 31 L 76 46 Q 65 39 50 39 Q 35 39 24 46 Z" fill="#0D0D0D" />
        <path d="M 23 46 Q 20 62 22 74 Q 27 65 27 54 Z" fill="#0D0D0D" />
        <path d="M 77 46 Q 80 62 78 74 Q 73 65 73 54 Z" fill="#0D0D0D" />
        <path d="M 31 42 Q 38 40 45 42" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 55 42 Q 62 40 69 42" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#2A1810" /><circle cx="62.5" cy="50.5" r="3.3" fill="#2A1810" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 57 Q 50 62 53 57" stroke="#B07050" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 40 67 Q 50 73 60 67" stroke="#9C6845" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Mei: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#991B1B" />
        <path d="M 34 90 Q 50 102 66 90" fill="#DC2626" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#E8C8A5" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#E8C8A5" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#E8C8A5" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#E8C8A5" />
        <ellipse cx="50" cy="22" rx="27" ry="14" fill="#111111" />
        <path d="M 23 28 Q 30 20 50 18 Q 70 20 77 28 L 77 46 Q 66 38 50 38 Q 34 38 23 46 Z" fill="#111111" />
        <path d="M 23 46 Q 20 62 24 78 Q 28 68 28 56 Z" fill="#111111" />
        <path d="M 77 46 Q 80 62 76 78 Q 72 68 72 56 Z" fill="#111111" />
        <path d="M 25 33 Q 37 28 50 28 Q 63 28 75 33 Q 63 37 50 37 Q 37 37 25 33 Z" fill="#111111" />
        <path d="M 31 41 Q 38 40 45 41" stroke="#111111" strokeWidth="2.3" strokeLinecap="round" fill="none" />
        <path d="M 55 41 Q 62 40 69 41" stroke="#111111" strokeWidth="2.3" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#2A1C14" /><circle cx="62.5" cy="50.5" r="3.3" fill="#2A1C14" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 57 Q 50 61 53 57" stroke="#C09070" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M 41 67 Q 50 72 59 67" stroke="#B07860" strokeWidth="1.9" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Dev: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#92400E" />
        <path d="M 34 90 Q 50 102 66 90" fill="#D97706" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#BF9070" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#BF9070" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#BF9070" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#BF9070" />
        <ellipse cx="50" cy="22" rx="26" ry="12" fill="#1A0A05" />
        <path d="M 24 28 Q 30 22 50 20 Q 70 22 76 28 L 76 38 Q 64 32 50 32 Q 36 32 24 38 Z" fill="#1A0A05" />
        <path d="M 31 42 Q 38 40 45 42" stroke="#1A0A05" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 55 42 Q 62 40 69 42" stroke="#1A0A05" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#3A2010" /><circle cx="62.5" cy="50.5" r="3.3" fill="#3A2010" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <rect x="29" y="44" width="18" height="12" rx="3" stroke="#333" strokeWidth="1.4" fill="none" />
        <rect x="53" y="44" width="18" height="12" rx="3" stroke="#333" strokeWidth="1.4" fill="none" />
        <line x1="47" y1="50" x2="53" y2="50" stroke="#333" strokeWidth="1.4" />
        <path d="M 47 58 Q 50 63 53 58" stroke="#A07048" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 40 68 Q 50 74 60 68" stroke="#906038" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Sam: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#065F46" />
        <path d="M 34 90 Q 50 102 66 90" fill="#059669" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#A07850" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#A07850" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#A07850" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#A07850" />
        <ellipse cx="50" cy="24" rx="26" ry="14" fill="#150805" />
        <path d="M 24 30 Q 32 20 50 19 Q 68 20 76 30 L 75 42 Q 64 35 50 35 Q 36 35 25 42 Z" fill="#150805" />
        <path d="M 24 30 Q 18 38 20 46 Q 24 40 25 32 Z" fill="#150805" />
        <path d="M 76 30 Q 82 38 80 46 Q 76 40 75 32 Z" fill="#150805" />
        <path d="M 31 43 Q 38 41 45 43" stroke="#150805" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 55 43 Q 62 41 69 43" stroke="#150805" strokeWidth="2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="51" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="51" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="51.5" r="3.3" fill="#2A1808" /><circle cx="62.5" cy="51.5" r="3.3" fill="#2A1808" /></>}
        {!blink && <><circle cx="39.5" cy="50.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="50.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 58 Q 50 63 53 58" stroke="#8A6030" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 40 68 Q 50 75 60 68" stroke="#7A5228" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Priya: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#5B21B6" />
        <path d="M 34 90 Q 50 102 66 90" fill="#7C3AED" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#BF8B5A" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#BF8B5A" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#BF8B5A" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#BF8B5A" />
        <path d="M 22 35 Q 28 22 50 20 Q 72 22 78 35 L 76 52 Q 66 44 50 44 Q 34 44 24 52 Z" fill="#0D0505" />
        <ellipse cx="50" cy="10" rx="12" ry="11" fill="#0D0505" />
        <circle cx="50" cy="6" r="5" fill="#0D0505" />
        <path d="M 22 35 Q 18 50 20 62 Q 24 52 24 38 Z" fill="#0D0505" />
        <path d="M 78 35 Q 82 50 80 62 Q 76 52 76 38 Z" fill="#0D0505" />
        <path d="M 31 43 Q 38 41 45 43" stroke="#0D0505" strokeWidth="2.3" strokeLinecap="round" fill="none" />
        <path d="M 55 43 Q 62 41 69 43" stroke="#0D0505" strokeWidth="2.3" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="51" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="51" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="51.5" r="3.3" fill="#2A1408" /><circle cx="62.5" cy="51.5" r="3.3" fill="#2A1408" /></>}
        {!blink && <><circle cx="39.5" cy="50.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="50.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 58 Q 50 63 53 58" stroke="#A97040" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 40 68 Q 50 74 60 68" stroke="#9C6038" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Suresh: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#1E3A8A" />
        <path d="M 34 90 Q 50 102 66 90" fill="#2563EB" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#6B3820" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#6B3820" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#6B3820" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#6B3820" />
        <ellipse cx="50" cy="22" rx="27" ry="14" fill="#0A0505" />
        <path d="M 23 28 Q 30 20 50 18 Q 70 20 77 28 L 76 44 Q 65 37 50 37 Q 35 37 24 44 Z" fill="#0A0505" />
        <path d="M 23 28 Q 19 36 20 44 Q 24 38 24 30 Z" fill="#888" />
        <path d="M 77 28 Q 81 36 80 44 Q 76 38 76 30 Z" fill="#888" />
        <path d="M 23 28 Q 28 22 36 21 Q 32 26 23 28 Z" fill="#888" />
        <path d="M 77 28 Q 72 22 64 21 Q 68 26 77 28 Z" fill="#888" />
        <path d="M 32 43 Q 38 41 45 43" stroke="#0A0505" strokeWidth="2.3" strokeLinecap="round" fill="none" />
        <path d="M 55 43 Q 62 41 68 43" stroke="#0A0505" strokeWidth="2.3" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="51" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="51" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="51.5" r="3.3" fill="#1A0808" /><circle cx="62.5" cy="51.5" r="3.3" fill="#1A0808" /></>}
        {!blink && <><circle cx="39.5" cy="50.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="50.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 58 Q 50 62 53 58" stroke="#5A2810" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 41 67 Q 50 72 59 67" stroke="#4A2010" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Ananya: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#9D174D" />
        <path d="M 34 90 Q 50 102 66 90" fill="#DB2777" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#C89070" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#C89070" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#C89070" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#C89070" />
        <ellipse cx="50" cy="22" rx="28" ry="15" fill="#0F0808" />
        <path d="M 22 30 Q 28 20 50 18 Q 72 20 78 30 L 77 46 Q 65 38 50 38 Q 35 38 23 46 Z" fill="#0F0808" />
        <path d="M 22 30 Q 17 48 18 68 Q 22 56 22 42 Z" fill="#0F0808" />
        <path d="M 78 30 Q 83 48 82 68 Q 78 56 78 42 Z" fill="#0F0808" />
        <path d="M 31 42 Q 38 40 45 42" stroke="#0F0808" strokeWidth="2.1" strokeLinecap="round" fill="none" />
        <path d="M 55 42 Q 62 40 69 42" stroke="#0F0808" strokeWidth="2.1" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#2A1408" /><circle cx="62.5" cy="50.5" r="3.3" fill="#2A1408" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 57 Q 50 62 53 57" stroke="#A87050" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 40 67 Q 50 74 60 67" stroke="#9A6040" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Rahul: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#0E7490" />
        <path d="M 34 90 Q 50 102 66 90" fill="#0891B2" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#9E7060" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#9E7060" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#9E7060" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#9E7060" />
        <ellipse cx="50" cy="23" rx="26" ry="14" fill="#180808" />
        <path d="M 24 29 Q 30 21 50 19 Q 70 21 76 29 L 75 42 Q 64 35 50 35 Q 36 35 25 42 Z" fill="#180808" />
        <path d="M 32 42 Q 38 40 45 42" stroke="#180808" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 55 42 Q 62 40 68 42" stroke="#180808" strokeWidth="2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#2A1408" /><circle cx="62.5" cy="50.5" r="3.3" fill="#2A1408" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 57 Q 50 62 53 57" stroke="#886040" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 40 68 Q 50 74 60 68" stroke="#7A5030" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Jordan: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#3F6212" />
        <path d="M 34 90 Q 50 102 66 90" fill="#65A30D" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#C0A880" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#C0A880" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#C0A880" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#C0A880" />
        <ellipse cx="50" cy="22" rx="28" ry="14" fill="#4A2E10" />
        <path d="M 22 28 Q 30 19 50 18 Q 70 19 78 28 L 76 44 Q 68 34 55 33 Q 44 34 30 38 Q 26 38 22 42 Z" fill="#4A2E10" />
        <path d="M 22 28 Q 19 40 20 52 Q 23 44 23 34 Z" fill="#4A2E10" />
        <path d="M 76 28 Q 79 36 78 46 Q 77 40 77 34 Z" fill="#4A2E10" />
        <path d="M 31 42 Q 38 40 45 42" stroke="#4A2E10" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 55 42 Q 62 40 69 42" stroke="#4A2E10" strokeWidth="2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#3A2810" /><circle cx="62.5" cy="50.5" r="3.3" fill="#3A2810" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 57 Q 50 62 53 57" stroke="#A08858" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M 40 68 Q 50 74 60 68" stroke="#907848" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Carlos: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#78350F" />
        <path d="M 34 90 Q 50 102 66 90" fill="#B45309" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#9A6050" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#9A6050" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#9A6050" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#9A6050" />
        <ellipse cx="50" cy="22" rx="26" ry="13" fill="#1A0A05" />
        <path d="M 24 27 Q 30 20 50 18 Q 70 20 76 27 L 76 38 Q 64 32 50 32 Q 36 32 24 38 Z" fill="#1A0A05" />
        <path d="M 31 42 Q 38 40 45 42" stroke="#1A0A05" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 55 42 Q 62 40 69 42" stroke="#1A0A05" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#2A1008" /><circle cx="62.5" cy="50.5" r="3.3" fill="#2A1008" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 35 61 Q 43 64 50 63 Q 57 64 65 61" stroke="#6A3820" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M 37 65 Q 43 69 50 68 Q 57 69 63 65" stroke="#7A4028" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M 40 58 Q 43 60 46 58" stroke="#7A4028" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M 54 58 Q 57 60 60 58" stroke="#7A4028" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Aisha: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#1D4ED8" />
        <path d="M 34 90 Q 50 102 66 90" fill="#3B82F6" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#D4956B" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#D4956B" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#D4956B" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#D4956B" />
        <ellipse cx="50" cy="22" rx="27" ry="15" fill="#0D0505" />
        <path d="M 23 30 Q 28 20 50 18 Q 72 20 77 30 L 76 46 Q 65 38 50 38 Q 35 38 24 46 Z" fill="#0D0505" />
        <path d="M 23 46 Q 19 62 20 76 Q 25 65 25 52 Z" fill="#0D0505" />
        <path d="M 77 46 Q 81 62 80 76 Q 75 65 75 52 Z" fill="#0D0505" />
        <path d="M 31 42 Q 38 40 45 42" stroke="#0D0505" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 55 42 Q 62 40 69 42" stroke="#0D0505" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#2A1408" /><circle cx="62.5" cy="50.5" r="3.3" fill="#2A1408" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 57 Q 50 62 53 57" stroke="#B07050" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 40 67 Q 50 73 60 67" stroke="#9C6040" strokeWidth="2.1" fill="none" strokeLinecap="round" />
        <circle cx="36" cy="58" r="2.5" fill="rgba(210,120,80,0.35)" />
        <circle cx="64" cy="58" r="2.5" fill="rgba(210,120,80,0.35)" />
      </svg>
    ),
    Vikram: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#0F4C81" />
        <path d="M 34 90 Q 50 102 66 90" fill="#1A6AAF" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#8B5A3A" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#8B5A3A" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#8B5A3A" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#8B5A3A" />
        <ellipse cx="50" cy="22" rx="26" ry="14" fill="#0A0505" />
        <path d="M 24 28 Q 30 20 50 18 Q 70 20 76 28 L 76 42 Q 64 35 50 35 Q 36 35 24 42 Z" fill="#0A0505" />
        <path d="M 24 28 Q 20 38 22 48 Q 25 40 25 32 Z" fill="#0A0505" />
        <path d="M 76 28 Q 80 38 78 48 Q 75 40 75 32 Z" fill="#0A0505" />
        <path d="M 32 42 Q 38 40 45 42" stroke="#0A0505" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 55 42 Q 62 40 68 42" stroke="#0A0505" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="50" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="50" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="50.5" r="3.3" fill="#1A0808" /><circle cx="62.5" cy="50.5" r="3.3" fill="#1A0808" /></>}
        {!blink && <><circle cx="39.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="49.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 57 Q 50 61 53 57" stroke="#7A4020" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 40 67 Q 50 72 60 67" stroke="#6A3010" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 35 61 Q 44 65 50 64 Q 56 65 65 61" stroke="#6A3010" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Leo: (
      <svg viewBox="0 0 100 110" style={{ width: '100%', height: '100%', display: 'block' }}>
        <ellipse cx="50" cy="106" rx="38" ry="18" fill="#B45309" />
        <path d="M 34 90 Q 50 102 66 90" fill="#D97706" />
        <rect x="42" y="76" width="16" height="18" rx="6" fill="#E0B890" />
        <ellipse cx="50" cy="52" rx="26" ry="30" fill="#E0B890" />
        <ellipse cx="24" cy="54" rx="4.5" ry="7" fill="#E0B890" />
        <ellipse cx="76" cy="54" rx="4.5" ry="7" fill="#E0B890" />
        <ellipse cx="50" cy="23" rx="27" ry="14" fill="#2A1808" />
        <path d="M 23 29 Q 30 20 50 18 Q 70 20 77 29 L 76 44 Q 66 36 55 35 Q 44 36 30 40 Q 26 40 23 44 Z" fill="#2A1808" />
        <path d="M 23 29 Q 19 40 20 52 Q 24 43 24 34 Z" fill="#2A1808" />
        <path d="M 77 29 Q 81 38 80 48 Q 77 41 77 34 Z" fill="#2A1808" />
        <path d="M 66 20 Q 74 24 78 32 Q 72 26 66 20 Z" fill="#2A1808" />
        <path d="M 31 43 Q 38 41 45 43" stroke="#2A1808" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 55 43 Q 62 41 69 43" stroke="#2A1808" strokeWidth="2" strokeLinecap="round" fill="none" />
        <ellipse cx="38" cy="51" rx="7" ry={eyeRy} fill="white" />
        <ellipse cx="62" cy="51" rx="7" ry={eyeRy} fill="white" />
        {!blink && <><circle cx="38.5" cy="51.5" r="3.3" fill="#3A2010" /><circle cx="62.5" cy="51.5" r="3.3" fill="#3A2010" /></>}
        {!blink && <><circle cx="39.5" cy="50.2" r="0.9" fill="rgba(255,255,255,0.9)" /><circle cx="63.5" cy="50.2" r="0.9" fill="rgba(255,255,255,0.9)" /></>}
        <path d="M 47 58 Q 50 63 53 58" stroke="#C09060" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M 40 68 Q 50 74 60 68" stroke="#B08050" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <motion.div
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: size, height: size, borderRadius: '16px', flexShrink: 0,
        overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
      }}>
      {faces[name] ?? (
        <div style={{ width: '100%', height: '100%', background: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: size * 0.32, fontWeight: 800, color: '#fff' }}>{name[0]}</span>
        </div>
      )}
    </motion.div>
  );
};

// ─── SWEAvatar — interactive mentor card with face + question ────────────────
const SWEAvatar = ({ name, role, color, content, expandedContent, question, options, conceptId }: {
  name: string; role: string; color: string;
  content: React.ReactNode;
  expandedContent?: React.ReactNode;
  question?: string;
  options?: { text: string; correct: boolean; feedback: string }[];
  conceptId?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const store = useLearnerStore();
  const answered = selectedIdx !== null;
  const isCorrect = answered && options ? options[selectedIdx].correct : false;
  const handleAnswer = (i: number) => {
    if (answered) return;
    setSelectedIdx(i);
    if (conceptId && options) store.recordQuizAttempt(conceptId, options[i].correct);
  };
  return (
    <motion.div whileHover={{ y: -1, boxShadow: '0 8px 28px rgba(0,0,0,0.1)' }}
      style={{ background: 'var(--ed-card)', borderRadius: '10px', border: '1px solid var(--ed-rule)', borderLeft: `4px solid ${color}`, marginTop: '28px', overflow: 'hidden', transition: 'box-shadow 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      {/* Header */}
      <div onClick={() => setOpen(o => !o)} style={{ padding: '7px 18px', background: 'var(--ed-cream)', borderBottom: '1px solid var(--ed-rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, display: 'inline-block' }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color }}>Mentor</span>
          {question && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'var(--ed-ink3)', letterSpacing: '0.06em', marginLeft: '4px' }}>· has a question for you</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {question && answered && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, color: isCorrect ? '#0D7A5A' : '#C85A40', letterSpacing: '0.06em' }}>{isCorrect ? '✓ right track' : '✗ revisit'}</span>}
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>▼</motion.span>
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: '18px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <SWEMentorFace name={name} size={66} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ed-ink)', marginBottom: '1px' }}>{name}</div>
          <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '10px', letterSpacing: '0.04em' }}>{role}</div>
          <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.82 }}>{content}</div>
        </div>
      </div>
      {/* Expanded */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            {expandedContent && (
              <div style={{ padding: '16px 18px 20px', borderTop: '1px solid var(--ed-rule)', background: 'var(--ed-cream)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '3px', flexShrink: 0, background: color, borderRadius: '2px', alignSelf: 'stretch', opacity: 0.35 }} />
                <div style={{ fontSize: '15px', color: 'var(--ed-ink2)', lineHeight: 1.9 }}>{expandedContent}</div>
              </div>
            )}
            {question && options && (
              <div style={{ padding: '18px 20px 20px', borderTop: '1px solid var(--ed-rule)', background: 'var(--ed-cream)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff' }}>{name[0]}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: 'var(--ed-ink3)', letterSpacing: '0.12em' }}>{name.toUpperCase().split(' ')[0]} ASKS</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ed-ink)', lineHeight: 1.55, marginBottom: '14px', fontFamily: "'Lora', serif" }}>{question}</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                  {options.map((opt, i) => {
                    const isSelected = selectedIdx === i;
                    const showResult = answered && isSelected;
                    const rc = opt.correct ? '#0D7A5A' : '#C85A40';
                    return (
                      <motion.button key={i} whileHover={!answered ? { x: 3 } : {}} whileTap={!answered ? { scale: 0.99 } : {}} onClick={() => handleAnswer(i)}
                        style={{ textAlign: 'left' as const, padding: '12px 16px', borderRadius: '8px', border: showResult ? `2px solid ${rc}` : isSelected ? `2px solid ${color}` : '1.5px solid var(--ed-rule)', background: showResult ? (opt.correct ? 'rgba(13,122,90,0.06)' : 'rgba(200,90,64,0.06)') : isSelected ? `${color}08` : 'var(--ed-card)', cursor: answered ? 'default' : 'pointer', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.55, fontFamily: 'inherit', transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '10px', opacity: answered && !isSelected ? 0.5 : 1 }}>
                        <span style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, border: showResult ? `1.5px solid ${rc}` : '1.5px solid var(--ed-rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: showResult ? rc : 'var(--ed-ink3)', background: showResult ? (opt.correct ? 'rgba(13,122,90,0.06)' : 'rgba(200,90,64,0.06)') : 'transparent', transition: 'all 0.15s' }}>
                          {showResult ? (opt.correct ? '✓' : '✗') : String.fromCharCode(65 + i)}
                        </span>
                        {opt.text}
                      </motion.button>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {answered && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                      style={{ marginTop: '12px', padding: '12px 14px', borderRadius: '8px', background: isCorrect ? 'rgba(13,122,90,0.06)' : 'rgba(181,114,10,0.06)', border: `1px solid ${isCorrect ? 'rgba(13,122,90,0.2)' : 'rgba(181,114,10,0.2)'}` }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', color: isCorrect ? '#0D7A5A' : '#B5720A', marginBottom: '5px' }}>{isCorrect ? '✓ RIGHT TRACK' : '→ THINK AGAIN'}</div>
                      <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{options[selectedIdx!].feedback}</div>
                      {conceptId && <div style={{ marginTop: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', color: 'var(--ed-ink3)', letterSpacing: '0.08em' }}>{isCorrect ? '↑ concept mastery updated' : '· try the section quiz for more practice'}</div>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Interactive: Execution Flow (Section 01) ─────────────────────────────

const ExecutionFlow = ({ track, accentColor }: { track: SWETrack; accentColor: string }) => {
  const [step, setStep] = useState(0);
  const steps = track === 'java' ? [
    { label: 'You write code', icon: '📝', desc: 'You type Java source code in Main.java — human-readable instructions for the computer.', detail: 'Source code is just text. The computer cannot run it yet.' },
    { label: 'javac compiles', icon: '⚙️', desc: 'javac (the Java compiler) reads your .java file and checks for type errors, syntax errors, and structural issues.', detail: 'If there are errors, compilation stops here. Nothing runs.' },
    { label: 'Bytecode produced', icon: '📦', desc: 'Compilation produces a .class file — bytecode. Not machine code yet, but a portable intermediate format the JVM understands.', detail: 'The same .class file runs on Windows, Mac, Linux — any machine with a JVM.' },
    { label: 'JVM executes', icon: '🚀', desc: 'The JVM (Java Virtual Machine) reads bytecode and translates it to native machine instructions using JIT compilation.', detail: 'The JVM also manages memory, handles garbage collection, and enforces safety rules at runtime.' },
  ] : track === 'python' ? [
    { label: 'You write code', icon: '📝', desc: 'You write Python source code in script.py — clean, readable instructions.', detail: 'Source code is just text. The computer cannot execute it directly.' },
    { label: 'CPython reads', icon: '⚙️', desc: 'When you run python script.py, the CPython interpreter starts reading your file from the top.', detail: 'Unlike Java, there is no separate compile step — the interpreter reads and runs simultaneously.' },
    { label: 'Bytecode cached', icon: '📦', desc: 'Internally, CPython compiles your code to bytecode (.pyc files) for caching. You rarely see this.', detail: 'This is an implementation detail. The key point is Python reads and runs — no separate javac step.' },
    { label: 'CPython executes', icon: '🚀', desc: 'CPython evaluates each expression, calls functions, and produces output — line by line.', detail: 'If a line is never reached (inside an untested branch), its errors never surface. That is why testing matters.' },
  ] : [
    { label: 'You write code', icon: '📝', desc: 'You write JavaScript in app.js — the same language you know from the browser.', detail: 'JavaScript is text. Node.js is what gives it the ability to run outside a browser.' },
    { label: 'Node loads file', icon: '⚙️', desc: 'You run node app.js. Node reads your file and hands it to the V8 JavaScript engine.', detail: 'V8 is the same engine Chrome uses. It compiles JavaScript directly to native machine code.' },
    { label: 'V8 compiles & runs', icon: '🚀', desc: 'V8 JIT-compiles your JavaScript to native machine code and executes it immediately.', detail: 'V8 is fast — it does not interpret line by line. It compiles entire functions before running them.' },
    { label: 'Event loop starts', icon: '🔄', desc: 'Once the initial code runs, Node starts the event loop — waiting for callbacks, timers, or I/O events.', detail: 'This is why Node stays alive after your main code finishes: it is waiting for async work to complete.' },
  ];

  return (
    <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', padding: '20px 22px', margin: '28px 0' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: accentColor, marginBottom: '16px' }}>INTERACTIVE · EXECUTION FLOW</div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' as const }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            style={{ padding: '6px 14px', borderRadius: '20px', border: `1.5px solid ${i === step ? accentColor : 'var(--ed-rule)'}`, background: i === step ? `${accentColor}12` : 'var(--ed-cream)', cursor: 'pointer', fontSize: '11px', fontWeight: i === step ? 700 : 400, color: i === step ? accentColor : 'var(--ed-ink3)', fontFamily: 'inherit', transition: 'all 0.15s' }}>
            {i + 1}. {s.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: `${accentColor}14`, border: `1.5px solid ${accentColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{steps[step].icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", marginBottom: '8px' }}>{steps[step].label}</div>
              <div style={{ fontSize: '14px', color: 'var(--ed-ink2)', lineHeight: 1.7, marginBottom: '10px' }}>{steps[step].desc}</div>
              <div style={{ padding: '10px 14px', borderRadius: '6px', background: `${accentColor}08`, border: `1px solid ${accentColor}20`, fontSize: '12px', color: accentColor, fontFamily: "'JetBrains Mono', monospace" }}>{steps[step].detail}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--ed-rule)' }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{ padding: '6px 16px', borderRadius: '6px', border: '1px solid var(--ed-rule)', background: 'var(--ed-cream)', cursor: step === 0 ? 'not-allowed' : 'pointer', opacity: step === 0 ? 0.4 : 1, fontSize: '12px', color: 'var(--ed-ink3)', fontFamily: 'inherit' }}>← Previous</button>
        <span style={{ fontSize: '11px', color: 'var(--ed-ink3)', alignSelf: 'center' }}>{step + 1} / {steps.length}</span>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} style={{ padding: '6px 16px', borderRadius: '6px', border: '1px solid var(--ed-rule)', background: 'var(--ed-cream)', cursor: step === steps.length - 1 ? 'not-allowed' : 'pointer', opacity: step === steps.length - 1 ? 0.4 : 1, fontSize: '12px', color: 'var(--ed-ink3)', fontFamily: 'inherit' }}>Next →</button>
      </div>
    </div>
  );
};

// ─── Interactive: Environment Mistake Spotter (Section 02) ────────────────

const EnvMistakes = ({ track, accentColor }: { track: SWETrack; accentColor: string }) => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const items = track === 'python' ? [
    { mistake: 'You install a library with pip install flask, then run the project and get ModuleNotFoundError.', diagnosis: 'You installed flask globally or into the wrong venv. Always check: is the right virtual environment active? Run pip list to see what is installed where.', bad: true },
    { mistake: 'You commit node_modules/ to git because removing it breaks your imports.', diagnosis: 'Wrong tool, right instinct. In Python, you commit requirements.txt — not the packages. Anyone cloning your repo runs pip install -r requirements.txt to restore them.', bad: true },
    { mistake: 'You create a new venv for each project and freeze requirements.txt before sharing.', diagnosis: 'Correct. This is the professional Python workflow. Each project has its own isolated environment, and requirements.txt reproducibly captures exactly what is needed.', bad: false },
  ] : track === 'java' ? [
    { mistake: 'You clone a project and run mvn compile. It fails with "could not find dependency". You manually download the JAR from Maven Central.', diagnosis: 'Never manually manage JARs. Maven downloads all dependencies declared in pom.xml automatically when you run mvn compile or mvn install. Trust the build tool.', bad: true },
    { mistake: 'You install JDK 21 on your machine. Your team member uses JDK 17. The code works for you but fails for them with "incompatible class version error".', diagnosis: 'JDK version mismatches cause subtle bugs. Set the java.version in pom.xml and document the minimum JDK requirement in the README. Your CI should match production.', bad: true },
    { mistake: 'You use Maven wrapper (mvnw) checked into the repo so all team members use the same Maven version automatically.', diagnosis: 'Correct. mvnw guarantees everyone uses the same Maven version regardless of their local installation. This is standard practice in professional Java projects.', bad: false },
  ] : [
    { mistake: 'You clone a project and run node app.js. It crashes with "Cannot find module express". You copy node_modules/ from a similar project.', diagnosis: 'Never copy node_modules across projects. Run npm install instead — it reads package.json and downloads exactly the right versions for this project.', bad: true },
    { mistake: 'You run npm install --force to resolve a peer dependency warning and commit the result.', diagnosis: 'Force-installing bypasses version checks and can introduce incompatibilities. Investigate the warning first — it usually means two packages expect different versions of a shared dependency.', bad: true },
    { mistake: 'You use package-lock.json committed to git so the exact dependency tree is reproducible across all machines.', diagnosis: 'Correct. package-lock.json locks every dependency to a specific version. With it, npm ci installs the exact same tree everywhere — your machine, CI, and production.', bad: false },
  ];

  return (
    <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', padding: '20px 22px', margin: '28px 0' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: accentColor, marginBottom: '6px' }}>INTERACTIVE · ENVIRONMENT DIAGNOSIS</div>
      <div style={{ fontSize: '13px', color: 'var(--ed-ink3)', marginBottom: '16px' }}>Three scenarios. Is each one a mistake or correct practice? Click to find out.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, i) => (
          <motion.button key={i} whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
            style={{ textAlign: 'left' as const, padding: '14px 18px', borderRadius: '10px', border: `1.5px solid ${revealed[i] ? (item.bad ? '#DC2626' : '#16A34A') : 'var(--ed-rule)'}`, background: revealed[i] ? (item.bad ? 'rgba(220,38,38,0.05)' : 'rgba(22,163,74,0.05)') : 'var(--ed-cream)', cursor: 'pointer', transition: 'all 0.18s', fontFamily: 'inherit' }}>
            <div style={{ fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.6, marginBottom: revealed[i] ? '10px' : '0' }}>{item.mistake}</div>
            <AnimatePresence>
              {revealed[i] && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', color: item.bad ? '#DC2626' : '#16A34A' }}>{item.bad ? '✗ MISTAKE' : '✓ CORRECT'}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', lineHeight: 1.7 }}>{item.diagnosis}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ─── Interactive: Library Matcher (Section 03) ────────────────────────────

const LibraryMatcher = ({ track, accentColor }: { track: SWETrack; accentColor: string }) => {
  const [chosen, setChosen] = useState<Record<number, number>>({});
  const items = track === 'python' ? [
    { task: 'Build a REST API with automatic docs', options: ['pandas', 'FastAPI', 'pytest', 'NumPy'], correct: 1, explanation: 'FastAPI is the modern Python choice for REST APIs — it uses type hints to generate automatic OpenAPI docs, handles validation, and is async-ready.' },
    { task: 'Analyse a CSV with millions of rows', options: ['Flask', 'requests', 'pandas', 'SQLAlchemy'], correct: 2, explanation: 'pandas is the standard for tabular data analysis in Python. For very large datasets, Polars is faster — but pandas is what you learn first.' },
    { task: 'Write automated unit tests', options: ['schedule', 'pytest', 'click', 'httpx'], correct: 1, explanation: 'pytest is the Python testing standard. It has a clean syntax, great fixtures, and a huge plugin ecosystem. Write tests from day one.' },
  ] : track === 'java' ? [
    { task: 'Build a production REST API with DI and security', options: ['JDBC', 'Spring Boot', 'JUnit 5', 'Lombok'], correct: 1, explanation: 'Spring Boot is the industry standard for Java web APIs. It auto-configures dependency injection, web server, and security so you write business logic, not boilerplate.' },
    { task: 'Map Java classes to database tables', options: ['Maven', 'Mockito', 'Hibernate JPA', 'Guava'], correct: 2, explanation: 'Hibernate (via Spring Data JPA) maps Java objects to database rows. You define @Entity classes and relationships; Hibernate handles SQL generation.' },
    { task: 'Write unit tests with mocked dependencies', options: ['TestContainers', 'Mockito', 'SLF4J', 'Flyway'], correct: 1, explanation: 'Mockito lets you replace real dependencies (databases, HTTP clients) with fakes in unit tests. TestContainers is for integration tests with real databases in Docker.' },
  ] : [
    { task: 'Build a minimal, flexible HTTP server', options: ['Socket.io', 'NestJS', 'Express', 'Prisma'], correct: 2, explanation: 'Express is the foundational Node.js web framework. Minimal, unopinionated, and used by millions of APIs. Learn it before moving to more opinionated alternatives.' },
    { task: 'Add real-time bidirectional communication', options: ['Express', 'Socket.io', 'Prisma', 'Jest'], correct: 1, explanation: 'Socket.io adds WebSocket support over Node.js. It is the standard for real-time features — chat, live updates, collaborative editing.' },
    { task: 'Query a database with type-safe models', options: ['axios', 'dotenv', 'Prisma', 'bcrypt'], correct: 2, explanation: 'Prisma is the modern TypeScript-first ORM for Node.js. It generates a type-safe client from your schema, making database queries safe and autocomplete-friendly.' },
  ];

  return (
    <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', padding: '20px 22px', margin: '28px 0' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: accentColor, marginBottom: '6px' }}>INTERACTIVE · PICK THE RIGHT LIBRARY</div>
      <div style={{ fontSize: '13px', color: 'var(--ed-ink3)', marginBottom: '16px' }}>For each task, choose the library that fits best.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {items.map((item, qi) => (
          <div key={qi} style={{ padding: '16px', borderRadius: '10px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ed-ink)', marginBottom: '12px', lineHeight: 1.5 }}>Task: {item.task}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {item.options.map((opt, oi) => {
                const picked = chosen[qi] === oi;
                const correct = oi === item.correct;
                const revealed = qi in chosen;
                return (
                  <motion.button key={oi} whileHover={!revealed ? { y: -1 } : {}} whileTap={!revealed ? { scale: 0.98 } : {}}
                    onClick={() => !revealed && setChosen(c => ({ ...c, [qi]: oi }))}
                    style={{ padding: '10px 14px', borderRadius: '8px', border: `1.5px solid ${revealed ? (correct ? '#16A34A' : picked ? '#DC2626' : 'var(--ed-rule)') : 'var(--ed-rule)'}`, background: revealed ? (correct ? 'rgba(22,163,74,0.08)' : picked ? 'rgba(220,38,38,0.06)' : 'var(--ed-card)') : 'var(--ed-card)', cursor: revealed ? 'default' : 'pointer', textAlign: 'left' as const, transition: 'all 0.15s', fontFamily: 'inherit' }}>
                    <div style={{ fontSize: '12px', fontWeight: correct && revealed ? 700 : 400, color: revealed ? (correct ? '#16A34A' : picked ? '#DC2626' : 'var(--ed-ink3)') : 'var(--ed-ink2)' }}>
                      {revealed && correct ? '✓ ' : revealed && picked && !correct ? '✗ ' : ''}{opt}
                    </div>
                  </motion.button>
                );
              })}
            </div>
            {qi in chosen && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '6px', background: `${accentColor}08`, border: `1px solid ${accentColor}20`, fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
                {item.explanation}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Interactive: Traceback Reader (Section 04) ──────────────────────────

const TracebackReader = ({ track, accentColor }: { track: SWETrack; accentColor: string }) => {
  const [step, setStep] = useState(0);
  const content = track === 'python' ? {
    error: `Traceback (most recent call last):
  File "pipeline.py", line 34, in run_pipeline
    result = process_batch(data)
  File "pipeline.py", line 18, in process_batch
    return [transform(row) for row in rows]
  File "pipeline.py", line 18, in <listcomp>
    return [transform(row) for row in rows]
  File "pipeline.py", line 9, in transform
    return row['value'] * multiplier
KeyError: 'value'`,
    steps: [
      { label: 'Find the error type', highlight: 'KeyError', explanation: 'Start at the bottom. KeyError means you accessed a dictionary key that does not exist. The key is \'value\'. Not a typo error, not a network error — a missing key.' },
      { label: 'Find the error location', highlight: 'pipeline.py", line 9', explanation: 'Line 9 in pipeline.py is where the problem is. Your code. Not a library. The transform function tried to access row[\'value\'] on a row that didn\'t have that key.' },
      { label: 'Read the call chain', highlight: 'run_pipeline → process_batch → transform', explanation: 'The traceback reads bottom-up. run_pipeline called process_batch, which called transform — which crashed. The root cause is in transform, not in the callers.' },
      { label: 'Form a hypothesis', highlight: '', explanation: 'Some rows in data don\'t have a \'value\' key. Maybe the data source changed schema. Maybe an API returned a different field name. Fix: add a guard — row.get(\'value\', 0) — or validate the schema at ingestion.' },
    ],
  } : track === 'java' ? {
    error: `Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.length()" because "this.userName" is null
	at com.finova.UserService.validateUser(UserService.java:42)
	at com.finova.AuthController.login(AuthController.java:28)
	at com.finova.Application.main(Application.java:15)`,
    steps: [
      { label: 'Find the exception type', highlight: 'NullPointerException', explanation: 'NullPointerException means you called a method on a null reference. The message is unusually specific in Java 14+: "Cannot invoke String.length() because this.userName is null". Read it carefully — it tells you exactly what was null.' },
      { label: 'Find your code in the trace', highlight: 'UserService.java:42', explanation: 'Ignore lines starting with at com.sun.*, at java.*, at org.springframework.*. Those are library code. The first line pointing to YOUR package — com.finova — is where the bug lives. Line 42 of UserService.java.' },
      { label: 'Trace the call chain', highlight: 'main → login → validateUser', explanation: 'Application.main called AuthController.login, which called UserService.validateUser at line 42. The null value was probably passed in from the login call — check what AuthController passes to validateUser.' },
      { label: 'Form a hypothesis', highlight: '', explanation: 'userName is null when validateUser is called. Either the login request had a null username field, or the User object was constructed without setting userName. Add a null check or use @NotNull validation at the API boundary.' },
    ],
  } : {
    error: `TypeError: Cannot read properties of undefined (reading 'email')
    at formatUser (/app/utils/formatUser.js:12:28)
    at /app/routes/users.js:34:22
    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
    at next (/app/node_modules/express/lib/router/route.js:149:13)`,
    steps: [
      { label: 'Find the error type', highlight: 'TypeError: Cannot read properties of undefined', explanation: 'TypeError with "Cannot read properties of undefined" means you tried to access .email on something that is undefined. Not null — undefined. The property or variable was never set.' },
      { label: 'Find your code in the trace', highlight: 'formatUser.js:12', explanation: 'Skip node_modules lines — those are Express internals. The first line pointing to /app/ is yours. Line 12 of utils/formatUser.js — that is where the crash happened. The .email access.' },
      { label: 'Trace the call chain', highlight: 'routes/users.js:34 → formatUser', explanation: 'routes/users.js at line 34 called formatUser, passing something that turned out to be undefined. Check what data routes/users.js pulls from the request or database before calling formatUser.' },
      { label: 'Form a hypothesis', highlight: '', explanation: 'A user object that was expected to exist came back as undefined. Likely: a database query returned undefined for a user that doesn\'t exist, or the request body was missing a field. Add a guard: if (!user) return res.status(404).json({ error: \'User not found\' }).' },
    ],
  };

  return (
    <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', padding: '20px 22px', margin: '28px 0' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: accentColor, marginBottom: '6px' }}>INTERACTIVE · READ THIS ERROR</div>
      <div style={{ fontSize: '13px', color: 'var(--ed-ink3)', marginBottom: '16px' }}>A real error from a real codebase. Walk through reading it like a senior engineer would.</div>
      <div style={{ padding: '14px 16px', borderRadius: '8px', background: '#1C1814', border: '1px solid #332D24', marginBottom: '20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#EDE5D5', lineHeight: 1.7, whiteSpace: 'pre-wrap' as const, overflow: 'auto' }}>
        {content.error}
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' as const }}>
        {content.steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            style={{ padding: '5px 12px', borderRadius: '20px', border: `1.5px solid ${i === step ? accentColor : i < step ? `${accentColor}60` : 'var(--ed-rule)'}`, background: i === step ? `${accentColor}12` : i < step ? `${accentColor}06` : 'var(--ed-cream)', cursor: 'pointer', fontSize: '11px', fontWeight: i === step ? 700 : 400, color: i === step ? accentColor : i < step ? accentColor : 'var(--ed-ink3)', fontFamily: 'inherit', transition: 'all 0.15s' }}>
            {i < step ? '✓' : i + 1}. {s.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
          <div style={{ padding: '14px 18px', borderRadius: '8px', background: `${accentColor}08`, border: `1px solid ${accentColor}20` }}>
            {content.steps[step].highlight && (
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: accentColor, fontWeight: 700, marginBottom: '8px', padding: '4px 10px', background: `${accentColor}14`, borderRadius: '4px', display: 'inline-block' }}>{content.steps[step].highlight}</div>
            )}
            <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75 }}>{content.steps[step].explanation}</div>
          </div>
        </motion.div>
      </AnimatePresence>
      {step < content.steps.length - 1 && (
        <div style={{ textAlign: 'right' as const, marginTop: '12px' }}>
          <button onClick={() => setStep(s => s + 1)} style={{ padding: '8px 20px', borderRadius: '6px', background: accentColor, color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit' }}>Next step →</button>
        </div>
      )}
    </div>
  );
};

// ─── Interactive: LiveCodeSandbox — Write It Yourself (Section 01) ────────────

const LiveCodeSandbox = ({ track, accentColor }: { track: SWETrack; accentColor: string }) => {
  const [b1, setB1] = useState('');
  const [b2, setB2] = useState('');
  const [output, setOutput] = useState<string | null>(null);

  const data = track === 'python' ? {
    title: 'Filter a CSV dataset',
    intro: "Aisha's first real task. Two lines are missing — fill them in, then run.",
    lines: [
      'import csv, io',
      '',
      'records = """id,name,status',
      '1,Alice,active  2,Bob,inactive',
      '3,Charlie,active  4,David,active',
      '5,Eve,pending"""',
      '',
      'def count_active(csv_data):',
      '    count = 0',
      '    for row in csv.DictReader(io.StringIO(csv_data)):',
      "        if [BLANK_1]:          ← fill in",
      '            count += 1',
      '    return count',
      '',
      'total = count_active(records)',
      '[BLANK_2]                     ← fill in',
    ],
    blanks: [
      { label: "Blank 1 — the filter condition (line 11)", placeholder: "row['status'] == 'active'", solutions: ["row['status'] == 'active'", "row[\"status\"] == \"active\"", "row['status']=='active'"], hint: "Access the 'status' key of each row dict and compare to 'active'" },
      { label: 'Blank 2 — the print statement (line 16)', placeholder: "print(f'Found {total} active records.')", solutions: ["print(f'Found {total} active records.')", 'print(f"Found {total} active records.")', 'print(total)'], hint: 'Use print() with an f-string to embed the count' },
    ],
    correct: '$ python pipeline.py\n> Found 3 active records.',
    wrong: "$ python pipeline.py\n> SyntaxError or NameError\n  Hint: strings need quotes, dict access uses row['key']",
  } : track === 'java' ? {
    title: 'Filter a list with streams',
    intro: "Vikram's first Java task. Complete the stream pipeline and the print statement.",
    lines: [
      'import java.util.Arrays;',
      'import java.util.List;',
      '',
      'public class Main {',
      '  public static void main(String[] args) {',
      '    List<Integer> nums = Arrays.asList(10, -5, 20, -15, 30, -3);',
      '    int sum = nums.stream()',
      '               .[BLANK_1]        ← fill in',
      '               .mapToInt(Integer::intValue).sum();',
      '    [BLANK_2]                    ← fill in',
      '  }',
      '}',
    ],
    blanks: [
      { label: 'Blank 1 — stream filter expression (line 8)', placeholder: 'filter(n -> n >= 0)', solutions: ['filter(n -> n >= 0)', 'filter(n->n>=0)', 'filter(n -> n > -1)'], hint: 'Use filter() with a lambda: n -> condition' },
      { label: 'Blank 2 — print the sum (line 10)', placeholder: 'System.out.println("Sum: " + sum);', solutions: ['System.out.println("Sum: " + sum);', 'System.out.println(sum);'], hint: 'Java uses System.out.println() for console output' },
    ],
    correct: '> javac Main.java\n> java Main\nSum: 60',
    wrong: '> javac Main.java\nMain.java:8: error: cannot find symbol\n  Check your method name — streams use filter(n -> condition)',
  } : {
    title: 'Validate a POST request',
    intro: "Leo's first Express task. Add the validation check and the success response.",
    lines: [
      "const express = require('express');",
      'const app = express();',
      'app.use(express.json());',
      '',
      "app.post('/register', (req, res) => {",
      '  const { name, email } = req.body;',
      '',
      '  if ([BLANK_1]) {           ← validation',
      "    return res.status(400).json({ error: 'Missing fields' });",
      '  }',
      '',
      '  const id = Date.now().toString(36);',
      '  [BLANK_2]                  ← success response',
      '});',
    ],
    blanks: [
      { label: 'Blank 1 — the validation condition (line 8)', placeholder: '!name || !email', solutions: ['!name || !email', '!name || !email ', '!req.body.name || !req.body.email'], hint: 'Check if name OR email is falsy — use ! and ||' },
      { label: 'Blank 2 — success response (line 13)', placeholder: 'res.status(201).json({ success: true, id });', solutions: ['res.status(201).json({ success: true, id });', 'res.json({ success: true, id })', 'res.status(201).json({ success: true, id: id });'], hint: 'Use res.status(201).json() to send a 201 Created response' },
    ],
    correct: '$ node app.js\n> POST /register\n< 201 { success: true, id: "lk3m2n" }',
    wrong: "$ node app.js\n> SyntaxError or ReferenceError\n  Check: !name || !email for condition, res.status(201).json({...}) for response",
  };

  const checkAnswers = () => {
    const norm = (s: string) => s.trim().replace(/\s+/g, ' ');
    const ok1 = data.blanks[0].solutions.some(s => norm(b1) === norm(s));
    const ok2 = data.blanks[1].solutions.some(s => norm(b2) === norm(s));
    setOutput((ok1 && ok2) ? data.correct : data.wrong);
  };

  const isCorrect = output === data.correct;

  return (
    <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', padding: '20px 22px', margin: '28px 0' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: accentColor, marginBottom: '4px' }}>INTERACTIVE · WRITE IT YOURSELF</div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ed-ink)', marginBottom: '4px' }}>{data.title}</div>
      <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginBottom: '16px' }}>{data.intro}</div>
      <div style={{ padding: '14px 16px', borderRadius: '8px', background: '#1C1814', border: '1px solid #332D24', marginBottom: '16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', lineHeight: 1.75 }}>
        {data.lines.map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: '14px' }}>
            <span style={{ color: '#554D40', minWidth: '18px', textAlign: 'right' as const, userSelect: 'none' as const, fontSize: '9px' }}>{i + 1}</span>
            <span style={{ color: line.includes('[BLANK') ? accentColor : '#EDE5D5' }}>{line.replace('[BLANK_1]', '___').replace('[BLANK_2]', '___') || ' '}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '16px' }}>
        {data.blanks.map((blank, i) => (
          <div key={i}>
            <div style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', marginBottom: '4px' }}>{blank.label}</div>
            <input value={i === 0 ? b1 : b2} onChange={e => i === 0 ? setB1(e.target.value) : setB2(e.target.value)}
              placeholder={blank.placeholder}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--ed-rule)', background: 'var(--ed-cream)', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'var(--ed-ink)', outline: 'none', boxSizing: 'border-box' as const }} />
            {output && !isCorrect && <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', marginTop: '4px', fontStyle: 'italic' as const }}>Hint: {blank.hint}</div>}
          </div>
        ))}
      </div>
      <button onClick={checkAnswers} style={{ padding: '9px 24px', borderRadius: '7px', background: accentColor, color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, fontFamily: 'inherit', marginBottom: output ? '16px' : '0' }}>
        ▶ Run
      </button>
      <AnimatePresence mode="wait">
        {output && (
          <motion.div key={output} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ padding: '14px 16px', borderRadius: '8px', background: '#1C1814', border: `1px solid ${isCorrect ? '#16A34A' : '#DC2626'}40`, fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: isCorrect ? '#86EFAC' : '#FCA5A5', lineHeight: 1.7, whiteSpace: 'pre' as const }}>
              {output}
            </div>
            {isCorrect && <div style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '6px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', fontSize: '12px', color: '#16A34A', fontWeight: 600 }}>✓ Correct — you just wrote real production-quality logic.</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Interactive: BugHunter — Click the Buggy Line (Section 04) ───────────────

const BugHunter = ({ track, accentColor }: { track: SWETrack; accentColor: string }) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [clickedLine, setClickedLine] = useState<number | null>(null);
  const [wrongLine, setWrongLine] = useState<number | null>(null);
  const [shake, setShake] = useState(false);

  const allBugs: Record<SWETrack, Record<'easy' | 'medium' | 'hard', { lines: string[]; bugLine: number; explanation: string; fix: string; hint: string }>> = {
    python: {
      easy: {
        lines: ['def process_data():', "    user_ids = (101, 102, 103)", '    print(f"Initial: {user_ids}")', '    new_id = 104', '    # Add the new ID to the list', '    user_ids.append(new_id)', '    return user_ids', '', 'result = process_data()', 'print(result)'],
        bugLine: 6,
        explanation: "Tuples are immutable — they have no append() method. The parentheses on line 2 create a tuple, not a list. You can't modify a tuple after creation.",
        fix: 'user_ids = [101, 102, 103]  # Square brackets make a list',
        hint: 'Look at what type user_ids is on line 2. Can that type be modified?',
      },
      medium: {
        lines: ['def print_pairs(users):', '    print("Consecutive pairs:")', '    for i in range(len(users)):', '        current = users[i]', '        next_user = users[i + 1]', '        print(f"  {current} + {next_user}")', '', 'team = ["Alice", "Bob", "Charlie"]', 'print_pairs(team)'],
        bugLine: 5,
        explanation: "When i reaches the last index, users[i+1] is out of bounds. range(len(users)) goes up to and including the last index, but there's no element after it.",
        fix: 'for i in range(len(users) - 1):  # Stop one index short',
        hint: 'Trace the last iteration. What is i when users[i+1] is accessed?',
      },
      hard: {
        lines: ['def count_items(items):', '    counts = {}', '    for item in items:', '        counts[item] += 1', '    return counts', '', 'data = ["apple", "banana", "apple"]', 'print(count_items(data))'],
        bugLine: 4,
        explanation: "The first time an item is seen, counts[item] raises KeyError because the key doesn't exist yet — you can't add 1 to a value that isn't there.",
        fix: 'counts[item] = counts.get(item, 0) + 1',
        hint: "What happens the very first time a new item appears? Does it have a starting value in counts?",
      },
    },
    java: {
      easy: {
        lines: ['public class StatusCheck {', '  public static void main(String[] args) {', '    String status = "active";', '    String target = "active";', '    // Check if status matches', '    if (status == target) {', '      System.out.println("Approved");', '    } else {', '      System.out.println("Denied");', '    }', '  }', '}'],
        bugLine: 6,
        explanation: '== in Java compares object references, not string content. Two String variables can have identical text but reference different objects, making == return false unexpectedly.',
        fix: 'if (status.equals(target)) {  // .equals() compares content',
        hint: 'How do you compare the actual content of two String objects in Java?',
      },
      medium: {
        lines: ['class User {', '    String name;', '    User(String n) { this.name = n; }', '}', 'public class Processor {', '  public static void main(String[] args) {', '    User active = new User("Alice");', '    User deleted = null;', '    int len = deleted.name.length();', '    System.out.println(len);', '  }', '}'],
        bugLine: 9,
        explanation: 'deleted is null — calling .name on null throws a NullPointerException. The JVM cannot access any field or method on a null reference.',
        fix: 'int len = (deleted != null) ? deleted.name.length() : 0;',
        hint: 'What is the value of deleted when .name is accessed?',
      },
      hard: {
        lines: ['public class FinancialCalc {', '  public static void main(String[] args) {', '    int txCents   = 1_500_000_000;', '    int bonusCents = 1_000_000_000;', '    // Sum should be 2.5 billion', '    int total = txCents + bonusCents;', '    System.out.println("Total: " + total);', '    // Expected: 2500000000', '  }', '}'],
        bugLine: 6,
        explanation: 'int holds a max of ~2.1 billion. 1.5B + 1B = 2.5B overflows silently, wrapping to a negative number. Financial code with large values must use long.',
        fix: 'long total = (long)txCents + bonusCents;',
        hint: 'What is the maximum value int can hold in Java? Does this sum exceed it?',
      },
    },
    nodejs: {
      easy: {
        lines: ['// data.json contains: {"users": []}', "const data = require('./data.json');", '', 'function addUser(user) {', '  console.log("Before:", JSON.stringify(data));', '  data.push(user);', '  console.log("After:", JSON.stringify(data));', '}', '', 'addUser({ id: 1, name: "Alice" });'],
        bugLine: 6,
        explanation: "data is a plain object { users: [] }, not an array. Objects don't have a push() method — that's an Array method. This throws TypeError: data.push is not a function.",
        fix: 'data.users.push(user);  // push onto the array inside the object',
        hint: 'What does data.json return? Is data an array or an object containing an array?',
      },
      medium: {
        lines: ["const db = require('./db');", '', 'async function getUser(req, res) {', '  const { id } = req.params;', '  const user = db.findUser(id);', '  if (!user) {', '    return res.status(404).json({ error: "Not found" });', '  }', '  res.json({ name: user.name, email: user.email });', '}', '', 'module.exports = { getUser };'],
        bugLine: 5,
        explanation: 'db.findUser() is async and returns a Promise. Without await, user is a Promise object — always truthy, so the not-found check never fires and user.name crashes.',
        fix: 'const user = await db.findUser(id);  // await the Promise',
        hint: 'db.findUser() is an async function. What does it return without await?',
      },
      hard: {
        lines: ["app.get('/users', async (req, res) => {", '  try {', '    const users = await db.getAll();', '    res.json(users);', '    res.status(200);', '  } catch (err) {', '    res.status(500).json({ error: err.message });', '  }', '});'],
        bugLine: 5,
        explanation: "res.json() sends the response and closes the connection. Calling res.status() after the response is already sent throws: 'Cannot set headers after they are sent to the client'.",
        fix: 'res.status(200).json(users);  // chain status before json()',
        hint: 'When does res.json() actually send the HTTP response? What happens if you touch res after that?',
      },
    },
  };

  const bug = allBugs[track][difficulty];

  const handleClick = (lineNum: number) => {
    if (clickedLine !== null || !bug.lines[lineNum - 1].trim()) return;
    if (lineNum === bug.bugLine) {
      setClickedLine(lineNum); setWrongLine(null);
    } else {
      setWrongLine(lineNum); setShake(true); setTimeout(() => setShake(false), 380);
    }
  };

  const solved = clickedLine === bug.bugLine;

  return (
    <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', padding: '20px 22px', margin: '28px 0' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: accentColor, marginBottom: '6px' }}>INTERACTIVE · BUG HUNTER</div>
      <div style={{ fontSize: '13px', color: 'var(--ed-ink3)', marginBottom: '16px' }}>Find the bug. Click the exact line that contains the error.</div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {(['easy', 'medium', 'hard'] as const).map(d => (
          <button key={d} onClick={() => { setDifficulty(d); setClickedLine(null); setWrongLine(null); }}
            style={{ padding: '5px 14px', borderRadius: '20px', border: `1.5px solid ${d === difficulty ? accentColor : 'var(--ed-rule)'}`, background: d === difficulty ? `${accentColor}12` : 'var(--ed-cream)', cursor: 'pointer', fontSize: '11px', fontWeight: d === difficulty ? 700 : 400, color: d === difficulty ? accentColor : 'var(--ed-ink3)', fontFamily: 'inherit', textTransform: 'capitalize' as const }}>
            {d === 'easy' ? '🟢' : d === 'medium' ? '🟡' : '🔴'} {d}
          </button>
        ))}
      </div>
      <motion.div animate={shake ? { x: [-4, 4, -3, 3, 0] } : {}} transition={{ duration: 0.35 }}>
        <div style={{ borderRadius: '8px', background: '#1C1814', border: '1px solid #332D24', overflow: 'hidden', marginBottom: '12px' }}>
          {bug.lines.map((line, i) => {
            const ln = i + 1;
            const isClicked = clickedLine === ln;
            const isWrong = wrongLine === ln;
            const isEmpty = !line.trim();
            return (
              <div key={`${difficulty}-${i}`} onClick={() => !isEmpty && !solved && handleClick(ln)}
                style={{ display: 'flex', gap: '14px', padding: '2px 14px', cursor: isEmpty || solved ? 'default' : 'pointer', background: isClicked ? 'rgba(234,179,8,0.15)' : isWrong ? 'rgba(220,38,38,0.10)' : 'transparent', borderLeft: isClicked ? '3px solid #EAB308' : isWrong ? '3px solid #DC2626' : '3px solid transparent', transition: 'background 0.12s' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#554D40', minWidth: '18px', textAlign: 'right' as const, userSelect: 'none' as const, paddingTop: '2px' }}>{ln}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: isClicked ? '#EAB308' : isWrong ? '#FCA5A5' : '#EDE5D5', lineHeight: 1.7, flex: 1 }}>{line || ' '}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
      <AnimatePresence>
        {solved && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ padding: '14px 18px', borderRadius: '8px', background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)', marginBottom: '10px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: '#CA8A04', marginBottom: '8px' }}>✓ LINE {bug.bugLine} — BUG FOUND</div>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.75, marginBottom: '10px' }}>{bug.explanation}</div>
              <div style={{ padding: '8px 12px', borderRadius: '6px', background: '#1C1814', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#86EFAC' }}>Fix: {bug.fix}</div>
            </div>
          </motion.div>
        )}
        {wrongLine !== null && !solved && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ padding: '10px 14px', borderRadius: '6px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.18)', fontSize: '12px', color: 'var(--ed-ink3)', fontStyle: 'italic' as const }}>
              Not that line. Hint: {bug.hint}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Interactive: CodeAnatomy — Click Any Part (Section 03) ──────────────────

const CodeAnatomy = ({ track, accentColor }: { track: SWETrack; accentColor: string }) => {
  const [active, setActive] = useState<number | null>(null);

  const content = track === 'python' ? {
    title: 'Anatomy of a production Python script',
    subtitle: "The kind of file you'll encounter in your first PR review.",
    lines: ['#!/usr/bin/env python3', '"""Pipeline: extract active users from CSV."""', 'import csv, logging, sys', 'from pathlib import Path', '', 'logging.basicConfig(level=logging.INFO)', 'log = logging.getLogger(__name__)', '', 'def load_users(filepath: Path) -> list[dict]:', '    """Load all rows from the CSV."""', '    with open(filepath, newline="") as fh:', '        return list(csv.DictReader(fh))', '', 'def filter_active(users: list[dict]) -> list[dict]:', '    return [u for u in users if u["status"] == "active"]', '', 'if __name__ == "__main__":', '    path = Path(sys.argv[1])', '    users = load_users(path)', '    active = filter_active(users)', '    log.info("Active users: %d", len(active))'],
    hotspots: [
      { lines: [1], label: 'Shebang', explanation: "Tells the OS which interpreter runs this file when executed directly (./script.py). Pins the Python binary so the right version is used on servers.", why: "Without it, you must type python3 explicitly. With it, the file becomes directly executable.", remove: "Still runs with python3 script.py but loses standalone execution capability." },
      { lines: [2], label: 'Module docstring', explanation: "Module-level documentation. IDEs, linters, and pydoc display this. It's the one-line contract for what this file does.", why: "Team members and future you need to understand this module's purpose at a glance.", remove: "Code runs fine, but tooling and teammates lose their first hint about intent." },
      { lines: [6, 7], label: 'Logging setup', explanation: "Configures the logging module at INFO level. log = logging.getLogger(__name__) creates a named logger — log entries show exactly which module they came from.", why: "print() doesn't appear in log aggregators. Structured logging is observable, filterable, and persistent.", remove: "You lose production observability. print() works locally but disappears in cloud log systems." },
      { lines: [11, 12], label: 'Context manager', explanation: "with open(...) as fh: automatically closes the file when the block exits — even if an exception is raised inside.", why: "Prevents file descriptor leaks. Manually calling fh.close() is error-prone; the context manager makes it automatic.", remove: "If an exception occurs inside, the file may stay open until the garbage collector decides to close it." },
      { lines: [15], label: 'List comprehension', explanation: "[u for u in users if condition] filters the list in one readable line. It's idiomatic Python — cleaner and slightly faster than an explicit for-append loop.", why: "Equivalent to a filter loop but more readable. Most Python codebases prefer the comprehension.", remove: "Fine if replaced by a loop, but the comprehension is what reviewers will expect to see." },
      { lines: [17], label: '__main__ guard', explanation: "Prevents this code from running when the file is imported as a module. The block only executes when the script is run directly.", why: "If another module imports load_users(), you don't want the entire pipeline to fire as a side effect.", remove: "The pipeline runs every time this module is imported anywhere — a silent, destructive side effect." },
    ],
  } : track === 'java' ? {
    title: 'Anatomy of a Spring Boot REST controller',
    subtitle: "The pattern you'll write and review hundreds of times in a Java backend.",
    lines: ['package com.finova.users;', '', 'import org.springframework.web.bind.annotation.*;', 'import org.springframework.http.ResponseEntity;', 'import java.util.Optional;', '', '@RestController', '@RequestMapping("/api/users")', 'public class UserController {', '', '    @Autowired', '    private UserService userService;', '', '    @GetMapping("/{id}")', '    public ResponseEntity<User> getUser(@PathVariable Long id) {', '        Optional<User> user = userService.findById(id);', '        return user', '            .map(ResponseEntity::ok)', '            .orElseThrow(() -> new UserNotFoundException(id));', '    }', '}'],
    hotspots: [
      { lines: [1], label: 'Package declaration', explanation: "Declares the namespace this class belongs to. Java uses reverse-domain notation (com.finova.users) to prevent naming collisions across libraries and modules.", why: "Without packages, every class name would need to be globally unique. At scale, that's impossible.", remove: "Unnamed package — compiles for tiny programs, but breaks any multi-module project or framework." },
      { lines: [7, 8], label: '@RestController + @RequestMapping', explanation: "@RestController combines @Controller and @ResponseBody — every method in this class returns JSON directly. @RequestMapping sets /api/users as the URL prefix for all routes here.", why: "Spring reads these annotations at startup to register this class as an HTTP request handler.", remove: "Spring ignores this class entirely — no routes would be registered." },
      { lines: [11, 12], label: '@Autowired', explanation: "Tells Spring to inject a UserService instance. Spring creates the service, manages its lifecycle, and injects it here automatically.", why: "You never call new UserService(). Spring controls the dependency — this is Inversion of Control.", remove: "NullPointerException at runtime — userService is never assigned." },
      { lines: [14, 15], label: '@GetMapping + @PathVariable', explanation: "@GetMapping(\"/{id}\") registers this method for GET /api/users/{id}. @PathVariable binds the {id} URL segment to the id parameter automatically.", why: "This is how Spring maps incoming HTTP requests to specific handler methods.", remove: "GET /api/users/42 returns 404 — the endpoint doesn't exist." },
      { lines: [16], label: 'Optional<User>', explanation: "findById returns Optional<User> — either a user exists or it doesn't. Optional forces you to handle the 'not found' case explicitly rather than returning null.", why: "Returning null and hoping callers check is how NullPointerExceptions happen. Optional makes absence a first-class concern.", remove: "You'd return a nullable User — and NPEs would scatter wherever the result is used." },
      { lines: [17, 18, 19], label: 'map + orElseThrow', explanation: "If the user exists, map() wraps it in a 200 OK ResponseEntity. If absent, orElseThrow() throws an exception that Spring maps to a 404 Not Found response.", why: "Functional chaining is cleaner than if/else null checks and delegates exception translation to the framework.", remove: "You'd need explicit if/else with null checks — more code, same behavior, more error-prone." },
    ],
  } : {
    title: 'Anatomy of a production Express route file',
    subtitle: "The structure you'll see in every Node.js backend codebase.",
    lines: ["const express = require('express');", 'const router = express.Router();', "const { validate } = require('../middleware/validate');", "const db = require('../db');", '', 'const userSchema = {', "    name:  { type: 'string', required: true },", "    email: { type: 'string', required: true },", '};', '', 'router.post("/", validate(userSchema), async (req, res, next) => {', '    try {', '        const user = await db.users.create(req.body);', '        res.status(201).json(user);', '    } catch (err) {', '        next(err);', '    }', '});', '', 'module.exports = router;'],
    hotspots: [
      { lines: [1, 2], label: 'Router setup', explanation: "express.Router() creates a mini Express app — a modular set of routes for one resource. This file handles /users/* without app.js knowing the details.", why: "Keeps each resource's routes in its own file instead of one monolithic app.js.", remove: "You'd attach routes directly to the main app — fine for three routes, unmanageable at thirty." },
      { lines: [3], label: 'Middleware import', explanation: "validate() is a reusable middleware function. It runs before the route handler and rejects invalid requests before they reach the database.", why: "Validation logic shouldn't live inside every handler — extract it once, reuse everywhere consistently.", remove: "Every route would need inline validation — duplicated code with inevitably inconsistent rules." },
      { lines: [6, 7, 8, 9], label: 'Schema definition', explanation: "Defines the shape of a valid request body. The validate middleware checks incoming requests against this schema before the handler runs.", why: "Centralise the definition of valid data. Change validation in one place, not scattered across ten handlers.", remove: "Invalid requests reach your DB call — any shape of garbage body could be persisted." },
      { lines: [11], label: 'Route + middleware chain', explanation: "POST / maps to this handler. validate(userSchema) runs first — if it rejects the request, the async handler never executes.", why: "Middleware chains are how Express composes behaviour: auth → validate → handle. Order matters.", remove: "Unvalidated requests reach the handler — any body shape, including missing required fields, hits the DB." },
      { lines: [12, 15, 16, 17], label: 'try/catch + next(err)', explanation: "Async DB calls can throw. The catch block calls next(err), passing the error to Express's centralized error handler middleware.", why: "Without this, unhandled promise rejections either crash the Node process or silently hang the request.", remove: "An unhandled rejection crashes the process or freezes the connection — no error response sent to the client." },
      { lines: [14], label: 'res.status(201)', explanation: "201 Created is the correct HTTP status for a successful POST that creates a resource. 200 OK means success but doesn't communicate that a new resource was created.", why: "HTTP status codes communicate intent to clients and tools without parsing the response body.", remove: "Sending 200 for creation works but violates REST semantics — API clients following HTTP spec would behave incorrectly." },
      { lines: [20], label: 'module.exports', explanation: "Exports the router for app.js to mount with app.use('/users', userRouter). Without this, nothing outside this file can use the router.", why: "CommonJS module system — the explicit export mechanism for Node.js files.", remove: "The file exists but is invisible to the rest of the app — like defining a function and never calling it." },
    ],
  };

  const hs = active !== null ? content.hotspots[active] : null;

  return (
    <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '12px', padding: '20px 22px', margin: '28px 0' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: accentColor, marginBottom: '4px' }}>INTERACTIVE · CODE ANATOMY</div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ed-ink)', marginBottom: '4px' }}>{content.title}</div>
      <div style={{ fontSize: '12px', color: 'var(--ed-ink3)', marginBottom: '16px' }}>{content.subtitle} Click a numbered marker to understand that part.</div>
      <div style={{ display: 'grid', gridTemplateColumns: hs ? '1fr 1fr' : '1fr', gap: '16px', alignItems: 'start' }}>
        <div style={{ padding: '14px 16px', borderRadius: '8px', background: '#1C1814', border: '1px solid #332D24', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', lineHeight: 1.75 }}>
          {content.lines.map((line, i) => {
            const ln = i + 1;
            const hsIdx = content.hotspots.findIndex(h => h.lines.includes(ln));
            const isHs = hsIdx !== -1;
            const isAct = isHs && active === hsIdx;
            return (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: isAct ? `${accentColor}18` : 'transparent', borderRadius: '3px', paddingRight: '6px' }}>
                <span style={{ color: '#554D40', minWidth: '18px', textAlign: 'right' as const, userSelect: 'none' as const, fontSize: '9px', flexShrink: 0 }}>{ln}</span>
                <span style={{ flex: 1, color: '#EDE5D5' }}>{line || ' '}</span>
                {isHs && (
                  <button onClick={() => setActive(active === hsIdx ? null : hsIdx)}
                    style={{ flexShrink: 0, width: '18px', height: '18px', borderRadius: '50%', background: isAct ? accentColor : `${accentColor}28`, border: `1.5px solid ${accentColor}60`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 800, color: isAct ? '#fff' : accentColor, transition: 'all 0.15s', padding: 0, lineHeight: 1 }}>
                    {hsIdx + 1}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <AnimatePresence>
          {hs && (
            <motion.div key={active} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 14 }} transition={{ duration: 0.2 }} style={{ padding: '16px', borderRadius: '8px', background: `${accentColor}08`, border: `1px solid ${accentColor}20` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: accentColor, marginBottom: '8px', letterSpacing: '0.1em' }}>⬡ {hs.label.toUpperCase()}</div>
              <div style={{ fontSize: '13px', color: 'var(--ed-ink)', lineHeight: 1.75, marginBottom: '10px' }}>{hs.explanation}</div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.65, padding: '8px 12px', background: 'var(--ed-cream)', borderRadius: '6px', marginBottom: '8px' }}><strong style={{ color: 'var(--ed-ink2)' }}>Why it exists: </strong>{hs.why}</div>
              <div style={{ fontSize: '11px', color: 'var(--ed-ink3)', lineHeight: 1.65 }}><strong style={{ color: 'var(--ed-ink2)' }}>If removed: </strong>{hs.remove}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ─── TiltCard Mockups ────────────────────────────────────────────────────────

const TerminalRunCard = ({ track, accentColor }: { track: SWETrack; accentColor: string }) => {
  const lines = track === 'python' ? [
    { t: 'cmd', v: '$ python3 pipeline.py' },
    { t: 'out', v: 'Processing 14,823 records...' },
    { t: 'out', v: 'Validation pass: exit code 0' },
    { t: 'warn', v: '⚠  Client Alpha revenue: $0.00 (unchanged)' },
    { t: 'dim', v: '# ran successfully — but the data is still wrong' },
  ] : track === 'java' ? [
    { t: 'cmd', v: '$ mvn exec:java -Dexec.mainClass=Main' },
    { t: 'info', v: '[INFO] Scanning for projects...' },
    { t: 'info', v: '[INFO] BUILD SUCCESS (local)' },
    { t: 'err',  v: 'Exception in thread "main"' },
    { t: 'err',  v: 'java.lang.ClassNotFoundException: com.finova.CacheHelper' },
    { t: 'stack',v: '\tat java.base/java.lang.Class.forName(Class.java:375)' },
  ] : [
    { t: 'cmd', v: '$ node server.js' },
    { t: 'out', v: 'Starting notification service on :3000' },
    { t: 'err',  v: 'ReferenceError: localStorage is not defined' },
    { t: 'stack',v: '    at setupPersistence (server.js:42:3)' },
    { t: 'stack',v: '    at Object.<anonymous> (server.js:8:1)' },
    { t: 'dim', v: '# localStorage is a browser API — Node has no window' },
  ];
  const col: Record<string, string> = {
    cmd: '#7DD3FC', out: '#BBF7D0', warn: '#FDE68A',
    err: '#FCA5A5', stack: '#D1D5DB', info: '#A5B4FC', dim: '#6B7280',
  };
  return (
    <div style={{ background: '#0D1117', borderRadius: '10px', overflow: 'hidden', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ background: '#161B22', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #30363D' }}>
        {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        <span style={{ marginLeft: 8, fontSize: 10, color: '#8B949E', letterSpacing: '0.1em' }}>TERMINAL — {track === 'python' ? 'python3' : track === 'java' ? 'mvn' : 'node'}</span>
      </div>
      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column' as const, gap: 5 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ fontSize: 11, lineHeight: 1.6, color: col[l.t] ?? '#E6EDF3' }}>{l.v}</div>
        ))}
      </div>
    </div>
  );
};

const DevEnvPanel = ({ track, accentColor }: { track: SWETrack; accentColor: string }) => {
  const files = track === 'python'
    ? ['📁 mosaic_pipeline/', '  📄 pipeline.py', '  📄 requirements.txt', '  📁 .venv/', '  📄 .env']
    : track === 'java'
    ? ['📁 finova-api/', '  📄 pom.xml', '  📁 src/main/java/', '  📁 target/', '  📄 .gitignore']
    : ['📁 launchly-api/', '  📄 package.json', '  📁 node_modules/', '  📄 server.js', '  📄 .env'];
  const cmd = track === 'python' ? 'python -m venv .venv && source .venv/bin/activate'
    : track === 'java' ? 'mvn clean install'
    : 'npm install && node server.js';
  return (
    <div style={{ background: '#1E1E2E', borderRadius: '10px', overflow: 'hidden', fontFamily: "'JetBrains Mono', monospace", display: 'grid', gridTemplateColumns: '38% 62%' }}>
      <div style={{ background: '#13131F', padding: '12px 10px', borderRight: '1px solid #2D2D3F' }}>
        <div style={{ fontSize: 9, color: '#6C6C8A', letterSpacing: '0.12em', marginBottom: 10 }}>EXPLORER</div>
        {files.map((f, i) => (
          <div key={i} style={{ fontSize: 10, color: f.startsWith('  ') ? '#9EA3B0' : accentColor, padding: '2px 0', lineHeight: 1.7 }}>{f}</div>
        ))}
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontSize: 9, color: '#6C6C8A', letterSpacing: '0.12em', marginBottom: 10 }}>TERMINAL</div>
        <div style={{ fontSize: 10, color: '#7DD3FC' }}>$ {cmd}</div>
        <div style={{ marginTop: 8, fontSize: 10, color: '#BBF7D0' }}>✓ Environment ready</div>
        <div style={{ marginTop: 4, fontSize: 10, color: '#8B949E' }}># commit your code, not your environment</div>
      </div>
    </div>
  );
};

const EcosystemCard = ({ track, accentColor }: { track: SWETrack; accentColor: string }) => {
  const pkgs = track === 'python'
    ? [{ n: 'pandas', v: '2.2.1', use: 'data analysis' }, { n: 'fastapi', v: '0.110', use: 'web APIs' }, { n: 'pytest', v: '8.1', use: 'testing' }, { n: 'torch', v: '2.2', use: 'ML / deep learning' }]
    : track === 'java'
    ? [{ n: 'spring-boot', v: '3.2.4', use: 'web + DI framework' }, { n: 'hibernate', v: '6.4', use: 'ORM / database' }, { n: 'junit', v: '5.10', use: 'testing' }, { n: 'jackson', v: '2.17', use: 'JSON serialisation' }]
    : [{ n: 'express', v: '4.19', use: 'web framework' }, { n: 'prisma', v: '5.11', use: 'database ORM' }, { n: 'jest', v: '29.7', use: 'testing' }, { n: 'typescript', v: '5.4', use: 'type safety' }];
  const cmd = track === 'python' ? 'pip install' : track === 'java' ? '<!-- pom.xml -->' : 'npm install';
  return (
    <div style={{ background: '#0D1117', borderRadius: '10px', overflow: 'hidden', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ background: '#161B22', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #30363D' }}>
        <span style={{ fontSize: 10, color: accentColor, fontWeight: 700 }}>{track === 'python' ? 'PyPI' : track === 'java' ? 'Maven Central' : 'npm registry'}</span>
        <span style={{ fontSize: 9, color: '#8B949E' }}>— packages used at {track === 'python' ? 'Mosaic Analytics' : track === 'java' ? 'Finova Systems' : 'Launchly'}</span>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
        {pkgs.map(p => (
          <div key={p.n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: '#161B22', borderRadius: 6, border: '1px solid #21262D' }}>
            <span style={{ fontSize: 11, color: '#58A6FF', fontWeight: 700 }}>{cmd} {p.n}</span>
            <span style={{ fontSize: 9, color: '#8B949E' }}>v{p.v}</span>
            <span style={{ fontSize: 10, color: '#7EE787' }}>{p.use}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StackTraceCard = ({ track, accentColor }: { track: SWETrack; accentColor: string }) => {
  const frames = track === 'python' ? {
    err: 'AttributeError: \'NoneType\' object has no attribute \'upper\'',
    lines: [
      { f: 'pipeline.py', ln: 88, code: 'result = transform(record)', active: false },
      { f: 'transforms.py', ln: 34, code: 'cleaned = raw_value.upper()', active: true },
    ],
    tip: 'raw_value is None — check the data source',
  } : track === 'java' ? {
    err: 'NullPointerException: Cannot invoke "String.length()" because "str" is null',
    lines: [
      { f: 'UserService.java', ln: 112, code: 'processUser(user.getName())', active: false },
      { f: 'Validator.java', ln: 47, code: 'str.length() > 0', active: true },
    ],
    tip: 'Add a null check before calling .length()',
  } : {
    err: 'TypeError: Cannot read properties of undefined (reading \'id\')',
    lines: [
      { f: 'server.js', ln: 67, code: 'handleRequest(req, res)', active: false },
      { f: 'handler.js', ln: 23, code: 'const id = user.id', active: true },
    ],
    tip: 'user is undefined — check the upstream data',
  };
  return (
    <div style={{ background: '#0D1117', borderRadius: '10px', overflow: 'hidden', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ background: '#2D1515', padding: '8px 14px', borderBottom: '1px solid #4D2020', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16 }}>🔴</span>
        <span style={{ fontSize: 10, color: '#FCA5A5', fontWeight: 700 }}>RUNTIME ERROR</span>
      </div>
      <div style={{ padding: '12px 16px' }}>
        <div style={{ fontSize: 11, color: '#FCA5A5', marginBottom: 12, lineHeight: 1.6 }}>{frames.err}</div>
        <div style={{ fontSize: 9, color: '#8B949E', letterSpacing: '0.1em', marginBottom: 8 }}>TRACEBACK (most recent call last)</div>
        {frames.lines.map((l, i) => (
          <div key={i} style={{ padding: '6px 10px', borderRadius: 6, marginBottom: 4, background: l.active ? 'rgba(252,165,165,0.08)' : '#161B22', borderLeft: `3px solid ${l.active ? '#FCA5A5' : '#30363D'}` }}>
            <div style={{ fontSize: 9, color: '#8B949E', marginBottom: 3 }}>{l.f} : line {l.ln}</div>
            <div style={{ fontSize: 11, color: l.active ? '#FDE68A' : '#C9D1D9' }}>{l.code}</div>
          </div>
        ))}
        <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(134,239,172,0.06)', borderRadius: 6, borderLeft: '3px solid #86EFAC', fontSize: 10, color: '#86EFAC' }}>💡 {frames.tip}</div>
      </div>
    </div>
  );
};

// ── SWEConversationScene ─────────────────────────────────────────────────────

type CSLine = { speaker: 'protagonist' | 'mentor'; text: string };
type SWECSData = { mentorName: string; mentorRole: string; mentorColor: string; lines: CSLine[] };

const CS_DIALOGUES: Record<'s01' | 's02' | 's03' | 's04', Record<SWETrack, SWECSData>> = {
  s01: {
    python: {
      mentorName: 'Riya', mentorRole: 'Data Engineering Lead', mentorColor: '#0369A1',
      lines: [
        { speaker: 'protagonist', text: "The pipeline logged SUCCESS but Client Alpha's revenue is still zero. The fix deployed — maybe the dashboard takes time to update?" },
        { speaker: 'mentor', text: "Aisha. Look at this report. Your pipeline ran through. What does 'ran successfully' truly mean here?" },
        { speaker: 'protagonist', text: "Exit code zero. The logs showed nothing wrong. But the data is still bad." },
        { speaker: 'mentor', text: "Exit code zero tells you the process terminated normally. It says nothing about whether the output is correct. Those are different questions." },
      ],
    },
    java: {
      mentorName: 'Kavya', mentorRole: 'Senior Backend Engineer', mentorColor: '#7C3AED',
      lines: [
        { speaker: 'protagonist', text: "My code compiles, tests pass, endpoint returns 200 in my IDE. CI fails with ClassNotFoundException for a dependency that's right there in pom.xml." },
        { speaker: 'mentor', text: "Vikram. Describe the precise difference in how your code executes in your IDE versus the CI environment." },
        { speaker: 'protagonist', text: "I'm not sure. My IDE just runs it. CI must be setting up classpath differently somehow." },
        { speaker: 'mentor', text: "Your IDE auto-manages the classpath, often including transitive dependencies. CI builds from a clean slate using only what's explicitly declared. That's not the same thing." },
      ],
    },
    nodejs: {
      mentorName: 'Jordan', mentorRole: 'Frontend Engineer', mentorColor: '#65A30D',
      lines: [
        { speaker: 'protagonist', text: "The notification service crashed immediately: ReferenceError: localStorage is not defined. I've used localStorage dozens of times in frontend work." },
        { speaker: 'mentor', text: "That's weird. Node is basically the same as browser JS. Probably needs a polyfill or something." },
        { speaker: 'protagonist', text: "A polyfill... but localStorage is a browser API, not a missing language feature. If Node is the same as browser JS, why doesn't it have it?" },
        { speaker: 'mentor', text: "Just install a localStorage npm package. I've seen that fix it. Probably a missing dependency." },
      ],
    },
  },
  s02: {
    python: {
      mentorName: 'Dev', mentorRole: 'Senior Data Scientist', mentorColor: '#D97706',
      lines: [
        { speaker: 'protagonist', text: "Sam gets ModuleNotFoundError for fast_csv_parser on his machine. It works fine on mine — I installed it myself." },
        { speaker: 'mentor', text: "Aisha, this is why we need to move everything to Kubernetes containers. Your local setup is just a mess. Probably some ancient library version conflict." },
        { speaker: 'protagonist', text: "Containerization feels like a sledgehammer for this. What's actually different between my machine and Sam's right now?" },
        { speaker: 'mentor', text: "It's probably a system-level conflict. Containerization just makes this whole class of problem disappear. We should just do it." },
      ],
    },
    java: {
      mentorName: 'Suresh', mentorRole: 'Principal Architect', mentorColor: '#2563EB',
      lines: [
        { speaker: 'protagonist', text: "I copied a dependency block from the Maven docs into pom.xml. Now mvn install fails with transitive dependency conflicts." },
        { speaker: 'mentor', text: "Before you touch another dependency — explain to me what Maven lifecycle phases are." },
        { speaker: 'protagonist', text: "I don't know what those are. I just need to add one library. Why does one line in pom.xml cause all this?" },
        { speaker: 'mentor', text: "Because pom.xml is a contract. You declared a dependency without understanding what it pulls in. Maven resolved the conflict — but not in your favour." },
      ],
    },
    nodejs: {
      mentorName: 'Carlos', mentorRole: 'DevOps Engineer', mentorColor: '#B45309',
      lines: [
        { speaker: 'protagonist', text: "MODULE_NOT_FOUND: Cannot find module lodash inside Docker. But it's definitely installed — I can see it in node_modules right now." },
        { speaker: 'mentor', text: "Leo. Did you forget to include that package in the Docker image? I only care about what runs in production, not on your laptop." },
        { speaker: 'protagonist', text: "But lodash is in package.json. Doesn't Docker pick that up automatically?" },
        { speaker: 'mentor', text: "The container is a clean environment. It doesn't know what's on your machine. If npm install doesn't run inside the container build, node_modules doesn't exist inside it." },
      ],
    },
  },
  s03: {
    python: {
      mentorName: 'Dev', mentorRole: 'Senior Data Scientist', mentorColor: '#D97706',
      lines: [
        { speaker: 'protagonist', text: "Dev's benchmark slides say the pipeline could run twice as fast in Rust. Is Python actually the bottleneck here?" },
        { speaker: 'mentor', text: "Python's GIL is killing our throughput. We'd cut runtime in half with Rust components. The numbers are clear." },
        { speaker: 'protagonist', text: "But do we know it's Python's speed causing the slowdown? What if it's the database queries and I/O waits, not the CPU work?" },
        { speaker: 'mentor', text: "Rust is just faster. Every benchmark says so. We need to be on the cutting edge." },
      ],
    },
    java: {
      mentorName: 'Rahul', mentorRole: 'Junior Backend Engineer', mentorColor: '#0891B2',
      lines: [
        { speaker: 'protagonist', text: "I've spent 40 minutes reading PaymentService. Interface, abstract class, factory. I haven't written a single line yet." },
        { speaker: 'mentor', text: "Yeah, that codebase is a beast. Just find the interface you need, implement it, and try not to think too much about the rest." },
        { speaker: 'protagonist', text: "But if I implement something I don't understand, what do I do when it breaks? What invariant might I be violating?" },
        { speaker: 'mentor', text: "Honestly it's probably over-engineered. Just look for the methods you need to call. That's what I do." },
      ],
    },
    nodejs: {
      mentorName: 'Jordan', mentorRole: 'Frontend Engineer', mentorColor: '#65A30D',
      lines: [
        { speaker: 'protagonist', text: "I mentioned that JavaScript was originally designed as a toy language. The room went quiet. I think I said the wrong thing in front of the whole team." },
        { speaker: 'mentor', text: "Dude, your professor must be living in the past! Modern JS is awesome — TypeScript, React, Next.js, the tooling is incredible." },
        { speaker: 'protagonist', text: "But I wasn't arguing against the tools. I'm trying to understand why Launchly chose Node for the backend specifically." },
        { speaker: 'mentor', text: "It's just popular and everyone knows it. That's basically the reason. Why overthink it?" },
      ],
    },
  },
  s04: {
    python: {
      mentorName: 'Sam', mentorRole: 'Junior Data Engineer', mentorColor: '#059669',
      lines: [
        { speaker: 'protagonist', text: "Three days of missing revenue data. The logs are full of SUCCESS. No errors, no warnings. How do you debug something that doesn't know it's broken?" },
        { speaker: 'mentor', text: "Oh man, a prod bug? Just rerun with a debugger attached and step through the whole thing. Or sprinkle print statements until something looks wrong." },
        { speaker: 'protagonist', text: "But the code thinks it succeeded. There's no line where it crashes. Print statements feel like throwing darts in the dark." },
        { speaker: 'mentor', text: "It'll turn up eventually. Just keep adding prints until you see something weird. That's basically how debugging works." },
      ],
    },
    java: {
      mentorName: 'Kavya', mentorRole: 'Senior Backend Engineer', mentorColor: '#7C3AED',
      lines: [
        { speaker: 'protagonist', text: "Staging NullPointerException on a real payment. My tests all covered null inputs. Where did this null come from?" },
        { speaker: 'mentor', text: "Vikram — I need the exact input payload that triggered this. Every field, every value." },
        { speaker: 'protagonist', text: "The staging test uses a real payment system. It might be sending a field in a format I never tested against." },
        { speaker: 'mentor', text: "Exactly. Your unit tests covered the inputs you imagined. Staging reveals the inputs you didn't imagine. Those are different populations." },
      ],
    },
    nodejs: {
      mentorName: 'Jordan', mentorRole: 'Frontend Engineer', mentorColor: '#65A30D',
      lines: [
        { speaker: 'protagonist', text: "Users are getting duplicate notifications. Logs show Notification sent twice in a row for the same ID. No errors at all." },
        { speaker: 'mentor', text: "Race condition. Just wrap the resend logic in Promise.all or add a setTimeout zero to debounce it. That usually fixes async weirdness." },
        { speaker: 'protagonist', text: "But there's no parallel work to coordinate here. And setTimeout zero feels like adding something without knowing why it would help." },
        { speaker: 'mentor', text: "Async stuff is just unpredictable sometimes. Try it and see if it fixes the symptom. I've seen it work before." },
      ],
    },
  },
};

const SWEConversationScene = ({
  track, lines, mentorName, mentorRole, mentorColor,
}: {
  track: SWETrack;
  lines: CSLine[];
  mentorName: string;
  mentorRole: string;
  mentorColor: string;
}) => {
  const protagonistName = track === 'python' ? 'Aisha' : track === 'java' ? 'Vikram' : 'Leo';
  const protagonistColor = track === 'python' ? '#16A34A' : track === 'java' ? '#0369A1' : '#CA8A04';
  const protagonistRole = track === 'python' ? 'Junior Data Engineer' : track === 'java' ? 'Junior Backend Engineer' : 'Junior Full-Stack Developer';

  return (
    <div style={{ margin: '28px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {lines.map((l, i) => {
        const isProtagonist = l.speaker === 'protagonist';
        const prevDifferent = i === 0 || lines[i - 1].speaker !== l.speaker;
        const bubble = (
          <motion.div
            whileHover={isProtagonist ? {} : { y: -2, boxShadow: `0 6px 20px ${mentorColor}22` }}
            transition={{ duration: 0.2 }}
            style={{
              background: isProtagonist ? `${protagonistColor}12` : 'var(--ed-card)',
              border: `1px solid ${isProtagonist ? `${protagonistColor}28` : mentorColor + '30'}`,
              borderLeft: isProtagonist ? undefined : `3px solid ${mentorColor}`,
              borderRadius: isProtagonist ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
              padding: '10px 14px', fontSize: '13.5px', color: 'var(--ed-ink)', lineHeight: 1.68,
              boxShadow: isProtagonist ? 'none' : '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            {l.text}
          </motion.div>
        );
        return (
          <div key={i} style={{ display: 'flex', flexDirection: isProtagonist ? 'row-reverse' : 'row', gap: '12px', alignItems: 'flex-end' }}>
            {/* Avatar */}
            {prevDifferent ? (
              isProtagonist ? (
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: protagonistColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0, boxShadow: `0 2px 8px ${protagonistColor}40` }}>
                  {protagonistName.slice(0, 2)}
                </div>
              ) : (
                <div style={{ width: 48, height: 48, flexShrink: 0, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${mentorColor}`, boxShadow: `0 2px 10px ${mentorColor}30` }}>
                  <SWEMentorFace name={mentorName} size={48} />
                </div>
              )
            ) : (
              <div style={{ width: isProtagonist ? 42 : 48, flexShrink: 0 }} />
            )}
            {/* Bubble + name */}
            <div style={{ maxWidth: '70%' }}>
              {prevDifferent && (
                <div style={{ fontSize: '10px', fontWeight: 700, color: isProtagonist ? protagonistColor : mentorColor, marginBottom: '5px', textAlign: isProtagonist ? 'right' : 'left', letterSpacing: '0.05em', fontFamily: "'JetBrains Mono', monospace" }}>
                  {isProtagonist ? protagonistName : mentorName}
                  <span style={{ fontWeight: 400, opacity: 0.65 }}> &middot; {isProtagonist ? protagonistRole : mentorRole}</span>
                </div>
              )}
              {bubble}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface Props { track: SWETrack; level: SWELevel; onBack: () => void; }

export default function SWEPreRead1({ track, level, onBack }: Props) {
  const meta = TRACK_META[track];
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  const store = useLearnerStore();

  const SECTION_XP = 50;
  const QUIZ_XP = 100;
  const readingXP = completedSections.size * SECTION_XP;
  const quizXP = CONCEPTS.reduce((sum, c) => sum + Math.round((store.conceptStates[c]?.pKnow ?? 0) * QUIZ_XP), 0);
  const totalXP = readingXP + quizXP;

  const [showGain, setShowGain] = useState(false);
  const [gainAmt, setGainAmt] = useState(0);
  const gainRef = useRef(0);
  useEffect(() => {
    const diff = totalXP - gainRef.current;
    if (diff > 0) { setGainAmt(diff); setShowGain(true); gainRef.current = totalXP; const t = setTimeout(() => setShowGain(false), 1800); return () => clearTimeout(t); }
  }, [totalXP]);

  const progressPct = Math.round((completedSections.size / SECTIONS.length) * 100);
  const xpLevel = getLevel(totalXP);
  const nextLevel = getNextLevel(totalXP);
  const levelPct = nextLevel ? Math.round(((totalXP - xpLevel.min) / (nextLevel.min - xpLevel.min)) * 100) : 100;

  useEffect(() => {
    store.initSession();
    CONCEPTS.forEach(c => store.ensureConceptState(c));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('data-section');
        if (!id) return;
        if (entry.isIntersecting) {
          if (entry.intersectionRatio >= 0.1) setActiveSection(id);
          if (entry.intersectionRatio >= 0.25) { setCompletedSections(p => new Set([...p, id])); store.markSectionViewed(id); }
        }
      });
    }, { threshold: [0.1, 0.25, 0.5] });
    const t = setTimeout(() => { document.querySelectorAll('[data-section]').forEach(el => obs.observe(el)); }, 150);
    return () => { clearTimeout(t); obs.disconnect(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardStyle: React.CSSProperties = { background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' };

  return (
    <div className="editorial" style={{ minHeight: '100vh', background: 'var(--ed-cream)' }}>

      {/* Top nav — matches PMFundamentalsModule structure exactly */}
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
              <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: meta.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 13H2L8 2Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" /><path d="M5.5 9.5H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
              <span style={{ color: 'var(--ed-rule)', fontSize: '18px' }}>|</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--ed-ink3)' }}>SWE Launchpad</span>
                <span style={{ color: 'var(--ed-rule)', fontSize: '12px' }}>›</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: 'var(--ed-ink2)' }}>{meta.shortLabel} · Pre-Read 01</span>
              </div>
            </div>
            <div style={{ flex: 1, maxWidth: '240px', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 24px' }}>
              <div style={{ flex: 1, height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', background: meta.accentColor, borderRadius: '2px' }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: meta.accentColor, flexShrink: 0 }}>{progressPct}%</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: meta.accentColor, flexShrink: 0 }}>{totalXP} XP</div>
          </div>
        </div>
      </div>

      {/* 3-column layout — matches PMFundamentalsModule exactly */}
      <div className="three-col-wrap" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 28px' }}>
      <div className="three-col-grid" style={{ display: 'grid', gridTemplateColumns: '200px minmax(0, 1fr) 240px', gap: '40px', alignItems: 'start', paddingTop: '36px' }}>

        {/* Left nav */}
        <aside className="left-col" style={{ position: 'sticky', top: '57px', height: 'fit-content' }}>
          <div style={{ background: 'var(--ed-card)', border: '1px solid var(--ed-rule)', borderRadius: '10px', padding: '16px 14px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid var(--ed-rule)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '8px' }}>Contents</div>
              <div style={{ height: '2px', background: 'var(--ed-rule)', borderRadius: '1px', overflow: 'hidden' }}><motion.div style={{ height: '100%', background: meta.accentColor, borderRadius: '1px' }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} /></div>
              <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '6px' }}>{progressPct}% · {completedSections.size}/{SECTIONS.length} parts</div>
            </div>
            <nav>
              {SECTIONS.map((sec, idx) => {
                const done = completedSections.has(sec.id);
                const active = activeSection === sec.id && !done;
                return (
                  <motion.button key={sec.id} onClick={() => document.querySelector(`[data-section="${sec.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })} whileHover={{ x: 2 }}
                    style={{ display: 'flex', alignItems: 'baseline', gap: '8px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '5px 0', textAlign: 'left' as const, borderLeft: active ? `2px solid ${meta.accentColor}` : '2px solid transparent', paddingLeft: '8px', marginLeft: '-8px', transition: 'border-color 0.2s' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: done || active ? meta.accentColor : 'var(--ed-rule)', flexShrink: 0, minWidth: '18px', lineHeight: 1 }}>{toRoman(idx + 1)}.</span>
                    <span style={{ fontSize: '11px', fontWeight: active ? 600 : 400, color: done ? 'var(--ed-ink2)' : active ? 'var(--ed-ink)' : 'var(--ed-ink3)', lineHeight: 1.4, wordBreak: 'break-word' as const, transition: 'color 0.2s' }}>{sec.label}{done ? ' ✓' : ''}</span>
                  </motion.button>
                );
              })}
            </nav>
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--ed-rule)' }}>
              <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.5 }}>Following {meta.protagonist.split(' ')[0]}&apos;s journey</div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div style={{ paddingTop: '4px', paddingBottom: '80px', minWidth: 0 }}>

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '48px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', color: meta.accentColor, marginBottom: '12px' }}>SOFTWARE ENGINEERING LAUNCHPAD · {meta.shortLabel.toUpperCase()} · PRE-READ 01</div>
            <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 700, color: 'var(--ed-ink)', fontFamily: "'Lora', serif", lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '16px' }}>{meta.introTitle}</h1>
            <p style={{ fontSize: '16px', color: 'var(--ed-ink2)', lineHeight: 1.75, maxWidth: '580px', marginBottom: '24px' }}>Most people learning to code jump straight to syntax. This pre-read goes one level deeper — how the machine executes your instructions, what tools sit between you and production, and how to think when something goes wrong.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' as const }}>
              {[{ label: 'Time', value: '25 min read' }, { label: 'Protagonist', value: meta.protagonist }, { label: 'Company', value: meta.company }].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '6px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginTop: '1px' }}>{item.label}</span>
                  <span style={{ color: 'var(--ed-ink2)', fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── SECTION 01 ───────────────────────────────── */}
          <ChapterSection id="swe-m1-how-code-runs" num="01" accentRgb={ACCENT_RGB} first>
            {chLabel('The Execution Model')}
            {h2(<>When you run a program, what actually happens?</>)}

            <ProtagonistAvatar
              name={track === 'python' ? 'Aisha' : track === 'java' ? 'Vikram' : 'Leo'}
              role={meta.protagonistRole}
              color={meta.accentColor}
              content={level === 'advanced' ? ADV.s01[track].open : <>
                {track === 'python' && <>I fixed that off-by-one error, the pipeline ran green, no exceptions. That means it worked, right? Ran successfully is basically a pass. The dashboard should reflect the correct data now.</>}
                {track === 'java' && <>My code compiles, all unit tests pass, the endpoint returns 200 OK. Pushing to CI is a formality at this point. If it works in my IDE with the dependency I added, it will work everywhere.</>}
                {track === 'nodejs' && <>JavaScript is JavaScript. localStorage is a standard web storage API. The notification service runs JavaScript so localStorage should just work. This is a ten-minute feature.</>}
              </>}
            />

            <StoryCard protagonist={meta.protagonist.split(' ')[0]} accentColor={meta.accentColor}>
              {level === 'advanced' ? ADV.s01[track].story : <>
                {track === "python" && <>Aisha watches the deployment dashboard, a small smile on her lips as the SUCCESS badge glows green. She refreshes the client analytics page expecting corrected numbers. Client Alpha revenue: still zero. Riya leans over the partition and points at the screen without saying anything for a moment. Then: &lsquo;Aisha. The pipeline ran successfully. But this client&apos;s data is still bad. What exactly do you mean by ran successfully?&rsquo;</>}
                {track === "java" && <>Vikram watches the green test indicators light up in his IDE, a small surge of satisfaction. He pushes the branch and pulls up the CI dashboard. Build running. Tests running. Then: BUILD FAILED. He opens the log expecting something minor. Instead: java.lang.ClassNotFoundException for the exact dependency he can see referenced in his pom.xml. Kavya walks over, looks at the screen briefly, and asks Vikram to explain the difference between how his IDE runs code and how CI does.</>}
                {track === "nodejs" && <>Leo writes the localStorage call, saves the file, starts the notification service. The server crashes immediately: ReferenceError: localStorage is not defined. He reads it twice. He has used localStorage dozens of times in frontend work. Jordan leans over to look: &lsquo;That is weird. Node is basically the same as browser JS. Probably needs a polyfill or something.&rsquo;</>}
              </>}
            </StoryCard>

            <SWEConversationScene
              track={track}
              lines={CS_DIALOGUES.s01[track].lines}
              mentorName={CS_DIALOGUES.s01[track].mentorName}
              mentorRole={CS_DIALOGUES.s01[track].mentorRole}
              mentorColor={CS_DIALOGUES.s01[track].mentorColor}
            />

            <SWEAvatar
              name={level === 'advanced' ? ADV.s01[track].b2.name : (track === 'python' ? 'Sam' : track === 'java' ? 'Rahul' : meta.mentor)}
              role={level === 'advanced' ? ADV.s01[track].b2.role : (track === 'python' ? 'Junior Data Engineer' : track === 'java' ? 'Junior Backend Engineer' : meta.mentorRole)}
              color={level === 'advanced' ? ADV.s01[track].b2.color : (track === 'python' ? '#059669' : track === 'java' ? '#0891B2' : meta.mentorColor)}
              conceptId="swe-m1-execution"
              content={level === 'advanced' ? <>&ldquo;{ADV.s01[track].b2.content}&rdquo;</> :
                track === 'python' ? <>&ldquo;Hey Aisha, don&apos;t sweat it. If the pipeline logs say &lsquo;SUCCESS&rsquo; and it ran to completion, it&apos;s good. Riya&apos;s probably just overthinking it.&rdquo;</> :
                track === 'java' ? <>&ldquo;Oh, that&apos;s normal. CI is always a bit finicky. Did you try cleaning your local Maven repository and rebuilding? Sometimes that fixes it.&rdquo;</> :
                <>&ldquo;Leo, the <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>ReferenceError</code> for <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>localStorage</code> tells you something fundamental. Where does browser JavaScript execute, and where does Node.js execute? What&apos;s the context for each?&rdquo;</>
              }
              expandedContent={level === 'advanced' ? <>&ldquo;{ADV.s01[track].b2.expanded}&rdquo;</> :
                track === 'python' ? <>&ldquo;I mean, I&apos;ve had pipelines run for hours, and as long as they don&apos;t crash, that&apos;s a win, right? We&apos;ve got monitoring, but if it didn&apos;t yell at us, it&apos;s probably fine. Maybe it&apos;s an upstream data issue, not your code.&rdquo;</> :
                track === 'java' ? <>&ldquo;I&apos;ve had that happen a bunch of times. My code works fine, but CI just acts up. Maybe the CI server has a cached version of your code or something? I&apos;d just try re-running the build a couple of times, or check if anyone else deployed something weird recently.&rdquo;</> :
                <>&ldquo;Think about what <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>localStorage</code> is designed to do. It&apos;s for persisting data on a user&apos;s browser. Now, consider the server. Does it have a &lsquo;user&apos;s browser&rsquo; in the same way? The runtime environment dictates which global objects and APIs are available.&rdquo;</>
              }
              question={level === 'advanced' ? ADV.s01[track].b2.question :
                track === 'python' ? 'Sam suggests that a \'SUCCESS\' log message is sufficient proof of a pipeline\'s successful operation. What fundamental aspect does this perspective overlook?' :
                track === 'java' ? 'Rahul suggests general troubleshooting steps for CI failures. What is a more focused initial action Vikram should take when facing a ClassNotFoundException in CI?' :
                'Mei prompts Leo to consider the execution context. What is the fundamental difference in the global objects available in a browser versus a Node.js environment?'
              }
              options={level === 'advanced' ? ADV.s01[track].b2.opts :
                track === 'python' ? [
                  { text: 'The importance of optimizing runtime performance, as a slow success is still considered a failure by some metrics.', correct: false, feedback: 'While performance is important, Sam\'s statement overlooks data correctness, which is more fundamental than speed for pipeline success.' },
                  { text: 'The potential for logical errors or unhandled edge cases to produce incorrect output without crashing the process.', correct: true, feedback: 'A \'SUCCESS\' log only indicates completion, not correctness. Silent data corruption or missed records are common issues that don\'t always trigger errors.' },
                  { text: 'The need for comprehensive unit tests to ensure every function works independently before integration into the pipeline.', correct: false, feedback: 'Unit tests are valuable, but Sam\'s point is about runtime verification, not pre-deployment testing, although they are related.' },
                ] :
                track === 'java' ? [
                  { text: 'Review the CI build logs for specific messages about dependency resolution or artifact packaging, not just the exception.', correct: true, feedback: 'Detailed CI logs provide crucial information about the build process, including dependency downloads, classpath construction, and packaging errors.' },
                  { text: 'Revert to a previous commit that passed CI successfully, then reapply changes incrementally to identify the breaking point.', correct: false, feedback: 'While sometimes necessary, this is a reactive step. Understanding the current failure from logs is more efficient first.' },
                  { text: 'Check if the CI server\'s operating system has been recently updated, as this can affect Java classpath resolution.', correct: false, feedback: 'OS updates rarely affect Java classpath resolution directly. Build tool configuration and dependency declarations are far more common causes.' },
                ] : [
                  { text: 'Node.js provides global for server-side utilities, whereas browsers expose window for client-side interactions.', correct: true, feedback: 'Node.js uses global (or globalThis) as its global object, providing access to OS-level functionalities, while browsers use window for DOM manipulation and browser-specific APIs.' },
                  { text: 'Browsers automatically include all Node.js modules, making them universally accessible without explicit imports.', correct: false, feedback: 'Browsers do not automatically include Node.js modules. Node.js has its own module system (require or import), separate from browser-specific modules.' },
                  { text: 'The browser environment has no concept of a file system, while Node.js inherently supports file I/O operations.', correct: false, feedback: 'While true that browsers don\'t have direct filesystem access, Mei\'s question is about global objects and APIs, not specific capabilities like file I/O.' },
                ]
              }
            />

            {track === 'java' && keyBox('The JVM Promise', [
              'Write once, run anywhere — the same .class files run on any OS with a JVM installed',
              'The compiler catches type errors before the program ever runs',
              'The JVM manages memory automatically via garbage collection',
              'JIT compilation makes Java surprisingly fast at runtime despite the extra layer',
            ])}
            {track === 'python' && keyBox('The CPython Model', [
              'Source code (.py) → CPython interpreter → execution',
              'Errors are runtime by default — they appear when a line is reached',
              'Python also compiles to bytecode (.pyc) internally for caching — you rarely see this',
              'The interpreter is itself a program: type python3 --version to see which one you have',
            ])}
            {track === 'nodejs' && keyBox('The V8 + Node.js Model', [
              'JavaScript source → V8 engine → native machine code (JIT compiled)',
              'Node.js adds APIs the browser doesn\'t have: file system, network, OS access',
              'Node.js does NOT have browser APIs — no DOM, no window, no localStorage. Same language, different global object',
              'The same JS engine runs in Chrome (browser) and in your terminal (Node)',
              'node --version tells you the Node runtime version; this implies a V8 version too',
            ])}

            <TiltCard style={{ margin: '28px 0' }}><TerminalRunCard track={track} accentColor={meta.accentColor} /></TiltCard>

            {pullQuote('Understanding your runtime is not academic. When a bug only appears under load, or a library behaves differently in production than on your machine, the execution model is usually why.')}

            <PMPrincipleBox principle={
              track === 'python' ? 'The Execution Principle — A script that exits without error is not the same as a script that is correct. Define what success means for your code before you run it.' :
              track === 'java' ? 'The Execution Principle — The compiler approves your types. The JVM runs your logic. Neither one verifies that your code does what the business expects.' :
              'The Execution Principle — Same language, different runtime. Browser and Node share JavaScript syntax but not the APIs. Understanding the environment your code runs in is non-negotiable.'
            } />
            <ApplyItBox prompt={
              track === 'python'
                ? 'Find a script you wrote recently. Write down: (1) what "success" means for this script beyond exit code 0, (2) which inputs could cause silent bad output, (3) one assertion you could add to catch it. Then add it.'
                : track === 'java'
                ? 'Open a Java class you wrote recently. Find one method that could receive a null input. Write down: what happens at that line if null arrives? Then add an explicit null check or use Optional.'
                : 'Create a new file test-env.js. Write one line that only works in a browser (window.document.title) and one that only works in Node (process.version). Run both with node. Read the error. Understand why.'
            } />

            <QuizEngine conceptId="swe-m1-execution" conceptName="Execution Model" moduleContext={meta.moduleContext}
              staticQuiz={track === 'java' ? {
                conceptId: 'swe-m1-execution',
                question: 'A Java program compiles fine but crashes at runtime with a NullPointerException. What does this tell you about Java\'s execution model?',
                options: ['A. The compiler missed the bug because it only checks types and syntax, not all runtime behaviour', 'B. The JVM is faulty and should have caught this at compile time', 'C. The program was not compiled with javac — it ran the raw .java source'],
                correctIndex: 0,
                explanation: 'The compiler checks types and syntax, but some errors only manifest when specific code paths run at runtime. NullPointerException is a runtime condition — the JVM cannot know at compile time whether a reference will be null.',
              } : track === 'python' ? {
                conceptId: 'swe-m1-execution',
                question: 'A Python script has a logic error on line 42 but runs fine when line 42 is never reached. What does this reveal?',
                options: ['A. CPython interprets code line by line — lines not reached are not executed', 'B. Python ignores logic errors in some files', 'C. The script is cached from a previous valid run'],
                correctIndex: 0,
                explanation: 'CPython does parse the whole file for syntax before running, but logic errors inside un-reached branches only surface when those branches execute. This is exactly why test coverage that exercises all branches matters.',
              } : {
                conceptId: 'swe-m1-execution',
                question: 'A Node.js app works fine locally but crashes in production when a specific API endpoint is called. Most likely cause?',
                options: ['A. A code path reached in production was never exercised during local testing', 'B. Node.js behaves differently per operating system due to V8 differences', 'C. Production uses a different JavaScript version than development'],
                correctIndex: 0,
                explanation: 'Node runs the same V8 engine locally and in production. Environmental differences — missing env vars, different data shapes, higher concurrency — expose code paths that local testing missed. The engine is the same; the inputs are different.',
              }}
            />
          </ChapterSection>

          {/* ── SECTION 02 ───────────────────────────────── */}
          <ChapterSection id="swe-m1-dev-environment" num="02" accentRgb={ACCENT_RGB}>
            {chLabel('The Developer Environment')}
            {h2(<>Your tools before you write a single line</>)}

            <ProtagonistAvatar
              name={track === 'python' ? 'Aisha' : track === 'java' ? 'Vikram' : 'Leo'}
              role={meta.protagonistRole}
              color={meta.accentColor}
              content={level === 'advanced' ? ADV.s02[track].open : <>
                {track === 'python' && <>I installed fast_csv_parser myself and watched it import cleanly. If it works on my machine it should work for the rest of the team. Python environments are pretty straightforward.</>}
                {track === 'java' && <>Adding a new library should mean dropping a dependency block in pom.xml with the artifact ID and version. How complicated can one library addition really be?</>}
                {track === 'nodejs' && <>I ran npm install, everything resolved, my endpoint works perfectly. Deploying to Docker is just packaging what already works. Containers are supposed to make deployment more consistent, not less.</>}
              </>}
            />

            <StoryCard protagonist={meta.protagonist.split(' ')[0]} accentColor={meta.accentColor}>
              {level === 'advanced' ? ADV.s02[track].story : <>
                {track === "python" && <>Aisha runs the updated data processing script on her laptop, output streaming by clean and correct. She pushes to the shared repo and Sam pulls it to test on his machine. His terminal immediately fires back: ModuleNotFoundError: No module named fast_csv_parser. Same repo. Same Python version. Aisha stares at the error trying to figure out what is different between their two machines.</>}
                {track === "java" && <>Vikram copies a dependency block from the Maven documentation into pom.xml. mvn install fails immediately with a conflict about transitive dependencies. He scans the existing pom.xml, overwhelmed by scope attributes, optional flags, and exclusion blocks. He has no idea what any of it means. Suresh, overhearing his escalating frustration from the adjacent desk, strides over: &lsquo;Before you touch another dependency, explain to me what Maven lifecycle phases are.&rsquo;</>}
                {track === "nodejs" && <>Leo pushes to the container registry. Carlos initiates the Docker build and deploy. Two minutes later: MODULE_NOT_FOUND: Cannot find module lodash. Carlos stares at his terminal. Then at Leo. Leo stares back. Lodash is definitely installed. It is in his node_modules right now. He can see it sitting there. Carlos says nothing. He just sighs.</>}
              </>}
            </StoryCard>

            <SWEConversationScene
              track={track}
              lines={CS_DIALOGUES.s02[track].lines}
              mentorName={CS_DIALOGUES.s02[track].mentorName}
              mentorRole={CS_DIALOGUES.s02[track].mentorRole}
              mentorColor={CS_DIALOGUES.s02[track].mentorColor}
            />

            <SWEAvatar
              name={level === 'advanced' ? ADV.s02[track].b2.name : (track === 'python' ? 'Priya' : track === 'java' ? 'Ananya' : meta.mentor)}
              role={level === 'advanced' ? ADV.s02[track].b2.role : (track === 'python' ? 'Engineering Manager' : track === 'java' ? 'Product Manager' : meta.mentorRole)}
              color={level === 'advanced' ? ADV.s02[track].b2.color : (track === 'python' ? '#7C3AED' : track === 'java' ? '#DB2777' : meta.mentorColor)}
              conceptId="swe-m1-environment"
              content={level === 'advanced' ? <>&ldquo;{ADV.s02[track].b2.content}&rdquo;</> :
                track === 'python' ? <>&ldquo;Aisha, I don&apos;t care if it&apos;s a Docker container or a virtual environment. I just need your local setup to match production and Sam&apos;s. What&apos;s the fastest path to consistency?&rdquo;</> :
                track === 'java' ? <>&ldquo;So, it takes this much effort just to add a single library in Java? In other ecosystems, you just type <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>npm install</code> and you&apos;re done. Why is Java so slow to change?&rdquo;</> :
                <>&ldquo;Leo, think about the steps for building and running your app locally versus how a Docker container is constructed. What&apos;s fundamentally different about how dependencies are handled in each scenario?&rdquo;</>
              }
              expandedContent={level === 'advanced' ? <>&ldquo;{ADV.s02[track].b2.expanded}&rdquo;</> :
                track === 'python' ? <>&ldquo;We can&apos;t have developers wasting time debugging environment issues when they should be shipping features. Are we using a <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>requirements.txt</code>? Is everyone on the same Python version? Let&apos;s fix this so you can focus on the actual data pipeline.&rdquo;</> :
                track === 'java' ? <>&ldquo;I don&apos;t understand why something so basic has to be this complicated. My team needs features delivered quickly, and if half your time is spent wrestling with build tools and XML files, that&apos;s a problem. We need agility, not a fortress of configuration.&rdquo;</> :
                <>&ldquo;On your machine, you run <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>npm install</code> once, and <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>node_modules</code> sits there. Docker, however, builds layer by layer. If you add a dependency, you need to ensure the <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>npm install</code> command runs inside the container&apos;s build context after <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>package.json</code> is copied.&rdquo;</>
              }
              question={level === 'advanced' ? ADV.s02[track].b2.question :
                track === 'python' ? 'Priya prioritizes consistent development environments. What is the most immediate and practical step for Aisha to ensure her local Python dependencies match Sam\'s?' :
                track === 'java' ? 'Ananya expresses frustration with Maven\'s complexity compared to other package managers. What benefit does Maven\'s structured approach offer that simpler tools might lack for enterprise projects?' :
                'Mei emphasizes the difference in dependency handling. What is the correct sequence of Dockerfile instructions to ensure Node.js dependencies are properly installed for a containerized application?'
              }
              options={level === 'advanced' ? ADV.s02[track].b2.opts :
                track === 'python' ? [
                  { text: 'Reinstall her operating system to ensure a clean slate, then manually install Python and all libraries.', correct: false, feedback: 'This is an extreme and often unnecessary step. There are more targeted ways to manage Python environments without reinstalling the OS.' },
                  { text: 'Use a tool like pip freeze > requirements.txt on Sam\'s machine and then pip install -r requirements.txt on hers.', correct: true, feedback: 'Using pip freeze and pip install -r is a standard and effective way to replicate exact Python dependency versions across environments.' },
                  { text: 'Manually compare all installed packages using pip list on both machines and install missing ones individually.', correct: false, feedback: 'Manually comparing pip list is tedious and error-prone, especially for many dependencies and nested requirements.' },
                ] :
                track === 'java' ? [
                  { text: 'It provides a highly optimized compiler that generates faster bytecode than other language compilers.', correct: false, feedback: 'Maven is a build automation tool, not a compiler. The compiler (Javac) is a separate component.' },
                  { text: 'It enforces a standardized project structure and build lifecycle, promoting consistency and reducing \'works on my machine\' issues.', correct: true, feedback: 'Maven\'s convention-over-configuration and lifecycle management standardize builds, making them more predictable and reproducible across environments.' },
                  { text: 'It automatically detects and resolves all transitive dependency conflicts without requiring any manual intervention.', correct: false, feedback: 'Maven has conflict resolution mechanisms, but it doesn\'t always automatically resolve all conflicts without developer input or configuration.' },
                ] : [
                  { text: 'Copy the entire local node_modules directory into the Docker image, then run npm start directly.', correct: false, feedback: 'Copying node_modules is platform-specific and can lead to issues. It\'s best to install dependencies directly within the container.' },
                  { text: 'Copy package.json and package-lock.json, run npm install, then copy the rest of the application code.', correct: true, feedback: 'This sequence ensures dependencies are installed using the correct lockfile, and then the application code is added, leveraging Docker\'s layer caching effectively.' },
                  { text: 'Run npm install on the host machine, then copy the generated node_modules and the application code into the Docker image.', correct: false, feedback: 'Installing on the host and copying node_modules can cause problems due to platform differences or incorrect builds for the container\'s environment.' },
                ]
              }
            />


            {para(<>Professional engineers spend deliberate time on their environment — the set of tools, configurations, and habits that let them write, run, and debug code reliably. Getting this wrong early causes a specific kind of suffering: hours lost to problems that have nothing to do with the actual code you are trying to write.</>)}

            {h2(<>The Terminal</>)}
            {para(<>The terminal is where you will spend a surprising amount of your time as a developer. It is how you install dependencies, start servers, run tests, manage files, and interact with version control. Every professional engineer is comfortable here.</>)}

            {keyBox('Terminal commands you need immediately', [
              'pwd — print working directory (where are you?)',
              'ls (Mac/Linux) / dir (Windows) — list files in current directory',
              'cd folder-name — navigate into a directory',
              'cd .. — go up one level',
              'Ctrl+C — stop a running process (the most important shortcut)',
            ])}

            {h2(<>
              {track === 'python' && 'pip and Virtual Environments'}
              {track === 'java' && 'The JDK and Maven'}
              {track === 'nodejs' && 'npm and package.json'}
            </>)}

            {track === 'python' && (<>
              {para(<><strong>pip</strong> is Python&apos;s package manager. It downloads libraries from PyPI (the Python Package Index) and installs them on your machine. The problem is that if you install everything globally, different projects will conflict with each other — one needs pandas 1.5, another needs 2.0.</>)}
              {para(<>The solution is a <strong>virtual environment</strong>: a self-contained Python installation per project. When you activate it, pip installs go into that project&apos;s folder, not system-wide. This is what Aisha was missing.</>)}
              {keyBox('Virtual environment workflow', [
                'python3 -m venv venv — create a virtual environment in a folder called venv',
                'source venv/bin/activate (Mac/Linux) or venv\\Scripts\\activate (Windows) — activate it',
                'pip install pandas — installs into the venv, not globally',
                'pip freeze > requirements.txt — save a list of installed packages for the team',
                'deactivate — exit the virtual environment',
              ])}
            </>)}
            {track === 'java' && (<>
              {para(<>The <strong>JDK (Java Development Kit)</strong> includes the compiler (<code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>javac</code>), the runtime, and the standard library. You cannot write or run Java without it. Install JDK 21 — the current LTS version. Never install just the JRE; you need the full kit to compile.</>)}
              {para(<><strong>Maven</strong> is a build tool and dependency manager. Your project&apos;s dependencies are declared in <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>pom.xml</code>. Maven reads that file, downloads the JAR files from Maven Central, compiles your code, and runs tests. You never manage JARs manually. This is what those 47 downloads Vikram saw were.</>)}
              {keyBox('Maven workflow', [
                'mvn compile — compile the project',
                'mvn test — run all tests',
                'mvn package — build a .jar file',
                'mvn spring-boot:run — start a Spring Boot app directly',
                'pom.xml — the file that defines your dependencies (like package.json for Java)',
              ])}
              {para(<>Maven does not just download the library you declared. It downloads that library&apos;s dependencies, and their dependencies — forming a tree. When two branches of the tree need different versions of the same library, Maven picks one using <strong>nearest-first resolution</strong>: the version closest to your project in the graph wins. Sometimes the wrong version wins, removing methods your code expected. This is called a <strong>transitive dependency conflict</strong>, and it is why adding a single line to pom.xml can break things that were working before.</>)}
            </>)}
            {track === 'nodejs' && (<>
              {para(<><strong>npm</strong> (Node Package Manager) comes bundled with Node.js. When you run <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>npm install express</code>, npm downloads express and its dependencies into a folder called <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>node_modules</code>. When you clone a project, <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>node_modules</code> is not there — it is in <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>.gitignore</code>. That is why Leo needed to run <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>npm install</code> first.</>)}
              {para(<><strong>package.json</strong> declares what your project needs. <strong>package-lock.json</strong> pins every dependency to a specific version so all team members get identical installs. Always commit both files, never commit node_modules.</>)}
              {keyBox('npm workflow', [
                'npm init -y — create a package.json with defaults',
                'npm install <package> — add a dependency',
                'npm install --save-dev <package> — add a dev-only dependency (tests, build tools)',
                'npm ci — fast, reproducible install using package-lock.json (use in CI)',
                '.gitignore node_modules — never commit this folder (it is huge and reproducible)',
              ])}
            </>)}

            <EnvMistakes track={track} accentColor={meta.accentColor} />

            {h2(<>Version Control: Git</>)}
            {para(<>Git is not optional. Every professional engineering team uses version control. Git lets you save checkpoints of your code, experiment in branches without fear, and collaborate through pull requests. Your first day on any team involves cloning a git repository.</>)}

            {keyBox('Git commands you need on day one', [
              'git clone <url> — download a repository from GitHub',
              'git status — see what has changed since the last commit',
              'git add . — stage all changed files',
              'git commit -m "describe what changed" — save a checkpoint',
              'git push — upload your commits to the remote repository',
            ])}

            <TiltCard style={{ margin: '28px 0' }}><DevEnvPanel track={track} accentColor={meta.accentColor} /></TiltCard>

            <PMPrincipleBox principle={
              track === 'python' ? 'The Environment Principle — A working local setup is not the same as a reproducible setup. requirements.txt and a virtual environment make your code portable. Without them, it only works on your machine.' :
              track === 'java' ? 'The Environment Principle — The build tool is the canonical definition of your project. If it is not in pom.xml, it is not a dependency — it is an accident waiting to happen in CI.' :
              'The Environment Principle — node_modules is a derived artifact, not source code. The source of truth is package.json and package-lock.json. What you commit is the definition; npm install recreates the result.'
            } />
            <ApplyItBox prompt={
              track === 'python'
                ? 'Set up a fresh virtual environment for a project you work on. Run pip freeze > requirements.txt. Open the file. Are all the versions there? Now delete the venv, recreate it, and run pip install -r requirements.txt. Does it work?'
                : track === 'java'
                ? 'Open your pom.xml. Find one dependency. Look up what it does on Maven Central. Now check: what scope is it (compile, test, provided)? If there is no scope attribute, it defaults to compile — is that right for this dependency?'
                : 'Clone any Node.js project (your own or open source). Delete node_modules. Run npm install. Verify the app starts. Then open package-lock.json and count how many lines it has. That file is what makes the install reproducible.'
            } />

            <QuizEngine conceptId="swe-m1-environment" conceptName="Developer Environment" moduleContext={meta.moduleContext}
              staticQuiz={track === 'python' ? {
                conceptId: 'swe-m1-environment',
                question: 'A colleague\'s Python script works but yours crashes with "ModuleNotFoundError: No module named pandas". Most likely cause?',
                options: ['A. Your virtual environment does not have pandas installed, or you are in the wrong venv', 'B. Python version mismatch — pandas only works on Python 2', 'C. The module name should be capitalised: "Pandas"'],
                correctIndex: 0,
                explanation: 'Each virtual environment has its own installed packages. If you activated a different venv, or no venv at all, the package will not be found even if it is installed elsewhere on your system.',
              } : track === 'java' ? {
                conceptId: 'swe-m1-environment',
                question: 'You clone a Java project and run mvn compile. It fails with "could not find dependency". What is most likely needed?',
                options: ['A. Maven needs to download the dependencies listed in pom.xml to your local cache', 'B. The JDK is not installed', 'C. There is a syntax error in the import statement'],
                correctIndex: 0,
                explanation: 'Maven reads pom.xml to know what to download, but a fresh clone has no local Maven cache. Running mvn compile triggers the download automatically — this is normal on a first clone.',
              } : {
                conceptId: 'swe-m1-environment',
                question: 'You clone a Node.js project and run node server.js. It crashes with "Cannot find module \'express\'". What is the fix?',
                options: ['A. Run npm install — node_modules is not committed to git', 'B. Express is not compatible with your Node.js version', 'C. Change the import from require() to import'],
                correctIndex: 0,
                explanation: 'node_modules is listed in .gitignore and never committed. When you clone a project, npm install reads package.json and downloads all dependencies. This is always the first step after cloning any Node.js project.',
              }}
            />
          </ChapterSection>

          {/* ── SECTION 03 ───────────────────────────────── */}
          <ChapterSection id="swe-m1-language-ecosystem" num="03" accentRgb={ACCENT_RGB}>
            {chLabel('The Ecosystem')}
            {h2(<>
              {track === 'python' && <>Why Mosaic Analytics runs on Python</>}
              {track === 'java' && <>Why Finova&apos;s backend is Java</>}
              {track === 'nodejs' && <>Why Launchly&apos;s API is Node.js</>}
            </>)}

            <ProtagonistAvatar
              name={track === 'python' ? 'Aisha' : track === 'java' ? 'Vikram' : 'Leo'}
              role={meta.protagonistRole}
              color={meta.accentColor}
              content={level === 'advanced' ? ADV.s03[track].open : <>
                {track === 'python' && <>Python is slow compared to compiled languages, I know that. But it is so productive for data work. I thought that slowness was an accepted tradeoff. Is the pipeline really that much of a bottleneck?</>}
                {track === 'java' && <>I came here to write business logic, not to decode architectural diagrams. Every file I open has three interfaces and a factory class. This feels over-engineered and it is making a simple task impossible to navigate.</>}
                {track === 'nodejs' && <>My professor was not wrong exactly. JavaScript was designed in ten days and some of the quirks are still there. I am not saying it is bad, just that it was not originally designed for serious backend systems.</>}
              </>}
            />

            <StoryCard protagonist={meta.protagonist.split(' ')[0]} accentColor={meta.accentColor}>
              {level === 'advanced' ? ADV.s03[track].story : <>
                {track === "python" && <>At standup, Dev has benchmarks ready and a slide deck nobody asked for. The nightly 50M row transformation could run in half the time with Rust components, he says. Aisha listens, a faint unease forming. She has only ever done this kind of work in Python, and the libraries — pandas, numpy, the whole stack — feel inseparable from the job. Dev wraps up: Python just cannot keep up with the scale we are hitting.</>}
                {track === "java" && <>Vikram navigates to PaymentService to add his validation hook. It is an interface. He finds AbstractPaymentService. Then PaymentServiceFactory. Then CreditCardPaymentServiceImpl. Each layer opens three more questions. He has been reading code for forty minutes and has not written a single line. Rahul appears at his desk: &lsquo;Just find the interface you need to implement. You do not have to understand all of it.&rsquo;</>}
                {track === "nodejs" && <>Leo, trying to contribute something thoughtful to the architecture discussion, mentions that his CS professor described JavaScript as a toy language not designed for production scale. The room goes quiet in a way that is different from thinking. Priya sets down her coffee cup. Leo realizes this was the wrong thing to say in this room.</>}
              </>}
            </StoryCard>

            <SWEConversationScene
              track={track}
              lines={CS_DIALOGUES.s03[track].lines}
              mentorName={CS_DIALOGUES.s03[track].mentorName}
              mentorRole={CS_DIALOGUES.s03[track].mentorRole}
              mentorColor={CS_DIALOGUES.s03[track].mentorColor}
            />

            <SWEAvatar
              name={level === 'advanced' ? ADV.s03[track].b2.name : (track === 'python' ? meta.mentor : track === 'java' ? 'Suresh' : 'Jordan')}
              role={level === 'advanced' ? ADV.s03[track].b2.role : (track === 'python' ? meta.mentorRole : track === 'java' ? 'Principal Architect' : 'Frontend Engineer')}
              color={level === 'advanced' ? ADV.s03[track].b2.color : (track === 'python' ? meta.mentorColor : track === 'java' ? '#2563EB' : '#65A30D')}
              conceptId="swe-m1-ecosystem"
              content={level === 'advanced' ? <>&ldquo;{ADV.s03[track].b2.content}&rdquo;</> :
                track === 'python' ? <>&ldquo;Dev, performance is one factor. Aisha, what other aspects of our development and operations would a language change impact, beyond just execution speed?&rdquo;</> :
                track === 'java' ? <>&ldquo;Vikram, this isn&apos;t &lsquo;boilerplate.&rsquo; This is a carefully constructed domain model. What problem do you think these abstractions are trying to solve in a financial system like ours?&rdquo;</> :
                <>&ldquo;Dude, your professor must be living in the past! Modern JS is awesome. We&apos;ve got TypeScript, React, Next.js, Webpack... the tooling is incredible!&rdquo;</>
              }
              expandedContent={level === 'advanced' ? <>&ldquo;{ADV.s03[track].b2.expanded}&rdquo;</> :
                track === 'python' ? <>&ldquo;Think beyond the immediate speed gains. Consider our current team&apos;s skillset, the availability of libraries for data processing in Rust, debugging tools, and the long-term maintainability. What happens when we need to hire? Is the performance gain worth the potential increase in complexity and operational overhead?&rdquo;</> :
                track === 'java' ? <>&ldquo;In Finova, we handle billions. Type safety, explicit contracts, and clear separation of concerns aren&apos;t luxuries; they&apos;re necessities for correctness and maintainability over decades. These patterns protect us from runtime errors and allow for robust testing. They&apos;re an investment in stability, not a hindrance.&rdquo;</> :
                <>&ldquo;I mean, look at all the frameworks and libraries! We can build anything from real-time chat to complex APIs. And with TypeScript, we get all the type safety benefits that Java folks brag about. Plus, it&apos;s constantly evolving, way more exciting than those old, rigid languages.&rdquo;</>
              }
              question={level === 'advanced' ? ADV.s03[track].b2.question :
                track === 'python' ? 'Riya encourages Aisha to consider the broader implications of adopting Rust. What is a significant non-technical factor in evaluating a new language for a core system?' :
                track === 'java' ? 'Suresh explains the rationale behind complex Java patterns. What is the primary benefit of extensive use of interfaces and abstract classes in a large enterprise application?' :
                'Jordan highlights modern JavaScript\'s ecosystem. What is a key benefit of the extensive tooling and frameworks available in the Node.js ecosystem?'
              }
              options={level === 'advanced' ? ADV.s03[track].b2.opts :
                track === 'python' ? [
                  { text: 'The ability to integrate seamlessly with existing cloud provider services, ensuring optimal infrastructure utilization.', correct: false, feedback: 'While cloud integration is important, it\'s often more about SDKs and APIs, not a primary non-technical factor in language choice itself.' },
                  { text: 'The size and activity of the language\'s community, which influences documentation, support, and available libraries.', correct: true, feedback: 'A strong community and rich ecosystem are crucial for long-term project health, developer support, and access to pre-built solutions.' },
                  { text: 'The maximum number of concurrent users the application can support before requiring horizontal scaling.', correct: false, feedback: 'Concurrency is a technical performance metric. Riya\'s question is about non-technical aspects like team skill sets and community support.' },
                ] :
                track === 'java' ? [
                  { text: 'They enable faster development by reducing the amount of code that needs to be written for new features.', correct: false, feedback: 'While some patterns can streamline development, heavy abstraction often increases initial development time, prioritizing maintainability.' },
                  { text: 'They promote loose coupling and high cohesion, making the system more modular, testable, and adaptable to change.', correct: true, feedback: 'Interfaces and abstractions enable components to interact without knowing concrete implementations, improving flexibility and testability.' },
                  { text: 'They are a historical artifact from older Java versions and are less relevant in modern, functional programming paradigms.', correct: false, feedback: 'These patterns remain highly relevant in modern Java development, especially for large-scale, long-lived enterprise applications.' },
                ] : [
                  { text: 'They significantly reduce the need for writing any custom code, allowing developers to build applications entirely from pre-built components.', correct: false, feedback: 'While frameworks provide components, developers still write significant custom code. The benefit is accelerated development, not complete automation.' },
                  { text: 'They accelerate development, provide standardized solutions, and enhance developer experience through features like hot-reloading and transpilation.', correct: true, feedback: 'Frameworks and tools streamline common tasks, enforce best practices, and offer features that boost productivity and improve code quality.' },
                  { text: 'They eliminate the need for understanding fundamental JavaScript concepts, as the frameworks abstract away all complexity.', correct: false, feedback: 'Frameworks build on fundamentals. A strong understanding of core JavaScript is essential to use frameworks effectively and debug issues.' },
                ]
              }
            />


            {track === 'python' && (<>
              {para(<>Riya&apos;s question is the right one. Python is not fast at CPU computation — compared to Java or C++, CPython is slow. But for most software engineering work, the bottleneck is <strong>network I/O and database queries</strong>, not raw CPU speed. A data pipeline that spends 90% of its time waiting for a database to respond is not going to run meaningfully faster in a compiled language.</>)}
              {para(<>Python&apos;s real power is its ecosystem. The combination of <strong>pandas</strong> and <strong>NumPy</strong> for data, <strong>scikit-learn</strong> and <strong>PyTorch</strong> for ML, and <strong>FastAPI</strong> for web APIs means that Python is often the <em>only</em> language a data-heavy team needs. Instagram, Dropbox, and Spotify run Python backends at scale. The bottleneck is almost never the language.</>)}
            </>)}
            {track === 'java' && (<>
              {para(<>Kavya&apos;s point is about <em>what happens at scale</em>. Java is 30 years old and still powers the backend of most banks, telecoms, and large e-commerce systems. This is not inertia — it is intentional. Java&apos;s <strong>strong type system</strong> catches an entire class of bugs before they reach production. When a refactor touches 200 files, the compiler tells you every place that broke.</>)}
              {para(<>The <strong>Spring ecosystem</strong> is what most Java backend engineers use in production. Spring Boot auto-configures dependency injection, web server, security, and observability — you write business logic, not plumbing. Learning Spring Boot is learning how professional Java backend development actually works at companies that have been running Java services for ten years.</>)}
            </>)}
            {track === 'nodejs' && (<>
              {para(<>Mei is right — Node.js has been production-grade backend infrastructure for over a decade. It succeeded for one reason initially: JavaScript was already everywhere. Developers who knew the frontend could write backend code without learning a new language. But Node brought something the professor didn&apos;t mention: a concurrency model that is genuinely excellent for the kind of work APIs do.</>)}
              {para(<>Node uses a <strong>single-threaded event loop</strong>. Instead of blocking a thread while waiting for a database query, Node registers a callback and moves on. When the I/O completes, the callback fires. A single Node process can handle thousands of concurrent connections without the memory overhead of thread-per-request systems. Netflix, LinkedIn, and Uber use Node for this reason.</>)}
            </>)}

            {keyBox(track === 'python' ? 'Python ecosystem by domain' : track === 'java' ? 'Java ecosystem by domain' : 'Node.js ecosystem by domain',
              track === 'python' ? [
                'Web APIs: FastAPI (modern, async), Flask (minimal), Django (batteries included)',
                'Data analysis: pandas, NumPy, Polars (the fast modern alternative to pandas)',
                'Machine learning: scikit-learn, PyTorch, TensorFlow, Hugging Face',
                'Automation & scripting: subprocess, pathlib, shutil, schedule',
                'Testing: pytest (the standard — write it from day one)',
              ] : track === 'java' ? [
                'Web APIs: Spring Boot (the industry standard), Quarkus, Micronaut',
                'Data access: Spring Data JPA, Hibernate ORM, JDBC',
                'Security: Spring Security',
                'Messaging: Kafka clients, Spring Kafka, RabbitMQ',
                'Testing: JUnit 5, Mockito, TestContainers',
              ] : [
                'Web frameworks: Express (minimal, flexible), Fastify (fast), NestJS (opinionated)',
                'Database ORMs: Prisma (TypeScript-first), Drizzle, Sequelize',
                'Real-time: Socket.io, WebSocket (ws)',
                'Testing: Jest, Vitest, Supertest',
                'Strong typing: TypeScript (strongly recommended from day one)',
              ]
            )}

            <LibraryMatcher track={track} accentColor={meta.accentColor} />

            <CodeAnatomy track={track} accentColor={meta.accentColor} />

            {pullQuote(
              track === 'python' ? 'In Python, there is almost always a library for what you need. The skill is knowing which one to trust — and when to reach for it versus writing it yourself.' :
              track === 'java' ? 'Java verbosity is a feature at scale. When six engineers are modifying the same service, explicit types and structure prevent the codebase from becoming incomprehensible.' :
              'The event loop is Node\'s superpower for I/O-heavy work. But CPU-intensive tasks block the single thread — know the difference, and know when to reach for worker threads or a separate service.'
            )}

            <TiltCard style={{ margin: '28px 0' }}><EcosystemCard track={track} accentColor={meta.accentColor} /></TiltCard>

            <PMPrincipleBox principle={
              track === 'python'
                ? 'Ecosystem literacy is a force multiplier. The engineer who knows which library to reach for — and which to avoid — ships in days what others spend weeks building from scratch.'
                : track === 'java'
                ? 'In enterprise Java, opinionated frameworks are a feature, not a constraint. Spring Boot conventions carry ten years of hard-won lessons about how to build systems that survive team turnover.'
                : 'The JavaScript ecosystem rewards breadth of awareness, not just depth of skill. Knowing that a faster alternative exists is often worth more than mastering the slower one you already know.'
            } />

            <ApplyItBox prompt={
              track === 'python'
                ? 'Pick a data task you are working on. Search PyPI for a library that handles it. Check: how many weekly downloads does it have, when was it last updated, and does it have a test suite? These three signals tell you whether to trust a library.'
                : track === 'java'
                ? 'Find one Spring Boot annotation you use but have not looked up (like @RestController or @Transactional). Read the official Spring docs for it. Write one sentence explaining what it actually does at runtime — not just what you assumed.'
                : 'Identify one npm package in your current project. Check its npm page: weekly downloads, last publish date, number of open issues. Now look at the GitHub repo if it exists. Is this dependency well-maintained? Would you add it today?'
            } />

            <QuizEngine conceptId="swe-m1-ecosystem" conceptName="Language Ecosystem" moduleContext={meta.moduleContext}
              staticQuiz={track === 'python' ? {
                conceptId: 'swe-m1-ecosystem',
                question: 'A Python data pipeline is slow under load. A colleague suggests rewriting it in Rust. What is the stronger first investigation?',
                options: ['A. Profile where the time is actually going — it is likely I/O or an inefficient query, not Python speed', 'B. Python is simply too slow for production pipelines and Rust is the right call', 'C. Switch from pandas to NumPy — NumPy is optimised for large datasets'],
                correctIndex: 0,
                explanation: 'Most pipeline slowness comes from blocking I/O, N+1 queries, or missing indexes — not the language runtime. Profile before rewriting. Instagram and Dropbox run Python backends at scale. Measure first.',
              } : track === 'java' ? {
                conceptId: 'swe-m1-ecosystem',
                question: 'A new team member asks why the Java codebase uses explicit interfaces everywhere instead of just concrete classes. What is the most accurate explanation?',
                options: ['A. Interfaces let multiple implementations be swapped without changing calling code — enabling testing and extensibility', 'B. Java requires interfaces for all objects by language specification', 'C. Interfaces improve runtime performance because the JVM optimises them specially'],
                correctIndex: 0,
                explanation: 'Programming to an interface is a core Java design principle. It enables mocking in tests, multiple implementations, and reduces coupling between components. This is a deliberate design choice, not a language requirement.',
              } : {
                conceptId: 'swe-m1-ecosystem',
                question: 'A Node.js API handles 10,000 req/s of simple JSON queries fine but slows dramatically when generating a large PDF report. Most likely cause?',
                options: ['A. PDF generation is CPU-intensive and blocks Node\'s single-threaded event loop', 'B. Node cannot handle more than 10,000 requests — this is an architectural limit', 'C. The PDF library is not compatible with the Node version'],
                correctIndex: 0,
                explanation: 'Node\'s event loop handles I/O concurrency well but is blocked by CPU-heavy work. PDF generation is CPU-bound. The fix is offloading to a worker thread (worker_threads module) or a dedicated microservice.',
              }}
            />
          </ChapterSection>

          {/* ── SECTION 04 ───────────────────────────────── */}
          <ChapterSection id="swe-m1-reading-errors" num="04" accentRgb={ACCENT_RGB}>
            {chLabel('Debugging Mindset')}
            {h2(<>Reading errors like a senior engineer</>)}

            <ProtagonistAvatar
              name={track === 'python' ? 'Aisha' : track === 'java' ? 'Vikram' : 'Leo'}
              role={meta.protagonistRole}
              color={meta.accentColor}
              content={level === 'advanced' ? ADV.s04[track].open : <>
                {track === 'python' && <>If a bug is dropping data there has to be some kind of error message. My code always throws an exception if something goes wrong. The logs should tell me exactly what happened.</>}
                {track === 'java' && <>My validation logic is thorough. I covered null inputs in the unit tests. If there is a NullPointerException it is probably a malformed request from the test harness, something straightforward to fix.</>}
                {track === 'nodejs' && <>My resend endpoint is simple — it fetches the notification record and calls the send function once. If users are getting duplicates it is probably a network retry from the delivery service, not anything wrong in my code.</>}
              </>}
            />

            <StoryCard protagonist={meta.protagonist.split(' ')[0]} accentColor={meta.accentColor}>
              {level === 'advanced' ? ADV.s04[track].story : <>
                {track === "python" && <>Priya paces near the whiteboard, voice tight. Three days. Client Gamma is missing three days of revenue data with no errors thrown, no warnings logged, just a quiet absence in the numbers. Aisha stares at the pipeline logs: page after page of green SUCCESS checkmarks. Nothing red. Nothing wrong. Sam suggests sprinkling print statements everywhere until something shows up. Aisha looks at the volume of log output and feels completely lost.</>}
                {track === "java" && <>A real-world staging payment triggers against Vikram&apos;s new endpoint. The amount is significant. The call hangs for a beat, then fires a NullPointerException into the logs. The staging dashboard returns PAYMENT FAILED in red. Kavya, still calm: &lsquo;I need the exact input payload that caused this. Every field, every value.&rsquo; Suresh appears in the doorway. His expression does not communicate that this is fine.</>}
                {track === "nodejs" && <>The Slack support channel fills up fast. Got this notification three times. Why did I get two identical emails. Leo opens his endpoint logs. No errors. Just a pattern of Notification sent followed immediately by another Notification sent for the same notification ID. Jordan: &lsquo;Maybe wrap it all in Promise.all, or add a setTimeout zero to debounce it?&rsquo; Mei reads the logs over Leo&apos;s shoulder and does not say anything for a long moment.</>}
              </>}
            </StoryCard>

            <SWEConversationScene
              track={track}
              lines={CS_DIALOGUES.s04[track].lines}
              mentorName={CS_DIALOGUES.s04[track].mentorName}
              mentorRole={CS_DIALOGUES.s04[track].mentorRole}
              mentorColor={CS_DIALOGUES.s04[track].mentorColor}
            />

            <SWEAvatar
              name={level === 'advanced' ? ADV.s04[track].b2.name : (track === 'python' ? 'Priya' : track === 'java' ? 'Suresh' : meta.mentor)}
              role={level === 'advanced' ? ADV.s04[track].b2.role : (track === 'python' ? 'Engineering Manager' : track === 'java' ? 'Principal Architect' : meta.mentorRole)}
              color={level === 'advanced' ? ADV.s04[track].b2.color : (track === 'python' ? '#7C3AED' : track === 'java' ? '#2563EB' : meta.mentorColor)}
              conceptId="swe-m1-debugging"
              content={level === 'advanced' ? <>&ldquo;{ADV.s04[track].b2.content}&rdquo;</> :
                track === 'python' ? <>&ldquo;Aisha, this is impacting a key client. We need to isolate this bug quickly and understand why it happened. How are you approaching this systematically, not just reactively?&rdquo;</> :
                track === 'java' ? <>&ldquo;A <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>NullPointerException</code> in staging for a payment endpoint? This is precisely why we champion type safety. How did this null bypass our validation, Vikram?&rdquo;</> :
                <>&ldquo;Leo, duplicate notifications usually indicate a race condition or an idempotent function being called multiple times. Walk me through the exact sequence of asynchronous operations in your <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>resend notification</code> logic.&rdquo;</>
              }
              expandedContent={level === 'advanced' ? <>&ldquo;{ADV.s04[track].b2.expanded}&rdquo;</> :
                track === 'python' ? <>&ldquo;I need to know the root cause so we can prevent this from ever happening again. Are you looking at the input data for the affected client? Comparing logs from successful runs with the failed ones? We need a clear hypothesis and a plan to validate it, not just random poking around.&rdquo;</> :
                track === 'java' ? <>&ldquo;This is a critical failure. Did we not enforce non-null constraints at the API gateway? Or was an optional field not handled gracefully? Every null in a financial system represents an unhandled state, a potential vulnerability, or a data loss event. This is unacceptable.&rdquo;</> :
                <>&ldquo;We need to understand where the <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: '3px' }}>await</code> keywords are, which external services are called, and if there are any callbacks or events that might trigger multiple executions. Is the notification ID being checked for uniqueness before sending? An asynchronous bug requires a meticulous walkthrough of the control flow.&rdquo;</>
              }
              question={level === 'advanced' ? ADV.s04[track].b2.question :
                track === 'python' ? 'Priya emphasizes a systematic approach to debugging. What is the most effective initial strategy for Aisha to narrow down the source of a data-dropping bug?' :
                track === 'java' ? 'Suresh is frustrated by the NullPointerException. What is a best practice for preventing NullPointerExceptions in Java, especially with potentially absent data?' :
                'Mei asks Leo to trace the async flow. What is the most effective approach to identify a race condition causing duplicate notifications in Node.js?'
              }
              options={level === 'advanced' ? ADV.s04[track].b2.opts :
                track === 'python' ? [
                  { text: 'Immediately checking all external API calls made by the pipeline, assuming the issue lies outside of the internal logic.', correct: false, feedback: 'While external APIs can be a source, starting with them without internal context is not systematic; it\'s a specific guess.' },
                  { text: 'Re-running the entire pipeline multiple times in a staging environment to observe if the bug consistently reproduces.', correct: false, feedback: 'Reproduction is key, but re-running the entire pipeline is often too broad. Isolating the smallest reproducible case is better.' },
                  { text: 'Analyzing the logs for specific error messages or unexpected warnings around the time of the data drop, focusing on affected client IDs.', correct: true, feedback: 'Logs are the primary historical record. Filtering for errors, warnings, and specific identifiers helps pinpoint the problematic area.' },
                ] :
                track === 'java' ? [
                  { text: 'Relying on the garbage collector to automatically handle null references by reclaiming their memory.', correct: false, feedback: 'The garbage collector handles memory deallocation, not the prevention or handling of null references themselves.' },
                  { text: 'Using Optional for values that might legitimately be absent and performing explicit null checks where Optional is not applicable.', correct: true, feedback: 'Using Optional forces developers to explicitly handle the presence or absence of a value, and explicit null checks are crucial for other scenarios.' },
                  { text: 'Ensuring all objects are initialized with default values, even if those values are logically empty or irrelevant.', correct: false, feedback: 'Initializing with arbitrary defaults can mask the true absence of data and lead to incorrect business logic, which is often worse than an NPE.' },
                ] : [
                  { text: 'Adding console.log statements with timestamps at critical asynchronous points to observe the exact order of execution.', correct: true, feedback: 'Logging with timestamps helps visualize the actual sequence of events in an async flow, revealing if operations are executing in an unexpected order.' },
                  { text: 'Rewriting all asynchronous functions to synchronous ones to eliminate any potential for race conditions entirely.', correct: false, feedback: 'Rewriting async to sync is often impractical and can block the event loop, severely degrading performance in a Node.js application.' },
                  { text: 'Increasing the server\'s CPU and memory resources, assuming the duplicates are caused by system overload.', correct: false, feedback: 'Resource issues might cause delays, but they don\'t typically create logical errors like duplicate notifications. This is a symptom, not the cause.' },
                ]
              }
            />


            {para(<>The single largest productivity gap between a junior and senior engineer is not syntax knowledge. It is how fast they go from &ldquo;something is broken&rdquo; to &ldquo;I know exactly what is broken and why.&rdquo; Senior engineers are fast at debugging not because they have seen every error — it is because they read errors before doing anything else.</>)}

            {h2(<>How to read a {track === 'java' ? 'stack trace' : track === 'python' ? 'traceback' : 'Node.js error'}</>)}

            {track === 'python' && (<>
              {para(<>Python tracebacks read <strong>bottom to top</strong>. The last line is the actual error — error type and message. The lines above it are the call chain. The most useful line is usually the last one that points to <em>your</em> file, not a library you imported.</>)}
              {keyBox('Reading a Python traceback', [
                '"Traceback (most recent call last):" — always the header, ignore it',
                'Lines with your file path — these are where YOUR code is involved',
                'Lines with site-packages/ — library code, usually not the root cause',
                'Last line = error type + message: KeyError: \'value\' — start here',
              ])}
            </>)}
            {track === 'java' && (<>
              {para(<>Java stack traces are verbose but information-rich. The first line names the exception and its message — that is your starting point. Everything below is the call chain. The rule Kavya used: <strong>find the first line that starts with your package</strong>, not a library package. That is your code. That is where you start.</>)}
              {keyBox('Reading a Java stack trace', [
                'Line 1: exception type + message — this is what broke and how',
                'at com.yourpackage.YourClass (YourClass.java:42) — this is your code',
                'at java.* or org.springframework.* — library code, skip these first',
                '"Caused by:" further down means a wrapped exception — read that section too',
              ])}
            </>)}
            {track === 'nodejs' && (<>
              {para(<>Node.js errors have three parts: an error type (TypeError, ReferenceError), a message describing what broke, and a stack trace showing the call chain. The rule Mei teaches: <strong>find the first line that points to a file in your project</strong>, not in node_modules. That is where the crash started.</>)}
              {keyBox('Reading a Node.js error', [
                'Line 1: error type + message — read this first, always',
                'Find the first line pointing to YOUR project file (not node_modules/)',
                'That file and line number is where the problem started',
                'For async errors: look for "at process.nextTick" or "at Promise" — async stack frames',
              ])}
            </>)}

            <TracebackReader track={track} accentColor={meta.accentColor} />

            <BugHunter track={track} accentColor={meta.accentColor} />

            {h2(<>The debugging loop</>)}
            {para(<>Professional debugging is hypothesis-driven. You read the error, form a theory about what caused it at that specific line, test that theory with a print statement or breakpoint, and revise. Jumping straight to Google before doing this step adds noise and slows you down.</>)}

            {keyBox('The debugging loop', [
              '1. Read the error fully — type, message, file, line number',
              '2. Form a hypothesis: what condition at that exact line causes this exact error?',
              '3. Verify your hypothesis with a print/log or breakpoint',
              '4. If wrong, revise the hypothesis — do not change random things hoping it fixes',
              '5. Once fixed, understand why — this is the step where learning happens',
            ])}

            <TiltCard style={{ margin: '28px 0' }}><StackTraceCard track={track} accentColor={meta.accentColor} /></TiltCard>

            {pullQuote('The engineers who ship reliable code fastest are not the ones who never have bugs. They are the ones who understand errors faster when bugs appear.')}

            <PMPrincipleBox principle={
              track === 'python'
                ? 'Systematic debugging is a professional habit. Every senior engineer has a method: read the error, form a hypothesis, test it. Skipping any step turns debugging into luck.'
                : track === 'java'
                ? 'Java stack traces are precise. They tell you the class, method, and line. Reading them fluently — not skimming — is the difference between a one-hour debug and a one-day debug.'
                : 'In async code, the error location and the error cause are often different places. Train yourself to trace back through the call stack, not just fix the line that threw.'
            } />

            <ApplyItBox prompt={
              track === 'python'
                ? 'Open your terminal and run: python3 -c "x = None; print(x.upper())". Read the traceback. Before searching anything, identify: (1) the error type on the last line, (2) the line number, (3) what value x has and why .upper() fails on it. Then fix it.'
                : track === 'java'
                ? 'Write a Java main method that tries to call .length() on a String variable you initialise to null. Compile and run it. Identify in the stack trace: (1) the exception type, (2) the first line pointing to your code, (3) what null-check you would add to prevent this.'
                : 'Create a file: const obj = undefined; console.log(obj.name); Run it with node. Before searching: identify (1) the error type, (2) the line in the stack pointing to your file, (3) whether a guard like obj?.name would prevent the crash.'
            } />

            <QuizEngine conceptId="swe-m1-debugging" conceptName="Debugging Mindset" moduleContext={meta.moduleContext}
              staticQuiz={{
                conceptId: 'swe-m1-debugging',
                question: 'A junior engineer gets an error they don\'t recognise. They immediately copy it into Google and paste a Stack Overflow fix. It doesn\'t work. What should they have done first?',
                options: ['A. Read the full error including file name and line number, then form a hypothesis before searching', 'B. Ask a senior engineer immediately — junior engineers shouldn\'t debug alone', 'C. Delete the code that caused the error and rewrite it from scratch'],
                correctIndex: 0,
                explanation: 'The error message plus file and line almost always point to the root cause. Hypothesis-driven debugging is faster than pattern-matching from search results. Senior engineers expect you to have understood the error before escalating.',
              }}
            />

            <NextChapterTeaser text="In Pre-Read 02, you will learn the core language fundamentals — variables, data types, control flow, and the design patterns professional engineers use to write readable, maintainable code." />
          </ChapterSection>

        </div>{/* end main content */}

        {/* Right sidebar */}
        <aside className="right-col" style={{ position: 'sticky', top: '57px', height: 'fit-content', paddingTop: '0', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          <div style={{ ...cardStyle, borderTop: `3px solid ${meta.accentColor}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '2px' }}>Level</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: xpLevel.color, whiteSpace: 'nowrap' as const }}>{xpLevel.label}</div>
              </div>
              <div style={{ textAlign: 'right' as const, position: 'relative', overflow: 'visible' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '2px' }}>XP</div>
                <motion.div key={totalXP} animate={{ scale: [1.12, 1] }} transition={{ duration: 0.25 }} style={{ fontSize: '22px', fontWeight: 900, color: meta.accentColor, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{totalXP}</motion.div>
                <AnimatePresence>{showGain && (<motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -20 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} style={{ position: 'absolute', right: 0, top: '-6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 800, color: meta.accentColor, pointerEvents: 'none', whiteSpace: 'nowrap' as const }}>+{gainAmt}</motion.div>)}</AnimatePresence>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              {[{ label: 'Reading', val: readingXP, color: meta.accentColor }, { label: 'Quizzes', val: quizXP, color: '#0D7A5A' }].map(b => (
                <div key={b.label} style={{ flex: 1, padding: '5px 8px', borderRadius: '5px', background: 'var(--ed-cream)', border: '1px solid var(--ed-rule)' }}>
                  <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ed-ink3)', marginBottom: '2px', textTransform: 'uppercase' as const }}>{b.label}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: b.color }}>{b.val} xp</div>
                </div>
              ))}
            </div>
            {nextLevel ? (<>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{levelPct}% to {nextLevel.label}</span>
                <span style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace" }}>{nextLevel.min - totalXP} xp</span>
              </div>
              <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}><motion.div animate={{ width: `${levelPct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: meta.accentColor, borderRadius: '2px' }} /></div>
            </>) : <div style={{ fontSize: '11px', color: meta.accentColor, fontWeight: 700 }}>✦ Max level reached</div>}
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ed-ink2)' }}>Module Progress</div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700, color: meta.accentColor }}>{progressPct}%</span>
            </div>
            <div style={{ height: '4px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}><motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: meta.accentColor, borderRadius: '2px' }} /></div>
            <div style={{ marginTop: '6px', fontSize: '10px', color: 'var(--ed-ink3)' }}>{completedSections.size} of {SECTIONS.length} parts · {MODULE_TIME}</div>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)' }}>Badges</div>
              <div style={{ fontSize: '10px', color: 'var(--ed-ink3)' }}>{ACHIEVEMENTS.filter(a => completedSections.has(a.id)).length}/{ACHIEVEMENTS.length}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', padding: '2px' }}>
              {ACHIEVEMENTS.map(a => {
                const unlocked = completedSections.has(a.id);
                return (
                  <div key={a.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                    <motion.div whileHover={{ scale: 1.08 }} title={unlocked ? `${a.label}: ${a.desc}` : 'Locked'}
                      style={{ width: '36px', height: '36px', borderRadius: '8px', background: unlocked ? `rgba(${ACCENT_RGB},0.12)` : 'var(--ed-cream)', border: `1px solid ${unlocked ? `rgba(${ACCENT_RGB},0.3)` : 'var(--ed-rule)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', filter: unlocked ? 'none' : 'grayscale(1) opacity(0.3)', transition: 'all 0.3s', cursor: 'default' }}>
                      {a.icon}
                    </motion.div>
                    <div style={{ fontSize: '8px', color: unlocked ? 'var(--ed-ink3)' : 'transparent', fontWeight: 600, textAlign: 'center' as const, maxWidth: '40px', lineHeight: 1.2, wordBreak: 'break-word' as const }}>{a.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ ...cardStyle, borderLeft: `3px solid ${meta.accentColor}` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--ed-ink3)', marginBottom: '10px' }}>Concept Mastery</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {CONCEPT_DETAILS.map(c => {
                const pct = Math.round((store.conceptStates[c.id]?.pKnow ?? 0) * 100);
                return (
                  <div key={c.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--ed-ink2)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{c.label}</span>
                      <span style={{ fontSize: '10px', color: pct > 0 ? c.color : 'var(--ed-ink3)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, flexShrink: 0 }}>{pct}%</span>
                    </div>
                    <div style={{ height: '3px', background: 'var(--ed-rule)', borderRadius: '2px', overflow: 'hidden' }}><motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: c.color, borderRadius: '2px' }} /></div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '10px', fontSize: '10px', color: 'var(--ed-ink3)', lineHeight: 1.6 }}>Complete quizzes to raise mastery scores</div>
          </div>

          {store.streakDays > 0 && (
            <div style={{ ...cardStyle, borderLeft: '3px solid #C85A40' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <motion.span animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ fontSize: '20px', flexShrink: 0 }}>🔥</motion.span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#C85A40', lineHeight: 1 }}>{store.streakDays} day{store.streakDays !== 1 ? 's' : ''}</div>
                  <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', marginTop: '2px' }}>learning streak</div>
                </div>
              </div>
            </div>
          )}

        </aside>

      </div>
      </div>
    </div>
  );
}

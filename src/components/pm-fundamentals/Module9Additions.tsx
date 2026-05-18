'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── GIT FOR PMs ──────────────────────────────────────────────────────────────
// Every sprint day you'll hear: "I raised a PR", "that's on a separate branch",
// "the build failed", "we merged to main." PMs who don't understand git can't
// unblock engineers or assess delivery risk.
// This tool shows a real EdSpark sprint — 3 engineers, 3 features, 1 main branch.
// Learner steps through the git flow and builds the vocabulary.

const GIT_STEPS = [
  {
    id: 'main',
    title: 'The main branch',
    desc: 'This is what\'s live in production right now. Every commit on main is something your users can see.',
    action: null,
    state: 'main-only',
    pmLesson: 'When engineers say "it\'s merged to main" — it\'s live. Or very close to live. This matters when a stakeholder asks "is it shipped yet?"',
  },
  {
    id: 'branch',
    title: 'Dev creates a feature branch',
    desc: 'Dev needs to add the session search feature. He creates a branch — a parallel copy of the code — so his work doesn\'t affect what\'s live.',
    action: 'git checkout -b feature/session-search',
    state: 'one-branch',
    pmLesson: 'A branch is a safe workspace. Engineers can build and experiment without breaking the live product. You can have 10 engineers all branching from main simultaneously.',
  },
  {
    id: 'commits',
    title: 'Dev makes commits',
    desc: 'Dev writes code. After each meaningful unit of work, he commits — saves a named snapshot. Three commits to build session search.',
    action: 'git commit -m "Add search input to recordings list"\ngit commit -m "Add date filter API call"\ngit commit -m "Add results display and empty state"',
    state: 'commits',
    pmLesson: 'Each commit has a message. Good commit messages tell you WHAT changed. When you look at what shipped in a sprint, commits are the record. Bad commit messages ("fix stuff", "wip") are a PM\'s enemy — they make post-mortems impossible.',
  },
  {
    id: 'pr',
    title: 'Dev opens a Pull Request',
    desc: 'Dev wants to merge his branch into main. First, he opens a PR — a formal request asking his teammates to review the code before it goes live.',
    action: 'gh pr create --title "Add session search by date" --body "Closes #247\n\nAdds search input + date filter to recordings list.\nTested on Chrome, Safari, Edge."',
    state: 'pr-open',
    pmLesson: 'The PR is where code review happens. As PM you should be able to look at the PR description and understand: what changed, why, and what was tested. If you can\'t — the description is incomplete. You can ask.',
  },
  {
    id: 'review',
    title: 'Maya reviews and comments',
    desc: 'Maya reads the code and leaves a comment: "The empty state copy says \'No results\' — shouldn\'t it say \'No recordings found for this date\'?" Dev updates it.',
    action: '// Maya comments:\n// "Empty state copy should be specific to the search context"\n\n// Dev responds and fixes:\ngit commit -m "Update empty state copy per Maya\'s review"',
    state: 'review',
    pmLesson: 'The review process is where your spec decisions get implemented. If the PM spec said "empty state: \'No recordings found\'" — this is where that gets enforced. If your spec was silent, engineers make the call.',
  },
  {
    id: 'merge',
    title: 'PR approved — merged to main',
    desc: 'After Maya approves, the branch merges into main. The CI pipeline runs (automated tests). All green. The session search feature is now in production.',
    action: 'git merge feature/session-search\n// CI pipeline: 42 tests passed ✓\n// Deployed to production',
    state: 'merged',
    pmLesson: 'Once merged, the feature is live for all users. This is when you start measuring whether your hypothesis was right. The loop closes: spec → build → ship → measure.',
  },
];

const BRANCH_COLORS = {
  main: '#22C55E',
  feature: '#6366F1',
  maya: '#E07A5F',
};

export function GitForPMsViz() {
  const [step, setStep] = useState(0);
  const current = GIT_STEPS[step];

  return (
    <div style={{ margin: '36px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ padding: '4px 12px', borderRadius: '8px', background: '#1F2937', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '0.14em', boxShadow: '0 3px 0 #111827' }}>
          GIT FOR PMs
        </div>
        <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', fontWeight: 600 }}>Step through a real EdSpark sprint — learn the vocabulary engineers use every day</div>
      </div>

      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--ed-rule)', boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}>
        {/* Progress steps */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--ed-rule)', overflowX: 'auto' as const, background: 'var(--ed-card)' }}>
          {GIT_STEPS.map((s, i) => (
            <button key={s.id} onClick={() => setStep(i)}
              style={{ padding: '10px 14px', border: 'none', cursor: 'pointer', flexShrink: 0, borderRight: i < GIT_STEPS.length - 1 ? '1px solid var(--ed-rule)' : 'none', background: step === i ? '#1F2937' : 'var(--ed-card)', transition: 'background 0.2s' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: step === i ? '#22C55E' : step > i ? '#94A3B8' : 'var(--ed-ink3)', letterSpacing: '0.1em', marginBottom: '3px' }}>
                {step > i ? '✓' : `0${i + 1}`}
              </div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: step === i ? '#fff' : 'var(--ed-ink3)', whiteSpace: 'nowrap' as const }}>{s.title.split(' ').slice(0, 3).join(' ')}</div>
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'start', background: 'var(--ed-card)' }}>
          {/* Left: visual branch diagram */}
          <div style={{ padding: '24px', borderRight: '1px solid var(--ed-rule)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: 'var(--ed-ink3)', letterSpacing: '0.12em', marginBottom: '16px' }}>
              REPOSITORY STATE
            </div>

            {/* Branch diagram SVG */}
            <svg viewBox="0 0 280 160" style={{ width: '100%', maxHeight: '160px' }}>
              {/* Main branch line */}
              <line x1="20" y1="40" x2="260" y2="40" stroke={BRANCH_COLORS.main} strokeWidth="3" strokeLinecap="round" />
              <text x="8" y="36" style={{ fontSize: '9px', fill: BRANCH_COLORS.main, fontFamily: 'JetBrains Mono, monospace', fontWeight: 800 }}>main</text>

              {/* Main commits */}
              {[40, 80].map((x, i) => (
                <g key={i}>
                  <circle cx={x} cy="40" r="6" fill={BRANCH_COLORS.main} />
                  <text x={x} y="58" textAnchor="middle" style={{ fontSize: '7px', fill: 'var(--ed-ink3)', fontFamily: 'monospace' }}>
                    {i === 0 ? 'v2.4.1' : 'v2.4.2'}
                  </text>
                </g>
              ))}

              {/* Feature branch */}
              {step >= 1 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <line x1="80" y1="40" x2="80" y2="100" stroke={BRANCH_COLORS.feature} strokeWidth="2" strokeDasharray={step >= 5 ? '0' : '5 3'} />
                  <line x1="80" y1="100" x2={step >= 2 ? (step >= 3 ? 220 : 140) : 100} y2="100" stroke={BRANCH_COLORS.feature} strokeWidth="3" strokeLinecap="round" />
                  <text x="88" y="115" style={{ fontSize: '8px', fill: BRANCH_COLORS.feature, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>feature/session-search</text>
                </motion.g>
              )}

              {/* Feature commits */}
              {step >= 2 && [120, 160, 200].slice(0, step - 1).map((x, i) => (
                <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ transformOrigin: `${x}px 100px` }}>
                  <circle cx={x} cy="100" r="5" fill={BRANCH_COLORS.feature} />
                  <text x={x} y="90" textAnchor="middle" style={{ fontSize: '7px', fill: BRANCH_COLORS.feature, fontFamily: 'monospace' }}>
                    {['search', 'filter', 'display'][i]}
                  </text>
                </motion.g>
              ))}

              {/* PR indicator */}
              {step >= 3 && step < 5 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <rect x="220" y="72" width="32" height="16" rx="4" fill="#F59E0B" />
                  <text x="236" y="83" textAnchor="middle" style={{ fontSize: '7px', fill: '#fff', fontFamily: 'monospace', fontWeight: 800 }}>PR</text>
                </motion.g>
              )}

              {/* Merge */}
              {step >= 5 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <line x1="220" y1="100" x2="240" y2="40" stroke={BRANCH_COLORS.main} strokeWidth="2" strokeDasharray="4 3" />
                  <circle cx="240" cy="40" r="7" fill={BRANCH_COLORS.main} />
                  <text x="240" y="43" textAnchor="middle" style={{ fontSize: '8px', fill: '#fff', fontFamily: 'monospace', fontWeight: 800 }}>✓</text>
                  <text x="240" y="28" textAnchor="middle" style={{ fontSize: '7px', fill: BRANCH_COLORS.main, fontFamily: 'monospace' }}>merged</text>
                </motion.g>
              )}
            </svg>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              {[{ color: BRANCH_COLORS.main, label: 'main (live)' }, { color: BRANCH_COLORS.feature, label: 'feature branch' }].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '3px', borderRadius: '2px', background: l.color }} />
                  <div style={{ fontSize: '10px', color: 'var(--ed-ink3)', fontFamily: 'monospace' }}>{l.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: step detail */}
          <div style={{ padding: '24px' }}>
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.25 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 800, color: '#22C55E', letterSpacing: '0.14em', marginBottom: '8px' }}>
                  STEP {step + 1} / {GIT_STEPS.length}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ed-ink)', marginBottom: '10px', lineHeight: 1.3 }}>{current.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7, marginBottom: '14px' }}>{current.desc}</div>

                {current.action && (
                  <div style={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '14px' }}>
                    <div style={{ padding: '6px 12px', background: '#1E1E2E', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>TERMINAL</div>
                    </div>
                    <pre style={{ margin: 0, padding: '12px', background: '#1E1E2E', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', lineHeight: 1.7, color: '#E2E8F0', overflowX: 'auto' as const }}>
                      {current.action}
                    </pre>
                  </div>
                )}

                <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderLeft: '4px solid #22C55E' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '8px', fontWeight: 800, color: '#22C55E', letterSpacing: '0.12em', marginBottom: '6px' }}>WHY THIS MATTERS FOR PMs</div>
                  <div style={{ fontSize: '12px', color: 'var(--ed-ink2)', lineHeight: 1.65 }}>{current.pmLesson}</div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)}
                  style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, background: 'var(--ed-card)', color: 'var(--ed-ink3)', border: '1px solid var(--ed-rule)' }}>
                  ← back
                </button>
              )}
              {step < GIT_STEPS.length - 1 && (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setStep(s => s + 1)}
                  style={{ padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 800, background: '#1F2937', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }}>
                  Next: {GIT_STEPS[step + 1]?.title.split(' ').slice(0, 3).join(' ')} →
                </motion.button>
              )}
              {step === GIT_STEPS.length - 1 && (
                <div style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', fontSize: '12px', fontWeight: 700, color: '#22C55E' }}>
                  ✓ Git workflow complete
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(31,41,55,0.07)', border: '1px solid rgba(31,41,55,0.15)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: 'var(--ed-ink)' }}>The PM vocabulary you need:</strong> branch (safe workspace), commit (named save), PR (code review request), merge (ship to live), CI (automated tests). When engineers use these words, you now know exactly what the state of work is.
      </div>
    </div>
  );
}

// ─── POSTMAN API EXPLORER ─────────────────────────────────────────────────────
// Postman is how engineers (and PMs) inspect and test APIs.
// Understanding API requests/responses helps PMs: write better specs (including
// error states), debug issues faster, and have credible technical conversations.
// Learner sends real EdSpark API calls and reads the responses.

const API_ENDPOINTS = [
  {
    id: 'get-sessions',
    method: 'GET',
    methodColor: '#22C55E',
    endpoint: '/api/v1/sessions',
    description: 'Get all coaching sessions for the current user',
    body: null,
    scenario: 'You\'re building the recordings list. You need to know what data the API returns so you can spec the UI correctly.',
    response: {
      status: 200,
      statusLabel: 'OK',
      statusColor: '#22C55E',
      body: `{
  "sessions": [
    {
      "id": "sess_abc123",
      "rep_name": "Jordan Park",
      "date": "2024-01-15",
      "duration_mins": 42,
      "coaching_score": 74,
      "skill_tags": ["pricing_objections", "discovery"],
      "status": "analyzed"
    },
    {
      "id": "sess_def456",
      "rep_name": "Priya Sharma",
      "date": "2024-01-14",
      "duration_mins": 31,
      "coaching_score": 88,
      "skill_tags": ["closing", "rapport"],
      "status": "analyzed"
    }
  ],
  "total": 47,
  "page": 1
}`,
      pmNote: 'The response tells you exactly what fields you have to work with. coaching_score and skill_tags exist — so you CAN build a coaching score display and skill filter. If a field isn\'t here, you can\'t display it without a backend change.',
    },
  },
  {
    id: 'post-comment',
    method: 'POST',
    methodColor: '#6366F1',
    endpoint: '/api/v1/sessions/:id/comments',
    description: 'Add a timestamped coaching comment to a session',
    body: `{
  "timestamp_seconds": 245,
  "text": "Use the 3-year ROI calculation here next time",
  "skill_tag": "pricing_objections"
}`,
    scenario: 'You\'re speccing the "add coaching comment" feature. You need to know what data the API expects from the front-end.',
    response: {
      status: 201,
      statusLabel: 'Created',
      statusColor: '#6366F1',
      body: `{
  "id": "comment_xyz789",
  "session_id": "sess_abc123",
  "timestamp_seconds": 245,
  "text": "Use the 3-year ROI calculation here next time",
  "skill_tag": "pricing_objections",
  "created_by": "marcus.lee@apex.com",
  "created_at": "2024-01-15T14:32:00Z"
}`,
      pmNote: '201 Created (not 200) means a new resource was created. The API returns the full comment back — including the id it assigned. Your spec should note that the comment appears immediately without a page reload (optimistic UI).',
    },
  },
  {
    id: 'get-not-found',
    method: 'GET',
    methodColor: '#22C55E',
    endpoint: '/api/v1/sessions/sess_DELETED',
    description: 'Get a session that has been deleted',
    body: null,
    scenario: 'A user clicks a link to an old session that was archived. What does the API return? What should your UI show?',
    response: {
      status: 404,
      statusLabel: 'Not Found',
      statusColor: '#EF4444',
      body: `{
  "error": {
    "code": "SESSION_NOT_FOUND",
    "message": "The requested session does not exist or has been deleted.",
    "request_id": "req_abc987"
  }
}`,
      pmNote: '404 means the resource doesn\'t exist. Your spec MUST define what the user sees here. If you don\'t spec it, engineers will show a white screen or a raw "404" error. This is why spec completeness matters — every error state is a user experience.',
    },
  },
  {
    id: 'unauthorized',
    method: 'GET',
    methodColor: '#22C55E',
    endpoint: '/api/v1/sessions (no auth token)',
    description: 'Same request but without authentication',
    body: null,
    scenario: 'A user\'s session expired and they try to load the page. What happens?',
    response: {
      status: 401,
      statusLabel: 'Unauthorized',
      statusColor: '#F97316',
      body: `{
  "error": {
    "code": "AUTHENTICATION_REQUIRED",
    "message": "A valid authentication token is required.",
    "redirect_to": "/login"
  }
}`,
      pmNote: '401 Unauthorized means the user is not logged in (or their token expired). Your spec needs to say: "If the API returns 401, redirect to the login page." If you don\'t spec this, users see a broken page instead of a login prompt.',
    },
  },
  {
    id: 'server-error',
    method: 'POST',
    methodColor: '#6366F1',
    endpoint: '/api/v1/sessions/analyze',
    description: 'Trigger analysis — server has an unexpected error',
    body: `{ "session_id": "sess_abc123" }`,
    scenario: 'A user uploads a corrupted file and triggers analysis. The server throws an unexpected error.',
    response: {
      status: 500,
      statusLabel: 'Server Error',
      statusColor: '#EF4444',
      body: `{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred. Our team has been notified.",
    "request_id": "req_xyz456"
  }
}`,
      pmNote: '500 means something broke on the server — not the user\'s fault. Your spec must say: show a user-friendly error ("Something went wrong — try again in a moment") and a retry button. Never expose "Internal Server Error" to users. Write the copy in your spec.',
    },
  },
];

export function PostmanAPIExplorer() {
  const [active, setActive] = useState(0);
  const [sent, setSent] = useState(false);
  const endpoint = API_ENDPOINTS[active];

  const switchEndpoint = (idx: number) => {
    setActive(idx);
    setSent(false);
  };

  return (
    <div style={{ margin: '36px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ padding: '4px 12px', borderRadius: '8px', background: '#FF6C37', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '0.14em', boxShadow: '0 3px 0 #C2410C' }}>
          POSTMAN
        </div>
        <div style={{ fontSize: '13px', color: 'var(--ed-ink2)', fontWeight: 600 }}>5 EdSpark API calls — understand what the responses mean and what your spec must cover</div>
      </div>

      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}>
        {/* Postman header */}
        <div style={{ background: '#1C1C1C', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>{['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />)}</div>
          <div style={{ width: '20px', height: '20px', borderRadius: '5px', background: '#FF6C37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900, color: '#fff', flexShrink: 0 }}>P</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>EdSpark API · Workspace</div>
        </div>

        {/* Sidebar + main */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', background: '#F5F5F5' }}>
          {/* Sidebar */}
          <div style={{ background: '#F0F0F0', borderRight: '1px solid #E0E0E0', padding: '8px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '9px', fontWeight: 700, color: '#666', letterSpacing: '0.1em', padding: '6px 8px', marginBottom: '4px' }}>
              EDSPARK ENDPOINTS
            </div>
            {API_ENDPOINTS.map((ep, i) => (
              <button key={ep.id} onClick={() => switchEndpoint(i)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: active === i ? '#fff' : 'transparent', textAlign: 'left' as const, marginBottom: '2px', boxShadow: active === i ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 800, color: ep.methodColor, padding: '1px 5px', borderRadius: '3px', background: `${ep.methodColor}15`, flexShrink: 0 }}>{ep.method}</span>
                  <span style={{ fontSize: '10px', color: '#374151', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{ep.endpoint}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Main panel */}
          <div style={{ background: '#fff' }}>
            {/* Request bar */}
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '5px 12px', borderRadius: '6px', background: `${endpoint.methodColor}15`, fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: endpoint.methodColor }}>
                {endpoint.method}
              </div>
              <div style={{ flex: 1, fontFamily: 'monospace', fontSize: '12px', color: '#374151', background: '#F9FAFB', padding: '6px 12px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                https://api.edspark.io{endpoint.endpoint}
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setSent(true)}
                style={{ padding: '7px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 800, background: '#FF6C37', color: '#fff', border: 'none', boxShadow: '0 2px 0 #C2410C' }}>
                Send
              </motion.button>
            </div>

            {/* Scenario */}
            <div style={{ padding: '12px 16px', background: '#FFFBF5', borderBottom: '1px solid #FEF3C7' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, color: '#D97706', letterSpacing: '0.1em', marginBottom: '4px' }}>YOUR SCENARIO</div>
              <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.6 }}>{endpoint.scenario}</div>
            </div>

            {/* Request body */}
            {endpoint.body && (
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.1em', marginBottom: '6px' }}>REQUEST BODY</div>
                <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '11px', color: '#374151', background: '#F9FAFB', padding: '10px', borderRadius: '6px', border: '1px solid #E5E7EB', overflowX: 'auto' as const }}>
                  {endpoint.body}
                </pre>
              </div>
            )}

            {/* Response */}
            <AnimatePresence>
              {sent && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <div style={{ padding: '10px 16px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.1em' }}>RESPONSE</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: endpoint.response.statusColor }} />
                      <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 900, color: endpoint.response.statusColor }}>{endpoint.response.status}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6B7280' }}>{endpoint.response.statusLabel}</span>
                    </div>
                  </div>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
                    <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '11px', color: '#374151', background: '#F9FAFB', padding: '12px', borderRadius: '6px', border: '1px solid #E5E7EB', lineHeight: 1.65, overflowX: 'auto' as const }}>
                      {endpoint.response.body}
                    </pre>
                  </div>
                  <div style={{ padding: '12px 16px', background: `${endpoint.response.statusColor}08`, borderBottom: '1px solid var(--ed-rule)' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '8px', fontWeight: 700, color: endpoint.response.statusColor, letterSpacing: '0.1em', marginBottom: '5px' }}>WHAT THIS MEANS FOR YOUR SPEC</div>
                    <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.7 }}>{endpoint.response.pmNote}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!sent && (
              <div style={{ padding: '24px 16px', textAlign: 'center' as const, color: '#9CA3AF', fontSize: '13px', fontStyle: 'italic' }}>
                Click Send to see the response
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '12px', padding: '12px 18px', borderRadius: '12px', background: 'rgba(255,108,55,0.07)', border: '1px solid rgba(255,108,55,0.2)', fontSize: '13px', color: 'var(--ed-ink2)', lineHeight: 1.7 }}>
        <strong style={{ color: '#FF6C37' }}>PM rule:</strong> every API response has a status code. 200 = success. 201 = created. 404 = not found. 401 = not logged in. 500 = server broke. Your spec must define what the user sees for every non-200 case — not just the happy path.
      </div>
    </div>
  );
}

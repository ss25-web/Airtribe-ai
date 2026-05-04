# Claude Context for Airtribe Learn

This file is a short working context for future Claude sessions on this repo.

`prompt.md` remains the main source of truth. Read that first.

## What This Repo Is

Airtribe Learn is a Next.js 16 interactive learning platform for:
- PM
- GenAI
- SWE / Python

It uses:
- TypeScript
- Framer Motion
- Zustand for learner progress
- inline styles plus shared CSS tokens in `src/app/globals.css`

## Most Important Current Context

Recent work focused on:
1. unifying shared visual surfaces and dark-mode-safe clay tokens
2. cleaning up PM narrative cards and character callouts
3. improving badge / tracker consistency across tracks
4. experimenting with PM module 1 workflow animation mockups

The animation work was pushed, but the current implementation is **not yet considered visually final**.

## Files to Read First

If you are working on PM / design consistency:
- `prompt.md`
- `src/app/globals.css`
- `src/components/pm-fundamentals/designSystem.tsx`
- `src/components/sweDesignSystem.tsx`

If you are working on PM module 1 visuals:
- `src/components/pm-fundamentals/Track1NewPM.tsx`
- `src/components/pm-fundamentals/Track2APM.tsx`
- `src/components/pm-fundamentals/Module1Animations.tsx`

## Important Changes Already Made

### Shared surface / theme work

Shared clay-style and editorial surface tokens were added / unified so dark mode does not rely on hard-coded light colors.

Main files:
- `src/app/globals.css`
- `src/components/pm-fundamentals/designSystem.tsx`
- `src/components/sweDesignSystem.tsx`

### PM narrative structure

PM narrative / character moments were refactored so:
- Priya / mentor speaking or thinking moments use consistent avatar callout patterns
- stakeholder or narrative beats should not incorrectly use Priya’s avatar

Primary file:
- `src/components/pm-fundamentals/Track1NewPM.tsx`

### PM module 1 animation mockups

New workflow visuals were introduced:
- `DecisionRippleVisual`
- `ProblemSolutionDriftVisual`
- `DecisionQualitySplitVisual`
- `TradeoffPrismVisual`

Primary file:
- `src/components/pm-fundamentals/Module1Animations.tsx`

These are wired into:
- `src/components/pm-fundamentals/Track1NewPM.tsx`
- `src/components/pm-fundamentals/Track2APM.tsx`

## Current User Feedback You Must Respect

The user has been very clear about a few things:

### 1. Visual quality has been inconsistent

Past attempts were criticized for:
- overlapping cards
- clipped edges
- weak palette choices
- flat / low-density 2D look
- poor integration into the editorial page
- generic interaction-driven ideas instead of strong animation workflows

Do not assume current animation mockups are good just because they compile.

### 2. The user wants animation workflows, not click-reveal gimmicks

Avoid defaulting to:
- click-to-reveal
- drag-and-drop
- basic card flipping
- generic “tap to inspect” mechanics

Prefer:
- motion over time
- choreographed system flows
- visually staged learning moments
- dense, premium-looking scenes

### 3. Design consistency matters as much as novelty

Do not create one-off visual languages per section.

Before changing layout / cards / animations:
- check `designSystem.tsx`
- reuse existing spacing rhythm
- align with the existing PM module structure
- keep sidebar, tracker, badges, and main content feeling like one product

### 4. Palette discipline matters

The user disliked muddy or random color combinations.

Safer direction:
- stay close to the module accent family
- use a small, coherent palette
- avoid excessive blur and washed-out glow clouds
- depth should come from composition, shadow, bevel, layering, and spacing — not just blur

## Guidance for Future Animation Work

If you continue animation design for PM module 1:

- treat the current `Module1Animations.tsx` as a prototype, not a final system
- if a workflow scene looks weak, it is acceptable to replace it cleanly instead of patching it repeatedly
- prefer one strong visual scene over several mediocre ones
- build scenes that can survive both light and dark mode
- avoid extra labels like “Animated Workflow” unless explicitly useful
- avoid wrapping everything in decorative containers if the composition itself can carry the section

## Suggested Working Approach

When Claude resumes work here:
1. read `prompt.md`
2. inspect the current PM module 1 screen in context
3. evaluate whether the animation should be refined, replaced, or removed
4. keep source edits scoped to shared systems where possible
5. verify with TypeScript and local dev server before pushing

## Git / Session Notes

Recent pushed commits relevant to this area:
- `13b0b0b` `Unify clay surfaces and narrative cards`
- `50c7b9c` `Add PM module 1 workflow animation mockups`

The second commit exists in GitHub history, but that does **not** mean the visual direction is approved.


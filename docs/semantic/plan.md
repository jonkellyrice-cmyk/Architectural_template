# Time Calculator - Semantic Planner Document

## Planning Goal

Build the smallest useful version of a Time Calculator web utility and deploy it as the first simple Arc Frame Labs micro-app.

The plan prioritizes:

- shipping quickly
- avoiding architecture creep
- keeping the codebase small
- validating the deploy/link workflow
- creating a reusable pattern for future simple utilities

---

# Phase 1: Repository Cleanup

## Objective

Remove old scaffold remnants that do not serve the Time Calculator MVP.

## Tasks

- Ensure the app uses the simplified structure:
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
  - `src/app/api/premium/route.ts`
  - `src/app_feature/feature.tsx`
- Remove unused old architecture folders if present:
  - `kernel`
  - `engine`
  - `ui`
  - `adapters`
  - empty/broken barrel files
- Keep optional placeholder folders only if they do not break builds:
  - `data`
  - `lib`
  - `storage`

## Acceptance Check

`npm run build` succeeds.

---

# Phase 2: Basic Time Calculator UI

## Objective

Create a simple single-page interface with multiple calculation modes.

## MVP Modes

- Add duration to time
- Subtract duration from time
- Difference between two times
- Add days to date
- Difference between two dates

## UI Requirements

- Clear page title
- Short explanation
- Mode selector
- Inputs for selected mode
- Calculate button
- Result display
- Basic error message for invalid input
- Mobile-friendly layout

## Acceptance Check

A user can complete each MVP calculation manually.

---

# Phase 3: Calculation Logic

## Objective

Implement deterministic local calculation functions inside `feature.tsx`.

## Logic Requirements

- Parse time inputs safely
- Parse date inputs safely
- Add hours/minutes to a time
- Subtract hours/minutes from a time
- Calculate elapsed time between two times
- Add days to a date
- Calculate days between two dates
- Return understandable result strings

## Scope Rule

Do not add timezone conversion in MVP.

## Acceptance Check

All five MVP calculation modes produce expected results.

---

# Phase 4: Free/Premium Boundary Placeholder

## Objective

Keep premium architecture available without implementing full payment systems yet.

## Tasks

- Keep `/api/premium/route.ts`
- Make it return a simple JSON response confirming the route works
- Do not add Stripe yet
- Do not add accounts yet
- Do not block core calculator features behind premium yet

## Acceptance Check

Calling `/api/premium` returns a valid JSON response.

---

# Phase 5: Basic Monetization Placeholder

## Objective

Reserve space for future ads and premium messaging without making the MVP messy.

## Tasks

- Add a small non-intrusive placeholder area for future ads
- Add a short note that premium features may be added later
- Do not implement actual ads yet
- Do not implement payment yet

## Acceptance Check

The app still feels clean and usable.

---

# Phase 6: Arc Frame Labs Linkage

## Objective

Make the Time Calculator feel like part of the Arc Frame Labs ecosystem.

## Tasks

- Add visible Arc Frame Labs branding
- Add a link back to the Arc Frame Labs hub
- Add simple footer text
- After deployment, update the hub page to link to Time Calculator

## Acceptance Check

Users can navigate from the app back to the hub.

---

# Phase 7: Validation and Deployment

## Objective

Confirm the app builds, runs, and deploys successfully.

## Tasks

- Run `npm run build`
- Run `npm run dev`
- Test all calculation modes locally
- Push to GitHub
- Deploy through Vercel
- Open the deployed URL
- Verify the deployed app works
- Update Arc Frame Labs hub link

## Acceptance Check

The deployed Time Calculator is publicly accessible and linked from the hub.

---

# Explicit Deferrals

The following are intentionally deferred:

- user accounts
- login
- Stripe
- actual ads
- saved history
- timezone conversion
- business-day calculations
- holiday-aware calculations
- calendar integration
- notifications
- AI features
- advanced architecture
- multiple feature files
- kernel/engine/module system

---

# Final MVP Definition

The MVP is complete when:

1. The user can open the deployed site.
2. The user can perform all five core time/date calculations.
3. The app builds successfully.
4. The app is linked from Arc Frame Labs.
5. The code remains simple enough to understand in one sitting.


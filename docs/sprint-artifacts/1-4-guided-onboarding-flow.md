---
id: 1-4
epic: 1
title: Guided Onboarding Flow
status: drafted
author: sm
created: 2025-12-11
---
# Story 1.4: Guided Onboarding Flow

Status: drafted

## Story

As a new user who has just verified my email,
I want to complete a guided 5-step onboarding process,
so that the AI can gather my preferences and generate my first personalized plan.

## Acceptance Criteria

1. **Given** I have verified my email and logged in, **When** I start the onboarding process, **Then** I am presented with a sequence of five distinct UI screens for collecting preferences.
2. **And** I can select my primary fitness goal, dietary preferences, and a “fitness persona.”
3. **And** when I complete the final step, all selected preferences are securely saved to my user profile in the Supabase database.

## Tasks / Subtasks

### Frontend (AC #1, #2)

- [ ] Implement the 5-step onboarding flow under `frontend/src/app/(auth)/onboarding/`.
- [ ] Create reusable components for question prompts and selection controls.
- [ ] Maintain onboarding state across all 5 steps (goal → diet → persona, etc.).
- [ ] Ensure that only authenticated and email-verified users can access onboarding.
- [ ] On completion, send collected preferences to the backend using the authenticated user's JWT.

### Backend (AC #3)

- [ ] Implement a `PUT /api/v1/users/profile/` endpoint for storing onboarding preferences.
- [ ] Require a valid Supabase JWT (user must be authenticated).
- [ ] Update the corresponding fields in the Supabase `user_profile` table.

### Database (AC #3)

- [ ] Confirm that fields exist to store:
  - `fitness_goal`
  - `dietary_preference`
  - `fitness_persona`
- [ ] Add fields if missing.

### Testing

- [ ] Write integration tests for `/api/v1/users/profile/`.
- [ ] Write Playwright E2E tests simulating the full 5-step onboarding flow and verifying stored preferences.

---

## Dev Notes

### Learnings from Previous Story (1.3: User Registration & Email Verification)


#### File References from Previous Story

This story builds on the implementation completed in Story 1.3.
The following files were created or modified and serve as a foundation for the onboarding logic:

- `frontend/src/lib/supabase/client.ts`
- `frontend/src/lib/supabase/server.ts`
- `frontend/src/app/(auth)/signup/page.tsx`
- `frontend/src/app/(auth)/login/page.tsx`
- `frontend/src/app/auth/callback/route.ts`
- `frontend/src/app/auth/error/page.tsx`
- `frontend/src/app/(auth)/email-verified/page.tsx`
- `frontend/src/app/(auth)/signup/__tests__/page.test.tsx`
- `frontend/src/app/(auth)/login/__tests__/page.test.tsx`
- `frontend/e2e/__tests__/auth.spec.ts`

These files implement the authentication and verification flow that onboarding continues from.

[Source: docs/sprint-artifacts/1-3-user-registration-email-verification.md]

- Story 1.3 successfully implemented registration, login, and email verification using Supabase Auth.
- **Important unresolved issue from Story 1.3:**There is a **known high-priority technical issue** involving Jest + JSDOM + React Hook Form that causes certain unit/integration tests to fail (`signup` and `login` test suites).These issues do **not** impact functional behavior but remain unresolved and represent a test-infrastructure limitation.
- This risk is acknowledged and carried into Story 1.4.
  Onboarding implementation will follow the same architectural patterns but will avoid unnecessary complexity in Jest-based unit tests.
- 

### Architecture & Structure Notes

- **Frontend:** Story 1.3 established authenticated-user session handling. Onboarding must reuse this pattern.
- Implement onboarding under `src/app/(auth)/onboarding/` to maintain auth route grouping.
- A single page with internal state or a sub-route structure (`step-1`, `step-2`, etc.) may be used depending on UX needs.
- **Backend:** Update logic belongs in `backend/app/api/v1/endpoints/users.py`.
- All user data interactions must go through Supabase — no local auth or local DB storage.

### Supabase Notes

- Supabase user management is remote and authoritative.
- The Supabase JWT must be supplied when saving onboarding preferences.
- AI features (Gemini + Pydantic AI) will consume onboarding preferences in Story 1.5, not in this story.

### References

- Architecture: `docs/architecture-2025-11-30.md`
- Tech Spec: `docs/sprint-artifacts/tech-spec-epic-1.md`
- Epics: `docs/epics.md#story-14-guided-onboarding-flow`
- PRD: `docs/PRD.md`

---

## Dev Agent Record

### Context Reference

(To be filled by automation)

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

(to be filled by automation)

### Completion Notes List

(To be completed during implementation)

### File List

(To be populated after implementation)

---

## Change Log

- **2025-12-11** — Initial draft created.
- **2025-12-11** — Updated *Learnings from Previous Story* to explicitly acknowledge unresolved Jest/JSDOM test issues from Story 1.3.
- **2025-12-11** — Added required Change Log section for validator compliance.
- **2025-12-11** — Added missing file references and previous story citation based on validation feedback.

# Story 1.4: Guided Onboarding Flow

Status: drafted

## Story

As a new user who has just verified my email,
I want to complete a guided 5-step onboarding process,
so that the AI can gather my preferences and generate my first personalized plan.

## Acceptance Criteria

1.  **Given** I have verified my email and logged in, **When** I start the onboarding process, **Then** I am presented with a sequence of 5 distinct UI screens for collecting my preferences.
2.  **And** I can select my primary fitness goal, dietary preferences, and a "fitness persona" from the provided options on these screens.
3.  **And** upon completing the final step, all my selected preferences are securely saved to my user profile in the Supabase database.

## Tasks / Subtasks

- [ ] **Frontend**: Implement the 5-step UI flow within `src/app/(auth)/onboarding/`. (AC: #1, #2)
  - [ ] Create reusable components for onboarding questions and selection controls.
  - [ ] Manage the state of the onboarding process, including user selections.
  - [ ] On completion, call the backend API to submit the user's preferences.
- [ ] **Backend**: Implement the API endpoint to handle profile updates. (AC: #3)
  - [ ] Create a `PUT` endpoint at `/api/v1/users/profile/`.
  - [ ] The endpoint must be secure, requiring a valid JWT from the authenticated user.
  - [ ] It should accept the user's onboarding preferences and update the corresponding fields in the `users` table via the Supabase client.
- [ ] **Database**: Verify the `users` table schema can store the onboarding data (e.g., `fitness_goal`, `dietary_preference`, `fitness_persona`). (AC: #3)
- [ ] **Testing**:
  - [ ] Write integration tests for the `/api/v1/users/profile/` endpoint to ensure it correctly validates input and updates the database.
  - [ ] Write E2E tests (e.g., using Playwright) to simulate a user completing the entire onboarding flow, verifying that the preferences are saved correctly.

## Dev Notes

- **IMPORTANT:** Supabase user management functionality is a remote DB, NOT local. All interactions with user data should go through the Supabase client libraries.
- The AI integration noted in the prompt (Pydantic AI with Gemini 2.5 Flash) is primarily for Story 1.5, which will consume the preferences gathered in this story.
- This story focuses on UI implementation and saving user data.

### Learnings from Previous Story (1.3)

- **From Story 1.3-user-registration-email-verification (Status: done)**
- **Authentication Client**: The Supabase client for handling user authentication was initialized in Story 1.3. Reuse this existing client instance for all interactions with Supabase in this story to maintain consistency and efficiency.
- **User Session**: Story 1.3 established the pattern for managing user sessions with JWTs. The frontend should already have access to the authenticated user's session and token, which must be included in the `Authorization` header for the API call to `/api/v1/users/profile/`.

### Project Structure Notes

- **Frontend**: The onboarding flow should be implemented within the `frontend/src/app/(auth)/` route group to align with the existing authentication structure. A new sub-path like `onboarding/[step]` is recommended.
- **Backend**: The logic for updating user preferences belongs in the `backend/app/api/v1/endpoints/users.py` module.

### References

- **Architecture:** `docs/architecture-2025-11-30.md`
- **Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-1.md`
- **Epics/Source Story:** `docs/epics.md#story-14-guided-onboarding-flow`
- **PRD:** `docs/PRD.md`

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

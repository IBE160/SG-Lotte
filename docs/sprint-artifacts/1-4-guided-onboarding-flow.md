# Story 1.4: Guided Onboarding Flow

Status: drafted

**Story Statement:** As a new user who has just verified my email, I want to complete a guided 5-step onboarding process, so the AI can gather my preferences and generate my first personalized plan.

## Requirements Context Summary

This story, "Guided Onboarding Flow" (Story 1.4), is a pivotal part of Epic 1: "First Plan & Foundation." It directly addresses Functional Requirement FR-001 (User Authentication & Profile Management) by collecting essential user preferences, which are then used by FR-002 and FR-003 for AI-driven plan generation.

### Key Details from `epics.md`
- **User Role:** New user who has just verified email
- **Action:** Complete a guided 5-step onboarding process
- **Benefit:** AI can gather preferences and generate the first personalized plan
- **Acceptance Criteria:**
    - User is presented with a sequence of 5 UI screens (`onboarding1_dark.html` to `onboarding5_dark.html`).
    - User can select primary fitness goal, dietary preferences, and fitness persona.
    - All preferences are securely saved to the user profile.
- **Prerequisites:** Story 1.3 (User Registration & Email Verification).
- **Technical Notes:** Frontend development for the onboarding screens, API endpoints to save user preferences.

### Key Details from `tech-spec-epic-1.md`
- **Authentication:** Supabase Auth handles user sessions.
- **API Design:** Endpoints use plural nouns and kebab-case under `/api/v1/`.
- **Database Design:** User preferences will be stored in snake_case table/columns.
- **Project Structure:** Frontend `frontend/app/(auth)/` is the location for authentication and onboarding related UI.

### Key Details from `architecture-2025-11-30.md`
- **Frontend:** Next.js 14+ (App Router) with TypeScript, Tailwind CSS.
- **Backend:** FastAPI (Python).
- **Database & BaaS:** Supabase (PostgreSQL).
- **User Experience:** Defined by high-fidelity dark-themed wireframes, requiring a rich, component-based architecture to implement the 5-step onboarding.
- **Project Structure:** `frontend/src/app/(auth)/` will contain onboarding UI.
- **Testing:** Frontend component and integration tests using `React Testing Library` with `Jest`.

### UX Design Considerations from `ux-design-specification.md`
- **Flow 0: New User Onboarding:** The story implements the 5-step guided setup process, directly referencing `onboarding1_dark.html` to `onboarding5_dark.html` as supporting wireframes for the UI.
- **Feedback Patterns:** UI should incorporate `feedback_patterns_dark.html` principles for user interactions (e.g., saving preferences).

## Project Structure Alignment and Lessons Learned

This section integrates learnings from previous stories and ensures alignment with the established project structure and architectural guidelines for Story 1.4: Guided Onboarding Flow.

### Learnings from Previous Story (Story 1.3: User Registration & Email Verification)
- **Frontend Development:** Consistent application of project structure, naming conventions (PascalCase for components, kebab-case for component files), and component organization (by feature or route within `frontend/app/(auth)/`).
- **Shared Utilities:** Emphasizes using `frontend/lib/` for shared utilities (e.g., Supabase client initialization).
- **Supabase Integration:** Confirms the pattern of using `supabase-js` for frontend-to-Supabase interactions.
- **Testing:** Reinforces the established Jest/React Testing Library setup for frontend component and integration tests, with tests co-located in `__tests__` subdirectories.
- **Backend API:** Pattern for creating FastAPI endpoints (e.g., `backend/app/api/v1/endpoints/users.py`) for user-related functionalities.
- **Supabase Auth/RLS:** Highlights the use and configuration guidelines for Supabase Authentication and Row Level Security.

### Actionable Intelligence for Story 1.4
- **Frontend Components:** Onboarding UI components (`onboarding1_dark.html` to `onboarding5_dark.html` wireframes) should be developed within `frontend/app/(auth)/onboarding/` or a similar logical grouping within `frontend/app/(auth)/`.
- **API Endpoints:** Dedicated API endpoints will be needed to handle saving user preferences gathered during onboarding. These should follow the `/api/v1/` versioning and kebab-case naming conventions, likely within `backend/app/api/v1/endpoints/users.py` or a new preferences module.
- **Database Interaction:** Utilize the established Supabase client (`frontend/lib/supabase.ts`) for saving user preferences to the Supabase database. Ensure RLS policies are considered for the relevant user profile data.
- **Testing:** New frontend components for onboarding should have co-located tests using React Testing Library and Jest. New backend API endpoints should have Pytest integration tests.

This ensures that Story 1.4 builds upon the solid foundation laid by previous stories, adhering to documented architectural patterns and best practices.

## Acceptance Criteria

1.  **Guided Onboarding UI Presentation:**
    *   **Given** a user has verified their email and initiates the onboarding process
    *   **When** they navigate through the onboarding flow
    *   **Then** they are presented with five distinct UI screens, visually consistent with `onboarding1_dark.html` through `onboarding5_dark.html`.

2.  **User Preference Collection:**
    *   **Given** a user is on an onboarding screen designed for preference selection
    *   **When** they interact with the UI to select their primary fitness goal, dietary preferences, and fitness persona
    *   **Then** their selections are captured accurately by the frontend.

3.  **Secure Preference Saving:**
    *   **Given** a user has made their preferences and proceeds to the next step or completes the onboarding flow
    *   **When** the preferences are submitted
    *   **Then** their selections are securely saved to their user profile in the Supabase database
    *   **And** appropriate API endpoints are used for this data persistence.

## Tasks / Subtasks

### Frontend Tasks

-   [ ] **Task: Implement Onboarding UI Flow**
    -   [ ] Create `OnboardingLayout` component(s) to manage the 5-step flow within `frontend/app/(auth)/onboarding/` (AC: 1).
    -   [ ] Develop individual UI components for each step (e.g., `GoalSelection.tsx`, `DietaryPreferences.tsx`, `PersonaSelection.tsx`), aligning with `onboarding1_dark.html` to `onboarding5_dark.html` wireframes (AC: 1, 2).
    -   [ ] Implement navigation between onboarding steps (e.g., "Next", "Back" buttons) (AC: 1).
    -   [ ] Integrate state management (e.g., Zustand) for user selections across the onboarding flow (AC: 2).
    -   [ ] Display appropriate feedback (success/error) upon saving preferences, adhering to `feedback_patterns_dark.html` (AC: 3).
    -   [ ] **Test Subtask:** Write component tests for each onboarding step using React Testing Library and Jest, covering UI rendering, user interaction, and state updates (AC: 1, 2).
    -   [ ] **Test Subtask:** Write integration tests for the full onboarding flow, ensuring correct navigation and data capture (AC: 1, 2).

### Backend Tasks

-   [ ] **Task: Create API Endpoint for User Preferences**
    -   [ ] Define a POST or PUT endpoint (e.g., `/api/v1/users/preferences`) in `backend/app/api/v1/endpoints/users.py` to receive and save user preferences (AC: 3).
    -   [ ] Implement request body validation using Pydantic schemas for fitness goals, dietary preferences, and fitness persona (AC: 3).
    -   [ ] Integrate with the Supabase client in the backend to securely update the user's profile in the PostgreSQL database (AC: 3).
    -   [ ] Ensure proper error handling and response messages (AC: 3).
    -   [ ] **Test Subtask:** Write integration tests using Pytest for the `/api/v1/users/preferences` endpoint, covering valid/invalid input, successful saving, and error scenarios (AC: 3).

### Database/Supabase Tasks

-   [ ] **Task: Update Supabase User Profile Schema**
    -   [ ] If necessary, add columns to the `users` table or a new `user_profiles` table to store `fitness_goal`, `dietary_preferences`, and `fitness_persona` (AC: 3).
    -   [ ] Ensure Row Level Security (RLS) policies are correctly applied to these new columns/tables to restrict access to the user's own data (AC: 3).
    -   [ ] Create Alembic migration scripts for any schema changes (AC: 3).

### General Tasks

    -   [ ] **Task: Coordinate Frontend-Backend Integration**
        -   [ ] Ensure the frontend sends data to the correct backend API endpoint with the expected format (AC: 3).
        -   [ ] Verify the backend successfully receives, processes, and stores the data (AC: 3).
    -   [ ] **Task: Update Sprint Status**
        -   [ ] Upon completion, update `docs/sprint-artifacts/sprint-status.yaml` to mark this story as `done`.

## Dev Notes

### Project Structure Notes
- Frontend components for onboarding should be located in `frontend/app/(auth)/onboarding/`.
- Backend API endpoints for saving user preferences should be in `backend/app/api/v1/endpoints/users.py`.
- Use `frontend/lib/supabase.ts` for Supabase client initialization.

### References
- **PRD:** `docs/PRD.md` (FR-001: User Authentication & Profile Management)
- **Epics:** `docs/epics.md` (Epic 1, Story 1.4 details)
- **Architecture Document:** `docs/architecture-2025-11-30.md` (Sections: "Authentication", "Project Structure", "API Design", "Testing Strategy")
- **Epic 1 Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-1.md` (Sections: "API Design", "Database Design", "Authentication and Authorization")
- **UX Design Spec:** `docs/ux-design-specification.md` (Flow 0: New User Onboarding, `onboarding1_dark.html` to `onboarding5_dark.html`, Feedback Patterns)

### Learnings from Previous Story

**From Story 1.3: User Registration & Email Verification (Status: done)**

- **New Files Created:**
    - `frontend/app/(auth)/signup/page.tsx`
    - `frontend/app/(auth)/signup/SignupForm.tsx`
    - `frontend/app/(auth)/signup/__tests__/SignupForm.test.tsx`
    - `backend/app/api/v1/endpoints/users.py`
    - `backend/tests/test_users.py`
    - `frontend/app/(auth)/verify-email/page.tsx`
    - `frontend/app/(auth)/verify-email/__tests__/page.test.tsx`
- **Architectural Guidance**: Strict adherence to the `docs/architecture-2025-11-30.md` for project structure, naming conventions (PascalCase for components, kebab-case for component files), and component organization (by feature or route within `frontend/app/(auth)/`) is crucial.
- **Shared Utilities**: `frontend/lib/` should be utilized for shared utilities and functions (e.g., Supabase client).
- **Supabase Integration**: Frontend-to-Supabase interactions should use `supabase-js`.
- **Testing Setup**: The established Jest/React Testing Library setup for the frontend and Pytest for the backend are ready for use.
- **Backend API Pattern:** FastAPI endpoint creation for user-related functionalities in `backend/app/api/v1/endpoints/users.py`.
- **Supabase Auth/RLS:** Use and configuration guidelines for Supabase Authentication and Row Level Security should be followed for user preference storage.

[Source: `docs/sprint-artifacts/1-3-user-registration-email-verification.md`]

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/1-4-guided-onboarding-flow.md
- {current story context xml file if created}

### Agent Model Used
Gemini

### Debug Log References
- Generated story content based on PRD, Epics, Architecture, Tech Spec, and UX Design.
- Processed learnings from previous story `1-3-user-registration-email-verification.md`.

### Completion Notes
- Initial story draft created.
- Acceptance criteria and detailed tasks for frontend, backend, and database changes generated.
- Architectural alignment and lessons from previous story incorporated.

### Completion Notes List
- All acceptance criteria and tasks derived from source documents.
- Project structure alignment notes included.
- Detailed tasks with testing subtasks provided for both frontend and backend.

## Change Log

- **onsdag 3. desember 2025**: Initial draft created by BIP (Scrum Master Agent).

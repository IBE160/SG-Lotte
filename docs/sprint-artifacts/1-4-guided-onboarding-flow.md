# Story 1.4: Guided Onboarding Flow

Status: ready-for-dev

**Story Statement:** As a new user who has just verified my email,
I want to complete a guided 5-step onboarding process,
So the AI can gather my preferences and generate my first personalized plan.

## Requirements Context Summary

This story, "Guided Onboarding Flow" (Story 1.4), is a core part of Epic 1: "First Plan & Foundation." It directly addresses Functional Requirement FR-001 (User Authentication & Profile Management) by allowing users to provide their preferences for plan generation.

### Key Details from `epics.md`
- **User Role:** New user who has just verified email
- **Action:** Complete a guided 5-step onboarding process
- **Benefit:** AI can gather preferences and generate first personalized plan
- **Acceptance Criteria:**
    - **Given** I have verified my email
    - **When** I start the onboarding
    - **Then** I am presented with a sequence of 5 UI screens (`onboarding1_dark.html` to `onboarding5_dark.html`)
    - **And** I can select my primary fitness goal, dietary preferences, and fitness persona
    - **And** all my preferences are securely saved to my user profile
- **Prerequisites:** Story 1.3 (User Registration & Email Verification).
- **Technical Notes:** Frontend development for the onboarding screens, API endpoints to save user preferences.

### Key Details from `tech-spec-epic-1.md`
- Epic 1 focuses on establishing the core technical foundation including user authentication and initial AI-driven plan generation. This story contributes to collecting the necessary input for that plan generation.

### Key Details from `architecture-2025-11-30.md`
- **Frontend:** Next.js 14+ (App Router) with TypeScript, Tailwind CSS.
- **UX Design:** High-fidelity dark-themed wireframes, requiring a rich, component-based architecture to implement the 5-step onboarding.
- **Project Structure:** `frontend/src/app/(auth)/` for authentication-related UI, which includes onboarding.
- **Epic to Architecture Mapping:** Epic 1 is tied to `frontend: src/app/(auth)/` (Onboarding UI).
- **Naming Patterns:** Frontend components should use `PascalCase`, and their files `kebab-case`.
- **Component Organization:** Components should be organized by feature or route.
- **Testing Strategy:** Frontend component and integration tests will be written using `React Testing Library` with `Jest`.

### UX Design Considerations from `ux-design-specification.md`
- **Flow 0: New User Onboarding:** This story is critical for implementing the full 5-step onboarding process as specified by `onboarding1_dark.html` to `onboarding5_dark.html`.
- **Feedback Patterns:** Appropriate feedback (success/error messages) should be implemented as per `feedback_patterns_dark.html` principles when saving user preferences.

## Project Structure Alignment & Lessons Learned Summary

### Learnings from Previous Story (Story 1.3: User Registration & Email Verification)

This story (1.4: Guided Onboarding Flow) builds directly on the successful completion of Story 1.3.

- **New Components/Services for Reuse:**
    - The `/api/v1/users/signup` endpoint in FastAPI provides the backend for user registration. While this story focuses on user preferences, the established API structure and backend services are crucial.
    - The `SignupForm` React component and associated UI patterns in `frontend/app/(auth)/signup/` provide a foundational example for creating user input forms within the authentication flow.
    - The email verification handling and UI in `frontend/app/(auth)/verify-email/` establish patterns for user feedback and state management post-authentication.

- **Architectural Adherence and Consistency:**
    - The strict adherence to project structure and naming conventions (PascalCase for components, kebab-case for files) is to be maintained. Onboarding UI components should also reside within `frontend/app/(auth)/`.
    - `frontend/lib/supabase.ts` should continue to be the central point for Supabase client initialization and interaction. This ensures a consistent approach to saving user preferences to the database.
    - The established Jest/React Testing Library setup provides the framework for testing the new onboarding UI components.

- **Impact on Current Story (1.4):**
    - The user for this story is assumed to be already authenticated and email-verified, having just completed Story 1.3's flow.
    - The onboarding UI will logically follow the authentication flow within `frontend/app/(auth)/`.
    - Existing Supabase integration patterns will be leveraged to save the user's selected preferences.

## Acceptance Criteria

1.  **Onboarding Flow Presentation:**
    *   **Given** a user has just verified their email
    *   **When** they initiate the onboarding process
    *   **Then** they are presented with a series of 5 distinct UI screens, as specified by `onboarding1_dark.html` through `onboarding5_dark.html` in the UX Design Specification.

2.  **Preference Selection:**
    *   **Given** the user is navigating through the onboarding screens
    *   **When** they interact with the input fields and selection options
    *   **Then** they can effectively choose and input their primary fitness goal, dietary preferences, and fitness persona.

3.  **Secure Preference Saving:**
    *   **Given** the user has completed all onboarding steps and inputs
    *   **When** they submit their preferences
    *   **Then** all selected preferences are securely saved to their user profile in the Supabase database.

---

## Tasks / Subtasks

### Frontend Tasks

-   [ ] **Task: Implement Onboarding UI (5 screens)**
    -   [ ] Create React components for each of the 5 onboarding screens (e.g., `OnboardingStep1.tsx`, `OnboardingStep2.tsx`, etc.) within `frontend/app/(auth)/onboarding/`. (AC: 1, 2)
    -   [ ] Implement navigation logic (e.g., "Next", "Back" buttons) between onboarding screens. (AC: 1)
    -   [ ] Integrate UI elements for selecting fitness goal, dietary preferences, and fitness persona on respective screens. (AC: 2)
    -   [ ] Implement client-side validation for all user inputs within the onboarding flow. (AC: 2)
    -   [ ] **Test Subtask:** Write component tests for each onboarding screen using React Testing Library and Jest, covering input changes, selections, and navigation. (Ref: `docs/architecture-2025-11-30.md` - Frontend Testing)

-   [ ] **Task: Integrate Supabase Client for Saving Preferences**
    -   [ ] Develop utility functions (if not existing) in `frontend/lib/supabase.ts` or a related file to handle user profile updates. (Ref: Learnings from Story 1.3)
    -   [ ] Implement the logic to securely save user preferences (fitness goal, dietary preferences, fitness persona) to the user's profile in Supabase upon completion of the onboarding flow. (AC: 3)
    -   [ ] Handle success/error feedback during saving preferences using principles from `feedback_patterns_dark.html`. (AC: 3)
    -   [ ] **Test Subtask:** Write integration tests for the preference saving logic, mocking Supabase client calls to ensure proper data transmission and error handling.

### Backend Tasks

-   [ ] **Task: Create API Endpoint for User Preferences**
    -   [ ] Define a PUT or POST endpoint (e.g., `/api/v1/users/preferences`) in `backend/app/api/v1/endpoints/users.py` (or a new dedicated preferences endpoint). (AC: 3)
    -   [ ] Implement request body validation using a Pydantic schema for fitness goal, dietary preferences, and fitness persona. (AC: 3)
    -   [ ] Integrate with the Supabase client on the backend to update the user's profile or a dedicated preferences table. (AC: 3)
    -   [ ] Ensure proper authentication (JWT validation) and authorization (RLS considerations) for this endpoint. (Ref: `docs/architecture-2025-11-30.md` - Authentication & Authorization) (AC: 3)
    -   [ ] **Test Subtask:** Write integration tests for the new API endpoint covering successful updates, invalid input, and unauthorized access scenarios. (Ref: `docs/architecture-2025-11-30.md` - Backend Testing)

### Database / General Tasks

-   [ ] **Task: Update User Profile Schema (Alembic Migration)**
    -   [ ] If necessary, create an Alembic migration script to add or update columns in the Supabase user profile table for `fitness_goal`, `dietary_preferences`, and `fitness_persona`. (Ref: `docs/tech-spec-epic-1.md` - Database Design) (AC: 3)
    -   [ ] Ensure the migration is reversible.
    -   [ ] **Test Subtask:** Verify the migration applies and downgrades correctly in a local development environment.

## Dev Notes

- **Relevant architecture patterns and constraints**:
    - The `frontend/app/(auth)/` path should be used for authentication and onboarding-related UI components.
    - Component naming: `PascalCase` for React components, `kebab-case` for component files.
    - Testing: `React Testing Library` with `Jest` for frontend.
    - API endpoints for user preferences will adhere to `/api/v1/users/preferences` (or similar PUT/POST) and use Pydantic validation.
    - Backend API endpoints must ensure proper authentication (JWT validation) and authorization (RLS considerations).
    - Database schema updates (Alembic migrations) should be used for `fitness_goal`, `dietary_preferences`, and `fitness_persona`.
    - Supabase client in `frontend/lib/supabase.ts` for consistent data interaction.

- **Source tree components to touch**:
    - Frontend: `frontend/app/(auth)/onboarding/` (new directory/files), `frontend/lib/supabase.ts` (modification/extension).
    - Backend: `backend/app/api/v1/endpoints/users.py` (modification/new endpoint), possibly `backend/app/schemas/user.py` (new schema for preferences).
    - Database: Alembic migration files for schema updates.

- **Testing standards summary**:
    - Frontend: Component tests for UI screens, integration tests for preference saving logic.
    - Backend: Integration tests for the user preferences API endpoint.

### Project Structure Notes

- Alignment with unified project structure:
    - Onboarding components will reside within `frontend/app/(auth)/` adhering to the feature-based organization.
    - Backend API endpoints will follow the `/api/v1/` versioning and `endpoints/users.py` for user-related features.

### References

- **PRD:** `docs/PRD.md` (FR-001: User Authentication & Profile Management)
- **Epics:** `docs/epics.md` (Epic 1, Story 1.4 details)
- **Architecture Document:** `docs/architecture-2025-11-30.md` (Sections: "Project Context", "Project Structure", "Epic to Architecture Mapping", "Naming Patterns", "Testing Strategy")
- **Epic 1 Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-1.md` (Sections: "Epic 1 Overview", "Technology Stack", "Project Structure", "API Design", "Database Design", "Authentication and Authorization", "Testing Strategy")
- **UX Design Spec:** `docs/ux-design-specification.md` (Flow 0: New User Onboarding, Feedback Patterns)
- **Previous Story:** `docs/sprint-artifacts/1-3-user-registration-email-verification.md` (Learnings from previous story)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-4-guided-onboarding-flow.context.xml

### Agent Model Used

Gemini

### Debug Log References

### Completion Notes List

### File List

## Change Log

-   **torsdag 4. desember 2025**: Initial draft created by BIP (Scrum Master Agent).


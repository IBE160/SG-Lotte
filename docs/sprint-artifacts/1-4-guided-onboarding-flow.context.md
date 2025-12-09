# Story Context for Story 1.4: Guided Onboarding Flow

## Story Details
*   **Title:** Guided Onboarding Flow
*   **Status:** Drafted
*   **As a:** New user who has just verified my email,
*   **I want to:** Complete a guided 5-step onboarding process,
*   **So that:** The AI can gather my preferences and generate my first personalized plan.

## Acceptance Criteria
1.  **Given** I have verified my email
    **When** I start the onboarding
    **Then** I am presented with a sequence of 5 UI screens (`onboarding1_dark.html` to `onboarding5_dark.html`)
2.  **And** I can select my primary fitness goal, dietary preferences, and fitness persona
3.  **And** all my preferences are securely saved to my user profile

## Technical Notes

### Frontend
*   **Framework:** Next.js (App Router), TypeScript, Tailwind CSS.
*   **Components:** Onboarding screens (`onboarding1_dark.html` to `onboarding5_dark.html` equivalents) to be developed in Next.js, following the `src/app/(auth)/` pattern.
*   **Functionality:** UI for selecting fitness goal, dietary preferences, and fitness persona. Integration of API calls to save user preferences.
*   **File Locations:**
    *   `frontend/src/app/(auth)/`: New pages/components for onboarding steps.
    *   `frontend/src/components/`: New reusable UI components if any.
    *   `frontend/src/lib/supabaseClient.ts`: Potentially update if new Supabase interactions are needed.

### Backend
*   **Framework:** FastAPI (Python).
*   **Functionality:** API endpoint to receive and save user preferences to Supabase.
*   **Models:** Define Pydantic models for user preference data. Implement Supabase client logic to update user profile.
*   **File Locations:**
    *   `backend/app/api/v1/endpoints/users.py`: Potentially add a new endpoint or extend an existing one for user preferences.
    *   `backend/app/schemas/`: Define new Pydantic schemas for user preferences.
    *   `backend/app/crud/`: Implement CRUD operations for user preferences.
    *   `backend/app/models/`: Potentially update or add models for user preferences in the database.

### Data Persistence
*   **Database:** Supabase (PostgreSQL) for storing user preferences in the `users` table or a related `user_preferences` table.
*   **Authentication:** Supabase Auth is used for user management.
*   **Security:** RLS must be enforced for user preferences.

### API Contracts
*   Frontend will communicate with FastAPI backend via versioned REST API (`/api/v1/`).
*   Requests and responses will use Pydantic schemas.

### Testing Standards
*   **Backend (FastAPI):** Unit and integration tests using `Pytest`.
*   **Frontend (Next.js):** Component and integration tests using `React Testing Library` with `Jest`.
*   All API endpoints and UI interactions related to onboarding and preference saving should be thoroughly tested.

## Prerequisites
*   User has verified their email (implied by "As a new user who has just verified my email").

## References
*   [Source: docs/epics.md#Story 1.4: Guided Onboarding Flow]
*   [Source: docs/PRD.md#FR-001: User Authentication & Profile Management]
*   [Source: docs/architecture-2025-11-30.md#Epic to Architecture Mapping]
*   [Source: docs/architecture-2025-11-30.md#Project Structure]
*   [Source: docs/architecture-2025-11-30.md#Testing Strategy]

## Tasks / Subtasks (from the original story)

*   [ ] Frontend: Implement 5-step onboarding UI screens (AC: #1)
    *   [ ] Develop `onboarding1_dark.html` equivalent in Next.js (AC: #1)
    *   [ ] Develop `onboarding2_dark.html` equivalent in Next.js (AC: #1)
    *   [ ] Develop `onboarding3_dark.html` equivalent in Next.js (AC: #1)
    *   [ ] Develop `onboarding4_dark.html` equivalent in Next.js (AC: #1)
    *   [ ] Develop `onboarding5_dark.html` equivalent in Next.js (AC: #1)
*   [ ] Frontend: Implement UI for selecting fitness goal, dietary preferences, and fitness persona (AC: #2)
*   [ ] Frontend: Integrate API calls to save user preferences (AC: #3)
*   [ ] Backend: Create API endpoint to receive and save user preferences to Supabase (AC: #3)
    *   [ ] Define Pydantic models for user preference data
    *   [ ] Implement Supabase client logic to update user profile
*   [ ] Testing: Write unit and integration tests for frontend UI and API integration
*   [ ] Testing: Write unit and integration tests for backend API endpoint and database interaction
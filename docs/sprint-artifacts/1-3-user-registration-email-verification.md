# Story 1.3: User Registration & Email Verification

Status: drafted

**Story Statement:** As a new user, I want to sign up with my email and password and verify my email through Supabase Auth, so that I can create a secure account and proceed with the onboarding process.

## Requirements Context Summary

This story, "User Registration & Email Verification" (Story 1.3), is a foundational piece of Epic 1: "First Plan & Foundation." It directly addresses Functional Requirement FR-001 (User Authentication & Profile Management) by enabling users to securely create an account.

### Key Details from `epics.md`
- **User Role:** New user
- **Action:** Sign up with email/password, verify email
- **Benefit:** Create a secure account
- **Acceptance Criteria:**
    - Users can sign up with email and password, and must verify their email.
    - Users can log in, log out, and reset their password. (Implicitly covered by Supabase Auth integration, though specific UI for login/logout/reset will be handled in subsequent stories or a common auth flow).
    - Users can change their email address (with verification). (Out of scope for this story, likely a separate profile management feature).
    - Users can delete their account (with confirmation). (Out of scope for this story, likely a separate profile management feature).
    - Users can edit their primary fitness goal and core dietary preference. (Covered in Story 1.4: Guided Onboarding Flow).
    - My account is created in Supabase.
    - A verification email is sent to my provided email address.
    - I cannot log in until my email is verified.
    - My account is marked as verified after clicking the verification link.
- **Prerequisites:** Story 1.1 (Core Backend Setup), Story 1.2 (Core Frontend Setup).
- **Technical Notes:** Utilizes Supabase Auth for registration and email verification. Frontend UI based on `onboarding1_dark.html` (implied first step).

### Key Details from `tech-spec-epic-1.md`
- Implements user signup/login using Supabase Auth, email verification.

### Key Details from `architecture-2025-11-30.md`
- **Authentication:** Handled by Supabase Auth, using JWTs for secure sessions.
- **Authorization:** Supabase's Row Level Security (RLS) will be enabled for all tables containing user-specific data.
- **Project Structure:** Monorepo with `frontend/` (Next.js) and `backend/` (FastAPI).
- **API Design:** `/users/` endpoint under `/api/v1/` for user management.
- **Testing:** Unit and integration tests for FastAPI backend using Pytest. Frontend tests using React Testing Library with Jest.

### UX Design Considerations from `ux-design-specification.md`
- **Flow 0: New User Onboarding:** This story is the entry point into the onboarding flow, specifically supporting the initial steps that lead into `onboarding1_dark.html`.
- **Feedback Patterns:** Success/error feedback patterns (`feedback_patterns_dark.html`) should be implemented for registration and verification processes.

## Acceptance Criteria

1.  **User Registration:**
    *   **Given** a new user is on the signup page (`onboarding1_dark.html` context)
    *   **When** they enter a valid email and password, and submit the form
    *   **Then** a new user account is created in Supabase Auth
    *   **And** a verification email is automatically sent to the provided email address
    *   **And** the user is prevented from logging in until their email is verified

2.  **Email Verification:**
    *   **Given** a user has registered and received a verification email
    *   **When** they click the verification link in the email
    *   **Then** their account status in Supabase Auth is updated to "verified"

## Tasks / Subtasks

### Frontend Tasks

-   [ ] **Task: Implement Signup UI (based on `onboarding1_dark.html` context)**
    -   [ ] Create `SignupForm` component within `frontend/app/(auth)/signup/` (AC: 1)
    -   [ ] Implement email and password input fields with validation (AC: 1)
    -   [ ] Add a submit button to trigger registration (AC: 1)
    -   [ ] Integrate basic error/success feedback display for user (utilizing `feedback_patterns_dark.html` principles) (AC: 1)
    -   [ ] **Test Subtask:** Write component tests for `SignupForm` using React Testing Library and Jest, covering input changes, submission, and validation errors. (Ref: `docs/architecture-2025-11-30.md` - Frontend Testing) (AC: 1)

-   [ ] **Task: Integrate Supabase Client for Registration**
    -   [ ] Initialize Supabase client in `frontend/lib/supabase.ts` (if not already done)
    -   [ ] Call `supabase.auth.signUp()` with email and password upon form submission (AC: 1)
    -   [ ] Handle successful registration (e.g., redirect to a "check your email" page) (AC: 1)
    -   [ ] Handle registration errors (e.g., display error message to user) (AC: 1)

### Backend Tasks

-   [ ] **Task: Create `/api/v1/users/signup` Endpoint**
    -   [ ] Define a POST endpoint in `backend/app/api/v1/endpoints/users.py` for user registration (AC: 1)
    -   [ ] This endpoint should primarily proxy the request to Supabase Auth's registration functionality (Supabase handles the actual user creation and email sending) (AC: 1)
    -   [ ] Implement request body validation (e.g., Pydantic schema for email and password) (AC: 1)
    -   [ ] Handle responses from Supabase (success/failure) and return appropriate API responses (AC: 1)
    -   [ ] **Test Subtask:** Write integration tests using Pytest for the `/api/v1/users/signup` endpoint, covering successful registration, invalid input, and existing user scenarios. (Ref: `docs/architecture-2025-11-30.md` - Backend Testing) (AC: 1)

-   [ ] **Task: Configure Supabase Auth and RLS**
    -   [ ] Ensure Supabase project is configured to allow email/password authentication (AC: 1, 2)
    -   [ ] Verify email confirmation is enabled in Supabase Auth settings (AC: 1, 2)
    -   [ ] Implement/verify Row Level Security (RLS) policies on the `users` table to ensure only the user themselves can access or modify their own profile data. (Ref: `docs/architecture-2025-11-30.md` - Authorization) (AC: 1, 2)

### General Tasks

-   [ ] **Task: Implement Email Verification Success/Failure UI**
    -   [ ] Create a dedicated page (e.g., `frontend/app/(auth)/verify-email/`) to handle the redirection after a user clicks the email verification link. (AC: 2)
    -   [ ] Display a success message if verification is successful. (AC: 2)
    -   [ ] Display an informative error message if verification fails. (AC: 2)
    -   [ ] Provide guidance on next steps (e.g., "you can now log in"). (AC: 2)
    -   [ ] This page should also leverage `feedback_patterns_dark.html` for visual cues. (AC: 2)

-   [ ] **Task: Update Sprint Status**
    -   [ ] After story completion, update `docs/sprint-artifacts/sprint-status.yaml` to mark this story as `done`.


## Dev Notes

### Project Structure Notes
-   Frontend components for authentication should be located in `frontend/app/(auth)/`.
-   Backend API endpoints for user management should be in `backend/app/api/v1/endpoints/users.py`.
-   Use `frontend/lib/supabase.ts` for Supabase client initialization.

### References
-   **PRD:** `docs/PRD.md` (FR-001: User Authentication & Profile Management)
-   **Epics:** `docs/epics.md` (Epic 1, Story 1.3 details)
-   **Architecture Document:** `docs/architecture-2025-11-30.md` (Sections: "Authentication", "Authorization", "Project Structure", "Testing Strategy")
-   **Epic 1 Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-1.md` (Section: "Epic 1 Overview", "Authentication and Authorization")
-   **UX Design Spec:** `docs/ux-design-specification.md` (Flow 0: New User Onboarding, Flow 3 & 4: Feedback Patterns)

### Learnings from Previous Story

**From Story 1.2-core-frontend-setup (Status: done)**

-   **Architectural Guidance**: Strict adherence to the `docs/architecture-2025-11-30.md` for project structure, naming conventions (PascalCase for components, kebab-case for component files), and component organization (by feature or route) is crucial.
-   **Shared Utilities**: `frontend/lib/` should be utilized for shared utilities and functions (e.g., Supabase client).
-   **Supabase Integration**: Frontend-to-Supabase interactions should use `supabase-js`, mirroring the backend's `supabase-py` integration.
-   **Testing Setup**: The established Jest/React Testing Library setup in the frontend project is ready for use, with test files co-located in `__tests__` subdirectories.

These learnings reinforce the approach for Story 1.3, emphasizing consistency in frontend development and integration patterns with Supabase.

[Source: `docs/sprint-artifacts/1-2-core-frontend-setup.md`]

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/1-3-user-registration-email-verification.md

### Agent Model Used
Gemini

### Debug Log References
- Generated story content based on PRD, Epics, Architecture, and Tech Spec.

### Completion Notes
- Story drafted from backlog.

### Completion Notes List
- All acceptance criteria and tasks derived from source documents.
- Project structure alignment notes included.

### File List
- NEW: docs/sprint-artifacts/1-3-user-registration-email-verification.md

## Change Log

-   **onsdag 3. desember 2025**: Initial draft created by BIP (Scrum Master Agent).



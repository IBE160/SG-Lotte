# Story 1.3: User Registration & Email Verification

Status: ready-for-dev

## Story

As a new user,
I want to sign up with my email and password and verify my email,
so that I can create a secure account.

### Requirements Context Summary

**User Story:** As a new user, I want to sign up with my email and password and verify my email, so that I can create a secure account.

**Functional Requirements (from PRD):** FR-001: User Authentication & Profile Management.
The PRD states: "Users can sign up with email and password, and must verify their email. Users can log in, log out, and reset their password."

**Acceptance Criteria (from tech-spec-epic-1.md):**
*   **Given** I am on the signup page, **When** I enter valid email/password and submit, **Then** my account is created in Supabase.
*   **Given** I am on the signup page, **When** I enter valid email/password and submit, **Then** a verification email is sent to my provided email address.
*   **Given** I am on the signup page, **When** I enter valid email/password and submit, **Then** I cannot log in until my email is verified.
*   **When** I click the verification link in my email, **Then** my account is marked as verified.

**Technical Notes (from Epics.md):** Utilizes Supabase Auth for registration and email verification. Frontend UI based on `onboarding1_dark.html` (implied first step).

**Architectural Considerations (from architecture-2025-11-30.md):**
*   **Authentication:** Supabase Auth (using `@supabase/supabase-js` v2.86.0).
*   **Frontend to Supabase:** The frontend interacts directly with Supabase for authentication.
*   **API Security:** Backend API endpoints will be protected and will require a valid JWT from an authenticated user (though this story is primarily frontend/Supabase direct).
*   **Naming Patterns:** Frontend Components (React): PascalCase. Frontend Component Files: Kebab-case.
*   **Project Structure:** `frontend/src/app/(auth)/` (Authentication UI), `frontend/src/lib/` (Supabase client).

**UX/UI Considerations (from ux-design-specification.md):**
*   Flow 0: New User Onboarding, Supporting Wireframes: `onboarding1_dark.html`.
*   Feedback Patterns: `feedback_patterns_dark.html` (for success/error messages during registration/verification).

### Project Structure Alignment and Lessons Learned

**Learnings from Previous Story (1-2-core-frontend-setup):**
*   **New Services/Components Created:** Supabase client for frontend established at `frontend/lib/supabaseClient.ts`. This client should be reused for all Supabase interactions.
*   **Architectural Decisions Confirmed:** Frontend directly interacts with Supabase Auth. State management to use Zustand for client-side and SWR/React Query for server-side.
*   **Technical Debt/Pending Items:** Vercel integration (AC #2 for previous story) and its associated testing are still pending. This might impact the CI/CD of this story if not resolved.
*   **File Impact:**
    *   `frontend/lib/supabaseClient.ts`: Existing client to be used for Supabase interactions.
    *   `frontend/app/page.tsx`: Was modified in the previous story. Be aware of existing content if modifying.
    *   `frontend/package.json`: Modified in previous story. Ensure new dependencies are added correctly.

**Project Structure Alignment:**
*   **Frontend:** The authentication UI for registration and verification will reside in `frontend/src/app/(auth)/` as per architectural guidance.
*   **Supabase Client:** Continue to use and extend `frontend/lib/supabaseClient.ts`.
*   **Naming:** Adhere to PascalCase for React components and kebab-case for component files.

## Acceptance Criteria

1.  **Given** I am on the signup page, **When** I enter valid email/password and submit, **Then** my account is created in Supabase.
2.  **Given** I am on the signup page, **When** I enter valid email/password and submit, **Then** a verification email is sent to my provided email address.
3.  **Given** I am on the signup page, **When** I enter valid email/password and submit, **Then** I cannot log in until my email is verified.
4.  **When** I click the verification link in my email, **Then** my account is marked as verified.

## Tasks / Subtasks

*   **Frontend UI Development (AC: #1, #2, #3)**
    *   [ ] Create `frontend/src/app/(auth)/signup/page.tsx` for the signup form.
    *   [ ] Design and implement the signup form based on `onboarding1_dark.html` (e.g., email, password, confirm password fields).
    *   [ ] Implement client-side validation for email and password.
    *   [ ] Display appropriate feedback messages to the user (e.g., success, error) using `feedback_patterns_dark.html`.
*   **Supabase Integration (AC: #1, #2, #3, #4)**
    *   [ ] Utilize `frontend/lib/supabaseClient.ts` to implement user registration with email and password.
    *   [ ] Configure Supabase to send email verification links upon registration.
    *   [ ] Implement a mechanism to handle user redirection after clicking the verification link (e.g., a dedicated `frontend/src/app/(auth)/verify-email/page.tsx`).
    *   [ ] Handle Supabase authentication state changes to prevent login until email is verified.
*   **Testing (AC: #1, #2, #3, #4)**
    *   [ ] Write unit tests for the signup form component (e.g., form submission, input changes, validation).
    *   [ ] Write integration tests for the Supabase registration and email verification flow (mocking Supabase responses as needed).
    *   [ ] Implement end-to-end tests (if E2E framework is set up) to simulate the full user registration and email verification process.
*   **Documentation:**
    *   [ ] Update `frontend/src/app/(auth)/layout.tsx` if necessary for authentication routes.
    *   [ ] Add notes on any new Supabase Auth configurations.

## Dev Notes

*   **Relevant architecture patterns and constraints**:
    *   Authentication will be handled by Supabase Auth directly from the frontend.
    *   UI components should follow the dark theme and feedback patterns defined in `ux-design-specification.md`.
    *   Consider the implications of the pending Vercel integration from the previous story for deployment and environment variables.
*   **Source tree components to touch**:
    *   `frontend/src/app/(auth)/signup/page.tsx` (new)
    *   `frontend/src/app/(auth)/verify-email/page.tsx` (new)
    *   `frontend/lib/supabaseClient.ts` (reuse/extend)
    *   `frontend/src/app/(auth)/layout.tsx` (potentially modify)
    *   `frontend/package.json` (add new dependencies if needed for forms/validation)
*   **Testing standards summary**:
    *   `React Testing Library` with `Jest` for frontend tests.
    *   Focus on mocking Supabase for isolated component testing.
    *   Consider `Playwright` or `Cypress` for E2E once set up.

### Project Structure Notes

- New authentication-related pages should be created under `frontend/src/app/(auth)/`.
- Re-use the existing `supabaseClient.ts` for all Supabase interactions.

### References

*   [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Story-13-User-Registration--Email-Verification]
*   [Source: docs/epics.md#Story-13-User-Registration--Email-Verification]
*   [Source: docs/PRD.md#FR-001-User-Authentication--Profile-Management]
*   [Source: docs/architecture-2025-11-30.md#Security-Architecture]
*   [Source: docs/ux-design-specification.md#Flow-0-New-User-Onboarding]
*   [Source: docs/sprint-artifacts/1-2-core-frontend-setup.md#Dev-Agent-Record]

### Learnings from Previous Story

**From Story 1-2-core-frontend-setup (Status: done)**

- **New Service Created**: `Supabase client` for frontend established at `frontend/lib/supabaseClient.ts` - use this client for all Supabase interactions.
- **Architectural Decision Confirmed**: Frontend directly interacts with Supabase Auth. State management to use Zustand for client-side and SWR/React Query for server-side.
- **Technical Debt/Pending Items**: Vercel integration (AC #2 for previous story) and its associated testing are still pending. This might impact the CI/CD of this story if not resolved.
- **File Impact**:
    - `frontend/lib/supabaseClient.ts`: Existing client to be used for Supabase interactions.
    - `frontend/app/page.tsx`: Was modified in the previous story. Be aware of existing content if modifying.
    - `frontend/package.json`: Modified in previous story. Ensure new dependencies are added correctly.

[Source: docs/sprint-artifacts/1-2-core-frontend-setup.md#Dev-Agent-Record]

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/1-3-user-registration-email-verification.context.xml

### Agent Model Used
gemini-cli-agent

### Debug Log References

### Completion Notes List

### File List

## Change Log
- **tirsdag 9. desember 2025**: Corrected ACs to align with `tech-spec-epic-1.md`, updated task mappings, and cited the tech spec as the authoritative source.
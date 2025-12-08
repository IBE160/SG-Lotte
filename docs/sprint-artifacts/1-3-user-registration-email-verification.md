# Story 1.3: User Registration & Email Verification

Status: drafted

### Requirements Context Summary

This story focuses on the foundational user authentication process, enabling new users to create a secure account and verify their email. It directly addresses **FR-001: User Authentication & Profile Management** from the PRD, specifically the ability for users to sign up with email and password and verify their email.

The primary acceptance criteria from the epics outline a secure and standard registration flow:
- Account creation in Supabase upon valid email/password submission.
- Automatic dispatch of a verification email.
- Restriction of login until email verification is complete.
- Account status marked as verified upon successful verification link click.

From the architecture perspective, **Supabase Auth** is the designated solution for handling both user registration and email verification. This leverages a secure, external service, reducing the need for custom authentication logic. The frontend will interact directly with Supabase Auth for these operations.

**Sources:**
- [Epics: Story 1.3 User Registration & Email Verification](../epics.md#story-13-user-registration--email-verification)
- [PRD: FR-001 User Authentication & Profile Management](../PRD.md#fr-001-user-authentication--profile-management)
- [Architecture: Technology Stack Details (Authentication)](../architecture-2025-11-30.md#technology-stack-details)
- [Architecture: Security Architecture (Authentication)](../architecture-2025-11-30.md#security-architecture)

## Project Structure Alignment and Lessons Learned

This story builds upon the foundational setup established in the previous stories.

**Key Learnings from Previous Story (1.2 Core Frontend Setup):**
- The Supabase client (`frontend/lib/supabaseClient.ts`) was successfully set up and is available for reuse in this story for authentication interactions.
- Ensure the "Dev Agent Record" in this story is fully completed to provide valuable context for future stories.
- The Vercel integration for the frontend was pending in the previous story. This doesn't directly block this story but is noted for overall project tracking.

**Project Structure Alignment:**
- Frontend components related to user registration will reside within `frontend/src/app/(auth)/` as per the architectural guidelines.
- Supabase interactions will utilize the existing `frontend/lib/supabaseClient.ts`.
- Backend endpoints for user management will be located in `backend/app/api/v1/endpoints/users.py`.

**Sources:**
- [Architecture: Project Structure](..//architecture-2025-11-30.md#project-structure)
- [Previous Story: 1.2 Core Frontend Setup](1-2-core-frontend-setup.md)

## Story

As a new user,
I want to sign up with my email and password and verify my email,
So that I can create a secure account.

## Acceptance Criteria

1.  **Given** I am on the signup page, **When** I enter valid email/password and submit, **Then** my account is created in Supabase. (Source: `epics.md`)
2.  **Given** I am on the signup page, **When** I enter valid email/password and submit, **Then** a verification email is sent to my provided email address. (Source: `epics.md`)
3.  **Given** I have an unverified account, **When** I try to log in, **Then** I cannot log in until my email is verified. (Source: `epics.md`)
4.  **Given** I have an unverified account, **When** I click the verification link in my email, **Then** my account is marked as verified. (Source: `epics.md`)

## Tasks / Subtasks

-   [ ] **Frontend: Signup UI (AC: #1, #2):**
    -   [ ] Create a signup form component in `frontend/src/app/(auth)/signup/page.tsx`
    -   [ ] Implement input fields for email and password.
    -   [ ] Implement client-side validation for email and password.
    -   [ ] Integrate with Supabase client to handle user registration (`supabase.auth.signUp()`).
    -   [ ] Handle success and error states in the UI.
    -   [ ] **Testing:** Unit tests for form component and integration tests for Supabase sign-up call.
-   [ ] **Frontend: Login UI (AC: #3):**
    -   [ ] Create a login form component in `frontend/src/app/(auth)/login/page.tsx`.
    -   [ ] Implement input fields for email and password.
    -   [ ] Integrate with Supabase client to handle user login (`supabase.auth.signInWithPassword()`).
    -   [ ] Handle unverified email error message.
    -   [ ] **Testing:** Unit tests for form component and integration tests for Supabase login call.
-   [ ] **Supabase Configuration:**
    -   [ ] Ensure Supabase project is configured for email authentication.
    -   [ ] Verify email templates for verification are set up in Supabase.
-   [ ] **Backend (Optional but good practice):**
    -   [ ] Create a basic user creation endpoint if additional backend logic is required beyond direct Supabase client interaction (e.g., custom user roles, initial data setup). For this story, direct frontend-to-Supabase is sufficient, but note for future expansion.
-   [ ] **Testing:**
    -   [ ] End-to-end test for user registration, email verification flow, and login with verified/unverified accounts.
    -   [ ] **Verification (AC: #4):** Manually or through automated tests, confirm that clicking the verification link correctly marks the user's account as verified in Supabase.

## Dev Notes

-   **Relevant architecture patterns and constraints**:
    *   **Authentication:** Supabase Auth is the designated solution, using JWTs.
    *   **Frontend-Supabase Interaction:** Direct client-side interaction using `@supabase/supabase-js`.
    *   **Frontend Component Structure:** `frontend/src/app/(auth)/` for authentication-related UI, following the project's structure pattern.
-   **Source tree components to touch**:
    *   `frontend/src/app/(auth)/signup/page.tsx` (new component for signup UI)
    *   `frontend/src/app/(auth)/login/page.tsx` (new component for login UI)
    *   `frontend/lib/supabaseClient.ts` (existing, will be utilized for Supabase client interactions)
    *   Supabase project configuration (email templates, auth settings within Supabase dashboard)
-   **Testing standards summary**:
    *   Frontend unit tests will use `React Testing Library` with `Jest`.
    *   Integration tests will focus on Frontend-Supabase Auth communication.
    *   End-to-end tests should cover the full registration, email verification, and login flow.

### Project Structure Notes

-   Frontend authentication-related pages and components should be organized under `frontend/src/app/(auth)/` as per the defined project structure patterns. This includes `signup` and `login` pages.

### Learnings from Previous Story

**From Story 1.2 Core Frontend Setup (Status: done)**

-   **Pending Action Item**: Vercel Integration (AC: #2) for `1-2-core-frontend-setup` is still pending. While not directly blocking this story, it's a reminder of overall project setup.
-   **Recommendation for Next Story**: Ensure the "Dev Agent Record" in this story is fully completed upon finishing the implementation, to provide valuable context for future stories.
-   **Reusable Component**: The `supabaseClient.ts` in `frontend/lib/` was set up and is available for use in this story. Other new frontend components like `frontend/app/api/test-backend/route.ts` and modifications to `frontend/app/page.tsx` demonstrate patterns for API interaction and page structure that may be useful.

[Source: stories/1-2-core-frontend-setup.md#Dev-Agent-Record]

### References

- [Source: ../epics.md#Story-13-User-Registration--Email-Verification]
- [Source: ../PRD.md#fr-001-user-authentication--profile-management]
- [Source: ../architecture-2025-11-30.md#technology-stack-details]
- [Source: ../architecture-2025-11-30.md#security-architecture]
- [Source: ../architecture-2025-11-30.md#project-structure]
- [Source: 1-2-core-frontend-setup.md]
- [Source: tech-spec-epic-1.md#Story-13-User-Registration--Email-Verification]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

gemini-cli-agent

### Debug Log References

### Completion Notes List

### File List

## Change Log

- **mandag 8. desember 2025**: Initial draft generated by gemini-cli-agent using `create-story` workflow.
- **mandag 8. desember 2025**: Fixed absolute paths in citations to be relative for improved portability.



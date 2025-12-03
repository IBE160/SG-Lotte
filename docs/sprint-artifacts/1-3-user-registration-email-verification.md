# Story 1.3: User Registration & Email Verification

Status: drafted

## Story

As a new user,
I want to sign up with my email and password and verify my email,
so that I can create a secure account.

## Requirements Context Summary

This story implements the first step of the user journey: creating a secure, verifiable user account. It directly addresses **FR-001** from the PRD.

-   **Functional Goal:** Allow a new user to register using their email and a password. The system must enforce email verification before granting access to the application.
-   **Technical Implementation:** This will be handled primarily by Supabase Auth, as defined in both the main Architecture document and the Epic 1 Tech Spec.
-   **Frontend:** The UI for this flow is specified by the initial onboarding wireframe, `onboarding1_dark.html`. The frontend will use the `@supabase/supabase-js` library to interact with the authentication service.
-   **Backend:** The backend's role is to validate the JWT provided by the frontend for protected routes. No special user creation endpoint is needed, as Supabase handles it.

### References

-   **PRD:** `docs/PRD.md` (FR-001)
-   **Epics:** `docs/epics.md` (Story 1.3)
-   **Architecture:** `docs/architecture-2025-11-30.md` (Authentication, Security Architecture)
-   **Epic 1 Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-1.md` (Authentication and Authorization)
-   **UX Design:** `docs/ux-design-specification.md` and `docs/ux-design/wireframes/onboarding1_dark.html`

## Project Structure Alignment Summary

The previous two stories (1.1 and 1.2) successfully established the backend and frontend foundations, respectively. They created and modified files within the `backend/` and `frontend/` directories as expected by the architecture.

For this story (1.3), the focus is on integrating Supabase authentication into the frontend. The learnings from the previous stories reinforce the need to:

*   **Strictly adhere to the `docs/architecture-2025-11-30.md`** for frontend project structure, naming conventions, and component organization.
*   **Place any new UI components** related to authentication (e.g., signup form) within a feature-specific directory like `frontend/app/(auth)/` or `frontend/components/auth/`.
*   **Use `frontend/lib/` for any shared Supabase client or authentication utility functions.**
*   **Ensure new tests** for the signup functionality are co-located with their components in `__tests__` subdirectories.

The successful setup of both backend and frontend indicates that the architectural guidelines are actionable and should be directly applied to this story to maintain consistency.

## Acceptance Criteria

1.  **Given** I am on the signup page, **when** I enter a valid email and password and submit, **then** my account is created in the Supabase `auth.users` table.
2.  A verification email is sent to my provided email address.
3.  I cannot log in with my credentials until my email is verified.
4.  **When** I click the verification link in my email, **then** my account is marked as verified in Supabase.
5.  After verification, I can successfully log in.

## Tasks / Subtasks

-   [ ] **Task: Create Signup UI Component.** (AC: 1)
    -   [ ] Create a new React component for the registration form based on `onboarding1_dark.html`.
    -   [ ] Place the component in an appropriate directory (e.g., `frontend/components/auth/SignUpForm.tsx`).
    -   [ ] Implement form fields for email and password with basic validation (e.g., password length).

-   [ ] **Task: Integrate Supabase Authentication.** (AC: 1, 2, 3, 4, 5)
    -   [ ] Add the `@supabase/supabase-js` package to the frontend.
    -   [ ] Create a Supabase client utility in `frontend/lib/supabase.ts`.
    -   [ ] Implement the `supabase.auth.signUp()` function call on form submission.
    -   [ ] Implement a login function using `supabase.auth.signInWithPassword()`.
    -   [ ] Protect a test page to verify that un-verified users cannot access it.

-   [ ] **Task: Create Email Verification Flow.** (AC: 2, 4)
    -   [ ] Configure the email template in the Supabase dashboard (manual step, to be noted).
    -   [ ] Ensure the verification link redirects to a success page on the frontend.
    -   [ ] Display a message to the user on the signup page instructing them to check their email.

-   [ ] **Task: Write Tests.** (AC: 1, 3, 5)
    -   [ ] Write a component test for the `SignUpForm` component to check form rendering and input.
    -   [ ] Write an integration test to mock the `supabase.auth.signUp` call and verify its behavior on success and error.
    -   [ ] Write a test to verify that a protected route redirects unauthenticated users.

## Dev Notes

-   **Authentication:** This story relies entirely on Supabase for the authentication flow. The backend is not involved in the user registration process itself but will need to validate JWTs on protected routes in future stories. [Source: `docs/architecture-2025-11-30.md#Authentication`]
-   **Frontend Focus:** All work for this story is in the `frontend/` directory.
-   **UI:** The primary UI is the signup form, which should be based on the `onboarding1_dark.html` wireframe.
-   **Testing:** Use Jest and React Testing Library for frontend tests. Mock Supabase client interactions. [Source: `docs/architecture-2025-11-30.md#Testing-Strategy`]

### Learnings from Previous Story: Core Frontend Setup (1.2)

**From Story 1.2-core-frontend-setup (Status: done)**

-   **Completion Notes**: The Next.js project structure is initialized, and a basic API call to the backend is functional. Jest and React Testing Library are configured and ready for use.
-   **Key Files Created/Modified**: The entire `frontend/` directory was established, including `next.config.ts`, `package.json`, and `app/page.tsx`.
-   **Architectural Decisions**: Adherence to the Next.js App Router structure was successful. The setup of basic testing provides a pattern to follow for this story's tests.
-   **Warnings for Next Story**: Vercel deployment is a manual step that needs to be configured for the project if not already done.

[Source: `docs/sprint-artifacts/1-2-core-frontend-setup.md`]

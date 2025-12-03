### Story 1.3: User Registration & Email Verification

Status: ready-for-dev

## Story

As a new user,
I want to sign up with my email and password and verify my email,
so that I can create a secure account.

### Story 1.3: User Registration & Email Verification

**Overview:** This story focuses on enabling new users to securely register, verify their email, and gain access to the application. It leverages Supabase Auth for core authentication flows and aligns with the defined project structure for both frontend and backend components.

## Acceptance Criteria

1.  **Given** I am on the signup page, **When** I enter valid email/password and submit, **Then** my account is created in Supabase.
2.  **Given** my account is created, **Then** a verification email is sent to my provided email address.
3.  **Given** my email is not verified, **Then** I cannot log in.
4.  **Given** I receive a verification email, **When** I click the verification link, **Then** my account is marked as verified.

**Key Architectural Context & Constraints:**
*   **Authentication:** Handled by Supabase Auth (using `@supabase/supabase-js` v2.86.0). Supabase Auth will manage user registration, email verification, and JWT-based secure sessions.
*   **Authorization:** Supabase's Row Level Security (RLS) must be enabled on relevant tables to restrict user data access.
*   **Frontend UI:** The signup process will be based on the `onboarding1_dark.html` wireframe and implemented within `frontend/src/app/(auth)/` using Next.js, TypeScript, and Tailwind CSS.
*   **Backend Integration:** The backend will include API endpoints for user-related actions, with authentication managed via Supabase.
*   **Testing:** Frontend tests will use `React Testing Library` with `Jest`, and backend tests will use `Pytest`.

**Component References:**
*   **Frontend:** `frontend/src/app/(auth)/` (for signup UI), `supabase-js` library for client-side authentication.
*   **Backend:** `app/api/v1/endpoints/users.py` (for user-related API interactions), Supabase for authentication and database.
*   **Wireframes:** `onboarding1_dark.html` (for the initial signup UI).

### Project Structure Alignment Summary

Building on the successful setup of the core backend and frontend, this story will adhere to the established project structure and architectural patterns. Key takeaways from the previous story (`1-2-core-frontend-setup`) inform the implementation:

*   **Frontend Structure:**
    *   Authentication-related UI components and pages will reside under `frontend/src/app/(auth)/`.
    *   `frontend/lib/` should be utilized for any shared utilities or functions related to authentication and user management.
    *   Testing files for frontend components should be co-located within `__tests__` subdirectories.
*   **Backend Integration:**
    *   The backend will expose API endpoints in `app/api/v1/endpoints/users.py` for user registration and management.
    *   Supabase integration for authentication (`supabase-js` on the frontend, Supabase client on the backend) should be consistent with established patterns.
*   **Architectural Adherence:**
    *   Continue to strictly follow the guidelines in `docs/architecture-2025-11-30.md` for project structure, naming conventions (PascalCase for components, kebab-case for component files), and component organization.
    *   Ensure all data access is governed by Supabase RLS policies.

No conflicts with `unified-project-structure.md` were detected as the file was not found. The learnings from previous stories emphasize maintaining a consistent and well-organized codebase, particularly within the distinct `frontend/` and `backend/` domains.

## Tasks / Subtasks

-   [ ] **Task: Implement User Registration UI and Logic (Frontend)**
    -   [ ] Create signup form components based on `onboarding1_dark.html` wireframe.
    -   [ ] Implement client-side validation for email and password.
    -   [ ] Integrate Supabase client (`supabase-js`) for user registration.
    -   [ ] Handle successful registration (e.g., display message, redirect to email verification notice).
    -   [ ] Handle registration errors (e.g., display error messages).
    -   [ ] **Test Subtask:** Write unit/integration tests for the signup form components.
    -   **Test Subtask:** Write integration tests for successful user registration and error handling via Supabase.
    -   *AC Reference:* 1, 2
    *   *Source:* `docs/architecture-2025-11-30.md`, `tech-spec-epic-1.md`, `ux-design-specification.md`

-   [ ] **Task: Configure Supabase for Email Verification**
    -   [ ] Ensure email verification is enabled in Supabase authentication settings.
    -   [ ] Customize email templates if necessary.
    -   *AC Reference:* 2
    *   *Source:* `tech-spec-epic-1.md`

-   [ ] **Task: Implement Login Flow with Email Verification Check (Frontend)**
    -   [ ] Create login form components.
    -   [ ] Integrate Supabase client (`supabase-js`) for user login.
    -   [ ] Implement logic to check if the user's email is verified after login attempt.
    -   [ ] If not verified, display appropriate message and prevent access to protected routes.
    -   [ ] **Test Subtask:** Write unit/integration tests for the login form components.
    -   **Test Subtask:** Write integration tests for login attempts with unverified and verified emails.
    -   *AC Reference:* 3
    *   *Source:* `docs/architecture-2025-11-30.md`, `tech-spec-epic-1.md`

-   [ ] **Task: Implement Email Verification Callback Handling (Frontend/Backend)**
    -   [ ] (Frontend) Implement a page/component to handle the callback from the email verification link.
    -   [ ] (Backend) If necessary, create an API endpoint to process the verification callback and update user status (though Supabase often handles this directly).
    -   [ ] **Test Subtask:** Write integration tests to simulate email verification callback and status update.
    -   *AC Reference:* 4
    *   *Source:* `docs/architecture-2025-11-30.md`, `tech-spec-epic-1.md`

-   [ ] **Task: Implement Row Level Security (RLS) for User Data (Supabase)**
    -   [ ] Identify tables that will store user-specific data (e.g., `profiles`, `plans`).
    -   [ ] Create appropriate RLS policies to ensure users can only access their own data.
    -   [ ] **Test Subtask:** Write integration tests to verify RLS policies prevent unauthorized data access.
    -   *AC Reference:* Architectural Constraint
    *   *Source:* `docs/architecture-2025-11-30.md`, `tech-spec-epic-1.md`

## Dev Notes

-   **Frontend Implementation:**
    -   User registration UI will be developed within `frontend/src/app/(auth)/` using Next.js, TypeScript, and Tailwind CSS, aligning with the `onboarding1_dark.html` wireframe.
    -   Supabase client (`supabase-js`) will be integrated for client-side authentication logic (registration, login, email verification handling).
    -   Reusable authentication-related utilities should be placed in `frontend/lib/`.
-   **Backend Integration:**
    -   Backend API endpoints for user management will be located in `backend/app/api/v1/endpoints/users.py`.
    -   Supabase's authentication capabilities will be leveraged, minimizing custom backend authentication logic.
-   **Database & Security:**
    -   Supabase Auth will handle user accounts and email verification directly.
    -   Row Level Security (RLS) policies must be implemented on relevant database tables to ensure data isolation and prevent unauthorized access.
-   **Testing Strategy:**
    -   Frontend tests for components and integration will use `React Testing Library` with `Jest`. Test files should be co-located in `__tests__` subdirectories.
    -   Backend unit and integration tests for API endpoints will use `Pytest` and reside in `backend/tests/`.

### Project Structure Notes

-   Authentication-related UI components and pages will reside under `frontend/src/app/(auth)/`.
-   `frontend/lib/` should be utilized for any shared utilities or functions related to authentication and user management.
-   Testing files for frontend components should be co-located within `__tests__` subdirectories.
-   The backend will expose API endpoints in `app/api/v1/endpoints/users.py` for user registration and management.
-   Supabase integration for authentication (`supabase-js` on the frontend, Supabase client on the backend) should be consistent with established patterns.
-   Continue to strictly follow the guidelines in `docs/architecture-2025-11-30.md` for project structure, naming conventions (PascalCase for components, kebab-case for component files), and component organization.
-   Ensure all data access is governed by Supabase RLS policies.

### References

-   **Architecture Document:** `docs/architecture-2025-11-30.md` (for project structure, technology stack, security, and testing strategy)
-   **Epic Breakdown:** `docs/epics.md` (for story statement and acceptance criteria)
-   **Epic 1 Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-1.md` (for detailed design and requirements alignment)
-   **UX Design Specification:** `docs/ux-design-specification.md` (for `onboarding1_dark.html` wireframe context)

## Dev Agent Record

### Context Reference

- C:/IT_studier/IBE160_Programmering_med_KI/Prosjektmappe/Prosjekt/SG-Lotte/docs/sprint-artifacts/1-3-user-registration-email-verification.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

-   **{{date}}**: Initial draft created by BIP (Scrum Master Agent).


### Learnings from Previous Story

**From Story 1.2-core-frontend-setup (Status: done)**

-   **Architectural Guidance**: Reinforced adherence to established project structure (frontend/app, frontend/lib, testing in `__tests__` subdirectories) and consistent naming conventions. Integration with `supabase-js` for frontend-to-Supabase interactions is key.
-   **Warnings for Next**: Vercel deployment of the frontend is a manual step for the user.

[Source: `docs/sprint-artifacts/1-2-core-frontend-setup.md#Dev-Agent-Record`]
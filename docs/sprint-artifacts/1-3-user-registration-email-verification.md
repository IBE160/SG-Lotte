---
id: 1-3
epic: 1
title: User Registration & Email Verification
status: ready-for-dev
author: sm
created: 2025-12-11
---

### User Story

As a **new user**, I want to **create an account using my email and password**, so that I can **securely access the application after verifying my email address**.

### Description

This story covers the implementation of the user registration flow. A new user must be able to sign up for the service, receive a verification email to confirm their identity, and only be granted access to the application after successfully verifying their email. This process is critical for ensuring user accounts are valid and secure. The frontend will interact directly with Supabase Auth for this functionality.

### Acceptance Criteria

1.  **Given** I am a new, unauthenticated user on the signup page,
    **When** I submit a valid email address and a strong password,
    **Then** a new user account is created in the Supabase `auth.users` table.

2.  **Given** a new account has been successfully created,
    **When** the system processes the registration,
    **Then** a verification email with a unique confirmation link is automatically sent to the provided email address.

3.  **Given** I have registered but not yet verified my email,
    **When** I attempt to log in,
    **Then** I am shown a message indicating that my account is pending verification and login is denied.

4.  **Given** I have received the verification email,
    **When** I click the unique verification link,
    **Then** my user account is marked as 'verified' in Supabase, and I am redirected to the login page with a success message.

### Tasks / Subtasks

- [ ] **Frontend: Registration Form UI** (AC: #1)
    - [ ] Create a new registration form component in `frontend/src/app/(auth)/signup/page.tsx`.
    - [ ] The form should have fields for email and password.
    - [ ] Implement client-side validation for email format and password strength (e.g., using a library like Zod).

- [ ] **Frontend: Supabase Registration Integration** (AC: #1, #2)
    - [ ] On form submission, call `supabase.auth.signUp({ email, password })` directly from the frontend.
    - [ ] Ensure the function call is wrapped in a `try...catch` block to handle potential errors from Supabase (e.g., user already exists, weak password).
    - [ ] On successful registration, display a success message to the user instructing them to check their email for verification.

- [ ] **Frontend: Login Flow Update** (AC: #3)
    - [ ] Modify the login component to handle unverified users.
    - [ ] When a login attempt is made, check the user's `email_confirmed_at` status from Supabase.
    - [ ] If the email is not confirmed, display a message indicating that the account is pending verification and prevent login.

- [ ] **Frontend: Email Verification Redirect Handling** (AC: #4)
    - [ ] Configure Supabase project settings to redirect to a specific frontend route (e.g., `/auth/email-verified`) after successful email verification.
    - [ ] Create a simple "email verified" screen or handle the redirect to the login page with a success message on the frontend.

- [ ] **Testing**
    - [ ] **Frontend (Unit/Integration):** Write tests for the registration form component, including validation and Supabase call mocking. (AC: #1)
    - [ ] **E2E:** Write an end-to-end test that simulates the entire user registration and email verification flow. This will require mocking email verification or using a test email service. (AC: #1, #2, #3, #4)

### Dev Notes

#### Learnings from Previous Story (1.2: Core Frontend Setup)
The completion of story 1.2 provided a fully configured Next.js frontend environment connected to a Vercel deployment pipeline. This means there is a ready platform to build the UI components for this story. The key learning is that the frontend is now ready for feature development and can make API calls to the backend, which was established in story 1.1.

#### Architecture patterns and constraints
*   **Frontend:** The registration UI will be built within the `src/app/(auth)/` directory. User registration and email verification will be handled directly by the frontend interacting with Supabase Auth.
*   **Security:** All authentication logic is delegated to Supabase Auth, which is the single source of truth for user identity. RLS policies must be in place for any tables containing user data.

#### API Key Management
*   **NEVER** hard-code API keys or secrets directly in the source code.
*   **Local Development:** Use a `.env.local` file at the root of the `frontend` project to store these keys. This file should be listed in `.gitignore` to prevent it from being committed to version control.
*   **Production:** In platforms like Vercel, secrets are managed as environment variables in the project settings. The application will read these keys from the environment at runtime.

#### AI Integration
The user prompt mentioned "Pydantic AI framework with Gemini 2.5.flash". For this specific story (1.3), there is no direct AI integration. This integration becomes relevant in subsequent stories like 1.5 (Initial AI Plan Generation).

### References
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#story-13-user-registration--email-verification]
- [Source: docs/epics.md#story-13-user-registration--email-verification]
- [Source: docs/architecture-2025-11-30.md#system-architecture-alignment]
- [Source: docs/sprint-artifacts/1-2-core-frontend-setup.md]

### Dev Agent Record
- **Context Reference**:
  - `C:\IT_studier\IBE160_Programmering_med_KI\Prosjektmappe\Prosjekt\SG-Lotte\docs/sprint-artifacts/1-3-user-registration-email-verification.context.xml`
- **Agent Model Used**:
- **Debug Log References**:
- **Completion Notes List**:
- **File List**:

### Change Log
- 2025-12-11: Initial draft.
- 2025-12-11: Addressed validation feedback: added tasks, references, and corrected previous story learnings.
- 2025-12-11: Updated to reflect direct frontend interaction with Supabase Auth for user registration and email verification, removing all backend involvement for these specific tasks.
- 2025-12-11: Generated story context and marked as ready for dev.

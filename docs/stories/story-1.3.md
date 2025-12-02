### Story 1.3: User Registration & Email Verification
Status: drafted

As a new user,
I want to sign up with my email and password and verify my email,
So that I can create a secure account.

**Acceptance Criteria:** [Source: docs/sprint-artifacts/tech-spec-epic-1.md]

*   **Given** I am on the signup page
*   **When** I enter valid email/password and submit
*   **Then** my account is created in Supabase
*   **And** a verification email is sent to my provided email address
*   **And** I cannot log in until my email is verified
*   **When** I click the verification link in my email
*   **Then** my account is marked as verified

**Prerequisites:** Story 1.1, Story 1.2

**Tasks:**
*   **Task 1.3.1:** Implement the user signup form on the frontend. (AC: 1.3.1)
*   **Task 1.3.2:** Configure the backend to use Supabase Auth for sending verification emails. (AC: 1.3.2)
*   **Task 1.3.3:** Implement frontend and backend logic to prevent login for unverified emails. (AC: 1.3.3)
*   **Task 1.3.4:** Create the backend endpoint and frontend logic to handle the email verification link. (AC: 1.3.4)
*   **Testing Subtasks:**
    *   Write a component test for the signup form. (AC: 1.3.1)
    *   Write an integration test to ensure the verification email is sent after signup. (AC: 1.3.2)
    *   Write an E2E test to simulate a full registration and email verification flow. (AC: 1.3.1, 1.3.2, 1.3.3, 1.3.4)

**Technical Notes:**
Utilizes Supabase Auth for registration and email verification. Frontend UI based on `onboarding1_dark.html` (implied first step).

**Architecture patterns and constraints:**
*   Supabase Auth for user authentication and email verification.
*   Frontend handles user input and displays verification status.

**References:**
*   [Source: docs/epics.md]
*   [Source: docs/sprint-artifacts/tech-spec-epic-1.md]
*   [Source: docs/architecture-2025-11-30.md]
*   [Source: onboarding1_dark.html - Assumed UI template]

---

### Dev Agent Record
*   **Context Reference:** Correcting story quality based on validation report.
*   **Agent Model Used:** Gemini
*   **Prompt:** Fix validation report issues for story-1.3.md.
*   **Output:** Updated story-1.3.md with missing sections and citations.
*   **Comments:** Added Status, AC Source, Tasks, Architecture patterns and constraints, References, Dev Agent Record, and Change Log.
*   **Completion Notes List:**
    *   [ ] Note 1
*   **File List:**
    *   [ ] `docs/stories/story-1.3.md` (MODIFIED)

---

### Change Log
*   **2025-12-02:** Added Status, AC Source, Tasks, Architecture patterns and constraints, References, Dev Agent Record, and Change Log sections based on validation report.

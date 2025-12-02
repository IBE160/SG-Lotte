### Story 3.3: Account Management
Status: drafted

As an engaged user,
I want options to change my password or delete my account from the settings page,
So I have full control over my account.

**Acceptance Criteria:** [Source: docs/sprint-artifacts/tech-spec-epic-3.md]

*   **Given** I am on the settings page
*   **When** I select "Change Password"
*   **Then** I am prompted to enter my old and new passwords
*   **And** my password is updated securely via Supabase Auth
*   **When** I select "Delete Account"
*   **Then** I am prompted for confirmation
*   **And** my account and associated data are securely deleted from the system

**Prerequisites:** Epic 1 completion.

**Tasks:**
*   **Task 3.3.1:** Implement the UI for changing the password. (AC: 3.3.1)
*   **Task 3.3.2:** Integrate Supabase Auth for secure password updates. (AC: 3.3.1)
*   **Task 3.3.3:** Implement the UI for account deletion confirmation. (AC: 3.3.2)
*   **Task 3.3.4:** Create the backend API endpoints for secure account deletion. (AC: 3.3.3)
*   **Testing Subtasks:**
    *   Write an E2E test for the password change flow. (AC: 3.3.1)
    *   Write an E2E test for the account deletion flow, including data verification. (AC: 3.3.2, 3.3.3)

**Technical Notes:**
Frontend UI, API endpoints integrating with Supabase Auth for password change and account deletion.

**Architecture patterns and constraints:**
*   Frontend UI for account management.
*   Supabase Auth for password change and account deletion.

**References:**
*   [Source: docs/epics.md]
*   [Source: docs/sprint-artifacts/tech-spec-epic-3.md]
*   [Source: docs/architecture-2025-11-30.md]

---

### Dev Agent Record
*   **Context Reference:** Correcting story quality based on validation report.
*   **Agent Model Used:** Gemini
*   **Prompt:** Fix validation report issues for story-3.3.md.
*   **Output:** Updated story-3.3.md with missing sections and citations.
*   **Comments:** Added Status, AC Source, Tasks, Architecture patterns and constraints, References, Dev Agent Record, and Change Log.
*   **Completion Notes List:**
    *   [ ] Note 1
*   **File List:**
    *   [ ] `docs/stories/story-3.3.md` (MODIFIED)

---

### Change Log
*   **2025-12-02:** Added Status, AC Source, Tasks, Architecture patterns and constraints, References, Dev Agent Record, and Change Log sections based on validation report.

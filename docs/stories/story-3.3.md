### Story 3.3: Account Management
Status: Backlog

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
*   **AC 3.3.1:** Implement UI for changing password.
*   **AC 3.3.2:** Integrate Supabase Auth for secure password update.
*   **AC 3.3.3:** Implement UI for account deletion confirmation.
*   **AC 3.3.4:** Create API endpoints for secure account deletion.
*   **Testing:** E2E test password change and account deletion flows.

**Technical Notes:**
Frontend UI, API endpoints integrating with Supabase Auth for password change and account deletion.

**Architecture patterns and constraints:**
*   Frontend UI for account management.
*   Supabase Auth for password change and account deletion.

**References:**
*   [Source: docs/epics.md]
*   [Source: docs/sprint-artifacts/tech-spec-epic-3.md]

---

### Dev Agent Record
*   **Context Reference:** Correcting story quality based on validation report.
*   **Agent Model Used:** Gemini
*   **Prompt:** Fix validation report issues for story-3.3.md.
*   **Output:** Updated story-3.3.md with missing sections and citations.
*   **Comments:** Added Status, AC Source, Tasks, Architecture patterns and constraints, References, Dev Agent Record, and Change Log.

---

### Change Log
*   **2025-12-02:** Added Status, AC Source, Tasks, Architecture patterns and constraints, References, Dev Agent Record, and Change Log sections based on validation report.

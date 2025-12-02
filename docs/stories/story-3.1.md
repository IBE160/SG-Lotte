### Story 3.1: User Profile Page
Status: drafted

As an engaged user,
I want a dedicated profile page to view and update my personal information and fitness goals,
So I have a central place to manage my identity.

**Acceptance Criteria:** [Source: docs/sprint-artifacts/tech-spec-epic-3.md]

*   **Given** I navigate to the profile page
*   **When** the page loads
*   **Then** I see my name, email, and current fitness goals
*   **And** I can edit my personal details (e.g., name, primary goal) which are then saved to my user profile

**Prerequisites:** Epic 1 completion.

**Tasks:**
*   **Task 3.1.1:** Implement the UI for displaying the user's name, email, and fitness goals. (AC: 3.1.1)
*   **Task 3.1.2:** Implement the UI for editing personal details. (AC: 3.1.2)
*   **Task 3.1.3:** Create the backend API endpoints for retrieving and updating user profile data. (AC: 3.1.2)
*   **Testing Subtasks:**
    *   Write a frontend component test for the profile page display. (AC: 3.1.1)
    *   Write a frontend component test for the profile editing UI. (AC: 3.1.2)
    *   Write an API test for the profile data endpoints. (AC: 3.1.2)

**Technical Notes:**
Frontend UI development based on `profilepage_dark.html`, API endpoints for retrieving and updating user profile data.

**Architecture patterns and constraints:**
*   Frontend UI for user profile management.
*   Backend API for CRUD operations on user profile data.

**References:**
*   [Source: docs/epics.md]
*   [Source: docs/sprint-artifacts/tech-spec-epic-3.md]
*   [Source: docs/architecture-2025-11-30.md]
*   [Source: profilepage_dark.html - Assumed UI template]

---

### Dev Agent Record
*   **Context Reference:** Correcting story quality based on validation report.
*   **Agent Model Used:** Gemini
*   **Prompt:** Fix validation report issues for story-3.1.md.
*   **Output:** Updated story-3.1.md with missing sections and citations.
*   **Comments:** Added Status, AC Source, Tasks, Architecture patterns and constraints, References, Dev Agent Record, and Change Log.
*   **Completion Notes List:**
    *   [ ] Note 1
*   **File List:**
    *   [ ] `docs/stories/story-3.1.md` (MODIFIED)

---

### Change Log
*   **2025-12-02:** Added Status, AC Source, Tasks, Architecture patterns and constraints, References, Dev Agent Record, and Change Log sections based on validation report.

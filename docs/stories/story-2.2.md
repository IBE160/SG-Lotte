### Story 2.2: Meal Logging UI
Status: drafted

As an active user,
I want to easily log the consumption status of my planned meals,
So the AI can track my adherence.

**Acceptance Criteria:** [Source: docs/sprint-artifacts/tech-spec-epic-2.md]

*   **Given** I am viewing my daily meal plan
*   **When** I interact with a meal
*   **Then** I can mark it as "Eaten" or "Skipped"
*   **And** this feedback is stored in the database

**Prerequisites:** Epic 1 completion.

**Tasks:**
*   **Task 2.2.1:** Implement the UI to mark meals as "Eaten" or "Skipped". (AC: 2.2.1)
*   **Task 2.2.2:** Create the backend API endpoint to store the meal feedback. (AC: 2.2.2)
*   **Testing Subtasks:**
    *   Write a frontend component test for the meal logging UI. (AC: 2.2.1)
    *   Write an API test for the meal status endpoint. (AC: 2.2.2)

**Technical Notes:**
Frontend UI implementation based on `mealplan_dark.html`, API endpoint for logging meal status.

**Architecture patterns and constraints:**
*   Frontend UI for meal logging.
*   Backend API for storing meal status.

**References:**
*   [Source: docs/epics.md]
*   [Source: docs/sprint-artifacts/tech-spec-epic-2.md]
*   [Source: docs/architecture-2025-11-30.md]
*   [Source: mealplan_dark.html - Assumed UI template]

---

### Dev Agent Record
*   **Context Reference:** Correcting story quality based on validation report.
*   **Agent Model Used:** Gemini
*   **Prompt:** Fix validation report issues for story-2.2.md.
*   **Output:** Updated story-2.2.md with missing sections and citations.
*   **Comments:** Added Status, AC Source, Tasks, Architecture patterns and constraints, References, Dev Agent Record, and Change Log.
*   **Completion Notes List:**
    *   [ ] Note 1
*   **File List:**
    *   [ ] `docs/stories/story-2.2.md` (MODIFIED)

---

### Change Log
*   **2025-12-02:** Added Status, AC Source, Tasks, Architecture patterns and constraints, References, Dev Agent Record, and Change Log sections based on validation report.

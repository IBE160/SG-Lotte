### Story 2.1: Workout Logging UI
Status: drafted

As an active user,
I want to easily log the completion status and perceived difficulty of my planned workouts,
So the AI can track my progress.

**Acceptance Criteria:** [Source: docs/sprint-artifacts/tech-spec-epic-2.md]

*   **Given** I am viewing my daily workout plan
*   **When** I interact with a workout
*   **Then** I can mark it as "Completed" or "Skipped"
*   **And** I can rate the difficulty on a 1-5 scale for completed workouts
*   **And** this feedback is stored in the database

**Prerequisites:** Epic 1 completion.

**Tasks:**
*   **Task 2.1.1:** Implement the UI to mark workouts as "Completed" or "Skipped". (AC: 2.1.1)
*   **Task 2.1.2:** Implement the UI for the 1-5 difficulty rating for completed workouts. (AC: 2.1.2)
*   **Task 2.1.3:** Create the backend API endpoint to store the workout feedback. (AC: 2.1.3)
*   **Testing Subtasks:**
    *   Write a frontend component test for the workout logging UI. (AC: 2.1.1, 2.1.2)
    *   Write an API test for the workout status endpoint. (AC: 2.1.3)

**Technical Notes:**
Frontend UI implementation based on `workoutplan_dark.html`, API endpoint for logging workout status.

**Architecture patterns and constraints:**
*   Frontend UI for workout logging.
*   Backend API for storing workout status and difficulty.

**References:**
*   [Source: docs/epics.md]
*   [Source: docs/sprint-artifacts/tech-spec-epic-2.md]
*   [Source: docs/architecture-2025-11-30.md]
*   [Source: workoutplan_dark.html - Assumed UI template]

---

### Dev Agent Record
*   **Context Reference:** Correcting story quality based on validation report.
*   **Agent Model Used:** Gemini
*   **Prompt:** Fix validation report issues for story-2.1.md.
*   **Output:** Updated story-2.1.md with missing sections and citations.
*   **Comments:** Added Status, AC Source, Tasks, Architecture patterns and constraints, References, Dev Agent Record, and Change Log.
*   **Completion Notes List:**
    *   [ ] Note 1
*   **File List:**
    *   [ ] `docs/stories/story-2.1.md` (MODIFIED)

---

### Change Log
*   **2025-12-02:** Added Status, AC Source, Tasks, Architecture patterns and constraints, References, Dev Agent Record, and Change Log sections based on validation report.

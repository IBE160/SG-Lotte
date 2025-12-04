# Story 2.1: Workout Logging UI

Status: ready-for-dev

## Story

As an active user,
I want to easily log the completion status and perceived difficulty of my planned workouts,
So the AI can track my progress.

## Acceptance Criteria

1.  **Given** I am viewing my daily workout plan, **when** I interact with a workout, **then** I can mark it as "Completed" or "Skipped".
2.  **Given** a workout is "Completed", **when** I provide feedback, **then** I can rate the difficulty on a 1-5 scale.
3.  **Given** a workout is logged, **when** the data is saved, **then** the feedback is stored in the database.

## Tasks / Subtasks

-   [ ] **Backend: API Endpoint** (AC: #1, #2, #3)
    -   [ ] Create a new endpoint in `app/api/v1/endpoints/plans.py` to handle workout logging.
    -   [ ] The endpoint should accept the workout ID, status ("Completed" or "Skipped"), and difficulty rating.
    -   [ ] The endpoint should validate the input and store the data in the `workout_log` table.
-   [ ] **Frontend: UI Implementation** (AC: #1, #2)
    -   [ ] Implement the UI for logging workouts in `src/app/(dashboard)/workouts/`.
    -   [ ] The UI should be based on the `workoutplan_dark.html` wireframe.
    -   [ ] Add buttons or controls to mark a workout as "Completed" or "Skipped".
    -   [ ] Implement a 1-5 rating system for completed workouts.
-   [ ] **Frontend: State Management** (AC: #1, #2)
    -   [ ] Create a data fetching hook to call the new logging endpoint.
    -   [ ] Update the UI optimistically and handle loading/error states.
-   [ ] **Testing**
    -   [ ] Write unit tests for the new backend endpoint.
    -   [ ] Write integration tests for the logging functionality.
    -   [ ] Write frontend component tests for the logging UI.

## Dev Notes

-   **Backend:** The API endpoint should be secured and require user authentication. The data should be stored in the `workout_log` table as defined in the data architecture.
-   **Frontend:** The UI should be intuitive and provide immediate feedback to the user upon logging a workout. Follow the design specified in `workoutplan_dark.html`.
-   **Testing:** Adhere to the overall testing strategy outlined in the architecture document for backend (Pytest) and frontend (React Testing Library with Jest). Ensure that tests cover both "Completed" and "Skipped" statuses, as well as different difficulty ratings. [Source: `docs/architecture-2025-11-30.md#Testing-Strategy`]

### Learnings from Previous Story

**From Story 1.5-initial-ai-plan-generation-display (Status: done)**

-   The previous story was successfully reviewed and approved.
-   No major architectural changes or unresolved issues were noted that would impact this story.
-   The backend and frontend setup is stable and ready for new features.

[Source: `docs/sprint-artifacts/1-5-initial-ai-plan-generation-display.md`]

### Project Structure Notes

-   **Backend:** `backend/app/api/v1/endpoints/plans.py`
-   **Frontend:** `frontend/src/app/(dashboard)/workouts/`
-   **Database:** `workout_log` table.

### References

-   [Source: `docs/epics.md#Story-2.1-Workout-Logging-UI`]
-   [Source: `docs/architecture-2025-11-30.md#Epic-to-Architecture-Mapping`]
-   [Source: `docs/ux-design-specification.md#Flow-3--4-Log-Workouts-Meals--Provide-Feedback`]
-   [Source: `docs/PRD.md#FR-004-Workout-Logging`]

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/2-1-workout-logging-ui.context.xml`

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

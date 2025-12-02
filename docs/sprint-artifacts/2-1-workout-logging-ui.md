# Story 2.1: Workout Logging UI

**Status:** drafted

**Epic:** Epic 2: Adaptive Planning & Progress Logging
**User:** Active User
**Value Statement:** As an active user, I want to easily log the completion status and perceived difficulty of my planned workouts, so the AI can track my progress.

---

## 1. Requirements & Context

### 1.1. Requirements Summary

This story is about creating the user interface for logging workout progress. Users should be able to mark workouts as completed or skipped, and rate the difficulty of completed workouts. This data is essential for the AI to adapt future plans.

### 1.2. Source Documents

*   **Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-2.md#detailed-design`
*   **PRD:** `docs/PRD.md#fr-004-workout-logging`
*   **Epics:** `docs/epics.md#story-21-workout-logging-ui`
*   **Architecture:** `docs/architecture-2025-11-30.md#epic-to-architecture-mapping`
*   **Wireframes:** `workoutplan_dark.html` (conceptual)

---

## 2. Acceptance Criteria

| # | Given | When | Then |
|---|---|---|---|
| 1 | I am viewing my daily workout plan | I interact with a workout | I can mark it as "Completed" or "Skipped" |
| 2 | I have marked a workout as "Completed" | | I can rate the difficulty on a 1-5 scale |
| 3 | I have logged my workout | | This feedback is stored in the database |

---

## 3. Implementation Plan

### 3.1. Task Breakdown

| Task ID | Description | Est. Time |
|---|---|---|
| 2.1.1 | Create the UI for the workout logging feature based on the `workoutplan_dark.html` concept. (AC: #1, #2) | 4h |
| 2.1.2 | Implement the client-side logic to handle the user's interactions. (AC: #1, #2) | 2h |
| 2.1.3 | Create a backend endpoint to store the workout log data. (AC: #3) | 2h |
| 2.1.4 | **Test:** Write unit tests for the UI components to mark workout status. (AC: #1) | 1.5h |
| 2.1.5 | **Test:** Write unit tests for the UI components to rate workout difficulty. (AC: #2) | 1.5h |
| 2.1.6 | **Test:** Write integration tests for the backend endpoint to store workout log data. (AC: #3) | 1.5h |
| 2.1.7 | **Test:** Write E2E tests for the complete workout logging flow. (AC: #1, #2, #3) | 1.5h |

### 3.2. Developer Notes

#### Project Structure Notes
*   The UI components for workout logging should be created within the `frontend/src/app/(dashboard)/workouts/` directory.
*   The backend endpoint to store workout log data should be added to `backend/app/api/v1/endpoints/plans.py`.

#### General Notes
*   The UI should be intuitive and make it easy for users to log their workouts. Each logging action on the frontend triggers an API call to the backend's `POST /log/workout` endpoint. [Source: docs/sprint-artifacts/tech-spec-epic-2.md#workflows-and-sequencing]
*   The difficulty rating is a key input for the AI, so ensure it is captured correctly in the `workout_log` table. [Source: docs/sprint-artifacts/tech-spec-epic-2.md#data-models-and-contracts]
*   Consider using optimistic UI updates to provide immediate feedback to the user.

---

## Dev Agent Record

*   **Context Reference:**
*   **Agent Model Used:**
*   **Debug Log References:**
*   **Completion Notes List:**
*   **File List:**

---

## 4. Validation

### 4.1. Validation Checklist

*   [ ] **AC #1:** User can mark a workout as "Completed" or "Skipped" via the UI.
*   [ ] **AC #2:** User can rate the difficulty of a completed workout on a 1-5 scale.
*   [ ] **AC #3:** Workout log data, including status and difficulty, is correctly stored in the database.
*   [ ] **Testing:** All unit, integration, and E2E tests for the workout logging feature pass.

### 4.2. Review

*   **Completed by:**
*   **Date:**
*   **Outcome:**

---

## 5. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2025-12-02 | sm | Initial draft |

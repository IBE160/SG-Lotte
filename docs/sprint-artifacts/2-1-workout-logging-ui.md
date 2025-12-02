# Story 2.1: Workout Logging UI

**Epic:** Epic 2: Adaptive Planning & Progress Logging
**User:** Active User
**Value Statement:** As an active user, I want to easily log the completion status and perceived difficulty of my planned workouts, so the AI can track my progress.

---

## 1. Requirements & Context

### 1.1. Requirements Summary

This story is about creating the user interface for logging workout progress. Users should be able to mark workouts as completed or skipped, and rate the difficulty of completed workouts. This data is essential for the AI to adapt future plans.

### 1.2. Source Documents

*   **Epics:** `docs/epics.md`
*   **Architecture:** `docs/architecture-2025-11-30.md`
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
| 2.1.1 | Create the UI for the workout logging feature based on the `workoutplan_dark.html` concept. | 4h |
| 2.1.2 | Implement the client-side logic to handle the user's interactions. | 2h |
| 2.1.3 | Create a backend endpoint to store the workout log data. | 2h |
| 2.1.4 | Write tests for the workout logging feature. | 2h |

### 3.2. Developer Notes

*   The UI should be intuitive and make it easy for users to log their workouts.
*   The difficulty rating is a key input for the AI, so ensure it is captured correctly.
*   Consider using optimistic UI updates to provide immediate feedback to the user.

---

## 4. Validation

### 4.1. Validation Checklist

*   [ ] User can mark a workout as "Completed" or "Skipped".
*   [ ] User can rate the difficulty of a completed workout.
*   [ ] Workout log data is stored in the database.

### 4.2. Review

*   **Completed by:**
*   **Date:**
*   **Outcome:**

---

## 5. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2025-12-02 | sm | Initial draft |

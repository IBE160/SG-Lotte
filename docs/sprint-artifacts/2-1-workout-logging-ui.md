# Story 2.1: Workout Logging UI

**Status:** drafted
**Epic:** [Epic 2: Adaptive Planning & Progress Logging](../epics.md)
**User:** Active User
**Story Points:** 5

---

## User Story

As an active user, I want to easily log the completion status and perceived difficulty of my planned workouts, so the AI can track my progress.

---

## Acceptance Criteria

1.  **Given** I am viewing my daily workout plan, **When** I interact with a workout, **Then** I can mark it as "Completed" or "Skipped".
2.  **And** for completed workouts, I can rate the perceived difficulty on a 1-5 scale.
3.  **And** this workout feedback (status and difficulty) is successfully stored in the database.

---

## Technical Notes

*   **Frontend:**
    *   Implement UI changes on the workout plan view.
    *   The design should be based on the concepts in `workoutplan_dark.html`.
    *   Component(s) should allow for toggling completion status and selecting a difficulty rating.
*   **Backend:**
    *   Create a new API endpoint (e.g., `POST /api/v1/log/workout`).
    *   The endpoint must accept `workout_id`, `status` ('completed' or 'skipped'), and an optional `difficulty` rating (integer 1-5).
    *   This endpoint will write the received data to a new `workout_logs` table in the Supabase database.
*   **Database:**
    *   A new table `workout_logs` needs to be created to store the logged data, linked to the user and the specific workout instance.

### Learnings from Previous Story (Epic 1)

*   **Authentication:** All backend endpoints must be protected, requiring a valid JWT from an authenticated user via Supabase.
*   **API Contracts:** API requests and responses must be validated using Pydantic schemas to ensure data consistency.
*   **Supabase RLS:** Row Level Security is enabled on all tables. Policies must be in place to ensure users can only access and modify their own data.
*   **Frontend Routing:** The Next.js App Router is used for all frontend routing. New pages should be created within the `src/app/(dashboard)` group.

### References

*   [Architecture](../architecture-2025-11-30.md)

---

## Tasks mapped to Acceptance Criteria

| Acceptance Criteria | Task                                                                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| AC #1, #2           | Implement frontend components in the workout plan view to allow marking completion status and rating difficulty.                    |
| AC #3               | Create a `POST /api/v1/log/workout` backend endpoint to receive and process workout log data.                                     |
| AC #3               | Create and configure the `workout_logs` table in Supabase to store the workout feedback, ensuring it's linked to the user and workout. |

---

## Test Coverage Mapping

| Acceptance Criteria | Test Type                                                                       |
| ------------------- | ------------------------------------------------------------------------------- |
| AC #1, #2           | Frontend unit/integration tests (Jest/RTL) for the logging UI components.         |
| AC #3               | Backend unit/integration tests (Pytest) for the `/api/v1/log/workout` endpoint. |
| AC #1, #2, #3       | End-to-end tests (Playwright/Cypress) to verify the entire logging flow from UI to database. |

---

## Prerequisites

*   Completion of all stories in Epic 1.
*   A user must be authenticated and have an active, generated plan.

---

## Definition of Done

1.  All acceptance criteria are met.
2.  UI is implemented according to the technical notes and matches the visual style of the application.
3.  The API endpoint is created, documented, and handles requests correctly.
4.  Data is successfully and correctly persisted in the database.
5.  Unit tests are created for the new backend logic.
6.  End-to-end tests are created to verify the entire logging flow from the UI to the database.
7.  Code is reviewed.

---

## Dev Agent Record

*(Placeholder for agent to fill in during implementation)*

---

## Change Log

- Initial draft

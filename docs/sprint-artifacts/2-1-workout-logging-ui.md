# Story 2.1: Workout Logging UI

Status: drafted

## Story

As an active user,
I want to easily log the completion status and perceived difficulty of my planned workouts,
so the AI can track my progress.

## Requirements Context Summary

This story focuses on providing a user interface for logging workout completion and perceived difficulty, feeding essential data back to the AI for plan adaptation. It is part of Epic 2: Adaptive Planning & Progress Logging.

### Functional Requirements

-   **FR-004: Workout Logging:** The system shall allow users to easily log the completion status and perceived difficulty of their planned workouts.

### Key Components & Files

-   **Frontend UI:** New components will be created within the Next.js application for workout logging, primarily living in `frontend/src/app/(dashboard)/workouts/`. [Source: `docs/architecture-2025-11-30.md#Epic-to-Architecture-Mapping`]
-   **Backend API:** The FastAPI backend will be extended with new endpoints in `backend/app/api/v1/endpoints/plans.py` to handle the logging of workouts and meals. [Source: `docs/architecture-2025-11-30.md#Epic-to-Architecture-Mapping`]
-   **Database:** The existing Supabase database schema will be extended with a new `workout_log` table to store the user's logged data. [Source: `docs/sprint-artifacts/tech-spec-epic-2.md#Data-Models-and-Contracts`]

### Architectural Considerations

-   **Project Structure:** Frontend components in `frontend/src/app/(dashboard)/workouts/` will adhere to PascalCase for components and kebab-case for component files. Backend API endpoints will follow plural nouns and kebab-case.
-   **Testing:** Backend unit and integration tests will be written using `Pytest`. Frontend component tests will use `React Testing Library` with `Jest`.
-   **API Responses:** Standard FastAPI format for success and errors, using appropriate HTTP status codes.
-   **Data Handling:** Dates and times in API requests/responses will be ISO 8601 UTC.
-   **Security:** Supabase RLS will enforce that users can only log data for their own accounts.

### Learnings from Previous Story

**From Story 1.5-initial-ai-plan-generation-display (Status: done)**

- **New Service Created**: `ai_plan_generator.py` for AI interaction to generate plans.
- **New API Endpoint**: `/api/v1/plans/` for triggering plan generation.
- **Architectural Change**: Use Pydantic AI framework with Gemini 2.5 for AI integration. Plan data stored in database, suggested JSONB for flexibility. Dashboard (`src/app/(dashboard)/dashboard/`) to display plans. SWR for client-side data fetching aligns with caching strategy (ADR-002).
- **Review Findings**: All previously identified Medium and Low severity findings (including security concern about `supabase.auth.admin.updateUserById`) are now RESOLVED. Implementation aligns with best practices for security and fully integrates user preferences for AI plan generation.

[Source: stories/1-5-initial-ai-plan-generation-display.md#Dev-Agent-Record]

## Acceptance Criteria

1.  Given I am viewing my daily workout plan, when I interact with a workout, then I can mark it as "Completed" or "Skipped".
2.  And I can rate the difficulty on a 1-5 scale for completed workouts.
3.  And this feedback is stored in the database.

## Tasks / Subtasks

- [ ] **Frontend: Workout Logging UI** (AC: #1, #2)
    - [ ] Implement UI components in `frontend/src/app/(dashboard)/workouts/` to display daily workouts.
    - [ ] Add functionality to mark a workout as "Completed" or "Skipped".
    - [ ] Implement a 1-5 scale rating input for completed workouts.
    - [ ] Integrate with backend API to send logging data.
- [ ] **Backend: API Endpoint for Workout Logging** (AC: #3)
    - [ ] Extend `backend/app/api/v1/endpoints/plans.py` with a `POST /api/v1/plans/log-workout` endpoint.
    - [ ] Define Pydantic schemas for request body.
    - [ ] Implement logic to save workout log to the database.
- [ ] **Backend: Database Schema Extension** (AC: #3)
    - [ ] Define `workout_log` table schema (id, user_id, workout_plan_id, day_of_week, status, difficulty_rating, logged_at).
    - [ ] Create Alembic migration script for the new `workout_log` table.
- [ ] **Testing**
    - [ ] Write unit tests for the new backend API endpoint.
    - [ ] Write integration tests for the full logging flow (Frontend to Backend to Database).
    - [ ] Write component tests for the new frontend UI components.

## Dev Notes

-   **Frontend:** The UI for logging should be intuitive and low-friction, possibly using checkboxes or toggle buttons for completion and a simple slider or radio buttons for difficulty rating.
-   **Backend:** Ensure robust validation for incoming logging data. Implement idempotency for logging endpoints to prevent duplicate entries if a user accidentally submits the same log twice.
-   **Database:** Use appropriate data types for `workout_log` table. Consider indexing `user_id` and `logged_at` for efficient querying.
-   **Security:** Ensure RLS policies are correctly applied to the `workout_log` table.

### Project Structure Notes

-   New frontend components should follow PascalCase naming and reside within `frontend/src/app/(dashboard)/workouts/`.
-   Backend API endpoint for logging should be added to `backend/app/api/v1/endpoints/plans.py`.
-   Alembic migration for `workout_log` table should be created in `backend/alembic/versions/`.

### References

-   [Source: `docs/epics.md#Story-2.1-Workout-Logging-UI`]
-   [Source: `docs/sprint-artifacts/tech-spec-epic-2.md#Story-2.1-Workout-Logging-UI`]
-   [Source: `docs/architecture-2025-11-30.md#Epic-to-Architecture-Mapping`]
-   [Source: `docs/architecture-2025-11-30.md#Technology-Stack-Details`]
-   [Source: `docs/architecture-2025-11-30.md#Implementation-Patterns`]
-   [Source: `docs/architecture-2025-11-30.md#Consistency-Rules`]
-   [Source: `docs/PRD.md#FR-004-Workout-Logging`]

## Change Log

- **2025-12-05**: Initial draft created.
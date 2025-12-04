# Story 2.1: Workout Logging UI

Status: ready-for-dev

## Story

As an active user,
I want to easily log the completion status and perceived difficulty of my planned workouts,
So the AI can track my progress.

## Requirements Context Summary

This story focuses on providing the UI and backend functionality for users to log their workout completion status and perceived difficulty, which is crucial feedback for the AI's adaptation logic.

#### Functional Requirements

-   **FR-004: Workout Logging:** The system shall allow users to easily log the completion status and perceived difficulty of their planned workouts.

#### Epic Context (Epic 2: Adaptive Planning & Progress Logging)

-   **Value Statement:** As an active user, I can log my progress with simple clicks, and the app will automatically adapt my next week's plan to my performance, so my plan evolves with me.
-   **High-level scope:** Detailed logging for workouts and meals, the core AI logic for automatic weekly replanning, in-app notifications for new plans, and a view to see historical progress.

#### Acceptance Criteria

-   **Given** I am viewing my daily workout plan
-   **When** I interact with a workout
-   **Then** I can mark it as "Completed" or "Skipped"
-   **And** I can rate the difficulty on a 1-5 scale for completed workouts
-   **And** this feedback is stored in the database

#### Technical Context & Architecture Guidance

-   **Backend:**
    -   API Endpoint: `app/api/v1/endpoints/plans.py` will be involved for logging and adaptation logic. A new endpoint or extension to an existing one will be needed to receive workout logging data.
    -   Database: Data will be stored in Supabase (PostgreSQL). Database tables will use plural nouns and snake_case (e.g., `workout_logs`). Columns will use snake_case (e.g., `user_id`, `workout_id`, `status`, `difficulty_rating`).
    -   Framework: FastAPI with Python.
    -   Testing: Unit and integration tests using Pytest.
-   **Frontend:**
    -   UI Implementation: Frontend UI will be based on `workoutplan_dark.html` (from `ux_design_content`). The UI will reside under `src/app/(dashboard)/workouts/`.
    -   Components: Frontend components will use PascalCase (e.g., `WorkoutLogCard.tsx`), and component files will use Kebab-case (e.g., `workout-log-card.tsx`).
    -   State Management: Client-side state will use `Zustand`. Server-side state for data fetching will use `SWR` or `React Query`.
    -   Framework: Next.js (React) with TypeScript and Tailwind CSS.
    -   Testing: Component and integration tests using React Testing Library with Jest.
-   **General:**
    -   API Responses: Standard JSON format for success, FastAPI error format for errors.
    -   Dates and Times: ISO 8601 UTC.
    -   Security: Supabase Auth for authentication, RLS for authorization.

#### Previous Story Learnings (Story 1.5: Initial AI Plan Generation & Display)

-   **AI Interaction:** Prompts should be carefully constructed, and AI responses validated with Pydantic schemas. (Applicable if AI is directly involved in logging, less so for simple logging, but good general practice for related data).
-   **Database:** Plan data stored in a structured way, potentially using JSONB for flexibility. This applies to how workout logs will be stored.
-   **Frontend:** Dashboard designed to handle asynchronous operations; loading states are important.
-   **Testing:** Mock AI services during testing.

#### Story Statement

As an active user,
I want to easily log the completion status and perceived difficulty of my planned workouts,
So the AI can track my progress.

## Project Structure Alignment & Lessons Learned

This section outlines how Story 2.1 aligns with existing project structures and incorporates learnings from previous development.

#### Lessons Learned from Previous Story (Story 1.5: Initial AI Plan Generation & Display)

-   **AI Interaction Best Practices:** The importance of carefully constructed prompts and Pydantic schema validation for AI responses remains a key learning. While Story 2.1 is primarily about logging UI, any future AI adaptation based on this logging feedback should adhere to these practices.
-   **Database Structure:** The previous story emphasized structured storage of plan data, potentially using JSONB for flexibility. This principle directly applies to how workout log data should be stored, ensuring it's queryable and adaptable.
-   **Frontend Responsiveness:** The previous story highlighted the need for handling asynchronous operations and implementing loading states in the frontend. Story 2.1, involving API calls for logging, must also implement robust loading and error handling.
-   **Testing Strategy:** Mocking external services (like the AI) was crucial for efficient testing. For Story 2.1, this translates to mocking API calls to the backend during frontend testing and database interactions during backend testing.
    -   **Reference Previous Story:** For full context of the previous story's development, including debug logs and completion notes, refer to [Source: stories/1-5-initial-ai-plan-generation-display.md#Dev-Agent-Record]
    -   `backend/app/models/plan.py`: Defines the data model for plans. The workout log data model should align with this existing pattern.
    -   `backend/alembic/versions/2025_12_04_1100_create_plan_tables.py`: Established the migration process for new database tables. This should be followed for workout log tables.
    -   `backend/app/services/ai_plan_generator.py`: Centralized AI interaction. If workout logging influences AI directly, this service might be extended or a new one created following similar patterns.
    -   `backend/app/api/v1/endpoints/plans.py`: Contains API endpoints related to plans. The new logging endpoint should be integrated here following existing conventions.
    -   `frontend/hooks/usePlan.ts`: A custom hook for plan data fetching. A similar hook for workout logging data could be created.
    -   `frontend/app/(dashboard)/dashboard/page.tsx`: The dashboard structure is established. New logging UI components will integrate within this existing dashboard or related `(dashboard)` routes.

#### Project Structure Alignment

-   **Backend:**
    -   A new data model (e.g., `workout_log.py`) will be created under `backend/app/models/` following the pattern of `plan.py`.
    -   A new Alembic migration script will be generated to create the `workout_logs` table.
    -   A new endpoint (e.g., `/api/v1/logs/workout`) will be added to `backend/app/api/v1/endpoints/plans.py` or a new endpoint file created (e.g., `logs.py`).
    -   Business logic for handling workout logs will be placed in `backend/app/services/`.
-   **Frontend:**
    -   New UI components for logging will be developed under `frontend/src/app/(dashboard)/workouts/` following the existing component organization by feature/route.
    -   Testing files for these components will be co-located in a `__tests__` subdirectory.
    -   Shared utilities or hooks related to logging (e.g., `useWorkoutLogger.ts`) will be placed in `frontend/src/hooks/` or `frontend/src/lib/`.
-   **General:**
    -   All new files and components will adhere to the established Naming Patterns (e.g., PascalCase for React components, snake_case for database columns).
    -   API communication will follow the defined Format Patterns (JSON, ISO 8601 UTC dates) and Communication Patterns (SWR/React Query for data fetching).

## Acceptance Criteria

1.  **Given** I am viewing my daily workout plan, **when** I interact with a workout, **then** I can mark it as "Completed" or "Skipped".
2.  **Given** I mark a workout as "Completed", **then** I can rate its difficulty on a 1-5 scale.
3.  **Given** I mark a workout as "Completed" or "Skipped" and (if completed) rate its difficulty, **then** this feedback is stored in the database.

## Tasks / Subtasks

-   [ ] **Backend: Database Schema** (AC: #3)
    -   [ ] Define `workout_logs` table schema (e.g., `user_id`, `workout_id`, `status`, `difficulty_rating`, `logged_at`).
        -   [Source: `docs/architecture-2025-11-30.md#Project-Structure`]
        -   [Source: Previous Story Learnings: Database Structure]
    -   [ ] Create an Alembic migration script for the new `workout_logs` table.
-   [ ] **Backend: API Endpoint** (AC: #1, #2, #3)
    -   [ ] Create a new API endpoint (e.g., `POST /api/v1/logs/workout`) to receive workout logging data.
        -   [Source: `docs/architecture-2025-11-30.md#Epic-to-Architecture-Mapping`]
        -   [Source: `docs/architecture-2025-11-30.md#API-Contracts`]
    -   [ ] Implement logic to validate incoming data using Pydantic schemas.
        -   [Source: Previous Story Learnings: AI Interaction Best Practices (general validation principle)]
    -   [ ] Secure the endpoint to ensure only authenticated users can log their workouts.
        -   [Source: `docs/architecture-2025-11-30.md#Security-Architecture`]
    -   [ ] Store the workout log feedback in the `workout_logs` table.
-   [ ] **Frontend: Workout Logging UI** (AC: #1, #2)
    -   [ ] Develop UI components for marking a workout as "Completed" or "Skipped" within the daily workout plan view.
        -   [Source: `docs/ux-design-specification.md#Flow-3-&-4:-Log-Workouts,-Meals-&-Provide-Feedback`]
        -   [Source: `docs/architecture-2025-11-30.md#Project-Structure`]
    -   [ ] Implement a UI component for rating workout difficulty (1-5 scale) for completed workouts.
        -   [Source: `docs/ux-design-specification.md#Flow-3-&-4:-Log-Workouts,-Meals-&-Provide-Feedback`]
    -   [ ] Integrate the logging UI into the `frontend/src/app/(dashboard)/workouts/` route.
        -   [Source: `docs/architecture-2025-11-30.md#Epic-to-Architecture-Mapping`]
    -   [ ] Implement client-side logic to send logging data to the backend API endpoint.
    -   [ ] Display loading states and handle errors gracefully during API calls.
        -   [Source: Previous Story Learnings: Frontend Responsiveness]
        -   [Source: `docs/architecture-2025-11-30.md#Consistency-Rules`]
-   [ ] **Testing**
    -   [ ] Write unit tests for the backend API endpoint logic (FastAPI).
        -   [Source: `docs/architecture-2025-11-30.md#Testing-Strategy`]
    -   [ ] Write integration tests for the backend endpoint, including database interaction.
    -   [ ] Write component tests for the new frontend UI components (React Testing Library with Jest).
        -   [Source: `docs/architecture-2025-11-30.md#Testing-Strategy`]
    -   [ ] Write integration tests for the frontend UI to API interaction.
        -   [Source: Previous Story Learnings: Testing Strategy (mocking API calls)]
## Dev Notes

-   **Backend:**
    -   Carefully design the schema for the workout_logs table to ensure efficient storage and retrieval of logging data. Consider indices for user_id and workout_id.
    -   Implement strong validation for the incoming workout log data in the API endpoint to prevent invalid or malicious inputs.
    -   Ensure the API endpoint is well-documented and adheres to the established naming conventions.
-   **Frontend:**
    -   The UI for logging workouts should be intuitive and easy to use, minimizing friction for the user.
    -   Provide clear visual feedback (e.g., success messages, error alerts) for logging actions.
    -   Ensure proper integration with the usePlan hook or create a new hook to manage workout logging state and API calls.
    -   Adhere to UX design specifications from workoutplan_dark.html for consistency.
-   **Testing:**
    -   Thoroughly test both happy paths and edge cases (e.g., invalid input, network errors) for both frontend and backend.
    -   Ensure mock data accurately reflects expected API responses during frontend testing.
    -   Verify that data is correctly persisted in the database after logging.

### Project Structure Notes

-   Alignment with unified project structure for backend models, services, and API endpoints, as well as frontend components and hooks.
-   No detected conflicts or variances with existing architecture.

### References

-   [Source: docs/epics.md#Story-2.1:-Workout-Logging-UI]
-   [Source: docs/PRD.md#FR-004:-Workout-Logging]
-   [Source: docs/architecture-2025-11-30.md#Epic-to-Architecture-Mapping]
-   [Source: docs/architecture-2025-11-30.md#API-Contracts]
-   [Source: docs/architecture-2025-11-30.md#Security-Architecture]
-   [Source: docs/architecture-2025-11-30.md#Project-Structure]
-   [Source: docs/architecture-2025-11-30.md#Testing-Strategy]
-   [Source: docs/ux-design-specification.md#Flow-3-&-4:-Log-Workouts,-Meals-&-Provide-Feedback]
-   [Source: stories/1-5-initial-ai-plan-generation-display.md#Dev-Agent-Record]

## Dev Agent Record

### Context Reference

- [Context File: 2-1-workout-logging-ui.context.xml]

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- **2025-12-04:** Added missing Dev Agent Record and Change Log sections as per validation report.
# Story 2.4: Dashboard Progress Visualization

Status: drafted

## Story

As an active user,
I want to see a clear visualization of my progress (e.g., workout streak, weight trend) on my dashboard,
so that I can stay motivated and informed.

## Acceptance Criteria

1.  **Given** I am on the dashboard, **when** my data loads, **then** the `GET /api/v1/progress` endpoint is called. (Source: `tech-spec-epic-2.md`)
2.  **Given** I have logged workouts for consecutive days, **then** the dashboard correctly displays my current workout streak. (Source: `tech-spec-epic-2.md`)
3.  **Given** I have logged my weight multiple times, **then** a trend chart is rendered on the dashboard showing my weight changes over time. (Source: `tech-spec-epic-2.md`)

## Tasks / Subtasks

**Frontend (Story 2.4):**
*   [ ] Implement `ProgressChart.tsx` component in `frontend/src/app/(dashboard)/dashboard/components/` to display workout streak and weight trend (AC: #2, #3).
*   [ ] Integrate `ProgressChart.tsx` into `frontend/src/app/(dashboard)/dashboard/page.tsx` (AC: #1).
*   [ ] Fetch data for `ProgressChart` from `GET /api/v1/progress` endpoint (AC: #1).
*   [ ] Use `Recharts` library for rendering graphs (Technical Note).

**Backend (Story 2.4):**
*   [ ] Create `ProgressDataService` module in `backend/app/services/` to aggregate and calculate progress metrics (AC: #2, #3).
*   [ ] Implement logic within `ProgressDataService` to calculate workout streak from `workout_logs` table (AC: #2).
*   [ ] Implement logic within `ProgressDataService` to retrieve weight trend data from `users` or a dedicated `weight_log` table (AC: #3).
*   [ ] Create `GET /api/v1/progress` endpoint in `backend/app/api/v1/endpoints/plans.py` (or new `progress.py`) to expose aggregated progress data (AC: #1).

**Testing (Story 2.4):**
*   **Frontend Unit Tests:**
    *   [ ] Add unit tests for `ProgressChart.tsx` using Jest and React Testing Library to verify rendering and state changes with mock data (AC: #2, #3).
*   **Backend Integration Tests:**
    *   [ ] Add integration tests for `GET /api/v1/progress` endpoint using Pytest to validate request/response contracts, authentication/authorization, and database interactions (AC: #1).
*   **Data Consistency Tests:**
    *   [ ] Verify that the `ProgressDataService` correctly aggregates data from `workout_logs` and `meal_logs` for accurate streak and trend calculations (AC: #2, #3).

## Dev Notes

### Learnings from Previous Story (2.3: AI-Driven Weekly Plan Adaptation Logic):

The previous story established the core backend logic for AI-driven weekly plan adaptation, triggered by a Vercel Cron Job. While Story 2.4 is frontend-focused, these learnings provide crucial context for the data sources it will consume:

*   **New Services/Components:** The `PlanAdaptationService`, implemented in `backend/app/services/ai_plan_generator.py`, and related endpoint in `backend/app/api/v1/endpoints/plans.py`, is a significant new service within Epic 2. Story 2.4 will rely on the data generated and processed by this service (specifically the `workout_logs` and `meal_logs` and the `workout_plans` and `meal_plans` tables) and the meal logging component `frontend/src/app/(dashboard)/meals/MealLoggingCard.tsx` from Story 2.2.
*   **Architectural Decisions:** The use of Vercel Cron Jobs for background processing (ADR-001) is a key architectural decision that ensures the data Story 2.4 visualizes will be updated regularly and asynchronously.
*   **Warnings/Recommendations:** The general recommendation to fix existing frontend tests and run regression tests is relevant for Story 2.4, as it introduces new frontend components (`ProgressChart`) and potentially modifies existing dashboard components. Thorough testing is paramount.
*   **Pending Items from 2.3:** The completion of Story 2.3's backend and infrastructure tasks (implementing `PlanAdaptationService`, configuring Cron Jobs, API endpoints) is a prerequisite for Story 2.4 to have the necessary data to visualize.

### Project Structure Alignment for Story 2.4:

Story 2.4 involves creating new components for the frontend and potentially modifying existing dashboard views.

*   **Frontend Components:** New React components (e.g., `ProgressChart`) will be created for the dashboard. Following the naming and structure patterns:
    *   Component Name: `ProgressChart.tsx` (PascalCase)
    *   File Path: `frontend/src/app/(dashboard)/dashboard/components/ProgressChart.tsx` (or similar, within the feature/route directory)
*   **Backend Service:** The `ProgressDataService` will likely be a new module within `backend/app/services/` or `backend/app/api/v1/endpoints/`.
*   **API Endpoints:** A new `GET /api/v1/progress` endpoint will be added to `backend/app/api/v1/endpoints/plans.py` (or new `progress.py` endpoint file) to expose aggregated progress data.

**Cross-referencing with Project Structure:**

*   The `workout_logs` and `meal_logs` tables (defined in `tech-spec-epic-2.md`) are the primary data sources.
*   The `frontend/src/app/(dashboard)/dashboard/page.tsx` file will be the main entry point for integrating the `ProgressChart` component.

### Architectural Standards & Guidelines (Single Source of Truth)

For the purposes of this project, `docs/architecture-2025-11-30.md` serves as the single authoritative source for the following architectural standards and guidelines. Dedicated files for these aspects are not maintained separately.

*   **Tech Stack:** Referenced in [docs/architecture-2025-11-30.md](docs/architecture-2025-11-30.md#Technology-Stack)
*   **Backend Architecture:** Referenced in [docs/architecture-2025-11-30.md](docs/architecture-2025-11-30.md#Backend-Architecture)
*   **Frontend Architecture:** Referenced in [docs/architecture-2025-11-30.md](docs/architecture-2025-11-30.md#Frontend-Architecture)
*   **Data Models:** Referenced in [docs/architecture-2025-11-30.md](docs/architecture-2025-11-30.md#Data-Modeling-and-Database-Schema)
*   **Testing Strategy:** Referenced in [docs/architecture-2025-11-30.md](docs/architecture-2025-11-30.md#Testing-Strategy)
*   **Coding Standards:** Referenced in [docs/architecture-2025-11-30.md](docs/architecture-2025-11-30.md#Implementation-Patterns)
*   **Unified Project Structure:** Referenced in [docs/architecture-2025-11-30.md](docs/architecture-2025-11-30.md#Project-Structure)

**UI/UX Considerations:**
The progress visualization should show a summary of the workout streak and a weight trend over the last 30 days. These are UI/UX choices and not binding acceptance criteria.

### References

- [docs/epics.md](docs/epics.md) – Epic 2: Adaptive Planning & Progress Logging
- [docs/prd.md](docs/prd.md) – FR-006: Dashboard Overview
- [docs/architecture-2025-11-30.md](docs/architecture-2025-11-30.md) – Project Structure, Implementation Patterns, Testing Strategy
- [docs/ux-design-specification.md](docs/ux-design-specification.md) – Flow 6, 7, & 8: Profile, Account, and History (Progress Visualization)
- [docs/sprint-artifacts/tech-spec-epic-2.md](docs/sprint-artifacts/tech-spec-epic-2.md) – Story 2.4: Dashboard Progress Visualization (Detailed Design, Workflows, and Sequencing)
- [docs/sprint-artifacts/2-3-ai-driven-weekly-plan-adaptation-logic.md](docs/sprint-artifacts/2-3-ai-driven-weekly-plan-adaptation-logic.md) – Dev Notes, Tasks/Subtasks

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

<!-- TODO: Add agent model name here -->

### Debug Log References

### Completion Notes List

### File List

---

### Change Log

-   2025-12-15: Initial draft created by SM agent.
-   2025-12-15: Revised by SM agent to address validation feedback.

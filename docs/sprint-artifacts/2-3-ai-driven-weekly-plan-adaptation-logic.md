# Story 2-3: AI-Driven Weekly Plan Adaptation Logic

**Status:** ready-for-dev
**Author:** BIP
**Date:** 2025-12-14

**User Story:** As a user, I want the application to automatically adjust my workout and meal plan for the upcoming week based on my logged performance and feedback, so that my plan remains challenging and aligned with my goals.

---

### Acceptance Criteria

1.  **Given** it is the end of the week, **when** the weekly cron job runs, **then** it correctly identifies all users due for a new plan.
2.  **Given** the adaptation service is running for a user, **then** it successfully fetches all workout and meal logs for that user from the past 7 days.
3.  **Given** the service has the user's logs, **then** it constructs a valid, detailed prompt for the Gemini API.
4.  **Given** a successful AI response, **then** a new `workout_plan` and `meal_plan` are created and saved to the database for the upcoming week.

---

### Dev Notes

#### Learnings from Previous Story

From story `2-2-meal-logging-ui`, we learned that the frontend implementation for logging user actions is straightforward. The `MealLoggingCard.tsx` component was created to handle the UI and API calls for meal logging. This involved a `POST` request to `/api/v1/log/meal`. We also had to fix some existing frontend tests, highlighting the need to run regression tests. [Source: docs/sprint-artifacts/2-2-meal-logging-ui.md]

#### Architecture patterns and constraints

The core logic for this story will be implemented in the backend as the `PlanAdaptationService`. This service will be triggered by a Vercel Cron Job, as specified in ADR-001. The service will be responsible for:
1.  Fetching user logs (`workout_logs` and `meal_logs`) from the Supabase database.
2.  Constructing a detailed prompt for the AI model (Pydantic AI with Gemini 2.5).
3.  Calling the AI service to generate a new plan.
4.  Saving the new plan to the `workout_plans` and `meal_plans` tables.
5.  Calling the `NotificationService` to inform the user.

[Source: docs/sprint-artifacts/tech-spec-epic-2.md, Section: System Architecture Alignment]
[Source: docs/sprint-artifacts/tech-spec-epic-2.md, Section: Workflows and Sequencing]

#### References

- [docs/epics.md](docs/epics.md)
- [docs/sprint-artifacts/tech-spec-epic-2.md](docs/sprint-artifacts/tech-spec-epic-2.md)

---

### Tasks/Subtasks

-   **Backend:**
    -   [ ] Create the `PlanAdaptationService` module in `app/services/` (AC: #2, #3, #4)
    -   [ ] Implement the logic to fetch workout and meal logs for a given user from the past 7 days (AC: #2)
    -   [ ] Implement the prompt engineering logic to construct a detailed prompt for the Gemini API (AC: #3)
    -   [ ] Implement the logic to call the Gemini API and handle the response (AC: #4)
    -   [ ] Implement the logic to save the new `workout_plan` and `meal_plan` to the database (AC: #4)
    -   [ ] Create the internal API endpoint `POST /api/v1/plans/adapt` to be called by the cron job (AC: #1)
-   **Infrastructure:**
    -   [ ] Configure a Vercel Cron Job to trigger the `POST /api/v1/plans/adapt` endpoint weekly for all active users (AC: #1)
-   **Testing:**
    -   [ ] Add unit tests for the `PlanAdaptationService`, mocking the database and AI service calls (AC: #2, #3, #4)
    -   [ ] Add integration tests for the `POST /api/v1/plans/adapt` endpoint (AC: #1)
    -   [ ] Add an end-to--end test to simulate the entire weekly adaptation workflow (AC: #1, #2, #3, #4)

---

### Dev Agent Record

-   **Context Reference:**
    - C:\IT_studier\IBE160_Programmering_med_KI\Prosjektmappe\Prosjekt\SG-Lotte\docs\sprint-artifacts\2-3-ai-driven-weekly-plan-adaptation-logic.context.xml
-   **Agent Model Used:**
-   **Debug Log References:**
-   **Completion Notes List:**
-   **File List:**

---

### Change Log

-   2025-12-14: Initial draft created to pass validation.

---

**Dependencies:**

*   Story 2-1: Workout Logging UI
*   Story 2-2: Meal Logging UI
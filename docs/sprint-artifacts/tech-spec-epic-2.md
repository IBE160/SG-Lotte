# Epic Technical Specification: Adaptive Planning & Progress Logging

Date: 2025-12-05
Author: BIP
Epic ID: 2
Status: Draft

---

## Overview

This epic, "Adaptive Planning & Progress Logging," is the second major phase of the AI Fitness & Meal Planner application. It builds upon the foundational user and plan data established in Epic 1. The core of this epic is to introduce the "magic" of the application: the ability for the AI to learn from a user's logged activities and automatically adapt their workout and meal plans for the following week. This creates a dynamic, personalized feedback loop that ensures the user's plan evolves with their performance and adherence.

This phase will deliver the UI for users to log their workout and meal completion, the backend logic for the AI to process this data, and the in-app notifications to keep the user engaged and informed of their new, adapted plans.

## Objectives and Scope

### In Scope:

*   **Workout Logging:** A user interface for marking planned workouts as "Completed" or "Skipped" and rating the perceived difficulty of completed workouts.
*   **Meal Logging:** A user interface for marking planned meals as "Eaten" or "Skipped".
*   **AI Plan Adaptation:** The core backend logic, triggered by a weekly cron job, that uses logged data to generate a new, adapted workout and meal plan for the upcoming week.
*   **Progress Visualization:** A dashboard component to display key progress metrics like workout streaks.
*   **New Plan Notifications:** In-app notifications to inform the user when their new weekly plan is ready.

### Out of Scope:

*   **Advanced Analytics:** Detailed historical analysis, trend reports, and data exports are not part of this epic.
*   **Manual Plan Adjustments:** Users will not be able to manually edit the AI-generated plans in this phase.
*   **Conversational AI:** A real-time chat with the AI coach is a future vision and not included here.
*   **Social Features:** Sharing progress or community features are out of scope.

## System Architecture Alignment

This epic aligns with the established architecture by extending the existing frontend and backend systems.

*   **Frontend:** New components will be created within the Next.js application for workout logging, meal logging, and progress visualization, following the established design system and state management patterns (Zustand/SWR). These components will primarily live in the `src/app/(dashboard)/workouts/` and `src/app/(dashboard)/meals/` directories.
*   **Backend:** The FastAPI backend will be extended with new endpoints in `app/api/v1/endpoints/plans.py` to handle the logging of workouts and meals. The core AI adaptation logic will be implemented in `app/services/ai_plan_generator.py` and triggered by a Vercel Cron Job as defined in ADR-001.
*   **Database:** The existing Supabase database schema will be extended with new tables (`workout_log`, `meal_log`) to store the user's logged data. Row Level Security (RLS) policies will be applied to ensure data privacy.

The implementation will adhere to the defined naming conventions, testing strategies, and all other consistency rules outlined in the architecture document.

## Detailed Design

### Services and Modules

| Service/Module | Responsibility | Inputs | Outputs | Owner |
| --- | --- | --- | --- | --- |
| `frontend/src/app/(dashboard)/workouts/` | Display daily workouts and provide UI for logging completion and difficulty. | Weekly workout plan data. | Workout log events. | Frontend |
| `frontend/src/app/(dashboard)/meals/` | Display daily meals and provide UI for logging consumption. | Weekly meal plan data. | Meal log events. | Frontend |
| `frontend/src/components/dashboard/ProgressVisualization.tsx` | Render charts and stats for user progress (e.g., workout streak). | Aggregated progress data. | Visual components. | Frontend |
| `backend/app/api/v1/endpoints/plans.py` | Expose API endpoints for logging workouts and meals. | HTTP requests with log data. | HTTP responses. | Backend |
| `backend/app/services/ai_plan_generator.py` | Contain the logic for weekly plan adaptation based on user feedback. | User ID, historical logs. | A new weekly plan. | Backend |
| Vercel Cron Job | Trigger the weekly plan adaptation process. | HTTP request to a secure endpoint. | Trigger confirmation/error. | Infrastructure |

### Data Models and Contracts

New database tables will be introduced to support logging.

**`workout_log` table:**

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `uuid` | Primary Key | Unique identifier for the log entry. |
| `user_id` | `uuid` | Foreign Key to `users.id` | The user who logged the workout. |
| `workout_plan_id` | `uuid` | Foreign Key to `workout_plans.id` | The plan this workout belongs to. |
| `day_of_week` | `integer` | | The day of the week for the workout (1-7). |
| `status` | `varchar` | | 'Completed' or 'Skipped'. |
| `difficulty_rating` | `integer` | | Perceived difficulty from 1 to 5 (nullable). |
| `logged_at` | `timestamp` | Default `now()` | When the entry was logged. |

**`meal_log` table:**

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `uuid` | Primary Key | Unique identifier for the log entry. |
| `user_id` | `uuid` | Foreign Key to `users.id` | The user who logged the meal. |
| `meal_plan_id` | `uuid` | Foreign Key to `meal_plans.id` | The plan this meal belongs to. |
| `day_of_week` | `integer` | | The day of the week for the meal (1-7). |
| `status` | `varchar` | | 'Eaten' or 'Skipped'. |
| `logged_at` | `timestamp` | Default `now()` | When the entry was logged. |

### APIs and Interfaces

The following API endpoints will be added to `app/api/v1/endpoints/plans.py`:

*   **`POST /api/v1/plans/log-workout`**: Logs a workout.
    *   **Request Body**: `{ "workout_plan_id": "uuid", "day_of_week": int, "status": "Completed" | "Skipped", "difficulty_rating": int | null }`
    *   **Response**: `200 OK` on success.
*   **`POST /api/v1/plans/log-meal`**: Logs a meal.
    *   **Request Body**: `{ "meal_plan_id": "uuid", "day_of_week": int, "status": "Eaten" | "Skipped" }`
    *   **Response**: `200 OK` on success.
*   **`GET /api/v1/plans/progress-summary`**: Retrieves aggregated data for the progress visualization.
    *   **Response**: `{ "workout_streak": int, ... }`
*   **`POST /api/v1/internal/trigger-weekly-adaptation`**: A secure, internal endpoint to be called by the Vercel Cron Job.
    *   **Request Body**: `{ "user_id": "uuid" }` (or all users if run globally)
    *   **Response**: `200 OK` on success.

### Workflows and Sequencing

1.  **User Logging**:
    *   User navigates to the workout or meal plan page in the frontend.
    *   User clicks a button to log an activity.
    *   Frontend sends a request to the appropriate logging endpoint in the backend.
    *   Backend validates the request and saves the log entry to the corresponding database table.
2.  **Weekly Plan Adaptation (Automated)**:
    *   The Vercel Cron Job runs at the end of each week (e.g., Sunday at 10 PM).
    *   The cron job sends a request to the `POST /api/v1/internal/trigger-weekly-adaptation` endpoint.
    *   The backend service fetches the user's logged activities for the past week from the `workout_log` and `meal_log` tables.
    *   The service constructs a prompt for the AI, including the user's goals, preferences, and recent activity logs.
    *   The AI returns a new, adapted weekly plan.
    *   The backend saves the new plan to the `workout_plans` and `meal_plans` tables.
    *   The backend creates an in-app notification for the user.
3.  **User Notification**:
    *   The next time the user opens the app, the frontend fetches and displays the "New Plan Ready" notification.

## Non-Functional Requirements

### Performance
*   **Logging Response Time:** API endpoints for logging workouts and meals must respond in under 300ms.
*   **AI Adaptation Time:** The asynchronous weekly plan adaptation process should complete within 5 minutes per user to ensure timely delivery of new plans.

### Security
*   **Authorization:** All logging and plan-related API endpoints must enforce that a user can only log or view data for their own account, using Supabase RLS policies.
*   **Internal Endpoint Protection:** The `/api/v1/internal/trigger-weekly-adaptation` endpoint must be secured to prevent unauthorized access, likely via a secret token passed from the Vercel Cron Job.

### Reliability/Availability
*   **Idempotency:** Logging endpoints should be idempotent to prevent duplicate entries if a user accidentally submits the same log twice.
*   **AI Fallback:** The AI adaptation service must include fallback logic. If the AI service fails to generate a plan, it should either retry or, after multiple failures, notify the user of a delay and alert the development team.

### Observability
*   **Logging:** The backend must log key events during the plan adaptation process, including the start and end of the job, any errors encountered, and the success or failure of the AI generation step.
*   **Monitoring:** Key metrics for the adaptation process, such as duration and error rate, should be monitored.

## Dependencies and Integrations
*   **Vercel Cron Jobs:** This epic introduces a new dependency on Vercel's infrastructure for scheduled task execution.
*   **Backend Libraries:**
    *   **`pydantic` (v2.7.1):** Used for data validation and settings management.
    *   **`google-generativeai` (v0.5.4):** Used for interfacing with the Gemini model for plan generation.
    *   *Note: The backend team is encouraged to pin all dependency versions in `requirements.txt` to ensure a stable, reproducible environment.*
*   **Recharts (Frontend, v2.12.7):** The `recharts` library will be added to the frontend `package.json` to implement the progress visualization charts.

## Acceptance Criteria (Authoritative)
This section lists the specific, testable acceptance criteria for each story in this epic, derived from `epics.md`.

*   **Story 2.1: Workout Logging UI**
    1.  Given I am viewing my daily workout plan, when I interact with a workout, then I can mark it as "Completed" or "Skipped".
    2.  And I can rate the difficulty on a 1-5 scale for completed workouts.
    3.  And this feedback is stored in the database.
*   **Story 2.2: Meal Logging UI**
    1.  Given I am viewing my daily meal plan, when I interact with a meal, then I can mark it as "Eaten" or "Skipped".
    2.  And this feedback is stored in the database.
*   **Story 2.3: AI-Driven Weekly Plan Adaptation Logic**
    1.  Given the end of the current week, when the Vercel Cron Job triggers the backend, then the AI processes the user's logged workouts, meals, and difficulty ratings.
    2.  And the AI generates a new, adapted workout and meal plan for the upcoming week based on this data.
    3.  And the new plans are stored in the database.
*   **Story 2.4: Dashboard Progress Visualization**
    1.  Given I am on the dashboard, when I view the progress section, then I see a summary of my workout streak.
    2.  And I see a visualization of my weight trend over the last 30 days (Note: this may be simplified to workout streak for MVP of this epic if weight logging is not yet implemented).
*   **Story 2.5: New Plan Notification**
    1.  Given a new plan has been generated by the AI, when I open the app, then I receive an in-app notification confirming the new plan.
    2.  And I can easily navigate to the new plan from the notification.

## Traceability Mapping

| Acceptance Criterion | Spec Section(s) | Component(s)/API(s) | Test Idea |
| --- | --- | --- | --- |
| 2.1.1, 2.1.2, 2.1.3 | Data Models, APIs | `POST /api/v1/plans/log-workout`, `workout_log` table | Unit test for the API endpoint; Integration test to verify UI interaction and database write. |
| 2.2.1, 2.2.2 | Data Models, APIs | `POST /api/v1/plans/log-meal`, `meal_log` table | Unit test for the API endpoint; Integration test to verify UI interaction and database write. |
| 2.3.1, 2.3.2, 2.3.3 | Workflows, Services | `POST /api/v1/internal/trigger-weekly-adaptation`, `ai_plan_generator.py` | Integration test for the adaptation service; E2E test simulating the cron job trigger and verifying new plan creation. |
| 2.4.1, 2.4.2 | Services and Modules | `GET /api/v1/plans/progress-summary`, `ProgressVisualization.tsx` | Unit test for the summary endpoint; Component test for the React component. |
| 2.5.1, 2.5.2 | Workflows and Sequencing | Frontend notification system | Integration test to verify that a new plan triggers the notification UI. |

## Risks, Assumptions, Open Questions

*   **Risk:** The AI adaptation logic could produce suboptimal or nonsensical plans if the user's feedback is sparse or inconsistent.
    *   **Mitigation:** The AI prompt must be engineered to handle missing data gracefully. The system should have a fallback to a less-adapted or default plan if confidence in the generated plan is low.
*   **Assumption:** Users will consistently log their activities, providing enough data for the AI to make meaningful adaptations.
    *   **Mitigation:** The UI for logging must be as low-friction as possible. Gamification elements (like streaks) are designed to encourage consistent logging.
*   **Question:** What is the optimal time to trigger the weekly cron job, considering users in different timezones?
    *   **Next Step:** For the initial implementation, we will use a fixed UTC time (e.g., Sunday 10 PM UTC). Timezone-aware triggers can be a future enhancement.
*   **Risk:** The Vercel Cron Job could fail to trigger, leaving users without a new plan.
    *   **Mitigation:** Implement monitoring and alerting on the cron job. The frontend should also gracefully handle the absence of a future week's plan, perhaps prompting the user to try a manual refresh.

## Test Strategy Summary

*   **Backend:**
    *   **Unit Tests (`Pytest`):** Each API endpoint and service function will be unit tested. The AI service will be tested with mock AI responses to validate the data processing logic.
    *   **Integration Tests:** Integration tests will verify the full flow from API request to database interaction for logging and plan generation.
*   **Frontend:**
    *   **Component Tests (`React Testing Library`):** All new UI components (logging buttons, progress charts, notifications) will have component tests.
    *   **Integration Tests:** Tests will cover the user flow of logging an activity and seeing the UI update.
*   **End-to-End (E2E):**
    *   A manual E2E test will be performed for the first iteration of this epic: 1) Log activities for a week. 2) Manually trigger the adaptation endpoint. 3) Verify the new plan is generated and a notification appears.


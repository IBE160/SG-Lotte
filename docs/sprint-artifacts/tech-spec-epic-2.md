# Epic Technical Specification: Adaptive Planning & Progress Logging

Date: tirsdag 2. desember 2025
Author: BIP
Epic ID: 2
Status: Draft

---

## Overview

This epic introduces the core "magic" of the AI Fitness & Meal Planner: adaptation. It builds upon the foundational user journey established in Epic 1 by enabling users to log their progress and have the AI automatically adjust their future plans. The primary goal is to create a dynamic and responsive system that evolves with the user, ensuring that the workout and meal plans remain challenging, effective, and engaging over time.

This technical specification details the implementation of the progress logging UIs, the backend logic for AI-driven weekly replanning, a simple notification system to inform users of their new plans, and the initial components for visualizing historical progress.

## Objectives and Scope

### In-Scope

*   **Workout Logging:** A UI for users to mark workouts as "Completed" or "Skipped" and rate the difficulty of completed workouts.
*   **Meal Logging:** A UI for users to mark meals as "Eaten" or "Skipped".
*   **AI-Driven Weekly Replanning:** The core backend logic to process a user's weekly logs and generate a new, adapted plan for the following week. This will be triggered by a Vercel Cron Job.
*   **New Plan Notifications:** A simple in-app notification system to alert users when their new weekly plan is available.
*   **Basic Progress Visualization:** A dashboard component to display a user's workout streak and a trend line for weight.

### Out-of-Scope

*   **Advanced User Profile Management:** Editing personal details beyond what was collected in onboarding is not included.
*   **Plan Interruption:** Features to pause plans for vacations or illness are part of Epic 3.
*   **Detailed Historical Analysis:** While data is being collected, comprehensive historical data filtering and analysis are not in scope for this epic.
*   **Social and Community Features:** Any features related to sharing or comparing progress with other users are excluded.

## System Architecture Alignment

This epic builds upon the foundation of Epic 1 and begins to implement the dynamic, adaptive core of the application. The implementation will extend the existing architectural components and introduce the asynchronous processing pattern.

*   **Frontend:** The implementation will add new components for logging within the dashboard, specifically under `src/app/(dashboard)/workouts/` and `src/app/(dashboard)/meals/`. It will also include the UI for progress visualization on the main dashboard page.
*   **Backend:** The FastAPI backend will be extended with new endpoints in `app/api/v1/endpoints/plans.py` to handle the submission of workout and meal logs. The core AI adaptation logic will be added to the `ai_plan_generator.py` service or a new dedicated adaptation service.
*   **Background Processing:** This epic will implement the first ADR (`ADR-001`) by utilizing a Vercel Cron Job to trigger the weekly plan adaptation logic on the backend via a secure API endpoint. This demonstrates the asynchronous processing capability of the chosen architecture.

## Detailed Design

### Services and Modules

| Service/Module | Responsibility | Inputs | Outputs | Owner |
|---|---|---|---|---|
| **Frontend Logging Module** | Provide UI for users to log workout completion/difficulty and meal consumption. | User clicks and ratings on the workout/meal plan views. | Log data sent to the backend's logging endpoints. | Frontend Team |
| **Frontend Progress Visualization** | Display charts for workout streak and weight trend on the dashboard. | Aggregated progress data fetched from a backend API endpoint. | Rendered charts using the Recharts library. | Frontend Team |
| **Backend Logging Service** | Receive and persist workout and meal log data from the frontend. | JSON payload containing log information (e.g., workout ID, status, difficulty). | New records created in the `workout_log` and `meal_log` tables. | Backend Team |
| **Backend AI Plan Adaptation Service** | Process a user's logs from the previous week and generate a new, adapted plan. | User's workout and meal logs for the preceding week. | A new, updated 7-day plan stored in the `workout_plans` and `meal_plans` tables. | Backend Team |
| **Backend Notification Service** | Create an in-app notification when a new weekly plan has been generated. | A trigger from the Plan Adaptation Service upon successful plan creation. | A new notification record in the database, associated with the user. | Backend Team |

### Data Models and Contracts

This epic introduces new data models for logging user progress and handling notifications, which are essential for the feedback loop to the AI. These tables will be created in addition to the models defined in Epic 1.

### `workout_log`
Records the completion status and user feedback for individual workouts.

*   `id` (uuid, primary key): Unique identifier for the log entry.
*   `user_id` (uuid, foreign key to `users.id`): Associates the log with a user.
*   `workout_plan_id` (uuid, foreign key to `workout_plans.id`): Links the log to a specific weekly plan.
*   `exercise_id` (varchar): An identifier for the specific exercise within the plan's JSON data.
*   `status` (varchar): The completion status (e.g., "completed", "skipped").
*   `difficulty_rating` (integer): The user's perceived difficulty rating (1-5), nullable.
*   `logged_at` (timestamp with time zone): Timestamp of when the log was created.

### `meal_log`
Records the consumption status of individual meals.

*   `id` (uuid, primary key): Unique identifier for the log entry.
*   `user_id` (uuid, foreign key to `users.id`): Associates the log with a user.
*   `meal_plan_id` (uuid, foreign key to `meal_plans.id`): Links the log to a specific weekly plan.
*   `meal_id` (varchar): An identifier for the specific meal within the plan's JSON data.
*   `status` (varchar): The consumption status (e.g., "eaten", "skipped").
*   `logged_at` (timestamp with time zone): Timestamp of when the log was created.

### `notifications`
Stores in-app notifications for users.

*   `id` (uuid, primary key): Unique identifier for the notification.
*   `user_id` (uuid, foreign key to `users.id`): The recipient of the notification.
*   `message` (text): The content of the notification message.
*   `is_read` (boolean, default: false): The read status of the notification.
*   `created_at` (timestamp with time zone): Timestamp of when the notification was created.

### APIs and Interfaces

This epic introduces new endpoints for logging progress and triggering the plan adaptation logic. All endpoints are under the `/api/v1` prefix and require authentication.

### Logging

*   **`POST /log/workout`**
    *   **Description:** Logs the completion status and difficulty of a single workout.
    *   **Request Body:** `{ "workout_plan_id": "...", "exercise_id": "...", "status": "completed", "difficulty_rating": 4 }`
    *   **Response (200 OK):** `{ "message": "Workout logged successfully" }`

*   **`POST /log/meal`**
    *   **Description:** Logs the consumption status of a single meal.
    *   **Request Body:** `{ "meal_plan_id": "...", "meal_id": "...", "status": "eaten" }`
    *   **Response (200 OK):** `{ "message": "Meal logged successfully" }`

### Progress

*   **`GET /progress/summary`**
    *   **Description:** Fetches aggregated progress data for the dashboard visualization.
    *   **Request Body:** None.
    *   **Response (200 OK):** `{ "workout_streak": 5, "weight_trend": [...] }`

### Plan Adaptation

*   **`POST /plans/trigger-adaptation`**
    *   **Description:** A protected endpoint designed to be called by the Vercel Cron Job to trigger the weekly plan adaptation for a user or batch of users.
    *   **Request Body:** `{ "user_id": "..." }` or a batch identifier.
    *   **Response (200 OK):** `{ "message": "Adaptation process for user(s) triggered successfully" }`
    *   **Notes:** This endpoint must be secured to prevent unauthorized access (e.g., using a secret token).

### Notifications

*   **`GET /notifications`**
    *   **Description:** Fetches all unread notifications for the authenticated user.
    *   **Request Body:** None.
    *   **Response (200 OK):** `[{ "id": "...", "message": "Your new weekly plan is ready!", "is_read": false, "created_at": "..." }]`

### Workflows and Sequencing

The core workflow for Epic 2 is the weekly plan adaptation cycle, which forms the heart of the application's dynamic nature.

1.  **User Logging:** Throughout the week, the user interacts with their daily plans on the frontend, marking workouts and meals as completed, skipped, and rating workout difficulty.
2.  **Log Persistence:** Each logging action on the frontend triggers an API call to the backend's `/log/workout` or `/log/meal` endpoints. The backend validates and saves this information to the `workout_log` and `meal_log` tables.
3.  **Scheduled Trigger:** At a pre-defined time (e.g., Sunday evening), the Vercel Cron Job makes a request to the protected `/plans/trigger-adaptation` endpoint on the backend.
4.  **Data Aggregation:** The AI Plan Adaptation Service receives the trigger and fetches all of the user's workout and meal logs from the past week.
5.  **AI Prompt Construction:** The service constructs a detailed prompt for the OpenAI API. This prompt includes the user's original plan, their adherence and difficulty feedback from the logs, and a request to generate a new, adapted plan for the upcoming week.
6.  **AI Plan Generation:** The OpenAI API processes the prompt and returns a new, structured JSON plan that is adjusted based on the user's performance.
7.  **New Plan Persistence:** The backend service validates the new plan and saves it to the `workout_plans` and `meal_plans` tables.
8.  **Notification:** Upon successful creation of the new plan, the service creates a "Your new weekly plan is ready!" notification and saves it to the `notifications` table.
9.  **User Alert:** The next time the user opens the app, the frontend fetches and displays the unread notification, prompting them to view their new plan.

## Non-Functional Requirements

### Performance

*   **API Response Time:** All non-AI API endpoints must have a response time of less than 500ms under normal load conditions.
*   **Concurrent Users:** The system must support at least 100 concurrent active users without degradation in performance.
*   **Frontend Load Time:** The initial load time for the dashboard page should be under 2 seconds.

### Security

*   **Authentication:** User authentication will be handled exclusively by Supabase Auth, which provides a secure, token-based (JWT) system.
*   **Authorization:** All database access will be governed by Supabase's Row Level Security (RLS) policies to ensure that users can only access and modify their own data.
*   **Data Encryption:** All data will be encrypted in transit using HTTPS/SSL and at rest, as managed by Supabase's default security posture.
*   **Data Privacy:** The system will adhere to GDPR principles for data privacy, including the right to data deletion (which will be implemented in a later epic).
*   **Secure Cron Job:** The endpoint triggered by the Vercel Cron Job must be secured to prevent unauthorized access and execution (e.g., via a secret token).

### Reliability/Availability

*   **AI Service Resiliency:** All calls to the OpenAI API must implement retry mechanisms with exponential backoff to handle transient network issues or API errors.
*   **AI Service Fallback:** In the event of a catastrophic failure from the OpenAI API (e.g., prolonged outage or multiple failed retries), the system must fall back to serving a pre-defined default plan from the database.
*   **AI Response Caching:** To reduce dependency on the external service and improve performance, successful OpenAI API responses should be cached.
*   **Cron Job Reliability:** The weekly plan adaptation cron job must be idempotent. If it runs multiple times for the same user and week, it should not create duplicate plans.

### Observability

*   **Structured Logging:** The FastAPI backend will implement structured logging in JSON format.
*   **Log Content:** All logs must include, at a minimum, a timestamp, log level (e.g., INFO, ERROR), and a descriptive message. All logs related to the plan adaptation process should include the user ID and plan week.
*   **Log Output:** For the MVP, all logs will be directed to `stdout`/`stderr` to ensure compatibility with Vercel's logging infrastructure. This allows for easy monitoring and debugging without requiring an external logging service.

## Dependencies and Integrations

### Core Dependencies

*   **Frontend (Next.js):**
    *   `next`: Core framework for React.
    *   `react`, `react-dom`: UI library.
    *   `typescript`: Language for type safety.
    *   `tailwindcss`: Utility-first CSS framework for styling.
    *   `@supabase/supabase-js`: Client library for interacting with Supabase.
    *   `zustand`: State management library.
    *   `recharts`: Library for creating charts and visualizations.

*   **Backend (FastAPI):**
    *   `fastapi`: Core web framework.
    *   `uvicorn`: ASGI server to run the FastAPI application.
    *   `pydantic`: For data validation and settings management.
    *   `supabase`: Python client for interacting with the Supabase database.
    *   `openai`: Python client for communicating with the OpenAI API.

### Integration Points

*   **Frontend -> Backend API:** The Next.js frontend will communicate with the FastAPI backend via a versioned REST API (`/api/v1/`).
*   **Frontend -> Supabase Auth:** The frontend will use the `@supabase/supabase-js` library to directly handle user authentication.
*   **Backend -> Supabase Database:** The FastAPI backend will connect to the Supabase PostgreSQL database for all data persistence operations.
*   **Backend -> OpenAI API:** The backend's AI Plan Adaptation Service will make secure calls to the OpenAI GPT-4 API to generate adapted plans.
*   **Vercel Cron Job -> Backend API:** A Vercel Cron Job will make a secure, scheduled call to the `/plans/trigger-adaptation` endpoint to initiate the weekly replanning process.

## Acceptance Criteria (Authoritative)

1.  **AC 2.1.1 (Workout Logging):** Users can mark a planned workout as "Completed" or "Skipped" via the UI.
2.  **AC 2.1.2 (Workout Logging):** Users can rate the difficulty of a completed workout on a 1-5 scale.
3.  **AC 2.1.3 (Workout Logging):** The workout log, including status and difficulty, is correctly stored in the database.
4.  **AC 2.2.1 (Meal Logging):** Users can mark a planned meal as "Eaten" or "Skipped" via the UI.
5.  **AC 2.2.2 (Meal Logging):** The meal log status is correctly stored in the database.
6.  **AC 2.3.1 (Plan Adaptation):** A Vercel Cron Job successfully triggers the backend adaptation process at the end of the week.
7.  **AC 2.3.2 (Plan Adaptation):** The AI correctly processes the user's logged workouts, meals, and difficulty ratings from the previous week.
8.  **AC 2.3.3 (Plan Adaptation):** The AI generates a new, adapted workout plan and a new, adapted meal plan for the upcoming week.
9.  **AC 2.3.4 (Plan Adaptation):** The new, adapted plans are correctly stored in the database.
10. **AC 2.4.1 (Progress Viz):** The dashboard correctly displays a summary of the user's current workout streak.
11. **AC 2.4.2 (Progress Viz):** The dashboard displays a visualization (e.g., a line chart) of the user's weight trend over the last 30 days.
12. **AC 2.5.1 (Notification):** The user receives an in-app notification when a new weekly plan has been generated.
13. **AC 2.5.2 (Notification):** The user can easily navigate to the new plan from the notification.

## Traceability Mapping

| Acceptance Criterion | Spec Section(s) | Component(s) / API(s) | Test Idea |
|---|---|---|---|
| **AC 2.1.1 - 2.1.3** | Detailed Design > APIs and Interfaces | `POST /log/workout`, `workout_log` table | E2E test logging a workout; API test to verify data persistence. |
| **AC 2.2.1 - 2.2.2** | Detailed Design > APIs and Interfaces | `POST /log/meal`, `meal_log` table | E2E test logging a meal; API test to verify data persistence. |
| **AC 2.3.1 - 2.3.4** | Detailed Design > APIs and Interfaces | `POST /plans/trigger-adaptation`, AI Plan Adaptation Service | Integration test of the full adaptation cycle; Unit test AI prompt construction. |
| **AC 2.4.1 - 2.4.2** | Detailed Design > APIs and Interfaces | `GET /progress/summary`, Progress Visualization components | Component test of the charts with mock data; API test for the summary endpoint. |
| **AC 2.5.1 - 2.5.2** | Detailed Design > APIs and Interfaces | `GET /notifications`, Notification UI component | E2E test to verify notification appears after plan adaptation; API test for notification retrieval. |

## Risks, Assumptions, Open Questions

*   **Risk:** The AI adaptation logic may be flawed, leading to poor or nonsensical plan evolution over time.
    *   **Mitigation:** Implement extensive unit testing for the adaptation logic with a wide range of simulated user data. Monitor generated plans for anomalies.
*   **Risk:** Incorrect logging of workout or meal data could lead to data corruption and poor AI recommendations.
    *   **Mitigation:** Use strict API validation for all incoming log data. The frontend UI should guide the user to prevent erroneous input.
*   **Risk:** The progress visualization charts could suffer from performance degradation as the user accumulates a large amount of historical data.
    *   **Mitigation:** Implement pagination for historical data and consider pre-aggregating data for chart rendering.
*   **Assumption:** Users will consistently log their progress. If they do not, the AI will have insufficient data to make meaningful adaptations.
*   **Assumption:** The Vercel Cron Job trigger is reliable and will execute on schedule to ensure timely plan updates.
*   **Question:** What is the optimal frequency for plan adaptation? Weekly is the initial assumption, but should this be configurable by the user in the future?
*   **Question:** How should the AI adaptation logic handle periods of sparse or missing user log data? Should it maintain the current plan, reduce intensity, or ask the user for input?

## Test Strategy Summary

The test strategy for Epic 2 will be heavily focused on validating the core AI adaptation logic and the integrity of the data logging pipeline.

*   **Backend:** Extensive unit tests will be written with `Pytest` to cover the AI adaptation logic, simulating a wide range of user logging scenarios (e.g., high adherence, low adherence, skipped workouts, varied difficulty ratings).
*   **Frontend:** Component tests using `React Testing Library` and `Jest` will validate the logging and progress visualization components.
*   **End-to-End (E2E):** `Playwright` tests will simulate a user's journey over a period of 2-3 weeks, logging progress and verifying that the plan evolves as expected.
*   **Integration:** Integration tests will focus on the Vercel Cron Job trigger, ensuring that the backend endpoint is correctly invoked and that the adaptation process runs to completion.
*   **Priority:** P0 and P1 tests will be prioritized to cover the successful execution of the AI adaptation endpoint, the data integrity of the logging endpoints, and the correct rendering of progress visualization.

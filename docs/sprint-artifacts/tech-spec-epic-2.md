# Epic Technical Specification: Adaptive Planning & Progress Logging

Date: 2025-12-14
Author: BIP
Epic ID: 2
Status: Draft

---

## Overview

As an active user, I can log my progress with simple clicks, and the app will automatically adapt my next week's plan to my performance, so my plan evolves with me. This epic focuses on building the core feedback loop of the application, enabling the AI to learn from user actions and personalize the experience over time. It introduces workout and meal logging, the backend logic for weekly plan adaptation, and the necessary UI to visualize progress and notify users.

## Objectives and Scope

### In Scope:
- **Story 2.1: Workout Logging UI:** Implement the user interface for logging workout completion and perceived difficulty.
- **Story 2.2: Meal Logging UI:** Implement the user interface for logging meal consumption.
- **Story 2.3: AI-Driven Weekly Plan Adaptation Logic:** Develop the backend service that processes user feedback and generates a new, adapted plan for the following week.
- **Story 2.4: Dashboard Progress Visualization:** Create dashboard components to visualize user progress, such as streaks and trends.
- **Story 2.5: New Plan Notification:** Implement in-app notifications to inform users when their new weekly plan is ready.

### Out of Scope:
- Advanced real-time plan adjustments within the current week.
- Social sharing of progress or achievements.
- Detailed food item nutritional analysis (macros, calories, etc.). The focus is on meal adherence.

## System Architecture Alignment

This epic directly engages with both frontend and backend components defined in the architecture.

- **Backend:** The core adaptation logic will be implemented within the `app/services/ai_plan_generator.py` and exposed via new endpoints in `app/api/v1/endpoints/plans.py`. This work will be triggered by a Vercel Cron Job as decided in ADR-001.
- **Frontend:** New UI components for logging will be created within `src/app/(dashboard)/workouts/` and `src/app/(dashboard)/meals/`. The progress visualization will be a new component on the main dashboard page (`src/app/(dashboard)/dashboard/page.tsx`), leveraging the Recharts library.
- **Database:** The `workout_log` and `meal_log` tables will be heavily utilized to store the data required for the AI adaptation logic.

## Detailed Design

### Services and Modules

| Service/Module | Responsibilities | Inputs | Outputs | Owner |
|---|---|---|---|---|
| **PlanAdaptationService** | Orchestrates the weekly plan adaptation. Fetches user logs, constructs AI prompts, calls the AI service, and saves the new plan. | `user_id` | New `workout_plan` and `meal_plan` | Backend Team |
| **LoggingService** | Handles the creation and updating of workout and meal log entries. | `user_id`, log data (workout/meal details) | Saved log entry | Backend Team |
| **NotificationService** | Creates and manages in-app notifications. | `user_id`, notification content | `notification` object | Backend Team |
| **ProgressDataService** | Aggregates and calculates progress metrics for the dashboard. | `user_id` | Progress data (streak, trends) | Backend Team |
| **WorkoutLoggingCard** | (Frontend Component) Displays a single workout and allows user to log completion and difficulty. | `workout` object | Log event | Frontend Team |
| **MealLoggingCard** | (Frontend Component) Displays a single meal and allows user to log consumption. | `meal` object | Log event | Frontend Team |
| **ProgressChart** | (Frontend Component) Renders progress visualization using Recharts. | `progress_data` | Chart UI | Frontend Team |

### Data Models and Contracts

**`workout_logs` Table**
```sql
CREATE TABLE workout_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    workout_plan_id INT REFERENCES workout_plans(id),
    exercise_name VARCHAR(255),
    sets_completed INT,
    reps_completed INT,
    weight_lifted FLOAT,
    difficulty_rating INT CHECK (difficulty_rating BETWEEN 1 AND 5),
    logged_at TIMESTAMPTZ DEFAULT NOW()
);
```

**`meal_logs` Table**
```sql
CREATE TABLE meal_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    meal_plan_id INT REFERENCES meal_plans(id),
    meal_name VARCHAR(255),
    status VARCHAR(50) CHECK (status IN ('Eaten', 'Skipped')),
    logged_at TIMESTAMPTZ DEFAULT NOW()
);
```

### APIs and Interfaces

**POST `/api/v1/log/workout`**
- **Description:** Logs a completed workout.
- **Request Body:**
  ```json
  {
    "workout_plan_id": 1,
    "exercise_name": "Push-ups",
    "sets_completed": 3,
    "reps_completed": 15,
    "weight_lifted": 0,
    "difficulty_rating": 3
  }
  ```
- **Response:** `201 Created`

**POST `/api/v1/log/meal`**
- **Description:** Logs a consumed meal.
- **Request Body:**
  ```json
  {
    "meal_plan_id": 1,
    "meal_name": "Oatmeal with Berries",
    "status": "Eaten"
  }
  ```
- **Response:** `201 Created`

**GET `/api/v1/progress`**
- **Description:** Retrieves aggregated progress data for the dashboard.
- **Response Body:**
  ```json
  {
    "workout_streak": 5,
    "weight_trend": [
      {"date": "2025-12-01", "weight": 70.5},
      {"date": "2025-12-08", "weight": 70.2},
      {"date": "2025-12-15", "weight": 69.8}
    ]
  }
  ```

**POST `/api/v1/plans/adapt` (Internal, triggered by Cron)**
- **Description:** Triggers the weekly plan adaptation for a user.
- **Request Body:**
  ```json
  {
    "user_id": "..."
  }
  ```
- **Response:** `200 OK`

### Workflows and Sequencing

**Weekly Plan Adaptation Workflow:**
1. **Trigger:** A Vercel Cron Job runs every Sunday at midnight (user's timezone).
2. **Fetch Users:** The job fetches all active users who are due for a new plan.
3. **For each user, the `PlanAdaptationService` is invoked:**
    a. **Fetch Logs:** Gathers all `workout_logs` and `meal_logs` from the past week.
    b. **Construct Prompt:** Creates a detailed prompt for the Pydantic AI framework with Gemini 2.5, summarizing the user's goals, previous plan, and logged adherence and difficulty ratings.
    c. **Generate Plan:** Calls the AI service to get the new, adapted workout and meal plan for the upcoming week.
    d. **Save Plan:** Stores the newly generated plan in the `workout_plans` and `meal_plans` tables.
    e. **Notify User:** Calls the `NotificationService` to create an in-app notification that a new plan is ready.

## Non-Functional Requirements

### Performance

- **Logging API:** Response times for `POST /api/v1/log/workout` and `POST /api/v1/log/meal` must be < 300ms.
- **Progress API:** Response time for `GET /api/v1/progress` must be < 500ms, even with a year's worth of log data. Caching will be critical here.
- **AI Adaptation Job:** The weekly adaptation job for a single user should complete in under 60 seconds to avoid timeouts.

### Security

- **RLS Policies:** Row Level Security policies must be implemented for the `workout_logs` and `meal_logs` tables to ensure a user can only access their own log data.
- **Endpoint Protection:** All new API endpoints must be protected and require a valid JWT from an authenticated user.

### Reliability/Availability

- **AI Service Failure:** The `PlanAdaptationService` must implement retry logic with exponential backoff when calling the Gemini API. If the AI service fails permanently, the job should be marked as failed and re-run automatically on the next scheduled interval.
- **Idempotency:** Logging endpoints should be designed to be idempotent where possible to prevent duplicate entries on client-side retries.

### Observability

- **Structured Logging:** The weekly `PlanAdaptationService` cron job must have detailed structured logging (JSON format) at each step (start, fetch logs, construct prompt, call AI, save plan, end/error).
- **Monitoring:** Key metrics for the adaptation job, such as duration, success rate, and AI token usage, should be logged and available for monitoring in the Vercel dashboard.

## Dependencies and Integrations

## Dependencies and Integrations

| Dependency/Integration | Type | Purpose | Story |
|---|---|---|---|
| **recharts** | Frontend Library | For rendering progress charts and visualizations on the dashboard. | 2.4 |
| **Vercel Cron Jobs** | Platform Service | To trigger the weekly `PlanAdaptationService` backend job. | 2.3 |
| **Pydantic AI with Gemini** | External API | To generate the adapted workout and meal plans based on user progress. | 2.3 |

## Acceptance Criteria (Authoritative)

### Story 2.1: Workout Logging UI
1.  **Given** I am viewing my daily workout plan, **when** I interact with a workout, **then** I can mark it as "Completed" or "Skipped".
2.  **Given** I have marked a workout as "Completed", **when** prompted, **then** I can rate its difficulty on a 1-5 scale.
3.  **Given** I have logged a workout, **then** the data is successfully saved to the `workout_logs` table in the database via the `POST /api/v1/log/workout` endpoint.

### Story 2.2: Meal Logging UI
1.  **Given** I am viewing my daily meal plan, **when** I interact with a meal, **then** I can mark it as "Eaten" or "Skipped".
2.  **Given** I have logged a meal, **then** the data is successfully saved to the `meal_logs` table in the database via the `POST /api/v1/log/meal` endpoint.

### Story 2.3: AI-Driven Weekly Plan Adaptation Logic
1.  **Given** it is the end of the week, **when** the weekly cron job runs, **then** it correctly identifies all users due for a new plan.
2.  **Given** the adaptation service is running for a user, **then** it successfully fetches all workout and meal logs for that user from the past 7 days.
3.  **Given** the service has the user's logs, **then** it constructs a valid, detailed prompt for the Gemini API.
4.  **Given** a successful AI response, **then** a new `workout_plan` and `meal_plan` are created and saved to the database for the upcoming week.

### Story 2.4: Dashboard Progress Visualization
1.  **Given** I am on the dashboard, **when** my data loads, **then** the `GET /api/v1/progress` endpoint is called.
2.  **Given** I have logged workouts for consecutive days, **then** the dashboard correctly displays my current workout streak.
3.  **Given** I have logged my weight multiple times, **then** a trend chart is rendered on the dashboard showing my weight changes over time.

### Story 2.5: New Plan Notification
1.  **Given** a new weekly plan has been successfully generated for me, **then** a notification record is created in the database.
2.  **Given** I have an unread notification, **when** I open the application, **then** an in-app notification is displayed (as per `feedback_patterns_dark.html`).
3.  **Given** I click on the notification, **then** I am navigated directly to my new weekly plan.

## Traceability Mapping

| Story ID | Acceptance Criteria | Spec Section(s) | Component(s)/API(s) | Test Idea |
|---|---|---|---|---|
| 2.1 | 2.1.1, 2.1.2, 2.1.3 | Detailed Design | `WorkoutLoggingCard`, `POST /api/v1/log/workout` | Unit test the component's state changes. Integration test the API endpoint. |
| 2.2 | 2.2.1, 2.2.2 | Detailed Design | `MealLoggingCard`, `POST /api/v1/log/meal` | Unit test the component's state changes. Integration test the API endpoint. |
| 2.3 | 2.3.1, 2.3.2, 2.3.3, 2.3.4 | Detailed Design, NFRs | `PlanAdaptationService`, Vercel Cron, Gemini API | End-to-end test the cron job trigger and plan generation. Mock the Gemini API for unit tests. |
| 2.4 | 2.4.1, 2.4.2, 2.4.3 | Detailed Design | `ProgressChart`, `GET /api/v1/progress` | Unit test the chart component with mock data. Integration test the progress data aggregation API. |
| 2.5 | 2.5.1, 2.5.2, 2.5.3 | Detailed Design | `NotificationService`, Frontend notification UI | Integration test the notification creation and display flow. |

## Risks, Assumptions, Open Questions

| Type | Description | Mitigation / Next Step |
|---|---|---|
| **Risk** | The quality of the AI-generated adapted plan is highly dependent on the quality of the prompt constructed from user logs. Poor prompts could lead to nonsensical plans. | **Mitigation:** Implement a robust prompt engineering process. Log all prompts and AI responses for analysis and fine-tuning. Create a "golden dataset" of user logs and expected plan adaptations for testing. |
| **Risk** | The volume of log data could grow significantly, impacting the performance of the `GET /api/v1/progress` endpoint and the weekly adaptation job. | **Mitigation:** Implement aggressive caching on the progress endpoint. Ensure database queries for the adaptation job are highly optimized and indexed. Consider archiving older log data. |
| **Assumption** | Users will consistently and accurately log their workouts and meals. | **Next Step:** The UI must be as low-friction as possible to encourage logging. If engagement with logging is low, we may need to introduce reminders or gamification elements. |
| **Question** | What is the ideal format for summarizing a week's worth of logs to the AI? Should we send raw logs, or a pre-processed summary? | **Next Step:** Experiment with different prompt formats during development. Start with a detailed summary and see if the AI can effectively use it. |

## Test Strategy Summary

- **Unit Testing:**
  - **Frontend:** Each new React component (`WorkoutLoggingCard`, `MealLoggingCard`, `ProgressChart`) will have unit tests using Jest and React Testing Library to verify rendering and state changes.
  - **Backend:** Core business logic in the `PlanAdaptationService` and `ProgressDataService` will be unit-tested. AI and database interactions will be mocked.
- **Integration Testing:**
  - **API:** Each new API endpoint will have integration tests using `Pytest` to validate request/response contracts, authentication/authorization, and database interactions.
  - **Frontend-Backend:** Test the full flow of logging data from the UI to the database.
- **End-to-End (E2E) Testing:**
  - A full E2E test will be created to simulate the weekly adaptation process:
    1. Seed the database with a user and a week of log data.
    2. Manually trigger the adaptation cron job.
    3. Verify that a new, adapted plan is correctly generated and stored in the database.
    4. Verify that a notification is created.
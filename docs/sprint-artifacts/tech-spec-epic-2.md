# Epic Technical Specification: Adaptive Planning & Progress Logging

Date: 2025-12-10
Author: BIP
Epic ID: 2
Status: Draft

---

## Overview

Epic 2, "Adaptive Planning & Progress Logging," is central to the AI Fitness & Meal Planner, enabling active users to log their progress and receive automatically adapted plans. This ensures the plan evolves with the user's performance and needs, promoting long-term engagement and adherence. The core "magic" of AI-driven personalization and dynamic adaptation is delivered through detailed logging for workouts and meals, AI logic for weekly replanning, in-app notifications, and historical progress views.

## Objectives and Scope

**In-Scope:**
- Detailed logging for workouts (completion status, perceived difficulty)
- Detailed logging for meals (consumption status)
- Core AI logic for automatic weekly replanning based on logged progress and feedback
- In-app notifications for new weekly plans
- Dashboard view to see historical progress (e.g., workout streak, weight trend)

**Out-of-Scope (for this epic):**
- Real-time plan adjustments (focus is on weekly adaptation)
- Social features or community sharing of progress
- Advanced analytics beyond basic progress visualization on the dashboard

## System Architecture Alignment

This epic aligns directly with the established architectural decision for **Background Job/Async Processing Strategy** using **Vercel Cron Jobs** (ADR-001) to trigger the weekly AI plan generation. The features will leverage the existing FastAPI backend (`app/api/v1/endpoints/plans.py` for logging and adaptation logic) and Next.js frontend (`src/app/(dashboard)/workouts/`, `src/app/(dashboard)/meals/` for logging UI) and Supabase for data persistence.

### Services and Modules

**Backend Services:**
*   **AI Plan Generator Service (`backend/app/services/ai_plan_generator.py`):**
    *   **Responsibility:** Interacts with the Pydantic AI framework (Gemini 2.5) to generate and adapt workout and meal plans. Processes user data (goals, logged activities, difficulty ratings) and constructs prompts for the AI. Stores generated plans in the database.
    *   **Inputs:** User ID, current plan data, logged workout/meal data, difficulty ratings.
    *   **Outputs:** New weekly workout and meal plans (structured JSON).
    *   **Owner:** Backend Team
*   **Logging Service (within FastAPI endpoints):**
    *   **Responsibility:** Handles persistence of user-logged workout and meal data to the Supabase database.
    *   **Inputs:** User ID, workout/meal ID, status (completed/skipped), difficulty rating (for workouts).
    *   **Outputs:** Confirmation of successful log.
    *   **Owner:** Backend Team

**Frontend Modules:**
*   **Workout Logging UI (`frontend/src/app/(dashboard)/workouts/`):**
    *   **Responsibility:** Provides user interface for logging workout completion status and perceived difficulty.
    *   **Inputs:** User interaction (clicks, ratings).
    *   **Outputs:** API calls to backend logging endpoints.
    *   **Owner:** Frontend Team
*   **Meal Logging UI (`frontend/src/app/(dashboard)/meals/`):**
    *   **Responsibility:** Provides user interface for logging meal consumption status.
    *   **Inputs:** User interaction (clicks).
    *   **Outputs:** API calls to backend logging endpoints.
    *   **Owner:** Frontend Team
*   **Dashboard Progress Visualization (`frontend/src/app/(dashboard)/dashboard/`):**
    *   **Responsibility:** Displays aggregated progress data (workout streak, weight trend) using charting libraries.
    *   **Inputs:** Aggregated progress data from backend API.
    *   **Outputs:** Visual representation of user progress.
    *   **Owner:** Frontend Team
*   **Notification Module (Frontend, potentially integrated with `feedback_patterns_dark.html`):**
    *   **Responsibility:** Displays in-app notifications for events like new plan generation.
    *   **Inputs:** Notification trigger from backend.
    *   **Outputs:** User alert.
    *   **Owner:** Frontend Team

### Data Models and Contracts

*   **`workout_plans` table:**
    *   `id` (PK, UUID)
    *   `user_id` (FK to `users.id`)
    *   `plan_data` (JSONB, stores full AI-generated workout plan details)
    *   `start_date` (Date)
    *   `end_date` (Date)
    *   `created_at` (Timestamp, UTC)
    *   `adapted_from_plan_id` (FK to `workout_plans.id`, nullable, for tracking adaptations)
*   **`meal_plans` table:**
    *   `id` (PK, UUID)
    *   `user_id` (FK to `users.id`)
    *   `plan_data` (JSONB, stores full AI-generated meal plan details)
    *   `start_date` (Date)
    *   `end_date` (Date)
    *   `created_at` (Timestamp, UTC)
    *   `adapted_from_plan_id` (FK to `meal_plans.id`, nullable, for tracking adaptations)
*   **`workout_log` table:**
    *   `id` (PK, UUID)
    *   `user_id` (FK to `users.id`)
    *   `workout_plan_id` (FK to `workout_plans.id`, tracks which plan this log belongs to)
    *   `logged_date` (Date)
    *   `status` (Enum: 'completed', 'skipped')
    *   `difficulty_rating` (Integer, 1-5, nullable for skipped)
    *   `created_at` (Timestamp, UTC)
*   **`meal_log` table:**
    *   `id` (PK, UUID)
    *   `user_id` (FK to `users.id`)
    *   `meal_plan_id` (FK to `meal_plans.id`, tracks which plan this log belongs to)
    *   `logged_date` (Date)
    *   `status` (Enum: 'eaten', 'skipped')
    *   `created_at` (Timestamp, UTC)
*   **`user_progress_summary` (Materialized View or computed):**
    *   Aggregates data for dashboard visualization (e.g., `workout_streak`, `weight_trend`). This would likely be derived on-demand or through background jobs rather than a persistent table for MVP.

### APIs and Interfaces

**Backend API (`/api/v1/`):**

*   **`POST /plans/generate-weekly`:**
    *   **Description:** Endpoint triggered by Vercel Cron Job to generate/adapt weekly plans for users.
    *   **Request:** `{ "user_id": UUID, "week_start_date": Date }` (or similar for cron job internal use)
    *   **Response:** `200 OK`
*   **`POST /log/workout`:**
    *   **Description:** Logs a user's workout status and difficulty.
    *   **Request:** `{ "workout_plan_id": UUID, "logged_date": Date, "status": "completed" | "skipped", "difficulty_rating": int (optional) }`
    *   **Response:** `200 OK`
    *   **Errors:** `400 Bad Request` (invalid input), `404 Not Found` (plan/workout not found).
*   **`POST /log/meal`:**
    *   **Description:** Logs a user's meal status.
    *   **Request:** `{ "meal_plan_id": UUID, "logged_date": Date, "status": "eaten" | "skipped" }`
    *   **Response:** `200 OK`
    *   **Errors:** `400 Bad Request` (invalid input), `404 Not Found` (plan/meal not found).
*   **`GET /progress/summary`:**
    *   **Description:** Retrieves aggregated progress data for dashboard visualization.
    *   **Request:** (Optional) Query parameters for date range, `user_id` (inferred from JWT).
    *   **Response:** `{ "workout_streak": int, "weight_trend": [{"date": Date, "weight": float}, ...], "other_metrics": ... }`
*   **Notifications Endpoint (TBD):**
    *   **Description:** API for managing and fetching in-app notifications.

### Workflows and Sequencing

1.  **Weekly Plan Generation & Adaptation:**
    *   **Trigger:** Vercel Cron Job (`ADR-001`) at the end of each week.
    *   **Sequence:**
        *   Cron Job triggers `POST /plans/generate-weekly` endpoint in FastAPI backend.
        *   Backend: `ai_plan_generator.py` retrieves user's previous week's logged `workout_log` and `meal_log` data.
        *   `ai_plan_generator.py` constructs a prompt with user preferences, goals, and performance data.
        *   `ai_plan_generator.py` calls Pydantic AI framework (Gemini 2.5) to generate new workout and meal plans.
        *   Backend stores new `workout_plans` and `meal_plans` in Supabase.
        *   Backend triggers in-app notification for the user.
2.  **Workout Logging:**
    *   **Trigger:** User interacts with `Workout Logging UI` (`workoutplan_dark.html`).
    *   **Sequence:**
        *   Frontend captures workout ID, status, and difficulty rating.
        *   Frontend calls `POST /log/workout` API.
        *   Backend saves new entry to `workout_log` table.
        *   Frontend displays success/error feedback.
3.  **Meal Logging:**
    *   **Trigger:** User interacts with `Meal Logging UI` (`mealplan_dark.html`).
    *   **Sequence:**
        *   Frontend captures meal ID and status.
        *   Frontend calls `POST /log/meal` API.
        *   Backend saves new entry to `meal_log` table.
        *   Frontend displays success/error feedback.
4.  **Dashboard Progress Visualization:**
    *   **Trigger:** User navigates to Dashboard.
    *   **Sequence:**
        *   Frontend calls `GET /progress/summary` API.
        *   Backend aggregates data from `workout_log`, `meal_log`, and potentially `users` table.
        *   Backend returns aggregated progress data.
        *   Frontend uses `Recharts` to display workout streak, weight trend, etc.

## Non-Functional Requirements

### Performance

*   **Rationale:** Ensures a responsive and smooth user experience, especially for core interactions like plan generation, logging, and dashboard visualization.
*   **Measurable Criteria:**
    *   Response time for non-AI queries (logging, progress retrieval) shall be less than 500ms.
    *   The system shall support at least 100 concurrent active users without degradation in performance.
    *   Next.js code splitting and Vercel CDN will optimize frontend loading.
    *   Backend caching for common database queries.

### Security

*   **Rationale:** The system handles sensitive personal and health-related data, requiring robust protection against unauthorized access and data breaches.
*   **Measurable Criteria:**
    *   All data in transit (HTTPS) and at rest (database encryption managed by Supabase) shall be encrypted.
    *   Access to user data shall be restricted by Row Level Security (RLS) policies.
    *   User authentication shall be handled by Supabase Auth using JWT tokens for secure sessions.
    *   Backend API endpoints will be protected and will require a valid JWT.
    *   The system shall comply with GDPR principles for data privacy and retention.

### Reliability/Availability

*   **Rationale:** To ensure consistent and dependable generation of workout and meal plans, which is core to the product's value proposition.
*   **Measurable Criteria:**
    *   The system shall implement retry mechanisms with exponential backoff for Pydantic AI framework (Gemini 2.5) API calls in `ai_plan_generator.py`.
    *   The system shall utilize caching for AI API responses to reduce latency and dependency.
    *   The system shall have fallback mechanisms (e.g., default plan templates) in case of AI API unavailability.
    *   Vercel Cron Jobs will ensure scheduled plan generation is reliable.

### Observability

*   **Rationale:** To enable effective monitoring, debugging, and understanding of application behavior, especially for critical AI plan generation and adaptation processes.
*   **Measurable Criteria:**
    *   Structured logging will be implemented with JSON format, including timestamp, log level (INFO, WARNING, ERROR), and a message.
    *   Logs will be output to `stdout`/`stderr`, compatible with Vercel's logging infrastructure.
    *   Key metrics related to plan generation (e.g., success rate, latency of AI calls) and logging (e.g., volume, error rates) will be captured and made available for monitoring.

## Dependencies and Integrations

### Frontend Dependencies:
*   **Next.js (v16.0.5):** Core framework for frontend application.
*   **React (with Next.js):** UI library.
*   **TypeScript:** Language for frontend development.
*   **Tailwind CSS:** Styling framework.
*   **Recharts:** Charting library for progress visualization (`Story 2.4`).
*   **Zustand:** Client-side state management.
*   **SWR/React Query:** Server-side state and data fetching for efficient data retrieval for logging and dashboard.
*   **`@supabase/supabase-js` (v2.86.0):** Integration with Supabase for authentication and real-time data.
*   **Vercel:** Deployment platform, integrates with GitHub Actions for CI/CD.

### Backend Dependencies:
*   **FastAPI (v0.122.0):** Core framework for backend API.
*   **Python 3.14:** Language for backend development.
*   **Pydantic AI framework with Gemini 2.5:** AI model for plan generation and adaptation (`Story 2.3`).
*   **Supabase (PostgreSQL):** Database and BaaS (Authentication, RLS, Storage).
*   **uv:** Package and project manager.
*   **Alembic:** Database migrations.

### Integration Points:
*   **Vercel Cron Jobs:** External trigger for the `POST /plans/generate-weekly` endpoint, enabling weekly plan generation (`Story 2.3`).
*   **Pydantic AI framework with Gemini 2.5:** Integrated into `ai_plan_generator.py` for AI-driven plan generation and adaptation.

## Acceptance Criteria (Authoritative)

**Story 2.1: Workout Logging UI**
*   Users can mark a planned workout as "Completed" or "Skipped".
*   Users can rate the difficulty of a completed workout (e.g., 1-5 scale).
*   This feedback is stored in the database.

**Story 2.2: Meal Logging UI**
*   Users can mark a planned meal as "Eaten" or "Skipped".
*   This feedback is stored in the database.

**Story 2.3: AI-Driven Weekly Plan Adaptation Logic**
*   The AI processes the user's logged workouts, meals, and difficulty ratings.
*   The AI generates a new, adapted workout plan for the upcoming week based on this data.
*   The AI generates a new, adapted meal plan for the upcoming week based on this data.
*   The new plans are stored in the database.

**Story 2.4: Dashboard Progress Visualization**
*   I see a summary of my workout streak.
*   I see a visualization of my weight trend over the last 30 days.
*   This visualization uses data from my logs.

**Story 2.5: New Plan Notification**
*   I receive an in-app notification confirming the new plan.
*   I can easily navigate to the new plan from the notification.

## Traceability Mapping

| Acceptance Criteria | Spec Section(s) | Component(s)/API(s) | Test Idea |
| :----------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Story 2.1: Users can mark a planned workout as "Completed" or "Skipped". | Detailed Design: Workout Logging UI, APIs: `POST /log/workout` | `frontend/src/app/(dashboard)/workouts/`, `POST /log/workout` | E2E: Verify successful logging of a completed workout. Unit: Test `difficulty-rating` component. Integration: API rejects out-of-range difficulty. |
| Story 2.1: Users can rate the difficulty of a completed workout (e.g., 1-5 scale). | Detailed Design: Workout Logging UI, APIs: `POST /log/workout` | `frontend/src/app/(dashboard)/workouts/`, `POST /log/workout` | E2E: Verify successful logging of a completed workout. Unit: Test `difficulty-rating` component. Integration: API rejects out-of-range difficulty. |
| Story 2.1: This feedback is stored in the database. | Detailed Design: Data Models: `workout_log` | `workout_log` table, `POST /log/workout` | E2E: Verify successful logging of a completed workout. |
| Story 2.2: Users can mark a planned meal as "Eaten" or "Skipped". | Detailed Design: Meal Logging UI, APIs: `POST /log/meal` | `frontend/src/app/(dashboard)/meals/`, `POST /log/meal` | E2E: Verify successful logging of an eaten/skipped meal. |
| Story 2.2: This feedback is stored in the database. | Detailed Design: Data Models: `meal_log` | `meal_log` table, `POST /log/meal` | E2E: Verify successful logging of an eaten/skipped meal. |
| Story 2.3: The AI processes the user's logged workouts, meals, and difficulty ratings. | Detailed Design: AI Plan Generator Service, Workflows: Weekly Plan Gen. | `ai_plan_generator.py` | Integration: AI increases intensity for high performers, AI decreases intensity for low performers. Unit: Test `calculate_performance_score`. |
| Story 2.3: The AI generates a new, adapted workout plan for the upcoming week based on this data. | Detailed Design: AI Plan Generator Service, Workflows: Weekly Plan Gen. | `ai_plan_generator.py` | Integration: AI increases intensity for high performers, AI decreases intensity for low performers. |
| Story 2.3: The AI generates a new, adapted meal plan for the upcoming week based on this data. | Detailed Design: AI Plan Generator Service, Workflows: Weekly Plan Gen. | `ai_plan_generator.py` | Integration: AI increases intensity for high performers, AI decreases intensity for low performers. |
| Story 2.3: The new plans are stored in the database. | Detailed Design: Data Models: `workout_plans`, `meal_plans` | `workout_plans` table, `meal_plans` table | Integration: AI increases intensity for high performers, AI decreases intensity for low performers. |
| Story 2.4: I see a summary of my workout streak. | Detailed Design: Dashboard Progress Visualization, APIs: `GET /progress/summary` | `frontend/src/app/(dashboard)/dashboard/`, `GET /progress/summary` | E2E: Verify workout streak updates correctly. Integration: API endpoint for progress data. |
| Story 2.4: I see a visualization of my weight trend over the last 30 days. | Detailed Design: Dashboard Progress Visualization, APIs: `GET /progress/summary` | `frontend/src/app/(dashboard)/dashboard/`, `GET /progress/summary` | E2E: Verify workout streak updates correctly. Integration: API endpoint for progress data. |
| Story 2.4: This visualization uses data from my logs. | Detailed Design: Dashboard Progress Visualization, APIs: `GET /progress/summary` | `frontend/src/app/(dashboard)/dashboard/`, `GET /progress/summary` | E2E: Verify workout streak updates correctly. Integration: API endpoint for progress data. |
| Story 2.5: I receive an in-app notification confirming the new plan. | Detailed Design: Notification Module | Frontend Notification UI | E2E: Verify new plan notification appears. |
| Story 2.5: I can easily navigate to the new plan from the notification. | Detailed Design: Notification Module | Frontend Notification UI | E2E: Verify clicking notification navigates to new plan. |

## Risks, Assumptions, Open Questions

*   **Risk:** The core feedback loop and AI adaptation are critical for user retention and product value. Failure here means the app is static and non-responsive to user needs.
    *   **Mitigation:** Robust unit, integration, and E2E testing for AI adaptation logic. Performance testing of AI-related API endpoints.
*   **Assumption:** The Pydantic AI framework (Gemini 2.5) provides reliable and consistent outputs based on prompts for plan generation and adaptation.
    *   **Open Question:** What is the cost per AI generation call, and how will this scale with user growth?
*   **Assumption:** Vercel Cron Jobs will reliably trigger the weekly plan generation process.
*   **Risk:** Potential for "cold start" issues or long response times from the AI service impacting user experience during plan generation.
    *   **Mitigation:** Implement caching for AI responses, retry mechanisms, and fallback to default templates.

## Test Strategy Summary

*   **Strategy:** Multi-layered approach employing a testing pyramid, emphasizing early and continuous testing.
*   **Test Pyramid:**
    *   **Unit Tests (60%):** Extensive unit tests for each new function in frontend (React components, state management) and backend (FastAPI services, data models).
    *   **Integration Tests (30%):** Focus on connections between frontend UI, backend APIs, and Supabase database. API contract testing (Pact) to ensure frontend and backend are in sync.
    *   **End-to-End (E2E) Tests (10%):** A small, critical set of E2E tests (Playwright) simulating the full user journey from logging a workout to receiving an adapted plan.
*   **Performance Tests:** Backend API endpoints related to logging and plan generation will be benchmarked using Locust to meet latency requirements (<500ms p95).
*   **Manual & Exploratory Testing:** Performed on new UI components to catch issues not covered by automated tests, focusing on usability and edge cases.
*   **CI/CD:** GitHub Actions to run all automated test suites on every commit/PR.

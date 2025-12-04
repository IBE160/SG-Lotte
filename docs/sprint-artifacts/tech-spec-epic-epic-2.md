# Epic Technical Specification: Adaptive Planning & Progress Logging

Date: 2025-12-04
Author: BIP
Epic ID: epic-2
Status: Draft

---

## Overview

This technical specification details Epic 2: "Adaptive Planning & Progress Logging" for the AI Fitness & Meal Planner application. The core objective of Epic 2 is to empower active users to log their progress effortlessly and enable the application's AI to automatically adapt subsequent weekly plans based on this logged data. This ensures the user's plan evolves dynamically with their performance and adherence, reinforcing long-term healthy habits.

## Objectives and Scope

The primary objective of Epic 2 is to implement the core feedback loop for the AI-driven personalization engine. This involves capturing user progress and leveraging it to refine future plans.

**In-Scope:**
*   Implementation of user interfaces for detailed logging of completed/skipped workouts (FR-004) and meals (FR-005).
*   Development of the backend AI logic responsible for automatically generating and adapting weekly workout and meal plans based on user activity, difficulty ratings, and dietary preferences (FR-002, FR-003).
*   Integration of in-app notifications to inform users when their new, adapted weekly plans are ready (FR-007).
*   Introduction of a basic view on the dashboard to visualize historical progress, fostering motivation and informed decision-making (FR-006).

**Out-of-Scope (for this Epic):**
*   Initial user registration, login, and the 5-step guided onboarding process (covered in Epic 1).
*   Comprehensive user profile management, application settings, and advanced account controls (covered in Epic 3).
*   Advanced analytics, detailed historical trends, or data export functionalities (deferred to future phases/epics).

## System Architecture Alignment

Epic 2's implementation aligns directly with the established decoupled frontend (Next.js) and backend (FastAPI) architecture, leveraging Supabase for data persistence.

*   **Backend Components:** The core adaptation logic and API endpoints for logging will reside within `app/api/v1/endpoints/plans.py` and potentially new services for AI processing (e.g., `ai_plan_generator.py`).
*   **Frontend Components:** User interfaces for logging workouts and meals will be developed under `src/app/(dashboard)/workouts/` and `src/app/(dashboard)/meals/`. The dashboard will be updated to include progress visualization.
*   **Architectural Decisions:** This epic directly utilizes the **ADR-001 Background Job/Async Processing Strategy** for weekly plan adaptation (Vercel Cron Jobs triggering backend logic) and benefits from the **ADR-002 Caching Strategy** to maintain performance. Data modeling will extend the existing Supabase (PostgreSQL) structure with new tables for workout and meal logs.

## Detailed Design

### Services and Modules

### Services and Modules

**Backend Services:**
*   **Progress Logging Service:**
    *   **Responsibility:** Receives and validates user-logged data for workouts and meals. Stores this data in the Supabase database.
    *   **Components:** `app/api/v1/endpoints/logging.py`, `app/services/progress_service.py`
*   **AI Plan Adaptation Service:**
    *   **Responsibility:** Processes logged user progress, analyzes adherence and performance, and generates adapted weekly workout and meal plans. Integrates with existing AI models.
    *   **Components:** `app/services/ai_plan_adapter.py`, `app/background_tasks/plan_adaptation.py` (triggered by Vercel Cron Jobs)
*   **Notification Service:**
    *   **Responsibility:** Manages and sends in-app notifications to users regarding new adapted plans.
    *   **Components:** `app/services/notification_service.py`

**Frontend Modules:**
*   **Workout Logging UI:**
    *   **Responsibility:** Provides user interface for logging completed/skipped workouts, including details like exercises, reps, sets, and perceived effort.
    *   **Components:** `src/app/(dashboard)/workouts/log-workout-page.tsx`, `src/components/workout-log-form.tsx`
*   **Meal Logging UI:**
    *   **Responsibility:** Provides user interface for logging consumed meals, including details like food items, portions, and perceived satisfaction.
    *   **Components:** `src/app/(dashboard)/meals/log-meal-page.tsx`, `src/components/meal-log-form.tsx`
*   **Progress Visualization Module:**
    *   **Responsibility:** Displays historical progress data (e.g., workout completion rate, meal adherence, performance trends) on the user dashboard.
    *   **Components:** `src/components/progress-charts.tsx`, `src/app/(dashboard)/dashboard-page.tsx`

### Data Models and Contracts

### Data Models and Contracts

**1. WorkoutLog (New Table)**
*   **Purpose:** Stores user-logged workout details.
*   **Fields:**
    *   `id` (UUID, PK)
    *   `user_id` (UUID, FK to Users.id)
    *   `workout_plan_id` (UUID, FK to WorkoutPlans.id, nullable - for ad-hoc workouts)
    *   `date` (DATE)
    *   `status` (ENUM: 'completed', 'skipped', 'partial')
    *   `duration_minutes` (INTEGER, nullable)
    *   `notes` (TEXT, nullable)
    *   `created_at` (TIMESTAMP)

**2. MealLog (New Table)**
*   **Purpose:** Stores user-logged meal details.
*   **Fields:**
    *   `id` (UUID, PK)
    *   `user_id` (UUID, FK to Users.id)
    *   `meal_plan_id` (UUID, FK to MealPlans.id, nullable - for ad-hoc meals)
    *   `date` (DATE)
    *   `status` (ENUM: 'consumed', 'skipped', 'partial')
    *   `food_items_json` (JSONB, stores array of food items, quantities)
    *   `notes` (TEXT, nullable)
    *   `created_at` (TIMESTAMP)

**3. UserProgress (New Table)**
*   **Purpose:** Aggregated summary of user progress for AI adaptation.
*   **Fields:**
    *   `id` (UUID, PK)
    *   `user_id` (UUID, FK to Users.id)
    *   `metric_name` (VARCHAR, e.g., 'workout_completion_rate', 'meal_adherence')
    *   `value` (FLOAT)
    *   `date` (DATE, when metric was recorded/calculated)
    *   `created_at` (TIMESTAMP)

**4. WeeklyPlan (Updated Table)**
*   **Purpose:** Existing table, to be updated with fields reflecting adaptation.
*   **Fields (New/Updated):**
    *   `adaptation_notes` (TEXT, nullable, notes from AI on why plan was adapted)
    *   `adapted_from_plan_id` (UUID, FK to self, nullable, for tracking plan lineage)

**Relationships:**
*   `WorkoutLog` M:1 `Users`
*   `MealLog` M:1 `Users`
*   `UserProgress` M:1 `Users`
*   `WorkoutLog` M:1 `WorkoutPlans` (optional)
*   `MealLog` M:1 `MealPlans` (optional)
*   `WeeklyPlan` 1:1 `WeeklyPlan` (self-referencing for lineage)

### APIs and Interfaces

### APIs and Interfaces

**1. Progress Logging API (Backend - FastAPI)**
*   **Endpoint:** `/api/v1/progress/workouts`
    *   **Method:** `POST`
    *   **Description:** Logs a completed or skipped workout.
    *   **Authentication:** Required (JWT)
    *   **Request Body (JSON):**
        ```json
        {
          "workout_plan_id": "uuid_of_workout_plan", // Optional
          "date": "YYYY-MM-DD",
          "status": "completed", // "completed", "skipped", "partial"
          "duration_minutes": 60, // Optional
          "notes": "Felt great today!" // Optional
        }
        ```
    *   **Response (201 Created - JSON):**
        ```json
        {
          "message": "Workout logged successfully",
          "log_id": "uuid_of_new_log"
        }
        ```
*   **Endpoint:** `/api/v1/progress/meals`
    *   **Method:** `POST`
    *   **Description:** Logs a consumed or skipped meal.
    *   **Authentication:** Required (JWT)
    *   **Request Body (JSON):**
        ```json
        {
          "meal_plan_id": "uuid_of_meal_plan", // Optional
          "date": "YYYY-MM-DD",
          "status": "consumed", // "consumed", "skipped", "partial"
          "food_items": [ // Optional
            {"name": "Chicken Breast", "quantity": "150g"},
            {"name": "Broccoli", "quantity": "200g"}
          ],
          "notes": "Enjoyed this healthy meal." // Optional
        }
        ```
    *   **Response (201 Created - JSON):**
        ```json
        {
          "message": "Meal logged successfully",
          "log_id": "uuid_of_new_log"
        }
        ```

**2. Plan Adaptation Trigger (Backend - FastAPI)**
*   **Endpoint:** `/api/v1/internal/adapt-plan/{user_id}`
    *   **Method:** `POST`
    *   **Description:** Internal endpoint triggered by Vercel Cron Job to initiate AI plan adaptation for a specific user.
    *   **Authentication:** Internal API Key / Service Token
    *   **Request Body (JSON):** (Empty or minimal, e.g., `{"trigger_date": "YYYY-MM-DD"}`)
    *   **Response (202 Accepted - JSON):**
        ```json
        {
          "message": "Plan adaptation process initiated",
          "task_id": "uuid_of_background_task"
        }
        ```

**3. Progress Data Retrieval API (Backend - FastAPI)**
*   **Endpoint:** `/api/v1/progress/summary/{user_id}`
    *   **Method:** `GET`
    *   **Description:** Retrieves aggregated progress data for dashboard visualization.
    *   **Authentication:** Required (JWT)
    *   **Query Parameters:** `start_date`, `end_date` (YYYY-MM-DD)
    *   **Response (200 OK - JSON):**
        ```json
        {
          "workout_completion_rate": 0.85,
          "meal_adherence_rate": 0.90,
          "workout_logs": [...], // Summary or recent logs
          "meal_logs": [...] // Summary or recent logs
        }
        ```

**4. Notifications API (Backend - FastAPI)**
*   **Endpoint:** `/api/v1/notifications/{user_id}`
    *   **Method:** `GET`
    *   **Description:** Retrieves pending in-app notifications.
    *   **Authentication:** Required (JWT)
    *   **Response (200 OK - JSON):**
        ```json
        [
          {"id": "uuid", "message": "Your new weekly plan is ready!", "type": "plan_update", "read": false}
        ]
        ```

### Workflows and Sequencing

{{workflows_sequencing}}

## Non-Functional Requirements

### Performance
*   **Logging Latency:** User workout/meal logging actions should complete within 500ms 95% of the time.
*   **Plan Adaptation Time:** Weekly plan adaptation process, triggered by cron job, should complete for all active users within a 2-hour window.
*   **Dashboard Load Time:** Progress visualization on the dashboard should load within 2 seconds 90% of the time.

### Security
*   **Data Protection:** All user progress and plan data must be encrypted at rest and in transit (TLS 1.2+).
*   **Authentication & Authorization:** All API endpoints for logging and data retrieval require authenticated users with appropriate authorization checks (e.g., users can only view/modify their own data).
*   **Input Validation:** Robust input validation must be implemented on all logging endpoints to prevent injection attacks and ensure data integrity.

### Reliability/Availability
*   **Uptime:** The logging and progress retrieval APIs should maintain 99.9% uptime.
*   **Data Durability:** All logged data must be persistently stored with backups, ensuring zero data loss in case of system failures.
*   **Error Handling:** The system should gracefully handle errors during plan adaptation and notify administrators without impacting user-facing features.

### Observability
*   **Monitoring:** Implement comprehensive monitoring for API response times, error rates, and background job execution status.
*   **Logging:** All critical actions (e.g., successful logs, plan adaptations, errors) should be logged with sufficient detail for debugging and auditing.
*   **Alerting:** Set up alerts for critical system failures, performance degradation, and security incidents.

## Dependencies and Integrations

## Dependencies and Integrations

*   **Supabase (PostgreSQL):** Version `latest` (as of project start). Used for primary data storage for `WorkoutLog`, `MealLog`, `UserProgress`, and `WeeklyPlan` tables.
*   **FastAPI:** Version `0.104.1`. Backend API framework for logging and data retrieval endpoints.
*   **Next.js:** Version `14.0.3`. Frontend framework for user interfaces and progress visualization.
*   **Vercel Cron Jobs:** Used to schedule and trigger the weekly AI plan adaptation process for active users.
*   **AI Model Service (Internal/External):** Specific version `X.Y.Z` or API endpoint for the AI engine responsible for plan adaptation (details TBD by AI team).
*   **JWT (JSON Web Tokens):** For user authentication and API security. Library versions will align with FastAPI and Next.js best practices (e.g., `python-jose` for FastAPI, `next-auth` for Next.js).
*   **Charting Library (Frontend):** e.g., `Recharts` or `Chart.js` (version `A.B.C`) for progress visualization on the dashboard.

## Acceptance Criteria (Authoritative)

## Acceptance Criteria (Authoritative)

**FR-002: AI-driven Weekly Plan Adaptation**
*   **AC1:** Given a user logs their progress for a week, when the weekly adaptation job runs, then the AI system shall generate a new weekly plan that reflects the logged performance and adherence, adjusting workout intensity and meal recommendations.
*   **AC2:** Given a user's previous plan had high adherence, when a new plan is generated, then the new plan shall subtly increase intensity or adjust dietary targets.
*   **AC3:** Given a user's previous plan had low adherence, when a new plan is generated, then the new plan shall offer more flexible alternatives or reduced intensity.

**FR-003: AI-driven Meal Plan Adaptation**
*   **AC1:** Given a user logs their meal adherence, when the weekly adaptation job runs, then the AI system shall adjust future meal plans to better match user preferences and logged consumption patterns.

**FR-004: User Log Workout Progress**
*   **AC1:** Given a user is viewing their workout plan, when they complete a workout, then they shall be able to log it as "completed" with optional notes and duration.
*   **AC2:** Given a user has a workout scheduled, when they skip it, then they shall be able to log it as "skipped" with an optional reason.
*   **AC3:** Given a user logs a workout, then the system shall store the log entry accurately, associated with their user profile and the specific workout/plan.

**FR-005: User Log Meal Progress**
*   **AC1:** Given a user is viewing their meal plan, when they consume a meal, then they shall be able to log it as "consumed" with optional food items and notes.
*   **AC2:** Given a user has a meal scheduled, when they skip it, then they shall be able to log it as "skipped" with an optional reason.
*   **AC3:** Given a user logs a meal, then the system shall store the log entry accurately, associated with their user profile and the specific meal/plan.

**FR-006: Visualize Historical Progress**
*   **AC1:** Given a user navigates to their dashboard, then they shall see a visual representation (e.g., chart) of their workout completion rate over the last 30 days.
*   **AC2:** Given a user navigates to their dashboard, then they shall see a visual representation of their meal adherence over the last 30 days.

**FR-007: In-App Notifications for Adapted Plans**
*   **AC1:** Given a new weekly plan has been generated for a user by the AI adaptation service, then the user shall receive an in-app notification indicating their new plan is ready.
*   **AC2:** When a user clicks on the notification for a new plan, then they shall be directed to view their new weekly plan.

## Traceability Mapping

## Traceability Mapping

| Acceptance Criteria ID | Technical Spec Section | Involved Components (Backend/Frontend) | Planned Tests (Unit/Integration/E2E) |
|------------------------|------------------------|----------------------------------------|---------------------------------------|
| FR-002: AC1, AC2, AC3    | AI Plan Adaptation     | AI Plan Adaptation Service             | Integration, E2E                      |
| FR-003: AC1            | AI Meal Adaptation     | AI Plan Adaptation Service             | Integration, E2E                      |
| FR-004: AC1, AC2, AC3    | Progress Logging API   | Progress Logging Service, Workout Logging UI | Unit, Integration, E2E                |
| FR-005: AC1, AC2, AC3    | Progress Logging API   | Progress Logging Service, Meal Logging UI | Unit, Integration, E2E                |
| FR-006: AC1, AC2         | Progress Data Retrieval API | Progress Data Retrieval API, Progress Visualization Module | Integration, E2E                      |
| FR-007: AC1, AC2         | Notifications API      | Notification Service                   | Integration, E2E                      |
| NFRs (Performance)     | Performance NFRs       | All relevant services/modules          | Load/Performance Tests                |
| NFRs (Security)        | Security NFRs          | All relevant services/modules          | Security Penetration Tests            |
| NFRs (Reliability)     | Reliability NFRs       | All relevant services/modules          | Chaos Engineering, Resilience Tests   |
| NFRs (Observability)   | Observability NFRs     | All relevant services/modules          | Monitoring System Checks              |
| Dependencies           | Dependencies Section   | All relevant services/modules          | Compatibility Tests                   |

## Risks, Assumptions, Open Questions

## Risks, Assumptions, Open Questions

**Risks:**
*   **AI Model Accuracy:** The effectiveness of plan adaptation is highly dependent on the accuracy and quality of the underlying AI models.
    *   **Mitigation:** Regular monitoring of AI model performance, A/B testing adapted plans, and clear feedback mechanisms for users.
*   **User Adoption of Logging:** If users do not consistently log their progress, the AI adaptation will be less effective.
    *   **Mitigation:** Intuitive UI/UX for logging, in-app reminders, and clear communication of the benefits of logging.
*   **Performance Bottlenecks in AI Adaptation:** Processing and adapting plans for a large user base might introduce performance issues.
    *   **Mitigation:** Implement efficient background processing (Vercel Cron Jobs), optimize database queries, and consider horizontal scaling for AI services.

**Assumptions:**
*   **Existing AI models are sufficient:** We assume the core AI models for plan generation can be adapted to handle progress-based adjustments without significant re-architecture.
*   **Supabase scalability:** Supabase (PostgreSQL) will scale adequately to handle the increased load from logging and user progress data.
*   **Vercel Cron Jobs reliability:** Vercel Cron Jobs will reliably trigger the backend adaptation process on schedule.
*   **Clear definitions of "completed," "skipped," "partial" for workouts/meals:** Assumed to be well-understood by both users and the system.

**Open Questions:**
*   What is the specific algorithm or logic for AI plan adaptation? (To be detailed by AI team)
*   How will "difficulty ratings" for workouts be integrated into the adaptation logic?
*   What is the desired frequency and granularity of progress visualization on the dashboard? (Daily, weekly, monthly?)
*   Are there any third-party integrations required for AI model deployment or specialized data processing?

## Test Strategy Summary

## Test Strategy Summary

The testing strategy for Epic 2 will encompass a multi-layered approach to ensure the quality, reliability, and correctness of the adaptive planning and progress logging features.

*   **Unit Testing:**
    *   **Focus:** Individual functions and methods within the backend (e.g., progress logging validation, AI adaptation logic) and frontend (e.g., UI component rendering, state management).
    *   **Tools:** Pytest for Python backend, Jest/React Testing Library for Next.js frontend.
*   **Integration Testing:**
    *   **Focus:** Interactions between different services/modules (e.g., frontend API calls to backend, backend interacting with Supabase, AI adaptation service calling AI models).
    *   **Tools:** FastAPI test client for backend, Cypress or Playwright for critical frontend-backend flows.
*   **End-to-End (E2E) Testing:**
    *   **Focus:** Simulating complete user journeys, such as logging a workout, observing its impact on the dashboard, and verifying the adaptation of the next weekly plan.
    *   **Tools:** Cypress or Playwright.
*   **Performance Testing:**
    *   **Focus:** Assessing the system's responsiveness and stability under various load conditions, especially for progress logging and plan adaptation.
    *   **Tools:** Locust or JMeter.
*   **Security Testing:**
    *   **Focus:** Identifying vulnerabilities in authentication, authorization, data handling, and input validation for all new endpoints.
    *   **Tools:** Manual penetration testing, automated security scans.
*   **Data Integrity Testing:**
    *   **Focus:** Ensuring that logged data is correctly stored, retrieved, and used by the AI adaptation process. This includes boundary conditions and edge cases.
*   **User Acceptance Testing (UAT):**
    *   **Focus:** Involving end-users to validate that the new features meet their needs and expectations, and that the user experience is intuitive.

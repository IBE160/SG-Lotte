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

{{apis_interfaces}}

### Workflows and Sequencing

{{workflows_sequencing}}

## Non-Functional Requirements

### Performance

{{nfr_performance}}

### Security

{{nfr_security}}

### Reliability/Availability

{{nfr_reliability}}

### Observability

{{nfr_observability}}

## Dependencies and Integrations

{{dependencies_integrations}}

## Acceptance Criteria (Authoritative)

{{acceptance_criteria}}

## Traceability Mapping

{{traceability_mapping}}

## Risks, Assumptions, Open Questions

{{risks_assumptions_questions}}

## Test Strategy Summary

{{test_strategy}}

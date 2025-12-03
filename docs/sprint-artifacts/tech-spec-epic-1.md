# Epic Technical Specification: First Plan & Foundation

Date: 2025-12-03
Author: BIP
Epic ID: 1
Status: Draft

---

## Overview

This document details the technical specification for Epic 1: 'First Plan & Foundation' of the ibe160 AI Fitness & Meal Planner. The overarching goal of the project is to deliver a comprehensive, AI-assisted web application for personalized workout and meal plans. Epic 1 specifically focuses on enabling new users to quickly sign up, define core goals, and receive their initial AI-generated plans, thereby initiating their health journey efficiently.

## Objectives and Scope

**In-Scope:**
*   User Registration and Login with Email Verification.
*   Guided 5-step onboarding for preference collection.
*   Initial AI-driven generation of personalized 7-day workout and meal plans.
*   Display of the current week's plan on a basic dashboard.
*   Core technical setup including Next.js frontend, FastAPI backend, and Supabase for database/authentication.
*   Implementation of a structured JSON output for AI-generated plans.

**Out-of-Scope (for Epic 1):**
*   Detailed progress tracking beyond basic completion logging.
*   Advanced dashboard visualizations or historical data.
*   Weekly plan adaptation logic (covered in Epic 2).
*   User profile enhancements beyond initial goals/preferences.
*   Offline support, chat assistants, gamification, or calendar integrations.

## System Architecture Alignment

The design aligns with the established decoupled frontend (Next.js) and backend (FastAPI) architecture. Key components for Epic 1 include the `users.py` endpoint on the backend, responsible for user *profile management* (for Supabase authenticated users), and `ai_plan_generator.py` service, responsible for initial plan generation. The frontend will implement the onboarding and dashboard UIs within `src/app/(auth)/` and `src/app/(dashboard)/dashboard/`, interacting with the backend via a versioned REST API for profile and plan data, and *directly with Supabase for user authentication (registration, login, email verification)*.

## Detailed Design

### Services and Modules

*   **`backend/app/api/v1/endpoints/users.py`**:
    *   **Responsibilities:** Handles user *profile management* (e.g., fitness goals, dietary preferences) for *authenticated users*. Core registration and login are handled directly by Supabase Auth.
    *   **Inputs:** Authenticated user's JWT, profile data.
    *   **Outputs:** Updated user profile.
    *   **Owner:** Backend Team
*   **`backend/app/services/ai_plan_generator.py`**:
    *   **Responsibilities:** Orchestrates calls to OpenAI GPT-4 for initial workout and meal plan generation (as per FR-002, FR-003). Validates AI output.
    *   **Inputs:** User preferences (goals, dietary), AI prompts.
    *   **Outputs:** Structured JSON for workout and meal plans.
    *   **Owner:** Backend Team
*   **`frontend/src/app/(auth)/`**:
    *   **Responsibilities:** Implements the user registration, login, and 5-step onboarding user interfaces. *Interacts directly with Supabase Auth for registration and login, and with the `users.py` endpoint for saving profile-related preferences during onboarding.*
    *   **Inputs:** User input from forms.
    *   **Outputs:** Displays UI, sends user data.
    *   **Owner:** Frontend Team
*   **`frontend/src/app/(dashboard)/dashboard/`**:
    *   **Responsibilities:** Displays the initial AI-generated workout and meal plan.
    *   **Inputs:** Fetches plan data from backend.
    *   **Outputs:** Displays plan UI.
    *   **Owner:** Frontend Team

### Data Models and Contracts

*   **`users` table (Supabase/PostgreSQL)**:
    *   `id` (UUID, PK) - Maps to `auth.users.id`
    *   `email` (TEXT, UNIQUE, NOT NULL) - Redundant with `auth.users.email` but useful for profile data.
    *   *Password management handled exclusively by Supabase Auth.*
    *   `fitness_goal` (TEXT)
    *   `dietary_preference` (TEXT)
    *   `created_at` (TIMESTAMP, default NOW())
    *   `updated_at` (TIMESTAMP)
*   **`workout_plans` table (Supabase/PostgreSQL)**:
    *   `id` (UUID, PK)
    *   `user_id` (UUID, FK to `users.id`, NOT NULL)
    *   `plan_data` (JSONB, NOT NULL) - Structured AI output for workouts
    *   `start_date` (DATE, NOT NULL)
    *   `end_date` (DATE, NOT NULL)
    *   `generated_at` (TIMESTAMP, default NOW())
*   **`meal_plans` table (Supabase/PostgreSQL)**:
    *   `id` (UUID, PK)
    *   `user_id` (UUID, FK to `users.id`, NOT NULL)
    *   `plan_data` (JSONB, NOT NULL) - Structured AI output for meals
    *   `start_date` (DATE, NOT NULL)
    *   `end_date` (DATE, NOT NULL)
    *   `generated_at` (TIMESTAMP, default NOW())

### APIs and Interfaces

*   **User Profile Management (`/api/v1/users`)**:
    *   *User registration and login are handled directly by Supabase Auth (e.g., via `@supabase/supabase-js` on the frontend).*
    *   `GET /me`: Get current user profile *for an authenticated user*.
        *   Response: `{ "id": "uuid", "email": "string", "fitness_goal": "string", "dietary_preference": "string" }`
    *   `PUT /me`: Update user profile (fitness goal, dietary preference) *for an authenticated user*.
        *   Request: `{ "fitness_goal": "string", "dietary_preference": "string" }`
        *   Response: `{ "message": "Profile updated" }`
*   **Plan Generation & Retrieval (`/api/v1/plans`)**:
    *   `POST /generate`: Trigger initial AI plan generation.
        *   Request: `{ "user_id": "uuid", "preferences": { ... } }`
        *   Response: `{ "message": "Plan generation initiated" }` or `{ "plan_id": "uuid" }`
    *   `GET /current`: Retrieve current week's workout and meal plans.
        *   Response: `{ "workout_plan": { ... }, "meal_plan": { ... } }`

### Workflows and Sequencing

1.  **New User Onboarding Flow:**
    *   User navigates to the frontend registration page.
    *   User submits email and password *directly to Supabase Auth*.
    *   User receives verification email from Supabase.
    *   User verifies email via link (handled by Supabase Auth).
    *   User logs in *directly via Supabase Auth*.
    *   User is redirected to 5-step onboarding UI (`frontend/src/app/(auth)/`).
    *   User submits preferences, saved via `PUT /api/v1/users/me` (to backend profile management).
    *   Initial AI plan generation is triggered via `POST /api/v1/plans/generate`.
    *   User is redirected to dashboard (`frontend/src/app/(dashboard)/dashboard/`).
    *   Dashboard fetches and displays the current plan via `GET /api/v1/plans/current`.
2.  **AI Plan Generation:**
    *   `ai_plan_generator.py` service receives request (triggered during onboarding).
    *   Constructs prompt using user preferences.
    *   Calls OpenAI GPT-4 API.
    *   Validates structured JSON response.
    *   Stores workout and meal plans in `workout_plans` and `meal_plans` tables.
    *   Returns plan confirmation to caller.

## Non-Functional Requirements

### Performance

*   **Target Latency:** Response time for non-AI queries shall be less than 500ms (PRD).
*   **Concurrency:** Support at least 100 concurrent active users without performance degradation (PRD).
*   **Caching Strategy:** Multi-layered caching will be implemented: in-memory caching on the FastAPI backend for common queries and SWR/React Query on the Next.js frontend for client-side data caching (Architecture).
*   **Optimization:** Next.js code splitting and Vercel's CDN will be utilized for fast initial page loads and asset delivery (Architecture).

### Security

*   **Data Encryption:** All data in transit (HTTPS/SSL) and at rest (managed by Supabase) shall be encrypted (PRD, Architecture).
*   **Authentication:** User authentication will be handled by Supabase Auth, utilizing JWT tokens for secure sessions (PRD, Architecture).
*   **Authorization:** Supabase's Row Level Security (RLS) will be enabled to restrict user access to their own data (PRD, Architecture).
*   **API Security:** Backend API endpoints will require a valid JWT for access (Architecture).
*   **Compliance:** The system will comply with GDPR principles for data privacy and retention (PRD).

### Reliability/Availability

*   **AI Integration:** For OpenAI API calls, retry mechanisms with exponential backoff will be implemented (PRD).
*   **AI Caching:** Caching will be utilized for OpenAI API responses to reduce latency and dependency (PRD).
*   **AI Fallback:** Fallback mechanisms (e.g., default plan templates) will be in place for OpenAI API unavailability (PRD).

### Observability

*   **Logging:** Structured logging in JSON format will be implemented, including timestamp, log level (INFO, WARNING, ERROR), and message. Logs will be output to `stdout`/`stderr` (Architecture).
*   **Metrics:** (Monitoring of AI and performance systems implied).
*   **Tracing:** (Not explicitly defined for Epic 1).

## Dependencies and Integrations

*   **Frontend Technologies:**
    *   **Next.js:** v16.0.5 (React framework)
    *   **TypeScript:** (Language)
    *   **Tailwind CSS:** (Styling framework)
    *   **Zustand:** (Client-side state management)
    *   **SWR/React Query:** (Server-side state management/data fetching)
*   **Backend Technologies:**
    *   **FastAPI:** v0.122.0 (Python web framework)
    *   **Python:** v3.14 (Programming language)
*   **Database & Authentication:**
    *   **Supabase:** (Managed PostgreSQL database, Authentication as a Service)
    *   **`@supabase/supabase-js`:** v2.86.0 (Supabase client library for Frontend)
*   **AI Service:**
    *   **OpenAI GPT-4 API:** (AI model for plan generation)

**Integration Points:**
*   **Frontend ↔ Backend:** Next.js (Frontend) communicates with FastAPI (Backend) via `/api/v1/` REST API endpoints.
*   **Frontend ↔ Supabase:** Next.js (Frontend) interacts directly with Supabase for user authentication and real-time data updates using `@supabase/supabase-js`.
*   **Backend ↔ Supabase:** FastAPI (Backend) connects to the Supabase PostgreSQL database for data persistence.
*   **Backend ↔ OpenAI API:** FastAPI (Backend) communicates with the OpenAI GPT-4 API for AI-driven plan generation.

## Acceptance Criteria (Authoritative)

1.  Users can successfully register with email and password *via Supabase Auth*.
2.  Users receive an email verification link upon registration *from Supabase*.
3.  Users cannot log in until their email is verified *by Supabase Auth*.
4.  Users' accounts are marked as verified *by Supabase Auth* after clicking the verification link.
5.  Users can successfully log in and log out *via Supabase Auth*.
6.  Users can edit their primary fitness goal and core dietary preference via the onboarding flow.
7.  New users are presented with a 5-step guided onboarding process after email verification.
8.  User preferences (fitness goal, dietary, persona) selected during onboarding are securely saved to their profile.
9.  A "diagnostic" first-week personalized workout plan is generated by AI during onboarding completion.
10. A "diagnostic" first-week personalized meal plan is generated by AI during onboarding completion.
11. The generated 7-day personalized workout and meal plans are displayed on the user's dashboard upon onboarding completion.
12. The generated plan details are stored in the database.
13. The FastAPI backend is set up and running.
14. A Supabase project is connected and configured for the backend.
15. Alembic migrations are configured for database schema management in the backend.
16. The Next.js frontend is set up with TypeScript and Tailwind CSS.
17. A Vercel CI/CD pipeline is connected for automated frontend deployments.
18. A basic API call from the frontend to the backend is successful.

## Traceability Mapping

| AC # | Spec Section(s)                                   | Component(s)/API(s)                                                                    | Test Idea                                                                     |
| :--- | :------------------------------------------------ | :------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| 1-4  | FR-001, Story 1.3 (User Reg & Email Verification) | Supabase Auth (registration, email verification), `frontend/src/app/(auth)/`         | E2E: Register, check email, verify, login; Integration: Supabase Auth flows   |
| 5    | FR-001, Story 1.3 (User Reg & Email Verification) | Supabase Auth (login, logout), `frontend/src/app/(auth)/`                            | E2E: Login/logout flow                                                        |
| 6-8  | FR-001, Story 1.4 (Guided Onboarding Flow)        | `backend/app/api/v1/users` (profile update), Supabase Auth (session), `frontend/src/app/(auth)/` | E2E: Complete onboarding, verify saved prefs; Unit: `users.py` update logic   |
| 9-10 | FR-002, FR-003, Story 1.5 (Initial AI Plan Gen)   | `backend/app/services/ai_plan_generator.py`, OpenAI GPT-4, `/api/v1/plans/generate`    | Integration: Plan generation API call; Unit: `ai_plan_generator` logic        |
| 11-12 | FR-006, Story 1.5 (Initial AI Plan Gen & Display) | `backend/app/api/v1/endpoints/plans.py` (get current), `frontend/src/app/(dashboard)/dashboard/` | E2E: Verify dashboard plan display; Unit: Plan retrieval API                   |
| 13-15 | Story 1.1 (Core Backend Setup)                    | FastAPI app, Supabase integration, Alembic                                             | Unit/Integration: Backend setup scripts, DB connection, migration tests       |
| 16-18 | Story 1.2 (Core Frontend Setup)                   | Next.js app, Tailwind CSS, Vercel CI/CD, Frontend-Backend API call                     | Unit/Integration: Frontend build, deployment, basic API call success          |

## Risks, Assumptions, Open Questions

**Risks:**
*   **Risk R-001 (Business):** AI plan generation fails or produces nonsensical plans.
    *   **Mitigation:** Implement strict schema validation on AI output, have a fallback to a default plan, and implement robust error handling and logging.
*   **Risk R-002 (Security):** User registration is insecure, allowing for account takeover.
    *   **Mitigation:** Enforce email verification, use Supabase's built-in security features, test for common vulnerabilities (e.g., insecure password reset).
*   **Risk R-003 (Business):** Onboarding flow is confusing or buggy, leading to high user drop-off.
    *   **Mitigation:** E2E testing of the full onboarding flow, component testing for each step.
*   **Risk R-004 (Operations):** Backend/Frontend setup is misconfigured, causing deployment or integration issues.
    *   **Mitigation:** Implement CI/CD pipeline early, have a simple "hello world" API call to verify connection.
*   **Risk R-005 (Security):** Sensitive user preferences (dietary, goals) are not stored securely.
    *   **Mitigation:** Implement and test Supabase Row Level Security policies to ensure users can only access their own data.

**Assumptions:**
*   The `epics.md` document accurately reflects the scope of Epic 1.
*   The core technology stack (Next.js, FastAPI, Supabase) is stable and suitable for the project.

## Test Strategy Summary

The test strategy for Epic 1 focuses on ensuring the stability of the core user journey and the security of user data.

**Test Levels and Frameworks:**
*   **Backend (FastAPI):** Unit and integration tests will be developed using `Pytest`.
*   **Frontend (Next.js):** Component and integration tests will be developed using `React Testing Library` and `Jest`.
*   **End-to-End (E2E):** `Playwright` will be used for critical end-to-end user flows.

**Key Coverage Areas:**
*   **P0 (Critical - every commit):** Ensures user registration, email verification, and initial AI plan generation function correctly and securely.
*   **P1 (High - PR to main):** Covers the completion of the onboarding flow, successful backend/frontend integration, and secure saving of user preferences.
*   **P2 (Medium - nightly/weekly):** Focuses on the correct rendering and functionality of individual UI components within the onboarding process.

**Estimated Effort:**
*   The estimated test development effort for Epic 1 is approximately 32 hours (~4 days).

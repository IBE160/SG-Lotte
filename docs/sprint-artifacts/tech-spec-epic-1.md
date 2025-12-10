# Epic Technical Specification: {{epic_title}}

Date: 2025-12-10
Author: BIP
Epic ID: 1
Status: Draft

---

## Overview

This technical specification outlines the core foundational work for Epic 1 of the AI Fitness & Meal Planner. This epic focuses on enabling new users to sign up, define their core goals, and receive their initial personalized workout and meal plan. The "magic" lies in the AI-driven personalization and dynamic adaptation of these plans, ensuring an engaging and consistent health journey from the outset.

## Objectives and Scope

The primary objective of Epic 1 is to establish the essential infrastructure and core user journey to allow immediate user engagement.

### In-Scope (MVP - Minimum Viable Product):
*   **Core User Profile:** Simplified sign-up with essential data: fitness goals, dietary preferences.
*   **AI Workout Planner:** Generates weekly workout routines.
*   **AI Meal Planner:** Generates weekly meal plans.
*   **Weekly Replanning:** Core logic to adjust plans for the next week based on completion.
*   **Basic Progress Logging:** Simple logging of completed workouts and meals (e.g., checkboxes).
*   **Core Dashboard:** Displays the current week's plan only.
*   **Structured AI Output (JSON):** (Technical requirement, not a user-facing feature).

### Out-of-Scope (Growth Features & Vision - Deferred for future phases):
*   Enhanced User Profile (detailed body metrics, allergies).
*   Advanced Progress Tracking (sets, reps, weights, calories, historical charts).
*   Full Dashboard Overview (history, trends).
*   Basic Offline Support.
*   Interactive Chat Assistant.
*   Gamification, Calendar Integration.
*   Conversational AI Coach, Wearable & App Integration, Social Features, Advanced Analytics.

## System Architecture Alignment

The architecture for Epic 1 is based on a modern, scalable, and decoupled frontend-backend system. The Frontend (Next.js 14+ with TypeScript, Tailwind CSS) integrates with the FastAPI (Python) Backend, which handles logic, AI plan generation (using Pydantic AI framework with Gemini 2.5 flash), and interacts with Supabase for data persistence and user authentication. This foundation ensures a clear separation of concerns, supporting efficient development and deployment for the core user flows of registration, onboarding, and initial plan generation.

The project context, as established in the Architecture document, highlights the explicit definition of the technology stack and the focus on AI-driven personalization as the central value. This epic aligns directly with setting up this foundational stack.

## Detailed Design

### Services and Modules

*   **Backend:**
    *   `app/api/v1/endpoints/users.py`: Handles user registration, authentication (via Supabase), and profile management (storing onboarding preferences).
    *   `app/services/ai_plan_generator.py`: Orchestrates the initial AI plan generation using the Pydantic AI framework with Gemini 2.5 flash, based on user preferences.
*   **Frontend:**
    *   `src/app/(auth)/`: Contains the UI components and logic for user registration, login, and email verification.
    *   `src/app/(dashboard)/dashboard/`: Provides the main dashboard view, responsible for displaying the generated workout and meal plans.

### Data Models and Contracts

*   **`users` table (Supabase):** Stores user authentication details (managed by Supabase Auth), along with core profile information and onboarding preferences (fitness goals, dietary preferences, fitness persona).
*   **`workout_plans` table (Supabase):** Stores the AI-generated weekly workout plans, linked to `user_id`.
*   **`meal_plans` table (Supabase):** Stores the AI-generated weekly meal plans, linked to `user_id`.

### APIs and Interfaces

*   **`/api/v1/users/` (POST):** User registration endpoint. Accepts email and password. Returns JWT token on success after email verification.
*   **`/api/v1/users/profile/` (PUT):** Updates user profile information, including onboarding preferences.
*   **`/api/v1/plans/generate/` (POST):** Triggers the initial AI plan generation based on user preferences. Returns the generated 7-day workout and meal plans.

### Workflows and Sequencing

1.  **User Registration (Story 1.3):**
    *   User navigates to frontend signup page (`src/app/(auth)`).
    *   Enters email and password.
    *   Frontend calls `/api/v1/users/` (POST).
    *   Backend (Supabase Auth) creates user and sends verification email.
    *   User clicks verification link (Supabase handles verification).
2.  **Guided Onboarding (Story 1.4):**
    *   Upon verified login, user is redirected to onboarding flow (`src/app/(auth)`).
    *   User provides fitness goal, dietary preferences, and fitness persona across 5 steps.
    *   Frontend calls `/api/v1/users/profile/` (PUT) to save preferences.
3.  **Initial AI Plan Generation & Display (Story 1.5):**
    *   After onboarding completion, frontend calls `/api/v1/plans/generate/` (POST).
    *   Backend (`ai_plan_generator.py`) uses user preferences to prompt Gemini 2.5 flash.
    *   AI generates 7-day workout and meal plans.
    *   Backend saves plans to `workout_plans` and `meal_plans` tables.
    *   Backend returns generated plan to frontend.
    *   Frontend (`src/app/(dashboard)/dashboard/`) displays the plan.

## Non-Functional Requirements

### Performance

*   **Measurable Targets (PRD):**
    *   Response time for non-AI queries shall be less than 500ms.
    *   The system shall support at least 100 concurrent active users without degradation in performance.
*   **Architecture Considerations:**
    *   **Caching (ADR-002):** Multi-layered caching using Backend (in-memory) and Frontend (SWR/React Query) to reduce redundant data fetching.
    *   **Code Splitting:** Next.js automatically handles code splitting for fast initial page loads.
    *   **CDN:** Vercel's CDN for serving frontend assets.

### Security

*   **Authentication (PRD & Architecture):** Handled by Supabase Auth using JWT tokens for secure sessions.
*   **Authorization (PRD & Architecture):** Supabase's Row Level Security (RLS) enabled to ensure users only access their own data.
*   **Data Security (PRD & Architecture):** All data encrypted in transit (HTTPS/SSL) and at rest (managed by Supabase). GDPR compliance for data privacy.
*   **API Security (Architecture):** Backend API endpoints protected, requiring valid JWT from authenticated users.

### Reliability/Availability

*   **AI Integration (PRD):**
    *   Implement retry mechanisms with exponential backoff for OpenAI API calls.
    *   Utilize caching for OpenAI API responses to reduce latency and dependency.
    *   Implement fallback mechanisms (e.g., default plan templates) in case of OpenAI API unavailability or errors during plan generation.

### Observability

*   **Logging (Architecture):** Structured logging will be implemented, with logs in JSON format (timestamp, log level, message) output to console (stdout/stderr) for compatibility with Vercel's logging infrastructure.

## Dependencies and Integrations

The project's technology stack defines the primary dependencies and integration points. As the project structure is not yet fully implemented, these are the *expected* dependencies based on the architecture:

### Frontend Dependencies:
*   **Framework:** Next.js v16.0.5 (with React)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Charting:** Recharts
*   **Supabase Client:** `@supabase/supabase-js` v2.86.0
*   **State Management:** Zustand
*   **Data Fetching/Caching:** SWR/React Query

### Backend Dependencies:
*   **Framework:** FastAPI v0.122.0
*   **Language:** Python 3.14
*   **AI Framework:** Pydantic AI framework
*   **AI Model:** Gemini 2.5 flash

### Integration Points:
*   **Frontend to Backend:** REST API (`/api/v1/`)
*   **Frontend to Supabase:** Direct interaction via `supabase-js` for authentication and real-time data.
*   **Backend to Supabase:** PostgreSQL database connection.
*   **Backend to AI Service:** Integration with Pydantic AI framework using Gemini 2.5 flash for plan generation.

## Acceptance Criteria (Authoritative)

The following acceptance criteria are derived from the Epic 1 stories in `epics.md`:

### Story 1.1: Core Backend Setup
1.  **Given** the project is initialized **When** I set up the backend **Then** a FastAPI app is created and running.
2.  **Given** the project is initialized **When** I set up the backend **Then** a Supabase project is connected and configured.
3.  **Given** the project is initialized **When** I set up the backend **Then** Alembic migrations are configured for database schema management.

### Story 1.2: Core Frontend Setup
1.  **Given** the project is initialized **When** I set up the frontend **Then** a Next.js app is created with TypeScript and Tailwind CSS.
2.  **Given** the project is initialized **When** I set up the frontend **Then** a Vercel CI/CD pipeline is connected for automated deployments.
3.  **Given** the project is initialized **When** I set up the frontend **Then** a basic API call from the frontend to the backend is successful.

### Story 1.3: User Registration & Email Verification
1.  **Given** I am on the signup page **When** I enter valid email/password and submit **Then** my account is created in Supabase.
2.  **Given** I am on the signup page **When** I enter valid email/password and submit **Then** a verification email is sent to my provided email address.
3.  **Given** I am on the signup page **When** I enter valid email/password and submit **Then** I cannot log in until my email is verified.
4.  **When** I click the verification link in my email **Then** my account is marked as verified.

### Story 1.4: Guided Onboarding Flow
1.  **Given** I have verified my email **When** I start the onboarding **Then** I am presented with a sequence of 5 UI screens.
2.  **Given** I have verified my email **When** I start the onboarding **Then** I can select my primary fitness goal, dietary preferences, and fitness persona.
3.  **Given** I have verified my email **When** I start the onboarding **Then** all my preferences are securely saved to my user profile.

### Story 1.5: Initial AI Plan Generation & Display
1.  **Given** I have completed the onboarding flow **When** my dashboard loads **Then** a 7-day personalized workout and meal plan is generated by the AI (Pydantic AI framework with Gemini 2.5 flash).
2.  **Given** I have completed the onboarding flow **When** my dashboard loads **Then** the generated plan is displayed on the dashboard.
3.  **Given** I have completed the onboarding flow **When** my dashboard loads **Then** the plan details are stored in the database.

## Traceability Mapping

| AC ID | Spec Section(s)                                | Component(s)/API(s)                                          | Test Idea                                                 |
| :---- | :--------------------------------------------- | :----------------------------------------------------------- | :-------------------------------------------------------- |
| 1.1.1 | `epics.md` (S1.1)                             | Backend (FastAPI app)                                        | Unit/Integration Test: FastAPI app starts and responds.   |
| 1.1.2 | `epics.md` (S1.1)                             | Backend (Supabase connection)                                | Integration Test: Supabase client connects successfully.  |
| 1.1.3 | `epics.md` (S1.1)                             | Backend (Alembic)                                            | Integration Test: Alembic migrations can be run.          |
| 1.2.1 | `epics.md` (S1.2), Architecture (FE Init)     | Frontend (Next.js app)                                       | Smoke Test: Next.js app builds and runs.                  |
| 1.2.2 | `epics.md` (S1.2), Architecture (Deployment)  | Vercel CI/CD                                                 | CI/CD Test: Deployment triggered by Git push.             |
| 1.2.3 | `epics.md` (S1.2)                             | Frontend (API client), Backend (FastAPI app)                 | Integration Test: Simple FE-BE API call succeeds.         |
| 1.3.1 | `epics.md` (S1.3), Backend (users.py)         | Supabase Auth, Backend `/api/v1/users/`                      | E2E Test: New user signup creates account.                |
| 1.3.2 | `epics.md` (S1.3), Backend (users.py)         | Supabase Auth                                                | E2E Test: Verification email is sent.                     |
| 1.3.3 | `epics.md` (S1.3)                             | Supabase Auth                                                | E2E Test: Login blocked before email verification.        |
| 1.3.4 | `epics.md` (S1.3)                             | Supabase Auth                                                | E2E Test: Clicking verification link verifies account.    |
| 1.4.1 | `epics.md` (S1.4), Frontend (src/app/(auth))  | Frontend UI components                                       | E2E Test: 5 onboarding screens are presented.             |
| 1.4.2 | `epics.md` (S1.4), Frontend (src/app/(auth))  | Frontend UI components                                       | E2E Test: User can select preferences.                    |
| 1.4.3 | `epics.md` (S1.4), Backend (users.py)         | Backend `/api/v1/users/profile/`, Supabase `users` table     | Integration Test: Preferences saved to user profile.      |
| 1.5.1 | `epics.md` (S1.5), Backend (ai_plan_generator.py) | Backend `/api/v1/plans/generate/`, Gemini 2.5 flash, Pydantic AI   | Integration Test: AI generates plan after onboarding.     |
| 1.5.2 | `epics.md` (S1.5), Frontend (src/app/(dashboard)) | Frontend UI (Dashboard)                                      | E2E Test: Generated plan displayed on dashboard.          |
| 1.5.3 | `epics.md` (S1.5), Backend (ai_plan_generator.py) | Supabase `workout_plans`, `meal_plans` tables                | Integration Test: Plan details stored in database.        |

## Risks, Assumptions, Open Questions

*   **Risk (Critical):** This epic lays the foundation for the entire application. Any failure in the core infrastructure, user registration, or initial plan generation will prevent any user from successfully using the product.
    *   **Mitigation:** Heavily weighted integration and E2E tests, robust security testing on authentication, and thorough infrastructure/deployment testing.
*   **Assumption:** The AI framework (Pydantic AI with Gemini 2.5 flash) will reliably generate valid and structured plan data suitable for direct integration.
*   **Question:** Are there specific error handling requirements for AI service outages beyond a user-friendly message and retry?

## Test Strategy Summary

The test strategy for Epic 1 is heavily weighted towards integration and E2E tests to ensure core functionality and interconnected pieces work cohesively.

*   **Testing Pyramid:** Unit Tests (40% - backend logic, frontend state), Integration Tests (40% - FE-BE API, BE-Supabase, AI integration), E2E Tests (20% - full new user journey: signup, verify, onboard, view plan).
*   **Focus Areas:** Security of authentication flow, reliability of first-time user experience, stability of core technical stack.
*   **Tools & Frameworks:** Jest & React Testing Library (FE Unit/Integration), Pytest (BE Unit/Integration), Playwright (E2E), Pact (API Contract Testing).
*   **Exit Criteria:**
    1.  Full E2E "golden path" test passes consistently in CI.
    2.  All integration points have passing contract/integration tests.
    3.  Unit test coverage for new backend logic >= 85%.
    4.  Vercel deployment pipeline is green, with passing post-deployment smoke tests.
    5.  No Critical/High priority bugs related to authentication, data persistence, or core user flow.

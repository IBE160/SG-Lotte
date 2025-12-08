# Epic Technical Specification: First Plan & Foundation

Date: mandag 8. desember 2025
Author: BIP
Epic ID: 1
Status: Draft

---

## Overview

Epic 1: First Plan & Foundation focuses on establishing the essential infrastructure and initial user journey for the AI Fitness & Meal Planner. This involves setting up the core technical stack (Next.js, FastAPI, Supabase), enabling user registration and a guided onboarding process, and generating the user's first personalized workout and meal plan. This foundational epic is critical for allowing new users to quickly engage with the application and begin their health journey, directly addressing the PRD's goal of an AI-assisted web application that generates and adjusts personalized plans.

## Objectives and Scope

**Objectives:**
*   To establish the core technical infrastructure using Next.js, FastAPI, and Supabase.
*   To implement secure user registration and email verification.
*   To guide new users through a 5-step onboarding process to gather initial preferences.
*   To generate and display a user's first personalized "diagnostic" workout and meal plan.

**In-Scope:**
*   Core Backend Setup (FastAPI, Supabase, Alembic).
*   Core Frontend Setup (Next.js, TypeScript, Tailwind CSS, Vercel CI/CD).
*   User Registration, Login, and Email Verification using Supabase Auth.
*   5-step guided onboarding UI (onboarding1_dark.html to onboarding5_dark.html) for collecting fitness goals and dietary preferences.
*   Initial AI-driven workout and meal plan generation (Pydantic AI framework with Gemini 2.5).
*   Display of the current day's plan on a basic dashboard (dashboard_dark.html).
*   Storage of user preferences and generated plans in Supabase.

**Out-of-Scope (for Epic 1):**
*   Adaptive weekly plan generation based on logged progress.
*   Detailed workout and meal logging beyond simple display.
*   Advanced dashboard visualizations, historical progress, or tracking.
*   User profile management beyond initial preferences.
*   Application settings or account management (e.g., password change, account deletion).
*   In-app notifications for new plans.

## System Architecture Alignment

Epic 1 aligns directly with the established decoupled frontend (Next.js) and backend (FastAPI) architecture, leveraging Supabase for database and authentication services. The core backend setup (Story 1.1) establishes the FastAPI application, while the frontend setup (Story 1.2) initiates the Next.js project, both consistent with the project's foundational technical decisions. User registration (Story 1.3) integrates with Supabase Auth, and the onboarding flow (Story 1.4) utilizes frontend components interacting with backend API endpoints for preference storage. Initial plan generation (Story 1.5) relies on the `ai_plan_generator.py` service within the FastAPI backend. This epic sets up the project structure and primary communication flows between these architectural components as detailed in the `architecture-2025-11-30.md`.

## Detailed Design

### Services and Modules

*   **FastAPI Backend (`backend/app/main.py`):**
    *   **Responsibility:** Serves API endpoints, handles business logic, interacts with Supabase, orchestrates AI plan generation.
    *   **Inputs:** HTTP requests from the frontend.
    *   **Outputs:** JSON responses to the frontend, data to Supabase.
    *   **Owner:** Backend Development Team.
*   **Supabase:**
    *   **Responsibility:** Provides PostgreSQL database, user authentication (Supabase Auth), and Row Level Security (RLS).
    *   **Inputs:** Data from FastAPI backend and direct frontend interactions (for Auth).
    *   **Outputs:** Data to FastAPI backend and frontend.
    *   **Owner:** Managed Service.
*   **Next.js Frontend (`frontend/src/app/`):**
    *   **Responsibility:** Provides User Interface, handles user interactions, communicates with FastAPI and Supabase.
    *   **Inputs:** User input via UI, data from FastAPI and Supabase.
    *   **Outputs:** HTTP requests to backend, rendered UI.
    *   **Owner:** Frontend Development Team.
*   **AI Plan Generator Service (`backend/app/services/ai_plan_generator.py`):**
    *   **Responsibility:** Orchestrates calls to the Pydantic AI framework with Gemini 2.5 to generate personalized workout and meal plans based on user preferences.
    *   **Inputs:** User preferences (goals, dietary, persona).
    *   **Outputs:** Structured workout and meal plan data.
    *   **Owner:** Backend/AI Development Team.

### Data Models and Contracts

*   **User Profile Data (Supabase `users` table):**
    *   `id`: UUID (Primary Key, from Supabase Auth)
    *   `email`: Text (Unique, from Supabase Auth)
    *   `fitness_goal`: Enum (e.g., 'lose_weight', 'gain_muscle', 'maintain')
    *   `dietary_preferences`: JSONB (e.g., {'vegetarian': true, 'allergies': ['nuts']})
    *   `fitness_persona`: Text (e.g., 'beginner', 'intermediate', 'advanced')
    *   `created_at`: Timestamp (UTC)
    *   `updated_at`: Timestamp (UTC)
*   **Workout Plans (Supabase `workout_plans` table):**
    *   `id`: UUID (Primary Key)
    *   `user_id`: UUID (Foreign Key to `users.id`)
    *   `plan_start_date`: Date
    *   `plan_end_date`: Date
    *   `plan_data`: JSONB (Structured AI-generated workout plan details)
    *   `created_at`: Timestamp (UTC)
*   **Meal Plans (Supabase `meal_plans` table):**
    *   `id`: UUID (Primary Key)
    *   `user_id`: UUID (Foreign Key to `users.id`)
    *   `plan_start_date`: Date
    *   `plan_end_date`: Date
    *   `plan_data`: JSONB (Structured AI-generated meal plan details)
    *   `created_at`: Timestamp (UTC)

### APIs and Interfaces

*   **User Authentication (Supabase Auth - direct Frontend interaction):**
    *   `POST /auth/v1/signup`: User registration.
    *   `POST /auth/v1/verify`: Email verification.
    *   `POST /auth/v1/login`: User login.
*   **User Profile Management (FastAPI Backend):**
    *   `PUT /api/v1/users/profile`: Updates user preferences collected during onboarding.
        *   **Request:** `{"fitness_goal": "...", "dietary_preferences": {}, "fitness_persona": "..."}`
        *   **Response:** `{"message": "Profile updated successfully"}`
*   **Plan Generation and Retrieval (FastAPI Backend):**
    *   `POST /api/v1/plans/generate`: Triggers initial plan generation based on user preferences.
        *   **Request:** `{}` (user ID from JWT)
        *   **Response:** `{"message": "Plan generation initiated", "plan_id": "..."}`
    *   `GET /api/v1/plans/current`: Retrieves the current week's workout and meal plan.
        *   **Request:** `{}` (user ID from JWT)
        *   **Response:** `{"workout_plan": {...}, "meal_plan": {...}}`

### Workflows and Sequencing

*   **User Registration & Onboarding Flow:**
    1.  User accesses the signup page (Frontend: `onboarding1_dark.html`).
    2.  User enters email and password, submits form.
    3.  Frontend calls Supabase Auth `signup` API.
    4.  Supabase creates user and sends verification email.
    5.  User clicks verification link in email.
    6.  Supabase marks user as verified.
    7.  User logs in (Frontend).
    8.  Frontend checks verification status, if verified, redirects to onboarding flow.
    9.  User completes 5 onboarding steps (Frontend: `onboarding1_dark.html` to `onboarding5_dark.html`), providing preferences.
    10. After each step, Frontend calls FastAPI `PUT /api/v1/users/profile` to update user preferences in Supabase.

*   **Initial Plan Generation & Display Flow:**
    1.  Upon completing onboarding, Frontend calls FastAPI `POST /api/v1/plans/generate`.
    2.  FastAPI triggers `ai_plan_generator.py` to interact with Gemini 2.5, using user preferences from Supabase.
    3.  Gemini 2.5 returns structured workout and meal plan.
    4.  FastAPI stores the generated plans in Supabase (`workout_plans`, `meal_plans` tables).
    5.  FastAPI responds to Frontend with confirmation.
    6.  Frontend redirects to dashboard (Frontend: `dashboard_dark.html`).
    7.  Dashboard loads, calls FastAPI `GET /api/v1/plans/current`.
    8.  FastAPI retrieves current week's plans from Supabase.
    9.  FastAPI returns plans to Frontend.
    10. Frontend displays the personalized workout and meal plans.

## Non-Functional Requirements

### Performance

*   **API Response Time:** Response time for non-AI queries shall be less than 500ms (from PRD).
*   **Concurrent Users:** The system shall support at least 100 concurrent active users without degradation in performance (from PRD).
*   **Initial Load:** Next.js code splitting and Vercel CDN will ensure fast initial page loads for the frontend.
*   **Caching:** Frontend (SWR/React Query) and Backend (in-memory caching for common database queries) will be implemented to optimize data retrieval. (ADR-002)

### Security

*   **Data Encryption:** All data in transit (HTTPS/SSL) and at rest (database encryption managed by Supabase) shall be encrypted (from PRD, Architecture).
*   **Authentication:** User authentication handled by Supabase Auth using JWT tokens (from PRD, Architecture).
*   **Authorization:** Access to user data shall be restricted by Row Level Security (RLS) policies in Supabase (from PRD, Architecture).
*   **API Security:** Backend API endpoints will be protected and require a valid JWT from an authenticated user (from Architecture).
*   **Compliance:** The system shall comply with GDPR principles for data privacy and retention (from PRD).

### Reliability/Availability

*   **AI Integration:** The system shall implement retry mechanisms with exponential backoff for AI API calls (from PRD, Architecture).
*   **Fallback:** The system shall have fallback mechanisms (e.g., default plan templates) in case of AI API unavailability (from PRD, Architecture).
*   **Scalability:** The FastAPI backend shall be deployable in a horizontally scalable manner, and the Supabase PostgreSQL database shall be capable of scaling to handle increased data volume and user load (from PRD).

### Observability

*   **Logging:** Structured logging will be implemented. Logs will be in JSON format, containing a timestamp, log level (INFO, WARNING, ERROR), and a message. For the MVP, logs will be output to the console (`stdout`/`stderr`), compatible with Vercel's logging infrastructure. (from Architecture)

## Dependencies and Integrations

*   **Frontend (Next.js):**
    *   `Next.js` (v16.0.5+) - Framework
    *   `React` - UI Library
    *   `TypeScript` - Language
    *   `Tailwind CSS` - Styling
    *   `ESLint` - Linting
    *   `@supabase/supabase-js` (v2.86.0) - Supabase client library for authentication and data interaction.
    *   `Zustand` - Client-side state management.
    *   `SWR` or `React Query` - Server-side state management (data fetching).
*   **Backend (FastAPI):**
    *   `FastAPI` (v0.122.0) - Web framework
    *   `Python` (3.14+) - Language
    *   `uvicorn` - ASGI server
    *   `Pydantic AI framework` with `Gemini 2.5` - AI integration for plan generation.
    *   `Alembic` - Database migrations.
    *   `PostgreSQL` driver (e.g., `psycopg2` or `asyncpg`) - Database connectivity.
    *   `fastapi-cache2` (or similar) - Backend caching.
*   **Database:**
    *   `Supabase` (managed PostgreSQL) - Primary database and authentication provider.
*   **Deployment:**
    *   `Vercel` - Hosting for both frontend and backend. CI/CD pipeline integration.
    *   `Vercel Cron Jobs` - For triggering background tasks (e.g., plan generation, though specific to Epic 2, the infrastructure is a dependency).

## Acceptance Criteria (Authoritative)

**Story 1.1: Core Backend Setup**
1.  **Given** the project is initialized, **When** I set up the backend, **Then** a FastAPI app is created and running.
2.  **Given** the project is initialized, **When** I set up the backend, **Then** a Supabase project is connected and configured.
3.  **Given** the project is initialized, **When** I set up the backend, **Then** Alembic migrations are configured for database schema management.

**Story 1.2: Core Frontend Setup**
4.  **Given** the project is initialized, **When** I set up the frontend, **Then** a Next.js app is created with TypeScript and Tailwind CSS.
5.  **Given** the project is initialized, **When** I set up the frontend, **Then** a Vercel CI/CD pipeline is connected for automated deployments.
6.  **Given** the project is initialized, **When** I set up the frontend, **Then** a basic API call from the frontend to the backend is successful.

**Story 1.3: User Registration & Email Verification**
7.  **Given** I am on the signup page, **When** I enter valid email/password and submit, **Then** my account is created in Supabase.
8.  **Given** I am on the signup page, **When** I enter valid email/password and submit, **Then** a verification email is sent to my provided email address.
9.  **Given** I am on the signup page, **When** I enter valid email/password and submit, **Then** I cannot log in until my email is verified.
10. **When** I click the verification link in my email, **Then** my account is marked as verified.

**Story 1.4: Guided Onboarding Flow**
11. **Given** I have verified my email, **When** I start the onboarding, **Then** I am presented with a sequence of 5 UI screens (`onboarding1_dark.html` to `onboarding5_dark.html`).
12. **Given** I have verified my email, **When** I start the onboarding, **Then** I can select my primary fitness goal, dietary preferences, and fitness persona.
13. **Given** I have verified my email, **When** I start the onboarding, **Then** all my preferences are securely saved to my user profile.

**Story 1.5: Initial AI Plan Generation & Display**
14. **Given** I have completed the onboarding flow, **When** my dashboard loads, **Then** a 7-day personalized workout and meal plan is generated by the AI (Pydantic AI framework with Gemini 2.5).
15. **Given** I have completed the onboarding flow, **When** my dashboard loads, **Then** the generated plan is displayed on the dashboard, similar to `dashboard_dark.html` (showing today's plan).
16. **Given** I have completed the onboarding flow, **When** my dashboard loads, **Then** the plan details are stored in the database.

## Traceability Mapping

| AC ID | Spec Section(s) | Component(s)/API(s) | Test Idea |
| :---- | :-------------- | :------------------ | :-------- |
| 1     | Story 1.1 | Backend (FastAPI) | Verify FastAPI app runs locally. |
| 2     | Story 1.1 | Supabase | Check Supabase connection in backend. |
| 3     | Story 1.1 | Alembic | Run a sample Alembic migration. |
| 4     | Story 1.2 | Frontend (Next.js) | Verify Next.js app builds and runs. |
| 5     | Story 1.2 | Vercel CI/CD | Push to main branch, observe Vercel deployment. |
| 6     | Story 1.2 | Frontend, Backend API | Make a test API call from frontend to backend. |
| 7     | Story 1.3 | Supabase Auth, `POST /auth/v1/signup` | Register new user, verify user record in Supabase. |
| 8     | Story 1.3 | Supabase Auth, Email Service | Check email inbox for verification link. |
| 9     | Story 1.3 | Supabase Auth, Login UI | Attempt login with unverified email. |
| 10    | Story 1.3 | Supabase Auth, Email Verification | Click verification link, then attempt login. |
| 11    | Story 1.4 | Frontend UI (onboarding) | Navigate through 5 onboarding screens. |
| 12    | Story 1.4 | Frontend UI (onboarding) | Select different options for preferences. |
| 13    | Story 1.4 | `PUT /api/v1/users/profile`, Supabase `users` table | Submit preferences, check Supabase user record. |
| 14    | Story 1.5 | `POST /api/v1/plans/generate`, AI Plan Generator | Complete onboarding, verify plan generation via API. |
| 15    | Story 1.5 | Frontend UI (dashboard), `GET /api/v1/plans/current` | Load dashboard after onboarding, observe displayed plan. |
| 16    | Story 1.5 | Supabase `workout_plans`, `meal_plans` tables | Verify generated plan details are stored in DB. |

## Risks, Assumptions, Open Questions

*   **Risk:** AI model (Gemini 2.5) response times or rate limits could impact initial plan generation performance, affecting user experience during onboarding.
    *   **Mitigation:** Implement client-side loading indicators and backend retry mechanisms. Explore asynchronous generation and notification if initial generation becomes a bottleneck.
*   **Risk:** Complexity of Supabase RLS policies for multi-tenant data access (each user only sees their data) could lead to security vulnerabilities if not implemented carefully.
    *   **Mitigation:** Thorough testing of RLS policies, peer review, and adherence to Supabase best practices.
*   **Risk:** Ensuring secure handling of user credentials and sensitive preferences during registration and onboarding.
    *   **Mitigation:** Rely heavily on Supabase Auth's built-in security features and follow standard secure coding practices for API endpoints.
*   **Assumption:** The `onboardingX_dark.html` files provide sufficient design guidance for the frontend onboarding flow and do not require extensive additional UX design effort for this epic.
*   **Assumption:** The Pydantic AI framework with Gemini 2.5 is capable of generating sufficiently diverse and personalized plans based on the input preferences gathered in the onboarding.
*   **Open Question:** What is the exact structure of the "structured AI-generated workout plan details" and "structured AI-generated meal plan details" JSON objects? This needs to be defined for the `plan_data` field in the database.

## Test Strategy Summary

The testing strategy for Epic 1 will focus on ensuring the foundational components are robust and the core user journey works seamlessly.

*   **Unit Tests:**
    *   **Backend:** `Pytest` will be used for unit testing individual FastAPI endpoints, Supabase interactions (mocked), and the AI plan generation logic (mocking Gemini 2.5 responses).
    *   **Frontend:** `React Testing Library` with `Jest` will be used for unit testing individual React components and utility functions.
*   **Integration Tests:**
    *   **Backend-Database:** Tests will verify correct data persistence and retrieval from Supabase for user profiles and generated plans.
    *   **Frontend-Backend API:** Tests will ensure seamless communication between the Next.js frontend and FastAPI backend for user registration, onboarding data submission, and plan retrieval.
    *   **End-to-End (E2E) Tests:** Automated E2E tests (e.g., using `Playwright` or `Cypress` in a future phase) will simulate the entire user registration, onboarding, plan generation, and dashboard display flow to ensure critical paths function correctly.
*   **Acceptance Criteria (AC) Verification:** Each acceptance criterion will be explicitly tested, ensuring traceability from requirement to implemented functionality.
*   **Manual Testing:** Extensive manual testing will be conducted for the UI/UX of the onboarding flow and dashboard display to ensure a smooth and intuitive user experience.
*   **Performance Testing:** Basic load testing may be considered for critical API endpoints if initial performance metrics are not met.

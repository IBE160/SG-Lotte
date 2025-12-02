# Epic Technical Specification: First Plan & Foundation

Date: tirsdag 2. desember 2025
Author: BIP
Epic ID: 1
Status: Draft

---

## Overview

This epic establishes the foundational user journey for the AI Fitness & Meal Planner. It covers the complete initial user experience, from signing up and completing a guided onboarding process to receiving the first AI-generated workout and meal plan. The primary goal is to provide immediate value to new users, allowing them to start their personalized health journey within minutes.

This technical specification details the implementation of the core backend and frontend infrastructure, user authentication, the multi-step onboarding flow for collecting user preferences, and the initial AI-driven "diagnostic" plan generation. It serves as the technical blueprint for delivering the core value proposition of the application.

## Objectives and Scope

### In-Scope

*   **Core Technical Setup:** Establish the initial Next.js frontend, FastAPI backend, and Supabase database projects.
*   **User Registration & Authentication:** Implement user signup with email/password and email verification.
*   **Guided Onboarding:** Create a 5-step UI flow to collect user's primary fitness goal, dietary preferences, and fitness persona.
*   **Initial AI Plan Generation:** Develop the service to generate the first "diagnostic" 7-day workout and meal plan based on onboarding data.
*   **Basic Dashboard Display:** Implement a simple dashboard to display the user's plan for the current day.

### Out-of-Scope

*   **Advanced Progress Logging:** Detailed logging of workout sets/reps or meal macronutrients is not included.
*   **Plan Adaptation:** The AI will not yet adapt plans based on user feedback; this is the focus of Epic 2.
*   **Historical Data Visualization:** The dashboard will not show historical progress or trends.
*   **User Profile Management:** A dedicated user profile or settings page is not part of this epic.
*   **Plan Interruption:** Features to pause or modify the plan due to vacations or illness are excluded.

## System Architecture Alignment

This epic aligns directly with the foundational layers of the defined system architecture. The implementation will involve creating the initial services and components as outlined in the `architecture-2025-11-30.md` document.

*   **Frontend:** The implementation will build out the user-facing components within the Next.js application, specifically the onboarding flow under `src/app/(auth)/` and the initial dashboard display in `src/app/(dashboard)/dashboard/`.
*   **Backend:** The FastAPI backend will see the creation of the initial user management endpoints in `app/api/v1/endpoints/users.py` for handling registration and authentication, and the core AI interaction logic will be encapsulated in the `app/services/ai_plan_generator.py` service.
*   **Database & Auth:** All user data and generated plans will be stored in the Supabase PostgreSQL database, with authentication managed by Supabase Auth, adhering to the security and data architecture principles.

The work in this epic serves to validate the core architectural decisions and establish the primary communication patterns between the frontend, backend, and Supabase services.

## Detailed Design

### Services and Modules

| Service/Module | Responsibility | Inputs | Outputs | Owner |
|---|---|---|---|---|
| **Frontend Onboarding Module** | Guide the user through the 5-step onboarding process to collect preferences. | User interactions and selections on the UI. | A JSON object containing the user's fitness goal, dietary preferences, and fitness persona, sent to the backend. | Frontend Team |
| **Frontend Dashboard Module** | Display the user's workout and meal plan for the current day. | The user's personalized plan data fetched from the backend API. | A rendered view of the daily plan, consistent with `dashboard_dark.html`. | Frontend Team |
| **Backend User Service** | Manage user registration, email verification, and authentication. | User email and password from the frontend registration form. | A new user record in the Supabase `users` table and a verification email sent to the user. | Backend Team |
| **Backend AI Plan Generator Service** | Generate the initial 7-day "diagnostic" workout and meal plan using the OpenAI API. | The user's preference data collected during onboarding. | A structured JSON object representing the 7-day plan, which is then stored in the database. | Backend Team |

### Data Models and Contracts

For Epic 1, the following core data models will be established in the Supabase database. These models are designed to be normalized and scalable.

### `users`
Stores core user profile and preference information.

*   `id` (uuid, primary key): Unique identifier for the user, provided by Supabase Auth.
*   `email` (varchar, unique): The user's email address.
*   `created_at` (timestamp with time zone): Timestamp of when the user record was created.
*   `fitness_goal` (varchar): The primary fitness goal selected during onboarding (e.g., "lose_weight", "build_muscle").
*   `dietary_preference` (varchar): The dietary preference selected during onboarding (e.g., "none", "vegetarian", "vegan").
*   `fitness_persona` (varchar): The fitness persona selected during onboarding (e.g., "beginner", "intermediate").

### `workout_plans`
Stores the generated weekly workout plans for each user.

*   `id` (uuid, primary key): Unique identifier for the workout plan.
*   `user_id` (uuid, foreign key to `users.id`): Associates the plan with a user.
*   `plan_data` (jsonb): A JSON object containing the full 7-day workout plan, including exercises, sets, reps, etc.
*   `start_date` (date): The start date of the plan week.
*   `end_date` (date): The end date of the plan week.
*   `created_at` (timestamp with time zone): Timestamp of when the plan was generated.

### `meal_plans`
Stores the generated weekly meal plans for each user.

*   `id` (uuid, primary key): Unique identifier for the meal plan.
*   `user_id` (uuid, foreign key to `users.id`): Associates the plan with a user.
*   `plan_data` (jsonb): A JSON object containing the full 7-day meal plan, including recipes and nutritional information.
*   `start_date` (date): The start date of the plan week.
*   `end_date` (date): The end date of the plan week.
*   `created_at` (timestamp with time zone): Timestamp of when the plan was generated.

### APIs and Interfaces

The FastAPI backend will expose the following RESTful API endpoints to support the functionality of Epic 1. All endpoints are under the `/api/v1` prefix and require a valid JWT for authenticated routes.

### User Management

*   **`POST /users/register`**
    *   **Description:** Handles new user registration.
    *   **Request Body:** `{ "email": "user@example.com", "password": "securepassword123" }`
    *   **Response (200 OK):** `{ "message": "Verification email sent" }`
    *   **Notes:** This endpoint will create a new user in Supabase Auth and trigger the verification email.

*   **`POST /users/preferences`**
    *   **Description:** Saves the user's preferences from the onboarding flow.
    *   **Authentication:** Required.
    *   **Request Body:** `{ "fitness_goal": "build_muscle", "dietary_preference": "vegetarian", "fitness_persona": "intermediate" }`
    *   **Response (200 OK):** `{ "message": "Preferences saved successfully" }`

### Plan Management

*   **`POST /plans/generate-initial`**
    *   **Description:** Triggers the generation of the initial "diagnostic" workout and meal plan for the authenticated user.
    *   **Authentication:** Required.
    *   **Request Body:** None.
    *   **Response (200 OK):** A JSON object containing the newly generated 7-day workout and meal plans.
    *   **Notes:** This is a critical endpoint that calls the AI Plan Generator Service.

*   **`GET /plans/today`**
    *   **Description:** Fetches the workout and meal plan for the current day for the authenticated user.
    *   **Authentication:** Required.
    *   **Request Body:** None.
    *   **Response (200 OK):** A JSON object with the details of today's plan.

### Workflows and Sequencing

The primary workflow for Epic 1 is the new user onboarding and first plan generation sequence. This workflow is critical as it represents the user's first interaction with the core value proposition of the application.

1.  **User Registration:** A new user signs up on the frontend using their email and password.
2.  **Verification Email:** The backend receives the registration request, creates a user record in Supabase Auth, and triggers a verification email to be sent to the user. The user's account is in an unverified state.
3.  **Email Confirmation:** The user clicks the verification link in their email, and Supabase marks their account as verified.
4.  **First Login:** The user logs in for the first time. The frontend detects that the user has not completed onboarding and redirects them to the start of the guided onboarding flow.
5.  **Onboarding & Preference Submission:** The user progresses through the 5-step onboarding process, selecting their fitness goal, dietary preferences, and fitness persona. Upon completion, the frontend sends these preferences to the backend's `/users/preferences` endpoint.
6.  **Plan Generation Trigger:** After successfully saving the preferences, the frontend automatically calls the `/plans/generate-initial` endpoint to trigger the creation of the user's first plan.
7.  **AI Service Interaction:** The backend's AI Plan Generator Service constructs a detailed prompt using the user's preferences and sends it to the OpenAI GPT-4 API.
8.  **Plan Persistence:** The AI service returns a structured JSON response containing the 7-day workout and meal plan. The backend validates this response and saves the plan to the `workout_plans` and `meal_plans` tables in the database.
9.  **Dashboard Display:** The backend returns the newly generated plan to the frontend, which then displays the current day's activities on the user's dashboard.

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

### Reliability/Availability

*   **AI Service Resiliency:** All calls to the OpenAI API must implement retry mechanisms with exponential backoff to handle transient network issues or API errors.
*   **AI Service Fallback:** In the event of a catastrophic failure from the OpenAI API (e.g., prolonged outage or multiple failed retries), the system must fall back to serving a pre-defined default plan from the database.
*   **AI Response Caching:** To reduce dependency on the external service and improve performance, successful OpenAI API responses should be cached.

### Observability

*   **Structured Logging:** The FastAPI backend will implement structured logging in JSON format.
*   **Log Content:** All logs must include, at a minimum, a timestamp, log level (e.g., INFO, ERROR), and a descriptive message.
*   **Log Output:** For the MVP, all logs will be directed to `stdout`/`stderr` to ensure compatibility with Vercel's logging infrastructure. This allows for easy monitoring and debugging without requiring an external logging service.

## Dependencies and Integrations

### Core Dependencies

*   **Frontend (Next.js):**
    *   `next`: Core framework for React.
    *   `react`, `react-dom`: UI library.
    *   `typescript`: Language for type safety.
    *   `tailwindcss`: Utility-first CSS framework for styling.
    *   `@supabase/supabase-js`: Client library for interacting with Supabase (primarily for authentication).
    *   `zustand`: State management library.

*   **Backend (FastAPI):**
    *   `fastapi`: Core web framework.
    *   `uvicorn`: ASGI server to run the FastAPI application.
    *   `pydantic`: For data validation and settings management.
    *   `supabase`: Python client for interacting with the Supabase database.
    *   `openai`: Python client for communicating with the OpenAI API.

### Integration Points

*   **Frontend -> Backend API:** The Next.js frontend will communicate with the FastAPI backend via a versioned REST API (`/api/v1/`).
*   **Frontend -> Supabase Auth:** The frontend will use the `@supabase/supabase-js` library to directly handle user authentication (signup, login, session management) with Supabase.
*   **Backend -> Supabase Database:** The FastAPI backend will connect to the Supabase PostgreSQL database for all data persistence operations (reading and writing user data, plans, etc.).
*   **Backend -> OpenAI API:** The backend's AI Plan Generator Service will make secure calls to the OpenAI GPT-4 API to generate personalized plans.

## Acceptance Criteria (Authoritative)

1.  **AC 1.1.1 (Backend Setup):** A FastAPI application is created and can be run locally.
2.  **AC 1.1.2 (Backend Setup):** A Supabase project is successfully connected to the backend application.
3.  **AC 1.1.3 (Backend Setup):** Alembic is configured for managing database schema migrations.
4.  **AC 1.2.1 (Frontend Setup):** A Next.js application is created with TypeScript and Tailwind CSS.
5.  **AC 1.2.2 (Frontend Setup):** The Next.js application is connected to a Vercel CI/CD pipeline for automated deployments.
6.  **AC 1.2.3 (Frontend Setup):** A test API call from the frontend to the backend returns a successful response, confirming connectivity.
7.  **AC 1.3.1 (Registration):** A new user can sign up with a valid email and password via the frontend UI.
8.  **AC 1.3.2 (Registration):** A verification email is sent to the user's provided email address upon successful registration.
9.  **AC 1.3.3 (Registration):** A user is prevented from logging in if their email has not been verified.
10. **AC 1.3.4 (Registration):** Clicking the verification link in the email successfully marks the user's account as verified in the database.
11. **AC 1.4.1 (Onboarding):** After their first login, a new user is presented with the 5-step guided onboarding UI.
12. **AC 1.4.2 (Onboarding):** The user can select their primary fitness goal, dietary preferences, and fitness persona during the onboarding flow.
13. **AC 1.4.3 (Onboarding):** All preferences selected during onboarding are correctly saved to the user's profile in the database via an API call.
14. **AC 1.5.1 (Plan Generation):** A 7-day personalized workout and meal plan is generated by the AI service after the user completes onboarding.
15. **AC 1.5.2 (Plan Generation):** The generated plan is correctly displayed on the user's dashboard UI.
16. **AC 1.5.3 (Plan Generation):** The complete, generated plan is successfully stored in the database and associated with the user.

## Traceability Mapping

| Acceptance Criterion | Spec Section(s) | Component(s) / API(s) | Test Idea |
|---|---|---|---|
| **AC 1.1.1 - 1.1.3** | Detailed Design > Services and Modules | `backend/` project structure | Unit test backend setup script. |
| **AC 1.2.1 - 1.2.3** | Detailed Design > Services and Modules | `frontend/` project structure | Unit test frontend setup script; Integration test API call. |
| **AC 1.3.1 - 1.3.4** | Detailed Design > APIs and Interfaces | `POST /users/register`, Supabase Auth | E2E test of the full registration and email verification flow. |
| **AC 1.4.1 - 1.4.3** | Detailed Design > APIs and Interfaces | `POST /users/preferences`, Onboarding UI components | E2E test of the onboarding flow; API test to verify preference saving. |
| **AC 1.5.1 - 1.5.3** | Detailed Design > APIs and Interfaces | `POST /plans/generate-initial`, AI Plan Generator Service | API test to validate the structure of the AI-generated plan; E2E test to verify display on dashboard. |

## Risks, Assumptions, Open Questions

*   **Risk:** The AI plan generation service may fail or produce nonsensical plans.
    *   **Mitigation:** Implement strict schema validation on all AI-generated output. Have a fallback mechanism to serve a default, pre-defined plan in case of failure.
*   **Risk:** The user registration process could be insecure, potentially allowing for account takeover.
    *   **Mitigation:** Rely on Supabase Auth's built-in security features, including email verification. Conduct thorough testing of the authentication flow.
*   **Risk:** The onboarding flow might be confusing or buggy, leading to a high user drop-off rate.
    *   **Mitigation:** Perform end-to-end testing of the full onboarding flow across multiple scenarios.
*   **Assumption:** The `epics.md` document is a complete and accurate representation of the scope for Epic 1.
*   **Assumption:** The chosen technology stack (Next.js, FastAPI, Supabase) is stable and will perform as expected.
*   **Question:** What are the specific rate limits and estimated costs associated with the OpenAI API usage for plan generation at scale? This needs to be monitored to ensure the business model is sustainable.

## Test Strategy Summary

The test strategy for Epic 1 will focus on ensuring the core user journey is robust and secure.

*   **Backend:** Unit and integration tests will be written using `Pytest` to validate the logic of the User Service and AI Plan Generator Service. API tests will target the defined endpoints.
*   **Frontend:** Component tests will be written with `React Testing Library` and `Jest` to ensure the correctness of individual UI components in the onboarding flow.
*   **End-to-End (E2E):** `Playwright` will be used to create E2E tests that simulate the full user journey, from registration and onboarding to viewing the first plan on the dashboard.
*   **Priority:** Testing will be prioritized based on the risk assessment, with a focus on P0 (critical) and P1 (high) scenarios covering the happy path, security vulnerabilities, and AI output validation.

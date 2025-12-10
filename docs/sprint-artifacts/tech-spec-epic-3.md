# Epic Technical Specification: User Control & Personalization

Date: 2025-12-10
Author: BIP
Epic ID: 3
Status: Draft

---

## Overview

The AI Fitness & Meal Planner is a web application designed to provide personalized workout and meal plans. Epic 3, "User Control & Personalization," focuses on enhancing the user's ability to manage their account, view personal achievements, and handle plan interruptions. This includes features like a dedicated profile page, comprehensive settings, and account management functionalities, ensuring the application is deeply integrated into the user's lifestyle and provides a tailored experience.

## Objectives and Scope

**In-Scope:**
- **User Profile Page:** Viewing and updating personal information and fitness goals (`FR-001`).
- **Application Settings:** Managing app preferences such as dark mode and notifications (`FR-001`).
- **Account Management:** Changing password and securely deleting the account (`FR-001`).
- **Plan Interruption Management:** Pausing plans for specified periods or adjusting for unwellness (`Epic 3` value statement).

**Out-of-Scope (for Epic 3):**
- Core AI-driven plan generation and adaptation (covered in Epic 1 and 2).
- Detailed workout and meal logging interfaces (covered in Epic 2).
- Advanced progress visualization (covered in Epic 2).

## System Architecture Alignment

Epic 3's implementation primarily impacts the frontend and backend user management components. On the backend, `app/api/v1/endpoints/users.py` will be extended for profile management, and additional endpoints will handle settings and plan interruption logic. The frontend will introduce `src/app/(dashboard)/profile/` and `src/app/(dashboard)/settings/` to provide the user interface for these features. Supabase Auth will continue to handle authentication for password changes and account deletion. Data storage will leverage existing PostgreSQL tables within Supabase, with potential additions for user settings and plan interruption flags. This aligns with the decoupled frontend/backend architecture and utilizes Supabase as the primary BaaS.

## Detailed Design

### Services and Modules

*   **Frontend Components (`src/app/(dashboard)/profile/`, `src/app/(dashboard)/settings/`):**
    *   **Responsibilities:** Display user profile, allow updates to personal info, manage application settings (dark mode, notifications), handle account management (password change, deletion), UI for plan interruption.
    *   **Inputs:** User input from forms, data from backend APIs.
    *   **Outputs:** API requests to backend for updates.
    *   **Owners:** Frontend Team.
*   **Backend API Endpoints (`app/api/v1/endpoints/users.py`, new endpoints for settings and plan interruption):**
    *   **Responsibilities:** Handle user profile updates, manage application settings, process password changes and account deletions, record plan interruptions.
    *   **Inputs:** JSON payloads from frontend, Supabase Auth webhooks.
    *   **Outputs:** JSON responses to frontend, updates to Supabase database.
    *   **Owners:** Backend Team.
*   **Supabase Auth:**
    *   **Responsibilities:** User authentication, password reset, email verification, account deletion.
    *   **Inputs:** User credentials, verification tokens.
    *   **Outputs:** JWT tokens, user session management.
    *   **Owners:** Supabase (managed service).

### Data Models and Contracts

The primary data models involved in Epic 3 will extend the existing `users` table in Supabase and potentially introduce new tables for user settings and plan interruptions.

*   **`users` table (Supabase PostgreSQL):**
    *   **Existing:** `id`, `email`, `password_hash`, `created_at`, etc.
    *   **Additions (for Epic 3):**
        *   `fitness_goal`: `TEXT` (e.g., 'lose weight', 'build muscle')
        *   `dietary_preferences`: `TEXT[]` (e.g., ['vegetarian', 'gluten-free'])
        *   `app_settings`: `JSONB` (for storing user-specific app settings like `dark_mode: BOOLEAN`, `notifications_enabled: BOOLEAN`)
        *   `plan_interruption_status`: `JSONB` (e.g., `{'paused': true, 'start_date': 'ISO_DATE', 'end_date': 'ISO_DATE', 'unwell': true, 'duration_days': 5}`)
*   **API Request/Response Schemas (Pydantic in FastAPI):**
    *   **`UserProfileUpdate`:**
        ```python
        class UserProfileUpdate(BaseModel):
            fitness_goal: Optional[str] = None
            dietary_preferences: Optional[List[str]] = None
        ```
    *   **`AppSettingsUpdate`:**
        ```python
        class AppSettingsUpdate(BaseModel):
            dark_mode: Optional[bool] = None
            notifications_enabled: Optional[bool] = None
        ```
    *   **`PlanInterruptionCreate`:**
        ```python
        class PlanInterruptionCreate(BaseModel):
            paused: bool
            start_date: Optional[date] = None
            end_date: Optional[date] = None
            unwell: Optional[bool] = False
            duration_days: Optional[int] = None
        ```

### APIs and Interfaces

All API endpoints will be versioned under `/api/v1/` and will handle authentication via JWTs issued by Supabase Auth.

*   **`PUT /api/v1/users/me/profile`**
    *   **Description:** Update the authenticated user's profile information.
    *   **Request Body:** `UserProfileUpdate` schema.
    *   **Response:** `200 OK` with updated user profile data. `400 Bad Request` on validation failure.
*   **`GET /api/v1/users/me/settings`**
    *   **Description:** Retrieve the authenticated user's application settings.
    *   **Response:** `200 OK` with `AppSettings` schema.
*   **`PUT /api/v1/users/me/settings`**
    *   **Description:** Update the authenticated user's application settings.
    *   **Request Body:** `AppSettingsUpdate` schema.
    *   **Response:** `200 OK` with updated settings. `400 Bad Request` on validation failure.
*   **`POST /api/v1/users/me/password`**
    *   **Description:** Change the authenticated user's password.
    *   **Request Body:** `{ "old_password": "...", "new_password": "..." }`
    *   **Response:** `200 OK`. `401 Unauthorized` on incorrect old password.
*   **`DELETE /api/v1/users/me`**
    *   **Description:** Delete the authenticated user's account. Requires confirmation.
    *   **Response:** `204 No Content`. `401 Unauthorized`.
*   **`POST /api/v1/users/me/plan-interruption`**
    *   **Description:** Record a plan interruption (pause or unwell status).
    *   **Request Body:** `PlanInterruptionCreate` schema.
    *   **Response:** `200 OK`. `400 Bad Request`.

### Workflows and Sequencing

*   **User Profile Update:**
    1.  User navigates to `src/app/(dashboard)/profile/`.
    2.  Frontend fetches current profile data from `GET /api/v1/users/me/profile`.
    3.  User modifies fields and submits.
    4.  Frontend sends `PUT /api/v1/users/me/profile` with `UserProfileUpdate`.
    5.  Backend updates `users` table.
    6.  Frontend displays success message.
*   **Account Deletion:**
    1.  User navigates to `src/app/(dashboard)/settings/`.
    2.  User clicks "Delete Account" and confirms.
    3.  Frontend sends `DELETE /api/v1/users/me`.
    4.  Backend interacts with Supabase Auth to delete user, then removes associated data (workout/meal plans, logs) from database.
    5.  Backend returns `204 No Content`.
    6.  Frontend redirects to login/signup.
*   **Plan Interruption:**
    11. User navigates to `src/app/(dashboard)/settings/`.
    12. User selects "Pause Plan" or "Feeling Unwell".
    13. Frontend displays a modal (`plan_interruptions_dark.html`) for input.
    14. User provides interruption details (dates, duration).
    15. Frontend sends `POST /api/v1/users/me/plan-interruption` with `PlanInterruptionCreate`.
    16. Backend records interruption in `users.plan_interruption_status`.
    17. Backend logic for plan generation (Epic 2) will then query this status to adjust plans.
    18. Frontend displays confirmation.

## Non-Functional Requirements

### Performance

*   **User Profile and Settings Updates:** Response time for API calls related to user profile and settings updates should be less than 500ms.
*   **Account Deletion:** Account deletion processes, while not latency-critical, should complete within a reasonable timeframe (e.g., under 5 seconds for user-facing confirmation).

### Security

*   **Authentication and Authorization:** Supabase Auth handles user authentication using JWT tokens. Authorization for user data will be enforced by Row Level Security (RLS) policies in Supabase, ensuring users can only access and modify their own data.
*   **Data Handling:** All sensitive user data (e.g., fitness goals, dietary preferences) will be encrypted both in transit (HTTPS) and at rest (Supabase's managed encryption).
*   **Account Deletion:** Secure account deletion will ensure all associated user data is removed in compliance with GDPR principles.

### Reliability/Availability

*   **Supabase Dependency:** As Supabase is a managed service for authentication and database, its inherent reliability and availability are leveraged. The system should gracefully handle temporary Supabase unavailabilities (e.g., retry mechanisms for database writes, informative error messages to the user).
*   **Backend Resilience:** FastAPI backend services should be fault-tolerant, with appropriate error handling for external API calls (e.g., Supabase, AI services for future plan adjustments influenced by interruptions).

### Observability

*   **Logging:** Structured logging (JSON format) will capture events related to user profile updates, settings changes, account deletions, and plan interruptions. This includes timestamps, log levels, and relevant messages.
*   **Monitoring:** API endpoints for Epic 3 features will be monitored for performance metrics (latency, error rates) to ensure responsive user interactions.
*   **Tracing (Future):** Distributed tracing could be implemented in future phases to track user requests across frontend, backend, and Supabase for debugging complex issues related to profile management or plan interruptions.

## Dependencies and Integrations

*   **Frontend Technologies:**
    *   `Next.js 14+`: React framework for building the user interface.
    *   `React`: JavaScript library for building UI.
    *   `TypeScript`: Superset of JavaScript for type safety.
    *   `Tailwind CSS`: Utility-first CSS framework for styling.
    *   `Recharts`: JavaScript charting library for data visualization (used in Epic 2, but a general dependency).
    *   `Zustand`: State management library for client-side state.
    *   `SWR/React Query`: Libraries for server-side state management and data fetching.
    *   `@supabase/supabase-js`: JavaScript client library for interacting with Supabase services (Auth, Database).
*   **Backend Technologies:**
    *   `FastAPI`: Python web framework for building the API.
    *   `Python 3.9+`: Programming language for the backend.
    *   `Supabase (PostgreSQL)`: Cloud-hosted PostgreSQL database for data persistence.
    *   `Pydantic AI framework with Gemini 2.5`: For AI-driven plan generation.
*   **Authentication:**
    *   `Supabase Auth`: Managed authentication service providing user registration, login, and JWT management.
*   **Deployment:**
    *   `Vercel`: Platform for deploying Next.js frontend and FastAPI backend.
    *   `Vercel Cron Jobs`: For triggering background tasks like weekly plan adaptation.

## Acceptance Criteria (Authoritative)

1.  **Users can edit their primary fitness goal and core dietary preference** from their profile page.
2.  **Users can change their email address** (with verification) from settings.
3.  **Users can delete their account** (with confirmation) from settings.
4.  **Users can navigate to a dedicated profile page** to view and update their personal information and fitness goals.
5.  **Users can navigate to a settings page** to manage application preferences (e.g., dark mode, notification preferences).
6.  **Users can change their password** from the settings page.
7.  **Users can pause their plan for a specified period** (start and end date).
8.  **Users can indicate they are unwell** to trigger recovery-focused plan adjustments.

## Traceability Mapping

| Acceptance Criteria                                                                   | Spec Section(s)                           | Component(s)/API(s)                                                                                             | Test Idea                                                                                                                   |
| :------------------------------------------------------------------------------------ | :---------------------------------------- | :-------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| 1. Users can edit their primary fitness goal and core dietary preference.             | Story 3.1: User Profile Page              | Frontend: `src/app/(dashboard)/profile/`, Backend: `PUT /api/v1/users/me/profile`, Supabase: `users` table      | Verify UI allows updates, API call succeeds, and database reflects changes.                                                 |
| 2. Users can change their email address (with verification).                          | Story 3.3: Account Management (part of)   | Frontend: `src/app/(dashboard)/settings/`, Backend: `PUT /api/v1/users/me/profile` (or similar), Supabase Auth | Test email update flow, verification, and successful login with new email.                                                  |
| 3. Users can delete their account (with confirmation).                                | Story 3.3: Account Management             | Frontend: `src/app/(dashboard)/settings/`, Backend: `DELETE /api/v1/users/me`, Supabase Auth, `users` table     | Confirm deletion prompt, verify user cannot log in, and all associated data is removed.                                     |
| 4. Users can navigate to a dedicated profile page.                                    | Story 3.1: User Profile Page              | Frontend: `src/app/(dashboard)/profile/`                                                                        | Verify navigation to profile page and display of current user data.                                                         |
| 5. Users can navigate to a settings page to manage application preferences.           | Story 3.2: Application Settings           | Frontend: `src/app/(dashboard)/settings/`                                                                       | Verify navigation to settings page and presence of expected preferences (dark mode, notifications).                       |
| 6. Users can change their password from the settings page.                            | Story 3.3: Account Management             | Frontend: `src/app/(dashboard)/settings/`, Backend: `POST /api/v1/users/me/password`, Supabase Auth              | Test password change with old/new passwords, verify login with new password.                                                |
| 7. Users can pause their plan for a specified period.                                 | Story 3.4: Plan Interruption Management   | Frontend: `plan_interruptions_dark.html` (UI), Backend: `POST /api/v1/users/me/plan-interruption`                | Verify UI for setting pause dates, API call to record, and check future plan generation logic respects pause.             |
| 8. Users can indicate they are unwell to trigger recovery-focused plan adjustments. | Story 3.4: Plan Interruption Management   | Frontend: `plan_interruptions_dark.html` (UI), Backend: `POST /api/v1/users/me/plan-interruption`                | Verify UI for indicating unwell, API call to record, and check future plan generation logic adjusts plan for recovery.      |

## Risks, Assumptions, Open Questions

*   **Risk:** Incomplete data deletion during account removal could lead to privacy concerns or orphaned data.
    *   **Mitigation:** Implement robust cascading deletes or explicit data removal procedures in the backend, thoroughly tested. Leverage Supabase's capabilities for referential integrity.
*   **Risk:** Malicious users attempting to exploit password change or account deletion functionalities.
    *   **Mitigation:** Rely on Supabase Auth's built-in security features, rate limiting, and secure API practices (e.g., proper input validation, logging suspicious activity).
*   **Assumption:** Supabase Auth and Database will provide sufficient scalability and reliability for initial MVP.
    *   **Verification:** Monitor Supabase performance metrics.
*   **Open Question:** How will "recovery-focused plan adjustments" for unwell users be precisely defined and communicated to the AI model?
    *   **Next Step:** Detail AI prompt engineering for this specific scenario.

## Test Strategy Summary

*   **Unit Tests:**
    *   **Backend (FastAPI):** `Pytest` for API endpoints (e.g., user profile update, settings update, plan interruption API). Mock Supabase interactions.
    *   **Frontend (Next.js):** `React Testing Library` with `Jest` for UI components (e.g., profile form, settings toggles, account deletion confirmation modal, plan interruption forms).
*   **Integration Tests:**
    *   Test backend API endpoints with a test Supabase instance to ensure correct data persistence and Supabase Auth integration.
    *   Test frontend-backend interactions for profile updates, settings changes, and account management flows.
*   **End-to-End Tests (Future):** `Playwright` or `Cypress` (post-MVP) to simulate full user journeys, including login, profile updates, and account deletion.
*   **Acceptance Criteria Coverage:** All acceptance criteria listed in this document will be covered by at least one test case.
*   **Edge Cases:**
    *   Attempting to update profile with invalid data.
    *   Attempting to delete an account without confirmation.
    *   Entering invalid dates for plan interruption.

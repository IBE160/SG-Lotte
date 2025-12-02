# Epic Technical Specification: User Control & Personalization

Date: tirsdag 2. desember 2025
Author: BIP
Epic ID: 3
Status: Draft

---

## Overview

This epic focuses on empowering the user with greater control and personalization over their application experience. It moves beyond the core planning and logging loop to provide features that make the application feel more tailored to the user's individual needs and life events. The primary goal is to increase user engagement and long-term retention by giving users autonomy over their account, settings, and plans.

This technical specification details the implementation of a user profile page, an application settings page, critical account management functions like password changes and account deletion, and a UI for managing plan interruptions such as vacations or illness.

## Objectives and Scope

### In-Scope

*   **User Profile Page:** A dedicated page for users to view and update their personal information and fitness goals.
*   **Application Settings:** A settings page to manage application-level preferences, such as dark mode and notification settings.
*   **Account Management:** Functionality for users to change their password and securely delete their account and all associated data.
*   **Plan Interruption:** A UI for users to pause their plan for a specified duration (e.g., for a vacation) or to indicate they are unwell, which will influence future plan generation.

### Out-of-Scope

*   **Advanced Profile Customization:** Features like custom avatars, personal bios, or social media links are not included in this epic.
*   **Third-Party Integrations:** Integration with external services like calendars or fitness trackers is not in scope.
*   **Data Export:** The ability for users to export their data is not part of this epic.

## System Architecture Alignment

This epic further builds out the user-centric features of the application, leveraging the existing architecture to provide a more personalized and controllable experience.

*   **Frontend:** New pages and components will be created within the Next.js application for the user profile and settings, located at `src/app/(dashboard)/profile/` and `src/app/(dashboard)/settings/` respectively.
*   **Backend:** The existing `users.py` endpoint in the FastAPI backend will be expanded to include new endpoints for managing profile data, changing passwords, and handling account deletion. The logic for plan interruptions will also be handled within the backend services.
*   **Database & Auth:** This epic will heavily rely on the existing Supabase integration, utilizing Supabase Auth for secure password changes and account deletion, and interacting with the `users` table to manage profile information. The RLS policies will be critical to ensure users can only manage their own data.

## Detailed Design

### Services and Modules

| Service/Module | Responsibility | Inputs | Outputs | Owner |
|---|---|---|---|---|
| **Frontend Profile Module** | Display and allow updates to the user's profile information (name, goals, etc.). | User data fetched from the backend API; user input for updates. | API calls to the backend to save updated profile information. | Frontend Team |
| **Frontend Settings Module** | Provide UI for managing app settings, changing password, and deleting account. | User interactions (toggles for settings, clicks for account actions). | API calls to the backend to manage settings and trigger account management flows. | Frontend Team |
| **Backend Profile Management** | Handle updates to user profile data, secure password changes, and account deletion. | API requests from the frontend containing updated data or action triggers. | Updates to the `users` table; secure interactions with Supabase Auth for password changes and deletion. | Backend Team |
| **Backend Plan Interruption** | Record and manage user-initiated plan interruptions (e.g., pause, unwell). | API requests from the frontend specifying the type and duration of the interruption. | Records created in a `plan_interruptions` table that will inform the AI Plan Adaptation Service. | Backend Team |

### Data Models and Contracts

This epic introduces a new data model for managing plan interruptions and may involve extending existing models.

### `users` (Extended)
The `users` table will be extended to store more detailed profile information.

*   `name` (varchar, nullable): The user's display name.

### `plan_interruptions`
Stores records of user-initiated pauses or adjustments to their plans.

*   `id` (uuid, primary key): Unique identifier for the interruption record.
*   `user_id` (uuid, foreign key to `users.id`): Associates the interruption with a user.
*   `type` (varchar): The type of interruption (e.g., "pause", "unwell").
*   `start_date` (date): The start date of the interruption period.
*   `end_date` (date): The end date of the interruption period.
*   `created_at` (timestamp with time zone): Timestamp of when the interruption was logged.

### APIs and Interfaces

This epic introduces new endpoints for managing user profiles, account settings, and plan interruptions. All endpoints are under the `/api/v1` prefix and require authentication.

### Profile & Account Management

*   **`PUT /users/profile`**
    *   **Description:** Updates the user's profile information.
    *   **Request Body:** `{ "name": "New Name", "fitness_goal": "new_goal" }`
    *   **Response (200 OK):** `{ "message": "Profile updated successfully" }`

*   **`POST /users/change-password`**
    *   **Description:** Securely changes the user's password.
    *   **Request Body:** `{ "old_password": "...", "new_password": "..." }`
    *   **Response (200 OK):** `{ "message": "Password updated successfully" }`
    *   **Notes:** This will interact directly with Supabase Auth's secure password change functionality.

*   **`DELETE /users/account`**
    *   **Description:** Permanently deletes the user's account and all associated data.
    *   **Request Body:** None.
    *   **Response (200 OK):** `{ "message": "Account deleted successfully" }`

### Plan Interruption

*   **`POST /plans/interrupt`**
    *   **Description:** Records a plan interruption, such as a vacation or illness.
    *   **Request Body:** `{ "type": "pause", "start_date": "2025-12-20", "end_date": "2025-12-28" }`
    *   **Response (200 OK):** `{ "message": "Plan interruption recorded successfully" }`

### Workflows and Sequencing

### Account Deletion Workflow

1.  **Initiation:** The user navigates to the settings page and clicks the "Delete Account" button.
2.  **Confirmation:** The frontend displays a confirmation modal to prevent accidental deletion.
3.  **API Request:** Upon user confirmation, the frontend sends a `DELETE /users/account` request to the backend.
4.  **Backend Processing:** The backend authenticates the user and initiates the account deletion process. This involves calling Supabase Auth to delete the user and relying on database cascade deletes to remove all associated data (profiles, plans, logs).
5.  **Logout & Redirect:** The backend returns a success message. The frontend clears any local session data, logs the user out, and redirects them to the public homepage.

### Plan Interruption Workflow

1.  **Initiation:** The user navigates to the settings page and selects an option like "Pause Plan" or "Feeling Unwell".
2.  **Data Collection:** The frontend presents a UI (e.g., a modal with a date picker) to collect the necessary details, such as the start and end dates of a vacation.
3.  **API Request:** The frontend sends a `POST /plans/interrupt` request to the backend with the interruption details.
4.  **Data Persistence:** The backend validates the data and creates a new record in the `plan_interruptions` table.
5.  **Influence on AI:** This workflow does not have an immediate output to the user. Instead, the data is used asynchronously. During the weekly replanning cycle (Epic 2), the AI Plan Adaptation Service will query the `plan_interruptions` table and adjust the next generated plan accordingly (e.g., by not generating a plan during a pause, or by reducing intensity after an illness).

## Non-Functional Requirements

### Performance

*   **API Response Time:** All non-AI API endpoints must have a response time of less than 500ms under normal load conditions.
*   **Concurrent Users:** The system must support at least 100 concurrent active users without degradation in performance.
*   **Frontend Load Time:** The initial load time for the profile and settings pages should be under 2 seconds.

### Security

*   **Authentication:** User authentication will be handled exclusively by Supabase Auth, which provides a secure, token-based (JWT) system.
*   **Authorization:** All database access will be governed by Supabase's Row Level Security (RLS) policies to ensure that users can only access and modify their own data.
*   **Data Encryption:** All data will be encrypted in transit using HTTPS/SSL and at rest, as managed by Supabase's default security posture.
*   **Data Deletion:** The account deletion process must be thorough, ensuring that all personally identifiable information (PII) and user-generated content is permanently removed from the system in compliance with GDPR. This will be achieved through cascade deletes in the database.
*   **Secure Password Change:** The password change functionality will rely on Supabase Auth's secure methods, which require the user's current password and do not expose sensitive information.

### Reliability/Availability

*   **AI Service Resiliency:** All calls to the OpenAI API must implement retry mechanisms with exponential backoff to handle transient network issues or API errors.
*   **AI Service Fallback:** In the event of a catastrophic failure from the OpenAI API, the system must fall back to serving a pre-defined default plan from the database.
*   **AI Response Caching:** To reduce dependency on the external service and improve performance, successful OpenAI API responses should be cached.
*   **Idempotent Deletion:** While not strictly possible, the system should handle repeated calls to the delete endpoint gracefully (e.g., return a success message even if the user has already been deleted).

### Observability

*   **Structured Logging:** The FastAPI backend will implement structured logging in JSON format.
*   **Log Content:** All logs must include, at a minimum, a timestamp, log level (e.g., INFO, ERROR), and a descriptive message. All logs related to account management actions (e.g., password change, account deletion) must be logged with appropriate severity.
*   **Log Output:** For the MVP, all logs will be directed to `stdout`/`stderr` to ensure compatibility with Vercel's logging infrastructure.

## Dependencies and Integrations

### Core Dependencies

*   **Frontend (Next.js):**
    *   `next`: Core framework for React.
    *   `react`, `react-dom`: UI library.
    *   `typescript`: Language for type safety.
    *   `tailwindcss`: Utility-first CSS framework for styling.
    *   `@supabase/supabase-js`: Client library for interacting with Supabase.
    *   `zustand`: State management library.

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
*   **Backend -> Supabase Auth:** The backend will interact with Supabase Auth for secure account management actions like changing passwords and deleting users.
*   **Backend -> OpenAI API:** The backend will continue to interact with the OpenAI API for plan generation, potentially influenced by plan interruption data.

## Acceptance Criteria (Authoritative)

1.  **AC 3.1.1 (Profile Page):** Users can navigate to a dedicated profile page from the main application menu.
2.  **AC 3.1.2 (Profile Page):** The profile page correctly displays the user's name, email, and current fitness goals.
3.  **AC 3.1.3 (Profile Page):** Users can edit their personal details (e.g., name), and the changes are successfully saved to the database.
4.  **AC 3.2.1 (Settings):** Users can navigate to a dedicated settings page.
5.  **AC 3.2.2 (Settings):** The settings page provides options to manage preferences like dark mode and notifications.
6.  **AC 3.2.3 (Settings):** Changes to settings are saved and applied immediately (e.g., toggling dark mode).
7.  **AC 3.3.1 (Account Mgmt):** Users can successfully change their password from the settings page after providing their old password.
8.  **AC 3.3.2 (Account Mgmt):** Users can delete their account from the settings page, which includes a confirmation step.
9.  **AC 3.3.3 (Account Mgmt):** Upon account deletion, all of the user's data is securely and permanently removed from the system.
10. **AC 3.4.1 (Interruption):** Users can pause their plan for a specified date range from the settings page.
11. **AC 3.4.2 (Interruption):** Users can indicate they are "unwell," which adjusts the intensity of future plans.
12. **AC 3.4.3 (Interruption):** Plan interruption data is correctly recorded in the database and influences the next AI plan generation cycle.

## Traceability Mapping

| Acceptance Criterion | Spec Section(s) | Component(s) / API(s) | Test Idea |
|---|---|---|---|
| **AC 3.1.1 - 3.1.3** | Detailed Design > APIs and Interfaces | `PUT /users/profile`, Profile Page UI | E2E test of updating profile information; API test for the PUT endpoint. |
| **AC 3.2.1 - 3.2.3** | Detailed Design > Services and Modules | Settings Page UI | Component test for settings toggles; E2E test to verify persistence across sessions. |
| **AC 3.3.1 - 3.3.3** | Detailed Design > APIs and Interfaces | `POST /users/change-password`, `DELETE /users/account` | E2E test of the password change flow; Integration test to verify complete data deletion upon account removal. |
| **AC 3.4.1 - 3.4.3** | Detailed Design > APIs and Interfaces | `POST /plans/interrupt`, `plan_interruptions` table | API test to verify interruption data is saved correctly; Integration test with the plan adaptation logic to ensure interruptions are respected. |

## Risks, Assumptions, Open Questions

*   **Risk:** The account deletion process may fail or leave residual user data, leading to privacy violations.
    *   **Mitigation:** Implement database-level cascade deletes. Develop and execute a thorough integration test to verify the complete removal of all user-associated data.
*   **Risk:** Sensitive user profile data could be exposed to or modified by unauthorized users.
    *   **Mitigation:** Conduct a security review of all profile management endpoints and ensure RLS policies are strictly enforced and tested.
*   **Risk:** The plan interruption feature could misbehave, leading to incorrect or nonsensical plan generation after an interruption.
    *   **Mitigation:** Unit test the interruption logic and run integration tests with the AI plan adaptation service to verify correct behavior.
*   **Assumption:** Supabase Auth's built-in mechanisms for password changes and account deletion are secure and reliable.
*   **Assumption:** Users will understand the implications of actions like pausing their plan or deleting their account.
*   **Question:** What is the defined data retention policy for deleted users? Is any anonymized data required for long-term analytics?
*   **Question:** How, specifically, should the AI's "recovery-focused approach" be defined when a user marks themselves as "unwell"? This requires a clear definition to guide prompt engineering.

## Test Strategy Summary

The test strategy for Epic 3 is focused on security, data integrity, and user control.

*   **Backend:** `Pytest` tests will validate the logic for updating user profiles, changing passwords (by mocking Supabase Auth calls), and handling plan interruptions. A critical focus will be on integration tests that verify the complete deletion of user data when the account deletion endpoint is called.
*   **Frontend:** `React Testing Library` and `Jest` will be used to test the profile and settings UI components.
*   **End-to-End (E2E):** `Playwright` tests will cover the critical user flows for this epic: successfully updating profile information, changing a password, pausing a plan, and securely deleting an account.
*   **Security:** A significant portion of the testing effort will be dedicated to security, with tests designed to try and access or modify another user's data, and to verify that no data remains after an account is deleted.
*   **Priority:** P0 and P1 tests will be prioritized for account deletion and password change functionalities due to their high security and data integrity impact.

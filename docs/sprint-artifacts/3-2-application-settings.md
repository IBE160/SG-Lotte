# Story 3.2: Application Settings

Status: drafted

## Story

As an engaged user,
I want a settings page to manage application preferences,
so that I can customize my experience.

## Acceptance Criteria

1. **Given** I navigate to the settings page, **When** the page loads, **Then** I see options to manage dark mode and notification preferences.
2. **Given** I change a setting (e.g., dark mode toggle, notification preference), **When** I save the changes, **Then** the updated setting is persisted to my user profile/settings and applied immediately (e.g., UI theme changes, notification behavior is updated).

## Tasks / Subtasks

**Frontend Development:**

* [ ] **Task 1 (AC: #1):** Create settings page route and component (`frontend/src/app/(dashboard)/settings/page.tsx`).
* [ ] **Task 2 (AC: #1):** Implement UI for dark mode toggle and notification preferences, utilizing existing component library (if available) and Tailwind CSS.
* [ ] **Task 3 (AC: #1, #2):** Fetch current user settings from the backend API upon page load.
* [ ] **Task 4 (AC: #2):** Implement client-side logic to update settings and send changes to the backend API.
* [ ] **Task 5 (AC: #2):** Provide immediate visual feedback for successful setting changes (e.g., toast notification, theme update).

**Backend Development:**

* [ ] **Task 6 (AC: #1, #2):** Create/Extend API endpoint (`PUT /api/v1/users/me/settings`) to retrieve and update user application settings (dark mode, notification preferences).
* [ ] **Task 7 (AC: #2):** Implement logic to persist updated settings to the database (e.g., `public.user_profiles` or a new `public.user_settings` table).
* [ ] **Task 8 (AC: #2):** Implement server-side validation for incoming settings data.

**Testing:**

* [ ] **Task 9 (AC: #1):** Write unit/integration tests for frontend settings component using `React Testing Library` and `Jest` to verify rendering of options.
* [ ] **Task 10 (AC: #1, #2):** Write unit/integration tests for backend API endpoint using `Pytest` to verify setting retrieval and updates, including validation.
* [ ] **Task 11 (AC: #2):** Perform manual end-to-end testing to confirm settings changes are applied correctly in the UI and persisted in the database.

## Dev Notes

### Requirements Context Summary

**User Story:** As an engaged user, I want a settings page to manage application preferences, so I can customize my experience.

**Epic 3: User Control & Personalization**

* **Value Statement:** As an engaged user, I can manage my account, view my achievements, and handle interruptions to my plan, so the application feels tailored to my life.
* **High-level scope:** A comprehensive user profile page, a detailed settings page for app and notification preferences, account management functionalities (change password, delete account), and UI for pausing or adjusting plans due to life events.

**Acceptance Criteria (from Epics.md):**

* **Given** I navigate to the settings page
* **When** the page loads
* **Then** I see options to manage dark mode and notification preferences
* **And** changes to these settings are saved and applied immediately

**Relevant Functional Requirements (from PRD.md):**

* **FR-001: User Authentication & Profile Management**: Users can edit their primary fitness goal and core dietary preference. (This implies a mechanism to save preferences, which includes application preferences).
* **FR-007: Notifications**: Users receive an in-app notification when new weekly plans are generated. (This indicates the need for managing notification preferences).

**Architectural Considerations (from architecture-2025-11-30.md):**

* **Frontend Location:** The settings UI will reside under `frontend/src/app/(dashboard)/settings/`.
* **Backend Interaction:** Changes to settings will likely involve authenticated API calls to endpoints related to user profiles or application settings (e.g., potentially `PUT /api/v1/users/me/profile` or a dedicated settings endpoint).
* **Styling:** Frontend will use Tailwind CSS.
* **Testing:** Frontend component/integration tests using `React Testing Library` with `Jest`. Backend unit/integration tests using `Pytest`.

### Project Structure Alignment and Lessons Learned

**Learnings from Previous Story (3.1 - User Profile Page)**[Source: stories/3-1-user-profile-page.md]

- Backend state must be treated as the source of truth; UI alone is insufficient to verify correctness.
- Optional or missing data must be handled defensively in the UI.
- Changes should be minimal and scoped to avoid regressions in dashboard functionality.


* **Warnings/Recommendations:**
  * Backend state must be treated as the source of truth; UI alone is insufficient to verify correctness.
  * Optional or missing data must be handled defensively in the UI.
  * Changes should be minimal and scoped to avoid regressions in dashboard functionality.
* **New Components/Patterns for Reuse:**
  * Reusable components for profile related UI are located in `frontend/src/components/profile/`.
* **Evolving Components:**
  * The backend user API (`backend/app/api/v1/endpoints/users.py`) was likely modified to support user profile updates and will continue to evolve for application settings.

**Implications for Story 3.2 - Application Settings:**

* **Frontend Structure:** The settings UI should be placed under `frontend/src/app/(dashboard)/settings/` following the established route-based component organization.
* **Backend Interaction:** Leverage existing user-related API endpoints or extend `backend/app/api/v1/endpoints/users.py` for saving application preferences. Adhere to the API naming conventions (e.g., plural nouns, kebab-case for endpoints).
* **Data Handling:** Ensure defensive handling of optional or missing user preferences on the UI. Validate changes against backend state as the source of truth.
* **Scope:** Keep changes minimal and focused on application settings to avoid regressions.

### References

* [Source: docs/PRD.md] - For functional requirements and overall product vision.
* [Source: docs/epics.md] - For Epic 3 details and story breakdown.
* [Source: docs/architecture-2025-11-30.md] - For architectural constraints, patterns, and testing strategy.
* [Source: docs/ux-design-specification.md] - For UX design guidelines.
* [Source: docs/sprint-artifacts/3-1-user-profile-page.md] - For learnings from the previous story.

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Gemini CLI

### Debug Log References

### Completion Notes

### File List

## Change Log

- 2025-12-17: Initial draft created by SM agent.

# Story 3.3: Account Management

Status: drafted

## Story

As an engaged user,
I want options to change my password or delete my account from the settings page,
So I have full control over my account.

## Acceptance Criteria

1.  **Given** I am on the settings page, **When** I select "Change Password", **Then** I am prompted to enter my old and new passwords and my password is updated securely via Supabase Auth.
2.  **Given** I am on the settings page, **When** I select "Delete Account", **Then** I am prompted for confirmation and my account and associated data are securely deleted from the system.
3.  **Given** I am on the settings page, **When** I change my email address, **Then** the new email is updated after successful verification (e.g., via a confirmation link sent to the new email).

## Tasks / Subtasks

**Frontend Development:**

*   [ ] **Task 1 (AC: #1):** Implement UI on the settings page for "Change Password".
*   [ ] **Task 2 (AC: #1):** Create form with fields for old password, new password, and confirm new password.
*   [ ] **Task 3 (AC: #1):** Add client-side validation for password fields.
*   [ ] **Task 4 (AC: #1):** Call the backend API to securely change the password.
*   [ ] **Task 5 (AC: #2):** Implement UI on the settings page for "Delete Account".
*   [ ] **Task 6 (AC: #2):** Create a confirmation modal to prevent accidental deletion.
*   [ ] **Task 7 (AC: #2):** Call the backend API to delete the user account upon confirmation.

*   [ ] **Task 15 (AC: #3):** Implement UI on the settings page for "Change Email Address".
*   [ ] **Task 16 (AC: #3):** Create form with fields for new email and confirmation.
*   [ ] **Task 17 (AC: #3):** Add client-side validation for email fields.
*   [ ] **Task 18 (AC: #3):** Call the backend API to initiate email change and handle verification flow.

**Backend Development:**

*   [ ] **Task 8 (AC: #1):** Create an API endpoint (e.g., `POST /api/v1/users/me/change-password`) to handle password changes.
*   [ ] **Task 9 (AC: #1):** Integrate with Supabase Auth to securely update the user's password.
*   [ ] **Task 10 (AC: #2):** Create an API endpoint (e.g., `DELETE /api/v1/users/me`) to handle account deletion.
*   [ ] **Task 11 (AC: #2):** Implement logic to delete the user from Supabase Auth and cascade delete all associated user data from the database.

*   [ ] **Task 19 (AC: #3):** Create an API endpoint (e.g., `POST /api/v1/users/me/change-email`) to handle email change requests.
*   [ ] **Task 20 (AC: #3):** Integrate with Supabase Auth to securely update the user's email and manage the verification process (e.g., sending confirmation links).

**Testing:**

*   [ ] **Task 12 (AC: #1):** Write tests for the change password functionality (frontend and backend).
*   [ ] **Task 13 (AC: #2):** Write tests for the account deletion functionality (frontend and backend).
*   [ ] **Task 14 (AC: #1, #2):** Perform manual E2E testing of both features.

*   [ ] **Task 21 (AC: #3):** Write tests for the change email functionality (frontend and backend).
*   [ ] **Task 22 (AC: #3):** Perform manual E2E testing of the email change and verification flow.

## Dev Notes

### Learnings from Previous Story (3.2 - Application Settings)

*   **Backend Source of Truth:** The backend state must be the definitive source of truth. UI state alone is not a reliable verification of correctness.
*   **Defensive UI:** UI must handle optional or missing data gracefully.
*   **Scoped Changes:** Keep changes minimal and focused to avoid regressions in other areas like the dashboard.
*   **Component Reuse:** Look for reusable components in `frontend/src/components/profile/` before creating new ones.
*   **API Evolution:** The user API at `backend/app/api/v1/endpoints/users.py` is the expected location for new user-management endpoints.
*   **Acceptance Criteria Source:** Acceptance Criteria for this story are sourced from `tech-spec-epic-3.md` and `epics.md`.

#### File Changes from Previous Story
*   **NEW**: `frontend/src/app/(dashboard)/settings/page.tsx`
*   **MODIFIED**: `backend/app/api/v1/endpoints/users.py`
*   **MODIFIED**: `backend/app/schemas/user.py`
*   **MODIFIED**: `backend/app/crud/user.py`

### Project Structure Notes

*   **Frontend:** New UI components should be added within the existing settings page located at `frontend/src/app/(dashboard)/settings/page.tsx`.
*   **Backend:** New endpoints should be added to `backend/app/api/v1/endpoints/users.py` to maintain consistency with the existing user management API.

### Testing Standards

*   Backend testing uses Pytest (ref. architecture-2025-11-30.md)
*   Frontend testing uses React Testing Library + Jest
*   Manual testing is acceptable for account deletion in this iteration

### Architecture Patterns and Constraints

*   Supabase Auth is the source of truth for identity
*   All endpoints are JWT-protected
*   Destructive actions require explicit user confirmation

### References

*   [Source: docs/sprint-artifacts/tech-spec-epic-3.md#Acceptance-Criteria]
*   [Source: docs/architecture-2025-11-30.md#Epic-to-Architecture-Mapping]
*   [Source: docs/PRD.md#FR-001-User-Authentication-and-Profile-Management]
*   [Source: docs/epics.md#Epic-3-User-Control-and-Personalization]
*   [Source: docs/sprint-artifacts/3-2-application-settings.md#Dev-Agent-Record]


## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Gemini CLI

### Debug Log References

### Completion Notes List

### File List

## Change Log
- 2025-12-17: Story aligned with Tech Spec Epic 3, references completed, acceptance criteria expanded.

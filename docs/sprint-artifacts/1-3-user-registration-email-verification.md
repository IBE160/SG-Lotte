# Story 1.3: User Registration & Email Verification

**Status:** drafted

**Epic:** Epic 1: First Plan & Foundation
**User:** New User
**Value Statement:** As a new user, I want to sign up with my email and password and verify my email, so that I can create a secure account.

---

## 1. Requirements & Context

### 1.1. Requirements Summary

This story focuses on implementing the user registration flow. It involves creating a signup form, integrating with Supabase Auth for account creation and email verification, and preventing login until the user's email is verified.

### 1.2. Source Documents

*   **Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-1.md#detailed-design`
*   **PRD:** `docs/PRD.md#fr-001-user-authentication--profile-management`
*   **Epics:** `docs/epics.md#story-13-user-registration--email-verification`
*   **Architecture:** `docs/architecture-2025-11-30.md#security-architecture`

---

## 2. Acceptance Criteria

| # | Given | When | Then |
|---|---|---|---|
| 1 | I am on the signup page | I enter valid email/password and submit | My account is created in Supabase |
| 2 | I have submitted the signup form | | A verification email is sent to my provided email address |
| 3 | My email is not verified | I attempt to log in | I am prevented from logging in |
| 4 | I have received the verification email | I click the verification link | My account is marked as verified |

---

## 3. Implementation Plan

### 3.1. Task Breakdown

| Task ID | Description | Est. Time |
|---|---|---|
| 1.3.1 | Create the signup UI form based on `onboarding1_dark.html`. (AC: #1) | 3h |
| 1.3.2 | Implement the client-side logic to call the Supabase Auth registration function. (AC: #1) | 2h |
| 1.3.3 | Create a backend endpoint to handle the registration and trigger the verification email. (AC: #1, #2) | 2h |
| 1.3.4 | Implement the logic to prevent login for unverified users. (AC: #3) | 1h |
| 1.3.5 | Create a page to handle the email verification link and provide feedback to the user. (AC: #4) | 2h |
| 1.3.6 | **Test:** Write unit tests for the Supabase registration function call. (AC: #1) | 1h |
| 1.3.7 | **Test:** Write an integration test to ensure the verification email is triggered. (AC: #2) | 1h |
| 1.3.8 | **Test:** Write an E2E test attempting to log in with an unverified account. (AC: #3) | 1.5h |
| 1.3.9 | **Test:** Write an E2E test that follows the verification link and confirms the account is verified. (AC: #4) | 1.5h |

### 3.2. Developer Notes

#### Project Structure Notes
*   The signup form UI should be created within the `frontend/src/app/(auth)/` directory.
*   The new backend endpoint for registration should be added to `backend/app/api/v1/endpoints/users.py`.
*   The verification page should be a new route in the `frontend/src/app/(auth)/` directory.

#### General Notes
*   This story heavily relies on the Supabase Auth functionality. Refer to the Supabase documentation for details on implementation.
*   The frontend UI should be based on the `onboarding1_dark.html` wireframe.
*   Error handling is crucial for this feature. Provide clear feedback to the user in case of errors (e.g., invalid email, password too short).

---

## Dev Agent Record

*   **Context Reference:**
*   **Agent Model Used:**
*   **Debug Log References:**
*   **Completion Notes List:**
*   **File List:**

---

## 4. Validation

### 4.1. Validation Checklist

*   [ ] **AC #1:** User can create an account through the UI, and the account appears in Supabase.
*   [ ] **AC #2:** A verification email is successfully sent to the user's provided email address.
*   [ ] **AC #3:** An unverified user is shown an error message and prevented from logging in.
*   [ ] **AC #4:** Clicking the verification link in the email correctly marks the user's account as verified.
*   [ ] **Testing:** All unit, integration, and E2E tests for the registration flow pass.

### 4.2. Review

*   **Completed by:**
*   **Date:**
*   **Outcome:**

---

## 5. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2025-12-02 | sm | Initial draft |

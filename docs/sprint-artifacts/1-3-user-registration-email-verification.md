# Story 1.3: User Registration & Email Verification

**Epic:** Epic 1: First Plan & Foundation
**User:** New User
**Value Statement:** As a new user, I want to sign up with my email and password and verify my email, so that I can create a secure account.

---

## 1. Requirements & Context

### 1.1. Requirements Summary

This story focuses on implementing the user registration flow. It involves creating a signup form, integrating with Supabase Auth for account creation and email verification, and preventing login until the user's email is verified.

### 1.2. Source Documents

*   **Epics:** `docs/epics.md`
*   **Architecture:** `docs/architecture-2025-11-30.md`

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
| 1.3.1 | Create the signup UI form based on `onboarding1_dark.html`. | 3h |
| 1.3.2 | Implement the client-side logic to call the Supabase Auth registration function. | 2h |
| 1.3.3 | Create a backend endpoint to handle the registration and trigger the verification email. | 2h |
| 1.3.4 | Implement the logic to prevent login for unverified users. | 1h |
| 1.3.5 | Create a page to handle the email verification link and provide feedback to the user. | 2h |
| 1.3.6 | Write tests for the registration and verification flow. | 2h |

### 3.2. Developer Notes

*   This story heavily relies on the Supabase Auth functionality. Refer to the Supabase documentation for details on implementation.
*   The frontend UI should be based on the `onboarding1_dark.html` wireframe.
*   Error handling is crucial for this feature. Provide clear feedback to the user in case of errors (e.g., invalid email, password too short).

---

## 4. Validation

### 4.1. Validation Checklist

*   [ ] User can create an account.
*   [ ] Verification email is sent.
*   [ ] Unverified user cannot log in.
*   [ ] Email verification works correctly.

### 4.2. Review

*   **Completed by:**
*   **Date:**
*   **Outcome:**

---

## 5. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2025-12-02 | sm | Initial draft |

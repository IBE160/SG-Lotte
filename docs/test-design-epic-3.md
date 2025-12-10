# Test Design: Epic 3 - User Control & Personalization

**Author:** Murat (Master Test Architect)
**Date:** 2025-12-10
**Epic:** Epic 3: User Control & Personalization
**Risk Assessment:** Medium. While not as central as the core planning loop, these features are critical for user trust, long-term engagement, and regulatory compliance (e.g., account deletion). Failures here can cause significant user frustration and data privacy issues.

---

## 1. Testing Strategy & Scope

This test design covers the quality validation for all features within Epic 3. The strategy prioritizes security, data integrity, and usability, ensuring that users have full and reliable control over their account and experience.

### 1.1. Testing Pyramid

The testing approach remains consistent with the established pyramid model.

*   **Unit Tests (60%):** All new UI components (profile forms, settings toggles), state management logic, and backend API endpoints will be thoroughly unit tested.
*   **Integration Tests (30%):** We will focus on testing the contracts between the frontend and the backend APIs for profile and settings management. A key focus will be on the integration with Supabase Auth for security-sensitive operations like password changes and account deletion.
*   **End-to-End (E2E) Tests (10%):** A lean set of E2E tests will validate the complete user flows for updating a profile, changing a password, deleting an account, and pausing a plan. These tests are vital for confirming the real-world user experience and ensuring data integrity.
*   **Security Testing:** Manual and automated security checks will be performed on the account management functionalities. This includes checks for common vulnerabilities (e.g., improper access control, insecure direct object references) related to user data.
*   **Manual & Exploratory Testing:** The settings and profile pages will undergo rigorous exploratory testing to identify usability issues, visual bugs across different viewports, and edge cases in the user flows.

### 1.2. Tools & Frameworks

*   **Unit/Integration (Frontend):** Jest & React Testing Library
*   **Unit/Integration (Backend):** Pytest
*   **E2E Testing:** Playwright
*   **API Contract Testing:** Pact
*   **CI/CD:** GitHub Actions

---

## 2. Test Scenarios & Stories Coverage

This section maps high-level test scenarios to the user stories within Epic 3.

### Story 3.1: User Profile Page

*   **Scenario 3.1.1:** A user can successfully view their current profile information.
*   **Scenario 3.1.2:** A user can successfully edit and save their profile information (e.g., name).
*   **Scenario 3.1.3:** The system prevents users from editing read-only fields (e.g., email address).
*   **Scenario 3.1.4:** The system validates input and rejects invalid data (e.g., an empty name).

### Story 3.2: Application Settings

*   **Scenario 3.2.1:** A user can successfully toggle dark mode, and the theme is applied instantly and persists across sessions.
*   **Scenario 3.2.2:** A user can successfully enable or disable notification preferences, and the changes are saved correctly.

### Story 3.3: Account Management

*   **Scenario 3.3.1:** A user can successfully change their password with the correct old password.
*   **Scenario 3.3.2:** The system prevents a password change if the old password is incorrect.
*   **Scenario 3.3.3:** A user can successfully and permanently delete their account after confirming their choice.
*   **Scenario 3.3.4:** After account deletion, the user is logged out and can no longer access the application with their old credentials.
*   **Scenario 3.3.5 (Security):** A logged-in user cannot view or modify the profile or settings of another user.

### Story 3.4: Plan Interruption Management

*   **Scenario 3.4.1:** A user can successfully pause their plan for a future date range.
*   **Scenario 3.4.2:** No new plans are generated for a user whose plan is currently paused.
*   **Scenario 3.4.3:** The AI correctly adjusts plan intensity downwards when a user signals they are "Feeling Unwell".
*   **Scenario 3.4.4:** The system correctly resumes plan generation after the pause period ends.

---

## 3. Detailed Test Cases (Examples)

This is not an exhaustive list but provides examples of specific, automatable test cases for each story.

### **Story 3.1: User Profile Page**

| Test Case ID | Type | Description | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-3.1.1 | E2E | Verify successful profile name change | 1. Log in. 2. Navigate to Profile page. 3. Edit the "Name" field to "Test User New". 4. Click "Save". 5. Reload the page. | The name "Test User New" is displayed. A success notification is shown. The database reflects the change. |
| TC-3.1.2 | Integration | API rejects update to email field | 1. Send a PATCH request to `/users/me` with a new email address. | The API returns a 400 Bad Request or 403 Forbidden error, and the email address is not changed. |

### **Story 3.3: Account Management**

| Test Case ID | Type | Description | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-3.3.1 | E2E | Verify successful account deletion | 1. Create a new user `todelete@test.com`. 2. Log in as `todelete@test.com`. 3. Navigate to Settings. 4. Click "Delete Account". 5. Confirm deletion in the modal. | The user is redirected to the login page. An attempt to log in with `todelete@test.com` fails. The user's data is removed from the `users` table in Supabase. |
| TC-3.3.2 | Integration | API rejects password change with wrong old password | 1. Log in as `testuser@test.com`. 2. Send a POST request to `/auth/change-password` with an incorrect `old_password`. | The API returns a 401 Unauthorized error. |

### **Story 3.4: Plan Interruption Management**

| Test Case ID | Type | Description | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-3.4.1 | E2E | Verify successful plan pause | 1. Log in. 2. Navigate to Settings -> Plan Interruptions. 3. Select "Pause Plan". 4. Choose a start and end date for next week. 5. Click "Save". | A confirmation message is shown. A record of the pause is created in the database. |
| TC-3.4.2 | Integration | AI plan generation skips paused users | 1. Set a user's plan to be paused for the upcoming week. 2. Trigger the weekly plan generation background job. | The AI service is not called for this user. No new plan is created in the database for the user for the paused week. |

---

## 4. Test Data & Environment Requirements

*   **Test Users:** In addition to the users from Epic 2, a specific user for deletion tests (`deletable_user`) should be created and torn down as part of the test run to ensure idempotency.
*   **Security Configuration:** The staging environment's Supabase instance must have Row Level Security (RLS) policies enabled and configured identically to production. This is critical for validating security test cases.
*   **Time-based Testing:** E2E tests for plan pausing (Story 3.4) will require mocking or manipulating the system clock to simulate the passage of time (e.g., `cy.clock()` in Cypress or equivalent in Playwright).

---

## 5. Exit Criteria

Epic 3 can be considered "Done" and ready for release when:

1.  All new code has a unit test coverage of >= 80%.
2.  All E2E tests for Scenarios 3.1 through 3.4 are passing, with a special focus on the account deletion and password change flows.
3.  A security review of the account management APIs has been completed with no outstanding "Critical" or "High" vulnerabilities.
4.  No "Critical" or "High" priority bugs have been found during the final round of exploratory testing on the profile and settings pages.

**Next Steps:** I will use this document to guide the creation of Playwright E2E test stubs for the critical user flows defined in these scenarios.

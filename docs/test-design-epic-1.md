# Test Design: Epic 1 - First Plan & Foundation

**Author:** Murat (Master Test Architect)
**Date:** 2025-12-10
**Epic:** Epic 1: First Plan & Foundation
**Risk Assessment:** Critical. This epic lays the foundation for the entire application. Any failure in the core infrastructure, user registration, or initial plan generation will prevent any user from successfully using the product. The risk of failure is the highest in this epic.

---

## 1. Testing Strategy & Scope

This test design outlines the quality validation strategy for the foundational Epic 1. The primary goals are to verify the stability of the core technical stack, the security of the authentication flow, and the reliability of the crucial first-time user experience.

### 1.1. Testing Pyramid

The test strategy for this foundational epic is heavily weighted towards integration and E2E tests to ensure all the new, interconnected pieces work together as a cohesive whole.

*   **Unit Tests (40%):** While important, the focus is less on isolated UI components and more on critical business logic in backend services (e.g., plan generation logic, user preference validation) and frontend state management.
*   **Integration Tests (40%):** This is the most critical layer for Epic 1. We will rigorously test the integration points:
    *   Frontend (Next.js) to Backend (FastAPI) API calls.
    *   Backend to Supabase database (data model integrity).
    *   Backend to Supabase Auth for user registration and verification.
    *   Backend service for AI plan generation to the underlying AI framework.
*   **End-to-End (E2E) Tests (20%):** A comprehensive E2E test will cover the entire "golden path" for a new user: from the landing page, through signup, email verification, the 5-step onboarding, and finally landing on the dashboard to see their first plan.
*   **Infrastructure & Deployment Testing:** We will validate the Vercel deployment pipeline for the frontend and the hosting configuration for the backend, ensuring they are stable, scalable, and connected. This includes "smoke tests" that run immediately after deployment.
*   **Security Testing:** The authentication and registration flow will be a primary focus. We will test for common vulnerabilities, ensure email verification is enforced, and validate password strength policies.

### 1.2. Tools & Frameworks

*   **Unit/Integration (Frontend):** Jest & React Testing Library
*   **Unit/Integration (Backend):** Pytest
*   **E2E Testing:** Playwright
*   **API Contract Testing:** Pact
*   **CI/CD & Deployment:** Vercel, GitHub Actions

---

## 2. Test Scenarios & Stories Coverage

### Story 1.1 & 1.2: Core Backend & Frontend Setup

*   **Scenario 1.1.1 (Smoke Test):** The deployed FastAPI backend is reachable and returns a healthy status from a health-check endpoint.
*   **Scenario 1.2.1 (Smoke Test):** The deployed Next.js frontend loads successfully in a browser.
*   **Scenario 1.2.2 (Integration):** The frontend can make a successful authenticated API call to the backend.

### Story 1.3: User Registration & Email Verification

*   **Scenario 1.3.1:** A new user can successfully sign up with a valid email and a strong password.
*   **Scenario 1.3.2:** The system rejects registrations with invalid email formats or weak passwords.
*   **Scenario 1.3.3:** The system prevents a user from logging in before they have verified their email address.
*   **Scenario 1.3.4:** A user can successfully verify their account by clicking the link in the verification email.
*   **Scenario 1.3.5:** The system handles attempts to register with an already existing email address gracefully.

### Story 1.4: Guided Onboarding Flow

*   **Scenario 1.4.1:** A newly verified user is correctly redirected to the start of the 5-step onboarding flow.
*   **Scenario 1.4.2:** A user can navigate forwards and backwards through the onboarding steps.
*   **Scenario 1.4.3:** The user's selections (goals, preferences, persona) are correctly saved to the database upon completion of the flow.
*   **Scenario 1.4.4:** The system validates user input at each step where necessary.

### Story 1.5: Initial AI Plan Generation & Display

*   **Scenario 1.5.1:** A user who completes onboarding is immediately shown a 7-day workout and meal plan on their dashboard.
*   **Scenario 1.5.2:** The generated plan is consistent with the preferences selected during onboarding.
*   **Scenario 1.5.3:** The complete plan is successfully stored in the database and associated with the correct user.
*   **Scenario 1.5.4:** The system gracefully handles potential errors or delays from the AI generation service and displays a user-friendly message.

---

## 3. Detailed Test Cases (Examples)

### **Story 1.3: User Registration & Email Verification**

| Test Case ID | Type | Description | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-1.3.1 | E2E | Golden Path: Successful user registration and verification. | 1. Navigate to signup page. 2. Enter new valid credentials. 3. Submit form. 4. Check email inbox for verification link. 5. Click link. 6. Attempt to log in with credentials. | Signup succeeds. Verification email is received. Link correctly marks account as verified. Login is successful. |
| TC-1.3.2 | E2E | Verify login is blocked before email verification. | 1. Navigate to signup page. 2. Enter new valid credentials. 3. Submit form. 4. Attempt to log in immediately. | Login fails with a message indicating the email must be verified. |
| TC-1.3.3 | Integration | API rejects registration with existing email. | 1. Send a POST request to the registration endpoint with an email that already exists in the database. | The API returns a 409 Conflict error. |

### **Story 1.5: Initial AI Plan Generation & Display**

| Test Case ID | Type | Description | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-1.5.1 | E2E | Verify plan is displayed after onboarding. | 1. Complete the entire registration and onboarding flow. 2. Upon reaching the dashboard... | The dashboard displays a populated 7-day workout and meal plan. No "empty" state is visible. |
| TC-1.5.2 | Integration | Verify AI plan generation service call. | 1. Set up a user who has just completed onboarding. 2. Trigger the API endpoint that generates the initial plan. | The backend service makes a call to the Pydantic AI/Gemini 2.5 service with a prompt containing the user's onboarding preferences. The resulting plan is saved to the database. |
| TC-1.5.3 | Integration | Handle AI service failure. | 1. Mock the AI generation service to return a 500 error. 2. Run the initial plan generation flow. | The backend API returns a user-friendly error. The frontend dashboard displays a message like "Could not generate your plan, please try again later." instead of crashing. |

---

## 4. Test Data & Environment Requirements

*   **Email Testing Service:** An email sandbox service (like MailHog or a development-focused provider) is required to programmatically inspect verification emails during automated E2E tests.
*   **Test Users:** E2E tests must be fully automated, including the creation of a new, unique user for each test run to ensure test independence and avoid conflicts.
*   **AI Model Mocking:** For predictable and fast integration tests, the AI service will be mocked to return a static, valid plan structure. E2E tests will use the live service but may be subject to flakiness if not handled correctly; these tests should be designed to be resilient to variations in the generated plan content.
*   **Clean Database State:** Each test run, especially for E2E, must start with a clean database state to ensure consistency. This can be achieved via programmatic database resets.

---

## 5. Exit Criteria

Epic 1 is the most critical and has the strictest exit criteria. It is "Done" when:

1.  The full E2E "golden path" test (Signup -> Verify -> Onboard -> View Plan) is stable and passes consistently in the CI pipeline.
2.  All integration points (FE-BE, BE-DB, BE-Auth) have passing contract or integration tests.
3.  Unit test coverage for new backend logic is >= 85%.
4.  The Vercel deployment pipeline is green, and post-deployment smoke tests are passing.
5.  No "Critical" or "High" priority bugs related to authentication, data persistence, or the core user flow exist.

**Next Steps:** This document will be the blueprint for implementing the critical E2E tests using Playwright. The highest priority is a stable test for the entire new user journey.

# Test Design: Epic 2 - Adaptive Planning & Progress Logging

**Author:** Murat (Master Test Architect)
**Date:** 2025-12-10
**Epic:** Epic 2: Adaptive Planning & Progress Logging
**Risk Assessment:** High. The core feedback loop and AI adaptation are critical for user retention and product value. Failure here means the app is static and non-responsive to user needs.

---

## 1. Testing Strategy & Scope

This test design outlines the comprehensive quality validation strategy for Epic 2. The focus is on ensuring the reliability, accuracy, and performance of the progress logging and adaptive planning features. The strategy employs a multi-layered approach, emphasizing early and continuous testing.

### 1.1. Testing Pyramid

We will adopt a standard testing pyramid model to ensure a healthy and maintainable test suite:

*   **Unit Tests (60%):** Each new function in the frontend (React components, state management) and backend (FastAPI services, data models) will have extensive unit tests. This is our first line of defense against regressions.
*   **Integration Tests (30%):** We will test the connections between the frontend UI, backend APIs, and the Supabase database. This includes API contract testing to ensure frontend and backend are in sync.
*   **End-to-End (E2E) Tests (10%):** A small, critical set of E2E tests will simulate the full user journey, from logging a workout to receiving an adapted plan. These tests are the ultimate validation of the user experience.
*   **Performance Tests:** Backend API endpoints related to logging and plan generation will be benchmarked to ensure they meet latency requirements under expected load.
*   **Manual & Exploratory Testing:** The QA team and I will perform exploratory testing on new UI components to catch issues not covered by automated tests, focusing on usability and edge cases.

### 1.2. Tools & Frameworks

*   **Unit/Integration (Frontend):** Jest & React Testing Library
*   **Unit/Integration (Backend):** Pytest
*   **E2E Testing:** Playwright
*   **API Contract Testing:** Pact
*   **Performance Testing:** Locust
*   **CI/CD:** GitHub Actions (to run all automated test suites on every commit/PR)

---

## 2. Test Scenarios & Stories Coverage

This section maps high-level test scenarios to the user stories within Epic 2.

### Story 2.1: Workout Logging UI

*   **Scenario 2.1.1:** A user can successfully log a completed workout and rate its difficulty.
*   **Scenario 2.1.2:** A user can successfully log a skipped workout.
*   **Scenario 2.1.3:** The system correctly validates and rejects invalid logging data.
*   **Scenario 2.1.4:** The UI provides clear feedback to the user upon successful or failed logging.

### Story 2.2: Meal Logging UI

*   **Scenario 2.2.1:** A user can successfully log an eaten meal.
*   **Scenario 2.2.2:** A user can successfully log a skipped meal.
*   **Scenario 2.2.3:** The UI provides clear feedback to the user upon successful or failed logging.

### Story 2.3: AI-Driven Weekly Plan Adaptation Logic

*   **Scenario 2.3.1:** The AI correctly generates a more challenging workout plan when a user consistently marks workouts as "easy".
*   **Scenario 2.3.2:** The AI correctly generates a less challenging workout plan when a user consistently marks workouts as "hard" or skips them.
*   **Scenario 2.3.3:** The AI adapts the meal plan based on adherence (e.g., suggesting alternatives for frequently skipped meals).
*   **Scenario 2.3.4:** The plan generation process is resilient and handles missing or incomplete user data gracefully.
*   **Scenario 2.3.5:** The Vercel Cron Job successfully triggers the weekly replanning process at the scheduled time.

### Story 2.4: Dashboard Progress Visualization

*   **Scenario 2.4.1:** The workout streak on the dashboard correctly increments when a user logs workouts on consecutive days.
*   **Scenario 2.4.2:** The workout streak resets correctly when a user misses a day.
*   **Scenario 2.4.3:** The weight trend graph accurately reflects the user's logged weight data over the last 30 days.
*   **Scenario 2.4.4:** The dashboard displays an empty or placeholder state gracefully when no progress data is available.

### Story 2.5: New Plan Notification

*   **Scenario 2.5.1:** A user receives an in-app notification immediately after a new weekly plan is generated.
*   **Scenario 2.5.2:** Clicking the notification navigates the user directly to their new plan.
*   **Scenario 2.5.3:** Notifications are not shown if no new plan has been generated.

---

## 3. Detailed Test Cases (Examples)

This is not an exhaustive list but provides examples of specific, automatable test cases for each story.

### **Story 2.1: Workout Logging UI**

| Test Case ID | Type | Description | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-2.1.1 | E2E | Verify successful logging of a completed workout | 1. Log in as test user. 2. Navigate to dashboard. 3. Click on today's workout. 4. Mark first exercise as "Completed". 5. Select difficulty "3". 6. Click "Save". | A success toast appears. The API call to log the workout returns 200. The database shows the correct log entry. |
| TC-2.1.2 | Unit | Test the `difficulty-rating` component | 1. Render component with props. 2. Simulate user clicking on the 4th star. | The component's `onChange` handler is called with the value `4`. |
| TC-2.1.3 | Integration | API rejects out-of-range difficulty | 1. Send a POST request to `/log/workout` with `difficulty: 6`. | The API returns a 422 Unprocessable Entity error. |

### **Story 2.3: AI-Driven Weekly Plan Adaptation Logic**

| Test Case ID | Type | Description | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-2.3.1 | Integration | AI increases intensity for high performers | 1. Seed database with a user who completed all workouts with difficulty 1-2 for one week. 2. Trigger the `adapt-plan` backend service for this user. | The newly generated plan contains higher rep counts, heavier weights, or more advanced exercises compared to the previous week. |
| TC-2.3.2 | Integration | AI decreases intensity for low performers | 1. Seed database with a user who skipped 50% of workouts and rated others as difficulty 5. 2. Trigger the `adapt-plan` service. | The newly generated plan contains fewer exercises, lower intensity, or suggests a rest day. |
| TC-2.3.3 | Unit | Test `calculate_performance_score` function | 1. Call the function with a mix of completed, skipped, and rated workouts. | The function returns the correct, expected performance score as a float. |

### **Story 2.4: Dashboard Progress Visualization**

| Test Case ID | Type | Description | Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-2.4.1 | E2E | Verify workout streak updates correctly | 1. Log in. 2. Log a workout for today. 3. Verify streak is `1`. 4. Advance system time by 1 day. 5. Log another workout. | The dashboard UI updates to show a workout streak of `2`. |
| TC-2.4.2 | Integration | API endpoint for progress data | 1. Seed database with 15 days of weight data. 2. Call `GET /progress/summary`. | The API returns a JSON object with `workout_streak` and a `weight_trend` array containing 15 data points. |

---

## 4. Test Data & Environment Requirements

*   **Test Users:** A pool of test users with different states will be required in the staging environment:
    *   `new_user`: Just completed Epic 1, no logs.
    *   `consistent_user`: 1 month of consistent workout/meal logs.
    *   `inconsistent_user`: 1 month of sporadic logs and skipped activities.
    *   `power_user`: 3 months of data, high performance.
*   **AI Model Mocking:** For predictable unit and integration tests of the adaptation logic, the Pydantic AI/Gemini 2.5 service will be mocked to return deterministic plan outputs based on specific inputs. E2E tests will use the live AI service but with a smaller, controlled prompt to validate the integration.
*   **Staging Environment:** A dedicated, stable staging environment with a clean Supabase instance is mandatory for running E2E and exploratory tests.

---

## 5. Exit Criteria

Epic 2 can be considered "Done" and ready for release when:

1.  All new code has a unit test coverage of >= 80%.
2.  All integration and E2E tests for Scenarios 2.1 through 2.5 are passing in the CI pipeline.
3.  No "Critical" or "High" priority bugs have been found during the final round of exploratory testing.
4.  Performance benchmarks for the logging and plan generation APIs are within the acceptable limits (<500ms p95).

**Next Steps:** I will use this document to guide the `*atdd` (Acceptance Test-Driven Development) workflow, where I will generate the initial Playwright E2E test stubs based on these scenarios.

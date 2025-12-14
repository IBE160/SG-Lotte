# Story 2.2: Meal Logging UI

**Epic:** [2: Adaptive Planning & Progress Logging](tech-spec-epic-2.md)
**Author:** BIP
**Status:** review
**Date:** 2025-12-14

---

### Dev Agent Record

- Context Reference: `docs/sprint-artifacts/2-2-meal-logging-ui.context.xml`
- Completion Notes:
    - Implemented `MealLoggingCard.tsx` for logging meals.
    - Added UI for 'Eaten'/'Skipped' options and status display.
    - Integrated API call to `POST /api/v1/log/meal`.
    - Added comprehensive unit tests for `MealLoggingCard.tsx`.
    - Fixed existing frontend test failures in `OnboardingPage` and `SignUpPage` tests by updating test expectations and `jest.setup.js`.

---

### File List

- **New Files:**
    - `frontend/src/app/(dashboard)/meals/MealLoggingCard.tsx`
    - `frontend/src/app/(dashboard)/meals/__tests__/MealLoggingCard.test.tsx`
- **Modified Files:**
    - `frontend/jest.setup.js`
    - `frontend/src/app/(auth)/onboarding/__tests__/page.test.tsx`
    - `frontend/src/app/(auth)/signup/__tests__/page.test.tsx`
    - `docs/sprint-artifacts/2-2-meal-logging-ui.md`
    - `docs/sprint-artifacts/sprint-status.yaml`

---

### User Story

As a **user**, I want to **log my meals as 'Eaten' or 'Skipped' directly from my daily plan**, so I can track my adherence to the nutrition guide.

---

### Technical Implementation Notes

-   **Frontend Component:** This story involves the creation of the `MealLoggingCard` React component.
-   **Location:** The component will be displayed within the user's daily meal plan view, likely on the main dashboard.
-   **API Contract:** The component will send a `POST` request to the `/api/v1/log/meal` endpoint upon user interaction.
    -   **Request Body:**
        ```json
        {
          "meal_plan_id": <integer>,
          "meal_name": "<string>",
          "status": "Eaten" | "Skipped"
        }
        ```
    -   **Expected Response:** `201 Created`

---

### Tasks/Subtasks

- [x] Create the `MealLoggingCard` React component in the frontend.
- [x] Implement the UI for displaying options to mark meals as "Eaten" or "Skipped" within the `MealLoggingCard`.
- [x] Implement the logic within `MealLoggingCard` to call the `POST /api/v1/log/meal` endpoint with the correct `meal_plan_id`, `meal_name`, and `status` when a user selects "Eaten" or "Skipped".
- [x] Implement the UI update logic within `MealLoggingCard` to reflect the logged status after a successful API call.
- [x] Add unit tests for the `MealLoggingCard` component using Jest and React Testing Library to verify rendering and state changes.

---

### Acceptance Criteria

1.  **Given** I am viewing my daily meal plan on the dashboard,
    **When** I interact with a specific meal card (`MealLoggingCard`),
    **Then** I am presented with options to mark the meal as "Eaten" or "Skipped".

2.  **Given** I have selected either "Eaten" or "Skipped" for a meal,
    **Then** the frontend shall immediately call the `POST /api/v1/log/meal` endpoint with the correct `meal_plan_id`, `meal_name`, and `status`.

3.  **Given** the API call is successful,
    **Then** the UI on the meal card should update to reflect the logged status (e.g., displaying a checkmark for "Eaten" or greying out for "Skipped").

---

### Out of Scope

-   **Backend Implementation:** The creation of the API endpoint itself is not part of this story. This story only covers the frontend implementation that consumes the (to-be-created) endpoint.
-   **Workout Logging:** Any UI or logic related to logging workouts.
-   **AI Plan Adaptation:** This story does not trigger or involve any AI logic for adapting plans.
-   **Notifications:** No in-app or push notifications are included.
-   **Detailed Nutrition Tracking:** The UI will not include features for tracking calories, macros, or other detailed nutritional information.

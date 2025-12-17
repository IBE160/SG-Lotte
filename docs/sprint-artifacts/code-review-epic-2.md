# Ad-Hoc Code Review: Epic 2

**Reviewer:** Amelia (dev agent)
**Date:** 2025-12-17
**Focus:** General quality, requirements compliance, bugfixes.

## Overall Summary

Review of stories 2-1, 2-2, 2-3, 2-4, and 2-5. Several high-severity issues identified in the frontend related to data integrity. Backend logic is mostly sound but lacks some validation and contains debugging artifacts. One required frontend file is missing.

---

## Story 2-1: Workout Logging UI

**Outcome:** Changes Requested

### Key Findings:

-   **[High] Frontend:** `workout_plan_id` is hardcoded to `1` in `handleCompleteWorkout` and `handleSkipWorkout`. (file: `frontend/src/app/(dashboard)/dashboard/page.tsx`: lines 219, 273, 285).
-   **[High] Frontend:** Difficulty rating is not saved correctly. `handleCompleteWorkout` is called before the user can set the difficulty. (file: `frontend/src/app/(dashboard)/dashboard/page.tsx`: line 362).
-   **[Medium] Frontend:** Only the first exercise of a workout is logged. (file: `frontend/src/app/(dashboard)/dashboard/page.tsx`: lines 217, 283).
-   **[Medium] Backend:** No validation that `workout_plan_id` exists in the `workout_plans` table before creating a `workout_log`. (file: `backend/app/crud/workout.py`).
-   **[Low] Backend:** Debugging `print` statements in the `/log/workout` endpoint. (file: `backend/app/api/v1/endpoints/plans.py`: lines 253, 257, 260).

### Action Items:

-   `[ ]` **[High]** Fix hardcoded `workout_plan_id` in `dashboard/page.tsx` to use the correct plan ID.
-   `[ ]` **[High]** Refactor the workout completion flow in `dashboard/page.tsx` to ensure the difficulty rating is sent to the backend.
-   `[ ]` **[Medium]** Modify the frontend and backend to log all exercises in a workout, not just the first one.
-   `[ ]` **[Medium]** Add validation in `backend/app/crud/workout.py` to check for the existence of `workout_plan_id`.
-   `[ ]` **[Low]** Remove debugging statements from `backend/app/api/v1/endpoints/plans.py`.

---

## Story 2-2: Meal Logging UI

**Outcome:** Changes Requested

### Key Findings:

-   **[High] Frontend:** `meal_plan_id` is hardcoded to `1` in `MealLoggingCard.tsx`. (file: `frontend/src/app/(dashboard)/dashboard/page.tsx`: line 429).
-   **[Medium] Backend:** No validation that `meal_plan_id` exists in the `meal_plans` table before creating a `meal_log`. (file: `backend/app/crud/meal.py`).
-   **[Low] Backend:** Debugging `print` statements in the `/log/meal` endpoint. (file: `backend/app/api/v1/endpoints/plans.py`: line 221).
-   **[Low] Frontend:** API URL `/api/v1/plans/log/meal` is hardcoded in `MealLoggingCard.tsx`. (file: `frontend/src/app/(dashboard)/meals/MealLoggingCard.tsx`: line 34). It should use the `API_BASE_URL` from `@/lib/api`.

### Action Items:

-   `[ ]` **[High]** Fix hardcoded `meal_plan_id` in `dashboard/page.tsx` where `MealLoggingCard` is used.
-   `[ ]` **[Medium]** Add validation in `backend/app/crud/meal.py` to check for the existence of `meal_plan_id`.
-   `[ ]` **[Low]** Remove debugging statements from `backend/app/api/v1/endpoints/plans.py`.
-   `[ ]` **[Low]** Use `API_BASE_URL` for the fetch request in `MealLoggingCard.tsx`.

---

## Story 2-3: AI-Driven Weekly Plan Adaptation Logic

**Outcome:** Changes Requested

### Key Findings:

-   **[Medium] Backend:** The `adapt_ai_plan` function in `ai_plan_generator.py` does not have sufficient error handling for the AI response parsing. A malformed response from the AI will cause an unhandled exception. (file: `backend/app/services/ai_plan_generator.py`: line 220).
-   **[Low] Backend:** The user preferences are hardcoded in the `adapt_plan` function in `plans.py`. (file: `backend/app/api/v1/endpoints/plans.py`: line 144). These should be fetched from the user's profile.

### Action Items:

-   `[ ]` **[Medium]** Add more robust error handling and retry logic for the AI response parsing in `ai_plan_generator.py`.
-   `[ ]` **[Low]** Fetch user preferences from the database instead of using hardcoded values in `plans.py`.

---

## Story 2-4: Dashboard Progress Visualization

**Outcome:** Changes Requested

### Key Findings:

-   **[Medium] Backend:** In `get_workout_streak` in `progress_data_service.py`, the logic for calculating the streak is complex and may not be robust enough for all edge cases (e.g., workouts logged across midnight in different timezones). (file: `backend/app/services/progress_data_service.py`: lines 11-46).
-   **[Low] Backend:** In `get_weight_trend` in `progress_data_service.py`, any exception is caught silently, and an empty list is returned. This could hide underlying issues. It's better to log the error. (file: `backend/app/services/progress_data_service.py`: lines 54-57).

### Action Items:

-   `[ ]` **[Medium]** Simplify and improve the robustness of the workout streak calculation in `progress_data_service.py`.
-   `[ ]` **[Low]** Add logging for exceptions in the `get_weight_trend` function in `progress_data_service.py`.

---

## Story 2-5: New Plan Notification

**Outcome:** Blocked

### Key Findings:

-   **[High] Frontend:** The required file `frontend/src/components/NotificationIndicator.tsx` is missing.
-   **[Medium] Backend:** In `ai_plan_generator.py`, a notification is created on plan generation. However, it's not clear if a notification is also created when a fallback plan is used. The user should be notified in both cases. (file: `backend/app/services/ai_plan_generator.py`: lines 91 and 101).
-   **[Low] Backend:** `CRUDNotification` in `crud/notification.py` has generic exception handling.

### Action Items:

-   `[ ]` **[High]** Create the `NotificationIndicator.tsx` component.
-   `[ ]` **[Medium]** Ensure a notification is created in all cases of plan generation in `ai_plan_generator.py`.
-   `[ ]` **[Low]** Improve exception handling in `crud/notification.py`.

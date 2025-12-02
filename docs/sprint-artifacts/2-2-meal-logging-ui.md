# Story 2.2: Meal Logging UI

**Status:** drafted

**Epic:** Epic 2: Adaptive Planning & Progress Logging
**User:** Active User
**Value Statement:** As an active user, I want to easily log the consumption status of my planned meals, so the AI can track my adherence.

---

## 1. Requirements & Context

### 1.1. Requirements Summary

This story involves creating the user interface for logging meal consumption. Users should be able to mark meals as "Eaten" or "Skipped". This data is crucial for the AI to understand the user's adherence to the meal plan and make adjustments.

### 1.2. Source Documents

*   **Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-2.md#detailed-design`
*   **PRD:** `docs/PRD.md#fr-005-meal-logging`
*   **Epics:** `docs/epics.md#story-22-meal-logging-ui`
*   **Architecture:** `docs/architecture-2025-11-30.md#epic-to-architecture-mapping`
*   **Wireframes:** `mealplan_dark.html` (conceptual)

---

## 2. Acceptance Criteria

| # | Given | When | Then |
|---|---|---|---|
| 1 | I am viewing my daily meal plan | I interact with a meal | I can mark it as "Eaten" or "Skipped" |
| 2 | I have logged my meal | | This feedback is stored in the database |

---

## 3. Implementation Plan

### 3.1. Task Breakdown

| Task ID | Description | Est. Time |
|---|---|---|
| 2.2.1 | Create the UI for the meal logging feature based on the `mealplan_dark.html` concept. (AC: #1) | 4h |
| 2.2.2 | Implement the client-side logic to handle the user's interactions. (AC: #1) | 2h |
| 2.2.3 | Create a backend endpoint to store the meal log data. (AC: #2) | 2h |
| 2.2.4 | **Test:** Write unit tests for the UI components to mark meal status. (AC: #1) | 1.5h |
| 2.2.5 | **Test:** Write integration tests for the backend endpoint to store meal log data. (AC: #2) | 1.5h |
| 2.2.6 | **Test:** Write E2E tests for the complete meal logging flow. (AC: #1, #2) | 1.5h |

### 3.2. Developer Notes

#### Project Structure Notes
*   The UI components for meal logging should be created within the `frontend/src/app/(dashboard)/meals/` directory.
*   The backend endpoint to store meal log data should be added to `backend/app/api/v1/endpoints/plans.py`.

#### General Notes
*   The UI should be simple and quick to use, ensuring an efficient logging experience. Each logging action on the frontend triggers an API call to the backend's `POST /log/meal` endpoint, as detailed in the workflows. [Source: docs/sprint-artifacts/tech-spec-epic-2.md#workflows-and-sequencing]
*   To enhance user experience and perceived performance, consider implementing optimistic UI updates. The backend will persist the log data to the `meal_log` table, adhering to the defined data models. [Source: docs/sprint-artifacts/tech-spec-epic-2.md#data-models-and-contracts]

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

*   [ ] **AC #1:** User can mark a meal as "Eaten" or "Skipped" via the UI.
*   [ ] **AC #2:** Meal log data, including status, is correctly stored in the database.
*   [ ] **Testing:** All unit, integration, and E2E tests for the meal logging feature pass.

### 4.2. Review

*   **Completed by:**
*   **Date:**
*   **Outcome:**

---

## 5. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2025-12-02 | sm | Initial draft |

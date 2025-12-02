# Story 2.4: Dashboard Progress Visualization

**Epic:** Epic 2: Adaptive Planning & Progress Logging
**User:** Active User
**Value Statement:** As an active user, I want to see a clear visualization of my progress (e.g., workout streak, weight trend) on my dashboard, so I can stay motivated and informed.

---

## 1. Requirements & Context

### 1.1. Requirements Summary

This story is about adding a progress visualization section to the dashboard. This section should display the user's workout streak and a chart showing their weight trend over the last 30 days. This feature is intended to keep the user motivated and informed about their progress.

### 1.2. Source Documents

*   **Epics:** `docs/epics.md`
*   **Architecture:** `docs/architecture-2025-11-30.md`

---

## 2. Acceptance Criteria

| # | Given | When | Then |
|---|---|---|---|
| 1 | I am on the dashboard | I view the progress section | I see a summary of my workout streak |
| 2 | I am on the dashboard | I view the progress section | I see a visualization of my weight trend over the last 30 days |
| 3 | The progress section is displayed | | The visualization uses data from my logs |

---

## 3. Implementation Plan

### 3.1. Task Breakdown

| Task ID | Description | Est. Time |
|---|---|---|
| 2.4.1 | Create the backend endpoint to fetch aggregated progress data. | 3h |
| 2.4.2 | Implement the frontend UI for the progress visualization section. | 3h |
| 2.4.3 | Integrate the `Recharts` library to create the weight trend chart. | 4h |
| 2.4.4 | Write tests for the progress visualization feature. | 3h |

### 3.2. Developer Notes

*   The weight trend chart should be clear and easy to understand.
*   The workout streak should be prominently displayed.
*   Ensure the API endpoint for progress data is efficient and only returns the necessary data.

---

## 4. Validation

### 4.1. Validation Checklist

*   [ ] Workout streak is displayed on the dashboard.
*   [ ] Weight trend chart is displayed on the dashboard.
*   [ ] The displayed data is accurate.

### 4.2. Review

*   **Completed by:**
*   **Date:**
*   **Outcome:**

---

## 5. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2025-12-02 | sm | Initial draft |

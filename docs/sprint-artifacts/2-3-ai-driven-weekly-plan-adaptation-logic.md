# Story 2.3: AI-Driven Weekly Plan Adaptation Logic

**Status:** ready-for-dev

**Epic:** Epic 2: Adaptive Planning & Progress Logging
**User:** AI
**Value Statement:** As an AI, I want to automatically adapt a user's next week's workout and meal plan based on their logged progress and feedback, so the plan evolves to better meet their goals.

---

## 1. Requirements & Context

### 1.1. Requirements Summary

This story is about implementing the core AI logic for adapting the user's weekly plan. This will be a background process, triggered by a Vercel Cron Job, that uses the user's logged data to generate a new, more personalized plan for the upcoming week.

### 1.2. Source Documents

*   **Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-2.md#detailed-design`
*   **PRD:** `docs/PRD.md#fr-002-ai-driven-workout-plan-generation--adaptation`
*   **Epics:** `docs/epics.md#story-23-ai-driven-weekly-plan-adaptation-logic`
*   **Architecture:** `docs/architecture-2025-11-30.md#adr-001-background-jobasync-processing-strategy`

---

## 2. Acceptance Criteria

| # | Given | When | Then |
|---|---|---|---|
| 1 | The Vercel Cron Job is configured | the scheduled time is reached | the backend adaptation process is triggered |
| 2 | The end of the current week | The Vercel Cron Job triggers the backend | The AI processes the user's logged workouts, meals, and difficulty ratings |
| 3 | The AI has processed the user's data | | The AI generates a new, adapted workout and meal plan for the upcoming week |
| 4 | A new plan has been generated | | The new plans are stored in the database |

---

## 3. Implementation Plan

### 3.1. Task Breakdown

| Task ID | Description | Est. Time |
|---|---|---|
| 2.3.1 | Create the Vercel Cron Job to trigger the weekly plan adaptation. (AC: #1) | 1h |
| 2.3.2 | Implement the backend endpoint to be called by the cron job. (AC: #1) | 1h |
| 2.3.3 | Implement the logic to fetch the user's logged data from the database. (AC: #2) | 2h |
| 2.3.4 | Implement the AI logic to process the data and generate a new plan. (AC: #2, #3) | 6h |
| 2.3.5 | Implement the logic to store the new plan in the database. (AC: #4) | 2h |
| 2.3.6 | **Test:** Write unit tests for the logic to fetch and process user's logged data. (AC: #2) | 2h |
| 2.3.7 | **Test:** Write unit tests for the AI logic to process data and generate new plans, including prompt engineering validation. (AC: #3) | 2h |
| 2.3.8 | **Test:** Write integration tests for the logic to store new plans in the database. (AC: #4) | 2h |
| 2.3.9 | **Test:** Write E2E tests for the Vercel Cron Job triggering the adaptation process and verifying plan generation/storage. (AC: #1, #2, #3, #4) | 2h |

### 3.2. Developer Notes

#### Project Structure Notes
*   The backend endpoint for the cron job should be added to `backend/app/api/v1/endpoints/plans.py`.
*   The AI logic for processing data and generating plans should reside in `backend/app/services/ai_plan_generator.py` or a new dedicated service.

#### General Notes
*   This is a backend-heavy story. The weekly plan adaptation is triggered by a Vercel Cron Job making a request to a protected `POST /plans/trigger-adaptation` endpoint, as detailed in the workflows. [Source: docs/sprint-artifacts/tech-spec-epic-2.md#workflows-and-sequencing]
*   Effective AI prompt engineering will be critical for this feature's success. The prompt should meticulously include the user's original plan, their adherence and difficulty feedback from the logs, and a clear request for a new, adapted plan for the upcoming week. This aligns with the AI service's operational guidelines. [Source: docs/sprint-artifacts/tech-spec-epic-2.md#workflows-and-sequencing]
*   The process should be robust and handle potential errors gracefully, implementing retry mechanisms with exponential backoff for OpenAI API calls to ensure system reliability and fault tolerance. [Source: docs/sprint-artifacts/tech-spec-epic-2.md#reliability-availability]

---

## Dev Agent Record

*   **Context Reference:**
    *   docs/sprint-artifacts/2-3-ai-driven-weekly-plan-adaptation-logic.context.xml
*   **Agent Model Used:**
*   **Debug Log References:**
*   **Completion Notes List:**
*   **File List:**

---

## 4. Validation

### 4.1. Validation Checklist

*   [ ] **AC #1:** The Vercel Cron Job is correctly configured and triggers the backend adaptation process.
*   [ ] **AC #2:** The AI successfully processes the user's logged workouts, meals, and difficulty ratings from the previous week.
*   [ ] **AC #3:** The AI generates a new, adapted workout and meal plan for the upcoming week.
*   [ ] **AC #4:** The new, adapted plans are correctly stored in the database.
*   [ ] **Testing:** All unit, integration, and E2E tests for the plan adaptation logic pass.

### 4.2. Review

*   **Completed by:**
*   **Date:**
*   **Outcome:**

---

## 5. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2025-12-02 | sm | Initial draft |

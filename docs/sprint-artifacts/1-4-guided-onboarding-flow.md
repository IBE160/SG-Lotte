# Story 1.4: Guided Onboarding Flow

**Status:** drafted

**Epic:** Epic 1: First Plan & Foundation
**User:** New User
**Value Statement:** As a new user who has just verified my email, I want to complete a guided 5-step onboarding process, so the AI can gather my preferences and generate my first personalized plan.

---

## 1. Requirements & Context

### 1.1. Requirements Summary

This story covers the implementation of a 5-step onboarding process to gather user preferences. This is a critical step for the AI to generate a personalized plan. The UI for these steps should be based on the provided wireframes (`onboarding1_dark.html` to `onboarding5_dark.html`).

### 1.2. Source Documents

*   **Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-1.md#detailed-design`
*   **PRD:** `docs/PRD.md#fr-001-user-authentication--profile-management`
*   **Epics:** `docs/epics.md#story-14-guided-onboarding-flow`
*   **Architecture:** `docs/architecture-2025-11-30.md#epic-to-architecture-mapping`
*   **Wireframes:** `onboarding1_dark.html` to `onboarding5_dark.html` (Note: these files are not in the project, but are referenced in the epics file. The developer will need to create the UI based on the descriptions in the epics file).

---

## 2. Acceptance Criteria

| # | Given | When | Then |
|---|---|---|---|
| 1 | I have verified my email | I start the onboarding | I am presented with a sequence of 5 UI screens |
| 2 | I am in the onboarding process | I make selections on each screen | I can select my primary fitness goal, dietary preferences, and fitness persona |
| 3 | I have completed the onboarding process | | All my preferences are securely saved to my user profile |

---

## 3. Implementation Plan

### 3.1. Task Breakdown

| Task ID | Description | Est. Time |
|---|---|---|
| 1.4.1 | Create the UI for the 5-step onboarding flow based on the wireframe concepts. (AC: #1) | 8h |
| 1.4.2 | Implement state management to handle the user's selections across the 5 steps. (AC: #2) | 3h |
| 1.4.3 | Create a backend endpoint to save the user's preferences to their profile. (AC: #3) | 2h |
| 1.4.4 | Implement the client-side logic to send the preferences to the backend upon completion of the flow. (AC: #3) | 2h |
| 1.4.5 | **Test:** Write unit tests for the UI components of the 5-step onboarding flow. (AC: #1) | 1.5h |
| 1.4.6 | **Test:** Write unit tests for the state management logic to handle user selections. (AC: #2) | 1.5h |
| 1.4.7 | **Test:** Write integration tests for the backend endpoint to save user preferences. (AC: #3) | 1.5h |
| 1.4.8 | **Test:** Write E2E tests for the complete onboarding flow, verifying preference saving. (AC: #3) | 1.5h |

### 3.2. Developer Notes

#### Project Structure Notes
*   The UI components for the onboarding flow should be created within the `frontend/src/app/(auth)/` directory.
*   The backend endpoint to save user preferences should be added to `backend/app/api/v1/endpoints/users.py`.

#### General Notes
*   The wireframes are conceptual. The developer will need to implement the UI using the project's design system and components. The goal is to collect the user's fitness goal, dietary preferences, and fitness persona. [Source: docs/sprint-artifacts/tech-spec-epic-1.md#detailed-design]
*   The onboarding flow should be intuitive and easy to a use. Upon completion, the frontend sends these preferences to the backend's `POST /users/preferences` endpoint. [Source: docs/sprint-artifacts/tech-spec-epic-1.md#workflows-and-sequencing]
*   Ensure that the user's preferences are saved correctly to the `users` table in the database and can be retrieved for the AI plan generation. [Source: docs/sprint-artifacts/tech-spec-epic-1.md#data-models-and-contracts]

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

*   [ ] **AC #1:** The 5-step onboarding flow UI is correctly implemented and displayed sequentially.
*   [ ] **AC #2:** User can successfully make selections for fitness goal, dietary preferences, and fitness persona on each screen.
*   [ ] **AC #3:** All user preferences are securely saved to the user's profile upon completion of the onboarding flow.
*   [ ] **Testing:** All unit, integration, and E2E tests for the onboarding flow pass.

### 4.2. Review

*   **Completed by:**
*   **Date:**
*   **Outcome:**

---

## 5. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2025-12-02 | sm | Initial draft |

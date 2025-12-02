# Story 1.4: Guided Onboarding Flow

**Epic:** Epic 1: First Plan & Foundation
**User:** New User
**Value Statement:** As a new user who has just verified my email, I want to complete a guided 5-step onboarding process, so the AI can gather my preferences and generate my first personalized plan.

---

## 1. Requirements & Context

### 1.1. Requirements Summary

This story covers the implementation of a 5-step onboarding process to gather user preferences. This is a critical step for the AI to generate a personalized plan. The UI for these steps should be based on the provided wireframes (`onboarding1_dark.html` to `onboarding5_dark.html`).

### 1.2. Source Documents

*   **Epics:** `docs/epics.md`
*   **Architecture:** `docs/architecture-2025-11-30.md`
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
| 1.4.1 | Create the UI for the 5-step onboarding flow based on the wireframe concepts. | 8h |
| 1.4.2 | Implement state management to handle the user's selections across the 5 steps. | 3h |
| 1.4.3 | Create a backend endpoint to save the user's preferences to their profile. | 2h |
| 1.4.4 | Implement the client-side logic to send the preferences to the backend upon completion of the flow. | 2h |
| 1.4.5 | Write tests for the onboarding flow. | 3h |

### 3.2. Developer Notes

*   The wireframes are conceptual. The developer will need to implement the UI using the project's design system and components.
*   The onboarding flow should be intuitive and easy to use.
*   Ensure that the user's preferences are saved correctly and can be retrieved for the AI plan generation.

---

## 4. Validation

### 4.1. Validation Checklist

*   [ ] 5-step onboarding flow is implemented.
*   [ ] User can make selections on each step.
*   [ ] User preferences are saved to the user's profile.

### 4.2. Review

*   **Completed by:**
*   **Date:**
*   **Outcome:**

---

## 5. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2025-12-02 | sm | Initial draft |

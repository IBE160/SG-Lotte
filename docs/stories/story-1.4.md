### Story 1.4: Guided Onboarding Flow
Status: drafted

As a new user who has just verified my email,
I want to complete a guided 5-step onboarding process,
So the AI can gather my preferences and generate my first personalized plan.

**Acceptance Criteria:** [Source: docs/sprint-artifacts/tech-spec-epic-1.md]

*   **Given** I have verified my email
*   **When** I start the onboarding
*   **Then** I am presented with a sequence of 5 UI screens (`onboarding1_dark.html` to `onboarding5_dark.html`)
*   **And** I can select my primary fitness goal, dietary preferences, and fitness persona
*   **And** all my preferences are securely saved to my user profile

**Prerequisites:** Story 1.3

**Tasks:**
*   **Task 1.4.1:** Develop the 5 UI screens for the onboarding flow. (AC: 1.4.1)
*   **Task 1.4.2:** Implement the preference selection UI components. (AC: 1.4.2)
*   **Task 1.4.3:** Create the backend API endpoint to save user preferences. (AC: 1.4.3)
*   **Testing Subtasks:**
    *   Write component tests for each of the 5 onboarding screens. (AC: 1.4.1)
    *   Write an integration test for the API endpoint that saves user preferences. (AC: 1.4.3)
    *   Write an E2E test for the entire onboarding flow. (AC: 1.4.1, 1.4.2, 1.4.3)

**Technical Notes:**
Frontend development for the onboarding screens, API endpoints to save user preferences.

**Architecture patterns and constraints:**
*   Frontend UI for guided onboarding flow.
*   Backend API for saving user preferences.

**References:**
*   [Source: docs/epics.md]
*   [Source: docs/sprint-artifacts/tech-spec-epic-1.md]
*   [Source: docs/architecture-2025-11-30.md]
*   [Source: onboarding1_dark.html - Assumed UI template]
*   [Source: onboarding2_dark.html - Assumed UI template]
*   [Source: onboarding3_dark.html - Assumed UI template]
*   [Source: onboarding4_dark.html - Assumed UI template]
*   [Source: onboarding5_dark.html - Assumed UI template]

---

### Dev Agent Record
*   **Context Reference:** Correcting story quality based on validation report.
*   **Agent Model Used:** Gemini
*   **Prompt:** Fix validation report issues for story-1.4.md.
*   **Output:** Updated story-1.4.md with missing sections and citations.
*   **Comments:** Added Status, AC Source, Tasks, Architecture patterns and constraints, References, Dev Agent Record, and Change Log.
*   **Completion Notes List:**
    *   [ ] Note 1
*   **File List:**
    *   [ ] `docs/stories/story-1.4.md` (MODIFIED)

---

### Change Log
*   **2025-12-02:** Added Status, AC Source, Tasks, Architecture patterns and constraints, References, Dev Agent Record, and Change Log sections based on validation report.

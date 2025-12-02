### Story 1.4: Guided Onboarding Flow
Status: Backlog

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
*   **AC 1.4.1:** Develop 5 onboarding UI screens.
*   **AC 1.4.2:** Implement preference selection UI for fitness goal, dietary preference, and fitness persona.
*   **AC 1.4.3:** Create API endpoint to save user preferences.
*   **Testing:** E2E test onboarding flow and API for saving preferences.

**Technical Notes:**
Frontend development for the onboarding screens, API endpoints to save user preferences.

**Architecture patterns and constraints:**
*   Frontend UI for guided onboarding flow.
*   Backend API for saving user preferences.

**References:**
*   [Source: docs/epics.md]
*   [Source: docs/sprint-artifacts/tech-spec-epic-1.md]
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

---

### Change Log
*   **2025-12-02:** Added Status, AC Source, Tasks, Architecture patterns and constraints, References, Dev Agent Record, and Change Log sections based on validation report.

### Story 1.4: Guided Onboarding Flow

As a new user who has just verified my email,
I want to complete a guided 5-step onboarding process,
So the AI can gather my preferences and generate my first personalized plan.

**Acceptance Criteria:**

**Given** I have verified my email
**When** I start the onboarding
**Then** I am presented with a sequence of 5 UI screens (`onboarding1_dark.html` to `onboarding5_dark.html`)
**And** I can select my primary fitness goal, dietary preferences, and fitness persona
**And** all my preferences are securely saved to my user profile

**Prerequisites:** Story 1.3

**Technical Notes:** Frontend development for the onboarding screens, API endpoints to save user preferences.

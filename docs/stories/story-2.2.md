### Story 2.2: Meal Logging UI

As an active user,
I want to easily log the consumption status of my planned meals,
So the AI can track my adherence.

**Acceptance Criteria:**

**Given** I am viewing my daily meal plan
**When** I interact with a meal
**Then** I can mark it as "Eaten" or "Skipped"
**And** this feedback is stored in the database

**Prerequisites:** Epic 1 completion.

**Technical Notes:** Frontend UI implementation based on `mealplan_dark.html`, API endpoint for logging meal status.

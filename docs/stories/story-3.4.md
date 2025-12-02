### Story 3.4: Plan Interruption Management

As an engaged user,
I want to be able to pause my plan for a period (e.g., vacation) or indicate I am unwell,
So the AI can adjust my plans accordingly.

**Acceptance Criteria:**

**Given** I am on the settings page
**When** I select "Pause Plan"
**Then** I am presented with options to specify a start and end date for the pause
**And** my plans are temporarily paused, and no new plans are generated during this period
**When** I select "Feeling Unwell"
**Then** I am presented with options to reduce intensity for a duration
**And** the AI adjusts future plans with a recovery-focused approach

**Prerequisites:** Epic 2 completion.

**Technical Notes:** Frontend UI based on `plan_interruptions_dark.html`, API endpoints to record plan interruptions and influence AI plan generation.

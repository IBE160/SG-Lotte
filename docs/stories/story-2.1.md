### Story 2.1: Workout Logging UI

As an active user,
I want to easily log the completion status and perceived difficulty of my planned workouts,
So the AI can track my progress.

**Acceptance Criteria:**

**Given** I am viewing my daily workout plan
**When** I interact with a workout
**Then** I can mark it as "Completed" or "Skipped"
**And** I can rate the difficulty on a 1-5 scale for completed workouts
**And** this feedback is stored in the database

**Prerequisites:** Epic 1 completion.

**Technical Notes:** Frontend UI implementation based on `workoutplan_dark.html`, API endpoint for logging workout status.

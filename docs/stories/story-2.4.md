### Story 2.4: Dashboard Progress Visualization

As an active user,
I want to see a clear visualization of my progress (e.g., workout streak, weight trend) on my dashboard,
So I can stay motivated and informed.

**Acceptance Criteria:**

**Given** I am on the dashboard
**When** I view the progress section
**Then** I see a summary of my workout streak
**And** I see a visualization of my weight trend over the last 30 days
**And** this visualization uses data from my logs

**Prerequisites:** Story 2.1, Story 2.2.

**Technical Notes:** Frontend development using `Recharts` for graphs, API endpoint to fetch aggregated progress data.

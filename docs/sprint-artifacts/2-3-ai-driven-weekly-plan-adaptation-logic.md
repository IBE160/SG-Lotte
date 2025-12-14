# Story 2-3: AI-Driven Weekly Plan Adaptation Logic

**User Story:** As a user, I want the application to automatically adjust my workout and meal plan for the upcoming week based on my logged performance and feedback, so that my plan remains challenging and aligned with my goals.

**Acceptance Criteria:**

1.  **Performance Analysis:**
    *   The system analyzes the last 7 days of workout logs to determine adherence and performance trends.
    *   It compares logged sets/reps/weights against the prescribed plan to identify if exercises were easier or harder than expected.
    *   The system analyzes the last 7 days of meal logs for calorie and macronutrient consistency.

2.  **Adaptation Logic:**
    *   **Workout Progression:**
        *   If the user consistently meets or exceeds targets for a specific exercise, the system increases the weight, reps, or sets for the next week (Progressive Overload).
        *   If the user consistently fails to meet targets, the system suggests a deload or an alternative exercise.
    *   **Calorie Adjustment:**
        *   Based on body weight trends and goals (lose, maintain, gain), the system adjusts the daily calorie target.
        *   If weight loss is stalling, calorie targets are slightly decreased.
        *   If muscle gain is the goal and weight is stagnant, calorie targets are slightly increased.

3.  **Plan Generation:**
    *   A new, adapted plan for the upcoming week is generated automatically at the end of the current week (e.g., Sunday evening).
    *   The user receives a notification that their new plan is ready.
    *   The user can view the upcoming week's plan, including the specific changes and the rationale behind them (e.g., "Increased bench press weight because you completed all sets and reps easily last week").

**Dependencies:**

*   Story 2-1: Workout Logging UI
*   Story 2-2: Meal Logging UI

**Estimate:** 13 Story Points

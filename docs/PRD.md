# ibe160 - Product Requirements Document

**Author:** BIP
**Date:** søndag 16. november 2025
**Version:** 1.0

---

## Executive Summary

To develop a comprehensive, AI-assisted web application that automatically generates and adjusts personalized workout and meal plans, promoting long-term health habits and consistency.

### What Makes This Special

The core "magic" is the AI-driven personalization and dynamic adaptation of fitness and meal plans, making healthy living accessible, consistent, and highly engaging through intelligent onboarding, flexible plan adjustments, and user control.

---

## Project Classification

**Technical Type:** web_app
**Domain:** general
**Complexity:** low

This is a greenfield project, building a new web application in the general fitness and nutrition domain. It leverages AI/ML as a core differentiator.

---

## Success Criteria

### Definitions:
*   **Active User:** A user who has logged in and performed at least one activity (logged a workout or a meal) in the last 7 days.

### User Engagement & Satisfaction:
*   **High Retention:** >40% of new users are still "Active Users" 3 months after signup.
*   **Consistent Use:** "Active Users" log an average of at least 4 activities per week over a 30-day period.
*   **Positive Feedback:** Achieve an average user rating of 4.5/5 stars or higher across all public feedback channels (app stores, review sites).
*   **Effective Onboarding:** <10% of new users fail to complete the onboarding process and generate their first plan.

### User Health & Fitness Outcomes:
*   **Goal Achievement:** >60% of users who set a specific, time-bound goal (e.g., "lose 5kg in 2 months") mark it as "achieved" in the app.
*   **Improved Consistency:** A 20% increase in the average number of logged activities per week for users who have been "Active Users" for more than one month.
*   **Positive Subjective Feedback:** A quarterly in-app survey shows >75% of "Active Users" report positive changes in their health and well-being.

### Business & Technical Metrics:
*   **High Plan Acceptance:** >80% of AI-generated plans are accepted by users with no more than one manual modification.
*   **Low AI Fallback Rate:** <5% of plan generation requests result in a fallback to a pre-made template due to AI errors or timeouts.
*   **Sustainable API Costs:** AI API costs per "Active User" are maintained below a formally defined and monitored threshold, to be determined based on pricing strategy.

---

## Product Scope

### MVP - Minimum Viable Product (Core Loop Focus)
*   **Core User Profile:** Simplified sign-up with essential data: fitness goals, dietary preferences. (Defer detailed body metrics and allergies to a "Profile Completion" prompt later).
*   **AI Workout Planner:** Generates weekly workout routines.
*   **AI Meal Planner:** Generates weekly meal plans.
*   **Weekly Replanning:** Core logic to adjust plans for the next week based on completion.
*   **Basic Progress Logging:** Simple logging of completed workouts and meals (e.g., checkboxes).
*   **Core Dashboard:** Displays the current week's plan only. (Defer history and detailed visualization).
*   **Structured AI Output (JSON):** (Technical requirement, not a user-facing feature).

### Growth Features (Post-MVP)
*   **Enhanced User Profile:** Add detailed body metrics, allergies, and other preferences.
*   **Advanced Progress Tracking:** Detailed logging of sets, reps, weights, calories, etc. with historical charts (Recharts).
*   **Full Dashboard Overview:** Add history, trends, and detailed visualizations to the dashboard.
*   **Basic Offline Support:** Cache the current week's plan and allow offline logging.
*   **Interactive Chat Assistant:** A guided chat for specific questions about workouts, nutrition, and injuries.
*   **Gamification:** Reward system with achievements and milestones.
*   **Calendar Integration:** A calendar view for planning and tracking.

### Vision (Future)
*   **Conversational AI Coach:** A full-fledged, proactive AI assistant that provides motivational messages, answers open-ended questions, and acts as a true virtual coach.
*   **Wearable & App Integration:** Sync data with Apple Health, Google Fit, smartwatches, etc.
*   **Social & Community Features:** Share progress, participate in challenges, and connect with other users.
*   **Advanced Analytics & Export:** In-depth data analysis and export options (CSV/PDF).

---

## Functional Requirements

### FR-001: User Authentication & Profile Management
*   **Description:** The system shall allow users to securely register, log in, and manage their core profile information.
*   **User Value:** Enables personalized experience and secure access.
*   **Acceptance Criteria:**
    *   Users can sign up with email and password, and must verify their email.
    *   Users can log in, log out, and reset their password.
    *   Users can change their email address (with verification).
    *   Users can delete their account (with confirmation).
    *   Users can edit their primary fitness goal and core dietary preference.
*   **Magic Thread:** Secure foundation for a personalized, evolving health journey.

### FR-002: AI-Driven Workout Plan Generation & Adaptation
*   **Description:** The system shall automatically generate and adapt weekly workout plans based on user goals, logged progress, and difficulty ratings.
*   **User Value:** Provides personalized, evolving workout guidance without manual effort.
*   **Acceptance Criteria:**
    *   AI generates a "diagnostic" first-week plan during onboarding.
    *   AI automatically generates new weekly plans based on previous week's logged activities and difficulty ratings.
    *   Users can request simple adjustments to their current plan (e.g., "make it easier/harder").
    *   Plans are provided in a structured JSON output.
*   **Magic Thread:** Dynamic adaptation, making workout plans truly personal and responsive to progress.

### FR-003: AI-Driven Meal Plan Generation & Adaptation
*   **Description:** The system shall automatically generate and adapt weekly meal plans based on user goals, dietary preferences, and logged meal consumption.
*   **User Value:** Provides personalized, evolving meal guidance without manual effort.
*   **Acceptance Criteria:**
    *   AI generates a "diagnostic" first-week plan during onboarding.
    *   AI automatically generates new weekly plans based on previous week's logged meals and fitness goal progress.
    *   Users can request simple adjustments to their current plan (e.g., "more variety").
    *   Plans are provided in a structured JSON output.
*   **Magic Thread:** Effortless, personalized nutrition that adapts to user habits and goals.

### FR-004: Workout Logging
*   **Description:** The system shall allow users to easily log the completion status and perceived difficulty of their planned workouts.
*   **User Value:** Provides essential feedback to the AI for adaptation and a sense of accomplishment for the user.
*   **Acceptance Criteria:**
    *   Users can mark a planned workout as "Completed" or "Skipped".
    *   Users can rate the difficulty of a completed workout (e.g., 1-5 scale).
*   **Magic Thread:** Simple, effective feedback loop for continuous AI learning and plan refinement.

### FR-005: Meal Logging
*   **Description:** The system shall allow users to easily log the consumption status of their planned meals.
*   **User Value:** Provides essential feedback to the AI for adaptation and helps users track adherence to their meal plan.
*   **Acceptance Criteria:**
    *   Users can mark a planned meal as "Eaten" or "Skipped".
*   **Magic Thread:** Simple, low-friction feedback loop for AI-driven meal plan optimization.

### FR-006: Dashboard Overview
*   **Description:** The system shall provide a clear, minimalist dashboard displaying the user's current weekly workout and meal plans.
*   **User Value:** Centralized, easy-to-understand view of the current week's plan and immediate progress.
*   **Acceptance Criteria:**
    *   Dashboard displays the current week's workout plan.
    *   Dashboard displays the current week's meal plan.
    *   Dashboard visually indicates completed/skipped workouts and meals.
*   **Magic Thread:** Clear, actionable guidance at a glance, making healthy habits easy to follow.

### FR-007: Notifications
*   **Description:** The system shall notify users when their new weekly plans are ready.
*   **User Value:** Keeps users engaged and informed, ensuring they always have an up-to-date plan.
*   **Acceptance Criteria:**
    *   Users receive an in-app notification when new weekly plans are generated.
*   **Magic Thread:** Proactive, timely guidance that keeps the user on track.

---

## Non-Functional Requirements

### Performance
*   **Why it matters:** Ensures a responsive and smooth user experience, especially for core interactions like plan generation and logging.
*   **Measurable Criteria:**
    *   Response time for non-AI queries shall be less than 500ms.
    *   The system shall support at least 100 concurrent active users without degradation in performance.

### Security
*   **Why it matters:** The system handles sensitive personal and health-related data, requiring robust protection against unauthorized access and data breaches.
*   **Measurable Criteria:**
    *   All data in transit (HTTPS) and at rest (database encryption) shall be encrypted.
    *   Access to user data shall be restricted by Row Level Security (RLS) policies.
    *   User authentication shall be handled by Supabase Auth using JWT tokens.
    *   The system shall comply with GDPR principles for data privacy and retention.

### Scalability
*   **Why it matters:** To accommodate future user growth without requiring a complete re-architecture, ensuring the platform can expand with its user base.
*   **Measurable Criteria:**
    *   The database (PostgreSQL on Supabase) shall be capable of scaling to handle increased data volume and user load.
    *   The backend (FastAPI) shall be deployable in a horizontally scalable manner.

### Reliability (AI Integration)
*   **Why it matters:** To ensure consistent and dependable generation of workout and meal plans, which is core to the product's value proposition.
*   **Measurable Criteria:**
    *   The system shall implement retry mechanisms with exponential backoff for OpenAI API calls.
    *   The system shall utilize caching for OpenAI API responses to reduce latency and dependency.
    *   The system shall have fallback mechanisms (e.g., default plan templates) in case of OpenAI API unavailability.

---

## Implementation Planning

### Epic Breakdown Required

Requirements must be decomposed into epics and bite-sized stories (200k context limit).

**Next Step:** Run `workflow epics-stories` to create the implementation breakdown.

---

## References

- Product Brief: docs/Fase-1-analysis/product-brief-AI Fitness & Meal Planner-søndag 9. november 2025.md
- Research: docs/Fase-1-analysis/research.md, docs/Fase-1-analysis/brainstorming-session-results-søndag 9. november 2025.md, docs/Fase-1-analysis/brainstorming-session-results-søndag 2. november 2025.md

---

## Product Magic Summary
The essence of the AI Fitness & Meal Planner is its ability to provide a truly personalized and adaptive health journey. This PRD is designed to deliver that magic by focusing the MVP on the core AI-driven planning and feedback loop. Every functional requirement, from the simplified onboarding to the automatic weekly replanning, is a step towards making healthy living effortless, intelligent, and deeply personal for our users.

---

## Next Steps

1.  **Epic & Story Breakdown (Required):** The next critical step is to run the `create-epics-and-stories` workflow. This will decompose the functional requirements in this PRD into implementable epics and user stories, which will form the backlog for development.
2.  **UX Design (If UI exists):** Once the epics and stories are defined, the `ux-design` workflow can be run to create detailed wireframes and mockups for the user interface.
3.  **Architecture:** The `create-architecture` workflow can then be used to define the detailed technical architecture for the system.

---

_This PRD captures the essence of ibe160 - The essence of the AI Fitness & Meal Planner is its ability to provide a truly personalized and adaptive health journey. This PRD is designed to deliver that magic by focusing the MVP on the core AI-driven planning and feedback loop. Every functional requirement, from the simplified onboarding to the automatic weekly replanning, is a step towards making healthy living effortless, intelligent, and deeply personal for our users._

_Created through collaborative discovery between BIP and AI facilitator._
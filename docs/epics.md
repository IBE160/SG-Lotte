# ibe160 - Epic & Story Breakdown (Revision 2)

**Author:** BIP
**Date:** 2025-11-29
**Project Level:** Medium
**Target Scale:** Growth

---

## Overview

This document provides the complete epic and story breakdown for ibe160, decomposing the requirements from the [PRD](./PRD.md) into implementable stories that are aligned with the high-fidelity UX designs.

### Epic 1: First Plan & Foundation
*   **Value Statement:** As a new user, I can sign up, set my core goals, and get my first personalized workout and meal plan within minutes, so I can start my health journey immediately.
*   **Scope:**
    *   Core technical setup (Next.js, FastAPI, Supabase).
    *   User registration, login, and authentication.
    *   A 5-step, guided onboarding flow.
    *   Generation of the initial "diagnostic" plan.
    *   A detailed dashboard displaying the first week's plan and key information.
*   **Out of Scope:** Advanced profile details, historical data, manual plan adjustments.
*   **Sequencing:** Must be the first epic.

### Epic 2: Adaptive Planning & Progress Logging
*   **Value Statement:** As an active user, I can log my progress with simple clicks, and the app will automatically adapt my next week's plan to my performance, so my plan evolves with me.
*   **Scope:**
    *   Detailed logging for workouts (sets, reps, weights) and meals (checkboxes).
    *   The core AI logic for automatic weekly replanning.
    *   In-app notifications for new plans.
    *   A view to see historical progress.
*   **Out of Scope:** Logging unplanned activities.
*   **Sequencing:** Follows Epic 1.

### Epic 3: User Control & Personalization
*   **Value Statement:** As an engaged user, I can manage my account, view my achievements, and handle interruptions to my plan, so the application feels tailored to my life.
*   **Scope:**
    *   A comprehensive user profile page.
    *   A detailed settings page for app and notification preferences.
    *   UI for pausing or adjusting plans due to vacation or illness.
*   **Out of Scope:** Complex adjustments (e.g., ingredient swapping).
*   **Sequencing:** Follows Epic 2.

---

### Epic 1: First Plan & Foundation

As a new user, I can sign up, set my core goals, and get my first personalized workout and meal plan within minutes, so I can start my health journey immediately.

**Note on Foundational Stories:** Initial stories (1.1, 1.2) are horizontal to establish core infrastructure.

### Story 1.1: Backend & Database Setup
As a developer, I want the FastAPI backend and Supabase database to be set up and connected, so that I can build API endpoints and data models.
**AC:** FastAPI app created; Supabase project connected; Alembic migrations configured.

### Story 1.2: Frontend Setup & Deployment Pipeline
As a developer, I want the Next.js frontend to be set up and connected to a Vercel deployment pipeline, so that I can build UI components and have continuous deployment.
**AC:** Next.js app created with TypeScript/Tailwind; Vercel CI/CD connected; Basic API call to backend works.

### Story 1.3: User Registration & Email Verification
As a new user, I want to sign up with my email and password and verify my email, so that I can create a secure account.
**AC:** Account created; Verification email sent; Cannot log in until verified.
**Ref:** `onboarding1_dark.html` (Implied)

### Story 1.4: Onboarding Flow UI & Logic
As a new user, I want to complete a guided 5-step onboarding process after verifying my email, so the AI can generate my first plan.
**AC:** Implements the full 5-step flow from the wireframes; User can select goals, diet, and persona; Preferences are saved to their profile.
**Ref:** `onboarding1_dark.html` to `onboarding5_dark.html`

### Story 1.5: Dashboard UI - Layout & Navigation
As a user, I want to see a clean, navigable dashboard with a header and primary navigation, so I can easily access all parts of the app.
**AC:** Implements the main layout, header with logo, and navigation links as seen in `dashboard_dark.html`.
**Ref:** `dashboard_dark.html`

### Story 1.6: Dashboard UI - "Calibration Week" Banner
As a new user, I want a "Calibration Week" banner to be prominently displayed on my dashboard during my first week, so I understand the importance of my feedback.
**AC:** Banner appears on the dashboard for new users; It can be dismissed.
**Ref:** `dashboard_dark.html`

### Story 1.7: Dashboard UI - "Today's Workout" & "Meal Plan" Cards
As a user, I want to see cards summarizing my workout and meals for the day on the dashboard, so I know what my immediate tasks are.
**AC:** Implements the "Today's Workout" and "Meal Plan" cards with data from the generated plan.
**Ref:** `dashboard_dark.html`

### Story 1.8: Dashboard UI - "Progress Tracking" & "AI Tip" Cards
As a user, I want to see a summary of my recent progress and a helpful tip from my AI coach, so I can stay motivated and informed.
**AC:** Implements the "Progress Tracking" card (initially with placeholder data) and the "AI Coach Tip" card.
**Ref:** `dashboard_dark.html`

### Story 1.9: Initial Diagnostic Plan Generation
As a new user who has completed onboarding, I want to immediately see my first AI-generated "diagnostic" plan populated in the dashboard, so I can start my health journey.
**AC:** Backend generates a 7-day workout and meal plan; The plan is displayed in the components created in stories 1.7 and 1.8.
**Ref:** `dashboard_dark.html`

---

### Epic 2: Adaptive Planning & Progress Logging

As an active user, I can log my progress with simple clicks, and the app will automatically adapt my next week's plan to my performance, so my plan evolves with me.

### Story 2.1: Detailed Workout View & Logging
As an active user, I want to view a detailed breakdown of my workout and log my performance for each set, so I can track my progress accurately.
**AC:** Implements the two-column layout from the wireframe; Users can check off sets and enter reps/weight.
**Ref:** `workoutplan_dark.html`

### Story 2.2: Meal Plan View & Logging
As an active user, I want to view my weekly meal plan and mark meals as "eaten" with a single click, so I can easily track my nutritional adherence.
**AC:** Implements the weekly meal plan grid; Each meal item has a checkbox for logging.
**Ref:** `mealplan_dark.html`

### Story 2.3: Progress History View
As an active user, I want to view my historical workout data and progress charts, so I can see how I'm improving over time.
**AC:** Implements the `Progress_history_dark.html` screen, including summary stats and charts for strength and frequency.
**Ref:** `Progress_history_dark.html`

### Story 2.4: Automatic Weekly Plan Adaptation
As an active user, I want my plans to automatically adjust each week based on my logged progress, so my plans evolve with me.
**AC:** Backend AI logic analyzes logged workout/meal data and generates a new, adapted plan for the following week.

### Story 2.5: New Plan Notifications
As an active user, I want to be notified when my new weekly plans are ready, so I know when to check for updates.
**AC:** Implements the in-app notification pattern from `feedback_patterns_dark.html`.
**Ref:** `feedback_patterns_dark.html`

---

### Epic 3: User Control & Personalization

As an engaged user, I can manage my account, view my achievements, and handle interruptions to my plan, so the application feels tailored to my life.

### Story 3.1: Comprehensive Profile Page
As a user, I want a detailed profile page where I can view my information, fitness goals, and key achievements, so I have a central place to manage my identity.
**AC:** Implements the `profilepage_dark.html` layout, including user info, goals, and achievement stats.
**Ref:** `profilepage_dark.html`

### Story 3.2: Application Settings Page
As a user, I want a settings page where I can manage application preferences like theme and notifications, so I can customize my experience.
**AC:** Implements the `settings_dark.html` layout with toggles for dark mode and notification preferences.
**Ref:** `settings_dark.html`

### Story 3.3: Account Management Settings
As a user, I want to be able to change my password or delete my account from the settings page, so I have full control over my account.
**AC:** Adds the "Account Management" section to the settings page with functioning buttons.
**Ref:** `settings_dark.html`

### Story 3.4: Plan Interruption - Pause & Unwell
As a user, I want to be able to pause my plan for a vacation or signal that I'm unwell to reduce intensity, so the app can adapt to my life's circumstances.
**AC:** Implements the "Plan Management" section in settings and the corresponding modals for "Pause Plan" and "Feeling Unwell".
**Ref:** `plan_interruptions_dark.html`, `settings_dark.html`

### Story 3.5: Advanced Recipe Discovery
As a user, I want to be able to search and filter for recipes based on various criteria, so I have more options for my meal plan.
**AC:** Implements the `advanced_recepe_dark.html` screen with filters for meal type, diet, cooking time, and difficulty.
**Ref:** `advanced_recepe_dark.html`

### Story 3.6: Quick Log Unplanned Activities
As a user, I want a quick way to log an unplanned meal or workout using natural language, so I don't have to break my flow.
**AC:** Implements the Floating Action Button on the dashboard that opens the `quick_log_modal_dark.html` for text input.
**Ref:** `dashboard_dark.html`, `quick_log_modal_dark.html`

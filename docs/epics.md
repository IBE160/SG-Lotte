# ibe160 - Epic Breakdown

**Author:** BIP
**Date:** 2025-11-30
**Project Level:** Medium
**Target Scale:** Growth

---

## Overview

This document provides the complete epic and story breakdown for ibe160, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

**Living Document Notice:** This is the initial version. It will be updated after UX Design and Architecture workflows add interaction and technical details to stories.

### Proposed Epic Structure:

**Epic 1: First Plan & Foundation**
*   **Value Statement:** As a new user, I can sign up, set my core goals, and get my first personalized workout and meal plan within minutes, so I can start my health journey immediately.
*   **High-level scope:** Core technical setup (Next.js, FastAPI, Supabase), user registration/login, a 5-step guided onboarding flow, generation of the initial "diagnostic" plan, and a basic dashboard displaying the first week's plan.
*   **Sequencing:** This epic must be completed first, as it establishes the necessary infrastructure and core user journey for all subsequent features.

**Epic 2: Adaptive Planning & Progress Logging**
*   **Value Statement:** As an active user, I can log my progress with simple clicks, and the app will automatically adapt my next week's plan to my performance, so my plan evolves with me.
*   **High-level scope:** Detailed logging for workouts and meals, the core AI logic for automatic weekly replanning, in-app notifications for new plans, and a view to see historical progress.
*   **Sequencing:** Follows Epic 1, building upon the foundational user and plan data established in the first epic.

**Epic 3: User Control & Personalization**
*   **Value Statement:** As an engaged user, I can manage my account, view my achievements, and handle interruptions to my plan, so the application feels tailored to my life.
*   **High-level scope:** A comprehensive user profile page, a detailed settings page for app and notification preferences, account management functionalities (change password, delete account), and UI for pausing or adjusting plans due to life events.
*   **Sequencing:** Follows Epic 2, as it enhances the experience for active and engaged users who have already started their fitness journey.

---

## Functional Requirements Inventory

*   **FR-001:** User Authentication & Profile Management
*   **FR-002:** AI-Driven Workout Plan Generation & Adaptation
*   **FR-003:** AI-Driven Meal Plan Generation & Adaptation
*   **FR-004:** Workout Logging
*   **FR-005:** Meal Logging
*   **FR-006:** Dashboard Overview
*   **FR-007:** Notifications

---

## FR Coverage Map

*   **FR-001:** User Authentication & Profile Management -> Epic 1, Epic 3
*   **FR-002:** AI-Driven Workout Plan Generation & Adaptation -> Epic 1, Epic 2
*   **FR-003:** AI-Driven Meal Plan Generation & Adaptation -> Epic 1, Epic 2
*   **FR-004:** Workout Logging -> Epic 2
*   **FR-005:** Meal Logging -> Epic 2
*   **FR-006:** Dashboard Overview -> Epic 1, Epic 2
*   **FR-007:** Notifications -> Epic 2

---



## Epic 1: First Plan & Foundation

As a new user, I can sign up, set my core goals, and get my first personalized workout and meal plan within minutes, so I can start my health journey immediately.

### Story 1.1: Core Backend Setup

As a developer,
I want the FastAPI backend and Supabase database to be set up and connected,
So that I can build API endpoints and data models.

**Acceptance Criteria:**

**Given** the project is initialized
**When** I set up the backend
**Then** a FastAPI app is created and running
**And** a Supabase project is connected and configured
**And** Alembic migrations are configured for database schema management

**Prerequisites:** None

**Technical Notes:** This involves setting up the `backend/` directory, `requirements.txt`, basic FastAPI app structure, and Supabase client. I want the backend to use UV as package management and project management.

### Story 1.2: Core Frontend Setup

As a developer,
I want the Next.js frontend to be set up and connected to a Vercel deployment pipeline,
So that I can build UI components and have continuous deployment.

**Acceptance Criteria:**

**Given** the project is initialized
**When** I set up the frontend
**Then** a Next.js app is created with TypeScript and Tailwind CSS
**And** a Vercel CI/CD pipeline is connected for automated deployments
**And** a basic API call from the frontend to the backend is successful

**Prerequisites:** Story 1.1

**Technical Notes:** Use `create-next-app` command, configure Tailwind, setup Vercel project, implement a simple test API call.

### Story 1.3: User Registration & Email Verification

As a new user,
I want to sign up with my email and password and verify my email,
So that I can create a secure account.

**Acceptance Criteria:**

**Given** I am on the signup page
**When** I enter valid email/password and submit
**Then** my account is created in Supabase
**And** a verification email is sent to my provided email address
**And** I cannot log in until my email is verified
**When** I click the verification link in my email
**Then** my account is marked as verified

**Prerequisites:** Story 1.1, Story 1.2

**Technical Notes:** Utilizes Supabase Auth for registration and email verification. Frontend UI based on `onboarding1_dark.html` (implied first step).

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

### Story 1.5: Initial AI Plan Generation & Display

As a new user who has completed onboarding,
I want to immediately see my first AI-generated "diagnostic" workout and meal plan on my dashboard,
So I can begin my health journey.

**Acceptance Criteria:**

**Given** I have completed the onboarding flow
**When** my dashboard loads
**Then** a 7-day personalized workout and meal plan is generated by the AI (OpenAI GPT-4)
**And** the generated plan is displayed on the dashboard, similar to `dashboard_dark.html` (showing today's plan)
**And** the plan details are stored in the database

**Prerequisites:** Story 1.4

**Technical Notes:** Backend service (`ai_plan_generator.py`) for AI interaction, API endpoint to trigger plan generation, database integration to store plans. Frontend integration to display on dashboard.

---

## Epic 2: Adaptive Planning & Progress Logging

As an active user, I can log my progress with simple clicks, and the app will automatically adapt my next week's plan to my performance, so my plan evolves with me.

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

### Story 2.3: AI-Driven Weekly Plan Adaptation Logic

As an AI,
I want to automatically adapt a user's next week's workout and meal plan based on their logged progress and feedback,
So the plan evolves to better meet their goals.

**Acceptance Criteria:**

**Given** the end of the current week
**When** the Vercel Cron Job triggers the backend
**Then** the AI processes the user's logged workouts, meals, and difficulty ratings
**And** the AI generates a new, adapted workout plan for the upcoming week based on this data
**And** the AI generates a new, adapted meal plan for the upcoming week based on this data
**And** the new plans are stored in the database

**Prerequisites:** Epic 1 completion, Story 2.1, Story 2.2.

**Technical Notes:** Implementation of the background processing logic in FastAPI triggered by Vercel Cron Job (ADR-001), integration with OpenAI GPT-4, and database write operations.

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

### Story 2.5: New Plan Notification

As an active user,
I want to be notified when my new weekly plans are ready,
So I know when to check for updates.

**Acceptance Criteria:**

**Given** a new plan has been generated by the AI
**When** I open the app
**Then** I receive an in-app notification confirming the new plan
**And** I can easily navigate to the new plan from the notification

**Prerequisites:** Story 2.3.

**Technical Notes:** Frontend notification UI based on `feedback_patterns_dark.html`, API endpoint to trigger/manage in-app notifications.

---

## Epic 3: User Control & Personalization

As an engaged user, I can manage my account, view my achievements, and handle interruptions to my plan, so the application feels tailored to my life.

### Story 3.1: User Profile Page

As an engaged user,
I want a dedicated profile page to view and update my personal information and fitness goals,
So I have a central place to manage my identity.

**Acceptance Criteria:**

**Given** I navigate to the profile page
**When** the page loads
**Then** I see my name, email, and current fitness goals
**And** I can edit my personal details (e.g., name, primary goal) which are then saved to my user profile

**Prerequisites:** Epic 1 completion.

**Technical Notes:** Frontend UI development based on `profilepage_dark.html`, API endpoints for retrieving and updating user profile data.

### Story 3.2: Application Settings

As an engaged user,
I want a settings page to manage application preferences,
So I can customize my experience.

**Acceptance Criteria:**

**Given** I navigate to the settings page
**When** the page loads
**Then** I see options to manage dark mode and notification preferences
**And** changes to these settings are saved and applied immediately

**Prerequisites:** Epic 1 completion.

**Technical Notes:** Frontend UI development based on `settings_dark.html`, API endpoints to save user settings.

### Story 3.3: Account Management

As an engaged user,
I want options to change my password or delete my account from the settings page,
So I have full control over my account.

**Acceptance Criteria:**

**Given** I am on the settings page
**When** I select "Change Password"
**Then** I am prompted to enter my old and new passwords
**And** my password is updated securely via Supabase Auth
**When** I select "Delete Account"
**Then** I am prompted for confirmation
**And** my account and associated data are securely deleted from the system

**Prerequisites:** Epic 1 completion.

**Technical Notes:** Frontend UI, API endpoints integrating with Supabase Auth for password change and account deletion.

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

---



---

## FR Coverage Matrix

| FR ID | Functional Requirement | Covered by Epic(s) | Covered by Story(ies) |
| :---- | :--------------------- | :----------------- | :-------------------- |
| FR-001 | User Authentication & Profile Management | Epic 1, Epic 3 | Story 1.3, 1.4, 3.1, 3.3 |
| FR-002 | AI-Driven Workout Plan Generation & Adaptation | Epic 1, Epic 2 | Story 1.5, 2.3 |
| FR-003 | AI-Driven Meal Plan Generation & Adaptation | Epic 1, Epic 2 | Story 1.5, 2.3 |
| FR-004 | Workout Logging | Epic 2 | Story 2.1 |
| FR-005 | Meal Logging | Epic 2 | Story 2.2 |
| FR-006 | Dashboard Overview | Epic 1, Epic 2 | Story 1.5, 2.4 |
| FR-007 | Notifications | Epic 2 | Story 2.5 |

---

## Summary

The project has been decomposed into 3 epics, each delivering distinct user value, and a total of 14 stories. This breakdown ensures incremental delivery and clear ownership.

*   **Epic 1: First Plan & Foundation** (5 stories) - Establishes core infrastructure and initial user journey.
*   **Epic 2: Adaptive Planning & Progress Logging** (5 stories) - Focuses on core AI adaptation, logging, and progress visualization.
*   **Epic 3: User Control & Personalization** (4 stories) - Enhances user autonomy and customization.

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._

_This document will be updated after UX Design and Architecture workflows to incorporate interaction details and technical decisions._

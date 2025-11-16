# ibe160 - Epic Breakdown

**Author:** BIP
**Date:** søndag 16. november 2025
**Project Level:** 
**Target Scale:** 

---

## Overview

This document provides the complete epic and story breakdown for ibe160, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

### Epic 1: First Plan & Foundation
*   **Value Statement:** As a new user, I can sign up, set my core goals, and get my first personalized workout and meal plan within minutes, so I can start my health journey immediately.
*   **Scope:**
    *   Core technical setup (Next.js, FastAPI, Supabase).
    *   User registration, login, and authentication.
    *   Simplified onboarding flow.
    *   Generation of the initial "diagnostic" plan.
    *   A basic dashboard displaying the first week's plan.
*   **Out of Scope:** Advanced profile details, historical data, manual plan adjustments.
*   **Sequencing:** Must be the first epic.

### Epic 2: Adaptive Planning & Progress Logging
*   **Value Statement:** As an active user, I can log my progress with simple clicks, and the app will automatically adapt my next week's plan to my performance, so my plan evolves with me.
*   **Scope:**
    *   Simple logging for workouts (completed/skipped + difficulty) and meals (eaten/skipped).
    *   The core AI logic for automatic weekly replanning.
    *   In-app notifications for new plans.
*   **Out of Scope:** Detailed logging (reps, weights, etc.), logging unplanned activities, real-time plan adjustments.
*   **Sequencing:** Follows Epic 1.

### Epic 3: User Control & Personalization
*   **Value Statement:** As an engaged user, I can fine-tune my plan and update my profile, so the AI has the best information to guide me.
*   **Scope:**
    *   User-initiated manual adjustments for workout and meal plans.
    *   Editing of core profile information (fitness goal, dietary preference).
*   **Out of Scope:** Complex adjustments (e.g., ingredient swapping), editing detailed profile information (which is a Growth feature).
*   **Sequencing:** Follows Epic 2.

---

## Epic 1: First Plan & Foundation

As a new user, I can sign up, set my core goals, and get my first personalized workout and meal plan within minutes, so I can start my health journey immediately.

### Story 1.1: Backend & Database Setup

As a developer,
I want the FastAPI backend and Supabase database to be set up and connected,
So that I can build API endpoints and data models.

**Acceptance Criteria:**

**Given** a new project
**When** I initialize the backend
**Then** a FastAPI application is created
**And** a Supabase project is created and connected to the FastAPI application
**And** basic Alembic migrations are configured

**Prerequisites:** None

**Technical Notes:** Use `python-dotenv` for managing environment variables (Supabase URL, keys).

### Story 1.2: Frontend Setup & Deployment Pipeline

As a developer,
I want the Next.js frontend to be set up and connected to a Vercel deployment pipeline,
So that I can build UI components and have continuous deployment.

**Acceptance Criteria:**

**Given** a new project
**When** I initialize the frontend
**Then** a Next.js application is created with TypeScript and Tailwind CSS
**And** the project is connected to a Vercel project for automatic CI/CD
**And** the frontend can make a basic API call to the FastAPI backend

**Prerequisites:** Story 1.1

**Technical Notes:** Use `npx create-next-app`. Configure Vercel project settings.

### Story 1.3: User Registration & Email Verification

As a new user,
I want to sign up with my email and password and verify my email,
So that I can create a secure account and access the application.

**Acceptance Criteria:**

**Given** I am on the sign-up page
**When** I enter my email and password and submit
**Then** my account is created, and a verification email is sent
**And** I cannot log in until my email is verified
**And** I can verify my email via a link

**Prerequisites:** Story 1.2

**Technical Notes:** Utilize Supabase Auth for registration and email verification.

### Story 1.4: Core Profile Setup (Onboarding)

As a new user who has verified my email,
I want to provide my primary fitness goal and core dietary preference during onboarding,
So that the AI can generate my first personalized plan.

**Acceptance Criteria:**

**Given** I have just verified my email
**When** I am guided through the onboarding flow
**Then** I can select my primary fitness goal
**And** I can select my core dietary preference
**And** these preferences are saved to my profile

**Prerequisites:** Story 1.3

**Technical Notes:** Simple form with predefined options.

### Story 1.5: Basic Dashboard UI

As a developer,
I want a basic dashboard UI with placeholders for workout and meal plans,
So that I have a place to display the AI-generated plans.

**Acceptance Criteria:**

**Given** the frontend is set up
**When** I create the dashboard page
**Then** it has a clear layout with sections for "This Week's Workouts" and "This Week's Meals"
**And** these sections contain placeholder content

**Prerequisites:** Story 1.2

**Technical Notes:** Use `shadcn/ui` components for layout and cards.

### Story 1.6: Initial Diagnostic Plan Generation & Display

As a new user who has completed core profile setup,
I want to immediately see my first AI-generated "diagnostic" workout and meal plan,
So that I can start my health journey without delay.

**Acceptance Criteria:**

**Given** I have completed the core profile setup
**When** I am directed to the dashboard
**Then** a "diagnostic" weekly workout plan is displayed
**And** a "diagnostic" weekly meal plan is displayed
**And** the UI displays a toast notification or a banner with the text: "Welcome! Here is your first 'diagnostic' plan. Your feedback this week will help us calibrate the AI to your unique fitness level."

**Prerequisites:** Story 1.4, Story 1.5

**Technical Notes:** Integrate OpenAI GPT-4 API for plan generation. Implement structured JSON output parsing.

---

## Epic 2: Adaptive Planning & Progress Logging

As an active user, I can log my progress with simple clicks, and the app will automatically adapt my next week's plan to my performance, so my plan evolves with me.

### Story 2.1: Workout Logging (Completed/Skipped & Difficulty)

As an active user,
I want to easily mark my planned workouts as completed or skipped and rate their difficulty,
So that the AI can learn from my performance and adapt future plans.

**Acceptance Criteria:**

**Given** I am viewing my current week's workout plan on the dashboard
**When** I interact with a workout
**Then** I can mark it as "Completed" or "Skipped"
**And** if "Completed", I can rate its difficulty (e.g., 1-5 scale)
**And** the dashboard visually updates the workout's status

**Prerequisites:** Story 1.6

**Technical Notes:** Store workout status and difficulty in Supabase.

### Story 2.2: Meal Logging (Eaten/Skipped)

As an active user,
I want to easily mark my planned meals as eaten or skipped,
So that the AI can learn from my adherence and adapt future meal plans.

**Acceptance Criteria:**

**Given** I am viewing my current week's meal plan on the dashboard
**When** I interact with a meal
**Then** I can mark it as "Eaten" or "Skipped"
**And** the dashboard visually updates the meal's status

**Prerequisites:** Story 1.6

**Technical Notes:** Store meal status in Supabase.

### Story 2.3: Automatic Weekly Plan Adaptation (Workouts & Meals)

As an active user,
I want my workout and meal plans to automatically adjust each week based on my logged progress,
So that my plans continuously evolve to meet my changing needs and performance.

**Acceptance Criteria:**

**Given** a week has ended and I have logged activities
**When** the system performs its weekly replanning
**Then** the AI analyzes my logged workout status, difficulty, and meal status
**And** the AI generates a new, adapted workout plan for the next week
**And** the AI generates a new, adapted meal plan for the next week

**Prerequisites:** Story 2.1, Story 2.2

**Technical Notes:** Implement backend logic for AI analysis and plan generation.

### Story 2.4: New Plan Notifications

As an active user,
I want to be notified when my new weekly plans are ready,
So that I always know when to check for my updated guidance.

**Acceptance Criteria:**

**Given** a new weekly plan has been generated
**When** I log into the application
**Then** I receive an in-app notification that my new plans are available

**Prerequisites:** Story 2.3

**Technical Notes:** Simple in-app notification system.

---

## Epic 3: User Control & Personalization

As an engaged user, I can fine-tune my plan and update my profile, so the AI has the best information to guide me.

### Story 3.1: Manual Workout Plan Adjustments

As an engaged user,
I want to request simple adjustments to my current workout plan,
So that I can fine-tune it to my immediate needs (e.g., "make it easier/harder").

**Acceptance Criteria:**

**Given** I am viewing my current workout plan
**When** I select an option to "Adjust my plan"
**Then** I am presented with simple adjustment choices (e.g., "easier", "harder", "different focus")
**And** the AI regenerates the workout plan based on my choice
**And** I can review and accept the new plan

**Prerequisites:** Story 2.3

**Technical Notes:** Integrate AI prompt adjustments based on user input.

### Story 3.2: Manual Meal Plan Adjustments

As an engaged user,
I want to request simple adjustments to my current meal plan,
So that I can fine-tune it to my immediate needs (e.g., "more variety").

**Acceptance Criteria:**

**Given** I am viewing my current meal plan
**When** I select an option to "Adjust my plan"
**Then** I am presented with simple adjustment choices (e.g., "more variety", "different meals for X day")
**And** the AI regenerates the meal plan based on my choice
**And** I can review and accept the new plan

**Prerequisites:** Story 2.3

**Technical Notes:** Integrate AI prompt adjustments based on user input.

### Story 3.3: Edit Core Profile Information

As an engaged user,
I want to edit my primary fitness goal and core dietary preference,
So that the AI always has the most up-to-date information to generate my plans.

**Acceptance Criteria:**

**Given** I am on my profile page
**When** I edit my primary fitness goal or core dietary preference
**Then** the changes are saved
**And** the AI uses this updated information for the next weekly plan generation

**Prerequisites:** Story 1.3

**Technical Notes:** Simple form update to Supabase profile data.

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._

# AI Fitness & Meal Planner - UX Design Specification

## 1. Introduction

This document outlines the User Experience (UX) and User Interface (UI) design for the AI Fitness & Meal Planner application. It is based on the project proposal and the existing set of wireframes. The goal is to ensure a cohesive, intuitive, and engaging user experience that aligns with the project's core objectives.

The design philosophy is centered around a **clean, data-driven, and highly personalized experience**. The application will act as a proactive digital coach, guiding users toward their health goals with minimal friction.

## 2. User Flow and Wireframe Analysis

The following section maps the user flows defined in the `proposal.md` to the existing wireframe files.

### Flow 0: New User Onboarding
- **Description:** A 5-step guided setup process for new users.
- **Supporting Wireframes:**
  - `onboarding1_dark.html`: Welcome Screen.
  - `onboarding2_dark.html`: Step 2 - Select Fitness Goal.
  - `onboarding3_dark.html`: Step 3 - Dietary Preferences.
  - `onboarding4_dark.html`: Step 4 - Choose Fitness Persona.
  - `onboarding5_dark.html`: Step 5 - Plan Generation/Loading screen.
- **Analysis:** The onboarding flow is well-covered and aligns perfectly with the proposal. The visual progression and clear steps create a smooth entry point for the user.

### Flow 1 & 2: Plan Workouts & Meals
- **Description:** AI-powered generation of weekly workout and meal plans.
- **Supporting Wireframes:**
  - `workoutplan_dark.html`: Represents a detailed view of a generated workout, suitable for tracking.
  - `mealplan_dark.html`: Displays the weekly meal schedule and an associated shopping list.
  - `advanced_recepe_dark.html`: An excellent supplementary screen for users to discover and filter recipes, supporting meal substitution.
- **Analysis:** The wireframes effectively visualize the *output* of the planning flows. The recipe discovery page is a strong feature that enhances user agency.

### Flow 3 & 4: Log Workouts & Meals
- **Description:** Tracking completed activities and providing feedback to the AI.
- **Supporting Wireframes:**
  - `workoutplan_dark.html`: Perfectly designed for logging sets, reps, and notes for an exercise.
  - `Progress_history_dark.html`: Shows the historical log of workouts.
- **Analysis:** Workout logging is well-defined. However, a clear interface for logging meal consumption is missing.

### Flow 5: Manage Plan Interruptions
- **Description:** Allowing users to pause or adjust their plan for vacations or illness.
- **Supporting Wireframes:**
  - `plan_interruptions_dark.html`: Directly addresses this flow with "Pause Plan" and "Feeling Unwell" options and corresponding modals.
- **Analysis:** This critical user need is fully covered by the existing designs.

### Flow 6, 7, & 8: Profile, Account, and History
- **Description:** Standard user account management and history review.
- **Supporting Wireframes:**
  - `profilepage_dark.html` / `profilepage_white.html`: Comprehensive profile view.
  - `settings_dark.html`: Contains account management functions like password changes and account deletion.
  - `Progress_history_dark.html`: Provides a detailed view of past performance and workout logs.
- **Analysis:** These flows are well-supported and align with standard application practices.

## 3. Implemented Design Improvements

### 3.1. Meal Logging Interface
- **Gap:** The `mealplan_dark.html` wireframe shows the plan but lacks interactive elements for users to log that they have eaten, skipped, or partially consumed a meal.
- **Implementation:** Checkboxes and "more options" icons have been added to each meal item in `mealplan_dark.html`.
- **Status:** Implemented.

### 3.2. Logging Unplanned Activities
- **Gap:** The user flows mention logging unplanned activities via natural language (e.g., "I went for a 30-minute run"), but there is no UI element for this.
- **Implementation:** A floating action button has been added to `dashboard_dark.html`, which links to a new `quick_log_modal_dark.html` wireframe for natural language input.
- **Status:** Implemented.

### 3.3. First-Week "Calibration" Experience
- **Gap:** The proposal specifies a "diagnostic" first week to calibrate the AI, but this is not visually distinguished from a regular week.
- **Implementation:** A prominent "Calibration Week" banner has been added to `dashboard_dark.html` and `workoutplan_dark.html`.
- **Status:** Implemented.

## 4. Design System and Principles

The wireframes establish a consistent and modern design system.

- **Theme:** A dark-first approach is evident, promoting focus and reducing eye strain. The existence of `profilepage_white.html` confirms the system is themeable.
- **Color Palette:**
  - **Primary:** `#4299E1` (A vibrant blue for interactive elements and highlights).
  - **Background:** `#121212`, `#1A202C` (Deep, near-black shades).
  - **Surface/Card:** `#1E1E1E`, `#2D3748` (Slightly lighter grays for card backgrounds).
  - **Text:** `#F7FAFC` (Primary), `#A0AEC0` (Secondary/Muted).
- **Typography:** The designs use both `Inter` and `Work Sans`. To ensure consistency, **`Inter`** is recommended as the primary font for its excellent readability on digital screens. `Work Sans` should be deprecated.
- **Iconography:** **Material Symbols Outlined** are used consistently and effectively. This should be the sole icon library.
- **Layout & Components:**
  - Spacing is generous, creating a breathable layout.
  - A card-based architecture is used to group related information.
  - Consistent use of `rounded-lg` and `rounded-xl` for border-radius.
  - Interactive elements have clear hover and focus states, as seen in the chip components and buttons.
- **Feedback Patterns:** As shown in `feedback_patterns_dark.html`, the system should use non-intrusive "toast" notifications for success, error, and warning states.

This specification will serve as the guiding document for all future design and development work.
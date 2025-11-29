# AI Fitness & Meal Planner - UX Design Specification (Rev. 2)

## 1. Introduction

This document outlines the User Experience (UX) and User Interface (UI) design for the AI Fitness & Meal Planner application. It serves as a central hub, connecting the project's user flows to the corresponding wireframes and the detailed implementation guidelines defined in the **Design System Specification**.

The core design philosophy is a **clean, data-driven, and highly personalized experience**, realized through the "Minimalist" design direction chosen from the available mockups.

## 2. Collaborative Design & Decision-Making

To ensure a collaborative process, the following documents serve as the primary tools for making key design decisions:

- **Color Palette Selection:** The `docs/ux-color-themes.html` visualizer must be used to compare and select a color theme that fits the brand and user experience goals.
- **Visual Style Selection:** The `docs/ux-design-directions.html` mockup gallery must be used to choose a foundational visual style for the application's components and layout.

All major design decisions, including the final selections from the documents above, must be documented in this specification with a clear rationale.

## 3. User Flow and Wireframe Analysis

This section maps user flows to the high-fidelity wireframes that represent the UI for each flow.

### Flow 0: New User Onboarding
- **Description:** A 5-step guided setup process for new users.
- **Supporting Wireframes:**
  - `onboarding1_dark.html` to `onboarding5_dark.html`
- **Analysis:** This flow is fully covered and provides a smooth, progressive onboarding experience.

### Flow 1 & 2: Plan Workouts & Meals
- **Description:** AI-powered generation and display of weekly workout and meal plans.
- **Supporting Wireframes:**
  - `workoutplan_dark.html`
  - `mealplan_dark.html`
  - `advanced_recepe_dark.html`
- **Analysis:** The core screens for displaying generated plans are well-defined. The recipe discovery page is a key feature that provides essential user agency.

### Flow 3 & 4: Log Workouts, Meals & Provide Feedback
- **Description:** Tracking completed activities and providing feedback to the AI.
- **Supporting Wireframes:**
  - `workoutplan_dark.html`: Enables detailed logging of sets, reps, and weights.
  - `mealplan_dark.html`: Enables simple checkbox-based logging for meal adherence.
  - `quick_log_modal_dark.html`: A crucial feature for logging unplanned activities via natural language.
  - `feedback_patterns_dark.html`: Defines the visual patterns (toasts) for success, error, and warning feedback after a user action.
- **Analysis:** The combination of structured and unstructured logging provides a flexible and low-friction user experience. The feedback patterns ensure users receive immediate confirmation of their actions.

### Flow 5: Manage Plan Interruptions
- **Description:** Allowing users to pause or adjust their plan for vacations or illness.
- **Supporting Wireframes:**
  - `plan_interruptions_dark.html`
  - `settings_dark.html`
- **Analysis:** This critical user need is fully supported through the modals and settings options.

### Flow 6, 7, & 8: Profile, Account, and History
- **Description:** Standard user account management and history review.
- **Supporting Wireframes:**
  - `profilepage_dark.html` / `profilepage_white.html`
  - `settings_dark.html`
  - `Progress_history_dark.html`
- **Analysis:** These standard flows are well-supported and align with best practices.

## 4. Design System and Implementation Guidelines

All visual and interactive aspects of the application MUST adhere to the detailed specifications outlined in the official **Design System Specification**. This document is the single source of truth for developers.

**[-> Go to Design System Specification](./design-system-spec.md)**

This external document covers all of the following topics in detail:
- **Visual Foundation:** Typography, Spacing, and Layout.
- **Component Library:** Detailed specifications for all reusable components (Buttons, Cards, Inputs, etc.).
- **UX Pattern Consistency Rules:** Rules for feedback, forms, modals, navigation, and more.
- **Responsive Design:** Breakpoints and adaptation strategy for all supported screen sizes.
- **Accessibility (A11y):** The target WCAG compliance level and all associated implementation guidelines.

Adherence to this external specification is mandatory to ensure a consistent, accessible, and high-quality user experience.
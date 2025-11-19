# ibe160 UX Design Specification

_Created on tirsdag 18. november 2025 by BIP_
_Generated using BMad Method - Create UX Design Workflow v1.0_

---

## Executive Summary

This project will create an AI-assisted web application that automatically generates and adjusts personalized workout and meal plans to promote long-term health habits and consistency. It aims to be an affordable and adaptive solution that leverages AI for deep personalization, making it a "personal trainer in your pocket."

### Target Users

The primary users for this application are:
- **Health-Conscious Individuals:** People who are proactive about their health and want structured, intelligent guidance to achieve their fitness and nutrition goals.
- **Busy Professionals:** Individuals with limited time who need an efficient, automated way to organize their fitness and meal schedules without extensive manual planning.
- **Budget-Conscious Users:** People seeking an affordable and intelligent alternative to expensive personal trainers and nutritionists.

---

## 1. Design System Foundation

### 1.1 Design System Choice

The chosen design system for the AI Fitness & Meal Planner is **shadcn/ui**.

**Rationale:**
-   **Alignment with Technical Stack:** shadcn/ui is built with Radix UI and styled using Tailwind CSS, directly aligning with the project's frontend technical preferences (Next.js, TypeScript, Tailwind CSS).
-   **Full Customization and Control:** Unlike traditional component libraries, shadcn/ui provides the actual component code, offering complete control for customization. This is crucial for achieving the desired minimalist design and for tailoring components to specific user preferences, particularly for plan customization.
-   **Built-in Accessibility:** Leveraging Radix UI primitives, shadcn/ui ensures that components are headless and accessible by default, addressing a key non-functional requirement for the application.
-   **Efficiency and Consistency:** It provides a comprehensive suite of well-tested components, speeding up development while ensuring a consistent user experience across the application.
-   **Scalability:** The modular nature and open code make it adaptable for future enhancements and custom component development.

---

## 2. Core User Experience

### 2.1 Defining Experience

The defining experience of the AI Fitness & Meal Planner is that **it is the app where you get your AI fitness and mealplans**. This core interaction, powered by AI, is what users will associate most strongly with the application. It encapsulates the personalized, adaptive guidance for both workouts and nutrition.

### 2.2 Platform

The primary platform for the application is a **web application** accessed via browsers, targeting:
-   **Primary Devices:** Desktops and Laptops
-   **Secondary Devices:** Tablets

### 2.3 Desired Emotional Response

Users should feel that it is **easy to get progress in workout and meals**, leading to a sense of being **motivated** and that their efforts are **effective**. The application should inspire confidence and a feeling of achievement in their health and fitness journey.

### 2.4 Inspiration Analysis

An analysis of **Strong Workout Tracker Gym Log** and **Stupid Simple Macro Tracker** reveals several key UX principles that align with the goals of this project:

-   **Simplicity and Efficiency for Core Tasks:** Both apps are highly praised for their straightforward, uncluttered interfaces, which allow users to quickly log workouts and meals. This directly supports our goal of an "easy" and "effective" user experience by minimizing friction in repetitive actions.
-   **Focus on the Core Loop:** Strong prioritizes the core action of logging exercises, and Stupid Simple Macro Tracker excels at rapid food entry (e.g., barcode scanning). This reinforces the importance of streamlining the "get plan -> log results" loop in our application.
-   **Layered Information (Progressive Disclosure):** Strong demonstrates how to keep the primary interface clean while providing access to detailed information (e.g., performance charts, exercise instructions) when users need it. This prevents overwhelming the user while still offering data richness.
-   **Customization and User Control:** Both apps provide robust customization options, from creating custom workout routines to tailoring macro goals. This directly supports our critical user action of allowing users to "customize the plans according to their preference," ensuring they feel empowered and in control of their plans.
-   **Data-Driven Motivation:** Both apps effectively use visual progress tracking (personal records, graphs, macro charts) to keep users motivated and highlight their achievements, aligning with our desired emotional outcome of users feeling "motivated" and "effective."
-   **Quick Information Access:** Features like widgets in Stupid Simple Macro Tracker provide at-a-glance access to crucial information, a principle that can be adapted for our web application to quickly show daily or weekly progress summaries.

### 2.5 Novel UX Patterns

The core innovative aspect of this application lies in the **AI-driven personalization and adaptation of fitness and meal plans**. While personalized planning tools exist, the dynamic, intelligent adjustment of plans based on continuous user input and progress creates a novel interaction pattern. This will require careful design to:
-   Clearly communicate *why* a plan has changed or adapted.
-   Provide intuitive ways for users to influence AI decisions and customize generated plans (e.g., "swap exercise," "adjust meal ingredients," "make plan harder/easier").
-   Maintain user trust and a sense of control over an intelligent system.


### 2.6 Core Experience Principles

These principles will guide every UX decision for the AI Fitness & Meal Planner:

-   **Speed:** Key user actions, especially logging workouts and meals, and accessing plans, should feel very fast and efficient. The interface should minimize friction and cognitive load to ensure a seamless experience.
-   **Guidance:** Provide clear, contextual guidance for new users, especially around the AI-driven aspects of plan generation and adaptation. As users become more familiar, the guidance should become less intrusive, allowing for a more expert flow.
-   **Flexibility:** Empower users with significant control and customization options over their AI-generated plans. The system should offer intelligent suggestions but allow users to easily adjust, swap, or modify elements to fit their personal preferences and evolving needs.
-   **Feedback:** Feedback should be clear, positive, and actively highlight user progress and achievements. It should be designed to be motivating and reinforce the effectiveness of their efforts, perhaps with celebratory elements for milestones.

---

## 3. Visual Foundation

### 3.1 Color System


### 4.1 Chosen Design Approach

{{design_direction_decision}}

**Interactive Mockups:**

- Design Direction Showcase: [ux-design-directions.html](./ux-design-directions.html)

---

## 5. User Journey Flows

### 5.1 Critical User Paths

{{user_journey_flows}}

---

## 6. Component Library

### 6.1 Component Strategy

{{component_library_strategy}}

---

## 7. UX Pattern Decisions

### 7.1 Consistency Rules

{{ux_pattern_decisions}}

---

## 8. Responsive Design & Accessibility

### 8.1 Responsive Strategy

{{responsive_accessibility_strategy}}

---

## 9. Implementation Guidance

### 9.1 Completion Summary

{{completion_summary}}

---

## Appendix

### Related Documents

- Product Requirements: `{{prd_file}}`
- Product Brief: `{{brief_file}}`
- Brainstorming: `{{brainstorm_file}}`

### Core Interactive Deliverables

This UX Design Specification was created through visual collaboration:

- **Color Theme Visualizer**: C:\IT_studier\IBE160_Programmering_med_KI\Prosjektmappe\Prosjekt\SG-Lotte\docs/ux-color-themes.html
  - Interactive HTML showing all color theme options explored
  - Live UI component examples in each theme
  - Side-by-side comparison and semantic color usage

- **Design Direction Mockups**: C:\IT_studier\IBE160_Programmering_med_KI\Prosjektmappe\Prosjekt\SG-Lotte\docs/ux-design-directions.html
  - Interactive HTML with 6-8 complete design approaches
  - Full-screen mockups of key screens
  - Design philosophy and rationale for each direction

### Optional Enhancement Deliverables

_This section will be populated if additional UX artifacts are generated through follow-up workflows._

<!-- Additional deliverables added here by other workflows -->

### Next Steps & Follow-Up Workflows

This UX Design Specification can serve as input to:

- **Wireframe Generation Workflow** - Create detailed wireframes from user flows
- **Figma Design Workflow** - Generate Figma files via MCP integration
- **Interactive Prototype Workflow** - Build clickable HTML prototypes
- **Component Showcase Workflow** - Create interactive component library
- **AI Frontend Prompt Workflow** - Generate prompts for v0, Lovable, Bolt, etc.
- **Solution Architecture Workflow** - Define technical architecture with UX context

### Version History

| Date     | Version | Changes                         | Author |
| -------- | ------- | ------------------------------- | ------ |
| tirsdag 18. november 2025 | 1.0     | Initial UX Design Specification | BIP |

---

_This UX Design Specification was created through collaborative design facilitation, not template generation. All decisions were made with user input and are documented with rationale._

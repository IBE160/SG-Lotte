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

The chosen color theme is **"Earthy"**, designed to evoke a natural, balanced, and approachable feel, aligning with the project's goals of promoting long-term health and consistency.

**Palette:**
-   **Primary:** `#84CC16` (Vibrant Green) - Used for primary actions, key interactive elements, and accents to convey vitality and progress.
-   **Secondary:** `#A1A1AA` (Medium Gray) - Used for supporting actions, subtle distinctions, and secondary information.
-   **Background:** `#FEFCE8` (Light Cream/Yellow) - Provides a soft, warm, and inviting backdrop for content.
-   **Text:** `#3F3F46` (Dark Gray) - Ensures high readability against the light background.
-   **Success:** `#22C55E` (Green) - Used for positive feedback and successful operations.
-   **Error:** `#EF4444` (Red) - Used for critical errors and warnings.
-   **Warning/Info:** (To be defined, likely a yellow/orange tone based on the palette).
-   **Neutral Scale:** Grays for borders, inactive states, and subtle UI elements (based on Tailwind's default gray scale).

### 3.2 Typography System

Leveraging `shadcn/ui` and Tailwind CSS, the typography will be clean, modern, and highly readable, reflecting the minimalist design approach.

-   **Font Families:** System default sans-serif fonts will be prioritized for optimal performance and native feel across devices (e.g., `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`). A monospace font will be used sparingly for specific data or code displays.
-   **Type Scale:** A modular type scale will be established using Tailwind CSS utilities (e.g., `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl` for headings).
-   **Font Weights:** `Normal`, `Medium`, `Semibold`, and `Bold` weights will be used to create clear visual hierarchy, with `normal` for body text and `semibold`/`bold` for headings and emphasized text.
-   **Line Heights:** Optimized for readability using Tailwind's default line-height utilities.

### 3.3 Spacing and Layout Foundation

A consistent spacing and layout system, based on a grid, will ensure visual harmony and responsive behavior.

-   **Base Unit:** A 4px base unit will be used for all spacing and sizing, adhering to Tailwind CSS conventions (e.g., `4px`, `8px`, `12px`, `16px`, `24px`, etc.).
-   **Spacing Scale:** Tailwind's comprehensive spacing scale will be utilized for margins, padding, and gaps (`p-x`, `m-x`, `gap-x`).
-   **Layout Grid:** A flexible 12-column grid system will be implemented to provide robust structure for responsive layouts, easily achievable with Tailwind CSS's flexbox and grid utilities.
-   **Container Widths:** Content will be constrained within responsive max-width containers (`max-w-screen-sm` to `max-w-screen-2xl`) to ensure optimal line length and readability on various screen sizes.

**Interactive Visualizations:**

- Color Theme Explorer: [ux-color-themes.html](./ux-color-themes.html)

---

## 4. Design Direction

### 4.1 Chosen Design Approach

The chosen design approach is **"Card-Centric Progress"**. This direction emphasizes clear visual feedback and digestible information, aligning strongly with the project's goals of motivating users and making progress easy to track.

**Key Design Decisions based on "Card-Centric Progress":**

-   **Layout Decisions:**
    -   **Navigation Pattern:** A clear, perhaps sidebar-like, navigation will provide structured access to different sections of the app, while key daily content is presented centrally.
    -   **Content Structure:** Information will be organized into a grid of cards, making daily plans and progress overview easily scannable.
    -   **Content Organization:** Each card will represent a distinct unit of information (e.g., a day's workout, a day's meals, a weekly progress summary), providing digestible chunks of content.

-   **Hierarchy Decisions:**
    -   **Visual Density:** The design will maintain a balanced visual density, ensuring each card is a clear and distinct unit of information without feeling overwhelming.
    -   **Header Emphasis:** Clear, concise headings within each card will guide user attention, and the card structure itself will provide inherent emphasis for important content.
    -   **Content Focus:** Progress indicators (e.g., checkmarks, progress bars, simple charts) will be prominent, visually emphasizing user achievements and adherence.

-   **Interaction Decisions:**
    -   **Primary Action Pattern:** Tapping or clicking on a card will expand it to reveal more details and provide logging options (e.g., "Log Workout," "View Meal Details"). This promotes progressive disclosure.
    -   **Information Disclosure:** Details will be revealed progressively, keeping the main dashboard clean and focused while allowing users to delve deeper when needed.
    -   **User Control:** Clear logging actions and options for customization will be integrated directly into the cards or detail views, empowering users to manage their plans efficiently.

-   **Visual Style Decisions:**
    -   **Weight:** The design will feature a balanced visual weight, providing clear structure and definition to cards and other UI elements without appearing heavy.
    -   **Depth Cues:** Subtle shadows or borders on cards will suggest depth and interactivity, making elements feel tangible and clickable.
    -   **Border Style:** Subtle borders will be used to define card boundaries and other content areas, maintaining a clean aesthetic.

**Rationale for Selection:**
The "Card-Centric Progress" approach was chosen because it directly supports the desired user experience of feeling "motivated and effective" and finding it "easy to get progress." The visual emphasis on digestible cards and clear progress indicators makes the application intuitive and rewarding to use, aligning with insights from successful tracking apps.

**Interactive Mockups:**

- Design Direction Showcase: [ux-design-directions.html](./ux-design-directions.html)

---

## 5. User Journey Flows

### 5.1 Critical User Paths

#### User Journey: Onboarding & First Plan Generation

-   **User Goal:** To successfully sign up, provide initial preferences, and receive their first AI-generated weekly workout and meal plan.
-   **Approach:** Guided, progressive onboarding with clear feedback and a focus on minimizing initial friction.

**Flow Steps:**

1.  **Entry (Landing Page)**
    -   **User sees:** A clean, simple landing page with the core value proposition and a prominent Call-to-Action (CTA): "Get Your AI-Powered Plan".
    -   **User does:** Clicks "Get Your AI-Powered Plan".
    -   **System responds:** Navigates to the first step of the onboarding process.

2.  **Account Creation (Onboarding Step 1)**
    -   **User sees:** Simple form for Email and Password, or options for Social Login (e.g., Google). Clear progress indicator (e.g., "Step 1 of 4").
    -   **User does:** Enters credentials or selects social login.
    -   **System responds:** Creates account, moves to the next onboarding step.

3.  **Core Goal Selection (Onboarding Step 2)**
    -   **User sees:** A question: "What is your primary goal?" with large, visually distinct clickable cards for options (e.g., "Lose Weight," "Build Muscle," "Improve Fitness").
    -   **User does:** Selects their primary goal.
    -   **System responds:** Records goal, moves to the next onboarding step.

4.  **Dietary Preference (Onboarding Step 3)**
    -   **User sees:** A question: "Do you have any dietary preferences?" with options (e.g., "Anything," "Vegetarian," "Vegan," "Gluten-Free").
    -   **User does:** Selects their dietary preference.
    -   **System responds:** Records preference, moves to the next onboarding step.

5.  **Basic Profile (Onboarding Step 4)**
    -   **User sees:** Minimal form for Age, Gender, and Activity Level.
    -   **User does:** Inputs requested information.
    -   **System responds:** Records information, initiates plan generation process, displays a loading screen.

6.  **Plan Generation (Loading Screen)**
    -   **User sees:** An engaging loading screen with messages like "Analyzing your goals...", "Crafting your workouts...", "Personalizing your meals...".
    -   **User does:** Waits.
    -   **System responds:** Completes plan generation, moves to the success screen.
    -   **Emotional Goal:** User feels anticipation and excitement; reinforced belief in AI magic.

7.  **Success & First Value (Plan Ready Screen)**
    -   **User sees:** A clear message: "Your First Plan is Ready!" with a prominent CTA: "View My Plan".
    -   **User does:** Clicks "View My Plan".
    -   **System responds:** Navigates to the Dashboard, showing the plan for "Today."

**Mermaid Diagram:**
```mermaid
graph TD
    A[Landing Page] --> B{Click "Get Your AI-Powered Plan"}
    B --> C[Onboarding: Account Creation]
    C --> D[Onboarding: Core Goal Selection]
    D --> E[Onboarding: Dietary Preference]
    E --> F[Onboarding: Basic Profile]
    F --> G[Loading Screen: Generating Plan]
    G --> H[Success Screen: "Your First Plan is Ready!"]
    H --> I[Dashboard: View Today's Plan]
```

---

## 6. Component Library

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

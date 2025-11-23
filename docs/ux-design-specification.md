# ibe160 UX Design Specification

_Created on søndag 23. november 2025 by BIP_
_Generated using BMad Method - Create UX Design Workflow v1.0_

---

## Executive Summary

To develop a comprehensive, AI-assisted web application that automatically generates and adjusts personalized workout and meal plans, promoting long-term health habits and consistency. The core "magic" is the AI-driven personalization and dynamic adaptation of fitness and meal plans, making healthy living accessible, consistent, and highly engaging through intelligent onboarding, flexible plan adjustments, and user control.

---

## 1. Design System Foundation

### 1.1 Design System Choice

**System:** shadcn/ui
**Rationale:** Chosen for its balance of fast development and good defaults, while still enabling a clean and modern aesthetic, and aligning with the project's existing use of Tailwind CSS.
**Provides:** A collection of re-usable components that are built using Radix UI and Tailwind CSS. They are unstyled by default, allowing for easy customization.
**Customization Needs:** Will leverage Tailwind CSS for styling and theming, with custom components built as needed using Radix UI primitives.

---

## 2. Core User Experience

### 2.1 Defining Experience

The defining experience is having "an AI coach in your pocket, constantly learning and adapting your fitness and meal plans to help you achieve your goals effortlessly. It's truly personalized wellness on autopilot." This positions the application as a proactive, intelligent companion for health and wellness.

**Platform:** Web Application

### 2.2 Novel UX Patterns

While the overall *intelligence* and continuous adaptation are novel, the core user interactions will likely leverage established UX patterns (dashboards, forms, notifications). No truly novel *interaction patterns* have been identified yet, but this will be assessed in the next step.

### 2.3 Desired Emotional Response

Users should feel empowered and in control of their health journey, but also supported and motivated by the AI. Ultimately, they should feel confident and successful in achieving their fitness and meal goals. The feeling that would make them tell a friend is 'This app makes healthy living achievable and surprisingly easy!'

### 2.4 Inspiration and UX Pattern Analysis

**Strava:** Focused on clear progress tracking, social motivation, and intuitive activity tracking with AI-powered insights.
*   **Applicable Patterns:** Implement intuitive dashboards, progress tracking, and digestible nutritional breakdowns. Leverage AI for contextual insights into user performance.
*   **Compelling Aspect:** Makes fitness feel like a community and achievement.

**MyFitnessPal:** Valued for comprehensive food logging and clear, digestible nutritional breakdowns.
*   **Applicable Patterns:** Provide an extensive and easily searchable database for meal logging. Present nutritional information clearly and concisely, abstracting complexity.
*   **Compelling Aspect:** Makes complex nutrition data digestible and understandable.

**Headspace:** Praised for its calming and intuitive UI, guided sessions, and engagement features like goal setting.
*   **Applicable Patterns:** Design a visually appealing, user-friendly, and supportive UI. Incorporate "guided journeys" with gentle encouragement and positive reinforcement. Consider gamification elements for goal setting.
*   **Compelling Aspect:** Makes mindfulness accessible and gently encourages daily practice.

**Synthesized UX Principles for AI Fitness & Meal Planner:**
1.  **Clarity & Digestibility:** Present complex data (progress, nutrition) visually and simply.
2.  **Effortless Interaction:** Ensure core actions (logging, planning) are intuitive and require minimal effort.
3.  **Supportive AI:** AI should provide insights and adapt plans, making the user feel motivated and understood.
4.  **Calming & Engaging Aesthetics:** UI should be inviting, reduce cognitive load, and foster a sense of accomplishment.
5.  **Goal-Oriented Motivation:** Design elements that celebrate progress and encourage consistency.
6.  **Consistency & Accessibility:** Utilize a robust design system to ensure a unified and accessible experience.

### 2.5 Core Experience Principles

**Speed (Effortless Efficiency):** Actions related to plan generation, adaptation, and logging should feel instantaneous and efficient. The AI should quickly respond to user input and provide updated plans without noticeable delay.
**Guidance (Intelligent Guidance):** The AI acts as a 'coach in your pocket,' providing clear, gentle, and proactive guidance for both plans and progress. Onboarding and new features should be clearly explained.
**Flexibility (Adaptive Personalization):** While providing structured plans, the system should allow users to adapt and fine-tune their plans, supporting their unique needs and evolving goals.
**Feedback (Motivating Feedback):** Users should receive clear, motivating, and actionable feedback on their progress, plan adherence, and the AI's adaptation. This fosters confidence and encourages continued engagement.

---

## 3. Visual Foundation

### 3.1 Color System

**Chosen Theme:** Calm & Focused
**Personality:** Serene & Minimalist
**Strategy:** Softer, natural tones and more white space, promoting calm, clarity, and focus, aligning with the supportive AI coach vision.
**Color Palette:**
*   **Primary:** #607D8B (Blue Grey) - For key actions, primary navigation, prominent UI elements.
*   **Secondary:** #B0BEC5 (Light Blue Grey) - For supporting actions, secondary information, backgrounds.
*   **Accent:** #9CCC65 (Light Green) - For highlights, indicators, and subtle call-to-actions.
*   **Success:** #8BC34A
*   **Warning:** #FFC107
*   **Error:** #E57373
*   **Neutral Scale:** #ECEFF1 (Lightest), #CFD8DC, #78909C, #37474F (Darkest) - For text, borders, backgrounds.

**Interactive Visualizations:**

- Color Theme Explorer: [ux-color-themes.html](./ux-color-themes.html)

### 3.2 Typography System

**Font Families:**
*   **Sans-serif:** A modern, clean sans-serif font (e.g., Inter, default for shadcn/ui) for all headings and body text, ensuring readability and a contemporary feel.
*   **Monospace:** A clear monospace font (e.g., Fira Code, Space Mono) for displaying code snippets, data, or technical information.
**Type Scale:** A well-defined typographic scale (e.g., based on a 1.25x or 1.333x ratio) will be used to establish visual hierarchy from H1 to H6, body text, and smaller utility text, ensuring consistent sizing and optimal legibility across the application.
**Font Weights:** Regular (400), Medium (500), Semi-bold (600), and Bold (700) will be used judiciously for emphasis and readability.
**Line Heights:** Optimized for comfortable reading, typically 1.5 for body text.

### 3.3 Spacing & Layout Foundation

**Base Unit:** A consistent 4px base unit for all spacing, margins, and padding, promoting modularity and harmony in the design.
**Spacing Scale:** Leveraging Tailwind CSS's default spacing scale (e.g., `space-x-1` for 4px, `space-x-2` for 8px), offering a comprehensive set of predefined values for efficient and consistent spacing.
**Layout Grid:** A flexible 12-column grid system will be implemented to facilitate responsive layouts across various screen sizes, easily integrated using Tailwind CSS utilities (e.g., `grid grid-cols-12`).
**Container Widths:** Responsive `max-w` utility classes (e.g., `max-w-screen-xl`, `max-w-screen-2xl`) will define optimal content widths, ensuring readability and visual balance on different devices.

---

## 4. Design Direction

### 4.1 Chosen Design Approach

**Chosen Direction:** Hybrid: Engaging & Visual (Direction #2) with elements of Clean & Structured (Direction #1)

**Layout Decisions:**
*   **Navigation Pattern:** (To be determined, but lean towards clear, organized navigation for effortless access).
*   **Content Structure:** Predominantly card-based for visual engagement and scannability, but arranged in a clear, organized, and data-focused grid or list to prevent visual clutter.
*   **Content Organization:** Card-based for key information (e.g., progress, next activity), list-based for detailed plans.

**Hierarchy Decisions:**
*   **Visual Density:** Balanced, aiming for a moderate amount of information per screen, prioritizing clarity over density.
*   **Header Emphasis:** Clear and concise headers, using the chosen typography system to establish hierarchy.
*   **Content Focus:** Mix of visual elements (progress charts, icons) and concise text for data presentation.

**Interaction Decisions:**
*   **Primary Action Pattern:** Clear call-to-action buttons for logging and plan interaction.
*   **Information Disclosure:** Progressive disclosure for details, showing key information upfront and allowing users to dive deeper.
*   **User Control:** Direct and intuitive controls for logging and plan adjustments.

**Visual Style Decisions:**
*   **Weight:** Balanced, moderate use of color (from the "Calm & Focused" palette) and subtle shadows to highlight interactive elements.
*   **Depth Cues:** Subtle elevation (shadows) for cards and interactive elements.
*   **Border Style:** Subtle borders to define sections and cards, contributing to a clean feel.

**Rationale:** This hybrid approach combines the motivational aspect of engaging visuals and card-based layouts with the necessity for a clean, organized, and data-focused presentation. It aims to inspire users while maintaining clarity and efficiency, aligning with the "Motivating Feedback" and "Effortless Efficiency" principles.
**User Notes:** Take the engaging visuals and card-based layout from Direction #2, but aim for a slightly more organized and data-focused presentation similar to Direction #1, avoiding too much visual clutter.

**Interactive Mockups:**

- Design Direction Showcase: [ux-design-directions.html](./ux-design-directions.html)

---

## 5. User Journey Flows

### 5.1 Critical User Paths

**User Journey: User Onboarding & First Plan Generation**

*   **User Goal:** A new user signs up, sets their core goals, and receives their first personalized workout and meal plan to immediately begin their health journey.
*   **Approach:** A blend of **Wizard/Stepper** for essential onboarding (account setup, core goals) and **Progressive Disclosure** for more advanced profile details (introduced after initial plan generation). This prioritizes getting the user to value quickly while allowing for deeper personalization over time.

**Flow Steps:**

1.  **Entry Point (Landing Page):**
    *   **User Sees:** A clear, engaging landing page communicating the value proposition ("AI coach for personalized fitness and meal plans").
    *   **User Does:** Clicks a prominent "Get Started" or "Sign Up" Call-to-Action (CTA).
    *   **System Responds:** Navigates to the account creation wizard step.

2.  **Step 1 (Wizard): Account Setup**
    *   **User Sees:** Input fields for Email and Password. Standard UI elements with clear labels and hints.
    *   **User Does:** Enters desired email and password, then submits.
    *   **System Responds:** Creates account, sends email verification link. Displays standard loading indicators and success/error messages.

3.  **Email Verification:**
    *   **User Sees:** Instructions to check their email for a verification link. A clear message indicating they cannot proceed without verification.
    *   **User Does:** Clicks the verification link in their email.
    *   **System Responds:** Confirms email verification and redirects back to the application, typically to the next wizard step.

4.  **Step 2 (Wizard): Core Profile & Goals**
    *   **User Sees:** A progressive form with friendly, encouraging language and a clear progress indicator (e.g., "Step 1 of 3"). Input options for:
        *   Primary Fitness Goal (e.g., Lose Weight, Build Muscle, Maintain Fitness).
        *   Core Dietary Preference (e.g., Omnivore, Vegetarian, Vegan, Pescatarian).
        *   Basic Activity Level (e.g., Sedentary, Lightly Active, Moderately Active, Very Active).
    *   **User Does:** Selects their preferences for each question, progressing through the mini-steps.
    *   **System Responds:** Saves choices, provides visual cues of saving (e.g., checkmarks, subtle animations).

5.  **Plan Generation:**
    *   **User Sees:** A brief, engaging message or animation indicating "Generating your personalized plan...".
    *   **System Responds:** The AI processes the user's input and generates the initial "diagnostic" workout and meal plan.

6.  **Success State (Dashboard):**
    *   **User Sees:** Immediately redirected to their personalized dashboard, prominently displaying their first week's workout and meal plan. A friendly welcome message explains that this is their "diagnostic" plan and will adapt based on their feedback.
    *   **System Responds:** Dashboard loads, plan is rendered.

**Decision Points:**
*   Successful email verification is required before proceeding to core profile setup.
*   Completion of essential onboarding questions is required before plan generation.

**Error States & Recovery:**
*   **Sign-up/Login Errors:** Clear, concise error messages (e.g., "Invalid email or password"), with accessible password reset options.
*   **Onboarding Input Errors:** Real-time input validation and clear messages if a field is incorrect. Ability to easily go back to previous steps in the wizard.
*   **Plan Generation Failure:** A friendly message communicating a temporary issue, with options to retry, contact support, or a fallback to a generic starter plan.

---

### Other Critical User Paths (To be designed):

*   Weekly Plan Review & Progress Logging
*   Plan Adaptation & Next Week's Plan
*   Manual Plan Adjustment

---

## 6. Component Library

### 6.1 Component Strategy

Our component library strategy will primarily leverage **shadcn/ui**, given its compatibility with Tailwind CSS and its focus on providing accessible, unstyled primitives for building custom UIs. This allows us to maintain a balance between rapid development with good defaults and the flexibility to achieve a unique, clean, and modern look.

**Required Components from shadcn/ui (or built using its primitives):**
*   **Action Elements:** Buttons (Primary, Secondary, Accent, Success, Error), Checkboxes.
*   **Data Input:** Input fields (Text, Email, Password), Selects (for goals, preferences), Radio buttons.
*   **Feedback & Status:** Progress indicators (Spinners, Progress Bars), Modals/Dialogs, Notifications (Toasts), Alerts.
*   **Layout & Content:** Cards (for dashboard items, plan entries), Header, Footer, basic Navigation elements, Form elements, Tabs, Accordions.
*   **Typography:** All standard text elements (h1-h6, p, blockquote, etc.).

**Custom Components / Heavily Customized Components:**
Due to the AI-centric and personalized nature of the application, several components will require custom design and implementation or significant customization of `shadcn/ui` primitives.

**Custom Component Specification: AI Coach Interaction / Chat Bubble**

*   **Component Name:** AI Coach Interaction / Chat Bubble
*   **Purpose:** To display conversational AI guidance, provide proactive insights, and allow users to interact with the AI coach through prompts or quick actions, central to the "AI coach in your pocket" experience.

*   **Anatomy:**
    *   **Chat Message Container:** A flexible container for individual messages.
    *   **Avatar/Icon:** Small AI avatar for AI messages, user avatar/initials for user messages.
    *   **Message Text:** Displays the core content (AI guidance, user input).
    *   **Quick Action Buttons:** Optional buttons for immediate user interaction.
    *   **Input Field:** Text area for users to type direct questions/prompts.
    *   **Send Button:** To submit user input.

*   **States:**
    *   **Default (AI Message):** Message bubble (left-aligned) with AI avatar, text content. Uses a distinct background color (e.g., `secondary-color`).
    *   **Default (User Message):** Message bubble (right-aligned) with user avatar/initials, text content. Uses `primary-color` background.
    *   **Loading:** Displays a loading indicator (spinner or pulsating dots) within the AI message bubble when AI is processing input or generating a response.
    *   **Error:** AI message bubble with error styling (e.g., `error-color` background, error icon) if AI response fails or an action cannot be completed.
    *   **Interactive (Quick Actions):** Quick action buttons are visible and clearly clickable below the AI message.
    *   **Dismissed:** Message is visually subdued or archived.

*   **Variants:**
    *   **Proactive Prompt:** AI-initiated message, often appearing in the dashboard or contextually, potentially with quick actions.
    *   **Reactive Response:** AI message in response to a user's direct question/prompt.
    *   **Action-Oriented:** AI message specifically designed to solicit a quick user action, featuring prominent buttons.
    *   **Contextual Data Integration:** AI messages can embed or reference contextual data (e.g., "Your plan has been updated...").

*   **Behavior:**
    *   **User Input:** Typing in the input field, pressing Enter/Send button.
    *   **Quick Action Interaction:** Clicking a quick action button triggers a predefined action or AI prompt.
    *   **Scrolling:** Standard chat scrolling behavior.
    *   **Dismissal:** Mechanism for user to dismiss or archive proactive prompts.

*   **Accessibility:**
    *   **ARIA Role:** Implement `role="log"` or `role="feed"` for the chat transcript, and appropriate ARIA labels for messages and interactive elements.
    *   **Keyboard Navigation:** Input field and quick action buttons must be fully keyboard navigable.
    *   **Screen Reader:** Messages should be clearly announced by screen readers, differentiating AI and user messages. Descriptive `aria-label` for quick action buttons.
    *   **Color Contrast:** All text and interactive elements must meet WCAG contrast ratio requirements.

---

## 7. UX Pattern Decisions

### 7.1 Consistency Rules

Establishing consistent UX patterns is crucial for an intuitive and efficient user experience, preventing confusion and reinforcing the sense of "Effortless Efficiency" and "Intelligent Guidance." These patterns will be based on shadcn/ui defaults and customized to fit the "Calm & Focused" theme.

*   **BUTTON HIERARCHY:**
    *   **Primary Action:** Solid background using `primary-color` with `primary-text` color. Used for main Call-to-Actions (CTAs) that drive the user's primary goals (e.g., "Generate New Plan," "Log Workout").
    *   **Secondary Action:** Outlined or ghost button style with `primary-color` text and border. Used for important but less prominent actions (e.g., "Edit Profile," "Cancel," "View Details").
    *   **Tertiary Action:** Text-only button style, often for navigation within content, less critical actions, or subtle links.
    *   **Destructive Action:** Solid background using `error-color` with white text. Used for irreversible actions (e.g., "Delete Account," "Remove Item").
    *   *Rationale:* Clear visual hierarchy to guide users to most important actions and prevent accidental choices.

*   **FEEDBACK PATTERNS:**
    *   **Success:** Transient toast notification (top-right or bottom-center) for non-critical confirmations (e.g., "Workout Logged!"). Uses `success-color` for accent/icon.
    *   **Error:** Toast notification for minor errors. For critical form errors, inline messages directly below the problematic field, or a persistent alert banner at the top of the screen. Uses `error-color` for accent/icon.
    *   **Warning:** Toast notification or inline message for non-blocking issues or cautionary advice. Uses `warning-color` for accent/icon.
    *   **Info:** Toast notification for general information or contextual hints. Uses a neutral accent color.
    *   **Loading:** Small spinners for brief waits. Skeleton screens for longer content loading (e.g., dashboard data). Progress bars for longer, multi-step processes (e.g., AI plan generation).
    *   *Rationale:* Provide timely, clear, and context-appropriate feedback to users, reinforcing effortless efficiency.

*   **FORM PATTERNS:**
    *   **Label Position:** Top-aligned labels (above input fields) for optimal scannability and quick completion, especially in multi-step onboarding.
    *   **Required Field Indicator:** A small, non-obtrusive asterisk (*) next to the label.
    *   **Validation Timing:** On blur (when user leaves field) for immediate feedback, and on submit for comprehensive validation.
    *   **Error Display:** Inline error messages directly below the problematic input field, using `error-color` text.
    *   **Help Text:** Concise, neutral-colored helper text below the label or input for guidance. Tooltips can be used for more complex explanations.
    *   *Rationale:* Intuitive input, guiding users through data entry efficiently and clearly.

*   **MODAL PATTERNS:**
    *   **Size Variants:**
        *   **Small:** For simple confirmations, alerts, or very short forms.
        *   **Medium:** For most forms, settings, or detailed information displays.
        *   **Large:** For complex tasks, multi-step processes within a modal, or detailed plan customization.
    *   **Dismiss Behavior:** Click outside the modal or pressing the ESC key should dismiss the modal (except for critical confirmations that require explicit action). An explicit "Close" or "Cancel" button should also be provided.
    *   **Focus Management:** Focus should automatically shift to the first interactive element inside the modal upon opening. Tab key navigation should be trapped within the modal until it is closed.
    *   **Stacking:** Only one primary modal should be open at a time. If a secondary modal is needed (e.g., for a sub-action), the first should dim further or be replaced.
    *   *Rationale:* Predictable and accessible behavior for interruptions and focused tasks.

*   **NAVIGATION PATTERNS:**
    *   **Active State Indication:** The currently active navigation item (e.g., Dashboard, Plans, Profile) should be clearly highlighted using the `accent-color` or `primary-color`, along with bolder text or a distinct background.
    *   **Breadcrumb Usage:** Used for multi-level navigation paths within specific content areas (e.g., within a detailed workout plan).
    *   **Back Button Behavior:** A consistent in-app back button (e.g., in the header) for navigating within the application's specific flow. The browser's back button should also function as expected.
    *   **Deep Linking:** All key pages and views should be deep-linkable to allow users to share or return to specific content easily.
    *   *Rationale:* Enables users to easily understand their location within the application and navigate effortlessly.

*   **EMPTY STATE PATTERNS:**
    *   **First Use:** Welcoming messages with clear Call-to-Actions (e.g., "Generate your first plan!," "Start your health journey!").
    *   **No Results:** Informative messages ("No workouts found matching your criteria") with clear options to adjust filters, search again, or create new content.
    *   **Cleared Content:** Messages indicating content is empty, possibly with an "Undo" option if applicable, or a CTA to add new content.
    *   *Rationale:* Provide helpful context and guide users to take action when there is no content to display.

*   **CONFIRMATION PATTERNS:**
    *   **Delete/Destructive:** Always require explicit confirmation (via a small modal or a transient toast with an "Undo" action) for any user-generated content deletion or account-level irreversible actions.
    *   **Leave Unsaved:** Prompt the user to save changes or discard when navigating away from a form with unsaved data. Autosave functionality will be considered for long or critical forms.
    *   **Irreversible Actions:** Require a clear, explicit confirmation with the consequences stated clearly.
    *   *Rationale:* Protect users from accidental data loss and ensure informed decision-making.

*   **NOTIFICATION PATTERNS:**
    *   **Placement:** Toast notifications for transient messages (e.g., "Settings updated!") in the top-right or bottom-center. Persistent notifications (e.g., "New plan ready") in a dedicated in-app notification center or banner.
    *   **Duration:** Auto-dismissal for toasts (3-5 seconds). Manual dismissal for important alerts.
    *   **Stacking:** Toast notifications should stack neatly without overlapping, displaying the most recent at the top.
    *   **Priority Levels:** Visual cues (color, icon) to differentiate critical (error), important (warning, success), and informational messages.
    *   *Rationale:* Provide timely and non-disruptive information delivery, aligning with "Intelligent Guidance."

*   **SEARCH PATTERNS:**
    *   **Trigger:** Dedicated search icon/input in a consistent header for global search. Inline search fields for filtering specific lists or tables.
    *   **Results Display:** Instant, as-you-type suggestions (autocomplete) where applicable. A dedicated results page for more complex searches.
    *   **Filters:** Side panel or dropdowns for applying filters to search results.
    *   **No Results:** Helpful message ("No items found for 'xyz'") with suggestions or a call to action to broaden the search.
    *   *Rationale:* Efficient and intuitive information retrieval, enhancing effortless efficiency.

*   **DATE/TIME PATTERNS:**
    *   **Format:** User's locale-specific format (e.g., DD/MM/YYYY, MM/DD/YYYY) will be used for display.
    *   **Timezone Handling:** All backend operations will store dates/times in UTC, but display will be converted to the user's local timezone.
    *   **Pickers:** Calendar-based date pickers for selecting dates. Dropdowns or numerical inputs for time selection.
    *   *Rationale:* User-friendly and globally consistent for time-sensitive data.

---

## 8. Responsive Design & Accessibility

### 8.1 Responsive Strategy

Our responsive design strategy is tailored to provide an optimal and consistent user experience across various device sizes, adapting the UI gracefully while adhering to the "Calm & Focused" theme and hybrid design direction.

**Breakpoints (based on Tailwind CSS defaults):**
*   **Mobile (≤767px - `sm` breakpoint):**
    *   **Layout:** Single-column, highly scannable content. Multi-column layouts will collapse vertically.
    *   **Navigation:** Prominent bottom navigation for primary sections, ensuring easy thumb access.
    *   **Interactions:** All interactive elements will have adequate touch target sizes (minimum 44x44px) for mobile usability.
    *   **Adaptation:** Modals will likely become full-screen sheets, tables may convert to card views or allow horizontal scrolling.

*   **Tablet (768px - 1023px - `md` to `lg` breakpoints):**
    *   **Layout:** Primarily single-column for main content in portrait mode. Two-column layouts may be considered for specific elements in landscape, balancing information density with readability.
    *   **Navigation:** Top navigation bar for main sections, or a hidden sidebar accessible via a hamburger menu.
    *   **Interactions:** Touch-optimized interactions, ensuring elements are easily tappable and gestures are intuitive.

*   **Desktop (≥1280px - `xl` breakpoint):**
    *   **Layout:** Multi-column layouts, particularly for dashboards and overview screens, to present more information and visualizations side-by-side without clutter.
    *   **Navigation:** Persistent left-side navigation for main sections (Dashboard, Plans, Profile) for quick and efficient access.
    *   **Content:** Richer data visualizations and more detailed information presented side-by-side, leveraging the larger screen real estate.

### 8.2 Accessibility Strategy

Accessibility ensures that the application is usable by everyone, including people with disabilities.

**Compliance Target:** WCAG 2.1 Level AA. This level ensures broad accessibility and meets common legal requirements for public-facing applications.

**Key Requirements:**
*   **Color Contrast:** Ensure sufficient color contrast for all text and interactive elements.
    *   Normal text: Minimum contrast ratio of 4.5:1 against its background.
    *   Large text (18pt / 24px or 14pt bold / 18.5px bold): Minimum contrast ratio of 3:1.
    *   Non-text contrast (e.g., icons, UI components): Minimum 3:1.
*   **Keyboard Navigation:** All interactive elements (buttons, links, form fields, navigation) must be accessible and operable using only a keyboard. Clear visual focus indicators will be provided for all interactive elements.
*   **ARIA Labels:** Use meaningful ARIA attributes to enhance semantics for screen readers, especially for dynamic content, custom components, and complex interactions.
*   **Alt Text:** Provide descriptive alternative text for all meaningful images, charts, and visual content. Decorative images will have empty alt attributes.
*   **Form Labels:** All form input fields will have properly associated, visible labels. Error messages will be clearly linked to their respective input fields.
*   **Error Identification:** Error messages will be clear, descriptive, and programmatically determinable for screen readers.
*   **Touch Target Size:** Minimum touch target size of 44x44px for all interactive elements on mobile and touch devices.
*   **Headings:** Use a logical and consistent heading structure (`<h1>` to `<h6>`) to convey content hierarchy.

**Testing Strategy:**
*   **Automated Testing:** Utilize tools like Google Lighthouse and axe DevTools during development and continuous integration to catch common accessibility issues.
*   **Manual Testing:** Regular manual testing will be conducted, including:
    *   Keyboard-only navigation testing for all user flows.
    *   Screen reader testing with popular tools (e.g., NVDA, JAWS on Windows; VoiceOver on macOS/iOS) to verify content and interaction flow.
    *   Color contrast checks using specialized tools.
*   **User Testing:** Incorporate users with diverse abilities in user testing phases where feasible.

---

## 9. Implementation Guidance

### 9.1 Completion Summary

Excellent work! Your UX Design Specification is complete.

**What we created together:**

-   **Design System:** `shadcn/ui`, leveraging its accessible primitives and Tailwind CSS compatibility.
-   **Visual Foundation:** "Calm & Focused" color theme, a modern sans-serif typography system, and a 4px base spacing with a flexible 12-column grid.
-   **Design Direction:** A hybrid approach combining the "Engaging & Visual" aspects with the "Clean & Structured" feel, using card-based layouts with organized, data-focused presentation.
-   **User Journeys:** The "User Onboarding & First Plan Generation" flow was designed, utilizing a blended Wizard/Stepper and Progressive Disclosure approach.
-   **UX Patterns:** A comprehensive set of consistency rules defined for buttons, feedback, forms, modals, navigation, empty states, confirmations, notifications, search, and date/time patterns.
-   **Component Strategy:** Defined common components from shadcn/ui and detailed the specification for the custom "AI Coach Interaction / Chat Bubble" component.
-   **Responsive Strategy:** Tailored for Desktop, Tablet, and Mobile with specific breakpoint considerations and adaptation patterns.
-   **Accessibility:** WCAG 2.1 Level AA compliance target with key requirements and testing strategies defined.

**Your Deliverables:**

-   UX Design Document: `docs/ux-design-specification.md`
-   Interactive Color Themes: `docs/ux-color-themes.html`
-   Design Direction Mockups: `docs/ux-design-directions.html`

**What happens next:**

-   Designers can create high-fidelity mockups from this foundation.
-   Developers can implement with clear UX guidance and rationale.
-   All your design decisions are documented with reasoning for future reference.

You've made thoughtful choices through visual collaboration that will create a great user experience. Ready for design refinement and implementation!

---

## Appendix

### Related Documents

- Product Requirements: `PRD.md`
- Product Brief: ``
- Brainstorming: ``

### Core Interactive Deliverables

This UX Design Specification was created through visual collaboration:

- **Color Theme Visualizer**: ux-color-themes.html
  - Interactive HTML showing all color theme options explored
  - Live UI component examples in each theme
  - Side-by-side comparison and semantic color usage

- **Design Direction Mockups**: ux-design-directions.html
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

| Date     | Version | Changes                         | Author        |
| -------- | ------- | ------------------------------- | ------------- |
| søndag 23. november 2025 | 1.0     | Initial UX Design Specification | BIP |

---

_This UX Design Specification was created through collaborative design facilitation, not template generation. All decisions were made with user input and are documented with rationale._
### Prompt for Third-Party Mockup Application:

**Subject: UI Mockup for "Key Screens Showcase" (Post-Onboarding)**

**Application Concept:** An AI-powered fitness and meal planning app called "AI Fitness & Meal Planner". The app acts as a personal AI coach.

**Core Design Principles:**
- **Aesthetic:** Clean, modern, encouraging, and highly polished. Uses the "Coach's Feed" design direction.
- **Tone:** Supportive, professional, and clear. Feels like a friendly, expert coach guiding you.
- **Novel Pattern:** "Proactive AI Coaching" is central to the interaction.

**Visual Foundation:**
- **Color Palette (Light Mode, as default for these mockups):**
    - **Primary Accent:** `#4299E1` (Energetic Blue for buttons, links, and highlights).
    - **Background:** `#F7FAFC` (a very light, subtle gray).
    - **Card Background:** `#FFFFFF` (White).
    - **Text:** `#1A202C` (Near Black).
    - **Borders:** `#E2E8F0` (Light Gray).
- **Typography:**
    - **Font:** System UI Font.
    - **Hierarchy:** Clear hierarchy.
- **Spacing:** Consistent 8px grid system.
- **Component Style:** Based on `shadcn/ui`. Clean, modern components with sharp but slightly rounded corners.
- **Custom Component:** **`HybridFeedCard`** is the core UI element.

**Key Screens to Mockup:**

**Screen 1: Main Dashboard / Coach's Feed (Home Screen)**
- **Overall Layout:** Chronological feed, single column, like a social media feed but for fitness.
- **Navigation:** Visible sidebar on the left for primary sections (Dashboard, Plan, Progress, Profile) if desktop/laptop view.
- **Content:** Display a mix of `HybridFeedCard` variants in a scrolling feed:
    - **Coach Card (🤖):** A "Your New Weekly Plan is Ready!" message (blue accent).
    - **User Log Card (👍):** A "Workout Logged: Full Body Strength" (green accent).
    - **Coach Card (🤖):** A "Coaching Tip: Remember to hydrate!" (blue accent).
    - **Reward Card (🏆):** An "Achievement Unlocked: 7-Day Streak!" (gold/yellow accent).
    - **Coach Card (🤖):** A "Meal Planned: Chicken & Veggies for Dinner" (blue accent).
- **Interactions:** Each card should have contextual actions (e.g., "Log Workout" button on a planned workout card, "View Details" on an achievement card).

**Screen 2: Logging Interaction (Expanded Workout Card)**
- **Overall Layout:** Same "Coach's Feed" as Screen 1.
- **Focus:** Show a `HybridFeedCard` representing a planned workout, but in its **expanded logging state**.
- **Coach Card Header (🤖):** "Today's Workout: Upper Body Focus"
- **Content (Expanded):**
    - Workout details (e.g., "Bench Press: 3 sets x 8 reps").
    - Input fields visible:
        - Reps Input (e.g., "8, 8, 7")
        - Weight Input (e.g., "60kg, 60kg, 55kg")
        - Difficulty Rating (e.g., 1-5 slider or radio buttons).
    - A prominent "Log Workout" button.
- **Context:** The card should appear within the feed, perhaps with other (non-expanded) feed items above and below it.

**Screen 3: Profile/Settings Screen**
- **Overall Layout:** A clean, organized screen, possibly accessed via the sidebar navigation.
- **Heading:** "Your Profile" or "Settings"
- **Content:**
    - Sections for "Personal Info", "Fitness Goals", "Dietary Preferences".
    - Input fields (using `shadcn/ui` style) for editing details.
    - Examples: User's name, primary fitness goal (selectable, like in onboarding), dietary preferences (selectable).
    - Clear "Save Changes" (primary blue button) and "Cancel" (secondary button) actions.

**Screen 4: Achievement / Reward Screen (Potentially within the feed, or a dedicated view)**
- **Overall Layout:** Can be part of the main feed (as a `HybridFeedCard`) or a dedicated screen. Let's aim for a dedicated view accessible from the main navigation for this showcase.
- **Heading:** "Your Achievements"
- **Content:**
    - Display multiple **Reward Variant HybridFeedCards (🏆)**.
    - Example Achievements: "First Week Complete!", "30-Day Streak!", "New Personal Best: Bench Press", "Hydration Hero!".
    - Each achievement card has an icon, title, date achieved, and maybe a subtle share button.
    - Consider a celebratory background or a small animation for the overall screen.

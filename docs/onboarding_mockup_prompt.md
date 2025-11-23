### Prompt for Third-Party Mockup Application:

**Subject: UI Mockup for a "New User Onboarding" Journey**

**Application Concept:** An AI-powered fitness and meal planning app called "AI Fitness & Meal Planner". The app acts as a personal AI coach.

**Core Design Principles:**
- **Aesthetic:** Clean, modern, encouraging, and highly polished.
- **Tone:** Supportive, professional, and clear. Feels like a friendly, expert coach guiding you.

**Visual Foundation:**
- **Color Palette (Light Mode):**
    - **Primary Accent:** `#4299E1` (Energetic Blue for buttons, links, and highlights).
    - **Background:** `#F7FAFC` (a very light, subtle gray).
    - **Card/Form Background:** `#FFFFFF` (White).
    - **Text:** `#1A202C` (Near Black).
    - **Borders:** `#E2E8F0` (Light Gray).
- **Typography:**
    - **Font:** System UI Font (like Segoe UI, San Francisco, Roboto). Clean and readable.
    - **Hierarchy:** Clear hierarchy. Large, bold headings for screen titles, smaller subheadings, and standard body text.
- **Spacing:** Use a consistent 8px grid system for all spacing and and alignment. The design should feel airy and uncluttered.
- **Component Style:** Based on `shadcn/ui`. This means clean, modern components with sharp but slightly rounded corners.

**User Journey to Mockup: The "Wizard/Stepper" Onboarding**

Please generate a sequence of 5 screens demonstrating the following user flow. A progress bar or "Step X of 5" indicator should be visible throughout.

**Screen 1: Welcome**
- **Content:** A friendly welcome message.
- **Heading:** "Welcome to your AI Fitness Coach"
- **Body Text:** "Let's get to know you. In just a few steps, we'll create a personalized 'diagnostic' plan to calibrate the AI to your unique needs."
- **Action:** A single, prominent primary button with the text "Let's Go".

**Screen 2: Fitness Goals**
- **Content:** A screen for the user to define their primary fitness goal.
- **Heading:** "What's your primary goal?"
- **UI Element:** A list of large, selectable cards or buttons. Each card has an icon and a title.
- **Options:**
    - "Lose Weight"
    - "Build Muscle"
    - "Improve Endurance"
    - "Stay Active"
- **State:** Show one option as "selected" with a blue border or background.
- **Action:** A "Next" button.

**Screen 3: Dietary Preferences**
- **Content:** A screen to select dietary needs.
- **Heading:** "Any dietary preferences?"
- **UI Element:** A list of selectable tags or checkboxes.
- **Options:** "Vegetarian", "Vegan", "Gluten-Free", "No Red Meat". Also, a simple text input field for "Allergies".
- **Action:** "Next" button.

**Screen 4: Fitness Persona**
- **Content:** A crucial step for the user to self-identify their current fitness level.
- **Heading:** "How would you describe yourself?"
- **UI Element:** A list of large, selectable cards, similar to Screen 2.
- **Options:**
    - "Just starting my journey"
    - "Getting back in shape"
    - "Ready for a challenge"
- **Action:** A "Finish" button.

**Screen 5: First Plan Generation**
- **Content:** This screen is shown immediately after the user clicks "Finish". It's a transitional state.
- **UI Element:** Show the main app interface in the background, in a "loading" state. In the center, display a card or modal.
- **Card Content:**
    - **Icon:** A spinning loader or a pulsing robot icon (🤖).
    - **Heading:** "Your AI Coach is crafting your plan..."
    - **Body Text:** "This will just take a moment."
- **Behavior:** This screen should quickly transition to the main app dashboard (which is part of the Key Screens showcase).

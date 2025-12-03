## Case Title

AI Fitness & Meal Planner

## Background

Many people aim to live healthier lives but struggle to find the time, motivation, or financial resources to maintain consistent fitness routines and balanced nutrition. Existing fitness and meal apps often provide generic content or require costly subscriptions for personalization. This project seeks to create an AI-driven web platform that intelligently combines workout and meal planning into a unified experience. By leveraging AI personalization, weekly replanning, and user-specific progress tracking, the platform will act as a digital personal trainer and nutritionist — simple, affordable, and adaptive.

## Purpose

The objective of this project is to develop a comprehensive, AI-assisted web application that automatically generates and adjusts personalized workout and meal plans. Users will receive tailored recommendations based on their fitness goals (e.g., stronger legs, better endurance, weight loss), preferences, and progress over time. The system will enable users to log results, replan weekly, and visualize their improvement, promoting long-term health habits and consistency.

## Target Users

**Primary Users:**

1. Individuals who want structured fitness and meal plans adapted to their goals.
2. People seeking affordable, intelligent alternatives to personal trainers or dietitians.
3. Busy professionals who need automatic weekly fitness and meal organization.

---

## Core Functionality

### Must Have (MVP)

**User Registration and Profile:**

- Secure sign-up with personal data, fitness goals, body metrics, dietary preferences, and allergies.**AI Workout Planner:**
- Generates customized weekly workout routines that adapt dynamically to logged progress (e.g., sets, reps, intensity). Supports user-defined focus areas such as “stronger legs” or “better endurance.”**AI Meal Planner:**
- Suggests weekly meal plans aligned with dietary preferences and fitness goals (e.g., calorie deficit, high protein). Users can replan per week or lock specific meals.**Replanning and Weekly Adjustments:**
- Option to replan workouts or meals at the end of each week. Users can retain certain routines or modify others based on progress.**Dashboard Overview:**
- Unified dashboard displaying weekly plans, progress visualization, history, and total performance overview.**Progress Tracking:**
- Record completed workouts, calories consumed, and weekly statistics; visualize improvements with interactive graphs.**AI Output Format:**
- Structured JSON-like responses defining exercise and meal data for each week.**Basic Offline Support:**
- The app caches the current week's plan for offline viewing.
- Users can log completed activities offline, which syncs upon reconnection.

### Nice to Have (Optional Extensions)

- Chat Assistant for workout, nutrition, and injury guidance.
- Reward system with achievements for consistency and milestones.
- Calendar component for planning and tracking.
- chat-based AI assistant for Q&A.
- Extended analytics and export options (CSV/PDF).

---

## Data Requirements

**User Management:**

- user_id, email, password, name, fitness_goal, dietary_preference, allergies, created_at, last_login

**Workout Plans**

- plan_id, user_id, week_number, goal_type, exercises (JSON), difficulty_level, created_at, last_updated

**Meal Plans**

- plan_id, user_id, week_number, meals (JSON: ingredients, macros, calories), calorie_goal, last_updated

**Progress**

- progress_id, user_id, date, metrics (JSON), weight, calories_burned, workouts_completed

**Rewards**

- reward_id, user_id, type, achieved_at

---

## User Flows

### Flow 0: New User Onboarding

1. User signs up and logs in for the first time.
2. A welcome screen appears, briefly explaining the app's benefits.
3. The user is guided through a multi-step process to set up their profile:
   * **Step 1: Personal Details** (name, age, body metrics).
   * **Step 2: Fitness Goals** (e.g., weight loss, muscle gain, endurance).
   * **Step 3: Dietary Preferences** (e.g., vegetarian, allergies).
4. **Refined Onboarding & First Plan Generation:**
   * After initial profile setup, the user selects a "Fitness Persona" (e.g., "Just starting my journey," "Getting back in shape," "Ready for a challenge").
   * Based on this persona, the AI generates a "diagnostic" first-week plan, explicitly communicating that this week is for "calibrating the AI to your unique fitness level."
   * The first week's plan will include enhanced feedback prompts (e.g., detailed difficulty ratings) to gather richer data.
5. Once the profile is complete, the user is directed to the dashboard, which displays a prompt to generate their first workout and meal plan.

### Flow 1: Plan Workouts

1. User logs in and opens the dashboard.
2. Selects “Plan Workouts.”
3. Chooses goal focus.
   * Users can select a primary and a secondary goal.
4. AI generates a weekly plan.
   * **Scenario: Slow or Failed Generation:**
     * A loading animation with engaging content (e.g., fitness tips) is displayed.
     * If generation fails, a clear error message is shown with a "Retry" button.
     * If generation repeatedly fails, a pre-made "starter" plan is suggested.
5. User reviews the plan.
   * Users can "lock" specific days or exercises they like, so they remain consistent during replanning.
   * **Scenario: Plan Rejection:** If the user dislikes the generated plan, they can select a "Regenerate" option, which prompts the AI to provide a new set of workouts.
6. User accepts the plan.
7. Dashboard updates with the active plan.

### Flow 2: Plan Meals

1. User navigates to Meal Planner.
2. Updates dietary preferences and calorie targets.
   * An in-app calculator or recommendations are available to help users determine their calorie targets.
3. AI generates a weekly meal plan.
   * **Scenario: Slow or Failed Generation:**
     * A loading animation with engaging content (e.g., nutrition facts) is displayed.
     * If generation fails, a clear error message is shown with a "Retry" button.
     * If generation repeatedly fails, a pre-made "starter" meal plan is suggested.
4. User reviews the plan.
   * Users can swap single ingredients in a meal (e.g., "replace chicken with tofu").
   * **Scenario: Plan Rejection:** If the user dislikes the generated plan, they can select a "Regenerate" option, which prompts the AI to provide a new set of meals.
5. System saves the finalized plan and updates the dashboard.

### Flow 3: Log Workouts

1. User logs a completed workout.
   * **Partial Completion:** Users can log a percentage of completion (e.g., "75% complete").
   * **Skipped Workouts:** If a workout is skipped, the AI can suggest rescheduling it or adjust the next week's plan.
   * **Unplanned Workouts:** Users can log unplanned activities using natural language (e.g., "I went for a 30-minute run"), and the AI will interpret and log it.
   * **Workout Substitution:** Users can replace a suggested exercise with another (e.g., "I did squats instead of lunges"). The AI will use this to refine future plans.
   * **Injury or Illness:** Users can mark certain exercises or body parts as unavailable due to injury. The AI will dynamically adjust the current and future plans to avoid strain.
   * **Editing and Deleting Logs:** Users can correct or remove a workout entry after it has been logged.
2. User rates the difficulty of the workout on a scale of 1-5.
3. Dashboard updates workout progress.
4. AI refines the next week’s plan accordingly.

### Flow 4: Log Meals

1. User logs a completed meal.
   * **Partial Completion:** Users can adjust the logged portion (e.g., "ate half").
   * **Skipped Meals:** If a meal is skipped, the AI can adjust calorie targets for the remaining days.
   * **Unplanned Meals:** Users can log unplanned meals using natural language, and the AI will interpret and log it.
   * **Editing and Deleting Logs:** Users can correct or remove a meal entry after it has been logged.
2. Dashboard updates progress and calorie balance.
3. AI refines the next week’s plan accordingly.

### Flow 5: Manage Plan Interruptions

1. User navigates to their profile or settings page.
2. Selects an option to pause or modify their plan.
   * **Scenario: Vacation/Break:** The user can set a "Vacation Mode" for a specified date range. During this period, all notifications and planning are paused. The system resumes normal functionality on the specified return date.
   * **Scenario: Illness:** The user can activate "Sick Mode," which temporarily reduces the intensity and frequency of planned activities and adjusts meal plans for recovery.

### Flow 6: Edit User Profile

1. User navigates to the settings or profile page.
2. Selects the information they wish to update (e.g., Fitness Goals, Allergies, Body Metrics).
3. The user modifies the data and saves the changes.
4. A confirmation message is displayed. The AI uses this new information for all future plan generation.

### Flow 7: Account Management

1. User navigates to the account settings page.
2. **Scenario: Password Reset:**
   * User clicks "Forgot Password" on the login page.
   * They enter their email and receive a password reset link.
3. **Scenario: Change Email:**
   * User enters their new email address and confirms the change via a verification link sent to the new address.
4. **Scenario: Account Deletion:**
   * User selects "Delete Account."
   * A confirmation modal appears, warning that the action is irreversible.
   * Upon confirmation, all user data is permanently deleted in accordance with GDPR.

### Flow 8: View History

1. User navigates to the dashboard or a dedicated "History" page.
2. They can view past workout plans, meal plans, and progress logs.
3. Users can select a previous workout or meal and choose to "reuse" it in their current or future weekly plan.

---

## Technical Constraints

- Web-based platform (optimized for desktop and tablet).
- Secure authentication via Supabase Auth with JWT tokens.
- Cloud storage using Supabase (PostgreSQL).
- End-to-end encryption for sensitive data.
- AI integration for workout and meal generation via API.
- Response time <500ms for non-AI queries.
- Dynamic replanning and persistent data logic.
- **Basic Offline Support:** Current week's plan cached for offline viewing and simple activity logging.

---

## Success Criteria

- Secure authentication and user management.
- AI generates personalized, adaptive workout and meal plans.
- Weekly replanning and progress adjustments function correctly.
- Visual progress tracking over time.
- Clean, minimal UI with intuitive dashboard and charts.

---

## Technical Specifications

### Frontend Specification

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (minimalist design)
- **State Management:** Zustand
- **Visualization:** Recharts (progress, workout and calorie charts)
- **UI Components:** shadcn/ui and calendar components
- **Forms:** React Hook Form + Zod for validation
- **Authentication:** Supabase Auth components with custom styling
- **Realtime Data:** Supabase Realtime for live dashboard updates
- **Hosting:** Vercel (automatic CI/CD)

### Backend Specification

- **Framework:** FastAPI (Python)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (JWT + email verification)
- **Authorization:** Row Level Security (RLS) policies in Supabase
- **ORM:** SQLAlchemy with Alembic migrations
- **AI Integration:** Pydantic AI framework with Gemini 2.5 pro/flash for structured plan generation
- **API Documentation:** Auto-generated with Swagger/OpenAPI
- **Testing:** Pytest for backend logic
- **Deployment:** Vercel (FastAPI adapter)

### Database Specification

- **Database Type:** Supabase (PostgreSQL-based relational database)
- **ORM:** SQLAlchemy for Python-based, type-safe database access
- **Migrations:** Alembic for version-controlled database schema updates
- **Hosting:** Supabase managed cloud (includes automatic backups, scaling, and monitoring)

**Schema Design:**

- **Normalized relational schema** with proper foreign key relationships between users, workouts, meals, and progress tables
- **Row Level Security (RLS):** Supabase RLS policies ensure that users can only access their own data (plans, progress, and metrics)
- **Indexes** on frequently queried fields (user_id, plan_id, week_number) for faster lookups
- **JSONB columns** for flexible data storage of structured AI-generated plans (workouts, meals, and progress metrics)
- **Partitioning** of progress or activity logs if data volume increases significantly (future optimization)
- **Soft deletes** implemented for user-related data to maintain GDPR compliance
- **Supabase Auth integration:** Users table managed by Supabase Auth, extended with profile data (fitness goals, dietary preferences, activity level, etc.)

**Supabase-Specific Features:**

- **Real-time subscriptions:** Frontend can subscribe to updates in workouts, meals, or progress tables for live dashboard refreshes
- **RLS Policies:**
  - Each user can only view and modify their own workout and meal data
  - (Optional) Admin users can view anonymized aggregated data for performance insights or testing

### AI Integration Specification

**AI Use Cases:**

1. **Workout Plan Generation:** Generate personalized weekly workout routines based on user fitness goals, performance history, and preferences.
2. **Meal Plan Generation:** Create individualized meal plans adapted to calorie targets, dietary preferences, and nutritional needs.
3. **Progress Adjustment:** Recalculate workout intensity, exercise variety, and nutritional recommendations weekly according to user progress.
4. **Feedback Generation:** Provide personalized feedback and motivational guidance to improve adherence and engagement.
5. **Performance Analysis:** Generate insights on user consistency, progress trends, and overall goal achievement.

**Implementation:**

- **Model:** Pydantic AI framework with Gemini 2.5 pro/flash API for plan generation, personalization, and content creation.
- **Prompt Design:**
  - Workout generator receives user metrics (age, weight, goal, activity level) and current progress data.
  - Meal generator receives dietary preferences, calorie targets, and meal history.
  - Few-shot examples ensure consistent, structured output in JSON format.
- **Rate Limiting:** Implement request queuing and caching to optimize performance and reduce API cost.
- **Fallback:** Default plan templates are used if the AI service becomes unavailable.
- **Cost Management:** Usage monitoring and API call limits configured to ensure predictable expenses.

**API Integration Architecture:**

- Dedicated backend service layer for AI communication (FastAPI service).
- Retry logic with exponential backoff for failed API calls.
- Strict response validation and sanitization before storing results in Supabase.
- Caching of repeated or similar prompt responses for faster results and cost efficiency.

### Platform Type

**Primary Platform:**
Web application (browser-based)

**Target Devices:**

- Desktop computers (primary): Windows, macOS, Linux
- Laptops (primary): All operating systems
- Tablets (secondary): iPad, Android tablets (landscape orientation recommended)
- Mobile phones (future): iOS and Android via responsive design or dedicated apps

**Browser Compatibility:**

- Chrome 90+ (primary testing target)
- Firefox 88+
- Safari 14+
- Edge 90+

**Responsive Breakpoints:**

- Desktop: 1280px+ (optimal experience)
- Laptop: 1024px-1279px (full features)
- Tablet: 768px-1023px (adapted layout)
- Mobile: 375px-767px (future phase - simplified UI)

### User Authentication Specification

**Authentication Method:**
Supabase Auth with JWT-based authentication for secure user identity and session management.

**Features:**

- Email/password registration with built-in validation
- Automatic email verification via Supabase Auth email templates
- Secure password reset flow using magic links
- Session management with automatic refresh token rotation
- “Remember me” functionality via Supabase persistent sessions
- Account lockout and rate limiting integrated into Supabase Auth
- User metadata storage for roles (user/admin) and fitness preferences

**Implementation Details:**

- Passwords automatically hashed by Supabase using bcrypt
- JWT access tokens managed by Supabase (automatic expiry and refresh)
- Refresh tokens securely stored in httpOnly cookies
- Role-based access control via Supabase user metadata combined with RLS policies
- OAuth 2.0 support (Google, Apple, GitHub) available through configuration

**Supabase Auth Benefits:**

- Built-in security best practices (password hashing, token lifecycle management)
- Automatic rate limiting on authentication endpoints
- CAPTCHA support to prevent automated attacks
- Optional Multi-Factor Authentication (MFA) for enhanced security
- Customizable email templates for branding and user engagement
- User management dashboard within the Supabase console

**Security Measures:**

- HTTPS enforced across Supabase and Vercel environments
- CSRF protection on all authentication-related forms
- Mandatory email verification before granting full account access
- Configurable password strength and complexity requirements
- Row Level Security (RLS) ensures users can only access their own data
- Supabase API keys separated (public anon key vs. service role key)

---

## Timeline and Milestones

**Total Duration**: 5 weeks following BMAD-methodology (4-phase model)

This timeline follows the 4-phase model of the BMAD-methodology, where phases 1 and 2 are done in 1 week, phase 3 is done in 2 weeks, and phase 4 is done in 2 weeks.

| Phase                                           | Duration | Week       | Focus                                                              |
| ----------------------------------------------- | -------- | ---------- | ------------------------------------------------------------------ |
| Phase 1 & 2: Analyze and Planning               | 1 week   | Week 44    | Requirements analysis, project planning, stakeholder alignment     |
| Phase 3: Solution Architecture and UI/UX Design | 2 weeks  | Week 45-46 | Technical architecture, database design, UI/UX mockups, API design |
| Phase 4: Development and Deployment             | 2 weeks  | Week 47-48 | Implementation, testing, deployment                                |

---

### Phase 1 & 2: Analysis and Planning (Week 44)

**Lead Roles:** Product Owner (PO), Analyst
**Supporting Roles:** Project Manager (PM), Researcher

**Activities:**

- Requirement gathering and user research (fitness enthusiasts, nutrition-conscious users)
- Competitive analysis of existing fitness and meal planning platforms
- Identification of key differentiators (AI personalization, weekly replanning)
- MVP scope definition and feature prioritization
- Risk analysis and mitigation strategies
- Project charter, milestone timeline, and budget estimation (AI API usage, hosting)

**Deliverables:**

- Requirements and goal definition document
- Competitive analysis report
- User personas and journey maps
- Prioritized MVP feature list
- Risk register with mitigation plan
- Project plan and timeline overview

---

### Phase 3: Architecture and Design (Week 45–46)

**Lead Roles:** System Architect, UI/UX Designer
**Supporting Roles:** PM, Developer

#### Week 45: Technical Architecture

**Activities:**

- Database schema design (users, workouts, meals, progress, rewards)
- API endpoint specification (authentication, AI generation, data retrieval)
- System architecture diagram (frontend, backend, Supabase, AI service)
- Technology stack validation (Next.js, FastAPI, Supabase, Pydantic AI framework with Gemini 2.5 pro/flash API)
- AI integration design (prompt structure and JSON response validation)
- Authentication and authorization flow setup
- Security planning (JWT, RLS, encryption, GDPR compliance)
- Development environment configuration (Vercel + Supabase)

**Deliverables:**

- Entity-Relationship Diagram (ERD) and database schema
- API documentation (OpenAPI/Swagger)
- System architecture diagram
- Technical stack decision document
- Environment setup guide
- Security compliance notes

#### Week 46: UI/UX Design

**Activities:**

- Information architecture and user flow design
- Wireframes for key screens:
  - Login and registration
  - Dashboard overview
  - Workout planner
  - Meal planner
  - Progress tracking and charts
  - Settings/profile page
- High-fidelity mockups following minimalist Tailwind + shadcn/ui design system
- Accessibility review (WCAG compliance)
- Interactive prototype for usability testing

**Deliverables:**

- Complete wireframes
- High-fidelity UI mockups
- Design system documentation (colors, spacing, typography)
- Component library structure
- Responsive layout guidelines
- Clickable prototype for stakeholder feedback

---

### Phase 4: Development and Deployment (Week 47–48)

**Lead Roles:** Developer (DEV), Scrum Master (SM)
**Supporting Roles:** PM, QA Engineer

#### Week 47: Core Development Sprint 1

**Day 1–2: Foundation**

- Project initialization (Next.js + FastAPI setup)
- Supabase integration (database and authentication)
- User registration and login flow
- Dashboard scaffolding and navigation setup

**Day 3–5: Core Functionality**

- AI workout planner integration (prompt handling, JSON parsing)
- AI meal planner integration (diet preferences and calorie goals)
- Replanning and weekly schedule logic
- Progress logging and visualization setup (Recharts integration)

**Day 6–7: Frontend Integration**

- Connect frontend UI to backend endpoints
- State management (Zustand)
- Supabase Realtime setup for dashboard updates

**Deliverables:**

- Functional MVP: login, AI generation, progress tracking
- End-to-end connection between frontend, backend, and database

#### Week 48: Final Sprint, Testing & Deployment

**Day 1–2: Feature Completion**

- Implement progress analytics dashboard
- Add motivational feedback module
- Refine UI/UX and responsive layouts

**Day 3–4: Testing**

- Unit tests (workout logic, AI response validation)
- Integration tests (API + database)
- E2E tests for critical user flows (login → generate plan → replan → track progress)
- Performance testing with sample users

**Day 5–6: Deployment Preparation**

- Production build setup (Vercel + Supabase)
- Environment variable configuration
- SSL, domain, and CDN setup
- Monitoring setup (error tracking, performance metrics)

**Day 7: Launch**

- Deploy final version
- Conduct smoke tests in production
- Finalize documentation (API docs, user guide)
- Prepare feedback collection form

**Deliverables:**

- Deployed production-ready web app
- Documentation and user guide
- Monitoring and feedback tools live

---

### Post-Launch (Ongoing)

- User feedback collection and analysis
- Bug fixes and small enhancements
- AI prompt tuning and optimization
- Performance monitoring and scaling
- Weekly retrospectives for continuous improvement

---

### BMAD Methodology Alignment

**Phase 1 (Analyze):** Understand user needs and project constraints
**Phase 2 (Plan):** Define MVP scope, budget, and risk strategy
**Phase 3 (Design):** Establish architecture, database, and UI foundation
**Phase 4 (Develop):** Implement, test, and deploy using agile principles

**Key Success Factors:**

- Clear division between planning, design, and development phases
- Comprehensive technical design before implementation
- Consistent communication through daily standups
- AI-assisted coding speeds up implementation by 40–50%
- Testing embedded in the final week ensures stability at launch

**Risk Mitigation:**

- Architecture reviews in Phase 3 prevent implementation errors
- Two-week sprint structure ensures focus on MVP scope
- Early testing and deployment preparation minimize launch stress
- Continuous monitoring supports quick iteration after launch

---

### Development Approach

**AI-Assisted Development Strategy:**

- Use GitHub Copilot or Claude Code for boilerplate and component generation
- AI assistance in writing TypeScript types, API endpoints, and data models
- Human oversight for all logic, prompt design, and system architecture decisions
- Pair programming workflow (AI suggests → developer refines)

**Testing Strategy:**

- Unit tests for AI output validation and data integrity
- Integration tests for frontend-backend communication
- End-to-end tests for full user journeys
- Manual verification of AI-generated plans and feedback

**Version Control:**

- Git with feature branch workflow
- Protected `main` branch with required code reviews
- Semantic versioning for structured releases

---

## Risk Assessment

**Technical Risks:**

- **AI Output Accuracy:** The AI may produce inconsistent or unrealistic workout or meal plans.
  - *Mitigation:* Define strict JSON schemas for AI output, implement validation checks, and allow human override through manual editing.
- **API Reliability:** The OpenAI API could experience downtime or rate limiting.
  - *Mitigation:* Use request caching, fallback templates, and retry logic with exponential backoff.
- **Performance and Scalability:** Increased user activity could affect response times or database performance.
  - *Mitigation:* Optimize database queries, use indexes, and enable Supabase Realtime selectively.
- **Data Privacy and Security:** The system handles sensitive personal and health-related data.
  - *Mitigation:* Use encrypted connections, Row Level Security (RLS), and GDPR-compliant data retention policies.

**Project Risks:**

- **Scope Management:** The MVP may grow beyond the planned 5-week timeline.
  - *Mitigation:* Maintain a clearly defined MVP scope and prioritize “must-have” features over optional ones.
- **AI Integration Complexity:** AI prompts may require multiple iterations for consistent results.
  - *Mitigation:* Test prompt reliability early in development and prepare fallback rule-based logic for key functions.
- **Timeline Pressure:** Tight project deadlines could affect testing quality.
  - *Mitigation:* Integrate testing from Week 47 onward and allocate time for quality assurance before launch.

**User Experience Risks:**

- **User Motivation:** Users may lose interest after initial setup if feedback is too generic.
  - *Mitigation:* Add a reward system, progress tracking, and personalized motivational feedback.
- **Accessibility and Usability:** The interface may not display properly across all devices.
  - *Mitigation:* Conduct responsive design testing and follow accessibility best practices (WCAG).

**Assumptions:**

- AI-assisted development increases productivity by 40–50% for standard coding tasks.
- Supabase and PostgreSQL can handle the expected workload (100 concurrent users).
- OpenAI’s API remains available and stable during the project.
- Users are willing to adopt an AI-driven fitness and meal planning solution.
- The 5-week BMAD timeline is sufficient for delivering a complete MVP with core functionality.

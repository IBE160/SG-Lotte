# Architecture

## Executive Summary

This document outlines the architecture for the **AI Fitness & Meal Planner**, a web application designed for AI-driven personalization. The architecture is based on a decoupled frontend and backend system, leveraging a modern, scalable technology stack. The frontend is a Next.js application, the backend is a FastAPI service, and the data persistence and user authentication are managed by Supabase. This structure provides a clear separation of concerns, enabling efficient development and deployment.

## Project Context

Based on a review of the Product Requirements Document (PRD), epics, UX specifications, and detailed analysis/research documents, the following project context is established:

*   **Core Objective:** The project, "ibe160", is a greenfield web application to create an AI-driven fitness and meal planner.
*   **Key Feature:** The central value is the AI's ability to generate and dynamically adapt personalized plans using OpenAI GPT-4.
*   **Defined Technology Stack:** The technical direction is explicitly defined and validated:
    *   **Frontend:** Next.js 14+ (App Router) with TypeScript, Tailwind CSS, and Recharts.
    *   **Backend:** FastAPI (Python).
    *   **Database & BaaS:** Supabase (PostgreSQL) for the database, authentication, RLS, and storage.
*   **User Experience:** The UX is defined by high-fidelity dark-themed wireframes, requiring a rich, component-based architecture to implement the 5-step onboarding, detailed logging, charts, and modals.
*   **Project Scale:** The project is classified as "Medium" complexity, with an initial MVP defined by 3 epics and 18 user stories.
*   **Non-Functional Requirements:** Critical NFRs include performance, security, scalability, and AI service reliability.

This detailed specification provides a strong foundation for the architecture.


## Project Initialization

The frontend project will be initialized using the `create-next-app` CLI tool, which aligns perfectly with the specified technology stack and significantly accelerates development by providing a best-practice foundation.

**Initialization Command:**

```bash
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --use-npm
```
*Note: `--use-npm` is added for explicit package manager choice, matching typical project setups.*

**Architectural Decisions Provided by Starter:**

The `create-next-app` template provides the following key architectural decisions:

*   **Framework:** Next.js (with App Router)
*   **Language:** TypeScript
*   **Styling Solution:** Tailwind CSS
*   **Linting:** ESLint
*   **Build Tooling:** Integrated Next.js build system (leveraging Webpack/Turbopack)
*   **Project Structure:** Standard Next.js App Router directory layout

**First Implementation Story:**

The very first implementation task for the frontend development will be to execute the above command to set up the project structure. This will establish the base architecture and development environment.

## Decision Identification

Based on our project requirements and the chosen technology stack, most core architectural decisions have been established. This section outlines the remaining key decisions we need to make to ensure a robust, scalable, and high-performing application, categorized by priority.

### Important Decisions (Require immediate architectural definition)

1.  **Background Job/Async Processing Strategy:**
    *   **Challenge:** The AI-driven weekly plan generation and adaptation process needs to run efficiently without blocking the user interface.
    *   **Decision Focus:** How will we implement this background processing? (e.g., dedicated queue, scheduled tasks).
2.  **Explicit Caching Strategy (for non-AI data):**
    *   **Challenge:** Beyond AI response caching, frequently accessed data needs to be retrieved quickly to ensure a fast and responsive user experience.
    *   **Decision Focus:** What mechanisms will be used to cache general application data for improved performance?

### Nice-to-Have Decisions (Can be deferred for future phases)

3.  **Vector Database / Embeddings Strategy:**
    *   **Challenge:** Expanding AI capabilities to include advanced features like similarity search for workout/meal recommendations might require specialized data storage.
    *   **Decision Focus:** Is a vector database necessary for future AI enhancements, and if so, which one?
4.  **Audit Logging and Advanced Access Control:**
    *   **Challenge:** As the application grows, more granular tracking of user actions and complex role-based access might be required beyond basic RLS.
    *   **Decision Focus:** What level of audit logging and advanced access control is needed, and how will it be implemented?
5.  **External Email Notification Service:**
    *   **Challenge:** While Supabase handles authentication emails, broader user engagement (newsletters, marketing, specific notifications) might require a dedicated email service.
    *   **Decision Focus:** Will a third-party email service be integrated for non-authentication related communication?

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |

| Background Processing | Vercel Cron Jobs | N/A (platform feature) | Epic 2 | Simplest, integrates with existing Vercel deployment, efficient for weekly tasks. |
| Caching Strategy      | Backend (FastAPI) + Frontend (Next.js) | N/A (libraries) | All Epics | Provides a balanced, multi-layered approach to performance without the complexity of an external service. |

## Project Structure

```
{{project_root}}/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── __init__.py
│   │   │   │   │   ├── users.py
│   │   │   │   │   └── plans.py
│   │   │   │   └── deps.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py
│   │   ├── crud/
│   │   │   ├── __init__.py
│   │   │   └── ...
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── ...
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── ...
│   │   └── services/
│   │       ├── __init__.py
│   │       └── ai_plan_generator.py
│   ├── tests/
│   │   └── ...
│   ├── alembic/
│   │   └── ...
│   ├── alembic.ini
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   └── ...
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── workouts/
│   │   │   │   │   └── ...
│   │   │   │   └── meals/
│   │   │   │       └── ...
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   └── (shadcn/ui components)
│   │   │   └── shared/
│   │   │       └── ...
│   │   ├── hooks/
│   │   │   └── ...
│   │   ├── lib/
│   │   │   └── ...
│   │   └── styles/
│   │       └── globals.css
│   ├── public/
│   │   └── ...
│   ├── .eslintrc.json
│   ├── next.config.mjs
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── docs/
│   └── ...
├── .gitignore
└── README.md
```

## Epic to Architecture Mapping

| Epic | Architectural Boundaries |
| ---- | ------------------------ |
| **Epic 1: First Plan & Foundation** | - **Backend:** `app/api/v1/endpoints/users.py` (Authentication), `app/services/ai_plan_generator.py` (Initial Plan Generation) <br> - **Frontend:** `src/app/(auth)/` (Onboarding UI), `src/app/(dashboard)/dashboard/` (Dashboard UI) |
| **Epic 2: Adaptive Planning & Progress Logging** | - **Backend:** `app/api/v1/endpoints/plans.py` (Logging & Adaptation Logic) <br> - **Frontend:** `src/app/(dashboard)/workouts/`, `src/app/(dashboard)/meals/` (Logging UI) |
| **Epic 3: User Control & Personalization** | - **Backend:** `app/api/v1/endpoints/users.py` (Profile Management) <br> - **Frontend:** `src/app/(dashboard)/profile/`, `src/app/(dashboard)/settings/` (Profile & Settings UI) |

## Technology Stack Details

### Core Technologies

*   **Frontend:** Next.js v16.0.5 (React) with TypeScript.
*   **Backend:** FastAPI v0.122.0 with Python 3.14.
*   **Database:** Supabase (PostgreSQL).
*   **Authentication:** Supabase Auth (using `@supabase/supabase-js` v2.86.0).
*   **Styling:** Tailwind CSS.
*   **State Management:** Zustand for client-side, SWR/React Query for server-side.
*   **AI Integration:** OpenAI GPT-4 API.

### Integration Points

*   **Frontend to Backend:** The Next.js frontend communicates with the FastAPI backend via a versioned REST API (`/api/v1/`).
*   **Frontend to Supabase:** The frontend interacts directly with Supabase for authentication and real-time data updates using the `supabase-js` library.
*   **Backend to Supabase:** The FastAPI backend connects to the Supabase PostgreSQL database for data persistence.
*   **Backend to OpenAI:** The backend communicates with the OpenAI API to generate AI-driven plans.

## Novel Pattern Designs

After a thorough review of the project requirements, no fundamentally novel architectural patterns were identified that require invention from scratch. The core AI-driven functionality for plan generation and adaptation can be successfully implemented using the established **"AI Application"** pattern.

This pattern involves:
1.  Collecting user data, goals, and progress.
2.  Constructing a detailed prompt for the OpenAI GPT-4 API.
3.  Receiving, validating, and storing the structured JSON response.
4.  Using user feedback to refine subsequent prompts for continuous adaptation.

The innovation in this project lies in the specific application of this pattern—the quality of the prompts, the feedback loop, and the user experience—rather than in the creation of a new, untested architectural structure.

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents and developers, reducing ambiguity and preventing conflicts.

### Naming Patterns

*   **API Endpoints:** Plural nouns and kebab-case (e.g., `/api/v1/workout-plans`).
*   **Database Tables:** Plural nouns and snake_case (e.g., `users`, `workout_plans`).
*   **Database Columns:** Snake_case (e.g., `user_id`, `created_at`).
*   **Frontend Components (React):** PascalCase (e.g., `UserCard.tsx`).
*   **Frontend Component Files:** Kebab-case (e.g., `user-card.tsx`).
*   **Frontend Hooks/Utilities:** CamelCase (e.g., `useUserData.ts`).

### Structure Patterns

*   **Testing (Frontend):** Test files will be co-located with the components they are testing in a `__tests__` subdirectory.
*   **Testing (Backend):** All tests will reside in the root `tests/` directory.
*   **Component Organization:** Components will be organized by feature or route (e.g., `components/dashboard/`, `components/auth/`).
*   **Shared Utilities (Frontend):** Reusable functions and utilities will be placed in `frontend/src/lib/`.
*   **Shared Logic (Backend):** Core logic, configuration, and services will be placed in `backend/app/core/` and `backend/app/services/`.

### Format Patterns

*   **API Responses:** Successful responses (`2xx`) will return JSON data directly. Error responses will use the standard FastAPI format: `{ "detail": "..." }`.
*   **Dates in JSON:** All dates and times in API requests and responses will be formatted as ISO 8601 strings in UTC.

### Communication Patterns

*   **Client-Side State:** Global client-side state will be managed with `Zustand`.
*   **Server-Side State (Data Fetching):** Server state and data fetching on the client will be managed by a library like `SWR` or `React Query` to handle caching, revalidation, and request deduplication.

## Consistency Rules

To ensure consistency and maintainability across the application, all AI agents and developers must adhere to the following cross-cutting patterns.

### API Response and Error Handling

*   **Standard Response:** All API responses will use a consistent JSON structure. For successful responses, data should be returned directly.
*   **Error Response:** All API errors will return a JSON object with a standardized format: `{ "detail": "Error message" }`. FastAPI's default error response handling will be used to ensure this.
*   **HTTP Status Codes:** Standard HTTP status codes will be used to indicate the outcome of an API request (e.g., `200` for success, `400` for bad request, `401` for unauthorized, `500` for server error).

### Logging

*   **Strategy:** Structured logging will be implemented.
*   **Format:** Logs will be in JSON format, containing at a minimum: a timestamp, log level (INFO, WARNING, ERROR), and a message.
*   **Target:** For the MVP, logs will be output to the console (`stdout`/`stderr`), which is compatible with Vercel's logging infrastructure.

### Date and Time Handling

*   **Standard:** All dates and times transmitted via the API and stored in the database will be in ISO 8601 format and normalized to Coordinated Universal Time (UTC).
*   **Frontend:** The frontend application will be responsible for converting UTC dates/times to the user's local timezone for display purposes.

### Testing Strategy

*   **Backend (FastAPI):** Unit and integration tests will be written using `Pytest`.
*   **Frontend (Next.js):** Component and integration tests will be written using `React Testing Library` with `Jest`.
*   **End-to-End (E2E):** (Future Consideration) An E2E testing framework like `Playwright` or `Cypress` may be adopted post-MVP.

## Data Architecture

The data model will be centered around users, their plans, and their progress. Key database tables will include:

*   **users:** Stores user profile information, authentication details, and preferences.
*   **workout_plans:** Stores the generated weekly workout plans.
*   **meal_plans:** Stores the generated weekly meal plans.
*   **workout_log:** Records completed workouts and user feedback.
*   **meal_log:** Records consumed meals.

Relationships will be established using foreign keys (e.g., `user_id` in the plan and log tables).

## API Contracts

The FastAPI backend will expose a versioned REST API (`/api/v1/`). Key endpoints will include:

*   `/users/`: For user management and profile information.
*   `/plans/`: For generating, retrieving, and adapting workout and meal plans.
*   `/log/`: For logging completed workouts and meals.

API requests and responses will be validated using Pydantic schemas to ensure data consistency.

## Security Architecture

*   **Authentication:** Handled by Supabase Auth, using JWTs for secure sessions.
*   **Authorization:** Supabase's Row Level Security (RLS) will be enabled to ensure users can only access their own data.
*   **Data Security:** All data will be encrypted in transit (HTTPS/SSL) and at rest (managed by Supabase).
*   **API Security:** Backend API endpoints will be protected and will require a valid JWT from an authenticated user.

## Performance Considerations

*   **Caching:** A multi-layered caching strategy will be used:
    *   **Backend:** In-memory caching for common database queries.
    *   **Frontend:** `SWR` or `React Query` for caching API responses on the client-side.
*   **Code Splitting:** Next.js will automatically handle code splitting to ensure fast initial page loads.
*   **CDN:** Vercel's CDN will be used to serve frontend assets close to the user.

## Deployment Architecture

*   **Platform:** Both the Next.js frontend and the FastAPI backend will be deployed to Vercel.
*   **CI/CD:** A continuous integration and deployment pipeline will be set up through Vercel's Git integration, enabling automatic deployments on every push to the main branch.
*   **Database:** The Supabase database is a managed service and does not require manual deployment steps.

## Development Environment

### Prerequisites

*   Node.js (latest LTS version)
*   npm or yarn
*   Python (3.9+)
*   pip
*   Git

### Setup Commands

```bash
# Clone the repository
git clone <repository-url>
cd <repository-name>

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt

# Run the development servers
# (in separate terminals)
cd frontend && npm run dev
cd backend && uvicorn app.main:app --reload
```

## Architecture Decision Records (ADRs)

### ADR-001: Background Job/Async Processing Strategy

**Decision:** Vercel Cron Jobs.

**Date:** 2025-11-30

**Context:** The application requires weekly AI-driven plan generation and adaptation to occur automatically without blocking the user interface. We considered using Supabase `pg_cron` or a dedicated queue system, but for the current project scale and user skill level, these options introduce unnecessary complexity.

**Decision Drivers:**
*   **Simplicity:** Ease of setup, management, and integration with the existing Vercel deployment and FastAPI backend.
*   **Efficiency:** Sufficient for weekly, scheduled tasks without significant real-time constraints.
*   **Cost-Effectiveness:** Leverages existing platform features.

**Consequences:**
*   The FastAPI backend will require a dedicated, secure API endpoint to be triggered by the Vercel Cron Job.
*   The implementation of this API endpoint must handle the AI plan generation logic and ensure proper error handling and logging.
*   This decision directly supports Epic 2: Adaptive Planning & Progress Logging, specifically Story 2.4.

### ADR-002: Caching Strategy

**Decision:** Implement a multi-layered caching strategy using both Backend Caching and Frontend Caching.

**Date:** 2025-11-30

**Context:** To meet the Non-Functional Requirement for high performance (<500ms response time for non-AI queries) and ensure a smooth user experience, a robust caching strategy is necessary. We need to reduce redundant data fetching and computations.

**Decision Drivers:**
*   **Performance:** A combination of backend and frontend caching addresses performance at multiple levels of the application stack.
*   **User Experience:** Frontend caching, in particular, will make the application feel faster and more responsive to the user.
*   **Simplicity:** This approach avoids the operational overhead and complexity of managing a separate, external caching service like Redis for the MVP.

**Consequences:**
*   **Backend:** The FastAPI backend will implement a caching layer (e.g., using `fastapi-cache2` with an in-memory backend for the MVP) to cache common database queries and computed results.
*   **Frontend:** The Next.js frontend will use a library like `SWR` or `React Query` for client-side data fetching and caching, reducing API calls for data that has not changed.
*   This is a cross-cutting concern that will positively affect the performance of all epics.

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: 2025-11-30_
_For: BIP_
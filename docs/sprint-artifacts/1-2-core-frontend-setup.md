# Story 1.2: Core Frontend Setup

Status: ready-for-dev

## Story

As a developer,
I want the Next.js frontend to be set up and connected to a Vercel deployment pipeline,
so that I can build UI components and have continuous deployment.

## Acceptance Criteria

1.  **Given** the project is initialized
    **When** I set up the frontend
    **Then** a Next.js app is created with TypeScript and Tailwind CSS
2.  **Given** the project is initialized
    **When** I set up the frontend
    **Then** a Vercel CI/CD pipeline is connected for automated deployments
3.  **Given** the project is initialized
    **When** I set up the frontend
    **Then** a basic API call from the frontend to the backend is successful

## Requirements Context Summary

This story focuses on establishing the foundational frontend environment for the AI Fitness & Meal Planner application. The core objective is to create a Next.js application, configure it with TypeScript and Tailwind CSS, and integrate it with a Vercel CI/CD pipeline for automated deployments. A crucial step involves verifying basic connectivity between the newly set up frontend and the already established FastAPI backend (from Story 1.1).

**Key components and technologies:**

*   **Frontend Framework:** Next.js (with App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Deployment:** Vercel CI/CD
*   **Integration:** Basic REST API call to the FastAPI backend.

**Derived from Architecture (`architecture-2025-11-30.md`):**

*   **Initialization Command:** `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --use-npm` is the prescribed method for project setup.
*   **Architectural Decisions:** The `create-next-app` template provides the initial architectural decisions regarding Framework (Next.js with App Router), Language (TypeScript), Styling (Tailwind CSS), Linting (ESLint), Build Tooling (Integrated Next.js build system), and Project Structure (Standard Next.js App Router directory layout).
*   **Deployment:** Vercel is the chosen platform for both frontend and backend deployment, with CI/CD established via Git integration.
*   **Inter-service Communication:** The Next.js frontend communicates with the FastAPI backend via a versioned REST API (`/api/v1/`).

**Derived from PRD (`PRD.md`):**

*   **Core Objective:** Establish the frontend foundation for the AI Fitness & Meal Planner application.
*   **Key Features impacted:** User Authentication & Profile Management (FR-001), AI-Driven Plan Generation & Adaptation (FR-002, FR-003), Dashboard Overview (FR-006).

**Derived from Epics (`epics.md`):**

*   **Epic 1: First Plan & Foundation** outlines the need for core technical setup.
*   **Story 1.2: Core Frontend Setup** specifically details the setup of the Next.js frontend and its connection to the Vercel deployment pipeline.

**Derived from Tech Spec (`tech-spec-epic-1.md`):**

*   **Authoritative Acceptance Criteria:** The tech spec provides the authoritative acceptance criteria for this story.
*   **Technical Design:** The tech spec details the high-level technical design for the frontend, including the choice of Next.js, TypeScript, and Tailwind CSS.

### Project Structure Alignment and Lessons Learned

**Learnings from Previous Story (1.1: Core Backend Setup)**

The successful completion of Story 1.1 establishes the foundational backend infrastructure, which is a direct prerequisite for this frontend setup story. As Story 1.1 has not yet undergone a senior developer review, there are no unresolved review items to address. The key learnings are based on the established backend architecture and configuration.

*   **Backend Availability:** A FastAPI backend is now running, connected to Supabase, and includes a placeholder for AI plan generation. This means the frontend can now establish a basic API connection to this backend.
*   **Architectural Consistency:** The backend leverages `uv` for package management, uses Pydantic Settings for secure API key loading, and implements structured JSON logging. While these are backend-specific, the principles of secure configuration and clear logging should be extended to the frontend where applicable (e.g., environment variable management for API keys, structured console logging).
*   **API Key Management:** The warning regarding `SUPABASE_URL`, `SUPABASE_KEY`, and `GEMINI_API_KEY` environment variables and `.env` file management in the backend is directly relevant. The frontend will also need to manage its Supabase keys securely via environment variables and ensure `.gitignore` rules are appropriate.
*   **Established Backend Structure:** The backend has a defined structure (e.g., `backend/app/main.py`, `backend/app/core/config.py`, `backend/app/services/ai_plan_generator.py`, `backend/tests/`) which the frontend should be designed to interact with consistently.

This story will initiate the `frontend/` directory with its own structure, ensuring it aligns with the overall project's monorepo approach and adheres to the established conventions for environment variable handling and project layering.

## Acceptance Criteria

1.  **Given** the project is initialized
    **When** I set up the frontend
    **Then** a Next.js app is created with TypeScript and Tailwind CSS
2.  **Given** the project is initialized
    **When** I set up the frontend
    **Then** a Vercel CI/CD pipeline is connected for automated deployments
3.  **Given** the project is initialized
    **When** I set up the frontend
    **Then** a basic API call from the frontend to the backend is successful

## Tasks / Subtasks

- [ ] **Frontend Project Setup:**
  - [ ] Execute `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --use-npm` in the project root.
  - [ ] Verify the `frontend/` directory structure is created as per Next.js App Router conventions and `architecture-2025-11-30.md`. (AC: 1.2.1)
  - [ ] Add `frontend/` to `.gitignore` at the project root level.
  - [ ] Ensure `frontend/.env.local` is added to `frontend/.gitignore` for local environment variables.

- [ ] **Vercel CI/CD Integration:**
  - [ ] Create a new Vercel project and connect it to the project's Git repository.
  - [ ] Configure the Vercel project to deploy the `frontend/` application.
  - [ ] Verify that pushing changes to the `frontend/` directory triggers an automated deployment on Vercel. (AC: 1.2.2)

- [ ] **Basic Frontend-Backend Connectivity:**
  - [ ] In the `frontend/` app, create a simple page or component that makes a `GET` request to a placeholder endpoint in the FastAPI backend (e.g., `/api/v1/health` or similar).
  - [ ] Ensure proper environment variable setup in `frontend/.env.local` for the backend API URL.
  - [ ] Display the response from the backend on the frontend page.
  - [ ] Verify the successful API call is made and the response is displayed. (AC: 1.2.3)

- [ ] **Testing Strategy (Frontend):**
  - [ ] Set up `Jest` and `React Testing Library` in the `frontend/` directory (if not already configured by `create-next-app`).
      - [ ] Write a basic unit test to confirm a core component (e.g., `app/page.tsx`) renders without errors.
      - [ ] Write an integration test to mock the API call and verify the component displays the mocked data. (This implicitly covers AC 1.2.3 in a testable way).
  
  ## Dev Notes
  
  **Technical Context and Constraints:**
  
  *   **Frontend Framework:** Next.js (App Router) with TypeScript.
  *   **Styling:** Tailwind CSS.
  *   **Package Management (Frontend):** `npm` (specified by `--use-npm` in `create-next-app` command).
  *   **Deployment:** Vercel CI/CD.
  *   **Inter-service Communication:** Basic REST API calls to the FastAPI backend at `/api/v1/`.
  *   **Environment Variables:** Frontend will use environment variables (e.g., `NEXT_PUBLIC_BACKEND_API_URL`) for configuration, loaded via `next.config.js` or directly from the build environment (Vercel). Secure handling of API keys (Supabase, Gemini if direct frontend calls are introduced later) via `.env.local` and `.gitignore`.
  *   **Project Structure (Frontend):** The frontend project will reside in the `frontend/` directory, adhering to the Next.js App Router conventions and the overall monorepo structure.
  *   **Existing Backend:** The FastAPI backend is set up and running, providing the target for frontend API calls.
  
  ### Project Structure Notes
  
  *   **Initial Setup:** This story initiates the `frontend/` directory within the project root.
  *   **`.gitignore`:** The project root `.gitignore` will need to include `frontend/` to exclude it from the main repository, and `frontend/.gitignore` will need to exclude sensitive files like `.env.local`.
  *   **Monorepo Alignment:** Ensure the `frontend/` structure integrates cleanly with the existing `backend/` and `docs/` directories.
  
  ### Testing Standards Summary
  
  *   **Frontend (Next.js):** Component and integration tests will be written using `React Testing Library` with `Jest`. Test files will be co-located with the components they are testing in a `__tests__` subdirectory.

### Missing Document References

*   **`testing-strategy.md`, `coding-standards.md`, `unified-project-structure.md`, `backend-architecture.md`, `frontend-architecture.md`, `data-models.md`, `tech-stack.md`**: These specific documents are not yet available. This story relies on the information provided in `docs/architecture-2025-11-30.md` for guidance on testing, coding standards, and project structure.


## Change Log

- 2025-12-10: Initial draft.

## Dev Agent Record

- **Context Reference**: docs/sprint-artifacts/1-2-core-frontend-setup.context.xml
- **Agent Model Used**: 
- **Debug Log References**: 
- **Completion Notes List**: 
- **File List**: 

## References

- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#acceptance-criteria-authoritative]
- [Source: docs/epics.md#story-12-core-frontend-setup]
- [Source: docs/architecture-2025-11-30.md#project-initialization]
- [Source: docs/architecture-2025-11-30.md#architectural-decisions-provided-by-starter]
- [Source: docs/architecture-2025-11-30.md#deployment-architecture]
- [Source: docs/architecture-2025-11-30.md#integration-points]
- [Source: docs/architecture-2025-11-30.md#testing-strategy]
- [Source: docs/architecture-2025-11-30.md#development-environment]
- [Source: docs/sprint-artifacts/1-1-core-backend-setup.md#dev-notes]

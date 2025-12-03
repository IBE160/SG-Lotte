# Story 1.2: Core Frontend Setup

Status: drafted

## Story

As a developer,
I want the Next.js frontend to be set up and connected to a Vercel deployment pipeline,
so that I can build UI components and have continuous deployment.

## Acceptance Criteria

1.  Given the project is initialized, when I set up the frontend, then a Next.js app is created with TypeScript and Tailwind CSS.
2.  A Vercel CI/CD pipeline is connected for automated deployments.
3.  A basic API call from the frontend to the backend is successful.

## Tasks / Subtasks

-   [ ] Initialize Next.js project with TypeScript, Tailwind CSS, and ESLint.
-   [ ] Configure project for Vercel deployment.
-   [ ] Establish a basic API call from frontend to backend.
-   [ ] Add basic component and integration tests using React Testing Library and Jest.

## Dev Notes

### Project Structure Notes

*   Adhere to the standard Next.js App Router directory layout.
*   Frontend code should primarily reside under `frontend/src/app/` and `frontend/src/components/`.
*   Reusable functions and utilities should be placed in `frontend/src/lib/`.
*   Testing files should be co-located with components in `__tests__` subdirectories.

### References

*   **Architecture Document:** `docs/architecture-2025-11-30.md` (for project structure, technology stack, and testing strategy)
*   **Epic Breakdown:** `docs/epics.md` (for story statement and acceptance criteria)
*   **Epic 1 Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-1.md` (for detailed design and requirements alignment)

## Learnings from Previous Story: Core Backend Setup (1.1)

**From Story 1.1-core-backend-setup (Status: in-progress)**

*   **Completion Notes**:
    *   Initialized FastAPI project structure (backend/ directory, requirements.txt, backend/app/main.py created, uvicorn configured).
    *   Connected FastAPI to Supabase (supabase-py installed, client configured, health check endpoint added).
    *   Configured Alembic for database migrations (alembic init, alembic.ini and env.py updated).
    *   Implemented basic test for backend setup (backend/tests/test_main.py created with basic tests).
*   **New Files**: `backend/alembic.ini`, `backend/alembic/env.py`, `backend/alembic/versions/`, `backend/tests/test_main.py`
*   **Modified Files**: `backend/requirements.txt`, `backend/app/main.py`
*   **Architectural Decisions**:
    *   Adhere to the defined project structure from `docs/architecture-2025-11-30.md`.
    *   Backend code should reside under `backend/app/`.
    *   Testing code for backend should be under `backend/tests/`.

[Source: `docs/sprint-artifacts/1-1-core-backend-setup.md`]

## Project Structure Alignment Summary

The previous story (1.1-core-backend-setup) successfully established the backend foundation, creating and modifying files within the `backend/` directory as expected by the architecture. This sets a clear precedent for adhering to the defined project structure.

For this story (1.2-core-frontend-setup), the focus is on the `frontend/` directory. The learnings from the previous story reinforce the need to:

*   **Strictly adhere to the `docs/architecture-2025-11-30.md`** for frontend project structure, naming conventions (PascalCase for components, kebab-case for component files), and component organization (by feature or route).
*   **Locate all frontend testing code** under `frontend/src/__tests__/` or co-located in `__tests__` subdirectories within component folders.
*   **Ensure `frontend/src/lib/` is used for shared utilities and functions**, similar to how `backend/app/services/` and `backend/app/core/` are used in the backend.
*   **Integrate `supabase-js`** for frontend-to-Supabase interactions, mirroring the backend's Supabase integration.

The successful setup of the backend indicates that the architectural guidelines are actionable and should be directly applied to the frontend development to maintain consistency across the project.

## Acceptance Criteria

1.  **Next.js App Creation:** A Next.js application is successfully created with TypeScript, Tailwind CSS, and ESLint configured.
    *   *Reference:* `docs/epics.md` (Story 1.2 AC1) and `docs/architecture-2025-11-30.md` (Project Initialization Command).
2.  **Vercel CI/CD Connection:** A Vercel CI/CD pipeline is set up and actively connected for automated deployments of the frontend.
    *   *Reference:* `docs/epics.md` (Story 1.2 AC2) and `docs/architecture-2025-11-30.md` (Deployment Architecture).
3.  **Basic API Call Success:** A simple, successful API call is made from the frontend to the backend, demonstrating connectivity.
    *   *Reference:* `docs/epics.md` (Story 1.2 AC3) and `docs/architecture-2025-11-30.md` (Integration Points: Frontend to Backend).

## Tasks / Subtasks

-   [ ] **Task: Initialize Next.js project with TypeScript, Tailwind CSS, and ESLint.**
    -   [ ] Execute `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --use-npm`.
    -   [ ] Verify `frontend/` directory structure matches standard Next.js App Router layout.
    -   [ ] Confirm `package.json` contains required dependencies (Next.js, React, Tailwind CSS, TypeScript).
    -   [ ] Validate ESLint configuration is active and without errors.
    -   *AC Reference:* 1
    *   *Source:* `docs/architecture-2025-11-30.md` (Project Initialization)

-   [ ] **Task: Configure project for Vercel deployment.**
    -   [ ] Create or link the Vercel project to the Git repository.
    -   [ ] Verify automated deployments trigger on push to `main` branch.
    -   [ ] Confirm Vercel deployment of a basic "hello world" page is successful.
    -   *AC Reference:* 2
    *   *Source:* `docs/architecture-2025-11-30.md` (Deployment Architecture)

-   [ ] **Task: Establish a basic API call from frontend to backend.**
    -   [ ] Implement a simple fetch request from a frontend page (e.g., `frontend/src/app/page.tsx`) to a placeholder backend endpoint (e.g., `/api/v1/health-check`).
    -   [ ] Display the response on the frontend.
    -   [ ] Ensure `supabase-js` is integrated and configured for future authentication needs.
    -   *AC Reference:* 3
    *   *Source:* `docs/architecture-2025-11-30.md` (Integration Points, Technology Stack - Supabase Auth)

-   [ ] **Task: Add basic component and integration tests using React Testing Library and Jest.**
    -   [ ] Set up Jest and React Testing Library in the `frontend/` project.
    -   [ ] Write a simple component test for a basic UI element (e.g., a button).
    -   [ ] Write an integration test to verify the frontend's API call in a test environment.
    -   [ ] Ensure test files are located in `__tests__` subdirectories within component folders or `frontend/tests/`.
    -   *AC Reference:* All (Verification)
    *   *Source:* `docs/architecture-2025-11-30.md` (Testing Strategy, Project Structure Notes)

## Dev Agent Record

### Context Reference

### Agent Model Used

Gemini

### Debug Log References

### Completion Notes List

### File List

## Change Log

- **onsdag 3. desember 2025**: Initial draft created by BIP (Scrum Master Agent).
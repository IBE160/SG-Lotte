# Story 1.2: Core Frontend Setup

**Status:** ready-for-dev

**Epic:** Epic 1: First Plan & Foundation
**User:** Developer
**Value Statement:** As a developer, I want the Next.js frontend to be set up and connected to a Vercel deployment pipeline, so that I can build UI components and have continuous deployment.

---

## 1. Requirements & Context

### 1.1. Requirements Summary

This story involves initializing a new Next.js project using the `create-next-app` command with specific configurations for TypeScript, Tailwind CSS, and ESLint. It also includes setting up a Vercel project and connecting it to the GitHub repository for continuous deployment. A critical part of this story is to verify the setup by creating a simple test API call from the frontend to the backend.

### 1.2. Source Documents

*   **Tech Spec:** `docs/sprint-artifacts/tech-spec-epic-1.md#detailed-design`
*   **PRD:** `docs/PRD.md#fr-006-dashboard-overview`
*   **Epics:** `docs/epics.md#story-12-core-frontend-setup`
*   **Architecture:** `docs/architecture-2025-11-30.md#project-initialization`

---

## 2. Acceptance Criteria

| # | Given | When | Then |
|---|---|---|---|
| 1 | The project is initialized | I set up the frontend | A Next.js app is created with TypeScript and Tailwind CSS |
| 2 | The project is initialized | I set up the frontend | A Vercel CI/CD pipeline is connected for automated deployments |
| 3 | The project is initialized | I set up the frontend | A basic API call from the frontend to the backend is successful |

---

## 3. Implementation Plan

### 3.1. Task Breakdown

| Task ID | Description | Est. Time |
|---|---|---|
| 1.2.1 | Initialize Next.js project using `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --use-npm` (AC: #1) | 1h |
| 1.2.2 | Configure Tailwind CSS with the project's theme and design tokens. (AC: #1) | 2h |
| 1.2.3 | Create a new Vercel project and link it to the GitHub repository. (AC: #2) | 1h |
| 1.2.4 | Implement a simple API call from a frontend component to a health check endpoint on the backend. (AC: #3) | 2h |
| 1.2.5 | Verify that the Vercel deployment pipeline is triggered on a push to the main branch. (AC: #2) | 1h |
| 1.2.6 | **Test:** Write unit tests to verify Tailwind CSS configuration and theme. (AC: #1) | 1h |
| 1.2.7 | **Test:** Write an E2E test to confirm deployment to Vercel on git push. (AC: #2) | 1h |
| 1.2.8 | **Test:** Write a simple test for the API call to ensure it is working correctly. (AC: #3) | 1h |

### 3.2. Developer Notes

#### Project Structure Notes
*   The Next.js project should be initialized in a new `frontend` directory at the root of the repository, as per the `unified-project-structure.md` guidelines. [Source: docs/unified-project-structure.md]

#### General Notes
*   Initialize the Next.js project using the command specified in the architecture document: `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --use-npm`. This is also captured in Task 1.2.1. [Source: docs/architecture-2025-11-30.md#project-initialization]
*   Ensure that the Vercel project is configured with the correct environment variables for the backend API URL, specifically referencing connection details for Supabase Auth and the FastAPI backend. [Source: docs/sprint-artifacts/tech-spec-epic-1.md#dependencies-and-integrations]
*   The test API call should be simple and only verify the connection between the frontend and backend.

---

## Dev Agent Record

*   **Context Reference:**
    *   docs/sprint-artifacts/1-2-core-frontend-setup.context.xml
*   **Agent Model Used:**
*   **Debug Log References:**
*   **Completion Notes List:**
*   **File List:**

---

## 4. Validation

### 4.1. Validation Checklist

*   [ ] **AC #1:** Next.js project is created in the `frontend` directory with TypeScript and Tailwind.
*   [ ] **AC #1:** Tailwind CSS is configured with the project theme and works as expected.
*   [ ] **AC #2:** Vercel project is created and linked to the GitHub repository.
*   [ ] **AC #2:** A push to the main branch successfully triggers a Vercel deployment.
*   [ ] **AC #3:** The simple API call from a frontend component to the backend is successful.
*   [ ] **Testing:** Unit tests for Tailwind configuration pass.
*   [ ] **Testing:** E2E tests for the Vercel deployment pipeline pass.
*   [ ] **Testing:** Tests for the frontend-backend API call pass.

### 4.2. Review

*   **Completed by:**
*   **Date:**
*   **Outcome:**

---

## 5. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2025-12-02 | sm | Initial draft |

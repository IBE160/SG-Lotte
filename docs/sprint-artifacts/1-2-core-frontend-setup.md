# Story 1.2: Core Frontend Setup

**Epic:** Epic 1: First Plan & Foundation
**User:** Developer
**Value Statement:** As a developer, I want the Next.js frontend to be set up and connected to a Vercel deployment pipeline, so that I can build UI components and have continuous deployment.

---

## 1. Requirements & Context

### 1.1. Requirements Summary

This story involves initializing a new Next.js project using the `create-next-app` command with specific configurations for TypeScript, Tailwind CSS, and ESLint. It also includes setting up a Vercel project and connecting it to the GitHub repository for continuous deployment. A critical part of this story is to verify the setup by creating a simple test API call from the frontend to the backend.

### 1.2. Source Documents

*   **Epics:** `docs/epics.md`
*   **Architecture:** `docs/architecture-2025-11-30.md`

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
| 1.2.1 | Initialize Next.js project using `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --use-npm` | 1h |
| 1.2.2 | Configure Tailwind CSS with the project's theme and design tokens. | 2h |
| 1.2.3 | Create a new Vercel project and link it to the GitHub repository. | 1h |
| 1.2.4 | Implement a simple API call from a frontend component to a health check endpoint on the backend. | 2h |
| 1.2.5 | Write a simple test for the API call to ensure it is working correctly. | 1h |
| 1.2.6 | Verify that the Vercel deployment pipeline is triggered on a push to the main branch. | 1h |

### 3.2. Developer Notes

*   Refer to the `docs/architecture-2025-11-30.md` for detailed instructions on project setup and structure.
*   Ensure that the Vercel project is configured with the correct environment variables for the backend API URL.
*   The test API call should be simple and only verify the connection between the frontend and backend.

---

## 4. Validation

### 4.1. Validation Checklist

*   [ ] Next.js project is created in the `frontend` directory.
*   [ ] Tailwind CSS is configured and working.
*   [ ] Vercel deployment is successful.
*   [ ] API call from frontend to backend is successful.

### 4.2. Review

*   **Completed by:**
*   **Date:**
*   **Outcome:**

---

## 5. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2025-12-02 | sm | Initial draft |

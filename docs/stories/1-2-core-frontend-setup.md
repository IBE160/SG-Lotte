# Story 1.2: Core Frontend Setup

**Epic:** [Epic 1: First Plan & Foundation](<../epics.md#epic-1-first-plan--foundation>)
**Status:** Drafted
**Points:** 3
**Author:** sm (BIP)
**Date:** 2025-12-10

---

## User Story

As a **developer**,
I want **the Next.js frontend to be set up and connected to a Vercel deployment pipeline**,
So that **I can build UI components and have continuous deployment.**

---

## Acceptance Criteria

1.  **Given** the project is initialized,
    **When** I set up the frontend,
    **Then** a Next.js app is created with TypeScript and Tailwind CSS.
    *Implementation Note: Use the command `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --use-npm` as specified in the architecture document.*

2.  **Given** the project is initialized,
    **When** I set up the frontend,
    **Then** a Vercel CI/CD pipeline is connected for automated deployments.

3.  **Given** the project is initialized,
    **When** I set up the frontend,
    **Then** a basic API call from the frontend to the backend is successful, confirming connectivity.

---

## Technical Notes

*   This story is foundational for all frontend development.
*   It directly implements the frontend setup described in the `architecture-2025-11-30.md` document.
*   Prerequisites: Story 1.1 (Core Backend Setup) must be complete to allow for the test API call.
*   The developer assigned to this task should have access to the project's Vercel account to connect the repository.

# Story 2.5: New Plan Notification

Status: ready-for-dev

## Story

As an active user,
I want to be notified when my new weekly plans are ready,
So I know when to check for updates.

## Acceptance Criteria

1.  **Given** a new weekly plan has been successfully generated for me, **then** a notification record is created in the database. (Source: docs/sprint-artifacts/tech-spec-epic-2.md — Acceptance Criteria)
2.  **Given** I have an unread notification, **when** I open the application, **then** an in-app notification is displayed (as per `feedback_patterns_dark.html`). (Source: docs/sprint-artifacts/tech-spec-epic-2.md — Acceptance Criteria)
3.  **Given** I click on the notification, **then** I am navigated directly to my new weekly plan. (Source: docs/sprint-artifacts/tech-spec-epic-2.md — Acceptance Criteria)


## Tasks / Subtasks

**Backend (Story 2.5):**
*   [ ] Modify AI plan generation logic to create a notification record upon successful plan generation. (AC: #1)
    *   [ ] Identify the appropriate service/function in `backend/app/services/ai_plan_generator.py` or similar that finalizes plan generation.
    *   [ ] Implement logic to insert a new row into the `notifications` table (Supabase/PostgreSQL).
    *   [ ] Ensure the notification record is linked to the authenticated user (`user_id`).
    *   [ ] Verify RLS is correctly applied to the `notifications` table to restrict access.
*   [ ] Create API endpoint(s) for retrieving and marking notifications. (AC: #2, #3)
    *   [ ] Create `backend/app/api/v1/endpoints/notifications.py` (or extend `users.py` if notifications are tightly coupled to users).
    *   [ ] Implement `GET /api/v1/notifications` to fetch all unread notifications for the authenticated user.
    *   [ ] Implement `PUT /api/v1/notifications/{id}/read` to mark a specific notification as read.

**Frontend (Story 2.5):**
*   [ ] Implement in-app notification display and navigation. (AC: #2, #3)
    *   [ ] Develop a component (e.g., `NotificationList.tsx`) to display individual notifications.
    *   [ ] When a new plan is generated and the app is opened, display a toast/banner notification based on `feedback_patterns_dark.html`.
    *   [ ] Ensure clicking the notification navigates the user to the latest plan (e.g., `/dashboard/plans/latest`).
    *   [ ] Implement logic to mark notification as read upon interaction or viewing.

**Testing (Story 2.5):**
*   **Backend Integration Tests:**
    *   [ ] Add integration tests for `GET /api/v1/notifications` and `PUT /api/v1/notifications/{id}/read` endpoints using Pytest, verifying request/response contracts, authentication/authorization, and database interactions. (AC: #1, #2, #3)
    *   [ ] Test that a notification record is correctly created in the database upon new plan generation. (AC: #1)
*   **Frontend Unit/Integration Tests:**
    *   [ ] Add unit tests for `NotificationList.tsx` using Jest/React Testing Library with mock data. (AC: #2)
    *   [ ] Test navigation functionality when interacting with a notification. (AC: #3)
    *   [ ] Add integration test to verify that clicking a notification navigates the user to the correct weekly plan. (AC: #3)
*   **End-to-End Test (Optional/Future):**
    *   [ ] Simulate new plan generation, verify notification appears, and navigation works.

## Dev Notes

### Context from User Prompt:
- Backend needs to create a notification record in the `notifications` table with Row Level Security (RLS) enabled. [Source: docs/sprint-artifacts/tech-spec-epic-2.md — Data Models and Contracts], [Source: docs/architecture-2025-11-30.md — Security Architecture]
- Notification should be linked to the authenticated user.
- Frontend should display a simple, non-intrusive unread notification indicator.
- This story focuses on in-app notifications only, excluding email/SMS/push notifications.

### Relevant Architectural Details:
- **Project Structure**: `backend/app/api/v1/endpoints/` for new API endpoints, `frontend/src/app/(dashboard)/dashboard/` or a shared `components/` for frontend notification UI.
- **Data Models**: The existing `notifications` table. Supabase RLS is to be used for security. [Source: docs/sprint-artifacts/tech-spec-epic-2.md — Data Models and Contracts], [Source: docs/architecture-2025-11-30.md — Database Design], [Source: docs/architecture-2025-11-30.md — Security Architecture]
- **API Contracts**: New API endpoint(s) will be needed for fetching and marking notifications as read. Consistent JSON response format.
- **UX Patterns**: Frontend notification UI should align with `feedback_patterns_dark.html` as referenced in `ux-design-specification.md`.
- **Testing Strategy**: Backend integration tests for the notification API, frontend unit tests for the notification indicator component.

### Learnings from Previous Story (2.4: Dashboard Progress Visualization):

- **New Services/Components**: `ProgressChart.tsx`, `ProgressDataService`, `GET /api/v1/progress` endpoint. Story 2.5 can follow similar patterns for frontend components and backend services.
- **Architectural Decisions**: Continued adherence to Vercel Cron Jobs for background processing (ADR-001) as plan generation is a prerequisite.
- **Warnings/Recommendations**: General recommendation to fix existing frontend tests and run regression tests. Thorough testing is paramount, especially for new UI elements.
- **Pending Items from 2.3**: Email verification remains a pending item, but is out of scope for this story.

### Project Structure Alignment for Story 2.5:

- **Frontend Components**: New React component (e.g., `NotificationIndicator.tsx`) for the dashboard/header. It will likely reside in `frontend/src/app/(dashboard)/layout.tsx` or a shared component directory.
- **Backend Service**: A new module within `backend/app/services/` (e.g., `notification_service.py`) and/or new endpoint in `backend/app/api/v1/endpoints/notifications.py` to handle notification creation, retrieval, and status updates.
- **API Endpoints**: New API endpoints suchs as `GET /api/v1/notifications` (to fetch user notifications) and `PUT /api/v1/notifications/{id}/read` (to mark as read).

### Architectural Standards & Guidelines (Single Source of Truth)

For the purposes of this project, `docs/architecture-2025-11-30.md` serves as the single authoritative source for the following architectural standards and guidelines. Dedicated files for these aspects are not maintained separately.

*   **Tech Stack:** Referenced in [docs/architecture-2025-11-30.md](docs/architecture-2025-11-30.md#Technology-Stack)
*   **Backend Architecture:** Referenced in [docs/architecture-2025-11-30.md](docs/architecture-2025-11-30.md#Backend-Architecture)
*   **Frontend Architecture:** Referenced in [docs/architecture-2025-11-30.md](docs/architecture-2025-11-30.md#Frontend-Architecture)
*   **Data Models:** Referenced in [docs/architecture-2025-11-30.md](docs/architecture-2025-11-30.md#Data-Modeling-and-Database-Schema)
*   **Testing Strategy:** Referenced in [docs/architecture-2025-11-30.md](docs/architecture-2025-11-30.md#Testing-Strategy)
*   **Coding Standards:** Referenced in [docs/architecture-2025-11-30.md](docs/architecture-2025-11-30.md#Implementation-Patterns) [Source: docs/architecture-2025-11-30.md — Coding Standards]
*   **Unified Project Structure:** Referenced in [docs/architecture-2025-11-30.md](docs/architecture-2025-11-30.md#Project-Structure)

### References

- [docs/epics.md#Story-2.5-New-Plan-Notification](docs/epics.md#Story-2.5-New-Plan-Notification) – Story definition, Acceptance Criteria
- [docs/prd.md#FR-007-Notifications](docs/prd.md#FR-007-Notifications) – Functional Requirement
- [docs/architecture-2025-11-30.md#Implementation-Patterns](docs/architecture-2025-11-30.md#Implementation-Patterns) – Project Structure, Implementation Patterns, Testing Strategy, API Contracts
- [docs/ux-design-specification.md#Flow-3-4:-Log-Workouts,-Meals-&-Provide-Feedback](docs/ux-design-specification.md#Flow-3-4:-Log-Workouts,-Meals-&-Provide-Feedback) – UX Patterns (Feedback Patterns)
- [docs/sprint-artifacts/2-4-dashboard-progress-visualization.md#Learnings-from-Previous-Story-(2.3:-AI-Driven-Weekly-Plan-Adaptation-Logic):](docs/sprint-artifacts/2-4-dashboard-progress-visualization.md#Learnings-from-Previous-Story-(2.3:-AI-Driven-Weekly-Plan-Adaptation-Logic):) – Learnings from previous story development.
- [docs/sprint-artifacts/tech-spec-epic-2.md](docs/sprint-artifacts/tech-spec-epic-2.md) – Epic 2 Technical Specification

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/2-5-new-plan-notification.context.xml

### Agent Model Used

<!-- TODO: Add agent model name here -->

### Debug Log References

### Completion Notes List

### File List

---

### Change Log

- 2025-12-15: Initial draft created by SM agent.
- 2025-12-15: Detailed tasks added.
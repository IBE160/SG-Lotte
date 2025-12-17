
# Story 3.1 – User Profile Page

## Status

ready-for-dev

---

## Story

As an engaged user,
I want a dedicated profile page to view and update my personal fitness information,
So I have a central place to manage my identity and goals.

---

## Source Documents

- [Source: docs/PRD.md]
- [Source: docs/epics.md]
- [Source: docs/sprint-artifacts/tech-spec-epic-3.md]
- [Source: docs/architecture-2025-11-30.md]
- [Source: docs/ux-design/profilepage_dark.html]

---

## Acceptance Criteria

(Authoritative – derived from Epic 3 tech specification)

1. **Given** I navigate to the profile page**When** the page loads**Then** I can view my primary fitness goal and dietary preferences.[Source: docs/sprint-artifacts/tech-spec-epic-3.md#Acceptance-Criteria]
2. **Given** I update my primary fitness goal**When** I save the changes**Then** the updated goal is persisted to my user profile and visible after reload.[Source: docs/sprint-artifacts/tech-spec-epic-3.md#Acceptance-Criteria]
3. **Given** I update my dietary preferences
   **When** I save the changes
   **Then** the updated preferences are persisted to my user profile and visible after reload.
   [Source: docs/sprint-artifacts/tech-spec-epic-3.md#Acceptance-Criteria]

---

## Tasks / Subtasks

### Development

- [ ] **Task 1 (AC: #1):** Create profile page route under `frontend/src/app/(dashboard)/profile/page.tsx`
- [ ] **Task 2 (AC: #1):** Fetch current user profile data from backend API
- [ ] **Task 3 (AC: #2, #3):** Render editable form for fitness goal and dietary preferences
- [ ] **Task 4 (AC: #2, #3):** Implement save functionality with success/error feedback

### Backend

- [ ] **Task 5 (AC: #2, #3):** Verify existing endpoint `PUT /api/v1/users/me/profile`
- [ ] **Task 6 (AC: #2, #3):** Ensure updates persist to `public.user_profiles`
- [ ] **Task 7 (AC: #2, #3):** Validate incoming payload

### Testing

- [ ] **Task 8 (AC: #1):** Verify profile page renders with existing data
- [ ] **Task 9 (AC: #2, #3):** Verify updates persist after page reload
- [ ] **Task 10 (AC: #2, #3):** Verify invalid input is rejected gracefully

---

## Dev Notes

### Learnings from Previous Story (Story 2.5 – New Plan Notification)

- Backend state must be treated as the source of truth; UI alone is insufficient to verify correctness.
- Optional or missing data must be handled defensively in the UI.
- Changes should be minimal and scoped to avoid regressions in dashboard functionality.
  [Source: docs/sprint-artifacts/2-5-new-plan-notification.md]

### Architecture Notes

- User profile data is stored in `public.user_profiles`.
- Supabase Auth provides identity; profile data is application-owned.
- Frontend communicates via authenticated API calls using existing fetch utilities.
  [Source: docs/architecture-2025-11-30.md]

### Project Structure Notes

- Profile page: `frontend/src/app/(dashboard)/profile/page.tsx`
- Reusable components: `frontend/src/components/profile/`
- Backend endpoint: `backend/app/api/v1/endpoints/users.py`
- Data persistence: `public.user_profiles`

### Standards & Quality Notes

- Frontend implementation follows project React + Tailwind conventions.
- Backend changes follow FastAPI and Pydantic validation patterns.
- Testing aligns with project test strategy (unit + integration where applicable).

---

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-1-user-profile-page.context.xml

### Agent Model Used

Gemini

### Debug Log References

(To be populated if issues arise during implementation)

### Completion Notes

(To be filled during implementation)

### File List

(To be filled during implementation)

---

## Change Log

- 2025-12-17: Story completed and validated against PRD, Epic 3 tech spec, and architecture.

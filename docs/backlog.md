# Engineering Backlog

This backlog collects cross-cutting or future action items that emerge from reviews and planning.

Routing guidance:

- Use this file for non-urgent optimizations, refactors, or follow-ups that span multiple stories/epics.
- Must-fix items to ship a story belong in that story’s `Tasks / Subtasks`.
- Same-epic improvements may also be captured under the epic Tech Spec `Post-Review Follow-ups` section.

| Date | Story | Epic | Type | Severity | Owner | Status | Notes |
| ---- | ----- | ---- | ---- | -------- | ----- | ------ | ----- |
| onsdag 3. desember 2025 | 1.1 | 1 | Documentation | Medium | TBD | Open | Create `tech-spec-epic-1.md` document outlining technical details and guidelines for Epic 1. |
| onsdag 3. desember 2025 | 1.1 | 1 | Setup | Medium | TBD | Open | Ensure the `frontend/` directory is initialized as per Story 1.2. |
| onsdag 3. desember 2025 | 1.1 | 1 | Refactor | Low | TBD | Open | Implement explicit, structured logging configuration in `backend/app/main.py`. |
| lørdag 6. desember 2025 | 2.1 | 2 | Bug | High | TBD | Open | Re-enable Frontend API Integration: Uncomment and ensure the `fetch` call in `frontend/app/(dashboard)/workouts/page.tsx` is correctly configured to send workout log data to the backend. [file: `frontend/app/(dashboard)/workouts/page.tsx`: 55-60] |
| lørdag 6. desember 2025 | 2.1 | 2 | Bug | High | TBD | Open | Create and Apply Alembic Migration: Generate and run the necessary Alembic migration script for the `workout_log` table. [file: `backend/alembic/versions/` (new file)] |
| lørdag 6. desember 2025 | 2.1 | 2 | Tech Debt | Medium | TBD | Open | Enhance Frontend Integration Tests: Modify `frontend/tests/integration/test_workout_logging.test.tsx` to perform actual API calls. [file: `frontend/tests/integration/test_workout_logging.test.tsx`] |
| lørdag 6. desember 2025 | 2.1 | 2 | Enhancement | Low | TBD | Open | Implement Frontend Loading/Error States in `frontend/app/(dashboard)/workouts/page.tsx` for `fetchWorkout` and `handleSaveWorkout` operations. [file: `frontend/app/(dashboard)/workouts/page.tsx`] |
| lørdag 6. desember 2025 | 2.1 | 2 | Advisory | Low | TBD | Open | Replace hardcoded mock data for `todaysWorkout` and `exercises` in `frontend/app/(dashboard)/workouts/page.tsx` with dynamically fetched data. [file: `frontend/app/(dashboard)/workouts/page.tsx`] |
| lørdag 6. desember 2025 | 2.1 | 2 | Advisory | Low | TBD | Open | Consider implementing explicit idempotency mechanisms for the `log-workout` API endpoint if concerns arise about duplicate entries. |
| lørdag 6. desember 2025 | 2.1 | 2 | Advisory | Low | TBD | Open | Implement the full E2E test for the logging flow as initially outlined in the Epic Tech Spec. |
| lørdag 6. desember 2025 | 2.1 | 2 | Advisory | Low | TBD | Open | Verify that Supabase RLS policies are correctly implemented and configured for the `workout_log` table.


# Ad-Hoc Code Review: Epic 3

**Reviewer:** Amelia (dev agent)
**Date:** 2025-12-17
**Focus:** General quality, requirements compliance, bugfixes.

## Overall Summary

Review of stories 3-1, 3-2, and 3-3. General code quality is good with appropriate use of FastAPI, Pydantic, and Supabase. Frontend components demonstrate responsiveness and state management. However, several critical security and data integrity issues, along with minor code quality improvements, have been identified.

---

## Story 3-1: User Profile Page

**Outcome:** Changes Requested

### Key Findings:

-   **[High] Frontend:** The `frontend/src/app/(dashboard)/profile/page.tsx` directly calls `supabase.auth.getSession()` and fetches profile data. This could expose `accessToken` on the client-side for longer than necessary if not handled with care. (file: `frontend/src/app/(dashboard)/profile/page.tsx`: line 20).
-   **[High] Frontend:** The `handleSave` function in `frontend/src/app/(dashboard)/profile/page.tsx` uses `http://localhost:8000` directly for the API call. This hardcoded URL is a critical issue for deployment and local environment flexibility. (file: `frontend/src/app/(dashboard)/profile/page.tsx`: line 105).
-   **[Medium] Backend:** In `backend/app/api/v1/endpoints/users.py`, the `UserProfileUpdate` schema is used as the response model for `PUT /profile/`. This means sensitive fields like `id` are being returned, which should be avoided. A separate response schema (`UserProfileGetResponse`) is used for GET, but not for PUT. (file: `backend/app/api/v1/endpoints/users.py`: line 97).
-   **[Low] Backend:** Generic exception handling in `backend/app/api/v1/endpoints/users.py` and `backend/app/crud/user.py`. More specific error handling is recommended for better debugging and client error messages. (file: `backend/app/api/v1/endpoints/users.py`: lines 78, 122).
-   **[Low] Frontend:** No explicit visual feedback for loading states during `handleSave` in `frontend/src/app/(dashboard)/profile/page.tsx`. (file: `frontend/src/app/(dashboard)/profile/page.tsx`).

### Action Items:

-   `[ ]` **[High]** Refactor `frontend/src/app/(dashboard)/profile/page.tsx` to ensure `accessToken` is handled more securely (e.g., using server-side functions for API calls or ensuring immediate invalidation).
-   `[ ]` **[High]** Replace hardcoded `http://localhost:8000` with an environment variable for the API base URL in `frontend/src/app/(dashboard)/profile/page.tsx`.
-   `[ ]` **[Medium]** Create and use a dedicated `UserProfileUpdateResponse` schema for `PUT /api/v1/users/profile/` endpoint in `backend/app/api/v1/endpoints/users.py` to avoid returning unnecessary fields.
-   `[ ]` **[Low]** Improve exception handling in `backend/app/api/v1/endpoints/users.py` and `backend/app/crud/user.py` for better error messages.
-   `[ ]` **[Low]** Add loading indicators to the `handleSave` function in `frontend/src/app/(dashboard)/profile/page.tsx`.

---

## Story 3-2: Application Settings

**Outcome:** Changes Requested

### Key Findings:

-   **[High] Frontend:** Hardcoded `http://localhost:8000` for the API call in `frontend/src/app/(dashboard)/settings/page.tsx`. This is a critical issue for deployment. (file: `frontend/src/app/(dashboard)/settings/page.tsx`: line 84).
-   **[Medium] Frontend:** The `appSettings` is directly sent to the backend without explicit validation in `frontend/src/app/(dashboard)/settings/page.tsx`. While backend validation exists, client-side validation for the structure of `appSettings` would improve user experience. (file: `frontend/src/app/(dashboard)/settings/page.tsx`: line 149).
-   **[Low] Frontend:** The `getAuthHeaders` function in `frontend/src/app/(dashboard)/settings/page.tsx` is an `async` function and should be called with `await`. It's used in `useEffect` and `handleSave`, but the return value of `await getAuthHeaders()` is an object, not a promise. The function itself is fine, but the usage might not be what's intended. (file: `frontend/src/app/(dashboard)/settings/page.tsx`: line 34).
-   **[Low] Frontend:** The `NotificationBanner.tsx` component is directly fetching unread notifications. It might be more efficient to pass notifications as props, or use a global state management for notifications to avoid multiple fetches. (file: `frontend/src/components/NotificationBanner.tsx`: lines 42-61).
-   **[Low] Frontend:** The `NotificationBanner.tsx` component uses `console.log` for debugging purposes. These should be removed. (file: `frontend/src/components/NotificationBanner.tsx`: lines 45, 48, 59, 74, 80).

### Action Items:

-   `[ ]` **[High]** Replace hardcoded `http://localhost:8000` with an environment variable for the API base URL in `frontend/src/app/(dashboard)/settings/page.tsx`.
-   `[ ]` **[Medium]** Implement client-side validation for `appSettings` before sending to the backend in `frontend/src/app/(dashboard)/settings/page.tsx`.
-   `[ ]` **[Low]** Review and correct the usage of `getAuthHeaders` if it's not returning a promise.
-   `[ ]` **[Low]** Consider refactoring notification fetching in `NotificationBanner.tsx` to use global state or props for better performance.
-   `[ ]` **[Low]** Remove `console.log` statements from `NotificationBanner.tsx`.

---

## Story 3-3: Account Management

**Outcome:** Changes Requested

### Key Findings:

-   **[High] Frontend:** Password change logic in `frontend/src/app/(dashboard)/settings/page.tsx` uses `supabase.auth.updateUser({ password: newPassword })`. This function changes the password directly. There is no step to verify the old password, which is a significant security flaw. (file: `frontend/src/app/(dashboard)/settings/page.tsx`: line 175).
-   **[Medium] Frontend:** Email change logic in `frontend/src/app/(dashboard)/settings/page.tsx` uses `supabase.auth.updateUser({ email: newEmail })`. This triggers an email verification flow, which is good. However, the UI does not clearly communicate the verification step to the user, beyond "Confirmation emails sent...". (file: `frontend/src/app/(dashboard)/settings/page.tsx`: line 131).
-   **[Low] Backend:** Missing API endpoints for password change and account deletion. The `context.xml` mentions `POST /api/v1/users/me/change-password` and `DELETE /api/v1/users/me` but these are not implemented in `backend/app/api/v1/endpoints/users.py`.
-   **[Low] Frontend:** Account deletion functionality is mentioned in the story but not implemented in `frontend/src/app/(dashboard)/settings/page.tsx`.

### Action Items:

-   `[ ]` **[High]** Implement server-side verification of the old password before changing the password in `backend/app/api/v1/endpoints/users.py` and integrate it with the frontend password change form.
-   `[ ]` **[Medium]** Enhance the UI feedback in `frontend/src/app/(dashboard)/settings/page.tsx` for email change to clearly guide the user through the verification process.
-   `[ ]` **[Low]** Implement the `POST /api/v1/users/me/change-password` and `DELETE /api/v1/users/me` API endpoints in `backend/app/api/v1/endpoints/users.py`.
-   `[ ]` **[Low]** Implement the account deletion functionality in `frontend/src/app/(dashboard)/settings/page.tsx`.

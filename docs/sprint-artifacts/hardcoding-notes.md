# Hardcoding Notes

## Issue: Hardcoded Backend URL in `frontend/app/api/test-backend/route.ts`

**Description:**
The file `frontend/app/api/test-backend/route.ts` contains a hardcoded URL (`http://localhost:8000/`) for fetching data from the backend.

**Location:**
`frontend/app/api/test-backend/route.ts`, Line 5:
```typescript
const res = await fetch('http://localhost:8000/')
```

**Impact:**
If this API route is intended to be part of the production application, this hardcoded `localhost` URL will cause the application to fail when deployed to a non-local environment, as the backend will not be accessible at that address.

**Action Required (before deployment to staging/production):**

1.  **Determine Purpose:** Clarify if `frontend/app/api/test-backend/route.ts` is intended for production use or solely for local development/testing.
2.  **If for Production:** Replace `http://localhost:8000/` with an environment variable (e.g., `process.env.NEXT_PUBLIC_BACKEND_URL`) that points to the actual backend URL in the deployed environment.
3.  **If for Development/Testing Only:** Remove this file from the project before deployment or ensure it is properly excluded from production builds.

**Status:**
Identified - Action Pending.

### Best-Practices and References

**Frontend (Next.js/React/TypeScript/Tailwind CSS):**
-   **Next.js (v16.0.5+):** Utilize App Router.
-   **React (v19.2.1):** Follow React best practices for component composition and state management.
-   **TypeScript:** Enforce strict typing.
-   **Tailwind CSS:** Consistent utility-first styling.
-   **State Management:**
    -   Client-side: Zustand
    -   Server-side: SWR or React Query for data fetching and caching.
-   **Testing:** React Testing Library with Jest for component and integration tests. Mock API calls.

**Backend (Python/FastAPI):**
-   **FastAPI (v0.122.0):** Leverage Pydantic for data validation, dependency injection for clean architecture.
-   **Python (3.14+):** Adhere to PEP 8.
-   **Supabase:** Use for PostgreSQL database, authentication, and Row Level Security (RLS).
-   **AI Integration:** Pydantic AI framework with Gemini 2.5 for plan generation.
-   **Testing:** Pytest for unit and integration tests. Mock AI API calls and Supabase interactions.

**General:**
-   **API Contracts:** Versioned REST API (`/api/v1/`) with Pydantic schemas for request/response validation.
-   **Security:** Supabase Auth for JWT-based authentication, RLS for data authorization, HTTPS/SSL for data in transit.
-   **Logging:** Structured JSON logging to console (`stdout`/`stderr`).
-   **Dates:** ISO 8601 format, UTC.
-   **Deployment:** Vercel for frontend and backend.
-   **Background Tasks:** Vercel Cron Jobs (for Epic 2, but acknowledge its architecture).
-   **Caching:** Multi-layered (backend in-memory, frontend SWR/React Query).

**References:**
- `docs/architecture-2025-11-30.md`
- `docs/ux-design-specification.md`
- `docs/coding-standards.md` (Not explicitly loaded, but implied for general coding standards)
- `docs/sprint-artifacts/tech-spec-epic-1.md`
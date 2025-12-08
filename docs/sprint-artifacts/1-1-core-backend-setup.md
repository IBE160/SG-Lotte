
# Story 1.1: Core Backend Setup

Status: ready-for-dev

## Story

As a developer,
I want the FastAPI backend and Supabase database to be set up and connected,
so that I can build API endpoints and data models.

### Requirements Context Summary for Story 1.1: Core Backend Setup


This story focuses on establishing the foundational backend and database infrastructure, critical for all subsequent functional and non-functional requirements.

**Core Objective (from PRD):** Develop a comprehensive, AI-assisted web application that automatically generates and adjusts personalized workout and meal plans.

**Functional Requirements Addressed (directly supported):**
*   **FR-001: User Authentication & Profile Management:** Requires a functional backend and database for user registration, login, and profile storage.
*   **FR-002: AI-Driven Workout Plan Generation & Adaptation:** Depends on the backend for AI integration and plan storage.
*   **FR-003: AI-Driven Meal Plan Generation & Adaptation:** Similarly depends on the backend for AI integration and plan storage.

**Non-Functional Requirements (NFRs) Influenced:**
*   **Performance:** The choice of FastAPI and PostgreSQL (Supabase) lays the groundwork for high-performance API interactions.
*   **Security:** Supabase Auth and RLS are foundational for securing user data. Data encryption (in transit and at rest) is a key aspect.
*   **Scalability:** FastAPI's horizontal scalability and PostgreSQL's capabilities are selected to support future growth.
*   **Reliability (AI Integration):** This story establishes the environment where AI integrations (and their reliability patterns) will be built.

**Architectural Decisions & Context (from architecture-2025-11-30.md):**
*   **Backend Technology:** FastAPI (Python) is the chosen framework.
*   **Database & BaaS:** Supabase (PostgreSQL) will handle data persistence, authentication, Row Level Security (RLS), and storage.
*   **Project Initialization:** The `backend/` directory will house the FastAPI application.
*   **Project Structure:** A modular backend structure (`app/api/v1/endpoints`, `app/core`, `app/crud`, `app/models`, `app/schemas`, `app/services`) is defined.
*   **ADR-001 (Background Job/Async Processing):** While implementation is in Epic 2, the backend infrastructure established here must support future integration with Vercel Cron Jobs.
*   **ADR-002 (Caching Strategy):** The backend will implement a caching layer, influencing how data models and services are designed from the start.

**Story Statement:**

As a developer,
I want the FastAPI backend and Supabase database to be set up and connected,
So that I can build API endpoints and data models.

**Acceptance Criteria:**

**Given** the project is initialized
**When** I set up the backend
**Then** a FastAPI app is created and running (Source: Epics Story 1.1)
**And** a Supabase project is connected and configured (Source: Epics Story 1.1)
**And** Alembic migrations are configured for database schema management (Source: Epics Story 1.1)

### Project Structure Alignment and Lessons Learned

Given this is the first story in Epic 1, there are no previous story learnings to incorporate. The focus is on establishing the initial project structure in strict adherence to the defined architectural patterns.

**Key Structural and Naming Patterns to Adhere To:**

*   **API Endpoints:**
    *   Naming: Plural nouns and kebab-case (e.g., `/api/v1/workout-plans`).
*   **Database Tables:**
    *   Naming: Plural nouns and snake_case (e.g., `users`, `workout_plans`).
*   **Database Columns:**
    *   Naming: Snake_case (e.g., `user_id`, `created_at`).
*   **Backend Testing:**
    *   Location: All tests will reside in the root `backend/tests/` directory.
*   **Backend Shared Logic:**
    *   Core logic, configuration, and services will be placed in `backend/app/core/` and `backend/app/services/`.

**Expected Backend Directory Structure for Initial Setup:**

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── endpoints/
│   │   │   │   ├── __init__.py
│   │   │   │   └── users.py (for initial user endpoints, e.g., registration)
│   │   │   └── deps.py
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py
│   ├── crud/
│   │   └── __init__.py (placeholder)
│   ├── models/
│   │   └── __init__.py (placeholder for database models)
│   ├── schemas/
│   │   └── __init__.py (placeholder for Pydantic schemas)
│   └── services/
│       └── __init__.py (placeholder for services)
├── tests/
│   └── __init__.py (placeholder for backend tests)
├── alembic/
│   └── (Alembic migration files and env.py)
├── alembic.ini
└── requirements.txt
```

This structure ensures that the initial backend setup aligns with the architectural vision, facilitating future development and maintaining consistency across the project.

### Tasks / Subtasks

*   [ ] **Setup:** Initialize `backend/` directory structure.
    *   [ ] Create `backend/` folder.
    *   [ ] Create `backend/app/`, `backend/app/api/`, `backend/app/api/v1/`, `backend/app/api/v1/endpoints/`, `backend/app/core/`, `backend/crud/`, `backend/models/`, `backend/schemas/`, `backend/services/` directories.
    *   [ ] Create empty `__init__.py` files in all `app/` subdirectories.
*   [ ] **FastAPI Application (AC: #1):**
    *   [ ] Create `backend/requirements.txt` with `fastapi`, `uvicorn`, `sqlalchemy`, `asyncpg`, `alembic`, `psycopg2-binary`, `pytest`.
    *   [ ] Create `backend/app/main.py` with a basic FastAPI app instance.
    *   [ ] Implement a basic health check endpoint (e.g., `/health`) in `backend/app/api/v1/endpoints/health.py` and include it in `main.py`.
    *   [ ] **Testing:** Create a test for the `/health` endpoint in `backend/tests/api/v1/test_health.py`.
*   [ ] **Supabase Configuration (AC: #2):**
    *   [ ] Add Supabase connection details to `backend/app/core/config.py`.
    *   [ ] Implement a Supabase client or a SQLAlchemy database connection utility.
    *   [ ] **Testing:** Write a test to verify the database connection can be established.
*   [ ] **Alembic Configuration (AC: #3):**
    *   [ ] Initialize Alembic in `backend/` directory (`alembic init alembic`).
    *   [ ] Configure `alembic.ini` and `env.py` to connect to the Supabase PostgreSQL database.
    *   [ ] Create a basic initial migration script (e.g., for a `users` table).
    *   [ ] **Testing:** Write a test to check the Alembic configuration and current revision.
*   [ ] **User Endpoint Placeholder:**
    *   [ ] Create `backend/app/api/v1/endpoints/users.py` with an initial placeholder for future user-related endpoints.

## Dev Notes

*   **Relevant architecture patterns and constraints**:
    *   Backend: FastAPI (Python), Supabase (PostgreSQL, Auth, RLS).
    *   Pydantic AI framework with Gemini 2.5 will be used for AI interactions.
    *   ADR-001 (Vercel Cron Jobs for background processing) and ADR-002 (Multi-layered caching) lay the foundation for future work, and the current setup must accommodate these.
*   **Source tree components to touch**:
    *   The entire `backend/` directory will be initialized and populated, including:
        *   `backend/app/` (core application logic, API endpoints, services, schemas, models, CRUD operations)
        *   `backend/tests/` (for backend unit and integration tests)
        *   `backend/alembic/` and `alembic.ini` (for database migrations)
        *   `backend/requirements.txt` (for Python dependencies)
*   **Testing standards summary**:
    *   Backend unit and integration tests will be written using `Pytest` and will reside in the `backend/tests/` directory, mirroring the structure of the `backend/app/` modules.

### Project Structure Notes

Refer to the "Project Structure Alignment and Lessons Learned" section above for detailed notes on adherence to unified project structure, naming conventions, and expected directory layout.

### References

*   [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Acceptance-Criteria-Authoritative]
*   [Source: docs/PRD.md#Executive-Summary]
*   [Source: docs/architecture-2025-11-30.md#Project-Context]
*   [Source: docs/epics.md#Story-11-Core-Backend-Setup]

## Dev Agent Record

*   **Context Reference:**
    *   `docs/sprint-artifacts/1-1-core-backend-setup.context.xml`
*   **Agent Model Used:**
*   **Debug Log References:**
*   **Completion Notes List:**
*   **File List:**

## Change Log

- **mandag 8. desember 2025**: Initial draft of story "1.1: Core Backend Setup" created.


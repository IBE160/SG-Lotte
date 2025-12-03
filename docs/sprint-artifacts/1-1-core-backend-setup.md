# Story 1.1: Core Backend Setup

Status: drafted

## Story

As a developer,
I want the FastAPI backend and Supabase database to be set up and connected,
So that I can build API endpoints and data models.

## Acceptance Criteria

**Given** the project is initialized
**When** I set up the backend
**Then** a FastAPI app is created and running
**And** a Supabase project is connected and configured
**And** Alembic migrations are configured for database schema management

## Technical Notes & Context

### From Epic Technical Specification (Epic 1: First Plan & Foundation)

Story 1.1: Core Backend Setup involves setting up the FastAPI backend, connecting to Supabase, and configuring Alembic. This is a foundational step for the entire project.

### From Architecture Document

**Project Structure:**
The `backend/` directory will house the FastAPI application. Key files will include:
- `backend/app/main.py`: Main FastAPI application.
- `backend/app/api/v1/endpoints/users.py`, `backend/app/api/v1/endpoints/plans.py`: API endpoints.
- `backend/app/services/ai_plan_generator.py`: AI plan generation logic.
- `backend/alembic/`: Database migrations.
- `backend/requirements.txt`: Python dependencies.

**Technology Stack:**
- **Backend:** FastAPI v0.122.0 with Python 3.14.
- **Database:** Supabase (PostgreSQL).
- **ORM/Database Migration:** Alembic.

**Implementation Patterns (Naming & Structure):**
- **API Endpoints:** Plural nouns and kebab-case (e.g., `/api/v1/workout-plans`).
- **Database Tables:** Plural nouns and snake_case (e.g., `users`, `workout_plans`).
- **Database Columns:** Snake_case (e.g., `user_id`, `created_at`).
- **Testing (Backend):** All tests will reside in the root `tests/` directory within the backend.

**ADR-001: Background Job/Async Processing Strategy:**
While this story doesn't directly implement background jobs, the architecture anticipates Vercel Cron Jobs for future Epic 2 tasks. The backend setup should facilitate this integration.

**ADR-002: Caching Strategy:**
The backend will implement a caching layer (e.g., using `fastapi-cache2` with an in-memory backend for the MVP) to cache common database queries and computed results. This should be considered during initial setup for future implementation.

## Acceptance Criteria

**Given** the project is initialized
**When** I set up the backend
**Then** a FastAPI app is created and running
**And** a Supabase project is connected and configured
**And** Alembic migrations are configured for database schema management

## Tasks / Subtasks

- [x] Initialize FastAPI project structure (AC: all)
  - [x] Create `backend/` directory
  - [x] Create `backend/requirements.txt` with `FastAPI`, `uvicorn`, `SQLAlchemy`, `psycopg2-binary`, `alembic`, `python-dotenv`
  - [x] Create `backend/app/main.py` with basic FastAPI app instance
  - [x] Configure `uvicorn` to run the app
- [x] Connect FastAPI to Supabase (AC: Supabase configured)
  - [x] Install `supabase-py` client library
  - [x] Configure Supabase client with API URL and Anon Key from environment variables
  - [x] Verify connection to Supabase database
- [x] Configure Alembic for database migrations (AC: Alembic migrations configured)
  - [x] Initialize Alembic in `backend/alembic`
  - [x] Configure `alembic.ini` to connect to Supabase PostgreSQL database
  - [x] Generate initial migration script
  - [x] Apply initial migration to create necessary tables (e.g., `users` table as a placeholder)
- [x] Implement basic test for backend setup (AC: FastAPI app running)
  - [x] Create `backend/tests/test_main.py`
  - [x] Write a simple test to verify FastAPI app is accessible (e.g., GET `/`)

## Dev Notes

### Project Structure Notes

- Adhere to the defined project structure from `docs/architecture-2025-11-30.md`.
- Backend code should reside under `backend/app/`.
- Testing code for backend should be under `backend/tests/`.

Status: ready-for-dev

## Dev Agent Record

### Context Reference
- C:/IT_studier/IBE160_Programmering_med_KI/Prosjektmappe/Prosjekt/SG-Lotte/docs/sprint-artifacts/1-1-core-backend-setup.context.xml

### Agent Model Used

Gemini

### Debug Log References
- Initialized FastAPI project structure (backend/ directory, requirements.txt, backend/app/main.py created, uvicorn configured).
- Connected FastAPI to Supabase (supabase-py installed, client configured, health check endpoint added).
- Configured Alembic for database migrations (alembic init, alembic.ini and env.py updated).
- Implemented basic test for backend setup (backend/tests/test_main.py created with basic tests).


### Completion Notes List

### File List
- backend/requirements.txt (modified)
- backend/app/main.py (modified)
- backend/alembic.ini (created/modified)
- backend/alembic/env.py (created/modified)
- backend/alembic/versions/ (created)
- backend/tests/test_main.py (created)


## Change Log

- **onsdag 3. desember 2025**: Initial draft created by BIP (Scrum Master Agent).
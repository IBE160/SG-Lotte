# Story 1.1: Core Backend Setup

Status: drafted

## Story

As a developer, I want the FastAPI backend and Supabase database to be set up and connected, so that I can build API endpoints and data models.

## Acceptance Criteria

*   **Given** the project is initialized **When** I set up the backend **Then** a FastAPI app is created and running.
*   **Given** the project is initialized **When** I set up the backend **Then** a Supabase project is connected and configured.
*   **Given** the project is initialized **When** I set up the backend **Then** Alembic migrations are configured for database schema management.

## Tasks / Subtasks

- [ ] **Backend Project Setup:**
  - [ ] Create a `backend/` directory in the project root.
  - [ ] Initialize a Python virtual environment within `backend/` using `uv` (e.g., `uv venv`).
  - [ ] Create `backend/requirements.txt` and add `fastapi`, `uvicorn`, `supabase`, `alembic`, `pydantic-settings`, `pydantic-ai`.
  - [ ] Install dependencies using `uv pip install -r backend/requirements.txt`.
  - [ ] Create a basic FastAPI application in `backend/app/main.py` that includes basic logging configuration.
  - [ ] Run the FastAPI application with `uvicorn backend.app.main:app --reload` and verify it starts successfully. (AC: 1.1.1)

- [ ] **Supabase Integration:**
  - [ ] Set up a new Supabase project (if not already done).
  - [ ] Configure Supabase client in the FastAPI application (e.g., in `backend/app/core/config.py` for API keys and project URL).
  - [ ] Add environment variables for `SUPABASE_URL` and `SUPABASE_KEY` to a `.env` file in `backend/` (and ensure `.env` is in `.gitignore`).
  - [ ] Verify the FastAPI app can connect to Supabase. (AC: 1.1.2)

- [ ] **Alembic Migration Setup:**
  - [ ] Initialize Alembic within the `backend/` directory (e.g., `alembic init alembic`).
  - [ ] Configure `alembic.ini` to point to the Supabase PostgreSQL database connection string.
  - [ ] Create a simple initial migration (e.g., for a basic `users` table).
  - [ ] Run the migration to verify Alembic is configured correctly. (AC: 1.1.3)

- [ ] **Initial AI Integration Setup:**
  - [ ] Create `backend/app/services/ai_plan_generator.py`.
  - [ ] Add environment variable for `GEMINI_API_KEY` to the `.env` file in `backend/`.
  - [ ] Implement a placeholder Pydantic AI framework integration (e.g., a simple function that takes a prompt and returns a dummy response, using the API key).
  - [ ] Ensure the API key is loaded securely via Pydantic Settings.

- [ ] **Logging Configuration:**
  - [ ] Implement structured JSON logging to `stdout`/`stderr` as per architecture.

- [ ] **Testing Strategy (Unit/Integration):**
  - [ ] Set up `pytest` in the `backend/tests/` directory.
  - [ ] Write a unit test to ensure the FastAPI app instance is created.
  - [ ] Write an integration test to confirm connection to Supabase.
  - [ ] Write an integration test to confirm Alembic migrations can run.
  - [ ] Write a unit test for the `ai_plan_generator.py` service (using a mocked AI response).

## Dev Notes

**Technical Context and Constraints:**
*   **Backend Framework:** FastAPI (Python 3.14)
*   **Database & BaaS:** Supabase (PostgreSQL). Supabase user management is a remote, managed service, not a local database.
*   **Package Management (Backend):** `uv` is the preferred package manager.
*   **AI Integration:** Pydantic AI framework with Gemini 2.5 flash.
*   **Project Structure (Backend):** The backend project will reside in the `backend/` directory, following a structure with `app/`, `main.py`, `api/`, `core/`, `services/`, `alembic/`, and `requirements.txt`.
*   **Logging:** Structured JSON format logs to `stdout`/`stderr`.
*   **Development Environment:** `uv pip install -r backend/requirements.txt` and `uvicorn app.main:app --reload` for development.

**Specific Considerations for API Keys (.env file):**
For Supabase and Gemini API keys, these should be stored as environment variables and loaded into the FastAPI application securely (e.g., using Pydantic Settings management). The `.env` file is the appropriate place for these keys in development. During deployment (e.g., to Vercel), these should be configured as secret environment variables in the deployment platform settings.

### Project Structure Notes

As this is the first story in Epic 1, there are no previous story learnings or existing project structure to align against for this specific story. The focus is on establishing the initial backend structure as defined in the Architecture document and `tech-spec-epic-1.md`.

No existing files were created or modified by a previous story in this epic. The implementation will initiate the backend project within the `backend/` directory, adhering to the prescribed directory structure and technology stack (FastAPI, Python, uv, Supabase).

### Testing Standards Summary

*   Backend (FastAPI): Unit and integration tests will be written using `Pytest` in the `backend/tests/` directory.

## References

- [Source: docs/epics.md#story-11-core-backend-setup]
- [Source: docs/architecture-2025-11-30.md]
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md]
- [Source: docs/PRD.md]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

Gemini

### Debug Log References

### Completion Notes List

### File List
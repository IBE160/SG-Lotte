### Story 1.1: Core Backend Setup

As a developer,
I want the FastAPI backend and Supabase database to be set up and connected,
So that I can build API endpoints and data models.

**Acceptance Criteria:**

**Given** the project is initialized
**When** I set up the backend
**Then** a FastAPI app is created and running
**And** a Supabase project is connected and configured
**And** Alembic migrations are configured for database schema management

**Prerequisites:** None

**Technical Notes:** This involves setting up the `backend/` directory, `requirements.txt`, basic FastAPI app structure, and Supabase client.

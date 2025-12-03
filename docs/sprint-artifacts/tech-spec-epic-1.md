# Tech Spec: Epic 1 - First Plan & Foundation

This document outlines the technical specifications, guidelines, and architectural decisions for Epic 1: First Plan & Foundation. Its purpose is to ensure consistency and alignment across all stories within this epic.

## 1. Epic 1 Overview

Epic 1 focuses on establishing the core technical foundation for the AI Fitness & Meal Planner application. This includes setting up the backend and frontend, implementing user authentication, and delivering the initial AI-driven plan generation feature.

## 2. Technology Stack

| Component | Technology | Version/Details |
| :--- | :--- | :--- |
| **Backend** | Python / FastAPI | Python 3.14, FastAPI 0.122.0 |
| **Database** | Supabase (PostgreSQL) | - |
| **ORM/Migration** | SQLAlchemy / Alembic | - |
| **Frontend** | JavaScript / Next.js | Next.js 14+ |
| **Authentication**| Supabase Auth | JWT-based |
| **Testing** | Pytest (backend) | - |

## 3. Project Structure

The project follows a monorepo structure with decoupled `frontend` and `backend` directories.

```
/
├── backend/
│   ├── alembic/              # Database migrations
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── endpoints/
│   │   ├── core/               # Core logic, config, services
│   │   ├── services/
│   │   └── main.py             # FastAPI app entry point
│   ├── tests/                # Backend tests
│   └── requirements.txt
├── docs/
│   └── ...
└── frontend/
    └── ...                   # Next.js app structure
```

## 4. API Design

- **Naming Convention:** API endpoints will use plural nouns and kebab-case (e.g., `/api/v1/workout-plans`).
- **Versioning:** All endpoints will be versioned under `/api/v1/`.
- **Response Format:** All API responses will use a consistent JSON structure.
- **Error Handling:** API errors will return a standardized JSON object: `{ "detail": "Error message" }`.

## 5. Database Design

- **Table Naming:** Database tables will use plural nouns and snake_case (e.g., `users`, `workout_plans`).
- **Column Naming:** Database columns will use snake_case (e.g., `user_id`, `created_at`).

## 6. Authentication and Authorization

- **Authentication:** Handled by Supabase Auth, using JWTs for secure sessions. The frontend will manage the JWT, and the backend will validate it for protected endpoints.
- **Authorization:** Supabase's Row Level Security (RLS) will be enabled for all tables containing user-specific data to enforce data access policies at the database level.

## 7. Testing Strategy

- **Backend:** Unit and integration tests for the FastAPI backend will be written using `Pytest`. All backend tests will reside in the `backend/tests/` directory. A key initial test is a health check endpoint (`/`) that returns a 200 OK status.
- **Frontend:** (To be detailed in Story 1.2 tech spec).
- **E2E:** A simple "hello world" API call from the frontend to the backend will be used to verify the end-to-end connection.

## 8. Architectural Decision Records (ADRs)

- **ADR-001: Background Job/Async Processing Strategy:** The architecture anticipates using Vercel Cron Jobs for future asynchronous tasks (e.g., in Epic 2 for plan adaptations). The backend setup should be designed to facilitate this.
- **ADR-002: Caching Strategy:** A caching layer will be implemented in the FastAPI backend (e.g., using `fastapi-cache2`) to improve performance by caching common database queries. This will be considered from the initial setup.

This document serves as the primary technical reference for developers working on Epic 1. All implementation should adhere to these guidelines.
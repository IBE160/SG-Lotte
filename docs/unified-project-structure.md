# Unified Project Structure Guidelines

This document outlines the standard project structure to be followed for all services and applications within the project.

## Root Directory Structure

- `frontend/`: Contains all frontend applications (e.g., Next.js projects).
- `backend/`: Contains all backend services (e.g., FastAPI applications).
- `docs/`: Contains all project documentation, including technical specifications, PRDs, architecture documents, and sprint artifacts.
- `.bmad/`: Contains BMAD-specific configurations and workflows.
- `shared/`: (Optional) Contains shared libraries, components, or utilities that can be used by both frontend and backend.

## Naming Conventions

- **Folders:** kebab-case (e.g., `sprint-artifacts`, `ai-plan-generator`)
- **Files:** kebab-case (e.g., `tech-spec-epic-1.md`, `unified-project-structure.md`)

## General Principles

- **Modularity:** Each major component or service should reside in its own dedicated directory.
- **Consistency:** Adhere to these guidelines across the entire project to ensure maintainability and readability.
- **Separation of Concerns:** Clearly separate frontend, backend, and documentation aspects.

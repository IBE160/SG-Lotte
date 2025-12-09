# Coding Standards

## Overview

This document outlines the coding standards and best practices for the project. Adhering to these standards ensures code consistency, readability, maintainability, and quality across the development team.

## General Principles

*   **Readability:** Code should be easy to read and understand.
*   **Maintainability:** Code should be easy to modify and extend.
*   **Consistency:** Follow existing patterns and styles within the codebase.
*   **Simplicity:** Prefer simple solutions over complex ones.
*   **Performance:** Optimize for performance where critical, but not at the expense of readability.

## Language-Specific Guidelines

### Python (FastAPI Backend)

*   **PEP 8:** Adhere to PEP 8 style guide. Use linters like `flake8` or `ruff` to enforce.
*   **Type Hinting:** Use type hints for all function arguments and return values.
*   **Docstrings:** Write clear and concise docstrings for all modules, classes, and functions using Google style.
*   **Imports:** Organize imports at the top of the file, grouped as follows:
    1.  Standard library imports
    2.  Third-party imports
    3.  Local application/library imports
    Sort alphabetically within each group.
*   **Naming Conventions:**
    *   Modules: `snake_case`
    *   Classes: `CamelCase`
    *   Functions/Methods: `snake_case`
    *   Variables: `snake_case`
    *   Constants: `UPPER_SNAKE_CASE`
*   **FastAPI Specifics:**
    *   Use Pydantic for data validation and serialization.
    *   Define clear and concise API routes with appropriate response models.
    *   Handle exceptions gracefully using FastAPI's `HTTPException`.
    *   Use dependency injection for services and database sessions.

### TypeScript/React (Next.js Frontend)

*   **ESLint & Prettier:** Use ESLint for linting and Prettier for code formatting to ensure consistency.
*   **TypeScript Best Practices:**
    *   Use strong typing (`strict` mode in `tsconfig.json`).
    *   Define interfaces or types for all data structures.
    *   Avoid `any` where possible.
*   **React/Next.js Specifics:**
    *   **Functional Components:** Prefer functional components with React Hooks.
    *   **Props:** Destructure props explicitly.
    *   **State Management:** Use `useState` and `useReducer` for local component state. Consider `Zustand` or React Context for global state.
    *   **Styling:** Use Tailwind CSS classes. Avoid inline styles where possible.
    *   **File Structure:** Organize components logically, typically by feature or route.
    *   **API Calls:** Use a consistent approach for data fetching (e.g., SWR, React Query) with error handling.
    *   **Accessibility:** Ensure all UI components are accessible (semantic HTML, ARIA attributes where needed).
*   **Naming Conventions:**
    *   Components: `PascalCase`
    *   Hooks: `useCamelCase`
    *   Variables/Functions: `camelCase`
    *   Type/Interface Names: `PascalCase`

## Documentation

*   **Comments:** Use comments sparingly, only to explain *why* something is done, not *what* is done (unless the "what" is non-obvious).
*   **READMEs:** Ensure each major directory or module has a `README.md` explaining its purpose and contents.
*   **Commit Messages:** Follow Conventional Commits specification.

## Code Review

*   All code changes must be reviewed by at least one other developer before merging.
*   Reviewers should check for adherence to these coding standards, as well as logic, test coverage, and potential side effects.

## Tools

*   **Linters:** `flake8`, `ruff` (Python); `ESLint` (TypeScript/JavaScript).
*   **Formatters:** `Black` (Python); `Prettier` (TypeScript/JavaScript).
*   **Version Control:** `Git`.

## Enforcement

Adherence to these coding standards will be part of the code review process. CI/CD pipelines will include linting and formatting checks to catch violations early.

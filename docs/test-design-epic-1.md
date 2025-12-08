# Test Design: Epic 1 - First Plan & Foundation

**Date:** 2025-11-30
**Author:** BIP
**Status:** Draft

---

## Executive Summary

**Scope:** Full test design for Epic 1.

**Risk Summary:**

- Total risks identified: 5
- High-priority risks (≥6): 2
- Critical categories: SEC (Security), BUS (Business Impact)

**Coverage Summary:**

- P0 scenarios: 8 (16 hours)
- P1 scenarios: 10 (10 hours)
- P2/P3 scenarios: 12 (6 hours)
- **Total effort**: 32 hours (~4 days)

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-001 | BUS | AI plan generation fails or produces nonsensical plans. | 3 | 3 | 9 | Implement strict schema validation on AI output, have a fallback to a default plan, and implement robust error handling and logging. | DEV | Sprint 1 |
| R-002 | SEC | User registration is insecure, allowing for account takeover. | 2 | 3 | 6 | Enforce email verification, use Supabase's built-in security features, test for common vulnerabilities (e.g., insecure password reset). | DEV | Sprint 1 |

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R-003 | BUS | Onboarding flow is confusing or buggy, leading to high user drop-off. | 2 | 2 | 4 | E2E testing of the full onboarding flow, component testing for each step. | QA |
| R-004 | OPS | Backend/Frontend setup is misconfigured, causing deployment or integration issues. | 2 | 2 | 4 | Implement CI/CD pipeline early, have a simple "hello world" API call to verify connection. | DEVOPS |
| R-005 | SEC | Sensitive user preferences (dietary, goals) are not stored securely. | 1 | 3 | 3 | Implement and test Supabase Row Level Security policies to ensure users can only access their own data. | DEV |

### Risk Category Legend

- **TECH**: Technical/Architecture (flaws, integration, scalability)
- **SEC**: Security (access controls, auth, data exposure)
- **PERF**: Performance (SLA violations, degradation, resource limits)
- **DATA**: Data Integrity (loss, corruption, inconsistency)
- **BUS**: Business Impact (UX harm, logic errors, revenue)
- **OPS**: Operations (deployment, config, monitoring)

---

## Test Coverage Plan

### P0 (Critical) - Run on every commit

**Criteria**: Blocks core journey + High risk (≥6) + No workaround

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| User can register and verify email | E2E | R-002 | 3 | QA | Happy path, invalid email, already registered email. |
| AI generates a valid plan | API | R-001 | 5 | DEV | Test AI output against schema, test fallback mechanism. |

**Total P0**: 8 tests, 16 hours

### P1 (High) - Run on PR to main

**Criteria**: Important features + Medium risk (3-4) + Common workflows

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| Onboarding flow is completable | E2E | R-003 | 2 | QA | Test the full 5-step onboarding flow. |
| Backend/Frontend are connected | Integration | R-004 | 2 | DEV | Simple API call from frontend to backend. |
| User preferences are saved securely | API | R-005 | 6 | DEV | Test API endpoints for saving user data with auth. |

**Total P1**: 10 tests, 10 hours

### P2 (Medium) - Run nightly/weekly

**Criteria**: Secondary features + Low risk (1-2) + Edge cases

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| UI components in onboarding | Component | R-003 | 12 | DEV | Test individual components for each step. |

**Total P2**: 12 tests, 6 hours

### P3 (Low) - Run on-demand

**Criteria**: Nice-to-have + Exploratory + Performance benchmarks

**Total P3**: 0 tests, 0 hours

---

## Execution Order

### Smoke Tests (<5 min)
- [ ] User can load the login page
- [ ] Backend health check endpoint returns 200 OK

### P0 Tests (<10 min)
- [ ] User can register with a valid email and password
- [ ] User receives a verification email
- [ ] AI plan generation endpoint returns a valid plan structure

### P1 Tests (<30 min)
- [ ] User can complete the entire onboarding flow
- [ ] Frontend can successfully fetch data from the backend API
- [ ] User preferences are correctly saved and retrieved

### P2/P3 Tests (<60 min)
- [ ] All individual UI components in the onboarding flow render correctly

---

## Resource Estimates

### Test Development Effort

| Priority | Count | Hours/Test | Total Hours | Notes |
| --- | --- | --- | --- | --- |
| P0 | 8 | 2.0 | 16 | Complex setup for E2E and AI validation |
| P1 | 10 | 1.0 | 10 | Standard integration and E2E tests |
| P2 | 12 | 0.5 | 6 | Component tests |
| P3 | 0 | 0.25 | 0 | None for this epic |
| **Total** | **30** | **-** | **32** | **~4 days** |

### Prerequisites

**Test Data:**
- User data factory for creating test users with different profiles.
- Mock AI responses for testing plan generation logic without hitting the actual AI API.

**Tooling:**
- `Pytest` for backend testing.
- `React Testing Library` and `Jest` for frontend component testing.
- `Playwright` for E2E tests.

**Environment:**
- A staging environment with a separate Supabase project for running E2E tests.
- CI/CD pipeline (Vercel) configured to run tests automatically.

---

## Quality Gate Criteria

### Pass/Fail Thresholds
- **P0 pass rate**: 100% (no exceptions)
- **P1 pass rate**: ≥95%
- **P2/P3 pass rate**: ≥90%
- **High-risk mitigations**: 100% complete

### Coverage Targets
- **Critical paths**: ≥80%
- **Security scenarios**: 100%

### Non-Negotiable Requirements
- [ ] All P0 tests pass
- [ ] No high-risk (≥6) items unmitigated
- [ ] Security tests (SEC category) pass 100%

---

## Mitigation Plans

### R-001: AI plan generation fails (Score: 9)
**Mitigation Strategy:** Implement a robust validation layer for all Pydantic AI framework with Gemini 2.5 responses against a strict Pydantic schema. If validation fails or the API call times out, the system will fall back to serving a pre-defined default plan from the database. All failures will be logged with high priority for immediate review.
**Owner:** DEV
**Timeline:** Sprint 1
**Status:** Planned

### R-002: Insecure user registration (Score: 6)
**Mitigation Strategy:** All authentication will be handled by Supabase Auth, which includes email verification. A security review of the frontend and backend integration with Supabase will be conducted. E2E tests will cover negative paths, such as attempting to log in without verification.
**Owner:** DEV
**Timeline:** Sprint 1
**Status:** Planned

---

## Assumptions and Dependencies

### Assumptions
1. The `epics.md` document accurately reflects the scope of Epic 1.
2. The core technology stack (Next.js, FastAPI, Supabase) is stable and suitable for the project.

### Dependencies
1. Access to a Supabase project and AI API keys for development and testing.

### Risks to Plan
- **Risk**: Underestimation of test development effort.
  - **Impact**: Delays in delivery.
  - **Contingency**: Re-prioritize P2/P3 tests to focus on P0/P1 coverage if time is short.

---

## Approval

**Test Design Approved By:**
- [ ] Product Manager: BIP Date: {date}
- [ ] Tech Lead: {name} Date: {date}
- [ ] QA Lead: {name} Date: {date}

**Comments:**

---

## Appendix

### Knowledge Base References
- `risk-governance.md`
- `probability-impact.md`
- `test-levels-framework.md`
- `test-priorities-matrix.md`

### Related Documents
- PRD: `docs/PRD.md`
- Epic: `docs/epics.md`
- Architecture: `docs/architecture-2025-11-30.md`

---

**Generated by**: BMad TEA Agent - Test Architect Module
**Workflow**: `.bmad/bmm/testarch/test-design`
**Version**: 4.0 (BMad v6)
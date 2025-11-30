# Test Design: Epic 2 - Adaptive Planning & Progress Logging

**Date:** 2025-11-30
**Author:** BIP
**Status:** Draft

---

## Executive Summary

**Scope:** Full test design for Epic 2.

**Risk Summary:**

- Total risks identified: 4
- High-priority risks (≥6): 1
- Critical categories: BUS (Business Impact)

**Coverage Summary:**

- P0 scenarios: 6 (12 hours)
- P1 scenarios: 12 (12 hours)
- P2/P3 scenarios: 6 (3 hours)
- **Total effort**: 27 hours (~3.5 days)

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-201 | BUS | AI adaptation logic is flawed, leading to poor or nonsensical plan evolution. | 3 | 3 | 9 | Unit test adaptation logic with various data scenarios. Monitor for anomalies. E2E tests to verify a full feedback loop. | DEV | Sprint 2 |

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R-202 | DATA | Incorrect logging of workout/meal data leads to data corruption. | 2 | 2 | 4 | API validation for all logged data. Component and E2E tests for the logging UI. | QA |
| R-203 | PERF | Performance degradation in progress visualization with large amounts of data. | 2 | 2 | 4 | Paginate historical data. Use database indexing on timestamp fields. Consider pre-aggregating data for charts. | DEV |

### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Probability | Impact | Score | Action |
| --- | --- | --- | --- | --- | --- | --- |
| R-204 | BUS | In-app notifications are unreliable or not delivered. | 2 | 1 | 2 | Monitor |

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
| AI correctly adapts plan based on user feedback | API | R-201 | 6 | DEV | Test various scenarios: high/low difficulty ratings, skipped workouts, etc. |

**Total P0**: 6 tests, 12 hours

### P1 (High) - Run on PR to main

**Criteria**: Important features + Medium risk (3-4) + Common workflows

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| User can log workout and meal completion | E2E | R-202 | 4 | QA | Test happy path for logging both workouts and meals. |
| Progress visualization loads correctly | Component | R-203 | 8 | DEV | Test Recharts components with mock data of varying sizes. |

**Total P1**: 12 tests, 12 hours

### P2 (Medium) - Run nightly/weekly

**Criteria**: Secondary features + Low risk (1-2) + Edge cases

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| In-app notification UI displays correctly | Component | R-204 | 6 | DEV | Test notification component with different message lengths. |

**Total P2**: 6 tests, 3 hours

### P3 (Low) - Run on-demand

**Total P3**: 0 tests, 0 hours

---

## Execution Order

### Smoke Tests (<5 min)
- [ ] User can load the workout logging page
- [ ] User can load the meal logging page

### P0 Tests (<10 min)
- [ ] AI adaptation endpoint returns a valid plan when provided with valid user data

### P1 Tests (<30 min)
- [ ] User can successfully log a completed workout and a rating
- [ ] User can successfully log an eaten meal
- [ ] Progress visualization chart renders with data

### P2/P3 Tests (<60 min)
- [ ] Notification component renders correctly

---

## Resource Estimates

### Test Development Effort

| Priority | Count | Hours/Test | Total Hours | Notes |
| --- | --- | --- | --- | --- |
| P0 | 6 | 2.0 | 12 | Complex logic for AI adaptation tests |
| P1 | 12 | 1.0 | 12 | Standard integration and E2E tests |
| P2 | 6 | 0.5 | 3 | Component tests |
| P3 | 0 | 0.25 | 0 | None for this epic |
| **Total** | **24** | **-** | **27** | **~3.5 days** |

### Prerequisites

**Test Data:**
- User data with several weeks of logged history to test adaptation logic.
- Mock AI responses for adaptation scenarios.

**Tooling:**
- `Pytest` for backend testing.
- `React Testing Library` and `Jest` for frontend component testing.
- `Playwright` for E2E tests.

**Environment:**
- Staging environment for running E2E tests with a populated database.

---

## Quality Gate Criteria

### Pass/Fail Thresholds
- **P0 pass rate**: 100%
- **P1 pass rate**: ≥95%
- **High-risk mitigations**: 100% complete

### Coverage Targets
- **Critical paths**: ≥85%
- **Business logic**: ≥75%

### Non-Negotiable Requirements
- [ ] All P0 tests pass
- [ ] No high-risk (≥6) items unmitigated

---

## Mitigation Plans

### R-201: AI adaptation logic is flawed (Score: 9)
**Mitigation Strategy:** The core adaptation logic will be unit tested with a wide range of simulated user data (e.g., users who always skip leg day, users who rate everything as 'easy'). An end-to-end test will simulate a user's journey over 3-4 weeks to validate plan evolution. Anomaly detection will be added to the backend to flag any generated plans that deviate significantly from expected norms.
**Owner:** DEV
**Timeline:** Sprint 2
**Status:** Planned

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
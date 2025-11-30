# Test Design: Epic 3 - User Control & Personalization

**Date:** 2025-11-30
**Author:** BIP
**Status:** Draft

---

## Executive Summary

**Scope:** Full test design for Epic 3.

**Risk Summary:**

- Total risks identified: 4
- High-priority risks (≥6): 2
- Critical categories: DATA (Data Integrity), SEC (Security)

**Coverage Summary:**

- P0 scenarios: 8 (16 hours)
- P1 scenarios: 10 (10 hours)
- P2/P3 scenarios: 6 (3 hours)
- **Total effort**: 29 hours (~3.6 days)

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-301 | DATA | Account deletion process fails or leaves residual user data. | 2 | 3 | 6 | Unit tests for data deletion logic. Integration tests to verify data removal from all relevant tables. Manual verification during UAT. | DEV | Sprint 3 |
| R-302 | SEC | Sensitive user profile data (e.g., goals, preferences) is exposed or modified by unauthorized users. | 2 | 3 | 6 | Thorough testing of RLS policies. API tests to ensure only authenticated and authorized users can access/modify their own profile. | DEV | Sprint 3 |

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R-303 | BUS | Plan interruption feature (pause/unwell) misbehaves, leading to incorrect plan generation. | 2 | 2 | 4 | Unit tests for pause/unwell logic. Integration tests with AI plan generation to verify correct adaptation during/after interruption. | QA |
| R-304 | SEC | Password change functionality has vulnerabilities (e.g., easily bypassable, no old password check). | 1 | 3 | 3 | Rely on Supabase Auth's robustness. E2E tests for the password change flow. | DEV |

### Low-Priority Risks (Score 1-2)

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
| User profile data is secure and private | API | R-302 | 3 | DEV | Test RLS with various user roles, test direct API access attempts. |
| Account deletion removes all user data | Integration | R-301 | 5 | DEV | Test full data deletion across all tables, including associated logs. |

**Total P0**: 8 tests, 16 hours

### P1 (High) - Run on PR to main

**Criteria**: Important features + Medium risk (3-4) + Common workflows

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| User can change password securely | E2E | R-304 | 2 | QA | Test password change flow, including edge cases like invalid current password. |
| User can manage plan interruptions | E2E | R-303 | 4 | QA | Test pausing plan for a duration, and indicating 'unwell' status. |
| User can update profile information | E2E | R-302 | 4 | QA | Test happy path for updating profile data, verify persistence. |

**Total P1**: 10 tests, 10 hours

### P2 (Medium) - Run nightly/weekly

**Criteria**: Secondary features + Low risk (1-2) + Edge cases

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| Application settings (dark mode, notifications) persist | Component | N/A | 6 | DEV | Test setting changes and persistence across sessions. |

**Total P2**: 6 tests, 3 hours

### P3 (Low) - Run on-demand

**Total P3**: 0 tests, 0 hours

---

## Execution Order

### Smoke Tests (<5 min)
- [ ] User can load the profile page
- [ ] User can load the settings page

### P0 Tests (<10 min)
- [ ] User can successfully delete their account
- [ ] User's profile data is not accessible by other users

### P1 Tests (<30 min)
- [ ] User can change their password
- [ ] User can pause their plan for a specified duration
- [ ] User can update their profile details

### P2/P3 Tests (<60 min)
- [ ] Dark mode setting toggles correctly and persists

---

## Resource Estimates

### Test Development Effort

| Priority | Count | Hours/Test | Total Hours | Notes |
| --- | --- | --- | --- | --- |
| P0 | 8 | 2.0 | 16 | Security and data integrity tests. |
| P1 | 10 | 1.0 | 10 | User interaction and feature tests. |
| P2 | 6 | 0.5 | 3 | Component-level UI tests. |
| P3 | 0 | 0.25 | 0 | None for this epic |
| **Total** | **24** | **-** | **29** | **~3.6 days** |

### Prerequisites

**Test Data:**
- User data for various scenarios (e.g., active user, user with existing plans, user with specific preferences).
- Pre-existing mock plans for interruption testing.

**Tooling:**
- `Pytest` for backend testing.
- `React Testing Library` and `Jest` for frontend component testing.
- `Playwright` for E2E tests.

**Environment:**
- Staging environment with a separate Supabase project.

---

## Quality Gate Criteria

### Pass/Fail Thresholds
- **P0 pass rate**: 100%
- **P1 pass rate**: ≥95%
- **High-risk mitigations**: 100% complete

### Coverage Targets
- **Critical paths**: ≥80%
- **Security scenarios**: 100%
- **Account management**: 100%

### Non-Negotiable Requirements
- [ ] All P0 tests pass
- [ ] No high-risk (≥6) items unmitigated
- [ ] Security tests (SEC category) pass 100%

---

## Mitigation Plans

### R-301: Account deletion fails or leaves residual data (Score: 6)
**Mitigation Strategy:** Implement database-level cascade deletes where appropriate. Develop a dedicated backend service for hard deletion, ensuring all related records (plans, logs, preferences) are removed. Automated integration tests will verify the complete removal of data.
**Owner:** DEV
**Timeline:** Sprint 3
**Status:** Planned

### R-302: Sensitive user profile data exposed (Score: 6)
**Mitigation Strategy:** Conduct a security review of all API endpoints handling user profile data. Implement strict input validation and output sanitization. RLS policies will be thoroughly tested to prevent unauthorized access or modification. E2E tests will include scenarios attempting to access another user's profile.
**Owner:** DEV
**Timeline:** Sprint 3
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
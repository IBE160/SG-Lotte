### Story 1.3: User Registration & Email Verification

As a new user,
I want to sign up with my email and password and verify my email,
So that I can create a secure account.

**Acceptance Criteria:**

**Given** I am on the signup page
**When** I enter valid email/password and submit
**Then** my account is created in Supabase
**And** a verification email is sent to my provided email address
**And** I cannot log in until my email is verified
**When** I click the verification link in my email
**Then** my account is marked as verified

**Prerequisites:** Story 1.1, Story 1.2

**Technical Notes:** Utilizes Supabase Auth for registration and email verification. Frontend UI based on `onboarding1_dark.html` (implied first step).

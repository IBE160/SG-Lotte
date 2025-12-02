### Story 3.3: Account Management

As an engaged user,
I want options to change my password or delete my account from the settings page,
So I have full control over my account.

**Acceptance Criteria:**

**Given** I am on the settings page
**When** I select "Change Password"
**Then** I am prompted to enter my old and new passwords
**And** my password is updated securely via Supabase Auth
**When** I select "Delete Account"
**Then** I am prompted for confirmation
**And** my account and associated data are securely deleted from the system

**Prerequisites:** Epic 1 completion.

**Technical Notes:** Frontend UI, API endpoints integrating with Supabase Auth for password change and account deletion.

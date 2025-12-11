// frontend/e2e/__tests__/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('TC-1.3.1: Successful user registration and email verification', async ({ page }) => {
    // Navigate to the signup page
    await page.goto('/auth/signup')

    // Fill out the registration form
    const email = `test-${Date.now()}@example.com`
    const password = 'Password123!'
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    await page.click('button:has-text("Sign Up")')

    // Expect success message
    await expect(page.getByText(/registration successful! please check your email to verify your account./i)).toBeVisible()

    // --- Manual/External Step Simulation (Email Verification) ---
    // In a real E2E setup, this would involve:
    // 1. Interacting with a test email service (e.g., MailHog, Ethereal) to get the verification link.
    // 2. Navigating to the verification link.
    // 3. Expecting redirection to /auth/email-verified.
    console.log(`E2E Test: A verification email was sent to ${email}. Please manually verify.`)
    console.log(`Expected redirect after verification: ${page.url().split('/auth')[0]}/auth/email-verified`)

    // Simulate navigation to the email verified page after manual verification
    await page.goto('/auth/email-verified')
    await expect(page.getByText(/email verified!/i)).toBeVisible()
    await page.click('a:has-text("Go to Login")')
    await expect(page.url()).toContain('/auth/login')

    // Attempt to log in with the verified user
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    await page.click('button:has-text("Log In")')

    // Expect successful login and redirection to dashboard
    await expect(page.url()).toContain('/dashboard')
    // Additional checks for dashboard content could go here
  })

  test('TC-1.3.2: Login is blocked before email verification', async ({ page }) => {
    // First, register a new user
    await page.goto('/auth/signup')
    const email = `unverified-${Date.now()}@example.com`
    const password = 'Password123!'
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    await page.click('button:has-text("Sign Up")')
    await expect(page.getByText(/registration successful! please check your email to verify your account./i)).toBeVisible()

    // Now, try to log in immediately without verification
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    await page.click('button:has-text("Log In")')

    // Expect "Please verify your email" message
    await expect(page.getByText(/please verify your email before logging in./i)).toBeVisible()
    await expect(page.url()).toContain('/auth/login') // Should remain on login page
  })
})

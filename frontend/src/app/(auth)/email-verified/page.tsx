// frontend/src/app/(auth)/email-verified/page.tsx
'use client'

import Link from 'next/link'

export default function EmailVerifiedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg text-center">
        <h1 className="mb-4 text-3xl font-bold text-green-500">Email Verified!</h1>
        <p className="mb-6 text-gray-300">Your email address has been successfully verified. You can now log in to your account.</p>
        <Link href="/auth/login" className="text-blue-400 hover:underline">
          Go to Login
        </Link>
      </div>
    </div>
  )
}

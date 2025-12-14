// frontend/src/app/auth/error/error-content.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ErrorContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'An authentication error occurred.'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg text-center">
        <h1 className="mb-4 text-3xl font-bold text-red-500">Authentication Error</h1>
        <p className="mb-6 text-gray-300">{message}</p>
        <Link href="/auth/login" className="text-blue-400 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  )
}

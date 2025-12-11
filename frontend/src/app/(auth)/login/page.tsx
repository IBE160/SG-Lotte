// frontend/src/app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'

// Define the validation schema using Zod
const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }), // Password can be short for login, but presence is required
})

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setMessage('')
    setIsError(false)

    const { email, password } = values

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setIsError(true)
        if (error.message.includes('Email not confirmed')) {
          setMessage('Please verify your email before logging in.')
        } else {
          setMessage(error.message)
        }
        console.error('Supabase login error:', error.message)
        return
      }

      // If no error, login was successful. Redirect to dashboard.
      router.push('/dashboard') // Assuming a dashboard page exists
    } catch (error: any) {
      setIsError(true)
      setMessage(error.message || 'An unexpected error occurred.')
      console.error('Unexpected error during login:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">Log In</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="w-full rounded-md border border-gray-700 bg-gray-700 p-3 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="you@example.com"
              disabled={loading}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password')}
              className="w-full rounded-md border border-gray-700 bg-gray-700 p-3 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="••••••••"
              disabled={loading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center text-sm ${isError ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

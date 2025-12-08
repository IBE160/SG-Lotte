"use client"

import { useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const testBackend = async () => {
    setMessage('')
    setError('')
    try {
      const response = await fetch('/api/test-backend')
      const data = await response.json()
      if (data.error) {
        setError(data.error)
      } else {
        setMessage(data.message)
      }
    } catch (err) {
      setError('Failed to connect to the API')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Frontend Test Page</h1>
      </div>
      <div className="mt-10">
        <button
          onClick={testBackend}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Test Backend Connection
        </button>
      </div>
      {message && (
        <div className="mt-4 rounded-md bg-green-100 p-4 text-green-800">
          <p>Success from backend:</p>
          <pre>{message}</pre>
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-md bg-red-100 p-4 text-red-800">
          <p>Error:</p>
          <pre>{error}</pre>
        </div>
      )}
    </main>
  )
}

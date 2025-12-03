'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const error = searchParams.get('error_description');
    const type = searchParams.get('type');
    const token_hash = searchParams.get('token_hash'); // Can be used to manually verify if needed

    if (error) {
      setMessage(`Verification failed: ${error}. Please try again or contact support.`);
      setIsSuccess(false);
    } else if (type === 'signup' && token_hash) {
      // In a real app, you might use the token_hash with a backend endpoint
      // or directly with the Supabase client to confirm, though Supabase usually handles this via the redirect.
      setMessage('Your email has been successfully verified! You can now log in.');
      setIsSuccess(true);
    } else {
      setMessage('Verifying your email...');
      setIsSuccess(true); // Assume success until proven otherwise or waiting for further client-side logic
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-white">Email Verification</h2>
        <div
          className={`p-3 rounded-md text-sm ${
            isSuccess ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {message}
        </div>
        {isSuccess && (
          <Link href="/login" className="text-blue-400 hover:underline">
            Go to Login
          </Link>
        )}
        {!isSuccess && (
          <Link href="/signup" className="text-blue-400 hover:underline">
            Go back to Signup
          </Link>
        )}
      </div>
    </div>
  );
}

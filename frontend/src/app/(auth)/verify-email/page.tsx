"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../../../../lib/supabaseClient';

export default function VerifyEmailPage() {
  const [message, setMessage] = useState<string>('Verifying your email...');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleVerification = async () => {
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');

      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as 'signup', // Assuming it's always a signup verification
        });

        if (!error) {
          setMessage('Email verified successfully! Redirecting to login...');
          setTimeout(() => {
            router.push('/(auth)/login');
          }, 3000); // Redirect after 3 seconds
        } else {
          setError(`Verification failed: ${error.message}`);
          setMessage('Email verification failed. Please try again or contact support.');
          // Optionally redirect to a page where they can request a new link
        }
      } else {
        setError('Invalid verification link.');
        setMessage('Invalid verification link. Please check your email again or sign up.');
      }
    };

    handleVerification();
  }, [router, searchParams, supabase]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4 bg-background-light dark:bg-background-dark text-gray-900 dark:text-white">
      <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl filter animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#2D3748]/20 rounded-full blur-3xl filter animate-pulse" style={{ animationDuration: '10s' }}></div>
      <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="my-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-lg">
          <span className="material-symbols-outlined !text-4xl">verified_user</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Email Verification</h1>
        
        {error ? (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div className="bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-300 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Status: </strong>
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        {!error && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                You will be redirected shortly. If not, please {' '}
                <a href="/(auth)/login" className="font-medium text-primary hover:underline">click here to log in</a>.
            </p>
        )}
        {error && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Please {' '}
                <a href="/(auth)/signup" className="font-medium text-primary hover:underline">sign up again</a> or contact support.
            </p>
        )}
      </div>
    </div>
  );
}

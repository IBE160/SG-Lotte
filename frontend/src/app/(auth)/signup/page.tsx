"use client";

import { supabase } from '../../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const Supabase = supabase;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${location.origin}/(auth)/verify-email`,
        },
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        setMessage('Registration successful! Please check your email for a verification link.');
        // Optionally redirect to a verification pending page
        // router.push('/(auth)/check-email');
      } else {
          // This case might happen if email verification is off and user is automatically signed in
          // Or if no user data is returned but no error (shouldn't happen with email verification on)
          setMessage('An unexpected event occurred. Please check your email.');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4 bg-background-light dark:bg-background-dark text-gray-900 dark:text-white">
      <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl filter animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#2D3748]/20 rounded-full blur-3xl filter animate-pulse" style={{ animationDuration: '10s' }}></div>
      <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="my-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-lg">
          <span className="material-symbols-outlined !text-4xl">fitness_center</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Sign Up for AI Fitness Coach</h1>
        
        <form onSubmit={handleSignUp} className="w-full space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {message && (
            <div className="bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-300 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Success! </strong>
              <span className="block sm:inline">{message}</span>
            </div>
          )}

          <button
            type="submit"
            className="flex min-w-[84px] max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 w-full bg-primary text-white text-lg font-bold tracking-wide transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="truncate">Sign Up</span>
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          Already have an account? {' '}
          <a href="/(auth)/login" className="font-medium text-primary hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}

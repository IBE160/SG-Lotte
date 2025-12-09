"use client";

import { supabase } from '../../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const Supabase = supabase;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Supabase returns 'Email not confirmed' for unverified emails
        if (error.message.includes('Email not confirmed')) {
            setError('Please verify your email before logging in.');
        } else {
            setError(error.message);
        }
      } else if (data.user) {
        // Redirect to dashboard or a protected route
        router.push('/dashboard'); // Assuming a dashboard route exists
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
          <span className="material-symbols-outlined !text-4xl">login</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Login to AI Fitness Coach</h1>
        
        <form onSubmit={handleLogin} className="w-full space-y-4">
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            className="flex min-w-[84px] max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 w-full bg-primary text-white text-lg font-bold tracking-wide transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="truncate">Login</span>
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          Don't have an account? {' '}
          <a href="/(auth)/signup" className="font-medium text-primary hover:underline">Sign up</a>
        </p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <a href="/(auth)/forgot-password" className="font-medium text-primary hover:underline">Forgot password?</a>
        </p>
      </div>
    </div>
  );
}

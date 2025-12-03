'use client';

import React, { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';

const LoginForm = () => {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      // Redirect to a protected page on successful login
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4 bg-background-light dark:bg-background-dark">
      <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl filter animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#2D3748]/20 rounded-full blur-3xl filter animate-pulse" style={{ animationDuration: '10s' }}></div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="my-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-lg">
          <span className="material-symbols-outlined !text-4xl" data-icon="lock">
            lock
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 px-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Log In</h1>
          <p className="max-w-xl text-md leading-6 text-gray-600 dark:text-gray-300">
            Welcome back! Please enter your credentials.
          </p>
        </div>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <div className="relative">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 w-full bg-primary text-white text-lg font-bold tracking-wide transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="truncate">{loading ? 'Logging In...' : 'Log In'}</span>
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 dark:text-gray-300">
          Don't have an account?{' '}
          <a href="/signup" className="text-primary hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

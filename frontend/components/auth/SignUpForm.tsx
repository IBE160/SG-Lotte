'use client';

import React, { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';

const SignUpForm = () => {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Please check your email to verify your account.');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4 bg-background-light dark:bg-background-dark">
      {/* Background decorative shapes - from onboarding1_dark.html */}
      <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl filter animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#2D3748]/20 rounded-full blur-3xl filter animate-pulse" style={{ animationDuration: '10s' }}></div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {/* Logo/Icon - from onboarding1_dark.html */}
        <div className="my-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-lg">
          <span className="material-symbols-outlined !text-4xl" data-icon="fitness_center">
            fitness_center
          </span>
        </div>

        {/* Headline and Body Text Section */}
        <div className="flex flex-col items-center gap-2 px-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Create Your Account</h1>
          <p className="max-w-xl text-md leading-6 text-gray-600 dark:text-gray-300">
            Sign up to start your personalized fitness and meal journey.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {error && <p data-testid="error-message" className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
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
          <div className="relative">
            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 w-full bg-primary text-white text-lg font-bold tracking-wide transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="truncate">{loading ? 'Signing Up...' : 'Sign Up'}</span>
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <a href="/login" className="text-primary hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;

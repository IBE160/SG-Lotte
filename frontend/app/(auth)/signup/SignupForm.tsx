'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase'; // Import the actual supabase client

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setMessageType('');
    setLoading(true); // Set loading true on submit

    // Basic client-side validation
    if (!email || !password) {
      setMessage('Email and password are required.');
      setMessageType('error');
      setLoading(false); // Reset loading
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      setMessageType('error');
      setLoading(false); // Reset loading
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`, // Set redirect URL for email verification
        },
      });

      if (error) {
        setMessage(error.message);
        setMessageType('error');
      } else if (data.user) {
        setMessage('Signup successful! Please check your email for verification.');
        setMessageType('success');
        setEmail(''); // Clear fields on success
        setPassword('');
      } else {
        // This case might happen if email is already registered but not confirmed
        setMessage('An unexpected signup response. Please set message here if this case happens.');
        setMessageType('error');
      }
    } catch (error: any) {
      setMessage(error.message || 'An unexpected error occurred.');
      setMessageType('error');
    } finally {
      setLoading(false); // Always reset loading
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required // Re-added required
          className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
          placeholder="you@example.com"
          disabled={loading} // Disable inputs during loading
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required // Re-added required
          className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
          placeholder="********"
          disabled={loading} // Disable inputs during loading
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled={loading} // Disable button during loading
      >
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>

      {/* Message div always rendered, text content controls visibility */}
      <div
        data-testid="signup-message"
        className={`p-3 rounded-md text-sm ${
          messageType === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        } ${message ? '' : 'invisible'}`}
      >
        {message}
      </div>
    </form>
  );
}
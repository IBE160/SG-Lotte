// frontend/app/(auth)/onboarding/layout.tsx
'use client'; // Required for client-side components in Next.js App Router

import React from 'react';
import { ToastProvider } from '@/components/ui/Toast'; // Import ToastProvider

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider> {/* Wrap children with ToastProvider */}
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-8">Onboarding</h1>
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}

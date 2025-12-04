// frontend/app/(dashboard)/layout.tsx
'use client';

import React from 'react';
import { ToastProvider } from '@/components/ui/Toast'; // Assuming ToastProvider is needed here too

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider> {/* Wrap children with ToastProvider */}
      <div>
        {/* Potentially add a dashboard specific header/sidebar here */}
        <main>{children}</main>
      </div>
    </ToastProvider>
  );
}

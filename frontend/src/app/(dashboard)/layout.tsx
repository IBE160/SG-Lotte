// frontend/src/app/(dashboard)/layout.tsx
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-md">
        <h1 className="text-2xl font-bold">AI Fitness Dashboard</h1>
      </header>
      <main className="p-4">
        {children}
      </main>
    </div>
  );
}

// frontend/src/app/auth/error/page.tsx
import { Suspense } from 'react';
import ErrorContent from './error-content'; // Import the new client component

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<p>Loading error details...</p>}>
      <ErrorContent />
    </Suspense>
  )
}

// frontend/src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `cookies()` function can only be called from a Server Component or Route Handler.
            // If you're calling this from a Client Component, it's likely because you're using
            // Supabase client-side with `auth.onAuthStateChange` or something similar.
            // In that case, you can ignore this error.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `cookies()` function can only be called from a Server Component or Route Handler.
            // If you're calling this from a Client Component, it's likely because you're using
            // Supabase client-side with `auth.onAuthStateChange` or something similar.
            // In that case, you can ignore this error.
          }
        },
      },
    }
  )
}

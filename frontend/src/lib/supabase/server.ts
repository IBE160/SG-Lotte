// frontend/src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) { // Make get async
          const cookieStore = await cookies() // Await cookies() here
          return cookieStore.get(name)?.value
        },
        async set(name: string, value: string, options: any) { // Make set async
          try {
            const cookieStore = await cookies() // Await cookies() here
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `cookies()` function can only be called from a Server Component or Route Handler.
            // If you're calling this from a Client Component, it's likely because you're using
            // Supabase client-side with `auth.onAuthStateChange` or something similar.
            // In that case, you can ignore this error.
          }
        },
        async remove(name: string, options: any) { // Make remove async
          try {
            const cookieStore = await cookies() // Await cookies() here
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

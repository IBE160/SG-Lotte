// frontend/src/app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Redirect to a success page after successful verification
      return NextResponse.redirect(`${requestUrl.origin}/auth/email-verified`)
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(`${requestUrl.origin}/auth/error?message=Verification failed.`)
}

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const error = url.searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL('/auth/error', req.url))
  }

  return NextResponse.redirect(new URL('/email-verified', req.url))
}

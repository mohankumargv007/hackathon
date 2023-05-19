import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const res = NextResponse.next()
  const supabase = createMiddlewareSupabaseClient({ req, res })
  const {data : {session}, error} = await supabase.auth.getSession()
  let url = '';
  if (!session) {
    url = new URL('/login', req.url)
    return NextResponse.redirect(url);
  }
  const { data: profile } = await supabase
    .from('profile')
    .select('id, first_name, last_name, store_id')
    .single()
  if (!profile?.store_id && pathname !== '/profile') {
    url = new URL('/profile', req.url)
    return NextResponse.redirect(url);
  }
  return res;
}

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|favicon.ico|smt_bg.jpg|login).*)',
    ],
  }
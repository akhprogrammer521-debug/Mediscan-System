'use server'

import { cookies } from 'next/headers'

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: false, // Allow client-side access for API client
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}


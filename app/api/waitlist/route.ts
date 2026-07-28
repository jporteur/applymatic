import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const { error } = await supabase
    .from('waitlist')
    .insert([{ email, created_at: new Date().toISOString() }])

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ message: 'already_registered' }, { status: 200 })
    }
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }

  return NextResponse.json({ message: 'success' }, { status: 200 })
}

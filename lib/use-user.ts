'use client'

import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

async function fetchUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { user: null, profile: null }
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()
  return { user, profile: profile as Profile | null }
}

export function useUser() {
  const { data, isLoading, mutate } = useSWR('auth-user', fetchUser, {
    revalidateOnFocus: false,
  })
  return {
    user: data?.user ?? null,
    profile: data?.profile ?? null,
    isLoading,
    mutate,
  }
}

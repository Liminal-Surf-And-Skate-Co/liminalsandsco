import { createClient } from '@/lib/supabase/server'
import type { Product, Profile } from '@/lib/types'

export async function getProducts(filters?: {
  category?: string
  subcategory?: string
  search?: string
}): Promise<Product[]> {
  const supabase = await createClient()
  let query = supabase.from('products').select('*')
  if (filters?.category) query = query.eq('category', filters.category)
  if (filters?.subcategory) query = query.eq('subcategory', filters.subcategory)
  if (filters?.search) query = query.ilike('title', `%${filters.search}%`)
  const { data } = await query.order('created_at', { ascending: false })
  return (data as Product[]) ?? []
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle()
  return (data as Product) ?? null
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .neq('id', product.id)
    .limit(4)
  return (data as Product[]) ?? []
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_new', true)
    .limit(8)
  return (data as Product[]) ?? []
}

export async function getSiteSetting<T = unknown>(key: string): Promise<T | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('value').eq('key', key).maybeSingle()
  return (data?.value as T) ?? null
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  return (data as Profile) ?? null
}

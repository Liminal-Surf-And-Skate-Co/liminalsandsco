export type Product = {
  id: string
  slug: string
  title: string
  description: string | null
  category: string
  subcategory: string | null
  collection: string | null
  brand: string | null
  gender: string | null
  price_aud: number
  compare_at_aud: number | null
  stock: number
  is_preorder: boolean
  is_new: boolean
  rating: number
  review_count: number
  colors: string[]
  sizes: string[]
  images: string[]
  deck_width: string | null
  deck_length: string | null
  deck_nose: string | null
  deck_shape: string | null
  deck_type: string | null
  deck_wheelbase: string | null
  created_at: string
}

export type Review = {
  id: string
  product_id: string
  user_id: string
  rating: number
  body: string | null
  fit_note: string | null
  images: string[]
  status: 'pending' | 'approved' | 'hidden'
  created_at: string
  profiles?: { display_name: string | null; avatar_url: string | null } | null
}

export type Profile = {
  id: string
  display_name: string | null
  avatar_url: string | null
  role: 'user' | 'admin' | 'superadmin'
  status: 'active' | 'suspended' | 'banned'
  points: number
  provider: string | null
  created_at: string
}

export type Order = {
  id: string
  user_id: string
  status: 'placed' | 'shipped' | 'delivered' | 'returned' | 'cancelled'
  total_aud: number
  items: { title: string; qty: number; price: number; slug?: string }[]
  carrier: string | null
  tracking_url: string | null
  points_redeemed: number
  created_at: string
}

export type MapPin = {
  id: string
  user_id: string
  title: string
  notes: string | null
  tips: string | null
  photo_url: string | null
  lat: number
  lng: number
  type: 'surf' | 'skate'
  status: 'pending' | 'approved' | 'hidden'
  created_at: string
}

export type EventItem = {
  id: string
  title: string
  description: string | null
  starts_at: string
  location: string | null
  image_url: string | null
  category: string | null
}

export type Video = {
  id: string
  user_id: string
  title: string
  category: string | null
  url: string
  upvotes: number
  status: 'pending' | 'approved' | 'hidden'
  created_at: string
}

export type CartItem = {
  id: string
  slug: string
  title: string
  price: number
  image: string | null
  size: string | null
  color: string | null
  qty: number
  preorder: boolean
}

export const CATEGORY_TREE: {
  key: string
  label: string
  groups: { label: string; items: { label: string; sub: string }[] }[]
}[] = [
  {
    key: 'skate',
    label: 'Skate',
    groups: [
      {
        label: 'Boards',
        items: [
          { label: 'Decks', sub: 'decks' },
          { label: 'Completes', sub: 'completes' },
          { label: 'Cruisers', sub: 'decks' },
        ],
      },
      {
        label: 'Components',
        items: [
          { label: 'Wheels', sub: 'wheels' },
          { label: 'Grip Tape', sub: 'grip' },
        ],
      },
    ],
  },
  {
    key: 'surf',
    label: 'Surf',
    groups: [
      {
        label: 'Hardware',
        items: [
          { label: 'Surfboards', sub: 'surfboards' },
          { label: 'Leashes', sub: 'accessories' },
        ],
      },
      {
        label: 'Wetsuits',
        items: [{ label: 'Steamers', sub: 'wetsuits' }],
      },
    ],
  },
  {
    key: 'clothing',
    label: 'Clothing',
    groups: [
      {
        label: 'Tops',
        items: [
          { label: 'Hoodies', sub: 'hoodies' },
          { label: 'Tees', sub: 'tees' },
        ],
      },
      {
        label: 'Beach',
        items: [
          { label: 'Boardshorts', sub: 'boardshorts' },
          { label: 'Swim', sub: 'swim' },
        ],
      },
    ],
  },
  {
    key: 'accessories',
    label: 'Accessories',
    groups: [
      {
        label: 'Everyday',
        items: [
          { label: 'Headwear', sub: 'headwear' },
          { label: 'Socks', sub: 'socks' },
        ],
      },
    ],
  },
]

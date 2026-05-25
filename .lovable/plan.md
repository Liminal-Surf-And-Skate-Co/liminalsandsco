# Implementation Plan

## 1. Nav bar
- Rename "Journal" → "Blog" in `src/components/site/Nav.tsx`.
- "Community" already routes to `/#craft` — change to dedicated `/community` page (new route).
- Add a small **Account** icon (right side, next to "Order Custom") linking to `/account` (login/signup placeholder page).
- Add a **Cart** icon with item-count badge (next to Account).
- Add a **Wishlist** (heart) icon next to Cart.

## 2. Shop page (`src/routes/shop.tsx`)
**Categories** — split & add:
- Surfboards (own category)
- Skateboards (own category)
- Merchandise (hoodies, tees, hats, pants)
- Footwear (skate shoes, slides, sandals) — NEW
- Accessories (sunglasses, beanies, backpacks, wet bags, beach towels) — NEW
- Jewellery
- Hand Crafted

Update `src/lib/products.ts` with new category enum + seed products for Footwear and Accessories; reclassify existing surf/skate items.

**Features**
- Search bar already exists in sidebar — also surface a prominent search at top of shop hero.
- Wishlist: heart icon on each product card; click toggles. Persist in `localStorage` via small `useWishlist` hook (`src/hooks/use-wishlist.ts`). Heart icon in nav shows count and links to `/wishlist` page (new route showing saved items).
- Cart: "Add to cart" button on product cards + product detail page. `useCart` hook (`src/hooks/use-cart.ts`) with localStorage. Nav cart icon shows badge with item count. New `/cart` route with line items + "Proceed to inquiry" CTA (no real checkout).

## 3. Product detail page (`src/routes/shop.$slug.tsx`)
- Add Wishlist + Add-to-cart buttons.
- Wire inquiry/custom order form to a **server function** that:
  - Validates with Zod (name, email, message, selected product slug).
  - Calls Lovable Emails (`send-transactional-email`) to notify shop owner + send confirmation to customer.
- Requires enabling **Lovable Cloud** + email domain setup + scaffolding transactional email infra. Two templates: `inquiry-notification` (to owner) and `inquiry-confirmation` (to customer).

## 4. Blog page (`src/routes/blog.tsx`)
- Add **search bar** filtering posts by title/tag.
- Add **Media section** ("Daily Swell" / Log / Videos) below post list — grid of video/photo cards (placeholder content for now).

## 5. Community page (NEW `src/routes/community.tsx`)
Standalone page with sections:
- Hero
- Local Spot Checks & Reports (wave/weather/skatepark cards — placeholder)
- Events Calendar (upcoming events list)
- Discord link CTA (prominent button — need Discord invite URL from you)
- Ride Share / Skate Buddy Finder (bulletin board — static placeholder cards)
- Discussion forum link (Discord)

Keep the existing `Craft` section on the home page unchanged.

## 6. About page (`src/routes/about.tsx`)
Keep home-page About section identical. Expand the standalone About page with new sections appended after current content:
- Origin Story ("Your Why")
- The Core Crew (founder/staff bios — placeholder photos)
- The Team (sponsored skaters/surfers — rider profile cards)
- Brand Values & Beliefs (sustainability, inclusivity)
- Gritty photography layout, casual tone

## 7. Account / Login (NEW `src/routes/account.tsx`)
- Simple login/signup form (email + password) using Lovable Cloud auth.
- Requires enabling Lovable Cloud.
- Profile page shell for order tracking & loyalty rewards (placeholder — no orders backend yet).

## 8. Backend / infrastructure needed
- **Enable Lovable Cloud** (auth + email).
- **Set up email domain** (you'll need to add DNS records).
- **Scaffold transactional email** (for inquiry form).
- Create `inquiries` table (id, product_slug, name, email, message, type, created_at) with RLS (insert allowed for anon, select admin-only).

---

## Questions before I build

1. **Discord invite URL** — what's the link?
2. **Notification email** — what email address should receive product inquiries?
3. **Wishlist & Cart persistence** — localStorage only (guest), or tied to logged-in account? (localStorage is simpler; account-tied requires Cloud + a table.)
4. **Account/login** — do you want it functional now (real signup via Lovable Cloud) or a placeholder page for later?
5. **Media on blog** — placeholder cards for now, or do you have real video links/thumbnails to use?
6. **Crew/Team on About** — placeholder names/photos for now, or do you have real bios + images?

Once you answer these (especially 1–4, since they gate backend setup), I'll implement.
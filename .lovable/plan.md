# Build Plan — Liminal Surf & Skate Co

This is a large scope. To keep it shippable I'm splitting it into 5 phases. Each phase is independently usable. I'll need to enable **Lovable Cloud** (database, auth, file storage, email, server functions) at the start of Phase 1.

---

## Phase 1 — Foundation (Cloud + Admin + Site Settings)

**Enable Lovable Cloud** — required for everything below.

- **Admin role system**: `user_roles` table + `has_role()` security definer function. First account you create gets promoted to admin manually (I'll tell you the one SQL snippet to run, or do it for you once you sign up).
- **Login / signup** at `/account` (real auth, email+password).
- **`/admin` dashboard** (admin-only, guarded route) with sections for: Site Settings, Products, Events, Reviews, Crew, Newsletters, Video Submissions.
- **Site Settings table** (key/value): Discord invite URL, Instagram, YouTube, TikTok, Facebook, contact emails. Nav, footer, community page all read from this — no more hard-coded links.
- **Footer**: add Instagram / YouTube / TikTok logo icons next to social links, pulled from settings.

---

## Phase 2 — Shop Overhaul (Mega-Nav + Filters + Product Detail)

- **Mega-menu nav** with Skate / Clothing / Accessories / Surf / Other dropdowns (mobile = hamburger with accordions). Each sub-link routes to `/shop?dept=skate&type=decks` etc.
- **Products schema** in DB (replaces `src/lib/products.ts`): dept, type, target_group (mens/womens/boys/girls), colour, size, technical fields (deck width/length/shape/wheelbase, wetsuit thickness, fin setup), tags (`new`, `sale`, `low_stock`), images[], stock_count, price, sale_price.
- **Admin Products CRUD**: add/edit/delete products + image upload to storage.
- **Shop sidebar**: dept, type, target group, colour, size, technical filters that appear only when relevant (e.g. Deck Width only when type=decks). Active filter chips with × + "Clear all". All URL-synced.
- **Corner badges** on product cards: New / Sale (%) / Low Stock — auto-computed.
- **Product detail page**:
  - Left: image gallery (main + thumbnails).
  - Right: title, price, size/thickness dropdown, qty selector, Add to Cart, Wishlist.
  - Star rating summary.
  - "You might also need" related-products row (rule-based: deck → trucks/wheels/bearings/grip; surfboard → fins/leash/wax/traction).
  - Photo reviews section (logged-in users upload pic + text + rating; admin moderates).
  - Inquiry button → opens the custom order form.

---

## Phase 3 — Community (Map + Spot Pins + Events + Video Submissions)

- **Real Australia map** using Google Maps Platform connector (I'll connect it; uses Lovable-managed key on `*.lovable.app`). Centred on Australia, zoomable.
- **Geolocation**: ask permission, centre on user's location, show "spots near me".
- **Spot pins** (users can create when logged in): lat/lng, name, type (surf/skate), notes, tide tips, photos. Stored in DB + storage. Click pin = popup with details.
- **Local Spot Checks**: list of nearest 5 surf + 5 skate spots from user's geolocation (Haversine sort on the spots table).
- **Events Calendar**: month grid + list view toggle. Event cards (thumbnail, title, date/time, location, description). RSVP button (logged-in) + "Add to Google Calendar" link (generated calendar URL). Admin CRUD in `/admin/events`. Home page "Events" button links to `/community#events`.
- **Video submissions**: logged-in users submit video URL (YouTube/Vimeo) + title + category (skate/surf). Community votes (one vote per user). Admin can feature/remove. "Clip of the Month" = top voted in current month.

---

## Phase 4 — Reviews + Search + Newsletter Archive + Crew

- **Customer reviews carousel** above footer on home: 3–4 cards, name, 5-star, quote, "Verified Buyer — [product]" tag. "Leave a review" modal (logged-in). Admin moderation (approve/hide/feature).
- **Global search** in header: searches products + blog posts + events. Predictive dropdown (debounced, max 5 results per category). Press enter → `/search?q=...` results page grouped by category.
- **Newsletter archive**: new "News & Weekly Letters" tab on `/blog`. `newsletters` table (title, date, body, sent_at). Auto-dated grid. Subscriber list + Friday newsletter send from `/admin/newsletters` (composes + sends via Lovable Emails to all subscribers).
- **Crew page rebuild** on `/about`: rename "Who's at the bench" → **"The Crew"**. Responsive 3–4 col grid, each card = photo, name, role, 1–2 sentence bio, Instagram icon link. Admin CRUD in `/admin/crew`.

---

## Phase 5 — Custom Orders → Email + Discord

- **Custom order form** posts to a server function which:
  1. Stores the inquiry in DB.
  2. Sends transactional email with subject **"New Custom Product Inquiry"** to both `liminalsurfandskateco60467@gmail.com` and `contact@liminalsandsco.com` (requires verifying a sender domain — I'll walk you through that one-time DNS step).
  3. POSTs to a Discord webhook URL (admin pastes it into Site Settings) so inquiries drop into your `#custom-orders` channel.
- Inquiry form on product detail page deep-links here with the product pre-filled.

---

## What I need from you before I start

1. **Discord invite URL** (public server invite link).
2. **Discord webhook URL** for `#custom-orders` (Server Settings → Integrations → Webhooks → New Webhook → Copy URL). Can be added later in admin if you don't have it yet.
3. **Instagram / YouTube / TikTok handle URLs** (for the footer).
4. **Phase 1 sign-off**: confirm I should enable Lovable Cloud and start with Phase 1 (admin + settings + footer socials). Phases 2–5 follow once Phase 1 is live.
5. **Custom domain verification later** — sending emails to your two Gmail/contact addresses requires verifying a sender domain (e.g. `notify.liminalsandsco.com`). OK to defer to Phase 5?

Once you answer those (even just "go" + the social URLs) I'll start building Phase 1.

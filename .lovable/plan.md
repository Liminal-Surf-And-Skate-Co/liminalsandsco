# Phase 1 — Finish Foundation

Wrap up the foundation layer before moving into the shop overhaul (Phase 2).

## What's already done

- Lovable Cloud enabled, `user_roles` + `site_settings` tables with RLS
- `has_role()` security-definer function
- `/account` email+password auth, `useAuth` hook
- `/admin` site settings editor
- `attachSupabaseAuth` wired in `src/start.ts`

## What this phase adds

### 1. Seed default site settings

Insert default rows so the footer/nav have values to render before an admin edits them:

- `discord_url`, `instagram_url`, `youtube_url`, `tiktok_url`
- `contact_email_primary` = `liminalsurfandskateco60467@gmail.com`
- `contact_email_secondary` = `contact@liminalsandsco.com`

### 2. Footer reads from site_settings

- Replace hardcoded social/contact links in `src/components/site/Footer.tsx` with values from `getSiteSettings()`
- Hide an icon if its setting is empty
- Cached via TanStack Query so it loads once per session

### 3. Community Discord CTA reads from site_settings

- `CommunityTeaser.tsx` and `/community` Discord buttons pull `discord_url` from settings (fallback: hide the button if unset)

### 4. Root auth listener + cache invalidation

In `src/routes/__root.tsx`, subscribe once to `supabase.auth.onAuthStateChange` and call `router.invalidate()` + `queryClient.invalidateQueries()` so admin status and user-scoped data refresh immediately on sign-in/out.

### 5. Gate `/admin` route

- Redirect non-admins to `/account` (currently the page is reachable by anyone, even if writes fail via RLS)
- Use `useAuth()` `isAdmin` flag; show a loading state while it resolves

### 6. Admin UX polish

- Add a "Make me admin" helper that runs only when zero admins exist in `user_roles` (safe bootstrap), so the user doesn't need to paste SQL
- After the first admin exists, the helper disappears

## Technical notes

- Settings fetch: small helper `useSiteSettings()` hook wrapping `getSiteSettings()` in `useQuery` with `staleTime: 5min`
- Bootstrap admin: server function `claimFirstAdmin` using `supabaseAdmin`, checks `count(*) from user_roles where role='admin'` is 0, then inserts current user as admin. Uses `requireSupabaseAuth` to identify the caller.
- No schema changes needed — `site_settings` and `user_roles` already exist

## Files to touch

- `src/components/site/Footer.tsx` — read settings
- `src/components/site/CommunityTeaser.tsx` — read `discord_url`
- `src/routes/community.tsx` — read `discord_url`
- `src/routes/__root.tsx` — auth listener
- `src/routes/admin.tsx` — admin gate + bootstrap button
- `src/hooks/use-site-settings.ts` — new
- `src/lib/admin.functions.ts` — new (`claimFirstAdmin`)
- Migration: seed default rows into `site_settings`

## After this

Phase 2 (shop overhaul: mega-menu nav, products schema, sidebar filters, product detail page) is ready to start.

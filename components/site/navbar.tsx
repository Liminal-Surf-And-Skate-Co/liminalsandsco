'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  Waves,
  LogOut,
  LayoutDashboard,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CATEGORY_TREE } from '@/lib/types'
import { useCart } from '@/components/cart/cart-provider'
import { useUser } from '@/lib/use-user'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export function Navbar() {
  const router = useRouter()
  const { count, setOpen } = useCart()
  const { user, profile, mutate } = useUser()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAdmin = profile?.role === 'admin' || profile?.role === 'superadmin'

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/shop?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    mutate()
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:px-8">
        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-heading uppercase">Shop</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 px-4 pb-8">
              {CATEGORY_TREE.map((cat) => (
                <div key={cat.key}>
                  <Link
                    href={`/shop?category=${cat.key}`}
                    onClick={() => setMobileOpen(false)}
                    className="font-heading text-lg uppercase tracking-tight"
                  >
                    {cat.label}
                  </Link>
                  <div className="mt-2 flex flex-col gap-1 pl-3">
                    {cat.groups.flatMap((g) =>
                      g.items.map((it) => (
                        <Link
                          key={`${cat.key}-${it.label}`}
                          href={`/shop?category=${cat.key}&sub=${it.sub}`}
                          onClick={() => setMobileOpen(false)}
                          className="text-sm text-muted-foreground"
                        >
                          {it.label}
                        </Link>
                      )),
                    )}
                  </div>
                </div>
              ))}
              <Link href="/community" onClick={() => setMobileOpen(false)} className="font-heading text-lg uppercase">
                Community
              </Link>
              <Link href="/crew" onClick={() => setMobileOpen(false)} className="font-heading text-lg uppercase">
                The Crew
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Waves className="size-6 text-primary" />
          <span className="font-heading text-xl font-black uppercase leading-none tracking-tight">
            Liminal
          </span>
        </Link>

        {/* Desktop nav with mega menu */}
        <nav
          className="ml-4 hidden items-center gap-1 lg:flex"
          onMouseLeave={() => setActiveMenu(null)}
        >
          {CATEGORY_TREE.map((cat) => (
            <div key={cat.key} onMouseEnter={() => setActiveMenu(cat.key)}>
              <Link
                href={`/shop?category=${cat.key}`}
                className={cn(
                  'px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors hover:text-primary',
                  activeMenu === cat.key && 'text-primary',
                )}
              >
                {cat.label}
              </Link>
            </div>
          ))}
          <Link
            href="/community"
            className="px-3 py-2 text-sm font-semibold uppercase tracking-wide hover:text-primary"
          >
            Community
          </Link>
          <Link
            href="/crew"
            className="px-3 py-2 text-sm font-semibold uppercase tracking-wide hover:text-primary"
          >
            The Crew
          </Link>

          {/* Mega menu panel */}
          {activeMenu && (
            <div className="absolute inset-x-0 top-16 border-b border-border bg-background shadow-lg">
              <div className="mx-auto grid max-w-7xl grid-cols-4 gap-8 px-8 py-8">
                {CATEGORY_TREE.find((c) => c.key === activeMenu)?.groups.map((group) => (
                  <div key={group.label}>
                    <p className="mb-3 font-heading text-xs uppercase tracking-widest text-muted-foreground">
                      {group.label}
                    </p>
                    <ul className="flex flex-col gap-2">
                      {group.items.map((it) => (
                        <li key={it.label}>
                          <Link
                            href={`/shop?category=${activeMenu}&sub=${it.sub}`}
                            className="text-sm hover:text-primary"
                            onClick={() => setActiveMenu(null)}
                          >
                            {it.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="col-span-1 rounded-lg bg-secondary p-5">
                  <p className="font-heading text-sm uppercase">New Drop</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Fresh boards and threads, just landed.
                  </p>
                  <Link
                    href={`/shop?category=${activeMenu}`}
                    className="mt-3 inline-block text-sm font-semibold text-primary underline"
                    onClick={() => setActiveMenu(null)}
                  >
                    Shop all {activeMenu}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Search */}
        <form onSubmit={submitSearch} className="ml-auto hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gear…"
              className="w-44 pl-8 lg:w-56"
            />
          </div>
        </form>

        {/* Account */}
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Button asChild variant="ghost" size="icon" className="md:hidden" aria-label="Search">
            <Link href="/shop">
              <Search className="size-5" />
            </Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate">
                  {profile?.display_name || user.email}
                </DropdownMenuLabel>
                <DropdownMenuItem disabled className="text-xs">
                  {profile?.points ?? 0} pts
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 size-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Shield className="mr-2 size-4" /> Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="icon" aria-label="Sign in">
              <Link href="/auth/login">
                <User className="size-5" />
              </Link>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}

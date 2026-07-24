import Link from 'next/link'
import { Waves } from 'lucide-react'
import { NewsletterForm } from './newsletter-form'

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'Skate', href: '/shop?category=skate' },
      { label: 'Surf', href: '/shop?category=surf' },
      { label: 'Clothing', href: '/shop?category=clothing' },
      { label: 'Accessories', href: '/shop?category=accessories' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'The Map', href: '/community' },
      { label: 'Events', href: '/community#events' },
      { label: 'Clip of the Week', href: '/community#videos' },
      { label: 'The Crew', href: '/crew' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Shipping & Returns', href: '/legal/shipping' },
      { label: 'Privacy Policy', href: '/legal/privacy' },
      { label: 'Terms of Service', href: '/legal/terms' },
      { label: 'Rewards', href: '/dashboard' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <Waves className="size-6 text-primary" />
            <span className="font-heading text-xl font-black uppercase tracking-tight">Liminal</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Surf &amp; skate gear, handmade coastal goods, and a crew that lives where the land meets
            the sea.
          </p>
          <div className="mt-5">
            <NewsletterForm />
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-heading text-xs uppercase tracking-widest text-muted-foreground">
              {col.title}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted-foreground lg:px-8">
          © {new Date().getFullYear()} Liminal Surf &amp; Skate Co. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

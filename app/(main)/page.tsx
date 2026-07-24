import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Waves, Sparkles, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/shop/product-card'
import { getFeaturedProducts, getSiteSetting } from '@/lib/data'

const categories = [
  { key: 'skate', label: 'Skate', blurb: 'Decks, completes & components' },
  { key: 'surf', label: 'Surf', blurb: 'Boards, wetsuits & wax' },
  { key: 'clothing', label: 'Clothing', blurb: 'Hoodies, tees & boardshorts' },
  { key: 'accessories', label: 'Accessories', blurb: 'Caps, socks & grip' },
]

export default async function HomePage() {
  const [hero, featured] = await Promise.all([
    getSiteSetting<{ headline: string; subhead: string; cta: string }>('hero'),
    getFeaturedProducts(),
  ])

  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/hero-surf-skate.png"
          alt="Surfer crossing a coastal skatepark at golden hour"
          width={1600}
          height={900}
          priority
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-foreground/80 via-foreground/40 to-foreground/20" />
        <div className="mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 lg:px-8">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-background/90">
            <Waves className="size-4" /> Surf &amp; Skate Co.
          </p>
          <h1 className="max-w-3xl text-balance font-heading text-5xl font-black uppercase leading-[0.95] tracking-tight text-background md:text-7xl">
            {hero?.headline ?? 'Ride the Liminal line'}
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-lg text-background/90">
            {hero?.subhead ??
              'Surf & skate gear, handmade goods, and a crew that lives where the land meets the sea.'}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/shop">
                {hero?.cta ?? 'Shop the drop'} <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/community">Explore the map</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`/shop?category=${cat.key}`}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary"
            >
              <div>
                <h3 className="font-heading text-2xl font-bold uppercase tracking-tight">
                  {cat.label}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{cat.blurb}</p>
              </div>
              <span className="mt-6 flex items-center gap-1 text-sm font-semibold text-primary">
                Shop now <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="size-4" /> Just landed
            </p>
            <h2 className="font-heading text-3xl font-bold uppercase tracking-tight">New arrivals</h2>
          </div>
          <Button asChild variant="ghost">
            <Link href="/shop">View all</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Community teaser */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/community-crew.png"
          alt="Surfers and skaters hanging out on a coastal boardwalk at sunset"
          width={1600}
          height={700}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-foreground/60" />
        <div className="mx-auto max-w-7xl px-4 py-24 text-background lg:px-8">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest">
            <MapPin className="size-4" /> The Community
          </p>
          <h2 className="mt-2 max-w-2xl text-balance font-heading text-4xl font-black uppercase tracking-tight md:text-5xl">
            Find your break. Share the stoke.
          </h2>
          <p className="mt-3 max-w-xl text-background/90">
            Drop pins on your local spots, RSVP to meetups, and post your best clip of the week.
            Liminal is more than a shop — it&apos;s a crew.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/community">Join the community</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

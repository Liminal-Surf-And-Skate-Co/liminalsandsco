import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { StarRating } from './star-rating'
import { formatAUD } from '@/components/cart/cart-provider'
import type { Product } from '@/lib/types'

export function ProductCard({ product }: { product: Product }) {
  const onSale = product.compare_at_aud && product.compare_at_aud > product.price_aud
  return (
    <Link href={`/product/${product.slug}`} className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={product.images?.[0] || '/placeholder.svg?height=400&width=400&query=surf skate product'}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.is_new && <Badge className="bg-primary text-primary-foreground">New</Badge>}
          {product.is_preorder && (
            <Badge className="bg-accent text-accent-foreground">Pre-order</Badge>
          )}
          {onSale && <Badge variant="destructive">Sale</Badge>}
          {product.stock === 0 && !product.is_preorder && (
            <Badge variant="secondary">Sold out</Badge>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.brand}</p>
        <h3 className="text-sm font-medium leading-tight group-hover:text-primary">
          {product.title}
        </h3>
        <StarRating rating={product.rating} count={product.review_count} />
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{formatAUD(product.price_aud)}</span>
          {onSale && (
            <span className="text-xs text-muted-foreground line-through">
              {formatAUD(product.compare_at_aud as number)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

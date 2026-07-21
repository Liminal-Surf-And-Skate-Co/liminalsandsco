import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeError } from "@/lib/error-sanitize";
import deck from "@/assets/hero-deck.jpg";
import surfboard from "@/assets/craft-surfboard.jpg";
import apparel from "@/assets/apparel.jpg";
import accessories from "@/assets/accessories.jpg";
import workshop from "@/assets/about-workshop.jpg";

export type Department = "skate" | "surf" | "clothing" | "accessories";

export const DEPARTMENT_LABELS: Record<Department, string> = {
  skate: "Skate",
  surf: "Surf",
  clothing: "Clothing",
  accessories: "Accessories",
};

export const ALL_DEPARTMENTS: Department[] = ["skate", "surf", "clothing", "accessories"];

export type Product = {
  id: string;
  slug: string;
  title: string;
  department: Department;
  product_type: string | null;
  target_group: string | null;
  description: string;
  details: string[];
  price: number;
  sale_price: number | null;
  colour: string | null;
  sizes: string[];
  stock_count: number;
  images: string[];
  tags: string[];
  specs: Record<string, string>;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

// Fallback placeholder images by department so admins can ship product rows
// without uploading photos first.
const PLACEHOLDER: Record<Department, string> = {
  skate: deck,
  surf: surfboard,
  clothing: apparel,
  accessories: accessories,
};

export function productImage(p: Pick<Product, "images" | "department">, idx = 0): string {
  if (p.images && p.images.length > 0) return p.images[Math.min(idx, p.images.length - 1)];
  return PLACEHOLDER[p.department] ?? deck;
}

export function productGallery(p: Pick<Product, "images" | "department">): string[] {
  if (p.images && p.images.length > 0) return p.images;
  return [PLACEHOLDER[p.department] ?? deck];
}

export function effectivePrice(p: Pick<Product, "price" | "sale_price">): number {
  return p.sale_price && p.sale_price > 0 && p.sale_price < p.price ? p.sale_price : p.price;
}

export function isLowStock(p: Pick<Product, "stock_count">): boolean {
  return p.stock_count > 0 && p.stock_count <= 3;
}

export function isOutOfStock(p: Pick<Product, "stock_count">): boolean {
  return p.stock_count <= 0;
}

function normalize(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    department: (row.department || "other") as Department,
    product_type: row.product_type as string | null ?? null,
    target_group: (row.target_group as string | null) ?? "unisex",
    description: (row.description as string | null) ?? "",
    details: Array.isArray(row.details) ? (row.details as string[]) : [],
    price: Number(row.price ?? 0),
    sale_price:
      row.sale_price !== null && row.sale_price !== undefined ? Number(row.sale_price) : null,
    colour: (row.colour as string | null) ?? null,
    sizes: Array.isArray(row.sizes) ? (row.sizes as string[]) : [],
    stock_count: Number(row.stock_count ?? 0),
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    specs: row.specs && typeof row.specs === "object" && !Array.isArray(row.specs) ? (row.specs as Record<string, string>) : {},
    featured: Boolean(row.featured),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(sanitizeError(error));
  return (data ?? []).map(normalize);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(sanitizeError(error));
  return data ? normalize(data as Record<string, unknown>) : null;
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 30_000,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["products", slug],
    queryFn: () => fetchProductBySlug(slug),
    staleTime: 30_000,
  });
}

// Sort options used across the shop
export type SortKey = "newest" | "oldest" | "price-asc" | "price-desc";

export const SORT_LABELS: Record<SortKey, string> = {
  newest: "Newest added",
  oldest: "Oldest added",
  "price-asc": "Price: low → high",
  "price-desc": "Price: high → low",
};

export function sortProducts(list: Product[], sort: SortKey): Product[] {
  const copy = list.slice();
  copy.sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return effectivePrice(a) - effectivePrice(b);
      case "price-desc":
        return effectivePrice(b) - effectivePrice(a);
      case "oldest":
        return a.created_at.localeCompare(b.created_at);
      case "newest":
      default:
        return b.created_at.localeCompare(a.created_at);
    }
  });
  return copy;
}

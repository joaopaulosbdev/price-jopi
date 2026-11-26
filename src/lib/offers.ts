import type { OfferSearchResult, Product, ProductOffer } from '@/types/product'

type OfferSearchInput = Pick<Product, 'name' | 'brand' | 'minPriceRange' | 'maxPriceRange'>

export async function searchOffers(product: OfferSearchInput): Promise<OfferSearchResult> {
  const endpoint = process.env.NEXT_PUBLIC_OFFERS_API_URL
  if (!endpoint) return { status: 'unavailable' }

  try {
    const url = new URL(endpoint)
    url.searchParams.set('q', [product.name, product.brand].filter(Boolean).join(' '))
    if (product.minPriceRange != null) url.searchParams.set('min', String(product.minPriceRange))
    if (product.maxPriceRange != null) url.searchParams.set('max', String(product.maxPriceRange))
    const response = await fetch(url, { signal: AbortSignal.timeout(12_000) })
    if (!response.ok) return { status: 'unavailable' }
    const result: { offers: ProductOffer[]; partial: boolean } = await response.json()
    if (!Array.isArray(result.offers)) return { status: 'unavailable' }
    return { status: result.partial ? 'partial' : 'ready', offers: result.offers }
  } catch {
    return { status: 'unavailable' }
  }
}

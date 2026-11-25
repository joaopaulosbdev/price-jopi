export interface PriceHistory {
  id: string
  productId: string
  price: number
  storeName?: string | null
  recordedAt: string
  notes?: string | null
}

export interface Product {
  id: string
  name: string
  brand?: string | null
  category?: string | null
  targetPrice?: number | null
  imageUrl?: string | null
  storeUrl?: string | null
  notes?: string | null
  currentPrice: number | null
  lowestPrice: number | null
  highestPrice: number | null
  createdAt: string
  updatedAt: string
  priceHistory: PriceHistory[]
}

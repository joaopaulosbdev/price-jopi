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
  minPriceRange?: number | null  // Faixa mínima de monitoramento (ex: 1500)
  maxPriceRange?: number | null  // Faixa máxima de monitoramento (ex: 2000)
  targetPrice?: number | null    // Preço alvo específico para notificação (ex: 1500)
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

import { Product } from '@/types/product'

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'PlayStation 5 Slim 1TB',
    brand: 'Sony',
    category: 'Games & Consoles',
    minPriceRange: 3300.0,
    maxPriceRange: 4000.0,
    targetPrice: 3400.0,
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=400&q=80',
    notes: 'Edição com leitor de disco',
    currentPrice: 3499.00,
    lowestPrice: 3499.00,
    highestPrice: 3999.90,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    priceHistory: [
      {
        id: 'h-1-1',
        productId: 'prod-1',
        price: 3999.90,
        storeName: 'Amazon',
        recordedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      {
        id: 'h-1-2',
        productId: 'prod-1',
        price: 3850.00,
        storeName: 'Mercado Livre',
        recordedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      },
      {
        id: 'h-1-3',
        productId: 'prod-1',
        price: 3699.00,
        storeName: 'Kabum',
        recordedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      {
        id: 'h-1-4',
        productId: 'prod-1',
        price: 3499.00,
        storeName: 'Amazon',
        recordedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ],
  },
  {
    id: 'prod-2',
    name: 'iPhone 15 128GB',
    brand: 'Apple',
    category: 'Smartphones',
    minPriceRange: 4200.0,
    maxPriceRange: 5500.0,
    targetPrice: 4500.0,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80',
    notes: 'Cor Preto',
    currentPrice: 4799.00,
    lowestPrice: 4799.00,
    highestPrice: 5499.00,
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    priceHistory: [
      {
        id: 'h-2-1',
        productId: 'prod-2',
        price: 5499.00,
        storeName: 'Fast Shop',
        recordedAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      },
      {
        id: 'h-2-2',
        productId: 'prod-2',
        price: 5199.00,
        storeName: 'Amazon',
        recordedAt: new Date(Date.now() - 25 * 86400000).toISOString(),
      },
      {
        id: 'h-2-3',
        productId: 'prod-2',
        price: 4799.00,
        storeName: 'Mercado Livre',
        recordedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
    ],
  },
  {
    id: 'prod-3',
    name: 'Monitor Gamer 27" 240Hz IPS',
    brand: 'Samsung',
    category: 'Informática',
    minPriceRange: 1300.0,
    maxPriceRange: 2000.0,
    targetPrice: 1500.0,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
    notes: 'Range 1300 a 2000. Notificar em 1500',
    currentPrice: 1499.00,
    lowestPrice: 1499.00,
    highestPrice: 1899.00,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    priceHistory: [
      {
        id: 'h-3-1',
        productId: 'prod-3',
        price: 1899.00,
        storeName: 'Kabum',
        recordedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      },
      {
        id: 'h-3-2',
        productId: 'prod-3',
        price: 1749.00,
        storeName: 'Pichau',
        recordedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      {
        id: 'h-3-3',
        productId: 'prod-3',
        price: 1599.00,
        storeName: 'Mercado Livre',
        recordedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      },
      {
        id: 'h-3-4',
        productId: 'prod-3',
        price: 1499.00,
        storeName: 'Amazon',
        recordedAt: new Date().toISOString(),
      },
    ],
  },
]

const STORAGE_KEY = 'pricetracker_products_v3'

export const storage = {
  getProducts: (): Product[] => {
    if (typeof window === 'undefined') return INITIAL_PRODUCTS
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS))
        return INITIAL_PRODUCTS
      }
      return JSON.parse(saved)
    } catch {
      return INITIAL_PRODUCTS
    }
  },

  saveProducts: (products: Product[]) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e)
    }
  },

  addProduct: (productData: {
    name: string
    brand?: string | null
    category?: string | null
    minPriceRange?: number | null
    maxPriceRange?: number | null
    targetPrice?: number | null
    notes?: string | null
  }): Product => {
    const currentList = storage.getProducts()
    const id = 'prod-' + Date.now()
    const now = new Date().toISOString()

    const newProduct: Product = {
      id,
      name: productData.name,
      brand: productData.brand || null,
      category: productData.category || null,
      minPriceRange: productData.minPriceRange || null,
      maxPriceRange: productData.maxPriceRange || null,
      targetPrice: productData.targetPrice || null,
      notes: productData.notes || null,
      currentPrice: null,
      lowestPrice: null,
      highestPrice: null,
      createdAt: now,
      updatedAt: now,
      priceHistory: [],
    }

    const updated = [newProduct, ...currentList]
    storage.saveProducts(updated)
    return newProduct
  },

  addPriceQuote: (productId: string, price: number, storeName?: string, notes?: string) => {
    const currentList = storage.getProducts()
    const now = new Date().toISOString()
    let hitTarget = false

    const updated = currentList.map((p) => {
      if (p.id !== productId) return p

      // Só dispara notificação se atingir o preço alvo específico (targetPrice)
      if (p.targetPrice && price <= p.targetPrice) {
        hitTarget = true
      }

      const existingPrices = (p.priceHistory || []).map((h) => h.price)
      const allPrices = [...existingPrices, price]
      const lowestPrice = Math.min(...allPrices)
      const highestPrice = Math.max(...allPrices)

      const newHistoryItem = {
        id: 'h-' + Date.now(),
        productId,
        price,
        storeName: storeName || null,
        recordedAt: now,
        notes: notes || null,
      }

      return {
        ...p,
        currentPrice: price,
        lowestPrice,
        highestPrice,
        updatedAt: now,
        priceHistory: [...(p.priceHistory || []), newHistoryItem],
      }
    })

    storage.saveProducts(updated)
    return { updated, hitTarget }
  },

  deleteProduct: (productId: string): Product[] => {
    const currentList = storage.getProducts()
    const updated = currentList.filter((p) => p.id !== productId)
    storage.saveProducts(updated)
    return updated
  },

  resetDefaults: (): Product[] => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS))
    }
    return INITIAL_PRODUCTS
  },
}

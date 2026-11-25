import { Product } from '@/types/product'

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'PlayStation 5 Slim 1TB',
    brand: 'Sony',
    category: 'Games & Consoles',
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
    name: 'Headphone WH-1000XM5 Cancelamento de Ruído',
    brand: 'Sony',
    category: 'Áudio',
    targetPrice: 1900.0,
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80',
    notes: 'Melhor ANC do mercado',
    currentPrice: 1989.00,
    lowestPrice: 1989.00,
    highestPrice: 2399.00,
    createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    priceHistory: [
      {
        id: 'h-3-1',
        productId: 'prod-3',
        price: 2399.00,
        storeName: 'Amazon',
        recordedAt: new Date(Date.now() - 35 * 86400000).toISOString(),
      },
      {
        id: 'h-3-2',
        productId: 'prod-3',
        price: 2199.00,
        storeName: 'Mercado Livre',
        recordedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      },
      {
        id: 'h-3-3',
        productId: 'prod-3',
        price: 1989.00,
        storeName: 'Kabum',
        recordedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ],
  },
  {
    id: 'prod-4',
    name: 'Monitor Gamer Odyssey G40 27" 240Hz IPS',
    brand: 'Samsung',
    category: 'Informática',
    targetPrice: 1500.0,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
    notes: 'G-Sync compatível',
    currentPrice: 1499.00,
    lowestPrice: 1499.00,
    highestPrice: 1899.00,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    priceHistory: [
      {
        id: 'h-4-1',
        productId: 'prod-4',
        price: 1899.00,
        storeName: 'Kabum',
        recordedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      },
      {
        id: 'h-4-2',
        productId: 'prod-4',
        price: 1749.00,
        storeName: 'Pichau',
        recordedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      {
        id: 'h-4-3',
        productId: 'prod-4',
        price: 1599.00,
        storeName: 'Mercado Livre',
        recordedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      },
      {
        id: 'h-4-4',
        productId: 'prod-4',
        price: 1499.00,
        storeName: 'Amazon',
        recordedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'prod-5',
    name: 'Cafeteira Nespresso Vertuo Pop',
    brand: 'Nespresso',
    category: 'Eletrodomésticos',
    targetPrice: 400.0,
    imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=400&q=80',
    notes: 'Cafés longos e expressos',
    currentPrice: 429.00,
    lowestPrice: 429.00,
    highestPrice: 599.00,
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    priceHistory: [
      {
        id: 'h-5-1',
        productId: 'prod-5',
        price: 599.00,
        storeName: 'Nespresso Store',
        recordedAt: new Date(Date.now() - 40 * 86400000).toISOString(),
      },
      {
        id: 'h-5-2',
        productId: 'prod-5',
        price: 499.00,
        storeName: 'Amazon',
        recordedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      },
      {
        id: 'h-5-3',
        productId: 'prod-5',
        price: 429.00,
        storeName: 'Mercado Livre',
        recordedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
    ],
  },
]

const STORAGE_KEY = 'pricetracker_products_v2'

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

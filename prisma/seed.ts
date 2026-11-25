import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding initial data...')

  const samples = [
    {
      name: 'PlayStation 5 Slim 1TB',
      brand: 'Sony',
      category: 'Games & Consoles',
      targetPrice: 3400.0,
      imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=400&q=80',
      storeUrl: 'https://www.playstation.com',
      notes: 'Edição com leitor de disco',
      history: [
        { price: 3999.90, storeName: 'Amazon', daysAgo: 30 },
        { price: 3850.00, storeName: 'Mercado Livre', daysAgo: 20 },
        { price: 3699.00, storeName: 'Kabum', daysAgo: 10 },
        { price: 3499.00, storeName: 'Amazon', daysAgo: 1 },
      ],
    },
    {
      name: 'iPhone 15 128GB',
      brand: 'Apple',
      category: 'Smartphones',
      targetPrice: 4500.0,
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80',
      storeUrl: 'https://www.apple.com',
      notes: 'Cor Preto',
      history: [
        { price: 5499.00, storeName: 'Fast Shop', daysAgo: 45 },
        { price: 5199.00, storeName: 'Amazon', daysAgo: 25 },
        { price: 4799.00, storeName: 'Mercado Livre', daysAgo: 5 },
      ],
    },
    {
      name: 'Headphone WH-1000XM5 Cancelamento de Ruído',
      brand: 'Sony',
      category: 'Áudio',
      targetPrice: 1900.0,
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80',
      storeUrl: 'https://www.sony.com',
      notes: 'Melhor ANC do mercado',
      history: [
        { price: 2399.00, storeName: 'Amazon', daysAgo: 35 },
        { price: 2199.00, storeName: 'Mercado Livre', daysAgo: 15 },
        { price: 1989.00, storeName: 'Kabum', daysAgo: 2 },
      ],
    },
    {
      name: 'Monitor Gamer Odyssey G40 27" 240Hz IPS',
      brand: 'Samsung',
      category: 'Informática',
      targetPrice: 1500.0,
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
      storeUrl: 'https://www.samsung.com',
      notes: 'G-Sync compatível',
      history: [
        { price: 1899.00, storeName: 'Kabum', daysAgo: 60 },
        { price: 1749.00, storeName: 'Pichau', daysAgo: 30 },
        { price: 1599.00, storeName: 'Mercado Livre', daysAgo: 8 },
        { price: 1499.00, storeName: 'Amazon', daysAgo: 0 },
      ],
    },
    {
      name: 'Cafeteira Nespresso Vertuo Pop',
      brand: 'Nespresso',
      category: 'Eletrodomésticos',
      targetPrice: 400.0,
      imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=400&q=80',
      storeUrl: 'https://www.nespresso.com',
      notes: 'Cafés longos e expressos',
      history: [
        { price: 599.00, storeName: 'Nespresso Store', daysAgo: 40 },
        { price: 499.00, storeName: 'Amazon', daysAgo: 20 },
        { price: 429.00, storeName: 'Mercado Livre', daysAgo: 3 },
      ],
    },
  ]

  for (const item of samples) {
    const prices = item.history.map((h) => h.price)
    const currentPrice = prices[prices.length - 1]
    const lowestPrice = Math.min(...prices)
    const highestPrice = Math.max(...prices)

    const product = await prisma.product.create({
      data: {
        name: item.name,
        brand: item.brand,
        category: item.category,
        targetPrice: item.targetPrice,
        imageUrl: item.imageUrl,
        storeUrl: item.storeUrl,
        notes: item.notes,
        currentPrice,
        lowestPrice,
        highestPrice,
      },
    })

    const now = Date.now()
    for (const h of item.history) {
      const recordedAt = new Date(now - h.daysAgo * 24 * 60 * 60 * 1000)
      await prisma.priceHistory.create({
        data: {
          productId: product.id,
          price: h.price,
          storeName: h.storeName,
          recordedAt,
        },
      })
    }
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

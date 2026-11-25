import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products - Lista produtos com filtros por marca, busca de nome e ordenação
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('q') || ''
    const brand = searchParams.get('brand') || ''
    const category = searchParams.get('category') || ''
    const sortBy = searchParams.get('sortBy') || 'updatedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { category: { contains: search } },
      ]
    }

    if (brand && brand !== 'all') {
      where.brand = brand
    }

    if (category && category !== 'all') {
      where.category = category
    }

    const orderBy: any = {}
    if (['currentPrice', 'name', 'createdAt', 'updatedAt'].includes(sortBy)) {
      orderBy[sortBy] = sortOrder === 'asc' ? 'asc' : 'desc'
    } else {
      orderBy.updatedAt = 'desc'
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        priceHistory: {
          orderBy: { recordedAt: 'asc' },
        },
      },
    })

    return NextResponse.json({ success: true, data: products })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}

// POST /api/products - Cadastra um novo produto com preço inicial
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, brand, category, targetPrice, imageUrl, storeUrl, notes, currentPrice, storeName } = body

    if (!name || !brand || currentPrice === undefined || isNaN(Number(currentPrice))) {
      return NextResponse.json(
        { success: false, error: 'Nome, marca e preço inicial válido são obrigatórios' },
        { status: 400 }
      )
    }

    const price = Number(currentPrice)
    const target = targetPrice ? Number(targetPrice) : null

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        brand: brand.trim(),
        category: category ? category.trim() : null,
        targetPrice: target,
        imageUrl: imageUrl ? imageUrl.trim() : null,
        storeUrl: storeUrl ? storeUrl.trim() : null,
        notes: notes ? notes.trim() : null,
        currentPrice: price,
        lowestPrice: price,
        highestPrice: price,
        priceHistory: {
          create: {
            price,
            storeName: storeName ? storeName.trim() : null,
            notes: 'Preço inicial registrado',
          },
        },
      },
      include: {
        priceHistory: true,
      },
    })

    return NextResponse.json({ success: true, data: product }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao cadastrar produto' },
      { status: 500 }
    )
  }
}

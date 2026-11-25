import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/brands - Lista todas as marcas distintas cadastradas
export async function GET() {
  try {
    const brands = await prisma.product.findMany({
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    })

    const categories = await prisma.product.findMany({
      where: { category: { not: null } },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: {
        brands: brands.map((b) => b.brand),
        categories: categories.map((c) => c.category as string),
      },
    })
  } catch (error: any) {
    console.error('Error fetching brands/categories:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar marcas e categorias' },
      { status: 500 }
    )
  }
}

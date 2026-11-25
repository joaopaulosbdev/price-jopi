import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/products/[id]/prices - Adiciona nova leitura de preço
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { price, storeName, notes, recordedAt } = body

    if (price === undefined || isNaN(Number(price)) || Number(price) <= 0) {
      return NextResponse.json(
        { success: false, error: 'Preço válido é obrigatório' },
        { status: 400 }
      )
    }

    const newPrice = Number(price)

    // Buscar produto e histórico existente
    const product = await prisma.product.findUnique({
      where: { id },
      include: { priceHistory: true },
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    const allPrices = [...product.priceHistory.map((p) => p.price), newPrice]
    const lowestPrice = Math.min(...allPrices)
    const highestPrice = Math.max(...allPrices)

    // Criar histórico e atualizar o produto
    const [priceRecord, updatedProduct] = await prisma.$transaction([
      prisma.priceHistory.create({
        data: {
          productId: id,
          price: newPrice,
          storeName: storeName ? storeName.trim() : null,
          notes: notes ? notes.trim() : null,
          recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
        },
      }),
      prisma.product.update({
        where: { id },
        data: {
          currentPrice: newPrice,
          lowestPrice,
          highestPrice,
        },
        include: {
          priceHistory: {
            orderBy: { recordedAt: 'asc' },
          },
        },
      }),
    ])

    return NextResponse.json(
      {
        success: true,
        data: {
          priceRecord,
          product: updatedProduct,
          hitTargetPrice: product.targetPrice ? newPrice <= product.targetPrice : false,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error adding price record:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao registrar nova cotação de preço' },
      { status: 500 }
    )
  }
}

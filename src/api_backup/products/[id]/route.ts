import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        priceHistory: {
          orderBy: { recordedAt: 'asc' },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: product })
  } catch (error: any) {
    console.error('Error getting product:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar dados do produto' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Atualiza dados cadastrais
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, brand, category, targetPrice, imageUrl, storeUrl, notes } = body

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(brand && { brand: brand.trim() }),
        category: category !== undefined ? (category ? category.trim() : null) : undefined,
        targetPrice: targetPrice !== undefined ? (targetPrice ? Number(targetPrice) : null) : undefined,
        imageUrl: imageUrl !== undefined ? (imageUrl ? imageUrl.trim() : null) : undefined,
        storeUrl: storeUrl !== undefined ? (storeUrl ? storeUrl.trim() : null) : undefined,
        notes: notes !== undefined ? (notes ? notes.trim() : null) : undefined,
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar produto' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Produto removido com sucesso' })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao remover produto' },
      { status: 500 }
    )
  }
}

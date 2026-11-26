'use client'

import React, { useState } from 'react'
import { X, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { Product } from '@/types/product'
import { formatCurrency } from '@/lib/utils'
import { storage } from '@/lib/storage'

interface UpdatePriceModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onSuccess: (hitTarget?: boolean) => void
}

export default function UpdatePriceModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: UpdatePriceModalProps) {
  const [price, setPrice] = useState('')
  const [storeName, setStoreName] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !product) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const numPrice = Number(price)
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      setError('Por favor, informe um valor de preço válido maior que zero.')
      return
    }

    setLoading(true)

    try {
      const { hitTarget } = storage.addPriceQuote(
        product.id,
        numPrice,
        storeName.trim() || undefined,
        notes.trim() || undefined
      )

      setPrice('')
      setStoreName('')
      setNotes('')
      onSuccess(hitTarget)
      onClose()
    } catch (err) {
      setError((err instanceof Error && err.message) || 'Erro ao registrar cotação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-neutral-100">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-semibold">Nova Cotação de Preço</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-3 p-3 bg-neutral-950/60 border border-neutral-800/80 rounded-xl text-xs space-y-1">
          <p className="font-semibold text-neutral-200 truncate">{product.name}</p>
          <div className="flex justify-between text-neutral-400">
            <span>Marca: <strong className="text-neutral-300">{product.brand || 'Não especificada'}</strong></span>
            <span>Preço Atual: <strong className="text-blue-400">{product.currentPrice !== null ? formatCurrency(product.currentPrice) : 'Ainda sem registro'}</strong></span>
          </div>
          {product.targetPrice && (
            <p className="text-emerald-400">
              Preço Alvo: {formatCurrency(product.targetPrice)}
            </p>
          )}
        </div>

        {error && (
          <div className="mt-3 p-2.5 bg-red-950/50 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Novo Preço Identificado (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              autoFocus
              placeholder="ex: 1299.90"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Onde foi encontrado (Loja / Vendedor)
            </label>
            <input
              type="text"
              placeholder="ex: Amazon Brasil, Loja Oficial, Kabum..."
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Observação / Cupom (opcional)
            </label>
            <input
              type="text"
              placeholder="ex: Preço à vista no Pix, cupom TECH10..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {loading ? 'Registrando...' : 'Salvar Cotação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

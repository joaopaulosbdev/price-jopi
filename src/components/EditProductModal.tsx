'use client'

import React, { useState } from 'react'
import { X, Edit3, AlertCircle, Save, Target, Tag, SlidersHorizontal } from 'lucide-react'
import { Product } from '@/types/product'
import { storage } from '@/lib/storage'
import { searchOffers } from '@/lib/offers'

interface EditProductModalProps {
  product: Product
  onClose: () => void
  onSuccess: () => void
  existingBrands: string[]
}

export default function EditProductModal({
  product,
  onClose,
  onSuccess,
  existingBrands,
}: EditProductModalProps) {
  const [name, setName] = useState(product.name)
  const [brand, setBrand] = useState(product.brand ?? '')
  const [customBrand, setCustomBrand] = useState('')
  const [minPriceRange, setMinPriceRange] = useState(String(product.minPriceRange ?? ''))
  const [maxPriceRange, setMaxPriceRange] = useState(String(product.maxPriceRange ?? ''))
  const [targetPrice, setTargetPrice] = useState(String(product.targetPrice ?? ''))
  const [notes, setNotes] = useState(product.notes ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const effectiveBrand = brand === '__new__' ? customBrand.trim() : brand.trim()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Por favor, informe o nome do produto.')
      return
    }

    const minRange = minPriceRange ? Number(minPriceRange) : null
    const maxRange = maxPriceRange ? Number(maxPriceRange) : null
    const target = targetPrice ? Number(targetPrice) : null

    if (minRange !== null && maxRange !== null && minRange > maxRange) {
      setError('O valor mínimo do range não pode ser maior que o valor máximo.')
      return
    }

    setLoading(true)

    try {
      const updates = {
        name: name.trim(),
        brand: effectiveBrand || null,
        minPriceRange: minRange,
        maxPriceRange: maxRange,
        targetPrice: target,
        notes: notes.trim() || null,
      }
      const searchChanged = updates.name !== product.name || updates.brand !== (product.brand ?? null) ||
        minRange !== (product.minPriceRange ?? null) || maxRange !== (product.maxPriceRange ?? null)
      const offerSearch = searchChanged ? await searchOffers(updates) : product.offerSearch
      storage.updateProduct(product.id, { ...updates, offerSearch })

      onSuccess()
      onClose()
    } catch (err) {
      setError((err instanceof Error && err.message) || 'Erro ao atualizar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-neutral-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Editar Item Monitorado</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-red-300 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Nome do Produto / Palavras-chave *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-neutral-400" />
              Marca do Fabricante (opcional)
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="">Sem marca especificada</option>
              {existingBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
              <option value="__new__">+ Digitar outra marca...</option>
            </select>
            {brand === '__new__' && (
              <input
                type="text"
                placeholder="Nome da marca"
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                className="mt-2 w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            )}
          </div>

          {/* Range de Preço */}
          <div className="p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-xl space-y-2.5">
            <label className="block text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
              Range de Preço para o Gráfico
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-neutral-400 block mb-1">Mínimo (R$)</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="ex: 1500"
                  value={minPriceRange}
                  onChange={(e) => setMinPriceRange(e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <span className="text-[11px] text-neutral-400 block mb-1">Máximo (R$)</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="ex: 2000"
                  value={maxPriceRange}
                  onChange={(e) => setMaxPriceRange(e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Preço Alvo */}
          <div className="p-3.5 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-1.5">
            <label className="block text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" />
              Preço Alvo para Notificação (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="ex: 1500 (notifica e toca alarme)"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-emerald-800/60 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-400 text-sm font-semibold text-emerald-400"
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Observações
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

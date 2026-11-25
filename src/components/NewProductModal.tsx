'use client'

import React, { useState } from 'react'
import { X, PlusCircle, AlertCircle } from 'lucide-react'
import { storage } from '@/lib/storage'

interface NewProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  existingBrands: string[]
}

export default function NewProductModal({
  isOpen,
  onClose,
  onSuccess,
  existingBrands,
}: NewProductModalProps) {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [customBrand, setCustomBrand] = useState('')
  const [category, setCategory] = useState('')
  const [currentPrice, setCurrentPrice] = useState('')
  const [targetPrice, setTargetPrice] = useState('')
  const [storeName, setStoreName] = useState('')
  const [storeUrl, setStoreUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const finalBrand = brand === '__new__' ? customBrand.trim() : brand.trim()

    if (!name.trim()) {
      setError('Informe o nome do item')
      return
    }
    if (!finalBrand) {
      setError('Informe ou selecione a marca')
      return
    }
    if (!currentPrice || isNaN(Number(currentPrice)) || Number(currentPrice) <= 0) {
      setError('Informe um preço inicial válido')
      return
    }

    setLoading(true)

    try {
      storage.addProduct({
        name: name.trim(),
        brand: finalBrand,
        category: category.trim() || undefined,
        currentPrice: Number(currentPrice),
        targetPrice: targetPrice ? Number(targetPrice) : undefined,
        storeName: storeName.trim() || undefined,
        storeUrl: storeUrl.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        notes: notes.trim() || undefined,
      })

      // Reset form
      setName('')
      setBrand('')
      setCustomBrand('')
      setCategory('')
      setCurrentPrice('')
      setTargetPrice('')
      setStoreName('')
      setStoreUrl('')
      setImageUrl('')
      setNotes('')

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-neutral-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Novo Item para Monitorar</h2>
          </div>
          <button
            onClick={onClose}
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
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Nome do Item / Modelo *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Monitor 27'' 144Hz ou Smartphone Galaxy S24"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Marca do Fabricante *
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="">Selecione a marca...</option>
                {existingBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
                <option value="__new__">+ Digitar nova marca...</option>
              </select>
              {brand === '__new__' && (
                <input
                  type="text"
                  placeholder="Nome da nova marca"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  className="mt-2 w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Categoria (opcional)
              </label>
              <input
                type="text"
                placeholder="ex: Informática, Games, Áudio"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Preço Atual (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0,00"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Preço Alvo / Meta (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="ex: 1500 (recebe badge de meta)"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Loja onde viu o preço
              </label>
              <input
                type="text"
                placeholder="ex: Amazon, Mercado Livre, Kabum"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Link do Produto (URL)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              URL da Imagem (opcional)
            </label>
            <input
              type="url"
              placeholder="https://... link de imagem jpg/png"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Observações / Notas
            </label>
            <textarea
              rows={2}
              placeholder="ex: Especificação especial, garantia estendida, cor preta..."
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Cadastrar Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

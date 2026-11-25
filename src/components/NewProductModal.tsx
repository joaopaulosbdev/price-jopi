'use client'

import React, { useState } from 'react'
import { X, PlusCircle, AlertCircle, Sparkles } from 'lucide-react'
import { storage } from '@/lib/storage'
import { generateStoreLinks } from '@/lib/storeLinks'

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
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const effectiveBrand = brand === '__new__' ? customBrand.trim() : brand.trim()
  const previewLinks = name.trim() ? generateStoreLinks(name.trim(), effectiveBrand) : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Informe o nome ou palavras-chave do item')
      return
    }
    if (!effectiveBrand) {
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
        brand: effectiveBrand,
        category: category.trim() || undefined,
        currentPrice: Number(currentPrice),
        targetPrice: targetPrice ? Number(targetPrice) : undefined,
        storeName: storeName.trim() || undefined,
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

        <div className="mt-3 p-3 bg-blue-950/40 border border-blue-800/50 rounded-xl text-xs text-blue-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            <strong>Busca Automática:</strong> Não precisa colar links! O sistema gera links diretos para <strong>Mercado Livre, Amazon, Google Shopping, Buscapé e Kabum</strong> com base no nome e marca.
          </span>
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
              Nome do Item / Palavras-chave *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Monitor 27'' 144Hz, Galaxy S24 Ultra, RTX 4070..."
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
                placeholder="ex: Informática, Games, Áudio..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Preço Atual Identificado (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0,00"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Preço Alvo / Meta de Notificação (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="ex: 1500 (ativa alerta sonoro/navegador)"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 text-sm font-semibold text-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Loja de Referência (opcional)
            </label>
            <input
              type="text"
              placeholder="ex: Amazon, Mercado Livre, Kabum"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Observações / Detalhes do Modelo
            </label>
            <textarea
              rows={2}
              placeholder="ex: Cor preta, 110V, 16GB RAM..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* Pré-visualização dos links que o sistema irá gerar */}
          {name.trim() && (
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block mb-1.5 font-medium">
                Links gerados automaticamente para pesquisa rápida:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {previewLinks.map((p) => (
                  <span
                    key={p.storeName}
                    className="text-[11px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300"
                  >
                    🔍 {p.badgeText}
                  </span>
                ))}
              </div>
            </div>
          )}

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

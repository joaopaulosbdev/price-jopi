'use client'

import React, { useState } from 'react'
import { X, PlusCircle, AlertCircle, Sparkles, Target, Tag } from 'lucide-react'
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
  const [minPriceRange, setMinPriceRange] = useState('')
  const [maxPriceRange, setMaxPriceRange] = useState('')
  const [targetPrice, setTargetPrice] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const effectiveBrand = brand === '__new__' ? customBrand.trim() : brand.trim()
  const previewLinks = name.trim() ? generateStoreLinks(name.trim(), effectiveBrand || undefined) : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Por favor, informe o nome do item ou modelo.')
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
      storage.addProduct({
        name: name.trim(),
        brand: effectiveBrand || null,
        minPriceRange: minRange,
        maxPriceRange: maxRange,
        targetPrice: target,
        notes: notes.trim() || null,
      })

      // Reset
      setName('')
      setBrand('')
      setCustomBrand('')
      setMinPriceRange('')
      setMaxPriceRange('')
      setTargetPrice('')
      setNotes('')

      onSuccess()
      onClose()
    } catch (err) {
      setError((err instanceof Error && err.message) || 'Erro ao cadastrar produto')
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
            <h2 className="text-lg font-semibold">Monitorar Novo Item</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informação intuitiva */}
        <div className="mt-3.5 p-3.5 bg-blue-950/40 border border-blue-800/40 rounded-xl text-xs text-blue-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-blue-300">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Range de Monitoramento & Alerta no Alvo</span>
          </div>
          <p className="text-neutral-300">
            Defina uma faixa de preço (ex: <strong>R$ 1.500 até R$ 2.000</strong>) para acompanhar no gráfico. O site <strong>só disparará a notificação quando atingir o Preço Alvo</strong> (ex: R$ 1.500).
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-red-300 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Nome / Palavras-chave */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Nome do Produto / Palavras-chave *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="ex: Monitor 27 144Hz, Galaxy S24, PlayStation 5..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm font-medium"
            />
          </div>

          {/* Marca (Opcional) */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-neutral-400" />
              Marca do Fabricante <span className="text-neutral-500 font-normal">(opcional)</span>
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="">Não especificar marca agora</option>
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
                placeholder="Nome da marca (ex: Dell, LG, Samsung...)"
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                className="mt-2 w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            )}
          </div>

          {/* Range de Preço (De X até Y) */}
          <div className="p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-xl space-y-3">
            <label className="block text-xs font-semibold text-neutral-300">
              Range de Preço para o Gráfico (Faixa de Interesse)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <span className="text-[11px] text-neutral-400 block mb-1">Preço Mínimo (R$)</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="ex: 1500"
                  value={minPriceRange}
                  onChange={(e) => {
                    setMinPriceRange(e.target.value)
                    // Sugerir automaticamente como target se estiver vazio
                    if (!targetPrice) setTargetPrice(e.target.value)
                  }}
                  className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <span className="text-[11px] text-neutral-400 block mb-1">Preço Máximo (R$)</span>
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
            <p className="text-[11px] text-neutral-500 italic">
              Exemplo: acompanhe flutuações entre R$ 1.500 e R$ 2.000 destacadas no gráfico.
            </p>
          </div>

          {/* Preço Alvo Estrito para Notificação */}
          <div className="p-3.5 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-2">
            <label className="block text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" />
              Preço Alvo para Notificação (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="ex: 1500 (o alarme e a notificação SÓ disparam se chegar aqui)"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-emerald-800/60 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-400 text-sm font-semibold text-emerald-400"
            />
            <p className="text-[11px] text-emerald-400/80">
              🔔 O alerta no navegador e o som <strong>só serão ativados</strong> quando o preço registrado for menor ou igual a este valor.
            </p>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Observações <span className="text-neutral-500 font-normal">(opcional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="ex: Versão com garantia, cor específica..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* Prévia dos comparadores */}
          {name.trim() && (
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block mb-1 font-medium">
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
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              {loading ? 'Cadastrando...' : 'Começar a Monitorar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

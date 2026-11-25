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
      setError('Por favor, informe o nome do item ou palavras-chave.')
      return
    }

    setLoading(true)

    try {
      storage.addProduct({
        name: name.trim(),
        brand: effectiveBrand || null,
        targetPrice: targetPrice ? Number(targetPrice) : null,
        notes: notes.trim() || null,
      })

      // Reset
      setName('')
      setBrand('')
      setCustomBrand('')
      setTargetPrice('')
      setNotes('')

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-neutral-100 max-h-[90vh] overflow-y-auto">
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
            <span>Busca e Acompanhamento Automático</span>
          </div>
          <p className="text-neutral-300">
            Você só precisa digitar o <strong>nome ou modelo do produto</strong>! O sistema gera links diretos para Mercado Livre, Amazon, Buscapé e Google Shopping para encontrar os preços.
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-red-300 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Nome / Palavras-chave (Único campo obrigatório) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              O que você deseja monitorar? (Nome / Palavras-chave) *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="ex: Galaxy S24 Ultra, PlayStation 5, Monitor 27 144Hz, Cafeteira..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm font-medium shadow-inner"
            />
          </div>

          {/* Marca (Agora totalmente opcional) */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-neutral-400" />
                Marca do Fabricante <span className="text-neutral-500 font-normal">(opcional)</span>
              </span>
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
                placeholder="Digite o nome da marca (ex: Dell, LG, Xiaomi...)"
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                className="mt-2 w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            )}
          </div>

          {/* Preço Alvo / Desejado */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              Preço Alvo / Meta desejada (R$) <span className="text-neutral-500 font-normal">(opcional)</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="ex: 1500 (o site avisa com som e notificação quando atingir)"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 text-sm font-semibold text-emerald-400"
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              Observações / Especificação <span className="text-neutral-500 font-normal">(opcional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="ex: Versão 256GB, cor preta, voltagem 110V..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* Prévia dos comparadores */}
          {name.trim() && (
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block mb-1.5 font-medium">
                Lojas onde o item será pesquisado automaticamente:
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

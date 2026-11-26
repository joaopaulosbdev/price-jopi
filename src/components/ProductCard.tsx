'use client'

import React, { useState } from 'react'
import {
  Tag,
  TrendingDown,
  TrendingUp,
  ExternalLink,
  Plus,
  Trash2,
  Calendar,
  Store,
  ChevronDown,
  ChevronUp,
  Target,
  Sparkles,
  ShoppingBag,
  HelpCircle,
  SlidersHorizontal,
  Edit3,
} from 'lucide-react'
import { Product } from '@/types/product'
import { formatCurrency, formatDate } from '@/lib/utils'
import { generateStoreLinks } from '@/lib/storeLinks'
import { searchOffers } from '@/lib/offers'
import PriceChart from './PriceChart'
import OffersChart from './OffersChart'

interface ProductCardProps {
  product: Product
  onAddPrice: (product: Product) => void
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  onOffersUpdated: (product: Product, result: NonNullable<Product['offerSearch']>) => void
}

export default function ProductCard({
  product,
  onAddPrice,
  onEdit,
  onDelete,
  onOffersUpdated,
}: ProductCardProps) {
  const [showHistory, setShowHistory] = useState(false)
  const [showLinks, setShowLinks] = useState(false)
  const [searching, setSearching] = useState(false)

  const handleSearchOffers = async () => {
    setSearching(true)
    try {
      onOffersUpdated(product, await searchOffers(product))
    } finally {
      setSearching(false)
    }
  }

  // Gerar links automáticos de busca por nome e marca
  const autoStoreLinks = generateStoreLinks(product.name, product.brand || undefined)

  const history = product.priceHistory || []
  let priceDiffPercent: number | null = null

  if (history.length >= 2) {
    const lastPrice = history[history.length - 1].price
    const prevPrice = history[history.length - 2].price
    priceDiffPercent = ((lastPrice - prevPrice) / prevPrice) * 100
  }

  // Notificação e badge APENAS se atingir o preço alvo específico
  const reachedTarget = product.targetPrice && product.currentPrice !== null
    ? product.currentPrice <= product.targetPrice
    : false

  // Verificar se o preço atual está dentro da faixa de interesse (range)
  const isInRange =
    product.currentPrice !== null &&
    product.minPriceRange != null &&
    product.maxPriceRange != null &&
    product.currentPrice >= product.minPriceRange &&
    product.currentPrice <= product.maxPriceRange

  const hasPrices = product.currentPrice !== null

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl hover:border-neutral-700 transition flex flex-col justify-between group">
      <div>
        {/* Cabeçalho do Card */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {product.brand ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Tag className="w-3 h-3" />
                  {product.brand}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-neutral-800 text-neutral-400">
                  Sem marca definida
                </span>
              )}
              {product.category && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-neutral-800 text-neutral-400">
                  {product.category}
                </span>
              )}
            </div>

            {/* Status do Alvo Estrito */}
            {reachedTarget && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                <Sparkles className="w-3 h-3" />
                Alvo Atingido!
              </span>
            )}
          </div>

          <h3 className="mt-2.5 text-base font-semibold text-neutral-100 line-clamp-2 title-hover group-hover:text-blue-400 transition">
            {product.name}
          </h3>

          {product.notes && (
            <p className="mt-1 text-xs text-neutral-400 line-clamp-1 italic">
              {product.notes}
            </p>
          )}
        </div>

        {/* Informações de Preço, Range e Alvo */}
        <div className="px-5 py-3 bg-neutral-950/40 border-y border-neutral-800/60">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">
                Preço Atual
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                {hasPrices ? (
                  <span className="text-2xl font-bold text-white tracking-tight">
                    {formatCurrency(product.currentPrice!)}
                  </span>
                ) : (
                  <span className="text-sm font-medium text-amber-400 flex items-center gap-1 py-1">
                    <HelpCircle className="w-4 h-4" />
                    Aguardando 1ª cotação
                  </span>
                )}

                {priceDiffPercent !== null && priceDiffPercent !== 0 && (
                  <span
                    className={`inline-flex items-center text-xs font-medium px-1.5 py-0.5 rounded ${
                      priceDiffPercent < 0
                        ? 'text-emerald-400 bg-emerald-950/50'
                        : 'text-rose-400 bg-rose-950/50'
                    }`}
                  >
                    {priceDiffPercent < 0 ? (
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                    ) : (
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                    )}
                    {Math.abs(priceDiffPercent).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>

            {/* Metas / Alvo */}
            {product.targetPrice && (
              <div className="text-right">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider flex items-center justify-end gap-1">
                  <Target className="w-3 h-3 text-emerald-400" />
                  Alvo (Notificação)
                </span>
                <span className="text-xs font-semibold text-emerald-400 block mt-0.5">
                  {formatCurrency(product.targetPrice)}
                </span>
              </div>
            )}
          </div>

          {/* Range Configurado */}
          {(product.minPriceRange || product.maxPriceRange) && (
            <div className="mt-2.5 pt-2 border-t border-neutral-800/50 flex items-center justify-between text-xs">
              <span className="text-neutral-400 flex items-center gap-1 text-[11px]">
                <SlidersHorizontal className="w-3 h-3 text-blue-400" />
                Range de Acompanhamento:
              </span>
              <span className={`font-medium text-[11px] ${isInRange ? 'text-blue-400 font-semibold' : 'text-neutral-300'}`}>
                {product.minPriceRange ? formatCurrency(product.minPriceRange) : 'R$ 0'} até{' '}
                {product.maxPriceRange ? formatCurrency(product.maxPriceRange) : '∞'}
                {isInRange && ' (Dentro da faixa)'}
              </span>
            </div>
          )}

          {/* Menor e Maior Preço Histórico */}
          {hasPrices && (
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-neutral-800/50 text-[11px]">
              <div>
                <span className="text-neutral-500">Mínimo Registrado:</span>{' '}
                <span className="text-neutral-300 font-medium">
                  {formatCurrency(product.lowestPrice!)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-neutral-500">Máximo Registrado:</span>{' '}
                <span className="text-neutral-300 font-medium">
                  {formatCurrency(product.highestPrice!)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Links Automáticos de Lojas Encontradas */}
        <div className="px-5 pt-3">
          <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
                Buscar preços nas lojas:
              </span>
              <button
                onClick={() => setShowLinks(!showLinks)}
                className="text-[11px] text-blue-400 hover:text-blue-300 transition"
              >
                {showLinks ? 'Menos' : 'Ver todas'}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(showLinks ? autoStoreLinks : autoStoreLinks.slice(0, 3)).map((item) => (
                <a
                  key={item.storeName}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition ${item.color}`}
                  title={`Ver preços de ${product.name} no ${item.storeName}`}
                >
                  <span>{item.badgeText}</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Gráfico do Histórico com Range e Pontos Clicáveis */}
        <div className="p-5 pt-3 space-y-3">
          <OffersChart
            result={product.offerSearch}
            target={product.targetPrice}
            searching={searching}
            onSearch={handleSearchOffers}
          />
          {(history.length > 0 || !product.offerSearch) && <PriceChart
            productName={product.name}
            history={product.priceHistory}
            targetPrice={product.targetPrice}
            minPriceRange={product.minPriceRange}
            maxPriceRange={product.maxPriceRange}
            storeLinks={autoStoreLinks}
          />}

          {/* Botão de Expansão da Tabela de Registros */}
          {history.length > 0 && (
            <>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="mt-2.5 w-full py-1.5 flex items-center justify-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 rounded-lg transition"
              >
                <span>
                  {showHistory ? 'Ocultar' : 'Ver'} histórico ({history.length}{' '}
                  {history.length === 1 ? 'leitura' : 'leituras'})
                </span>
                {showHistory ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Lista detalhada do histórico quando expandida */}
              {showHistory && (
                <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {[...history].reverse().map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-neutral-950/70 border border-neutral-800/80 text-xs"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-neutral-200">
                          {formatCurrency(rec.price)}
                        </span>
                        <span className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-2.5 h-2.5" />
                          {formatDate(rec.recordedAt)}
                        </span>
                      </div>
                      <div className="text-right">
                        {rec.storeName && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded">
                            <Store className="w-2.5 h-2.5 text-blue-400" />
                            {rec.storeName}
                          </span>
                        )}
                        {rec.notes && (
                          <p className="text-[10px] text-neutral-500 italic mt-0.5">
                            {rec.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Ações do Card */}
      <div className="p-4 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(product)}
            className="p-2 rounded-xl text-neutral-400 hover:text-blue-400 hover:bg-neutral-800 transition"
            title="Editar item (nome, marca, range, preço alvo)"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
            title="Excluir item monitorado"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => onAddPrice(product)}
          className="px-3.5 py-1.5 bg-blue-600/90 hover:bg-blue-500 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition shadow-md shadow-blue-600/20"
        >
          <Plus className="w-3.5 h-3.5" />
          {hasPrices ? 'Nova Cotação' : 'Adicionar Preço'}
        </button>
      </div>
    </div>
  )
}

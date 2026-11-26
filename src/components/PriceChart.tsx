'use client'

import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
} from 'recharts'
import { PriceHistory } from '@/types/product'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'

interface PriceChartProps {
  productName: string
  history: PriceHistory[]
  targetPrice?: number | null
  minPriceRange?: number | null
  maxPriceRange?: number | null
  storeLinks?: { storeName: string; url: string }[]
}

export default function PriceChart({
  productName,
  history,
  targetPrice,
  minPriceRange,
  maxPriceRange,
  storeLinks,
}: PriceChartProps) {
  const hasHistory = history && history.length > 0
  const defaultStoreUrl = storeLinks && storeLinks.length > 0 ? storeLinks[0].url : `https://lista.mercadolivre.com.br/${encodeURIComponent(productName)}`

  // Se o item acabou de ser cadastrado sem cotação, geramos a visualização imediata do Range e do Alvo!
  let chartData: Array<{
    date: string
    fullDate: string
    preco: number | null
    store: string
    url?: string
    isBaseline?: boolean
  }> = []

  if (hasHistory) {
    chartData = history.map((h) => {
      const d = new Date(h.recordedAt)
      const shortDate = `${d.getDate()}/${d.getMonth() + 1}`
      // Associar link da loja se disponível ou link padrão de busca
      const matchedStore = storeLinks?.find((s) => s.storeName.toLowerCase().includes(h.storeName?.toLowerCase() || ''))
      const itemUrl = matchedStore ? matchedStore.url : defaultStoreUrl

      return {
        date: shortDate,
        fullDate: formatDate(h.recordedAt),
        preco: h.price,
        store: h.storeName || 'Loja registrada',
        url: itemUrl,
      }
    })
  } else {
    // Quando não há leituras ainda, criamos a escala de partida baseada no Range e no Alvo!
    chartData = [
      {
        date: 'Início',
        fullDate: 'Aguardando 1ª cotação',
        preco: null,
        store: 'Clique para buscar no ' + (storeLinks?.[0]?.storeName || 'Mercado Livre'),
        url: defaultStoreUrl,
        isBaseline: true,
      },
      {
        date: 'Hoje',
        fullDate: 'Range configurado',
        preco: null,
        store: 'Clique para buscar no ' + (storeLinks?.[1]?.storeName || 'Amazon'),
        url: storeLinks?.[1]?.url || defaultStoreUrl,
        isBaseline: true,
      },
    ]
  }

  // Calcular limites do eixo Y considerando preços registrados e os limites do Range configurado
  const allValues = [
    ...(hasHistory ? history.map((h) => h.price) : []),
    ...(minPriceRange ? [minPriceRange] : []),
    ...(maxPriceRange ? [maxPriceRange] : []),
    ...(targetPrice ? [targetPrice] : []),
  ]

  const minVal = allValues.length > 0 ? Math.min(...allValues) : 1000
  const maxVal = allValues.length > 0 ? Math.max(...allValues) : 2000
  const padding = (maxVal - minVal) * 0.15 || 50
  const yDomainMin = Math.max(0, Math.floor(minVal - padding))
  const yDomainMax = Math.ceil(maxVal + padding)

  return (
    <div className="w-full bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/80 flex flex-col justify-between">
      {/* Legendas de Range e Preço Alvo */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-400 mb-2 gap-2 px-1">
        <span className="font-medium text-neutral-300 flex items-center gap-1">
          Evolução no Gráfico
          <span className="text-[10px] text-blue-400 font-normal">(clique nos pontos para abrir a loja)</span>
        </span>

        <div className="flex items-center gap-2 flex-wrap">
          {minPriceRange && maxPriceRange && (
            <span className="text-blue-400 flex items-center gap-1 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/40">
              <span className="w-2 h-2 rounded-sm bg-blue-500/50"></span>
              Range: {formatCurrency(minPriceRange)} - {formatCurrency(maxPriceRange)}
            </span>
          )}

          {targetPrice && (
            <span className="text-emerald-400 font-medium flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Alvo: {formatCurrency(targetPrice)}
            </span>
          )}
        </div>
      </div>

      <div className="w-full h-44 cursor-pointer" title="Clique no gráfico para ver as ofertas nas lojas">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 12, right: 12, left: -15, bottom: 0 }}
            onClick={({ activeTooltipIndex }) => {
              const point = activeTooltipIndex == null ? undefined : chartData[Number(activeTooltipIndex)]
              window.open(point?.url ?? defaultStoreUrl, '_blank', 'noopener,noreferrer')
            }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#737373"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#737373"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[yDomainMin, yDomainMax]}
              tickFormatter={(v) => `R$${v}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload
                  return (
                    <div className="bg-neutral-900 border border-neutral-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1 z-50">
                      <p className="text-neutral-400">{item.fullDate || item.date}</p>
                      {item.preco !== null ? (
                        <p className="text-blue-400 font-bold text-sm">
                          {formatCurrency(item.preco)}
                        </p>
                      ) : (
                        <p className="text-amber-400 font-medium text-xs">
                          Faixa monitorada ativa
                        </p>
                      )}
                      <p className="text-neutral-300 flex items-center gap-1">
                        <span>{item.store}</span>
                        <ExternalLink className="w-3 h-3 text-blue-400 inline" />
                      </p>
                      <p className="text-[10px] text-blue-400 font-semibold underline">
                        👉 Clique para abrir o produto na loja
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />

            {/* Faixa visual do Range de Preço (ex: 1500 até 2000) */}
            {minPriceRange && maxPriceRange && (
              <ReferenceArea
                y1={minPriceRange}
                y2={maxPriceRange}
                fill="#3b82f6"
                fillOpacity={0.12}
                stroke="#3b82f6"
                strokeOpacity={0.4}
                strokeDasharray="3 3"
                label={{
                  value: `Faixa de Interesse (${formatCurrency(minPriceRange)} - ${formatCurrency(maxPriceRange)})`,
                  position: 'insideTop',
                  fill: '#60a5fa',
                  fontSize: 10,
                }}
              />
            )}

            {/* Linha de Notificação Estrita no Preço Alvo (ex: 1500) */}
            {targetPrice && (
              <ReferenceLine
                y={targetPrice}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: `🎯 Meta: ${formatCurrency(targetPrice)}`,
                  position: 'insideBottomLeft',
                  fill: '#10b981',
                  fontSize: 10,
                }}
              />
            )}

            {hasHistory && (
              <Area
                type="monotone"
                dataKey="preco"
                stroke="#3b82f6"
                strokeWidth={2.5}
                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }}
                fillOpacity={1}
                fill="url(#priceGradient)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {!hasHistory && (
        <div className="mt-2 text-center">
          <a
            href={defaultStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium py-1 px-2.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/50 transition border border-blue-900/50"
          >
            <span>Ver ofertas deste item nas lojas</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  )
}

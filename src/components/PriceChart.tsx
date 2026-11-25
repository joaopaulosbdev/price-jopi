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

interface PriceChartProps {
  history: PriceHistory[]
  targetPrice?: number | null
  minPriceRange?: number | null
  maxPriceRange?: number | null
}

export default function PriceChart({
  history,
  targetPrice,
  minPriceRange,
  maxPriceRange,
}: PriceChartProps) {
  if (!history || history.length === 0) {
    return (
      <div className="h-44 flex flex-col items-center justify-center text-xs text-neutral-400 bg-neutral-900/40 rounded-xl border border-neutral-800 p-4 text-center">
        <span>Nenhum preço registrado ainda.</span>
        <span className="text-neutral-500 text-[11px] mt-1">
          {minPriceRange && maxPriceRange
            ? `Range monitorado: ${formatCurrency(minPriceRange)} até ${formatCurrency(maxPriceRange)}`
            : 'Adicione a primeira cotação no botão abaixo.'}
        </span>
      </div>
    )
  }

  const data = history.map((h) => {
    const d = new Date(h.recordedAt)
    const shortDate = `${d.getDate()}/${d.getMonth() + 1}`
    return {
      rawDate: h.recordedAt,
      date: shortDate,
      fullDate: formatDate(h.recordedAt),
      preco: h.price,
      store: h.storeName || 'Loja não informada',
    }
  })

  // Calcular limites do eixo Y considerando preços registrados e os limites do Range configurado
  const allValues = [
    ...history.map((h) => h.price),
    ...(minPriceRange ? [minPriceRange] : []),
    ...(maxPriceRange ? [maxPriceRange] : []),
    ...(targetPrice ? [targetPrice] : []),
  ]

  const minVal = Math.min(...allValues)
  const maxVal = Math.max(...allValues)
  const padding = (maxVal - minVal) * 0.12 || 40
  const yDomainMin = Math.max(0, Math.floor(minVal - padding))
  const yDomainMax = Math.ceil(maxVal + padding)

  return (
    <div className="w-full bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/80 flex flex-col justify-between">
      {/* Legendas de Range e Preço Alvo */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-400 mb-2 gap-2 px-1">
        <span className="font-medium text-neutral-300">Evolução no Gráfico</span>

        <div className="flex items-center gap-2.5">
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

      <div className="w-full h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
                    <div className="bg-neutral-900 border border-neutral-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                      <p className="text-neutral-400">{item.fullDate || item.date}</p>
                      <p className="text-blue-400 font-bold text-sm">
                        {formatCurrency(item.preco)}
                      </p>
                      <p className="text-neutral-300">Loja: {item.store}</p>
                      {targetPrice && (
                        <p className={`text-[10px] font-semibold ${item.preco <= targetPrice ? 'text-emerald-400' : 'text-neutral-500'}`}>
                          {item.preco <= targetPrice ? '🎯 Preço alvo atingido!' : `Meta: ${formatCurrency(targetPrice)}`}
                        </p>
                      )}
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
                fillOpacity={0.08}
                stroke="#3b82f6"
                strokeOpacity={0.25}
                strokeDasharray="2 2"
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
                  value: `Alvo: R$${targetPrice}`,
                  position: 'insideTopLeft',
                  fill: '#10b981',
                  fontSize: 10,
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="preco"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

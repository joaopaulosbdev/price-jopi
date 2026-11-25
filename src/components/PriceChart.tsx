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
} from 'recharts'
import { PriceHistory } from '@/types/product'
import { formatCurrency, formatDate } from '@/lib/utils'

interface PriceChartProps {
  history: PriceHistory[]
  targetPrice?: number | null
}

export default function PriceChart({ history, targetPrice }: PriceChartProps) {
  if (!history || history.length === 0) {
    return (
      <div className="h-44 flex items-center justify-center text-sm text-neutral-400 bg-neutral-900/40 rounded-xl border border-neutral-800">
        Nenhum dado de histórico registrado
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

  const minPrice = Math.min(...history.map((h) => h.price))
  const maxPrice = Math.max(...history.map((h) => h.price))
  const padding = (maxPrice - minPrice) * 0.15 || 50
  const yDomainMin = Math.max(0, Math.floor(minPrice - padding))
  const yDomainMax = Math.ceil(maxPrice + padding)

  return (
    <div className="w-full h-52 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/80 flex flex-col justify-between">
      <div className="flex items-center justify-between text-xs text-neutral-400 mb-1 px-1">
        <span>Histórico de Evolução</span>
        {targetPrice && (
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Alvo: {formatCurrency(targetPrice)}
          </span>
        )}
      </div>

      <div className="w-full h-40">
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
                    </div>
                  )
                }
                return null
              }}
            />
            {targetPrice && (
              <ReferenceLine
                y={targetPrice}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth={1.5}
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

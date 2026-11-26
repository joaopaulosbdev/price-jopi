import { ExternalLink } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { OfferSearchResult } from '@/types/product'

interface OffersChartProps {
  result?: OfferSearchResult
  target?: number | null
  searching: boolean
  onSearch: () => void
}

export default function OffersChart({ result, target, searching, onSearch }: OffersChartProps) {
  const offers = result?.status === 'ready' || result?.status === 'partial' ? result.offers : []
  const axisMax = Math.max(target ?? 0, ...offers.map(offer => offer.price), 1)

  return (
    <section aria-label="Gráfico de ofertas" className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <h3 className="font-semibold text-neutral-200">Ofertas por menor preço</h3>
        <button
          type="button"
          disabled={searching}
          onClick={onSearch}
          className="text-blue-400 hover:text-blue-300 disabled:text-neutral-400"
        >
          {searching ? 'Buscando ofertas...' : result ? 'Buscar novamente' : 'Buscar ofertas'}
        </button>
      </div>
      {target != null && <p className="mt-2 text-xs text-emerald-400">Alvo {formatCurrency(target)}</p>}
      <div aria-live="polite">
        {result?.status === 'unavailable' && (
          <p className="mt-2 text-xs text-neutral-400">Busca automática indisponível. Use os links das lojas ou tente novamente.</p>
        )}
        {result?.status === 'partial' && (
          <p className="mt-2 text-xs text-amber-300">Busca parcial. Algumas ofertas podem estar faltando.</p>
        )}
        {result && result.status !== 'unavailable' && offers.length === 0 && (
          <p className="mt-2 text-xs text-neutral-400">Nenhuma oferta correspondente na faixa de preço.</p>
        )}
      </div>
      {offers.length > 0 && (
        <ol className="mt-3 max-h-80 space-y-3 overflow-y-auto pr-1">
          {offers.map((offer) => {
            const reachedTarget = target != null && offer.price <= target
            return (
              <li key={offer.url}>
                <a
                  href={offer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded text-xs hover:bg-neutral-800 focus-visible:outline focus-visible:outline-blue-400"
                >
                  <span className="flex items-start justify-between gap-2 text-neutral-100">
                    <span>{offer.title}</span>
                    <span className="flex shrink-0 items-center gap-1 font-semibold">
                      {formatCurrency(offer.price)}
                      <ExternalLink aria-hidden="true" className="h-3 w-3" />
                    </span>
                  </span>
                  <span className="block text-neutral-400">{offer.store}{reachedTarget && ' · Atingiu o alvo'}</span>
                  <span aria-hidden="true" className="relative mt-1 block h-2 rounded-full bg-neutral-800">
                    <span
                      className={`block h-full rounded-full ${reachedTarget ? 'bg-emerald-500' : 'bg-blue-500'}`}
                      style={{ width: `${(offer.price / axisMax) * 100}%` }}
                    />
                    {target != null && target > 0 && (
                      <span className="absolute inset-y-0 w-px bg-white" style={{ left: `${(target / axisMax) * 100}%` }} />
                    )}
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}

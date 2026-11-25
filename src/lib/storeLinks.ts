export interface StoreSearchLink {
  storeName: string
  url: string
  color: string
  badgeText: string
  iconType: 'amazon' | 'mercadolivre' | 'google' | 'buscape' | 'kabum' | 'magalu'
}

/**
 * Gera automaticamente links diretos de busca nas principais lojas e comparadores
 * com base no nome do item e na marca informados pelo usuário.
 */
export function generateStoreLinks(name: string, brand?: string): StoreSearchLink[] {
  const query = `${name} ${brand || ''}`.trim()
  const encodedQuery = encodeURIComponent(query)

  return [
    {
      storeName: 'Mercado Livre',
      url: `https://lista.mercadolivre.com.br/${encodedQuery}`,
      color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20',
      badgeText: 'Mercado Livre',
      iconType: 'mercadolivre',
    },
    {
      storeName: 'Amazon Brasil',
      url: `https://www.amazon.com.br/s?k=${encodedQuery}`,
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
      badgeText: 'Amazon',
      iconType: 'amazon',
    },
    {
      storeName: 'Google Shopping',
      url: `https://www.google.com/search?tbm=shop&q=${encodedQuery}`,
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
      badgeText: 'Google Shopping',
      iconType: 'google',
    },
    {
      storeName: 'Buscapé (Comparador)',
      url: `https://www.buscape.com.br/search?q=${encodedQuery}`,
      color: 'bg-yellow-400/10 text-yellow-300 border-yellow-400/20 hover:bg-yellow-400/20',
      badgeText: 'Buscapé',
      iconType: 'buscape',
    },
    {
      storeName: 'Kabum!',
      url: `https://www.kabum.com.br/busca/${encodedQuery}`,
      color: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20',
      badgeText: 'Kabum',
      iconType: 'kabum',
    },
    {
      storeName: 'Magazine Luiza',
      url: `https://www.magazineluiza.com.br/busca/${encodedQuery}/`,
      color: 'bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20',
      badgeText: 'Magalu',
      iconType: 'magalu',
    },
  ]
}

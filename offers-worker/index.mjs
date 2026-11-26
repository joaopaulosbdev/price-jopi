const shoppingEndpoint = 'https://serpapi.com/search.json'
const shopeeEndpoint = 'https://open-api.affiliate.shopee.com.br/graphql'
const shopeeQuery = `query {
  productOfferV2(keyword: KEYWORD, page: PAGE, limit: 50) {
    nodes { productName productLink priceMin priceMax }
    pageInfo { hasNextPage }
  }
}`

function normalize(text) {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/(\d)\.(?=\d{3}\b)/g, '$1')
    .replace(/[^a-z0-9]+/g, ' ').trim()
}

const genericWords = new Set('a o as os de da das do dos e em com para por no na um uma ar condicionado'.split(' '))

function productKey(title) {
  const words = normalize(title)
    .replace(/\b(?:btu h|btus)\b/g, 'btu')
    .replace(/\b(\d+)\s*(volts?|v|btu)\b/g, (_, number, unit) => `${number}${unit.startsWith('v') ? 'v' : 'btu'}`)
    .split(' ')

  const models = words.filter(word => /^(?=.*[a-z])(?=.*\d)[a-z0-9]{6,}$/.test(word) &&
      !/^\d+(?:btu|watts?|kwh|rpm)$/.test(word))
  if (models.length) {
    const variants = words.filter(word => /^\d+(?:btu|v)$/.test(word) || /^(?:quente|frio|bivolt)$/.test(word))
    return `model:${[...new Set([...models, ...variants])].sort().join(' ')}`
  }

  return words
    .filter(word => !genericWords.has(word))
    .sort().join(' ')
}

export function selectOffers(offers, query, min, max) {
  const normalizedQuery = normalize(query)
  const terms = normalizedQuery.split(' ').filter(word => word && !['de', 'da', 'do', 'e', 'com', 'para'].includes(word))
  if (!terms.length) return []
  const groups = new Set()
  const groupsByKey = new Map()
  for (const offer of offers) {
    if (typeof offer.title !== 'string' || !offer.title.trim() || !Number.isFinite(offer.price) ||
        offer.price <= 0 || offer.price < min || offer.price > max || typeof offer.store !== 'string') continue
    const title = normalize(offer.title)
    const titleWords = title.split(' ')
    if (!terms.every(term => titleWords.includes(term))) continue
    if (/\bar condicionado\b/.test(normalizedQuery) &&
        /^(?:kit (?:para|de) (?:instalacao|limpeza)|controle remoto|placa|suporte|capa|filtro|sensor)\b/.test(title)) continue

    let url
    try { url = new URL(offer.url) } catch { continue }
    if (url.protocol !== 'https:' || url.username || url.password) continue

    const keys = [productKey(offer.title) || title, url.href]
    if (offer.productId) keys.push(offer.productId)
    const matching = new Set(keys.map(key => groupsByKey.get(key)).filter(Boolean))
    const group = { keys: new Set(keys), offer: { title: offer.title, price: offer.price, store: offer.store, url: url.href } }
    for (const previous of matching) {
      groups.delete(previous)
      for (const key of previous.keys) group.keys.add(key)
      if (previous.offer.price < group.offer.price) group.offer = previous.offer
    }
    for (const key of group.keys) groupsByKey.set(key, group)
    groups.add(group)
  }
  return [...groups].map(group => group.offer)
    .sort((a, b) => a.price - b.price || a.title.localeCompare(b.title, 'pt-BR'))
}

async function jsonFrom(url, signal, options) {
  const response = await fetch(url, { ...options, signal })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const data = await response.json()
  if (data.error || data.errors?.length) throw new Error('Falha na fonte de ofertas')
  return data
}

async function googleOffers(query, key, signal) {
  const search = async (parameters) => {
    const url = new URL(shoppingEndpoint)
    url.search = new URLSearchParams({ ...parameters, api_key: key })
    return jsonFrom(url, signal)
  }
  const data = await search({ engine: 'google_shopping', q: query, gl: 'br', hl: 'pt' })
  const results = (data.shopping_results ?? []).slice(0, 40)
  const offers = []
  let partial = (data.shopping_results?.length ?? 0) > results.length
  for (let index = 0; index < results.length; index += 6) {
    const matches = await Promise.allSettled(results.slice(index, index + 6).map(async product => {
      if (!product.immersive_product_page_token) {
        partial = true
        return []
      }
      const details = await search({
        engine: 'google_immersive_product',
        page_token: product.immersive_product_page_token,
      })
      return (details.product_results?.stores ?? []).flatMap(store =>
        store.price?.includes('R$') ? [{
          title: product.title || store.title,
          price: store.extracted_price,
          url: store.link,
          store: store.name,
          productId: product.product_id ? `google:${product.product_id}` : undefined,
        }] : [])
    }))
    for (const match of matches) {
      if (match.status === 'fulfilled') offers.push(...match.value)
      else partial = true
    }
    if (signal.aborted) break
  }
  return { offers, partial }
}

async function shopeeOffers(query, env, signal) {
  const offers = []
  let hasNextPage = true
  for (let page = 1; page <= 3 && hasNextPage; page++) {
    const timestamp = Math.floor(Date.now() / 1000)
    const body = JSON.stringify({
      query: shopeeQuery.replace('PAGE', String(page)).replace('KEYWORD', () => JSON.stringify(query)),
    })
    const signature = await crypto.subtle.digest('SHA-256',
      new TextEncoder().encode(`${env.SHOPEE_APP_ID}${timestamp}${body}${env.SHOPEE_SECRET}`))
    const hex = Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, '0')).join('')
    const data = await jsonFrom(shopeeEndpoint, signal, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `SHA256 Credential=${env.SHOPEE_APP_ID}, Timestamp=${timestamp}, Signature=${hex}`,
      },
      body,
    }).catch(error => {
      if (page === 1) throw error
      return null
    })
    if (!data) return { offers, partial: true }
    const result = data.data.productOfferV2
    hasNextPage = result.pageInfo.hasNextPage
    for (const offer of result.nodes) {
      // Preço mínimo de anúncio com variantes pode pertencer a outro produto.
      if (Number(offer.priceMin) !== Number(offer.priceMax)) continue
      offers.push({ title: offer.productName, price: Number(offer.priceMin), url: offer.productLink, store: 'Shopee' })
    }
  }
  return { offers, partial: hasNextPage }
}

const worker = {
  async fetch(request, env) {
    const origin = request.headers.get('Origin')
    const headers = { Vary: 'Origin' }
    if (origin && origin !== env.SITE_ORIGIN) return new Response(null, { status: 403, headers })
    if (origin) headers['Access-Control-Allow-Origin'] = origin
    const { pathname, searchParams } = new URL(request.url)
    if (request.method !== 'GET' || pathname !== '/offers') return new Response(null, { status: 404, headers })
    const query = searchParams.get('q')?.trim()
    const min = Number(searchParams.get('min') ?? 0)
    const max = searchParams.has('max') ? Number(searchParams.get('max')) : Infinity
    if (!query || query.length > 180 || !Number.isFinite(min) || min < 0 || !(max >= min)) {
      return Response.json({ error: 'Busca inválida.' }, { status: 400, headers })
    }

    const signal = AbortSignal.timeout(9_000)
    const sources = [
      env.SERPAPI_API_KEY ? googleOffers(query, env.SERPAPI_API_KEY, signal) : null,
      env.SHOPEE_APP_ID && env.SHOPEE_SECRET ? shopeeOffers(query, env, signal) : null,
    ]
    const results = await Promise.allSettled(sources)
    const successful = results.flatMap(result => result.status === 'fulfilled' && result.value ? [result.value] : [])
    if (!successful.length) {
      return Response.json({ error: 'Busca de ofertas indisponível.' }, { status: 503, headers })
    }
    const offers = selectOffers(successful.flatMap(result => result.offers), query, min, max)
    return Response.json({ offers, partial: successful.length < sources.length || successful.some(result => result.partial) }, { headers })
  },
}

export default worker

'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Tag,
  TrendingDown,
  BarChart3,
  Layers,
  Sparkles,
  RefreshCw,
  RotateCcw,
  Bell,
  BellRing,
} from 'lucide-react'
import { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'
import NewProductModal from '@/components/NewProductModal'
import UpdatePriceModal from '@/components/UpdatePriceModal'
import EditProductModal from '@/components/EditProductModal'
import { storage } from '@/lib/storage'
import { requestNotificationPermission, sendPriceAlertNotification } from '@/lib/notifications'

export default function PriceMonitorDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  // Modais
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [selectedProductForPrice, setSelectedProductForPrice] = useState<Product | null>(null)
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Carregar produtos
  const loadProducts = () => {
    setLoading(true)
    const list = storage.getProducts()
    setProducts(list)
    setLoading(false)
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadProducts()
      setNotificationsEnabled('Notification' in window && Notification.permission === 'granted')
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission()
    setNotificationsEnabled(granted)
    if (granted) {
      showToast('🔔 Notificações ativadas! Você será avisado quando um item atingir o preço alvo.')
    } else {
      showToast('⚠️ Permissão de notificações não concedida no navegador.')
    }
  }

  // Filtragem e ordenação no cliente
  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
      )
    }

    if (selectedBrand && selectedBrand !== 'all') {
      result = result.filter((p) => p.brand === selectedBrand)
    }

    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory)
    }

    result.sort((a, b) => {
      let valA: string | number
      let valB: string | number

      if (sortBy === 'name') {
        valA = a.name.toLowerCase()
        valB = b.name.toLowerCase()
      } else if (sortBy === 'currentPrice') {
        if (a.currentPrice === null) return b.currentPrice === null ? 0 : 1
        if (b.currentPrice === null) return -1
        valA = a.currentPrice
        valB = b.currentPrice
      } else {
        valA = new Date(a.updatedAt).getTime()
        valB = new Date(b.updatedAt).getTime()
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [products, search, selectedBrand, selectedCategory, sortBy, sortOrder])

  // Lista de marcas únicas
  const brands = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => {
      if (p.brand) set.add(p.brand)
    })
    return Array.from(set).sort()
  }, [products])

  // Lista de categorias únicas
  const categories = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return Array.from(set).sort()
  }, [products])

  // Estatísticas gerais
  const stats = useMemo(() => {
    const total = products.length
    const reachedTargetCount = products.filter(
      (p) => p.targetPrice && p.currentPrice !== null && p.currentPrice <= p.targetPrice
    ).length
    return { total, reachedTargetCount }
  }, [products])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4500)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Deseja realmente remover este item do monitoramento?')) return
    const updated = storage.deleteProduct(id)
    setProducts(updated)
    showToast('Item removido com sucesso!')
  }

  const handleReset = () => {
    if (!confirm('Deseja restaurar a lista inicial com dados de exemplo?')) return
    const defaults = storage.resetDefaults()
    setProducts(defaults)
    showToast('Dados de exemplo restaurados!')
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-blue-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Superior */}
      <header className="border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight text-white flex items-center gap-2">
                PriceTracker <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Auto Links & Alertas</span>
              </h1>
              <p className="text-[11px] text-neutral-400">
                Links automáticos para Mercado Livre, Amazon, Buscapé e alertas de preço alvo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Botão de Notificações */}
            <button
              onClick={handleEnableNotifications}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition ${
                notificationsEnabled
                  ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-400'
                  : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-600'
              }`}
              title="Ativar/Verificar notificações no navegador"
            >
              {notificationsEnabled ? (
                <>
                  <BellRing className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Alertas Ativos</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5" />
                  <span>Ativar Alertas</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/80 rounded-xl transition"
              title="Restaurar dados padrão de exemplo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-blue-500/25 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Item</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Banner Informativo dos Links Automáticos */}
        <div className="p-4 bg-gradient-to-r from-blue-950/40 via-neutral-900/60 to-purple-950/30 border border-blue-900/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-300">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
              ⚡
            </span>
            <span>
              <strong>Links automáticos ativos:</strong> Você não precisa colar links de produtos! Cadastre apenas o <strong>nome</strong> e a <strong>marca</strong>, e o site gera links diretos para <strong>Mercado Livre, Amazon, Google Shopping, Buscapé e Kabum</strong>.
            </span>
          </div>
          {!notificationsEnabled && (
            <button
              onClick={handleEnableNotifications}
              className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition"
            >
              Permitir Alertas Sonoros
            </button>
          )}
        </div>

        {/* Painel de Métricas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-neutral-900/50 border border-neutral-800/80 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-neutral-800/80 rounded-xl text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-neutral-400 block font-medium">Itens Monitorados</span>
              <span className="text-xl font-bold text-white">{stats.total} produtos</span>
            </div>
          </div>

          <div className="p-4 bg-neutral-900/50 border border-neutral-800/80 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-neutral-800/80 rounded-xl text-emerald-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-neutral-400 block font-medium">Atingiram a Meta / Alvo</span>
              <span className="text-xl font-bold text-emerald-400">{stats.reachedTargetCount} no preço ideal</span>
            </div>
          </div>

          <div className="p-4 bg-neutral-900/50 border border-neutral-800/80 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-neutral-800/80 rounded-xl text-purple-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-neutral-400 block font-medium">Marcas Acompanhadas</span>
              <span className="text-xl font-bold text-white">
                {brands.length} {brands.length === 1 ? 'marca' : 'marcas'}
              </span>
            </div>
          </div>
        </div>

        {/* Barra de Filtros e Pesquisa */}
        <div className="p-4 bg-neutral-900/70 border border-neutral-800 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Campo de Busca por Nome / Modelo */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por palavras-chave (ex: Sony, PS5, Monitor, Apple)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Filtros em Linha: Marca, Categoria e Ordenação */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filtro por Marca */}
            <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1">
              <Tag className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-transparent text-xs text-neutral-200 focus:outline-none py-1 cursor-pointer"
              >
                <option value="all">Todas as marcas</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Categoria */}
            {categories.length > 0 && (
              <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1">
                <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-xs text-neutral-200 focus:outline-none py-1 cursor-pointer"
                >
                  <option value="all">Todas as categorias</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Ordenação */}
            <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-neutral-200 focus:outline-none py-1 cursor-pointer"
              >
                <option value="updatedAt">Recentes</option>
                <option value="currentPrice">Preço</option>
                <option value="name">Nome (A-Z)</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="text-xs text-neutral-400 hover:text-white px-1 font-semibold"
                title={`Mudar para ordem ${sortOrder === 'asc' ? 'Decrescente' : 'Crescente'}`}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            {/* Atualizar */}
            <button
              onClick={loadProducts}
              className="p-2 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white rounded-xl transition"
              title="Recarregar"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Grade de Produtos */}
        {loading ? (
          <div className="py-20 text-center text-neutral-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
            <p>Carregando itens monitorados...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-neutral-900/30 border border-neutral-800 rounded-2xl">
            <Layers className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-neutral-300">
              Nenhum item encontrado
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Nenhum produto corresponde aos filtros aplicados ou sua lista está vazia.
            </p>
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition"
            >
              Cadastrar Primeiro Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddPrice={(prod) => setSelectedProductForPrice(prod)}
                onEdit={(prod) => setSelectedProductForEdit(prod)}
                onDelete={handleDelete}
                onOffersUpdated={(searched, offerSearch) => {
                  const current = storage.getProducts().find(product => product.id === searched.id)
                  if (current && current.name === searched.name && current.brand === searched.brand &&
                    current.minPriceRange === searched.minPriceRange && current.maxPriceRange === searched.maxPriceRange) {
                    setProducts(storage.updateProduct(searched.id, { offerSearch }))
                  }
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modais */}
      <NewProductModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={() => {
          loadProducts()
          showToast('Novo item cadastrado!')
        }}
        existingBrands={brands}
      />

      <UpdatePriceModal
        product={selectedProductForPrice}
        isOpen={!!selectedProductForPrice}
        onClose={() => setSelectedProductForPrice(null)}
        onSuccess={(hitTarget) => {
          loadProducts()
          if (hitTarget && selectedProductForPrice && selectedProductForPrice.currentPrice !== null) {
            sendPriceAlertNotification(
              selectedProductForPrice.name,
              selectedProductForPrice.brand || 'Sem marca',
              selectedProductForPrice.currentPrice,
              selectedProductForPrice.targetPrice || 0
            )
            showToast('🎯 ALERTA: O item atingiu o seu Preço Alvo! Notificação disparada.')
          } else {
            showToast('Nova cotação registrada no histórico!')
          }
        }}
      />

      {selectedProductForEdit && (
        <EditProductModal
          key={selectedProductForEdit.id}
          product={selectedProductForEdit}
          onClose={() => setSelectedProductForEdit(null)}
          onSuccess={() => {
            loadProducts()
            showToast('Item atualizado com sucesso!')
          }}
          existingBrands={brands}
        />
      )}
    </div>
  )
}

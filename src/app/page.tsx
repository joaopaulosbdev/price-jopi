import PriceMonitorDashboard from '@/components/PriceMonitorDashboard'

export const metadata = {
  title: 'PriceTracker - Monitor de Preços por Nome e Marca',
  description: 'Monitore preços de produtos por nome e marca, histórico de valores e alertas.',
}

export default function Home() {
  return <PriceMonitorDashboard />
}

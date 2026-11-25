/**
 * Utilitário de Notificações do Navegador (Web Notification API) e Áudio
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

export function playAlertSound() {
  try {
    if (typeof window === 'undefined') return
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15) // A5

    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.4)
  } catch (e) {
    // Audio pode ser bloqueado antes de interação do usuário
  }
}

export function sendPriceAlertNotification(productName: string, brand: string, price: number, targetPrice: number) {
  playAlertSound()

  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    const title = `🎯 Preço Alvo Atingido: ${brand}!`
    const options = {
      body: `O item "${productName}" atingiu R$ ${price.toFixed(2)} (Meta: R$ ${targetPrice.toFixed(2)})!`,
      icon: '/favicon.ico',
      tag: `price-alert-${productName}`,
    }

    try {
      new Notification(title, options)
    } catch (err) {
      console.warn('Erro ao disparar notificação do navegador:', err)
    }
  }
}

import { useUserStore } from '@/stores/userStore.js';

export function formatMoney(amount, currency, showFractional = null) {
  if (showFractional === null) {
    const userStore = useUserStore()
    showFractional = userStore.user.settings.show_fractional ?? false;
  }

  const formatter = new Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: currency ?? 'USD',
    minimumFractionDigits: showFractional ? 2 : 0,
  })
  return formatter.format(amount)
}
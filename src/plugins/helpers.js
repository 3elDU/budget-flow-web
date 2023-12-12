import { useUserStore } from '@/stores/userStore.js';
import { format, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

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

/**
 * @param date {String}
 * @returns {Date}
 */
export function parseDate(date) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const iso = parseISO(date);

  return utcToZonedTime(iso, tz);
}

/**
 * @param date {Date}
 * @returns {string}
 */
export function formatDate(date) {
  return format(date, 'dd.MM.yyyy HH:mm');
}
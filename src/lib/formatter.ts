
/**
 * Format number to Indonesian Rupiah
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number to US Dollar
 */
export function formatDollar(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date to Indonesian format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Format date to short format (DD/MM/YYYY)
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Convert amount from IDR to USD using the given exchange rate
 */
export function convertIDRtoUSD(amountIDR: number, exchangeRate: number): number {
  return amountIDR / exchangeRate;
}

/**
 * Convert amount from USD to IDR using the given exchange rate
 */
export function convertUSDtoIDR(amountUSD: number, exchangeRate: number): number {
  return amountUSD * exchangeRate;
}

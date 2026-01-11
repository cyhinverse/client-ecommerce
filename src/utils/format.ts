/**
 * Format Utilities
 * Centralized formatting functions for consistent display
 */

/**
 * Format number as Vietnamese currency
 * @param value - Number to format
 * @returns Formatted currency string with ₫ symbol
 * @example formatCurrency(1000000) => "₫1.000.000"
 */
export function formatCurrency(value: number): string {
  return `₫${value.toLocaleString('vi-VN')}`;
}

/**
 * Format currency range
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Formatted range string
 * @example formatCurrencyRange(100000, 200000) => "₫100.000 - ₫200.000"
 */
export function formatCurrencyRange(min: number, max: number): string {
  if (min === max) return formatCurrency(min);
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
}

/**
 * Format number without currency symbol
 * @param value - Number to format
 * @returns Formatted number string
 * @example formatNumber(1000000) => "1.000.000"
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('vi-VN');
}

/**
 * Format date to Vietnamese locale
 * @param date - Date string or Date object
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }
): string {
  return new Date(date).toLocaleDateString('vi-VN', options);
}

/**
 * Format datetime to Vietnamese locale
 * @param date - Date string or Date object
 * @returns Formatted datetime string
 */
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative time (e.g., "2 giờ trước")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;
  if (diffDay < 7) return `${diffDay} ngày trước`;
  
  return formatDate(date);
}

/**
 * Format percentage
 * @param value - Number to format (0-100)
 * @returns Formatted percentage string
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`;
}

/**
 * Format discount percentage
 * @param original - Original price
 * @param discounted - Discounted price
 * @returns Discount percentage string
 */
export function formatDiscount(original: number, discounted: number): string {
  if (original <= 0) return '0%';
  const discount = ((original - discounted) / original) * 100;
  return `-${discount.toFixed(0)}%`;
}

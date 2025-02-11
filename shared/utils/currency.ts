/**
 * Format a number as CNY currency
 * @param amount The amount to format
 * @param minimumFractionDigits Minimum number of decimal places (default: 2)
 * @param maximumFractionDigits Maximum number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2
): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)
}

/**
 * Format a number as CNY without currency symbol
 * @param amount The amount to format
 * @returns Formatted number string
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Calculate percentage and format it
 * @param value The value to calculate percentage for
 * @param total The total value
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%'
  const percentage = (value / total) * 100
  return `${percentage.toFixed(1)}%`
}

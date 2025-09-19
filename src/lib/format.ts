export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  })
  return formatter.format(typeof date === 'string' ? new Date(date) : date)
}

export function formatTime(date: string | Date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
  return formatter.format(typeof date === 'string' ? new Date(date) : date)
}

export function formatCurrency(amount: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

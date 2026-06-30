const formatter = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR',
})

export function formatCurrency(value: number): string {
  return formatter.format(value)
}

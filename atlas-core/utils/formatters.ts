export function formatMoney(value: number): string {
  return `AED ${new Intl.NumberFormat("en-AE").format(value)}`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatDays(value: number): string {
  return `${value} Days`;
}

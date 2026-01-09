export type MoneyFormatOptions = {
  maximumFractionDigits?: number;
};

export function formatMoney(amount: number, currency: string, options: MoneyFormatOptions = {}) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
  }).format(amount);
}

export function getCurrencySymbol(currency: string) {
  const parts = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).formatToParts(0);

  const symbol = parts.find((p) => p.type === 'currency')?.value;
  return symbol ?? currency;
}

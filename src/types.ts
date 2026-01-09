export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  description: string;
  date: string;
}

export interface Wallet {
  id: string;
  name: string;
  icon: string;
  balance: number;
  color: string;
}

export const WALLET_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f43f5e', // rose
  '#14b8a6', // teal
];

export type View = 'dashboard' | 'wallet';

export type ThemeMode = 'dark' | 'light';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';

